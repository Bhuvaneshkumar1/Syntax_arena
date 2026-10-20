/**
 * SyntaxArena Game Session Model (Batch 4)
 * Manages active session parameters, question shuffling, attempt history,
 * streak scaling, and deterministic scoring calculations.
 * Source of truth: docs/GAME_RULES.md & docs/ARCHITECTURE.md
 */

import { Utils } from './utils.js';
import { HINT_PENALTIES } from './hint-manager.js';

export const BASE_POINTS = {
  beginner: 100,
  intermediate: 200,
  expert: 300
};

export class GameSession {
  /**
   * @param {object} config
   * @param {string} config.language
   * @param {string} config.difficulty
   * @param {Array} config.questions
   * @param {'campaign'|'practice'} [config.mode='campaign']
   * @param {number} [config.timeLimit=45] - Total seconds per question (0 for untimed)
   * @param {boolean} [config.randomizeOrder=false]
   * @param {Function} [config.randomSource=Math.random]
   */
  constructor(config = {}) {
    if (!Array.isArray(config.questions) || config.questions.length === 0) {
      throw new Error('[GameSession] Cannot initialize session with empty questions array.');
    }

    this.id = Utils.generateId('sess');
    this.language = (config.language || 'python').toLowerCase();
    this.difficulty = (config.difficulty || 'beginner').toLowerCase();
    this.mode = config.mode || 'campaign';
    this.timeLimit = typeof config.timeLimit === 'number' ? config.timeLimit : 45;
    this.startTime = Date.now();
    this.endTime = null;
    this.isCompleted = false;

    // Clone question pool to prevent mutating source data
    const pool = config.questions.map(q => ({ ...q }));

    // Apply deterministic/seeded shuffling if requested (Practice mode)
    const randomFn = typeof config.randomSource === 'function' ? config.randomSource : Math.random;
    if (config.randomizeOrder) {
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(randomFn() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }

    this.questions = pool;
    this.currentIndex = 0;

    // Performance & Scoring State
    this.totalScore = 0;
    this.currentStreak = 0;
    this.highestStreak = 0;
    this.questionsCorrect = 0;
    this.questionsAttempted = 0;
    // Hardcore Mode parameters (3 Hearts, 30s timer per docs/GAME_RULES.md §5.1)
    this.lives = this.mode === 'hardcore' ? (typeof config.lives === 'number' ? config.lives : 3) : undefined;
    this.maxLives = this.mode === 'hardcore' ? (typeof config.maxLives === 'number' ? config.maxLives : 3) : undefined;
    this.isGameOver = false;
    if (this.mode === 'hardcore' && typeof config.timeLimit !== 'number') {
      this.timeLimit = 30;
    }

    // Tracking attempts and results per question
    this.hintsUsedCount = 0;
    this.retriesUsedCount = 0;
    this.attemptsMap = new Map();   // questionId -> count
    this.results = [];              // array of question outcomes
  }

  /**
   * Get the active question for the current step.
   * @returns {object|null}
   */
  getCurrentQuestion() {
    if (this.currentIndex >= this.questions.length) return null;
    return this.questions[this.currentIndex];
  }

  /**
   * Get the number of attempts made on the current question.
   * @returns {number}
   */
  getCurrentAttempts() {
    const q = this.getCurrentQuestion();
    if (!q) return 0;
    return this.attemptsMap.get(q.id) || 0;
  }

  /**
   * Increment attempt counter for current question.
   */
  recordAttempt() {
    const q = this.getCurrentQuestion();
    if (!q) return 0;
    const current = this.attemptsMap.get(q.id) || 0;
    const next = current + 1;
    this.attemptsMap.set(q.id, next);
    return next;
  }

  /**
   * Calculate points and streak for an answer outcome.
   * Master formula: docs/GAME_RULES.md §1.5
   * Points = max(0, floor((P_base * A - H + B_speed) * M(streak)))
   *
   * @param {boolean} isCorrect
   * @param {boolean} usedHint
   * @param {boolean} isRetry
   * @param {number} [timeRemaining=0]
   * @returns {object} Calculated outcome metrics
   */
  calculateOutcome(isCorrect, usedHint, isRetry, timeRemaining = 0) {
    const q = this.getCurrentQuestion();
    const diff = q ? (q.difficulty || this.difficulty) : this.difficulty;
    const basePts = BASE_POINTS[diff] || BASE_POINTS.beginner;

    if (!isCorrect) {
      // Incorrect answer breaks streak immediately
      this.currentStreak = 0;
      return {
        isCorrect: false,
        points: 0,
        basePoints: basePts,
        speedBonus: 0,
        hintPenalty: 0,
        retryModifier: isRetry ? 0.5 : 1.0,
        multiplier: 1.0,
        streak: 0
      };
    }

    // Streak Multiplier: M = min(1.0 + (streak * 0.25), 3.0)
    // On Second Chance retry, streak is FROZEN (not incremented, not reset)
    let effectiveStreak = this.currentStreak;
    if (!isRetry) {
      effectiveStreak = this.currentStreak + 1;
      this.currentStreak = effectiveStreak;
      if (this.currentStreak > this.highestStreak) {
        this.highestStreak = this.currentStreak;
      }
    }
    const multiplier = Math.min(1.0 + (this.currentStreak * 0.25), 3.0);

    // Retry modifier (A): 1.0 on first try; 0.5 on retry
    const A = isRetry ? 0.5 : 1.0;

    // Hint penalty (H)
    const H = usedHint ? (HINT_PENALTIES[diff] || 25) : 0;

    // Speed bonus (B_speed): Awarded for rapid deduction proportional to remaining time
    let speedBonus = 0;
    if (!isRetry && !usedHint && this.timeLimit > 0 && timeRemaining > 0) {
      const speedRatio = Math.min(1.0, timeRemaining / this.timeLimit);
      speedBonus = Math.floor(0.5 * basePts * speedRatio);
    }

    // Master Points
    const subtotal = Math.max(0, basePts * A - H + speedBonus);
    const finalPoints = Math.max(0, Math.floor(subtotal * multiplier));

    return {
      isCorrect: true,
      points: finalPoints,
      basePoints: basePts,
      speedBonus: speedBonus,
      hintPenalty: H,
      retryModifier: A,
      multiplier: multiplier,
      streak: this.currentStreak
    };
  }

  /**
   * Commit a question outcome to the session history.
   * @param {object} outcomeData
   */
  commitResult(outcomeData) {
    const q = this.getCurrentQuestion();
    if (!q) return;

    this.questionsAttempted++;
    if (outcomeData.isCorrect) {
      this.questionsCorrect++;
      this.totalScore += outcomeData.points;
    }
    if (outcomeData.usedHint) {
      this.hintsUsedCount++;
    }
    if (outcomeData.attempts > 1) {
      this.retriesUsedCount = (this.retriesUsedCount || 0) + 1;
    }

    this.results.push({
      questionId: q.id,
      index: this.currentIndex,
      type: q.type,
      topic: q.topic,
      subtopic: q.subtopic,
      difficulty: q.difficulty,
      prompt: q.prompt,
      code: q.code || '',
      options: Array.isArray(q.options) ? [...q.options] : [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      ...outcomeData
    });

    // Hardcore mode life deduction: shatters 1 Heart upon failing question
    if (!outcomeData.isCorrect && this.mode === 'hardcore') {
      if (typeof this.lives === 'number') {
        this.lives = Math.max(0, this.lives - 1);
        if (this.lives <= 0) {
          this.isGameOver = true;
          this.isCompleted = true;
          this.endTime = Date.now();
        }
      }
    }
  }

  /**
   * Advance to the next question in the session.
   * @returns {boolean} True if advanced, false if at end
   */
  advance() {
    if (this.isGameOver) {
      this.isCompleted = true;
      this.endTime = this.endTime || Date.now();
      return false;
    }

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return true;
    } else {
      this.isCompleted = true;
      this.endTime = Date.now();
      return false;
    }
  }

  /**
   * Get structured session performance summary.
   * @returns {object}
   */
  getSummary() {
    const totalQuestions = this.questions.length;
    const accuracy = this.questionsAttempted > 0
      ? Math.round((this.questionsCorrect / this.questionsAttempted) * 100)
      : 0;

    const elapsedSeconds = Math.round(((this.endTime || Date.now()) - this.startTime) / 1000);
    const missedQuestionIds = this.results
      .filter(r => !r.isCorrect)
      .map(r => r.questionId);

    return {
      sessionId: this.id,
      language: this.language,
      difficulty: this.difficulty,
      mode: this.mode,
      lives: this.lives,
      maxLives: this.maxLives,
      isGameOver: Boolean(this.isGameOver),
      totalQuestions: totalQuestions,
      questionsAttempted: this.questionsAttempted,
      questionsCorrect: this.questionsCorrect,
      correctCount: this.questionsCorrect,
      incorrectCount: Math.max(0, this.questionsAttempted - this.questionsCorrect),
      accuracy: accuracy,
      accuracyPercentage: accuracy,
      totalScore: this.totalScore,
      highestStreak: this.highestStreak,
      bestStreak: this.highestStreak,
      hintsUsed: this.hintsUsedCount || 0,
      retriesUsed: this.retriesUsedCount || 0,
      elapsedSeconds: elapsedSeconds,
      timestamp: this.endTime || Date.now(),
      isCompleted: this.isCompleted,
      missedQuestionIds: missedQuestionIds,
      results: [...this.results]
    };
  }
}
