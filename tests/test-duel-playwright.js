import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import http from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const PORT = 8125;
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

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedCount++;
  }
}

async function runDuelSuite() {
  console.log('\n============================================================');
  console.log('⚔️ RUNNING PLAYWRIGHT E2E SUITE: 1V1 SYNTAXDUEL (FEATURE 2)');
  console.log('============================================================\n');

  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test server running on ${BASE_URL}`);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', msg.text());
    }
  });

  try {
    // ------------------------------------------------------------------------
    // TEST 1: Quick-Launch Links on Index Hub
    // ------------------------------------------------------------------------
    console.log('\n--- Test 1: Index Hub 1v1 SyntaxDuel Launchers ---');
    await page.goto(`${BASE_URL}/index.html`);
    await page.waitForLoadState('domcontentloaded');

    const commandDeckBtn = await page.$('#btn-showcase-duel-deck');
    assert(commandDeckBtn !== null, 'Hero Quick-Launch Command Deck includes 1v1 SyntaxDuel');

    const featuredModeCard = await page.$('#btn-showcase-duel');
    assert(featuredModeCard !== null, 'Featured Game Modes showcase grid contains 1v1 SyntaxDuel card');

    const href = await featuredModeCard.getAttribute('href');
    assert(href.includes('mode=duel'), 'Showcase duel button points to game.html?mode=duel');

    // ------------------------------------------------------------------------
    // TEST 2: Duel Arena Initialization & Versus HUD
    // ------------------------------------------------------------------------
    console.log('\n--- Test 2: Arena Duel HUD Initialization ---');
    await page.goto(`${BASE_URL}/game.html?mode=duel&lang=python&diff=beginner&count=5&seed=94821&new=true`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(600);

    const duelHudVisible = await page.evaluate(() => {
      const el = document.querySelector('#hud-duel-versus-bar');
      return el && window.getComputedStyle(el).display !== 'none';
    });
    assert(duelHudVisible, 'Versus HUD (#hud-duel-versus-bar) is visible in duel mode');

    const ghostRailHidden = await page.evaluate(() => {
      const el = document.querySelector('#hud-ghost-duel-rail');
      return !el || window.getComputedStyle(el).display === 'none';
    });
    assert(ghostRailHidden, 'Speed ghost rail is hidden in 1v1 duel mode');

    const leadPillText = await page.$eval('#duel-lead-pill', el => el.textContent.trim());
    assert(leadPillText.includes('TIED') || leadPillText.includes('EVEN'), 'Initial lead status displays TIED');

    const p1PinExists = await page.$('#duel-p1-pin');
    const p2PinExists = await page.$('#duel-p2-pin');
    assert(p1PinExists !== null && p2PinExists !== null, 'Dual runner track pins (P1 & P2) exist');

    // ------------------------------------------------------------------------
    // TEST 3: Multiplayer Duel Lobby Modal
    // ------------------------------------------------------------------------
    console.log('\n--- Test 3: Duel Lobby Modal Controls & Room Hosting ---');
    await page.click('#btn-open-duel-lobby');
    await page.waitForTimeout(300);

    const lobbyModalOpen = await page.evaluate(() => {
      const modal = document.querySelector('#modal-duel-lobby');
      return modal && (window.getComputedStyle(modal).display !== 'none' || modal.classList.contains('is-open'));
    });
    assert(lobbyModalOpen, 'Lobby modal opens when clicking #btn-open-duel-lobby');

    // Tab switching test
    await page.click('#tab-duel-local');
    await page.waitForTimeout(200);
    const localViewActive = await page.evaluate(() => {
      const view = document.querySelector('#duel-view-local');
      return view && window.getComputedStyle(view).display !== 'none';
    });
    assert(localViewActive, 'Local split arcade mode tab switches view successfully');

    await page.click('#tab-duel-online');
    await page.waitForTimeout(200);

    // Host room creation
    await page.click('#btn-create-duel-room');
    await page.waitForTimeout(300);

    const roomCardVisible = await page.evaluate(() => {
      const card = document.querySelector('#duel-room-active-card');
      return card && window.getComputedStyle(card).display !== 'none';
    });
    assert(roomCardVisible, 'Room active card becomes visible after hosting room');

    const roomCodeText = await page.$eval('#duel-display-room-code', el => el.textContent.trim());
    assert(roomCodeText.startsWith('SYN-'), 'Room code generated conforms to SYN-XXXX format: ' + roomCodeText);

    const shareUrl = await page.$eval('#duel-share-url-input', el => el.value);
    assert(shareUrl.includes('mode=duel') && shareUrl.includes(roomCodeText), 'Share invite URL contains room code and duel mode');

    const startMatchEnabled = await page.$eval('#btn-start-duel-match', el => !el.disabled);
    assert(startMatchEnabled, 'Launch Duel Match button is enabled after creating room');

    await page.click('#btn-cancel-duel-lobby');
    await page.waitForTimeout(200);

    // ------------------------------------------------------------------------
    // TEST 4: Gameplay Question Answering & Real-Time Lead Update
    // ------------------------------------------------------------------------
    console.log('\n--- Test 4: Question Answering & Versus HUD Telemetry ---');
    
    // Select an option card and submit
    const optionCards = await page.$$('.option-card');
    assert(optionCards.length >= 2, 'Question options rendered in arena');

    await optionCards[0].click();
    await page.waitForTimeout(150);

    const submitBtn = await page.$('#btn-submit-answer');
    const isSubmitEnabled = await submitBtn.isEnabled();
    assert(isSubmitEnabled, 'Submit button enabled upon selecting option');

    await submitBtn.click();
    await page.waitForTimeout(500);

    const p1ScoreText = await page.$eval('#duel-p1-score', el => el.textContent.trim());
    assert(p1ScoreText.includes('PTS'), 'Player 1 score updated in duel versus HUD: ' + p1ScoreText);

    const updatedLeadPill = await page.$eval('#duel-lead-pill', el => el.textContent.trim());
    assert(updatedLeadPill.length > 0, 'Center Nexus lead pill active with status: ' + updatedLeadPill);

    // ------------------------------------------------------------------------
    // TEST 5: Match Results Modal & Head-to-Head Report Card
    // ------------------------------------------------------------------------
    console.log('\n--- Test 5: Duel Results Modal & Report Card ---');

    // Simulate match completion via DuelEngine & UI rendering
    await page.evaluate(() => {
      if (typeof window.Gameplay !== 'undefined' && typeof window.DuelEngine !== 'undefined') {
        const res = window.DuelEngine.getMatchResult();
        window.Gameplay._renderDuelResults(res);
      }
    });
    await page.waitForTimeout(400);

    const resultsModalOpen = await page.evaluate(() => {
      const modal = document.querySelector('#modal-duel-results');
      return modal && window.getComputedStyle(modal).display !== 'none';
    });
    assert(resultsModalOpen, 'Versus Results Modal (#modal-duel-results) displayed');

    const tableP1Score = await page.$eval('#stat-duel-p1-score', el => el.textContent.trim());
    const tableP2Score = await page.$eval('#stat-duel-p2-score', el => el.textContent.trim());
    assert(tableP1Score.length > 0 && tableP2Score.length > 0, 'Head-to-head comparison table displays both P1 and P2 scores');

    const rematchBtn = await page.$('#btn-duel-rematch');
    const copyReportBtn = await page.$('#btn-copy-duel-report');
    const duelHubBtn = await page.$('#btn-duel-hub');
    assert(rematchBtn !== null && copyReportBtn !== null && duelHubBtn !== null, 'Duel results action buttons exist (Rematch, Copy Report, Hub)');

  } catch (err) {
    console.error('Test execution error:', err);
    failedCount++;
  } finally {
    if (browser) await browser.close();
    server.close();
  }

  console.log('\n============================================================');
  console.log(`🏁 1V1 DUEL E2E SUITE RESULTS: ${passedCount} passed, ${failedCount} failed`);
  console.log('============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runDuelSuite();

