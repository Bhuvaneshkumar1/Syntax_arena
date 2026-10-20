/**
 * SyntaxArena Reactive State Store
 * Implements predictable state updates via Pub/Sub pattern.
 * Source of truth: docs/ARCHITECTURE.md
 */

import { Storage } from './storage.js';

class StateStore {
  constructor() {
    this._subscribers = new Map();
    this._state = {
      activeProfile: null,
      profiles: [],
      settings: {
        theme: 'dark',
        sfxVolume: 0.8,
        musicVolume: 0.5,
        reducedMotion: false
      },
      activeSession: null,
      currentPage: 'index',
      selectedLanguage: 'python',
      selectedDifficulty: 'beginner'
    };
  }

  /**
   * Initialize state from storage.
   */
  init(pageName = 'index') {
    const stored = Storage.load();
    const activeProfile = stored.profiles.find(p => p.id === stored.activeProfileId) || stored.profiles[0];

    this._state = {
      activeProfile: activeProfile ? { ...activeProfile } : null,
      profiles: [...stored.profiles],
      settings: { ...stored.settings },
      activeSession: stored.activeSession ? { ...stored.activeSession } : null,
      currentPage: pageName
    };

    return this.getState();
  }

  /**
   * Return a shallow copy of the current state.
   */
  getState() {
    return { ...this._state };
  }

  /**
   * Get a specific slice of the state.
   * @param {string} slice
   */
  get(slice) {
    return this._state[slice];
  }

  /**
   * Update a specific slice of the state predictably and notify subscribers.
   * @param {string} slice
   * @param {object|any} patch
   * @param {boolean} [persist=true] Whether to save to localStorage
   */
  set(slice, patch, persist = true) {
    if (!(slice in this._state)) {
      console.warn(`[StateStore.set] Unknown state slice: ${slice}`);
    }

    const prevSlice = this._state[slice];
    let nextSlice;

    if (patch !== null && typeof patch === 'object' && !Array.isArray(patch)) {
      nextSlice = { ...prevSlice, ...patch };
    } else {
      nextSlice = patch;
    }

    this._state[slice] = nextSlice;

    // Synchronize to localStorage if needed
    if (persist && ['activeProfile', 'profiles', 'settings', 'activeSession'].includes(slice)) {
      this._persistState();
    }

    this._notify(slice, nextSlice, prevSlice);
  }

  /**
   * Subscribe to changes on a specific state slice.
   * @param {string} slice
   * @param {Function} callback (nextValue, prevValue) => void
   * @returns {Function} Unsubscribe function
   */
  subscribe(slice, callback) {
    if (!this._subscribers.has(slice)) {
      this._subscribers.set(slice, new Set());
    }
    this._subscribers.get(slice).add(callback);
    return () => this._subscribers.get(slice).delete(callback);
  }

  /**
   * Internal notification dispatcher.
   */
  _notify(slice, nextValue, prevValue) {
    if (this._subscribers.has(slice)) {
      this._subscribers.get(slice).forEach(cb => {
        try {
          cb(nextValue, prevValue);
        } catch (err) {
          console.error(`[StateStore.notify] Error in subscriber callback for slice "${slice}":`, err);
        }
      });
    }
  }

  /**
   * Check whether persistent browser storage is currently degraded.
   * @returns {boolean}
   */
  isStorageDegraded() {
    return Boolean(Storage.isStorageDegraded);
  }

  /**
   * Commit current state back to Storage.
   * @returns {boolean} Whether write succeeded
   */
  _persistState() {
    const payload = Storage.load();
    payload.activeProfileId = this._state.activeProfile ? this._state.activeProfile.id : null;
    payload.profiles = this._state.profiles.map(p => {
      if (this._state.activeProfile && p.id === this._state.activeProfile.id) {
        return { ...this._state.activeProfile };
      }
      return p;
    });
    payload.settings = { ...this._state.settings };
    payload.activeSession = this._state.activeSession;
    return Storage.save(payload);
  }
}

export const State = new StateStore();
