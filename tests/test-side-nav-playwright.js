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
