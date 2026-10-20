/**
 * SyntaxArena Analytics & Results Test Suite (Batch 7)
 * Comprehensive unit and integration verification for statistical calculations,
 * topic classifications, language/difficulty aggregations, historical trends,
 * recommendations engine, and retry-missed workflows.
 */

import { Analytics, TOPIC_THRESHOLDS, GRADE_THRESHOLDS } from '../js/analytics.js';
import { QuestionBank } from '../js/question-bank.js';
import { GameEngine, ENGINE_STATES } from '../js/game-engine.js';
import { Profile } from '../js/profile.js';
import { State } from '../js/state.js';
import { Gamification } from '../js/gamification.js';
import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
    failed++;
  }
}

export async function runAnalyticsTests() {
  console.log('\n============================================================');
  console.log('🧪 RUNNING BATCH 7: LEARNING ANALYTICS & RESULTS TEST SUITE');
  console.log('============================================================\n');

  // =========================================================================
  // 1. Accuracy Calculation & Grade Evaluation
  // =========================================================================
  console.log('--- 1. Accuracy & Grade Evaluation Rules ---');
  assert(Analytics.calculateAccuracy(5, 5) === 100, '5/5 answers is exactly 100%');
  assert(Analytics.calculateAccuracy(3, 4) === 75, '3/4 answers is exactly 75%');
  assert(Analytics.calculateAccuracy(1, 3) === 33, '1/3 answers rounds to 33%');
  assert(Analytics.calculateAccuracy(0, 5) === 0, '0/5 answers is exactly 0%');
  assert(Analytics.calculateAccuracy(0, 0) === 0, '0/0 attempted avoids division by zero, returns 0%');
  assert(Analytics.calculateAccuracy(-2, 5) === 0, 'Negative correct count safely clamped to 0%');

  const gradeS = Analytics.getGradeData(100);
  assert(gradeS.grade === 'S' && gradeS.colorVar.includes('primary'), '100% accuracy yields Grade S');

  const gradeA = Analytics.getGradeData(88);
  assert(gradeA.grade === 'A', '88% accuracy yields Grade A');

  const gradeB = Analytics.getGradeData(74);
  assert(gradeB.grade === 'B', '74% accuracy yields Grade B');

  const gradeC = Analytics.getGradeData(60);
  assert(gradeC.grade === 'C', '60% accuracy yields Grade C');

  const gradeF = Analytics.getGradeData(40);
  assert(gradeF.grade === 'F', '40% accuracy yields Grade F');

  const gradeTerm = Analytics.getGradeData(60, true);
  assert(gradeTerm.grade === 'TERM' && gradeTerm.title.includes('Terminated'), 'Hardcore 0 lives yields TERM grade');

  // =========================================================================
  // 2. Topic Mastery Classification & Thresholds
  // =========================================================================
  console.log('\n--- 2. Topic Classification & Sample Size Rules ---');
  assert(Analytics.classifyTopic(100, 1) === 'insufficient_data', 'Single correct answer (1/1) returns insufficient_data (< 2 attempts)');
  assert(Analytics.classifyTopic(0, 1) === 'insufficient_data', 'Single incorrect answer (0/1) returns insufficient_data (< 2 attempts)');
  assert(Analytics.classifyTopic(100, 2) === 'strong', '100% with 2 attempts qualifies as strong (>= 80%)');
  assert(Analytics.classifyTopic(80, 5) === 'strong', '80% with 5 attempts qualifies as strong');
  assert(Analytics.classifyTopic(79, 4) === 'developing', '79% with 4 attempts qualifies as developing (50-79%)');
  assert(Analytics.classifyTopic(50, 2) === 'developing', '50% with 2 attempts qualifies as developing');
  assert(Analytics.classifyTopic(49, 4) === 'needs_practice', '49% with 4 attempts qualifies as needs_practice (< 50%)');
  assert(Analytics.classifyTopic(0, 3) === 'needs_practice', '0% with 3 attempts qualifies as needs_practice');

  // =========================================================================
  // 3. Question Results Grouping by Topic
  // =========================================================================
  console.log('\n--- 3. Topic Grouping & Result Aggregations ---');
  const mockResults = [
    { questionId: 'py-01', topic: 'pointers', isCorrect: true, subtopic: 'dereferencing' },
    { questionId: 'py-02', topic: 'pointers', isCorrect: false, subtopic: 'pointer_math' },
    { questionId: 'py-03', topic: 'pointers', isCorrect: true, subtopic: 'double_pointers' },
    { questionId: 'py-04', topic: 'data_structures', isCorrect: false, subtopic: 'lists' },
    { questionId: 'py-05', topic: 'data_structures', isCorrect: false, subtopic: 'dictionaries' },
    { questionId: 'py-06', topic: 'memory', isCorrect: true, subtopic: 'heap' } // only 1 attempt
  ];

  const groupedTopics = Analytics.groupResultsByTopic(mockResults);
  assert(groupedTopics.length === 3, 'Groups 6 items into exactly 3 topics');

  const dsGroup = groupedTopics.find(t => t.topic === 'data_structures');
  assert(dsGroup && dsGroup.attempted === 2 && dsGroup.correct === 0 && dsGroup.accuracy === 0, 'data_structures topic: 2 attempted, 0 correct = 0%');
  assert(dsGroup && dsGroup.classification === 'needs_practice', 'data_structures classified as needs_practice');

  const ptrGroup = groupedTopics.find(t => t.topic === 'pointers');
  assert(ptrGroup && ptrGroup.attempted === 3 && ptrGroup.correct === 2 && ptrGroup.accuracy === 67, 'pointers topic: 3 attempted, 2 correct = 67%');
  assert(ptrGroup && ptrGroup.classification === 'developing', 'pointers classified as developing');

  const memGroup = groupedTopics.find(t => t.topic === 'memory');
  assert(memGroup && memGroup.attempted === 1 && memGroup.classification === 'insufficient_data', 'memory topic: 1 attempt classified as insufficient_data');

  assert(Analytics.groupResultsByTopic([]).length === 0, 'Empty results array returns empty topic list');
  assert(Analytics.groupResultsByTopic(null).length === 0, 'Null results returns empty topic list');

  // =========================================================================
  // 4. Language & Difficulty Career Aggregations
  // =========================================================================
  console.log('\n--- 4. Language & Difficulty Career Aggregations ---');
  const mockSessions = [
    {
      sessionId: 'sess-1',
      language: 'python',
      difficulty: 'beginner',
      questionsAttempted: 5,
      questionsCorrect: 5,
      totalScore: 1200,
      isCompleted: true,
      timestamp: 1000,
      results: [
        { topic: 'data_structures', isCorrect: true },
        { topic: 'data_structures', isCorrect: true },
        { topic: 'control_flow', isCorrect: true }
      ]
    },
    {
      sessionId: 'sess-2',
      language: 'python',
      difficulty: 'beginner',
      questionsAttempted: 5,
      questionsCorrect: 3,
      totalScore: 800,
      isCompleted: true,
      timestamp: 2000,
      results: [
        { topic: 'data_structures', isCorrect: true },
        { topic: 'control_flow', isCorrect: false },
        { topic: 'control_flow', isCorrect: false }
      ]
    },
    {
      sessionId: 'sess-3',
      language: 'c',
      difficulty: 'expert',
      questionsAttempted: 4,
      questionsCorrect: 4,
      totalScore: 1800,
      isCompleted: true,
      timestamp: 3000,
      results: [
        { topic: 'pointers', isCorrect: true },
        { topic: 'pointers', isCorrect: true }
      ]
    }
  ];

  const pyStats = Analytics.aggregateLanguageStats(mockSessions, 'python');
  assert(pyStats.hasData === true, 'Python stats hasData is true');
  assert(pyStats.totalSessions === 2, 'Python totalSessions is 2');
  assert(pyStats.questionsAttempted === 10, 'Python questionsAttempted is 10 (5 + 5)');
  assert(pyStats.questionsCorrect === 8, 'Python questionsCorrect is 8 (5 + 3)');
  assert(pyStats.accuracy === 80, 'Python aggregate accuracy is 80% (8/10)');
  assert(pyStats.bestScore === 1200, 'Python bestScore is 1200');

  const javaStats = Analytics.aggregateLanguageStats(mockSessions, 'java');
  assert(javaStats.hasData === false, 'Java unplayed returns honest hasData = false');
  assert(javaStats.totalSessions === 0, 'Java totalSessions is 0');
  assert(javaStats.accuracy === 0, 'Java accuracy is 0%');

  const begStats = Analytics.aggregateDifficultyStats(mockSessions, 'beginner');
  assert(begStats.hasData === true && begStats.totalSessions === 2, 'Beginner difficulty totalSessions is 2');
  assert(begStats.questionsAttempted === 10, 'Beginner total attempted is 10');
  assert(begStats.avgScore === 1000, 'Beginner average score is 1000 ((1200 + 800) / 2)');

  const expStats = Analytics.aggregateDifficultyStats(mockSessions, 'expert');
  assert(expStats.hasData === true && expStats.totalSessions === 1, 'Expert difficulty totalSessions is 1');
  assert(expStats.accuracy === 100, 'Expert accuracy is 100%');

  const intStats = Analytics.aggregateDifficultyStats(mockSessions, 'intermediate');
  assert(intStats.hasData === false, 'Intermediate unplayed returns hasData = false');

  // =========================================================================
  // 5. Historical Trend Calculation
  // =========================================================================
  console.log('\n--- 5. Historical Trend Trajectory ---');
  const trendResult = Analytics.calculateHistoricalTrend(mockSessions, 5);
  assert(trendResult.points.length === 3, 'Calculates 3 historical points');
  assert(trendResult.points[0].accuracy === 100, 'First point accuracy is 100%');
  assert(trendResult.points[1].accuracy === 60, 'Second point accuracy is 60%');
  assert(trendResult.points[2].accuracy === 100, 'Third point accuracy is 100%');
  assert(trendResult.avgAccuracy > 0, 'Calculates positive average accuracy');

  const improvingSessions = [
    { timestamp: 100, questionsAttempted: 5, questionsCorrect: 2, accuracy: 40 },
    { timestamp: 200, questionsAttempted: 5, questionsCorrect: 3, accuracy: 60 },
    { timestamp: 300, questionsAttempted: 5, questionsCorrect: 4, accuracy: 80 },
    { timestamp: 400, questionsAttempted: 5, questionsCorrect: 5, accuracy: 100 }
  ];
  const improvingTrend = Analytics.calculateHistoricalTrend(improvingSessions);
  assert(improvingTrend.trend === 'improving', 'Detects improving accuracy trajectory (+5% avg increase)');

  const emptyTrend = Analytics.calculateHistoricalTrend([]);
  assert(emptyTrend.points.length === 0 && emptyTrend.trend === 'neutral', 'Empty sessions returns neutral trend');

  // =========================================================================
  // 6. Evidence-Backed Personalized Recommendations
  // =========================================================================
  console.log('\n--- 6. Personalized Recommendations Engine ---');
  const sessionWithWeakness = {
    language: 'python',
    difficulty: 'beginner',
    questionsAttempted: 5,
    questionsCorrect: 3,
    incorrectCount: 2,
    accuracy: 60,
    results: [
      { topic: 'pointers', isCorrect: false },
      { topic: 'pointers', isCorrect: false },
      { topic: 'control_flow', isCorrect: true },
      { topic: 'control_flow', isCorrect: true },
      { topic: 'control_flow', isCorrect: true }
    ]
  };

  const recs = Analytics.generateRecommendations(sessionWithWeakness, { level: 2 });
  assert(recs.length > 0, 'Generates recommendations');
  assert(recs.some(r => r.type === 'weak_topic'), 'Generates weak_topic recommendation for low-accuracy topic');
  assert(recs.some(r => r.type === 'retry_missed'), 'Generates retry_missed recommendation when questions are missed');

  const weakRec = recs.find(r => r.type === 'weak_topic');
  assert(weakRec && weakRec.actionUrl.includes('topic=pointers'), 'Weak topic recommendation points to pointers topic practice');
  assert(weakRec && weakRec.reason.includes('0%'), 'Recommendation reason cites actual accuracy');

  // Tier Advancement Recommendation
  const flawlessBeginnerSession = {
    language: 'c',
    difficulty: 'beginner',
    questionsAttempted: 5,
    questionsCorrect: 5,
    incorrectCount: 0,
    accuracy: 100,
    results: [
      { topic: 'data_types', isCorrect: true },
      { topic: 'data_types', isCorrect: true }
    ]
  };
  const advanceRecs = Analytics.generateRecommendations(flawlessBeginnerSession, { level: 3 });
  assert(advanceRecs.some(r => r.type === 'tier_advance'), 'Generates tier_advance recommendation on 100% beginner accuracy');
  const adv = advanceRecs.find(r => r.type === 'tier_advance');
  assert(adv && adv.actionUrl.includes('diff=intermediate'), 'Tier advance recommendation links to intermediate tier');

  // Mode Gating Enforcement: Never recommend locked modes
  const lowLevelSession = {
    language: 'python',
    difficulty: 'intermediate',
    questionsAttempted: 5,
    questionsCorrect: 5,
    accuracy: 100,
    results: []
  };
  const lowLevelRecs = Analytics.generateRecommendations(lowLevelSession, { level: 3 }); // Hardcore is Level 5 gate
  assert(!lowLevelRecs.some(r => r.type === 'challenge_mode'), 'Does not recommend Hardcore mode to Level 3 player');

  const highLevelRecs = Analytics.generateRecommendations(lowLevelSession, { level: 6 }); // Level 6 has Hardcore unlocked
  assert(highLevelRecs.some(r => r.type === 'challenge_mode'), 'Recommends Hardcore mode to Level 6+ player');

  // =========================================================================
  // 7. Session Data Model & Profile History Integration
  // =========================================================================
  console.log('\n--- 7. Session Data Model & Profile Storage ---');
  State.init();

  const testQuestions = QuestionBank.getByDifficulty('python', 'beginner').slice(0, 2);
  const engine = new GameEngine();
  engine.startSession({
    language: 'python',
    difficulty: 'beginner',
    questions: testQuestions
  });

  // Submit first question correct
  engine.submitAnswer(testQuestions[0].correctAnswer, 20);
  engine.nextQuestion();

  // Submit second question incorrect
  engine.submitAnswer('__WRONG_ANS__', 10);
  const summary = engine.getSessionSummary();

  assert(summary.missedQuestionIds.length === 1, 'Summary includes missedQuestionIds array with 1 item');
  assert(summary.results.length === 2, 'Summary results includes 2 question records');
  assert(summary.results[0].prompt !== undefined, 'Summary result preserves prompt string');
  assert(summary.results[0].code !== undefined, 'Summary result preserves code snippet');
  assert(summary.results[0].explanation !== undefined, 'Summary result preserves explanation string');
  assert(summary.results[0].submission !== undefined, 'Summary result preserves user submission');

  // Test Profile recording session history
  const activeProf = Profile.getActiveProfile();
  assert(activeProf !== null, 'Active profile exists after State.init()');

  const recRes = Profile.recordSessionResult(summary);
  assert(recRes && recRes.success, 'Profile successfully records session summary');
  const refreshed = Profile.getActiveProfile();
  assert(Array.isArray(refreshed.sessionHistory) && refreshed.sessionHistory.length > 0, 'Profile now contains sessionHistory array');
  assert(refreshed.sessionHistory[0].accuracy !== undefined, 'Stored sessionHistory contains accuracy');
  assert(Array.isArray(refreshed.missedQuestionIds) && refreshed.missedQuestionIds.includes(summary.missedQuestionIds[0]), 'Profile stores missedQuestionIds for retry');

  // =========================================================================
  // 8. DOM Landmarks & Page Markups
  // =========================================================================
  console.log('\n--- 8. DOM Landmarks & Visual Structure ---');
  const resultsHtml = fs.readFileSync(path.resolve('results.html'), 'utf-8');
  assert(resultsHtml.includes('id="results-svg-ring"'), 'results.html includes circular SVG progress ring');
  assert(resultsHtml.includes('id="results-grade-display"'), 'results.html includes #results-grade-display');
  assert(resultsHtml.includes('id="btn-play-again"'), 'results.html includes #btn-play-again');
  assert(resultsHtml.includes('id="btn-retry-missed"'), 'results.html includes #btn-retry-missed');
  assert(resultsHtml.includes('id="recommendations-container"'), 'results.html includes #recommendations-container');
  assert(resultsHtml.includes('id="topic-breakdown-body"'), 'results.html includes #topic-breakdown-body');
  assert(resultsHtml.includes('id="question-review-list"'), 'results.html includes #question-review-list');
  assert(resultsHtml.includes('id="btn-toggle-all-explanations"'), 'results.html includes expand all explanations toggle');

  const progressHtml = fs.readFileSync(path.resolve('progress.html'), 'utf-8');
  assert(progressHtml.includes('id="language-performance-grid"'), 'progress.html includes #language-performance-grid');
  assert(progressHtml.includes('id="difficulty-performance-grid"'), 'progress.html includes #difficulty-performance-grid');
  assert(progressHtml.includes('id="filter-history-lang"'), 'progress.html includes #filter-history-lang');
  assert(progressHtml.includes('id="filter-history-diff"'), 'progress.html includes #filter-history-diff');
  assert(progressHtml.includes('id="filter-history-range"'), 'progress.html includes #filter-history-range');
  assert(progressHtml.includes('id="trend-svg-container"'), 'progress.html includes #trend-svg-container');
  assert(progressHtml.includes('id="history-table"'), 'progress.html includes #history-table');

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n------------------------------------------------------------');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('------------------------------------------------------------\n');

  if (failed > 0) {
    throw new Error(`${failed} Analytics test(s) failed.`);
  }
  return { passed, failed };
}

// Run if executed directly
if (process.argv[1].endsWith('analytics-tests.js')) {
  runAnalyticsTests().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
