# ⚡ SyntaxArena

> **The Browser-Native Cyberpunk Programming Quiz Arcade**  
> Master syntax, debug code, and conquer algorithms across Python, C, C++, Java, Cybersecurity & Linux, JavaScript, Rust, and SQL in an arcade-inspired arena.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Runtime Dependencies](https://img.shields.io/badge/Runtime%20Dependencies-0%20(Pure%20Vanilla)-success.svg)](file:///d:/programming_game/index.html)
[![Offline Capable](https://img.shields.io/badge/Offline-100%25%20Ready-blueviolet.svg)](file:///d:/programming_game/index.html)
[![Question Bank](https://img.shields.io/badge/Questions-480%20Verified-brightgreen.svg)](file:///d:/programming_game/data/)
[![Test Suite](https://img.shields.io/badge/Tests-486%20%2F%20486%20Passed-brightgreen.svg)](file:///d:/programming_game/docs/FINAL_TEST_RESULTS.md)
[![Platform](https://img.shields.io/badge/Platform-Web%20(All%20Modern%20Browsers)-orange.svg)](file:///d:/programming_game/index.html)

---

## 🎮 What is SyntaxArena?

**SyntaxArena** is an arcade-style, browser-native programming quiz game built with modern web technologies (**HTML5**, **CSS3**, and **Vanilla JavaScript**). Designed for students, software engineers, and competitive coders, it bridges the gap between gamified speed quizzes and deep pedagogical code analysis.

Whether you're deducing pointer arithmetic in C99, unraveling template metaprogramming in C++20, tracing dictionary comprehensions in Python 3.10+, auditing POSIX permissions and shell pipelines in Linux, navigating the JavaScript event loop, enforcing Rust borrow checker invariants, or composing relational window queries in SQL, SyntaxArena offers a rich, tactile arcade experience with real-time feedback, procedural sound synthesis, and comprehensive career tracking.

---

## ✨ Key Highlights

### ⚡ Pure Vanilla & Zero Runtime Dependencies
- **100% Static & Standalone:** Operates with zero backend servers, zero databases, and zero npm runtime dependencies.
- **Run Anywhere:** Double-click `index.html` to play directly via the `file:///` protocol, or serve via GitHub Pages, Vercel, Netlify, Nginx, or Apache.
- **Air-Gapped & Offline Ready:** All fonts, SVG avatars, icons, and audio waveforms are bundled locally. Zero external CDNs or remote network calls.

### 🕹️ Arcade Arena Gameplay
- **4 Distinct Question Mechanics:**
  1. **Multiple Choice (MCQ):** Rapid conceptual evaluations.
  2. **Predict Output:** Trace code execution and deduce exact standard console outputs.
  3. **Find the Bug:** Click directly on syntax-highlighted code terminal lines to isolate the exact line with an error.
  4. **Fill Code:** Drag or click code token chips into missing syntax slots.
- **Dynamic 30-Second Countdown:** Visual and audio pulse warnings when timer drops below critical thresholds.
- **Streak Multipliers:** Scale scoring from $1.0\times$ up to $2.0\times$ by chaining correct answers.
- **Second Chance Retry Mechanic:** Use a hint (-25 pts) and unlock an immediate second chance upon an incorrect first attempt ($0.5\times$ base points, frozen streak).
- **Remediation Mode:** Click "Retry Missed Questions" on the results page to replay missed questions with 0 point exploit protection.

### 🏆 Gamification, Levels & Avatar Shop
- **Player Level Progression:** Level up from **Level 1 (Script Novice)** to **Level 10+ (Grandmaster)** as your career score increases.
- **Tier Gating:** 
  - 🟢 **Beginner:** Unlocked at Level 1
  - 🟡 **Intermediate:** Unlocked at Level 2
  - 🔴 **Expert:** Unlocked at Level 3
- **In-Game Avatar Cosmetics Shop:** Spend accumulated points to unlock unique cyberpunk SVG avatars (`terminal_owl`, `matrix_cat`, `bit_knight`, `hex_dragon`, `glitch_bot`). Spending points **never** reduces or demotes your player level!
- **20 Unlockable Badges:** Earn achievements across speed, accuracy, language streaks, and career milestones.
- **Idempotent Rewards:** Joining bonuses (+500 pts) and stage clear bonuses are awarded strictly once—refreshing pages will never duplicate points.

### 📊 Deep Career Analytics
- **Results Ring:** Circular SVG gauge displaying exact session accuracy percentage.
- **8 Session Metrics:** Track Score, Accuracy, Streak, Time Elapsed, XP Gained, Rank, Points Earned, and Bonuses.
- **Weak-Area Pedagogical Recommendations:** Algorithmic recommendations identifying topic weaknesses with one-click practice links.
- **Performance Trend Graph:** Interactive SVG career progression graph mapping historical accuracy over time.
- **Language & Difficulty Radar:** Real-time visualization of mastery percentages across all 4 tracks.

### 🎨 Themes, Audio & Accessibility
- **4 Arcade Visual Themes:**
  - 🌌 **Cyberpunk Dark:** High-contrast neon cyan and magenta glow.
  - ☀️ **Clean Light:** Crisp, modern minimalist IDE aesthetic.
  - 📟 **Amber Phosphor:** Nostalgic 1980s monochrome CRT terminal.
  - 👑 **Gold Royale:** Luxurious dark obsidian and radiant gold.
- **Web Audio Procedural Sound Engine:** Synthesizes arcade beeps, clicks, streak fanfares, and ambient soundscapes natively via the browser Web Audio API.
- **Accessibility & Reduced Motion:** Full keyboard shortcuts (`1-4`, `H`, `Enter`), ARIA live regions for screen readers, high-contrast focus rings, and an in-app Reduced Motion toggle that instantly collapses CSS animations and timer loops.
- **Reliable Storage & Recovery:** LocalStorage Schema v1 with automated migration, corrupted payload salvage, ephemeral memory-only fallback, and a full Account Reset utility.

---

## 📚 Question Bank Inventory (480 Questions)

Every question is verified for schema compliance, unique ID assignment, and pedagogical depth. All questions adhere strictly to language standards with **zero undefined behavior mislabeled as guaranteed output**.

| Language Track | Target Specification | Beginner | Intermediate | Expert | Total Verified |
| :--- | :--- | :---: | :---: | :---: | :---: |
| 🐍 **Python** | Python 3.10+ (Comprehensions, Generators, OOP, Dunders) | 20 | 20 | 20 | **60** |
| ⚡ **C** | ISO C99 (Pointers, Memory, Structs, Macros, Bitwise) | 20 | 20 | 20 | **60** |
| 🚀 **C++** | ISO C++20 (Templates, Smart Pointers, STL, RAII, Lambdas) | 20 | 20 | 20 | **60** |
| ☕ **Java** | OpenJDK 17 LTS (Streams, Records, Generics, Concurrency) | 20 | 20 | 20 | **60** |
| 🛡️ **Cyber & Linux** | POSIX / Bash / Security (Permissions, Quoting, Hashing, Sockets) | 20 | 20 | 20 | **60** |
| 🟨 **JavaScript** | ECMAScript 2024 (Event Loop, Closures, Prototypes, Async) | 20 | 20 | 20 | **60** |
| 🦀 **Rust** | Rust 2021 Edition (Ownership, Borrowing, Lifetimes, Traits) | 20 | 20 | 20 | **60** |
| 🗄️ **SQL** | ANSI / Relational (Three-Valued Logic, JOINs, Window Functions) | 20 | 20 | 20 | **60** |
| **Total Inventory** | **8 Full Curriculum Tracks** | **160** | **160** | **160** | **480** |

---

## 🗂️ Project File Structure

```text
programming_game/
├── index.html                 # Main landing hub, track selector, onboarding wizard
├── game.html                  # Active arena terminal, countdown timer, HUD, retry panel
├── results.html               # Circular progress ring, itemized review, recommendations
├── progress.html              # Career stats, SVG trend visualizer, 20 badges catalog
├── settings.html              # Visual themes, audio synthesizer, motion, profile reset
├── favicon.svg                # Vector arcade brand icon
├── css/
│   ├── tokens.css             # Theme palettes, typography tokens, radius & shadows
│   ├── layout.css             # Responsive container constraints, header, mobile drawer
│   ├── components.css         # Tactile arcade buttons, option cards, modals, badges
│   └── animations.css         # Keyframe animations, score counters, reduced-motion
├── js/
│   ├── app.js                 # Global page-level bootstrapper & theme initialization
│   ├── audio.js               # Procedural Web Audio API sound synthesizer
│   ├── analytics.js           # Topic mastery, recommendations, SVG trend generator
│   ├── answer-checker.js      # Multi-format answer evaluation engine
│   ├── bundle.js              # Standalone offline browser bundle (compiled artifact)
│   ├── game-engine.js         # Authoritative game state machine & timer controller
│   ├── game-session.js        # Active gameplay session lifecycle and state snapshots
│   ├── gameplay.js            # Active arena UI coordinator & terminal line selection
│   ├── gamification.js        # Scoring math, streak multipliers, 20 badges, rank logic
│   ├── hint-manager.js        # Pedagogical hint delivery and retry modifier rules
│   ├── landing.js             # Track selection, difficulty gating, hero action handlers
│   ├── onboarding.js          # 4-step first-time setup wizard & callsign validator
│   ├── profile.js             # User profile model, level calculator, avatar catalog
│   ├── question-bank.js       # In-memory question filtering and query engine
│   ├── question-validator.js  # Schema and integrity validator for question data
│   ├── router.js              # Safe URL parameter parser and navigation guards
│   ├── state.js               # Observable pub/sub event bus
│   ├── storage.js             # LocalStorage manager (Schema v1, migration, quota salvage)
│   └── utils.js               # HTML escaping (`escapeHTML`), DOM helpers (`qs`, `qsa`)
├── data/
│   ├── python-questions.js    # 60 Python questions
│   ├── c-questions.js         # 60 C questions
│   ├── cpp-questions.js       # 60 C++ questions
│   ├── java-questions.js      # 60 Java questions
│   ├── cyber-questions.js     # 60 Cybersecurity & Linux questions
│   ├── javascript-questions.js# 60 JavaScript questions
│   ├── rust-questions.js      # 60 Rust questions
│   └── sql-questions.js       # 60 SQL questions
├── assets/
│   ├── avatars/               # 6 custom SVG player avatars
│   └── audio/                 # Local procedural audio waveform assets (.wav)
├── scripts/
│   └── build-bundle.js        # Deterministic, portable bundle compiler script
├── tests/                     # 14 Unit, QA, and Playwright E2E test suites (535 tests)
└── docs/                      # Architectural specs, game rules, and audit reports
    ├── FINAL_SOURCE_AUDIT.md  # Comprehensive codebase inventory & security audit
    ├── FINAL_TEST_RESULTS.md   # Line-by-line test execution and responsive matrix
    ├── FINAL_DEFECT_LOG.md    # Complete defect tracking log (DEF-001 to DEF-012)
    ├── FINAL_RELEASE_STATUS.md# Production certification & sign-off report
    └── GAME_RULES.md          # Complete gameplay rules, scoring formulas, and tiers
```

---

## 🚀 How to Play & Run

### Method 1: Instant Local Play (No Installation Required)
Simply double-click **`index.html`** in your file manager to open it in any web browser (Chrome, Edge, Firefox, Safari, Brave). Everything works immediately!

### Method 2: Local HTTP Server (Recommended)
If you prefer running through a local development server:

```bash
# Using Python 3:
python -m http.server 8080

# Or using Node (npx):
npx serve .
```
Then navigate to: **`http://localhost:8080/`**

### Method 3: Static Web Hosting Deployment
Because SyntaxArena is 100% static:
1. Push the repository to GitHub.
2. In your repository settings, enable **GitHub Pages** pointing to the `master` / `main` branch.
3. Your game is live worldwide in seconds!

---

## 🎯 Game Rules & Scoring System

Scoring in SyntaxArena is mathematically deterministic and governed by the authoritative game engine:

$$\text{Final Question Score} = (\text{Base Points} + \text{Speed Bonus} - \text{Hint Penalty}) \times \text{Streak Multiplier} \times \text{Retry Modifier}$$

### 1. Base Points by Difficulty
- **Beginner:** $100$ pts
- **Intermediate:** $150$ pts
- **Expert:** $250$ pts

### 2. Speed Bonus
Answering quickly earns bonus points based on the remaining time (out of 30 seconds):
- **$> 20\text{s}$ remaining:** $+30$ pts
- **$10\text{--}20\text{s}$ remaining:** $+20$ pts
- **$< 10\text{s}$ remaining:** $+10$ pts

### 3. Streak Multiplier
Consecutive correct answers build momentum:
- **1–2 Correct:** $1.0\times$
- **3–4 Correct:** $1.2\times$
- **5–9 Correct:** $1.5\times$
- **10+ Correct:** $2.0\times$ (Maximum cap)

### 4. Hints & Second Chance Retry
- Requesting a hint deducts **$25$ points**.
- If a hint was requested and your first attempt was incorrect, the **Second Chance** mechanic triggers:
  - You are given an immediate second attempt to pick the right answer.
  - The "Next Question" button is withheld until the retry is submitted.
  - Correct second attempts receive a **$0.5\times$ multiplier** with a frozen streak.

### 5. Leveling & Career Progress
- **Level Calculation:** $\text{Level} = \lfloor \sqrt{\text{Total Career Points} / 250} \rfloor + 1$
- **Difficulty Unlock Requirements:**
  - Beginner: Always unlocked (Level 1+)
  - Intermediate: Unlocked at **Level 2** ($\ge 250$ pts)
  - Expert: Unlocked at **Level 3** ($\ge 1,000$ pts)

---

## ⌨️ Keyboard Shortcuts

During active gameplay in `game.html`:

| Key | Action |
| :---: | :--- |
| `1` – `4` | Select answer option 1 through 4 |
| `H` | Unlock pedagogical hint |
| `Enter` / `Space` | Advance to the next question |
| `Escape` | Dismiss modal dialogs / cancel prompt |

---

## 🧪 Testing & Quality Assurance

SyntaxArena contains a comprehensive automated testing pipeline consisting of modular Node.js unit tests, question bank linters, and Playwright browser integration suites:

```bash
# Run unit & integration test suite (410 tests)
npm test

# Run all 535 tests (Unit + 6 Playwright E2E browser suites)
npm run test:all

# Run specific Playwright suites:
npm run test:e2e             # Full user journey integration
npm run test:gamification     # Rewards, shop, leveling, bonus idempotency
npm run test:analytics        # Career metrics, recommendations, trends
npm run test:reliability      # LocalStorage migration, quota salvage, reset
npm run test:interactive      # Sound synthesis, motion, animations

# Compile / refresh standalone browser bundle:
npm run build
```

---

## 🛡️ Security & Privacy

- **Zero Data Collection:** All scores, profiles, and gameplay histories reside exclusively inside your browser's `localStorage`. No telemetry, analytics tracking, or external server calls.
- **Zero Script Evaluation:** No `eval()`, no `new Function()`, and no untrusted DOM innerHTML sinks.
- **Air-Gapped Operation:** All typography, graphics, and audio synthesis run 100% locally.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, study, customize, and share!
