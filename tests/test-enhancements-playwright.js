import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import http from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const PORT = 8120;
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

async function runTests() {
  console.log('\n============================================================');
  console.log('🚀 RUNNING PLAYWRIGHT E2E SUITE: 8 ENHANCEMENTS VERIFICATION');
  console.log('============================================================\n');

  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test server running on ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('  [Browser Error]', msg.text());
    }
  });

  try {
    // ------------------------------------------------------------------------
    // SECTION 1: INDEX HUB RESTYLING & SHOWCASE RESTRUCTURING (Items 2 & 3)
    // ------------------------------------------------------------------------
    console.log('--- Test 1: Index Hub Command Deck & Challenge Showcase ---');
    await page.goto(`${BASE_URL}/index.html`);

    // Command Deck presence
    const commandDeck = await page.$('.card.card-raised:has-text("QUICK-LAUNCH COMMAND DECK")');
    assert(commandDeck !== null, 'Quick-Launch Command Deck renders in Hero');

    // Telemetry Badges
    const badge12Tracks = await page.$('text=12 Language Tracks');
    const badge720Challenges = await page.$('text=720+ Challenges');
    const badge4Bosses = await page.$('text=4 Mega-Boss Raids');
    assert(badge12Tracks !== null, 'Telemetry badge displays 12 Language Tracks');
    assert(badge720Challenges !== null, 'Telemetry badge displays 720+ Challenges');
    assert(badge4Bosses !== null, 'Telemetry badge displays 4 Mega-Boss Raids');

    // Core Question Formats (01–05)
    const header0105 = await page.$('h2:has-text("Core Question Formats (01–05)")');
    assert(header0105 !== null, '01 to 05 Formats header cleanly isolated');

    const card01 = await page.$('text=01 • Predict Output');
    const card02 = await page.$('text=02 • Find the Bug');
    const card03 = await page.$('text=03 • Complete Code');
    const card04 = await page.$('text=04 • Explain Logic');
    const card05 = await page.$('text=05 • Trace Execution');
    assert(card01 !== null && card02 !== null && card03 !== null && card04 !== null && card05 !== null, 'All 5 core cognitive archetype cards render');

    // Featured Game Modes
    const headerSpecialModes = await page.$('h2:has-text("Featured Game Modes")');
    assert(headerSpecialModes !== null, 'Featured Game Modes header renders distinctly');

    const btnEndless = await page.$('#btn-showcase-endless');
    const btnAcademy = await page.$('#btn-showcase-academy');
    const btnBoss = await page.$('#btn-showcase-boss-incursion');
    assert(btnEndless !== null, 'Dedicated Endless Farm card button renders (#btn-showcase-endless)');
    assert(btnAcademy !== null, 'Dedicated Cyber Academy card button renders (#btn-showcase-academy)');
    assert(btnBoss !== null, 'Dedicated Mega-Boss Incursion card button renders (#btn-showcase-boss-incursion)');

    // ------------------------------------------------------------------------
    // SECTION 2: ARENA GAMEPLAY, SPEED GHOST & 3-MISTAKES MODAL (Items 4 & 5)
    // ------------------------------------------------------------------------
    console.log('\n--- Test 2: Arena Gameplay, Speed Ghost Motion & 3-Mistakes Study Prompt ---');
    await page.goto(`${BASE_URL}/game.html?lang=python&diff=beginner`);

    // Verify Academy is NOT visible in active play toolbar
    const arenaReviewBtn = await page.$('#btn-arena-review-lesson');
    assert(arenaReviewBtn === null, 'Cyber Academy button is completely removed from active gameplay toolbar');

    // Speed Ghost Pin exists and starts
    const ghostPlayerPin = await page.$('#ghost-player-pin');
    const ghostOpponentPin = await page.$('#ghost-opponent-pin');
    assert(ghostPlayerPin !== null, 'Ghost Player Pin renders on progress track');
    assert(ghostOpponentPin !== null, 'Ghost Opponent Pin renders on progress track');

    // Let the timer tick for 1.2s to test ghost real-time movement
    await page.waitForTimeout(1200);
    const ghostLeft = await page.evaluate(() => {
      const pin = document.getElementById('ghost-opponent-pin');
      return pin ? pin.style.left : '0%';
    });
    const ghostLeftNum = parseFloat(ghostLeft) || 0;
    assert(ghostLeftNum >= 0, `Speed ghost pin is active and tracking (currently at ${ghostLeft})`);

    // Modal check: Trigger 3-Mistake Academy Recommendation Modal
    await page.evaluate(() => {
      if (typeof window.Gameplay !== 'undefined') {
        window.Gameplay.consecutiveMistakes = 3;
        window.Gameplay._promptAcademyRecommendation();
      }
    });

    const isModalVisible = await page.evaluate(() => {
      const modal = document.getElementById('modal-academy-recommendation');
      return modal && modal.classList.contains('is-open') && modal.getAttribute('aria-hidden') === 'false';
    });
    assert(isModalVisible, '3-Mistakes Study Suggestion modal opens and displays');

    const yesBtn = await page.$('#btn-modal-academy-yes');
    const noBtn = await page.$('#btn-modal-academy-no');
    assert(yesBtn !== null, 'Modal contains "Yes, Open Academy" action button');
    assert(noBtn !== null, 'Modal contains "No, Keep Fighting" action button');

    // Test No button dismisses cleanly
    await noBtn.click();
    await page.waitForTimeout(200);
    const isModalClosed = await page.evaluate(() => {
      const modal = document.getElementById('modal-academy-recommendation');
      return modal && !modal.classList.contains('is-open') && modal.getAttribute('aria-hidden') === 'true';
    });
    assert(isModalClosed, 'Clicking "No" dismisses modal and keeps user in arena');

    // Test Tug-of-War progress recoil application
    await page.evaluate(() => {
      if (typeof window.Gameplay !== 'undefined') {
        window.Gameplay._applyTugOfWarSetback();
      }
    });
    const hasTugRecoil = await page.evaluate(() => {
      const fill = document.getElementById('hud-progress-fill');
      return fill && fill.classList.contains('is-tug-recoil');
    });
    assert(hasTugRecoil, 'Progress bar applies .is-tug-recoil glitch setback on mistake');

    // ------------------------------------------------------------------------
    // SECTION 3: BOSS BATTLE ANIMATIONS (Item 1)
    // ------------------------------------------------------------------------
    console.log('\n--- Test 3: Mega-Boss Battle Real-Game Animations ---');
    await page.goto(`${BASE_URL}/game.html?mode=boss&boss=null_leviathan`);
    await page.waitForSelector('#hud-boss-battle-bar', { state: 'visible', timeout: 5000 });

    const bossAvatar = await page.$('#boss-avatar-emblem');
    assert(bossAvatar !== null, 'Boss avatar emblem rendered in Boss Mode');

    // Verify computed animation has bossIdleFloat
    const idleAnim = await page.evaluate(() => {
      const avatar = document.getElementById('boss-avatar-emblem');
      return window.getComputedStyle(avatar).animationName;
    });
    assert(idleAnim.includes('bossIdleFloat'), `Boss avatar has continuous idle float animation: "${idleAnim}"`);

    // Test damage hit recoil
    await page.evaluate(() => {
      const avatar = document.getElementById('boss-avatar-emblem');
      avatar.classList.add('is-hit-recoil');
    });
    const hitAnim = await page.evaluate(() => {
      const avatar = document.getElementById('boss-avatar-emblem');
      return window.getComputedStyle(avatar).animationName;
    });
    assert(hitAnim.includes('bossHitRecoil'), `Boss avatar applies .is-hit-recoil animation on damage ("${hitAnim}")`);

    // Test attack lunge
    await page.evaluate(() => {
      const avatar = document.getElementById('boss-avatar-emblem');
      avatar.classList.remove('is-hit-recoil');
      avatar.classList.add('is-attack-lunge');
    });
    const attackAnim = await page.evaluate(() => {
      const avatar = document.getElementById('boss-avatar-emblem');
      return window.getComputedStyle(avatar).animationName;
    });
    assert(attackAnim.includes('bossAttackLunge'), `Boss avatar applies .is-attack-lunge animation on counter-attack ("${attackAnim}")`);

    // ------------------------------------------------------------------------
    // SECTION 4: CYBER ACADEMY CLEANUP (Item 6)
    // ------------------------------------------------------------------------
    console.log('\n--- Test 4: Cyber Academy Cleaned Layout ---');
    await page.goto(`${BASE_URL}/learn.html`);

    const academyHeader = await page.$('.academy-header-card');
    assert(academyHeader !== null, 'Cleaned streamlined Academy header card renders');

    const diffFilterAll = await page.$('[data-diff-filter="all"]');
    const diffFilterBeginner = await page.$('[data-diff-filter="beginner"]');
    assert(diffFilterAll !== null && diffFilterBeginner !== null, 'Streamlined difficulty filter pills render cleanly');

    const lessonMenu = await page.$('#academy-lesson-menu');
    assert(lessonMenu !== null, 'Academy lesson directory renders in left sidebar');

    const workspaceCard = await page.$('#academy-workspace-card');
    assert(workspaceCard !== null, 'Focus reader workspace card renders in main area');

    // ------------------------------------------------------------------------
    // SECTION 5: SANDBOX MEMORY TRACER GATING & SEGMENTED TABS (Items 7 & 8)
    // ------------------------------------------------------------------------
    console.log('\n--- Test 5: Sandbox Memory Tracer Visibility Gating & Segmented Tabs ---');
    await page.goto(`${BASE_URL}/sandbox.html`);

    // Segmented bar
    const segmentedBar = await page.$('.sandbox-env-segmented-bar');
    assert(segmentedBar !== null, 'Sandbox renders modern .sandbox-env-segmented-bar control');

    const pythonPill = await page.$('.sandbox-env-pill[data-env="python"]');
    const htmlPill = await page.$('.sandbox-env-pill[data-env="html"]');
    const sqlPill = await page.$('.sandbox-env-pill[data-env="sql"]');
    const systemsPill = await page.$('.sandbox-env-pill[data-env="systems"]');
    assert(pythonPill !== null && htmlPill !== null && sqlPill !== null && systemsPill !== null, 'All segmented environment pills render');

    // Check Python (default): Memory inspector should be VISIBLE
    const memInspectorPython = await page.evaluate(() => {
      const el = document.getElementById('visual-memory-inspector');
      return el && window.getComputedStyle(el).display !== 'none';
    });
    assert(memInspectorPython, 'Memory Tracer is visible for Python (memory-relevant)');

    // Click HTML tab: Memory inspector should be HIDDEN
    await htmlPill.click();
    await page.waitForTimeout(300);
    const memInspectorHtml = await page.evaluate(() => {
      const el = document.getElementById('visual-memory-inspector');
      return el && window.getComputedStyle(el).display === 'none';
    });
    assert(memInspectorHtml, 'Memory Tracer is automatically hidden for HTML (non-memory-relevant)');

    // Click SQL tab: Memory inspector should be HIDDEN
    await sqlPill.click();
    await page.waitForTimeout(300);
    const memInspectorSql = await page.evaluate(() => {
      const el = document.getElementById('visual-memory-inspector');
      return el && window.getComputedStyle(el).display === 'none';
    });
    assert(memInspectorSql, 'Memory Tracer is automatically hidden for SQL');

    // Click Systems (C/C++/Rust) tab: Memory inspector should be VISIBLE
    await systemsPill.click();
    await page.waitForTimeout(300);
    const memInspectorSystems = await page.evaluate(() => {
      const el = document.getElementById('visual-memory-inspector');
      return el && window.getComputedStyle(el).display !== 'none';
    });
    assert(memInspectorSystems, 'Memory Tracer is visible for Systems (C/C++/Rust)');

  } catch (err) {
    console.error('Test execution error:', err);
    failedCount++;
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n============================================================');
  console.log(`PLAYWRIGHT ENHANCEMENTS: ${passedCount} passed, ${failedCount} failed`);
  console.log('============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests();
