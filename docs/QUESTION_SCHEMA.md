# Question Schema & Content Data Architecture: SyntaxArena

## 1. Schema Design Philosophy

The question schema is the foundational data contract of SyntaxArena. It is engineered with three core principles:
1. **Polymorphic Simplicity:** A single unified JSON schema natively represents all four question formats (`multiple_choice`, `predict_output`, `find_bug`, and `fill_code`) without ad-hoc fields or hacky exceptions.
2. **Pedagogical Integrity:** Every question must provide self-contained context, accurate compiler/runtime assumptions, a non-spoiler conceptual hint, and a comprehensive technical explanation.
3. **Future Extensibility:** Adding a new language track (e.g., Rust, Go, TypeScript) or topic category requires zero modifications to the core parser or rendering pipeline.

---

## 2. Formal JSON Schema Specification

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "SyntaxArenaQuestion",
  "type": "object",
  "required": [
    "id",
    "language",
    "difficulty",
    "type",
    "topic",
    "prompt",
    "correctAnswer",
    "explanation",
    "hint"
  ],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^(py|c|cpp|java)-(beg|int|exp)-[0-9]{3}$",
      "description": "Unique identifier following track, difficulty, and 3-digit index."
    },
    "language": {
      "type": "string",
      "enum": ["python", "c", "cpp", "java"],
      "description": "Target programming language standard."
    },
    "difficulty": {
      "type": "string",
      "enum": ["beginner", "intermediate", "expert"],
      "description": "Target cognitive complexity tier."
    },
    "type": {
      "type": "string",
      "enum": ["multiple_choice", "predict_output", "find_bug", "fill_code"],
      "description": "Interaction format."
    },
    "topic": {
      "type": "string",
      "description": "Computer science domain (e.g., pointers, recursion, memory_layout, polymorphism)."
    },
    "subtopic": {
      "type": "string",
      "description": "Specific language feature or edge case (e.g., vtable_dispatch, GIL, integer_promotion)."
    },
    "prompt": {
      "type": "string",
      "description": "Clear, unambiguous question instruction."
    },
    "code": {
      "type": "string",
      "description": "Formatted source code snippet. Empty only for pure theoretical conceptual questions."
    },
    "options": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 2,
      "maxItems": 6,
      "description": "Available answer choices for MCQ and predict_output, or token bank for fill_code."
    },
    "correctAnswer": {
      "oneOf": [
        { "type": "string", "description": "Exact text matching correct option or output." },
        { "type": "number", "description": "1-based line number for find_bug questions." },
        { "type": "array", "items": { "type": "string" }, "description": "Ordered tokens for multi-blank fill_code." }
      ]
    },
    "expectedOutput": {
      "type": "string",
      "description": "Standard output stdout of the snippet when applicable."
    },
    "hint": {
      "type": "string",
      "description": "Targeted conceptual clue explaining relevant rule without revealing answer."
    },
    "explanation": {
      "type": "string",
      "description": "Comprehensive explanation of why answer is correct and why distractors are wrong."
    },
    "standardVersion": {
      "type": "string",
      "description": "Compiler/runtime standard, e.g., 'C99', 'C++20', 'Python 3.11', 'Java 17'."
    },
    "targetLine": {
      "type": "integer",
      "description": "For find_bug questions: the 1-based line number containing the bug."
    },
    "blankCount": {
      "type": "integer",
      "description": "For fill_code questions: number of blanks present in code template."
    }
  }
}
```

---

## 3. Concrete Question Examples by Format

### 3.1 Format 1: Multiple Choice Question (C - Intermediate)
```json
{
  "id": "c-int-007",
  "language": "c",
  "difficulty": "intermediate",
  "type": "multiple_choice",
  "topic": "memory_management",
  "subtopic": "pointer_arithmetic",
  "standardVersion": "C99",
  "prompt": "Assuming a 64-bit architecture where `sizeof(int) == 4`, what does `ptr + 3` evaluate to relative to the address of `arr`?",
  "code": "int arr[5] = {10, 20, 30, 40, 50};\nint *ptr = arr;",
  "options": [
    "Address of arr plus 3 bytes",
    "Address of arr plus 12 bytes",
    "Address of arr plus 24 bytes",
    "Value 40 dereferenced"
  ],
  "correctAnswer": "Address of arr plus 12 bytes",
  "hint": "Pointer arithmetic in C automatically scales by the size of the referenced type.",
  "explanation": "In C, adding an integer `k` to a pointer of type `T*` advances the address by `k * sizeof(T)` bytes. Here, `3 * sizeof(int) = 3 * 4 = 12` bytes, which points directly to `arr[3]`."
}
```

### 3.2 Format 2: Predict the Output (Python - Expert)
```json
{
  "id": "py-exp-012",
  "language": "python",
  "difficulty": "expert",
  "type": "predict_output",
  "topic": "closures",
  "subtopic": "late_binding",
  "standardVersion": "Python 3.11",
  "prompt": "What is the exact output printed by executing this Python script?",
  "code": "funcs = [lambda: i for i in range(3)]\ni = 10\nprint([f() for f in funcs])",
  "options": [
    "[0, 1, 2]",
    "[2, 2, 2]",
    "[10, 10, 10]",
    "NameError: 'i' is out of scope"
  ],
  "correctAnswer": "[10, 10, 10]",
  "expectedOutput": "[10, 10, 10]",
  "hint": "Python lambdas look up variables in their surrounding scope dynamically at call time, not definition time.",
  "explanation": "Python closures bind variables by name reference (late binding), not by value copy. By the time the lambdas are executed inside the list comprehension, `i` has been reassigned to `10` in the global scope. Thus all three lambdas evaluate `i` as `10`."
}
```

### 3.3 Format 3: Find the Bug (C++ - Expert)
```json
{
  "id": "cpp-exp-019",
  "language": "cpp",
  "difficulty": "expert",
  "type": "find_bug",
  "topic": "polymorphism",
  "subtopic": "virtual_destructors",
  "standardVersion": "C++20",
  "prompt": "Click the line that causes undefined behavior / memory leak when deleting through a base pointer:",
  "code": "class Base {\npublic:\n    ~Base() { std::cout << \"~Base\"; }\n};\n\nclass Derived : public Base {\n    int* data;\npublic:\n    Derived() : data(new int[100]) {}\n    ~Derived() { delete[] data; }\n};\n\nint main() {\n    Base* ptr = new Derived();\n    delete ptr;\n    return 0;\n}",
  "targetLine": 3,
  "correctAnswer": 3,
  "hint": "Deleting a derived object via a pointer to base requires polymorphism in the destructor declaration.",
  "explanation": "Line 3 declares `~Base()` without the `virtual` keyword. Deleting an object of derived class `Derived` through a pointer to `Base` when `Base` has a non-virtual destructor results in undefined behavior under §8.3.5 of the C++ standard, preventing `Derived::~Derived()` from being invoked and leaking the heap array `data`."
}
```

### 3.4 Format 4: Fill in the Missing Code (Java - Intermediate)
```json
{
  "id": "java-int-014",
  "language": "java",
  "difficulty": "intermediate",
  "type": "fill_code",
  "topic": "oop",
  "subtopic": "constructor_chaining",
  "standardVersion": "Java 17",
  "prompt": "Complete the constructor chaining so that the parent class initializes the vehicle name before setting speed:",
  "code": "class Vehicle {\n    String name;\n    Vehicle(String name) { this.name = name; }\n}\n\nclass Car extends Vehicle {\n    int maxSpeed;\n    Car(String name, int maxSpeed) {\n        ___BLANK_1___;\n        this.maxSpeed = maxSpeed;\n    }\n}",
  "blankCount": 1,
  "options": [
    "super(name)",
    "this(name)",
    "super.name = name",
    "Vehicle(name)"
  ],
  "correctAnswer": "super(name)",
  "hint": "Java requires explicit calls to a parameterized superclass constructor as the very first statement.",
  "explanation": "Because `Vehicle` does not provide a default no-argument constructor, `Car` must explicitly invoke `super(name)` as the first statement in its constructor body."
}
```

---

## 4. Question Inventory Matrix (Total: 240 Questions)

The system maintains an exact **240-question catalog** divided equally across languages and difficulty tiers:

```
┌─────────────────┬───────────┬──────────────┬──────────┬──────────────┐
│ Language        │ Beginner  │ Intermediate │ Expert   │ Total        │
├─────────────────┼───────────┼──────────────┼──────────┼──────────────┤
│ Python 3        │ 20        │ 20           │ 20       │ 60           │
│ C (C99/C11)     │ 20        │ 20           │ 20       │ 60           │
│ C++ (C++17/20)  │ 20        │ 20           │ 20       │ 60           │
│ Java (SE 17)    │ 20        │ 20           │ 20       │ 60           │
├─────────────────┼───────────┼──────────────┼──────────┼──────────────┤
│ Grand Total     │ 80        │ 80           │ 80       │ 240          │
└─────────────────┴───────────┴──────────────┴──────────┴──────────────┘
```

### 4.1 Topic Coverage Curricula

#### Python (60 Questions)
- **Beginner (20):** Slicing, list mutability, string methods, dictionary operations, truthiness, basic functions, loops, unpacking.
- **Intermediate (20):** List/dict comprehensions, `*args`/`**kwargs`, decorators, generators & `yield`, exceptions, file I/O, lambda expressions.
- **Expert (20):** Closures & late binding, `__new__` vs `__init__`, metaclases, MRO (Method Resolution Order), GIL implications, memory management & cycle detection, descriptors.

#### C (60 Questions)
- **Beginner (20):** Data types, `printf`/`scanf` format specifiers, operators, control flow, array indices, functions, basic structs.
- **Intermediate (20):** Pointer arithmetic, `malloc`/`free`, string manipulation (`string.h`), arrays as pointers, typedef, bitwise operations, macro expansion.
- **Expert (20):** Function pointers, struct padding & alignment, double pointers (`**ptr`), integer promotion & signed overflow, sequence points, union memory sharing, `volatile` qualifier.

#### C++ (60 Questions)
- **Beginner (20):** References vs pointers, function overloading, namespaces, `std::vector`, `std::string`, `class` vs `struct`, access specifiers.
- **Intermediate (20):** Operator overloading, dynamic memory (`new`/`delete`), constructors/destructors, `const` correctness, standard templates (`std::map`), inheritance basics.
- **Expert (20):** Virtual destructors & vtables, move semantics & rvalue references (`std::move`), RAII, template specialization, smart pointers (`std::unique_ptr` vs `std::shared_ptr`), type slicing.

#### Java (60 Questions)
- **Beginner (20):** Primitive types vs wrappers, arrays, methods, basic OOP classes, method overloading, switch expressions, string concatenation.
- **Intermediate (20):** Inheritance & `super`, interfaces & abstract classes, exception handling (`try-catch-finally`), collections (`ArrayList`, `HashMap`), equals vs `==`.
- **Expert (20):** String pool semantics, JVM pass-by-value references, static initialization blocks, generic type erasure, anonymous classes & lambda capture, thread synchronization basics.

---

## 5. Automated Validation Invariants & Verification Suite

Before questions are accepted into the repository, an automated verification script validates the following invariants:

1. **Exact Inventory Count:**
   - Total questions must equal exactly $240$.
   - Each of the 4 languages must have exactly 60 questions.
   - Each language tier must have exactly 20 questions.
2. **ID Uniqueness & Formatting:**
   - Every `id` must be globally unique and match `^(py|c|cpp|java)-(beg|int|exp)-[0-9]{3}$`.
3. **Answer Integrity:**
   - For `multiple_choice` and `predict_output`: `correctAnswer` must match exactly one item in `options`.
   - For `find_bug`: `targetLine` must be an integer between $1$ and the total number of lines in `code`.
   - For `fill_code`: `blankCount` must match the count of `___BLANK_` occurrences in `code`.
4. **Pedagogical Quality:**
   - `prompt`, `hint`, and `explanation` must be non-empty strings.
   - `hint` must not contain the `correctAnswer` verbatim.
   - `explanation` must exceed at least 40 characters in length.
5. **No Compiler Ambiguities:**
   - Code snippets must adhere to specified language standards without relying on undefined behavior unless the question explicitly asks about undefined behavior.
