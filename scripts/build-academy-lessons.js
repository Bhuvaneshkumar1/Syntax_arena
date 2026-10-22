/**
 * Script to build the complete 36-lesson Cyber Academy Catalog
 * Exactly 3 lessons per language (Beginner, Intermediate, Expert) across all 12 tracks:
 * Python, C, C++, Java, Cyber & Linux, JavaScript, Rust, SQL, TypeScript, Go, HTML, Assembly.
 */

import fs from 'fs';
import path from 'path';

const lessons = [
  // =========================================================================
  // 1. PYTHON TRACK (3 Lessons)
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

  // =========================================================================
  // 2. C TRACK (3 Lessons)
  // =========================================================================
  {
    id: "c-les-001",
    language: "c",
    difficulty: "beginner",
    topic: "Pointers & Addresses",
    title: "Memory Addresses, Indirection & The Dereference Operator",
    tagline: "Understand what pointers actually store: numerical virtual addresses.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "A Pointer Holds a Byte Address in Memory",
        content: "Every variable in C lives at a specific byte address in RAM. The address-of operator `&x` extracts that numerical location, while the dereference operator `*ptr` reads or writes the data living at that location.",
        codeSnippet: "int x = 42;\nint *ptr = &x; // ptr stores address of x\n*ptr = 99;     // directly updates x via memory indirection!\nprintf(\"%d\\n\", x); // Output: 99",
        sandboxCode: "int x = 42;\nint *ptr = &x;\n*ptr = 99;\nprintf(\"x = %d, *ptr = %d\\n\", x, *ptr);"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Pointer Indirection Prediction",
        prompt: "What is printed by this code snippet?",
        codeSnippet: "int a = 5, b = 10;\nint *p = &a;\n*p = b;\nprintf(\"%d %d\", a, b);",
        options: [
          { text: "10 10", isCorrect: true, feedback: "🎯 Correct! *p = b assigns the value of b (10) to the memory location of a." },
          { text: "5 10", isCorrect: false, feedback: "*p = b modifies variable a through its pointer." },
          { text: "5 5", isCorrect: false, feedback: "Variable b is not modified." },
          { text: "Compilation Error", isCorrect: false, feedback: "Assigning an integer to a dereferenced int pointer is valid C." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Uninitialized Pointer Wild Writes",
        content: "Declaring `int *p;` without initializing it means `p` contains garbage bits. Writing `*p = 10` will attempt to write to random memory, causing a Segmentation Fault or silent corruption!",
        codeSnippet: "// ❌ DANGEROUS CRASH:\nint *p; // Wild pointer points to garbage!\n*p = 10; // SEGFAULT!\n\n// ✅ SAFE INITIALIZATION:\nint *p = NULL;",
        tip: "Hacker Rule: Always initialize pointers to NULL or a valid address upon declaration.",
        arenaTarget: "game.html?lang=c&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "c-les-002",
    language: "c",
    difficulty: "intermediate",
    topic: "Dynamic Memory",
    title: "Heap Allocation with malloc(), free() & Dangling Pointers",
    tagline: "Master memory lifetimes outside the call stack frame.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Heap Memory Persists Until Explicitly Freed",
        content: "Variables allocated on the stack are automatically destroyed when their enclosing function returns. `malloc(bytes)` allocates persistent memory on the heap that survives until you manually call `free(ptr)`.",
        codeSnippet: "int *arr = malloc(5 * sizeof(int));\nif (arr == NULL) return 1; // Always check for allocation failure!\n\narr[0] = 100;\nfree(arr); // Release memory back to OS\narr = NULL; // Prevent dangling pointer!",
        sandboxCode: "int *p = malloc(sizeof(int));\n*p = 777;\nprintf(\"Allocated val: %d\\n\", *p);\nfree(p);"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Dangling Pointer Hazard",
        prompt: "What does a pointer variable contain immediately after calling `free(ptr)`?",
        codeSnippet: "int *ptr = malloc(sizeof(int));\n*ptr = 42;\nfree(ptr);",
        options: [
          { text: "It still holds the old memory address, now pointing to deallocated memory (dangling)", isCorrect: true, feedback: "🎯 Correct! free() only marks the memory as reusable; it does NOT zero out the pointer variable itself!" },
          { text: "It is automatically set to NULL by the runtime", isCorrect: false, feedback: "C does not automatically modify pointer variables on free()." },
          { text: "It is automatically zeroed out", isCorrect: false, feedback: "The address remains in the variable until you assign ptr = NULL." },
          { text: "It raises a runtime exception", isCorrect: false, feedback: "free() returns void without throwing errors." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Double Free Security Vulnerability",
        content: "Calling `free(ptr)` twice on the same memory block corrupts internal heap allocators and enables catastrophic arbitrary code execution exploits!",
        codeSnippet: "// ❌ CRITICAL SECURITY VULNERABILITY:\nfree(ptr);\nfree(ptr); // Double free crash / heap exploit!\n\n// ✅ IDIOMATIC DEFENSE:\nfree(ptr);\nptr = NULL; // free(NULL) is guaranteed safe in C!",
        tip: "Hacker Rule: Always immediately assign `ptr = NULL` right after calling `free(ptr)`.",
        arenaTarget: "game.html?lang=c&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "c-les-003",
    language: "c",
    difficulty: "expert",
    topic: "Undefined Behavior & Aliasing",
    title: "Strict Aliasing, Type Punning & Sequence Points",
    tagline: "Understand how the optimizer transforms your C code under ISO standards.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "The Strict Aliasing Rule",
        content: "Under ISO C, the compiler assumes pointers of different types (e.g., `int*` and `float*`) NEVER point to the same memory location. The optimizer will reorder or cache memory reads based on this assumption!",
        codeSnippet: "uint32_t x = 0x3F800000;\n// ❌ Strict aliasing violation (UB):\nfloat f = *(float*)&x;\n\n// ✅ Safe, legal type punning via memcpy:\nfloat f2;\nmemcpy(&f2, &x, sizeof(f2));",
        sandboxCode: "uint32_t u = 0x41424344;\nchar buf[5] = {0};\nmemcpy(buf, &u, 4);\nprintf(\"Punning via memcpy: %s\\n\", buf);"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Unsequenced Modification",
        prompt: "Why is `x = x++` strictly undefined behavior in ISO C?",
        codeSnippet: "int x = 5;\nx = x++;",
        options: [
          { text: "It modifies variable x twice between sequence points without synchronization", isCorrect: true, feedback: "🎯 Correct! Modifying an unsequenced scalar twice in a single expression invokes strict Undefined Behavior." },
          { text: "x++ is not a valid expression in C", isCorrect: false, feedback: "The post-increment operator is standard C syntax." },
          { text: "It always results in x = 5", isCorrect: false, feedback: "Compilers can produce any output or delete code entirely under UB." },
          { text: "It causes a compiler parse error", isCorrect: false, feedback: "It compiles but emits undefined behavior instructions." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Pointer Arithmetic Past Array Bounds",
        content: "Creating a pointer that points even a single byte BEFORE an array or more than one past the end is strictly Undefined Behavior, even if you never dereference it!",
        codeSnippet: "int arr[5];\nint *p = arr - 1; // ❌ UNDEFINED BEHAVIOR immediately!\nint *end = arr + 5; // ✅ Legal (pointing one-past-the-end)",
        tip: "Hacker Rule: Use `memcpy` or unions with character types for strict aliasing compliance.",
        arenaTarget: "game.html?lang=c&diff=expert&stage=1"
      }
    ]
  },

  // =========================================================================
  // 3. C++ TRACK (3 Lessons)
  // =========================================================================
  {
    id: "cpp-les-001",
    language: "cpp",
    difficulty: "beginner",
    topic: "References & Const Correctness",
    title: "References vs Pointers in Modern C++",
    tagline: "Master non-null aliases and avoid expensive copy overhead.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "A Reference is an Unchangeable Alias",
        content: "Unlike a pointer, a C++ reference (`int &ref = x`) cannot be null and cannot be reseated to point to a different variable after initialization. Passing by `const &` avoids copying heavy objects while guaranteeing read-only safety.",
        codeSnippet: "void printBig(const std::vector<int> &vec) {\n  // Zero copy overhead! Read-only access.\n  std::cout << vec.size() << '\\n';\n}",
        sandboxCode: "int a = 10;\nint &ref = a;\nref = 99;\nstd::cout << \"a is: \" << a << '\\n';"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Reference Reseating Check",
        prompt: "What does `ref = b` do in this snippet?",
        codeSnippet: "int a = 5, b = 20;\nint &ref = a;\nref = b;",
        options: [
          { text: "Assigns the value of b (20) into variable a", isCorrect: true, feedback: "🎯 Correct! References cannot be reseated; assigning to ref writes to the referenced variable a." },
          { text: "Reseats ref to refer to variable b", isCorrect: false, feedback: "References can never be reseated to a different variable." },
          { text: "Causes a compiler error", isCorrect: false, feedback: "Assignment through a non-const reference is valid syntax." },
          { text: "Creates a dangling reference", isCorrect: false, feedback: "Both variables are in scope and valid." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Dangling Reference to Local Stack Variable",
        content: "Returning a reference to a local variable creates a dangling reference! The local stack memory is reclaimed when the function returns.",
        codeSnippet: "// ❌ CRASH BUG:\nconst std::string& getName() {\n    std::string s = \"SyntaxArena\";\n    return s; // Dangling reference to destroyed stack object!\n}",
        tip: "Hacker Rule: Never return references to local variables; return by value and let RVO/move semantics optimize it.",
        arenaTarget: "game.html?lang=cpp&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "cpp-les-002",
    language: "cpp",
    difficulty: "intermediate",
    topic: "RAII & Smart Pointers",
    title: "Resource Acquisition Is Initialization & std::unique_ptr",
    tagline: "Eliminate manual delete calls and memory leaks entirely.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Deterministic Destruction with RAII",
        content: "In C++, resources (memory, file handles, mutex locks) should be owned by objects whose destructors automatically release them when exiting scope.\n\n`std::unique_ptr<T>` enforces strict, single ownership with zero runtime overhead over a raw pointer!",
        codeSnippet: "#include <memory>\nvoid process() {\n    auto ptr = std::make_unique<int>(100);\n    // Automatically deleted when exiting scope—even if an exception throws!\n}",
        sandboxCode: "auto p = std::make_unique<int>(42);\nstd::cout << \"Value: \" << *p << '\\n';"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Unique Ownership Move Semantics",
        prompt: "What happens if you attempt `auto p2 = p1;` where `p1` is a `std::unique_ptr`?",
        codeSnippet: "auto p1 = std::make_unique<int>(10);\nauto p2 = p1; // Copy attempted",
        options: [
          { text: "Compiler error: copy constructor is deleted", isCorrect: true, feedback: "🎯 Correct! unique_ptr explicitly deletes its copy constructor to guarantee single ownership. You must use std::move(p1)." },
          { text: "Memory address is shared between p1 and p2", isCorrect: false, feedback: "Shared ownership requires std::shared_ptr, not std::unique_ptr." },
          { text: "Deep copy of the integer is allocated on the heap", isCorrect: false, feedback: "unique_ptr does not perform deep cloning." },
          { text: "Runtime exception is thrown", isCorrect: false, feedback: "The failure is caught at compile time." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Circular References with std::shared_ptr",
        content: "If two objects hold `std::shared_ptr` to each other, their reference counts will never hit zero, causing a permanent memory leak! Break the cycle using `std::weak_ptr`.",
        codeSnippet: "// ❌ PERMANENT LEAK: A -> B and B -> A\nstruct Node {\n    std::shared_ptr<Node> next;\n    std::weak_ptr<Node> prev; // ✅ Break circular reference!\n};",
        tip: "Hacker Rule: Use `std::weak_ptr` for back-pointers and observer relationships.",
        arenaTarget: "game.html?lang=cpp&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "cpp-les-003",
    language: "cpp",
    difficulty: "expert",
    topic: "Move Semantics & Rvalues",
    title: "Rvalue References (`T&&`) and `std::move`",
    tagline: "Steal internal heap allocations instead of copying deep data structures.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Moving Steals Resources Without Allocation",
        content: "An lvalue is an object with an identifiable memory address. An rvalue is a temporary object on the verge of destruction.\n\nMove constructors (`Type(Type&& other)`) steal the pointers of the expiring object in $O(1)$ time rather than allocating a deep copy!",
        codeSnippet: "std::vector<int> a = {1, 2, 3, 4, 5};\nstd::vector<int> b = std::move(a); // Steals buffer pointer!\n// b now owns the data; a is left in a valid but unspecified empty state.",
        sandboxCode: "std::vector<int> v1 = {10, 20};\nstd::vector<int> v2 = std::move(v1);\nstd::cout << \"v2 size: \" << v2.size() << \", v1 size: \" << v1.size() << '\\n';"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "std::move Mechanism",
        prompt: "What does `std::move(x)` actually execute at the machine level?",
        codeSnippet: "auto y = std::move(x);",
        options: [
          { text: "It is an unconditional cast to an rvalue reference (T&&); it generates no assembly instructions by itself", isCorrect: true, feedback: "🎯 Correct! std::move is simply `static_cast<T&&>(x)` to enable move overload resolution." },
          { text: "It physically moves memory bytes across the CPU bus", isCorrect: false, feedback: "Move instructions belong to the constructor, not std::move itself." },
          { text: "It deallocates x from RAM", isCorrect: false, feedback: "x remains valid until its scope ends." },
          { text: "It sets x to NULL", isCorrect: false, feedback: "std::move does not modify x directly." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Using Moved-From Objects",
        content: "Accessing specific values in an object after it has been moved from (`std::move`) is dangerous: the C++ standard only guarantees it is in a valid state for destruction or reassignment, NOT that it retains data!",
        codeSnippet: "std::string s = \"hello\";\nstd::string s2 = std::move(s);\nstd::cout << s; // ❌ Unspecified state!",
        tip: "Hacker Rule: Treat moved-from variables as invalid until explicitly reassigned.",
        arenaTarget: "game.html?lang=cpp&diff=expert&stage=1"
      }
    ]
  },

  // =========================================================================
  // 4. JAVASCRIPT TRACK (3 Lessons)
  // =========================================================================
  {
    id: "js-les-001",
    language: "javascript",
    difficulty: "beginner",
    topic: "Value vs Reference Types",
    title: "Primitives vs Reference Mutation in ES2024",
    tagline: "Understand why const does not mean immutability for objects.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Const Protects the Identifier Binding, Not the Heap Data",
        content: "In JavaScript, primitive types (number, string, boolean, symbol, bigint, null, undefined) are copied by value. Objects (arrays, functions, objects) are accessed via memory references.\n\nDeclaring `const user = { name: 'Alice' }` means the variable `user` cannot be reassigned to another pointer. However, the properties of the object itself remain completely mutable!",
        codeSnippet: "const hero = { level: 10 };\nhero.level = 99; // Totally valid!\n\n// hero = { level: 100 }; // ❌ TypeError: Assignment to constant variable",
        sandboxCode: "const hero = { level: 10 };\nhero.level = 99;\nconsole.log('Hero level:', hero.level);"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Equality & Reference Identity",
        prompt: "What will the following strict comparison evaluate to?",
        codeSnippet: "console.log([1, 2] === [1, 2]);",
        options: [
          { text: "false", isCorrect: true, feedback: "🎯 Correct! In JS, === checks memory address identity. Each array literal allocates a new reference." },
          { text: "true", isCorrect: false, feedback: "Arrays are compared by reference, not deep structural content." },
          { text: "TypeError", isCorrect: false, feedback: "Strict equality comparison is valid across all JS types." },
          { text: "undefined", isCorrect: false, feedback: "The expression strictly returns a boolean value." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Shallow Spread vs Nested Reference Sharing",
        content: "The spread operator (`{ ...obj }` or `[ ...arr ]`) only performs a shallow clone! Any nested objects still share the exact same reference with the original.",
        codeSnippet: "const original = { scores: [100, 200] };\nconst clone = { ...original };\nclone.scores.push(300);\nconsole.log(original.scores.length); // 3! Nested array was mutated!",
        tip: "Hacker Rule: Use `structuredClone(obj)` for deep, independent copies in modern JavaScript.",
        arenaTarget: "game.html?lang=javascript&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "js-les-002",
    language: "javascript",
    difficulty: "intermediate",
    topic: "Event Loop & Concurrency",
    title: "Microtasks vs Macrotasks in the V8 Engine",
    tagline: "Demystify Promises, setTimeout, and the event loop execution queue.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Microtasks Drain Completely Before Any Macrotask Runs",
        content: "The JavaScript event loop continuously checks two queues:\n1. **Microtask Queue**: `Promise.then()`, `queueMicrotask()`, `MutationObserver`.\n2. **Macrotask Queue**: `setTimeout()`, `setInterval()`, `setImmediate()`, I/O.\n\nRule: The microtask queue must be **completely emptied** before the engine dequeues even a single macrotask!",
        codeSnippet: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');\n// Order: 1 -> 4 -> 3 -> 2",
        sandboxCode: "console.log('1 (Sync)');\nsetTimeout(() => console.log('2 (Macrotask)'), 0);\nPromise.resolve().then(() => console.log('3 (Microtask)'));\nconsole.log('4 (Sync)');"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Execution Order Prediction",
        prompt: "In what order are the logs emitted in this code?",
        codeSnippet: "queueMicrotask(() => console.log('Micro'));\nconsole.log('Main');",
        options: [
          { text: "Main, then Micro", isCorrect: true, feedback: "🎯 Correct! Synchronous code in the call stack runs to completion before microtasks fire." },
          { text: "Micro, then Main", isCorrect: false, feedback: "Microtasks only run once the current call stack clears." },
          { text: "Interleaved randomly", isCorrect: false, feedback: "JavaScript's event loop specification is strictly deterministic." },
          { text: "Micro only", isCorrect: false, feedback: "Both console logs execute." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Starving the UI with Recursive Microtasks",
        content: "Because the engine drains all microtasks before rendering or handling clicks, recursively scheduling microtasks (`queueMicrotask`) will freeze the browser tab completely!",
        codeSnippet: "// ❌ BROWSER TAB FREEZE:\nfunction loop() {\n    Promise.resolve().then(loop);\n}\nloop(); // Macrotasks and UI paints never run!",
        tip: "Hacker Rule: Use `requestAnimationFrame` for smooth render loops, not nested promises.",
        arenaTarget: "game.html?lang=javascript&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "js-les-003",
    language: "javascript",
    difficulty: "expert",
    topic: "Prototypes & Object Models",
    title: "Prototype Chain, `Object.create(null)` & Prototype Pollution",
    tagline: "Master V8 hidden classes, prototype lookup delegation, and security boundaries.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Prototypal Delegation vs Classical Inheritance",
        content: "In JavaScript, objects do not have copies of class methods. Every object holds an internal `[[Prototype]]` link. When accessing `obj.prop`, V8 walks up the chain until it finds the property or hits `null`.\n\nCreating an object with `Object.create(null)` gives a completely clean dictionary with no `toString`, `valueOf`, or `__proto__`!",
        codeSnippet: "const pureMap = Object.create(null);\npureMap.key = 42;\nconsole.log('toString' in pureMap); // false! No prototype bloat.",
        sandboxCode: "const m = Object.create(null);\nm['score'] = 100;\nconsole.log('pure map:', m.score, Object.getPrototypeOf(m));"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Prototype Lookup Boundary",
        prompt: "Where does the prototype lookup chain terminate?",
        codeSnippet: "Object.getPrototypeOf(Object.prototype);",
        options: [
          { text: "null", isCorrect: true, feedback: "🎯 Correct! The root of the prototype chain is Object.prototype, whose [[Prototype]] is strictly null." },
          { text: "undefined", isCorrect: false, feedback: "The root prototype returns null." },
          { text: "Object", isCorrect: false, feedback: "Object is a constructor function, not the terminus of the chain." },
          { text: "Window", isCorrect: false, feedback: "The global scope is separate from the object prototype chain." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Prototype Pollution Exploits",
        content: "Recursively merging untrusted JSON payloads without filtering `__proto__` can inject properties directly onto `Object.prototype`, hijacking behavior across the entire runtime!",
        codeSnippet: "// ❌ VULNERABLE MERGE:\nfunction merge(target, src) {\n  for (let k in src) target[k] = src[k];\n}\n// Merging { '__proto__': { 'isAdmin': true } } pollutes all objects!",
        tip: "Hacker Rule: Use `Map` or `Object.create(null)` for user-supplied dictionary keys.",
        arenaTarget: "game.html?lang=javascript&diff=expert&stage=1"
      }
    ]
  },

  // =========================================================================
  // 5. HTML5 & MODERN CSS TRACK (3 Lessons)
  // =========================================================================
  {
    id: "html-les-001",
    language: "html",
    difficulty: "beginner",
    topic: "Box Model & Layout",
    title: "Mastering `box-sizing: border-box` & Margin Collapse",
    tagline: "Calculate element geometry accurately without layout calculation bugs.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Why content-box Causes Overflow Bugs",
        content: "Under standard `box-sizing: content-box`, padding and borders are added **on top** of the declared `width`. An element with `width: 100%; padding: 20px` will inevitably overflow its container!\n\nSetting `box-sizing: border-box` forces padding and border into the calculated width.",
        codeSnippet: "/* Standard modern CSS reset */\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}",
        sandboxCode: "const width = 200;\nconst padding = 20;\nconst border = 2;\nconsole.log('content-box total:', width + padding*2 + border*2);\nconsole.log('border-box total:', width);"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Margin Collapsing Rule",
        prompt: "If element A has `margin-bottom: 30px` and sibling B directly below it has `margin-top: 20px`, what is the vertical space between them?",
        codeSnippet: ".a { margin-bottom: 30px; }\n.b { margin-top: 20px; }",
        options: [
          { text: "30px", isCorrect: true, feedback: "🎯 Correct! In standard vertical flow, margins collapse to the maximum of the two values (30px), not their sum." },
          { text: "50px", isCorrect: false, feedback: "Vertical margins collapse unless separated by padding, borders, or flex/grid containers." },
          { text: "20px", isCorrect: false, feedback: "Collapsing takes the largest margin, which is 30px." },
          { text: "10px", isCorrect: false, feedback: "Margins are not subtracted." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Flexbox and Grid Disable Margin Collapsing",
        content: "Margins between child items inside a Flexbox (`display: flex`) or Grid container **never collapse**! They will add together, causing unexpected spacing if you expected block flow behavior.",
        codeSnippet: "/* Inside flex container, 30px + 20px = 50px gap! */\n.container {\n  display: flex;\n  flex-direction: column;\n}",
        tip: "Hacker Rule: Use the modern `gap` property instead of vertical margins for container spacing.",
        arenaTarget: "game.html?lang=html&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "html-les-002",
    language: "html",
    difficulty: "intermediate",
    topic: "Stacking Contexts",
    title: "Stacking Contexts & `isolation: isolate`",
    tagline: "Stop fighting z-index wars and tame 3D compositing layers.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Z-Index is Local to Its Stacking Context",
        content: "Setting `z-index: 999999` fails if the element is trapped in a parent stacking context with a lower layer! Transforming (`transform`), opacity (`opacity < 1`), or filter properties create a brand-new stacking context.",
        codeSnippet: "/* Creates an isolated stacking context for components */\n.modal-component {\n  isolation: isolate;\n}",
        sandboxCode: "console.log('Stacking context created by: isolation: isolate, transform, opacity');"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Stacking Context Trigger",
        prompt: "Which of the following CSS declarations triggers a new stacking context on an element?",
        codeSnippet: "div { opacity: 0.99; }",
        options: [
          { text: "opacity: 0.99 (any opacity strictly less than 1.0)", isCorrect: true, feedback: "🎯 Correct! An opacity value less than 1 forces the compositor to generate a new stacking context layer." },
          { text: "display: block", isCorrect: false, feedback: "Standard display: block does not create a stacking context." },
          { text: "color: #00e5ff", isCorrect: false, feedback: "Color properties have no effect on compositing contexts." },
          { text: "margin: auto", isCorrect: false, feedback: "Margin centering does not affect stacking layers." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "The Overflow Hidden Clipping Trap",
        content: "If a dropdown or tooltip is nested inside an element with `overflow: hidden`, increasing `z-index` will NEVER allow it to escape the parent container's bounding rectangle!",
        codeSnippet: "/* Traps all absolute popups inside boundaries */\n.card { overflow: hidden; }",
        tip: "Hacker Rule: Use CSS `isolation: isolate` on custom components to prevent z-index leakage.",
        arenaTarget: "game.html?lang=html&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "html-les-003",
    language: "html",
    difficulty: "expert",
    topic: "Container Queries & Modern CSS",
    title: "Container Queries (`@container`) & Subgrid Layouts",
    tagline: "Build truly modular responsive components based on parent container width.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Respond to Component Context, Not Viewport Width",
        content: "Traditional `@media` queries only measure the browser window width. Container queries (`@container`) allow a component to dynamically adapt its styling based on the specific width of its immediate parent container!",
        codeSnippet: ".sidebar-card {\n  container-type: inline-size;\n}\n@container (min-width: 400px) {\n  .card-body { display: grid; grid-template-columns: 1fr 2fr; }\n}",
        sandboxCode: "console.log('Container queries allow self-contained responsive widgets anywhere in DOM!');"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Container Declaration Requirement",
        prompt: "What property must be declared on an ancestor before children can query it via `@container`?",
        codeSnippet: ".widget-wrapper { container-type: inline-size; }",
        options: [
          { text: "container-type (or shorthand container)", isCorrect: true, feedback: "🎯 Correct! An ancestor must declare `container-type: inline-size` or `size` to establish a queryable container." },
          { text: "display: flex", isCorrect: false, feedback: "Flex display alone does not define a container query context." },
          { text: "@media (container)", isCorrect: false, feedback: "@media only reads viewport dimensions." },
          { text: "resize: both", isCorrect: false, feedback: "Resize controls UI drag handles, not query contexts." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Querying Height without Strict Sizing",
        content: "Using `container-type: size` requires setting explicit dimensions on the container. If height depends on content, querying height creates a circular layout dependency and collapses the container to zero!",
        codeSnippet: "/* ❌ COLLAPSE BUG: circular dependency */\n.box { container-type: size; } /* height collapses! */\n\n/* ✅ IDIOMATIC INLINE SIZING */\n.box { container-type: inline-size; }",
        tip: "Hacker Rule: Use `container-type: inline-size` for 99% of responsive component layouts.",
        arenaTarget: "game.html?lang=html&diff=expert&stage=1"
      }
    ]
  },

  // =========================================================================
  // 6. ASSEMBLY & REVERSE ENGINEERING TRACK (3 Lessons)
  // =========================================================================
  {
    id: "asm-les-001",
    language: "asm",
    difficulty: "beginner",
    topic: "x86-64 Registers & Math",
    title: "64-bit Architecture & The Power of `xor eax, eax`",
    tagline: "Learn low-level register anatomy and compiler zero-extension optimizations.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Why Compilers Write to 32-bit EAX to Clear 64-bit RAX",
        content: "In x86-64 assembly, the 64-bit accumulator is `RAX`, and its lower 32-bit sub-register is `EAX`.\n\nA fundamental architectural rule of AMD64 is: **any operation writing to a 32-bit register automatically zero-extends into the upper 32 bits** of the corresponding 64-bit register!\n\nTherefore, `xor eax, eax` zeroes all 64 bits of `RAX` using fewer bytes than `mov rax, 0`.",
        codeSnippet: "; Clears all 64 bits of RAX:\nxor eax, eax    ; Encodes to 2 bytes: 31 C0\n\n; Slower, bulkier equivalent:\nmov rax, 0      ; Encodes to 7 bytes!",
        sandboxCode: "; Emulate XOR zeroing in Sandbox\nmov rax, 0xFFFFFFFF\nxor eax, eax\n; Check RAX value!"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Zero-Extension Check",
        prompt: "If `RAX` currently holds `0xFFFFFFFFFFFFFFFF`, what does `mov eax, 1` leave in `RAX`?",
        codeSnippet: "mov rax, 0xFFFFFFFFFFFFFFFF\nmov eax, 1",
        options: [
          { text: "0x0000000000000001", isCorrect: true, feedback: "🎯 Correct! Writing to 32-bit EAX clears the upper 32 bits of RAX to 0." },
          { text: "0xFFFFFFFF00000001", isCorrect: false, feedback: "Writing to 32-bit sub-registers zeroes the upper 32 bits, unlike 8-bit or 16-bit writes." },
          { text: "0xFFFFFFFFFFFFFFFF", isCorrect: false, feedback: "The register is definitely modified." },
          { text: "0x0000000100000000", isCorrect: false, feedback: "EAX represents the lower 32 bits, not the upper bits." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "8-bit and 16-bit Writes Do NOT Zero-Extend!",
        content: "Unlike 32-bit operations, writing to 16-bit (`AX`) or 8-bit (`AL`) registers leaves the rest of `RAX` untouched! Assuming `mov al, 5` clears `RAX` leads to catastrophic security bugs.",
        codeSnippet: "; ❌ DANGEROUS BUG:\nmov rax, 0x1234567890ABCDEF\nmov al, 0    ; RAX is now 0x1234567890ABCD00, NOT 0!",
        tip: "Hacker Rule: Always zero-initialize the whole register before doing partial byte arithmetic.",
        arenaTarget: "game.html?lang=asm&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "asm-les-002",
    language: "asm",
    difficulty: "intermediate",
    topic: "Stack Frames & Calling Conventions",
    title: "Stack Frames & System V AMD64 Calling Convention",
    tagline: "Trace return addresses, base pointers (RBP), and stack pointer alignments.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "The Standard Function Prologue & Register Arguments",
        content: "In Linux/macOS x86-64, the first 6 integer/pointer arguments are passed via registers: `RDI`, `RSI`, `RDX`, `RCX`, `R8`, `R9`.\n\nThe standard stack frame prologue preserves the caller's frame base pointer and reserves local stack space.",
        codeSnippet: "push rbp        ; Save caller base pointer\nmov rbp, rsp    ; Establish new stack frame base\nsub rsp, 32     ; Allocate 32 bytes for local variables",
        sandboxCode: "; Emulate stack frame in sandbox\npush rbp\nmov rbp, rsp\nsub rsp, 16\nmov qword [rbp-8], 42"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Argument Register Mapping",
        prompt: "Under System V AMD64 ABI, which register holds the first function argument (`arg1`)?",
        codeSnippet: "long add(long a, long b);",
        options: [
          { text: "RDI", isCorrect: true, feedback: "🎯 Correct! The System V calling order is: RDI, RSI, RDX, RCX, R8, R9." },
          { text: "RAX", isCorrect: false, feedback: "RAX is used for function return values, not input arguments." },
          { text: "RCX", isCorrect: false, feedback: "RCX holds the 4th argument in System V (or 1st in Microsoft x64)." },
          { text: "RSP", isCorrect: false, feedback: "RSP is the stack pointer." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "The 16-Byte Stack Alignment Mandate",
        content: "Before executing any `CALL` instruction in x86-64, `RSP` must be aligned to a 16-byte boundary. Calling SSE/AVX library functions like `printf` with an unaligned stack triggers an immediate General Protection Fault crash!",
        codeSnippet: "; ❌ CRASH: Unaligned stack before call\nsub rsp, 8   ; Stack misaligned!\ncall printf  ; SIGSEGV in glibc movaps instruction!",
        tip: "Hacker Rule: Always ensure `RSP % 16 == 0` right before issuing a `CALL` instruction.",
        arenaTarget: "game.html?lang=asm&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "asm-les-003",
    language: "asm",
    difficulty: "expert",
    topic: "Reverse Engineering & Exploitation",
    title: "Stack Canaries, ROP Gadgets & Control Flow Hijacking",
    tagline: "Analyze disassembled binary protections and return-oriented exploits.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "How Stack Canaries Detect Buffer Overflows",
        content: "Compilers insert a secret random quadword from `fs:0x28` directly between local buffers and the saved return address. Before returning, the function checks if the canary was altered.",
        codeSnippet: "; GCC stack protector check:\nmov rax, qword fs:[0x28]\nxor rax, qword [rbp-8] ; Compare with saved canary\njne __stack_chk_fail   ; Abort if corrupted!",
        sandboxCode: "console.log('Stack canaries prevent return address overwrites by checking guard values');"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "ROP Gadget Anatomy",
        prompt: "What characterizes a Return-Oriented Programming (ROP) gadget in compiled machine code?",
        codeSnippet: "pop rdi; ret",
        options: [
          { text: "A short sequence of CPU instructions terminating in a RET opcode", isCorrect: true, feedback: "🎯 Correct! Gadgets string together instructions using stack-stored return addresses to bypass Non-Executable (DEP/NX) stacks." },
          { text: "An interrupt vector", isCorrect: false, feedback: "ROP gadgets use standard instructions, not software interrupts." },
          { text: "A debugger breakpoint", isCorrect: false, feedback: "ROP relies on normal executable code already mapped in memory." },
          { text: "A compiler optimization flag", isCorrect: false, feedback: "ROP is an exploitation technique." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Null-Byte Canary Leaks",
        content: "Stack canaries deliberately begin with a `0x00` null byte to prevent string functions like `strcpy` or `printf %s` from reading past the buffer without terminating!",
        codeSnippet: "; Canary layout in memory:\n; 0x00 | RND | RND | RND | RND | RND | RND | RND",
        tip: "Hacker Rule: Binary protections require both ASLR (random addresses) and DEP/NX (non-executable stacks).",
        arenaTarget: "game.html?lang=asm&diff=expert&stage=1"
      }
    ]
  },

  // =========================================================================
  // 7. GO TRACK (3 Lessons)
  // =========================================================================
  {
    id: "go-les-001",
    language: "go",
    difficulty: "beginner",
    topic: "Slices vs Arrays",
    title: "The Slice Header: Pointer, Length, and Capacity",
    tagline: "Understand how slices share backing arrays until reallocation.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "A Slice is a 3-Word Descriptor",
        content: "In Go, an array has a fixed size determined at compile time. A slice is a lightweight 24-byte header containing:\n1. `Data`: Pointer to the underlying backing array.\n2. `Len`: Number of elements currently accessed.\n3. `Cap`: Total capacity before a new heap allocation is forced.\n\nSlicing an existing slice (`b := a[1:3]`) copies only this 24-byte struct, pointing to the same backing array!",
        codeSnippet: "a := []int{10, 20, 30}\nb := a[1:]\nb[0] = 999\nfmt.Println(a[1]) // Output: 999!",
        sandboxCode: "package main\nimport \"fmt\"\nfunc main() {\n    a := []int{1, 2, 3}\n    b := a[1:]\n    b[0] = 99\n    fmt.Println(\"a:\", a)\n}"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Append Reallocation Boundary",
        prompt: "When `append()` exceeds a slice's capacity (`cap`), what happens to its connection to the original backing array?",
        codeSnippet: "s := make([]int, 2, 2)\ns = append(s, 3)",
        options: [
          { text: "It allocates a brand-new backing array; modifications no longer affect the old array", isCorrect: true, feedback: "🎯 Correct! Go allocates a new array, copies existing items, and points the new slice to it." },
          { text: "It raises a panic: index out of bounds", isCorrect: false, feedback: "append() automatically grows the slice safely rather than panicking." },
          { text: "It mutates memory past the original capacity", isCorrect: false, feedback: "Go's memory safety prevents buffer overflows by reallocating." },
          { text: "The original array size is modified in place", isCorrect: false, feedback: "Arrays have fixed immutable size in memory." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Hidden Memory Leaks with Sub-slicing",
        content: "If you take a tiny sub-slice (`small := hugeBuffer[:2]`), the entire huge buffer cannot be garbage collected because `small` retains a reference to the backing array!",
        codeSnippet: "// ❌ MEMORY LEAK:\nfunc getSnippet() []byte {\n    data, _ := os.ReadFile(\"huge_1GB_file.bin\")\n    return data[:10] // Keeps entire 1GB allocated!\n}\n\n// ✅ SAFE COPY:\nfunc getSnippetSafe() []byte {\n    data, _ := os.ReadFile(\"huge_1GB_file.bin\")\n    res := make([]byte, 10)\n    copy(res, data[:10])\n    return res // 1GB array is collected!\n}",
        tip: "Hacker Rule: Use `copy()` when storing a small slice derived from a massive dataset.",
        arenaTarget: "game.html?lang=go&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "go-les-002",
    language: "go",
    difficulty: "intermediate",
    topic: "Concurrency & Channels",
    title: "Goroutines, Channels & Buffered Deadlock Traps",
    tagline: "Master CSP concurrency without goroutine leaks or blocking panics.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Unbuffered Channels Require Synchronization",
        content: "In Go, an unbuffered channel (`make(chan int)`) has zero capacity. A send operation (`ch <- val`) blocks until another goroutine is actively ready to receive (`<-ch`), synchronizing both execution paths.",
        codeSnippet: "ch := make(chan string)\ngo func() {\n    ch <- \"ping\"\n}()\nmsg := <-ch // Synchronizes and unblocks!\nfmt.Println(msg)",
        sandboxCode: "package main\nimport \"fmt\"\nfunc main() {\n    ch := make(chan int, 1)\n    ch <- 42\n    fmt.Println(<-ch)\n}"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Deadlock on Main Thread",
        prompt: "What happens if a single goroutine tries to send to an unbuffered channel without a receiver?",
        codeSnippet: "func main() {\n    ch := make(chan int)\n    ch <- 1\n}",
        options: [
          { text: "fatal error: all goroutines are asleep - deadlock!", isCorrect: true, feedback: "🎯 Correct! The main goroutine blocks waiting for a receiver that never arrives." },
          { text: "Value 1 is buffered and main exits cleanly", isCorrect: false, feedback: "Unbuffered channels cannot hold items without a receiver." },
          { text: "A nil pointer dereference panic occurs", isCorrect: false, feedback: "The channel is initialized, not nil." },
          { text: "Execution skips to next line silently", isCorrect: false, feedback: "Channel operations block synchronously." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Sending on a Closed Channel Panic",
        content: "Sending to a closed channel causes an immediate, unrecoverable runtime panic! Only the sender should close a channel, never the receiver.",
        codeSnippet: "// ❌ RUNTIME PANIC:\nclose(ch)\nch <- 5 // panic: send on closed channel!",
        tip: "Hacker Rule: Use `select` with `context.Context` to cleanly cancel long-running worker goroutines.",
        arenaTarget: "game.html?lang=go&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "go-les-003",
    language: "go",
    difficulty: "expert",
    topic: "Interfaces & Memory Allocation",
    title: "Interface Internals: `iface` vs `eface` & Escape Analysis",
    tagline: "Understand interface fat pointers and when stack values escape to heap.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "An Interface is a 2-Word Fat Pointer",
        content: "In the Go runtime, an interface value is a 2-word structure:\n1. `_type` / `itab`: Pointer to type metadata and method dispatch table.\n2. `data`: Pointer to the actual concrete value.\n\nAn interface is only equal to `nil` if BOTH its type and data pointers are `nil`!",
        codeSnippet: "var err error = (*MyError)(nil)\n// err != nil because it has a concrete type (*MyError)!\nif err != nil {\n    fmt.Println(\"Surprise! err is NOT nil!\")\n}",
        sandboxCode: "package main\nimport \"fmt\"\ntype MyErr struct{}\nfunc (m *MyErr) Error() string { return \"err\" }\nfunc main() {\n    var err error = (*MyErr)(nil)\n    fmt.Println(\"err == nil?\", err == nil)\n}"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "The Typed Nil Trap",
        prompt: "Why does `func check() error { var p *CustomError = nil; return p; }` return a non-nil error?",
        codeSnippet: "var e error = check()\nfmt.Println(e == nil)",
        options: [
          { text: "The interface holds a non-nil type pointer (*CustomError), so e == nil is false", isCorrect: true, feedback: "🎯 Correct! An interface is only nil if both type and value pointers are null." },
          { text: "CustomError implements Error() improperly", isCorrect: false, feedback: "Interface implementation is valid." },
          { text: "Compiler automatically initializes pointers to non-nil", isCorrect: false, feedback: "p is explicitly nil." },
          { text: "e is converted to a string automatically", isCorrect: false, feedback: "The comparison evaluates interface pointers." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Escape Analysis & Heap Pressure",
        content: "Passing variables to `fmt.Println(x...)` causes `x` to escape to the heap because `fmt.Println` takes `...interface{}`. This forces heap allocations in hot loops!",
        codeSnippet: "// In hot loops, avoid interface boxing to prevent GC overhead:\n// Prefer dedicated byte buffers over fmt.Sprintf",
        tip: "Hacker Rule: Run `go build -gcflags=\"-m\"` to inspect compiler escape analysis decisions.",
        arenaTarget: "game.html?lang=go&diff=expert&stage=1"
      }
    ]
  },

  // =========================================================================
  // 8. RUST TRACK (3 Lessons)
  // =========================================================================
  {
    id: "rust-les-001",
    language: "rust",
    difficulty: "beginner",
    topic: "Ownership & Move Semantics",
    title: "Affine Type System & Single Ownership Rules",
    tagline: "Master compile-time memory safety without a garbage collector.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Each Value Has Exactly One Owner",
        content: "In Rust, every resource has a single variable that owns it. When the owner goes out of scope, Rust automatically drops the value.\n\nAssigning a non-`Copy` type like `String` moves ownership: the original variable is invalidated immediately!",
        codeSnippet: "let s1 = String::from(\"hello\");\nlet s2 = s1; // Ownership MOVED to s2!\n\n// println!(\"{}\", s1); // ❌ Compile error: use of moved value s1\nprintln!(\"{}\", s2);   // ✅ Valid!",
        sandboxCode: "let s1 = String::from(\"Rust\");\nlet s2 = s1;\nprintln!(\"s2: {}\", s2);"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Copy vs Move Types",
        prompt: "Why does `let y = x;` NOT invalidate `x` when `x` is an integer (`i32`)?",
        codeSnippet: "let x: i32 = 42;\nlet y = x;\nprintln!(\"{} {}\", x, y);",
        options: [
          { text: "i32 implements the Copy trait, performing a fast bitwise copy on the stack", isCorrect: true, feedback: "🎯 Correct! Types with known fixed size on the stack implement Copy, so they are not moved." },
          { text: "Rust allows multiple owners for integers", isCorrect: false, feedback: "Rust maintains single ownership; y receives an independent copy." },
          { text: "Integers are allocated on the heap automatically", isCorrect: false, feedback: "Integers reside on the stack." },
          { text: "The compiler optimizes it with lazy evaluation", isCorrect: false, feedback: "It is governed by the Copy trait." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Borrowing After Move in Loops",
        content: "Moving a heap collection inside a loop body will fail on the second iteration because the variable was consumed in the first round!",
        codeSnippet: "// ❌ COMPILE ERROR:\nlet v = vec![1, 2, 3];\nfor _ in 0..2 {\n    take_ownership(v); // Value moved on iteration 0!\n}",
        tip: "Hacker Rule: Borrow with `&v` if the function only needs to read the data.",
        arenaTarget: "game.html?lang=rust&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "rust-les-002",
    language: "rust",
    difficulty: "intermediate",
    topic: "Borrow Checker",
    title: "Aliasing XOR Mutability: `&T` vs `&mut T`",
    tagline: "Prevent data races at compile time with Rust's reference rules.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Many Readers OR One Writer, Never Both",
        content: "Rust enforces a fundamental rule at compile time:\n1. You can have any number of immutable references (`&T`).\n2. OR you can have exactly one mutable reference (`&mut T`).\n\nSimultaneous reading and writing is impossible, mathematically preventing data races!",
        codeSnippet: "let mut data = vec![1, 2, 3];\nlet r1 = &data; // Read-only borrow\nlet r2 = &data; // Another read-only borrow (Fine!)\n\n// let w = &mut data; // ❌ Compile error: cannot borrow as mutable while borrowed as immutable",
        sandboxCode: "let mut n = 10;\nlet r = &n;\nprintln!(\"Read: {}\", r);"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Iterator Invalidation Prevention",
        prompt: "Why does Rust reject modifying a collection while iterating through it?",
        codeSnippet: "let mut v = vec![1, 2];\nfor item in &v {\n    v.push(*item); // Compile error!\n}",
        options: [
          { text: "Pushing requires &mut v, but the for loop holds an active immutable borrow &v", isCorrect: true, feedback: "🎯 Correct! In C++, this causes undefined behavior due to vector reallocation. Rust catches it at compile time!" },
          { text: "Vectors cannot be modified inside loops in Rust", isCorrect: false, feedback: "You can modify vectors if not simultaneously holding an immutable borrow." },
          { text: "push() takes ownership of the vector", isCorrect: false, feedback: "push() takes &mut self." },
          { text: "Integer dereferencing is not permitted", isCorrect: false, feedback: "*item is valid." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "RefCell Runtime Borrow Panics",
        content: "When using interior mutability with `RefCell<T>`, the borrow rules are checked at runtime. Violating the aliasing rule causes an immediate `panic!`.",
        codeSnippet: "let cell = RefCell::new(42);\nlet _b1 = cell.borrow_mut();\nlet _b2 = cell.borrow_mut(); // ❌ panic: AlreadyBorrowed!",
        tip: "Hacker Rule: Keep `borrow_mut()` scopes as small as possible or use RAII braces `{}`.",
        arenaTarget: "game.html?lang=rust&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "rust-les-003",
    language: "rust",
    difficulty: "expert",
    topic: "Unsafe Rust & Invariants",
    title: "Raw Pointers (`*const T`), Unsafe Blocks & Drop Flags",
    tagline: "Step outside the borrow checker safely when writing low-level systems.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Unsafe Does Not Disable the Borrow Checker",
        content: "`unsafe` grants 5 superpowers: dereferencing raw pointers, calling unsafe functions, implementing unsafe traits, mutating mutable statics, and accessing union fields.\n\nRaw pointers (`*const T`, `*mut T`) ignore borrow rules and lifetimes, requiring the programmer to manually guarantee memory validity.",
        codeSnippet: "let mut num = 5;\nlet r1 = &num as *const i32;\nlet r2 = &mut num as *mut i32;\n\nunsafe {\n    *r2 = 99; // Dereference raw pointer\n    println!(\"r1: {}\", *r1); // 99\n}",
        sandboxCode: "let mut x = 100;\nlet p = &mut x as *mut i32;\nunsafe { *p = 200; }\nprintln!(\"x: {}\", x);"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Undefined Behavior in Unsafe",
        prompt: "Which action invokes immediate Undefined Behavior inside an `unsafe` block in Rust?",
        codeSnippet: "let ptr: *const i32 = std::ptr::null();\nunsafe { *ptr; }",
        options: [
          { text: "Dereferencing a null pointer", isCorrect: true, feedback: "🎯 Correct! Dereferencing null, dangling, or unaligned raw pointers is immediate Undefined Behavior in Rust." },
          { text: "Creating a raw pointer to an integer", isCorrect: false, feedback: "Creating raw pointers is completely safe; only dereferencing requires unsafe." },
          { text: "Casting a reference to a raw pointer", isCorrect: false, feedback: "Pointer casting is safe." },
          { text: "Passing raw pointers to safe functions", isCorrect: false, feedback: "Raw pointers can be passed freely." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Creating Multiple Mutable References to Same Location",
        content: "Even inside `unsafe`, creating two active `&mut` references to the same memory location is INSTANT Undefined Behavior, even if you never write through them!",
        codeSnippet: "// ❌ INSTANT UB: Two &mut to same address\nunsafe {\n  let r1 = &mut *raw_ptr;\n  let r2 = &mut *raw_ptr; // UB violated!\n}",
        tip: "Hacker Rule: Use Miri (`cargo miri test`) to detect undefined behavior in unsafe Rust code.",
        arenaTarget: "game.html?lang=rust&diff=expert&stage=1"
      }
    ]
  },

  // =========================================================================
  // 9. JAVA TRACK (3 Lessons)
  // =========================================================================
  {
    id: "java-les-001",
    language: "java",
    difficulty: "beginner",
    topic: "Object References & String Pool",
    title: "Pass-by-Value Semantics & The Java String Constant Pool",
    tagline: "Understand why Java is strictly pass-by-value and how strings are interned.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Java is Strictly Pass-by-Value",
        content: "In Java, everything is passed by value. When you pass an object to a method, **the reference pointer itself is copied by value**.\n\nMutating fields through the reference updates the original object, but reassigning the parameter variable does NOT change the caller's reference!",
        codeSnippet: "void reassign(StringBuilder sb) {\n    sb = new StringBuilder(\"New\"); // Only reassigns local copy!\n}\nStringBuilder original = new StringBuilder(\"Old\");\nreassign(original);\nSystem.out.println(original); // Prints \"Old\"!",
        sandboxCode: "StringBuilder sb = new StringBuilder(\"Arena\");\nsb.append(\" 2026\");\nSystem.out.println(sb.toString());"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "String Pool Identity Check",
        prompt: "What will `s1 == s2` print in Java?",
        codeSnippet: "String s1 = \"hello\";\nString s2 = new String(\"hello\");\nSystem.out.println(s1 == s2);",
        options: [
          { text: "false", isCorrect: true, feedback: "🎯 Correct! `==` tests object reference identity. s1 lives in the String Pool, while s2 allocates a distinct heap object." },
          { text: "true", isCorrect: false, feedback: "Use .equals() for content comparison; == checks reference equality." },
          { text: "NullPointerException", isCorrect: false, feedback: "Neither string is null." },
          { text: "Compilation Error", isCorrect: false, feedback: "Comparing strings with == is valid syntax." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "String Concatenation in Tight Loops",
        content: "Because Java Strings are immutable, using `str += item` inside a loop creates an intermediate `StringBuilder` and a new `String` on every single iteration, thrashing the garbage collector!",
        codeSnippet: "// ❌ QUADRATIC GC THRASHING:\nString res = \"\";\nfor (int i = 0; i < 10000; i++) res += i;\n\n// ✅ O(N) LINEAR ALLOCATION:\nStringBuilder sb = new StringBuilder();\nfor (int i = 0; i < 10000; i++) sb.append(i);",
        tip: "Hacker Rule: Always use `StringBuilder` for loop concatenations.",
        arenaTarget: "game.html?lang=java&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "java-les-002",
    language: "java",
    difficulty: "intermediate",
    topic: "Generics & Type Erasure",
    title: "Type Erasure & PECS (`? extends T` vs `? super T`)",
    tagline: "Master generic variance and why List<Integer> is not a List<Number>.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Generics are Erased at Runtime",
        content: "Java generics exist only at compile time for type safety. The compiler strips all type arguments and inserts synthetic casts, replacing types with `Object` or their upper bound.\n\nTherefore, `List<Integer>` and `List<String>` share the exact same `List.class` at runtime!",
        codeSnippet: "List<Integer> ints = new ArrayList<>();\nList<String> strs = new ArrayList<>();\nSystem.out.println(ints.getClass() == strs.getClass()); // true!",
        sandboxCode: "List<Integer> list = List.of(1, 2, 3);\nSystem.out.println(\"Size: \" + list.size());"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Producer Extends, Consumer Super",
        prompt: "Can you add an integer to a `List<? extends Number>`?",
        codeSnippet: "List<? extends Number> list = new ArrayList<Integer>();\nlist.add(10); // Does this compile?",
        options: [
          { text: "Compilation Error: cannot add elements to ? extends wildcard", isCorrect: true, feedback: "🎯 Correct! The compiler cannot verify if the list is a List<Double>, List<Float>, etc., so writes (except null) are forbidden!" },
          { text: "Compiles and executes normally", isCorrect: false, feedback: "? extends is read-only (producer)." },
          { text: "Throws ClassCastException at runtime", isCorrect: false, feedback: "It fails to compile." },
          { text: "Throws UnsupportedOperationException", isCorrect: false, feedback: "The failure is at compile-time." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Primitive Array Autoboxing Mismatch",
        content: "`int[]` does NOT inherit from `Object[]`! Passing `int[]` to a generic method expecting `T[]` will treat the entire array as a single object of type `int[]`.",
        codeSnippet: "int[] data = {1, 2, 3};\nList<int[]> list = Arrays.asList(data); // List of size 1 containing the array!",
        tip: "Hacker Rule: Remember PECS: Producer Extends, Consumer Super.",
        arenaTarget: "game.html?lang=java&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "java-les-003",
    language: "java",
    difficulty: "expert",
    topic: "JVM Internals & GC",
    title: "JVM Memory Spaces: Eden, Survivor, Tenured & Metaspace",
    tagline: "Tune garbage collection pauses and inspect generational memory layouts.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Generational Hypothesis in the HotSpot JVM",
        content: "Most objects die young. HotSpot divides the Heap into:\n1. **Young Generation**: Eden Space + Two Survivor Spaces (S0/S1). Minor GCs clear dead objects fast using copying algorithms.\n2. **Old (Tenured) Generation**: Long-lived objects promoted after surviving aging thresholds.",
        codeSnippet: "// Triggering memory pressure promotes objects into Tenured\n// Metaspace holds class metadata outside the JVM Heap in native RAM.",
        sandboxCode: "Runtime rt = Runtime.getRuntime();\nSystem.out.println(\"Free Memory (MB): \" + rt.freeMemory() / (1024*1024));"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Metaspace Allocation",
        prompt: "Where does HotSpot allocate compiled class metadata and method bytecodes?",
        codeSnippet: "Class.forName(\"com.example.HeavyClass\");",
        options: [
          { text: "Metaspace (native memory outside the main Java heap)", isCorrect: true, feedback: "🎯 Correct! Since Java 8, PermGen was replaced by Metaspace, allocating directly from native OS RAM." },
          { text: "Eden Space", isCorrect: false, feedback: "Eden is strictly for newly instantiated heap objects." },
          { text: "Java Thread Stack", isCorrect: false, feedback: "Stack holds local primitive variables and frame pointers." },
          { text: "Survivor Space S0", isCorrect: false, feedback: "Survivor spaces hold young surviving objects." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Static Collection Memory Leaks",
        content: "Appending objects to a `static` collection without removal will prevent them from ever being garbage collected, inevitably causing a fatal `java.lang.OutOfMemoryError: Java heap space`!",
        codeSnippet: "// ❌ SLOW LEAK:\npublic class Cache {\n    private static final List<byte[]> cache = new ArrayList<>();\n    // Never cleared -> OutOfMemoryError!\n}",
        tip: "Hacker Rule: Use `WeakHashMap` or bounded LRU caches for static caching.",
        arenaTarget: "game.html?lang=java&diff=expert&stage=1"
      }
    ]
  },

  // =========================================================================
  // 10. SQL TRACK (3 Lessons)
  // =========================================================================
  {
    id: "sql-les-001",
    language: "sql",
    difficulty: "beginner",
    topic: "Three-Valued Logic & NULLs",
    title: "NULL Mechanics: TRUE, FALSE, and UNKNOWN",
    tagline: "Master SQL's tri-state logic and why NULL = NULL is never TRUE.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "NULL Represents the Absence of a Value",
        content: "In SQL, `NULL` is not zero, not an empty string, and not false. It represents an unknown state.\n\nAny arithmetic or equality check involving NULL yields **UNKNOWN**. `WHERE` clauses ONLY return rows where the condition evaluates to strictly **TRUE**!",
        codeSnippet: "-- ❌ WRONG: Returns 0 rows!\nSELECT * FROM users WHERE status = NULL;\n\n-- ✅ CORRECT:\nSELECT * FROM users WHERE status IS NULL;",
        sandboxCode: "SELECT username, xp FROM users WHERE email IS NULL;"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Tri-State NOT Evaluation",
        prompt: "What does `NOT (NULL = 5)` evaluate to in standard SQL?",
        codeSnippet: "SELECT * FROM items WHERE NOT (price = NULL);",
        options: [
          { text: "UNKNOWN (so the row is filtered out)", isCorrect: true, feedback: "🎯 Correct! NULL = 5 evaluates to UNKNOWN. Negating UNKNOWN via NOT is STILL UNKNOWN!" },
          { text: "TRUE", isCorrect: false, feedback: "NOT UNKNOWN evaluates to UNKNOWN, not TRUE." },
          { text: "FALSE", isCorrect: false, feedback: "It does not evaluate to FALSE." },
          { text: "Syntax Error", isCorrect: false, feedback: "It is syntactically valid." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "The NOT IN with NULL Subquery Trap",
        content: "If a subquery used with `NOT IN (...)` returns even a single row with `NULL`, the entire `NOT IN` expression evaluates to UNKNOWN, returning ZERO rows for the entire query!",
        codeSnippet: "-- ❌ DANGEROUS: Returns 0 rows if blocked_ids contains NULL!\nSELECT * FROM users WHERE id NOT IN (SELECT user_id FROM blocked_ids);\n\n-- ✅ SAFE ALTERNATIVE:\nSELECT * FROM users u WHERE NOT EXISTS (\n    SELECT 1 FROM blocked_ids b WHERE b.user_id = u.id\n);",
        tip: "Hacker Rule: Always use `NOT EXISTS` instead of `NOT IN` to guard against unexpected NULLs.",
        arenaTarget: "game.html?lang=sql&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "sql-les-002",
    language: "sql",
    difficulty: "intermediate",
    topic: "JOIN Mechanics",
    title: "INNER vs LEFT JOIN & Cartesian Duplication",
    tagline: "Preserve unmatched records and avoid unintentional row multiplication.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Preserving Outer Records with LEFT JOIN",
        content: "`INNER JOIN` only outputs rows where the join predicate matches in BOTH tables. `LEFT JOIN` guarantees that every record from the left table appears at least once, filling unmatched right columns with `NULL`.",
        codeSnippet: "SELECT u.username, o.order_id\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;",
        sandboxCode: "SELECT u.username, a.action FROM users u LEFT JOIN audit_logs a ON u.id = a.user_id;"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "WHERE Clause on LEFT JOIN Trap",
        prompt: "What happens if you add `WHERE o.status = 'shipped'` on a `LEFT JOIN orders o`?",
        codeSnippet: "SELECT u.username, o.order_id\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.status = 'shipped';",
        options: [
          { text: "It silently converts the query into an INNER JOIN, dropping users with no orders", isCorrect: true, feedback: "🎯 Correct! When o is unmatched, o.status is NULL. Since NULL = 'shipped' is UNKNOWN, those users are discarded!" },
          { text: "It keeps users with no orders and sets status to shipped", isCorrect: false, feedback: "WHERE filters rows after the join is generated." },
          { text: "Syntax Error: invalid filter", isCorrect: false, feedback: "The syntax is valid but logically flawed." },
          { text: "Throws a runtime database exception", isCorrect: false, feedback: "It executes normally as an inner join." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Cartesian Explosion on Multi-valued Joins",
        content: "Joining a table to two independent 1-to-many child tables (`users` -> `emails` and `users` -> `phones`) produces an $M \\times N$ Cartesian product, duplicating counts and summing totals multiple times!",
        codeSnippet: "-- ❌ BUG: Sums will be multiplied!\nSELECT u.id, SUM(e.cost), SUM(p.amount) ...",
        tip: "Hacker Rule: Filter outer table columns directly in the `ON` clause: `ON u.id = o.user_id AND o.status = 'shipped'`.",
        arenaTarget: "game.html?lang=sql&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "sql-les-003",
    language: "sql",
    difficulty: "expert",
    topic: "Window Functions & Analytics",
    title: "Window Functions: `ROW_NUMBER()`, `RANK()` & `PARTITION BY`",
    tagline: "Perform calculations across row sets without collapsing rows like GROUP BY.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Calculate Metrics Without Collapsing Rows",
        content: "Unlike `GROUP BY`, which aggregates multiple rows into a single summary row, window functions (`OVER (...)`) retain the original row identity while computing moving averages, rankings, and running totals.",
        codeSnippet: "SELECT username, role, xp,\n       ROW_NUMBER() OVER (PARTITION BY role ORDER BY xp DESC) as role_rank\nFROM users;",
        sandboxCode: "SELECT username, role, xp, RANK() OVER (ORDER BY xp DESC) as global_rank FROM users;"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "ROW_NUMBER vs RANK vs DENSE_RANK",
        prompt: "If two users tie for 1st place with identical XP, what does `DENSE_RANK()` assign to the 3rd user?",
        codeSnippet: "SELECT username, xp, DENSE_RANK() OVER (ORDER BY xp DESC) FROM users;",
        options: [
          { text: "2 (No gaps in numbering)", isCorrect: true, feedback: "🎯 Correct! DENSE_RANK produces: 1, 1, 2. (Whereas standard RANK produces: 1, 1, 3 with a gap)." },
          { text: "3 (With a gap)", isCorrect: false, feedback: "Standard RANK introduces gaps; DENSE_RANK does not." },
          { text: "1.5", isCorrect: false, feedback: "Rank functions always assign integers." },
          { text: "NULL", isCorrect: false, feedback: "Ranking functions always assign valid integer ranks." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Filtering Window Functions in WHERE Clause",
        content: "Window functions execute in SQL's phase 5, AFTER the `WHERE` (phase 2) and `HAVING` (phase 4) clauses! Attempting `WHERE ROW_NUMBER() = 1` causes an immediate syntax error.",
        codeSnippet: "-- ❌ SYNTAX ERROR:\nSELECT * FROM users WHERE ROW_NUMBER() OVER () = 1;\n\n-- ✅ IDIOMATIC FIX: Use a CTE or Subquery:\nWITH Ranked AS (\n  SELECT *, ROW_NUMBER() OVER (...) as rn FROM users\n)\nSELECT * FROM Ranked WHERE rn = 1;",
        tip: "Hacker Rule: Wrap window function logic inside a Common Table Expression (`WITH ...`) to filter ranks.",
        arenaTarget: "game.html?lang=sql&diff=expert&stage=1"
      }
    ]
  },

  // =========================================================================
  // 11. CYBER & LINUX TRACK (3 Lessons)
  // =========================================================================
  {
    id: "cyber-les-001",
    language: "cyber",
    difficulty: "beginner",
    topic: "Linux File Permissions",
    title: "Octal Notation (`chmod 755`), Inodes & Permissions",
    tagline: "Calculate read, write, and execute bits across User, Group, and Others.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Read=4, Write=2, Execute=1",
        content: "Linux file permissions are 3 octal digits: `[User][Group][Others]`.\nEach digit is the sum of:\n- **r (read)** = 4\n- **w (write)** = 2\n- **x (execute)** = 1\n\nTherefore, `7` ($4+2+1$) means full access, `5` ($4+1$) means read & execute, and `0` means zero access.",
        codeSnippet: "# Grants User rwx (7), Group rx (5), Others rx (5):\nchmod 755 deploy.sh\n\n# Owner read/write only (secure keys):\nchmod 600 id_rsa",
        sandboxCode: "ls -la /etc/passwd"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Octal Calculation Check",
        prompt: "What octal numeric mode corresponds to `-rw-r--r--` permissions?",
        codeSnippet: "ls -l config.json\n-rw-r--r-- 1 root root 1024 Oct 22 config.json",
        options: [
          { text: "644 (User: 4+2=6, Group: 4, Others: 4)", isCorrect: true, feedback: "🎯 Correct! rw- is 4+2=6, r-- is 4, and r-- is 4. Standard secure file permission." },
          { text: "755", isCorrect: false, feedback: "755 includes execute permissions (rwxr-xr-x)." },
          { text: "600", isCorrect: false, feedback: "600 restricts Group and Others to 0." },
          { text: "777", isCorrect: false, feedback: "777 grants full write access to everyone." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "The `chmod 777` Security Anti-Pattern",
        content: "Granting `777` permissions allows ANY process or unprivileged user on the machine to overwrite, inject, or tamper with your files. It is an immediate critical audit finding!",
        codeSnippet: "# ❌ CRITICAL SECURITY VULNERABILITY:\nchmod 777 /var/www/uploads\n\n# ✅ LEAST PRIVILEGE PRINCIPLE:\nchmod 750 /var/www/uploads",
        tip: "Hacker Rule: Use `600` for private SSH keys and `644` for public configuration files.",
        arenaTarget: "game.html?lang=cyber&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "cyber-les-002",
    language: "cyber",
    difficulty: "intermediate",
    topic: "Standard Streams & Redirection",
    title: "File Descriptors: stdin (0), stdout (1), stderr (2) & Pipes",
    tagline: "Tame UNIX pipelines and master `2>&1` error redirection.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Every Process Starts with 3 Open Streams",
        content: "In Linux, every process receives:\n- `0`: Standard Input (stdin)\n- `1`: Standard Output (stdout)\n- `2`: Standard Error (stderr)\n\nPipes (`cmd1 | cmd2`) connect stdout of cmd1 directly into stdin of cmd2. By default, stderr is NOT piped!",
        codeSnippet: "# Redirect stderr to /dev/null (silence errors):\nfind / -name \"flag.txt\" 2>/dev/null\n\n# Redirect both stdout and stderr into log.txt:\n./build.sh > log.txt 2>&1",
        sandboxCode: "cat /etc/passwd | grep hacker"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "2>&1 Order Sensitivity",
        prompt: "Why must `2>&1` appear AFTER `> log.txt` when redirecting both streams?",
        codeSnippet: "cmd > log.txt 2>&1",
        options: [
          { text: "Shell evaluations are processed left-to-right: 1 is redirected to log.txt first, then 2 is duplicated to where 1 currently points", isCorrect: true, feedback: "🎯 Correct! If you wrote `2>&1 > log.txt`, stderr would point to the original terminal output instead of the file!" },
          { text: "It is a strict bash syntax requirement with no mechanical difference", isCorrect: false, feedback: "Stream duplication is strictly order-dependent." },
          { text: "2>&1 closes stdout if placed first", isCorrect: false, feedback: "It duplicates descriptor references." },
          { text: "The shell throws a syntax error if placed in reverse", isCorrect: false, feedback: "Both compile, but produce different stream targets." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Piping to Bash from Web Traps",
        content: "Running `curl https://example.com/install.sh | bash` executes unchecked scripts with the current user's privileges, opening complete Remote Code Execution (RCE) vectors if DNS or TLS is compromised!",
        codeSnippet: "# ❌ DANGEROUS RCE:\ncurl -sSL https://site.com/install.sh | bash\n\n# ✅ SAFE INSPECTION:\ncurl -sSL https://site.com/install.sh -o install.sh\nless install.sh # Review code before executing!",
        tip: "Hacker Rule: Always inspect scripts offline with checksum verification before piping to a shell.",
        arenaTarget: "game.html?lang=cyber&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "cyber-les-003",
    language: "cyber",
    difficulty: "expert",
    topic: "Privilege Escalation & Inodes",
    title: "SUID / SGID Binaries, Capability Bits & PATH Hijacking",
    tagline: "Identify privilege boundary breaches and unquoted system calls.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "The SUID (Set User ID) Bit",
        content: "When a binary has the SUID bit set (`-rwsr-xr-x`), it executes with the privileges of the **file owner** (often root) rather than the user running it.\n\nIf an SUID root binary executes external commands using relative paths (e.g. `system(\"service apache2 restart\")`), it is vulnerable to PATH hijacking!",
        codeSnippet: "# Find all SUID binaries on the system:\nfind / -perm -u=s -type f 2>/dev/null",
        sandboxCode: "console.log('SUID binaries execute with file owner permissions regardless of invoking user');"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "SUID Flag Identification",
        prompt: "Which character in `ls -l` indicates that the SUID bit is active and executable?",
        codeSnippet: "-rwsr-xr-x 1 root root 88304 Feb 15 /usr/bin/passwd",
        options: [
          { text: "Lowercase 's' in the owner execute position", isCorrect: true, feedback: "🎯 Correct! Lowercase 's' means SUID is set AND execute permission is present. Capital 'S' indicates SUID without execute." },
          { text: "The leading hyphen '-'", isCorrect: false, feedback: "Hyphen indicates a regular file." },
          { text: "The digit '1'", isCorrect: false, feedback: "The digit is the hard link count." },
          { text: "The 'x' in group position", isCorrect: false, feedback: "That indicates group execute." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Relative Command Invocations in C system()",
        content: "If an SUID program calls `system(\"date\")` instead of `/bin/date`, an attacker can create a malicious executable named `date` in `/tmp` and prepend `/tmp` to `PATH` to achieve root shell execution!",
        codeSnippet: "// ❌ VULNERABLE SUID C CODE:\nsystem(\"service start\");\n\n// ✅ SECURE HARDENED CODE:\nsystem(\"/usr/sbin/service start\");",
        tip: "Hacker Rule: Always use absolute paths (`/usr/bin/cmd`) or `execve` with a sanitized environment.",
        arenaTarget: "game.html?lang=cyber&diff=expert&stage=1"
      }
    ]
  },

  // =========================================================================
  // 12. TYPESCRIPT TRACK (3 Lessons)
  // =========================================================================
  {
    id: "ts-les-001",
    language: "typescript",
    difficulty: "beginner",
    topic: "Structural Typing & Unknown",
    title: "Structural Typing (Duck Typing) & `unknown` vs `any`",
    tagline: "Enforce compile-time safety and eliminate runtime type escape hatches.",
    estimatedMinutes: 2,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "TypeScript Uses Structural (Shape-based) Typing",
        content: "Unlike Java or C# (nominal typing), TypeScript determines type compatibility based purely on the shape and properties of an object.\n\n`any` completely turns off the type checker. In contrast, `unknown` forces you to narrow the type with a type guard before accessing any properties!",
        codeSnippet: "let val: unknown = JSON.parse(userInput);\n\n// val.toUpperCase(); // ❌ Compile error: Object is of type 'unknown'!\nif (typeof val === 'string') {\n  console.log(val.toUpperCase()); // ✅ Safe! Narrowed to string.\n}",
        sandboxCode: "let val: unknown = 'SyntaxArena TS';\nif (typeof val === 'string') {\n  console.log('Uppercase:', val.toUpperCase());\n}"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Shape Compatibility",
        prompt: "Will assigning `point3D` to a variable typed as `Point2D` compile?",
        codeSnippet: "interface Point2D { x: number; y: number; }\nconst point3D = { x: 1, y: 2, z: 3 };\nconst p: Point2D = point3D;",
        options: [
          { text: "Yes, it compiles cleanly because point3D has all required properties of Point2D", isCorrect: true, feedback: "🎯 Correct! In structural typing, as long as an object satisfies the required contract, extra properties are allowed." },
          { text: "No, point3D has an extra 'z' property causing a type mismatch", isCorrect: false, feedback: "Extra properties are accepted when assigning an existing variable." },
          { text: "Throws a runtime TypeError", isCorrect: false, feedback: "TypeScript types do not exist at runtime." },
          { text: "Requires an explicit cast (as Point2D)", isCorrect: false, feedback: "Structural assignment is implicit." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "The Viral Nature of `any`",
        content: "Using `any` infects any downstream variable it touches! An `any` value assigned to other variables disables autocomplete and type safety throughout your entire codebase.",
        codeSnippet: "// ❌ VIRAL TYPE LEAK:\nfunction parse(data: any) {\n  return data.payload; // Type of return is also 'any'!\n}",
        tip: "Hacker Rule: Always prefer `unknown` over `any` for incoming network payloads and user inputs.",
        arenaTarget: "game.html?lang=typescript&diff=beginner&stage=1"
      }
    ]
  },
  {
    id: "ts-les-002",
    language: "typescript",
    difficulty: "intermediate",
    topic: "Discriminated Unions & Exhaustiveness",
    title: "Discriminated Unions & Exhaustiveness Checking with `never`",
    tagline: "Build unshakeable state machines verified by the TypeScript compiler.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Tagging Types with a Discriminant Property",
        content: "A discriminated union combines multiple types that all share a literal discriminant property (like `kind` or `status`).\n\nInside a `switch` statement, TypeScript narrows the type automatically. You can use the `never` type in the `default` branch to ensure all cases are handled at compile time!",
        codeSnippet: "type State =\n  | { status: 'loading' }\n  | { status: 'success'; data: string }\n  | { status: 'error'; message: string };\n\nfunction render(s: State) {\n  switch (s.status) {\n    case 'loading': return '...';\n    case 'success': return s.data;\n    case 'error': return s.message;\n  }\n}",
        sandboxCode: "type Action = { type: 'login'; user: string } | { type: 'logout' };\nfunction handle(a: Action) { console.log(a.type); }"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Compile-time Exhaustiveness Check",
        prompt: "What happens if a new status `'idle'` is added to `State`, but not handled in `switch (s.status)` with an `assertNever(s)` default branch?",
        codeSnippet: "function assertNever(x: never): never {\n  throw new Error('Unexpected object: ' + x);\n}\ndefault: return assertNever(s);",
        options: [
          { text: "Compiler error: Argument of type '{ status: \"idle\" }' is not assignable to parameter of type 'never'", isCorrect: true, feedback: "🎯 Correct! The compiler proves that 'idle' can reach the default branch, catching the missing case before production deployment!" },
          { text: "Code compiles and skips execution silently", isCorrect: false, feedback: "assertNever forces a compile-time check." },
          { text: "Runtime exception only", isCorrect: false, feedback: "The type checker catches it at build time." },
          { text: "The state is coerced to null", isCorrect: false, feedback: "TypeScript preserves type information." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Type Assertions (`as SomeType`) Lie to the Compiler",
        content: "Using `as Type` does NOT convert or validate data at runtime. It simply forces the compiler to trust you. If the actual object shape differs, your app will crash with `undefined is not a function` at runtime!",
        codeSnippet: "// ❌ DANGEROUS CRASH AT RUNTIME:\nconst user = {} as User;\nuser.login(); // Uncaught TypeError: user.login is not a function!",
        tip: "Hacker Rule: Use Zod or custom type predicates (`function isUser(x: any): x is User`) instead of `as Type`.",
        arenaTarget: "game.html?lang=typescript&diff=intermediate&stage=1"
      }
    ]
  },
  {
    id: "ts-les-003",
    language: "typescript",
    difficulty: "expert",
    topic: "Advanced Type Metaprogramming",
    title: "Conditional Types, `infer` Keyword & Template Literals",
    tagline: "Build dynamic, introspective type transformers that compute types at compile-time.",
    estimatedMinutes: 3,
    slides: [
      {
        type: "concept",
        badge: "01 // MENTAL MODEL",
        title: "Types as Functional Programs",
        content: "TypeScript's type system is Turing-complete. Conditional types (`T extends U ? X : Y`) act like ternary operators. The `infer` keyword allows you to deduce and extract unknown inner types dynamically!",
        codeSnippet: "type UnpackPromise<T> = T extends Promise<infer U> ? U : T;\n\ntype Result = UnpackPromise<Promise<string>>; // Result is string!\ntype Direct = UnpackPromise<number>;          // Direct is number!",
        sandboxCode: "type EventName<T extends string> = `on${Capitalize<T>}`;\ntype Click = EventName<'click'>; // 'onClick'"
      },
      {
        type: "drill",
        badge: "02 // INTERACTIVE CHECKPOINT",
        title: "Infer Type Extraction",
        prompt: "What type does `ReturnType<() => number>` evaluate to using `infer R`?",
        codeSnippet: "type CustomReturnType<T> = T extends (...args: any[]) => infer R ? R : any;\ntype Test = CustomReturnType<() => number>;",
        options: [
          { text: "number", isCorrect: true, feedback: "🎯 Correct! The infer keyword inspects the return position of the function signature and resolves to number." },
          { text: "() => number", isCorrect: false, feedback: "It unpacks the return type, not the function type." },
          { text: "any", isCorrect: false, feedback: "The condition matches, so R is extracted." },
          { text: "void", isCorrect: false, feedback: "The signature explicitly returns number." }
        ]
      },
      {
        type: "pitfall",
        badge: "03 // DANGER ZONE",
        title: "Distributive Conditional Types with Unions",
        content: "When a bare generic parameter `T` is checked with `T extends any`, it automatically distributes over union members! To prevent distribution, wrap `T` in brackets: `[T] extends [any]`.",
        codeSnippet: "// Distributive: (string extends any ? X : Y) | (number extends any ? X : Y)\ntype ToArray<T> = T extends any ? T[] : never;\ntype Res = ToArray<string | number>; // string[] | number[], NOT (string | number)[]!",
        tip: "Hacker Rule: Wrap generics in tuples `[T] extends [U]` to disable unwanted union distribution.",
        arenaTarget: "game.html?lang=typescript&diff=expert&stage=1"
      }
    ]
  }
];

const outContent = `/**
 * SyntaxArena Cyber Academy — Complete 36-Lesson Curriculum Catalog
 * Exactly 3 curated interactive lessons per track (Beginner, Intermediate, Expert)
 * across all 12 programming tracks:
 * Python, C, C++, Java, Cyber & Linux, JavaScript, Rust, SQL, TypeScript, Go, HTML5 & CSS, Assembly & RE.
 * Source of truth: docs/MVP_SPEC.md & docs/DESIGN_SYSTEM.md
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
    if (!diff) return list;
    const cleanDiff = String(diff).toLowerCase().trim();
    return list.filter(l => l.difficulty === cleanDiff);
  },

  getById(id) {
    return academyLessons.find(l => l.id === id) || null;
  }
};
`;

const targetPath = path.resolve('data/academy-lessons.js');
fs.writeFileSync(targetPath, outContent, 'utf8');
console.log(`Successfully generated ${lessons.length} lessons in ${targetPath}`);
