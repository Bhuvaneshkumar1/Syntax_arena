import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import assert from 'assert';

const PORT = 8119;
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

async function runDailyGauntletTest() {
  console.log('============================================================');
  console.log('🧪 PLAYWRIGHT E2E: DAILY HACKER GAUNTLET & 7-DAY PUNCH CARD');
  console.log('============================================================\n');

  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`✓ Local test server running on ${BASE_URL}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  let passed = 0;
  let total = 0;

  function check(desc, cond) {
    total++;
    if (cond) {
      console.log(`  ✓ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
      throw new Error(`Assertion failed: ${desc}`);
    }
  }

  try {
    // 1. Load hub
    await page.goto(`${BASE_URL}/index.html`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // 2. Verify 7-day punch cards exist
    const cards = await page.$$('#daily-punch-matrix .punch-card');
    check('Punch matrix renders exactly 7 punch stamp cards', cards.length === 7);

    const day1Class = await cards[0].getAttribute('class');
    check('Day 1 punch card is active initially', day1Class.includes('is-active'));

    const day7Reward = await cards[6].$('.punch-reward-val');
    const day7RewardText = await day7Reward.innerText();
    check('Day 7 punch card displays +300 XP jackpot', day7RewardText.includes('+300 XP'));

    const streakPill = await page.$('#daily-streak-pill');
    const streakText = await streakPill.innerText();
    check('Streak pill shows initial streak count', streakText.toUpperCase().includes('STREAK'));

    const countdown = await page.$('#daily-countdown-timer');
    const countdownText = await countdown.innerText();
    check('Countdown timer displays hours and minutes', countdownText.includes('h') && countdownText.includes('m'));

    // 3. Open Daily Gauntlet modal
    const launchBtn = await page.$('#btn-launch-daily-gauntlet');
    check('Launch Daily Gauntlet CTA button exists', Boolean(launchBtn));
    await launchBtn.click();
    await page.waitForTimeout(300);

    const modal = await page.$('#modal-daily-gauntlet');
    const modalDisplay = await page.evaluate(el => window.getComputedStyle(el).display, modal);
    check('Gauntlet modal is displayed upon launch click', modalDisplay !== 'none');

    // 4. Check Question 1
    const counterEl = await page.$('#gauntlet-question-counter');
    const counterText = await counterEl.innerText();
    check('Counter shows Question 1 of 3', counterText.includes('1 OF 3'));

    const options = await page.$$('#gauntlet-options .gauntlet-option-btn');
    check('Exactly 4 options rendered for daily puzzle', options.length === 4);

    // Answer Question 1
    await options[0].click();
    await page.waitForTimeout(400);

    const feedback = await page.$('#gauntlet-feedback-panel');
    const fbDisplay = await page.evaluate(el => window.getComputedStyle(el).display, feedback);
    check('Feedback panel displays explanation after answering', fbDisplay !== 'none');

    // Wait for transition to Question 2
    await page.waitForTimeout(1600);
    const counterQ2 = await (await page.$('#gauntlet-question-counter')).innerText();
    check('Successfully auto-advanced to Question 2 of 3', counterQ2.includes('2 OF 3'));

    // Answer Question 2
    const optionsQ2 = await page.$$('#gauntlet-options .gauntlet-option-btn');
    await optionsQ2[0].click();
    await page.waitForTimeout(1600);

    // Answer Question 3
    const optionsQ3 = await page.$$('#gauntlet-options .gauntlet-option-btn');
    await optionsQ3[0].click();
    await page.waitForTimeout(1800);

    // 5. Verify Gauntlet Conquered Celebration View
    const celebration = await page.$('#gauntlet-celebration-container');
    const celebDisplay = await page.evaluate(el => window.getComputedStyle(el).display, celebration);
    check('Celebration container visible after completing all 3 questions', celebDisplay !== 'none');

    const rewardBox = await page.$('#gauntlet-reward-display');
    const rewardText = await rewardBox.innerText();
    check('Reward box displays stamped day and bonus XP', rewardText.toUpperCase().includes('DAY 1 PUNCH STAMPED') && rewardText.includes('Bonus XP'));

    // 6. Claim reward and return to Hub
    const claimBtn = await page.$('#btn-claim-gauntlet-finish');
    await claimBtn.click();
    await page.waitForTimeout(400);

    const modalAfter = await page.$('#modal-daily-gauntlet');
    const modalAfterDisplay = await page.evaluate(el => window.getComputedStyle(el).display, modalAfter);
    check('Modal closed after claiming reward', modalAfterDisplay === 'none');

    // 7. Verify Punch matrix and streak updated on Hub
    const cardsAfter = await page.$$('#daily-punch-matrix .punch-card');
    const day1ClassAfter = await cardsAfter[0].getAttribute('class');
    check('Day 1 punch card is now marked as claimed', day1ClassAfter.includes('is-claimed'));

    const streakAfter = await (await page.$('#daily-streak-pill')).innerText();
    check('Streak increased to 1-Day Streak on Hub', streakAfter.toUpperCase().includes('1-DAY STREAK'));

    const statusTextAfter = await (await page.$('#daily-mission-status-text')).innerText();
    check('Mission status confirms accomplishment for today', statusTextAfter.includes('Mission Accomplished'));

    console.log(`\n============================================================`);
    console.log(`🎉 ALL DAILY GAUNTLET PLAYWRIGHT TESTS PASSED (${passed}/${total})`);
    console.log(`============================================================\n`);
  } finally {
    await browser.close();
    server.close();
  }
}

runDailyGauntletTest().catch(err => {
  console.error('Playwright Test Failed:', err);
  process.exit(1);
});
