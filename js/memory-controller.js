/**
 * SyntaxArena Feature 8: Tactile Memory Pointer Minigames Controller
 * Coordinates UI rendering, SVG bezier cable drag & click-to-connect math, audio feedback,
 * independent mode scoring, and game state events for memory-games.html.
 */

import { MemoryMinigameEngine } from './memory-minigame.js';
import { CABLE_CONNECT_LEVELS, LEAK_PATROL_LEVELS, DEREFERENCE_RUSH_CHALLENGES } from '../data/memory-levels.js';
import { AudioEngine } from './audio.js';

export const MemoryMinigameController = {
  engine: null,
  activeDrag: null,
  selectedSourceId: null,
  isRushLocked: false,

  init() {
    this.engine = new MemoryMinigameEngine({
      cableLevels: window.CABLE_CONNECT_LEVELS || CABLE_CONNECT_LEVELS,
      leakLevels: window.LEAK_PATROL_LEVELS || LEAK_PATROL_LEVELS,
      rushChallenges: window.DEREFERENCE_RUSH_CHALLENGES || DEREFERENCE_RUSH_CHALLENGES
    });

    this._bindDOMEvents();
    this._bindEngineEvents();

    // Default to Cable Connect level 0
    this.engine.setMode('cable_connect');

    // Start meditative memory music mode (Item 4)
    try {
      if (typeof AudioEngine !== 'undefined' && typeof AudioEngine.startMusic === 'function') {
        AudioEngine.startMusic('memory');
      }
    } catch (_) {}
  },

  _bindDOMEvents() {
    // Mode switcher tabs
    document.querySelectorAll('.mem-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        document.querySelectorAll('.mem-mode-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this._clearPortSelection();
        this.engine.setMode(mode);
        this._playClick();
      });
    });

    // Cable Connect Action buttons
    const btnCheckWiring = document.getElementById('btn-check-wiring');
    if (btnCheckWiring) {
      btnCheckWiring.addEventListener('click', () => {
        this._clearPortSelection();
        this.engine.validateCableWiring();
      });
    }

    const btnClearCables = document.getElementById('btn-clear-cables');
    if (btnClearCables) {
      btnClearCables.addEventListener('click', () => {
        this._clearPortSelection();
        this.engine.clearConnections();
        this._renderCables();
        this._playClick();
      });
    }

    const btnNextLevel = document.getElementById('btn-next-level');
    if (btnNextLevel) {
      btnNextLevel.addEventListener('click', () => {
        this._clearPortSelection();
        if (this.engine.activeMode === 'cable_connect') {
          this.engine.loadCableLevel(this.engine.currentLevelIndex + 1);
        } else if (this.engine.activeMode === 'leak_patrol') {
          this.engine.loadLeakLevel(this.engine.currentLevelIndex + 1);
        }
        btnNextLevel.style.display = 'none';
        this._playClick();
      });
    }

    // Leak Patrol hint button
    const btnGcHint = document.getElementById('btn-gc-hint');
    if (btnGcHint) {
      btnGcHint.addEventListener('click', () => {
        this._triggerGcHintPulse();
        this._playClick();
      });
    }

    // Dereference Rush category slam buttons
    document.querySelectorAll('.mem-rush-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isRushLocked) return;
        const cat = btn.dataset.category;
        this.isRushLocked = true;
        document.querySelectorAll('.mem-rush-btn').forEach(b => b.classList.add('is-disabled'));
        this.engine.submitRushAnswer(cat);
      });
    });

    // Field Manual Modal (Item 23)
    const btnOpenManual = document.getElementById('btn-open-mem-manual');
    const modalManual = document.getElementById('modal-mem-manual');
    const btnCloseManual = document.getElementById('btn-close-mem-manual');
    const btnUnderstood = document.getElementById('btn-understood-mem-manual');

    if (btnOpenManual && modalManual) {
      btnOpenManual.addEventListener('click', () => {
        modalManual.style.display = 'flex';
        this._playClick();
      });
      [btnCloseManual, btnUnderstood].forEach(b => {
        if (b) {
          b.addEventListener('click', () => {
            modalManual.style.display = 'none';
            this._playClick();
          });
        }
      });
      modalManual.addEventListener('click', (e) => {
        if (e.target === modalManual) modalManual.style.display = 'none';
      });

      modalManual.querySelectorAll('.manual-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modalManual.querySelectorAll('.manual-tab-btn').forEach(b => {
            b.classList.remove('is-active');
            b.className = 'btn-arcade btn-neutral btn-sm manual-tab-btn';
          });
          modalManual.querySelectorAll('.manual-tab-pane').forEach(p => p.style.display = 'none');
          btn.className = 'btn-arcade btn-primary btn-sm manual-tab-btn is-active';
          const pane = document.getElementById(btn.dataset.tab);
          if (pane) pane.style.display = 'block';
          this._playClick();
        });
      });
    }

    // Pointer move / up for drag wiring and window resize observers
    window.addEventListener('mousemove', (e) => this._onPointerMove(e));
    window.addEventListener('mouseup', (e) => this._onPointerUp(e));
    window.addEventListener('touchmove', (e) => this._onTouchMove(e), { passive: false });
    window.addEventListener('touchend', (e) => this._onPointerUp(e));
    window.addEventListener('resize', () => this._renderCables());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._clearPortSelection();
    });
  },

  _bindEngineEvents() {
    this.engine.on('modeChanged', ({ mode }) => {
      this._updateHUD();
      this._toggleModePanels(mode);
    });

    this.engine.on('cableLevelLoaded', ({ level, index }) => {
      this._renderCableLevel(level, index);
      this._updateHUD();
    });

    this.engine.on('cableConnected', () => {
      this._renderCables();
      this._playSnap();

      // Auto-validate when required connection count is reached for zero-friction gameplay
      const level = this.engine.getCurrentCableLevel();
      const reqCount = (level?.requiredConnections || []).length;
      if (this.engine.userConnections.length >= reqCount) {
        this.engine.validateCableWiring();
      } else {
        const remaining = reqCount - this.engine.userConnections.length;
        this._showWireHelper(`⚡ Cable plugged in! Connect ${remaining} more route(s) to verify topology.`);
      }
    });

    this.engine.on('cableRemoved', () => {
      this._renderCables();
      this._playClick();
      const banner = document.getElementById('mem-feedback');
      if (banner) banner.style.display = 'none';
      const nextBtn = document.getElementById('btn-next-level');
      if (nextBtn) nextBtn.style.display = 'none';
      this._highlightValidCables(false);
    });

    this.engine.on('cableWiringValidated', (result) => {
      const banner = document.getElementById('mem-feedback');
      const nextBtn = document.getElementById('btn-next-level');

      if (result.valid) {
        if (banner) {
          banner.style.display = 'block';
          banner.className = 'mem-feedback-banner is-success';
          banner.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <span>🎉 <strong>POINTER ROUTING VERIFIED!</strong> (+${result.scoreAwarded} PTS) — All memory addresses match ground truth.</span>
              <button id="btn-banner-next-level" class="btn-arcade btn-primary btn-sm" style="font-size: 13px; padding: 6px 16px; box-shadow: 0 0 16px rgba(16, 185, 129, 0.5);">
                Advance to Next Level ➔
              </button>
            </div>
          `;
          const bannerNext = banner.querySelector('#btn-banner-next-level');
          if (bannerNext) {
            bannerNext.onclick = () => {
              if (nextBtn) nextBtn.click();
            };
          }
        }
        if (nextBtn) nextBtn.style.display = 'inline-flex';
        this._highlightValidCables(true);
        this._playChime();
      } else {
        if (banner) {
          banner.style.display = 'block';
          banner.className = 'mem-feedback-banner is-error';
          banner.textContent = `❌ ${result.feedback} — Click the cable to disconnect and try another port.`;
        }
        if (nextBtn) nextBtn.style.display = 'none';
        this._highlightValidCables(false);
        this._playBuzzer();
      }
      this._updateHUD();
    });

    this.engine.on('leakLevelLoaded', ({ level, index }) => {
      this._renderLeakLevel(level, index);
      this._updateHUD();
    });

    this.engine.on('blockReclaimed', (result) => {
      const card = document.getElementById(`card-${result.blockId}`);
      if (card) {
        card.classList.add('is-reclaimed');
        const freeBtn = card.querySelector('.mem-free-btn');
        if (freeBtn) {
          freeBtn.textContent = '✓ Deallocated';
          freeBtn.disabled = true;
          freeBtn.style.opacity = '0.5';
        }
      }
      const banner = document.getElementById('mem-feedback');
      banner.className = 'mem-feedback-banner is-success';
      banner.textContent = `🧹 ${result.feedback} (+${result.scoreAwarded} PTS)`;
      this._updateLeakMeter();
      this._updateHUD();
      this._playChime();
    });

    this.engine.on('useAfterFreeTriggered', (result) => {
      const banner = document.getElementById('mem-feedback');
      banner.className = 'mem-feedback-banner is-error';
      banner.textContent = result.feedback;
      this._updateHUD();
      this._playBuzzer();
    });

    this.engine.on('leakLevelCompleted', () => {
      const nextBtn = document.getElementById('btn-next-level');
      if (nextBtn) nextBtn.style.display = 'inline-flex';
      const banner = document.getElementById('mem-feedback');
      banner.textContent += ' 🎉 ALL ORPHANED MEMORY IN THIS SECTOR CLEANED! Advance to next scenario.';
    });

    this.engine.on('rushChallengeLoaded', ({ challenge, index, total }) => {
      this.isRushLocked = false;
      document.querySelectorAll('.mem-rush-btn').forEach(b => b.classList.remove('is-disabled'));
      this._renderRushChallenge(challenge, index, total);
      this._updateHUD();
    });

    this.engine.on('rushTimerTick', ({ secondsRemaining }) => {
      const fill = document.getElementById('rush-timer-fill');
      if (fill) {
        const pct = Math.max(0, (secondsRemaining / 12) * 100);
        fill.style.width = `${pct}%`;
        if (secondsRemaining <= 4) {
          fill.style.background = '#f43f5e';
        } else if (secondsRemaining <= 7) {
          fill.style.background = '#f59e0b';
        } else {
          fill.style.background = '#38bdf8';
        }
      }
    });

    this.engine.on('rushAnswerEvaluated', (result) => {
      const banner = document.getElementById('mem-rush-feedback');
      if (banner) {
        banner.style.display = 'block';
        if (result.isCorrect) {
          banner.className = 'mem-feedback-banner is-success';
          banner.textContent = `🎯 CORRECT! (+${result.scoreAwarded} PTS) — ${result.explanation}`;
          this._playChime();
        } else {
          banner.className = 'mem-feedback-banner is-error';
          banner.textContent = `💥 INCORRECT! Ground truth: ${result.correctCategory}. ${result.explanation}`;
          this._playBuzzer();
        }
      }
      this._updateHUD();

      // Proceed after 1.6 seconds
      setTimeout(() => {
        if (banner) banner.style.display = 'none';
        this.engine.proceedToNextRushChallenge();
      }, 1600);
    });

    this.engine.on('dereferenceRushCompleted', ({ stats, score, maxStreak }) => {
      this._renderRushCompletionScreen(stats, score, maxStreak);
      this._updateHUD();
      this._playChime();
    });
  },

  // ==========================================
  // HUD & PANELS (INDEPENDENT MODE TELEMETRY)
  // ==========================================
  _updateHUD() {
    // Mode Score
    const scoreEl = document.getElementById('hud-mem-score');
    if (scoreEl) scoreEl.textContent = this.engine.score;

    // Mode Streak
    const streakEl = document.getElementById('hud-mem-streak');
    if (streakEl) streakEl.textContent = `${this.engine.streak}x`;

    // Total Lab Cumulative XP
    const totalXpEl = document.getElementById('hud-total-lab-xp');
    if (totalXpEl) totalXpEl.textContent = this.engine.totalScore;

    const titleEl = document.getElementById('hud-level-title');
    const badgeEl = document.getElementById('hud-level-difficulty');
    const scoreLabelEl = document.getElementById('hud-score-label');

    if (this.engine.activeMode === 'cable_connect') {
      const lvl = this.engine.getCurrentCableLevel();
      if (titleEl && lvl) titleEl.textContent = `Stack Master: ${lvl.title}`;
      if (badgeEl && lvl) badgeEl.textContent = lvl.difficulty;
      if (scoreLabelEl) scoreLabelEl.textContent = 'STACK MASTER SCORE:';
    } else if (this.engine.activeMode === 'leak_patrol') {
      const lvl = this.engine.getCurrentLeakLevel();
      if (titleEl && lvl) titleEl.textContent = `Heap Hunter: ${lvl.title}`;
      if (badgeEl && lvl) badgeEl.textContent = lvl.difficulty;
      if (scoreLabelEl) scoreLabelEl.textContent = 'HEAP HUNTER SCORE:';
    } else if (this.engine.activeMode === 'dereference_rush') {
      if (titleEl) titleEl.textContent = `Segfault Defuser (Hazard ${this.engine.rushIndex + 1}/${this.engine.rushChallenges.length})`;
      if (badgeEl) badgeEl.textContent = 'Arcade Rush';
      if (scoreLabelEl) scoreLabelEl.textContent = 'DEFUSER SCORE:';
    }
  },

  _toggleModePanels(mode) {
    const stage = document.getElementById('mem-stage-canvas');
    const leakMeter = document.getElementById('mem-leak-meter-container');
    const rushCard = document.getElementById('mem-rush-card-container');
    const actionsBar = document.getElementById('mem-actions-bar');
    const nextBtn = document.getElementById('btn-next-level');
    const hintBtn = document.getElementById('btn-gc-hint');

    if (nextBtn) nextBtn.style.display = 'none';
    const feedback = document.getElementById('mem-feedback');
    if (feedback) feedback.style.display = 'none';

    if (mode === 'cable_connect') {
      if (stage) stage.style.display = 'grid';
      if (leakMeter) leakMeter.style.display = 'none';
      if (rushCard) rushCard.style.display = 'none';
      if (actionsBar) actionsBar.style.display = 'flex';
      if (hintBtn) hintBtn.style.display = 'none';
    } else if (mode === 'leak_patrol') {
      if (stage) stage.style.display = 'grid';
      if (leakMeter) leakMeter.style.display = 'block';
      if (rushCard) rushCard.style.display = 'none';
      if (actionsBar) actionsBar.style.display = 'flex';
      if (hintBtn) hintBtn.style.display = 'inline-flex';
    } else if (mode === 'dereference_rush') {
      if (stage) stage.style.display = 'none';
      if (leakMeter) leakMeter.style.display = 'none';
      if (rushCard) rushCard.style.display = 'block';
      if (actionsBar) actionsBar.style.display = 'none';
    }
  },

  // ==========================================
  // RENDER CABLE CONNECT LEVEL
  // ==========================================
  _renderCableLevel(level) {
    this._clearPortSelection();
    const banner = document.getElementById('mem-feedback');
    if (banner) {
      banner.style.display = 'none';
      banner.innerHTML = '';
      banner.className = 'mem-feedback-banner';
    }
    const nextBtn = document.getElementById('btn-next-level');
    if (nextBtn) nextBtn.style.display = 'none';

    const codePre = document.getElementById('mem-code-pre');
    if (codePre) codePre.textContent = level.codeSnippet;

    const expText = document.getElementById('mem-explanation-text');
    if (expText) expText.textContent = level.explanation;

    // Render Stack column
    const stackCol = document.getElementById('mem-stack-list');
    if (stackCol) {
      stackCol.innerHTML = (level.stack || []).map(v => {
        const hasOut = v.slot === 'port-out' || v.slot === 'port-both' || (v.isPointer && !v.slot);
        const hasIn = v.slot === 'port-in' || v.slot === 'port-both';

        return `
          <div class="mem-var-card" id="card-${v.id}" data-node-id="${v.id}">
            ${hasIn ? `<button class="mem-port port-in" data-port-id="${v.id}" data-node-id="${v.id}" data-port-type="in" aria-label="Target port: ${v.name}" title="Target port: ${v.name}"></button>` : ''}
            <div class="mem-var-meta">
              <span class="mem-var-name">${v.name}</span>
              <span class="mem-var-type">${v.type}</span>
              <span class="mem-var-addr">${v.address}</span>
            </div>
            ${v.value ? `<span class="mem-var-val">${v.value}</span>` : ''}
            ${hasOut ? `<button class="mem-port port-out" data-port-id="${v.id}" data-node-id="${v.id}" data-port-type="out" aria-label="Pointer source: ${v.name}" title="Pointer source: ${v.name}"></button>` : ''}
          </div>
        `;
      }).join('');
    }

    // Render Heap column
    const heapCol = document.getElementById('mem-heap-list');
    if (heapCol) {
      heapCol.innerHTML = (level.heap || []).map(h => {
        const hasIn = h.slot === 'port-in' || h.slot === 'port-both' || !h.slot;
        const hasOut = h.slot === 'port-out' || h.slot === 'port-both';

        return `
          <div class="mem-heap-card" id="card-${h.id}" data-node-id="${h.id}">
            ${hasIn ? `<button class="mem-port port-in" data-port-id="${h.id}" data-node-id="${h.id}" data-port-type="in" aria-label="Target port ${h.address}" title="Target port: ${h.address}"></button>` : ''}
            <div class="mem-heap-meta">
              <span class="mem-heap-addr">${h.address} (${h.size})</span>
              <span class="mem-heap-label">${h.label}</span>
              <span class="mem-heap-val">${h.value}</span>
            </div>
            ${hasOut ? `<button class="mem-port port-out" data-port-id="${h.id}" data-node-id="${h.id}" data-port-type="out" aria-label="Outgoing pointer from ${h.label}" title="Outgoing pointer: ${h.label}"></button>` : ''}
          </div>
        `;
      }).join('');
    }

    this._bindPortEvents();
    this._renderCables();
  },

  // ==========================================
  // RENDER LEAK PATROL LEVEL
  // ==========================================
  _renderLeakLevel(level) {
    const codePre = document.getElementById('mem-code-pre');
    if (codePre) codePre.textContent = level.codeSnippet;

    const expText = document.getElementById('mem-explanation-text');
    if (expText) expText.textContent = level.story;

    // Stack column (root pointers)
    const stackCol = document.getElementById('mem-stack-list');
    if (stackCol) {
      stackCol.innerHTML = (level.stackRoots || []).map(v => `
        <div class="mem-var-card" id="card-${v.id}">
          <div class="mem-var-meta">
            <span class="mem-var-name">ROOT POINTER: ${v.name}</span>
            <span class="mem-var-addr">${v.address}</span>
          </div>
          <span style="font-size: 0.8rem; color: #38bdf8; font-family: monospace; font-weight: 700;">targets ➔ ${v.pointsTo}</span>
        </div>
      `).join('');
    }

    // Heap column: Note that .is-orphaned is NOT pre-applied so player has to figure it out!
    const heapCol = document.getElementById('mem-heap-list');
    if (heapCol) {
      heapCol.innerHTML = (level.heapBlocks || []).map(b => `
        <div class="mem-heap-card" id="card-${b.id}" data-block-id="${b.id}">
          <div class="mem-heap-meta">
            <span class="mem-heap-addr">${b.address} (${b.sizeBytes}B)</span>
            <span class="mem-heap-label">${b.label}</span>
            <span class="mem-heap-val">${b.type}</span>
          </div>
          <button class="mem-free-btn" data-block-id="${b.id}" aria-label="Deallocate memory block ${b.address}">
            🧹 Free Block
          </button>
        </div>
      `).join('');

      heapCol.querySelectorAll('.mem-free-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.blockId;
          this.engine.attemptReclaimBlock(id);
        });
      });
    }

    this._updateLeakMeter();
    this._clearSvg();
  },

  _updateLeakMeter() {
    const curEl = document.getElementById('leak-current-bytes');
    const maxEl = document.getElementById('leak-max-bytes');
    const barEl = document.getElementById('leak-progress-bar');

    if (curEl) curEl.textContent = `${this.engine.currentHeapBytes}B`;
    if (maxEl) maxEl.textContent = `${this.engine.maxHeapCapacity}B`;
    if (barEl) {
      const pct = Math.min(100, (this.engine.currentHeapBytes / this.engine.maxHeapCapacity) * 100);
      barEl.style.width = `${pct}%`;
      if (pct >= 85) {
        barEl.style.background = '#f43f5e';
      } else if (pct >= 60) {
        barEl.style.background = '#f59e0b';
      } else {
        barEl.style.background = '#10b981';
      }
    }
  },

  _triggerGcHintPulse() {
    const level = this.engine.getCurrentLeakLevel();
    if (!level) return;

    level.heapBlocks.forEach(b => {
      const el = document.getElementById(`card-${b.id}`);
      if (!el) return;
      if (b.isOrphaned) {
        el.style.boxShadow = '0 0 25px rgba(244, 63, 94, 0.95)';
        el.style.borderColor = '#f43f5e';
      } else {
        el.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.95)';
        el.style.borderColor = '#10b981';
      }
      setTimeout(() => {
        el.style.boxShadow = '';
        el.style.borderColor = '';
      }, 1800);
    });
  },

  // ==========================================
  // RENDER DEREFERENCE RUSH CHALLENGE
  // ==========================================
  _renderRushChallenge(challenge) {
    const container = document.getElementById('mem-rush-card-container');
    if (container && container.querySelector('.mem-rush-victory-card')) {
      // Restore standard rush UI if victory card was showing
      container.innerHTML = `
        <div class="mem-rush-timer-bar">
          <div class="mem-rush-timer-fill" id="rush-timer-fill"></div>
        </div>
        <div style="font-family: var(--font-display); font-size: 0.88rem; color: #94a3b8; margin-bottom: 1rem; text-transform: uppercase;">
          RAPID MEMORY HAZARD TRIAGE — SELECT DEREFERENCE VALIDITY
        </div>
        <div style="background: #020617; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem;">
          <pre style="margin: 0; font-family: monospace; font-size: 1.1rem; color: #38bdf8;" id="rush-code-display">${challenge.code}</pre>
        </div>
        <div id="mem-rush-feedback" class="mem-feedback-banner" style="margin-bottom: 1.5rem;"></div>
        <div class="mem-rush-options-grid">
          <button class="mem-rush-btn opt-safe" data-category="safe_dereference">
            <span>🟢 SAFE ACCESS</span>
            <span style="font-size: 11px; opacity: 0.8;">Valid memory read/write</span>
          </button>
          <button class="mem-rush-btn opt-null" data-category="null_dereference">
            <span>🟡 NULL POINTER</span>
            <span style="font-size: 11px; opacity: 0.8;">Dereferencing 0x0</span>
          </button>
          <button class="mem-rush-btn opt-dangling" data-category="dangling_pointer">
            <span>🔴 DANGLING / UAF</span>
            <span style="font-size: 11px; opacity: 0.8;">Use-After-Free</span>
          </button>
          <button class="mem-rush-btn opt-bounds" data-category="out_of_bounds">
            <span>🟣 BUFFER OVERRUN</span>
            <span style="font-size: 11px; opacity: 0.8;">Out of bounds or wild</span>
          </button>
        </div>
      `;
      // Rebind click handlers
      container.querySelectorAll('.mem-rush-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.isRushLocked) return;
          const cat = btn.dataset.category;
          this.isRushLocked = true;
          container.querySelectorAll('.mem-rush-btn').forEach(b => b.classList.add('is-disabled'));
          this.engine.submitRushAnswer(cat);
        });
      });
      return;
    }

    const codeEl = document.getElementById('rush-code-display');
    if (codeEl) codeEl.textContent = challenge.code;

    const fill = document.getElementById('rush-timer-fill');
    if (fill) {
      fill.style.width = '100%';
      fill.style.background = '#38bdf8';
    }

    const feedback = document.getElementById('mem-rush-feedback');
    if (feedback) feedback.style.display = 'none';
  },

  _renderRushCompletionScreen(stats, score, maxStreak) {
    const container = document.getElementById('mem-rush-card-container');
    if (!container) return;

    container.innerHTML = `
      <div class="mem-rush-victory-card" style="padding: 2.5rem 1rem; text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">⚡🛡️</div>
        <h2 style="font-family: var(--font-display); font-size: 1.8rem; color: #38bdf8; margin-bottom: 0.5rem;">
          SEGFAULT DEFUSER GAUNTLET CLEARED!
        </h2>
        <p style="color: #94a3b8; max-width: 520px; margin: 0 auto 1.5rem; font-size: 0.95rem; line-height: 1.5;">
          All 15 rapid-fire memory hazards triaged. You demonstrated exceptional low-level pointer hygiene and crash mitigation skills!
        </p>
        <div style="display: flex; gap: 1.25rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem;">
          <div class="card" style="padding: 0.75rem 1.25rem; background: rgba(30, 41, 59, 0.8); border-color: rgba(56, 189, 248, 0.3);">
            <span style="font-size: 11px; color: #94a3b8; display: block;">FINAL SCORE</span>
            <strong style="color: #38bdf8; font-size: 1.4rem;">${score} PTS</strong>
          </div>
          <div class="card" style="padding: 0.75rem 1.25rem; background: rgba(30, 41, 59, 0.8); border-color: rgba(16, 185, 129, 0.3);">
            <span style="font-size: 11px; color: #94a3b8; display: block;">SUCCESS ACCURACY</span>
            <strong style="color: #10b981; font-size: 1.4rem;">${Math.round((stats.correct / 15) * 100)}%</strong>
          </div>
          <div class="card" style="padding: 0.75rem 1.25rem; background: rgba(30, 41, 59, 0.8); border-color: rgba(245, 158, 11, 0.3);">
            <span style="font-size: 11px; color: #94a3b8; display: block;">PEAK STREAK</span>
            <strong style="color: #f59e0b; font-size: 1.4rem;">${maxStreak}x</strong>
          </div>
          <div class="card" style="padding: 0.75rem 1.25rem; background: rgba(30, 41, 59, 0.8); border-color: rgba(244, 63, 94, 0.3);">
            <span style="font-size: 11px; color: #94a3b8; display: block;">SEGFAULTS</span>
            <strong style="color: #f43f5e; font-size: 1.4rem;">${stats.segfaults}</strong>
          </div>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button id="btn-replay-rush" class="btn-arcade btn-primary btn-lg">
            🔄 Replay Gauntlet
          </button>
          <a href="index.html" class="btn-arcade btn-neutral btn-lg" style="text-decoration: none;">
            🏠 Return to Hub
          </a>
        </div>
      </div>
    `;

    const replayBtn = container.querySelector('#btn-replay-rush');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.engine.startDereferenceRush();
        this._playClick();
      });
    }
  },

  // ==========================================
  // CLICK-TO-CONNECT & DRAG-TO-CONNECT WIRING
  // ==========================================
  _bindPortEvents() {
    document.querySelectorAll('.mem-port').forEach(port => {
      // Click-to-connect handler
      port.addEventListener('click', (e) => {
        e.stopPropagation();
        this._onPortClick(port);
      });

      // Drag-to-connect handler
      port.addEventListener('mousedown', (e) => this._onPortDragStart(e, port));
      port.addEventListener('touchstart', (e) => this._onPortDragStart(e, port), { passive: false });
    });

    // Also allow clicking target cards when a source is selected
    document.querySelectorAll('.mem-heap-card, .mem-var-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!this.selectedSourceId) return;
        const inPort = card.querySelector('.mem-port[data-port-type="in"]');
        if (inPort && e.target !== inPort) {
          this._onPortClick(inPort);
        }
      });
    });
  },

  _onPortClick(port) {
    const portId = port.dataset.portId;
    const portType = port.dataset.portType;

    if (!this.selectedSourceId) {
      // Step 1: User selects a source OUT port
      if (portType === 'out') {
        this.selectedSourceId = portId;
        this._highlightSelectedPort(port);
        this._playClick();
        this._showWireHelper(`Wiring from ${portId}... Click a destination port (purple) to plug in cable.`);
      } else {
        this._showWireHelper(`Click a pointer output port (cyan) on the right side of a variable first!`, true);
      }
    } else {
      // Step 2: User selects a destination
      if (portId === this.selectedSourceId && portType === 'out') {
        // Deselect
        this._clearPortSelection();
        this._playClick();
        this._showWireHelper('');
      } else if (portType === 'in') {
        // Connect!
        this.engine.addConnection(this.selectedSourceId, portId);
        this._clearPortSelection();
        this._playSnap();
        this._showWireHelper('');
      } else if (portType === 'out') {
        // Switched source
        this.selectedSourceId = portId;
        this._highlightSelectedPort(port);
        this._playClick();
        this._showWireHelper(`Switched source to ${portId}. Click a destination port (purple) to plug in cable.`);
      }
    }
  },

  _highlightSelectedPort(port) {
    this._clearPortSelection(false);
    if (port) {
      port.classList.add('is-connecting');
      const card = port.closest('.mem-var-card, .mem-heap-card');
      if (card) card.classList.add('is-connecting');
    }
  },

  _clearPortSelection(resetId = true) {
    if (resetId) this.selectedSourceId = null;
    document.querySelectorAll('.mem-port.is-connecting, .mem-var-card.is-connecting, .mem-heap-card.is-connecting')
      .forEach(el => el.classList.remove('is-connecting'));
  },

  _showWireHelper(msg, isWarning = false) {
    const banner = document.getElementById('mem-feedback');
    if (!banner) return;
    if (!msg) {
      banner.style.display = 'none';
      return;
    }
    banner.style.display = 'block';
    banner.className = isWarning ? 'mem-feedback-banner is-error' : 'mem-feedback-banner is-success';
    banner.textContent = msg;
  },

  _onPortDragStart(e, port) {
    const portType = port.dataset.portType;
    if (portType !== 'out') return; // Only drag FROM output ports

    e.stopPropagation();
    const portId = port.dataset.portId;
    const stage = document.getElementById('mem-stage-canvas');
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const portRect = port.getBoundingClientRect();
    const startX = (portRect.left + portRect.width / 2) - rect.left;
    const startY = (portRect.top + portRect.height / 2) - rect.top;

    this.activeDrag = {
      fromId: portId,
      startX,
      startY,
      currentX: startX,
      currentY: startY
    };

    this._playClick();
  },

  _onPointerMove(e) {
    if (!this.activeDrag) return;
    const stage = document.getElementById('mem-stage-canvas');
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    this.activeDrag.currentX = e.clientX - rect.left;
    this.activeDrag.currentY = e.clientY - rect.top;

    this._renderCables();
  },

  _onTouchMove(e) {
    if (!this.activeDrag) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;

    const stage = document.getElementById('mem-stage-canvas');
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    this.activeDrag.currentX = touch.clientX - rect.left;
    this.activeDrag.currentY = touch.clientY - rect.top;

    this._renderCables();
  },

  _onPointerUp(e) {
    if (!this.activeDrag) return;

    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0]?.clientX);
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0]?.clientY);

    let targetPortId = null;
    if (clientX && clientY) {
      const el = document.elementFromPoint(clientX, clientY);
      if (el) {
        const portEl = el.closest('.mem-port[data-port-type="in"]');
        if (portEl) {
          targetPortId = portEl.dataset.portId;
        } else {
          // Generous hit box: allow dropping anywhere on target card
          const cardEl = el.closest('[data-node-id]');
          if (cardEl) {
            const inPort = cardEl.querySelector('.mem-port[data-port-type="in"]');
            if (inPort) targetPortId = inPort.dataset.portId;
          }
        }
      }
    }

    if (targetPortId && targetPortId !== this.activeDrag.fromId) {
      this.engine.addConnection(this.activeDrag.fromId, targetPortId);
    }

    this.activeDrag = null;
    this._renderCables();
  },

  // ==========================================
  // SVG CABLE RENDERING MATH
  // ==========================================
  _renderCables() {
    const svg = document.getElementById('memory-cables-svg');
    if (!svg) return;

    const stage = document.getElementById('mem-stage-canvas');
    if (!stage) return;
    const rect = stage.getBoundingClientRect();

    let pathsHtml = '';

    // Render active saved connections
    for (const conn of this.engine.userConnections) {
      const fromEl = document.querySelector(`.mem-port[data-port-id="${conn.from}"][data-port-type="out"]`) ||
                     document.querySelector(`.mem-port[data-port-id="${conn.from}"]`);
      const toEl = document.querySelector(`.mem-port[data-port-id="${conn.to}"][data-port-type="in"]`) ||
                   document.querySelector(`.mem-port[data-port-id="${conn.to}"]`);

      if (fromEl && toEl) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = (fromRect.left + fromRect.width / 2) - rect.left;
        const y1 = (fromRect.top + fromRect.height / 2) - rect.top;
        const x2 = (toRect.left + toRect.width / 2) - rect.left;
        const y2 = (toRect.top + toRect.height / 2) - rect.top;

        let pathData;
        if (Math.abs(x2 - x1) < 80) {
          // Intra-column loop (stack-to-stack or heap-to-heap)
          const arcOffset = 65;
          pathData = `M ${x1} ${y1} C ${x1 + arcOffset} ${y1}, ${x2 + arcOffset} ${y2}, ${x2} ${y2}`;
        } else {
          // Cross-column smooth S-curve
          const dx = Math.abs(x2 - x1) * 0.55;
          pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        }

        pathsHtml += `
          <g class="cable-group" data-from="${conn.from}" data-to="${conn.to}">
            <path class="cable-hitbox" d="${pathData}" data-from="${conn.from}" data-to="${conn.to}"></path>
            <path class="cable-wire" d="${pathData}" data-from="${conn.from}" data-to="${conn.to}"></path>
          </g>
        `;
      }
    }

    // Render in-progress drag cable
    if (this.activeDrag) {
      const x1 = this.activeDrag.startX;
      const y1 = this.activeDrag.startY;
      const x2 = this.activeDrag.currentX;
      const y2 = this.activeDrag.currentY;

      const dx = Math.abs(x2 - x1) * 0.5;
      const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

      pathsHtml += `
        <path class="cable-wire is-dragging" d="${pathData}"></path>
      `;
    }

    svg.innerHTML = pathsHtml;

    // Attach click-to-disconnect on active cables
    svg.querySelectorAll('.cable-group').forEach(group => {
      group.addEventListener('click', () => {
        const from = group.dataset.from;
        const to = group.dataset.to;
        this.engine.removeConnection(from, to);
      });
    });
  },

  _highlightValidCables(isValid) {
    const svg = document.getElementById('memory-cables-svg');
    if (!svg) return;
    svg.querySelectorAll('.cable-wire').forEach(wire => {
      wire.classList.toggle('is-valid', isValid);
      wire.classList.toggle('is-error', !isValid);
    });
  },

  _clearSvg() {
    const svg = document.getElementById('memory-cables-svg');
    if (svg) svg.innerHTML = '';
  },

  // ==========================================
  // PROCEDURAL AUDIO FEEDBACK
  // ==========================================
  _getContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      if (!this._audioCtx) this._audioCtx = new AudioCtx();
      if (this._audioCtx.state === 'suspended') this._audioCtx.resume().catch(() => {});
      return this._audioCtx;
    }
    return null;
  },

  _playClick() {
    try {
      if (typeof AudioEngine !== 'undefined' && typeof AudioEngine.playClick === 'function') {
        AudioEngine.playClick('memory');
        return;
      }
      const ctx = this._getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.015);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.018);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch (_) {}
  },

  _playSnap() {
    try {
      const ctx = this._getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch (_) {}
  },

  _playChime() {
    try {
      const ctx = this._getContext();
      if (!ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.28);
      });
    } catch (_) {}
  },

  _playBuzzer() {
    try {
      const ctx = this._getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (_) {}
  }
};

if (typeof window !== 'undefined') {
  window.MemoryMinigameController = MemoryMinigameController;
  const bootMemoryController = () => {
    if (document.body && document.body.dataset.page === 'memory-games') {
      if (!MemoryMinigameController.engine) {
        MemoryMinigameController.init();
      }
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootMemoryController);
  } else {
    bootMemoryController();
  }
}
