/**
 * SyntaxArena Profile System
 * Manages user identities, avatar catalogs, validation, and profile switching.
 * Source of truth: docs/ARCHITECTURE.md & docs/MVP_SPEC.md
 */

import { Utils } from './utils.js';
import { State } from './state.js';
import { Gamification } from './gamification.js';

export const AVATAR_CATALOG = [
  { id: 'cyber_fox',    name: 'Cyber Fox',    requiredLevel: 1, symbol: '🦊', description: 'Quick, agile, and sharp-eyed.' },
  { id: 'terminal_owl', name: 'Terminal Owl', requiredLevel: 1, symbol: '🦉', description: 'Wise systems trace analyst.' },
  { id: 'matrix_cat',   name: 'Matrix Cat',   requiredLevel: 1, symbol: '🐱', description: 'Stealthy async bug stalker.' },
  { id: 'bit_knight',   name: 'Bit Knight',   requiredLevel: 1, symbol: '🛡️', description: 'Resilient compiler defender.' },
  { id: 'hex_dragon',   name: 'Hex Dragon',   requiredLevel: 4, symbol: '🐉', description: 'Fierce low-level memory lord.' },
  { id: 'glitch_bot',   name: 'Glitch Bot',   requiredLevel: 7, symbol: '🤖', description: 'Unpredictable logic hacker.' }
];

export const Profile = {
  /**
   * Validate a proposed username.
   * Rules: 2-16 characters, alphanumeric, underscores, hyphens only.
   * @param {string} username
   * @returns {{ valid: boolean, error?: string }}
   */
  validateUsername(username) {
    if (typeof username !== 'string') {
      return { valid: false, error: 'Call-sign must be a valid text string.' };
    }
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      return { valid: false, error: 'Call-sign must be at least 2 characters.' };
    }
    if (trimmed.length > 20) {
      return { valid: false, error: 'Call-sign cannot exceed 20 characters.' };
    }
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(trimmed)) {
      return { valid: false, error: 'Only letters, numbers, underscores, and hyphens allowed.' };
    }
    return { valid: true };
  },

  /**
   * Validate if an avatarId exists in the catalog.
   * @param {string} avatarId
   * @returns {boolean}
   */
  validateAvatar(avatarId) {
    return AVATAR_CATALOG.some(a => a.id === avatarId);
  },

  /**
   * Factory function to create a new profile structure.
   * @param {string} username
   * @param {string} [avatarId='cyber_fox']
   * @param {object} [preferences={ language: 'python', difficulty: 'beginner' }]
   * @returns {object} New profile object
   */
  create(username, avatarId = 'cyber_fox', preferences = { language: 'python', difficulty: 'beginner' }) {
    const valResult = this.validateUsername(username);
    if (!valResult.valid) {
      throw new Error(valResult.error);
    }

    const safeAvatar = this.validateAvatar(avatarId) ? avatarId : 'cyber_fox';
    const profileId = Utils.generateId('prof');

    return {
      id: profileId,
      username: username.trim(),
      avatarId: safeAvatar,
      onboardingComplete: false,
      preferences: {
        language: preferences.language || 'python',
        difficulty: preferences.difficulty || 'beginner'
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
        sql:        { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' }
      },
      completedTiers: {},
      unlockedAchievements: [],
      purchasedBadges: [],
      missedQuestionIds: [],
      processedSessionIds: [],
      unlockedThemes: ['dark'],
      unlockedAvatars: ['cyber_fox', 'terminal_owl', 'matrix_cat', 'bit_knight'],
      unlockedModes: ['campaign', 'practice']
    };
  },

  /**
   * Check if a profile has completed onboarding.
   * @param {object} profile
   * @returns {boolean}
   */
  isOnboardingComplete(profile) {
    return Boolean(profile && profile.onboardingComplete === true);
  },

  /**
   * Switch the active profile in state and storage.
   * @param {string} profileId
   * @returns {boolean} Success status
   */
  switchActive(profileId) {
    const profiles = State.get('profiles') || [];
    const target = profiles.find(p => p.id === profileId);
    if (!target) {
      console.warn(`[Profile.switchActive] Profile not found: ${profileId}`);
      return false;
    }

    State.set('activeProfile', { ...target });
    return true;
  },

  /**
   * Safely update an existing profile while preserving all campaign progress and stats.
   * @param {string} profileId
   * @param {object} updates
   * @returns {object|null}
   */
  updateProfile(profileId, updates = {}) {
    const profiles = State.get('profiles') || [];
    const targetIndex = profiles.findIndex(p => p.id === profileId);
    if (targetIndex === -1) {
      console.warn(`[Profile.updateProfile] Profile not found: ${profileId}`);
      return null;
    }

    const current = profiles[targetIndex];
    const updated = {
      ...current,
      ...updates,
      // Ensure nested objects preserve existing data if partially updated
      stats: { ...current.stats, ...(updates.stats || {}) },
      campaign: { ...current.campaign, ...(updates.campaign || {}) },
      preferences: { ...(current.preferences || { language: 'python', difficulty: 'beginner' }), ...(updates.preferences || {}) }
    };

    const nextProfiles = [...profiles];
    nextProfiles[targetIndex] = updated;

    State.set('profiles', nextProfiles, false);
    const active = State.get('activeProfile');
    if (active && active.id === profileId) {
      State.set('activeProfile', { ...updated }, true);
    } else {
      State._persistState();
    }

    return updated;
  },

  /**
   * Mark onboarding as complete for a profile and save chosen preferences.
   * @param {string} profileId
   * @param {{ username: string, avatarId: string, language: string, difficulty: string }} config
   * @returns {object}
   */
  completeOnboarding(profileId, { username, avatarId, language, difficulty }) {
    const valResult = this.validateUsername(username);
    if (!valResult.valid) {
      throw new Error(valResult.error);
    }
    const safeAvatar = this.validateAvatar(avatarId) ? avatarId : 'cyber_fox';

    const updates = {
      username: username.trim(),
      avatarId: safeAvatar,
      onboardingComplete: true,
      preferences: {
        language: ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql'].includes(language) ? language : 'python',
        difficulty: ['beginner', 'intermediate', 'expert'].includes(difficulty) ? difficulty : 'beginner'
      }
    };

    // Grant first-time joining bonus (+100 points) on onboarding completion
    const profile = (State.get('profiles') || []).find(p => p.id === profileId) || this.getActiveProfile();
    if (profile && !profile.hasReceivedJoiningBonus) {
      updates.hasReceivedJoiningBonus = true;
      updates.totalScore = (profile.totalScore || 0) + 100;
      updates.xp = (profile.xp || 0) + 100;
      updates.lifetimeXP = (profile.lifetimeXP || 0) + 100;
    }

    return this.updateProfile(profileId, updates);
  },

  /**
   * Add a newly created profile and make it active.
   * @param {string} username
   * @param {string} avatarId
   * @returns {object} Created profile
   */
  addNew(username, avatarId) {
    const newProfile = this.create(username, avatarId);
    const existing = State.get('profiles') || [];
    const updated = [...existing, newProfile];

    State.set('profiles', updated, false);
    State.set('activeProfile', newProfile, true);
    return newProfile;
  },

  /**
   * Retrieve currently active profile.
   * @returns {object|null}
   */
  getActiveProfile() {
    const active = State.get('activeProfile');
    if (active) return active;
    const profiles = State.get('profiles') || [];
    return profiles[0] || null;
  },

  /**
   * Record completed game session statistics to the active profile.
   * @param {object} summary - Session summary from GameEngine
   * @returns {object|null} Updated profile
   */
  recordSessionResult(summary) {
    if (!summary) return null;
    const active = this.getActiveProfile();
    if (!active) return null;

    const result = Gamification.processSessionSummary(active, summary);
    if (!result || !result.success) {
      console.warn('[Profile.recordSessionResult] Failed to process session summary:', result);
      return null;
    }

    const updated = this.updateProfile(active.id, result.updatedProfile);
    return {
      ...updated,
      ...result
    };
  },

  /**
   * Get metadata for an avatar ID.
   * @param {string} avatarId
   * @returns {object} Avatar definition
   */
  getAvatarMeta(avatarId) {
    return AVATAR_CATALOG.find(a => a.id === avatarId) || AVATAR_CATALOG[0];
  },

  /**
   * Process daily login streak and joining bonus rewards for active profile.
   * @param {string} [profileId]
   * @returns {{ joiningBonus: boolean, streakBonus: boolean, dayStreak: number, message: string|null }}
   */
  checkDailyRewards(profileId) {
    const profile = profileId ? (State.get('profiles') || []).find(p => p.id === profileId) : this.getActiveProfile();
    if (!profile) return { joiningBonus: false, streakBonus: false, dayStreak: 1, message: null };

    const updates = {};
    let joiningBonus = false;
    let streakBonus = false;
    let message = null;

    // 1. First-time Joining Bonus (+100 points) - ONLY awarded if onboarding is completed
    if (profile.onboardingComplete && !profile.hasReceivedJoiningBonus) {
      updates.hasReceivedJoiningBonus = true;
      updates.totalScore = (profile.totalScore || 0) + 100;
      updates.xp = (profile.xp || 0) + 100;
      updates.lifetimeXP = (profile.lifetimeXP || 0) + 100;
      joiningBonus = true;
      message = '🎉 Welcome to SyntaxArena! +100 Joining Bonus XP granted!';
    }

    // 2. Daily Streak Calculation
    const today = new Date().toISOString().split('T')[0];
    const lastDate = profile.lastLoginDate;

    if (!lastDate) {
      updates.lastLoginDate = today;
      updates.dayStreak = 1;
    } else if (lastDate !== today) {
      const todayMs = new Date(today).getTime();
      const lastMs = new Date(lastDate).getTime();
      const diffDays = Math.round((todayMs - lastMs) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day!
        const nextStreak = (profile.dayStreak || 1) + 1;
        updates.dayStreak = nextStreak;
        updates.lastLoginDate = today;

        if (nextStreak === 3) {
          // 3-Day Loyalty Streak (+50 points) & confetti
          updates.totalScore = (updates.totalScore !== undefined ? updates.totalScore : (profile.totalScore || 0)) + 50;
          updates.xp = (updates.xp !== undefined ? updates.xp : (profile.xp || 0)) + 50;
          updates.lifetimeXP = (updates.lifetimeXP !== undefined ? updates.lifetimeXP : (profile.lifetimeXP || 0)) + 50;
          streakBonus = true;
          message = '🏆 3-Day Loyalty Streak! +50 Points awarded!';
        } else {
          message = `🔥 ${nextStreak}-Day Login Streak active!`;
        }
      } else if (diffDays > 1) {
        // Broken streak, restart at 1
        updates.dayStreak = 1;
        updates.lastLoginDate = today;
      }
    }

    if (Object.keys(updates).length > 0) {
      this.updateProfile(profile.id, updates);
    }

    return {
      joiningBonus,
      streakBonus,
      dayStreak: updates.dayStreak || profile.dayStreak || 1,
      message
    };
  },

  /**
   * Purchase an unlockable item (badge or avatar) using player points.
   * Deducts points/xp from spendable balance while keeping lifetimeXP intact so player level never drops.
   * @param {string} profileId
   * @param {'avatar'|'badge'} itemType
   * @param {string} itemId
   * @param {number} cost
   * @returns {{ success: boolean, message: string, profile?: object }}
   */
  purchaseItem(profileId, itemType, itemId, cost = 150) {
    const profile = (State.get('profiles') || []).find(p => p.id === profileId) || this.getActiveProfile();
    if (!profile) return { success: false, message: 'Profile not found.' };

    const currentPoints = typeof profile.totalScore === 'number' ? profile.totalScore : (profile.xp || 0);
    if (currentPoints < cost) {
      return {
        success: false,
        message: `Insufficient points! You need ${cost} points (Current: ${currentPoints.toLocaleString()}).`
      };
    }

    const updates = {
      totalScore: Math.max(0, currentPoints - cost),
      xp: Math.max(0, (profile.xp || currentPoints) - cost)
      // NOTE: lifetimeXP is deliberately NOT reduced, preserving player level!
    };

    if (itemType === 'avatar') {
      const existingAvatars = new Set(profile.unlockedAvatars || ['cyber_fox', 'terminal_owl', 'matrix_cat', 'bit_knight']);
      existingAvatars.add(itemId);
      updates.unlockedAvatars = Array.from(existingAvatars);
    } else if (itemType === 'badge') {
      const existingBadges = new Set(profile.unlockedAchievements || []);
      existingBadges.add(itemId);
      updates.unlockedAchievements = Array.from(existingBadges);
      const purchased = new Set(profile.purchasedBadges || []);
      purchased.add(itemId);
      updates.purchasedBadges = Array.from(purchased);
    } else if (itemType === 'theme') {
      const existingThemes = new Set(profile.unlockedThemes || ['dark']);
      existingThemes.add(itemId);
      updates.unlockedThemes = Array.from(existingThemes);
    }

    const updated = this.updateProfile(profile.id, updates);
    return {
      success: true,
      message: `Successfully unlocked ${itemId} for ${cost} points!`,
      profile: updated
    };
  }
};
