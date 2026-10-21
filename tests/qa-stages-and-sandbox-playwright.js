import { chromium } from 'playwright';
import assert from 'assert';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 8094;
const BASE_URL = `http://localhost:${PORT}`;

// Simple static server serving workspace directory
function createServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
  };

  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(process.cwd(), reqPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  });
}

async function runStagesAndSandboxTest() {
  const server = createServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`🚀 Test Server started on port ${PORT}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  try {
    console.log('\n--- 1. Testing Stage Slicing & Header Display (5 Questions / Stage) ---');
    await page.goto(`${BASE_URL}/game.html?lang=python&diff=beginner&stage=1`);
    await page.waitForSelector('#answer-interface-container .option-card');

    // Verify question step counter says "Question 1 of 5" (NOT 20!)
    const stepText = await page.locator('#hud-step-counter').textContent();
    console.log('Stage 1 Step Counter:', stepText);
    assert(stepText.includes('1 of 5'), 'Question counter displays 1 of 5 for Stage 1');

    // Verify stage badge in card header
    const diffBadge = await page.locator('#q-diff-badge').textContent();
    console.log('Stage 1 Diff Badge:', diffBadge);
    assert(diffBadge.includes('Stage 1 / 8'), 'Diff badge reflects Stage 1 / 8');

    console.log('\n--- 2. Testing Boss Stage (Stage 4) Styling ---');
    await page.goto(`${BASE_URL}/game.html?lang=python&diff=beginner&stage=4`);
    await page.waitForSelector('#answer-interface-container .option-card');

    const bossStepText = await page.locator('#hud-step-counter').textContent();
    console.log('Boss Stage Step Counter:', bossStepText);
    assert(bossStepText.includes('1 of 5'), 'Boss Stage has 5 questions');

    const bossBadge = await page.locator('#q-diff-badge').textContent();
    console.log('Boss Badge text:', bossBadge);
    assert(bossBadge.includes('BOSS STAGE'), 'Boss badge displays BOSS STAGE');

    console.log('\n--- 3. Testing Focused Gameplay Arena (Drawer Removed per Item 2) ---');
    const sandboxToggleCount = await page.locator('#btn-toggle-sandbox').count();
    const drawerCount = await page.locator('#sandbox-drawer').count();
    assert(sandboxToggleCount === 0 && drawerCount === 0, 'In-game sandbox drawer is cleanly removed from arena');
    console.log('✓ PASS: Arena drawer removed to eliminate confusion (sandbox lives exclusively on /sandbox.html)!');

    console.log('\n--- 4. Testing Results Page for Stages & Star Ratings ---');
    await page.evaluate(() => {
      const summary = {
        sessionId: 'sess_stage_1_clear',
        language: 'python',
        difficulty: 'beginner',
        stage: 1,
        stageName: 'Stage 1: Core Fundamentals',
        mode: 'campaign',
        totalQuestions: 5,
        questionsAttempted: 5,
        questionsCorrect: 5,
        accuracy: 100,
        totalScore: 750,
        stars: 3,
        bestStreak: 5,
        hintsUsed: 0,
        retriesUsed: 0,
        elapsedSeconds: 65,
        isCompleted: true,
        isFlawless: true,
        missedQuestionIds: [],
        results: []
      };
      sessionStorage.setItem('syntaxarena_last_session_summary', JSON.stringify(summary));
    });

    await page.goto(`${BASE_URL}/results.html`);
    await page.waitForSelector('#results-grade-display');

    // Check Stage Cleared badge
    const stageBadgeText = await page.locator('#results-stage-badge').textContent();
    console.log('Results Stage Badge:', stageBadgeText);
    assert(stageBadgeText.includes('Stage 1 / 8 Cleared!'), 'Results header announces Stage 1 Cleared');

    // Check Star Rating
    const starRatingText = await page.locator('#results-star-rating').textContent();
    console.log('Results Stars:', starRatingText);
    assert(starRatingText.includes('⭐⭐⭐'), '3 Stars rendered on results screen');

    // Check dynamic Next Stage button
    const nextStageBtn = page.locator('#btn-play-again');
    const nextStageText = await nextStageBtn.textContent();
    const nextStageHref = await nextStageBtn.getAttribute('href');
    console.log('Next Stage button text:', nextStageText, 'href:', nextStageHref);
    assert(nextStageText.includes('Play Stage 2 →'), 'Primary button links directly to Play Stage 2');
    assert(nextStageHref.includes('stage=2'), 'Href contains stage=2');
    console.log('✓ PASS: Stage results & next stage continuation verified!');

    console.log('\n--- 5. Testing Standalone Python Sandbox Page (sandbox.html) ---');
    await page.goto(`${BASE_URL}/sandbox.html`);
    await page.waitForSelector('#page-code-editor');

    const pageRunBtn = page.locator('#btn-page-run');
    await pageRunBtn.click();
    await page.waitForTimeout(1000);

    const pageConsoleOut = await page.locator('#page-console-output').textContent();
    console.log('Sandbox Page Output:', pageConsoleOut);
    assert(pageConsoleOut.includes('len(a): 4') || pageConsoleOut.includes('[1, 2, 3, 4]'), 'Sandbox page executed list mutability template cleanly');
    console.log('✓ PASS: Standalone sandbox.html verified!');

    console.log('\n--- 6. Testing Hub Stage Selector Modal ---');
    // Ensure onboarding is marked complete so Play Now triggers the Stage Selector Modal
    await page.goto(`${BASE_URL}/index.html`);
    await page.evaluate(() => {
      const p = {
        id: 'prof_hub_tester',
        username: 'HubMaster',
        avatarId: 'cyber_fox',
        onboardingComplete: true,
        totalScore: 500,
        level: 2,
        stageStars: { python_beginner_stage_1: 3 }
      };
      if (window.State) {
        window.State.set('activeProfile', p, true);
      }
    });
    await page.waitForTimeout(300);

    const clickDebug = await page.evaluate(() => {
      const p = window.State?.get('activeProfile');
      const isComplete = window.Profile?.isOnboardingComplete(p);
      const btn = document.querySelector('#btn-nav-play') || document.querySelector('#btn-hero-start');
      btn?.click();
      const modal = document.querySelector('#modal-stage-selector');
      return {
        url: window.location.href,
        hasProfile: !!p,
        profileOnboarding: p?.onboardingComplete,
        isComplete,
        btnFound: !!btn,
        modalFound: !!modal,
        modalClasses: modal?.className
      };
    });
    console.log('Hub Click Debug:', clickDebug);
    await page.waitForTimeout(400);

    const stageModal = page.locator('#modal-stage-selector');
    assert(await stageModal.isVisible(), 'Stage Selector Modal opened on Hub Play Now');

    const stageCards = await page.locator('#modal-stage-grid .stage-card');
    const cardCount = await stageCards.count();
    console.log('Stage Cards in Modal:', cardCount);
    assert(cardCount === 8, 'Modal shows 8 Stage Cards (Stage 1 to 8)');

    // Verify strict 3-star unlock gating:
    // With python_beginner_stage_1: 3, Stage 1 and 2 are unlocked, while Stage 3 is locked
    const stage1Locked = await stageCards.nth(0).getAttribute('class');
    const stage2Locked = await stageCards.nth(1).getAttribute('class');
    const stage3Locked = await stageCards.nth(2).getAttribute('class');
    assert(!stage1Locked.includes('is-locked'), 'Stage 1 is unlocked');
    assert(!stage2Locked.includes('is-locked'), 'Stage 2 is unlocked because Stage 1 has 3 stars');
    assert(stage3Locked.includes('is-locked'), 'Stage 3 is locked because Stage 2 has not earned 3 stars');

    // Click locked Stage 3 to verify toast notification
    await stageCards.nth(2).click();
    await page.waitForTimeout(300);
    const toastText = await page.locator('.toast').last().textContent();
    console.log('Locked Stage Click Toast:', toastText);
    assert(toastText.includes('Stage 3 is locked'), 'Clicking locked stage displays informative 3-star requirement toast');

    const marathonBtn = page.locator('#btn-modal-stage-marathon');
    assert(await marathonBtn.isVisible(), 'Tier Marathon 20-question link is available');

    console.log('\n🎉 ALL 8-STAGE CAMPAIGN & STRICT 3-STAR GATING CHECKS PASSED!');
  } finally {
    await browser.close();
    server.close();
  }
}

runStagesAndSandboxTest().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
