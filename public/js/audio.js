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
   * Tactile button press click (15ms sine decay).
   */
  playClick() {
    const vol = this._getVolume();
    if (vol <= 0) return;
    const ctx = this._getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);

      gain.gain.setValueAtTime(vol * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
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
   * Start procedural ambient background music.
   * Respects user settings and browser audio state.
   */
  startMusic() {
    const vol = this._getMusicVolume();
    if (vol <= 0) {
      this.stopMusic();
      return;
    }

    if (this._musicPlaying) {
      this.setMusicVolume(vol);
      return;
    }

    const ctx = this._getContext();
    if (!ctx) return;

    try {
      this._musicPlaying = true;

      // Master music gain node
      this._musicGain = ctx.createGain();
      this._musicGain.gain.setValueAtTime(vol * 0.12, ctx.currentTime);
      this._musicGain.connect(ctx.destination);

      // Ambient Cyber Chord Progression:
      // Chord 1 (Dm7): D3 (146.8), F3 (174.6), A3 (220.0), C4 (261.6)
      // Chord 2 (G7):  G2 (98.0),  F3 (174.6), B3 (246.9), D4 (293.7)
      // Chord 3 (Cmaj7): C3 (130.8), E3 (164.8), G3 (196.0), B3 (246.9)
      // Chord 4 (Am7): A2 (110.0), E3 (164.8), G3 (196.0), C4 (261.6)
      const chords = [
        [146.8, 220.0, 261.6],
        [98.0, 174.6, 246.9],
        [130.8, 196.0, 246.9],
        [110.0, 164.8, 261.6]
      ];

      const playChord = () => {
        if (!this._musicPlaying || !this._ctx || this._ctx.state === 'closed') return;
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
        if (this._musicPlaying) {
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
}

export const AudioEngine = new ProceduralAudioEngine();
