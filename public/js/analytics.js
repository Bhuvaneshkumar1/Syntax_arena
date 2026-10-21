/**
 * SyntaxArena Learning Analytics & Performance Engine (Batch 7)
 * Pure, deterministic functions for topic mastery classification, language & difficulty
 * aggregations, historical trend tracking, and evidence-based learning recommendations.
 * Source of truth: docs/MVP_SPEC.md, docs/GAME_RULES.md, docs/ARCHITECTURE.md
 */

// =============================================================================
// 1. CONFIGURATION & CONSTANTS
// =============================================================================

export const TOPIC_THRESHOLDS = Object.freeze({
  STRONG: 80,          // >= 80% accuracy
  DEVELOPING: 50,      // 50% to 79.9% accuracy
  MIN_SAMPLE_SIZE: 2   // Requires >= 2 attempts to avoid 1/1 = 100% false mastery
});

export const GRADE_THRESHOLDS = Object.freeze({
  S: 95,
  A: 85,
  B: 70,
  C: 50
});

export const TOPIC_NAMES = Object.freeze({
  data_structures: 'Data Structures & Collections',
  data_types: 'Data Types & Immutability',
  pointers: 'Pointer Arithmetic & Memory',
  memory: 'Memory Management & Allocation',
  references: 'Value vs Reference Semantics',
  control_flow: 'Control Flow & Conditionals',
  functions: 'Functions & Scope Binding',
  oop: 'Object-Oriented Programming',
  concurrency: 'Async & Threading',
  type_system: 'Type System & Type Conversions',
  syntax_semantics: 'Syntax & Operator Precedence',
  error_handling: 'Exception & Error Handling'
});

// =============================================================================
// 2. CORE STATISTICAL & AGGREGATION FUNCTIONS
// =============================================================================

export const Analytics = {
  TOPIC_THRESHOLDS,
  GRADE_THRESHOLDS,
  TOPIC_NAMES,

  /**
   * Safe accuracy percentage calculation.
   * Prevents division by zero and invalid inputs.
   *
   * @param {number} correct - Number of correct answers
   * @param {number} attempted - Total questions attempted
   * @returns {number} Integer between 0 and 100
   */
  calculateAccuracy(correct, attempted) {
    const c = Math.max(0, parseInt(correct, 10) || 0);
    const a = Math.max(0, parseInt(attempted, 10) || 0);
    if (a === 0) return 0;
    return Math.min(100, Math.max(0, Math.round((c / a) * 100)));
  },

  /**
   * Formats a technical topic identifier into a human-friendly title.
   * @param {string} topicKey
   * @returns {string}
   */
  formatTopicName(topicKey) {
    if (!topicKey || typeof topicKey !== 'string') return 'Core Programming Concepts';
    const clean = topicKey.trim().toLowerCase();
    if (TOPIC_NAMES[clean]) return TOPIC_NAMES[clean];
    return clean
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  /**
   * Classify topic mastery based on accuracy and sample size.
   *
   * @param {number} accuracy - Percentage (0-100)
   * @param {number} attempts - Number of question attempts
   * @returns {'strong'|'developing'|'needs_practice'|'insufficient_data'}
   */
  classifyTopic(accuracy, attempts) {
    const att = Math.max(0, parseInt(attempts, 10) || 0);
    const acc = Math.max(0, Math.min(100, parseInt(accuracy, 10) || 0));

    if (att < TOPIC_THRESHOLDS.MIN_SAMPLE_SIZE) {
      return 'insufficient_data';
    }
    if (acc >= TOPIC_THRESHOLDS.STRONG) {
      return 'strong';
    }
    if (acc >= TOPIC_THRESHOLDS.DEVELOPING) {
      return 'developing';
    }
    return 'needs_practice';
  },

  /**
   * Evaluate stage performance grade and messaging.
   *
   * @param {number} accuracy - Accuracy percentage (0-100)
   * @param {boolean} [isGameOver=false] - True if Hardcore mode 0 hearts
   * @returns {{ grade: string, title: string, subtitle: string, badgeClass: string, colorVar: string }}
   */
  getGradeData(accuracy, isGameOver = false) {
    const acc = Math.max(0, Math.min(100, parseInt(accuracy, 10) || 0));

    if (isGameOver) {
      return {
        grade: 'TERM',
        title: 'Run Terminated',
        subtitle: 'Hearts depleted before stage completion. Score & XP committed.',
        badgeClass: 'badge-coral',
        colorVar: 'var(--color-danger)'
      };
    }

    if (acc >= GRADE_THRESHOLDS.S) {
      return {
        grade: 'S',
        title: 'Flawless Precision',
        subtitle: 'Outstanding code-tracing and syntactic mastery!',
        badgeClass: 'badge-emerald',
        colorVar: 'var(--color-primary)'
      };
    }
    if (acc >= GRADE_THRESHOLDS.A) {
      return {
        grade: 'A',
        title: 'High Dexterity',
        subtitle: 'Strong conceptual comprehension with minimal mistakes.',
        badgeClass: 'badge-emerald',
        colorVar: 'var(--color-primary)'
      };
    }
    if (acc >= GRADE_THRESHOLDS.B) {
      return {
        grade: 'B',
        title: 'Solid Understanding',
        subtitle: 'Good execution insight; review edge cases to reach perfection.',
        badgeClass: 'badge-cyan',
        colorVar: 'var(--color-success)'
      };
    }
    if (acc >= GRADE_THRESHOLDS.C) {
      return {
        grade: 'C',
        title: 'Developing Grasp',
        subtitle: 'Passable execution understanding; review missed questions.',
        badgeClass: 'badge-amber',
        colorVar: 'var(--color-warning)'
      };
    }
    return {
      grade: 'F',
      title: 'Needs Reinforcement',
      subtitle: 'Multiple core misconceptions detected. Recommended: Review explanations.',
      badgeClass: 'badge-coral',
      colorVar: 'var(--color-danger)'
    };
  },

  /**
   * Group question outcome records by topic and calculate per-topic statistics.
   *
   * @param {Array<object>} results - Array of question outcome records
   * @returns {Array<object>} Sorted list of topic performance objects
   */
  groupResultsByTopic(results) {
    if (!Array.isArray(results) || results.length === 0) {
      return [];
    }

    const topicMap = new Map();

    results.forEach((item, index) => {
      if (!item || typeof item !== 'object') return;
      const topicKey = (item.topic || 'general').trim().toLowerCase();
      const isCorrect = Boolean(item.isCorrect || item.correct);

      if (!topicMap.has(topicKey)) {
        topicMap.set(topicKey, {
          topic: topicKey,
          topicName: this.formatTopicName(topicKey),
          attempted: 0,
          correct: 0,
          incorrect: 0,
          subtopics: new Set(),
          questionIds: []
        });
      }

      const entry = topicMap.get(topicKey);
      entry.attempted++;
      if (isCorrect) {
        entry.correct++;
      } else {
        entry.incorrect++;
      }
      if (item.subtopic) {
        entry.subtopics.add(item.subtopic);
      }
      if (item.questionId || item.id) {
        entry.questionIds.push(item.questionId || item.id);
      }
    });

    const output = [];
    topicMap.forEach(data => {
      const accuracy = this.calculateAccuracy(data.correct, data.attempted);
      const classification = this.classifyTopic(accuracy, data.attempted);

      output.push({
        topic: data.topic,
        topicName: data.topicName,
        attempted: data.attempted,
        correct: data.correct,
        incorrect: data.incorrect,
        accuracy,
        classification,
        subtopics: Array.from(data.subtopics),
        questionIds: data.questionIds
      });
    });

    // Sort: lowest accuracy first to highlight weaknesses, then by volume
    return output.sort((a, b) => {
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
      return b.attempted - a.attempted;
    });
  },

  /**
   * Aggregate career performance for a specific programming language.
   *
   * @param {Array<object>} sessions - All completed historical session records
   * @param {'python'|'c'|'cpp'|'java'} language - Target language
   * @returns {object} Aggregated language performance summary
   */
  aggregateLanguageStats(sessions, language) {
    const lang = (language || 'python').toLowerCase().trim();
    const safeSessions = Array.isArray(sessions) ? sessions : [];
    const matched = safeSessions.filter(s => s && (s.language || '').toLowerCase().trim() === lang);

    if (matched.length === 0) {
      return {
        language: lang,
        hasData: false,
        totalSessions: 0,
        completedSessions: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
        questionsIncorrect: 0,
        accuracy: 0,
        bestScore: 0,
        totalScore: 0,
        strongTopics: [],
        weakTopics: []
      };
    }

    let totalSessions = matched.length;
    let completedSessions = 0;
    let questionsAttempted = 0;
    let questionsCorrect = 0;
    let bestScore = 0;
    let totalScore = 0;
    const allResults = [];

    matched.forEach(s => {
      const isRetry = s.mode === 'retry_missed' || Boolean(s.isRetryMissed);
      if (s.isCompleted !== false) completedSessions++;
      const att = parseInt(s.questionsAttempted, 10) || 0;
      const corr = parseInt(s.questionsCorrect, 10) || 0;
      const sc = parseInt(s.totalScore || s.score, 10) || 0;

      if (!isRetry) {
        questionsAttempted += att;
        questionsCorrect += corr;
      }
      totalScore += sc;
      if (sc > bestScore) bestScore = sc;

      if (Array.isArray(s.results)) {
        allResults.push(...s.results);
      }
    });

    const accuracy = this.calculateAccuracy(questionsCorrect, questionsAttempted);
    const topicBreakdown = this.groupResultsByTopic(allResults);

    const strongTopics = topicBreakdown.filter(t => t.classification === 'strong');
    const weakTopics = topicBreakdown.filter(t => t.classification === 'needs_practice');

    return {
      language: lang,
      hasData: true,
      totalSessions,
      completedSessions,
      questionsAttempted,
      questionsCorrect,
      questionsIncorrect: Math.max(0, questionsAttempted - questionsCorrect),
      accuracy,
      bestScore,
      totalScore,
      topicBreakdown,
      strongTopics,
      weakTopics
    };
  },

  /**
   * Aggregate career performance for a specific difficulty tier.
   *
   * @param {Array<object>} sessions - Historical session records
   * @param {'beginner'|'intermediate'|'expert'} difficulty - Target tier
   * @returns {object} Tier metrics summary
   */
  aggregateDifficultyStats(sessions, difficulty) {
    const diff = (difficulty || 'beginner').toLowerCase().trim();
    const safeSessions = Array.isArray(sessions) ? sessions : [];
    const matched = safeSessions.filter(s => s && (s.difficulty || '').toLowerCase().trim() === diff);

    if (matched.length === 0) {
      return {
        difficulty: diff,
        hasData: false,
        totalSessions: 0,
        completedSessions: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
        accuracy: 0,
        avgScore: 0,
        bestScore: 0
      };
    }

    let totalSessions = matched.length;
    let completedSessions = 0;
    let questionsAttempted = 0;
    let questionsCorrect = 0;
    let bestScore = 0;
    let totalScore = 0;

    matched.forEach(s => {
      const isRetry = s.mode === 'retry_missed' || Boolean(s.isRetryMissed);
      if (s.isCompleted !== false) completedSessions++;
      const att = parseInt(s.questionsAttempted, 10) || 0;
      const corr = parseInt(s.questionsCorrect, 10) || 0;
      const sc = parseInt(s.totalScore || s.score, 10) || 0;

      if (!isRetry) {
        questionsAttempted += att;
        questionsCorrect += corr;
      }
      totalScore += sc;
      if (sc > bestScore) bestScore = sc;
    });

    const accuracy = this.calculateAccuracy(questionsCorrect, questionsAttempted);
    const avgScore = completedSessions > 0 ? Math.round(totalScore / completedSessions) : 0;

    return {
      difficulty: diff,
      hasData: true,
      totalSessions,
      completedSessions,
      questionsAttempted,
      questionsCorrect,
      questionsIncorrect: Math.max(0, questionsAttempted - questionsCorrect),
      accuracy,
      avgScore,
      bestScore
    };
  },

  /**
   * Calculate chronological trend metrics across historical sessions.
   *
   * @param {Array<object>} sessions - Historical session records
   * @param {number} [maxEntries=10] - Number of recent records to analyze
   * @returns {{ points: Array<object>, trend: 'improving'|'declining'|'steady'|'neutral', avgAccuracy: number }}
   */
  calculateHistoricalTrend(sessions, maxEntries = 10) {
    if (!Array.isArray(sessions) || sessions.length === 0) {
      return {
        points: [],
        trend: 'neutral',
        avgAccuracy: 0
      };
    }

    // Filter valid completed or attempted sessions and sort chronologically (oldest to newest)
    const valid = sessions
      .filter(s => s && typeof s === 'object' && (s.questionsAttempted > 0 || s.totalQuestions > 0))
      .sort((a, b) => (a.timestamp || a.startTime || 0) - (b.timestamp || b.startTime || 0));

    const slice = valid.slice(-maxEntries);
    if (slice.length === 0) {
      return { points: [], trend: 'neutral', avgAccuracy: 0 };
    }

    let sumAcc = 0;
    const points = slice.map((s, idx) => {
      const att = s.questionsAttempted || s.totalQuestions || 0;
      const corr = s.questionsCorrect !== undefined ? s.questionsCorrect : (s.correctCount || 0);
      const acc = s.accuracy !== undefined ? s.accuracy : this.calculateAccuracy(corr, att);
      sumAcc += acc;

      return {
        index: idx + 1,
        sessionId: s.sessionId || s.id || `sess_${idx}`,
        date: s.timestamp ? new Date(s.timestamp).toLocaleDateString() : 'Recent',
        language: s.language || 'python',
        difficulty: s.difficulty || 'beginner',
        score: s.totalScore || s.score || 0,
        accuracy: acc,
        isCompleted: s.isCompleted !== false
      };
    });

    const avgAccuracy = Math.round(sumAcc / points.length);

    // Determine slope / trend
    let trend = 'steady';
    if (points.length >= 3) {
      const firstHalf = points.slice(0, Math.floor(points.length / 2));
      const secondHalf = points.slice(Math.floor(points.length / 2));

      const avg1 = firstHalf.reduce((sum, p) => sum + p.accuracy, 0) / firstHalf.length;
      const avg2 = secondHalf.reduce((sum, p) => sum + p.accuracy, 0) / secondHalf.length;

      const diff = avg2 - avg1;
      if (diff >= 5) trend = 'improving';
      else if (diff <= -5) trend = 'declining';
      else trend = 'steady';
    }

    return {
      points,
      trend,
      avgAccuracy
    };
  },

  /**
   * Deterministic learning recommendations generator.
   * Traceable, evidence-backed next steps without external APIs or fabricated AI.
   *
   * @param {object} sessionSummary - The completed or inspected session summary
   * @param {object} profile - Active player profile
   * @returns {Array<object>} Prioritized list of actionable recommendations
   */
  generateRecommendations(sessionSummary, profile = {}) {
    const recs = [];
    if (!sessionSummary || typeof sessionSummary !== 'object') {
      return [
        {
          id: 'rec_get_started',
          type: 'general',
          title: 'Enter the Challenge Arena',
          reason: 'Complete your first programming challenge session to unlock personalized analytics.',
          actionLabel: 'Launch Beginner Arena',
          actionUrl: 'game.html?lang=python&diff=beginner&mode=campaign'
        }
      ];
    }

    const lang = (sessionSummary.language || 'python').toLowerCase();
    const diff = (sessionSummary.difficulty || 'beginner').toLowerCase();
    const accuracy = sessionSummary.accuracy !== undefined
      ? sessionSummary.accuracy
      : this.calculateAccuracy(sessionSummary.questionsCorrect, sessionSummary.questionsAttempted);

    const results = Array.isArray(sessionSummary.results) ? sessionSummary.results : [];
    const topicBreakdown = this.groupResultsByTopic(results);
    const playerLevel = (profile && profile.level) || 1;

    // 1. Weak Topic Recommendation (Immediate pedagogical focus)
    const weakTopic = topicBreakdown.find(t => t.classification === 'needs_practice');
    if (weakTopic) {
      recs.push({
        id: `rec_topic_${weakTopic.topic}`,
        type: 'weak_topic',
        priority: 1,
        title: `Reinforce: ${weakTopic.topicName}`,
        reason: `Accuracy was ${weakTopic.accuracy}% (${weakTopic.correct}/${weakTopic.attempted} correct) on this topic during your run.`,
        actionLabel: `Practice ${weakTopic.topicName}`,
        actionUrl: `game.html?lang=${lang}&diff=${diff}&topic=${encodeURIComponent(weakTopic.topic)}&mode=practice`
      });
    }

    // 2. Retry Missed Questions Recommendation
    const missedCount = sessionSummary.incorrectCount !== undefined
      ? sessionSummary.incorrectCount
      : (sessionSummary.questionsAttempted - sessionSummary.questionsCorrect);

    if (missedCount > 0) {
      recs.push({
        id: 'rec_retry_missed',
        type: 'retry_missed',
        priority: 2,
        title: `Retry ${missedCount} Missed Question${missedCount > 1 ? 's' : ''}`,
        reason: 'Consolidate understanding by re-attempting concepts you missed with step-by-step explanations.',
        actionLabel: 'Launch Retry Session',
        actionUrl: `game.html?lang=${lang}&diff=${diff}&mode=retry_missed`
      });
    }

    // 3. Tier Advancement Recommendation
    if (accuracy >= 85 && (sessionSummary.questionsAttempted || 0) >= 4) {
      if (diff === 'beginner') {
        recs.push({
          id: 'rec_advance_intermediate',
          type: 'tier_advance',
          priority: 3,
          title: `Advance to Intermediate ${this.formatTopicName(lang)}`,
          reason: `High precision (${accuracy}%) on Beginner! You are ready for pointer aliasing, closures, and object lifetimes.`,
          actionLabel: 'Launch Intermediate Track',
          actionUrl: `game.html?lang=${lang}&diff=intermediate&mode=campaign`
        });
      } else if (diff === 'intermediate') {
        recs.push({
          id: 'rec_advance_expert',
          type: 'tier_advance',
          priority: 3,
          title: `Challenge the Expert ${this.formatTopicName(lang)} Tier`,
          reason: `Formidable mastery (${accuracy}%) on Intermediate. Tackle edge-case semantics and compiler internals.`,
          actionLabel: 'Launch Expert Track',
          actionUrl: `game.html?lang=${lang}&diff=expert&mode=campaign`
        });
      }
    }

    // 4. Hardcore Mode Recommendation (Level 5+ unlocked)
    if (accuracy >= 90 && playerLevel >= 5 && sessionSummary.mode !== 'hardcore') {
      recs.push({
        id: 'rec_try_hardcore',
        type: 'challenge_mode',
        priority: 4,
        title: 'Test Your Mastery in Hardcore Mode',
        reason: 'You have proven high accuracy and reached Level 5+. Test your nerves with 3 hearts and no hints!',
        actionLabel: 'Enter Hardcore Arena',
        actionUrl: `game.html?lang=${lang}&diff=${diff}&mode=hardcore`
      });
    }

    // 5. Polyglot Track Exploration
    const campaign = (profile && profile.campaign) || {};
    const unplayedLangs = ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql'].filter(l => {
      const camp = campaign[l];
      return !camp || (camp.beginnerStars === 0 && camp.unlockedTier === 'beginner');
    });

    if (unplayedLangs.length > 0 && recs.length < 3) {
      const nextLang = unplayedLangs[0];
      const titles = {
        python: 'Python 3',
        c: 'C (C99)',
        cpp: 'C++',
        java: 'Java',
        cyber: 'Cyber & Linux',
        javascript: 'JavaScript',
        rust: 'Rust',
        sql: 'SQL'
      };
      const langTitle = titles[nextLang] || nextLang.toUpperCase();
      recs.push({
        id: `rec_explore_${nextLang}`,
        type: 'polyglot',
        priority: 5,
        title: `Explore the ${langTitle} Arena Track`,
        reason: `Broaden your systems insight by tackling language-specific execution mechanics in ${langTitle}.`,
        actionLabel: `Begin ${langTitle} Track`,
        actionUrl: `game.html?lang=${nextLang}&diff=beginner&mode=campaign`
      });
    }

    // Ensure at least 1 helpful recommendation
    if (recs.length === 0) {
      recs.push({
        id: 'rec_general_play',
        type: 'general',
        priority: 6,
        title: 'Run Stage Again',
        reason: 'Solid session performance! Play again to improve your score and speed multipliers.',
        actionLabel: 'Replay Challenge Track',
        actionUrl: `game.html?lang=${lang}&diff=${diff}&mode=campaign`
      });
    }

    // Sort by priority and cap at 3 recommendations
    return recs.sort((a, b) => a.priority - b.priority).slice(0, 3);
  }
};
