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

    const ALLOWED_LANGS = ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql'];
    const ALLOWED_DIFFS = ['beginner', 'intermediate', 'expert'];
    const ALLOWED_MODES = ['campaign', 'practice', 'speedrun', 'hardcore', 'retry_missed'];

    let rawLang = (params.lang || (activeProfile && activeProfile.preferences?.language) || 'python').toLowerCase();
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

    // Determine time limit: Hardcore (30s), Standard timed (45s), Relaxed (0)
    let timeLimit = 45;
    if (params.timed === 'false' || mode === 'practice') {
      timeLimit = 0; // Relaxed mode
    } else if (mode === 'hardcore') {
      timeLimit = 30;
    } else if (mode === 'speedrun') {
      timeLimit = 20;
    }

    // 2. Check for an active session to restore on reload
    const savedSession = State.get('activeSession');
    const isExplicitNew = params.new === 'true' || params.reset === 'true';
    const canResume = !isExplicitNew &&
      mode !== 'retry_missed' &&
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

    // 3. Load questions from QuestionBank with support for Retry Missed and Topic Practice
    let questions = [];

    if (mode === 'retry_missed') {
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
      randomizeOrder: true
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

    // 6. Bind DOM controls and keyboard shortcuts
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

    // Configure hint button (disabled in Hardcore Mode)
    const isHardcore = this.sessionConfig && this.sessionConfig.mode === 'hardcore';
    const penalty = HINT_PENALTIES[q.difficulty] || 25;
    if (hintBtn) {
      if (isHardcore) {
        hintBtn.disabled = true;
        hintBtn.textContent = 'Hints Disabled (Hardcore)';
        hintBtn.style.opacity = '0.5';
      } else if (q.hasUsedHint) {
        hintBtn.disabled = true;
        hintBtn.textContent = 'Hint Activated';
        hintBtn.style.opacity = '0.6';
        if (hintDrawer) {
          const hintText = Utils.qs('#hint-drawer-text');
          if (hintText) hintText.textContent = q.hint || 'Carefully trace the variable assignments step-by-step.';
          hintDrawer.style.display = 'block';
        }
      } else {
        hintBtn.disabled = false;
        hintBtn.textContent = `Use Hint (-${penalty} pts)`;
        hintBtn.style.opacity = '1';
      }
    }

    // Update Hardcore lives if applicable
    this._updateLivesDisplay(q.lives ?? 3, q.maxLives ?? 3);

    // Update HUD: Language, Step Counter, Progress Bar, Streak, Score
    const langMeta = LANGUAGE_METADATA[q.language] || LANGUAGE_METADATA.python;
    const hudLangTag = Utils.qs('#hud-lang-tag');
    if (hudLangTag) {
      hudLangTag.textContent = langMeta.name;
      hudLangTag.className = `tag-lang ${langMeta.tagClass}`;
    }

    const hudStep = Utils.qs('#hud-step-counter');
    if (hudStep) {
      hudStep.textContent = `Question ${q.index + 1} of ${q.totalQuestions}`;
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
      if (this.activeStage && this.activeStage.isBoss) {
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
      helper.textContent = 'ℹ Select the exact stdout string produced by this program execution.';
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
    } catch (err) {
      console.error('[Gameplay] Submission rejected by engine:', err);
      this.isSubmitting = false;
      return;
    }

    const arenaCard = Utils.qs('#arena-card');

    if (result.correct) {
      // Correct Answer Flow
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
        if (type === 'incorrect' && !isGameOver) {
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
    if (submitBtn) submitBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;

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

      // Record stage progress & stars (skip if user is only retrying missed questions)
      const activeProf = Profile.getActiveProfile();
      if (activeProf && summary.stage !== 'marathon' && summary.mode !== 'retry_missed' && !summary.isRetryMissed) {
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

    // Navigate to results page
    const params = {
      lang: summary.language,
      diff: summary.difficulty,
      score: summary.totalScore,
      correct: summary.questionsCorrect,
      attempted: summary.questionsAttempted,
      total: summary.totalQuestions,
      sessionId: summary.sessionId,
      stage: summary.stage,
      streak: summary.bestStreak || summary.highestStreak || 0,
      bestStreak: summary.bestStreak || summary.highestStreak || 0
    };

    UI.showToast(summary.isGameOver ? 'Hardcore run concluded. Recording career XP...' : 'Challenge completed! Loading stage analytics...', 'success');
    setTimeout(() => {
      Router.navigateTo('results', params);
    }, 700);
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

    // Submit Answer Button
    const submitBtn = Utils.qs('#btn-submit-answer');
    if (submitBtn) {
      submitBtn.onclick = () => {
        this.submitCurrentAnswer();
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

    // Cleanup timer on page beforeunload
    window.addEventListener('beforeunload', () => {
      this._stopTimer();
    });
  }
};

if (typeof window !== 'undefined') {
  window.Gameplay = Gameplay;
}
