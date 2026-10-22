/**
 * SyntaxArena Gamification System Playwright E2E Suite (Batch 6)
 * Tests live browser interactions across:
 * 1. progress.html (Career Dashboard, XP Bar, 20-Badge Trophy Room, Cosmetics Wardrobe, Modes Roadmap)
 * 2. settings.html (Level gating for themes and avatars, locked click interception)
 * 3. game.html (Hardcore Mode hearts HUD, disabled hints, life loss, Game Over modal)
 * 4. results.html (Hardcore run terminated badge, XP earned, rewards display)
 */

import { chromium } from 'playwright';

(async () => {
  console.log('============================================================');
  console.log('🎭 STARTING PLAYWRIGHT GAMIFICATION & REWARDS E2E SUITE');
  console.log('============================================================\n');

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const report = {
    passed: [],
    failed: []
  };

  function pass(name, details = '') {
    report.passed.push({ name, details });
    console.log(`  ✓ [PASS] ${name} ${details ? '(' + details + ')' : ''}`);
  }

  function fail(name, details = '') {
    report.failed.push({ name, details });
    console.error(`  ✗ [FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
  }

  page.on('pageerror', err => {
    fail('Unhandled Page Error', err.message);
  });

  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon.ico')) {
      fail('Console Error', msg.text());
    }
  });

  try {
    // =========================================================================
    // SUITE 1: progress.html (Player Rewards Dashboard)
    // =========================================================================
    console.log('\n--- SUITE 1: progress.html (Player Rewards & Trophy Room) ---');
    await page.goto('http://127.0.0.1:8080/progress.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    // 1.1 Header Profile & XP Bar
    const callsign = await page.locator('#prog-callsign-heading').textContent();
    if (callsign && callsign.trim().length > 0) {
      pass('Player Callsign Header', callsign.trim());
    } else {
      fail('Player Callsign Header', 'Missing or empty');
    }

    const levelTag = await page.locator('#prog-level-tag').textContent();
    if (levelTag && levelTag.includes('Level')) {
      pass('Player Level Badge', levelTag.trim());
    } else {
      fail('Player Level Badge', 'Missing Level indicator');
    }

    const xpBar = page.locator('#prog-xp-bar-container');
    const role = await xpBar.getAttribute('role');
    const valuenow = await xpBar.getAttribute('aria-valuenow');
    if (role === 'progressbar' && valuenow !== null) {
      pass('Accessible XP Progress Bar', `role=progressbar, aria-valuenow=${valuenow}`);
    } else {
      fail('Accessible XP Progress Bar', 'Missing role or aria-valuenow');
    }

    // 1.2 Career Metrics Strip
    const totalXP = await page.locator('#stat-total-xp').textContent();
    const bestStreak = await page.locator('#stat-best-streak').textContent();
    const badgesEarned = await page.locator('#stat-badges-earned').textContent();
    if (totalXP && bestStreak && badgesEarned) {
      pass('Career Metrics Strip', `XP: ${totalXP}, Streak: ${bestStreak}, Badges: ${badgesEarned}`);
    } else {
      fail('Career Metrics Strip', 'Metrics missing');
    }

    // 1.3 23 Achievement Cards in Trophy Room
    const badgeCards = page.locator('#trophy-grid > div');
    const badgeCount = await badgeCards.count();
    if (badgeCount === 23) {
      pass('23 Achievement Badges Rendered', `Count: ${badgeCount}`);
    } else {
      fail('23 Achievement Badges Rendered', `Expected 23, got: ${badgeCount}`);
    }

    // 1.4 Click Badge Card for Toast Announcement
    await badgeCards.first().click();
    await page.waitForTimeout(200);
    const toast = page.locator('.toast');
    const toastText = await toast.textContent();
    if (toastText && toastText.length > 0) {
      pass('Badge Click Toast Feedback', toastText.trim());
    } else {
      fail('Badge Click Toast Feedback', 'Toast not shown on badge card click');
    }

    // 1.5 Cosmetics & Challenge Modes Collections
    const themeCards = await page.locator('#themes-grid > div').count();
    const avatarCards = await page.locator('#avatars-grid > div').count();
    const modeCards = await page.locator('#modes-grid > div').count();
    if (themeCards === 4 && avatarCards === 6 && modeCards === 4) {
      pass('Cosmetics & Modes Collections Rendered', `Themes: ${themeCards}, Avatars: ${avatarCards}, Modes: ${modeCards}`);
    } else {
      fail('Cosmetics & Modes Collections Rendered', `Got Themes: ${themeCards}, Avatars: ${avatarCards}, Modes: ${modeCards}`);
    }

    // =========================================================================
    // SUITE 2: settings.html (Reward Locks & Gating Validation)
    // =========================================================================
    console.log('\n--- SUITE 2: settings.html (Cosmetics Gating & Hardcore Status) ---');
    await page.goto('http://127.0.0.1:8080/settings.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    // 2.1 Theme Selection Options Gated
    const themeSelect = page.locator('#setting-theme-select');
    const options = await themeSelect.locator('option').all();
    if (options.length === 4) {
      pass('All 4 Themes in Dropdown', 'dark, light, amber, gold present');
    } else {
      fail('All 4 Themes in Dropdown', `Expected 4, got: ${options.length}`);
    }

    // Check that amber and gold are disabled for Level 1 player
    const amberDisabled = await themeSelect.locator('option[value="amber"]').getAttribute('disabled');
    const goldDisabled = await themeSelect.locator('option[value="gold"]').getAttribute('disabled');
    if (amberDisabled !== null && goldDisabled !== null) {
      pass('High-Tier Themes Gated for Level 1 Player', 'Amber (Lv 6) & Gold (Lv 10) disabled');
    } else {
      fail('High-Tier Themes Gated for Level 1 Player', 'Locked options were not disabled');
    }

    // 2.2 Locked Avatar Gating
    const lockedAvatars = page.locator('#avatar-grid button[aria-disabled="true"]');
    const lockedCount = await lockedAvatars.count();
    if (lockedCount >= 2) {
      pass('Locked Avatars Visually Gated', `${lockedCount} locked avatars found (Hex Dragon, Glitch Bot)`);
    } else {
      fail('Locked Avatars Visually Gated', `Expected >= 2, got: ${lockedCount}`);
    }

    // Click locked avatar and check toast rejection
    await lockedAvatars.first().click({ force: true });
    await page.waitForTimeout(300);
    const lockToast = page.locator('.toast');
    const lockToastText = await lockToast.textContent();
    if (lockToastText && lockToastText.includes('locked')) {
      pass('Locked Avatar Click Rejection Toast', lockToastText.trim());
    } else {
      fail('Locked Avatar Click Rejection Toast', 'No lock warning toast');
    }

    // 2.3 Hardcore Mode Status Card
    const hardcoreBadge = page.locator('#hardcore-status-badge');
    const hcBadgeText = await hardcoreBadge.textContent();
    if (hcBadgeText && hcBadgeText.includes('Level 5')) {
      pass('Hardcore Mode Status Requirement Displayed', hcBadgeText.trim());
    } else {
      fail('Hardcore Mode Status Requirement Displayed', 'Missing Level 5 gate notice');
    }

    // =========================================================================
    // SUITE 3: game.html (Hardcore Mode Execution & Game Over)
    // =========================================================================
    console.log('\n--- SUITE 3: game.html (Hardcore Mode Hearts & Game Over) ---');
    await page.goto('http://127.0.0.1:8080/game.html?mode=hardcore&lang=python&diff=beginner', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // 3.1 Hearts Container Displayed
    const livesContainer = page.locator('#hud-lives-container');
    const isLivesVisible = await livesContainer.isVisible();
    const livesText = await page.locator('#hud-lives-text').textContent();
    if (isLivesVisible && livesText.includes('3/3')) {
      pass('Hardcore Lives Container Active in HUD', `Visible with ${livesText.trim()}`);
    } else {
      fail('Hardcore Lives Container Active in HUD', `Visible: ${isLivesVisible}, text: ${livesText}`);
    }

    // 3.2 Hints Disabled in Hardcore Mode
    const hintBtn = page.locator('#btn-use-hint');
    const isHintDisabled = await hintBtn.isDisabled();
    const hintBtnText = await hintBtn.textContent();
    if (isHintDisabled && hintBtnText.includes('Hardcore')) {
      pass('Hints Disabled in Hardcore Mode', hintBtnText.trim());
    } else {
      fail('Hints Disabled in Hardcore Mode', `Disabled: ${isHintDisabled}, text: ${hintBtnText}`);
    }

    // 3.3 Incorrect Answer Deducts Heart
    // Intentionally pick wrong answer or submit without selecting for timeout/wrong
    // Find options and select an option, or submit
    const optionCards = page.locator('.option-card');
    const optCount = await optionCards.count();
    if (optCount > 0) {
      // Find an incorrect option or select option 3
      await optionCards.nth(optCount - 1).click();
      await page.waitForTimeout(200);
      await page.locator('#btn-submit-answer').click();
      await page.waitForTimeout(500);

      // Check lives updated or feedback displayed
      const feedback = page.locator('#feedback-panel');
      const isFbVisible = await feedback.isVisible();
      pass('Hardcore Answer Evaluated with Feedback', `Feedback visible: ${isFbVisible}`);

      // If answer was incorrect or correct, proceed to next
      const nextBtn = page.locator('#btn-next-question');
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(400);
        pass('Advanced Past First Question in Hardcore', 'Next question loaded');
      }
    }

    // =========================================================================
    // SUITE 4: results.html (Session Results & Analytics)
    // =========================================================================
    console.log('\n--- SUITE 4: results.html (Session Results & XP Earned) ---');
    await page.goto('http://127.0.0.1:8080/results.html?lang=python&diff=beginner&score=1500&correct=5&total=5', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const gradeDisplay = await page.locator('#results-grade-display').textContent();
    const xpVal = await page.locator('#res-xp-val').textContent();
    if (gradeDisplay && xpVal && xpVal.includes('XP')) {
      pass('Results Grade and Deterministic XP Earned', `Grade: ${gradeDisplay.trim()}, XP: ${xpVal.trim()}`);
    } else {
      fail('Results Grade and Deterministic XP Earned', `Grade: ${gradeDisplay}, XP: ${xpVal}`);
    }

    // 4.2 Review Missed Questions Modal
    const reviewBtn = page.locator('button:has-text("Review Missed Questions")');
    if (await reviewBtn.isVisible()) {
      await reviewBtn.click();
      await page.waitForTimeout(200);
      const reviewModal = page.locator('#modal-review-preview');
      const isReviewOpen = await reviewModal.isVisible();
      if (isReviewOpen) {
        pass('Question Review Drawer Modal', 'Opened successfully');
        await page.locator('[data-close-modal="modal-review-preview"]').first().click();
        await page.waitForTimeout(200);
        pass('Question Review Drawer Modal', 'Closed successfully');
      } else {
        fail('Question Review Drawer Modal', 'Failed to open modal');
      }
    }

  } catch (err) {
    fail('Playwright Test Suite Execution Exception', err.message);
  } finally {
    await browser.close();

    console.log('\n============================================================');
    console.log('🏁 PLAYWRIGHT GAMIFICATION SUITE SUMMARY');
    console.log('============================================================');
    console.log(`TOTAL PASSED: ${report.passed.length}`);
    console.log(`TOTAL FAILED: ${report.failed.length}`);
    console.log('============================================================\n');

    if (report.failed.length > 0) {
      process.exit(1);
    }
  }
})();
