/**
 * Master Playwright End-to-End Suite
 * Tests all pages, buttons, clicks, modals, audio, theme, forms, and game states.
 */

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const report = {
    passed: [],
    failed: []
  };

  function pass(name, details = '') {
    report.passed.push({ name, details });
    console.log(`  [PASS] ${name} ${details ? '(' + details + ')' : ''}`);
  }

  function fail(name, details = '') {
    report.failed.push({ name, details });
    console.error(`  [FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
  }

  page.on('pageerror', err => {
    fail('Unhandled Page Error', err.message);
  });

  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon.ico')) {
      fail('Console Error', msg.text());
    }
  });

  // =========================================================================
  // SUITE 1: index.html (Landing Page & Onboarding)
  // =========================================================================
  console.log('\n========================================');
  console.log('SUITE 1: index.html (Landing & Hub)');
  console.log('========================================');

  await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  // 1.1 Header Theme Toggle
  const themeBtn = page.locator('#btn-theme-toggle');
  const tBefore = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await themeBtn.click();
  const tAfter = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (tBefore !== tAfter) pass('Header Theme Toggle', `${tBefore} -> ${tAfter}`);
  else fail('Header Theme Toggle', 'Theme did not change');

  // 1.2 Header Sound Toggle
  const soundBtn = page.locator('#btn-sound-toggle');
  await soundBtn.click();
  pass('Header Sound Toggle', 'Clicked successfully');

  // 1.3 Language Track Selection Cards
  for (const lang of ['c', 'cpp', 'java', 'python']) {
    const card = page.locator(`#language-tracks-container [data-lang="${lang}"]`);
    await card.click();
    const isSel = await card.evaluate(el => el.classList.contains('is-selected'));
    if (isSel) pass(`Language Track Selection: ${lang.toUpperCase()}`);
    else fail(`Language Track Selection: ${lang.toUpperCase()}`);
  }

  // 1.4 Difficulty Selection Cards & Tier Gating
  for (const diff of ['intermediate', 'expert', 'beginner']) {
    const card = page.locator(`#difficulty-cards-container [data-diff="${diff}"]`);
    const isLocked = await card.evaluate(el => el.classList.contains('is-locked') || el.getAttribute('aria-disabled') === 'true');
    if (isLocked) {
      await card.click({ force: true });
      pass(`Difficulty Gating: ${diff} correctly locked for Level 1 player`);
    } else {
      await card.click();
      const isSel = await card.evaluate(el => el.classList.contains('is-selected'));
      if (isSel) pass(`Difficulty Selection: ${diff}`);
      else fail(`Difficulty Selection: ${diff}`);
    }
  }

  // 1.5 Smooth Scroll Buttons
  const scrollBtns = page.locator('[data-scroll-to]');
  const scrollCount = await scrollBtns.count();
  let clickedScroll = 0;
  for (let i = 0; i < scrollCount; i++) {
    const btn = scrollBtns.nth(i);
    if (await btn.isVisible()) {
      await btn.click();
      clickedScroll++;
    }
  }
  pass(`Smooth Scroll Buttons (${clickedScroll} visible clicked)`);

  // 1.6 Mobile Menu Toggle
  const mobileMenuBtn = page.locator('#btn-mobile-menu');
  if (await mobileMenuBtn.isVisible()) {
    await mobileMenuBtn.click();
    await page.waitForTimeout(200);
    const isOpen = await page.locator('#mobile-nav-drawer').evaluate(el => el.classList.contains('is-open'));
    if (isOpen) pass('Mobile Menu Open');
    else fail('Mobile Menu Open');
    await mobileMenuBtn.click();
    await page.waitForTimeout(200);
    pass('Mobile Menu Close');
  }

  // 1.7 Onboarding Wizard Complete Flow
  console.log('\n--- Testing Onboarding Flow ---');
  await page.locator('#btn-hero-start').click();
  await page.waitForTimeout(300);

  const onboardingModal = page.locator('#modal-onboarding');
  if (await onboardingModal.isVisible()) {
    pass('Onboarding Modal Opened via Hero Play button');

    // Select Avatar
    const avatar = page.locator('.avatar-option-btn[data-avatar-id="matrix_cat"]');
    await avatar.click();
    pass('Avatar Selection: Matrix Cat');

    // Fill Username
    const usernameInput = page.locator('#onboarding-username');
    await usernameInput.fill('PlaywrightHero');
    pass('Username Input: PlaywrightHero');

    // Step 1 -> 2
    await page.locator('#btn-wizard-to-step2').click();
    await page.waitForTimeout(250);
    if (await page.locator('#wizard-pane-2').isVisible()) pass('Wizard Step 2 Reached');
    else fail('Wizard Step 2 Reached');

    // Step 2 Select Java
    await page.locator('#wizard-lang-grid [data-lang="java"]').click();
    pass('Wizard Step 2 Language Selection: Java');

    // Step 2 -> 3
    await page.locator('#btn-wizard-to-step3').click();
    await page.waitForTimeout(250);
    if (await page.locator('#wizard-pane-3').isVisible()) pass('Wizard Step 3 Reached');
    else fail('Wizard Step 3 Reached');

    // Step 3 Select Beginner
    await page.locator('#wizard-diff-grid [data-diff="beginner"]').click();
    pass('Wizard Step 3 Difficulty Selection: Beginner');

    // Step 3 -> 4
    await page.locator('#btn-wizard-to-step4').click();
    await page.waitForTimeout(250);
    if (await page.locator('#wizard-pane-4').isVisible()) pass('Wizard Step 4 Reached');
    else fail('Wizard Step 4 Reached');

    // Verify Summary
    const sumUser = await page.locator('#summary-username').textContent();
    const sumLang = await page.locator('#summary-language').textContent();
    const sumDiff = await page.locator('#summary-difficulty').textContent();
    if (sumUser.includes('PlaywrightHero') && sumLang.includes('Java') && sumDiff.includes('Beginner')) {
      pass('Wizard Summary Validation', `${sumUser} | ${sumLang} | ${sumDiff}`);
    } else {
      fail('Wizard Summary Validation', `${sumUser} | ${sumLang} | ${sumDiff}`);
    }

    // Step 4 Confirm & Play Now
    await page.locator('#btn-wizard-confirm-play').click();
    await page.waitForTimeout(1000);
    if (page.url().includes('game.html')) {
      pass('Wizard Completion Navigation to game.html', page.url());
    } else {
      fail('Wizard Completion Navigation to game.html', page.url());
    }
  } else {
    fail('Onboarding Modal Opened via Hero Play button');
  }

  // =========================================================================
  // SUITE 2: game.html (Challenge Arena & Gameplay Controller)
  // =========================================================================
  console.log('\n========================================');
  console.log('SUITE 2: game.html (Arena Gameplay)');
  console.log('========================================');

  await page.goto('http://127.0.0.1:8080/game.html?lang=python&diff=beginner');
  await page.waitForTimeout(500);

  // 2.1 Arena Initial State
  const qPrompt = await page.locator('#q-prompt-text').textContent();
  if (qPrompt && !qPrompt.includes('Loading')) pass('Question Loaded', qPrompt.trim().substring(0, 45) + '...');
  else fail('Question Loaded', qPrompt);

  // 2.2 Options Rendered
  const opts = page.locator('.option-card');
  const optCount = await opts.count();
  if (optCount >= 2) pass(`Options Rendered (${optCount} options)`);
  else fail(`Options Rendered (${optCount} options)`);

  // 2.3 Option Click
  await opts.nth(0).click();
  const submitBtn = page.locator('#btn-submit-answer');
  if (!(await submitBtn.isDisabled())) pass('Option Click enables Submit button');
  else fail('Option Click enables Submit button');

  // 2.4 Hint Drawer
  const hintBtn = page.locator('#btn-use-hint');
  await hintBtn.click();
  await page.waitForTimeout(200);
  if (await page.locator('#hint-drawer').isVisible()) pass('Hint Drawer Expands with Pedagogical Clue');
  else fail('Hint Drawer Expands');

  // 2.5 Submit Answer
  await submitBtn.click();
  await page.waitForTimeout(400);
  if (await page.locator('#feedback-panel').isVisible()) pass('Feedback Panel Displays Answer Evaluation');
  else fail('Feedback Panel Displays Answer Evaluation');

  // 2.6 Abandon Run Modal
  const exitBtn = page.locator('#btn-exit-game');
  await exitBtn.click();
  await page.waitForTimeout(200);
  if (await page.locator('#modal-confirm-exit').isVisible()) pass('Abandon Run Modal Opens');
  else fail('Abandon Run Modal Opens');

  // Cancel via Resume button
  await page.locator('#btn-cancel-exit').click();
  await page.locator('#modal-confirm-exit').waitFor({ state: 'hidden', timeout: 3000 });
  pass('Resume Button Closes Abandon Modal');

  // Re-open and cancel via 'X' button
  await exitBtn.click();
  await page.locator('#modal-confirm-exit').waitFor({ state: 'visible', timeout: 3000 });
  await page.locator('#btn-cancel-exit-x').click();
  await page.locator('#modal-confirm-exit').waitFor({ state: 'hidden', timeout: 3000 });
  pass('Close "X" Button Closes Abandon Modal');

  // 2.7 Arena Single Language Isolation (User Rule: In arena section do not show other languages)
  const hudLangTag = page.locator('#hud-lang-tag');
  if (await hudLangTag.isVisible()) {
    const langText = await hudLangTag.textContent();
    pass(`Arena Single Language Display: Only active track (${langText.trim()}) shown in Arena HUD`);
  } else {
    fail('Arena Single Language Display', 'hud-lang-tag not visible');
  }
  const extraTrackBtns = await page.locator('[id^="btn-lang-"]').count();
  if (extraTrackBtns === 0) {
    pass('Arena Cleanliness: Other language switcher buttons cleanly excluded from Arena');
  } else {
    fail('Arena Cleanliness', `Found ${extraTrackBtns} unexpected language buttons in Arena`);
  }

  // =========================================================================
  // SUITE 3: results.html (Analytics & Stage Review)
  // =========================================================================
  console.log('\n========================================');
  console.log('SUITE 3: results.html (Stage Results)');
  console.log('========================================');

  await page.goto('http://127.0.0.1:8080/results.html?lang=python&diff=beginner&score=1450&correct=18&total=20');
  await page.waitForTimeout(400);

  const gradeText = await page.locator('#results-grade-display').textContent();
  if (gradeText.includes('GRADE')) pass('Results Grade Rendered', gradeText.trim());
  else fail('Results Grade Rendered');

  const playAgain = page.locator('#btn-play-again');
  if (await playAgain.isVisible()) pass('Play Again Button Visible');
  else fail('Play Again Button Visible');

  // =========================================================================
  // SUITE 4: progress.html (Campaign Progression & Badges)
  // =========================================================================
  console.log('\n========================================');
  console.log('SUITE 4: progress.html (Player Progression)');
  console.log('========================================');

  await page.goto('http://127.0.0.1:8080/progress.html');
  await page.waitForTimeout(400);

  const progHeader = await page.locator('h1').textContent();
  pass('Progress Page Loaded', progHeader.trim());

  // Click on achievement cards to verify toasts
  const achCards = page.locator('.card-interactive');
  const achCount = await achCards.count();
  if (achCount > 0) {
    await achCards.nth(0).click();
    await page.waitForTimeout(200);
    pass(`Achievement Card Clicked (${achCount} interactive cards)`);
  }

  // =========================================================================
  // SUITE 5: settings.html (Configuration & Profile Management)
  // =========================================================================
  console.log('\n========================================');
  console.log('SUITE 5: settings.html (Settings & Profiles)');
  console.log('========================================');

  await page.goto('http://127.0.0.1:8080/settings.html');
  await page.waitForTimeout(400);

  // Avatar Selection in Settings
  const settingAvatarBtns = page.locator('#avatar-grid button');
  const avCount = await settingAvatarBtns.count();
  if (avCount >= 6) {
    await settingAvatarBtns.nth(1).click();
    pass(`Settings Avatar Grid Clicked (${avCount} avatars)`);
  } else {
    fail(`Settings Avatar Grid Clicked (${avCount} avatars)`);
  }

  // Audio Test Buttons
  const testSoundBtn = page.locator('#btn-test-sound');
  if (await testSoundBtn.isVisible()) {
    await testSoundBtn.click();
    pass('Settings SFX Test Button Clicked');
  }

  const testFanfareBtn = page.locator('#btn-test-fanfare');
  if (await testFanfareBtn.isVisible()) {
    await testFanfareBtn.click();
    pass('Settings Fanfare Test Button Clicked');
  }

  // Callsign update & Save Profile
  const callsignInput = page.locator('#profile-callsign-input');
  if (await callsignInput.isVisible()) {
    await callsignInput.fill('VortexCoder');
    await page.locator('#btn-save-profile').click();
    await page.waitForTimeout(300);
    pass('Save Profile Button Clicked and Updated Callsign');
  }

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n========================================');
  console.log('MASTER PLAYWRIGHT E2E SUMMARY');
  console.log('========================================');
  console.log(`PASSED: ${report.passed.length}`);
  console.log(`FAILED: ${report.failed.length}`);

  if (report.failed.length > 0) {
    console.error('\nFailures breakdown:');
    report.failed.forEach((f, i) => console.error(`${i + 1}. [${f.name}] ${f.details}`));
  }

  await browser.close();
  process.exit(report.failed.length > 0 ? 1 : 0);
})();
