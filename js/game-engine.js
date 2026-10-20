/**
 * SyntaxArena Core Game Engine (Batch 4)
 * Orchestrates session lifecycles, explicit state transitions,
 * answer evaluation, hint gating, and progression events.
 * Source of truth: docs/GAME_RULES.md & docs/ARCHITECTURE.md
 */

import { AnswerChecker } from './answer-checker.js';
import { HintManager } from './hint-manager.js';
import { GameSession } from './game-session.js';

export const ENGINE_STATES = {
  IDLE: 'idle',
  ACTIVE: 'active',
  AWAITING_RETRY: 'awaiting-retry',
  SHOWING_EXPLANATION: 'showing-explanation',
  COMPLETED: 'completed'
};

export class GameEngine {
  constructor() {
    this._state = ENGINE_STATES.IDLE;
    this._session = null;
    this._hintManager = new HintManager();
    this._listeners = new Map();
  }

  /**
   * Current engine state machine phase.
   * @returns {'idle'|'active'|'awaiting-retry'|'showing-explanation'|'completed'}
   */
  getState() {
    return this._state;
  }

  /**
   * Retrieve active game session instance.
   * @returns {GameSession|null}
   */
  getSession() {
    return this._session;
  }

  /**
   * Start a new game session with configuration.
   * @param {object} config
   * @returns {object} Initial question payload
   */
  startSession(config) {
    if (!config || !Array.isArray(config.questions) || config.questions.length === 0) {
      throw new Error('[GameEngine.startSession] A non-empty questions array is required.');
    }

    this._session = new GameSession(config);
    this._hintManager.reset();
    this._transitionTo(ENGINE_STATES.ACTIVE, {
      questionIndex: 0,
      totalQuestions: this._session.questions.length
    });

    return this.getCurrentQuestion();
  }

  /**
   * Retrieve current question sanitized for player consumption.
   * Prevents revealing correctAnswer or explanation prematurely while active.
   * @returns {object|null}
   */
  getCurrentQuestion() {
    if (!this._session) return null;
    const raw = this._session.getCurrentQuestion();
    if (!raw) return null;

    const isRevealed = this._state === ENGINE_STATES.SHOWING_EXPLANATION ||
                       this._state === ENGINE_STATES.COMPLETED;

    return {
      id: raw.id,
      index: this._session.currentIndex,
      totalQuestions: this._session.questions.length,
      language: raw.language,
      difficulty: raw.difficulty,
      type: raw.type,
      topic: raw.topic,
      subtopic: raw.subtopic,
      standardVersion: raw.standardVersion,
      prompt: raw.prompt,
      code: raw.code,
      options: raw.options ? [...raw.options] : [],
      blankCount: raw.blankCount,
      targetLine: isRevealed ? raw.targetLine : undefined,
      correctAnswer: isRevealed ? raw.correctAnswer : undefined,
      explanation: isRevealed ? raw.explanation : undefined,
      hasUsedHint: this._hintManager.hasUsedHint(raw.id),
      attempts: this._session.getCurrentAttempts(),
      engineState: this._state,
      lives: this._session.lives,
      maxLives: this._session.maxLives,
      mode: this._session.mode,
      isGameOver: Boolean(this._session.isGameOver)
    };
  }

  /**
   * Request hint for the current active question.
   * @returns {{ success: boolean, hint: string|null, penalty: number, message: string }}
   */
  requestHint() {
    if (this._state !== ENGINE_STATES.ACTIVE && this._state !== ENGINE_STATES.AWAITING_RETRY) {
      return { success: false, hint: null, penalty: 0, message: 'Hint can only be requested on an active challenge.' };
    }

    const raw = this._session.getCurrentQuestion();
    if (!raw) {
      return { success: false, hint: null, penalty: 0, message: 'No active question.' };
    }

    if (this._session && this._session.mode === 'hardcore') {
      return { success: false, hint: null, penalty: 0, message: 'Hints are disabled in Hardcore mode!' };
    }

    const hintRes = this._hintManager.requestHint(raw);
    this._emit('hint:unlocked', { questionId: raw.id, penalty: hintRes.penalty });
    return hintRes;
  }

  /**
   * Submit an answer for the current question.
   * @param {any} submission - Selected option text, line number, or token
   * @param {number} [timeRemaining=0] - Seconds left on countdown timer
   * @returns {object} Outcome evaluation
   */
  submitAnswer(submission, timeRemaining = 0) {
    if (this._state !== ENGINE_STATES.ACTIVE && this._state !== ENGINE_STATES.AWAITING_RETRY) {
      throw new Error(`[GameEngine.submitAnswer] Submissions not permitted in state: ${this._state}`);
    }

    const raw = this._session.getCurrentQuestion();
    if (!raw) {
      throw new Error('[GameEngine.submitAnswer] No active question available.');
    }

    const attemptNumber = this._session.recordAttempt();
    const isRetry = attemptNumber > 1;
    const hasHint = this._hintManager.hasUsedHint(raw.id);

    // Evaluate answer through AnswerChecker
    const checkResult = AnswerChecker.check(raw, submission);

    if (checkResult.correct) {
      // Correct Submission: Calculate points, update streak, commit result
      const outcome = this._session.calculateOutcome(true, hasHint, isRetry, timeRemaining);
      this._session.commitResult({
        submission: checkResult.normalizedAnswer,
        attempts: attemptNumber,
        usedHint: hasHint,
        ...outcome
      });

      this._transitionTo(ENGINE_STATES.SHOWING_EXPLANATION, { outcome });
      this._emit('answer:correct', { outcome, explanation: raw.explanation });

      return {
        correct: true,
        canRetry: false,
        points: outcome.points,
        streak: outcome.streak,
        explanation: raw.explanation,
        message: 'Correct answer!'
      };
    } else {
      // Incorrect Submission: Check Second Chance retry eligibility (disabled in Hardcore)
      const isHardcore = this._session.mode === 'hardcore';
      const canRetry = !isHardcore && this._hintManager.canRetry(raw.id, attemptNumber);

      if (canRetry) {
        // Player activated a hint prior to answering -> Grant 1 Second Chance retry!
        this._transitionTo(ENGINE_STATES.AWAITING_RETRY, { attemptNumber });
        this._emit('answer:retry_available', { questionId: raw.id, attempts: attemptNumber });

        return {
          correct: false,
          canRetry: true,
          points: 0,
          streak: this._session.currentStreak,
          explanation: null, // Do not reveal explanation on retry
          message: 'Incorrect. Second Chance retry unlocked because you activated a hint!'
        };
      } else {
        // No retry available (or retry already failed) -> Finalize question as incorrect
        const outcome = this._session.calculateOutcome(false, hasHint, isRetry);
        this._session.commitResult({
          submission: checkResult.normalizedAnswer,
          attempts: attemptNumber,
          usedHint: hasHint,
          ...outcome
        });

        // Hardcore Mode: Terminate session immediately upon zero hearts
        if (this._session.isGameOver) {
          this._transitionTo(ENGINE_STATES.COMPLETED, {
            gameOver: true,
            lives: this._session.lives,
            summary: this._session.getSummary()
          });
          this._emit('session:game_over', this._session.getSummary());

          return {
            correct: false,
            canRetry: false,
            gameOver: true,
            lives: 0,
            points: 0,
            streak: 0,
            correctAnswer: raw.correctAnswer,
            explanation: raw.explanation,
            message: 'GAME OVER! You lost all hearts.'
          };
        }

        this._transitionTo(ENGINE_STATES.SHOWING_EXPLANATION, { outcome });
        this._emit('answer:incorrect', {
          outcome,
          correctAnswer: raw.correctAnswer,
          explanation: raw.explanation
        });

        return {
          correct: false,
          canRetry: false,
          lives: this._session.lives,
          points: 0,
          streak: 0,
          correctAnswer: raw.correctAnswer,
          explanation: raw.explanation,
          message: isHardcore ? `Incorrect! ${this._session.lives} heart(s) remaining.` : 'Incorrect answer.'
        };
      }
    }
  }

  /**
   * Advance to the next question in the session.
   * Can only be called while in SHOWING_EXPLANATION state.
   * @returns {{ advanced: boolean, completed: boolean, question: object|null }}
   */
  nextQuestion() {
    if (this._state !== ENGINE_STATES.SHOWING_EXPLANATION) {
      throw new Error(`[GameEngine.nextQuestion] Cannot advance to next question in state: ${this._state}`);
    }

    const hasNext = this._session.advance();

    if (hasNext) {
      this._transitionTo(ENGINE_STATES.ACTIVE, {
        questionIndex: this._session.currentIndex
      });
      return {
        advanced: true,
        completed: false,
        question: this.getCurrentQuestion()
      };
    } else {
      this._transitionTo(ENGINE_STATES.COMPLETED, {
        summary: this._session.getSummary()
      });
      this._emit('session:completed', this._session.getSummary());
      return {
        advanced: false,
        completed: true,
        question: null
      };
    }
  }

  /**
   * Forfeit or terminate the active session immediately.
   * @returns {object} Final session summary
   */
  forfeitSession() {
    if (this._state === ENGINE_STATES.IDLE || this._state === ENGINE_STATES.COMPLETED) {
      return this._session ? this._session.getSummary() : null;
    }

    this._session.isCompleted = true;
    this._session.endTime = Date.now();
    this._transitionTo(ENGINE_STATES.COMPLETED, { forfeited: true });
    this._emit('session:forfeited', this._session.getSummary());
    return this._session.getSummary();
  }

  /**
   * Retrieve complete performance summary of the session.
   * @returns {object|null}
   */
  getSessionSummary() {
    if (!this._session) return null;
    return this._session.getSummary();
  }

  /**
   * Event subscription helper.
   * @param {string} event
   * @param {Function} callback
   * @returns {Function} Unsubscribe
   */
  on(event, callback) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(callback);
    return () => this._listeners.get(event).delete(callback);
  }

  _emit(event, data) {
    if (this._listeners.has(event)) {
      this._listeners.get(event).forEach(cb => {
        try { cb(data); } catch (e) { console.error(`[GameEngine event:${event}]`, e); }
      });
    }
  }

  _transitionTo(nextState, context = {}) {
    const prevState = this._state;
    this._state = nextState;
    this._emit('state:change', { prevState, nextState, ...context });
  }
}
