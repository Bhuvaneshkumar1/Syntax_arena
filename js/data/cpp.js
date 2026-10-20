/**
 * SyntaxArena Question Catalog — C++
 * Conforms to docs/QUESTION_SCHEMA.md
 */

export const cppQuestions = [
  {
    id: "cpp-beg-001",
    language: "cpp",
    difficulty: "beginner",
    type: "predict_output",
    topic: "references",
    subtopic: "pass_by_reference",
    standardVersion: "C++17",
    prompt: "What is the stdout printed after calling `increment`?",
    code: "#include <iostream>\n\nvoid increment(int& r, int v) {\n    r += 10;\n    v += 10;\n}\n\nint main() {\n    int x = 5, y = 5;\n    increment(x, y);\n    std::cout << x << \" \" << y << std::endl;\n    return 0;\n}",
    options: [
      "5 5",
      "15 5",
      "15 15",
      "5 15"
    ],
    correctAnswer: "15 5",
    expectedOutput: "15 5",
    hint: "`r` is bound as an lvalue reference (`int&`), while `v` is passed by value copy.",
    explanation: "`r` is an alias for `x`. Modifying `r` directly mutates `x` to 15. In contrast, `v` is a local copy of `y`. Mutating `v` leaves the caller's variable `y` unchanged at 5."
  },
  {
    id: "cpp-int-001",
    language: "cpp",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "containers",
    subtopic: "vector_size_vs_capacity",
    standardVersion: "C++17",
    prompt: "What is the exact stdout printed after reserve and resize?",
    code: "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> v;\n    v.reserve(10);\n    v.push_back(1);\n    v.push_back(2);\n    std::cout << v.size() << \" \" << (v.capacity() >= 10) << std::endl;\n    return 0;\n}",
    options: [
      "10 1",
      "2 1",
      "2 0",
      "10 0"
    ],
    correctAnswer: "2 1",
    expectedOutput: "2 1",
    hint: "`reserve()` allocates memory capacity without creating elements; `size()` counts only actually constructed elements.",
    explanation: "`v.reserve(10)` pre-allocates memory so `v.capacity() >= 10` evaluates to true (1). However, only 2 elements were added via `push_back`, so `v.size()` is exactly 2."
  },
  {
    id: "cpp-exp-001",
    language: "cpp",
    difficulty: "expert",
    type: "find_bug",
    topic: "polymorphism",
    subtopic: "virtual_destructor_leak",
    standardVersion: "C++20",
    prompt: "What line in the following Base class causes undefined behavior when deleting Derived through a Base pointer?",
    code: "class Base {\npublic:\n    ~Base() { std::cout << \"~Base\"; }\n};\n\nclass Derived : public Base {\n    int* data;\npublic:\n    Derived() : data(new int[50]) {}\n    ~Derived() { delete[] data; }\n};\n\nint main() {\n    Base* b = new Derived();\n    delete b;\n    return 0;\n}",
    options: [
      "Line 3: non-virtual destructor in Base",
      "Line 7: dynamic array allocation in Derived",
      "Line 13: deleting polymorphic object via Base*",
      "Line 8: destructor delete[] syntax"
    ],
    correctAnswer: "Line 3: non-virtual destructor in Base",
    hint: "Deleting a derived object through a base class pointer without a `virtual` base destructor results in undefined behavior and resource leaks under the C++ standard.",
    explanation: "Line 3 declares `~Base()` as non-virtual. Deleting a `Derived` instance through a `Base*` when the base class lacks a virtual destructor triggers undefined behavior (§8.3.5) and prevents `Derived::~Derived()` from executing, leaking the heap array."
  }
];
