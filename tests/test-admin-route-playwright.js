import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const PORT = 8116;
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

async function runAdminSecuritySuite() {
  console.log('============================================================');
  console.log('🧪 PLAYWRIGHT E2E: STEALTH GATE, CURRICULUM STUDIO & ADMIN SUITE');
  console.log('============================================================\n');

  const server = createTestServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test server running on ${BASE_URL}`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[STEALTH GATE]') || text.includes('[CurriculumStudio]') || text.includes('[StorageManager]')) {
      console.log('  PAGE LOG:', text);
    }
  });
  page.on('pageerror', err => console.error('  PAGE ERROR:', err));

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
    // Clean any residual test state
    await page.goto(`${BASE_URL}/index.html`);
    await page.evaluate(() => {
      localStorage.removeItem('syntaxarena_custom_lessons');
      sessionStorage.clear();
    });

    // -------------------------------------------------------------------------
    // 1. Stealth Navigation Integrity (Zero Admin Links in Normal UI)
    // -------------------------------------------------------------------------
    console.log('--- 1. Testing Stealth Navigation Integrity Across 7 Public Pages ---');
    const publicPages = [
      'index.html',
      'game.html',
      'learn.html',
      'sandbox.html',
      'results.html',
      'progress.html',
      'settings.html'
    ];

    for (const pageName of publicPages) {
      await page.goto(`${BASE_URL}/${pageName}`);
      await page.waitForLoadState('domcontentloaded');

      const adminLinks = await page.$$eval('a[href*="admin"]', links => links.map(l => l.outerHTML));
      check(`[${pageName}] Zero visible or DOM links to admin.html`, adminLinks.length === 0);
    }

    // -------------------------------------------------------------------------
    // 2. Stealth Access Mechanisms
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Testing Stealth Access Mechanisms ---');

    // 2.1 Hotkey Ctrl+Shift+A
    await page.goto(`${BASE_URL}/index.html`);
    await page.waitForLoadState('domcontentloaded');
    await page.keyboard.press('Control+Shift+KeyA');
    await page.waitForURL(/admin\.html/, { timeout: 3000 });
    check('Hotkey Ctrl+Shift+A navigates immediately to admin.html', page.url().includes('admin.html'));

    // 2.2 Rapid 3-tap gesture on brand emblem
    await page.goto(`${BASE_URL}/game.html`);
    await page.waitForLoadState('domcontentloaded');
    const brandBadge = await page.$('.brand-badge');
    check('Brand emblem badge exists on page', Boolean(brandBadge));
    await brandBadge.click();
    await page.waitForTimeout(100);
    await brandBadge.click();
    await page.waitForTimeout(100);
    await brandBadge.click();
    await page.waitForURL(/admin\.html/, { timeout: 3000 });
    check('Rapid 3-tap on brand emblem navigates stealthily to admin.html', page.url().includes('admin.html'));

    // 2.3 Terminal Command in Sandbox (sudo admin)
    await page.goto(`${BASE_URL}/sandbox.html`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(600);

    // Switch to Cyber & Linux environment to expose interactive shell prompt
    const cyberTab = await page.$('.env-tab-btn[data-env="cyber"]');
    if (cyberTab) await cyberTab.click();
    await page.waitForTimeout(300);

    const termInput = await page.$('#linux-cli-input');
    check('Cyber Shell sandbox terminal input exists', Boolean(termInput));
    await termInput.fill('sudo admin');
    const linuxForm = await page.$('#linux-cli-form');
    await linuxForm.dispatchEvent('submit');
    await page.waitForURL(/admin\.html/, { timeout: 4000 });
    check('Terminal command "sudo admin" routes directly to admin.html', page.url().includes('admin.html'));

    // -------------------------------------------------------------------------
    // 3. Vault Gate Authentication & Security Cooldown
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Testing Vault Gate Authentication & Security Cooldown ---');
    await page.goto(`${BASE_URL}/admin.html`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(400);

    const gate = await page.$('#admin-auth-gate');
    check('Vault Login Gate is displayed for unauthenticated visitors', Boolean(gate) && await gate.isVisible());

    const dashboard = await page.$('#admin-dashboard-view');
    check('Telemetry dashboard is hidden before login', !(await dashboard.isVisible()));

    const userInput = await page.$('#admin-input-username');
    const passInput = await page.$('#admin-input-password');
    const submitBtn = await page.$('#btn-admin-submit');

    // Bad login
    await userInput.fill('hacker');
    await passInput.fill('WrongPass123');
    await submitBtn.click();
    await page.waitForTimeout(300);

    const errorBox = await page.$('#admin-auth-error');
    check('Error notice displayed on bad credentials', await errorBox.isVisible());

    // Trigger remaining failed attempts to test rate-limit lockout
    for (let i = 0; i < 4; i++) {
      await passInput.fill(`BadPass${i}`);
      await submitBtn.click();
      await page.waitForTimeout(150);
    }

    const lockoutNotice = await page.$('#admin-lockout-notice');
    check('Security lockout triggered after 5 failed attempts', await lockoutNotice.isVisible());

    // Reset lockout in sessionStorage and clean leftover custom lessons from previous test runs
    await page.evaluate(() => {
      sessionStorage.removeItem('syntaxarena_admin_lockout');
      sessionStorage.removeItem('syntaxarena_admin_failed');
      localStorage.removeItem('syntaxarena_custom_lessons');
    });
    await page.reload();
    await page.waitForTimeout(400);

    // -------------------------------------------------------------------------
    // 4. Valid Admin Authentication (admin / Admin@123)
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Testing Valid Admin Authentication (admin / Admin@123) ---');
    const userValid = await page.$('#admin-input-username');
    const passValid = await page.$('#admin-input-password');
    const submitValid = await page.$('#btn-admin-submit');

    await userValid.fill('admin');
    await passValid.fill('Admin@123');
    await submitValid.click();
    await page.waitForTimeout(600);

    const dashAfterLogin = await page.$('#admin-dashboard-view');
    check('Telemetry dashboard displays after successful authentication', await dashAfterLogin.isVisible());
    check('Login gate is hidden after authentication', !(await (await page.$('#admin-auth-gate')).isVisible()));

    // -------------------------------------------------------------------------
    // 5. Curriculum Studio (60-Question & Academy Pack Drag-and-Drop Uploader)
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Testing Curriculum Studio & Drag-and-Drop Ingestion ---');
    const dropzone = await page.$('#lesson-dropzone');
    check('Curriculum Studio drag-and-drop dropzone rendered', Boolean(dropzone) && await dropzone.isVisible());

    const fileInput = await page.$('#lesson-file-input');
    check('Hidden file input element ready for ingestion', Boolean(fileInput));

    const sampleTemplateBtn = await page.$('#btn-download-sample-template');
    check('Sample starter JSON template download button exists', Boolean(sampleTemplateBtn));

    // Upload the valid 60-question sample template JSON
    const templateFilePath = path.resolve('data/sample-lesson-template.json');
    check('Sample template JSON file exists on disk', fs.existsSync(templateFilePath));

    await fileInput.setInputFiles(templateFilePath);
    await page.waitForTimeout(500);

    const reportBox = await page.$('#upload-validation-report');
    check('Pre-flight validation report box displayed', Boolean(reportBox) && await reportBox.isVisible());
    const reportText = await reportBox.innerText();
    console.log('  REPORT TEXT:', reportText.replace(/\n+/g, ' '));
    const lowerReport = reportText.toLowerCase();
    check('Pre-flight validation confirms 60 valid questions and Academy chapter',
      (lowerReport.includes('system check passed') || lowerReport.includes('ready to deploy')) &&
      lowerReport.includes('60 qs') && lowerReport.includes('academy chapter'));

    // Deploy lesson
    const deployBtn = await page.$('#btn-deploy-lesson');
    check('Deploy button is enabled for valid pack', await deployBtn.isEnabled());
    await deployBtn.click();
    await page.waitForTimeout(600);

    // Verify published lesson appears in published custom lessons table
    const publishedRows = await page.$$('#admin-custom-lessons-list tbody tr');
    check('Published lessons table contains at least 1 custom pack', publishedRows.length >= 1);
    const publishedText = await publishedRows[0].innerText();
    check('Published lesson lists Go language track with 60 questions', publishedText.includes('GO') || publishedText.includes('Go') && publishedText.includes('60 Qs'));

    // -------------------------------------------------------------------------
    // 6. Cyber Academy Dynamic Live Integration
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Testing Dynamic Ingestion in Cyber Academy (learn.html) ---');
    await page.goto(`${BASE_URL}/learn.html?lang=go&diff=all`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(800);

    // Verify the newly uploaded custom chapter appears in Academy
    const lessonMenuItems = await page.$$eval('#academy-lesson-menu .lesson-nav-btn', items => items.map(i => i.innerText));
    console.log('  ACADEMY LESSON ITEMS FOR GO:', lessonMenuItems);
    const customChapterFound = lessonMenuItems.some(text => text.includes('Goroutines') || text.includes('CSP') || text.includes('Communicating'));
    check('Cyber Academy dynamically loads and lists the uploaded custom chapter for Go', customChapterFound);

    // -------------------------------------------------------------------------
    // 7. Question Bank Dynamic Ingestion in Live Engine
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Testing Question Bank Dynamic Ingestion ---');
    const qCountInEngine = await page.evaluate(() => {
      if (typeof window.QuestionBank !== 'undefined') {
        const goQuestions = window.QuestionBank.getByLanguage('go');
        return goQuestions.length;
      }
      return -1;
    });
    // Base 60 + 60 uploaded = 120
    check('QuestionBank incorporates uploaded questions (Go has 120 questions: 60 base + 60 custom)', qCountInEngine === 120);

    // -------------------------------------------------------------------------
    // 8. Custom Lesson Deletion and Dynamic Cleanup
    // -------------------------------------------------------------------------
    console.log('\n--- 8. Testing Custom Lesson Deletion and Dynamic Cleanup ---');
    await page.goto(`${BASE_URL}/admin.html`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const deleteBtn = await page.$('.btn-delete-lesson');
    check('Delete button exists on custom lesson row', Boolean(deleteBtn));

    // Handle confirm dialog
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    await deleteBtn.click();
    await page.waitForTimeout(600);

    const emptyText = await (await page.$('#admin-custom-lessons-list')).innerText();
    check('Custom lessons roster displays empty state after deletion', emptyText.includes('No custom lessons uploaded yet'));

    // -------------------------------------------------------------------------
    // 9. KPI Telemetry Metrics & Roster Dossier
    // -------------------------------------------------------------------------
    console.log('\n--- 9. Testing KPI Telemetry Cards & Player Dossiers ---');
    const statPlayers = await page.$('#stat-total-players');
    check('Total registered players KPI rendered', (await statPlayers.innerText()).length > 0);

    const seedBtn = await page.$('#btn-admin-seed-demo');
    await seedBtn.click();
    await page.waitForTimeout(500);

    const rows = await page.$$('#admin-roster-tbody tr.admin-roster-row');
    check('Roster table populated with multiple player records (>= 3 players)', rows.length >= 3);

    const dossierBtn = await rows[0].$('.btn-inspect-player');
    await dossierBtn.click();
    await page.waitForTimeout(400);

    const dossierModal = await page.$('#modal-player-dossier');
    check('Player dossier modal opens with detailed track breakdown', await dossierModal.isVisible());

    const closeBtn = await page.$('#btn-close-dossier');
    await closeBtn.click();
    await page.waitForTimeout(300);
    check('Dossier modal closes', !(await dossierModal.isVisible()));

    // -------------------------------------------------------------------------
    // 10. Sign Out & Session Revocation
    // -------------------------------------------------------------------------
    console.log('\n--- 10. Testing Sign Out & Session Revocation ---');
    const logoutBtn = await page.$('#btn-admin-logout');
    await logoutBtn.click();
    await page.waitForTimeout(400);

    check('Returns to Vault Login Gate on logout', await (await page.$('#admin-auth-gate')).isVisible());
    check('Dashboard hidden on logout', !(await (await page.$('#admin-dashboard-view')).isVisible()));

    const sessionAfterLogout = await page.evaluate(() => sessionStorage.getItem('syntaxarena_admin_session'));
    check('Session token completely revoked from sessionStorage', !sessionAfterLogout);

    console.log(`\n============================================================`);
    console.log(`🎉 ALL STEALTH GATE & CURRICULUM STUDIO TESTS PASSED (${passed}/${total})`);
    console.log(`============================================================\n`);
  } finally {
    await browser.close();
    server.close();
  }
}

runAdminSecuritySuite().catch(err => {
  console.error('Playwright Test Failed:', err);
  process.exit(1);
});
