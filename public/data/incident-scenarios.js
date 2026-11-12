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
  },
  {
    id: 'inc_cache_stampede',
    title: 'Redis Cache Stampede & Thundering Herd',
    severity: 'SEV-1',
    system: 'Global Product Catalog & Search API',
    service: 'catalog-cache-proxy',
    language: 'python',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 11:22 UTC, the Redis cache cluster evicted the hot homepage recommendation key. 45,000 concurrent RPS immediately bypassed the cache and hammered PostgreSQL directly, exhausting the connection pool and causing 100% gateway timeouts.',
    initialMetrics: { cpu: 98.4, ram: 76.5, ramDisplay: '6.12 / 8.0 GB', errorRate: 94.2, latencyMs: 14200, activeConnections: 50000 },
    stabilizedMetrics: { cpu: 18.2, ram: 28.4, ramDisplay: '2.27 / 8.0 GB', errorRate: 0.02, latencyMs: 32, activeConnections: 1800 },
    logs: [
      '[11:20:00.104] [INFO] [redis-cluster-01] Evicting volatile key: catalog:home:recommendations (TTL expired)',
      '[11:20:01.320] [WARN] [catalog-cache-proxy] Cache MISS for key "catalog:home:recommendations". Initiating DB lookup.',
      '[11:20:01.440] [WARN] [catalog-cache-proxy] 1,420 worker threads concurrently detected cache miss on identical key',
      '[11:20:02.109] [ERROR] [postgres-pool] Connection pool exhausted: 500/500 active pool connections held (> 10s queue)',
      '[11:20:03.551] [ERROR] [catalog-cache-proxy] Query timed out after 10000ms: SELECT * FROM items ORDER BY rank DESC',
      '[11:20:05.102] [FATAL] [gateway] HTTP 504 Gateway Timeout on /api/v1/recommendations'
    ],
    diagnosisQuestion: {
      id: 'inc_q_cache_diag',
      type: 'multiple_choice',
      prompt: 'What architectural failure mode occurred when the hot cache key expired?',
      options: [
        'A memory hardware fault flipped bits on the Redis master node.',
        'Cache Stampede / Thundering Herd: Thousands of concurrent requests bypassed cache simultaneously and overwhelmed the database.',
        'PostgreSQL ran out of storage disk space.',
        'The network switch dropped all TCP packets between workers and Redis.'
      ],
      correctAnswer: 1,
      explanation: 'When a popular cache key expires simultaneously for thousands of concurrent clients, all requests experience a cache miss and rush directly to the database. This "Thundering Herd" or Cache Stampede paralyzes the database connection pool.'
    },
    patchQuestion: {
      id: 'inc_q_cache_patch',
      type: 'multiple_choice',
      prompt: 'Select the optimal distributed caching mitigation to prevent cache stampedes:',
      options: [
        'Disable Redis caching and query PostgreSQL directly for all requests.',
        'Implement Probabilistic Early Expiration (XFetch) or Mutex Locking on cache regeneration so only 1 thread queries the DB.',
        'Restart the PostgreSQL cluster every 5 minutes.',
        'Increase the PostgreSQL connection limit to 1,000,000.'
      ],
      correctAnswer: 1,
      explanation: 'Using Mutex Locking (e.g. `SET key_lock NX EX 10`) or Probabilistic Early Expiration (XFetch algorithm) ensures that exactly ONE worker regenerates the cache in the background while other workers serve stale cache or wait briefly, shielding the database.'
    }
  },
  {
    id: 'inc_circuit_breaker_cascade',
    title: 'Cascading Upstream Service Timeout',
    severity: 'SEV-1',
    system: 'Checkout & Inventory Service Mesh',
    service: 'order-orchestrator',
    language: 'java',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 09:40 UTC, a 3rd-party tax calculation API began hanging with 45-second latency. Because order-orchestrator lacked timeouts and circuit breakers, all incoming client connections locked up waiting, exhausting thread pools across all upstream microservices.',
    initialMetrics: { cpu: 88.0, ram: 92.0, ramDisplay: '7.36 / 8.0 GB', errorRate: 99.1, latencyMs: 38000, activeConnections: 35000 },
    stabilizedMetrics: { cpu: 22.0, ram: 34.0, ramDisplay: '2.72 / 8.0 GB', errorRate: 0.10, latencyMs: 65, activeConnections: 1200 },
    logs: [
      '[09:38:12.102] [WARN] [tax-client] Request to https://api.taxcalc-external.com/v2/quote exceeded 5000ms',
      '[09:38:35.405] [WARN] [order-orchestrator] Thread pool exhaustion: activeThreads=200/200, queuedTasks=5840',
      '[09:39:01.002] [ERROR] [checkout-api] Downstream order-orchestrator unresponsive after 30000ms',
      '[09:39:15.901] [FATAL] [envoy-proxy] 504 Gateway Timeout: circuit broken on cluster checkout-service'
    ],
    diagnosisQuestion: {
      id: 'inc_q_circuit_diag',
      type: 'multiple_choice',
      prompt: 'Why did a slowdown in an external tax API take down the entire internal checkout system?',
      options: [
        'The tax API returned malicious payload that infected the JVM bytecode.',
        'Absence of timeouts and circuit breaking allowed unconstrained thread blocking to propagate upstream in a cascading failure.',
        'DNS resolution failed for localhost.',
        'The JVM JIT compiler disabled inlining.'
      ],
      correctAnswer: 1,
      explanation: 'Without strict HTTP read timeouts and a circuit breaker (e.g., Resilience4j), slow downstream calls hold worker threads indefinitely. Once thread pools saturate, the service stops accepting new requests, causing cascading failures up the entire dependency tree.'
    },
    patchQuestion: {
      id: 'inc_q_circuit_patch',
      type: 'multiple_choice',
      prompt: 'Select the hotfix to isolate the failing external API and restore checkout availability:',
      options: [
        'Increase HTTP request timeout to 10 minutes.',
        'Deploy Resilience4j CircuitBreaker with 800ms read timeout and a fallback estimated tax calculator.',
        'Hardcode tax to zero dollars for all transactions.',
        'Add infinite retries with zero backoff.'
      ],
      correctAnswer: 1,
      explanation: 'Enforcing an aggressive timeout (e.g., 800ms) with a Circuit Breaker that opens after 50% failures—coupled with a graceful local tax estimation fallback—immediately isolates the failing dependency and unblocks checkout throughput.'
    }
  },
  {
    id: 'inc_gc_pause_storm',
    title: 'JVM Full GC Stop-the-World Storm',
    severity: 'SEV-1',
    system: 'Real-Time Order Matching Engine',
    service: 'matching-engine-core',
    language: 'java',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 16:15 UTC, order matching latency spiked from 2ms to over 8,400ms. The JVM Old Generation reached 99.8% capacity, triggering consecutive Stop-The-World Full GC pauses lasting 6–12 seconds each, pausing all trading activity.',
    initialMetrics: { cpu: 100.0, ram: 99.5, ramDisplay: '15.92 / 16.0 GB', errorRate: 85.0, latencyMs: 8400, activeConnections: 12000 },
    stabilizedMetrics: { cpu: 15.0, ram: 42.0, ramDisplay: '6.72 / 16.0 GB', errorRate: 0.00, latencyMs: 3, activeConnections: 950 },
    logs: [
      '[16:14:02.304] [INFO] [gc,start] GC(104) Pause Young (Normal) (G1 Evacuation Pause) 12400M->13100M(16384M)',
      '[16:14:15.510] [WARN] [gc] GC(105) To-space exhausted during G1 Evacuation Pause',
      '[16:14:22.100] [WARN] [gc,start] GC(106) Pause Full (System.gc() or Allocation Failure)',
      '[16:14:32.404] [ERROR] [gc] GC(106) Pause Full 15990M->15840M(16384M) 10304.2ms [Stop-the-World]',
      '[16:14:40.109] [ALERT] [heartbeat] Cluster health check missed 3 heartbeat intervals (> 6000ms)'
    ],
    diagnosisQuestion: {
      id: 'inc_q_gc_diag',
      type: 'multiple_choice',
      prompt: 'What caused the Stop-The-World freeze in matching-engine-core?',
      options: [
        'The host operating system kernel panicked.',
        'Allocation rate overwhelmed G1GC concurrent marking, causing To-space exhaustion and consecutive Full GC freezes.',
        'The matching engine ran out of open TCP ports.',
        'A deadlock occurred in Java NIO selector.'
      ],
      correctAnswer: 1,
      explanation: 'When memory allocation velocity exceeds G1GC\'s background concurrent marking threshold, survivor regions cannot fit promoted objects ("To-space exhausted"). The JVM halts all application threads for a single-threaded Full GC compaction pause.'
    },
    patchQuestion: {
      id: 'inc_q_gc_patch',
      type: 'multiple_choice',
      prompt: 'Select the optimal JVM tuning and memory allocation remediation:',
      options: [
        'Switch from G1GC to Serial GC.',
        'Tune G1ReservePercent=15, InitiatingHeapOccupancyPercent=45, and eliminate temporary string allocations in matching hot paths with object pooling.',
        'Disable garbage collection entirely with -XX:+DisableExplicitGC.',
        'Reduce total heap size to 2GB.'
      ],
      correctAnswer: 1,
      explanation: 'Lowering `InitiatingHeapOccupancyPercent` triggers concurrent GC earlier, while `G1ReservePercent=15` provides buffer space to prevent To-space exhaustion. In code, replacing short-lived object allocations with reusable byte buffers/primitive pools stabilizes old-gen churn.'
    }
  },
  {
    id: 'inc_kafka_rebalance_loop',
    title: 'Kafka Consumer Heartbeat Timeout Loop',
    severity: 'SEV-1',
    system: 'Billing & Invoice Processing Pipeline',
    service: 'invoice-consumer-worker',
    language: 'python',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 07:05 UTC, invoice workers entered an infinite rebalance storm. Whenever a worker fetched a batch of 500 invoices, PDF generation took longer than max.poll.interval.ms. The Kafka broker assumed the worker died, revoked its partitions, and triggered endless cluster rebalances.',
    initialMetrics: { cpu: 65.0, ram: 54.0, ramDisplay: '4.32 / 8.0 GB', errorRate: 98.0, latencyMs: 25000, activeConnections: 8000 },
    stabilizedMetrics: { cpu: 28.0, ram: 32.0, ramDisplay: '2.56 / 8.0 GB', errorRate: 0.00, latencyMs: 45, activeConnections: 1100 },
    logs: [
      '[07:04:12.100] [INFO] [kafka-consumer] Received batch of 500 records from partition 3 (offset: 140029)',
      '[07:04:15.201] [INFO] [invoice-pdf] Generating PDF invoices for batch...',
      '[07:09:16.804] [WARN] [kafka-consumer] max.poll.interval.ms (300000ms) exceeded between successive poll() invocations',
      '[07:09:17.001] [ERROR] [kafka-coordinator] Member invoice-worker-01 has been marked dead; triggering GroupRebalance',
      '[07:09:18.112] [WARN] [kafka-consumer] CommitFailedException: Commit cannot be completed since group has already rebalanced',
      '[07:09:20.503] [ERROR] [kafka-consumer] Revoking all partition assignments. Re-joining consumer group...'
    ],
    diagnosisQuestion: {
      id: 'inc_q_kafka_diag',
      type: 'multiple_choice',
      prompt: 'Why are invoice messages never getting committed, resulting in duplicate processing and rebalance loops?',
      options: [
        'The Kafka broker disk crashed.',
        'Synchronous CPU-intensive PDF rendering inside poll() exceeded max.poll.interval.ms, causing the broker to evict the worker before offset commit.',
        'The worker connected to the wrong Kafka cluster port.',
        'The invoice database rejected all TLS certificates.'
      ],
      correctAnswer: 1,
      explanation: 'In Apache Kafka consumers, if the time between calls to `poll()` exceeds `max.poll.interval.ms`, the consumer coordinator assumes the thread has hung and evicts it from the group. All work done is abandoned, offsets are rejected, and another worker repeats the exact same failure.'
    },
    patchQuestion: {
      id: 'inc_q_kafka_patch',
      type: 'multiple_choice',
      prompt: 'Select the correct pattern to decouple ingestion polling from heavy background processing:',
      options: [
        'Set max.poll.interval.ms to 24 hours.',
        'Reduce max.poll.records to 25 and offload PDF generation to an async worker thread pool or Celery queue, keeping poll() loop snappy.',
        'Delete the Kafka topic and recreate it.',
        'Call consumer.close() immediately after poll().'
      ],
      correctAnswer: 1,
      explanation: 'Separating the Kafka consumer poll loop from heavy CPU work ensures `poll()` is invoked every few milliseconds to send timely heartbeats. Tuning `max.poll.records` to a manageable size ensures batches complete well inside SLA.'
    }
  },
  {
    id: 'inc_threadpool_starvation',
    title: 'Thread Pool Starvation on Async Block',
    severity: 'SEV-1',
    system: 'Healthcare Records Gateway',
    service: 'records-api-core',
    language: 'csharp',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 13:45 UTC, API request throughput plunged from 10,000 req/sec to 12. ThreadPool Queue length skyrocketed to 18,000 tasks. CPU usage is only 6%, but all incoming HTTP requests are hanging.',
    initialMetrics: { cpu: 6.2, ram: 45.0, ramDisplay: '3.60 / 8.0 GB', errorRate: 92.4, latencyMs: 29000, activeConnections: 18000 },
    stabilizedMetrics: { cpu: 25.0, ram: 28.0, ramDisplay: '2.24 / 8.0 GB', errorRate: 0.01, latencyMs: 24, activeConnections: 800 },
    logs: [
      '[13:44:10.100] [INFO] [http-server] Incoming GET /patients/records/search',
      '[13:44:11.402] [DEBUG] [records-service] Calling repository: GetPatientHistoryAsync().Result',
      '[13:44:15.912] [WARN] [runtime] ThreadPool starvation detected: MinThreads=8, MaxThreads=1000, AvailableThreads=0',
      '[13:44:22.001] [WARN] [runtime] ThreadPool injection rate is throttled to 1 new thread per 500ms',
      '[13:44:40.503] [ERROR] [gateway] 504 Gateway Timeout: no available threads in worker pool'
    ],
    diagnosisQuestion: {
      id: 'inc_q_threadpool_diag',
      type: 'multiple_choice',
      prompt: 'What antipattern in records-service caused thread pool starvation under load?',
      options: [
        'An infinite loop running on 100% CPU.',
        'Sync-over-Async blocking with `.Result` or `.Wait()`, holding thread pool workers hostage while waiting for continuation tasks.',
        'The garbage collector locked the thread pool.',
        'The network driver rejected TCP SYN packets.'
      ],
      correctAnswer: 1,
      explanation: 'Calling `.Result` or `.Wait()` on asynchronous Task methods blocks the calling worker thread synchronously until the task completes. Under high concurrency, every thread pool thread gets tied up waiting for continuations that cannot execute because all threads are blocked—a classic sync-over-async deadlock.'
    },
    patchQuestion: {
      id: 'inc_q_threadpool_patch',
      type: 'multiple_choice',
      prompt: 'Select the hotfix to restore non-blocking async execution:',
      options: [
        'Set ThreadPool.SetMinThreads(10000, 10000) permanently.',
        'Refactor synchronous method to async/await end-to-end (`await GetPatientHistoryAsync()`) and remove all `.Result` blocks.',
        'Replace all async calls with Thread.Sleep(1000).',
        'Wrap the call in Task.Run(() => ...).Wait().'
      ],
      correctAnswer: 1,
      explanation: 'Embracing async/await all the way down returns the executing thread to the ThreadPool immediately while I/O is in-flight. When the database query finishes, any free worker thread resumes the continuation, handling 50x higher throughput with minimal resources.'
    }
  },
  {
    id: 'inc_jwt_alg_none',
    title: 'JWT "alg: none" Token Spoofing Breach',
    severity: 'SEV-0',
    system: 'Identity & Authentication Provider',
    service: 'auth-validator-node',
    language: 'javascript',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 02:18 UTC, intrusion detection fired alerts for unauthorized administrative privilege escalation. Attackers forged valid admin JWTs by setting header {"alg": "none"} and stripping the cryptographic signature, granting root access.',
    initialMetrics: { cpu: 32.0, ram: 41.0, ramDisplay: '3.28 / 8.0 GB', errorRate: 48.0, latencyMs: 45, activeConnections: 5200 },
    stabilizedMetrics: { cpu: 14.0, ram: 22.0, ramDisplay: '1.76 / 8.0 GB', errorRate: 0.00, latencyMs: 28, activeConnections: 1100 },
    logs: [
      '[02:17:42.100] [INFO] [auth-validator] Validating Bearer token for user: attacker@blackhat.org',
      '[02:17:42.102] [DEBUG] [jwt-parser] Header decoded: {"typ":"JWT","alg":"none"}',
      '[02:17:42.103] [DEBUG] [jwt-parser] Signature component is empty string',
      '[02:17:42.104] [INFO] [auth-validator] Algorithm "none" accepted; skipping signature cryptographic verification',
      '[02:17:42.105] [ALERT] [rbac] Granted role "SYS_SUPERADMIN" to user attacker@blackhat.org',
      '[02:17:50.404] [ALERT] [audit] Unauthorized database dump initiated from endpoint /admin/export-all'
    ],
    diagnosisQuestion: {
      id: 'inc_q_jwt_diag',
      type: 'multiple_choice',
      prompt: 'What cryptographic validation vulnerability enabled token forging?',
      options: [
        'The server RSA private key was compromised on GitHub.',
        'The JWT verification library accepted "none" algorithm specified in the client-controlled header without explicit algorithm whitelist.',
        'The password hashing algorithm used MD5.',
        'Cross-Site Scripting stole session cookies.'
      ],
      correctAnswer: 1,
      explanation: 'RFC 7519 defines an "alg": "none" algorithm for unsecured tokens. If a token verification library does not explicitly enforce a strict whitelist of allowed cryptographic algorithms (e.g., `algorithms: ["RS256"]`), attackers can forge any arbitrary claims payload with empty signatures.'
    },
    patchQuestion: {
      id: 'inc_q_jwt_patch',
      type: 'multiple_choice',
      prompt: 'Select the hotfix patch to reject unsigned tokens and enforce strict verification:',
      options: [
        'Check if token length is greater than 100 characters.',
        'Pass strict verification options `jwt.verify(token, secret, { algorithms: ["RS256"] })` and reject any token lacking valid signature.',
        'Store all JWTs in localStorage.',
        'Switch from JWT to basic HTTP authentication.'
      ],
      correctAnswer: 1,
      explanation: 'Explicitly configuring `algorithms: ["RS256"]` (or `"HS256"`) in `jwt.verify()` instructs the validator to strictly reject any tokens signed with different or "none" algorithms, rendering signature stripping attacks completely impossible.'
    }
  },
  {
    id: 'inc_dns_ttl_blackhole',
    title: 'CoreDNS Resolution Desync & Stale IP Blackhole',
    severity: 'SEV-1',
    system: 'Internal Service Mesh & Ingress Gateway',
    service: 'coredns-system',
    language: 'cyber',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 18:30 UTC, following a blue/green pod migration, the payment ingress proxy continued routing 100% of customer checkout requests to decommissioned pod IPs (10.244.12.8), returning connection refused (ECONNREFUSED).',
    initialMetrics: { cpu: 44.0, ram: 52.0, ramDisplay: '4.16 / 8.0 GB', errorRate: 99.8, latencyMs: 18000, activeConnections: 24000 },
    stabilizedMetrics: { cpu: 16.0, ram: 25.0, ramDisplay: '2.00 / 8.0 GB', errorRate: 0.00, latencyMs: 18, activeConnections: 900 },
    logs: [
      '[18:28:10.100] [INFO] [k8s-deploy] Scale down deployment payment-service-blue from 10 to 0 replicas',
      '[18:28:15.201] [INFO] [k8s-deploy] Scale up deployment payment-service-green to 10 replicas (New IPs: 10.244.88.*)',
      '[18:28:30.404] [ERROR] [ingress-proxy] connect() to 10.244.12.8:8080 failed (111: Connection refused)',
      '[18:28:35.512] [WARN] [ingress-proxy] DNS cache TTL for payment-service.default.svc.cluster.local is 86400s (24h)',
      '[18:28:40.109] [FATAL] [ingress-proxy] 502 Bad Gateway: all upstream IP endpoints refused connection'
    ],
    diagnosisQuestion: {
      id: 'inc_q_dns_diag',
      type: 'multiple_choice',
      prompt: 'Why did the proxy fail to discover the newly deployed payment pods?',
      options: [
        'The ingress proxy had an erroneous 24-hour DNS caching TTL, ignoring CoreDNS updates and routing traffic to dead pod IPs.',
        'Kubernetes pod networking was disabled.',
        'The payments pod crashed on boot.',
        'The host firewall blocked port 443.'
      ],
      correctAnswer: 0,
      explanation: 'In dynamic container environments like Kubernetes, pods are ephemeral and IPs change constantly. A 24-hour client DNS cache TTL prevents the proxy from querying CoreDNS for new IPs, causing all traffic to route into a blackhole.'
    },
    patchQuestion: {
      id: 'inc_q_dns_patch',
      type: 'multiple_choice',
      prompt: 'Select the hotfix to flush stale DNS records and enforce low TTL for service discovery:',
      options: [
        'Reboot the entire Kubernetes worker node.',
        'Flush proxy DNS cache, configure DNS resolution TTL to 5s (`valid=5s`), and enable active Kubernetes EndpointSlice health checks.',
        'Hardcode the pod IP address into /etc/hosts.',
        'Switch from HTTP to UDP.'
      ],
      correctAnswer: 1,
      explanation: 'Flushing the stale proxy cache and configuring dynamic resolver TTL (`resolver kube-dns valid=5s`) guarantees that DNS changes propagate within seconds, keeping routing aligned with live Kubernetes endpoints.'
    }
  },
  {
    id: 'inc_ssrf_metadata',
    title: 'Cloud IMDSv1 SSRF Security Breach',
    severity: 'SEV-0',
    system: 'Document Converter & Thumbnail Service',
    service: 'thumbnail-renderer',
    language: 'python',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 21:04 UTC, an attacker supplied URL `http://169.254.169.254/latest/meta-data/iam/security-credentials/app-role` to the PDF thumbnail renderer. The unsegmented service fetched the metadata service and exposed cloud temporary secret keys.',
    initialMetrics: { cpu: 28.0, ram: 38.0, ramDisplay: '3.04 / 8.0 GB', errorRate: 25.0, latencyMs: 65, activeConnections: 3100 },
    stabilizedMetrics: { cpu: 12.0, ram: 21.0, ramDisplay: '1.68 / 8.0 GB', errorRate: 0.00, latencyMs: 35, activeConnections: 800 },
    logs: [
      '[21:03:15.100] [INFO] [thumbnail-worker] Received job: generate preview for user URL',
      '[21:03:15.105] [DEBUG] [requests] GET http://169.254.169.254/latest/meta-data/iam/security-credentials/app-role',
      '[21:03:15.210] [INFO] [requests] HTTP 200 OK: Content-Type: application/json (AccessKeyId, SecretAccessKey returned)',
      '[21:03:16.402] [ALERT] [cloudtrail] AWS API call sts:GetCallerIdentity made from unauthorized external IP 198.51.100.42'
    ],
    diagnosisQuestion: {
      id: 'inc_q_ssrf_diag',
      type: 'multiple_choice',
      prompt: 'What vulnerability allowed the external user to exfiltrate cloud IAM credentials?',
      options: [
        'Server-Side Request Forgery (SSRF): Unsanitized URL fetching allowed client to query link-local cloud metadata (169.254.169.254).',
        'SQL injection in image database.',
        'Cross-Site Scripting in user avatar.',
        'Denial of service on port 80.'
      ],
      correctAnswer: 0,
      explanation: 'SSRF occurs when a backend server fetches a user-supplied URL without validating the destination. In AWS, GCP, and Azure, the link-local IP `169.254.169.254` provides an internal instance metadata service containing IAM credentials.'
    },
    patchQuestion: {
      id: 'inc_q_ssrf_patch',
      type: 'multiple_choice',
      prompt: 'Select the defense-in-depth mitigation to permanently block SSRF to internal networks:',
      options: [
        'Enforce IMDSv2 (session-token gated metadata), restrict egress with iptables/network policy, and block private RFC1918/link-local IP addresses in URL parser.',
        'Change AWS access key once per year.',
        'Obfuscate the URL parameter with Base64.',
        'Run thumbnail renderer with root privileges.'
      ],
      correctAnswer: 0,
      explanation: 'Enforcing IMDSv2 requires a `X-aws-ec2-metadata-token` PUT request that blind SSRF cannot generate. Combining this with strict IP blocking (rejecting `127.0.0.1`, `10.0.0.0/8`, `169.254.0.0/16`) stops metadata exfiltration.'
    }
  },
  {
    id: 'inc_file_descriptor_leak',
    title: 'Too Many Open Files (EMFILE) Descriptor Leak',
    severity: 'SEV-1',
    system: 'High-Volume Notification Gateway',
    service: 'push-dispatcher',
    language: 'c',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 17:10 UTC, push notifications stopped dispatching. The service log flooded with `socket: Too many open files (errno 24 - EMFILE)`. The process reached its OS file descriptor ceiling of 65,536 because TCP sockets were never closed after TLS handshake timeouts.',
    initialMetrics: { cpu: 42.0, ram: 88.0, ramDisplay: '7.04 / 8.0 GB', errorRate: 99.4, latencyMs: 22000, activeConnections: 65535 },
    stabilizedMetrics: { cpu: 14.0, ram: 24.0, ramDisplay: '1.92 / 8.0 GB', errorRate: 0.00, latencyMs: 40, activeConnections: 1200 },
    logs: [
      '[17:08:45.100] [WARN] [dispatcher] TLS handshake timed out for client notification endpoint',
      '[17:08:45.101] [ERROR] [dispatcher] Return error without calling close(sock_fd)',
      '[17:09:15.405] [ALERT] [kernel] Process push-dispatcher (pid 4102) opened 65,536 file descriptors',
      '[17:09:20.109] [FATAL] [dispatcher] socket(AF_INET, SOCK_STREAM, 0) returned -1 (errno: EMFILE - Too many open files)'
    ],
    diagnosisQuestion: {
      id: 'inc_q_emfile_diag',
      type: 'multiple_choice',
      prompt: 'What resource was exhausted causing push-dispatcher to fail new socket connections?',
      options: [
        'Disk storage sectors ran out of inodes.',
        'Operating System File Descriptors: Sockets were orphaned on error pathways without executing close(sock_fd).',
        'RAM memory allocation failed with SIGSEGV.',
        'CPU registers overheated.'
      ],
      correctAnswer: 1,
      explanation: 'In Unix-like systems, sockets, files, and pipes consume file descriptors (`struct file*`). When error handling branches return without calling `close(fd)`, the descriptor remains reserved in the kernel process table until hitting `ulimit -n`.'
    },
    patchQuestion: {
      id: 'inc_q_emfile_patch',
      type: 'multiple_choice',
      prompt: 'Select the low-level C patch to ensure descriptors are cleaned up in all code paths:',
      options: [
        'Increase ulimit -n to infinity.',
        'Implement RAII / `goto cleanup` pattern ensuring `close(sock_fd)` is always called on timeout or error paths.',
        'Ignore errno 24 and retry socket() in an infinite loop.',
        'Remove TLS encryption.'
      ],
      correctAnswer: 1,
      explanation: 'Using standard C error cleanup idioms (e.g. `goto cleanup; ... cleanup: if (sock_fd >= 0) close(sock_fd);`) or RAII in C++ guarantees socket closure regardless of whether the connection succeeds or times out.'
    }
  },
  {
    id: 'inc_goroutine_leak',
    title: 'Unbounded Goroutine Channel Leak',
    severity: 'SEV-1',
    system: 'Crypto Ticker & Market Feed Ingestion',
    service: 'ticker-stream-worker',
    language: 'go',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 05:20 UTC, worker memory climbed relentlessly by 400MB every 10 minutes until OOMKilled. Runtime telemetry shows active Goroutines grew from 50 to over 340,000.',
    initialMetrics: { cpu: 85.0, ram: 98.0, ramDisplay: '7.84 / 8.0 GB', errorRate: 78.0, latencyMs: 4200, activeConnections: 14000 },
    stabilizedMetrics: { cpu: 18.0, ram: 20.0, ramDisplay: '1.60 / 8.0 GB', errorRate: 0.00, latencyMs: 14, activeConnections: 600 },
    logs: [
      '[05:18:12.100] [DEBUG] [runtime] NumGoroutine: 42,000',
      '[05:19:00.304] [WARN] [ticker] Worker spawning unbuffered channel: ch := make(chan priceData)',
      '[05:19:30.804] [WARN] [ticker] Timeout handler returned early; sender goroutine blocked indefinitely on `ch <- data`',
      '[05:19:55.109] [DEBUG] [runtime] NumGoroutine: 340,119',
      '[05:20:02.001] [FATAL] [kubelet] OOMKilled: container exceeded 8GB limit'
    ],
    diagnosisQuestion: {
      id: 'inc_q_goroutine_diag',
      type: 'multiple_choice',
      prompt: 'What caused 340,000 goroutines to accumulate and exhaust worker RAM?',
      options: [
        'Goroutines were blocked attempting to send on unbuffered channels where the receiver had already timed out and abandoned listening.',
        'Go runtime garbage collection was turned off.',
        'A cryptographic mining worm was injected.',
        'The Go runtime stack size expanded to 1GB per goroutine.'
      ],
      correctAnswer: 0,
      explanation: 'In Go, sending on an unbuffered channel (`ch <- val`) blocks until another goroutine receives. If the receiver exits due to timeout or cancellation, the sender goroutine remains blocked forever in memory, preventing GC of all referenced objects.'
    },
    patchQuestion: {
      id: 'inc_q_goroutine_patch',
      type: 'multiple_choice',
      prompt: 'Select the idiomatic Go concurrency fix to prevent goroutine leaks:',
      options: [
        'Use buffered channel `make(chan priceData, 1)` or select with `ctx.Done()` cancellation.',
        'Kill the Go process every 30 seconds.',
        'Replace goroutines with OS fork() processes.',
        'Never use channels in Go.'
      ],
      correctAnswer: 0,
      explanation: 'Using a buffered channel of size 1 allows the sender to write without blocking even if the receiver has abandoned the operation. Incorporating `select { case ch <- data: case <-ctx.Done(): return }` ensures clean exit upon context cancellation.'
    }
  },
  {
    id: 'inc_webhook_echo_loop',
    title: 'Infinite Webhook Amplification Storm',
    severity: 'SEV-1',
    system: 'Partner Integration Hub',
    service: 'webhook-dispatcher',
    language: 'typescript',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 12:00 UTC, a partner system subscribed to "order.updated" events inadvertently emitted its own "order.updated" webhook back to SyntaxArena upon receipt, triggering an exponential ping-pong storm of 800,000 webhooks per minute.',
    initialMetrics: { cpu: 99.8, ram: 84.0, ramDisplay: '6.72 / 8.0 GB', errorRate: 92.0, latencyMs: 19500, activeConnections: 45000 },
    stabilizedMetrics: { cpu: 20.0, ram: 30.0, ramDisplay: '2.40 / 8.0 GB', errorRate: 0.01, latencyMs: 45, activeConnections: 1200 },
    logs: [
      '[11:59:45.100] [INFO] [webhook-queue] Dispatched event ID evt_99812 to https://partner.example.com/hook',
      '[11:59:45.220] [INFO] [ingress] Received POST /webhook from partner.example.com with payload order.updated',
      '[11:59:45.310] [INFO] [webhook-queue] Dispatched event ID evt_99813 to https://partner.example.com/hook',
      '[12:00:15.804] [ALERT] [ratelimiter] Webhook queue backlog: 840,000 tasks pending execution',
      '[12:00:20.109] [ERROR] [dispatcher] HTTP 429 Too Many Requests: partner endpoint rate-limiting SyntaxArena'
    ],
    diagnosisQuestion: {
      id: 'inc_q_echo_diag',
      type: 'multiple_choice',
      prompt: 'What architectural oversight allowed an infinite webhook loop to overwhelm the dispatcher?',
      options: [
        'Absence of causal tracing headers / idempotency keys and loop detection flags allowed ping-pong event echo chamber.',
        'The partner server hacked SyntaxArena credentials.',
        'Node.js HTTP agent ran out of heap.',
        'DNS resolution failed for the partner domain.'
      ],
      correctAnswer: 0,
      explanation: 'Without tracing headers (such as `X-Request-ID` or `X-Correlation-ID`) and origin tracking (`origin: "syntaxarena"`), systems cannot detect when an incoming event was originally caused by their own outgoing event, leading to recursive feedback loops.'
    },
    patchQuestion: {
      id: 'inc_q_echo_patch',
      type: 'multiple_choice',
      prompt: 'Select the hotfix to break the infinite echo loop and protect webhook queues:',
      options: [
        'Delete the partner company account permanently.',
        'Implement distributed deduplication with Redis idempotency keys (`SETNX`) and add `X-Event-Hop-Count` header dropping events with hop count > 2.',
        'Disable webhooks across the entire platform.',
        'Add a 10-second sleep before sending webhooks.'
      ],
      correctAnswer: 1,
      explanation: 'Tracking an `X-Event-Hop-Count` or correlating event IDs in Redis with short TTL ensures that if an identical event or circular cascade is detected, it is immediately discarded before re-queueing.'
    }
  },
  {
    id: 'inc_db_n_plus_one',
    title: 'N+1 Query Explosion Crushing Database Replicas',
    severity: 'SEV-1',
    system: 'Course Catalog & Student Gradebook',
    service: 'gradebook-api-service',
    language: 'sql',
    badgeClass: 'badge-coral',
    slaSeconds: 180,
    lore: 'At 15:30 UTC, when 4,000 students loaded the course overview dashboard, the database received 4,001 SQL queries per student page load. PostgreSQL active connections maxed out and CPU pegged at 100%.',
    initialMetrics: { cpu: 100.0, ram: 78.0, ramDisplay: '6.24 / 8.0 GB', errorRate: 88.0, latencyMs: 12500, activeConnections: 32000 },
    stabilizedMetrics: { cpu: 14.0, ram: 25.0, ramDisplay: '2.00 / 8.0 GB', errorRate: 0.00, latencyMs: 19, activeConnections: 950 },
    logs: [
      '[15:28:10.100] [INFO] [sql-logger] Query 1: SELECT * FROM courses WHERE student_id = 42; (Returns 40 rows)',
      '[15:28:10.110] [INFO] [sql-logger] Query 2: SELECT * FROM assignments WHERE course_id = 101;',
      '[15:28:10.115] [INFO] [sql-logger] Query 3: SELECT * FROM assignments WHERE course_id = 102;',
      '[15:28:10.820] [INFO] [sql-logger] Query 41: SELECT * FROM assignments WHERE course_id = 140;',
      '[15:29:05.405] [WARN] [postgres] Active connection count reached max_connections (500)',
      '[15:29:12.109] [ERROR] [gradebook-api] Database query queue timeout: canceling statement due to user request'
    ],
    diagnosisQuestion: {
      id: 'inc_q_nplus_diag',
      type: 'multiple_choice',
      prompt: 'What database querying antipattern caused 4,000 students to generate over 160,000 queries per second?',
      options: [
        'N+1 Query Antipattern: Executing 1 query for the parent records, then N separate queries in a loop for each associated child record.',
        'PostgreSQL table was corrupt.',
        'SQL injection dropped the course table.',
        'The database was running without an index on primary keys.'
      ],
      correctAnswer: 0,
      explanation: 'The classic N+1 query problem occurs when an application fetches parent records (1 query for courses), then iterates through the result and issues an individual query for every single child record (N queries for assignments), multiplying database roundtrips by thousands.'
    },
    patchQuestion: {
      id: 'inc_q_nplus_patch',
      type: 'multiple_choice',
      prompt: 'Select the SQL optimization to collapse N+1 queries into a single performant set operation:',
      options: [
        'Run queries on separate database threads.',
        'Rewrite query to use `INNER JOIN` / `LEFT JOIN` or eager loading (`IN (?, ?, ...)`), reducing 41 queries into exactly 1 query.',
        'Cache all SQL queries in the browser localStorage.',
        'Increase PostgreSQL max_connections to 50,000.'
      ],
      correctAnswer: 1,
      explanation: 'Using eager loading (`WHERE course_id IN (...)`) or a single `JOIN` query consolidates all courses and their assignments into a single database roundtrip, dropping database query volume by 98%.'
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
