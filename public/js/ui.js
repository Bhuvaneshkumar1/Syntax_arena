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
import { Gamification } from './gamification.js';

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

    // Dynamic Level & Remaining Points/XP near logo (Item 7)
    const levelPill = Utils.qs('#header-user-level-badge');
    if (levelPill) {
      if (profile) {
        const lvlData = Gamification.getLevelData(profile.lifetimeXP || profile.xp || 0);
        const remText = lvlData.isMaxLevel ? 'MAX RANK' : `${lvlData.xpNeededForNext.toLocaleString()} XP to Lv.${lvlData.level + 1}`;
        levelPill.innerHTML = `<span class="header-level-tag">Lv.${lvlData.level}</span> <span class="header-xp-rem">${remText}</span>`;
        levelPill.setAttribute('title', `Rank: ${lvlData.title} • Current XP: ${lvlData.currentXP.toLocaleString()}`);
        levelPill.style.display = 'inline-flex';
      } else {
        levelPill.style.display = 'none';
      }
    }

    // Sidebar Profile & Cloud Sync Status (Item 14 & 16)
    const sideAvatar = Utils.qs('#sidebar-profile-avatar');
    const sideName = Utils.qs('#sidebar-profile-name');
    const sideRank = Utils.qs('#sidebar-profile-rank');
    if (profile && sideAvatar) {
      sideAvatar.src = `assets/images/${profile.avatarId || 'cyber_fox'}.svg`;
    }
    if (profile && sideName) {
      sideName.textContent = profile.username;
    }
    if (profile && sideRank) {
      const lvlData = Gamification.getLevelData(profile.lifetimeXP || profile.xp || 0);
      sideRank.textContent = `Lv.${lvlData.level} • ${lvlData.title}`;
    }

    const syncPills = Utils.qsa('.cloud-sync-pill');
    if (typeof Auth !== 'undefined') {
      const details = Auth.getSyncDetails();
      syncPills.forEach(pill => {
        pill.innerHTML = `<span class="cloud-sync-dot ${details.dotClass}"></span> <span>${details.label}</span>`;
      });
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

    if (modal.style.display === 'none') {
      modal.style.display = '';
    }
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
  },

  /**
   * Initialize 7-Day Protocol Daily Habit Calendar & Bounty Claims (Item 17).
   */
  initDailyProtocol() {
    const container = Utils.qs('#daily-protocol-container');
    if (!container) return;

    const grid = Utils.qs('#daily-days-grid');
    const claimBtn = Utils.qs('#btn-claim-daily-bounty');
    const streakBadge = Utils.qs('#daily-streak-badge');
    if (!grid || !claimBtn) return;

    const profile = (typeof Profile !== 'undefined' ? Profile.getActiveProfile() : null) || State.get('activeProfile');
    if (!profile) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const lastClaim = profile.lastDailyClaimDate || null;
    const isClaimedToday = (lastClaim === todayStr);
    const currentStreak = profile.dayStreak || 1;
    const currentDay = ((currentStreak - 1) % 7) + 1;

    const REWARDS = [
      { day: 1, xp: 50,  diamonds: 0, label: '+50 XP' },
      { day: 2, xp: 75,  diamonds: 0, label: '+75 XP' },
      { day: 3, xp: 100, diamonds: 1, label: '+100 XP + 1 💎' },
      { day: 4, xp: 125, diamonds: 0, label: '+125 XP' },
      { day: 5, xp: 150, diamonds: 2, label: '+150 XP + 2 💎' },
      { day: 6, xp: 200, diamonds: 0, label: '+200 XP' },
      { day: 7, xp: 350, diamonds: 5, label: '+350 XP + 5 💎 + 🏆' }
    ];

    if (streakBadge) {
      streakBadge.textContent = `${currentStreak}-Day Streak 🔥`;
    }

    // Render 7-day calendar cards
    grid.innerHTML = REWARDS.map(r => {
      let statusClass = '';
      let statusBadge = '';
      let borderStyle = '1px solid rgba(255,255,255,0.08)';
      let bgStyle = 'rgba(15, 23, 42, 0.7)';

      if (r.day < currentDay || (r.day === currentDay && isClaimedToday)) {
        statusClass = 'is-claimed';
        statusBadge = '<span style="color: #10b981; font-size: 10px; font-weight: 700;">✓ CLAIMED</span>';
        borderStyle = '1px solid rgba(16, 185, 129, 0.4)';
        bgStyle = 'rgba(16, 185, 129, 0.08)';
      } else if (r.day === currentDay && !isClaimedToday) {
        statusClass = 'is-active-today';
        statusBadge = '<span class="badge badge-emerald" style="font-size: 9px; padding: 1px 4px;">TODAY</span>';
        borderStyle = '2px solid #10b981';
        bgStyle = 'rgba(16, 185, 129, 0.18)';
      } else {
        statusClass = 'is-locked';
        statusBadge = '<span style="color: #64748b; font-size: 10px;">🔒 Day ' + r.day + '</span>';
      }

      return `
        <div class="daily-day-card ${statusClass}" style="background: ${bgStyle}; border: ${borderStyle}; border-radius: 8px; padding: 8px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; min-height: 84px;">
          <div style="font-size: 11px; font-weight: 800; color: #94a3b8; font-family: var(--font-display);">DAY ${r.day}</div>
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin: 4px 0;">${r.label}</div>
          <div>${statusBadge}</div>
        </div>
      `;
    }).join('');

    // Update claim button
    if (isClaimedToday) {
      claimBtn.disabled = true;
      claimBtn.className = 'btn-arcade btn-neutral btn-sm';
      claimBtn.innerHTML = '<span>✓ Protocol Claimed Today</span>';
    } else {
      const reward = REWARDS[currentDay - 1];
      claimBtn.disabled = false;
      claimBtn.className = 'btn-arcade btn-primary btn-sm';
      claimBtn.innerHTML = `<span>🎁 Claim Day ${currentDay} (${reward.label})</span>`;

      claimBtn.onclick = () => {
        profile.lastDailyClaimDate = todayStr;
        profile.xp = (profile.xp || 0) + reward.xp;
        profile.lifetimeXP = (profile.lifetimeXP || 0) + reward.xp;
        if (reward.diamonds > 0) {
          profile.diamonds = (profile.diamonds || 0) + reward.diamonds;
        }
        if (currentDay === 7) {
          profile.unlockedAchievements = profile.unlockedAchievements || [];
          if (!profile.unlockedAchievements.includes('ach_habit_titan')) {
            profile.unlockedAchievements.push('ach_habit_titan');
          }
        }
        if (typeof Profile !== 'undefined') {
          Profile.updateProfile(profile.id, profile);
        } else {
          State.set('activeProfile', profile, true);
        }

        UI.showToast(`🎉 Claimed Day ${currentDay} Protocol Reward: ${reward.label}!`, 'success');
        UI.triggerConfetti();
        if (typeof AudioEngine !== 'undefined') AudioEngine.playSuccess();
        this.updateHeaderProfile();
        this.initDailyProtocol();
      };
    }

    this.initProgressionGuide();
  },

  /**
   * Initialize Progression & XP Guide Modal (Item 12).
   */
  initProgressionGuide() {
    const btn = document.getElementById('btn-open-progression-guide');
    const modal = document.getElementById('modal-progression-guide');
    const closeBtn = document.getElementById('btn-close-progression-guide');
    const dismissBtn = document.getElementById('btn-dismiss-progression-guide');

    if (!modal) return;

    const open = (e) => {
      if (e) e.preventDefault();
      modal.style.display = 'flex';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    };

    const close = (e) => {
      if (e) e.preventDefault();
      modal.classList.remove('is-open');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    };

    if (btn) btn.onclick = open;
    const guideBtns = document.querySelectorAll('.btn-open-xp-guide');
    guideBtns.forEach(b => b.onclick = open);

    if (closeBtn) closeBtn.onclick = close;
    if (dismissBtn) dismissBtn.onclick = close;
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };
  },

  /**
   * Initialize Collapsible Sidebar Activity Rail (Item 16).
   */
  initSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const toggleBtn = document.getElementById('btn-sidebar-toggle');
    const mobileToggle = document.getElementById('btn-sidebar-mobile-toggle');

    if (!sidebar) return;

    // Restore saved collapse preference (defaults to collapsed 68px on desktop for clean IDE look)
    const savedState = localStorage.getItem('syntaxarena_sidebar_collapsed');
    if (savedState === 'false') {
      sidebar.classList.remove('is-collapsed');
    } else {
      sidebar.classList.add('is-collapsed');
    }

    const toggle = (e) => {
      if (e) e.preventDefault();
      const isCollapsed = sidebar.classList.toggle('is-collapsed');
      localStorage.setItem('syntaxarena_sidebar_collapsed', String(isCollapsed));
      if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    };

    if (toggleBtn) {
      toggleBtn.onclick = toggle;
    }

    if (mobileToggle) {
      mobileToggle.onclick = (e) => {
        if (e) e.preventDefault();
        sidebar.classList.toggle('is-mobile-open');
        if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
      };
    }

    // Keyboard shortcut: Ctrl + B or Cmd + B to toggle sidebar
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          toggle();
        }
      }
    });

    // Close mobile sidebar on route click or outside click
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('is-mobile-open');
      });
    });
  },

  /**
   * Initialize Multi-Provider Authentication Modal & Cloud Sync (Item 14).
   */
  initAuthModal() {
    const modal = document.getElementById('modal-auth');
    if (!modal) return;

    let activeTab = 'signin';

    const open = (e) => {
      if (e) e.preventDefault();
      modal.style.display = 'flex';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    };

    const close = (e) => {
      if (e) e.preventDefault();
      modal.classList.remove('is-open');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    };

    // Open triggers
    document.querySelectorAll('.cloud-sync-pill, #btn-open-auth, #sidebar-auth-card, #btn-link-account').forEach(el => {
      el.addEventListener('click', open);
    });

    // Close triggers
    const closeBtn = document.getElementById('btn-close-auth');
    if (closeBtn) closeBtn.onclick = close;
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };

    // Tabs
    const tabSignIn = document.getElementById('tab-auth-signin');
    const tabSignUp = document.getElementById('tab-auth-signup');
    const nameField = document.getElementById('auth-field-name');
    const submitBtn = document.getElementById('btn-auth-submit');
    const alertBox = document.getElementById('auth-alert');

    const showAlert = (msg, isSuccess = false) => {
      if (!alertBox) return;
      alertBox.textContent = msg;
      alertBox.className = isSuccess ? 'auth-alert-banner is-success' : 'auth-alert-banner is-error';
    };
    const hideAlert = () => {
      if (!alertBox) return;
      alertBox.className = 'auth-alert-banner';
    };

    const setTab = (tab) => {
      activeTab = tab;
      hideAlert();
      if (tab === 'signin') {
        if (tabSignIn) tabSignIn.classList.add('is-active');
        if (tabSignUp) tabSignUp.classList.remove('is-active');
        if (nameField) nameField.style.display = 'none';
        if (submitBtn) submitBtn.textContent = 'Sign In to SyntaxArena';
      } else {
        if (tabSignIn) tabSignIn.classList.remove('is-active');
        if (tabSignUp) tabSignUp.classList.add('is-active');
        if (nameField) nameField.style.display = 'block';
        if (submitBtn) submitBtn.textContent = 'Create Free Account';
      }
      if (typeof AudioEngine !== 'undefined') AudioEngine.playClick();
    };

    if (tabSignIn) tabSignIn.onclick = () => setTab('signin');
    if (tabSignUp) tabSignUp.onclick = () => setTab('signup');

    // OAuth Social Providers (Real Serverless OAuth on Vercel deployment with local/test fallback)
    const handleOAuth = async (provider) => {
      hideAlert();

      // Real serverless OAuth runs on production Vercel deployment or when explicitly enabled
      const isRealOAuthHost = typeof window !== 'undefined' && (
        window.location.hostname.includes('vercel.app') ||
        window.location.hostname.includes('syntaxarena') ||
        window.SYNTAXARENA_REAL_OAUTH === true
      );
      const authEndpoint = `/api/auth/${provider}?action=login`;

      if (isRealOAuthHost && (provider === 'google' || provider === 'github')) {
        showAlert(`Connecting to ${provider === 'github' ? 'GitHub' : 'Google'} OAuth... Please authorize in the window.`);
        const width = 600;
        const height = 700;
        const left = (window.innerWidth - width) / 2 + window.screenX;
        const top = (window.innerHeight - height) / 2 + window.screenY;
        const popup = window.open(
          authEndpoint,
          `oauth_${provider}`,
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
        );

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          window.location.href = authEndpoint;
          return;
        }

        const messageHandler = async (e) => {
          if (e.data && e.data.type === 'SYNTAXARENA_AUTH_SUCCESS' && e.data.payload) {
            window.removeEventListener('message', messageHandler);
            try {
              const u = await Auth.signInWithProvider(provider, e.data.payload);
              showAlert(`✓ Authenticated as ${u.displayName} (${u.email})!`, true);
              UI.showToast(`🎉 Welcome, ${u.displayName}!`, 'success');
              if (typeof AudioEngine !== 'undefined') AudioEngine.playSuccess();
              this.updateHeaderProfile();
              setTimeout(() => close(), 900);
            } catch (err) {
              showAlert(err.message || 'OAuth authentication failed.');
            }
          }
        };
        window.addEventListener('message', messageHandler);
        return;
      }

      // Offline file:/// or Local Playwright Test Environment Fallback
      try {
        if (typeof Auth !== 'undefined') {
          const u = await Auth.signInWithProvider(provider);
          showAlert(`✓ Successfully connected via ${provider.toUpperCase()} as ${u.displayName}!`, true);
          UI.showToast(`🎉 Connected via ${provider.toUpperCase()}!`, 'success');
          if (typeof AudioEngine !== 'undefined') AudioEngine.playSuccess();
          this.updateHeaderProfile();
          setTimeout(() => close(), 900);
        }
      } catch (err) {
        showAlert(err.message || 'OAuth authentication failed.');
      }
    };

    const btnGoogle = document.getElementById('btn-oauth-google');
    const btnGitHub = document.getElementById('btn-oauth-github');
    const btnApple = document.getElementById('btn-oauth-apple');

    if (btnGoogle) btnGoogle.onclick = () => handleOAuth('google');
    if (btnGitHub) btnGitHub.onclick = () => handleOAuth('github');
    if (btnApple) btnApple.onclick = () => handleOAuth('apple');

    // Email/Password Form Submit
    const authForm = document.getElementById('auth-form');
    if (authForm) {
      authForm.onsubmit = async (e) => {
        e.preventDefault();
        hideAlert();
        const email = document.getElementById('auth-email')?.value || '';
        const password = document.getElementById('auth-password')?.value || '';
        const displayName = document.getElementById('auth-name')?.value || '';

        try {
          if (typeof Auth !== 'undefined') {
            if (activeTab === 'signup') {
              const u = await Auth.signUpWithEmail(email, password, displayName);
              showAlert(`✓ Account created! Welcome, ${u.displayName}.`, true);
              UI.showToast(`Welcome to SyntaxArena, ${u.displayName}!`, 'celebrate');
              UI.triggerConfetti();
            } else {
              const u = await Auth.signInWithEmail(email, password);
              showAlert(`✓ Welcome back, ${u.displayName}!`, true);
              UI.showToast(`Welcome back, ${u.displayName}!`, 'success');
            }
            if (typeof AudioEngine !== 'undefined') AudioEngine.playSuccess();
            this.updateHeaderProfile();
            setTimeout(() => close(), 900);
          }
        } catch (err) {
          showAlert(err.message || 'Authentication error.');
          if (typeof AudioEngine !== 'undefined') AudioEngine.playError();
        }
      };
    }

    // Password Visibility Toggle
    const eyeBtn = document.getElementById('btn-auth-toggle-pwd');
    const pwdInput = document.getElementById('auth-password');
    if (eyeBtn && pwdInput) {
      eyeBtn.onclick = () => {
        const isText = pwdInput.type === 'text';
        pwdInput.type = isText ? 'password' : 'text';
        eyeBtn.textContent = isText ? '👁️' : '🙈';
      };
    }

    // Sign Out Button
    const signOutBtn = document.getElementById('btn-auth-signout');
    if (signOutBtn) {
      signOutBtn.onclick = () => {
        if (typeof Auth !== 'undefined') {
          Auth.signOut();
          UI.showToast('Signed out. Switched to Guest Mode.', 'info');
          this.updateHeaderProfile();
          close();
        }
      };
    }

    // Subscribe to Auth changes
    if (typeof Auth !== 'undefined') {
      Auth.on('auth:changed', () => {
        this.updateHeaderProfile();
      });
    }
  }
};
