/**
 * SyntaxArena Mega-Boss Engine & Encounters Test Suite (Feature 1: The Daemon Incursion)
 * Validates Boss catalog integrity, state machine turns, damage calculation,
 * Phase 2 overclocking, glitch retaliations, and victory reward claims.
 */

import { BossEncounters, BOSS_ENCOUNTERS } from '../data/boss-encounters.js';
import { BossEngine } from '../js/boss-engine.js';
import { Gamification, BOSS_ACHIEVEMENTS } from '../js/gamification.js';
import { Storage } from '../js/storage.js';

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

export function runBossEngineTests() {
  console.log('\n============================================================');
  console.log('🧪 RUNNING MEGA-BOSS ENGINE & ENCOUNTERS TEST SUITE');
  console.log('============================================================\n');

  // --- 1. Boss Encounters Catalog Integrity ---
  console.log('--- 1. Boss Encounters Catalog Integrity ---');
  assert(Array.isArray(BOSS_ENCOUNTERS), 'BOSS_ENCOUNTERS is an array');
  assert(BOSS_ENCOUNTERS.length === 4, 'Contains exactly 4 Mega-Boss adversaries');

  const bossIds = BOSS_ENCOUNTERS.map(b => b.id);
  assert(bossIds.includes('null_leviathan'), 'Catalog contains null_leviathan');
  assert(bossIds.includes('kernel_hydra'), 'Catalog contains kernel_hydra');
  assert(bossIds.includes('overflow_dragon'), 'Catalog contains overflow_dragon');
  assert(bossIds.includes('deadlock_kraken'), 'Catalog contains deadlock_kraken');

  BOSS_ENCOUNTERS.forEach(b => {
    assert(typeof b.name === 'string' && b.name.length > 0, `Boss ${b.id} has valid name`);
    assert(typeof b.maxHp === 'number' && b.maxHp >= 1000, `Boss ${b.id} has at least 1000 HP`);
    assert(typeof b.attackName === 'string', `Boss ${b.id} has signature attack name`);
    assert(b.taunts && typeof b.taunts.intro === 'string', `Boss ${b.id} has intro taunt`);
    assert(b.taunts && typeof b.taunts.phase2 === 'string', `Boss ${b.id} has phase 2 enrage taunt`);
    assert(b.rewards && typeof b.rewards.xp === 'number' && b.rewards.xp >= 500, `Boss ${b.id} grants at least 500 XP bounty`);
    assert(Array.isArray(b.questions) && b.questions.length === 10, `Boss ${b.id} has exactly 10 curated questions`);

    b.questions.forEach((q, idx) => {
      assert(typeof q.id === 'string' && q.id.length > 0, `Question ${idx + 1} of ${b.id} has valid ID: ${q.id}`);
      assert(typeof q.prompt === 'string', `Question ${q.id} has prompt text`);
      assert(Array.isArray(q.options) && q.options.length === 4, `Question ${q.id} has 4 options`);
      assert(typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < 4, `Question ${q.id} has valid correctIndex`);
      assert(typeof q.explanation === 'string' && q.explanation.length > 10, `Question ${q.id} has detailed explanation`);
    });
  });

  // --- 2. Boss Engine Initialization ---
  console.log('\n--- 2. Boss Engine Initialization ---');
  const status1 = BossEngine.initBattle('null_leviathan');
  assert(status1.boss.id === 'null_leviathan', 'Initialized active boss is null_leviathan');
  assert(status1.currentHp === 1000, 'Initial HP is 1000');
  assert(status1.maxHp === 1000, 'Max HP is 1000');
  assert(status1.hpPct === 100, 'Initial HP percentage is 100%');
  assert(status1.phase === 1, 'Initial phase is Phase 1');
  assert(status1.isVictory === false, 'isVictory is initially false');
  assert(status1.isDefeated === false, 'isDefeated is initially false');

  // --- 3. Turn Processing & Damage Calculations ---
  console.log('\n--- 3. Turn Processing & Damage Calculations ---');
  // Correct answer with 15s remaining, 0 streak, intermediate
  const turn1 = BossEngine.processTurn(true, 15, 30, 0, 'intermediate');
  assert(turn1.isPlayerHit === true, 'Player scored a hit on the boss');
  assert(turn1.damage >= 160, `Dealt base damage + speed bonus: ${turn1.damage} HP`);
  assert(turn1.status.currentHp === 1000 - turn1.damage, 'Boss HP reduced by dealt damage');
  assert(turn1.status.hpPct < 100, `Boss HP pct accurately updated: ${turn1.status.hpPct}%`);
  assert(turn1.transitionToPhase2 === false, 'Did not transition to Phase 2 yet (>50% HP)');

  // Consecutive turn with streak multiplier
  const turn2 = BossEngine.processTurn(true, 25, 30, 3, 'expert');
  assert(turn2.damage > turn1.damage, `Expert + Streak + Fast Speed yields greater damage (${turn2.damage} > ${turn1.damage})`);

  // --- 4. Boss Counter-Attack & HP Regeneration on Incorrect Answer ---
  console.log('\n--- 4. Boss Counter-Attack & HP Regeneration on Incorrect Answer ---');
  const prevHp = BossEngine.currentHp;
  const turnMiss = BossEngine.processTurn(false, 0, 30, 0, 'intermediate');
  assert(turnMiss.isPlayerHit === false, 'Player missed on incorrect answer');
  assert(turnMiss.damage === 0, 'Dealt 0 damage to boss on incorrect answer');
  assert(BossEngine.currentHp >= prevHp, 'Boss HP regenerates/heals on player miss');
  assert(typeof turnMiss.taunt === 'string', `Boss responded with taunt: "${turnMiss.taunt}"`);

  // Test consecutive mistakes triggering player wipe / overwhelm
  BossEngine.processTurn(false, 0, 30, 0, 'intermediate');
  const turnWipe = BossEngine.processTurn(false, 0, 30, 0, 'intermediate');
  assert(turnWipe.isPlayerDefeated === true, 'Player marked defeated on 3 consecutive mistakes');
  assert(turnWipe.taunt.includes('DEFEAT') || turnWipe.taunt.includes('PURGED') || turnWipe.taunt.includes('CANNOT'), 'Wipe taunt triggered');

  const counterAttack = BossEngine.triggerBossAttack();
  assert(counterAttack.attackType === 'null_dereference', 'Triggered Null Dereference Void attack');
  assert(typeof counterAttack.attackName === 'string', 'Attack name defined');

  // Clear timeout to avoid hanging node process
  BossEngine.clearActiveGlitch();

  // --- 5. Phase 2 Overclocking Transition ---
  console.log('\n--- 5. Phase 2 Overclocking Transition ---');
  BossEngine.initBattle('kernel_hydra');
  assert(BossEngine.maxHp === 1200, 'Kernel Hydra Max HP is 1200');
  // Force HP to 601 (just above 50%)
  BossEngine.currentHp = 601;
  assert(BossEngine.phase === 1, 'Still in Phase 1 at 601 HP (50.08%)');
  // Deal damage -> 500 HP (<= 50%)
  BossEngine.currentHp = 500;
  const turnEnrage = BossEngine.processTurn(true, 10, 30, 0, 'intermediate');
  assert(BossEngine.phase === 2, 'Boss transitioned into Phase 2');
  assert(turnEnrage.transitionToPhase2 === true, 'Turn flagged transitionToPhase2 = true');
  assert(turnEnrage.taunt.includes('INTERRUPT') || turnEnrage.taunt.includes('OVERFLOW') || turnEnrage.taunt.includes('OVERCLOCK'), 'Phase 2 taunt triggered');

  // --- 6. Boss Defeat & Victory Rewards ---
  console.log('\n--- 6. Boss Defeat & Victory Rewards ---');
  BossEngine.initBattle('overflow_dragon');
  assert(BossEngine.maxHp === 1100, 'Buffer Overflow Dragon Max HP is 1100');
  // Reduce HP to 10
  BossEngine.currentHp = 10;
  const turnLethal = BossEngine.processTurn(true, 10, 30, 0, 'expert');
  assert(BossEngine.currentHp === 0, 'Boss HP drops to 0 on lethal blow');
  assert(BossEngine.isVictory === true, 'BossEngine flags isVictory = true');
  assert(BossEngine.isDefeated === true, 'BossEngine flags isDefeated = true');
  assert(turnLethal.status.isVictory === true, 'Turn status confirms victory');

  // Claim Victory Rewards
  const mockProfile = {
    id: 'test-hacker-1',
    username: 'CodeSlayer',
    xp: 1000,
    totalPoints: 1000,
    badges: [],
    defeatedBosses: []
  };

  const rewardSummary = BossEngine.claimVictoryRewards(mockProfile);
  assert(rewardSummary.xpAwarded === 550, 'Dragon victory awards +550 XP');
  assert(rewardSummary.badgeId === 'badge_boss_dragon', 'Awards Dragon Tamer/Stack Guardian badge');
  assert(mockProfile.xp === 1550, 'Profile XP increased to 1550');
  assert(mockProfile.badges.includes('badge_boss_dragon'), 'Profile badges now includes badge_boss_dragon');
  assert(mockProfile.defeatedBosses.includes('overflow_dragon'), 'Profile defeatedBosses tracks overflow_dragon');

  // Verify Gamification Boss Slayer Badges
  console.log('\n--- 7. Gamification Boss Slayer Badges Integration ---');
  assert(Array.isArray(BOSS_ACHIEVEMENTS) && BOSS_ACHIEVEMENTS.length === 4, 'BOSS_ACHIEVEMENTS defines 4 slayer badges');
  const bLeviathan = Gamification.getBadge('badge_boss_leviathan');
  assert(bLeviathan && bLeviathan.name === 'Void Breaker', 'Gamification resolves Void Breaker badge');
  const bHydra = Gamification.getBadge('badge_boss_hydra');
  assert(bHydra && bHydra.name === 'Kernel Crusher', 'Gamification resolves Kernel Crusher badge');
  const bDragon = Gamification.getBadge('badge_boss_dragon');
  assert(bDragon && bDragon.name === 'Stack Guardian', 'Gamification resolves Stack Guardian badge');
  const bKraken = Gamification.getBadge('badge_boss_kraken');
  assert(bKraken && bKraken.name === 'Deadlock Dissolver', 'Gamification resolves Deadlock Dissolver badge');

  console.log('\n============================================================');
  console.log(`MEGA-BOSS TEST RESULTS: ${passed} passed, ${failed} failed`);
  console.log('============================================================\n');

  if (failed > 0) {
    throw new Error(`${failed} Boss Engine tests failed.`);
  }

  return { passed, failed };
}

// Auto-run if executed directly via Node
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runBossEngineTests();
}
