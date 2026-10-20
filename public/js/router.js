/**
 * SyntaxArena Router & Page Navigation Coordinator
 * Minimal multi-page routing helper supporting native browser navigation.
 * Source of truth: docs/ARCHITECTURE.md
 */

import { State } from './state.js';

export const Router = {
  /**
   * Determine the current page identifier from the window URL.
   * @returns {'index'|'game'|'results'|'progress'|'settings'}
   */
  getCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.endsWith('game.html') || path.includes('/arena/') || hash.includes('/arena/')) return 'game';
    if (path.endsWith('results.html') || path.includes('/results/') || hash.includes('/results/')) return 'results';
    if (path.endsWith('progress.html') || path.includes('/progression/') || hash.includes('/progression/')) return 'progress';
    if (path.endsWith('settings.html') || path.includes('/settings/') || hash.includes('/settings/')) return 'settings';
    return 'index'; // Default to index.html
  },

  /**
   * Mask the browser address bar with a UUID session path instead of raw HTML file names.
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
      const search = window.location.search || '';
      const maskedUrl = `#/${segment}/${uuid}${search}`;

      window.history.replaceState({ page: pageType, uuid }, '', maskedUrl);
    } catch (_) {}
  },

  /**
   * Extract search query parameters from current URL.
   * @returns {Record<string, string>}
   */
  getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    if (window.location.hash && window.location.hash.includes('?')) {
      const hashSearch = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashSearch);
      for (const [key, value] of hashParams.entries()) {
        if (!result[key]) {
          result[key] = value;
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
