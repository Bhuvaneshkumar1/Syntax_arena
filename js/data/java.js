/**
 * SyntaxArena Question Catalog — Java
 * Conforms to docs/QUESTION_SCHEMA.md
 */

export const javaQuestions = [
  {
    id: "java-beg-001",
    language: "java",
    difficulty: "beginner",
    type: "predict_output",
    topic: "strings",
    subtopic: "string_pool_equality",
    standardVersion: "Java 17",
    prompt: "What is the exact stdout printed by this comparison snippet?",
    code: "public class StringTest {\n    public static void main(String[] args) {\n        String s1 = \"Java\";\n        String s2 = \"Java\";\n        String s3 = new String(\"Java\");\n        System.out.println((s1 == s2) + \" \" + (s1 == s3));\n    }\n}",
    options: [
      "true true",
      "true false",
      "false true",
      "false false"
    ],
    correctAnswer: "true false",
    expectedOutput: "true false",
    hint: "`==` tests object reference identity. String literals are interned in the String Pool, but `new String(...)` allocates a separate heap object.",
    explanation: "`s1` and `s2` both refer to the identical string literal object in the JVM String Constant Pool, so `s1 == s2` is true. `new String(\"Java\")` forces allocation of a distinct heap object, so reference check `s1 == s3` is false (though `s1.equals(s3)` would be true)."
  },
  {
    id: "java-int-001",
    language: "java",
    difficulty: "intermediate",
    type: "predict_output",
    topic: "methods",
    subtopic: "pass_by_value_references",
    standardVersion: "Java 17",
    prompt: "What does this Java program print to stdout?",
    code: "import java.util.ArrayList;\n\npublic class ParamTest {\n    static void modify(ArrayList<Integer> list, int val) {\n        list.add(val);\n        list = new ArrayList<>();\n        list.add(99);\n    }\n    public static void main(String[] args) {\n        ArrayList<Integer> nums = new ArrayList<>();\n        nums.add(10);\n        modify(nums, 20);\n        System.out.println(nums);\n    }\n}",
    options: [
      "[10, 20, 99]",
      "[10, 20]",
      "[99]",
      "[10]"
    ],
    correctAnswer: "[10, 20]",
    expectedOutput: "[10, 20]",
    hint: "Java is strictly pass-by-value. Object references are passed by value; mutating the referenced object persists, but reassigning the parameter variable does not affect the caller's reference.",
    explanation: "Executing `list.add(val)` mutates the object referred to by `nums`, appending 20. But `list = new ArrayList<>()` merely rebinds the local copy of the reference parameter inside `modify()`. The caller's `nums` remains bound to the original list: `[10, 20]`."
  },
  {
    id: "java-exp-001",
    language: "java",
    difficulty: "expert",
    type: "predict_output",
    topic: "initialization",
    subtopic: "static_and_instance_blocks",
    standardVersion: "Java 17",
    prompt: "What is the exact stdout printed by executing `InitTest`?",
    code: "public class InitTest {\n    static {\n        System.out.print(\"S1 \");\n    }\n    {\n        System.out.print(\"I1 \");\n    }\n    public InitTest() {\n        System.out.print(\"C1 \");\n    }\n    public static void main(String[] args) {\n        System.out.print(\"M \");\n        new InitTest();\n    }\n}",
    options: [
      "M S1 I1 C1",
      "S1 M I1 C1",
      "S1 I1 C1 M",
      "I1 C1 S1 M"
    ],
    correctAnswer: "S1 M I1 C1",
    expectedOutput: "S1 M I1 C1",
    hint: "Static initialization blocks execute once when the class is loaded by the JVM before `main()` begins. Instance initialization blocks execute each time a constructor is invoked, immediately before the constructor body.",
    explanation: "1) Class loading executes static block `S1 `. 2) `main()` starts and prints `M `. 3) `new InitTest()` triggers the instance initializer `I1 ` followed by the constructor body `C1 `. Final sequence: `S1 M I1 C1`."
  }
];
