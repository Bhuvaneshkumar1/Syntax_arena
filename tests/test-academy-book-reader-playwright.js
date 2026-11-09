import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const PORT = 8114;
const BASE_URL = `http://localhost:${PORT}`;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
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
      } else {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      }
    });
  });
}

async function runBookReaderTest() {
  console.log('============================================================');
  console.log('🧪 PLAYWRIGHT E2E: CYBER ACADEMY TEXTBOOK HANDBOOK READER');
  console.log('============================================================\n');

  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test server running on ${BASE_URL}`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  let passed = 0;
  let total = 0;

  function check(desc, cond) {
    total++;
    if (cond) {
      console.log(`  ✓ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
      throw new Error(`Assertion failed: ${desc}`);
    }
  }

  try {
    console.log('--- 1. Testing Book Mode Initialization ---');
    await page.goto(`${BASE_URL}/learn.html?lang=python&mode=book`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(600);

    const btnBook = await page.$('#btn-view-book');
    check('View switcher contains #btn-view-book', Boolean(btnBook));
    const isBookActive = await btnBook.evaluate(el => el.classList.contains('is-active'));
    check('Handbook mode pill is active', isBookActive);

    const bookReader = await page.$('.academy-book-reader');
    check('Comprehensive Handbook Reader container is rendered', Boolean(bookReader));

    const chapterTitle = await page.$('.book-chapter-title');
    const titleText = await chapterTitle.innerText();
    check('Chapter title rendered', titleText.length > 5);

    const objectives = await page.$$('.book-objectives-list li');
    check('Learning objectives checklist rendered (>= 3 items)', objectives.length >= 3);

    const summaryCard = await page.$('.book-summary-card');
    check('Chapter executive summary card rendered', Boolean(summaryCard));

    const tocNav = await page.$('.book-toc-pill-nav');
    check('Sticky Table of Contents pill navigation rendered', Boolean(tocNav));

    console.log('\n--- 2. Testing 7 Book Sections ---');
    const secModel = await page.$('#book-sec-model');
    check('Section 1: Conceptual Mental Model rendered', Boolean(secModel));

    const secSyntax = await page.$('#book-sec-syntax');
    check('Section 2: Syntax Anatomy & Reference Code rendered', Boolean(secSyntax));

    const secSandbox = await page.$('#book-sec-sandbox');
    check('Section 3: Interactive Live Runner & Memory Tracer rendered', Boolean(secSandbox));

    const secCheckpoint = await page.$('#book-sec-checkpoint');
    check('Section 4: Diagnostic Checkpoint Drill rendered', Boolean(secCheckpoint));

    const secDeepDive = await page.$('#book-sec-deepdive');
    check('Section 5: Deep-Dive Analysis Accordion rendered', Boolean(secDeepDive));

    const secPitfalls = await page.$('#book-sec-pitfalls');
    check('Section 6: Production Danger Zone & Security Traps rendered', Boolean(secPitfalls));

    const secTakeaways = await page.$('#book-sec-takeaways');
    check('Section 7: Core Engineering Takeaways rendered', Boolean(secTakeaways));

    console.log('\n--- 3. Testing Interactive Controls in Book Mode ---');
    const runBtn = await page.$('#btn-slide-run-code');
    check('Live Run Code button exists in book sandbox section', Boolean(runBtn));
    await runBtn.click();
    await page.waitForTimeout(600);

    const outputTray = await page.$('#slide-terminal-output');
    check('Terminal output tray displayed after code run', Boolean(outputTray));
    const outputBody = await page.$('#slide-output-body');
    const outputText = await outputBody.innerText();
    check('Terminal output contains executed result', outputText.length > 0);

    const memInspector = await page.$('#lesson-memory-inspector');
    check('Visual Memory Inspector is embedded in Section 3', Boolean(memInspector));
    const memRows = await page.$$('#lesson-memory-container .mem-var-row');
    check('Visual memory inspector displays stack variables in book mode', memRows.length > 0);

    // Test drill answer
    const drillOptions = await page.$$('.drill-option-card');
    check('Diagnostic checkpoint provides drill option cards', drillOptions.length >= 2);
    await drillOptions[1].click(); // Option B
    await page.waitForTimeout(300);

    const feedbackBox = await page.$('#drill-feedback-box');
    check('Instant feedback box displayed on answering drill', Boolean(feedbackBox));

    console.log('\n--- 4. Testing View Mode Switcher ---');
    const btnSlides = await page.$('#btn-view-slides');
    check('Slide mode pill exists', Boolean(btnSlides));
    await btnSlides.click();
    await page.waitForTimeout(400);

    const isSlidesActive = await btnSlides.evaluate(el => el.classList.contains('is-active'));
    check('Slide mode pill becomes active on click', isSlidesActive);

    const slideCounter = await page.$('#slide-step-counter');
    const counterText = await slideCounter.innerText();
    check('Step counter updates to slide deck view (Slide 1 of 3)', counterText.includes('Slide 1 of 3'));

    // Switch back to Book mode
    await btnBook.click();
    await page.waitForTimeout(400);
    const isBookActiveAgain = await btnBook.evaluate(el => el.classList.contains('is-active'));
    check('Switches cleanly back to Handbook mode', isBookActiveAgain);

    console.log(`\n============================================================`);
    console.log(`🎉 ALL ACADEMY BOOK READER TESTS PASSED (${passed}/${total})`);
    console.log(`============================================================\n`);
  } finally {
    await browser.close();
    server.close();
  }
}

runBookReaderTest().catch(err => {
  console.error('Playwright Test Failed:', err);
  process.exit(1);
});
