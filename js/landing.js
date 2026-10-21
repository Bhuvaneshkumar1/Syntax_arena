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

export const LandingPage = {
  selectedLanguage: 'python',
  selectedDifficulty: 'beginner',

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

    // 8. Listen for onboarding completion to sync cards
    window.addEventListener('onboarding:completed', (e) => {
      if (e.detail) {
        if (e.detail.language) this.selectLanguage(e.detail.language, false);
        if (e.detail.difficulty) this.selectDifficulty(e.detail.difficulty, false);
      }
    });

    // 9. If query explicitly requests onboarding/reset (?onboarding=1/?reset=1), auto-open onboarding
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
    if (!['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql'].includes(lang)) return;
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
      sql:        { filename: 'query_01.sql', badge: 'ANSI SQL', tagClass: 'tag-sql' }
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
      cyber: 'Cyber & Linux', javascript: 'JavaScript', rust: 'Rust', sql: 'SQL'
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
  }
};
