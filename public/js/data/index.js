/**
 * SyntaxArena Question Catalog Aggregator
 * Unified access to Python, C, C++, and Java challenges.
 * Source of truth: docs/QUESTION_SCHEMA.md
 */

import { pythonQuestions } from '../../data/python-questions.js';
import { cQuestions } from '../../data/c-questions.js';
import { cppQuestions } from '../../data/cpp-questions.js';
import { javaQuestions } from '../../data/java-questions.js';
import { cyberQuestions } from '../../data/cyber-questions.js';
import { javascriptQuestions } from '../../data/javascript-questions.js';
import { rustQuestions } from '../../data/rust-questions.js';
import { sqlQuestions } from '../../data/sql-questions.js';
import { typescriptQuestions } from '../../data/typescript-questions.js';
import { goQuestions } from '../../data/go-questions.js';
import { endlessQuestions } from '../../data/endless-questions.js';

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
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber & Linux',
    version: 'Linux / Bash & InfoSec',
    filename: 'exploit.sh',
    tagClass: 'tag-cyber',
    color: '#00FF66',
    accentColor: '#39FF14'
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript (ES2024)',
    version: 'ECMAScript 2024',
    filename: 'app.js',
    tagClass: 'tag-javascript',
    color: '#F7DF1E',
    accentColor: '#FFE600'
  },
  rust: {
    id: 'rust',
    name: 'Rust (2021)',
    version: 'Rust 2021 Edition',
    filename: 'main.rs',
    tagClass: 'tag-rust',
    color: '#DEA584',
    accentColor: '#F74C00'
  },
  sql: {
    id: 'sql',
    name: 'SQL (ANSI/PostgreSQL)',
    version: 'ANSI SQL / PostgreSQL 15+',
    filename: 'query.sql',
    tagClass: 'tag-sql',
    color: '#336791',
    accentColor: '#4AA3DF'
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript (v5+)',
    version: 'TypeScript 5.4+',
    filename: 'solution.ts',
    tagClass: 'tag-typescript',
    color: '#3178C6',
    accentColor: '#58A6FF'
  },
  go: {
    id: 'go',
    name: 'Go (Golang)',
    version: 'Go 1.22+',
    filename: 'main.go',
    tagClass: 'tag-go',
    color: '#00ADD8',
    accentColor: '#29BEB0'
  }
};

export const QuestionRepository = {
  /**
   * Get all questions for a given language.
   * @param {'python'|'c'|'cpp'|'java'|'cyber'|'javascript'|'rust'|'sql'|'typescript'|'go'} lang
   * @returns {Array}
   */
  getByLanguage(lang) {
    const key = (lang || 'python').toLowerCase();
    switch (key) {
      case 'c': return cQuestions;
      case 'cpp': return cppQuestions;
      case 'java': return javaQuestions;
      case 'cyber': return cyberQuestions;
      case 'js':
      case 'javascript': return javascriptQuestions;
      case 'rust': return rustQuestions;
      case 'sql': return sqlQuestions;
      case 'ts':
      case 'typescript': return typescriptQuestions;
      case 'go':
      case 'golang': return goQuestions;
      case 'python':
      default:
        return pythonQuestions;
    }
  },

  /**
   * Get 200 questions for Endless Mode in a given language.
   * @param {string} lang
   * @returns {Array} 200 questions
   */
  getEndlessQuestions(lang) {
    const key = (lang || 'python').toLowerCase();
    const list = (endlessQuestions && endlessQuestions[key]) || [];
    return list.length > 0 ? list : this.getByLanguage(lang);
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
