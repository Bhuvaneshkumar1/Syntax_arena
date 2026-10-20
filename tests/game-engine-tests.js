/**
 * SyntaxArena Game Engine Test Suite (Batch 4)
 * Comprehensive unit tests for state machine transitions, session lifecycle,
 * scoring formulas, hints, retries, progression guards, and summary generation.
 * Source of truth: docs/GAME_RULES.md & docs/ARCHITECTURE.md
 */

import { GameEngine, ENGINE_STATES } from '../js/game-engine.js';
import { QuestionBank } from '../js/question-bank.js';

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

export async function runGameEngineTests() {
  console.log('\n============================================================');
  console.log('🧪 RUNNING GAME ENGINE TEST SUITE');
  console.log('============================================================\n');

  // Sample test questions for isolated, deterministic engine testing
  const sampleQuestions = [
    {
      id: "py-beg-001",
      language: "python",
      difficulty: "beginner",
      type: "predict_output",
      prompt: "What is printed?",
      options: ["4 4", "3 3", "3 4"],
      correctAnswer: "4 4",
      acceptedAnswers: ["4 4"],
      hint: "List assignment creates an alias, not a shallow copy.",
      explanation: "Both variables reference the identical underlying list instance.",
      points: 100
    },
    {
      id: "py-beg-002",
      language: "python",
      difficulty: "beginner",
      type: "multiple_choice",
      prompt: "Which type is immutable?",
      options: ["tuple", "list", "dict", "set"],
      correctAnswer: "tuple",
      acceptedAnswers: ["tuple", "a"],
      hint: "Tuples cannot be mutated after creation.",
      explanation: "Tuples are immutable sequence types in Python.",
      points: 100
    },
    {
      id: "py-beg-003",
      language: "python",
      difficulty: "beginner",
      type: "predict_output",
      prompt: "What is type(3 / 2)?",
      options: ["float", "int", "decimal"],
      correctAnswer: "float",
      acceptedAnswers: ["float"],
      hint: "True division always returns a float.",
      explanation: "In Python 3, single slash / always performs true floating-point division.",
      points: 100
    }
  ];

  // --- 1. Session Initialization & Config Validation ---
  console.log('--- 1. Session Initialization & Config Validation ---');
  const engine = new GameEngine();
  assert(engine.getState() === ENGINE_STATES.IDLE, 'Initial engine state is IDLE');

  let throwsOnEmpty = false;
  try {
    engine.startSession({ questions: [] });
  } catch (e) {
    throwsOnEmpty = true;
  }
  assert(throwsOnEmpty, 'startSession throws error on empty questions array');

  const q1 = engine.startSession({
    language: 'python',
    difficulty: 'beginner',
    questions: sampleQuestions,
    shuffle: false
  });

  assert(engine.getState() === ENGINE_STATES.ACTIVE, 'Engine transitions to ACTIVE on startSession');
  assert(q1.id === 'py-beg-001', 'First question is py-beg-001');
  assert(q1.correctAnswer === undefined, 'Sanitization: correctAnswer is hidden in ACTIVE state');
  assert(q1.explanation === undefined, 'Sanitization: explanation is hidden in ACTIVE state');

  // --- 2. Correct Answer Progression & Scoring ---
  console.log('\n--- 2. Correct Answer Flow & Scoring ---');
  // Submit correct answer with 5 seconds remaining
  const ans1 = engine.submitAnswer('4 4', 5);
  assert(ans1.correct === true, 'Answer marked correct');
  assert(engine.getState() === ENGINE_STATES.SHOWING_EXPLANATION, 'Transitions to SHOWING_EXPLANATION upon correct answer');
  assert(ans1.points > 100, `Awards base points + speed bonus (Total: ${ans1.points})`);
  assert(ans1.streak === 1, 'Current streak incremented to 1');

  // In SHOWING_EXPLANATION state, correctAnswer and explanation should be revealed
  const q1Revealed = engine.getCurrentQuestion();
  assert(q1Revealed.correctAnswer === '4 4', 'correctAnswer revealed in SHOWING_EXPLANATION');
  assert(q1Revealed.explanation !== undefined, 'explanation revealed in SHOWING_EXPLANATION');

  // Duplicate submission attempt while in SHOWING_EXPLANATION
  let duplicatePrevented = false;
  try {
    engine.submitAnswer('4 4');
  } catch (e) {
    duplicatePrevented = true;
  }
  assert(duplicatePrevented, 'Engine rejects duplicate submission in SHOWING_EXPLANATION state');

  // Advance to next question
  const adv1 = engine.nextQuestion();
  assert(adv1.advanced === true, 'Advanced to next question');
  assert(adv1.completed === false, 'Session not completed yet');
  assert(engine.getState() === ENGINE_STATES.ACTIVE, 'Engine returns to ACTIVE state');
  assert(adv1.question.id === 'py-beg-002', 'Now on second question (py-beg-002)');

  // --- 3. Hint Usage & Second Chance Retry Flow ---
  console.log('\n--- 3. Hint Usage & Second Chance Retry Flow ---');
  // Request a hint
  const hintRes = engine.requestHint();
  assert(hintRes.success === true, 'Hint successfully unlocked');
  assert(hintRes.penalty === 25, 'Beginner hint incurs -25 penalty');
  assert(engine.getCurrentQuestion().hasUsedHint === true, 'Question reflects hasUsedHint: true');

  // Requesting hint a second time on same question
  const duplicateHint = engine.requestHint();
  assert(duplicateHint.penalty === 0, 'Duplicate hint request on same question incurs 0 extra penalty');

  // Submit incorrect answer: since hint was used, player receives Second Chance retry!
  const wrongAns1 = engine.submitAnswer('list');
  assert(wrongAns1.correct === false, 'Answer recognized as incorrect');
  assert(wrongAns1.canRetry === true, 'Second Chance retry unlocked because hint was active');
  assert(engine.getState() === ENGINE_STATES.AWAITING_RETRY, 'Engine transitions to AWAITING_RETRY');
  assert(wrongAns1.explanation === null, 'Explanation withheld while awaiting retry');

  // Submit correct answer on retry!
  const retryAns = engine.submitAnswer('tuple');
  assert(retryAns.correct === true, 'Retry answer is correct');
  assert(engine.getState() === ENGINE_STATES.SHOWING_EXPLANATION, 'Transitions to SHOWING_EXPLANATION');
  // Retry earns 50% base points (50) - hint penalty (25) = 25 points minimum base
  assert(retryAns.points > 0, `Points awarded on retry (points: ${retryAns.points})`);
  // Retry freezes streak (streak remains 1, not incremented to 2, not reset to 0)
  assert(retryAns.streak === 1, 'Streak is frozen (maintained at 1) on retry');

  // Advance to question 3
  const adv2 = engine.nextQuestion();
  assert(adv2.question.id === 'py-beg-003', 'Now on third question (py-beg-003)');

  // --- 4. Outright Incorrect Answer (No Hint -> No Retry) ---
  console.log('\n--- 4. Incorrect Answer Without Hint ---');
  // Submit incorrect answer without asking for hint first
  const wrongAns2 = engine.submitAnswer('int');
  assert(wrongAns2.correct === false, 'Answer recognized as incorrect');
  assert(wrongAns2.canRetry === false, 'No retry granted because hint was not active');
  assert(engine.getState() === ENGINE_STATES.SHOWING_EXPLANATION, 'Transitions immediately to SHOWING_EXPLANATION');
  assert(wrongAns2.streak === 0, 'Streak resets to 0 upon failure');
  assert(wrongAns2.points === 0, 'Zero points awarded for incorrect answer');

  // --- 5. Session Completion & Final Summary ---
  console.log('\n--- 5. Session Completion & Final Summary ---');
  // Advance from question 3 (last question in session)
  const finalAdv = engine.nextQuestion();
  assert(finalAdv.advanced === false, 'Cannot advance beyond final question');
  assert(finalAdv.completed === true, 'Session marked completed');
  assert(engine.getState() === ENGINE_STATES.COMPLETED, 'Engine transitions to COMPLETED');

  // Verify cannot submit after completion
  let submitAfterDone = false;
  try {
    engine.submitAnswer('float');
  } catch (e) {
    submitAfterDone = true;
  }
  assert(submitAfterDone, 'Engine rejects submissions in COMPLETED state');

  const summary = engine.getSessionSummary();
  assert(summary.totalQuestions === 3, 'Summary totalQuestions is 3');
  assert(summary.correctCount === 2, 'Summary correctCount is 2 (q1 and q2 on retry)');
  assert(summary.incorrectCount === 1, 'Summary incorrectCount is 1 (q3)');
  assert(summary.accuracy === 67, 'Summary accuracy is 67%');
  assert(summary.hintsUsed === 1, 'Summary hintsUsed is 1');
  assert(summary.retriesUsed === 1, 'Summary retriesUsed is 1');
  assert(summary.totalScore > 0, `Summary totalScore recorded: ${summary.totalScore}`);

  // --- 6. Integration: Full 20-Question Pool Shuffling & ID Uniqueness ---
  console.log('\n--- 6. Integration: QuestionBank Shuffling & Pool Session ---');
  const poolQuestions = QuestionBank.getByDifficulty('java', 'beginner');
  assert(poolQuestions.length === 20, 'Retrieved 20 Java beginner questions');

  const sessionEngine = new GameEngine();
  sessionEngine.startSession({
    language: 'java',
    difficulty: 'beginner',
    questions: poolQuestions,
    shuffle: true
  });

  const sessionQIds = sessionEngine.getSession().questions.map(q => q.id);
  const uniqueSessionIds = new Set(sessionQIds);
  assert(sessionQIds.length === 20, 'Session has 20 questions');
  assert(uniqueSessionIds.size === 20, 'No duplicate question IDs in active session');

  console.log('\n------------------------------------------------------------');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('------------------------------------------------------------\n');

  return { passed, failed, results };
}

// Direct CLI execution support
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('game-engine-tests.js')) {
  runGameEngineTests().then(res => {
    if (res.failed > 0) process.exit(1);
  });
}
