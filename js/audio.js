/**
 * SyntaxArena Procedural Audio & Music Engine
 * Real-time sound effects and procedural ambient background music via native Web Audio API.
 * Zero external libraries or runtime downloads.
 * Source of truth: docs/ARCHITECTURE.md & docs/DESIGN_SYSTEM.md & docs/BATCH_8_PLAN.md
 */

import { State } from './state.js';

class ProceduralAudioEngine {
  constructor() {
    this._ctx = null;
    this._isUnlocked = false;
    this._musicPlaying = false;
    this._musicGain = null;
    this._activeMusicNodes = [];
    this._musicInterval = null;
    this._musicChordIndex = 0;
  }

  /**
   * Lazily obtain or initialize the AudioContext upon user gesture.
   */
  _getContext() {
    if (typeof window === 'undefined') return null;
    if (!this._ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this._ctx = new AudioCtx();
        } catch (_) {
          this._ctx = null;
        }
      }
    }
    if (this._ctx && this._ctx.state === 'suspended') {
      this._ctx.resume().catch(() => {});
    }
    return this._ctx;
  }

  /**
   * Get current SFX volume scaling factor from settings.
   * Returns 0 if sound is explicitly disabled or volume is 0.
   */
  _getVolume() {
    try {
      const settings = State.get('settings') || {};
      if (settings.soundEnabled === false) return 0;
      return typeof settings.sfxVolume === 'number' ? Math.max(0, Math.min(1, settings.sfxVolume)) : 0.8;
    } catch (_) {
      return 0.8;
    }
  }

  /**
   * Get current background music volume from settings.
   * Returns 0 if music is disabled or volume is 0.
   */
  _getMusicVolume() {
    try {
      const settings = State.get('settings') || {};
      if (!settings.musicEnabled) return 0;
      return typeof settings.musicVolume === 'number' ? Math.max(0, Math.min(1, settings.musicVolume)) : 0.5;
    } catch (_) {
      return 0;
    }
  }

  /**
   * Unlock AudioContext on first user interaction.
   */
  unlock() {
    if (this._isUnlocked) return;
    const ctx = this._getContext();
    if (ctx) {
      this._isUnlocked = true;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    }
  }

  /**
   * Fallback audio file player using HTML5 Audio element.
   * @param {string} filename
   */
  _playWav(filename) {
    if (typeof Audio === 'undefined') return;
    try {
      const vol = this._getVolume();
      if (vol <= 0) return;
      const audio = new Audio(`assets/audio/${filename}`);
      audio.volume = vol;
      audio.play().catch(() => {});
    } catch (_) {}
  }

  /* ==========================================================================
     SOUND EFFECTS (SFX)
     ========================================================================== */

  /**
   * Tactile mechanical switch click with mode-specific acoustic profiles (Item 4).
   * @param {'default'|'boss'|'duel'|'memory'} [variant='default']
   */
  playClick(variant = 'default') {
    const vol = this._getVolume();
    if (vol <= 0) return;

    if (variant === 'default' && typeof window !== 'undefined' && window.BattlestationEngine && typeof window.BattlestationEngine.playSwitchSound === 'function') {
      window.BattlestationEngine.playSwitchSound(null, vol);
      return;
    }

    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      if (variant === 'boss') {
        // Heavy industrial punch + hydraulic sub-thump
        const punchOsc = ctx.createOscillator();
        const punchGain = ctx.createGain();
        punchOsc.type = 'sawtooth';
        punchOsc.frequency.setValueAtTime(450, now);
        punchOsc.frequency.exponentialRampToValueAtTime(110, now + 0.022);
        punchGain.gain.setValueAtTime(vol * 0.45, now);
        punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        punchOsc.connect(punchGain);
        punchGain.connect(ctx.destination);
        punchOsc.start(now);
        punchOsc.stop(now + 0.028);

        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(120, now);
        subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.045);
        subGain.gain.setValueAtTime(vol * 0.4, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.048);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.05);
        return;
      }

      if (variant === 'duel') {
        // High-tech plasma laser chirp
        const laserOsc = ctx.createOscillator();
        const laserGain = ctx.createGain();
        laserOsc.type = 'sine';
        laserOsc.frequency.setValueAtTime(2800, now);
        laserOsc.frequency.exponentialRampToValueAtTime(480, now + 0.016);
        laserGain.gain.setValueAtTime(vol * 0.32, now);
        laserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);
        laserOsc.connect(laserGain);
        laserGain.connect(ctx.destination);
        laserOsc.start(now);
        laserOsc.stop(now + 0.02);
        return;
      }

      if (variant === 'memory') {
        // Crystalline glass droplet tap
        const glassOsc = ctx.createOscillator();
        const glassGain = ctx.createGain();
        glassOsc.type = 'sine';
        glassOsc.frequency.setValueAtTime(1600, now);
        glassOsc.frequency.exponentialRampToValueAtTime(750, now + 0.02);
        glassGain.gain.setValueAtTime(vol * 0.25, now);
        glassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        glassOsc.connect(glassGain);
        glassGain.connect(ctx.destination);
        glassOsc.start(now);
        glassOsc.stop(now + 0.028);
        return;
      }

      // 1. Transient click snap (1800Hz -> 700Hz in 8ms)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(1800, now);
      snapOsc.frequency.exponentialRampToValueAtTime(700, now + 0.008);

      snapGain.gain.setValueAtTime(vol * 0.35, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.015);

      // 2. Tactile chamber body resonance (260Hz -> 90Hz in 25ms)
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(260, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(90, now + 0.025);

      bodyGain.gain.setValueAtTime(vol * 0.28, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.032);
    } catch (_) {}
  }

  /**
   * Subtle cyber hover micro-tick (4ms transient tick at 850Hz).
   */
  playHover() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.008);

      gain.gain.setValueAtTime(vol * 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.01);
    } catch (_) {}
  }

  /**
   * Correct Answer Chime (Ascending two-tone bell chord).
   */
  playSuccess() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: C6 (1046.5 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now);
      gain1.gain.setValueAtTime(vol * 0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Note 2: G6 (1567.98 Hz) delayed by 60ms
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1567.98, now + 0.06);
      gain2.gain.setValueAtTime(vol * 0.35, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.35);
    } catch (_) {}
  }

  /**
   * Incorrect Answer Buzz (Low discordant sawtooth with filter).
   */
  playError() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(95, now + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(vol * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (_) {}
  }

  /**
   * Streak Multiplier Increase (Rising whoosh with resonance).
   */
  playStreak() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.2);

      gain.gain.setValueAtTime(vol * 0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } catch (_) {}
  }

  /**
   * Hint Activated Ping (Subtle soft tone).
   */
  playHint() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

      gain.gain.setValueAtTime(vol * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (_) {}
  }

  /**
   * Victory Fanfare (Ascending major 4-note victory flourish).
   */
  playFanfare() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.09);
        const dur = idx === 3 ? 0.45 : 0.12;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(vol * 0.35, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    } catch (_) {}
  }

  /**
   * Level Up / Rank Progression Fanfare (Triumphant brass-like 5-note ceremonial chord).
   */
  playLevelUp() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      // C4 (261.63), G4 (392.00), C5 (523.25), E5 (659.25), G5 (783.99)
      const notes = [261.63, 392.00, 523.25, 659.25, 783.99];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.08);
        const dur = idx === 4 ? 0.6 : 0.16;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(vol * 0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    } catch (_) {}
  }

  /**
   * Achievement Badge Unlock Chime (Sparkling 4-note ascending chime).
   */
  playBadge() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      // E6 (1318.5), G#6 (1661.2), B6 (1975.5), E7 (2637.0)
      const notes = [1318.5, 1661.2, 1975.5, 2637.0];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.07);
        const dur = idx === 3 ? 0.35 : 0.14;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(vol * 0.28, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    } catch (_) {}
  }

  /**
   * XP Reward Ticker Sound (Ascending micro-tone progression).
   */
  playXP() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const frequencies = [600, 750, 900, 1050];
      const now = ctx.currentTime;

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.04);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(vol * 0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.09);
      });
    } catch (_) {}
  }

  /**
   * Micro-tick for numeric counters rolling up.
   */
  playCount() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(vol * 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.02);
    } catch (_) {}
  }

  /* ==========================================================================
     PROCEDURAL AMBIENT BACKGROUND MUSIC
     Calming, lo-fi cyber chord ambient synthesizer with zero external assets.
     ========================================================================== */

  /**
   * Check whether background music is actively playing.
   * @returns {boolean}
   */
  isMusicPlaying() {
    return this._musicPlaying;
  }

  /**
   * Return currently playing music mode ('normal', 'boss', 'duel', 'memory').
   * @returns {string}
   */
  getMusicMode() {
    return this._musicMode || 'normal';
  }

  /**
   * Start procedural background music with mode-specific musical character (Item 4).
   * Modes supported:
   * - 'normal': Ambient lo-fi cyber pads (Dm7 -> G7 -> Cmaj7 -> Am7)
   * - 'boss': Driving industrial Phrygian bass synth (sawtooth + resonant sub-pulse)
   * - 'duel': High-tension cyber arpeggiator (16th-note staccato synth pulse at 135 BPM)
   * - 'memory': Meditative crystalline bell pads (pentatonic ethereal chimes)
   * @param {'normal'|'boss'|'duel'|'memory'} [mode='normal']
   */
  startMusic(mode = 'normal') {
    const vol = this._getMusicVolume();
    if (vol <= 0) {
      this.stopMusic();
      return;
    }

    // If already playing the requested mode, just update volume
    if (this._musicPlaying && this._musicMode === mode) {
      this.setMusicVolume(vol);
      return;
    }

    // If changing mode while playing, stop existing loops smoothly
    if (this._musicPlaying && this._musicMode !== mode) {
      this.stopMusic();
    }

    const ctx = this._getContext();
    if (!ctx) return;

    try {
      this._musicPlaying = true;
      this._musicMode = mode;
      this._musicChordIndex = 0;

      // Master music gain node
      this._musicGain = ctx.createGain();
      this._musicGain.gain.setValueAtTime(vol * 0.12, ctx.currentTime);
      this._musicGain.connect(ctx.destination);

      if (mode === 'boss') {
        // --- MODE 2: BOSS OVERDRIVE (Industrial Phrygian Bass Synth) ---
        // Heavy Phrygian bass loop: E2 (82.4Hz), G2 (98.0Hz), F2 (87.3Hz), B1 (61.7Hz)
        const bassNotes = [82.4, 82.4, 98.0, 87.3, 82.4, 82.4, 61.7, 87.3];
        let stepIdx = 0;

        const playBossBeat = () => {
          if (!this._musicPlaying || !this._ctx || this._ctx.state === 'closed' || this._musicMode !== 'boss') return;
          const freq = bassNotes[stepIdx % bassNotes.length];
          stepIdx++;

          const now = this._ctx.currentTime;
          const dur = 0.28;

          try {
            // Aggressive saw bass
            const osc = this._ctx.createOscillator();
            const filter = this._ctx.createBiquadFilter();
            const gain = this._ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(420, now);
            filter.frequency.exponentialRampToValueAtTime(140, now + dur);
            filter.Q.setValueAtTime(4.5, now);

            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this._musicGain);

            osc.start(now);
            osc.stop(now + dur + 0.05);
          } catch (_) {}
        };

        playBossBeat();
        if (this._musicInterval) clearInterval(this._musicInterval);
        this._musicInterval = setInterval(playBossBeat, 320); // ~94 BPM 8th-note pulse
        return;
      }

      if (mode === 'duel') {
        // --- MODE 3: 1v1 DUEL (High-Tension Cyber Arpeggiator at 135 BPM) ---
        // Staccato 16th-note sequence: A3 (220Hz), C4 (261.6Hz), E4 (329.6Hz), G4 (392Hz), A4 (440Hz), G4, E4, C4
        const arpNotes = [220.0, 261.6, 329.6, 392.0, 440.0, 392.0, 329.6, 261.6];
        let arpIdx = 0;

        const playDuelStep = () => {
          if (!this._musicPlaying || !this._ctx || this._ctx.state === 'closed' || this._musicMode !== 'duel') return;
          const freq = arpNotes[arpIdx % arpNotes.length];
          arpIdx++;

          const now = this._ctx.currentTime;
          const dur = 0.16;

          try {
            const osc = this._ctx.createOscillator();
            const filter = this._ctx.createBiquadFilter();
            const gain = this._ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(900, now);
            filter.Q.setValueAtTime(2.5, now);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this._musicGain);

            osc.start(now);
            osc.stop(now + dur + 0.03);
          } catch (_) {}
        };

        playDuelStep();
        if (this._musicInterval) clearInterval(this._musicInterval);
        this._musicInterval = setInterval(playDuelStep, 222); // 135 BPM 16th-notes
        return;
      }

      if (mode === 'memory') {
        // --- MODE 4: TACTILE MEMORY LAB (Meditative Ethereal Crystal Chimes) ---
        // Pentatonic bells: E4 (329.6), G#4 (415.3), B4 (493.9), D#5 (622.3), F#5 (739.9)
        const chimeChords = [
          [329.6, 493.9, 622.3],
          [415.3, 622.3, 739.9],
          [329.6, 415.3, 493.9]
        ];

        const playMemoryChime = () => {
          if (!this._musicPlaying || !this._ctx || this._ctx.state === 'closed' || this._musicMode !== 'memory') return;
          const chord = chimeChords[this._musicChordIndex % chimeChords.length];
          this._musicChordIndex++;

          const now = this._ctx.currentTime;
          const duration = 4.8;

          chord.forEach((freq, idx) => {
            try {
              const osc = this._ctx.createOscillator();
              const gain = this._ctx.createGain();
              const delay = idx * 0.15;

              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + delay);

              gain.gain.setValueAtTime(0.001, now + delay);
              gain.gain.linearRampToValueAtTime(0.14, now + delay + 0.8);
              gain.gain.linearRampToValueAtTime(0.001, now + delay + duration);

              osc.connect(gain);
              gain.connect(this._musicGain);

              osc.start(now + delay);
              osc.stop(now + delay + duration + 0.2);
            } catch (_) {}
          });
        };

        playMemoryChime();
        if (this._musicInterval) clearInterval(this._musicInterval);
        this._musicInterval = setInterval(playMemoryChime, 4600);
        return;
      }

      // --- MODE 1: NORMAL ARENA (Ambient Cyber Chord Progression) ---
      const chords = [
        [146.8, 220.0, 261.6],
        [98.0, 174.6, 246.9],
        [130.8, 196.0, 246.9],
        [110.0, 164.8, 261.6]
      ];

      const playChord = () => {
        if (!this._musicPlaying || !this._ctx || this._ctx.state === 'closed' || this._musicMode !== 'normal') return;
        const currentChord = chords[this._musicChordIndex % chords.length];
        this._musicChordIndex++;

        const now = this._ctx.currentTime;
        const duration = 4.0; // 4 seconds per chord cycle

        currentChord.forEach(freq => {
          try {
            const osc = this._ctx.createOscillator();
            const filter = this._ctx.createBiquadFilter();
            const gain = this._ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            // Gentle lowpass filter for warm, rounded ambient pad sound
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(380, now);

            // Gentle attack and release envelope
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 1.2);
            gain.gain.linearRampToValueAtTime(0.001, now + duration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this._musicGain);

            osc.start(now);
            osc.stop(now + duration + 0.1);
          } catch (_) {}
        });
      };

      // Play initial chord immediately
      playChord();

      // Loop every 3.8 seconds for smooth chord crossfade
      if (this._musicInterval) clearInterval(this._musicInterval);
      this._musicInterval = setInterval(() => {
        if (this._musicPlaying && this._musicMode === 'normal') {
          playChord();
        } else {
          clearInterval(this._musicInterval);
          this._musicInterval = null;
        }
      }, 3800);

    } catch (err) {
      console.warn('[AudioEngine] Could not start ambient music:', err);
      this._musicPlaying = false;
    }
  }

  /**
   * Stop background music smoothly.
   */
  stopMusic() {
    this._musicPlaying = false;
    if (this._musicInterval) {
      clearInterval(this._musicInterval);
      this._musicInterval = null;
    }

    if (this._musicGain && this._ctx) {
      try {
        const now = this._ctx.currentTime;
        this._musicGain.gain.setValueAtTime(this._musicGain.gain.value, now);
        this._musicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        setTimeout(() => {
          if (!this._musicPlaying && this._musicGain) {
            try {
              this._musicGain.disconnect();
            } catch (_) {}
            this._musicGain = null;
          }
        }, 250);
      } catch (_) {
        this._musicGain = null;
      }
    }
  }

  /**
   * Set music volume dynamically in real time.
   * @param {number} vol (0.0 to 1.0)
   */
  setMusicVolume(vol) {
    const safeVol = Math.max(0, Math.min(1, vol));
    if (this._musicGain && this._ctx) {
      try {
        const now = this._ctx.currentTime;
        this._musicGain.gain.setValueAtTime(safeVol * 0.12, now);
      } catch (_) {}
    }
    if (safeVol <= 0 && this._musicPlaying) {
      this.stopMusic();
    } else if (safeVol > 0 && !this._musicPlaying) {
      this.startMusic();
    }
  }
  /**
   * Mega-Boss Battle Sounds (Daemon Incursion)
   */

  /**
   * Boss Battle Alert / Intro Siren
   */
  playBossAlert() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);

      gain.gain.setValueAtTime(vol * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    } catch (_) {}
  }

  /**
   * Boss Damaged / Critical Strike Hit
   */
  playBossHit() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.18);

      gain.gain.setValueAtTime(vol * 0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch (_) {}
  }

  /**
   * Boss Glitch Attack Static Burst
   */
  playBossGlitch() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.linearRampToValueAtTime(200, now + 0.08);
      osc.frequency.linearRampToValueAtTime(1800, now + 0.18);
      osc.frequency.linearRampToValueAtTime(300, now + 0.28);

      gain.gain.setValueAtTime(vol * 0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (_) {}
  }

  /**
   * Boss Enrage Roar (Phase 2 Overclock)
   */
  playBossRoar() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.6);

      gain.gain.setValueAtTime(vol * 0.42, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch (_) {}
  }

  /**
   * Boss Defeated Victory Fanfare
   */
  playBossDefeat() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
      notes.forEach((freq, idx) => {
        const startTime = now + (idx * 0.09);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(vol * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch (_) {}
  }
}

export const AudioEngine = new ProceduralAudioEngine();
