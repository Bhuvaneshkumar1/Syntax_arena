import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import assert from 'assert';

const PORT = 8096;
const BASE_URL = `http://localhost:${PORT}`;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.wav': 'audio/wav'
};

function createTestServer() {
  const baseDir = path.resolve('.');
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0].split('#')[0];
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(baseDir, reqPath.startsWith('/') ? reqPath.slice(1) : reqPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
}

async function runThemeLockTest() {
  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test Server listening on ${BASE_URL}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const page = await browser.newPage();

  try {
    // 1. Visit index.html with a fresh Level 1 profile without light theme
    await page.goto(`${BASE_URL}/index.html`);
    await page.evaluate(() => {
      const p = {
        id: 'prof_theme_test',
        username: 'DarkKnight',
        avatarId: 'cyber_fox',
        onboardingComplete: true,
        level: 1,
        totalScore: 50,
        xp: 50,
        lifetimeXP: 50,
        unlockedThemes: ['dark']
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
      if (window.State) {
        window.State.set('activeProfile', p, true);
        window.State.set('profiles', [p], true);
        window.State.set('settings', { theme: 'dark' }, true);
      }
    });
    await page.waitForTimeout(300);

    // 2. Click Header Theme Toggle Button
    console.log('\n--- 1. Testing Header Theme Toggle for Locked Light Theme ---');
    const themeBtn = page.locator('#btn-theme-toggle');
    await themeBtn.click();
    await page.waitForTimeout(300);

    // Assert theme DID NOT change to light
    const currentThemeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log('HTML data-theme attribute after click:', currentThemeAttr);
    assert(currentThemeAttr !== 'light', 'Theme did NOT switch to light mode when locked');

    // Assert informative toast displayed
    const toastText = await page.locator('.toast').last().textContent();
    console.log('Theme Toggle Toast:', toastText);
    assert(toastText.includes('locked'), 'Warning toast confirms theme is locked');
    console.log('✓ PASS: Theme toggle prevented unauthorized switch to locked light theme!');

    // 3. Test progress.html Theme Unlock with Points
    console.log('\n--- 2. Testing Progression Page Palette Unlock with Points ---');
    await page.evaluate(() => {
      const p = window.Profile.getActiveProfile() || window.State.get('activeProfile') || {};
      p.totalScore = 500;
      p.xp = 500;
      window.Profile.updateProfile(p.id, { totalScore: 500, xp: 500 });
      const raw = localStorage.getItem('syntaxarena_storage_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.profiles && parsed.profiles[0]) {
          parsed.profiles[0].totalScore = 500;
          parsed.profiles[0].xp = 500;
          localStorage.setItem('syntaxarena_storage_v1', JSON.stringify(parsed));
        }
      }
    });

    await page.goto(`${BASE_URL}/progress.html`);
    await page.waitForSelector('#themes-grid .card');

    // Find the Light Theme (Studio Paper) unlock button
    const unlockBtn = page.locator('#themes-grid .btn-unlock-theme').first();
    assert(await unlockBtn.isVisible(), 'Unlock button is visible for locked theme');
    await unlockBtn.click();
    await page.waitForTimeout(400);

    const unlockToast = await page.locator('.toast').last().textContent();
    console.log('Unlock Toast:', unlockToast);
    assert(unlockToast.includes('unlocked for 100 points'), 'Light theme unlocked successfully with points');

    // 4. Now that light theme is unlocked in profile, header toggle should work!
    console.log('\n--- 3. Testing Theme Toggle After Unlock ---');
    await page.locator('#btn-theme-toggle').click();
    await page.waitForTimeout(400);

    const updatedThemeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log('HTML data-theme attribute after unlock:', updatedThemeAttr);
    assert(updatedThemeAttr === 'light', 'Theme successfully switched to light mode after unlock');
    console.log('✓ PASS: Light theme unlocks cleanly with points and functions perfectly!');

    console.log('\n🎉 ALL ITEM 11 THEME LOCK CHECKS PASSED!');
  } finally {
    await browser.close();
    server.close();
  }
}

runThemeLockTest().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
