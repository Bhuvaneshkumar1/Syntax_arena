/**
 * SyntaxArena CyberDrill: Production Outage Incident Scenarios Catalog
 * 8 High-Stakes SRE & Incident Response Scenarios covering memory leaks, deadlocks,
 * buffer overflows, connection exhaustion, ReDoS, and event-loop lockups.
 * Schema: docs/ARCHITECTURE.md, docs/QUESTION_SCHEMA.md
 */

export const INCIDENT_SCENARIOS = [
  {
    id: 'inc_memory_leak',
    title: 'The Memory Sink Outage',
    severity: 'SEV-1',
    system: 'User Analytics & Ingestion Pipeline',
    service: 'analytics-worker-v3',
    language: 'python',
    badgeClass: 'badge-coral',
    slaSeconds: 180, // 3 Minutes
    lore: 'At 03:14 UTC, the analytics ingestion workers began failing health checks. Pods are getting OOM-killed (Exit Code 137) every 90 seconds. Ingestion backlog has accumulated 4.2 million events.',
    initialMetrics: {
      cpu: 96.5,
      ram: 98.2,
      ramDisplay: '7.85 / 8.0 GB',
      errorRate: 88.4,
      latencyMs: 3120,
      activeConnections: 14200
    },
    stabilizedMetrics: {
      cpu: 14.2,
      ram: 22.8,
      ramDisplay: '1.82 / 8.0 GB',
      errorRate: 0.01,
      latencyMs: 38,
      activeConnections: 1200
    },
    logs: [
      '[03:11:45.100] [INFO] [analytics-worker-04] Initializing Kafka consumer group: cgrp-analytics-v3',
      '[03:11:47.304] [INFO] [analytics-worker-04] Assigned partitions: [partition-0, partition-1, partition-2]',
      '[03:12:01.402] [INFO] [analytics-worker-04] Batch ingestion started for partition #14 (offset: 8912401)',
      '[03:12:15.912] [DEBUG] [memory_watchdog] Heap usage at 42.1% (3.37 GB / 8.00 GB)',
      '[03:12:30.405] [DEBUG] [cache_manager] Module cache size: 142,000 entries across 12 tenant sessions',
      '[03:12:44.119] [WARN] [analytics-worker-04] Garbage collector gen 2 cycle took 840ms (> 200ms threshold)',
      '[03:12:55.002] [WARN] [metrics] Ingestion queue latency spiked to 1,240ms',
      '[03:13:10.822] [WARN] [memory_watchdog] Heap usage at 87.4% (6.99 GB / 8.00 GB) - CRITICAL THRESHOLD',
      '[03:13:22.109] [WARN] [cgroup] Memory cgroup memory.usage_in_bytes reaching memory.limit_in_bytes (8589934592)',
      '[03:13:35.811] [ERROR] [analytics-worker-04] Failed to allocate PyList buffer for incoming payload batch',
      '[03:13:42.503] [ERROR] [kernel] Low memory warning: page allocation failure: order:4, mode:0x40cc0',
      '[03:13:58.204] [ERROR] [analytics-worker-04] Traceback (most recent call last):',
      '[03:13:58.205] [ERROR] [analytics-worker-04]   File "/app/pipeline/ingest.py", line 42, in process_event_batch',
      '[03:13:58.206] [ERROR] [analytics-worker-04]     _GLOBAL_CACHE[session_id].append(raw_event_payload)',
      '[03:13:58.207] [ERROR] [analytics-worker-04] MemoryError: Out of memory allocation failed (cannot allocate 64MB block)',
      '[03:14:00.110] [ALERT] [kubelet] Killing container analytics-worker-04: memory cgroup limit exceeded',
      '[03:14:02.001] [FATAL] [kubelet] Pod analytics-worker-04 terminated with signal SIGKILL (OOMKilled - Exit 137)',
      '[03:14:05.302] [INFO] [replicaset] Creating replacement pod analytics-worker-05',
      '[03:14:15.901] [WARN] [gateway] 502 Bad Gateway: upstream worker unreachable on port 8080'
    ],
    diagnosisQuestion: {
      id: 'inc_q_mem_diag',
      type: 'multiple_choice',
      prompt: 'Examining the stack trace in pipeline/ingest.py:42 and memory velocity, what architectural defect causes the crash loop?',
      options: [
        'The database connection pool has exhausted its maximum TCP socket capacity.',
        'Python 3.10 garbage collection was explicitly disabled in the systemd service config.',
        '_GLOBAL_CACHE is appending raw payloads indefinitely without TTL or eviction, causing an unbounded heap leak.',
        'The Kafka partition reader attempted to read a single byte payload larger than 8GB.'
      ],
      correctAnswer: 2,
      explanation: 'Lines 41-42 append raw event payloads into a module-level global dictionary `_GLOBAL_CACHE[session_id]` with no TTL, size ceiling, or LRU eviction policy. Module-level globals persist in Python for the lifetime of the worker, continuously growing until the OS cgroup kills the container with OOMKilled (Exit Code 137).'
    },
    patchQuestion: {
      id: 'inc_q_mem_patch',
      type: 'multiple_choice',
      prompt: 'Select the optimal zero-downtime hotfix patch to permanently stabilize heap consumption:',
      options: [
        'Wrap the append call in a try/except MemoryError block and silently pass.',
        'Replace unbounded global list with a bounded LRUCache(maxsize=10_000) or streaming disk/Redis buffer.',
        'Call gc.collect() manually inside the event ingestion loop after every single item.',
        'Double the Kubernetes deployment pod memory limit from 8GB to 16GB in values.yaml.'
      ],
      correctAnswer: 1,
      explanation: 'Replacing the unbounded list accumulator with a bounded LRU cache / sliding window buffer (`functools.lru_cache` or a Redis/disk-backed queue) guarantees heap usage cannot exceed predictable operational thresholds. Doubling RAM only postpones OOM by minutes, while manual `gc.collect()` causes 80% CPU degradation without freeing reachable references.'
    }
  },
  {
    id: 'inc_mutex_deadlock',
    title: 'The Mutex Deadlock Cascade',
    severity: 'SEV-1',
    system: 'Global Payment & Ledger Service',
    service: 'ledger-router-worker',
    language: 'go',
    badgeClass: 'badge-coral',
    slaSeconds: 180, // 3 Minutes
    lore: 'At 14:02 UTC, 100% of payment authorization webhooks stalled simultaneously. HTTP goroutines exploded from 120 to over 48,000. All worker threads are blocked indefinitely.',
    initialMetrics: {
      cpu: 18.0,
      ram: 84.5,
      ramDisplay: '6.76 / 8.0 GB',
      errorRate: 99.4,
      latencyMs: 30000,
      activeConnections: 48200
    },
    stabilizedMetrics: {
      cpu: 28.5,
      ram: 18.2,
      ramDisplay: '1.45 / 8.0 GB',
      errorRate: 0.0,
      latencyMs: 62,
      activeConnections: 850
    },
    logs: [
      '[14:01:45.001] [INFO] [ledger] Payment gateway listening on :8443 (HTTP/2 TLS enabled)',
      '[14:01:50.110] [INFO] [ledger] Processing batch transfers: 1,400 concurrent settlement transactions',
      '[14:01:52.012] [INFO] [ledger] Transfer txn_9812: Account A -> Account B ($450.00 USD)',
      '[14:01:52.013] [INFO] [ledger] Transfer txn_9813: Account B -> Account A ($120.00 USD)',
      '[14:01:52.014] [DEBUG] [ledger] txn_9812: acquired lock for Account A (lock_id=0xaa01), awaiting lock for Account B...',
      '[14:01:52.015] [DEBUG] [ledger] txn_9813: acquired lock for Account B (lock_id=0xbb02), awaiting lock for Account A...',
      '[14:02:05.100] [WARN] [http_pool] Inflight HTTP request queue reaching saturation (5,000 pending requests)',
      '[14:02:15.901] [WARN] [http_pool] Inflight HTTP request queue full (10,000 requests pending, dropping new arrivals)',
      '[14:02:22.404] [ERROR] [goroutine_monitor] Goroutine count surged: 124 -> 48,211 active goroutines',
      '[14:02:30.002] [ERROR] [goroutine_monitor] 48,211 goroutines in state `sync.Mutex.Lock` wait > 30s',
      '[14:02:40.810] [ALERT] [healthcheck] GET /healthz failed: context deadline exceeded (client timeout 5000ms)',
      '[14:02:45.109] [FATAL] [kubelet] Liveness probe timeout for ledger-router-worker: container restarting'
    ],
    diagnosisQuestion: {
      id: 'inc_q_deadlock_diag',
      type: 'multiple_choice',
      prompt: 'Analyze the lock acquisition sequence between txn_9812 and txn_9813. What concurrency bug caused this outage?',
      options: [
        'A circular wait deadlock caused by acquiring multiple shared locks in inconsistent, arbitrary order.',
        'A goroutine stack overflow triggered by infinite mutual recursion.',
        'Channel starvation caused by an unbuffered channel lacking a dedicated reader goroutine.',
        'Memory tearing caused by non-atomic 64-bit integer writes across CPU cores.'
      ],
      correctAnswer: 0,
      explanation: 'Classic circular wait deadlock (Coffman condition): Transaction 1 locks Account A and waits for Account B, while Transaction 2 locks Account B and waits for Account A. Neither can progress or release its lock, permanently freezing both goroutines and exhausting the worker pool.'
    },
    patchQuestion: {
      id: 'inc_q_deadlock_patch',
      type: 'multiple_choice',
      prompt: 'Which synchronization pattern permanently eliminates circular lock acquisition deadlocks in Go transfers?',
      options: [
        'Replace sync.Mutex with sync.RWMutex and acquire read locks on both accounts.',
        'Insert time.Sleep(10 * time.Millisecond) between the two lock statements.',
        'Launch each lock operation in its own detached go func() without synchronization.',
        'Enforce canonical lock ordering by sorting account IDs (e.g., lock min(idA, idB) first, then max(idA, idB)).'
      ],
      correctAnswer: 3,
      explanation: 'Enforcing a strict canonical order for acquiring locks (such as always locking the numerically or alphabetically smaller account ID first: `first, second := sort(fromID, toID); first.Lock(); second.Lock()`) mathematically breaks the circular wait condition, making deadlocks impossible.'
    }
  },
  {
    id: 'inc_buffer_overflow',
    title: 'The Stack Smashing Gateway Panic',
    severity: 'SEV-1',
    system: 'Edge Reverse Proxy & Auth Gateway',
    service: 'auth-proxy-daemon',
    language: 'c',
    badgeClass: 'badge-coral',
    slaSeconds: 180, // 3 Minutes
    lore: 'At 21:40 UTC, the edge reverse proxy crashed violently with a SIGABRT signal. Core dumps report stack canary corruption immediately after parsing authorization headers.',
    initialMetrics: {
      cpu: 99.0,
      ram: 45.0,
      ramDisplay: '3.60 / 8.0 GB',
      errorRate: 100.0,
      latencyMs: 0,
      activeConnections: 0
    },
    stabilizedMetrics: {
      cpu: 18.0,
      ram: 14.5,
      ramDisplay: '1.16 / 8.0 GB',
      errorRate: 0.05,
      latencyMs: 12,
      activeConnections: 1800
    },
    logs: [
      '[21:39:40.100] [INFO] [proxy] Edge gateway listening on 0.0.0.0:443 (workers: 8)',
      '[21:39:52.401] [INFO] [auth] Received HTTP POST /api/v1/auth/exchange from 198.51.100.24',
      '[21:39:58.201] [INFO] [auth] Received HTTP POST /api/v1/auth/exchange (Content-Length: 1048)',
      '[21:39:58.202] [DEBUG] [auth] Extracting Bearer token header into fixed buffer char token[256]...',
      '[21:39:58.203] [CRITICAL] [glibc] *** stack smashing detected ***: terminated',
      '[21:39:58.204] [FATAL] [kernel] Traps: auth-proxy-daemon[4201] general protection fault ip:0x7f8842 sp:0x7ffcb4',
      '[21:40:02.100] [ERROR] [systemd] auth-proxy-daemon.service: Main process exited, code=dumped, status=6/ABRT',
      '[21:40:02.101] [ALERT] [watchdog] Zero healthy upstream authentication nodes available in pool.',
      '[21:40:05.409] [WARN] [systemd] Restarting service auth-proxy-daemon.service (attempt 1/5)'
    ],
    diagnosisQuestion: {
      id: 'inc_q_bof_diag',
      type: 'multiple_choice',
      prompt: 'Examining the glibc message "*** stack smashing detected ***", which unsafe C operation triggered this crash?',
      options: [
        'malloc() returned NULL because physical virtual memory was exhausted.',
        'strcpy() or sprintf() copied an unbounded header string into a fixed stack array without bounds checking.',
        'free() was invoked twice on the same memory pointer (double free error).',
        'qsort() was called with an inconsistent comparison function.'
      ],
      correctAnswer: 1,
      explanation: 'Stack smashing detection (GCC `-fstack-protector`) aborts execution when a canary word placed on the stack before the function return address is overwritten. An unbounded string copy like `strcpy(token_buf, header_str)` copies more bytes than the 256-byte stack array allocated, overflowing into the canary.'
    },
    patchQuestion: {
      id: 'inc_q_bof_patch',
      type: 'multiple_choice',
      prompt: 'Select the standard secure C remediation to replace the vulnerable stack copy:',
      options: [
        'Compile the binary with -fno-stack-protector to bypass canary verification.',
        'Use strncpy(dest, src, sizeof(dest) - 1) and guarantee null-termination: dest[sizeof(dest) - 1] = \'\\0\'.',
        'Increase stack buffer size from char token[256] to char token[65536].',
        'Cast header_str to (void*) before calling strcpy.'
      ],
      correctAnswer: 1,
      explanation: 'Safe bounded copying functions (`strncpy`, `snprintf(dest, sizeof(dest), "%s", src)`) prevent buffer overruns by strictly capping write operations to the size of the destination buffer minus 1, followed by explicit null-byte termination.'
    }
  },
  {
    id: 'inc_connection_exhaustion',
    title: 'Connection Pool Starvation',
    severity: 'SEV-2',
    system: 'E-Commerce Checkout Core',
    service: 'checkout-api-backend',
    language: 'sql',
    badgeClass: 'badge-amber',
    slaSeconds: 180, // 3 Minutes
    lore: 'Shoppers report that the checkout payment button spins indefinitely. Database CPU is only at 6%, but all backend application instances have exhausted their 100-connection database pools.',
    initialMetrics: {
      cpu: 8.5,
      ram: 54.0,
      ramDisplay: '4.32 / 8.0 GB',
      errorRate: 74.2,
      latencyMs: 15400,
      activeConnections: 800
    },
    stabilizedMetrics: {
      cpu: 22.0,
      ram: 31.0,
      ramDisplay: '2.48 / 8.0 GB',
      errorRate: 0.0,
      latencyMs: 45,
      activeConnections: 45
    },
    logs: [
      '[11:02:01.002] [INFO] [checkout] Checkout worker node 2 active. DB Pool Size: 100/100',
      '[11:02:10.119] [INFO] [checkout] Processing order ord_4910: starting transaction (leased conn #84)',
      '[11:02:10.420] [WARN] [payment_gateway] External card network returned HTTP 504 Gateway Timeout',
      '[11:02:10.421] [ERROR] [checkout] Exception raised during card charge; returning 500 to user',
      '[11:02:15.809] [WARN] [db_pool] Leased connection #84 not returned after 5000ms',
      '[11:02:30.901] [WARN] [db_pool] Pool checkout wait time exceeded 10,000ms (Active: 100/100, Idle: 0)',
      '[11:02:35.002] [ERROR] [checkout] TimeoutException: Connection not available in pool within specified timeout (10000ms)',
      '[11:02:40.110] [FATAL] [ingress] 503 Service Unavailable: upstream connection pool exhausted'
    ],
    diagnosisQuestion: {
      id: 'inc_q_pool_diag',
      type: 'multiple_choice',
      prompt: 'The database server is idling at 6% CPU, yet client connections remain 100% leased. What code bug caused this leak?',
      options: [
        'The database connection is not closed/released inside a finally block or context manager when an exception occurs.',
        'The database WAL transaction log disk partition reached 100% capacity.',
        'The SQL query is missing a composite index on order_id and user_id.',
        'The connection pool size of 100 is too small for standard HTTP traffic.'
      ],
      correctAnswer: 0,
      explanation: 'When an exception (such as a 504 timeout from an external card gateway) aborts execution before an explicit `conn.close()` line is reached, the connection remains leased forever unless wrapped in a `try...finally` block, context manager (`with`), or Go `defer` statement.'
    },
    patchQuestion: {
      id: 'inc_q_pool_patch',
      type: 'multiple_choice',
      prompt: 'Select the correct architectural fix to guarantee database connection release under all execution branches:',
      options: [
        'Increase max_connections on the PostgreSQL server from 100 to 50,000.',
        'Catch all exceptions and silently suppress them so execution reaches conn.close().',
        'Enclose the connection lease in a try-with-resources / with context manager to guarantee release even on unhandled exceptions.',
        'Disable timeouts on the external payment gateway.'
      ],
      correctAnswer: 2,
      explanation: 'Using RAII / auto-closable idioms (`with pool.acquire() as conn:`, `try (Connection c = pool.getConnection())`, or `defer conn.Close()`) guarantees the leased connection is returned to the pool regardless of whether the function returns normally or throws an exception.'
    }
  },
  {
    id: 'inc_redos_backtracking',
    title: 'ReDoS Catastrophic Backtracking',
    severity: 'SEV-1',
    system: 'User Signup & Email Validation Service',
    service: 'auth-validator-node',
    language: 'javascript',
    badgeClass: 'badge-coral',
    slaSeconds: 180, // 3 Minutes
    lore: 'CPU on all Node.js cluster nodes pinned at 100%. Node event loop lag surged to 42,000ms. All health checks are timing out because the single JavaScript event loop thread is frozen.',
    initialMetrics: {
      cpu: 100.0,
      ram: 68.0,
      ramDisplay: '5.44 / 8.0 GB',
      errorRate: 94.6,
      latencyMs: 42000,
      activeConnections: 12400
    },
    stabilizedMetrics: {
      cpu: 16.0,
      ram: 24.0,
      ramDisplay: '1.92 / 8.0 GB',
      errorRate: 0.02,
      latencyMs: 18,
      activeConnections: 640
    },
    logs: [
      '[18:13:50.001] [INFO] [cluster] Node cluster primary spawned 4 worker threads',
      '[18:14:02.104] [INFO] [server] POST /api/v1/validate-email received payload size: 84 bytes',
      '[18:14:02.105] [DEBUG] [validator] Executing regex test: /^([a-zA-Z0-9]+)+$/ on input "aaaaaaaaaaaaaaaaaaaaaaaaaaaaa!"',
      '[18:14:05.801] [WARN] [event_loop] Event loop lag: 3,420ms (Threshold: 100ms)',
      '[18:14:15.002] [WARN] [event_loop] Event loop lag: 12,898ms (Threshold: 100ms)',
      '[18:14:30.401] [ERROR] [event_loop] Event loop completely blocked. 3,892 timer callbacks delayed.',
      '[18:14:40.119] [ALERT] [kubelet] Liveness probe failed: HTTP GET /healthz connection refused',
      '[18:14:45.001] [FATAL] [k8s] Liveness probe failed 3 times consecutive. Pod killed.'
    ],
    diagnosisQuestion: {
      id: 'inc_q_redos_diag',
      type: 'multiple_choice',
      prompt: 'What structural regular expression pattern characteristic causes Catastrophic Backtracking (ReDoS) on unmatched inputs?',
      options: [
        'Using negative lookahead assertions (?!) without capturing groups.',
        'Compiling regular expressions inside a loop instead of reusing a module constant.',
        'Nested overlapping quantifiers like (a+)+ evaluated against a string that fails near the end.',
        'Using the global flag /g without resetting lastIndex between calls.'
      ],
      correctAnswer: 2,
      explanation: 'Regular expression engines using Nondeterministic Finite Automata (NFA) exhibit catastrophic $O(2^n)$ exponential backtracking when matching nested quantifiers (e.g. `^([a-zA-Z0-9]+)+$`). When an input string fails at the final character, the engine explores billions of recursive permutation branches, pegging CPU at 100%.'
    },
    patchQuestion: {
      id: 'inc_q_redos_patch',
      type: 'multiple_choice',
      prompt: 'Select the production remediation to neutralize the ReDoS vulnerability on the validation endpoint:',
      options: [
        'Replace nested quantifier regex with a linear-time DFA parser, or atomic groups / non-overlapping simple token split.',
        'Run the regex inside a while(true) loop with a 50ms setTimeout.',
        'Increase Node.js --max-old-space-size to 8192 MB.',
        'Disable the Kubernetes liveness probe so the pod is never restarted.'
      ],
      correctAnswer: 0,
      explanation: 'Neutralizing ReDoS requires eliminating overlapping nested quantifiers in favor of strictly linear-time validation ($O(n)$) or delegating to an email parser library that operates without exponential backtracking NFAs.'
    }
  },
  {
    id: 'inc_dangling_pointer',
    title: 'Dangling Pointer Heap Corruption',
    severity: 'SEV-1',
    system: 'High-Frequency Market Data Engine',
    service: 'orderbook-feed-engine',
    language: 'cpp',
    badgeClass: 'badge-coral',
    slaSeconds: 180, // 3 Minutes
    lore: 'Market data feed handlers are crashing sporadically during heavy volatility. Valgrind and ASan report Use-After-Free heap corruption in orderbook depth buffers.',
    initialMetrics: {
      cpu: 75.0,
      ram: 82.0,
      ramDisplay: '6.56 / 8.0 GB',
      errorRate: 91.2,
      latencyMs: 18000,
      activeConnections: 9200
    },
    stabilizedMetrics: {
      cpu: 24.0,
      ram: 19.5,
      ramDisplay: '1.56 / 8.0 GB',
      errorRate: 0.0,
      latencyMs: 8,
      activeConnections: 540
    },
    logs: [
      '[08:30:00.001] [INFO] [feed] Initializing orderbook memory arena (size: 4GB)',
      '[08:30:01.002] [INFO] [feed] Connected to Nasdaq ITCH 5.0 Multicast feed',
      '[08:30:14.204] [DEBUG] [orderbook] Cancel order #884912: executing delete order_ptr',
      '[08:30:14.205] [DEBUG] [orderbook] Order ptr 0x55a8f0 freed back to heap arena',
      '[08:30:14.208] [CRITICAL] [asan] AddressSanitizer: heap-use-after-free on address 0x55a8f0',
      '[08:30:14.209] [CRITICAL] [asan] READ of size 8 at 0x55a8f0 thread T0 (orderbook_worker)',
      '[08:30:14.210] [FATAL] [kernel] Process terminated with SIGSEGV (Segmentation Fault)',
      '[08:30:15.801] [WARN] [cluster] Fast restart triggered for orderbook-feed-engine'
    ],
    diagnosisQuestion: {
      id: 'inc_q_cpp_diag',
      type: 'multiple_choice',
      prompt: 'Why did dereferencing address 0x55a8f0 crash the application after the order was canceled?',
      options: [
        'The struct memory was not aligned to a 64-byte CPU cache line boundary.',
        'A raw pointer was retained and accessed after delete freed the underlying heap memory (Dangling Pointer / Use-After-Free).',
        'The compiler failed to inline the virtual destructor.',
        'The thread attempted to lock an uninitialized spinlock.'
      ],
      correctAnswer: 1,
      explanation: 'When raw memory is released via `delete order_ptr;`, the pointer variable still contains the numerical memory address (`0x55a8f0`), but the operating system heap allocator has marked that chunk as freed. Dereferencing it later is undefined behavior and triggers AddressSanitizer / SIGSEGV.'
    },
    patchQuestion: {
      id: 'inc_q_cpp_patch',
      type: 'multiple_choice',
      prompt: 'What modern C++ (C++17/20) idiom guarantees that memory is never accessed after deallocation?',
      options: [
        'Set order_ptr = (Order*)0x12345678 immediately after calling delete.',
        'Allocate all orders with malloc() and avoid the C++ delete operator.',
        'Cast the pointer to void* before accessing struct members.',
        'Adopt smart pointers (std::unique_ptr or std::shared_ptr) and RAII instead of raw manual new/delete.'
      ],
      correctAnswer: 3,
      explanation: 'Modern C++ RAII with `std::unique_ptr` and `std::shared_ptr` / `std::weak_ptr` automatically manages ownership semantics and nullifies handles upon move/reset, mathematically eliminating dangling pointers and manual memory leak pitfalls.'
    }
  },
  {
    id: 'inc_event_loop_lockup',
    title: 'Async Event Loop Lockup',
    severity: 'SEV-2',
    system: 'Document Conversion & Export Gateway',
    service: 'doc-export-worker',
    language: 'typescript',
    badgeClass: 'badge-amber',
    slaSeconds: 180, // 3 Minutes
    lore: 'Users requesting 1,000-page PDF exports cause the entire cloud API to freeze. All lightweight health checks and auth routes stall until the PDF export finishes.',
    initialMetrics: {
      cpu: 100.0,
      ram: 72.0,
      ramDisplay: '5.76 / 8.0 GB',
      errorRate: 65.4,
      latencyMs: 25000,
      activeConnections: 4500
    },
    stabilizedMetrics: {
      cpu: 21.0,
      ram: 26.0,
      ramDisplay: '2.08 / 8.0 GB',
      errorRate: 0.01,
      latencyMs: 32,
      activeConnections: 420
    },
    logs: [
      '[16:19:50.001] [INFO] [doc-worker] Gateway listening on port 3000 (Express + TypeScript)',
      '[16:20:00.101] [INFO] [export] Starting PDF generation for document doc_84102 (1,450 pages)',
      '[16:20:00.102] [DEBUG] [crypto] Generating cryptographic watermark signatures synchronously in loop',
      '[16:20:08.502] [WARN] [gateway] Upstream response time for GET /healthz exceeded 5,000ms',
      '[16:20:18.901] [ERROR] [proxy] 504 Gateway Timeout: no bytes received from doc-export-worker in 15s',
      '[16:20:25.001] [WARN] [cluster] Node worker 3 unresponsive, event loop delay = 24,912ms',
      '[16:20:30.812] [ALERT] [ingress] Error rate spike: 65.4% of API gateway requests timed out'
    ],
    diagnosisQuestion: {
      id: 'inc_q_ts_diag',
      type: 'multiple_choice',
      prompt: 'Why does a long-running synchronous computation freeze completely unrelated incoming HTTP routes in Node.js?',
      options: [
        'TypeScript compilation removes multi-threading support at transpilation time.',
        'Node.js executes JavaScript on a single thread; synchronous loops starve the event loop from processing I/O events.',
        'The V8 garbage collector enters a stop-the-world pause when processing strings longer than 1MB.',
        'HTTP keep-alive sockets cannot coexist with cryptographic hashing.'
      ],
      correctAnswer: 1,
      explanation: 'JavaScript in Node.js is single-threaded. When CPU-intensive operations (like synchronous hashing or layout calculation) execute synchronously on the main thread, the event loop cannot pick up incoming TCP packets, timers, or I/O callbacks, causing every endpoint to freeze.'
    },
    patchQuestion: {
      id: 'inc_q_ts_patch',
      type: 'multiple_choice',
      prompt: 'Select the optimal architectural pattern to offload heavy CPU computation without blocking the main event loop:',
      options: [
        'Offload the heavy PDF generation to a Node.js Worker Thread (worker_threads) or dedicated background queue job.',
        'Wrap the synchronous loop in a Promise.resolve().then() block.',
        'Prepend async to the synchronous function without changing internal logic.',
        'Increase the libuv threadpool size to 512 using UV_THREADPOOL_SIZE.'
      ],
      correctAnswer: 0,
      explanation: '`worker_threads` (or an external task queue like BullMQ/Celery) offloads CPU-bound computation to separate operating system threads, keeping the main Node.js event loop completely unblocked and responsive to incoming HTTP requests.'
    }
  },
  {
    id: 'inc_null_deref_cascade',
    title: 'Null Dereference Crash Loop',
    severity: 'SEV-1',
    system: 'Microservice Cart & Discount Engine',
    service: 'discount-evaluator',
    language: 'java',
    badgeClass: 'badge-coral',
    slaSeconds: 180, // 3 Minutes
    lore: 'During Black Friday flash deals, a promotion with a null coupon code caused 100% of shopping cart evaluations to crash with NullPointerException, triggering a cascading container restart loop.',
    initialMetrics: {
      cpu: 89.0,
      ram: 78.0,
      ramDisplay: '6.24 / 8.0 GB',
      errorRate: 98.9,
      latencyMs: 14200,
      activeConnections: 18500
    },
    stabilizedMetrics: {
      cpu: 17.5,
      ram: 28.0,
      ramDisplay: '2.24 / 8.0 GB',
      errorRate: 0.0,
      latencyMs: 24,
      activeConnections: 720
    },
    logs: [
      '[00:01:00.001] [INFO] [cart] DiscountService initialized with 48 active rule beans',
      '[00:01:05.112] [INFO] [cart] Evaluating discount rules for cart_99182',
      '[00:01:05.114] [ERROR] [cart] java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" because "couponCode" is null',
      '[00:01:05.115] [ERROR] [cart]   at com.syntaxarena.discount.RuleEngine.apply(RuleEngine.java:54)',
      '[00:01:05.116] [ERROR] [cart]   at com.syntaxarena.cart.CartService.calculateTotal(CartService.java:112)',
      '[00:01:10.820] [WARN] [resilience] CircuitBreaker "discount-service" tripped OPEN (failure rate: 100%)',
      '[00:01:15.001] [FATAL] [cart] Unhandled runtime exception in reactive pipeline: 500 Internal Server Error',
      '[00:01:20.404] [WARN] [kubernetes] Readiness probe failed: 500 Internal Server Error'
    ],
    diagnosisQuestion: {
      id: 'inc_q_java_diag',
      type: 'multiple_choice',
      prompt: 'What caused the NullPointerException at RuleEngine.java:54 in the cart pipeline?',
      options: [
        'The Java Virtual Machine ran out of PermGen / Metaspace memory.',
        'The Coupon class did not implement the Serializable interface.',
        'A generic type cast from Object to String failed at runtime.',
        'Calling an instance method (toUpperCase) on a null object reference without null-checking or using Optional.'
      ],
      correctAnswer: 3,
      explanation: 'In Java, invoking any method on a reference variable that evaluates to `null` throws `java.lang.NullPointerException`. When guest shoppers or promotions without coupon codes were evaluated, `couponCode` was null, crashing the cart calculation.'
    },
    patchQuestion: {
      id: 'inc_q_java_patch',
      type: 'multiple_choice',
      prompt: 'Select the idiomatic Java defensive pattern to handle optional coupon codes safely:',
      options: [
        'Catch java.lang.Error at the top-level main class.',
        'Use Optional.ofNullable(couponCode).map(String::toUpperCase).orElse("") or Objects.requireNonNullElse().',
        'Add a static boolean flag isCouponPresent initialized to true.',
        'Declare the method as synchronized.'
      ],
      correctAnswer: 1,
      explanation: '`Optional.ofNullable(couponCode).map(String::toUpperCase).orElse("")` or standard null-safe checks (e.g., `Objects.requireNonNullElse(couponCode, "").toUpperCase()`) gracefully handle null values without throwing NullPointerException.'
    }
  }
];

export const IncidentScenarios = {
  getAll() {
    return [...INCIDENT_SCENARIOS];
  },

  getById(id) {
    return INCIDENT_SCENARIOS.find(s => s.id === id) || null;
  },

  getDefaultIncident() {
    return INCIDENT_SCENARIOS[0];
  }
};

if (typeof window !== 'undefined') {
  window.INCIDENT_SCENARIOS = INCIDENT_SCENARIOS;
  window.IncidentScenarios = IncidentScenarios;
}
