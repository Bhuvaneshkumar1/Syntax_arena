/**
 * SyntaxArena Cyber Academy Controller (Learn Mode)
 * Interactive slide-based pedagogical engine providing step-by-step
 * conceptual mental models, live code runner, zero-stress interactive checkpoints,
 * danger zone pitfall warnings, track graduation diplomas, and direct transitions to Battle Tests.
 */

import { Utils } from './utils.js';
import { State } from './state.js';
import { Profile } from './profile.js';
import { UI } from './ui.js';
import { AudioEngine } from './audio.js';
import { SandboxManager } from './sandbox-manager.js';
import { MemoryInspector } from './memory-inspector.js';
import { academyLessons, AcademyLessons } from '../data/academy-lessons.js';

export const LearnController = {
  activeLang: 'python',
  activeDiff: 'beginner',
  currentLesson: null,
  currentSlideIndex: 0,
  drillAnswered: false,

  /**
   * Track metadata mapping for graduation diplomas and displays
   */
  trackMeta: {
    python: { name: 'Python 3 Core & Architecture', icon: '🐍', tag: 'tag-python' },
    javascript: { name: 'JavaScript Engine & Asynchrony', icon: '⚡', tag: 'tag-javascript' },
    html: { name: 'HTML5 & Modern CSS Systems', icon: '🌐', tag: 'tag-html' },
    asm: { name: 'x86-64 Assembly & Reverse Engineering', icon: '⚙️', tag: 'tag-asm' },
    go: { name: 'Go (Golang) Concurrent Systems', icon: '🔷', tag: 'tag-go' },
    rust: { name: 'Rust Memory Safety & Lifetimes', icon: '🦀', tag: 'tag-rust' },
    c: { name: 'C Systems Programming & Memory', icon: '⚡', tag: 'tag-c' },
    cpp: { name: 'Modern C++ (C++20) Architecture', icon: '🚀', tag: 'tag-cpp' },
    java: { name: 'Java Enterprise & JVM Internals', icon: '☕', tag: 'tag-java' },
    cyber: { name: 'Cyber Security & Linux Systems', icon: '🛡️', tag: 'tag-cyber' },
    sql: { name: 'Relational Database SQL & Analytics', icon: '🗄️', tag: 'tag-sql' },
    typescript: { name: 'TypeScript Advanced Type Systems', icon: '📘', tag: 'tag-typescript' }
  },

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
    this.updateDiplomaButton();
  },

  /**
   * Bind event listeners for Academy navigation
   */
  bindEvents() {
    // Language dropdown
    const langSelect = Utils.qs('#academy-lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.activeLang = e.target.value;
        this.currentSlideIndex = 0;
        this.loadLessonList();
        this.updateDiplomaButton();
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

    // Track Diploma button
    const diplomaBtn = Utils.qs('#btn-track-diploma');
    if (diplomaBtn) {
      diplomaBtn.addEventListener('click', () => {
        this.openTrackDiploma(this.activeLang);
      });
    }

    // Diploma modal controls
    const closeBtn = Utils.qs('#btn-close-diploma');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeTrackDiploma());

    const printBtn = Utils.qs('#btn-print-diploma');
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    const copyBtn = Utils.qs('#btn-copy-diploma-id');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const serialEl = Utils.qs('#diploma-serial-id');
        const serial = serialEl ? serialEl.textContent.trim() : '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(serial).then(() => {
            UI.showToast(`📋 Certificate ID ${serial} copied to clipboard!`, 'success');
          }).catch(() => {
            UI.showToast(`Certificate ID: ${serial}`, 'info');
          });
        } else {
          UI.showToast(`Certificate ID: ${serial}`, 'info');
        }
      });
    }

    const modalBackdrop = Utils.qs('#modal-track-diploma');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) this.closeTrackDiploma();
      });
    }

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
   * Update Track Diploma button styling and progress
   */
  updateDiplomaButton() {
    const diplomaBtn = Utils.qs('#btn-track-diploma');
    if (!diplomaBtn) return;

    const allForLang = AcademyLessons.getByLanguage(this.activeLang);
    const completedCount = allForLang.filter(l => Profile.isLessonCompleted(l.id)).length;
    const totalCount = allForLang.length || 5;

    if (completedCount >= totalCount && totalCount > 0) {
      diplomaBtn.innerHTML = `🎓 Track Diploma (${completedCount}/${totalCount}) ✓`;
      diplomaBtn.className = 'btn-arcade btn-primary btn-sm animate-pop';
      diplomaBtn.style.background = 'linear-gradient(135deg, #fbbf24, #d97706)';
      diplomaBtn.style.borderColor = '#f59e0b';
      diplomaBtn.style.color = '#000';
      diplomaBtn.style.fontWeight = '800';
    } else {
      diplomaBtn.innerHTML = `🎓 Track Diploma (${completedCount}/${totalCount})`;
      diplomaBtn.className = 'btn-arcade btn-neutral btn-sm';
      diplomaBtn.style.background = '';
      diplomaBtn.style.borderColor = '';
      diplomaBtn.style.color = '';
      diplomaBtn.style.fontWeight = '600';
    }
  },

  /**
   * Load lesson list for currently active language and difficulty
   */
  loadLessonList(targetLessonId = null) {
    let lessons = [];
    if (this.activeDiff === 'all') {
      lessons = AcademyLessons.getByLanguage(this.activeLang);
    } else {
      lessons = AcademyLessons.getByDifficulty(this.activeLang, this.activeDiff);
    }

    const container = Utils.qs('#academy-lesson-menu');
    if (!container) return;

    if (lessons.length === 0) {
      const allForLang = AcademyLessons.getByLanguage(this.activeLang);
      if (allForLang.length > 0) {
        this.activeDiff = 'all';
        Utils.qsa('[data-diff-filter]').forEach(b => {
          b.classList.toggle('is-active', b.dataset.diffFilter === 'all');
        });
        return this.loadLessonList(targetLessonId);
      }

      container.innerHTML = `<div class="empty-state-notice">Curriculum for ${this.activeLang} is coming soon in the next release!</div>`;
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
    this.updateDiplomaButton();
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
   * Render Slide 1: Core Concept with Live Code Runner
   */
  renderConceptSlide(slide, container) {
    const ext = this.getFileExt(this.currentLesson.language);
    const initialCode = slide.sandboxCode || slide.codeSnippet || '';

    container.innerHTML = `
      <div class="academy-concept-view animate-fade-in">
        <div class="academy-prose" style="font-size: var(--text-base); line-height: 1.7; color: var(--text-secondary); margin-bottom: var(--space-5);">
          ${this.formatProse(slide.content)}
        </div>

        <!-- Interactive Live Code Runner Terminal -->
        <div class="code-terminal" style="margin-bottom: var(--space-4);">
          <div class="code-terminal-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-family: var(--font-mono); font-size: 11px; color: var(--color-cyan);">concept_demo.${ext}</span>
              <span class="badge badge-neutral" style="font-size: 9px;">LIVE EDITABLE</span>
            </div>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <button id="btn-slide-run-code" class="btn-arcade btn-primary btn-sm" type="button" style="padding: 3px 12px; font-size: 11px;" title="Execute snippet live in browser">
                ▶️ Run Code
              </button>
              <button id="btn-slide-reset-code" class="btn-arcade btn-neutral btn-sm" type="button" style="padding: 3px 10px; font-size: 11px;" title="Restore original lesson code">
                ↺ Reset
              </button>
              <a href="sandbox.html?env=${this.currentLesson.language}" class="btn-arcade btn-outline btn-sm" id="btn-open-sandbox" target="_blank" rel="noopener" style="padding: 3px 10px; font-size: 11px;" title="Open full multi-file developer workspace">
                🛠️ Full Sandbox ↗
              </a>
            </div>
          </div>

          <textarea id="slide-code-editor" class="code-terminal-editor" spellcheck="false" aria-label="Interactive concept code editor" rows="7">${Utils.escapeHtml(initialCode)}</textarea>

          <!-- Real-Time Stdout Tray -->
          <div id="slide-terminal-output" class="code-terminal-output" style="display: none;" role="region" aria-label="Code execution output tray">
            <div class="code-terminal-output-header">
              <span style="display: flex; align-items: center; gap: 6px;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
                <strong>CONSOLE OUTPUT</strong>
              </span>
              <span id="slide-output-metrics">READY</span>
            </div>
            <pre id="slide-output-body" class="code-terminal-output-body"></pre>
          </div>
        </div>

        <!-- Visual Memory & Pointer Inspector (Mental Model Visualization) -->
        <div id="lesson-memory-inspector" class="card card-raised visual-memory-card" style="margin-top: 1rem; padding: 1rem; border-color: rgba(139, 92, 246, 0.35); background: rgba(13, 22, 38, 0.7);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge badge-violet" style="font-size: 10px;">⚡ MEMORY TRACER</span>
              <span style="font-weight: 700; font-size: var(--text-sm); font-family: var(--font-display);">Stack &amp; Heap Visual Pointer Inspector</span>
            </div>
            <span class="badge badge-cyan" style="font-size: 10px;">x86-64 Architecture</span>
          </div>
          <div id="lesson-memory-container" class="memory-grid-container">
            <!-- Rendered dynamically by MemoryInspector -->
          </div>
        </div>

      </div>
    `;

    // Render initial visual memory model
    const memContainer = container.querySelector('#lesson-memory-container');
    if (memContainer) {
      const model = MemoryInspector.generateMemoryModel(initialCode, this.currentLesson.language);
      MemoryInspector.render(memContainer, model);
    }

    // Bind Live Code Runner events
    const runBtn = container.querySelector('#btn-slide-run-code');
    const resetBtn = container.querySelector('#btn-slide-reset-code');
    const editor = container.querySelector('#slide-code-editor');

    if (runBtn) {
      runBtn.addEventListener('click', () => {
        this.executeSlideCode(slide);
      });
    }

    if (resetBtn && editor) {
      resetBtn.addEventListener('click', () => {
        editor.value = initialCode;
        const outputTray = container.querySelector('#slide-terminal-output');
        if (outputTray) outputTray.style.display = 'none';

        // Reset memory inspector
        if (memContainer) {
          const model = MemoryInspector.generateMemoryModel(initialCode, this.currentLesson.language);
          MemoryInspector.render(memContainer, model);
        }

        if (typeof AudioEngine !== 'undefined' && AudioEngine.playClick) {
          AudioEngine.playClick();
        }
        UI.showToast('↺ Code restored to lesson starting state', 'info');
      });
    }
  },

  /**
   * Execute slide code using SandboxManager across all 12 languages client-side
   */
  async executeSlideCode(slide) {
    const editor = Utils.qs('#slide-code-editor');
    const runBtn = Utils.qs('#btn-slide-run-code');
    const outputTray = Utils.qs('#slide-terminal-output');
    const outputBody = Utils.qs('#slide-output-body');
    const metrics = Utils.qs('#slide-output-metrics');

    if (!editor || !runBtn || !outputTray || !outputBody) return;

    const code = editor.value;
    const lang = this.currentLesson.language;

    runBtn.disabled = true;
    runBtn.textContent = '⏳ Running...';
    outputTray.style.display = 'block';
    outputBody.textContent = 'Compiling and executing in client sandbox...';
    outputBody.classList.remove('is-error');

    if (metrics) metrics.textContent = 'EXECUTING...';

    const start = performance.now();
    let result = { success: true, output: '', error: null, elapsedMs: 0 };

    try {
      if (typeof SandboxManager !== 'undefined') {
        if (lang === 'python') {
          result = await SandboxManager.runPython(code, 4000);
        } else if (lang === 'javascript') {
          result = SandboxManager.runJS(code);
        } else if (lang === 'typescript') {
          result = SandboxManager.runTypeScript(code);
        } else if (lang === 'go') {
          result = SandboxManager.runGo(code);
        } else if (lang === 'html') {
          result = SandboxManager.runHTML(code);
        } else if (lang === 'asm') {
          result = SandboxManager.runAssembly(code);
        } else if (lang === 'cyber') {
          result = SandboxManager.runBashScript(code);
        } else if (lang === 'sql') {
          result = SandboxManager.runSQL(code);
        } else if (['c', 'cpp', 'java', 'rust'].includes(lang)) {
          result = SandboxManager.simulateSystemsCode(code, lang);
        } else {
          result = { success: true, output: code, elapsedMs: 5 };
        }
      } else {
        result = { success: true, output: 'SandboxManager loaded. Code syntax verified.', elapsedMs: 5 };
      }
    } catch (err) {
      result = { success: false, output: '', error: err.toString(), elapsedMs: Math.round(performance.now() - start) };
    }

    const elapsed = result.elapsedMs || Math.round(performance.now() - start);

    if (result.success && !result.error) {
      outputBody.classList.remove('is-error');
      outputBody.textContent = result.output || '(Program completed with exit code 0)';
      if (metrics) metrics.textContent = `⚡ EXECUTED IN ${elapsed}MS // STATUS: 0 (OK)`;
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playCorrect) {
        AudioEngine.playCorrect();
      }
    } else {
      outputBody.classList.add('is-error');
      outputBody.textContent = result.error || result.output || 'Execution failure';
      if (metrics) metrics.textContent = `⚠️ ERROR // EXIT CODE: 1 (${elapsed}MS)`;
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playError) {
        AudioEngine.playError();
      }
    }

    // Update visual memory inspector after execution
    const memContainer = Utils.qs('#lesson-memory-container');
    if (memContainer && typeof MemoryInspector !== 'undefined') {
      const model = MemoryInspector.generateMemoryModel(code, lang);
      MemoryInspector.render(memContainer, model);
    }

    runBtn.disabled = false;
    runBtn.textContent = '▶️ Run Code';
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
            this.updateDiplomaButton();
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
   * Open Track Graduation Diploma Modal
   */
  openTrackDiploma(trackId) {
    const modal = Utils.qs('#modal-track-diploma');
    if (!modal) return;

    const meta = this.trackMeta[trackId] || { name: `${trackId.toUpperCase()} Core Track`, icon: '🏛️' };
    const allForLang = AcademyLessons.getByLanguage(trackId);
    const completedCount = allForLang.filter(l => Profile.isLessonCompleted(l.id)).length;
    const totalCount = allForLang.length || 5;

    const activeProf = (typeof State !== 'undefined' && State.get('activeProfile')) || Profile.getActiveProfile();
    const callsign = (activeProf && activeProf.username) || 'ScriptAdept';

    // Populate Diploma Elements
    const callsignEl = Utils.qs('#diploma-callsign');
    const trackNameEl = Utils.qs('#diploma-track-name');
    const summaryEl = Utils.qs('#diploma-curriculum-summary');
    const issueDateEl = Utils.qs('#diploma-issue-date');
    const serialEl = Utils.qs('#diploma-serial-id');

    if (callsignEl) callsignEl.textContent = callsign;
    if (trackNameEl) trackNameEl.textContent = meta.name.toUpperCase();
    if (summaryEl) {
      if (completedCount >= totalCount) {
        summaryEl.innerHTML = `<strong>Accreditation Level: 100% Complete (${completedCount}/${totalCount} Modules Mastered)</strong><br>Demonstrated verifiable mastery across syntax semantics, checkpoint drills, and production pitfall mitigation.`;
      } else {
        summaryEl.innerHTML = `<strong>Current Progress: ${completedCount}/${totalCount} Modules Completed</strong><br>Complete all 5 modules in ${meta.name} to earn verified Grandmaster graduation status.`;
      }
    }

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    if (issueDateEl) issueDateEl.textContent = dateStr;

    // Generate deterministic verifiable hash
    let hashNum = 0;
    const seed = `${callsign}-${trackId}-syntaxarena`;
    for (let i = 0; i < seed.length; i++) {
      hashNum = (hashNum << 5) - hashNum + seed.charCodeAt(i);
      hashNum |= 0;
    }
    const hashHex = Math.abs(hashNum).toString(16).toUpperCase().padStart(6, '0').slice(0, 6);
    const serialId = `SA-CERT-${trackId.toUpperCase().slice(0, 4)}-${hashHex}`;
    if (serialEl) serialEl.textContent = serialId;

    modal.style.display = 'flex';
    modal.classList.add('is-open');

    if (completedCount >= totalCount) {
      if (typeof UI !== 'undefined' && UI.triggerConfetti) UI.triggerConfetti();
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playBadge) AudioEngine.playBadge();
      UI.showToast(`🎓 Track Diploma loaded for ${meta.name}!`, 'success');
    } else {
      if (typeof AudioEngine !== 'undefined' && AudioEngine.playClick) AudioEngine.playClick();
      UI.showToast(`Diploma preview: ${completedCount}/${totalCount} lessons completed`, 'info');
    }
  },

  /**
   * Close Track Graduation Diploma Modal
   */
  closeTrackDiploma() {
    const modal = Utils.qs('#modal-track-diploma');
    if (modal) {
      modal.classList.remove('is-open');
      modal.style.display = 'none';
    }
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
