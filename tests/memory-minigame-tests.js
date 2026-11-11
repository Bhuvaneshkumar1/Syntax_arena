/**
 * SyntaxArena Feature 8: Tactile Memory Pointer Minigames Unit Test Suite
 * Validates:
 * 1. Catalog integrity for Cable Connect, Leak Patrol, and Dereference Rush
 * 2. Cable connection topology, port handling, and wiring verification
 * 3. Mark-and-sweep reachability solver & orphan leak identification
 * 4. Use-after-free detection & memory deallocation
 * 5. Dereference rush hazard triage, scoring, and streak multipliers
 */

import { MemoryMinigameEngine } from '../js/memory-minigame.js';
import { CABLE_CONNECT_LEVELS, LEAK_PATROL_LEVELS, DEREFERENCE_RUSH_CHALLENGES } from '../data/memory-levels.js';

export async function runMemoryMinigameTests() {
  console.log('\n============================================================');
  console.log('🧠 RUNNING TACTILE MEMORY MINIGAME ENGINE TEST SUITE');
  console.log('============================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // --- 1. Catalog Integrity & Quotas ---
    console.log('\n--- 1. Catalog Integrity & Quotas ---');
    assert(Array.isArray(CABLE_CONNECT_LEVELS) && CABLE_CONNECT_LEVELS.length >= 6, 'Cable Connect levels array contains >= 6 levels');
    assert(Array.isArray(LEAK_PATROL_LEVELS) && LEAK_PATROL_LEVELS.length >= 5, 'Leak Patrol levels array contains >= 5 levels');
    assert(Array.isArray(DEREFERENCE_RUSH_CHALLENGES) && DEREFERENCE_RUSH_CHALLENGES.length >= 15, 'Dereference Rush challenges contain >= 15 items');

    CABLE_CONNECT_LEVELS.forEach((lvl, i) => {
      assert(lvl.id && lvl.title && lvl.codeSnippet && Array.isArray(lvl.requiredConnections), `Cable level #${i+1} (${lvl.id}) has valid schema`);
    });

    LEAK_PATROL_LEVELS.forEach((lvl, i) => {
      assert(lvl.id && lvl.title && Array.isArray(lvl.heapBlocks) && Array.isArray(lvl.orphansToReclaim), `Leak level #${i+1} (${lvl.id}) has valid schema`);
    });

    DEREFERENCE_RUSH_CHALLENGES.forEach((ch, i) => {
      assert(ch.id && ch.code && ch.category && ch.explanation, `Rush challenge #${i+1} (${ch.id}) has valid category & explanation`);
    });

    // --- 2. Engine Initialization & Mode Switching ---
    console.log('\n--- 2. Engine Initialization & Mode Switching ---');
    const engine = new MemoryMinigameEngine();
    assert(engine.activeMode === 'cable_connect', 'Default active mode is cable_connect');
    assert(engine.currentLevelIndex === 0, 'Initial level index is 0');
    assert(engine.score === 0, 'Initial score is 0');

    engine.setMode('leak_patrol');
    assert(engine.activeMode === 'leak_patrol', 'Mode switches to leak_patrol');
    assert(engine.currentLevelIndex === 0, 'Level index resets to 0 upon mode switch');

    engine.setMode('dereference_rush');
    assert(engine.activeMode === 'dereference_rush', 'Mode switches to dereference_rush');
    assert(engine.rushIndex === 0, 'Rush index initialized to 0');
    engine._stopRushTimer();

    // --- 3. Cable Connect Wiring Logic ---
    console.log('\n--- 3. Cable Connect Wiring Logic ---');
    engine.setMode('cable_connect');
    const lvl1 = engine.loadCableLevel(0);
    assert(lvl1.id === 'cc_01_single_ptr', 'Loaded level 1 (Direct Integer Pointer)');

    // Add valid connection
    const added = engine.addConnection('stk_ptr', 'hp_val42');
    assert(added === true, 'Successfully added connection stk_ptr -> hp_val42');
    assert(engine.userConnections.length === 1, 'Connection recorded in userConnections');

    // Duplicate prevention
    const dup = engine.addConnection('stk_ptr', 'hp_val42');
    assert(dup === false, 'Duplicate connection rejected');

    // Validate correct wiring
    const valResult = engine.validateCableWiring();
    assert(valResult.valid === true, 'Cable wiring validated as 100% correct');
    assert(valResult.scoreAwarded > 0, 'Score awarded for level completion');
    assert(engine.streak === 1, 'Streak incremented to 1');

    // Test incorrect wiring
    engine.loadCableLevel(0);
    engine.addConnection('stk_ptr', 'hp_decoy'); // Wrong target
    const invalidResult = engine.validateCableWiring();
    assert(invalidResult.valid === false, 'Erroneous connection flagged as invalid');
    assert(invalidResult.incorrect === 1, 'Detected 1 incorrect route');
    assert(engine.streak === 0, 'Streak reset on incorrect validation');

    // Remove connection
    const removed = engine.removeConnection('stk_ptr', 'hp_decoy');
    assert(removed === true, 'Successfully removed connection');
    assert(engine.userConnections.length === 0, 'userConnections array is empty');

    // --- 4. Leak Patrol Reachability & Deallocation ---
    console.log('\n--- 4. Leak Patrol Reachability & Deallocation ---');
    engine.setMode('leak_patrol');
    const leakLvl1 = engine.loadLeakLevel(0);
    assert(leakLvl1.id === 'lp_01_reassign_leak', 'Loaded leak level 1');
    assert(engine.currentHeapBytes === 384, 'Initial heap bytes set to 384B');

    // Check mark-and-sweep results on level 1
    const orphaned = leakLvl1.heapBlocks.find(b => b.id === 'hp_buf_leaked');
    const active = leakLvl1.heapBlocks.find(b => b.id === 'hp_buf_new');
    assert(orphaned && orphaned.isOrphaned === true, 'Mark-and-sweep correctly identified hp_buf_leaked as orphaned');
    assert(active && active.isOrphaned === false, 'Mark-and-sweep correctly identified hp_buf_new as reachable');

    // Test Use-After-Free penalty
    const uafResult = engine.attemptReclaimBlock('hp_buf_new');
    assert(uafResult.success === false && uafResult.useAfterFree === true, 'Freeing active block triggered Use-After-Free alert');
    assert(engine.uafCount === 1, 'UAF counter incremented');
    assert(engine.streak === 0, 'Streak reset after UAF error');

    // Test Safe Reclamation
    const reclaimResult = engine.attemptReclaimBlock('hp_buf_leaked');
    assert(reclaimResult.success === true, 'Reclaiming orphaned block succeeded');
    assert(reclaimResult.bytesReclaimed === 128, '128 bytes reclaimed');
    assert(engine.currentHeapBytes === 256, 'Heap bytes decremented to 256B');
    assert(reclaimResult.levelComplete === true, 'Level flagged complete after reclaiming all target orphans');

    // Test Cyclic Island Reachability (Level 3 or 4)
    const cyclicLvl = engine.loadLeakLevel(3);
    assert(cyclicLvl.id === 'lp_04_cyclic_island', 'Loaded cyclic reference island level');
    const peerA = cyclicLvl.heapBlocks.find(b => b.id === 'hp_peer_a');
    const peerB = cyclicLvl.heapBlocks.find(b => b.id === 'hp_peer_b');
    const liveSession = cyclicLvl.heapBlocks.find(b => b.id === 'hp_live_session');
    assert(peerA.isOrphaned === true && peerB.isOrphaned === true, 'Cyclic island with severed root is detected as orphaned');
    assert(liveSession.isOrphaned === false, 'Live session with root stack pointer is reachable');

    // --- 5. Dereference Rush Speed Triage ---
    console.log('\n--- 5. Dereference Rush Speed Triage ---');
    engine.setMode('dereference_rush');
    engine._stopRushTimer();

    const ch0 = engine.rushChallenges[0]; // int *ptr = NULL; *ptr = 42; -> null_dereference
    assert(ch0.category === 'null_dereference', 'First rush challenge is null dereference');

    // Submit correct answer
    const rushCorrect = engine.submitRushAnswer('null_dereference');
    assert(rushCorrect.isCorrect === true, 'Correct category recognized');
    assert(rushCorrect.scoreAwarded > 0, 'Awarded points for fast defusal');
    assert(engine.rushStats.correct === 1, 'Stats correct count is 1');
    assert(engine.streak === 1, 'Streak incremented');
    engine._stopRushTimer();

    // Submit incorrect answer that causes segfault
    // Next challenge is ch1: int val=100; int *p=&val; *p=200; (safe_dereference)
    // If player incorrectly chooses 'null_dereference':
    const rushWrong = engine.submitRushAnswer('null_dereference');
    assert(rushWrong.isCorrect === false, 'Incorrect category flagged');
    assert(engine.rushStats.wrong === 1, 'Stats wrong count is 1');
    assert(engine.streak === 0, 'Streak reset on blunder');
    engine._stopRushTimer();

    // --- 6. Independent Mode Scoring & Multi-Connection Topologies ---
    console.log('\n--- 6. Independent Mode Scoring & Multi-Connection Topologies ---');
    const isolatedEngine = new MemoryMinigameEngine();
    
    // Play cable connect
    isolatedEngine.setMode('cable_connect');
    isolatedEngine.loadCableLevel(0);
    isolatedEngine.addConnection('stk_ptr', 'hp_val42');
    isolatedEngine.validateCableWiring();
    const cableScore = isolatedEngine.score;
    assert(cableScore > 0, `Cable connect earned ${cableScore} points`);
    assert(isolatedEngine.modeScores.cable_connect === cableScore, 'Cable modeScore matches isolated score');

    // Switch to leak patrol and score
    isolatedEngine.setMode('leak_patrol');
    assert(isolatedEngine.score === 0, 'Leak patrol score starts at 0 (NOT mixed with cable connect)');
    isolatedEngine.loadLeakLevel(0);
    isolatedEngine.attemptReclaimBlock('hp_buf_leaked');
    const leakScore = isolatedEngine.score;
    assert(leakScore > 0, `Leak patrol earned ${leakScore} points`);
    assert(isolatedEngine.modeScores.leak_patrol === leakScore, 'Leak modeScore matches isolated score');
    assert(isolatedEngine.modeScores.cable_connect === cableScore, 'Cable connect score remained intact and isolated');

    // Switch to dereference rush and score
    isolatedEngine.setMode('dereference_rush');
    isolatedEngine._stopRushTimer();
    assert(isolatedEngine.score === 0, 'Dereference rush score starts at 0 (NOT mixed with previous games)');
    isolatedEngine.submitRushAnswer('null_dereference');
    const rushScore = isolatedEngine.score;
    assert(rushScore > 0, `Dereference rush earned ${rushScore} points`);
    assert(isolatedEngine.modeScores.dereference_rush === rushScore, 'Rush modeScore matches isolated score');

    // Check Total Lab XP
    const expectedTotal = cableScore + leakScore + rushScore;
    assert(isolatedEngine.totalScore === expectedTotal, `Total Lab XP (${isolatedEngine.totalScore}) equals sum of all three isolated scores (${expectedTotal})`);

    // Verify multi-branching in Level 5 (String Array char**)
    isolatedEngine.setMode('cable_connect');
    const lvl5 = isolatedEngine.loadCableLevel(4); // cc_05_string_array
    assert(lvl5.id === 'cc_05_string_array', 'Loaded Level 5 (char** String Array)');
    // Connect stk_tokens -> hp_tokens_arr
    const conn1 = isolatedEngine.addConnection('stk_tokens', 'hp_tokens_arr');
    // Connect hp_tokens_arr -> hp_str_get
    const conn2 = isolatedEngine.addConnection('hp_tokens_arr', 'hp_str_get');
    // Connect hp_tokens_arr -> hp_str_api (multi-branch from same node)
    const conn3 = isolatedEngine.addConnection('hp_tokens_arr', 'hp_str_api');
    assert(conn1 && conn2 && conn3, 'All 3 multi-card connections added successfully');
    assert(isolatedEngine.userConnections.length === 3, 'userConnections contains all 3 links without dropping prior links');
    const multiVal = isolatedEngine.validateCableWiring();
    assert(multiVal.valid === true, 'Level 5 multi-branching cable network validated successfully');
    isolatedEngine._stopRushTimer();

  } catch (err) {
    console.error('Test runner fatal error:', err);
    failed++;
  }

  console.log('============================================================');
  console.log(`TACTILE MEMORY MINIGAME SUITE: ${passed} passed, ${failed} failed`);
  console.log('============================================================\n');

  return { passed, failed };
}

// Direct execution in Node CLI
if (typeof process !== 'undefined' && process.argv[1]?.includes('memory-minigame-tests.js')) {
  runMemoryMinigameTests().then(res => {
    if (res.failed > 0) process.exit(1);
  });
}

