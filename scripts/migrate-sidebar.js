import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const pages = [
  { file: 'game.html', current: 'arena' },
  { file: 'memory-games.html', current: 'mem' },
  { file: 'learn.html', current: 'academy' },
  { file: 'sandbox.html', current: 'sandbox' },
  { file: 'progress.html', current: 'career' },
  { file: 'settings.html', current: 'settings' },
  { file: 'admin.html', current: 'admin' },
  { file: 'results.html', current: 'career' }
];

function getSidebarHtml(current) {
  const isPage = (name) => current === name ? ' aria-current="page"' : '';
  return `  <!-- Master App Shell (Item 16) -->
  <div class="app-shell" id="app-shell">
    <!-- Collapsible Side Navigation Bar (Item 16) -->
    <aside class="app-sidebar is-collapsed" id="app-sidebar" aria-label="Main Navigation">
      <!-- Sidebar Header: Brand & Collapse Toggle -->
      <div class="sidebar-header">
        <a href="index.html" class="sidebar-brand" aria-label="SyntaxArena Home">
          <span class="brand-badge" style="width: 34px; height: 34px;">
            <img src="assets/images/logo.svg" width="20" height="20" alt="SyntaxArena Logo">
          </span>
          <span class="sidebar-brand-text">SyntaxArena</span>
        </a>
        <button type="button" class="btn-sidebar-toggle" id="btn-sidebar-toggle" title="Toggle Sidebar (Ctrl+B)" aria-label="Toggle Navigation Sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

      <!-- Primary Navigation Links (App Nav) -->
      <nav class="app-nav sidebar-nav" aria-label="Sidebar Navigation">
        <a href="index.html" class="nav-link sidebar-link" data-tooltip="Hub"${isPage('hub')}>
          <span class="sidebar-icon"><svg class="nav-icon"><use href="#icon-code"></use></svg></span>
          <span class="sidebar-label">Hub</span>
        </a>
        <a href="game.html" class="nav-link sidebar-link" data-tooltip="Arena"${isPage('arena')}>
          <span class="sidebar-icon"><svg class="nav-icon"><use href="#icon-gamepad"></use></svg></span>
          <span class="sidebar-label">Arena</span>
        </a>
        <a href="memory-games.html" class="nav-link sidebar-link" data-tooltip="Memory Lab"${isPage('mem')}>
          <span class="sidebar-icon"><svg class="nav-icon"><use href="#icon-zap"></use></svg></span>
          <span class="sidebar-label">Memory Lab</span>
        </a>
        <a href="learn.html" class="nav-link sidebar-link" data-tooltip="Academy"${isPage('academy')}>
          <span class="sidebar-icon"><svg class="nav-icon"><use href="#icon-bulb"></use></svg></span>
          <span class="sidebar-label">Academy</span>
        </a>
        <a href="sandbox.html" class="nav-link sidebar-link" data-tooltip="Sandbox"${isPage('sandbox')}>
          <span class="sidebar-icon"><svg class="nav-icon"><use href="#icon-code"></use></svg></span>
          <span class="sidebar-label">Sandbox</span>
        </a>
        <a href="progress.html" class="nav-link sidebar-link" data-tooltip="Career"${isPage('career')}>
          <span class="sidebar-icon"><svg class="nav-icon"><use href="#icon-trophy"></use></svg></span>
          <span class="sidebar-label">Career</span>
        </a>
      </nav>

      <!-- Sidebar Footer: Battlestation, Settings, Auth Profile -->
      <div class="sidebar-footer">
        <a href="settings.html#section-battlestation" class="sidebar-link" data-tooltip="Battlestation">
          <span class="sidebar-icon">🖥️</span>
          <span class="sidebar-label">Battlestation</span>
        </a>
        <a href="settings.html" class="sidebar-link" data-tooltip="Settings"${isPage('settings')}>
          <span class="sidebar-icon"><svg class="nav-icon"><use href="#icon-settings"></use></svg></span>
          <span class="sidebar-label">Settings</span>
        </a>
        <div class="sidebar-auth-card" id="sidebar-auth-card" title="Click to open Cloud Sync & Auth">
          <img src="assets/images/cyber_fox.svg" width="28" height="28" alt="avatar" id="sidebar-profile-avatar" style="border-radius: 50%; flex-shrink: 0;">
          <div class="sidebar-auth-meta">
            <span class="sidebar-auth-name" id="sidebar-profile-name">ScriptAdept</span>
            <span class="sidebar-auth-status" id="sidebar-profile-rank">
              <span class="cloud-sync-dot status-guest"></span>
              <span>Local Guest</span>
            </span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Master Viewport Beside Sidebar -->
    <div class="app-viewport">
      <!-- Sleek Compact Topbar -->
      <header class="app-topbar">
        <div class="topbar-left">
          <button type="button" class="btn-sidebar-toggle" id="btn-sidebar-mobile-toggle" aria-label="Open Navigation Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <a href="progress.html" id="header-user-level-badge" class="header-level-pill" title="Player Level & Progression" style="display: none;">
            <span class="header-level-tag">Lv.1</span>
            <span class="header-xp-rem">250 XP to Lv.2</span>
          </a>
        </div>

        <div class="topbar-right">
          <!-- Cloud Sync Status Pill (Item 14) -->
          <button type="button" class="cloud-sync-pill" id="btn-open-auth" title="Click to Sign In or Link Cloud Account">
            <span class="cloud-sync-dot status-guest"></span>
            <span>Guest Mode</span>
          </button>

          <!-- Quick Action Button -->
          <a href="game.html" id="btn-nav-play" class="btn-arcade btn-primary btn-sm" aria-label="Quick launch Battle Arena" style="padding: 0.35rem 0.75rem; font-size: 11px; text-decoration: none;">
            ⚔️ Play Arena
          </a>

          <!-- Theme & Sound Toggles -->
          <button id="btn-theme-toggle" class="btn-icon-toggle" aria-label="Toggle color theme" title="Toggle color theme">
            <svg width="18" height="18" aria-hidden="true"><use href="#icon-sun"></use></svg>
          </button>
          <button id="btn-sound-toggle" class="btn-icon-toggle" aria-label="Toggle sound effects" title="Toggle sound effects">
            <svg width="18" height="18" aria-hidden="true"><use href="#icon-volume"></use></svg>
          </button>

          <!-- Profile Pill -->
          <a href="settings.html" class="profile-pill" aria-label="User profile and settings">
            <span class="profile-avatar-mini" aria-hidden="true">
              <img src="assets/images/cyber_fox.svg" width="22" height="22" alt="avatar" style="border-radius: 50%;">
            </span>
            <span class="profile-name">ScriptAdept</span>
          </a>
        </div>
      </header>`;
}

function getMobileDockHtml(current) {
  const isPage = (name) => current === name ? ' aria-current="page"' : '';
  return `    </div> <!-- /.app-viewport -->

    <!-- Mobile Bottom Navigation Dock (Item 16) -->
    <nav class="mobile-bottom-dock" aria-label="Mobile Navigation">
      <a href="index.html" class="mobile-dock-link"${isPage('hub')}>
        <span class="mobile-dock-icon">🏠</span>
        <span>Hub</span>
      </a>
      <a href="game.html" class="mobile-dock-link"${isPage('arena')}>
        <span class="mobile-dock-icon">🎮</span>
        <span>Arena</span>
      </a>
      <a href="memory-games.html" class="mobile-dock-link"${isPage('mem')}>
        <span class="mobile-dock-icon">🧠</span>
        <span>Lab</span>
      </a>
      <a href="learn.html" class="mobile-dock-link"${isPage('academy')}>
        <span class="mobile-dock-icon">⚡</span>
        <span>Academy</span>
      </a>
      <a href="sandbox.html" class="mobile-dock-link"${isPage('sandbox')}>
        <span class="mobile-dock-icon">💻</span>
        <span>REPL</span>
      </a>
    </nav>
  </div> <!-- /#app-shell -->`;
}

const authModalHtml = `  <!-- Multi-Provider Authentication Modal (Item 14) -->
  <div id="modal-auth" class="modal-backdrop" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" style="display: none;">
    <div class="modal-dialog card card-raised">
      <div class="auth-modal-header">
        <h3 id="auth-modal-title" class="auth-modal-title">
          <span>🛡️</span>
          <span>SyntaxArena Cloud Sync</span>
        </h3>
        <button type="button" class="btn-icon" id="btn-close-auth" aria-label="Close Authentication Dialog" style="background: transparent; border: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer;">✕</button>
      </div>

      <div class="auth-modal-body">
        <!-- Guest Status Notice -->
        <div class="auth-guest-notice" id="auth-guest-banner">
          <strong>⚡ Cloud Backup &amp; Sync:</strong> Sign in with Google, GitHub, Apple ID, or Email to preserve your XP, levels, 14 avatars, and 33 badges across all devices.
        </div>

        <!-- Alert Notification Box -->
        <div id="auth-alert" class="auth-alert-banner"></div>

        <!-- Tabs: Sign In / Create Account -->
        <div class="auth-tabs-row" role="tablist">
          <button type="button" class="auth-tab-btn is-active" id="tab-auth-signin" role="tab" aria-selected="true">Sign In</button>
          <button type="button" class="auth-tab-btn" id="tab-auth-signup" role="tab" aria-selected="false">Create Account</button>
        </div>

        <!-- Social OAuth 2.0 Providers -->
        <div class="auth-oauth-buttons">
          <button type="button" class="btn-oauth btn-oauth-google" id="btn-oauth-google">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            <span>Continue with Google</span>
          </button>

          <button type="button" class="btn-oauth btn-oauth-github" id="btn-oauth-github">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            <span>Continue with GitHub</span>
          </button>

          <button type="button" class="btn-oauth btn-oauth-apple" id="btn-oauth-apple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.12.64-2.79 1.43-.57.67-.99 1.74-.94 2.79 1.08.08 2.14-.57 2.72-1.35z"/></svg>
            <span>Sign in with Apple</span>
          </button>
        </div>

        <div class="auth-divider">
          <span>Or with Email</span>
        </div>

        <!-- Form for Email & Password -->
        <form id="auth-form" autocomplete="on">
          <div class="auth-field" id="auth-field-name" style="display: none;">
            <label for="auth-name">Player Callsign / Display Name</label>
            <input type="text" id="auth-name" class="auth-input" placeholder="e.g. CyberSamurai" maxlength="24">
          </div>

          <div class="auth-field">
            <label for="auth-email">Email Address</label>
            <input type="email" id="auth-email" class="auth-input" placeholder="hacker@syntaxarena.cloud" required>
          </div>

          <div class="auth-field">
            <label for="auth-password">Password</label>
            <div class="auth-input-wrapper">
              <input type="password" id="auth-password" class="auth-input" placeholder="••••••••" required minlength="6">
              <button type="button" class="auth-eye-btn" id="btn-auth-toggle-pwd" aria-label="Toggle password visibility">👁️</button>
            </div>
          </div>

          <button type="submit" class="btn-arcade btn-primary btn-block" id="btn-auth-submit" style="width: 100%; margin-top: 0.5rem; padding: 12px;">
            Sign In to SyntaxArena
          </button>
        </form>

        <!-- Sign Out Option (Visible if currently logged in) -->
        <div style="margin-top: 1rem; text-align: center;">
          <button type="button" id="btn-auth-signout" class="btn-arcade btn-neutral btn-sm" style="font-size: 11px; padding: 4px 12px; border-color: rgba(244, 63, 94, 0.4); color: #fda4af;">
            🚪 Sign Out (Return to Guest)
          </button>
        </div>
      </div>
    </div>
  </div>`;

for (const p of pages) {
  const filePath = path.join(rootDir, p.file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Add auth.css to head if missing
  if (!content.includes('css/auth.css')) {
    content = content.replace('</head>', '  <link rel="stylesheet" href="css/auth.css">\n</head>');
  }

  // 2. Replace <header class="app-header">...</header> with sidebar shell
  const headerRegex = /<!--\s*(Header Shell|Application Shell Header|App Header)\s*-->[\s\S]*?<header class="app-header">[\s\S]*?<\/header>/i;
  if (headerRegex.test(content)) {
    content = content.replace(headerRegex, getSidebarHtml(p.current));
  } else {
    // Try without leading comment
    const altHeader = /<header class="app-header">[\s\S]*?<\/header>/i;
    if (altHeader.test(content)) {
      content = content.replace(altHeader, getSidebarHtml(p.current));
    } else {
      console.warn(`Could not find header in ${p.file}`);
    }
  }

  // 3. Wrap main/footer closing with mobile dock & app-shell closing
  // Find <footer class="app-footer">...</footer> or </main>
  if (content.includes('</footer>') && !content.includes('class="mobile-bottom-dock"')) {
    content = content.replace(/<\/footer>/, `</footer>\n${getMobileDockHtml(p.current)}`);
  } else if (!content.includes('class="mobile-bottom-dock"')) {
    content = content.replace(/<\/main>/, `</main>\n${getMobileDockHtml(p.current)}`);
  }

  // 4. Add auth modal before bundle script if not present
  if (!content.includes('id="modal-auth"')) {
    content = content.replace('<script src="js/bundle.js">', `${authModalHtml}\n\n  <script src="js/bundle.js">`);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  // Mirror to public/
  const publicPath = path.join(publicDir, p.file);
  fs.writeFileSync(publicPath, content, 'utf-8');
  console.log(`Migrated ${p.file} and public/${p.file} successfully.`);
}

