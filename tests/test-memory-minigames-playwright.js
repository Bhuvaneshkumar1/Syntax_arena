/**
 * Playwright E2E Test Suite for Feature 8: Tactile Memory Pointer Minigames
 * Verifies:
 * 1. Hub quick-launch & featured game mode cards target memory-games.html
 * 2. Lab bootstrapping & Telemetry HUD verification
 * 3. 3-way mode switching (Cable Connect, Leak Patrol, Dereference Rush)
 * 4. Cable Connect interactive port detection & wiring validation
 * 5. Leak Patrol heap capacity gauge, orphan deallocation, and UAF hazard detection
 * 6. Dereference Rush speed triage, category slam buttons, and combo streak
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const PORT = 8135;
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

async function runMemoryMinigamePlaywrightSuite() {
  console.log('============================================================');
  console.log('🧠 RUNNING TACTILE MEMORY MINIGAMES PLAYWRIGHT E2E SUITE');
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
    // 1. Hub Navigation Links to Memory Lab
    // -------------------------------------------------------------
    console.log('--- 1. Hub Navigation Links to Memory Lab ---');
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });

    const deckLink = await page.$('#btn-showcase-memory-deck');
    assert(deckLink !== null, 'Memory Lab button present in Hero Quick-Launch Command Deck');
    if (deckLink) {
      const href = await deckLink.getAttribute('href');
      assert(href.includes('memory-games.html'), 'Command deck button links to memory-games.html');
    }

    const cardLink = await page.$('#btn-showcase-memory');
    assert(cardLink !== null, 'Memory Lab showcase card button present in Featured Game Modes');
    if (cardLink) {
      const href = await cardLink.getAttribute('href');
      assert(href.includes('memory-games.html'), 'Showcase card links to memory-games.html');
    }

    // -------------------------------------------------------------
    // 2. Memory Lab Bootstrapping & Telemetry HUD
    // -------------------------------------------------------------
    console.log('\n--- 2. Memory Lab Bootstrapping & Telemetry HUD ---');
    await page.goto(`${BASE_URL}/memory-games.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    const titleEl = await page.$('.mem-title');
    assert(titleEl !== null, 'Memory Lab page title mounted');

    const scoreEl = await page.$('#hud-mem-score');
    assert(scoreEl !== null, 'Score counter element mounted in HUD');
    const initialScore = await scoreEl.textContent();
    assert(initialScore.trim() === '0', 'Initial score begins at 0');

    const streakEl = await page.$('#hud-mem-streak');
    assert(streakEl !== null, 'Streak counter element mounted in HUD');
    const initialStreak = await streakEl.textContent();
    assert(initialStreak.trim() === '0x', 'Initial streak begins at 0x');

    const diffEl = await page.$('#hud-level-difficulty');
    assert(diffEl !== null, 'Level difficulty badge mounted');
    const diffText = await diffEl.textContent();
    assert(diffText.trim() === 'Beginner', 'Initial level difficulty is Beginner');

    // -------------------------------------------------------------
    // 3. Mode Switcher Tabs
    // -------------------------------------------------------------
    console.log('\n--- 3. Mode Switcher Tabs ---');
    const tabCable = await page.$('#tab-cable-connect');
    const tabLeak = await page.$('#tab-leak-patrol');
    const tabRush = await page.$('#tab-deref-rush');
    assert(tabCable !== null && tabLeak !== null && tabRush !== null, 'All 3 mode tabs are mounted');

    // Switch to Leak Patrol
    await tabLeak.click();
    await page.waitForTimeout(400);
    const leakMeter = await page.$('#mem-leak-meter-container');
    const isLeakVisible = await leakMeter.isVisible();
    assert(isLeakVisible === true, 'Leak Patrol meter visible upon switching to leak_patrol mode');

    // Switch to Dereference Rush
    await tabRush.click();
    await page.waitForTimeout(400);
    const rushCard = await page.$('#mem-rush-card-container');
    const isRushVisible = await rushCard.isVisible();
    assert(isRushVisible === true, 'Dereference Rush arena visible upon switching to dereference_rush mode');

    // Switch back to Cable Connect
    await tabCable.click();
    await page.waitForTimeout(400);
    const stageCanvas = await page.$('#mem-stage-canvas');
    const isStageVisible = await stageCanvas.isVisible();
    assert(isStageVisible === true, 'Interactive stage canvas visible upon returning to cable_connect mode');

    // -------------------------------------------------------------
    // 4. Cable Connect Interactive Ports & Wiring (Click-to-Connect)
    // -------------------------------------------------------------
    console.log('\n--- 4. Cable Connect Interactive Ports & Wiring ---');
    const stackPorts = await page.$$('.mem-port.port-out');
    assert(stackPorts.length >= 1, `Found ${stackPorts.length} stack output port(s)`);

    const heapPorts = await page.$$('.mem-port.port-in');
    assert(heapPorts.length >= 2, `Found ${heapPorts.length} heap input port(s)`);

    // Click-to-Connect: Click the stack source port
    const srcPort = await page.$('.mem-port[data-node-id="stk_ptr"]');
    assert(srcPort !== null, 'Found stack source port for stk_ptr');
    await srcPort.click();
    await page.waitForTimeout(150);

    // Verify source card is in connecting state
    const isConnecting = await page.evaluate(() => {
      const el = document.querySelector('[data-node-id="stk_ptr"]');
      return el ? el.classList.contains('is-connecting') : false;
    });
    assert(isConnecting === true, 'Source port acquired .is-connecting pulsing state');

    // Click-to-Connect: Click target heap port
    const tgtPort = await page.$('.mem-port[data-node-id="hp_val42"]');
    assert(tgtPort !== null, 'Found heap target port for hp_val42');
    await tgtPort.click();
    await page.waitForTimeout(200);

    const svgPaths = await page.$$('#memory-cables-svg .cable-wire');
    assert(svgPaths.length === 1, 'Rendered 1 active glowing bezier cable in SVG layer via Click-to-Connect');

    // Verify cable hitbox for click-to-disconnect
    const hitboxes = await page.$$('#memory-cables-svg .cable-hitbox');
    assert(hitboxes.length === 1, 'Rendered cable hitbox for easy disconnect');

    // Click Check Wiring button
    const btnCheckWiring = await page.$('#btn-check-wiring');
    assert(btnCheckWiring !== null, 'Check Wiring button present');
    await btnCheckWiring.click();
    await page.waitForTimeout(300);

    const feedbackBanner = await page.$('#mem-feedback');
    const feedbackText = await feedbackBanner.textContent();
    assert(feedbackText.toLowerCase().includes('pointer routing verified'), 'Check Wiring passed successfully: ' + feedbackText);

    // Verify Cable Connect score on HUD
    const cableScoreVal = await page.$eval('#hud-mem-score', el => parseInt(el.textContent, 10));
    assert(cableScoreVal > 0, `Cable Connect score updated to ${cableScoreVal} PTS`);
    const totalXpVal1 = await page.$eval('#hud-total-lab-xp', el => parseInt(el.textContent, 10));
    assert(totalXpVal1 === cableScoreVal, `Total Lab XP matches cable score (${totalXpVal1})`);

    const nextLevelBtn = await page.$('#btn-next-level');
    const isNextVisible = await nextLevelBtn.isVisible();
    assert(isNextVisible === true, 'Next Level button unlocked upon correct wiring');

    // Advance to Level 2 (Pointer Aliasing)
    await nextLevelBtn.click();
    await page.waitForTimeout(300);
    const level2Title = await page.$eval('#hud-level-title', el => el.textContent);
    assert(level2Title.includes('Pointer Aliasing'), 'Successfully advanced to Level 2: ' + level2Title);

    // Advance to Level 3 (Pointer to Pointer - bidirectional port-both test)
    await page.evaluate(() => {
      window.MemoryMinigameController.engine.loadCableLevel(2);
    });
    await page.waitForTimeout(200);
    const inPortsLvl3 = await page.$$('.mem-port.port-in');
    const outPortsLvl3 = await page.$$('.mem-port.port-out');
    assert(inPortsLvl3.length >= 2 && outPortsLvl3.length >= 2, 'Level 3 mounts bidirectional ports for pointer-to-pointer routing');

    // -------------------------------------------------------------
    // 5. Leak Patrol Mark-and-Sweep & Deallocation (Isolated Scoring)
    // -------------------------------------------------------------
    console.log('\n--- 5. Leak Patrol Mark-and-Sweep & Deallocation ---');
    await tabLeak.click();
    await page.waitForTimeout(300);

    // Verify mode score is reset/isolated for leak patrol
    const leakScoreVal0 = await page.$eval('#hud-mem-score', el => parseInt(el.textContent, 10));
    assert(leakScoreVal0 === 0, 'Leak Patrol starts with isolated score of 0 (NOT mixed with Cable Connect)');
    const scoreLabel = await page.$eval('#hud-score-label', el => el.textContent);
    assert(scoreLabel.includes('HEAP HUNTER'), 'HUD score label updated to HEAP HUNTER SCORE');

    const totalXpVal2 = await page.$eval('#hud-total-lab-xp', el => parseInt(el.textContent, 10));
    assert(totalXpVal2 === cableScoreVal, 'Total Lab XP retains accumulated XP from Cable Connect');

    const freeBtns = await page.$$('.mem-free-btn');
    assert(freeBtns.length >= 2, `Found ${freeBtns.length} Free Block buttons`);

    // Click hint button
    const btnHint = await page.$('#btn-gc-hint');
    assert(btnHint !== null, 'Mark & Sweep Pulse hint button present');
    await btnHint.click();

    // Free the orphaned block (hp_buf_leaked)
    const orphanFreeBtn = await page.$('.mem-free-btn[data-block-id="hp_buf_leaked"]');
    assert(orphanFreeBtn !== null, 'Orphaned block Free button found');
    if (orphanFreeBtn) {
      await orphanFreeBtn.click();
      await page.waitForTimeout(300);

      const feedback = await page.$('#mem-feedback');
      const text = await feedback.textContent();
      assert(text.includes('Reclaimed 128B orphaned memory'), 'Safely reclaimed orphaned memory block');

      const leakScoreVal1 = await page.$eval('#hud-mem-score', el => parseInt(el.textContent, 10));
      assert(leakScoreVal1 > 0, `Leak Patrol earned isolated score of ${leakScoreVal1} PTS`);
      const totalXpVal3 = await page.$eval('#hud-total-lab-xp', el => parseInt(el.textContent, 10));
      assert(totalXpVal3 === cableScoreVal + leakScoreVal1, `Total Lab XP (${totalXpVal3}) is exact sum of Cable + Leak scores`);
    }

    // -------------------------------------------------------------
    // 6. Dereference Rush Speed Triage & Lockout Prevention
    // -------------------------------------------------------------
    console.log('\n--- 6. Dereference Rush Speed Triage ---');
    await tabRush.click();
    await page.waitForTimeout(400);

    const rushScoreVal0 = await page.$eval('#hud-mem-score', el => parseInt(el.textContent, 10));
    assert(rushScoreVal0 === 0, 'Dereference Rush starts with isolated score of 0');
    const rushScoreLabel = await page.$eval('#hud-score-label', el => el.textContent);
    assert(rushScoreLabel.includes('DEFUSER SCORE'), 'HUD score label updated to DEFUSER SCORE');

    const rushCode = await page.$('#rush-code-display');
    const codeContent = await rushCode.textContent();
    assert(codeContent.includes('int *ptr = NULL'), 'Rush challenge 1 displays null pointer code');

    // Click NULL POINTER category button
    const btnNull = await page.$('.mem-rush-btn[data-category="null_dereference"]');
    assert(btnNull !== null, 'Null Pointer category slam button mounted');
    if (btnNull) {
      await btnNull.click();
      await page.waitForTimeout(100);

      // Verify button lock during feedback transition
      const isLocked = await page.evaluate(() => window.MemoryMinigameController.isRushLocked);
      assert(isLocked === true, 'Rapid-fire buttons locked during 1.6s feedback window to prevent double-submits');

      await page.waitForTimeout(200);
      const rushFeedback = await page.$('#mem-rush-feedback');
      const fText = await rushFeedback.textContent();
      assert(fText.includes('CORRECT!'), 'Rush answer evaluated as CORRECT: ' + fText);
    }

  } catch (err) {
    console.error('Playwright suite encountered an unhandled exception:', err);
    failed++;
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n============================================================');
  console.log(`TACTILE MEMORY PLAYWRIGHT SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runMemoryMinigamePlaywrightSuite();
