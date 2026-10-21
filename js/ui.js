/**
 * SyntaxArena UI Presentation Helpers
 * Reusable DOM helpers, shell bindings, accessible modals, toast notifications,
 * reduced-motion synchronizer, and counter interpolation.
 * Source of truth: docs/DESIGN_SYSTEM.md & docs/ARCHITECTURE.md & docs/BATCH_8_PLAN.md
 */

import { Utils } from './utils.js';
import { State } from './state.js';
import { Profile } from './profile.js';
import { AudioEngine } from './audio.js';

export const UI = {
  /**
   * Apply theme attribute to document root.
   * @param {'dark'|'light'|'amber'|'gold'} theme
   */
  applyTheme(theme) {
    const validThemes = ['dark', 'light', 'amber', 'gold'];
    const safeTheme = validThemes.includes(theme) ? theme : 'dark';
    document.documentElement.setAttribute('data-theme', safeTheme);
    const themeBtn = Utils.qs('#btn-theme-toggle');
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', `Theme: ${safeTheme}`);
      themeBtn.setAttribute('title', `Theme: ${safeTheme}`);
      const icon = themeBtn.querySelector('use');
      if (icon) {
        icon.setAttribute('href', safeTheme === 'light' ? '#icon-moon' : '#icon-sun');
      }
    }
  },

  /**
   * Toggle between dark and light themes.
   */
  toggleTheme() {
    const currentSettings = State.get('settings') || {};
    const nextTheme = currentSettings.theme === 'light' ? 'dark' : 'light';

    // Gate light theme (and other premium themes) if not yet unlocked
    if (nextTheme !== 'dark') {
      const activeProf = State.get('activeProfile') || (typeof Profile !== 'undefined' ? Profile.getActiveProfile() : null);
      const userLevel = (activeProf && activeProf.level) || 1;
      const unlockedThemes = (activeProf && Array.isArray(activeProf.unlockedThemes)) ? activeProf.unlockedThemes : ['dark'];

      const themeDef = (typeof UNLOCKABLE_THEMES !== 'undefined' && Array.isArray(UNLOCKABLE_THEMES))
        ? UNLOCKABLE_THEMES.find(t => t.id === nextTheme)
        : null;
      const requiredLevel = themeDef ? themeDef.requiredLevel : (nextTheme === 'light' ? 2 : 1);
      const isUnlocked = unlockedThemes.includes(nextTheme) || userLevel >= requiredLevel;

      if (!isUnlocked) {
        if (typeof AudioEngine !== 'undefined' && AudioEngine.playError) {
          AudioEngine.playError();
        }
        this.showToast(`🔒 Currently the theme is locked! Unlock by using points or reach Level ${requiredLevel}.`, 'warning');
        return;
      }
    }

    State.set('settings', { theme: nextTheme });
    this.applyTheme(nextTheme);
    this.showToast(`Switched to ${nextTheme === 'light' ? 'Light (Studio Paper)' : 'Dark'} mode`, 'info');
  },

  /**
   * Synchronize reduced motion across DOM and user settings.
   * @param {boolean} [isExplicit]
   */
  applyReducedMotion(isExplicit) {
    if (typeof document === 'undefined') return;
    let shouldReduce = false;
    if (typeof isExplicit === 'boolean') {
      shouldReduce = isExplicit;
    } else {
      const settings = State.get('settings') || {};
      shouldReduce = Boolean(settings.reducedMotion);
    }

    if (shouldReduce) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
    }

    // Keep checkbox in sync if rendered
    const motionCheckbox = Utils.qs('#setting-reduced-motion');
    if (motionCheckbox && motionCheckbox.checked !== shouldReduce) {
      motionCheckbox.checked = shouldReduce;
    }
  },

  /**
   * Check whether motion should currently be reduced.
   * @returns {boolean}
   */
  isMotionReduced() {
    if (typeof document !== 'undefined' && document.documentElement) {
      if (document.documentElement.getAttribute('data-reduced-motion') === 'true') {
        return true;
      }
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  },

  /**
   * Animate a numeric DOM counter from start to end.
   * Immediately snaps to final value if reduced-motion is enabled.
   * @param {HTMLElement} element
   * @param {number} start
   * @param {number} end
   * @param {number} [duration=400]
   * @param {function} [formatter]
   */
  animateValue(element, start, end, duration = 400, formatter = (val) => String(Math.round(val))) {
    if (!element) return;

    if (this.isMotionReduced() || duration <= 0 || start === end) {
      element.textContent = formatter(end);
      return;
    }

    const startTime = performance.now();
    const diff = end - start;
    let lastSoundStep = -1;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      // Smooth ease-out cubic curve
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = start + (diff * easedProgress);

      element.textContent = formatter(currentVal);

      // Subtle audio tick every ~10% step if moving up
      const currentStep = Math.floor(progress * 8);
      if (currentStep !== lastSoundStep && progress < 1.0) {
        lastSoundStep = currentStep;
        AudioEngine.playCount();
      }

      if (progress < 1.0) {
        requestAnimationFrame(step);
      } else {
        element.textContent = formatter(end);
      }
    };

    requestAnimationFrame(step);
  },

  /**
   * Update header profile pill to match current active profile.
   */
  updateHeaderProfile() {
    const profile = State.get('activeProfile');
    const nameEl = Utils.qs('.profile-pill .profile-name');
    const avatarEl = Utils.qs('.profile-pill .profile-avatar-mini');

    if (profile && nameEl) {
      nameEl.textContent = profile.username;
    }
    if (profile && avatarEl) {
      const avatarMeta = Profile.getAvatarMeta(profile.avatarId);
      avatarEl.innerHTML = `<img src="assets/images/${profile.avatarId || 'cyber_fox'}.svg" width="22" height="22" alt="avatar" style="border-radius: 50%;">`;
      avatarEl.setAttribute('title', `${avatarMeta.name} (Level ${profile.level})`);
    }
  },

  /**
   * Highlight the active navigation link based on current page.
   * @param {string} pageId ('index', 'game', 'results', 'progress', 'settings')
   */
  updateActiveNav(pageId) {
    const navLinks = Utils.qsa('.app-nav .nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const isTarget = (pageId === 'index' && (href === 'index.html' || href === './')) ||
                       href.includes(`${pageId}.html`);

      if (isTarget) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  },

  /**
   * Display a non-blocking toast notification.
   * @param {string} message
   * @param {'success'|'error'|'info'|'celebrate'} [type='info']
   * @param {number} [durationMs=3500]
   * @param {string} [title='']
   */
  showToast(message, type = 'info', durationMs = 3500, title = '') {
    let container = Utils.qs('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type === 'celebrate' ? 'success animate-celebrate' : type}`;

    const iconSpan = document.createElement('span');
    iconSpan.style.fontSize = '1.25rem';
    iconSpan.style.flexShrink = '0';
    iconSpan.textContent = type === 'celebrate' ? '🎉' : type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

    const contentDiv = document.createElement('div');
    contentDiv.style.flex = '1';

    if (title) {
      const titleSpan = document.createElement('div');
      titleSpan.style.fontFamily = 'var(--font-display)';
      titleSpan.style.fontWeight = '700';
      titleSpan.style.fontSize = 'var(--text-xs)';
      titleSpan.style.letterSpacing = '0.04em';
      titleSpan.style.textTransform = 'uppercase';
      titleSpan.style.color = type === 'celebrate' ? 'var(--color-primary)' : 'var(--text-primary)';
      titleSpan.textContent = title;
      contentDiv.appendChild(titleSpan);
    }

    const textSpan = document.createElement('div');
    textSpan.style.fontSize = 'var(--text-xs)';
    textSpan.textContent = message;
    contentDiv.appendChild(textSpan);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Dismiss notification');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'var(--text-muted)';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '1rem';
    closeBtn.style.padding = '0 var(--space-1)';
    closeBtn.textContent = '✕';
    closeBtn.onclick = () => {
      toast.classList.remove('is-visible');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    };

    toast.appendChild(iconSpan);
    toast.appendChild(contentDiv);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    // Auto cleanup
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, durationMs);
  },

  /**
   * Open an accessible modal dialog.
   * @param {string} modalId
   */
  openModal(modalId, triggerElement = null) {
    const modal = Utils.qs(`#${modalId}`);
    if (!modal) return;

    modal._triggerElement = triggerElement || document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';

    // Focus first interactive element
    requestAnimationFrame(() => {
      const focusable = Array.from(modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(el => el.offsetParent !== null);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    });

    // Keyboard trap and Escape key listener
    modal._modalKeyHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeModal(modalId);
        return;
      }
      if (e.key === 'Tab') {
        const focusable = Array.from(modal.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', modal._modalKeyHandler);
  },

  /**
   * Close an accessible modal dialog.
   * @param {string} modalId
   */
  closeModal(modalId) {
    const modal = Utils.qs(`#${modalId}`);
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (modal._modalKeyHandler) {
      window.removeEventListener('keydown', modal._modalKeyHandler);
      modal._modalKeyHandler = null;
    }

    // Restore focus to triggering control
    if (modal._triggerElement && typeof modal._triggerElement.focus === 'function') {
      try {
        modal._triggerElement.focus();
      } catch (_) {}
      modal._triggerElement = null;
    }
  },

  /**
   * Trigger celebratory confetti shower on milestones & flawless clears.
   */
  triggerConfetti() {
    if (typeof document === 'undefined') return;
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#00E5FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#FBBF24'];
    const particles = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.3) - 20,
        w: Math.random() * 8 + 6,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2.5,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    const startTime = Date.now();
    const duration = 2800;

    function render() {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const progress = elapsed / duration;
      const alpha = Math.max(0, 1 - progress);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gentle gravity
        p.rotation += p.vRot;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }
};
