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
    slaSeconds: 45,
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
      '[03:12:01.402] [INFO] [analytics-worker-04] Batch ingestion started for partition #14',
      '[03:12:44.119] [WARN] [analytics-worker-04] Garbage collector cycle took 840ms (> 200ms threshold)',
      '[03:13:10.822] [WARN] [memory_watchdog] Heap usage at 87.4% (6.99 GB / 8.00 GB)',
      '[03:13:58.204] [ERROR] [analytics-worker-04] Traceback (most recent call last):',
      '[03:13:58.205] [ERROR] [analytics-worker-04]   File "pipeline/ingest.py", line 42, in process_event_batch',
      '[03:13:58.206] [ERROR] [analytics-worker-04]     _GLOBAL_CACHE[session_id].append(raw_event_payload)',
      '[03:13:58.207] [ERROR] [analytics-worker-04] MemoryError: Out of memory allocation failed (cannot allocate 64MB block)',
      '[03:14:02.001] [FATAL] [kubelet] Pod analytics-worker-04 terminated with signal SIGKILL (OOMKilled)'
    ],
    diagnosisQuestion: {
      id: 'inc_q_mem_diag',
      type: 'multiple_choice',
      prompt: 'Based on the stack trace and memory growth velocity, what is the architectural root cause of the crash loop?',
      options: [
        '_GLOBAL_CACHE is appending raw payloads indefinitely without eviction, creating an unbounded heap leak.',
        'Python 3.10 garbage collection is disabled in production settings.',
        'The partition reader is attempting to load a file larger than physical RAM in a single byte stream.',
        'The database cursor connection pool is closing prematurely.'
      ],
      correctAnswer: 0,
      explanation: 'Lines 41-42 append raw event payloads into a module-level global dict `_GLOBAL_CACHE[session_id]` with no TTL, LRU eviction, or size bounds. In Python, module-level globals persist for the life of the worker process, creating an unbounded memory leak until the kernel triggers an OOM kill.'
    },
    patchQuestion: {
      id: 'inc_q_mem_patch',
      type: 'multiple_choice',
      prompt: 'Select the optimal production hotfix patch to stabilize the worker heap immediately without data loss:',
      options: [
        'Replace unbounded global list with an LRUCache(maxsize=10_000) or weakref-backed buffer with streaming flush to disk.',
        'Double pod memory request in Kubernetes deployment spec from 8GB to 16GB.',
        'Run gc.collect() manually inside the for loop after processing every individual event.',
        'Wrap the append call in a try/except MemoryError and pass.'
      ],
      correctAnswer: 0,
      explanation: 'Replacing the unbounded list accumulator with a bounded LRU cache / sliding window buffer (`functools.lru_cache` or a Redis/disk-backed queue) ensures memory cannot grow beyond configured bounds. Doubling RAM only delays OOM by minutes, while manual `gc.collect()` degrades CPU throughput by 80% without freeing reachable global references.'
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
    slaSeconds: 45,
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
      '[14:01:52.012] [INFO] [ledger] Processing Transfer txn_9812: Account A -> Account B',
      '[14:01:52.013] [INFO] [ledger] Processing Transfer txn_9813: Account B -> Account A',
      '[14:01:52.014] [DEBUG] [ledger] txn_9812: acquired lock for Account A, awaiting Account B lock...',
      '[14:01:52.015] [DEBUG] [ledger] txn_9813: acquired lock for Account B, awaiting Account A lock...',
      '[14:02:15.901] [WARN] [http_pool] Inflight HTTP request queue full (10,000 requests pending)',
      '[14:02:30.002] [ERROR] [goroutine_monitor] 48,211 goroutines in state `chan receive` or `sync.Mutex.Lock` wait > 30s',
      '[14:02:45.109] [FATAL] [healthcheck] Liveness probe timeout (GET /livez timed out after 10.0s)'
    ],
    diagnosisQuestion: {
      id: 'inc_q_deadlock_diag',
      type: 'multiple_choice',
      prompt: 'Analyze the lock acquisition sequence between txn_9812 and txn_9813. What concurrency bug triggered this outage?',
      options: [
        'A circular wait deadlock caused by acquiring multiple resource locks in inconsistent, arbitrary order.',
        'A goroutine stack overflow from infinite mutual recursion.',
        'Channel starvation due to an unbuffered channel without a listener.',
        'Atomic memory tearing across 64-bit integer pointers.'
      ],
      correctAnswer: 0,
      explanation: 'Classic circular wait deadlock (Coffman condition): Transaction 1 locks Account A and waits for Account B, while Transaction 2 locks Account B and waits for Account A. Because neither releases their held lock, both goroutines freeze forever, causing cascading queue exhaustion.'
    },
    patchQuestion: {
      id: 'inc_q_deadlock_patch',
      type: 'multiple_choice',
      prompt: 'Which algorithmic pattern permanently prevents circular lock acquisition deadlocks in account transfers?',
      options: [
        'Enforce a strict canonical lock acquisition ordering by sorting account IDs (e.g. lock min(idA, idB) first, then max(idA, idB)).',
        'Add a time.Sleep(10 * time.Millisecond) between the two lock acquisition statements.',
        'Replace sync.Mutex with sync.RWMutex and acquire RLock on both accounts.',
        'Launch each lock operation inside a new go func() goroutine without joining.'
      ],
      correctAnswer: 0,
      explanation: 'Enforcing a global canonical order for acquiring locks (e.g., sorting account IDs alphabetically or by numerical key: `if fromID > toID { swap() }`) completely breaks the circular wait condition. Every transaction acquires locks in the exact same sequence, making deadlocks mathematically impossible.'
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
    slaSeconds: 45,
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
      '[21:39:58.201] [INFO] [auth] Received HTTP POST /api/v1/auth/exchange (Content-Length: 1048)',
      '[21:39:58.202] [DEBUG] [auth] Extracting Bearer token header...',
      '[21:39:58.203] [CRITICAL] [glibc] *** stack smashing detected ***: terminated',
      '[21:39:58.204] [FATAL] [kernel] Traps: auth-proxy-daemon[4201] general protection fault ip:0x7f8842 sp:0x7ffcb4',
      '[21:40:02.100] [ERROR] [systemd] auth-proxy-daemon.service: Main process exited, code=dumped, status=6/ABRT',
      '[21:40:02.101] [ALERT] [watchdog] Zero healthy upstream authentication nodes available.'
    ],
    diagnosisQuestion: {
      id: 'inc_q_bof_diag',
      type: 'multiple_choice',
      prompt: 'Examining the glibc message "*** stack smashing detected ***", which unsafe C standard library function is responsible?',
      options: [
        'strcpy() or sprintf() copying an unbounded header string into a fixed stack array without bounds checking.',
        'malloc() returning NULL because physical virtual memory addresses were exhausted.',
        'free() called twice on the same heap pointer (double free error).',
        'qsort() called with an invalid comparator function causing stack depth explosion.'
      ],
      correctAnswer: 0,
      explanation: 'Stack smashing detection (GCC `-fstack-protector`) aborts execution when a canary word placed on the stack before the function return address is overwritten. This happens when an unbounded string copy like `strcpy(token_buf, header_str)` copies more bytes than the stack array allocated, overflowing into the canary.'
    },
    patchQuestion: {
      id: 'inc_q_bof_patch',
      type: 'multiple_choice',
      prompt: 'Select the standard secure C mitigation to replace the vulnerable stack string copy:',
      options: [
        'Use strncpy(dest, src, sizeof(dest) - 1) and guarantee null-termination: dest[sizeof(dest) - 1] = \'\\0\'.',
        'Compile the binary with -fno-stack-protector to disable canary checking.',
        'Increase the stack buffer size from char token[256] to char token[65536].',
        'Add a printf("%s", header_str) to inspect buffer bounds before copying.'
      ],
      correctAnswer: 0,
      explanation: 'Safe bounded copying functions (`strncpy`, `strlcpy`, or `snprintf(dest, sizeof(dest), "%s", src)`) prevent buffer overruns by strictly capping write operations to the size of destination buffer minus 1, followed by explicit null-byte termination.'
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
    slaSeconds: 45,
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
      '[11:02:10.119] [INFO] [checkout] Processing order ord_4910: starting transaction',
      '[11:02:10.420] [WARN] [payment_gateway] External card network returned HTTP 504 Gateway Timeout',
      '[11:02:10.421] [ERROR] [checkout] Exception raised during card charge; returning 500 to user',
      '[11:02:30.901] [WARN] [db_pool] Pool checkout wait time exceeded 10,000ms (Active: 100/100, Idle: 0)',
      '[11:02:35.002] [ERROR] [checkout] TimeoutException: Connection not available in pool within specified timeout (10000ms)',
      '[11:02:40.110] [FATAL] [ingress] 503 Service Unavailable: upstream connection pool exhausted'
    ],
    diagnosisQuestion: {
      id: 'inc_q_pool_diag',
      type: 'multiple_choice',
      prompt: 'The database server is idling, but all client connections remain leased. What code bug causes this starvation?',
      options: [
        'The database connection is not closed/released inside a finally block or deferred cleanup when an exception occurs.',
        'The SQL query is missing an index on the primary key column.',
        'The connection pool size of 100 is too small for standard HTTP traffic.',
        'The database WAL transaction log disk partition is 100% full.'
      ],
      correctAnswer: 0,
      explanation: 'When an external exception (such as a 504 timeout from a card network) aborts function execution before an explicit `conn.close()` line is reached, the connection remains leased forever unless wrapped in a `try...finally` block, context manager (`with`), or Go `defer` statement.'
    },
    patchQuestion: {
      id: 'inc_q_pool_patch',
      type: 'multiple_choice',
      prompt: 'Select the correct architectural fix to guarantee database connection release under all execution branches:',
      options: [
        'Enclose the connection lease in a try-with-resources / with context manager to guarantee release even on unhandled exceptions.',
        'Increase connection pool max_connections from 100 to 50,000 on PostgreSQL server.',
        'Catch all exceptions and silently suppress them so execution reaches conn.close().',
        'Disable timeouts on the external card processing gateway.'
      ],
      correctAnswer: 0,
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
    slaSeconds: 45,
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
      '[18:14:02.104] [INFO] [server] POST /api/v1/validate-email received payload size: 84 bytes',
      '[18:14:02.105] [DEBUG] [validator] Executing regex test on input: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaa!"',
      '[18:14:15.002] [WARN] [event_loop] Event loop lag: 12,898ms (Threshold: 100ms)',
      '[18:14:30.401] [ERROR] [event_loop] Event loop completely blocked. 3,892 timer callbacks delayed.',
      '[18:14:45.001] [FATAL] [k8s] Liveness probe failed 3 times consecutive. Pod killed.'
    ],
    diagnosisQuestion: {
      id: 'inc_q_redos_diag',
      type: 'multiple_choice',
      prompt: 'What regular expression pattern characteristic causes Catastrophic Backtracking (ReDoS) on unmatched inputs?',
      options: [
        'Nested overlapping quantifiers like (a+)+ evaluated against a string that fails near the end.',
        'Using the global flag /g without resetting lastIndex.',
        'Compiling regular expressions inside a loop instead of reusing a module constant.',
        'Using negative lookahead assertions (?!) without capturing groups.'
      ],
      correctAnswer: 0,
      explanation: 'Regular expression engines using Nondeterministic Finite Automata (NFA) exhibit catastrophic $O(2^n)$ exponential backtracking when matching nested quantifiers (e.g. `^([a-zA-Z0-9]+)*$`). When an input string fails at the final character, the engine explores billions of recursive permutation branches, pegging CPU at 100%.'
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
    slaSeconds: 45,
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
      '[08:30:01.002] [INFO] [feed] Connected to Nasdaq ITCH 5.0 Multicast feed',
      '[08:30:14.204] [DEBUG] [orderbook] Cancel order #884912: executing delete order_ptr',
      '[08:30:14.205] [DEBUG] [orderbook] Order ptr 0x55a8f0 freed back to heap arena',
      '[08:30:14.208] [CRITICAL] [asan] AddressSanitizer: heap-use-after-free on address 0x55a8f0',
      '[08:30:14.209] [CRITICAL] [asan] READ of size 8 at 0x55a8f0 thread T0 (orderbook_worker)',
      '[08:30:14.210] [FATAL] [kernel] Process terminated with SIGSEGV (Segmentation Fault)'
    ],
    diagnosisQuestion: {
      id: 'inc_q_cpp_diag',
      type: 'multiple_choice',
      prompt: 'Why did dereferencing 0x55a8f0 crash the application after the order was canceled?',
      options: [
        'A raw pointer was retained and accessed after delete freed the underlying heap memory (Dangling Pointer / Use-After-Free).',
        'The struct memory was not aligned to a 64-byte cache line boundary.',
        'The compiler failed to inline the virtual destructor.',
        'The thread attempted to lock a recursive mutex twice.'
      ],
      correctAnswer: 0,
      explanation: 'When raw memory is released via `delete order_ptr;`, the pointer variable still contains the numerical memory address (`0x55a8f0`), but the operating system heap allocator has marked that chunk as freed. Dereferencing it later is undefined behavior and triggers AddressSanitizer / SIGSEGV.'
    },
    patchQuestion: {
      id: 'inc_q_cpp_patch',
      type: 'multiple_choice',
      prompt: 'What modern C++ (C++17/20) idiom guarantees that memory is never accessed after deallocation?',
      options: [
        'Adopt smart pointers (std::unique_ptr or std::shared_ptr) and RAII instead of raw manual new/delete.',
        'Set order_ptr = (Order*)0x12345678 immediately after calling delete.',
        'Allocate all orders with malloc() and avoid the C++ delete operator.',
        'Cast the pointer to void* before accessing struct members.'
      ],
      correctAnswer: 0,
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
    slaSeconds: 45,
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
      '[16:20:00.101] [INFO] [export] Starting PDF generation for document doc_84102 (1,450 pages)',
      '[16:20:00.102] [DEBUG] [crypto] Generating cryptographic watermark signatures synchronously in loop',
      '[16:20:08.502] [WARN] [gateway] Upstream response time for GET /healthz exceeded 5,000ms',
      '[16:20:18.901] [ERROR] [proxy] 504 Gateway Timeout: no bytes received from doc-export-worker in 15s',
      '[16:20:25.001] [WARN] [cluster] Node worker 3 unresponsive, event loop delay = 24,912ms'
    ],
    diagnosisQuestion: {
      id: 'inc_q_ts_diag',
      type: 'multiple_choice',
      prompt: 'Why does a long-running synchronous computation freeze completely unrelated incoming HTTP routes in Node.js?',
      options: [
        'Node.js executes JavaScript on a single thread; synchronous loops starve the event loop from processing I/O events.',
        'TypeScript compilation removes multi-threading support at transpilation time.',
        'The V8 garbage collector enters a stop-the-world pause when processing strings longer than 1MB.',
        'HTTP keep-alive sockets cannot coexist with cryptographic hashing.'
      ],
      correctAnswer: 0,
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
    slaSeconds: 45,
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
      '[00:01:05.112] [INFO] [cart] Evaluating discount rules for cart_99182',
      '[00:01:05.114] [ERROR] [cart] java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" because "couponCode" is null',
      '[00:01:05.115] [ERROR] [cart]   at com.syntaxarena.discount.RuleEngine.apply(RuleEngine.java:54)',
      '[00:01:05.116] [ERROR] [cart]   at com.syntaxarena.cart.CartService.calculateTotal(CartService.java:112)',
      '[00:01:10.820] [WARN] [resilience] CircuitBreaker "discount-service" tripped OPEN (failure rate: 100%)',
      '[00:01:15.001] [FATAL] [cart] Unhandled runtime exception in reactive pipeline: 500 Internal Server Error'
    ],
    diagnosisQuestion: {
      id: 'inc_q_java_diag',
      type: 'multiple_choice',
      prompt: 'What caused the NullPointerException at RuleEngine.java:54?',
      options: [
        'Calling an instance method (toUpperCase) on a null object reference without null-checking or using Optional.',
        'The Java Virtual Machine ran out of PermGen / Metaspace memory.',
        'The Coupon class did not implement the Serializable interface.',
        'A generic type cast from Object to String failed at runtime.'
      ],
      correctAnswer: 0,
      explanation: 'In Java, invoking any method on a reference variable that evaluates to `null` throws `java.lang.NullPointerException`. When guest shoppers or promotions without coupon codes were evaluated, `couponCode` was null, crashing the cart calculation.'
    },
    patchQuestion: {
      id: 'inc_q_java_patch',
      type: 'multiple_choice',
      prompt: 'Select the idiomatic Java defensive pattern to handle optional coupon codes safely:',
      options: [
        'Use Optional.ofNullable(couponCode).map(String::toUpperCase).orElse("") or Objects.requireNonNullElse().',
        'Catch java.lang.Error at the top-level main class.',
        'Add a static boolean flag isCouponPresent initialized to true.',
        'Declare the method as synchronized.'
      ],
      correctAnswer: 0,
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

