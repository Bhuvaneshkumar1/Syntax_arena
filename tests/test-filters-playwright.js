import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function run() {
  console.log('🚀 Running Playwright test for Item 3: Filter dropdowns on progress.html and settings.html');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  // Test 1: progress.html filters
  const progressPath = 'file:///' + path.join(projectRoot, 'progress.html').replace(/\\/g, '/');
  await page.goto(progressPath);
  await page.waitForTimeout(600);

  // Check badges filter elements
  const filterBadgesSub = await page.$('#filter-badges-subject');
  const filterBadgesStat = await page.$('#filter-badges-status');
  if (!filterBadgesSub || !filterBadgesStat) {
    throw new Error('Badge filter dropdowns not found on progress.html');
  }

  // Filter badges by milestones
  await page.selectOption('#filter-badges-subject', 'milestones');
  await page.waitForTimeout(200);
  let badgeCards = await page.$$('#trophy-grid > .card');
  console.log(`✓ Filtered badges by "milestones": found ${badgeCards.length} cards`);
  if (badgeCards.length === 0) throw new Error('Expected milestone badges');

  // Filter themes by status
  await page.selectOption('#filter-themes-status', 'gained');
  await page.waitForTimeout(200);
  let themeCards = await page.$$('#themes-grid > .card');
  console.log(`✓ Filtered themes by "gained": found ${themeCards.length} cards`);

  // Filter avatars by class
  await page.selectOption('#filter-avatars-subject', 'beasts');
  await page.waitForTimeout(200);
  let avatarCards = await page.$$('#avatars-grid > .card');
  console.log(`✓ Filtered avatars by "beasts": found ${avatarCards.length} cards`);
  if (avatarCards.length !== 3) throw new Error(`Expected 3 beast avatars, found ${avatarCards.length}`);

  // Filter challenge modes
  await page.selectOption('#filter-modes-subject', 'campaign');
  await page.waitForTimeout(200);
  let modeCards = await page.$$('#modes-grid > .card');
  console.log(`✓ Filtered modes by "campaign": found ${modeCards.length} cards`);
  if (modeCards.length !== 1) throw new Error(`Expected 1 campaign mode card, found ${modeCards.length}`);

  // Test 2: settings.html filters
  const settingsPath = 'file:///' + path.join(projectRoot, 'settings.html').replace(/\\/g, '/');
  await page.goto(settingsPath);
  await page.waitForTimeout(600);

  const filterSettingsAvatarSub = await page.$('#filter-settings-avatar-subject');
  const filterSettingsAvatarStat = await page.$('#filter-settings-avatar-status');
  const filterSettingsThemeStat = await page.$('#filter-settings-theme-status');

  if (!filterSettingsAvatarSub || !filterSettingsAvatarStat || !filterSettingsThemeStat) {
    throw new Error('Filter dropdowns not found on settings.html');
  }

  // Filter avatar grid on settings
  await page.selectOption('#filter-settings-avatar-subject', 'mechs');
  await page.waitForTimeout(200);
  let settingsAvatarBtns = await page.$$('#avatar-grid > button');
  console.log(`✓ Filtered settings avatars by "mechs": found ${settingsAvatarBtns.length} buttons`);
  if (settingsAvatarBtns.length !== 3) throw new Error(`Expected 3 mech avatars, found ${settingsAvatarBtns.length}`);

  // Filter themes on settings
  await page.selectOption('#filter-settings-theme-status', 'gained');
  await page.waitForTimeout(200);
  let themeOptions = await page.$$('#setting-theme-select > option');
  console.log(`✓ Filtered settings themes by "gained": found ${themeOptions.length} option(s)`);

  await browser.close();
  console.log('🎉 ALL PLAYWRIGHT TESTS FOR ITEM 3 PASSED PERFECTLY!');
}

run().catch(err => {
  console.error('❌ Playwright test failed:', err);
  process.exit(1);
});
