# SyntaxArena — AI Agent Engineering Rule Book
**File**: `.agent/rules/agent_rules.md`  
**Applies to**: All AI Agents, Coding Assistants, and Automated Contributors

---

## 1. Architectural Guardrails (Zero-Dependency & Offline First)

1. **Client-Side Native Execution**:
   - SyntaxArena runs completely client-side in the browser. Zero server dependencies, zero external runtime API keys, and zero telemetry tracking.
   - Do NOT introduce external npm runtime dependencies or remote CDN scripts (`<script src="https://...">`). All core algorithms, parsers, procedural sound engines, and storage logic must remain self-contained native modern JavaScript (ES Modules).
2. **Bundle Generation & Static Mirror Synchronization**:
   - Whenever any JavaScript (`js/`), CSS (`css/`), data (`data/`), or HTML files are modified, you MUST run:
     ```bash
     node scripts/build-bundle.js
     ```
   - This regenerates `js/bundle.js` (for standalone offline execution via `file:///`) and synchronizes assets to `public/` for static hosting (Vercel, GitHub Pages).

---

## 2. Code Modification Scope & Precision

1. **Surgical Scope & Touch-Only Directives**:
   - Modify ONLY the specific files required for the task. Never modify unrelated files or perform global format/lint refactors across the repository.
   - If a task touches `css/`, do not alter game engine mechanics or question catalogs.
   - If a task touches curriculum lessons, do not alter gameplay scoring formulas.
2. **Documentation & Comment Integrity**:
   - Maintain documentation integrity at all times. Preserve all existing comments, docstrings, architecture references, and license headers.
   - When modifying functions, ensure JSDoc headers and type definitions reflect the changes accurately.

---

## 3. UI / UX Design Standards (Linear & Raycast Studio Aesthetic)

1. **Anti-Slop Design System**:
   - SyntaxArena adheres to the **Linear / Raycast Studio Slate** aesthetic defined in `css/tokens.css`.
   - Primary Canvas: Deep obsidian graphite (`#0B0D13`).
   - Surfaces: Matte slate panels (`#11141D`), elevated cards (`#171B26`), floating HUD modals (`#1E2332`).
   - Accents: Electric Indigo (`#6366F1`), Studio Emerald (`#10B981`), Studio Amber (`#F59E0B`), Studio Crimson (`#F43F5E`).
   - Dividers: Subtle micro-borders (`#1F2432` / `#2E364B`).
2. **No Garish Neon Smears**:
   - Avoid blurry oversaturated multi-colored neon glows (`0 0 24px neon-color`). Use crisp 1px specular highlights (`--shadow-specular`), clean solid drop shadows, and subtle ambient elevation.
3. **Tactile Mechanical Physics**:
   - Interactive elements (`.btn-arcade`, `.option-card`, `.card-interactive`) must feature physical tactile feedback:
     - Normal: Crisp micro-border and solid 3D drop edge (`box-shadow: var(--shadow-specular), 0 4px 0 var(--border-strong)`).
     - Hover: Subtle `-2px` lift and border brightening.
     - Active (`:active`): Rapid 0.04s mechanical compression (`translateY(2px)` or `translateY(3px)` with `0 1px 0` shadow).
     - Release: Spring overshoot recoil easing (`cubic-bezier(0.18, 1.25, 0.4, 1.3)`).

---

## 4. Question Bank & Curriculum Data Integrity

1. **Catalog Balance & Quota**:
   - Master catalog: Exactly 720 core arena questions across 12 languages (Python, C, C++, Java, Cyber/Linux, JavaScript, Rust, SQL, TypeScript, Go, HTML/CSS, Assembly).
   - Exactly 60 questions per language track: 20 Beginner, 20 Intermediate, 20 Expert.
   - Question IDs must adhere to standard regex: `^(py|c|cpp|java|cyber|js|rust|sql|ts|go|html|asm)-(beg|int|exp)-\d{3}$`.
2. **Curriculum Depth**:
   - Academy lessons must teach real-world programming concepts deeply like a textbook: conceptual mental models, memory pointer diagrams, interactive prediction checkpoints, edge-case pitfalls, and sandbox exercises.

---

## 5. Storage Schema & Reliability Directives

1. **Schema Versioning**:
   - The active schema version is `CURRENT_SCHEMA_VERSION = 1`.
   - Never break existing player progress. Any schema changes must supply an idempotent, backwards-compatible deep migration in `js/storage.js`.
2. **Graceful Fallbacks**:
   - Always verify operations in non-browser / headless environments (handling missing `window.localStorage` gracefully via in-memory storage fallback).
   - Audio operations must safely handle uninitialized or suspended `AudioContext` without throwing runtime exceptions.

---

## 6. Mandatory Quality Assurance (QA) Gateway

Before declaring any coding task complete or pushing changes:
1. **Unit Test Verification**:
   - Run the master test runner:
     ```bash
     npm test
     ```
   - All 521+ unit tests across all 8 test suites MUST pass with 0 errors:
     - Question Bank Tests (63/63)
     - Answer Checker Tests (30/30)
     - Game Engine Tests (49/49)
     - Gameplay UI Tests (79/79)
     - Gamification Tests (179/179)
     - Analytics Tests (85/85)
     - Interactive Audio Tests (24/24)
     - Persistence & Reliability Tests (12/12)
2. **Browser / Playwright E2E Verification** (when modifying UI/DOM):
   - Run relevant Playwright suites:
     ```bash
     node tests/test-daily-gauntlet-playwright.js
     node tests/test-ghost-duel-playwright.js
     node tests/test-memory-inspector-playwright.js
     node tests/test-sandbox-languages-playwright.js
     ```
3. **Clean Git State**:
   - Commit only intended modifications with conventional semantic commit messages (`feat:`, `fix:`, `refactor:`, `test:`).
   - Clean up any temporary wrapper scripts or debug artifacts prior to pushing.

