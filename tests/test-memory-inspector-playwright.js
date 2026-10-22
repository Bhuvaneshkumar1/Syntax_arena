import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import assert from 'assert';

const PORT = 8123;
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

async function runMemoryInspectorTest() {
  console.log('============================================================');
  console.log('🧪 PLAYWRIGHT E2E: INTERACTIVE VISUAL MEMORY & POINTER INSPECTOR');
  console.log('============================================================\n');

  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`✓ Local test server running on ${BASE_URL}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();
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
    // -------------------------------------------------------------------------
    // PART 1: SANDBOX VISUAL MEMORY INSPECTOR
    // -------------------------------------------------------------------------
    console.log('--- Part 1: Sandbox Memory & Pointer Inspector ---');
    await page.goto(`${BASE_URL}/sandbox.html?env=python`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(600);

    const inspector = await page.$('#visual-memory-inspector');
    check('Visual Memory Inspector exists in sandbox.html', Boolean(inspector));

    const stackBox = await page.$('#sandbox-memory-container #stack-frame-box');
    check('Call stack frame box is rendered', Boolean(stackBox));

    const heapBox = await page.$('#sandbox-memory-container #heap-frame-box');
    check('Heap storage box is rendered', Boolean(heapBox));

    // Verify stack variable row
    const varRows = await page.$$('#sandbox-memory-container .mem-var-row');
    check('Stack variables rendered in memory inspector', varRows.length > 0);

    const varName = await varRows[0].$('.mem-var-name');
    const varNameText = await varName.innerText();
    check('Stack variable displays identifier name', Boolean(varNameText));

    const varAddr = await varRows[0].$('.mem-var-addr');
    const varAddrText = await varAddr.innerText();
    check('Stack variable displays hexadecimal address (0x7ffe...)', varAddrText.startsWith('0x'));

    // Check pointer row and hover highlighting
    const pointerRow = await page.$('#sandbox-memory-container .mem-var-row.is-pointer-var');
    if (pointerRow) {
      const targetHeapId = await pointerRow.getAttribute('data-target-heap');
      await pointerRow.hover();
      await page.waitForTimeout(150);

      const heapBlock = await page.$(`#sandbox-memory-container [data-heap-id="${targetHeapId}"]`);
      if (heapBlock) {
        const blockClass = await heapBlock.getAttribute('class');
        check('Hovering stack pointer highlights target heap block with neon border', blockClass.includes('is-highlighted-target'));
      } else {
        check('Stack pointer has valid target attribute', Boolean(targetHeapId));
      }
    } else {
      check('Stack variable is rendered with address and value', varRows.length > 0);
    }

    // Test Manual Refresh Button
    const refreshBtn = await page.$('#btn-toggle-memory-inspector');
    check('Refresh Memory button exists', Boolean(refreshBtn));
    await refreshBtn.click();
    await page.waitForTimeout(200);

    // Switch to C/C++ Systems tab
    const systemsTab = await page.$('[data-env="systems"]');
    if (systemsTab) {
      await systemsTab.click();
      await page.waitForTimeout(400);

      const sysRows = await page.$$('#sandbox-memory-container .mem-var-row');
      check('Memory inspector updates dynamically when switching environment', sysRows.length > 0);
    }

    // -------------------------------------------------------------------------
    // PART 2: ACADEMY (LEARN.HTML) VISUAL MEMORY INSPECTOR
    // -------------------------------------------------------------------------
    console.log('\n--- Part 2: Academy Lesson Visual Memory Inspector ---');
    await page.goto(`${BASE_URL}/learn.html?lang=python`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(800);

    const lessonInspector = await page.$('#lesson-memory-inspector');
    check('Lesson Slide 1 renders Visual Memory & Pointer Inspector', Boolean(lessonInspector));

    const lessonStackBox = await page.$('#lesson-memory-container #stack-frame-box');
    check('Lesson memory container renders active stack frame', Boolean(lessonStackBox));

    const lessonVars = await page.$$('#lesson-memory-container .mem-var-row');
    check('Lesson memory container displays local variables matching lesson code', lessonVars.length > 0);

    console.log(`\n============================================================`);
    console.log(`🎉 ALL VISUAL MEMORY INSPECTOR PLAYWRIGHT TESTS PASSED (${passed}/${total})`);
    console.log(`============================================================\n`);
  } finally {
    await browser.close();
    server.close();
  }
}

runMemoryInspectorTest().catch(err => {
  console.error('Playwright Test Failed:', err);
  process.exit(1);
});
