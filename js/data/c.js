/**
 * SyntaxArena Question Catalog — C
 * Conforms to docs/QUESTION_SCHEMA.md
 */

export const cQuestions = [
  {
    id: "c-beg-001",
    language: "c",
    difficulty: "beginner",
    type: "predict_output",
    topic: "types_and_operators",
    subtopic: "integer_division",
    standardVersion: "C99",
    prompt: "What does this C program print to stdout?",
    code: "#include <stdio.h>\n\nint main() {\n    int a = 7, b = 2;\n    float result = a / b;\n    printf(\"%.1f\\n\", result);\n    return 0;\n}",
    options: [
      "3.5",
      "3.0",
      "4.0",
      "Compilation Error"
    ],
    correctAnswer: "3.0",
    expectedOutput: "3.0",
    hint: "Both `a` and `b` are integer types. In C, division between integers performs truncating integer division before any float assignment.",
    explanation: "Because both operands `a` and `b` are integers, `7 / 2` evaluates to `3` via integer truncation. That integer `3` is then implicitly converted to float `3.0f` upon assignment to `result`."
  },
  {
    id: "c-int-001",
    language: "c",
    difficulty: "intermediate",
    type: "multiple_choice",
    topic: "pointers",
    subtopic: "pointer_arithmetic",
    standardVersion: "C99",
    prompt: "On an LP64 system where `sizeof(int) == 4`, what address offset does `ptr + 3` evaluate to relative to `arr`?",
    code: "int arr[5] = {10, 20, 30, 40, 50};\nint *ptr = arr;",
    options: [
      "Offset of 3 bytes",
      "Offset of 12 bytes",
      "Offset of 24 bytes",
      "Dereferenced value 40"
    ],
    correctAnswer: "Offset of 12 bytes",
    hint: "In C, pointer addition `ptr + k` automatically scales the offset by `sizeof(*ptr)` bytes.",
    explanation: "Pointer arithmetic in C is typed. Adding `3` to `ptr` (an `int*`) increments the underlying byte address by `3 * sizeof(int) = 3 * 4 = 12` bytes, which points directly to `arr[3]`."
  },
  {
    id: "c-exp-001",
    language: "c",
    difficulty: "expert",
    type: "predict_output",
    topic: "pointers",
    subtopic: "double_pointer_dereference",
    standardVersion: "C99",
    prompt: "What is the exact stdout printed after running this double pointer code?",
    code: "#include <stdio.h>\n\nint main() {\n    int val = 10;\n    int *p = &val;\n    int **pp = &p;\n    **pp += 15;\n    *p *= 2;\n    printf(\"%d\\n\", val);\n    return 0;\n}",
    options: [
      "25",
      "50",
      "20",
      "Segmentation Fault"
    ],
    correctAnswer: "50",
    expectedOutput: "50",
    hint: "Both `**pp` and `*p` directly dereference and modify the single memory location of `val`.",
    explanation: "`p` holds the address of `val`, and `pp` holds the address of `p`. Executing `**pp += 15` changes `val` from 10 to 25. Then `*p *= 2` multiplies `val` by 2, making `val` equal to 50."
  }
];
