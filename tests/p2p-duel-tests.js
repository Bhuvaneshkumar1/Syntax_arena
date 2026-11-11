/**
 * SyntaxArena P2P & Local 1v1 Duel Engine Test Suite
 * Validates room code generation, deterministic seeded question decks,
 * lead status tracking, score deltas, and match outcome resolution.
 */

import { DuelEngine } from '../js/p2p-duel.js';

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

export function runDuelEngineTests() {
  console.log('\n============================================================');
  console.log('🧪 RUNNING P2P & LOCAL 1V1 DUEL ENGINE TEST SUITE');
  console.log('============================================================\n');

  // --- 1. Room Code & Seed Generation ---
  console.log('--- 1. Room Code & Seed Generation ---');
  const code1 = DuelEngine.generateRoomCode();
  const code2 = DuelEngine.generateRoomCode();
  assert(code1.startsWith('SYN-') && code1.length === 8, 'Room code follows SYN-XXXX format');
  assert(code1 !== code2, 'Subsequent room codes are uniquely generated');

  const seedA = DuelEngine.generateSeed('SYN-TEST');
  const seedB = DuelEngine.generateSeed('SYN-TEST');
  assert(typeof seedA === 'number' && seedA > 0, 'Seed is a positive number');
  assert(seedA === seedB, 'Identical room codes produce identical deterministic seeds');

  // --- 2. Room Creation (Host) ---
  console.log('\n--- 2. Host Room Initialization ---');
  const hostConfig = DuelEngine.createRoom({
    language: 'python',
    difficulty: 'intermediate',
    questionCount: 10,
    profile: { username: 'CyberAce', avatarId: 'cyber_fox' }
  });

  assert(DuelEngine.active === true, 'DuelEngine is active after room creation');
  assert(DuelEngine.isHost === true, 'Player marked as Host');
  assert(DuelEngine.localPlayer.name === 'CyberAce', 'Host username assigned to localPlayer');
  assert(DuelEngine.localPlayer.avatar === 'cyber_fox', 'Host avatar assigned to localPlayer');
  assert(hostConfig.language === 'python', 'Room configured for Python language');
  assert(hostConfig.questionCount === 10, 'Room configured for 10 questions');
  assert(typeof hostConfig.shareUrl === 'string' && hostConfig.shareUrl.includes('mode=duel'), 'Generates valid shareable duel URL');

  // --- 3. Room Joining (Challenger) ---
  console.log('\n--- 3. Challenger Room Joining ---');
  DuelEngine.joinRoom(hostConfig.roomCode, {
    language: 'python',
    difficulty: 'intermediate',
    questionCount: 10,
    profile: { username: 'GlitchRider', avatarId: 'terminal_owl' }
  });

  assert(DuelEngine.active === true, 'DuelEngine is active after joining');
  assert(DuelEngine.isHost === false, 'Player marked as Challenger (not host)');
  assert(DuelEngine.localPlayer.name === 'GlitchRider', 'Challenger username assigned to localPlayer');
  assert(DuelEngine.localPlayer.avatar === 'terminal_owl', 'Challenger avatar assigned to localPlayer');

  // --- 4. Local Split-Screen Arcade Mode ---
  console.log('\n--- 4. Local Same-Keyboard Arcade Mode ---');
  const localConfig = DuelEngine.startLocalSplitMode({
    p1Name: 'Player 1 (Left)',
    p2Name: 'Player 2 (Right)',
    language: 'rust'
  });

  assert(DuelEngine.mode === 'local_split', 'Duel mode is local_split');
  assert(DuelEngine.localPlayer.name === 'Player 1 (Left)', 'Local P1 name configured');
  assert(DuelEngine.opponentPlayer.name === 'Player 2 (Right)', 'Local P2 name configured');
  assert(DuelEngine.opponentPlayer.connected === true, 'P2 automatically marked connected in local mode');

  // --- 5. Deterministic Question Deck Seeding ---
  console.log('\n--- 5. Synchronized Question Deck Retrieval ---');
  const mockCatalog = [
    { id: 'q1', language: 'python', difficulty: 'beginner', prompt: 'Q1' },
    { id: 'q2', language: 'python', difficulty: 'beginner', prompt: 'Q2' },
    { id: 'q3', language: 'python', difficulty: 'beginner', prompt: 'Q3' },
    { id: 'q4', language: 'python', difficulty: 'beginner', prompt: 'Q4' },
    { id: 'q5', language: 'python', difficulty: 'beginner', prompt: 'Q5' }
  ];

  const deck1 = DuelEngine.getSynchronizedQuestionDeck(mockCatalog, 9999, 3, 'python');
  const deck2 = DuelEngine.getSynchronizedQuestionDeck(mockCatalog, 9999, 3, 'python');
  const deckDifferent = DuelEngine.getSynchronizedQuestionDeck(mockCatalog, 1111, 3, 'python');

  assert(deck1.length === 3, 'Deck contains exactly requested 3 questions');
  assert(deck1[0].id === deck2[0].id && deck1[1].id === deck2[1].id && deck1[2].id === deck2[2].id, 'Same seed produces identical question deck order');
  assert(deck1.map(q => q.id).join(',') !== deckDifferent.map(q => q.id).join(','), 'Different seeds produce randomized deck variations');

  // --- 6. Live Progress & Split Lead Delta ---
  console.log('\n--- 6. Progress Tracking & Lead Delta Calculations ---');
  DuelEngine.createRoom({ profile: { username: 'LeadPlayer' } });

  // Initially tied at 0
  let lead = DuelEngine.getLeadStatus();
  assert(lead.status === 'tied', 'Initially tied at 0 points');
  assert(lead.deltaScore === 0, 'Delta score is 0 when tied');

  // Local player answers correctly (+150 pts)
  DuelEngine.recordLocalAnswer({ questionIndex: 0, isCorrect: true, score: 150, streak: 1 });
  lead = DuelEngine.getLeadStatus();
  assert(lead.status === 'lead', 'Local player marked as lead (+150 pts)');
  assert(lead.deltaScore === 150, 'Delta score reflects +150 point lead');
  assert(lead.text === '+150 PTS AHEAD', 'Lead badge text formatted accurately');

  // Opponent answers correctly (+200 pts)
  DuelEngine.opponentPlayer.score = 200;
  DuelEngine.opponentPlayer.currentQuestion = 1;
  lead = DuelEngine.getLeadStatus();
  assert(lead.status === 'behind', 'Local player marked behind after opponent scores higher');
  assert(lead.deltaScore === 50, 'Delta score reflects 50 points behind');
  assert(lead.text === '-50 PTS BEHIND', 'Behind badge text formatted accurately');

  // Local player answers 2 more questions to reach 3-streak
  DuelEngine.recordLocalAnswer({ questionIndex: 1, isCorrect: true, score: 320, streak: 2 });
  DuelEngine.recordLocalAnswer({ questionIndex: 2, isCorrect: true, score: 510, streak: 3 });
  assert(DuelEngine.localPlayer.streak === 3, 'Local player combo streak is 3');
  assert(DuelEngine.localPlayer.highestStreak === 3, 'Highest streak tracked accurately');

  // --- 7. Winner Resolution & Match Summary ---
  console.log('\n--- 7. Match Outcome & Head-to-Head Report Card ---');
  DuelEngine.recordLocalFinish(12500); // Finished in 12.5s with 510 pts
  DuelEngine.opponentPlayer.finished = true;
  DuelEngine.opponentPlayer.score = 300;
  DuelEngine.opponentPlayer.timeSpent = 15000;

  const result = DuelEngine.getMatchResult();
  assert(result.winner === 'p1', 'Player 1 resolved as winner (510 > 300)');
  assert(result.isVictory === true, 'Flagged isVictory = true for Player 1');
  assert(result.isDefeat === false, 'Flagged isDefeat = false');
  assert(result.p1.score === 510, 'P1 final score recorded accurately');
  assert(result.p2.score === 300, 'P2 final score recorded accurately');
  assert(result.p1.timeSpentSec === 13, 'P1 elapsed time rounded to 13s');

  console.log(`\n============================================================`);
  console.log(`DUEL ENGINE TESTS: ${passed} passed, ${failed} failed`);
  console.log(`============================================================\n`);

  if (failed > 0) {
    throw new Error(`DuelEngine unit tests failed with ${failed} failures.`);
  }

  return { passed, failed };
}

// Auto-run if executed directly via Node
if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('p2p-duel-tests.js')) {
  runDuelEngineTests();
}
