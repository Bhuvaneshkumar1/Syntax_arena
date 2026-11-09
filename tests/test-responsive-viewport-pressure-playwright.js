import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const PORT = 8118;
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

// 5 Device Viewport Profiles covering full screen size pressure spectrum
const VIEWPORTS = [
  { name: 'iPhone SE (Extra Narrow Mobile)', width: 375, height: 667, isMobile: true },
  { name: 'iPhone 14 (Modern Mobile)', width: 390, height: 844, isMobile: true },
  { name: 'iPad Mini (Tablet Portrait)', width: 768, height: 1024, isMobile: true },
  { name: 'MacBook / Laptop (Desktop)', width: 1280, height: 800, isMobile: false },
  { name: '1080p FHD (Ultrawide Desktop)', width: 1920, height: 1080, isMobile: false }
];

const PAGES_TO_TEST = [
  'index.html',
  'game.html?lang=python&diff=beginner',
  'learn.html?lang=python',
  'sandbox.html?env=python',
  'results.html',
  'progress.html',
  'settings.html',
  'admin.html'
];

async function runViewportPressureSuite() {
  console.log('============================================================');
  console.log('🧪 PLAYWRIGHT E2E: MULTI-VIEWPORT SIZE PRESSURE TEST SUITE');
  console.log('============================================================\n');

  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test server running on ${BASE_URL}`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  page.on('console', msg => {
    // Only log errors or warnings to keep output readable
    if (msg.type() === 'error') console.log('PAGE ERROR LOG:', msg.text());
  });

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
    for (const vp of VIEWPORTS) {
      console.log(`\n============================================================`);
      console.log(`📱 TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`============================================================`);

      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const pagePath of PAGES_TO_TEST) {
        const url = `${BASE_URL}/${pagePath}`;
        await page.goto(url);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(300);

        // 1. Verify zero horizontal overflow blowout
        const overflowCheck = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const culprits = [];
          if (docWidth > winWidth + 1) {
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > winWidth + 1 || el.scrollWidth > winWidth + 1) {
                culprits.push({
                  tag: el.tagName,
                  id: el.id,
                  cls: (el.className && typeof el.className === 'string') ? el.className.slice(0, 30) : '',
                  right: Math.round(r.right),
                  width: Math.round(r.width),
                  scrollW: el.scrollWidth,
                  parent: el.parentElement ? `${el.parentElement.tagName}#${el.parentElement.id}.${el.parentElement.className}` : ''
                });
              }
            });
          }
          return {
            hasOverflow: docWidth > winWidth + 1, // 1px tolerance for rounding
            docWidth,
            winWidth,
            culprits: culprits.slice(0, 15)
          };
        });

        if (overflowCheck.hasOverflow) {
          console.error(`  Culprits for ${pagePath}:`, overflowCheck.culprits);
        }

        check(
          `[${vp.name}] ${pagePath.split('?')[0]} zero horizontal overflow (${overflowCheck.docWidth}px <= ${overflowCheck.winWidth}px)`,
          !overflowCheck.hasOverflow
        );

        // 2. Responsive Navigation Verification
        if (vp.width <= 820) {
          // Mobile / Tablet: hamburger menu should be available or drawer exists
          const mobileMenuBtn = await page.$('#btn-mobile-menu');
          check(`[${vp.name}] ${pagePath.split('?')[0]} mobile navigation drawer trigger rendered`, Boolean(mobileMenuBtn));
        } else {
          // Desktop: primary app-nav should be displayed
          const appNav = await page.$('.app-nav');
          const isNavVisible = appNav ? await appNav.isVisible() : false;
          check(`[${vp.name}] ${pagePath.split('?')[0]} desktop navigation visible`, isNavVisible);
        }
      }

      // 3. Test Mobile Navigation Drawer Interaction under Mobile Pressure
      if (vp.isMobile) {
        await page.goto(`${BASE_URL}/index.html`);
        await page.waitForTimeout(300);
        const mobileBtn = await page.$('#btn-mobile-menu');
        const drawer = await page.$('#mobile-nav-drawer');

        if (mobileBtn && drawer) {
          await mobileBtn.click();
          await page.waitForTimeout(200);
          check(`[${vp.name}] Mobile drawer opens upon tapping hamburger button`, await drawer.isVisible());

          await mobileBtn.click();
          await page.waitForTimeout(200);
          check(`[${vp.name}] Mobile drawer closes cleanly upon toggling`, !(await drawer.isVisible()));
        }
      }
    }

    console.log(`\n============================================================`);
    console.log(`🎉 ALL VIEWPORT SIZE PRESSURE TESTS PASSED (${passed}/${total})`);
    console.log(`============================================================\n`);
  } finally {
    await browser.close();
    server.close();
  }
}

runViewportPressureSuite().catch(err => {
  console.error('Playwright Viewport Test Failed:', err);
  process.exit(1);
});
