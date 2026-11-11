/**
 * Playwright E2E Suite: CyberDrill Incident Response & Live Outage Simulator (Feature 5)
 * Verifies Hub quick-launch, telemetry HUD gauges, live streaming log search filter,
 * scenario catalog selector modal, 2-phase triage workflow (diagnosis -> hotfix),
 * telemetry stabilization, and SRE Post-Mortem incident report card.
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runIncidentPlaywrightSuite() {
  console.log('============================================================');
  console.log('🚨 RUNNING CYBERDRILL INCIDENT RESPONSE PLAYWRIGHT E2E SUITE');
  console.log('============================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`  [Browser ${msg.type()}] ${msg.text()}`);
  });

  try {
    // -------------------------------------------------------------
    // Test 1: Hub Quick-Launch & Showcase Links
    // -------------------------------------------------------------
    console.log('--- 1. Hub Quick-Launch Links to Incident Mode ---');
    const indexPath = `file://${path.join(rootDir, 'index.html').replace(/\\/g, '/')}`;
    await page.goto(indexPath, { waitUntil: 'domcontentloaded' });

    const deckBtn = await page.$('#btn-showcase-cyberdrill-deck');
    assert(deckBtn !== null, 'CyberDrill button present in Hero Quick-Launch Command Deck');

    const showcaseBtn = await page.$('#btn-showcase-cyberdrill');
    assert(showcaseBtn !== null, 'CyberDrill card launch button present in Featured Game Modes');

    const showcaseHref = await showcaseBtn.getAttribute('href');
    assert(showcaseHref.includes('mode=incident'), 'Showcase link targets mode=incident');

    // -------------------------------------------------------------
    // Test 2: Incident Arena Launch & Telemetry HUD Verification
    // -------------------------------------------------------------
    console.log('\n--- 2. Incident Arena Launch & Telemetry HUD Verification ---');
    const gameIncidentUrl = `file://${path.join(rootDir, 'game.html').replace(/\\/g, '/')}?mode=incident&incident=inc_memory_leak&new=true`;
    await page.goto(gameIncidentUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const hudVisible = await page.$eval('#hud-incident-monitor', el => window.getComputedStyle(el).display !== 'none');
    assert(hudVisible, 'CyberDrill Incident Telemetry HUD is displayed');

    const ghostRailHidden = await page.$eval('#hud-ghost-duel-rail', el => window.getComputedStyle(el).display === 'none');
    assert(ghostRailHidden, 'Speed Ghost HUD is hidden during incident response');

    const bossBarHidden = await page.$eval('#hud-boss-battle-bar', el => window.getComputedStyle(el).display === 'none');
    assert(bossBarHidden, 'Boss Battle HUD is hidden during incident response');

    const sevText = await page.$eval('#incident-sev-badge', el => el.textContent.trim());
    assert(sevText.includes('SEV-1'), 'Sev-1 Outage badge rendered on Telemetry HUD');

    const phaseText = await page.$eval('#incident-phase-badge', el => el.textContent.trim());
    assert(phaseText.includes('DIAGNOSIS'), 'Triage begins at Phase 1: Root Cause Diagnosis');

    const cpuText = await page.$eval('#metric-cpu-val', el => el.textContent.trim());
    assert(cpuText.includes('%'), 'CPU Load metric value is streaming');

    const ramText = await page.$eval('#metric-ram-val', el => el.textContent.trim());
    assert(ramText.includes('GB') || ramText.includes('%'), 'RAM usage metric is streaming');

    const errorRateText = await page.$eval('#metric-error-val', el => el.textContent.trim());
    assert(errorRateText.includes('%'), '5xx Error Rate metric is streaming');

    // -------------------------------------------------------------
    // Test 3: Live Cloud Log Streamer & Interactive Filter
    // -------------------------------------------------------------
    console.log('\n--- 3. Live Server Log Streamer & Interactive Filter ---');
    const initialLogCount = await page.$$eval('#incident-log-stream .log-row', rows => rows.length);
    assert(initialLogCount >= 5, `Live log streamer populated with ${initialLogCount} entries`);

    // Filter logs for "OOMKilled"
    await page.fill('#incident-log-search', 'OOMKilled');
    await page.waitForTimeout(200);

    const filteredCount = await page.$$eval('#incident-log-stream .log-row', rows => rows.length);
    assert(filteredCount >= 1 && filteredCount < initialLogCount, 'Log stream filtered successfully to matching rows');

    // Clear filter button
    await page.click('#btn-clear-log-filter');
    await page.waitForTimeout(200);
    const restoredCount = await page.$$eval('#incident-log-stream .log-row', rows => rows.length);
    assert(restoredCount === initialLogCount, 'Clear filter restores full log tail stream');

    // -------------------------------------------------------------
    // Test 4: Scenario Catalog Selector Modal
    // -------------------------------------------------------------
    console.log('\n--- 4. Scenario Catalog Selector Modal ---');
    await page.click('#btn-switch-incident');
    await page.waitForTimeout(300);

    const selectModalVisible = await page.$eval('#modal-incident-select', el => el.classList.contains('is-open') || window.getComputedStyle(el).display !== 'none');
    assert(selectModalVisible, 'Scenario Selector modal opens on button click');

    const scenarioCardsCount = await page.$$eval('#incident-scenario-list .scenario-card', cards => cards.length);
    assert(scenarioCardsCount === 8, 'Scenario Catalog modal renders all 8 production outage incidents');

    await page.click('#btn-close-incident-select');
    await page.waitForTimeout(300);

    // -------------------------------------------------------------
    // Test 5: Full 2-Phase Triage & Stabilization Workflow
    // -------------------------------------------------------------
    console.log('\n--- 5. Full 2-Phase Triage & Stabilization Workflow ---');
    // Phase 1 Diagnosis: Select correct option (_GLOBAL_CACHE unbounded heap leak, index 2)
    await page.click('.option-card[data-index="2"]');
    await page.waitForTimeout(150);
    await page.click('#btn-submit-answer');
    await page.waitForTimeout(400);

    const phase2Text = await page.$eval('#incident-phase-badge', el => el.textContent.trim());
    assert(phase2Text.includes('HOTFIX') || phase2Text.includes('PATCH'), 'Phase advances to Phase 2: Hotfix Patch Deployment');

    // Advance to Question 2 (auto-advance or click next)
    await page.waitForTimeout(2200);

    // Phase 2 Patch: Select correct option (Replace unbounded global list with LRUCache, index 1)
    await page.click('.option-card[data-index="1"]');
    await page.waitForTimeout(150);
    await page.click('#btn-submit-answer');
    
    // Wait for auto-advance (2000ms delay) to complete session and trigger post-mortem modal
    await page.waitForTimeout(2500);

    // -------------------------------------------------------------
    // Test 6: SRE Post-Mortem Incident Report Modal
    // -------------------------------------------------------------
    console.log('\n--- 6. SRE Post-Mortem Incident Report Card ---');

    const pmModalOpen = await page.$eval('#modal-incident-postmortem', el => el.classList.contains('is-open') || window.getComputedStyle(el).display !== 'none');
    assert(pmModalOpen, 'SRE Post-Mortem report card modal is displayed upon stabilization');

    const pmTitle = await page.$eval('#modal-incident-pm-title', el => el.textContent.trim());
    assert(pmTitle.includes('Memory Sink') && pmTitle.includes('Post-Mortem'), 'Post-Mortem title reflects incident scenario');

    const statusBadge = await page.$eval('#incident-pm-status-badge', el => el.textContent.trim());
    assert(statusBadge.includes('SLA'), 'Status badge confirms SLA performance');

    const mttrVal = await page.$eval('#incident-pm-mttr', el => el.textContent.trim());
    assert(mttrVal.endsWith('s'), `MTTR recorded accurately: ${mttrVal}`);

    const costVal = await page.$eval('#incident-pm-cost', el => el.textContent.trim());
    assert(costVal.startsWith('$'), `Downtime cost prevented tracked: ${costVal}`);

    const timelineItems = await page.$$eval('#incident-pm-timeline .timeline-item', items => items.length);
    assert(timelineItems >= 3, `Post-Mortem timeline contains ${timelineItems} resolution milestones`);

    console.log('\n============================================================');
    console.log(`CYBERDRILL PLAYWRIGHT SUITE COMPLETE: ${passedTests}/${totalTests} PASSED`);
    console.log('============================================================\n');

  } catch (err) {
    console.error('Test run failed with error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runIncidentPlaywrightSuite();
