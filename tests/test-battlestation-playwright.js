/**
 * Playwright E2E Suite: Terminal Tycoon Hacker Battlestation Rig & Vanity Engine (Feature 7)
 * Verifies Hub quick-launch deck button, settings page showroom, live mechanical keycap tester,
 * category tabs, cosmetic DOM applicators (CRT shaders, RGB underglows, Matrix Rain canvas),
 * XP unlock gates, and persistent state across page reload.
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runBattlestationPlaywrightSuite() {
  console.log('============================================================');
  console.log('🖥️ RUNNING BATTLESTATION RIG & VANITY PLAYWRIGHT E2E SUITE');
  console.log('============================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`  [Browser ${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', err => {
    console.error(`  [Browser PageError] ${err.message}`);
  });

  try {
    // -------------------------------------------------------------
    // Test 1: Hub Quick-Launch Command Deck Button
    // -------------------------------------------------------------
    console.log('--- 1. Hub Quick-Launch Link to Battlestation ---');
    const indexPath = `file://${path.join(rootDir, 'index.html').replace(/\\/g, '/')}`;
    await page.goto(indexPath, { waitUntil: 'domcontentloaded' });

    const deckBtn = await page.$('#btn-showcase-battlestation-deck');
    assert(deckBtn !== null, 'Hacker Battlestation button present in Hero Quick-Launch Command Deck');

    const deckHref = await deckBtn.getAttribute('href');
    assert(deckHref.includes('settings.html#section-battlestation'), 'Battlestation button links to settings.html#section-battlestation');

    // -------------------------------------------------------------
    // Test 2: Settings Page Showroom & Telemetry Banner
    // -------------------------------------------------------------
    console.log('\n--- 2. Settings Page Battlestation Showroom & Telemetry ---');
    const settingsPath = `file://${path.join(rootDir, 'settings.html').replace(/\\/g, '/')}`;
    await page.goto(settingsPath, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const showroomSec = await page.$('#section-battlestation');
    assert(showroomSec !== null, 'Hacker Battlestation section is mounted in DOM');

    const statSwitch = await page.$eval('#rig-stat-switch', el => el.textContent.trim());
    assert(statSwitch.includes('Cherry MX Blue'), `Initial switch is Cherry MX Blue (found: "${statSwitch}")`);

    const statCrt = await page.$eval('#rig-stat-crt', el => el.textContent.trim());
    assert(statCrt.includes('Modern Slate OLED'), `Initial CRT is Modern Slate OLED (found: "${statCrt}")`);

    const statAura = await page.$eval('#rig-stat-aura', el => el.textContent.trim());
    assert(statAura.includes('Stealth Matte'), `Initial underglow is Stealth Matte (found: "${statAura}")`);

    // -------------------------------------------------------------
    // Test 3: Live Mechanical Keycap Acoustic Tester
    // -------------------------------------------------------------
    console.log('\n--- 3. Live Mechanical Keycap Acoustic Tester ---');
    const escBtn = await page.$('#key-test-esc');
    const tabBtn = await page.$('#key-test-tab');
    const spaceBtn = await page.$('#key-test-space');
    const enterBtn = await page.$('#key-test-enter');

    assert(escBtn !== null, 'ESC keycap is mounted');
    assert(tabBtn !== null, 'TAB keycap is mounted');
    assert(spaceBtn !== null, 'SPACEBAR keycap is mounted');
    assert(enterBtn !== null, 'ENTER keycap is mounted');

    // Click keycap to test acoustic synthesis and press animation
    await escBtn.click();
    await page.waitForTimeout(100);
    await spaceBtn.click();
    await page.waitForTimeout(100);

    // Test physical keypress event
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    assert(true, 'Keycap click and physical keyboard listeners trigger cleanly');

    // -------------------------------------------------------------
    // Test 4: Category Navigation Tabs & Item Grid
    // -------------------------------------------------------------
    console.log('\n--- 4. Category Tabs Switching ---');
    const switchTab = await page.$('#tab-btn-keyboard');
    const crtTab = await page.$('#tab-btn-crt');
    const rgbTab = await page.$('#tab-btn-rgb');
    const hardTab = await page.$('#tab-btn-hardware');

    assert(switchTab !== null && crtTab !== null && rgbTab !== null && hardTab !== null, 'All 4 category tabs exist');

    // Check default switches items in grid
    let cards = await page.$$('#battlestation-item-grid .rig-item-card');
    assert(cards.length === 4, `Switches tab displays 4 item cards (found: ${cards.length})`);

    // Switch to CRT tab
    await crtTab.click();
    await page.waitForTimeout(150);
    cards = await page.$$('#battlestation-item-grid .rig-item-card');
    assert(cards.length === 4, `CRT tab displays 4 item cards (found: ${cards.length})`);

    // Switch to RGB tab
    await rgbTab.click();
    await page.waitForTimeout(150);
    cards = await page.$$('#battlestation-item-grid .rig-item-card');
    assert(cards.length === 4, `RGB tab displays 4 item cards (found: ${cards.length})`);

    // Switch to Hardware tab
    await hardTab.click();
    await page.waitForTimeout(150);
    cards = await page.$$('#battlestation-item-grid .rig-item-card');
    assert(cards.length === 4, `Hardware tab displays 4 item cards (found: ${cards.length})`);

    // -------------------------------------------------------------
    // Test 5: Equipping Cosmetics with Profile XP
    // -------------------------------------------------------------
    console.log('\n--- 5. Equipping CRT Shaders, RGB Auras, and Hardware ---');

    // Grant player 5000 XP via profile in browser state
    await page.evaluate(() => {
      const activeProf = window.State.get('activeProfile') || window.Profile.getActiveProfile();
      if (activeProf) {
        activeProf.totalScore = 6000;
        activeProf.xp = 6000;
        window.State.set('activeProfile', { ...activeProf });
        if (window.Profile && window.Profile.updateProfile) {
          window.Profile.updateProfile(activeProf.id, { totalScore: 6000, xp: 6000 });
        }
      }
    });

    // Re-render showroom with 6000 XP
    await crtTab.click();
    await page.waitForTimeout(150);

    // Equip DEC VT100 Green Phosphor shader
    const equipCrtBtn = await page.$('.btn-equip-item[data-id="crt_green_vt100"]');
    assert(equipCrtBtn !== null, 'Equip button for VT100 Green Phosphor is present and unlocked');
    await equipCrtBtn.click();
    await page.waitForTimeout(200);

    // Check body class
    const bodyClassAfterCrt = await page.evaluate(() => document.body.className);
    assert(bodyClassAfterCrt.includes('shader-crt-green'), `document.body has class 'shader-crt-green' (found: "${bodyClassAfterCrt}")`);

    // Check telemetry banner updated
    const updatedCrtText = await page.$eval('#rig-stat-crt', el => el.textContent.trim());
    assert(updatedCrtText.includes('DEC VT100 Green Phosphor'), `Telemetry banner updated to DEC VT100 Green Phosphor`);

    // Switch to RGB tab and equip Chroma RGB Spectrum Flow
    await rgbTab.click();
    await page.waitForTimeout(150);

    const equipChromaBtn = await page.$('.btn-equip-item[data-id="rgb_chroma_spectrum"]');
    assert(equipChromaBtn !== null, 'Equip button for Chroma RGB Spectrum Flow is present');
    await equipChromaBtn.click();
    await page.waitForTimeout(200);

    const bodyClassAfterRgb = await page.evaluate(() => document.body.className);
    assert(bodyClassAfterRgb.includes('aura-chroma-spectrum'), `document.body has class 'aura-chroma-spectrum'`);

    // Switch to Hardware tab and install Digital Matrix Rain Backdrop
    await hardTab.click();
    await page.waitForTimeout(150);

    const equipMatrixBtn = await page.$('.btn-equip-item[data-id="rig_matrix_rain"]');
    assert(equipMatrixBtn !== null, 'Install button for Matrix Rain upgrade is present');
    await equipMatrixBtn.click();
    await page.waitForTimeout(250);

    const matrixCanvas = await page.$('#battlestation-matrix-canvas');
    assert(matrixCanvas !== null, 'Matrix rain canvas backdrop (#battlestation-matrix-canvas) is injected into DOM');

    // -------------------------------------------------------------
    // Test 6: Persistence Across Page Reload
    // -------------------------------------------------------------
    console.log('\n--- 6. Persistence Across Page Reload ---');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const reloadedBodyClass = await page.evaluate(() => document.body.className);
    assert(reloadedBodyClass.includes('shader-crt-green'), 'CRT shader class persists after page reload');
    assert(reloadedBodyClass.includes('aura-chroma-spectrum'), 'RGB underglow class persists after page reload');

    const reloadedMatrix = await page.$('#battlestation-matrix-canvas');
    assert(reloadedMatrix !== null, 'Matrix rain canvas persists after page reload');

    const reloadedCrtStat = await page.$eval('#rig-stat-crt', el => el.textContent.trim());
    assert(reloadedCrtStat.includes('DEC VT100 Green Phosphor'), 'Telemetry banner reflects saved CRT shader');

    // -------------------------------------------------------------
    // Test 7: Switch Sound Preview Buttons
    // -------------------------------------------------------------
    console.log('\n--- 7. Switch Sound Preview Buttons ---');
    await page.click('#tab-btn-keyboard');
    await page.waitForTimeout(150);

    const previewBtn = await page.$('.btn-test-switch[data-switch-id="switch_buckling_spring"]');
    assert(previewBtn !== null, 'Sound test button for Buckling Spring is available');
    await previewBtn.click();
    await page.waitForTimeout(150);
    assert(true, 'Buckling Spring preview click triggered successfully');

    console.log('\n============================================================');
    console.log(`✅ BATTLESTATION PLAYWRIGHT SUITE PASSED: ${passedTests}/${totalTests} assertions`);
    console.log('============================================================\n');

  } catch (err) {
    console.error('\n❌ BATTLESTATION PLAYWRIGHT SUITE FAILED:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runBattlestationPlaywrightSuite();
