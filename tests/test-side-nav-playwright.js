/**
 * Playwright E2E Test Suite for Items 14 & 16:
 * Multi-Provider Authentication & Collapsible Side Navigation Bar
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const PORT = 8138;
const BASE_URL = `http://localhost:${PORT}`;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav'
};

function createTestServer() {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0].split('#')[0];
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(projectRoot, reqPath.startsWith('/') ? reqPath.slice(1) : reqPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      }
    });
  });
}

async function runSideNavAndAuthPlaywrightSuite() {
  console.log('============================================================');
  console.log('🚀 RUNNING SIDEBAR & MULTI-AUTH PLAYWRIGHT E2E SUITE');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warn') {
      console.log(`[Browser ${msg.type()}]`, msg.text());
    }
  });
  page.on('pageerror', err => {
    console.log('[Browser PageError]', err);
  });

  try {
    // -------------------------------------------------------------
    // 1. Desktop Shell & Sidebar Activity Rail Presence
    // -------------------------------------------------------------
    console.log('--- 1. Desktop Shell & Sidebar Activity Rail ---');
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const sidebar = await page.$('#app-sidebar');
    assert(sidebar !== null, 'Side Navigation Bar (#app-sidebar) mounted in DOM');

    const topbar = await page.$('.app-topbar');
    assert(topbar !== null, 'Sleek compact topbar (.app-topbar) mounted in DOM');

    const viewport = await page.$('.app-viewport');
    assert(viewport !== null, 'Main viewport (.app-viewport) mounted beside sidebar');

    const initialCollapsed = await page.evaluate(() => {
      const el = document.getElementById('app-sidebar');
      return el ? el.classList.contains('is-collapsed') : false;
    });
    assert(initialCollapsed === true, 'Sidebar defaults to compact 68px collapsed rail on desktop');

    // -------------------------------------------------------------
    // 2. Toggle Sidebar (Button Click & Keyboard Shortcut Ctrl+B)
    // -------------------------------------------------------------
    console.log('\n--- 2. Toggle Sidebar (Button & Ctrl+B) ---');
    const toggleBtn = await page.$('#btn-sidebar-toggle');
    assert(toggleBtn !== null, 'Sidebar toggle button (#btn-sidebar-toggle) present');
    await toggleBtn.click();
    await page.waitForTimeout(250);

    const isExpanded = await page.evaluate(() => {
      const el = document.getElementById('app-sidebar');
      return el ? !el.classList.contains('is-collapsed') : false;
    });
    assert(isExpanded === true, 'Clicking toggle button expands sidebar to 240px drawer');

    // Toggle back via Ctrl+B shortcut
    await page.keyboard.press('Control+b');
    await page.waitForTimeout(250);

    const isCollapsedAgain = await page.evaluate(() => {
      const el = document.getElementById('app-sidebar');
      return el ? el.classList.contains('is-collapsed') : false;
    });
    assert(isCollapsedAgain === true, 'Pressing Ctrl+B collapses sidebar back to 68px icon rail');

    // -------------------------------------------------------------
    // 3. Cloud Sync Pill & Auth Modal Dialog Triggers
    // -------------------------------------------------------------
    console.log('\n--- 3. Cloud Sync Pill & Auth Modal Triggers ---');
    const syncPill = await page.$('#btn-open-auth');
    assert(syncPill !== null, 'Cloud sync status pill present in topbar');

    const pillText = await syncPill.textContent();
    assert(pillText.includes('Guest'), 'Pill initially displays Guest Mode');

    // Open Auth Modal via pill click
    await syncPill.click();
    await page.waitForTimeout(250);

    const authModal = await page.$('#modal-auth');
    assert(authModal !== null, 'Authentication modal mounted');
    const isModalVisible = await authModal.isVisible();
    assert(isModalVisible === true, 'Clicking cloud sync pill opens #modal-auth dialog');

    // -------------------------------------------------------------
    // 4. Multi-Provider OAuth Buttons (Google, GitHub, Apple)
    // -------------------------------------------------------------
    console.log('\n--- 4. Multi-Provider OAuth Buttons ---');
    const btnGoogle = await page.$('#btn-oauth-google');
    const btnGitHub = await page.$('#btn-oauth-github');
    const btnApple = await page.$('#btn-oauth-apple');
    assert(btnGoogle !== null && btnGitHub !== null && btnApple !== null, 'Google, GitHub, and Apple ID OAuth buttons present');

    // Click Google OAuth
    await btnGoogle.click();
    await page.waitForTimeout(600);

    const updatedPillText = await page.evaluate(() => {
      const el = document.getElementById('btn-open-auth');
      return el ? el.textContent : '';
    });
    assert(updatedPillText.includes('Synced as'), 'Google OAuth connects and updates cloud sync pill to Synced status');

    // -------------------------------------------------------------
    // 5. Mobile Responsiveness & Bottom Dock (< 768px)
    // -------------------------------------------------------------
    console.log('\n--- 5. Mobile Responsiveness & Bottom Dock ---');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    const bottomDock = await page.$('.mobile-bottom-dock');
    assert(bottomDock !== null, 'Mobile bottom dock mounted');
    const isDockVisible = await bottomDock.isVisible();
    assert(isDockVisible === true, 'Mobile bottom navigation dock visible on mobile viewport (390px)');

    const dockLinks = await page.$$('.mobile-dock-link');
    assert(dockLinks.length === 5, 'Found 5 thumb-friendly routes in mobile dock');

    // -------------------------------------------------------------
    // 6. Mobile Sidebar Drawer: Open, Item Select Close, & Backdrop (Issue 1)
    // -------------------------------------------------------------
    console.log('\n--- 6. Mobile Sidebar Drawer: Item Select & Backdrop Close ---');
    const mobileToggleBtn = await page.$('#btn-sidebar-mobile-toggle');
    assert(mobileToggleBtn !== null, 'Mobile hamburger toggle (#btn-sidebar-mobile-toggle) present on mobile');

    // Click mobile toggle to open sidebar drawer
    await mobileToggleBtn.click();
    await page.waitForTimeout(300);

    let isMobileOpen = await page.evaluate(() => {
      const el = document.getElementById('app-sidebar');
      return el ? el.classList.contains('is-mobile-open') : false;
    });
    assert(isMobileOpen === true, 'Clicking mobile toggle opens sidebar drawer (.is-mobile-open)');

    const backdrop = await page.$('#sidebar-backdrop');
    assert(backdrop !== null, 'Glassmorphic backdrop overlay (#sidebar-backdrop) present in DOM');
    const isBackdropOpen = await page.evaluate(() => {
      const el = document.getElementById('sidebar-backdrop');
      return el ? el.classList.contains('is-open') : false;
    });
    assert(isBackdropOpen === true, 'Backdrop active (.is-open) when mobile drawer is open');

    // Test Issue 1 Fix: Clicking any route inside sidebar closes drawer
    const hubLink = await page.$('.sidebar-link[href="index.html"]');
    assert(hubLink !== null, 'Sidebar nav item present');
    await hubLink.click();
    await page.waitForTimeout(300);

    isMobileOpen = await page.evaluate(() => {
      const el = document.getElementById('app-sidebar');
      return el ? el.classList.contains('is-mobile-open') : false;
    });
    assert(isMobileOpen === false, 'Clicking navigation link inside sidebar closes drawer (Issue 1 verified)');

    // Re-open and test backdrop click dismiss
    const mobileBtnAgain = await page.$('#btn-sidebar-mobile-toggle');
    await mobileBtnAgain.click();
    await page.waitForTimeout(300);
    // Tap outside the 280px sidebar drawer onto the dimmed backdrop (e.g. at x=340, y=300 on a 390px phone screen)
    await page.mouse.click(340, 300);
    await page.waitForTimeout(300);

    isMobileOpen = await page.evaluate(() => {
      const el = document.getElementById('app-sidebar');
      return el ? el.classList.contains('is-mobile-open') : false;
    });
    assert(isMobileOpen === false, 'Tapping outside on backdrop closes mobile drawer');

    // Re-open and test header close toggle
    await mobileBtnAgain.click();
    await page.waitForTimeout(300);
    const headerToggleBtn = await page.$('#btn-sidebar-toggle');
    await headerToggleBtn.click();
    await page.waitForTimeout(300);

    isMobileOpen = await page.evaluate(() => {
      const el = document.getElementById('app-sidebar');
      return el ? el.classList.contains('is-mobile-open') : false;
    });
    assert(isMobileOpen === false, 'Tapping sidebar header button on mobile closes drawer');

    // -------------------------------------------------------------
    // 7. Admin Panel Registered Credentials Security View (Issue 3)
    // -------------------------------------------------------------
    console.log('\n--- 7. Admin Panel Credentials Security Audit ---');
    await page.goto(`${BASE_URL}/admin.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    // Bypass admin gate by setting valid session token
    await page.evaluate(() => {
      sessionStorage.setItem('syntaxarena_admin_session', JSON.stringify({ user: 'admin', expiry: Date.now() + 3600000 }));
      // Seed a test OAuth user and an email user in auth storage
      const authData = {
        users: [
          {
            id: 'usr-google-test',
            email: 'hacker@google.com',
            displayName: 'GoogleCyberSamurai',
            provider: 'google',
            providerUserId: 'sub-1092837465',
            avatarUrl: 'assets/images/cyber_fox.svg',
            createdAt: Date.now() - 86400000,
            lastLoginAt: Date.now()
          },
          {
            id: 'usr-email-test',
            email: 'sec-analyst@syntaxarena.cloud',
            displayName: 'SecAnalyst',
            provider: 'email',
            salt: 'salt-99f8a',
            pwdHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
            avatarUrl: 'assets/images/matrix_cat.svg',
            createdAt: Date.now() - 3600000,
            lastLoginAt: Date.now()
          }
        ],
        activeUserId: 'usr-google-test',
        updatedAt: Date.now()
      };
      localStorage.setItem('syntaxarena_auth_v1', JSON.stringify(authData));
    });

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    const credSection = await page.$('#admin-auth-credentials-section');
    assert(credSection !== null, 'Registered credentials security section present in Admin panel');

    const credTable = await page.$('#admin-credentials-table');
    assert(credTable !== null, 'Admin credentials audit table (#admin-credentials-table) mounted');

    const credRows = await page.$$('#admin-credentials-tbody tr');
    assert(credRows.length === 2, 'Admin credentials table renders both registered accounts (Google OAuth & Email)');

    const tableContent = await page.evaluate(() => {
      const el = document.getElementById('admin-credentials-tbody');
      return el ? el.textContent : '';
    });
    assert(tableContent.includes('hacker@google.com') && tableContent.includes('sec-analyst@syntaxarena.cloud'), 'Emails rendered in security table');
    assert(tableContent.includes('SHA-256 Salted Hash') && tableContent.includes('Token Verified'), 'Cryptographic state and OAuth token status shown for security audit');

    // -------------------------------------------------------------
    // 8. Cross-Device Cloud Sync Handshake & 360px Fluid Shrink (Issues 4, 5, 6)
    // -------------------------------------------------------------
    console.log('\n--- 8. Cross-Device Sync & 360px Fluid Scaling ---');
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(`${BASE_URL}/game.html?lang=python&difficulty=beginner`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Verify fluid scaling on 360px phone screen
    const arenaCard = await page.$('#arena-card');
    assert(arenaCard !== null, 'Arena card mounted on 360px viewport');

    const arenaCardBox = await arenaCard.boundingBox();
    assert(arenaCardBox.width <= 360, 'Card width cleanly clamped to <= 360px without horizontal overflow');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assert(scrollWidth <= 360, `No horizontal page blowout on 360px screen (scrollWidth=${scrollWidth}px)`);

    // Verify Cloud Sync link generator and restore
    const syncLink = await page.evaluate(() => {
      if (typeof window.Auth !== 'undefined' && typeof window.Auth.generateSyncLink === 'function') {
        return window.Auth.generateSyncLink();
      }
      return '';
    });
    assert(syncLink.includes('sync_data='), 'Auth.generateSyncLink() generates one-click transfer URL');

  } catch (err) {
    console.error('Unexpected error in E2E suite:', err);
    failed++;
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n============================================================');
  console.log(`SIDEBAR & AUTH PLAYWRIGHT SUITE: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================');

  if (failed > 0) process.exit(1);
}

runSideNavAndAuthPlaywrightSuite();
