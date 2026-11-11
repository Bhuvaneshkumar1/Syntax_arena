/**
 * SyntaxArena Tactile Memory Pointer Minigames Engine (Feature 8)
 * Powers:
 * 1. Cable Connect ("Stack Master"): Drag-and-drop pointer wire routing
 * 2. Leak Patrol ("Heap Hunter"): Mark-and-sweep garbage collection & orphan deallocation
 * 3. Dereference Rush ("Segfault Defuser"): Rapid-fire memory hazard triage
 * Zero external libraries or runtime dependencies.
 */

import { CABLE_CONNECT_LEVELS, LEAK_PATROL_LEVELS, DEREFERENCE_RUSH_CHALLENGES } from '../data/memory-levels.js';

export class MemoryMinigameEngine {
  constructor(options = {}) {
    this.cableLevels = options.cableLevels || CABLE_CONNECT_LEVELS || [];
    this.leakLevels = options.leakLevels || LEAK_PATROL_LEVELS || [];
    this.rushChallenges = options.rushChallenges || DEREFERENCE_RUSH_CHALLENGES || [];

    this.activeMode = 'cable_connect'; // 'cable_connect' | 'leak_patrol' | 'dereference_rush'
    this.currentLevelIndex = 0;

    // Independent score and streak tracking per minigame mode
    this.modeScores = {
      cable_connect: 0,
      leak_patrol: 0,
      dereference_rush: 0
    };
    this.modeStreaks = {
      cable_connect: 0,
      leak_patrol: 0,
      dereference_rush: 0
    };
    this.modeMaxStreaks = {
      cable_connect: 0,
      leak_patrol: 0,
      dereference_rush: 0
    };

    // Cable connect state
    this.userConnections = []; // Array of { from: string, to: string }
    this.activeDrag = null;    // { fromId, x, y }

    // Leak patrol state
    this.currentHeapBytes = 0;
    this.maxHeapCapacity = 1024;
    this.reclaimedBlockIds = new Set();
    this.uafCount = 0;

    // Dereference rush state
    this.rushIndex = 0;
    this.rushTimer = 12;
    this._rushTimerInterval = null;
    this.rushStats = { correct: 0, wrong: 0, segfaults: 0 };

    this.listeners = new Map();
  }

  // Backwards-compatible accessors for active mode
  get score() {
    return this.modeScores[this.activeMode] || 0;
  }
  set score(val) {
    this.modeScores[this.activeMode] = val;
  }

  get streak() {
    return this.modeStreaks[this.activeMode] || 0;
  }
  set streak(val) {
    this.modeStreaks[this.activeMode] = val;
  }

  get maxStreak() {
    return this.modeMaxStreaks[this.activeMode] || 0;
  }
  set maxStreak(val) {
    this.modeMaxStreaks[this.activeMode] = val;
  }

  get totalScore() {
    return (this.modeScores.cable_connect || 0) +
           (this.modeScores.leak_patrol || 0) +
           (this.modeScores.dereference_rush || 0);
  }

  // ==========================================
  // EVENT BUS SYSTEM
  // ==========================================
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const list = this.listeners.get(event).filter(fn => fn !== callback);
    this.listeners.set(event, list);
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    for (const fn of this.listeners.get(event)) {
      try {
        fn(data);
      } catch (err) {
        console.error(`[MemoryMinigameEngine] Error in listener for ${event}:`, err);
      }
    }
  }

  // ==========================================
  // MODE & LEVEL MANAGEMENT
  // ==========================================
  setMode(mode) {
    if (!['cable_connect', 'leak_patrol', 'dereference_rush'].includes(mode)) {
      throw new Error(`Invalid minigame mode: ${mode}`);
    }
    this.activeMode = mode;
    this.currentLevelIndex = 0;
    this._stopRushTimer();

    if (mode === 'cable_connect') {
      this.loadCableLevel(0);
    } else if (mode === 'leak_patrol') {
      this.loadLeakLevel(0);
    } else if (mode === 'dereference_rush') {
      this.startDereferenceRush();
    }

    this.emit('modeChanged', { mode });
  }

  // ==========================================
  // 1. CABLE CONNECT ("STACK MASTER")
  // ==========================================
  loadCableLevel(index = 0) {
    if (index < 0 || index >= this.cableLevels.length) {
      index = 0;
    }
    this.currentLevelIndex = index;
    this.userConnections = [];
    const level = this.getCurrentCableLevel();
    this.emit('cableLevelLoaded', { level, index });
    return level;
  }

  getCurrentCableLevel() {
    return this.cableLevels[this.currentLevelIndex] || null;
  }

  addConnection(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return false;

    // Check if duplicate connection already exists
    const exists = this.userConnections.some(c => c.from === fromId && c.to === toId);
    if (exists) return false;

    // Check how many connections this level requires from this specific source
    const level = this.getCurrentCableLevel();
    const reqs = level ? (level.requiredConnections || []) : [];
    const allowedFromCount = reqs.filter(r => r.from === fromId).length;
    const currentFromCount = this.userConnections.filter(c => c.from === fromId).length;

    // If source only allows 1 connection in this level (e.g. standard pointer), replace previous
    if (allowedFromCount <= 1 && currentFromCount >= 1) {
      this.userConnections = this.userConnections.filter(c => c.from !== fromId);
    }

    this.userConnections.push({ from: fromId, to: toId });
    this.emit('cableConnected', { from: fromId, to: toId, connections: [...this.userConnections] });
    return true;
  }

  removeConnection(fromId, toId) {
    const beforeCount = this.userConnections.length;
    this.userConnections = this.userConnections.filter(c => !(c.from === fromId && c.to === toId));
    if (this.userConnections.length !== beforeCount) {
      this.emit('cableRemoved', { from: fromId, to: toId, connections: [...this.userConnections] });
      return true;
    }
    return false;
  }

  clearConnections() {
    this.userConnections = [];
    this.emit('cablesCleared', {});
  }

  validateCableWiring() {
    const level = this.getCurrentCableLevel();
    if (!level) return { valid: false, feedback: 'No active level.' };

    const reqs = level.requiredConnections || [];
    let correctCount = 0;
    let incorrectCount = 0;

    for (const userConn of this.userConnections) {
      const match = reqs.some(r => r.from === userConn.from && r.to === userConn.to);
      if (match) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }

    const missingCount = reqs.length - correctCount;
    const isValid = correctCount === reqs.length && incorrectCount === 0;

    if (isValid) {
      this.modeStreaks.cable_connect++;
      if (this.modeStreaks.cable_connect > this.modeMaxStreaks.cable_connect) {
        this.modeMaxStreaks.cable_connect = this.modeStreaks.cable_connect;
      }
      const pts = level.xpReward + (this.modeStreaks.cable_connect * 25);
      this.modeScores.cable_connect += pts;
      this._awardProfileXP(pts);

      const result = {
        valid: true,
        scoreAwarded: pts,
        totalScore: this.modeScores.cable_connect,
        streak: this.modeStreaks.cable_connect,
        feedback: 'Pointer routing verified! All addresses match ground truth.'
      };
      this.emit('cableWiringValidated', result);
      return result;
    } else {
      this.modeStreaks.cable_connect = 0;
      let reason = 'Pointer wire configuration mismatch.';
      if (missingCount > 0 && incorrectCount > 0) {
        reason = `Missing ${missingCount} required wire(s) and detected ${incorrectCount} invalid route(s).`;
      } else if (missingCount > 0) {
        reason = `Still missing ${missingCount} required pointer connection(s).`;
      } else if (incorrectCount > 0) {
        reason = `Detected ${incorrectCount} erroneous pointer assignment(s). Check variable target types.`;
      }

      const result = {
        valid: false,
        missing: missingCount,
        incorrect: incorrectCount,
        feedback: reason
      };
      this.emit('cableWiringValidated', result);
      return result;
    }
  }

  // ==========================================
  // 2. LEAK PATROL ("HEAP HUNTER")
  // ==========================================
  loadLeakLevel(index = 0) {
    if (index < 0 || index >= this.leakLevels.length) {
      index = 0;
    }
    this.currentLevelIndex = index;
    this.reclaimedBlockIds.clear();
    this.uafCount = 0;

    const level = this.getCurrentLeakLevel();
    if (level) {
      this.currentHeapBytes = level.initialHeapBytes;
      this.maxHeapCapacity = level.maxHeapCapacity;
      this._computeReachability(level);
    }

    this.emit('leakLevelLoaded', { level, index });
    return level;
  }

  getCurrentLeakLevel() {
    return this.leakLevels[this.currentLevelIndex] || null;
  }

  /**
   * Mark and sweep reachability graph solver.
   * Traverses from stack roots through heap block references.
   * Any block not reached is marked as orphaned.
   */
  _computeReachability(level) {
    if (!level) return;
    const reachable = new Set();
    const roots = level.stackRoots || [];
    const blocksMap = new Map((level.heapBlocks || []).map(b => [b.id, b]));

    // Queue roots
    const queue = [];
    for (const root of roots) {
      if (root.pointsTo && blocksMap.has(root.pointsTo)) {
        queue.push(root.pointsTo);
        reachable.add(root.pointsTo);
      }
    }

    // BFS traversal
    while (queue.length > 0) {
      const curId = queue.shift();
      const block = blocksMap.get(curId);
      if (block && block.references) {
        for (const childId of block.references) {
          if (blocksMap.has(childId) && !reachable.has(childId)) {
            reachable.add(childId);
            queue.push(childId);
          }
        }
      }
    }

    // Mark blocks
    for (const block of level.heapBlocks || []) {
      block.isOrphaned = !reachable.has(block.id);
    }
  }

  /**
   * Attempt to deallocate/free a heap block.
   * If orphaned: safe reclamation (+150 PTS, frees heap space).
   * If reachable: Use-After-Free alert (-100 PTS penalty, streak reset).
   */
  attemptReclaimBlock(blockId) {
    const level = this.getCurrentLeakLevel();
    if (!level) return { success: false, feedback: 'No active leak level.' };

    if (this.reclaimedBlockIds.has(blockId)) {
      return { success: false, feedback: 'Block already deallocated.' };
    }

    const block = (level.heapBlocks || []).find(b => b.id === blockId);
    if (!block) return { success: false, feedback: 'Block not found.' };

    if (block.isOrphaned) {
      this.reclaimedBlockIds.add(blockId);
      this.currentHeapBytes = Math.max(0, this.currentHeapBytes - block.sizeBytes);
      this.modeStreaks.leak_patrol++;
      if (this.modeStreaks.leak_patrol > this.modeMaxStreaks.leak_patrol) {
        this.modeMaxStreaks.leak_patrol = this.modeStreaks.leak_patrol;
      }

      const pts = 150 + (this.modeStreaks.leak_patrol * 20);
      this.modeScores.leak_patrol += pts;
      this._awardProfileXP(pts);

      // Check if all target orphans collected
      const remainingOrphans = (level.orphansToReclaim || []).filter(id => !this.reclaimedBlockIds.has(id));
      const levelComplete = remainingOrphans.length === 0;

      const result = {
        success: true,
        blockId,
        bytesReclaimed: block.sizeBytes,
        currentHeapBytes: this.currentHeapBytes,
        maxHeapCapacity: this.maxHeapCapacity,
        scoreAwarded: pts,
        totalScore: this.modeScores.leak_patrol,
        streak: this.modeStreaks.leak_patrol,
        remainingOrphansCount: remainingOrphans.length,
        levelComplete,
        feedback: `Reclaimed ${block.sizeBytes}B orphaned memory at ${block.address}. Heap capacity relieved!`
      };

      this.emit('blockReclaimed', result);
      if (levelComplete) {
        this.emit('leakLevelCompleted', { level, score: this.modeScores.leak_patrol });
      }
      return result;
    } else {
      // Use After Free!
      this.uafCount++;
      this.modeStreaks.leak_patrol = 0;
      this.modeScores.leak_patrol = Math.max(0, this.modeScores.leak_patrol - 100);

      const result = {
        success: false,
        useAfterFree: true,
        blockId,
        address: block.address,
        totalScore: this.modeScores.leak_patrol,
        feedback: `🚨 CRITICAL USE-AFTER-FREE! Block at ${block.address} is still actively referenced by live code!`
      };

      this.emit('useAfterFreeTriggered', result);
      return result;
    }
  }

  // ==========================================
  // 3. DEREFERENCE RUSH ("SEGFAULT DEFUSER")
  // ==========================================
  startDereferenceRush() {
    this.rushIndex = 0;
    this.rushStats = { correct: 0, wrong: 0, segfaults: 0 };
    this.modeStreaks.dereference_rush = 0;
    this._nextRushChallenge();
  }

  _nextRushChallenge() {
    this._stopRushTimer();
    if (this.rushIndex >= this.rushChallenges.length) {
      this.emit('dereferenceRushCompleted', {
        stats: { ...this.rushStats },
        score: this.modeScores.dereference_rush,
        maxStreak: this.modeMaxStreaks.dereference_rush
      });
      return;
    }

    this.rushTimer = 12; // 12 seconds per hazard
    const challenge = this.rushChallenges[this.rushIndex];

    this._rushTimerInterval = setInterval(() => {
      this.rushTimer--;
      this.emit('rushTimerTick', { secondsRemaining: this.rushTimer });
      if (this.rushTimer <= 0) {
        this._stopRushTimer();
        this.submitRushAnswer('TIMEOUT');
      }
    }, 1000);

    this.emit('rushChallengeLoaded', {
      challenge,
      index: this.rushIndex,
      total: this.rushChallenges.length,
      secondsRemaining: this.rushTimer
    });
  }

  _stopRushTimer() {
    if (this._rushTimerInterval) {
      clearInterval(this._rushTimerInterval);
      this._rushTimerInterval = null;
    }
  }

  submitRushAnswer(chosenCategory) {
    this._stopRushTimer();
    const challenge = this.rushChallenges[this.rushIndex];
    if (!challenge) return null;

    // Flexible match: buffer overrun button matches both 'out_of_bounds' and 'wild_pointer'
    const isCorrect = chosenCategory === challenge.category ||
      (chosenCategory === 'out_of_bounds' && challenge.category === 'wild_pointer');

    let pts = 0;

    if (isCorrect) {
      this.modeStreaks.dereference_rush++;
      if (this.modeStreaks.dereference_rush > this.modeMaxStreaks.dereference_rush) {
        this.modeMaxStreaks.dereference_rush = this.modeStreaks.dereference_rush;
      }
      pts = 100 + (this.modeStreaks.dereference_rush * 25);
      this.modeScores.dereference_rush += pts;
      this.rushStats.correct++;
      this._awardProfileXP(pts);
    } else {
      this.modeStreaks.dereference_rush = 0;
      this.rushStats.wrong++;
      if (chosenCategory === 'safe_dereference' && challenge.category !== 'safe_dereference') {
        this.rushStats.segfaults++;
      }
    }

    const result = {
      isCorrect,
      chosenCategory,
      correctCategory: challenge.category,
      explanation: challenge.explanation,
      scoreAwarded: pts,
      totalScore: this.modeScores.dereference_rush,
      streak: this.modeStreaks.dereference_rush,
      stats: { ...this.rushStats }
    };

    this.emit('rushAnswerEvaluated', result);

    this.rushIndex++;
    return result;
  }

  proceedToNextRushChallenge() {
    this._nextRushChallenge();
  }

  // ==========================================
  // PROFILE GAMIFICATION SYNC
  // ==========================================
  _awardProfileXP(pts) {
    if (typeof window !== 'undefined' && window.Profile && typeof window.Profile.addXP === 'function') {
      try {
        window.Profile.addXP(pts);
      } catch (_) {}
    }
  }
}

if (typeof window !== 'undefined') {
  window.MemoryMinigameEngine = MemoryMinigameEngine;
}
