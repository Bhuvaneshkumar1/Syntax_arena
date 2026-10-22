import { chromium } from 'playwright';

(async () => {
  console.log('============================================================');
  console.log('🧪 PLAYWRIGHT E2E: VERIFYING 8 LANGUAGES ACROSS ALL SURFACES');
  console.log('============================================================\n');

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      passed++;
      console.log(`  ✓ [PASS] ${name}`);
    } else {
      failed++;
      console.error(`  ✗ [FAIL] ${name} ${details}`);
    }
  }

  // 1. Landing Page: All 8 track cards rendered and selectable
  console.log('--- 1. Testing Landing Page Track Selection ---');
  await page.goto('http://127.0.0.1:8080/index.html');
  await page.waitForTimeout(500);

  const trackCards = page.locator('#language-tracks-container .card-selectable');
  const trackCount = await trackCards.count();
  assert(trackCount === 10, `Landing page displays 10 language track cards (found ${trackCount})`);

  const expectedLangs = ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql', 'typescript', 'go'];
  for (const lang of expectedLangs) {
    const card = page.locator(`#language-tracks-container [data-lang="${lang}"]`);
    assert(await card.count() === 1, `Track card exists for ${lang}`);
    await card.click();
    await page.waitForTimeout(100);
    const isSelected = await card.evaluate(el => el.classList.contains('is-selected'));
    assert(isSelected, `Track card ${lang} becomes selected on click`);
  }

  // 2. Onboarding Wizard: 10 language cards in Step 2
  console.log('\n--- 2. Testing Onboarding Wizard Language Selection ---');
  const wizardLangCards = page.locator('#wizard-lang-grid .card-selectable');
  const wizardCount = await wizardLangCards.count();
  assert(wizardCount === 10, `Onboarding wizard displays 10 language options (found ${wizardCount})`);
  for (const lang of expectedLangs) {
    const wCard = page.locator(`#wizard-lang-grid [data-lang="${lang}"]`);
    assert(await wCard.count() === 1, `Wizard card exists for ${lang}`);
  }

  // 3. Arena Gameplay: Verify new 6 languages initialize and play
  console.log('\n--- 3. Testing Arena Gameplay for New Tracks ---');
  const newLangs = [
    { lang: 'cyber', expectedPrompt: true, expectedHUD: 'Cyber' },
    { lang: 'javascript', expectedPrompt: true, expectedHUD: 'JavaScript' },
    { lang: 'rust', expectedPrompt: true, expectedHUD: 'Rust' },
    { lang: 'sql', expectedPrompt: true, expectedHUD: 'SQL' },
    { lang: 'typescript', expectedPrompt: true, expectedHUD: 'TypeScript' },
    { lang: 'go', expectedPrompt: true, expectedHUD: 'Go' }
  ];

  for (const item of newLangs) {
    await page.goto(`http://127.0.0.1:8080/game.html?lang=${item.lang}&diff=beginner`);
    await page.waitForTimeout(500);

    const promptText = (await page.locator('#q-prompt-text').textContent()).trim();
    assert(promptText && promptText !== 'Loading challenge prompt...', `[${item.lang}] Loads question prompt: "${promptText.slice(0, 40)}..."`);

    const hudTag = (await page.locator('#hud-lang-tag').textContent()).trim();
    assert(hudTag.includes(item.expectedHUD), `[${item.lang}] HUD displays correct language tag (got "${hudTag}")`);

    const options = page.locator('.option-card, .line-pill-btn');
    const optCount = await options.count();
    assert(optCount >= 2, `[${item.lang}] Renders interactive answer options (count: ${optCount})`);

    // Click first option and submit
    await options.first().click();
    const submitBtn = page.locator('#btn-submit-answer');
    assert(await submitBtn.isEnabled(), `[${item.lang}] Submit button is enabled after choosing option`);

    await submitBtn.click();
    await page.waitForTimeout(400);

    const feedbackVisible = await page.locator('#feedback-panel').isVisible();
    assert(feedbackVisible, `[${item.lang}] Feedback panel appears after answer submission`);

    const explanationVisible = await page.locator('#feedback-explanation-text').isVisible();
    assert(explanationVisible, `[${item.lang}] Explanation text is displayed in feedback panel`);
  }

  // 4. Progress Page: Performance Grid and Filter Dropdown
  console.log('\n--- 4. Testing Progress & Analytics Page ---');
  await page.goto('http://127.0.0.1:8080/progress.html');
  await page.waitForTimeout(500);

  const filterOptions = page.locator('#filter-history-lang option');
  const filterCount = await filterOptions.count();
  assert(filterCount === 11, `Language filter dropdown has 11 options (All + 10 languages, got ${filterCount})`);

  for (const lang of expectedLangs) {
    const opt = page.locator(`#filter-history-lang option[value="${lang}"]`);
    assert(await opt.count() === 1, `Dropdown filter contains option for ${lang}`);
  }

  const langCards = page.locator('#language-performance-grid > div');
  const cardCount = await langCards.count();
  assert(cardCount === 10, `Language performance grid displays exactly 10 track cards (found ${cardCount})`);

  await browser.close();

  console.log('\n============================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('============================================================');

  if (failed > 0) {
    process.exit(1);
  }
})();
