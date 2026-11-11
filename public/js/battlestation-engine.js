/**
 * SyntaxArena Battlestation Engine
 * Client-side customization coordinator for mechanical keyboard audio synthesis,
 * CRT phosphor monitor shaders, and RGB chassis illumination.
 * Spec: docs/ARCHITECTURE.md, docs/GAME_RULES.md
 */

import { BattlestationCatalog } from '../data/battlestation-catalog.js';

const BATTLESTATION_STORAGE_KEY = 'syntaxarena_battlestation_loadout';

export const BattlestationEngine = {
  loadout: {
    keyboardSwitch: 'switch_cherry_blue',
    crtShader: 'crt_none',
    rgbUnderglow: 'rgb_none',
    unlockedUpgrades: []
  },
  audioCtx: null,
  matrixCanvas: null,
  matrixAnimId: null,

  /**
   * Initialize battlestation engine, restore saved loadout, and apply cosmetics to DOM.
   */
  init() {
    this.loadSavedLoadout();
    if (typeof document !== 'undefined') {
      this.applyCosmetics();
    }
    return this.getSnapshot();
  },

  /**
   * Restore saved loadout from localStorage.
   */
  loadSavedLoadout() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(BATTLESTATION_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.loadout = {
            keyboardSwitch: parsed.keyboardSwitch || 'switch_cherry_blue',
            crtShader: parsed.crtShader || 'crt_none',
            rgbUnderglow: parsed.rgbUnderglow || 'rgb_none',
            unlockedUpgrades: Array.isArray(parsed.unlockedUpgrades) ? parsed.unlockedUpgrades : []
          };
        }
      }
    } catch (e) {
      console.warn('[BattlestationEngine] Storage access restricted. Using default loadout.');
    }
    return this.loadout;
  },

  /**
   * Save active loadout to localStorage.
   */
  saveLoadout() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(BATTLESTATION_STORAGE_KEY, JSON.stringify(this.loadout));
      }
    } catch (e) {
      // In-memory fallback
    }
  },

  /**
   * Get current loadout snapshot.
   */
  getSnapshot() {
    return {
      loadout: { ...this.loadout },
      equippedSwitch: BattlestationCatalog.getItemById(this.loadout.keyboardSwitch),
      equippedShader: BattlestationCatalog.getItemById(this.loadout.crtShader),
      equippedUnderglow: BattlestationCatalog.getItemById(this.loadout.rgbUnderglow),
      unlockedUpgrades: [...this.loadout.unlockedUpgrades]
    };
  },

  /**
   * Check if a customization item is unlocked for a given player XP.
   * @param {string} itemId
   * @param {number} userXP
   */
  isUnlocked(itemId, userXP = 0) {
    const item = BattlestationCatalog.getItemById(itemId);
    if (!item) return false;
    if (item.requiredXP === 0) return true;
    if (this.loadout.unlockedUpgrades.includes(itemId)) return true;
    return (userXP || 0) >= item.requiredXP;
  },

  /**
   * Equip an item in a specific category.
   * @param {'keyboardSwitch'|'crtShader'|'rgbUnderglow'|'hardware'} category
   * @param {string} itemId
   * @param {number} userXP
   */
  equip(category, itemId, userXP = 0) {
    const item = BattlestationCatalog.getItemById(itemId);
    if (!item) {
      return { success: false, message: `Item "${itemId}" not found in catalog.` };
    }

    if (!this.isUnlocked(itemId, userXP)) {
      return {
        success: false,
        message: `Locked! Requires ${item.requiredXP.toLocaleString()} XP to unlock.`
      };
    }

    if (category === 'hardware') {
      if (!this.loadout.unlockedUpgrades.includes(itemId)) {
        this.loadout.unlockedUpgrades.push(itemId);
      }
    } else if (category === 'keyboard' || category === 'keyboardSwitch') {
      this.loadout.keyboardSwitch = itemId;
    } else if (category === 'crt' || category === 'crtShader') {
      this.loadout.crtShader = itemId;
    } else if (category === 'rgb' || category === 'rgbUnderglow') {
      this.loadout.rgbUnderglow = itemId;
    }

    this.saveLoadout();
    this.applyCosmetics();

    return {
      success: true,
      loadout: { ...this.loadout },
      message: `Equipped ${item.name}!`
    };
  },

  /**
   * Apply CRT shaders, RGB underglow, and hardware perks to the DOM.
   */
  applyCosmetics() {
    if (typeof document === 'undefined') return;

    const root = document.body;
    if (!root) return;

    // 1. Remove all previous CRT shader classes
    const allShaders = BattlestationCatalog.getShaders();
    allShaders.forEach(s => {
      if (s.cssClass) root.classList.remove(s.cssClass);
    });

    // Apply active CRT shader class
    const activeShader = BattlestationCatalog.getItemById(this.loadout.crtShader);
    if (activeShader && activeShader.cssClass) {
      root.classList.add(activeShader.cssClass);
    }

    // 2. Remove all previous RGB underglow classes
    const allUnderglows = BattlestationCatalog.getUnderglows();
    allUnderglows.forEach(u => {
      if (u.cssClass) root.classList.remove(u.cssClass);
    });

    // Apply active RGB underglow class
    const activeUnderglow = BattlestationCatalog.getItemById(this.loadout.rgbUnderglow);
    if (activeUnderglow && activeUnderglow.cssClass) {
      root.classList.add(activeUnderglow.cssClass);
    }

    // 3. Matrix Rain Background Hardware Perk
    const hasMatrixPerk = this.loadout.unlockedUpgrades.includes('rig_matrix_rain');
    this._toggleMatrixRain(hasMatrixPerk);
  },

  /**
   * Lazy-initialize AudioContext for procedural mechanical switch synthesis.
   */
  _ensureAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        try {
          this.audioCtx = new AudioContextClass();
        } catch (_) {
          this.audioCtx = null;
        }
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  },

  /**
   * Synthesize tactile audio for mechanical keypress or click.
   * @param {string} [switchId] Specific switch or active equipped switch
   * @param {number} [volumeScale=1.0] Master volume scale multiplier (0.0 to 1.0)
   */
  playSwitchSound(switchId = null, volumeScale = 1.0) {
    if (volumeScale <= 0) return;
    const id = switchId || this.loadout.keyboardSwitch;
    const item = BattlestationCatalog.getItemById(id);
    if (!item || !item.synthProfile) return;

    const ctx = this._ensureAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const p = item.synthProfile;
    const v = Math.max(0, Math.min(1, volumeScale));

    try {
      if (p.type === 'blue') {
        // High crisp snap + snappy bottom-out
        const snapOsc = ctx.createOscillator();
        const snapGain = ctx.createGain();
        snapOsc.type = 'triangle';
        snapOsc.frequency.setValueAtTime(p.clickFreq, now);
        snapOsc.frequency.exponentialRampToValueAtTime(800, now + p.clickDuration);
        snapGain.gain.setValueAtTime(0.35 * v, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + p.clickDuration);
        snapOsc.connect(snapGain);
        snapGain.connect(ctx.destination);
        snapOsc.start(now);
        snapOsc.stop(now + p.clickDuration);

        // Plastic bottom-out resonance
        const thudOsc = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thudOsc.type = 'sine';
        thudOsc.frequency.setValueAtTime(p.resonanceFreq, now + 0.008);
        thudOsc.frequency.exponentialRampToValueAtTime(150, now + p.resonanceDuration);
        thudGain.gain.setValueAtTime(0.2 * v, now + 0.008);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + p.resonanceDuration);
        thudOsc.connect(thudGain);
        thudGain.connect(ctx.destination);
        thudOsc.start(now + 0.008);
        thudOsc.stop(now + p.resonanceDuration);

      } else if (p.type === 'brown') {
        // Dampened tactile bump & muted thud
        const thudOsc = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thudOsc.type = 'sine';
        thudOsc.frequency.setValueAtTime(p.clickFreq, now);
        thudOsc.frequency.exponentialRampToValueAtTime(180, now + p.resonanceDuration);
        thudGain.gain.setValueAtTime(0.25 * v, now);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + p.resonanceDuration);
        thudOsc.connect(thudGain);
        thudGain.connect(ctx.destination);
        thudOsc.start(now);
        thudOsc.stop(now + p.resonanceDuration);

      } else if (p.type === 'buckling') {
        // Hollow chassis clack + metallic spring ping
        const clackOsc = ctx.createOscillator();
        const clackGain = ctx.createGain();
        clackOsc.type = 'square';
        clackOsc.frequency.setValueAtTime(p.resonanceFreq, now);
        clackOsc.frequency.exponentialRampToValueAtTime(120, now + p.resonanceDuration);
        clackGain.gain.setValueAtTime(0.2 * v, now);
        clackGain.gain.exponentialRampToValueAtTime(0.001, now + p.resonanceDuration);
        clackOsc.connect(clackGain);
        clackGain.connect(ctx.destination);
        clackOsc.start(now);
        clackOsc.stop(now + p.resonanceDuration);

        // Metallic spring ring
        const ringOsc = ctx.createOscillator();
        const ringGain = ctx.createGain();
        ringOsc.type = 'sine';
        ringOsc.frequency.setValueAtTime(p.metallicRingFreq || 3900, now + 0.004);
        ringOsc.frequency.linearRampToValueAtTime(3200, now + 0.06);
        ringGain.gain.setValueAtTime(0.12 * v, now + 0.004);
        ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
        ringOsc.connect(ringGain);
        ringGain.connect(ctx.destination);
        ringOsc.start(now + 0.004);
        ringOsc.stop(now + 0.07);

      } else if (p.type === 'haptic') {
        // Sci-Fi sub-bass drop with neon blip
        const hapticOsc = ctx.createOscillator();
        const hapticGain = ctx.createGain();
        hapticOsc.type = 'sine';
        hapticOsc.frequency.setValueAtTime(p.startFreq || 240, now);
        hapticOsc.frequency.exponentialRampToValueAtTime(p.endFreq || 45, now + p.clickDuration);
        hapticGain.gain.setValueAtTime(0.4 * v, now);
        hapticGain.gain.exponentialRampToValueAtTime(0.001, now + p.clickDuration);
        hapticOsc.connect(hapticGain);
        hapticGain.connect(ctx.destination);
        hapticOsc.start(now);
        hapticOsc.stop(now + p.clickDuration);
      }
    } catch (err) {
      // Audio playback suppressed safely
    }
  },

  /**
   * Preview a switch sound by ID.
   * @param {string} switchId
   */
  previewSwitch(switchId) {
    this.playSwitchSound(switchId);
  },

  /**
   * Procedural Digital Matrix Rain Canvas Backdrop (Rig Perk)
   * @param {boolean} enable
   */
  _toggleMatrixRain(enable) {
    if (typeof document === 'undefined') return;

    let canvas = document.getElementById('battlestation-matrix-canvas');

    if (!enable) {
      if (this.matrixAnimId) {
        cancelAnimationFrame(this.matrixAnimId);
        this.matrixAnimId = null;
      }
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      return;
    }

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'battlestation-matrix-canvas';
      canvas.className = 'battlestation-matrix-canvas';
      canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; opacity: 0.12;';
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const chars = '0123456789ABCDEF<>/{};*+=_!&^%#@~';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 15, 29, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      this.matrixAnimId = requestAnimationFrame(draw);
    };

    if (this.matrixAnimId) cancelAnimationFrame(this.matrixAnimId);
    this.matrixAnimId = requestAnimationFrame(draw);
  }
};

if (typeof window !== 'undefined') {
  window.BattlestationEngine = BattlestationEngine;
}
