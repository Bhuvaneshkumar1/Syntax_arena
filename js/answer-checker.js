/**
 * SyntaxArena Answer Checker Module (Batch 4)
 * Pure validation engine for checking user submissions against question contracts.
 * Supports: multiple_choice, predict_output, find_bug, fill_code, code_tracing.
 * Source of truth: docs/QUESTION_SCHEMA.md & docs/GAME_RULES.md
 */

export const AnswerChecker = {
  /**
   * Evaluate a user submission against a question definition.
   * @param {object} question - The question data object
   * @param {any} submission - The user's submitted answer
   * @returns {{ correct: boolean, normalizedAnswer: any, message: string }}
   */
  check(question, submission) {
    if (!question || typeof question !== 'object') {
      return { correct: false, normalizedAnswer: null, message: 'Invalid question object.' };
    }
    if (submission === null || submission === undefined || submission === '') {
      return { correct: false, normalizedAnswer: null, message: 'Empty submission.' };
    }

    const type = this._normalizeType(question.type);

    switch (type) {
      case 'find_bug':
        return this.checkFindBug(question, submission);

      case 'fill_code':
        return this.checkFillCode(question, submission);

      case 'predict_output':
      case 'code_tracing':
        return this.checkPredictOutput(question, submission);

      case 'multiple_choice':
      default:
        return this.checkMultipleChoice(question, submission);
    }
  },

  /**
   * Normalize question type identifier.
   */
  _normalizeType(rawType) {
    if (!rawType) return 'multiple_choice';
    const clean = String(rawType).toLowerCase().replace(/-/g, '_');
    if (clean === 'complete_code' || clean === 'fill_in_the_code') return 'fill_code';
    if (clean === 'trace_execution') return 'code_tracing';
    return clean;
  },

  /**
   * Check Multiple Choice Question.
   */
  checkMultipleChoice(question, submission) {
    const options = question.options || [];
    const correct = question.correctAnswer;
    const accepted = question.acceptedAnswers || [];

    let selectedText = null;

    // 0. Priority Check: Does submission directly match any option text or object?
    const rawStr = String(submission || '').trim();
    const directOpt = options.find(opt => {
      const optStr = typeof opt === 'object' && opt !== null ? (opt.text || opt.id) : String(opt);
      return this._normalizeWhitespace(optStr).toLowerCase() === this._normalizeWhitespace(rawStr).toLowerCase();
    });

    if (directOpt) {
      selectedText = typeof directOpt === 'object' && directOpt !== null ? (directOpt.text || directOpt.id) : String(directOpt);
    }
    // 1. Check if submission is numeric index (0, 1, 2, 3)
    else if (typeof submission === 'number' && Number.isInteger(submission)) {
      if (submission >= 0 && submission < options.length) {
        const opt = options[submission];
        selectedText = typeof opt === 'object' && opt !== null ? opt.text : String(opt);
      }
    }
    // 2. Check if submission is string index or letter ("A", "B", "C", "D" or "0", "1", "2")
    else if (typeof submission === 'string') {
      const trimmed = submission.trim();
      const upper = trimmed.toUpperCase();
      const letterIndex = ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(upper);

      if (letterIndex >= 0 && letterIndex < options.length) {
        const opt = options[letterIndex];
        selectedText = typeof opt === 'object' && opt !== null ? opt.text : String(opt);
      } else if (/^\d+$/.test(trimmed)) {
        const idx = parseInt(trimmed, 10);
        if (idx >= 0 && idx < options.length) {
          const opt = options[idx];
          selectedText = typeof opt === 'object' && opt !== null ? opt.text : String(opt);
        }
      } else {
        selectedText = trimmed;
      }
    } else if (typeof submission === 'object' && submission !== null && submission.text) {
      selectedText = String(submission.text).trim();
    }

    if (!selectedText) {
      return { correct: false, normalizedAnswer: submission, message: 'Invalid option selection.' };
    }

    // Compare with correctAnswer and acceptedAnswers
    const isDirectMatch = this._matchesAny(selectedText, [correct, ...accepted]);
    return {
      correct: isDirectMatch,
      normalizedAnswer: selectedText,
      message: isDirectMatch ? 'Correct answer.' : 'Incorrect option selected.'
    };
  },

  /**
   * Check Predict Output Question.
   */
  checkPredictOutput(question, submission) {
    const correct = question.correctAnswer || question.expectedOutput;
    const accepted = question.acceptedAnswers || [];
    const targets = [correct, question.expectedOutput, ...accepted].filter(Boolean);

    // If question has options, evaluate as multiple choice or direct text
    if (Array.isArray(question.options) && question.options.length > 0) {
      const mcqResult = this.checkMultipleChoice(question, submission);
      if (mcqResult.correct) {
        return mcqResult;
      }
    }

    // Direct output text comparison
    const subStr = String(submission).trim();
    const isMatch = this._matchesAny(subStr, targets);

    return {
      correct: isMatch,
      normalizedAnswer: subStr,
      message: isMatch ? 'Correct output prediction.' : 'Output does not match expected result.'
    };
  },

  /**
   * Check Find the Bug Question.
   */
  checkFindBug(question, submission) {
    const targetLine = question.targetLine !== undefined ? question.targetLine : question.correctAnswer;
    const accepted = question.acceptedAnswers || [];

    let userLine = null;
    if (typeof submission === 'number') {
      userLine = submission;
    } else if (typeof submission === 'string') {
      const match = submission.match(/\d+/);
      if (match) {
        userLine = parseInt(match[0], 10);
      }
    } else if (typeof submission === 'object' && submission !== null && submission.line !== undefined) {
      userLine = parseInt(submission.line, 10);
    }

    const isDirectAccepted = accepted.some(a => String(a).trim().toLowerCase() === String(submission).trim().toLowerCase());

    if (userLine === null && !isDirectAccepted) {
      return { correct: false, normalizedAnswer: submission, message: 'Invalid line selection.' };
    }

    const isMatch = isDirectAccepted || (userLine === Number(targetLine)) || accepted.some(a => Number(a) === userLine);

    return {
      correct: isMatch,
      normalizedAnswer: userLine,
      message: isMatch ? 'Bug line successfully pinpointed.' : `Line ${userLine} does not contain the defect.`
    };
  },

  /**
   * Check Complete the Code Question.
   */
  checkFillCode(question, submission) {
    const correct = question.correctAnswer;
    const accepted = question.acceptedAnswers || [];

    // If options are provided, check MCQ style
    if (Array.isArray(question.options) && question.options.length > 0) {
      const mcqResult = this.checkMultipleChoice(question, submission);
      if (mcqResult.correct) {
        return mcqResult;
      }
    }

    // Multi-blank array submission
    if (Array.isArray(submission)) {
      const subTokens = submission.map(s => String(s).trim());
      let isMatch = false;

      if (Array.isArray(correct)) {
        isMatch = subTokens.length === correct.length &&
                  subTokens.every((t, i) => this._compareTokens(t, correct[i]));
      }

      return {
        correct: isMatch,
        normalizedAnswer: subTokens,
        message: isMatch ? 'Code tokens slotted correctly.' : 'Code tokens do not match required template.'
      };
    }

    // Single blank string token
    const subToken = String(submission).trim();
    const targets = [correct, ...accepted].filter(Boolean);
    const isMatch = targets.some(t => this._compareTokens(subToken, t));

    return {
      correct: isMatch,
      normalizedAnswer: subToken,
      message: isMatch ? 'Code token matched.' : 'Incorrect syntax token.'
    };
  },

  /**
   * Helper: compare candidate against target array with whitespace normalization.
   */
  _matchesAny(candidate, targets) {
    if (!candidate) return false;
    const normCand = this._normalizeWhitespace(candidate);

    return targets.some(t => {
      if (t === null || t === undefined) return false;
      const normTarget = this._normalizeWhitespace(String(t));
      return normCand.toLowerCase() === normTarget.toLowerCase() || normCand === normTarget;
    });
  },

  /**
   * Helper: compare two code tokens ignoring peripheral spaces.
   */
  _compareTokens(a, b) {
    if (a === null || a === undefined || b === null || b === undefined) return false;
    return String(a).replace(/\s+/g, ' ').trim() === String(b).replace(/\s+/g, ' ').trim();
  },

  /**
   * Normalize CRLF/LF and collapse multiple spaces while preserving meaningful indentation.
   */
  _normalizeWhitespace(str) {
    return String(str)
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }
};
