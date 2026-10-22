/**
 * SyntaxArena Cyber Academy — Interactive Micro-Lesson Catalog
 * Pedagogical Structure:
 * 1. Concept: Clean mental model, formatted rules, syntax-highlighted code.
 * 2. Drill: Interactive zero-stress checkpoint with immediate feedback.
 * 3. Pitfall: Danger zone red-alert showing common bugs vs idiomatic fixes.
 * Direct bridge to Arena Battle Tests.
 */

export const academyLessons = [
  // =========================================================================
  // PYTHON TRACK
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
  // JAVASCRIPT TRACK
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

  // =========================================================================
  // HTML5 & CSS TRACK
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

  // =========================================================================
  // ASSEMBLY & REVERSE ENGINEERING TRACK
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

  // =========================================================================
  // GO TRACK
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
  }
];

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
