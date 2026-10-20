import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[Console Error] ${msg.text()}`);
      console.error(`[Browser Error] ${msg.text()}`);
    } else {
      console.log(`[Browser ${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    errors.push(`[Page Exception] ${err.toString()}`);
    console.error(`[Page Exception]`, err);
  });

  console.log('\n--- 1. Testing game.html Loading ---');
  await page.goto('http://127.0.0.1:8080/game.html?lang=python&diff=beginner');
  await page.waitForTimeout(500);

  const initialPrompt = await page.locator('#q-prompt-text').textContent();
  console.log('Initial Question Prompt:', initialPrompt.trim());

  // Verify HUD items
  console.log('Language tag text:', await page.locator('#hud-lang-tag').textContent());
  console.log('Step counter text:', await page.locator('#hud-step-counter').textContent());
  console.log('Timer display text:', await page.locator('#hud-timer-display').textContent());

  // Test 1: Option Selection
  console.log('\n--- 2. Testing Option Selection & Submit Button Activation ---');
  const optionCards = page.locator('.option-card');
  const count = await optionCards.count();
  console.log(`Rendered ${count} option cards.`);

  const submitBtn = page.locator('#btn-submit-answer');
  console.log('Submit button initially disabled:', await submitBtn.isDisabled());

  // Click Option 1
  await optionCards.nth(0).click();
  console.log('Option 0 clicked. Submit button disabled:', await submitBtn.isDisabled());

  // Test 2: Hint Drawer
  console.log('\n--- 3. Testing Hint Activation ---');
  const hintBtn = page.locator('#btn-use-hint');
  await hintBtn.click();
  await page.waitForTimeout(300);
  console.log('Hint drawer visible:', await page.locator('#hint-drawer').isVisible());
  console.log('Hint text:', (await page.locator('#hint-drawer-text').textContent()).trim());

  // Test 3: Submitting Answer
  console.log('\n--- 4. Testing Answer Submission ---');
  await submitBtn.click();
  await page.waitForTimeout(500);
  console.log('Feedback panel visible:', await page.locator('#feedback-panel').isVisible());
  console.log('Feedback title:', (await page.locator('#feedback-title').textContent()).trim());
  console.log('Explanation visible:', await page.locator('#feedback-explanation-text').isVisible());

  // Test 4: Next Question
  console.log('\n--- 5. Testing Next Question Progression ---');
  const nextBtn = page.locator('#btn-next-question');
  console.log('Next Question button visible:', await nextBtn.isVisible());
  await nextBtn.click();
  await page.waitForTimeout(500);

  const q2Prompt = await page.locator('#q-prompt-text').textContent();
  console.log('Question 2 Prompt:', q2Prompt.trim());
  console.log('Step counter text:', await page.locator('#hud-step-counter').textContent());

  // Test 5: Keyboard Shortcuts (Press '2' then 'Enter')
  console.log('\n--- 6. Testing Keyboard Controls ---');
  await page.keyboard.press('2');
  await page.waitForTimeout(200);
  console.log('Submit button disabled after pressing key 2:', await submitBtn.isDisabled());

  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  console.log('Feedback panel visible after pressing Enter:', await page.locator('#feedback-panel').isVisible());

  // Test 6: Abandon Run Modal
  console.log('\n--- 7. Testing Abandon Run Modal & Dialog Buttons ---');
  const exitBtn = page.locator('#btn-exit-game');
  await exitBtn.click();
  await page.waitForTimeout(300);
  console.log('Exit modal visible:', await page.locator('#modal-confirm-exit').isVisible());

  // Test Cancel Exit via Resume button
  const cancelExitBtn = page.locator('#btn-cancel-exit');
  await cancelExitBtn.click();
  await page.waitForTimeout(300);
  console.log('Exit modal visible after Resume Challenge click:', await page.locator('#modal-confirm-exit').isVisible());

  // Re-open and test 'x' button
  await exitBtn.click();
  await page.waitForTimeout(300);
  const cancelXBtn = page.locator('#btn-cancel-exit-x');
  await cancelXBtn.click();
  await page.waitForTimeout(300);
  console.log('Exit modal visible after "x" click:', await page.locator('#modal-confirm-exit').isVisible());

  // Test 7: Testing Other Language Tracks (C, C++, Java)
  console.log('\n--- 8. Testing Other Language Tracks ---');
  for (const lang of ['c', 'cpp', 'java']) {
    await page.goto(`http://127.0.0.1:8080/game.html?lang=${lang}&diff=beginner`);
    await page.waitForTimeout(400);
    const prompt = await page.locator('#q-prompt-text').textContent();
    const langTag = await page.locator('#hud-lang-tag').textContent();
    console.log(`Track ${lang.toUpperCase()}: Tag="${langTag}", Prompt="${prompt.trim().substring(0, 50)}..."`);
  }

  console.log('\n--- Summary of Errors ---');
  console.log('Total Errors:', errors.length);
  errors.forEach((err, i) => console.log(`  ${i + 1}: ${err}`));

  await browser.close();
})();
