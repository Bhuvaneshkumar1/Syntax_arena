import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import assert from 'assert';

const PORT = 8097;
const BASE_URL = `http://localhost:${PORT}`;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.wav': 'audio/wav'
};

function createTestServer() {
  const baseDir = path.resolve('.');
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0].split('#')[0];
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(baseDir, reqPath.startsWith('/') ? reqPath.slice(1) : reqPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
}

async function runResultsGuardTest() {
  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test Server listening on ${BASE_URL}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const page = await browser.newPage();

  try {
    console.log('\n--- 1. Testing Results Tab Lock in Arena while Playing ---');
    await page.goto(`${BASE_URL}/game.html?lang=python&diff=beginner&stage=1`);
    await page.waitForSelector('#answer-interface-container .option-card');

    // Verify Results link in header is disabled
    const resultsLink = page.locator('#nav-link-results');
    assert(await resultsLink.isVisible(), 'Results link exists in header');
    const classes = await resultsLink.getAttribute('class');
    const ariaDisabled = await resultsLink.getAttribute('aria-disabled');
    console.log('Results link classes:', classes, 'aria-disabled:', ariaDisabled);
    assert(classes.includes('is-disabled'), 'Results link has is-disabled class');
    assert(ariaDisabled === 'true', 'Results link has aria-disabled=true');

    // Click Results link and verify click is blocked with warning toast
    await resultsLink.click({ force: true });
    await page.waitForTimeout(300);

    // Verify page did NOT navigate away from game.html
    console.log('Current URL after click:', page.url());
    assert(page.url().includes('game.html'), 'Navigation was blocked, player remains on game.html');

    // Verify toast notification
    const toast = await page.locator('.toast').last().textContent();
    console.log('Results Click Toast:', toast);
    assert(toast.includes('Results tab is disabled while playing'), 'Informative warning toast shown');
    console.log('✓ PASS: In-game header Results tab blocked successfully!');

    console.log('\n--- 2. Testing Direct results.html URL Access while Game In Progress ---');
    await page.goto(`${BASE_URL}/results.html`);
    await page.waitForTimeout(400);

    const lockBannerHeading = await page.locator('h2').textContent();
    console.log('Results page heading while game active:', lockBannerHeading);
    assert(lockBannerHeading.includes('Game Currently In Progress'), 'Results page displays In Progress lock screen');

    const resumeBtn = page.locator('a:has-text("Resume Active Challenge")');
    assert(await resumeBtn.isVisible(), 'Resume game button is displayed');
    console.log('✓ PASS: Premature results viewing prevented!');

    console.log('\n🎉 ALL ITEM 13 RESULTS TAB GUARD CHECKS PASSED!');
  } finally {
    await browser.close();
    server.close();
  }
}

runResultsGuardTest().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
