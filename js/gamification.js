/**
 * SyntaxArena Gamification System & Player Rewards (Batch 6)
 * Pure client-side progression engine: XP yields, 10-level ranks, streak records,
 * extensible achievement badges, unlockable cosmetics, and challenge modes.
 * Source of truth: docs/GAME_RULES.md, docs/ARCHITECTURE.md, docs/MVP_SPEC.md
 */

import { Utils } from './utils.js';

// =============================================================================
// 1. LEVEL & RANK THRESHOLDS (docs/GAME_RULES.md §2.2)
// =============================================================================
export const LEVEL_THRESHOLDS = Object.freeze([
  { level: 1,  title: 'Script Novice',       requiredXP: 0,     reward: 'Base Avatars & Cyber Studio Theme' },
  { level: 2,  title: 'Syntax Apprentice',   requiredXP: 250,   reward: 'Studio Paper (Light Theme)' },
  { level: 3,  title: 'Logic Crafter',       requiredXP: 600,   reward: 'Speedrun Mode (20s Timer)' },
  { level: 4,  title: 'Byte Explorer',       requiredXP: 1200,  reward: 'Avatar: Hex Dragon' },
  { level: 5,  title: 'Algorithm Ace',       requiredXP: 2000,  reward: 'Hardcore Mode (3 Hearts)' },
  { level: 6,  title: 'Pointer Pilot',       requiredXP: 3200,  reward: 'Theme: Amber Flame Mode' },
  { level: 7,  title: 'Memory Architect',    requiredXP: 4800,  reward: 'Avatar: Glitch Bot' },
  { level: 8,  title: 'System Sage',         requiredXP: 6800,  reward: 'Sound Pack: Retro 8-Bit Chiptune' },
  { level: 9,  title: 'Kernel Master',       requiredXP: 9200,  reward: 'Holographic Profile Frame' },
  { level: 10, title: 'Grandmaster of Code', requiredXP: 12000, reward: 'Crown Badge & Golden Accent Mode' }
]);

export const MAX_LEVEL = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].level;

// =============================================================================
// 2. XP YIELD CONFIGURATION (docs/GAME_RULES.md §2.1)
// =============================================================================
export const XP_RULES = Object.freeze({
  beginnerCorrect: 50,
  intermediateCorrect: 100,
  expertCorrect: 150,
  flawlessBonus: 100,    // 100% accuracy in >= 10 questions
  dailyClearBonus: 300   // Daily challenge clear
});

// =============================================================================
// 3. COSMETICS & CHALLENGE MODES REGISTRY
// =============================================================================
export const UNLOCKABLE_THEMES = Object.freeze([
  { id: 'dark',  name: 'Cyber Studio',     requiredLevel: 1,  cost: 0,   themeClass: 'dark',  description: 'Sleek neon-cyan dark arcade theme' },
  { id: 'light', name: 'Studio Paper',     requiredLevel: 2,  cost: 100, themeClass: 'light', description: 'Crisp editorial light mode with high contrast' },
  { id: 'amber', name: 'Amber Flame',      requiredLevel: 6,  cost: 200, themeClass: 'amber', description: 'Warm CRT amber phosphor arcade aesthetic' },
  { id: 'gold',  name: 'Grandmaster Gold', requiredLevel: 10, cost: 350, themeClass: 'gold',  description: 'Prestige obsidian and metallic gold theme' }
]);

export const UNLOCKABLE_AVATARS = Object.freeze([
  { id: 'cyber_fox',    name: 'Cyber Fox',    requiredLevel: 1, symbol: '🦊', description: 'Quick, agile, and sharp-eyed.' },
  { id: 'terminal_owl', name: 'Terminal Owl', requiredLevel: 1, symbol: '🦉', description: 'Wise systems trace analyst.' },
  { id: 'matrix_cat',   name: 'Matrix Cat',   requiredLevel: 1, symbol: '🐱', description: 'Stealthy async bug stalker.' },
  { id: 'bit_knight',   name: 'Bit Knight',   requiredLevel: 1, symbol: '🛡️', description: 'Resilient compiler defender.' },
  { id: 'hex_dragon',   name: 'Hex Dragon',   requiredLevel: 4, symbol: '🐉', description: 'Fierce low-level memory lord.' },
  { id: 'glitch_bot',   name: 'Glitch Bot',   requiredLevel: 7, symbol: '🤖', description: 'Unpredictable logic hacker.' }
]);

export const CHALLENGE_MODES = Object.freeze([
  { id: 'campaign', name: 'Campaign Mode',    requiredLevel: 1, icon: '🗺️', description: 'Tiered 20-question curriculum per language.' },
  { id: 'practice', name: 'Free Practice',    requiredLevel: 1, icon: '🎯', description: 'Relaxed or custom practice with full hint support.' },
  { id: 'speedrun', name: 'Speedrun Mode',    requiredLevel: 3, icon: '⏱️', description: 'High-adrenaline 20s countdown per challenge.' },
  { id: 'hardcore', name: 'Hardcore Mode',    requiredLevel: 5, icon: '💀', description: 'Strict 30s timer, hints disabled, 3 hearts.' }
]);

// =============================================================================
// 4. ACHIEVEMENT BADGES REGISTRY (20 Curated Achievements)
// =============================================================================
export const ACHIEVEMENTS = Object.freeze([
  // --- Category: Milestones ---
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Solve your first programming challenge correctly.',
    icon: '⚔️',
    category: 'milestones',
    difficulty: 'beginner',
    cost: 50,
    price: 50,
    evaluate: (profile, session) => {
      const correct = (profile?.stats?.questionsCorrect || 0) + (session?.questionsCorrect || 0);
      return correct >= 1;
    }
  },
  {
    id: 'first_session',
    name: 'Arena Initiate',
    description: 'Complete your first full challenge session.',
    icon: '🏁',
    category: 'milestones',
    difficulty: 'beginner',
    cost: 50,
    price: 50,
    evaluate: (profile, session) => {
      return (profile?.stats?.gamesPlayed || 0) >= 1 || session?.isCompleted === true;
    }
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Attempt 100 programming challenges across your career.',
    icon: '💯',
    category: 'milestones',
    difficulty: 'expert',
    cost: 250,
    price: 250,
    evaluate: (profile, session) => {
      const attempted = (profile?.stats?.questionsAttempted || 0) + (session?.questionsAttempted || 0);
      return attempted >= 100;
    }
  },
  {
    id: 'veteran',
    name: 'Syntax Veteran',
    description: 'Complete 5 full challenge sessions in the arena.',
    icon: '🎖️',
    category: 'milestones',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      const games = (profile?.stats?.gamesPlayed || 0) + (session?.isCompleted ? 1 : 0);
      return games >= 5;
    }
  },

  // --- Category: Streaks ---
  {
    id: 'streak_3',
    name: 'Blue Flare',
    description: 'Achieve a 3-question answer streak in a session.',
    icon: '🔹',
    category: 'streaks',
    difficulty: 'beginner',
    cost: 60,
    price: 60,
    evaluate: (profile, session) => {
      return (session?.highestStreak || 0) >= 3 || (profile?.stats?.highestStreak || 0) >= 3;
    }
  },
  {
    id: 'streak_5',
    name: 'Amber Blaze',
    description: 'Achieve a 5-question answer streak in a session.',
    icon: '🔥',
    category: 'streaks',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      return (session?.highestStreak || 0) >= 5 || (profile?.stats?.highestStreak || 0) >= 5;
    }
  },
  {
    id: 'streak_8',
    name: 'Plasma Supernova',
    description: 'Achieve an 8-question streak and hit the 3.0x Max Multiplier.',
    icon: '⚡',
    category: 'streaks',
    difficulty: 'expert',
    cost: 220,
    price: 220,
    evaluate: (profile, session) => {
      return (session?.highestStreak || 0) >= 8 || (profile?.stats?.highestStreak || 0) >= 8;
    }
  },

  // --- Category: Accuracy & Mastery ---
  {
    id: 'proficient',
    name: 'Proficient Deductor',
    description: 'Complete a challenge session with at least 75% accuracy (⭐⭐).',
    icon: '🎯',
    category: 'accuracy',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.accuracy >= 75);
    }
  },
  {
    id: 'perfectionist',
    name: 'Flawless Execution',
    description: 'Achieve 100% accuracy in a session with at least 5 challenges.',
    icon: '💎',
    category: 'accuracy',
    difficulty: 'expert',
    cost: 250,
    price: 250,
    evaluate: (profile, session) => {
      if (!session) return false;
      const correct = session.questionsCorrect || 0;
      const total = session.totalQuestions || 0;
      const accuracy = session.accuracy !== undefined ? session.accuracy : (total > 0 ? (correct / total) * 100 : 0);
      return Boolean(accuracy >= 100 && total >= 5);
    }
  },
  {
    id: 'second_chance_hero',
    name: 'Second Chance Hero',
    description: 'Correctly solve a challenge on Second Chance retry after a hint.',
    icon: '🛡️',
    category: 'accuracy',
    difficulty: 'beginner',
    cost: 75,
    price: 75,
    evaluate: (profile, session) => {
      if (session?.retriesUsed > 0 && session?.questionsCorrect > 0) return true;
      const results = session?.results || session?.answers;
      return Boolean(results?.some(r => r && r.attempts > 1 && (r.isCorrect || r.correct)));
    }
  },
  {
    id: 'hint_master',
    name: 'Pedagogical Insight',
    description: 'Successfully solve 3 challenges in a single run with hint guidance.',
    icon: '💡',
    category: 'accuracy',
    difficulty: 'intermediate',
    cost: 100,
    price: 100,
    evaluate: (profile, session) => {
      return Boolean(session && (session.hintsUsed || 0) >= 3 && (session.questionsCorrect || 0) >= 3);
    }
  },

  // --- Category: Speed ---
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Solve a timed challenge correctly in under 5 seconds without hints.',
    icon: '⏱️',
    category: 'speed',
    difficulty: 'expert',
    cost: 220,
    price: 220,
    evaluate: (profile, session) => {
      const results = session?.results || session?.answers;
      if (!results || !Array.isArray(results)) return false;
      return results.some(r => {
        const isOk = r && (r.isCorrect || r.correct) && !r.usedHint;
        if (!isOk) return false;
        const limit = r.timeLimit || session?.timeLimit || 45;
        const taken = limit - (r.timeRemaining || 0);
        return taken > 0 && taken <= 5;
      });
    }
  },
  {
    id: 'blitz_solver',
    name: 'Blitz Deduction',
    description: 'Answer correctly with more than 80% of the countdown timer remaining.',
    icon: '🚀',
    category: 'speed',
    difficulty: 'intermediate',
    cost: 130,
    price: 130,
    evaluate: (profile, session) => {
      if (!session?.results) return false;
      return session.results.some(r => {
        return r.isCorrect && !r.usedHint && r.timeLimit > 0 && (r.timeRemaining || 0) >= (0.8 * r.timeLimit);
      });
    }
  },

  // --- Category: Language Polyglot ---
  {
    id: 'polyglot_python',
    name: 'Pythonista',
    description: 'Complete a full challenge session in Python 3.',
    icon: '🐍',
    category: 'polyglot',
    difficulty: 'beginner',
    cost: 75,
    price: 75,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.language === 'python');
    }
  },
  {
    id: 'polyglot_c',
    name: 'C Systems Adept',
    description: 'Complete a full challenge session in C (C99).',
    icon: '⚙️',
    category: 'polyglot',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.language === 'c');
    }
  },
  {
    id: 'polyglot_cpp',
    name: 'Modern C++ Artisan',
    description: 'Complete a full challenge session in C++ (C++20).',
    icon: '⚡',
    category: 'polyglot',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.language === 'cpp');
    }
  },
  {
    id: 'polyglot_java',
    name: 'JVM Engineer',
    description: 'Complete a full challenge session in Java (SE 17).',
    icon: '☕',
    category: 'polyglot',
    difficulty: 'intermediate',
    cost: 120,
    price: 120,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.language === 'java');
    }
  },
  {
    id: 'true_polyglot',
    name: 'True Polyglot',
    description: 'Earn stars across all 4 language tracks (Python, C, C++, Java).',
    icon: '👑',
    category: 'polyglot',
    difficulty: 'master',
    cost: 350,
    price: 350,
    evaluate: (profile, session) => {
      const camp = profile?.campaign || {};
      const languages = ['python', 'c', 'cpp', 'java'];
      return languages.every(lang => {
        const entry = camp[lang] || {};
        const hasStars = (entry.beginnerStars || 0) > 0 || (entry.intermediateStars || 0) > 0 || (entry.expertStars || 0) > 0;
        const currentMatch = Boolean(session && session.isCompleted && session.language === lang && session.accuracy >= 60);
        return hasStars || currentMatch;
      });
    }
  },

  // --- Category: Modes ---
  {
    id: 'hardcore_unlocked',
    name: 'Trial of Fire',
    description: 'Reach Level 5 (Algorithm Ace) to unlock Hardcore Mode.',
    icon: '🔥',
    category: 'modes',
    difficulty: 'expert',
    cost: 200,
    price: 200,
    evaluate: (profile) => {
      return (profile?.level || 1) >= 5;
    }
  },
  {
    id: 'hardcore_survivor',
    name: 'Iron Will',
    description: 'Complete a session in Hardcore Mode with hearts remaining.',
    icon: '🖤',
    category: 'modes',
    difficulty: 'master',
    cost: 300,
    price: 300,
    evaluate: (profile, session) => {
      return Boolean(session && session.isCompleted && session.mode === 'hardcore' && (session.lives === undefined || session.lives > 0));
    }
  }
]);

// Fast ID lookup map for achievements
const ACHIEVEMENTS_MAP = new Map(ACHIEVEMENTS.map(a => [a.id, a]));

// =============================================================================
// 5. MASTER GAMIFICATION CONTROLLER
// =============================================================================
export const Gamification = {
  LEVEL_THRESHOLDS,
  MAX_LEVEL,
  XP_RULES,
  UNLOCKABLE_THEMES,
  UNLOCKABLE_AVATARS,
  CHALLENGE_MODES,
  ACHIEVEMENTS,

  /**
   * Derive player level, title, and progress metrics from cumulative XP.
   * @param {number} totalXP
   * @returns {object} Level metadata and next-tier progress metrics
   */
  getLevelData(totalXP) {
    const xp = Math.max(0, parseInt(totalXP, 10) || 0);

    let currentTier = LEVEL_THRESHOLDS[0];
    let nextTier = LEVEL_THRESHOLDS[1] || null;

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (xp >= LEVEL_THRESHOLDS[i].requiredXP) {
        currentTier = LEVEL_THRESHOLDS[i];
        nextTier = LEVEL_THRESHOLDS[i + 1] || null;
      } else {
        break;
      }
    }

    const isMaxLevel = nextTier === null;
    const currentBaseXP = currentTier.requiredXP;
    const nextRequiredXP = nextTier ? nextTier.requiredXP : currentTier.requiredXP;
    const xpIntoLevel = xp - currentBaseXP;
    const xpSpan = nextRequiredXP - currentBaseXP;
    const xpNeededForNext = isMaxLevel ? 0 : Math.max(0, nextRequiredXP - xp);

    const progressPercent = isMaxLevel
      ? 100
      : Math.min(100, Math.max(0, Math.round((xpIntoLevel / xpSpan) * 100)));

    return {
      level: currentTier.level,
      title: currentTier.title,
      reward: currentTier.reward,
      currentXP: xp,
      currentBaseXP,
      nextRequiredXP,
      xpIntoLevel,
      xpNeededForNext,
      progressPercent,
      isMaxLevel
    };
  },

  /**
   * Derive level integer (1-10) directly from XP.
   */
  deriveLevel(totalXP) {
    return this.getLevelData(totalXP).level;
  },

  /**
   * Get rank title for given level.
   */
  getLevelTitle(level) {
    const tier = LEVEL_THRESHOLDS.find(t => t.level === level) || LEVEL_THRESHOLDS[0];
    return tier.title;
  },

  /**
   * Calculate detailed progression toward next level.
   */
  calculateLevelProgress(totalXP) {
    const data = this.getLevelData(totalXP);
    return {
      level: data.level,
      title: data.title,
      reward: data.reward,
      currentXP: data.currentXP,
      currentLevelThreshold: data.currentBaseXP,
      nextLevel: data.isMaxLevel ? data.level : data.level + 1,
      nextLevelThreshold: data.nextRequiredXP,
      xpToNextLevel: data.xpNeededForNext,
      progressPercent: data.isMaxLevel ? 1.0 : (data.progressPercent / 100),
      isMaxRank: data.isMaxLevel
    };
  },

  /**
   * Calculate verified XP earned from a completed game session.
   * Master rules: docs/GAME_RULES.md §2.1
   * @param {object} summary - Validated session summary
   * @returns {number} Non-negative XP yield
   */
  calculateSessionXP(summary) {
    if (!summary || typeof summary !== 'object') return 0;

    const results = summary.results || summary.answers;
    let earnedXP = 0;

    if (Array.isArray(results) && results.length > 0) {
      // Calculate itemized XP per answered question
      results.forEach(r => {
        if (r && (r.isCorrect || r.correct)) {
          const diff = (r.difficulty || summary.difficulty || 'beginner').toLowerCase();
          if (diff === 'expert') {
            earnedXP += XP_RULES.expertCorrect;
          } else if (diff === 'intermediate') {
            earnedXP += XP_RULES.intermediateCorrect;
          } else {
            earnedXP += XP_RULES.beginnerCorrect;
          }
        }
      });
    } else {
      // Fallback calculation using aggregate correct counts
      const diff = (summary.difficulty || 'beginner').toLowerCase();
      const perQuestion = diff === 'expert' ? XP_RULES.expertCorrect : diff === 'intermediate' ? XP_RULES.intermediateCorrect : XP_RULES.beginnerCorrect;
      earnedXP = (summary.questionsCorrect || 0) * perQuestion;
    }

    // Flawless stage bonus (100% accuracy in completed run with zero mistakes and zero retries)
    const isCompleted = summary.isCompleted !== false;
    const correct = summary.questionsCorrect !== undefined
      ? summary.questionsCorrect
      : (Array.isArray(results) ? results.filter(r => r && (r.isCorrect || r.correct)).length : 0);
    const total = summary.totalQuestions !== undefined
      ? summary.totalQuestions
      : (Array.isArray(results) ? results.length : 0);
    const incorrect = summary.incorrectCount !== undefined
      ? summary.incorrectCount
      : (summary.questionsAttempted !== undefined ? Math.max(0, summary.questionsAttempted - correct) : 0);
    const retries = summary.retriesUsedCount || summary.retriesUsed || 0;

    const isFlawless = total > 0 && correct === total && incorrect === 0 && retries === 0;
    if (isFlawless && isCompleted && total > 0) {
      earnedXP += XP_RULES.flawlessBonus;
    }

    // Daily Challenge clear bonus
    if ((summary.mode === 'daily' || summary.isDaily) && isCompleted) {
      earnedXP += XP_RULES.dailyClearBonus;
    }

    return Math.max(0, earnedXP);
  },

  /**
   * Evaluate unearned achievement badges against profile state and session summary.
   * @param {object} profile - Active profile state
   * @param {object} [sessionSummary=null] - Optional current session summary
   * @returns {Array<object>} Newly unlocked achievement badges
   */
  evaluateAchievements(profile, sessionSummary = null) {
    if (!profile) return [];

    const existingUnlocked = new Set([
      ...(profile.unlockedAchievements || []),
      ...(profile.badges || [])
    ].map(a => (typeof a === 'string' ? a : a.id)));

    const newlyUnlocked = [];

    for (const badge of ACHIEVEMENTS) {
      if (existingUnlocked.has(badge.id)) continue;

      try {
        const isSatisfied = badge.evaluate(profile, sessionSummary);
        if (isSatisfied) {
          newlyUnlocked.push({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            category: badge.category,
            unlockedAt: Date.now()
          });
        }
      } catch (err) {
        console.warn(`[Gamification] Error evaluating badge '${badge.id}':`, err);
      }
    }

    return newlyUnlocked;
  },

  /**
   * Determine available cosmetics and modes for a player level.
   * @param {number} level
   * @returns {{ themes: Array<string>, avatars: Array<string>, modes: Array<string> }}
   */
  getUnlockedRewards(level) {
    const lvl = Math.max(1, parseInt(level, 10) || 1);

    const themes = UNLOCKABLE_THEMES
      .filter(t => lvl >= t.requiredLevel)
      .map(t => t.id);

    const avatars = UNLOCKABLE_AVATARS
      .filter(a => lvl >= a.requiredLevel)
      .map(a => a.id);

    const modes = CHALLENGE_MODES
      .filter(m => lvl >= m.requiredLevel)
      .map(m => m.id);

    return { themes, avatars, modes };
  },

  /**
   * Check if a specific theme is unlocked for a given level.
   */
  isThemeUnlocked(themeId, profileOrLevel) {
    const theme = UNLOCKABLE_THEMES.find(t => t.id === themeId);
    if (!theme) return false;
    if (typeof profileOrLevel === 'object' && profileOrLevel !== null) {
      if (Array.isArray(profileOrLevel.unlockedThemes) && profileOrLevel.unlockedThemes.includes(themeId)) {
        return true;
      }
      return (profileOrLevel.level || 1) >= theme.requiredLevel;
    }
    const lvl = parseInt(profileOrLevel, 10) || 1;
    return lvl >= theme.requiredLevel;
  },

  /**
   * Check if a specific avatar is unlocked for a given level.
   */
  isAvatarUnlocked(avatarId, level) {
    const avatar = UNLOCKABLE_AVATARS.find(a => a.id === avatarId);
    if (!avatar) return false;
    return (level || 1) >= avatar.requiredLevel;
  },

  /**
   * Check if a challenge mode is unlocked for a given level.
   */
  isModeUnlocked(modeId, level) {
    const mode = CHALLENGE_MODES.find(m => m.id === modeId);
    if (!mode) return false;
    return (level || 1) >= mode.requiredLevel;
  },

  /**
   * Master processing pipeline for verified session summaries.
   * Applies XP, evaluates level-up, updates streaks, grants badges, and guards against duplicate processing.
   *
   * @param {object} profile - Active player profile
   * @param {object} summary - Session summary from GameEngine
   * @returns {object} Processing result with rewards, level changes, and new achievements
   */
  processSessionSummary(profile, summary) {
    if (!profile || !summary) {
      return { success: false, error: 'Invalid profile or summary payload.' };
    }

    // 1. Idempotency Check: Reject already-processed session IDs
    const processedIds = new Set(profile.processedSessionIds || []);
    const sessionId = summary.sessionId || summary.id;

    if (sessionId && processedIds.has(sessionId)) {
      console.warn(`[Gamification] Session ${sessionId} already processed. Skipping duplicate reward calculation.`);
      return {
        success: true,
        isDuplicate: true,
        earnedXP: 0,
        xpEarned: 0,
        levelUp: false,
        newAchievements: [],
        newBadges: [],
        newRewards: { themes: [], avatars: [], modes: [] },
        unlockedThemes: [],
        unlockedAvatars: [],
        unlockedModes: [],
        updatedProfile: { ...profile }
      };
    }

    // 2. Check if this level was already cleared previously (Repeat cleared level check)
    const tierKey = `${(summary.language || 'python').toLowerCase()}_${(summary.difficulty || 'beginner').toLowerCase()}`;
    const alreadyCleared = Boolean(profile.completedTiers && profile.completedTiers[tierKey]);

    // On first clears, player receives 100% full milestone clear XP.
    // On repeat clears of an already completed tier, award 50% replay practice XP so players always progress!
    let rawEarnedXP = this.calculateSessionXP(summary);
    const isRepeatClear = alreadyCleared && summary.mode !== 'practice';
    const earnedXP = isRepeatClear ? Math.max(50, Math.round(rawEarnedXP * 0.5)) : rawEarnedXP;

    const initialSpendableXP = Math.max(0, profile.xp || 0);
    const initialLifetimeXP = typeof profile.lifetimeXP === 'number' ? profile.lifetimeXP : initialSpendableXP;

    const totalLifetimeXP = initialLifetimeXP + earnedXP;
    const totalSpendableXP = initialSpendableXP + earnedXP;
    const totalScore = (profile.totalScore || 0) + (summary.totalScore || 0);

    // 3. Derive Rank & Level based on LIFETIME XP (never decreases when points are spent on badges/avatars!)
    const prevLevelData = this.getLevelData(initialLifetimeXP);
    const newLevelData = this.getLevelData(totalLifetimeXP);
    const didLevelUp = newLevelData.level > prevLevelData.level;

    // 4. Update Cumulative Stats
    const prevStats = profile.stats || {};
    const attempted = summary.questionsAttempted || summary.totalQuestions || 0;
    const correct = summary.questionsCorrect || 0;
    // Derive best streak strictly based on continuous correct answers (Item 7)
    let maxContStreak = 0;
    if (Array.isArray(summary.results) && summary.results.length > 0) {
      let curCont = 0;
      for (const r of summary.results) {
        if (r && (r.isCorrect || r.correct) && !r.retried && (r.attempts === undefined || r.attempts <= 1)) {
          curCont++;
          if (curCont > maxContStreak) maxContStreak = curCont;
        } else {
          curCont = 0;
        }
      }
    }
    const sessionHighestStreak = maxContStreak > 0 ? maxContStreak : (summary.highestStreak || summary.bestStreak || 0);
    const currentHighestStreak = prevStats.highestStreak || profile.bestStreak || 0;
    const bestStreak = Math.max(currentHighestStreak, sessionHighestStreak);

    // If user takes a test ONLY on missed questions (retry_missed), do not alter existing stage accuracy stats
    const isRetryMissed = summary.mode === 'retry_missed' || Boolean(summary.isRetryMissed);

    const updatedStats = {
      ...prevStats,
      gamesPlayed: (prevStats.gamesPlayed || 0) + (isRetryMissed ? 0 : 1),
      questionsAttempted: (prevStats.questionsAttempted || 0) + (isRetryMissed ? 0 : attempted),
      questionsCorrect: (prevStats.questionsCorrect || 0) + (isRetryMissed ? 0 : correct),
      highestStreak: bestStreak
    };

    // 5. Update Campaign Progress & Stars
    const campaign = { ...(profile.campaign || {}) };
    const lang = summary.language || 'python';
    const diff = summary.difficulty || 'beginner';
    const accuracy = summary.accuracy || (attempted > 0 ? Math.round((correct / attempted) * 100) : 0);

    if (!isRetryMissed) {
      let starsEarned = 0;
      if (accuracy >= 90) starsEarned = 3;
      else if (accuracy >= 75) starsEarned = 2;
      else if (accuracy >= 60) starsEarned = 1;

      const langCampaign = { ...(campaign[lang] || { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' }) };
      const starField = `${diff}Stars`;
      if (starsEarned > (langCampaign[starField] || 0)) {
        langCampaign[starField] = starsEarned;
      }

      // Tier advancement unlock logic
      if (diff === 'beginner' && accuracy >= 70 && langCampaign.unlockedTier === 'beginner') {
        langCampaign.unlockedTier = 'intermediate';
      } else if (diff === 'intermediate' && accuracy >= 75 && langCampaign.unlockedTier === 'intermediate') {
        langCampaign.unlockedTier = 'expert';
      }
      campaign[lang] = langCampaign;
    }

    // Track cleared tier in completedTiers
    const completedTiers = { ...(profile.completedTiers || {}) };
    if (!isRetryMissed && (accuracy >= 60 || summary.isCompleted)) {
      completedTiers[tierKey] = true;
    }

    // 6. Provisional Profile for Achievement Evaluation
    const provisionalProfile = {
      ...profile,
      xp: totalSpendableXP,
      lifetimeXP: totalLifetimeXP,
      totalScore: totalScore,
      level: newLevelData.level,
      rank: newLevelData.title,
      stats: updatedStats,
      campaign,
      completedTiers
    };

    // 7. Evaluate Achievements
    const newAchievements = this.evaluateAchievements(provisionalProfile, summary);

    // Merge existing + new achievements
    const existingAchievements = profile.unlockedAchievements || [];
    const mergedAchievements = [
      ...existingAchievements,
      ...newAchievements
    ];

    // 8. Track Session ID (Capped at 100 entries to prevent memory growth)
    const nextProcessedIds = [...(profile.processedSessionIds || [])];
    if (sessionId) {
      nextProcessedIds.push(sessionId);
      if (nextProcessedIds.length > 100) {
        nextProcessedIds.shift();
      }
    }

    // 9. Derive Rewards
    const unlockedRewards = this.getUnlockedRewards(newLevelData.level);

    // Newly unlocked cosmetics compared to previous level
    const prevUnlocked = this.getUnlockedRewards(prevLevelData.level);
    const newThemes = unlockedRewards.themes.filter(t => !prevUnlocked.themes.includes(t));
    const newAvatars = unlockedRewards.avatars.filter(a => !prevUnlocked.avatars.includes(a));
    const newModes = unlockedRewards.modes.filter(m => !prevUnlocked.modes.includes(m));

    const allBadgeIds = mergedAchievements.map(a => typeof a === 'string' ? a : a.id);

    // 10. Update session history & missed question inventory (capped at 50 sessions)
    const existingHistory = Array.isArray(profile.sessionHistory) ? profile.sessionHistory : [];
    const historyEntry = {
      sessionId: summary.sessionId || summary.id || `sess_${Date.now()}`,
      timestamp: summary.timestamp || Date.now(),
      language: summary.language || 'python',
      difficulty: summary.difficulty || 'beginner',
      mode: summary.mode || 'campaign',
      totalQuestions: summary.totalQuestions || 0,
      questionsAttempted: attempted,
      questionsCorrect: correct,
      incorrectCount: Math.max(0, attempted - correct),
      accuracy: accuracy,
      isRetry: isRetryMissed,
      isRetryMissed: isRetryMissed,
      totalScore: summary.totalScore || 0,
      earnedXP,
      bestStreak: sessionHighestStreak,
      hintsUsed: summary.hintsUsed || 0,
      retriesUsed: summary.retriesUsed || 0,
      isCompleted: summary.isCompleted !== false,
      isGameOver: Boolean(summary.isGameOver),
      missedQuestionIds: Array.isArray(summary.missedQuestionIds) ? summary.missedQuestionIds : [],
      results: Array.isArray(summary.results) ? summary.results : []
    };

    const nextHistory = [historyEntry, ...existingHistory].slice(0, 50);

    // Update missedQuestionIds: add missed from this session, remove solved correctly
    const currentMissed = new Set(profile.missedQuestionIds || []);
    if (Array.isArray(summary.missedQuestionIds)) {
      summary.missedQuestionIds.forEach(id => currentMissed.add(id));
    }
    if (Array.isArray(summary.results)) {
      summary.results.forEach(r => {
        if (r && (r.isCorrect || r.correct)) {
          currentMissed.delete(r.questionId || r.id);
        }
      });
    }

    const updatedProfile = {
      ...profile,
      xp: totalSpendableXP,
      lifetimeXP: totalLifetimeXP,
      totalScore: totalScore,
      level: newLevelData.level,
      rank: newLevelData.title,
      bestStreak: bestStreak,
      badges: allBadgeIds,
      stats: updatedStats,
      campaign,
      completedTiers,
      unlockedAchievements: mergedAchievements,
      processedSessionIds: nextProcessedIds,
      sessionHistory: nextHistory,
      missedQuestionIds: Array.from(currentMissed),
      unlockedThemes: unlockedRewards.themes,
      unlockedAvatars: unlockedRewards.avatars,
      unlockedModes: unlockedRewards.modes
    };

    const badgeIds = newAchievements.map(a => typeof a === 'string' ? a : a.id);
    return {
      success: true,
      isDuplicate: false,
      isRepeatClear,
      earnedXP,
      xpEarned: earnedXP,
      totalXP: totalSpendableXP,
      lifetimeXP: totalLifetimeXP,
      totalScore,
      prevLevel: prevLevelData.level,
      newLevel: newLevelData.level,
      rankTitle: newLevelData.title,
      levelUp: didLevelUp,
      newAchievements,
      newBadges: badgeIds,
      newRewards: {
        themes: newThemes,
        avatars: newAvatars,
        modes: newModes
      },
      unlockedThemes: newThemes,
      unlockedAvatars: newAvatars,
      unlockedModes: newModes,
      updatedProfile
    };
  },

  /**
   * Retrieve badge metadata definition by ID.
   * @param {string} badgeId
   * @returns {object|null}
   */
  getBadge(badgeId) {
    return ACHIEVEMENTS_MAP.get(badgeId) || null;
  },

  /**
   * Return all badges in registry.
   */
  getAllBadges() {
    return [...ACHIEVEMENTS];
  }
};
