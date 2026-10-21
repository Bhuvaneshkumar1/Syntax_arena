/**
 * Playwright E2E verification test for Item 15:
 * Ensure "Save & Continue" button in welcome/onboarding modal is perfectly visible,
 * not clipped, properly sized and realigned on both desktop and mobile viewports.
 */

import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

const PORT = 8099;
const BASE_URL = `http://localhost:${PORT}`;

function createStaticServer() {
  const rootDir = process.cwd();
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(rootDir, reqPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(data);
    });
  });
}

async function runTest() {
  const server = createStaticServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test Server running on ${BASE_URL}`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  
  try {
    console.log('\n--- 1. Desktop Viewport (1280x800): Step 1 to Step 4 ---');
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    await page.goto(`${BASE_URL}/index.html?onboarding=1&reset=1`);
    await page.waitForSelector('#modal-onboarding.is-open');

    // Fill Call-sign
    await page.fill('#onboarding-username', 'ApexCoder');
    await page.click('#btn-wizard-to-step2');
    await page.waitForTimeout(250);

    // Step 2: Language
    await page.click('#wizard-lang-grid [data-lang="python"]');
    await page.click('#btn-wizard-to-step3');
    await page.waitForTimeout(250);

    // Step 3: Difficulty
    await page.click('#wizard-diff-grid [data-diff="beginner"]');
    await page.click('#btn-wizard-to-step4');
    await page.waitForTimeout(250);

    // Step 4: Verify Save & Continue Button
    const saveBtn = page.locator('#btn-wizard-confirm-save');
    assert(await saveBtn.isVisible(), 'Save & Continue button is visible on Step 4');

    const saveText = await saveBtn.textContent();
    console.log('Save button text:', saveText.trim());
    assert(saveText.includes('Save & Continue'), 'Button text includes Save & Continue');

    const dialogBox = await page.locator('.onboarding-dialog').boundingBox();
    const btnBox = await saveBtn.boundingBox();
    console.log('Dialog Bounding Box:', dialogBox);
    console.log('Save Button Bounding Box:', btnBox);

    assert(btnBox.x >= dialogBox.x, 'Button is within dialog left boundary');
    assert(btnBox.x + btnBox.width <= dialogBox.x + dialogBox.width + 5, 'Button does not overflow dialog right boundary');
    assert(btnBox.y + btnBox.height <= 800, 'Button does not overflow viewport bottom');
    console.log('✓ PASS: Desktop layout aligns Save & Continue without clipping!');

    // Test clicking Save & Continue
    await saveBtn.click();
    await page.waitForTimeout(600);

    const toast = await page.locator('.toast').last().textContent();
    console.log('Onboarding Toast after Save & Continue:', toast);
    assert(toast.includes('Welcome to SyntaxArena, ApexCoder'), 'Toast confirms onboarding completion');

    console.log('\n--- 2. Mobile Viewport (375x667): Verify Button Alignment & Visibility ---');
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
    await mobilePage.goto(`${BASE_URL}/index.html?onboarding=1&reset=1`);
    await mobilePage.waitForSelector('#modal-onboarding.is-open');

    await mobilePage.fill('#onboarding-username', 'PocketByte');
    await mobilePage.click('#btn-wizard-to-step2');
    await mobilePage.waitForTimeout(250);

    await mobilePage.click('#wizard-lang-grid [data-lang="python"]');
    await mobilePage.click('#btn-wizard-to-step3');
    await mobilePage.waitForTimeout(250);

    await mobilePage.click('#wizard-diff-grid [data-diff="beginner"]');
    await mobilePage.click('#btn-wizard-to-step4');
    await mobilePage.waitForTimeout(250);

    const mobileSaveBtn = mobilePage.locator('#btn-wizard-confirm-save');
    assert(await mobileSaveBtn.isVisible(), 'Save & Continue button is visible on mobile');

    const mobileBtnBox = await mobileSaveBtn.boundingBox();
    console.log('Mobile Save Button Bounding Box:', mobileBtnBox);
    assert(mobileBtnBox.y + mobileBtnBox.height <= 667, 'Button does not overflow mobile viewport bottom');
    assert(mobileBtnBox.x >= 0, 'Button is on screen horizontally');

    await mobileSaveBtn.click();
    await mobilePage.waitForTimeout(600);
    console.log('✓ PASS: Mobile layout stacks and displays Save & Continue cleanly!');

    console.log('\n🎉 ALL ITEM 15 SAVE & CONTINUE BUTTON CHECKS PASSED!');
  } finally {
    await browser.close();
    server.close();
  }
}

runTest().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
