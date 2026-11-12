/**
 * SyntaxArena Gameplay Controller & UI Coordinator (Batch 5)
 * Binds DOM arena interface to the core GameEngine, managing question rendering,
 * multi-format inputs, timer countdown, hint drawers, Second Chance retries,
 * exit confirmation, and results navigation.
 * Source of truth: docs/GAME_RULES.md, docs/ARCHITECTURE.md, docs/QUESTION_SCHEMA.md
 */

import { GameEngine, ENGINE_STATES } from './game-engine.js';
import { QuestionBank } from './question-bank.js';
import { State } from './state.js';
import { Storage } from './storage.js';
import { Profile } from './profile.js';
import { AudioEngine } from './audio.js';
import { UI } from './ui.js';
import { Router } from './router.js';
import { Utils } from './utils.js';
import { LANGUAGE_METADATA } from './data/index.js';
import { BossEncounters } from '../data/boss-encounters.js';
import { BossEngine } from './boss-engine.js';
import { DuelEngine } from './p2p-duel.js';
import { IncidentScenarios } from '../data/incident-scenarios.js';
import { IncidentEngine } from './incident-engine.js';

export const HINT_PENALTIES = {
  beginner: 25,
  intermediate: 60,
  expert: 100
};

export const STAGE_CONFIG = {
  1: { id: 1, name: 'Stage 1: Core Fundamentals', questionsCount: 5, startIndex: 0, endIndex: 5, isBoss: false },
  2: { id: 2, name: 'Stage 2: Core Logic', questionsCount: 5, startIndex: 5, endIndex: 10, isBoss: false },
  3: { id: 3, name: 'Stage 3: Control Flow', questionsCount: 5, startIndex: 10, endIndex: 15, isBoss: false },
  4: { id: 4, name: 'Stage 4: 💀 MINI-BOSS', questionsCount: 5, startIndex: 15, endIndex: 20, isBoss: true },
  5: { id: 5, name: 'Stage 5: Data Structures', questionsCount: 5, startIndex: 20, endIndex: 25, isBoss: false },
  6: { id: 6, name: 'Stage 6: Systems Logic', questionsCount: 5, startIndex: 25, endIndex: 30, isBoss: false },
  7: { id: 7, name: 'Stage 7: Advanced Patterns', questionsCount: 5, startIndex: 30, endIndex: 35, isBoss: false },
  8: { id: 8, name: 'Stage 8: 💀 FINAL APEX BOSS', questionsCount: 5, startIndex: 35, endIndex: 40, isBoss: true },
  marathon: { id: 'marathon', name: 'Tier Marathon (20 Qs)', questionsCount: 20, startIndex: 0, endIndex: 20, isBoss: false }
};

export const Gameplay = {
  engine: null,
  sessionConfig: null,
  timer: {
    intervalId: null,
    timeRemaining: 0,
    timeLimit: 45,
    isRunning: false
  },
  currentSubmission: null,
  selectedOptionIndex: null,
  selectedBugLine: null,
  isSubmitting: false,
  isAdvancing: false,
  isCompleted: false,
  _isRetryAttempt: false,
  _autoAdvanceTimer: null,
  _eventsBound: false,
  _lastSubmitTime: 0,
  _lastAdvanceTime: 0,
  ghostDuel: {
    enabled: true,
    opponentName: 'CyberPhantom',
    ghostAvatar: '👻',
    playerCumulativeTime: 0,
    ghostCumulativeTime: 0,
    questionStartTime: 0,
    lastSplitDelta: 0,
    pacePerQuestion: 8.5
  },
  consecutiveMistakes: 0,
  isDuelMode: false,
  duelSession: null,
  _activeDuelHostConfig: null,
  isIncidentMode: false,
  activeIncident: null,
  incidentTelemetryInterval: null,

  /**
   * Save an atomic snapshot of current session state to reactive state & localStorage.
   */
  _saveSessionSnapshot() {
    if (!this.engine || this.isCompleted) return;
    const sess = this.engine.getSession();
    if (!sess || sess.isCompleted) {
      State.set('activeSession', null, true);
      return;
    }

    const usedHints = this.engine._hintManager ? Array.from(this.engine._hintManager._usedHints || []) : [];

    const snapshot = {
      id: sess.id,
      inProgress: true,
      language: sess.language,
      difficulty: sess.difficulty,
      mode: sess.mode,
      stage: this.activeStage ? this.activeStage.id : 'marathon',
      timeLimit: sess.timeLimit,
      startTime: sess.startTime,
      questionIds: sess.questions.map(q => q.id),
      currentIndex: sess.currentIndex,
      totalScore: sess.totalScore,
      currentStreak: sess.currentStreak,
      highestStreak: sess.highestStreak,
      questionsAttempted: sess.questionsAttempted,
      questionsCorrect: sess.questionsCorrect,
      lives: sess.lives,
      maxLives: sess.maxLives,
      isGameOver: sess.isGameOver,
      hintsUsedCount: sess.hintsUsedCount,
      retriesUsedCount: sess.retriesUsedCount,
      usedHintQuestionIds: usedHints,
      results: [...sess.results],
      lastUpdated: Date.now()
    };

    State.set('activeSession', snapshot, true);
  },

  /**
   * Initialize gameplay arena from URL parameters, storage state, or profile preferences.
   * Restores existing in-progress session if valid and matches requested track.
   */
  async init() {
    try {
      console.info('[Gameplay] Initializing SyntaxArena gameplay interface...');
      this.isCompleted = false;

    // Listen for storage degradation warnings
    Storage.onDegradation(() => {
      UI.showToast('Browser storage is restricted or full. Current run is in-memory only.', 'info');
    });

    // 1. Resolve & sanitize configuration from query params or active profile
    const params = Router.getQueryParams();
    const activeProfile = State.get('activeProfile') || Profile.getActiveProfile();

    const ALLOWED_LANGS = ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql', 'typescript', 'go', 'html', 'asm'];
    const ALLOWED_DIFFS = ['beginner', 'intermediate', 'expert'];
    const ALLOWED_MODES = ['campaign', 'practice', 'speedrun', 'hardcore', 'retry_missed', 'endless', 'boss', 'duel', 'incident'];

    let rawLang = (params.lang || (activeProfile && activeProfile.preferences?.language) || 'python').toLowerCase();
    if (rawLang === 'ts') rawLang = 'typescript';
    if (rawLang === 'golang') rawLang = 'go';
    if (rawLang === 'html5' || rawLang === 'css') rawLang = 'html';
    if (rawLang === 'assembly' || rawLang === 're' || rawLang === 'reverse') rawLang = 'asm';
    if (!ALLOWED_LANGS.includes(rawLang)) {
      console.warn(`[Gameplay] Unknown language "${params.lang}". Falling back to Python.`);
      UI.showToast(`Unsupported track "${params.lang}". Loaded Python track.`, 'info');
      rawLang = 'python';
    }
    const language = rawLang;

    let rawDiff = (params.diff || (activeProfile && activeProfile.preferences?.difficulty) || 'beginner').toLowerCase();
    if (!ALLOWED_DIFFS.includes(rawDiff)) {
      console.warn(`[Gameplay] Unknown difficulty "${params.diff}". Falling back to beginner.`);
      rawDiff = 'beginner';
    }

    // STRICT GATING: Ensure intermediate and expert cannot be launched without sufficient points or prior tier clear
    if (rawDiff !== 'beginner') {
      const userXP = (activeProfile && (typeof activeProfile.totalScore === 'number' ? activeProfile.totalScore : activeProfile.xp)) || 0;
      const camp = (activeProfile && activeProfile.campaign && activeProfile.campaign[language]) || {};
      const completed = (activeProfile && activeProfile.completedTiers) || {};

      if (rawDiff === 'intermediate') {
        const isBegCleared = camp.beginnerStars > 0 || camp.unlockedTier === 'intermediate' || camp.unlockedTier === 'expert' || completed[language + '_beginner'];
        if (!isBegCleared && userXP < 1000) {
          console.warn(`[Gameplay] Intermediate tier is locked for ${language}. Reverting to beginner.`);
          UI.showToast(`🔒 Intermediate is locked (requires Beginner clear or 1,000 pts). Switched to Beginner tier.`, 'info');
          rawDiff = 'beginner';
        }
      } else if (rawDiff === 'expert') {
        const isIntCleared = camp.intermediateStars > 0 || camp.unlockedTier === 'expert' || completed[language + '_intermediate'];
        if (!isIntCleared && userXP < 2500) {
          console.warn(`[Gameplay] Expert tier is locked for ${language}. Reverting to beginner.`);
          UI.showToast(`🔒 Expert is locked (requires Intermediate clear or 2,500 pts). Switched to Beginner tier.`, 'info');
          rawDiff = 'beginner';
        }
      }
    }
    const difficulty = rawDiff;

    let rawMode = (params.mode || 'campaign').toLowerCase();
    if (!ALLOWED_MODES.includes(rawMode)) {
      console.warn(`[Gameplay] Unknown mode "${params.mode}". Falling back to campaign.`);
      rawMode = 'campaign';
    }
    const mode = rawMode;

    // Determine time limit: Hardcore (30s), Standard timed (45s), Relaxed (0), Endless (0 unless timed=true), Boss (35s)
    let timeLimit = 45;
    if (params.timed === 'false' || mode === 'practice') {
      timeLimit = 0; // Relaxed mode
    } else if (mode === 'hardcore') {
      timeLimit = 30;
    } else if (mode === 'speedrun') {
      timeLimit = 20;
    } else if (mode === 'boss') {
      timeLimit = 35; // Calibrated for high-stakes boss calculations
    } else if (mode === 'incident') {
      const incidentId = params.incident || 'inc_memory_leak';
      const inc = (typeof IncidentScenarios !== 'undefined' && IncidentScenarios.getById(incidentId)) || (typeof IncidentScenarios !== 'undefined' && IncidentScenarios.getDefaultIncident());
      timeLimit = inc ? inc.slaSeconds : 45;
    } else if (mode === 'endless') {
      timeLimit = (params.timed === 'true') ? 45 : 0; // Relaxed continuous point farm by default
    }

    // 2. Check for an active session to restore on reload
    const savedSession = State.get('activeSession');
    const isExplicitNew = params.new === 'true' || params.reset === 'true';
    const canResume = !isExplicitNew &&
      mode !== 'retry_missed' &&
      mode !== 'incident' &&
      savedSession &&
      savedSession.inProgress &&
      !savedSession.isGameOver &&
      savedSession.language === language &&
      savedSession.difficulty === difficulty &&
      savedSession.mode === mode &&
      (!params.stage || String(savedSession.stage || 'marathon') === String(params.stage)) &&
      Array.isArray(savedSession.questionIds) &&
      savedSession.questionIds.length > 0 &&
      (Date.now() - (savedSession.lastUpdated || savedSession.startTime || 0)) < 2 * 60 * 60 * 1000;

    if (canResume) {
      const restoredQuestions = savedSession.questionIds
        .map(id => QuestionBank.getById(id))
        .filter(Boolean);

      if (restoredQuestions.length === savedSession.questionIds.length) {
        console.info('[Gameplay] Active in-progress session found. Restoring game engine state...');
        this.engine = new GameEngine();
        this.sessionConfig = {
          language,
          difficulty,
          mode,
          timeLimit: savedSession.timeLimit ?? timeLimit,
          questions: restoredQuestions,
          randomizeOrder: false
        };

        try {
          this.engine.startSession(this.sessionConfig);
          const session = this.engine.getSession();
          session.id = savedSession.id;
          session.currentIndex = Math.min(savedSession.currentIndex || 0, restoredQuestions.length - 1);
          session.totalScore = savedSession.totalScore || 0;
          session.currentStreak = savedSession.currentStreak || 0;
          session.highestStreak = savedSession.highestStreak || 0;
          session.questionsAttempted = savedSession.questionsAttempted || 0;
          session.questionsCorrect = savedSession.questionsCorrect || 0;
          session.hintsUsedCount = savedSession.hintsUsedCount || 0;
          session.retriesUsedCount = savedSession.retriesUsedCount || 0;
          if (typeof savedSession.lives === 'number') {
            session.lives = savedSession.lives;
          }
          if (Array.isArray(savedSession.results)) {
            session.results = [...savedSession.results];
          }
          if (Array.isArray(savedSession.usedHintQuestionIds)) {
            savedSession.usedHintQuestionIds.forEach(id => {
              this.engine._hintManager._usedHints.add(id);
            });
          }

          this.activeStage = STAGE_CONFIG[savedSession.stage] || STAGE_CONFIG.marathon;
          if (mode === 'boss') {
            const bossId = params.boss || (savedSession && savedSession.bossId) || 'null_leviathan';
            const bossData = (typeof BossEncounters !== 'undefined' && BossEncounters.getById(bossId)) || (typeof BossEncounters !== 'undefined' && BossEncounters.getDefaultBoss());
            this._setupBossEncounter(bossData);
          } else {
            this._initGhostDuelUI(difficulty);
          }
          this._bindEvents();
          const resumedQ = this.engine.getCurrentQuestion();
          this.renderQuestion(resumedQ);

          if (this.sessionConfig.timeLimit > 0) {
            this._startTimer(this.sessionConfig.timeLimit);
          } else {
            this._updateTimerDisplay('∞ Relaxed', false);
          }

          UI.updateHeaderProfile();
          UI.showToast(`Resumed in-progress challenge at Question ${session.currentIndex + 1} of ${session.questions.length}.`, 'info');
          return true;
        } catch (restoreErr) {
          console.warn('[Gameplay] Session restoration failed. Clearing active session and starting fresh.', restoreErr);
          State.set('activeSession', null, true);
        }
      }
    }

    // Clean one-time query parameters from browser URL so future reloads restore state cleanly
    if (params.new || params.reset) {
      try {
        const clean = new URL(window.location.href);
        clean.searchParams.delete('new');
        clean.searchParams.delete('reset');
        window.history.replaceState({}, '', clean.toString());
      } catch (_) {}
    }

    // 3. Load questions from QuestionBank with support for Endless Mode, Retry Missed and Topic Practice
    let questions = [];

    if (mode === 'duel') {
      const duelSeed = params.seed ? parseInt(params.seed, 10) : DuelEngine.generateSeed();
      const duelCount = Math.min(20, Math.max(3, parseInt(params.count || 10, 10)));
      questions = DuelEngine.getSynchronizedQuestionDeck({
        language,
        difficulty,
        seed: duelSeed,
        count: duelCount
      });
      this.isDuelMode = true;
    } else if (mode === 'incident') {
      const incidentId = params.incident || 'inc_memory_leak';
      const incData = (typeof IncidentScenarios !== 'undefined' && IncidentScenarios.getById(incidentId)) || (typeof IncidentScenarios !== 'undefined' && IncidentScenarios.getDefaultIncident());
      if (incData) {
        this.activeIncident = incData;
        const diagQ = incData.diagnosisQuestion;
        const patchQ = incData.patchQuestion;
        const diagCorrect = typeof diagQ.correctAnswer === 'number' ? diagQ.options[diagQ.correctAnswer] : diagQ.correctAnswer;
        const patchCorrect = typeof patchQ.correctAnswer === 'number' ? patchQ.options[patchQ.correctAnswer] : patchQ.correctAnswer;

        questions = [
          {
            ...diagQ,
            correctAnswer: diagCorrect,
            language: incData.language || 'python',
            difficulty: 'expert',
            topic: 'incident_response',
            subtopic: 'root_cause_analysis',
            phase: 1,
            incidentId: incData.id,
            code: incData.logs ? incData.logs.slice(-4).join('\n') : ''
          },
          {
            ...patchQ,
            correctAnswer: patchCorrect,
            language: incData.language || 'python',
            difficulty: 'expert',
            topic: 'incident_response',
            subtopic: 'hotfix_stabilization',
            phase: 2,
            incidentId: incData.id,
            code: incData.patchSnippet || ''
          }
        ];
      }
    } else if (mode === 'boss') {
      const bossId = params.boss || 'null_leviathan';
      const bossData = (typeof BossEncounters !== 'undefined' && BossEncounters.getById(bossId)) || (typeof BossEncounters !== 'undefined' && BossEncounters.getDefaultBoss());
      if (bossData) {
        this.activeBoss = bossData;
        questions = [...bossData.questions];
      }
    } else if (mode === 'endless') {
      questions = QuestionBank.getEndlessQuestions(language);
    } else if (mode === 'retry_missed') {
      let missedIds = [];
      try {
        const cached = sessionStorage.getItem('syntaxarena_retry_question_ids');
        if (cached) missedIds = JSON.parse(cached);
      } catch (e) {}
      if (!Array.isArray(missedIds) || missedIds.length === 0) {
        missedIds = activeProfile ? (activeProfile.missedQuestionIds || []) : [];
      }
      if (Array.isArray(missedIds) && missedIds.length > 0) {
        questions = missedIds
          .map(id => QuestionBank.getById(id))
          .filter(Boolean);
      }
    }

    if (params.topic && questions.length === 0) {
      const tKey = params.topic.toLowerCase().trim();
      const langPool = QuestionBank.getByLanguage(language);
      const topicMatches = langPool.filter(q =>
        (q.topic && q.topic.toLowerCase() === tKey) || (q.subtopic && q.subtopic.toLowerCase() === tKey)
      );
      if (topicMatches.length > 0) {
        questions = topicMatches;
      }
    }

    if (questions.length === 0) {
      questions = QuestionBank.getByDifficulty(language, difficulty);
      if (!questions || questions.length === 0) {
        questions = QuestionBank.getByLanguage(language);
      }
    }

    if (!questions || questions.length === 0) {
      console.error(`[Gameplay] No questions found for language=${language}, difficulty=${difficulty}`);
      UI.showToast('Failed to load challenge questions. Returning to Hub.', 'error');
      setTimeout(() => Router.navigateTo('index'), 2000);
      return false;
    }

    // STAGE SLICING: Support dividing the campaign into 8 Stages of 5 questions each
    let stageParam = params.stage ? String(params.stage).toLowerCase().trim() : 'marathon';
    let activeStage = STAGE_CONFIG[stageParam] || STAGE_CONFIG.marathon;

    if (mode === 'campaign' && stageParam !== 'marathon' && stageParam !== 'all') {
      const parsedStage = parseInt(stageParam, 10);
      if (parsedStage >= 1 && parsedStage <= 8) {
        activeStage = STAGE_CONFIG[parsedStage];
        if (questions.length < activeStage.endIndex) {
          questions = QuestionBank.getByLanguage(language);
        }
        questions = questions.slice(activeStage.startIndex, activeStage.endIndex);
      }
    }
    this.activeStage = activeStage;

    // 4. Initialize GameEngine
    this.engine = new GameEngine();
    this.sessionConfig = {
      language,
      difficulty,
      mode,
      timeLimit,
      questions,
      stage: activeStage.id,
      randomizeOrder: mode !== 'boss' && mode !== 'duel' && mode !== 'incident'
    };

    try {
      this.engine.startSession(this.sessionConfig);
    } catch (err) {
      console.error('[Gameplay] Failed to start engine session:', err);
      UI.showToast('Unable to start challenge session.', 'error');
      return false;
    }

    // 5. Update reactive state with active session snapshot
    this._saveSessionSnapshot();

    // 6. Bind DOM controls, keyboard shortcuts, Ghost Duel, 1v1 SyntaxDuel & CyberDrill Incident HUD
    if (mode === 'duel') {
      const incHud = Utils.qs('#hud-incident-monitor');
      if (incHud) incHud.style.display = 'none';
      this._initDuelUI(params);
    } else if (mode === 'boss') {
      const bossBar = Utils.qs('#hud-boss-battle-bar');
      if (bossBar) bossBar.style.display = 'block';
      const ghostRail = Utils.qs('#hud-ghost-duel-rail');
      if (ghostRail) ghostRail.style.display = 'none';
      const duelBar = Utils.qs('#hud-duel-versus-bar');
      if (duelBar) duelBar.style.display = 'none';
      const incHud = Utils.qs('#hud-incident-monitor');
      if (incHud) incHud.style.display = 'none';
    } else if (mode === 'incident') {
      const ghostRail = Utils.qs('#hud-ghost-duel-rail');
      if (ghostRail) ghostRail.style.display = 'none';
      const bossBar = Utils.qs('#hud-boss-battle-bar');
      if (bossBar) bossBar.style.display = 'none';
      const duelBar = Utils.qs('#hud-duel-versus-bar');
      if (duelBar) duelBar.style.display = 'none';
      this._initIncidentUI(params);
    } else {
      const duelBar = Utils.qs('#hud-duel-versus-bar');
      if (duelBar) duelBar.style.display = 'none';
      const incHud = Utils.qs('#hud-incident-monitor');
      if (incHud) incHud.style.display = 'none';
      this._initGhostDuelUI(difficulty);
    }
    this._bindEvents();

    // 7. Render first question
    const initialQuestion = this.engine.getCurrentQuestion();
    this.renderQuestion(initialQuestion);

    // 8. Start timer if timed mode
    if (timeLimit > 0) {
      this._startTimer(timeLimit);
    } else {
      this._updateTimerDisplay('∞ Relaxed', false);
    }

    // 9. Update profile header pill
    UI.updateHeaderProfile();

    // 10. Setup Boss encounter HUD if in boss mode
    if (mode === 'boss') {
      this._setupBossEncounter(this.activeBoss || (typeof BossEncounters !== 'undefined' && BossEncounters.getDefaultBoss()));
    }

    console.info(`[Gameplay] Session initialized (${language} • ${difficulty} • ${questions.length} questions)`);
    return true;
  } catch (err) {
    console.error('[Gameplay] Critical error during gameplay initialization:', err);
    const promptEl = Utils.qs('#q-prompt-text');
    if (promptEl) {
      promptEl.textContent = 'Unable to initialize gameplay challenge. Please return to the Hub or retry.';
      promptEl.style.color = 'var(--color-danger)';
    }
    const ansContainer = Utils.qs('#answer-interface-container');
    if (ansContainer) {
      ansContainer.innerHTML = `
        <div style="text-align: center; padding: 1.5rem 0;">
          <button class="btn-arcade btn-primary btn-sm" onclick="window.location.reload()">Retry Loading</button>
          <a href="index.html" class="btn-arcade btn-neutral btn-sm" style="margin-left: 0.5rem;">Return to Hub</a>
        </div>
      `;
    }
    UI.showToast('Gameplay initialization failed. Check console for details.', 'error');
    return false;
  }
},

  /**
   * Render question data safely into the DOM.
   * @param {object} q - Current question payload from engine
   */
  renderQuestion(q) {
    if (!q) return;

    this.currentSubmission = null;
    this.selectedOptionIndex = null;
    this.selectedBugLine = null;
    this.isSubmitting = false;
    this.isAdvancing = false;

    if (this._autoAdvanceTimer) {
      clearTimeout(this._autoAdvanceTimer);
      this._autoAdvanceTimer = null;
    }

    // Reset visual feedback containers
    const feedbackPanel = Utils.qs('#feedback-panel');
    const hintDrawer = Utils.qs('#hint-drawer');
    const submitBtn = Utils.qs('#btn-submit-answer');
    const hintBtn = Utils.qs('#btn-use-hint');
    const nextBtn = Utils.qs('#btn-next-question');
    const retryBtn = Utils.qs('#btn-retry-question');

    this._isRetryAttempt = false;

    const arenaCard = Utils.qs('#arena-card');
    if (arenaCard) {
      arenaCard.classList.remove('animate-pop', 'animate-shake', 'animate-question-in');
      void arenaCard.offsetWidth; // Force reflow
      arenaCard.classList.add('animate-question-in');
    }

    if (feedbackPanel) feedbackPanel.style.display = 'none';
    if (hintDrawer) hintDrawer.style.display = 'none';
    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.disabled = false;
    }
    if (retryBtn) retryBtn.style.display = 'none';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submit Answer';
      submitBtn.style.display = 'inline-flex';
    }

    // Configure hint button (disabled in Hardcore Mode & removed in 1v1 Duel)
    const isHardcore = this.sessionConfig && this.sessionConfig.mode === 'hardcore';
    const penalty = HINT_PENALTIES[q.difficulty] || 25;
    if (hintBtn) {
      if (this.isDuelMode) {
        hintBtn.style.display = 'none';
      } else if (isHardcore) {
        hintBtn.style.display = 'inline-flex';
        hintBtn.disabled = true;
        hintBtn.textContent = 'Hints Disabled (Hardcore)';
        hintBtn.style.opacity = '0.5';
      } else if (q.hasUsedHint) {
        hintBtn.style.display = 'inline-flex';
        hintBtn.disabled = true;
        hintBtn.textContent = 'Hint Activated';
        hintBtn.style.opacity = '0.6';
        if (hintDrawer) {
          const hintText = Utils.qs('#hint-drawer-text');
          if (hintText) hintText.textContent = q.hint || 'Carefully trace the variable assignments step-by-step.';
          hintDrawer.style.display = 'block';
        }
      } else {
        hintBtn.style.display = 'inline-flex';
        hintBtn.disabled = false;
        hintBtn.textContent = `Use Hint (-${penalty} pts)`;
        hintBtn.style.opacity = '1';
      }
    }

    // Update Hardcore lives if applicable
    this._updateLivesDisplay(q.lives ?? 3, q.maxLives ?? 3);

    // Update Academy review link to current question's language and difficulty tier
    const currentTrack = q.language || 'python';
    const currentDiff = q.difficulty || 'beginner';
    const academyReviewBtn = Utils.qs('#btn-arena-review-lesson');
    if (academyReviewBtn) {
      academyReviewBtn.href = `learn.html?lang=${encodeURIComponent(currentTrack)}&diff=${encodeURIComponent(currentDiff)}`;
    }
    const hintAcademyLink = Utils.qs('#hint-academy-link');
    if (hintAcademyLink) {
      hintAcademyLink.href = `learn.html?lang=${encodeURIComponent(currentTrack)}&diff=${encodeURIComponent(currentDiff)}`;
    }

    // Update HUD: Language, Step Counter, Progress Bar, Streak, Score
    const langMeta = LANGUAGE_METADATA[q.language] || LANGUAGE_METADATA.python;
    const hudLangTag = Utils.qs('#hud-lang-tag');
    if (hudLangTag) {
      hudLangTag.textContent = langMeta.name;
      hudLangTag.className = `tag-lang ${langMeta.tagClass}`;
    }

    const hudStep = Utils.qs('#hud-step-counter');
    if (hudStep) {
      if (this.sessionConfig && this.sessionConfig.mode === 'endless') {
        hudStep.textContent = `Question ${q.index + 1} of ${q.totalQuestions} (Endless Mode)`;
      } else {
        hudStep.textContent = `Question ${q.index + 1} of ${q.totalQuestions}`;
      }
    }

    // Accessible Progress Bar
    const progressFill = Utils.qs('#hud-progress-fill');
    const progressContainer = Utils.qs('#hud-progress-container');
    const progressPercent = Math.round((q.index / q.totalQuestions) * 100);
    if (progressFill) {
      progressFill.style.width = `${progressPercent}%`;
    }
    if (progressContainer) {
      progressContainer.setAttribute('aria-valuenow', String(progressPercent));
    }

    // Streak & Multiplier
    const streakText = Utils.qs('#hud-streak-text');
    const session = this.engine.getSession();
    const streak = session ? session.currentStreak : 0;
    const multiplier = Math.min(1.0 + (streak * 0.25), 3.0).toFixed(2);
    if (streakText) {
      streakText.textContent = `x${multiplier} Streak (${streak}🔥)`;
    }

    // Score
    const scoreDisplay = Utils.qs('#hud-score-display');
    if (scoreDisplay) {
      scoreDisplay.textContent = session ? session.totalScore : 0;
    }

    // Card Header Badges
    const formatBadge = Utils.qs('#q-format-badge');
    if (formatBadge) {
      formatBadge.textContent = this._formatTypeLabel(q.type);
      formatBadge.className = `badge ${this._getTypeBadgeClass(q.type)}`;
    }

    const diffBadge = Utils.qs('#q-diff-badge');
    const questionCard = Utils.qs('.arena-main-card') || Utils.qs('.card');
    if (diffBadge) {
      if (this.sessionConfig && this.sessionConfig.mode === 'endless') {
        diffBadge.textContent = `${q.difficulty.toUpperCase()} • ♾️ ENDLESS POINT FARM`;
        diffBadge.className = 'badge badge-primary';
        if (questionCard) questionCard.classList.remove('is-boss');
      } else if (this.activeStage && this.activeStage.isBoss) {
        const bossTitle = this.activeStage.id === 8 ? 'FINAL APEX BOSS' : 'MINI-BOSS STAGE';
        diffBadge.textContent = `${q.difficulty.toUpperCase()} • 💀 ${bossTitle} (Stage ${this.activeStage.id} / 8)`;
        diffBadge.className = 'badge badge-coral boss-pulse';
        if (questionCard) questionCard.classList.add('is-boss');
      } else if (this.activeStage && this.activeStage.id !== 'marathon') {
        diffBadge.textContent = `${q.difficulty.toUpperCase()} • Stage ${this.activeStage.id} / 8`;
        diffBadge.className = `badge ${q.difficulty === 'expert' ? 'badge-coral' : q.difficulty === 'intermediate' ? 'badge-amber' : 'badge-emerald'}`;
        if (questionCard) questionCard.classList.remove('is-boss');
      } else {
        diffBadge.textContent = q.difficulty.toUpperCase();
        diffBadge.className = `badge ${q.difficulty === 'expert' ? 'badge-coral' : q.difficulty === 'intermediate' ? 'badge-amber' : 'badge-emerald'}`;
        if (questionCard) questionCard.classList.remove('is-boss');
      }
    }

    // Toggle and update Endless Mode Bank button
    const bankBtn = Utils.qs('#btn-endless-bank');
    if (bankBtn) {
      if (this.sessionConfig && this.sessionConfig.mode === 'endless') {
        bankBtn.style.display = 'inline-flex';
        const session = this.engine ? this.engine.getSession() : null;
        const currentScore = session ? session.totalScore : 0;
        bankBtn.innerHTML = `💰 Bank ${currentScore} Pts & Finish`;
      } else {
        bankBtn.style.display = 'none';
      }
    }

    const topicTitle = Utils.qs('#q-topic-title');
    if (topicTitle) {
      const topicStr = (q.topic || 'Logic').replace(/_/g, ' ').toUpperCase();
      const subtopicStr = (q.subtopic || '').replace(/_/g, ' ');
      topicTitle.textContent = subtopicStr ? `${topicStr} • ${subtopicStr}` : topicStr;
    }

    // Prompt Text
    const promptText = Utils.qs('#q-prompt-text');
    if (promptText) {
      promptText.textContent = q.prompt;
    }

    // Code Terminal
    const terminalEl = Utils.qs('#code-terminal-container');
    const filenameEl = Utils.qs('#terminal-filename');
    const versionEl = Utils.qs('#terminal-version');
    const codePre = Utils.qs('#terminal-code-body');

    if (filenameEl) filenameEl.textContent = langMeta.filename;
    if (versionEl) versionEl.textContent = q.standardVersion || langMeta.version;

    if (q.code && q.code.trim()) {
      if (terminalEl) terminalEl.style.display = 'block';
      this._renderCodeSnippet(codePre, q.code, q.type === 'find_bug');
    } else {
      if (terminalEl) terminalEl.style.display = 'none';
    }

    // Render Answer Interface for Question Type
    this._renderAnswerInterface(q);

    // Update Ghost Speed Duel position rail, 1v1 SyntaxDuel HUD, or CyberDrill Incident HUD
    if (this.isDuelMode) {
      this._updateDuelVersusHUD();
    } else if (this.isIncidentMode) {
      this._updateIncidentTelemetryHUD();
    } else {
      this._updateGhostDuelTrack(q);
    }

    // Announce to Screen Readers
    this._announceLive(`Question ${q.index + 1} of ${q.totalQuestions}: ${q.prompt}`);
  },

  /**
   * Safely render code snippet preserving indentation and line numbers.
   * Enables click-to-select for 'find_bug' questions.
   */
  _renderCodeSnippet(container, codeStr, isFindBug = false) {
    if (!container) return;
    container.innerHTML = ''; // Clear previous

    const lines = codeStr.split('\n');
    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      const row = document.createElement('div');
      row.className = isFindBug ? 'code-line is-clickable' : 'code-line';
      row.setAttribute('data-line', String(lineNum));

      if (isFindBug) {
        row.setAttribute('role', 'button');
        row.setAttribute('tabindex', '0');
        row.setAttribute('aria-label', `Line ${lineNum}: ${lineText}`);
        row.onclick = () => this.selectBugLine(lineNum);
        row.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.selectBugLine(lineNum);
          }
        };
      }

      const numSpan = document.createElement('span');
      numSpan.className = 'code-line-number';
      numSpan.textContent = String(lineNum).padStart(2, '0');

      const textSpan = document.createElement('span');
      textSpan.className = 'code-line-text';
      textSpan.textContent = lineText;

      row.appendChild(numSpan);
      row.appendChild(textSpan);
      container.appendChild(row);
    });
  },

  /**
   * Render answer input appropriate to question format.
   * @param {object} q
   */
  _renderAnswerInterface(q) {
    const arenaBody = Utils.qs('#answer-interface-container');
    if (!arenaBody) return;
    arenaBody.innerHTML = '';

    const cleanType = String(q.type || '').replace(/-/g, '_');

    switch (cleanType) {
      case 'find_bug':
        this._renderFindBugInterface(arenaBody, q);
        break;

      case 'fill_code':
      case 'complete_code':
        this._renderFillCodeInterface(arenaBody, q);
        break;

      case 'multiple_choice':
      case 'predict_output':
      case 'code_tracing':
      default:
        this._renderMultipleChoiceInterface(arenaBody, q);
        break;
    }
  },

  /**
   * Render Multiple Choice / Predict Output Options Grid.
   */
  _renderMultipleChoiceInterface(container, q) {
    const grid = document.createElement('div');
    grid.className = 'options-grid';
    grid.setAttribute('role', 'radiogroup');
    grid.setAttribute('aria-label', 'Answer choices');

    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const options = q.options || [];

    options.forEach((opt, idx) => {
      const optText = typeof opt === 'object' && opt !== null ? (opt.text || opt.id) : String(opt);
      const letter = letters[idx] || String(idx + 1);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-card';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('data-index', String(idx));
      btn.setAttribute('data-letter', letter);

      const badge = document.createElement('span');
      badge.className = 'option-key-badge';
      badge.textContent = letter;

      const textSpan = document.createElement('span');
      textSpan.style.flex = '1';
      textSpan.textContent = optText;

      btn.appendChild(badge);
      btn.appendChild(textSpan);

      btn.onclick = () => {
        this.selectOption(idx, optText);
      };

      grid.appendChild(btn);
    });

    container.appendChild(grid);

    // If Predict Output, display helpful normalization guideline
    if (q.type.includes('predict')) {
      const helper = document.createElement('div');
      helper.style.fontSize = 'var(--text-xs)';
      helper.style.color = 'var(--text-muted)';
      helper.style.fontStyle = 'italic';
      helper.style.marginBottom = 'var(--space-3)';
      container.appendChild(helper);
    }
  },

  /**
   * Render Find the Bug Interface.
   */
  _renderFindBugInterface(container, q) {
    const bar = document.createElement('div');
    bar.className = 'line-selector-bar';

    const title = document.createElement('span');
    title.className = 'line-selector-title';
    title.textContent = 'Defect Location:';

    const pillsContainer = document.createElement('div');
    pillsContainer.className = 'line-pills-container';

    const lineCount = (q.code || '').split('\n').length;
    for (let i = 1; i <= lineCount; i++) {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'line-pill-btn';
      pill.setAttribute('data-line', String(i));
      pill.textContent = `Line ${i}`;

      pill.onclick = () => {
        this.selectBugLine(i);
      };

      pillsContainer.appendChild(pill);
    }

    bar.appendChild(title);
    bar.appendChild(pillsContainer);
    container.appendChild(bar);

    const helpText = document.createElement('div');
    helpText.style.fontSize = 'var(--text-xs)';
    helpText.style.color = 'var(--text-secondary)';
    helpText.style.marginBottom = 'var(--space-4)';
    helpText.textContent = 'Click on the buggy line directly in the code window above or tap a line button.';
    container.appendChild(helpText);
  },

  /**
   * Render Fill the Code Input Field & Token Quick-Picks.
   */
  _renderFillCodeInterface(container, q) {
    const wrap = document.createElement('div');
    wrap.className = 'fill-code-container';

    const label = document.createElement('label');
    label.setAttribute('for', 'fill-code-input');
    label.style.fontSize = 'var(--text-sm)';
    label.style.fontWeight = '700';
    label.style.color = 'var(--text-primary)';
    label.textContent = 'Enter the missing code statement or token:';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'fill-code-input';
    input.className = 'fill-code-input';
    input.placeholder = 'Type missing keyword, expression, or identifier...';
    input.autocomplete = 'off';
    input.spellcheck = false;

    input.oninput = (e) => {
      this.inputFillCode(e.target.value);
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (this.currentSubmission) {
          this.submitCurrentAnswer();
        }
      }
    };

    wrap.appendChild(label);
    wrap.appendChild(input);
    container.appendChild(wrap);

    // If options are provided, render token quick-pick chips
    if (Array.isArray(q.options) && q.options.length > 0) {
      const chipsGroup = document.createElement('div');
      chipsGroup.className = 'token-chips-group';

      const chipsLabel = document.createElement('span');
      chipsLabel.style.fontSize = 'var(--text-xs)';
      chipsLabel.style.color = 'var(--text-muted)';
      chipsLabel.textContent = 'Suggested Tokens:';
      chipsGroup.appendChild(chipsLabel);

      q.options.forEach(tok => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'token-chip';
        chip.textContent = tok;
        chip.onclick = () => {
          input.value = tok;
          this.inputFillCode(tok);
          input.focus();
        };
        chipsGroup.appendChild(chip);
      });

      container.appendChild(chipsGroup);
    }

    // Auto-focus the input
    setTimeout(() => input.focus(), 100);
  },

  /**
   * Select a multiple choice or predict output option.
   */
  selectOption(idx, optionText) {
    AudioEngine.playClick();
    this.selectedOptionIndex = idx;
    this.currentSubmission = optionText;

    const cards = Utils.qsa('.option-card');
    cards.forEach((card, i) => {
      if (i === idx) {
        card.classList.add('is-selected');
        card.setAttribute('aria-checked', 'true');
      } else {
        card.classList.remove('is-selected');
        card.setAttribute('aria-checked', 'false');
      }
    });

    const submitBtn = Utils.qs('#btn-submit-answer');
    if (submitBtn) {
      submitBtn.disabled = false;
    }
  },

  /**
   * Select a defective code line for 'find_bug'.
   */
  selectBugLine(lineNum) {
    AudioEngine.playClick();
    this.selectedBugLine = lineNum;
    this.currentSubmission = lineNum;

    // Highlight line in code terminal
    const lines = Utils.qsa('.code-line');
    lines.forEach(row => {
      const rowLine = parseInt(row.getAttribute('data-line'), 10);
      if (rowLine === lineNum) {
        row.classList.add('is-selected-bug');
      } else {
        row.classList.remove('is-selected-bug');
      }
    });

    // Highlight line selector pill
    const pills = Utils.qsa('.line-pill-btn');
    pills.forEach(pill => {
      const pLine = parseInt(pill.getAttribute('data-line'), 10);
      if (pLine === lineNum) {
        pill.classList.add('is-active');
      } else {
        pill.classList.remove('is-active');
      }
    });

    const submitBtn = Utils.qs('#btn-submit-answer');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = `Submit Line ${lineNum}`;
    }
  },

  /**
   * Handle text input in 'fill_code' questions.
   */
  inputFillCode(text) {
    const val = (text || '').trim();
    this.currentSubmission = val;

    const submitBtn = Utils.qs('#btn-submit-answer');
    if (submitBtn) {
      submitBtn.disabled = val.length === 0;
    }
  },

  /**
   * Submit current answer to the GameEngine.
   */
  submitCurrentAnswer() {
    const now = Date.now();
    if (this.isSubmitting || (now - this._lastSubmitTime < 350) || this.currentSubmission === null || this.currentSubmission === undefined) return;
    this.isSubmitting = true;
    this._lastSubmitTime = now;

    // Pause timer while evaluating feedback
    this._stopTimer();

    const submitBtn = Utils.qs('#btn-submit-answer');
    if (submitBtn) submitBtn.disabled = true;

    const timeRemaining = this.timer.timeRemaining;

    let result;
    try {
      result = this.engine.submitAnswer(this.currentSubmission, timeRemaining);
      this._saveSessionSnapshot();
      this._processGhostSplitOnAnswer(result.correct);
    } catch (err) {
      console.error('[Gameplay] Submission rejected by engine:', err);
      this.isSubmitting = false;
      return;
    }

    const arenaCard = Utils.qs('#arena-card');

    if (result.correct) {
      // Correct Answer Flow
      this.consecutiveMistakes = 0;
      AudioEngine.playSuccess();
      AudioEngine.playStreak();

      if (arenaCard) {
        arenaCard.classList.remove('animate-shake');
        arenaCard.classList.add('animate-pop');
      }

      if (this._isRetryAttempt) {
        const session = this.engine ? this.engine.getSession() : null;
        if (session) {
          if (result.points > 0) {
            session.totalScore = Math.max(0, session.totalScore - result.points);
          }
          session.currentStreak = 0;
          if (Array.isArray(session.results) && session.results.length > 0) {
            const curRes = session.results[session.results.length - 1];
            if (curRes && curRes.index === session.currentIndex) {
              curRes.points = 0;
              curRes.basePoints = 0;
              curRes.speedBonus = 0;
              curRes.multiplier = 1.0;
              curRes.streak = 0;
              curRes.retried = true;
            }
          }
        }
        result.points = 0;
        result.streak = 0;
      } else {
        // Streak milestone bonuses (3 in a row -> +30 pts, 5 in a row -> +50 pts)
        const session = this.engine ? this.engine.getSession() : null;
        if (session) {
          if (session.currentStreak === 3) {
            session.totalScore += 30;
            result.points += 30;
            UI.showToast('🔥 3-in-a-Row Streak Bonus! +30 Points!', 'success');
          } else if (session.currentStreak === 5) {
            session.totalScore += 50;
            result.points += 50;
            UI.showToast('⚡ 5-in-a-Row Mega Streak Bonus! +50 Points!', 'success');
          }
        }
      }

      let mathMsg = '';
      if (this._isRetryAttempt) {
        mathMsg = 'Score Math: +0 pts (Original attempt counted as incorrect for stage accuracy). Great job learning the answer!';
      } else {
        const base = result.basePoints || (this.sessionConfig && this.sessionConfig.difficulty === 'expert' ? 350 : this.sessionConfig && this.sessionConfig.difficulty === 'intermediate' ? 200 : 100);
        const speed = result.speedBonus || 0;
        const hintPen = result.hintPenalty || 0;
        const mult = (result.multiplier || 1.0).toFixed(2);
        const parts = [`${base} base`];
        if (hintPen > 0) parts.push(`-${hintPen} hint penalty`);
        if (speed > 0) parts.push(`+${speed} speed bonus (${timeRemaining}s left)`);
        mathMsg = `Score Math: (${parts.join(' ')}) × ${mult}x streak = +${result.points} pts`;
      }

      this._displayFeedback({
        type: 'correct',
        title: this._isRetryAttempt ? 'Correct on Retry!' : 'Correct Deduction!',
        points: result.points,
        streak: result.streak,
        explanation: result.explanation,
        message: mathMsg
      });

      // Highlight selected option card in green
      if (this.selectedOptionIndex !== null) {
        const cards = Utils.qsa('.option-card');
        if (cards[this.selectedOptionIndex]) {
          cards[this.selectedOptionIndex].classList.add('is-correct');
        }
      }

      this._announceLive(this._isRetryAttempt
        ? 'Correct answer on retry! 0 points added for retried question.'
        : `Correct answer! +${result.points} points awarded. Current streak: ${result.streak}.`
      );

      // Boss Battle Turn processing on correct answer
      if (this.sessionConfig && this.sessionConfig.mode === 'boss') {
        this._processBossTurn(result, timeRemaining);
      }

      // 1v1 SyntaxDuel record local progress
      if (this.isDuelMode) {
        const sess = this.engine ? this.engine.getSession() : null;
        if (sess) {
          DuelEngine.recordLocalAnswer({
            questionIndex: sess.currentIndex,
            isCorrect: true,
            score: sess.totalScore,
            streak: sess.currentStreak,
            pointsEarned: result.points || 0
          });
          this._updateDuelVersusHUD();
        }
      }

      // CyberDrill Incident Response processing on correct triage
      if (this.isIncidentMode && typeof IncidentEngine !== 'undefined') {
        const currentQ = this.engine ? this.engine.getCurrentQuestion() : null;
        const isPhase1 = (currentQ && (currentQ.phase === 1 || currentQ.index === 0)) || (IncidentEngine.phase === 1);
        if (isPhase1) {
          IncidentEngine.submitDiagnosis(this.selectedOptionIndex);
          const phaseBadge = Utils.qs('#incident-phase-badge');
          if (phaseBadge) {
            phaseBadge.textContent = 'TRIAGE PHASE 2: HOTFIX PATCH DEPLOYMENT';
            phaseBadge.className = 'incident-badge badge-sev2';
          }
          UI.showToast('🎯 Root cause diagnosed correctly! Deploying hotfix patch...', 'success');
        } else {
          IncidentEngine.submitPatch(this.selectedOptionIndex);
          const hud = Utils.qs('#hud-incident-monitor');
          if (hud) {
            hud.classList.add('incident-stabilized-pulse');
          }
          const phaseBadge = Utils.qs('#incident-phase-badge');
          if (phaseBadge) {
            phaseBadge.textContent = 'INCIDENT MITIGATED: TELEMETRY NOMINAL';
            phaseBadge.className = 'incident-badge badge-nominal';
          }
          const sevBadge = Utils.qs('#incident-sev-badge');
          if (sevBadge) {
            sevBadge.textContent = 'STATUS: RESOLVED';
            sevBadge.className = 'incident-badge badge-nominal';
          }
          UI.showToast('🚀 Hotfix patch deployed! Telemetry returning to healthy thresholds!', 'success');
        }
      }

      // Auto-advance to next question automatically after 2.0s delay
      if (this._autoAdvanceTimer) {
        clearTimeout(this._autoAdvanceTimer);
      }
      this._autoAdvanceTimer = setTimeout(() => {
        this.advanceNextQuestion();
      }, 2000);
    } else {
      // Incorrect Answer Flow
      AudioEngine.playError();

      if (arenaCard) {
        arenaCard.classList.remove('animate-pop');
        arenaCard.classList.add('animate-shake');
      }

      if (result.canRetry) {
        // Second Chance Retry Unlocked
        this._displayFeedback({
          type: 'retry',
          title: 'Second Chance Unlocked!',
          message: 'Your answer is incorrect, but you unlocked a retry because you activated a hint. Review the clue and try again.'
        });

        // Re-enable answer controls for 1 retry
        this.currentSubmission = null;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submit Second Chance Retry';
        }

        // Deselect visual cards
        Utils.qsa('.option-card').forEach(c => c.classList.remove('is-selected'));
        Utils.qsa('.line-pill-btn').forEach(p => p.classList.remove('is-active'));
        Utils.qsa('.code-line').forEach(l => l.classList.remove('is-selected-bug'));

        this._announceLive('Incorrect answer. Second Chance retry unlocked. Review the clue and try again.');
        this.isSubmitting = false;
        return;
      } else {
        // No retry available (or retry failed)
        if (result.gameOver) {
          // Hardcore Game Over
          this._displayFeedback({
            type: 'incorrect',
            title: '💀 GAME OVER — Hearts Depleted',
            correctAnswer: result.correctAnswer,
            explanation: `${result.explanation || ''} You lost your last heart. The hardcore run has ended. All XP and progress achieved have been saved.`,
            isGameOver: true
          });
          this._updateLivesDisplay(0, 3);
          this._announceLive('Game over! You have lost all hearts. Run terminated.');

          // Populate Game Over Modal Stats
          const summary = this.engine.getSessionSummary();
          const solvedEl = Utils.qs('#gameover-solved-count');
          const scoreEl = Utils.qs('#gameover-score-count');
          const streakEl = Utils.qs('#gameover-streak-count');
          if (solvedEl) solvedEl.textContent = summary ? summary.questionsCorrect : 0;
          if (scoreEl) scoreEl.textContent = summary ? summary.totalScore.toLocaleString() : 0;
          if (streakEl) streakEl.textContent = `${summary ? summary.bestStreak : 0}🔥`;

          // Show modal after brief inspection pause
          setTimeout(() => {
            UI.openModal('modal-game-over');
          }, 1400);
        } else {
          this._displayFeedback({
            type: 'incorrect',
            title: result.lives !== undefined ? `Incorrect (${result.lives} ♥ left)` : 'Incorrect Answer',
            message: 'Score Math: 0 pts (Streak reset to 0)',
            correctAnswer: result.correctAnswer,
            explanation: result.explanation
          });
          if (result.lives !== undefined) {
            this._updateLivesDisplay(result.lives, 3);
          }
          this._announceLive('Incorrect answer. The explanation has been revealed.');
        }

        // Highlight user's incorrect option in red and correct in green
        if (this.selectedOptionIndex !== null) {
          const cards = Utils.qsa('.option-card');
          if (cards[this.selectedOptionIndex]) {
            cards[this.selectedOptionIndex].classList.add('is-incorrect');
          }
        }

        // Boss Battle Turn counter-attack on incorrect answer
        if (this.sessionConfig && this.sessionConfig.mode === 'boss' && !result.canRetry) {
          this._processBossTurn(result, timeRemaining);
        }

        // 1v1 SyntaxDuel record local progress on incorrect & blunder point transfer
        if (this.isDuelMode) {
          const sess = this.engine ? this.engine.getSession() : null;
          if (sess) {
            DuelEngine.recordLocalAnswer({
              questionIndex: sess.currentIndex,
              isCorrect: false,
              score: sess.totalScore,
              streak: 0,
              pointsEarned: 0
            });
            DuelEngine.recordBlunder({ blunderPlayer: 'p1', points: 100 });
            UI.showToast(`⚡ BLUNDER! Incorrect answer: +100 PTS awarded to Opponent!`, 'warning');
            this._updateDuelVersusHUD();
          }
        }

        // CyberDrill Incident Response processing on incorrect triage
        if (this.isIncidentMode && typeof IncidentEngine !== 'undefined') {
          const currentQ = this.engine ? this.engine.getCurrentQuestion() : null;
          if (currentQ && currentQ.phase === 1) {
            IncidentEngine.submitDiagnosis(this.selectedOptionIndex);
            UI.showToast('❌ Incorrect root cause diagnosis! Review streaming logs and stack trace.', 'error');
          } else if (currentQ && currentQ.phase === 2) {
            IncidentEngine.submitPatch(this.selectedOptionIndex);
            UI.showToast('❌ Ineffective patch! Systems still destabilizing.', 'error');
          }
        }

        // Speed Ghost Tug-of-War Setback: pull back player progress on error
        this._applyTugOfWarSetback();

        // 3-Mistakes Tracker: Suggest Cyber Academy lesson if struggling
        this.consecutiveMistakes = (this.consecutiveMistakes || 0) + 1;
        if (this.consecutiveMistakes >= 3 && !result.gameOver) {
          this._promptAcademyRecommendation();
        }
      }
    }

    // Update HUD Score & Streak with responsive animation
    const session = this.engine.getSession();
    if (session) {
      const scoreDisplay = Utils.qs('#hud-score-display');
      if (scoreDisplay) {
        const prevScore = parseInt((scoreDisplay.textContent || '0').replace(/,/g, ''), 10) || 0;
        if (session.totalScore !== prevScore) {
          UI.animateValue(scoreDisplay, prevScore, session.totalScore, 350, (val) => Math.round(val).toLocaleString());
          scoreDisplay.classList.remove('animate-score-pulse');
          void scoreDisplay.offsetWidth;
          scoreDisplay.classList.add('animate-score-pulse');
        } else {
          scoreDisplay.textContent = session.totalScore.toLocaleString();
        }
      }

      const streakText = Utils.qs('#hud-streak-text');
      if (streakText) {
        const mult = Math.min(1.0 + (session.currentStreak * 0.25), 3.0).toFixed(2);
        streakText.textContent = `x${mult} Streak (${session.currentStreak}🔥)`;
        if (session.currentStreak > 1 && result.correct) {
          streakText.classList.remove('animate-streak-pulse');
          void streakText.offsetWidth;
          streakText.classList.add('animate-streak-pulse');
        }
      }

      const bankBtn = Utils.qs('#btn-endless-bank');
      if (bankBtn && this.sessionConfig && this.sessionConfig.mode === 'endless') {
        bankBtn.innerHTML = `💰 Bank ${session.totalScore} Pts & Finish`;
      }
    }

    this.isSubmitting = false;
  },

  /**
   * Display accessible feedback panel with explanation and next-question button.
   */
  _displayFeedback({ type, title, points, streak, message, correctAnswer, explanation, isGameOver }) {
    const panel = Utils.qs('#feedback-panel');
    const titleEl = Utils.qs('#feedback-title');
    const badgeEl = Utils.qs('#feedback-badge');
    const bodyEl = Utils.qs('#feedback-body');
    const explanationEl = Utils.qs('#feedback-explanation-text');
    const nextBtn = Utils.qs('#btn-next-question');
    const retryBtn = Utils.qs('#btn-retry-question');
    const submitBtn = Utils.qs('#btn-submit-answer');

    if (!panel) return;

    panel.className = `feedback-panel feedback-panel-${type}`;
    panel.style.display = 'block';

    if (titleEl) titleEl.textContent = title;

    if (badgeEl) {
      badgeEl.textContent = type === 'correct' ? 'SUCCESS' : (type === 'retry' ? 'RETRY' : (isGameOver ? 'GAME OVER' : 'DEFECT'));
      badgeEl.className = `badge ${type === 'correct' ? 'badge-emerald' : (type === 'retry' ? 'badge-amber' : 'badge-coral')}`;
    }

    if (bodyEl) {
      if (type === 'correct') {
        bodyEl.textContent = message || `Awesome! You earned +${points} points with a ${streak}x streak.`;
      } else if (type === 'retry') {
        bodyEl.textContent = message;
      } else {
        bodyEl.textContent = message || (correctAnswer ? `Expected correct answer: ${correctAnswer}` : 'Better luck on the next challenge!');
      }
    }

    if (explanationEl) {
      if (explanation) {
        explanationEl.textContent = explanation;
        explanationEl.style.display = 'block';
      } else {
        explanationEl.style.display = 'none';
      }
    }

    // Show Next Question and Retry actions if answer is resolved
    if (type !== 'retry') {
      if (submitBtn) submitBtn.style.display = 'none';
      if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.disabled = false;
        const session = this.engine.getSession();
        const isFinal = isGameOver || (session && (session.isGameOver || session.currentIndex >= session.questions.length - 1));
        nextBtn.textContent = isFinal ? 'Finish Run & View Results →' : 'Next Question →';
        nextBtn.focus();
      }
      if (retryBtn) {
        if (type === 'incorrect' && !isGameOver && !this.isDuelMode) {
          retryBtn.style.display = 'inline-flex';
        } else {
          retryBtn.style.display = 'none';
        }
      }
    }
  },

  /**
   * Request hint from the engine.
   */
  requestHint() {
    if (!this.engine) return;

    const res = this.engine.requestHint();
    if (!res.success) {
      UI.showToast(res.message || 'Hint unavailable.', 'info');
      return;
    }

    AudioEngine.playHint();

    const hintDrawer = Utils.qs('#hint-drawer');
    const hintText = Utils.qs('#hint-drawer-text');
    const hintBtn = Utils.qs('#btn-use-hint');

    if (hintDrawer && hintText) {
      hintText.textContent = res.hint || 'Carefully examine standard semantics for this construct.';
      hintDrawer.style.display = 'block';
      const hintAcademyLink = Utils.qs('#hint-academy-link');
      if (hintAcademyLink && this.engine && this.engine.session) {
        hintAcademyLink.href = `learn.html?lang=${encodeURIComponent(this.engine.session.language)}&diff=${encodeURIComponent(this.engine.session.difficulty)}`;
      }
    }

    if (hintBtn) {
      hintBtn.disabled = true;
      hintBtn.textContent = 'Hint Activated';
      hintBtn.style.opacity = '0.6';
    }

    this._saveSessionSnapshot();
    UI.showToast(`Pedagogical hint revealed (-${res.penalty} pts). Second Chance retry unlocked if needed!`, 'info');
    this._announceLive(`Hint revealed: ${res.hint}`);
  },

  /**
   * Retry the current question after an incorrect answer.
   * Resets selection interface and allows another submission without awarding points.
   */
  retryCurrentQuestion() {
    if (!this.engine) return;
    const session = this.engine.getSession();
    if (!session || session.isGameOver) return;

    this._isRetryAttempt = true;

    // Retain failed attempt in session results so first-pass test accuracy is honest and not falsely 100%
    if (Array.isArray(session.results) && session.results.length > 0) {
      const lastRes = session.results[session.results.length - 1];
      if (lastRes && lastRes.index === session.currentIndex) {
        lastRes.retried = true;
      }
    }

    // Set engine state back to ACTIVE so submitAnswer can be invoked
    this.engine._state = ENGINE_STATES.ACTIVE;

    // Reset visual elements
    const feedbackPanel = Utils.qs('#feedback-panel');
    const nextBtn = Utils.qs('#btn-next-question');
    const retryBtn = Utils.qs('#btn-retry-question');
    const submitBtn = Utils.qs('#btn-submit-answer');

    if (feedbackPanel) feedbackPanel.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (retryBtn) retryBtn.style.display = 'none';

    if (submitBtn) {
      submitBtn.style.display = 'inline-flex';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submit Answer';
    }

    // Deselect options, code lines, and clear inputs
    this.currentSubmission = null;
    this.selectedOptionIndex = null;
    this.selectedBugLine = null;

    Utils.qsa('.option-card').forEach(c => {
      c.classList.remove('is-selected', 'is-correct', 'is-incorrect');
      c.setAttribute('aria-checked', 'false');
    });
    Utils.qsa('.line-pill-btn').forEach(p => p.classList.remove('is-active'));
    Utils.qsa('.code-line').forEach(l => l.classList.remove('is-selected-bug'));

    const fillInput = Utils.qs('#fill-code-input');
    if (fillInput) {
      fillInput.value = '';
      fillInput.focus();
    }

    // Resume countdown timer & ghost tracking so clock and ghost do not freeze on retry
    if (this.sessionConfig && this.sessionConfig.timeLimit > 0) {
      const resumeSeconds = (this.timer && this.timer.timeRemaining > 5)
        ? this.timer.timeRemaining
        : Math.min(20, this.sessionConfig.timeLimit);
      this._startTimer(resumeSeconds);
    }

    if (this.ghostDuel) {
      this.ghostDuel.questionStartTime = Date.now();
    }

    if (typeof AudioEngine !== 'undefined' && AudioEngine.playClick) {
      AudioEngine.playClick();
    }

    this._announceLive('Retrying question. Select an answer and click Submit Answer.');
  },

  /**
   * Advance to the next question or complete the session with debounce protection.
   */
  advanceNextQuestion() {
    if (this._autoAdvanceTimer) {
      clearTimeout(this._autoAdvanceTimer);
      this._autoAdvanceTimer = null;
    }

    const now = Date.now();
    if (this.isAdvancing || (now - this._lastAdvanceTime < 350) || !this.engine) return;
    this.isAdvancing = true;
    this._lastAdvanceTime = now;

    const nextBtn = Utils.qs('#btn-next-question');
    if (nextBtn) nextBtn.disabled = true;

    AudioEngine.playClick();

    let advResult;
    try {
      advResult = this.engine.nextQuestion();
    } catch (err) {
      console.error('[Gameplay] Advancement error:', err);
      this.isAdvancing = false;
      return;
    }

    if (advResult.advanced) {
      // Render next question
      this.renderQuestion(advResult.question);
      this._saveSessionSnapshot();

      // Restart timer if timed
      if (this.sessionConfig.timeLimit > 0) {
        this._startTimer(this.sessionConfig.timeLimit);
      }
    } else if (advResult.completed) {
      // Session Completed!
      this._completeSession();
    }

    this.isAdvancing = false;
  },

  /**
   * Finalize completed session idempotently and navigate to results page.
   */
  _completeSession() {
    if (this.isCompleted) {
      console.warn('[Gameplay] Session already completed. Skipping redundant finalization.');
      return;
    }
    this.isCompleted = true;

    if (this._autoAdvanceTimer) {
      clearTimeout(this._autoAdvanceTimer);
      this._autoAdvanceTimer = null;
    }
    this._stopTimer();

    // Disable buttons immediately
    const submitBtn = Utils.qs('#btn-submit-answer');
    const nextBtn = Utils.qs('#btn-next-question');
    const bankBtn = Utils.qs('#btn-endless-bank');
    if (submitBtn) submitBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    if (bankBtn) bankBtn.disabled = true;

    // Clear active session in State and Storage immediately so it cannot be resumed
    State.set('activeSession', null, true);

    const summary = this.engine.getSessionSummary();

    // Calculate stage stars (0 to 3) based on accuracy
    const accuracy = summary.questionsAttempted > 0 ? Math.round((summary.questionsCorrect / summary.questionsAttempted) * 100) : 0;
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;
    summary.stars = stars;

    if (this.activeStage) {
      summary.stage = this.activeStage.id;
      summary.stageName = this.activeStage.name;
      summary.isBoss = this.activeStage.isBoss;
    } else {
      summary.stage = 'marathon';
      summary.stageName = 'Tier Marathon';
      summary.isBoss = false;
    }

    // Flawless Run Bonus: 100% accuracy with zero errors (+100 points & confetti)
    if (summary && summary.questionsAttempted > 0 &&
        summary.questionsCorrect === summary.totalQuestions &&
        summary.questionsAttempted === summary.totalQuestions &&
        (summary.retriesUsedCount || 0) === 0) {
      summary.isFlawless = true;
      summary.flawlessBonus = 100;
      summary.totalScore = (summary.totalScore || 0) + 100;
      UI.triggerConfetti();
      UI.showToast('🎯 FLAWLESS RUN BONUS! +100 Points for zero errors!', 'success');
    } else if (summary) {
      summary.isFlawless = false;
      summary.flawlessBonus = 0;
    }

    // Ghost Speed Duel Outcome Calculation
    if (this.ghostDuel && this.ghostDuel.enabled) {
      const isGhostVictory = (this.ghostDuel.playerCumulativeTime < this.ghostDuel.ghostCumulativeTime) && (accuracy >= 70);
      const ghostBonusXP = isGhostVictory ? 75 : 0;
      summary.ghostDuel = {
        enabled: true,
        opponentName: this.ghostDuel.opponentName || 'CyberPhantom',
        playerTime: Number(this.ghostDuel.playerCumulativeTime.toFixed(1)),
        ghostTime: Number(this.ghostDuel.ghostCumulativeTime.toFixed(1)),
        delta: Number((this.ghostDuel.ghostCumulativeTime - this.ghostDuel.playerCumulativeTime).toFixed(1)),
        isVictory: isGhostVictory,
        bonusXP: ghostBonusXP
      };

      if (isGhostVictory) {
        summary.totalScore = (summary.totalScore || 0) + ghostBonusXP;
        const activeProf = Profile.getActiveProfile();
        if (activeProf) {
          activeProf.stats = activeProf.stats || {};
          activeProf.stats.ghostDuelsWon = (activeProf.stats.ghostDuelsWon || 0) + 1;
          activeProf.xp = (activeProf.xp || 0) + ghostBonusXP;
          activeProf.lifetimeXP = (activeProf.lifetimeXP || 0) + ghostBonusXP;
          Profile.updateProfile(activeProf.id, {
            stats: activeProf.stats,
            xp: activeProf.xp,
            lifetimeXP: activeProf.lifetimeXP
          });
        }
      }
    }

    // Persist session summary for results page pickup
    try {
      sessionStorage.setItem('syntaxarena_last_session_summary', JSON.stringify(summary));
    } catch (e) {
      // Fallback in memory
    }

    // Record stats to player profile and process gamification rewards (idempotent)
    let recordRes = null;
    try {
      recordRes = Profile.recordSessionResult(summary);
      if (recordRes) {
        sessionStorage.setItem('syntaxarena_last_session_rewards', JSON.stringify(recordRes));
        if (recordRes.isRepeatClear) {
          UI.showToast('ℹ Level already cleared previously. Play a new level to earn milestone clear points!', 'info');
        }
      }

      // Record stage progress & stars (skip if user is only retrying missed questions or endless mode)
      const activeProf = Profile.getActiveProfile();
      if (activeProf && summary.stage !== 'marathon' && summary.mode !== 'retry_missed' && !summary.isRetryMissed && summary.mode !== 'endless') {
        const stageKey = `${summary.language}_${summary.difficulty}_stage_${summary.stage}`;
        const prevStars = (activeProf.stageStars && activeProf.stageStars[stageKey]) || 0;
        const newStars = Math.max(prevStars, stars);
        const stageStars = { ...(activeProf.stageStars || {}), [stageKey]: newStars };
        const completedStages = { ...(activeProf.completedStages || {}), [stageKey]: true };
        Profile.updateProfile(activeProf.id, { stageStars, completedStages });
      }
    } catch (e) {
      console.warn('[Gameplay] Could not record session to profile:', e);
    }

    // Audio fanfare
    AudioEngine.playLevelUp();

    // 1v1 SyntaxDuel post-match flow (render head-to-head modal without navigating away)
    if (this.isDuelMode) {
      this.isCompleted = true;
      this._stopTimer();
      const totalElapsedMs = summary ? (summary.totalTimeMs || (Date.now() - (summary.startTime || Date.now()))) : 0;
      const matchResult = DuelEngine.recordLocalFinish(totalElapsedMs);

      const activeProf = Profile.getActiveProfile();
      if (activeProf) {
        activeProf.stats = activeProf.stats || {};
        if (matchResult && matchResult.isHostWin) {
          activeProf.stats.duelsWon = (activeProf.stats.duelsWon || 0) + 1;
        }
        activeProf.xp = (activeProf.xp || 0) + (summary.totalScore || 0);
        Profile.updateProfile(activeProf.id, { stats: activeProf.stats, xp: activeProf.xp });
      }

      this._renderDuelResults(matchResult);
      return;
    }

    // CyberDrill Incident Response post-mortem flow (render post-mortem modal without navigating away)
    if (this.isIncidentMode) {
      this.isCompleted = true;
      this._stopTimer();
      if (this.incidentTelemetryInterval) {
        clearInterval(this.incidentTelemetryInterval);
        this.incidentTelemetryInterval = null;
      }
      this._renderIncidentPostMortem();
      return;
    }

    // Navigate to results page
    const params = {
      lang: summary.language,
      diff: summary.difficulty,
      mode: summary.mode,
      score: summary.totalScore,
      correct: summary.questionsCorrect,
      attempted: summary.questionsAttempted,
      total: summary.totalQuestions,
      sessionId: summary.sessionId,
      stage: summary.stage,
      streak: summary.bestStreak || summary.highestStreak || 0,
      bestStreak: summary.bestStreak || summary.highestStreak || 0
    };

    UI.showToast(summary.mode === 'endless' ? '💰 Endless points banked! Loading run summary...' : summary.isGameOver ? 'Hardcore run concluded. Recording career XP...' : 'Challenge completed! Loading stage analytics...', 'success');
    setTimeout(() => {
      Router.navigateTo('results', params);
    }, 700);
  },

  /**
   * Cash out and bank all accumulated endless points to player profile.
   */
  bankEndlessPoints() {
    if (!this.engine || this.isCompleted) return;
    const session = this.engine.getSession();
    if (!session) return;

    if (session.questionsAttempted === 0) {
      UI.showToast('Answer at least one question before banking points!', 'info');
      return;
    }

    this.engine.forfeitSession();
    UI.showToast(`💰 Successfully banked ${session.totalScore} Points!`, 'success');
    this._completeSession();
  },

  /**
   * Handle timer reaching 0:00 (Timeout).
   */
  handleTimeout() {
    if (this.isSubmitting) return;
    AudioEngine.playError();
    UI.showToast('Time expired!', 'error');

    // Auto-submit timeout
    this.currentSubmission = '__TIMEOUT__';
    this.submitCurrentAnswer();
  },

  /**
   * Exit confirmation modal controller.
   */
  promptExit() {
    this._stopTimer();
    UI.openModal('modal-confirm-exit');
  },

  confirmExit() {
    UI.closeModal('modal-confirm-exit');
    this._stopTimer();

    if (this.engine) {
      this.engine.forfeitSession();
    }

    State.set('activeSession', null);
    Router.navigateTo('index');
  },

  cancelExit() {
    UI.closeModal('modal-confirm-exit');
    // Resume timer if active and session is not showing explanation
    if (this.engine && this.engine.getState() === ENGINE_STATES.ACTIVE && this.sessionConfig.timeLimit > 0) {
      this._startTimer(this.timer.timeRemaining);
    }
  },

  /**
   * Start or resume countdown timer.
   */
  _startTimer(seconds) {
    this._stopTimer();
    this.timer.timeRemaining = seconds;
    this.timer.isRunning = true;

    this._updateTimerDisplay(this._formatSeconds(this.timer.timeRemaining), false);

    this.timer.intervalId = setInterval(() => {
      this.timer.timeRemaining--;

      // Dynamically advance Speed Ghost in real-time along track
      this._updateGhostRealTimeTrack();

      const isUrgent = this.timer.timeRemaining <= 10;
      this._updateTimerDisplay(this._formatSeconds(this.timer.timeRemaining), isUrgent);

      if (this.timer.timeRemaining <= 0) {
        this._stopTimer();
        this.handleTimeout();
      }
    }, 1000);
  },

  /**
   * Stop active timer interval.
   */
  _stopTimer() {
    if (this.timer.intervalId) {
      clearInterval(this.timer.intervalId);
      this.timer.intervalId = null;
    }
    if (this.incidentTelemetryInterval) {
      clearInterval(this.incidentTelemetryInterval);
      this.incidentTelemetryInterval = null;
    }
    this.timer.isRunning = false;
    const timerEl = Utils.qs('#hud-timer-display');
    if (timerEl) timerEl.classList.remove('timer-urgent');
  },

  /**
   * Update HUD hearts in Hardcore mode.
   * @param {number} lives
   * @param {number} maxLives
   */
  _updateLivesDisplay(lives = 3, maxLives = 3) {
    const livesContainer = Utils.qs('#hud-lives-container');
    const heartsDisplay = Utils.qs('#hud-hearts-display');
    const livesText = Utils.qs('#hud-lives-text');
    if (!livesContainer) return;

    if (this.sessionConfig && this.sessionConfig.mode === 'hardcore') {
      livesContainer.style.display = 'flex';
      if (livesText) {
        livesText.textContent = `${Math.max(0, lives)}/${maxLives}`;
      }
      if (heartsDisplay) {
        let html = '';
        for (let i = 0; i < maxLives; i++) {
          if (i < lives) {
            html += '<svg width="20" height="20" fill="var(--color-danger)" style="transition: transform 0.2s;"><use href="#icon-heart"></use></svg>';
          } else {
            html += '<svg width="20" height="20" fill="none" stroke="var(--text-muted)" stroke-width="2" style="opacity: 0.35;"><use href="#icon-heart"></use></svg>';
          }
        }
        heartsDisplay.innerHTML = html;
      }
    } else {
      livesContainer.style.display = 'none';
    }
  },

  _updateTimerDisplay(str, isUrgent) {
    const timerEl = Utils.qs('#hud-timer-display');
    if (timerEl) {
      timerEl.textContent = str;
      if (isUrgent) {
        timerEl.classList.add('timer-urgent');
      } else {
        timerEl.classList.remove('timer-urgent');
      }
    }
  },

  _formatSeconds(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  _formatTypeLabel(type) {
    const labels = {
      predict_output: 'Predict Output',
      multiple_choice: 'Multiple Choice',
      find_bug: 'Find the Bug',
      fill_code: 'Complete Code',
      complete_code: 'Complete Code',
      code_tracing: 'Code Tracing'
    };
    const key = String(type || '').replace(/-/g, '_');
    return labels[key] || 'Challenge';
  },

  _getTypeBadgeClass(type) {
    const key = String(type || '').replace(/-/g, '_');
    if (key === 'find_bug') return 'badge-coral';
    if (key === 'fill_code' || key === 'complete_code') return 'badge-amber';
    if (key === 'predict_output') return 'badge-violet';
    return 'badge-cyan';
  },

  _announceLive(msg) {
    const liveEl = Utils.qs('#gameplay-live-announcer');
    if (liveEl) {
      liveEl.textContent = msg;
    }
  },

  /**
   * Bind event listeners to DOM controls and window keys.
   */
  _bindEvents() {
    if (this._eventsBound) return;
    this._eventsBound = true;

    // Guard Results tab while game is active (Item 13)
    const resultsLinks = document.querySelectorAll('a[href*="results.html"]');
    resultsLinks.forEach(link => {
      link.classList.add('is-disabled');
      link.setAttribute('aria-disabled', 'true');
      link.style.opacity = '0.5';
      link.style.cursor = 'not-allowed';
      link.title = 'Results tab is locked while playing';
      link.addEventListener('click', (e) => {
        if (!this.isCompleted) {
          e.preventDefault();
          AudioEngine.playError();
          UI.showToast('🔒 Results tab is disabled while playing! Finish your challenge first.', 'warning');
        }
      });
    });

    // Submit Answer Button
    const submitBtn = Utils.qs('#btn-submit-answer');
    if (submitBtn) {
      submitBtn.onclick = () => {
        this.submitCurrentAnswer();
      };
    }

    // Endless Mode Bank Points Button
    const bankBtn = Utils.qs('#btn-endless-bank');
    if (bankBtn) {
      bankBtn.onclick = () => {
        this.bankEndlessPoints();
      };
    }

    // Hint Button
    const hintBtn = Utils.qs('#btn-use-hint');
    if (hintBtn) {
      hintBtn.onclick = () => {
        this.requestHint();
      };
    }

    // Retry Question Button
    const retryBtn = Utils.qs('#btn-retry-question');
    if (retryBtn) {
      retryBtn.onclick = () => {
        this.retryCurrentQuestion();
      };
    }

    // Next Question Button
    const nextBtn = Utils.qs('#btn-next-question');
    if (nextBtn) {
      nextBtn.onclick = () => {
        this.advanceNextQuestion();
      };
    }

    // Exit Game Buttons
    const exitBtn = Utils.qs('#btn-exit-game');
    if (exitBtn) {
      exitBtn.onclick = () => this.promptExit();
    }

    const cancelExitBtn = Utils.qs('#btn-cancel-exit');
    if (cancelExitBtn) {
      cancelExitBtn.onclick = () => this.cancelExit();
    }

    const cancelExitXBtn = Utils.qs('#btn-cancel-exit-x');
    if (cancelExitXBtn) {
      cancelExitXBtn.onclick = () => this.cancelExit();
    }

    const returnHubBtn = Utils.qs('#btn-return-hub-bottom');
    if (returnHubBtn) {
      returnHubBtn.onclick = () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          Router.navigateTo('index');
        }
      };
    }

    const confirmExitBtn = Utils.qs('#btn-confirm-exit');
    if (confirmExitBtn) {
      confirmExitBtn.onclick = () => this.confirmExit();
    }

    // Hardcore Game Over Modal Buttons
    const goResultsBtn = Utils.qs('#btn-gameover-results');
    if (goResultsBtn) {
      goResultsBtn.onclick = () => {
        UI.closeModal('modal-game-over');
        this._completeSession();
      };
    }

    const goHubBtn = Utils.qs('#btn-gameover-hub');
    if (goHubBtn) {
      goHubBtn.onclick = () => {
        UI.closeModal('modal-game-over');
        this._completeSession();
      };
    }

    // Mega-Boss Modal & Controls
    const switchBossBtn = Utils.qs('#btn-switch-boss');
    if (switchBossBtn) {
      switchBossBtn.onclick = () => {
        this._renderBossSelectionGrid();
        UI.openModal('modal-boss-select');
      };
    }

    const closeBossSelectX = Utils.qs('#btn-close-boss-select-x');
    if (closeBossSelectX) {
      closeBossSelectX.onclick = () => UI.closeModal('modal-boss-select');
    }

    const cancelBossSelect = Utils.qs('#btn-cancel-boss-select');
    if (cancelBossSelect) {
      cancelBossSelect.onclick = () => UI.closeModal('modal-boss-select');
    }

    const bossVictorySelect = Utils.qs('#btn-boss-victory-select');
    if (bossVictorySelect) {
      bossVictorySelect.onclick = () => {
        UI.closeModal('modal-boss-victory');
        this._renderBossSelectionGrid();
        UI.openModal('modal-boss-select');
      };
    }

    const bossVictoryHub = Utils.qs('#btn-boss-victory-hub');
    if (bossVictoryHub) {
      bossVictoryHub.onclick = () => {
        UI.closeModal('modal-boss-victory');
        Router.navigateTo('index');
      };
    }

    // Mega-Boss Defeat Modal Buttons
    const bossRetryBtn = Utils.qs('#btn-boss-retry');
    if (bossRetryBtn) {
      bossRetryBtn.onclick = () => {
        UI.closeModal('modal-boss-defeat');
        window.location.reload();
      };
    }

    const bossDefeatHubBtn = Utils.qs('#btn-boss-defeat-hub');
    if (bossDefeatHubBtn) {
      bossDefeatHubBtn.onclick = () => {
        UI.closeModal('modal-boss-defeat');
        Router.navigateTo('index');
      };
    }

    // Keyboard Shortcuts (1-4, A-D, Enter, Escape)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      const key = e.key.toUpperCase();

      // Letters / Numbers for Option Selection
      let targetIdx = -1;
      if (key === '1' || key === 'A') targetIdx = 0;
      else if (key === '2' || key === 'B') targetIdx = 1;
      else if (key === '3' || key === 'C') targetIdx = 2;
      else if (key === '4' || key === 'D') targetIdx = 3;

      if (targetIdx >= 0) {
        const optionCards = Utils.qsa('.option-card');
        if (optionCards[targetIdx] && !optionCards[targetIdx].disabled) {
          optionCards[targetIdx].click();
        }
      }

      // Enter key for Submit or Advance
      if (e.key === 'Enter') {
        // If focus is already directly on a button, native click handles it
        if (e.target && e.target.tagName === 'BUTTON') {
          return;
        }

        const nextBtnEl = Utils.qs('#btn-next-question');
        if (nextBtnEl && nextBtnEl.style.display !== 'none' && !nextBtnEl.disabled) {
          nextBtnEl.click();
        } else {
          const submitBtnEl = Utils.qs('#btn-submit-answer');
          if (submitBtnEl && !submitBtnEl.disabled && submitBtnEl.style.display !== 'none') {
            submitBtnEl.click();
          }
        }
      }

      // H key for Hint
      if (key === 'H' && !e.ctrlKey && !e.metaKey) {
        const hintBtnEl = Utils.qs('#btn-use-hint');
        if (hintBtnEl && !hintBtnEl.disabled) {
          hintBtnEl.click();
        }
      }
    });

    // Bind 1v1 SyntaxDuel Lobby, Controls and Modals
    this._bindDuelEvents();

    // Bind CyberDrill Incident Response Monitor, Filters, and Modals
    this._bindIncidentEvents();

    // Cleanup timer on page beforeunload
    window.addEventListener('beforeunload', () => {
      this._stopTimer();
    });
  },

  /* ==========================================================================
     FEATURE 2: ASYNCHRONOUS GHOST SPEED DUEL HELPERS
     ========================================================================== */

  /**
   * Helper to render avatar emblem with SVG image and emoji fallback
   */
  _renderDuelAvatar(el, avatarIdOrSymbol) {
    if (!el) return;
    const avatarMap = {
      cyber_fox: { file: 'cyber_fox.svg', symbol: '🦊' },
      terminal_owl: { file: 'terminal_owl.svg', symbol: '🦉' },
      matrix_cat: { file: 'matrix_cat.svg', symbol: '🐱' },
      bit_knight: { file: 'bit_knight.svg', symbol: '🛡️' },
      hex_dragon: { file: 'hex_dragon.svg', symbol: '🐉' },
      glitch_bot: { file: 'glitch_bot.svg', symbol: '🤖' }
    };

    const entry = avatarMap[avatarIdOrSymbol];
    if (entry) {
      el.innerHTML = `<img src="assets/images/${entry.file}" alt="${avatarIdOrSymbol}" style="width: 28px; height: 28px; object-fit: contain; vertical-align: middle; pointer-events: none;" onerror="this.parentElement.textContent='${entry.symbol}'">`;
    } else if (avatarIdOrSymbol && avatarIdOrSymbol.length <= 4) {
      el.textContent = avatarIdOrSymbol;
    } else {
      el.innerHTML = `<img src="assets/images/matrix_cat.svg" alt="Avatar" style="width: 28px; height: 28px; object-fit: contain; vertical-align: middle; pointer-events: none;" onerror="this.parentElement.textContent='🐱'">`;
    }
  },

  _getAvatarSymbol(avatarIdOrSymbol) {
    const avatarMap = {
      cyber_fox: '🦊',
      terminal_owl: '🦉',
      matrix_cat: '🐱',
      bit_knight: '🛡️',
      hex_dragon: '🐉',
      glitch_bot: '🤖'
    };
    return avatarMap[avatarIdOrSymbol] || avatarIdOrSymbol || '🦊';
  },

  /**
   * Initialize Ghost Speed Duel HUD components, events, and baseline pacing.
   * @param {string} difficulty
   */
  _initGhostDuelUI(difficulty = 'beginner') {
    const diff = (difficulty || 'beginner').toLowerCase();
    this.ghostDuel = {
      enabled: true,
      opponentName: 'CyberPhantom',
      ghostAvatar: '👻',
      playerCumulativeTime: 0,
      ghostCumulativeTime: 0,
      sessionStartTime: Date.now(),
      questionStartTime: Date.now(),
      lastSplitDelta: 0,
      pacePerQuestion: diff === 'expert' ? 21.0 : (diff === 'intermediate' ? 14.0 : 8.5)
    };

    const toggleBtn = Utils.qs('#btn-toggle-ghost-duel');
    const rail = Utils.qs('#hud-ghost-duel-rail');

    if (toggleBtn) {
      toggleBtn.onclick = () => {
        AudioEngine.playClick();
        this.ghostDuel.enabled = !this.ghostDuel.enabled;
        if (rail) {
          rail.style.opacity = this.ghostDuel.enabled ? '1' : '0.4';
        }
        toggleBtn.style.opacity = this.ghostDuel.enabled ? '1' : '0.5';
        UI.showToast(this.ghostDuel.enabled ? '⚡ Speed Ghost Resumed: Racing CyberPhantom!' : '⏸ Speed Ghost Paused', 'info');
      };
    }

    // Populate Player Profile Info
    const prof = Profile.getActiveProfile();
    const avatar = (prof && (prof.avatarId || prof.avatarEmoji)) || 'cyber_fox';
    const playerAvatarEl = Utils.qs('#ghost-player-avatar');
    const playerPin = Utils.qs('#ghost-player-pin');
    const playerNameEl = Utils.qs('#ghost-player-name');

    if (playerAvatarEl) this._renderDuelAvatar(playerAvatarEl, avatar);
    if (playerPin) playerPin.textContent = this._getAvatarSymbol(avatar);
    if (playerNameEl && prof && prof.username) playerNameEl.textContent = prof.username;

    // Reset split badge
    const splitBadge = Utils.qs('#ghost-split-badge');
    const splitText = Utils.qs('#ghost-split-text');
    const splitIcon = Utils.qs('#ghost-split-icon');
    if (splitBadge) splitBadge.className = 'ghost-duel-split-badge is-even';
    if (splitText) splitText.textContent = '0.0s EVEN';
    if (splitIcon) splitIcon.textContent = '⏱️';
  },

  /**
   * Update Ghost Duel track positions and record question start time.
   * @param {object} q
   */
  _updateGhostDuelTrack(q) {
    if (!this.ghostDuel) return;
    this.ghostDuel.questionStartTime = Date.now();
    if (!this.ghostDuel.sessionStartTime) {
      this.ghostDuel.sessionStartTime = Date.now();
    }

    if (!this.ghostDuel.enabled) return;

    const total = (this.engine && this.engine.getSession()) ? this.engine.getSession().questions.length : (q ? (q.totalQuestions || 10) : 10);
    const currentIdx = (q && typeof q.index === 'number') ? q.index : 0;
    const pct = Math.min(100, Math.max(0, (currentIdx / total) * 100));

    const playerPin = Utils.qs('#ghost-player-pin');
    if (playerPin) playerPin.style.left = `${pct}%`;

    const prof = Profile.getActiveProfile();
    const avatar = (prof && (prof.avatarId || prof.avatarEmoji)) || 'cyber_fox';
    const playerAvatarEl = Utils.qs('#ghost-player-avatar');
    if (playerAvatarEl) this._renderDuelAvatar(playerAvatarEl, avatar);
    if (playerPin) playerPin.textContent = this._getAvatarSymbol(avatar);
  },

  /**
   * Process Ghost timing metrics when an answer is submitted.
   * @param {boolean} isCorrect
   */
  _processGhostSplitOnAnswer(isCorrect) {
    if (!this.ghostDuel || !this.ghostDuel.enabled) return;

    const q = this.engine ? this.engine.getCurrentQuestion() : null;
    const timeSpent = Math.max(0.5, ((Date.now() - (this.ghostDuel.questionStartTime || Date.now())) / 1000));

    let hash = 0;
    const qid = (q && q.id) ? q.id : 'q';
    for (let i = 0; i < qid.length; i++) hash = (hash * 31 + qid.charCodeAt(i)) & 0xff;
    const jitter = ((hash % 15) - 7) * 0.1;
    const ghostQTime = Math.max(3.0, this.ghostDuel.pacePerQuestion + jitter);

    this.ghostDuel.playerCumulativeTime += timeSpent;
    this.ghostDuel.ghostCumulativeTime += ghostQTime;

    const delta = this.ghostDuel.ghostCumulativeTime - this.ghostDuel.playerCumulativeTime;
    const splitBadge = Utils.qs('#ghost-split-badge');
    const splitText = Utils.qs('#ghost-split-text');
    const splitIcon = Utils.qs('#ghost-split-icon');

    if (splitBadge && splitText) {
      if (delta > 0.3) {
        splitBadge.className = 'ghost-duel-split-badge is-ahead';
        if (splitIcon) splitIcon.textContent = '⚡';
        splitText.textContent = `+${delta.toFixed(1)}s AHEAD`;

        if (this.ghostDuel.lastSplitDelta <= 0) {
          UI.showToast('🏎️ GHOST OVERTAKEN! You took the lead!', 'success');
        }
      } else if (delta < -0.3) {
        splitBadge.className = 'ghost-duel-split-badge is-behind';
        if (splitIcon) splitIcon.textContent = '⚠️';
        splitText.textContent = `${Math.abs(delta).toFixed(1)}s BEHIND`;
      } else {
        splitBadge.className = 'ghost-duel-split-badge is-even';
        if (splitIcon) splitIcon.textContent = '⏱️';
        splitText.textContent = '0.0s EVEN';
      }
    }

    this.ghostDuel.lastSplitDelta = delta;
  },

  /**
   * Smoothly interpolate Speed Ghost position continuously without stops.
   * Relentless speed ghost: advances from 0% to 100% based on total session time.
   */
  _updateGhostRealTimeTrack() {
    if (!this.ghostDuel || !this.ghostDuel.enabled) return;

    if (!this.ghostDuel.sessionStartTime) {
      this.ghostDuel.sessionStartTime = Date.now();
    }

    const total = (this.engine && this.engine.getSession()) ? this.engine.getSession().questions.length : 10;
    const pace = this.ghostDuel.pacePerQuestion || 8.5;
    const totalDuration = Math.max(15, total * pace);

    // Continuous glide without stops
    const elapsed = Math.max(0, (Date.now() - this.ghostDuel.sessionStartTime) / 1000);
    const ghostPct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    const ghostPin = Utils.qs('#ghost-opponent-pin');
    if (ghostPin) {
      ghostPin.style.left = `${ghostPct.toFixed(1)}%`;
    }

    // Dynamic split calculation
    const q = this.engine ? this.engine.getCurrentQuestion() : null;
    const currentIdx = (q && typeof q.index === 'number') ? q.index : 0;
    const playerPct = Math.min(100, Math.max(0, (currentIdx / total) * 100));

    const splitBadge = Utils.qs('#ghost-split-badge');
    const splitText = Utils.qs('#ghost-split-text');
    const splitIcon = Utils.qs('#ghost-split-icon');
    if (splitBadge && splitText) {
      const delta = playerPct - ghostPct;
      if (delta > 2) {
        splitBadge.className = 'ghost-duel-split-badge is-ahead';
        if (splitIcon) splitIcon.textContent = '⚡';
        splitText.textContent = `AHEAD (+${Math.round(delta)}%)`;
      } else if (delta < -2) {
        splitBadge.className = 'ghost-duel-split-badge is-behind';
        if (splitIcon) splitIcon.textContent = '⚠️';
        splitText.textContent = `BEHIND (${Math.round(delta)}%)`;
      } else {
        splitBadge.className = 'ghost-duel-split-badge is-even';
        if (splitIcon) splitIcon.textContent = '⏱️';
        splitText.textContent = 'NECK & NECK';
      }
    }
  },

  /**
   * Apply dynamic Tug-of-War setback to player's progress bar on wrong answer or timeout.
   */
  _applyTugOfWarSetback() {
    const progressFill = Utils.qs('#hud-progress-fill');
    const progressContainer = Utils.qs('#hud-progress-container');
    const playerPin = Utils.qs('#ghost-player-pin');
    const ghostRail = Utils.qs('#hud-ghost-duel-rail');

    if (progressFill) {
      const currentWidth = parseFloat(progressFill.style.width) || 0;
      const penalizedWidth = Math.max(0, currentWidth - 10);
      progressFill.style.width = `${penalizedWidth}%`;
      progressFill.classList.add('is-tug-recoil');
      setTimeout(() => progressFill.classList.remove('is-tug-recoil'), 600);
    }

    if (progressContainer) {
      progressContainer.classList.add('is-tug-recoil');
      setTimeout(() => progressContainer.classList.remove('is-tug-recoil'), 600);
    }

    if (playerPin) {
      const currentLeft = parseFloat(playerPin.style.left) || 0;
      const penalizedLeft = Math.max(0, currentLeft - 10);
      playerPin.style.left = `${penalizedLeft}%`;
      playerPin.classList.add('is-tug-recoil');
      setTimeout(() => playerPin.classList.remove('is-tug-recoil'), 600);
    }

    if (ghostRail) {
      ghostRail.classList.add('is-tug-recoil');
      setTimeout(() => ghostRail.classList.remove('is-tug-recoil'), 600);
    }
  },

  /**
   * Prompt user with recommendation modal to study in Cyber Academy after 3 mistakes.
   */
  _promptAcademyRecommendation() {
    this._stopTimer();
    const modal = Utils.qs('#modal-academy-recommendation');
    if (!modal) return;

    UI.openModal('modal-academy-recommendation');

    const yesBtn = Utils.qs('#btn-modal-academy-yes');
    const noBtn = Utils.qs('#btn-modal-academy-no');

    if (yesBtn) {
      yesBtn.onclick = () => {
        AudioEngine.playClick();
        const lang = (this.sessionConfig && this.sessionConfig.language) || 'python';
        const diff = (this.sessionConfig && this.sessionConfig.difficulty) || 'beginner';
        window.location.href = `learn.html?lang=${encodeURIComponent(lang)}&diff=${encodeURIComponent(diff)}`;
      };
    }

    if (noBtn) {
      noBtn.onclick = () => {
        AudioEngine.playClick();
        UI.closeModal('modal-academy-recommendation');
        this.consecutiveMistakes = 0;
        // Resume timer if question still pending
        if (this.engine && this.engine.getState() === ENGINE_STATES.ACTIVE && this.sessionConfig.timeLimit > 0 && this.timer.timeRemaining > 0) {
          this._startTimer(this.timer.timeRemaining);
        }
      };
    }
  },

  /**
   * Setup active Mega-Boss encounter and configure the arcade HUD.
   * @param {object} bossData
   */
  _setupBossEncounter(bossData) {
    if (!bossData || typeof BossEngine === 'undefined') return;
    this.activeBoss = bossData;
    BossEngine.initBattle(bossData.id);

    const bossHud = Utils.qs('#hud-boss-battle-bar');
    if (bossHud) {
      bossHud.style.display = 'block';
      bossHud.classList.remove('boss-phase-2-active');
    }

    const ghostRail = Utils.qs('#hud-ghost-duel-rail');
    if (ghostRail) ghostRail.style.display = 'none';

    // Populate HUD fields
    const avatarEl = Utils.qs('#boss-avatar-emblem');
    if (avatarEl) avatarEl.textContent = bossData.icon || '👾';

    const nameEl = Utils.qs('#boss-name-text');
    if (nameEl) nameEl.textContent = bossData.name;

    const subtitleEl = Utils.qs('#boss-title-subtitle');
    if (subtitleEl) subtitleEl.textContent = `${bossData.title} • ${bossData.maxHp} MAX HP`;

    const phaseBadge = Utils.qs('#boss-phase-badge');
    if (phaseBadge) {
      phaseBadge.textContent = 'PHASE 1';
      phaseBadge.className = 'badge badge-cyan boss-phase-badge';
    }

    const attackBadge = Utils.qs('#boss-attack-type-badge');
    if (attackBadge) attackBadge.textContent = `⚠️ Signature: ${bossData.attackName}`;

    const hpFill = Utils.qs('#boss-hp-fill');
    if (hpFill) hpFill.style.width = '100%';

    const hpText = Utils.qs('#boss-hp-text');
    if (hpText) hpText.textContent = `${bossData.maxHp} / ${bossData.maxHp} HP (100%)`;

    const tauntEl = Utils.qs('#boss-taunt-text');
    if (tauntEl) tauntEl.textContent = `"${bossData.taunts?.intro || 'Prepare to be purged.'}"`;

    if (typeof AudioEngine !== 'undefined' && AudioEngine.playBossAlert) {
      AudioEngine.playBossAlert();
    }
  },

  /**
   * Process a boss turn on question submission.
   * @param {object} result Answer result from GameEngine
   * @param {number} timeRemaining Remaining question time
   */
  _processBossTurn(result, timeRemaining = 15) {
    if (!this.sessionConfig || this.sessionConfig.mode !== 'boss' || typeof BossEngine === 'undefined') return;

    const bossTurn = BossEngine.processTurn(
      result.correct,
      timeRemaining,
      this.sessionConfig.timeLimit || 35,
      result.streak || 0,
      this.sessionConfig.difficulty || 'intermediate'
    );
    this._renderBossTurn(bossTurn);
  },

  /**
   * Render Boss combat feedback (HP bar update, floating damage, Phase 2 enrage, taunts, victory).
   * @param {object} bossTurn Result from BossEngine.processTurn
   */
  _renderBossTurn(bossTurn) {
    if (!bossTurn) return;

    const hpFill = Utils.qs('#boss-hp-fill');
    if (hpFill) hpFill.style.width = `${bossTurn.status.hpPct}%`;

    const hpText = Utils.qs('#boss-hp-text');
    if (hpText) {
      hpText.textContent = `${bossTurn.status.currentHp} / ${bossTurn.status.maxHp} HP (${bossTurn.status.hpPct}%)`;
    }

    const tauntEl = Utils.qs('#boss-taunt-text');
    if (tauntEl && bossTurn.taunt) {
      tauntEl.textContent = `"${bossTurn.taunt}"`;
    }

    // Floating Combat Damage Text & Boss Avatar Hit Recoil
    if (bossTurn.damage > 0) {
      this._spawnFloatingDamage(bossTurn.damage, bossTurn.isCritical);
      const bossAvatar = Utils.qs('#boss-avatar-emblem');
      if (bossAvatar) {
        bossAvatar.classList.remove('is-hit-recoil', 'is-attack-lunge');
        void bossAvatar.offsetWidth;
        bossAvatar.classList.add('is-hit-recoil');
        setTimeout(() => bossAvatar.classList.remove('is-hit-recoil'), 500);
      }
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playBossHit) {
        AudioEngine.playBossHit(bossTurn.isCritical);
      }
    }

    // Phase 2 Overclocking transition
    if (bossTurn.transitionToPhase2) {
      const bossHud = Utils.qs('#hud-boss-battle-bar');
      if (bossHud) bossHud.classList.add('boss-phase-2-active');

      const phaseBadge = Utils.qs('#boss-phase-badge');
      if (phaseBadge) {
        phaseBadge.textContent = '🔥 OVERCLOCKED PHASE 2';
        phaseBadge.className = 'badge badge-coral boss-phase-badge animate-pulse';
      }

      if (typeof AudioEngine !== 'undefined' && AudioEngine.playBossRoar) {
        AudioEngine.playBossRoar();
      }
      UI.showToast('🔥 BOSS OVERCLOCKED! Attack power increased in Phase 2!', 'warning');
    }

    // Boss Counter Attack on incorrect answer
    if (!bossTurn.isPlayerHit) {
      BossEngine.triggerBossAttack();
      const bossAvatar = Utils.qs('#boss-avatar-emblem');
      if (bossAvatar) {
        bossAvatar.classList.remove('is-hit-recoil', 'is-attack-lunge');
        void bossAvatar.offsetWidth;
        bossAvatar.classList.add('is-attack-lunge');
        setTimeout(() => bossAvatar.classList.remove('is-attack-lunge'), 600);
      }
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playBossGlitch) {
        AudioEngine.playBossGlitch();
      }

      // Visual Glitch Overlay
      const overlay = Utils.qs('#boss-glitch-overlay');
      if (overlay) {
        overlay.classList.add('is-active');
        setTimeout(() => overlay.classList.remove('is-active'), 1200);
      }

      // Disrupt option buttons
      const options = Utils.qsa('.option-card');
      options.forEach(card => {
        if (!card.classList.contains('is-correct')) {
          card.classList.add('is-glitched-option');
          setTimeout(() => card.classList.remove('is-glitched-option'), 2500);
        }
      });

      // Show HP regeneration toast
      if (bossTurn.healed > 0) {
        UI.showToast(`⚠️ ${bossTurn.boss?.name || 'Boss'} regenerated +${bossTurn.healed} HP!`, 'warning');
      }

      // Check Boss Overwhelm Player Defeat
      if (bossTurn.isPlayerDefeated) {
        if (this._autoAdvanceTimer) {
          clearTimeout(this._autoAdvanceTimer);
          this._autoAdvanceTimer = null;
        }
        this._stopTimer();

        // Heavy CRT Glitch & Screen Shake
        document.body.classList.add('boss-defeat-wipe-glitch');
        const arenaCard = Utils.qs('#arena-card');
        if (arenaCard) arenaCard.classList.add('boss-defeat-wipe-glitch');
        setTimeout(() => {
          document.body.classList.remove('boss-defeat-wipe-glitch');
          if (arenaCard) arenaCard.classList.remove('boss-defeat-wipe-glitch');
        }, 1000);

        if (typeof AudioEngine !== 'undefined' && AudioEngine.playBossGlitch) {
          AudioEngine.playBossGlitch();
        }

        // Populate defeat modal
        const defTaunt = Utils.qs('#boss-defeat-taunt');
        if (defTaunt && bossTurn.taunt) {
          defTaunt.textContent = `"${bossTurn.taunt}"`;
        }
        const defIcon = Utils.qs('#boss-defeat-icon');
        if (defIcon && bossTurn.boss) {
          defIcon.textContent = bossTurn.boss.icon || '💀';
        }

        setTimeout(() => {
          UI.openModal('modal-boss-defeat');
        }, 850);
        return;
      }
    }

    // Boss Defeat Victory Flow
    if (bossTurn.status.isVictory) {
      if (this._autoAdvanceTimer) {
        clearTimeout(this._autoAdvanceTimer);
        this._autoAdvanceTimer = null;
      }

      const activeProf = Profile.getActiveProfile();
      const rewards = BossEngine.claimVictoryRewards(activeProf);

      // Populate victory modal
      const vIcon = Utils.qs('#boss-victory-icon');
      if (vIcon && bossTurn.boss) vIcon.textContent = bossTurn.boss.icon;

      const vTitle = Utils.qs('#modal-boss-victory-title');
      if (vTitle && bossTurn.boss) vTitle.textContent = `${bossTurn.boss.name} Purged!`;

      const vSub = Utils.qs('#boss-victory-subtitle');
      if (vSub && bossTurn.boss) vSub.textContent = `Memory integrity restored. ${bossTurn.boss.subtitle} neutralized.`;

      const vXp = Utils.qs('#boss-victory-xp');
      if (vXp && rewards) vXp.textContent = `+${rewards.xpAwarded} XP`;

      const vBadge = Utils.qs('#boss-victory-badge');
      if (vBadge && rewards) vBadge.textContent = `${bossTurn.boss?.icon || '🏆'} ${rewards.badgeName}`;

      const vHackerTitle = Utils.qs('#boss-victory-title-unlocked');
      if (vHackerTitle && rewards) vHackerTitle.textContent = rewards.titleUnlocked;

      setTimeout(() => {
        UI.triggerConfetti();
        UI.openModal('modal-boss-victory');
      }, 1000);
    }
  },

  /**
   * Spawn floating damage text over the Boss HUD.
   * @param {number} damage
   * @param {boolean} isCritical
   */
  _spawnFloatingDamage(damage, isCritical = false) {
    const bossHud = Utils.qs('#hud-boss-battle-bar');
    if (!bossHud) return;

    const floatEl = document.createElement('div');
    floatEl.className = `floating-damage${isCritical ? ' is-critical' : ''}`;
    floatEl.textContent = isCritical ? `⚡ CRIT! -${damage} HP` : `-${damage} HP`;

    const leftOffset = 40 + Math.floor(Math.random() * 25);
    floatEl.style.left = `${leftOffset}%`;
    floatEl.style.top = '15px';

    bossHud.appendChild(floatEl);
    setTimeout(() => {
      if (floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);
    }, 1200);
  },

  /**
   * Dynamically render the boss selection cards inside the selection modal.
   */
  _renderBossSelectionGrid() {
    const container = Utils.qs('#boss-select-grid-container');
    if (!container || typeof BossEncounters === 'undefined') return;

    const bosses = BossEncounters.getAll();
    const activeProf = Profile.getActiveProfile();
    const defeatedList = (activeProf && activeProf.defeatedBosses) || [];

    container.innerHTML = bosses.map(b => {
      const isDefeated = defeatedList.includes(b.id);
      return `
        <div class="boss-select-card${isDefeated ? ' is-defeated' : ''}" data-boss-id="${b.id}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <span style="font-size: 2.2rem;">${b.icon}</span>
            <div style="display: flex; gap: 0.35rem; flex-direction: column; align-items: flex-end;">
              <span class="badge ${b.badgeClass}">${b.maxHp} HP</span>
              ${isDefeated ? '<span class="badge badge-emerald">🏆 DEFEATED</span>' : '<span class="badge badge-coral">ACTIVE THREAT</span>'}
            </div>
          </div>
          <div>
            <h4 style="margin: 0.25rem 0; font-size: var(--text-base); color: var(--text-primary);">${b.name}</h4>
            <div style="font-size: 11px; color: var(--color-primary); font-family: var(--font-mono);">${b.title}</div>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); margin: 0.5rem 0 0 0; line-height: 1.4;">
              ${b.subtitle}
            </p>
          </div>
          <div style="background: rgba(0,0,0,0.25); border-radius: var(--radius-sm); padding: 6px 8px; font-size: 11px; border-left: 2px solid ${b.themeColor};">
            <span style="color: var(--text-muted);">Signature:</span>
            <strong style="color: ${b.themeColor};">${b.attackName}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.5rem; margin-top: 0.25rem;">
            <span style="font-size: 11px; color: var(--color-success); font-weight: 700;">+${b.rewards.xp} XP Bounty</span>
            <button type="button" class="btn-arcade btn-primary btn-sm btn-select-boss-engage" data-boss-id="${b.id}" style="font-size: 11px; padding: 3px 10px;">
              Engage ⚔️
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Bind engage buttons
    const engageBtns = container.querySelectorAll('.btn-select-boss-engage');
    engageBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const bossId = btn.getAttribute('data-boss-id');
        UI.closeModal('modal-boss-select');
        Router.navigateTo('game', { mode: 'boss', boss: bossId, new: 'true' });
      };
    });
  },

  /* ==========================================================================
     FEATURE 2: REAL-TIME 1v1 SYNTAXDUEL PEER-TO-PEER ENGINE COORDINATOR
     ========================================================================== */

  /**
   * Initialize 1v1 SyntaxDuel interface and multiplayer state.
   * @param {object} params URL Query Parameters
   */
  _initDuelUI(params = {}) {
    this.isDuelMode = true;

    // Toggle HUDs
    const duelHud = Utils.qs('#hud-duel-versus-bar');
    if (duelHud) duelHud.style.display = 'block';

    const ghostRail = Utils.qs('#hud-ghost-duel-rail');
    if (ghostRail) ghostRail.style.display = 'none';

    const bossBar = Utils.qs('#hud-boss-battle-bar');
    if (bossBar) bossBar.style.display = 'none';

    const count = this.sessionConfig?.questions?.length || 10;
    const lang = (params.lang || 'python').toLowerCase();
    const diff = (params.diff || 'beginner').toLowerCase();
    const duelSeed = params.seed ? parseInt(params.seed, 10) : DuelEngine.generateSeed();
    const isLocalSplit = params.submode === 'local_split' || params.duel === 'local';
    const prof = Profile.getActiveProfile();

    if (isLocalSplit) {
      DuelEngine.initLocalSplit({
        language: lang,
        difficulty: diff,
        count,
        seed: duelSeed
      });
    } else {
      const isChallenger = params.role === 'challenger';
      const roomCode = params.room || DuelEngine.generateRoomCode();
      if (isChallenger) {
        DuelEngine.initChallenger({
          roomCode,
          seed: duelSeed,
          language: lang,
          difficulty: diff,
          count,
          profile: prof
        });
      } else {
        DuelEngine.initHost({
          roomCode,
          seed: duelSeed,
          language: lang,
          difficulty: diff,
          count,
          profile: prof
        });
      }
    }

    // Hide hint and retry actions in 1v1 SyntaxDuel
    const hintBtn = Utils.qs('#btn-use-hint');
    if (hintBtn) hintBtn.style.display = 'none';
    const retryBtn = Utils.qs('#btn-retry-question');
    if (retryBtn) retryBtn.style.display = 'none';

    // Subscribe to multiplayer events
    DuelEngine.onRemoteProgress(() => {
      this._updateDuelVersusHUD();
    });

    DuelEngine.onSabotage((data) => {
      this._onDuelSabotage(data);
    });

    // Populate Player Identities with SVG rendering & emoji fallback
    const p1Avatar = (prof && (prof.avatarId || prof.avatarEmoji)) || 'cyber_fox';
    const p1Name = (prof && prof.username) || 'Player 1';
    const p1AvatarEl = Utils.qs('#duel-p1-avatar');
    const p1NameEl = Utils.qs('#duel-p1-name');
    const p1Pin = Utils.qs('#duel-p1-pin');

    if (p1AvatarEl) this._renderDuelAvatar(p1AvatarEl, p1Avatar);
    if (p1NameEl) p1NameEl.textContent = p1Name;
    if (p1Pin) p1Pin.textContent = this._getAvatarSymbol(p1Avatar);

    const opponent = DuelEngine.opponentPlayer || {};
    const p2Avatar = opponent.avatar || (isLocalSplit ? 'matrix_cat' : (params.role === 'challenger' ? 'cyber_fox' : 'terminal_owl'));
    const p2Name = opponent.name || (isLocalSplit ? 'Player 2 (Keys 7-0)' : (params.role === 'challenger' ? 'Host' : 'Challenger'));
    const p2AvatarEl = Utils.qs('#duel-p2-avatar');
    const p2NameEl = Utils.qs('#duel-p2-name');
    const p2Pin = Utils.qs('#duel-p2-pin');

    if (p2AvatarEl) this._renderDuelAvatar(p2AvatarEl, p2Avatar);
    if (p2NameEl) p2NameEl.textContent = p2Name;
    if (p2Pin) p2Pin.textContent = this._getAvatarSymbol(p2Avatar);

    // Update avatar and name when opponent joins
    DuelEngine.onOpponentJoined((opp) => {
      if (p2NameEl) p2NameEl.textContent = opp.name || 'Challenger';
      if (p2AvatarEl) this._renderDuelAvatar(p2AvatarEl, opp.avatar || 'matrix_cat');
      if (p2Pin) p2Pin.textContent = this._getAvatarSymbol(opp.avatar || 'matrix_cat');
      this._updateDuelVersusHUD();
      UI.showToast(`⚔️ Rival connected: ${opp.name || 'Challenger'} ready for duel!`, 'success');
    });

    this._updateDuelVersusHUD();
    UI.showToast(`⚔️ 1v1 SyntaxDuel Engaged! Race to solve ${count} challenges!`, 'info');
  },

  /**
   * Handle Sabotage Glitch triggered when opponent achieves a 3-streak combo.
   * @param {object} data
   */
  _onDuelSabotage(data) {
    if (typeof AudioEngine !== 'undefined' && AudioEngine.playError) {
      AudioEngine.playError();
    }
    UI.showToast('⚡ INCOMING SABOTAGE! Opponent reached a 3-Streak combo!', 'warning');

    const card = Utils.qs('#arena-card') || document.body;
    if (card) {
      card.classList.remove('duel-sabotage-glitch');
      void card.offsetWidth;
      card.classList.add('duel-sabotage-glitch');
      setTimeout(() => card.classList.remove('duel-sabotage-glitch'), 950);
    }
  },

  /**
   * Update 1v1 SyntaxDuel HUD (scores, progress pins, streaks, and lead pill).
   */
  _updateDuelVersusHUD() {
    const duelBar = Utils.qs('#hud-duel-versus-bar');
    if (!duelBar || !this.isDuelMode) return;

    const lead = DuelEngine.getLeadStatus();
    const total = (this.sessionConfig && this.sessionConfig.questions) ? this.sessionConfig.questions.length : 10;

    // P1 Updates
    const p1ScoreEl = Utils.qs('#duel-p1-score');
    const p1ProgEl = Utils.qs('#duel-p1-prog');
    const p1Pin = Utils.qs('#duel-p1-pin');
    const p1StreakBadge = Utils.qs('#duel-p1-streak-badge');

    if (p1ScoreEl) p1ScoreEl.textContent = `${lead.p1Score.toLocaleString()} PTS`;
    if (p1ProgEl) p1ProgEl.textContent = `Q ${lead.p1Progress} / ${total}`;
    if (p1Pin) {
      const pct = Math.min(100, Math.max(0, (lead.p1Progress / total) * 100));
      p1Pin.style.left = `${pct}%`;
    }
    if (p1StreakBadge) {
      if (lead.p1Streak >= 3) {
        p1StreakBadge.style.display = 'inline-block';
        p1StreakBadge.textContent = `🔥 ${lead.p1Streak} STREAK`;
      } else {
        p1StreakBadge.style.display = 'none';
      }
    }

    // P2 Updates
    const p2ScoreEl = Utils.qs('#duel-p2-score');
    const p2ProgEl = Utils.qs('#duel-p2-prog');
    const p2Pin = Utils.qs('#duel-p2-pin');
    const p2StreakBadge = Utils.qs('#duel-p2-streak-badge');
    const p2NameEl = Utils.qs('#duel-p2-name');

    const p2AvatarEl = Utils.qs('#duel-p2-avatar');

    const opp = (DuelEngine.session && DuelEngine.session.opponent) || DuelEngine.opponentPlayer;
    if (opp) {
      if (p2NameEl && opp.name) {
        p2NameEl.textContent = opp.name;
      }
      if (p2AvatarEl && opp.avatar && p2AvatarEl.getAttribute('data-avatar') !== opp.avatar) {
        p2AvatarEl.setAttribute('data-avatar', opp.avatar);
        this._renderDuelAvatar(p2AvatarEl, opp.avatar);
      }
      if (p2Pin && opp.avatar) {
        p2Pin.textContent = this._getAvatarSymbol(opp.avatar);
      }
    }
    if (p2ScoreEl) p2ScoreEl.textContent = `${lead.p2Score.toLocaleString()} PTS`;
    if (p2ProgEl) p2ProgEl.textContent = `Q ${lead.p2Progress} / ${total}`;
    if (p2Pin) {
      const pct = Math.min(100, Math.max(0, (lead.p2Progress / total) * 100));
      p2Pin.style.left = `${pct}%`;
    }
    if (p2StreakBadge) {
      if (lead.p2Streak >= 3) {
        p2StreakBadge.style.display = 'inline-block';
        p2StreakBadge.textContent = `🔥 ${lead.p2Streak} STREAK`;
      } else {
        p2StreakBadge.style.display = 'none';
      }
    }

    // Center Nexus Lead Pill
    const pill = Utils.qs('#duel-lead-pill');
    if (pill) {
      pill.className = `duel-delta-pill ${lead.deltaClass}`;
      pill.textContent = lead.deltaText;
    }
  },

  /**
   * Render head-to-head Versus Report Card upon duel completion.
   * @param {object} matchResult Result from DuelEngine.getMatchResult()
   */
  _renderDuelResults(matchResult) {
    if (!matchResult) return;

    const iconEl = Utils.qs('#duel-result-icon');
    const badgeEl = Utils.qs('#duel-result-badge');
    const titleEl = Utils.qs('#modal-duel-results-title');
    const subtitleEl = Utils.qs('#duel-result-subtitle');

    const isHostWin = matchResult.isHostWin;
    const isTie = matchResult.isTie;

    if (iconEl) iconEl.textContent = isTie ? '⚔️' : (isHostWin ? '🏆' : '💀');
    if (badgeEl) {
      badgeEl.textContent = isTie ? 'HONORABLE DRAW' : (isHostWin ? 'VICTORY' : 'DEFEAT');
      badgeEl.className = `badge ${isTie ? 'badge-amber' : (isHostWin ? 'badge-emerald' : 'badge-coral')}`;
    }
    if (titleEl) {
      titleEl.textContent = isTie ? 'MATCH TIED!' : (isHostWin ? `VICTORY: ${matchResult.host.username}!` : `${matchResult.challenger.username} WINS!`);
    }
    if (subtitleEl) {
      subtitleEl.textContent = matchResult.verdictSummary || 'Head-to-head syntax showdown concluded.';
    }

    const p1Score = Utils.qs('#stat-duel-p1-score');
    const p2Score = Utils.qs('#stat-duel-p2-score');
    const p1Acc = Utils.qs('#stat-duel-p1-acc');
    const p2Acc = Utils.qs('#stat-duel-p2-acc');
    const p1Streak = Utils.qs('#stat-duel-p1-streak');
    const p2Streak = Utils.qs('#stat-duel-p2-streak');
    const p1Time = Utils.qs('#stat-duel-p1-time');
    const p2Time = Utils.qs('#stat-duel-p2-time');

    if (p1Score) p1Score.textContent = `${matchResult.host.score.toLocaleString()} PTS`;
    if (p2Score) p2Score.textContent = `${matchResult.challenger.score.toLocaleString()} PTS`;
    if (p1Acc) p1Acc.textContent = `${matchResult.host.accuracy}%`;
    if (p2Acc) p2Acc.textContent = `${matchResult.challenger.accuracy}%`;
    if (p1Streak) p1Streak.textContent = `${matchResult.host.maxStreak}x`;
    if (p2Streak) p2Streak.textContent = `${matchResult.challenger.maxStreak}x`;
    if (p1Time) p1Time.textContent = `${(matchResult.host.totalTimeMs / 1000).toFixed(1)}s`;
    if (p2Time) p2Time.textContent = `${(matchResult.challenger.totalTimeMs / 1000).toFixed(1)}s`;

    if (isHostWin) {
      UI.triggerConfetti();
    }
    UI.openModal('modal-duel-results');
  },

  /**
   * Bind event handlers for Duel Lobby, controls, tab switching, and result actions.
   */
  _bindDuelEvents() {
    // Open Lobby Button in HUD
    const openLobbyBtn = Utils.qs('#btn-open-duel-lobby');
    if (openLobbyBtn) {
      openLobbyBtn.onclick = () => {
        AudioEngine.playClick();
        UI.openModal('modal-duel-lobby');
      };
    }

    // Lobby Close / Cancel Buttons
    const closeLobbyX = Utils.qs('#btn-close-duel-lobby-x');
    if (closeLobbyX) {
      closeLobbyX.onclick = () => UI.closeModal('modal-duel-lobby');
    }
    const cancelLobby = Utils.qs('#btn-cancel-duel-lobby');
    if (cancelLobby) {
      cancelLobby.onclick = () => UI.closeModal('modal-duel-lobby');
    }

    // Tab switching (Online vs Local Split)
    const tabOnline = Utils.qs('#tab-duel-online');
    const tabLocal = Utils.qs('#tab-duel-local');
    const viewOnline = Utils.qs('#duel-view-online');
    const viewLocal = Utils.qs('#duel-view-local');
    const startMatchBtn = Utils.qs('#btn-start-duel-match');

    if (tabOnline && tabLocal) {
      tabOnline.onclick = () => {
        AudioEngine.playClick();
        tabOnline.classList.add('is-active');
        tabLocal.classList.remove('is-active');
        if (viewOnline) viewOnline.style.display = 'block';
        if (viewLocal) viewLocal.style.display = 'none';
        if (startMatchBtn) {
          startMatchBtn.disabled = !this._activeDuelHostConfig;
        }
      };
      tabLocal.onclick = () => {
        AudioEngine.playClick();
        tabLocal.classList.add('is-active');
        tabOnline.classList.remove('is-active');
        if (viewOnline) viewOnline.style.display = 'none';
        if (viewLocal) viewLocal.style.display = 'block';
        if (startMatchBtn) {
          startMatchBtn.disabled = false;
        }
      };
    }

    // Host New Room
    const createRoomBtn = Utils.qs('#btn-create-duel-room');
    if (createRoomBtn) {
      createRoomBtn.onclick = () => {
        AudioEngine.playClick();
        const lang = Utils.qs('#duel-select-lang')?.value || 'python';
        const diff = Utils.qs('#duel-select-diff')?.value || 'beginner';
        const count = parseInt(Utils.qs('#duel-select-count')?.value || '10', 10);
        const roomCode = DuelEngine.generateRoomCode();
        const seed = DuelEngine.generateSeed();

        DuelEngine.initHost({ roomCode, seed, language: lang, difficulty: diff, count });
        this._activeDuelHostConfig = { roomCode, seed, language: lang, difficulty: diff, count };

        const roomCard = Utils.qs('#duel-room-active-card');
        const displayCode = Utils.qs('#duel-display-room-code');
        const shareInput = Utils.qs('#duel-share-url-input');

        if (displayCode) displayCode.textContent = roomCode;
        if (shareInput) {
          const shareUrl = DuelEngine.getShareUrl(roomCode, seed, lang, diff, count);
          shareInput.value = shareUrl;
        }
        if (roomCard) roomCard.style.display = 'block';
        if (startMatchBtn) startMatchBtn.disabled = false;
        UI.showToast(`Duel Room ${roomCode} created! Share link with your rival.`, 'success');
      };
    }

    // Join Room Button
    const joinBtn = Utils.qs('#btn-join-duel-room');
    const joinInput = Utils.qs('#input-join-room-code');
    if (joinBtn && joinInput) {
      joinBtn.onclick = () => {
        const code = (joinInput.value || '').trim().toUpperCase();
        if (!code || code.length < 4) {
          UI.showToast('Please enter a valid Room Code (e.g. SYN-482)', 'warning');
          return;
        }
        AudioEngine.playClick();
        UI.closeModal('modal-duel-lobby');
        const lang = Utils.qs('#duel-select-lang')?.value || 'python';
        const diff = Utils.qs('#duel-select-diff')?.value || 'beginner';
        const count = parseInt(Utils.qs('#duel-select-count')?.value || '10', 10);
        Router.navigateTo('game', {
          mode: 'duel',
          room: code,
          role: 'challenger',
          lang,
          diff,
          count,
          new: 'true'
        });
      };
    }

    // Copy share link button
    const copyLinkBtn = Utils.qs('#btn-copy-duel-link');
    if (copyLinkBtn) {
      copyLinkBtn.onclick = () => {
        const shareInput = Utils.qs('#duel-share-url-input');
        const link = shareInput ? shareInput.value : '';
        if (link && typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(link).then(() => {
            UI.showToast('📋 Duel invite link copied to clipboard!', 'success');
          }).catch(() => {
            UI.showToast('Failed to copy. Please manually copy the URL.', 'info');
          });
        }
      };
    }

    // Start Duel Match Button
    if (startMatchBtn) {
      startMatchBtn.onclick = () => {
        AudioEngine.playClick();
        const isLocal = tabLocal && tabLocal.classList.contains('is-active');
        const lang = Utils.qs('#duel-select-lang')?.value || 'python';
        const diff = Utils.qs('#duel-select-diff')?.value || 'beginner';
        const count = parseInt(Utils.qs('#duel-select-count')?.value || '10', 10);
        UI.closeModal('modal-duel-lobby');

        if (isLocal) {
          const seed = DuelEngine.generateSeed();
          Router.navigateTo('game', {
            mode: 'duel',
            submode: 'local_split',
            lang,
            diff,
            count,
            seed,
            new: 'true'
          });
        } else {
          const cfg = this._activeDuelHostConfig || {
            roomCode: DuelEngine.generateRoomCode(),
            seed: DuelEngine.generateSeed(),
            language: lang,
            difficulty: diff,
            count
          };
          Router.navigateTo('game', {
            mode: 'duel',
            room: cfg.roomCode,
            role: 'host',
            seed: cfg.seed,
            lang: cfg.language,
            diff: cfg.difficulty,
            count: cfg.count,
            new: 'true'
          });
        }
      };
    }

    // Rematch Button
    const rematchBtn = Utils.qs('#btn-duel-rematch');
    if (rematchBtn) {
      rematchBtn.onclick = () => {
        AudioEngine.playClick();
        UI.closeModal('modal-duel-results');
        const params = Router.getQueryParams();
        params.seed = DuelEngine.generateSeed();
        params.new = 'true';
        Router.navigateTo('game', params);
      };
    }

    // Copy Duel Report Card Button
    const copyReportBtn = Utils.qs('#btn-copy-duel-report');
    if (copyReportBtn) {
      copyReportBtn.onclick = () => {
        AudioEngine.playClick();
        const report = DuelEngine.generateMarkdownReport();
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(report).then(() => {
            UI.showToast('📋 SyntaxDuel report copied to clipboard!', 'success');
          }).catch(() => {
            UI.showToast('Failed to copy report.', 'error');
          });
        }
      };
    }

    // Return to Hub from Duel Results
    const duelHubBtn = Utils.qs('#btn-duel-hub');
    if (duelHubBtn) {
      duelHubBtn.onclick = () => {
        UI.closeModal('modal-duel-results');
        Router.navigateTo('index');
      };
    }
  },

  /* ==========================================================================
     FEATURE 5: CYBERDRILL INCIDENT RESPONSE & LIVE OUTAGE SIMULATOR
     ========================================================================== */

  /**
   * Initialize CyberDrill incident response mode.
   * @param {object} params
   */
  _initIncidentUI(params = {}) {
    this.isIncidentMode = true;

    // Toggle HUDs
    const incHud = Utils.qs('#hud-incident-monitor');
    if (incHud) incHud.style.display = 'block';

    const ghostRail = Utils.qs('#hud-ghost-duel-rail');
    if (ghostRail) ghostRail.style.display = 'none';

    const bossBar = Utils.qs('#hud-boss-battle-bar');
    if (bossBar) bossBar.style.display = 'none';

    const duelBar = Utils.qs('#hud-duel-versus-bar');
    if (duelBar) duelBar.style.display = 'none';

    const incidentId = params.incident || 'inc_memory_leak';
    if (typeof IncidentEngine !== 'undefined') {
      const snap = IncidentEngine.startIncident(incidentId);
      this.activeIncident = snap?.activeIncident || (typeof IncidentScenarios !== 'undefined' && IncidentScenarios.getById(incidentId));
    }

    const currentInc = this.activeIncident || (typeof IncidentScenarios !== 'undefined' && IncidentScenarios.getById(incidentId));
    if (currentInc) {
      const titleEl = Utils.qs('#incident-title-text');
      const sevBadge = Utils.qs('#incident-sev-badge');
      const phaseBadge = Utils.qs('#incident-phase-badge');

      if (titleEl) titleEl.textContent = `${currentInc.title} (${currentInc.service})`;
      if (sevBadge) {
        sevBadge.textContent = `${currentInc.severity} OUTAGE`;
        sevBadge.className = `incident-badge ${currentInc.severity === 'SEV-1' ? 'badge-sev1' : 'badge-sev2'}`;
      }
      if (phaseBadge) {
        phaseBadge.textContent = 'TRIAGE PHASE 1: ROOT CAUSE DIAGNOSIS';
        phaseBadge.className = 'incident-badge badge-sev1';
      }
    }

    // Populate streaming logs and start telemetry updates
    if (typeof IncidentEngine !== 'undefined') {
      this._renderIncidentLogs(IncidentEngine.getStreamingLogs());
    }
    this._startIncidentTelemetryUpdates();
    UI.showToast(`🚨 On-Call Alert: ${currentInc?.title || 'Production Outage'}! Diagnose and hotfix before SLA deadline!`, 'warning');
  },

  /**
   * Start live fluctuating telemetry HUD timer.
   */
  _startIncidentTelemetryUpdates() {
    if (this.incidentTelemetryInterval) {
      clearInterval(this.incidentTelemetryInterval);
    }
    this._updateIncidentTelemetryHUD();

    this.incidentTelemetryInterval = setInterval(() => {
      if (this.isCompleted) {
        clearInterval(this.incidentTelemetryInterval);
        this.incidentTelemetryInterval = null;
        return;
      }
      this._updateIncidentTelemetryHUD();
    }, 600);
  },

  /**
   * Update telemetry gauges and SLA timer in HUD.
   */
  _updateIncidentTelemetryHUD() {
    if (!this.isIncidentMode || typeof IncidentEngine === 'undefined') return;

    const telem = IncidentEngine.computeTelemetry();
    if (!telem) return;

    // SLA Timer display
    const slaEl = Utils.qs('#incident-sla-timer');
    if (slaEl) {
      const rem = telem.slaRemainingSeconds;
      const mins = Math.floor(Math.max(0, rem) / 60);
      const secs = Math.max(0, rem) % 60;
      slaEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (rem <= 15 && rem > 0) {
        slaEl.style.color = 'var(--color-coral)';
      } else if (rem <= 0) {
        slaEl.textContent = 'BREACHED (00:00)';
        slaEl.style.color = '#ef4444';
      } else {
        slaEl.style.color = 'var(--color-cyan)';
      }
    }

    // CPU
    const cpuVal = Utils.qs('#metric-cpu-val');
    const cpuFill = Utils.qs('#metric-cpu-fill');
    const cpuCard = Utils.qs('#metric-card-cpu');
    if (cpuVal) cpuVal.textContent = `${telem.cpu}%`;
    if (cpuFill) cpuFill.style.width = `${Math.min(100, telem.cpu)}%`;
    if (cpuCard) {
      cpuCard.className = `metric-card ${telem.cpu > 75 ? 'is-critical' : 'is-nominal'}`;
    }

    // RAM
    const ramVal = Utils.qs('#metric-ram-val');
    const ramFill = Utils.qs('#metric-ram-fill');
    const ramDetail = Utils.qs('#metric-ram-detail');
    const ramCard = Utils.qs('#metric-card-ram');
    if (ramVal) ramVal.textContent = `${telem.ram}%`;
    if (ramFill) ramFill.style.width = `${Math.min(100, telem.ram)}%`;
    if (ramDetail && telem.ramDisplay) ramDetail.textContent = telem.ramDisplay;
    if (ramCard) {
      ramCard.className = `metric-card ${telem.ram > 80 ? 'is-critical' : 'is-nominal'}`;
    }

    // Error Rate
    const errVal = Utils.qs('#metric-error-val');
    const errFill = Utils.qs('#metric-error-fill');
    const errCard = Utils.qs('#metric-card-errors');
    if (errVal) errVal.textContent = `${telem.errorRate}%`;
    if (errFill) errFill.style.width = `${Math.min(100, telem.errorRate)}%`;
    if (errCard) {
      errCard.className = `metric-card ${telem.errorRate > 5.0 ? 'is-critical' : 'is-nominal'}`;
    }

    // Latency & Conns
    const latVal = Utils.qs('#metric-latency-val');
    const latFill = Utils.qs('#metric-latency-fill');
    const connsDetail = Utils.qs('#metric-conns-detail');
    const latCard = Utils.qs('#metric-card-latency');
    if (latVal) latVal.textContent = `${telem.latencyMs} ms`;
    if (latFill) latFill.style.width = `${Math.min(100, (telem.latencyMs / 4000) * 100)}%`;
    if (connsDetail) connsDetail.textContent = `${(telem.activeConnections || 0).toLocaleString()} Conns`;
    if (latCard) {
      latCard.className = `metric-card ${telem.latencyMs > 500 ? 'is-critical' : 'is-nominal'}`;
    }
  },

  /**
   * Render streaming log rows in live tail terminal.
   * @param {Array<string>} logs
   */
  _renderIncidentLogs(logs = []) {
    const stream = Utils.qs('#incident-log-stream');
    if (!stream) return;
    stream.innerHTML = '';
    logs.forEach(log => {
      const row = document.createElement('div');
      row.className = 'log-row';
      const isError = log.includes('[ERROR]') || log.includes('[FATAL]');
      const isWarn = log.includes('[WARN]');
      const level = isError ? 'error' : isWarn ? 'warn' : 'info';
      row.innerHTML = `<span class="log-level ${level}">[${level.toUpperCase()}]</span> <span class="log-msg">${Utils.escapeHtml(log)}</span>`;
      stream.appendChild(row);
    });
    stream.scrollTop = stream.scrollHeight;
  },

  /**
   * Populate scenario list cards in Scenario Selector modal.
   */
  _renderIncidentCatalogList() {
    const listEl = Utils.qs('#incident-scenario-list');
    if (!listEl || typeof IncidentScenarios === 'undefined') return;
    listEl.innerHTML = '';
    IncidentScenarios.getAll().forEach(inc => {
      const card = document.createElement('div');
      card.className = 'scenario-card';
      card.style.cssText = 'background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.2s ease;';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="badge ${inc.badgeClass || 'badge-coral'}" style="font-size: 10px;">${inc.severity}</span>
          <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${inc.slaSeconds}s SLA</span>
        </div>
        <div style="font-weight: 700; color: var(--text-primary); font-size: 14px; margin-bottom: 4px;">${inc.title}</div>
        <div style="font-size: 11px; color: var(--color-cyan); margin-bottom: 6px; font-family: var(--font-mono);">${inc.service} (${inc.language})</div>
        <p style="font-size: 12px; color: var(--text-muted); margin: 0; line-height: 1.3;">${inc.lore.slice(0, 95)}...</p>
      `;
      card.addEventListener('mouseenter', () => {
        card.style.borderColor = 'var(--color-primary)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.borderColor = 'var(--border-subtle)';
      });
      card.addEventListener('click', () => {
        window.location.href = `game.html?mode=incident&incident=${inc.id}&new=true`;
      });
      listEl.appendChild(card);
    });
  },

  /**
   * Render post-mortem incident report dialog upon stabilization.
   */
  _renderIncidentPostMortem() {
    if (typeof IncidentEngine === 'undefined') return;
    const pm = IncidentEngine.getPostMortem();
    if (!pm) return;

    const modal = Utils.qs('#modal-incident-postmortem');
    if (!modal) return;

    const titleEl = Utils.qs('#modal-incident-pm-title');
    const subtitleEl = Utils.qs('#incident-pm-subtitle');
    const badgeEl = Utils.qs('#incident-pm-status-badge');
    const idEl = Utils.qs('#incident-pm-id-badge');

    const mttrEl = Utils.qs('#incident-pm-mttr');
    const slaEl = Utils.qs('#incident-pm-sla-margin');
    const costEl = Utils.qs('#incident-pm-cost');
    const xpEl = Utils.qs('#incident-pm-xp');

    const rootCauseEl = Utils.qs('#incident-pm-root-cause');
    const hotfixEl = Utils.qs('#incident-pm-hotfix');
    const timelineEl = Utils.qs('#incident-pm-timeline');

    const incTitle = pm.title || pm.incidentTitle || 'Outage Incident';
    const isSlaMet = pm.isSlaMet ?? pm.slaMet ?? true;
    const elapsedSec = pm.elapsedSec ?? pm.mttrSeconds ?? 0;
    const slaMargin = pm.slaMarginSec ?? pm.slaMarginSeconds ?? 0;
    const costPrevented = pm.preventedCostUSD ?? pm.downtimeCostPreventedUsd ?? 0;
    const scoreVal = pm.score ?? pm.xpAwarded ?? pm.finalScore ?? 0;

    if (titleEl) titleEl.textContent = `${incTitle} Post-Mortem`;
    if (subtitleEl) subtitleEl.textContent = `Service: ${pm.service} (${pm.system}) • Resolved by On-Call SRE`;
    if (badgeEl) {
      badgeEl.textContent = isSlaMet ? 'SLA MAINTAINED' : 'SLA BREACHED (RESOLVED)';
      badgeEl.className = isSlaMet ? 'badge badge-emerald' : 'badge badge-coral';
    }
    if (idEl) idEl.textContent = (pm.incidentId || 'INC').toUpperCase();

    if (mttrEl) mttrEl.textContent = `${elapsedSec}s`;
    if (slaEl) {
      slaEl.textContent = (slaMargin >= 0 ? `+${slaMargin}s` : `${slaMargin}s`);
      slaEl.style.color = isSlaMet ? 'var(--color-emerald)' : 'var(--color-coral)';
    }
    if (costEl) costEl.textContent = `$${costPrevented.toLocaleString()}`;
    if (xpEl) xpEl.textContent = `+${scoreVal} XP`;
    const diamondsEl = Utils.qs('#incident-pm-diamonds');
    if (diamondsEl) diamondsEl.textContent = `+${pm.diamondsAwarded || 5} 💎`;

    if (rootCauseEl) rootCauseEl.textContent = pm.rootCause;
    if (hotfixEl) hotfixEl.textContent = pm.hotfixApplied;

    if (timelineEl) {
      timelineEl.innerHTML = '';
      (pm.timeline || []).forEach(item => {
        const row = document.createElement('div');
        row.className = 'timeline-item';
        row.innerHTML = `<span class="timeline-time">${item.time}</span> <span class="timeline-text">${item.event}</span>`;
        timelineEl.appendChild(row);
      });
    }

    UI.openModal('modal-incident-postmortem');
    UI.triggerConfetti();
  },

  /**
   * Bind event handlers for CyberDrill logs, scenarios modal, and post-mortem actions.
   */
  _bindIncidentEvents() {
    const logSearchInput = Utils.qs('#incident-log-search');
    const clearLogBtn = Utils.qs('#btn-clear-log-filter');
    if (logSearchInput) {
      logSearchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (typeof IncidentEngine !== 'undefined') {
          const filtered = IncidentEngine.filterLogs(query);
          this._renderIncidentLogs(filtered);
        }
      });
    }
    if (clearLogBtn && logSearchInput) {
      clearLogBtn.addEventListener('click', () => {
        logSearchInput.value = '';
        if (typeof IncidentEngine !== 'undefined') {
          this._renderIncidentLogs(IncidentEngine.getStreamingLogs());
        }
      });
    }

    // Fullscreen Outage Screen toggle (Item 18)
    const fsToggleBtn = Utils.qs('#btn-toggle-incident-fullscreen');
    const hudMonitor = Utils.qs('#hud-incident-monitor');
    if (fsToggleBtn && hudMonitor) {
      fsToggleBtn.addEventListener('click', () => {
        const isFs = hudMonitor.classList.toggle('is-fullscreen');
        fsToggleBtn.textContent = isFs ? '🗗 Exit Fullscreen' : '⛶ Fullscreen';
      });
    }

    // Terminal Shell in Incident HUD
    const termForm = Utils.qs('#incident-terminal-form');
    const termInput = Utils.qs('#incident-terminal-input');
    if (termForm && termInput) {
      termForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = termInput.value.trim();
        if (!cmd) return;
        termInput.value = '';
        if (typeof IncidentEngine !== 'undefined') {
          const res = IncidentEngine.executeTerminalCommand(cmd);
          const stream = Utils.qs('#incident-log-stream');
          if (stream) {
            if (res.output === '__CLEAR__') {
              stream.innerHTML = '';
            } else if (res.error) {
              const errRow = document.createElement('div');
              errRow.className = 'log-line';
              errRow.style.color = 'var(--color-danger)';
              errRow.textContent = `[sre@cluster]$ ${cmd}\n${res.error}`;
              stream.appendChild(errRow);
              stream.scrollTop = stream.scrollHeight;
            } else {
              const outRow = document.createElement('div');
              outRow.className = 'log-line';
              outRow.style.color = '#38bdf8';
              outRow.textContent = `[sre@cluster]$ ${cmd}\n${res.output}`;
              stream.appendChild(outRow);
              stream.scrollTop = stream.scrollHeight;
            }
          }
        }
      });
    }

    // Scenario switch dialog
    const switchBtn = Utils.qs('#btn-switch-incident');
    const selectModal = Utils.qs('#modal-incident-select');
    const closeSelectBtn = Utils.qs('#btn-close-incident-select');
    const cancelSelectBtn = Utils.qs('#btn-cancel-incident-select');
    if (switchBtn && selectModal) {
      switchBtn.addEventListener('click', () => {
        this._renderIncidentCatalogList();
        UI.openModal('modal-incident-select');
      });
    }
    if (closeSelectBtn && selectModal) {
      closeSelectBtn.addEventListener('click', () => UI.closeModal('modal-incident-select'));
    }
    if (cancelSelectBtn && selectModal) {
      cancelSelectBtn.addEventListener('click', () => UI.closeModal('modal-incident-select'));
    }

    // Post-mortem dialog buttons
    const copyPmBtn = Utils.qs('#btn-copy-incident-pm');
    const nextIncBtn = Utils.qs('#btn-next-incident');
    const incHubBtn = Utils.qs('#btn-incident-hub');
    if (copyPmBtn) {
      copyPmBtn.addEventListener('click', () => {
        if (typeof IncidentEngine !== 'undefined') {
          const md = IncidentEngine.generateMarkdownReport();
          if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(md).then(() => {
              UI.showToast('📋 Post-Mortem Markdown copied to clipboard!', 'success');
            }).catch(() => {
              UI.showToast('Post-Mortem generated.', 'info');
            });
          } else {
            UI.showToast('📋 Post-Mortem copied to clipboard!', 'info');
          }
        }
      });
    }
    if (nextIncBtn) {
      nextIncBtn.addEventListener('click', () => {
        if (typeof IncidentScenarios !== 'undefined' && typeof IncidentEngine !== 'undefined') {
          const all = IncidentScenarios.getAll();
          const currId = IncidentEngine.currentIncident?.id;
          const idx = all.findIndex(i => i.id === currId);
          const next = all[(idx + 1) % all.length];
          window.location.href = `game.html?mode=incident&incident=${next.id}&new=true`;
        }
      });
    }
    if (incHubBtn) {
      incHubBtn.addEventListener('click', () => {
        UI.closeModal('modal-incident-postmortem');
        Router.navigateTo('index');
      });
    }
  }
};

if (typeof window !== 'undefined') {
  window.Gameplay = Gameplay;
}
