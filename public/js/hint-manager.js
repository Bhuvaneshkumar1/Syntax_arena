/**
 * SyntaxArena Hint & Second-Chance Retry Manager (Batch 4)
 * Governs hint retrieval, scoring penalties, and Second-Chance retry eligibility.
 * Source of truth: docs/GAME_RULES.md (Sections 1.4 & ADR-07)
 */

export const HINT_PENALTIES = {
  beginner: 25,     // 25% of 100 base pts
  intermediate: 60, // 30% of 200 base pts
  expert: 100       // 33.3% of 300 base pts
};

export class HintManager {
  constructor() {
    this._usedHints = new Set(); // Stores question IDs where hint was requested
  }

  /**
   * Request a hint for a specific question.
   * @param {object} question
   * @returns {{ success: boolean, hint: string|null, penalty: number, message: string }}
   */
  requestHint(question) {
    if (!question || !question.id) {
      return { success: false, hint: null, penalty: 0, message: 'Invalid question.' };
    }

    const qId = question.id;
    const diff = (question.difficulty || 'beginner').toLowerCase();
    const penalty = HINT_PENALTIES[diff] || HINT_PENALTIES.beginner;

    // Hint already activated for this question (no double penalty)
    if (this._usedHints.has(qId)) {
      return {
        success: true,
        hint: question.hint || 'No additional clue available for this challenge.',
        penalty: 0,
        alreadyActive: true,
        message: 'Hint already unlocked for this challenge.'
      };
    }

    this._usedHints.add(qId);

    return {
      success: true,
      hint: question.hint || 'Review standard language specification for syntax rules.',
      penalty: penalty,
      alreadyActive: false,
      message: `Hint unlocked. Penalty: -${penalty} pts.`
    };
  }

  /**
   * Check if a hint was activated for a specific question.
   * @param {string} questionId
   * @returns {boolean}
   */
  hasUsedHint(questionId) {
    return this._usedHints.has(questionId);
  }

  /**
   * Determine if the player is eligible for a Second Chance retry.
   * Rule (ADR-07 & GAME_RULES.md §1.4):
   * A player is granted exactly ONE retry on an incorrect submission
   * IF AND ONLY IF they activated a Hint prior to submitting.
   * @param {string} questionId
   * @param {number} attemptCount - Number of attempts made so far
   * @returns {boolean}
   */
  canRetry(questionId, attemptCount) {
    if (attemptCount !== 1) return false;
    return this.hasUsedHint(questionId);
  }

  /**
   * Get standard hint penalty for a difficulty level.
   * @param {'beginner'|'intermediate'|'expert'} difficulty
   * @returns {number}
   */
  getPenaltyForDifficulty(difficulty) {
    const diff = (difficulty || 'beginner').toLowerCase();
    return HINT_PENALTIES[diff] || HINT_PENALTIES.beginner;
  }

  /**
   * Clear all hint tracking.
   */
  reset() {
    this._usedHints.clear();
  }
}
