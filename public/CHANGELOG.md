# 📋 Changelog

All notable changes to **SyntaxArena** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.10.0] - 2026-11-11

### Fixed & Enhanced (Critical Corrections & Curriculum Expansion)
- **Arena Retry Countdown & Speed Ghost Unfreeze (`js/gameplay.js`):**
  - Resolved a critical bug where clicking `↺ Retry Question` after an incorrect submission froze both the countdown timer and the Speed Ghost runner.
  - In `retryCurrentQuestion()`, timer resume logic (`this._startTimer(resumeSeconds)`) is now invoked and `this.ghostDuel.questionStartTime` is dynamically reset to maintain smooth runner interpolation.
- **Mega-Boss HP Regeneration & Overwhelmed Defeat Glitch (`js/boss-engine.js`, `game.html`, `js/gameplay.js`, `css/animations.css`):**
  - Boss health now actively regenerates (+10% max HP) whenever the player submits an incorrect answer.
  - When the player commits 3 consecutive errors or the boss heals back to full HP, the player is overwhelmed. Triggers a violent CRT screen glitch (`.boss-defeat-wipe-glitch`), audio dissonance, and presents the defeat modal: *"💀 YOU CANNOT DEFEAT THE DAEMON"* with `[ ↺ Retry Boss Battle ]` and `[ Return to Hub ]` buttons.
- **Cyber Academy W3Schools Redesign & In-Lesson Runner Jump (`learn.html`, `css/components.css`, `js/learn.js`):**
  - Re-architected the Cyber Academy layout into a W3Schools-style tutorial workspace with a 3-column responsive layout (`270px 1fr 250px`).
  - Switched default view filter from `beginner` to `all` (`data-diff-filter="all"`), rendering full multi-chapter syllabi (`CH 01` to `CH 05+`) across all tiers with completion checks and difficulty chips.
  - Added a sticky right-side outline & chapter directory panel (`#academy-right-panel`) with section TOC anchors and a *"⚡ Try It Yourself"* jump button that scrolls smoothly to and pulse-highlights `#slide-code-editor`.
- **Flexible Custom Subject & Chapter Append Admin Uploader (`admin.html`, `js/lesson-uploader.js`, `js/question-validator.js`, `data/academy-lessons.js`):**
  - Added support for uploading any custom programming language outside the 12 defaults (e.g., Kotlin, Swift, PHP, Ruby, Rust, Zig, Solidity).
  - Added chapter appending mode (`➕ Add as Extra Chapter to Subject`) which computes the next chapter number (`existingChapters.length + 1`) and dynamically formats `Chapter N: ...`.
  - Updated `QuestionValidator` with `{ allowCustomLanguages: true }` to support any valid language slug without rejecting non-standard question IDs.
  - Hardened uploader event binding with an `_initialized` guard and disabled double-click deployment.
- **HTML Script Redundancy Cleanup (`admin.html`, `learn.html`):**
  - Removed duplicate `<script type="module">` tags that loaded scripts alongside `bundle.js`, preventing duplicate event listeners.
- **Automated Verification:**
  - 796/796 unit tests passing.
  - 38/38 Admin Route & Stealth Gate Playwright E2E tests passing.
  - 47/47 Enhancements Playwright E2E tests passing.
  - 86/86 Responsive Viewport Pressure Playwright E2E tests passing.

---

## [2.9.0] - 2026-11-10

### Added & Enhanced
- **Real Arcade Boss Battle Animations (`css/animations.css`, `css/components.css`, `js/gameplay.js`):**
  - Added continuous breathing idle levitation `@keyframes bossIdleFloat` on `#boss-avatar-emblem`.
  - Added `@keyframes bossHitRecoil` triggered upon player correct answer deductions.
  - Added `@keyframes bossAttackLunge` triggered upon boss counter-attacks.
  - Added `@keyframes bossPhase2Aura` overclocked enrage state for Phase 2 transitions.
- **Challenge Showcase Restructuring (`index.html`):**
  - Grouped and cleanly isolated the 5 core cognitive question archetypes: *01 Output Prediction, 02 Bug Hunting, 03 Complete Code, 04 Explain Logic, 05 Trace Execution*.
  - Segregated and prominently showcased the 3 special game modes into dedicated feature cards: *Endless Mode Gauntlet*, *Cyber Academy Handbook*, and *The Daemon Incursion (Mega-Boss Battles)*.
- **Index Hub Arcade Command Deck & Telemetry HUD (`index.html`):**
  - Replaced dense text walls with a high-impact **Quick-Launch Command Deck** offering 1-click jumps to Arena, Endless Farm, Mega-Boss Incursions, Cyber Academy, and Sandbox REPL.
  - Added live arcade telemetry badges: *12 Language Tracks, 720+ Challenges, 4 Mega-Boss Raids, Speed Ghost Rivals, 0ms Latency*.
- **Dynamic Speed Ghost Runner & Tug-of-War Progress Setback (`js/gameplay.js`, `css/animations.css`):**
  - Speed Ghost pin now smoothly glides forward in real-time along the progress track during question countdowns based on pace.
  - Implemented dynamic **Tug-of-War Setback**: when player submits an incorrect answer or times out, the progress bar and player pin recoil backward by -10% with a red glitch vibration (`.is-tug-recoil`).
- **In-Play Academy Gating & 3-Mistakes Study Prompt (`game.html`, `js/gameplay.js`):**
  - Removed Academy buttons from the active arena toolbar to preserve battle focus.
  - Added consecutive mistake tracking: upon encountering 3 wrong answers, the game pauses and presents `#modal-academy-recommendation`, allowing the player to either jump directly to the relevant Cyber Academy module or continue fighting.
- **Cyber Academy UI Cleanup (`learn.html`):**
  - Streamlined the Academy workspace into a distraction-free two-pane environment with a compact track & tier selector, clean chapter directory, and focused slide reader.
- **Sandbox Memory Tracer Gating (`sandbox.html`, `js/sandbox-manager.js`):**
  - Gated the Visual Memory Inspector to display exclusively for memory-managed & low-level languages: C, C++, Rust, ASM, Go, Python (`['systems', 'asm', 'go', 'python']`).
  - Automatically hides the memory inspector on HTML, SQL, JavaScript, etc.
- **Sandbox Language Selector Segmented Pills (`sandbox.html`, `css/components.css`):**
  - Replaced raw overflow buttons with `.sandbox-env-segmented-bar` featuring sleek pill indicators, active glowing borders, accessible `aria-selected` attributes, and zero scrollbar clutter.
- **CSS Architecture Fix:**
  - Resolved an unclosed `@media print` block in `css/components.css` that previously swallowed screen rules below line 2000.
- **Automated Test Suites:**
  - New Playwright Suite `tests/test-enhancements-playwright.js`: 33/33 tests passing.
  - Master Unit Suite: 794/794 tests passing.
  - Total automated assertions across codebase: **971/971 passing (100% green)**.

---

## [2.8.0] - 2026-11-10

### Added
- **Feature 1: 👾 Cyberpunk Mega-Boss Battles ("The Daemon Incursion"):**
  - **The 4 System Daemons (`data/boss-encounters.js`):**
    - `null_leviathan`: *NullPointer Leviathan* (1,000 HP, Signature: *Null Dereference Void*, +500 XP, *Void Breaker* badge).
    - `kernel_hydra`: *Kernel Panic Hydra* (1,200 HP, Signature: *Ring 0 Interrupt Blast*, +600 XP, *Kernel Crusher* badge).
    - `overflow_dragon`: *Buffer Overflow Dragon* (1,100 HP, Signature: *Stack Frame Smashing Blast*, +550 XP, *Stack Guardian* badge).
    - `deadlock_kraken`: *Deadlock Kraken* (1,300 HP, Signature: *Mutual Exclusion Lockout*, +650 XP, *Deadlock Dissolver* badge).
    - 40 curated questions (10 per boss) spanning C, C++, Python, Java, Rust, Go, ASM, Cyber, JS, and TypeScript.
  - **Authoritative Boss Engine (`js/boss-engine.js`):**
    - Dynamic combat turn processing calculating difficulty-scaled base damage (120–220 HP), remaining timer speed bonus (up to +60 HP), combo streak multiplier (up to 1.75x), and rapid deduction Critical Strikes (1.35x).
    - **Phase 2 Overclocking Transition:** Automatically triggers when Boss HP falls $\le 50\%$, activating burning gradient health bars, enraged taunts, and amplified retaliation mechanics.
    - **Signature Glitch Retaliation Attacks:** Fires CRT screen glitch overlays and option scrambling upon incorrect submissions.
    - **Victory Rewards:** Permanent career profile tracking in `defeatedBosses`, +500–650 XP bounties, and Boss Slayer trophy unlocks.
  - **Mega-Boss Arcade HUD & Modals (`game.html`, `css/components.css`, `css/animations.css`):**
    - Neon segmented Boss Integrity HP bar with real-time percentage interpolation.
    - Floating combat damage numbers (`.floating-damage` & `.is-critical`).
    - Interactive Adversary Selection Modal (`#modal-boss-select`) with live defeat badges and instant boss switching.
    - Victory Fanfare Modal (`#modal-boss-victory`) showcasing reclaimed memory, XP awards, and unlocked badges.
    - Hub showcase card on `index.html` linking directly to `game.html?mode=boss`.
  - **Procedural Audio Synthesizer Additions (`js/audio.js`):**
    - Added `playBossAlert()`, `playBossHit()`, `playBossGlitch()`, `playBossRoar()`, and `playBossDefeat()`.
  - **Automated Test Suites:**
    - Master Unit Suite: 794/794 tests passing (`tests/boss-engine-tests.js` adds 273 boss assertions).
    - Playwright E2E Boss Suite (`tests/test-boss-battles-playwright.js`): 20/20 tests passing across HUD initialization, adversary modal, damage dealing, and 3 responsive viewports.
    - Admin Route Suite (`tests/test-admin-route-playwright.js`): 38/38 tests passing.
    - Responsive Viewport Suite (`tests/test-responsive-viewport-pressure-playwright.js`): 86/86 tests passing.

---

## [2.7.0] - 2026-11-10

### Added
- **Stealth Administrative Security Vault (`admin.html`, `js/admin.js`):**
  - Stripped all visible admin links across all 7 public user pages (`index.html`, `game.html`, `learn.html`, `sandbox.html`, `results.html`, `progress.html`, `settings.html`).
  - Implemented multi-factor stealth access mechanisms:
    - Global keyboard hotkey: `Ctrl + Shift + A` (Windows/Linux) or `Cmd + Shift + A` (macOS).
    - Rapid 3-tap touch gesture on brand emblem badge (`.brand-badge`) within 1.5 seconds.
    - Cyber Shell virtual Linux terminal command: `sudo admin`, `syntax-admin`, or `admin` in `sandbox.html`.
    - Direct URL routing via `/admin` and `admin.html`.
  - SHA-256 PBKDF2 authentication gate (`admin` / `Admin@123`) with automatic 5-attempt rate-limiting security cooldown.
  - Full telemetry auditing with 12-track language completion metrics, multi-player roster, player dossier inspector, and 1-click JSON telemetry audit export.
- **Curriculum Studio & Drag-and-Drop Ingestion Engine (`js/lesson-uploader.js`):**
  - Drag-and-drop file dropzone with active dragover styling and file picker ingestion.
  - Automated pre-flight pedagogical validation using `QuestionValidator` enforcing schema contracts, option counts, and slide formats.
  - Live broadcast synchronization via `StorageManager` dynamically injecting custom questions and Cyber Academy chapters into active sessions without page reloads or server restarts.
  - Downloadable starter JSON template (`sample_lesson_pack_60_questions.json`) with Go CSP concurrency questions and chapter slides.
  - Active curriculum roster with track/tier badges and live deletion.
- **Automated Playwright Suites:**
  - `tests/test-admin-route-playwright.js`: 38/38 tests passing across stealth gates, login cooldown, curriculum ingestion, dynamic engine broadcast, dossiers, and session revocation.
  - `tests/test-responsive-viewport-pressure-playwright.js`: 86/86 tests passing across 5 responsive viewports.
  - Master unit test suite: 521/521 tests passing.

---

## [2.5.0] - 2026-10-22

### Added
- **Multi-Language Sandbox Fixes & Hardening:**
  - Implemented client-side TypeScript transpiler stripping generic class parameters (`class Stack<T>`), field access modifiers (`private`, `protected`, `public`, `readonly`), return types before block openings (`): Type {`), and multi-line type aliases with internal semicolons.
  - Built client-side Go 1.22+ runtime simulator supporting synchronous in-memory channels (`ch <- val`, `<-ch`, `make(chan int, 2)`), slice length and capacity (`make([]int, len, cap)`, `len(s)`, `cap(s)`), LIFO defer execution stack (`defer fmt.Println(...)`), and formatted printing (`fmt.Printf`).
  - Added Bash subshell command substitution (`$(...)` and backticks) in variable assignments (`encoded=$(echo $token | base64)`) and script execution lines.
  - Fixed relational operator precedence in SQL query engine where `>=` and `<=` were matched as `>` and `<`.
- **E2E Playwright Multi-Language Sandbox Suite (`tests/test-sandbox-languages-playwright.js`):** 53 automated browser assertions verifying all 8 environments and all default code templates with 0 console errors.

---

## [2.4.0] - 2026-10-22

### Added
- **Interactive Visual Memory & Pointer Inspector (`js/memory-inspector.js`):**
  - Real-time 64-bit stack frame parsing with realistic memory addresses (`0x7ffeeb40a120`), identifiers, data types, and byte offsets.
  - Real-time heap memory allocation visualizer (`0x55a8f210c000`).
  - Interactive pointer hover linking: hovering pointer variables dynamically highlights target heap blocks with glowing neon borders.
  - Integrated into both `sandbox.html` and Academy `learn.html`.
  - Added Playwright test suite `tests/test-memory-inspector-playwright.js` (12/12 passed).

---

## [2.3.0] - 2026-10-22

### Added
- **Asynchronous Ghost Racing / Speed Duel Mode in Arena (`game.html`, `js/gameplay.js`):**
  - Real-time speed rail HUD featuring player avatar vs. `CyberPhantom` (👻).
  - Dynamic split timing badge (`.is-ahead` emerald green badge `+Xs AHEAD`, `.is-behind` red badge `-Xs BEHIND`, or `.is-even`).
  - Autonomous pacing engine calibrated across Beginner (8.5s), Intermediate (14.0s), and Expert (21.0s) with deterministic jitter.
  - Speed Duel Victory Bonus (+75 XP) displayed on results screen (`results.html`).
  - Added Playwright test suite `tests/test-ghost-duel-playwright.js` (13/13 passed).

---

## [2.2.0] - 2026-10-22

### Added
- **Daily Hacker Gauntlet with 7-Day Punch Card Streak Rewards (`index.html`, `js/landing.js`):**
  - 7-Day punch card stamp matrix with progressive rewards (+50 XP up to +300 XP Jackpot with Hex Dragon avatar on Day 7).
  - Deterministic 3-question daily seed using Mulberry32 hash of `YYYY-MM-DD`.
  - Timed gauntlet modal with 45s countdown timer, instant pedagogical explanations, and celebration claim screen.
  - Added Playwright test suite `tests/test-daily-gauntlet-playwright.js` (17/17 passed).

---

## [2.1.0] - 2026-10-21

### Added
- **Cyber Academy & Graduation Diplomas (`learn.html`, `js/learn.js`):**
  - 60 curriculum modules across 12 tracks (Beginner, Intermediate, Expert).
  - 3-slide interactive deck per module: 01 Concept / Mental Model, 02 Practice Drill, 03 Pitfall Analysis.
  - In-lesson live code runner with syntax validation and output metrics.
  - Official printable graduation diplomas with unique serial verification IDs (`SA-CERT-PY-88A92`).

---

## [2.0.0] - 2026-10-20

### Added
- **Interactive Multi-Language Sandbox (`sandbox.html`, `js/sandbox-manager.js`):**
  - Client-side execution across Python, JavaScript, TypeScript, Go, Cyber/Linux VFS, SQL, HTML5/CSS, and x86-64/ARM64 Assembly.
- **Enhanced Procedural Sound Synthesizer (`js/audio.js`):**
  - Web Audio API procedural synthesis with ambient background music, countdown warning beeps, streak fanfares, and error shakes.
- **LocalStorage Schema v1 Migration & Salvage Engine (`js/storage.js`):**
  - Automated schema migration, corrupt payload salvage, and quota degradation fallbacks.

---

## [1.0.0] - 2026-10-19

### Initial Release
- **Core Arena Game Engine:** 480 verified questions across 8 curriculum tracks (Python, C, C++, Java, Cyber & Linux, JavaScript, Rust, SQL).
- **4 Interactive Question Mechanics:** Multiple Choice, Predict Output, Find the Bug, and Fill Code.
- **Gamification & Career Progression:** Dynamic streak multipliers ($1.0\times$ to $2.0\times$), 20 badges, 4 visual themes, and avatar shop.
- **Full Offline & Zero-Dependency Execution:** 100% client-side compatible with `file:///` and static hosts.
