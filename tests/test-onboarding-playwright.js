import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`[BROWSER ${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.error(`[PAGE ERROR]`, err.message));

  await page.goto('http://127.0.0.1:8080/index.html');
  await page.waitForTimeout(400);

  // Click Hero Start button
  await page.locator('#btn-hero-start').click();
  await page.waitForTimeout(400);

  console.log('Pane 1 is-active:', await page.locator('#wizard-pane-1').evaluate(el => el.classList.contains('is-active')));

  // Fill username
  await page.locator('#onboarding-username').fill('NeonCoder');
  await page.waitForTimeout(200);

  // Click Next: Language
  await page.locator('#btn-wizard-to-step2').click();
  await page.waitForTimeout(400);

  console.log('Pane 1 is-active after click:', await page.locator('#wizard-pane-1').evaluate(el => el.classList.contains('is-active')));
  console.log('Pane 2 is-active after click:', await page.locator('#wizard-pane-2').evaluate(el => el.classList.contains('is-active')));
  console.log('Pane 2 isVisible:', await page.locator('#wizard-pane-2').isVisible());

  // Click C++ in Step 2
  await page.locator('#wizard-lang-grid [data-lang="cpp"]').click();
  console.log('Selected C++ in Step 2');

  // Click Next: Difficulty
  await page.locator('#btn-wizard-to-step3').click();
  await page.waitForTimeout(300);
  console.log('Pane 3 is-active:', await page.locator('#wizard-pane-3').evaluate(el => el.classList.contains('is-active')));
  console.log('Pane 3 isVisible:', await page.locator('#wizard-pane-3').isVisible());

  // Click Expert in Step 3
  await page.locator('#wizard-diff-grid [data-diff="expert"]').click();
  console.log('Selected Expert in Step 3');

  // Click Review Summary
  await page.locator('#btn-wizard-to-step4').click();
  await page.waitForTimeout(300);
  console.log('Pane 4 is-active:', await page.locator('#wizard-pane-4').evaluate(el => el.classList.contains('is-active')));
  console.log('Pane 4 isVisible:', await page.locator('#wizard-pane-4').isVisible());

  // Check summary contents
  const summaryUser = await page.locator('#summary-username').textContent();
  const summaryLang = await page.locator('#summary-language').textContent();
  const summaryDiff = await page.locator('#summary-difficulty').textContent();
  console.log(`Summary: User=${summaryUser}, Lang=${summaryLang}, Diff=${summaryDiff}`);

  // Click Confirm & Play Now
  await page.locator('#btn-wizard-confirm-play').click();
  await page.waitForTimeout(1000);

  console.log('Navigated to URL:', page.url());

  await browser.close();
})();
