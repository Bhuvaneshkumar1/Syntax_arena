/**
 * SyntaxArena Battlestation Catalog: Customization & Vanity Rig Upgrades
 * Defines mechanical keyboard sound packs, CRT monitor phosphor shaders,
 * chassis RGB underglow auras, and battlestation hardware tier upgrades.
 * Schema & Spec: docs/ARCHITECTURE.md, docs/GAME_RULES.md
 */

export const BATTLESTATION_CATALOG = {
  // Mechanical Keyboard Switch Sound Packs
  keyboardSwitches: [
    {
      id: 'switch_cherry_blue',
      name: 'Cherry MX Blue',
      category: 'keyboard',
      tag: 'Crisp Tactile Click',
      icon: '⌨️',
      description: 'Iconic loud, crisp tactile click with an unmistakable auditory click-leaf snapshot on actuation.',
      requiredXP: 0, // Default unlocked
      synthProfile: {
        clickFreq: 2800,
        clickDuration: 0.025,
        resonanceFreq: 750,
        resonanceDuration: 0.045,
        type: 'blue'
      }
    },
    {
      id: 'switch_cherry_brown',
      name: 'Cherry MX Brown',
      category: 'keyboard',
      tag: 'Dampened Tactile Thud',
      icon: '🟤',
      description: 'Smooth, subtle tactile bump with dampened bottom-out acoustic thud. Minimal resonance.',
      requiredXP: 500,
      synthProfile: {
        clickFreq: 950,
        clickDuration: 0.035,
        resonanceFreq: 420,
        resonanceDuration: 0.06,
        type: 'brown'
      }
    },
    {
      id: 'switch_buckling_spring',
      name: 'IBM Buckling Spring (1984)',
      category: 'keyboard',
      tag: 'Vintage Metallic Clack',
      icon: '🏛️',
      description: 'Authentic Model M acoustic profile: hollow chassis resonance with high-tensile spring ping.',
      requiredXP: 1500,
      synthProfile: {
        clickFreq: 2100,
        clickDuration: 0.04,
        resonanceFreq: 520,
        metallicRingFreq: 3900,
        resonanceDuration: 0.08,
        type: 'buckling'
      }
    },
    {
      id: 'switch_cyber_haptic',
      name: 'Cyber Haptic Pulse',
      category: 'keyboard',
      tag: 'Sci-Fi Sub-Bass Blip',
      icon: '⚡',
      description: 'Deep futuristic neural haptic feedback with low-frequency sine drop and neon synth snap.',
      requiredXP: 3000,
      synthProfile: {
        startFreq: 240,
        endFreq: 45,
        clickDuration: 0.05,
        subBass: true,
        type: 'haptic'
      }
    }
  ],

  // CRT Phosphor Monitor Filters
  crtShaders: [
    {
      id: 'crt_none',
      name: 'Modern Slate OLED',
      category: 'crt',
      tag: 'Ultra-Clean Dark Mode',
      icon: '🖥️',
      description: 'Pristine, pixel-perfect modern slate styling with zero artificial scanlines or distortion.',
      requiredXP: 0, // Default unlocked
      cssClass: ''
    },
    {
      id: 'crt_green_vt100',
      name: 'DEC VT100 Green Phosphor',
      category: 'crt',
      tag: 'Retro 1978 Monochrome',
      icon: '🟢',
      description: 'Nostalgic P1 phosphor green luminescence with subtle horizontal raster scanlines and soft glow.',
      requiredXP: 750,
      cssClass: 'shader-crt-green'
    },
    {
      id: 'crt_amber_ibm',
      name: 'IBM 5151 Amber Phosphor',
      category: 'crt',
      tag: '1981 Hacker Amber',
      icon: '🟠',
      description: 'Classic warm amber phosphor monochrome with retro CRT vignette shadow and raster persistence.',
      requiredXP: 1800,
      cssClass: 'shader-crt-amber'
    },
    {
      id: 'crt_cyber_matrix',
      name: 'Cyberpunk Chromatic Aberration',
      category: 'crt',
      tag: 'High-Voltage Glitch',
      icon: '🔮',
      description: 'High-voltage cathode beam with RGB channel splitting, glass curvature, and neon edge glow.',
      requiredXP: 3500,
      cssClass: 'shader-crt-cyber'
    }
  ],

  // RGB Chassis Aura & Underglow
  rgbUnderglow: [
    {
      id: 'rgb_none',
      name: 'Stealth Matte',
      category: 'rgb',
      tag: 'Minimalist Stealth',
      icon: '⬛',
      description: 'Clean border styling without perimeter ambient chassis lighting.',
      requiredXP: 0,
      cssClass: ''
    },
    {
      id: 'rgb_neon_cyan',
      name: 'Electric Cyan Halo',
      category: 'rgb',
      tag: 'Pulse Cyan Glow',
      icon: '💎',
      description: 'Subtle neon cyan ambient halo cast across the terminal chassis and arena deck.',
      requiredXP: 600,
      cssClass: 'aura-cyan-halo'
    },
    {
      id: 'rgb_violet_wave',
      name: 'Ultraviolet Neon Pulse',
      category: 'rgb',
      tag: 'Deep Violet Aura',
      icon: '💜',
      description: 'Pulsing synthwave purple underglow casting high-contrast highlights across interface edges.',
      requiredXP: 1200,
      cssClass: 'aura-violet-pulse'
    },
    {
      id: 'rgb_chroma_spectrum',
      name: 'Chroma RGB Spectrum Flow',
      category: 'rgb',
      tag: '360° Rainbow Dynamic',
      icon: '🌈',
      description: 'Continuously cycling animated chromatic gradient underglow for maximum battlestation prestige.',
      requiredXP: 2500,
      cssClass: 'aura-chroma-spectrum'
    }
  ],

  // Rig Hardware Upgrade Milestones
  rigUpgrades: [
    {
      id: 'rig_liquid_cooling',
      name: 'Liquid Neon Coolant Loop',
      category: 'hardware',
      tag: 'Thermal Sub-Zero',
      icon: '🧪',
      description: 'Braided cryogenic cooling tubes with glowing fluid circulation animation in your rig header.',
      requiredXP: 1000,
      perk: 'Unlocks animated thermal telemetry badge in arena'
    },
    {
      id: 'rig_neural_accelerator',
      name: 'Overclocked Neural Coprocessor',
      category: 'hardware',
      tag: '128-Core ASIC',
      icon: '⚡',
      description: 'Dedicated matrix math accelerator card with dual spinning LED cooling fans.',
      requiredXP: 2200,
      perk: 'Unlocks +10% Speed Bonus point visual badge display'
    },
    {
      id: 'rig_triple_display',
      name: 'Panoramic Triple-Deck Array',
      category: 'hardware',
      tag: 'Surround HUD',
      icon: '🎛️',
      description: 'Expands the virtual workspace with multi-monitor cockpit borders and panoramic perspective.',
      requiredXP: 3800,
      perk: 'Unlocks widescreen cockpit border theme'
    },
    {
      id: 'rig_matrix_rain',
      name: 'Digital Matrix Rain Backdrop',
      category: 'hardware',
      tag: 'Animated Cyber Canvas',
      icon: '🌧️',
      description: 'Falling green code glyph rain dynamically rendered via browser HTML5 canvas in background.',
      requiredXP: 5000,
      perk: 'Unlocks toggleable animated Matrix Canvas background'
    }
  ]
};

export const BattlestationCatalog = {
  getAll() {
    return BATTLESTATION_CATALOG;
  },

  getSwitches() {
    return [...BATTLESTATION_CATALOG.keyboardSwitches];
  },

  getShaders() {
    return [...BATTLESTATION_CATALOG.crtShaders];
  },

  getUnderglows() {
    return [...BATTLESTATION_CATALOG.rgbUnderglow];
  },

  getUpgrades() {
    return [...BATTLESTATION_CATALOG.rigUpgrades];
  },

  getItemById(id) {
    if (!id) return null;
    const all = [
      ...BATTLESTATION_CATALOG.keyboardSwitches,
      ...BATTLESTATION_CATALOG.crtShaders,
      ...BATTLESTATION_CATALOG.rgbUnderglow,
      ...BATTLESTATION_CATALOG.rigUpgrades
    ];
    return all.find(item => item.id === id) || null;
  },

  getDefaultLoadout() {
    return {
      keyboardSwitch: 'switch_cherry_blue',
      crtShader: 'crt_none',
      rgbUnderglow: 'rgb_none',
      unlockedUpgrades: []
    };
  }
};

if (typeof window !== 'undefined') {
  window.BATTLESTATION_CATALOG = BATTLESTATION_CATALOG;
  window.BattlestationCatalog = BattlestationCatalog;
}

