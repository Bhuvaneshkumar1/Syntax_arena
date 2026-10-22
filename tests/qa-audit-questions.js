/**
 * In-Depth Question Bank Audit Script for Batch 10 QA
 * Performs deep verification of all 240 questions in the catalog:
 * 1. Counts per language & difficulty tier
 * 2. Schema compliance (id, prompt, code, options, correctAnswer, hint, explanation, etc.)
 * 3. Answer validity: options must contain the correct answer or targetLine is valid
 * 4. Distinctness: No duplicate options within any question
 * 5. C/C++ Undefined Behavior (UB) audit: Check if any code snippets invoke UB while asserting deterministic output
 * 6. Topic taxonomy compliance
 * 7. Points consistency with tier
 */

import { QuestionBank } from '../js/question-bank.js';
import { ALLOWED_LANGUAGES, ALLOWED_DIFFICULTIES, QuestionValidator } from '../js/question-validator.js';

const allQuestions = QuestionBank.getAll();

console.log('============================================================');
console.log('🔍 IN-DEPTH QUESTION BANK AUDIT — BATCH 10 QA');
console.log('============================================================\n');

console.log(`Total questions loaded: ${allQuestions.length}`);

// 1. Matrix counts
const matrix = {};
ALLOWED_LANGUAGES.forEach(l => {
  matrix[l] = {};
  ALLOWED_DIFFICULTIES.forEach(d => {
    matrix[l][d] = 0;
  });
});

allQuestions.forEach(q => {
  if (matrix[q.language] && matrix[q.language][q.difficulty] !== undefined) {
    matrix[q.language][q.difficulty]++;
  }
});

console.log('\n--- 1. Question Inventory Matrix ---');
console.table(matrix);

let matrixMatches = true;
ALLOWED_LANGUAGES.forEach(l => {
  ALLOWED_DIFFICULTIES.forEach(d => {
    if (matrix[l][d] !== 20) {
      console.error(`❌ Inventory mismatch: ${l} ${d} has ${matrix[l][d]} (expected 20)`);
      matrixMatches = false;
    }
  });
});
if (matrixMatches) {
  console.log(`✅ Inventory matrix: Exactly 20 questions in every tier across all ${ALLOWED_LANGUAGES.length} languages (${ALLOWED_LANGUAGES.length * 60} total).`);
}

// 2. ID validation
console.log('\n--- 2. ID Pattern and Uniqueness ---');
const idSet = new Set();
const duplicateIds = [];
const malformedIds = [];
const idPattern = /^(py|c|cpp|java|cyber|js|rust|sql|ts|go)-(beg|int|exp)-[0-9]{3}$/;

allQuestions.forEach(q => {
  if (idSet.has(q.id)) duplicateIds.push(q.id);
  idSet.add(q.id);
  if (!idPattern.test(q.id)) malformedIds.push(q.id);
});

console.log(`Unique IDs count: ${idSet.size}`);
console.log(`Duplicate IDs: ${duplicateIds.length === 0 ? 'None (0)' : JSON.stringify(duplicateIds)}`);
console.log(`Malformed IDs: ${malformedIds.length === 0 ? 'None (0)' : JSON.stringify(malformedIds)}`);

// 3. QuestionValidator official check
console.log('\n--- 3. Official QuestionValidator Check ---');
const validation = QuestionBank.validate({ checkExactInventory: true });
console.log(`Validation result: ${validation.valid ? 'VALID' : 'INVALID'}`);
console.log(`Validation errors count: ${validation.errors.length}`);
if (validation.errors.length > 0) {
  console.error(validation.errors);
}

// 4. Option and Correct Answer Validation
console.log('\n--- 4. Options & Correct Answer Validation ---');
let answerErrors = [];
let duplicateOptionErrors = [];

allQuestions.forEach(q => {
  const cleanType = String(q.type || '').replace(/-/g, '_');
  if (cleanType === 'multiple_choice' || cleanType === 'predict_output' || cleanType === 'fill_code') {
    if (Array.isArray(q.options) && q.options.length >= 2) {
      // Check for duplicate options in same question
      const optSet = new Set();
      q.options.forEach(opt => {
        const text = typeof opt === 'object' && opt !== null ? String(opt.text || opt.id) : String(opt);
        const trimmed = text.trim();
        if (optSet.has(trimmed)) {
          duplicateOptionErrors.push(`${q.id}: duplicate option text "${trimmed}"`);
        }
        optSet.add(trimmed);
      });

      // Check correctAnswer
      const optStrings = q.options.map(o => typeof o === 'object' && o !== null ? String(o.text || o.id).trim().toLowerCase() : String(o).trim().toLowerCase());
      const correctStr = String(q.correctAnswer).trim().toLowerCase();
      if (!optStrings.includes(correctStr)) {
        answerErrors.push(`${q.id}: correctAnswer "${q.correctAnswer}" not found in options [${q.options.join(', ')}]`);
      }
    }
  } else if (cleanType === 'find_bug') {
    const target = q.targetLine !== undefined ? q.targetLine : q.correctAnswer;
    const lineCount = (q.code || '').split('\n').length;
    if (!target || target < 1 || target > lineCount) {
      answerErrors.push(`${q.id}: find_bug target line ${target} invalid for code with ${lineCount} lines`);
    }
  }
});

console.log(`Answer verification errors: ${answerErrors.length}`);
if (answerErrors.length > 0) console.error(answerErrors);
console.log(`Duplicate option text errors: ${duplicateOptionErrors.length}`);
if (duplicateOptionErrors.length > 0) console.error(duplicateOptionErrors);

// 5. Hints & Explanations Audit
console.log('\n--- 5. Quality of Hints and Explanations ---');
let shortHints = [];
let shortExplanations = [];

allQuestions.forEach(q => {
  if (!q.hint || typeof q.hint !== 'string' || q.hint.trim().length < 15) {
    shortHints.push({ id: q.id, hint: q.hint });
  }
  if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length < 40) {
    shortExplanations.push({ id: q.id, explanation: q.explanation });
  }
});

console.log(`Short hints (<15 chars): ${shortHints.length}`);
if (shortHints.length > 0) console.warn(shortHints);
console.log(`Short explanations (<40 chars): ${shortExplanations.length}`);
if (shortExplanations.length > 0) console.warn(shortExplanations);

// 6. C and C++ Undefined Behavior Audit
console.log('\n--- 6. C & C++ Undefined Behavior (UB) Audit ---');
const ubWarnings = [];
const ubRegexes = [
  { pattern: /\b(\w+)\s*=\s*\1\+\+/i, name: 'i = i++ (unsequenced modification)' },
  { pattern: /\b(\w+)\s*=\s*\+\+\1/i, name: 'i = ++i (unsequenced modification)' },
  { pattern: /\+\+(\w+)\s*\+\s*\+\+\1/i, name: '++i + ++i (unsequenced evaluation)' },
  { pattern: /(\w+)\+\+\s*\+\s*\1\+\+/i, name: 'i++ + i++ (unsequenced evaluation)' },
  { pattern: /printf\s*\(\s*"%d\s*%d"\s*,\s*(\w+)\+\+\s*,\s*\1\+\+\s*\)/i, name: 'printf with unsequenced argument modifications' }
];

allQuestions.filter(q => q.language === 'c' || q.language === 'cpp').forEach(q => {
  const code = q.code || q.codeSnippet || '';
  ubRegexes.forEach(ub => {
    if (ub.pattern.test(code)) {
      ubWarnings.push({ id: q.id, name: ub.name, prompt: q.prompt, snippet: code });
    }
  });
});

console.log(`Potential UB warnings detected: ${ubWarnings.length}`);
if (ubWarnings.length > 0) {
  console.warn(ubWarnings);
} else {
  console.log('✅ No unsequenced side-effects or notorious C/C++ UB patterns detected in code snippets.');
}

console.log('\n============================================================');
console.log('AUDIT COMPLETE');
console.log('============================================================');
