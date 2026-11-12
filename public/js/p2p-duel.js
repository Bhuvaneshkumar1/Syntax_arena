/**
 * SyntaxArena P2P & Local 1v1 Duel Engine ("SyntaxDuel")
 * Coordinates real-time multiplayer head-to-head coding battles:
 * - Cross-tab / cross-window real-time messaging via BroadcastChannel & LocalStorage bridge
 * - WebRTC DataChannel peer connectivity for remote zero-server duels
 * - Shared keyboard local 2-player arcade split mode
 * - Synchronized seeded question selection & real-time split delta tracking
 * - Sabotage glitch disruptions on high streak combos
 */

import { Utils } from './utils.js';
import { AudioEngine } from './audio.js';

export const DuelEngine = {
  active: false,
  isHost: false,
  mode: 'p2p', // 'p2p' | 'local_split' | 'async_challenge'
  roomCode: '',
  seed: 0,
  language: 'python',
  difficulty: 'all',
  questionCount: 10,
  channel: null,
  storageKey: null,
  storageListener: null,
  peerConnection: null,
  dataChannel: null,

  // Local & Remote Player States
  localPlayer: {
    id: 'local',
    name: 'Player 1',
    avatar: 'cyber_fox',
    score: 0,
    streak: 0,
    highestStreak: 0,
    currentQuestion: 0,
    correctAnswers: 0,
    totalAnswered: 0,
    timeSpent: 0,
    finished: false
  },

  opponentPlayer: {
    id: 'opponent',
    name: 'Challenger',
    avatar: 'matrix_cat',
    score: 0,
    streak: 0,
    highestStreak: 0,
    currentQuestion: 0,
    correctAnswers: 0,
    totalAnswered: 0,
    timeSpent: 0,
    finished: false,
    connected: false
  },

  // Event callbacks
  callbacks: {
    onOpponentJoined: null,
    onMatchStart: null,
    onOpponentProgress: null,
    onOpponentFinished: null,
    onSabotage: null
  },

  get session() {
    return {
      mode: this.mode,
      roomCode: this.roomCode,
      seed: this.seed,
      localPlayer: this.localPlayer,
      opponent: this.opponentPlayer
    };
  },

  onRemoteProgress(fn) {
    this.callbacks.onOpponentProgress = fn;
  },

  onSabotage(fn) {
    this.callbacks.onSabotage = fn;
  },

  onOpponentJoined(fn) {
    this.callbacks.onOpponentJoined = fn;
  },

  onOpponentFinished(fn) {
    this.callbacks.onOpponentFinished = fn;
  },

  onStateChange(fn) {
    this.callbacks.onMatchStart = fn;
  },

  initHost(config = {}) {
    return this.createRoom({
      roomCode: config.roomCode,
      seed: config.seed,
      language: config.language,
      difficulty: config.difficulty,
      questionCount: config.count || config.questionCount,
      profile: config.profile || (typeof Profile !== 'undefined' ? Profile.getActiveProfile() : null)
    });
  },

  initChallenger(config = {}) {
    return this.joinRoom(config.roomCode, {
      seed: config.seed,
      language: config.language,
      difficulty: config.difficulty,
      questionCount: config.count || config.questionCount,
      profile: config.profile || (typeof Profile !== 'undefined' ? Profile.getActiveProfile() : null)
    });
  },

  initLocalSplit(config = {}) {
    return this.startLocalSplitMode({
      language: config.language,
      difficulty: config.difficulty,
      questionCount: config.count || config.questionCount,
      seed: config.seed,
      p1Name: config.p1Name,
      p2Name: config.p2Name
    });
  },

  /**
   * Generate clean 6-character room code (e.g. "SYN-482")
   */
  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'SYN-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  /**
   * Generate deterministic seed from roomCode or timestamp
   */
  generateSeed(str = '') {
    const s = str || (Date.now().toString(36) + Math.random().toString(36));
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash) + s.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  },

  /**
   * Initialize a new Duel Match as Host
   */
  createRoom(config = {}) {
    this.reset();
    this.isHost = true;
    this.mode = config.mode || 'p2p';
    this.roomCode = config.roomCode || this.generateRoomCode();
    this.seed = config.seed || this.generateSeed(this.roomCode);
    this.language = config.language || 'python';
    this.difficulty = config.difficulty || 'all';
    this.questionCount = config.questionCount || 10;

    const userProfile = config.profile || {};
    this.localPlayer.name = userProfile.username || 'ScriptAdept';
    this.localPlayer.avatar = userProfile.avatarId || 'cyber_fox';

    this.active = true;
    this._initTransport();
    try {
      if (typeof AudioEngine !== 'undefined' && typeof AudioEngine.startMusic === 'function') {
        AudioEngine.startMusic('duel');
      }
    } catch (_) {}
    return this.getRoomConfig();
  },

  /**
   * Join an existing Duel Match as Challenger
   */
  joinRoom(roomCode, config = {}) {
    this.reset();
    this.isHost = false;
    this.mode = config.mode || 'p2p';
    this.roomCode = (roomCode || '').toUpperCase().trim();
    this.seed = config.seed || this.generateSeed(this.roomCode);
    this.language = config.language || 'python';
    this.difficulty = config.difficulty || 'all';
    this.questionCount = config.questionCount || 10;

    const userProfile = config.profile || {};
    this.localPlayer.name = userProfile.username || 'CodeChallenger';
    this.localPlayer.avatar = userProfile.avatarId || 'terminal_owl';

    this.active = true;
    this._initTransport();

    // Announce presence to Host
    this._broadcastMessage({
      type: 'PLAYER_JOIN',
      player: {
        name: this.localPlayer.name,
        avatar: this.localPlayer.avatar
      }
    });

    try {
      if (typeof AudioEngine !== 'undefined' && typeof AudioEngine.startMusic === 'function') {
        AudioEngine.startMusic('duel');
      }
    } catch (_) {}

    return this.getRoomConfig();
  },

  /**
   * Initialize Local Same-Keyboard / Shared Screen Mode
   */
  startLocalSplitMode(config = {}) {
    this.reset();
    this.isHost = true;
    this.mode = 'local_split';
    this.roomCode = 'LOCAL-ARCADE';
    this.seed = config.seed || this.generateSeed('local');
    this.language = config.language || 'python';
    this.difficulty = config.difficulty || 'all';
    this.questionCount = config.questionCount || 10;

    this.localPlayer.name = config.p1Name || 'Player 1 (Keys 1-4)';
    this.localPlayer.avatar = 'cyber_fox';
    this.opponentPlayer.name = config.p2Name || 'Player 2 (Keys 7-0)';
    this.opponentPlayer.avatar = 'matrix_cat';
    this.opponentPlayer.connected = true;

    this.active = true;
    try {
      if (typeof AudioEngine !== 'undefined' && typeof AudioEngine.startMusic === 'function') {
        AudioEngine.startMusic('duel');
      }
    } catch (_) {}
    return this.getRoomConfig();
  },

  /**
   * Retrieve active room configuration payload
   */
  getRoomConfig() {
    return {
      roomCode: this.roomCode,
      isHost: this.isHost,
      mode: this.mode,
      seed: this.seed,
      language: this.language,
      difficulty: this.difficulty,
      questionCount: this.questionCount,
      shareUrl: this.getShareUrl()
    };
  },

  /**
   * Construct 1-click shareable join URL
   */
  getShareUrl(baseUrl = '') {
    let base = baseUrl;
    if (!base && typeof window !== 'undefined' && window.location) {
      base = window.location.origin + window.location.pathname;
    }
    if (!base) base = 'game.html';
    const params = new URLSearchParams();
    params.set('mode', 'duel');
    params.set('room', this.roomCode);
    params.set('lang', this.language);
    params.set('diff', this.difficulty);
    params.set('count', String(this.questionCount));
    params.set('seed', String(this.seed));
    return `${base}?${params.toString()}`;
  },

  /**
   * Setup communication channels (BroadcastChannel + LocalStorage Bridge)
   */
  _initTransport() {
    if (typeof window === 'undefined') return;

    // 1. Cross-Tab/Window BroadcastChannel
    if ('BroadcastChannel' in window) {
      try {
        if (this.channel) this.channel.close();
        this.channel = new BroadcastChannel(`syntaxarena_duel_${this.roomCode}`);
        this.channel.onmessage = (e) => this._handleMessage(e.data);
      } catch (e) {
        console.warn('[DuelEngine] BroadcastChannel unavailable, using LocalStorage bridge:', e);
      }
    }

    // 2. Cross-Window LocalStorage bridge fallback
    this.storageKey = `syntaxarena_duel_msg_${this.roomCode}`;
    if (!this.storageListener && typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      this.storageListener = (e) => {
        if (e.key === this.storageKey && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this._handleMessage(data);
          } catch (_) {}
        }
      };
      window.addEventListener('storage', this.storageListener);
    }
  },

  /**
   * Broadcast message to peer
   */
  _broadcastMessage(msg) {
    const payload = {
      ...msg,
      sender: this.isHost ? 'host' : 'guest',
      timestamp: Date.now()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (_) {}
    }

    if (typeof window !== 'undefined' && window.localStorage && this.storageKey) {
      try {
        window.localStorage.setItem(this.storageKey, JSON.stringify(payload));
      } catch (_) {}
    }
  },

  /**
   * Process incoming messages from peer
   */
  _handleMessage(msg) {
    if (!msg || !msg.type) return;

    // Filter out echo from self
    const expectedSender = this.isHost ? 'guest' : 'host';
    if (msg.sender && msg.sender !== expectedSender && msg.type !== 'PLAYER_JOIN') {
      return;
    }

    switch (msg.type) {
      case 'PLAYER_JOIN':
        this.opponentPlayer.connected = true;
        if (msg.player) {
          this.opponentPlayer.name = msg.player.name || this.opponentPlayer.name;
          this.opponentPlayer.avatar = msg.player.avatar || this.opponentPlayer.avatar;
        }
        if (this.isHost) {
          // Acknowledge challenger and send current room config
          this._broadcastMessage({
            type: 'ROOM_SYNC',
            room: this.getRoomConfig(),
            host: {
              name: this.localPlayer.name,
              avatar: this.localPlayer.avatar
            }
          });
        }
        if (typeof this.callbacks.onOpponentJoined === 'function') {
          this.callbacks.onOpponentJoined(this.opponentPlayer);
        }
        break;

      case 'ROOM_SYNC':
        if (!this.isHost && msg.room) {
          this.seed = msg.room.seed || this.seed;
          this.language = msg.room.language || this.language;
          this.difficulty = msg.room.difficulty || this.difficulty;
          this.questionCount = msg.room.questionCount || this.questionCount;
          if (msg.host) {
            this.opponentPlayer.name = msg.host.name || this.opponentPlayer.name;
            this.opponentPlayer.avatar = msg.host.avatar || this.opponentPlayer.avatar;
            this.opponentPlayer.connected = true;
          }
          if (typeof this.callbacks.onOpponentJoined === 'function') {
            this.callbacks.onOpponentJoined(this.opponentPlayer);
          }
        }
        break;

      case 'MATCH_START':
        this.seed = msg.seed || this.seed;
        if (typeof this.callbacks.onMatchStart === 'function') {
          this.callbacks.onMatchStart(msg);
        }
        break;

      case 'PROGRESS_UPDATE':
        this.opponentPlayer.currentQuestion = msg.questionIndex !== undefined ? msg.questionIndex : this.opponentPlayer.currentQuestion;
        this.opponentPlayer.score = msg.score !== undefined ? msg.score : this.opponentPlayer.score;
        this.opponentPlayer.streak = msg.streak !== undefined ? msg.streak : this.opponentPlayer.streak;
        this.opponentPlayer.totalAnswered = (this.opponentPlayer.totalAnswered || 0) + 1;
        if (msg.isCorrect) {
          this.opponentPlayer.correctAnswers = (this.opponentPlayer.correctAnswers || 0) + 1;
        }
        if (this.opponentPlayer.streak > this.opponentPlayer.highestStreak) {
          this.opponentPlayer.highestStreak = this.opponentPlayer.streak;
        }

        if (typeof this.callbacks.onOpponentProgress === 'function') {
          this.callbacks.onOpponentProgress(this.opponentPlayer, msg);
        }
        break;

      case 'SABOTAGE':
        if (typeof this.callbacks.onSabotage === 'function') {
          this.callbacks.onSabotage(msg);
        }
        break;

      case 'OPPONENT_BLUNDER': {
        const bonus = msg.bonusPoints || 100;
        this.localPlayer.score += bonus;
        if (typeof window !== 'undefined' && window.Gameplay && window.Gameplay.engine) {
          const sess = window.Gameplay.engine.getSession();
          if (sess) {
            sess.totalScore = (sess.totalScore || 0) + bonus;
          }
          if (typeof window.Gameplay._updateDuelVersusHUD === 'function') {
            window.Gameplay._updateDuelVersusHUD();
          }
        }
        if (typeof UI !== 'undefined' && typeof UI.showToast === 'function') {
          UI.showToast(`⚡ OPPONENT BLUNDER! ${msg.blunderingPlayer || 'Opponent'} made an error. +${bonus} PTS awarded to you!`, 'success');
        }
        break;
      }

      case 'PLAYER_FINISH':
        this.opponentPlayer.finished = true;
        this.opponentPlayer.score = msg.score || this.opponentPlayer.score;
        this.opponentPlayer.timeSpent = msg.timeSpent || 0;
        if (typeof this.callbacks.onOpponentFinished === 'function') {
          this.callbacks.onOpponentFinished(this.opponentPlayer);
        }
        break;
    }
  },

  /**
   * Host starts the synchronized match
   */
  startMatch() {
    if (!this.active) return;
    this._broadcastMessage({
      type: 'MATCH_START',
      seed: this.seed,
      language: this.language,
      difficulty: this.difficulty,
      questionCount: this.questionCount
    });
  },

  /**
   * Record local player's question submission and broadcast update
   */
  recordLocalAnswer({ questionIndex, isCorrect, score, streak, pointsEarned = 0 }) {
    this.localPlayer.currentQuestion = questionIndex + 1;
    this.localPlayer.score = score;
    this.localPlayer.streak = streak;
    this.localPlayer.totalAnswered++;
    if (isCorrect) {
      this.localPlayer.correctAnswers++;
      if (streak > this.localPlayer.highestStreak) {
        this.localPlayer.highestStreak = streak;
      }
    }

    // Broadcast live progress to opponent
    this._broadcastMessage({
      type: 'PROGRESS_UPDATE',
      questionIndex: this.localPlayer.currentQuestion,
      isCorrect,
      score: this.localPlayer.score,
      streak: this.localPlayer.streak,
      pointsEarned
    });

    // Sabotage attack on 3-streak
    if (isCorrect && streak >= 3 && streak % 3 === 0) {
      this._broadcastMessage({
        type: 'SABOTAGE',
        attacker: this.localPlayer.name,
        streak
      });
    }

    return this.getLeadStatus();
  },

  /**
   * Record blunder on incorrect answer: points automatically awarded to opponent
   */
  recordBlunder({ blunderPlayer = 'p1', points = 100 } = {}) {
    if (this.mode === 'local_split') {
      if (blunderPlayer === 'p1') {
        this.opponentPlayer.score += points;
      } else {
        this.localPlayer.score += points;
      }
    } else {
      // P2P: Local player blundered, opponent is awarded the points
      this.opponentPlayer.score += points;
      this._broadcastMessage({
        type: 'OPPONENT_BLUNDER',
        bonusPoints: points,
        blunderingPlayer: this.localPlayer.name
      });
    }
    return this.getLeadStatus();
  },

  /**
   * Record local player match finish
   */
  recordLocalFinish(totalTimeMs = 0) {
    this.localPlayer.finished = true;
    this.localPlayer.timeSpent = totalTimeMs;

    this._broadcastMessage({
      type: 'PLAYER_FINISH',
      score: this.localPlayer.score,
      correctAnswers: this.localPlayer.correctAnswers,
      timeSpent: totalTimeMs
    });

    return this.getMatchResult();
  },

  /**
   * Calculate real-time race lead between Local and Opponent
   * @returns {object} { status: 'lead'|'behind'|'tied', deltaScore, deltaQuestions, text }
   */
  getLeadStatus() {
    const diff = this.localPlayer.score - this.opponentPlayer.score;
    const qDiff = this.localPlayer.currentQuestion - this.opponentPlayer.currentQuestion;

    const base = {
      p1Score: this.localPlayer.score,
      p2Score: this.opponentPlayer.score,
      p1Progress: this.localPlayer.currentQuestion,
      p2Progress: this.opponentPlayer.currentQuestion,
      p1Streak: this.localPlayer.streak,
      p2Streak: this.opponentPlayer.streak
    };

    if (diff > 0) {
      return {
        ...base,
        status: 'lead',
        deltaScore: diff,
        deltaQuestions: qDiff,
        text: `+${diff} PTS AHEAD`,
        deltaClass: 'is-lead',
        deltaText: `+${diff} PTS AHEAD`
      };
    } else if (diff < 0) {
      return {
        ...base,
        status: 'behind',
        deltaScore: Math.abs(diff),
        deltaQuestions: Math.abs(qDiff),
        text: `-${Math.abs(diff)} PTS BEHIND`,
        deltaClass: 'is-behind',
        deltaText: `-${Math.abs(diff)} PTS BEHIND`
      };
    } else {
      return {
        ...base,
        status: 'tied',
        deltaScore: 0,
        deltaQuestions: qDiff,
        text: `⚡ TIED`,
        deltaClass: 'is-tied',
        deltaText: `⚡ TIED`
      };
    }
  },

  /**
   * Resolve final winner and head-to-head match stats
   */
  getMatchResult() {
    const p1 = this.localPlayer;
    const p2 = this.opponentPlayer;

    let winner = 'draw';
    if (p1.score > p2.score) {
      winner = 'p1';
    } else if (p2.score > p1.score) {
      winner = 'p2';
    } else {
      // Tie breaker 1: Most correct answers
      if (p1.correctAnswers > p2.correctAnswers) {
        winner = 'p1';
      } else if (p2.correctAnswers > p1.correctAnswers) {
        winner = 'p2';
      } else {
        // Tie breaker 2: Faster total time
        if (p1.timeSpent < p2.timeSpent && p1.timeSpent > 0) {
          winner = 'p1';
        } else if (p2.timeSpent < p1.timeSpent && p2.timeSpent > 0) {
          winner = 'p2';
        } else {
          winner = 'draw';
        }
      }
    }

    const p1Acc = p1.totalAnswered > 0 ? Math.round((p1.correctAnswers / p1.totalAnswered) * 100) : 0;
    const p2Acc = p2.totalAnswered > 0 ? Math.round((p2.correctAnswers / p2.totalAnswered) * 100) : 0;

    return {
      winner, // 'p1' | 'p2' | 'draw'
      isVictory: winner === 'p1',
      isDefeat: winner === 'p2',
      isDraw: winner === 'draw',
      isTie: winner === 'draw',
      isHostWin: winner === 'p1',
      host: {
        username: p1.name,
        name: p1.name,
        score: p1.score,
        accuracy: p1Acc,
        maxStreak: p1.highestStreak,
        totalTimeMs: p1.timeSpent
      },
      challenger: {
        username: p2.name,
        name: p2.name,
        score: p2.score,
        accuracy: p2Acc,
        maxStreak: p2.highestStreak,
        totalTimeMs: p2.timeSpent
      },
      verdictSummary: winner === 'draw'
        ? 'Epic tie! Both competitors displayed remarkable syntax mastery.'
        : (winner === 'p1' ? `${p1.name} conquered the head-to-head syntax duel!` : `${p2.name} claimed the syntax victory!`),
      p1: {
        name: p1.name,
        avatar: p1.avatar,
        score: p1.score,
        correctAnswers: p1.correctAnswers,
        totalAnswered: p1.totalAnswered,
        accuracy: p1Acc,
        highestStreak: p1.highestStreak,
        timeSpentSec: Math.round(p1.timeSpent / 1000)
      },
      p2: {
        name: p2.name,
        avatar: p2.avatar,
        score: p2.score,
        correctAnswers: p2.correctAnswers,
        totalAnswered: p2.totalAnswered,
        accuracy: p2Acc,
        highestStreak: p2.highestStreak,
        timeSpentSec: Math.round(p2.timeSpent / 1000)
      }
    };
  },

  /**
   * Generate markdown report card for match sharing
   */
  generateMarkdownReport() {
    const res = this.getMatchResult();
    return `### ⚔️ SyntaxDuel Versus Match Report
**Room:** ${this.roomCode || 'LOCAL-SPLIT'} • **Track:** ${this.language} (${this.difficulty})
**Outcome:** ${res.isTie ? 'HONORABLE DRAW' : (res.isVictory ? `🏆 VICTORY for ${res.p1.name}` : `💀 DEFEAT - ${res.p2.name} Wins`)}

| Metric | ${res.p1.name} | ${res.p2.name} |
| :--- | :--- | :--- |
| **Final Score** | ${res.p1.score} PTS | ${res.p2.score} PTS |
| **Accuracy** | ${res.p1.accuracy}% | ${res.p2.accuracy}% |
| **Max Streak** | ${res.p1.highestStreak}x | ${res.p2.highestStreak}x |
| **Elapsed Time** | ${res.p1.timeSpentSec}s | ${res.p2.timeSpentSec}s |

*Generated via SyntaxArena Real-Time P2P Duel Engine*`;
  },

  /**
   * Deterministically select identical question deck using Mulberry32 PRNG
   * @param {Array|object} catalogOrOpts Master list of questions or options object
   * @param {number} seed Integer seed
   * @param {number} count Number of questions (default 10)
   * @param {string} [language='python']
   * @param {string} [difficulty='all']
   * @returns {Array} Shuffled question array
   */
  getSynchronizedQuestionDeck(catalogOrOpts, seed = 0, count = 10, language = 'python', difficulty = 'all') {
    let catalog = catalogOrOpts;
    if (catalogOrOpts && !Array.isArray(catalogOrOpts) && typeof catalogOrOpts === 'object') {
      seed = catalogOrOpts.seed !== undefined ? catalogOrOpts.seed : 0;
      count = catalogOrOpts.count || 10;
      language = catalogOrOpts.language || 'python';
      difficulty = catalogOrOpts.difficulty || 'all';
      catalog = catalogOrOpts.catalog;
    }

    if (!Array.isArray(catalog) || catalog.length === 0) {
      if (typeof DUEL_QUESTIONS !== 'undefined' && Array.isArray(DUEL_QUESTIONS) && DUEL_QUESTIONS.length > 0) {
        catalog = DUEL_QUESTIONS;
      } else if (typeof QuestionBank !== 'undefined' && typeof QuestionBank.getAll === 'function') {
        catalog = QuestionBank.getAll();
      } else {
        return [];
      }
    }

    let pool = catalog.filter(q => {
      const matchLang = (language === 'all' || q.language === language);
      const matchDiff = (difficulty === 'all' || q.difficulty === difficulty);
      return matchLang && matchDiff;
    });

    if (pool.length < count) {
      pool = catalog.filter(q => language === 'all' || q.language === language);
    }
    if (pool.length === 0) {
      pool = catalog.slice();
    }

    // Mulberry32 seeded PRNG
    let s = (seed || 123456789) >>> 0;
    const nextRandom = () => {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    // Seeded Fisher-Yates shuffle
    const shuffled = pool.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(nextRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

  /**
   * Reset duel state and close active transport channels
   */
  reset() {
    this.active = false;
    this.isHost = false;
    this.roomCode = '';
    this.seed = 0;

    if (this.channel) {
      try { this.channel.close(); } catch (_) {}
      this.channel = null;
    }

    if (this.storageListener && typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
    }

    this.localPlayer = {
      id: 'local',
      name: 'Player 1',
      avatar: 'cyber_fox',
      score: 0,
      streak: 0,
      highestStreak: 0,
      currentQuestion: 0,
      correctAnswers: 0,
      totalAnswered: 0,
      timeSpent: 0,
      finished: false
    };

    this.opponentPlayer = {
      id: 'opponent',
      name: 'Challenger',
      avatar: 'matrix_cat',
      score: 0,
      streak: 0,
      highestStreak: 0,
      currentQuestion: 0,
      correctAnswers: 0,
      totalAnswered: 0,
      timeSpent: 0,
      finished: false,
      connected: false
    };
  }
};

if (typeof window !== 'undefined') {
  window.DuelEngine = DuelEngine;
}
