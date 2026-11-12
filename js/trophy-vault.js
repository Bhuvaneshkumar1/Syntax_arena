/**
 * SyntaxArena Feature 9: 3D Isometric Trophy Vault & Dynamic GitHub Profile Badges
 * Fully interactive 3D cartridge physics, 360-degree orbital inspection,
 * and zero-dependency SVG badge studio for GitHub profile READMEs.
 */

// =============================================================================
// 1. RARITY & CARTRIDGE METADATA MAPPER
// =============================================================================

export const RARITY_CONFIG = Object.freeze({
  common: {
    label: 'Common',
    color: '#94a3b8',
    glow: 'rgba(148, 163, 184, 0.35)',
    romSize: '512 KB PRG',
    battery: false,
    percentile: 'Top 78% of Agents'
  },
  rare: {
    label: 'Rare',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)',
    romSize: '1024 KB PRG',
    battery: true,
    percentile: 'Top 35% of Agents'
  },
  epic: {
    label: 'Epic',
    color: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.5)',
    romSize: '2048 KB CHR-ROM',
    battery: true,
    percentile: 'Top 14% of Agents'
  },
  legendary: {
    label: 'Legendary',
    color: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.6)',
    romSize: '4096 KB ULTRA-ROM',
    battery: true,
    percentile: 'Top 4.2% of Agents'
  },
  mythic: {
    label: 'Mythic',
    color: '#f472b6',
    glow: 'rgba(236, 72, 153, 0.65)',
    romSize: '8192 KB QUANTUM-ROM',
    battery: true,
    percentile: 'Top 0.8% Elite Vanguard'
  }
});

export function mapBadgeRarity(badge) {
  if (!badge) return 'common';
  const diff = String(badge.difficulty || '').toLowerCase();
  const id = String(badge.id || '').toLowerCase();
  
  if (id.includes('daemon') || id.includes('grandmaster') || id.includes('overlord') || id.includes('flawless')) {
    return 'mythic';
  }
  if (diff === 'legendary' || diff === 'boss' || id.includes('boss') || id.includes('master')) {
    return 'legendary';
  }
  if (diff === 'expert' || diff === 'hard') {
    return 'epic';
  }
  if (diff === 'intermediate' || diff === 'medium') {
    return 'rare';
  }
  return 'common';
}

// =============================================================================
// 2. DYNAMIC GITHUB PROFILE SVG BADGE GENERATOR
// =============================================================================

export class BadgeGenerator {
  /**
   * Generates a standards-compliant SVG badge string
   * @param {Object} options - Badge configuration options
   * @returns {string} Clean SVG markup
   */
  static generateSvg(options = {}) {
    const {
      style = 'arcade',
      color = 'cyan',
      callsign = 'ScriptAdept',
      level = 1,
      rankTitle = 'Script Novice',
      xp = 0,
      solved = 0,
      streak = 0,
      accuracy = '100%',
      showXP = true,
      showRank = true,
      showStats = true,
      showAvatar = true
    } = options;

    const PALETTES = {
      cyan:    { primary: '#06b6d4', edge: '#38bdf8', glow: 'rgba(6, 182, 212, 0.5)', bg: '#0b1120' },
      emerald: { primary: '#10b981', edge: '#34d399', glow: 'rgba(16, 185, 129, 0.5)', bg: '#061a14' },
      amber:   { primary: '#f59e0b', edge: '#fbbf24', glow: 'rgba(245, 158, 11, 0.5)', bg: '#1c1305' },
      violet:  { primary: '#8b5cf6', edge: '#c084fc', glow: 'rgba(139, 92, 246, 0.5)', bg: '#150d2a' },
      rose:    { primary: '#f43f5e', edge: '#fb7185', glow: 'rgba(244, 63, 94, 0.5)', bg: '#200810' }
    };

    const pal = PALETTES[color] || PALETTES.cyan;

    switch (style) {
      case 'shield':
        return this._renderShieldBadge({ callsign, level, rankTitle, pal });
      case 'cyber':
        return this._renderCyberBadge({ callsign, level, rankTitle, xp, solved, streak, accuracy, pal, showXP, showStats });
      case 'minimal':
        return this._renderMinimalBadge({ callsign, level, rankTitle, xp, pal, showXP });
      case 'arcade':
      default:
        return this._renderArcadeBadge({ callsign, level, rankTitle, xp, solved, streak, accuracy, pal, showXP, showRank, showStats, showAvatar });
    }
  }

  static _renderShieldBadge({ callsign, level, rankTitle, pal }) {
    const leftText = 'SYNTAX ARENA';
    const rightText = `LVL ${level} • ${rankTitle.toUpperCase()}`;
    const leftWidth = 110;
    const rightWidth = Math.max(140, rightText.length * 7.5 + 24);
    const totalWidth = leftWidth + rightWidth;
    const height = 28;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" role="img" aria-label="${leftText}: ${rightText}">
  <title>${leftText}: ${rightText}</title>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="5" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="${height}" fill="#1e293b"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="${height}" fill="${pal.primary}"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#gloss)" opacity="0.15"/>
  </g>
  <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fff" stop-opacity="0.8"/>
    <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <g fill="#fff" text-anchor="middle" font-family="'DejaVu Sans',Verdana,Geneva,sans-serif" font-size="11" font-weight="bold">
    <text x="${leftWidth / 2}" y="18" fill="#cbd5e1" letter-spacing="1">SYNTAX ARENA</text>
    <text x="${leftWidth + rightWidth / 2}" y="18" fill="#ffffff" letter-spacing="0.5">${rightText}</text>
  </g>
</svg>`;
  }

  static _renderMinimalBadge({ callsign, level, rankTitle, xp, pal, showXP }) {
    const xpText = showXP ? ` | ${xp.toLocaleString()} XP` : '';
    const badgeText = `⚡ ${callsign} (Lv.${level})${xpText}`;
    const width = Math.max(220, badgeText.length * 8 + 36);
    const height = 32;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${badgeText}">
  <rect width="${width}" height="${height}" rx="16" fill="#0f172a" stroke="${pal.edge}" stroke-width="1.5"/>
  <circle cx="16" cy="16" r="6" fill="${pal.primary}"/>
  <text x="30" y="20" fill="#f8fafc" font-family="system-ui,-apple-system,sans-serif" font-size="12" font-weight="700" letter-spacing="0.4">
    ${callsign} <tspan fill="${pal.edge}">[Lv.${level}]</tspan>${showXP ? `<tspan fill="#94a3b8" font-size="11"> • ${xp.toLocaleString()} XP</tspan>` : ''}
  </text>
</svg>`;
  }

  static _renderCyberBadge({ callsign, level, rankTitle, xp, solved, streak, accuracy, pal, showXP, showStats }) {
    const width = 360;
    const height = showStats ? 140 : 90;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="SyntaxArena Cyber Profile: ${callsign}">
  <defs>
    <linearGradient id="cyber-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#020408"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="8" fill="url(#cyber-bg)" stroke="${pal.edge}" stroke-width="1.5"/>
  <rect x="0" y="0" width="${width}" height="24" fill="${pal.primary}" opacity="0.15"/>
  <line x1="0" y1="24" x2="${width}" y2="24" stroke="${pal.edge}" stroke-width="1"/>
  
  <!-- Terminal Prompt Header -->
  <circle cx="12" cy="12" r="4" fill="#ef4444"/>
  <circle cx="24" cy="12" r="4" fill="#f59e0b"/>
  <circle cx="36" cy="12" r="4" fill="#10b981"/>
  <text x="50" y="16" fill="${pal.edge}" font-family="monospace" font-size="11" font-weight="bold">usr@syntaxarena:~# id ${callsign}</text>

  <!-- Agent Info -->
  <text x="16" y="50" fill="#f8fafc" font-family="monospace" font-size="14" font-weight="bold">&gt; AGENT: ${callsign}</text>
  <text x="16" y="70" fill="#94a3b8" font-family="monospace" font-size="11">&gt; RANK: <tspan fill="${pal.edge}">${rankTitle} [Level ${level}]</tspan>${showXP ? ` | ${xp.toLocaleString()} XP` : ''}</text>

  ${showStats ? `
  <line x1="16" y1="84" x2="${width - 16}" y2="84" stroke="rgba(255,255,255,0.1)" stroke-dasharray="2,2"/>
  <text x="16" y="104" fill="#64748b" font-family="monospace" font-size="10">SOLVED</text>
  <text x="16" y="122" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">${solved}</text>

  <text x="110" y="104" fill="#64748b" font-family="monospace" font-size="10">BEST STREAK</text>
  <text x="110" y="122" fill="#fbbf24" font-family="monospace" font-size="13" font-weight="bold">${streak}🔥</text>

  <text x="210" y="104" fill="#64748b" font-family="monospace" font-size="10">ACCURACY</text>
  <text x="210" y="122" fill="#34d399" font-family="monospace" font-size="13" font-weight="bold">${accuracy}</text>
  ` : ''}
</svg>`;
  }

  static _renderArcadeBadge({ callsign, level, rankTitle, xp, solved, streak, accuracy, pal, showXP, showRank, showStats, showAvatar }) {
    const width = 420;
    const height = showStats ? 160 : 105;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="SyntaxArena Arcade Card: ${callsign}">
  <defs>
    <linearGradient id="arc-card-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#131b2e"/>
      <stop offset="100%" stop-color="#0a0f1d"/>
    </linearGradient>
    <filter id="arc-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Chassis Outline & Glow -->
  <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="12" fill="url(#arc-card-bg)" stroke="${pal.edge}" stroke-width="2"/>
  <rect x="6" y="6" width="${width - 12}" height="${height - 12}" rx="8" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

  <!-- Top Arcade Title Bar -->
  <path d="M 2 14 Q 2 2 14 2 L ${width - 14} 2 Q ${width - 2} 2 ${width - 2} 14 L ${width - 2} 24 L 2 24 Z" fill="${pal.primary}" opacity="0.2"/>
  <text x="14" y="17" fill="${pal.edge}" font-family="system-ui,-apple-system,sans-serif" font-size="9" font-weight="900" letter-spacing="2">SYNTAXARENA // VERIFIED CODER</text>
  <text x="${width - 14}" y="17" fill="#64748b" font-family="monospace" font-size="9" text-anchor="end">SYS.READY</text>

  <!-- Player Avatar & Identity -->
  <g transform="translate(16, 36)">
    ${showAvatar ? `
    <rect width="52" height="52" rx="26" fill="#1e293b" stroke="${pal.edge}" stroke-width="2"/>
    <text x="26" y="34" font-size="26" text-anchor="middle">🦊</text>
    ` : ''}

    <g transform="translate(${showAvatar ? 64 : 0}, 0)">
      <text x="0" y="20" fill="#f8fafc" font-family="system-ui,-apple-system,sans-serif" font-size="18" font-weight="900" letter-spacing="0.5">${callsign}</text>
      
      ${showRank ? `
      <rect x="0" y="28" width="58" height="18" rx="4" fill="${pal.primary}" opacity="0.25"/>
      <text x="29" y="41" fill="${pal.edge}" font-family="system-ui,sans-serif" font-size="10" font-weight="800" text-anchor="middle">LVL ${level}</text>
      <text x="66" y="41" fill="#cbd5e1" font-family="system-ui,sans-serif" font-size="12" font-weight="600">${rankTitle}</text>
      ` : ''}

      ${showXP ? `
      <text x="${width - (showAvatar ? 96 : 32)}" y="20" fill="${pal.edge}" font-family="monospace" font-size="12" font-weight="bold" text-anchor="end">${xp.toLocaleString()} XP</text>
      ` : ''}
    </g>
  </g>

  ${showStats ? `
  <!-- Stat Strip Bottom Section -->
  <g transform="translate(16, 102)">
    <rect width="${width - 32}" height="42" rx="6" fill="#080c16" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    
    <g transform="translate(20, 0)">
      <text x="0" y="16" fill="#64748b" font-family="system-ui,sans-serif" font-size="9" font-weight="700">CHALLENGES</text>
      <text x="0" y="32" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="900">${solved}</text>
    </g>

    <g transform="translate(140, 0)">
      <text x="0" y="16" fill="#64748b" font-family="system-ui,sans-serif" font-size="9" font-weight="700">STREAK</text>
      <text x="0" y="32" fill="#fbbf24" font-family="monospace" font-size="13" font-weight="900">${streak}🔥</text>
    </g>

    <g transform="translate(260, 0)">
      <text x="0" y="16" fill="#64748b" font-family="system-ui,sans-serif" font-size="9" font-weight="700">ACCURACY</text>
      <text x="0" y="32" fill="#34d399" font-family="monospace" font-size="13" font-weight="900">${accuracy}</text>
    </g>
  </g>
  ` : ''}
</svg>`;
  }
}

// =============================================================================
// 3. INTERACTIVE 3D TROPHY VAULT CONTROLLER
// =============================================================================

export class TrophyVault {
  constructor(options = {}) {
    this.containerId = options.containerId || 'trophy-grid';
    this.badges = options.badges || [];
    this.unlockedBadgeIds = new Set(options.unlockedBadgeIds || []);
    this.profile = options.profile || null;
    this.selectedBadge = null;

    // 360 Inspector State
    this.inspectorRotX = 0;
    this.inspectorRotY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.isAutoSpinning = false;
    this.animFrameId = null;

    // Badge Studio State
    this.badgeStudioState = {
      style: 'arcade',
      color: 'cyan',
      showXP: true,
      showRank: true,
      showStats: true,
      showAvatar: true
    };
  }

  init() {
    this.render();
    this.mountInspectorModal();
    this.mountBadgeStudio();
  }

  setUnlockedBadges(unlockedIds) {
    this.unlockedBadgeIds = new Set(unlockedIds || []);
    if (typeof document !== 'undefined') {
      this.render();
      this.updateBadgeStudioPreview();
    }
  }

  setProfile(profile) {
    this.profile = profile;
    if (typeof document !== 'undefined') {
      this.updateBadgeStudioPreview();
    }
  }

  // ===========================================================================
  // CARTRIDGE SHOWROOM RENDERING
  // ===========================================================================

  render(filterSubject = 'all', filterStatus = 'all') {
    if (typeof document === 'undefined') return;
    const grid = document.getElementById(this.containerId);
    if (!grid) return;

    grid.className = 'trophy-vault-grid';

    const filtered = this.badges.filter(b => {
      if (filterSubject !== 'all' && b.category !== filterSubject) return false;
      const isUnlocked = this.unlockedBadgeIds.has(b.id);
      if (filterStatus === 'gained' && !isUnlocked) return false;
      if (filterStatus === 'unclaimed' && isUnlocked) return false;
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 3rem 1rem; text-align: center; color: #94a3b8;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔒</div>
          <p style="margin: 0;">No trophy cartridges match the selected filter criteria.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(b => {
      const isUnlocked = this.unlockedBadgeIds.has(b.id);
      const rarity = mapBadgeRarity(b);
      const rMeta = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;

      return `
        <div class="cartridge-wrapper cartridge-card rarity-${rarity} ${!isUnlocked ? 'is-locked' : ''}"
             data-badge-id="${b.id}"
             role="button"
             tabindex="0"
             aria-label="${b.name} (${rMeta.label} Trophy Cartridge - ${isUnlocked ? 'Unlocked' : 'Locked'})">
          <div class="cartridge-chassis">
            <div class="cartridge-top-grip"></div>
            <div class="cartridge-holo-sheen"></div>

            <div class="cartridge-label">
              <div class="cartridge-badge-icon">${isUnlocked ? b.icon : '🔒'}</div>
              <h3 class="cartridge-title">${b.name}</h3>
              <p class="cartridge-desc">${isUnlocked ? b.description : 'Undiscovered secret achievement. Complete arena objectives to decrypt cartridge.'}</p>
              
              <div class="cartridge-rarity-pill">
                <span class="cartridge-jewel-dot"></span>
                <span>${rMeta.label}</span>
              </div>

              <div class="cartridge-meta-row">
                <span>${rMeta.romSize}</span>
                <span>${isUnlocked ? 'DECRYPTED' : 'LOCKED'}</span>
              </div>
            </div>

            <div class="cartridge-pcb-connector"></div>
          </div>
        </div>
      `;
    }).join('');

    this._bindTiltPhysics();
  }

  // ===========================================================================
  // 3D TILT PHYSICS & TACTILE HOVER ENGINE
  // ===========================================================================

  _bindTiltPhysics() {
    const wrappers = document.querySelectorAll('.cartridge-wrapper');
    wrappers.forEach(wrap => {
      const chassis = wrap.querySelector('.cartridge-chassis');
      const sheen = wrap.querySelector('.cartridge-holo-sheen');

      const onMove = (clientX, clientY) => {
        const rect = wrap.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const rotX = -deltaY * 14;
        const rotY = deltaX * 14;

        if (chassis) {
          chassis.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`;
        }
        if (sheen) {
          const posX = ((deltaX + 1) * 50).toFixed(1);
          const posY = ((deltaY + 1) * 50).toFixed(1);
          sheen.style.backgroundPosition = `${posX}% ${posY}%`;
        }
      };

      wrap.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
      wrap.addEventListener('mouseleave', () => {
        if (chassis) {
          chassis.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
        if (sheen) {
          sheen.style.backgroundPosition = '100% 100%';
        }
      });

      // Click to open 360 inspector
      wrap.addEventListener('click', () => {
        const badgeId = wrap.dataset.badgeId;
        this.openInspectorModal(badgeId);
      });

      wrap.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const badgeId = wrap.dataset.badgeId;
          this.openInspectorModal(badgeId);
        }
      });
    });
  }

  // ===========================================================================
  // 360-DEGREE ORBITAL INSPECTOR MODAL
  // ===========================================================================

  mountInspectorModal() {
    if (document.getElementById('vault-inspector-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'vault-inspector-modal';
    modal.className = 'vault-inspector-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '360 Degree Cartridge Inspector');

    modal.innerHTML = `
      <div class="vault-inspector-content">
        <div class="vault-inspector-header">
          <h2 id="inspector-modal-title" class="vault-inspector-title">
            <span>🕹️ Cartridge 360° Inspector</span>
          </h2>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button id="btn-spin-toggle" class="btn-arcade btn-neutral btn-sm" aria-label="Toggle auto-spin">
              🔄 Auto-Spin
            </button>
            <button id="btn-view-front" class="btn-arcade btn-neutral btn-sm">Front</button>
            <button id="btn-view-back" class="btn-arcade btn-neutral btn-sm">Back</button>
            <button id="btn-close-inspector" class="btn-icon-toggle" aria-label="Close Inspector" style="color: #94a3b8; font-size: 1.25rem;">
              ✕
            </button>
          </div>
        </div>

        <div class="vault-inspector-body">
          <!-- 3D Orbital Canvas Area -->
          <div id="inspector-3d-stage" class="vault-3d-stage">
            <div id="inspector-3d-box" class="vault-3d-box">
              <div class="cartridge-face cartridge-face-front" id="inspector-face-front"></div>
              <div class="cartridge-face cartridge-face-back" id="inspector-face-back"></div>
              <div class="cartridge-face cartridge-face-left"></div>
              <div class="cartridge-face cartridge-face-right"></div>
              <div class="cartridge-face cartridge-face-bottom"></div>
            </div>
            <div class="vault-rotate-hint">
              <span>🖱️ Drag cursor or swipe to rotate 360°</span>
            </div>
          </div>

          <!-- Deep Lore & Tech Specs Panel -->
          <div class="vault-details-panel">
            <div>
              <span id="inspector-badge-rarity" class="cartridge-rarity-pill">Common</span>
              <h3 id="inspector-badge-name" style="font-size: 1.3rem; margin: 0.4rem 0; color: #f8fafc;">Badge Name</h3>
              <p id="inspector-badge-desc" class="vault-detail-desc">Badge Description</p>
            </div>

            <div class="vault-detail-meta-grid">
              <div>
                <span class="vault-meta-item-label">STATUS</span>
                <span id="inspector-meta-status" class="vault-meta-item-val" style="color: #10b981;">UNLOCKED</span>
              </div>
              <div>
                <span class="vault-meta-item-label">RARITY TIER</span>
                <span id="inspector-meta-rarity" class="vault-meta-item-val">Rare (Top 35%)</span>
              </div>
              <div>
                <span class="vault-meta-item-label">ROM SPEC</span>
                <span id="inspector-meta-rom" class="vault-meta-item-val">1024 KB PRG</span>
              </div>
              <div>
                <span class="vault-meta-item-label">SERIAL ID</span>
                <span id="inspector-meta-serial" class="vault-meta-item-val">SA-ROM-0442</span>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
              <button id="btn-share-badge" class="btn-arcade btn-primary btn-sm" style="flex: 1;">
                🛡️ Generate GitHub Badge
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this._bindInspectorEvents(modal);
  }

  _bindInspectorEvents(modal) {
    const closeBtn = modal.querySelector('#btn-close-inspector');
    const spinBtn = modal.querySelector('#btn-spin-toggle');
    const frontBtn = modal.querySelector('#btn-view-front');
    const backBtn = modal.querySelector('#btn-view-back');
    const shareBtn = modal.querySelector('#btn-share-badge');
    const stage = modal.querySelector('#inspector-3d-stage');

    closeBtn.addEventListener('click', () => this.closeInspectorModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeInspectorModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        this.closeInspectorModal();
      }
    });

    frontBtn.addEventListener('click', () => {
      this._stopAutoSpin();
      this.inspectorRotX = 0;
      this.inspectorRotY = 0;
      this._applyInspectorTransform();
    });

    backBtn.addEventListener('click', () => {
      this._stopAutoSpin();
      this.inspectorRotX = 0;
      this.inspectorRotY = 180;
      this._applyInspectorTransform();
    });

    spinBtn.addEventListener('click', () => {
      if (this.isAutoSpinning) {
        this._stopAutoSpin();
      } else {
        this._startAutoSpin();
      }
    });

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.closeInspectorModal();
        const studio = document.getElementById('github-badge-studio');
        if (studio) studio.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Drag to rotate physics
    const startDrag = (x, y) => {
      this._stopAutoSpin();
      this.isDragging = true;
      this.dragStartX = x;
      this.dragStartY = y;
    };

    const moveDrag = (x, y) => {
      if (!this.isDragging) return;
      const dx = x - this.dragStartX;
      const dy = y - this.dragStartY;
      this.dragStartX = x;
      this.dragStartY = y;

      this.inspectorRotY += dx * 0.75;
      this.inspectorRotX = Math.max(-55, Math.min(55, this.inspectorRotX - dy * 0.75));
      this._applyInspectorTransform();
    };

    const endDrag = () => {
      this.isDragging = false;
    };

    stage.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag);

    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchend', endDrag);
  }

  openInspectorModal(badgeId) {
    const badge = this.badges.find(b => b.id === badgeId);
    if (!badge) return;

    this.selectedBadge = badge;
    const isUnlocked = this.unlockedBadgeIds.has(badge.id);
    const rarity = mapBadgeRarity(badge);
    const rMeta = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;

    const modal = document.getElementById('vault-inspector-modal');
    if (!modal) return;

    // Reset rotation
    this.inspectorRotX = 0;
    this.inspectorRotY = 0;
    this._applyInspectorTransform();

    // Populate Details
    modal.querySelector('#inspector-badge-name').textContent = badge.name;
    modal.querySelector('#inspector-badge-desc').textContent = badge.description;
    const rarityPill = modal.querySelector('#inspector-badge-rarity');
    rarityPill.className = `cartridge-rarity-pill`;
    rarityPill.innerHTML = `<span class="cartridge-jewel-dot" style="background: ${rMeta.color}"></span> ${rMeta.label}`;

    modal.querySelector('#inspector-meta-status').textContent = isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED';
    modal.querySelector('#inspector-meta-status').style.color = isUnlocked ? '#10b981' : '#f43f5e';
    modal.querySelector('#inspector-meta-rarity').textContent = `${rMeta.label} (${rMeta.percentile})`;
    modal.querySelector('#inspector-meta-rom').textContent = rMeta.romSize;
    modal.querySelector('#inspector-meta-serial').textContent = `SA-ROM-${Math.abs(badge.id.split('').reduce((a,c)=>a+c.charCodeAt(0),0)).toString(16).toUpperCase().padStart(4, '0')}`;

    // Front Face
    const frontFace = modal.querySelector('#inspector-face-front');
    frontFace.innerHTML = `
      <div class="cartridge-top-grip"></div>
      <div class="cartridge-label" style="margin: 10px; height: calc(100% - 38px);">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">${isUnlocked ? badge.icon : '🔒'}</div>
        <h3 style="font-size: 1rem; color: #f8fafc; margin: 0 0 0.5rem;">${badge.name}</h3>
        <span class="cartridge-rarity-pill" style="margin-bottom: 0.5rem;">${rMeta.label}</span>
        <div style="font-family: monospace; font-size: 0.7rem; color: #64748b; margin-top: auto;">SYNTAX ARENA CARTRIDGE</div>
      </div>
      <div class="cartridge-pcb-connector"></div>
    `;

    // Back Face
    const backFace = modal.querySelector('#inspector-face-back');
    backFace.innerHTML = `
      <div class="back-tech-specs">
        <strong style="color: #cbd5e1; display: block; margin-bottom: 0.25rem;">ROM SPECIFICATION</strong>
        <div>TITLE: ${badge.name.toUpperCase()}</div>
        <div>CATEGORY: ${badge.category?.toUpperCase() || 'CORE'}</div>
        <div>CHIP: ${rMeta.romSize}</div>
        <div>BACKUP: ${rMeta.battery ? 'CR2032 LI-ION ACTIVE' : 'NONE'}</div>
        <div>CIRCUIT: 6502/SYNTAX-MCU</div>
      </div>

      <div style="background: #090d16; border: 1px solid rgba(255,255,255,0.06); padding: 0.6rem; border-radius: 6px;">
        <span style="font-size: 0.65rem; color: #64748b; font-family: monospace;">DEVELOPER VERIFICATION</span>
        <div class="back-barcode"></div>
      </div>

      <div style="font-size: 0.65rem; color: #475569; font-family: monospace; text-align: center;">
        MADE FOR SYNTAXARENA 2.0 ARCADE
      </div>
    `;

    modal.classList.add('is-open');
    this._startAutoSpin();
  }

  closeInspectorModal() {
    const modal = document.getElementById('vault-inspector-modal');
    if (modal) modal.classList.remove('is-open');
    this._stopAutoSpin();
  }

  _applyInspectorTransform() {
    const box = document.getElementById('inspector-3d-box');
    if (box) {
      box.style.transform = `rotateX(${this.inspectorRotX.toFixed(2)}deg) rotateY(${this.inspectorRotY.toFixed(2)}deg)`;
    }
  }

  _startAutoSpin() {
    this._stopAutoSpin();
    this.isAutoSpinning = true;
    const spinBtn = document.getElementById('btn-spin-toggle');
    if (spinBtn) spinBtn.textContent = '⏸ Pause';

    const spin = () => {
      if (!this.isAutoSpinning) return;
      this.inspectorRotY = (this.inspectorRotY + 0.6) % 360;
      this._applyInspectorTransform();
      this.animFrameId = requestAnimationFrame(spin);
    };
    this.animFrameId = requestAnimationFrame(spin);
  }

  _stopAutoSpin() {
    this.isAutoSpinning = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    const spinBtn = document.getElementById('btn-spin-toggle');
    if (spinBtn) spinBtn.textContent = '🔄 Auto-Spin';
  }

  // ===========================================================================
  // GITHUB PROFILE BADGES STUDIO
  // ===========================================================================

  mountBadgeStudio() {
    const container = document.getElementById('github-badge-studio');
    if (!container) return;

    container.innerHTML = `
      <div class="badge-studio-card">
        <div class="badge-studio-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge badge-cyan">Feature 9 Studio</span>
              <span class="badge badge-emerald">Zero Dependency SVGs</span>
            </div>
            <h2 style="font-family: var(--font-display, 'Orbitron', sans-serif); margin: 0.5rem 0 0.25rem; font-size: 1.4rem; color: #f8fafc;">
              🛡️ Dynamic GitHub Profile Badges
            </h2>
            <p style="color: #94a3b8; font-size: 0.85rem; margin: 0; line-height: 1.5;">
              Showcase your programming rank, challenges cleared, and streaks in your GitHub profile README or portfolio.
            </p>
          </div>
        </div>

        <div class="badge-studio-layout">
          <!-- Live Preview Canvas -->
          <div class="badge-preview-zone">
            <div id="badge-live-preview" class="badge-preview-svg-container">
              <!-- SVG dynamically rendered here -->
            </div>
          </div>

          <!-- Controls Panel -->
          <div class="badge-controls-zone">
            <!-- Style Selector -->
            <div class="badge-control-group">
              <span class="badge-control-label">Badge Aesthetic</span>
              <div class="badge-style-chips">
                <button class="badge-chip-btn is-active" data-style="arcade">👾 Cyber Arcade</button>
                <button class="badge-chip-btn" data-style="shield">🛡️ Shields.io</button>
                <button class="badge-chip-btn" data-style="cyber">💻 Terminal HUD</button>
                <button class="badge-chip-btn" data-style="minimal">⚡ Minimal Pill</button>
              </div>
            </div>

            <!-- Color Palette Selector -->
            <div class="badge-control-group">
              <span class="badge-control-label">Accent Theme</span>
              <div class="badge-color-chips">
                <button class="badge-color-dot-btn is-active" data-color="cyan" style="background: #06b6d4;" title="Cyan Neon"></button>
                <button class="badge-color-dot-btn" data-color="emerald" style="background: #10b981;" title="Emerald Matrix"></button>
                <button class="badge-color-dot-btn" data-color="amber" style="background: #f59e0b;" title="Solar Amber"></button>
                <button class="badge-color-dot-btn" data-color="violet" style="background: #8b5cf6;" title="Synth Violet"></button>
                <button class="badge-color-dot-btn" data-color="rose" style="background: #f43f5e;" title="Crimson Hacker"></button>
              </div>
            </div>

            <!-- Metric Toggles -->
            <div class="badge-control-group">
              <span class="badge-control-label">Visible Telemetry</span>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; font-size: 0.8rem; color: #cbd5e1;">
                <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                  <input type="checkbox" id="chk-badge-xp" checked> Show XP
                </label>
                <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                  <input type="checkbox" id="chk-badge-rank" checked> Show Rank
                </label>
                <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                  <input type="checkbox" id="chk-badge-stats" checked> Show Stats
                </label>
                <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
                  <input type="checkbox" id="chk-badge-avatar" checked> Show Avatar
                </label>
              </div>
            </div>

            <!-- Export Buttons -->
            <div class="badge-control-group" style="margin-top: 0.5rem;">
              <span class="badge-control-label">Export &amp; Embed</span>
              <div class="badge-export-grid">
                <button id="btn-copy-markdown" class="btn-arcade btn-primary badge-export-btn">
                  📋 Copy Markdown
                </button>
                <button id="btn-copy-html" class="btn-arcade btn-neutral badge-export-btn">
                  🌐 Copy HTML
                </button>
                <button id="btn-copy-raw-svg" class="btn-arcade btn-neutral badge-export-btn">
                  📐 Copy Raw SVG
                </button>
                <button id="btn-download-svg" class="btn-arcade btn-secondary badge-export-btn">
                  💾 Download .svg
                </button>
              </div>
              <span id="badge-copy-feedback" style="font-size: 0.75rem; color: #10b981; font-weight: 700; height: 16px; margin-top: 0.25rem;"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    this._bindBadgeStudioEvents(container);
    this.updateBadgeStudioPreview();
  }

  _bindBadgeStudioEvents(container) {
    // Style Chips
    container.querySelectorAll('.badge-style-chips .badge-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.badge-style-chips .badge-chip-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.badgeStudioState.style = btn.dataset.style;
        this.updateBadgeStudioPreview();
      });
    });

    // Color Chips
    container.querySelectorAll('.badge-color-chips .badge-color-dot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.badge-color-chips .badge-color-dot-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.badgeStudioState.color = btn.dataset.color;
        this.updateBadgeStudioPreview();
      });
    });

    // Metric Checkboxes
    const chkXP = container.querySelector('#chk-badge-xp');
    const chkRank = container.querySelector('#chk-badge-rank');
    const chkStats = container.querySelector('#chk-badge-stats');
    const chkAvatar = container.querySelector('#chk-badge-avatar');

    [chkXP, chkRank, chkStats, chkAvatar].forEach(chk => {
      if (!chk) return;
      chk.addEventListener('change', () => {
        this.badgeStudioState.showXP = chkXP.checked;
        this.badgeStudioState.showRank = chkRank.checked;
        this.badgeStudioState.showStats = chkStats.checked;
        this.badgeStudioState.showAvatar = chkAvatar.checked;
        this.updateBadgeStudioPreview();
      });
    });

    // Export Buttons
    const btnMarkdown = container.querySelector('#btn-copy-markdown');
    const btnHtml = container.querySelector('#btn-copy-html');
    const btnRawSvg = container.querySelector('#btn-copy-raw-svg');
    const btnDownload = container.querySelector('#btn-download-svg');

    btnMarkdown.addEventListener('click', () => this._copyExportSnippet('markdown'));
    btnHtml.addEventListener('click', () => this._copyExportSnippet('html'));
    btnRawSvg.addEventListener('click', () => this._copyExportSnippet('raw_svg'));
    btnDownload.addEventListener('click', () => this._downloadSvgFile());
  }

  updateBadgeStudioPreview() {
    const previewEl = document.getElementById('badge-live-preview');
    if (!previewEl) return;

    const isLocked = this.unlockedBadgeIds.size === 0;

    // Toggle export buttons state
    const container = document.getElementById('github-badge-studio');
    if (container) {
      const exportBtns = container.querySelectorAll('.badge-export-btn');
      exportBtns.forEach(btn => {
        btn.disabled = isLocked;
        btn.style.opacity = isLocked ? '0.45' : '1';
        btn.style.cursor = isLocked ? 'not-allowed' : 'pointer';
        btn.title = isLocked ? 'Unlock at least 1 trophy badge in the arena to export GitHub badges' : '';
      });
    }

    if (isLocked) {
      previewEl.innerHTML = `
        <div class="badge-studio-locked-notice" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 160px; padding: 1.5rem; text-align: center; background: rgba(15, 23, 42, 0.85); border: 2px dashed rgba(244, 63, 94, 0.4); border-radius: 10px;">
          <span style="font-size: 2.4rem; margin-bottom: 0.5rem;" aria-hidden="true">🔒</span>
          <h4 style="margin: 0 0 0.35rem; color: #f8fafc; font-family: var(--font-display, sans-serif); font-size: 1.05rem;">GITHUB BADGE STUDIO LOCKED</h4>
          <p style="margin: 0; color: #94a3b8; font-size: 0.85rem; max-width: 420px; line-height: 1.5;">
            You haven't unlocked any badges yet! Complete challenges, win duels, or solve memory puzzles to unlock at least <strong>1 trophy cartridge</strong> to generate and export dynamic SVG badges for your GitHub README.
          </p>
        </div>
      `;
      return;
    }

    const prof = this.profile || {};
    const stats = prof.stats || {};
    const callsign = prof.callsign || 'ScriptAdept';
    const xp = typeof prof.lifetimeXP === 'number' ? prof.lifetimeXP : (prof.xp || 1450);
    const level = typeof prof.level === 'number' ? prof.level : 1;
    const rankTitle = prof.rankTitle || 'Script Novice';
    const solved = stats.questionsCorrect || stats.questionsSolved || 0;
    const streak = stats.bestStreak || 0;
    const accuracy = stats.accuracyRate ? `${stats.accuracyRate}%` : '100%';

    const svgMarkup = BadgeGenerator.generateSvg({
      style: this.badgeStudioState.style,
      color: this.badgeStudioState.color,
      callsign,
      level,
      rankTitle,
      xp,
      solved,
      streak,
      accuracy,
      showXP: this.badgeStudioState.showXP,
      showRank: this.badgeStudioState.showRank,
      showStats: this.badgeStudioState.showStats,
      showAvatar: this.badgeStudioState.showAvatar
    });

    previewEl.innerHTML = svgMarkup;
  }

  _copyExportSnippet(type) {
    const previewEl = document.getElementById('badge-live-preview');
    const feedbackEl = document.getElementById('badge-copy-feedback');
    if (!previewEl) return;

    if (this.unlockedBadgeIds.size === 0) {
      if (feedbackEl) {
        feedbackEl.style.color = '#f43f5e';
        feedbackEl.textContent = '🔒 Studio locked! Earn at least 1 trophy badge first.';
        setTimeout(() => { if (feedbackEl) feedbackEl.textContent = ''; }, 3000);
      }
      return;
    }

    const svg = previewEl.innerHTML.trim();
    const encodedDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    let textToCopy = '';
    if (type === 'markdown') {
      textToCopy = `[![SyntaxArena Profile Badge](${encodedDataUri})](https://syntaxarena.dev)`;
    } else if (type === 'html') {
      textToCopy = `<a href="https://syntaxarena.dev"><img src="${encodedDataUri}" alt="SyntaxArena Profile Badge" /></a>`;
    } else if (type === 'raw_svg') {
      textToCopy = svg;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }

    if (feedbackEl) {
      feedbackEl.textContent = `✓ Copied ${type.toUpperCase()} to clipboard!`;
      setTimeout(() => {
        feedbackEl.textContent = '';
      }, 2500);
    }
  }

  _downloadSvgFile() {
    if (this.unlockedBadgeIds.size === 0) return;
    const previewEl = document.getElementById('badge-live-preview');
    if (!previewEl) return;

    const svg = previewEl.innerHTML.trim();
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const callsign = (this.profile?.callsign || 'scriptadept').toLowerCase();

    const a = document.createElement('a');
    a.href = url;
    a.download = `syntaxarena-${callsign}-${this.badgeStudioState.style}-badge.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Global browser attachments
if (typeof window !== 'undefined') {
  window.BadgeGenerator = BadgeGenerator;
  window.TrophyVault = TrophyVault;
  window.RARITY_CONFIG = RARITY_CONFIG;
  window.mapBadgeRarity = mapBadgeRarity;
}

