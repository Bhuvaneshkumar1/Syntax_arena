/**
 * SyntaxArena Application Bootstrapper & Coordinator
 * Entry point for all pages.
 * Source of truth: docs/ARCHITECTURE.md & docs/BATCH_8_PLAN.md
 */

import { Utils } from './utils.js';
import { State } from './state.js';
import { UI } from './ui.js';
import { Router } from './router.js';
import { Profile } from './profile.js';
import { AudioEngine } from './audio.js';

export const App = {
  /**
   * Main bootstrap sequence.
   */
  async init() {
    try {
      console.info('[SyntaxArena] Bootstrapping application foundation...');

      // 1. Detect current page
      const currentPage = Router.getCurrentPage();

      // 2. Initialize reactive state from storage
      State.init(currentPage);

      // 3. Apply user settings (Theme, Motion, Audio)
      const settings = State.get('settings') || {};
      UI.applyTheme(settings.theme || 'dark');
      UI.applyReducedMotion(settings.reducedMotion);

      // 4. Update UI Shell (Header navigation & profile pill)
      UI.updateActiveNav(currentPage);
      UI.updateHeaderProfile();

      // 5. Bind global UI controls & sound
      this._bindGlobalEvents();

      // 6. Install navigation and unload guards
      Router.installGuards();

      // 7. Subscribe to state changes for reactive header updates
      State.subscribe('activeProfile', () => {
        UI.updateHeaderProfile();
      });

      State.subscribe('settings', (newSettings) => {
        if (newSettings) {
          if (newSettings.theme) {
            UI.applyTheme(newSettings.theme);
          }
          if (typeof newSettings.reducedMotion === 'boolean') {
            UI.applyReducedMotion(newSettings.reducedMotion);
          }
          if (typeof newSettings.musicEnabled === 'boolean' || typeof newSettings.musicVolume === 'number') {
            if (newSettings.musicEnabled && (newSettings.musicVolume || 0) > 0) {
              AudioEngine.startMusic();
            } else {
              AudioEngine.stopMusic();
            }
          }
        }
      });

      // 8. Process Daily Login Streak & Welcome Bonus
      try {
        const dailyReward = Profile.checkDailyRewards();
        if (dailyReward && dailyReward.message) {
          setTimeout(() => {
            UI.showToast(dailyReward.message, 'success');
            if (dailyReward.streakBonus || dailyReward.joiningBonus) {
              UI.triggerConfetti();
            }
          }, 800);
        }
      } catch (_) {}

      // 9. Page-specific controllers
      if (currentPage === 'index') {
        const controller = (typeof window !== 'undefined' && window.LandingPage)
          ? window.LandingPage
          : (await import('./landing.js')).LandingPage;
        if (controller && typeof controller.init === 'function') {
          controller.init();
        }
      } else if (currentPage === 'game') {
        const controller = (typeof window !== 'undefined' && window.Gameplay)
          ? window.Gameplay
          : (await import('./gameplay.js')).Gameplay;
        if (controller && typeof controller.init === 'function') {
          await controller.init();
        }
      }

      // 10. Mask URL with UUID replacing .html filename in address bar
      Router.maskUrlWithUUID(currentPage);

      console.info(`[SyntaxArena] Initialization complete on page: ${currentPage}`);
      return true;
    } catch (err) {
      console.error('[SyntaxArena] Critical initialization failure:', err);
      this._handleInitFailure(err);
      return false;
    }
  },

  /**
   * Bind application-wide header and shell interactive controls.
   */
  _bindGlobalEvents() {
    // Unlock Web Audio on first document interaction
    const unlockAudio = () => {
      AudioEngine.unlock();
      const s = State.get('settings') || {};
      if (s.musicEnabled && (s.musicVolume || 0) > 0) {
        AudioEngine.startMusic();
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    // Audio lifecycle: Pause music on tab background / hidden, resume when visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        AudioEngine.stopMusic();
      } else {
        const s = State.get('settings') || {};
        if (s.musicEnabled && (s.musicVolume || 0) > 0) {
          AudioEngine.startMusic();
        }
      }
    });

    // Cleanup audio resources on page unload
    window.addEventListener('pagehide', () => {
      AudioEngine.stopMusic();
    });

    // Play click sound on all arcade buttons and interactive chips
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-arcade, .btn-icon-toggle, .line-pill-btn, .token-chip');
      if (btn && !btn.disabled) {
        AudioEngine.playClick();
      }
    });

    // Results Tab Guard when game is actively in-progress (Item 13)
    const activeSession = State.get('activeSession');
    const isPlaying = Boolean(activeSession && activeSession.inProgress && !activeSession.isCompleted);
    if (isPlaying) {
      const resultsLinks = document.querySelectorAll('a[href*="results.html"]');
      resultsLinks.forEach(link => {
        link.classList.add('is-disabled');
        link.setAttribute('aria-disabled', 'true');
        link.style.opacity = '0.5';
        link.style.cursor = 'not-allowed';
        link.title = 'Results tab is locked while playing';
        link.addEventListener('click', (e) => {
          e.preventDefault();
          AudioEngine.playError();
          UI.showToast('🔒 Results tab is disabled while playing! Finish your challenge first.', 'warning');
        });
      });
    }

    // Theme Toggle Button
    const themeBtn = Utils.qs('#btn-theme-toggle');
    if (themeBtn) {
      Utils.on(themeBtn, 'click', (e) => {
        e.preventDefault();
        UI.toggleTheme();
      });
    }

    // Sound Toggle Button (Master SFX & Ambient Music 1-Click Toggle)
    const soundBtn = Utils.qs('#btn-sound-toggle');
    if (soundBtn) {
      const initialSettings = State.get('settings') || {};
      const initialMuted = initialSettings.soundEnabled === false || (initialSettings.sfxVolume || 0) === 0;
      const initialIcon = soundBtn.querySelector('use');
      if (initialIcon) {
        initialIcon.setAttribute('href', initialMuted ? '#icon-volume-x' : '#icon-volume');
      }

      Utils.on(soundBtn, 'click', (e) => {
        e.preventDefault();
        const settings = State.get('settings') || {};
        const isMuted = settings.soundEnabled === false || (settings.sfxVolume || 0) === 0;
        const nextVolume = isMuted ? 0.8 : 0.0;
        const nextMusicVol = isMuted ? 0.5 : 0.0;
        const nextEnabled = isMuted;

        State.set('settings', {
          soundEnabled: nextEnabled,
          musicEnabled: nextEnabled,
          sfxVolume: nextVolume,
          musicVolume: nextMusicVol
        });

        soundBtn.setAttribute('aria-label', nextEnabled ? 'Mute audio & music' : 'Unmute audio & music');
        soundBtn.setAttribute('title', nextEnabled ? 'Mute audio & music' : 'Unmute audio & music');
        const icon = soundBtn.querySelector('use');
        if (icon) {
          icon.setAttribute('href', nextEnabled ? '#icon-volume' : '#icon-volume-x');
        }
        if (nextEnabled) {
          AudioEngine.startMusic();
          AudioEngine.playSuccess();
        } else {
          AudioEngine.stopMusic();
        }
        UI.showToast(nextEnabled ? 'Audio & Ambient Music Enabled' : 'All Audio Muted', 'info');
      });
    }

    // Modal Close Buttons
    const modalCloseButtons = Utils.qsa('[data-close-modal]');
    modalCloseButtons.forEach(btn => {
      Utils.on(btn, 'click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        if (modalId) UI.closeModal(modalId);
      });
    });

    // Close modal on backdrop click
    const modalBackdrops = Utils.qsa('.modal-backdrop');
    modalBackdrops.forEach(backdrop => {
      Utils.on(backdrop, 'click', (e) => {
        if (e.target === backdrop) {
          UI.closeModal(backdrop.id);
        }
      });
    });
  },

  /**
   * Render graceful error fallback in the rare event of catastrophic init failure.
   */
  _handleInitFailure(err) {
    const mainEl = Utils.qs('main') || document.body;
    const errorBanner = document.createElement('div');
    errorBanner.className = 'card card-raised animate-fade-in';
    errorBanner.style.margin = '2rem auto';
    errorBanner.style.maxWidth = '600px';
    errorBanner.style.borderColor = 'var(--color-danger)';
    errorBanner.innerHTML = `
      <h2 style="color: var(--color-danger); margin-bottom: 0.5rem;">Initialization Warning</h2>
      <p>SyntaxArena encountered an issue while loading local profile data. Stored settings may be reset or running in private session mode.</p>
      <div style="margin-top: 1rem;">
        <button class="btn-arcade btn-primary btn-sm" onclick="window.location.reload()">Reload Application</button>
      </div>
    `;
    mainEl.prepend(errorBanner);
  }
};

// Auto-run bootstrap on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

if (typeof window !== 'undefined') {
  window.App = App;
}
