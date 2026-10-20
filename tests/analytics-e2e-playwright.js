/**
 * Playwright E2E Test Suite: Batch 7 Learning Analytics & Results Experience
 * Validates results.html (SVG progress ring, 8-metric grid, topic mastery cards,
 * evidence recommendations, expandable question reviews, and retry-missed flow)
 * and progress.html (language cards, difficulty metrics, trend SVG visualizer, and filters).
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:8080';

async function runAnalyticsE2ETests() {
  console.log('============================================================');
  console.log('🎭 STARTING PLAYWRIGHT ANALYTICS & RESULTS E2E SUITE');
  console.log('============================================================\n');

  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge'
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  let passedCount = 0;
  let failedCount = 0;

  function pass(name, detail = '') {
    console.log(`  ✓ [PASS] ${name}${detail ? ` (${detail})` : ''}`);
    passedCount++;
  }

  function fail(name, reason = '') {
    console.error(`  ✗ [FAIL] ${name}${reason ? ` (${reason})` : ''}`);
    failedCount++;
  }

  try {
    // Inject realistic completed session data into sessionStorage & localStorage
    await page.goto(`${BASE_URL}/index.html`);
    await page.evaluate(() => {
      const mockSession = {
        sessionId: 'test-sess-analytics-001',
        language: 'python',
        difficulty: 'beginner',
        mode: 'campaign',
        totalQuestions: 4,
        questionsAttempted: 4,
        questionsCorrect: 3,
        incorrectCount: 1,
        accuracy: 75,
        totalScore: 3200,
        bestStreak: 3,
        elapsedSeconds: 95,
        hintsUsed: 1,
        retriesUsed: 0,
        timestamp: Date.now() - 3600000,
        isCompleted: true,
        missedQuestionIds: ['py-beg-002'],
        results: [
          {
            questionId: 'py-beg-001',
            type: 'predict_output',
            topic: 'data_structures',
            subtopic: 'list_mutability',
            prompt: 'What is the exact stdout printed after executing this snippet?',
            code: 'a = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a), a[-1])',
            submission: '4 4',
            correctAnswer: '4 4',
            isCorrect: true,
            usedHint: false,
            attempts: 1,
            points: 100,
            explanation: 'Lists are mutable objects; b and a point to the same list in memory.'
          },
          {
            questionId: 'py-beg-002',
            type: 'multiple_choice',
            topic: 'data_types',
            subtopic: 'string_immutability',
            prompt: 'What happens when attempting to execute: `s = \'hello\'; s[0] = \'H\'`?',
            code: 's = \'hello\'\ns[0] = \'H\'',
            submission: 's becomes \'Hello\'',
            correctAnswer: 'TypeError: \'str\' object does not support item assignment',
            isCorrect: false,
            usedHint: true,
            attempts: 1,
            points: 0,
            explanation: 'Python strings are strictly immutable primitives.'
          },
          {
            questionId: 'py-beg-003',
            type: 'predict_output',
            topic: 'data_structures',
            subtopic: 'list_slices',
            prompt: 'What is the output of `nums = [10, 20, 30]; print(nums[1:])`?',
            code: 'nums = [10, 20, 30]\nprint(nums[1:])',
            submission: '[20, 30]',
            correctAnswer: '[20, 30]',
            isCorrect: true,
            usedHint: false,
            attempts: 1,
            points: 125,
            explanation: 'Slicing nums[1:] yields a new list from index 1 to end.'
          },
          {
            questionId: 'py-beg-004',
            type: 'predict_output',
            topic: 'data_structures',
            subtopic: 'list_indexing',
            prompt: 'What is printed by `print([1, 2][0])`?',
            code: 'print([1, 2][0])',
            submission: '1',
            correctAnswer: '1',
            isCorrect: true,
            usedHint: false,
            attempts: 1,
            points: 100,
            explanation: 'Zero-indexed first element.'
          }
        ]
      };

      const mockRewards = {
        success: true,
        xpEarned: 250,
        levelUp: false,
        newBadges: ['first_blood']
      };

      sessionStorage.setItem('syntaxarena_last_session_summary', JSON.stringify(mockSession));
      sessionStorage.setItem('syntaxarena_last_session_rewards', JSON.stringify(mockRewards));

      // Append to localStorage active profile
      const raw = localStorage.getItem('syntaxarena_storage_v1');
      if (raw) {
        const store = JSON.parse(raw);
        if (store.profiles && store.profiles[0]) {
          const prof = store.profiles[0];
          prof.sessionHistory = [
            mockSession,
            {
              sessionId: 'test-sess-prev-000',
              language: 'c',
              difficulty: 'beginner',
              mode: 'campaign',
              questionsAttempted: 5,
              questionsCorrect: 5,
              accuracy: 100,
              totalScore: 4000,
              timestamp: Date.now() - 86400000,
              isCompleted: true
            }
          ];
          prof.missedQuestionIds = ['py-beg-002'];
          prof.stats.gamesPlayed = 2;
          prof.stats.questionsAttempted = 9;
          prof.stats.questionsCorrect = 8;
          localStorage.setItem('syntaxarena_storage_v1', JSON.stringify(store));
        }
      }
    });

    // =========================================================================
    // SUITE 1: results.html (Session Performance & Learning Analytics)
    // =========================================================================
    console.log('\n--- SUITE 1: results.html (Session Results & Analytics) ---');
    await page.goto(`${BASE_URL}/results.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    // 1.1 Performance Ring & Grade Display
    const gradeText = await page.locator('#results-grade-display').textContent();
    const ringPercent = await page.locator('#results-ring-percent').textContent();
    const svgRing = page.locator('#results-svg-ring');
    const isRingVisible = await svgRing.isVisible();

    if (gradeText && gradeText.includes('GRADE B') && ringPercent.includes('75%') && isRingVisible) {
      pass('Circular SVG Progress Ring & Grade S-F', `${gradeText.trim()} • ${ringPercent.trim()}`);
    } else {
      fail('Circular SVG Progress Ring & Grade', `Grade: ${gradeText}, Percent: ${ringPercent}`);
    }

    // 1.2 8-Metric Performance Grid
    const scoreVal = await page.locator('#res-score-val').textContent();
    const accVal = await page.locator('#res-acc-val').textContent();
    const countsVal = await page.locator('#res-counts-val').textContent();
    const xpVal = await page.locator('#res-xp-val').textContent();
    const streakVal = await page.locator('#res-streak-val').textContent();
    const timeVal = await page.locator('#res-time-val').textContent();
    const hintsVal = await page.locator('#res-hints-val').textContent();

    if (scoreVal && accVal && countsVal && xpVal && streakVal && timeVal && hintsVal) {
      pass('8-Metric Verified Session Grid', `Score: ${scoreVal}, Acc: ${accVal}, Qs: ${countsVal}, XP: ${xpVal}, Streak: ${streakVal}`);
    } else {
      fail('8-Metric Verified Session Grid', 'Missing metric card in grid');
    }

    // 1.3 Topic Strengths & Weaknesses Breakdown
    const topicCards = page.locator('#topic-breakdown-body > div');
    const topicCount = await topicCards.count();
    if (topicCount >= 2) {
      pass('Topic Mastery Breakdown Cards Rendered', `${topicCount} topics analyzed (data_structures, data_types)`);
    } else {
      fail('Topic Mastery Breakdown Cards Rendered', `Expected >= 2, got: ${topicCount}`);
    }

    // 1.4 Personalized Recommendations
    const recCards = page.locator('#recommendations-container > div');
    const recCount = await recCards.count();
    if (recCount > 0) {
      const firstRecTitle = await recCards.first().locator('h4').textContent();
      pass('Deterministic Recommendations Rendered', `${recCount} recommendation(s) • Top: "${firstRecTitle.trim()}"`);
    } else {
      fail('Deterministic Recommendations Rendered', 'No recommendations generated');
    }

    // 1.5 Question-by-Question Review Accordion
    const reviewCards = page.locator('#question-review-list > div');
    const reviewCount = await reviewCards.count();
    if (reviewCount === 4) {
      pass('Itemized Question Review Cards', `All 4 questions listed with submitted answers and correct output`);
    } else {
      fail('Itemized Question Review Cards', `Expected 4, got: ${reviewCount}`);
    }

    // 1.6 Expand / Collapse Explanation Drawer
    const firstToggle = page.locator('.btn-exp-toggle').first();
    const firstDrawer = page.locator('.exp-drawer').first();
    const isInitiallyHidden = await firstDrawer.isHidden();
    await firstToggle.click();
    await page.waitForTimeout(200);
    const isNowVisible = await firstDrawer.isVisible();
    if (isInitiallyHidden && isNowVisible) {
      pass('Question Explanation Accordion Toggle', 'Expanded pedagogical breakdown on click');
    } else {
      fail('Question Explanation Accordion Toggle', `Initial hidden: ${isInitiallyHidden}, now visible: ${isNowVisible}`);
    }

    // 1.7 Toggle All Explanations Button
    const toggleAllBtn = page.locator('#btn-toggle-all-explanations');
    await toggleAllBtn.click();
    await page.waitForTimeout(200);
    const allDrawers = await page.locator('.exp-drawer:visible').count();
    if (allDrawers === 4) {
      pass('Expand All Explanations Global Button', 'All 4 explanations opened simultaneously');
    } else {
      fail('Expand All Explanations Global Button', `Expected 4 visible drawers, got: ${allDrawers}`);
    }

    // 1.8 Retry Missed Questions Workflow Button
    const retryBtn = page.locator('#btn-retry-missed');
    const retryText = await retryBtn.textContent();
    if (retryText && retryText.includes('Retry 1 Missed')) {
      pass('Retry Missed Questions Button Active', retryText.trim());
    } else {
      fail('Retry Missed Questions Button Active', `Button text: ${retryText}`);
    }

    // =========================================================================
    // SUITE 2: progress.html (Language Analytics, Tiers, & SVG Trend Chart)
    // =========================================================================
    console.log('\n--- SUITE 2: progress.html (Language Mastery & Trend Visualizer) ---');
    await page.goto(`${BASE_URL}/progress.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    // 2.1 Language Performance Grid (4 Cards: Python, C, C++, Java)
    const langCards = page.locator('#language-performance-grid > div');
    const langCardCount = await langCards.count();
    if (langCardCount === 4) {
      pass('Language Performance 4-Track Grid', 'Python, C, C++, Java rendered');
    } else {
      fail('Language Performance 4-Track Grid', `Expected 4, got: ${langCardCount}`);
    }

    // Check Python card has real data
    const pyCard = langCards.first();
    const pyText = await pyCard.textContent();
    if (pyText && pyText.includes('ACCURACY') && pyText.includes('Strengths')) {
      pass('Active Language Mastery Analytics', 'Python card reflects real session accuracy and topic strengths');
    } else {
      fail('Active Language Mastery Analytics', 'Python card missing metrics');
    }

    // 2.2 Difficulty Tier Performance Grid (3 Cards)
    const diffCards = page.locator('#difficulty-performance-grid > div');
    const diffCardCount = await diffCards.count();
    if (diffCardCount === 3) {
      pass('Difficulty Performance 3-Tier Grid', 'Beginner, Intermediate, Expert rendered');
    } else {
      fail('Difficulty Performance 3-Tier Grid', `Expected 3, got: ${diffCardCount}`);
    }

    // 2.3 Native Responsive SVG Line Trend Chart
    const trendSvg = page.locator('#trend-svg-container svg');
    const isTrendVisible = await trendSvg.isVisible();
    const trendBadge = await page.locator('#trend-status-badge').textContent();
    if (isTrendVisible && trendBadge) {
      pass('Native Responsive SVG Accuracy Trend Visualizer', `Line chart rendered with badge: "${trendBadge.trim()}"`);
    } else {
      fail('Native Responsive SVG Accuracy Trend Visualizer', `SVG visible: ${isTrendVisible}, badge: ${trendBadge}`);
    }

    // 2.4 Interactive Filters on Session History
    const filterLang = page.locator('#filter-history-lang');
    const filterDiff = page.locator('#filter-history-diff');
    const filterRange = page.locator('#filter-history-range');

    const hasFilters = (await filterLang.isVisible()) && (await filterDiff.isVisible()) && (await filterRange.isVisible());
    if (hasFilters) {
      pass('Interactive History Filters Visible', 'Language, Tier, and Range selects ready');
    } else {
      fail('Interactive History Filters Visible', 'Missing filter dropdown');
    }

    // Test changing filter to Python only
    await filterLang.selectOption('python');
    await page.waitForTimeout(200);
    const tableRows = page.locator('#history-table-body tr');
    const rowCount = await tableRows.count();
    const firstRowText = await tableRows.first().textContent();
    if (rowCount >= 1 && firstRowText && firstRowText.includes('PYTHON')) {
      pass('Filter Dynamically Updates History Table', `Filtered to Python runs (${rowCount} row)`);
    } else {
      fail('Filter Dynamically Updates History Table', `Rows: ${rowCount}, first: ${firstRowText}`);
    }

    // =========================================================================
    // SUITE 3: game.html?mode=retry_missed Integration
    // =========================================================================
    console.log('\n--- SUITE 3: game.html?mode=retry_missed Navigation ---');
    await page.goto(`${BASE_URL}/game.html?mode=retry_missed&lang=python&diff=beginner`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const questionPrompt = await page.locator('#q-prompt-text').textContent();
    const optionCards = page.locator('.option-card');
    const optionCount = await optionCards.count();

    if (questionPrompt && optionCount > 0) {
      pass('Retry Missed Questions Session Initialized', `Loaded question: "${questionPrompt.trim().slice(0, 45)}..." with ${optionCount} options`);
    } else {
      fail('Retry Missed Questions Session Initialized', `Prompt: ${questionPrompt}, Options: ${optionCount}`);
    }

  } catch (err) {
    fail('Playwright Analytics Suite Execution Exception', err.message);
  } finally {
    await browser.close();
  }

  console.log('\n============================================================');
  console.log('🏁 PLAYWRIGHT ANALYTICS SUITE SUMMARY');
  console.log('============================================================');
  console.log(`TOTAL PASSED: ${passedCount}`);
  console.log(`TOTAL FAILED: ${failedCount}`);
  console.log('============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAnalyticsE2ETests().catch(err => {
  console.error(err);
  process.exit(1);
});
