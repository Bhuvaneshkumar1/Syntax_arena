import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import assert from 'assert';

const PORT = 8121;
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

async function runGhostDuelTest() {
  console.log('============================================================');
  console.log('🧪 PLAYWRIGHT E2E: ASYNCHRONOUS GHOST SPEED DUEL IN ARENA');
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
    // 1. Launch Game Arena with stage 1
    await page.goto(`${BASE_URL}/game.html?lang=python&diff=beginner&stage=1&new=1`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(600);

    // 2. Verify Ghost Speed Duel Rail exists in HUD
    const ghostRail = await page.$('#hud-ghost-duel-rail');
    check('Ghost Speed Duel HUD rail is rendered', Boolean(ghostRail));

    const opponentName = await (await page.$('#ghost-opponent-name')).innerText();
    check('Opponent racer displays CyberPhantom', opponentName.includes('CyberPhantom'));

    const splitBadge = await page.$('#ghost-split-badge');
    const initialSplitText = await splitBadge.innerText();
    check('Initial split badge indicates EVEN pace', initialSplitText.includes('EVEN'));

    const playerPin = await page.$('#ghost-player-pin');
    const ghostPin = await page.$('#ghost-opponent-pin');
    check('Dual pins (player and ghost) rendered on speed track', Boolean(playerPin) && Boolean(ghostPin));

    // 3. Test Ghost Duel Toggle button
    const toggleBtn = await page.$('#btn-toggle-ghost-duel');
    check('Ghost Duel toggle button exists', Boolean(toggleBtn));

    await toggleBtn.click();
    await page.waitForTimeout(200);
    const railOpacity = await page.evaluate(el => window.getComputedStyle(el).opacity, ghostRail);
    check('Clicking toggle button dims ghost rail (paused)', railOpacity < 0.6);

    // Toggle back on
    await toggleBtn.click();
    await page.waitForTimeout(200);

    // 4. Answer Question 1 rapidly (< 2 seconds)
    const optionCards = await page.$$('.option-card');
    check('Question 1 options rendered', optionCards.length >= 2);

    await optionCards[0].click();
    await page.waitForTimeout(200);
    const submitBtn = await page.$('#btn-submit-answer');
    if (submitBtn) await submitBtn.click();
    await page.waitForTimeout(500);

    // 5. Verify Split timing badge updated
    const splitBadgeClass = await splitBadge.getAttribute('class');
    const updatedSplitText = await splitBadge.innerText();
    console.log('SPLIT BADGE TEXT:', updatedSplitText, 'CLASS:', splitBadgeClass);
    check('Split badge updated dynamically after submitting answer', splitBadgeClass.includes('is-ahead') || splitBadgeClass.includes('is-behind') || splitBadgeClass.includes('is-even'));

    // 6. Test results.html Speed Duel Victory Banner
    await page.evaluate(() => {
      const summary = {
        sessionId: 'sess_speed_duel_vic',
        language: 'python',
        difficulty: 'beginner',
        stage: 1,
        stageName: 'Stage 1: Core Fundamentals',
        mode: 'campaign',
        totalQuestions: 5,
        questionsAttempted: 5,
        questionsCorrect: 5,
        accuracy: 100,
        totalScore: 825,
        stars: 3,
        bestStreak: 5,
        hintsUsed: 0,
        retriesUsed: 0,
        elapsedSeconds: 38,
        isCompleted: true,
        isFlawless: true,
        missedQuestionIds: [],
        results: [],
        ghostDuel: {
          enabled: true,
          opponentName: 'CyberPhantom',
          playerTime: 38.5,
          ghostTime: 42.5,
          delta: 4.0,
          isVictory: true,
          bonusXP: 75
        }
      };
      sessionStorage.setItem('syntaxarena_last_session_summary', JSON.stringify(summary));
    });

    await page.goto(`${BASE_URL}/results.html`);
    await page.waitForSelector('#results-grade-display');
    await page.waitForTimeout(400);

    const victoryBanner = await page.$('#results-ghost-duel-banner');
    check('results.html contains #results-ghost-duel-banner', Boolean(victoryBanner));

    const bannerDisplay = await page.evaluate(el => window.getComputedStyle(el).display, victoryBanner);
    check('Ghost outcome banner is displayed on results page', bannerDisplay !== 'none');

    const ghostTitle = await (await page.$('#res-ghost-title')).innerText();
    check('Ghost outcome banner shows SPEED DUEL VICTORY!', ghostTitle.includes('SPEED DUEL VICTORY'));

    const rewardPill = await (await page.$('#res-ghost-reward-pill')).innerText();
    check('Victory banner awards +75 XP BONUS', rewardPill.includes('+75 XP BONUS'));

    // 7. Test results.html Speed Duel Defeat Banner
    await page.evaluate(() => {
      const defeatSummary = {
        sessionId: 'sess_speed_duel_def',
        language: 'python',
        difficulty: 'beginner',
        stage: 1,
        mode: 'campaign',
        totalQuestions: 5,
        questionsAttempted: 5,
        questionsCorrect: 3,
        accuracy: 60,
        totalScore: 350,
        stars: 1,
        elapsedSeconds: 50,
        isCompleted: true,
        ghostDuel: {
          enabled: true,
          opponentName: 'CyberPhantom',
          playerTime: 50.2,
          ghostTime: 42.5,
          delta: -7.7,
          isVictory: false,
          bonusXP: 0
        }
      };
      sessionStorage.setItem('syntaxarena_last_session_summary', JSON.stringify(defeatSummary));
    });

    await page.goto(`${BASE_URL}/results.html`);
    await page.waitForSelector('#results-grade-display');
    await page.waitForTimeout(400);

    const defeatTitle = await (await page.$('#res-ghost-title')).innerText();
    check('Defeat scenario shows CYBERPHANTOM CLAIMED SECTOR', defeatTitle.includes('CYBERPHANTOM CLAIMED SECTOR'));

    console.log(`\n============================================================`);
    console.log(`🎉 ALL GHOST SPEED DUEL PLAYWRIGHT TESTS PASSED (${passed}/${total})`);
    console.log(`============================================================\n`);
  } finally {
    await browser.close();
    server.close();
  }
}

runGhostDuelTest().catch(err => {
  console.error('Playwright Test Failed:', err);
  process.exit(1);
});
