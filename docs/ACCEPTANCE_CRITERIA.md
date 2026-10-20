# Acceptance Criteria & Verification Suite: SyntaxArena

## 1. Overview & Quality Standard

This document establishes the testable, unambiguous acceptance criteria for **SyntaxArena**. Every criterion is defined with concrete **Pass / Fail** conditions following the *Given-When-Then* structure to enable automated and manual QA verification before product sign-off.

---

## 2. Content & Question Integrity

| ID | Criterion | Verification Method | Pass / Fail Rule |
| :--- | :--- | :--- | :--- |
| **AC-CNT-01** | **Total Question Inventory** | Automated check of all data catalogs (`python.js`, `c.js`, `cpp.js`, `java.js`). | **PASS:** Total questions across all 4 languages equals exactly 240. |
| **AC-CNT-02** | **Language & Tier Distribution** | Automated count of items per language and difficulty tier. | **PASS:** Exactly 60 questions per language (Python: 20/20/20, C: 20/20/20, C++: 20/20/20, Java: 20/20/20). |
| **AC-CNT-03** | **ID Uniqueness & Schema Validity** | Regex validation of all question objects against `QUESTION_SCHEMA.md`. | **PASS:** Zero duplicate IDs; all IDs conform to `^(py\|c\|cpp\|java)-(beg\|int\|exp)-[0-9]{3}$`. |
| **AC-CNT-04** | **Answer Integrity** | Validation of `correctAnswer` in `options` or `targetLine` within code bounds. | **PASS:** 100% of questions have unambiguous valid answers that exist within choices or line bounds. |
| **AC-CNT-05** | **Zero Unexplained Undefined Behavior** | Technical audit of C and C++ questions. | **PASS:** Any question with undefined behavior explicitly tests the player's knowledge of that UB. |

---

## 3. Gameplay Mechanics & Interaction

### 3.1 Question Presentation & Input Handling
- **AC-GMP-01: Multi-Format Rendering**
  - *Given* an active game session,
  - *When* a question loads,
  - *Then* the UI renders the correct specific layout:
    - Multiple-choice / Output prediction displays 4 distinct pushable cards.
    - Find-the-Bug displays interactive line gutters with bug crosshairs.
    - Fill-in-the-Code displays blank token slots and a selectable token bank.
  - *Status:* **PASS** if all 4 layouts render with appropriate interactive elements.

- **AC-GMP-02: Keyboard Shortcuts**
  - *Given* a multiple-choice or predict-output question,
  - *When* the player presses key `1`, `2`, `3`, or `4` (or `A`, `B`, `C`, `D`),
  - *Then* the corresponding option card is immediately highlighted and selected without requiring a mouse click.
  - *Status:* **PASS** if numeric and alpha keyboard shortcuts select options.

- **AC-GMP-03: Double-Click Submission Prevention**
  - *Given* an answer choice is selected,
  - *When* the player rapidly double-clicks or double-taps the "Submit Answer" button,
  - *Then* the button disables upon the first event; exactly one evaluation occurs; score is never duplicated.
  - *Status:* **PASS** if rapid spamming yields only one state mutation.

---

### 3.2 Scoring, Streaks & Speed Bonuses
- **AC-SCR-01: Difficulty Point Allocation**
  - *Given* a correct answer on the first try without hints and without timer bonuses,
  - *When* scored,
  - *Then* awards:
    - Beginner: $100 \times M(\text{streak})$
    - Intermediate: $200 \times M(\text{streak})$
    - Expert: $300 \times M(\text{streak})$
  - *Status:* **PASS** if base point values match exact constants.

- **AC-SCR-02: Streak Multiplier Scaling**
  - *Given* an ongoing session,
  - *When* the player answers consecutive questions correctly,
  - *Then* multiplier increases by $+0.25\times$ per correct answer up to a hard ceiling of $3.0\times$ at streak 8.
  - *When* an incorrect answer occurs,
  - *Then* streak immediately resets to $0$ and multiplier reverts to $1.0\times$.
  - *Status:* **PASS** if multiplier scales and resets strictly according to rule.

- **AC-SCR-03: Anti-Guessing Speed Bonus Guardrail**
  - *Given* a 45s countdown timer,
  - *When* a question is answered in $< 22.5\text{s}$ on the first attempt without hints,
  - *Then* awards speed bonus points proportional to remaining time;
  - *When* answered after $22.5\text{s}$ or after requesting a hint,
  - *Then* speed bonus is strictly $0$.
  - *Status:* **PASS** if speed bonus is zero whenever time exceeds 50% or hints were used.

---

### 3.3 Hints & Second Chance Retry Flow
- **AC-HNT-01: Hint Deduction**
  - *Given* an active question,
  - *When* the player clicks "Hint",
  - *Then* a modal prompts for confirmation stating the exact penalty (Beginner: -25 pts, Intermediate: -60 pts, Expert: -100 pts).
  - *When* confirmed, points are deducted and the pedagogical clue appears.
  - *Status:* **PASS** if deduction occurs and clue is displayed.

- **AC-HNT-02: Second Chance Retry Activation**
  - *Given* a player who has activated a Hint,
  - *When* their initial answer submission is incorrect,
  - *Then* the game does NOT immediately mark the question failed; instead, it displays: *"Second Chance! Try again with your hint."*
  - *When* answered correctly on the second try,
  - *Then* awards $50\%$ base points, freezes streak (streak is preserved), and marks question completed.
  - *When* answered incorrectly on the second try,
  - *Then* awards $0$ points, resets streak to $0$, and reveals the explanation.
  - *Status:* **PASS** if second chance flow executes with exact point and streak rules.

---

### 3.4 Hardcore Mode & Failure Conditions
- **AC-HDC-01: 3-Hearts Elimination**
  - *Given* Hardcore Mode is active,
  - *When* an incorrect answer occurs or timer reaches 0,
  - *Then* 1 heart is lost with shatter animation.
  - *When* all 3 hearts are lost,
  - *Then* session immediately halts with **GAME OVER** screen; player cannot continue the run.
  - *Status:* **PASS** if 3 errors result in immediate session termination.

- **AC-HDC-02: Hints Prohibited in Hardcore**
  - *Given* Hardcore Mode is active,
  - *Then* the "Hint" button is disabled and hidden from the HUD.
  - *Status:* **PASS** if hints are completely inaccessible in Hardcore mode.

---

## 4. Local Persistence & State Recovery

- **AC-STO-01: Zero-Loss Mid-Game Recovery**
  - *Given* an active game session at Question 12 of 20 with score 2,450,
  - *When* the browser tab is abruptly closed or hard-refreshed,
  - *When* the user re-opens SyntaxArena,
  - *Then* a recovery banner appears: *"Suspended run detected. [Resume]"*. Clicking Resume restores Question 12 with exact score, remaining hearts, streak, and question pool intact.
  - *Status:* **PASS** if session resumes with 100% state parity.

- **AC-STO-02: Multi-Profile Separation**
  - *Given* Profile A ("Alex") and Profile B ("Jordan") on the same browser,
  - *When* switching from Profile A to Profile B,
  - *Then* XP, campaign unlock tiers, stars, and achievements reflect only Profile B without cross-contamination.
  - *Status:* **PASS** if profile data remains strictly segregated.

- **AC-STO-03: Export / Import Backup**
  - *Given* an existing user profile with Level 5 and 12 achievements,
  - *When* the user clicks "Export Save Data",
  - *Then* downloads a valid `syntaxarena_backup_*.json` file.
  - *When* importing that file on an empty browser instance,
  - *Then* profile, stats, and achievements are completely restored.
  - *Status:* **PASS** if backup and restore round-trips without loss or error.

---

## 5. Daily Challenge Determinism

- **AC-DLY-01: Local Reproducibility**
  - *Given* calendar date `2026-10-19` on two separate disconnected devices,
  - *When* both users launch the Daily Challenge,
  - *Then* both users receive the exact same 10 questions in the exact same sequence.
  - *Status:* **PASS** if generated question sequence is identical across devices.

- **AC-DLY-02: Once-Per-Day Completion Badge**
  - *Given* a player completes the Daily Challenge for the current date,
  - *When* attempting to play the Daily Challenge again on the same calendar day,
  - *Then* displays a "Daily Completed" medal with their recorded score and practice replay mode only (no duplicate daily XP awarded).
  - *Status:* **PASS** if duplicate daily completion rewards are blocked.

---

## 6. Accessibility & Usability (WCAG 2.1 AA)

- **AC-A11Y-01: Contrast Ratio**
  - *Given* Dark Mode and Light Mode themes,
  - *Then* all text against background surfaces achieves at least a **4.5:1** contrast ratio for regular text and **3.0:1** for large text/headings.
  - *Status:* **PASS** if all color combinations pass WCAG 2.1 AA contrast audits.

- **AC-A11Y-02: Visible Keyboard Focus Indicators**
  - *Given* keyboard navigation via `Tab` key,
  - *Then* every interactive element (buttons, cards, links, close icons) renders a high-visibility focus ring (`outline: 3px solid var(--border-focus); outline-offset: 3px`).
  - *Status:* **PASS** if no interactive element has `outline: none` without replacement.

- **AC-A11Y-03: Screen Reader Announcements**
  - *Given* a screen reader user (NVDA / VoiceOver / JAWS),
  - *When* answer validation occurs,
  - *Then* an `aria-live="polite"` region immediately announces: *"Correct! Streak at 4"* or *"Incorrect. The correct answer was..."*
  - *Status:* **PASS** if status changes are announced to assistive technologies.

- **AC-A11Y-04: Reduced Motion Compliance**
  - *Given* system setting `prefers-reduced-motion: reduce`,
  - *When* gameplay occurs,
  - *Then* card shakes, confetti bursts, and spring button translations are disabled.
  - *Status:* **PASS** if all motion animations are suppressed when reduced motion is preferred.

---

## 7. Audio & Sound Performance

- **AC-AUD-01: Zero Autoplay Violation**
  - *Given* a fresh browser load,
  - *When* no user interaction has occurred,
  - *Then* no audio plays, and `AudioContext` remains suspended until the first click or keypress.
  - *Status:* **PASS** if audio is completely silent prior to user gesture.

- **AC-AUD-02: Independent Sound & Music Controls**
  - *Given* settings sliders for SFX and Music,
  - *When* SFX is set to $0\%$, sound effects are completely silenced while UI continues normally.
  - *Status:* **PASS** if volume controls operate independently and persist across sessions.

---

## 8. Responsiveness & Cross-Device Ergonomics

- **AC-RSP-01: Mobile Touch Targets**
  - *Given* viewport width $\le 640\text{px}$,
  - *Then* all interactive buttons, cards, and line gutters have a minimum clickable/tappable area of $48\text{px} \times 48\text{px}$ with at least $8\text{px}$ separation.
  - *Status:* **PASS** if no touch target is smaller than 48px.

- **AC-RSP-02: Mobile Code Block Overflow**
  - *Given* long code lines on a narrow 360px screen,
  - *Then* code snippet does not break page layout; horizontal scrolling is confined within the terminal container with sticky line numbers.
  - *Status:* **PASS** if code block scrolls horizontally without clipping or page-level horizontal overflow.
