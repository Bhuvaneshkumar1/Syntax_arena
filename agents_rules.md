# SyntaxArena — AI Agent Rulebook & Architecture Specification
**Document Version:** 2.0.0  
**Target Environment:** Vanilla Browser (ES6+), Web Audio API, BroadcastChannel, LocalStorage, Vercel Serverless Functions  
**Application Origin:** `https://syntaxarena-phi.vercel.app`

---

## 1. Prime Directive & Engineering Boundaries

1. **Zero External Runtime Packages:**
   - The production client application must NEVER depend on runtime npm packages, bundler runtimes, or external frameworks (React, Vue, Webpack, Vite, etc.).
   - All client-side runtime logic is written in 100% standard ES6+ modules (`import`/`export`) or vanilla standalone JavaScript.
   - DevDependencies are strictly restricted to testing tools (`playwright`).

2. **1-to-1 Public Directory Parity:**
   - Every change made to root `.html`, `js/`, `css/`, `data/`, and `assets/` files MUST be synced to `public/` (either manually or via `npm run build`).
   - The root files serve local modular test runners, while `public/` serves Vercel static deployments.

3. **Strict Isolation & State Protection:**
   - Never mutate master question pools in-place. Always deep-clone via `.map(q => ({ ...q }))`.
   - Never expose raw database keys or auth secrets to client-side code.
   - Serverless OAuth secrets (`GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_SECRET`) reside exclusively in Vercel environment variables accessed in `/api/auth/*.js`.

---

## 2. Core Game Loop & Question Engine Rules

### 2.1 Question Catalog & Tier Structure
- The catalog contains 720 verified challenges across 12 languages:
  `python`, `c`, `cpp`, `java`, `cyber`, `javascript`, `rust`, `sql`, `typescript`, `go`, `html`, `asm`.
- Each language contains exactly 60 questions:
  - **Beginner:** 20 questions
  - **Intermediate:** 20 questions
  - **Expert:** 20 questions
- Challenge types: `output_prediction`, `bug_hunt`, `memory_trace`, `syntax_audit`.
- Questions must be validated using `QuestionValidator` with zero schema violations.

### 2.2 Question Sanitization
- When a question is in the `ACTIVE` or `AWAITING_RETRY` engine states:
  - `correctAnswer` must be stripped (`undefined`).
  - `explanation` must be stripped (`undefined`).
- Only when transitioned to `SHOWING_EXPLANATION` or `COMPLETED` may `correctAnswer` and `explanation` be revealed to the client.

### 2.3 Shuffling & Randomization Rules
- Shuffling applies to BOTH questions and options:
  - Questions are shuffled using Fisher-Yates when `randomizeOrder` is active.
  - Option choices (`q.options`) must be cloned and shuffled.
  - The numeric `correctAnswer` index must be dynamically updated to point to the newly shuffled location of the correct option.
  - In 1v1 SyntaxDuel, shuffling must use a deterministic seed so both rival players receive the identical shuffled question sequence.

### 2.4 Campaign Stage Splitting
- A 20-question track must NOT present all 20 questions as a continuous, unsegmented block.
- The 20 questions are divided into four 5-question sectors (Questions 1–5, 6–10, 11–15, 16–20).
- At question boundaries (indices 5, 10, 15), a **Stage Intermission Checkpoint** modal (`#modal-stage-checkpoint`) must appear:
  - Displays current sector cleared, current score, streak, and accuracy.
  - Pauses timer and requires the player to click `"Continue to Next Stage ➔"` to resume.

---

## 3. Scoring, Multiplier, and Hint Penalty Rules

### 3.1 Base Points
- **Beginner:** 100 points
- **Intermediate:** 200 points
- **Expert:** 300 points

### 3.2 Streaks & Multipliers
- Multiplier formula:
  $$\text{Multiplier} = \min(1.0 + (\text{currentStreak} \times 0.05), 1.5)$$
- Streaks increment by $+1$ for every correct answer on the FIRST attempt.
- Incorrect answers without a hint reset streak to $0$.

### 3.3 Hint Penalties & Second Chance Retries
- Hint penalties deducted from base score:
  - **Beginner:** $-25$ points
  - **Intermediate:** $-60$ points
  - **Expert:** $-100$ points
- **Second Chance Retry:**
  - If a player unlocks a hint on a question and answers incorrectly, they do NOT immediately fail; they transition to `AWAITING_RETRY`.
  - On retry, answering correctly yields $50\%$ base points minus the hint penalty:
    $$\text{RetryPoints} = \max\Big(0, \big(\text{basePoints} \times 0.5\big) - \text{penalty}\Big)$$
  - On retry, streak is **FROZEN** (neither incremented nor reset to 0).

### 3.4 Speed Bonus
- Awarded when an answer is submitted on first try without hints and with remaining time:
  $$\text{SpeedBonus} = \lfloor 0.25 \times \text{basePoints} \times \min(1.0, \text{timeRemaining} / \text{timeLimit}) \rfloor$$

### 3.5 Career Spendable Currency Rebalancing
- The raw arena session score (e.g., 5,500+ raw points) is scaled down by a factor of 20 before being banked as spendable currency in `profile.totalScore`:
  $$\text{SpendablePointsAwarded} = \max\Big(15, \text{round}\big(\text{session.totalScore} \times 0.05\big)\Big)$$
- This ensures finishing a single 20-question arena session awards $\sim 250\text{–}350$ points, requiring deliberate player progression over multiple sessions to unlock higher-tier cosmetic avatars ($450\text{–}3,500$ points) and badges ($250\text{–}3,000$ points).
- **Lifetime XP** (`profile.lifetimeXP`) determines player level (1–10) and is NEVER deducted when spendable points are used to purchase shop items.

---

## 4. Game Modes Specification

| Mode | Key Parameters | Specific Rules |
| :--- | :--- | :--- |
| **Campaign Mode** | 20 Qs, 45s timer | 4 stages of 5 Qs each with checkpoint intermissions. 3-star rating awarded based on $\ge 90\%$ accuracy. |
| **Speedrun Mode** | 20 Qs, 20s timer | Fast deduction countdown. Unlocks at Player Level 3. |
| **Hardcore Mode** | 20 Qs, 30s timer, 3 Hearts | Hints disabled. Every incorrect answer shatters 1 Heart. Reaching 0 Hearts terminates the run immediately. Unlocks at Player Level 5. |
| **Endless Farm Mode** | 200 Qs pool | Continuous question stream with dynamic point multiplier. Players can cash out and bank accumulated points at any time. |
| **1v1 SyntaxDuel** | 10 Qs, P2P Broadcast | Peer-to-peer sync across tabs or network. Live delta lead tracking (`+150 pts LEAD`). Deterministic seeded questions. Full HTTPS share link generation. |
| **Mega-Boss Daemons** | 3 Bosses | Curated Ring-0 vulnerability incursions (NullPointer Leviathan, Kernel Panic Hydra, Buffer Overflow Dragon). Defeating bosses awards unique boss badges. |
| **CyberDrill Incident** | 3-Phase Incident | Simulated production outages (DB Deadlock, Memory Leak, API Compromise). Post-mortem telemetry report card. |

---

## 5. Tactile Memory Pointer Minigames Rules

1. **Stack Master (Cable Connect):**
   - Drag-and-drop pointer cables from stack variables to heap memory addresses.
   - **Bidirectional Rule:** Cable wiring MUST evaluate matching ports bidirectionally: `(r.from === u.from && r.to === u.to) || (r.from === u.to && r.to === u.from)`.
   - Auto-checks when all required cables are plugged in.
   - Cables are rendered via dynamic SVG bezier curves with hover hitboxes for 1-click removal.

2. **Heap Hunter (Leak Patrol):**
   - Mark-and-sweep garbage collection simulator with dynamic heap capacity meter ($1024\text{B}$).
   - **No Giveaway Hints:** Do not display hints that explicitly highlight orphaned memory blocks. Players must inspect pointer topologies manually.
   - Deallocating active reachable memory triggers a critical **Use-After-Free (UAF)** penalty ($-100$ points, streak reset).
   - Reclaiming all orphaned memory completes the sector.

3. **Segfault Defuser (Dereference Rush):**
   - Rapid-fire memory hazard triage with a 12-second countdown per hazard.
   - Must be chunked into **3 sectors of 5 hazards each** (instead of all 15 at once).
   - At hazard boundaries 5 and 10, a Sector Clear intermission checkpoint appears before proceeding.
   - Four hazard categories: `Safe Access`, `Null Pointer (0x0)`, `Dangling / UAF`, `Buffer Overrun`.

---

## 6. Authentication, Profile & Cross-Device Sync Rules

1. **Multi-Provider OAuth Standard:**
   - Supported providers: Google OAuth 2.0 / GIS, GitHub OAuth, Email + Password, Guest Mode.
   - OAuth endpoints:
     - `/api/auth/google` $\to$ Exchanges authorization code or GIS token for profile.
     - `/api/auth/github` $\to$ Exchanges GitHub authorization code for user profile.
   - Authorized redirect URIs: `https://syntaxarena-phi.vercel.app/api/auth/google`, `https://syntaxarena-phi.vercel.app/api/auth/github`.

2. **Automatic Username Derivation:**
   - On initial OAuth login, display name or email prefix (e.g. `alex.dev@gmail.com` $\to$ `alexdev`) is automatically set as the initial username.
   - Players can update their username at any time from Settings.

3. **Initial Avatar Locking:**
   - Brand new accounts start with ONLY `cyber_fox` unlocked.
   - All other 13 avatars (`terminal_owl`, `matrix_cat`, `hex_dragon`, etc.) remain locked with 🔒 overlays until unlocked via level progression or points in the Career Shop.

4. **Cross-Device Account Sync:**
   - Signing in with the same Google, GitHub, or Email account on any device syncs XP, level, unlocked avatars, completed stages, and badges.
   - An offline 1-click transfer export/import link (`Auth.generateSyncLink()`) is supported for moving data between browsers without cloud logins.

5. **Security & OAuth Legal Standards:**
   - Dedicated routes `/privacy` (`privacy.html`) and `/terms` (`terms.html`).
   - Must explicitly reference the *Google API Services User Data Policy*, include *Google Limited Use* clauses, provide an account permission revocation link, and enforce a strict zero-sale user data guarantee.
   - Settings page contains embedded readers for both Privacy Policy and Terms of Service.

---

## 7. UI Shell, Layout & Theme Rules

1. **Activity Rail & Drawer Navigation:**
   - Desktop viewport ($>768\text{px}$): Sidebar defaults to compact 68px collapsed icon rail. Expands to 240px drawer upon clicking the toggle button or pressing `Ctrl+B`.
   - Mobile viewport ($\le 768\text{px}$): Single mobile hamburger toggle button in topbar (`#btn-sidebar-mobile-toggle`). Clicking opens full drawer with glassmorphic backdrop overlay (`#sidebar-backdrop`). Selecting any navigation link or tapping the backdrop immediately closes the drawer.
   - The desktop toggle button must be hidden on mobile, and the mobile toggle must be hidden on desktop (`display: none !important;`).

2. **All Routes in Left Navigation:**
   - Bottom mobile navigation bar (`.mobile-bottom-dock`) is completely retired.
   - All navigation routes reside in `#app-sidebar`:
     `Hub`, `Arena`, `Memory Lab`, `Sandbox`, `Academy`, `Results`, `Progression`, `Settings`, `Privacy Policy`, `Terms of Service`.

3. **High-Contrast Themes:**
   - Four themes: Cyber Studio (`dark`), Studio Paper (`light`), Amber Flame (`amber`), Grandmaster Gold (`gold`).
   - **Light Theme Contrast Rule:** Code editors, terminals, and preformatted blocks MUST maintain dark high-contrast backgrounds with bright neon syntax (`#38bdf8`) in light theme to prevent text disappearance.
   - Topbar icon buttons (`.btn-icon-toggle`) must have `flex-shrink: 0;` so theme toggle and audio mute buttons never squish or disappear on small screens.

4. **Fluid Viewport Scaling:**
   - No horizontal scrollbars or element clipping on small viewports down to $360\text{px}$. Cards must shrink gracefully with `max-width: 100%`.

---

## 8. Web Sandbox & Interactive Cyber Terminal Rules

1. **Virtual Filesystem (VFS):**
   - In-memory hierarchical filesystem (`/home/hacker`, `/bin`, `/etc`, `/tmp`).
   - Standard commands supported: `ls`, `cat`, `pwd`, `cd`, `echo`, `touch`, `rm`, `mkdir`, `clear`, `wc`, `base64`, `grep`, `env`, `python`, `bash`, `sh`, `nano`.

2. **Execution Simulation:**
   - `bash <file.sh>` and `sh <file.sh>` must execute multi-line bash scripts via `runBashScript()` supporting variables, conditional evaluations (`[[ ... ]]`), loops, and subshells.
   - `nano <file>` must output file contents to terminal stdout and synchronize the file buffer into `#page-code-editor`.

3. **Cyber Terminal Fullscreen Mode:**
   - Toggle fullscreen expands `#terminal-shell-box` to fill the entire viewport (`100vw` $\times$ `100vh`, `z-index: 999999`).
   - Must provide an explicit `#btn-exit-shell-fullscreen` button (`🗗 Exit Fullscreen (Esc)`) and handle the `Escape` key to return to normal layout.
   - The entire console area is click-to-focus for command typing.

---

## 9. 3D Arcade Trophy Vault & Verification Rules

1. **Trophy Inspection & Requirements Modal:**
   - Every badge in the 3D Trophy Vault includes clear unlock requirements.
   - An accessible `[ ⓘ How to Obtain ]` button opens `#modal-trophy-obtain-info` explaining criteria for Milestones, Speed, Hardcore, Language, Boss Slayer, and Memory Master trophies.

2. **Tamper-Evident QR Verification:**
   - In the 3D cartridge inspector, an SVG QR code encodes the verified certificate URL:
     `https://syntaxarena-phi.vercel.app/progress.html?verify=1&uid=<USER_ID>&badge=<BADGE_ID>`
   - Scanning the QR code opens the verified credential showcase modal displaying badge name, date, user ID, cryptographic integrity hash, and a 1-click `"Download Official Certificate (PNG)"` button.

3. **Dynamic GitHub Badge Studio:**
   - Generates live shields.io markdown, SVG vector, and HTML badge embed snippets.
   - Provides direct file downloads: `💾 Download .md`, `🌐 Download .html`, `📐 Download .svg`.

---

## 10. Automated Testing & Verification Mandate

Every code change must satisfy:
1. **100% Master Test Suite Pass:** `npm test` executes 1,129 unit tests across 16 test suites. 0 failures permitted.
2. **Playwright E2E Verification:**
   - `node tests/test-side-nav-playwright.js` (Sidebar & Auth E2E, 32 tests)
   - `node tests/test-memory-minigames-playwright.js` (Memory Minigames E2E, 44 tests)
3. **Parity Build Execution:**
   - `npm run build` must run without error to generate `js/bundle.js` and sync all assets to `public/`.
