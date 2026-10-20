/**
 * SyntaxArena Question Catalog Aggregator
 * Unified access to Python, C, C++, and Java challenges.
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

import { pythonQuestions } from '../../data/python-questions.js';
import { cQuestions } from '../../data/c-questions.js';
import { cppQuestions } from '../../data/cpp-questions.js';
import { javaQuestions } from '../../data/java-questions.js';

export const LANGUAGE_METADATA = {
  python: {
    id: 'python',
    name: 'Python 3',
    version: 'Python 3.10+',
    filename: 'solution.py',
    tagClass: 'tag-python',
    color: '#3776AB',
    accentColor: '#FFD438'
  },
  c: {
    id: 'c',
    name: 'C (C99/C11)',
    version: 'C99 Standard',
    filename: 'solution.c',
    tagClass: 'tag-c',
    color: '#659AD2',
    accentColor: '#A5D6FF'
  },
  cpp: {
    id: 'cpp',
    name: 'C++ (C++20)',
    version: 'C++17/C++20',
    filename: 'solution.cpp',
    tagClass: 'tag-cpp',
    color: '#00599C',
    accentColor: '#79C0FF'
  },
  java: {
    id: 'java',
    name: 'Java (SE 17)',
    version: 'Java 17 LTS',
    filename: 'Solution.java',
    tagClass: 'tag-java',
    color: '#EA2D2E',
    accentColor: '#FFA657'
  }
};

export const QuestionRepository = {
  /**
   * Get all questions for a given language.
   * @param {'python'|'c'|'cpp'|'java'} lang
   * @returns {Array}
   */
  getByLanguage(lang) {
    const key = (lang || 'python').toLowerCase();
    switch (key) {
      case 'c': return cQuestions;
      case 'cpp': return cppQuestions;
      case 'java': return javaQuestions;
      case 'python':
      default:
        return pythonQuestions;
    }
  },

  /**
   * Get a single question by language, difficulty, and index.
   * @param {string} lang
   * @param {string} [difficulty]
   * @param {number} [index=0]
   */
  getQuestion(lang, difficulty = 'beginner', index = 0) {
    const list = this.getByLanguage(lang);
    const filtered = difficulty ? list.filter(q => q.difficulty === difficulty) : list;
    const pool = filtered.length > 0 ? filtered : list;
    const safeIdx = Math.max(0, Math.min(index, pool.length - 1));
    return pool[safeIdx] || pool[0];
  },

  /**
   * Get language presentation metadata.
   */
  getLanguageMeta(lang) {
    const key = (lang || 'python').toLowerCase();
    return LANGUAGE_METADATA[key] || LANGUAGE_METADATA.python;
  }
};
