/**
 * SyntaxArena Landing Page Coordinator (Batch 3)
 * Manages language track selection, difficulty choice, hero actions,
 * progression showcase, mobile navigation, and onboarding trigger flow.
 * Source of truth: docs/MVP_SPEC.md & docs/ARCHITECTURE.md
 */

import { Utils } from './utils.js';
import { State } from './state.js';
import { Profile } from './profile.js';
import { Router } from './router.js';
import { AudioEngine } from './audio.js';
import { UI } from './ui.js';
import { Onboarding } from './onboarding.js';
import { QuestionBank } from './question-bank.js';

export const LandingPage = {
  selectedLanguage: 'python',
  selectedDifficulty: 'beginner',
  dailyQuestions: [],
  dailyCurrentIndex: 0,
  dailyResults: [],
  dailyTimerInterval: null,
  dailyTimeLeft: 45,
  dailyCountdownInterval: null,

  /**
   * Initialize all landing page components and interactive sections.
   */
  init() {
    console.info('[SyntaxArena] Initializing Landing Page & Onboarding Coordinator...');

    // 1. Initialize Onboarding Module
    Onboarding.init();

    // 2. Restore or synchronize language & difficulty from profile/state
    this._initSelections();

    // 3. Bind Language Track cards
    this._bindLanguageSelection();

    // 4. Bind Difficulty selection cards and apply locks
    this._bindDifficultySelection();
    this._updateDifficultyLockStatus();

    // 5. Bind Hero and Header Call-To-Action buttons
    this._bindPlayActions();

    // 6. Bind Mobile Navigation Drawer
    this._bindMobileMenu();

    // 7. Update dynamic footer year
    this._updateFooterYear();

    // 8. Bind Daily Hacker Gauntlet & 7-Day Punch Card
    this._initDailyGauntlet();

    // 9. Listen for onboarding completion to sync cards
    window.addEventListener('onboarding:completed', (e) => {
      if (e.detail) {
        if (e.detail.language) this.selectLanguage(e.detail.language, false);
        if (e.detail.difficulty) this.selectDifficulty(e.detail.difficulty, false);
      }
    });

    // 10. If query explicitly requests onboarding/reset (?onboarding=1/?reset=1), auto-open onboarding
    const params = Router.getQueryParams();
    const needsOnboarding = params.onboarding === '1' || params.reset === '1';
    if (needsOnboarding) {
      setTimeout(() => Onboarding.open(null, false), 250);
    }
  },

  /**
   * Determine initial selections from active profile or defaults.
   */
  _initSelections() {
    const params = Router.getQueryParams();
    const isReset = params.reset === '1';

    const profile = State.get('activeProfile');
    const prefs = profile && profile.preferences ? profile.preferences : {};

    this.selectedLanguage = prefs.language || State.get('selectedLanguage') || 'python';
    this.selectedDifficulty = isReset ? 'beginner' : (prefs.difficulty || State.get('selectedDifficulty') || 'beginner');

    // Ensure selectedDifficulty is strictly unlocked
    const lockCheck = this.isDifficultyUnlocked(this.selectedDifficulty, this.selectedLanguage);
    if (!lockCheck.unlocked) {
      this.selectedDifficulty = 'beginner';
      State.set('selectedDifficulty', 'beginner');
    }

    this.selectLanguage(this.selectedLanguage, false);
    this.selectDifficulty(this.selectedDifficulty, false);
  },

  /**
   * Bind selectable Language Track cards.
   */
  _bindLanguageSelection() {
    const cards = Utils.qsa('#language-tracks-container .card-selectable');
    cards.forEach(card => {
      const lang = card.getAttribute('data-lang');

      card.addEventListener('click', () => {
        AudioEngine.playClick();
        this.selectLanguage(lang, true);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          AudioEngine.playClick();
          this.selectLanguage(lang, true);
        }
      });
    });
  },

  /**
   * Change selected language track.
   * @param {string} lang ('python'|'c'|'cpp'|'java')
   * @param {boolean} [saveState=true]
   */
  selectLanguage(lang, saveState = true) {
    if (!['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql', 'typescript', 'go', 'html', 'asm'].includes(lang)) return;
    this.selectedLanguage = lang;

    const cards = Utils.qsa('#language-tracks-container .card-selectable');
    cards.forEach(card => {
      const isSelected = card.getAttribute('data-lang') === lang;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });

    // Update hero code preview to match selected language (if present)
    this._updateHeroPreview(lang);

    // Refresh difficulty locks since campaign progression varies per track
    this._updateDifficultyLockStatus();

    // Update Endless Mode showcase launcher link
    const showcaseEndlessBtn = Utils.qs('#btn-showcase-endless');
    if (showcaseEndlessBtn) {
      showcaseEndlessBtn.href = `game.html?lang=${lang}&mode=endless`;
    }

    if (saveState) {
      State.set('selectedLanguage', lang);
      const profile = State.get('activeProfile');
      if (profile && profile.id) {
        Profile.updateProfile(profile.id, {
          preferences: { ...(profile.preferences || {}), language: lang }
        });
      }
    }
  },

  /**
   * Check whether a difficulty tier is unlocked for the specified language.
   * Beginner: always unlocked.
   * Intermediate: requires Beginner cleared OR >= 1,000 points.
   * Expert: requires Intermediate cleared OR >= 2,500 points.
   * @param {string} diff ('beginner'|'intermediate'|'expert')
   * @param {string} [lang]
   * @returns {{ unlocked: boolean, reason: string }}
   */
  isDifficultyUnlocked(diff, lang = this.selectedLanguage) {
    if (diff === 'beginner') {
      return { unlocked: true, reason: 'Open Tier' };
    }

    const profile = State.get('activeProfile') || {};
    const xp = (typeof profile.totalScore === 'number' ? profile.totalScore : profile.xp) || 0;
    const camp = (profile.campaign && profile.campaign[lang]) || {};
    const completedTiers = profile.completedTiers || {};

    if (diff === 'intermediate') {
      const clearedBeg = camp.beginnerStars > 0 || camp.unlockedTier === 'intermediate' || camp.unlockedTier === 'expert' || completedTiers[lang + '_beginner'];
      if (clearedBeg) {
        return { unlocked: true, reason: 'Beginner Completed' };
      }
      if (xp >= 1000) {
        return { unlocked: true, reason: 'Unlocked via Bonus Points (1,000+ XP)' };
      }
      return {
        unlocked: false,
        reason: `Intermediate is locked! Complete Beginner first or earn 1,000 pts (You have ${xp.toLocaleString()} pts)`
      };
    }

    if (diff === 'expert') {
      const clearedInt = camp.intermediateStars > 0 || camp.unlockedTier === 'expert' || completedTiers[lang + '_intermediate'];
      if (clearedInt) {
        return { unlocked: true, reason: 'Intermediate Completed' };
      }
      if (xp >= 2500) {
        return { unlocked: true, reason: 'Unlocked via Bonus Points (2,500+ XP)' };
      }
      return {
        unlocked: false,
        reason: `Expert is locked! Complete Intermediate first or earn 2,500 pts (You have ${xp.toLocaleString()} pts)`
      };
    }

    return { unlocked: true, reason: '' };
  },

  /**
   * Update visual lock badges, indicators, and status on difficulty cards.
   */
  _updateDifficultyLockStatus() {
    const diffs = ['beginner', 'intermediate', 'expert'];
    let needResetToBeginner = false;

    diffs.forEach(diff => {
      const card = Utils.qs(`#difficulty-cards-container .card-selectable[data-diff="${diff}"]`);
      const badge = Utils.qs(`#diff-badge-${diff}`);
      const statusText = Utils.qs(`#diff-status-${diff}`);
      const indicator = card ? card.querySelector('.selection-indicator') : null;
      const lockInfo = this.isDifficultyUnlocked(diff, this.selectedLanguage);

      if (!card) return;

      if (!lockInfo.unlocked) {
        card.classList.add('is-locked');
        card.classList.remove('is-selected');
        card.setAttribute('aria-disabled', 'true');
        card.setAttribute('aria-checked', 'false');
        if (indicator) {
          indicator.textContent = '🔒';
        }
        if (badge) {
          badge.textContent = diff === 'intermediate' ? '🔒 Gate: Beginner or 1,000 Pts' : '🔒 Gate: Intermediate or 2,500 Pts';
        }
        if (statusText) {
          statusText.textContent = 'Locked';
          statusText.style.color = 'var(--text-muted)';
          statusText.style.fontWeight = 'normal';
        }
        if (this.selectedDifficulty === diff) {
          needResetToBeginner = true;
        }
      } else {
        card.classList.remove('is-locked');
        card.removeAttribute('aria-disabled');
        const isSelected = this.selectedDifficulty === diff;
        card.classList.toggle('is-selected', isSelected);
        card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        if (indicator) {
          indicator.textContent = '✓';
        }
        if (badge) {
          if (diff === 'beginner') {
            badge.textContent = 'Open Tier';
          } else {
            badge.textContent = lockInfo.reason.includes('Bonus') ? '🔓 Unlocked (Bonus Pts)' : '✓ Unlocked';
          }
        }
        if (statusText) {
          if (isSelected) {
            statusText.textContent = 'Active Selection';
            statusText.style.color = 'var(--color-success)';
            statusText.style.fontWeight = '700';
          } else {
            statusText.textContent = 'Click to Select';
            statusText.style.color = 'var(--text-muted)';
            statusText.style.fontWeight = 'normal';
          }
        }
      }
    });

    if (needResetToBeginner) {
      this.selectDifficulty('beginner', true);
    }

    this._updateRoadmapTiers();
  },

  /**
   * Update visual lock state on Section E Progression Roadmap tier cards.
   */
  _updateRoadmapTiers() {
    const intCard = Utils.qs('#roadmap-tier-intermediate');
    const expCard = Utils.qs('#roadmap-tier-expert');
    const intWatermark = Utils.qs('#roadmap-watermark-intermediate');
    const expWatermark = Utils.qs('#roadmap-watermark-expert');
    const intStatus = Utils.qs('#roadmap-status-intermediate');
    const expStatus = Utils.qs('#roadmap-status-expert');

    const intLock = this.isDifficultyUnlocked('intermediate', this.selectedLanguage);
    if (intCard) {
      intCard.classList.toggle('tier-locked', !intLock.unlocked);
      intCard.classList.toggle('tier-active', intLock.unlocked && this.selectedDifficulty === 'intermediate');
      if (intWatermark) intWatermark.textContent = intLock.unlocked ? 'Tier 2: Unlocked' : 'Tier 2: Locked';
      if (intStatus) {
        intStatus.textContent = intLock.unlocked ? 'Status: ✓ Available in Active Arena' : 'Status: 🔒 Locked (Requires Beginner Clear or 1,000 Pts)';
      }
    }

    const expLock = this.isDifficultyUnlocked('expert', this.selectedLanguage);
    if (expCard) {
      expCard.classList.toggle('tier-locked', !expLock.unlocked);
      expCard.classList.toggle('tier-active', expLock.unlocked && this.selectedDifficulty === 'expert');
      if (expWatermark) expWatermark.textContent = expLock.unlocked ? 'Tier 3: Unlocked' : 'Tier 3: Locked';
      if (expStatus) {
        expStatus.textContent = expLock.unlocked ? 'Status: ✓ Available in Active Arena' : 'Status: 🔒 Locked (Requires Intermediate Clear or 2,500 Pts)';
      }
    }
  },

  /**
   * Bind selectable Difficulty cards.
   */
  _bindDifficultySelection() {
    const cards = Utils.qsa('#difficulty-cards-container .card-selectable');
    cards.forEach(card => {
      const diff = card.getAttribute('data-diff');

      card.addEventListener('click', () => {
        this.selectDifficulty(diff, true);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectDifficulty(diff, true);
        }
      });
    });
  },

  /**
   * Change selected difficulty tier with gating check.
   * @param {string} diff ('beginner'|'intermediate'|'expert')
   * @param {boolean} [saveState=true]
   */
  selectDifficulty(diff, saveState = true) {
    if (!['beginner', 'intermediate', 'expert'].includes(diff)) return;

    const lockStatus = this.isDifficultyUnlocked(diff, this.selectedLanguage);
    if (!lockStatus.unlocked) {
      AudioEngine.playError();
      UI.showToast(lockStatus.reason, 'info');
      return;
    }

    AudioEngine.playClick();
    this.selectedDifficulty = diff;

    const cards = Utils.qsa('#difficulty-cards-container .card-selectable');
    cards.forEach(card => {
      const cardDiff = card.getAttribute('data-diff');
      const isSelected = cardDiff === diff;
      card.classList.toggle('is-selected', isSelected);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');

      const statusText = Utils.qs(`#diff-status-${cardDiff}`);
      if (statusText) {
        if (isSelected) {
          statusText.textContent = 'Active Selection';
          statusText.style.color = 'var(--color-success)';
          statusText.style.fontWeight = '700';
        } else {
          const lStatus = this.isDifficultyUnlocked(cardDiff, this.selectedLanguage);
          statusText.textContent = lStatus.unlocked ? 'Click to Select' : 'Locked';
          statusText.style.color = 'var(--text-muted)';
          statusText.style.fontWeight = 'normal';
        }
      }
    });

    if (saveState) {
      State.set('selectedDifficulty', diff);
      const profile = State.get('activeProfile');
      if (profile && profile.id) {
        Profile.updateProfile(profile.id, {
          preferences: { ...(profile.preferences || {}), difficulty: diff }
        });
      }
    }
  },

  /**
   * Update hero indicators if elements exist (safely no-op if removed).
   */
  _updateHeroPreview(lang) {
    const previewFilename = Utils.qs('#hero-preview-filename');
    const previewCode = Utils.qs('#hero-preview-code');
    const previewLangBadge = Utils.qs('#hero-preview-lang-tag');
    if (!previewFilename && !previewCode && !previewLangBadge) return;

    const meta = {
      python:     { filename: 'challenge_01.py', badge: 'Python 3.10+', tagClass: 'tag-python' },
      c:          { filename: 'challenge_01.c', badge: 'C (C99)', tagClass: 'tag-c' },
      cpp:        { filename: 'challenge_01.cpp', badge: 'C++ (C++20)', tagClass: 'tag-cpp' },
      java:       { filename: 'Challenge01.java', badge: 'Java 17', tagClass: 'tag-java' },
      cyber:      { filename: 'exploit_01.sh', badge: 'Cyber & Linux', tagClass: 'tag-cyber' },
      javascript: { filename: 'solution_01.js', badge: 'JavaScript ES2024', tagClass: 'tag-javascript' },
      rust:       { filename: 'main_01.rs', badge: 'Rust 2021', tagClass: 'tag-rust' },
      sql:        { filename: 'query_01.sql', badge: 'ANSI SQL', tagClass: 'tag-sql' },
      typescript: { filename: 'solution_01.ts', badge: 'TypeScript 5.4+', tagClass: 'tag-typescript' },
      go:         { filename: 'main_01.go', badge: 'Go 1.22+', tagClass: 'tag-go' },
      html:       { filename: 'index.html', badge: 'HTML5 & CSS', tagClass: 'tag-html' },
      asm:        { filename: 'exploit_01.asm', badge: 'x86-64 & ARM64', tagClass: 'tag-asm' }
    };
    const currentMeta = meta[lang] || meta.python;
    if (previewFilename) previewFilename.textContent = currentMeta.filename;
    if (previewLangBadge) {
      previewLangBadge.textContent = currentMeta.badge;
      previewLangBadge.className = `tag-lang ${currentMeta.tagClass}`;
    }
  },

  /**
   * Bind primary Play and Start buttons.
   */
  _bindPlayActions() {
    const playButtons = [
      Utils.qs('#btn-hero-start'),
      Utils.qs('#btn-nav-play'),
      Utils.qs('#btn-mobile-play'),
      Utils.qs('#btn-daily-cta'),
      Utils.qs('#btn-challenges-start')
    ].filter(Boolean);

    playButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        AudioEngine.playClick();
        this.handlePlayAction(btn);
      });
    });

    // Secondary Smooth Scroll Actions
    const exploreBtns = Utils.qsa('[data-scroll-to]');
    exploreBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        AudioEngine.playClick();
        const targetId = btn.getAttribute('data-scroll-to');
        const targetEl = Utils.qs(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  },

  /**
   * Evaluate player profile readiness and open stage selector modal or onboarding.
   * @param {HTMLElement} [triggerEl=null]
   */
  handlePlayAction(triggerEl = null) {
    const activeProfile = State.get('activeProfile');
    const isComplete = Profile.isOnboardingComplete(activeProfile);

    if (!isComplete) {
      // First-time player: open guided onboarding wizard
      Onboarding.open(triggerEl, true);
    } else {
      // Open Stage Selection Modal with 4 bite-sized stages & boss stage
      this.openStageSelectorModal(this.selectedLanguage, this.selectedDifficulty);
    }
  },

  /**
   * Open the interactive Stage Selector Roadmap Modal for the chosen track and tier.
   * @param {string} lang
   * @param {string} diff
   */
  openStageSelectorModal(lang, diff) {
    const modal = Utils.qs('#modal-stage-selector');
    const stageGrid = Utils.qs('#modal-stage-grid');
    const tag = Utils.qs('#modal-stage-track-tag');
    const marathonLink = Utils.qs('#btn-modal-stage-marathon');
    const closeBtn = Utils.qs('#btn-close-stage-modal');
    const cancelBtn = Utils.qs('#btn-cancel-stage-modal');

    const lockInfo = this.isDifficultyUnlocked(diff, lang);
    if (!lockInfo.unlocked) {
      AudioEngine.playError();
      UI.showToast(lockInfo.reason || `🔒 ${diff.charAt(0).toUpperCase() + diff.slice(1)} tier is locked!`, 'info');
      this.selectDifficulty('beginner', true);
      diff = 'beginner';
    }

    if (!modal || !stageGrid) {
      Router.navigateTo('game', { lang, diff });
      return;
    }

    const meta = {
      python: 'Python 3', c: 'C', cpp: 'C++', java: 'Java',
      cyber: 'Cyber & Linux', javascript: 'JavaScript', rust: 'Rust', sql: 'SQL',
      typescript: 'TypeScript', go: 'Go (Golang)', html: 'HTML5 & CSS', asm: 'Assembly & RE'
    };
    const langName = meta[lang] || 'Python 3';
    const diffCapitalized = diff.charAt(0).toUpperCase() + diff.slice(1);

    if (tag) tag.textContent = `${langName} • ${diffCapitalized}`;
    if (marathonLink) marathonLink.href = `game.html?lang=${lang}&diff=${diff}&stage=marathon`;

    const endlessLink = Utils.qs('#btn-modal-stage-endless');
    if (endlessLink) endlessLink.href = `game.html?lang=${lang}&mode=endless`;

    const profile = State.get('activeProfile') || Profile.getActiveProfile() || {};
    const stageStars = profile.stageStars || {};
    const completedStages = profile.completedStages || {};

    const STAGES = [
      { id: 1, title: 'Stage 1: Core Fundamentals', desc: 'Questions 1–5 • ~3 mins', focus: 'Variables & Flow', isBoss: false },
      { id: 2, title: 'Stage 2: Core Logic', desc: 'Questions 6–10 • ~3 mins', focus: 'Mutability & Loops', isBoss: false },
      { id: 3, title: 'Stage 3: Control Flow', desc: 'Questions 11–15 • ~3 mins', focus: 'Conditionals & Branching', isBoss: false },
      { id: 4, title: 'Stage 4: 💀 MINI-BOSS', desc: 'Questions 16–20 • ~3 mins', focus: 'Syntax Crucible I', isBoss: true },
      { id: 5, title: 'Stage 5: Data Structures', desc: 'Questions 21–25 • ~3 mins', focus: 'Collections & Memory', isBoss: false },
      { id: 6, title: 'Stage 6: Systems Logic', desc: 'Questions 26–30 • ~3 mins', focus: 'Algorithms & State', isBoss: false },
      { id: 7, title: 'Stage 7: Advanced Patterns', desc: 'Questions 31–35 • ~3 mins', focus: 'Architecture & OOP', isBoss: false },
      { id: 8, title: 'Stage 8: 💀 APEX FINAL BOSS', desc: 'Questions 36–40 • ~3 mins', focus: 'The Master Crucible', isBoss: true }
    ];

    stageGrid.innerHTML = '';
    STAGES.forEach((stg) => {
      const stageKey = `${lang}_${diff}_stage_${stg.id}`;
      const stars = stageStars[stageKey] || 0;
      const isCleared = !!completedStages[stageKey];

      // Gating: Stage 1 is always unlocked. Stage N unlocks strictly when Stage N-1 has all 3 stars (no level bypass)
      let isUnlocked = stg.id === 1;
      if (!isUnlocked) {
        const prevKey = `${lang}_${diff}_stage_${stg.id - 1}`;
        const prevStars = stageStars[prevKey] || 0;
        isUnlocked = prevStars >= 3;
      }

      const card = document.createElement('a');
      card.className = `stage-card ${stg.isBoss ? 'is-boss' : ''} ${!isUnlocked ? 'is-locked' : ''}`;
      if (isUnlocked) {
        card.href = `game.html?lang=${lang}&diff=${diff}&stage=${stg.id}`;
      } else {
        card.setAttribute('aria-disabled', 'true');
      }

      card.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <span class="badge ${stg.isBoss ? 'badge-coral' : isCleared ? 'badge-emerald' : 'badge-neutral'}" style="font-size: 10px;">
              ${stg.isBoss ? (stg.id === 8 ? '💀 Apex Boss' : '💀 Mini-Boss') : `Stage ${stg.id} / 8`}
            </span>
            <div class="star-rating-display" style="font-size: 14px;">
              ${'⭐'.repeat(stars)}<span style="opacity: 0.25;">${'⭐'.repeat(3 - stars)}</span>
            </div>
          </div>
          <h4 style="margin: 0.25rem 0; font-size: var(--text-sm); font-family: var(--font-display); color: ${stg.isBoss ? 'var(--color-coral)' : 'var(--text-primary)'};">
            ${stg.title}
          </h4>
          <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 0.5rem; line-height: 1.4;">
            ${stg.desc} • ${stg.focus}
          </p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.5rem; font-size: 11px;">
          <span style="color: ${isUnlocked ? (isCleared ? 'var(--color-success)' : 'var(--color-primary)') : 'var(--text-muted)'}; font-weight: 700;">
            ${!isUnlocked ? '🔒 Locked (Need 3★ on Stage ' + (stg.id - 1) + ')' : isCleared ? '✓ Cleared' : '▶ Play Stage'}
          </span>
          <span style="color: var(--text-muted); font-size: 10px;">5 Questions</span>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (!isUnlocked) {
          e.preventDefault();
          AudioEngine.playError();
          UI.showToast(`🔒 Stage ${stg.id} is locked! Earn all 3 stars (⭐⭐⭐) on Stage ${stg.id - 1} to unlock.`, 'info');
        } else {
          AudioEngine.playClick();
        }
      });

      stageGrid.appendChild(card);
    });

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  },

  /**
   * Mobile menu toggle drawer.
   */
  _bindMobileMenu() {
    const menuBtn = Utils.qs('#btn-mobile-menu');
    const drawer = Utils.qs('#mobile-nav-drawer');

    if (!menuBtn || !drawer) return;

    menuBtn.addEventListener('click', () => {
      AudioEngine.playClick();
      const isOpen = drawer.classList.contains('is-open');
      const nextState = !isOpen;

      drawer.classList.toggle('is-open', nextState);
      menuBtn.setAttribute('aria-expanded', nextState ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', nextState ? 'Close navigation menu' : 'Open navigation menu');
    });

    // Close on any navigation click inside drawer
    const drawerLinks = drawer.querySelectorAll('a, button');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        drawer.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  },

  /**
   * Generate current local copyright year.
   */
  _updateFooterYear() {
    const yearEl = Utils.qs('#copyright-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  },

  /* ==========================================================================
     DAILY HACKER GAUNTLET & 7-DAY PUNCH CARD
     ========================================================================== */

  /**
   * Bind Daily Gauntlet buttons, punch card matrix, countdown timer, and modal events.
   */
  _initDailyGauntlet() {
    this.renderDailyPunchCard();
    this.startDailyCountdown();

    const launchBtn = Utils.qs('#btn-launch-daily-gauntlet');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        AudioEngine.playClick();
        const status = Profile.getDailyGauntletStatus();
        if (status && status.completedToday) {
          UI.showToast("✓ Today's Hacker Gauntlet is already stamped! Next mission drops at 00:00 UTC.", 'info');
          return;
        }
        this.openDailyGauntletModal();
      });
    }

    const closeBtn = Utils.qs('#btn-close-gauntlet-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        AudioEngine.playClick();
        this.closeDailyGauntletModal();
      });
    }

    const claimBtn = Utils.qs('#btn-claim-gauntlet-finish');
    if (claimBtn) {
      claimBtn.addEventListener('click', () => {
        AudioEngine.playClick();
        this.closeDailyGauntletModal();
      });
    }

    const modal = Utils.qs('#modal-daily-gauntlet');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeDailyGauntletModal();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
        this.closeDailyGauntletModal();
      }
    });
  },

  /**
   * Render the 7-day punch card matrix according to profile streak data.
   */
  renderDailyPunchCard() {
    const container = Utils.qs('#daily-punch-matrix');
    if (!container) return;

    const status = Profile.getDailyGauntletStatus();
    if (!status) return;

    // Update streak badge
    const streakPill = Utils.qs('#daily-streak-pill');
    if (streakPill) {
      streakPill.innerHTML = `🔥 ${status.streak}-Day Streak`;
    }

    // Render 7 punch stamp cards
    container.innerHTML = status.rewardsSchedule.map(sched => {
      const isClaimed = status.claimedDays.includes(sched.day);
      const isActive = sched.day === status.activeDay && !status.completedToday;
      let cardClass = 'punch-card is-locked';
      let badgeText = '🔒 LOCKED';

      if (isClaimed) {
        cardClass = 'punch-card is-claimed';
        badgeText = '✓ CLAIMED';
      } else if (isActive) {
        cardClass = 'punch-card is-active';
        badgeText = '▶ TODAY';
      }

      return `
        <div class="${cardClass}" data-day="${sched.day}" title="${sched.name}: ${sched.label}${sched.perk ? ' • ' + sched.perk : ''}">
          <span class="punch-day-label">DAY ${sched.day}</span>
          <span class="punch-icon">${sched.icon}</span>
          <span class="punch-reward-val">${sched.label}</span>
          <span class="punch-status-badge">${badgeText}</span>
        </div>
      `;
    }).join('');

    // Update status text and CTA button
    const statusText = Utils.qs('#daily-mission-status-text');
    const launchBtn = Utils.qs('#btn-launch-daily-gauntlet');

    if (status.completedToday) {
      if (statusText) {
        statusText.innerHTML = `<span style="color: var(--color-success); font-weight: 700;">✓ Today's Mission Accomplished!</span> Neural streak preserved. Next mission resets at midnight.`;
      }
      if (launchBtn) {
        launchBtn.innerHTML = `<span>✓ Completed for Today</span>`;
        launchBtn.style.opacity = '0.85';
      }
    } else {
      const todaySched = status.rewardsSchedule.find(s => s.day === status.activeDay) || { label: '+50 XP' };
      if (statusText) {
        statusText.innerHTML = `<span style="color: var(--color-warning); font-weight: 700;">⚡ Today's Mission Ready:</span> 3 rapid code output deductions (${todaySched.label}).`;
      }
      if (launchBtn) {
        launchBtn.innerHTML = `<span>⚡ Launch Daily Gauntlet</span>`;
        launchBtn.style.opacity = '1';
      }
    }
  },

  /**
   * Start 1-second interval ticking down to 00:00 UTC.
   */
  startDailyCountdown() {
    const timerEl = Utils.qs('#daily-countdown-timer');
    if (!timerEl) return;

    if (this.dailyCountdownInterval) {
      clearInterval(this.dailyCountdownInterval);
    }

    const updateTimer = () => {
      const now = new Date();
      const nextMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
      const diffMs = Math.max(0, nextMidnight.getTime() - now.getTime());

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      timerEl.textContent = `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    };

    updateTimer();
    this.dailyCountdownInterval = setInterval(updateTimer, 1000);
  },

  /**
   * Open the Daily Hacker Gauntlet modal and start with question 1.
   */
  openDailyGauntletModal() {
    const modal = Utils.qs('#modal-daily-gauntlet');
    if (!modal) return;

    this.dailyQuestions = QuestionBank.getDailyQuestions(null, 3);
    if (!this.dailyQuestions || !this.dailyQuestions.length) {
      UI.showToast('Unable to load daily questions. Please try again.', 'error');
      return;
    }

    this.dailyCurrentIndex = 0;
    this.dailyResults = [];

    // Reset views
    const quizHeader = Utils.qs('#gauntlet-quiz-header');
    const questionContainer = Utils.qs('#gauntlet-question-container');
    const celebrationContainer = Utils.qs('#gauntlet-celebration-container');

    if (quizHeader) quizHeader.style.display = 'flex';
    if (questionContainer) questionContainer.style.display = 'block';
    if (celebrationContainer) celebrationContainer.style.display = 'none';

    modal.style.display = 'flex';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    this.renderDailyQuestion();
  },

  /**
   * Close the Daily Hacker Gauntlet modal.
   */
  closeDailyGauntletModal() {
    const modal = Utils.qs('#modal-daily-gauntlet');
    if (this.dailyTimerInterval) {
      clearInterval(this.dailyTimerInterval);
      this.dailyTimerInterval = null;
    }

    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }

    this.renderDailyPunchCard();
  },

  /**
   * Render the current daily question inside the modal.
   */
  renderDailyQuestion() {
    const q = this.dailyQuestions[this.dailyCurrentIndex];
    if (!q) return;

    if (this.dailyTimerInterval) {
      clearInterval(this.dailyTimerInterval);
    }
    this.dailyTimeLeft = 45;

    // Header counter
    const counterEl = Utils.qs('#gauntlet-question-counter');
    if (counterEl) {
      counterEl.textContent = `QUESTION ${this.dailyCurrentIndex + 1} OF ${this.dailyQuestions.length}`;
    }

    const langBadge = Utils.qs('#gauntlet-lang-badge');
    if (langBadge) {
      langBadge.textContent = (q.language || 'SYNTAX').toUpperCase();
    }

    const timerDisplay = Utils.qs('#gauntlet-timer-display');
    if (timerDisplay) {
      timerDisplay.textContent = `⏱️ ${this.dailyTimeLeft}s`;
      timerDisplay.style.color = 'var(--color-warning)';
    }

    const promptEl = Utils.qs('#gauntlet-prompt');
    if (promptEl) {
      promptEl.textContent = q.prompt || 'What is the exact stdout or return value?';
    }

    const filenameEl = Utils.qs('#gauntlet-code-filename');
    if (filenameEl) {
      const ext = q.language === 'python' ? 'py' : (q.language === 'javascript' ? 'js' : (q.language === 'rust' ? 'rs' : 'src'));
      filenameEl.textContent = `daily_${q.language || 'code'}_q${this.dailyCurrentIndex + 1}.${ext}`;
    }

    const snippetEl = Utils.qs('#gauntlet-code-snippet');
    if (snippetEl) {
      snippetEl.textContent = q.code || q.prompt || '// Code puzzle';
    }

    // Hide feedback panel
    const feedbackPanel = Utils.qs('#gauntlet-feedback-panel');
    if (feedbackPanel) {
      feedbackPanel.style.display = 'none';
    }

    // Render options
    const optionsContainer = Utils.qs('#gauntlet-options');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      const opts = Array.isArray(q.options) ? q.options : [];
      opts.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gauntlet-option-btn';
        btn.innerHTML = `
          <span class="gauntlet-option-key">${String.fromCharCode(65 + idx)}</span>
          <span class="gauntlet-option-text">${Utils.escapeHtml(optText)}</span>
        `;
        btn.addEventListener('click', () => {
          this.handleDailyAnswer(idx);
        });
        optionsContainer.appendChild(btn);
      });
    }

    // Start 45s countdown timer
    this.dailyTimerInterval = setInterval(() => {
      this.dailyTimeLeft--;
      if (timerDisplay) {
        timerDisplay.textContent = `⏱️ ${this.dailyTimeLeft}s`;
        if (this.dailyTimeLeft <= 10) {
          timerDisplay.style.color = 'var(--color-danger)';
        }
      }
      if (this.dailyTimeLeft <= 0) {
        clearInterval(this.dailyTimerInterval);
        this.handleDailyAnswer(-1); // Timeout
      }
    }, 1000);
  },

  /**
   * Process option selection for daily gauntlet question.
   * @param {number} chosenIdx
   */
  handleDailyAnswer(chosenIdx) {
    if (this.dailyTimerInterval) {
      clearInterval(this.dailyTimerInterval);
      this.dailyTimerInterval = null;
    }

    const q = this.dailyQuestions[this.dailyCurrentIndex];
    if (!q) return;

    const optionsContainer = Utils.qs('#gauntlet-options');
    const optionBtns = optionsContainer ? optionsContainer.querySelectorAll('.gauntlet-option-btn') : [];

    // Disable all option buttons
    optionBtns.forEach(btn => {
      btn.disabled = true;
    });

    const isTimeout = chosenIdx === -1;
    const chosenText = !isTimeout && q.options && q.options[chosenIdx] !== undefined ? q.options[chosenIdx] : null;
    const isCorrect = !isTimeout && chosenText === q.correctAnswer;

    this.dailyResults.push({
      id: q.id,
      correct: isCorrect,
      timeLeft: this.dailyTimeLeft,
      chosenText
    });

    // Style buttons
    optionBtns.forEach((btn, idx) => {
      const optText = q.options[idx];
      if (optText === q.correctAnswer) {
        btn.classList.add('is-correct');
      } else if (idx === chosenIdx && !isCorrect) {
        btn.classList.add('is-wrong');
      }
    });

    const feedbackPanel = Utils.qs('#gauntlet-feedback-panel');
    const feedbackText = Utils.qs('#gauntlet-feedback-text');

    if (feedbackPanel && feedbackText) {
      feedbackPanel.style.display = 'block';
      if (isCorrect) {
        AudioEngine.playSuccess();
        feedbackPanel.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
        feedbackPanel.style.border = '1px solid var(--color-success)';
        feedbackText.innerHTML = `
          <div style="font-weight: 700; color: var(--color-success); margin-bottom: 0.25rem;">✓ Correct Trace!</div>
          <div style="font-size: 13px; color: var(--text-secondary);">${Utils.escapeHtml(q.explanation || 'Great deduction!')}</div>
        `;
      } else {
        AudioEngine.playError();
        feedbackPanel.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
        feedbackPanel.style.border = '1px solid var(--color-danger)';
        const cause = isTimeout ? '⏱️ Time expired!' : '✗ Incorrect trace.';
        feedbackText.innerHTML = `
          <div style="font-weight: 700; color: var(--color-danger); margin-bottom: 0.25rem;">${cause}</div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 0.25rem;">Correct Answer: <strong style="color: var(--color-primary);">${Utils.escapeHtml(q.correctAnswer)}</strong></div>
          <div style="font-size: 12px; color: var(--text-muted);">${Utils.escapeHtml(q.explanation || '')}</div>
        `;
      }
    }

    // Auto advance after 1.5s
    setTimeout(() => {
      if (this.dailyCurrentIndex + 1 < this.dailyQuestions.length) {
        this.dailyCurrentIndex++;
        this.renderDailyQuestion();
      } else {
        this.finishDailyGauntlet();
      }
    }, 1500);
  },

  /**
   * Finalize the Daily Gauntlet, record profile streak and show celebration screen.
   */
  finishDailyGauntlet() {
    const res = Profile.recordDailyGauntletCompletion(this.dailyResults);
    const quizHeader = Utils.qs('#gauntlet-quiz-header');
    const questionContainer = Utils.qs('#gauntlet-question-container');
    const celebrationContainer = Utils.qs('#gauntlet-celebration-container');

    if (quizHeader) quizHeader.style.display = 'none';
    if (questionContainer) questionContainer.style.display = 'none';
    if (celebrationContainer) celebrationContainer.style.display = 'block';

    AudioEngine.playLevelUp();
    UI.triggerConfetti();

    const rewardBox = Utils.qs('#gauntlet-reward-display');
    if (rewardBox) {
      const reward = (res && res.reward) ? res.reward : { xp: 50, name: 'Hacker Initiate' };
      const streak = (res && res.newStreak) ? res.newStreak : 1;
      const dayIdx = (res && res.dayIndex) ? res.dayIndex : 1;

      rewardBox.innerHTML = `
        <div style="font-size: var(--text-sm); font-weight: 700; color: var(--color-success); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
          Day ${dayIdx} Punch Stamped!
        </div>
        <div style="font-size: var(--text-2xl); font-weight: 900; color: var(--text-primary); margin-bottom: 0.5rem;">
          +${reward.xp} Bonus XP
        </div>
        <div style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 0.75rem;">
          <span class="badge badge-amber" style="font-size: 11px;">🔥 ${streak}-Day Streak</span>
          <span class="badge badge-cyan" style="font-size: 11px;">Rank: ${reward.name}</span>
        </div>
        ${reward.avatar ? `
          <div style="background: rgba(139, 92, 246, 0.15); border: 1px solid var(--color-violet); border-radius: var(--radius-md); padding: 0.5rem; margin-top: 0.5rem;">
            <div style="font-size: 11px; font-weight: 800; color: var(--color-violet);">🎁 EXCLUSIVE REWARD UNLOCKED:</div>
            <div style="font-size: var(--text-sm); font-weight: 700; color: var(--text-primary);">Hex Dragon Avatar</div>
          </div>
        ` : ''}
        ${reward.perk ? `
          <div style="font-size: 11px; color: var(--color-warning); margin-top: 0.5rem; font-weight: 700;">
            🎁 Perk Unlocked: ${reward.perk}
          </div>
        ` : ''}
      `;
    }

    this.renderDailyPunchCard();
  }
};
