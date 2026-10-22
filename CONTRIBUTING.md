# 🤝 Contributing to SyntaxArena

<div align="center">

### Thank you for your interest in contributing to SyntaxArena!
We welcome all kinds of contributions: new question sets, curriculum modules, bug fixes, UI/UX polish, and accessibility enhancements.

</div>

---

## 📜 Table of Contents
1. [Code of Conduct](#-code-of-conduct)
2. [Getting Started](#-getting-started)
3. [Development Workflow](#-development-workflow)
4. [Contributing Questions](#-contributing-questions)
5. [Coding Standards](#-coding-standards)
6. [Testing & Verification](#-testing--verification)
7. [Submitting a Pull Request](#-submitting-a-pull-request)

---

## 🕊️ Code of Conduct

All contributors and maintainers are expected to adhere to our [CODE_OF_CONDUCT.md](file:///d:/programming_game/CODE_OF_CONDUCT.md). Please treat fellow community members with kindness, dignity, and respect.

---

## 🚀 Getting Started

1. **Fork the Repository:** Click the "Fork" button on [GitHub](https://github.com/Bhuvaneshkumar1/Syntax_arena).
2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/<your-username>/Syntax_arena.git
   cd Syntax_arena
   ```
3. **Install dev dependencies (Playwright for testing):**
   ```bash
   npm install
   ```
4. **Launch the local development environment:**
   ```bash
   npx serve .
   # Or using Python:
   python -m http.server 8080
   ```
   Open `http://localhost:8080` in your browser.

---

## 🛠️ Development Workflow

* **Vanilla-First Architecture:** SyntaxArena has **zero** build-time frameworks and **zero** runtime dependencies. Keep code pure, modular, and performant using standard ES Modules (`import`/`export`).
* **Offline Compatibility:** Never introduce external CDN links (`<script src="https://...">`). All icons, fonts, and assets must reside locally in the repository.
* **Deterministic Bundle:** Whenever you modify any file in `js/`, you must rebuild the bundle to keep `js/bundle.js` and `public/` in sync:
  ```bash
  node scripts/build-bundle.js
  ```

---

## 📚 Contributing Questions

SyntaxArena prides itself on pedagogical accuracy and rigorous standard compliance.
When adding questions to `data/*-questions.js`:

1. **Schema Invariant:** Every question must follow the authoritative schema in [docs/QUESTION_SCHEMA.md](file:///d:/programming_game/docs/QUESTION_SCHEMA.md):
   ```javascript
   {
     id: 'py-beg-021',                     // Unique identifier (track-tier-seq)
     track: 'python',                      // Valid track identifier
     difficulty: 'beginner',               // 'beginner' | 'intermediate' | 'expert'
     type: 'mcq',                          // 'mcq' | 'predict_output' | 'find_bug' | 'fill_code'
     prompt: 'What is the output of the following list comprehension?',
     codeSnippet: 'print([x**2 for x in range(3)])',
     options: ['[0, 1, 4]', '[1, 4, 9]', '[0, 1, 2]', 'SyntaxError'],
     correctAnswer: '[0, 1, 4]',
     hint: 'range(3) yields 0, 1, and 2.',
     explanation: 'The range(3) function generates numbers 0, 1, and 2. Squaring each yields 0, 1, and 4.',
     tags: ['comprehensions', 'operators']
   }
   ```
2. **Zero Undefined Behavior:** Do not include questions relying on compiler-specific quirks or undefined behavior without explicitly framing the context.
3. **Thorough Explanations:** Every question must include a clear, educational explanation explaining *why* the correct answer is right and why the common distractors are incorrect.

---

## 🎨 Coding Standards

* **Vanilla Modern JavaScript:** Use clean ES2024+ features (optional chaining, destructuring, nullish coalescing).
* **CSS Custom Properties:** Use design system tokens defined in `css/tokens.css` (e.g. `var(--color-primary)`, `var(--space-4)`, `var(--font-mono)`). Avoid arbitrary hardcoded pixel or hex values.
* **Semantic HTML5:** Maintain proper heading hierarchy (`h1` -> `h2` -> `h3`), ARIA landmark roles, and accessible labels.
* **Safe DOM Utilities:** Use `Utils.escapeHTML()` for any dynamic string interpolation to eliminate cross-site scripting risks.

---

## 🧪 Testing & Verification

Before submitting any pull request, ensure **all tests pass**:

```bash
# 1. Run all 521 repository unit tests
npm test

# 2. Run Playwright E2E browser test suites
node tests/test-sandbox-languages-playwright.js
node tests/test-daily-gauntlet-playwright.js
node tests/test-ghost-duel-playwright.js
node tests/test-memory-inspector-playwright.js

# 3. Check JS syntax across all files
node -c (Get-ChildItem js/*.js).FullName

# 4. Rebuild bundle and sync to public/
node scripts/build-bundle.js
```

---

## 📬 Submitting a Pull Request

1. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Commit your changes with descriptive, conventional commit messages:
   ```bash
   git commit -m "feat(arena): add new sound effect for speed duel"
   ```
3. Push to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
4. Open a Pull Request against the `main` branch of `Syntax_arena`.
5. Fill out the Pull Request template detailing your changes and test results.

Thank you for helping SyntaxArena become the finest coding game on the web! 🚀
