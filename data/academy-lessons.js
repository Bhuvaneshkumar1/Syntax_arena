/**
 * SyntaxArena Cyber Academy Interactive Curriculum Lessons Catalog
 * Complete 12-Track Interactive Handbook (5 In-Depth Chapters per Track across all 12 Languages)
 * Generated automatically by scripts/generate-academy-handbook.js
 */

export const academyLessons = [
  {
    "id": "py-les-001",
    "language": "python",
    "difficulty": "beginner",
    "topic": "Variables & Memory Model",
    "title": "Chapter 1: The Memory Architecture — Names, Pointers, and Heap Binding",
    "tagline": "Master how CPython allocates objects on the heap and binds variable identifiers.",
    "estimatedMinutes": 6,
    "objectives": [
      "Differentiate between low-level memory boxes (C/C++) and Python name-tag bindings",
      "Understand mutable vs immutable object behavior and reference sharing",
      "Trace object identity using id() and the difference between is and ==",
      "Avoid unintended side-effects caused by list and dictionary aliasing"
    ],
    "chapterSummary": "In compiled systems programming languages such as C, a variable declaration represents a physical, bounded slot of bytes carved directly out of the memory stack. Storing an integer means depositing raw electrical bits into that specific hardware address.\n\nPython takes a radically distinct architectural approach: in Python, **all values are first-class heap-allocated objects**, and variable identifiers are merely **lightweight symbolic name tags (pointers)** referencing those objects. When you assign `b = a`, Python performs zero data copying. Instead, it increments the object's internal reference count and points both names to the exact same memory address!",
    "deepDive": {
      "title": "CPython PyObject Header & Reference Counting",
      "content": "At the CPython runtime level, every Python object begins with a standardized C struct header:\n\n```c\ntypedef struct _object {\n    _PyObject_HEAD_EXTRA\n    Py_ssize_t ob_refcnt;\n    struct _typeobject *ob_type;\n} PyObject;\n```\n\n`ob_refcnt` tracks active references. When a name tag is rebound or exits scope, `ob_refcnt` decrements. When it hits zero, CPython immediately deallocates the memory without waiting for a garbage collection sweep.",
      "codeSnippet": "import sys\nx = [1, 2, 3]\nprint(\"Initial refcount:\", sys.getrefcount(x) - 1)\ny = x\nprint(\"Refcount after y = x:\", sys.getrefcount(x) - 1)"
    },
    "takeaways": [
      "Variables in Python are references/pointers, not isolated memory boxes.",
      "Assignment (=) never copies complex data; use list.copy() or copy.deepcopy().",
      "Never use mutable objects ([], {}) as default function arguments.",
      "is checks memory identity (address), whereas == checks equality of contents."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Variables are Labels Bound to Heap Objects",
        "content": "Every Python entity—from integers and strings to complex lists and custom classes—is wrapped inside a C-level `PyObject` struct allocated on the heap.\n\nWhen you execute `a = [1, 2, 3]`, Python carves out a list object at a distinct memory address. When you execute `b = a`, you simply attach a second label `b` to that same list! Consequently, mutating the list via `b.append(99)` modifies the underlying object in-place, and reading `a` immediately reflects the change.",
        "codeSnippet": "# Both labels refer to the exact same list in heap memory:\na = [1, 2, 3]\nb = a\n\nb.append(99)\nprint(a)  # Output: [1, 2, 3, 99]!\nprint(\"Memory identity identical?\", a is b)",
        "sandboxCode": "a = [1, 2, 3]\nb = a\nb.append(99)\nprint('a is:', a)\nprint('b is:', b)\nprint('Same memory address (a is b)?', a is b)\nprint('Memory ID of a:', hex(id(a)))\nprint('Memory ID of b:', hex(id(b)))"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Predict the Mutation",
        "prompt": "Review the snippet below. What will `x[0]` output when printed?",
        "codeSnippet": "x = [10, 20]\ny = x\ny[0] = 999\nprint(x[0])",
        "options": [
          {
            "text": "10",
            "isCorrect": false,
            "feedback": "Remember: lists are mutable and y points to the exact same heap object as x."
          },
          {
            "text": "999",
            "isCorrect": true,
            "feedback": "🎯 Correct! Since y and x reference the identical list in memory, mutating via y directly changes x."
          },
          {
            "text": "TypeError",
            "isCorrect": false,
            "feedback": "List index reassignment is standard, valid syntax in Python."
          },
          {
            "text": "IndexError",
            "isCorrect": false,
            "feedback": "Index 0 exists within the 2-element list."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "The Mutable Default Parameter Trap",
        "content": "Default parameter expressions are evaluated **exactly once** when the function definition is loaded into memory, NOT each time the function is called! If you write `def add_item(item, basket=[])`, that list is allocated once in the function object's `__defaults__` tuple and shared across all future calls.",
        "codeSnippet": "# ❌ DANGEROUS BUG:\ndef add_item(item, basket=[]):\n    basket.append(item)\n    return basket\n\n# ✅ IDIOMATIC FIX:\ndef add_item_safe(item, basket=None):\n    if basket is None:\n        basket = []\n    basket.append(item)\n    return basket",
        "tip": "Hacker Rule: Always use None as the default value for mutable arguments (lists, dicts, sets).",
        "arenaTarget": "game.html?lang=python&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "py-les-002",
    "language": "python",
    "difficulty": "intermediate",
    "topic": "Scope & Closures",
    "title": "Chapter 2: Lexical Scopes, Closures & Execution Frames",
    "tagline": "Understand how Python resolves variable names across nested namespaces and closures.",
    "estimatedMinutes": 7,
    "objectives": [
      "Master the LEGB (Local -> Enclosing -> Global -> Built-in) lookup sequence",
      "Understand how closures capture variables from enclosing scopes using cell objects",
      "Distinguish between reading vs modifying variables in outer scopes",
      "Correctly apply nonlocal and global keywords to eliminate UnboundLocalError"
    ],
    "chapterSummary": "Python uses lexical scoping to determine variable visibility: inner code blocks can always inspect variables declared in surrounding outer blocks. However, Python employs a subtle static parsing rule: if a variable is assigned anywhere within a function body, the Python compiler marks that variable as strictly **Local** to the entire function!\n\nThis rule prevents accidental overwriting of outer variables, but without understanding `nonlocal`, it frequently triggers puzzling `UnboundLocalError` crashes when mutating outer counters.",
    "deepDive": {
      "title": "Bytecode Inspection: LOAD_FAST vs LOAD_DEREF",
      "content": "When Python compiles a function, it categorizes variables into fast local array slots (`LOAD_FAST`) vs heap-allocated cell objects for closures (`LOAD_DEREF`). You can inspect this disassembly directly with Python's `dis` module.",
      "codeSnippet": "import dis\n\ndef outer():\n    x = 10\n    def inner():\n        return x\n    return inner\n\ndis.dis(outer)"
    },
    "takeaways": [
      "Python checks Local -> Enclosing -> Global -> Built-in (LEGB).",
      "Assignment inside a function marks that variable Local for the whole function unless declared global or nonlocal.",
      "Closures capture enclosing variables by reference, leading to late-binding gotchas in loops.",
      "Use default argument evaluation (lambda x=x: x) to freeze loop variables."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The LEGB Rule: Local -> Enclosing -> Global -> Builtin",
        "content": "When resolving an identifier, Python searches four concentric namespace dictionaries in strict order:\n1. **Local (L)**: Names bound inside the currently executing function.\n2. **Enclosing (E)**: Names bound in outer enclosing functions (from inner to outermost).\n3. **Global (G)**: Names bound at module top-level.\n4. **Builtin (B)**: Built-in library identifiers (`len`, `range`, `ValueError`).\n\nInner functions can freely read enclosing variables. But assigning requires `nonlocal`.",
        "codeSnippet": "def make_counter():\n    count = 0\n    def step():\n        nonlocal count  # Captures enclosing count!\n        count += 1\n        return count\n    return step\n\nc = make_counter()\nprint(c(), c())  # Output: 1 2",
        "sandboxCode": "def make_counter(start=0):\n    val = start\n    def increment():\n        nonlocal val\n        val += 1\n        return val\n    return increment\n\ncounter = make_counter(10)\nprint('Counter call 1:', counter())\nprint('Counter call 2:', counter())\nprint('Counter call 3:', counter())"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "UnboundLocalError Trap",
        "prompt": "What error occurs if you try `count += 1` inside `step()` without declaring `nonlocal count`?",
        "codeSnippet": "def outer():\n    count = 10\n    def inner():\n        count += 1\n        return count\n    return inner()",
        "options": [
          {
            "text": "UnboundLocalError: local variable count referenced before assignment",
            "isCorrect": true,
            "feedback": "🎯 Spot on! Python sees the assignment in inner() and marks count as Local, causing a lookup failure before assignment."
          },
          {
            "text": "Returns 11 normally",
            "isCorrect": false,
            "feedback": "Python does not automatically modify enclosing variables without nonlocal."
          },
          {
            "text": "SyntaxError: invalid assignment",
            "isCorrect": false,
            "feedback": "The syntax is valid; the error is a runtime UnboundLocalError."
          },
          {
            "text": "NameError: count is not defined",
            "isCorrect": false,
            "feedback": "Because count is marked local at compile time, Python throws UnboundLocalError, not NameError."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Late Binding in Loop Closures",
        "content": "A classic interview gotcha occurs when defining functions inside a loop. Closures capture variables **by reference**, not by value at creation time! By the time the functions execute, the loop has completed and all closures read the final value.",
        "codeSnippet": "# ❌ DANGEROUS BUG (all print 2):\nfuncs = [lambda: i for i in range(3)]\nprint([f() for f in funcs])  # Output: [2, 2, 2]\n\n# ✅ IDIOMATIC FIX (bind immediately via default param):\nfuncs_fixed = [lambda i=i: i for i in range(3)]\nprint([f() for f in funcs_fixed])  # Output: [0, 1, 2]",
        "tip": "Hacker Rule: Use default arguments `lambda i=i: ...` to freeze loop variables at creation time.",
        "arenaTarget": "game.html?lang=python&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "py-les-003",
    "language": "python",
    "difficulty": "intermediate",
    "topic": "Generators & Iteration",
    "title": "Chapter 3: Memory-Efficient Streaming with Generators & Iterators",
    "tagline": "Stream gigabytes of data with near-zero memory footprint using the yield protocol.",
    "estimatedMinutes": 6,
    "objectives": [
      "Master the Python iterator protocol (__iter__ and __next__)",
      "Understand how yield freezes execution frames and maintains state",
      "Compare memory consumption: lists vs generator expressions",
      "Use yield from to compose and delegate subgenerators cleanly"
    ],
    "chapterSummary": "When loading large datasets, creating intermediate lists (like `[x**2 for x in range(10_000_000)]`) forces Python to allocate hundreds of megabytes of RAM on the heap. If your process only needs to process items one by one, this eager allocation is wasteful and risks out-of-memory crashes.\n\nGenerators solve this by implementing **lazy evaluation**. A generator yields elements on demand, maintaining only a single execution frame in memory!",
    "deepDive": {
      "title": "Subgenerator Delegation with yield from",
      "content": "Python 3.3 introduced `yield from`, which establishes a transparent bidirectional channel between caller and subgenerator, automatically propagating return values and exceptions.",
      "codeSnippet": "def sub():\n    yield 1\n    yield 2\n    return \"Finished\"\n\ndef parent():\n    result = yield from sub()\n    yield result\n\nprint(list(parent()))  # [1, 2, 'Finished']"
    },
    "takeaways": [
      "Generators produce values on demand (lazy evaluation), keeping memory bounded.",
      "yield suspends the function frame, retaining local variable state.",
      "Generators are exhausted after one complete pass; they cannot be reset.",
      "yield from delegates iteration cleanly to subgenerators."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Lazy Evaluation via the yield Keyword",
        "content": "When a function contains the `yield` keyword, calling it does NOT execute the body. Instead, it returns a generator object.\n\nEach time `next(gen)` is called, the execution resumes right after the last `yield`, runs until it hits the next `yield`, returns the value, and **freezes its execution frame** in place until requested again!",
        "codeSnippet": "def count_up_to(n):\n    count = 1\n    while count <= n:\n        yield count\n        count += 1\n\ngen = count_up_to(3)\nprint(next(gen))  # 1\nprint(next(gen))  # 2\nprint(next(gen))  # 3",
        "sandboxCode": "def fibonacci_stream():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nfib = fibonacci_stream()\nfirst_8 = [next(fib) for _ in range(8)]\nprint('First 8 Fibonacci numbers:', first_8)"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "StopIteration Protocol Check",
        "prompt": "What happens under the hood when a standard for-loop iterates through a generator that finishes?",
        "codeSnippet": "def simple_gen():\n    yield 'A'\n    return 'Done'\n\nfor item in simple_gen():\n    pass",
        "options": [
          {
            "text": "The generator raises StopIteration, which the for-loop catches and suppresses automatically",
            "isCorrect": true,
            "feedback": "🎯 Exactly! The return value in a generator is attached to the StopIteration(value) exception."
          },
          {
            "text": "The for-loop prints the return value \"Done\"",
            "isCorrect": false,
            "feedback": "for-loops silently discard the return value of StopIteration."
          },
          {
            "text": "A RuntimeError is thrown",
            "isCorrect": false,
            "feedback": "Exiting a generator normally is standard control flow."
          },
          {
            "text": "The generator resets to the beginning",
            "isCorrect": false,
            "feedback": "Generators are single-pass iterators; once exhausted, they cannot be restarted."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Single-Pass Exhaustion Gotcha",
        "content": "Generators are single-pass streams. Once consumed, iterating over them again yields nothing! Writing `if gen:` or `len(gen)` consumes items or fails with a TypeError.",
        "codeSnippet": "# ❌ DANGEROUS BUG:\ngen = (x * 2 for x in [1, 2, 3])\nprint(list(gen))  # [2, 4, 6]\nprint(list(gen))  # [] - Exhausted!",
        "tip": "Hacker Rule: If you must iterate multiple times, convert the generator to a list or recreate it.",
        "arenaTarget": "game.html?lang=python&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "py-les-004",
    "language": "python",
    "difficulty": "expert",
    "topic": "Metaprogramming & Dunder Protocols",
    "title": "Chapter 4: Metaprogramming, Descriptors & Dunder Protocols",
    "tagline": "Unlock Python internals by mastering __new__, descriptors, and dynamic class synthesis.",
    "estimatedMinutes": 8,
    "objectives": [
      "Understand the class instantiation pipeline (__new__ allocator vs __init__ initializer)",
      "Master the Python Descriptor Protocol (__get__, __set__, __delete__)",
      "Learn how @property, methods, and ORM frameworks are built under the hood",
      "Use __init_subclass__ to enforce architectural contracts without complex metaclasses"
    ],
    "chapterSummary": "Python is famous for its extreme dynamism: almost every aspect of object creation, attribute access, and type validation can be intercepted and customized via **dunder (double underscore) special methods**.\n\nBy mastering the descriptor protocol and object allocation lifecycle, you understand how frameworks like Django, SQLAlchemy, and Pydantic implement declarative models and automatic validation.",
    "deepDive": {
      "title": "Modern Contract Enforcement with __init_subclass__",
      "content": "Prior to Python 3.6, validating subclass schemas required complex custom metaclasses. Python 3.6+ introduced `__init_subclass__`, which runs whenever a class inherits from your base.",
      "codeSnippet": "class PluginBase:\n    def __init_subclass__(cls, **kwargs):\n        super().__init_subclass__(**kwargs)\n        if not hasattr(cls, 'execute'):\n            raise TypeError(f\"Subclass {cls.__name__} must implement an execute() method!\")\n\nclass ValidPlugin(PluginBase):\n    def execute(self): print(\"Running plugin\")"
    },
    "takeaways": [
      "__new__ allocates the instance; __init__ initializes its attributes.",
      "Data descriptors (__set__ defined) take priority over instance __dict__ entries.",
      "Avoid self.attr inside __getattribute__ to prevent infinite recursion.",
      "Use __init_subclass__ for clean, lightweight class validation without metaclasses."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Object Allocation Pipeline: __new__ vs __init__",
        "content": "When you invoke a class `C(*args)`, Python executes two distinct steps:\n1. `__new__(cls, *args)`: The static **constructor/allocator** that physically carves out the object instance and returns it.\n2. `__init__(self, *args)`: The **initializer** that populates fields on the newly minted instance.\n\nTo implement singletons, immutable subclasses (like subclassing `int` or `tuple`), or cache instances, you must override `__new__`.",
        "codeSnippet": "class Singleton:\n    _instance = None\n    def __new__(cls, *args, **kwargs):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\na = Singleton()\nb = Singleton()\nprint(\"Are both singletons the exact same instance?\", a is b)  # True",
        "sandboxCode": "class ValidatedInteger:\n    def __init__(self, name):\n        self.name = name\n\n    def __get__(self, instance, owner):\n        if instance is None: return self\n        return instance.__dict__.get(self.name, 0)\n\n    def __set__(self, instance, value):\n        if not isinstance(value, int) or value < 0:\n            raise ValueError(f\"{self.name} must be a positive integer!\")\n        instance.__dict__[self.name] = value\n\nclass Player:\n    score = ValidatedInteger('score')\n\np = Player()\np.score = 500\nprint('Player score:', p.score)"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Attribute Lookup Precedence",
        "prompt": "When accessing obj.x, which of the following has highest priority in Python lookup order?",
        "codeSnippet": "class Demo:\n    @property\n    def x(self): return \"Property\"\n\nd = Demo()\nd.__dict__['x'] = \"Instance Dict\"",
        "options": [
          {
            "text": "A data descriptor with both __get__ and __set__ (such as @property)",
            "isCorrect": true,
            "feedback": "🎯 Correct! Data descriptors override instance __dict__ lookups by design."
          },
          {
            "text": "The instance __dict__ dictionary",
            "isCorrect": false,
            "feedback": "Instance dictionary lookups only beat non-data descriptors (which only define __get__)."
          },
          {
            "text": "The class __dict__ dictionary",
            "isCorrect": false,
            "feedback": "Class dictionary is checked, but data descriptors take top precedence."
          },
          {
            "text": "__getattr__ method fallback",
            "isCorrect": false,
            "feedback": "__getattr__ is only called as the very last resort when nothing else finds the attribute."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Recursive Loop in __getattribute__",
        "content": "Overriding `__getattribute__` intercepts EVERY attribute access. Accessing `self.x` inside it triggers `__getattribute__` again, causing infinite recursion and a `RecursionError`!",
        "codeSnippet": "# ❌ DANGEROUS BUG (Infinite Recursion):\nclass Bad:\n    def __getattribute__(self, name):\n        return self.name  # Recursively calls __getattribute__!\n\n# ✅ IDIOMATIC FIX:\nclass Good:\n    def __getattribute__(self, name):\n        return super().__getattribute__(name)",
        "tip": "Hacker Rule: Always delegate to super().__getattribute__(name) when customizing attribute resolution.",
        "arenaTarget": "game.html?lang=python&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "py-les-005",
    "language": "python",
    "difficulty": "expert",
    "topic": "Asyncio & Concurrency",
    "title": "Chapter 5: Asynchronous I/O, Event Loops & Cooperative Multitasking",
    "tagline": "Build high-throughput concurrent networked applications without thread contention.",
    "estimatedMinutes": 8,
    "objectives": [
      "Understand cooperative multitasking and the single-threaded event loop",
      "Distinguish between CPU-bound (multiprocessing) vs I/O-bound (asyncio) workloads",
      "Master the lifecycle of coroutines, tasks, and futures",
      "Avoid event loop blocking traps that freeze asynchronous servers"
    ],
    "chapterSummary": "Traditional multi-threaded servers spawn OS threads to handle incoming connections. However, OS threads require stack memory overhead (typically 2MB–8MB each) and incur substantial kernel context-switching latency. When handling 50,000 concurrent sockets waiting for database queries, threads collapse under their own weight.\n\nPython's `asyncio` solves the C10K problem through **cooperative multitasking**. A single OS thread executes an **event loop**, multiplexing thousands of coroutines that explicitly yield control whenever they are waiting on I/O.",
    "deepDive": {
      "title": "Task Cancellation & Shielding",
      "content": "Tasks in asyncio can be cancelled at any await point via `task.cancel()`. When cancelled, a `CancelledError` is injected into the coroutine. Critical operations (like database transactions) must be protected with `asyncio.shield()`.",
      "codeSnippet": "async def critical_write():\n    try:\n        await asyncio.sleep(0.5)\n        print(\"Data written safely\")\n    except asyncio.CancelledError:\n        print(\"Rollback transaction!\")\n        raise"
    },
    "takeaways": [
      "Asyncio provides cooperative concurrency on a single OS thread.",
      "await yields control back to the event loop so other tasks can execute.",
      "Never call synchronous blocking functions (like time.sleep) inside coroutines.",
      "Use asyncio.to_thread() to run blocking CPU or legacy synchronous I/O."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Asyncio Event Loop & Coroutine State Machine",
        "content": "An `async def` function does NOT run immediately when invoked. Instead, it returns a **coroutine object**.\n\nWhen you `await` an asynchronous operation (like reading a socket), the coroutine yields control back to the event loop. The loop processes other active tasks until the OS signals that data is ready, at which point the paused coroutine resumes.",
        "codeSnippet": "import asyncio\n\nasync def fetch_data(id, delay):\n    print(f\"Task {id}: starting download...\")\n    await asyncio.sleep(delay)  # Yields control to event loop!\n    print(f\"Task {id}: finished!\")\n    return f\"Data_{id}\"\n\nasync def main():\n    # Run tasks concurrently:\n    results = await asyncio.gather(fetch_data(1, 0.1), fetch_data(2, 0.05))\n    print(\"All tasks finished:\", results)",
        "sandboxCode": "import asyncio\n\nasync def worker(name, delay):\n    print(f\"Worker {name} started\")\n    await asyncio.sleep(delay)\n    print(f\"Worker {name} completed after {delay}s\")\n    return delay\n\nasync def run_batch():\n    results = await asyncio.gather(\n        worker(\"A\", 0.05),\n        worker(\"B\", 0.02),\n        worker(\"C\", 0.04)\n    )\n    print(\"Batch results:\", results)\n\nasyncio.run(run_batch())"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Event Loop Blocking Blunder",
        "prompt": "What happens if you execute time.sleep(5) inside an active asyncio coroutine?",
        "codeSnippet": "import asyncio, time\n\nasync def bad_handler():\n    time.sleep(5)  # Synchronous blocking call!\n    return \"OK\"",
        "options": [
          {
            "text": "It blocks the entire event loop thread, freezing ALL concurrent tasks for 5 seconds",
            "isCorrect": true,
            "feedback": "🎯 Exactly! time.sleep is synchronous and never yields to the event loop, paralyzing the whole server."
          },
          {
            "text": "Asyncio automatically offloads time.sleep to a background thread",
            "isCorrect": false,
            "feedback": "Asyncio never implicitly creates background threads; you must use asyncio.to_thread()."
          },
          {
            "text": "A BlockingIOError is raised",
            "isCorrect": false,
            "feedback": "No error is thrown; the thread simply sleeps, blocking everything."
          },
          {
            "text": "Only that single coroutine pauses while others run normally",
            "isCorrect": false,
            "feedback": "Because Python is cooperative, failing to await yields blocks the whole loop."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Sync Code Blocking the Async Loop",
        "content": "Any synchronous blocking operation (file I/O, heavy JSON parsing, `requests.get()`) executed directly in a coroutine starves the event loop. Use `asyncio.to_thread()` to safely delegate blocking code to a worker pool.",
        "codeSnippet": "# ❌ WRONG (Blocks loop):\nimport requests\nasync def fetch():\n    return requests.get(\"https://api.com\").json()\n\n# ✅ CORRECT (Safe thread delegation):\nasync def fetch_safe():\n    return await asyncio.to_thread(requests.get, \"https://api.com\")",
        "tip": "Hacker Rule: Always use asyncio.sleep() or asyncio.to_thread(); never call blocking sync functions in coroutines.",
        "arenaTarget": "game.html?lang=python&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "c-les-001",
    "language": "c",
    "difficulty": "beginner",
    "topic": "Pointers & Memory Addresses",
    "title": "Chapter 1: Virtual Memory Addresses & Pointer Architecture",
    "tagline": "Master direct physical memory addressing, pointers, and memory layout in C.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand the process address space layout (Stack, Heap, BSS, Data, Text)",
      "Master the address-of (&) and dereference (*) operators",
      "Understand pointer sizing across 32-bit (4 bytes) vs 64-bit (8 bytes) architectures",
      "Trace pointer variables that hold memory addresses pointing to other values"
    ],
    "chapterSummary": "In C, there is no virtual machine layer, no garbage collector, and no object wrapper between your code and the computer hardware. Every variable you declare occupies a concrete, bounded range of bytes at a specific integer address within your process's **virtual address space**.\n\nA **pointer** is simply an integer variable that stores the memory address of another variable. By dereferencing pointers, systems programmers interact directly with hardware buffers, operating system kernel APIs, and high-performance data structures.",
    "deepDive": {
      "title": "64-bit Virtual Memory Architecture",
      "content": "On x86-64 systems, pointers are 64 bits (8 bytes) long. However, modern processors utilize 48-bit canonical addressing (256 TB per process). Addresses starting with `0x7ffe...` represent user stack allocations, while `0x55...` represents code text segments.",
      "codeSnippet": "printf(\"Pointer size: %zu bytes\\n\", sizeof(void*)); // 8 bytes on 64-bit"
    },
    "takeaways": [
      "Pointers hold memory addresses; *ptr accesses the value at that address.",
      "On 64-bit architectures, all pointers are 8 bytes regardless of data type.",
      "Always initialize pointers to NULL to prevent dangerous wild pointer writes.",
      "Pass pointers to functions to achieve pass-by-reference mutation in C."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Memory Addresses & The Pointer Operators (& and *)",
        "content": "Every byte in memory possesses an integer address. Two fundamental operators govern pointers:\n1. `&var` (Address-of): Retrieves the memory address where `var` is stored.\n2. `*ptr` (Dereference): Accesses or modifies the value stored at the address pointed to by `ptr`.\n\nChanging `*ptr` directly modifies the original variable because both refer to the exact same physical bytes.",
        "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int val = 42;\n    int *ptr = &val;  // ptr holds address of val\n\n    printf(\"Original val: %d\\n\", val);\n    *ptr = 999;       // Dereference and mutate!\n    printf(\"Updated val: %d\\n\", val);  // 999\n    return 0;\n}",
        "sandboxCode": "#include <stdio.h>\n\nint main() {\n    int secret = 1337;\n    int *p = &secret;\n\n    printf(\"secret value: %d\\n\", secret);\n    printf(\"secret memory address: %p\\n\", (void*)&secret);\n    printf(\"pointer p holds: %p\\n\", (void*)p);\n    printf(\"dereferenced *p: %d\\n\", *p);\n\n    *p = 7777;\n    printf(\"new secret value: %d\\n\", secret);\n    return 0;\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Pointer Dereference Mutation",
        "prompt": "Review the C snippet below. What will be printed to stdout?",
        "codeSnippet": "int a = 10, b = 20;\nint *p = &a;\n*p = 50;\np = &b;\n*p = 100;\nprintf(\"%d %d\\n\", a, b);",
        "options": [
          {
            "text": "50 100",
            "isCorrect": true,
            "feedback": "🎯 Correct! First *p mutated a to 50, then p was redirected to b, mutating b to 100."
          },
          {
            "text": "10 20",
            "isCorrect": false,
            "feedback": "Dereferencing *p mutates the underlying variable in place."
          },
          {
            "text": "100 100",
            "isCorrect": false,
            "feedback": "p was redirected to b before the second mutation; a remained 50."
          },
          {
            "text": "Segmentation fault",
            "isCorrect": false,
            "feedback": "Both pointers were initialized with valid stack addresses (&a, &b)."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "The Wild Uninitialized Pointer Trap",
        "content": "Declaring a pointer without initializing it (`int *ptr;`) creates a **wild pointer**. It contains whatever random garbage bits were left in that stack memory. Dereferencing it writes to an arbitrary memory address, causing catastrophic memory corruption or a fatal SIGSEGV.",
        "codeSnippet": "// ❌ FATAL CRASH / MEMORY CORRUPTION:\nint *ptr;  // Wild pointer containing garbage bits!\n*ptr = 100; // Undefined Behavior!\n\n// ✅ DEFENSIVE FIX:\nint *ptr = NULL; // Explicitly nullified\nif (ptr != NULL) {\n    *ptr = 100;\n}",
        "tip": "Hacker Rule: Always initialize pointers to NULL or a valid address immediately upon declaration.",
        "arenaTarget": "game.html?lang=c&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "c-les-002",
    "language": "c",
    "difficulty": "beginner",
    "topic": "Pointer Arithmetic & Array Decay",
    "title": "Chapter 2: Pointer Arithmetic & Array Decay Mechanics",
    "tagline": "Understand how arrays decay into pointers and how memory strides are calculated.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand how pointer arithmetic strides scale by sizeof(*ptr)",
      "Master array decay: when array identifiers degrade into pointers",
      "Understand why arr[i] is syntactically equivalent to *(arr + i)",
      "Avoid out-of-bounds buffer overflow vulnerabilities"
    ],
    "chapterSummary": "In C, arrays and pointers share an intimate, fundamental relationship. An array declaration allocates a contiguous block of memory elements. However, in almost all expressions, **the array identifier automatically decays into a pointer** to its first element!\n\nFurthermore, pointer arithmetic in C is typed: adding `1` to an integer pointer does NOT add 1 byte—it advances the memory address by `sizeof(int)` (typically 4 bytes).",
    "deepDive": {
      "title": "Commutative Array Subscripting: i[arr]",
      "content": "Because `arr[i]` expands to `*(arr + i)`, and addition is commutative (`arr + i == i + arr`), `i[arr]` is completely valid in C! While considered an esoteric quirk, it illustrates that brackets are simply pointer arithmetic syntax.",
      "codeSnippet": "int arr[3] = {10, 20, 30};\nprintf(\"%d\\n\", 1[arr]); // Prints 20! Completely valid C."
    },
    "takeaways": [
      "Pointer arithmetic automatically scales by sizeof(*ptr) bytes.",
      "Array names decay to pointers when passed to functions or used in expressions.",
      "arr[i] is syntactic sugar for *(arr + i).",
      "Never compute array length inside functions using sizeof(arr)."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Pointer Arithmetic Scales by Data Type Size",
        "content": "When you write `ptr + 1`, the compiler calculates the new address using:\n```c\nnew_address = current_address + (1 * sizeof(*ptr));\n```\nFor an `int*`, adding 1 moves forward 4 bytes. For a `char*`, it moves 1 byte. For a `double*`, it moves 8 bytes. This guarantees that `*(ptr + i)` always targets element `i` correctly.",
        "codeSnippet": "int arr[3] = {10, 20, 30};\nint *p = arr;  // arr decays into pointer to arr[0]\n\nprintf(\"p[0] = %d\\n\", *p);       // 10\nprintf(\"p[1] = %d\\n\", *(p + 1)); // 20 (address + 4 bytes)\nprintf(\"p[2] = %d\\n\", p[2]);     // 30",
        "sandboxCode": "#include <stdio.h>\n\nint main() {\n    int nums[] = {100, 200, 300, 400};\n    int *p = nums;\n\n    printf(\"nums address: %p\\n\", (void*)nums);\n    printf(\"p + 1 address: %p (jumped %td bytes)\\n\", \n           (void*)(p + 1), (char*)(p + 1) - (char*)p);\n    printf(\"*(p + 2) value: %d\\n\", *(p + 2));\n    return 0;\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Array Indexing Equivalence",
        "prompt": "In C, which expression is completely identical to arr[i]?",
        "codeSnippet": "int arr[5] = {1, 2, 3, 4, 5};\nint i = 2;",
        "options": [
          {
            "text": "*(arr + i)",
            "isCorrect": true,
            "feedback": "🎯 Correct! Array subscripting arr[i] is defined in the ANSI C specification as *(arr + i)."
          },
          {
            "text": "&arr + i",
            "isCorrect": false,
            "feedback": "&arr yields a pointer to the entire array of 5 ints, which strides 20 bytes."
          },
          {
            "text": "*arr + i",
            "isCorrect": false,
            "feedback": "*arr dereferences the first element (1) and adds i, producing 3, not the element itself."
          },
          {
            "text": "arr->i",
            "isCorrect": false,
            "feedback": "The arrow operator is used exclusively for struct pointers, not array indexing."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Array Decay Losing sizeof() Information",
        "content": "Inside the scope where an array is declared, `sizeof(arr)` returns the total byte size of the array. But when passed to a function, the array **decays to a pointer**, and `sizeof(arr)` returns only 8 bytes (the pointer size)!",
        "codeSnippet": "// ❌ FATAL BUG in function:\nvoid print_len(int arr[]) {\n    // sizeof(arr) is 8 bytes (pointer size), NOT array length!\n    size_t count = sizeof(arr) / sizeof(arr[0]); // Returns 2!\n}\n\n// ✅ IDIOMATIC FIX: Always pass size explicitly:\nvoid print_len_safe(int *arr, size_t count) { ... }",
        "tip": "Hacker Rule: Always pass array length as a separate parameter to C functions.",
        "arenaTarget": "game.html?lang=c&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "c-les-003",
    "language": "c",
    "difficulty": "intermediate",
    "topic": "Dynamic Memory Allocation",
    "title": "Chapter 3: Dynamic Heap Memory Allocation, Free & Leaks",
    "tagline": "Master malloc, calloc, realloc, and avoid Use-After-Free and Double-Free CVEs.",
    "estimatedMinutes": 8,
    "objectives": [
      "Understand how the heap allocator manages variable-sized runtime memory",
      "Master malloc(), calloc(), realloc(), and free() signatures and return types",
      "Detect and prevent memory leaks and dangling pointer references",
      "Identify critical security vulnerabilities: Use-After-Free (UAF) and Double Free"
    ],
    "chapterSummary": "Stack memory is fixed, ultra-fast, and automatically reclaimed upon function return. However, stack frames are limited in size (typically 1MB–8MB) and cannot survive beyond their enclosing function's lifetime.\n\nWhen applications require dynamic structures whose sizes are known only at runtime (like network buffers, dynamic arrays, or graph nodes), they allocate memory from the **heap** using `malloc()`. Because C lacks automatic garbage collection, developers bear absolute responsibility for returning heap memory via `free()`.",
    "deepDive": {
      "title": "Heap Allocator Internals: brk & mmap",
      "content": "Standard C libraries implement malloc using operating system primitives: for small allocations, the allocator advances the heap break pointer via the `brk`/`sbrk` syscalls. For large allocations (>128KB), it maps anonymous memory pages directly using `mmap`.",
      "codeSnippet": "// Memory header precedes user data:\n// [Chunk Size | Flags][User Data Payload ... ]"
    },
    "takeaways": [
      "Always multiply element count by sizeof(T) when calling malloc().",
      "Always verify if (ptr == NULL) before dereferencing allocated memory.",
      "Every malloc/calloc call must have exactly one corresponding free() call.",
      "Assign ptr = NULL immediately after free() to prevent Use-After-Free exploits."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Heap Lifecycle: Allocate, Verify, Use, and Free",
        "content": "The dynamic memory lifecycle in C requires strict discipline:\n1. **Allocate**: `malloc(bytes)` returns a `void*` pointer to uninitialized heap bytes.\n2. **Verify**: Always check `if (ptr == NULL)` to handle out-of-memory failures.\n3. **Free**: Return memory via `free(ptr)` when finished.\n4. **Nullify**: Set `ptr = NULL` immediately to avoid dangling pointer references.",
        "codeSnippet": "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr = malloc(5 * sizeof(int));\n    if (arr == NULL) return 1; // Out of memory check!\n\n    for (int i = 0; i < 5; i++) arr[i] = i * 10;\n    printf(\"Item 3: %d\\n\", arr[3]);\n\n    free(arr);\n    arr = NULL; // Defend against dangling pointers!\n    return 0;\n}",
        "sandboxCode": "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    size_t count = 4;\n    // calloc zero-initializes memory:\n    int *nums = calloc(count, sizeof(int));\n    if (!nums) return 1;\n\n    for (size_t i = 0; i < count; i++) {\n        printf(\"nums[%zu] = %d (zeroed!)\\n\", i, nums[i]);\n    }\n\n    free(nums);\n    nums = NULL;\n    printf(\"Heap memory freed safely.\\n\");\n    return 0;\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "calloc vs malloc Difference",
        "prompt": "What is the critical behavioral distinction between malloc() and calloc()?",
        "codeSnippet": "int *a = malloc(10 * sizeof(int));\nint *b = calloc(10, sizeof(int));",
        "options": [
          {
            "text": "calloc zeroes out all allocated memory bytes; malloc leaves memory uninitialized (garbage bits)",
            "isCorrect": true,
            "feedback": "🎯 Correct! calloc guarantees zero-initialization, whereas malloc memory contains arbitrary lingering bits."
          },
          {
            "text": "malloc allocates on the stack; calloc allocates on the heap",
            "isCorrect": false,
            "feedback": "Both malloc and calloc allocate on the heap."
          },
          {
            "text": "calloc cannot be freed with free()",
            "isCorrect": false,
            "feedback": "Both must be freed with the standard free() function."
          },
          {
            "text": "malloc automatically reallocates when full",
            "isCorrect": false,
            "feedback": "Neither grows automatically; resizing requires realloc()."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Use-After-Free (UAF) Vulnerability",
        "content": "Calling `free(ptr)` informs the allocator that memory can be recycled, but `ptr` still holds the old address! Dereferencing `ptr` after freeing is a **Use-After-Free (UAF)**—the #1 source of remote code execution vulnerabilities in C applications.",
        "codeSnippet": "// ❌ CRITICAL SECURITY VULNERABILITY (UAF):\nfree(user_session);\n// ... later in code ...\nprintf(\"%s\", user_session->username); // Exploitable UAF!\n\n// ✅ DEFENSIVE FIX:\nfree(user_session);\nuser_session = NULL; // Attempting to use now segfaults safely",
        "tip": "Hacker Rule: Always assign ptr = NULL immediately after calling free(ptr).",
        "arenaTarget": "game.html?lang=c&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "c-les-004",
    "language": "c",
    "difficulty": "expert",
    "topic": "Memory Alignment & Struct Padding",
    "title": "Chapter 4: Hardware Alignment & Structure Padding",
    "tagline": "Understand CPU word boundaries, padding bytes, and optimize struct cache density.",
    "estimatedMinutes": 7,
    "objectives": [
      "Understand CPU word boundaries and why CPUs enforce natural alignment",
      "Calculate struct padding bytes injected by C compilers",
      "Reorder struct member variables to optimize memory density and cache lines",
      "Understand when to use __attribute__((packed)) and its performance penalties"
    ],
    "chapterSummary": "Modern 64-bit microprocessors do not read memory byte-by-byte. Instead, memory controllers fetch data from L1 cache and RAM in **word-sized chunks** (typically 4 or 8 bytes) along word-aligned memory boundaries.\n\nTo ensure single-cycle memory reads, the C compiler automatically inserts invisible **padding bytes** between struct fields. Without understanding alignment, naively ordered structs waste up to 50% of your memory footprint and degrade cache performance!",
    "deepDive": {
      "title": "CPU Cache Line Density (64-byte Lines)",
      "content": "Modern CPUs transfer data in 64-byte cache lines. A compact struct fits more instances per cache line, drastically reducing L1 cache misses and speeding up processing loops by 200–400%.",
      "codeSnippet": "// 64-byte cache line:\n// [Instance 1 (16B)][Instance 2 (16B)][Instance 3 (16B)][Instance 4 (16B)]"
    },
    "takeaways": [
      "CPUs read memory at word boundaries; unaligned reads incur latency penalties.",
      "Compilers insert invisible padding bytes to enforce natural alignment.",
      "Order struct fields by descending size (8-byte, 4-byte, 2-byte, 1-byte) to eliminate waste.",
      "Only use __attribute__((packed)) when mapping network wire packets or file headers."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Natural Alignment & Compiler Padding",
        "content": "A type of size `N` must typically reside at a memory address that is a multiple of `N`:\n- `char` (1 byte): Any address\n- `short` (2 bytes): Address divisible by 2\n- `int` (4 bytes): Address divisible by 4\n- `double` or pointers (8 bytes): Address divisible by 8\n\nThe compiler inserts padding bytes between fields to align each member to its natural boundary.",
        "codeSnippet": "struct Unoptimized {\n    char a;    // 1 byte\n    // 7 bytes of padding injected here!\n    double b;  // 8 bytes (must be aligned to 8-byte boundary)\n    char c;    // 1 byte\n    // 7 bytes of trailing padding!\n};\n// sizeof(struct Unoptimized) == 24 bytes! (14 bytes wasted)",
        "sandboxCode": "#include <stdio.h>\n\nstruct Wasteful {\n    char a;\n    double b;\n    char c;\n};\n\nstruct Optimized {\n    double b; // 8 bytes\n    char a;   // 1 byte\n    char c;   // 1 byte\n    // 6 bytes padding at end\n};\n\nint main() {\n    printf(\"Wasteful size: %zu bytes\\n\", sizeof(struct Wasteful));\n    printf(\"Optimized size: %zu bytes\\n\", sizeof(struct Optimized));\n    return 0;\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Struct Member Reordering",
        "prompt": "How can you reorder struct fields to minimize total memory footprint?",
        "codeSnippet": "struct Data {\n    char flag;\n    int count;\n    char status;\n};",
        "options": [
          {
            "text": "Sort members in descending order of size (largest first, e.g. int, then char, char)",
            "isCorrect": true,
            "feedback": "🎯 Spot on! Sorting by descending size groups smaller primitives together, minimizing inter-field padding."
          },
          {
            "text": "Sort members alphabetically by name",
            "isCorrect": false,
            "feedback": "Member names have zero impact on memory alignment."
          },
          {
            "text": "Place all chars at the beginning and end",
            "isCorrect": false,
            "feedback": "Splitting small types maximizes padding gaps between them."
          },
          {
            "text": "Struct order does not affect memory size",
            "isCorrect": false,
            "feedback": "Member order directly determines compiler padding injections."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "The Packed Struct Performance Trap",
        "content": "Developers sometimes use `__attribute__((packed))` to eliminate padding entirely. However, reading unaligned 8-byte integers causes the CPU to execute multiple memory bus reads or triggers hardware alignment faults on ARM architectures!",
        "codeSnippet": "// ❌ RISKY (Unaligned memory penalty on ARM):\nstruct __attribute__((packed)) Packet {\n    char id;\n    int length; // Resides at offset 1! Unaligned read.\n};",
        "tip": "Hacker Rule: Use packed structs only for hardware registers or network wire protocols, never for general data structures.",
        "arenaTarget": "game.html?lang=c&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "c-les-005",
    "language": "c",
    "difficulty": "expert",
    "topic": "Sequence Points & Undefined Behavior",
    "title": "Chapter 5: Sequence Points & Undefined Behavior (UB)",
    "tagline": "Understand how compiler optimizations exploit Undefined Behavior to delete your checks.",
    "estimatedMinutes": 8,
    "objectives": [
      "Define Undefined Behavior (UB), Unspecified Behavior, and Implementation-Defined Behavior",
      "Understand sequence points and the order-of-evaluation rules in C",
      "Understand signed integer overflow UB and how optimizing compilers delete security checks",
      "Write defensive, standards-compliant C that survives aggressive -O3 compiler passes"
    ],
    "chapterSummary": "In the C standard, **Undefined Behavior (UB)** gives the compiler license to do anything it desires. Unlike Java or Python, which define strict exception behaviors for null dereferences or array out-of-bounds, the C standard states that when UB occurs, \"the standard imposes no requirements.\"\n\nModern optimizing compilers (GCC, Clang) assume that UB **never happens** in valid code. If your code relies on UB, the optimizer will perform aggressive dead-code elimination, silently stripping away your critical security checks!",
    "deepDive": {
      "title": "UB Sanitizers: UBSan & ASan",
      "content": "Modern compiler toolchains provide runtime instrumentation flags to trap UB during testing:\n- `-fsanitize=undefined` (UBSan): Catches integer overflow, misaligned pointers, null dereferences.\n- `-fsanitize=address` (ASan): Catches out-of-bounds heap/stack accesses and Use-After-Free.",
      "codeSnippet": "gcc -O2 -fsanitize=address,undefined -g test.c -o test"
    },
    "takeaways": [
      "Undefined Behavior means the compiler assumes that condition is impossible.",
      "Modifying a variable twice between sequence points (e.g. i = i++) is UB.",
      "Signed integer overflow is UB; unsigned integer overflow is defined wrap-around.",
      "Always test with -fsanitize=address,undefined to detect invisible UB bugs."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Sequence Points & Order of Evaluation",
        "content": "Between two sequence points, an object's stored value can be modified **at most once** by an expression. Modifying a variable twice without an intervening sequence point—such as `i = i++` or `f(i++, i++)`—is strictly Undefined Behavior!\n\nSequence points occur at:\n- Semicolons `;`\n- The comma operator `,`\n- Short-circuit boolean operators `&&` and `||`\n- The ternary operator `?:`",
        "codeSnippet": "#include <stdio.h>\n\nint main() {\n    int i = 5;\n    // ❌ UNDEFINED BEHAVIOR:\n    // i = i++ + ++i; // Modifying i multiple times!\n\n    // ✅ DEFINED & DETERMINISTIC:\n    i++;\n    int result = i + 1;\n    printf(\"Result: %d\\n\", result);\n    return 0;\n}",
        "sandboxCode": "#include <stdio.h>\n\nint main() {\n    int x = 10;\n    // Sequential statements have guaranteed sequence points:\n    x += 5;\n    x *= 2;\n    printf(\"Deterministic result: %d\\n\", x);\n    return 0;\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Signed Integer Overflow Check Elimination",
        "prompt": "Why does GCC at -O3 optimize away the overflow check `if (v + 100 < v)`?",
        "codeSnippet": "void check_bounds(int v) {\n    if (v + 100 < v) { // Naive overflow check!\n        abort();       // Deleted by optimizer!\n    }\n}",
        "options": [
          {
            "text": "Because signed integer overflow is UB in C, the compiler assumes v + 100 > v is mathematically always true and deletes the branch",
            "isCorrect": true,
            "feedback": "🎯 Exactly! In C, signed overflow is UB. The optimizer assumes overflow never occurs, rendering the check dead code."
          },
          {
            "text": "Because 100 is too small to overflow an int",
            "isCorrect": false,
            "feedback": "v could be INT_MAX, but the standard classifies signed overflow as UB."
          },
          {
            "text": "Because the compiler converts signed ints to unsigned automatically",
            "isCorrect": false,
            "feedback": "No automatic signed-to-unsigned conversion occurs here."
          },
          {
            "text": "Because abort() is an invalid function",
            "isCorrect": false,
            "feedback": "abort() is standard, but the entire if-statement is eliminated."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Dereference Before Null Check",
        "content": "If you dereference a pointer before checking if it is NULL, the compiler deduces that the pointer **cannot possibly be NULL** (since dereferencing NULL is UB). The optimizer then deletes your subsequent `if (ptr == NULL)` check!",
        "codeSnippet": "// ❌ SECURITY CHECK SILENTLY DELETED BY CLANG/GCC:\nvoid process(int *ptr) {\n    int val = *ptr;  // Dereferenced here!\n    if (ptr == NULL) { // Compiler eliminates this check!\n        return;\n    }\n}",
        "tip": "Hacker Rule: Always perform null checks BEFORE any dereference; never rely on compiler mercy.",
        "arenaTarget": "game.html?lang=c&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "cpp-les-001",
    "language": "cpp",
    "difficulty": "beginner",
    "topic": "References & Const Correctness",
    "title": "Chapter 1: Reference Semantics & Const Correctness",
    "tagline": "Eliminate expensive copies and prevent unintended mutations using const references.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand references as non-nullable aliases to existing lvalues",
      "Master const references (const T&) to pass large objects with zero copy overhead",
      "Distinguish between const pointers, pointers to const, and const member methods",
      "Understand mutable members and logical vs physical const correctness"
    ],
    "chapterSummary": "In C, passing large structs to functions forces developers to choose between expensive pass-by-value copies or nullable raw pointers requiring manual address operators (&). C++ introduced **references** (`T&`): safe, non-null syntactic aliases directly bound to existing variables.\n\nBy combining references with `const` (`const std::string&`), C++ enables high-performance systems engineering: functions receive direct memory access with zero copying, while the compiler enforces strict read-only guarantees.",
    "deepDive": {
      "title": "Logical Constness & The mutable Keyword",
      "content": "A `const` member function cannot modify object state. However, thread mutexes or cached calculation values sometimes need to change during a read. Marking fields `mutable` permits mutation inside const methods without violating physical constness.",
      "codeSnippet": "class Cache {\n    mutable int access_count = 0;\npublic:\n    int read() const {\n        access_count++; // Valid because access_count is mutable\n        return 42;\n    }\n};"
    },
    "takeaways": [
      "Pass non-primitive types by const T& to eliminate copy overhead.",
      "References cannot be null and cannot be reseated after initialization.",
      "Never return a reference to a local variable; return by value instead.",
      "Use the mutable keyword for thread locks and cache fields inside const methods."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "References vs Pointers & The Power of const T&",
        "content": "A reference is initialized once upon declaration and cannot be reseated to another object. Passing parameters by `const T&` guarantees:\n1. **Zero Copy**: No heap allocations or copy constructors are invoked.\n2. **Immutable Guarantee**: The compiler rejects any attempt to mutate the argument.\n3. **Binding to Temporaries**: Unlike non-const references, a `const T&` can bind directly to temporary rvalues!",
        "codeSnippet": "#include <iostream>\n#include <string>\n\n// Passes 1MB string with zero copy overhead:\nvoid print_data(const std::string& text) {\n    // text += \"!\"; // Compiler error: read-only!\n    std::cout << text << std::endl;\n}\n\nint main() {\n    std::string msg = \"Hello Modern C++\";\n    print_data(msg);\n    return 0;\n}",
        "sandboxCode": "#include <iostream>\n#include <string>\n\nvoid mutate_val(int& ref) { ref *= 2; }\nvoid read_val(const int& ref) { std::cout << \"Value: \" << ref << std::endl; }\n\nint main() {\n    int score = 50;\n    mutate_val(score);\n    read_val(score);\n    return 0;\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Const Reference Binding Check",
        "prompt": "Why does `void func(int& x)` fail to compile when called with `func(100)`, whereas `void func(const int& x)` succeeds?",
        "codeSnippet": "void pass_ref(int& x);\nvoid pass_const(const int& x);\n\n// pass_ref(100);   // Compiler Error!\npass_const(100); // Compiles cleanly!",
        "options": [
          {
            "text": "100 is an rvalue (temporary); non-const lvalue references cannot bind to rvalues, but const references can extend their lifetime",
            "isCorrect": true,
            "feedback": "🎯 Spot on! C++ guarantees that const lvalue references can bind to temporary rvalues, keeping them alive during the function call."
          },
          {
            "text": "100 is too large to fit in an int reference",
            "isCorrect": false,
            "feedback": "100 is a standard int literal."
          },
          {
            "text": "int& requires dynamic heap allocation",
            "isCorrect": false,
            "feedback": "References are aliases, requiring no heap allocation."
          },
          {
            "text": "const converts integers into floating-point numbers",
            "isCorrect": false,
            "feedback": "const specifies immutability, not type conversion."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Dangling Reference to Local Stack Variable",
        "content": "Returning a reference to a local stack variable produces a **dangling reference**. The local variable is destroyed when the function returns, leaving the caller with an invalid reference into overwritten stack memory.",
        "codeSnippet": "// ❌ FATAL BUG (Dangling Reference):\nconst std::string& get_greeting() {\n    std::string s = \"Hello\";\n    return s; // Destructor called here! Returns dangling ref!\n}\n\n// ✅ IDIOMATIC FIX (Return by value; RVO handles move):\nstd::string get_greeting_safe() {\n    return \"Hello\"; // Return Value Optimization (RVO)\n}",
        "tip": "Hacker Rule: Never return references to local variables; trust Return Value Optimization (RVO).",
        "arenaTarget": "game.html?lang=cpp&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "cpp-les-002",
    "language": "cpp",
    "difficulty": "intermediate",
    "topic": "RAII & Smart Pointers",
    "title": "Chapter 2: Resource Acquisition Is Initialization (RAII) & Smart Pointers",
    "tagline": "Master deterministic destruction and eliminate memory leaks with unique_ptr and shared_ptr.",
    "estimatedMinutes": 8,
    "objectives": [
      "Master the core C++ architectural philosophy: RAII (Resource Acquisition Is Initialization)",
      "Understand deterministic stack unwinding and exception safety guarantees",
      "Use std::unique_ptr for zero-overhead, exclusive resource ownership",
      "Use std::shared_ptr and std::weak_ptr to manage shared ownership without cyclic memory leaks"
    ],
    "chapterSummary": "In garbage-collected environments, developers have no control over when memory is reclaimed, and non-memory resources (sockets, database handles, file descriptors) require awkward try-finally or with-blocks.\n\nC++ solves resource management fundamentally via **RAII**: tie resource lifecycle to the lifespan of a stack object. When a stack object goes out of scope—whether by normal return or an unhandled exception—its **destructor runs deterministically**. Smart pointers (`std::unique_ptr`, `std::shared_ptr`) leverage RAII to make manual `new` and `delete` completely obsolete.",
    "deepDive": {
      "title": "std::make_shared Single Allocation Optimization",
      "content": "Calling `std::shared_ptr<T>(new T)` requires TWO heap allocations: one for `T` and one for the internal control block (refcount + weakcount). `std::make_shared<T>()` combines both into a **single contiguous heap allocation**, saving memory and improving cache locality.",
      "codeSnippet": "auto sp = std::make_shared<int>(42); // Single contiguous allocation"
    },
    "takeaways": [
      "RAII ties resource lifetimes to stack scope destructors.",
      "std::unique_ptr has zero overhead and represents exclusive ownership.",
      "Never use raw new/delete; use std::make_unique and std::make_shared.",
      "Use std::weak_ptr to observe shared_ptrs without preventing deallocation."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "RAII & Exclusive Ownership with std::unique_ptr",
        "content": "`std::unique_ptr<T>` represents exclusive, single ownership of a heap resource:\n- It cannot be copied (its copy constructor is deleted `= delete`).\n- It can only be **moved** (`std::move`), transferring ownership.\n- When the `unique_ptr` goes out of scope, its destructor automatically calls `delete` on the managed pointer with **zero runtime overhead** compared to raw pointers!",
        "codeSnippet": "#include <iostream>\n#include <memory>\n\nclass Resource {\npublic:\n    Resource() { std::cout << \"Resource Acquired\\n\"; }\n    ~Resource() { std::cout << \"Resource Destroyed!\\n\"; }\n    void work() { std::cout << \"Working...\\n\"; }\n};\n\nint main() {\n    {\n        // Allocated and managed automatically:\n        auto ptr = std::make_unique<Resource>();\n        ptr->work();\n    } // Out of scope: ~Resource() executes immediately!\n    std::cout << \"Done\\n\";\n    return 0;\n}",
        "sandboxCode": "#include <iostream>\n#include <memory>\n\nint main() {\n    auto u1 = std::make_unique<int>(1337);\n    std::cout << \"u1 value: \" << *u1 << std::endl;\n\n    // Transfer ownership via move:\n    std::unique_ptr<int> u2 = std::move(u1);\n    std::cout << \"u2 value: \" << *u2 << std::endl;\n    std::cout << \"u1 is now null? \" << (u1 == nullptr ? \"YES\" : \"NO\") << std::endl;\n    return 0;\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Circular Reference Memory Leak in shared_ptr",
        "prompt": "What problem occurs when two objects hold std::shared_ptr references to each other?",
        "codeSnippet": "struct B;\nstruct A { std::shared_ptr<B> b_ptr; };\nstruct B { std::shared_ptr<A> a_ptr; };",
        "options": [
          {
            "text": "A circular dependency cycle: neither reference count can ever reach zero, causing a permanent memory leak",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Because both shared_ptrs retain each other, reference counts never drop to 0. Use std::weak_ptr to break the cycle."
          },
          {
            "text": "A compile-time type recursion error",
            "isCorrect": false,
            "feedback": "This compiles without error, but leaks memory at runtime."
          },
          {
            "text": "A double-free runtime abort",
            "isCorrect": false,
            "feedback": "The memory is never freed, so double free cannot occur."
          },
          {
            "text": "The C++ runtime automatically detects and breaks the cycle",
            "isCorrect": false,
            "feedback": "C++ has no tracing garbage collector; cycles are not broken automatically."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Raw new/delete in Modern C++",
        "content": "Writing raw `new` and `delete` in modern C++ is considered an anti-pattern. If an exception is thrown between `new` and `delete`, the delete statement is bypassed, leaking memory. Always use `std::make_unique` or `std::make_shared`.",
        "codeSnippet": "// ❌ DANGEROUS & OBSOLETE:\nWidget* w = new Widget();\nrisky_operation(); // If this throws, memory leaks!\ndelete w;\n\n// ✅ MODERN RAII IDIOM:\nauto w = std::make_unique<Widget>(); // Exception-safe!",
        "tip": "Hacker Rule: Use std::make_unique; you should never see raw \"new\" or \"delete\" in modern C++ codebases.",
        "arenaTarget": "game.html?lang=cpp&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "cpp-les-003",
    "language": "cpp",
    "difficulty": "intermediate",
    "topic": "Virtual Tables & Polymorphism",
    "title": "Chapter 3: Virtual Method Tables & Dynamic Dispatch",
    "tagline": "Understand how vtables, vptrs, and virtual destructors power C++ runtime polymorphism.",
    "estimatedMinutes": 8,
    "objectives": [
      "Understand how the compiler implements runtime polymorphism using virtual tables (vtables)",
      "Trace the vptr pointer stored inside polymorphic object instances",
      "Understand why base classes with virtual methods MUST have a virtual destructor",
      "Identify object slicing when passing derived classes by value"
    ],
    "chapterSummary": "In C++, member function calls are bound statically at compile time by default (`direct call`). This delivers maximum raw speed with zero indirection overhead. However, when building extensible object hierarchies, applications require **runtime polymorphism**: invoking the correct derived method implementation through a base pointer.\n\nTo achieve this without degrading non-polymorphic classes, C++ introduces the `virtual` keyword, implemented under the hood via **Virtual Method Tables (vtables)**.",
    "deepDive": {
      "title": "Inspecting Object Size with vptr",
      "content": "An empty class has `sizeof == 1` in C++. Adding a single virtual method increases its size to **8 bytes** on 64-bit systems because of the injected hidden `vptr` pointer!",
      "codeSnippet": "class Empty { };\nclass VirtualEmpty { virtual void f(); };\n// sizeof(Empty) == 1\n// sizeof(VirtualEmpty) == 8 (holds 64-bit vptr)"
    },
    "takeaways": [
      "Classes with virtual functions contain a hidden 8-byte vptr pointing to a vtable.",
      "Always give base classes with virtual methods a virtual destructor (~Base() = default).",
      "Pass polymorphic objects by reference (const Base&) to prevent object slicing.",
      "Use the override keyword to let the compiler catch spelling and signature mismatches."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Virtual Method Table (vtable) & vptr",
        "content": "When a class declares any `virtual` method, the compiler modifies its memory layout:\n1. It generates a static array of function pointers called the **vtable**.\n2. It injects a hidden pointer (`vptr`) at the start of every object instance, pointing to that class's vtable.\n\nWhen you call `base_ptr->speak()`, the CPU reads `base_ptr->vptr`, indexes into the table, and jumps to the derived implementation!",
        "codeSnippet": "#include <iostream>\n\nclass Animal {\npublic:\n    virtual void speak() { std::cout << \"Generic Sound\\n\"; }\n    virtual ~Animal() = default; // Essential virtual destructor!\n};\n\nclass Dog : public Animal {\npublic:\n    void speak() override { std::cout << \"Woof!\\n\"; }\n};\n\nint main() {\n    Animal* a = new Dog();\n    a->speak(); // Dispatches through vtable -> prints \"Woof!\"\n    delete a;\n    return 0;\n}",
        "sandboxCode": "#include <iostream>\n\nclass Base {\npublic:\n    virtual void id() { std::cout << \"Base Class\" << std::endl; }\n    virtual ~Base() = default;\n};\n\nclass Derived : public Base {\npublic:\n    void id() override { std::cout << \"Derived Class\" << std::endl; }\n};\n\nint main() {\n    Derived d;\n    Base* b = &d;\n    b->id(); // Calls Derived::id() via vtable\n    return 0;\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Non-Virtual Destructor Memory Leak",
        "prompt": "What happens when you delete a derived class object through a Base pointer if Base lacks a virtual destructor?",
        "codeSnippet": "class Base { public: ~Base() {} }; // Non-virtual!\nclass Derived : public Base {\n    int* data = new int[100];\npublic:\n    ~Derived() { delete[] data; }\n};\n\nBase* b = new Derived();\ndelete b;",
        "options": [
          {
            "text": "Undefined Behavior: only ~Base() runs; ~Derived() is bypassed, leaking the dynamic array data",
            "isCorrect": true,
            "feedback": "🎯 Correct! Without a virtual destructor, the compiler uses static dispatch, calling only Base::~Base() and skipping derived cleanup."
          },
          {
            "text": "Both destructors run normally in reverse order",
            "isCorrect": false,
            "feedback": "Dynamic dispatch only occurs if the destructor is explicitly declared virtual."
          },
          {
            "text": "A compile-time error occurs on delete b",
            "isCorrect": false,
            "feedback": "It compiles without warnings, leading to silent production memory leaks."
          },
          {
            "text": "The derived object is converted into a base object",
            "isCorrect": false,
            "feedback": "No conversion occurs; destruction is simply incomplete."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Object Slicing Trap",
        "content": "Passing a derived object **by value** to a function expecting a Base object causes **object slicing**. The derived portion is sliced off, and the vptr is reassigned to Base, completely disabling polymorphism!",
        "codeSnippet": "// ❌ SLICED (Destroys polymorphism):\nvoid bad_print(Animal a) { a.speak(); } // Slices Dog into Animal!\n\n// ✅ PRESERVED (Polymorphic by reference):\nvoid good_print(const Animal& a) { a.speak(); }",
        "tip": "Hacker Rule: Always pass polymorphic objects by reference or pointer (const Base&), never by value.",
        "arenaTarget": "game.html?lang=cpp&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "cpp-les-004",
    "language": "cpp",
    "difficulty": "expert",
    "topic": "Move Semantics & Rvalue References",
    "title": "Chapter 4: Move Semantics, Rvalue References & Perfect Forwarding",
    "tagline": "Steal heap allocations from temporaries using rvalue references and eliminate redundant deep copies.",
    "estimatedMinutes": 8,
    "objectives": [
      "Differentiate between lvalues (named persistent values) and rvalues (temporary values)",
      "Understand rvalue references (T&&) and move constructors",
      "Use std::move to cast lvalues to rvalues to trigger resource pilfering",
      "Master the Rule of 5: Destructor, Copy/Move Constructor, Copy/Move Assignment"
    ],
    "chapterSummary": "Prior to C++11, returning a vector of 1,000,000 integers from a function forced the runtime to perform an expensive deep copy: allocate 4MB of heap memory, copy each integer, and immediately destroy the original temporary vector. This made returning large containers notoriously inefficient.\n\nC++11 revolutionized systems programming with **Move Semantics**. Instead of copying, we can **steal** the internal heap pointer from temporary objects with zero allocation cost!",
    "deepDive": {
      "title": "Perfect Forwarding with std::forward<T>",
      "content": "When writing generic wrapper templates (like `std::make_unique` or factories), we must preserve whether arguments were passed as lvalues or rvalues. Universal references (`T&&` in template context) combined with `std::forward<T>` achieve **perfect forwarding**.",
      "codeSnippet": "template<typename T, typename Arg>\nstd::unique_ptr<T> factory(Arg&& arg) {\n    return std::unique_ptr<T>(new T(std::forward<Arg>(arg)));\n}"
    },
    "takeaways": [
      "Move semantics steal resources from temporary rvalues with zero allocation overhead.",
      "std::move does not move data; it is an unconditional cast to an rvalue reference (T&&).",
      "The Rule of 5: If you define a destructor, define copy/move constructors and assignments.",
      "Never read from an object after passing it to std::move."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Lvalues vs Rvalues & The Move Constructor",
        "content": "Understanding value categories:\n- **Lvalue**: An object with a named identity and persistent memory address (e.g. `int x`, `my_str`).\n- **Rvalue**: A temporary object about to be destroyed (e.g. `100`, `str1 + str2`, `func_returning_val()`).\n\nA move constructor accepts an rvalue reference (`T&&`), copies the pointer, and sets the source pointer to `nullptr`!",
        "codeSnippet": "#include <iostream>\n#include <vector>\n\nclass Buffer {\n    int* data;\n    size_t size;\npublic:\n    // Move Constructor: Steals resources!\n    Buffer(Buffer&& other) noexcept \n        : data(other.data), size(other.size) {\n        other.data = nullptr; // Pilfered!\n        other.size = 0;\n    }\n};",
        "sandboxCode": "#include <iostream>\n#include <vector>\n#include <string>\n\nint main() {\n    std::vector<std::string> v;\n    std::string heavy = \"Extremely Large String Payload In Heap\";\n\n    // std::move casts heavy to an rvalue reference:\n    v.push_back(std::move(heavy));\n\n    std::cout << \"Vector element: \" << v[0] << std::endl;\n    std::cout << \"Original heavy is now empty: '\" << heavy << \"'\" << std::endl;\n    return 0;\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "What Does std::move Actually Do?",
        "prompt": "What machine code or physical operation is executed by std::move(x)?",
        "codeSnippet": "std::string a = \"data\";\nstd::string b = std::move(a);",
        "options": [
          {
            "text": "It generates zero machine code; it is purely a compile-time cast converting an lvalue into an rvalue reference (static_cast<T&&>)",
            "isCorrect": true,
            "feedback": "🎯 Exactly! std::move does not move anything at runtime; it merely casts the expression so the compiler selects the move constructor."
          },
          {
            "text": "It copies memory bytes directly across stack registers",
            "isCorrect": false,
            "feedback": "The actual move is performed by the destination object move constructor, not std::move."
          },
          {
            "text": "It deletes variable a immediately",
            "isCorrect": false,
            "feedback": "Variable a remains in a valid but unspecified state until its scope ends."
          },
          {
            "text": "It allocates an asynchronous worker thread",
            "isCorrect": false,
            "feedback": "Move semantics have zero threading or runtime overhead."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Using Objects After Moving",
        "content": "After calling `std::move(obj)`, the object remains alive but in a **valid but unspecified state**. Reading its fields, printing it, or relying on its previous contents leads to undefined application logic.",
        "codeSnippet": "// ❌ DEFECT: Using moved-from object:\nstd::string name = \"Administrator\";\nuser_record.set_name(std::move(name));\nlog_audit(name); // name is now empty! Log corrupted.",
        "tip": "Hacker Rule: Treat moved-from variables as dead; never read their state after std::move.",
        "arenaTarget": "game.html?lang=cpp&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "cpp-les-005",
    "language": "cpp",
    "difficulty": "expert",
    "topic": "C++20 Concepts & Constexpr",
    "title": "Chapter 5: C++20 Concepts, Type Constraints & Constexpr",
    "tagline": "Replace obtuse SFINAE template errors with readable compile-time concepts and constexpr math.",
    "estimatedMinutes": 8,
    "objectives": [
      "Understand compile-time computation with constexpr and consteval",
      "Contrast legacy template SFINAE errors with modern C++20 Concepts",
      "Define custom concepts using requires clauses and type traits",
      "Enforce compile-time API contracts that fail with clear, human-readable diagnostics"
    ],
    "chapterSummary": "For decades, C++ templates were notorious for two issues: slow compile times and incomprehensible, 500-line error messages triggered by SFINAE (Substitution Failure Is Not An Error) failures when passing incompatible types.\n\nC++20 revolutionized generic programming by introducing **Concepts**: first-class compile-time predicates that constrain template parameters. Combined with `constexpr` and `consteval`, C++20 shifts heavy computational work from runtime execution directly into the compiler.",
    "deepDive": {
      "title": "Defining Custom Compound Concepts",
      "content": "You can construct custom concepts combining type traits and nested requires expressions verifying return types.",
      "codeSnippet": "template<typename T>\nconcept Hashable = requires(T a) {\n    { std::hash<T>{}(a) } -> std::convertible_to<std::size_t>;\n};"
    },
    "takeaways": [
      "C++20 Concepts replace ugly SFINAE hacks with readable compiler constraints.",
      "Templates constrained with concepts fail fast with clear, human-readable errors.",
      "constexpr functions can evaluate at compile time or runtime.",
      "consteval guarantees compile-time evaluation or terminates compilation."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Constraining Templates with C++20 Concepts",
        "content": "A **Concept** is a named set of compile-time requirements evaluated when a template is instantiated. Instead of accepting `typename T` and failing deep inside the implementation, you constrain parameters with concepts like `std::integral` or custom concepts.\n\nIf an incompatible type is supplied, the compiler immediately rejects the call with a concise, one-line diagnostic!",
        "codeSnippet": "#include <iostream>\n#include <concepts>\n\n// Constrained template: accepts ONLY numeric integral types!\ntemplate <std::integral T>\nT add(T a, T b) {\n    return a + b;\n}\n\nint main() {\n    std::cout << add(10, 20) << \"\\n\"; // Compiles cleanly\n    // add(3.14, 2.5); // Compiler error: double does not satisfy std::integral!\n    return 0;\n}",
        "sandboxCode": "#include <iostream>\n#include <concepts>\n\ntemplate<typename T>\nconcept Printable = requires(T x) {\n    { std::cout << x } -> std::same_as<std::ostream&>;\n};\n\nvoid show(Printable auto item) {\n    std::cout << \"Item: \" << item << std::endl;\n}\n\nint main() {\n    show(42);\n    show(\"Concepts in action!\");\n    return 0;\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "constexpr vs consteval Difference",
        "prompt": "What is the distinction between a constexpr function and a C++20 consteval function?",
        "codeSnippet": "constexpr int calc1(int x) { return x * 2; }\nconsteval int calc2(int x) { return x * 2; }",
        "options": [
          {
            "text": "calc1 can execute at either compile time or runtime; calc2 MUST execute exclusively at compile time or fail compilation",
            "isCorrect": true,
            "feedback": "🎯 Correct! consteval specifies an immediate function: any attempt to evaluate it at runtime triggers a compile error."
          },
          {
            "text": "consteval functions can only return void",
            "isCorrect": false,
            "feedback": "consteval functions return standard types."
          },
          {
            "text": "constexpr allocates on the heap; consteval on the stack",
            "isCorrect": false,
            "feedback": "Neither allocates runtime memory; both compute at compile time."
          },
          {
            "text": "There is zero difference; consteval is an alias",
            "isCorrect": false,
            "feedback": "They have distinct compiler enforcement guarantees."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Accidental Runtime Fallback in constexpr",
        "content": "If you pass a runtime variable to a `constexpr` function without storing the result in a `constexpr` variable, the compiler silently falls back to standard runtime execution, losing all performance benefits.",
        "codeSnippet": "// ❌ SILENT RUNTIME FALLBACK:\nint val = get_input();\nint res = constexpr_fib(val); // Runs at runtime!\n\n// ✅ GUARANTEED COMPILE-TIME EVALUATION:\nconstexpr int res2 = constexpr_fib(10); // Forced compile-time!",
        "tip": "Hacker Rule: Use consteval when an algorithm must never execute at runtime.",
        "arenaTarget": "game.html?lang=cpp&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "java-les-001",
    "language": "java",
    "difficulty": "beginner",
    "topic": "Value vs Reference Types",
    "title": "Chapter 1: Memory Primitives vs Object References",
    "tagline": "Master the JVM stack vs heap divide, autoboxing performance traps, and reference semantics.",
    "estimatedMinutes": 6,
    "objectives": [
      "Differentiate between 8 primitive types stored on the stack vs heap object references",
      "Understand JVM object layout (Mark Word + Klass Word header)",
      "Identify hidden memory allocations and GC churn caused by implicit autoboxing",
      "Understand Java strictly pass-by-value semantics for both primitives and object references"
    ],
    "chapterSummary": "The Java Virtual Machine (JVM) divides its runtime data area into two primary memory regions: the thread-private **Call Stack** and the shared **Heap**.\n\nJava enforces a strict architectural divide: the 8 primitive types (`byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`) store raw binary values directly on the stack frame. In contrast, all instances of classes, interfaces, and arrays are allocated on the heap, and variables hold only **reference pointers** to them.",
    "deepDive": {
      "title": "64-bit JVM Compressed OOPs (Ordinary Object Pointers)",
      "content": "On 64-bit JVMs with heaps under 32GB, the JVM enables `-XX:+UseCompressedOops`. It encodes 64-bit object pointers into 32-bit integers by shifting them 3 bits (8-byte alignment), saving 40% memory bandwidth.",
      "codeSnippet": "// Object Header:\n// [Mark Word (8 bytes)][Klass Word (4 bytes compressed)][Payload ...]"
    },
    "takeaways": [
      "Primitives store bits on the stack; objects reside on the heap.",
      "Java is strictly pass-by-value; object references are copied as values.",
      "Avoid wrapper objects (Integer, Long) in performance loops to prevent autoboxing churn.",
      "Always compare object equality with .equals(), never ==."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Stack Primitives vs Heap Object References",
        "content": "When you declare `int x = 42;`, the 32 bits are stored directly in your local stack frame. When you declare `Integer y = 42;`, Java allocates a complete `java.lang.Integer` object on the heap (16 bytes of overhead for header + 4 bytes for value), and `y` holds only a 32-bit or 64-bit reference address!\n\nAll arguments in Java are passed **strictly by value**. When passing an object reference, Java copies the reference pointer, not the underlying object data.",
        "codeSnippet": "public class MemoryDemo {\n    public static void main(String[] args) {\n        int a = 10;\n        int b = a; // Bit copy!\n        b = 99;\n        System.out.println(\"a remains: \" + a); // 10\n\n        int[] arr1 = {1, 2, 3};\n        int[] arr2 = arr1; // Copies reference pointer!\n        arr2[0] = 999;\n        System.out.println(\"arr1[0] is: \" + arr1[0]); // 999!\n    }\n}",
        "sandboxCode": "public class Test {\n    public static void main(String[] args) {\n        Integer a = 100;\n        Integer b = 100;\n        System.out.println(\"a == b (cached -128..127): \" + (a == b));\n\n        Integer x = 500;\n        Integer y = 500;\n        System.out.println(\"x == y (outside cache): \" + (x == y));\n        System.out.println(\"x.equals(y): \" + x.equals(y));\n    }\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Autoboxing Micro-Benchmark Trap",
        "prompt": "What performance defect occurs in `Long sum = 0L; for (long i = 0; i < 1_000_000; i++) sum += i;`?",
        "codeSnippet": "Long sum = 0L; // Capitalized wrapper Long!\nfor (long i = 0; i < 1_000_000; i++) {\n    sum += i; // Implicit autoboxing on every iteration!\n}",
        "options": [
          {
            "text": "It constructs and discards 1,000,000 temporary Long heap objects, causing severe GC churn and running 10x slower",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Because sum is an object wrapper Long, sum += i unboxes sum, performs addition, and boxes a brand new Long object on each loop cycle."
          },
          {
            "text": "It causes an integer overflow exception",
            "isCorrect": false,
            "feedback": "long has sufficient capacity; the defect is object churn."
          },
          {
            "text": "A NullPointerException is thrown",
            "isCorrect": false,
            "feedback": "sum is initialized to 0L, so NPE does not occur."
          },
          {
            "text": "The compiler optimizes it to a primitive int",
            "isCorrect": false,
            "feedback": "Java compilers never implicitly alter declared variable types."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Integer Cache == Gotcha",
        "content": "Java caches `Integer` objects in the range `-128` to `127`. Within this range, `==` returns true because references share the same cached object. Outside this range, `==` compares distinct heap addresses and returns false! Always use `.equals()`.",
        "codeSnippet": "// ❌ DANGEROUS BUG:\nInteger a = 127, b = 127;\nSystem.out.println(a == b); // true (cached)\n\nInteger x = 128, y = 128;\nSystem.out.println(x == y); // FALSE! (distinct heap addresses)\n\n// ✅ IDIOMATIC FIX:\nSystem.out.println(x.equals(y)); // true",
        "tip": "Hacker Rule: Never compare wrapper objects (Integer, Long, String) using ==; always invoke .equals().",
        "arenaTarget": "game.html?lang=java&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "java-les-002",
    "language": "java",
    "difficulty": "beginner",
    "topic": "String Constant Pool",
    "title": "Chapter 2: The String Constant Pool & Immutability",
    "tagline": "Understand String interning, memory deduplication, and the security of immutability.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand why String was designed immutable in Java (Security, Caching, Thread-Safety)",
      "Master the String Constant Pool in JVM Metaspace/Heap memory",
      "Understand the difference between string literals and new String() allocations",
      "Optimize string concatenation using StringBuilder in loops"
    ],
    "chapterSummary": "In Java, `java.lang.String` is the most widely used class. To optimize memory consumption across millions of duplicate strings (URLs, JSON keys, column names), the JVM maintains a special cache called the **String Constant Pool**.\n\nStrings in Java are strictly **immutable**: once created, their internal byte array cannot be modified. This immutability is fundamental to JVM security (class loading), hash table performance (caching `hashCode()`), and thread safety without locking.",
    "deepDive": {
      "title": "Java 9+ Compact Strings (Latin-1 vs UTF-16)",
      "content": "Historically, Java stored characters in 16-bit `char[]` arrays (2 bytes per character). Analysis revealed that over 75% of string content consists of Latin-1 ASCII characters. Java 9 introduced **Compact Strings**: strings using Latin-1 are stored in 1-byte `byte[]` arrays, cutting JVM string memory usage in half!",
      "codeSnippet": "// String.java internal:\n// final byte[] value;\n// final byte coder; // 0 for Latin-1, 1 for UTF-16"
    },
    "takeaways": [
      "Strings are immutable; any modification creates a new String object.",
      "String literals share identical instances in the String Constant Pool.",
      "Always use StringBuilder (or StringBuffer for thread safety) when assembling text in loops.",
      "Never allocate strings with new String(\"text\"); use string literals directly."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "String Literals vs new String() in the Constant Pool",
        "content": "When you create a string literal `String s1 = \"hello\";`, the JVM checks the String Constant Pool:\n- If `\"hello\"` exists, `s1` points to the pooled instance.\n- If not, it allocates one in the pool.\n\nCalling `new String(\"hello\")` forces the creation of a **brand new heap object** outside the pool, bypassing deduplication!",
        "codeSnippet": "public class StringDemo {\n    public static void main(String[] args) {\n        String s1 = \"cyber\";\n        String s2 = \"cyber\";\n        String s3 = new String(\"cyber\");\n\n        System.out.println(s1 == s2);      // true (share pooled instance!)\n        System.out.println(s1 == s3);      // false (distinct heap objects)\n        System.out.println(s1.equals(s3)); // true (identical contents)\n    }\n}",
        "sandboxCode": "public class StringTest {\n    public static void main(String[] args) {\n        String a = \"Syntax\";\n        String b = \"Arena\";\n        String combined = a + b;\n        String literal = \"SyntaxArena\";\n\n        System.out.println(\"combined == literal? \" + (combined == literal));\n        System.out.println(\"interned == literal? \" + (combined.intern() == literal));\n    }\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "String Concatenation in Loops",
        "prompt": "Why is `String s = \"\"; for (int i = 0; i < 10000; i++) s += i;` an anti-pattern in Java?",
        "codeSnippet": "String s = \"\";\nfor (int i = 0; i < 10000; i++) {\n    s += i; // Inefficient loop concatenation!\n}",
        "options": [
          {
            "text": "It creates 10,000 temporary StringBuilder and String instances, resulting in O(N^2) time complexity",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Because String is immutable, s += i allocates a new StringBuilder, copies old characters, and converts to a new String on every cycle, degrading to O(N^2)."
          },
          {
            "text": "String concatenation throws a BufferOverflowException",
            "isCorrect": false,
            "feedback": "No exception occurs, but performance degrades catastrophically."
          },
          {
            "text": "The compiler replaces it with an immutable array",
            "isCorrect": false,
            "feedback": "Compilers optimize single-line concatenations, but cannot optimize across loop iterations."
          },
          {
            "text": "The String Pool runs out of memory immediately",
            "isCorrect": false,
            "feedback": "Dynamically created strings in loops are not stored in the String Pool unless intern() is called."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Subverting Immutability with Reflection",
        "content": "Prior to Java 9 (Project Jigsaw), malicious code could use reflection to access the private `value[]` field of String and alter its bytes in-place, poisoning the String Pool globally! Modern Java strictly prohibits reflective access to core java.base modules.",
        "codeSnippet": "// In modern Java, protected by strong encapsulation:\n// --add-opens java.base/java.lang=ALL-UNNAMED required",
        "tip": "Hacker Rule: Always use StringBuilder for string concatenation in loops.",
        "arenaTarget": "game.html?lang=java&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "java-les-003",
    "language": "java",
    "difficulty": "intermediate",
    "topic": "Generics & Type Erasure",
    "title": "Chapter 3: Generics, Wildcards & Bytecode Type Erasure",
    "tagline": "Understand how Java enforces compile-time type safety while erasing types at runtime.",
    "estimatedMinutes": 8,
    "objectives": [
      "Understand the rationale behind Java Generics and compile-time type safety",
      "Master the mechanism of Bytecode Type Erasure and synthetic bridge methods",
      "Apply the PECS rule: Producer Extends, Consumer Super for wildcard collections",
      "Identify generic limitations (cannot instantiate new T(), no primitives as type arguments)"
    ],
    "chapterSummary": "When Generics were introduced in Java 5 (2004), Sun Microsystems faced a critical architectural constraint: **backward compatibility**. Billions of lines of legacy Java bytecode were already deployed without generics. The JVM could not be modified to require reified generic types without breaking binary compatibility with every existing JAR on the planet.\n\nJava solved this dilemma through **Type Erasure**: generic type parameters exist strictly at compile time for verification. The compiler inserts casts and **erases all generic types to raw `Object`** in the compiled `.class` bytecode!",
    "deepDive": {
      "title": "Synthetic Bridge Methods",
      "content": "When a class implements a generic interface (like `Comparable<MyClass>`), type erasure creates a signature mismatch in bytecode. The compiler automatically synthesizes a hidden **bridge method** that takes `Object` and casts to `MyClass` to maintain polymorphic dispatch.",
      "codeSnippet": "// Compiler generates bridge method:\n// public int compareTo(Object o) { return compareTo((MyClass) o); }"
    },
    "takeaways": [
      "Generic type parameters are erased to Object (or upper bound) in bytecode.",
      "Runtime checks like instanceof List<String> are illegal due to erasure.",
      "Follow PECS: Producer Extends, Consumer Super for collection parameters.",
      "Pass Class<T> tokens when generic types must be instantiated at runtime."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Compile-Time Safety via Bytecode Type Erasure",
        "content": "When you write `List<String> list = new ArrayList<>();`, the compiler verifies that you only add Strings. However, in the compiled bytecode:\n- `List<String>` becomes raw `List`.\n- Reading from the list inserts an implicit cast `(String) list.get(i)`.\n\nAt runtime, the JVM has **zero knowledge** of the generic type parameter!",
        "codeSnippet": "import java.util.*;\n\npublic class ErasureDemo {\n    public static void main(String[] args) {\n        List<String> strings = new ArrayList<>();\n        List<Integer> integers = new ArrayList<>();\n\n        // At runtime, both share the identical raw Class:\n        System.out.println(strings.getClass() == integers.getClass()); // true!\n    }\n}",
        "sandboxCode": "import java.util.*;\n\npublic class WildcardTest {\n    // PECS: Producer Extends (read-only):\n    public static double sumOfNumbers(List<? extends Number> list) {\n        double sum = 0.0;\n        for (Number n : list) sum += n.doubleValue();\n        return sum;\n    }\n\n    public static void main(String[] args) {\n        List<Integer> ints = Arrays.asList(10, 20, 30);\n        System.out.println(\"Sum: \" + sumOfNumbers(ints));\n    }\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The PECS Wildcard Rule",
        "prompt": "According to Joshua Bloch's PECS rule, when should you use `? extends T` vs `? super T` in method signatures?",
        "codeSnippet": "void copy(List<? super T> dest, List<? extends T> src);",
        "options": [
          {
            "text": "Producer Extends (use extends when reading data from a collection), Consumer Super (use super when writing data into a collection)",
            "isCorrect": true,
            "feedback": "🎯 Exactly! PECS: If the collection produces values for you to read, use <? extends T>. If it consumes values for you to write, use <? super T>."
          },
          {
            "text": "Producer Super, Consumer Extends",
            "isCorrect": false,
            "feedback": "That is the opposite of the PECS rule."
          },
          {
            "text": "extends is for classes; super is for interfaces",
            "isCorrect": false,
            "feedback": "Both wildcards apply to classes and interfaces."
          },
          {
            "text": "There is no difference; they are interchangeable",
            "isCorrect": false,
            "feedback": "Using the wrong wildcard causes compile-time covariance errors."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Cannot Instantiate Generic Type new T()",
        "content": "Because of type erasure, `T` does not exist at runtime. Writing `new T()` or `new T[10]` fails to compile because the JVM does not know what concrete class constructor or array type to instantiate!",
        "codeSnippet": "// ❌ COMPILER ERROR:\npublic class Box<T> {\n    public void create() {\n        // T obj = new T(); // Type Erasure prevents this!\n    }\n}\n\n// ✅ IDIOMATIC FIX (Pass explicit Class token):\npublic class BoxSafe<T> {\n    public T create(Class<T> clazz) throws Exception {\n        return clazz.getDeclaredConstructor().newInstance();\n    }\n}",
        "tip": "Hacker Rule: Remember PECS: Producer Extends, Consumer Super for flexible library APIs.",
        "arenaTarget": "game.html?lang=java&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "java-les-004",
    "language": "java",
    "difficulty": "expert",
    "topic": "JVM Memory & Garbage Collection",
    "title": "Chapter 4: JVM Heap Layout & Generational Garbage Collection",
    "tagline": "Master Eden, Survivor, Tenured memory spaces, G1/ZGC algorithms, and prevent memory leaks.",
    "estimatedMinutes": 8,
    "objectives": [
      "Master the generational heap architecture: Eden, Survivor (S0/S1), Tenured (Old), Metaspace",
      "Understand the Weak Generational Hypothesis and GC pause mechanics",
      "Differentiate between G1 (Garbage-First), ZGC, and legacy Parallel collectors",
      "Diagnose and resolve JVM memory leaks caused by static collections and unclosed resources"
    ],
    "chapterSummary": "Unlike C and C++, where developers manually deallocate memory, the Java runtime manages memory automatically using **Tracing Garbage Collection**.\n\nThe JVM heap design is built on the **Weak Generational Hypothesis**: empirical research demonstrates that over 98% of objects die shortly after creation (temporary variables in methods). To exploit this, the JVM segregates heap memory into **Generations**, applying distinct, highly optimized collection algorithms to young vs long-lived objects.",
    "deepDive": {
      "title": "Modern Ultra-Low-Latency Collectors: ZGC & Shenandoah",
      "content": "Legacy collectors incurred 100ms–2000ms pause times. Modern JVMs feature **ZGC** and **Shenandoah**, which perform concurrent marking and compaction using colored pointers and load barriers, keeping STW pauses **under 1 millisecond** even on multi-terabyte heaps!",
      "codeSnippet": "java -XX:+UseZGC -XX:+ZGenerational -jar app.jar"
    },
    "takeaways": [
      "The JVM heap is split into Eden, Survivor (S0/S1), and Tenured Old Gen.",
      "Most objects die young in Eden, collected efficiently by minor GCs.",
      "Static fields and unclosed listeners are the primary sources of Java memory leaks.",
      "Modern collectors like ZGC reduce Stop-The-World pauses to under 1ms."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Generational Heap Architecture",
        "content": "The JVM heap is structured into three primary spaces:\n1. **Eden Space (Young)**: Where all new objects are allocated rapidly using thread-local allocation buffers (TLABs).\n2. **Survivor Spaces (S0 / S1)**: Objects surviving minor GC cycles are copied between S0 and S1, incrementing their age counter.\n3. **Tenured / Old Generation**: Objects surviving past the tenure threshold (typically 15 GC cycles) are promoted to Old Gen.\n\nNon-heap code metadata resides in native **Metaspace**.",
        "codeSnippet": "// Allocation occurs in Eden:\nbyte[] buffer = new byte[1024 * 1024]; // 1MB in Eden\n\n// Minor GC collects Eden in milliseconds.\n// Surviving long-lived objects are promoted to Tenured Old Gen.",
        "sandboxCode": "public class MemoryLeakDemo {\n    // ❌ Static collection keeps objects alive indefinitely (Root reference):\n    public static final java.util.List<Object> LEAK = new java.util.ArrayList<>();\n\n    public static void main(String[] args) {\n        for (int i = 0; i < 5; i++) {\n            LEAK.add(new byte[1024 * 100]); // 100KB chunks\n            System.out.println(\"Allocated chunk \" + (i + 1));\n        }\n        System.out.println(\"Leak size: \" + LEAK.size());\n    }\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Stop-The-World (STW) Pause Check",
        "prompt": "What happens during a JVM Stop-The-World (STW) garbage collection phase?",
        "codeSnippet": "System.gc(); // Explicitly requests full STW GC sweep!",
        "options": [
          {
            "text": "All application execution threads are suspended while the GC traverses and moves live object references",
            "isCorrect": true,
            "feedback": "🎯 Exactly! During STW phases, application threads are paused at safe points so object pointers can be relocated without concurrent mutation."
          },
          {
            "text": "The operating system restarts the Java process",
            "isCorrect": false,
            "feedback": "The process stays alive; only application threads pause temporarily."
          },
          {
            "text": "Only background daemon threads are paused",
            "isCorrect": false,
            "feedback": "All application threads must stop during STW phases."
          },
          {
            "text": "The JVM switches to single-threaded interpretation",
            "isCorrect": false,
            "feedback": "JIT compilation is preserved; STW is purely a garbage collector synchronization lock."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Memory Leaks in Static Collections",
        "content": "Because objects in static collections are reachable from GC Roots (loaded classes in Metaspace), the Garbage Collector can **never reclaim them**! Storing user sessions or caches in static HashMaps without eviction leads inevitably to `java.lang.OutOfMemoryError: Java heap space`.",
        "codeSnippet": "// ❌ CLASSIC ENTERPRISE MEMORY LEAK:\npublic class Cache {\n    private static Map<String, Object> map = new HashMap<>(); // Never cleared!\n}",
        "tip": "Hacker Rule: Use WeakHashMap or Guava/Caffeine caches with explicit TTL and maximum size limits.",
        "arenaTarget": "game.html?lang=java&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "java-les-005",
    "language": "java",
    "difficulty": "expert",
    "topic": "Java Memory Model & Volatile",
    "title": "Chapter 5: Java Memory Model, volatile & Thread Visibility",
    "tagline": "Master CPU cache coherency, instruction reordering, and the Happens-Before relationship.",
    "estimatedMinutes": 8,
    "objectives": [
      "Understand modern CPU multi-core caching (L1/L2/L3) and the cache coherency problem",
      "Master the Java Memory Model (JMM) and the Happens-Before contract",
      "Understand the volatile keyword: memory fences and preventing instruction reordering",
      "Distinguish between visibility (volatile) vs atomicity (AtomicInteger, locks)"
    ],
    "chapterSummary": "In modern multi-core computing architectures, CPUs execute instructions billions of times faster than main RAM can deliver data. To bridge this latency gulf, each CPU core features private hardware **L1 and L2 caches**.\n\nWithout explicit synchronization, CPU Core 1 modifying a variable writes to its local L1 cache, leaving CPU Core 2 reading stale data from its own cache! The **Java Memory Model (JMM)** defines the official specification for when actions in one thread are guaranteed to be visible to another thread.",
    "deepDive": {
      "title": "Hardware Compare-And-Swap (CAS)",
      "content": "Classes in `java.util.concurrent.atomic` (`AtomicInteger`, `AtomicReference`) avoid thread locking entirely by utilizing CPU assembly instructions like `lock cmpxchg` (Compare-And-Swap). If another thread modified the value, CAS retries in a tight lock-free loop.",
      "codeSnippet": "// atomicInteger.compareAndSet(expected, update);"
    },
    "takeaways": [
      "volatile guarantees cache visibility and prevents compiler instruction reordering.",
      "volatile does NOT guarantee atomicity; count++ remains unsafe under concurrency.",
      "The Happens-Before relationship defines memory visibility guarantees across threads.",
      "Use AtomicInteger or synchronized locks when performing read-modify-write operations."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The volatile Keyword & Memory Barriers",
        "content": "Declaring a field `volatile` provides two critical guarantees:\n1. **Visibility**: Reads and writes bypass local CPU caches and interact directly with main memory. Any write by Thread A is immediately visible to Thread B.\n2. **Instruction Ordering**: The compiler and CPU hardware are forbidden from reordering reads and writes across the volatile boundary (injecting **Memory Fences** / barriers).",
        "codeSnippet": "public class ServerStatus {\n    // volatile ensures all worker threads see stop signal immediately:\n    private volatile boolean running = true;\n\n    public void stop() { running = false; }\n\n    public void work() {\n        while (running) {\n            // Processing workload...\n        }\n    }\n}",
        "sandboxCode": "import java.util.concurrent.atomic.AtomicInteger;\n\npublic class ConcurrencyTest {\n    // volatile guarantees visibility, but NOT atomic compound operations (count++)!\n    private static volatile int count = 0;\n    // AtomicInteger provides both visibility AND hardware atomic CAS:\n    private static AtomicInteger atomicCount = new AtomicInteger(0);\n\n    public static void main(String[] args) {\n        atomicCount.incrementAndGet();\n        System.out.println(\"Atomic Count: \" + atomicCount.get());\n    }\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The volatile ++ Non-Atomic Trap",
        "prompt": "Why does `volatile int counter = 0;` fail to be thread-safe when 10 threads execute `counter++` concurrently?",
        "codeSnippet": "private volatile int counter = 0;\n// Thread 1: counter++;\n// Thread 2: counter++;",
        "options": [
          {
            "text": "counter++ is not an atomic operation; it consists of three separate steps (read, modify, write) susceptible to race conditions",
            "isCorrect": true,
            "feedback": "🎯 Exactly! volatile guarantees visibility, but NOT atomicity. Two threads can read the same value concurrently and overwrite each other. Use AtomicInteger instead."
          },
          {
            "text": "volatile variables can only be read, never modified",
            "isCorrect": false,
            "feedback": "volatile variables are fully mutable."
          },
          {
            "text": "The volatile keyword only works on boolean flags",
            "isCorrect": false,
            "feedback": "volatile works on all primitives and object references."
          },
          {
            "text": "counter++ throws an IllegalMonitorStateException",
            "isCorrect": false,
            "feedback": "No exception occurs; silent data race loss occurs."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Double-Checked Locking Broken Without volatile",
        "content": "A classic concurrency disaster is the Double-Checked Locking Singleton. Without `volatile`, the JVM can reorder instruction execution such that `instance` is assigned before its constructor completes! Another thread sees `instance != null` and reads an uninitialized object.",
        "codeSnippet": "// ❌ BROKEN SINGLETON (Thread safety hazard without volatile):\nprivate static Singleton instance; // Missing volatile!\n\n// ✅ FIXED (Memory barrier prevents reordering):\nprivate static volatile Singleton instance;",
        "tip": "Hacker Rule: volatile guarantees visibility; use Atomic variables or synchronized locks for atomicity.",
        "arenaTarget": "game.html?lang=java&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "cyber-les-001",
    "language": "cyber",
    "difficulty": "beginner",
    "topic": "Filesystem Hierarchy & Paths",
    "title": "Chapter 1: The Linux Filesystem Hierarchy & Path Traversal Security",
    "tagline": "Master the Unix Filesystem Hierarchy Standard (FHS) and prevent path traversal exploits.",
    "estimatedMinutes": 6,
    "objectives": [
      "Master the Linux Filesystem Hierarchy Standard (FHS): /, /etc, /proc, /dev, /var",
      "Distinguish between absolute paths (/var/log) and relative paths (../config)",
      "Understand how the /proc virtual filesystem exposes real-time kernel data",
      "Identify and remediate Path Traversal (Directory Traversal) vulnerabilities"
    ],
    "chapterSummary": "In Unix-like operating systems, the filesystem does not have drive letters (such as `C:\\` or `D:\\`). Instead, every file, storage volume, process, and hardware peripheral is organized under a single unified hierarchical tree rooted at **`/` (the Root Directory)**.\n\nUnderstanding the purpose of each system directory (`/etc` for configs, `/var` for variable logs, `/proc` for live kernel memory) is mandatory for both systems administration and penetration testing.",
    "deepDive": {
      "title": "The /proc Pseudo-Filesystem",
      "content": "Files in `/proc` consume zero bytes on disk! They are generated on the fly by the Linux kernel when read by a syscall. Inspecting `/proc/self/maps` displays the exact memory mapping layout (stack, heap, shared libraries) of your currently running process.",
      "codeSnippet": "cat /proc/self/status | grep VmRSS"
    },
    "takeaways": [
      "Linux organizes all files under a single unified root directory (/).",
      "/etc holds configurations; /var holds logs; /proc is live kernel memory.",
      "Absolute paths start with /; relative paths depend on current working directory.",
      "Always sanitize file inputs with realpath() to prevent Path Traversal exploits."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Unified Unix Root & FHS Architecture",
        "content": "Key directories in the Filesystem Hierarchy Standard (FHS):\n- `/`: The singular root of the entire filesystem namespace.\n- `/etc`: System-wide configuration files (e.g. `/etc/passwd`, `/etc/shadow`, `/etc/hosts`).\n- `/proc`: Virtual pseudo-filesystem exposing real-time kernel structures and running process memory (e.g. `/proc/cpuinfo`, `/proc/[pid]/cmdline`).\n- `/dev`: Device nodes representing hardware devices and special files (`/dev/null`, `/dev/urandom`).\n- `/var`: Variable data: service logs (`/var/log`), spools, and databases.",
        "codeSnippet": "# Inspect system hostname:\ncat /etc/hostname\n\n# Inspect process 1 command line:\ncat /proc/1/cmdline\n\n# Discard output to the null device:\ncommand > /dev/null 2>&1",
        "sandboxCode": "# Linux Shell Commands in Sandbox:\npwd\necho \"Root directories:\"\nls -F /\necho \"Kernel uptime and memory:\"\ncat /proc/meminfo | head -n 3"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Absolute vs Relative Paths Check",
        "prompt": "If current directory is /var/log/nginx, which command navigates directly to /etc/nginx via a relative path?",
        "codeSnippet": "cd ../../../etc/nginx",
        "options": [
          {
            "text": "cd ../../../etc/nginx",
            "isCorrect": true,
            "feedback": "🎯 Correct! Walking up 3 directories (nginx -> log -> var -> /) reaches root, then enters /etc/nginx."
          },
          {
            "text": "cd ../../etc/nginx",
            "isCorrect": false,
            "feedback": "Moving up 2 levels leaves you in /var, trying to access /var/etc/nginx (invalid)."
          },
          {
            "text": "cd ./etc/nginx",
            "isCorrect": false,
            "feedback": "./ looks inside the current nginx log folder."
          },
          {
            "text": "cd ~etc/nginx",
            "isCorrect": false,
            "feedback": "~ expands to user home directories, not system /etc."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Path Traversal / Arbitrary File Read Exploit",
        "content": "When an application blindly concatenates user input into file paths (e.g. `open(\"/uploads/\" + filename)`), an attacker can pass `../../../../etc/passwd` to break out of the intended directory and read sensitive system credentials!",
        "codeSnippet": "// ❌ CRITICAL VULNERABILITY (Path Traversal):\nchar path[256];\nsnprintf(path, sizeof(path), \"/var/www/uploads/%s\", user_input);\n// If user_input == \"../../../../etc/shadow\", file is leaked!\n\n// ✅ DEFENSIVE FIX:\n// 1. Strip all \"../\" sequences.\n// 2. Resolve with realpath() and verify it begins with \"/var/www/uploads/\".",
        "tip": "Hacker Rule: Always canonicalize paths using realpath() and verify they remain within the authorized jail root.",
        "arenaTarget": "game.html?lang=cyber&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "cyber-les-002",
    "language": "cyber",
    "difficulty": "beginner",
    "topic": "Permissions & SUID",
    "title": "Chapter 2: Linux File Permissions, Octal Masks & SUID Escalation",
    "tagline": "Master rwx permissions, calculate octal masks, and identify SUID privilege escalation vectors.",
    "estimatedMinutes": 6,
    "objectives": [
      "Master the standard Unix permission triplet: Read (4), Write (2), Execute (1)",
      "Calculate octal permission masks (e.g. 755, 644, 700)",
      "Understand the SUID (Set User ID) and SGID special permission bits",
      "Identify and remediate SUID root privilege escalation vulnerabilities"
    ],
    "chapterSummary": "Security in Unix systems rests on Discretionary Access Control (DAC). Every file and directory is owned by a specific **User (Owner)** and **Group**, with permissions assigned across three tiers: **User (u)**, **Group (g)**, and **Others (o)**.\n\nWhile standard `rwx` permissions protect everyday files, special permission bits like **SUID (Set Owner User ID)** enable binaries to execute with the privileges of their file owner (often `root`), creating high-risk vectors for privilege escalation if misconfigured.",
    "deepDive": {
      "title": "The umask System Default Filter",
      "content": "When files are created, permissions are filtered through the process `umask`. A standard umask of `022` subtracts write permissions from Group and Others, resulting in default `644` for files (`666 - 022`) and `755` for directories (`777 - 022`).",
      "codeSnippet": "umask 077 # Maximum security: only owner can read/write new files (600)"
    },
    "takeaways": [
      "Permissions are calculated in octal: Read (4) + Write (2) + Execute (1).",
      "600 is required for sensitive files (SSH keys); 755 for executables.",
      "The SUID bit (chmod u+s) executes the binary with the owner's privileges (root).",
      "Never assign SUID to interpreters, text editors, or scriptable utilities."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The rwx Permission Model & Octal Mathematics",
        "content": "Permissions are calculated using 3-bit octal values:\n- **Read (r)**: `4` (View file contents / list directory entries)\n- **Write (w)**: `2` (Modify file contents / create or delete files in directory)\n- **Execute (x)**: `1` (Execute binary or script / enter directory with cd)\n\nSum the values for each tier: `chmod 755 file` means `rwx` (4+2+1=7) for Owner, `r-x` (4+1=5) for Group, and `r-x` (4+1=5) for Others.",
        "codeSnippet": "# View permissions with ls -l:\n# -rwxr-xr-x 1 root root 4096 Oct 10 12:00 script.sh\n\n# Change permission:\nchmod 755 script.sh # rwxr-xr-x\nchmod 600 id_rsa    # rw------- (Strict private key permission)\nchmod u+s /bin/ping # Set SUID bit (runs as root)",
        "sandboxCode": "# Calculate octal masks in shell:\necho \"Creating secure private key:\"\ntouch key.pem\nchmod 600 key.pem\nls -l key.pem"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The SUID Privilege Escalation Vector",
        "prompt": "What happens when a non-root user executes a binary with permissions `-rwsr-xr-x` owned by root?",
        "codeSnippet": "-rwsr-xr-x 1 root root 84520 /usr/bin/custom_tool",
        "options": [
          {
            "text": "The program executes with the effective UID (EUID) and elevated privileges of the root user",
            "isCorrect": true,
            "feedback": "🎯 Correct! The lowercase \"s\" indicates the SUID bit is set. When executed, the operating system grants the process root privileges regardless of who launched it."
          },
          {
            "text": "The program can only be executed by the root user",
            "isCorrect": false,
            "feedback": "The \"x\" in others permits anyone to run it."
          },
          {
            "text": "The program runs in a sandboxed, restricted container",
            "isCorrect": false,
            "feedback": "SUID elevates privileges, it does not restrict them."
          },
          {
            "text": "A Permission Denied error occurs",
            "isCorrect": false,
            "feedback": "The binary has execute permissions for all users."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "SUID Binaries with GTFOBins Vulnerabilities",
        "content": "Setting the SUID bit on standard utilities with shell-escape capabilities (like `vim`, `find`, `nmap`, or `python`) allows any local user to spawn an interactive root shell instantly! Check your system with GTFOBins patterns.",
        "codeSnippet": "# ❌ DANGEROUS SECURITY MISCONFIGURATION:\nchmod u+s /usr/bin/find\n\n# Attacker escalates to root instantly:\nfind . -exec /bin/sh -p \\; -quit # Roots the server!",
        "tip": "Hacker Rule: Audit your system for rogue SUID binaries using: find / -perm -4000 -type f 2>/dev/null",
        "arenaTarget": "game.html?lang=cyber&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "cyber-les-003",
    "language": "cyber",
    "difficulty": "intermediate",
    "topic": "Pipes & Streams",
    "title": "Chapter 3: Standard Streams, Unix Pipes & Redirection",
    "tagline": "Master stdin, stdout, stderr, pipeline IPC, and advanced stream redirection.",
    "estimatedMinutes": 6,
    "objectives": [
      "Master the three standard POSIX I/O streams: stdin (0), stdout (1), stderr (2)",
      "Understand how the pipe operator (|) connects processes via kernel memory buffers",
      "Distinguish between overwrite (>) and append (>>) redirection",
      "Master error redirection syntax: 2>&1 and /dev/null discarding"
    ],
    "chapterSummary": "The foundational tenet of the Unix philosophy is: *\"Write programs that do one thing well, and write programs to work together.\"*\n\nThis composability is powered by **Standard Streams and Unix Pipes**. Every Linux process launches with three open file descriptors (stdin, stdout, stderr). By piping stdout of one process into stdin of another, developers chain lightweight modular tools into powerful data processing pipelines with zero intermediate disk I/O.",
    "deepDive": {
      "title": "Kernel Pipe Buffers (pipe(2))",
      "content": "Under the hood, `|` invokes the `pipe(2)` system call. In modern Linux kernels, pipe capacity is 65,536 bytes (64KB). If the buffer fills, the writing process is put to sleep until the reader consumes data.",
      "codeSnippet": "cat /proc/sys/fs/pipe-max-size # Typically 1048576 (1MB max)"
    },
    "takeaways": [
      "stdin is 0, stdout is 1, stderr is 2.",
      "The pipe (|) connects stdout of one process to stdin of the next in kernel RAM.",
      "Use > to overwrite and >> to append to a file.",
      "2>&1 redirects error messages to the same destination as normal output."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Three Streams: stdin (0), stdout (1), stderr (2)",
        "content": "POSIX standard file descriptors:\n- **0 (stdin)**: Standard Input (keyboard or upstream pipe)\n- **1 (stdout)**: Standard Output (normal program output)\n- **2 (stderr)**: Standard Error (diagnostic error logs)\n\nThe pipe operator `|` allocates an in-kernel circular buffer connecting stdout of process A directly into stdin of process B.",
        "codeSnippet": "# Count failed login attempts from auth log:\ngrep \"Failed password\" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr\n\n# Redirect stdout and stderr together to log:\nbackup_script.sh > backup.log 2>&1\n\n# Discard error messages silently:\nfind / -name \"*.conf\" 2>/dev/null",
        "sandboxCode": "# Pipeline processing in shell:\necho -e \"apple\\nbanana\\napple\\ncherry\\nbanana\\napple\" | sort | uniq -c"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The 2>&1 Syntax Explanation",
        "prompt": "What does the redirection syntax `command > output.txt 2>&1` accomplish?",
        "codeSnippet": "curl -v https://example.com > output.txt 2>&1",
        "options": [
          {
            "text": "It redirects stdout to output.txt, and then redirects stderr (descriptor 2) to the exact same destination as stdout (descriptor 1)",
            "isCorrect": true,
            "feedback": "🎯 Exactly! 2>&1 duplicates descriptor 1 onto descriptor 2, capturing both standard logs and errors into output.txt."
          },
          {
            "text": "It runs the command twice in the background",
            "isCorrect": false,
            "feedback": "Redirection symbols do not execute commands multiple times."
          },
          {
            "text": "It sends output to two separate files named output.txt and 2",
            "isCorrect": false,
            "feedback": "2>&1 is descriptor syntax, not a filename."
          },
          {
            "text": "It forces the command to use HTTP/2 protocol",
            "isCorrect": false,
            "feedback": "This is pure shell stream redirection, unrelated to network protocols."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "The \"Useless Use of cat\" (UUOC) & SIGPIPE",
        "content": "Writing `cat file | grep text` spawns a redundant process. Furthermore, when downstream processes exit early (e.g. `head -n 1`), writing to the broken pipe triggers a **SIGPIPE signal** that terminates the upstream process immediately.",
        "codeSnippet": "// ❌ REDUNDANT (UUOC):\ncat access.log | grep \"404\"\n\n// ✅ IDIOMATIC & EFFICIENT:\ngrep \"404\" access.log",
        "tip": "Hacker Rule: Use grep, sed, and awk directly with file arguments instead of piping from cat.",
        "arenaTarget": "game.html?lang=cyber&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "cyber-les-004",
    "language": "cyber",
    "difficulty": "expert",
    "topic": "Shell Globbing vs Regex",
    "title": "Chapter 4: Shell Globbing vs Regular Expressions",
    "tagline": "Understand the critical architectural divide between shell expansion and regex engines.",
    "estimatedMinutes": 7,
    "objectives": [
      "Understand when Shell Globbing occurs (client shell before program invocation)",
      "Understand how Regular Expression engines (grep, sed, awk) process string patterns",
      "Distinguish between wildcards (* in glob vs * in regex)",
      "Prevent command injection attacks caused by wildcard expansion in bash"
    ],
    "chapterSummary": "One of the most dangerous points of confusion in Linux security is the difference between **Shell Globbing** and **Regular Expressions**.\n\nShell globbing is performed by your shell (Bash, Zsh) **before** the command is ever launched! The shell expands wildcards (`*`, `?`) into matching file names on disk. In contrast, regular expressions are text-matching patterns evaluated internally by tools like `grep -E`, `sed`, or `regex` libraries.",
    "deepDive": {
      "title": "Nullglob and Failglob Shell Options",
      "content": "By default in Bash, if a glob pattern matches zero files, it evaluates to the literal pattern string (e.g. `*.xyz` passes the string `\"*.xyz\"`). Setting `shopt -s nullglob` causes non-matching globs to expand to nothing, preventing scripts from crashing.",
      "codeSnippet": "shopt -s nullglob # Safe bash scripting"
    },
    "takeaways": [
      "The shell expands globs BEFORE executing the command.",
      "In globbing, * means any characters; in regex, * quantifies the previous token.",
      "Regex engines operate on text strings inside programs (grep, sed, awk).",
      "Wildcard expansion (* ) in shell scripts can be exploited via flag injection."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Shell Globbing vs Regex Pattern Engine",
        "content": "Key differences:\n- **Globbing (`*.txt`)**: The shell scans the directory and replaces `*.txt` with `a.txt b.txt` before passing them as `argv` to the binary.\n- **Regex (`^a.*z$`)**: The pattern is passed as a string to the binary, which applies a finite automaton engine across line contents.\n\nIn globbing, `*` means \"any characters\". In regex, `*` means \"zero or more occurrences of the preceding token\"!",
        "codeSnippet": "# Shell Globbing (expands file names on disk):\nls *.log  # Shell expands to: ls auth.log error.log access.log\n\n# Regular Expression (evaluates line text inside files):\ngrep -E \"^[0-9]{1,3}\\.[0-9]{1,3}\" access.log",
        "sandboxCode": "# Inspect shell expansion with echo:\necho \"Current directory markdown files:\"\necho *.md"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Regex Dot-Star (. *) Meaning",
        "prompt": "What does `.*` represent in a POSIX Extended Regular Expression (grep -E)?",
        "codeSnippet": "grep -E \"admin.*error\" /var/log/syslog",
        "options": [
          {
            "text": "Any character (.) repeated zero or more times (*)",
            "isCorrect": true,
            "feedback": "🎯 Exactly! In regex, . matches any single character and * is the Kleene star quantifier matching 0 or more of the previous token."
          },
          {
            "text": "A literal period followed by any characters",
            "isCorrect": false,
            "feedback": "A literal period requires escaping with a backslash (\\.)."
          },
          {
            "text": "All files starting with admin",
            "isCorrect": false,
            "feedback": "That is globbing syntax, not regular expression line matching."
          },
          {
            "text": "A syntax error in regex",
            "isCorrect": false,
            "feedback": ".* is the most common idiom in regex."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Wildcard Injection Exploit in tar / rm",
        "content": "A classic Linux privilege escalation vulnerability occurs when root runs `tar * ` in a directory writable by attackers. An attacker creates a file named `--checkpoint=1` and `--checkpoint-action=exec=sh exploit.sh`. When the shell expands `*`, tar parses the filenames as **command-line flags**, executing the attacker's script as root!",
        "codeSnippet": "# Attacker creates malicious filename arguments:\ntouch -- \"--checkpoint=1\"\ntouch -- \"--checkpoint-action=exec=sh root_shell.sh\"\n\n# Admin runs automated cron job:\ntar -czf backup.tar.gz * # Injects flags and executes root_shell.sh!",
        "tip": "Hacker Rule: Always use -- before wildcards (tar -czf backup.tar.gz -- *) or reference ./ explicitly.",
        "arenaTarget": "game.html?lang=cyber&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "cyber-les-005",
    "language": "cyber",
    "difficulty": "expert",
    "topic": "Forensics & Log Analysis",
    "title": "Chapter 5: Security Forensics, Auth Logs & Incident Response",
    "tagline": "Analyze system audit trails, detect SSH brute-force intrusions, and parse forensic logs.",
    "estimatedMinutes": 8,
    "objectives": [
      "Master Linux authentication logging: /var/log/auth.log, secure, and journalctl",
      "Trace unauthorized intrusion attempts and automated brute-force botnets",
      "Use awk, grep, and sort to generate security analytics from raw log files",
      "Understand forensic anti-tampering principles during incident response"
    ],
    "chapterSummary": "When a Linux server is compromised, attackers attempt to cover their tracks by editing history files and altering logs. However, security analysts rely on **System Audit Logs** to reconstruct attack timelines, identify IP indicators of compromise (IoCs), and determine the extent of unauthorized access.\n\nMastering log analysis with standard command-line tools (`grep`, `awk`, `journalctl`) allows security responders to extract actionable intelligence in seconds without relying on heavyweight third-party SIEM agents.",
    "deepDive": {
      "title": "Detecting Hidden Processes via /proc",
      "content": "Userland rootkits often hook `libc` functions (`readdir`) to hide malicious processes from `ps` and `top`. However, the kernel cannot hide their `/proc/[pid]` directories! Comparing `ps` output against raw directories in `/proc` reveals hidden attacker processes.",
      "codeSnippet": "ls -d /proc/[0-9]* | awk -F/ '{print $3}' # Raw kernel PIDs"
    },
    "takeaways": [
      "auth.log and secure record all authentication, sudo, and SSH events.",
      "Pipe grep, awk, sort, and uniq -c to extract attacking IPs and brute-force metrics.",
      "Never reboot a compromised machine before capturing volatile RAM evidence.",
      "Compare ps output against /proc to detect userland hidden process rootkits."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Authentication Audit Trail",
        "content": "Critical security log locations:\n- **Debian/Ubuntu**: `/var/log/auth.log` (SSH logins, sudo invocations, user creation)\n- **RHEL/CentOS**: `/var/log/secure`\n- **Systemd Journal**: `journalctl -u sshd --since \"1 hour ago\"`\n\nFailed login attempts record the attacker's IP, port, and username: `Failed password for invalid user admin from 198.51.100.24 port 43210 ssh2`.",
        "codeSnippet": "# Top 5 attacking IPs attempting brute-force SSH:\ngrep \"Failed password\" /var/log/auth.log | \\\nawk '{for(i=1;i<=NF;i++) if($i==\"from\") print $(i+1)}' | \\\nsort | uniq -c | sort -nr | head -n 5",
        "sandboxCode": "# Mock log analysis using shell tools:\necho -e \"Failed password for admin from 10.0.0.5\\nAccepted publickey for ubuntu from 192.168.1.10\\nFailed password for root from 10.0.0.5\" | grep \"Failed\""
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Identifying Successful Lateral Movement",
        "prompt": "Which log entry indicates that an unprivileged user successfully assumed root privileges via sudo?",
        "codeSnippet": "auth.log inspection",
        "options": [
          {
            "text": "sudo: username : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/bin/bash",
            "isCorrect": true,
            "feedback": "🎯 Correct! This sudo log entry explicitly confirms the user ran /bin/bash as root, gaining full root shell access."
          },
          {
            "text": "sshd: Connection closed by authenticating user root",
            "isCorrect": false,
            "feedback": "This indicates a closed connection, not a sudo escalation."
          },
          {
            "text": "groupadd: group added to /etc/group",
            "isCorrect": false,
            "feedback": "This indicates group creation, not interactive privilege assumption."
          },
          {
            "text": "CRON: (root) CMD (run-parts /etc/cron.hourly)",
            "isCorrect": false,
            "feedback": "This is standard automated system cron execution."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Volatile Evidence Destruction During Incident Response",
        "content": "A catastrophic mistake during active incident response is rebooting the server! Rebooting destroys volatile memory (RAM), terminating active network socket connections, unlinked open files, and in-memory rootkits that leave no trace on disk.",
        "codeSnippet": "// ❌ CRITICAL FORENSIC MISTAKE:\nsudo reboot # Destroys RAM evidence forever!\n\n// ✅ CORRECT: Capture volatile memory first:\n// dd / LiME memory dump, netstat, lsof, ss -tulpn",
        "tip": "Hacker Rule: Follow the Order of Volatility: capture RAM and live network connections before touching disk.",
        "arenaTarget": "game.html?lang=cyber&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "js-les-001",
    "language": "javascript",
    "difficulty": "beginner",
    "topic": "Type Coercion & Equality",
    "title": "Chapter 1: ECMAScript Type Coercion & Equality Algorithms",
    "tagline": "Master the ToPrimitive algorithm, truthy/falsy evaluation, and strict vs abstract equality.",
    "estimatedMinutes": 6,
    "objectives": [
      "Master the distinction between primitive types (7) vs Object reference types",
      "Understand the ECMAScript ToPrimitive conversion algorithm",
      "Understand why abstract equality (==) produces notorious coercion quirks",
      "Standardize on strict equality (===) and Object.is() for deterministic checks"
    ],
    "chapterSummary": "JavaScript is a dynamically and weakly typed language. When operations occur between mismatched types (such as adding a number to an array or comparing a boolean to a string), the JavaScript engine does not crash. Instead, it silently applies **implicit type coercion** using the ECMAScript `ToPrimitive` and `ToNumber` internal algorithms.\n\nUnderstanding these coercion rules demystifies famous JavaScript quirks like `[] + {} === \"[object Object]\"` and protects applications from security flaws in authentication checks.",
    "deepDive": {
      "title": "The ToPrimitive Algorithm (Symbol.toPrimitive)",
      "content": "When an object is coerced to a primitive, JavaScript calls its internal `[[ToPrimitive]]` method, consulting `[Symbol.toPrimitive](hint)`, falling back to `valueOf()` then `toString()`.",
      "codeSnippet": "const obj = {\n    [Symbol.toPrimitive](hint) {\n        return hint === 'number' ? 42 : 'hacker';\n    }\n};\nconsole.log(+obj);      // 42 (hint is number)\nconsole.log(`${obj}`);  // \"hacker\" (hint is string)"
    },
    "takeaways": [
      "Always use strict equality (===); avoid abstract equality (==).",
      "The 7 primitives: number, string, boolean, null, undefined, symbol, bigint.",
      "NaN is the only value in JavaScript that is not equal to itself (NaN !== NaN).",
      "Use Object.is() when comparing NaN or distinguishing +0 and -0."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Abstract (==) vs Strict (===) Equality",
        "content": "JavaScript provides three equality algorithms:\n1. **Abstract Equality (`==`)**: Attempts to coerce operands to common types before comparing (e.g. `false == 0` is true because `false` coerces to `0`).\n2. **Strict Equality (`===`)**: Requires identical types and identical values. No coercion occurs.\n3. **SameValue (`Object.is`)**: Same as `===`, but distinguishes `-0` from `+0`, and considers `NaN` equal to `NaN`.",
        "codeSnippet": "console.log(0 == false);        // true (coerced: 0 == 0)\nconsole.log(\"\" == 0);           // true (coerced: 0 == 0)\nconsole.log(null == undefined); // true (special rule in spec)\n\nconsole.log(0 === false);       // false (different types!)\nconsole.log(NaN === NaN);       // false (IEEE 754 float rule)\nconsole.log(Object.is(NaN, NaN)); // true!",
        "sandboxCode": "console.log('[] == false:', [] == false);\nconsole.log('[] == ![]:', [] == ![]);\nconsole.log('typeof NaN:', typeof NaN);\nconsole.log('NaN === NaN:', NaN === NaN);\nconsole.log('Object.is(NaN, NaN):', Object.is(NaN, NaN));"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The [] == ![] Mystery",
        "prompt": "Why does the expression `[] == ![]` evaluate to true in JavaScript?",
        "codeSnippet": "console.log([] == ![]); // true!",
        "options": [
          {
            "text": "![] coerces to boolean false; the comparison becomes [] == false, which coerces both sides to number 0 == 0",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Logical NOT (!) has higher precedence: [] is truthy, so ![] becomes false. Then [] == false triggers numeric coercion: [].toString() is \"\" -> 0, and false -> 0. 0 == 0 is true!"
          },
          {
            "text": "Because arrays are automatically negated by the compiler",
            "isCorrect": false,
            "feedback": "Arrays are objects and always truthy."
          },
          {
            "text": "It is a known bug in V8 that was never fixed",
            "isCorrect": false,
            "feedback": "It is strictly specified in the ECMAScript 262 language standard."
          },
          {
            "text": "Both sides evaluate to undefined",
            "isCorrect": false,
            "feedback": "Neither side is undefined; both coerce to number 0."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Loose Equality in Security & Auth Checks",
        "content": "Using `==` in authentication logic allows subtle bypasses. In PHP or Node.js backends, comparing JSON payloads with `==` can allow an attacker sending `{ \"token\": true }` to match any non-empty string token, bypassing password verification!",
        "codeSnippet": "// ❌ CRITICAL SECURITY FLAW:\nif (input_token == expected_secret) { // Loose equality!\n    grant_admin();\n}\n\n// ✅ DEFENSIVE FIX:\nif (input_token === expected_secret) { // Strict equality\n    grant_admin();\n}",
        "tip": "Hacker Rule: Always use strict equality (===); never use loose equality (==) in production code.",
        "arenaTarget": "game.html?lang=javascript&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "js-les-002",
    "language": "javascript",
    "difficulty": "beginner",
    "topic": "Closures & Lexical Scope",
    "title": "Chapter 2: Lexical Environments, Closures & Scope Chains",
    "tagline": "Understand how lexical environment records capture variables and retain memory.",
    "estimatedMinutes": 6,
    "objectives": [
      "Master Lexical Scoping and Lexical Environment Records in the V8 engine",
      "Understand how inner functions retain access to outer variables via [[Scopes]]",
      "Build encapsulation and private state using closures (Module Pattern)",
      "Identify memory retention leaks in long-lived event listeners holding outer scopes"
    ],
    "chapterSummary": "In JavaScript, functions are **first-class citizens**: they can be passed as arguments, assigned to variables, and returned from other functions.\n\nA **closure** is the combination of a function bundled together with references to its surrounding state (**the lexical environment**). In JavaScript, every function automatically retains a hidden `[[Scopes]]` reference to the scope in which it was declared, preserving those variables even after the outer function has finished executing!",
    "deepDive": {
      "title": "V8 Context Allocation (Context vs Heap)",
      "content": "V8 inspects ASTs to detect which variables are closed over. Variables accessed by closures are migrated from register/stack allocation into a heap-allocated `Context` object shared by all closures in that scope.",
      "codeSnippet": "// V8 allocates: Context { scope_bindings, outer_context }"
    },
    "takeaways": [
      "Closures capture the lexical environment where the function was declared.",
      "Closures enable private variables and data encapsulation (Module Pattern).",
      "Use let in for-loops to ensure per-iteration block scoping.",
      "Deregister event listeners to avoid leaking memory retained by closures."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Lexical Environment & Closure Retention",
        "content": "When a function executes, the V8 engine creates an **Execution Context** containing an **Environment Record**. When an inner function references variables from an outer function, the engine stores those variables on the heap rather than discarding them when the outer function returns.\n\nThis enables clean private encapsulation: the inner function retains private access to the state, with zero global namespace pollution.",
        "codeSnippet": "function createBankAccount(initialBalance) {\n    let balance = initialBalance; // Private enclosed state!\n\n    return {\n        deposit(amount) {\n            balance += amount;\n            return balance;\n        },\n        getBalance() {\n            return balance;\n        }\n    };\n}\n\nconst account = createBankAccount(100);\naccount.deposit(50);\nconsole.log(account.getBalance()); // 150\n// console.log(account.balance);  // undefined! Truly private.",
        "sandboxCode": "function multiplier(factor) {\n    return function(number) {\n        return number * factor;\n    };\n}\n\nconst double = multiplier(2);\nconst triple = multiplier(3);\n\nconsole.log(\"double(5):\", double(5));\nconsole.log(\"triple(5):\", triple(5));"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Classic var in for-loop Trap",
        "prompt": "What will be printed to console when the timeouts execute in `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);`?",
        "codeSnippet": "for (var i = 0; i < 3; i++) {\n    setTimeout(() => console.log(i), 0);\n}",
        "options": [
          {
            "text": "3, 3, 3 (because var is function-scoped, and all callbacks reference the single shared loop variable)",
            "isCorrect": true,
            "feedback": "🎯 Correct! var has no block scope. By the time the asynchronous callbacks run on the event loop, the loop has completed and i equals 3."
          },
          {
            "text": "0, 1, 2",
            "isCorrect": false,
            "feedback": "This only happens if let is used, because let creates a new binding for each iteration."
          },
          {
            "text": "undefined, undefined, undefined",
            "isCorrect": false,
            "feedback": "i remains in scope and holds the value 3."
          },
          {
            "text": "An asynchronous ReferenceError is thrown",
            "isCorrect": false,
            "feedback": "i is fully accessible in the enclosing function/global scope."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Accidental Memory Leaks via Closures in Event Handlers",
        "content": "If a closure attaches to a DOM element or global event emitter, it retains its entire enclosing lexical scope in memory. If that scope contains large arrays or objects, those objects can **never be garbage collected** as long as the listener is attached!",
        "codeSnippet": "// ❌ MEMORY LEAK: Retains huge_data in memory indefinitely:\nfunction setupListener() {\n    const huge_data = new Array(1000000).fill(\"payload\");\n    window.addEventListener(\"resize\", () => {\n        // Closure retains huge_data even if not explicitly used!\n        console.log(\"Resized\");\n    });\n}",
        "tip": "Hacker Rule: Always call removeEventListener() or use AbortController signals to free event listeners.",
        "arenaTarget": "game.html?lang=javascript&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "js-les-003",
    "language": "javascript",
    "difficulty": "intermediate",
    "topic": "Prototypes & Inheritance",
    "title": "Chapter 3: Prototypal Inheritance & The Prototype Chain",
    "tagline": "Understand [[Prototype]], __proto__, Object.create(), and how ES6 classes work under the hood.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand prototypal inheritance vs classical object-oriented inheritance",
      "Trace the [[Prototype]] chain from instances up to Object.prototype and null",
      "Distinguish between Function.prototype (template) and Object.__proto__ (link)",
      "Understand why ES6 class syntax is purely syntactic sugar over prototypes"
    ],
    "chapterSummary": "Unlike Java or C++, which implement classical inheritance based on rigid class blueprints, JavaScript is fundamentally built on **Prototypal Inheritance**.\n\nIn JavaScript, objects inherit directly from other objects! Every object possesses a private internal link (`[[Prototype]]`) pointing to a prototype object. When an attribute or method is accessed, the JavaScript engine traverses up the **Prototype Chain** until it finds the property or hits `null`.",
    "deepDive": {
      "title": "V8 Hidden Classes (Maps) and Shapes",
      "content": "To achieve near-C++ speed, the V8 engine dynamically constructs internal **Hidden Classes (Shapes)**. Objects with the same properties in the same order share a shape. Adding properties dynamically changes the shape, causing polymorphic inline cache misses.",
      "codeSnippet": "// Always initialize all object properties in constructor in identical order!"
    },
    "takeaways": [
      "JavaScript objects inherit directly from other objects via the prototype chain.",
      "ES6 class and extends syntax is syntactic sugar over prototypal inheritance.",
      "Assigning a property creates an own property, shadowing prototype properties.",
      "Sanitize user keys to defend against critical Prototype Pollution exploits."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The [[Prototype]] Chain & Property Shadowing",
        "content": "When accessing `obj.prop`:\n1. The engine checks if `prop` exists directly on `obj` (**own property**).\n2. If not, it inspects `obj.[[Prototype]]`.\n3. It continues traversing up the chain until reaching `Object.prototype`.\n4. If still not found, it checks `Object.prototype.[[Prototype]]` (which is `null`) and returns `undefined`.\n\nSetting `obj.prop = value` creates an own property on `obj`, **shadowing** any prototype property of the same name without mutating the prototype.",
        "codeSnippet": "const animal = {\n    alive: true,\n    eat() { return \"Nom nom\"; }\n};\n\n// rabbit inherits directly from animal:\nconst rabbit = Object.create(animal);\nrabbit.jumps = true;\n\nconsole.log(rabbit.jumps); // true (own property)\nconsole.log(rabbit.alive); // true (inherited via prototype chain!)\nconsole.log(Object.getPrototypeOf(rabbit) === animal); // true",
        "sandboxCode": "function Hero(name) {\n    this.name = name;\n}\nHero.prototype.attack = function() {\n    return this.name + \" strikes with laser blade!\";\n};\n\nconst h = new Hero(\"CyberNinja\");\nconsole.log(h.attack());\nconsole.log(\"h has own property 'attack'?\", h.hasOwnProperty(\"attack\"));\nconsole.log(\"Hero.prototype has 'attack'?\", Hero.prototype.hasOwnProperty(\"attack\"));"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Prototype Pollution Vulnerability",
        "prompt": "What security vulnerability occurs when an application recursively merges user-supplied JSON into existing objects without sanitizing keys like `__proto__`?",
        "codeSnippet": "// Attacker payload:\n// JSON.parse('{\"__proto__\": {\"isAdmin\": true}}')",
        "options": [
          {
            "text": "Prototype Pollution: It modifies Object.prototype, injecting properties across EVERY object in the entire Node.js runtime",
            "isCorrect": true,
            "feedback": "🎯 Correct! Modifying Object.prototype poisons all objects in memory, allowing attackers to bypass authentication or achieve remote code execution."
          },
          {
            "text": "A syntax error during JSON parsing",
            "isCorrect": false,
            "feedback": "__proto__ is valid JSON key syntax."
          },
          {
            "text": "A StackOverflow memory crash",
            "isCorrect": false,
            "feedback": "No recursion crash occurs; global object prototype is mutated."
          },
          {
            "text": "The browser forces a page reload",
            "isCorrect": false,
            "feedback": "Prototype pollution is a silent in-memory state compromise."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Mutating Prototype Objects In-Place",
        "content": "Mutating a prototype object (e.g. `Array.prototype.custom = ...`) poisons the runtime environment, breaks third-party libraries, and de-optimizes V8 hidden classes across all objects sharing that prototype!",
        "codeSnippet": "// ❌ BAD PRACTICE (Monkey-patching built-ins):\nArray.prototype.first = function() { return this[0]; };\n\n// ✅ SAFE: Use standalone utility functions:\nfunction first(arr) { return arr[0]; }",
        "tip": "Hacker Rule: Never modify built-in prototypes; prevent Prototype Pollution using Object.create(null) or Map.",
        "arenaTarget": "game.html?lang=javascript&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "js-les-004",
    "language": "javascript",
    "difficulty": "expert",
    "topic": "Event Loop & Asynchrony",
    "title": "Chapter 4: The V8 Event Loop, Microtasks & Macrotasks",
    "tagline": "Master the call stack, Promise microtask queue, macrotask starvation, and render ticks.",
    "estimatedMinutes": 8,
    "objectives": [
      "Master the single-threaded V8 execution model and Call Stack mechanics",
      "Differentiate between Microtasks (Promises, queueMicrotask) and Macrotasks (setTimeout, I/O)",
      "Understand the execution priority order: Stack -> Microtask Queue -> Render -> Macrotask Queue",
      "Prevent event loop starvation caused by infinite microtask loops"
    ],
    "chapterSummary": "JavaScript is single-threaded: it has exactly **one Call Stack** and can execute only one instruction at any given instant. Yet, Node.js and browser applications handle tens of thousands of concurrent network connections, database queries, and UI animations smoothly.\n\nThis non-blocking throughput is orchestrated by the **Event Loop** (implemented by libuv in Node.js and the browser execution environment). Mastering the exact priority ordering between the Call Stack, the **Microtask Queue**, and the **Macrotask Queue** is essential for high-performance JavaScript engineering.",
    "deepDive": {
      "title": "Node.js process.nextTick Priority",
      "content": "In Node.js, `process.nextTick()` maintains its own higher-priority queue that executes **even before standard Promise microtasks** at the end of each tick!",
      "codeSnippet": "// Priority: process.nextTick > Promise.then > setTimeout"
    },
    "takeaways": [
      "JavaScript is single-threaded; asynchronous operations are scheduled via the Event Loop.",
      "Synchronous call stack code always executes first.",
      "The Microtask queue (Promises) drains completely before the next Macrotask runs.",
      "Avoid infinite microtask chaining to prevent freezing the UI thread."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Execution Order: Stack -> Microtasks -> Macrotasks",
        "content": "The Event Loop follows a strict algorithmic cycle:\n1. **Call Stack**: Executes synchronous code until the stack is completely empty.\n2. **Microtask Queue**: Drains ALL microtasks (`Promise.then`, `queueMicrotask`, `process.nextTick`) until the queue is completely empty!\n3. **Render Phase**: (In browsers) Paints DOM updates if display refresh is due.\n4. **Macrotask Queue**: Picks and executes **one** macrotask (`setTimeout`, `setInterval`, I/O), then immediately checks the Microtask Queue again!",
        "codeSnippet": "console.log(\"1. Sync Start\");\n\nsetTimeout(() => {\n    console.log(\"4. Macrotask (setTimeout)\");\n}, 0);\n\nPromise.resolve().then(() => {\n    console.log(\"3. Microtask (Promise)\");\n});\n\nconsole.log(\"2. Sync End\");\n// Output order: 1, 2, 3, 4!",
        "sandboxCode": "console.log(\"A: Synchronous\");\n\nsetTimeout(() => console.log(\"B: Timeout (Macrotask)\"), 0);\n\nqueueMicrotask(() => console.log(\"C: Microtask 1\"));\nPromise.resolve().then(() => console.log(\"D: Microtask 2\"));\n\nconsole.log(\"E: Synchronous End\");"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Event Loop Execution Output Predictor",
        "prompt": "Review the snippet below. What is the exact sequence of numbers printed?",
        "codeSnippet": "console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3)).then(() => console.log(4));\nconsole.log(5);",
        "options": [
          {
            "text": "1, 5, 3, 4, 2",
            "isCorrect": true,
            "feedback": "🎯 Correct! Synchronous code runs first (1, 5). Then the Microtask Queue is drained completely (3, followed by chained 4). Finally, the Macrotask Queue executes the timeout callback (2)."
          },
          {
            "text": "1, 2, 3, 4, 5",
            "isCorrect": false,
            "feedback": "setTimeout is deferred to the macrotask queue; it cannot run synchronously."
          },
          {
            "text": "1, 5, 2, 3, 4",
            "isCorrect": false,
            "feedback": "Microtasks always have higher priority than macrotasks; 3 and 4 run before 2."
          },
          {
            "text": "1, 3, 4, 5, 2",
            "isCorrect": false,
            "feedback": "Synchronous console.log(5) runs before any microtasks are processed."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Microtask Queue Starvation",
        "content": "Because the Event Loop drains the Microtask Queue **completely** before executing any macrotasks or repainting the UI, continuously queuing microtasks (e.g. recursive `queueMicrotask`) starves the event loop, freezing the browser and preventing all UI clicks, rendering, and timeouts from ever executing!",
        "codeSnippet": "// ❌ FATAL EVENT LOOP FREEZE (Starvation):\nfunction infiniteMicrotasks() {\n    queueMicrotask(infiniteMicrotasks); // Never yields to browser render or macrotasks!\n}\n// infiniteMicrotasks(); // Freezes page instantly!",
        "tip": "Hacker Rule: Use setTimeout(fn, 0) or setImmediate() when you need to yield control back to the event loop.",
        "arenaTarget": "game.html?lang=javascript&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "js-les-005",
    "language": "javascript",
    "difficulty": "expert",
    "topic": "The this Keyword Binding",
    "title": "Chapter 5: Execution Contexts & The this Keyword Binding",
    "tagline": "Master the 4 binding rules: Default, Implicit, Explicit, and Arrow function lexical scoping.",
    "estimatedMinutes": 8,
    "objectives": [
      "Master the 4 execution binding rules governing the this keyword in JavaScript",
      "Understand how call(), apply(), and bind() explicitly assign execution context",
      "Understand why Arrow Functions possess no this of their own (lexical inheritance)",
      "Fix losing this context when passing object methods as callbacks"
    ],
    "chapterSummary": "Few topics in JavaScript generate as much confusion and bugs as the `this` keyword. In Java or C++, `this` strictly refers to the current instance of the class enclosing the code.\n\nIn JavaScript, however, **`this` is not determined where a function is declared, but HOW it is invoked!** Every standard function invocation binds `this` dynamically based on four well-defined precedence rules.",
    "deepDive": {
      "title": "Hard Binding with Function.prototype.bind",
      "content": "`fn.bind(target)` returns an exotic bound function wrapper that permanently locks `this` to `target`. Even calling `boundFn.call(otherObj)` cannot override a hard-bound context!",
      "codeSnippet": "const locked = user.greet.bind(user);\nlocked.call({ name: \"Intruder\" }); // Still prints \"Adept\"!"
    },
    "takeaways": [
      "this is determined by how a function is called, not where it is written.",
      "Precedence: new > explicit (bind/call) > implicit (obj.method) > default.",
      "Arrow functions have no this; they capture this lexically from outer scope.",
      "Never define object methods using arrow functions."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The 4 Binding Rules of this",
        "content": "When a standard function executes, `this` is resolved in priority order:\n1. **new Binding**: `new Foo()` binds `this` to the newly created instance.\n2. **Explicit Binding**: `foo.call(obj)`, `foo.apply(obj)`, or `foo.bind(obj)` explicitly sets `this` to `obj`.\n3. **Implicit Binding**: `obj.foo()` binds `this` to the context object preceding the dot.\n4. **Default Binding**: `foo()` standalone call binds to the global object (or `undefined` in `\"use strict\"`).",
        "codeSnippet": "const user = {\n    name: \"Adept\",\n    greet() {\n        console.log(\"Hello, \" + this.name);\n    }\n};\n\nuser.greet(); // Implicit binding -> \"Hello, Adept\"\n\nconst detached = user.greet;\n// detached(); // Default binding: this is undefined in strict mode!",
        "sandboxCode": "const bot = {\n    name: \"CyberSentinel\",\n    // Arrow function captures this lexically from outer scope:\n    pingArrow: () => \"Ping from \" + (typeof this !== 'undefined' ? this.name : 'lexical'),\n    // Regular function uses dynamic binding:\n    pingRegular() { return \"Ping from \" + this.name; }\n};\n\nconsole.log(bot.pingRegular());\nconst bound = bot.pingRegular.bind({ name: \"OverriddenContext\" });\nconsole.log(bound());"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Losing Context in Event Callbacks",
        "prompt": "Why does passing `setTimeout(user.greet, 100)` print `Hello, undefined` instead of the user name?",
        "codeSnippet": "const user = {\n    name: \"Alice\",\n    greet() { console.log(\"Hello, \" + this.name); }\n};\nsetTimeout(user.greet, 100);",
        "options": [
          {
            "text": "user.greet extracts a reference to the function without its object context; when executed by setTimeout, it falls back to Default Binding",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Passing user.greet as an argument passes only the raw function pointer. When invoked later, it has no preceding dot context, resolving this to undefined (or window)."
          },
          {
            "text": "Because setTimeout only accepts arrow functions",
            "isCorrect": false,
            "feedback": "setTimeout accepts any callable function."
          },
          {
            "text": "Because user.name is garbage collected",
            "isCorrect": false,
            "feedback": "user.name remains alive in memory."
          },
          {
            "text": "Because greet() is an asynchronous generator",
            "isCorrect": false,
            "feedback": "greet is a standard synchronous method."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Arrow Functions as Object Methods",
        "content": "Because arrow functions do not have their own `this`, defining an object method as an arrow function binds `this` to the **enclosing lexical scope** (typically the global `window` or module object), NOT the object itself!",
        "codeSnippet": "// ❌ DEFECT: Arrow function method:\nconst profile = {\n    username: \"Neo\",\n    sayHi: () => console.log(this.username) // this is window/global! Prints undefined!\n};\n\n// ✅ IDIOMATIC FIX: Use standard method syntax:\nconst profile_fixed = {\n    username: \"Neo\",\n    sayHi() { console.log(this.username); }\n};",
        "tip": "Hacker Rule: Use regular method syntax for object methods; use arrow functions inside callbacks to retain lexical this.",
        "arenaTarget": "game.html?lang=javascript&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "rust-les-001",
    "language": "rust",
    "difficulty": "beginner",
    "topic": "Immutability & Shadowing",
    "title": "Chapter 1: Immutability, Variable Shadowing & The Stack",
    "tagline": "Master Rust default immutability guarantees, let mut, and variable shadowing on the stack.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand why Rust enforces immutability by default for thread safety",
      "Master explicit mutability with the mut keyword",
      "Understand variable shadowing and re-binding variables with distinct types",
      "Contrast Rust stack allocations with heap allocations (String, Vec)"
    ],
    "chapterSummary": "Most programming languages make variables mutable by default. Rust inverts this paradigm: in Rust, **variables are immutable by default**.\n\nBy forcing developers to explicitly opt-in to mutability via `let mut`, the Rust compiler prevents accidental state mutation and lays the groundwork for fearless concurrency. Rust also introduces **Variable Shadowing**: redeclaring a variable with `let` to transform values without mutating original state or inventing awkward temporary variable names.",
    "deepDive": {
      "title": "Zero-Cost Abstractions Philosophy",
      "content": "Bjarne Stroustrup and Rust maintain the same zero-cost abstraction philosophy: *\"What you don't use, you don't pay for. What you do use, you couldn't hand-code any better.\"* Rust's immutability checks happen entirely in the compiler; compiled assembly contains zero runtime overhead.",
      "codeSnippet": "// Compiled machine code uses standard CPU registers with zero runtime checks."
    },
    "takeaways": [
      "Variables are immutable by default; use let mut for explicit mutability.",
      "Variable shadowing allows re-binding the same name with a different type.",
      "mut allows changing values, but the type remains strictly invariant.",
      "Immutability guarantees are verified at compile time with zero runtime overhead."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Default Immutability & The Power of Shadowing",
        "content": "When you write `let x = 5;`, the value cannot be modified. If you need mutation, you declare `let mut x = 5;`.\n\nHowever, **Variable Shadowing** (`let x = x + 1;`) is distinct from mutability:\n1. It creates a brand-new variable on the stack with the same name.\n2. It allows you to **change the type** of the variable (e.g. converting a string input into an integer) while keeping the variable immutable!",
        "codeSnippet": "fn main() {\n    let spaces = \"   \"; // &str\n    let spaces = spaces.len(); // usize (Shadowed with a new type!)\n    println!(\"Spaces count: {}\", spaces); // 3\n\n    let mut count = 10;\n    count += 5; // Valid because count is declared mut\n    println!(\"Count: {}\", count);\n}",
        "sandboxCode": "fn main() {\n    let x = 5;\n    let x = x * 2; // Shadowing\n    {\n        let x = x + 10; // Inner scope shadowing\n        println!(\"Inner x: {}\", x); // 20\n    }\n    println!(\"Outer x: {}\", x); // 10\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Shadowing vs mut Difference",
        "prompt": "Why does `let mut spaces = \"   \"; spaces = spaces.len();` fail to compile in Rust?",
        "codeSnippet": "let mut spaces = \"   \";\n// spaces = spaces.len(); // Compiler error!",
        "options": [
          {
            "text": "mut permits mutating the value, but NOT changing the variable's type; spaces remains &str, so assigning usize is a compile-time type mismatch",
            "isCorrect": true,
            "feedback": "🎯 Exactly! mut allows value reassignment, but the type is permanently fixed. Shadowing with let is required to re-bind a variable name to a new type."
          },
          {
            "text": "len() is an invalid method on string slices",
            "isCorrect": false,
            "feedback": "len() is valid on &str."
          },
          {
            "text": "spaces is a reserved keyword in Rust",
            "isCorrect": false,
            "feedback": "spaces is a normal identifier."
          },
          {
            "text": "usize cannot be assigned to stack variables",
            "isCorrect": false,
            "feedback": "usize is a standard primitive integer type."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Accidental Shadowing Hiding Outer State",
        "content": "Accidentally placing a `let` keyword inside an inner conditional block shadows the outer variable instead of updating it, leaving the outer variable unchanged upon block exit!",
        "codeSnippet": "// ❌ DEFECT (Accidental shadowing leaves status false):\nlet mut status = false;\nif true {\n    let status = true; // Shadows! Does NOT mutate outer status!\n}\nprintln!(\"{}\", status); // Still false!\n\n// ✅ FIX (Reassign without let):\nif true { status = true; }",
        "tip": "Hacker Rule: Use let only when creating a new variable or intentionally shadowing; omit let when reassigning a mut variable.",
        "arenaTarget": "game.html?lang=rust&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "rust-les-002",
    "language": "rust",
    "difficulty": "beginner",
    "topic": "Ownership & Move Semantics",
    "title": "Chapter 2: The Core Ownership Model & Move Semantics",
    "tagline": "Master the 3 ownership rules that guarantee memory safety without a garbage collector.",
    "estimatedMinutes": 7,
    "objectives": [
      "Master the 3 Fundamental Rules of Ownership in the Rust language",
      "Understand Move Semantics and how assigning transfers ownership of heap allocations",
      "Differentiate between Copy types (primitives on stack) vs Move types (heap resources)",
      "Understand the Drop trait and deterministic resource deallocation"
    ],
    "chapterSummary": "All programming languages must manage heap memory. Some (C, C++) require manual allocation and freeing, risking segfaults and security vulnerabilities. Others (Java, Go, Python) use a runtime Garbage Collector, trading memory overhead and pause latency for safety.\n\nRust introduces a groundbreaking third path: **The Ownership System**. Memory is managed through a set of compiler-verified rules that guarantee memory safety and thread safety at compile time with **zero garbage collection overhead**!",
    "deepDive": {
      "title": "The Drop Trait Internals",
      "content": "When an owner exits scope, the compiler inserts a call to `Drop::drop(&mut self)`. This automatically recurses through all child fields, freeing heap buffers, closing file descriptors, and releasing mutex locks deterministically.",
      "codeSnippet": "struct Custom { name: String }\nimpl Drop for Custom {\n    fn drop(&mut self) { println!(\"Dropping {}\", self.name); }\n}"
    },
    "takeaways": [
      "Every value has exactly one owner at any time.",
      "Assignment moves ownership of heap values, invalidating the source variable.",
      "Types stored entirely on the stack (primitives) implement Copy.",
      "When the owner goes out of scope, Rust calls drop() automatically."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Three Rules of Ownership & Move Semantics",
        "content": "The 3 Commandments of Rust:\n1. **Each value in Rust has an owner** (a variable).\n2. **There can only be one owner at a time**.\n3. **When the owner goes out of scope, the value is dropped** automatically.\n\nWhen assigning a heap-allocated type (like `String`) to a new variable (`s2 = s1`), Rust does NOT copy the heap data. It **moves ownership** to `s2` and **invalidates `s1`**!",
        "codeSnippet": "fn main() {\n    let s1 = String::from(\"Rust Ownership\");\n    let s2 = s1; // Ownership MOVED to s2! s1 is invalidated.\n\n    // println!(\"{}\", s1); // Compiler Error: borrow of moved value!\n    println!(\"s2 owns the data: {}\", s2);\n} // s2 goes out of scope -> memory freed via Drop!",
        "sandboxCode": "fn main() {\n    let s = String::from(\"Hello Cyber\");\n    take_ownership(s);\n    // s is now invalid!\n\n    let x = 42;\n    makes_copy(x);\n    println!(\"x is still valid: {}\", x); // Primitives implement Copy!\n}\n\nfn take_ownership(str: String) { println!(\"Received: {}\", str); }\nfn makes_copy(num: i32) { println!(\"Copied: {}\", num); }"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Copy Trait vs Move Trait",
        "prompt": "Why does `let y = x; println!(\"{}\", x);` compile cleanly when x is an integer, but fails when x is a String?",
        "codeSnippet": "let x = 5;\nlet y = x;\nprintln!(\"{}\", x); // Compiles!\n\nlet s1 = String::from(\"text\");\nlet s2 = s1;\n// println!(\"{}\", s1); // Fails!",
        "options": [
          {
            "text": "Primitive types stored entirely on the stack implement the Copy trait; complex heap types like String implement Move semantics",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Types with known sizes stored on the stack (integers, floats, booleans) implement Copy. Heap types manage external resources and Move by default to prevent double-free bugs."
          },
          {
            "text": "Integers are automatically converted to global constants",
            "isCorrect": false,
            "feedback": "Integers are standard local stack values."
          },
          {
            "text": "String is deprecated in modern Rust",
            "isCorrect": false,
            "feedback": "String is the standard growable UTF-8 string container."
          },
          {
            "text": "println! cannot print Strings",
            "isCorrect": false,
            "feedback": "println! supports String via the Display trait."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Passing Arguments into Functions Moves Ownership",
        "content": "Passing a heap variable into a function moves ownership into the function's parameter. When the function returns, the parameter is dropped, leaving the caller unable to use the original variable unless references are used!",
        "codeSnippet": "// ❌ SURPRISING MOVE:\nlet data = String::from(\"payload\");\nprocess(data);\n// data is gone! Cannot use data anymore!\n\n// ✅ IDIOMATIC FIX: Borrow with a reference instead:\nprocess_borrow(&data); // Borrows without taking ownership!",
        "tip": "Hacker Rule: Borrow (&T) by default; only take ownership (T) when the function genuinely stores or consumes the value.",
        "arenaTarget": "game.html?lang=rust&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "rust-les-003",
    "language": "rust",
    "difficulty": "intermediate",
    "topic": "The Borrow Checker",
    "title": "Chapter 3: The Borrow Checker: Shared vs Mutable References",
    "tagline": "Master the Aliasing XOR Mutability rule and write race-free concurrent code.",
    "estimatedMinutes": 8,
    "objectives": [
      "Master the Golden Rule of Borrowing: Aliasing XOR Mutability",
      "Differentiate between immutable shared borrows (&T) and unique mutable borrows (&mut T)",
      "Understand Non-Lexical Lifetimes (NLL) and compiler borrow scopes",
      "Prevent data races and iterator invalidation at compile time"
    ],
    "chapterSummary": "If every function required taking full ownership of variables, programming in Rust would be excruciating: you would have to pass objects into functions and explicitly return them back just to read their fields.\n\nRust solves this through **Borrowing**: creating references (`&T` and `&mut T`) that point to data without taking ownership. To prevent data races and memory corruption, the compiler enforces the **Borrow Checker** at compile time.",
    "deepDive": {
      "title": "Non-Lexical Lifetimes (NLL)",
      "content": "Historically, a borrow lasted until the closing curly brace `}` of its enclosing scope. Rust introduced **Non-Lexical Lifetimes (NLL)**: a borrow ends immediately after its **last actual usage**, making borrowing far more intuitive.",
      "codeSnippet": "let mut x = 10;\nlet r = &x;\nprintln!(\"{}\", r); // r's lifetime ends here!\nlet m = &mut x;   // Valid under NLL!"
    },
    "takeaways": [
      "You can have any number of &T, OR exactly one &mut T, but never both simultaneously.",
      "References do not take ownership; they borrow access to data.",
      "Rust eliminates iterator invalidation and data races at compile time.",
      "Non-Lexical Lifetimes end a borrow immediately after its last usage."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Golden Rule: Aliasing XOR Mutability",
        "content": "At any given point in your program, for any piece of data, you may have:\n- **Any number of immutable references (`&T`)** (readers), OR\n- **Exactly one mutable reference (`&mut T`)** (writer),\n- **BUT NEVER BOTH AT THE SAME TIME!**\n\nIf you have a mutable reference, no one else can read or write. If you have immutable references, anyone can read, but no one can modify. This compile-time rule renders **data races mathematically impossible**!",
        "codeSnippet": "fn main() {\n    let mut data = String::from(\"Cyber\");\n\n    let r1 = &data; // Shared borrow\n    let r2 = &data; // Another shared borrow\n    println!(\"{} and {}\", r1, r2); // Valid!\n\n    // Under NLL, r1 and r2 are no longer used here.\n    let m = &mut data; // Mutable borrow is now legal!\n    m.push_str(\"Arena\");\n    println!(\"Updated: {}\", m);\n}",
        "sandboxCode": "fn main() {\n    let mut numbers = vec![1, 2, 3];\n    // Borrow immutably to read:\n    print_length(&numbers);\n\n    // Borrow mutably to add element:\n    append_number(&mut numbers, 4);\n    print_length(&numbers);\n}\n\nfn print_length(v: &Vec<i32>) { println!(\"Length: {}\", v.len()); }\nfn append_number(v: &mut Vec<i32>, val: i32) { v.push(val); }"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Iterator Invalidation Prevention",
        "prompt": "Why does modifying a vector inside a for-loop iterating over that same vector fail to compile in Rust?",
        "codeSnippet": "let mut vec = vec![1, 2, 3];\nfor item in &vec {\n    // vec.push(99); // Compiler Error!\n}",
        "options": [
          {
            "text": "The for-loop creates an immutable borrow (&vec); calling vec.push requires a mutable borrow (&mut vec), violating Aliasing XOR Mutability",
            "isCorrect": true,
            "feedback": "🎯 Correct! In C++, modifying a vector while iterating causes undefined iterator invalidation. Rust's borrow checker detects and prevents this bug at compile time!"
          },
          {
            "text": "Vectors cannot hold more than 3 elements",
            "isCorrect": false,
            "feedback": "Vectors are dynamically resizable heap arrays."
          },
          {
            "text": "push() is an asynchronous method",
            "isCorrect": false,
            "feedback": "push() is a standard synchronous method."
          },
          {
            "text": "for-loops cannot iterate over vectors",
            "isCorrect": false,
            "feedback": "&vec is standard iterable syntax."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Simultaneous Mutable and Immutable Borrows",
        "content": "Attempting to hold a shared reference while mutating through another reference triggers a compile-time error. In multithreaded systems, this prevents reading partially-written memory.",
        "codeSnippet": "// ❌ COMPILER ERROR (Data race prevention):\nlet mut s = String::from(\"hello\");\nlet r1 = &s;\nlet r2 = &mut s; // Error: cannot borrow as mutable because it is also borrowed as immutable!\nprintln!(\"{}, {}\", r1, r2);",
        "tip": "Hacker Rule: Keep borrow scopes as narrow as possible so mutable borrows can proceed smoothly.",
        "arenaTarget": "game.html?lang=rust&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "rust-les-004",
    "language": "rust",
    "difficulty": "expert",
    "topic": "Lifetimes & References",
    "title": "Chapter 4: Lifetime Annotations & Dangling Pointer Prevention",
    "tagline": "Master generic lifetime parameters ('a) and eliminate dangling references forever.",
    "estimatedMinutes": 8,
    "objectives": [
      "Understand what a Lifetime is in the Rust compiler (the scope for which a reference is valid)",
      "Master the syntax of generic lifetime annotations ('a, 'b)",
      "Understand the three Lifetime Elision Rules applied automatically by the compiler",
      "Prevent dangling pointers when structs store reference fields"
    ],
    "chapterSummary": "In C and C++, the most notorious security flaw is the **Dangling Pointer**: a pointer referencing memory that has already been deallocated on the stack or freed on the heap.\n\nRust guarantees that dangling references can **never exist**. Every reference in Rust possesses a **Lifetime** (`'a`)—the span of code for which the underlying borrowed value remains valid. When the compiler cannot infer the relationship between input and output references, developers provide **Lifetime Annotations**.",
    "deepDive": {
      "title": "The 'static Lifetime",
      "content": "The special lifetime `'static` indicates that the data lives for the **entire duration of the program**. All string literals (`\"hello\"`) possess `'static` lifetime because they are baked directly into the binary's read-only data segment.",
      "codeSnippet": "let banner: &'static str = \"SYNTAX ARENA SYSTEM ACTIVE\";"
    },
    "takeaways": [
      "Lifetimes describe how long a reference is valid; they do not alter runtime durations.",
      "Lifetime elision rules allow omitting annotations in common function signatures.",
      "Rust guarantees that dangling references are impossible at compile time.",
      "String literals have 'static lifetime baked into the executable binary."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Lifetime Annotations: Ensuring References Outlive Data",
        "content": "Lifetime annotations do NOT change how long any value lives. Instead, they **inform the borrow checker of the relationship** between multiple references.\n\nIn `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str`, the annotation tells Rust: *\"The returned reference will be valid for whichever input reference has the shorter lifetime.\"*",
        "codeSnippet": "// Annotating that returned reference lives as long as the inputs:\nfn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}\n\nfn main() {\n    let string1 = String::from(\"long string\");\n    let string2 = \"xyz\";\n    let result = longest(string1.as_str(), string2);\n    println!(\"Longest: {}\", result);\n}",
        "sandboxCode": "fn main() {\n    let valid = \"Static Lifetime String\";\n    println!(\"Length: {}\", get_len(valid));\n}\n\nfn get_len(s: &str) -> usize {\n    s.len() // Lifetime elided automatically by compiler rules!\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Dangling Reference Compile Check",
        "prompt": "Why does returning a reference to a locally instantiated String fail to compile with a lifetime error?",
        "codeSnippet": "// fn bad_dangling() -> &String {\n//     let s = String::from(\"test\");\n//     &s // Compiler Error!\n// }",
        "options": [
          {
            "text": "s is dropped when the function scope ends; returning &s would create a dangling reference to deallocated stack/heap memory",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Local variable s is dropped at the end of bad_dangling. Rust prevents returning references to dropped data. Return String by value instead."
          },
          {
            "text": "String references must always be mutable",
            "isCorrect": false,
            "feedback": "Immutable references are standard."
          },
          {
            "text": "Rust requires all functions to accept at least one argument",
            "isCorrect": false,
            "feedback": "Functions can take zero arguments."
          },
          {
            "text": "The compiler needs a 'static annotation to return references",
            "isCorrect": false,
            "feedback": "Marking a local variable 'static is impossible because it does not live for the entire program."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Structs Holding References Without Lifetimes",
        "content": "If a struct stores references instead of owned values, it must declare a lifetime annotation. This ensures the struct **cannot outlive the data it borrows**!",
        "codeSnippet": "// Struct borrows data and cannot outlive that data:\nstruct Excerpt<'a> {\n    part: &'a str,\n}\n\nlet text = String::from(\"Hello world\");\nlet ex = Excerpt { part: &text };",
        "tip": "Hacker Rule: Use owned types (String, Vec) in structs when you want the struct to own its data without lifetime complexity.",
        "arenaTarget": "game.html?lang=rust&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "rust-les-005",
    "language": "rust",
    "difficulty": "expert",
    "topic": "Interior Mutability & Concurrency",
    "title": "Chapter 5: Interior Mutability & Safe Thread Concurrency",
    "tagline": "Master RefCell, Arc, Mutex, and understand how the Send and Sync marker traits guarantee thread safety.",
    "estimatedMinutes": 8,
    "objectives": [
      "Understand Interior Mutability: mutating data behind an immutable reference (&T)",
      "Master RefCell<T> for single-threaded runtime borrow checking",
      "Master Arc<Mutex<T>> for safe multi-threaded shared mutable state",
      "Understand the Send and Sync marker traits and why Rust guarantees fearless concurrency"
    ],
    "chapterSummary": "Rust's compile-time borrow checker is intentionally conservative: if code might violate borrowing rules, the compiler rejects it. However, real-world systems patterns (mocking objects in tests, cyclic graph structures, multi-threaded caches) sometimes require mutating data through what appears to be an immutable reference.\n\nRust accommodates this safely through **Interior Mutability**. By moving borrow checking from compile-time to runtime (`RefCell`) or using hardware thread locks (`Mutex`), Rust provides controlled escape hatches that maintain absolute memory safety.",
    "deepDive": {
      "title": "Why Rc<T> is NOT Send or Sync",
      "content": "`Rc<T>` uses standard non-atomic increments (`ref_count++`). If shared across threads, CPU caches cause race conditions that corrupt reference counts. The compiler verifies this via `!Send` and `!Sync`, preventing you from ever passing `Rc` to another thread!",
      "codeSnippet": "// Compiler blocks thread::spawn(move || { let x = rc.clone(); });"
    },
    "takeaways": [
      "Interior mutability mutates data through an immutable reference safely.",
      "RefCell<T> checks borrow rules dynamically at runtime (panicking on violations).",
      "Use Arc<Mutex<T>> to safely share and mutate state across multiple threads.",
      "Send and Sync marker traits enable the compiler to mathematically prevent data races."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Interior Mutability with Arc<Mutex<T>>",
        "content": "For multi-threaded concurrency:\n- `Arc<T>` (Atomic Reference Counted): Safely shares ownership of an allocation across multiple threads.\n- `Mutex<T>` (Mutual Exclusion): Wraps data so only the thread holding the lock can access or mutate it.\n\nTogether, `Arc<Mutex<T>>` allows multiple threads to safely acquire exclusive locks and mutate shared state without data races!",
        "codeSnippet": "use std::sync::{Arc, Mutex};\nuse std::thread;\n\nfn main() {\n    let counter = Arc::new(Mutex::new(0));\n    let mut handles = vec![];\n\n    for _ in 0..5 {\n        let counter_clone = Arc::clone(&counter);\n        let handle = thread::spawn(move || {\n            let mut num = counter_clone.lock().unwrap();\n            *num += 1;\n        });\n        handles.push(handle);\n    }\n\n    for h in handles { h.join().unwrap(); }\n    println!(\"Final Count: {}\", *counter.lock().unwrap()); // 5!\n}",
        "sandboxCode": "use std::cell::RefCell;\n\nfn main() {\n    // Single-threaded interior mutability:\n    let data = RefCell::new(100);\n    {\n        let mut m = data.borrow_mut();\n        *m += 50;\n    } // borrow_mut released here!\n\n    println!(\"Value: {}\", *data.borrow());\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Send and Sync Marker Traits",
        "prompt": "In Rust's type system, what is the contract defined by the Sync marker trait?",
        "codeSnippet": "// unsafe impl<T: ?Sized> Sync for Mutex<T>",
        "options": [
          {
            "text": "A type T is Sync if and only if references to it (&T) can be safely shared across multiple threads simultaneously",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Send means ownership can transfer to another thread (T: Send). Sync means immutable references can be shared across threads (&T: Sync). T is Sync if &T is Send."
          },
          {
            "text": "It forces the type to serialize to JSON synchronously",
            "isCorrect": false,
            "feedback": "Sync is a concurrency marker trait, unrelated to serialization."
          },
          {
            "text": "It prevents the variable from being mutated on the stack",
            "isCorrect": false,
            "feedback": "Sync governs thread boundary sharing."
          },
          {
            "text": "It requires all methods to run on a background worker",
            "isCorrect": false,
            "feedback": "Marker traits are zero-sized compile-time verification types."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "RefCell Runtime Borrow Panic",
        "content": "`RefCell<T>` bypasses compile-time borrow checks by tracking borrows at runtime. If code attempts to create a mutable borrow while an active borrow is outstanding, `RefCell` **panics and crashes the thread** at runtime!",
        "codeSnippet": "// ❌ RUNTIME PANIC: Already borrowed: BorrowMutError:\nlet cell = RefCell::new(42);\nlet r = cell.borrow();\nlet mut m = cell.borrow_mut(); // Panics at runtime!",
        "tip": "Hacker Rule: Use try_borrow_mut() to gracefully handle contention without panicking.",
        "arenaTarget": "game.html?lang=rust&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "sql-les-001",
    "language": "sql",
    "difficulty": "beginner",
    "topic": "Relational Queries & Precedence",
    "title": "Chapter 1: Relational Query Lifecycle & Order of Execution",
    "tagline": "Master the logical query processing order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand declarative SQL vs procedural execution engines",
      "Master the strict Logical Query Processing Order in SQL databases",
      "Understand why column aliases declared in SELECT cannot be used in WHERE clauses",
      "Optimize query filter placement to leverage index scans early in execution"
    ],
    "chapterSummary": "SQL is a **declarative programming language**: developers specify *what* data they require, rather than writing procedural loops explaining *how* the computer must fetch it from disk. The database query optimizer compiles declarative SQL into an execution plan of relational algebra tree nodes.\n\nA fundamental point of confusion is the divergence between **Lexical Syntax Order** (how you type the query) and **Logical Execution Order** (how the database engine actually processes data).",
    "deepDive": {
      "title": "SQL Query Optimizer & Index Scans",
      "content": "Modern RDBMS engines (PostgreSQL, MySQL, SQLite) translate queries into relational algebra trees and use Cost-Based Optimizers (CBO). Wrapping an indexed column in a function (e.g. `WHERE YEAR(created_at) = 2026`) disables standard B-Tree index scans, forcing an expensive **Full Table Scan (Sequential Scan)**!",
      "codeSnippet": "-- ❌ Breaks index: WHERE YEAR(date) = 2026\n-- ✅ Uses B-Tree index: WHERE date >= '2026-01-01' AND date < '2027-01-01'"
    },
    "takeaways": [
      "Logical processing order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.",
      "Aliases defined in SELECT cannot be used in WHERE or GROUP BY.",
      "WHERE filters individual rows; HAVING filters aggregated groups.",
      "Avoid wrapping indexed columns in functions to prevent costly Full Table Scans."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Logical Query Processing Order",
        "content": "While a query begins lexically with `SELECT`, the database engine processes clauses in an entirely different sequence:\n1. **FROM / JOIN**: Identifies target tables and executes Cartesian joins.\n2. **WHERE**: Filters out individual non-matching rows.\n3. **GROUP BY**: Aggregates remaining rows into distinct buckets.\n4. **HAVING**: Filters aggregate groups.\n5. **SELECT**: Computes column expressions and aliases.\n6. **DISTINCT**: Deduplicates output rows.\n7. **ORDER BY**: Sorts the final result set.\n8. **LIMIT / OFFSET**: Discards rows for pagination.",
        "codeSnippet": "-- The engine processes FROM first, then WHERE, then GROUP BY:\nSELECT department, COUNT(*) AS emp_count\nFROM employees\nWHERE salary > 50000\nGROUP BY department\nHAVING COUNT(*) >= 5\nORDER BY emp_count DESC\nLIMIT 10;",
        "sandboxCode": "-- Mock SQL execution:\nSELECT name, score \nFROM players \nWHERE score >= 100 \nORDER BY score DESC;"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The WHERE Clause Alias Trap",
        "prompt": "Why does `SELECT salary * 12 AS annual_pay FROM emp WHERE annual_pay > 100000;` fail with a column not found error?",
        "codeSnippet": "SELECT salary * 12 AS annual_pay\nFROM employees\nWHERE annual_pay > 100000; -- Syntax / Evaluation Error!",
        "options": [
          {
            "text": "WHERE is evaluated before SELECT in the logical processing pipeline, so the alias annual_pay does not exist yet when WHERE filters rows",
            "isCorrect": true,
            "feedback": "🎯 Exactly! The database evaluates FROM, then WHERE, then SELECT. When WHERE is evaluated, annual_pay has not been computed or aliased yet. Repeat the formula in WHERE or use a CTE."
          },
          {
            "text": "Mathematical multiplication is not supported in SELECT",
            "isCorrect": false,
            "feedback": "salary * 12 is valid arithmetic."
          },
          {
            "text": "AS is only permitted on table names, not column names",
            "isCorrect": false,
            "feedback": "AS is standard for column aliasing."
          },
          {
            "text": "annual_pay is a reserved SQL keyword",
            "isCorrect": false,
            "feedback": "annual_pay is a standard custom identifier."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Filtering Aggregates in WHERE Instead of HAVING",
        "content": "Attempting to filter aggregate functions inside the `WHERE` clause (e.g. `WHERE COUNT(*) > 5`) fails because `WHERE` filters raw rows **before** groups are formed! Aggregate conditions must be placed in the `HAVING` clause.",
        "codeSnippet": "-- ❌ SYNTAX ERROR:\nSELECT dept_id, COUNT(*) FROM emp WHERE COUNT(*) > 5 GROUP BY dept_id;\n\n-- ✅ CORRECT:\nSELECT dept_id, COUNT(*) FROM emp GROUP BY dept_id HAVING COUNT(*) > 5;",
        "tip": "Hacker Rule: Use WHERE to filter rows before aggregation; use HAVING to filter groups after aggregation.",
        "arenaTarget": "game.html?lang=sql&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "sql-les-002",
    "language": "sql",
    "difficulty": "beginner",
    "topic": "Joins & Cartesian Products",
    "title": "Chapter 2: Relational Joins & Cartesian Product Algebra",
    "tagline": "Master INNER, LEFT, RIGHT, FULL, and CROSS joins and avoid accidental Cartesian explosion.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand relational algebra foundations: Cartesian Products and Equi-Joins",
      "Master INNER JOIN vs LEFT OUTER JOIN semantics",
      "Identify and eliminate accidental CROSS JOIN Cartesian explosions",
      "Avoid NULL propagation bugs in LEFT JOIN WHERE clauses"
    ],
    "chapterSummary": "The true power of relational databases lies in normalizing data across separate tables (Third Normal Form - 3NF) and reconstructing relationships at query time using **Relational Joins**.\n\nA join matches rows between tables based on related columns (typically Foreign Keys). Choosing the right join type determines whether non-matching rows are preserved with NULLs or pruned from the final result set.",
    "deepDive": {
      "title": "Join Execution Algorithms in RDBMS Engines",
      "content": "Database engines execute joins using three primary physical algorithms:\n1. **Nested Loop Join**: For small datasets or when the inner table has an index.\n2. **Hash Join**: Builds an in-memory hash table of the smaller table for $O(N)$ matching.\n3. **Sort-Merge Join**: Sorts both tables by join key and scans in parallel for large datasets.",
      "codeSnippet": "EXPLAIN ANALYZE SELECT * FROM users u JOIN orders o ON u.id = o.user_id;"
    },
    "takeaways": [
      "INNER JOIN returns matching rows; LEFT JOIN preserves all rows from the left table.",
      "Missing ON conditions causes catastrophic Cartesian Products (N * M rows).",
      "Filtering the right table in WHERE accidentally turns a LEFT JOIN into an INNER JOIN.",
      "Always use explicit modern ANSI join syntax (JOIN ... ON)."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Relational Join Spectrum",
        "content": "Standard join types:\n- **INNER JOIN**: Returns only rows with matching values in both tables.\n- **LEFT (OUTER) JOIN**: Returns ALL rows from the left table, populated with NULLs if no right table match exists.\n- **RIGHT JOIN**: Returns all rows from the right table.\n- **FULL OUTER JOIN**: Combines LEFT and RIGHT, keeping all rows with NULL padding.\n- **CROSS JOIN**: Computes the raw mathematical Cartesian Product (every row paired with every row, producing `N * M` rows).",
        "codeSnippet": "-- Left join preserves users even if they have zero orders:\nSELECT u.username, o.order_id, o.amount\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;",
        "sandboxCode": "-- Mock join test:\nSELECT a.id, b.name \nFROM table_a a \nINNER JOIN table_b b ON a.id = b.a_id;"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Accidental Inner Join on Left Join Trap",
        "prompt": "Why does adding `WHERE o.status = \"shipped\"` accidentally convert a LEFT JOIN into an INNER JOIN?",
        "codeSnippet": "SELECT u.username, o.status\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.status = 'shipped';",
        "options": [
          {
            "text": "Users without orders have o.status = NULL; because NULL = \"shipped\" evaluates to UNKNOWN (treated as false), all non-matching users are discarded",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Adding a non-null condition on the right table in the WHERE clause filters out all preserved NULL rows, turning the LEFT JOIN into an INNER JOIN. Move the condition into the ON clause instead!"
          },
          {
            "text": "WHERE clauses are forbidden on queries containing joins",
            "isCorrect": false,
            "feedback": "WHERE clauses are fully supported."
          },
          {
            "text": "It creates a circular foreign key constraint",
            "isCorrect": false,
            "feedback": "Queries do not modify constraints."
          },
          {
            "text": "The query fails with a syntax error",
            "isCorrect": false,
            "feedback": "The syntax is valid, but the relational logic is flawed."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Accidental Cartesian Explosion (Missing ON Clause)",
        "content": "Omitting the `ON` join condition or joining on non-unique columns creates a **Cartesian Product**: joining 100,000 users with 100,000 orders produces **10,000,000,000 rows**, instantly exhausting database RAM and crashing the server!",
        "codeSnippet": "-- ❌ DISASTER: Missing ON condition generates Cartesian explosion:\nSELECT * FROM users, orders; -- Returns 10 billion rows!\n\n-- ✅ CORRECT: Explicit explicit join condition:\nSELECT * FROM users u INNER JOIN orders o ON u.id = o.user_id;",
        "tip": "Hacker Rule: Always use explicit modern ANSI-92 syntax (INNER JOIN ... ON); never use comma joins (FROM a, b).",
        "arenaTarget": "game.html?lang=sql&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "sql-les-003",
    "language": "sql",
    "difficulty": "intermediate",
    "topic": "Aggregations & Grouping",
    "title": "Chapter 3: Aggregate Functions & Grouping Semantics",
    "tagline": "Master COUNT, SUM, AVG, GROUP BY, and the SQL standard non-aggregated column rule.",
    "estimatedMinutes": 6,
    "objectives": [
      "Master standard aggregate functions: COUNT(*), COUNT(col), SUM, AVG, MIN, MAX",
      "Understand how COUNT(*) handles rows vs how COUNT(col) ignores NULLs",
      "Master GROUP BY and the SQL standard rule on non-aggregated projection columns",
      "Use GROUPING SETS and ROLLUP for multidimensional sub-totals"
    ],
    "chapterSummary": "Relational tables often hold millions of detailed operational rows. Business intelligence, analytics dashboards, and application reports require summarizing this raw data into totals, averages, and group metrics.\n\nSQL provides **Aggregate Functions** to compress sets of values into single scalar results. However, combining aggregate functions with non-aggregated columns requires understanding the mathematical semantics of `GROUP BY`.",
    "deepDive": {
      "title": "Multidimensional Analytics with ROLLUP",
      "content": "Modern SQL standards provide `ROLLUP` to calculate hierarchical subtotals and grand totals in a single pass without multiple UNION queries.",
      "codeSnippet": "SELECT region, year, SUM(sales)\nFROM sales_data\nGROUP BY ROLLUP(region, year);"
    },
    "takeaways": [
      "COUNT(*) counts rows; COUNT(col) counts non-null values.",
      "All non-aggregated columns in SELECT must be present in GROUP BY.",
      "AVG() skips NULL values, which may skew arithmetic means.",
      "Use ROLLUP to generate sub-totals and grand totals efficiently."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Grouping Rows into Summary Buckets",
        "content": "When `GROUP BY` executes, the engine partitions rows sharing identical group keys into isolated buckets. Aggregate functions then compute across each bucket independently.\n\n**The SQL Standard Cardinal Rule**: Every column appearing in the `SELECT` clause that is NOT enclosed in an aggregate function **MUST appear in the `GROUP BY` clause**!",
        "codeSnippet": "SELECT department, role, \n       COUNT(*) AS headcount, \n       AVG(salary) AS avg_sal, \n       MAX(salary) AS top_sal\nFROM employees\nGROUP BY department, role\nORDER BY headcount DESC;",
        "sandboxCode": "-- Aggregate practice:\nSELECT dept, COUNT(*) \nFROM staff \nGROUP BY dept;"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The COUNT(*) vs COUNT(column) Trap",
        "prompt": "If a table has 5 rows where column bonus contains [100, NULL, 200, NULL, 300], what does `SELECT COUNT(*), COUNT(bonus) FROM tbl` return?",
        "codeSnippet": "SELECT COUNT(*), COUNT(bonus) FROM tbl;",
        "options": [
          {
            "text": "5 and 3 (COUNT(*) counts total physical rows regardless of content; COUNT(col) ignores NULL values)",
            "isCorrect": true,
            "feedback": "🎯 Exactly! COUNT(*) counts every row in the partition. COUNT(column) evaluates the column and skips rows where the value is NULL."
          },
          {
            "text": "5 and 5",
            "isCorrect": false,
            "feedback": "COUNT(col) does not count NULL entries."
          },
          {
            "text": "3 and 3",
            "isCorrect": false,
            "feedback": "COUNT(*) does not check column values and counts all 5 rows."
          },
          {
            "text": "An aggregation error occurs because NULL cannot be counted",
            "isCorrect": false,
            "feedback": "NULL is handled cleanly by aggregate functions."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "MySQL ONLY_FULL_GROUP_BY Violation",
        "content": "In legacy or misconfigured MySQL instances with `ONLY_FULL_GROUP_BY` disabled, selecting non-aggregated columns not present in `GROUP BY` returns an arbitrary random row value for that column, corrupting financial reports!",
        "codeSnippet": "-- ❌ AMBIGUOUS / CORRUPTED DATA:\nSELECT dept_id, employee_name, MAX(salary)\nFROM employees\nGROUP BY dept_id; -- employee_name is arbitrary and NOT guaranteed to be the highest earner!",
        "tip": "Hacker Rule: Always ensure ONLY_FULL_GROUP_BY is enabled in database configurations.",
        "arenaTarget": "game.html?lang=sql&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "sql-les-004",
    "language": "sql",
    "difficulty": "expert",
    "topic": "Three-Valued Logic & NULLs",
    "title": "Chapter 4: Three-Valued Logic, NULLs & Boolean Algebra",
    "tagline": "Master TRUE, FALSE, UNKNOWN, and eliminate silent data omission in SQL comparisons.",
    "estimatedMinutes": 7,
    "objectives": [
      "Understand what NULL truly represents in relational theory (unknown / missing state)",
      "Master Three-Valued Logic (3VL): TRUE, FALSE, and UNKNOWN",
      "Understand why col = NULL or col != NULL evaluates to UNKNOWN, omitting rows in WHERE",
      "Use IS NULL, IS NOT NULL, and COALESCE() for deterministic evaluation"
    ],
    "chapterSummary": "In standard programming languages, boolean logic is binary: an expression is either `true` or `false`. In relational database theory, E.F. Codd introduced **Three-Valued Logic (3VL)** to represent missing, unassigned, or unknown information.\n\nIn SQL, **NULL is not a value**—it is a marker indicating the *absence* of a value. Because NULL represents the unknown, comparing anything to NULL (even `NULL = NULL`) does not evaluate to `true` or `false`—it evaluates to **`UNKNOWN`**!",
    "deepDive": {
      "title": "COALESCE vs IFNULL / NVL",
      "content": "`COALESCE(val1, val2, ...)` is ANSI SQL standard and accepts arbitrary arguments, returning the first non-null expression with short-circuit evaluation.",
      "codeSnippet": "SELECT COALESCE(phone, mobile, email, 'No Contact Info') FROM customers;"
    },
    "takeaways": [
      "NULL is not a value; it represents an unknown state.",
      "Comparisons with NULL (col = NULL) evaluate to UNKNOWN, not TRUE or FALSE.",
      "WHERE clauses retain rows ONLY when expressions evaluate strictly to TRUE.",
      "Never use NOT IN with subqueries that can produce NULL values; use NOT EXISTS."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Three-Valued Logic (3VL) Truth Table",
        "content": "In SQL boolean expressions:\n- `NULL = 5` -> **UNKNOWN**\n- `NULL = NULL` -> **UNKNOWN** (two unknown values cannot be proven equal!)\n- `NOT UNKNOWN` -> **UNKNOWN**\n- `TRUE AND UNKNOWN` -> **UNKNOWN**\n- `FALSE AND UNKNOWN` -> **FALSE**\n\nCrucially, a `WHERE` clause only retains rows where the predicate evaluates strictly to **`TRUE`**. Rows evaluating to `FALSE` or `UNKNOWN` are discarded!",
        "codeSnippet": "-- ❌ WRONG: Returns 0 rows because col = NULL is UNKNOWN!\nSELECT * FROM users WHERE status = NULL;\n\n-- ✅ CORRECT: Uses dedicated null predicates:\nSELECT * FROM users WHERE status IS NULL;\nSELECT * FROM users WHERE status IS NOT NULL;",
        "sandboxCode": "-- Demonstrating NULL behavior:\nSELECT \n    CASE WHEN NULL = NULL THEN 'EQUAL' ELSE 'NOT EQUAL / UNKNOWN' END AS test1,\n    CASE WHEN NULL IS NULL THEN 'IS NULL MATCH' ELSE 'OTHER' END AS test2;"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The NOT IN with NULL Disaster",
        "prompt": "What happens when you run `WHERE id NOT IN (1, 2, NULL)` in SQL?",
        "codeSnippet": "SELECT * FROM products WHERE id NOT IN (1, 2, NULL);",
        "options": [
          {
            "text": "It returns ZERO rows (an empty set), because id != NULL evaluates to UNKNOWN, rendering the entire AND condition UNKNOWN",
            "isCorrect": true,
            "feedback": "🎯 Exactly! NOT IN expands to: id != 1 AND id != 2 AND id != NULL. Since id != NULL is UNKNOWN, the entire conjunction evaluates to UNKNOWN or FALSE, matching zero rows! Always use NOT EXISTS instead."
          },
          {
            "text": "It returns all products except IDs 1 and 2 normally",
            "isCorrect": false,
            "feedback": "The presence of NULL in a NOT IN subquery poisons the entire evaluation."
          },
          {
            "text": "It throws a NullPointerException",
            "isCorrect": false,
            "feedback": "SQL executes cleanly without exceptions, but returns zero rows silently."
          },
          {
            "text": "It deletes all rows where id is NULL",
            "isCorrect": false,
            "feedback": "SELECT queries never mutate or delete data."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Silent Data Omission in WHERE != Comparisons",
        "content": "Running `SELECT * FROM users WHERE role != 'admin'` silently **omits all users whose role is NULL**! Because `NULL != 'admin'` evaluates to UNKNOWN, those users are discarded unless explicitly handled with `OR role IS NULL`.",
        "codeSnippet": "-- ❌ DANGEROUS: Omits users with NULL roles:\nSELECT * FROM users WHERE role != 'admin';\n\n-- ✅ SAFE: Explicitly handles NULL:\nSELECT * FROM users WHERE role != 'admin' OR role IS NULL;\n-- Or use COALESCE:\nSELECT * FROM users WHERE COALESCE(role, '') != 'admin';",
        "tip": "Hacker Rule: Use NOT EXISTS instead of NOT IN when subqueries might contain NULLs.",
        "arenaTarget": "game.html?lang=sql&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "sql-les-005",
    "language": "sql",
    "difficulty": "expert",
    "topic": "Window Functions & CTEs",
    "title": "Chapter 5: Window Functions, Partitions & Common Table Expressions (CTEs)",
    "tagline": "Master OVER (PARTITION BY ... ORDER BY), ROW_NUMBER, RANK, LEAD, LAG, and recursive CTEs.",
    "estimatedMinutes": 8,
    "objectives": [
      "Differentiate between standard GROUP BY aggregations vs Window Functions",
      "Master the OVER (PARTITION BY ... ORDER BY ...) window specification clause",
      "Use ranking and positional window functions: ROW_NUMBER(), DENSE_RANK(), LEAD(), LAG()",
      "Structure readable complex data pipelines using Common Table Expressions (WITH CTE)"
    ],
    "chapterSummary": "Standard `GROUP BY` queries collapse rows into single summary groups, losing individual row identities in the process. When applications need to compute running totals, calculate rank within categories, or compare a row to its predecessor, standard grouping falls short.\n\n**Window Functions** perform calculations across a set of table rows related to the current row, **while preserving every individual row identity in the output**! Combined with Common Table Expressions (`WITH ... AS`), they replace complex subqueries with clean, readable data transformation pipelines.",
    "deepDive": {
      "title": "Recursive CTEs for Tree and Graph Traversal",
      "content": "Common Table Expressions support the `RECURSIVE` keyword, allowing you to traverse hierarchical organizational charts, bill-of-materials, or graph networks with an anchor member and recursive union.",
      "codeSnippet": "WITH RECURSIVE OrgChart AS (\n    SELECT id, name, manager_id, 1 as level FROM employees WHERE manager_id IS NULL\n    UNION ALL\n    SELECT e.id, e.name, e.manager_id, o.level + 1 FROM employees e JOIN OrgChart o ON e.manager_id = o.id\n) SELECT * FROM OrgChart;"
    },
    "takeaways": [
      "Window functions compute aggregates without collapsing individual rows.",
      "ROW_NUMBER generates unique rows; RANK leaves gaps after ties; DENSE_RANK leaves no gaps.",
      "LAG() and LEAD() access previous and next row values without self-joins.",
      "Use CTEs (WITH ... AS) to structure clean, multi-stage data pipelines."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Window Function Anatomy: OVER (PARTITION BY ...)",
        "content": "A window function follows the syntax:\n```sql\nFUNCTION() OVER (\n    PARTITION BY partition_column\n    ORDER BY sort_column\n    ROWS BETWEEN ...\n)\n```\n- `PARTITION BY`: Divides rows into calculation groups.\n- `ORDER BY`: Defines the evaluation sequence within each partition.\n- Positional functions like `LAG(col, 1)` inspect the previous row, while `LEAD(col, 1)` inspects the next row.",
        "codeSnippet": "-- Compute department salary rank and difference from previous employee:\nSELECT employee_name, department, salary,\n       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank,\n       LAG(salary, 1) OVER (PARTITION BY department ORDER BY salary DESC) - salary AS gap_from_higher\nFROM employees;",
        "sandboxCode": "-- Window function mock test:\nSELECT name, dept, salary,\n       AVG(salary) OVER (PARTITION BY dept) AS dept_avg\nFROM staff;"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "RANK() vs DENSE_RANK() vs ROW_NUMBER()",
        "prompt": "If three employees tie for 1st place with identical salaries, what rank will the 4th employee receive under RANK() vs DENSE_RANK()?",
        "codeSnippet": "SELECT name, salary,\n       RANK() OVER (ORDER BY salary DESC) as r,\n       DENSE_RANK() OVER (ORDER BY salary DESC) as dr\nFROM employees;",
        "options": [
          {
            "text": "RANK() assigns rank 4 (leaves gaps after ties: 1, 1, 1, 4); DENSE_RANK() assigns rank 2 (no gaps: 1, 1, 1, 2)",
            "isCorrect": true,
            "feedback": "🎯 Correct! RANK leaves gaps reflecting the tied count (1, 1, 1, 4). DENSE_RANK never skips ranks (1, 1, 1, 2). ROW_NUMBER always generates unique consecutive integers (1, 2, 3, 4)."
          },
          {
            "text": "Both assign rank 2",
            "isCorrect": false,
            "feedback": "RANK() always leaves gaps after duplicate ties."
          },
          {
            "text": "RANK() assigns rank 1; DENSE_RANK() assigns rank 4",
            "isCorrect": false,
            "feedback": "That is reversed."
          },
          {
            "text": "DENSE_RANK throws a tie exception",
            "isCorrect": false,
            "feedback": "All window functions gracefully resolve ties."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Window Functions in WHERE Clauses",
        "content": "Because Window Functions are calculated during the projection step (after WHERE and HAVING), placing a window function directly in a `WHERE` clause triggers an immediate syntax error! Always encapsulate window functions inside a CTE or subquery.",
        "codeSnippet": "-- ❌ SYNTAX ERROR: Window function not allowed in WHERE:\nSELECT * FROM employees WHERE ROW_NUMBER() OVER (...) = 1;\n\n-- ✅ IDIOMATIC FIX: Use a CTE:\nWITH Ranked AS (\n    SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn\n    FROM employees\n)\nSELECT * FROM Ranked WHERE rn = 1;",
        "tip": "Hacker Rule: Use a WITH CTE to filter by window function results (e.g. top-1 per category).",
        "arenaTarget": "game.html?lang=sql&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "ts-les-001",
    "language": "typescript",
    "difficulty": "beginner",
    "topic": "Inference vs Annotations",
    "title": "Chapter 1: Type Inference, Annotations & Type Widening",
    "tagline": "Master TypeScript contextual typing, let widening, and write clean idiomatic types.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand how the TypeScript compiler infers types without redundant annotations",
      "Master Contextual Typing and how expressions infer types from their usage position",
      "Understand Type Widening (how let widens literals to string/number while const preserves literals)",
      "Know when explicit annotations are required vs when to trust compiler inference"
    ],
    "chapterSummary": "A common rookie mistake when adopting TypeScript is over-annotating: typing `let name: string = \"Alice\";` everywhere. TypeScript features a powerful, bidirectional **Type Inference Engine** capable of calculating complex types automatically.\n\nUnderstanding how TypeScript infers types, when it performs **Type Widening**, and how contextual typing works allows you to write clean, concise, production-grade TypeScript with maximum type safety and zero boilerplate noise.",
    "deepDive": {
      "title": "Contextual Typing in Callback Parameters",
      "content": "TypeScript uses **contextual typing** to infer parameter types based on their location. In `[1, 2, 3].map(x => x * 2)`, you never need to annotate `x: number` because `Array.prototype.map` informs the compiler that `x` is a number.",
      "codeSnippet": "const nums = [1, 2, 3];\nnums.forEach(n => console.log(n.toFixed(2))); // n inferred as number"
    },
    "takeaways": [
      "Trust type inference for local variables; avoid redundant type annotations.",
      "let widens literals to general primitives; const retains literal types.",
      "Use as const on configuration objects to prevent property widening.",
      "Use unknown instead of any for safe dynamic data handling."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Type Inference vs Type Widening with let and const",
        "content": "When declaring variables:\n- `const x = \"GET\";`: Inferred as the strict string literal type `\"GET\"` (cannot change).\n- `let x = \"GET\";`: **Widens** the type to `string` because the variable could be reassigned to any string later!\n\nThis widening frequently causes errors when passing `let` variables to APIs expecting specific union literals (e.g. `\"GET\" | \"POST\"`).",
        "codeSnippet": "const method1 = \"GET\"; // Type: \"GET\" (literal)\nlet method2 = \"GET\";   // Type: string (widened!)\n\nfunction sendRequest(method: \"GET\" | \"POST\") { ... }\n\nsendRequest(method1); // Compiles cleanly!\n// sendRequest(method2); // Error: Argument of type 'string' is not assignable to '\"GET\" | \"POST\"'.",
        "sandboxCode": "let score = 100; // Inferred as number\nconst maxScore = 500; // Inferred as 500\n\nfunction printMetrics(val: number) {\n    console.log(\"Metric value:\", val);\n}\n\nprintMetrics(score);\nprintMetrics(maxScore);"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Object Literal Widening Trap",
        "prompt": "Why does passing an options object variable to a function expecting `{ mode: \"dark\" | \"light\" }` fail unless as const is applied?",
        "codeSnippet": "const config = { mode: \"dark\" }; // Inferred as { mode: string }!\nfunction setUI(opts: { mode: \"dark\" | \"light\" }) { ... }\n// setUI(config); // Error!",
        "options": [
          {
            "text": "In object literals, properties declared with let or const are widened to primitive types (mode: string) unless frozen with as const",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Even though config is const, its properties remain mutable (config.mode = \"other\"), so TypeScript widens mode to string. Add as const to preserve literal types."
          },
          {
            "text": "TypeScript objects cannot be passed to functions",
            "isCorrect": false,
            "feedback": "Objects are standard function arguments."
          },
          {
            "text": "setUI only accepts primitive strings",
            "isCorrect": false,
            "feedback": "setUI expects an options object."
          },
          {
            "text": "dark is a reserved CSS identifier in TypeScript",
            "isCorrect": false,
            "feedback": "dark is a standard string literal."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Explicit any Disabling the Type Checker",
        "content": "Using `any` completely disables the TypeScript compiler for that expression and infects downstream code like a virus. Use `unknown` instead: it forces you to perform type narrowing before using the value!",
        "codeSnippet": "// ❌ DANGEROUS: Disables all type safety:\nfunction parse(data: any) { data.nonExistentMethod(); } // Runtime crash!\n\n// ✅ SAFE: Forces type verification:\nfunction parseSafe(data: unknown) {\n    if (typeof data === \"string\") console.log(data.toUpperCase());\n}",
        "tip": "Hacker Rule: Never use any; use unknown when dealing with dynamic external inputs.",
        "arenaTarget": "game.html?lang=typescript&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "ts-les-002",
    "language": "typescript",
    "difficulty": "beginner",
    "topic": "Structural vs Nominal Typing",
    "title": "Chapter 2: Structural Subtyping vs Nominal Type Systems",
    "tagline": "Master duck typing in TypeScript and understand excess property checking.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand Structural Subtyping (Duck Typing: \"If it walks like a duck...\")",
      "Contrast TypeScript structural typing with Java/C# nominal class hierarchies",
      "Understand Excess Property Checking on object literals and why it behaves differently on variables",
      "Create Branded (Nominal) Types to prevent mixing up IDs and units"
    ],
    "chapterSummary": "In nominal type languages like Java or C#, two classes with identical fields and methods are completely incompatible unless they share an explicit inheritance hierarchy or interface implementation.\n\nTypeScript operates on **Structural Subtyping** (commonly called \"Duck Typing\"): if two types possess the same shape, they are fully interchangeable! However, TypeScript applies **Excess Property Checking** to catch spelling errors on freshly created object literals.",
    "deepDive": {
      "title": "Function Parameter Bivariance vs Contravariance",
      "content": "TypeScript checks method parameters bivariantly for historical ergonomic reasons, but under `--strictFunctionTypes`, function parameters are strictly **contravariant** (narrower arguments cannot be assigned to functions expecting broader arguments).",
      "codeSnippet": "// --strictFunctionTypes enforces correct mathematical subtyping on function signatures."
    },
    "takeaways": [
      "TypeScript uses structural subtyping: matching shapes are compatible.",
      "Excess property checks catch typos on object literals.",
      "Passing variables bypasses excess property checks via structural subtyping.",
      "Use Branded Types to create nominal guarantees for critical identifiers."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Shape Compatibility & Structural Equivalence",
        "content": "In TypeScript:\n```ts\ninterface Point2D { x: number; y: number; }\ninterface Vector2D { x: number; y: number; }\n```\n`Point2D` and `Vector2D` are **100% interchangeable** because their structural shapes are identical!\n\nA type `A` is assignable to type `B` if `A` has **at least all required properties** of `B` (and their types match).",
        "codeSnippet": "interface Named { name: string; }\n\nclass Person { name: string = \"Alice\"; age: number = 30; }\nclass Dog { name: string = \"Rover\"; }\n\nfunction greet(n: Named) { console.log(\"Hello, \" + n.name); }\n\ngreet(new Person()); // Valid! Has 'name' property.\ngreet(new Dog());    // Valid! Has 'name' property.",
        "sandboxCode": "type User = { id: number; name: string };\nconst admin = { id: 1, name: \"Root\", permissions: [\"ALL\"] };\n\nfunction printUser(u: User) {\n    console.log(\"User:\", u.id, u.name);\n}\n\n// Valid via variable assignment (structural subtyping):\nprintUser(admin);"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Excess Property Check Trap",
        "prompt": "Why does `printUser({ id: 1, name: \"Adept\", extra: true })` trigger a compiler error, while passing a variable containing `extra` succeeds?",
        "codeSnippet": "type User = { id: number; name: string };\nfunction printUser(u: User) { ... }\n\n// printUser({ id: 1, name: \"Adept\", extra: true }); // Error!\nconst obj = { id: 1, name: \"Adept\", extra: true };\nprintUser(obj); // Compiles cleanly!",
        "options": [
          {
            "text": "TypeScript applies Excess Property Checking exclusively to fresh object literals to catch typos; existing variables are checked via standard structural subtyping",
            "isCorrect": true,
            "feedback": "🎯 Exactly! If you pass a fresh object literal, extra properties are almost certainly developer typos (like writing colr instead of color). For variables, standard structural subtyping applies."
          },
          {
            "text": "Variables are not type-checked by the compiler",
            "isCorrect": false,
            "feedback": "Variables are rigorously type-checked."
          },
          {
            "text": "extra is a reserved keyword in TypeScript",
            "isCorrect": false,
            "feedback": "extra is a standard custom property identifier."
          },
          {
            "text": "Functions can only accept variables, never object literals",
            "isCorrect": false,
            "feedback": "Object literals are standard function arguments."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Accidental Field Confusion (UserID vs OrderID)",
        "content": "Because `type UserID = number;` and `type OrderID = number;` are structural aliases for `number`, you can accidentally pass a UserID to an order function without any compiler warning! Use **Branded Types** to simulate nominal safety.",
        "codeSnippet": "// ❌ ACCIDENTAL ID CONFUSION:\ntype UserID = number;\ntype OrderID = number;\nfunction cancelOrder(id: OrderID) { ... }\nlet uid: UserID = 42;\ncancelOrder(uid); // Compiles! Dangerous bug.\n\n// ✅ BRANDED TYPE FIX (Nominal simulation):\ntype Branded<T, B> = T & { readonly __brand: B };\ntype SafeUserID = Branded<number, \"UserID\">;\ntype SafeOrderID = Branded<number, \"OrderID\">;\n// cancelOrder(uid); // Compiler Error! Type safe.",
        "tip": "Hacker Rule: Use Branded Types to enforce nominal safety for IDs, currencies, and sanitization tokens.",
        "arenaTarget": "game.html?lang=typescript&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "ts-les-003",
    "language": "typescript",
    "difficulty": "intermediate",
    "topic": "Discriminated Unions",
    "title": "Chapter 3: Discriminated Unions & Exhaustiveness Checking",
    "tagline": "Master tagged unions, pattern matching with switch statements, and the never type.",
    "estimatedMinutes": 7,
    "objectives": [
      "Master Discriminated Unions (Tagged Unions / Algebraic Data Types)",
      "Understand how TypeScript narrows union types based on literal discriminator tags",
      "Implement compile-time exhaustiveness checking using the never type",
      "Model complex asynchronous states (Loading, Success, Error) cleanly"
    ],
    "chapterSummary": "In real-world applications, systems transition across discrete states: a network request is either `Idle`, `Loading`, `Success` (with data), or `Error` (with an error message). Trying to model this using optional properties on a single class leads to invalid states (e.g. data existing while error is true).\n\nTypeScript solves this elegantly with **Discriminated Unions** (also known as Tagged Unions or Algebraic Data Types). By combining a shared literal property tag with compile-time type narrowing, TypeScript turns `switch` statements into foolproof pattern matching!",
    "deepDive": {
      "title": "User-Defined Type Guards (val is T)",
      "content": "When checking types outside switch statements, you can author custom type guard functions returning `pet is Fish` to narrow types conditionally.",
      "codeSnippet": "function isSuccess(res: NetworkState): res is { status: \"success\"; data: string[] } {\n    return res.status === \"success\";\n}"
    },
    "takeaways": [
      "Discriminated unions combine a literal tag property with a union type.",
      "TypeScript narrows the type automatically inside if or switch blocks.",
      "Use the never type in default branches for compile-time exhaustiveness checking.",
      "Design types so that invalid domain states are impossible to represent."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Modeling Domain States with Discriminated Unions",
        "content": "A Discriminated Union requires three ingredients:\n1. Multiple types representing mutually exclusive states.\n2. A shared property with a **singleton literal type** (the \"discriminator\" or \"tag\", e.g. `status: \"success\"`).\n3. A union uniting them (`type Result = Success | Error`).\n\nInside an `if` or `switch` checking the tag, TypeScript automatically narrows the object type, granting safe access to state-specific properties!",
        "codeSnippet": "type NetworkState = \n  | { status: \"loading\" }\n  | { status: \"success\"; data: string[] }\n  | { status: \"error\"; error: Error };\n\nfunction renderUI(state: NetworkState) {\n    switch (state.status) {\n        case \"loading\": return \"Loading spinner...\";\n        case \"success\": return \"Items: \" + state.data.join(\", \"); // data is safe!\n        case \"error\":   return \"Failed: \" + state.error.message;  // error is safe!\n    }\n}",
        "sandboxCode": "type Shape = \n  | { kind: \"circle\"; radius: number }\n  | { kind: \"square\"; side: number };\n\nfunction area(s: Shape): number {\n    switch (s.kind) {\n        case \"circle\": return Math.PI * s.radius ** 2;\n        case \"square\": return s.side * s.side;\n    }\n}\n\nconsole.log(\"Circle area:\", area({ kind: \"circle\", radius: 5 }));"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Compile-Time Exhaustiveness Check",
        "prompt": "How can you guarantee at compile time that all variants of a discriminated union are handled in a switch statement?",
        "codeSnippet": "function handle(state: NetworkState) {\n    switch (state.status) {\n        case \"loading\": break;\n        case \"success\": break;\n        case \"error\":   break;\n        default:\n            const _exhaustiveCheck: never = state; // Compile check!\n    }\n}",
        "options": [
          {
            "text": "Assign the unhandled state to type never in the default branch; if any union variant was forgotten, TypeScript triggers a compile-time assignment error",
            "isCorrect": true,
            "feedback": "🎯 Exactly! The never type represents values that can never occur. If you forget to handle a case, the variable in default will have that unhandled type, which cannot be assigned to never, failing compilation!"
          },
          {
            "text": "Throw a runtime Error in default",
            "isCorrect": false,
            "feedback": "Throwing an error catches missing cases at runtime, but does NOT enforce compile-time verification."
          },
          {
            "text": "Use any in the default block",
            "isCorrect": false,
            "feedback": "any disables type checking completely."
          },
          {
            "text": "Mark the switch statement as async",
            "isCorrect": false,
            "feedback": "Async has zero impact on union exhaustiveness."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Optional Booleans Instead of Discriminated Unions",
        "content": "Modeling states with multiple optional flags (`{ isLoading?: boolean, isError?: boolean, data?: string, error?: string }`) permits impossible states (both `isLoading` and `isError` true). Always use discriminated unions to make invalid states unrepresentable!",
        "codeSnippet": "// ❌ PERMITS IMPOSSIBLE STATES:\ntype BadState = { isLoading: boolean; data?: string[]; error?: Error };\n\n// ✅ MAKES INVALID STATES IMPOSSIBLE:\ntype GoodState = \n  | { status: \"loading\" }\n  | { status: \"success\"; data: string[] }\n  | { status: \"error\"; error: Error };",
        "tip": "Hacker Rule: Make invalid states unrepresentable using Discriminated Unions.",
        "arenaTarget": "game.html?lang=typescript&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "ts-les-004",
    "language": "typescript",
    "difficulty": "expert",
    "topic": "Const Assertions & satisfies",
    "title": "Chapter 4: Const Assertions & The satisfies Operator",
    "tagline": "Deeply freeze types with as const and validate shapes without widening using satisfies.",
    "estimatedMinutes": 7,
    "objectives": [
      "Master const assertions (as const) for deeply freezing literal values and tuples",
      "Understand how TypeScript 4.9+ satisfies validates types without widening them",
      "Contrast type annotations (obj: Type) vs satisfies (obj satisfies Type)",
      "Safely build static configuration tables with exact autocomplete"
    ],
    "chapterSummary": "Prior to TypeScript 4.9, developers faced an annoying dilemma when defining configuration objects:\n- If you added an explicit type annotation (`const palette: Record<string, string | RGB> = { ... }`), TypeScript **widened** all properties, losing exact color keys and autocomplete.\n- If you omitted the annotation, you retained exact autocomplete, but lost compile-time validation that the object adhered to the required schema!\n\nTypeScript 4.9 resolved this forever with the **`satisfies` operator**!",
    "deepDive": {
      "title": "Combining as const and satisfies",
      "content": "For maximum safety, combine both: `as const` locks values into immutable literal tuples, while `satisfies` verifies structural adherence to an interface.",
      "codeSnippet": "const appConfig = {\n    version: \"2.0.0\",\n    ports: [8080, 8443]\n} as const satisfies { version: string; ports: readonly number[] };"
    },
    "takeaways": [
      "as const deeply freezes literal types and turns arrays into readonly tuples.",
      "satisfies validates type conformance without widening inferred property types.",
      "Use satisfies to keep exact autocomplete on configuration objects.",
      "Combine as const and satisfies for immutable, fully-validated configuration tables."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The satisfies Operator vs Type Annotations",
        "content": "The `satisfies` operator checks that an expression matches a type **without changing or widening the resulting type** of the expression!\n\n```ts\n// Inferred with exact literal types, yet validated against Palette!\nconst palette = {\n    primary: \"#6366F1\",\n    secondary: [99, 102, 241]\n} satisfies Record<string, string | number[]>;\n\npalette.primary.toUpperCase(); // Valid! TS knows primary is string!\npalette.secondary.map(...);    // Valid! TS knows secondary is array!\n```",
        "codeSnippet": "type RouteConfig = {\n    path: string;\n    authRequired: boolean;\n};\n\n// Validates keys and fields, but retains exact route names!\nconst routes = {\n    home: { path: \"/\", authRequired: false },\n    dashboard: { path: \"/dash\", authRequired: true }\n} satisfies Record<string, RouteConfig>;\n\n// Exact autocomplete preserved:\nconsole.log(routes.dashboard.authRequired); // true",
        "sandboxCode": "const theme = {\n    colors: [\"#000\", \"#fff\"],\n    font: \"monospace\"\n} as const;\n\n// theme.font is \"monospace\", not string!\n// theme.colors is readonly [\"#000\", \"#fff\"], not string[]!\nconsole.log(\"Theme font:\", theme.font);"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "as const vs satisfies Comparison",
        "prompt": "What is the key difference between `as const` and `satisfies` in TypeScript?",
        "codeSnippet": "const a = { x: 10 } as const;\nconst b = { x: 10 } satisfies { x: number };",
        "options": [
          {
            "text": "as const deeply marks all properties readonly and narrows literals; satisfies validates conformance against a contract without mutating the inferred type or making fields readonly",
            "isCorrect": true,
            "feedback": "🎯 Exactly! as const converts arrays to readonly tuples and primitives to readonly literals. satisfies purely acts as a type contract assertion gate without modifying mutability or widening types."
          },
          {
            "text": "as const runs at runtime; satisfies is compile-time",
            "isCorrect": false,
            "feedback": "Both are erased at compile time; neither runs at runtime."
          },
          {
            "text": "satisfies is deprecated in favor of as const",
            "isCorrect": false,
            "feedback": "satisfies was introduced in TS 4.9 as a modern complement to as const."
          },
          {
            "text": "There is zero difference; they are aliases",
            "isCorrect": false,
            "feedback": "They serve distinct, complementary purposes."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Losing Autocomplete with Explicit Record<string, T>",
        "content": "Annotating a configuration object with `Record<string, T>` turns all property lookups into `any property: T`, destroying compiler checks for nonexistent properties! Replace with `satisfies`.",
        "codeSnippet": "// ❌ LOSES AUTOCOMPLETE & MISTYPO SAFETY:\nconst icons: Record<string, string> = { home: \"🏠\", user: \"👤\" };\nicons.nonExistentKey; // Compiles cleanly! Returns undefined at runtime.\n\n// ✅ PRESERVES EXACT PROPERTY SET:\nconst icons_safe = { home: \"🏠\", user: \"👤\" } satisfies Record<string, string>;\n// icons_safe.nonExistentKey; // Compiler Error!",
        "tip": "Hacker Rule: Use satisfies Record<string, T> instead of annotating : Record<string, T> on configuration maps.",
        "arenaTarget": "game.html?lang=typescript&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "ts-les-005",
    "language": "typescript",
    "difficulty": "expert",
    "topic": "Conditional & Mapped Types",
    "title": "Chapter 5: Advanced Conditional, Mapped & Template Literal Types",
    "tagline": "Master T extends U ? X : Y, the infer keyword, mapped type modifiers, and template literals.",
    "estimatedMinutes": 8,
    "objectives": [
      "Master Conditional Types: T extends U ? X : Y",
      "Understand distributive conditional types over naked type parameters in unions",
      "Extract nested types using the infer pattern-matching keyword",
      "Build custom utility types using Mapped Types and Template Literal types"
    ],
    "chapterSummary": "TypeScript's type system is **Turing Complete**: you can perform complex logic, pattern matching, string manipulation, and recursive transformations entirely at compile time!\n\nAt the pinnacle of TypeScript metaprogramming are **Conditional Types** (`T extends U ? X : Y`) and **Mapped Types** (`[K in keyof T]`). By mastering the `infer` keyword, you can unpack Promise resolutions, extract function return types, and build bulletproof enterprise utility libraries.",
    "deepDive": {
      "title": "Key Remapping in Mapped Types (as)",
      "content": "TypeScript 4.1+ allows you to remap keys in mapped types using the `as` clause, combining mapped types with template literals to generate getter/setter interfaces automatically!",
      "codeSnippet": "type Getters<T> = {\n    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]\n};"
    },
    "takeaways": [
      "Conditional types (T extends U ? X : Y) allow dynamic type selection.",
      "The infer keyword extracts component types via pattern matching.",
      "Conditional types automatically distribute across union types.",
      "Mapped types ([K in keyof T]) transform existing object types into new contracts."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Conditional Types & The infer Keyword",
        "content": "A conditional type selects one of two possible types based on a type relationship test:\n```ts\ntype IsString<T> = T extends string ? true : false;\n```\nThe `infer` keyword introduces a type variable within the condition to **pattern-match and extract** inner types (e.g. extracting the resolved type `R` from a `Promise<R>`).",
        "codeSnippet": "// Custom UnpackPromise utility using infer:\ntype UnpackPromise<T> = T extends Promise<infer R> ? R : T;\n\ntype A = UnpackPromise<Promise<string>>; // string!\ntype B = UnpackPromise<number>;          // number!\n\n// Extracting function return type:\ntype MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;",
        "sandboxCode": "type Event = \"click\" | \"hover\";\ntype EventHandler = `on${Capitalize<Event>}`; // Template literal type!\n\ntype ReadonlyNullable<T> = {\n    readonly [P in keyof T]: T[P] | null; // Mapped type!\n};\n\ntype User = { id: number; name: string };\ntype FlexibleUser = ReadonlyNullable<User>;"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Distributive Conditional Types in Unions",
        "prompt": "When a conditional type T extends U ? X : Y is applied to a union type (e.g. string | number), how does TypeScript evaluate it?",
        "codeSnippet": "type ToArray<T> = T extends any ? T[] : never;\ntype Result = ToArray<string | number>;",
        "options": [
          {
            "text": "It distributes over the union automatically, producing string[] | number[]",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Conditional types distribute over naked union parameters: ToArray<string | number> expands to ToArray<string> | ToArray<number>, producing string[] | number[]. To prevent distribution, wrap T in a tuple: [T] extends [any]."
          },
          {
            "text": "It produces (string | number)[]",
            "isCorrect": false,
            "feedback": "Tuples are not produced unless T is enclosed in brackets ([T])."
          },
          {
            "text": "It fails compilation with an ambiguous type error",
            "isCorrect": false,
            "feedback": "Distributive conditional behavior is standard in the language spec."
          },
          {
            "text": "It produces never",
            "isCorrect": false,
            "feedback": "Both string and number satisfy extends any."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Recursive Type Depth Exceeded",
        "content": "Writing deeply recursive conditional types without base termination cases triggers the dreaded compiler error: `Type instantiation is excessively deep and possibly infinite`. Always ensure base cases return cleanly.",
        "codeSnippet": "// ❌ DANGEROUS RECURSION WITHOUT BASE CASE:\n// type Infinite<T> = Infinite<T[]>; // Crashes compiler!",
        "tip": "Hacker Rule: Use [T] extends [never] when checking for the never type in conditional expressions.",
        "arenaTarget": "game.html?lang=typescript&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "go-les-001",
    "language": "go",
    "difficulty": "beginner",
    "topic": "Explicit Types & Zero Values",
    "title": "Chapter 1: Explicit Types, Zero Values & Memory Initialization",
    "tagline": "Master Go's zero-value initialization, pointers vs value types, and package design.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand the Go design philosophy: explicit, readable, zero implicit coercions",
      "Master the Default Zero Value for every Go type (0, false, \"\", nil)",
      "Differentiate between value types (structs, arrays) and pointer references",
      "Use the short variable declaration syntax (:=) vs explicit var"
    ],
    "chapterSummary": "Designed at Google by Robert Griesemer, Rob Pike, and Ken Thompson, Go was created to solve software engineering at massive scale: eliminating complex inheritance trees, slow compilation times, and uninitialized memory bugs.\n\nIn Go, there is **zero uninitialized memory**. If you declare a variable without providing a value, the Go runtime guarantees that it is initialized to its type's **Zero Value**. Understanding zero values allows you to design structs that are immediately usable without complex constructors.",
    "deepDive": {
      "title": "Designing for Useful Zero Values",
      "content": "Idiomatic Go structs are engineered so their zero value is immediately functional without a factory method. For example, `sync.Mutex` and `bytes.Buffer` require no initialization: `var mu sync.Mutex; mu.Lock()` works immediately.",
      "codeSnippet": "var buf bytes.Buffer\nbuf.WriteString(\"Zero value works immediately!\");"
    },
    "takeaways": [
      "All uninitialized variables in Go receive their deterministic Zero Value.",
      "Go enforces strict explicit typing; no implicit type coercions exist.",
      "Uninitialized pointers are nil; dereferencing nil triggers a panic.",
      "Design structs so their zero value is immediately usable without constructors."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Default Zero-Values & Explicit Typing",
        "content": "Every Go type has a deterministic zero value:\n- Numeric types (`int`, `float64`): `0` / `0.0`\n- Boolean: `false`\n- String: `\"\"` (empty string, length 0)\n- Pointers, slices, maps, channels, functions, interfaces: `nil`\n\nGo has **zero implicit type conversions**: assigning an `int32` to an `int64` requires explicit conversion `int64(my_int32)`.",
        "codeSnippet": "package main\nimport \"fmt\"\n\ntype ServerConfig struct {\n    Port    int    // Zero value: 0\n    Enabled bool   // Zero value: false\n    Host    string // Zero value: \"\"\n}\n\nfunc main() {\n    var cfg ServerConfig\n    fmt.Printf(\"Default config: Host='%s', Port=%d, Enabled=%t\\n\", \n               cfg.Host, cfg.Port, cfg.Enabled)\n}",
        "sandboxCode": "package main\nimport \"fmt\"\n\nfunc main() {\n    var count int\n    var flag bool\n    var name string\n    var ptr *int\n\n    fmt.Printf(\"count: %d, flag: %t, name: '%s', ptr: %v\\n\", \n               count, flag, name, ptr)\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Nil Pointer Dereference Trap",
        "prompt": "What happens when you declare a pointer variable `var p *int` and immediately execute `*p = 100`?",
        "codeSnippet": "var p *int\n*p = 100 // Runtime check!",
        "options": [
          {
            "text": "A runtime panic occurs: panic: runtime error: invalid memory address or nil pointer dereference",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Uninitialized pointers have the zero value nil. Attempting to dereference a nil pointer triggers a fatal runtime panic. You must allocate memory with new(int) or point to an existing variable (&x) first."
          },
          {
            "text": "The Go runtime automatically allocates an integer for p",
            "isCorrect": false,
            "feedback": "Go never implicitly allocates heap memory for raw pointers."
          },
          {
            "text": "It compiles and prints 100 normally",
            "isCorrect": false,
            "feedback": "Dereferencing nil is an immediate panic."
          },
          {
            "text": "A compile-time syntax error is raised",
            "isCorrect": false,
            "feedback": "The syntax is valid; the crash occurs at runtime."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Shadowing Variables with := in Inner Blocks",
        "content": "The short variable declaration `:=` creates a brand new variable in the current block. If you accidentally use `:=` inside an `if err != nil` block, you shadow the outer variable rather than reassigning it!",
        "codeSnippet": "// ❌ ACCIDENTAL SHADOWING DEFECT:\nvar data string\nif true {\n    data, err := fetch() // Shadows outer data! Outer data remains empty!\n}\nfmt.Println(data); // Prints empty string!",
        "tip": "Hacker Rule: Use = when updating existing outer variables; use := only when declaring new local identifiers.",
        "arenaTarget": "game.html?lang=go&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "go-les-002",
    "language": "go",
    "difficulty": "beginner",
    "topic": "Slices Under the Hood",
    "title": "Chapter 2: Under the Hood: Go Slices & Array Backing",
    "tagline": "Master the 24-byte Slice Header struct: pointer, length, and capacity growth.",
    "estimatedMinutes": 7,
    "objectives": [
      "Understand the internal 3-word Slice Header (Data Pointer, Len, Cap)",
      "Contrast fixed-size arrays ([N]T) with dynamic slices ([]T)",
      "Understand sub-slice memory aliasing and capacity sharing",
      "Master the append() growth algorithm and when new backing arrays are allocated"
    ],
    "chapterSummary": "In Go, arrays have a fixed size that is part of their type system: `[5]int` and `[10]int` are completely incompatible types. Because passing arrays copies all elements, arrays are rarely used directly in Go APIs.\n\nInstead, Go programs use **Slices** (`[]int`): lightweight, dynamic window views over an underlying array. Understanding the internal 24-byte **Slice Header** is critical to avoiding subtle memory mutation bugs when sub-slicing and appending.",
    "deepDive": {
      "title": "Slice Growth Heuristics in Go 1.21+",
      "content": "For small slices (<256 elements), `append()` doubles capacity (2x). For larger slices, it transitions to a smooth 1.25x scaling curve to avoid exponential memory waste.",
      "codeSnippet": "// Go runtime: newcap += (newcap + 3*threshold) / 4"
    },
    "takeaways": [
      "A Slice is a 24-byte header: pointer to array, len, and cap.",
      "Sub-slices share the same backing array; mutations affect both views.",
      "When len reaches cap, append allocates a new larger backing array.",
      "Use copy() to avoid keeping huge backing arrays alive in memory."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The 24-Byte Slice Header Structure",
        "content": "On 64-bit systems, a Slice is an ultra-lightweight 24-byte struct (3 machine words):\n```go\ntype SliceHeader struct {\n    Data uintptr // 8 bytes: pointer to underlying array\n    Len  int     // 8 bytes: current visible elements\n    Cap  int     // 8 bytes: total capacity of backing array\n}\n```\nPassing a slice to a function copies only these 24 bytes! However, because `Data` points to the same underlying array, mutations to slice elements modify the shared array.",
        "codeSnippet": "package main\nimport \"fmt\"\n\nfunc main() {\n    orig := []int{10, 20, 30, 40, 50}\n    sub := orig[1:3] // Elements [20, 30], len=2, cap=4\n\n    sub[0] = 999 // Mutates underlying array!\n    fmt.Println(\"Original array element mutated:\", orig[1]) // 999!\n}",
        "sandboxCode": "package main\nimport \"fmt\"\n\nfunc main() {\n    s := make([]int, 0, 3)\n    fmt.Printf(\"len=%d, cap=%d\\n\", len(s), cap(s))\n    s = append(s, 1, 2)\n    fmt.Printf(\"After append: len=%d, cap=%d\\n\", len(s), cap(s))\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The append() Backing Array Allocation Trigger",
        "prompt": "What happens when append() is called on a slice whose length equals its capacity (len == cap)?",
        "codeSnippet": "s := []int{1, 2} // len=2, cap=2\ns = append(s, 3);",
        "options": [
          {
            "text": "Go allocates a brand-new, larger backing array on the heap, copies existing elements over, updates the pointer, and doubles capacity",
            "isCorrect": true,
            "feedback": "🎯 Correct! When cap is exceeded, append allocates a new backing array, copies data, and points the slice to the new allocation. Subsequent mutations to s will no longer affect the original array!"
          },
          {
            "text": "It panics with an OutOfCapacityError",
            "isCorrect": false,
            "feedback": "append dynamically grows slices automatically."
          },
          {
            "text": "It overwrites whatever memory resides after the array",
            "isCorrect": false,
            "feedback": "Go runtime is memory-safe and prevents arbitrary buffer overflows."
          },
          {
            "text": "It drops the oldest element in the slice",
            "isCorrect": false,
            "feedback": "Slices are dynamic arrays, not ring buffers."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Memory Leaks via Sub-Slicing Large Arrays",
        "content": "Sub-slicing a tiny segment of a massive array (`small := huge_file[:5]`) keeps the **entire massive array alive in memory**! Because the slice header points to the underlying array, the garbage collector cannot reclaim it. Use `copy()` to allocate a compact slice.",
        "codeSnippet": "// ❌ MEMORY LEAK: Keeps 100MB array alive for 5 bytes:\nfunc getPrefix() []byte {\n    huge := make([]byte, 100 * 1024 * 1024)\n    return huge[:5] // Retains entire 100MB!\n}\n\n// ✅ FIXED: Copy into independent slice:\nfunc getPrefixSafe() []byte {\n    huge := make([]byte, 100 * 1024 * 1024)\n    res := make([]byte, 5)\n    copy(res, huge[:5])\n    return res // huge is reclaimed by GC!\n}",
        "tip": "Hacker Rule: Use copy() when retaining a small slice from a massive buffer to let GC reclaim the rest.",
        "arenaTarget": "game.html?lang=go&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "go-les-003",
    "language": "go",
    "difficulty": "intermediate",
    "topic": "Errors & Defer Stack",
    "title": "Chapter 3: Explicit Error Handling & The Defer Stack",
    "tagline": "Master Go's error-as-values philosophy, error wrapping (%w), and LIFO defer cleanups.",
    "estimatedMinutes": 7,
    "objectives": [
      "Understand why Go rejects exceptions in favor of explicit error values",
      "Master the LIFO (Last-In, First-Out) execution of the defer stack",
      "Wrap and inspect errors using fmt.Errorf(\"%w\"), errors.Is(), and errors.As()",
      "Understand panic and recover and when they are appropriate"
    ],
    "chapterSummary": "In many modern languages (Java, Python, C++), error handling relies on try-catch exception handling. Exceptions create invisible, non-local control flow jumps that bypass standard logic and make reasoning about failure states difficult.\n\nGo approaches reliability with **explicit error values**: errors are normal values implementing the `error` interface returned as the final tuple value. To ensure cleanup code runs deterministically without messy nesting, Go introduces the **`defer` keyword**.",
    "deepDive": {
      "title": "Error Wrapping with %w and errors.Is()",
      "content": "Go 1.13 introduced error wrapping using `fmt.Errorf(\"%w\", err)`. You can inspect whether an error tree contains a specific sentinel error using `errors.Is(err, os.ErrNotExist)` even if it is wrapped multiple layers deep!",
      "codeSnippet": "if errors.Is(err, ErrNotFound) { /* Handle missing record */ }"
    },
    "takeaways": [
      "Errors in Go are explicit values returned as the last tuple argument.",
      "defer executes calls in LIFO order right before the function returns.",
      "Arguments to defer are evaluated immediately at declaration time.",
      "Never place defer inside long loops; wrap in a function closure."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Defer Stack: LIFO Execution",
        "content": "A `defer` statement schedules a function call to execute **immediately before the enclosing function returns**.\n- Deferred calls are pushed onto a per-goroutine **LIFO stack** (Last-In, First-Out: the last deferred function runs first!).\n- Deferred arguments are evaluated **immediately** when the defer line is reached, not when it executes.",
        "codeSnippet": "package main\nimport (\n    \"fmt\"\n    \"os\"\n)\n\nfunc writeToFile(filename string) error {\n    f, err := os.Create(filename)\n    if err != nil {\n        return fmt.Errorf(\"failed to create file: %w\", err)\n    }\n    defer f.Close() // Guaranteed to run when writeToFile returns!\n\n    _, err = f.WriteString(\"SyntaxArena Go Track\")\n    return err\n}",
        "sandboxCode": "package main\nimport \"fmt\"\n\nfunc main() {\n    // LIFO Stack demonstration:\n    defer fmt.Println(\"3. First in, last out!\")\n    defer fmt.Println(\"2. Middle\")\n    defer fmt.Println(\"1. Last in, first out!\")\n    fmt.Println(\"Main execution...\")\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Defer Parameter Evaluation Gotcha",
        "prompt": "What value is printed by `defer fmt.Println(x)` when x is modified later in the function?",
        "codeSnippet": "x := 10\ndefer fmt.Println(\"Deferred x:\", x)\nx = 999\nfmt.Println(\"Current x:\", x)",
        "options": [
          {
            "text": "Current x: 999, followed by Deferred x: 10 (deferred arguments are evaluated immediately at the point of deferral)",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Go evaluates arguments to deferred functions immediately when the defer line is encountered, copying x (10). It only delays the execution of the call itself."
          },
          {
            "text": "Deferred x: 999, followed by Current x: 999",
            "isCorrect": false,
            "feedback": "Arguments are not evaluated lazily unless wrapped in an anonymous function closure."
          },
          {
            "text": "It panics with a variable mutability conflict",
            "isCorrect": false,
            "feedback": "defer executes cleanly."
          },
          {
            "text": "Deferred x: 0",
            "isCorrect": false,
            "feedback": "x had the value 10 when defer was registered."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Defer Inside a Large Loop (Resource Exhaustion)",
        "content": "Placing `defer file.Close()` inside a long-running for-loop does NOT execute at the end of each iteration! It only executes when the **entire outer function returns**, leaking file descriptors and causing \"too many open files\" crashes.",
        "codeSnippet": "// ❌ LEAKS FILE DESCRIPTORS (Runs only on function return):\nfor _, filename := range files {\n    f, _ := os.Open(filename)\n    defer f.Close() // Stack accumulates 10,000 open files!\n}\n\n// ✅ FIXED: Wrap loop body in a helper function:\nfor _, filename := range files {\n    func(name string) {\n        f, _ := os.Open(name)\n        defer f.Close() // Closes at the end of each iteration!\n    }(filename)\n}",
        "tip": "Hacker Rule: Never put defer inside a large loop; wrap the iteration in a helper function.",
        "arenaTarget": "game.html?lang=go&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "go-les-004",
    "language": "go",
    "difficulty": "expert",
    "topic": "Loop Variable Capture (Go 1.22+)",
    "title": "Chapter 4: Loop Variable Capture & Go 1.22+ Semantics",
    "tagline": "Understand the most famous bug in Go history and how Go 1.22 permanently fixed it.",
    "estimatedMinutes": 6,
    "objectives": [
      "Understand the classic loop variable capture bug that plagued Go for 12 years",
      "Analyze how goroutines and closures captured the same memory address across iterations",
      "Understand the Go 1.22 language specification change: per-iteration variable scoping",
      "Write backward-compatible concurrent loops safely"
    ],
    "chapterSummary": "Between Go 1.0 (2012) and Go 1.21 (2023), the single most common bug encountered by Go developers was **Loop Variable Capture**.\n\nIn legacy Go, a `for` loop declared its iteration variable once for the entire loop. When spawning goroutines inside a loop, all concurrent closures captured the **address of the single shared loop variable**, racing against the loop and reading only the final iteration value! In Go 1.22, the Go team made a historic language specification change.",
    "deepDive": {
      "title": "Compiler Escape Analysis & Heap Migration",
      "content": "When an inner function closure references a local variable, the Go compiler performs **Escape Analysis** (`go build -gcflags=\"-m\"`). The compiler detects that the variable outlives the stack frame and automatically migrates it to the **heap**.",
      "codeSnippet": "go build -gcflags=\"-m\" main.go # Displays: moved to heap: i"
    },
    "takeaways": [
      "Prior to Go 1.22, loop variables were declared once per loop, causing closure race bugs.",
      "Go 1.22+ allocates a new variable binding on each loop iteration.",
      "Legacy fix: pass loop variables as function arguments go func(v) { }(v).",
      "The Go compiler uses Escape Analysis to allocate escaping variables on the heap."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Classic Loop Variable Capture Problem",
        "content": "In Go versions prior to 1.22:\n```go\nfor _, v := range values {\n    go func() {\n        fmt.Println(v) // All goroutines read the exact same variable address!\n    }()\n}\n```\nBy the time the goroutines were scheduled, the loop had finished, and all goroutines printed the **last element**!\n\n**The Go 1.22 Fix**: Starting in Go 1.22, each loop iteration creates a **brand-new variable binding**, eliminating the bug permanently!",
        "codeSnippet": "package main\nimport (\n    \"fmt\"\n    \"sync\"\n)\n\nfunc main() {\n    var wg sync.WaitGroup\n    // In Go 1.22+, i is scoped per iteration!\n    for i := 1; i <= 3; i++ {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n            fmt.Println(\"Goroutine i:\", i) // In Go 1.22+, reliably prints 1, 2, 3!\n        }()\n    }\n    wg.Wait()\n}",
        "sandboxCode": "package main\nimport \"fmt\"\n\nfunc main() {\n    var funcs []func()\n    for i := 0; i < 3; i++ {\n        funcs = append(funcs, func() { fmt.Println(\"Captured:\", i) })\n    }\n    for _, f := range funcs { f() }\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Legacy Go Closure Workaround",
        "prompt": "How did developers safely prevent loop variable capture in Go versions prior to 1.22?",
        "codeSnippet": "for _, v := range items {\n    // Legacy fix pattern?\n}",
        "options": [
          {
            "text": "Pass v as an explicit argument to the goroutine function (go func(val string) { ... }(v)) or shadow it with v := v",
            "isCorrect": true,
            "feedback": "🎯 Exactly! In legacy Go, passing v as an argument evaluated it immediately, copying the value to the goroutine stack, or declaring v := v shadowed it into block scope."
          },
          {
            "text": "Convert the slice into a channel",
            "isCorrect": false,
            "feedback": "Channels do not alter loop variable scoping."
          },
          {
            "text": "Declare the loop variable as a global pointer",
            "isCorrect": false,
            "feedback": "Global variables exacerbate race conditions."
          },
          {
            "text": "Add a time.Sleep after each loop iteration",
            "isCorrect": false,
            "feedback": "Sleeping is a non-deterministic hack that does not eliminate the race condition."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Assuming Legacy Behavior in Go 1.22+",
        "content": "While Go 1.22 fixed loop variables, relying on it when authoring shared libraries that must support older Go toolchains (like Go 1.20) will break when compiled by users on older compiler versions!",
        "codeSnippet": "// For maximum backwards-compatibility with Go < 1.22:\nfor _, v := range items {\n    v := v // Explicitly shadow to support older Go compilers safely!\n    go process(v)\n}",
        "tip": "Hacker Rule: In public open-source Go libraries, continue using explicit parameter passing for backwards compatibility.",
        "arenaTarget": "game.html?lang=go&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "go-les-005",
    "language": "go",
    "difficulty": "expert",
    "topic": "Goroutines & Channels",
    "title": "Chapter 5: Goroutines, Channels & The CSP Concurrency Model",
    "tagline": "Master lightweight goroutines, channel synchronization, select multiplexing, and deadlocks.",
    "estimatedMinutes": 8,
    "objectives": [
      "Master the Communicating Sequential Processes (CSP) concurrency philosophy",
      "Understand how the Go M:N runtime scheduler multiplexes goroutines across OS threads",
      "Differentiate between unbuffered (synchronous) vs buffered (asynchronous) channels",
      "Master non-blocking multiplexing using the select statement"
    ],
    "chapterSummary": "The motto of Go concurrency is:\n*\"Do not communicate by sharing memory; instead, share memory by communicating.\"*\n\nRather than protecting shared memory with fragile mutex locks that risk deadlocks, Go adopts Tony Hoare's **CSP (Communicating Sequential Processes)** model. Applications spawn lightweight **Goroutines** (starting at only 2KB of stack space) that coordinate by passing data messages across typed **Channels**.",
    "deepDive": {
      "title": "Multiplexing with the select Statement",
      "content": "The `select` statement allows a goroutine to wait on multiple channel operations simultaneously. If multiple channels are ready, Go picks one at pseudo-random to prevent starvation. A `default` case makes communication non-blocking.",
      "codeSnippet": "select {\ncase msg := <-ch1: fmt.Println(msg)\ncase <-time.After(1 * time.Second): fmt.Println(\"Timeout!\")\n}"
    },
    "takeaways": [
      "Do not communicate by sharing memory; share memory by communicating.",
      "Unbuffered channels require a synchronous rendezvous between sender and receiver.",
      "Sending to a closed channel causes a fatal panic; reading returns (zero, false).",
      "Use select to multiplex channel operations and implement timeouts."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The M:N Go Scheduler & Channels",
        "content": "The Go runtime multiplexes `M` goroutines across `N` OS kernel threads using a work-stealing scheduler.\n\nChannels are typed message queues:\n- **Unbuffered (`make(chan int)`)**: Synchronous rendezvous. The sender blocks until the receiver is ready, and vice versa!\n- **Buffered (`make(chan int, 5)`)**: Asynchronous buffer. The sender only blocks if the buffer is full.\n\nClosing a channel (`close(ch)`) broadcasts a termination signal to all listening receivers.",
        "codeSnippet": "package main\nimport \"fmt\"\n\nfunc worker(id int, ch chan int) {\n    ch <- id * 10 // Sends result into channel (blocks until received)\n}\n\nfunc main() {\n    ch := make(chan int) // Unbuffered synchronous channel\n    go worker(1, ch)\n    go worker(2, ch)\n\n    res1 := <-ch // Receives from whichever worker finishes first\n    res2 := <-ch\n    fmt.Printf(\"Received: %d and %d\\n\", res1, res2)\n}",
        "sandboxCode": "package main\nimport \"fmt\"\n\nfunc main() {\n    ch := make(chan string, 2) // Buffered capacity of 2\n    ch <- \"Alpha\"\n    ch <- \"Bravo\"\n    close(ch)\n\n    for msg := range ch {\n        fmt.Println(\"Message:\", msg)\n    }\n}"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Unbuffered Channel Deadlock Trap",
        "prompt": "What happens when a single goroutine attempts to send data to an unbuffered channel without an active receiver running concurrently?",
        "codeSnippet": "ch := make(chan int)\nch <- 42 // Sending on unbuffered channel on main goroutine!",
        "options": [
          {
            "text": "A fatal runtime crash occurs: fatal error: all goroutines are asleep - deadlock!",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Unbuffered channels require a simultaneous receiver. Because main blocks waiting for a receiver and no other goroutines exist, the Go runtime detects an unrecoverable deadlock and crashes."
          },
          {
            "text": "The value 42 is discarded silently",
            "isCorrect": false,
            "feedback": "Go channels never drop messages silently."
          },
          {
            "text": "The channel automatically converts to buffered",
            "isCorrect": false,
            "feedback": "Channel buffering is permanently fixed upon make() creation."
          },
          {
            "text": "It compiles and executes cleanly",
            "isCorrect": false,
            "feedback": "It crashes with a runtime deadlock."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Writing to a Closed Channel Panics",
        "content": "While reading from a closed channel safely returns the zero value and `false`, attempting to **send data to a closed channel triggers a fatal runtime panic**! Only the sender should close a channel.",
        "codeSnippet": "// ❌ FATAL PANIC:\nclose(ch)\nch <- 100 // panic: send on closed channel!\n\n// ✅ SAFE RECEIVE FROM CLOSED CHANNEL:\nval, ok := <-ch\nif !ok { fmt.Println(\"Channel closed!\") }",
        "tip": "Hacker Rule: The sender must always be the one to close a channel, never the receiver.",
        "arenaTarget": "game.html?lang=go&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "html-les-001",
    "language": "html",
    "difficulty": "beginner",
    "topic": "Semantic HTML5 & Accessibility",
    "title": "Chapter 1: Semantic HTML5, ARIA & Accessibility Foundations",
    "tagline": "Master semantic landmarks, screen reader accessibility trees, and skip links.",
    "estimatedMinutes": 6,
    "objectives": [
      "Master semantic HTML5 landmark tags (<header>, <main>, <nav>, <article>, <aside>, <footer>)",
      "Understand the Accessibility Tree constructed by browser layout engines",
      "Understand the First Rule of ARIA: Do not use ARIA when native HTML tags exist",
      "Implement keyboard navigation focus rings and accessible skip links"
    ],
    "chapterSummary": "A generic webpage composed entirely of `<div class=\"header\">` and `<div onclick=\"...\">` is functionally invisible to assistive technologies (screen readers, braille displays) and search engine crawlers. Browsers parse semantic HTML into an **Accessibility Tree** running parallel to the DOM.\n\nUsing **Semantic HTML5** elements conveys intrinsic meaning, keyboard focus behaviors, and accessibility roles out of the box, guaranteeing accessible, WCAG-compliant web experiences without bloat.",
    "deepDive": {
      "title": "Accessible Skip Links",
      "content": "A **Skip Link** is an anchor placed as the very first element in the `<body>`, hidden off-screen until focused with Tab. It allows screen reader and keyboard users to skip past repetitive navigation bars directly to `#main-content`.",
      "codeSnippet": ".skip-link { position: absolute; top: -100px; }\n.skip-link:focus { top: 10px; left: 10px; z-index: 10000; }"
    },
    "takeaways": [
      "Semantic tags convey intrinsic meaning to search engines and screen readers.",
      "Always have exactly one <main> element per document.",
      "The First Rule of ARIA: Use native HTML elements instead of ARIA roles whenever possible.",
      "Never use clickable <div> tags; always use native <button> elements."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Semantic HTML5 Landmark Elements",
        "content": "Standard semantic structural landmarks:\n- `<header>`: Introductory content or site branding.\n- `<nav>`: Major navigation links (screen readers provide shortcuts to jump directly here).\n- `<main>`: The dominant, non-repeated central content of the document (exactly one per page!).\n- `<article>`: Standalone self-contained content (blog post, forum comment, widget).\n- `<aside>`: Tangentially related secondary content (sidebars, callout boxes).\n- `<footer>`: Author, copyright, and closing links.",
        "codeSnippet": "<!-- Accessible Semantic Document Layout -->\n<header>\n  <a href=\"#main\" class=\"skip-link\">Skip to main content</a>\n  <nav aria-label=\"Primary Navigation\">\n    <a href=\"/\">Home</a>\n    <a href=\"/academy\">Academy</a>\n  </nav>\n</header>\n\n<main id=\"main\">\n  <article>\n    <h1>Semantic Web Architecture</h1>\n    <p>Accessible by default without hacks.</p>\n  </article>\n</main>\n\n<footer>\n  <p>&copy; 2026 SyntaxArena</p>\n</footer>",
        "sandboxCode": "<nav aria-label=\"Demo Nav\">\n  <button type=\"button\">Accessible Button</button>\n  <a href=\"#test\">Accessible Link</a>\n</nav>"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The First Rule of ARIA",
        "prompt": "What is the official W3C \"First Rule of ARIA\"?",
        "codeSnippet": "<!-- Which is preferred? -->\n<!-- Option A: <div role=\"button\" tabindex=\"0\">Click</div> -->\n<!-- Option B: <button type=\"button\">Click</button> -->",
        "options": [
          {
            "text": "Do not use ARIA if you can use a native HTML element or attribute with the semantics and behavior you require",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Native elements like <button> automatically provide keyboard focus, Space/Enter activation, and accessibility roles with zero JavaScript boilerplate. ARIA is a fallback, not a replacement."
          },
          {
            "text": "Always add role=\"button\" to every clickable element",
            "isCorrect": false,
            "feedback": "Adding redundant roles to native elements creates noise and breaks behaviors."
          },
          {
            "text": "ARIA is strictly required for mobile devices",
            "isCorrect": false,
            "feedback": "Mobile browsers support native HTML elements natively."
          },
          {
            "text": "Use divs for all interactive controls to prevent browser styling",
            "isCorrect": false,
            "feedback": "Using divs for buttons breaks keyboard accessibility and screen readers."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Clickable Divs Breaking Keyboard Accessibility",
        "content": "Attaching a click event to a `<div onclick=\"...\">` makes it completely unreachable for users with motor disabilities who navigate via keyboards! Divs cannot receive focus via Tab and do not respond to Enter or Space keys.",
        "codeSnippet": "<!-- ❌ INACCESSIBLE (Unreachable by keyboard, no role): -->\n<div class=\"btn\" onclick=\"submit()\">Submit</div>\n\n<!-- ✅ ACCESSIBLE NATIVE BUTTON: -->\n<button type=\"button\" class=\"btn\" onclick=\"submit()\">Submit</button>",
        "tip": "Hacker Rule: Always use native <button> elements for interactive actions; never use clickable <div> tags.",
        "arenaTarget": "game.html?lang=html&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "html-les-002",
    "language": "html",
    "difficulty": "beginner",
    "topic": "CSS Box Model",
    "title": "Chapter 2: The CSS Box Model, Sizing & Margin Collapsing",
    "tagline": "Master content-box vs border-box, vertical margin collapsing, and layout debugging.",
    "estimatedMinutes": 6,
    "objectives": [
      "Master the four concentric areas of the CSS Box Model (Content, Padding, Border, Margin)",
      "Contrast legacy content-box with modern box-sizing: border-box",
      "Understand the mechanics of Vertical Margin Collapsing in Block Formatting Contexts",
      "Eliminate unexpected layout overflows caused by padding and border additions"
    ],
    "chapterSummary": "In CSS, every visible element on the page generates a rectangular bounding box. The browser layout engine calculates geometry, sizing, and position using the **CSS Box Model**.\n\nA fundamental rite of passage for web developers is discovering why an element with `width: 100%` overflows its parent container when `padding` or `border` is added—and understanding how modern **`box-sizing: border-box`** permanently fixes layout mathematics.",
    "deepDive": {
      "title": "Preventing Margin Collapsing with BFC or Flexbox",
      "content": "Margin collapsing only occurs in standard Block Formatting Contexts (BFC). Margins **never collapse** between Flexbox items, CSS Grid children, or elements with `overflow: hidden` or `display: flow-root`.",
      "codeSnippet": ".container { display: flex; flex-direction: column; } /* Margins never collapse! */"
    },
    "takeaways": [
      "The box model consists of Content, Padding, Border, and Margin.",
      "Always set box-sizing: border-box to keep total element dimensions predictable.",
      "Adjacent vertical margins in block flow collapse to the largest margin value.",
      "Flexbox and Grid child items never suffer from margin collapsing."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Four Concentric Zones & box-sizing: border-box",
        "content": "The Box Model consists of 4 zones from inside out:\n1. **Content**: The text, image, or children.\n2. **Padding**: Transparent inner spacing around content.\n3. **Border**: The rendered stroke boundary.\n4. **Margin**: Transparent outer spacing separating elements.\n\n- `content-box` (default): `width` applies ONLY to content. Adding 20px padding makes total width `100% + 40px` (overflow!).\n- `border-box` (modern standard): `width` includes Content + Padding + Border!",
        "codeSnippet": "/* Modern CSS Reset Standard: */\n*, *::before, *::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\n.card {\n  width: 300px;\n  padding: 24px;\n  border: 2px solid #6366f1;\n  /* Total rendered width remains exactly 300px! */\n}",
        "sandboxCode": "<div style=\"box-sizing: border-box; width: 200px; padding: 20px; border: 4px solid #10b981; background: #11141d;\">\n  Border-box (exactly 200px)\n</div>"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Vertical Margin Collapsing Mechanics",
        "prompt": "If element A has margin-bottom: 30px and the immediately following element B has margin-top: 20px, what is the vertical gap between them?",
        "codeSnippet": ".first { margin-bottom: 30px; }\n.second { margin-top: 20px; }",
        "options": [
          {
            "text": "30px (the margins collapse into a single margin equal to the maximum of the two values)",
            "isCorrect": true,
            "feedback": "🎯 Exactly! In normal block flow, adjacent vertical margins collapse into a single margin equal to the largest value (max(30px, 20px) = 30px), NOT their sum!"
          },
          {
            "text": "50px (the sum of both margins)",
            "isCorrect": false,
            "feedback": "Margins do not add together vertically in standard block flow."
          },
          {
            "text": "10px (the difference between them)",
            "isCorrect": false,
            "feedback": "Margins never subtract from one another."
          },
          {
            "text": "20px (the smaller margin wins)",
            "isCorrect": false,
            "feedback": "The larger margin always dominates."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Unexpected Overflow in Nested Containers",
        "content": "Forgetting to apply `box-sizing: border-box` globally causes input fields with `width: 100%` and `padding: 12px` to punch through their parent cards, causing ugly horizontal scrollbars on mobile viewports!",
        "codeSnippet": "/* ❌ BREAKS MOBILE VIEWPORTS: */\ninput { width: 100%; padding: 12px; } /* Total width: 100% + 24px! */\n\n/* ✅ FIXED: */\n*, *::before, *::after { box-sizing: border-box; }",
        "tip": "Hacker Rule: Always include *, *::before, *::after { box-sizing: border-box; } at the top of your global CSS stylesheet.",
        "arenaTarget": "game.html?lang=html&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "html-les-003",
    "language": "html",
    "difficulty": "intermediate",
    "topic": "Flexbox vs CSS Grid",
    "title": "Chapter 3: Modern Layout Systems: Flexbox vs CSS Grid",
    "tagline": "Master 1D linear layouts with Flexbox and 2D matrix architectures with CSS Grid.",
    "estimatedMinutes": 7,
    "objectives": [
      "Master the fundamental distinction: Flexbox (1D linear axis) vs CSS Grid (2D matrix)",
      "Master Flexbox alignment: justify-content (main axis) vs align-items (cross axis)",
      "Master CSS Grid: grid-template-columns, fr units, and repeat(auto-fit, minmax(...))",
      "Build fully responsive grid cards with zero media queries"
    ],
    "chapterSummary": "In early web design, layouts relied on tables, floats, and inline-block hacks that were fragile and difficult to maintain. Modern CSS provides two complementary, first-class layout engines:\n1. **Flexbox**: Engineered for **one-dimensional** layouts (laying out items along a single row OR single column).\n2. **CSS Grid**: Engineered for **two-dimensional** layouts (controlling rows and columns simultaneously).\n\nUnderstanding when to use Flexbox vs Grid is the hallmark of modern senior frontend engineering.",
    "deepDive": {
      "title": "auto-fit vs auto-fill in CSS Grid",
      "content": "When items do not fill the row:\n- `auto-fill`: Preserves empty grid tracks (keeps empty space).\n- `auto-fit`: Collapses empty tracks to 0px, allowing existing items to expand and fill the entire row width.",
      "codeSnippet": "grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));"
    },
    "takeaways": [
      "Flexbox is 1D (rows or columns); CSS Grid is 2D (rows and columns simultaneously).",
      "Use repeat(auto-fit, minmax(min, 1fr)) for responsive cards with zero media queries.",
      "Use Flexbox for aligning small components and UI controls.",
      "Set min-width: 0 on flex children to allow text ellipsis truncation."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Flexbox (1D) vs CSS Grid (2D)",
        "content": "Rule of Thumb:\n- Use **Flexbox** when content dictates size: navigation bars, button groups, badge chips, centering modal content.\n- Use **CSS Grid** when the container dictates layout: dashboard cards, gallery grids, full page scaffolding.\n\nThe most powerful CSS Grid pattern is the **RAM pattern** (Repeat, Auto, Minmax): `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`, creating a fully responsive grid with zero media queries!",
        "codeSnippet": "/* Perfect Centering with Flexbox: */\n.center-box {\n  display: flex;\n  justify-content: center; /* Main axis */\n  align-items: center;     /* Cross axis */\n}\n\n/* Responsive Grid with Zero Media Queries: */\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}",
        "sandboxCode": "<div style=\"display: flex; justify-content: space-between; align-items: center; background: #11141d; padding: 12px; border: 1px solid #1f2432;\">\n  <span>Brand</span>\n  <div style=\"display: flex; gap: 8px;\">\n    <span>Hub</span>\n    <span>Arena</span>\n  </div>\n</div>"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The RAM Grid Pattern Check",
        "prompt": "What behavior does `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` provide across different screen widths?",
        "codeSnippet": "display: grid;\ngrid-template-columns: repeat(auto-fit, minmax(250px, 1fr));",
        "options": [
          {
            "text": "It creates as many columns as fit with a minimum width of 250px, expanding them equally to fill remaining space, automatically wrapping on small screens without media queries",
            "isCorrect": true,
            "feedback": "🎯 Exactly! auto-fit fits maximum columns into the viewport; minmax(250px, 1fr) ensures cards never drop below 250px and stretch to share leftover space equally. No media queries required!"
          },
          {
            "text": "It fixes the layout permanently at exactly 250 columns",
            "isCorrect": false,
            "feedback": "250px is the minimum track size, not the column count."
          },
          {
            "text": "It crops all content that exceeds 250px",
            "isCorrect": false,
            "feedback": "1fr expands elements to fill available width."
          },
          {
            "text": "It throws a CSS parsing error on mobile Safari",
            "isCorrect": false,
            "feedback": "CSS Grid repeat and minmax have 99%+ global browser support."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Flexbox Text Overflow without min-width: 0",
        "content": "By default in Flexbox, flex children have `min-width: auto`. If an inner text element has `text-overflow: ellipsis`, it will **refuse to truncate and cause flex container overflow** unless you explicitly set `min-width: 0` on the flex child!",
        "codeSnippet": "/* ❌ TRUNCATION FAILS: Flex item overflows container: */\n.flex-item { display: flex; }\n.truncate-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n\n/* ✅ FIXED: Set min-width: 0 on flex item: */\n.flex-item { min-width: 0; }",
        "tip": "Hacker Rule: Always add min-width: 0 to flex children when truncating text with text-overflow: ellipsis.",
        "arenaTarget": "game.html?lang=html&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "html-les-004",
    "language": "html",
    "difficulty": "expert",
    "topic": "Cascade & Specificity",
    "title": "Chapter 4: The Cascade, Specificity & Cascade Layers (@layer)",
    "tagline": "Master CSS specificity scoring, !important reversal, and modern @layer priority control.",
    "estimatedMinutes": 8,
    "objectives": [
      "Master the CSS Specificity scoring formula: Inline > ID > Class/Attribute/Pseudo-class > Element",
      "Understand how the Cascade resolves competing style declarations",
      "Understand the dangerous reversal of !important in specificity wars",
      "Organize architecture cleanly using modern CSS Cascade Layers (@layer)"
    ],
    "chapterSummary": "The \"C\" in CSS stands for **Cascade**: the algorithmic decision tree the browser applies when multiple competing style rules target the same DOM element.\n\nWithout understanding specificity calculation, developers fall into the trap of \"specificity wars\": escalating selectors from `.card` to `div.container .card.active`, and ultimately resorting to `!important`. Modern CSS introduces **Cascade Layers (`@layer`)**, enabling architects to control priority independently of selector specificity!",
    "deepDive": {
      "title": "Modern CSS Cascade Layers (@layer)",
      "content": "CSS Cascade Layers (`@layer`) allow developers to explicitly define the order of precedence. Rules in later layers **always beat rules in earlier layers**, regardless of selector specificity!",
      "codeSnippet": "@layer reset, framework, components, utilities;\n\n@layer components {\n  .btn { background: #6366f1; } /* Specificity 0,0,1,0 */\n}\n@layer utilities {\n  .hidden { display: none; } /* Wins over components! */\n}"
    },
    "takeaways": [
      "Specificity: Inline > ID > Class/Attribute/Pseudo-class > Element.",
      "A higher specificity category always defeats any number of lower-tier selectors.",
      "Never use !important to fix specificity bugs in production CSS.",
      "Use modern CSS @layer to control architectural priority cleanly."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Specificity Weight Formula (A, B, C, D)",
        "content": "Specificity is evaluated as a 4-tier tuple:\n1. **Inline Styles** (`style=\"...\"`): `1, 0, 0, 0`\n2. **ID Selectors** (`#header`): `0, 1, 0, 0`\n3. **Classes, Attributes, Pseudo-classes** (`.btn`, `[type=\"text\"]`, `:hover`): `0, 0, 1, 0`\n4. **Elements & Pseudo-elements** (`h1`, `div`, `::before`): `0, 0, 0, 1`\n\nA single class (`0, 0, 1, 0`) beats 100 nested element selectors (`0, 0, 0, 100`)!",
        "codeSnippet": "/* Specificity 0, 0, 0, 1: */\nh1 { color: #94a3b8; }\n\n/* Specificity 0, 0, 1, 0 (Wins!): */\n.page-title { color: #f1f5f9; }\n\n/* Specificity 0, 1, 0, 0 (Dominates!): */\n#hero-heading { color: #6366f1; }",
        "sandboxCode": "<div id=\"card\" class=\"box panel\" style=\"color: #6366f1;\">\n  Inline style specificity beats ID and Classes!\n</div>"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Specificity Calculation Quiz",
        "prompt": "Between `nav.menu ul li a.active` (A) and `#main-nav a` (B), which rule wins and why?",
        "codeSnippet": "/* A: nav.menu ul li a.active */\n/* B: #main-nav a */",
        "options": [
          {
            "text": "B wins (0, 1, 0, 1 beats 0, 0, 2, 3 because B contains an ID selector)",
            "isCorrect": true,
            "feedback": "🎯 Correct! Specificity is evaluated from left to right. Rule B has one ID (0, 1, 0, 1). Rule A has zero IDs (0, 0, 2, 3). No amount of classes or elements can ever overcome a single ID selector!"
          },
          {
            "text": "A wins because it has more total selectors and is longer",
            "isCorrect": false,
            "feedback": "Selector length is irrelevant; higher specificity categories always beat lower ones."
          },
          {
            "text": "A wins because active is a pseudo-class",
            "isCorrect": false,
            "feedback": "active in this snippet is a class (.active), possessing only (0, 0, 1, 0)."
          },
          {
            "text": "Neither; they cancel each other out",
            "isCorrect": false,
            "feedback": "CSS cascade always resolves deterministically."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "The !important Specificity Escalation War",
        "content": "Adding `!important` does NOT increase specificity—it shifts the declaration into a separate, higher-priority origin tier. To override an `!important` rule, you must write another `!important` rule with higher specificity, quickly poisoning the codebase!",
        "codeSnippet": "/* ❌ SPECIFICITY POISON: */\n.btn { background: blue !important; }\n/* Now impossible to override normally! */\n.btn-danger { background: red !important; } /* Escalation! */",
        "tip": "Hacker Rule: Never use !important in component stylesheets; use Cascade Layers (@layer) to manage priority.",
        "arenaTarget": "game.html?lang=html&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "html-les-005",
    "language": "html",
    "difficulty": "expert",
    "topic": "Native Dialog & Top Layer",
    "title": "Chapter 5: Native HTML5 Dialog, Popover API & The Top Layer",
    "tagline": "Master the native <dialog> element, browser Top Layer rendering, and the Popover API.",
    "estimatedMinutes": 8,
    "objectives": [
      "Master the native HTML5 <dialog> element and showModal() vs show()",
      "Understand the browser Top Layer rendering above all z-index stacking contexts",
      "Style modal backdrops natively using the ::backdrop pseudo-element",
      "Use the modern Popover API for tooltips and floating menus with zero JavaScript"
    ],
    "chapterSummary": "For over two decades, implementing a modal dialog or popup drawer required complex JavaScript hacks: managing manual `z-index: 999999` wars, trapping keyboard focus with custom event loops, listening for the Escape key, and rendering background overlay divs.\n\nModern HTML5 solves this with the native **`<dialog>` element** and the **Top Layer**. The Top Layer is a dedicated browser rendering plane that paints directly above the entire DOM document, rendering `z-index` conflicts completely obsolete!",
    "deepDive": {
      "title": "The Modern Popover API (HTML 2024)",
      "content": "Modern HTML supports the `popover` attribute. Adding `popover` to any element and `popovertarget=\"id\"` to a button gives you accessible dismiss-on-click-outside popovers with **zero JavaScript**!",
      "codeSnippet": "<button popovertarget=\"my-menu\">Toggle Menu</button>\n<div id=\"my-menu\" popover>Floating Menu Content</div>"
    },
    "takeaways": [
      "The native <dialog> element eliminates custom JavaScript modal libraries.",
      "dialog.showModal() promotes the element to the Top Layer above all z-indexes.",
      "Style modal backdrops natively using the ::backdrop pseudo-element.",
      "The Popover API provides accessible floating menus and tooltips with zero JS."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Native <dialog> Element & showModal()",
        "content": "When you invoke `dialog.showModal()`:\n1. The browser promotes the dialog to the **Top Layer** (rendering above all stacking contexts).\n2. It renders an automatic **`::backdrop`** pseudo-element behind the dialog.\n3. It traps keyboard focus inside the dialog automatically.\n4. It closes the dialog automatically when the user presses **Escape**, firing the `close` event!",
        "codeSnippet": "<!-- Accessible Native Modal Dialog -->\n<dialog id=\"confirmModal\">\n  <form method=\"dialog\">\n    <h2>Confirm Sector Overwrite</h2>\n    <p>Are you sure you want to deploy the cyber payload?</p>\n    <menu>\n      <button value=\"cancel\">Cancel</button>\n      <button value=\"confirm\" class=\"btn-primary\">Confirm</button>\n    </menu>\n  </form>\n</dialog>\n\n<script>\n  const dialog = document.getElementById(\"confirmModal\");\n  // dialog.showModal(); // Opens modal in Top Layer!\n</script>",
        "sandboxCode": "<dialog id=\"demoDialog\" style=\"background: #11141d; color: #f1f5f9; border: 1px solid #6366f1; padding: 20px; border-radius: 8px;\">\n  <p>Native Dialog in Top Layer</p>\n  <button onclick=\"document.getElementById('demoDialog').close()\">Close</button>\n</dialog>\n<button onclick=\"document.getElementById('demoDialog').show()\">Open Non-Modal</button>"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "showModal() vs show() Difference",
        "prompt": "What is the critical behavioral difference between dialog.showModal() and dialog.show()?",
        "codeSnippet": "const d = document.querySelector(\"dialog\");\n// d.showModal(); vs d.show();",
        "options": [
          {
            "text": "showModal() promotes the dialog to the Top Layer with a ::backdrop, locks background interaction, and enables Escape key closing; show() opens it as a non-modal inline box",
            "isCorrect": true,
            "feedback": "🎯 Exactly! showModal() creates a true modal dialog with keyboard trapping, backdrop, and Top Layer promotion. show() merely opens the dialog as a standard inline positioned element."
          },
          {
            "text": "show() requires HTTPS; showModal() works on HTTP",
            "isCorrect": false,
            "feedback": "Both work across all web protocols."
          },
          {
            "text": "showModal() is deprecated in favor of show()",
            "isCorrect": false,
            "feedback": "showModal() is the modern standard for modal dialogs."
          },
          {
            "text": "There is zero difference; they are aliases",
            "isCorrect": false,
            "feedback": "Their accessibility and layout behavior are fundamentally distinct."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Styling ::backdrop with z-index",
        "content": "Developers often attempt to set `z-index` on `dialog::backdrop`. However, because the Top Layer exists completely outside the document z-index hierarchy, **z-index has zero effect on dialogs or backdrops**!",
        "codeSnippet": "/* ❌ HAS ZERO EFFECT IN TOP LAYER: */\ndialog::backdrop { z-index: 99999; }\n\n/* ✅ PROPER BACKDROP STYLING: */\ndialog::backdrop {\n  background: rgba(0, 0, 0, 0.7);\n  backdrop-filter: blur(4px);\n}",
        "tip": "Hacker Rule: Use <dialog method=\"dialog\"> forms so submit buttons close the dialog and set returnValue automatically.",
        "arenaTarget": "game.html?lang=html&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "asm-les-001",
    "language": "asm",
    "difficulty": "beginner",
    "topic": "x86-64 Registers & Calling Conventions",
    "title": "Chapter 1: General-Purpose Registers & System V Calling Conventions",
    "tagline": "Master the 16 64-bit CPU registers, System V ABI argument passing, and stack alignment.",
    "estimatedMinutes": 6,
    "objectives": [
      "Master the 16 64-bit general-purpose CPU registers in x86-64 architecture",
      "Understand the System V AMD64 ABI calling convention argument registers (RDI, RSI, RDX, RCX, R8, R9)",
      "Identify the return value register (RAX) and stack pointers (RSP, RBP)",
      "Distinguish between caller-saved (scratch) and callee-saved (preserved) registers"
    ],
    "chapterSummary": "At the lowest level of software execution, the CPU does not understand C++, Python, or Rust. It executes raw machine code instructions that manipulate bits inside physical on-chip memory slots called **Registers**.\n\nIn x86-64 (AMD64) architecture, the CPU provides **16 general-purpose 64-bit registers**. Understanding how the operating system calling convention (System V ABI on Linux/macOS) maps function arguments into registers is the cornerstone of binary reverse engineering and exploit development.",
    "deepDive": {
      "title": "Callee-Saved vs Caller-Saved Registers",
      "content": "Registers are divided into:\n- **Caller-Saved (Scratch)**: `RAX`, `RCX`, `RDX`, `RSI`, `RDI`, `R8`-`R11`. Functions can overwrite these freely.\n- **Callee-Saved (Preserved)**: `RBX`, `RSP`, `RBP`, `R12`-`R15`. If a function uses these, it must preserve them with `push` and `pop`.",
      "codeSnippet": "push rbx    ; Save callee-saved register\n; ... use rbx ...\npop rbx     ; Restore before ret"
    },
    "takeaways": [
      "x86-64 provides 16 general-purpose 64-bit CPU registers.",
      "System V ABI passes the first 6 arguments in RDI, RSI, RDX, RCX, R8, R9.",
      "Function return values are returned in the RAX register.",
      "The stack pointer (RSP) must be 16-byte aligned before calling external functions."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The 16 Registers & The System V ABI Calling Convention",
        "content": "When function `foo(a, b, c, d, e, f)` is called on Linux x86-64, arguments are passed directly in CPU registers in strict order:\n1. 1st Argument: **`RDI`**\n2. 2nd Argument: **`RSI`**\n3. 3rd Argument: **`RDX`**\n4. 4th Argument: **`RCX`**\n5. 5th Argument: **`R8`**\n6. 6th Argument: **`R9`**\n\nThe return value is placed in **`RAX`**. Stack pointer **`RSP`** points to the top of the stack, and **`RBP`** acts as the base frame pointer.",
        "codeSnippet": "; System V Calling Convention in Assembly:\n; Function: add_two(rdi, rsi) -> rax\nglobal add_two\nadd_two:\n    mov rax, rdi    ; Copy 1st argument (rdi) into return register (rax)\n    add rax, rsi    ; Add 2nd argument (rsi) to rax\n    ret             ; Return to caller (result in rax)",
        "sandboxCode": "; x86-64 Register Math Demo:\nmov rdi, 10\nmov rsi, 20\nmov rax, rdi\nadd rax, rsi ; rax is now 30"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Argument Register Sequence in Reverse Engineering",
        "prompt": "When disassembling a function call `sum(10, 20, 30)`, which registers receive the values 10, 20, and 30 under the System V ABI?",
        "codeSnippet": "mov edi, 10\nmov esi, 20\nmov edx, 30\ncall sum",
        "options": [
          {
            "text": "RDI receives 10, RSI receives 20, RDX receives 30 (EDI, ESI, EDX are their 32-bit sub-registers)",
            "isCorrect": true,
            "feedback": "🎯 Correct! The System V ABI specifies: 1st in RDI (EDI), 2nd in RSI (ESI), 3rd in RDX (EDX)."
          },
          {
            "text": "RAX receives 10, RBX receives 20, RCX receives 30",
            "isCorrect": false,
            "feedback": "RAX is for return values; RBX is a callee-saved register."
          },
          {
            "text": "All arguments are pushed to the stack in reverse order",
            "isCorrect": false,
            "feedback": "That is the legacy 32-bit cdecl convention; 64-bit passes first 6 args in registers."
          },
          {
            "text": "RSP, RBP, and RIP",
            "isCorrect": false,
            "feedback": "Those are special-purpose pointer registers."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Violating the 16-byte Stack Alignment Rule",
        "content": "The x86-64 System V ABI mandates that the stack pointer (`RSP`) must be **aligned to a 16-byte boundary** immediately before executing a `call` instruction! Calling C library functions (`printf`) with misaligned stack triggers an immediate SIMD crash.",
        "codeSnippet": "; ❌ SEGFAULT (RSP is not 16-byte aligned before call):\nsub rsp, 8\ncall printf ; Crashes on movaps inside glibc!\n\n; ✅ PROPER 16-BYTE ALIGNMENT:\nsub rsp, 16 ; 16-byte boundary maintained!\ncall printf\nadd rsp, 16",
        "tip": "Hacker Rule: Ensure (RSP + 8) % 16 == 0 inside function bodies before calling external functions.",
        "arenaTarget": "game.html?lang=asm&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "asm-les-002",
    "language": "asm",
    "difficulty": "beginner",
    "topic": "Register Sub-Registers & Zero Extension",
    "title": "Chapter 2: Register Sub-Registers & Automatic Zero-Extension",
    "tagline": "Understand 32-bit, 16-bit, and 8-bit sub-registers and the 32-bit zero-extension rule.",
    "estimatedMinutes": 6,
    "objectives": [
      "Master the register sub-division hierarchy (RAX -> EAX -> AX -> AH/AL)",
      "Understand the critical architectural rule: 32-bit operations automatically zero the upper 32 bits",
      "Contrast 32-bit zero-extension with 8-bit and 16-bit partial register modifications",
      "Optimize register clearing using xor eax, eax"
    ],
    "chapterSummary": "For backward compatibility with 32-bit 80386 and 16-bit 8086 processors, x86-64 registers are not isolated 64-bit islands. Each 64-bit register can be addressed in portions as **32-bit, 16-bit, or 8-bit sub-registers**.\n\nHowever, x86-64 introduced a critical hardware architectural rule: **writing to any 32-bit sub-register automatically zeroes out the upper 32 bits of the 64-bit register**!",
    "deepDive": {
      "title": "New x86-64 Registers (R8-R15) Sub-Registers",
      "content": "For registers `R8` through `R15`, sub-registers use standard suffixes: `R8` (64-bit), `R8D` (32-bit DWORD), `R8W` (16-bit WORD), and `R8B` (8-bit BYTE).",
      "codeSnippet": "mov r8d, 100 ; 32-bit write, zeroes upper 32 bits of R8!"
    },
    "takeaways": [
      "Writing to any 32-bit sub-register (EAX, EDI) automatically zeroes the upper 32 bits.",
      "Writing to 8-bit (AL) or 16-bit (AX) sub-registers leaves upper bits intact.",
      "xor eax, eax is the fastest, most compact way to clear a 64-bit register to zero.",
      "Use movzx to avoid partial register pipeline stalls when loading small values."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Sub-Register Hierarchy & The 32-bit Zero-Extension Rule",
        "content": "Register decomposition for `RAX`:\n- **`RAX`**: Full 64 bits (bits 0–63)\n- **`EAX`**: Lower 32 bits (bits 0–31). **Writing to EAX automatically clears bits 32–63 to zero!**\n- **`AX`**: Lower 16 bits (bits 0–15). Writing leaves upper 48 bits untouched.\n- **`AL`**: Lower 8 bits (bits 0–7). Writing leaves upper 56 bits untouched.\n- **`AH`**: High 8 bits of AX (bits 8–15).",
        "codeSnippet": "; Register Zero-Extension in Action:\nmov rax, 0xFFFFFFFFFFFFFFFF ; RAX is all 1s\n\nmov eax, 42 ; Writes to lower 32 bits!\n; Upper 32 bits are automatically zeroed out by CPU!\n; RAX is now: 0x000000000000002A",
        "sandboxCode": "; Compare 32-bit vs 8-bit writes:\nmov rax, 0xFFFFFFFFFFFFFFFF\nmov al, 0x05 ; AL is modified; upper 56 bits remain 0xFF...\nmov eax, 0x05 ; EAX is modified; upper 32 bits become 0x00..."
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The xor eax, eax Idiom",
        "prompt": "Why do compilers and assembly programmers use `xor eax, eax` instead of `mov rax, 0` to set RAX to zero?",
        "codeSnippet": "xor eax, eax ; vs mov rax, 0",
        "options": [
          {
            "text": "xor eax, eax encodes in only 2 bytes (vs 7 bytes for mov rax, 0), and writing to 32-bit EAX automatically zeroes the entire 64-bit RAX register with zero CPU latency",
            "isCorrect": true,
            "feedback": "🎯 Exactly! xor eax, eax is only 2 bytes (31 c0), recognized by the CPU register renamer as a dependency-breaking zeroing idiom, while clearing the entire 64-bit RAX register via automatic zero-extension."
          },
          {
            "text": "mov rax, 0 throws an arithmetic overflow exception",
            "isCorrect": false,
            "feedback": "mov rax, 0 is valid assembly, just larger and slower."
          },
          {
            "text": "xor converts the register into a floating-point register",
            "isCorrect": false,
            "feedback": "xor is bitwise exclusive OR on general-purpose registers."
          },
          {
            "text": "RAX cannot be assigned 0 directly",
            "isCorrect": false,
            "feedback": "mov rax, 0 assigns zero directly."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Partial Register Stalls (Modifying AL/AX)",
        "content": "Writing to 8-bit `AL` or 16-bit `AX` leaves the upper bits intact. On out-of-order CPU execution pipelines, this creates a **Partial Register Stall**: the CPU must wait for the old value of `RAX` to retire before merging the lower bits.",
        "codeSnippet": "; ❌ SLOW (Partial register dependency):\nmov al, 10 ; CPU must preserve upper 56 bits of RAX!\n\n; ✅ FAST (Zero-extended):\nmovzx eax, byte [rsi] ; Clears upper 32 bits cleanly!",
        "tip": "Hacker Rule: Use movzx (Move with Zero-Extension) when loading 8-bit or 16-bit values into registers.",
        "arenaTarget": "game.html?lang=asm&diff=beginner&stage=1"
      }
    ]
  },
  {
    "id": "asm-les-003",
    "language": "asm",
    "difficulty": "intermediate",
    "topic": "The Hardware Call Stack",
    "title": "Chapter 3: The Hardware Call Stack & Stack Frames",
    "tagline": "Master stack memory growth downward, function prologues, epilogues, and buffer overflows.",
    "estimatedMinutes": 7,
    "objectives": [
      "Understand how the hardware call stack grows DOWNWARD toward lower memory addresses",
      "Master the push, pop, call, and ret machine instructions",
      "Understand the function prologue (push rbp; mov rbp, rsp) and epilogue (leave; ret)",
      "Understand how buffer overflows overwrite the saved return address (RIP hijacking)"
    ],
    "chapterSummary": "The hardware **Call Stack** is the beating heart of procedural execution. It stores local variables, tracks nested function calls, and preserves execution context.\n\nA fundamental architectural reality of x86 architecture is that **the stack grows DOWNWARD**: allocating local variables on the stack decreases the Stack Pointer (`RSP`) toward lower memory addresses! Understanding stack frame layout is mandatory for vulnerability research and buffer overflow exploitation.",
    "deepDive": {
      "title": "Stack Canaries & Shadow Stacks",
      "content": "Modern compilers defend against buffer overflows using **Stack Canaries** (injecting a random integer between buffers and the return address before returning) and hardware **Shadow Stacks** (Intel CET) storing return addresses in protected CPU memory.",
      "codeSnippet": "; Compiler checks canary:\nmov rax, [rbp-8]\nxor rax, [fs:0x28] ; Verify canary matches thread pointer\njne __stack_chk_fail"
    },
    "takeaways": [
      "The x86-64 call stack grows DOWNWARD toward lower memory addresses.",
      "call pushes the return address to the stack; ret pops it into RIP.",
      "Function prologue: push rbp; mov rbp, rsp; sub rsp, N.",
      "Buffer overflows overwrite the saved return address to hijack execution flow."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "Stack Growth Downward & Function Frames",
        "content": "The Stack lifecycle:\n1. **`push val`**: Decrements `RSP` by 8 bytes and writes `val` to `[rsp]`.\n2. **`pop reg`**: Reads value from `[rsp]` and increments `RSP` by 8 bytes.\n3. **`call func`**: Pushes the address of the next instruction (the **Return Address**) onto the stack and jumps to `func`.\n4. **`ret`**: Pops the Return Address off the stack into the Instruction Pointer (`RIP`), resuming execution!",
        "codeSnippet": "; Standard Function Prologue & Epilogue:\nglobal my_func\nmy_func:\n    push rbp        ; Save caller's base pointer\n    mov rbp, rsp    ; Establish new stack frame base\n    sub rsp, 16     ; Allocate 16 bytes for local variables\n\n    ; ... function body ...\n\n    leave           ; Equivalent to: mov rsp, rbp; pop rbp\n    ret             ; Pop return address into RIP!",
        "sandboxCode": "; Stack allocation demonstration:\npush 42\npush 100\npop rax ; rax is 100\npop rbx ; rbx is 42"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "The Classic Buffer Overflow RIP Hijack",
        "prompt": "When an unbounded input overflows a local stack buffer in C (e.g. gets(buf)), what critical pointer on the stack is overwritten to hijack control flow?",
        "codeSnippet": "; Stack Frame Layout:\n; [Higher Addresses]\n; [ Function Arguments ... ]\n; [ Saved Return Address (RIP) ] <--- Target of overflow!\n; [ Saved Base Pointer (RBP) ]\n; [ Local Buffer (buf[64]) ]\n; [Lower Addresses: RSP]",
        "options": [
          {
            "text": "The Saved Return Address: when the function executes ret, the CPU pops the attacker's overwritten address into RIP, redirecting execution to malicious code",
            "isCorrect": true,
            "feedback": "🎯 Exactly! Because the stack grows down but arrays fill up toward higher addresses, overflowing buf writes over the saved RBP and saved return address. When ret executes, control flow jumps to the injected address!"
          },
          {
            "text": "The CPU Clock Frequency Register",
            "isCorrect": false,
            "feedback": "Hardware clock rates are not stored on the user stack."
          },
          {
            "text": "The L1 Hardware Cache Controller",
            "isCorrect": false,
            "feedback": "Caches are transparent hardware buffers."
          },
          {
            "text": "The process PID in /proc",
            "isCorrect": false,
            "feedback": "Process IDs reside in kernel task structures, not the user stack."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Stack Imbalance Causing Crash on ret",
        "content": "If an assembly routine pushes a value (`push rbx`) but forgets to pop it before executing `ret`, the CPU interprets the pushed data as the **Return Address**, jumping to an invalid memory location and crashing with SIGSEGV!",
        "codeSnippet": "; ❌ CRASH ON RET (Stack Misalignment):\npush rbx\n; ... forgot pop rbx!\nret ; Pops rbx value into RIP! Segfault!",
        "tip": "Hacker Rule: Every push must have an exact corresponding pop before ret executes.",
        "arenaTarget": "game.html?lang=asm&diff=intermediate&stage=1"
      }
    ]
  },
  {
    "id": "asm-les-004",
    "language": "asm",
    "difficulty": "expert",
    "topic": "LEA vs MOV Instructions",
    "title": "Chapter 4: LEA vs MOV: Computation vs Memory Access",
    "tagline": "Understand Load Effective Address arithmetic vs memory dereferencing in reverse engineering.",
    "estimatedMinutes": 7,
    "objectives": [
      "Master the fundamental distinction: LEA (address calculation) vs MOV (memory dereference)",
      "Understand how the CPU Address Generation Unit (AGU) computes LEA in a single clock cycle",
      "Recognize how optimizing compilers exploit LEA for high-speed arithmetic (multiplication and addition)",
      "Identify LEA vs MOV patterns during binary disassembly"
    ],
    "chapterSummary": "In assembly disassembly (GDB, IDA Pro, Ghidra), no two instructions are confused more frequently than `mov` and `lea`.\n\nBoth instructions use the exact same bracket syntax: `[rbx + rcx * 4 + 10]`. However, **`mov` dereferences the address** to read data from RAM, while **`lea` (Load Effective Address)** merely calculates the math and loads the resulting numeric address into the register **without ever touching memory**!",
    "deepDive": {
      "title": "CPU Address Generation Unit (AGU)",
      "content": "Modern x86 CPUs feature dedicated hardware **Address Generation Units (AGUs)** operating in parallel with the Arithmetic Logic Units (ALUs). Using `lea` offloads integer math to the AGU, freeing ALUs for other calculations.",
      "codeSnippet": "; Base + Index * Scale + Displacement:\nlea edx, [rax + rbx * 8 + 64]"
    },
    "takeaways": [
      "MOV dereferences memory to read data; LEA calculates address math with zero RAM access.",
      "Compilers use LEA for single-cycle multiplication and addition: [rdi + rdi * 4].",
      "LEA on an invalid or NULL pointer never segfaults because it never reads memory.",
      "LEA is computed by the hardware Address Generation Unit (AGU)."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "LEA (Math Pointer) vs MOV (Memory Read)",
        "content": "Comparison:\n- `mov rax, [rbx + 8]`: Reads the 8 bytes of data stored at memory address `rbx + 8` and copies them into `RAX`.\n- `lea rax, [rbx + 8]`: Calculates `rbx + 8` and stores the resulting **number** directly into `RAX` (zero memory access!).\n\nCompilers use `lea` as a high-speed arithmetic trick to perform addition and multiplication by 2, 4, or 8 in a single CPU cycle!",
        "codeSnippet": "; Using LEA for high-speed arithmetic: x * 5 + 10\n; Input: rdi = x\nlea eax, [rdi + rdi * 4 + 10] ; Computes x + 4x + 10 = 5x + 10 in ONE cycle!\nret",
        "sandboxCode": "; LEA calculation test:\nmov rdi, 10\nlea rax, [rdi + 5] ; rax = 15 (no memory read!)"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Disassembly Analysis: LEA vs MOV",
        "prompt": "If RBX holds the memory address 0x1000, and the 8 bytes at 0x1000 contain the integer 42, what is stored in RAX after `lea rax, [rbx]` vs `mov rax, [rbx]`?",
        "codeSnippet": "lea rax, [rbx] ; (1)\nmov rdx, [rbx] ; (2)",
        "options": [
          {
            "text": "RAX receives 0x1000 (the address itself); RDX receives 42 (the value stored at that address)",
            "isCorrect": true,
            "feedback": "🎯 Exactly! LEA calculates the address expression and stores the address (0x1000) without accessing memory. MOV dereferences the address and reads the value (42) stored in RAM."
          },
          {
            "text": "Both registers receive 42",
            "isCorrect": false,
            "feedback": "LEA never reads memory contents."
          },
          {
            "text": "Both registers receive 0x1000",
            "isCorrect": false,
            "feedback": "MOV dereferences the pointer to fetch memory data."
          },
          {
            "text": "LEA throws a segmentation fault",
            "isCorrect": false,
            "feedback": "Because LEA does not access memory, it cannot segfault even if RBX is NULL!"
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "Assuming LEA Can Segfault on Invalid Addresses",
        "content": "Because `lea` calculates math rather than reading memory, executing `lea rax, [0x0]` or `lea rax, [rbp + 999999]` **never triggers a segmentation fault**! In exploit analysis, do not confuse LEA with a memory access.",
        "codeSnippet": "; LEA on null pointer is completely legal:\nxor rdi, rdi\nlea rax, [rdi + 10] ; rax = 10 (Zero memory read; zero segfault!)",
        "tip": "Hacker Rule: If you see brackets with no intention to read RAM, the compiler is using LEA for fast arithmetic.",
        "arenaTarget": "game.html?lang=asm&diff=expert&stage=1"
      }
    ]
  },
  {
    "id": "asm-les-005",
    "language": "asm",
    "difficulty": "expert",
    "topic": "Condition Codes & Flags",
    "title": "Chapter 5: Condition Codes, EFLAGS & Reverse Engineering Jumps",
    "tagline": "Master ZF, SF, CF, OF status flags, cmp vs test, and signed vs unsigned jump disassembly.",
    "estimatedMinutes": 8,
    "objectives": [
      "Master the x86-64 status flags in the RFLAGS register: ZF, SF, CF, OF",
      "Understand the difference between cmp (subtraction) and test (bitwise AND)",
      "Differentiate between signed conditional jumps (jg, jl) vs unsigned jumps (ja, jb)",
      "Analyze control flow graphs and crackme license-check branching in reverse engineering"
    ],
    "chapterSummary": "At the hardware level, computers have no `if/else` statements or `while` loops. Branching is implemented through two steps:\n1. An arithmetic or comparison instruction updates status bits in the **RFLAGS Register**.\n2. A **Conditional Jump** instruction inspects those flags to decide whether to divert the Instruction Pointer (`RIP`).\n\nIn reverse engineering and binary analysis, mastering how flags are set by `cmp` and `test` is essential to understanding program control flow and cracking software protections.",
    "deepDive": {
      "title": "Flag Manipulation in Return-Oriented Programming (ROP)",
      "content": "In binary exploitation, attackers use ROP gadgets that manipulate flags without altering general registers (e.g. `stc` set carry, `clc` clear carry) to bypass branch checks without executing code.",
      "codeSnippet": "clc ; Clear Carry Flag (CF = 0)"
    },
    "takeaways": [
      "Branching requires two steps: set RFLAGS, then execute a conditional jump.",
      "cmp performs subtraction (a - b); test performs bitwise AND (a & b).",
      "Greater/Less (jg, jl) = Signed; Above/Below (ja, jb) = Unsigned.",
      "test reg, reg is the standard assembly idiom to check if a register is zero or null."
    ],
    "slides": [
      {
        "type": "concept",
        "badge": "01 // MENTAL MODEL",
        "title": "The Four Key CPU Status Flags",
        "content": "The RFLAGS register maintains four critical status flags:\n- **ZF (Zero Flag)**: Set to 1 if the result of an operation is **Zero** (equal values).\n- **SF (Sign Flag)**: Set to 1 if the result is **Negative** (most significant bit is 1).\n- **CF (Carry Flag)**: Set to 1 on **Unsigned Overflow** (borrow/carry out).\n- **OF (Overflow Flag)**: Set to 1 on **Signed Overflow** (result exceeded signed capacity).\n\n- `cmp a, b`: Performs `a - b` without storing result; updates flags.\n- `test a, b`: Performs `a & b` without storing result; updates ZF and SF.",
        "codeSnippet": "; Reverse engineering an if-statement:\n; if (x == 42) { grant_access(); }\ncmp edi, 42         ; Performs edi - 42\njne access_denied   ; Jump if Not Equal (ZF == 0)\n\n; Access granted branch...\naccess_denied:\nret",
        "sandboxCode": "; Test flag behavior:\nmov eax, 10\ncmp eax, 10 ; ZF becomes 1!\nje matched\nret\nmatched:\nmov rbx, 1"
      },
      {
        "type": "drill",
        "badge": "02 // INTERACTIVE CHECKPOINT",
        "title": "Signed vs Unsigned Jump Confusion in Reverse Engineering",
        "prompt": "When reverse engineering a license key check comparing two integers, what is the difference between jg (Jump if Greater) and ja (Jump if Above)?",
        "codeSnippet": "cmp eax, edx\njg signed_branch\nja unsigned_branch",
        "options": [
          {
            "text": "jg evaluates Signed integers (inspects SF and OF flags); ja evaluates Unsigned integers (inspects CF and ZF flags)",
            "isCorrect": true,
            "feedback": "🎯 Exactly! In x86 assembly: Greater/Less (G/L) are for SIGNED comparisons (jg, jge, jl, jle). Above/Below (A/B) are for UNSIGNED comparisons (ja, jae, jb, jbe). Confusing them creates serious signedness vulnerability bugs!"
          },
          {
            "text": "ja only jumps if both numbers are equal to zero",
            "isCorrect": false,
            "feedback": "Equal to zero is checked by je / jz."
          },
          {
            "text": "jg is a 64-bit jump; ja is a 32-bit jump",
            "isCorrect": false,
            "feedback": "Both jumps operate identically on 32-bit and 64-bit registers."
          },
          {
            "text": "There is zero difference; they are aliases in NASM",
            "isCorrect": false,
            "feedback": "They inspect completely different CPU hardware flags."
          }
        ]
      },
      {
        "type": "pitfall",
        "badge": "03 // DANGER ZONE",
        "title": "The test eax, eax vs cmp eax, 0 Optimization",
        "content": "Compilers rarely generate `cmp eax, 0` (3 bytes). Instead, they emit `test eax, eax` (2 bytes) to check for null pointers or zero integers. `test` performs bitwise AND; if the register is zero, `ZF` is set to 1!",
        "codeSnippet": "; Standard compiler null check idiom:\ntest rdi, rdi   ; Bitwise AND: sets ZF if rdi == 0\njz is_null_ptr  ; Jump if Zero (null pointer!)",
        "tip": "Hacker Rule: Remember: Greater/Less = Signed (jg/jl); Above/Below = Unsigned (ja/jb).",
        "arenaTarget": "game.html?lang=asm&diff=expert&stage=1"
      }
    ]
  }
];

export const AcademyLessons = {
  getCustomLessons() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('syntaxarena_custom_lessons');
        if (raw) {
          const packs = JSON.parse(raw);
          if (Array.isArray(packs)) {
            const lessons = [];
            packs.forEach(p => {
              if (p && p.cyberAcademy && typeof p.cyberAcademy === 'object') {
                lessons.push(p.cyberAcademy);
              }
            });
            return lessons;
          }
        }
      }
    } catch (e) {}
    return [];
  },

  getAll() {
    return [...academyLessons, ...this.getCustomLessons()];
  },

  getByLanguage(lang) {
    const all = this.getAll();
    if (!lang) return all;
    const cleanLang = String(lang).toLowerCase().trim();
    return all.filter(l => l.language === cleanLang);
  },

  getByDifficulty(lang, diff) {
    const list = this.getByLanguage(lang);
    if (!diff || diff === 'all') return list;
    const cleanDiff = String(diff).toLowerCase().trim();
    if (cleanDiff === 'all') return list;
    return list.filter(l => l.difficulty === cleanDiff);
  },

  getById(id) {
    return this.getAll().find(l => l.id === id) || null;
  }
};
