/**
 * SyntaxArena Mega-Boss Engine (Daemon Incursion)
 * Authoritative state machine managing Boss Health Pools, Phase 2 Overclocking,
 * Enrage Timers, Procedural Glitch Attacks, Floating Combat Text, and Victory Rewards.
 */

import { Utils } from './utils.js';
import { Storage } from './storage.js';
import { State } from './state.js';
import { AudioEngine } from './audio.js';
import { Gamification } from './gamification.js';
import { BossEncounters } from '../data/boss-encounters.js';

export const BossEngine = {
  activeBoss: null,
  currentHp: 1000,
  maxHp: 1000,
  phase: 1,
  turnCount: 0,
  damageDealtTotal: 0,
  isVictory: false,
  isDefeated: false,
  isPlayerDefeated: false,
  consecutivePlayerErrors: 0,
  activeGlitch: null,
  glitchTimeoutId: null,

  /**
   * Initialize a new Mega-Boss battle encounter
   * @param {string} bossId
   * @returns {object} Initialized boss data
   */
  initBattle(bossId = 'null_leviathan') {
    const boss = BossEncounters.getById(bossId) || BossEncounters.getDefaultBoss();
    this.activeBoss = boss;
    this.maxHp = boss.maxHp || 1000;
    this.currentHp = this.maxHp;
    this.phase = 1;
    this.turnCount = 0;
    this.damageDealtTotal = 0;
    this.isVictory = false;
    this.isDefeated = false;
    this.isPlayerDefeated = false;
    this.consecutivePlayerErrors = 0;
    this.clearActiveGlitch();

    console.info(`[BossEngine] Initialized Boss Encounter: ${boss.name} (${this.maxHp} HP)`);
    return this.getStatus();
  },

  /**
   * Current battle status snapshot
   */
  getStatus() {
    return {
      boss: this.activeBoss,
      currentHp: this.currentHp,
      maxHp: this.maxHp,
      hpPct: Math.max(0, Math.min(100, Math.round((this.currentHp / this.maxHp) * 100))),
      phase: this.phase,
      isVictory: this.isVictory,
      isDefeated: this.isDefeated,
      isPlayerDefeated: this.isPlayerDefeated || false,
      consecutivePlayerErrors: this.consecutivePlayerErrors || 0,
      turnCount: this.turnCount,
      damageDealtTotal: this.damageDealtTotal
    };
  },

  /**
   * Process a player's answer turn in the boss encounter
   * @param {boolean} isCorrect
   * @param {number} timeRemaining (seconds)
   * @param {number} totalTime (default 30s)
   * @param {number} streak (consecutive correct count)
   * @param {string} difficulty ('beginner'|'intermediate'|'expert')
   * @returns {object} Turn result payload
   */
  processTurn(isCorrect, timeRemaining = 15, totalTime = 30, streak = 0, difficulty = 'intermediate') {
    this.turnCount++;

    if (isCorrect) {
      // 1. Calculate Base Damage by question difficulty
      let baseDamage = 160;
      if (difficulty === 'beginner') baseDamage = 120;
      if (difficulty === 'expert') baseDamage = 220;

      // 2. Speed Bonus Damage (up to +60 damage if answered fast)
      const speedRatio = Math.max(0, Math.min(1, timeRemaining / totalTime));
      const speedBonus = Math.round(speedRatio * 60);

      // 3. Streak Multiplier (1.0x to 1.75x)
      const streakMultiplier = Math.min(1.75, 1.0 + (streak * 0.15));

      // 4. Critical Strike Check (fast deduction + active streak)
      const isCritical = (speedRatio >= 0.65) || (streak >= 3);
      const critMultiplier = isCritical ? 1.35 : 1.0;

      const totalDamage = Math.round((baseDamage + speedBonus) * streakMultiplier * critMultiplier);

      // Apply damage
      this.currentHp = Math.max(0, this.currentHp - totalDamage);
      this.damageDealtTotal += totalDamage;

      // Check Phase 2 Overclock Trigger (at <= 50% HP)
      let phaseTransition = false;
      if (this.phase === 1 && this.currentHp <= (this.maxHp * 0.5) && this.currentHp > 0) {
        this.phase = 2;
        phaseTransition = true;
        this.triggerPhase2Overclock();
      }

      // Check Boss Defeat
      if (this.currentHp <= 0) {
        this.isVictory = true;
        this.isDefeated = true;
      }

      this.consecutivePlayerErrors = 0;

      return {
        isPlayerHit: true,
        isCorrect: true,
        damage: totalDamage,
        isCritical,
        transitionToPhase2: phaseTransition,
        phaseTransition,
        taunt: phaseTransition ? (this.activeBoss?.taunts?.phase2 || '') : '',
        status: this.getStatus()
      };
    } else {
      // Player made a mistake -> Boss regenerates HP and strikes back!
      this.consecutivePlayerErrors = (this.consecutivePlayerErrors || 0) + 1;
      const healAmount = Math.round(this.maxHp * 0.10);
      const prevHp = this.currentHp;
      this.currentHp = Math.min(this.maxHp, this.currentHp + healAmount);
      const actualHealed = this.currentHp - prevHp;

      // Check player wipe conditions: 3 consecutive mistakes or boss reaches full HP after battle started
      if (this.consecutivePlayerErrors >= 3 || (this.currentHp >= this.maxHp && this.turnCount > 1)) {
        this.isPlayerDefeated = true;
      }

      const attackPayload = this.triggerBossAttack();

      return {
        isPlayerHit: false,
        isCorrect: false,
        damage: 0,
        healed: actualHealed,
        isCritical: false,
        attack: attackPayload,
        isPlayerDefeated: this.isPlayerDefeated,
        consecutiveErrors: this.consecutivePlayerErrors,
        taunt: this.isPlayerDefeated
          ? (this.activeBoss?.taunts?.playerWipe || 'YOU CANNOT DEFEAT THE DAEMON! SYSTEM PURGED.')
          : (this.activeBoss?.taunts?.attack || 'Segmentation Fault!'),
        status: this.getStatus()
      };
    }
  },

  /**
   * Phase 2 Overclock transition
   */
  triggerPhase2Overclock() {
    console.info(`[BossEngine] ⚠️ ENRAGE: ${this.activeBoss?.name} has entered PHASE 2 (OVERCLOCKED)!`);
    try {
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playBossRoar) {
        AudioEngine.playBossRoar();
      }
    } catch (_) {}

    if (typeof document !== 'undefined') {
      const arenaShell = Utils.qs('.arena-screen, .app-main, main');
      if (arenaShell) {
        arenaShell.classList.add('boss-phase-2-active');
      }

      const bossAvatar = Utils.qs('#boss-avatar-emblem');
      if (bossAvatar) {
        bossAvatar.classList.add('animate-overclock-pulse');
      }

      const bossTauntEl = Utils.qs('#boss-taunt-text');
      if (bossTauntEl && this.activeBoss?.taunts?.phase2) {
        bossTauntEl.textContent = `"${this.activeBoss.taunts.phase2}"`;
        bossTauntEl.classList.add('animate-pulse');
      }
    }
  },

  /**
   * Unleash the Boss Signature Glitch Attack onto the UI
   */
  triggerBossAttack() {
    if (!this.activeBoss) return null;

    const attackType = this.activeBoss.attackType || 'null_dereference';
    this.activeGlitch = attackType;

    try {
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playBossGlitch) {
        AudioEngine.playBossGlitch();
      }
    } catch (_) {}

    if (typeof document !== 'undefined') {
      const overlay = Utils.qs('#boss-glitch-overlay');
      if (overlay) {
        overlay.className = 'boss-glitch-overlay is-active glitch-' + attackType;
      }

      const bossTauntEl = Utils.qs('#boss-taunt-text');
      if (bossTauntEl && this.activeBoss?.taunts?.attack) {
        bossTauntEl.textContent = `"${this.activeBoss.taunts.attack}"`;
      }

      // Specific attack mechanics
      if (attackType === 'null_dereference') {
        // Scramble 1-2 non-correct answer options with static
        const options = Utils.qsa('.option-btn, .option-card');
        if (options.length > 1) {
          const targetOption = options[options.length - 1];
          if (targetOption) {
            const originalText = targetOption.innerHTML;
            targetOption.setAttribute('data-glitch-original', originalText);
            targetOption.classList.add('is-glitched-option');
            const codeEl = targetOption.querySelector('.code-font, span') || targetOption;
            codeEl.textContent = '0x00000000 [SIGSEGV NULL_VOID]';
          }
        }
      } else if (attackType === 'resource_starvation') {
        // Disable 1 option with a mutex padlock for 3 seconds
        const options = Utils.qsa('.option-btn, .option-card');
        if (options.length > 0) {
          const lockedOption = options[0];
          lockedOption.classList.add('is-mutex-locked');
          setTimeout(() => {
            lockedOption.classList.remove('is-mutex-locked');
          }, 3000);
        }
      }
    }

    // Auto-clear glitch after 3.5 seconds
    if (this.glitchTimeoutId) clearTimeout(this.glitchTimeoutId);
    this.glitchTimeoutId = setTimeout(() => {
      this.clearActiveGlitch();
    }, 3500);

    return {
      attackType,
      attackName: this.activeBoss.attackName,
      attackDesc: this.activeBoss.attackDesc
    };
  },

  /**
   * Clear active visual glitches from DOM
   */
  clearActiveGlitch() {
    if (this.glitchTimeoutId) {
      clearTimeout(this.glitchTimeoutId);
      this.glitchTimeoutId = null;
    }
    this.activeGlitch = null;

    if (typeof document !== 'undefined') {
      const overlay = Utils.qs('#boss-glitch-overlay');
      if (overlay) {
        overlay.className = 'boss-glitch-overlay';
      }

      // Restore glitched options
      Utils.qsa('[data-glitch-original]').forEach(opt => {
        const orig = opt.getAttribute('data-glitch-original');
        if (orig) opt.innerHTML = orig;
        opt.removeAttribute('data-glitch-original');
        opt.classList.remove('is-glitched-option');
      });

      Utils.qsa('.is-mutex-locked').forEach(opt => opt.classList.remove('is-mutex-locked'));
    }
  },

  /**
   * Finalize Boss Victory, award XP & Boss Slayer badge
   * @param {object} profile Active player profile
   * @returns {object} Reward breakdown
   */
  claimVictoryRewards(profile) {
    if (!this.activeBoss || !this.isVictory) return null;

    const rewards = this.activeBoss.rewards || { xp: 500, badgeId: 'badge_boss_leviathan' };
    const xpReward = rewards.xp || 500;
    const badgeId = rewards.badgeId;

    try {
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playBossDefeat) {
        AudioEngine.playBossDefeat();
      }
    } catch (_) {}

    // Update profile
    if (profile) {
      profile.xp = (profile.xp || 0) + xpReward;
      profile.totalPoints = (profile.totalPoints || 0) + xpReward;

      // Track defeated bosses
      if (!Array.isArray(profile.defeatedBosses)) {
        profile.defeatedBosses = [];
      }
      if (!profile.defeatedBosses.includes(this.activeBoss.id)) {
        profile.defeatedBosses.push(this.activeBoss.id);
      }

      // Grant Boss Slayer badge
      if (!Array.isArray(profile.badges)) {
        profile.badges = [];
      }
      if (badgeId && !profile.badges.includes(badgeId)) {
        profile.badges.push(badgeId);
      }

      // Check level upgrades
      if (typeof Gamification !== 'undefined' && Gamification.calculateLevel) {
        profile.level = Gamification.calculateLevel(profile.xp);
      }

      // Save via Storage
      if (typeof Storage !== 'undefined' && Storage.saveProfile) {
        Storage.saveProfile(profile);
      }
    }

    return {
      boss: this.activeBoss,
      xpAwarded: xpReward,
      badgeId,
      badgeName: rewards.badgeName,
      titleUnlocked: rewards.title
    };
  }
};
