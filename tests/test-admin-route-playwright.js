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
  console.log('🧪 PLAYWRIGHT E2E: ADMINISTRATIVE ROUTE & TELEMETRY SECURITY');
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
    // -------------------------------------------------------------------------
    // 1. Initial Unauthenticated Gate
    // -------------------------------------------------------------------------
    console.log('--- 1. Testing Unauthenticated Gate ---');
    await page.goto(`${BASE_URL}/admin.html`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const gate = await page.$('#admin-auth-gate');
    check('Vault Login Gate is displayed for unauthenticated visitors', Boolean(gate));
    check('Gate is visible', await gate.isVisible());

    const dashboard = await page.$('#admin-dashboard-view');
    check('Telemetry dashboard is hidden before login', !(await dashboard.isVisible()));

    // -------------------------------------------------------------------------
    // 2. Authentication Rejection & Rate Limiting
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Testing Authentication Rejection & Security Cooldown ---');
    const userInput = await page.$('#admin-input-username');
    const passInput = await page.$('#admin-input-password');
    const submitBtn = await page.$('#btn-admin-submit');

    await userInput.fill('hacker');
    await passInput.fill('WrongPass123');
    await submitBtn.click();
    await page.waitForTimeout(300);

    const errorBox = await page.$('#admin-auth-error');
    check('Error message displayed on bad credentials', await errorBox.isVisible());
    const errorText = await (await page.$('#admin-error-text')).innerText();
    check('Error notice includes remaining attempt count', errorText.includes('remaining'));

    // Trigger remaining failed attempts to test rate-limit lockout
    for (let i = 0; i < 4; i++) {
      await passInput.fill(`BadPass${i}`);
      await submitBtn.click();
      await page.waitForTimeout(150);
    }

    const lockoutNotice = await page.$('#admin-lockout-notice');
    check('Security lockout triggered after 5 failed attempts', await lockoutNotice.isVisible());
    const lockoutText = await (await page.$('#admin-lockout-text')).innerText();
    check('Lockout countdown ticker active', lockoutText.includes('cooldown active'));

    // Reset lockout in sessionStorage for the rest of the test
    await page.evaluate(() => {
      sessionStorage.removeItem('syntaxarena_admin_lockout');
      sessionStorage.removeItem('syntaxarena_admin_failed');
    });
    await page.reload();
    await page.waitForTimeout(400);

    // -------------------------------------------------------------------------
    // 3. Successful Admin Authentication (admin / Admin@123)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Testing Valid Admin Authentication (admin / Admin@123) ---');
    const userValid = await page.$('#admin-input-username');
    const passValid = await page.$('#admin-input-password');
    const submitValid = await page.$('#btn-admin-submit');

    await userValid.fill('admin');
    await passValid.fill('Admin@123');
    await submitValid.click();
    await page.waitForTimeout(600);

    const dashAfterLogin = await page.$('#admin-dashboard-view');
    check('Telemetry dashboard displays after successful authentication', await dashAfterLogin.isVisible());

    const gateAfterLogin = await page.$('#admin-auth-gate');
    check('Login gate is hidden after authentication', !(await gateAfterLogin.isVisible()));

    const sessionRaw = await page.evaluate(() => sessionStorage.getItem('syntaxarena_admin_session'));
    check('Secure session token persisted in sessionStorage', Boolean(sessionRaw) && sessionRaw.includes('admin'));

    // -------------------------------------------------------------------------
    // 4. KPI Telemetry Metrics
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Testing Global KPI Telemetry Cards ---');
    const statPlayers = await page.$('#stat-total-players');
    check('Total registered players KPI rendered', (await statPlayers.innerText()).length > 0);

    const statMastered = await page.$('#stat-total-mastered');
    check('Total questions mastered KPI rendered', (await statMastered.innerText()).length > 0);

    const statLessons = await page.$('#stat-total-lessons');
    check('Academy handbook chapters KPI rendered', (await statLessons.innerText()).length > 0);

    const statAvg = await page.$('#stat-avg-completion');
    check('Global average completion % KPI rendered', (await statAvg.innerText()).includes('%'));

    // -------------------------------------------------------------------------
    // 5. Seed Demo Players for Multi-Player Language Audit
    // -------------------------------------------------------------------------
    console.log('\n--- 5. Testing Multi-Player Language Audit Roster ---');
    const seedBtn = await page.$('#btn-admin-seed-demo');
    check('Seed Demo Players button exists', Boolean(seedBtn));
    await seedBtn.click();
    await page.waitForTimeout(500);

    const rows = await page.$$('#admin-roster-tbody tr.admin-roster-row');
    check('Roster table populated with multiple player records (>= 3 players)', rows.length >= 3);

    // Verify language badges on each player row
    const firstRowBadges = await rows[0].$$('span[title]');
    check('Player row renders language completion badges (all 12 tracks)', firstRowBadges.length >= 12);

    // -------------------------------------------------------------------------
    // 6. Player Deep-Dive Dossier Modal (12 Languages Breakdown)
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Testing Player Dossier Modal (12 Language Breakdown) ---');
    const dossierBtn = await rows[0].$('.btn-inspect-player');
    check('Dossier button exists on player row', Boolean(dossierBtn));
    await dossierBtn.click();
    await page.waitForTimeout(400);

    const dossierModal = await page.$('#modal-player-dossier');
    check('Dossier modal opens on click', await dossierModal.isVisible());

    const dossierLangCards = await page.$$('#dossier-language-list > div');
    check('Dossier displays detailed breakdown for all 12 programming tracks', dossierLangCards.length === 12);

    // Verify sub-tier details in first language card (Beginner, Intermediate, Expert, Academy)
    const cardText = await dossierLangCards[0].innerText();
    check('Dossier track card displays Beginner/Intermediate/Expert and Academy counts', cardText.includes('Beg:') && cardText.includes('Academy:'));

    // Close dossier
    const closeBtn = await page.$('#btn-close-dossier');
    await closeBtn.click();
    await page.waitForTimeout(300);
    check('Dossier modal closes', !(await dossierModal.isVisible()));

    // -------------------------------------------------------------------------
    // 7. Search & Filter Testing
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Testing Search & Language Filter ---');
    const searchInput = await page.$('#admin-search-player');
    await searchInput.fill('Valkyrie');
    await page.waitForTimeout(200);

    const searchRows = await page.$$('#admin-roster-tbody tr.admin-roster-row');
    check('Filter by callsign filters roster to matching player', searchRows.length === 1);

    await searchInput.fill('');
    await page.waitForTimeout(200);

    // -------------------------------------------------------------------------
    // 8. Sign Out & Session Revocation
    // -------------------------------------------------------------------------
    console.log('\n--- 8. Testing Sign Out & Session Revocation ---');
    const logoutBtn = await page.$('#btn-admin-logout');
    await logoutBtn.click();
    await page.waitForTimeout(400);

    check('Returns to Vault Login Gate on logout', await (await page.$('#admin-auth-gate')).isVisible());
    check('Dashboard hidden on logout', !(await (await page.$('#admin-dashboard-view')).isVisible()));

    const sessionAfterLogout = await page.evaluate(() => sessionStorage.getItem('syntaxarena_admin_session'));
    check('Session token completely revoked from sessionStorage', !sessionAfterLogout);

    console.log(`\n============================================================`);
    console.log(`🎉 ALL ADMINISTRATIVE SECURITY TESTS PASSED (${passed}/${total})`);
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
