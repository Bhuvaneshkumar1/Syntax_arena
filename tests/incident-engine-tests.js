/**
 * SyntaxArena CyberDrill: Incident Response Engine Unit Test Suite
 * Validates scenario inventory, telemetry computation, log filtering,
 * diagnostic triage, hotfix validation, MTTR tracking, and post-mortem reporting.
 */

import { IncidentEngine, INCIDENT_STATES } from '../js/incident-engine.js';
import { IncidentScenarios } from '../data/incident-scenarios.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

export function runIncidentEngineTests() {
  console.log('\n============================================================');
  console.log('🧪 RUNNING CYBERDRILL INCIDENT RESPONSE ENGINE TEST SUITE');
  console.log('============================================================\n');

  // --- 1. Incident Scenario Inventory ---
  console.log('--- 1. Incident Scenario Inventory ---');
  const allScenarios = IncidentScenarios.getAll();
  assert(allScenarios.length >= 20, 'Master catalog contains at least 20 incident scenarios (Item 19)');

  const memOutage = IncidentScenarios.getById('inc_memory_leak');
  assert(memOutage !== null && memOutage.severity === 'SEV-1', 'Loaded Memory Sink Outage (SEV-1)');
  assert(memOutage.language === 'python', 'Memory Sink Outage is in Python track');

  const deadlockOutage = IncidentScenarios.getById('inc_mutex_deadlock');
  assert(deadlockOutage !== null && deadlockOutage.language === 'go', 'Loaded Mutex Deadlock Outage (Go track)');

  const defaultInc = IncidentScenarios.getDefaultIncident();
  assert(defaultInc !== null && defaultInc.id === 'inc_memory_leak', 'Default incident resolves to Memory Leak');

  // --- 2. Incident Start & Initial Telemetry ---
  console.log('\n--- 2. Incident Initialization & Baseline Telemetry ---');
  const snapshot = IncidentEngine.startIncident('inc_memory_leak');
  assert(IncidentEngine.state === INCIDENT_STATES.ACTIVE, 'Engine transitions to ACTIVE state');
  assert(IncidentEngine.phase === 1, 'Incident begins at Phase 1 (Diagnosis)');
  assert(IncidentEngine.slaLimitSeconds === 180, 'Incident SLA target is 180 seconds (3 minutes)');

  const initialTele = IncidentEngine.computeTelemetry();
  assert(initialTele.cpu > 90, 'Initial CPU telemetry reflects critical load (> 90%)');
  assert(initialTele.ram > 90, 'Initial RAM telemetry reflects memory pressure (> 90%)');
  assert(initialTele.errorRate > 80, 'Initial Error Rate is elevated (> 80%)');

  // --- 3. Log Streamer & Filtering ---
  console.log('\n--- 3. Server Log Streamer & Filtering ---');
  const allLogs = IncidentEngine.filterLogs();
  assert(allLogs.length >= 6, 'Log streamer contains at least 6 server log entries');

  const oomLogs = IncidentEngine.filterLogs('OOMKilled');
  assert(oomLogs.length >= 1, 'Log filter successfully locates OOMKilled log entry');

  const caseInsensitiveLogs = IncidentEngine.filterLogs('traceback');
  assert(caseInsensitiveLogs.length >= 1, 'Log filter is case-insensitive');

  // --- 4. Diagnostic Triage (Phase 1) ---
  console.log('\n--- 4. Diagnostic Triage (Phase 1) ---');
  const wrongDiag = IncidentEngine.submitDiagnosis(0); // Incorrect: Connection pool
  assert(wrongDiag.isCorrect === false, 'Incorrect root cause diagnosis rejected');
  assert(IncidentEngine.phase === 1, 'Phase remains at 1 on incorrect diagnosis');

  const correctDiag = IncidentEngine.submitDiagnosis(2); // Correct: _GLOBAL_CACHE leak
  assert(correctDiag.isCorrect === true, 'Correct root cause diagnosis verified');
  assert(IncidentEngine.phase === 2, 'Phase advances to 2 (Patch Deployment)');
  assert(correctDiag.explanation.includes('GLOBAL_CACHE'), 'Diagnosis explanation returned');

  // --- 5. Hotfix Patch Deployment (Phase 2) ---
  console.log('\n--- 5. Hotfix Patch Deployment (Phase 2) ---');
  const wrongPatch = IncidentEngine.submitPatch(0); // Incorrect: Silently pass on MemoryError
  assert(wrongPatch.isCorrect === false, 'Ineffective hotfix patch rejected');
  assert(IncidentEngine.state === INCIDENT_STATES.ACTIVE, 'State remains active before correct patch');

  const correctPatch = IncidentEngine.submitPatch(1); // Correct: LRUCache bounded buffer
  assert(correctPatch.isCorrect === true, 'Correct hotfix patch verified');
  assert(IncidentEngine.state === INCIDENT_STATES.STABILIZED, 'Incident transitions to STABILIZED state');
  assert(IncidentEngine.phase === 3, 'Phase advances to 3 (Post-Mortem)');
  assert(correctPatch.isResolved === true, 'Patch response flags isResolved = true');

  // --- 6. Stabilized Telemetry Descent ---
  console.log('\n--- 6. Telemetry Stabilization ---');
  // Simulate telemetry steps decaying to nominal levels
  for (let i = 0; i < 20; i++) {
    IncidentEngine.computeTelemetry();
  }
  const stabilizedTele = IncidentEngine.computeTelemetry();
  assert(stabilizedTele.cpu < 50, 'Stabilized CPU decayed significantly below alert threshold');
  assert(stabilizedTele.errorRate < 10, 'Stabilized Error Rate decayed near zero');

  // --- 7. MTTR & SRE Post-Mortem Report Card ---
  console.log('\n--- 7. MTTR Tracking & SRE Post-Mortem ---');
  const postMortem = IncidentEngine.getPostMortem();
  assert(postMortem !== null, 'Post-mortem object generated successfully');
  assert(postMortem.isResolved === true, 'Post-mortem confirms outage resolved');
  assert(postMortem.isSlaMet === true, 'Post-mortem tracks SLA compliance');
  assert(postMortem.score >= 300, 'Awards Incident Commander XP bounty (>= 300 pts)');
  assert(postMortem.diamondsAwarded >= 5, 'Awards at least 5 diamonds on resolution (Item 18)');
  assert(postMortem.preventedCostUSD > 10000, 'Calculates downtime cost prevented ($USD)');
  assert(Array.isArray(postMortem.timeline) && postMortem.timeline.length === 3, 'Post-mortem includes 3 incident timeline checkpoints');

  const mdReport = IncidentEngine.generateMarkdownReport();
  assert(typeof mdReport === 'string' && mdReport.includes('SRE Incident Post-Mortem'), 'Markdown report card generated for clipboard sharing');
  assert(mdReport.includes('img.shields.io'), 'Markdown report contains embeddable GitHub shields.io badges (Item 20)');
  assert(mdReport.includes('Root Cause Analysis'), 'Markdown report contains Root Cause Analysis');

  console.log(`\n============================================================`);
  console.log(`CYBERDRILL ENGINE TESTS: ${passed} passed, ${failed} failed`);
  console.log(`============================================================\n`);

  if (failed > 0) {
    throw new Error(`IncidentEngine unit tests failed with ${failed} failures.`);
  }

  return { passed, failed };
}

// Auto-run if executed directly via Node
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('incident-engine-tests.js')) {
  runIncidentEngineTests();
}

