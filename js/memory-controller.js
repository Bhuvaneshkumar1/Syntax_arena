/**
 * SyntaxArena Feature 8: Tactile Memory Pointer Minigames Controller
 * Coordinates UI rendering, SVG bezier cable drag math, audio feedback,
 * and game state events for memory-games.html.
 */

import { MemoryMinigameEngine } from './memory-minigame.js';
import { CABLE_CONNECT_LEVELS, LEAK_PATROL_LEVELS, DEREFERENCE_RUSH_CHALLENGES } from '../data/memory-levels.js';

export const MemoryMinigameController = {
  engine: null,
  activeDrag: null,

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
  },

  _bindDOMEvents() {
    // Mode tabs
    document.querySelectorAll('.mem-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.dataset.mode;
        document.querySelectorAll('.mem-mode-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.engine.setMode(mode);
        this._playClick();
      });
    });

    // Cable Connect Action buttons
    const btnCheckWiring = document.getElementById('btn-check-wiring');
    if (btnCheckWiring) {
      btnCheckWiring.addEventListener('click', () => {
        this.engine.validateCableWiring();
      });
    }

    const btnClearCables = document.getElementById('btn-clear-cables');
    if (btnClearCables) {
      btnClearCables.addEventListener('click', () => {
        this.engine.clearConnections();
        this._renderCables();
        this._playClick();
      });
    }

    const btnNextLevel = document.getElementById('btn-next-level');
    if (btnNextLevel) {
      btnNextLevel.addEventListener('click', () => {
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

    // Dereference Rush category buttons
    document.querySelectorAll('.mem-rush-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        this.engine.submitRushAnswer(cat);
      });
    });

    // SVG Drag listeners on interactive stage
    const stage = document.getElementById('mem-stage-canvas');
    if (stage) {
      window.addEventListener('mousemove', (e) => this._onPointerMove(e));
      window.addEventListener('mouseup', (e) => this._onPointerUp(e));
      window.addEventListener('touchmove', (e) => this._onTouchMove(e), { passive: false });
      window.addEventListener('touchend', (e) => this._onPointerUp(e));
      window.addEventListener('resize', () => this._renderCables());
    }
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
    });

    this.engine.on('cableRemoved', () => {
      this._renderCables();
      this._playClick();
    });

    this.engine.on('cableWiringValidated', (result) => {
      const banner = document.getElementById('mem-feedback');
      const nextBtn = document.getElementById('btn-next-level');

      if (result.valid) {
        banner.className = 'mem-feedback-banner is-success';
        banner.textContent = `⚡ ${result.feedback} (+${result.scoreAwarded} PTS)`;
        if (nextBtn) nextBtn.style.display = 'inline-flex';
        this._playChime();
      } else {
        banner.className = 'mem-feedback-banner is-error';
        banner.textContent = `❌ ${result.feedback}`;
        if (nextBtn) nextBtn.style.display = 'none';
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

    this.engine.on('leakLevelCompleted', ({ level }) => {
      const nextBtn = document.getElementById('btn-next-level');
      if (nextBtn) nextBtn.style.display = 'inline-flex';
    });

    this.engine.on('rushChallengeLoaded', ({ challenge, index, total, secondsRemaining }) => {
      this._renderRushChallenge(challenge, index, total);
      this._updateHUD();
    });

    this.engine.on('rushTimerTick', ({ secondsRemaining }) => {
      const fill = document.getElementById('rush-timer-fill');
      if (fill) {
        const pct = Math.max(0, (secondsRemaining / 12) * 100);
        fill.style.width = `${pct}%`;
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

      // Proceed after 2.2 seconds
      setTimeout(() => {
        if (banner) banner.style.display = 'none';
        this.engine.proceedToNextRushChallenge();
      }, 2200);
    });
  },

  // ==========================================
  // HUD & PANELS
  // ==========================================
  _updateHUD() {
    const scoreEl = document.getElementById('hud-mem-score');
    if (scoreEl) scoreEl.textContent = this.engine.score;

    const streakEl = document.getElementById('hud-mem-streak');
    if (streakEl) streakEl.textContent = `${this.engine.streak}x`;

    const titleEl = document.getElementById('hud-level-title');
    const badgeEl = document.getElementById('hud-level-difficulty');

    if (this.engine.activeMode === 'cable_connect') {
      const lvl = this.engine.getCurrentCableLevel();
      if (lvl && titleEl) titleEl.textContent = `Stack Master: ${lvl.title}`;
      if (lvl && badgeEl) badgeEl.textContent = lvl.difficulty;
    } else if (this.engine.activeMode === 'leak_patrol') {
      const lvl = this.engine.getCurrentLeakLevel();
      if (lvl && titleEl) titleEl.textContent = `Heap Hunter: ${lvl.title}`;
      if (lvl && badgeEl) badgeEl.textContent = lvl.difficulty;
    } else if (this.engine.activeMode === 'dereference_rush') {
      if (titleEl) titleEl.textContent = `Segfault Defuser (Challenge ${this.engine.rushIndex + 1}/${this.engine.rushChallenges.length})`;
      if (badgeEl) badgeEl.textContent = 'Arcade Rush';
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
  _renderCableLevel(level, index) {
    const codePre = document.getElementById('mem-code-pre');
    if (codePre) codePre.textContent = level.codeSnippet;

    const expText = document.getElementById('mem-explanation-text');
    if (expText) expText.textContent = level.explanation;

    // Stack column
    const stackCol = document.getElementById('mem-stack-list');
    if (stackCol) {
      stackCol.innerHTML = (level.stack || []).map(v => `
        <div class="mem-var-card" id="card-${v.id}">
          <div class="mem-var-meta">
            <span class="mem-var-name">${v.name}</span>
            <span class="mem-var-type">${v.type}</span>
            <span class="mem-var-addr">${v.address}</span>
          </div>
          ${v.isPointer ? `<button class="mem-port port-out" data-port-id="${v.id}" aria-label="Connect pointer wire from ${v.name}"></button>` : `<span style="font-family: monospace; font-size: 0.85rem; color: #94a3b8;">${v.value || ''}</span>`}
        </div>
      `).join('');
    }

    // Heap column
    const heapCol = document.getElementById('mem-heap-list');
    if (heapCol) {
      heapCol.innerHTML = (level.heap || []).map(h => `
        <div class="mem-heap-card" id="card-${h.id}">
          <button class="mem-port port-in" data-port-id="${h.id}" aria-label="Route pointer wire to heap block ${h.address}"></button>
          <div class="mem-heap-meta">
            <span class="mem-heap-addr">${h.address} (${h.size})</span>
            <span class="mem-heap-label">${h.label}</span>
            <span class="mem-heap-val">${h.value}</span>
          </div>
        </div>
      `).join('');
    }

    this._bindPortEvents();
    this._renderCables();
  },

  // ==========================================
  // RENDER LEAK PATROL LEVEL
  // ==========================================
  _renderLeakLevel(level, index) {
    const codePre = document.getElementById('mem-code-pre');
    if (codePre) codePre.textContent = level.codeSnippet;

    const expText = document.getElementById('mem-explanation-text');
    if (expText) expText.textContent = level.story;

    // Stack column (roots)
    const stackCol = document.getElementById('mem-stack-list');
    if (stackCol) {
      stackCol.innerHTML = (level.stackRoots || []).map(v => `
        <div class="mem-var-card" id="card-${v.id}">
          <div class="mem-var-meta">
            <span class="mem-var-name">ROOT: ${v.name}</span>
            <span class="mem-var-addr">${v.address}</span>
          </div>
          <span style="font-size: 0.75rem; color: #38bdf8; font-family: monospace;">points to -> ${v.pointsTo}</span>
        </div>
      `).join('');
    }

    // Heap column with Free buttons
    const heapCol = document.getElementById('mem-heap-list');
    if (heapCol) {
      heapCol.innerHTML = (level.heapBlocks || []).map(b => `
        <div class="mem-heap-card ${b.isOrphaned ? 'is-orphaned' : ''}" id="card-${b.id}">
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
    }
  },

  _triggerGcHintPulse() {
    const level = this.engine.getCurrentLeakLevel();
    if (!level) return;

    level.heapBlocks.forEach(b => {
      const el = document.getElementById(`card-${b.id}`);
      if (!el) return;
      if (b.isOrphaned) {
        el.style.boxShadow = '0 0 25px rgba(244, 63, 94, 0.9)';
      } else {
        el.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.9)';
      }
      setTimeout(() => {
        el.style.boxShadow = '';
      }, 1600);
    });
  },

  // ==========================================
  // RENDER DEREFERENCE RUSH CHALLENGE
  // ==========================================
  _renderRushChallenge(challenge, index, total) {
    const codeEl = document.getElementById('rush-code-display');
    if (codeEl) codeEl.textContent = challenge.code;

    const fill = document.getElementById('rush-timer-fill');
    if (fill) fill.style.width = '100%';

    const feedback = document.getElementById('mem-rush-feedback');
    if (feedback) feedback.style.display = 'none';
  },

  // ==========================================
  // SVG BEZIER CABLE DRAG & DRAW MATH
  // ==========================================
  _bindPortEvents() {
    document.querySelectorAll('.mem-port').forEach(port => {
      port.addEventListener('mousedown', (e) => this._onPortStart(e, port));
      port.addEventListener('touchstart', (e) => this._onPortStart(e, port), { passive: false });
    });
  },

  _onPortStart(e, port) {
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

    // Detect if mouse released over a target port
    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0]?.clientX);
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0]?.clientY);

    let targetPortId = null;
    if (clientX && clientY) {
      const el = document.elementFromPoint(clientX, clientY);
      if (el && el.classList.contains('mem-port')) {
        targetPortId = el.dataset.portId;
      }
    }

    if (targetPortId && targetPortId !== this.activeDrag.fromId) {
      this.engine.addConnection(this.activeDrag.fromId, targetPortId);
    }

    this.activeDrag = null;
    this._renderCables();
  },

  _renderCables() {
    const svg = document.getElementById('memory-cables-svg');
    if (!svg) return;

    const stage = document.getElementById('mem-stage-canvas');
    if (!stage) return;
    const rect = stage.getBoundingClientRect();

    let pathsHtml = '';

    // Render active connections
    for (const conn of this.engine.userConnections) {
      const fromEl = document.querySelector(`.mem-port[data-port-id="${conn.from}"]`);
      const toEl = document.querySelector(`.mem-port[data-port-id="${conn.to}"]`);

      if (fromEl && toEl) {
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = (fromRect.left + fromRect.width / 2) - rect.left;
        const y1 = (fromRect.top + fromRect.height / 2) - rect.top;
        const x2 = (toRect.left + toRect.width / 2) - rect.left;
        const y2 = (toRect.top + toRect.height / 2) - rect.top;

        // Smooth cubic bezier with horizontal tension
        const dx = Math.abs(x2 - x1) * 0.55;
        const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

        pathsHtml += `
          <path class="cable-wire" d="${pathData}" data-from="${conn.from}" data-to="${conn.to}"></path>
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
    svg.querySelectorAll('.cable-wire:not(.is-dragging)').forEach(path => {
      path.addEventListener('click', () => {
        const from = path.dataset.from;
        const to = path.dataset.to;
        this.engine.removeConnection(from, to);
      });
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
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'memory-games') {
      MemoryMinigameController.init();
    }
  });
}
