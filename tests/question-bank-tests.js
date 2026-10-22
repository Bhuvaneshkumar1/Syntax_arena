/**
 * SyntaxArena Question Bank Test Suite (Batch 4)
 * Plain JavaScript test suite verifying schema invariants, inventory counts,
 * pedagogical rules, unique identifiers, and immutability guarantees.
 * Source of truth: docs/QUESTION_SCHEMA.md & docs/GAME_RULES.md
 */

import { QuestionBank } from '../js/question-bank.js';
import { QuestionValidator, ALLOWED_LANGUAGES, ALLOWED_DIFFICULTIES } from '../js/question-validator.js';

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

export async function runQuestionBankTests() {
  console.log('\n============================================================');
  console.log('🧪 RUNNING QUESTION BANK TEST SUITE');
  console.log('============================================================\n');

  // Test 1: Complete Catalog Validation via QuestionValidator
  console.log('--- 1. QuestionValidator Integrity Check ---');
  const validation = QuestionBank.validate({ checkExactInventory: true });
  assert(validation.valid === true, 'Catalog passes QuestionValidator without errors', JSON.stringify(validation.errors));
  assert(validation.errors.length === 0, 'Zero validation errors recorded', `Found ${validation.errors.length} errors`);

  // Test 2: Inventory Count Matrix
  console.log('\n--- 2. Question Inventory & Quota Verification ---');
  const all = QuestionBank.getAll();
  const expectedTotal = ALLOWED_LANGUAGES.length * 60;
  assert(all.length === expectedTotal, `Master catalog contains exactly ${expectedTotal} questions`, `Actual count: ${all.length}`);

  ALLOWED_LANGUAGES.forEach(lang => {
    const langQuestions = QuestionBank.getByLanguage(lang);
    assert(langQuestions.length === 60, `Language '${lang}' contains exactly 60 questions`, `Actual: ${langQuestions.length}`);

    ALLOWED_DIFFICULTIES.forEach(diff => {
      const tierQuestions = QuestionBank.getByDifficulty(lang, diff);
      assert(tierQuestions.length === 20, `Language '${lang}' tier '${diff}' contains exactly 20 questions`, `Actual: ${tierQuestions.length}`);
    });
  });

  // Test 3: Unique ID Uniqueness & Pattern
  console.log('\n--- 3. Identifier Integrity & Uniqueness ---');
  const seenIds = new Set();
  let duplicateCount = 0;
  const idPattern = /^(py|c|cpp|java|python|cyber|js|javascript|rust|sql|ts|typescript|go|html)-(beg|int|exp)-[0-9]{3}$/;
  let invalidPatternCount = 0;

  all.forEach(q => {
    if (seenIds.has(q.id)) duplicateCount++;
    seenIds.add(q.id);
    if (!idPattern.test(q.id)) invalidPatternCount++;
  });

  assert(duplicateCount === 0, 'All question IDs are completely unique', `Duplicate count: ${duplicateCount}`);
  assert(invalidPatternCount === 0, 'All question IDs conform to standard regex format', `Invalid format count: ${invalidPatternCount}`);

  // Test 4: Format-Specific Answer & Content Validation
  console.log('\n--- 4. Question Formats & Pedagogical Rules ---');
  const typeCounts = QuestionBank.getStats().byType;
  console.log('  Question types breakdown:', typeCounts);

  assert(typeCounts.multiple_choice > 0, 'Includes Multiple Choice questions');
  assert(typeCounts.predict_output > 0, 'Includes Predict Output questions');
  assert(typeCounts.find_bug > 0, 'Includes Find the Bug questions');
  assert(typeCounts.fill_code > 0, 'Includes Fill / Complete Code questions');

  let emptyHints = 0;
  let emptyExplanations = 0;
  let pointsMismatch = 0;

  all.forEach(q => {
    if (!q.hint || q.hint.trim().length < 10) emptyHints++;
    if (!q.explanation || q.explanation.trim().length < 30) emptyExplanations++;

    const expectedPts = q.difficulty === 'beginner' ? 100 : (q.difficulty === 'intermediate' ? 200 : 300);
    if (q.points !== expectedPts) pointsMismatch++;
  });

  assert(emptyHints === 0, 'Every question provides a meaningful conceptual hint (>= 10 chars)', `Violations: ${emptyHints}`);
  assert(emptyExplanations === 0, 'Every question provides a comprehensive pedagogical explanation (>= 30 chars)', `Violations: ${emptyExplanations}`);
  assert(pointsMismatch === 0, 'Points strictly follow tier points (Beg:100, Int:200, Exp:300)', `Mismatches: ${pointsMismatch}`);

  // Test 5: Question Immutability & Cloning
  console.log('\n--- 5. Repository Immutability Guarantee ---');
  const qOriginal = QuestionBank.getById('py-beg-001');
  assert(qOriginal !== null, 'getById retrieves py-beg-001');
  
  // Attempt to mutate the retrieved question object
  qOriginal.prompt = 'MUTATED PROMPT INVASION';
  qOriginal.points = 999999;
  
  const qVerify = QuestionBank.getById('py-beg-001');
  assert(qVerify.prompt !== 'MUTATED PROMPT INVASION', 'Mutating retrieved question does not alter internal master bank (Prompt protected)');
  assert(qVerify.points === 100, 'Master bank points remain pristine (Points protected)');

  console.log('\n------------------------------------------------------------');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('------------------------------------------------------------\n');

  return { passed, failed, results };
}

// Direct CLI execution support
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('question-bank-tests.js')) {
  runQuestionBankTests().then(res => {
    if (res.failed > 0) process.exit(1);
  });
}
