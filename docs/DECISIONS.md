# Architectural Decisions & Risk Log: SyntaxArena

## 1. Architectural Decision Records (ADRs)

### ADR-01: Pure Static Single-Page Application (SPA) vs. Multi-HTML Files
- **Status:** **ACCEPTED**
- **Context:** The application requires zero backend services, zero build toolchains, and must run identically from a local filesystem (`file://`) or a static web server (GitHub Pages, Nginx).
- **Decision:** Architect SyntaxArena as a unified single-page application using client-side hash routing (`window.location.hash`), native ES2022 JavaScript modules, and dynamic view rendering.
- **Consequences:** Eliminates page reload latency, maintains in-memory audio contexts and active session states across screen changes, and ensures 100% offline functionality.

---

### ADR-02: Zero External Bundlers or Package Managers
- **Status:** **ACCEPTED**
- **Context:** Frameworks (React, Vue) and bundlers (Webpack, Vite) introduce dependency vulnerabilities, build failures, and violate the non-negotiable technology constraints.
- **Decision:** Write 100% vanilla ECMAScript modules and native CSS custom properties without npm, node, or transpilations.
- **Consequences:** Immediate startup speed, zero supply-chain security risks, and lifetime code stability without dependency deprecation.

---

### ADR-03: Procedural Web Audio API Synthesis vs. Static MP3 Audio Assets
- **Status:** **ACCEPTED**
- **Context:** Audio adds immense tactile satisfaction (arcade feedback, streak flames, chime on success). However, loading external `.mp3` or `.wav` files causes network latency, 404 broken link risks on offline runs, and CORS restrictions when executed via `file://`.
- **Decision:** Implement a procedural sound synthesizer in `js/engine/audio.js` using the native browser `AudioContext`. All clicks, chimes, buzzes, and fanfares are generated via mathematical oscillators, gain nodes, and biquad filters.
- **Consequences:** 
  - Zero asset file size (0 KB download).
  - 100% offline resilience and zero CORS errors.
  - Zero playback latency.
  - Easily customizable pitches and envelopes.

---

### ADR-04: Deterministic Seeded PRNG for Daily Challenges vs. Backend API
- **Status:** **ACCEPTED**
- **Context:** Daily challenges in typical web games query a centralized database server for the "daily puzzle". SyntaxArena is strictly client-side with no backend.
- **Decision:** Implement the 32-bit **Mulberry32 PRNG** algorithm in `js/engine/prng.js`, seeded by the calendar date string (`YYYYMMDD` formatted).
- **Consequences:** Every user worldwide on any given calendar date receives the exact same 10-question sequence, enabling organic community discussions and social comparisons without a single line of backend code.

---

### ADR-05: Pre-Compiled Output Verification vs. Client-Side Code Execution Sandbox
- **Status:** **ACCEPTED**
- **Context:** Evaluating user-submitted code dynamically (especially for compiled languages like C, C++, and Java) would either require a remote compiler backend (prohibited) or heavy WebAssembly runtimes (e.g., CheerpOS, TeaVM, Pyodide) which are multi-megabyte downloads, slow to boot, and prone to runtime memory leaks.
- **Decision:** Pre-compute and certify all 240 question solutions, outputs, and bug lines into static JSON structures verified against official language standards (C99, C++20, Python 3.11, Java 17).
- **Consequences:** Instantaneous sub-millisecond answer evaluation, zero client CPU freeze, zero memory footprint, and 100% security against arbitrary code execution.

---

### ADR-06: Inline SVG Sprite System vs. Font Icon CDNs
- **Status:** **ACCEPTED**
- **Context:** Icon font CDNs (FontAwesome, Material Icons, Lucide CDN) require active internet connectivity and risk Flash of Unstyled Text (FOUT) or broken icons offline.
- **Decision:** Embed all application icons directly as `<svg><symbol id="..."></symbol></svg>` definitions inside `index.html`.
- **Consequences:** Guaranteed immediate offline rendering, precise pixel control, customizable stroke and fill colors via CSS custom properties, and zero network requests.

---

### ADR-07: Single-Retry Flow Coupled to Pedagogical Hint Activation
- **Status:** **ACCEPTED**
- **Context:** Infinite retries trivialize multiple-choice questions by process of elimination. Zero retries make mistakes frustrating and discourage using educational hints.
- **Decision:** A player is granted exactly **one** "Second Chance" retry on an incorrect submission **if and only if** they activated a Hint prior to answering. Correctly answering on a retry awards 50% base points and freezes the streak.
- **Consequences:** Promotes reading the pedagogical hint, softens honest mistakes, prevents brute-force guessing, and maintains high challenge integrity.

---

### ADR-08: 240-Question Strict Content Matrix
- **Status:** **ACCEPTED**
- **Context:** The specification mandates 4 languages (Python, C, C++, Java), 3 tiers (Beginner, Intermediate, Expert), with exactly 20 questions per tier.
- **Decision:** Hardcode the inventory quota to exactly 60 questions per language (Total: 240 questions).
- **Consequences:** Enforces rigorous curriculum balance, predictable stage lengths (20 questions per tier), and uniform progression criteria across all 4 language tracks.

---

## 2. Explicit Assumptions

1. **Target Browsers:** Evergreen desktop and mobile browsers (Chrome/Chromium $\ge 90$, Firefox $\ge 88$, Safari $\ge 15$, Edge $\ge 90$). All support ES2022, CSS Custom Properties, CSS Grid, Flexbox, and Web Audio API.
2. **Storage Quotas:** Standard browser `localStorage` provides at least $5 \text{ MB}$ of storage space per origin. SyntaxArena's data model consumes $< 50 \text{ KB}$ ($< 1\%$ quota).
3. **Execution Environment:** Compatible with both local filesystem access (`file://`) and any static web server (`http://`, `https://`).
4. **Offline Capability:** Once files are saved locally or cached by browser, the entire game operates with zero internet connectivity.

---

## 3. Unresolved Issues & Pre-Implementation Risks

| Risk / Issue | Severity | Proposed Mitigation in Implementation |
| :--- | :--- | :--- |
| **1. Syntax Highlighting Tokenization Bloat** | Low | Instead of importing heavyweight syntax highlighters (Prism.js or Highlight.js), implement a lean, regex-based micro-tokenizer (`codeViewer.js`, $< 120$ lines) specifically tailored to the keywords and literals of Python, C, C++, and Java. |
| **2. Mobile Drag & Drop Ergonomics** | Medium | Drag-and-drop for "Fill-in-the-Code" can be clumsy on 360px smartphone screens. The component will support **dual interaction modes**: drag-and-drop on desktop mouse pointers, and simple tap-to-select / tap-to-slot on mobile touch screens. |
| **3. Browser LocalStorage Clearing** | Low | Browsers can clear `localStorage` if users wipe history or enter private browsing. The Settings view will feature a prominent **[Export Save Data]** button to let users back up their career profile as a `.json` file anytime. |
| **4. Accidental Back Button Navigation** | Low | Native browser back button can discard an active session. The hash router will install a `window.onbeforeunload` guard and intercept hash transitions when `state.session.inProgress === true`. |
