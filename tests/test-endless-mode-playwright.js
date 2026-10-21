import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import assert from 'assert';

const PORT = 8105;
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

async function runEndlessModeTest() {
  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test server listening on ${BASE_URL}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const page = await browser.newPage();

  try {
    console.log('\n--- 1. Testing QuestionBank 200 Questions Inventory Across All 8 Languages ---');
    await page.goto(`${BASE_URL}/index.html`);

    const counts = await page.evaluate(() => {
      const langs = ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql'];
      const res = {};
      langs.forEach(l => {
        const list = window.QuestionBank ? window.QuestionBank.getEndlessQuestions(l) : [];
        res[l] = list.length;
      });
      return res;
    });

    console.log('Endless Questions per language:', JSON.stringify(counts));
    assert.strictEqual(counts.python, 200, 'Python has 200 endless questions');
    assert.strictEqual(counts.c, 200, 'C has 200 endless questions');
    assert.strictEqual(counts.cpp, 200, 'C++ has 200 endless questions');
    assert.strictEqual(counts.java, 200, 'Java has 200 endless questions');
    assert.strictEqual(counts.cyber, 200, 'Cyber & Linux has 200 endless questions');
    assert.strictEqual(counts.javascript, 200, 'JavaScript has 200 endless questions');
    assert.strictEqual(counts.rust, 200, 'Rust has 200 endless questions');
    assert.strictEqual(counts.sql, 200, 'SQL has 200 endless questions');
    console.log('✓ PASS: All 8 languages provide exactly 200 questions for Endless mode');

    console.log('\n--- 2. Testing Challenge Showcase Card & Launcher in Hub ---');
    const endlessCardBtn = page.locator('#btn-showcase-endless');
    assert(await endlessCardBtn.isVisible(), 'Endless Mode launcher button visible in showcase');
    const showcaseHref = await endlessCardBtn.getAttribute('href');
    assert(showcaseHref.includes('mode=endless'), 'Showcase card links to mode=endless');
    console.log('✓ PASS: Challenge Showcase displays Endless Mode with direct launcher');

    console.log('\n--- 3. Testing Arena HUD & Endless Bank Button ---');
    await page.goto(`${BASE_URL}/game.html?lang=python&mode=endless`);
    await page.waitForSelector('#hud-step-counter');

    const stepText = await page.locator('#hud-step-counter').textContent();
    console.log('Step counter text:', stepText);
    assert(stepText.includes('200'), 'HUD indicates 200 total questions');
    assert(stepText.includes('Endless Mode'), 'HUD indicates Endless Mode');

    const diffBadge = await page.locator('#q-diff-badge').textContent();
    console.log('Difficulty badge:', diffBadge);
    assert(diffBadge.includes('ENDLESS POINT FARM'), 'Diff badge highlights Endless Point Farm');

    const bankBtn = page.locator('#btn-endless-bank');
    assert(await bankBtn.isVisible(), 'Bank Points button visible in Endless mode');
    console.log('✓ PASS: Arena initializes with 200 endless questions and Bank Points action');

    console.log('\n--- 4. Testing Point Farming & Cashing Out ---');
    await page.waitForSelector('.option-card, .line-pill-btn, #fill-code-input');

    const optionCards = page.locator('.option-card');
    const count = await optionCards.count();
    assert(count > 0, 'Question options rendered');

    // Answer first question
    await optionCards.first().click();
    const submitBtn = page.locator('#btn-submit-answer');
    await submitBtn.click();

    // Verify feedback rendered
    await page.waitForSelector('#feedback-panel', { state: 'visible' });

    // Bank points
    console.log('Clicking Bank Points & Finish button...');
    await bankBtn.click();

    // Wait for navigation to results
    await page.waitForURL(/results\.html/);
    console.log('Navigated to results URL:', page.url());

    const modeBadge = await page.locator('#results-mode-badge').textContent();
    console.log('Results mode badge:', modeBadge);
    assert(modeBadge.includes('Endless Farm'), 'Results displays Endless Farm mode badge');

    const playAgainBtn = page.locator('#btn-play-again');
    assert(await playAgainBtn.isVisible(), 'Play again button visible');
    const playAgainText = await playAgainBtn.textContent();
    assert(playAgainText.includes('Farm Endless Points Again'), 'Play again text offers replay of endless farm');
    console.log('✓ PASS: Successfully banked points and loaded run summary');

    console.log('\n========================================');
    console.log('🎉 ALL ENDLESS MODE TESTS PASSED CLEANLY');
    console.log('========================================\n');
  } finally {
    await browser.close();
    server.close();
  }
}

runEndlessModeTest().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
