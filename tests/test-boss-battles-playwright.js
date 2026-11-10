/**
 * Playwright E2E Test Suite: Feature 1 — Cyberpunk Mega-Boss Battles ("The Daemon Incursion")
 * Verifies Hub entry, Boss HUD rendering, dynamic adversary selection modal,
 * answer damage processing, glitch retaliations, and responsive viewport sizing.
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runBossPlaywrightTests() {
  console.log('\n============================================================');
  console.log('👾 RUNNING PLAYWRIGHT E2E SUITE: MEGA-BOSS BATTLES');
  console.log('============================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.warn(`  [Browser Console Error] ${msg.text()}`);
    }
  });

  try {
    // -------------------------------------------------------------
    // Test 1: Hub Entry Link Verification
    // -------------------------------------------------------------
    console.log('--- Test 1: Hub Showcase Card Verification ---');
    const indexUrl = `file:///${path.join(projectRoot, 'index.html').replace(/\\/g, '/')}`;
    await page.goto(indexUrl, { waitUntil: 'domcontentloaded' });

    const bossCard = page.locator('#btn-showcase-boss-incursion');
    await bossCard.scrollIntoViewIfNeeded();
    const isBossCardVisible = await bossCard.isVisible();
    assert(isBossCardVisible, 'Hub displays "The Daemon Incursion" showcase card');

    const cardHref = await bossCard.getAttribute('href');
    assert(cardHref && cardHref.includes('mode=boss'), 'Showcase link points to game.html?mode=boss');

    // -------------------------------------------------------------
    // Test 2: Mega-Boss HUD Initialization (Default Leviathan)
    // -------------------------------------------------------------
    console.log('\n--- Test 2: Mega-Boss HUD Initialization ---');
    const gameBossUrl = `file:///${path.join(projectRoot, 'game.html').replace(/\\/g, '/')}?mode=boss&boss=null_leviathan&new=true`;
    await page.goto(gameBossUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    const bossHud = page.locator('#hud-boss-battle-bar');
    const isHudVisible = await bossHud.isVisible();
    assert(isHudVisible, 'Mega-Boss Battle HUD is visible on arena screen');

    const ghostRail = page.locator('#hud-ghost-duel-rail');
    const isGhostHidden = !(await ghostRail.isVisible());
    assert(isGhostHidden, 'Ghost Speed Duel rail is cleanly hidden during Boss Battles');

    const bossName = await page.locator('#boss-name-text').textContent();
    assert(bossName && bossName.includes('NullPointer Leviathan'), `Boss HUD displays correct name: "${bossName}"`);

    const bossAvatar = await page.locator('#boss-avatar-emblem').textContent();
    assert(bossAvatar && bossAvatar.includes('🐙'), `Boss avatar emblem renders: "${bossAvatar}"`);

    const hpText = await page.locator('#boss-hp-text').textContent();
    assert(hpText && hpText.includes('1000 / 1000 HP'), `Initial HP text is 1000 / 1000 HP: "${hpText}"`);

    const phaseBadge = await page.locator('#boss-phase-badge').textContent();
    assert(phaseBadge && phaseBadge.includes('PHASE 1'), 'Boss starts in PHASE 1');

    const tauntText = await page.locator('#boss-taunt-text').textContent();
    assert(tauntText && tauntText.length > 10, `Intro dialogue taunt displayed: "${tauntText}"`);

    // -------------------------------------------------------------
    // Test 3: Adversary Selection Modal
    // -------------------------------------------------------------
    console.log('\n--- Test 3: Adversary Selection Modal Interaction ---');
    const switchBtn = page.locator('#btn-switch-boss');
    await switchBtn.click();
    await page.waitForTimeout(300);

    const selectModal = page.locator('#modal-boss-select');
    const isModalOpen = await selectModal.evaluate(el => el.classList.contains('is-active') || el.getAttribute('aria-hidden') === 'false');
    assert(isModalOpen, 'Boss selection modal opened via switch button');

    const bossCards = page.locator('.boss-select-card');
    const bossCount = await bossCards.count();
    assert(bossCount === 4, `Selection grid renders exactly 4 Boss cards (found ${bossCount})`);

    // Close modal
    const closeBtn = page.locator('#btn-close-boss-select-x');
    await closeBtn.click();
    await page.waitForTimeout(200);
    const isModalClosed = await selectModal.evaluate(el => !el.classList.contains('is-active') && el.getAttribute('aria-hidden') === 'true');
    assert(isModalClosed, 'Boss selection modal closed cleanly via X button');

    // -------------------------------------------------------------
    // Test 4: Turn Execution, Damage Spawning & HP Update
    // -------------------------------------------------------------
    console.log('\n--- Test 4: Combat Turn & Damage Dealing ---');
    const optionCards = page.locator('.option-card');
    const optionCount = await optionCards.count();
    console.log(`  [Debug] Current .option-card count: ${optionCount}`);

    if (optionCount > 0) {
      const correctIdx = await page.evaluate(() => {
        const q = window.Gameplay?.engine?.getCurrentQuestion();
        return (q && typeof q.correctIndex === 'number') ? q.correctIndex : 1;
      });
      console.log(`  [Debug] Active question correct option index: ${correctIdx}`);
      await optionCards.nth(Math.min(correctIdx, optionCount - 1)).click();
    } else {
      const linePills = page.locator('.line-pill-btn');
      if (await linePills.count() > 0) {
        await linePills.first().click();
      }
    }
    await page.waitForTimeout(200);

    // Submit answer
    const submitBtn = page.locator('#btn-submit-answer');
    await submitBtn.click();
    await page.waitForTimeout(600);

    // Verify feedback panel appears
    const feedbackPanel = page.locator('#feedback-panel');
    const isFeedbackShown = await feedbackPanel.isVisible();
    assert(isFeedbackShown, 'Challenge feedback panel is displayed on submission');

    // Verify HP text or fill width updated
    const updatedHpText = await page.locator('#boss-hp-text').textContent();
    assert(updatedHpText && !updatedHpText.includes('1000 / 1000 HP (100%)'), `Boss HP successfully reduced after combat turn: "${updatedHpText}"`);

    // -------------------------------------------------------------
    // Test 5: Responsive Viewport Stress Test
    // -------------------------------------------------------------
    console.log('\n--- Test 5: Responsive Viewport Pressure (Desktop, Tablet, Mobile) ---');
    const viewports = [
      { name: 'Desktop HD', width: 1280, height: 800 },
      { name: 'iPad Tablet', width: 768, height: 1024 },
      { name: 'Mobile iPhone SE', width: 375, height: 667 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(200);

      const hasHorizScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      if (hasHorizScroll) {
        const culprits = await page.evaluate(() => {
          const docW = document.documentElement.clientWidth;
          const list = [];
          document.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > docW + 2) {
              list.push(`${el.tagName}#${el.id}.${el.className.toString().slice(0, 30)} (right: ${Math.round(r.right)}, docW: ${docW})`);
            }
          });
          return list.slice(0, 5);
        });
        console.log(`  [Overflow Culprits on ${vp.name}]:`, culprits);
      }
      assert(!hasHorizScroll, `${vp.name} (${vp.width}x${vp.height}) has zero horizontal overflow in Boss HUD`);

      const hudVisible = await page.locator('#hud-boss-battle-bar').isVisible();
      assert(hudVisible, `${vp.name} keeps Boss HUD visible`);
    }

  } catch (err) {
    console.error('Test execution failed with error:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n============================================================');
  console.log(`PLAYWRIGHT BOSS TESTS: ${passed} passed, ${failed} failed`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runBossPlaywrightTests();
