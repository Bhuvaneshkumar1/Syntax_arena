# Software Architecture & Engineering Blueprint: SyntaxArena

## 1. Architectural Strategy & Constraints

SyntaxArena is architected as an ultra-fast, zero-dependency, static Multi-Page Application (MPA) running entirely in the client's browser engine. It executes natively via standard web platform primitives (HTML5, CSS3, ES2022+ JavaScript) without requiring Node.js, compilation steps, package managers, or server-side execution. Each page (`index.html`, `game.html`, `results.html`, `progress.html`, `settings.html`) shares a centralized design system, utility library, and reactive state synchronized through browser `localStorage`.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BROWSER RUNTIME ENGINE                          │
├───────────────────┬───────────────────┬────────────────────────────────┤
│   DOM / HTML5     │    VANILLA CSS3   │      VANILLA ES2022+ JS        │
│ (Multi-Page Shell)│ (Centralized CSS) │     (Modular ES Modules)       │
├───────────────────┴───────────────────┴────────────────────────────────┤
│                     UNIFIED APPLICATION LAYER                          │
│                                                                        │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐   │
│   │ Native Router│◄───►│ Reactive App │◄───►│ Game Engine & Rules  │   │
│   │ (MPA Nav)    │     │ Store (State)│     │ (Batch 4/5 Logic)    │   │
│   └──────────────┘     └──────┬───────┘     └──────────────────────┘   │
│                               │                                        │
│                               ▼                                        │
│   ┌───────────────────────────────────┐     ┌──────────────────────┐   │
│   │ Storage Manager (Local Persistence│     │ Web Audio Synthesizer│   │
│   │  JSON Serializer / Checksum / Migr│     │ (Zero External Audio)│   │
│   └─────────────────┬─────────────────┘     └──────────────────────┘   │
└─────────────────────┼──────────────────────────────────────────────────┘
                      ▼
         [ Browser localStorage API ]
```

---

## 2. Directory & File Organization (Implemented)

The implemented project structure prioritizes high modularity, separation of concerns, and zero build tool overhead:

```
d:/programming_game/
├── index.html                   # Hub & landing page
├── game.html                    # Active challenge arena
├── results.html                 # Post-run results & performance analytics
├── progress.html                # Career progression & trophy room
├── settings.html                # Audio, visual, profile & storage settings
├── css/
│   ├── tokens.css               # Centralized design tokens & theme custom properties
│   ├── styles.css               # Resets, baseline typography, focus & scrollbars
│   ├── layout.css               # Header navigation, shell containers, footer
│   ├── components.css           # Tactile 3D buttons, cards, badges, dialogs, toasts
│   ├── animations.css           # Micro-interactions, keyframes & reduced-motion
│   └── responsive.css           # Breakpoint overrides (tablet, mobile portrait/landscape)
├── js/
│   ├── app.js                   # Application bootstrapper and shell coordinator
│   ├── router.js                # Multi-page navigation coordinator and guards
│   ├── state.js                 # Reactive Pub/Sub state store
│   ├── storage.js               # Safe localStorage manager, schema v1, recovery
│   ├── profile.js               # Profile models, username validation, avatar catalog
│   ├── ui.js                    # DOM presentation helpers, modals, and toasts
│   └── utils.js                 # Reusable DOM, string escaping, and math utilities
├── assets/
│   ├── icons/
│   │   └── icons.svg            # Embedded SVG sprite definitions
│   ├── images/                  # Avatar and graphic assets
│   └── audio/                   # Audio asset placeholder (synthesizer is procedural)
└── docs/                        # Planning, specifications, and architecture docs
```

---

## 3. Multi-Page Navigation & Routing Architecture

### 3.1 Multi-Page Foundation
SyntaxArena leverages standard browser multi-page navigation for maximum robustness, bookmarkability, and native back/forward history support:

```
Available Pages:
├── index.html       - Hub, language track selection, mode picker
├── game.html        - Active challenge arena, HUD, code terminal
├── results.html     - Stage completion scorecard, review drawer
├── progress.html    - Career progression roadmap, achievements
└── settings.html    - Audio controls, theme selection, export/import JSON
```

### 3.2 Navigation Guards & State Interception
1. **Unsaved Run Protection:** If an active session is in progress when the user attempts to navigate away from `#/game`, the router halts the navigation and triggers a tactile confirmation modal:
   - *"Active game in progress. Abandoning will count as a forfeit in Hardcore mode. Leave anyway?"*
2. **Auto-Save on Transition:** Every question transition automatically commits an atomic snapshot of the active game session to `localStorage`.
3. **Crash & Refresh Recovery:** Upon booting `app.js`, if an active session exists in storage, the user is presented with a persistent recovery banner allowing one-click resumption directly to the exact question.

---

## 4. Reactive State Store (Vanilla Pub/Sub Pattern)

The application utilizes a lightweight, zero-dependency reactive state container implementing the Observer / Pub-Sub pattern (~80 lines of clean ES2022 JavaScript).

```javascript
// Conceptual Architecture of js/state/store.js
export class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.subscribers = new Map();
  }

  getState() {
    return this.state;
  }

  setState(slice, patch) {
    const prevState = { ...this.state };
    this.state = {
      ...this.state,
      [slice]: { ...this.state[slice], ...patch }
    };
    this._notify(slice, this.state[slice], prevState[slice]);
  }

  subscribe(slice, callback) {
    if (!this.subscribers.has(slice)) {
      this.subscribers.set(slice, new Set());
    }
    this.subscribers.get(slice).add(callback);
    return () => this.subscribers.get(slice).delete(callback);
  }

  _notify(slice, current, prev) {
    if (this.subscribers.has(slice)) {
      this.subscribers.get(slice).forEach(cb => cb(current, prev));
    }
  }
}
```

### 4.1 State Slice Decomposition
- **`profile`**: Current user profile ID, username, selected avatar, level, total XP, current rank title.
- **`settings`**: Theme (`dark` | `light`), sound volume ($0.0 - 1.0$), music volume ($0.0 - 1.0$), reduced-motion override.
- **`session`**: Active game mode, selected language, difficulty tier, question pool, current index, score, streak, hearts remaining, hints used, timer state.
- **`campaign`**: Unlocked tiers per language, stars earned per stage ($0 - 3$).
- **`stats`**: Total questions answered, correct count, accuracy rate, best streak, questions answered by language/topic.
- **`achievements`**: Array of unlocked achievement IDs with timestamp.

---

## 5. Local Storage Data Architecture & Schema

All persistent game data is stored in the browser's `localStorage` under a single namespaced key: `syntaxarena_storage_v1`.

### 5.1 Storage JSON Schema
```json
{
  "version": 1,
  "activeProfileId": "prof-9b1deb4d",
  "profiles": [
    {
      "id": "prof-9b1deb4d",
      "username": "CodeNinja",
      "avatarId": "cyber_fox",
      "createdAt": 1729350000000,
      "level": 4,
      "xp": 1450,
      "rank": "Byte Explorer",
      "stats": {
        "gamesPlayed": 12,
        "questionsAttempted": 240,
        "questionsCorrect": 204,
        "highestStreak": 14,
        "dailyChallengesCompleted": 5,
        "lastDailyDate": "2026-10-19"
      },
      "campaign": {
        "python": { "beginnerStars": 3, "intermediateStars": 2, "expertStars": 0, "unlockedTier": "expert" },
        "c": { "beginnerStars": 3, "intermediateStars": 1, "expertStars": 0, "unlockedTier": "intermediate" },
        "cpp": { "beginnerStars": 2, "intermediateStars": 0, "expertStars": 0, "unlockedTier": "intermediate" },
        "java": { "beginnerStars": 3, "intermediateStars": 3, "expertStars": 2, "unlockedTier": "expert" }
      },
      "unlockedAchievements": [
        "first_blood",
        "streak_master_5",
        "streak_master_10",
        "python_adept"
      ],
      "missedQuestionIds": [
        "c-exp-012",
        "py-int-009"
      ]
    }
  ],
  "activeSession": null,
  "settings": {
    "theme": "dark",
    "sfxVolume": 0.8,
    "musicVolume": 0.5,
    "reducedMotion": false
  }
}
```

### 5.2 Storage Integrity, Quota & Data Recovery
1. **Size Footprint:** The complete profile, campaign history, and stats payload occupies $\approx 45 \text{ KB}$, well within the browser's standard $5 \text{ MB}$ quota ($< 1\%$).
2. **Corruption Defense:** When loading from `localStorage`, the JSON string is parsed within a safe `try / catch` boundary. If invalid or corrupted JSON is detected:
   - The corrupted payload is backed up to `syntaxarena_corrupted_backup`.
   - The user is notified via an alert modal: *"Saved data was corrupted. System restored default settings while preserving a raw backup."*
   - Safe factory defaults are instantiated automatically.
3. **Export & Import Backup:** Settings view provides:
   - **[Export Save Data (JSON)]**: Generates an encrypted/clean downloadable `syntaxarena_backup_YYYYMMDD.json` file.
   - **[Import Save Data]**: Uses the browser's native `FileReader` API to parse and validate uploaded JSON before applying it.

---

## 6. Procedural Web Audio Engine (Zero External Audio Assets)

To eliminate network latency, CDN 404 failures, and cross-origin audio blocking, SyntaxArena generates all sound effects procedurally in real-time using the browser's native **Web Audio API** (`AudioContext`).

```
┌───────────────────────────────────────────────────────────────┐
│                    WEB AUDIO SYNTHESIZER                      │
│                                                               │
│   [AudioContext] ──► [OscillatorNode] ──► [GainEnvelope] ──► [Master Gain] ──► [Speakers]
│    (Sine/Square)      (Frequency Sweep)    (Decay Curve)       (Volume Mute)
└───────────────────────────────────────────────────────────────┘
```

### 6.1 Procedural Sound Effects Synthesizer Specs
- **Button Click / Tap:** Short 12ms sinusoidal click ($800\text{Hz} \to 200\text{Hz}$, rapid exponential decay).
- **Correct Answer Chime:** Bright, pleasant major chord arpeggio (C6 $1046.5\text{Hz}$ followed by G6 $1567.9\text{Hz}$ with soft bell envelope).
- **Error Buzz:** Low discordant sawtooth wave ($150\text{Hz} \to 110\text{Hz}$ with low-pass filter).
- **Streak Multiplier Flame Whoosh:** Pitch-rising frequency sweep ($300\text{Hz} \to 1200\text{Hz}$) with gentle resonance.
- **Timer Heartbeat Alert:** Sub-bass dual thump ($80\text{Hz}$, $40\text{ms}$ duration) simulating tense physical pulse.
- **Victory Fanfare:** 4-note ascending fanfare ($C5 \to E5 \to G5 \to C6$) with rich harmonic overtones.

### 6.2 Browser Autoplay Compliance
In accordance with modern browser autoplay policies (Chrome, Safari, Firefox), the `AudioContext` remains suspended until the user's very first click or keyboard interaction, at which point `audioCtx.resume()` is executed smoothly. No sound ever plays without prior user consent.
