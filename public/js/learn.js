/**
 * SyntaxArena Cyber Academy Controller (Learn Mode)
 * Interactive slide-based pedagogical engine providing step-by-step
 * conceptual mental models, zero-stress interactive checkpoints,
 * danger zone pitfall warnings, and direct transitions to Battle Tests.
 */

import { Utils } from './utils.js';
import { State } from './state.js';
import { Profile } from './profile.js';
import { UI } from './ui.js';
import { AudioEngine } from './audio.js';
import { academyLessons, AcademyLessons } from '../data/academy-lessons.js';

export const LearnController = {
  activeLang: 'python',
  activeDiff: 'beginner',
  currentLesson: null,
  currentSlideIndex: 0,
  drillAnswered: false,

  /**
   * Initialize Cyber Academy view
   */
  init() {
    if (this._initialized) return;
    this._initialized = true;

    State.init();
    if (typeof UI !== 'undefined' && typeof UI.updateHeaderProfile === 'function') {
      UI.updateHeaderProfile();
    }

    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const urlDiff = params.get('diff');
    const urlLesson = params.get('lesson');

    if (urlLang) this.activeLang = urlLang.toLowerCase();
    if (urlDiff) this.activeDiff = urlDiff.toLowerCase();

    this.bindEvents();
    this.renderTrackSelector();
    this.loadLessonList(urlLesson);
  },

  /**
   * Bind event listeners for Academy navigation
   */
  bindEvents() {
    // Language dropdown or pills
    const langSelect = Utils.qs('#academy-lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.activeLang = e.target.value;
        this.currentSlideIndex = 0;
        this.loadLessonList();
      });
    }

    // Difficulty pills
    const diffButtons = Utils.qsa('[data-diff-filter]');
    diffButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        diffButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.activeDiff = btn.dataset.diffFilter;
        this.currentSlideIndex = 0;
        this.loadLessonList();
      });
    });

    // Slide navigation buttons
    const btnPrev = Utils.qs('#btn-slide-prev');
    const btnNext = Utils.qs('#btn-slide-next');
    if (btnPrev) btnPrev.addEventListener('click', () => this.prevSlide());
    if (btnNext) btnNext.addEventListener('click', () => this.nextSlide());

    // Keyboard shortcuts: Arrow keys for slides
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') this.nextSlide();
      if (e.key === 'ArrowLeft') this.prevSlide();
    });
  },

  /**
   * Render Language Select options
   */
  renderTrackSelector() {
    const langSelect = Utils.qs('#academy-lang-select');
    if (!langSelect) return;

    const langs = [
      { id: 'python', name: '🐍 Python 3' },
      { id: 'javascript', name: '⚡ JavaScript' },
      { id: 'html', name: '🌐 HTML5 & CSS' },
      { id: 'asm', name: '⚙️ Assembly & RE' },
      { id: 'go', name: '🔷 Go (Golang)' },
      { id: 'rust', name: '🦀 Rust' },
      { id: 'c', name: '⚡ C (C99/C11)' },
      { id: 'cpp', name: '🚀 C++ (Modern)' },
      { id: 'java', name: '☕ Java (SE 17)' },
      { id: 'cyber', name: '🛡️ Cyber & Linux' },
      { id: 'sql', name: '🗄️ SQL' },
      { id: 'typescript', name: '📘 TypeScript' }
    ];

    langSelect.innerHTML = langs.map(l => `
      <option value="${l.id}" ${l.id === this.activeLang ? 'selected' : ''}>${l.name}</option>
    `).join('');
  },

  /**
   * Load lesson list for currently active language and difficulty
   */
  loadLessonList(targetLessonId = null) {
    const lessons = AcademyLessons.getByDifficulty(this.activeLang, this.activeDiff);
    const container = Utils.qs('#academy-lesson-menu');

    if (!container) return;

    if (lessons.length === 0) {
      // Fallback: check all difficulties for this language
      const allForLang = AcademyLessons.getByLanguage(this.activeLang);
      if (allForLang.length > 0) {
        this.activeDiff = allForLang[0].difficulty;
        // Sync diff buttons
        Utils.qsa('[data-diff-filter]').forEach(b => {
          b.classList.toggle('is-active', b.dataset.diffFilter === this.activeDiff);
        });
        return this.loadLessonList(targetLessonId);
      }

      container.innerHTML = `<div class="empty-state-notice">Curriculum for ${this.activeLang} (${this.activeDiff}) is coming soon in the next module release!</div>`;
      this.currentLesson = null;
      this.renderEmptyLesson();
      return;
    }

    // Determine target lesson
    let selected = null;
    if (targetLessonId) {
      selected = lessons.find(l => l.id === targetLessonId);
    }
    if (!selected) {
      selected = lessons[0];
    }

    this.currentLesson = selected;
    this.currentSlideIndex = 0;

    // Render lesson tabs / list
    container.innerHTML = lessons.map(lesson => {
      const isCompleted = Profile.isLessonCompleted(lesson.id);
      const isCurrent = lesson.id === selected.id;
      return `
        <button class="lesson-nav-btn ${isCurrent ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}"
                data-lesson-id="${lesson.id}">
          <span class="lesson-status-icon">${isCompleted ? '✓' : '●'}</span>
          <div class="lesson-meta">
            <span class="lesson-title">${Utils.escapeHtml(lesson.title)}</span>
            <span class="lesson-sub">${Utils.escapeHtml(lesson.topic)} • ${lesson.estimatedMinutes}m</span>
          </div>
        </button>
      `;
    }).join('');

    // Bind click events on lesson menu
    Utils.qsa('.lesson-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.lessonId;
        const target = lessons.find(l => l.id === id);
        if (target) {
          this.currentLesson = target;
          this.currentSlideIndex = 0;
          Utils.qsa('.lesson-nav-btn').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          this.renderSlide();
        }
      });
    });

    this.renderSlide();
  },

  /**
   * Render active slide
   */
  renderSlide() {
    if (!this.currentLesson || !this.currentLesson.slides) {
      this.renderEmptyLesson();
      return;
    }

    const slides = this.currentLesson.slides;
    if (this.currentSlideIndex >= slides.length) this.currentSlideIndex = slides.length - 1;
    if (this.currentSlideIndex < 0) this.currentSlideIndex = 0;

    const slide = slides[this.currentSlideIndex];
    this.drillAnswered = false;

    // Header info
    const tagEl = Utils.qs('#lesson-track-tag');
    const topicEl = Utils.qs('#lesson-topic-title');
    const titleEl = Utils.qs('#slide-main-title');
    const badgeEl = Utils.qs('#slide-type-badge');
    const progressText = Utils.qs('#slide-step-counter');

    if (tagEl) {
      tagEl.textContent = `${this.currentLesson.language.toUpperCase()} // ${this.currentLesson.difficulty.toUpperCase()}`;
      tagEl.className = `tag tag-${this.currentLesson.language}`;
    }
    if (topicEl) topicEl.textContent = this.currentLesson.topic;
    if (titleEl) titleEl.textContent = slide.title;
    if (badgeEl) badgeEl.textContent = slide.badge;
    if (progressText) progressText.textContent = `Slide ${this.currentSlideIndex + 1} of ${slides.length}`;

    // Render Progress Dots
    const dotsContainer = Utils.qs('#slide-progress-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = slides.map((s, idx) => `
        <button class="slide-dot ${idx === this.currentSlideIndex ? 'is-active' : ''} ${idx < this.currentSlideIndex ? 'is-passed' : ''}"
                data-slide-idx="${idx}"
                title="${Utils.escapeHtml(s.title)}"
                aria-label="Go to slide ${idx + 1}">
        </button>
      `).join('');

      Utils.qsa('.slide-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          this.currentSlideIndex = parseInt(dot.dataset.slideIdx, 10);
          this.renderSlide();
        });
      });
    }

    // Render Body according to slide type
    const bodyContainer = Utils.qs('#slide-body-container');
    if (!bodyContainer) return;

    if (slide.type === 'concept') {
      this.renderConceptSlide(slide, bodyContainer);
    } else if (slide.type === 'drill') {
      this.renderDrillSlide(slide, bodyContainer);
    } else if (slide.type === 'pitfall') {
      this.renderPitfallSlide(slide, bodyContainer);
    }

    // Update navigation button states
    const btnPrev = Utils.qs('#btn-slide-prev');
    const btnNext = Utils.qs('#btn-slide-next');

    if (btnPrev) {
      btnPrev.disabled = this.currentSlideIndex === 0;
      btnPrev.style.opacity = this.currentSlideIndex === 0 ? '0.4' : '1';
    }
    if (btnNext) {
      if (this.currentSlideIndex === slides.length - 1) {
        btnNext.innerHTML = `<span>Take Battle Test ⚔️</span>`;
        btnNext.className = 'btn-arcade btn-primary btn-md';
      } else {
        btnNext.innerHTML = `<span>Next Step ➡️</span>`;
        btnNext.className = 'btn-arcade btn-outline btn-md';
      }
    }
  },

  /**
   * Render Slide 1: Core Concept
   */
  renderConceptSlide(slide, container) {
    const sandboxBtnHtml = slide.sandboxCode ? `
      <div style="margin-top: var(--space-4); display: flex; justify-content: flex-end;">
        <a href="sandbox.html?env=${this.currentLesson.language}" class="btn-arcade btn-outline btn-sm" id="btn-open-sandbox" target="_blank" rel="noopener">
          <span>🛠️ Try in Live Sandbox</span>
        </a>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="academy-concept-view animate-fade-in">
        <div class="academy-prose" style="font-size: var(--text-base); line-height: 1.7; color: var(--text-secondary); margin-bottom: var(--space-5);">
          ${this.formatProse(slide.content)}
        </div>

        <div class="code-terminal" style="margin-bottom: var(--space-4);">
          <div class="code-terminal-header">
            <span>concept_demo.${this.getFileExt(this.currentLesson.language)}</span>
            <span>SyntaxArena Academy</span>
          </div>
          <pre class="code-terminal-pre"><code>${Utils.escapeHtml(slide.codeSnippet || '')}</code></pre>
        </div>

        ${sandboxBtnHtml}
      </div>
    `;
  },

  /**
   * Render Slide 2: Interactive Drill Checkpoint
   */
  renderDrillSlide(slide, container) {
    container.innerHTML = `
      <div class="academy-drill-view animate-fade-in">
        <div class="drill-prompt-box" style="margin-bottom: var(--space-4);">
          <h3 style="font-size: var(--text-lg); color: var(--text-primary); margin-bottom: var(--space-2);">${Utils.escapeHtml(slide.prompt)}</h3>
        </div>

        ${slide.codeSnippet ? `
          <div class="code-terminal" style="margin-bottom: var(--space-5);">
            <div class="code-terminal-header">
              <span>checkpoint_challenge.${this.getFileExt(this.currentLesson.language)}</span>
              <span>Zero-Stress Practice</span>
            </div>
            <pre class="code-terminal-pre"><code>${Utils.escapeHtml(slide.codeSnippet)}</code></pre>
          </div>
        ` : ''}

        <div class="drill-options-grid" id="drill-options-container" style="display: grid; gap: var(--space-3); margin-bottom: var(--space-4);">
          ${slide.options.map((opt, idx) => `
            <button class="option-card drill-option-card" data-opt-idx="${idx}" style="text-align: left; padding: var(--space-3) var(--space-4);">
              <span class="option-marker" style="display: inline-block; width: 24px; font-weight: bold; color: var(--text-muted);">${String.fromCharCode(65 + idx)}.</span>
              <span class="option-text">${Utils.escapeHtml(opt.text)}</span>
            </button>
          `).join('')}
        </div>

        <div id="drill-feedback-box" class="feedback-panel" style="display: none; padding: var(--space-4); border-radius: var(--radius-md);">
          <p id="drill-feedback-text" style="margin: 0; font-size: var(--text-sm); line-height: 1.5;"></p>
        </div>
      </div>
    `;

    // Bind option click
    const optButtons = container.querySelectorAll('.drill-option-card');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.optIdx, 10);
        const selectedOpt = slide.options[idx];

        optButtons.forEach(b => {
          b.classList.remove('is-correct', 'is-incorrect');
          b.style.pointerEvents = 'none'; // Lock after answering
        });

        const feedbackBox = Utils.qs('#drill-feedback-box');
        const feedbackText = Utils.qs('#drill-feedback-text');

        if (selectedOpt.isCorrect) {
          btn.classList.add('is-correct');
          if (feedbackBox) {
            feedbackBox.style.display = 'block';
            feedbackBox.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
            feedbackBox.style.borderColor = 'var(--color-success)';
          }
          if (feedbackText) {
            feedbackText.innerHTML = `<strong>🌟 Checkpoint Clear:</strong> ${Utils.escapeHtml(selectedOpt.feedback || 'Great job! You grasped this concept.')}`;
          }

          if (typeof AudioEngine !== 'undefined' && AudioEngine.playCorrect) {
            AudioEngine.playCorrect();
          }

          // Mark lesson completed in profile and award Scholar XP!
          const result = Profile.recordLessonCompleted(this.currentLesson.id);
          if (result.recorded) {
            UI.showToast(`🎓 +${result.xpEarned} Scholar XP! Lesson recorded.`, 'success');
          }
        } else {
          btn.classList.add('is-incorrect');
          if (feedbackBox) {
            feedbackBox.style.display = 'block';
            feedbackBox.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
            feedbackBox.style.borderColor = 'var(--color-danger)';
          }
          if (feedbackText) {
            feedbackText.innerHTML = `<strong>💡 Try Reviewing:</strong> ${Utils.escapeHtml(selectedOpt.feedback || 'Not quite. Check the reference rules on slide 1.')}`;
          }

          // Allow retrying drill
          setTimeout(() => {
            optButtons.forEach(b => b.style.pointerEvents = 'auto');
          }, 1200);

          if (typeof AudioEngine !== 'undefined' && AudioEngine.playIncorrect) {
            AudioEngine.playIncorrect();
          }
        }
      });
    });
  },

  /**
   * Render Slide 3: Danger Zone / Common Pitfalls & Battle Ready CTA
   */
  renderPitfallSlide(slide, container) {
    const arenaUrl = slide.arenaTarget || `game.html?lang=${this.currentLesson.language}&diff=${this.currentLesson.difficulty}&stage=1`;

    container.innerHTML = `
      <div class="academy-pitfall-view animate-fade-in">
        <div class="pitfall-alert-card" style="background: rgba(245, 158, 11, 0.08); border: 2px solid var(--color-warning); border-radius: var(--radius-md); padding: var(--space-5); margin-bottom: var(--space-5);">
          <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2); color: var(--color-warning); font-weight: 700; font-family: var(--font-mono); font-size: var(--text-sm);">
            <span>⚠️ PRODUCTION DANGER ZONE & INTERVIEW GOTCHAS</span>
          </div>
          <div style="font-size: var(--text-base); line-height: 1.6; color: var(--text-secondary); margin-bottom: var(--space-4);">
            ${this.formatProse(slide.content)}
          </div>

          ${slide.codeSnippet ? `
            <div class="code-terminal" style="margin-bottom: var(--space-3); border-color: rgba(245, 158, 11, 0.4);">
              <div class="code-terminal-header">
                <span>bug_vs_fix.${this.getFileExt(this.currentLesson.language)}</span>
                <span style="color: var(--color-warning);">Watch Out</span>
              </div>
              <pre class="code-terminal-pre"><code>${Utils.escapeHtml(slide.codeSnippet)}</code></pre>
            </div>
          ` : ''}

          ${slide.tip ? `
            <div class="pitfall-tip-pill" style="display: inline-block; padding: 4px 12px; background: rgba(0, 229, 255, 0.1); border: 1px solid var(--color-primary); border-radius: var(--radius-full); font-size: var(--text-xs); color: var(--color-primary); font-family: var(--font-mono);">
              ${Utils.escapeHtml(slide.tip)}
            </div>
          ` : ''}
        </div>

        <!-- Call to Battle Test Arena CTA Card -->
        <div class="arena-launch-card" style="background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(16, 185, 129, 0.15)); border: 2px solid var(--color-primary); border-radius: var(--radius-lg); padding: var(--space-6); text-align: center;">
          <h2 style="font-size: var(--text-2xl); color: var(--text-primary); margin-bottom: var(--space-2);">
            ⚔️ You Are Battle Ready!
          </h2>
          <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto var(--space-5); font-size: var(--text-sm);">
            You have mastered the mental model and avoided the common traps. Now prove your speed and knowledge in the timed Battle Arena!
          </p>
          <a href="${arenaUrl}" class="btn-arcade btn-primary btn-lg" id="btn-launch-arena-test" style="font-size: var(--text-base); padding: var(--space-3) var(--space-8);">
            <span>Launch ${this.currentLesson.language.toUpperCase()} Arena Test ⚔️</span>
          </a>
        </div>
      </div>
    `;
  },

  /**
   * Advance to next slide or launch test if on last slide
   */
  nextSlide() {
    if (!this.currentLesson || !this.currentLesson.slides) return;
    if (this.currentSlideIndex < this.currentLesson.slides.length - 1) {
      this.currentSlideIndex++;
      this.renderSlide();
    } else {
      // Last slide -> Launch arena test
      const slide = this.currentLesson.slides[this.currentSlideIndex];
      const targetUrl = (slide && slide.arenaTarget) || `game.html?lang=${this.currentLesson.language}&diff=${this.currentLesson.difficulty}&stage=1`;
      window.location.href = targetUrl;
    }
  },

  /**
   * Go back to previous slide
   */
  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.renderSlide();
    }
  },

  /**
   * Display empty state
   */
  renderEmptyLesson() {
    const body = Utils.qs('#slide-body-container');
    if (body) {
      body.innerHTML = `
        <div style="text-align: center; padding: var(--space-8);">
          <div style="font-size: 3rem; margin-bottom: var(--space-3);">📘</div>
          <h3 style="color: var(--text-primary); font-size: var(--text-xl);">No lessons found for this tier yet</h3>
          <p style="color: var(--text-muted); margin-bottom: var(--space-4);">Select a different language or difficulty tier above.</p>
          <a href="index.html" class="btn-arcade btn-outline btn-md">Return to Hub</a>
        </div>
      `;
    }
  },

  /**
   * Format prose with bold text and backtick inline code
   */
  formatProse(text) {
    if (!text) return '';
    return Utils.escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\n\n/g, '<br><br>');
  },

  /**
   * Get file extension for code editor label
   */
  getFileExt(lang) {
    const extMap = {
      python: 'py',
      javascript: 'js',
      html: 'html',
      asm: 's',
      go: 'go',
      rust: 'rs',
      c: 'c',
      cpp: 'cpp',
      java: 'java',
      sql: 'sql',
      cyber: 'sh',
      typescript: 'ts'
    };
    return extMap[lang] || 'txt';
  }
};

// Auto-bootstrap when page loads
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      LearnController.init();
    });
  } else {
    LearnController.init();
  }
}
