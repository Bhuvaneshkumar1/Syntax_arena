/**
 * Comprehensive 60-Module Cyber Academy Generator
 * 12 Programming Tracks x 5 Deep-Dive Modules each = 60 Lessons Total
 * Tracks: Python, C, C++, Java, Cyber, JavaScript, Rust, SQL, TypeScript, Go, HTML, Assembly
 */

import fs from 'fs';
import path from 'path';

// Define the 60 deep-dive modules
const lessons = [
  // =========================================================================
  // 1. PYTHON TRACK (5 Modules)
  // =========================================================================
  {
    id: "py-les-001",
    language: "python",
    difficulty: "beginner",
    topic: "Variables & Memory Model",
    title: "Variables are Name Tags, Not Storage Boxes",
    tagline: "Master how Python binds names to objects in heap memory.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Variables are Labels Attached to Objects",
        content: "In low-level languages like C, a variable is a physical memory box holding bits. In Python, **variables are merely name tags (pointers)** attached to objects allocated on the heap.\n\nWhen you execute `b = a`, Python does NOT copy the underlying data. Both names now point to the exact same object in memory!",
        codeSnippet: "# Both labels refer to the exact same list in heap memory:\na = [1, 2, 3]\nb = a\n\nb.append(99)\nprint(a)  # Output: [1, 2, 3, 99]!",
        sandboxCode: "a = [1, 2, 3]\nb = a\nb.append(99)\nprint('a is:', a)\nprint('Same object in memory (a is b)?', a is b)"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Predict the Mutation",
        prompt: "Review the snippet below. What will `x[0]` output when printed?",
        codeSnippet: "x = [10, 20]\ny = x\ny[0] = 999\nprint(x[0])",
        options: [
          { text: "10", isCorrect: false, feedback: "Remember: lists are mutable and y points to the exact same object as x." },
          { text: "999", isCorrect: true, feedback: "🎯 Correct! Since y and x reference the identical list in memory, mutating via y directly changes x." },
          { text: "TypeError", isCorrect: false, feedback: "List index reassignment is standard, valid syntax in Python." },
          { text: "IndexError", isCorrect: false, feedback: "Index 0 exists within the 2-element list." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "The Mutable Default Parameter Trap",
        content: "Default parameter values are evaluated **only once** when the function definition is loaded, NOT each time the function is called! Using `def func(lst=[])` shares that list across all invocations.",
        codeSnippet: "# ❌ DANGEROUS BUG:\ndef add_item(item, basket=[]):\n    basket.append(item)\n    return basket\n\n# ✅ IDIOMATIC FIX:\ndef add_item_safe(item, basket=None):\n    if basket is None:\n        basket = []\n    basket.append(item)\n    return basket",
        tip: "Hacker Rule: Always use `None` as default for mutable arguments (lists, dicts, sets).",
        arenaTarget: "game.html?lang=python&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "py-les-002",
    language: "python",
    difficulty: "intermediate",
    topic: "Scope & Closures",
    title: "The LEGB Rule & Nonlocal Variable Capture",
    tagline: "Understand how Python resolves variable names across lexical scopes.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "LEGB: Local -> Enclosing -> Global -> Builtin",
        content: "When Python resolves a variable name, it checks four concentric scopes in strict order: **L**ocal, **E**nclosing, **G**lobal, and **B**uilt-in.\n\nInner functions can freely *read* enclosing variables. But if you assign to a variable without `nonlocal`, Python creates a brand new *local* variable instead!",
        codeSnippet: "def make_counter():\n    count = 0\n    def step():\n        nonlocal count  # Captures enclosing count!\n        count += 1\n        return count\n    return step\n\nc = make_counter()\nprint(c(), c())  # Output: 1 2",
        sandboxCode: "def make_counter():\n    count = 0\n    def step():\n        nonlocal count\n        count += 1\n        return count\n    return step\n\nc = make_counter()\nprint('Step 1:', c())\nprint('Step 2:', c())"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "UnboundLocalError Trap",
        prompt: "What error occurs if you try `count += 1` inside `step()` without declaring `nonlocal count`?",
        codeSnippet: "def outer():\n    count = 10\n    def inner():\n        count += 1\n        return count\n    return inner()",
        options: [
          { text: "UnboundLocalError: local variable 'count' referenced before assignment", isCorrect: true, feedback: "🎯 Spot on! Python sees the assignment in inner() and marks count as Local, causing a lookup failure." },
          { text: "Returns 11 normally", isCorrect: false, feedback: "Python does not automatically modify enclosing variables without `nonlocal`." },
          { text: "SyntaxError: invalid assignment", isCorrect: false, feedback: "The syntax itself is valid; the runtime name resolution fails." },
          { text: "NameError: count is not defined", isCorrect: false, feedback: "It raises UnboundLocalError specifically because count is treated as a local." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Late Binding in Closure Loops",
        content: "Functions created inside loops capture variables by reference, NOT by value. All closures will look up the variable's final value unless defaulted!",
        codeSnippet: "# ❌ BUG: All functions return 2 * 2 = 4:\nfuncs = [lambda: i * 2 for i in range(3)]\n\n# ✅ FIX: Default argument freezes current value:\nfuncs_fixed = [lambda i=i: i * 2 for i in range(3)]",
        tip: "Hacker Rule: Use default argument pinning `lambda i=i:` inside loop comprehensions.",
        arenaTarget: "game.html?lang=python&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "py-les-003",
    language: "python",
    difficulty: "intermediate",
    topic: "Generators & Iteration",
    title: "Generators, Iterators & Memory-Efficient Streaming",
    tagline: "Process millions of records in constant memory with lazy yield evaluation.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Yield Pauses Execution and Preserves Stack State",
        content: "A list comprehension builds the entire array in memory upfront. A generator function with `yield` produces values **lazily on demand**, maintaining $O(1)$ space complexity regardless of stream size!",
        codeSnippet: "def stream_squares(limit):\n    for i in range(limit):\n        yield i * i  # Pauses function and yields value\n\ngen = stream_squares(3)\nprint(next(gen), next(gen), next(gen))  # Output: 0 1 4",
        sandboxCode: "def stream_powers(n):\n    for i in range(n):\n        yield 2 ** i\n\ngen = stream_powers(5)\nprint('Streamed powers:', list(gen))"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Generator Exhaustion",
        prompt: "What happens when you call `next()` on a generator that has already yielded all its values?",
        codeSnippet: "def simple():\n    yield 1\ng = simple()\nnext(g)\nnext(g)",
        options: [
          { text: "Raises StopIteration exception", isCorrect: true, feedback: "🎯 Correct! Generators signal the termination of their iterator stream via StopIteration." },
          { text: "Returns None indefinitely", isCorrect: false, feedback: "Generators do not produce None once exhausted; they raise StopIteration." },
          { text: "Loops back to the first yielded value (1)", isCorrect: false, feedback: "Generators are strictly single-pass unless reinvoked." },
          { text: "Raises GeneratorExit", isCorrect: false, feedback: "GeneratorExit is raised when a generator is explicitly closed, not on exhaustion." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Reusing Exhausted Generators",
        content: "A generator can only be iterated over **once**. Passing an already-consumed generator to a second loop or aggregation function will silently yield 0 items!",
        codeSnippet: "# ❌ SILENT BUG:\ngen = (x for x in range(5))\ntotal = sum(gen) # Evaluates to 10\ncount = len(list(gen)) # Evaluates to 0! Generator is empty!",
        tip: "Hacker Rule: If you need to re-read items, convert to a list `data = list(gen)` or recreate the generator.",
        arenaTarget: "game.html?lang=python&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "py-les-004",
    language: "python",
    difficulty: "expert",
    topic: "Metaprogramming & Dunder Protocols",
    title: "Object Construction with `__new__` vs `__init__`",
    tagline: "Master Python's low-level object allocation and descriptor mechanics.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "`__new__` Allocates; `__init__` Initializes",
        content: "When instantiating `cls(*args)`, Python calls `cls.__new__(cls, *args)` first. `__new__` is a static method responsible for returning a raw, allocated object instance.\n\nOnly if `__new__` returns an instance of `cls` does Python proceed to invoke `__init__(self, *args)` to configure it. This is how immutable singletons are constructed!",
        codeSnippet: "class Singleton:\n    _instance = None\n    def __new__(cls, *args, **kwargs):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\ns1 = Singleton()\ns2 = Singleton()\nprint(s1 is s2)  # Output: True",
        sandboxCode: "class Singleton:\n    _instance = None\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\na = Singleton()\nb = Singleton()\nprint('Single instance identity:', a is b)"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Instantiation Interception",
        prompt: "If `__new__` returns an instance of an entirely different class, what happens to `__init__`?",
        codeSnippet: "class Other:\n    pass\n\nclass Custom:\n    def __new__(cls):\n        return Other()\n    def __init__(self):\n        print('Custom initialized!')",
        options: [
          { text: "Custom.__init__ is never called", isCorrect: true, feedback: "🎯 Correct! Python only invokes __init__ if the returned object is an instance of Custom." },
          { text: "Custom.__init__ is executed on Other", isCorrect: false, feedback: "Python strictly checks `isinstance(result, cls)` before invoking __init__." },
          { text: "TypeError: invalid instance return", isCorrect: false, feedback: "Returning a different instance from __new__ is completely legal in Python." },
          { text: "Both Custom.__init__ and Other.__init__ execute", isCorrect: false, feedback: "Neither __init__ is called automatically in this scenario." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Overwriting `__setattr__` Recursion Loop",
        content: "Directly setting `self.x = 10` inside `__setattr__` causes an infinite recursive loop! You must delegate to `super().__setattr__` or modify `self.__dict__`.",
        codeSnippet: "# ❌ CRASH: RecursionError:\ndef __setattr__(self, name, value):\n    self.name = value  # Calls __setattr__ again!\n\n# ✅ SAFE:\ndef __setattr__(self, name, value):\n    super().__setattr__(name, value)",
        tip: "Hacker Rule: Always forward attribute writes to `super().__setattr__(name, value)`.",
        arenaTarget: "game.html?lang=python&diff=expert&stage=1"
      }
    ]
  },
  {
    id: "py-les-005",
    language: "python",
    difficulty: "expert",
    topic: "Asyncio & Concurrency",
    title: "Asyncio Event Loop, Coroutines & Cooperative Scheduling",
    tagline: "Uncover how single-threaded cooperative multitasking out-scales threads for I/O.",
    estimatedMinutes: 4,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Coroutines Cooperate via Non-Blocking Event Loops",
        content: "Unlike OS threads with preemptive scheduling, Python's `asyncio` is **cooperative**: a coroutine yields control back to the event loop only when hitting an `await` expression.\n\nIf a coroutine executes CPU-bound synchronous code (like `time.sleep()`), it freezes the entire process and starves all other pending tasks!",
        codeSnippet: "import asyncio\n\nasync def fetch_user(uid):\n    await asyncio.sleep(0.01) # Non-blocking I/O simulation\n    return {'id': uid, 'status': 'ACTIVE'}\n\nasync def main():\n    results = await asyncio.gather(fetch_user(1), fetch_user(2))\n    print('Fetched:', len(results))\n\n# asyncio.run(main())",
        sandboxCode: "import asyncio\n\nasync def worker(id):\n    return f'Worker {id} completed'\n\nasync def run():\n    res = await worker(42)\n    print('Result:', res)\n\nasyncio.run(run())"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Blocking the Event Loop",
        prompt: "What happens if you call standard `time.sleep(5)` inside an `async def` handler?",
        codeSnippet: "import time, asyncio\n\nasync def handler():\n    time.sleep(5)  # Synchronous sleep!\n    return 'Done'",
        options: [
          { text: "It blocks the entire event loop thread for 5 seconds", isCorrect: true, feedback: "🎯 Correct! Standard time.sleep() halts the OS thread, preventing any concurrent coroutines from running." },
          { text: "Asyncio automatically converts it to asyncio.sleep", isCorrect: false, feedback: "Python does not rewrite standard library synchronous blocking calls." },
          { text: "It spawns a background thread automatically", isCorrect: false, feedback: "Asyncio does not spawn background threads unless explicitly told to via asyncio.to_thread()." },
          { text: "Raises an AsyncSyntaxError", isCorrect: false, feedback: "Calling synchronous functions inside coroutines is syntactically legal, but bad for performance." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Fire-and-Forget Task Garbage Collection",
        content: "Calling `asyncio.create_task(coro)` without keeping a reference allows Python's garbage collector to destroy the task mid-execution! Always retain task references in a set.",
        codeSnippet: "# ❌ DANGEROUS: Task might be garbage-collected:\nasyncio.create_task(background_work())\n\n# ✅ SAFE: Retain reference until done:\nrunning_tasks = set()\nt = asyncio.create_task(background_work())\nrunning_tasks.add(t)\nt.add_done_callback(running_tasks.discard)",
        tip: "Hacker Rule: Never fire-and-forget tasks without storing them in a lifecycle collection.",
        arenaTarget: "game.html?lang=python&diff=expert&stage=1"
      }
    ]
  }
];

// Helper to generate full 60 lessons across remaining 11 tracks
const trackGenerators = [
  // 2. C TRACK
  {
    lang: "c",
    modules: [
      {
        id: "c-les-001", diff: "beginner", topic: "Pointers & Memory Addresses",
        title: "Memory Addresses, Indirection & The Dereference Operator",
        tagline: "Understand what pointers actually store: numerical virtual addresses.",
        concept: {
          title: "A Pointer Holds a Byte Address in Memory",
          content: "Every variable in C lives at a specific byte address in RAM. The address-of operator `&x` extracts that numerical location, while the dereference operator `*ptr` reads or writes the data living at that location.",
          code: "int x = 42;\nint *ptr = &x; // ptr stores address of x\n*ptr = 99;     // directly updates x via memory indirection!\nprintf(\"%d\\n\", x); // Output: 99",
          sandbox: "int x = 42;\nint *ptr = &x;\n*ptr = 99;\nprintf(\"x = %d, *ptr = %d\\n\", x, *ptr);"
        },
        drill: {
          title: "Pointer Indirection Prediction", prompt: "What is printed by this code snippet?",
          code: "int a = 5, b = 10;\nint *p = &a;\n*p = b;\nprintf(\"%d %d\", a, b);",
          options: [
            { text: "10 10", isCorrect: true, feedback: "🎯 Correct! *p = b assigns the value of b (10) to the memory location of a." },
            { text: "5 10", isCorrect: false, feedback: "*p = b modifies variable a through its pointer." },
            { text: "5 5", isCorrect: false, feedback: "Variable b is not modified." },
            { text: "Compilation Error", isCorrect: false, feedback: "Assigning an integer to a dereferenced int pointer is valid C." }
          ]
        },
        pitfall: {
          title: "Uninitialized Pointer Wild Writes",
          content: "Declaring `int *p;` without initializing it means `p` contains garbage bits. Writing `*p = 10` will attempt to write to random memory, causing a Segmentation Fault or silent corruption!",
          code: "// ❌ DANGEROUS CRASH:\nint *p; // Wild pointer points to garbage!\n*p = 10; // SEGFAULT!\n\n// ✅ SAFE INITIALIZATION:\nint *p = NULL;",
          tip: "Hacker Rule: Always initialize pointers to NULL or a valid address upon declaration.",
          target: "game.html?lang=c&diff=beginner&stage=1"
        }
      },
      {
        id: "c-les-002", diff: "intermediate", topic: "Pointer Arithmetic & Array Decay",
        title: "Array Decay to Pointers & Stride Step Multipliers",
        tagline: "Learn how C steps through contiguous RAM based on sizeof(T).",
        concept: {
          title: "Pointer Arithmetic Scales by Type Size",
          content: "In C, adding 1 to a pointer does NOT add 1 byte. It adds `sizeof(*ptr)` bytes! `ptr + 1` automatically offsets by 4 bytes for 32-bit ints, advancing to the next contiguous element.",
          code: "int arr[3] = {10, 20, 30};\nint *p = arr;\nprintf(\"%d, %d\\n\", *p, *(p + 1)); // Output: 10, 20",
          sandbox: "int arr[3] = {10, 20, 30};\nint *p = arr;\nprintf(\"First: %d, Second: %d\\n\", *p, *(p + 1));"
        },
        drill: {
          title: "Address Increment Calculation", prompt: "If `p` is an `int*` (4 bytes each) located at address 0x1000, what is the address of `p + 2`?",
          code: "int *p = (int*)0x1000;\n// What is the value of (p + 2)?",
          options: [
            { text: "0x1008", isCorrect: true, feedback: "🎯 Correct! 0x1000 + (2 * 4 bytes) = 0x1008." },
            { text: "0x1002", isCorrect: false, feedback: "Pointer arithmetic multiplies offsets by sizeof(type), not raw bytes." },
            { text: "0x1004", isCorrect: false, feedback: "That would be p + 1." },
            { text: "0x2000", isCorrect: false, feedback: "The base address is only offset by 8 bytes." }
          ]
        },
        pitfall: {
          title: "Array Parameter Sizeof Decay",
          content: "When passing an array to a function `void f(int a[])`, it decays to a raw pointer `int *a`. Inside the function, `sizeof(a)` returns pointer size (8 bytes on 64-bit), NOT the array element count!",
          code: "void check(int a[]) {\n    // ❌ WRONG: sizeof(a) is 8 (pointer size), not 40!\n    size_t count = sizeof(a) / sizeof(a[0]);\n}",
          tip: "Hacker Rule: Always pass explicit length arguments alongside array pointers in C.",
          target: "game.html?lang=c&diff=intermediate&stage=1"
        }
      },
      {
        id: "c-les-003", diff: "intermediate", topic: "Dynamic Memory Allocation",
        title: "Heap Management with malloc(), free() & Dangling Pointers",
        tagline: "Master memory allocation outside the transient call stack frame.",
        concept: {
          title: "Heap Memory Persists Until Explicitly Freed",
          content: "Variables allocated on the stack are automatically destroyed when their enclosing function returns. `malloc(bytes)` allocates persistent memory on the heap that survives until you manually call `free(ptr)`.",
          code: "int *arr = malloc(5 * sizeof(int));\nif (arr == NULL) return 1;\narr[0] = 100;\nfree(arr); // Return memory to OS\narr = NULL; // Prevent dangling pointer!",
          sandbox: "int *p = malloc(sizeof(int));\n*p = 777;\nprintf(\"Allocated val: %d\\n\", *p);\nfree(p);"
        },
        drill: {
          title: "Dangling Pointer Risk", prompt: "What is the primary danger of accessing a pointer immediately after calling `free(p)`?",
          code: "int *p = malloc(sizeof(int));\n*p = 50;\nfree(p);\nprintf(\"%d\", *p); // What is this?",
          options: [
            { text: "Undefined Behavior (Use-After-Free)", isCorrect: true, feedback: "🎯 Correct! Reading freed heap memory is a classic Use-After-Free vulnerability." },
            { text: "Guaranteed compile-time error", isCorrect: false, feedback: "Standard C compilers cannot detect all runtime use-after-free conditions." },
            { text: "Always prints 0", isCorrect: false, feedback: "The memory may still contain old data or be reallocated to another process." },
            { text: "Memory is automatically reallocated", isCorrect: false, feedback: "Freed memory is deallocated and must not be dereferenced." }
          ]
        },
        pitfall: {
          title: "Double Free Memory Corruption",
          content: "Calling `free(ptr)` twice on the same pointer corrupts the heap allocator's internal free-list, creating critical security vulnerabilities.",
          code: "// ❌ CRITICAL BUG:\nfree(ptr);\nfree(ptr); // DOUBLE FREE ABORT!\n\n// ✅ DEFENSE:\nfree(ptr);\nptr = NULL; // free(NULL) is a safe no-op!",
          tip: "Hacker Rule: Immediately assign freed pointers to NULL.",
          target: "game.html?lang=c&diff=intermediate&stage=1"
        }
      },
      {
        id: "c-les-004", diff: "expert", topic: "Memory Alignment & Struct Padding",
        title: "Struct Memory Alignment, Padding & Cache Line Packing",
        tagline: "Discover why sizeof(struct) is larger than the sum of its fields.",
        concept: {
          title: "CPUs Demand Word-Aligned Memory Access",
          content: "Modern CPUs fetch data from memory in 4-byte or 8-byte aligned words. To ensure members are aligned efficiently, the compiler inserts silent **padding bytes** between struct fields.",
          code: "struct Demo {\n    char a;    // 1 byte\n    // 3 bytes silent padding inserted here!\n    int b;     // 4 bytes\n    char c;    // 1 byte\n    // 3 bytes padding for struct alignment!\n}; // Total: 12 bytes, NOT 6 bytes!",
          sandbox: "struct S {\n    char a;\n    int b;\n};\nprintf(\"Sizeof struct: %zu bytes\\n\", sizeof(struct S));"
        },
        drill: {
          title: "Reordering Struct Members", prompt: "How can you minimize memory padding waste in a struct definition?",
          code: "struct Wasteful { char a; int b; char c; };",
          options: [
            { text: "Order fields in descending order of size (largest first)", isCorrect: true, feedback: "🎯 Correct! Placing larger types first packs bytes tightly with minimal alignment gaps." },
            { text: "Add more char variables to fill gaps", isCorrect: false, feedback: "Adding extra fields increases overall memory usage." },
            { text: "Change all types to pointers", isCorrect: false, feedback: "Pointers are 8 bytes each, increasing memory footprint." },
            { text: "Use static keywords on members", isCorrect: false, feedback: "C does not allow static members in structs." }
          ]
        },
        pitfall: {
          title: "Bit-Casting Structs with memcmp",
          content: "Comparing structs directly with `memcmp(&s1, &s2, sizeof(s1))` is dangerous because padding bytes contain uninitialized garbage bits, causing false inequality!",
          code: "// ❌ FALSE INEQUALITY:\nif (memcmp(&s1, &s2, sizeof(s1)) == 0) // May fail due to padding!\n\n// ✅ SAFE: Compare each field explicitly:\nif (s1.a == s2.a && s1.b == s2.b)",
          tip: "Hacker Rule: Never use memcmp for struct equality unless initialized via memset(&s, 0, sizeof(s)).",
          target: "game.html?lang=c&diff=expert&stage=1"
        }
      },
      {
        id: "c-les-005", diff: "expert", topic: "Sequence Points & Undefined Behavior",
        title: "Sequence Points, Precedence & Undefined Behavior in ISO C",
        tagline: "Uncover how the compiler assumes undefined behavior is physically impossible.",
        concept: {
          title: "Modifying a Scalar Twice Between Sequence Points is UB",
          content: "In ISO C, an expression like `i = i++` modifies the scalar `i` twice without an intervening sequence point. Under the C standard, this is strictly **Undefined Behavior (UB)**: the compiler is free to emit whatever machine code it chooses!",
          code: "int i = 5;\ni = i++; // ❌ UNDEFINED BEHAVIOR: Never write this in C!\n// Clang/GCC may output 5, 6, or optimize away entirely!",
          sandbox: "int i = 5;\nint next = i + 1;\nprintf(\"Safe sequenced increment: %d\\n\", next);"
        },
        drill: {
          title: "Undefined Behavior vs Implementation-Defined", prompt: "What is the key difference between Undefined Behavior (UB) and Implementation-Defined behavior?",
          code: "// Concept Check",
          options: [
            { text: "UB has zero guarantees; Implementation-Defined must be documented by compiler", isCorrect: true, feedback: "🎯 Correct! Implementation-defined requires compiler documentation (like sizeof(int)); UB allows arbitrary execution." },
            { text: "UB always generates a compilation warning", isCorrect: false, feedback: "Compilers frequently emit no warnings for complex undefined behavior." },
            { text: "Implementation-defined causes runtime aborts", isCorrect: false, feedback: "Implementation-defined behavior runs stably per the compiler manual." },
            { text: "They are completely interchangeable terms", isCorrect: false, feedback: "They are distinct, formal ISO C classifications." }
          ]
        },
        pitfall: {
          title: "Compiler Optimization UB Eradication",
          content: "Modern optimizing compilers assume UB *never* happens. If your code invokes signed integer overflow, the optimizer may delete entire security check branches!",
          code: "// ❌ BUGGY OVERFLOW CHECK:\nif (x + 100 < x) // Compiler assumes signed overflow is impossible and deletes this if!",
          tip: "Hacker Rule: Use unsigned types or check preconditions `if (x > INT_MAX - 100)` before adding.",
          target: "game.html?lang=c&diff=expert&stage=1"
        }
      }
    ]
  },

  // 3. C++ TRACK
  {
    lang: "cpp",
    modules: [
      {
        id: "cpp-les-001", diff: "beginner", topic: "References & Const Correctness",
        title: "References vs Pointers & Const Correctness",
        tagline: "Learn how C++ references create permanent aliases without pointer indirection syntax.",
        concept: {
          title: "A Reference is a Permanent Binding to an Existing Object",
          content: "Unlike a pointer, a C++ reference `int &ref = x;` cannot be null and cannot be reseated to point to another object. Passing parameters by `const T&` avoids expensive object copies while guaranteeing immutability.",
          code: "void inspect(const std::string &s) { // Zero copy, read only!\n    std::cout << s.length() << std::endl;\n}",
          sandbox: "std::string name = \"SyntaxArena\";\nconst std::string &alias = name;\nstd::cout << \"Length: \" << alias.length() << std::endl;"
        },
        drill: {
          title: "Reference Reseating Check", prompt: "What happens when you execute `ref = y;` on an existing reference `int &ref = x;`?",
          code: "int x = 10, y = 20;\nint &ref = x;\nref = y;\n// What is the value of x now?",
          options: [
            { text: "x becomes 20 (assigns y's value through the alias)", isCorrect: true, feedback: "🎯 Correct! References cannot be reseated; assigning to them writes to the referred variable (x)." },
            { text: "ref now points to y; x stays 10", isCorrect: false, feedback: "References can never be rebound to a different object after initialization." },
            { text: "Compiler error: references are read-only", isCorrect: false, feedback: "Non-const references are mutable." },
            { text: "Undefined behavior", isCorrect: false, feedback: "Value assignment through references is completely well-defined." }
          ]
        },
        pitfall: {
          title: "Dangling Reference to Local Stack Variable",
          content: "Returning a reference to a function's local variable results in an immediate dangling reference when the stack frame pops!",
          code: "// ❌ DISASTROUS BUG:\nconst std::string& get_bad() {\n    std::string s = \"temp\";\n    return s; // Dangling reference!\n}",
          tip: "Hacker Rule: Always return objects by value unless returning member references or parameters.",
          target: "game.html?lang=cpp&diff=beginner&stage=1"
        }
      },
      {
        id: "cpp-les-002", diff: "intermediate", topic: "RAII & Smart Pointers",
        title: "Resource Acquisition Is Initialization (RAII) & unique_ptr",
        tagline: "Tie resource lifetimes to deterministic stack unwinding.",
        concept: {
          title: "Destructors Guarantee Resource Release on Scope Exit",
          content: "RAII binds resources (memory, file handles, mutex locks) to object lifetime. When a stack frame exits—even via exceptions—the destructor runs automatically.\n\n`std::unique_ptr` guarantees exclusive ownership with zero runtime overhead over raw pointers!",
          code: "{\n    auto ptr = std::make_unique<Resource>();\n    ptr->execute();\n} // Destructor runs automatically here!",
          sandbox: "std::unique_ptr<int> num = std::make_unique<int>(42);\nstd::cout << *num << std::endl;"
        },
        drill: {
          title: "Copying unique_ptr", prompt: "What happens if you attempt to copy a `std::unique_ptr` using copy assignment `p2 = p1`?",
          code: "std::unique_ptr<int> p1 = std::make_unique<int>(10);\nstd::unique_ptr<int> p2 = p1; // Compiles?",
          options: [
            { text: "Compile-time error: copy constructor is deleted", isCorrect: true, feedback: "🎯 Correct! std::unique_ptr deletes its copy constructor to enforce single exclusive ownership." },
            { text: "Both pointers share the underlying memory", isCorrect: false, feedback: "That is the role of std::shared_ptr, not unique_ptr." },
            { text: "Runtime exception is thrown", isCorrect: false, feedback: "It fails at compile time, providing safety." },
            { text: "Ownership is automatically transferred", isCorrect: false, feedback: "Transfer requires explicit std::move(p1)." }
          ]
        },
        pitfall: {
          title: "Cyclic References with shared_ptr",
          content: "If two objects hold `std::shared_ptr` to each other, their reference counts never hit 0, causing a permanent memory leak! Break cycles using `std::weak_ptr`.",
          code: "// ❌ PERMANENT MEMORY LEAK:\nstruct Node {\n    std::shared_ptr<Node> next;\n    std::shared_ptr<Node> prev; // Should be std::weak_ptr!\n};",
          tip: "Hacker Rule: Use std::weak_ptr for back-pointers and observer relationships.",
          target: "game.html?lang=cpp&diff=intermediate&stage=1"
        }
      },
      {
        id: "cpp-les-003", diff: "intermediate", topic: "Virtual Tables & Polymorphism",
        title: "Virtual Method Dispatch & vptr / vtable Memory Overhead",
        tagline: "Explore dynamic dispatch and why base class destructors must be virtual.",
        concept: {
          title: "Virtual Functions Route Through Compiler vtables",
          content: "When a class declares `virtual`, the compiler inserts a hidden pointer (`vptr`) into every object instance pointing to a class-wide `vtable` array of function pointers.",
          code: "class Base {\npublic:\n    virtual ~Base() = default; // Essential for safe polymophic deletion!\n    virtual void speak() { std::cout << \"Base\"; }\n};",
          sandbox: "class Animal {\npublic:\n    virtual void sound() { std::cout << \"Roar!\\n\"; }\n};\nAnimal a;\na.sound();"
        },
        drill: {
          title: "Non-Virtual Base Destructor Deletion", prompt: "What happens if you delete a derived class object through a base pointer `Base *p = new Derived(); delete p;` when Base has a non-virtual destructor?",
          code: "Base *p = new Derived();\ndelete p; // Base::~Base is not virtual!",
          options: [
            { text: "Undefined Behavior (Derived destructor never runs)", isCorrect: true, feedback: "🎯 Correct! Deleting polymorphic objects without virtual destructors causes UB and leaks derived resources." },
            { text: "Both destructors run normally", isCorrect: false, feedback: "The compiler only invokes Base destructor, skipping Derived destructor." },
            { text: "Compiler error at delete site", isCorrect: false, feedback: "Compilers cannot know dynamic pointer type at compile time." },
            { text: "Memory is freed safely by the OS", isCorrect: false, feedback: "Derived class member cleanup is skipped, leaking handles/locks." }
          ]
        },
        pitfall: {
          title: "Slicing Derived Objects on By-Value Assignment",
          content: "Passing or assigning a `Derived` object to a `Base` variable by value slices off all derived state and reverts virtual dispatch to the Base vtable!",
          code: "// ❌ OBJECT SLICING:\nDerived d;\nBase b = d; // Sliced! Only base data preserved, vtable reset to Base!",
          tip: "Hacker Rule: Always pass polymorphic classes by reference or pointer `const Base&`.",
          target: "game.html?lang=cpp&diff=intermediate&stage=1"
        }
      },
      {
        id: "cpp-les-004", diff: "expert", topic: "Move Semantics & Rvalue References",
        title: "Move Semantics, Rvalues (`&&`) & Stealing Heap Pointers",
        tagline: "Eliminate deep heap copies by transferring pointer ownership in C++11+.",
        concept: {
          title: "Move Semantics Steals Pointers from Expiring Temporaries",
          content: "Prior to C++11, returning or passing large vectors required deep copies. Move constructors accept rvalue references `T&&`, allowing the new object to **steal the raw buffer pointer** and set the donor to null in $O(1)$ time!",
          code: "std::vector<int> a = {1, 2, 3};\nstd::vector<int> b = std::move(a); // Steals buffer; a is now empty!\n// O(1) pointer swap, zero heap allocation!",
          sandbox: "std::string s1 = \"BigDataBuffer\";\nstd::string s2 = std::move(s1);\nstd::cout << \"s2: \" << s2 << \", s1 length: \" << s1.length() << std::endl;"
        },
        drill: {
          title: "std::move Does Not Actually Move", prompt: "What does `std::move(x)` actually do under the hood at runtime?",
          code: "auto r = std::move(x);",
          options: [
            { text: "It is an unconditional cast to an rvalue reference (x&&)", isCorrect: true, feedback: "🎯 Correct! std::move generates zero machine instructions; it simply casts the type to enable move constructor overload selection." },
            { text: "It physically copies bytes in RAM", isCorrect: false, feedback: "Move constructors perform the move, not std::move itself." },
            { text: "It deletes the variable from the stack", isCorrect: false, feedback: "The variable remains in scope in a valid but unspecified state." },
            { text: "It allocates temporary registers", isCorrect: false, feedback: "It is purely a compile-time static cast." }
          ]
        },
        pitfall: {
          title: "Accessing Moved-From Objects",
          content: "After calling `std::move(x)`, `x` is in a valid but unspecified state. Calling methods that assume populated state triggers logic bugs!",
          code: "// ❌ BUG:\nstd::string s = \"secret\";\nsend(std::move(s));\nlog(s); // s may now be empty!",
          tip: "Hacker Rule: Treat moved-from variables as invalid until explicitly reinitialized.",
          target: "game.html?lang=cpp&diff=expert&stage=1"
        }
      },
      {
        id: "cpp-les-005", diff: "expert", topic: "C++20 Concepts & Constexpr",
        title: "Compile-Time Metaprogramming with C++20 Concepts & constexpr",
        tagline: "Replace cryptic SFINAE template errors with clear compile-time constraints.",
        concept: {
          title: "Concepts Constrain Generic Templates at Compile-Time",
          content: "C++20 `concept` defines named semantic constraints on template parameters. Instead of miles of unreadable compiler errors, violating a concept produces crisp, readable diagnostics like `requires std::integral<T>`.",
          code: "template<typename T>\nconcept Numeric = std::is_arithmetic_v<T>;\n\ntemplate<Numeric T>\nT add(T a, T b) { return a + b; }",
          sandbox: "std::cout << \"C++20 Concepts enable zero-cost abstractions.\" << std::endl;"
        },
        drill: {
          title: "constexpr vs const", prompt: "What is the defining capability of a `constexpr` variable or function?",
          code: "constexpr int square(int x) { return x * x; }",
          options: [
            { text: "It is guaranteed to be evaluatable at compile time if given constant expressions", isCorrect: true, feedback: "🎯 Correct! constexpr enables compile-time evaluation and constant folding." },
            { text: "It is stored in read-only memory at runtime only", isCorrect: false, feedback: "That applies to const; constexpr can run entirely during compilation." },
            { text: "It disables all optimization flags", isCorrect: false, feedback: "It assists the optimizer by resolving values prior to code generation." },
            { text: "It can only accept pointers", isCorrect: false, feedback: "constexpr functions accept standard scalar and literal types." }
          ]
        },
        pitfall: {
          title: "Template Bloat in Binary Footprint",
          content: "Instantiating templates with dozens of different types compiles a brand new copy of machine instructions for each type, bloating your executable size.",
          code: "// ❌ Watch out for code bloat:\ntemplate<typename T> void heavy_work() { /* 500 lines */ }",
          tip: "Hacker Rule: Factor non-type-dependent code into non-template helper functions.",
          target: "game.html?lang=cpp&diff=expert&stage=1"
        }
      }
    ]
  }
];

// Helper to fill in remaining 9 languages cleanly
const remainingTracks = [
  // 4. Java
  {
    lang: "java",
    modules: [
      { id: "java-les-001", diff: "beginner", topic: "Value vs Reference Types", title: "Stack Primitives vs Heap Objects", tagline: "Differentiate primitive values from heap reference pointers in Java.",
        concept: { title: "Primitives Store Values; Variables Store Pointers", content: "Java primitives (int, boolean, double) store raw values on the thread stack. All non-primitive objects (including arrays and Strings) live on the heap; variables hold references.", code: "int a = 10; // Primitive on stack\nint[] b = new int[]{1, 2}; // b stores heap reference", sandbox: "int[] arr = {1, 2, 3};\nSystem.out.println(arr.length);" },
        drill: { title: "Java Parameter Passing", prompt: "Is Java pass-by-value or pass-by-reference?", code: "void change(int[] a) { a[0] = 99; }", options: [{ text: "Strictly pass-by-value (the reference address is copied by value)", isCorrect: true, feedback: "🎯 Correct! Java is strictly pass-by-value; object references are copied by value." }, { text: "Pass-by-reference for objects", isCorrect: false, feedback: "Java never passes references by reference." }] },
        pitfall: { title: "Integer Cache Comparison Trap", content: "Java caches Integer objects between -128 and 127. Comparing Integers with `==` outside this range compares object references, yielding false!", code: "Integer a = 1000, b = 1000;\nSystem.out.println(a == b); // FALSE! Use a.equals(b)!", tip: "Hacker Rule: Always compare object equality with .equals(), never ==.", target: "game.html?lang=java&diff=beginner&stage=1" }
      },
      { id: "java-les-002", diff: "intermediate", topic: "String Constant Pool", title: "String Constant Pool & Immutability", tagline: "Learn how the JVM deduplicates string literals to conserve heap space.",
        concept: { title: "String Literals Share Pool Storage", content: "Strings created with quotes are stored in the JVM String Pool. `String s2 = new String(\"hello\")` bypasses the pool, allocating a redundant heap instance.", code: "String s1 = \"hello\";\nString s2 = \"hello\"; // Points to same instance!\nSystem.out.println(s1 == s2); // true", sandbox: "String s = \"SyntaxArena\";\nSystem.out.println(s.substring(0, 6));" },
        drill: { title: "String Concatenation in Loops", prompt: "Why is `str += \"x\"` inside a 10,000-iteration loop inefficient?", code: "String s = \"\";\nfor(int i=0; i<10000; i++) s += \"x\";", options: [{ text: "It creates 10,000 intermediate String objects on the heap", isCorrect: true, feedback: "🎯 Correct! Each concatenation allocates a new String; use StringBuilder instead." }, { text: "It causes stack overflow", isCorrect: false, feedback: "Heap space is consumed, not the stack frame." }] },
        pitfall: { title: "Substrings and Hidden Memory Retention", content: "In older Java versions, substring shared the underlying character buffer, preventing massive strings from being garbage collected.", code: "// Modern Java creates new char arrays for safe isolation.", tip: "Hacker Rule: Use StringBuilder for dynamic text composition.", target: "game.html?lang=java&diff=intermediate&stage=1" }
      },
      { id: "java-les-003", diff: "intermediate", topic: "Generics & Type Erasure", title: "Generics Type Erasure & Wildcards", tagline: "Understand why List<String> becomes raw List at JVM bytecode runtime.",
        concept: { title: "Java Generics are a Compile-Time Illusion", content: "To maintain backwards compatibility with Java 1.4, the compiler erases generic types to `Object` (or bounds) and inserts casts automatically.", code: "List<String> list = new ArrayList<>();\nlist.add(\"text\"); // At runtime, bytecode stores Object", sandbox: "java.util.List<String> list = new java.util.ArrayList<>();\nlist.add(\"Java\");\nSystem.out.println(list.get(0));" },
        drill: { title: "Generic Array Creation", prompt: "Why is `new T[10]` illegal in generic Java classes?", code: "class Container<T> { T[] arr = new T[10]; }", options: [{ text: "Type erasure prevents the JVM from knowing T's exact type at runtime", isCorrect: true, feedback: "🎯 Correct! Arrays reify their types at runtime, clashing with generic erasure." }, { text: "Java does not support arrays", isCorrect: false, feedback: "Java has native array types." }] },
        pitfall: { title: "Raw Types Disabling Safety", content: "Using raw types like `List raw = new ArrayList()` disables compile-time type safety and causes ClassCastException at runtime.", code: "List raw = new ArrayList(); raw.add(123);\nString s = (String) raw.get(0); // ClassCastException!", tip: "Hacker Rule: Always provide explicit type parameters or wildcards.", target: "game.html?lang=java&diff=intermediate&stage=1" }
      },
      { id: "java-les-004", diff: "expert", topic: "JVM Memory & Garbage Collection", title: "JVM Generational Garbage Collection & Metaspace", tagline: "Inspect the Young, Old, and Metaspace memory regions under the hood.",
        concept: { title: "Generational Hypothesis: Most Objects Die Young", content: "The JVM divides the heap into Eden, Survivor (S0/S1), and Tenured/Old generation. Minor GCs clean Eden rapidly; surviving objects are promoted to Old generation.", code: "// Objects live in Eden -> Survivor -> Tenured (Old Gen)", sandbox: "System.out.println(\"JVM Max Memory: \" + Runtime.getRuntime().maxMemory());" },
        drill: { title: "OutOfMemoryError: Metaspace", prompt: "What is stored in Java 8+ Metaspace?", code: "// java.lang.OutOfMemoryError: Metaspace", options: [{ text: "Class metadata and bytecode definitions in native memory", isCorrect: true, feedback: "🎯 Correct! Metaspace replaced PermGen and stores loaded class metadata." }, { text: "All thread stacks", isCorrect: false, feedback: "Stacks are allocated per thread." }] },
        pitfall: { title: "Static Collection Leaks", content: "Adding objects to `static List` roots them in the GC graph permanently, preventing garbage collection across application lifetime.", code: "static final List<Data> LEAK = new ArrayList<>(); // Never collected!", tip: "Hacker Rule: Clear static caches or use WeakReference/SoftReference.", target: "game.html?lang=java&diff=expert&stage=1" }
      },
      { id: "java-les-005", diff: "expert", topic: "Java Memory Model & Volatile", title: "The Java Memory Model, volatile & Happens-Before", tagline: "Prevent CPU cache visibility bugs across multithreaded cores.",
        concept: { title: "Volatile Guarantees Visibility and Prevents Instruction Reordering", content: "Each CPU core caches memory in L1/L2 caches. Declaring `volatile boolean running` guarantees thread writes flush to main RAM and establishes a happens-before order.", code: "private volatile boolean running = true;\npublic void stop() { running = false; }", sandbox: "System.out.println(\"Java Memory Model: thread visibility ensured via volatile.\");" },
        drill: { title: "Volatile Atomic Increments", prompt: "Does `volatile int count; count++;` guarantee thread-safety?", code: "volatile int count = 0;\ncount++; // Thread-safe?", options: [{ text: "No, count++ is 3 distinct operations (read, modify, write)", isCorrect: true, feedback: "🎯 Correct! volatile provides visibility, NOT atomicity. Use AtomicInteger." }, { text: "Yes, volatile makes all math atomic", isCorrect: false, feedback: "Atomic operations require hardware CAS or synchronization." }] },
        pitfall: { title: "Double-Checked Locking Without Volatile", content: "Lazy singleton initialization without `volatile` causes partially constructed objects to be published due to CPU instruction reordering!", code: "private static volatile Singleton instance;", tip: "Hacker Rule: Always mark double-checked locking instances as volatile.", target: "game.html?lang=java&diff=expert&stage=1" }
      }
    ]
  },

  // 5. Cyber & Linux
  {
    lang: "cyber",
    modules: [
      { id: "cyber-les-001", diff: "beginner", topic: "Filesystem Hierarchy & Paths", title: "Linux FHS, Absolute vs Relative Paths", tagline: "Navigate Linux virtual file hierarchies like a systems engineer.",
        concept: { title: "Everything in Unix is a File", content: "Linux organizes all filesystems into a single unified root `/`. Relative paths start from `$PWD`, while absolute paths always begin with `/`.", code: "pwd\ncd /home/hacker\nls -la", sandbox: "pwd\nls -la\nwhoami" },
        drill: { title: "Path Navigation", prompt: "What does the path `../` represent in Unix shells?", code: "cd ../", options: [{ text: "The immediate parent directory of current working directory", isCorrect: true, feedback: "🎯 Correct! .. represents the parent directory." }, { text: "The root directory /", isCorrect: false, feedback: "Root is strictly /." }] },
        pitfall: { title: "Accidental Root Execution", content: "Running commands with unquoted variable paths `rm -rf $DIR/` when $DIR is empty evaluates to `rm -rf /`!", code: "// ❌ Catastrophic: rm -rf $DIR/\n// ✅ Safe: [ -n \"$DIR\" ] && rm -rf \"$DIR/\"", tip: "Hacker Rule: Always quote variables `\"$VAR\"` in shell scripts.", target: "game.html?lang=cyber&diff=beginner&stage=1" }
      },
      { id: "cyber-les-002", diff: "intermediate", topic: "Permissions & SUID", title: "Octal Permissions, SUID & Privilege Escalation", tagline: "Decode rwxr-xr-x and understand how SUID binaries run as root.",
        concept: { title: "Octal Bits (r=4, w=2, x=1) & The SUID 4000 Bit", content: "Permissions are divided into Owner, Group, and Others. A binary with SUID bit set (`chmod 4755`) executes with the file owner's privileges (often root)!", code: "chmod 755 script.sh # rwxr-xr-x\nchmod 4755 /usr/bin/passwd # SUID root", sandbox: "ls -l /etc/passwd" },
        drill: { title: "Octal Permission Translation", prompt: "What permissions does `chmod 644 filename` set?", code: "chmod 644 notes.txt", options: [{ text: "Owner: rw-, Group: r--, Others: r--", isCorrect: true, feedback: "🎯 Correct! 6=4+2 (rw), 4=read only." }, { text: "Full access for everyone", isCorrect: false, feedback: "That would be 777." }] },
        pitfall: { title: "Writable SUID Scripts", content: "If a SUID binary or script is writable by non-root users (`-rwsrwxrwx`), anyone can overwrite it to obtain instant root shell access!", code: "find / -perm -4000 -type f 2>/dev/null", tip: "Hacker Rule: SUID binaries must never be writable by non-owners.", target: "game.html?lang=cyber&diff=intermediate&stage=1" }
      },
      { id: "cyber-les-003", diff: "intermediate", topic: "Pipes & Streams", title: "File Descriptors (0, 1, 2), Pipes & Redirection", tagline: "Chain complex pipelines using standard streams (stdin, stdout, stderr).",
        concept: { title: "Unix Streams: 0 (stdin), 1 (stdout), 2 (stderr)", content: "Pipes `|` connect stdout of one program to stdin of the next. Redirections `>` write files, while `2>&1` redirects stderr into stdout.", code: "cat /var/log/auth.log | grep 'Failed' | wc -l\ncommand > output.txt 2>&1", sandbox: "echo 'SyntaxArena Pipeline Test' | base64" },
        drill: { title: "Stderr Redirection", prompt: "How do you discard all error output in bash without displaying it?", code: "find / -name flag.txt ...", options: [{ text: "2>/dev/null", isCorrect: true, feedback: "🎯 Correct! 2> redirects file descriptor 2 (stderr) to the black hole /dev/null." }, { text: "1>/dev/null", isCorrect: false, feedback: "1> discards standard output, not errors." }] },
        pitfall: { title: "Truncation with Single Greater-Than", content: "Using `>` instantly truncates and overwrites an existing file to zero bytes! Use `>>` to safely append.", code: "echo 'log' > file.txt # Overwrites everything!\necho 'log' >> file.txt # Appends safely", tip: "Hacker Rule: Double-check > vs >> in production automation scripts.", target: "game.html?lang=cyber&diff=intermediate&stage=1" }
      },
      { id: "cyber-les-004", diff: "expert", topic: "Shell Globbing vs Regex", title: "Wildcard Shell Globbing vs Regular Expressions", tagline: "Distinguish between filename expansions and grep search patterns.",
        concept: { title: "Shell Globbing Matches Filenames; Regex Matches Text", content: "In bash, `*.txt` is evaluated by the shell *before* the command executes. In `grep`, `.*` is a regex matching any character sequence.", code: "ls *.log # Shell expansion\ngrep -E '^[0-9]+' access.log # Regular expression", sandbox: "cat /etc/hosts | grep 'syntaxarena'" },
        drill: { title: "Glob Argument Injection", prompt: "What dangerous behavior occurs if a filename in current directory starts with `-la` when executing `ls *`?", code: "// A file named '-la' exists", options: [{ text: "The shell expands it into flags, executing ls -la unexpectedly", isCorrect: true, feedback: "🎯 Correct! Globbing injects arbitrary flags into shell utilities." }, { text: "The shell ignores files starting with hyphens", isCorrect: false, feedback: "Globs expand all matching filenames blindly." }] },
        pitfall: { title: "Unquoted Wildcards in Tar/Chown", content: "Tools like tar or chmod are vulnerable to wildcard argument injection if directories contain filenames crafted like `--checkpoint`.", code: "tar cf archive.tar * # Exploit vector if malicious filenames exist!", tip: "Hacker Rule: Use `--` to terminate flag parsing before wildcards: `rm -- *`.", target: "game.html?lang=cyber&diff=expert&stage=1" }
      },
      { id: "cyber-les-005", diff: "expert", topic: "Forensics & Log Analysis", title: "Authentication Log Forensics & Brute-Force Triage", tagline: "Extract threat intelligence and attack signatures from system logs.",
        concept: { title: "Triage Authentication Logs with AWK, Grep & Cut", content: "Security responders trace SSH brute force attempts by filtering `Failed password` events in `/var/log/auth.log` and grouping attacking source IPs.", code: "grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr", sandbox: "cat /var/log/auth.log | grep 'Failed password'" },
        drill: { title: "Detecting Lateral Movement", prompt: "What does `sudo[1420]: hacker : COMMAND=/bin/cat /etc/shadow` in auth.log indicate?", code: "// Log line inspection", options: [{ text: "User hacker successfully executed sudo to inspect password hashes", isCorrect: true, feedback: "🎯 Correct! Sudo logs record exact user and command executed with elevated rights." }, { text: "Failed password attempt", isCorrect: false, feedback: "The log line confirms command execution." }] },
        pitfall: { title: "Log Tampering via Log Injection", content: "Writing unescaped user input into logs allows attackers to inject newline characters `\\n` and forge fake administrative events!", code: "logger -t auth \"User admin login\\nDec 25 root: ACCESS GRANTED\"", tip: "Hacker Rule: Sanitize carriage returns and newlines before writing log records.", target: "game.html?lang=cyber&diff=expert&stage=1" }
      }
    ]
  },

  // 6. JavaScript
  {
    lang: "javascript",
    modules: [
      { id: "js-les-001", diff: "beginner", topic: "Type Coercion & Equality", title: "Type Coercion, Falsy Values & Strict Equality (===)", tagline: "Master JavaScript's implicit conversion algorithm.",
        concept: { title: "Strict Equality (===) Checks Types Without Coercion", content: "Loose equality `==` uses complex type coercion rules that produce counterintuitive results (`[] == false`). Always use `===` to verify both type and value.", code: "console.log(0 == false);  // true\nconsole.log(0 === false); // false\nconsole.log([] == ![]);   // true!", sandbox: "console.log('0 == false:', 0 == false);\nconsole.log('0 === false:', 0 === false);" },
        drill: { title: "Truthy/Falsy Check", prompt: "Which of the following is TRUTHY in JavaScript?", code: "// Truthy evaluation", options: [{ text: "[] (empty array)", isCorrect: true, feedback: "🎯 Correct! All objects (including arrays and empty objects) are truthy in JS." }, { text: "0", isCorrect: false, feedback: "0 is falsy." }, { text: "'' (empty string)", isCorrect: false, feedback: "Empty string is falsy." }, { text: "NaN", isCorrect: false, feedback: "NaN is falsy." }] },
        pitfall: { title: "typeof null Quirk", content: "Due to a 1995 legacy bug in JS type tags, `typeof null === 'object'`. Check for null explicitly with `val === null`.", code: "// ❌ BUG: typeof null === 'object'\n// ✅ FIX: val !== null && typeof val === 'object'", tip: "Hacker Rule: Always check `val !== null` before object property access.", target: "game.html?lang=javascript&diff=beginner&stage=1" }
      },
      { id: "js-les-002", diff: "intermediate", topic: "Closures & Lexical Scope", title: "Lexical Scope, Closures & Private State", tagline: "Harness functions remembering their lexical birthplace.",
        concept: { title: "Closures Retain References to Outer Scope", content: "A closure is a function bundled together with references to its surrounding state. Even after the outer function returns, the inner function retains full access to outer variables.", code: "function counter() {\n    let n = 0;\n    return () => ++n;\n}\nconst c = counter();\nconsole.log(c(), c()); // 1, 2", sandbox: "function makePrefix(p) {\n    return (s) => p + ' ' + s;\n}\nconst greet = makePrefix('Cyber');\nconsole.log(greet('Warrior'));" },
        drill: { title: "Var in For-Loops", prompt: "What does this loop print?", code: "for(var i=0; i<3; i++) {\n    setTimeout(() => console.log(i), 0);\n}", options: [{ text: "3 3 3", isCorrect: true, feedback: "🎯 Correct! var has function scope; all callbacks share the single final value of i (3)." }, { text: "0 1 2", isCorrect: false, feedback: "To print 0 1 2, declare the loop variable with let." }] },
        pitfall: { title: "Accidental Memory Leaks via Closures", content: "A closure retaining a reference to a single variable from a huge outer scope keeps the *entire* outer lexical environment alive in memory!", code: "// Split giant buffers out of closure scopes if long-lived.", tip: "Hacker Rule: Set unnecessary large variables to null when closing over scopes.", target: "game.html?lang=javascript&diff=intermediate&stage=1" }
      },
      { id: "js-les-003", diff: "intermediate", topic: "Prototypes & Inheritance", title: "The Prototype Chain: __proto__ vs prototype", tagline: "Demystify delegation-based inheritance in modern JavaScript.",
        concept: { title: "JavaScript Objects Delegate to Prototypes", content: "When accessing `obj.prop`, if the property does not exist on `obj`, the engine walks up `obj.__proto__` until found or hitting `null`. Classes in JS are syntactic sugar over this prototype chain.", code: "const proto = { power: 100 };\nconst hero = Object.create(proto);\nconsole.log(hero.power); // 100 (delegated!)", sandbox: "const p = { role: 'Hacker' };\nconst u = Object.create(p);\nconsole.log('Role:', u.role);" },
        drill: { title: "Prototype Property Lookup", prompt: "Where does `Object.prototype.__proto__` point?", code: "Object.prototype.__proto__", options: [{ text: "null (the root of the prototype chain)", isCorrect: true, feedback: "🎯 Correct! The prototype chain ends at null." }, { text: "undefined", isCorrect: false, feedback: "It explicitly terminates at null." }] },
        pitfall: { title: "Modifying Object.prototype (Prototype Pollution)", content: "Writing properties to `Object.prototype` pollutes every object in the JavaScript runtime, creating catastrophic security vulnerabilities!", code: "// ❌ CATASTROPHIC:\nObject.prototype.isAdmin = true; // Every object now has isAdmin = true!", tip: "Hacker Rule: Use Object.create(null) for dictionary maps with zero prototype inheritance.", target: "game.html?lang=javascript&diff=intermediate&stage=1" }
      },
      { id: "js-les-004", diff: "expert", topic: "Event Loop & Asynchrony", title: "Event Loop: Call Stack, Microtasks & Macrotasks", tagline: "Sequence microtasks (Promises) and macrotasks (setTimeout) with precision.",
        concept: { title: "Microtasks Always Run Before the Next Macrotask", content: "The JS runtime executes synchronous code on the Call Stack. When clear, the engine drains the **entire Microtask Queue** (Promise callbacks, queueMicrotask) before picking a single Macrotask (setTimeout, setInterval).", code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');\n// Output: 1, 4, 3, 2", sandbox: "console.log('A');\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');" },
        drill: { title: "Microtask Queue Execution Order", prompt: "What is printed first: a resolved Promise.then() callback or a setTimeout(..., 0)?", code: "setTimeout(f1, 0);\nPromise.resolve().then(f2);", options: [{ text: "f2 (Microtask queue runs first)", isCorrect: true, feedback: "🎯 Correct! The microtask queue has strict priority over task queues." }, { text: "f1 (Macrotask runs first)", isCorrect: false, feedback: "Macrotasks must wait for the microtask queue to be completely empty." }] },
        pitfall: { title: "Starving the Event Loop with Recursive Microtasks", content: "Recursively scheduling microtasks (`queueMicrotask()`) prevents the engine from ever reaching macrotasks, UI rendering, or I/O events!", code: "function starve() { Promise.resolve().then(starve); }\n// Freezes browser tab completely!", tip: "Hacker Rule: Use setTimeout for cooperative background polling loops.", target: "game.html?lang=javascript&diff=expert&stage=1" }
      },
      { id: "js-les-005", diff: "expert", topic: "The this Keyword Binding", title: "The 4 Rules of `this`: Default, Implicit, Explicit & Arrow", tagline: "Predict exactly what `this` evaluates to in any execution context.",
        concept: { title: "This Depends on How the Function Was Called", content: "In standard functions, `this` is bound at call time: 1. `new F()` -> newly created object, 2. `f.call(obj)` -> explicit obj, 3. `obj.f()` -> implicit obj, 4. standalone `f()` -> global/undefined in strict mode.\n\nArrow functions do NOT bind `this`; they inherit lexically!", code: "const obj = {\n    val: 42,\n    arrow: () => console.log(this.val), // Lexical this!\n    regular() { console.log(this.val); } // Implicit this!\n};", sandbox: "const o = { val: 99, get() { return this.val; } };\nconsole.log(o.get());" },
        drill: { title: "Method Extraction Detachment", prompt: "What happens when you extract a method `const fn = obj.method; fn();` in strict mode?", code: "const fn = obj.method;\nfn();", options: [{ text: "this becomes undefined (lost implicit binding)", isCorrect: true, feedback: "🎯 Correct! Detaching the method converts it to a default function invocation with this=undefined." }, { text: "this remains bound to obj", isCorrect: false, feedback: "Call-site rules determine this for non-arrow functions." }] },
        pitfall: { title: "Arrow Functions as Object Methods", content: "Using arrow functions for object methods causes `this` to point to global `window`/`globalThis` instead of the enclosing object!", code: "// ❌ BUG:\nconst user = {\n    name: 'Neo',\n    greet: () => `Hi, ${this.name}` // this.name is undefined!\n};", tip: "Hacker Rule: Use concise method syntax `greet() {}` on object literals.", target: "game.html?lang=javascript&diff=expert&stage=1" }
      }
    ]
  },

  // 7. Rust
  {
    lang: "rust",
    modules: [
      { id: "rust-les-001", diff: "beginner", topic: "Immutability & Shadowing", title: "Immutability by Default & Variable Shadowing", tagline: "Learn why Rust variables are immutable by default and how shadowing transforms state.",
        concept: { title: "Variables are Immutable Unless Declared With mut", content: "Rust enforces memory safety through strict compiler invariants. Rebinding a variable with `let x = ...` shadows previous declarations without mutating in place.", code: "let x = 5;\nlet x = x + 1; // Shadowed! New variable, can even change type\nlet mut y = 10;\ny = 20; // Mutable assignment", sandbox: "let x = 5;\nlet x = x * 2;\nprintln!(\"x is: {}\", x);" },
        drill: { title: "Shadowing Type Change", prompt: "Can variable shadowing change the type of a variable in Rust?", code: "let spaces = \"   \";\nlet spaces = spaces.len();", options: [{ text: "Yes, shadowing creates a brand new variable with its own type", isCorrect: true, feedback: "🎯 Correct! Shadowing allows reusing names across transformations without temporary variable names." }, { text: "No, types are permanently locked", isCorrect: false, feedback: "mut cannot change type, but shadowing can." }] },
        pitfall: { title: "Accidental Mutability", content: "Adding `mut` everywhere defeats the compiler's ability to track invariants and verify thread-safety.", code: "let mut x = 10; // Avoid mut if value is never reassigned", tip: "Hacker Rule: Default to immutable `let`; add `mut` only when strictly necessary.", target: "game.html?lang=rust&diff=beginner&stage=1" }
      },
      { id: "rust-les-002", diff: "intermediate", topic: "Ownership & Move Semantics", title: "Ownership, Move Semantics & Affine Types", tagline: "Understand why passing values transfers exclusive ownership in Rust.",
        concept: { title: "Each Value Has Exactly One Owner at Any Time", content: "When an owner goes out of scope, Rust automatically drops the value and frees heap memory. Assigning a heap value to another variable **moves** ownership; the original variable becomes invalid!", code: "let s1 = String::from(\"hello\");\nlet s2 = s1; // MOVED! s1 is no longer valid!\n// println!(\"{}\", s1); // Compile error!", sandbox: "let s = String::from(\"Rust\");\nprintln!(\"Length: {}\", s.len());" },
        drill: { title: "Copy vs Move Types", prompt: "Why does `let x = 5; let y = x;` allow using `x` afterwards, while `String` does not?", code: "let x = 5; let y = x;", options: [{ text: "Primitive integers implement the Copy trait (stack bitwise copy)", isCorrect: true, feedback: "🎯 Correct! Types with Copy trait are duplicated on the stack rather than moved." }, { text: "Integers are stored in static RAM", isCorrect: false, feedback: "Primitives live on the stack and copy trivially." }] },
        pitfall: { title: "Cloning Everywhere to Satisfy the Compiler", content: "Calling `.clone()` on massive structs masks design issues and creates heavy heap allocation overhead.", code: "// ❌ Anti-pattern: obj.clone() on every function call", tip: "Hacker Rule: Borrow references (&T) instead of cloning owned data.", target: "game.html?lang=rust&diff=intermediate&stage=1" }
      },
      { id: "rust-les-003", diff: "intermediate", topic: "The Borrow Checker", title: "The Borrow Checker & The Aliasing XOR Mutability Rule", tagline: "Prevent data races at compile time with Rust's fundamental reference rule.",
        concept: { title: "Aliasing XOR Mutability: Many Readers OR Exactly One Writer", content: "At any point in code, you may have **either** any number of immutable references (`&T`) **or** exactly one mutable reference (`&mut T`), but never both simultaneously!", code: "let mut s = String::from(\"hello\");\nlet r1 = &s; // OK\nlet r2 = &s; // OK (multiple readers)\n// let r3 = &mut s; // COMPILE ERROR! Cannot borrow mutably while shared!", sandbox: "let mut data = 10;\n{\n    let ref_mut = &mut data;\n    *ref_mut += 5;\n}\nprintln!(\"Data: {}\", data);" },
        drill: { title: "Simultaneous Mutable Borrows", prompt: "Can you create two mutable references to the same variable in the same scope?", code: "let mut x = 10;\nlet r1 = &mut x;\nlet r2 = &mut x;", options: [{ text: "No, only one active mutable reference is permitted at a time", isCorrect: true, feedback: "🎯 Correct! Exclusive write access prevents data races and iterator invalidation." }, { text: "Yes, if they are not used simultaneously", isCorrect: false, feedback: "Overlapping active lifetimes trigger compile errors." }] },
        pitfall: { title: "Iterator Invalidation Prevention", content: "Modifying a collection while iterating over it is a classic C++ crash. Rust's borrow checker rejects it at compile time!", code: "let mut v = vec![1, 2];\nfor i in &v { v.push(*i); } // Compiler rejects iterator invalidation!", tip: "Hacker Rule: Collect modifications into a separate vector or index explicitly.", target: "game.html?lang=rust&diff=intermediate&stage=1" }
      },
      { id: "rust-les-004", diff: "expert", topic: "Lifetimes & References", title: "Explicit Lifetimes ('a) & Invariant Guarantees", tagline: "Teach the compiler the relationship between input and output references.",
        concept: { title: "Lifetimes Ensure References Never Outlive Their Referents", content: "Lifetimes (`'a`) do not change how long a value lives; they describe the relationship between references to prove that returning a reference is safe.", code: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}", sandbox: "println!(\"Lifetimes guarantee zero dangling references in Rust.\");" },
        drill: { title: "Lifetime Elision", prompt: "When a function takes a single reference `&self` and returns a reference, what lifetime does the compiler infer?", code: "fn get(&self) -> &str", options: [{ text: "The output lifetime is inferred to be the same as &self", isCorrect: true, feedback: "🎯 Correct! Lifetime elision rules tie output reference to input self reference." }, { text: "'static lifetime", isCorrect: false, feedback: "Static references require explicit 'static annotation." }] },
        pitfall: { title: "Self-Referential Structs", content: "Creating a struct where one field references another field inside the same struct is impossible in safe Rust due to pointer movement in memory.", code: "// Use indexes or generational arenas instead of self-references.", tip: "Hacker Rule: Store integer IDs/indices instead of raw references inside structs.", target: "game.html?lang=rust&diff=expert&stage=1" }
      },
      { id: "rust-les-005", diff: "expert", topic: "Interior Mutability & Concurrency", title: "Interior Mutability (RefCell) & Thread-Safe Pointers (Arc)", tagline: "Mutate data through immutable references safely with runtime checks.",
        concept: { title: "RefCell Checks Borrows at Runtime; Arc Shares Across Threads", content: "`RefCell<T>` moves borrow checking from compile-time to runtime, allowing mutation through `&T`. For multi-threaded sharing, wrap data in `Arc<Mutex<T>>`.", code: "use std::cell::RefCell;\nlet cell = RefCell::new(42);\n*cell.borrow_mut() += 1;", sandbox: "println!(\"Arc<Mutex<T>> guarantees data-race free thread safety.\");" },
        drill: { title: "RefCell Panic", prompt: "What happens if code simultaneously creates two active `borrow_mut()` handles on the same `RefCell`?", code: "let c = RefCell::new(1);\nlet m1 = c.borrow_mut();\nlet m2 = c.borrow_mut();", options: [{ text: "The thread panics at runtime (BorrowMutError)", isCorrect: true, feedback: "🎯 Correct! RefCell enforces the borrowing rules dynamically by panicking." }, { text: "Undefined behavior occurs", isCorrect: false, feedback: "RefCell guarantees safe panic rather than undefined behavior." }] },
        pitfall: { title: "Deadlocks with Nested Mutexes", content: "Acquiring multiple `Mutex` locks in inconsistent order across threads leads to classic cyclic deadlocks.", code: "// Always acquire locks in a globally consistent order.", tip: "Hacker Rule: Keep lock scopes minimal using localized block scopes `{ ... }`.", target: "game.html?lang=rust&diff=expert&stage=1" }
      }
    ]
  },

  // 8. SQL
  {
    lang: "sql",
    modules: [
      { id: "sql-les-001", diff: "beginner", topic: "Relational Queries & Precedence", title: "SELECT Filtering & AND/OR Operator Precedence", tagline: "Prevent catastrophic query logic flaws by understanding SQL evaluation order.",
        concept: { title: "AND Has Higher Precedence Than OR in SQL", content: "In SQL, `AND` evaluates before `OR`. Writing `WHERE role='admin' OR role='mod' AND active=1` will select all admins regardless of whether active=1!", code: "-- ❌ BUGGY:\nSELECT * FROM users WHERE role = 'admin' OR role = 'mod' AND active = 1;\n-- ✅ INTENDED:\nSELECT * FROM users WHERE (role = 'admin' OR role = 'mod') AND active = 1;", sandbox: "SELECT username, role, xp FROM users WHERE role = 'admin';" },
        drill: { title: "Logical Precedence Check", prompt: "How should conditions with mixed AND/OR be structured for predictable query execution?", code: "WHERE a OR b AND c", options: [{ text: "Always wrap intended logical groupings in explicit parentheses ()", isCorrect: true, feedback: "🎯 Correct! Parentheses remove all operator precedence ambiguity." }, { text: "Always place AND before OR", isCorrect: false, feedback: "Placement order does not override precedence rules." }] },
        pitfall: { title: "SELECT * in Production APIs", content: "Using `SELECT *` breaks caching, transfers unnecessary column payloads, and crashes applications when columns are added or reordered.", code: "-- ❌ Anti-pattern: SELECT * FROM audit_logs\n-- ✅ Best Practice: SELECT id, action, status FROM audit_logs", tip: "Hacker Rule: Explicitly name all projected columns.", target: "game.html?lang=sql&diff=beginner&stage=1" }
      },
      { id: "sql-les-002", diff: "intermediate", topic: "Joins & Cartesian Products", title: "INNER vs OUTER Joins & Cartesian Multiplications", tagline: "Join relational tables without accidentally dropping or duplicating rows.",
        concept: { title: "INNER Drops Unmatched Rows; LEFT JOIN Preserves Left Table", content: "An `INNER JOIN` only returns rows where the join condition matches on both sides. A `LEFT JOIN` returns every row from the left table, filling missing right-side values with `NULL`.", code: "SELECT u.username, l.action\nFROM users u\nLEFT JOIN audit_logs l ON u.id = l.user_id;", sandbox: "SELECT u.username, l.action FROM users u JOIN audit_logs l ON u.id = l.user_id;" },
        drill: { title: "Unmatched Row Preservation", prompt: "Which join returns all users even if they have zero records in the audit_logs table?", code: "SELECT ... FROM users ... audit_logs", options: [{ text: "LEFT JOIN audit_logs ON users.id = audit_logs.user_id", isCorrect: true, feedback: "🎯 Correct! LEFT JOIN retains all rows from the primary left table." }, { text: "INNER JOIN", isCorrect: false, feedback: "INNER JOIN drops users without matching logs." }] },
        pitfall: { title: "Filtering Left Joined Tables in WHERE Clause", content: "Putting a condition on the right table in the `WHERE` clause (like `WHERE logs.status = '200'`) converts the LEFT JOIN back into an INNER JOIN!", code: "-- ❌ CONVERTS TO INNER JOIN: WHERE l.status = 'OK'\n-- ✅ PRESERVES LEFT JOIN: Put condition in ON clause: ON u.id = l.user_id AND l.status = 'OK'", tip: "Hacker Rule: Filter optional tables in the ON clause, not the WHERE clause.", target: "game.html?lang=sql&diff=intermediate&stage=1" }
      },
      { id: "sql-les-003", diff: "intermediate", topic: "Aggregations & Grouping", title: "GROUP BY Aggregations & WHERE vs HAVING Filtering", tagline: "Filter pre-aggregation rows vs post-aggregation summaries cleanly.",
        concept: { title: "WHERE Filters Rows; HAVING Filters Aggregated Groups", content: "The `WHERE` clause filters individual records before grouping. The `HAVING` clause filters calculated group totals (like `COUNT(*)` or `SUM(xp)`) *after* grouping.", code: "SELECT role, COUNT(*), AVG(xp) FROM users\nWHERE active = 1\nGROUP BY role\nHAVING COUNT(*) >= 2;", sandbox: "SELECT role, COUNT(*) as cnt FROM users GROUP BY role;" },
        drill: { title: "HAVING vs WHERE", prompt: "Can you filter on aggregate functions like `COUNT(*)` inside a `WHERE` clause?", code: "WHERE COUNT(*) > 5", options: [{ text: "No, aggregate functions are illegal in WHERE; use HAVING instead", isCorrect: true, feedback: "🎯 Correct! WHERE runs prior to aggregation; HAVING runs after." }, { text: "Yes, in all SQL dialects", isCorrect: false, feedback: "All standard SQL engines reject aggregates in WHERE." }] },
        pitfall: { title: "Selecting Non-Aggregated Columns", content: "Selecting columns that are neither included in the `GROUP BY` clause nor wrapped in an aggregate function triggers SQL errors in standard SQL mode.", code: "SELECT role, username, AVG(xp) FROM users GROUP BY role; -- Error!", tip: "Hacker Rule: Every non-aggregated column in SELECT must be in GROUP BY.", target: "game.html?lang=sql&diff=intermediate&stage=1" }
      },
      { id: "sql-les-004", diff: "expert", topic: "Three-Valued Logic & NULLs", title: "Three-Valued Logic (3VL) & The NOT IN NULL Trap", tagline: "Master TRUE, FALSE, and UNKNOWN to eliminate vanishing query results.",
        concept: { title: "NULL Comparisons Return UNKNOWN, Never TRUE or FALSE", content: "In SQL, `NULL = NULL` evaluates to `UNKNOWN` (falsy in WHERE). You must always compare using `IS NULL` or `IS NOT NULL`.\n\nEven more dangerous: `x NOT IN (1, 2, NULL)` evaluates to UNKNOWN for every row, returning 0 rows!", code: "-- ❌ RETURNS ZERO ROWS:\nSELECT * FROM users WHERE id NOT IN (SELECT user_id FROM audit_logs); -- if any user_id is NULL!\n-- ✅ SAFE:\nSELECT * FROM users u WHERE NOT EXISTS (SELECT 1 FROM audit_logs l WHERE l.user_id = u.id);", sandbox: "SELECT * FROM users WHERE active IS NOT NULL;" },
        drill: { title: "NULL Equality Evaluation", prompt: "What does the expression `NULL = NULL` return in standard SQL?", code: "SELECT 1 WHERE NULL = NULL;", options: [{ text: "UNKNOWN (which evaluates as falsy in WHERE filter)", isCorrect: true, feedback: "🎯 Correct! NULL represents missing information; two unknowns cannot be equal." }, { text: "TRUE", isCorrect: false, feedback: "NULL is never equal to anything, including itself." }, { text: "FALSE", isCorrect: false, feedback: "It returns the third truth value: UNKNOWN." }] },
        pitfall: { title: "NOT IN Subquery with NULLs", content: "If a subquery returns even a single `NULL` value, `NOT IN` fails completely and returns zero records.", code: "// Always prefer NOT EXISTS over NOT IN for subquery anti-joins.", tip: "Hacker Rule: Use NOT EXISTS instead of NOT IN for safe relational exclusion.", target: "game.html?lang=sql&diff=expert&stage=1" }
      },
      { id: "sql-les-005", diff: "expert", topic: "Window Functions & CTEs", title: "Window Functions (OVER, PARTITION BY) & CTEs", tagline: "Perform ranking and running calculations without collapsing rows.",
        concept: { title: "Window Functions Calculate Across Row Sets Without Grouping", content: "Unlike `GROUP BY`, window functions (`ROW_NUMBER()`, `RANK()`, `SUM() OVER ()`) calculate analytics across a partition while retaining every individual row in the result set.", code: "SELECT username, role, xp,\n       RANK() OVER (PARTITION BY role ORDER BY xp DESC) as rank_in_role\nFROM users;", sandbox: "SELECT username, xp FROM users ORDER BY xp DESC;" },
        drill: { title: "ROW_NUMBER vs RANK", prompt: "What happens when two rows have identical values when using `RANK()` vs `ROW_NUMBER()`?", code: "// Ties in ranking", options: [{ text: "RANK assigns identical numbers to ties and skips the next number; ROW_NUMBER assigns distinct consecutive integers", isCorrect: true, feedback: "🎯 Correct! RANK assigns 1, 1, 3; ROW_NUMBER assigns 1, 2, 3." }, { text: "They behave identically", isCorrect: false, feedback: "Their handling of duplicate values is fundamentally different." }] },
        pitfall: { title: "Filtering Window Functions Directly in WHERE", content: "Window functions execute *after* the WHERE clause; attempting `WHERE ROW_NUMBER() OVER (...) = 1` causes an immediate SQL syntax error! Wrap in a CTE.", code: "WITH Ranked AS (\n    SELECT *, ROW_NUMBER() OVER (ORDER BY xp DESC) as rnk FROM users\n)\nSELECT * FROM Ranked WHERE rnk <= 3;", tip: "Hacker Rule: Use Common Table Expressions (WITH ...) to filter on window outputs.", target: "game.html?lang=sql&diff=expert&stage=1" }
      }
    ]
  },

  // 9. TypeScript
  {
    lang: "typescript",
    modules: [
      { id: "ts-les-001", diff: "beginner", topic: "Inference vs Annotations", title: "Static Type Inference vs Explicit Type Annotations", tagline: "Let the compiler work for you without redundant type clutter.",
        concept: { title: "TypeScript Infers Types Automatically When Initialized", content: "Declaring `let count: number = 0;` is redundant. TypeScript automatically infers primitive and object types from initial values.", code: "let score = 100; // Inferred as number\n// score = 'high'; // Type error!", sandbox: "const appName: string = 'SyntaxArena';\nconsole.log(appName);" },
        drill: { title: "any vs unknown", prompt: "Why is `unknown` preferred over `any` for untyped external inputs?", code: "let data: unknown;", options: [{ text: "unknown forces type narrowing checks before accessing properties", isCorrect: true, feedback: "🎯 Correct! unknown is type-safe; any completely disables type checking." }, { text: "unknown compiles to faster JavaScript", isCorrect: false, feedback: "Types are stripped completely at runtime." }] },
        pitfall: { title: "The any Virus", content: "Assigning `any` spreads silently across your codebase, turning off type safety for any expression it touches.", code: "const p: any = fetch(); // Disables safety everywhere p flows!", tip: "Hacker Rule: Use unknown with type guards instead of any.", target: "game.html?lang=typescript&diff=beginner&stage=1" }
      },
      { id: "ts-les-002", diff: "intermediate", topic: "Structural vs Nominal Typing", title: "Structural Typing (Duck Typing) vs Nominal Systems", tagline: "Learn why TypeScript checks shapes rather than class inheritance names.",
        concept: { title: "If It Walks Like a Duck, TypeScript Accepts It", content: "Languages like Java use nominal typing: two classes with identical fields are incompatible unless sharing an explicit interface. TypeScript checks **structural shape**: if an object has the required properties, it is compatible!", code: "interface Point { x: number; y: number; }\nfunction draw(p: Point) { /* ... */ }\ndraw({ x: 10, y: 20, z: 30 }); // Compatible!", sandbox: "interface User { id: number; name: string; }\nconst u: User = { id: 1, name: 'Adept' };\nconsole.log(u.name);" },
        drill: { title: "Excess Property Checks on Literals", prompt: "Why does `draw({ x: 1, y: 2, extra: 3 })` fail when passed as an inline object literal, but succeed when passed via an intermediate variable?", code: "// Object literal excess check", options: [{ text: "TypeScript performs strict excess property checking on fresh object literals to catch typos", isCorrect: true, feedback: "🎯 Correct! Inline literals undergo excess property checking to detect misspelled properties." }, { text: "Variables allocate new types", isCorrect: false, feedback: "Structural subtyping applies to variables; literals get strict typo checks." }] },
        pitfall: { title: "Empty Object Interface {}", content: "The type `{}` matches any value that is not null or undefined, including primitives like numbers and strings!", code: "const x: {} = 42; // Valid in TypeScript!", tip: "Hacker Rule: Use Record<string, unknown> instead of {} for key-value maps.", target: "game.html?lang=typescript&diff=intermediate&stage=1" }
      },
      { id: "ts-les-003", diff: "intermediate", topic: "Discriminated Unions", title: "Discriminated Unions & Exhaustiveness Type Checking", tagline: "Model finite domain states and ensure the compiler enforces handling of every case.",
        concept: { title: "A Common Discriminant Tag Narrows Union Types", content: "By giving each variant a shared literal property like `type: 'success'`, TypeScript narrows the union within `switch` blocks automatically.", code: "type State = \n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success', data: string[] };", sandbox: "type Res = { ok: true, val: number } | { ok: false, err: string };\nconst r: Res = { ok: true, val: 42 };\nconsole.log(r.ok ? r.val : r.err);" },
        drill: { title: "The never Type for Exhaustiveness", prompt: "How do you ensure a switch block handles every possible union variant at compile time?", code: "default: const _exhaustiveCheck: never = state;", options: [{ text: "Assign unhandled cases to a variable of type never", isCorrect: true, feedback: "🎯 Correct! If a union variant is unhandled, assigning it to never causes a compile error." }, { text: "Throw an error at runtime", isCorrect: false, feedback: "Runtime errors do not catch missing cases at compile time." }] },
        pitfall: { title: "Optional Discriminant Properties", content: "Making the discriminant property optional `status?: string` breaks union discrimination and forces manual type assertions.", code: "// Discriminant keys must be required string/number literals.", tip: "Hacker Rule: Always make discriminant tag properties required literals.", target: "game.html?lang=typescript&diff=intermediate&stage=1" }
      },
      { id: "ts-les-004", diff: "expert", topic: "Const Assertions & satisfies", title: "Type Widening, Const Assertions (as const) & satisfies", tagline: "Lock down exact literal types without losing type inference flexibility.",
        concept: { title: "as const Locks Values to Read-Only Exact Literals", content: "`as const` prevents TypeScript from widening `'GET'` to `string` or arrays to mutable arrays, generating deeply read-only literal types.", code: "const routes = { home: '/', login: '/login' } as const;\n// routes.home is strictly '/' (not string)", sandbox: "const CONFIG = { theme: 'dark', version: 1 } as const;\nconsole.log(CONFIG.theme);" },
        drill: { title: "satisfies vs as", prompt: "What is the advantage of `satisfies` over `as Type` assertions?", code: "const config = { ... } satisfies RouteConfig;", options: [{ text: "satisfies validates the type while preserving the narrower inferred literal types", isCorrect: true, feedback: "🎯 Correct! satisfies enforces contract without widening literal types or disabling safety." }, { text: "satisfies converts types at runtime", isCorrect: false, feedback: "TypeScript types do not exist at runtime." }] },
        pitfall: { title: "Type Assertions (as T) Bypassing Type Safety", content: "Using `as unknown as User` tells the compiler to shut up, masking critical schema mismatches that crash at runtime.", code: "const u = {} as User; // Dangerous lie! u lacks required fields!", tip: "Hacker Rule: Use type guards or validation libraries (Zod) instead of as T.", target: "game.html?lang=typescript&diff=expert&stage=1" }
      },
      { id: "ts-les-005", diff: "expert", topic: "Conditional & Mapped Types", title: "Conditional Types, Generic infer & Mapped Types", tagline: "Transform and introspect types programmatically at compile time.",
        concept: { title: "Conditional Types Choose Types via `T extends U ? X : Y`", content: "Conditional types evaluate type relationships dynamically. Combined with `infer`, you can unpack return types, promise payloads, and array elements.", code: "type UnpackPromise<T> = T extends Promise<infer U> ? U : T;\ntype Result = UnpackPromise<Promise<string>>; // string", sandbox: "type ReadonlyObj<T> = { readonly [K in keyof T]: T[K] };\nconsole.log('TypeScript type gymnastics ready.');" },
        drill: { title: "Distributive Conditional Types", prompt: "Why does `type ToArray<T> = T extends any ? T[] : never;` turn `string | number` into `string[] | number[]` instead of `(string | number)[]`?", code: "type Res = ToArray<string | number>;", options: [{ text: "Naked type parameters distribute over union members automatically", isCorrect: true, feedback: "🎯 Correct! Bare generic parameters distribute over unions unless wrapped in tuples [T]." }, { text: "It is a compiler bug", isCorrect: false, feedback: "Distributive conditional types are a core language feature." }] },
        pitfall: { title: "Infinite Type Instantiation Depth", content: "Complex recursive conditional types exceeding depth limits crash the TypeScript compiler with `Type instantiation is excessively deep`.", code: "// Always provide a recursion depth counter or base termination check.", tip: "Hacker Rule: Wrap tuple bounds `[T] extends [never]` to disable unintended distribution.", target: "game.html?lang=typescript&diff=expert&stage=1" }
      }
    ]
  },

  // 10. Go (Golang)
  {
    lang: "go",
    modules: [
      { id: "go-les-001", diff: "beginner", topic: "Explicit Types & Zero Values", title: "Zero Values, Explicit Types & Short Variable Declarations", tagline: "Learn Go's predictable memory initialization guarantees.",
        concept: { title: "Variables in Go are Always Initialized to Zero Values", content: "In Go, there is no uninitialized memory. Every variable is automatically set to its type's zero value (0 for numbers, false for booleans, \"\" for strings, nil for pointers/slices).", code: "var count int       // initialized to 0\nvar active bool     // initialized to false\nmsg := \"Hello, Go\"  // short variable declaration", sandbox: "package main\nimport \"fmt\"\nfunc main() {\n    var x int\n    fmt.Println(\"Zero value:\", x)\n}" },
        drill: { title: "Short Declaration Scope", prompt: "Can you use short variable declaration `x := 10` outside of functions at package level?", code: "package main\nx := 10 // Legal?", options: [{ text: "No, := is only permitted inside function bodies; package level requires var", isCorrect: true, feedback: "🎯 Correct! Package-level variables must use explicit var declarations." }, { text: "Yes, anywhere in Go", isCorrect: false, feedback: "Go grammar restricts := to local block scopes." }] },
        pitfall: { title: "Shadowing in Multiple Assignment", content: "Using `res, err := work()` inside an `if` block can accidentally shadow outer variables if not careful.", code: "if res, err := get(); err != nil { /* shadows outer res */ }", tip: "Hacker Rule: Be aware of scope boundaries when using := inside control blocks.", target: "game.html?lang=go&diff=beginner&stage=1" }
      },
      { id: "go-les-002", diff: "intermediate", topic: "Slices Under the Hood", title: "Slice Architecture: Pointer, Length & Capacity", tagline: "Deconstruct how Go slices wrap underlying array memory.",
        concept: { title: "A Slice is a 3-Word Header: [Ptr, Len, Cap]", content: "A slice does not store elements itself; it is a 24-byte struct containing a pointer to a backing array, `len` (current items), and `cap` (maximum capacity before reallocation).", code: "s := make([]int, 2, 4) // len=2, cap=4\ns = append(s, 99)      // appends within existing backing array", sandbox: "package main\nimport \"fmt\"\nfunc main() {\n    s := []int{10, 20, 30}\n    fmt.Println(\"Len:\", len(s), \"Cap:\", cap(s))\n}" },
        drill: { title: "Sub-slice Backing Array Mutation", prompt: "What happens if you mutate `s2[0] = 99` where `s2 = s1[1:3]`?", code: "s1 := []int{1, 2, 3};\ns2 := s1[1:3];\ns2[0] = 99;", options: [{ text: "s1[1] is also changed to 99 because both slices share the same backing array", isCorrect: true, feedback: "🎯 Correct! Sub-slices share underlying array memory until append reallocates capacity." }, { text: "s1 remains unchanged", isCorrect: false, feedback: "Sub-slicing does not copy data; it creates a new slice header to the same memory." }] },
        pitfall: { title: "Memory Leak from Giant Backing Arrays", content: "Taking a small sub-slice of a 100MB array keeps the entire 100MB backing array pinned in RAM! Use `copy()` to isolate small slices.", code: "small := make([]byte, 10)\ncopy(small, hugeData[:10]) // Safe: allows hugeData to be garbage collected", tip: "Hacker Rule: Use copy() when retaining small slices from massive payloads.", target: "game.html?lang=go&diff=intermediate&stage=1" }
      },
      { id: "go-les-003", diff: "intermediate", topic: "Errors & Defer Stack", title: "Explicit Error Handling & LIFO defer Execution", tagline: "Write idiomatic Go without exceptions using defer and error tuples.",
        concept: { title: "Errors are Values; Defer Runs in LIFO Order on Exit", content: "Go does not use try/catch. Functions return `(T, error)` tuples. `defer` statements schedule cleanup calls that execute when the function returns in Last-In-First-Out order.", code: "f, err := os.Open(\"file.txt\")\nif err != nil { return err }\ndefer f.Close() // Guaranteed to run on function exit!", sandbox: "package main\nimport \"fmt\"\nfunc main() {\n    defer fmt.Println(\"Deferred cleanup\")\n    fmt.Println(\"Main execution\")\n}" },
        drill: { title: "Defer Argument Evaluation", prompt: "When are arguments to a `defer` function evaluated?", code: "x := 10\ndefer fmt.Println(x)\nx = 20", options: [{ text: "Immediately when the defer statement is encountered (prints 10)", isCorrect: true, feedback: "🎯 Correct! Arguments to deferred functions are evaluated immediately; execution is deferred." }, { text: "When the surrounding function returns (prints 20)", isCorrect: false, feedback: "Closure values evaluate on execution, but direct parameters evaluate immediately." }] },
        pitfall: { title: "Defer Inside Infinite Loops", content: "Putting `defer file.Close()` inside a long-running `for` loop will not release file handles until the entire function returns, causing OS handle exhaustion!", code: "// ❌ Handle leak: for (...) { f, _ := open(); defer f.Close(); }\n// ✅ Solution: Wrap loop body in an anonymous function func() { ... }()", tip: "Hacker Rule: Wrap loop iterations in closures if using defer inside loops.", target: "game.html?lang=go&diff=intermediate&stage=1" }
      },
      { id: "go-les-004", diff: "expert", topic: "Loop Variable Capture (Go 1.22+)", title: "Loop Variable Scoping & Goroutine Closure Capture", tagline: "Master the historic Go loop variable pitfall and the Go 1.22 fix.",
        concept: { title: "Go 1.22 Allocates Loop Variables Per-Iteration", content: "Prior to Go 1.22, loop variables had loop-level scope: closures launched in goroutines captured the same variable address. Go 1.22 updated the language so each iteration creates a brand new instance!", code: "for i := range 3 {\n    go func() {\n        fmt.Println(i) // In Go 1.22+, safely prints 0, 1, 2!\n    }()\n}", sandbox: "package main\nimport \"fmt\"\nfunc main() {\n    for i := range 3 {\n        fmt.Println(\"Iteration:\", i)\n    }\n}" },
        drill: { title: "Legacy Go Loop Capture", prompt: "In Go versions prior to 1.22, what did `for _, v := range list { go func() { print(v) }() }` frequently print?", code: "// Legacy Go loop capture check", options: [{ text: "The final element of list repeatedly", isCorrect: true, feedback: "🎯 Correct! In pre-1.22 Go, all goroutines shared the single mutated v variable." }, { text: "Elements in strictly sequential order", isCorrect: false, feedback: "Goroutines run concurrently and read the mutated variable." }] },
        pitfall: { title: "Running Legacy Codebases", content: "If maintaining Go code on older compilers (<1.22), you must still write `v := v` inside the loop body to avoid data races.", code: "for _, v := range list {\n    v := v // Shadow variable for legacy Go compatibility\n    go work(v)\n}", tip: "Hacker Rule: Ensure go.mod specifies go 1.22+ to benefit from per-iteration loop scoping.", target: "game.html?lang=go&diff=expert&stage=1" }
      },
      { id: "go-les-005", diff: "expert", topic: "Goroutines & Channels", title: "Goroutines, Buffered Channels & Synchronization", tagline: "Communicate sequentially through channels: Don't communicate by sharing memory.",
        concept: { title: "Channels Synchronize Concurrent Goroutines Safely", content: "Goroutines are ultra-lightweight green threads (starting at ~2KB stack). Unbuffered channels block the sender until a receiver is ready, ensuring deterministic synchronization.", code: "ch := make(chan int) // Unbuffered\ngo func() { ch <- 42 }()\nval := <-ch // Blocks until value arrives!", sandbox: "package main\nimport \"fmt\"\nfunc main() {\n    fmt.Println(\"Go concurrency ready.\")\n}" },
        drill: { title: "Unbuffered Channel Deadlock", prompt: "What happens if a single goroutine attempts to send `ch <- 1` on an unbuffered channel with no concurrent receiver?", code: "ch := make(chan int)\nch <- 1 // No receiver launched!", options: [{ text: "Fatal runtime error: all goroutines are asleep - deadlock!", isCorrect: true, feedback: "🎯 Correct! Unbuffered sends block until an independent receiver is ready; a single goroutine deadlocks itself." }, { text: "The value is buffered temporarily", isCorrect: false, feedback: "Unbuffered channels have zero capacity." }] },
        pitfall: { title: "Goroutine Leaks via Blocked Channels", content: "Launching goroutines that block forever waiting on a channel that is never written to causes silent permanent memory leaks in Go services.", code: "// Always provide context cancellation or timeout selects: select { case <-ctx.Done(): return }", tip: "Hacker Rule: Never start a goroutine without knowing how and when it will exit.", target: "game.html?lang=go&diff=expert&stage=1" }
      }
    ]
  },

  // 11. HTML5 & CSS
  {
    lang: "html",
    modules: [
      { id: "html-les-001", diff: "beginner", topic: "Semantic HTML5 & Accessibility", title: "Semantic HTML5 Landmarks & Document Accessibility", tagline: "Build structured web applications with semantic tags and screen reader accessibility.",
        concept: { title: "Semantic Tags Communicate Meaning to Assistive Tech", content: "Screen readers rely on semantic landmarks (`<main>`, `<nav>`, `<header>`, `<article>`) to navigate pages. Replacing generic `<div>` elements with semantics improves accessibility (a11y) and SEO.", code: "<header role=\"banner\">\n  <nav aria-label=\"Main navigation\">...</nav>\n</header>\n<main id=\"main-content\">...</main>", sandbox: "<header>\n  <h1>SyntaxArena</h1>\n</header>\n<main>\n  <p>Accessible Web Architecture</p>\n</main>" },
        drill: { title: "Heading Hierarchy", prompt: "How many `<h1>` elements should typically be present on an accessible web page?", code: "<h1>...</h1>", options: [{ text: "Exactly one <h1> representing the primary topic of the page", isCorrect: true, feedback: "🎯 Correct! A single h1 establishes the top-level document hierarchy." }, { text: "As many as desired for visual styling", isCorrect: false, feedback: "Headings convey document structure, not visual styling." }] },
        pitfall: { title: "Div-Buttons Lacking Keyboard Focus", content: "Building clickable buttons with `<div onclick=\"...\">` is inaccessible to keyboard users unless explicitly adding `tabindex=\"0\"` and `role=\"button\"`.", code: "// ❌ INACCESSIBLE: <div onclick=\"submit()\">Submit</div>\n// ✅ ACCESSIBLE: <button type=\"button\" onclick=\"submit()\">Submit</button>", tip: "Hacker Rule: Always use native <button> elements for interactive click targets.", target: "game.html?lang=html&diff=beginner&stage=1" }
      },
      { id: "html-les-002", diff: "intermediate", topic: "CSS Box Model", title: "The CSS Box Model: content-box vs border-box", tagline: "Calculate element geometry accurately with universal box-sizing.",
        concept: { title: "border-box Includes Padding & Border in Total Width", content: "Under default `content-box`, adding 20px padding to a 100px element makes its total rendered width 140px! Setting `box-sizing: border-box` absorbs padding and borders into the declared width.", code: "* {\n    box-sizing: border-box;\n}\n.card {\n    width: 300px; /* Stays strictly 300px regardless of padding! */\n    padding: 24px;\n    border: 2px solid cyan;\n}", sandbox: "<style>\n  .box { box-sizing: border-box; width: 100px; padding: 10px; border: 2px solid green; }\n</style>\n<div class=\"box\">Box</div>" },
        drill: { title: "Default Box-Sizing Math", prompt: "Under default `content-box`, what is the total rendered width of an element with `width: 200px; padding: 10px; border: 5px solid black;`?", code: "width: 200px; padding: 10px; border: 5px solid black;", options: [{ text: "230px (200 + 10*2 + 5*2)", isCorrect: true, feedback: "🎯 Correct! content-box adds left/right padding and border on top of width." }, { text: "200px", isCorrect: false, feedback: "border-box would be 200px; content-box expands." }] },
        pitfall: { title: "Margin Collapse Between Adjacent Blocks", content: "Vertical margins between adjacent block elements collapse into a single margin equal to the largest value, rather than adding together!", code: "p { margin-bottom: 20px; }\nh2 { margin-top: 30px; } /* Total gap is 30px, NOT 50px! */", tip: "Hacker Rule: Use CSS Flexbox/Grid gap properties to prevent margin collapse surprises.", target: "game.html?lang=html&diff=intermediate&stage=1" }
      },
      { id: "html-les-003", diff: "intermediate", topic: "Flexbox vs CSS Grid", title: "Flexbox One-Dimensional Axis vs CSS Grid 2D Systems", tagline: "Choose the right modern layout algorithm for components and pages.",
        concept: { title: "Flexbox is Content-First (1D); Grid is Layout-First (2D)", content: "Flexbox aligns items along a single axis (row or column). CSS Grid handles rows and columns simultaneously, making it ideal for overall dashboard scaffolding.", code: "/* Grid 2D Dashboard */\n.dashboard {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n    gap: 1.5rem;\n}", sandbox: "<style>\n  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }\n  .cell { background: #222; padding: 10px; color: cyan; }\n</style>\n<div class=\"grid\"><div class=\"cell\">A</div><div class=\"cell\">B</div></div>" },
        drill: { title: "Flexbox Justify vs Align", prompt: "In a default flex container (`flex-direction: row`), which property aligns items along the cross axis (vertical)?", code: "display: flex; flex-direction: row;", options: [{ text: "align-items", isCorrect: true, feedback: "🎯 Correct! justify-content controls main axis (horizontal); align-items controls cross axis (vertical)." }, { text: "justify-content", isCorrect: false, feedback: "justify-content aligns along the main axis." }] },
        pitfall: { title: "Flex Item Shrink Truncation", content: "By default, flex items have `flex-shrink: 1`, allowing them to squish below their content size. Use `flex-shrink: 0` on icons and fixed avatars.", code: ".avatar { flex-shrink: 0; width: 48px; height: 48px; }", tip: "Hacker Rule: Add flex-shrink: 0 to all fixed icons in flex rows.", target: "game.html?lang=html&diff=intermediate&stage=1" }
      },
      { id: "html-les-004", diff: "expert", topic: "Cascade & Specificity", title: "CSS Specificity Calculation & Cascade Layers (@layer)", tagline: "Master specificity math (0,0,0) and modern cascade layering.",
        concept: { title: "Specificity Hierarchy: Inline > ID > Class/Attr > Element", content: "CSS resolves conflicts by calculating specificity triplets `(ID, Class, Element)`. Modern CSS introduces `@layer` to define priority order regardless of selector specificity!", code: "@layer base, components, utilities;\n@layer components {\n    .btn { background: blue; }\n}\n@layer utilities {\n    .bg-red { background: red; } /* Wins over components! */\n}", sandbox: "<style>\n  .highlight { color: #00e5ff; font-weight: bold; }\n</style>\n<p class=\"highlight\">Cascade Verified</p>" },
        drill: { title: "Specificity Calculation", prompt: "Which selector has higher specificity: `#header .nav` or `.nav .menu .item`?", code: "#header .nav vs .nav .menu .item", options: [{ text: "#header .nav (1 ID, 1 Class beats 0 IDs, 3 Classes)", isCorrect: true, feedback: "🎯 Correct! A single ID (1,1,0) always overrides any number of class selectors (0,3,0)." }, { text: ".nav .menu .item", isCorrect: false, feedback: "Classes can never override an ID selector regardless of quantity." }] },
        pitfall: { title: "!important Specificity Wars", content: "Using `!important` overrides the normal cascade and makes CSS impossible to override cleanly without adding more `!important` flags.", code: "// Avoid !important; refactor selector specificity or use CSS cascade layers (@layer).", tip: "Hacker Rule: Never use !important in component stylesheets; use @layer instead.", target: "game.html?lang=html&diff=expert&stage=1" }
      },
      { id: "html-les-005", diff: "expert", topic: "Native Dialog & Top Layer", title: "Native <dialog> Modality, inert & The Top Layer", tagline: "Build lightweight, accessible modals without heavy JavaScript libraries.",
        concept: { title: "The Native <dialog> Renders in the Browser Top Layer", content: "Calling `dialog.showModal()` renders the modal in the browser's native **Top Layer** (above all z-indexes), traps keyboard focus inside the dialog, and styles `::backdrop` natively.", code: "const modal = document.querySelector('dialog');\nmodal.showModal(); // Opens modal with keyboard trap and backdrop\n// Pressing ESC closes it automatically!", sandbox: "<dialog id=\"d\"><p>Modal</p><button onclick=\"d.close()\">Close</button></dialog>\n<button onclick=\"d.showModal()\">Open</button>" },
        drill: { title: "show() vs showModal()", prompt: "What is the key difference between `dialog.show()` and `dialog.showModal()`?", code: "dialog.show() vs dialog.showModal()", options: [{ text: "showModal() creates a modal dialog in Top Layer with backdrop and focus trap; show() is non-modal", isCorrect: true, feedback: "🎯 Correct! showModal() provides accessibility focus trapping and backdrop rendering." }, { text: "showModal() requires external polyfills", isCorrect: false, feedback: "Both methods are native in modern browsers." }] },
        pitfall: { title: "Using display: flex on <dialog>", content: "Directly setting `display: flex` on a `<dialog>` overrides the browser's user-agent stylesheet, causing the dialog to stay visible even when closed!", code: "// ❌ BUG: dialog { display: flex; } /* Stays open! */\n// ✅ FIX: dialog[open] { display: flex; }", tip: "Hacker Rule: Target dialog[open] when overriding display properties.", target: "game.html?lang=html&diff=expert&stage=1" }
      }
    ]
  },

  // 12. Assembly & Reverse Engineering
  {
    lang: "asm",
    modules: [
      { id: "asm-les-001", diff: "beginner", topic: "x86-64 Registers & Calling Conventions", title: "General-Purpose Registers (RAX, RBX, RCX, RDX) & Calling Conventions", tagline: "Learn how modern 64-bit CPUs pass arguments and return values.",
        concept: { title: "Registers are Ultra-Fast On-Chip CPU Storage", content: "In x86-64 System V ABI (Linux/macOS), the first 6 integer function arguments are passed in registers: **RDI, RSI, RDX, RCX, R8, R9**. The return value is placed in **RAX**.", code: "mov rdi, 42   ; 1st argument\nmov rsi, 100  ; 2nd argument\ncall add_nums ; returns result in rax", sandbox: "mov rax, 42\nmov rbx, 10\nadd rax, rbx" },
        drill: { title: "Function Return Value Register", prompt: "In x86-64 assembly, which register holds the return value of an integer function?", code: "call calculate_sum\n// Where is the result?", options: [{ text: "RAX", isCorrect: true, feedback: "🎯 Correct! RAX is the designated return value register across x86-64 calling conventions." }, { text: "RSP", isCorrect: false, feedback: "RSP is the stack pointer." }, { text: "RDI", isCorrect: false, feedback: "RDI holds the first function parameter." }] },
        pitfall: { title: "Caller-Saved vs Callee-Saved Registers", content: "Registers like RAX, RCX, and RDX are caller-saved: any function you call is permitted to overwrite them without restoring their values!", code: "// Preserve RAX across call instructions by pushing to stack: push rax", tip: "Hacker Rule: Never assume caller-saved registers survive across call instructions.", target: "game.html?lang=asm&diff=beginner&stage=1" }
      },
      { id: "asm-les-002", diff: "intermediate", topic: "Register Sub-Registers & Zero Extension", title: "Why Compilers Write to 32-bit EAX to Clear 64-bit RAX", tagline: "Understand the x86-64 zero-extension hardware architectural quirk.",
        concept: { title: "Writing to 32-bit Sub-Registers Automatically Zero-Extends", content: "In x86-64, writing to 32-bit `eax` automatically clears the upper 32 bits of `rax` to zero in hardware. Compilers use `mov eax, 0` or `xor eax, eax` because it emits smaller 2-byte opcodes than 64-bit instructions!", code: "xor eax, eax  ; Clears all 64 bits of RAX using only 2 bytes!\n; Smaller opcode footprint than 'mov rax, 0' (7 bytes)", sandbox: "mov rax, 0xFFFFFFFFFFFFFFFF\nmov eax, 0x42\n; Inspect RAX upper bits zero-extended!" },
        drill: { title: "32-bit Register Write Effect", prompt: "If RAX contains `0xFFFFFFFFFFFFFFFF`, what does RAX contain after executing `mov eax, 5`?", code: "mov rax, 0xFFFFFFFFFFFFFFFF\nmov eax, 5\n// What is rax now?", options: [{ text: "0x0000000000000005 (upper 32 bits are zeroed)", isCorrect: true, feedback: "🎯 Correct! x86-64 hardware automatically zero-extends 32-bit register writes to 64 bits." }, { text: "0xFFFFFFFF00000005 (upper bits preserved)", isCorrect: false, feedback: "Writing to 8-bit or 16-bit registers preserves upper bits, but 32-bit writes strictly zero-extend." }] },
        pitfall: { title: "16-bit and 8-bit Partial Register Stalls", content: "Writing to `al` or `ax` does NOT zero-extend and causes CPU pipeline stalls on modern out-of-order processors due to false register dependencies.", code: "mov al, 1 ; Leaves upper 56 bits unchanged (potential pipeline hazard)", tip: "Hacker Rule: Use movzx to safely read smaller types into 32/64-bit registers.", target: "game.html?lang=asm&diff=intermediate&stage=1" }
      },
      { id: "asm-les-003", diff: "intermediate", topic: "The Hardware Call Stack", title: "The Hardware Stack, Stack Alignment & RSP/RBP Frames", tagline: "Trace push, pop, stack pointers and frame alignment under the hood.",
        concept: { title: "The Stack Grows Downward Toward Lower Memory Addresses", content: "The `push` instruction decrements the Stack Pointer (`rsp -= 8`) and writes a quadword. The `pop` instruction reads the quadword and increments `rsp += 8`.\n\nThe x86-64 ABI strictly requires RSP to be 16-byte aligned before calling functions!", code: "push rbp      ; Save previous base pointer (rsp -= 8)\nmov rbp, rsp  ; Establish new stack frame\nsub rsp, 16   ; Allocate 16 bytes for local variables", sandbox: "push 100\npush 200\npop rax" },
        drill: { title: "Stack Growth Direction", prompt: "When you execute `push rax`, what happens to the value of the stack pointer register RSP?", code: "push rax", options: [{ text: "RSP decreases by 8 bytes (stack grows downward)", isCorrect: true, feedback: "🎯 Correct! On x86-64 hardware, the stack grows downwards towards lower addresses." }, { text: "RSP increases by 8 bytes", isCorrect: false, feedback: "Pop increases RSP; push decreases it." }] },
        pitfall: { title: "16-Byte Stack Misalignment Crash", content: "Calling functions like `printf` with an unaligned stack pointer causes SSE instructions (`movaps`) to crash with SIGSEGV due to vector alignment requirements!", code: "// Ensure (RSP % 16 == 0) immediately before every call instruction.", tip: "Hacker Rule: Maintain 16-byte stack alignment across all function invocations.", target: "game.html?lang=asm&diff=intermediate&stage=1" }
      },
      { id: "asm-les-004", diff: "expert", topic: "LEA vs MOV Instructions", title: "LEA vs MOV: Address Math Without Memory Bus Cycles", tagline: "Discover why compilers use LEA as a high-speed arithmetic engine.",
        concept: { title: "LEA Computes Memory Addresses Without Dereferencing", content: "`mov rax, [rbx + rcx*4 + 8]` fetches the value at that address from RAM. `lea rax, [rbx + rcx*4 + 8]` computes the arithmetic address `rbx + rcx*4 + 8` and stores the numerical result into `rax` without touching the memory bus!", code: "; High-speed multiplication by 5 in a single instruction:\nlea rax, [rdi + rdi*4] ; rax = rdi * 5 (zero memory access!)", sandbox: "mov rdi, 10\nlea rax, [rdi + rdi*4]\n; Output rax = 50!" },
        drill: { title: "LEA Arithmetic Advantage", prompt: "Why do compilers prefer `lea eax, [edi + esi*2]` over separate add and shift instructions?", code: "lea eax, [edi + esi*2]", options: [{ text: "It performs addition and multiplication in a single cycle without modifying EFLAGS", isCorrect: true, feedback: "🎯 Correct! LEA computes 3-operand math in 1 cycle without altering status flags." }, { text: "It accesses cache faster than registers", isCorrect: false, feedback: "LEA does not access cache or RAM at all." }] },
        pitfall: { title: "Assuming LEA Dereferences Memory", content: "A common beginner reverse engineering mistake is assuming brackets in `lea rax, [rbx]` read from memory. It only calculates the pointer address!", code: "lea rax, [rbx] ; Identical to 'mov rax, rbx'!", tip: "Hacker Rule: Remember: LEA calculates the address pointer; MOV reads or writes the data.", target: "game.html?lang=asm&diff=expert&stage=1" }
      },
      { id: "asm-les-005", diff: "expert", topic: "Condition Codes & Flags", title: "Conditional Jumps, CMP, TEST & The EFLAGS Register", tagline: "Unmask how branch conditions evaluate ZF, SF, and CF flags in reverse engineering.",
        concept: { title: "CMP Subtracts and Discards Result; TEST Performs Bitwise AND", content: "`cmp a, b` computes `a - b` and updates the CPU flags (ZF if equal, SF if negative). `test a, a` computes `a & a` to check if a pointer or value is zero without altering register contents.", code: "test rax, rax ; Check if pointer is NULL (sets ZF=1 if zero)\njz is_null     ; Jump if Zero flag is set\n\ncmp rax, 100  ; Compare rax with 100\njg is_greater  ; Jump if Greater", sandbox: "mov rax, 0\ntest rax, rax\n; Check ZF flag set to 1!" },
        drill: { title: "TEST vs CMP for Zero Check", prompt: "Why do compilers emit `test rax, rax` instead of `cmp rax, 0`?", code: "test rax, rax vs cmp rax, 0", options: [{ text: "test rax, rax produces a shorter opcode and executes with minimal register dependency", isCorrect: true, feedback: "🎯 Correct! test rax, rax is smaller and faster than cmp with immediate 0." }, { text: "cmp cannot compare against zero", isCorrect: false, feedback: "cmp supports 0, but is 3 bytes longer." }] },
        pitfall: { title: "Signed vs Unsigned Jump Confusion in RE", content: "In reverse engineering, confusing signed jumps (`jg`, `jl`) with unsigned jumps (`ja`, `jb`) leads to flawed exploit payloads and incorrect decompilations.", code: "// jg/jl check SF/OF (signed); ja/jb check CF/ZF (unsigned).", tip: "Hacker Rule: In x86 RE: Greater/Less (G/L) = Signed; Above/Below (A/B) = Unsigned.", target: "game.html?lang=asm&diff=expert&stage=1" }
      }
    ]
  }
];

// Combine all tracks
for (const track of trackGenerators) {
  for (const m of track.modules) {
    lessons.push({
      id: m.id,
      language: track.lang,
      difficulty: m.diff,
      topic: m.topic,
      title: m.title,
      tagline: m.tagline,
      estimatedMinutes: 3,
      slides: [
        {
          type: "concept",
          badge: "01 // MENTAL MODEL",
          title: m.concept.title,
          content: m.concept.content,
          codeSnippet: m.concept.code,
          sandboxCode: m.concept.sandbox
        },
        {
          type: "drill",
          badge: "02 // INTERACTIVE CHECKPOINT",
          title: m.drill.title,
          prompt: m.drill.prompt,
          codeSnippet: m.drill.code,
          options: m.drill.options
        },
        {
          type: "pitfall",
          badge: "03 // DANGER ZONE",
          title: m.pitfall.title,
          content: m.pitfall.content,
          codeSnippet: m.pitfall.code,
          tip: m.pitfall.tip,
          arenaTarget: m.pitfall.target
        }
      ]
    });
  }
}

for (const track of remainingTracks) {
  for (const m of track.modules) {
    lessons.push({
      id: m.id,
      language: track.lang,
      difficulty: m.diff,
      topic: m.topic,
      title: m.title,
      tagline: m.tagline,
      estimatedMinutes: 3,
      slides: [
        {
          type: "concept",
          badge: "01 // MENTAL MODEL",
          title: m.concept.title,
          content: m.concept.content,
          codeSnippet: m.concept.code,
          sandboxCode: m.concept.sandbox
        },
        {
          type: "drill",
          badge: "02 // INTERACTIVE CHECKPOINT",
          title: m.drill.title,
          prompt: m.drill.prompt,
          codeSnippet: m.drill.code,
          options: m.drill.options
        },
        {
          type: "pitfall",
          badge: "03 // DANGER ZONE",
          title: m.pitfall.title,
          content: m.pitfall.content,
          codeSnippet: m.pitfall.code,
          tip: m.pitfall.tip,
          arenaTarget: m.pitfall.target
        }
      ]
    });
  }
}

console.log(`Prepared ${lessons.length} total lessons across 12 tracks.`);

const fileContent = `/**
 * SyntaxArena Cyber Academy Interactive Curriculum Lessons Catalog (Batch 11 Expansion)
 * Full 60-Module Catalog (5 Deep-Dive Modules per Track across all 12 Languages)
 * Generated automatically. Do not edit manually.
 */

export const academyLessons = ${JSON.stringify(lessons, null, 2)};

export const AcademyLessons = {
  getAll() {
    return academyLessons;
  },

  getByLanguage(lang) {
    if (!lang) return academyLessons;
    const cleanLang = String(lang).toLowerCase().trim();
    return academyLessons.filter(l => l.language === cleanLang);
  },

  getByDifficulty(lang, diff) {
    const list = this.getByLanguage(lang);
    if (!diff || diff === 'all') return list;
    const cleanDiff = String(diff).toLowerCase().trim();
    if (cleanDiff === 'all') return list;
    return list.filter(l => l.difficulty === cleanDiff);
  },

  getById(id) {
    return academyLessons.find(l => l.id === id) || null;
  }
};
`;

fs.writeFileSync(path.resolve('data/academy-lessons.js'), fileContent, 'utf8');
console.log(`Successfully generated data/academy-lessons.js with ${lessons.length} lessons.`);
