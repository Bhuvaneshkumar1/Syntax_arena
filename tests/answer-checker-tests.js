/**
 * SyntaxArena Answer Checker Test Suite (Batch 4)
 * Plain JavaScript unit tests for answer evaluation, whitespace tolerance,
 * case sensitivity, and multi-format input parsing.
 * Source of truth: docs/GAME_RULES.md & docs/QUESTION_SCHEMA.md
 */

import { AnswerChecker } from '../js/answer-checker.js';

let passed = 0;
let failed = 0;
const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    results.push({ name: testName, status: 'PASS' });
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failed++;
    results.push({ name: testName, status: 'FAIL', details });
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
  }
}

export async function runAnswerCheckerTests() {
  console.log('\n============================================================');
  console.log('🧪 RUNNING ANSWER CHECKER TEST SUITE');
  console.log('============================================================\n');

  // --- 1. Multiple Choice Evaluation ---
  console.log('--- 1. Multiple Choice Evaluation ---');
  const mcQuestion = {
    type: 'multiple_choice',
    options: ['List', 'Tuple', 'Dictionary', 'Set'],
    correctAnswer: 'Dictionary',
    acceptedAnswers: ['Dictionary', 'c', 2]
  };

  assert(AnswerChecker.check(mcQuestion, 'Dictionary').correct === true, 'Matches exact option text');
  assert(AnswerChecker.check(mcQuestion, 'dictionary').correct === true, 'Case-insensitive option text match');
  assert(AnswerChecker.check(mcQuestion, '  Dictionary  \n').correct === true, 'Tolerates leading and trailing whitespace');
  assert(AnswerChecker.check(mcQuestion, 'c').correct === true, 'Letter index option selector (c matches 3rd option)');
  assert(AnswerChecker.check(mcQuestion, 'C').correct === true, 'Uppercase letter index selector');
  assert(AnswerChecker.check(mcQuestion, 2).correct === true, '0-based numeric index selector');
  assert(AnswerChecker.check(mcQuestion, 'List').correct === false, 'Rejects incorrect distractor option');
  assert(AnswerChecker.check(mcQuestion, '').correct === false, 'Rejects empty submission');
  assert(AnswerChecker.check(mcQuestion, null).correct === false, 'Rejects null submission');

  // --- 2. Predict Output Evaluation ---
  console.log('\n--- 2. Predict Output Evaluation ---');
  const predictQuestion = {
    type: 'predict_output',
    options: ['4 4', '3 3', '4 3'],
    correctAnswer: '4 4',
    acceptedAnswers: ['4 4']
  };

  assert(AnswerChecker.check(predictQuestion, '4 4').correct === true, 'Predict output exact match');
  assert(AnswerChecker.check(predictQuestion, ' 4 4 \r\n').correct === true, 'Predict output with CRLF whitespace');
  assert(AnswerChecker.check(predictQuestion, '3 3').correct === false, 'Predict output incorrect option');

  // Numeric output evaluation
  const numOutputQuestion = {
    type: 'predict_output',
    correctAnswer: '42',
    acceptedAnswers: ['42', 42]
  };
  assert(AnswerChecker.check(numOutputQuestion, 42).correct === true, 'Accepts numeric literal 42');
  assert(AnswerChecker.check(numOutputQuestion, '42').correct === true, 'Accepts string literal "42"');
  assert(AnswerChecker.check(numOutputQuestion, 41).correct === false, 'Rejects wrong number');

  // --- 3. Find the Bug Line Number Evaluation ---
  console.log('\n--- 3. Find the Bug Evaluation ---');
  const bugQuestion = {
    type: 'find_bug',
    code: "def sum(a, b):\n    total = a + b\n    return totl\nprint(sum(1, 2))",
    correctAnswer: 3,
    targetLine: 3,
    acceptedAnswers: [3, "3", "Line 3", "line 3"]
  };

  assert(AnswerChecker.check(bugQuestion, 3).correct === true, 'Find bug exact integer line number 3');
  assert(AnswerChecker.check(bugQuestion, '3').correct === true, 'Find bug string number "3"');
  assert(AnswerChecker.check(bugQuestion, 'Line 3').correct === true, 'Find bug formatted text "Line 3"');
  assert(AnswerChecker.check(bugQuestion, 'line 3').correct === true, 'Find bug case-insensitive "line 3"');
  assert(AnswerChecker.check(bugQuestion, 2).correct === false, 'Rejects incorrect line number');
  assert(AnswerChecker.check(bugQuestion, 99).correct === false, 'Rejects out of bounds line number');
  assert(AnswerChecker.check(bugQuestion, 'garbage').correct === false, 'Rejects non-numeric garbage text');

  // --- 4. Complete / Fill Code Evaluation ---
  console.log('\n--- 4. Complete / Fill Code Evaluation ---');
  const fillQuestion = {
    type: 'fill_code',
    code: "int* ptr = _______<int>(10);",
    correctAnswer: "make_unique",
    acceptedAnswers: ["make_unique", "std::make_unique"]
  };

  assert(AnswerChecker.check(fillQuestion, 'make_unique').correct === true, 'Fill code exact token match');
  assert(AnswerChecker.check(fillQuestion, '  make_unique  ').correct === true, 'Fill code trimmed token');
  assert(AnswerChecker.check(fillQuestion, 'std::make_unique').correct === true, 'Fill code accepted qualified alternative');
  assert(AnswerChecker.check(fillQuestion, 'make_shared').correct === false, 'Fill code incorrect token');
  assert(AnswerChecker.check(fillQuestion, '').correct === false, 'Fill code empty string rejection');

  // --- 5. Robustness & Error Handling ---
  console.log('\n--- 5. Defensive Edge Cases & Robustness ---');
  assert(AnswerChecker.check(null, 'foo').correct === false, 'Handles null question gracefully without throwing');
  assert(AnswerChecker.check({}, 'foo').correct === false, 'Handles empty question object gracefully');
  assert(AnswerChecker.check(mcQuestion, undefined).correct === false, 'Handles undefined submission gracefully');

  console.log('\n------------------------------------------------------------');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('------------------------------------------------------------\n');

  return { passed, failed, results };
}

// Direct CLI execution support
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('answer-checker-tests.js')) {
  runAnswerCheckerTests().then(res => {
    if (res.failed > 0) process.exit(1);
  });
}
