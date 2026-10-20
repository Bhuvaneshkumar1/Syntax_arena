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
