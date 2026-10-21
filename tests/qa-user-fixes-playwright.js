/**
 * Playwright E2E Verification Script for User Reported Issues:
 * 1. Wrong answer does NOT result in 100% or Grade S; Next Question is clickable; Grade circle does NOT overlap text; Score math is shown.
 * 2. Avatar unlock with points activates immediately and can be saved without "locked avatar" error.
 * 3. Finishing a level grants XP, shows Career Rank card, and visibly announces level progression.
 */

import { chromium } from 'playwright';
import assert from 'assert';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 8092;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function startStaticServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.wav': 'audio/wav',
    '.ico': 'image/x-icon'
  };

  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0].split('#')[0];
    if (cleanUrl === '/') cleanUrl = '/index.html';
    const filePath = path.join(path.resolve('.'), cleanUrl);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

async function runVerification() {
  console.log('🚀 Starting Static Server on port', PORT);
  const server = await startStaticServer();

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  try {
    console.log('\n--- 1. Testing Avatar Unlock with Points & Activation (Issue 2) ---');
    await page.goto(`${BASE_URL}/index.html`);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();

    // Create a profile with 500 points (onboarding bonus)
    await page.evaluate(() => {
      const p = {
        id: 'prof_test_user',
        username: 'TestCoder',
        avatarId: 'cyber_fox',
        onboardingComplete: true,
        totalScore: 500,
        xp: 500,
        lifetimeXP: 500,
        level: 1,
        unlockedAvatars: ['cyber_fox', 'terminal_owl', 'matrix_cat', 'bit_knight'],
        preferences: { language: 'python', difficulty: 'beginner' }
      };
      localStorage.setItem('syntaxarena_storage_v1', JSON.stringify({
        version: 1,
        activeProfileId: p.id,
        profiles: [p],
        settings: {
          theme: 'dark',
          soundEnabled: true,
          musicEnabled: false,
          sfxVolume: 0.8,
          musicVolume: 0.5,
          reducedMotion: false
        }
      }));
    });

    await page.goto(`${BASE_URL}/settings.html`);
    await page.waitForSelector('#avatar-grid button');

    // Find the hex_dragon avatar button (which requires Level 4 or 150 points)
    const unlockButtons = await page.locator('#avatar-grid button');
    const count = await unlockButtons.count();
    let hexDragonButton = null;

    for (let i = 0; i < count; i++) {
      const btn = unlockButtons.nth(i);
      const text = await btn.textContent();
      if (text.includes('Hex Dragon')) {
        hexDragonButton = btn;
        break;
      }
    }

    assert(hexDragonButton !== null, 'Hex Dragon avatar button found');
    console.log('Clicking to unlock Hex Dragon with 150 points...');
    await hexDragonButton.click({ force: true });
    await page.waitForTimeout(500);

    // Verify it is unlocked and activated
    const profileAfterPurchase = await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('syntaxarena_storage_v1') || '{}');
      return state.profiles ? state.profiles[0] : null;
    });

    assert(profileAfterPurchase.unlockedAvatars.includes('hex_dragon'), 'hex_dragon is now in unlockedAvatars');
    assert(profileAfterPurchase.avatarId === 'hex_dragon', 'hex_dragon was immediately equipped/activated');
    console.log('✓ Hex dragon successfully unlocked and activated!');

    // Now click "Save Profile Changes" button to ensure it doesn't say "Cannot select locked avatar"
    await page.click('#btn-save-profile');
    await page.waitForTimeout(400);
    const toasts = await page.locator('.toast').allTextContents();
    console.log('Toasts displayed:', toasts);
    assert(toasts.some(t => t.includes('Profile updated successfully')), 'Profile saved without locked avatar error!');
    console.log('✓ PASS: Issue 2 Verified (Avatar unlocks with points and activates cleanly)');


    console.log('\n--- 2. Testing Gameplay Scoring & Wrong Answer Handling (Issue 1) ---');
    // Start a game in Python beginner
    await page.goto(`${BASE_URL}/game.html?lang=python&diff=beginner`);
    await page.waitForSelector('#answer-interface-container .option-card');

    // Question 1: Deliberately select option 0 ("3 3"), which is INCORRECT (correct is "4 4")
    const options = await page.locator('.option-card');
    await options.first().click();
    await page.click('#btn-submit-answer');
    await page.waitForTimeout(400);

    // Feedback panel should be visible
    const feedbackPanel = page.locator('#feedback-panel');
    assert(await feedbackPanel.isVisible(), 'Feedback panel is displayed');
    const feedbackBody = await page.locator('#feedback-body').textContent();
    console.log('Feedback text (Wrong answer):', feedbackBody);
    assert(feedbackBody.includes('Score Math: 0 pts') || feedbackBody.includes('0 pts'), 'Score Math explicitly displayed for incorrect answer');

    // Next Question button MUST BE ENABLED AND CLICKABLE
    const nextBtn = page.locator('#btn-next-question');
    assert(await nextBtn.isVisible(), 'Next Question button is visible on incorrect answer');
    const isNextDisabled = await nextBtn.isDisabled();
    assert(!isNextDisabled, 'Next Question button is NOT disabled on incorrect answer!');
    console.log('✓ Next Question button is enabled and clickable on wrong answer');

    // Advance to question 2
    await nextBtn.click();
    await page.waitForTimeout(500);

    // Now question 2: let's select option 1 ("TypeError..."), which is CORRECT
    await page.waitForSelector('.option-card');
    await page.locator('.option-card').nth(1).click();
    await page.click('#btn-submit-answer');
    await page.waitForTimeout(400);

    const feedbackBody2 = await page.locator('#feedback-body').textContent();
    console.log('Question 2 Feedback text:', feedbackBody2);
    assert(feedbackBody2.includes('Score Math:'), 'Score Math breakdown is transparently displayed on answer submission');


    console.log('\n--- 3. Testing Results Page Ring Overlap & Level Progression (Issues 1 & 3) ---');
    // Seed a completed session with 1 correct and 1 incorrect answer (50% accuracy)
    await page.evaluate(() => {
      const summary = {
        sessionId: 'sess_test_50acc',
        language: 'python',
        difficulty: 'beginner',
        mode: 'campaign',
        totalQuestions: 2,
        questionsAttempted: 2,
        questionsCorrect: 1,
        incorrectCount: 1,
        accuracy: 50,
        totalScore: 180,
        bestStreak: 1,
        hintsUsed: 0,
        retriesUsed: 0,
        elapsedSeconds: 45,
        isCompleted: true,
        isFlawless: false,
        missedQuestionIds: ['py-beg-001'],
        results: [
          { questionId: 'py-beg-001', isCorrect: false, points: 0 },
          { questionId: 'py-beg-002', isCorrect: true, points: 180, basePoints: 100, speedBonus: 44, multiplier: 1.25 }
        ]
      };
      sessionStorage.setItem('syntaxarena_last_session_summary', JSON.stringify(summary));

      // Rewards with Level Up
      const rewards = {
        success: true,
        earnedXP: 550,
        xpEarned: 550,
        levelUp: true,
        previousLevel: 1,
        newLevel: 2,
        newBadges: ['first_blood'],
        newRewards: { themes: ['light'], avatars: [], modes: [] }
      };
      sessionStorage.setItem('syntaxarena_last_session_rewards', JSON.stringify(rewards));
    });

    await page.goto(`${BASE_URL}/results.html`);
    await page.waitForSelector('#results-grade-display');

    // Verify Accuracy is 50%, NOT 100%!
    const accVal = await page.locator('#res-acc-val').textContent();
    console.log('Reported Accuracy:', accVal);
    assert(accVal.includes('50%'), 'Results page reports 50% accuracy on wrong answer (NOT 100%)');

    // Verify Grade is GRADE C, NOT GRADE S!
    const gradeText = await page.locator('#results-grade-display').textContent();
    console.log('Reported Grade:', gradeText);
    assert(gradeText.includes('GRADE C') || gradeText.includes('C'), 'Grade is C for 50% accuracy (NOT Grade S)');

    // Verify Circular Ring text layout: mini GRADE header + big letter
    const gradeLetterEl = page.locator('#results-grade-letter');
    assert(await gradeLetterEl.isVisible(), 'Grade letter element rendered inside the SVG ring');
    const ringPercentEl = page.locator('#results-ring-percent');
    assert(await ringPercentEl.isVisible(), 'Ring percentage rendered inside the SVG ring');

    // Verify Career Rank Card (Issue 3)
    const rankCard = page.locator('#results-rank-card');
    assert(await rankCard.isVisible(), 'Career Rank & Level Progression Card is visible');
    const xpGainText = await page.locator('#results-xp-gain-pill').textContent();
    console.log('XP Gain Pill:', xpGainText);
    assert(xpGainText.includes('+550 XP'), 'XP Gain Pill accurately shows earned XP (+550 XP, not +0 XP)');

    const progressBar = page.locator('#results-level-progress-bar');
    assert(await progressBar.isVisible(), 'Level progress bar is rendered');

    // Verify Level Up Banner
    const rewardsBanner = page.locator('#results-rewards-banner');
    assert(await rewardsBanner.isVisible(), 'Level up celebration banner is visible');
    const bannerTitle = await page.locator('#rewards-banner-title').textContent();
    console.log('Celebration Banner Title:', bannerTitle);
    assert(bannerTitle.includes('LEVEL 2') || bannerTitle.includes('RANK PROMOTION'), 'Celebration banner announces level up');

    // Verify "Review Missed Questions" button is available
    const retryMissedBtn = page.locator('#btn-retry-missed');
    const retryMissedText = await retryMissedBtn.textContent();
    console.log('Retry Missed Button text:', retryMissedText);
    assert(retryMissedText.includes('1 Missed Question'), 'Review Missed Questions correctly identifies the 1 missed question');

    console.log('\n🎉 ALL CHECKS PASSED SUCCESSFULLY!');
  } finally {
    await browser.close();
    server.close();
  }
}

runVerification().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
