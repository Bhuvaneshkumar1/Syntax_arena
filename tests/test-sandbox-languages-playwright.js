import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

function createStaticServer(port) {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/sandbox.html';
    const filePath = path.join(ROOT_DIR, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function runSandboxLanguagesTest() {
  console.log('============================================================');
  console.log('🧪 PLAYWRIGHT E2E: SANDBOX MULTI-LANGUAGE EXECUTION VERIFICATION');
  console.log('============================================================\n');

  const PORT = 8127;
  const server = await createStaticServer(PORT);
  console.log(`✓ Local test server running on http://localhost:${PORT}`);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', (err) => {
    console.error('PAGE ERROR:', err);
    pageErrors.push(err.toString());
  });

  let passed = 0;
  let failed = 0;

  function check(desc, condition) {
    if (condition) {
      console.log(`  ✓ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
      failed++;
    }
  }

  try {
    await page.goto(`http://localhost:${PORT}/sandbox.html`);
    await page.waitForLoadState('networkidle');

    // Environments to test in order
    const envs = [
      { key: 'typescript', name: 'TypeScript', expectedSnippets: ['generics', 'interfaces'] },
      { key: 'go', name: 'Go (Golang)', expectedSnippets: ['goroutines_channels', 'slice_cap', 'defer_order'] },
      { key: 'javascript', name: 'JavaScript', expectedSnippets: ['array_quirks', 'async_closure'] },
      { key: 'sql', name: 'SQL', expectedSnippets: ['select_all', 'aggregates', 'challenges'] },
      { key: 'cyber', name: 'Cyber & Linux Shell', expectedSnippets: ['wildcard', 'pipes', 'perms', 'base64'] },
      { key: 'html', name: 'HTML5 & CSS', expectedSnippets: ['subgrid', 'cascade_layers'] },
      { key: 'asm', name: 'Assembly', expectedSnippets: ['registers_arithmetic', 'stack_frame_prologue'] },
      { key: 'systems', name: 'Systems Simulators', expectedSnippets: ['c_macro', 'c_struct', 'java_sub', 'rust_borrow'] }
    ];

    for (const env of envs) {
      console.log(`\n--- Testing ${env.name} [data-env="${env.key}"] ---`);
      
      // Click environment tab
      const tabBtn = page.locator(`button[data-env="${env.key}"]`);
      await tabBtn.click();
      await page.waitForTimeout(100);

      const isActive = await tabBtn.evaluate(el => el.classList.contains('is-active'));
      check(`${env.name} tab is active`, isActive);

      for (const snippet of env.expectedSnippets) {
        // Select template snippet
        await page.selectOption('#template-select', snippet);
        await page.waitForTimeout(100);

        // Click Run Code
        await page.click('#btn-page-run');
        await page.waitForTimeout(200);

        // Inspect terminal output
        const terminalText = await page.textContent('#page-console-output');
        const hasError = terminalText.includes('Runtime Error') || 
                         terminalText.includes('Syntax Error') || 
                         terminalText.includes('Compiler / Runtime Error') ||
                         terminalText.includes('SyntaxError') ||
                         terminalText.includes('Exception');

        check(`Snippet "${snippet}" runs with output (length: ${terminalText.trim().length})`, terminalText.trim().length > 0);
        check(`Snippet "${snippet}" executed with ZERO errors`, !hasError);
      }
    }

    check('Page had ZERO unhandled JavaScript errors in console', pageErrors.length === 0);

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n============================================================');
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSandboxLanguagesTest();
