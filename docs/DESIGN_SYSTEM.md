# Design System: SyntaxArena "Playful Studio"

## 1. Visual Identity & Aesthetic Philosophy

### 1.1 The "Playful Studio" Aesthetic
SyntaxArena adopts an original **Playful Studio** design aesthetic that bridges two distinct design worlds:
1. **The Precision Developer Tool:** Monospaced typography, syntax tokens, crisp 1px borders, subtle grid overlays, and deep charcoal/slate canvas backgrounds.
2. **The Tactile Physical Arcade:** Saturated punchy accent colors, pushable 3D beveled buttons with physical depth offset, bouncy spring-based feedback animations, chunky status badges, and satisfying auditory chimes.

### 1.2 Anti-Patterns Strictly Avoided
- **No Generic Purple-on-Black AI Gradients:** Replaced with deliberate semantic palettes (Electric Cyan, Terminal Emerald, Cyber Amber, Coral Red, and Royal Indigo).
- **No Indiscriminate Glassmorphism:** Opaque, high-contrast, tactile card surfaces with crisp physical edges rather than blurry unreadable frosted glass.
- **No Repetitive Cookie-Cutter Rounded Cards:** Cards have structural character: terminal header bars, status pips, language accent flags, and distinct interactive borders.
- **No Emoji Used as Icons:** All icons are custom, inline geometric SVGs with consistent 2px stroke weights and crisp vector geometry.
- **No Unresponsive Bloat:** Instant zero-friction rendering with native CSS custom properties.

---

## 2. Color System & Design Tokens

### 2.1 Design Philosophy: Surface vs. Edge Pairs
To create the signature pushable tactile depth (like arcade hardware and polished indie titles), every interactive element defines a **Surface Color** and a corresponding darker **Edge / Depth Color**. When a button or card is pressed, the element translates down in the Y-axis while its shadow collapses into the edge.

```
       UNPRESSED (RESTING)                     PRESSED (ACTIVE)
 ┌──────────────────────────────┐       
 │         Surface Color        │       
 ├──────────────────────────────┤       ┌──────────────────────────────┐
 │          Edge Color          │  ──►  │         Surface Color        │ (Translated +3px)
 └──────────────────────────────┘       └──────────────────────────────┘ (Edge collapsed)
   [shadow: 0 4px 0 var(--edge)]          [shadow: 0 1px 0 var(--edge)]
```

### 2.2 Core Palette & CSS Custom Properties

```css
:root {
  /* ==========================================================================
     CANVAS & SURFACE HIERARCHY (DARK MODE - DEFAULT)
     ========================================================================== */
  --bg-app:            #0B0F17; /* Deep midnight void */
  --bg-surface-base:   #111827; /* Ground level containers */
  --bg-surface-raised: #1A2234; /* Elevated cards and panels */
  --bg-surface-overlay:#243048; /* Floating modals, tooltips, drawers */
  --bg-code-terminal:  #080C14; /* Deep recessed console background */

  /* BORDERS & DIVIDERS */
  --border-subtle:     #1F2B3E; /* Muted card borders */
  --border-strong:     #33435C; /* Active boundaries and headers */
  --border-focus:      #00E5FF; /* High-visibility keyboard outline */

  /* TYPOGRAPHIC INK */
  --text-primary:      #F8FAFC; /* Crisp heading and active text */
  --text-secondary:    #94A3B8; /* Explanations, metadata, labels */
  --text-muted:        #64748B; /* Inactive states, line numbers */
  --text-inverse:      #0B0F17; /* Text on bright accent buttons */

  /* ==========================================================================
     TACTILE ARCADE ACCENTS (SURFACE + 3D EDGE PAIRS)
     ========================================================================== */
  /* Primary Action: Electric Cyan */
  --color-primary:        #00E5FF;
  --color-primary-edge:   #0097A7;
  --color-primary-hover:  #33ECFF;
  --color-primary-glow:   rgba(0, 229, 255, 0.25);

  /* Success & Affirmation: Terminal Emerald */
  --color-success:        #10B981;
  --color-success-edge:   #047857;
  --color-success-hover:  #34D399;
  --color-success-glow:   rgba(16, 185, 129, 0.25);

  /* Warning & Caution: Cyber Amber */
  --color-warning:        #F59E0B;
  --color-warning-edge:   #B45309;
  --color-warning-hover:  #FBBF24;
  --color-warning-glow:   rgba(245, 158, 11, 0.25);

  /* Danger & Error: Coral Flare */
  --color-danger:         #EF4444;
  --color-danger-edge:    #B91C1C;
  --color-danger-hover:   #F87171;
  --color-danger-glow:    rgba(239, 68, 68, 0.25);

  /* Streak Flame: Neon Violet */
  --color-violet:         #8B5CF6;
  --color-violet-edge:    #6D28D9;
  --color-violet-hover:   #A78BFA;
  --color-violet-glow:    rgba(139, 92, 246, 0.25);

  /* Neutral Tactile Button */
  --color-neutral:        #1E293B;
  --color-neutral-edge:   #0F172A;
  --color-neutral-hover:  #334155;

  /* ==========================================================================
     LANGUAGE BRAND COLORS
     ========================================================================== */
  --lang-python:          #3776AB;
  --lang-python-accent:   #FFD438;
  --lang-c:               #555555;
  --lang-c-accent:        #659AD2;
  --lang-cpp:             #00599C;
  --lang-cpp-accent:      #004482;
  --lang-java:            #EA2D2E;
  --lang-java-accent:     #F89820;

  /* ==========================================================================
     CODE SYNTAX HIGHLIGHTING TOKENS
     ========================================================================== */
  --syn-keyword:          #FF7B72; /* def, return, if, class */
  --syn-type:             #79C0FF; /* int, void, String, auto */
  --syn-function:         #D2A8FF; /* printf, append, malloc */
  --syn-string:           #A5D6FF; /* "hello world", 'token' */
  --syn-number:           #FFA657; /* 42, 0xFF, 3.14 */
  --syn-comment:          #8B949E; /* // comment, # comment */
  --syn-operator:         #F0883E; /* +, -, *, ->, :: */
  --syn-bracket:          #F8FAFC; /* {}, [], () */
}
```

### 2.3 Light Theme ("Studio Paper" Mode)
SyntaxArena provides a high-contrast, distraction-free daylight mode that maintains the tactile arcade feel without blinding glare.

```css
[data-theme="light"] {
  --bg-app:            #F8FAFC; /* Soft clean paper canvas */
  --bg-surface-base:   #FFFFFF; /* Pure white containers */
  --bg-surface-raised: #F1F5F9; /* Subtle warm grey panels */
  --bg-surface-overlay:#E2E8F0; /* Popovers and floating menus */
  --bg-code-terminal:  #0F172A; /* Code block remains dark for high contrast */

  --border-subtle:     #E2E8F0;
  --border-strong:     #CBD5E1;
  --border-focus:      #0284C7;

  --text-primary:      #0F172A;
  --text-secondary:    #475569;
  --text-muted:        #94A3B8;
  --text-inverse:      #FFFFFF;

  --color-primary:        #0284C7;
  --color-primary-edge:   #0369A1;
  --color-primary-hover:  #0EA5E9;

  --color-neutral:        #F1F5F9;
  --color-neutral-edge:   #CBD5E1;
  --color-neutral-hover:  #E2E8F0;
}
```

---

## 3. Typography & Scale

### 3.1 Typeface Selection
- **Display & Headings:** `Outfit` / `Space Grotesk` (Geometric, punchy, charismatic, modern tech feel).
- **Body & Controls:** `Inter` (Industry-standard legibility, crisp small-size rendering).
- **Code & Numbers:** `JetBrains Mono` / `Fira Code` (Distinguishable 0/O, 1/l, ligature-ready arrows, strict tabular numbers).

Fallback Stack:
```css
--font-display: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-body:    'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
```

### 3.2 Modular Scale & Typographic Hierarchy

| Token | Size | Line Height | Weight | Letter Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--text-xs` | 0.75rem (12px) | 1.0rem | 500 / 600 | +0.05em | Badges, tags, HUD labels, line numbers |
| `--text-sm` | 0.875rem (14px) | 1.25rem | 400 / 500 | +0.01em | Code explanations, secondary buttons, tooltips |
| `--text-base` | 1.0rem (16px) | 1.5rem | 400 / 600 | 0 | Body copy, question prompts, option choices |
| `--text-lg` | 1.125rem (18px) | 1.625rem | 600 / 700 | -0.01em | Subheadings, card titles, streak counters |
| `--text-xl` | 1.25rem (20px) | 1.75rem | 700 | -0.02em | Section titles, score tally headers |
| `--text-2xl` | 1.5rem (24px) | 2.0rem | 800 | -0.02em | Modal headers, tier banners |
| `--text-3xl` | 2.0rem (32px) | 2.5rem | 800 | -0.03em | Stage complete headers, major milestones |
| `--text-4xl` | 2.5rem (40px) | 3.0rem | 900 | -0.04em | Landing Hero title, Grade S/A display |

---

## 4. Spacing, Borders, Shadows & Layout Tokens

```css
:root {
  /* SPACING SCALE */
  --space-1:  0.25rem; /* 4px */
  --space-2:  0.5rem;  /* 8px */
  --space-3:  0.75rem; /* 12px */
  --space-4:  1.0rem;  /* 16px */
  --space-5:  1.25rem; /* 20px */
  --space-6:  1.5rem;  /* 24px */
  --space-8:  2.0rem;  /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3.0rem;  /* 48px */

  /* CORNER RADII */
  --radius-sm:  0.375rem; /* 6px - Pills, tags, badges */
  --radius-md:  0.625rem; /* 10px - Code blocks, inputs, options */
  --radius-lg:  0.875rem; /* 14px - Interactive cards, major buttons */
  --radius-xl:  1.25rem;  /* 20px - Floating modals, drawers */
  --radius-full:9999px;   /* Pills, circle avatars */

  /* 3D TACTILE SHADOWS */
  --shadow-tactile-sm:  0 2px 0;
  --shadow-tactile-md:  0 4px 0;
  --shadow-tactile-lg:  0 6px 0;
  --shadow-depressed:   0 1px 0;

  /* ELEVATION AMBIENT SHADOWS */
  --shadow-elevation-card:  0 4px 20px -2px rgba(0, 0, 0, 0.4);
  --shadow-elevation-modal: 0 16px 48px -4px rgba(0, 0, 0, 0.7);
}
```

---

## 5. Component Specifications

### 5.1 The Tactile 3D Button Component
All core buttons possess physical tactile depression.

```css
.btn-arcade {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0.75rem 1.5rem;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-lg);
  border: 2px solid;
  cursor: pointer;
  user-select: none;
  transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.12s cubic-bezier(0.34, 1.56, 0.64, 1),
              background-color 0.15s ease;
}

/* Primary Variant */
.btn-primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary-edge);
  color: var(--text-inverse);
  box-shadow: var(--shadow-tactile-md) var(--color-primary-edge);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-tactile-lg) var(--color-primary-edge);
  background-color: var(--color-primary-hover);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: var(--shadow-depressed) var(--color-primary-edge);
}

.btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

### 5.2 Code Terminal Viewer Component
- **Header Bar:** Displays current language pill, filename mockup (`solution.py`), and character length.
- **Line Numbers:** Recessed left column, unselectable (`user-select: none`), strictly aligned with code text.
- **Horizontal Scroll:** Overflow handles smoothly with a custom sleek scrollbar.

```html
<div class="code-terminal" data-lang="c">
  <div class="terminal-bar">
    <div class="terminal-dots">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
    </div>
    <div class="terminal-title">pointers_expert.c</div>
    <span class="lang-pill c">C99</span>
  </div>
  <pre class="terminal-code"><code><span class="line-num">01</span><span class="syn-keyword">int</span> a = <span class="syn-number">10</span>, *p = &a;
<span class="line-num">02</span><span class="syn-keyword">int</span> **pp = &p;
<span class="line-num">03</span>**pp += <span class="syn-number">5</span>;
<span class="line-num">04</span><span class="syn-function">printf</span>(<span class="syn-string">"%d\n"</span>, a);</code></pre>
</div>
```

### 5.3 Interactive Question Format Layouts

#### Format 1: Multiple Choice & Output Prediction (Choice Cards)
- Grid layout with 4 distinct options.
- Keyboard shortcut badge (`1`, `2`, `3`, `4` or `A`, `B`, `C`, `D`).
- Selected state turns border cyan with a check indicator.
- Correct state flashes emerald green; incorrect state flashes coral red with horizontal shake.

#### Format 2: Find the Bug (Line Inspection Layout)
- Every code line in the terminal is rendered as a clickable interactive row.
- Hovering over a line displays a subtle target bug crosshair.
- Selecting a line marks it with a glowing bug pin icon and highlights the entire code line.

#### Format 3: Fill in the Missing Code (Interactive Token Slotting)
- The code snippet contains highlighted blank slots (`[ ___ SLOT 1 ___ ]`).
- A "Token Bank" tray below offers draggable or clickable code chips (e.g., `yield`, `self.__init__`, `nullptr`, `super()`).
- Clicking or dropping a token into the active slot snaps it in place with a tactile spring animation.
- Clicking an assigned slot returns the token back to the tray.

### 5.4 The Arcade HUD (Heads-Up Display)
Fixed or sticky top component featuring:
1. **Language Pill & Question Step Counter:** e.g., `C++ • 08/20`
2. **Progress Rail:** Thin 6px bar with segment dividers showing answered questions and their outcomes (green dot, red dot, active pulsing dot).
3. **Hardcore Lives (Hearts):** 3 SVG hearts that shatter/fade to grey upon taking damage.
4. **Streak Multiplier Gauge:** Animated flame badge displaying `x1.0` through `x3.0` with dynamic particle sparks at maximum streak.
5. **Score Ticker:** Tabular numbers with rolling odometer animation.
6. **Countdown Timer:** Circular or horizontal bar transitioning from cyan (`> 50%`), to yellow (`25-50%`), to flashing red with heartbeat pulsation (`< 25%`).

---

## 6. Cohesive SVG Icon System

SyntaxArena utilizes an embedded SVG sprite library with a unified design language:
- Standard 24x24 viewBox.
- 2px stroke width with rounded stroke-linecap and stroke-linejoin.
- Consistent geometric radius and optical alignment.

```html
<!-- Core SVG Icons (Embedded in index.html for zero network requests) -->
<svg style="display:none;" xmlns="http://www.w3.org/2000/svg">
  <!-- Heart / Life -->
  <symbol id="icon-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </symbol>

  <!-- Flame / Streak -->
  <symbol id="icon-flame" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </symbol>

  <!-- Lightbulb / Hint -->
  <symbol id="icon-bulb" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </symbol>

  <!-- Bug / Debug -->
  <symbol id="icon-bug" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="8" height="14" x="8" y="6" rx="4"/>
    <path d="m19 7-3 2"/>
    <path d="m5 7 3 2"/>
    <path d="m19 19-3-2"/>
    <path d="m5 19 3-2"/>
    <path d="M20 13h-4"/>
    <path d="M4 13h4"/>
    <path d="m10 4 1 2"/>
    <path d="m14 4-1 2"/>
  </symbol>

  <!-- Clock / Timer -->
  <symbol id="icon-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </symbol>

  <!-- Trophy / Achievements -->
  <symbol id="icon-trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </symbol>
</svg>
```

---

## 7. Motion, Physics & Micro-interactions

### 7.1 Keyframe Animations
All animations emphasize snappy, punchy feedback that never delays or obstructs user input.

```css
/* Card Pop on Correct Submission */
@keyframes cardSuccessPop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.03) translateY(-4px); }
  100% { transform: scale(1) translateY(0); }
}

/* Horizontal Shake on Error */
@keyframes cardErrorShake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

/* Pulsing Timer Critical Warning (< 25% remaining) */
@keyframes timerPulse {
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 4px var(--color-danger)); }
  50%      { opacity: 0.6; filter: drop-shadow(0 0 12px var(--color-danger)); }
}

/* Heart Shatter Animation */
@keyframes heartLost {
  0%   { transform: scale(1); opacity: 1; }
  30%  { transform: scale(1.3) rotate(-15deg); color: var(--color-danger); }
  100% { transform: scale(0.7) translateY(10px); opacity: 0.2; filter: grayscale(1); }
}
```

### 7.2 Accessibility: Reduced-Motion Rule
When the operating system requests reduced motion, transitions switch to instantaneous opacity changes without translation or shaking.

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .btn-arcade:hover,
  .btn-arcade:active {
    transform: none !important;
  }
}
```

---

## 8. Responsive Strategy & Breakpoint Specifications

```
Breakpoints:
├── Mobile Portrait:  <= 640px    (Single column, pinned sticky action bar, collapsible code drawer)
├── Mobile Landscape: <= 840px (height <= 500px) (Split view, compact HUD)
├── Tablet:           641px - 1024px (Comfortable vertical stack, full terminal width)
└── Desktop:          >= 1025px   (Side-by-side split screen: Code Terminal on Left, Options on Right)
```

### 8.1 Desktop Layout (`>= 1025px`)
- **Split Arena Layout:** 
  - Left Column (55% width): Fixed-height code terminal with line numbers and prompt.
  - Right Column (45% width): Interaction panel containing options, hint button, and submit action.
- Maximizes screen efficiency and minimizes vertical eye travel.

### 8.2 Tablet Layout (`641px - 1024px`)
- Vertical stacked layout.
- Code terminal expands to 100% container width with comfortable line height (1.6).
- 2x2 grid for multiple-choice options.

### 8.3 Mobile Portrait (`<= 640px`)
- **Vertical Flow with Sticky Actions:**
  - HUD is condensed into a slim 48px sticky header.
  - Code block font scales down from 14px to 12.5px with horizontal scroll guard.
  - Option cards stack vertically with minimum 48px touch height.
  - The "Submit" and "Hint" buttons are pinned into a sticky bottom navigation bar with `safe-area-inset-bottom` support for modern smartphones.

### 8.4 Mobile Landscape (Low Vertical Height)
- When viewport height is $\le 500\text{px}$:
  - HUD elements compress to a single row.
  - Code snippet and options sit side-by-side to eliminate unnecessary vertical scrolling.
