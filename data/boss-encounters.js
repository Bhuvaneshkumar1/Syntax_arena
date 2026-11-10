/**
 * SyntaxArena Mega-Boss Encounters (Daemon Incursion)
 * Thematic system adversaries with unique lore, health pools, signature attacks,
 * dialogue taunts, and curated programming challenges.
 */

export const BOSS_ENCOUNTERS = [
  {
    id: 'null_leviathan',
    name: 'NullPointer Leviathan',
    title: 'The Heap Void',
    subtitle: 'Spectral Anomaly of Unallocated Space',
    icon: '🐙',
    themeColor: '#38bdf8',
    secondaryColor: '#0284c7',
    badgeClass: 'badge-cyan',
    maxHp: 1000,
    enrageSeconds: 25,
    attackType: 'null_dereference',
    attackName: 'Null Dereference Void',
    attackDesc: 'Corrupts answer options with memory static and drains visibility.',
    taunts: {
      intro: 'You dare wander into the unallocated heap? Everything here points to nothingness.',
      phase2: 'CRITICAL VOID ENRAGE! You cannot dereference what does not exist!',
      attack: 'SEGMENTATION FAULT! Your pointers have been severed!',
      defeat: 'Impossible... my memory space... has been reclaimed!'
    },
    rewards: {
      xp: 500,
      badgeId: 'badge_boss_leviathan',
      badgeName: 'Void Breaker',
      title: 'Heap Architect'
    },
    questions: [
      {
        id: 'boss-nl-001',
        language: 'c',
        difficulty: 'intermediate',
        type: 'predict_output',
        prompt: 'What happens when attempting to dereference a NULL pointer in standard C?',
        code: '#include <stdio.h>\nint main() {\n    int *ptr = NULL;\n    printf("%d\\n", *ptr);\n    return 0;\n}',
        options: [
          'Prints 0',
          'Undefined Behavior / Segmentation Fault (SIGSEGV)',
          'Prints NULL',
          'Compiler error: cannot assign NULL'
        ],
        correctIndex: 1,
        explanation: 'Dereferencing a NULL pointer yields Undefined Behavior in ISO C, which on modern protected OS architectures raises a SIGSEGV hardware fault.'
      },
      {
        id: 'boss-nl-002',
        language: 'python',
        difficulty: 'beginner',
        type: 'predict_output',
        prompt: 'What exception is raised when calling a method on None in Python?',
        code: 'val = None\nres = val.upper()',
        options: [
          'NullPointerException',
          'AttributeError',
          'ValueError',
          'TypeError'
        ],
        correctIndex: 1,
        explanation: 'In Python, None is an instance of NoneType. Accessing an attribute or method not defined on NoneType raises an AttributeError.'
      },
      {
        id: 'boss-nl-003',
        language: 'java',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'Which modern Java 8+ feature is explicitly designed to eliminate explicit null checks?',
        code: '// Avoiding if (user != null && user.getAddress() != null) ...',
        options: [
          'Optional<T>',
          'NullSafe<T>',
          'StrictPointer',
          'SafeNavigator'
        ],
        correctIndex: 0,
        explanation: 'java.util.Optional<T> is a container object that may or may not contain a non-null value, providing functional methods like map() and orElse().'
      },
      {
        id: 'boss-nl-004',
        language: 'rust',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'How does Rust achieve complete memory safety without having a NULL pointer in safe code?',
        code: 'let val: Option<i32> = Some(42);',
        options: [
          'It runs an internal garbage collector on pointers',
          'It replaces raw null with the algebraic Option<T> enum (Some / None)',
          'It initializes all pointers to address 0x00000001',
          'It forces every pointer to be heap-allocated via Box'
        ],
        correctIndex: 1,
        explanation: 'Rust has no raw null in safe code; absence of a value is encoded explicitly using Option<T> with variants Some(T) and None, enforced at compile time.'
      },
      {
        id: 'boss-nl-005',
        language: 'go',
        difficulty: 'intermediate',
        type: 'predict_output',
        prompt: 'What occurs when sending data into a nil channel in Go?',
        code: 'package main\nfunc main() {\n    var ch chan int // nil channel\n    ch <- 42\n}',
        options: [
          'Panic: runtime error: nil channel send',
          'Blocks forever (deadlock)',
          'Sends 0 to stdout',
          'Silently ignores the send operation'
        ],
        correctIndex: 1,
        explanation: 'In Go, sending or receiving from a nil channel blocks forever. Since main is the sole goroutine, the runtime detects an immediate deadlock.'
      },
      {
        id: 'boss-nl-006',
        language: 'cpp',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'Which smart pointer in modern C++ (C++11+) transfers exclusive ownership and automatically deletes memory on scope exit?',
        code: 'std::unique_ptr<Connection> conn = std::make_unique<Connection>();',
        options: [
          'std::shared_ptr',
          'std::weak_ptr',
          'std::unique_ptr',
          'std::auto_ptr'
        ],
        correctIndex: 2,
        explanation: 'std::unique_ptr maintains exclusive ownership of a dynamic object. It cannot be copied (only moved) and destroys the owned object when exiting scope.'
      },
      {
        id: 'boss-nl-007',
        language: 'typescript',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'What does the Optional Chaining operator (?.) evaluate to if the left-hand operand is null or undefined?',
        code: 'const zip = user?.address?.zipCode;',
        options: [
          'Throws a TypeError',
          'Evaluates safely to undefined without throwing an error',
          'Evaluates to null',
          'Returns an empty string ""'
        ],
        correctIndex: 1,
        explanation: 'The optional chaining operator (?.) short-circuits and safely evaluates to undefined if the left reference is either null or undefined.'
      },
      {
        id: 'boss-nl-008',
        language: 'c',
        difficulty: 'expert',
        type: 'find_bug',
        prompt: 'Which line causes a dangling pointer bug by returning stack-allocated memory?',
        code: 'int* create_buffer() {\n    int buffer[10] = {0}; // Line 2\n    return buffer;        // Line 3\n}',
        options: [
          'Line 1: Function signature is invalid',
          'Line 2: Local array buffer cannot be initialized to 0',
          'Line 3: Returning pointer to local automatic stack memory',
          'Line 4: Missing free() invocation'
        ],
        correctIndex: 2,
        explanation: 'Local array "buffer" lives on the stack frame of create_buffer. Returning its address creates a dangling pointer as its stack frame is discarded.'
      },
      {
        id: 'boss-nl-009',
        language: 'cyber',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'What classic Linux kernel security mitigation maps page 0 (address 0x00000000) as unmapped to stop null-dereference exploits?',
        code: 'sysctl vm.mmap_min_addr',
        options: [
          'ASLR (Address Space Layout Randomization)',
          'mmap_min_addr protection',
          'Stack Canaries (SSP)',
          'DEP / NX Bit'
        ],
        correctIndex: 1,
        explanation: 'vm.mmap_min_addr prevents unprivileged user processes from mapping memory at address 0, neutralizing kernel NULL pointer dereference privilege escalation.'
      },
      {
        id: 'boss-nl-010',
        language: 'javascript',
        difficulty: 'beginner',
        type: 'predict_output',
        prompt: 'What does typeof null evaluate to in JavaScript due to a legacy 1995 type-tag quirk?',
        code: 'console.log(typeof null);',
        options: [
          '"null"',
          '"undefined"',
          '"object"',
          '"boolean"'
        ],
        correctIndex: 2,
        explanation: 'In the original JS engine, values were stored with a 3-bit type tag. Objects had tag 000, and null was represented as the null pointer (0x00), making typeof null return "object".'
      }
    ]
  },
  {
    id: 'kernel_hydra',
    name: 'Kernel Panic Hydra',
    title: 'Ring 0 Chaos',
    subtitle: 'Multi-Threaded Hardware Interrupt Sovereign',
    icon: '🐉',
    themeColor: '#f43f5e',
    secondaryColor: '#e11d48',
    badgeClass: 'badge-coral',
    maxHp: 1200,
    enrageSeconds: 22,
    attackType: 'kernel_glitch',
    attackName: 'Ring 0 Interrupt Blast',
    attackDesc: 'Screen glitch shockwave that accelerates timer countdown by 25%.',
    taunts: {
      intro: 'User space ends here, mortal. Welcome to Ring 0 kernel privilege!',
      phase2: 'INTERRUPT OVERFLOW! All cores firing at maximum cycle rate!',
      attack: 'KERNEL PANIC: Hardware Fault in CPU core 0!',
      defeat: 'System halting... reboot vector corrupted... kernel dumped!'
    },
    rewards: {
      xp: 600,
      badgeId: 'badge_boss_hydra',
      badgeName: 'Kernel Crusher',
      title: 'Ring 0 Overlord'
    },
    questions: [
      {
        id: 'boss-kh-001',
        language: 'c',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'Which POSIX system call creates a new duplicate process by copying the address space?',
        code: 'pid_t pid = fork();',
        options: [
          'clone()',
          'fork()',
          'execve()',
          'pthread_create()'
        ],
        correctIndex: 1,
        explanation: 'fork() duplicates the calling process, creating an exact child with copy-on-write virtual memory pages.'
      },
      {
        id: 'boss-kh-002',
        language: 'asm',
        difficulty: 'intermediate',
        type: 'predict_output',
        prompt: 'In x86-64 Linux ABI, which CPU register holds the System Call Number before executing syscall?',
        code: 'mov rax, 60    ; sys_exit\nmov rdi, 0     ; error_code\nsyscall',
        options: [
          'rax',
          'rdi',
          'rsi',
          'rdx'
        ],
        correctIndex: 0,
        explanation: 'In the x86-64 System V AMD64 ABI, the syscall number is passed in RAX, with arguments in RDI, RSI, RDX, R10, R8, and R9.'
      },
      {
        id: 'boss-kh-003',
        language: 'cyber',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'What occurs during a hardware context switch between two threads on a modern CPU?',
        code: '// CPU Context Transition: Thread A -> Thread B',
        options: [
          'All RAM contents are copied to SSD cache',
          'CPU registers, stack pointer, and program counter are saved to memory and replaced by Thread B state',
          'L1 cache is permanently formatted',
          'The CPU clock multiplier is lowered to 0'
        ],
        correctIndex: 1,
        explanation: 'A context switch preserves the executing thread\'s CPU register context, program counter, and stack pointer, then restores the corresponding registers for the next thread.'
      },
      {
        id: 'boss-kh-004',
        language: 'c',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'What happens to a child process in Linux if the parent terminates before calling wait()?',
        code: '// Parent exits without calling waitpid()',
        options: [
          'The child is immediately killed by the kernel',
          'The child is adopted by init (PID 1) / systemd',
          'The child becomes an unkillable root demon',
          'The child memory is freed immediately'
        ],
        correctIndex: 1,
        explanation: 'Orphaned child processes are automatically reparented to init (PID 1), which actively reaps terminated children to prevent zombie accumulation.'
      },
      {
        id: 'boss-kh-005',
        language: 'rust',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'Which Rust concurrency primitive allows multiple readers OR one single writer to access shared data?',
        code: 'use std::sync::RwLock;\nlet lock = RwLock::new(5);',
        options: [
          'Mutex<T>',
          'Arc<T>',
          'RwLock<T>',
          'AtomicBool'
        ],
        correctIndex: 2,
        explanation: 'RwLock<T> (Reader-Writer Lock) permits concurrent read-only access by multiple threads, while requiring exclusive access for write mutations.'
      },
      {
        id: 'boss-kh-006',
        language: 'asm',
        difficulty: 'expert',
        type: 'predict_output',
        prompt: 'What does the x86 instruction "cli" execute inside kernel mode?',
        code: 'cli    ; Clear Interrupt Flag',
        options: [
          'Clears the Local Instruction cache',
          'Disables maskable hardware interrupts (IF = 0)',
          'Closes the active network interface',
          'Initializes the command-line interface'
        ],
        correctIndex: 1,
        explanation: 'CLI clears the Interrupt Flag (IF) in the EFLAGS register, disabling maskable external hardware interrupts for atomic critical sections in kernel space.'
      },
      {
        id: 'boss-kh-007',
        language: 'cyber',
        difficulty: 'intermediate',
        type: 'predict_output',
        prompt: 'Which virtual Linux filesystem file contains live CPU architecture, model, and clock frequency telemetry?',
        code: '$ cat /proc/cpuinfo | grep "model name"',
        options: [
          '/etc/cpu',
          '/proc/cpuinfo',
          '/sys/hardware/cpu',
          '/var/log/cpu.log'
        ],
        correctIndex: 1,
        explanation: '/proc/cpuinfo is a procfs synthetic kernel file that dynamically generates CPU model, core counts, and feature flags directly from kernel state.'
      },
      {
        id: 'boss-kh-008',
        language: 'c',
        difficulty: 'expert',
        type: 'predict_output',
        prompt: 'What does the mmap() system call flag MAP_ANONYMOUS specify?',
        code: 'void *p = mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);',
        options: [
          'The mapping is backed by a secret hidden file on disk',
          'The mapping is not backed by any file; memory is initialized to zero bytes',
          'The mapping is accessible by all users on the network',
          'The memory cannot be freed by munmap'
        ],
        correctIndex: 1,
        explanation: 'MAP_ANONYMOUS allocates raw memory pages from the kernel with no underlying file descriptor backing, initialized to zero (standard for custom allocators).'
      },
      {
        id: 'boss-kh-009',
        language: 'java',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'What happens when two threads in Java attempt to synchronize on the same object monitor lock?',
        code: 'synchronized(lock) { /* critical section */ }',
        options: [
          'Both threads execute concurrently using speculative execution',
          'One thread acquires the monitor; the other thread enters the BLOCKED state',
          'The JVM terminates with a DeadlockException',
          'The slower thread is aborted and garbage collected'
        ],
        correctIndex: 1,
        explanation: 'Java synchronized blocks use intrinsic monitor locks. If one thread holds the lock, any competing thread transitions to the BLOCKED state until the lock is released.'
      },
      {
        id: 'boss-kh-010',
        language: 'cyber',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'What CPU ring level corresponds to User Space in the x86 hierarchical protection ring architecture?',
        code: '// CPU Privilege Rings: Ring 0, Ring 1, Ring 2, Ring 3',
        options: [
          'Ring 0',
          'Ring 1',
          'Ring 2',
          'Ring 3'
        ],
        correctIndex: 3,
        explanation: 'On x86 hardware, Ring 3 is the least privileged domain designated for user-space applications, while Ring 0 is the supervisor kernel ring with direct hardware control.'
      }
    ]
  },
  {
    id: 'overflow_dragon',
    name: 'Buffer Overflow Dragon',
    title: 'The Stack Smasher',
    subtitle: 'Ancient Wyrm of Corrupted Instruction Pointers',
    icon: '🔥',
    themeColor: '#fb923c',
    secondaryColor: '#ea580c',
    badgeClass: 'badge-amber',
    maxHp: 1100,
    enrageSeconds: 24,
    attackType: 'stack_smash',
    attackName: 'Stack Frame Smashing Blast',
    attackDesc: 'Distorts code with CRT scanline flicker and inverts terminal styling.',
    taunts: {
      intro: 'Bounds checking is for the weak! I breathe raw memory destruction!',
      phase2: 'RETURN ADDRESS OVERWRITTEN! The call stack burns!',
      attack: 'STACK SMASHING DETECTED! Your frames are obliterated!',
      defeat: 'No... my stack canaries... how did you bypass my shellcode?!'
    },
    rewards: {
      xp: 550,
      badgeId: 'badge_boss_dragon',
      badgeName: 'Stack Guardian',
      title: 'Master of Canaries'
    },
    questions: [
      {
        id: 'boss-od-001',
        language: 'c',
        difficulty: 'beginner',
        type: 'multiple_choice',
        prompt: 'Which standard C library function is notorious for causing buffer overflows because it has no buffer size limit?',
        code: 'char buf[64];\ngets(buf); // ⚠️ DEPRECATED & DANGEROUS',
        options: [
          'fgets()',
          'gets()',
          'strncpy()',
          'snprintf()'
        ],
        correctIndex: 1,
        explanation: 'gets() reads input until a newline without checking array capacity, making buffer overflow unavoidable. It was removed from ISO C11.'
      },
      {
        id: 'boss-od-002',
        language: 'cyber',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'What is a "Stack Canary" in modern compiler security protections?',
        code: '// GCC Flag: -fstack-protector-all',
        options: [
          'A hardware sensor that detects CPU heat spikes',
          'A secret random value placed before the saved return address to detect stack overwrites',
          'A cryptographic checksum appended to compiled ELF binaries',
          'A firewall rule that drops malformed UDP packets'
        ],
        correctIndex: 1,
        explanation: 'Stack canaries (SSP) place a guard value between local buffers and the saved return pointer. If a buffer overflows, the canary value is altered, triggering __stack_chk_fail.'
      },
      {
        id: 'boss-od-003',
        language: 'asm',
        difficulty: 'intermediate',
        type: 'predict_output',
        prompt: 'Which CPU register tracks the top of the current stack frame in x86-64?',
        code: 'push rax    ; Decrements this register by 8 bytes',
        options: [
          'rsp',
          'rbp',
          'rip',
          'rsi'
        ],
        correctIndex: 0,
        explanation: 'RSP (Stack Pointer) holds the memory address of the current top of the call stack. Pushing values decrements RSP; popping increments RSP.'
      },
      {
        id: 'boss-od-004',
        language: 'c',
        difficulty: 'intermediate',
        type: 'find_bug',
        prompt: 'Identify the off-by-one buffer overflow vulnerability in this string copy routine:',
        code: 'char src[] = "SyntaxArena"; // 11 chars + null terminator = 12 bytes\nchar dest[11];\nstrcpy(dest, src);',
        options: [
          'src string literal is not const-qualified',
          'dest has 11 bytes, but "SyntaxArena" requires 12 bytes including null terminator \'\\0\'',
          'strcpy is only allowed on dynamic heap pointers',
          'dest must be initialized with malloc'
        ],
        correctIndex: 1,
        explanation: '"SyntaxArena" has 11 readable characters plus a required null terminator (\'\\0\'), total 12 bytes. dest has only 11 bytes, causing an off-by-one heap/stack overwrite.'
      },
      {
        id: 'boss-od-005',
        language: 'cyber',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'What exploit mitigation prevents code execution on the stack by marking writeable memory pages as non-executable?',
        code: '// Memory page permissions: RW- instead of RWX',
        options: [
          'DEP / NX (Data Execution Prevention / No-Execute bit)',
          'ASLR (Address Space Layout Randomization)',
          'SafeSEH',
          'CFI (Control Flow Integrity)'
        ],
        correctIndex: 0,
        explanation: 'DEP (Data Execution Prevention), supported by hardware via the CPU NX (No-Execute) bit, prevents executing code residing on the stack or heap.'
      },
      {
        id: 'boss-od-006',
        language: 'cpp',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'Which std::vector method provides bounds-checked element access and throws std::out_of_range on index violation?',
        code: 'std::vector<int> nums = {10, 20, 30};\nint val = nums.at(5); // Checked access',
        options: [
          'nums[5]',
          'nums.at(5)',
          'nums.get(5)',
          'nums.access(5)'
        ],
        correctIndex: 1,
        explanation: 'Unlike operator[] which performs unchecked direct pointer arithmetic, std::vector::at(idx) verifies bounds and throws std::out_of_range if out of bounds.'
      },
      {
        id: 'boss-od-007',
        language: 'cyber',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'When DEP/NX prevents stack shellcode execution, what advanced exploitation technique chains together existing binary code snippets ending in "ret"?',
        code: '// gadget: pop rdi ; ret -> gadget: pop rsi ; ret',
        options: [
          'ROP (Return-Oriented Programming)',
          'SQL Injection',
          'Cross-Site Scripting (XSS)',
          'Man-in-the-Middle (MITM)'
        ],
        correctIndex: 0,
        explanation: 'Return-Oriented Programming (ROP) bypasses DEP/NX by chaining small pre-existing executable machine instructions ("gadgets") followed by return (ret) instructions.'
      },
      {
        id: 'boss-od-008',
        language: 'rust',
        difficulty: 'beginner',
        type: 'predict_output',
        prompt: 'What does the Rust runtime do when an array is indexed out of bounds in safe code?',
        code: 'let arr = [1, 2, 3];\nlet val = arr[10];',
        options: [
          'Reads garbage memory from the stack (undefined behavior)',
          'Panics with runtime bounds check error ("index out of bounds")',
          'Returns None silently',
          'Returns 0'
        ],
        correctIndex: 1,
        explanation: 'In safe Rust, array indexing triggers automatic runtime bounds checks. If the index exceeds array length, the thread panics cleanly without memory corruption.'
      },
      {
        id: 'boss-od-009',
        language: 'c',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'Which safe alternative to sprintf guarantees null termination and prevents buffer overflows by requiring maximum buffer length?',
        code: 'snprintf(buffer, sizeof(buffer), "Score: %d", score);',
        options: [
          'vsprintf()',
          'snprintf()',
          'sprintf_s() only on Windows',
          'bprintf()'
        ],
        correctIndex: 1,
        explanation: 'snprintf() takes the maximum buffer capacity as its second argument, writes at most size-1 characters, and guarantees null termination.'
      },
      {
        id: 'boss-od-010',
        language: 'asm',
        difficulty: 'expert',
        type: 'predict_output',
        prompt: 'What does the x86 "ret" instruction pop off the stack into the Instruction Pointer (RIP)?',
        code: 'ret    ; Return from procedure',
        options: [
          'The base pointer (RBP)',
          'The caller\'s saved Return Address',
          'The function\'s integer return value',
          'The stack canary value'
        ],
        correctIndex: 1,
        explanation: 'The ret instruction pops the 8-byte return address off the stack at [RSP] and jumps execution to that address by setting the RIP register.'
      }
    ]
  },
  {
    id: 'deadlock_kraken',
    name: 'Deadlock Kraken',
    title: 'The Concurrency Nightmare',
    subtitle: 'Leviathan of Tangled Threads and Starvation',
    icon: '🦑',
    themeColor: '#a855f7',
    secondaryColor: '#9333ea',
    badgeClass: 'badge-violet',
    maxHp: 1300,
    enrageSeconds: 20,
    attackType: 'resource_starvation',
    attackName: 'Mutual Exclusion Lockout',
    attackDesc: 'Locks down 1 answer option with a mutex barrier for 3 seconds.',
    taunts: {
      intro: 'Thread A waits for Thread B; Thread B waits for Thread A. You are trapped forever!',
      phase2: 'RESOURCE EXHAUSTION! All mutex locks permanently engaged!',
      attack: 'DEADLOCK! Thread synchronization failure!',
      defeat: 'The circular wait... has been broken! Channels drained!'
    },
    rewards: {
      xp: 650,
      badgeId: 'badge_boss_kraken',
      badgeName: 'Deadlock Dissolver',
      title: 'Concurrency Architect'
    },
    questions: [
      {
        id: 'boss-dk-001',
        language: 'go',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'Which Go statement allows a goroutine to wait on multiple channel operations simultaneously?',
        code: 'select {\ncase msg1 := <-ch1:\n    fmt.Println(msg1)\ncase ch2 <- "ping":\n    fmt.Println("Sent")\n}',
        options: [
          'switch',
          'select',
          'defer',
          'goroutine'
        ],
        correctIndex: 1,
        explanation: 'The select statement lets a goroutine wait on multiple communication operations across channels, proceeding as soon as one case is ready.'
      },
      {
        id: 'boss-dk-002',
        language: 'java',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'Which of the following is NOT one of the 4 Coffman conditions required for a deadlock to occur?',
        code: '// Coffman Conditions Analysis',
        options: [
          'Mutual Exclusion',
          'Hold and Wait',
          'Preemption Allowed (Kernel can forcibly take locks away)',
          'Circular Wait'
        ],
        correctIndex: 2,
        explanation: 'The 4 Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If preemption IS allowed, deadlock is broken.'
      },
      {
        id: 'boss-dk-003',
        language: 'python',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'What mechanism in standard CPython prevents multiple OS threads from executing Python bytecode simultaneously on multiple CPU cores?',
        code: '// The CPython Threading Bottleneck',
        options: [
          'The GIL (Global Interpreter Lock)',
          'The AsyncIO Event Loop',
          'The JIT Compiler Lock',
          'The Garbage Collection Semaphore'
        ],
        correctIndex: 0,
        explanation: 'The Global Interpreter Lock (GIL) is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes at once in CPython.'
      },
      {
        id: 'boss-dk-004',
        language: 'go',
        difficulty: 'intermediate',
        type: 'predict_output',
        prompt: 'What happens if you close an already closed channel in Go?',
        code: 'package main\nfunc main() {\n    ch := make(chan int)\n    close(ch)\n    close(ch) // Second close\n}',
        options: [
          'Silently ignored',
          'Panic: close of closed channel',
          'Returns false',
          'Prints warning to stderr'
        ],
        correctIndex: 1,
        explanation: 'In Go, calling close() on an already closed channel raises an immediate runtime panic: "close of closed channel".'
      },
      {
        id: 'boss-dk-005',
        language: 'c',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'Which POSIX threads mutex function attempts to acquire a lock without blocking, returning immediately if busy?',
        code: 'int res = pthread_mutex_trylock(&mutex);',
        options: [
          'pthread_mutex_lock()',
          'pthread_mutex_trylock()',
          'pthread_mutex_poll()',
          'pthread_mutex_timedlock()'
        ],
        correctIndex: 1,
        explanation: 'pthread_mutex_trylock() immediately locks the mutex if available, or returns EBUSY immediately without blocking if already locked by another thread.'
      },
      {
        id: 'boss-dk-006',
        language: 'rust',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'Which smart pointer is required to share thread-safe immutable ownership of data across multiple threads in Rust?',
        code: 'use std::sync::Arc;\nlet data = Arc::new(vec![1, 2, 3]);',
        options: [
          'Rc<T>',
          'Arc<T> (Atomically Reference Counted)',
          'Box<T>',
          'RefCell<T>'
        ],
        correctIndex: 1,
        explanation: 'Arc<T> (Atomically Reference Counted) implements the Send and Sync traits, enabling safe concurrent shared ownership across thread boundaries.'
      },
      {
        id: 'boss-dk-007',
        language: 'go',
        difficulty: 'expert',
        type: 'predict_output',
        prompt: 'What occurs when reading from a closed channel that has no remaining buffered data?',
        code: 'ch := make(chan int, 2)\nclose(ch)\nval, ok := <-ch\nfmt.Println(val, ok)',
        options: [
          'Runtime panic: read from closed channel',
          '0 false (Zero value of channel type and ok = false)',
          'nil true',
          'Blocks indefinitely'
        ],
        correctIndex: 1,
        explanation: 'Reading from a closed empty channel returns the zero value of the type (0 for int) and ok = false, signaling the channel is closed and exhausted.'
      },
      {
        id: 'boss-dk-008',
        language: 'cyber',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'What is a "Data Race" in multi-threaded programming?',
        code: '// Thread 1: x = 1   ||   Thread 2: print(x)',
        options: [
          'Two processes competing for network bandwidth',
          'Two concurrent accesses to the same memory location where at least one is a write and no synchronization is used',
          'When two threads finish at the exact same CPU clock cycle',
          'When a thread takes longer than 100ms to yield the CPU'
        ],
        correctIndex: 1,
        explanation: 'A data race occurs when two or more concurrent instructions access the same memory location, at least one access is a write, and no synchronization locks/barriers are held.'
      },
      {
        id: 'boss-dk-009',
        language: 'java',
        difficulty: 'expert',
        type: 'multiple_choice',
        prompt: 'What memory visibility guarantee does the "volatile" keyword provide for variables in Java?',
        code: 'private volatile boolean running = true;',
        options: [
          'It synchronizes method execution like a Mutex lock',
          'Reads and writes go directly to main memory, bypassing thread-local CPU register caches',
          'It prevents garbage collection on the variable',
          'It converts the variable into a 128-bit atomic counter'
        ],
        correctIndex: 1,
        explanation: 'In the Java Memory Model (JMM), volatile ensures that all reads and writes are performed directly to main memory, establishing a happens-before relationship for thread visibility.'
      },
      {
        id: 'boss-dk-010',
        language: 'c',
        difficulty: 'intermediate',
        type: 'multiple_choice',
        prompt: 'What simple design strategy eliminates the "Circular Wait" condition and permanently prevents deadlocks between multiple mutexes?',
        code: '// Locking Rule: Always acquire Mutex A before Mutex B',
        options: [
          'Lock Hierarchy / Global Lock Ordering',
          'Randomizing lock sleep intervals',
          'Increasing CPU core count',
          'Using volatile pointers on mutexes'
        ],
        correctIndex: 0,
        explanation: 'Enforcing a strict global lock hierarchy (always acquiring locks in the exact same predefined numerical order) mathematically prevents circular wait cycles.'
      }
    ]
  }
];

// Ensure correctAnswer and expectedOutput are mapped for AnswerChecker evaluation
BOSS_ENCOUNTERS.forEach(b => {
  if (Array.isArray(b.questions)) {
    b.questions.forEach(q => {
      if (!q.correctAnswer && Array.isArray(q.options) && typeof q.correctIndex === 'number') {
        q.correctAnswer = q.options[q.correctIndex];
      }
      if (!q.expectedOutput && q.correctAnswer) {
        q.expectedOutput = q.correctAnswer;
      }
    });
  }
});

export const BossEncounters = {
  getAll() {
    return BOSS_ENCOUNTERS;
  },

  getById(id) {
    if (!id) return null;
    return BOSS_ENCOUNTERS.find(b => b.id === id) || null;
  },

  getDefaultBoss() {
    return BOSS_ENCOUNTERS[0];
  }
};
