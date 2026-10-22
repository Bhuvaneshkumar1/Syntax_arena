/**
 * SyntaxArena Question Bank Validator (Batch 4)
 * Comprehensive integrity validator for question schema, counts,
 * pedagogical rules, and answer keys.
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

export const ALLOWED_LANGUAGES = ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql', 'typescript'];
export const ALLOWED_DIFFICULTIES = ['beginner', 'intermediate', 'expert'];
export const ALLOWED_TYPES = [
  'multiple_choice', 'multiple-choice',
  'predict_output', 'predict-output',
  'find_bug', 'find-bug',
  'fill_code', 'fill-code', 'complete_code', 'complete-code',
  'code_tracing', 'code-tracing', 'trace_execution'
];

export const TIER_POINTS = {
  beginner: 100,
  intermediate: 200,
  expert: 300
};

export const QuestionValidator = {
  /**
   * Validate an array of question objects.
   * @param {Array} questions
   * @param {object} [options={ checkExactInventory: true }]
   * @returns {{ valid: boolean, errors: Array, warnings: Array, stats: object }}
   */
  validateAll(questions, options = { checkExactInventory: true }) {
    const errors = [];
    const warnings = [];

    if (!Array.isArray(questions)) {
      return {
        valid: false,
        errors: [{ message: 'Question catalog must be an array.' }],
        warnings: [],
        stats: {}
      };
    }

    const seenIds = new Set();
    const stats = {
      total: questions.length,
      byLanguage: { python: 0, c: 0, cpp: 0, java: 0, cyber: 0, javascript: 0, rust: 0, sql: 0, typescript: 0 },
      byTier: {
        python: { beginner: 0, intermediate: 0, expert: 0 },
        c: { beginner: 0, intermediate: 0, expert: 0 },
        cpp: { beginner: 0, intermediate: 0, expert: 0 },
        java: { beginner: 0, intermediate: 0, expert: 0 },
        cyber: { beginner: 0, intermediate: 0, expert: 0 },
        javascript: { beginner: 0, intermediate: 0, expert: 0 },
        rust: { beginner: 0, intermediate: 0, expert: 0 },
        sql: { beginner: 0, intermediate: 0, expert: 0 },
        typescript: { beginner: 0, intermediate: 0, expert: 0 }
      },
      byType: {}
    };

    questions.forEach((q, idx) => {
      const qErrors = this.validateQuestion(q, idx, seenIds);
      errors.push(...qErrors);

      // Collect counts
      if (q && q.language && stats.byLanguage[q.language] !== undefined) {
        stats.byLanguage[q.language]++;
        if (q.difficulty && stats.byTier[q.language][q.difficulty] !== undefined) {
          stats.byTier[q.language][q.difficulty]++;
        }
      }

      if (q && q.type) {
        stats.byType[q.type] = (stats.byType[q.type] || 0) + 1;
      }
    });

    // Check exact inventory matrix if requested
    if (options.checkExactInventory) {
      const expectedTotal = ALLOWED_LANGUAGES.length * 60;
      if (questions.length !== expectedTotal) {
        errors.push({
          field: 'totalCount',
          message: `Expected exactly ${expectedTotal} questions in catalog, found: ${questions.length}`
        });
      }

      ALLOWED_LANGUAGES.forEach(lang => {
        const langCount = stats.byLanguage[lang] || 0;
        if (langCount !== 60) {
          errors.push({
            language: lang,
            field: 'languageCount',
            message: `Language '${lang}' must have exactly 60 questions, found: ${langCount}`
          });
        }

        ALLOWED_DIFFICULTIES.forEach(diff => {
          const tierCount = (stats.byTier[lang] && stats.byTier[lang][diff]) || 0;
          if (tierCount !== 20) {
            errors.push({
              language: lang,
              difficulty: diff,
              field: 'tierCount',
              message: `Language '${lang}' tier '${diff}' must have exactly 20 questions, found: ${tierCount}`
            });
          }
        });
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      stats
    };
  },

  /**
   * Validate a single question object against the schema contract.
   * @param {object} q
   * @param {number} idx
   * @param {Set} seenIds
   * @returns {Array} List of validation error objects
   */
  validateQuestion(q, idx = 0, seenIds = new Set()) {
    const errs = [];

    if (!q || typeof q !== 'object') {
      errs.push({ index: idx, message: 'Question entry is not an object.' });
      return errs;
    }

    const qId = q.id || `unidentified_at_index_${idx}`;

    // 1. ID Validation
    if (!q.id || typeof q.id !== 'string') {
      errs.push({ id: qId, field: 'id', message: 'Missing or non-string ID.' });
    } else {
      if (seenIds.has(q.id)) {
        errs.push({ id: q.id, field: 'id', message: `Duplicate question ID: '${q.id}'` });
      }
      seenIds.add(q.id);

      const idPattern = /^(py|c|cpp|java|python|cyber|js|javascript|rust|sql|ts|typescript)-(beg|int|exp|beginner|intermediate|expert)-[0-9]{3}$/;
      if (!idPattern.test(q.id)) {
        errs.push({ id: q.id, field: 'id', message: `ID '${q.id}' does not match standard pattern format.` });
      }
    }

    // 2. Language & Difficulty
    if (!ALLOWED_LANGUAGES.includes(q.language)) {
      errs.push({ id: qId, field: 'language', message: `Invalid language '${q.language}'. Expected one of: ${ALLOWED_LANGUAGES.join(', ')}` });
    }

    if (!ALLOWED_DIFFICULTIES.includes(q.difficulty)) {
      errs.push({ id: qId, field: 'difficulty', message: `Invalid difficulty '${q.difficulty}'. Expected one of: ${ALLOWED_DIFFICULTIES.join(', ')}` });
    }

    // 3. Type
    if (!ALLOWED_TYPES.includes(q.type)) {
      errs.push({ id: qId, field: 'type', message: `Invalid question type '${q.type}'.` });
    }

    // 4. Prompt, Hint & Explanation
    if (!q.prompt || typeof q.prompt !== 'string' || q.prompt.trim().length < 5) {
      errs.push({ id: qId, field: 'prompt', message: 'Prompt must be a non-empty string of at least 5 characters.' });
    }

    if (!q.hint || typeof q.hint !== 'string' || q.hint.trim().length < 10) {
      errs.push({ id: qId, field: 'hint', message: 'Hint must be a helpful conceptual clue of at least 10 characters.' });
    }

    if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length < 30) {
      errs.push({ id: qId, field: 'explanation', message: 'Explanation must provide pedagogical reasoning of at least 30 characters.' });
    }

    // 5. Points
    const expectedPts = TIER_POINTS[q.difficulty];
    if (q.points !== undefined && q.points !== expectedPts) {
      errs.push({ id: qId, field: 'points', message: `Points (${q.points}) does not match standard tier points (${expectedPts}) for ${q.difficulty}.` });
    }

    // 6. Format-specific Invariants
    const cleanType = String(q.type || '').replace(/-/g, '_');

    if (cleanType === 'multiple_choice' || cleanType === 'predict_output') {
      if (Array.isArray(q.options)) {
        if (q.options.length < 2) {
          errs.push({ id: qId, field: 'options', message: 'Multiple choice questions must have at least 2 options.' });
        }

        // Verify correct answer is represented in options
        const optStrings = q.options.map(o => typeof o === 'object' && o !== null ? String(o.text || o.id) : String(o));
        const correctStr = String(q.correctAnswer);
        const matchesOption = optStrings.some(o => o.trim().toLowerCase() === correctStr.trim().toLowerCase());

        if (!matchesOption && cleanType === 'multiple_choice') {
          errs.push({
            id: qId,
            field: 'correctAnswer',
            message: `correctAnswer ('${correctStr}') does not match any entry in options: [${optStrings.join(', ')}]`
          });
        }
      }
    }

    if (cleanType === 'find_bug') {
      if (!q.code || typeof q.code !== 'string') {
        errs.push({ id: qId, field: 'code', message: 'find_bug questions require a non-empty code snippet.' });
      } else {
        const lineCount = q.code.split('\n').length;
        const target = q.targetLine !== undefined ? q.targetLine : q.correctAnswer;
        const targetNum = Number(target);
        if (isNaN(targetNum) || targetNum < 1 || targetNum > lineCount) {
          errs.push({
            id: qId,
            field: 'targetLine',
            message: `targetLine (${target}) is out of range [1, ${lineCount}].`
          });
        }
      }
    }

    if (cleanType === 'fill_code' || cleanType === 'complete_code') {
      if (!q.code || typeof q.code !== 'string') {
        errs.push({ id: qId, field: 'code', message: 'fill_code questions require a code template with blanks.' });
      }
      if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer === '') {
        errs.push({ id: qId, field: 'correctAnswer', message: 'fill_code questions must specify the required filling token(s).' });
      }
    }

    return errs;
  }
};
