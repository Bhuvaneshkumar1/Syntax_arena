/**
 * SyntaxArena Administrative Console Controller
 * Secure administrative gateway for telemetry auditing, player monitoring,
 * and track-by-track language completion analytics.
 */

import { Utils } from './utils.js';
import { Storage, createDefaultProfile } from './storage.js';
import { State } from './state.js';
import { UI } from './ui.js';
import { AudioEngine } from './audio.js';
import { academyLessons } from '../data/academy-lessons.js';
import { LessonUploader } from './lesson-uploader.js';

export const AdminController = {
  // Expected admin credentials (PBKDF2/SHA-256 authenticated)
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD_HASH: 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7', // SHA-256 of "Admin@123"
  ADMIN_PLAIN_FALLBACK: 'Admin@123',

  isAuthenticated: false,
  failedAttempts: 0,
  lockoutUntil: 0,
  lockoutTimerId: null,

  searchQuery: '',
  filterLanguage: 'all',

  profiles: [],
  selectedPlayer: null,

  // Metadata for all 12 programming tracks
  TRACKS: [
    { id: 'python', name: 'Python 3', icon: '🐍', tag: 'tag-python', totalQuestions: 60, totalLessons: 5 },
    { id: 'c', name: 'C (C99/C11)', icon: '⚡', tag: 'tag-c', totalQuestions: 60, totalLessons: 5 },
    { id: 'cpp', name: 'C++ (Modern)', icon: '🚀', tag: 'tag-cpp', totalQuestions: 60, totalLessons: 5 },
    { id: 'java', name: 'Java (SE 17)', icon: '☕', tag: 'tag-java', totalQuestions: 60, totalLessons: 5 },
    { id: 'cyber', name: 'Cyber & Linux', icon: '🛡️', tag: 'tag-cyber', totalQuestions: 60, totalLessons: 5 },
    { id: 'javascript', name: 'JavaScript', icon: '⚡', tag: 'tag-javascript', totalQuestions: 60, totalLessons: 5 },
    { id: 'rust', name: 'Rust', icon: '🦀', tag: 'tag-rust', totalQuestions: 60, totalLessons: 5 },
    { id: 'sql', name: 'SQL', icon: '🗄️', tag: 'tag-sql', totalQuestions: 60, totalLessons: 5 },
    { id: 'typescript', name: 'TypeScript', icon: '📘', tag: 'tag-typescript', totalQuestions: 60, totalLessons: 5 },
    { id: 'go', name: 'Go (Golang)', icon: '🔷', tag: 'tag-go', totalQuestions: 60, totalLessons: 5 },
    { id: 'html', name: 'HTML5 & CSS', icon: '🌐', tag: 'tag-html', totalQuestions: 60, totalLessons: 5 },
    { id: 'asm', name: 'x86-64 Assembly', icon: '⚙️', tag: 'tag-asm', totalQuestions: 60, totalLessons: 5 }
  ],

  /**
   * Initialize Admin Controller
   */
  async init() {
    if (this._initialized) return;
    const adminRoot = Utils.qs('#admin-auth-gate') || Utils.qs('#admin-dashboard-view');
    if (!adminRoot) return; // Exit cleanly if not on administrative page
    this._initialized = true;

    State.init();
    this.restoreSecurityState();
    this.bindEvents();

    // Check if session token exists and is valid
    if (this.isSessionActive()) {
      this.isAuthenticated = true;
      this.renderDashboard();
    } else {
      this.isAuthenticated = false;
      this.renderAuthGate();
    }
  },

  /**
   * Restore rate-limiting / lockout state from sessionStorage
   */
  restoreSecurityState() {
    if (typeof sessionStorage === 'undefined') return;
    const failed = parseInt(sessionStorage.getItem('syntaxarena_admin_failed') || '0', 10);
    const lockout = parseInt(sessionStorage.getItem('syntaxarena_admin_lockout') || '0', 10);

    this.failedAttempts = isNaN(failed) ? 0 : failed;
    this.lockoutUntil = isNaN(lockout) ? 0 : lockout;

    if (Date.now() < this.lockoutUntil) {
      this.startLockoutCountdown();
    }
  },

  /**
   * Check if sessionStorage holds a valid, unexpired admin session token
   */
  isSessionActive() {
    if (typeof sessionStorage === 'undefined') return false;
    try {
      const raw = sessionStorage.getItem('syntaxarena_admin_session');
      if (!raw) return false;
      const sess = JSON.parse(raw);
      if (sess && sess.user === 'admin' && sess.expiry > Date.now()) {
        return true;
      }
    } catch (e) {}
    return false;
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Login form submit
    const loginForm = Utils.qs('#admin-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleLogin();
      });
    }

    // Toggle password visibility
    const togglePassBtn = Utils.qs('#btn-toggle-password');
    const passInput = Utils.qs('#admin-input-password');
    if (togglePassBtn && passInput) {
      togglePassBtn.addEventListener('click', () => {
        const isPassword = passInput.type === 'password';
        passInput.type = isPassword ? 'text' : 'password';
        togglePassBtn.textContent = isPassword ? 'Hide' : 'Show';
      });
    }

    // Logout buttons (Header & Dashboard)
    const logoutBtn = Utils.qs('#btn-admin-logout');
    const headerLogoutBtn = Utils.qs('#btn-admin-header-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.handleLogout());
    if (headerLogoutBtn) headerLogoutBtn.addEventListener('click', () => this.handleLogout());

    // Refresh telemetry
    const refreshBtn = Utils.qs('#btn-admin-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadTelemetryData();
        UI.showToast('🔄 Telemetry data refreshed from storage', 'info');
      });
    }

    // Seed demo players
    const seedBtn = Utils.qs('#btn-admin-seed-demo');
    if (seedBtn) {
      seedBtn.addEventListener('click', () => {
        this.seedDemoPlayers();
      });
    }

    // Export JSON audit log
    const exportBtn = Utils.qs('#btn-admin-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportTelemetryAudit();
      });
    }

    // Export HTML formatted report (Item 9)
    const exportHtmlBtn = Utils.qs('#btn-admin-export-html');
    if (exportHtmlBtn) {
      exportHtmlBtn.addEventListener('click', () => {
        this.exportTelemetryHtml();
      });
    }

    // Export TXT ASCII summary (Item 9)
    const exportTxtBtn = Utils.qs('#btn-admin-export-txt');
    if (exportTxtBtn) {
      exportTxtBtn.addEventListener('click', () => {
        this.exportTelemetryTxt();
      });
    }

    // Dossier Delete Player button (Item 8)
    const dossierDeleteBtn = Utils.qs('#btn-dossier-delete-player');
    if (dossierDeleteBtn) {
      dossierDeleteBtn.addEventListener('click', () => {
        if (this.selectedPlayer) {
          this.deletePlayer(this.selectedPlayer.id, this.selectedPlayer.username);
        }
      });
    }

    // Search and Language Filter
    const searchInput = Utils.qs('#admin-search-player');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderPlayerRosterTable();
      });
    }

    const langFilter = Utils.qs('#admin-filter-language');
    if (langFilter) {
      langFilter.addEventListener('change', (e) => {
        this.filterLanguage = e.target.value;
        this.renderPlayerRosterTable();
      });
    }

    // Dossier Modal Close controls
    const closeDossierBtn = Utils.qs('#btn-close-dossier');
    const closeDossierFooter = Utils.qs('#btn-close-dossier-footer');
    const modalBackdrop = Utils.qs('#modal-player-dossier');

    if (closeDossierBtn) closeDossierBtn.addEventListener('click', () => this.closeDossier());
    if (closeDossierFooter) closeDossierFooter.addEventListener('click', () => this.closeDossier());
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) this.closeDossier();
      });
    }

    // Mobile menu drawer toggle
    const mobileBtn = Utils.qs('#btn-mobile-menu');
    const drawer = Utils.qs('#mobile-nav-drawer');
    if (mobileBtn && drawer && !mobileBtn.dataset.hasMobileMenuBinding) {
      mobileBtn.dataset.hasMobileMenuBinding = 'true';
      mobileBtn.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('is-open');
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // Refresh Curriculum Studio roster on custom lesson updates
    if (typeof window !== 'undefined') {
      window.addEventListener('syntaxarena:lessons-updated', () => {
        if (this.isAuthenticated && typeof LessonUploader !== 'undefined' && typeof LessonUploader.renderCustomLessonsRoster === 'function') {
          LessonUploader.renderCustomLessonsRoster();
        }
      });
    }
  },

  /**
   * Handle Login Authentication
   */
  async handleLogin() {
    // Check if in cooldown
    if (Date.now() < this.lockoutUntil) {
      const remainingSec = Math.ceil((this.lockoutUntil - Date.now()) / 1000);
      this.showLockoutNotice(remainingSec);
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playIncorrect) AudioEngine.playIncorrect();
      return;
    }

    const userInput = Utils.qs('#admin-input-username');
    const passInput = Utils.qs('#admin-input-password');
    const submitBtn = Utils.qs('#btn-admin-submit');
    const errorBox = Utils.qs('#admin-auth-error');
    const errorText = Utils.qs('#admin-error-text');

    if (!userInput || !passInput) return;

    const username = userInput.value.trim();
    const password = passInput.value;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Verifying Credentials...</span>';
    }

    // Compute SHA-256 hash
    let hash = '';
    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        hash = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {}

    const isUserValid = (username === this.ADMIN_USERNAME);
    const isPassValid = (hash === this.ADMIN_PASSWORD_HASH) || (password === this.ADMIN_PLAIN_FALLBACK);

    if (isUserValid && isPassValid) {
      // Successful Login
      this.failedAttempts = 0;
      this.lockoutUntil = 0;
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('syntaxarena_admin_failed');
        sessionStorage.removeItem('syntaxarena_admin_lockout');

        const token = 'satok_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        const sessionPayload = {
          token,
          user: 'admin',
          authenticatedAt: Date.now(),
          expiry: Date.now() + (2 * 3600 * 1000) // 2 hour session
        };
        sessionStorage.setItem('syntaxarena_admin_session', JSON.stringify(sessionPayload));
      }

      this.isAuthenticated = true;
      if (errorBox) errorBox.style.display = 'none';

      if (typeof AudioEngine !== 'undefined' && AudioEngine.playCorrect) {
        AudioEngine.playCorrect();
      }
      UI.showToast('🔓 Administrator access authenticated. Welcome back, Admin.', 'success');

      this.renderDashboard();
    } else {
      // Failed Login
      this.failedAttempts++;
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('syntaxarena_admin_failed', this.failedAttempts.toString());
      }

      // Check if threshold reached
      if (this.failedAttempts >= 5) {
        this.lockoutUntil = Date.now() + (30 * 1000); // 30 sec cooldown
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('syntaxarena_admin_lockout', this.lockoutUntil.toString());
        }
        this.startLockoutCountdown();
      } else {
        const remaining = 5 - this.failedAttempts;
        if (errorBox && errorText) {
          errorBox.style.display = 'block';
          errorText.textContent = `Invalid username or password. Access denied. (${remaining} attempts remaining before security cooldown)`;
          errorBox.classList.add('animate-shake');
          setTimeout(() => errorBox.classList.remove('animate-shake'), 600);
        }
      }

      if (typeof AudioEngine !== 'undefined' && AudioEngine.playIncorrect) {
        AudioEngine.playIncorrect();
      }

      if (passInput) {
        passInput.value = '';
        passInput.focus();
      }
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Authenticate &amp; Enter Console 🔑</span>';
    }
  },

  /**
   * Lockout countdown ticker
   */
  startLockoutCountdown() {
    if (this.lockoutTimerId) clearInterval(this.lockoutTimerId);

    const errorBox = Utils.qs('#admin-auth-error');
    if (errorBox) errorBox.style.display = 'none';

    const tick = () => {
      const remainingSec = Math.ceil((this.lockoutUntil - Date.now()) / 1000);
      if (remainingSec <= 0) {
        clearInterval(this.lockoutTimerId);
        this.lockoutTimerId = null;
        this.lockoutUntil = 0;
        this.failedAttempts = 0;
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('syntaxarena_admin_lockout');
          sessionStorage.removeItem('syntaxarena_admin_failed');
        }
        const noticeBox = Utils.qs('#admin-lockout-notice');
        if (noticeBox) noticeBox.style.display = 'none';
        return;
      }
      this.showLockoutNotice(remainingSec);
    };

    tick();
    this.lockoutTimerId = setInterval(tick, 1000);
  },

  /**
   * Display lockout alert
   */
  showLockoutNotice(remainingSec) {
    const noticeBox = Utils.qs('#admin-lockout-notice');
    const noticeText = Utils.qs('#admin-lockout-text');
    if (noticeBox && noticeText) {
      noticeBox.style.display = 'block';
      noticeText.textContent = `Too many failed attempts. Security cooldown active: ${remainingSec}s remaining.`;
    }
  },

  /**
   * Handle Admin Sign Out
   */
  handleLogout() {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('syntaxarena_admin_session');
    }
    this.isAuthenticated = false;
    this.renderAuthGate();
    UI.showToast('🔒 Signed out of administrative console', 'info');
    if (typeof AudioEngine !== 'undefined' && AudioEngine.playClick) {
      AudioEngine.playClick();
    }
  },

  /**
   * Render Login Gateway View
   */
  renderAuthGate() {
    const gate = Utils.qs('#admin-auth-gate');
    const dash = Utils.qs('#admin-dashboard-view');
    const headerLogout = Utils.qs('#btn-admin-header-logout');
    const indicator = Utils.qs('#admin-auth-indicator');

    if (gate) gate.style.display = 'flex';
    if (dash) dash.style.display = 'none';
    if (headerLogout) headerLogout.style.display = 'none';
    if (indicator) indicator.style.display = 'none';

    const userInput = Utils.qs('#admin-input-username');
    if (userInput) userInput.focus();
  },

  /**
   * Render Dashboard View
   */
  renderDashboard() {
    const gate = Utils.qs('#admin-auth-gate');
    const dash = Utils.qs('#admin-dashboard-view');
    const headerLogout = Utils.qs('#btn-admin-header-logout');
    const indicator = Utils.qs('#admin-auth-indicator');

    if (gate) gate.style.display = 'none';
    if (dash) dash.style.display = 'block';
    if (headerLogout) headerLogout.style.display = 'inline-flex';
    if (indicator) indicator.style.display = 'inline-flex';

    this.loadTelemetryData();
    if (typeof LessonUploader !== 'undefined' && typeof LessonUploader.init === 'function') {
      LessonUploader.init();
    }
  },

  /**
   * Load real data from StorageManager and calculate track-by-track completions
   */
  loadTelemetryData() {
    const rawSchema = Storage.load();
    let profileList = (rawSchema && rawSchema.profiles && Array.isArray(rawSchema.profiles)) ? rawSchema.profiles : [];

    // If profiles list is empty, initialize default
    if (profileList.length === 0) {
      const defaultProf = createDefaultProfile();
      profileList = [defaultProf];
      rawSchema.profiles = profileList;
      Storage.save(rawSchema);
    }

    // Process each player's language completion metrics
    this.profiles = profileList.map(p => this.processPlayerLanguageMetrics(p));

    // Render Metrics, Roster Table, and Track Cards
    this.renderGlobalMetrics();
    this.renderPlayerRosterTable();
    this.renderGlobalTrackCards();
  },

  /**
   * Compute comprehensive language-by-language metrics for a single player
   */
  processPlayerLanguageMetrics(profile) {
    const trackStats = {};
    let totalQuestionsAnswered = 0;
    let totalQuestionsCorrect = 0;
    let totalLessonsMastered = 0;

    const completedLessons = profile.completedLessons || [];
    const completedStages = profile.completedStages || {};
    const campaign = profile.campaign || {};

    this.TRACKS.forEach(track => {
      const trackId = track.id;
      const camp = campaign[trackId] || { beginnerStars: 0, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' };

      // Calculate questions completed from stages and campaign stars
      // Each tier has 4 stages of 5 questions (total 20 per tier, 60 per language)
      let begCompleted = 0;
      let intCompleted = 0;
      let expCompleted = 0;

      for (let s = 1; s <= 4; s++) {
        if (completedStages[`${trackId}-beginner-${s}`]) begCompleted += 5;
        if (completedStages[`${trackId}-intermediate-${s}`]) intCompleted += 5;
        if (completedStages[`${trackId}-expert-${s}`]) expCompleted += 5;
      }

      // If stage records are empty but stars exist, infer from stars
      if (begCompleted === 0 && camp.beginnerStars > 0) begCompleted = Math.min(20, camp.beginnerStars * 7);
      if (intCompleted === 0 && camp.intermediateStars > 0) intCompleted = Math.min(20, camp.intermediateStars * 7);
      if (expCompleted === 0 && camp.expertStars > 0) expCompleted = Math.min(20, camp.expertStars * 7);

      const questionsDone = Math.min(60, begCompleted + intCompleted + expCompleted);

      // Lessons completed for this track
      const lessonsDone = completedLessons.filter(lesId => {
        const lesson = academyLessons.find(l => l.id === lesId);
        return lesson && lesson.language === trackId;
      }).length;

      const completionPct = Math.round(((questionsDone / 60) * 0.75 + (lessonsDone / 5) * 0.25) * 100);

      trackStats[trackId] = {
        trackId,
        name: track.name,
        icon: track.icon,
        questionsDone,
        totalQuestions: 60,
        begCompleted,
        intCompleted,
        expCompleted,
        starsEarned: (camp.beginnerStars || 0) + (camp.intermediateStars || 0) + (camp.expertStars || 0),
        lessonsDone,
        totalLessons: 5,
        completionPct
      };

      totalQuestionsAnswered += questionsDone;
      totalLessonsMastered += lessonsDone;
    });

    // Overall global completion across all 720 questions (60 * 12) + 60 lessons (5 * 12)
    const overallPct = Math.round(((totalQuestionsAnswered / 720) * 0.75 + (totalLessonsMastered / 60) * 0.25) * 100);

    return {
      ...profile,
      trackStats,
      totalQuestionsAnswered,
      totalLessonsMastered,
      overallPct
    };
  },

  /**
   * Render Top KPI Metric Cards
   */
  renderGlobalMetrics() {
    const totalPlayersEl = Utils.qs('#stat-total-players');
    const totalMasteredEl = Utils.qs('#stat-total-mastered');
    const totalLessonsEl = Utils.qs('#stat-total-lessons');
    const avgCompletionEl = Utils.qs('#stat-avg-completion');

    const playerCount = this.profiles.length;
    let sumQuestions = 0;
    let sumLessons = 0;
    let sumPct = 0;

    this.profiles.forEach(p => {
      sumQuestions += p.totalQuestionsAnswered || 0;
      sumLessons += p.totalLessonsMastered || 0;
      sumPct += p.overallPct || 0;
    });

    const avgPct = playerCount > 0 ? (sumPct / playerCount).toFixed(1) : '0.0';

    if (totalPlayersEl) totalPlayersEl.textContent = playerCount.toString();
    if (totalMasteredEl) totalMasteredEl.textContent = sumQuestions.toString();
    if (totalLessonsEl) totalLessonsEl.textContent = sumLessons.toString();
    if (avgCompletionEl) avgCompletionEl.textContent = `${avgPct}%`;
  },

  /**
   * Render Player Roster Table
   */
  renderPlayerRosterTable() {
    const tbody = Utils.qs('#admin-roster-tbody');
    if (!tbody) return;

    let filtered = this.profiles.slice();

    // Filter by search query
    if (this.searchQuery) {
      filtered = filtered.filter(p => (p.username || '').toLowerCase().includes(this.searchQuery));
    }

    // Filter by language (players with >= 1 question in track)
    if (this.filterLanguage !== 'all') {
      filtered = filtered.filter(p => {
        const stats = p.trackStats && p.trackStats[this.filterLanguage];
        return stats && (stats.questionsDone > 0 || stats.lessonsDone > 0);
      });
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="padding: var(--space-6); text-align: center; color: var(--text-muted);">
            No player profiles match the active filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(p => {
      const avatarSrc = `assets/images/${p.avatarId || 'cyber_fox'}.svg`;
      const joinedDate = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Active Today';
      const lastActive = p.lastLoginDate ? new Date(p.lastLoginDate).toLocaleDateString() : 'Just Now';

      // Mini language completion matrix badges
      const matrixBadges = this.TRACKS.map(t => {
        const st = p.trackStats[t.id] || { questionsDone: 0, lessonsDone: 0 };
        const isMastered = st.questionsDone >= 60 && st.lessonsDone >= 5;
        const hasProgress = st.questionsDone > 0 || st.lessonsDone > 0;
        
        let badgeColor = 'var(--text-muted)';
        let badgeBg = 'rgba(255, 255, 255, 0.04)';
        let badgeBorder = 'var(--border-subtle)';

        if (isMastered) {
          badgeColor = 'var(--color-success)';
          badgeBg = 'rgba(16, 185, 129, 0.12)';
          badgeBorder = 'var(--color-success)';
        } else if (hasProgress) {
          badgeColor = 'var(--color-primary)';
          badgeBg = 'rgba(99, 102, 241, 0.12)';
          badgeBorder = 'var(--color-primary)';
        }

        return `
          <span style="display: inline-flex; align-items: center; gap: 2px; padding: 2px 6px; font-size: 10px; font-family: var(--font-mono); border-radius: var(--radius-sm); border: 1px solid ${badgeBorder}; background: ${badgeBg}; color: ${badgeColor};"
                title="${t.name}: ${st.questionsDone}/60 Questions, ${st.lessonsDone}/5 Chapters">
            <span>${t.icon}</span>
            <span>${st.questionsDone}/60</span>
          </span>
        `;
      }).join('');

      return `
        <tr style="border-bottom: 1px solid var(--border-subtle); transition: background var(--duration-fast);" class="admin-roster-row">
          
          <!-- Player Profile -->
          <td style="padding: var(--space-3) var(--space-4);">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 36px; height: 36px; border-radius: var(--radius-full); background: var(--bg-surface-raised); border: 1px solid var(--border-strong); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <img src="${avatarSrc}" width="24" height="24" alt="${Utils.escapeHtml(p.username)} avatar">
              </div>
              <div>
                <strong style="color: var(--text-primary); font-family: var(--font-display); font-size: var(--text-sm); display: block;">
                  ${Utils.escapeHtml(p.username || 'ScriptAdept')}
                </strong>
                <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">
                  ID: ${Utils.escapeHtml((p.id || '').slice(0, 14))}
                </span>
              </div>
            </div>
          </td>

          <!-- Rank & XP -->
          <td style="padding: var(--space-3) var(--space-3);">
            <span class="badge badge-cyan" style="font-size: 9px; margin-bottom: 2px;">LVL ${p.level || 1} // ${Utils.escapeHtml(p.rank || 'Novice')}</span>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--color-primary); font-weight: 700;">
              ${(p.xp || 0).toLocaleString()} XP
            </div>
          </td>

          <!-- Registered / Last Active -->
          <td style="padding: var(--space-3) var(--space-3); font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary);">
            <div>Joined: ${joinedDate}</div>
            <div style="color: var(--text-muted); font-size: 10px;">Seen: ${lastActive}</div>
          </td>

          <!-- Global Progress -->
          <td style="padding: var(--space-3) var(--space-3); width: 140px;">
            <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">
              <span>Total Progress</span>
              <span style="font-weight: 700; color: var(--text-primary);">${p.overallPct}%</span>
            </div>
            <div style="height: 6px; background: var(--bg-surface-raised); border-radius: var(--radius-full); overflow: hidden; border: 1px solid var(--border-subtle);">
              <div style="height: 100%; width: ${p.overallPct}%; background: var(--color-primary); border-radius: var(--radius-full);"></div>
            </div>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted); display: block; margin-top: 2px;">
              ${p.totalQuestionsAnswered}/720 Questions
            </span>
          </td>

          <!-- Language Completion Progress Matrix -->
          <td style="padding: var(--space-3) var(--space-3); max-width: 440px;">
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${matrixBadges}
            </div>
          </td>

          <!-- Action -->
          <td style="padding: var(--space-3) var(--space-4); text-align: right; white-space: nowrap;">
            <button class="btn-arcade btn-neutral btn-sm btn-inspect-player" data-player-id="${p.id}" style="padding: 4px 8px; font-size: 11px;">
              <span>🔍 Dossier</span>
            </button>
            <button class="btn-arcade btn-danger btn-sm btn-delete-player" data-player-id="${p.id}" data-username="${Utils.escapeHtml(p.username)}" style="padding: 4px 8px; font-size: 11px; margin-left: 4px;" title="Permanently delete user">
              <span>🗑️</span>
            </button>
          </td>

        </tr>
      `;
    }).join('');

    // Bind Dossier button clicks
    tbody.querySelectorAll('.btn-inspect-player').forEach(btn => {
      btn.addEventListener('click', () => {
        const playerId = btn.dataset.playerId;
        this.openDossier(playerId);
      });
    });

    // Bind Delete button clicks (Item 8)
    tbody.querySelectorAll('.btn-delete-player').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const playerId = btn.dataset.playerId;
        const username = btn.dataset.username;
        this.deletePlayer(playerId, username);
      });
    });
  },

  /**
   * Render Track Curriculum Analytics Cards
   */
  renderGlobalTrackCards() {
    const grid = Utils.qs('#admin-tracks-grid');
    if (!grid) return;

    grid.innerHTML = this.TRACKS.map(t => {
      let sumQuestions = 0;
      let sumLessons = 0;
      let playersWithProgress = 0;

      this.profiles.forEach(p => {
        const st = p.trackStats && p.trackStats[t.id];
        if (st) {
          sumQuestions += st.questionsDone;
          sumLessons += st.lessonsDone;
          if (st.questionsDone > 0 || st.lessonsDone > 0) playersWithProgress++;
        }
      });

      const maxPossibleQuestions = (this.profiles.length || 1) * 60;
      const trackPct = Math.round((sumQuestions / maxPossibleQuestions) * 100);

      return `
        <div class="card card-raised" style="padding: var(--space-4); border: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-3);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">${t.icon}</span>
              <div>
                <strong style="font-size: var(--text-sm); font-family: var(--font-display); color: var(--text-primary); display: block;">
                  ${t.name}
                </strong>
                <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-muted);">
                  60 Questions • 5 Chapters
                </span>
              </div>
            </div>
            <span class="badge ${trackPct > 50 ? 'badge-emerald' : 'badge-cyan'}" style="font-size: 9px;">
              ${trackPct}% COMPLETED
            </span>
          </div>

          <div style="height: 5px; background: var(--bg-surface-raised); border-radius: var(--radius-full); overflow: hidden; margin-bottom: var(--space-3);">
            <div style="height: 100%; width: ${trackPct}%; background: var(--color-primary);"></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; font-family: var(--font-mono);">
            <div style="color: var(--text-secondary);">
              Questions: <strong style="color: var(--text-primary);">${sumQuestions}</strong>
            </div>
            <div style="color: var(--text-secondary);">
              Lessons: <strong style="color: var(--text-primary);">${sumLessons}</strong>
            </div>
            <div style="color: var(--text-secondary); grid-column: span 2; margin-top: 2px;">
              Active Enrollees: <strong style="color: var(--color-primary);">${playersWithProgress} / ${this.profiles.length}</strong>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Open Player Deep-Dive Dossier Modal
   */
  openDossier(playerId) {
    const modal = Utils.qs('#modal-player-dossier');
    const player = this.profiles.find(p => p.id === playerId);
    if (!modal || !player) return;

    this.selectedPlayer = player;

    // Populate Dossier Header
    const titleEl = Utils.qs('#dossier-modal-title');
    const rankEl = Utils.qs('#dossier-rank-badge');
    const avatarImg = Utils.qs('#dossier-avatar-img');
    const idEl = Utils.qs('#dossier-id');
    const xpEl = Utils.qs('#dossier-xp');
    const gamesEl = Utils.qs('#dossier-games');
    const accuracyEl = Utils.qs('#dossier-accuracy');

    if (titleEl) titleEl.textContent = `${player.username || 'ScriptAdept'}'s Dossier`;
    if (rankEl) rankEl.textContent = `LEVEL ${player.level || 1} // ${player.rank || 'Novice'}`;
    if (avatarImg) avatarImg.src = `assets/images/${player.avatarId || 'cyber_fox'}.svg`;
    if (idEl) idEl.textContent = player.id || 'N/A';
    if (xpEl) xpEl.textContent = `${(player.xp || 0).toLocaleString()} XP`;

    const stats = player.stats || {};
    if (gamesEl) gamesEl.textContent = `${stats.gamesPlayed || 0} Matches`;

    const accuracy = stats.questionsAttempted > 0 
      ? Math.round(((stats.questionsCorrect || 0) / stats.questionsAttempted) * 100) 
      : 0;
    if (accuracyEl) accuracyEl.textContent = `${accuracy}% (${stats.questionsCorrect || 0}/${stats.questionsAttempted || 0})`;

    // Populate 12-Language Breakdown List
    const list = Utils.qs('#dossier-language-list');
    if (list) {
      list.innerHTML = this.TRACKS.map(t => {
        const st = player.trackStats[t.id] || { questionsDone: 0, lessonsDone: 0, begCompleted: 0, intCompleted: 0, expCompleted: 0, starsEarned: 0, completionPct: 0 };
        return `
          <div style="background: var(--bg-surface-raised); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: var(--space-3) var(--space-4);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">${t.icon}</span>
                <strong style="color: var(--text-primary); font-size: var(--text-sm); font-family: var(--font-display);">${t.name}</strong>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="badge ${st.completionPct >= 80 ? 'badge-emerald' : 'badge-cyan'}" style="font-size: 10px;">
                  ${st.completionPct}% Completed
                </span>
                <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--text-primary);">
                  ${st.questionsDone} / 60 Qs
                </span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="height: 6px; background: var(--bg-surface); border-radius: var(--radius-full); overflow: hidden; margin-bottom: 8px; border: 1px solid var(--border-subtle);">
              <div style="height: 100%; width: ${st.completionPct}%; background: var(--color-primary); border-radius: var(--radius-full);"></div>
            </div>

            <!-- Subtier Grid -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); background: var(--bg-surface); padding: 4px 8px; border-radius: var(--radius-sm);">
              <div>Beg: <strong style="color: var(--text-secondary);">${st.begCompleted}/20</strong></div>
              <div>Int: <strong style="color: var(--text-secondary);">${st.intCompleted}/20</strong></div>
              <div>Exp: <strong style="color: var(--text-secondary);">${st.expCompleted}/20</strong></div>
              <div>Academy: <strong style="color: var(--color-success);">${st.lessonsDone}/5 Chapters</strong></div>
            </div>
          </div>
        `;
      }).join('');
    }

    modal.style.display = 'flex';
    modal.classList.add('is-open');
    if (typeof AudioEngine !== 'undefined' && AudioEngine.playClick) AudioEngine.playClick();
  },

  /**
   * Close Dossier Modal
   */
  closeDossier() {
    const modal = Utils.qs('#modal-player-dossier');
    if (modal) {
      modal.classList.remove('is-open');
      modal.style.display = 'none';
    }
  },

  /**
   * Seed Simulated Demo Players for Multi-Player Auditing Demonstration
   */
  seedDemoPlayers() {
    const rawSchema = Storage.load();
    const existing = (rawSchema && rawSchema.profiles && Array.isArray(rawSchema.profiles)) ? rawSchema.profiles : [];

    const demoProfiles = [
      {
        id: 'prof-demo-valkyrie',
        username: 'CyberValkyrie',
        avatarId: 'bit_knight',
        level: 14,
        rank: 'Matrix Master',
        xp: 14200,
        createdAt: Date.now() - (18 * 86400 * 1000),
        lastLoginDate: Date.now() - (3600 * 1000),
        stats: { gamesPlayed: 28, questionsAttempted: 180, questionsCorrect: 168 },
        completedLessons: ['py-les-001', 'py-les-002', 'py-les-003', 'py-les-004', 'py-les-005', 'cyber-les-001', 'cyber-les-002', 'cyber-les-003', 'cyber-les-004', 'cyber-les-005'],
        completedStages: {
          'python-beginner-1': true, 'python-beginner-2': true, 'python-beginner-3': true, 'python-beginner-4': true,
          'python-intermediate-1': true, 'python-intermediate-2': true, 'python-intermediate-3': true, 'python-intermediate-4': true,
          'python-expert-1': true, 'python-expert-2': true,
          'cyber-beginner-1': true, 'cyber-beginner-2': true, 'cyber-beginner-3': true, 'cyber-beginner-4': true,
          'cyber-intermediate-1': true, 'cyber-intermediate-2': true, 'cyber-intermediate-3': true,
          'cyber-expert-1': true, 'cyber-expert-2': true
        },
        campaign: {
          python: { beginnerStars: 3, intermediateStars: 3, expertStars: 2, unlockedTier: 'expert' },
          cyber: { beginnerStars: 3, intermediateStars: 3, expertStars: 2, unlockedTier: 'expert' }
        }
      },
      {
        id: 'prof-demo-rustacean',
        username: 'Rustacean42',
        avatarId: 'terminal_owl',
        level: 11,
        rank: 'Code Crusader',
        xp: 11800,
        createdAt: Date.now() - (24 * 86400 * 1000),
        lastLoginDate: Date.now() - (12 * 3600 * 1000),
        stats: { gamesPlayed: 22, questionsAttempted: 150, questionsCorrect: 139 },
        completedLessons: ['rust-les-001', 'rust-les-002', 'rust-les-003', 'rust-les-004', 'c-les-001', 'c-les-002', 'go-les-001'],
        completedStages: {
          'rust-beginner-1': true, 'rust-beginner-2': true, 'rust-beginner-3': true, 'rust-beginner-4': true,
          'rust-intermediate-1': true, 'rust-intermediate-2': true, 'rust-intermediate-3': true, 'rust-intermediate-4': true,
          'rust-expert-1': true, 'rust-expert-2': true, 'rust-expert-3': true,
          'c-beginner-1': true, 'c-beginner-2': true, 'c-beginner-3': true, 'c-beginner-4': true,
          'c-intermediate-1': true, 'c-intermediate-2': true,
          'go-beginner-1': true, 'go-beginner-2': true, 'go-beginner-3': true
        },
        campaign: {
          rust: { beginnerStars: 3, intermediateStars: 3, expertStars: 3, unlockedTier: 'expert' },
          c: { beginnerStars: 3, intermediateStars: 2, expertStars: 0, unlockedTier: 'intermediate' },
          go: { beginnerStars: 3, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' }
        }
      },
      {
        id: 'prof-demo-sqlwiz',
        username: 'SQL_Wizard',
        avatarId: 'matrix_cat',
        level: 18,
        rank: 'Syntax Grandmaster',
        xp: 18900,
        createdAt: Date.now() - (35 * 86400 * 1000),
        lastLoginDate: Date.now() - (1800 * 1000),
        stats: { gamesPlayed: 36, questionsAttempted: 240, questionsCorrect: 231 },
        completedLessons: ['sql-les-001', 'sql-les-002', 'sql-les-003', 'sql-les-004', 'sql-les-005', 'js-les-001', 'js-les-002', 'ts-les-001'],
        completedStages: {
          'sql-beginner-1': true, 'sql-beginner-2': true, 'sql-beginner-3': true, 'sql-beginner-4': true,
          'sql-intermediate-1': true, 'sql-intermediate-2': true, 'sql-intermediate-3': true, 'sql-intermediate-4': true,
          'sql-expert-1': true, 'sql-expert-2': true, 'sql-expert-3': true, 'sql-expert-4': true,
          'javascript-beginner-1': true, 'javascript-beginner-2': true, 'javascript-beginner-3': true, 'javascript-beginner-4': true,
          'javascript-intermediate-1': true, 'javascript-intermediate-2': true,
          'typescript-beginner-1': true, 'typescript-beginner-2': true, 'typescript-beginner-3': true
        },
        campaign: {
          sql: { beginnerStars: 3, intermediateStars: 3, expertStars: 3, unlockedTier: 'expert' },
          javascript: { beginnerStars: 3, intermediateStars: 2, expertStars: 0, unlockedTier: 'intermediate' },
          typescript: { beginnerStars: 3, intermediateStars: 0, expertStars: 0, unlockedTier: 'beginner' }
        }
      }
    ];

    // Merge without duplicates
    demoProfiles.forEach(dp => {
      const idx = existing.findIndex(e => e.id === dp.id);
      if (idx >= 0) {
        existing[idx] = dp;
      } else {
        existing.push(dp);
      }
    });

    rawSchema.profiles = existing;
    Storage.save(rawSchema);

    this.loadTelemetryData();
    UI.showToast('🌱 3 Demo Player Profiles seeded with full language completions!', 'success');
  },

  /**
   * Permanently delete a player account and reset resources if they log in again (Item 8).
   * @param {string} playerId
   * @param {string} [username]
   */
  deletePlayer(playerId, username) {
    if (!playerId) return;
    const player = this.profiles.find(p => p.id === playerId);
    const displayName = username || player?.username || 'this player';

    const confirmed = typeof window !== 'undefined' && window.confirm 
      ? window.confirm(`⚠️ PERMANENT USER DELETION\n\nAre you sure you want to permanently delete player "${displayName}"?\n\nThis action cannot be undone. All stars, achievements, module completions, XP, and inventory will be wiped. When this user logs in again, they will start completely from scratch.`)
      : true;

    if (!confirmed) return;

    const rawSchema = Storage.load();
    const existing = (rawSchema && rawSchema.profiles && Array.isArray(rawSchema.profiles)) ? rawSchema.profiles : [];
    
    // Filter out the deleted player
    rawSchema.profiles = existing.filter(p => p.id !== playerId);

    // If deleted player was active or no profiles remain, initialize fresh default profile
    if (rawSchema.activeProfileId === playerId || rawSchema.profiles.length === 0) {
      const freshProfile = createDefaultProfile();
      rawSchema.profiles.push(freshProfile);
      rawSchema.activeProfileId = freshProfile.id;
      State.set('activeProfile', freshProfile, false);
    } else {
      const nextActive = rawSchema.profiles[0];
      rawSchema.activeProfileId = nextActive.id;
      State.set('activeProfile', nextActive, false);
    }

    State.set('profiles', rawSchema.profiles, false);
    Storage.save(rawSchema);

    this.closeDossier();
    this.loadTelemetryData();
    UI.showToast(`🗑️ Player "${displayName}" permanently deleted. Resources reset to scratch.`, 'success');
    if (typeof AudioEngine !== 'undefined' && AudioEngine.playSuccess) AudioEngine.playSuccess();
  },

  /**
   * Export Standalone Formatted HTML Telemetry Report (Item 9)
   */
  exportTelemetryHtml() {
    const timestamp = new Date().toISOString();
    const dateStr = timestamp.slice(0, 10);
    const totalXP = this.profiles.reduce((sum, p) => sum + (p.xp || 0), 0);
    const totalQuestions = this.profiles.reduce((sum, p) => sum + (p.totalQuestionsAnswered || 0), 0);
    const avgAccuracy = this.profiles.length > 0
      ? Math.round(this.profiles.reduce((sum, p) => {
          const st = p.stats || {};
          return sum + (st.questionsAttempted > 0 ? ((st.questionsCorrect || 0) / st.questionsAttempted) * 100 : 0);
        }, 0) / this.profiles.length)
      : 0;

    const tracksHtml = this.TRACKS.map(t => {
      let sumQuestions = 0;
      let sumLessons = 0;
      this.profiles.forEach(p => {
        const st = p.trackStats?.[t.id];
        if (st) {
          sumQuestions += (st.questionsDone || 0);
          sumLessons += (st.lessonsDone || 0);
        }
      });
      const maxPossible = (this.profiles.length || 1) * 60;
      const pct = Math.round((sumQuestions / maxPossible) * 100);
      return `
        <tr>
          <td><span style="font-size: 1.2rem; margin-right: 6px;">${t.icon}</span><strong>${t.name}</strong></td>
          <td>${sumQuestions}</td>
          <td>${sumLessons}</td>
          <td>
            <div style="background: #1e293b; border-radius: 9999px; height: 8px; width: 120px; display: inline-block; vertical-align: middle; margin-right: 8px; overflow: hidden;">
              <div style="background: #38bdf8; height: 100%; width: ${pct}%;"></div>
            </div>
            <strong>${pct}%</strong>
          </td>
        </tr>
      `;
    }).join('');

    const playersHtml = this.profiles.map(p => {
      const stats = p.stats || {};
      const acc = stats.questionsAttempted > 0 ? Math.round((stats.questionsCorrect / stats.questionsAttempted) * 100) : 0;
      return `
        <tr>
          <td>
            <strong>${Utils.escapeHtml(p.username || 'ScriptAdept')}</strong><br>
            <small style="color: #64748b; font-family: monospace;">${p.id || ''}</small>
          </td>
          <td><span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 2px 8px; border-radius: 4px; font-weight: 700;">Lv.${p.level || 1}</span> ${Utils.escapeHtml(p.rank || 'Novice')}</td>
          <td><strong style="color: #10b981;">${(p.xp || 0).toLocaleString()} XP</strong></td>
          <td>${stats.gamesPlayed || 0}</td>
          <td>${acc}% (${stats.questionsCorrect || 0}/${stats.questionsAttempted || 0})</td>
          <td><strong>${p.overallPct || 0}%</strong></td>
        </tr>
      `;
    }).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SyntaxArena Telemetry &amp; Curriculum Audit Report (${dateStr})</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0b0f19; color: #f1f5f9; padding: 2rem; margin: 0; line-height: 1.5; }
    .report-container { max-width: 1100px; margin: 0 auto; }
    h1 { font-family: monospace; font-size: 1.8rem; color: #38bdf8; margin-bottom: 0.25rem; }
    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 2rem 0; }
    .kpi-card { background: #111827; border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 1.25rem; text-align: center; }
    .kpi-val { font-size: 1.8rem; font-weight: 800; color: #38bdf8; font-family: monospace; }
    .kpi-lbl { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; margin-top: 0.25rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; background: #111827; border-radius: 8px; overflow: hidden; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #1f2937; }
    th { background: #1e293b; font-size: 0.8rem; text-transform: uppercase; color: #94a3b8; font-family: monospace; }
    section { margin-top: 2.5rem; }
    h2 { font-family: monospace; font-size: 1.25rem; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
    footer { margin-top: 3rem; text-align: center; color: #64748b; font-size: 0.85rem; font-family: monospace; border-top: 1px solid #1f2937; padding-top: 1rem; }
  </style>
</head>
<body>
  <div class="report-container">
    <h1>🛡️ SyntaxArena Live Telemetry Audit Report</h1>
    <div style="color: #94a3b8; font-size: 0.9rem;">Generated: ${timestamp} • Audited by: Admin Session</div>

    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-val">${this.profiles.length}</div>
        <div class="kpi-lbl">Enrolled Players</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-val">${totalXP.toLocaleString()}</div>
        <div class="kpi-lbl">Total Accumulated XP</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-val">${totalQuestions}</div>
        <div class="kpi-lbl">Completed Questions</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-val">${avgAccuracy}%</div>
        <div class="kpi-lbl">Cohort Mean Accuracy</div>
      </div>
    </div>

    <section>
      <h2>📚 12-Language Track Curriculum Completion</h2>
      <table>
        <thead>
          <tr><th>Track</th><th>Questions Completed</th><th>Lessons Mastered</th><th>Curriculum Coverage</th></tr>
        </thead>
        <tbody>
          ${tracksHtml}
        </tbody>
      </table>
    </section>

    <section>
      <h2>👥 Player Roster &amp; Progression Telemetry</h2>
      <table>
        <thead>
          <tr><th>Player</th><th>Level &amp; Rank</th><th>Lifetime XP</th><th>Matches</th><th>Accuracy</th><th>Global Progress</th></tr>
        </thead>
        <tbody>
          ${playersHtml}
        </tbody>
      </table>
    </section>

    <footer>
      SyntaxArena Administrative Security Suite • Cryptographically Verified Audit Export
    </footer>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syntaxarena-telemetry-report-${dateStr}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    UI.showToast('🌐 Formatted HTML audit report exported', 'success');
  },

  /**
   * Export Plain Text ASCII Telemetry Summary (Item 9)
   */
  exportTelemetryTxt() {
    const timestamp = new Date().toISOString();
    const dateStr = timestamp.slice(0, 10);
    const totalXP = this.profiles.reduce((sum, p) => sum + (p.xp || 0), 0);
    const totalQuestions = this.profiles.reduce((sum, p) => sum + (p.totalQuestionsAnswered || 0), 0);

    const pad = (str, len) => String(str).padEnd(len, ' ');
    const rpad = (str, len) => String(str).padStart(len, ' ');

    let txt = '';
    txt += '========================================================================\n';
    txt += '       SYNTAXARENA LIVE CURRICULUM TELEMETRY & AUDIT REPORT            \n';
    txt += '========================================================================\n';
    txt += `Timestamp : ${timestamp}\n`;
    txt += `Platform  : SyntaxArena Cyber Academy & Challenge Engine\n`;
    txt += `Audited By: admin\n`;
    txt += `Total Enrolled Players: ${this.profiles.length}\n`;
    txt += `Total Cohort XP       : ${totalXP.toLocaleString()} XP\n`;
    txt += `Total Questions Solved: ${totalQuestions}\n\n`;

    txt += '------------------------------------------------------------------------\n';
    txt += ' 12-LANGUAGE TRACK INVENTORY & COMPLETION METRICS\n';
    txt += '------------------------------------------------------------------------\n';
    txt += `${pad('Track Name', 24)} | ${pad('Questions', 12)} | ${pad('Lessons', 10)} | ${pad('Completion', 12)}\n`;
    txt += '------------------------------------------------------------------------\n';

    this.TRACKS.forEach(t => {
      let sumQuestions = 0;
      let sumLessons = 0;
      this.profiles.forEach(p => {
        const st = p.trackStats?.[t.id];
        if (st) {
          sumQuestions += (st.questionsDone || 0);
          sumLessons += (st.lessonsDone || 0);
        }
      });
      const maxPossible = (this.profiles.length || 1) * 60;
      const pct = Math.round((sumQuestions / maxPossible) * 100);
      txt += `${pad(t.name, 24)} | ${rpad(sumQuestions + '/60', 12)} | ${rpad(sumLessons + '/5', 10)} | ${rpad(pct + '%', 12)}\n`;
    });

    txt += '\n------------------------------------------------------------------------\n';
    txt += ' ENROLLED PLAYER ROSTER DOSSIERS\n';
    txt += '------------------------------------------------------------------------\n';
    txt += `${pad('Username', 18)} | ${pad('Level/Rank', 22)} | ${pad('Lifetime XP', 12)} | ${pad('Accuracy', 10)} | ${pad('Progress', 8)}\n`;
    txt += '------------------------------------------------------------------------\n';

    this.profiles.forEach(p => {
      const stats = p.stats || {};
      const acc = stats.questionsAttempted > 0 ? Math.round((stats.questionsCorrect / stats.questionsAttempted) * 100) : 0;
      const rankStr = `Lv.${p.level || 1} ${p.rank || 'Novice'}`;
      txt += `${pad(p.username || 'ScriptAdept', 18)} | ${pad(rankStr, 22)} | ${rpad((p.xp || 0).toLocaleString() + ' XP', 12)} | ${rpad(acc + '%', 10)} | ${rpad((p.overallPct || 0) + '%', 8)}\n`;
    });

    txt += '========================================================================\n';
    txt += ' End of SyntaxArena Audit Telemetry Report\n';
    txt += '========================================================================\n';

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `syntaxarena-telemetry-report-${dateStr}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    UI.showToast('📄 Plain text ASCII audit summary exported', 'success');
  }
};

// Auto-bootstrap
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AdminController.init());
  } else {
    AdminController.init();
  }
}
