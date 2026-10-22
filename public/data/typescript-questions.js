/**
 * SyntaxArena Question Bank — TypeScript (v5+)
 * Exactly 60 curated challenges: 20 Beginner, 20 Intermediate, 20 Expert.
 * Standard: TypeScript 5.4+
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

export const typescriptQuestions = [
  {
    "id": "ts-beg-001",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "type_annotations",
    "subtopic": "primitive_types",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What happens when compiling and running this basic TypeScript variable assignment?",
    "code": "let age: number = 25;\nage = \"30\" as any;\nconsole.log(typeof age);",
    "options": [
      "\"string\"",
      "\"number\"",
      "Compile Error: Type \"string\" not assignable",
      "undefined"
    ],
    "correctAnswer": "\"string\"",
    "acceptedAnswers": [
      "\"string\""
    ],
    "hint": "TypeScript types are erased at runtime during JavaScript compilation.",
    "explanation": "TypeScript is erased at runtime. Using \"as any\" bypasses compile-time checks, and JavaScript assigns the string \"30\", so `typeof age` evaluates to \"string\" at runtime.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "primitives",
      "type_erasure"
    ]
  },
  {
    "id": "ts-beg-002",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "arrays_and_tuples",
    "subtopic": "tuple_types",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is the output of inspecting this TypeScript tuple by index?",
    "code": "const point: [number, string] = [10, \"origin\"];\nconsole.log(point[0] + 5, point[1].toUpperCase());",
    "options": [
      "15 ORIGIN",
      "10 origin",
      "15 origin",
      "Compile error: Tuple index out of bounds"
    ],
    "correctAnswer": "15 ORIGIN",
    "acceptedAnswers": [
      "15 ORIGIN"
    ],
    "hint": "Tuples have fixed types at specific numerical indices.",
    "explanation": "In tuple `[number, string]`, `point[0]` is typed as `number` (10 + 5 = 15) and `point[1]` is `string` (\"origin\".toUpperCase() = \"ORIGIN\"). Output is `15 ORIGIN`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "tuples",
      "arrays"
    ]
  },
  {
    "id": "ts-beg-003",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "find_bug",
    "topic": "unknown_vs_any",
    "subtopic": "type_safety",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Which line causes a TypeScript compiler error due to strict type safety on unknown?",
    "code": "1: function processValue(val: unknown) {\n2:   const a: any = val;\n3:   const len = val.length;\n4:   if (typeof val === \"string\") console.log(val.toUpperCase());\n5: }",
    "options": [
      "Line 3",
      "Line 2",
      "Line 4",
      "Line 1"
    ],
    "correctAnswer": "Line 3",
    "acceptedAnswers": [
      "Line 3",
      "3"
    ],
    "targetLine": 3,
    "hint": "The unknown type requires type narrowing or casting before properties can be accessed.",
    "explanation": "TypeScript forbids accessing properties on values of type `unknown` without prior type narrowing or assertion. Line 3 (`val.length`) produces compiler error `Object is of type \"unknown\"`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "unknown",
      "type_safety"
    ]
  },
  {
    "id": "ts-beg-004",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "interfaces",
    "subtopic": "optional_properties",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does this function print when the optional property is omitted?",
    "code": "interface User {\n  id: number;\n  bio?: string;\n}\nconst u: User = { id: 1 };\nconsole.log(u.bio ?? \"No Bio\");",
    "options": [
      "\"No Bio\"",
      "undefined",
      "null",
      "Compile error: bio is required"
    ],
    "correctAnswer": "\"No Bio\"",
    "acceptedAnswers": [
      "\"No Bio\""
    ],
    "hint": "Optional properties default to undefined when omitted.",
    "explanation": "In interface `User`, `bio?` is optional. Since `u.bio` is undefined, the nullish coalescing operator `??` falls back to \"No Bio\".",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "interfaces",
      "optional"
    ]
  },
  {
    "id": "ts-beg-005",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "enums",
    "subtopic": "numeric_enums",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What are the default numerical values assigned to this TypeScript enum?",
    "code": "enum Direction {\n  North,\n  East,\n  South,\n  West\n}\nconsole.log(Direction.North, Direction.West);",
    "options": [
      "0 3",
      "1 4",
      "\"North\" \"West\"",
      "undefined undefined"
    ],
    "correctAnswer": "0 3",
    "acceptedAnswers": [
      "0 3"
    ],
    "hint": "Numeric enums in TypeScript auto-increment starting from 0 by default.",
    "explanation": "By default, uninitialized numeric enums start at index 0. North=0, East=1, South=2, West=3. Output is `0 3`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "enums",
      "numeric"
    ]
  },
  {
    "id": "ts-beg-006",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "enums",
    "subtopic": "reverse_mapping",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by reverse lookup on a numeric enum?",
    "code": "enum Role {\n  User = 1,\n  Admin = 2\n}\nconsole.log(Role[1]);",
    "options": [
      "\"User\"",
      "1",
      "undefined",
      "Compile error"
    ],
    "correctAnswer": "\"User\"",
    "acceptedAnswers": [
      "\"User\""
    ],
    "hint": "Numeric enums generate bidirectional reverse mappings in compiled JavaScript.",
    "explanation": "Numeric enums in TypeScript create reverse lookup mappings where `Role[1]` evaluates to the member name string `\"User\"`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "enums",
      "reverse_mapping"
    ]
  },
  {
    "id": "ts-beg-007",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "complete_code",
    "topic": "union_types",
    "subtopic": "type_narrowing",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Which operator completes the type guard to narrow the union type?",
    "code": "function printLength(x: string | number) {\n  if (___ x === \"string\") {\n    console.log(x.length);\n  }\n}",
    "options": [
      "typeof",
      "instanceof",
      "typeis",
      "is"
    ],
    "correctAnswer": "typeof",
    "acceptedAnswers": [
      "typeof"
    ],
    "hint": "JavaScript primitive type checks use this standard unary operator.",
    "explanation": "Using `typeof x === \"string\"` narrows `x` from `string | number` down to `string` in TypeScript control flow analysis.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "unions",
      "typeof"
    ]
  },
  {
    "id": "ts-beg-008",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "type_inference",
    "subtopic": "array_literal_inference",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What inferred type does TypeScript assign to `items` without explicit annotations?",
    "code": "const items = [1, \"two\", false];\nconsole.log(typeof items[1]);",
    "options": [
      "\"string\"",
      "(number | string | boolean)[]",
      "any[]",
      "[number, string, boolean]"
    ],
    "correctAnswer": "\"string\"",
    "acceptedAnswers": [
      "\"string\""
    ],
    "hint": "At runtime `typeof items[1]` evaluates JavaScript types, while TypeScript infers (number | string | boolean)[].",
    "explanation": "TypeScript infers `(number | string | boolean)[]` for the array, and at runtime `typeof items[1]` (\"two\") returns `\"string\"`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "inference",
      "arrays"
    ]
  },
  {
    "id": "ts-beg-009",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "literal_types",
    "subtopic": "union_of_literals",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What happens when invoking this function with a matching string literal?",
    "code": "type Theme = \"dark\" | \"light\";\nfunction applyTheme(t: Theme): string {\n  return `theme-${t}`;\n}\nconsole.log(applyTheme(\"dark\"));",
    "options": [
      "\"theme-dark\"",
      "\"theme-light\"",
      "Compile error: Theme is a type not a value",
      "undefined"
    ],
    "correctAnswer": "\"theme-dark\"",
    "acceptedAnswers": [
      "\"theme-dark\""
    ],
    "hint": "Literal union types constrain arguments to a specific closed set of allowed values.",
    "explanation": "The literal string `\"dark\"` satisfies the `Theme` union constraint, returning `\"theme-dark\"`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "literal_types",
      "unions"
    ]
  },
  {
    "id": "ts-beg-010",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "find_bug",
    "topic": "readonly_modifier",
    "subtopic": "immutable_properties",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Which line triggers a compiler error when attempting to mutate a readonly property?",
    "code": "1: interface Config {\n2:   readonly host: string;\n3: }\n4: const cfg: Config = { host: \"localhost\" };\n5: cfg.host = \"127.0.0.1\";",
    "options": [
      "Line 5",
      "Line 4",
      "Line 2",
      "Line 1"
    ],
    "correctAnswer": "Line 5",
    "acceptedAnswers": [
      "Line 5",
      "5"
    ],
    "targetLine": 5,
    "hint": "Properties marked with readonly cannot be assigned outside object initialization.",
    "explanation": "Line 5 attempts to reassign `cfg.host`. The TypeScript compiler throws `Cannot assign to \"host\" because it is a read-only property`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "readonly",
      "interfaces"
    ]
  },
  {
    "id": "ts-beg-011",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "functions",
    "subtopic": "void_return",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is the runtime return value of a TypeScript function with return type `void`?",
    "code": "function logMessage(): void {\n  console.log(\"Logged\");\n}\nconsole.log(logMessage());",
    "options": [
      "Logged followed by undefined",
      "Logged followed by null",
      "Logged followed by void",
      "Compile error: void cannot be printed"
    ],
    "correctAnswer": "Logged followed by undefined",
    "acceptedAnswers": [
      "Logged followed by undefined"
    ],
    "hint": "In compiled JavaScript, functions without an explicit return statement return undefined.",
    "explanation": "In TypeScript, `void` indicates the caller should ignore the return value. In JavaScript execution, the function logs \"Logged\" and implicitly returns `undefined`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "functions",
      "void"
    ]
  },
  {
    "id": "ts-beg-012",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "type_assertions",
    "subtopic": "as_operator",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does this type assertion do at runtime?",
    "code": "const raw: any = \"42\";\nconst num = raw as number;\nconsole.log(typeof num);",
    "options": [
      "\"string\"",
      "\"number\"",
      "42",
      "NaN"
    ],
    "correctAnswer": "\"string\"",
    "acceptedAnswers": [
      "\"string\""
    ],
    "hint": "Type assertions (as T) perform zero runtime casting or conversions.",
    "explanation": "Type assertions only tell the TypeScript compiler how to treat a value during static analysis. At runtime, `raw` is still the string `\"42\"`, so `typeof num` is `\"string\"`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "type_assertions",
      "as_keyword"
    ]
  },
  {
    "id": "ts-beg-013",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "complete_code",
    "topic": "type_aliases",
    "subtopic": "alias_syntax",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Which keyword is used to declare a custom type alias in TypeScript?",
    "code": "___ Coordinate = { x: number; y: number; };\nconst pt: Coordinate = { x: 5, y: 10 };",
    "options": [
      "type",
      "alias",
      "interface",
      "typedef"
    ],
    "correctAnswer": "type",
    "acceptedAnswers": [
      "type"
    ],
    "hint": "Type aliases are declared with the 4-letter keyword `type`.",
    "explanation": "The `type` keyword creates a new name for any type definition, including object literals, unions, and primitives.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "type_alias",
      "syntax"
    ]
  },
  {
    "id": "ts-beg-014",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "non_null_assertion",
    "subtopic": "exclamation_mark_operator",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does the non-null assertion operator `!` tell the TypeScript compiler?",
    "code": "function getName(name: string | null): string {\n  return name!;\n}\nconsole.log(getName(\"Alice\"));",
    "options": [
      "\"Alice\"",
      "null",
      "Compile error: ! is a syntax error here",
      "undefined"
    ],
    "correctAnswer": "\"Alice\"",
    "acceptedAnswers": [
      "\"Alice\""
    ],
    "hint": "Postfix ! asserts that a variable is neither null nor undefined.",
    "explanation": "The postfix `!` operator is the non-null assertion operator. It removes `null` and `undefined` from the type at compile time. At runtime with \"Alice\", it simply returns \"Alice\".",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "non_null",
      "assertions"
    ]
  },
  {
    "id": "ts-beg-015",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "classes",
    "subtopic": "parameter_properties",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by this class using parameter property shorthand?",
    "code": "class Hero {\n  constructor(public name: string, private level: number = 1) {}\n  getLevel() { return this.level; }\n}\nconst h = new Hero(\"Knight\");\nconsole.log(h.name, h.getLevel());",
    "options": [
      "Knight 1",
      "Knight undefined",
      "undefined 1",
      "Compile error: private field accessed"
    ],
    "correctAnswer": "Knight 1",
    "acceptedAnswers": [
      "Knight 1"
    ],
    "hint": "Declaring public or private directly in constructor parameters automatically initializes class fields.",
    "explanation": "TypeScript parameter properties automatically declare and assign class instance properties with matching visibility. Output is `Knight 1`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "classes",
      "parameter_properties"
    ]
  },
  {
    "id": "ts-beg-016",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "interfaces",
    "subtopic": "interface_extension",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by accessing properties on an extended interface?",
    "code": "interface Shape {\n  color: string;\n}\ninterface Circle extends Shape {\n  radius: number;\n}\nconst c: Circle = { color: \"blue\", radius: 5 };\nconsole.log(c.color, c.radius);",
    "options": [
      "blue 5",
      "undefined 5",
      "blue undefined",
      "Compile error: cannot extend interface"
    ],
    "correctAnswer": "blue 5",
    "acceptedAnswers": [
      "blue 5"
    ],
    "hint": "An interface extends another interface inheriting all its properties.",
    "explanation": "The `Circle` interface inherits `color: string` from `Shape` and adds `radius: number`. Both properties are accessible.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "interfaces",
      "inheritance"
    ]
  },
  {
    "id": "ts-beg-017",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "find_bug",
    "topic": "strict_null_checks",
    "subtopic": "null_assignment",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Under strictNullChecks, which line produces a compiler error?",
    "code": "1: let title: string = \"SyntaxArena\";\n2: let subtitle: string | null = null;\n3: title = null;\n4: subtitle = \"Coding Arena\";",
    "options": [
      "Line 3",
      "Line 2",
      "Line 4",
      "Line 1"
    ],
    "correctAnswer": "Line 3",
    "acceptedAnswers": [
      "Line 3",
      "3"
    ],
    "targetLine": 3,
    "hint": "Under strictNullChecks, null and undefined cannot be assigned to string unless explicitly in the union.",
    "explanation": "`title` has type `string`. With strictNullChecks enabled, assigning `null` on Line 3 fails with `Type \"null\" is not assignable to type \"string\"`.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "strictNullChecks",
      "null_safety"
    ]
  },
  {
    "id": "ts-beg-018",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "arrays",
    "subtopic": "readonly_arrays",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is the output of reading from a ReadonlyArray in TypeScript?",
    "code": "const nums: readonly number[] = [1, 2, 3];\nconsole.log(nums.length, nums[0]);",
    "options": [
      "3 1",
      "3 undefined",
      "undefined 1",
      "Compile error"
    ],
    "correctAnswer": "3 1",
    "acceptedAnswers": [
      "3 1"
    ],
    "hint": "ReadonlyArray permits all read operations (length, indexing, map) but forbids mutations (push, pop, splice).",
    "explanation": "Reading properties like `nums.length` (3) and `nums[0]` (1) is completely valid on `readonly number[]`. Mutating operations like `.push()` would be blocked.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "arrays",
      "readonly"
    ]
  },
  {
    "id": "ts-beg-019",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "multiple_choice",
    "topic": "any_vs_unknown",
    "subtopic": "conceptual_difference",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is the primary conceptual difference between `any` and `unknown` in TypeScript?",
    "code": "let a: any = \"hello\";\nlet b: unknown = \"world\";\na.toUpperCase(); // OK\n// b.toUpperCase(); // Error",
    "options": [
      "`unknown` requires type checking before performing operations, while `any` disables all type checking",
      "`any` is faster at runtime than `unknown`",
      "`unknown` can only hold primitive types while `any` holds objects",
      "`any` cannot be assigned to variables of other types"
    ],
    "correctAnswer": "`unknown` requires type checking before performing operations, while `any` disables all type checking",
    "acceptedAnswers": [
      "`unknown` requires type checking before performing operations, while `any` disables all type checking"
    ],
    "hint": "`unknown` is the type-safe counterpart of `any`.",
    "explanation": "`unknown` is a type-safe top type: anything can be assigned to `unknown`, but nothing can be done with an `unknown` value without first asserting or narrowing its type.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "unknown",
      "any",
      "theory"
    ]
  },
  {
    "id": "ts-beg-020",
    "language": "typescript",
    "difficulty": "beginner",
    "type": "predict_output",
    "topic": "const_assertions",
    "subtopic": "literal_widening_prevention",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by accessing an element of an array declared with `as const`?",
    "code": "const colors = [\"red\", \"green\", \"blue\"] as const;\nconsole.log(colors[0], colors.length);",
    "options": [
      "red 3",
      "string 3",
      "red undefined",
      "Compile error"
    ],
    "correctAnswer": "red 3",
    "acceptedAnswers": [
      "red 3"
    ],
    "hint": "`as const` creates a readonly tuple with literal member types.",
    "explanation": "`as const` prevents literal widening, creating a readonly tuple `readonly [\"red\", \"green\", \"blue\"]`. `colors[0]` is `\"red\"` and `colors.length` is 3.",
    "points": 100,
    "estimatedSeconds": 30,
    "tags": [
      "typescript",
      "as_const",
      "tuples"
    ]
  },
  {
    "id": "ts-int-001",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "generics",
    "subtopic": "generic_functions",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does this generic identity function output when invoked with different types?",
    "code": "function wrap<T>(item: T): { value: T } {\n  return { value: item };\n}\nconsole.log(wrap(\"TS\").value, wrap(100).value + 1);",
    "options": [
      "TS 101",
      "TS 1001",
      "undefined NaN",
      "Compile error: Generic type inference failed"
    ],
    "correctAnswer": "TS 101",
    "acceptedAnswers": [
      "TS 101"
    ],
    "hint": "Generic parameter T preserves the exact argument type without casting.",
    "explanation": "`wrap(\"TS\")` infers `T=string`, returning `{ value: \"TS\" }`. `wrap(100)` infers `T=number`, allowing `100 + 1 = 101`. Output is `TS 101`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "generics",
      "inference"
    ]
  },
  {
    "id": "ts-int-002",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "discriminated_unions",
    "subtopic": "tagged_union_pattern",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by pattern matching on this discriminated union?",
    "code": "type Action =\n  | { type: \"add\"; amount: number }\n  | { type: \"reset\" };\nfunction reducer(state: number, action: Action): number {\n  switch (action.type) {\n    case \"add\": return state + action.amount;\n    case \"reset\": return 0;\n  }\n}\nconsole.log(reducer(10, { type: \"add\", amount: 5 }));",
    "options": [
      "15",
      "0",
      "10",
      "NaN"
    ],
    "correctAnswer": "15",
    "acceptedAnswers": [
      "15"
    ],
    "hint": "The common literal property \"type\" allows TypeScript to discriminate the union variant.",
    "explanation": "Inside `case \"add\"`, TypeScript narrows `action` to `{ type: \"add\"; amount: number }`, allowing direct access to `action.amount`. 10 + 5 = 15.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "discriminated_unions",
      "pattern_matching"
    ]
  },
  {
    "id": "ts-int-003",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "complete_code",
    "topic": "type_predicates",
    "subtopic": "custom_type_guards",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Which return type annotation makes `isString` a valid user-defined type guard?",
    "code": "function isString(val: unknown): ___ {\n  return typeof val === \"string\";\n}\nconst item: unknown = \"Arena\";\nif (isString(item)) console.log(item.toUpperCase());",
    "options": [
      "val is string",
      "boolean",
      "string",
      "typeof string"
    ],
    "correctAnswer": "val is string",
    "acceptedAnswers": [
      "val is string"
    ],
    "hint": "Type predicates use the syntax: parameterName is Type.",
    "explanation": "The return type `val is string` is a type predicate. When the function returns true, TypeScript narrows `val` to `string` in calling scopes.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "type_predicates",
      "type_guards"
    ]
  },
  {
    "id": "ts-int-004",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "utility_types",
    "subtopic": "partial_and_required",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does `Partial<T>` do to an interface definition?",
    "code": "interface Config {\n  host: string;\n  port: number;\n}\ntype OptionalConfig = Partial<Config>;\nconst c: OptionalConfig = { host: \"127.0.0.1\" };\nconsole.log(c.host, c.port ?? 8080);",
    "options": [
      "127.0.0.1 8080",
      "127.0.0.1 undefined",
      "Compile error: port is missing",
      "127.0.0.1 null"
    ],
    "correctAnswer": "127.0.0.1 8080",
    "acceptedAnswers": [
      "127.0.0.1 8080"
    ],
    "hint": "Partial<T> turns all properties of T into optional properties.",
    "explanation": "`Partial<Config>` makes both `host` and `port` optional (`host?: string; port?: number;`). Omitting `port` leaves it undefined, resolving to 8080 via `??`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "utility_types",
      "partial"
    ]
  },
  {
    "id": "ts-int-005",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "utility_types",
    "subtopic": "pick_and_omit",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What properties are retained in `Omit<Person, \"password\">`?",
    "code": "interface Person {\n  id: number;\n  name: string;\n  password: string;\n}\ntype PublicPerson = Omit<Person, \"password\">;\nconst p: PublicPerson = { id: 1, name: \"Bob\" };\nconsole.log(Object.keys(p).join(\",\"));",
    "options": [
      "id,name",
      "id,name,password",
      "password",
      "Compile error"
    ],
    "correctAnswer": "id,name",
    "acceptedAnswers": [
      "id,name"
    ],
    "hint": "Omit<T, K> constructs a type by removing keys K from T.",
    "explanation": "`Omit<Person, \"password\">` constructs a type with only `id` and `name`. Object.keys produces `\"id,name\"`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "utility_types",
      "omit"
    ]
  },
  {
    "id": "ts-int-006",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "keyof_operator",
    "subtopic": "keyof_and_indexed_access",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by this generic property getter using `keyof` and indexed access?",
    "code": "function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\nconst user = { name: \"Carol\", score: 95 };\nconsole.log(getProp(user, \"score\") + 5);",
    "options": [
      "100",
      "955",
      "NaN",
      "Compile error: K cannot index T"
    ],
    "correctAnswer": "100",
    "acceptedAnswers": [
      "100"
    ],
    "hint": "K extends keyof T guarantees key is a valid property on T, returning the exact type T[K].",
    "explanation": "`K extends keyof T` ensures `\"score\"` is a key of `user`. The return type is `number` (`user.score`), so 95 + 5 = 100.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "keyof",
      "generics"
    ]
  },
  {
    "id": "ts-int-007",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "utility_types",
    "subtopic": "record_type",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by indexing into this `Record<string, number>` map?",
    "code": "type ScoreTable = Record<\"Alice\" | \"Bob\", number>;\nconst scores: ScoreTable = {\n  Alice: 100,\n  Bob: 85\n};\nconsole.log(scores.Alice + scores.Bob);",
    "options": [
      "185",
      "10085",
      "NaN",
      "Compile error"
    ],
    "correctAnswer": "185",
    "acceptedAnswers": [
      "185"
    ],
    "hint": "Record<K, T> constructs an object type whose keys are K and values are T.",
    "explanation": "`Record<\"Alice\" | \"Bob\", number>` requires keys \"Alice\" and \"Bob\" with number values. 100 + 85 = 185.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "utility_types",
      "record"
    ]
  },
  {
    "id": "ts-int-008",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "find_bug",
    "topic": "generic_constraints",
    "subtopic": "extends_keyword",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Which line causes a compiler error when passing an invalid argument to the generic constraint?",
    "code": "1: function logLength<T extends { length: number }>(arg: T): number {\n2:   return arg.length;\n3: }\n4: logLength(\"hello\");\n5: logLength([1, 2, 3]);\n6: logLength(42);",
    "options": [
      "Line 6",
      "Line 5",
      "Line 4",
      "Line 1"
    ],
    "correctAnswer": "Line 6",
    "acceptedAnswers": [
      "Line 6",
      "6"
    ],
    "targetLine": 6,
    "hint": "Numbers in JavaScript do not have a .length property.",
    "explanation": "Line 6 passes the number `42`. Numbers do not satisfy `{ length: number }`, causing compiler error `Argument of type \"number\" is not assignable to parameter of type \"{ length: number; }\"`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "generics",
      "constraints"
    ]
  },
  {
    "id": "ts-int-009",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "intersection_types",
    "subtopic": "combining_interfaces",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does this intersection type produce?",
    "code": "type Name = { name: string };\ntype Age = { age: number };\ntype Person = Name & Age;\nconst p: Person = { name: \"Dan\", age: 30 };\nconsole.log(`${p.name} is ${p.age}`);",
    "options": [
      "Dan is 30",
      "Dan is undefined",
      "undefined is 30",
      "Compile error"
    ],
    "correctAnswer": "Dan is 30",
    "acceptedAnswers": [
      "Dan is 30"
    ],
    "hint": "Intersection types (&) merge the requirements of both types into one.",
    "explanation": "`Name & Age` requires both `name` and `age`. The object `{ name: \"Dan\", age: 30 }` satisfies both, printing `Dan is 30`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "intersections",
      "types"
    ]
  },
  {
    "id": "ts-int-010",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "declaration_merging",
    "subtopic": "interface_merging",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What happens when two interfaces with the same name are declared in the same scope?",
    "code": "interface Box {\n  height: number;\n}\ninterface Box {\n  width: number;\n}\nconst b: Box = { height: 10, width: 20 };\nconsole.log(b.height * b.width);",
    "options": [
      "200",
      "Compile error: Duplicate identifier \"Box\"",
      "NaN",
      "undefined"
    ],
    "correctAnswer": "200",
    "acceptedAnswers": [
      "200"
    ],
    "hint": "TypeScript automatically merges multiple interface declarations with the same name.",
    "explanation": "Interface declaration merging combines both declarations into a single `Box` interface requiring both `height` and `width`. 10 * 20 = 200.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "declaration_merging",
      "interfaces"
    ]
  },
  {
    "id": "ts-int-011",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "exhaustiveness_checking",
    "subtopic": "never_type_assertion",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What role does `never` play in this exhaustive switch statement?",
    "code": "type Status = \"ready\" | \"done\";\nfunction check(s: Status) {\n  switch (s) {\n    case \"ready\": return 1;\n    case \"done\": return 2;\n    default:\n      const _exhaustive: never = s;\n      return _exhaustive;\n  }\n}\nconsole.log(check(\"ready\") + check(\"done\"));",
    "options": [
      "3",
      "NaN",
      "undefined",
      "Compile error: s is not never"
    ],
    "correctAnswer": "3",
    "acceptedAnswers": [
      "3"
    ],
    "hint": "If all cases are handled, the default branch is unreachable and s has type never.",
    "explanation": "Since both `\"ready\"` and `\"done\"` are handled, TypeScript verifies that `s` has type `never` in the default case. At runtime, 1 + 2 = 3.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "never",
      "exhaustive_check"
    ]
  },
  {
    "id": "ts-int-012",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "satisfies_operator",
    "subtopic": "satisfies_vs_annotation",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "How does the `satisfies` operator differ from an explicit type annotation here?",
    "code": "type Palette = Record<string, string | number[]>;\nconst p = {\n  primary: \"#ff0000\",\n  accent: [255, 0, 0]\n} satisfies Palette;\nconsole.log(p.primary.toUpperCase());",
    "options": [
      "#FF0000",
      "Compile error: Property toUpperCase does not exist on string | number[]",
      "undefined",
      "null"
    ],
    "correctAnswer": "#FF0000",
    "acceptedAnswers": [
      "#FF0000"
    ],
    "hint": "satisfies validates against a type contract without widening property types.",
    "explanation": "Unlike a type annotation (`const p: Palette = ...`) which widens `primary` to `string | number[]`, `satisfies` preserves the literal inferred type `string` for `primary`, allowing `.toUpperCase()`. Output is `#FF0000`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "satisfies",
      "type_widening"
    ]
  },
  {
    "id": "ts-int-013",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "utility_types",
    "subtopic": "exclude_and_extract",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What type does `Exclude<T, U>` evaluate to here?",
    "code": "type Primitive = string | number | boolean;\ntype NonString = Exclude<Primitive, string>;\nconst val: NonString = 42;\nconsole.log(typeof val);",
    "options": [
      "\"number\"",
      "\"string\"",
      "\"boolean\"",
      "Compile error"
    ],
    "correctAnswer": "\"number\"",
    "acceptedAnswers": [
      "\"number\""
    ],
    "hint": "Exclude<T, U> removes from T all union members assignable to U.",
    "explanation": "`Exclude<string | number | boolean, string>` yields `number | boolean`. Assigning 42 makes `typeof val` evaluate to `\"number\"`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "utility_types",
      "exclude"
    ]
  },
  {
    "id": "ts-int-014",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "typeof_operator",
    "subtopic": "type_query_on_values",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by using TypeScript type query `typeof` on an existing object?",
    "code": "const config = { maxRetries: 3, debug: true };\ntype AppConfig = typeof config;\nconst userCfg: AppConfig = { maxRetries: 5, debug: false };\nconsole.log(userCfg.maxRetries, userCfg.debug);",
    "options": [
      "5 false",
      "3 true",
      "undefined undefined",
      "Compile error"
    ],
    "correctAnswer": "5 false",
    "acceptedAnswers": [
      "5 false"
    ],
    "hint": "In type position, typeof queries the compile-time type of a JavaScript value.",
    "explanation": "In type position, `typeof config` produces `{ maxRetries: number; debug: boolean }`. `userCfg` satisfies this type and outputs `5 false`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "typeof",
      "type_query"
    ]
  },
  {
    "id": "ts-int-015",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "find_bug",
    "topic": "const_assertions",
    "subtopic": "deep_readonly",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Which line causes a compiler error due to deep readonly const assertion?",
    "code": "1: const settings = {\n2:   endpoint: \"/api/v1\",\n3:   retries: 3\n4: } as const;\n5: settings.retries = 5;",
    "options": [
      "Line 5",
      "Line 4",
      "Line 3",
      "Line 1"
    ],
    "correctAnswer": "Line 5",
    "acceptedAnswers": [
      "Line 5",
      "5"
    ],
    "targetLine": 5,
    "hint": "`as const` makes all nested properties readonly.",
    "explanation": "`as const` marks all properties as readonly with literal types. Attempting to assign `settings.retries = 5` fails on Line 5 with `Cannot assign to \"retries\" because it is a read-only property`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "as_const",
      "immutability"
    ]
  },
  {
    "id": "ts-int-016",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "in_operator",
    "subtopic": "property_narrowing",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does property existence check via the `in` operator narrow here?",
    "code": "type Dog = { bark: () => string };\ntype Cat = { meow: () => string };\nfunction speak(pet: Dog | Cat): string {\n  if (\"bark\" in pet) return pet.bark();\n  return pet.meow();\n}\nconst dog: Dog = { bark: () => \"Woof!\" };\nconsole.log(speak(dog));",
    "options": [
      "\"Woof!\"",
      "undefined",
      "Compile error: \"bark\" is not a valid property of Cat",
      "null"
    ],
    "correctAnswer": "\"Woof!\"",
    "acceptedAnswers": [
      "\"Woof!\""
    ],
    "hint": "The \"in\" operator acts as a type guard for discriminating objects by property existence.",
    "explanation": "`\"bark\" in pet` narrows `pet` to `Dog` inside the if branch, safely calling `.bark()`. Output is `\"Woof!\"`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "in_operator",
      "type_guards"
    ]
  },
  {
    "id": "ts-int-017",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "index_signatures",
    "subtopic": "dynamic_keys",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does this index signature allow?",
    "code": "interface StringMap {\n  [key: string]: number;\n  count: number;\n}\nconst map: StringMap = { count: 10, bonus: 5 };\nconsole.log(map.count + map[\"bonus\"]);",
    "options": [
      "15",
      "NaN",
      "105",
      "Compile error: bonus not declared"
    ],
    "correctAnswer": "15",
    "acceptedAnswers": [
      "15"
    ],
    "hint": "An index signature `[key: string]: number` allows arbitrary string keys with number values.",
    "explanation": "`[key: string]: number` permits any string property that has a number value. Both `map.count` (10) and `map[\"bonus\"]` (5) are numbers. 10 + 5 = 15.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "index_signatures",
      "objects"
    ]
  },
  {
    "id": "ts-int-018",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "abstract_classes",
    "subtopic": "abstract_methods",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by calling a concrete implementation of an abstract class?",
    "code": "abstract class Worker {\n  abstract work(): string;\n  start() { return `Starting: ${this.work()}`; }\n}\nclass Coder extends Worker {\n  work() { return \"Compiling TS\"; }\n}\nconsole.log(new Coder().start());",
    "options": [
      "Starting: Compiling TS",
      "Starting: undefined",
      "Compile error: Cannot instantiate abstract class",
      "null"
    ],
    "correctAnswer": "Starting: Compiling TS",
    "acceptedAnswers": [
      "Starting: Compiling TS"
    ],
    "hint": "Derived classes must implement all abstract methods before instantiation.",
    "explanation": "`Coder` implements `work()`. Calling `.start()` on `new Coder()` prints `Starting: Compiling TS`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "abstract_classes",
      "oop"
    ]
  },
  {
    "id": "ts-int-019",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "multiple_choice",
    "topic": "interface_vs_type",
    "subtopic": "when_to_use_which",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Which feature is exclusive to `interface` that `type` aliases cannot perform?",
    "code": "// Example A\ninterface Window { customProp: string; }\n// Example B\ntype Window = { customProp: string; }; // Error: Duplicate identifier",
    "options": [
      "Declaration merging (augmenting existing definitions across files)",
      "Union types (|)",
      "Tuple representations",
      "Primitive alias definitions"
    ],
    "correctAnswer": "Declaration merging (augmenting existing definitions across files)",
    "acceptedAnswers": [
      "Declaration merging (augmenting existing definitions across files)"
    ],
    "hint": "Interfaces can be reopened and augmented, which is critical for extending third-party library types.",
    "explanation": "Only `interface` supports declaration merging, allowing developers to extend window, global, or library types by declaring the interface multiple times.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "interface",
      "type",
      "theory"
    ]
  },
  {
    "id": "ts-int-020",
    "language": "typescript",
    "difficulty": "intermediate",
    "type": "predict_output",
    "topic": "function_overloads",
    "subtopic": "overload_signatures",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by invoking this overloaded function with different argument types?",
    "code": "function combine(a: number, b: number): number;\nfunction combine(a: string, b: string): string;\nfunction combine(a: any, b: any): any {\n  return a + b;\n}\nconsole.log(combine(10, 20), combine(\"A\", \"B\"));",
    "options": [
      "30 AB",
      "30 undefined",
      "1020 AB",
      "Compile error"
    ],
    "correctAnswer": "30 AB",
    "acceptedAnswers": [
      "30 AB"
    ],
    "hint": "The implementation signature is hidden from callers; only the overload signatures are visible.",
    "explanation": "TypeScript selects the number overload for `(10, 20)` yielding 30, and the string overload for `(\"A\", \"B\")` yielding `\"AB\"`. Output is `30 AB`.",
    "points": 200,
    "estimatedSeconds": 35,
    "tags": [
      "typescript",
      "function_overloads",
      "signatures"
    ]
  },
  {
    "id": "ts-exp-001",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "conditional_types",
    "subtopic": "basic_conditional",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does this conditional type evaluate to when checking if T is an array?",
    "code": "type IsArray<T> = T extends any[] ? \"yes\" : \"no\";\ntype A = IsArray<string[]>;\ntype B = IsArray<number>;\nconst res: `${A}-${B}` = \"yes-no\";\nconsole.log(res);",
    "options": [
      "yes-no",
      "yes-yes",
      "no-no",
      "Compile error"
    ],
    "correctAnswer": "yes-no",
    "acceptedAnswers": [
      "yes-no"
    ],
    "hint": "Conditional types take the form `T extends U ? X : Y`.",
    "explanation": "`string[] extends any[]` is true (`\"yes\"`). `number extends any[]` is false (`\"no\"`). The template literal type is `\"yes-no\"`.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "conditional_types",
      "advanced"
    ]
  },
  {
    "id": "ts-exp-002",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "infer_keyword",
    "subtopic": "element_type_extraction",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What type does the `infer` keyword extract from the array type?",
    "code": "type ElementOf<T> = T extends (infer E)[] ? E : never;\ntype Num = ElementOf<number[]>;\nconst val: Num = 42;\nconsole.log(typeof val);",
    "options": [
      "\"number\"",
      "\"object\"",
      "never",
      "Compile error"
    ],
    "correctAnswer": "\"number\"",
    "acceptedAnswers": [
      "\"number\""
    ],
    "hint": "`infer E` introduces a type variable to be deduced by the compiler within conditional types.",
    "explanation": "`T extends (infer E)[]` pattern matches `number[]`, deducing `E = number`. `val` is typed as `number`, so `typeof val` is `\"number\"`.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "infer",
      "conditional_types"
    ]
  },
  {
    "id": "ts-exp-003",
    "language": "typescript",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "distributive_conditionals",
    "subtopic": "union_distribution",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What happens when a naked type parameter in a conditional type receives a union type?",
    "code": "type ToArray<T> = T extends any ? T[] : never;\ntype Result = ToArray<string | number>;",
    "options": [
      "It distributes across the union, producing string[] | number[]",
      "It produces (string | number)[]",
      "It evaluates to never",
      "It throws a compile-time circular reference error"
    ],
    "correctAnswer": "It distributes across the union, producing string[] | number[]",
    "acceptedAnswers": [
      "It distributes across the union, producing string[] | number[]"
    ],
    "hint": "Distributive conditional types distribute over union members automatically unless wrapped in a tuple `[T]`.",
    "explanation": "When conditional types act on a naked type parameter, they distribute over union types: `ToArray<string | number>` expands to `ToArray<string> | ToArray<number>` = `string[] | number[]`.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "distributive_conditionals",
      "unions"
    ]
  },
  {
    "id": "ts-exp-004",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "distributive_conditionals",
    "subtopic": "preventing_distribution",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "How does wrapping the type parameter in tuple brackets `[T]` affect conditional evaluation?",
    "code": "type NonDistributive<T> = [T] extends [string | number] ? \"union-match\" : \"other\";\ntype Res = NonDistributive<string | number>;\nconst msg: Res = \"union-match\";\nconsole.log(msg);",
    "options": [
      "union-match",
      "other",
      "Compile error",
      "undefined"
    ],
    "correctAnswer": "union-match",
    "acceptedAnswers": [
      "union-match"
    ],
    "hint": "Surrounding T with square brackets `[T]` disables union distribution.",
    "explanation": "Wrapping `[T]` prevents distribution. `[string | number]` extends `[string | number]` directly, evaluating to `\"union-match\"`.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "conditional_types",
      "distribution"
    ]
  },
  {
    "id": "ts-exp-005",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "mapped_types",
    "subtopic": "key_remapping_as",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is the output of this mapped type using key remapping with `as` and template literals?",
    "code": "interface Events {\n  click: number;\n  hover: string;\n}\ntype Getters<T> = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];\n};\ntype EventGetters = Getters<Events>;\nconst handlers: EventGetters = {\n  getClick: () => 42,\n  getHover: () => \"active\"\n};\nconsole.log(handlers.getClick(), handlers.getHover());",
    "options": [
      "42 active",
      "click hover",
      "undefined undefined",
      "Compile error: Capitalize not valid"
    ],
    "correctAnswer": "42 active",
    "acceptedAnswers": [
      "42 active"
    ],
    "hint": "Key remapping `as` transforms original property names into custom template strings.",
    "explanation": "Key remapping transforms `\"click\"` -> `\"getClick\"` and `\"hover\"` -> `\"getHover\"`, returning the respective property types. Output is `42 active`.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "mapped_types",
      "key_remapping"
    ]
  },
  {
    "id": "ts-exp-006",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "mapped_types",
    "subtopic": "modifier_removal",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does the `-readonly` and `-?` modifier syntax do in mapped types?",
    "code": "interface Locked {\n  readonly title?: string;\n}\ntype Unlocked<T> = {\n  -readonly [K in keyof T]-?: T[K];\n};\ntype Plain = Unlocked<Locked>;\nconst item: Plain = { title: \"Unlocked\" };\nitem.title = \"Mutable\";\nconsole.log(item.title);",
    "options": [
      "Mutable",
      "Unlocked",
      "Compile error: Cannot assign to readonly property",
      "undefined"
    ],
    "correctAnswer": "Mutable",
    "acceptedAnswers": [
      "Mutable"
    ],
    "hint": "Prefixing modifiers with minus (-readonly, -?) strips them from the resulting type.",
    "explanation": "`-readonly` strips immutability and `-?` strips optionality, making `title` a required, mutable `string`. `item.title = \"Mutable\"` succeeds.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "mapped_types",
      "modifiers"
    ]
  },
  {
    "id": "ts-exp-007",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "template_literal_types",
    "subtopic": "string_combinations",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "How many total string combinations are generated by this template literal product?",
    "code": "type Dim = \"x\" | \"y\";\ntype Dir = \"pos\" | \"neg\";\ntype Axis = `${Dim}_${Dir}`;\nconst axes: Axis[] = [\"x_pos\", \"x_neg\", \"y_pos\", \"y_neg\"];\nconsole.log(axes.length);",
    "options": [
      "4",
      "2",
      "8",
      "Compile error"
    ],
    "correctAnswer": "4",
    "acceptedAnswers": [
      "4"
    ],
    "hint": "Template literal types produce the cartesian product of union members.",
    "explanation": "Template literal unions compute the full cartesian product: 2 dimensions × 2 directions = 4 union members: `\"x_pos\" | \"x_neg\" | \"y_pos\" | \"y_neg\"`. Output is 4.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "template_literals",
      "cartesian_product"
    ]
  },
  {
    "id": "ts-exp-008",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "utility_types",
    "subtopic": "return_type_and_parameters",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What types are extracted by `Parameters<T>` and `ReturnType<T>`?",
    "code": "function add(a: number, b: number): number {\n  return a + b;\n}\ntype AddParams = Parameters<typeof add>;\ntype AddReturn = ReturnType<typeof add>;\nconst args: AddParams = [10, 20];\nconst sum: AddReturn = add(...args);\nconsole.log(sum);",
    "options": [
      "30",
      "1020",
      "undefined",
      "Compile error"
    ],
    "correctAnswer": "30",
    "acceptedAnswers": [
      "30"
    ],
    "hint": "Parameters<F> extracts a tuple of function parameters, and ReturnType<F> extracts the return type.",
    "explanation": "`Parameters<typeof add>` extracts `[number, number]`. `ReturnType<typeof add>` is `number`. `add(10, 20)` evaluates to 30.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "utility_types",
      "parameters",
      "return_type"
    ]
  },
  {
    "id": "ts-exp-009",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "utility_types",
    "subtopic": "awaited_unwrapping",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does `Awaited<T>` produce when given nested Promise types?",
    "code": "type NestedPromise = Promise<Promise<string>>;\ntype Unwrapped = Awaited<NestedPromise>;\nconst str: Unwrapped = \"Resolved!\";\nconsole.log(str);",
    "options": [
      "Resolved!",
      "Promise<string>",
      "[object Promise]",
      "Compile error"
    ],
    "correctAnswer": "Resolved!",
    "acceptedAnswers": [
      "Resolved!"
    ],
    "hint": "Awaited<T> recursively unwraps nested Promise types.",
    "explanation": "`Awaited<T>` models `await` operations recursively unwrapping `Promise<Promise<string>>` down to the innermost resolved value `string`.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "awaited",
      "promises"
    ]
  },
  {
    "id": "ts-exp-010",
    "language": "typescript",
    "difficulty": "expert",
    "type": "find_bug",
    "topic": "function_variance",
    "subtopic": "strict_function_types",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Under --strictFunctionTypes, which line produces a contravariance error when assigning function callbacks?",
    "code": "1: class Animal { name = \"animal\"; }\n2: class Dog extends Animal { bark = () => \"woof\"; }\n3: let handleAnimal: (a: Animal) => void = (a) => console.log(a.name);\n4: let handleDog: (d: Dog) => void = (d) => console.log(d.bark());\n5: handleDog = handleAnimal; // OK\n6: handleAnimal = handleDog; // Error?",
    "options": [
      "Line 6",
      "Line 5",
      "Line 4",
      "Line 3"
    ],
    "correctAnswer": "Line 6",
    "acceptedAnswers": [
      "Line 6",
      "6"
    ],
    "targetLine": 6,
    "hint": "Function parameters are contravariant: a handler for Dog cannot be assigned to an Animal handler.",
    "explanation": "Line 6 triggers error: `handleDog` expects a `Dog` with `.bark()`. If assigned to `handleAnimal`, an arbitrary `Animal` (like a Cat) could be passed, crashing at runtime. Function parameters are contravariant.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "contravariance",
      "strictFunctionTypes"
    ]
  },
  {
    "id": "ts-exp-011",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "branded_types",
    "subtopic": "nominal_typing_pattern",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What pattern is used to simulate nominal types in TypeScript's structural type system?",
    "code": "type USD = number & { readonly __brand: unique symbol };\ntype EUR = number & { readonly __brand: unique symbol };\nfunction makeUSD(n: number) { return n as USD; }\nconst wallet = makeUSD(50);\nconsole.log(typeof wallet, wallet + 10);",
    "options": [
      "number 60",
      "USD 60",
      "object 5010",
      "Compile error"
    ],
    "correctAnswer": "number 60",
    "acceptedAnswers": [
      "number 60"
    ],
    "hint": "Branded types attach an unconstructable property to enforce compile-time safety on identical underlying primitives.",
    "explanation": "Branded types are pure compile-time constructs. At runtime, `wallet` is a standard JavaScript number (50). `typeof wallet` is `\"number\"` and 50 + 10 = 60.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "branded_types",
      "nominal_typing"
    ]
  },
  {
    "id": "ts-exp-012",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "indexed_access",
    "subtopic": "union_of_values",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What type does `T[keyof T]` produce for this interface?",
    "code": "interface StatusMap {\n  online: 1;\n  offline: 0;\n}\ntype Values = StatusMap[keyof StatusMap];\nconst v: Values = 1;\nconsole.log(v);",
    "options": [
      "1",
      "0",
      "1 | 0",
      "Compile error"
    ],
    "correctAnswer": "1",
    "acceptedAnswers": [
      "1"
    ],
    "hint": "Indexing an object type with `keyof T` produces the union of all its property value types.",
    "explanation": "`keyof StatusMap` is `\"online\" | \"offline\"`. Indexing `StatusMap[\"online\" | \"offline\"]` yields the union of values: `1 | 0`. Assigning 1 outputs `1`.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "indexed_access",
      "keyof"
    ]
  },
  {
    "id": "ts-exp-013",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "tuple_spreads",
    "subtopic": "rest_elements_in_tuples",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by spreading rest elements into a TypeScript tuple?",
    "code": "type StringFirstThenNumbers = [string, ...number[]];\nconst tuple: StringFirstThenNumbers = [\"ID\", 101, 102, 103];\nconsole.log(tuple[0], tuple.slice(1).reduce((a, b) => a + b, 0));",
    "options": [
      "ID 306",
      "ID 101",
      "undefined 0",
      "Compile error"
    ],
    "correctAnswer": "ID 306",
    "acceptedAnswers": [
      "ID 306"
    ],
    "hint": "Tuple rest elements allow typed variable-length sub-sequences.",
    "explanation": "`tuple[0]` is `\"ID\"`. `tuple.slice(1)` is `[101, 102, 103]`. Summing them gives 306. Output is `ID 306`.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "tuples",
      "rest_elements"
    ]
  },
  {
    "id": "ts-exp-014",
    "language": "typescript",
    "difficulty": "expert",
    "type": "complete_code",
    "topic": "override_keyword",
    "subtopic": "inheritance_safety",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Which TypeScript keyword ensures a subclass method explicitly overrides a superclass method?",
    "code": "class Base {\n  render(): string { return \"base\"; }\n}\nclass Sub extends Base {\n  ___ render(): string { return \"sub\"; }\n}",
    "options": [
      "override",
      "overwrite",
      "overload",
      "virtual"
    ],
    "correctAnswer": "override",
    "acceptedAnswers": [
      "override"
    ],
    "hint": "The keyword was introduced in TS 4.3 with the `--noImplicitOverride` compiler flag.",
    "explanation": "The `override` keyword guarantees that a method with the same name exists in the base class, preventing subtle bugs if the base class method is renamed.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "classes",
      "override"
    ]
  },
  {
    "id": "ts-exp-015",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "recursive_types",
    "subtopic": "deep_readonly",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What happens when evaluating nested properties on this recursive type?",
    "code": "type Nested<T> = { val: T; next?: Nested<T> };\nconst chain: Nested<number> = { val: 1, next: { val: 2 } };\nconsole.log(chain.val + (chain.next?.val ?? 0));",
    "options": [
      "3",
      "1",
      "NaN",
      "Compile error: Recursive type definition circular"
    ],
    "correctAnswer": "3",
    "acceptedAnswers": [
      "3"
    ],
    "hint": "TypeScript supports recursive type references in object properties.",
    "explanation": "TypeScript handles recursive types cleanly. `chain.val` (1) + `chain.next.val` (2) = 3.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "recursive_types",
      "generics"
    ]
  },
  {
    "id": "ts-exp-016",
    "language": "typescript",
    "difficulty": "expert",
    "type": "multiple_choice",
    "topic": "type_widening",
    "subtopic": "literal_widening_rules",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "Why does `let x = \"hello\"` have type `string`, while `const x = \"hello\"` has type `\"hello\"`?",
    "code": "let a = \"hello\";   // type string\nconst b = \"hello\"; // type \"hello\"",
    "options": [
      "let variables can be reassigned to any string, while const variables are immutable bindings",
      "const variables are allocated in read-only memory",
      "let variables are typed as any by default",
      "The compiler cannot infer types for let variables"
    ],
    "correctAnswer": "let variables can be reassigned to any string, while const variables are immutable bindings",
    "acceptedAnswers": [
      "let variables can be reassigned to any string, while const variables are immutable bindings"
    ],
    "hint": "Consider whether the variable reference can be changed after assignment.",
    "explanation": "Because `let` variables can be mutated later, TypeScript widens literal types to their broader primitive type (`string`). Because `const` cannot be reassigned, the literal type `\"hello\"` is preserved.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "literal_widening",
      "type_inference"
    ]
  },
  {
    "id": "ts-exp-017",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "this_parameter",
    "subtopic": "explicit_this_typing",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What happens to the fake `this` parameter in TypeScript function signatures at runtime?",
    "code": "function show(this: { id: number }) {\n  return this.id;\n}\nconst obj = { id: 77, show };\nconsole.log(obj.show());",
    "options": [
      "77",
      "undefined",
      "Compile error: this is a reserved keyword",
      "NaN"
    ],
    "correctAnswer": "77",
    "acceptedAnswers": [
      "77"
    ],
    "hint": "The first parameter named `this` is completely erased during compilation into JavaScript.",
    "explanation": "TypeScript uses a leading fake `this` parameter to declare the expected `this` context for static analysis. It is erased from JavaScript output, so `obj.show()` correctly returns 77.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "this_parameter",
      "functions"
    ]
  },
  {
    "id": "ts-exp-018",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "conditional_types",
    "subtopic": "tuple_flattening",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What does this conditional type unwrap?",
    "code": "type Flatten<T> = T extends (infer Item)[] ? Item : T;\ntype A = Flatten<string[]>;\ntype B = Flatten<number>;\nconst valA: A = \"hello\";\nconst valB: B = 10;\nconsole.log(typeof valA, typeof valB);",
    "options": [
      "string number",
      "object number",
      "string string",
      "Compile error"
    ],
    "correctAnswer": "string number",
    "acceptedAnswers": [
      "string number"
    ],
    "hint": "If T is an array, it extracts the element type; otherwise, it leaves T unchanged.",
    "explanation": "`Flatten<string[]>` extracts `string`. `Flatten<number>` returns `number` directly. Output is `string number`.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "infer",
      "conditional_types"
    ]
  },
  {
    "id": "ts-exp-019",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "intrinsic_string_manipulation",
    "subtopic": "uppercase_lowercase",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What is printed by this intrinsic string manipulation utility?",
    "code": "type Action = \"start\" | \"stop\";\ntype ActionEvent = `on_${Uppercase<Action>}`;\nconst e: ActionEvent = \"on_START\";\nconsole.log(e);",
    "options": [
      "on_START",
      "on_start",
      "ON_START",
      "Compile error"
    ],
    "correctAnswer": "on_START",
    "acceptedAnswers": [
      "on_START"
    ],
    "hint": "Uppercase<T> transforms string literal types to uppercase within the compiler.",
    "explanation": "`Uppercase<\"start\" | \"stop\">` produces `\"START\" | \"STOP\"`. The template literal yields `\"on_START\" | \"on_STOP\"`. Output is `on_START`.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "template_literals",
      "intrinsic"
    ]
  },
  {
    "id": "ts-exp-020",
    "language": "typescript",
    "difficulty": "expert",
    "type": "predict_output",
    "topic": "const_type_parameters",
    "subtopic": "ts_5_const_generics",
    "standardVersion": "TypeScript 5.4+",
    "prompt": "What inferred type does TypeScript 5.0+ `const` generic parameter assign to the return value?",
    "code": "function asTuple<const T extends readonly unknown[]>(arr: T): T {\n  return arr;\n}\nconst t = asTuple([\"a\", 1]);\nconsole.log(t[0], t[1]);",
    "options": [
      "a 1",
      "string number",
      "undefined undefined",
      "Compile error"
    ],
    "correctAnswer": "a 1",
    "acceptedAnswers": [
      "a 1"
    ],
    "hint": "<const T> enforces literal const inference on arguments without requiring `as const` at call sites.",
    "explanation": "In TypeScript 5.0+, `<const T>` automatically infers literal readonly tuple types (`readonly [\"a\", 1]`). Output is `a 1`.",
    "points": 300,
    "estimatedSeconds": 40,
    "tags": [
      "typescript",
      "const_generics",
      "ts5"
    ]
  }
];
