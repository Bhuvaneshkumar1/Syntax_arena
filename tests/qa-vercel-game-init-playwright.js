/**
 * SyntaxArena: Vercel & Clean URL Gameplay Initialization Regression Suite
 * 
 * Verifies:
 * 1. Immediate initialization of GameEngine and sessionConfig on /game and game.html.
 * 2. Proper elimination of "Loading challenge prompt..." hanging state.
 * 3. Populated #answer-interface-container with interactive controls.
 * 4. Correct parsing of language, difficulty, and mode from search query and hash routing.
 * 5. Recovery from legacy/corrupted hash URLs like "#/hub/<id>?lang=c&diff=beginner".
 * 6. All 4 languages (Python, C, C++, Java).
 * 7. All 3 difficulty tiers (Beginner, Intermediate, Expert).
 * 8. Page refresh and in-progress session restoration.
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:8080';

let passed = 0;
let failed = 0;
const results = [];

function assert(condition, name, details = '') {
  if (condition) {
    passed++;
    results.push({ name, status: 'PASS' });
    console.log(`  ✓ [PASS] ${name}`);
  } else {
    failed++;
    results.push({ name, status: 'FAIL', details });
    console.error(`  ✗ [FAIL] ${name} — ${details}`);
  }
}

async function runVercelInitSuite() {
  console.log('============================================================');
  console.log('🧪 RUNNING VERCEL & GAMEPLAY INITIALIZATION REGRESSION SUITE');
  console.log('============================================================\n');

  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge'
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning' || msg.text().includes('[Gameplay]') || msg.text().includes('[SyntaxArena]')) {
      console.log(`  [BROWSER] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.error(`  [PAGE ERROR] ${err.message}`);
  });

  try {
    // -------------------------------------------------------------------------
    // TEST 1: The Exact Reported Bug Scenario (#/hub/... on game arena)
    // -------------------------------------------------------------------------
    console.log('--- TEST 1: Exact Reported URL Reproduction & Recovery ---');
    await page.goto(`${BASE_URL}/game.html#/hub/test-reported-uuid?lang=c&diff=beginner`);
    await page.waitForTimeout(600);

    const isEngineActive = await page.evaluate(() => window.Gameplay && window.Gameplay.engine !== null);
    assert(isEngineActive, 'T1.1 Gameplay.engine is initialized (not null)');

    const isConfigActive = await page.evaluate(() => window.Gameplay && window.Gameplay.sessionConfig !== null);
    assert(isConfigActive, 'T1.2 Gameplay.sessionConfig is assigned (not null)');

    const promptText = await page.textContent('#q-prompt-text');
    assert(
      promptText && !promptText.includes('Loading challenge prompt...'),
      'T1.3 Challenge prompt text is rendered (not "Loading challenge prompt...")',
      promptText
    );

    const answerCount = await page.locator('#answer-interface-container .option-card, #answer-interface-container button, #answer-interface-container .code-line').count();
    assert(answerCount > 0, `T1.4 Answer interface is populated with interactive controls (found ${answerCount})`);

    const langTag = await page.textContent('#hud-lang-tag');
    assert(langTag && langTag.toLowerCase().includes('c'), `T1.5 HUD language reflects C track (found "${langTag}")`);

    const maskedUrl = page.url();
    assert(maskedUrl.includes('/arena/'), `T1.6 URL hash is corrected from /hub/ to /arena/ (URL: ${maskedUrl})`);

    // -------------------------------------------------------------------------
    // TEST 2: All 4 Languages Initialization
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 2: All 4 Language Tracks Initialization ---');
    const languages = [
      { id: 'python', label: 'python' },
      { id: 'c', label: 'c' },
      { id: 'cpp', label: 'c++' },
      { id: 'java', label: 'java' }
    ];

    for (const lang of languages) {
      await page.goto(`${BASE_URL}/game.html?lang=${lang.id}&diff=beginner&new=true`);
      await page.waitForTimeout(400);

      const pText = await page.textContent('#q-prompt-text');
      const hasPrompt = pText && !pText.includes('Loading challenge prompt...');
      assert(hasPrompt, `T2.${lang.id} Language ${lang.id.toUpperCase()} loads question prompt`);

      const options = await page.locator('#answer-interface-container .option-card, #answer-interface-container button').count();
      assert(options > 0, `T2.${lang.id} Language ${lang.id.toUpperCase()} renders answer options (found ${options})`);
    }

    // -------------------------------------------------------------------------
    // TEST 3: All 3 Difficulty Tiers (with appropriate unlocked profile)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 3: All 3 Difficulty Levels Initialization ---');
    
    // Navigate to clean page to avoid beforeunload state-sync overwrite
    await page.goto(`${BASE_URL}/index.html`);
    await page.waitForTimeout(200);

    // Seed high-level profile with 5,000 points and all tiers cleared in proper storage schema
    const seedMasterProfile = async () => {
      await page.evaluate(() => {
        if (window.State) {
          window.State.set('activeSession', null, false);
        }
        const p = {
          id: 'prof-test-master',
          username: 'TestMaster',
          avatarId: 'cyber_fox',
          totalScore: 5000,
          xp: 5000,
          level: 5,
          completedTiers: {
            python_beginner: true,
            python_intermediate: true,
            python_expert: true
          },
          campaign: {
            python: {
              unlockedTier: 'expert',
              beginnerStars: 3,
              intermediateStars: 3,
              expertStars: 0
            }
          },
          preferences: { language: 'python', difficulty: 'beginner', theme: 'dark' }
        };
        const schema = {
          version: 1,
          activeProfileId: 'prof-test-master',
          profiles: [p],
          activeSession: null,
          settings: { theme: 'dark', soundEnabled: true, sfxVolume: 0.8, musicEnabled: false, reducedMotion: false }
        };
        localStorage.setItem('syntaxarena_storage_v1', JSON.stringify(schema));
        if (window.State) {
          window.State.init('index');
        }
      });
    };
    await seedMasterProfile();

    const difficulties = ['beginner', 'intermediate', 'expert'];
    for (const diff of difficulties) {
      await page.goto(`${BASE_URL}/game.html?lang=python&diff=${diff}&new=true`);
      await page.waitForTimeout(400);

      const diffBadge = await page.textContent('#q-diff-badge');
      assert(
        diffBadge && diffBadge.toLowerCase().includes(diff),
        `T3.${diff} Difficulty badge displays ${diff.toUpperCase()} (got "${diffBadge}")`
      );

      const pText = await page.textContent('#q-prompt-text');
      assert(
        pText && !pText.includes('Loading challenge prompt...'),
        `T3.${diff} ${diff.toUpperCase()} tier renders prompt text`
      );
    }

    // -------------------------------------------------------------------------
    // TEST 4: Page Refresh & In-Progress Session Resume
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 4: Page Refresh & Active Session Restoration ---');
    await page.goto(`${BASE_URL}/game.html?lang=python&diff=beginner&new=true`);
    await page.waitForTimeout(400);

    // Answer Question 1
    const firstOption = page.locator('#answer-interface-container .option-card').first();
    await firstOption.click();
    await page.click('#btn-submit-answer');
    await page.waitForTimeout(200);

    // Advance to Question 2 if next button visible
    const nextBtn = page.locator('#btn-next-question');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(300);
    }

    const stepBeforeReload = await page.textContent('#hud-step-counter');

    // Trigger page refresh
    await page.reload();
    await page.waitForTimeout(500);

    const stepAfterReload = await page.textContent('#hud-step-counter');
    assert(
      stepBeforeReload === stepAfterReload,
      `T4.1 Step counter preserved across reload (Before: "${stepBeforeReload}", After: "${stepAfterReload}")`
    );

    const isResumedEngine = await page.evaluate(() => window.Gameplay && window.Gameplay.engine !== null);
    assert(isResumedEngine, 'T4.2 Gameplay.engine is successfully restored on page refresh');

    const promptAfterReload = await page.textContent('#q-prompt-text');
    assert(
      promptAfterReload && !promptAfterReload.includes('Loading challenge prompt...'),
      'T4.3 Prompt text correctly restored after page reload'
    );

    // -------------------------------------------------------------------------
    // TEST 5: Router DOM Landmark Detection & Clean URL Fallback
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 5: Router Page Detection Invariants ---');
    const detectedPage = await page.evaluate(() => window.Router && window.Router.getCurrentPage());
    assert(detectedPage === 'game', `T5.1 Router.getCurrentPage() returns 'game' on arena page (got '${detectedPage}')`);

    await page.goto(`${BASE_URL}/index.html`);
    await page.waitForTimeout(300);
    const indexPage = await page.evaluate(() => window.Router && window.Router.getCurrentPage());
    assert(indexPage === 'index', `T5.2 Router.getCurrentPage() returns 'index' on hub page (got '${indexPage}')`);

    await page.goto(`${BASE_URL}/results.html`);
    await page.waitForTimeout(300);
    const resultsPage = await page.evaluate(() => window.Router && window.Router.getCurrentPage());
    assert(resultsPage === 'results', `T5.3 Router.getCurrentPage() returns 'results' on results page (got '${resultsPage}')`);

    await page.goto(`${BASE_URL}/progress.html`);
    await page.waitForTimeout(300);
    const progressPage = await page.evaluate(() => window.Router && window.Router.getCurrentPage());
    assert(progressPage === 'progress', `T5.4 Router.getCurrentPage() returns 'progress' on progress page (got '${progressPage}')`);

    await page.goto(`${BASE_URL}/settings.html`);
    await page.waitForTimeout(300);
    const settingsPage = await page.evaluate(() => window.Router && window.Router.getCurrentPage());
    assert(settingsPage === 'settings', `T5.5 Router.getCurrentPage() returns 'settings' on settings page (got '${settingsPage}')`);

  } catch (err) {
    console.error('Test suite crashed with unhandled error:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n============================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runVercelInitSuite();
