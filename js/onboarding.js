/**
 * SyntaxArena Onboarding Module (Batch 3)
 * Multi-step first-time player onboarding wizard.
 * Step 1: Call-sign (Username) & Avatar selection
 * Step 2: Preferred Language (Python, C, C++, Java)
 * Step 3: Preferred Difficulty (Beginner, Intermediate, Expert)
 * Step 4: Confirmation & Safe Persistence
 * Source of truth: docs/MVP_SPEC.md & docs/ARCHITECTURE.md
 */

import { Utils } from './utils.js';
import { State } from './state.js';
import { Profile, AVATAR_CATALOG } from './profile.js';
import { UI } from './ui.js';
import { AudioEngine } from './audio.js';
import { Router } from './router.js';

export const Onboarding = {
  // Temporary wizard state (discarded on cancel)
  _state: {
    currentStep: 1,
    username: '',
    avatarId: 'cyber_fox',
    language: 'python',
    difficulty: 'beginner',
    autoNavigateOnConfirm: false
  },

  _isInitialized: false,

  /**
   * Initialize onboarding event listeners and avatar elements.
   */
  init() {
    if (this._isInitialized) return;

    this._renderAvatarGrid();
    this._bindEvents();
    this._isInitialized = true;
  },

  /**
   * Render the 6-avatar selection grid into the modal DOM.
   */
  _renderAvatarGrid() {
    const grid = Utils.qs('#onboarding-avatar-grid');
    if (!grid) return;

    grid.innerHTML = '';
    AVATAR_CATALOG.forEach(avatar => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `avatar-option-btn ${avatar.id === this._state.avatarId ? 'is-selected' : ''}`;
      btn.setAttribute('data-avatar-id', avatar.id);
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', avatar.id === this._state.avatarId ? 'true' : 'false');
      btn.setAttribute('aria-label', `Choose avatar ${avatar.name}: ${avatar.description}`);

      btn.innerHTML = `
        <div class="avatar-preview-lg">
          <img src="assets/images/${avatar.id}.svg" width="36" height="36" alt="" aria-hidden="true">
        </div>
        <span style="font-family: var(--font-display); font-weight: 700; font-size: var(--text-xs);">${avatar.name}</span>
        <span style="font-size: 11px; color: var(--text-muted); line-height: 1.2;">${avatar.description}</span>
      `;

      btn.addEventListener('click', () => {
        AudioEngine.playClick();
        this._selectAvatar(avatar.id);
      });

      grid.appendChild(btn);
    });
  },

  /**
   * Select an avatar inside the wizard.
   */
  _selectAvatar(avatarId) {
    this._state.avatarId = avatarId;
    const buttons = Utils.qsa('#onboarding-avatar-grid .avatar-option-btn');
    buttons.forEach(btn => {
      const isMatch = btn.getAttribute('data-avatar-id') === avatarId;
      btn.classList.toggle('is-selected', isMatch);
      btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
    });
  },

  /**
   * Bind wizard controls, step transitions, and validation.
   */
  _bindEvents() {
    // Live username validation
    const usernameInput = Utils.qs('#onboarding-username');
    const feedbackEl = Utils.qs('#onboarding-username-feedback');

    if (usernameInput) {
      usernameInput.addEventListener('input', () => {
        this._state.username = usernameInput.value;
        this._validateUsernameInput(usernameInput.value, feedbackEl, false);
      });

      usernameInput.addEventListener('blur', () => {
        this._validateUsernameInput(usernameInput.value, feedbackEl, true);
      });
    }

    // Wizard Step Navigation Buttons
    // Step 1 -> Step 2
    const btnToStep2 = Utils.qs('#btn-wizard-to-step2');
    if (btnToStep2) {
      btnToStep2.addEventListener('click', (e) => {
        e.preventDefault();
        AudioEngine.playClick();
        if (this._validateStep1()) {
          this.goToStep(2);
        }
      });
    }

    // Step 2 Language Buttons
    const langCards = Utils.qsa('#wizard-lang-grid .card-selectable');
    langCards.forEach(card => {
      card.addEventListener('click', () => {
        AudioEngine.playClick();
        const lang = card.getAttribute('data-lang');
        this._selectLanguage(lang);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          AudioEngine.playClick();
          const lang = card.getAttribute('data-lang');
          this._selectLanguage(lang);
        }
      });
    });

    // Step 2 Back & Next
    const btnBackTo1 = Utils.qs('#btn-wizard-back-to-1');
    if (btnBackTo1) {
      btnBackTo1.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(1);
      });
    }
    const btnToStep3 = Utils.qs('#btn-wizard-to-step3');
    if (btnToStep3) {
      btnToStep3.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(3);
      });
    }

    // Step 3 Difficulty Buttons
    const diffCards = Utils.qsa('#wizard-diff-grid .card-selectable');
    diffCards.forEach(card => {
      card.addEventListener('click', () => {
        AudioEngine.playClick();
        const diff = card.getAttribute('data-diff');
        this._selectDifficulty(diff);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          AudioEngine.playClick();
          const diff = card.getAttribute('data-diff');
          this._selectDifficulty(diff);
        }
      });
    });

    // Step 3 Back & Next
    const btnBackTo2 = Utils.qs('#btn-wizard-back-to-2');
    if (btnBackTo2) {
      btnBackTo2.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(2);
      });
    }
    const btnToStep4 = Utils.qs('#btn-wizard-to-step4');
    if (btnToStep4) {
      btnToStep4.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(4);
      });
    }

    // Step 4 Actions
    const btnBackTo3 = Utils.qs('#btn-wizard-back-to-3');
    if (btnBackTo3) {
      btnBackTo3.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(3);
      });
    }

    const btnEditChoices = Utils.qs('#btn-wizard-edit-choices');
    if (btnEditChoices) {
      btnEditChoices.addEventListener('click', () => {
        AudioEngine.playClick();
        this.goToStep(1);
      });
    }

    // Confirm & Save
    const btnConfirmPlay = Utils.qs('#btn-wizard-confirm-play');
    if (btnConfirmPlay) {
      btnConfirmPlay.addEventListener('click', () => {
        AudioEngine.playSuccess();
        this._confirm(true);
      });
    }

    const btnConfirmSave = Utils.qs('#btn-wizard-confirm-save');
    if (btnConfirmSave) {
      btnConfirmSave.addEventListener('click', () => {
        AudioEngine.playSuccess();
        this._confirm(false);
      });
    }

    // Cancel / Close buttons
    const cancelBtns = Utils.qsa('[data-onboarding-cancel]');
    cancelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.playClick();
        this.close();
      });
    });

    // Skip Setup & Play directly
    const skipBtn = Utils.qs('#btn-skip-to-game');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        AudioEngine.playClick();
        if (!this._state.username || this._state.username.trim().length === 0) {
          this._state.username = 'ScriptAdept';
        }
        this._confirm(true);
      });
    }
  },

  /**
   * Validate Call-sign input and display helpful inline feedback.
   */
  _validateUsernameInput(val, feedbackEl, showSuccess = false) {
    if (!feedbackEl) return false;
    const trimmed = (val || '').trim();

    if (!trimmed) {
      feedbackEl.textContent = 'Call-sign is required (2–20 characters, letters, numbers, underscores).';
      feedbackEl.style.color = 'var(--text-muted)';
      return false;
    }

    const result = Profile.validateUsername(trimmed);
    if (!result.valid) {
      feedbackEl.textContent = result.error || 'Invalid call-sign.';
      feedbackEl.style.color = 'var(--color-danger)';
      return false;
    }

    if (showSuccess) {
      feedbackEl.textContent = 'Call-sign is valid and ready!';
      feedbackEl.style.color = 'var(--color-success)';
    } else {
      feedbackEl.textContent = `${trimmed.length}/20 characters`;
      feedbackEl.style.color = 'var(--text-muted)';
    }
    return true;
  },

  _validateStep1() {
    const input = Utils.qs('#onboarding-username');
    const feedbackEl = Utils.qs('#onboarding-username-feedback');
    const val = input ? input.value : this._state.username;
    const isValid = this._validateUsernameInput(val, feedbackEl, true);

    if (!isValid && input) {
      input.focus();
      if (feedbackEl) {
        feedbackEl.textContent = 'Please enter a valid call-sign (2–20 alphanumeric chars) before continuing.';
        feedbackEl.style.color = 'var(--color-danger)';
      }
    }
    return isValid;
  },

  _selectLanguage(lang) {
    this._state.language = lang;
    const cards = Utils.qsa('#wizard-lang-grid .card-selectable');
    cards.forEach(c => {
      const isSelected = c.getAttribute('data-lang') === lang;
      c.classList.toggle('is-selected', isSelected);
      c.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
  },

  _selectDifficulty(diff) {
    const profile = State.get('activeProfile');
    const xp = (profile && (typeof profile.totalScore === 'number' ? profile.totalScore : profile.xp)) || 0;
    const lang = this._state.language || 'python';
    const camp = (profile && profile.campaign && profile.campaign[lang]) || {};
    const completedTiers = (profile && profile.completedTiers) || {};

    if (diff === 'intermediate') {
      const isBegCleared = camp.beginnerStars > 0 || camp.unlockedTier === 'intermediate' || camp.unlockedTier === 'expert' || completedTiers[lang + '_beginner'];
      if (!isBegCleared && xp < 1000) {
        AudioEngine.playError();
        UI.showToast(`🔒 Intermediate is locked! Complete Beginner first or earn 1,000 pts (You have ${xp.toLocaleString()} pts).`, 'info');
        return;
      }
    } else if (diff === 'expert') {
      const isIntCleared = camp.intermediateStars > 0 || camp.unlockedTier === 'expert' || completedTiers[lang + '_intermediate'];
      if (!isIntCleared && xp < 2500) {
        AudioEngine.playError();
        UI.showToast(`🔒 Expert is locked! Complete Intermediate first or earn 2,500 pts (You have ${xp.toLocaleString()} pts).`, 'info');
        return;
      }
    }

    this._state.difficulty = diff;
    const cards = Utils.qsa('#wizard-diff-grid .card-selectable');
    cards.forEach(c => {
      const isSelected = c.getAttribute('data-diff') === diff;
      c.classList.toggle('is-selected', isSelected);
      c.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
  },

  _updateWizardDifficultyLocks() {
    const profile = State.get('activeProfile');
    const xp = (profile && (typeof profile.totalScore === 'number' ? profile.totalScore : profile.xp)) || 0;
    const lang = this._state.language || 'python';
    const camp = (profile && profile.campaign && profile.campaign[lang]) || {};
    const completedTiers = (profile && profile.completedTiers) || {};

    const diffs = ['beginner', 'intermediate', 'expert'];
    diffs.forEach(diff => {
      const card = Utils.qs(`#wizard-diff-grid .card-selectable[data-diff="${diff}"]`);
      if (!card) return;
      const indicator = card.querySelector('.selection-indicator');

      if (diff === 'beginner') {
        card.classList.remove('is-locked');
        card.removeAttribute('aria-disabled');
        if (indicator) indicator.textContent = '✓';
      } else if (diff === 'intermediate') {
        const isUnlocked = camp.beginnerStars > 0 || camp.unlockedTier === 'intermediate' || camp.unlockedTier === 'expert' || completedTiers[lang + '_beginner'] || xp >= 1000;
        card.classList.toggle('is-locked', !isUnlocked);
        if (!isUnlocked) {
          card.setAttribute('aria-disabled', 'true');
          if (indicator) indicator.textContent = '🔒';
        } else {
          card.removeAttribute('aria-disabled');
          if (indicator) indicator.textContent = '✓';
        }
      } else if (diff === 'expert') {
        const isUnlocked = camp.intermediateStars > 0 || camp.unlockedTier === 'expert' || completedTiers[lang + '_intermediate'] || xp >= 2500;
        card.classList.toggle('is-locked', !isUnlocked);
        if (!isUnlocked) {
          card.setAttribute('aria-disabled', 'true');
          if (indicator) indicator.textContent = '🔒';
        } else {
          card.removeAttribute('aria-disabled');
          if (indicator) indicator.textContent = '✓';
        }
      }
    });

    if (this._state.difficulty === 'intermediate') {
      const isBegCleared = camp.beginnerStars > 0 || camp.unlockedTier === 'intermediate' || camp.unlockedTier === 'expert' || completedTiers[lang + '_beginner'];
      if (!isBegCleared && xp < 1000) {
        this._selectDifficulty('beginner');
      }
    } else if (this._state.difficulty === 'expert') {
      const isIntCleared = camp.intermediateStars > 0 || camp.unlockedTier === 'expert' || completedTiers[lang + '_intermediate'];
      if (!isIntCleared && xp < 2500) {
        this._selectDifficulty('beginner');
      }
    }
  },

  /**
   * Navigate wizard to a specific step (1 to 4).
   * @param {number} stepNumber
   */
  goToStep(stepNumber) {
    const targetStep = Math.max(1, Math.min(4, stepNumber));
    this._state.currentStep = targetStep;

    if (targetStep === 3) {
      this._updateWizardDifficultyLocks();
    }

    // Update Step Indicator Nodes
    for (let i = 1; i <= 4; i++) {
      const node = Utils.qs(`#wizard-node-${i}`);
      if (node) {
        node.classList.remove('is-active', 'is-complete');
        if (i < targetStep) {
          node.classList.add('is-complete');
        } else if (i === targetStep) {
          node.classList.add('is-active');
        }
      }

      // Update Panes
      const pane = Utils.qs(`#wizard-pane-${i}`);
      if (pane) {
        pane.classList.toggle('is-active', i === targetStep);
      }
    }

    // Update Footer Buttons Visibility
    const btnToStep2 = Utils.qs('#btn-wizard-to-step2');
    const btnBackTo1 = Utils.qs('#btn-wizard-back-to-1');
    const btnToStep3 = Utils.qs('#btn-wizard-to-step3');
    const btnBackTo2 = Utils.qs('#btn-wizard-back-to-2');
    const btnToStep4 = Utils.qs('#btn-wizard-to-step4');
    const btnBackTo3 = Utils.qs('#btn-wizard-back-to-3');
    const btnEditChoices = Utils.qs('#btn-wizard-edit-choices');
    const btnConfirmSave = Utils.qs('#btn-wizard-confirm-save');
    const btnConfirmPlay = Utils.qs('#btn-wizard-confirm-play');

    // Hide all step buttons first
    [btnToStep2, btnBackTo1, btnToStep3, btnBackTo2, btnToStep4, btnBackTo3, btnEditChoices, btnConfirmSave, btnConfirmPlay].forEach(btn => {
      if (btn) btn.style.display = 'none';
    });

    // Show appropriate buttons for active step
    if (targetStep === 1) {
      if (btnToStep2) btnToStep2.style.display = 'inline-flex';
    } else if (targetStep === 2) {
      if (btnBackTo1) btnBackTo1.style.display = 'inline-flex';
      if (btnToStep3) btnToStep3.style.display = 'inline-flex';
    } else if (targetStep === 3) {
      if (btnBackTo2) btnBackTo2.style.display = 'inline-flex';
      if (btnToStep4) btnToStep4.style.display = 'inline-flex';
    } else if (targetStep === 4) {
      if (btnBackTo3) btnBackTo3.style.display = 'inline-flex';
      if (btnEditChoices) btnEditChoices.style.display = 'inline-flex';
      if (btnConfirmSave) btnConfirmSave.style.display = 'inline-flex';
      if (btnConfirmPlay) btnConfirmPlay.style.display = 'inline-flex';
    }

    // Step 4 Confirmation Render
    if (targetStep === 4) {
      this._renderStep4Summary();
    }

    // Focus top element of newly visible step
    requestAnimationFrame(() => {
      const activePane = Utils.qs(`#wizard-pane-${targetStep}`);
      if (activePane) {
        const focusable = activePane.querySelector('input, button:not([disabled])');
        if (focusable) focusable.focus();
      }
    });
  },

  /**
   * Render the summary preview inside Step 4.
   */
  _renderStep4Summary() {
    const avatarMeta = Profile.getAvatarMeta(this._state.avatarId);
    const summaryAvatarImg = Utils.qs('#summary-avatar-img');
    const summaryAvatarName = Utils.qs('#summary-avatar-name');
    const summaryUsername = Utils.qs('#summary-username');
    const summaryLang = Utils.qs('#summary-language');
    const summaryDiff = Utils.qs('#summary-difficulty');

    if (summaryAvatarImg) {
      summaryAvatarImg.src = `assets/images/${this._state.avatarId}.svg`;
      summaryAvatarImg.alt = avatarMeta.name;
    }
    if (summaryAvatarName) {
      summaryAvatarName.textContent = avatarMeta.name;
    }
    if (summaryUsername) {
      summaryUsername.textContent = this._state.username.trim() || 'Anonymous';
    }
    if (summaryLang) {
      const langNames = { python: 'Python 3', c: 'C (C99)', cpp: 'C++ (C++20)', java: 'Java 17' };
      summaryLang.textContent = langNames[this._state.language] || this._state.language.toUpperCase();
    }
    if (summaryDiff) {
      summaryDiff.textContent = this._state.difficulty.charAt(0).toUpperCase() + this._state.difficulty.slice(1);
    }
  },

  /**
   * Open the onboarding modal dialog.
   * @param {HTMLElement} [triggerElement=null]
   * @param {boolean} [autoNavigate=false]
   */
  open(triggerElement = null, autoNavigate = false) {
    this.init();

    // Check if new player or reset session
    const profile = State.get('activeProfile');
    const params = Router.getQueryParams();
    const isFirstTimeOrReset = !profile || !Profile.isOnboardingComplete(profile) || params.onboarding === '1' || params.reset === '1';

    if (!isFirstTimeOrReset && profile && profile.username && profile.username !== 'ScriptAdept') {
      this._state.username = profile.username;
      this._state.avatarId = profile.avatarId || 'cyber_fox';
      if (profile.preferences) {
        this._state.language = profile.preferences.language || 'python';
        this._state.difficulty = profile.preferences.difficulty || 'beginner';
      }
    } else {
      this._state.username = '';
      this._state.avatarId = 'cyber_fox';
      this._state.language = 'python';
      this._state.difficulty = 'beginner';
    }

    this._state.autoNavigateOnConfirm = Boolean(autoNavigate);

    // Sync form inputs
    const usernameInput = Utils.qs('#onboarding-username');
    if (usernameInput) {
      usernameInput.value = this._state.username;
      usernameInput.placeholder = 'Enter Call-sign (e.g. CodeNinja, ByteHero)...';
    }
    const feedbackEl = Utils.qs('#onboarding-username-feedback');
    if (feedbackEl) {
      feedbackEl.textContent = 'Call-sign is required (2–20 alphanumeric chars).';
      feedbackEl.style.color = 'var(--text-muted)';
    }

    this._selectAvatar(this._state.avatarId);
    this._selectLanguage(this._state.language);
    this._updateWizardDifficultyLocks();
    this._selectDifficulty(this._state.difficulty);

    // Start at Step 1
    this.goToStep(1);

    // Open Modal
    UI.openModal('modal-onboarding', triggerElement);
  },

  /**
   * Close without persisting unconfirmed edits.
   */
  close() {
    UI.closeModal('modal-onboarding');
  },

  /**
   * Confirm onboarding choices, save profile, update UI, and optionally launch arena.
   */
  _confirm(launchArena = false) {
    const valResult = Profile.validateUsername(this._state.username);
    if (!valResult.valid) {
      this.goToStep(1);
      const feedbackEl = Utils.qs('#onboarding-username-feedback');
      if (feedbackEl) {
        feedbackEl.textContent = valResult.error || 'Please correct your call-sign.';
        feedbackEl.style.color = 'var(--color-danger)';
      }
      return;
    }

    try {
      const activeProfile = State.get('activeProfile');
      if (activeProfile && activeProfile.id) {
        Profile.completeOnboarding(activeProfile.id, {
          username: this._state.username.trim(),
          avatarId: this._state.avatarId,
          language: this._state.language,
          difficulty: this._state.difficulty
        });
      } else {
        const newProf = Profile.create(this._state.username.trim(), this._state.avatarId, {
          language: this._state.language,
          difficulty: this._state.difficulty
        });
        newProf.onboardingComplete = true;
        const profiles = State.get('profiles') || [];
        State.set('profiles', [...profiles, newProf], false);
        State.set('activeProfile', newProf, true);
      }

      // Synchronize selection state in store
      State.set('selectedLanguage', this._state.language);
      State.set('selectedDifficulty', this._state.difficulty);

      // Update visible shell components
      UI.updateHeaderProfile();

      // Close modal
      this.close();

      // Clean query parameters from URL so future reloads don't re-trigger onboarding modal
      try {
        if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
          const cleanUrl = window.location.pathname + (window.location.hash || '');
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } catch (_) {}

      // Dispatch event for landing page synchronization
      window.dispatchEvent(new CustomEvent('onboarding:completed', {
        detail: {
          username: this._state.username.trim(),
          avatarId: this._state.avatarId,
          language: this._state.language,
          difficulty: this._state.difficulty
        }
      }));

      // Feedback toast
      UI.showToast(`Welcome to SyntaxArena, ${this._state.username.trim()}! Setup complete.`, 'success');

      // If user chose "Confirm & Start Playing" or launch was requested
      if (launchArena || this._state.autoNavigateOnConfirm) {
        setTimeout(() => {
          Router.navigateTo('game', {
            lang: this._state.language,
            diff: this._state.difficulty
          });
        }, 350);
      }
    } catch (err) {
      console.error('[Onboarding._confirm] Error saving profile:', err);
      UI.showToast('Could not save profile. Check storage permissions.', 'error');
    }
  }
};
