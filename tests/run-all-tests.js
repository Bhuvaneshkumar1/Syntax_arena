/**
 * SyntaxArena Unified Test Runner
 * Executes Question Bank, Answer Checker, Game Engine, and Gameplay UI test suites sequentially.
 */

import { runQuestionBankTests } from './question-bank-tests.js';
import { runAnswerCheckerTests } from './answer-checker-tests.js';
import { runGameEngineTests } from './game-engine-tests.js';
import { runGameplayUITests } from './gameplay-ui-tests.js';
import { runGamificationTests } from './gamification-tests.js';
import { runAnalyticsTests } from './analytics-tests.js';
import { runInteractiveAudioTests } from './interactive-audio-tests.js';
import { runReliabilityTests } from './reliability-tests.js';
import { runBossEngineTests } from './boss-engine-tests.js';
import { runDuelEngineTests } from './p2p-duel-tests.js';
import { runIncidentEngineTests } from './incident-engine-tests.js';
import { runBattlestationTests } from './battlestation-tests.js';
import { runMemoryMinigameTests } from './memory-minigame-tests.js';
import { runTrophyVaultTests } from './trophy-vault-tests.js';

async function runAll() {
  console.log('============================================================');
  console.log('🚀 SYNTAXARENA — MASTER INTEGRATION TEST SUITE');
  console.log('============================================================');

  const qb = await runQuestionBankTests();
  const ac = await runAnswerCheckerTests();
  const ge = await runGameEngineTests();
  const ui = await runGameplayUITests();
  const gm = await runGamificationTests();
  const an = await runAnalyticsTests();
  const ia = await runInteractiveAudioTests();
  const rel = await runReliabilityTests();
  const boss = await runBossEngineTests();
  const duel = await runDuelEngineTests();
  const inc = await runIncidentEngineTests();
  const bs = await runBattlestationTests();
  const mem = await runMemoryMinigameTests();
  const tv = await runTrophyVaultTests();

  const total = qb.passed + qb.failed + ac.passed + ac.failed + ge.passed + ge.failed + ui.passed + ui.failed + gm.passed + gm.failed + an.passed + an.failed + ia.passed + ia.failed + rel.passed + rel.failed + boss.passed + boss.failed + duel.passed + duel.failed + inc.passed + inc.failed + bs.passed + bs.failed + mem.passed + mem.failed + tv.passed + tv.failed;
  const passed = qb.passed + ac.passed + ge.passed + ui.passed + gm.passed + an.passed + ia.passed + rel.passed + boss.passed + duel.passed + inc.passed + bs.passed + mem.passed + tv.passed;
  const failed = qb.failed + ac.failed + ge.failed + ui.failed + gm.failed + an.failed + ia.failed + rel.failed + boss.failed + duel.failed + inc.failed + bs.failed + mem.failed + tv.failed;

  console.log('============================================================');
  console.log('🏁 SUITE EXECUTION SUMMARY');
  console.log('============================================================');
  console.log(`Question Bank Tests:     ${qb.passed}/${qb.passed + qb.failed} passed`);
  console.log(`Answer Checker Tests:    ${ac.passed}/${ac.passed + ac.failed} passed`);
  console.log(`Game Engine Tests:       ${ge.passed}/${ge.passed + ge.failed} passed`);
  console.log(`Gameplay UI Tests:       ${ui.passed}/${ui.passed + ui.failed} passed`);
  console.log(`Gamification Tests:      ${gm.passed}/${gm.passed + gm.failed} passed`);
  console.log(`Analytics Tests:         ${an.passed}/${an.passed + an.failed} passed`);
  console.log(`Interactive Audio Tests: ${ia.passed}/${ia.passed + ia.failed} passed`);
  console.log(`Reliability Tests:       ${rel.passed}/${rel.passed + rel.failed} passed`);
  console.log(`Mega-Boss Battles Tests: ${boss.passed}/${boss.passed + boss.failed} passed`);
  console.log(`1v1 Duel Engine Tests:   ${duel.passed}/${duel.passed + duel.failed} passed`);
  console.log(`CyberDrill Engine Tests: ${inc.passed}/${inc.passed + inc.failed} passed`);
  console.log(`Battlestation Tests:     ${bs.passed}/${bs.passed + bs.failed} passed`);
  console.log(`Memory Minigames Tests:  ${mem.passed}/${mem.passed + mem.failed} passed`);
  console.log(`3D Trophy Vault Tests:   ${tv.passed}/${tv.passed + tv.failed} passed`);
  console.log('------------------------------------------------------------');
  console.log(`TOTAL TESTS:             ${total}`);
  console.log(`PASSED:                  ${passed}`);
  console.log(`FAILED:                  ${failed}`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAll();
