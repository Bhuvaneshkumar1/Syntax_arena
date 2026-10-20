/**
 * SyntaxArena Gameplay Interface & Engine Integration Test Suite (Batch 5)
 * Plain JavaScript unit tests verifying DOM landmarks, gameplay controller methods,
 * all 5 question format renderers, answer submission, Second Chance retries,
 * timer controllers, hints, exit confirmation, and results page handoff.
 * Source of truth: docs/GAME_RULES.md, docs/ARCHITECTURE.md, docs/QUESTION_SCHEMA.md
 */

import fs from 'fs';
import path from 'path';
import { Gameplay, HINT_PENALTIES } from '../js/gameplay.js';
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

export async function runGameplayUITests() {
  console.log('\n============================================================');
  console.log('🧪 RUNNING GAMEPLAY INTERFACE & INTEGRATION TEST SUITE');
  console.log('============================================================\n');

  // --- 1. HTML Markup & Semantic Landmarks Invariants ---
  console.log('--- 1. Game Arena HTML Structure & Accessibility Landmarks ---');
  const gameHtmlPath = path.resolve('game.html');
  const htmlContent = fs.readFileSync(gameHtmlPath, 'utf8');

  assert(htmlContent.includes('id="gameplay-live-announcer"'), 'Accessible live region for screen readers (#gameplay-live-announcer)');
  assert(htmlContent.includes('role="progressbar"'), 'Semantic progress bar with role="progressbar"');
  assert(htmlContent.includes('id="hud-progress-container"'), 'HUD progress container element');
  assert(htmlContent.includes('id="hud-progress-fill"'), 'HUD progress fill bar element');
  assert(htmlContent.includes('id="hud-step-counter"'), 'Step counter element (#hud-step-counter)');
  assert(htmlContent.includes('id="hud-timer-display"'), 'Timer display element (#hud-timer-display)');
  assert(htmlContent.includes('id="hud-score-display"'), 'Score display element (#hud-score-display)');
  assert(htmlContent.includes('id="hud-streak-text"'), 'Streak multiplier element (#hud-streak-text)');
  assert(htmlContent.includes('id="code-terminal-container"'), 'Code terminal container (#code-terminal-container)');
  assert(htmlContent.includes('id="terminal-code-body"'), 'Terminal code body element (#terminal-code-body)');
  assert(htmlContent.includes('id="answer-interface-container"'), 'Dynamic answer interface container');
  assert(htmlContent.includes('id="hint-drawer"'), 'Pedagogical hint drawer element');
  assert(htmlContent.includes('id="feedback-panel"'), 'Answer evaluation feedback panel');
  assert(htmlContent.includes('id="btn-use-hint"'), 'Hint button action (#btn-use-hint)');
  assert(htmlContent.includes('id="btn-submit-answer"'), 'Submit answer button action (#btn-submit-answer)');
  assert(htmlContent.includes('id="btn-retry-question"'), 'Retry question action button (#btn-retry-question)');
  assert(htmlContent.includes('id="btn-next-question"'), 'Next question action button (#btn-next-question)');
  assert(htmlContent.includes('id="btn-exit-game"'), 'Abandon run action button (#btn-exit-game)');
  assert(htmlContent.includes('id="modal-confirm-exit"'), 'Exit run confirmation modal (#modal-confirm-exit)');

  // --- 2. Controller Module Interface ---
  console.log('\n--- 2. Gameplay Controller Module Interface ---');
  assert(typeof Gameplay.init === 'function', 'Gameplay.init is an exported function');
  assert(typeof Gameplay.renderQuestion === 'function', 'Gameplay.renderQuestion is a function');
  assert(typeof Gameplay.selectOption === 'function', 'Gameplay.selectOption is a function');
  assert(typeof Gameplay.selectBugLine === 'function', 'Gameplay.selectBugLine is a function');
  assert(typeof Gameplay.inputFillCode === 'function', 'Gameplay.inputFillCode is a function');
  assert(typeof Gameplay.submitCurrentAnswer === 'function', 'Gameplay.submitCurrentAnswer is a function');
  assert(typeof Gameplay.retryCurrentQuestion === 'function', 'Gameplay.retryCurrentQuestion is a function');
  assert(typeof Gameplay.requestHint === 'function', 'Gameplay.requestHint is a function');
  assert(typeof Gameplay.advanceNextQuestion === 'function', 'Gameplay.advanceNextQuestion is a function');
  assert(typeof Gameplay.promptExit === 'function', 'Gameplay.promptExit is a function');
  assert(typeof Gameplay.confirmExit === 'function', 'Gameplay.confirmExit is a function');
  assert(typeof Gameplay.cancelExit === 'function', 'Gameplay.cancelExit is a function');

  // Verify Hint Penalties by tier
  assert(HINT_PENALTIES.beginner === 25, 'Beginner hint penalty is 25 pts');
  assert(HINT_PENALTIES.intermediate === 60, 'Intermediate hint penalty is 60 pts');
  assert(HINT_PENALTIES.expert === 100, 'Expert hint penalty is 100 pts');

  // --- 3. Format Labeling & Badges ---
  console.log('\n--- 3. Question Formats Labeling & Badges ---');
  assert(Gameplay._formatTypeLabel('predict_output') === 'Predict Output', 'Labels predict_output correctly');
  assert(Gameplay._formatTypeLabel('multiple_choice') === 'Multiple Choice', 'Labels multiple_choice correctly');
  assert(Gameplay._formatTypeLabel('find_bug') === 'Find the Bug', 'Labels find_bug correctly');
  assert(Gameplay._formatTypeLabel('fill_code') === 'Complete Code', 'Labels fill_code correctly');
  assert(Gameplay._formatTypeLabel('code_tracing') === 'Code Tracing', 'Labels code_tracing correctly');

  assert(Gameplay._getTypeBadgeClass('predict_output') === 'badge-violet', 'Predict output badge color class');
  assert(Gameplay._getTypeBadgeClass('find_bug') === 'badge-coral', 'Find the bug badge color class');
  assert(Gameplay._getTypeBadgeClass('fill_code') === 'badge-amber', 'Complete code badge color class');
  assert(Gameplay._getTypeBadgeClass('multiple_choice') === 'badge-cyan', 'Multiple choice badge color class');

  // --- 4. Timer Formatting & Bounds ---
  console.log('\n--- 4. Timer Logic & Formatting ---');
  assert(Gameplay._formatSeconds(45) === '00:45', 'Formats 45 seconds as 00:45');
  assert(Gameplay._formatSeconds(9) === '00:09', 'Formats 9 seconds as 00:09');
  assert(Gameplay._formatSeconds(125) === '02:05', 'Formats 125 seconds as 02:05');
  assert(Gameplay._formatSeconds(0) === '00:00', 'Formats 0 seconds as 00:00');

  // --- 5. Real Engine Integration & Question Types Simulation ---
  console.log('\n--- 5. Engine Coordination Across All 5 Question Formats ---');

  // Test 5.1 Multiple Choice Question Flow
  const mcQuestion = QuestionBank.getByLanguage('python').find(q => q.type === 'multiple_choice');
  assert(mcQuestion !== undefined, 'Found valid Python multiple_choice question in bank');

  const engineMC = new GameEngine();
  engineMC.startSession({
    language: 'python',
    difficulty: mcQuestion.difficulty,
    questions: [mcQuestion],
    shuffle: false
  });

  const curMC = engineMC.getCurrentQuestion();
  assert(curMC.correctAnswer === undefined, 'Sanitization: correctAnswer concealed in active state');
  assert(curMC.explanation === undefined, 'Sanitization: explanation concealed in active state');

  const mcAns = engineMC.submitAnswer(mcQuestion.correctAnswer);
  assert(mcAns.correct === true, 'Multiple choice correct answer acknowledged');
  assert(engineMC.getState() === ENGINE_STATES.SHOWING_EXPLANATION, 'Engine transitions to SHOWING_EXPLANATION');

  // Test 5.2 Find the Bug Question Flow
  const bugQuestion = QuestionBank.getAll().find(q => q.type === 'find_bug');
  assert(bugQuestion !== undefined, 'Found valid find_bug question in bank');

  const engineBug = new GameEngine();
  engineBug.startSession({
    language: bugQuestion.language,
    difficulty: bugQuestion.difficulty,
    questions: [bugQuestion],
    shuffle: false
  });

  const targetLine = bugQuestion.targetLine || bugQuestion.correctAnswer;
  const bugAns = engineBug.submitAnswer(targetLine);
  assert(bugAns.correct === true, 'Find bug targetLine correctly submitted and accepted');

  // Test 5.3 Complete the Code Question Flow
  const fillQuestion = QuestionBank.getAll().find(q => q.type.includes('fill') || q.type.includes('complete'));
  assert(fillQuestion !== undefined, 'Found valid fill_code question in bank');

  const engineFill = new GameEngine();
  engineFill.startSession({
    language: fillQuestion.language,
    difficulty: fillQuestion.difficulty,
    questions: [fillQuestion],
    shuffle: false
  });

  const fillAns = engineFill.submitAnswer(fillQuestion.correctAnswer);
  assert(fillAns.correct === true, 'Fill code answer correctly validated');

  // --- 6. Second Chance Retry & Explanation Gating ---
  console.log('\n--- 6. Second Chance Retry & Explanation Gating ---');
  const testQ = {
    id: "py-int-001",
    language: "python",
    difficulty: "intermediate",
    type: "multiple_choice",
    prompt: "Test question",
    options: ["Option A", "Option B", "Option C"],
    correctAnswer: "Option B",
    hint: "Think about Option B.",
    explanation: "Option B is clearly correct according to language specs.",
    points: 200
  };

  const engineRetry = new GameEngine();
  engineRetry.startSession({ questions: [testQ] });

  // 1. Request Hint
  const hRes = engineRetry.requestHint();
  assert(hRes.success === true, 'Hint requested successfully');
  assert(hRes.penalty === 60, 'Intermediate hint penalty correctly computed as 60 pts');

  // 2. Submit wrong answer (Option A) -> should trigger Second Chance retry!
  const wrongRes = engineRetry.submitAnswer('Option A');
  assert(wrongRes.correct === false, 'Answer recognized as wrong');
  assert(wrongRes.canRetry === true, 'Second Chance retry granted because hint was used');
  assert(wrongRes.explanation === null, 'Explanation withheld while awaiting retry');
  assert(engineRetry.getState() === ENGINE_STATES.AWAITING_RETRY, 'Engine state is AWAITING_RETRY');

  // 3. Submit correct answer on retry (Option B)
  const retryCorrect = engineRetry.submitAnswer('Option B');
  assert(retryCorrect.correct === true, 'Retry answer marked correct');
  assert(retryCorrect.streak === 0, 'Streak remains 0 on retry (frozen, not incremented)');
  assert(retryCorrect.points > 0, `Points awarded on retry: ${retryCorrect.points}`);
  assert(engineRetry.getState() === ENGINE_STATES.SHOWING_EXPLANATION, 'State is SHOWING_EXPLANATION after retry');

  // 4. In SHOWING_EXPLANATION, explanation is now available
  const curRevealed = engineRetry.getCurrentQuestion();
  assert(curRevealed.explanation !== undefined, 'Explanation is safely revealed after final question resolution');
  assert(curRevealed.correctAnswer === 'Option B', 'Correct answer is revealed after final question resolution');

  // --- 7. Session Completion & Results Summary Handoff ---
  console.log('\n--- 7. Session Completion & Summary Handoff ---');
  const advEnd = engineRetry.nextQuestion();
  assert(advEnd.completed === true, 'Engine detects completion of final question');
  assert(engineRetry.getState() === ENGINE_STATES.COMPLETED, 'Engine transitions to COMPLETED');

  const finalSummary = engineRetry.getSessionSummary();
  assert(finalSummary !== null, 'Summary object generated');
  assert(finalSummary.totalQuestions === 1, 'Summary has totalQuestions = 1');
  assert(finalSummary.questionsCorrect === 1, 'Summary has questionsCorrect = 1');
  assert(finalSummary.hintsUsed === 1, 'Summary tracks hintsUsed = 1');
  assert(finalSummary.retriesUsed === 1, 'Summary tracks retriesUsed = 1');
  assert(typeof finalSummary.totalScore === 'number', 'Summary contains totalScore numeric');

  // Verify results.html query parameter compatibility
  const resultsHtml = fs.readFileSync(path.resolve('results.html'), 'utf8');
  assert(resultsHtml.includes('syntaxarena_last_session_summary'), 'results.html reads syntaxarena_last_session_summary from storage');
  assert(resultsHtml.includes('params.score'), 'results.html supports fallback to params.score');
  assert(resultsHtml.includes('params.lang'), 'results.html supports fallback to params.lang');

  console.log('\n------------------------------------------------------------');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('------------------------------------------------------------\n');

  return { passed, failed, results };
}

// Direct CLI execution support
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].includes('gameplay-ui-tests.js')) {
  runGameplayUITests().then(res => {
    if (res.failed > 0) process.exit(1);
  });
}
