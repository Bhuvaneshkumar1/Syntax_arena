/**
 * SyntaxArena Gamification System & Player Rewards Test Suite (Batch 6)
 * Verifies XP formulas, level thresholds, maximum rank cap, streak records,
 * 20-badge achievement registry evaluators, theme/avatar gating, challenge mode unlocks,
 * hardcore mode engine behavior, idempotency/duplicate rejection, and DOM landmarks.
 * Source of truth: docs/GAME_RULES.md, docs/ARCHITECTURE.md
 */

import fs from 'fs';
import path from 'path';
import {
  Gamification,
  LEVEL_THRESHOLDS,
  XP_RULES,
  ACHIEVEMENTS,
  UNLOCKABLE_THEMES,
  UNLOCKABLE_AVATARS,
  CHALLENGE_MODES
} from '../js/gamification.js';
import { GameEngine, ENGINE_STATES } from '../js/game-engine.js';
import { Profile, AVATAR_CATALOG } from '../js/profile.js';

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

export async function runGamificationTests() {
  console.log('\n============================================================');
  console.log('🧪 RUNNING GAMIFICATION SYSTEM & REWARDS TEST SUITE');
  console.log('============================================================\n');

  // ------------------------------------------------------------------------
  // 1. XP Formulas & Deterministic Calculations
  // ------------------------------------------------------------------------
  console.log('--- 1. XP Formulas & Scoring Calculations ---');

  // Beginner questions (+50 XP each)
  const begSummary = {
    sessionId: 'test-sess-001',
    difficulty: 'beginner',
    questionsCorrect: 3,
    totalQuestions: 5,
    totalScore: 300,
    answers: [
      { questionId: 'q1', correct: true, difficulty: 'beginner' },
      { questionId: 'q2', correct: true, difficulty: 'beginner' },
      { questionId: 'q3', correct: true, difficulty: 'beginner' },
      { questionId: 'q4', correct: false, difficulty: 'beginner' },
      { questionId: 'q5', correct: false, difficulty: 'beginner' }
    ]
  };
  const begXP = Gamification.calculateSessionXP(begSummary);
  assert(begXP === 150, 'Beginner track awards +50 XP per correct question (3 * 50 = 150 XP)', `Got: ${begXP}`);

  // Intermediate questions (+100 XP each)
  const intSummary = {
    sessionId: 'test-sess-002',
    difficulty: 'intermediate',
    questionsCorrect: 2,
    totalQuestions: 4,
    answers: [
      { questionId: 'q1', correct: true, difficulty: 'intermediate' },
      { questionId: 'q2', correct: true, difficulty: 'intermediate' },
      { questionId: 'q3', correct: false, difficulty: 'intermediate' },
      { questionId: 'q4', correct: false, difficulty: 'intermediate' }
    ]
  };
  const intXP = Gamification.calculateSessionXP(intSummary);
  assert(intXP === 200, 'Intermediate track awards +100 XP per correct question (2 * 100 = 200 XP)', `Got: ${intXP}`);

  // Expert questions (+150 XP each)
  const expSummary = {
    sessionId: 'test-sess-003',
    difficulty: 'expert',
    questionsCorrect: 2,
    totalQuestions: 4,
    answers: [
      { questionId: 'q1', correct: true, difficulty: 'expert' },
      { questionId: 'q2', correct: true, difficulty: 'expert' },
      { questionId: 'q3', correct: false, difficulty: 'expert' },
      { questionId: 'q4', correct: false, difficulty: 'expert' }
    ]
  };
  const expXP = Gamification.calculateSessionXP(expSummary);
  assert(expXP === 300, 'Expert track awards +150 XP per correct question (2 * 150 = 300 XP)', `Got: ${expXP}`);

  // Flawless Clear Bonus (+100 XP)
  const flawlessSummary = {
    sessionId: 'test-sess-004',
    difficulty: 'beginner',
    questionsCorrect: 3,
    totalQuestions: 3,
    answers: [
      { questionId: 'q1', correct: true, difficulty: 'beginner' },
      { questionId: 'q2', correct: true, difficulty: 'beginner' },
      { questionId: 'q3', correct: true, difficulty: 'beginner' }
    ]
  };
  const flawlessXP = Gamification.calculateSessionXP(flawlessSummary);
  assert(flawlessXP === 250, 'Flawless run awards base XP (150) + 100 flawless bonus = 250 XP', `Got: ${flawlessXP}`);

  // Daily Challenge Bonus (+300 XP)
  const dailySummary = {
    sessionId: 'test-sess-005',
    difficulty: 'intermediate',
    mode: 'daily',
    isDaily: true,
    questionsCorrect: 3,
    totalQuestions: 3,
    answers: [
      { questionId: 'q1', correct: true, difficulty: 'intermediate' },
      { questionId: 'q2', correct: true, difficulty: 'intermediate' },
      { questionId: 'q3', correct: true, difficulty: 'intermediate' }
    ]
  };
  const dailyXP = Gamification.calculateSessionXP(dailySummary);
  assert(dailyXP === 700, 'Daily flawless run awards 300 (base) + 100 (flawless) + 300 (daily clear) = 700 XP', `Got: ${dailyXP}`);

  // Invalid / Zero correct yields 0 XP
  const zeroSummary = {
    sessionId: 'test-sess-006',
    difficulty: 'beginner',
    questionsCorrect: 0,
    totalQuestions: 5,
    answers: []
  };
  assert(Gamification.calculateSessionXP(zeroSummary) === 0, 'Zero correct answers yields exactly 0 XP');
  assert(Gamification.calculateSessionXP(null) === 0, 'Null session summary safely returns 0 XP');

  // ------------------------------------------------------------------------
  // 2. Rank & Level Thresholds
  // ------------------------------------------------------------------------
  console.log('\n--- 2. Level Derivation & Threshold Bounds ---');

  assert(LEVEL_THRESHOLDS.length === 10, 'Centrally defines exactly 10 distinct level thresholds');
  assert(Gamification.deriveLevel(0) === 1, '0 XP derives Level 1 (Script Novice)');
  assert(Gamification.deriveLevel(249) === 1, '249 XP derives Level 1');
  assert(Gamification.deriveLevel(250) === 2, '250 XP derives Level 2 (Syntax Apprentice)');
  assert(Gamification.deriveLevel(600) === 3, '600 XP derives Level 3 (Logic Crafter)');
  assert(Gamification.deriveLevel(1200) === 4, '1200 XP derives Level 4 (Algorithmic Adept)');
  assert(Gamification.deriveLevel(2000) === 5, '2000 XP derives Level 5 (Senior Developer)');
  assert(Gamification.deriveLevel(3200) === 6, '3200 XP derives Level 6 (System Architect)');
  assert(Gamification.deriveLevel(4800) === 7, '4800 XP derives Level 7 (Polyglot Engineer)');
  assert(Gamification.deriveLevel(6800) === 8, '6800 XP derives Level 8 (Compiler Wizard)');
  assert(Gamification.deriveLevel(9200) === 9, '9200 XP derives Level 9 (Kernel Vanguard)');
  assert(Gamification.deriveLevel(12000) === 10, '12000 XP derives Level 10 (Grandmaster Architect)');
  assert(Gamification.deriveLevel(999999) === 10, 'Extreme XP values properly cap at Level 10 (Max Rank)');

  // Level Progress Calculation
  const prog1 = Gamification.calculateLevelProgress(100);
  assert(prog1.level === 1, 'Level progress calculates current level = 1');
  assert(prog1.nextLevel === 2, 'Next level is Level 2');
  assert(prog1.currentLevelThreshold === 0, 'Level 1 threshold starts at 0 XP');
  assert(prog1.nextLevelThreshold === 250, 'Level 2 threshold is 250 XP');
  assert(prog1.xpToNextLevel === 150, 'XP to next level is 150 (250 - 100)');
  assert(Math.round(prog1.progressPercent * 100) === 40, 'Progress percent is 40% (100 / 250)');

  const progMax = Gamification.calculateLevelProgress(15000);
  assert(progMax.isMaxRank === true, 'Progress at 15000 XP flags isMaxRank = true');
  assert(progMax.progressPercent === 1.0, 'Max rank caps progress percent at 1.0');

  // ------------------------------------------------------------------------
  // 3. Streak Tracking & Record Retention
  // ------------------------------------------------------------------------
  console.log('\n--- 3. Streak Tracking & Best Streak Record Preservation ---');

  const engine = new GameEngine();
  const testQuestions = [
    { id: 'q1', language: 'python', difficulty: 'beginner', prompt: 'P1', options: ['A', 'B'], correctAnswer: 'A', acceptedAnswers: ['A'], points: 100 },
    { id: 'q2', language: 'python', difficulty: 'beginner', prompt: 'P2', options: ['A', 'B'], correctAnswer: 'A', acceptedAnswers: ['A'], points: 100 },
    { id: 'q3', language: 'python', difficulty: 'beginner', prompt: 'P3', options: ['A', 'B'], correctAnswer: 'A', acceptedAnswers: ['A'], points: 100 },
    { id: 'q4', language: 'python', difficulty: 'beginner', prompt: 'P4', options: ['A', 'B'], correctAnswer: 'A', acceptedAnswers: ['A'], points: 100 }
  ];

  engine.startSession({ language: 'python', difficulty: 'beginner', questions: testQuestions });
  const ans1 = engine.submitAnswer('A');
  assert(ans1.correct && ans1.streak === 1, 'First correct answer sets streak to 1');

  engine.nextQuestion();
  const ans2 = engine.submitAnswer('A');
  assert(ans2.correct && ans2.streak === 2, 'Second consecutive correct answer increments streak to 2');

  engine.nextQuestion();
  const ans3 = engine.submitAnswer('B'); // Incorrect
  assert(!ans3.correct && ans3.streak === 0, 'Incorrect answer resets streak to 0');

  const sessSummary = engine.getSessionSummary();
  assert(sessSummary.bestStreak === 2, 'Session summary accurately records bestStreak = 2');

  // Verify Profile updates bestStreak only when exceeded
  const baseProfile = {
    id: 'test-prof-streak',
    xp: 0,
    level: 1,
    bestStreak: 5,
    badges: [],
    processedSessionIds: []
  };

  const lowerStreakSummary = {
    sessionId: 'sess-streak-lower',
    questionsCorrect: 2,
    totalQuestions: 5,
    bestStreak: 3,
    answers: []
  };
  const resLower = Gamification.processSessionSummary(baseProfile, lowerStreakSummary);
  assert(resLower.updatedProfile.stats.highestStreak >= 5, 'Profile retains existing bestStreak (5) when session best (3) is lower');

  const higherStreakSummary = {
    sessionId: 'sess-streak-higher',
    questionsCorrect: 7,
    totalQuestions: 7,
    bestStreak: 7,
    highestStreak: 7,
    answers: []
  };
  const resHigher = Gamification.processSessionSummary(baseProfile, higherStreakSummary);
  assert(resHigher.updatedProfile.stats.highestStreak === 7, 'Profile updates bestStreak to 7 when session best exceeds current record');

  // Continuous streak verification (Item 7): Run with Q1 correct, Q2 wrong, Q3-Q5 correct has continuous best streak 3, NOT whole 4
  const discontinuousSummary = {
    sessionId: 'sess-streak-discontinuous',
    questionsAttempted: 5,
    questionsCorrect: 4,
    totalQuestions: 5,
    results: [
      { isCorrect: true, attempts: 1 },
      { isCorrect: false, attempts: 1 },
      { isCorrect: true, attempts: 1 },
      { isCorrect: true, attempts: 1 },
      { isCorrect: true, attempts: 1 }
    ]
  };
  const blankProfile = { ...baseProfile, bestStreak: 0, stats: { ...baseProfile.stats, highestStreak: 0 } };
  const resDiscont = Gamification.processSessionSummary(blankProfile, discontinuousSummary);
  assert(resDiscont.updatedProfile.bestStreak === 3, `Continuous best streak is strictly 3, got: ${resDiscont.updatedProfile.bestStreak}`);

  // ------------------------------------------------------------------------
  // 4. Achievement Badges Registry (20 Badges)
  // ------------------------------------------------------------------------
  console.log('\n--- 4. Achievement Badges Registry & Unlock Conditions ---');

  assert(ACHIEVEMENTS.length === 20, 'Achievement registry contains exactly 20 distinct badges');

  const allBadgeIds = new Set(ACHIEVEMENTS.map(b => b.id));
  assert(allBadgeIds.size === 20, 'All 20 badges have unique, stable IDs');

  // Verify difficulty and tiered pricing across badges (Item 4)
  const validDiffs = ['beginner', 'intermediate', 'expert', 'master'];
  ACHIEVEMENTS.forEach(badge => {
    assert(validDiffs.includes(badge.difficulty), `Badge ${badge.id} has valid difficulty tier`);
    assert(typeof badge.cost === 'number' && badge.cost >= 50, `Badge ${badge.id} has numeric cost >= 50`);
    if (badge.difficulty === 'beginner') {
      assert(badge.cost <= 80, `Beginner badge ${badge.id} cost is <= 80`);
    } else if (badge.difficulty === 'intermediate') {
      assert(badge.cost >= 90 && badge.cost <= 150, `Intermediate badge ${badge.id} cost is 90-150`);
    } else if (badge.difficulty === 'expert') {
      assert(badge.cost >= 180 && badge.cost <= 260, `Expert badge ${badge.id} cost is 180-260`);
    } else if (badge.difficulty === 'master') {
      assert(badge.cost >= 280, `Master badge ${badge.id} cost is >= 280`);
    }
  });

  // Test First Blood evaluator
  const badgeFirstBlood = ACHIEVEMENTS.find(b => b.id === 'first_blood');
  assert(badgeFirstBlood.evaluate(baseProfile, { questionsCorrect: 1 }) === true, 'First Blood unlocks when questionsCorrect >= 1');
  assert(badgeFirstBlood.evaluate(baseProfile, { questionsCorrect: 0 }) === false, 'First Blood remains locked when questionsCorrect = 0');

  // Test Streak 5 evaluator
  const badgeStreak5 = ACHIEVEMENTS.find(b => b.id === 'streak_5');
  assert(badgeStreak5.evaluate(baseProfile, { highestStreak: 5 }) === true, 'Streak 5 unlocks when highestStreak >= 5');
  assert(badgeStreak5.evaluate(baseProfile, { highestStreak: 4 }) === false, 'Streak 5 remains locked when highestStreak < 5');

  // Test Speed Demon evaluator
  const badgeSpeed = ACHIEVEMENTS.find(b => b.id === 'speed_demon');
  const speedSessionSuccess = {
    results: [{ isCorrect: true, usedHint: false, timeLimit: 45, timeRemaining: 42 }]
  };
  const speedSessionFail = {
    results: [{ isCorrect: true, usedHint: false, timeLimit: 45, timeRemaining: 30 }]
  };
  assert(badgeSpeed.evaluate(baseProfile, speedSessionSuccess) === true, 'Speed Demon unlocks when answered in <= 5s without hints');
  assert(badgeSpeed.evaluate(baseProfile, speedSessionFail) === false, 'Speed Demon remains locked when answering took longer than 5s');

  // Test Flawless Execution evaluator
  const badgeFlawless = ACHIEVEMENTS.find(b => b.id === 'perfectionist');
  assert(badgeFlawless.evaluate(baseProfile, { questionsCorrect: 5, totalQuestions: 5, accuracy: 100 }) === true, 'Flawless Execution unlocks on 100% accuracy');
  assert(badgeFlawless.evaluate(baseProfile, { questionsCorrect: 4, totalQuestions: 5, accuracy: 80 }) === false, 'Flawless Execution remains locked if any question is missed');

  // Awarded badge persistence: processSessionSummary does not re-award already earned badges
  const profileWithBadge = {
    ...baseProfile,
    badges: ['first_blood']
  };
  const awardedSession = {
    sessionId: 'sess-first-blood',
    questionsCorrect: 1,
    totalQuestions: 1,
    answers: [{ correct: true }]
  };
  const resBadges = Gamification.processSessionSummary(profileWithBadge, awardedSession);
  assert(!resBadges.newBadges.includes('first_blood'), 'Already-earned badges are not awarded again (idempotent)');

  // ------------------------------------------------------------------------
  // 5. Unlockable Themes, Avatars & Challenge Modes
  // ------------------------------------------------------------------------
  console.log('\n--- 5. Unlockable Themes, Avatars & Challenge Modes ---');

  assert(UNLOCKABLE_THEMES.length === 4, 'Defines 4 themes (dark, light, amber, gold)');
  assert(UNLOCKABLE_AVATARS.length === 6, 'Defines 6 unlockable avatars');
  assert(CHALLENGE_MODES.length === 4, 'Defines 4 challenge modes');

  // Theme level requirements
  assert(UNLOCKABLE_THEMES.find(t => t.id === 'dark').requiredLevel === 1, 'Cyber Studio theme unlocked at Level 1');
  assert(UNLOCKABLE_THEMES.find(t => t.id === 'light').requiredLevel === 2, 'Studio Paper theme unlocked at Level 2');
  assert(UNLOCKABLE_THEMES.find(t => t.id === 'amber').requiredLevel === 6, 'Amber Flame CRT theme unlocked at Level 6');
  assert(UNLOCKABLE_THEMES.find(t => t.id === 'gold').requiredLevel === 10, 'Grandmaster Gold theme unlocked at Level 10');

  // Avatar level requirements
  assert(AVATAR_CATALOG.find(a => a.id === 'cyber_fox').requiredLevel === 1, 'Cyber Fox avatar unlocked at Level 1');
  assert(AVATAR_CATALOG.find(a => a.id === 'hex_dragon').requiredLevel === 4, 'Hex Dragon avatar requires Level 4');
  assert(AVATAR_CATALOG.find(a => a.id === 'glitch_bot').requiredLevel === 7, 'Glitch Bot avatar requires Level 7');

  // Challenge mode requirements
  assert(CHALLENGE_MODES.find(m => m.id === 'campaign').requiredLevel === 1, 'Campaign mode available at Level 1');
  assert(CHALLENGE_MODES.find(m => m.id === 'practice').requiredLevel === 1, 'Free Practice mode available at Level 1');
  assert(CHALLENGE_MODES.find(m => m.id === 'speedrun').requiredLevel === 3, 'Speedrun mode requires Level 3');
  assert(CHALLENGE_MODES.find(m => m.id === 'hardcore').requiredLevel === 5, 'Hardcore mode requires Level 5');

  // Test level promotion unlocks
  const lowLevelProfile = {
    id: 'test-low-level',
    xp: 200,
    level: 1,
    badges: [],
    processedSessionIds: [],
    unlockedThemes: ['dark'],
    unlockedAvatars: ['cyber_fox', 'pixel_cat', 'binary_owl', 'synth_racoon'],
    unlockedModes: ['campaign', 'practice']
  };

  // Session providing +500 XP brings total to 700 XP -> Level 3!
  const levelUpSession = {
    sessionId: 'sess-levelup-01',
    difficulty: 'expert',
    questionsCorrect: 4,
    totalQuestions: 4,
    answers: [
      { correct: true, difficulty: 'expert' },
      { correct: true, difficulty: 'expert' },
      { correct: true, difficulty: 'expert' },
      { correct: true, difficulty: 'expert' }
    ]
  };
  const levelUpResult = Gamification.processSessionSummary(lowLevelProfile, levelUpSession);
  assert(levelUpResult.levelUp === true, 'Level up triggered upon crossing threshold');
  assert(levelUpResult.newLevel === 3, 'New level derived accurately as Level 3');
  assert(levelUpResult.unlockedModes.includes('speedrun'), 'Level 3 promotion unlocks Speedrun Mode');
  assert(levelUpResult.unlockedThemes.includes('light'), 'Level 3 promotion unlocks Studio Paper theme (Lv 2)');

  // ------------------------------------------------------------------------
  // 6. Idempotency & Duplicate Event Prevention
  // ------------------------------------------------------------------------
  console.log('\n--- 6. Idempotency & Duplicate Prevention ---');

  const testProfileIdempotent = {
    id: 'prof-idemp',
    xp: 500,
    level: 2,
    badges: [],
    processedSessionIds: ['processed-sess-999']
  };

  const duplicateSession = {
    sessionId: 'processed-sess-999',
    difficulty: 'beginner',
    questionsCorrect: 2,
    totalQuestions: 2,
    answers: [{ correct: true }, { correct: true }]
  };

  const dupResult = Gamification.processSessionSummary(testProfileIdempotent, duplicateSession);
  assert(dupResult.isDuplicate === true, 'Recognizes previously processed session ID as duplicate');
  assert(dupResult.xpEarned === 0, 'Duplicate session awards exactly 0 XP');
  assert(dupResult.newBadges.length === 0, 'Duplicate session awards no new badges');
  assert(dupResult.updatedProfile.xp === 500, 'Profile XP remains unchanged upon duplicate submission');

  // Test retry_missed does NOT alter stage accuracy percentage or campaign stars (Item 6)
  const profileWithStageClear = {
    id: 'prof-stage-clear',
    xp: 600,
    stats: {
      questionsAttempted: 14,
      questionsCorrect: 10 // 10 / 14 = ~71%
    },
    campaign: {
      python: {
        beginnerStars: 2, // 2 stars from original run
        unlockedTier: 'beginner'
      }
    },
    processedSessionIds: []
  };

  const retrySession = {
    sessionId: 'sess-retry-missed-01',
    language: 'python',
    difficulty: 'beginner',
    mode: 'retry_missed',
    questionsAttempted: 4,
    questionsCorrect: 4, // 100% on the 4 missed questions
    accuracy: 100,
    answers: [{ correct: true }, { correct: true }, { correct: true }, { correct: true }]
  };

  const retryResult = Gamification.processSessionSummary(profileWithStageClear, retrySession);
  assert(retryResult.updatedProfile.stats.questionsAttempted === 14, 'Retry missed does NOT add to career questionsAttempted');
  assert(retryResult.updatedProfile.stats.questionsCorrect === 10, 'Retry missed does NOT add to career questionsCorrect');
  assert(retryResult.updatedProfile.campaign.python.beginnerStars === 2, 'Retry missed does NOT overwrite existing stage stars');

  // ------------------------------------------------------------------------
  // 7. Hardcore Mode Rules & Engine Integration
  // ------------------------------------------------------------------------
  console.log('\n--- 7. Hardcore Mode Engine Integration ---');

  const hardcoreEngine = new GameEngine();
  const hcQuestions = [
    { id: 'hc1', language: 'python', difficulty: 'expert', prompt: 'HC1', options: ['A', 'B'], correctAnswer: 'A', acceptedAnswers: ['A'], points: 150 },
    { id: 'hc2', language: 'python', difficulty: 'expert', prompt: 'HC2', options: ['A', 'B'], correctAnswer: 'A', acceptedAnswers: ['A'], points: 150 },
    { id: 'hc3', language: 'python', difficulty: 'expert', prompt: 'HC3', options: ['A', 'B'], correctAnswer: 'A', acceptedAnswers: ['A'], points: 150 },
    { id: 'hc4', language: 'python', difficulty: 'expert', prompt: 'HC4', options: ['A', 'B'], correctAnswer: 'A', acceptedAnswers: ['A'], points: 150 }
  ];

  hardcoreEngine.startSession({
    language: 'python',
    difficulty: 'expert',
    mode: 'hardcore',
    questions: hcQuestions
  });

  const hcCurr = hardcoreEngine.getCurrentQuestion();
  assert(hcCurr.lives === 3, 'Hardcore session starts with exactly 3 hearts');
  assert(hcCurr.maxLives === 3, 'Hardcore session maxLives is 3');

  // Hints disabled in hardcore mode
  const hintRes = hardcoreEngine.requestHint();
  assert(hintRes.success === false, 'Engine rejects hint request in Hardcore Mode');
  assert(hintRes.message.includes('disabled in Hardcore'), 'Hint rejection message indicates hardcore mode');

  // Answer 1: Incorrect -> loses 1 heart
  const hcAns1 = hardcoreEngine.submitAnswer('B');
  assert(hcAns1.correct === false, 'Incorrect answer recorded');
  assert(hcAns1.canRetry === false, 'Second Chance retry is disabled in Hardcore Mode');
  assert(hcAns1.lives === 2, 'First error reduces hearts from 3 to 2');

  hardcoreEngine.nextQuestion();
  // Answer 2: Correct -> earns points, streak increments
  const hcAns2 = hardcoreEngine.submitAnswer('A');
  assert(hcAns2.correct === true, 'Correct answer in Hardcore Mode succeeds');
  assert(hcAns2.points > 0, 'Points awarded for correct answer');

  hardcoreEngine.nextQuestion();
  // Answer 3: Incorrect -> loses 2nd heart (1 left)
  const hcAns3 = hardcoreEngine.submitAnswer('B');
  assert(hcAns3.lives === 1, 'Second error reduces hearts to 1');

  hardcoreEngine.nextQuestion();
  // Answer 4: Incorrect -> loses 3rd heart -> GAME OVER!
  let gameOverEmitted = false;
  hardcoreEngine.on('session:game_over', () => { gameOverEmitted = true; });

  const hcAns4 = hardcoreEngine.submitAnswer('B');
  assert(hcAns4.gameOver === true, 'Submitting 3rd incorrect answer triggers gameOver = true');
  assert(hcAns4.lives === 0, 'Hearts reduced to 0 on game over');
  assert(gameOverEmitted === true, 'Engine emits session:game_over event');
  assert(hardcoreEngine.getState() === ENGINE_STATES.COMPLETED, 'Engine transitions directly to COMPLETED state on game over');

  const hcFinalSummary = hardcoreEngine.getSessionSummary();
  assert(hcFinalSummary.isGameOver === true, 'Summary records isGameOver = true');
  assert(hcFinalSummary.questionsCorrect === 1, 'Questions solved before game over (1) are accurately preserved');
  assert(hcFinalSummary.totalScore > 0, 'Score achieved before game over is preserved');

  // ------------------------------------------------------------------------
  // 8. HTML Landmarks & Gamification Markup Verification
  // ------------------------------------------------------------------------
  console.log('\n--- 8. DOM Landmarks & Accessibility Markup Verification ---');

  const progressHtml = fs.readFileSync(path.resolve('progress.html'), 'utf8');
  assert(progressHtml.includes('id="prog-xp-fill"'), 'progress.html contains #prog-xp-fill bar element');
  assert(progressHtml.includes('id="prog-xp-bar-container"'), 'progress.html contains #prog-xp-bar-container with progressbar role');
  assert(progressHtml.includes('id="stat-total-xp"'), 'progress.html contains #stat-total-xp metric');
  assert(progressHtml.includes('id="stat-best-streak"'), 'progress.html contains #stat-best-streak metric');
  assert(progressHtml.includes('id="trophy-grid"'), 'progress.html contains #trophy-grid achievement container');
  assert(progressHtml.includes('id="themes-grid"'), 'progress.html contains #themes-grid cosmetics container');
  assert(progressHtml.includes('id="avatars-grid"'), 'progress.html contains #avatars-grid cosmetics container');
  assert(progressHtml.includes('id="modes-grid"'), 'progress.html contains #modes-grid challenge modes container');

  const settingsHtml = fs.readFileSync(path.resolve('settings.html'), 'utf8');
  assert(settingsHtml.includes('value="amber"'), 'settings.html theme dropdown includes Amber Flame CRT');
  assert(settingsHtml.includes('value="gold"'), 'settings.html theme dropdown includes Grandmaster Gold');
  assert(settingsHtml.includes('id="hardcore-status-badge"'), 'settings.html includes #hardcore-status-badge');

  const gameHtml = fs.readFileSync(path.resolve('game.html'), 'utf8');
  assert(gameHtml.includes('id="hud-lives-container"'), 'game.html contains #hud-lives-container for hardcore hearts');
  assert(gameHtml.includes('id="modal-game-over"'), 'game.html contains #modal-game-over dialog');

  const resultsHtml = fs.readFileSync(path.resolve('results.html'), 'utf8');
  assert(resultsHtml.includes('id="results-rewards-banner"'), 'results.html contains #results-rewards-banner for level ups and badges');

  const tokensCss = fs.readFileSync(path.resolve('css/tokens.css'), 'utf8');
  assert(tokensCss.includes('[data-theme="amber"]'), 'tokens.css defines [data-theme="amber"] CRT palette');
  assert(tokensCss.includes('[data-theme="gold"]'), 'tokens.css defines [data-theme="gold"] Grandmaster Gold palette');

  return { passed, failed };
}

if (process.argv[1] && process.argv[1].endsWith('gamification-tests.js')) {
  runGamificationTests().then(({ passed, failed }) => {
    console.log(`\nGamification Tests complete: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
  });
}
