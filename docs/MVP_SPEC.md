# Product Specification: SyntaxArena (The Master Coder Challenge)

## 1. Executive Summary & Vision

### 1.1 Product Vision
**SyntaxArena** is a premium, client-side browser programming challenge game engineered to transform computer science education into an electrifying, arcade-grade gaming experience. Inspired by the tactile, high-feedback micro-interactions of modern interactive platforms such as Git Mastery, SyntaxArena rejects dull, academic quiz layouts and sterile admin panels. Instead, it immerses players in an expressive, responsive cyber-studio where every keypress, streak milestone, code-trace deduction, and bug hunt feels physically rewarding, visually stunning, and pedagogically sound.

### 1.2 Core Value Proposition
- **Deep Cognitive Engagement:** Moving beyond trivia to actual program execution tracing, bug localization, pointer reasoning, and token synthesis across real-world systems and application languages.
- **Arcade Sensation:** Pushable 3D tactile buttons, dynamic streak multipliers, tension-building countdown timers, auditory feedback synthesizers, and real-time XP particle rewards.
- **Zero-Friction Accessibility:** 100% static client-side architecture requiring no logins, zero backend infrastructure, zero cloud dependencies, and zero build toolchains. All progress, career metrics, and campaign unlocks persist locally in browser `localStorage`.

---

## 2. Non-Negotiable Technology Constraints

| Constraint | Specification | Verification / Guardrail |
| :--- | :--- | :--- |
| **Markup** | HTML5 Semantic Standard | Pure HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<dialog>`). |
| **Styles** | Vanilla CSS3 | Custom Properties (CSS variables), Flexbox, CSS Grid, `@keyframes`. No Tailwind, Bootstrap, or SASS. |
| **Logic** | Vanilla ECMAScript 2022+ | Modern native JavaScript (ES Modules, Async/Await, Classes). No React, Vue, Angular, Svelte, or TypeScript. |
| **Runtime / Backend** | None (Static Browser Host) | Must run directly from `file://` or any static HTTP web server (e.g., Python `http.server`, Nginx, GitHub Pages). |
| **External Dependencies** | Zero external libraries | No npm dependencies, no Prism.js / Highlight.js bundle bloat, no third-party UI widgets, no external CDNs for core logic. |
| **Data Persistence** | Browser `localStorage` | Pure JSON serialization with versioning, checksum guard, and error recovery. |
| **Network APIs** | Prohibited | No external REST, GraphQL, or AI APIs. All game logic, validation, scoring, and question banks are embedded. |

---

## 3. Scope & MVP Content Matrix

### 3.1 Supported Languages
The game provides dedicated, deeply authentic tracks for four premier programming languages:
1. **Python 3.10+**: Object model, list comprehensions, generators, scoping rules, mutability quirks, duck typing, and magic methods.
2. **C (C99/C11 Standard)**: Pointers, address arithmetic, memory layout, `sizeof`, arrays vs pointers, structs, type casting, and standard library behaviors.
3. **C++ (C++17/C++20)**: Object-oriented semantics, references, operator overloading, virtual tables, templates, copy/move semantics, RAII, and standard containers.
4. **Java (SE 17 LTS)**: OOP inheritance, polymorphism, string pooling, pass-by-value semantics, exception hierarchies, generics, and JVM execution quirks.

### 3.2 Question Inventory Distribution
To ensure balanced, replayable, and statistically sound progression, the initial question inventory is fixed at **exactly 240 questions**:

```
Total Inventory: 240 Questions
├── Python (60 Questions)
│   ├── Beginner:     20 Questions
│   ├── Intermediate: 20 Questions
│   └── Expert:       20 Questions
├── C (60 Questions)
│   ├── Beginner:     20 Questions
│   ├── Intermediate: 20 Questions
│   └── Expert:       20 Questions
├── C++ (60 Questions)
│   ├── Beginner:     20 Questions
│   ├── Intermediate: 20 Questions
│   └── Expert:       20 Questions
└── Java (60 Questions)
    ├── Beginner:     20 Questions
    ├── Intermediate: 20 Questions
    └── Expert:       20 Questions
```

### 3.3 Four Core Question Formats

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CORE QUESTION FORMATS                           │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 1. Multiple-Choice │ 2. Predict Output  │ 3. Find-the-Bug              │
│    (MCQ)           │    (Tracing)       │    (Line Debugger)           │
├────────────────────┴────────────────────┴──────────────────────────────┤
│ 4. Fill-in-the-Missing-Code (Interactive Token Slotting)               │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Multiple-Choice Questions (MCQ):** Conceptual mastery, memory allocation models, language specification rules, and edge-case behavior.
2. **Predict-the-Output Questions:** Mental execution of realistic code snippets. The player must trace variables, loops, recursion, function call stacks, or object references to deduce exact console output.
3. **Find-the-Bug Questions:** Interactive code inspection. The user identifies the specific line containing an off-by-one error, memory leak, null-pointer dereference, logic inversion, or type-coercion flaw.
4. **Fill-in-the-Missing-Code Questions:** Code completion where critical tokens, operators, or keywords are missing from a code skeleton. Players select or drag appropriate tokens into blanks.

### 3.4 Expert Question Pedagogical Standard
Expert-level questions never rely on cheap trickery or trivial syntax memorization. They strictly emphasize:
- **State Traversal & Memory Tracing:** Complex pointer dereferencing, struct padding, and virtual function dispatch.
- **Deep Semantic Nuance:** Python late-binding in closures, C sequence points and integer promotions, C++ object slicing and template instantiation, Java autoboxing traps and static initialization order.
- **Zero Undefined Behavior Ambiguity:** If code contains undefined behavior (e.g., C signed integer overflow or modifying a variable twice between sequence points), the question explicitly tests the player's knowledge of why it is UB.

---

## 4. Player Journeys & Information Architecture

### Journey A: First Visit & Onboarding
```
[Landing Page] ──► [Hero Value Hook] ──► [Quick Profile Setup] ──► [Language Selection]
        │                                         │                        │
        ▼                                         ▼                        ▼
[Feature Preview]                           [Avatar & Handle]      [Mode / Difficulty]
        │                                                                  │
        └──────────────────────────────────────────────────────────────────► [Launch Game]
```
1. **Arrival:** Player lands on `#landing`. Hero section showcases dynamic animated preview of the code card with interactive arcade buttons and sound toggle.
2. **Value Hook:** Displays game pillars: 4 Languages, 240 Challenges, Zero Server Lag, Real Code Tracing.
3. **Profile Creation:** Modal prompts the player to enter a Call-sign (Username, 2-16 alphanumeric chars) and select an 8-bit / vector styled Hacker Avatar (e.g., Terminal Owl, Cyber Fox, Hex Dragon, Matrix Cat, Bit Knight, Glitch Bot).
4. **Track & Difficulty Selection:** Language selector highlights Python, C, C++, and Java with real-time stats (0/60 completed). Player chooses **Campaign Mode** or **Free Practice**.
5. **Session Configuration:** Toggle optional timers (Relaxed / Standard 45s / Speedrun 20s) and optional **Hardcore Mode** (3 Hearts).
6. **Instant Start:** Smooth route transition to `#game` with zero loading spinners or network latency.

---

### Journey B: Free Practice Mode
1. **Unrestricted Access:** Player navigates to `#practice`. All three difficulty tiers (Beginner, Intermediate, Expert) are immediately available without gatekeeping.
2. **Targeted Filters:** Player filters by language, difficulty, and format (e.g., "C++ Expert Output Prediction").
3. **Low-Stakes Learning:** Players can explore questions without risking campaign star ratings or hardcore elimination.
4. **Deep Explanation Drill-down:** After answering, an interactive explanation panel highlights line-by-line mechanics, compiler rules, and best-practice notes.
5. **Immediate Retry:** If answered incorrectly, player can immediately replay with reset parameters.

---

### Journey C: Campaign Progression Mode
1. **Stage 1 (Beginner Tier):** Open immediately upon profile creation (20 questions split into two 10-question checkpoints).
2. **Unlock Gate Stage 2 (Intermediate Tier):** Requires earning at least **14/20 (70%)** on Beginner Tier in that language, demonstrating core fluency.
3. **Unlock Gate Stage 3 (Expert Tier):** Requires earning at least **15/20 (75%)** on Intermediate Tier in that language.
4. **Mastery Certification:** Conquering Expert Tier with $\ge 80\%$ unlocks the prestigious **Language Grandmaster Badge**, custom holographic avatar borders, and specialized arcade titles.
5. **Continuous Save:** Campaign milestones, stars (1 to 3 stars per stage based on accuracy), and XP persist automatically.

---

### Journey D: Core Gameplay Experience
```
┌────────────────────────────────────────────────────────────────────────┐
│ HUD: [Language: Python] [Stage: 04/20] [❤❤❤] [Streak: x2.5 🔥] [Score: 1420] [⏱ 00:32]│
├────────────────────────────────────────────────────────────────────────┤
│ Question Card: [Predict the Output] [Difficulty: Intermediate] [Hint 💡]│
│                                                                        │
│   Prompt: What is the output of the following slice assignment?        │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │ 01  nums = [1, 2, 3, 4, 5]                                   │     │
│   │ 02  nums[1:4] = [20, 30]                                     │     │
│   │ 03  print(len(nums), nums)                                   │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
│   [A] 5 [1, 20, 30, 4, 5]            [B] 4 [1, 20, 30, 5]   (Selected) │
│   [C] 4 [1, 2, 20, 30]               [D] TypeError: slice mismatch     │
├────────────────────────────────────────────────────────────────────────┤
│ Action Bar: [Give Up] [Use Hint (-60 pts)]             [Submit Answer] │
└────────────────────────────────────────────────────────────────────────┘
```
1. **Presentation:** High-contrast code terminal container with syntax-highlighted tokens, line numbers, and format-specific interaction controls.
2. **Input Interaction:**
   - *MCQ / Output:* Pushable card selection via mouse click or keyboard shortcuts `1`-`4` / `A`-`D`.
   - *Find-the-Bug:* Interactive line gutters; clicking a line highlights it with a target crosshair.
   - *Fill-the-Code:* Interactive blank slots; clicking/dragging token chips into slots.
3. **Hint Request:** Clicking the Hint button alerts player of the score deduction, then displays a targeted conceptual clue.
4. **Validation:** Clicking Submit triggers evaluation:
   - *Correct:* Green pulse, haptic card pop, audio positive chime, streak multiplier increment, XP particle burst.
   - *Incorrect (with Hint):* One-time **Second Chance Retry** is unlocked.
   - *Incorrect (final):* Red card shake, life lost (if Hardcore), streak reset, audio low buzz, explanation drawer revealed with "Continue" button.

---

### Journey E: Results & Analytics
```
┌────────────────────────────────────────────────────────────────────────┐
│                        STAGE CLEARED: GRADE S                          │
│                               Score: 4,850                             │
├────────────────────────────────────────────────────────────────────────┤
│ Accuracy: 90% (18/20)    │ Best Streak: 9 🔥      │ Time: 04m 12s      │
│ XP Gained: +650 XP       │ Level Up: Level 4 ⬆    │ Rank: Logic Crafter│
├────────────────────────────────────────────────────────────────────────┤
│ Topic Mastery Breakdown:                                               │
│  - Pointer Arithmetic:   ██████████ 100% (4/4)                         │
│  - Memory Management:    ███████░░░  75% (3/4)                         │
│  - Struct Alignment:     ██████████ 100% (2/2)                         │
├────────────────────────────────────────────────────────────────────────┤
│ [Review Missed (2)]      [Play Next Tier]      [Return to Hub]         │
└────────────────────────────────────────────────────────────────────────┘
```
1. **Stage Completion Screen:** High-impact animated score rollup calculating base points, streak bonuses, time bonuses, and hint penalties.
2. **Pedagogical Feedback:**
   - Accuracy percentage and performance letter grade ($S \ge 95\%$, $A \ge 85\%$, $B \ge 75\%$, $C \ge 65\%$, $F < 65\%$).
   - Concept breakdown identifying strengths and weak concepts.
   - Personalized "Recommended Next Step" banner (e.g., "Review Java Polymorphism before attempting Expert").
3. **Missed Questions Review Drawer:** One-click drawer opens an interactive inspection mode displaying every missed question, what the player chose, the correct answer, and full technical breakdown.
4. **Achievements & Records:** Unlocked achievements pop up with celebratory animations and sound effects.

---

### Journey F: Returning Player & Replayability
1. **Profile Resumption:** Profile state is automatically recognized from `localStorage`.
2. **Active Game Restoration:** If a player previously closed their tab mid-game, a top banner alerts them: *"Suspended run detected (C++ Intermediate, Question 14/20). [Resume Run] or [Discard]"*.
3. **Daily Challenge:** A unique 10-question challenge is generated deterministically each day. Shows calendar completion stamp and daily streak badge.
4. **Trophy Room / Achievements:** Full audit of 24 unlockable achievements, badges, and statistical records.
5. **Missed Question Vault:** Dedicated filter allowing players to replay only questions they previously answered incorrectly across all sessions.

---

## 5. Functional Requirements Breakdown

| ID | Module | Functional Requirement |
| :--- | :--- | :--- |
| **FR-01** | Profile | Support multiple local profiles (create, switch, delete) stored in `localStorage`. |
| **FR-02** | Profile | Provide customizable callsign (2-16 chars) and avatar selector (6 unique vector avatars). |
| **FR-03** | Router | Client-side hash routing (`#landing`, `#profile`, `#campaign`, `#practice`, `#game`, `#results`, `#achievements`, `#settings`). |
| **FR-04** | Questions | 240 distinct, pre-compiled questions (60 Python, 60 C, 60 C++, 60 Java; 20/20/20 difficulty). |
| **FR-05** | Formats | Render distinct interaction layouts for MCQ, Output Prediction, Find-the-Bug, and Fill-in-Code. |
| **FR-06** | Engine | Randomize question presentation order per session while maintaining exact 20/20/20 distribution. |
| **FR-07** | Engine | Shuffle distractor options for MCQ/Output to prevent positional memorization. |
| **FR-08** | Scoring | Calculate base score, difficulty multiplier, streak multiplier (up to 3.0x), and speed bonus. |
| **FR-09** | Hints | Provide 1 conceptual hint per question with difficulty-scaled point penalty. |
| **FR-10** | Retries | Support exactly one "Second Chance" retry when a question is missed after requesting a hint. |
| **FR-11** | Hardcore | Provide optional 3-lives mode with instant run-over upon losing all hearts. |
| **FR-12** | Timers | Support Relaxed (untimed), Standard (45s), and Speedrun (20s) with animated radial/linear bar. |
| **FR-13** | Daily | Deterministic daily challenge generator using calendar date seed (`YYYYMMDD`). |
| **FR-14** | State | Auto-snapshot active session to `localStorage` on every question transition for instant crash recovery. |
| **FR-15** | Audio | Web Audio API procedural sound engine with independent Sound Effects and Music volume controls. |
| **FR-16** | Backup | Profile Export/Import as JSON file with schema validation and sanitization. |
| **FR-17** | Theme | System-aware Light and Dark themes with manual toggle persisting in `localStorage`. |
| **FR-18** | A11y | Full keyboard navigation (`1-4`, `Tab`, `Enter`, `Space`, `Esc`), WCAG 2.1 AA contrast, and screen-reader announcements. |

---

## 6. Exclusions & Anti-Scope (What We Are NOT Building)

To preserve the integrity, security, and pure static performance of SyntaxArena, the following are strictly excluded:
1. **No Backend or Cloud Databases:** No Firebase, Supabase, AWS, Express, or Node.js runtime.
2. **No User Authentication Accounts:** No email/password sign-ups, OAuth, Google Sign-In, or JWT tokens. All identity is local to the user's browser.
3. **No Network Multiplayer:** No WebSockets, WebRTC, or live multiplayer lobby. Replayability relies on personal bests, local ghost scores, and daily seed matching.
4. **No Arbitrary Code Execution Sandbox:** We do NOT run `eval()` or send untrusted code to a remote compiler. All questions have deterministic, certified, pre-calculated outputs. This guarantees 100% offline security, instant zero-latency validation, and zero remote server vulnerability.
5. **No AI-Generated Questions on the Fly:** Eliminates hallucinations, incorrect compiler assumptions, or API costs.
6. **No Build Tooling or Frameworks:** No Webpack, Vite, React, or Vue. Must open and run cleanly from native browser standards.
