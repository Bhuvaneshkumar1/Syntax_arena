/**
 * SyntaxArena Question Bank Repository (Batch 4)
 * Central registry for all 240 curated programming questions across Python, C, C++, and Java.
 * Provides immutable retrieval, indexed lookups, and integrity validation.
 * Source of truth: docs/QUESTION_SCHEMA.md & docs/GAME_RULES.md
 */

import { pythonQuestions } from '../data/python-questions.js';
import { cQuestions } from '../data/c-questions.js';
import { cppQuestions } from '../data/cpp-questions.js';
import { javaQuestions } from '../data/java-questions.js';
import { cyberQuestions } from '../data/cyber-questions.js';
import { javascriptQuestions } from '../data/javascript-questions.js';
import { rustQuestions } from '../data/rust-questions.js';
import { sqlQuestions } from '../data/sql-questions.js';
import { typescriptQuestions } from '../data/typescript-questions.js';
import { goQuestions } from '../data/go-questions.js';
import { htmlQuestions } from '../data/html-questions.js';
import { asmQuestions } from '../data/asm-questions.js';
import { endlessQuestions } from '../data/endless-questions.js';
import { QuestionValidator } from './question-validator.js';

// Aggregate master collection
const ALL_QUESTIONS = Object.freeze([
  ...pythonQuestions,
  ...cQuestions,
  ...cppQuestions,
  ...javaQuestions,
  ...cyberQuestions,
  ...javascriptQuestions,
  ...rustQuestions,
  ...sqlQuestions,
  ...typescriptQuestions,
  ...goQuestions,
  ...htmlQuestions,
  ...asmQuestions
]);

// Build index maps for fast O(1) lookups
const ID_INDEX = new Map();
const LANG_TIER_INDEX = {
  python: { beginner: [], intermediate: [], expert: [] },
  c: { beginner: [], intermediate: [], expert: [] },
  cpp: { beginner: [], intermediate: [], expert: [] },
  java: { beginner: [], intermediate: [], expert: [] },
  cyber: { beginner: [], intermediate: [], expert: [] },
  javascript: { beginner: [], intermediate: [], expert: [] },
  rust: { beginner: [], intermediate: [], expert: [] },
  sql: { beginner: [], intermediate: [], expert: [] },
  typescript: { beginner: [], intermediate: [], expert: [] },
  go: { beginner: [], intermediate: [], expert: [] },
  html: { beginner: [], intermediate: [], expert: [] },
  asm: { beginner: [], intermediate: [], expert: [] }
};

ALL_QUESTIONS.forEach(q => {
  ID_INDEX.set(q.id, q);
  if (LANG_TIER_INDEX[q.language] && LANG_TIER_INDEX[q.language][q.difficulty]) {
    LANG_TIER_INDEX[q.language][q.difficulty].push(q);
  }
});

// Also index all endless questions into ID_INDEX for fast recovery
if (typeof endlessQuestions === 'object' && endlessQuestions !== null) {
  Object.values(endlessQuestions).forEach(list => {
    if (Array.isArray(list)) {
      list.forEach(q => {
        if (q && q.id && !ID_INDEX.has(q.id)) {
          ID_INDEX.set(q.id, q);
        }
      });
    }
  });
}

/**
 * Deep-clone a question object to prevent external mutation.
 * @param {object} q
 * @returns {object}
 */
function cloneQuestion(q) {
  if (!q) return null;
  return JSON.parse(JSON.stringify(q));
}

export const QuestionBank = {
  /**
   * Total number of questions in catalog.
   */
  get size() {
    return ALL_QUESTIONS.length;
  },

  /**
   * Return a cloned copy of all questions in the bank.
   * @returns {Array}
   */
  getAll() {
    return ALL_QUESTIONS.map(cloneQuestion);
  },

  /**
   * Get raw un-cloned list (internal read-only reference).
   * @returns {Array}
   */
  getRawAll() {
    return ALL_QUESTIONS;
  },

  /**
   * Retrieve all questions for a specified language.
   * @param {'python'|'c'|'cpp'|'java'} language
   * @returns {Array}
   */
  getByLanguage(language) {
    const lang = (language || '').toLowerCase().trim();
    return ALL_QUESTIONS
      .filter(q => q.language === lang)
      .map(cloneQuestion);
  },

  /**
   * Retrieve all questions for a specific language and difficulty tier.
   * @param {'python'|'c'|'cpp'|'java'} language
   * @param {'beginner'|'intermediate'|'expert'} difficulty
   * @returns {Array}
   */
  getByDifficulty(language, difficulty) {
    const lang = (language || '').toLowerCase().trim();
    const diff = (difficulty || '').toLowerCase().trim();
    const pool = (LANG_TIER_INDEX[lang] && LANG_TIER_INDEX[lang][diff]) || [];
    return pool.map(cloneQuestion);
  },

  /**
   * Get 200 questions for Endless Mode in a given language.
   * @param {string} language
   * @returns {Array} 200 questions
   */
  getEndlessQuestions(language) {
    const lang = (language || 'python').toLowerCase().trim();
    const list = (endlessQuestions && endlessQuestions[lang]) || [];
    if (Array.isArray(list) && list.length > 0) {
      return list.map(cloneQuestion);
    }
    return this.getByLanguage(lang);
  },

  /**
   * Find a single question by its unique identifier.
   * @param {string} id
   * @returns {object|null}
   */
  getById(id) {
    const q = ID_INDEX.get(id);
    return q ? cloneQuestion(q) : null;
  },

  /**
   * Filter questions using a custom predicate function.
   * @param {function(object): boolean} predicate
   * @returns {Array}
   */
  filter(predicate) {
    if (typeof predicate !== 'function') return [];
    return ALL_QUESTIONS.filter(predicate).map(cloneQuestion);
  },

  /**
   * Get aggregated statistical summary of question inventory.
   * @returns {{ total: number, byLanguage: object, byTier: object, byType: object }}
   */
  getStats() {
    const stats = {
      total: ALL_QUESTIONS.length,
      byLanguage: { python: 0, c: 0, cpp: 0, java: 0, cyber: 0, javascript: 0, rust: 0, sql: 0, typescript: 0, go: 0, html: 0, asm: 0 },
      byTier: {
        python: { beginner: 0, intermediate: 0, expert: 0 },
        c: { beginner: 0, intermediate: 0, expert: 0 },
        cpp: { beginner: 0, intermediate: 0, expert: 0 },
        java: { beginner: 0, intermediate: 0, expert: 0 },
        cyber: { beginner: 0, intermediate: 0, expert: 0 },
        javascript: { beginner: 0, intermediate: 0, expert: 0 },
        rust: { beginner: 0, intermediate: 0, expert: 0 },
        sql: { beginner: 0, intermediate: 0, expert: 0 },
        typescript: { beginner: 0, intermediate: 0, expert: 0 },
        go: { beginner: 0, intermediate: 0, expert: 0 },
        html: { beginner: 0, intermediate: 0, expert: 0 },
        asm: { beginner: 0, intermediate: 0, expert: 0 }
      },
      byType: {}
    };

    ALL_QUESTIONS.forEach(q => {
      if (stats.byLanguage[q.language] !== undefined) {
        stats.byLanguage[q.language]++;
      }
      if (stats.byTier[q.language] && stats.byTier[q.language][q.difficulty] !== undefined) {
        stats.byTier[q.language][q.difficulty]++;
      }
      const type = q.type || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  },

  /**
   * Validate the entire question bank against the specification schema.
   * @param {object} [options]
   * @returns {{ valid: boolean, errors: Array, warnings: Array, stats: object }}
   */
  validate(options = { checkExactInventory: true }) {
    return QuestionValidator.validateAll(ALL_QUESTIONS, options);
  },

  /**
   * Deterministically retrieve daily questions based on calendar date seed.
   * @param {string} [dateStr=null] YYYY-MM-DD
   * @param {number} [count=3]
   * @returns {Array}
   */
  getDailyQuestions(dateStr = null, count = 3) {
    const today = dateStr || new Date().toISOString().slice(0, 10);
    let seed = 0;
    for (let i = 0; i < today.length; i++) {
      seed = (seed << 5) - seed + today.charCodeAt(i);
      seed |= 0;
    }
    // Filter to questions that have multiple-choice options for rapid deduction
    const all = ALL_QUESTIONS.filter(q => Array.isArray(q.options) && q.options.length >= 2);
    if (!all.length) return [];

    const selected = [];
    const usedIndices = new Set();
    let curSeed = Math.abs(seed) + 42;

    const pseudoRand = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    while (selected.length < count && usedIndices.size < all.length) {
      curSeed += 1;
      const idx = Math.floor(pseudoRand(curSeed) * all.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        selected.push(cloneQuestion(all[idx]));
      }
    }
    return selected;
  }
};
