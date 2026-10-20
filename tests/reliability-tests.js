/**
 * SyntaxArena Batch 9 Unit Test Suite
 * Persistence, Storage Degradation, Corrupted Recovery, Migration, Session Snapshot,
 * and Parameter Resilience Tests.
 * Run via: node tests/reliability-tests.js
 */

import assert from 'assert';
import { Storage, createDefaultStorageSchema, createDefaultProfile, CURRENT_SCHEMA_VERSION, STORAGE_KEY, CORRUPTED_BACKUP_KEY } from '../js/storage.js';
import { Gamification } from '../js/gamification.js';
import { QuestionBank } from '../js/question-bank.js';
import { GameEngine } from '../js/game-engine.js';

// Setup minimal localStorage mock for Node.js environment
class LocalStorageMock {
  constructor() {
    this.store = {};
    this.throwOnSet = false;
    this.throwErrorType = 'QuotaExceededError';
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    if (this.throwOnSet) {
      const err = new Error('The quota has been exceeded.');
      err.name = this.throwErrorType;
      throw err;
    }
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const mockStorage = new LocalStorageMock();
if (typeof globalThis.window === 'undefined') {
  globalThis.window = { localStorage: mockStorage };
} else if (!globalThis.window.localStorage) {
  globalThis.window.localStorage = mockStorage;
}
Storage.isAvailable = true;

export async function runReliabilityTests() {
  console.log('\n============================================================');
  console.log('🧪 RUNNING BATCH 9: PERSISTENCE & RELIABILITY TEST SUITE');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  function test(desc, fn) {
    try {
      fn();
      console.log(`  ✓ PASS: ${desc}`);
      passed++;
    } catch (err) {
      console.error(`  ✕ FAIL: ${desc}`);
      console.error(`    ${err.message}`);
      failed++;
    }
  }

  // --- 1. Storage Schema & Default State ---
  console.log('--- 1. Storage Schema & Default State ---');
  test('createDefaultStorageSchema produces valid v1 schema', () => {
    const schema = createDefaultStorageSchema();
    assert.strictEqual(schema.version, CURRENT_SCHEMA_VERSION, 'Schema version must be 1');
    assert(Array.isArray(schema.profiles) && schema.profiles.length > 0, 'Must contain profiles array');
    assert.strictEqual(typeof schema.activeProfileId, 'string', 'Must have activeProfileId');
    assert(schema.settings && typeof schema.settings === 'object', 'Must have settings object');
  });

  test('createDefaultProfile produces complete profile properties', () => {
    const prof = createDefaultProfile('prof-test', 'TestPilot');
    assert.strictEqual(prof.id, 'prof-test');
    assert.strictEqual(prof.username, 'TestPilot');
    assert.strictEqual(prof.level, 1);
    assert.strictEqual(prof.xp, 0);
    assert(Array.isArray(prof.sessionHistory), 'sessionHistory must be an array');
    assert(Array.isArray(prof.missedQuestionIds), 'missedQuestionIds must be an array');
    assert(Array.isArray(prof.processedSessionIds), 'processedSessionIds must be an array');
    assert(prof.campaign && prof.campaign.python, 'campaign must include python track');
  });

  // --- 2. Deep Schema Migration ---
  console.log('\n--- 2. Deep Schema Migration ---');
  test('Migrates older schema lacking version tag to CURRENT_SCHEMA_VERSION', () => {
    const oldV0Data = {
      activeProfileId: 'prof-v0-user',
      profiles: [
        {
          id: 'prof-v0-user',
          username: 'VeteranCoder',
          level: 4,
          xp: 1500,
          stats: { gamesPlayed: 10, questionsAttempted: 100, questionsCorrect: 85 }
          // Missing: sessionHistory, missedQuestionIds, processedSessionIds, campaign
        }
      ],
      settings: { theme: 'light' }
    };

    const migrated = Storage._migrate(oldV0Data);
    assert.strictEqual(migrated.version, CURRENT_SCHEMA_VERSION, 'Migrated version must be v1');
    assert.strictEqual(migrated.profiles[0].username, 'VeteranCoder');
    assert.strictEqual(migrated.profiles[0].xp, 1500, 'Existing user XP must be preserved');
    assert.strictEqual(migrated.profiles[0].level, 4, 'Existing user level must be preserved');
    assert(Array.isArray(migrated.profiles[0].sessionHistory), 'sessionHistory must be backfilled');
    assert(Array.isArray(migrated.profiles[0].missedQuestionIds), 'missedQuestionIds must be backfilled');
    assert(Array.isArray(migrated.profiles[0].processedSessionIds), 'processedSessionIds must be backfilled');
    assert(migrated.profiles[0].campaign && migrated.profiles[0].campaign.python, 'campaign must be backfilled');
    assert.strictEqual(migrated.settings.theme, 'light', 'Existing settings preserved');
  });

  test('Migration is idempotent when executed multiple times', () => {
    const input = {
      version: 0,
      activeProfileId: 'prof-idem',
      profiles: [{ id: 'prof-idem', username: 'IdemUser', xp: 300 }]
    };
    const firstPass = Storage._migrate(input);
    const secondPass = Storage._migrate(firstPass);
    assert.strictEqual(firstPass.version, secondPass.version);
    assert.strictEqual(firstPass.profiles[0].xp, secondPass.profiles[0].xp);
    assert.strictEqual(firstPass.profiles[0].username, secondPass.profiles[0].username);
  });

  // --- 3. Corrupted Storage Salvage vs Total Failure ---
  console.log('\n--- 3. Corrupted Storage Salvage vs Total Failure ---');
  test('Salvages valid player profiles when top-level schema is damaged', () => {
    mockStorage.clear();
    const rawCorrupt = JSON.stringify({
      version: 'invalid_number', // Schema error!
      activeProfileId: 'prof-salvage',
      profiles: [
        {
          id: 'prof-salvage',
          username: 'SurvivorCode',
          xp: 4500,
          level: 6,
          stats: { gamesPlayed: 30, questionsCorrect: 250 }
        }
      ],
      settings: { theme: 'amber' }
    });

    let recoveryEvent = null;
    const unsub = Storage.onRecovery(info => { recoveryEvent = info; });

    const salvaged = Storage._salvageCorrupted(JSON.parse(rawCorrupt), rawCorrupt);
    unsub();

    assert.strictEqual(salvaged.version, CURRENT_SCHEMA_VERSION);
    assert.strictEqual(salvaged.profiles.length, 1);
    assert.strictEqual(salvaged.profiles[0].username, 'SurvivorCode');
    assert.strictEqual(salvaged.profiles[0].xp, 4500, 'Salvaged XP must be preserved intact');
    assert.strictEqual(salvaged.profiles[0].level, 6, 'Salvaged Level must be preserved intact');
    assert.strictEqual(mockStorage.getItem(CORRUPTED_BACKUP_KEY), rawCorrupt, 'Raw corrupted data must be quarantined');
    assert(recoveryEvent !== null, 'Recovery notification must fire');
    assert.strictEqual(recoveryEvent.salvagedProfiles, 1);
  });

  test('Falls back to clean default schema on completely unparseable data', () => {
    mockStorage.clear();
    mockStorage.setItem(STORAGE_KEY, '<<< NOT JSON AT ALL >>>');

    let recoveryEvent = null;
    const unsub = Storage.onRecovery(info => { recoveryEvent = info; });

    const loaded = Storage.load();
    unsub();

    assert.strictEqual(loaded.version, CURRENT_SCHEMA_VERSION);
    assert.strictEqual(loaded.profiles.length, 1);
    assert.strictEqual(loaded.profiles[0].xp, 0, 'Cannot invent XP for unparseable data');
    assert.strictEqual(mockStorage.getItem(CORRUPTED_BACKUP_KEY), '<<< NOT JSON AT ALL >>>', 'Unparseable raw string quarantined');
  });

  // --- 4. Storage Write Failure & Degradation ---
  console.log('\n--- 4. Storage Write Failure & Degradation ---');
  test('Sets isStorageDegraded and triggers listener on QuotaExceededError', () => {
    mockStorage.clear();
    mockStorage.throwOnSet = true;
    mockStorage.throwErrorType = 'QuotaExceededError';

    let degradationReported = null;
    const unsub = Storage.onDegradation(reason => { degradationReported = reason; });

    const testPayload = createDefaultStorageSchema();
    const saveResult = Storage.save(testPayload);
    unsub();

    assert.strictEqual(saveResult, false, 'save() must return false when quota exceeded');
    assert.strictEqual(Storage.isStorageDegraded, true, 'isStorageDegraded must be true');
    assert.strictEqual(degradationReported, 'QuotaExceededError', 'Listener must report error reason');

    // In-memory fallback allows uninterrupted session
    assert(Storage.memoryFallback !== null, 'Memory fallback must be active');
    mockStorage.throwOnSet = false; // Reset mock
  });

  // --- 5. Backup Export & Deep Import Validation ---
  console.log('\n--- 5. Backup Export & Deep Import Validation ---');
  test('exportJSON returns valid JSON string with schema', () => {
    const exported = Storage.exportJSON();
    assert.strictEqual(typeof exported, 'string');
    const parsed = JSON.parse(exported);
    assert.strictEqual(parsed.version, CURRENT_SCHEMA_VERSION);
    assert(Array.isArray(parsed.profiles));
  });

  test('importJSON rejects malformed or malicious payloads', () => {
    // Empty
    assert.strictEqual(Storage.importJSON('').success, false);
    // Non-JSON
    assert.strictEqual(Storage.importJSON('{bad').success, false);
    // Array root
    assert.strictEqual(Storage.importJSON('[]').success, false);
    // Missing profiles
    assert.strictEqual(Storage.importJSON('{"version":1}').success, false);
    // Empty profiles
    assert.strictEqual(Storage.importJSON('{"version":1,"profiles":[]}').success, false);
  });

  test('importJSON successfully restores valid sanitized payload', () => {
    const validImport = JSON.stringify({
      version: 1,
      activeProfileId: 'prof-import1',
      profiles: [
        {
          id: 'prof-import1',
          username: 'ImportedHero',
          level: 3,
          xp: 850,
          stats: { gamesPlayed: 5, questionsAttempted: 50, questionsCorrect: 42 }
        }
      ],
      settings: { theme: 'gold', soundEnabled: false }
    });

    const res = Storage.importJSON(validImport);
    assert.strictEqual(res.success, true);
    const loaded = Storage.load();
    assert.strictEqual(loaded.activeProfileId, 'prof-import1');
    assert.strictEqual(loaded.profiles[0].username, 'ImportedHero');
    assert.strictEqual(loaded.profiles[0].xp, 850);
    assert.strictEqual(loaded.settings.theme, 'gold');
    assert.strictEqual(loaded.settings.soundEnabled, false);
  });

  // --- 6. Active Session Reconstruction & Restoration ---
  console.log('\n--- 6. Active Session Reconstruction & Restoration ---');
  test('Session snapshot can reconstruct GameEngine state accurately', () => {
    const questions = QuestionBank.getByLanguage('python').slice(0, 5);
    assert(questions.length >= 5, 'Must have at least 5 questions');

    const engine1 = new GameEngine();
    engine1.startSession({
      language: 'python',
      difficulty: 'beginner',
      mode: 'campaign',
      timeLimit: 45,
      questions,
      randomizeOrder: false
    });

    // Answer first question correctly
    engine1.submitAnswer(questions[0].correctAnswer, 30);
    engine1.nextQuestion();

    // Now at question 2 with score > 0
    const sess1 = engine1.getSession();
    const snapshot = {
      id: sess1.id,
      inProgress: true,
      language: sess1.language,
      difficulty: sess1.difficulty,
      mode: sess1.mode,
      timeLimit: sess1.timeLimit,
      startTime: sess1.startTime,
      questionIds: sess1.questions.map(q => q.id),
      currentIndex: sess1.currentIndex,
      totalScore: sess1.totalScore,
      currentStreak: sess1.currentStreak,
      highestStreak: sess1.highestStreak,
      questionsAttempted: sess1.questionsAttempted,
      questionsCorrect: sess1.questionsCorrect,
      results: [...sess1.results]
    };

    assert.strictEqual(snapshot.currentIndex, 1, 'Snapshot must be at index 1');
    assert(snapshot.totalScore > 0, 'Snapshot must have positive score');
    assert.strictEqual(snapshot.questionsAttempted, 1);
    assert.strictEqual(snapshot.questionsCorrect, 1);

    // Reconstruct into engine2
    const engine2 = new GameEngine();
    const restoredQuestions = snapshot.questionIds.map(id => QuestionBank.getById(id));
    engine2.startSession({
      language: snapshot.language,
      difficulty: snapshot.difficulty,
      mode: snapshot.mode,
      timeLimit: snapshot.timeLimit,
      questions: restoredQuestions,
      randomizeOrder: false
    });

    const sess2 = engine2.getSession();
    sess2.id = snapshot.id;
    sess2.currentIndex = snapshot.currentIndex;
    sess2.totalScore = snapshot.totalScore;
    sess2.currentStreak = snapshot.currentStreak;
    sess2.highestStreak = snapshot.highestStreak;
    sess2.questionsAttempted = snapshot.questionsAttempted;
    sess2.questionsCorrect = snapshot.questionsCorrect;
    sess2.results = [...snapshot.results];

    const currentQ2 = engine2.getCurrentQuestion();
    assert.strictEqual(currentQ2.index, 1, 'Reconstructed engine must point to question 2');
    assert.strictEqual(sess2.totalScore, snapshot.totalScore, 'Reconstructed score must match snapshot');
    assert.strictEqual(sess2.questionsCorrect, 1, 'Reconstructed correct count must match');
  });

  // --- 7. Idempotency & Duplicate Prevention ---
  console.log('\n--- 7. Idempotency & Duplicate Prevention ---');
  test('Gamification.processSessionSummary prevents duplicate reward grants for same session ID', () => {
    const profile = createDefaultProfile('prof-idemp', 'IdempPlayer');
    const mockSummary = {
      sessionId: 'sess-unique-999',
      language: 'python',
      difficulty: 'beginner',
      mode: 'campaign',
      totalQuestions: 5,
      questionsAttempted: 5,
      questionsCorrect: 5,
      accuracy: 100,
      totalScore: 500,
      highestStreak: 5,
      isCompleted: true
    };

    // First process
    const res1 = Gamification.processSessionSummary(profile, mockSummary);
    assert.strictEqual(res1.success, true);
    assert.strictEqual(res1.isDuplicate, false);
    assert(res1.earnedXP > 0, 'First grant must award XP');

    // Second process on updated profile
    const res2 = Gamification.processSessionSummary(res1.updatedProfile, mockSummary);
    assert.strictEqual(res2.success, true);
    assert.strictEqual(res2.isDuplicate, true, 'Second grant must flag isDuplicate');
    assert.strictEqual(res2.earnedXP, 0, 'Duplicate session must award 0 XP');
    assert.strictEqual(res2.updatedProfile.xp, res1.updatedProfile.xp, 'XP must remain unchanged');
  });

  // Summary
  console.log('\n============================================================');
  console.log(`BATCH 9 RELIABILITY TEST RESULTS: ${passed} passed, ${failed} failed`);
  console.log('============================================================\n');

  return { passed, failed };
}

// Allow direct CLI execution
if (process.argv[1] && process.argv[1].endsWith('reliability-tests.js')) {
  runReliabilityTests().then(res => {
    if (res.failed > 0) process.exit(1);
  });
}
