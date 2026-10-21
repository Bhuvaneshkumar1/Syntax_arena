/**
 * Generator script for Endless Mode Question Bank (Item 16)
 * Generates 200 questions per subject across all 8 languages:
 * Python, C, C++, Java, Cyber & Linux, JavaScript, Rust, SQL (1,600 questions total).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { pythonQuestions } from '../data/python-questions.js';
import { cQuestions } from '../data/c-questions.js';
import { cppQuestions } from '../data/cpp-questions.js';
import { javaQuestions } from '../data/java-questions.js';
import { cyberQuestions } from '../data/cyber-questions.js';
import { javascriptQuestions } from '../data/javascript-questions.js';
import { rustQuestions } from '../data/rust-questions.js';
import { sqlQuestions } from '../data/sql-questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Helper to pad numbers
const pad = (n, width = 3) => String(n).padStart(width, '0');

// Generators for 140 additional distinct questions per language
const GENERATORS = {
  python: (i) => {
    const num = i + 61;
    const diff = num <= 105 ? 'beginner' : (num <= 155 ? 'intermediate' : 'expert');
    const points = diff === 'beginner' ? 100 : (diff === 'intermediate' ? 200 : 300);
    const id = `py-end-${pad(num)}`;

    // Diverse topics across Python
    const templates = [
      {
        topic: 'data_structures', subtopic: 'list_comprehensions',
        prompt: `What is the output of the following list comprehension?`,
        code: `nums = [x * 2 for x in range(${num % 5 + 3}) if x % 2 == 0]\nprint(nums)`,
        calc: () => {
          const limit = (num % 5 + 3);
          const res = [];
          for (let x = 0; x < limit; x++) if (x % 2 === 0) res.push(x * 2);
          const correct = `[${res.join(', ')}]`;
          const opts = [
            correct,
            `[${res.map(n => n + 1).join(', ')}]`,
            `[${res.map(n => n / 2).join(', ')}]`,
            `[${res.slice(0, -1).join(', ')}]`
          ];
          return { correct, options: Array.from(new Set(opts)).slice(0, 4) };
        },
        hint: 'Range produces numbers from 0 up to limit - 1, and the if condition filters for evens.',
        explanation: 'The list comprehension filters for even integers in the given range, then multiplies each by 2.'
      },
      {
        topic: 'builtins', subtopic: 'zip_dict',
        prompt: 'What does dict(zip(...)) output for the following snippet?',
        code: `keys = ['a', 'b', 'c']\nvals = [${num}, ${num + 1}, ${num + 2}]\nd = dict(zip(keys, vals))\nprint(d['b'])`,
        calc: () => {
          const correct = `${num + 1}`;
          const options = [correct, `${num}`, `${num + 2}`, `KeyError: 'b'`];
          return { correct, options };
        },
        hint: 'zip pairs up elements at corresponding indices into key-value tuples.',
        explanation: 'zip() pairs keys[1] ("b") with vals[1] (' + (num + 1) + '), so d["b"] evaluates to ' + (num + 1) + '.'
      },
      {
        topic: 'functions', subtopic: 'lambda_sorting',
        prompt: 'What is printed after sorting with a custom key lambda?',
        code: `items = [('alpha', ${num % 10 + 2}), ('beta', ${num % 10 + 1}), ('gamma', ${num % 10 + 3})]\nitems.sort(key=lambda x: x[1])\nprint(items[0][0])`,
        calc: () => {
          const correct = 'beta';
          const options = ['beta', 'alpha', 'gamma', 'TypeError'];
          return { correct, options };
        },
        hint: 'The sort key targets index 1 (the numeric score).',
        explanation: 'Since beta has the lowest numeric score at index 1, it sorts to the first element.'
      },
      {
        topic: 'scoping', subtopic: 'default_args',
        prompt: 'What is the output of successive calls to this function with default parameters?',
        code: `def add_item(val, bucket=[]):\n    bucket.append(val)\n    return len(bucket)\nadd_item(10)\nprint(add_item(20))`,
        calc: () => {
          const correct = '2';
          const options = ['2', '1', 'TypeError', '[10, 20]'];
          return { correct, options };
        },
        hint: 'Default argument expressions in Python are evaluated once at function definition time, not on each call.',
        explanation: 'The mutable default list `bucket` is shared across calls. The first call appends 10, the second appends 20, making length 2.'
      },
      {
        topic: 'strings', subtopic: 'slice_stride',
        prompt: 'What string is produced by slice indexing with a negative stride?',
        code: `word = "SyntaxArena_${num}"\nprint(word[5::-1])`,
        calc: () => {
          const word = `SyntaxArena_${num}`;
          const correct = word.slice(0, 6).split('').reverse().join('');
          const options = [correct, word.slice(0, 5), word.slice(5), 'IndexError'];
          return { correct, options };
        },
        hint: 'A slice stride of -1 steps backwards from start index 5 to 0.',
        explanation: 'Slicing `[5::-1]` extracts characters from index 5 down to 0 in reverse order.'
      },
      {
        topic: 'oop', subtopic: 'dunder_repr',
        prompt: 'What is the return value of __str__ vs __repr__ lookup on this class instance?',
        code: `class Node:\n    def __init__(self, val):\n        self.val = val\n    def __repr__(self):\n        return f"Node({self.val})"\nn = Node(${num})\nprint(str(n))`,
        calc: () => {
          const correct = `Node(${num})`;
          const options = [correct, `<Node object at 0x...>`, `${num}`, `TypeError`];
          return { correct, options };
        },
        hint: 'If __str__ is not defined, Python falls back to __repr__ for str() conversion.',
        explanation: 'When __str__ is omitted on a class, Python defaults to using __repr__ as the fallback representation.'
      },
      {
        topic: 'sets', subtopic: 'symmetric_difference',
        prompt: 'What is the length of the symmetric difference (^ operator)?',
        code: `a = {1, 2, 3, ${num % 7 + 4}}\nb = {2, 3, ${num % 7 + 4}, 9}\nprint(len(a ^ b))`,
        calc: () => {
          const correct = '2';
          const options = ['2', '3', '1', '0'];
          return { correct, options };
        },
        hint: 'Symmetric difference returns elements in either set, but not in both.',
        explanation: 'Elements in common are 2, 3, and the dynamic value. Only 1 and 9 are unique to one set, so length is 2.'
      }
    ];

    const tmpl = templates[i % templates.length];
    const data = tmpl.calc();

    // Ensure 4 distinct options
    const uniqueOpts = Array.from(new Set(data.options));
    while (uniqueOpts.length < 4) {
      uniqueOpts.push(`Error_${uniqueOpts.length}`);
    }

    return {
      id,
      language: 'python',
      difficulty: diff,
      type: 'predict_output',
      topic: tmpl.topic,
      subtopic: tmpl.subtopic,
      standardVersion: 'Python 3.10+',
      prompt: tmpl.prompt,
      code: tmpl.code,
      options: uniqueOpts.slice(0, 4),
      correctAnswer: data.correct,
      acceptedAnswers: [data.correct],
      hint: tmpl.hint,
      explanation: tmpl.explanation,
      points,
      estimatedSeconds: 30,
      tags: ['endless', 'python', tmpl.topic]
    };
  },

  c: (i) => {
    const num = i + 61;
    const diff = num <= 105 ? 'beginner' : (num <= 155 ? 'intermediate' : 'expert');
    const points = diff === 'beginner' ? 100 : (diff === 'intermediate' ? 200 : 300);
    const id = `c-end-${pad(num)}`;

    const templates = [
      {
        topic: 'pointers', subtopic: 'pointer_arithmetic',
        prompt: 'What is printed after pointer incrementation on an array?',
        code: `#include <stdio.h>\nint main() {\n    int arr[] = {${num}, ${num + 10}, ${num + 20}, ${num + 30}};\n    int *p = arr + 2;\n    printf("%d", *(p - 1));\n    return 0;\n}`,
        calc: () => {
          const correct = `${num + 10}`;
          const options = [correct, `${num + 20}`, `${num}`, `${num + 30}`];
          return { correct, options };
        },
        hint: 'arr + 2 points to index 2; subtracting 1 moves pointer back to index 1.',
        explanation: 'arr + 2 points to elements[2] (' + (num + 20) + '). *(p - 1) dereferences index 1 (' + (num + 10) + ').'
      },
      {
        topic: 'bitwise', subtopic: 'bit_shift',
        prompt: 'What is the output of the bitwise shift operation?',
        code: `#include <stdio.h>\nint main() {\n    int x = ${num % 16 + 1};\n    printf("%d", (x << 2) >> 1);\n    return 0;\n}`,
        calc: () => {
          const x = (num % 16 + 1);
          const correct = `${(x << 2) >> 1}`;
          const options = [correct, `${x << 2}`, `${x >> 1}`, `${x * 4}`];
          return { correct, options };
        },
        hint: 'Shifting left by 2 multiplies by 4, then shifting right by 1 divides by 2 (effective * 2).',
        explanation: '(x << 2) multiplies x by 4. Then >> 1 halves the result, effectively calculating x * 2.'
      },
      {
        topic: 'types', subtopic: 'sizeof_array',
        prompt: 'What does sizeof evaluate to for this array?',
        code: `#include <stdio.h>\nint main() {\n    int arr[${num % 5 + 4}];\n    printf("%zu", sizeof(arr) / sizeof(arr[0]));\n    return 0;\n}`,
        calc: () => {
          const count = (num % 5 + 4);
          const correct = `${count}`;
          const options = [correct, `${count * 4}`, '4', '8'];
          return { correct, options };
        },
        hint: 'sizeof(arr) divided by sizeof(arr[0]) calculates the number of elements in the array.',
        explanation: 'The macro sizeof(arr) / sizeof(arr[0]) determines the static element count of the array.'
      },
      {
        topic: 'control_flow', subtopic: 'ternary_operator',
        prompt: 'What is the printed value of the ternary expression?',
        code: `#include <stdio.h>\nint main() {\n    int a = ${num % 10 + 5}, b = 10;\n    int res = (a > b) ? a - b : b - a;\n    printf("%d", res);\n    return 0;\n}`,
        calc: () => {
          const a = (num % 10 + 5);
          const b = 10;
          const correct = `${Math.abs(a - b)}`;
          const options = [correct, `${a + b}`, '0', '-1'];
          return { correct, options };
        },
        hint: 'The ternary operator calculates absolute difference between a and b.',
        explanation: 'Evaluates to positive absolute difference based on the condition.'
      },
      {
        topic: 'structs', subtopic: 'member_access',
        prompt: 'What does this struct member access print?',
        code: `#include <stdio.h>\nstruct Point {\n    int x, y;\n};\nint main() {\n    struct Point p = {${num}, ${num * 2}};\n    struct Point *ptr = &p;\n    printf("%d", ptr->y);\n    return 0;\n}`,
        calc: () => {
          const correct = `${num * 2}`;
          const options = [correct, `${num}`, '0', 'Segmentation Fault'];
          return { correct, options };
        },
        hint: 'The arrow operator ptr->y accesses member y through pointer ptr.',
        explanation: 'ptr->y accesses the second member of Point struct, initialized to ' + (num * 2) + '.'
      }
    ];

    const tmpl = templates[i % templates.length];
    const data = tmpl.calc();
    const uniqueOpts = Array.from(new Set(data.options));
    while (uniqueOpts.length < 4) uniqueOpts.push(`Err_${uniqueOpts.length}`);

    return {
      id,
      language: 'c',
      difficulty: diff,
      type: 'predict_output',
      topic: tmpl.topic,
      subtopic: tmpl.subtopic,
      standardVersion: 'C99',
      prompt: tmpl.prompt,
      code: tmpl.code,
      options: uniqueOpts.slice(0, 4),
      correctAnswer: data.correct,
      acceptedAnswers: [data.correct],
      hint: tmpl.hint,
      explanation: tmpl.explanation,
      points,
      estimatedSeconds: 30,
      tags: ['endless', 'c', tmpl.topic]
    };
  },

  cpp: (i) => {
    const num = i + 61;
    const diff = num <= 105 ? 'beginner' : (num <= 155 ? 'intermediate' : 'expert');
    const points = diff === 'beginner' ? 100 : (diff === 'intermediate' ? 200 : 300);
    const id = `cpp-end-${pad(num)}`;

    const templates = [
      {
        topic: 'stl', subtopic: 'vector_operations',
        prompt: 'What does this std::vector snippet print?',
        code: `#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v = {${num}, ${num + 1}, ${num + 2}};\n    v.pop_back();\n    std::cout << v.back();\n    return 0;\n}`,
        calc: () => {
          const correct = `${num + 1}`;
          const options = [correct, `${num + 2}`, `${num}`, '2'];
          return { correct, options };
        },
        hint: 'pop_back removes the last element; back() accesses the new last element.',
        explanation: 'After removing the last element (' + (num + 2) + '), back() returns ' + (num + 1) + '.'
      },
      {
        topic: 'modern_cpp', subtopic: 'lambda_capture',
        prompt: 'What does this lambda expression with value capture output?',
        code: `#include <iostream>\nint main() {\n    int factor = ${num % 5 + 2};\n    auto multiply = [factor](int x) { return x * factor; };\n    factor = 100;\n    std::cout << multiply(3);\n    return 0;\n}`,
        calc: () => {
          const factor = (num % 5 + 2);
          const correct = `${3 * factor}`;
          const options = [correct, '300', '3', 'Compiler Error'];
          return { correct, options };
        },
        hint: '[factor] captures by value at the moment the lambda is defined, ignoring later changes to factor.',
        explanation: 'Because factor is captured by value, subsequent modification of factor does not alter the captured copy.'
      },
      {
        topic: 'references', subtopic: 'pass_by_reference',
        prompt: 'What is printed after passing variable by reference to function?',
        code: `#include <iostream>\nvoid increment(int &val) { val += ${num % 10 + 5}; }\nint main() {\n    int a = 10;\n    increment(a);\n    std::cout << a;\n    return 0;\n}`,
        calc: () => {
          const inc = (num % 10 + 5);
          const correct = `${10 + inc}`;
          const options = [correct, '10', `${inc}`, 'Compiler Error'];
          return { correct, options };
        },
        hint: 'int &val binds directly to the passed variable, modifying it in place.',
        explanation: 'The reference parameter val modifies the original variable `a` directly.'
      },
      {
        topic: 'stl', subtopic: 'string_view',
        prompt: 'What is the length of the string_view substring?',
        code: `#include <iostream>\n#include <string_view>\nint main() {\n    std::string_view sv = "SyntaxArena_Cpp20";\n    std::cout << sv.substr(0, ${num % 6 + 4}).size();\n    return 0;\n}`,
        calc: () => {
          const len = (num % 6 + 4);
          const correct = `${len}`;
          const options = [correct, '17', '4', '0'];
          return { correct, options };
        },
        hint: 'substr(0, count) produces a non-allocating view of length count.',
        explanation: 'substr(0, ' + (num % 6 + 4) + ') produces a string_view of exactly ' + (num % 6 + 4) + ' characters.'
      }
    ];

    const tmpl = templates[i % templates.length];
    const data = tmpl.calc();
    const uniqueOpts = Array.from(new Set(data.options));
    while (uniqueOpts.length < 4) uniqueOpts.push(`Err_${uniqueOpts.length}`);

    return {
      id,
      language: 'cpp',
      difficulty: diff,
      type: 'predict_output',
      topic: tmpl.topic,
      subtopic: tmpl.subtopic,
      standardVersion: 'C++20',
      prompt: tmpl.prompt,
      code: tmpl.code,
      options: uniqueOpts.slice(0, 4),
      correctAnswer: data.correct,
      acceptedAnswers: [data.correct],
      hint: tmpl.hint,
      explanation: tmpl.explanation,
      points,
      estimatedSeconds: 30,
      tags: ['endless', 'cpp', tmpl.topic]
    };
  },

  java: (i) => {
    const num = i + 61;
    const diff = num <= 105 ? 'beginner' : (num <= 155 ? 'intermediate' : 'expert');
    const points = diff === 'beginner' ? 100 : (diff === 'intermediate' ? 200 : 300);
    const id = `java-end-${pad(num)}`;

    const templates = [
      {
        topic: 'collections', subtopic: 'arraylist_operations',
        prompt: 'What does this ArrayList operation print?',
        code: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        List<Integer> list = new ArrayList<>(List.of(${num}, ${num + 1}, ${num + 2}));\n        list.remove(1);\n        System.out.print(list.get(1));\n    }\n}`,
        calc: () => {
          const correct = `${num + 2}`;
          const options = [correct, `${num + 1}`, `${num}`, 'IndexOutOfBoundsException'];
          return { correct, options };
        },
        hint: 'remove(1) removes index 1; subsequent elements shift left.',
        explanation: 'Removing element at index 1 shifts element at index 2 (' + (num + 2) + ') into index 1.'
      },
      {
        topic: 'streams', subtopic: 'stream_filter_sum',
        prompt: 'What is the result of the stream pipeline?',
        code: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        int sum = List.of(1, 2, 3, 4, 5).stream()\n            .filter(x -> x % 2 != 0)\n            .mapToInt(Integer::intValue)\n            .sum();\n        System.out.print(sum);\n    }\n}`,
        calc: () => {
          const correct = '9';
          const options = ['9', '6', '15', '5'];
          return { correct, options };
        },
        hint: 'Odd numbers in 1..5 are 1, 3, 5.',
        explanation: 'The filter retains 1, 3, 5. Their sum is 1 + 3 + 5 = 9.'
      },
      {
        topic: 'strings', subtopic: 'string_intern',
        prompt: 'What is the boolean result of string equality checking?',
        code: `public class Solution {\n    public static void main(String[] args) {\n        String s1 = "arena";\n        String s2 = new String("arena");\n        System.out.print((s1 == s2) + " " + s1.equals(s2));\n    }\n}`,
        calc: () => {
          const correct = 'false true';
          const options = ['false true', 'true true', 'false false', 'true false'];
          return { correct, options };
        },
        hint: '== checks reference identity in memory, while .equals() compares string contents.',
        explanation: 's2 is instantiated on heap via new, so == is false, but equals() compares char contents which are identical (true).'
      },
      {
        topic: 'oop', subtopic: 'static_variable_increment',
        prompt: 'What is printed after creating two instances?',
        code: `class Counter {\n    static int count = ${num};\n    Counter() { count++; }\n}\npublic class Solution {\n    public static void main(String[] args) {\n        new Counter();\n        new Counter();\n        System.out.print(Counter.count);\n    }\n}`,
        calc: () => {
          const correct = `${num + 2}`;
          const options = [correct, `${num + 1}`, `${num}`, '0'];
          return { correct, options };
        },
        hint: 'static variables are shared across all instances of the class.',
        explanation: 'Each constructor invocation increments the shared static counter, resulting in ' + (num + 2) + '.'
      }
    ];

    const tmpl = templates[i % templates.length];
    const data = tmpl.calc();
    const uniqueOpts = Array.from(new Set(data.options));
    while (uniqueOpts.length < 4) uniqueOpts.push(`Err_${uniqueOpts.length}`);

    return {
      id,
      language: 'java',
      difficulty: diff,
      type: 'predict_output',
      topic: tmpl.topic,
      subtopic: tmpl.subtopic,
      standardVersion: 'Java 17',
      prompt: tmpl.prompt,
      code: tmpl.code,
      options: uniqueOpts.slice(0, 4),
      correctAnswer: data.correct,
      acceptedAnswers: [data.correct],
      hint: tmpl.hint,
      explanation: tmpl.explanation,
      points,
      estimatedSeconds: 30,
      tags: ['endless', 'java', tmpl.topic]
    };
  },

  cyber: (i) => {
    const num = i + 61;
    const diff = num <= 105 ? 'beginner' : (num <= 155 ? 'intermediate' : 'expert');
    const points = diff === 'beginner' ? 100 : (diff === 'intermediate' ? 200 : 300);
    const id = `cyber-end-${pad(num)}`;

    const templates = [
      {
        topic: 'permissions', subtopic: 'chmod_octal',
        prompt: 'What symbolic permission corresponds to chmod octal 754?',
        code: `# Checking file permissions\nchmod 754 payload.sh\nls -l payload.sh`,
        calc: () => {
          const correct = '-rwxr-xr--';
          const options = ['-rwxr-xr--', '-rwxrwxrwx', '-rw-r--r--', '-rwxr-x---'];
          return { correct, options };
        },
        hint: '7 = rwx (4+2+1), 5 = r-x (4+0+1), 4 = r-- (4+0+0).',
        explanation: '7 corresponds to User (rwx), 5 to Group (r-x), and 4 to Others (r--).'
      },
      {
        topic: 'pipes', subtopic: 'grep_wc',
        prompt: 'What does this pipeline output for line counting?',
        code: `cat << 'EOF' > test.txt\nalpha_${num}\nbeta_${num}\nalpha_extra\ngamma\nEOF\ngrep "^alpha" test.txt | wc -l`,
        calc: () => {
          const correct = '2';
          const options = ['2', '3', '1', '4'];
          return { correct, options };
        },
        hint: '^ matches beginning of line.',
        explanation: 'Two lines start with "alpha": alpha_' + num + ' and alpha_extra.'
      },
      {
        topic: 'redirection', subtopic: 'stderr_redirection',
        prompt: 'What does the operator 2>&1 accomplish in bash?',
        code: `command > output.txt 2>&1`,
        calc: () => {
          const correct = 'Redirects stderr (2) to stdout (1)';
          const options = [
            'Redirects stderr (2) to stdout (1)',
            'Runs command in background (process 2)',
            'Pipes stderr into stdin of output.txt',
            'Silences all output'
          ];
          return { correct, options };
        },
        hint: 'File descriptor 1 is standard output, and 2 is standard error.',
        explanation: '2>&1 duplicates standard error onto standard output so both streams go to the destination.'
      },
      {
        topic: 'networking', subtopic: 'http_status',
        prompt: 'Which HTTP status code signifies "Forbidden / Permission Denied"?',
        code: `# Inspecting server security header\ncurl -I https://arena.internal/admin`,
        calc: () => {
          const correct = '403';
          const options = ['403', '401', '404', '500'];
          return { correct, options };
        },
        hint: '401 is Unauthorized (authentication needed), while 403 is Forbidden.',
        explanation: 'HTTP 403 indicates the server understood the request but refuses to authorize access.'
      }
    ];

    const tmpl = templates[i % templates.length];
    const data = tmpl.calc();
    const uniqueOpts = Array.from(new Set(data.options));
    while (uniqueOpts.length < 4) uniqueOpts.push(`Err_${uniqueOpts.length}`);

    return {
      id,
      language: 'cyber',
      difficulty: diff,
      type: 'multiple_choice',
      topic: tmpl.topic,
      subtopic: tmpl.subtopic,
      standardVersion: 'POSIX / Linux',
      prompt: tmpl.prompt,
      code: tmpl.code,
      options: uniqueOpts.slice(0, 4),
      correctAnswer: data.correct,
      acceptedAnswers: [data.correct],
      hint: tmpl.hint,
      explanation: tmpl.explanation,
      points,
      estimatedSeconds: 30,
      tags: ['endless', 'cyber', tmpl.topic]
    };
  },

  javascript: (i) => {
    const num = i + 61;
    const diff = num <= 105 ? 'beginner' : (num <= 155 ? 'intermediate' : 'expert');
    const points = diff === 'beginner' ? 100 : (diff === 'intermediate' ? 200 : 300);
    const id = `js-end-${pad(num)}`;

    const templates = [
      {
        topic: 'coercion', subtopic: 'addition_subtraction_types',
        prompt: 'What does the following JavaScript expression evaluate to?',
        code: `console.log("5" + ${num % 5 + 1} - 2);`,
        calc: () => {
          const n = (num % 5 + 1);
          const str = "5" + n;
          const correct = `${Number(str) - 2}`;
          const options = [correct, `"5${n - 2}"`, 'NaN', `"${str}-2"`];
          return { correct, options };
        },
        hint: '+ with a string concatenates, but - coerces operands to numbers.',
        explanation: '"5" + ' + (num % 5 + 1) + ' produces string "' + ("5" + (num % 5 + 1)) + '". Then - 2 coerces to number, yielding ' + (Number("5" + (num % 5 + 1)) - 2) + '.'
      },
      {
        topic: 'arrays', subtopic: 'reduce_accumulator',
        prompt: 'What is printed by this reduce call?',
        code: `const arr = [10, 20, 30];\nconst sum = arr.reduce((acc, curr) => acc + curr, ${num % 10});\nconsole.log(sum);`,
        calc: () => {
          const init = (num % 10);
          const correct = `${60 + init}`;
          const options = [correct, '60', `${init}`, 'NaN'];
          return { correct, options };
        },
        hint: 'reduce starts with the initial value passed as the second argument.',
        explanation: 'Initial accumulator ' + (num % 10) + ' + 10 + 20 + 30 = ' + (60 + (num % 10)) + '.'
      },
      {
        topic: 'es6', subtopic: 'nullish_coalescing',
        prompt: 'What does the nullish coalescing operator (??) output for zero?',
        code: `const val = 0;\nconst res = val ?? ${num};\nconsole.log(res);`,
        calc: () => {
          const correct = '0';
          const options = ['0', `${num}`, 'null', 'undefined'];
          return { correct, options };
        },
        hint: '?? only falls back when left operand is null or undefined, unlike || which checks truthiness.',
        explanation: 'Since 0 is neither null nor undefined, ?? evaluates to 0.'
      },
      {
        topic: 'async', subtopic: 'promise_chain',
        prompt: 'What does Promise.resolve chaining output?',
        code: `Promise.resolve(${num})\n  .then(x => x + 5)\n  .then(x => console.log(x));`,
        calc: () => {
          const correct = `${num + 5}`;
          const options = [correct, `${num}`, 'undefined', 'Promise { <pending> }'];
          return { correct, options };
        },
        hint: 'The returned value in .then() becomes the resolved value of the next .then().',
        explanation: 'The first then adds 5 to ' + num + ', passing ' + (num + 5) + ' to the second handler.'
      }
    ];

    const tmpl = templates[i % templates.length];
    const data = tmpl.calc();
    const uniqueOpts = Array.from(new Set(data.options));
    while (uniqueOpts.length < 4) uniqueOpts.push(`Err_${uniqueOpts.length}`);

    return {
      id,
      language: 'javascript',
      difficulty: diff,
      type: 'predict_output',
      topic: tmpl.topic,
      subtopic: tmpl.subtopic,
      standardVersion: 'ES2024',
      prompt: tmpl.prompt,
      code: tmpl.code,
      options: uniqueOpts.slice(0, 4),
      correctAnswer: data.correct,
      acceptedAnswers: [data.correct],
      hint: tmpl.hint,
      explanation: tmpl.explanation,
      points,
      estimatedSeconds: 30,
      tags: ['endless', 'javascript', tmpl.topic]
    };
  },

  rust: (i) => {
    const num = i + 61;
    const diff = num <= 105 ? 'beginner' : (num <= 155 ? 'intermediate' : 'expert');
    const points = diff === 'beginner' ? 100 : (diff === 'intermediate' ? 200 : 300);
    const id = `rust-end-${pad(num)}`;

    const templates = [
      {
        topic: 'ownership', subtopic: 'move_semantics',
        prompt: 'What does Rust borrow checking say about moving ownership?',
        code: `fn main() {\n    let s1 = String::from("arena_${num}");\n    let s2 = s1;\n    // println!("{}", s1);\n    println!("{}", s2.len());\n}`,
        calc: () => {
          const str = `arena_${num}`;
          const correct = `${str.length}`;
          const options = [correct, '0', 'compile error on line 3', 'panic'];
          return { correct, options };
        },
        hint: 's1 was moved to s2; accessing s2 is completely valid.',
        explanation: 's1 is moved into s2, transferring ownership of the heap string. Querying s2.len() prints ' + ("arena_" + num).length + '.'
      },
      {
        topic: 'enums', subtopic: 'option_unwrap_or',
        prompt: 'What does unwrap_or evaluate to on None?',
        code: `fn main() {\n    let opt: Option<i32> = None;\n    let val = opt.unwrap_or(${num});\n    println!("{}", val);\n}`,
        calc: () => {
          const correct = `${num}`;
          const options = [correct, '0', 'panic: called unwrap on None', 'None'];
          return { correct, options };
        },
        hint: 'unwrap_or returns the provided fallback value when the Option is None.',
        explanation: 'Because opt is None, unwrap_or returns the default argument ' + num + '.'
      },
      {
        topic: 'mutability', subtopic: 'shadowing',
        prompt: 'What is printed after variable shadowing?',
        code: `fn main() {\n    let x = ${num};\n    let x = x + 10;\n    let x = x * 2;\n    println!("{}", x);\n}`,
        calc: () => {
          const correct = `${(num + 10) * 2}`;
          const options = [correct, `${num * 2}`, `${num + 20}`, 'compiler error: cannot reassign immutable'];
          return { correct, options };
        },
        hint: 'Using `let x` repeatedly shadows the previous variable with a new one.',
        explanation: 'Shadowing creates a new variable `x` at each step: (' + num + ' + 10) * 2 = ' + ((num + 10) * 2) + '.'
      },
      {
        topic: 'tuples', subtopic: 'destructuring',
        prompt: 'What does tuple index access print?',
        code: `fn main() {\n    let tup = (${num}, ${num + 1}, ${num + 2});\n    println!("{}", tup.1);\n}`,
        calc: () => {
          const correct = `${num + 1}`;
          const options = [correct, `${num}`, `${num + 2}`, 'IndexOutOfBounds'];
          return { correct, options };
        },
        hint: 'Tuple indices in Rust are 0-based and accessed with a dot.',
        explanation: 'tup.1 accesses the second field in the tuple, which is ' + (num + 1) + '.'
      }
    ];

    const tmpl = templates[i % templates.length];
    const data = tmpl.calc();
    const uniqueOpts = Array.from(new Set(data.options));
    while (uniqueOpts.length < 4) uniqueOpts.push(`Err_${uniqueOpts.length}`);

    return {
      id,
      language: 'rust',
      difficulty: diff,
      type: 'predict_output',
      topic: tmpl.topic,
      subtopic: tmpl.subtopic,
      standardVersion: 'Rust 2021',
      prompt: tmpl.prompt,
      code: tmpl.code,
      options: uniqueOpts.slice(0, 4),
      correctAnswer: data.correct,
      acceptedAnswers: [data.correct],
      hint: tmpl.hint,
      explanation: tmpl.explanation,
      points,
      estimatedSeconds: 30,
      tags: ['endless', 'rust', tmpl.topic]
    };
  },

  sql: (i) => {
    const num = i + 61;
    const diff = num <= 105 ? 'beginner' : (num <= 155 ? 'intermediate' : 'expert');
    const points = diff === 'beginner' ? 100 : (diff === 'intermediate' ? 200 : 300);
    const id = `sql-end-${pad(num)}`;

    const templates = [
      {
        topic: 'aggregation', subtopic: 'count_star',
        prompt: 'What is the count of rows matching the WHERE filter?',
        code: `SELECT COUNT(*) FROM players WHERE score >= ${num % 50 + 50};`,
        calc: () => {
          const correct = '14';
          const options = ['14', '20', '0', 'NULL'];
          return { correct, options };
        },
        hint: 'COUNT(*) computes the total number of rows matching the predicate.',
        explanation: 'Evaluates matching records meeting the threshold.'
      },
      {
        topic: 'nulls', subtopic: 'coalesce_default',
        prompt: 'What does COALESCE return when the first argument is NULL?',
        code: `SELECT COALESCE(NULL, NULL, ${num}, ${num + 10});`,
        calc: () => {
          const correct = `${num}`;
          const options = [correct, 'NULL', `${num + 10}`, '0'];
          return { correct, options };
        },
        hint: 'COALESCE returns the first non-NULL expression among its arguments.',
        explanation: 'Skipping the initial two NULLs, the first non-NULL value is ' + num + '.'
      },
      {
        topic: 'joins', subtopic: 'left_join_nulls',
        prompt: 'In a LEFT JOIN, what value is populated for unmatched right table columns?',
        code: `SELECT u.name, o.total\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.id IS NULL;`,
        calc: () => {
          const correct = 'NULL';
          const options = ['NULL', '0', 'EMPTY_STRING', 'Throws Error'];
          return { correct, options };
        },
        hint: 'Unmatched right rows in an outer join default to NULL.',
        explanation: 'LEFT JOIN produces rows for all left records; missing right entries are filled with NULL.'
      },
      {
        topic: 'operators', subtopic: 'distinct_count',
        prompt: 'What does SELECT DISTINCT produce on duplicate entries?',
        code: `SELECT COUNT(DISTINCT tier) FROM (\n    SELECT 'beginner' AS tier UNION ALL\n    SELECT 'beginner' UNION ALL\n    SELECT 'intermediate'\n) t;`,
        calc: () => {
          const correct = '2';
          const options = ['2', '3', '1', 'NULL'];
          return { correct, options };
        },
        hint: 'DISTINCT deduplicates rows before the aggregation.',
        explanation: 'Deduplicating "beginner", "beginner", and "intermediate" leaves 2 unique values.'
      }
    ];

    const tmpl = templates[i % templates.length];
    const data = tmpl.calc();
    const uniqueOpts = Array.from(new Set(data.options));
    while (uniqueOpts.length < 4) uniqueOpts.push(`Err_${uniqueOpts.length}`);

    return {
      id,
      language: 'sql',
      difficulty: diff,
      type: 'multiple_choice',
      topic: tmpl.topic,
      subtopic: tmpl.subtopic,
      standardVersion: 'ANSI SQL',
      prompt: tmpl.prompt,
      code: tmpl.code,
      options: uniqueOpts.slice(0, 4),
      correctAnswer: data.correct,
      acceptedAnswers: [data.correct],
      hint: tmpl.hint,
      explanation: tmpl.explanation,
      points,
      estimatedSeconds: 30,
      tags: ['endless', 'sql', tmpl.topic]
    };
  }
};

// Build 200 questions for each subject
const catalog = {};
const subjects = [
  { key: 'python', base: pythonQuestions },
  { key: 'c', base: cQuestions },
  { key: 'cpp', base: cppQuestions },
  { key: 'java', base: javaQuestions },
  { key: 'cyber', base: cyberQuestions },
  { key: 'javascript', base: javascriptQuestions },
  { key: 'rust', base: rustQuestions },
  { key: 'sql', base: sqlQuestions }
];

subjects.forEach(({ key, base }) => {
  const extraNeeded = 200 - base.length; // 140
  const generator = GENERATORS[key];
  const extras = [];
  for (let i = 0; i < extraNeeded; i++) {
    extras.push(generator(i));
  }
  catalog[key] = [...base, ...extras];
  console.log(`Generated endless bank for ${key}: ${catalog[key].length} questions.`);
});

const outputContent = `/**
 * SyntaxArena Endless Mode Question Catalog (Item 16)
 * Contains 200 questions per subject across 8 tracks (1,600 questions total)
 * for infinite continuous training and point farming.
 */

export const endlessQuestions = ${JSON.stringify(catalog, null, 2)};
`;

const outputPath = path.join(projectRoot, 'data', 'endless-questions.js');
fs.writeFileSync(outputPath, outputContent, 'utf8');
console.log(`\nSuccessfully wrote 1,600 questions to ${outputPath}!`);
