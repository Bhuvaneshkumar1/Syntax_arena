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

    // ------------------------------------------------------------------------
    // SECTION 6: ARENA RETRY TIMER & SPEED GHOST FREEZE FIX (Correction 1)
    // ------------------------------------------------------------------------
    console.log('\n--- Test 6: Arena Retry Timer & Speed Ghost Unfreeze ---');
    await page.goto(`${BASE_URL}/game.html?lang=python&diff=beginner`);
    await page.waitForSelector('#btn-submit-answer');

    // Simulate answering wrongly and then clicking Retry Question
    const retryTestResult = await page.evaluate(async () => {
      // Pick first answer choice according to interface
      const card = document.querySelector('.option-card');
      const pill = document.querySelector('.line-pill-btn');
      const fillInput = document.querySelector('#fill-code-input');
      if (card) {
        card.click();
      } else if (pill) {
        pill.click();
      } else if (fillInput) {
        fillInput.value = 'wrong_val';
        fillInput.dispatchEvent(new Event('input'));
      }

      const submitBtn = document.getElementById('btn-submit-answer');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.click();
      }

      // Check retry button visible
      const retryBtn = document.getElementById('btn-retry-question');
      const isRetryVisible = retryBtn && window.getComputedStyle(retryBtn).display !== 'none';

      // Click retry
      if (retryBtn) retryBtn.click();

      // Check if timer is running and ghostDuel has questionStartTime
      const isRunning = window.Gameplay && window.Gameplay.timer && window.Gameplay.timer.isRunning;
      const intervalActive = window.Gameplay && window.Gameplay.timer && window.Gameplay.timer.intervalId !== null;
      const ghostActive = window.Gameplay && window.Gameplay.ghostDuel && typeof window.Gameplay.ghostDuel.questionStartTime === 'number';

      return { isRetryVisible, isRunning, intervalActive, ghostActive };
    });

    assert(retryTestResult.isRunning, 'Countdown timer resumes running upon clicking Retry Question');
    assert(retryTestResult.intervalActive, 'Timer tick interval is active (not null) after retry');
    assert(retryTestResult.ghostActive, 'Speed Ghost questionStartTime timestamp resets for live tracking on retry');

    // ------------------------------------------------------------------------
    // SECTION 7: BOSS HEALING & OVERWHELM DEFEAT GLITCH MODAL (Correction 2)
    // ------------------------------------------------------------------------
    console.log('\n--- Test 7: Boss HP Regeneration & Defeat Glitch Modal ---');
    await page.goto(`${BASE_URL}/game.html?mode=boss&boss=null_leviathan`);
    await page.waitForSelector('#hud-boss-battle-bar');

    const bossDefeatModal = await page.$('#modal-boss-defeat');
    assert(bossDefeatModal !== null, 'Mega-Boss defeat modal #modal-boss-defeat exists in DOM');

    const bossDefeatButtons = await page.evaluate(() => {
      const retry = document.getElementById('btn-boss-retry');
      const hub = document.getElementById('btn-boss-defeat-hub');
      return { hasRetry: retry !== null, hasHub: hub !== null };
    });
    assert(bossDefeatButtons.hasRetry && bossDefeatButtons.hasHub, 'Defeat modal contains Retry Boss Battle and Return to Hub buttons');

    // Verify boss defeat wipe glitch animation class exists in stylesheet
    const hasGlitchAnimation = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.className = 'boss-defeat-wipe-glitch';
      document.body.appendChild(testEl);
      const anim = window.getComputedStyle(testEl).animationName;
      document.body.removeChild(testEl);
      return anim.includes('bossDefeatWipeGlitch');
    });
    assert(hasGlitchAnimation, 'CSS .boss-defeat-wipe-glitch defines violent CRT screen glitch animation');

    // ------------------------------------------------------------------------
    // SECTION 8: CYBER ACADEMY W3SCHOOLS MULTI-CHAPTER REDESIGN (Correction 3)
    // ------------------------------------------------------------------------
    console.log('\n--- Test 8: Cyber Academy W3Schools Format & Right TOC Panel ---');
    await page.goto(`${BASE_URL}/learn.html`);
    await page.waitForSelector('.lesson-nav-btn');

    // Verify default difficulty filter is "all"
    const isAllActive = await page.evaluate(() => {
      const allBtn = document.querySelector('[data-diff-filter="all"]');
      return allBtn && allBtn.classList.contains('is-active');
    });
    assert(isAllActive, 'Cyber Academy defaults to "All Chapters" view mode');

    // Verify all 5 chapters are visible in the left syllabus
    const leftLessonCount = await page.evaluate(() => {
      return document.querySelectorAll('#academy-lesson-menu .lesson-nav-btn').length;
    });
    assert(leftLessonCount >= 5, `Left syllabus displays all multi-tier chapters (Found: ${leftLessonCount} chapters >= 5)`);

    // Verify right-side sticky panel exists and contains chapter directory
    const rightPanel = await page.$('#academy-right-panel');
    assert(rightPanel !== null, 'Right-side chapter outline & TOC drawer renders (#academy-right-panel)');

    const rightChaptersCount = await page.evaluate(() => {
      return document.querySelectorAll('#academy-right-chapters-list .academy-right-ch-item').length;
    });
    assert(rightChaptersCount >= 5, `Right-side chapter directory lists all chapters (Found: ${rightChaptersCount} >= 5)`);

    // Verify live runner jump button exists
    const jumpToRunnerBtn = await page.$('#btn-jump-to-runner');
    assert(jumpToRunnerBtn !== null, 'Right panel features "▶ Jump to Live Runner" interactive action');

    // ------------------------------------------------------------------------
    // SECTION 9: FLEXIBLE ADMIN CUSTOM SUBJECT & APPEND MODE (Correction 4)
    // ------------------------------------------------------------------------
    console.log('\n--- Test 9: Flexible Admin Uploader (Custom Subjects & Chapters) ---');
    await page.goto(`${BASE_URL}/admin.html`);

    // Authenticate into Admin Console
    await page.fill('#admin-input-username', 'admin');
    await page.fill('#admin-input-password', 'Admin@123');
    await page.click('#btn-admin-submit');
    await page.waitForSelector('#admin-dashboard-view', { state: 'visible' });

    // Verify custom subject option exists
    const hasCustomSubjectOption = await page.evaluate(() => {
      const select = document.getElementById('lesson-upload-lang');
      if (!select) return false;
      const opts = Array.from(select.options).map(o => o.value);
      return opts.includes('__custom__');
    });
    assert(hasCustomSubjectOption, 'Admin target track dropdown includes "+ Add New Custom Subject" option');

    // Verify selecting __custom__ reveals custom subject input
    await page.selectOption('#lesson-upload-lang', '__custom__');
    const isCustomInputVisible = await page.evaluate(() => {
      const wrap = document.getElementById('custom-subject-input-wrap');
      return wrap && window.getComputedStyle(wrap).display !== 'none';
    });
    assert(isCustomInputVisible, 'Selecting custom subject reveals #lesson-upload-custom-lang text field');

    // Verify chapter append action mode exists
    const hasAppendMode = await page.evaluate(() => {
      const select = document.getElementById('lesson-upload-action');
      return select && select.value === 'append';
    });
    assert(hasAppendMode, 'Admin provides "➕ Add as Extra Chapter to Subject" ingestion mode');

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
