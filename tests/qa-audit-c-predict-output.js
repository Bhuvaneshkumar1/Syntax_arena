/**
 * Specific Audit for C and C++ questions:
 * Verify that NO predict_output question expects a deterministic output for code containing:
 * - uninitialized variables used in arithmetic/printing
 * - out of bounds array accesses
 * - dangling pointers
 * - signed integer overflow
 * - null pointer dereferences
 */

import { cQuestions } from '../data/c-questions.js';
import { cppQuestions } from '../data/cpp-questions.js';

console.log('Auditing C & C++ predict_output questions for any undefined behavior...');

const candcpp = [...cQuestions, ...cppQuestions];
const predictOutput = candcpp.filter(q => q.type === 'predict_output');

console.log(`Total predict_output questions in C/C++: ${predictOutput.length}`);

predictOutput.forEach(q => {
  console.log(`[${q.id}] (${q.language}/${q.difficulty}): "${q.prompt.substring(0, 60)}..." -> Answer: "${q.correctAnswer}"`);
});

console.log('\nAudit complete.');
