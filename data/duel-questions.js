/**
 * SyntaxArena — 1v1 SyntaxDuel Dedicated Question Deck
 * Exclusive competitive head-to-head questions not found in standard tracks.
 * High-speed trivia, edge-case evaluation, rapid syntax traps, and concurrency.
 */

export const DUEL_QUESTIONS = [
  {
    id: 'duel_py_01',
    language: 'python',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What will be output by this rapid slice and comprehension?',
    codeSnippet: 'nums = [1, 2, 3, 4, 5]\nprint([x * 2 for x in nums[::-2]])',
    options: ['[10, 6, 2]', '[2, 6, 10]', '[10, 8, 6]', '[8, 4]'],
    correctAnswer: '[10, 6, 2]',
    explanation: 'nums[::-2] traverses the list backwards by step 2, producing [5, 3, 1]. Doubling each yields [10, 6, 2].'
  },
  {
    id: 'duel_py_02',
    language: 'python',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What is the boolean evaluation of this chained comparison in Python?',
    codeSnippet: 'print(False == False in [False])',
    options: ['True', 'False', 'TypeError', 'SyntaxError'],
    correctAnswer: 'True',
    explanation: 'Python chains comparisons: `False == False and False in [False]`. Both sub-expressions evaluate to True, so result is True.'
  },
  {
    id: 'duel_py_03',
    language: 'python',
    difficulty: 'beginner',
    type: 'multiple_choice',
    prompt: 'What does this dict merge expression evaluate to in Python 3.9+?',
    codeSnippet: 'a = {"x": 1, "y": 2}\nb = {"y": 99, "z": 3}\nprint(a | b)',
    options: [
      "{'x': 1, 'y': 99, 'z': 3}",
      "{'x': 1, 'y': 2, 'z': 3}",
      "TypeError: unsupported operand",
      "{'y': 99}"
    ],
    correctAnswer: "{'x': 1, 'y': 99, 'z': 3}",
    explanation: 'The dictionary union operator `|` takes keys from both dicts, with values from the right operand overriding keys on the left.'
  },
  {
    id: 'duel_js_01',
    language: 'javascript',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What will be logged by this async closure race?',
    codeSnippet: 'const arr = [1, 2, 3];\nfor (var i = 0; i < arr.length; i++) {\n  setTimeout(() => console.log(i), 0);\n}',
    options: ['3 3 3', '0 1 2', '1 2 3', 'undefined undefined undefined'],
    correctAnswer: '3 3 3',
    explanation: 'Because `var` is function-scoped (not block-scoped), all three timeout callbacks capture the exact same variable `i`, which equals 3 when the event loop fires.'
  },
  {
    id: 'duel_js_02',
    language: 'javascript',
    difficulty: 'beginner',
    type: 'multiple_choice',
    prompt: 'What does the JavaScript nullish coalescing operator return here?',
    codeSnippet: 'const val = 0 ?? 42;\nconst alt = "" || "fallback";\nconsole.log(val, alt);',
    options: [
      '0 fallback',
      '42 fallback',
      '0 ""',
      '42 ""'
    ],
    correctAnswer: '0 fallback',
    explanation: '`??` only falls back on `null` or `undefined`. Since 0 is defined, `val` is 0. `||` falls back on any falsy value, so `""` yields "fallback".'
  },
  {
    id: 'duel_ts_01',
    language: 'typescript',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What is the inferred type of Result in this TypeScript conditional type?',
    codeSnippet: 'type Unbox<T> = T extends Array<infer U> ? U : T;\ntype Result = Unbox<string[]>;',
    options: ['string', 'string[]', 'Array<string>', 'any'],
    correctAnswer: 'string',
    explanation: 'The `infer U` extracts the element type from `Array<infer U>`, unwrapping `string[]` down to `string`.'
  },
  {
    id: 'duel_c_01',
    language: 'c',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What is the output of this pointer arithmetic sequence?',
    codeSnippet: 'int arr[] = { 10, 20, 30, 40 };\nint *p = arr + 1;\nprintf("%d", *(p + 2));',
    options: ['40', '30', '20', 'Undefined behavior'],
    correctAnswer: '40',
    explanation: 'arr + 1 points to arr[1] (20). *(p + 2) accesses offset +2 from there, which is arr[3] (40).'
  },
  {
    id: 'duel_c_02',
    language: 'c',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What will sizeof return on an x86-64 Linux target for this struct?',
    codeSnippet: 'struct Data {\n    char a;    // 1 byte\n    int b;     // 4 bytes\n    short c;   // 2 bytes\n};',
    options: ['12', '7', '8', '16'],
    correctAnswer: '12',
    explanation: 'char a takes 1 byte + 3 bytes padding so int b starts at 4-byte boundary. short c takes 2 bytes + 2 bytes trailing padding to match largest alignment (4). Total = 12 bytes.'
  },
  {
    id: 'duel_cpp_01',
    language: 'cpp',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What is printed by this C++ move constructor demonstration?',
    codeSnippet: '#include <iostream>\n#include <string>\n#include <utility>\n\nint main() {\n    std::string s = "Rocket";\n    std::string t = std::move(s);\n    std::cout << t.length();\n}',
    options: ['6', '0', 'undefined', 'Segmentation Fault'],
    correctAnswer: '6',
    explanation: 'std::move casts s to an rvalue reference, transferring ownership of the underlying buffer to t. t has length 6.'
  },
  {
    id: 'duel_rust_01',
    language: 'rust',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'Why will this Rust snippet fail compilation?',
    codeSnippet: 'let s1 = String::from("duel");\nlet s2 = s1;\nprintln!("{}", s1);',
    options: [
      'Value used after move',
      'Borrow checker immutable borrow conflict',
      'String does not implement Display',
      'Missing mut keyword on s1'
    ],
    correctAnswer: 'Value used after move',
    explanation: 'String implements Move semantics without Copy. Binding s2 = s1 moves ownership, leaving s1 uninitialized.'
  },
  {
    id: 'duel_rust_02',
    language: 'rust',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What is the result of unwrap_or on an Ok variant?',
    codeSnippet: 'let res: Result<i32, &str> = Ok(42);\nprintln!("{}", res.unwrap_or(0));',
    options: ['42', '0', 'panic', 'Ok(42)'],
    correctAnswer: '42',
    explanation: 'unwrap_or returns the contained value if Ok, and the default fallback value only if Err.'
  },
  {
    id: 'duel_go_01',
    language: 'go',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What will be printed by this Go defer order?',
    codeSnippet: 'func main() {\n    defer fmt.Print("A")\n    defer fmt.Print("B")\n    fmt.Print("C")\n}',
    options: ['CBA', 'CAB', 'ABC', 'BAC'],
    correctAnswer: 'CBA',
    explanation: 'Deferred function calls are pushed onto a LIFO stack. C prints first, then defer B, then defer A -> CBA.'
  },
  {
    id: 'duel_go_02',
    language: 'go',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What is the length and capacity of this Go slice?',
    codeSnippet: 's := make([]int, 3, 7)\nfmt.Println(len(s), cap(s))',
    options: ['3 7', '7 3', '3 3', '0 7'],
    correctAnswer: '3 7',
    explanation: 'make([]T, len, cap) sets the initial slice length to 3 and allocates capacity for 7 elements.'
  },
  {
    id: 'duel_sql_01',
    language: 'sql',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'Which aggregate function ignores NULL values when computing results?',
    codeSnippet: 'SELECT COUNT(points), AVG(points) FROM scores;',
    options: [
      'Both COUNT(column) and AVG(column)',
      'Only AVG(column)',
      'Only COUNT(column)',
      'Neither function ignores NULL'
    ],
    correctAnswer: 'Both COUNT(column) and AVG(column)',
    explanation: 'In ANSI SQL, aggregate functions on column names (like COUNT(col), AVG(col), SUM(col)) discard NULL entries before calculating.'
  },
  {
    id: 'duel_sql_02',
    language: 'sql',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What is the difference between UNION and UNION ALL?',
    codeSnippet: 'SELECT id FROM tbl1 UNION SELECT id FROM tbl2;',
    options: [
      'UNION removes duplicate rows; UNION ALL retains duplicates',
      'UNION retains duplicates; UNION ALL removes them',
      'UNION sorts in descending order; UNION ALL is unsorted',
      'UNION only works on numeric columns'
    ],
    correctAnswer: 'UNION removes duplicate rows; UNION ALL retains duplicates',
    explanation: 'UNION performs a distinct sorting pass to eliminate identical rows. UNION ALL simply concatenates result sets without deduplication.'
  },
  {
    id: 'duel_bash_01',
    language: 'cyber',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What does this Bash redirection construct 2>&1 do?',
    codeSnippet: './server.sh > output.log 2>&1',
    options: [
      'Redirects stderr (fd 2) to the same target as stdout (fd 1)',
      'Redirects stdout to file descriptor 2',
      'Runs server.sh twice simultaneously in background',
      'Appends error code 2 to output.log'
    ],
    correctAnswer: 'Redirects stderr (fd 2) to the same target as stdout (fd 1)',
    explanation: 'File descriptor 1 is stdout, 2 is stderr. 2>&1 redirects standard error to the current destination of standard output.'
  },
  {
    id: 'duel_bash_02',
    language: 'cyber',
    difficulty: 'beginner',
    type: 'multiple_choice',
    prompt: 'What Linux file permission numeric mode corresponds to rwxr-xr-x?',
    codeSnippet: 'chmod ??? /opt/bin/daemon',
    options: ['755', '644', '777', '700'],
    correctAnswer: '755',
    explanation: 'rwx = 4+2+1=7 (owner), r-x = 4+0+1=5 (group), r-x = 4+0+1=5 (others). Total: 755.'
  },
  {
    id: 'duel_asm_01',
    language: 'cyber',
    difficulty: 'expert',
    type: 'multiple_choice',
    prompt: 'What register does the x86-64 System V ABI use to pass the 1st integer argument?',
    codeSnippet: 'mov rdi, offset msg\ncall puts',
    options: ['RDI', 'RAX', 'RSI', 'RDX'],
    correctAnswer: 'RDI',
    explanation: 'Under the System V AMD64 ABI (Linux/macOS), the first six integer/pointer arguments are passed in: RDI, RSI, RDX, RCX, R8, R9.'
  },
  {
    id: 'duel_asm_02',
    language: 'cyber',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What is the fastest way in x86-64 assembly to zero out register EAX / RAX?',
    codeSnippet: '; Set RAX to zero in 2 bytes without memory access',
    options: [
      'xor eax, eax',
      'mov rax, 0',
      'sub rax, rax',
      'imul rax, 0'
    ],
    correctAnswer: 'xor eax, eax',
    explanation: '`xor eax, eax` is encoded in only 2 bytes and CPU register-renaming hardware zeroes it with zero latency, automatically zero-extending into 64-bit RAX.'
  },
  {
    id: 'duel_py_04',
    language: 'python',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What happens with default mutable arguments in Python functions?',
    codeSnippet: 'def add_item(val, items=[]):\n    items.append(val)\n    return items\n\nadd_item(1)\nprint(add_item(2))',
    options: ['[1, 2]', '[2]', '[1]', 'TypeError'],
    correctAnswer: '[1, 2]',
    explanation: 'Default argument expressions in Python are evaluated once at function definition time, sharing the same list object across successive calls.'
  },
  {
    id: 'duel_py_05',
    language: 'python',
    difficulty: 'expert',
    type: 'multiple_choice',
    prompt: 'What does this generator expression produce when consumed?',
    codeSnippet: 'gen = (x * 2 for x in range(3))\nprint(list(gen))\nprint(list(gen))',
    options: [
      '[0, 2, 4] then []',
      '[0, 2, 4] then [0, 2, 4]',
      '[] then [0, 2, 4]',
      'StopIteration exception'
    ],
    correctAnswer: '[0, 2, 4] then []',
    explanation: 'Generators are single-use iterators. Once fully consumed by the first `list()`, subsequent iterations yield an empty list.'
  },
  {
    id: 'duel_java_01',
    language: 'java',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What will this Java string pool comparison output?',
    codeSnippet: 'String s1 = "Duel";\nString s2 = new String("Duel");\nSystem.out.println(s1 == s2);',
    options: ['false', 'true', 'NullPointerException', 'Compiler Error'],
    correctAnswer: 'false',
    explanation: '`==` in Java checks reference identity. `s1` references the string literal in the constant pool, while `new String(...)` allocates a separate heap object.'
  },
  {
    id: 'duel_java_02',
    language: 'java',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What does the Java final keyword on a variable guarantee?',
    codeSnippet: 'final List<String> list = new ArrayList<>();\nlist.add("Apex");',
    options: [
      'The reference cannot be reassigned; the contents remain mutable',
      'The list contents become completely immutable',
      'The list cannot have elements added',
      'It creates a compile error'
    ],
    correctAnswer: 'The reference cannot be reassigned; the contents remain mutable',
    explanation: '`final` on an object reference prevents reassigning `list` to another object, but the referenced ArrayList instance itself remains mutable.'
  },
  {
    id: 'duel_sec_01',
    language: 'cyber',
    difficulty: 'expert',
    type: 'multiple_choice',
    prompt: 'What compiler mitigation places a randomized canary before the saved return pointer?',
    codeSnippet: 'gcc -fstack-protector-all -o vuln vuln.c',
    options: [
      'Stack Smashing Protector (Canary)',
      'Address Space Layout Randomization (ASLR)',
      'Data Execution Prevention (DEP / NX)',
      'Position Independent Executable (PIE)'
    ],
    correctAnswer: 'Stack Smashing Protector (Canary)',
    explanation: '-fstack-protector inserts a guard value (canary) between local buffer variables and the saved frame pointer/return address to detect stack overflows.'
  },
  {
    id: 'duel_sec_02',
    language: 'cyber',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    prompt: 'What HTTP header instructs the browser to only communicate with the origin via HTTPS?',
    codeSnippet: 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
    options: [
      'HSTS (Strict-Transport-Security)',
      'CSP (Content-Security-Policy)',
      'CORS (Cross-Origin Resource Sharing)',
      'X-Frame-Options'
    ],
    correctAnswer: 'HSTS (Strict-Transport-Security)',
    explanation: 'HTTP Strict Transport Security (HSTS) informs user agents to automatically upgrade all subsequent HTTP requests to HTTPS.'
  }
];

if (typeof window !== 'undefined') {
  window.DUEL_QUESTIONS = DUEL_QUESTIONS;
}

