/**
 * Playwright E2E verification test for Item 14:
 * Ensure Intermediate level is strictly locked after account reset.
 */

import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const PORT = 8098;
const BASE_URL = `http://localhost:${PORT}`;

function createStaticServer() {
  const rootDir = process.cwd();
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(rootDir, reqPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(data);
    });
  });
}

async function runTest() {
  const server = createStaticServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test Server running on ${BASE_URL}`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  try {
    console.log('\n--- 1. Set up an account with intermediate unlocked ---');
    await page.goto(`${BASE_URL}/index.html`);
    await page.waitForTimeout(500);

    // Simulate an account that previously had 1200 XP and intermediate unlocked
    await page.evaluate(() => {
      const storageKey = 'syntaxarena_storage_v1';
      const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (stored.profiles && stored.profiles[0]) {
        stored.profiles[0].xp = 1200;
        stored.profiles[0].totalScore = 1200;
        stored.profiles[0].campaign.python.unlockedTier = 'intermediate';
        stored.profiles[0].campaign.python.beginnerStars = 15;
      }
      localStorage.setItem(storageKey, JSON.stringify(stored));
    });

    await page.goto(`${BASE_URL}/index.html`);
    await page.waitForTimeout(500);

    // Verify intermediate was unlocked before reset
    const intCardBefore = page.locator('#difficulty-cards-container .card-selectable[data-diff="intermediate"]');
    const classesBefore = await intCardBefore.getAttribute('class');
    console.log('Intermediate card classes BEFORE reset:', classesBefore);
    assert(!classesBefore.includes('is-locked'), 'Intermediate was unlocked before reset');

    console.log('\n--- 2. Perform Account Reset via Settings ---');
    await page.goto(`${BASE_URL}/settings.html`);
    await page.waitForSelector('#btn-reset-data');

    // Auto-confirm window.confirm
    page.on('dialog', async dialog => {
      console.log('Dialog detected:', dialog.message());
      await dialog.accept();
    });

    await page.click('#btn-reset-data');
    await page.waitForTimeout(1000);

    // Verify redirected to index.html
    console.log('URL after reset:', page.url());
    assert(page.url().includes('index.html'), 'Redirected to index.html after reset');

    console.log('\n--- 3. Verify Intermediate Difficulty Card on Landing Hub is STRICTLY LOCKED ---');
    const intCardAfter = page.locator('#difficulty-cards-container .card-selectable[data-diff="intermediate"]');
    const classesAfter = await intCardAfter.getAttribute('class');
    const ariaDisabled = await intCardAfter.getAttribute('aria-disabled');
    const badgeText = await page.locator('#diff-badge-intermediate').textContent();
    const statusText = await page.locator('#diff-status-intermediate').textContent();
    const indicator = await intCardAfter.locator('.selection-indicator').textContent();

    console.log('Intermediate card classes AFTER reset:', classesAfter);
    console.log('aria-disabled:', ariaDisabled);
    console.log('badgeText:', badgeText);
    console.log('statusText:', statusText);
    console.log('indicator:', indicator);

    assert(classesAfter.includes('is-locked'), 'Intermediate card has is-locked class');
    assert(ariaDisabled === 'true', 'Intermediate card has aria-disabled=true');
    assert(indicator.includes('🔒'), 'Intermediate indicator shows lock');
    assert(statusText.includes('Locked'), 'Status text shows Locked');

    console.log('\n--- 4. Verify Clicking Intermediate Card is Blocked with Toast ---');
    await intCardAfter.click({ force: true });
    await page.waitForTimeout(300);

    const toast = await page.locator('.toast').last().textContent();
    console.log('Click Toast:', toast);
    assert(toast.includes('Intermediate is locked'), 'Toast announces Intermediate is locked');

    console.log('\n--- 5. Verify Section E Progression Roadmap Tier 2 is tier-locked ---');
    const roadmapCard = page.locator('#roadmap-tier-intermediate');
    const roadmapClasses = await roadmapCard.getAttribute('class');
    const roadmapWatermark = await page.locator('#roadmap-watermark-intermediate').textContent();
    const roadmapStatus = await page.locator('#roadmap-status-intermediate').textContent();

    console.log('Roadmap Tier 2 classes:', roadmapClasses);
    console.log('Roadmap Tier 2 watermark:', roadmapWatermark);
    console.log('Roadmap Tier 2 status:', roadmapStatus);

    assert(roadmapClasses.includes('tier-locked'), 'Roadmap Tier 2 card has tier-locked class');
    assert(roadmapWatermark.includes('Locked'), 'Roadmap watermark says Locked');
    assert(roadmapStatus.includes('Locked'), 'Roadmap status says Locked');

    console.log('\n--- 6. Verify Direct Navigation to game.html with diff=intermediate Reverts to Beginner ---');
    await page.goto(`${BASE_URL}/game.html?lang=python&diff=intermediate&stage=1`);
    await page.waitForTimeout(600);

    await page.waitForSelector('#q-diff-badge');
    const activeDiffBadge = await page.locator('#q-diff-badge').textContent();
    console.log('HUD Diff Badge when attempting intermediate URL:', activeDiffBadge);
    assert(activeDiffBadge.toLowerCase().includes('beginner'), 'Reverted to Beginner in Arena HUD');

    console.log('\n🎉 ALL ITEM 14 INTERMEDIATE RESET LOCK TESTS PASSED!');
  } finally {
    await browser.close();
    server.close();
  }
}

runTest().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
