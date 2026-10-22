/**
 * SyntaxArena Router & Page Navigation Coordinator
 * Minimal multi-page routing helper supporting native browser navigation.
 * Source of truth: docs/ARCHITECTURE.md
 */

import { State } from './state.js';

export const Router = {
  /**
   * Determine the current page identifier from DOM landmarks, data-page, or the window URL.
   * Fully robust across local file://, clean URLs, and Vercel server rewrites.
   * @returns {'index'|'game'|'results'|'progress'|'settings'}
   */
  getCurrentPage() {
    // 1. Authoritative check: data-page on body tag
    if (typeof document !== 'undefined' && document.body) {
      const bodyPage = document.body.getAttribute('data-page');
      if (bodyPage && ['index', 'game', 'results', 'progress', 'settings', 'learn'].includes(bodyPage)) {
        return bodyPage;
      }
    }

    // 2. Unambiguous DOM landmark checks
    if (typeof document !== 'undefined') {
      if (document.getElementById('academy-workspace-card') ||
          document.getElementById('academy-lang-select')) {
        return 'learn';
      }
      if (document.getElementById('answer-interface-container') ||
          document.getElementById('code-terminal-container') ||
          document.getElementById('q-prompt-text') ||
          document.getElementById('gameplay-live-announcer')) {
        return 'game';
      }
      if (document.getElementById('results-progress-ring') ||
          document.getElementById('results-grade-display') ||
          document.getElementById('question-review-list')) {
        return 'results';
      }
      if (document.getElementById('trend-svg-container') ||
          document.getElementById('language-performance-grid') ||
          document.getElementById('badges-grid-container')) {
        return 'progress';
      }
      if (document.getElementById('setting-theme-dark') ||
          document.getElementById('btn-reset-account') ||
          document.getElementById('setting-reduced-motion') ||
          document.getElementById('setting-audio-sfx')) {
        return 'settings';
      }
      if (document.getElementById('language-tracks-container') ||
          document.getElementById('difficulty-cards-container') ||
          document.getElementById('hero-preview-code')) {
        return 'index';
      }
    }

    // 3. Robust URL Pathname & Clean URL Check
    if (typeof window !== 'undefined' && window.location) {
      const path = (window.location.pathname || '').toLowerCase().replace(/\/+$/, '');
      const segments = path.split('/').filter(Boolean);
      const last = segments.length > 0 ? segments[segments.length - 1] : '';
      const hash = (window.location.hash || '').toLowerCase();

      if (last === 'learn' || last === 'learn.html' || last === 'academy' ||
          path.endsWith('learn.html') || path.endsWith('/learn') || path.includes('/academy') ||
          hash.includes('/academy')) {
        return 'learn';
      }
      if (last === 'game' || last === 'game.html' || last === 'arena' ||
          path.endsWith('game.html') || path.endsWith('/game') || path.includes('/arena') ||
          hash.includes('/arena')) {
        return 'game';
      }

      if (last === 'results' || last === 'results.html' ||
          path.endsWith('results.html') || path.endsWith('/results') || path.includes('/results') ||
          hash.includes('/results')) {
        return 'results';
      }

      if (last === 'progress' || last === 'progress.html' || last === 'progression' ||
          path.endsWith('progress.html') || path.endsWith('/progress') || path.includes('/progression') ||
          hash.includes('/progression') || hash.includes('/progress')) {
        return 'progress';
      }

      if (last === 'settings' || last === 'settings.html' ||
          path.endsWith('settings.html') || path.endsWith('/settings') || path.includes('/settings') ||
          hash.includes('/settings')) {
        return 'settings';
      }

      if (last === 'index' || last === 'index.html' || last === 'hub' ||
          path === '' || path === '/' || hash.includes('/hub')) {
        return 'index';
      }
    }

    return 'index'; // Default fallback
  },

  /**
   * Mask the browser address bar with a UUID session path instead of raw HTML file names.
   * Preserves query parameters from window.location.search or existing hash.
   * @param {string} pageType ('index'|'game'|'results'|'progress'|'settings')
   */
  maskUrlWithUUID(pageType) {
    if (typeof window === 'undefined' || !window.history || !window.history.replaceState) return;
    try {
      const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;

      const routeSegments = {
        index: 'hub',
        game: 'arena',
        results: 'results',
        progress: 'progression',
        settings: 'settings'
      };

      const segment = routeSegments[pageType] || 'arena';

      // Preserve search query params from window.location.search OR from existing hash
      let search = window.location.search || '';
      if (!search && window.location.hash && window.location.hash.includes('?')) {
        search = '?' + window.location.hash.split('?')[1];
      }

      const maskedUrl = `#/${segment}/${uuid}${search}`;

      window.history.replaceState({ page: pageType, uuid }, '', maskedUrl);
    } catch (_) {}
  },

  /**
   * Extract search query parameters from current URL (supports search and hash).
   * @returns {Record<string, string>}
   */
  getQueryParams() {
    const result = {};
    if (typeof window === 'undefined') return result;

    // 1. Standard URL search parameters
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      for (const [key, value] of params.entries()) {
        result[key.toLowerCase()] = value;
      }
    }

    // 2. Query parameters embedded inside the hash
    if (window.location.hash && window.location.hash.includes('?')) {
      const hashSearch = window.location.hash.split('?')[1];
      if (hashSearch) {
        const hashParams = new URLSearchParams(hashSearch);
        for (const [key, value] of hashParams.entries()) {
          const lowerKey = key.toLowerCase();
          if (!result[lowerKey]) {
            result[lowerKey] = value;
          }
        }
      }
    }

    return result;
  },

  /**
   * Navigate to a target page with optional query parameters.
   * @param {string} pageName ('index', 'game', 'results', 'progress', 'settings')
   * @param {Record<string, string|number>} [params={}]
   */
  navigateTo(pageName, params = {}) {
    const targetFile = pageName.endsWith('.html') ? pageName : `${pageName}.html`;
    const search = new URLSearchParams(params).toString();
    const finalUrl = search ? `${targetFile}?${search}` : targetFile;

    window.location.href = finalUrl;
  },

  /**
   * Install window beforeunload auto-save without intrusive browser dialogs.
   */
  installGuards() {
    window.addEventListener('beforeunload', () => {
      const activeSession = State.get('activeSession');
      if (activeSession && activeSession.inProgress) {
        // Quietly persist active session state without blocking the user
        try {
          State._persistState();
        } catch (_) {}
      }
    });
  }
};
