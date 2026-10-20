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
    const profile = State.get('activeProfile');
    const prefs = profile && profile.preferences ? profile.preferences : {};

    this.selectedLanguage = prefs.language || State.get('selectedLanguage') || 'python';
    this.selectedDifficulty = prefs.difficulty || State.get('selectedDifficulty') || 'beginner';

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
    if (!['python', 'c', 'cpp', 'java'].includes(lang)) return;
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
      python: { filename: 'challenge_01.py', badge: 'Python 3.10+', tagClass: 'tag-python' },
      c:      { filename: 'challenge_01.c', badge: 'C (C99)', tagClass: 'tag-c' },
      cpp:    { filename: 'challenge_01.cpp', badge: 'C++ (C++20)', tagClass: 'tag-cpp' },
      java:   { filename: 'Challenge01.java', badge: 'Java 17', tagClass: 'tag-java' }
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
   * Evaluate player profile readiness and route or open onboarding accordingly.
   * @param {HTMLElement} [triggerEl=null]
   */
  handlePlayAction(triggerEl = null) {
    const activeProfile = State.get('activeProfile');
    const isComplete = Profile.isOnboardingComplete(activeProfile);

    if (!isComplete) {
      // First-time player: open guided onboarding wizard
      Onboarding.open(triggerEl, true);
    } else {
      // Profile is verified: navigate to challenge arena with current preferences
      Router.navigateTo('game', {
        lang: this.selectedLanguage,
        diff: this.selectedDifficulty
      });
    }
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
