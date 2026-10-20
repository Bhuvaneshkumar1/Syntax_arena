# Game Rules & Mechanics: SyntaxArena

## 1. Scoring Model & Mathematical Formulation

SyntaxArena employs a balanced, arcade-calibrated scoring engine designed to reward deductive accuracy, consistency, and speed while heavily penalizing uninformed random guessing.

### 1.1 Base Points by Difficulty Tier
Every question has an inherent base point value reflecting cognitive complexity:
- **Beginner Tier:** $P_{\text{base}} = 100 \text{ pts}$
- **Intermediate Tier:** $P_{\text{base}} = 200 \text{ pts}$
- **Expert Tier:** $P_{\text{base}} = 300 \text{ pts}$

---

### 1.2 Streak Multiplier Engine
Consistency triggers an escalating streak multiplier that amplifies points for consecutive correct answers:
- The streak counter begins at $0$, with an initial multiplier of $M = 1.0\times$.
- Each consecutive correct answer increments the multiplier by $+0.25\times$.
- The multiplier caps at a maximum ceiling of $3.0\times$ (reached upon achieving an 8-streak).
- An incorrect answer resets the streak counter immediately to $0$ and the multiplier back to $1.0\times$.

$$M(\text{streak}) = \min(1.0 + (\text{streak} \times 0.25), 3.0)$$

| Streak Count | Multiplier | Visual State |
| :--- | :--- | :--- |
| 0 | $1.0\times$ | Inactive / Base |
| 1 | $1.25\times$ | Blue Ember |
| 2 | $1.50\times$ | Blue Flare |
| 3 | $1.75\times$ | Violet Spark |
| 4 | $2.00\times$ | Violet Flame |
| 5 | $2.25\times$ | Amber Blaze |
| 6 | $2.50\times$ | Amber Inferno |
| 7 | $2.75\times$ | Coral Supernova |
| $\ge 8$ | $3.00\times$ (MAX) | Rainbow Arc Plasma (Sparks fly on HUD) |

---

### 1.3 Speed Bonus Formulation (Timed Modes)
When a countdown timer is active (Standard 45s or Speedrun 20s), players earn a speed bonus for rapid correct deduction. 

**Anti-Guessing Guardrail:** 
To prevent rapid random guessing from yielding inflated scores, **the speed bonus is awarded ONLY if the answer is correct on the FIRST attempt WITHOUT hints**, and is only calculated if answered within the first half ($50\%$) of the total allotted time limit:

$$B_{\text{speed}} = \begin{cases} 
\left\lfloor 0.5 \times P_{\text{base}} \times \left( \frac{T_{\text{remaining}} - 0.5 T_{\text{total}}}{0.5 T_{\text{total}}} \right) \right\rfloor & \text{if } T_{\text{remaining}} > 0.5 T_{\text{total}} \text{ and first try without hint} \\
0 & \text{otherwise}
\end{cases}$$

---

### 1.4 Hint Penalties & Retry Modifiers
Hints are designed as safety nets rather than free answers:
- Requesting a hint deducts a fixed penalty based on difficulty tier:
  - **Beginner Hint Penalty ($H$):** $-25 \text{ pts}$ (25% of base)
  - **Intermediate Hint Penalty ($H$):** $-60 \text{ pts}$ (30% of base)
  - **Expert Hint Penalty ($H$):** $-100 \text{ pts}$ (33.3% of base)
- **Retry Modifier ($A$):**
  - First attempt correct: $A = 1.0$
  - Second Chance (retry) correct after a hint: $A = 0.5$ (Base points cut in half)

---

### 1.5 Master Scoring Formula
The points awarded for question $i$ are computed as:

$$\text{Points}_i = \max\left(0, \left\lfloor (P_{\text{base}} \times A - H + B_{\text{speed}}) \times M(\text{streak}) \right\rfloor\right)$$

*Note:* A player's session score can never decrease below $0$ on an individual question.

---

### 1.6 Worked Scoring Examples by Difficulty Tier

#### Example 1: Beginner Tier (Timed Standard 45s)
- **Parameters:** $P_{\text{base}} = 100$, Time limit $= 45\text{s}$. Answered in $9\text{s}$ ($T_{\text{remaining}} = 36\text{s}$). No hints ($H = 0, A = 1.0$). Current streak $= 3$ ($M = 1.75\times$).
- **Speed Calculation:**
  $$T_{\text{half}} = 22.5\text{s}; \quad B_{\text{speed}} = \left\lfloor 50 \times \left(\frac{36 - 22.5}{22.5}\right) \right\rfloor = \lfloor 50 \times 0.6 \rfloor = 30 \text{ pts}$$
- **Total Points Awarded:**
  $$\text{Points} = \lfloor (100 \times 1.0 - 0 + 30) \times 1.75 \rfloor = \lfloor 130 \times 1.75 \rfloor = \mathbf{227 \text{ pts}}$$

#### Example 2: Intermediate Tier (Second Chance Retry after Hint)
- **Parameters:** $P_{\text{base}} = 200$. Hint requested ($H = 60$). Initial submission incorrect. Second Chance retry correct ($A = 0.5$). Speed bonus nullified ($B = 0$). Streak was 4 ($M = 2.0\times$).
- *Rule Check:* On retry, streak is frozen (not broken, not incremented).
- **Point Calculation:**
  $$\text{Points} = \lfloor (200 \times 0.5 - 60 + 0) \times 2.0 \rfloor = \lfloor (100 - 60) \times 2.0 \rfloor = \lfloor 40 \times 2.0 \rfloor = \mathbf{80 \text{ pts}}$$

#### Example 3: Expert Tier (Flawless High-Streak Deduction)
- **Parameters:** $P_{\text{base}} = 300$, Time limit $= 45\text{s}$. Answered in $15\text{s}$ ($T_{\text{remaining}} = 30\text{s}$). No hints. Active streak $= 7$ ($M = 2.75\times$).
- **Speed Calculation:**
  $$B_{\text{speed}} = \left\lfloor 150 \times \left(\frac{30 - 22.5}{22.5}\right) \right\rfloor = \lfloor 150 \times 0.333 \rfloor = 50 \text{ pts}$$
- **Total Points Awarded:**
  $$\text{Points} = \lfloor (300 + 50) \times 2.75 \rfloor = \lfloor 350 \times 2.75 \rfloor = \mathbf{962 \text{ pts}}$$

---

## 2. Experience Points (XP) & Leveling Progression

Unlike competitive scores (which can be penalized by hints and errors), **Experience Points (XP)** represent pure learning investment and cumulative effort. XP is never deducted.

### 2.1 XP Yield Table
- **Beginner Question Completed:** $+50 \text{ XP}$
- **Intermediate Question Completed:** $+100 \text{ XP}$
- **Expert Question Completed:** $+150 \text{ XP}$
- **Flawless Stage Bonus:** $+200 \text{ XP}$ (awarded for finishing a 20-question run with $100\%$ accuracy)
- **Daily Challenge Clear:** $+300 \text{ XP}$

### 2.2 Ranks & Level Thresholds
Player ranks represent mastery levels across the system:

| Level | Title | Required Total XP | Unlocked Cosmetic / Benefit |
| :--- | :--- | :--- | :--- |
| **1** | Script Novice | $0 \text{ XP}$ | Base Avatars & Dark Theme |
| **2** | Syntax Apprentice | $250 \text{ XP}$ | Light Theme ("Studio Paper") |
| **3** | Logic Crafter | $600 \text{ XP}$ | Speedrun Mode (20s Timer) |
| **4** | Byte Explorer | $1,200 \text{ XP}$ | Avatar: "Hex Dragon" |
| **5** | Algorithm Ace | $2,000 \text{ XP}$ | Hardcore Mode (3 Hearts) |
| **6** | Pointer Pilot | $3,200 \text{ XP}$ | Custom HUD Amber Flame Glow |
| **7** | Memory Architect | $4,800 \text{ XP}$ | Avatar: "Glitch Bot" |
| **8** | System Sage | $6,800 \text{ XP}$ | Sound Pack: Retro 8-Bit Chiptune |
| **9** | Kernel Master | $9,200 \text{ XP}$ | Holographic Profile Frame |
| **10**| Grandmaster of Code | $12,000 \text{ XP}$ | Crown Badge & Golden Accent Mode |

---

## 3. Campaign Progression & Stage Unlocking

Campaign mode presents a structured curriculum per language:

```
┌─────────────────────────────────────────────────────────────┐
│                       CAMPAIGN PATH                         │
│                                                             │
│   STAGE 1: Beginner Tier (20 Questions)                     │
│      │                                                      │
│      ▼ (Requires >= 70% Accuracy [14/20])                   │
│   STAGE 2: Intermediate Tier (20 Questions)                 │
│      │                                                      │
│      ▼ (Requires >= 75% Accuracy [15/20])                   │
│   STAGE 3: Expert Tier (20 Questions)                       │
│      │                                                      │
│      ▼ (Requires >= 80% Accuracy [16/20])                   │
│   [ LANGUAGE MASTERY BADGE & GRANDMASTER RECOGNITION ]      │
└─────────────────────────────────────────────────────────────┘
```

### 3.1 Star Rating System
At the conclusion of each 20-question stage, stars are awarded based on accuracy:
- **⭐ 1 Star:** $60\% - 74\%$ Accuracy (Passable)
- **⭐⭐ 2 Stars:** $75\% - 89\%$ Accuracy (Proficient)
- **⭐⭐⭐ 3 Stars:** $90\% - 100\%$ Accuracy (Mastery)

---

## 4. Hint & "Second Chance" Retry Flowchart

```
                 [ Question Displayed ]
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      [ Answer Directly ]         [ Request Hint ]
             │                           │
             │                    [ Deduct Hint Penalty ]
             │                    [ Display Pedagogical Clue ]
             │                           │
             ▼                           ▼
     [ Submit Answer ]            [ Submit Answer ]
             │                           │
     ┌───────┴───────┐           ┌───────┴───────┐
     │               │           │               │
  Correct        Incorrect    Correct        Incorrect
     │               │           │               │
  +Points         0 Points    +Points     [ SECOND CHANCE ]
  +Streak         Streak=0    (Penalty)   [ Retry Enabled ]
     │            Proceed        │               │
     │                           │       ┌───────┴───────┐
     │                           │       │               │
     │                           │    Correct        Incorrect
     │                           │       │               │
     │                           │  +50% Base        0 Points
     │                           │  Streak Frozen    Streak=0
     │                           │       │               │
     └───────────────┬───────────┴───────┴───────────────┘
                     ▼
         [ Full Explanation Shown ]
                     │
         [ Proceed to Next Question ]
```

### 4.1 Second Chance Rules
1. A player is eligible for a Second Chance retry **if and only if** they activated a Hint prior to their first incorrect submission.
2. If the Second Chance attempt is answered correctly:
   - $50\%$ of base points are awarded ($A = 0.5$).
   - The streak is **frozen** (neither incremented nor reset to zero).
3. If the Second Chance attempt is answered incorrectly:
   - Zero points are awarded.
   - The streak resets to $0$.
   - Hardcore mode deducts $1$ heart.
   - The correct answer and line-by-line explanation are immediately revealed.

---

## 5. Game Modes & Rules

### 5.1 Mode Comparison Matrix

| Rule | Free Practice | Campaign Mode | Hardcore Mode | Daily Challenge |
| :--- | :--- | :--- | :--- | :--- |
| **Access Gate** | None (All unlocked) | Tiered prerequisites | Unlocks at Level 5 | 1 per calendar day |
| **Questions** | Custom or 20 | Exactly 20 per tier | 20 (any tier) | Exactly 10 (Curated mix) |
| **Lives (Hearts)** | Unlimited ($\infty$) | Unlimited ($\infty$) | Exactly 3 Hearts | Unlimited ($\infty$) |
| **Hints Allowed** | Yes | Yes | **NO (Disabled)** | Yes |
| **Timer Options** | Relaxed/45s/20s | Relaxed/45s/20s | Strict 30s | Standard 45s |
| **Retry on Hint** | Yes | Yes | N/A | Yes |
| **Progress Stored** | High Score only | Stars & Tier Clears | High Score & Survival | Daily Calendar Stamp |

### 5.2 Hardcore Mode Failure Rules
- Player begins with 3 Hearts.
- Failing a question or letting the 30s countdown expire immediately shatters 1 Heart.
- When Hearts reach $0$:
  - The session immediately terminates with **GAME OVER**.
  - All questions answered up to that point retain their earned XP and are recorded in statistics.
  - The final score is recorded as the player's Hardcore survival record.

---

## 6. Deterministic Daily Challenge Algorithm

To ensure every player worldwide receives the exact same set of 10 daily questions without requiring a backend server, SyntaxArena uses a deterministic Pseudo-Random Number Generator (PRNG) seeded with the user's local calendar date.

### 6.1 Mulberry32 PRNG Implementation
```javascript
// Mulberry32 deterministic 32-bit PRNG
function createSeededPRNG(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate calendar seed from YYYY-MM-DD
function getDateSeed(dateString) {
  // Format: '2026-10-19' -> 20261019
  const num = parseInt(dateString.replace(/-/g, ''), 10);
  return num ^ 0x9E3779B9;
}
```

### 6.2 Daily Question Composition
The daily challenge constructs a curated 10-question set:
- **Questions 1 to 4:** Beginner Tier (1 from each language: Python, C, C++, Java).
- **Questions 5 to 8:** Intermediate Tier (1 from each language).
- **Questions 9 to 10:** Expert Tier (2 distinct languages chosen by the PRNG).

---

## 7. Edge Cases & Anti-Tampering Rules

| Scenario | Handled Behavior |
| :--- | :--- |
| **Mid-Game Refresh or Crash** | The game auto-saves state before every question transition. Upon page reload, the user is offered: *"Resume in-progress run (Question 7/20)"* with exact score, remaining hearts, streak, and timer state intact. |
| **Accidental Back Navigation** | The router intercepts hash changes during an active game session with an in-app confirmation modal: *"Abandon run? Your current progress will be forfeited."* |
| **Re-attempting Answered Questions** | Answering the same question multiple times in practice mode never awards duplicate XP or adds duplicate streak points. |
| **Double-Click Spam on Submit** | The submit button is immediately disabled upon the first click event to prevent race conditions and duplicate evaluations. |
| **Timer Expiration** | Reaching `00:00` automatically triggers an incorrect submission event, applies appropriate streak resets/heart losses, and reveals the explanation. |
