import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  // Fresh context with clear localStorage
  await page.goto('http://127.0.0.1:8080/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(400);

  // Click Play Now in navigation header
  console.log('Clicking #btn-nav-play...');
  await page.locator('#btn-nav-play').click();
  await page.waitForTimeout(300);

  const modal = page.locator('#modal-onboarding');
  console.log('Modal visible:', await modal.isVisible());

  // Click Skip Setup & Play
  const skipBtn = page.locator('#btn-skip-to-game');
  console.log('Skip button visible:', await skipBtn.isVisible());
  await skipBtn.click();
  await page.waitForTimeout(1000);

  console.log('Target URL after Skip Setup & Play:', page.url());
  const reachedGame = page.url().includes('game.html');
  console.log('Successfully reached game.html:', reachedGame);

  // Verify questions loaded on game.html
  const qPrompt = await page.locator('#q-prompt-text').textContent();
  console.log('Prompt on arena:', qPrompt.trim());

  await browser.close();
  process.exit(reachedGame ? 0 : 1);
})();
