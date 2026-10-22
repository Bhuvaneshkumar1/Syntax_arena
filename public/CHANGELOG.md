# 📋 Changelog

All notable changes to **SyntaxArena** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
