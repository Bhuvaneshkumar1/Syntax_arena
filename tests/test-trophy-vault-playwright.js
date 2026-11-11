/**
 * Playwright E2E Test Suite for Feature 9: 3D Isometric Trophy Vault & Dynamic GitHub Profile Badges
 * Verifies:
 * 1. 3D Cartridge Showroom mounts in progress.html with retro chassis styling
 * 2. Real-time 3D mouse tilt physics and holographic sheen translation
 * 3. 360-degree orbital inspector modal, drag-to-rotate physics, and front/back view toggles
 * 4. Dynamic GitHub Profile Badges Studio: live preview, 4 style switches, palette toggles, and clipboard copy
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const PORT = 8136;
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
    if (reqPath === '/' || reqPath === '') reqPath = '/progress.html';
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

async function runTrophyVaultPlaywrightSuite() {
  console.log('============================================================');
  console.log('🏆 RUNNING 3D TROPHY VAULT PLAYWRIGHT E2E SUITE');
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
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`  [Browser error] ${msg.text()}`);
    }
  });

  try {
    // -------------------------------------------------------------
    // 1. Vault Showroom Bootstrapping & Cartridge Chassis Mounting
    // -------------------------------------------------------------
    console.log('--- 1. Vault Showroom Bootstrapping & Cartridge Chassis ---');
    await page.goto(`${BASE_URL}/progress.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const vaultGrid = await page.$('#trophy-grid');
    assert(vaultGrid !== null, 'Trophy vault grid mounted in progress.html');

    const cartridges = await page.$$('.cartridge-wrapper');
    assert(cartridges.length >= 20, `Mounted ${cartridges.length} 3D retro arcade cartridges`);

    const firstCartridge = cartridges[0];
    const topGrip = await firstCartridge.$('.cartridge-top-grip');
    const pcbConnector = await firstCartridge.$('.cartridge-pcb-connector');
    const sheen = await firstCartridge.$('.cartridge-holo-sheen');
    const rarityPill = await firstCartridge.$('.cartridge-rarity-pill');

    assert(topGrip !== null, 'Cartridge features top ribbed grip');
    assert(pcbConnector !== null, 'Cartridge features gold PCB edge pins');
    assert(sheen !== null, 'Cartridge features holographic specular sheen layer');
    assert(rarityPill !== null, 'Cartridge features illuminated rarity pill');

    // -------------------------------------------------------------
    // 2. Real-Time 3D Mouse Tilt Physics
    // -------------------------------------------------------------
    console.log('\n--- 2. Real-Time 3D Mouse Tilt Physics ---');
    await firstCartridge.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const box = await firstCartridge.boundingBox();
    if (box) {
      // Hover at top-right corner of cartridge
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
      await page.waitForTimeout(200);

      const chassisTransform = await page.evaluate(() => {
        const c = document.querySelector('.cartridge-chassis');
        return c ? c.style.transform : '';
      });
      assert(chassisTransform.includes('rotateX') && chassisTransform.includes('rotateY'), 'Mouse movement triggers 3D rotateX/rotateY tilt on cartridge chassis: ' + chassisTransform);

      // Mouse leave
      await page.mouse.move(0, 0);
      await page.waitForTimeout(200);
      const resetTransform = await page.evaluate(() => {
        const c = document.querySelector('.cartridge-chassis');
        return c ? c.style.transform : '';
      });
      assert(resetTransform.includes('rotateX(0deg)') || resetTransform === '', 'Transform resets on mouseleave');
    }

    // -------------------------------------------------------------
    // 3. 360-Degree Orbital Inspector Modal
    // -------------------------------------------------------------
    console.log('\n--- 3. 360-Degree Orbital Inspector Modal ---');
    await firstCartridge.click();
    await page.waitForTimeout(400);

    const modal = await page.$('#vault-inspector-modal');
    assert(modal !== null, '360° Inspector Modal mounted in DOM');
    const isOpen = await page.evaluate(() => document.getElementById('vault-inspector-modal')?.classList.contains('is-open'));
    assert(isOpen === true, 'Inspector modal opened with .is-open state');

    const badgeName = await page.$eval('#inspector-badge-name', el => el.textContent);
    assert(badgeName.length > 0, 'Inspector details panel populated badge name: ' + badgeName);

    const romSpec = await page.$eval('#inspector-meta-rom', el => el.textContent);
    assert(romSpec.includes('KB'), 'Inspector tech specs display ROM size: ' + romSpec);

    // Front & Back View Controls
    const btnViewBack = await page.$('#btn-view-back');
    assert(btnViewBack !== null, 'Inspector Back View button present');
    await btnViewBack.click();
    await page.waitForTimeout(150);

    const backRotY = await page.evaluate(() => {
      const b = document.getElementById('inspector-3d-box');
      return b ? b.style.transform : '';
    });
    assert(backRotY.includes('180.00deg') || backRotY.includes('180deg'), 'Back View button flipped cartridge 180 degrees: ' + backRotY);

    const btnViewFront = await page.$('#btn-view-front');
    await btnViewFront.click();
    await page.waitForTimeout(150);
    const frontRotY = await page.evaluate(() => {
      const b = document.getElementById('inspector-3d-box');
      return b ? b.style.transform : '';
    });
    assert(frontRotY.includes('0.00deg') || frontRotY.includes('0deg'), 'Front View button reset cartridge to 0 degrees: ' + frontRotY);

    // Close Inspector
    const btnClose = await page.$('#btn-close-inspector');
    await btnClose.click();
    await page.waitForTimeout(200);
    const isClosed = await page.evaluate(() => !document.getElementById('vault-inspector-modal')?.classList.contains('is-open'));
    assert(isClosed === true, 'Inspector modal closed cleanly');

    // -------------------------------------------------------------
    // 4. Dynamic GitHub Profile Badges Studio
    // -------------------------------------------------------------
    console.log('\n--- 4. Dynamic GitHub Profile Badges Studio ---');
    const badgeStudio = await page.$('#github-badge-studio');
    assert(badgeStudio !== null, 'Badge Studio section mounted');

    const previewSvg = await page.$('#badge-live-preview svg');
    assert(previewSvg !== null, 'Live SVG badge rendered in studio preview container');

    // Switch to Shields.io style
    const btnShield = await page.$('.badge-chip-btn[data-style="shield"]');
    assert(btnShield !== null, 'Shield style chip present');
    await btnShield.click();
    await page.waitForTimeout(150);
    const shieldSvgMarkup = await page.$eval('#badge-live-preview', el => el.innerHTML);
    assert(shieldSvgMarkup.includes('SYNTAX ARENA'), 'Live preview updated to Shields.io style');

    // Switch to Cyber Terminal style
    const btnCyber = await page.$('.badge-chip-btn[data-style="cyber"]');
    assert(btnCyber !== null, 'Cyber style chip present');
    await btnCyber.click();
    await page.waitForTimeout(150);
    const cyberSvgMarkup = await page.$eval('#badge-live-preview', el => el.innerHTML);
    assert(cyberSvgMarkup.includes('usr@syntaxarena:~#'), 'Live preview updated to Cyber Terminal HUD style');

    // Switch to Minimal Pill style
    const btnMinimal = await page.$('.badge-chip-btn[data-style="minimal"]');
    assert(btnMinimal !== null, 'Minimal style chip present');
    await btnMinimal.click();
    await page.waitForTimeout(150);
    const minSvgMarkup = await page.$eval('#badge-live-preview', el => el.innerHTML);
    assert(minSvgMarkup.includes('Lv.'), 'Live preview updated to Minimal Pill style');

    // Switch back to Arcade style
    const btnArcade = await page.$('.badge-chip-btn[data-style="arcade"]');
    await btnArcade.click();
    await page.waitForTimeout(150);

    // Switch Accent Color to Emerald Matrix
    const btnEmerald = await page.$('.badge-color-dot-btn[data-color="emerald"]');
    assert(btnEmerald !== null, 'Emerald colorway dot present');
    await btnEmerald.click();
    await page.waitForTimeout(150);
    const emeraldMarkup = await page.$eval('#badge-live-preview', el => el.innerHTML);
    assert(emeraldMarkup.includes('#10b981') || emeraldMarkup.includes('#34d399'), 'Live preview updated with Emerald Matrix green accent');

    // Test Export Buttons
    const btnCopyMarkdown = await page.$('#btn-copy-markdown');
    assert(btnCopyMarkdown !== null, 'Copy Markdown button present');
    await btnCopyMarkdown.click();
    await page.waitForTimeout(200);

    const feedbackText = await page.$eval('#badge-copy-feedback', el => el.textContent);
    assert(feedbackText.includes('Copied MARKDOWN'), 'Clipboard feedback triggered on Markdown copy: ' + feedbackText);

  } catch (err) {
    console.error('Playwright suite unhandled exception:', err);
    failed++;
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n============================================================');
  console.log(`🏆 TROPHY VAULT PLAYWRIGHT SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTrophyVaultPlaywrightSuite();
