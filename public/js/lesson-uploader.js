/**
 * SyntaxArena Lesson Uploader & Curriculum Studio
 * Handles Drag & Drop ingestion of custom 60-question packs and Cyber Academy modules,
 * automated pre-flight pedagogical validation, live deployment to all users,
 * and custom curriculum pack management.
 */

import { Utils } from './utils.js';
import { Storage } from './storage.js';
import { QuestionValidator, ALLOWED_LANGUAGES, ALLOWED_DIFFICULTIES } from './question-validator.js';

export const LessonUploader = {
  currentPayload: null,
  validationResult: null,
  _initialized: false,

  /**
   * Initialize drag & drop uploader within Admin Console
   */
  init() {
    if (!this._initialized) {
      this.bindDropzone();
      this.bindControls();
      this._initialized = true;
    }
    this.renderCustomLessonsRoster();
  },

  /**
   * Bind drag and drop events and file picker
   */
  bindDropzone() {
    const dropzone = Utils.qs('#lesson-dropzone');
    const fileInput = Utils.qs('#lesson-file-input');

    if (!dropzone || !fileInput) return;

    // Prevent default drag behaviors across the document
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    // Highlight dropzone on drag over
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, () => {
        dropzone.classList.add('is-dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, () => {
        dropzone.classList.remove('is-dragover');
      }, false);
    });

    // Handle dropped files
    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        this.processFile(files[0]);
      }
    });

    // Click to select file
    dropzone.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        this.processFile(fileInput.files[0]);
      }
    });
  },

  /**
   * Bind action buttons: Deploy, Reset, Download Template
   */
  bindControls() {
    const deployBtn = Utils.qs('#btn-deploy-lesson');
    if (deployBtn) {
      deployBtn.addEventListener('click', () => this.handleDeploy());
    }

    const resetBtn = Utils.qs('#btn-reset-upload');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetForm());
    }

    const downloadTemplateBtn = Utils.qs('#btn-download-sample-template');
    if (downloadTemplateBtn) {
      downloadTemplateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.downloadSampleTemplate();
      });
    }

    // Auto-update metadata when admin changes title/lang/diff
    const titleInput = Utils.qs('#lesson-upload-title');
    const langSelect = Utils.qs('#lesson-upload-lang');
    const customLangWrap = Utils.qs('#custom-subject-input-wrap');
    const customLangInput = Utils.qs('#lesson-upload-custom-lang');
    const diffSelect = Utils.qs('#lesson-upload-tier');

    if (langSelect) {
      langSelect.addEventListener('change', () => {
        if (langSelect.value === '__custom__') {
          if (customLangWrap) customLangWrap.style.display = 'block';
          if (customLangInput) customLangInput.focus();
        } else {
          if (customLangWrap) customLangWrap.style.display = 'none';
        }
        if (this.currentPayload) this.syncMetadataFromInputs();
      });
    }

    [titleInput, customLangInput, diffSelect].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          if (this.currentPayload) {
            this.syncMetadataFromInputs();
          }
        });
      }
    });
  },

  /**
   * Read and parse incoming JSON file
   * @param {File} file
   */
  processFile(file) {
    if (!file) return;

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      this.renderValidationError('Invalid file type. Please upload a .json curriculum pack.');
      return;
    }

    const fileNameLabel = Utils.qs('#upload-filename-label');
    if (fileNameLabel) {
      fileNameLabel.textContent = `📄 ${file.name} (${Math.round(file.size / 1024)} KB)`;
      fileNameLabel.style.display = 'inline-block';
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const json = JSON.parse(text);
        this.currentPayload = json;
        this.validateAndPreviewPayload(json);
      } catch (err) {
        this.renderValidationError(`JSON Parse Error: Malformed JSON syntax in ${file.name}. (${err.message})`);
      }
    };
    reader.onerror = () => {
      this.renderValidationError(`File Read Error: Could not read file ${file.name}.`);
    };
    reader.readAsText(file);
  },

  /**
   * Run full pedagogical schema and structural validation
   * @param {object} payload
   */
  validateAndPreviewPayload(payload) {
    const reportContainer = Utils.qs('#upload-validation-report');
    const deployBtn = Utils.qs('#btn-deploy-lesson');
    if (!reportContainer) return;

    // 1. Identify format structure
    // Supports either full pack { lessonMetadata, cyberAcademy, questions } or array of questions
    let questions = [];
    let academy = null;
    let metadata = payload.lessonMetadata || null;

    if (Array.isArray(payload)) {
      questions = payload;
    } else if (payload && Array.isArray(payload.questions)) {
      questions = payload.questions;
      academy = payload.cyberAcademy || null;
    } else if (payload && payload.cyberAcademy && Array.isArray(payload.cyberAcademy.slides)) {
      academy = payload.cyberAcademy;
    }

    // Auto-fill form inputs if present in metadata or questions
    const titleInput = Utils.qs('#lesson-upload-title');
    const langSelect = Utils.qs('#lesson-upload-lang');
    const diffSelect = Utils.qs('#lesson-upload-tier');

    if (metadata && metadata.title && titleInput && !titleInput.value) {
      titleInput.value = metadata.title;
    } else if (academy && academy.title && titleInput && !titleInput.value) {
      titleInput.value = academy.title;
    }

    const customLangWrap = Utils.qs('#custom-subject-input-wrap');
    const customLangInput = Utils.qs('#lesson-upload-custom-lang');
    const defaultLangs = ['python', 'c', 'cpp', 'java', 'cyber', 'javascript', 'rust', 'sql', 'typescript', 'go', 'html', 'asm'];
    const detectedLang = (metadata && metadata.language) || (questions.length > 0 && questions[0].language) || (academy && academy.language);

    if (detectedLang) {
      if (defaultLangs.includes(detectedLang)) {
        if (langSelect) langSelect.value = detectedLang;
        if (customLangWrap) customLangWrap.style.display = 'none';
      } else {
        if (langSelect) langSelect.value = '__custom__';
        if (customLangWrap) customLangWrap.style.display = 'block';
        if (customLangInput) customLangInput.value = detectedLang;
      }
    }

    if (metadata && metadata.difficulty && diffSelect) {
      diffSelect.value = metadata.difficulty;
    }

    // 2. Validate Questions Schema via QuestionValidator (allow custom subjects)
    const validationErrors = [];
    const validationWarnings = [];
    let questionStats = { total: 0, byTier: { beginner: 0, intermediate: 0, expert: 0 } };

    if (questions.length > 0) {
      const qRes = QuestionValidator.validateAll(questions, { checkExactInventory: false, allowCustomLanguages: true });
      if (!qRes.valid) {
        validationErrors.push(...qRes.errors.map(err => `[Question Error] ${err.message || err.error}`));
      }
      if (qRes.warnings && qRes.warnings.length > 0) {
        validationWarnings.push(...qRes.warnings.map(w => `[Question Warning] ${w.message || w}`));
      }

      // Compute tier counts
      questionStats.total = questions.length;
      questions.forEach(q => {
        const diff = q.difficulty || 'beginner';
        if (questionStats.byTier[diff] !== undefined) {
          questionStats.byTier[diff]++;
        }
      });
    } else if (!academy) {
      validationErrors.push('Payload contains neither a "questions" array nor a "cyberAcademy" lesson module.');
    }

    // 3. Validate Cyber Academy Handbook & Slides Module
    if (academy) {
      if (!academy.title || typeof academy.title !== 'string') {
        validationErrors.push('[Cyber Academy] Missing chapter "title".');
      }
      if (!academy.topic || typeof academy.topic !== 'string') {
        validationErrors.push('[Cyber Academy] Missing chapter "topic".');
      }
      if (!Array.isArray(academy.slides) || academy.slides.length === 0) {
        validationErrors.push('[Cyber Academy] Chapter must contain at least 1 slide in "slides".');
      } else {
        academy.slides.forEach((slide, idx) => {
          if (!slide.type || !['concept', 'drill', 'pitfall'].includes(slide.type)) {
            validationErrors.push(`[Cyber Academy Slide ${idx + 1}] Slide type must be 'concept', 'drill', or 'pitfall'.`);
          }
          if (!slide.title) {
            validationErrors.push(`[Cyber Academy Slide ${idx + 1}] Missing slide title.`);
          }
          if (slide.type === 'drill') {
            if (!Array.isArray(slide.options) || slide.options.length < 2) {
              validationErrors.push(`[Cyber Academy Slide ${idx + 1}] Drill slide must contain at least 2 options.`);
            } else if (!slide.options.some(opt => opt.isCorrect === true)) {
              validationErrors.push(`[Cyber Academy Slide ${idx + 1}] Drill slide has no correct option (isCorrect: true).`);
            }
          }
        });
      }
    }

    const isValid = validationErrors.length === 0;
    this.validationResult = {
      isValid,
      errors: validationErrors,
      warnings: validationWarnings,
      questionStats,
      hasAcademy: Boolean(academy),
      questions,
      academy,
      metadata
    };

    // Render report card
    reportContainer.style.display = 'block';
    if (isValid) {
      if (deployBtn) deployBtn.disabled = false;
      reportContainer.innerHTML = `
        <div class="card card-raised" style="border-color: var(--color-success, #10b981); background: rgba(16, 185, 129, 0.05); padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge badge-emerald" style="font-size: 11px;">✓ SYSTEM CHECK PASSED</span>
              <strong style="color: var(--color-success, #10b981); font-size: var(--text-sm);">Ready to Deploy</strong>
            </div>
            <span class="badge badge-neutral" style="font-size: 10px;">Pedagogical Schema Verified</span>
          </div>

          <p style="font-size: var(--text-xs); color: var(--text-secondary); margin: 0 0 0.75rem 0;">
            The uploaded payload meets SyntaxArena's strict schema standards. Deploying will instantly broadcast this curriculum to all active normal users.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem;">
            <div style="background: var(--bg-surface-raised); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Total Questions</div>
              <div style="font-size: var(--text-base); font-weight: 800; color: var(--color-primary);">${questionStats.total} Qs</div>
            </div>
            <div style="background: var(--bg-surface-raised); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Beginner Tier</div>
              <div style="font-size: var(--text-base); font-weight: 800; color: var(--color-success);">${questionStats.byTier.beginner}</div>
            </div>
            <div style="background: var(--bg-surface-raised); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Intermediate Tier</div>
              <div style="font-size: var(--text-base); font-weight: 800; color: var(--color-warning);">${questionStats.byTier.intermediate}</div>
            </div>
            <div style="background: var(--bg-surface-raised); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Expert Tier</div>
              <div style="font-size: var(--text-base); font-weight: 800; color: var(--color-danger);">${questionStats.byTier.expert}</div>
            </div>
            <div style="background: var(--bg-surface-raised); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Academy Chapter</div>
              <div style="font-size: var(--text-base); font-weight: 800; color: ${academy ? 'var(--color-success)' : 'var(--text-muted)'};">
                ${academy ? `✓ Yes (${academy.slides.length} Slides)` : 'None'}
              </div>
            </div>
          </div>

          ${validationWarnings.length > 0 ? `
            <div style="margin-top: 0.75rem; padding: 0.5rem; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-sm); font-size: 11px; color: var(--color-warning);">
              <strong>Warnings:</strong>
              <ul style="margin: 4px 0 0 1rem; padding: 0;">
                ${validationWarnings.slice(0, 3).map(w => `<li>${Utils.escapeHTML(w)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `;
    } else {
      if (deployBtn) deployBtn.disabled = true;
      reportContainer.innerHTML = `
        <div class="card card-raised" style="border-color: var(--color-danger, #f43f5e); background: rgba(244, 63, 94, 0.05); padding: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span class="badge badge-coral" style="font-size: 11px;">⚠️ REJECTED: VALIDATION FAILED</span>
            <strong style="color: var(--color-danger, #f43f5e); font-size: var(--text-sm);">${validationErrors.length} Schema Errors Detected</strong>
          </div>
          <p style="font-size: var(--text-xs); color: var(--text-secondary); margin: 0 0 0.5rem 0;">
            The file contains structural or pedagogical schema flaws. Fix the items below and re-upload:
          </p>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 12px; color: var(--color-danger, #f43f5e); max-height: 180px; overflow-y: auto;">
            ${validationErrors.slice(0, 10).map(err => `<li>${Utils.escapeHTML(err)}</li>`).join('')}
            ${validationErrors.length > 10 ? `<li><em>...and ${validationErrors.length - 10} more errors</em></li>` : ''}
          </ul>
        </div>
      `;
    }
  },

  /**
   * Render single generic validation error
   */
  renderValidationError(msg) {
    const reportContainer = Utils.qs('#upload-validation-report');
    const deployBtn = Utils.qs('#btn-deploy-lesson');
    if (!reportContainer) return;
    if (deployBtn) deployBtn.disabled = true;

    reportContainer.style.display = 'block';
    reportContainer.innerHTML = `
      <div class="card card-raised" style="border-color: var(--color-danger, #f43f5e); background: rgba(244, 63, 94, 0.05); padding: 1rem;">
        <div style="color: var(--color-danger, #f43f5e); font-weight: 700; font-size: var(--text-sm); margin-bottom: 0.25rem;">
          ⚠️ File Ingestion Error
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-secondary);">${Utils.escapeHTML(msg)}</div>
      </div>
    `;
  },

  /**
   * Sync title/lang/diff from manual input fields into payload
   */
  syncMetadataFromInputs() {
    const title = Utils.qs('#lesson-upload-title')?.value.trim();
    const langSelect = Utils.qs('#lesson-upload-lang');
    const customLangInput = Utils.qs('#lesson-upload-custom-lang');
    let lang = langSelect?.value;
    if (lang === '__custom__' && customLangInput?.value.trim()) {
      lang = customLangInput.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    }
    const diff = Utils.qs('#lesson-upload-tier')?.value;

    if (!this.currentPayload) return;

    if (!this.currentPayload.lessonMetadata) {
      this.currentPayload.lessonMetadata = {};
    }
    if (title) this.currentPayload.lessonMetadata.title = title;
    if (lang) this.currentPayload.lessonMetadata.language = lang;
    if (diff) this.currentPayload.lessonMetadata.difficulty = diff;

    if (this.currentPayload.cyberAcademy) {
      if (title && !this.currentPayload.cyberAcademy.title) this.currentPayload.cyberAcademy.title = title;
      if (lang) this.currentPayload.cyberAcademy.language = lang;
      if (diff) this.currentPayload.cyberAcademy.difficulty = diff;
    }
  },

  /**
   * Deploy validated lesson pack to persistent storage
   */
  handleDeploy() {
    if (!this.validationResult || !this.validationResult.isValid) {
      alert('Cannot deploy: Please upload a valid JSON curriculum pack first.');
      return;
    }

    const deployBtn = Utils.qs('#btn-deploy-lesson');
    if (deployBtn) deployBtn.disabled = true;
    this.validationResult.isValid = false;

    this.syncMetadataFromInputs();

    const titleInput = Utils.qs('#lesson-upload-title');
    const langSelect = Utils.qs('#lesson-upload-lang');
    const customLangInput = Utils.qs('#lesson-upload-custom-lang');
    const diffSelect = Utils.qs('#lesson-upload-tier');
    const actionSelect = Utils.qs('#lesson-upload-action');

    const title = titleInput?.value.trim() || this.currentPayload?.lessonMetadata?.title || 'Custom Community Lesson';
    let lang = langSelect?.value || 'python';
    if (lang === '__custom__' && customLangInput?.value.trim()) {
      lang = customLangInput.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    } else if (lang === '__custom__') {
      lang = this.currentPayload?.lessonMetadata?.language || 'custom';
    }

    const diff = diffSelect?.value || this.currentPayload?.lessonMetadata?.difficulty || 'intermediate';
    const action = actionSelect?.value || 'append';

    // Calculate chapter numbering when appending
    let chapterNum = 1;
    try {
      const existingChapters = (typeof AcademyLessons !== 'undefined' && AcademyLessons.getByLanguage) 
        ? AcademyLessons.getByLanguage(lang) 
        : [];
      chapterNum = existingChapters.length + 1;
    } catch (_) {}

    const displayTitle = (action === 'append' && !title.toLowerCase().includes('chapter'))
      ? `Chapter ${chapterNum}: ${title}`
      : title;

    const lessonId = `cust-les-${lang}-ch${chapterNum}-${Date.now().toString(36)}`;

    // Build finalized pack
    const finalizedPack = {
      id: lessonId,
      lessonMetadata: {
        id: lessonId,
        title: displayTitle,
        language: lang,
        difficulty: diff,
        chapterNumber: chapterNum,
        estimatedMinutes: this.currentPayload?.lessonMetadata?.estimatedMinutes || 6,
        tagline: this.currentPayload?.lessonMetadata?.tagline || `Custom ${lang.toUpperCase()} lesson uploaded via Admin Studio.`
      },
      cyberAcademy: this.validationResult.hasAcademy ? {
        ...this.validationResult.academy,
        id: lessonId,
        language: lang,
        difficulty: diff,
        title: displayTitle
      } : null,
      questions: (this.validationResult.questions || []).map((q, idx) => ({
        ...q,
        id: q.id || `cust-q-${lang}-${idx + 1}-${Date.now().toString(36)}`,
        language: lang
      }))
    };

    const success = Storage.saveCustomLesson(finalizedPack);
    if (success) {
      // Audio cue if available
      try {
        if (typeof AudioEngine !== 'undefined') AudioEngine.playSuccess();
      } catch (_) {}

      const reportContainer = Utils.qs('#upload-validation-report');
      if (reportContainer) {
        reportContainer.innerHTML = `
          <div class="card card-raised" style="border-color: var(--color-success); background: rgba(16, 185, 129, 0.1); padding: 1.25rem; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.25rem;">🚀</div>
            <h3 style="color: var(--color-success); margin: 0 0 0.5rem 0;">Lesson Successfully Deployed!</h3>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); max-width: 500px; margin: 0 auto 1rem;">
              <strong>"${Utils.escapeHTML(title)}"</strong> (${finalizedPack.questions.length} Questions${finalizedPack.cyberAcademy ? ' + Cyber Academy Chapter' : ''}) is now live and accessible to all normal users in Battle Arena & Cyber Academy.
            </p>
            <button type="button" class="btn-arcade btn-primary btn-sm" id="btn-upload-another">
              + Upload Another Lesson Pack
            </button>
          </div>
        `;

        const anotherBtn = Utils.qs('#btn-upload-another');
        if (anotherBtn) {
          anotherBtn.onclick = () => this.resetForm();
        }
      }

      this.renderCustomLessonsRoster();
    } else {
      alert('Failed to save lesson pack to storage.');
    }
  },

  /**
   * Reset form and dropzone state
   */
  resetForm() {
    this.currentPayload = null;
    this.validationResult = null;

    const fileInput = Utils.qs('#lesson-file-input');
    if (fileInput) fileInput.value = '';

    const titleInput = Utils.qs('#lesson-upload-title');
    if (titleInput) titleInput.value = '';

    const fileNameLabel = Utils.qs('#upload-filename-label');
    if (fileNameLabel) fileNameLabel.style.display = 'none';

    const reportContainer = Utils.qs('#upload-validation-report');
    if (reportContainer) {
      reportContainer.style.display = 'none';
      reportContainer.innerHTML = '';
    }

    const deployBtn = Utils.qs('#btn-deploy-lesson');
    if (deployBtn) deployBtn.disabled = true;
  },

  /**
   * Download pre-configured sample 60-question lesson pack template
   */
  async downloadSampleTemplate() {
    try {
      const response = await fetch('data/sample-lesson-template.json');
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample_lesson_pack_60_questions.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Could not fetch template file, falling back to dynamic generation:', err);
      // Fallback generation
      const fallback = {
        lessonMetadata: {
          title: "Sample 60-Question Curriculum Lesson",
          language: "go",
          difficulty: "intermediate",
          tagline: "Example lesson pack template for SyntaxArena Admin Studio"
        },
        cyberAcademy: {
          title: "Chapter 1: Sample Topic Walkthrough",
          topic: "Core Fundamentals",
          objectives: ["Objective 1", "Objective 2"],
          chapterSummary: "Summary text...",
          slides: [
            { type: "concept", title: "Concept 1", content: "Content...", codeSnippet: "// sample code" },
            { type: "drill", title: "Drill 1", prompt: "What is output?", codeSnippet: "// snippet", options: [{ text: "A", isCorrect: true }, { text: "B", isCorrect: false }] },
            { type: "pitfall", title: "Trap 1", content: "Pitfall explanation...", badCode: "// bad", goodCode: "// good" }
          ],
          takeaways: ["Key takeaway 1", "Key takeaway 2"]
        },
        questions: Array.from({ length: 60 }, (_, i) => ({
          id: `sample-q-${i + 1}`,
          language: "go",
          difficulty: i < 20 ? "beginner" : (i < 40 ? "intermediate" : "expert"),
          type: "predict_output",
          prompt: `Question ${i + 1} prompt`,
          code: `// Question ${i + 1} code snippet`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctIndex: 0,
          explanation: `Explanation for question ${i + 1}`
        }))
      };
      const blob = new Blob([JSON.stringify(fallback, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample_lesson_pack_60_questions.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  },

  /**
   * Render table of all active custom lessons
   */
  renderCustomLessonsRoster() {
    const container = Utils.qs('#admin-custom-lessons-list');
    if (!container) return;

    const lessons = Storage.loadCustomLessons();
    if (lessons.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: var(--text-sm);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;">📂</div>
          <p style="margin: 0;">No custom lessons uploaded yet. Drop a <code>.json</code> pack above to publish a lesson.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="admin-table-container">
        <table class="admin-roster-table" style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px 12px;">Lesson Title</th>
              <th style="text-align: center; padding: 8px 12px;">Track</th>
              <th style="text-align: center; padding: 8px 12px;">Tier</th>
              <th style="text-align: center; padding: 8px 12px;">Questions</th>
              <th style="text-align: center; padding: 8px 12px;">Cyber Academy</th>
              <th style="text-align: right; padding: 8px 12px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${lessons.map(pack => `
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 10px 12px;">
                  <strong style="color: var(--text-primary); font-size: 13px;">${Utils.escapeHTML(pack.lessonMetadata?.title || pack.id)}</strong>
                  <div style="font-size: 11px; color: var(--text-muted);">${Utils.escapeHTML(pack.lessonMetadata?.tagline || '')}</div>
                </td>
                <td style="text-align: center; padding: 10px 12px;">
                  <span class="badge badge-cyan" style="font-size: 10px; text-transform: uppercase;">
                    ${Utils.escapeHTML(pack.lessonMetadata?.language || 'generic')}
                  </span>
                </td>
                <td style="text-align: center; padding: 10px 12px;">
                  <span class="badge ${pack.lessonMetadata?.difficulty === 'expert' ? 'badge-coral' : (pack.lessonMetadata?.difficulty === 'intermediate' ? 'badge-amber' : 'badge-emerald')}" style="font-size: 10px; text-transform: capitalize;">
                    ${Utils.escapeHTML(pack.lessonMetadata?.difficulty || 'all')}
                  </span>
                </td>
                <td style="text-align: center; padding: 10px 12px; font-weight: 700; color: var(--color-primary);">
                  ${Array.isArray(pack.questions) ? `${pack.questions.length} Qs` : '0 Qs'}
                </td>
                <td style="text-align: center; padding: 10px 12px;">
                  ${pack.cyberAcademy ? `
                    <span class="badge badge-emerald" style="font-size: 10px;" title="Includes Interactive Handbook Module">
                      ✓ Active (${pack.cyberAcademy.slides?.length || 0} Slides)
                    </span>
                  ` : '<span style="color: var(--text-muted);">-</span>'}
                </td>
                <td style="text-align: right; padding: 10px 12px;">
                  <button type="button" class="btn-arcade btn-neutral btn-sm btn-delete-lesson" data-pack-id="${pack.id}" style="padding: 3px 8px; font-size: 11px; color: var(--color-danger); border-color: rgba(244, 63, 94, 0.4);">
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Bind delete buttons
    const deleteButtons = container.querySelectorAll('.btn-delete-lesson');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-pack-id');
        if (id && confirm('Are you sure you want to remove this custom lesson and its questions from normal users?')) {
          Storage.deleteCustomLesson(id);
          this.renderCustomLessonsRoster();
        }
      });
    });
  }
};

