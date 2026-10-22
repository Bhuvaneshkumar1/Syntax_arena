/**
 * Go (Golang) Curriculum Track (Go 1.22+)
 * 60 Hand-Crafted Pedagogical Questions
 * Distributed across Beginner (20), Intermediate (20), and Expert (20)
 */

export const goQuestions = [
  {
    "id": "go-beg-001",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "functions",
    "subtopic": "multiple_return_values",
    "standardVersion": "Go 1.22+",
    "prompt": "What does this Go program output when parsing a valid integer string?",
    "code": "package main\nimport (\n\t\"fmt\"\n\t\"strconv\"\n)\nfunc main() {\n\tval, err := strconv.Atoi(\"42\")\n\tif err == nil {\n\t\tfmt.Println(val + 8)\n\t}\n}",
    "options": [
      "50",
      "42",
      "nil",
      "50 <nil>"
    ],
    "correctAnswer": "50",
    "acceptedAnswers": [
      "50"
    ],
    "hint": "strconv.Atoi parses a string into an integer and returns (int, error).",
    "explanation": "`strconv.Atoi(\"42\")` returns `val = 42` and `err = nil`. The condition `err == nil` succeeds, printing `val + 8` which is 50.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "functions",
      "error_handling"
    ]
  },
  {
    "id": "go-beg-002",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "slices",
    "subtopic": "len_and_cap",
    "standardVersion": "Go 1.22+",
    "prompt": "What is printed by evaluating the length and capacity of this slice?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\ts := make([]int, 3, 7)\n\tfmt.Println(len(s), cap(s))\n}",
    "options": [
      "3 7",
      "3 3",
      "7 3",
      "7 7"
    ],
    "correctAnswer": "3 7",
    "acceptedAnswers": [
      "3 7"
    ],
    "hint": "make([]T, len, cap) defines length as the second argument and capacity as the third.",
    "explanation": "`make([]int, 3, 7)` allocates a backing array with capacity 7 and initializes a slice view of length 3 with zero values. `len(s)` is 3 and `cap(s)` is 7.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "slices",
      "memory"
    ]
  },
  {
    "id": "go-beg-003",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "control_flow",
    "subtopic": "go122_loop_scoping",
    "standardVersion": "Go 1.22+",
    "prompt": "In Go 1.22+, what is printed by executing these closures captured in a for-range loop?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tvar funcs []func()\n\tfor _, v := range []int{10, 20, 30} {\n\t\tfuncs = append(funcs, func() { fmt.Print(v, \" \") })\n\t}\n\tfor _, f := range funcs {\n\t\tf()\n\t}\n}",
    "options": [
      "10 20 30 ",
      "30 30 30 ",
      "0 0 0 ",
      "Compile Error: Closure variable reuse"
    ],
    "correctAnswer": "10 20 30 ",
    "acceptedAnswers": [
      "10 20 30 ",
      "10 20 30"
    ],
    "hint": "Starting in Go 1.22, for-range loop variables have per-iteration scope instead of being shared.",
    "explanation": "Before Go 1.22, loop variable `v` was shared across iterations (printing `30 30 30 `). Go 1.22 fixed this historic gotcha by giving loop variables per-iteration lexical scope, printing `10 20 30 `.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "control_flow",
      "closures",
      "go122"
    ]
  },
  {
    "id": "go-beg-004",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "defer",
    "subtopic": "lifo_order",
    "standardVersion": "Go 1.22+",
    "prompt": "What order of tokens is printed by the multiple deferred statements in main?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tdefer fmt.Print(\"A\")\n\tdefer fmt.Print(\"B\")\n\tdefer fmt.Print(\"C\")\n\tfmt.Print(\"START-\")\n}",
    "options": [
      "START-CBA",
      "START-ABC",
      "CBA-START",
      "ABC-START"
    ],
    "correctAnswer": "START-CBA",
    "acceptedAnswers": [
      "START-CBA"
    ],
    "hint": "Deferred function calls are pushed onto a stack and executed in LIFO (Last In First Out) order.",
    "explanation": "The function first prints \"START-\". Then upon returning, the deferred calls execute in reverse stack order (LIFO): \"C\", then \"B\", then \"A\", resulting in \"START-CBA\".",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "defer",
      "control_flow"
    ]
  },
  {
    "id": "go-beg-005",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "zero_values",
    "subtopic": "default_initialization",
    "standardVersion": "Go 1.22+",
    "prompt": "What are the default zero values of an int, bool, string, and pointer in Go?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tvar i int\n\tvar b bool\n\tvar s string\n\tvar p *int\n\tfmt.Printf(\"%v %v %q %v\", i, b, s, p)\n}",
    "options": [
      "0 false \"\" <nil>",
      "0 true \"\" nil",
      "null false \"\" null",
      "undefined false \"\" nil"
    ],
    "correctAnswer": "0 false \"\" <nil>",
    "acceptedAnswers": [
      "0 false \"\" <nil>"
    ],
    "hint": "In Go, uninitialized variables automatically receive deterministic zero values.",
    "explanation": "In Go, memory is automatically zeroed: `int` is 0, `bool` is false, `string` is empty `\"\"`, and pointers default to `<nil>`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "zero_values",
      "types"
    ]
  },
  {
    "id": "go-beg-006",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "methods",
    "subtopic": "value_vs_pointer_receiver",
    "standardVersion": "Go 1.22+",
    "prompt": "What is printed after calling a method with a value receiver on Counter?",
    "code": "package main\nimport \"fmt\"\ntype Counter struct {\n\tval int\n}\nfunc (c Counter) Increment() {\n\tc.val++\n}\nfunc main() {\n\tc := Counter{val: 10}\n\tc.Increment()\n\tfmt.Println(c.val)\n}",
    "options": [
      "10",
      "11",
      "0",
      "Compile Error: Cannot call value method"
    ],
    "correctAnswer": "10",
    "acceptedAnswers": [
      "10"
    ],
    "hint": "A value receiver operates on an independent copy of the struct, leaving the caller untouched.",
    "explanation": "`Increment()` uses a value receiver `(c Counter)`. Go passes a copy of `c` to the method. Mutating `c.val` inside the method modifies only the copy, leaving the original `c.val` as 10.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "methods",
      "pointers",
      "structs"
    ]
  },
  {
    "id": "go-beg-007",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "maps",
    "subtopic": "comma_ok_idiom",
    "standardVersion": "Go 1.22+",
    "prompt": "What does map lookup with the comma-ok idiom output for a non-existent key?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tcounts := map[string]int{\"apples\": 5}\n\tval, exists := counts[\"bananas\"]\n\tfmt.Println(val, exists)\n}",
    "options": [
      "0 false",
      "nil false",
      "-1 false",
      "Panic: Key not found"
    ],
    "correctAnswer": "0 false",
    "acceptedAnswers": [
      "0 false"
    ],
    "hint": "Querying a non-existent key in Go returns the zero value of the value type and ok = false.",
    "explanation": "When a key is missing from a Go map, `val` receives the element type zero value (0 for `int`) and the second boolean `exists` is `false`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "maps",
      "idioms"
    ]
  },
  {
    "id": "go-beg-008",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "slices",
    "subtopic": "append_reallocation",
    "standardVersion": "Go 1.22+",
    "prompt": "What happens to the slice capacity when appending beyond the initial capacity of 2?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\ts := make([]int, 2, 2)\n\ts = append(s, 99)\n\tfmt.Println(len(s), cap(s) >= 3)\n}",
    "options": [
      "3 true",
      "3 false",
      "2 true",
      "Panic: Slice overflow"
    ],
    "correctAnswer": "3 true",
    "acceptedAnswers": [
      "3 true"
    ],
    "hint": "append automatically allocates a larger backing array when capacity is exceeded.",
    "explanation": "Because `s` had length 2 and capacity 2, appending a 3rd item forces Go runtime to allocate a new, larger backing array (usually doubling cap to 4), so `len(s) == 3` and `cap(s) >= 3` is `true`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "slices",
      "append",
      "capacity"
    ]
  },
  {
    "id": "go-beg-009",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "constants",
    "subtopic": "iota_enumeration",
    "standardVersion": "Go 1.22+",
    "prompt": "What values are assigned to B and C by iota in this const block?",
    "code": "package main\nimport \"fmt\"\nconst (\n\tA = iota * 2\n\tB\n\tC\n)\nfunc main() {\n\tfmt.Println(B, C)\n}",
    "options": [
      "2 4",
      "1 2",
      "0 2",
      "4 6"
    ],
    "correctAnswer": "2 4",
    "acceptedAnswers": [
      "2 4"
    ],
    "hint": "iota increments sequentially by 1 on each line of a const block, repeating the expression.",
    "explanation": "At line 0 (A), `iota = 0`, `0 * 2 = 0`. At line 1 (B), `iota = 1`, `1 * 2 = 2`. At line 2 (C), `iota = 2`, `2 * 2 = 4`. Output is `2 4`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "constants",
      "iota"
    ]
  },
  {
    "id": "go-beg-010",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "control_flow",
    "subtopic": "switch_no_fallthrough",
    "standardVersion": "Go 1.22+",
    "prompt": "Unlike C/C++, how does Go execute switch cases without break statements?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tnum := 2\n\tswitch num {\n\tcase 1:\n\t\tfmt.Print(\"One \")\n\tcase 2:\n\t\tfmt.Print(\"Two \")\n\tcase 3:\n\t\tfmt.Print(\"Three \")\n\tdefault:\n\t\tfmt.Print(\"Other \")\n\t}\n}",
    "options": [
      "Two ",
      "Two Three Other ",
      "Two Three ",
      "One Two Three "
    ],
    "correctAnswer": "Two ",
    "acceptedAnswers": [
      "Two "
    ],
    "hint": "In Go, switch cases break automatically unless explicitly designated with the fallthrough keyword.",
    "explanation": "Go automatically breaks at the end of each matching switch case. Because `num == 2`, only `Two ` is printed without falling through to case 3.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "control_flow",
      "switch"
    ]
  },
  {
    "id": "go-beg-011",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "arrays",
    "subtopic": "pass_by_value",
    "standardVersion": "Go 1.22+",
    "prompt": "What is printed after passing a fixed-size array [3]int to a modifying function?",
    "code": "package main\nimport \"fmt\"\nfunc modify(arr [3]int) {\n\tarr[0] = 999\n}\nfunc main() {\n\tnums := [3]int{1, 2, 3}\n\tmodify(nums)\n\tfmt.Println(nums[0])\n}",
    "options": [
      "1",
      "999",
      "0",
      "Compile Error: Array cannot be passed by value"
    ],
    "correctAnswer": "1",
    "acceptedAnswers": [
      "1"
    ],
    "hint": "In Go, arrays are values, not pointers. Passing an array passes an entire distinct copy.",
    "explanation": "Unlike slices or C arrays, fixed Go arrays `[N]T` are pure value types. Calling `modify(nums)` copies all 3 integers. Modifying the copy leaves `nums[0]` as 1.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "arrays",
      "value_types"
    ]
  },
  {
    "id": "go-beg-012",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "strings",
    "subtopic": "rune_vs_byte",
    "standardVersion": "Go 1.22+",
    "prompt": "What are len(str) and len([]rune(str)) for this UTF-8 encoded string?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tstr := \"Go🚀\"\n\tfmt.Println(len(str), len([]rune(str)))\n}",
    "options": [
      "6 3",
      "3 3",
      "6 6",
      "4 3"
    ],
    "correctAnswer": "6 3",
    "acceptedAnswers": [
      "6 3"
    ],
    "hint": "len(string) returns byte count, while []rune(string) returns Unicode code point count.",
    "explanation": "`\"Go\"` is 2 bytes (1 byte each for 'G' and 'o'). The rocket emoji `\"🚀\"` is 4 UTF-8 bytes. Total bytes `len(str)` is 6. The number of Unicode runes (characters) `len([]rune(str))` is 3 ('G', 'o', '🚀').",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "strings",
      "unicode",
      "runes"
    ]
  },
  {
    "id": "go-beg-013",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "defer",
    "subtopic": "argument_evaluation_timing",
    "standardVersion": "Go 1.22+",
    "prompt": "When are arguments to a deferred function evaluated in Go?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tx := 10\n\tdefer fmt.Println(x)\n\tx = 20\n}",
    "options": [
      "10",
      "20",
      "0",
      "Compile Error"
    ],
    "correctAnswer": "10",
    "acceptedAnswers": [
      "10"
    ],
    "hint": "Arguments to a deferred function are evaluated immediately at the time the defer statement is reached.",
    "explanation": "In Go, the arguments of a deferred call (`fmt.Println(x)`) are evaluated immediately when `defer` executes, capturing `x = 10`. The call itself is postponed until `main` returns.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "defer",
      "evaluation"
    ]
  },
  {
    "id": "go-beg-014",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "control_flow",
    "subtopic": "go122_integer_range",
    "standardVersion": "Go 1.22+",
    "prompt": "What is printed by Go 1.22's new integer range loop syntax?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tcount := 0\n\tfor i := range 4 {\n\t\tcount += i\n\t}\n\tfmt.Println(count)\n}",
    "options": [
      "6",
      "10",
      "4",
      "Compile Error: Cannot range over integer"
    ],
    "correctAnswer": "6",
    "acceptedAnswers": [
      "6"
    ],
    "hint": "Go 1.22 introduced ranging over an integer N, iterating from 0 up to N-1.",
    "explanation": "In Go 1.22+, `for i := range 4` generates values 0, 1, 2, 3. The sum is 0 + 1 + 2 + 3 = 6.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "go122",
      "range",
      "loops"
    ]
  },
  {
    "id": "go-beg-015",
    "language": "go",
    "difficulty": "beginner",
    "type": "multiple_choice",
    "topic": "packages",
    "subtopic": "identifier_visibility",
    "standardVersion": "Go 1.22+",
    "prompt": "How does Go determine whether an identifier (function, struct, or variable) is exported outside its package?",
    "code": "package arena\nfunc CalculateScore() int { return 100 } // Identifier A\nfunc resetGame()          { }           // Identifier B",
    "options": [
      "Identifiers starting with an uppercase letter are exported; lowercase are package-private",
      "The public or export keyword must be prefixed to exported identifiers",
      "All identifiers in the root package folder are exported by default",
      "Visibility is controlled solely by the package's go.mod exports directive"
    ],
    "correctAnswer": "Identifiers starting with an uppercase letter are exported; lowercase are package-private",
    "acceptedAnswers": [
      "Identifiers starting with an uppercase letter are exported; lowercase are package-private"
    ],
    "hint": "Go uses the casing of the first character in an identifier name to determine scope.",
    "explanation": "In Go, visibility is strictly lexical based on unicode case: uppercase first letter (`CalculateScore`) is exported, lowercase (`resetGame`) is internal to the package.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "packages",
      "visibility",
      "conventions"
    ]
  },
  {
    "id": "go-beg-016",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "variadic_functions",
    "subtopic": "slice_unpacking",
    "standardVersion": "Go 1.22+",
    "prompt": "What is printed by summing elements through a variadic function with slice unpacking?",
    "code": "package main\nimport \"fmt\"\nfunc sum(vals ...int) int {\n\ttotal := 0\n\tfor _, n := range vals {\n\t\ttotal += n\n\t}\n\treturn total\n}\nfunc main() {\n\titems := []int{2, 4, 6}\n\tfmt.Println(sum(items...))\n}",
    "options": [
      "12",
      "6",
      "[2 4 6]",
      "Compile Error: Cannot unpack slice with ..."
    ],
    "correctAnswer": "12",
    "acceptedAnswers": [
      "12"
    ],
    "hint": "Passing a slice followed by ellipsis (slice...) unpacks each element into the variadic parameter.",
    "explanation": "The `items...` syntax passes each element of `items` as individual arguments to `sum`. The loop adds 2 + 4 + 6, returning 12.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "functions",
      "variadic",
      "slices"
    ]
  },
  {
    "id": "go-beg-017",
    "language": "go",
    "difficulty": "beginner",
    "type": "find_bug",
    "topic": "maps",
    "subtopic": "nil_map_write_panic",
    "standardVersion": "Go 1.22+",
    "prompt": "Which line triggers a runtime panic due to writing into an uninitialized map?",
    "code": "1: package main\n2: func main() {\n3: \tvar scores map[string]int\n4: \tscores[\"player1\"] = 100\n5: }",
    "options": [
      "Line 4",
      "Line 3",
      "Line 2",
      "Line 1"
    ],
    "correctAnswer": "Line 4",
    "acceptedAnswers": [
      "Line 4",
      "4"
    ],
    "targetLine": 4,
    "hint": "A nil map can be read from safely, but assigning to an entry in a nil map panics.",
    "explanation": "`var scores map[string]int` initializes `scores` as `nil`. Reading from a nil map returns the zero value, but writing on Line 4 triggers `panic: assignment to entry in nil map`. The map must be initialized with `make(map[string]int)`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "maps",
      "panics",
      "initialization"
    ]
  },
  {
    "id": "go-beg-018",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "structs",
    "subtopic": "field_pointers",
    "standardVersion": "Go 1.22+",
    "prompt": "What is printed when modifying a struct field via pointer receiver?",
    "code": "package main\nimport \"fmt\"\ntype User struct {\n\tName string\n}\nfunc (u *User) Rename(n string) {\n\tu.Name = n\n}\nfunc main() {\n\tusr := User{Name: \"Gopher\"}\n\tusr.Rename(\"Commander\")\n\tfmt.Println(usr.Name)\n}",
    "options": [
      "Commander",
      "Gopher",
      "\"\"",
      "Compile Error"
    ],
    "correctAnswer": "Commander",
    "acceptedAnswers": [
      "Commander"
    ],
    "hint": "Pointer receiver (u *User) receives the memory address and directly modifies the receiver.",
    "explanation": "Because `Rename` is declared with a pointer receiver `(u *User)`, calling `usr.Rename(\"Commander\")` automatically takes `&usr` and updates `usr.Name` to \"Commander\".",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "structs",
      "methods",
      "pointers"
    ]
  },
  {
    "id": "go-beg-019",
    "language": "go",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "slices",
    "subtopic": "sub_slice_indices",
    "standardVersion": "Go 1.22+",
    "prompt": "What are the elements in sub-slice s[1:3] from array [5]int?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tarr := [5]int{10, 20, 30, 40, 50}\n\ts := arr[1:3]\n\tfmt.Println(s[0], s[1], len(s))\n}",
    "options": [
      "20 30 2",
      "10 20 2",
      "20 30 3",
      "20 40 2"
    ],
    "correctAnswer": "20 30 2",
    "acceptedAnswers": [
      "20 30 2"
    ],
    "hint": "Slice syntax arr[low:high] creates a half-open interval including index low and excluding high.",
    "explanation": "`arr[1:3]` extracts indices 1 and 2: elements 20 and 30. Its length is `3 - 1 = 2`. `s[0]` is 20 and `s[1]` is 30.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "slices",
      "subslice",
      "indexing"
    ]
  },
  {
    "id": "go-beg-020",
    "language": "go",
    "difficulty": "beginner",
    "type": "multiple_choice",
    "topic": "types",
    "subtopic": "type_conversion_vs_assertion",
    "standardVersion": "Go 1.22+",
    "prompt": "In Go, what is the syntactical difference between a type conversion and a type assertion?",
    "code": "// Operation A\nv := int(floatVal)\n// Operation B\nv := anyVal.(int)",
    "options": [
      "Operation A is a compile-time numeric conversion; Operation B is a runtime interface type assertion",
      "Both operations are identical runtime cast checks",
      "Operation A is unsafe pointer casting; Operation B is safe arithmetic conversion",
      "Operation B converts any type to int without checking"
    ],
    "correctAnswer": "Operation A is a compile-time numeric conversion; Operation B is a runtime interface type assertion",
    "acceptedAnswers": [
      "Operation A is a compile-time numeric conversion; Operation B is a runtime interface type assertion"
    ],
    "hint": "Type assertions (v.(T)) only apply to interface values to inspect concrete underlying types.",
    "explanation": "`T(val)` is a type conversion between compatible types (like float to int). `val.(T)` is a type assertion used on interface types (`interface{}` or `any`) to extract the concrete underlying value at runtime.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "types",
      "conversion",
      "interfaces"
    ]
  },
  {
    "id": "go-int-001",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "channels",
    "subtopic": "unbuffered_synchronization",
    "standardVersion": "Go 1.22+",
    "prompt": "What happens when sending and receiving on an unbuffered channel?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tch := make(chan int)\n\tgo func() {\n\t\tch <- 42\n\t}()\n\tval := <-ch\n\tfmt.Println(val * 2)\n}",
    "options": [
      "84",
      "42",
      "0",
      "Deadlock: Fatal error all goroutines are asleep"
    ],
    "correctAnswer": "84",
    "acceptedAnswers": [
      "84"
    ],
    "hint": "Unbuffered channels synchronize sender and receiver, blocking both until the rendezvous occurs.",
    "explanation": "The background goroutine sends 42 on unbuffered channel `ch`, and `main` receives 42. Printing `val * 2` outputs 84.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "concurrency",
      "channels",
      "goroutines"
    ]
  },
  {
    "id": "go-int-002",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "channels",
    "subtopic": "buffered_channels",
    "standardVersion": "Go 1.22+",
    "prompt": "How many items can be sent into this buffered channel before sending blocks?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tch := make(chan string, 2)\n\tch <- \"A\"\n\tch <- \"B\"\n\tfmt.Println(len(ch), <-ch)\n}",
    "options": [
      "2 A",
      "2 B",
      "0 A",
      "1 B"
    ],
    "correctAnswer": "2 A",
    "acceptedAnswers": [
      "2 A"
    ],
    "hint": "Buffered channels allow sends to succeed without blocking up to their buffer capacity.",
    "explanation": "`make(chan string, 2)` holds up to 2 items in its buffer. `len(ch)` reports 2 buffered items. The first receive `<-ch` pops the FIFO first item `\"A\"`. Output is `2 A`.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "channels",
      "buffers"
    ]
  },
  {
    "id": "go-int-003",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "channels",
    "subtopic": "closed_channel_read",
    "standardVersion": "Go 1.22+",
    "prompt": "What does receiving from a closed, drained channel return in Go?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tch := make(chan int, 1)\n\tch <- 9\n\tclose(ch)\n\tv1, ok1 := <-ch\n\tv2, ok2 := <-ch\n\tfmt.Println(v1, ok1, v2, ok2)\n}",
    "options": [
      "9 true 0 false",
      "9 true 0 true",
      "9 true nil false",
      "Panic: Cannot read closed channel"
    ],
    "correctAnswer": "9 true 0 false",
    "acceptedAnswers": [
      "9 true 0 false"
    ],
    "hint": "A closed channel yields remaining buffered values (ok=true), then zero values (ok=false).",
    "explanation": "The first receive drains the buffered value 9 (`ok1 = true`). The second receive on the empty, closed channel immediately returns the zero value 0 and `ok2 = false`.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "channels",
      "closing"
    ]
  },
  {
    "id": "go-int-004",
    "language": "go",
    "difficulty": "intermediate",
    "type": "multiple_choice",
    "topic": "channels",
    "subtopic": "closed_channel_write_panic",
    "standardVersion": "Go 1.22+",
    "prompt": "What occurs when a goroutine attempts to send a value to an already closed channel?",
    "code": "ch := make(chan int, 2)\nclose(ch)\nch <- 10 // Attempted send",
    "options": [
      "The runtime triggers a panic: send on closed channel",
      "The send is silently dropped and execution continues",
      "The send blocks indefinitely waiting for the channel to reopen",
      "The channel returns false from the send expression"
    ],
    "correctAnswer": "The runtime triggers a panic: send on closed channel",
    "acceptedAnswers": [
      "The runtime triggers a panic: send on closed channel"
    ],
    "hint": "Sending to a closed channel is an unrecoverable runtime contract violation in Go.",
    "explanation": "Sending on a closed channel is illegal in Go and always immediately panics with `panic: send on closed channel`.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "channels",
      "panics",
      "safety"
    ]
  },
  {
    "id": "go-int-005",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "select",
    "subtopic": "default_non_blocking",
    "standardVersion": "Go 1.22+",
    "prompt": "What is printed by this select statement when channel ch has no available value?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tch := make(chan int)\n\tselect {\n\tcase msg := <-ch:\n\t\tfmt.Println(\"Received:\", msg)\n\tdefault:\n\t\tfmt.Println(\"Non-blocking fallback\")\n\t}\n}",
    "options": [
      "Non-blocking fallback",
      "Received: 0",
      "Deadlock panic",
      "Blocks forever"
    ],
    "correctAnswer": "Non-blocking fallback",
    "acceptedAnswers": [
      "Non-blocking fallback"
    ],
    "hint": "A select statement with a default case executes immediately without blocking if no channel case is ready.",
    "explanation": "Because `ch` is unbuffered and empty, `case msg := <-ch:` cannot proceed. The presence of `default:` prevents blocking and executes the fallback path immediately.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "concurrency",
      "select",
      "channels"
    ]
  },
  {
    "id": "go-int-006",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "sync",
    "subtopic": "waitgroup_synchronization",
    "standardVersion": "Go 1.22+",
    "prompt": "What is printed by coordinating concurrent workers with sync.WaitGroup?",
    "code": "package main\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\nfunc main() {\n\tvar wg sync.WaitGroup\n\tresults := make([]int, 3)\n\tfor i := range 3 {\n\t\twg.Add(1)\n\t\tgo func(idx int) {\n\t\t\tdefer wg.Done()\n\t\t\tresults[idx] = (idx + 1) * 10\n\t\t}(i)\n\t}\n\twg.Wait()\n\tfmt.Println(results[0] + results[1] + results[2])\n}",
    "options": [
      "60",
      "30",
      "0",
      "Panic: Concurrent slice append"
    ],
    "correctAnswer": "60",
    "acceptedAnswers": [
      "60"
    ],
    "hint": "Each worker writes to a disjoint slice index, and wg.Wait() blocks until all 3 workers call Done().",
    "explanation": "`results[0]` = 10, `results[1]` = 20, `results[2]` = 30. Because each worker writes to a distinct pre-allocated index and `wg.Wait()` guarantees completion, the sum 10 + 20 + 30 = 60 is printed reliably.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "sync",
      "waitgroup",
      "concurrency"
    ]
  },
  {
    "id": "go-int-007",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "interfaces",
    "subtopic": "implicit_satisfaction",
    "standardVersion": "Go 1.22+",
    "prompt": "How does Go verify that Dog satisfies the Speaker interface?",
    "code": "package main\nimport \"fmt\"\ntype Speaker interface {\n\tSpeak() string\n}\ntype Dog struct{}\nfunc (d Dog) Speak() string {\n\treturn \"Woof\"\n}\nfunc greet(s Speaker) {\n\tfmt.Print(s.Speak(), \"!\")\n}\nfunc main() {\n\tgreet(Dog{})\n}",
    "options": [
      "Woof!",
      "Dog!",
      "Compile Error: Dog does not implement Speaker",
      "nil!"
    ],
    "correctAnswer": "Woof!",
    "acceptedAnswers": [
      "Woof!"
    ],
    "hint": "Interfaces in Go are satisfied implicitly simply by implementing all required methods.",
    "explanation": "There is no `implements` keyword in Go. Because `Dog` defines a method `Speak() string`, it automatically and implicitly satisfies `Speaker`. Calling `greet(Dog{})` outputs \"Woof!\".",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "interfaces",
      "polymorphism"
    ]
  },
  {
    "id": "go-int-008",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "composition",
    "subtopic": "struct_embedding",
    "standardVersion": "Go 1.22+",
    "prompt": "What is the output of invoking an embedded inner struct method on an outer struct?",
    "code": "package main\nimport \"fmt\"\ntype Base struct {\n\tID int\n}\nfunc (b Base) Identify() int {\n\treturn b.ID * 10\n}\ntype Player struct {\n\tBase\n\tName string\n}\nfunc main() {\n\tp := Player{Base: Base{ID: 5}, Name: \"Gopher\"}\n\tfmt.Println(p.Identify())\n}",
    "options": [
      "50",
      "5",
      "0",
      "Compile Error: Cannot access inner method directly"
    ],
    "correctAnswer": "50",
    "acceptedAnswers": [
      "50"
    ],
    "hint": "Embedded struct methods are promoted to the outer struct directly.",
    "explanation": "Go supports composition via struct embedding. Methods of `Base` (such as `Identify()`) are promoted directly to `Player`, so `p.Identify()` delegates to `p.Base.Identify()`, returning 5 * 10 = 50.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "structs",
      "embedding",
      "composition"
    ]
  },
  {
    "id": "go-int-009",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "errors",
    "subtopic": "panic_and_recover",
    "standardVersion": "Go 1.22+",
    "prompt": "What does recover() capture when invoked inside a deferred function during panic?",
    "code": "package main\nimport \"fmt\"\nfunc safeRun() {\n\tdefer func() {\n\t\tif r := recover(); r != nil {\n\t\t\tfmt.Print(\"Recovered:\", r)\n\t\t}\n\t}()\n\tpanic(\"critical error\")\n\tfmt.Print(\"End\")\n}\nfunc main() {\n\tsafeRun()\n}",
    "options": [
      "Recovered:critical error",
      "critical error",
      "Recovered:critical errorEnd",
      "Crash with stack trace"
    ],
    "correctAnswer": "Recovered:critical error",
    "acceptedAnswers": [
      "Recovered:critical error"
    ],
    "hint": "recover() stops panicking behavior and returns the value supplied to panic().",
    "explanation": "When `panic(\"critical error\")` occurs, normal execution halts and deferred functions run. The deferred closure calls `recover()`, which intercepts the panic value and prints \"Recovered:critical error\".",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "panic",
      "recover",
      "error_handling"
    ]
  },
  {
    "id": "go-int-010",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "errors",
    "subtopic": "error_wrapping_and_is",
    "standardVersion": "Go 1.22+",
    "prompt": "What does errors.Is report when inspecting a wrapped error chain (%w)?",
    "code": "package main\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\nvar ErrNotFound = errors.New(\"not found\")\nfunc findItem() error {\n\treturn fmt.Errorf(\"repository query: %w\", ErrNotFound)\n}\nfunc main() {\n\terr := findItem()\n\tfmt.Println(errors.Is(err, ErrNotFound))\n}",
    "options": [
      "true",
      "false",
      "repository query: not found",
      "Compile Error"
    ],
    "correctAnswer": "true",
    "acceptedAnswers": [
      "true"
    ],
    "hint": "fmt.Errorf with %w creates a wrapped error that errors.Is traverses recursively.",
    "explanation": "`fmt.Errorf(\"...: %w\", ErrNotFound)` wraps the sentinel error. `errors.Is(err, ErrNotFound)` inspects the unwrapped chain and finds `ErrNotFound`, returning `true`.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "errors",
      "error_wrapping",
      "standard_library"
    ]
  },
  {
    "id": "go-int-011",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "interfaces",
    "subtopic": "nil_interface_vs_nil_pointer",
    "standardVersion": "Go 1.22+",
    "prompt": "What is printed when testing an interface variable containing a typed nil pointer against nil?",
    "code": "package main\nimport \"fmt\"\ntype Reader interface {\n\tRead()\n}\ntype Buffer struct{}\nfunc (b *Buffer) Read() {}\nfunc main() {\n\tvar buf *Buffer = nil\n\tvar r Reader = buf\n\tfmt.Println(r == nil)\n}",
    "options": [
      "false",
      "true",
      "Panic: Nil interface dereference",
      "Compile Error: Cannot assign nil to interface"
    ],
    "correctAnswer": "false",
    "acceptedAnswers": [
      "false"
    ],
    "hint": "An interface in Go is only nil if both its type descriptor and its value are nil.",
    "explanation": "An interface value is a pair `(type, value)`. Here, `r` has type `*Buffer` and value `nil`. Because the type descriptor is non-nil (`*Buffer`), `r == nil` evaluates to `false`. This is one of Go's most famous gotchas.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "interfaces",
      "nil_gotcha",
      "type_system"
    ]
  },
  {
    "id": "go-int-012",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "sync",
    "subtopic": "sync_once",
    "standardVersion": "Go 1.22+",
    "prompt": "How many times does sync.Once execute its function across multiple invocations?",
    "code": "package main\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\nfunc main() {\n\tvar once sync.Once\n\tcounter := 0\n\tinitFunc := func() { counter++ }\n\tfor range 5 {\n\t\tonce.Do(initFunc)\n\t}\n\tfmt.Println(counter)\n}",
    "options": [
      "1",
      "5",
      "0",
      "Compile Error"
    ],
    "correctAnswer": "1",
    "acceptedAnswers": [
      "1"
    ],
    "hint": "sync.Once guarantees that the passed function is called exactly once, regardless of call frequency.",
    "explanation": "`once.Do(...)` only executes on the first call. All subsequent calls on that `Once` instance are no-ops, so `counter` is incremented exactly once, printing 1.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "sync",
      "concurrency",
      "patterns"
    ]
  },
  {
    "id": "go-int-013",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "channels",
    "subtopic": "range_over_channel",
    "standardVersion": "Go 1.22+",
    "prompt": "What condition terminates a for-range loop over a channel?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tch := make(chan int, 3)\n\tch <- 1\n\tch <- 2\n\tclose(ch)\n\tsum := 0\n\tfor val := range ch {\n\t\tsum += val\n\t}\n\tfmt.Println(sum)\n}",
    "options": [
      "3",
      "0",
      "Deadlock panic",
      "Infinite loop"
    ],
    "correctAnswer": "3",
    "acceptedAnswers": [
      "3"
    ],
    "hint": "A for-range channel loop iterates until the channel is closed and all buffered values are drained.",
    "explanation": "`for val := range ch` reads items 1 and 2 from the buffer. Because `close(ch)` was called, once the buffer is empty the loop cleanly exits, printing 1 + 2 = 3.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "channels",
      "loops",
      "range"
    ]
  },
  {
    "id": "go-int-014",
    "language": "go",
    "difficulty": "intermediate",
    "type": "find_bug",
    "topic": "sync",
    "subtopic": "waitgroup_passed_by_value",
    "standardVersion": "Go 1.22+",
    "prompt": "Which line contains a critical defect where sync.WaitGroup is copied by value instead of passed as a pointer?",
    "code": "1: package main\n2: import \"sync\"\n3: func worker(id int, wg sync.WaitGroup) {\n4: \tdefer wg.Done()\n5: }",
    "options": [
      "Line 3",
      "Line 4",
      "Line 2",
      "Line 1"
    ],
    "correctAnswer": "Line 3",
    "acceptedAnswers": [
      "Line 3",
      "3"
    ],
    "targetLine": 3,
    "hint": "sync.WaitGroup must never be copied after first use; it must be passed by pointer (*sync.WaitGroup).",
    "explanation": "On Line 3, `wg sync.WaitGroup` passes the WaitGroup by value, copying its internal mutex and counter state. Calling `Done()` on the copy has no effect on the caller's WaitGroup, causing `wg.Wait()` to deadlock. The parameter must be `*sync.WaitGroup`.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "sync",
      "bugs",
      "pointers"
    ]
  },
  {
    "id": "go-int-015",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "types",
    "subtopic": "type_switch",
    "standardVersion": "Go 1.22+",
    "prompt": "What does this type switch output when given an empty interface holding a string?",
    "code": "package main\nimport \"fmt\"\nfunc describe(val any) {\n\tswitch v := val.(type) {\n\tcase int:\n\t\tfmt.Print(\"Int:\", v)\n\tcase string:\n\t\tfmt.Print(\"Str:\", len(v))\n\tdefault:\n\t\tfmt.Print(\"Other\")\n\t}\n}\nfunc main() {\n\tdescribe(\"Golang\")\n}",
    "options": [
      "Str:6",
      "Int:6",
      "Str:Golang",
      "Other"
    ],
    "correctAnswer": "Str:6",
    "acceptedAnswers": [
      "Str:6"
    ],
    "hint": "A type switch matches the dynamic concrete type stored within the any/interface value.",
    "explanation": "`describe(\"Golang\")` enters `case string:`. Inside that case, `v` is bound as concrete type `string`, so `len(v)` evaluates to 6, printing \"Str:6\".",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "types",
      "type_switch",
      "interfaces"
    ]
  },
  {
    "id": "go-int-016",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "defer",
    "subtopic": "loop_defer_accumulation",
    "standardVersion": "Go 1.22+",
    "prompt": "When do deferred statements declared inside a for loop execute in Go?",
    "code": "package main\nimport \"fmt\"\nfunc loopDefers() {\n\tfor i := 1; i <= 3; i++ {\n\t\tdefer fmt.Print(i, \" \")\n\t}\n\tfmt.Print(\"LoopDone \")\n}\nfunc main() {\n\tloopDefers()\n}",
    "options": [
      "LoopDone 3 2 1 ",
      "1 2 3 LoopDone ",
      "LoopDone 1 2 3 ",
      "1 LoopDone 2 LoopDone 3 "
    ],
    "correctAnswer": "LoopDone 3 2 1 ",
    "acceptedAnswers": [
      "LoopDone 3 2 1 "
    ],
    "hint": "defer is scoped to the enclosing function, not the loop block.",
    "explanation": "In Go, `defer` does NOT execute at block scope or per loop iteration; it registers calls on the function stack. The loop finishes first, printing \"LoopDone \", then the 3 deferred calls execute LIFO: 3, 2, 1.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "defer",
      "scoping",
      "control_flow"
    ]
  },
  {
    "id": "go-int-017",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "functions",
    "subtopic": "named_returns_and_defer",
    "standardVersion": "Go 1.22+",
    "prompt": "What value is returned by this function modifying a named return variable inside defer?",
    "code": "package main\nimport \"fmt\"\nfunc compute() (result int) {\n\tresult = 10\n\tdefer func() {\n\t\tresult += 5\n\t}()\n\treturn result\n}\nfunc main() {\n\tfmt.Println(compute())\n}",
    "options": [
      "15",
      "10",
      "5",
      "0"
    ],
    "correctAnswer": "15",
    "acceptedAnswers": [
      "15"
    ],
    "hint": "Deferred functions can observe and modify named return variables before the caller receives them.",
    "explanation": "`return result` assigns 10 to the named return variable `result`. Then the deferred closure runs before returning control to `main`, mutating `result` to 10 + 5 = 15.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "functions",
      "named_returns",
      "defer"
    ]
  },
  {
    "id": "go-int-018",
    "language": "go",
    "difficulty": "intermediate",
    "type": "multiple_choice",
    "topic": "channels",
    "subtopic": "directionality",
    "standardVersion": "Go 1.22+",
    "prompt": "In Go function signatures, what is the meaning of <-chan int versus chan<- int?",
    "code": "func ReadOnly(ch <-chan int)\nfunc WriteOnly(ch chan<- int)",
    "options": [
      "<-chan int is receive-only; chan<- int is send-only",
      "<-chan int is send-only; chan<- int is receive-only",
      "Both indicate unbuffered channel aliases",
      "<-chan int is asynchronous; chan<- int is synchronous"
    ],
    "correctAnswer": "<-chan int is receive-only; chan<- int is send-only",
    "acceptedAnswers": [
      "<-chan int is receive-only; chan<- int is send-only"
    ],
    "hint": "The arrow points in the direction of data flow: <-chan receives from channel, chan<- sends into channel.",
    "explanation": "`<-chan int` restricts the caller to receiving values from the channel. `chan<- int` restricts the caller to sending values into the channel. Violations produce compile-time type errors.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "channels",
      "type_safety",
      "directionality"
    ]
  },
  {
    "id": "go-int-019",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "sync",
    "subtopic": "rwmutex_semantics",
    "standardVersion": "Go 1.22+",
    "prompt": "What distinguishes sync.RWMutex RLock() from Lock()?",
    "code": "package main\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\nfunc main() {\n\tvar rw sync.RWMutex\n\trw.RLock()\n\trw.RLock() // Second reader concurrently\n\tfmt.Print(\"ReadersOK \")\n\trw.RUnlock()\n\trw.RUnlock()\n}",
    "options": [
      "ReadersOK ",
      "Deadlock error",
      "Panic: recursive lock",
      "Compile error"
    ],
    "correctAnswer": "ReadersOK ",
    "acceptedAnswers": [
      "ReadersOK "
    ],
    "hint": "Multiple readers can acquire RLock() concurrently without blocking one another.",
    "explanation": "`sync.RWMutex` allows multiple simultaneous readers (`RLock()`). Readers do not block other readers; only writers (`Lock()`) require exclusive access.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "sync",
      "rwmutex",
      "concurrency"
    ]
  },
  {
    "id": "go-int-020",
    "language": "go",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "slices",
    "subtopic": "subslice_mutation_hazard",
    "standardVersion": "Go 1.22+",
    "prompt": "What is printed after mutating an element in a sub-slice sharing a backing array?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\torigin := []int{1, 2, 3}\n\tsub := origin[1:3]\n\tsub[0] = 99\n\tfmt.Println(origin[1])\n}",
    "options": [
      "99",
      "2",
      "1",
      "Panic: Slice out of range"
    ],
    "correctAnswer": "99",
    "acceptedAnswers": [
      "99"
    ],
    "hint": "A sub-slice shares the identical underlying backing array with its parent slice.",
    "explanation": "`sub := origin[1:3]` does not copy the array; `sub[0]` refers to the exact same memory location as `origin[1]`. Mutating `sub[0] = 99` modifies `origin[1]` to 99.",
    "points": 200,
    "estimatedSeconds": 30,
    "tags": [
      "go",
      "slices",
      "memory",
      "sharing"
    ]
  },
  {
    "id": "go-exp-001",
    "language": "go",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "memory",
    "subtopic": "subslice_memory_leak",
    "standardVersion": "Go 1.22+",
    "prompt": "Why does keeping a small sub-slice of a huge array cause a hidden memory leak in Go?",
    "code": "func getHeader() []byte {\n\tlargeLog := make([]byte, 100_000_000) // 100 MB\n\treturn largeLog[:4] // Retaining 4 bytes\n}",
    "options": [
      "The sub-slice keeps a reference to the entire 100 MB backing array, preventing garbage collection",
      "Go slices do not support garbage collection",
      "Returning a slice from a function copies the entire 100 MB onto the stack",
      "The garbage collector frees the array and causes dangling pointers"
    ],
    "correctAnswer": "The sub-slice keeps a reference to the entire 100 MB backing array, preventing garbage collection",
    "acceptedAnswers": [
      "The sub-slice keeps a reference to the entire 100 MB backing array, preventing garbage collection"
    ],
    "hint": "A slice header holds a pointer to the start of its underlying backing array.",
    "explanation": "Even though only 4 bytes are exposed, the slice header points to the underlying 100 MB array. Because the sub-slice is reachable, the entire 100 MB memory block cannot be freed by GC. Solution: copy the 4 bytes to a fresh slice.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "memory",
      "gc",
      "slices",
      "leaks"
    ]
  },
  {
    "id": "go-exp-002",
    "language": "go",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "slices",
    "subtopic": "full_slice_expression",
    "standardVersion": "Go 1.22+",
    "prompt": "What capacity does the 3-index slice expression s[0:2:2] establish on s?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tbuf := []int{10, 20, 30, 40, 50}\n\ts := buf[0:2:2]\n\ts = append(s, 99)\n\tfmt.Println(cap(s) > 2, buf[2])\n}",
    "options": [
      "true 30",
      "false 99",
      "true 99",
      "false 30"
    ],
    "correctAnswer": "true 30",
    "acceptedAnswers": [
      "true 30"
    ],
    "hint": "The 3-index slice expression [low:high:max] limits capacity to max - low, preventing append from overwriting parent buffer.",
    "explanation": "`buf[0:2:2]` bounds `cap(s)` strictly to 2. Appending 99 exceeds this constrained capacity, forcing Go to allocate a new independent backing array. Therefore, original `buf[2]` remains untouched at 30 and `cap(s) > 2` is true.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "slices",
      "three_index",
      "memory_safety"
    ]
  },
  {
    "id": "go-exp-003",
    "language": "go",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "compiler",
    "subtopic": "escape_analysis",
    "standardVersion": "Go 1.22+",
    "prompt": "What does the Go compiler's escape analysis determine for variable x in this function?",
    "code": "func createCounter() *int {\n\tx := 42\n\treturn &x\n}",
    "options": [
      "x escapes to the heap because its memory address outlives the stack frame",
      "Returning &x produces a dangling pointer because x is destroyed when the function returns",
      "The compiler issues a fatal syntax error because stack pointers cannot be returned",
      "x is allocated in CPU registers and copied by value"
    ],
    "correctAnswer": "x escapes to the heap because its memory address outlives the stack frame",
    "acceptedAnswers": [
      "x escapes to the heap because its memory address outlives the stack frame"
    ],
    "hint": "Unlike C, Go safely moves stack variables to the heap if their address is shared beyond the function.",
    "explanation": "Go performs compile-time escape analysis (`go build -gcflags=\"-m\"`). Because `&x` is returned, `x` outlives `createCounter()` and is allocated on the heap, ensuring memory safety without dangling pointer bugs.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "compiler",
      "escape_analysis",
      "memory"
    ]
  },
  {
    "id": "go-exp-004",
    "language": "go",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "sync_atomic",
    "subtopic": "lockless_counter",
    "standardVersion": "Go 1.22+",
    "prompt": "What does atomic.AddInt64 return and store in this concurrent operation?",
    "code": "package main\nimport (\n\t\"fmt\"\n\t\"sync/atomic\"\n)\nfunc main() {\n\tvar counter int64 = 100\n\tnewVal := atomic.AddInt64(&counter, 25)\n\tfmt.Println(counter, newVal)\n}",
    "options": [
      "125 125",
      "100 125",
      "125 100",
      "0 125"
    ],
    "correctAnswer": "125 125",
    "acceptedAnswers": [
      "125 125"
    ],
    "hint": "atomic.AddInt64 performs a hardware-level atomic fetch-and-add instruction and returns the new value.",
    "explanation": "`atomic.AddInt64(&counter, 25)` atomically increments `counter` by 25 using CPU cache lock/bus instructions and returns the updated value (125). Both `counter` and `newVal` evaluate to 125.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "concurrency",
      "atomic",
      "sync"
    ]
  },
  {
    "id": "go-exp-005",
    "language": "go",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "context",
    "subtopic": "cancellation_propagation",
    "standardVersion": "Go 1.22+",
    "prompt": "What is the primary mechanism by which context.WithCancel notifies worker goroutines to shut down?",
    "code": "ctx, cancel := context.WithCancel(context.Background())\n// Workers listen on:\n<-ctx.Done()",
    "options": [
      "Calling cancel() closes the context's internal Done() channel, unblocking all listening goroutines",
      "Calling cancel() forcibly terminates worker goroutine threads via OS signals",
      "Calling cancel() sets a boolean flag that workers must periodically poll",
      "The Go runtime raises an uncatchable panic in all child goroutines"
    ],
    "correctAnswer": "Calling cancel() closes the context's internal Done() channel, unblocking all listening goroutines",
    "acceptedAnswers": [
      "Calling cancel() closes the context's internal Done() channel, unblocking all listening goroutines"
    ],
    "hint": "In Go, closing a channel acts as a broadcast signal that awakens all receiving goroutines simultaneously.",
    "explanation": "`cancel()` closes the channel returned by `ctx.Done()`. Because reads from closed channels succeed immediately returning a zero value, all goroutines blocked on `<-ctx.Done()` wake up simultaneously to exit cleanly.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "context",
      "cancellation",
      "concurrency"
    ]
  },
  {
    "id": "go-exp-006",
    "language": "go",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "generics",
    "subtopic": "comparable_constraint",
    "standardVersion": "Go 1.22+",
    "prompt": "What does this generic Go function utilizing the comparable constraint print?",
    "code": "package main\nimport \"fmt\"\nfunc Contains[T comparable](elems []T, target T) bool {\n\tfor _, v := range elems {\n\t\tif v == target {\n\t\t\treturn true\n\t\t}\n\t}\n\treturn false\n}\nfunc main() {\n\tfmt.Println(Contains([]string{\"a\", \"b\", \"c\"}, \"b\"))\n}",
    "options": [
      "true",
      "false",
      "1",
      "Compile Error: Type parameters not allowed"
    ],
    "correctAnswer": "true",
    "acceptedAnswers": [
      "true"
    ],
    "hint": "The comparable constraint allows types that support == and != equality operators.",
    "explanation": "`comparable` is a built-in constraint for any type supporting `==` and `!=`. The generic function accepts `[]string` and compares \"b\" == \"b\", returning `true`.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "generics",
      "comparable",
      "type_parameters"
    ]
  },
  {
    "id": "go-exp-007",
    "language": "go",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "concurrency",
    "subtopic": "deadlock_detection",
    "standardVersion": "Go 1.22+",
    "prompt": "Why does this program trigger \"fatal error: all goroutines are asleep - deadlock!\" at runtime?",
    "code": "package main\nfunc main() {\n\tch := make(chan int)\n\tch <- 1\n\t<-ch\n}",
    "options": [
      "Sending to an unbuffered channel in main blocks before the subsequent line can receive",
      "Unbuffered channels cannot be declared in the main function",
      "The main function cannot send values greater than 0",
      "Channels must be closed before reading"
    ],
    "correctAnswer": "Sending to an unbuffered channel in main blocks before the subsequent line can receive",
    "acceptedAnswers": [
      "Sending to an unbuffered channel in main blocks before the subsequent line can receive"
    ],
    "hint": "An unbuffered send blocks until another concurrent goroutine is actively receiving.",
    "explanation": "`ch <- 1` blocks `main` waiting for a concurrent receiver. But because there are no other running goroutines, the runtime deadlock detector discovers that all goroutines are permanently asleep and aborts.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "deadlock",
      "channels",
      "runtime"
    ]
  },
  {
    "id": "go-exp-008",
    "language": "go",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "runtime",
    "subtopic": "gmp_scheduler_model",
    "standardVersion": "Go 1.22+",
    "prompt": "In the Go runtime scheduler (the GMP model), what do G, M, and P represent?",
    "code": "// Go runtime scheduler GMP architecture\nG -> Goroutine\nM -> OS Thread\nP -> Logical Processor / Execution Context",
    "options": [
      "G is Goroutine, M is Machine (OS Thread), P is Processor (logical execution context executing Go code)",
      "G is Garbage collector, M is Memory heap, P is Pointer map",
      "G is Global variable, M is Mutex lock, P is Profiler agent",
      "G is Gateway pipe, M is Main routine, P is Packet socket"
    ],
    "correctAnswer": "G is Goroutine, M is Machine (OS Thread), P is Processor (logical execution context executing Go code)",
    "acceptedAnswers": [
      "G is Goroutine, M is Machine (OS Thread), P is Processor (logical execution context executing Go code)"
    ],
    "hint": "G is the goroutine, M represents the underlying OS thread, and P is the processor context holding runqueues.",
    "explanation": "The Go runtime uses the GMP model: G (Goroutine state & stack), M (OS thread / machine), and P (Logical Processor context with local runqueues, typically equal to `GOMAXPROCS`). An M must acquire a P to execute Gs.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "runtime",
      "scheduler",
      "architecture"
    ]
  },
  {
    "id": "go-exp-009",
    "language": "go",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "memory_model",
    "subtopic": "happens_before_channel",
    "standardVersion": "Go 1.22+",
    "prompt": "According to the Go Memory Model, what happens-before relationship is guaranteed by an unbuffered channel?",
    "code": "var msg string\nvar done = make(chan struct{})\nfunc worker() {\n\tmsg = \"processed\"\n\tdone <- struct{}{}\n}\nfunc main() {\n\tgo worker()\n\t<-done\n\tfmt.Println(msg)\n}",
    "options": [
      "A send on an unbuffered channel happens-before the corresponding receive completes, guaranteeing visibility of msg",
      "Channel operations have no memory ordering guarantees",
      "The write to msg happens concurrently with the receive",
      "Only sync.Mutex establishes happens-before edges"
    ],
    "correctAnswer": "A send on an unbuffered channel happens-before the corresponding receive completes, guaranteeing visibility of msg",
    "acceptedAnswers": [
      "A send on an unbuffered channel happens-before the corresponding receive completes, guaranteeing visibility of msg"
    ],
    "hint": "Channel communication is the primary synchronization primitive establishing happens-before relations in Go.",
    "explanation": "The Go memory model specifies that a send on a channel happens-before the corresponding receive from that channel completes. Therefore, `msg = \"processed\"` is guaranteed to be observed by `main` without data races.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "memory_model",
      "happens_before",
      "concurrency"
    ]
  },
  {
    "id": "go-exp-010",
    "language": "go",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "unsafe",
    "subtopic": "uintptr_vs_unsafe_pointer",
    "standardVersion": "Go 1.22+",
    "prompt": "Why is storing a memory address in a uintptr variable unsafe across garbage collection cycles?",
    "code": "p := &data\nu := uintptr(unsafe.Pointer(p))\n// ... some time later ...\np2 := (*Data)(unsafe.Pointer(u))",
    "options": [
      "uintptr is an ordinary integer; the garbage collector does not treat it as a reference and may move or free the object",
      "uintptr values cause immediate compilation errors in Go 1.22",
      "uintptr truncates 64-bit addresses to 32-bits",
      "unsafe.Pointer cannot be converted to uintptr"
    ],
    "correctAnswer": "uintptr is an ordinary integer; the garbage collector does not treat it as a reference and may move or free the object",
    "acceptedAnswers": [
      "uintptr is an ordinary integer; the garbage collector does not treat it as a reference and may move or free the object"
    ],
    "hint": "GC traces pointers, but completely ignores raw integer types like uintptr.",
    "explanation": "`uintptr` is an integer, not a pointer. It does not prevent garbage collection of the target object, nor is it updated if the moving GC relocates the object. Storing pointers as uintptr across statements results in memory corruption.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "unsafe",
      "pointers",
      "gc"
    ]
  },
  {
    "id": "go-exp-011",
    "language": "go",
    "difficulty": "expert",
    "type": "find_bug",
    "topic": "channels",
    "subtopic": "nil_channel_deadlock",
    "standardVersion": "Go 1.22+",
    "prompt": "Which line causes a permanent hang because receiving from a nil channel blocks forever?",
    "code": "1: package main\n2: func main() {\n3: \tvar ch chan int\n4: \tval := <-ch\n5: \t_ = val\n6: }",
    "options": [
      "Line 4",
      "Line 3",
      "Line 2",
      "Line 5"
    ],
    "correctAnswer": "Line 4",
    "acceptedAnswers": [
      "Line 4",
      "4"
    ],
    "targetLine": 4,
    "hint": "A send or receive on a nil channel never panics; it blocks forever.",
    "explanation": "`var ch chan int` initializes `ch` to `nil`. In Go, sending to or receiving from a `nil` channel blocks indefinitely. On Line 4, `<-ch` blocks forever, triggering a deadlock panic.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "channels",
      "nil_channel",
      "deadlocks"
    ]
  },
  {
    "id": "go-exp-012",
    "language": "go",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "generics",
    "subtopic": "type_approximation",
    "standardVersion": "Go 1.22+",
    "prompt": "What does the tilde operator (~int) signify in a Go generic type constraint?",
    "code": "package main\nimport \"fmt\"\ntype MyInt int\ntype Numeric interface {\n\t~int\n}\nfunc Double[T Numeric](x T) T {\n\treturn x * 2\n}\nfunc main() {\n\tvar a MyInt = 21\n\tfmt.Println(Double(a))\n}",
    "options": [
      "42",
      "21",
      "Compile Error: MyInt does not satisfy Numeric",
      "42.0"
    ],
    "correctAnswer": "42",
    "acceptedAnswers": [
      "42"
    ],
    "hint": "The tilde token ~T matches any type whose underlying concrete type is T.",
    "explanation": "`~int` means any type with the underlying type `int`. Because `type MyInt int` has underlying type `int`, it satisfies the `Numeric` constraint. `Double(21)` returns 42.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "generics",
      "constraints",
      "type_sets"
    ]
  },
  {
    "id": "go-exp-013",
    "language": "go",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "sync",
    "subtopic": "sync_pool_gc_behavior",
    "standardVersion": "Go 1.22+",
    "prompt": "When can items cached inside a sync.Pool be discarded by the Go runtime?",
    "code": "var pool = sync.Pool{\n\tNew: func() any { return new(bytes.Buffer) },\n}",
    "options": [
      "Items in sync.Pool may be automatically evicted and reclaimed on each Garbage Collection cycle",
      "Items in sync.Pool persist indefinitely until manually removed with pool.Clear()",
      "sync.Pool items are saved to virtual disk swap space",
      "Items are discarded only when the process encounters out-of-memory errors"
    ],
    "correctAnswer": "Items in sync.Pool may be automatically evicted and reclaimed on each Garbage Collection cycle",
    "acceptedAnswers": [
      "Items in sync.Pool may be automatically evicted and reclaimed on each Garbage Collection cycle"
    ],
    "hint": "sync.Pool is an ephemeral object cache, not an unbounded long-term memory store.",
    "explanation": "`sync.Pool` is designed for reusing allocated temporary objects between GC runs. During garbage collection, the runtime drops unreferenced pooled items to prevent memory bloat.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "sync",
      "sync_pool",
      "performance",
      "gc"
    ]
  },
  {
    "id": "go-exp-014",
    "language": "go",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "runtime",
    "subtopic": "non_cooperative_preemption",
    "standardVersion": "Go 1.22+",
    "prompt": "How does the Go runtime preempt tight numerical computation loops that contain no function calls?",
    "code": "// Tight loop with no function calls:\nfor {\n\tcount++\n}",
    "options": [
      "Via asynchronous preemption signals (SIGURG on Unix) introduced in Go 1.14",
      "Go cannot preempt tight loops; they hang the thread permanently",
      "The OS thread terminates after 10 milliseconds of continuous execution",
      "The compiler inserts mandatory sleep instructions into every loop"
    ],
    "correctAnswer": "Via asynchronous preemption signals (SIGURG on Unix) introduced in Go 1.14",
    "acceptedAnswers": [
      "Via asynchronous preemption signals (SIGURG on Unix) introduced in Go 1.14"
    ],
    "hint": "Since Go 1.14, the runtime uses OS signals to interrupt goroutines at arbitrary machine instructions.",
    "explanation": "Prior to Go 1.14, preemption required cooperative checkpoints (such as function prologue checks). Go 1.14+ implemented signal-based asynchronous preemption (`SIGURG`), allowing the scheduler to deschedule tight loops at safe points.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "runtime",
      "preemption",
      "scheduler"
    ]
  },
  {
    "id": "go-exp-015",
    "language": "go",
    "difficulty": "expert",
    "type": "find_bug",
    "topic": "concurrency",
    "subtopic": "concurrent_map_mutation",
    "standardVersion": "Go 1.22+",
    "prompt": "Which line causes a non-recoverable runtime crash due to unsynchronized concurrent map writes?",
    "code": "1: package main\n2: func main() {\n3: \tm := make(map[int]int)\n4: \tfor i := range 2 {\n5: \t\tgo func(n int) { m[n] = n * 10 }(i)\n6: \t}\n7: }",
    "options": [
      "Line 5",
      "Line 3",
      "Line 4",
      "Line 2"
    ],
    "correctAnswer": "Line 5",
    "acceptedAnswers": [
      "Line 5",
      "5"
    ],
    "targetLine": 5,
    "hint": "Go built-in maps do not support concurrent writes and intentionally panic with fatal error: concurrent map writes.",
    "explanation": "On Line 5, multiple goroutines concurrently mutate `m` without a mutex. The Go runtime includes built-in race detection in map internals that triggers an immediate, unrecoverable crash: `fatal error: concurrent map writes`. Fix: use `sync.Mutex` or `sync.Map`.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "concurrency",
      "maps",
      "race_conditions"
    ]
  },
  {
    "id": "go-exp-016",
    "language": "go",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "reflect",
    "subtopic": "settability",
    "standardVersion": "Go 1.22+",
    "prompt": "What happens when attempting to modify a variable via reflection without passing a pointer?",
    "code": "package main\nimport (\n\t\"fmt\"\n\t\"reflect\"\n)\nfunc main() {\n\tx := 10\n\tv := reflect.ValueOf(x)\n\tfmt.Println(v.CanSet())\n}",
    "options": [
      "false",
      "true",
      "Panic: reflect value invalid",
      "10"
    ],
    "correctAnswer": "false",
    "acceptedAnswers": [
      "false"
    ],
    "hint": "reflect.ValueOf copies the passed value, making it unaddressable and non-settable.",
    "explanation": "Because `x` was passed by value to `reflect.ValueOf`, `v` holds a copy. `v.CanSet()` returns `false`. To modify `x`, one must pass a pointer: `reflect.ValueOf(&x).Elem().CanSet()` which is `true`.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "reflect",
      "metaprogramming",
      "settability"
    ]
  },
  {
    "id": "go-exp-017",
    "language": "go",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "generics",
    "subtopic": "method_type_parameter_restriction",
    "standardVersion": "Go 1.22+",
    "prompt": "In Go, why does declaring type parameters directly on a struct method cause a compile-time error?",
    "code": "type Repository struct{}\n// Attempted method with its own type parameter:\nfunc (r Repository) Query[T any](id string) T { ... }",
    "options": [
      "Go does not allow methods to declare their own type parameters; type parameters must belong to the receiver type",
      "Generics are not supported in struct methods at all",
      "The any constraint cannot be used in methods",
      "The return type of a method must be an interface"
    ],
    "correctAnswer": "Go does not allow methods to declare their own type parameters; type parameters must belong to the receiver type",
    "acceptedAnswers": [
      "Go does not allow methods to declare their own type parameters; type parameters must belong to the receiver type"
    ],
    "hint": "Go generics deliberately omitted parameterized methods to maintain interface dispatch simplicity and prevent infinite method sets.",
    "explanation": "In Go, methods cannot have their own type parameters because it would complicate interface satisfaction and require runtime code generation / dynamic dispatch. Type parameters can only be declared on types or standalone functions.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "generics",
      "methods",
      "limitations"
    ]
  },
  {
    "id": "go-exp-018",
    "language": "go",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "channels",
    "subtopic": "select_random_fairness",
    "standardVersion": "Go 1.22+",
    "prompt": "When multiple cases in a select statement are simultaneously ready, how does Go choose which one executes?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\tch1 := make(chan int, 1)\n\tch2 := make(chan int, 1)\n\tch1 <- 1\n\tch2 <- 2\n\t// If both cases are ready:\n\t// Go selects uniformly at pseudo-random\n\tfmt.Println(\"Pseudo-random uniform selection\")\n}",
    "options": [
      "Pseudo-random uniform selection",
      "Strict top-to-bottom priority",
      "Always ch1",
      "FIFO order"
    ],
    "correctAnswer": "Pseudo-random uniform selection",
    "acceptedAnswers": [
      "Pseudo-random uniform selection"
    ],
    "hint": "Go select statements deliberately randomize case selection when multiple channels are ready.",
    "explanation": "Unlike sequential `if-else` blocks, Go's `select` implements a pseudo-random uniform selection algorithm among ready cases to avoid starvation and priority bias.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "select",
      "channels",
      "scheduling"
    ]
  },
  {
    "id": "go-exp-019",
    "language": "go",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "context",
    "subtopic": "context_values_best_practice",
    "standardVersion": "Go 1.22+",
    "prompt": "What is the idiomatic Go best practice for context.WithValue keys to avoid package collisions?",
    "code": "// Approach A: ctx = context.WithValue(ctx, \"userID\", 123)\n// Approach B: type userKey struct{}; ctx = context.WithValue(ctx, userKey{}, 123)",
    "options": [
      "Define an unexported custom struct/type as the key to prevent namespace collisions across packages",
      "Use built-in string keys prefixed with the package name",
      "Store keys as integer pointers",
      "Never use context.WithValue under any circumstance"
    ],
    "correctAnswer": "Define an unexported custom struct/type as the key to prevent namespace collisions across packages",
    "acceptedAnswers": [
      "Define an unexported custom struct/type as the key to prevent namespace collisions across packages"
    ],
    "hint": "Using built-in types like string can collide when multiple independent packages store context data.",
    "explanation": "The official Go guidance states: \"The provided key must be comparable and should not be of type string or any other built-in type to avoid collisions between packages using context.\" Defining an unexported type `type contextKey struct{}` guarantees total key uniqueness.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "context",
      "with_value",
      "best_practices"
    ]
  },
  {
    "id": "go-exp-020",
    "language": "go",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "goroutines",
    "subtopic": "stack_growth",
    "standardVersion": "Go 1.22+",
    "prompt": "How does Go manage goroutine stack allocation compared to operating system thread stacks?",
    "code": "package main\nimport \"fmt\"\nfunc main() {\n\t// Starting stack size of a Go goroutine is typically ~2KB (dynamically contiguous)\n\t// whereas OS threads allocate fixed 1MB-8MB stacks.\n\tfmt.Println(\"Dynamic 2KB segmented/contiguous stacks\")\n}",
    "options": [
      "Dynamic 2KB segmented/contiguous stacks",
      "Fixed 8MB OS thread stacks",
      "Static 64KB stack boundaries",
      "Heap-only allocation without stack"
    ],
    "correctAnswer": "Dynamic 2KB segmented/contiguous stacks",
    "acceptedAnswers": [
      "Dynamic 2KB segmented/contiguous stacks"
    ],
    "hint": "Goroutines begin with tiny stacks (~2KB) that grow and shrink contiguously as needed.",
    "explanation": "Goroutines start with only ~2KB of contiguous stack space (growing and shrinking dynamically by allocating larger contiguous buffers and copying pointers), enabling millions of concurrent goroutines in a single Go process.",
    "points": 300,
    "estimatedSeconds": 45,
    "tags": [
      "go",
      "goroutines",
      "memory",
      "stack_allocation"
    ]
  }
];
