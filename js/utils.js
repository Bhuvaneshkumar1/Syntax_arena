/**
 * SyntaxArena Utility Library
 * Reusable, side-effect free helpers
 */

export const Utils = {
  /**
   * Escape special HTML characters to prevent XSS injection.
   * @param {string} str
   * @returns {string}
   */
  escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, m => map[m]);
  },

  /**
   * Alias for escapeHTML.
   */
  escapeHtml(str) {
    return this.escapeHTML(str);
  },

  /**
   * Prototype-pollution safe JSON parser.
   * Strips __proto__, constructor, and prototype properties during parsing.
   * @param {string} str
   * @param {*} [fallback=null]
   * @returns {*}
   */
  safeJsonParse(str, fallback = null) {
    if (typeof str !== 'string' || !str.trim()) return fallback;
    try {
      return JSON.parse(str, (key, value) => {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return undefined;
        }
        return value;
      });
    } catch (_) {
      return fallback;
    }
  },

  /**
   * Deep sanitize an object to strip prototype pollution vectors and dangerous keys.
   * @param {*} obj
   * @returns {*}
   */
  sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }
    const clean = Object.create(null);
    for (const [k, v] of Object.entries(obj)) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      clean[k] = this.sanitizeObject(v);
    }
    return Object.assign({}, clean);
  },

  /**
   * Sanitize text against control characters, null bytes, and HTML injection.
   * @param {string} str
   * @returns {string}
   */
  sanitizeText(str) {
    if (typeof str !== 'string') return '';
    // Strip null bytes and non-printable control characters except newline and tab
    const clean = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    return this.escapeHTML(clean);
  },

  /**
   * Safe document.querySelector wrapper.
   * @param {string} selector
   * @param {Element|Document} [parent=document]
   * @returns {Element|null}
   */
  qs(selector, parent = document) {
    try {
      return parent.querySelector(selector);
    } catch (err) {
      console.warn(`[Utils.qs] Invalid selector: ${selector}`, err);
      return null;
    }
  },

  /**
   * Safe document.querySelectorAll wrapper returning an Array.
   * @param {string} selector
   * @param {Element|Document} [parent=document]
   * @returns {Element[]}
   */
  qsa(selector, parent = document) {
    try {
      return Array.from(parent.querySelectorAll(selector));
    } catch (err) {
      console.warn(`[Utils.qsa] Invalid selector: ${selector}`, err);
      return [];
    }
  },

  /**
   * Add event listener with auto-cleanup helper.
   * @param {EventTarget} target
   * @param {string} event
   * @param {Function} handler
   * @param {object|boolean} [options=false]
   * @returns {Function} Unsubscribe function
   */
  on(target, event, handler, options = false) {
    if (!target || typeof target.addEventListener !== 'function') {
      return () => {};
    }
    target.addEventListener(event, handler, options);
    return () => target.removeEventListener(event, handler, options);
  },

  /**
   * Debounce a function call.
   * @param {Function} fn
   * @param {number} waitMs
   * @returns {Function}
   */
  debounce(fn, waitMs = 250) {
    let timeoutId = null;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
      }, waitMs);
    };
  },

  /**
   * Generate a unique prefixed identifier.
   * @param {string} prefix
   * @returns {string}
   */
  generateId(prefix = 'id') {
    const randomHex = Math.random().toString(16).substring(2, 10);
    const timeHex = Date.now().toString(16).slice(-4);
    return `${prefix}-${timeHex}${randomHex}`;
  },

  /**
   * Clamp a numerical value between min and max bounds.
   * @param {number} val
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  },

  /**
   * Safe check for localStorage availability (handles iOS private browsing and disabled cookies).
   * @returns {boolean}
   */
  isStorageAvailable() {
    try {
      const testKey = '__syntaxarena_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
};
