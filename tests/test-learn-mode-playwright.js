import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import assert from 'assert';

const PORT = 8110;
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
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
}

async function runLearnModeTest() {
  console.log('============================================================');
  console.log('🧪 PLAYWRIGHT E2E: CYBER ACADEMY (LEARN MODE) INTEGRATION');
  console.log('============================================================\n');

  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test server listening on ${BASE_URL}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  let passed = 0;
  let failed = 0;

  function testAssert(condition, name, details = '') {
    if (condition) {
      passed++;
      console.log(`  ✓ [PASS] ${name}`);
    } else {
      failed++;
      console.error(`  ✗ [FAIL] ${name} ${details}`);
    }
  }

  try {
    // 1. Hub Linkage Check
    console.log('\n--- 1. Testing Hub Navigation to Cyber Academy ---');
    await page.goto(`${BASE_URL}/index.html`);
    await page.waitForTimeout(400);

    const academyNavLink = page.locator('header a[href="learn.html"]');
    testAssert(await academyNavLink.count() >= 1, 'Header navigation includes link to learn.html');

    const academyShowcaseBtn = page.locator('#btn-showcase-academy');
    testAssert(await academyShowcaseBtn.isVisible(), 'Hub Challenge Showcase displays Cyber Academy card with launcher');

    // 2. Direct Navigation to learn.html
    console.log('\n--- 2. Testing Cyber Academy (learn.html) Page Load ---');
    await page.goto(`${BASE_URL}/learn.html?lang=python&diff=beginner`);
    await page.waitForTimeout(500);

    const pageTitle = await page.title();
    testAssert(pageTitle.includes('Cyber Academy'), `Page title contains 'Cyber Academy' (got: "${pageTitle}")`);

    const langSelect = page.locator('#academy-lang-select');
    testAssert(await langSelect.isVisible(), 'Track language selector is visible');
    const selectedLang = await langSelect.inputValue();
    testAssert(selectedLang === 'python', `Active language initialized to python (got: "${selectedLang}")`);

    // 3. Lesson Menu & Slide Deck Layout
    console.log('\n--- 3. Testing Lesson List & Slide Deck Rendering ---');
    const lessonButtons = page.locator('.lesson-nav-btn');
    const lessonCount = await lessonButtons.count();
    testAssert(lessonCount >= 1, `Lesson menu renders available lessons (found ${lessonCount})`);

    const activeLessonBtn = page.locator('.lesson-nav-btn.is-active');
    testAssert(await activeLessonBtn.count() === 1, 'Exactly one lesson is active by default');

    // Slide 1: Concept
    const stepCounter = page.locator('#slide-step-counter');
    testAssert((await stepCounter.textContent()).includes('Slide 1 of 3'), 'Initial slide is Slide 1 of 3');

    const btnPrev = page.locator('#btn-slide-prev');
    const btnNext = page.locator('#btn-slide-next');
    testAssert(await btnPrev.isDisabled(), 'Previous button is disabled on Slide 1');

    const codeTerminal = page.locator('#slide-body-container .code-terminal');
    testAssert(await codeTerminal.isVisible(), 'Slide 1 displays syntax-highlighted code terminal');

    // 4. Slide 2: Interactive Checkpoint Drill
    console.log('\n--- 4. Testing Interactive Checkpoint Drill ---');
    await btnNext.click();
    await page.waitForTimeout(300);

    testAssert((await stepCounter.textContent()).includes('Slide 2 of 3'), 'Advances to Slide 2 of 3');
    testAssert(!await btnPrev.isDisabled(), 'Previous button is enabled on Slide 2');

    const drillOptions = page.locator('.drill-option-card');
    const optionCount = await drillOptions.count();
    testAssert(optionCount >= 2, `Drill presents interactive answer options (count: ${optionCount})`);

    // Click the correct answer (option B in py-les-001)
    const targetOption = drillOptions.nth(1); // 999
    await targetOption.click();
    await page.waitForTimeout(300);

    const feedbackBox = page.locator('#drill-feedback-box');
    testAssert(await feedbackBox.isVisible(), 'Instant positive feedback panel appears after answering drill');
    const isCorrectMarked = await targetOption.evaluate(el => el.classList.contains('is-correct'));
    testAssert(isCorrectMarked, 'Correct option card is highlighted with emerald glow');

    // 5. Slide 3: Danger Zone & Battle Ready CTA
    console.log('\n--- 5. Testing Danger Zone & Battle Test Launcher ---');
    await btnNext.click();
    await page.waitForTimeout(300);

    testAssert((await stepCounter.textContent()).includes('Slide 3 of 3'), 'Advances to Slide 3 of 3 (Danger Zone)');

    const pitfallCard = page.locator('.pitfall-alert-card');
    testAssert(await pitfallCard.isVisible(), 'Danger Zone red-alert card is visible');

    const battleBtn = page.locator('#btn-launch-arena-test');
    testAssert(await battleBtn.isVisible(), 'Battle Test launcher button is displayed');
    const battleHref = await battleBtn.getAttribute('href');
    testAssert(battleHref.includes('game.html') && battleHref.includes('lang=python'), `Battle launcher points to game.html with Python track (got: "${battleHref}")`);

    // 6. Track Switching Test
    console.log('\n--- 6. Testing Track Switching (Assembly & RE) ---');
    await langSelect.selectOption('asm');
    await page.waitForTimeout(400);

    const asmTag = page.locator('#lesson-track-tag');
    testAssert((await asmTag.textContent()).includes('ASM'), `Header tag updates to ASM track (got: "${await asmTag.textContent()}")`);

    const asmSlideTitle = page.locator('#slide-main-title');
    const slideText = await asmSlideTitle.textContent();
    testAssert(slideText.includes('Compilers') || slideText.includes('RAX') || slideText.includes('Architecture'), `Loads Assembly curriculum lesson (got: "${slideText}")`);

    // 7. Track Switching Test (JavaScript)
    console.log('\n--- 7. Testing Track Switching (JavaScript) ---');
    await langSelect.selectOption('javascript');
    await page.waitForTimeout(400);

    const jsTag = page.locator('#lesson-track-tag');
    testAssert((await jsTag.textContent()).includes('JAVASCRIPT'), `Header tag updates to JAVASCRIPT track (got: "${await jsTag.textContent()}")`);

    // 8. In-Arena Study Linkage Check
    console.log('\n--- 8. Testing In-Arena Academy Study Linkage (game.html) ---');
    await page.goto(`${BASE_URL}/game.html?lang=rust&diff=intermediate`);
    await page.waitForTimeout(500);

    const arenaReviewBtn = page.locator('#btn-arena-review-lesson');
    testAssert(await arenaReviewBtn.isVisible(), 'Arena action bar includes #btn-arena-review-lesson');
    const reviewHref = await arenaReviewBtn.getAttribute('href');
    testAssert(reviewHref.includes('learn.html') && reviewHref.includes('rust'), `Review button targets learn.html with current track (got: "${reviewHref}")`);

    // 9. Career Progression & Academy Grid Integration Check
    console.log('\n--- 9. Testing Career Progression Academy Integration (progress.html) ---');
    await page.goto(`${BASE_URL}/progress.html`);
    await page.waitForTimeout(500);

    const statLessons = page.locator('#stat-lessons-mastered');
    testAssert(await statLessons.isVisible(), 'Career metrics strip displays Lessons Mastered stat');
    testAssert((await statLessons.textContent()).includes('/ 36'), `Lessons Mastered stat formatted against 36 lessons (got: "${await statLessons.textContent()}")`);

    const academyCurriculumGrid = page.locator('#academy-curriculum-grid > div');
    const academyCardCount = await academyCurriculumGrid.count();
    testAssert(academyCardCount === 12, `Cyber Academy Curriculum Grid displays cards for all 12 tracks (found: ${academyCardCount})`);

    const filterSubject = page.locator('#filter-badges-subject');
    const hasAcademyOption = await filterSubject.locator('option[value="academy"]').count();
    testAssert(hasAcademyOption >= 1, 'Trophy Room filters include Cyber Academy badge category');

    console.log('\n============================================================');
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('============================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

runLearnModeTest().catch(err => {
  console.error('Fatal Playwright Error:', err);
  process.exit(1);
});
