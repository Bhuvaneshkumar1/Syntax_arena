/**
 * SyntaxArena Question Catalog — Python
 * Conforms to docs/QUESTION_SCHEMA.md
 */

export const pythonQuestions = [
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
    options: [
      "3 3",
      "4 4",
      "3 4",
      "IndexError: list index out of range"
    ],
    correctAnswer: "4 4",
    expectedOutput: "4 4",
    hint: "In Python, assigning one list variable to another (`b = a`) creates a new reference to the same underlying mutable list object, not a copy.",
    explanation: "Because lists are mutable objects, `b = a` assigns `b` to point to the exact same list in memory. Mutating `b` via `.append(4)` directly mutates `a`. Thus `len(a)` is 4, and `a[-1]` evaluates to 4."
  },
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
    expectedOutput: "4 [1, 20, 30, 5]",
    hint: "Slice assignment replaces the targeted index range [1:4] (elements 2, 3, 4) with the contents of the right-hand sequence.",
    explanation: "Slice assignment `nums[1:4]` selects items at indices 1, 2, and 3 (`[2, 3, 4]`) and replaces them with `[20, 30]`. The list dynamically resizes from 5 elements to 4: `[1, 20, 30, 5]`."
  },
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
    options: [
      "[0, 1, 2]",
      "[2, 2, 2]",
      "[10, 10, 10]",
      "NameError: 'i' is out of scope"
    ],
    correctAnswer: "[10, 10, 10]",
    expectedOutput: "[10, 10, 10]",
    hint: "Python closures look up enclosing variable names dynamically at invocation time, not definition time.",
    explanation: "Python closures bind variable names, not values (late binding). When the lambdas execute inside the second comprehension, `i` has been set to 10 in the surrounding scope. Therefore, all three lambdas evaluate `i` as 10."
  }
];
