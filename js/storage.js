/**
 * SyntaxArena Storage Manager (Batch 9 Hardened)
 * Safe localStorage abstraction with schema versioning, deep migration,
 * corruption recovery, degradation tracking, and in-memory fallback.
 * Source of truth: docs/ARCHITECTURE.md & docs/BATCH_9_PLAN.md
 */

import { Utils } from './utils.js';

export const STORAGE_KEY = 'syntaxarena_storage_v1';
export const CORRUPTED_BACKUP_KEY = 'syntaxarena_corrupted_backup';
export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Factory for a complete default profile structure.
 */
export function createDefaultProfile(id = 'prof-default01', username = 'ScriptAdept') {
  return {
    id,
    username,
    avatarId: 'cyber_fox',
    onboardingComplete: false,
    preferences: {
      language: 'python',
      difficulty: 'beginner'
    },
    createdAt: Date.now(),
    level: 1,
    xp: 0,
    lifetimeXP: 0,
    totalScore: 0,
    hasReceivedJoiningBonus: false,
    dayStreak: 1,
    lastLoginDate: null,
    rank: 'Script Novice',
    stats: {
      gamesPlayed: 0,
      questionsAttempted: 0,
      questionsCorrect: 0,
      highestStreak: 0,
      dailyChallengesCompleted: 0,
      lastDailyDate: null
    },
    campaign: {
      python:     { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      c:          { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      cpp:        { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      java:       { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      cyber:      { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      javascript: { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      rust:       { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      sql:        { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      typescript: { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' },
      go:         { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' }
    },
    completedTiers: {},
    stageStars: {},
    completedStages: {},
    unlockedAchievements: [],
    purchasedBadges: [],
    missedQuestionIds: [],
    sessionHistory: [],
    processedSessionIds: [],
    unlockedThemes: ['dark'],
    unlockedAvatars: ['cyber_fox', 'terminal_owl', 'matrix_cat', 'bit_knight'],
    unlockedModes: ['campaign', 'practice']
  };
}

/**
 * Default clean state factory.
 */
export function createDefaultStorageSchema() {
  const defaultProf = createDefaultProfile();
  return {
    version: CURRENT_SCHEMA_VERSION,
    activeProfileId: defaultProf.id,
    profiles: [defaultProf],
    activeSession: null,
    settings: {
      theme: 'dark',
      soundEnabled: true,
      musicEnabled: true,
      sfxVolume: 0.8,
      musicVolume: 0.5,
      reducedMotion: false
    }
  };
}

class StorageManager {
  constructor() {
    this.isAvailable = Utils.isStorageAvailable();
    this.isStorageDegraded = false;
    this.memoryFallback = null;
    this.degradationListeners = new Set();
    this.recoveryListeners = new Set();

    if (!this.isAvailable) {
      console.warn('[StorageManager] localStorage is unavailable. Operating in in-memory session mode.');
      this.isStorageDegraded = true;
      this.memoryFallback = createDefaultStorageSchema();
    }
  }

  /**
   * Subscribe to storage degradation warnings (e.g. quota exceeded or unavailable).
   * @param {Function} callback (errorReason) => void
   * @returns {Function} Unsubscribe
   */
  onDegradation(callback) {
    this.degradationListeners.add(callback);
    return () => this.degradationListeners.delete(callback);
  }

  /**
   * Subscribe to corruption recovery notifications.
   * @param {Function} callback ({ salvagedProfiles: number, message: string }) => void
   * @returns {Function} Unsubscribe
   */
  onRecovery(callback) {
    this.recoveryListeners.add(callback);
    return () => this.recoveryListeners.delete(callback);
  }

  _notifyDegradation(reason) {
    this.degradationListeners.forEach(cb => {
      try { cb(reason); } catch (_) {}
    });
  }

  _notifyRecovery(info) {
    this.recoveryListeners.forEach(cb => {
      try { cb(info); } catch (_) {}
    });
  }

  /**
   * Read and parse stored data safely with corruption recovery and deep migration.
   * @returns {object} Validated application storage object
   */
  load() {
    if (!this.isAvailable) {
      return this.memoryFallback || createDefaultStorageSchema();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const fresh = createDefaultStorageSchema();
        this.save(fresh);
        return fresh;
      }

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (parseErr) {
        console.warn('[StorageManager] Malformed JSON in localStorage. Initiating corruption salvage.', parseErr);
        this._quarantineCorrupted(raw);
        const fresh = createDefaultStorageSchema();
        this.save(fresh);
        this._notifyRecovery({ salvagedProfiles: 0, message: 'Saved data was corrupted and has been reset to defaults.' });
        return fresh;
      }

      // Validate schema integrity
      if (!this._isValidSchema(parsed)) {
        console.warn('[StorageManager] Stored data schema invalid. Attempting partial salvage.');
        const salvaged = this._salvageCorrupted(parsed, raw);
        this.save(salvaged);
        return salvaged;
      }

      // Handle migrations if schema version is older
      if (typeof parsed.version !== 'number' || parsed.version < CURRENT_SCHEMA_VERSION) {
        const migrated = this._migrate(parsed);
        this.save(migrated);
        return migrated;
      }

      // Ensure all profiles inside current schema have all required keys (deep hygiene)
      let needsResave = false;
      const hygienicProfiles = parsed.profiles.map(p => {
        const cleaned = this._sanitizeProfile(p);
        if (JSON.stringify(cleaned) !== JSON.stringify(p)) {
          needsResave = true;
        }
        return cleaned;
      });

      if (needsResave) {
        parsed.profiles = hygienicProfiles;
        this.save(parsed);
      }

      return parsed;
    } catch (err) {
      console.error('[StorageManager] Storage read failure. Falling back to memory state.', err);
      const fallback = this.memoryFallback || createDefaultStorageSchema();
      return fallback;
    }
  }

  /**
   * Save complete data object to localStorage safely.
   * Handles QuotaExceededError and security errors gracefully.
   * @param {object} data
   * @returns {boolean} Success status
   */
  save(data) {
    if (!data || typeof data !== 'object') {
      console.error('[StorageManager.save] Attempted to save invalid data structure.');
      return false;
    }

    // Keep memory mirror updated for uninterrupted in-memory play
    this.memoryFallback = JSON.parse(JSON.stringify(data));

    if (!this.isAvailable) {
      return true;
    }

    try {
      const serialized = JSON.stringify(data);
      window.localStorage.setItem(STORAGE_KEY, serialized);
      if (this.isStorageDegraded) {
        this.isStorageDegraded = false; // Restored normal persistence
      }
      return true;
    } catch (err) {
      this.isStorageDegraded = true;
      console.error('[StorageManager.save] Failed to write to localStorage (Quota exceeded or security restriction).', err);
      this._notifyDegradation(err.name || 'StorageUnavailable');
      return false;
    }
  }

  /**
   * Reset all data to initial factory defaults.
   * @returns {object} Fresh default schema
   */
  resetAll() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      } else if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        globalThis.localStorage.clear();
      }
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.clear();
      } else if (typeof globalThis !== 'undefined' && globalThis.sessionStorage) {
        globalThis.sessionStorage.clear();
      }
    } catch (_) {}
    const defaults = createDefaultStorageSchema();
    this.save(defaults);
    return defaults;
  }

  /**
   * Export all data as a sanitized, formatted JSON string.
   * @returns {string} JSON string
   */
  exportJSON() {
    const current = this.load();
    return JSON.stringify(current, null, 2);
  }

  /**
   * Import data from JSON string with deep validation.
   * Prevents injection of arbitrary objects, corrupted types, or malicious scripts.
   * @param {string} jsonStr
   * @returns {{ success: boolean, message: string }}
   */
  importJSON(jsonStr) {
    if (typeof jsonStr !== 'string' || !jsonStr.trim()) {
      return { success: false, message: 'Empty or invalid backup file.' };
    }

    try {
      const parsed = JSON.parse(jsonStr);

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { success: false, message: 'Invalid backup root structure.' };
      }

      if (!Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
        return { success: false, message: 'Backup file must contain at least one valid player profile.' };
      }

      // Deep validate every profile
      const validProfiles = [];
      for (const p of parsed.profiles) {
        if (!p || typeof p !== 'object') continue;
        const sanitized = this._sanitizeProfile(p);
        if (sanitized && sanitized.id && sanitized.username) {
          validProfiles.push(sanitized);
        }
      }

      if (validProfiles.length === 0) {
        return { success: false, message: 'No valid player profiles found in backup.' };
      }

      // Ensure activeProfileId points to an existing profile
      let activeProfileId = typeof parsed.activeProfileId === 'string' ? parsed.activeProfileId : validProfiles[0].id;
      if (!validProfiles.some(p => p.id === activeProfileId)) {
        activeProfileId = validProfiles[0].id;
      }

      // Validate settings
      const defaultSettings = createDefaultStorageSchema().settings;
      const cleanSettings = {
        theme: ['dark', 'light', 'amber', 'gold'].includes(parsed.settings?.theme) ? parsed.settings.theme : defaultSettings.theme,
        soundEnabled: typeof parsed.settings?.soundEnabled === 'boolean' ? parsed.settings.soundEnabled : defaultSettings.soundEnabled,
        musicEnabled: typeof parsed.settings?.musicEnabled === 'boolean' ? parsed.settings.musicEnabled : defaultSettings.musicEnabled,
        sfxVolume: typeof parsed.settings?.sfxVolume === 'number' ? Math.max(0, Math.min(1, parsed.settings.sfxVolume)) : defaultSettings.sfxVolume,
        musicVolume: typeof parsed.settings?.musicVolume === 'number' ? Math.max(0, Math.min(1, parsed.settings.musicVolume)) : defaultSettings.musicVolume,
        reducedMotion: typeof parsed.settings?.reducedMotion === 'boolean' ? parsed.settings.reducedMotion : defaultSettings.reducedMotion
      };

      const importedData = {
        version: CURRENT_SCHEMA_VERSION,
        activeProfileId,
        profiles: validProfiles,
        activeSession: null, // Clear active session on import for safety
        settings: cleanSettings
      };

      const saveOk = this.save(importedData);
      if (!saveOk && this.isAvailable) {
        return { success: false, message: 'Failed to write backup to browser storage (quota exceeded).' };
      }

      return { success: true, message: `Backup restored successfully (${validProfiles.length} profile${validProfiles.length > 1 ? 's' : ''}).` };
    } catch (err) {
      return { success: false, message: 'Corrupted or malformed JSON file: ' + (err.message || 'parse error') };
    }
  }

  /**
   * Internal validation of data schema.
   */
  _isValidSchema(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
    if (typeof obj.version !== 'number') return false;
    if (!Array.isArray(obj.profiles) || obj.profiles.length === 0) return false;
    if (typeof obj.activeProfileId !== 'string') return false;
    if (!obj.settings || typeof obj.settings !== 'object') return false;
    return true;
  }

  /**
   * Partial corruption recovery: Salvages valid profiles and preferences
   * instead of wiping all user progress.
   */
  _salvageCorrupted(parsed, rawString) {
    this._quarantineCorrupted(rawString);

    const fallback = createDefaultStorageSchema();
    const salvagedProfiles = [];

    if (parsed && Array.isArray(parsed.profiles)) {
      for (const p of parsed.profiles) {
        if (p && typeof p === 'object' && (p.username || p.id)) {
          const sanitized = this._sanitizeProfile(p);
          if (sanitized) salvagedProfiles.push(sanitized);
        }
      }
    }

    if (salvagedProfiles.length > 0) {
      fallback.profiles = salvagedProfiles;
      let targetActive = typeof parsed?.activeProfileId === 'string' ? parsed.activeProfileId : salvagedProfiles[0].id;
      if (!salvagedProfiles.some(p => p.id === targetActive)) {
        targetActive = salvagedProfiles[0].id;
      }
      fallback.activeProfileId = targetActive;

      // Salvage settings if valid
      if (parsed?.settings && typeof parsed.settings === 'object') {
        fallback.settings = { ...fallback.settings, ...parsed.settings };
      }

      this._notifyRecovery({
        salvagedProfiles: salvagedProfiles.length,
        message: `Recovered ${salvagedProfiles.length} player profile(s) from corrupted storage.`
      });
      return fallback;
    }

    this._notifyRecovery({
      salvagedProfiles: 0,
      message: 'Storage was corrupted beyond salvage. Initialized with fresh defaults.'
    });
    return fallback;
  }

  /**
   * Deep migration from earlier or partial schema versions.
   */
  _migrate(oldData) {
    console.info(`[StorageManager] Performing deep migration from v${oldData?.version ?? 0} to v${CURRENT_SCHEMA_VERSION}`);

    const base = createDefaultStorageSchema();
    const profiles = Array.isArray(oldData.profiles) && oldData.profiles.length > 0
      ? oldData.profiles.map(p => this._sanitizeProfile(p))
      : base.profiles;

    let activeProfileId = oldData.activeProfileId;
    if (!profiles.some(p => p.id === activeProfileId)) {
      activeProfileId = profiles[0].id;
    }

    const settings = {
      ...base.settings,
      ...(oldData.settings || {})
    };

    return {
      version: CURRENT_SCHEMA_VERSION,
      activeProfileId,
      profiles,
      activeSession: oldData.activeSession || null,
      settings
    };
  }

  /**
   * Sanitize an individual profile object to guarantee all required fields and types exist.
   */
  _sanitizeProfile(p) {
    const defaultProf = createDefaultProfile(p?.id || Utils.generateId('prof'), String(p?.username || 'ScriptAdept').slice(0, 20));

    const id = typeof p?.id === 'string' && p.id ? p.id : defaultProf.id;
    const username = typeof p?.username === 'string' && p.username.trim()
      ? p.username.trim().slice(0, 20)
      : defaultProf.username;

    const level = typeof p?.level === 'number' && p.level >= 1 && p.level <= 10 ? Math.floor(p.level) : 1;
    const xp = typeof p?.xp === 'number' && p.xp >= 0 ? Math.floor(p.xp) : 0;
    const lifetimeXP = typeof p?.lifetimeXP === 'number' && p.lifetimeXP >= 0 ? Math.floor(p.lifetimeXP) : (p?.lifetimeXP === undefined ? xp : 0);
    const totalScore = typeof p?.totalScore === 'number' && p.totalScore >= 0 ? Math.floor(p.totalScore) : xp;
    const hasReceivedJoiningBonus = Boolean(p?.hasReceivedJoiningBonus);
    const dayStreak = typeof p?.dayStreak === 'number' && p.dayStreak >= 1 ? Math.floor(p.dayStreak) : 1;
    const lastLoginDate = typeof p?.lastLoginDate === 'string' ? p.lastLoginDate : null;
    const completedTiers = typeof p?.completedTiers === 'object' && p?.completedTiers !== null ? { ...p.completedTiers } : {};
    const purchasedBadges = Array.isArray(p?.purchasedBadges) ? [...p.purchasedBadges] : [];

    const stats = {
      gamesPlayed: Math.max(0, parseInt(p?.stats?.gamesPlayed, 10) || 0),
      questionsAttempted: Math.max(0, parseInt(p?.stats?.questionsAttempted, 10) || 0),
      questionsCorrect: Math.max(0, parseInt(p?.stats?.questionsCorrect, 10) || 0),
      highestStreak: Math.max(0, parseInt(p?.stats?.highestStreak, 10) || 0),
      dailyChallengesCompleted: Math.max(0, parseInt(p?.stats?.dailyChallengesCompleted, 10) || 0),
      lastDailyDate: p?.stats?.lastDailyDate || null
    };

    const campaign = {
      python:     { ...defaultProf.campaign.python,     ...(p?.campaign?.python || {}) },
      c:          { ...defaultProf.campaign.c,          ...(p?.campaign?.c || {}) },
      cpp:        { ...defaultProf.campaign.cpp,        ...(p?.campaign?.cpp || {}) },
      java:       { ...defaultProf.campaign.java,       ...(p?.campaign?.java || {}) },
      cyber:      { ...defaultProf.campaign.cyber,      ...(p?.campaign?.cyber || {}) },
      javascript: { ...defaultProf.campaign.javascript, ...(p?.campaign?.javascript || {}) },
      rust:       { ...defaultProf.campaign.rust,       ...(p?.campaign?.rust || {}) },
      sql:        { ...defaultProf.campaign.sql,        ...(p?.campaign?.sql || {}) },
      typescript: { ...defaultProf.campaign.typescript, ...(p?.campaign?.typescript || {}) }
    };

    return {
      id,
      username,
      avatarId: typeof p?.avatarId === 'string' ? p.avatarId : defaultProf.avatarId,
      onboardingComplete: Boolean(p?.onboardingComplete),
      preferences: {
        language: ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql', 'typescript'].includes(p?.preferences?.language) ? p.preferences.language : 'python',
        difficulty: ['beginner', 'intermediate', 'expert'].includes(p?.preferences?.difficulty) ? p.preferences.difficulty : 'beginner'
      },
      createdAt: typeof p?.createdAt === 'number' ? p.createdAt : Date.now(),
      level,
      xp,
      lifetimeXP,
      totalScore,
      hasReceivedJoiningBonus,
      dayStreak,
      lastLoginDate,
      rank: typeof p?.rank === 'string' && p.rank ? p.rank : defaultProf.rank,
      stats,
      campaign,
      completedTiers,
      stageStars: typeof p?.stageStars === 'object' && p?.stageStars !== null ? { ...p.stageStars } : {},
      completedStages: typeof p?.completedStages === 'object' && p?.completedStages !== null ? { ...p.completedStages } : {},
      unlockedAchievements: Array.isArray(p?.unlockedAchievements) ? [...p.unlockedAchievements] : [],
      purchasedBadges,
      missedQuestionIds: Array.isArray(p?.missedQuestionIds) ? [...p.missedQuestionIds] : [],
      sessionHistory: Array.isArray(p?.sessionHistory) ? p.sessionHistory.slice(0, 50) : [],
      processedSessionIds: Array.isArray(p?.processedSessionIds) ? p.processedSessionIds.slice(0, 100) : [],
      unlockedThemes: Array.isArray(p?.unlockedThemes) && p.unlockedThemes.length > 0 ? [...p.unlockedThemes] : defaultProf.unlockedThemes,
      unlockedAvatars: Array.isArray(p?.unlockedAvatars) && p.unlockedAvatars.length > 0 ? [...p.unlockedAvatars] : defaultProf.unlockedAvatars,
      unlockedModes: Array.isArray(p?.unlockedModes) && p.unlockedModes.length > 0 ? [...p.unlockedModes] : defaultProf.unlockedModes
    };
  }

  /**
   * Quarantine corrupted data for forensic recovery or inspection.
   */
  _quarantineCorrupted(rawString) {
    try {
      window.localStorage.setItem(CORRUPTED_BACKUP_KEY, rawString);
      console.info('[StorageManager] Raw corrupted payload saved to:', CORRUPTED_BACKUP_KEY);
    } catch (_) {}
  }
}

export const Storage = new StorageManager();

