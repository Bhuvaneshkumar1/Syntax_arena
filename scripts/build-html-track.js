/**
 * HTML5 & Modern CSS Track Question Bank Builder
 * Builds:
 * 1. data/html-questions.js (60 curated campaign questions: 20 beg, 20 int, 20 exp)
 * 2. 200 questions in data/endless-questions.js under the 'html' key.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const pad = (n, width = 3) => String(n).padStart(width, '0');

// ============================================================================
// 60 CURATED CAMPAIGN QUESTIONS
// ============================================================================
const CAMPAIGN_QUESTIONS = [
  // --------------------------------------------------------------------------
  // BEGINNER (20 Questions: html-beg-001 to html-beg-020)
  // --------------------------------------------------------------------------
  {
    id: 'html-beg-001',
    language: 'html',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'semantics',
    subtopic: 'semantic_layout_tags',
    standardVersion: 'HTML5 Living Standard',
    prompt: 'Which HTML5 semantic element is intended to encapsulate an independent, self-contained piece of content that could be distributed or syndicated?',
    code: `<___>
  <h2>Release Notes v2.4</h2>
  <p>Published on Oct 22, 2026. Added subgrid support.</p>
</___>`,
    options: ['<article>', '<section>', '<aside>', '<main>'],
    correctAnswer: '<article>',
    acceptedAnswers: ['<article>'],
    hint: 'This element represents reusable content like a blog post, forum post, or news article.',
    explanation: 'The `<article>` element represents a complete, self-contained composition (such as a news article, blog entry, or forum comment) that is independently distributable. `<section>` represents a thematic grouping of content.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['html', 'semantics', 'layout']
  },
  {
    id: 'html-beg-002',
    language: 'html',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'box_model',
    subtopic: 'border_box_sizing',
    standardVersion: 'CSS3 / CSS Box Model 3',
    prompt: 'What is the total computed rendered width of this element on screen?',
    code: `.card {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  margin: 15px;
}`,
    options: ['200px', '250px', '280px', '230px'],
    correctAnswer: '200px',
    acceptedAnswers: ['200px'],
    hint: 'Under box-sizing: border-box, padding and border are included inside the specified width.',
    explanation: 'With `box-sizing: border-box`, the specified `width: 200px` encompasses the content, padding, and border. The outer rendered box width remains exactly 200px (margins surround the outside).',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'box_model', 'sizing']
  },
  {
    id: 'html-beg-003',
    language: 'html',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'specificity',
    subtopic: 'selector_precedence',
    standardVersion: 'CSS Selectors Level 4',
    prompt: 'Which CSS rule has the highest specificity score and applies its color to the button?',
    code: `/* Rule A */ button.btn.primary { color: red; }
/* Rule B */ #submit-btn { color: blue; }
/* Rule C */ button:hover { color: green; }
/* Rule D */ div > button[type="submit"] { color: yellow; }`,
    options: ['Rule B (#submit-btn)', 'Rule A (button.btn.primary)', 'Rule D (div > button[type="submit"])', 'Rule C (button:hover)'],
    correctAnswer: 'Rule B (#submit-btn)',
    acceptedAnswers: ['Rule B (#submit-btn)', 'Rule B'],
    hint: 'An ID selector (1,0,0) outweighs any quantity of class or attribute selectors (0,1,0).',
    explanation: 'Rule B contains an ID selector with specificity (1, 0, 0). Rule A has (0, 2, 1), Rule C has (0, 1, 1), and Rule D has (0, 1, 1). A single ID selector always overrides class and attribute selectors.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'specificity', 'cascade']
  },
  {
    id: 'html-beg-004',
    language: 'html',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'flexbox',
    subtopic: 'main_vs_cross_axis',
    standardVersion: 'CSS Flexible Box Layout',
    prompt: 'Under flex-direction: column, which CSS property controls alignment along the vertical axis?',
    code: `.container {
  display: flex;
  flex-direction: column;
  /* Which property controls vertical spacing? */
}`,
    options: ['justify-content', 'align-items', 'align-content', 'vertical-align'],
    correctAnswer: 'justify-content',
    acceptedAnswers: ['justify-content'],
    hint: 'justify-content always aligns items along the main axis, which becomes vertical under column direction.',
    explanation: '`justify-content` controls alignment along the main axis. When `flex-direction: column` is set, the main axis rotates to run vertically (top to bottom). `align-items` governs the horizontal cross axis.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'flexbox', 'alignment']
  },
  {
    id: 'html-beg-005',
    language: 'html',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'accessibility',
    subtopic: 'screen_reader_alt_text',
    standardVersion: 'WCAG 2.2 / HTML5',
    prompt: 'What is the correct accessibility practice for a purely decorative background illustration image in HTML?',
    code: `<img src="decorative-ribbon.png" alt="___">`,
    options: [
      'alt="" (empty alt attribute so screen readers cleanly skip it)',
      'Omit the alt attribute entirely',
      'alt="decorative image"',
      'alt="image of ribbon decoration for visual style"'
    ],
    correctAnswer: 'alt="" (empty alt attribute so screen readers cleanly skip it)',
    acceptedAnswers: ['alt="" (empty alt attribute so screen readers cleanly skip it)', 'alt=""'],
    hint: 'Screen readers read the filename URL aloud if alt is missing, but skip it silently when alt is empty.',
    explanation: 'According to WCAG and HTML standards, purely decorative images must have `alt=""` (empty/null alt). This signals assistive technologies that the graphic conveys no informational content and can be safely ignored.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['html', 'accessibility', 'a11y', 'images']
  },
  {
    id: 'html-beg-006',
    language: 'html',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'units',
    subtopic: 'rem_vs_em',
    standardVersion: 'CSS Values and Units 4',
    prompt: 'If root html font-size is 16px and .parent font-size is 20px, what is the computed font-size of 1.5rem?',
    code: `html { font-size: 16px; }
.parent { font-size: 20px; }
.child { font-size: 1.5rem; }`,
    options: ['24px', '30px', '20px', '16px'],
    correctAnswer: '24px',
    acceptedAnswers: ['24px'],
    hint: 'rem is relative to the Root Element (<html>), while em is relative to the element parent.',
    explanation: '`rem` stands for "root em" and is calculated strictly from the root `<html>` font-size: 1.5 * 16px = 24px. It completely ignores intermediate parent font sizes.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'units', 'rem', 'typography']
  },
  {
    id: 'html-beg-007',
    language: 'html',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'forms',
    subtopic: 'label_association',
    standardVersion: 'HTML5 Forms',
    prompt: 'Which attribute on an HTML <label> explicitly associates it with an <input id="user-email"> element for accessibility and click targeting?',
    code: `<label ___="user-email">Email Address</label>
<input type="email" id="user-email">`,
    options: ['for="user-email"', 'name="user-email"', 'target="user-email"', 'aria-target="user-email"'],
    correctAnswer: 'for="user-email"',
    acceptedAnswers: ['for="user-email"', 'for'],
    hint: 'The attribute name is "for", corresponding to the htmlFor DOM property.',
    explanation: 'The `<label for="id">` attribute matches the target input\'s `id`. When clicked, it automatically transfers browser focus to the input and provides a programmatic accessible name for screen readers.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['html', 'forms', 'accessibility']
  },
  {
    id: 'html-beg-008',
    language: 'html',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'selectors',
    subtopic: 'combinators',
    standardVersion: 'CSS Selectors Level 4',
    prompt: 'What elements are matched by the child combinator selector `ul > li`?',
    code: `<ul>
  <li>First item</li>
  <li>
    <ol><li>Nested item</li></ol>
  </li>
</ul>`,
    options: [
      'Only direct child <li> elements of <ul>, excluding the nested <li>',
      'All <li> elements anywhere inside <ul> at any nesting depth',
      'The first <li> element only',
      'Only <li> elements that have siblings'
    ],
    correctAnswer: 'Only direct child <li> elements of <ul>, excluding the nested <li>',
    acceptedAnswers: ['Only direct child <li> elements of <ul>, excluding the nested <li>'],
    hint: 'The child combinator (>) targets immediate direct children only, unlike the descendant space combinator.',
    explanation: '`ul > li` matches only direct child `<li>` elements whose immediate parent is `<ul>`. The nested `<li>` whose parent is `<ol>` is excluded.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'selectors', 'combinators']
  },
  {
    id: 'html-beg-009',
    language: 'html',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'custom_properties',
    subtopic: 'css_variables_fallback',
    standardVersion: 'CSS Custom Properties for Cascading Variables',
    prompt: 'What color is applied when the referenced CSS custom property is undefined?',
    code: `.badge {
  background-color: var(--badge-theme, #10B981);
}`,
    options: ['#10B981', 'transparent', 'black', 'inherit'],
    correctAnswer: '#10B981',
    acceptedAnswers: ['#10B981'],
    hint: 'var() accepts a second comma-separated argument as a fallback value.',
    explanation: '`var(--name, fallback)` evaluates to the fallback `#10B981` whenever `--badge-theme` has not been set or is invalid at computed-value time.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'custom_properties', 'variables']
  },
  {
    id: 'html-beg-010',
    language: 'html',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'positioning',
    subtopic: 'absolute_containing_block',
    standardVersion: 'CSS Positioned Layout 3',
    prompt: 'An element with `position: absolute` calculates its top/left offsets relative to which ancestor?',
    code: `.child {
  position: absolute;
  top: 10px;
  left: 20px;
}`,
    options: [
      'The nearest ancestor with position other than static (e.g. relative, absolute, fixed)',
      'Its immediate direct parent element regardless of positioning',
      'The root <html> viewport only',
      'The nearest <div> element in the DOM'
    ],
    correctAnswer: 'The nearest ancestor with position other than static (e.g. relative, absolute, fixed)',
    acceptedAnswers: ['The nearest ancestor with position other than static (e.g. relative, absolute, fixed)'],
    hint: 'An absolute element searches up the DOM tree for a positioned ancestor (not static).',
    explanation: '`position: absolute` elements position themselves relative to their nearest positioned ancestor (an element with `position: relative`, `absolute`, `fixed`, or `sticky`). If none exist, it falls back to the initial containing block (viewport).',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'positioning', 'layout']
  },
  {
    id: 'html-beg-011',
    language: 'html',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'responsive_images',
    subtopic: 'srcset_and_sizes',
    standardVersion: 'HTML5 Responsive Images',
    prompt: 'What is the purpose of the `srcset` attribute on the HTML <img> element?',
    code: `<img src="hero-small.jpg"
     srcset="hero-small.jpg 480w, hero-large.jpg 1200w"
     sizes="(max-width: 600px) 480px, 1200px"
     alt="Hero banner">`,
    options: [
      'Allows the browser to choose the most optimal image source based on device display resolution and viewport width',
      'Specifies image animations in sequential order',
      'Provides fallback images if the primary image returns 404',
      'Preloads images in memory prior to DOM rendering'
    ],
    correctAnswer: 'Allows the browser to choose the most optimal image source based on device display resolution and viewport width',
    acceptedAnswers: ['Allows the browser to choose the most optimal image source based on device display resolution and viewport width'],
    hint: 'srcset provides a candidate list of image sources with their natural pixel widths.',
    explanation: '`srcset` provides multiple image resolutions to the browser. Combined with `sizes`, the browser selects the crispest and lightest asset based on device DPR (Device Pixel Ratio) and current layout width.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['html', 'responsive', 'images', 'performance']
  },
  {
    id: 'html-beg-012',
    language: 'html',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'viewport_units',
    subtopic: 'dvh_vs_vh',
    standardVersion: 'CSS Values and Units 4',
    prompt: 'Which modern CSS viewport unit dynamically adapts as mobile address bars expand and contract?',
    code: `.modal-sheet {
  height: 100___; /* Adapts dynamically to mobile UI */
}`,
    options: ['dvh', 'vh', 'svh', 'lvh'],
    correctAnswer: 'dvh',
    acceptedAnswers: ['dvh'],
    hint: 'The "d" in dvh stands for Dynamic Viewport Height.',
    explanation: '`100dvh` (Dynamic Viewport Height) automatically resizes as the mobile browser chrome (URL bar, navigation toolbar) slides in or out, solving the classic mobile `100vh` overflow bug.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'units', 'viewport', 'mobile']
  },
  {
    id: 'html-beg-013',
    language: 'html',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'interactive_elements',
    subtopic: 'native_disclosure_details',
    standardVersion: 'HTML5 Living Standard',
    prompt: 'Which native HTML elements create an expandable accordion without requiring JavaScript?',
    code: `<___>
  <___>Click to expand</___>
  <p>Hidden details revealed!</p>
</___>`,
    options: [
      '<details> containing a <summary>',
      '<accordion> containing an <item>',
      '<collapse> containing a <header>',
      '<dropdown> containing a <title>'
    ],
    correctAnswer: '<details> containing a <summary>',
    acceptedAnswers: ['<details> containing a <summary>'],
    hint: 'The outer element is details and the interactive heading is summary.',
    explanation: 'HTML provides `<details>` and `<summary>` for native disclosure widgets. The browser manages open/closed toggle state and keyboard accessibility automatically with zero JavaScript.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['html', 'interactive', 'semantics']
  },
  {
    id: 'html-beg-014',
    language: 'html',
    difficulty: 'beginner',
    type: 'find_bug',
    topic: 'forms',
    subtopic: 'button_default_type',
    standardVersion: 'HTML5 Forms',
    prompt: 'Which line contains an unexpected bug where clicking the cancel button unintentionally submits the form?',
    code: `1: <form id="settings-form">
2:   <input type="text" name="alias" required>
3:   <button class="btn-cancel">Cancel</button>
4:   <button type="submit" class="btn-save">Save</button>
5: </form>`,
    options: ['Line 3', 'Line 2', 'Line 4', 'Line 1'],
    correctAnswer: 'Line 3',
    acceptedAnswers: ['Line 3', '3'],
    targetLine: 3,
    hint: 'Inside a form, a <button> without an explicit type defaults to type="submit".',
    explanation: 'On Line 3, `<button>` lacks a `type` attribute. By default inside forms, buttons have `type="submit"`, causing the Cancel button to submit form data and trigger validation. It must explicitly specify `type="button"`.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['html', 'forms', 'bugs', 'buttons']
  },
  {
    id: 'html-beg-015',
    language: 'html',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'display',
    subtopic: 'inline_block_spacing',
    standardVersion: 'CSS Display Module 3',
    prompt: 'Why does displaying two 50% width `inline-block` divs cause them to wrap to the next line?',
    code: `.col {
  display: inline-block;
  width: 50%;
}`,
    options: [
      'HTML whitespace between inline-block tags renders as a 4px space character',
      'inline-block elements cannot have explicit widths',
      'The browser adds mandatory 1px borders by default',
      '50% width is unsupported on inline-block elements'
    ],
    correctAnswer: 'HTML whitespace between inline-block tags renders as a 4px space character',
    acceptedAnswers: ['HTML whitespace between inline-block tags renders as a 4px space character'],
    hint: 'Inline formatting models treat tabs, newlines, and spaces as rendered whitespace.',
    explanation: 'Because `inline-block` respects text formatting, newlines or spaces between tags in HTML generate a standard white-space character (typically ~4px), pushing 50% + 50% + 4px over 100% and causing wrapping. Solution: Flexbox or grid.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'display', 'inline_block', 'gotcha']
  },
  {
    id: 'html-beg-016',
    language: 'html',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'semantics',
    subtopic: 'headings_hierarchy',
    standardVersion: 'HTML5 / WAI-ARIA',
    prompt: 'According to web accessibility guidelines, why should heading levels (h1-h6) never skip levels (e.g. h1 directly to h3)?',
    code: `<h1>Dashboard</h1>
<!-- Skipped h2! -->
<h3>Active Users</h3>`,
    options: [
      'Screen reader users navigate via heading hierarchy to construct an accurate mental outline of the page',
      'Skipping levels causes browsers to throw HTML parsing errors',
      'CSS font sizes cannot compute without contiguous heading levels',
      'Search engines de-index pages with skipped headings'
    ],
    correctAnswer: 'Screen reader users navigate via heading hierarchy to construct an accurate mental outline of the page',
    acceptedAnswers: ['Screen reader users navigate via heading hierarchy to construct an accurate mental outline of the page'],
    hint: 'Headings provide an accessible structural table of contents for assistive technology.',
    explanation: 'Screen readers provide shortcuts to jump across heading levels. Skipping levels disorients users who rely on the document hierarchy to understand content relationships.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['html', 'accessibility', 'headings']
  },
  {
    id: 'html-beg-017',
    language: 'html',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'text_effects',
    subtopic: 'truncate_ellipsis',
    standardVersion: 'CSS Text 3',
    prompt: 'Which three CSS properties must be used together to truncate single-line text with an ellipsis (...) ?',
    code: `.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}`,
    options: [
      'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;',
      'text-overflow: ellipsis; display: flex; max-width: 100%;',
      'line-clamp: 1; text-align: left; overflow: scroll;',
      'word-break: break-all; text-overflow: clip; width: auto;'
    ],
    correctAnswer: 'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;',
    acceptedAnswers: ['overflow: hidden; white-space: nowrap; text-overflow: ellipsis;'],
    hint: 'Text must be prevented from wrapping (nowrap) and clipping must be hidden (overflow: hidden).',
    explanation: '`text-overflow: ellipsis` only triggers when content overflows its container without wrapping, requiring `white-space: nowrap` and `overflow: hidden`.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'typography', 'ellipsis']
  },
  {
    id: 'html-beg-018',
    language: 'html',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'media_queries',
    subtopic: 'mobile_first_design',
    standardVersion: 'CSS Conditional Rules 3',
    prompt: 'In mobile-first responsive CSS architecture, which media query feature is primarily used for progressive enhancement on larger viewports?',
    code: `/* Base mobile styles defined first */
.nav { display: none; }

/* Enhanced for tablets and desktops: */
@media (___-width: 768px) {
  .nav { display: flex; }
}`,
    options: ['min-width', 'max-width', 'device-width', 'orientation'],
    correctAnswer: 'min-width',
    acceptedAnswers: ['min-width'],
    hint: 'Mobile-first defines the baseline for small screens and uses min-width to add styles as screens widen.',
    explanation: 'Mobile-first design defines default styles for small screens without media queries, then uses `@media (min-width: ...)` to progressively enhance layouts for wider viewports.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'responsive', 'media_queries', 'mobile_first']
  },
  {
    id: 'html-beg-019',
    language: 'html',
    difficulty: 'beginner',
    type: 'multiple_choice',
    topic: 'accessibility',
    subtopic: 'tabindex_values',
    standardVersion: 'HTML5 Living Standard',
    prompt: 'What is the effect of setting tabindex="-1" on an HTML element?',
    code: `<div id="status-alert" tabindex="-1">Operation Successful</div>`,
    options: [
      'The element can receive programmatic focus via JavaScript (.focus()) but is removed from sequential tab navigation',
      'The element is permanently disabled and cannot receive mouse clicks',
      'The element is hidden from screen readers',
      'The element is focused before all other elements'
    ],
    correctAnswer: 'The element can receive programmatic focus via JavaScript (.focus()) but is removed from sequential tab navigation',
    acceptedAnswers: ['The element can receive programmatic focus via JavaScript (.focus()) but is removed from sequential tab navigation'],
    hint: 'Negative tabindex removes from keyboard Tab order while allowing element.focus() in script.',
    explanation: '`tabindex="-1"` makes an element programmatically focusable (essential for managing focus when dialogs open or alerts appear) without placing it in the user\'s sequential keyboard Tab order.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['html', 'accessibility', 'tabindex', 'keyboard']
  },
  {
    id: 'html-beg-020',
    language: 'html',
    difficulty: 'beginner',
    type: 'predict_output',
    topic: 'flexbox',
    subtopic: 'flex_gap',
    standardVersion: 'CSS Box Alignment 3',
    prompt: 'What modern CSS property adds 1rem of spacing strictly between flex items without applying outer margins?',
    code: `.nav-list {
  display: flex;
  gap: 1rem;
}`,
    options: ['gap', 'margin', 'space-between', 'padding-inline'],
    correctAnswer: 'gap',
    acceptedAnswers: ['gap'],
    hint: 'gap specifies the gutters between adjacent items.',
    explanation: 'The `gap` property (formerly `grid-gap`) works in Flexbox and Grid, adding gutters exclusively between adjacent items without unwanted outer margins on the first/last children.',
    points: 100,
    estimatedSeconds: 30,
    tags: ['css', 'flexbox', 'gap', 'layout']
  },

  // --------------------------------------------------------------------------
  // INTERMEDIATE (20 Questions: html-int-001 to html-int-020)
  // --------------------------------------------------------------------------
  {
    id: 'html-int-001',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'selectors',
    subtopic: 'has_pseudo_class',
    standardVersion: 'CSS Selectors Level 4',
    prompt: 'What element is selected by the modern CSS `:has()` pseudo-class selector `article:has(img)`?',
    code: `/* Select an article that contains an image */
article:has(img) {
  border-color: #00E5FF;
}`,
    options: [
      'The <article> element itself, whenever it contains at least one descendant <img>',
      'The <img> elements located inside the article',
      'The parent of the article element',
      'Only articles where the image is the direct first child'
    ],
    correctAnswer: 'The <article> element itself, whenever it contains at least one descendant <img>',
    acceptedAnswers: ['The <article> element itself, whenever it contains at least one descendant <img>'],
    hint: ':has() is the long-awaited CSS "parent selector".',
    explanation: '`:has()` acts as a relational pseudo-class (the CSS parent selector). `article:has(img)` selects the `<article>` element if any matching `<img>` exists inside it.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'selectors', 'has', 'modern_css']
  },
  {
    id: 'html-int-002',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'selectors',
    subtopic: 'is_vs_where_specificity',
    standardVersion: 'CSS Selectors Level 4',
    prompt: 'What is the key specificity difference between the `:is()` and `:where()` pseudo-classes?',
    code: `:is(header, footer) p   /* Selector A */
:where(header, footer) p  /* Selector B */`,
    options: [
      ':where() always has 0 specificity, while :is() takes the specificity of its most specific argument',
      ':is() has 0 specificity, while :where() has 100 specificity',
      'Both have identical specificity',
      ':where() can only accept class names while :is() accepts tag names'
    ],
    correctAnswer: ':where() always has 0 specificity, while :is() takes the specificity of its most specific argument',
    acceptedAnswers: [':where() always has 0 specificity, while :is() takes the specificity of its most specific argument'],
    hint: ':where() is designed for design systems to provide zero-specificity easy-to-override defaults.',
    explanation: '`:where(...)` has a fixed specificity of 0, making rules trivial to override. `:is(...)` calculates its specificity based on the most specific selector in its argument list.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'selectors', 'specificity', 'is', 'where']
  },
  {
    id: 'html-int-003',
    language: 'html',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'grid',
    subtopic: 'auto_fit_vs_auto_fill',
    standardVersion: 'CSS Grid Layout 1',
    prompt: 'In CSS Grid, what happens to empty tracks when using `repeat(auto-fit, minmax(200px, 1fr))` compared to `auto-fill`?',
    code: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}`,
    options: [
      'auto-fit collapses empty tracks to 0px, allowing present items to stretch and fill the remaining row space',
      'auto-fit leaves empty 200px column gaps on the right',
      'auto-fit and auto-fill behave identically in all scenarios',
      'auto-fit limits the maximum number of items to 4'
    ],
    correctAnswer: 'auto-fit collapses empty tracks to 0px, allowing present items to stretch and fill the remaining row space',
    acceptedAnswers: ['auto-fit collapses empty tracks to 0px, allowing present items to stretch and fill the remaining row space'],
    hint: 'auto-fit collapses extra tracks so items expand; auto-fill retains empty tracks.',
    explanation: 'When space permits more columns than there are items, `auto-fit` collapses empty tracks to 0px and expands active items with `1fr`. `auto-fill` maintains empty tracks, preventing existing items from expanding.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'grid', 'auto_fit', 'responsive']
  },
  {
    id: 'html-int-004',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'container_queries',
    subtopic: 'container_type',
    standardVersion: 'CSS Container Queries 1',
    prompt: 'Which CSS property must be declared on an ancestor to enable `@container` queries on child elements based on horizontal width?',
    code: `.card-wrapper {
  container-type: inline-size;
  container-name: card;
}`,
    options: [
      'container-type: inline-size',
      'container-mode: responsive',
      'display: container',
      'contain: layout'
    ],
    correctAnswer: 'container-type: inline-size',
    acceptedAnswers: ['container-type: inline-size'],
    hint: 'inline-size establishes container queries along the inline (horizontal) dimension.',
    explanation: '`container-type: inline-size` establishes a containment context on the inline axis (width in horizontal writing modes), enabling descendants to evaluate `@container (min-width: ...)` rules against the container instead of the viewport.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'container_queries', 'responsive']
  },
  {
    id: 'html-int-005',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'cascade_layers',
    subtopic: 'layer_precedence',
    standardVersion: 'CSS Cascading and Inheritance 5',
    prompt: 'In modern CSS Cascade Layers (`@layer`), which layer takes precedence when two rules conflict with different specificities?',
    code: `@layer reset, components, utilities;

@layer components {
  #hero-btn { color: red; } /* High specificity */
}
@layer utilities {
  .text-blue { color: blue; } /* Low specificity */
}`,
    options: [
      'blue from @layer utilities, because later declared layers beat earlier layers regardless of specificity',
      'red from @layer components, because #hero-btn has an ID selector',
      'The browser rejects both as a layer collision',
      'Whichever rule was parsed first by the HTML loader'
    ],
    correctAnswer: 'blue from @layer utilities, because later declared layers beat earlier layers regardless of specificity',
    acceptedAnswers: ['blue from @layer utilities, because later declared layers beat earlier layers regardless of specificity'],
    hint: 'Layer order is evaluated before selector specificity in the CSS cascade.',
    explanation: 'Cascade Layers resolve conflicts at the layer level first! A later layer (`utilities`) completely defeats an earlier layer (`components`), regardless of how high the selector specificity is in the earlier layer.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'cascade_layers', 'specificity', 'modern_css']
  },
  {
    id: 'html-int-006',
    language: 'html',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'color',
    subtopic: 'color_mix',
    standardVersion: 'CSS Color 5',
    prompt: 'What does the CSS `color-mix()` function produce when mixing 50% white and 50% black in sRGB space?',
    code: `.element {
  background-color: color-mix(in srgb, white 50%, black 50%);
}`,
    options: ['A 50% medium gray (rgb(128, 128, 128))', 'transparent', 'black', 'white'],
    correctAnswer: 'A 50% medium gray (rgb(128, 128, 128))',
    acceptedAnswers: ['A 50% medium gray (rgb(128, 128, 128))', 'gray', 'grey'],
    hint: 'color-mix blends two colors proportionally inside the specified interpolation color space.',
    explanation: '`color-mix(in srgb, white 50%, black 50%)` blends equal parts of pure white and black in the sRGB color space, resulting in medium gray `#808080` (rgb(128, 128, 128)).',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'color', 'color_mix']
  },
  {
    id: 'html-int-007',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'subgrid',
    subtopic: 'nested_grid_alignment',
    standardVersion: 'CSS Grid Layout 2',
    prompt: 'What problem does CSS Subgrid (`grid-template-columns: subgrid`) solve for nested card layouts?',
    code: `.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}`,
    options: [
      'Allows cards in different columns to align their internal headers and footers to shared parent grid row tracks',
      'Creates 3D card flipping animations automatically',
      'Transforms child elements into SVG canvas paths',
      'Automatically converts flexbox items into responsive tables'
    ],
    correctAnswer: 'Allows cards in different columns to align their internal headers and footers to shared parent grid row tracks',
    acceptedAnswers: ['Allows cards in different columns to align their internal headers and footers to shared parent grid row tracks'],
    hint: 'Subgrid inherits grid lines from the parent grid rather than defining isolated tracks.',
    explanation: 'Without subgrid, each card has its own isolated row sizing. `grid-template-rows: subgrid` forces nested child elements (e.g. card titles, descriptions, footers) to lock into the parent grid\'s rows, aligning them horizontally across columns.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'grid', 'subgrid', 'layout']
  },
  {
    id: 'html-int-008',
    language: 'html',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'fluid_typography',
    subtopic: 'clamp_function',
    standardVersion: 'CSS Values and Units 4',
    prompt: 'What font-size does clamp(16px, 5vw, 32px) evaluate to when viewport width is 1000px (5vw = 50px)?',
    code: `h1 {
  font-size: clamp(16px, 5vw, 32px);
}`,
    options: ['32px', '50px', '16px', '24px'],
    correctAnswer: '32px',
    acceptedAnswers: ['32px'],
    hint: 'clamp(min, preferred, max) restricts the value so it never exceeds max.',
    explanation: '`clamp(16px, 50px, 32px)` takes the preferred value (50px) but clamps it between min (16px) and max (32px). Because 50px > 32px, the computed value is 32px.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'clamp', 'math', 'typography']
  },
  {
    id: 'html-int-009',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'interactive_elements',
    subtopic: 'dialog_show_modal',
    standardVersion: 'HTML5 Living Standard',
    prompt: 'When opening a native HTML `<dialog>` element, what is the critical difference between `dialog.showModal()` and `dialog.show()`?',
    code: `const dialog = document.querySelector('dialog');
dialog.showModal(); // vs dialog.show();`,
    options: [
      'showModal() opens in the browser top-layer with a backdrop and traps background interaction; show() does not',
      'show() is modal while showModal() is non-modal',
      'showModal() requires a CSS transition while show() displays immediately',
      'show() renders in full screen mode while showModal() renders in an iframe'
    ],
    correctAnswer: 'showModal() opens in the browser top-layer with a backdrop and traps background interaction; show() does not',
    acceptedAnswers: ['showModal() opens in the browser top-layer with a backdrop and traps background interaction; show() does not'],
    hint: 'showModal creates a true modal dialogue in the browser\'s top layer with ::backdrop.',
    explanation: '`showModal()` renders the dialog in the browser\'s privileged "top layer" (above all z-indexes), activates the `::backdrop` pseudo-element, disables interaction with background elements (inert), and handles Escape key closing natively.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['html', 'dialog', 'modal', 'accessibility']
  },
  {
    id: 'html-int-010',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'stacking_context',
    subtopic: 'isolation_isolate',
    standardVersion: 'CSS Positioned Layout 3',
    prompt: 'What is the purpose of declaring `isolation: isolate` on a parent container in CSS?',
    code: `.card {
  isolation: isolate;
}`,
    options: [
      'Creates a new stacking context so child z-index values never leak outside or collide with external elements',
      'Prevents CSS inheritance of text colors and fonts',
      'Stops mouse events from bubbling to parent elements',
      'Hides the element from web crawlers'
    ],
    correctAnswer: 'Creates a new stacking context so child z-index values never leak outside or collide with external elements',
    acceptedAnswers: ['Creates a new stacking context so child z-index values never leak outside or collide with external elements'],
    hint: 'isolation creates a self-contained local z-index stacking boundary.',
    explanation: '`isolation: isolate` explicitly starts a new stacking context without requiring dummy `z-index` or `transform` hacks. Internal child elements can use high z-indexes without risk of overlaying other components on the page.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'stacking_context', 'z_index', 'isolation']
  },
  {
    id: 'html-int-011',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'logical_properties',
    subtopic: 'bidirectional_layout',
    standardVersion: 'CSS Logical Properties and Values 1',
    prompt: 'Which CSS logical property replaces `margin-left` to automatically adapt between left-to-right (LTR) and right-to-left (RTL) writing modes?',
    code: `.icon {
  margin-inline-start: 0.5rem; /* Replaces margin-left */
}`,
    options: [
      'margin-inline-start',
      'margin-block-start',
      'margin-inline-end',
      'margin-start-axis'
    ],
    correctAnswer: 'margin-inline-start',
    acceptedAnswers: ['margin-inline-start'],
    hint: 'Inline refers to text flow direction (horizontal in English/Arabic); Start refers to the beginning edge.',
    explanation: '`margin-inline-start` maps to `margin-left` in LTR languages (English, French) and automatically flips to `margin-right` in RTL languages (Arabic, Hebrew) without requiring override stylesheets.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'logical_properties', 'i18n', 'rtl']
  },
  {
    id: 'html-int-012',
    language: 'html',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'aspect_ratio',
    subtopic: 'responsive_video_box',
    standardVersion: 'CSS Box Sizing 4',
    prompt: 'What modern CSS property eliminates the traditional 56.25% padding-top video container hack?',
    code: `.video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
}`,
    options: ['aspect-ratio: 16 / 9', 'ratio: 16:9', 'box-ratio: 16/9', 'view-aspect: 16-9'],
    correctAnswer: 'aspect-ratio: 16 / 9',
    acceptedAnswers: ['aspect-ratio: 16 / 9', 'aspect-ratio'],
    hint: 'aspect-ratio natively locks width-to-height proportions.',
    explanation: 'The `aspect-ratio` property allows developers to set a preferred ratio for an element box. The browser automatically calculates height from width (or vice versa), replacing padding percentage hacks.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'aspect_ratio', 'media']
  },
  {
    id: 'html-int-013',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'modern_css',
    subtopic: 'native_nesting',
    standardVersion: 'CSS Nesting Module 1',
    prompt: 'In native CSS nesting (supported without Sass), what does the ampersand (&) represent?',
    code: `.card {
  background: white;
  &:hover {
    background: #f0f0f0;
  }
}`,
    options: [
      'References the parent selector (.card) directly, equivalent to .card:hover',
      'Imports an external Sass module',
      'Compiles the selector as an ID selector',
      'Escapes special regex characters'
    ],
    correctAnswer: 'References the parent selector (.card) directly, equivalent to .card:hover',
    acceptedAnswers: ['References the parent selector (.card) directly, equivalent to .card:hover'],
    hint: 'The nesting selector & represents the current matching parent selector.',
    explanation: 'Native CSS Nesting uses `&` as the nesting selector to represent the parent rule (`.card`). `&:hover` is resolved directly by the browser as `.card:hover`.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'nesting', 'modern_css']
  },
  {
    id: 'html-int-014',
    language: 'html',
    difficulty: 'intermediate',
    type: 'find_bug',
    topic: 'accessibility',
    subtopic: 'interactive_role_parity',
    standardVersion: 'WAI-ARIA 1.2 / WCAG 2.2',
    prompt: 'Which line causes an accessibility defect by building a clickable widget without keyboard support or semantic role?',
    code: `1: <div class="action-card" onclick="openProfile()">
2:   <h3>User Profile</h3>
3:   <p>View player statistics.</p>
4: </div>`,
    options: ['Line 1', 'Line 2', 'Line 3', 'Line 4'],
    correctAnswer: 'Line 1',
    acceptedAnswers: ['Line 1', '1'],
    targetLine: 1,
    hint: 'A clickable <div> lacks keyboard focus (tabindex), Enter/Space key triggers, and button role.',
    explanation: 'On Line 1, `<div onclick="...">` creates an inaccessible click target. Screen reader users will not know it is actionable, and keyboard users cannot Tab to it or press Enter/Space. A semantic `<button>` or `role="button" tabindex="0"` with key handlers must be used.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['html', 'accessibility', 'a11y', 'bugs']
  },
  {
    id: 'html-int-015',
    language: 'html',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'animations',
    subtopic: 'animation_fill_mode',
    standardVersion: 'CSS Animations 1',
    prompt: 'What does `animation-fill-mode: forwards` instruct the browser to do when a CSS keyframe animation completes?',
    code: `.toast {
  animation: slideIn 0.3s ease-out forwards;
}`,
    options: [
      'Retains the computed CSS styles from the final keyframe (100%) after the animation finishes',
      'Loops the animation forward indefinitely',
      'Reverts the element back to its initial pre-animation state',
      'Fast-forwards the animation without rendering frames'
    ],
    correctAnswer: 'Retains the computed CSS styles from the final keyframe (100%) after the animation finishes',
    acceptedAnswers: ['Retains the computed CSS styles from the final keyframe (100%) after the animation finishes'],
    hint: 'forwards keeps the styles from the last keyframe active.',
    explanation: 'By default, CSS animations snap back to original styles upon completion. `animation-fill-mode: forwards` ensures the element retains the property values set by the final keyframe.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'animations', 'keyframes']
  },
  {
    id: 'html-int-016',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'performance',
    subtopic: 'content_visibility',
    standardVersion: 'CSS Containment 2',
    prompt: 'What performance optimization is achieved by applying `content-visibility: auto` to offscreen feed cards?',
    code: `.feed-card {
  content-visibility: auto;
  contain-intrinsic-size: 0 400px;
}`,
    options: [
      'The browser skips layout and painting for elements while they are outside the viewport, accelerating initial page load',
      'The browser compresses images into WebP format on the fly',
      'The element is automatically converted into a web worker',
      'It prevents CSS files from blocking JavaScript execution'
    ],
    correctAnswer: 'The browser skips layout and painting for elements while they are outside the viewport, accelerating initial page load',
    acceptedAnswers: ['The browser skips layout and painting for elements while they are outside the viewport, accelerating initial page load'],
    hint: 'content-visibility: auto provides user-agent containment, skipping work for offscreen content.',
    explanation: '`content-visibility: auto` tells the browser that offscreen elements can skip layout and rendering until they approach the viewport, dramatically improving initial page load performance on long pages.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'performance', 'rendering', 'containment']
  },
  {
    id: 'html-int-017',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'visual_effects',
    subtopic: 'backdrop_filter',
    standardVersion: 'CSS Backgrounds and Borders 4',
    prompt: 'Why does a glassmorphism card with `backdrop-filter: blur(10px)` fail to show a blur effect if its own background is opaque `#000000`?',
    code: `.glass-card {
  background-color: #000000; /* Opaque */
  backdrop-filter: blur(10px);
}`,
    options: [
      'backdrop-filter filters the area behind the element, which is completely occluded by the 100% opaque background',
      'backdrop-filter only works on <img> elements',
      'The blur radius must be at least 50px to penetrate opaque backgrounds',
      'backdrop-filter requires WebGL to be enabled'
    ],
    correctAnswer: 'backdrop-filter filters the area behind the element, which is completely occluded by the 100% opaque background',
    acceptedAnswers: ['backdrop-filter filters the area behind the element, which is completely occluded by the 100% opaque background'],
    hint: 'backdrop-filter applies to pixels underneath the element; an opaque background covers them up.',
    explanation: '`backdrop-filter` applies visual effects (like blur) to the content directly behind the element box. If the element\'s own background is solid opaque, the filtered pixels behind it cannot be seen. A semi-transparent background (e.g. `rgba(0,0,0,0.5)`) is required.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'visual_effects', 'glassmorphism', 'backdrop_filter']
  },
  {
    id: 'html-int-018',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'popover_api',
    subtopic: 'native_popover_attribute',
    standardVersion: 'HTML5 Living Standard',
    prompt: 'What native functionality does the modern HTML `popover` attribute provide when triggered?',
    code: `<button popovertarget="my-menu">Open Menu</button>
<div id="my-menu" popover>Menu Content</div>`,
    options: [
      'Renders in the top-layer, closes automatically on outside clicks (light dismiss) or Escape key, with zero JavaScript',
      'Sends a native push notification to the user\'s operating system',
      'Renders the element inside an iframe for security isolation',
      'Automatically translates menu text into the user\'s locale'
    ],
    correctAnswer: 'Renders in the top-layer, closes automatically on outside clicks (light dismiss) or Escape key, with zero JavaScript',
    acceptedAnswers: ['Renders in the top-layer, closes automatically on outside clicks (light dismiss) or Escape key, with zero JavaScript'],
    hint: 'The Popover API provides built-in top-layer rendering and "light dismiss" behavior.',
    explanation: 'The native HTML Popover API provides top-layer placement, automatic light dismiss (clicking outside or pressing Escape closes it), and accessible button triggers without any custom JavaScript event handling.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['html', 'popover', 'modern_html', 'ui']
  },
  {
    id: 'html-int-019',
    language: 'html',
    difficulty: 'intermediate',
    type: 'predict_output',
    topic: 'grid',
    subtopic: 'fr_unit_calculation',
    standardVersion: 'CSS Grid Layout 1',
    prompt: 'In a 600px grid container with gap: 0, how wide is each column in `grid-template-columns: 1fr 2fr`?',
    code: `.grid {
  width: 600px;
  display: grid;
  grid-template-columns: 1fr 2fr;
}`,
    options: ['200px and 400px', '300px and 300px', '100px and 500px', '250px and 350px'],
    correctAnswer: '200px and 400px',
    acceptedAnswers: ['200px and 400px'],
    hint: '1fr + 2fr = 3 total fractions. Divide 600px by 3.',
    explanation: 'Total fractions = 1 + 2 = 3fr. Each `fr` represents 600px / 3 = 200px. Column 1 is 1fr (200px) and Column 2 is 2fr (400px).',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'grid', 'fr_unit', 'math']
  },
  {
    id: 'html-int-020',
    language: 'html',
    difficulty: 'intermediate',
    type: 'multiple_choice',
    topic: 'selectors',
    subtopic: 'target_pseudo_class',
    standardVersion: 'CSS Selectors Level 4',
    prompt: 'What element does the `:target` CSS pseudo-class select in a document?',
    code: `:target {
  outline: 2px solid #00E5FF;
}`,
    options: [
      'The unique element whose ID matches the current URL fragment identifier (#hash)',
      'The element currently hovered by the mouse pointer',
      'The target of an active form submission',
      'The link element being clicked'
    ],
    correctAnswer: 'The unique element whose ID matches the current URL fragment identifier (#hash)',
    acceptedAnswers: ['The unique element whose ID matches the current URL fragment identifier (#hash)'],
    hint: 'When visiting page.html#section-b, the element with id="section-b" is matched by :target.',
    explanation: 'The `:target` pseudo-class represents a unique element with an ID matching the current URL hash fragment (e.g. `#modal-1`), enabling pure-CSS tabs, lightboxes, and smooth section highlight effects.',
    points: 200,
    estimatedSeconds: 30,
    tags: ['css', 'selectors', 'target', 'navigation']
  },

  // --------------------------------------------------------------------------
  // EXPERT (20 Questions: html-exp-001 to html-exp-020)
  // --------------------------------------------------------------------------
  {
    id: 'html-exp-001',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'view_transitions',
    subtopic: 'dom_state_transitions',
    standardVersion: 'CSS View Transitions 1',
    prompt: 'How does the View Transitions API (`document.startViewTransition()`) animate state changes between DOM updates?',
    code: `document.startViewTransition(() => {
  updateDOMState();
});`,
    options: [
      'Captures visual snapshots of old and new DOM states, animating between them via pseudo-elements ::view-transition-old and ::view-transition-new',
      'Interpolates all DOM nodes frame-by-frame via SVG vector morphing',
      'Renders the transition inside a WebGL offscreen canvas context',
      'Forces a synchronous browser reload and cross-fades screenshots'
    ],
    correctAnswer: 'Captures visual snapshots of old and new DOM states, animating between them via pseudo-elements ::view-transition-old and ::view-transition-new',
    acceptedAnswers: ['Captures visual snapshots of old and new DOM states, animating between them via pseudo-elements ::view-transition-old and ::view-transition-new'],
    hint: 'View Transitions capture snapshots and expose pseudo-elements for cross-fading.',
    explanation: '`document.startViewTransition()` takes a snapshot of the old DOM, executes the DOM update callback, takes a snapshot of the new DOM, and generates pseudo-elements (`::view-transition-old(root)` and `::view-transition-new(root)`) that cross-fade smoothly using GPU acceleration.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['css', 'view_transitions', 'animations', 'modern_web']
  },
  {
    id: 'html-exp-002',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'cascade_layers',
    subtopic: 'unlayered_styles_precedence',
    standardVersion: 'CSS Cascading and Inheritance 5',
    prompt: 'According to the official CSS Cascade specification, how do unlayered styles (styles outside any `@layer`) compare against styles defined inside `@layer` blocks?',
    code: `@layer utilities {
  .btn-priority { background: red; }
}
/* Unlayered rule outside all layers: */
.btn-priority { background: blue; }`,
    options: [
      'Unlayered styles always take precedence over layered styles (blue wins)',
      'Layered styles always defeat unlayered styles (red wins)',
      'Whichever rule has higher selector specificity wins',
      'Unlayered styles are rejected by the browser if @layer is active'
    ],
    correctAnswer: 'Unlayered styles always take precedence over layered styles (blue wins)',
    acceptedAnswers: ['Unlayered styles always take precedence over layered styles (blue wins)'],
    hint: 'Unlayered styles are considered the final author override tier in normal cascade order.',
    explanation: 'In the normal CSS cascade (for non-!important rules), unlayered styles have higher priority than all layered styles. This ensures developers can easily write ad-hoc overrides on top of third-party layered frameworks.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['css', 'cascade_layers', 'cascade', 'precedence']
  },
  {
    id: 'html-exp-003',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'scroll_driven_animations',
    subtopic: 'animation_timeline',
    standardVersion: 'CSS Scroll-Driven Animations 1',
    prompt: 'What does `animation-timeline: scroll()` accomplish in pure modern CSS without JavaScript scroll event listeners?',
    code: `@keyframes progress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
.reading-bar {
  animation: progress auto linear;
  animation-timeline: scroll();
}`,
    options: [
      'Links animation progress directly to the scrollbar position of the nearest scroll container',
      'Automatically smooth-scrolls the window to the bottom on page load',
      'Pauses all animations whenever the user scrolls',
      'Emits JavaScript scroll events at 60fps'
    ],
    correctAnswer: 'Links animation progress directly to the scrollbar position of the nearest scroll container',
    acceptedAnswers: ['Links animation progress directly to the scrollbar position of the nearest scroll container'],
    hint: 'animation-timeline: scroll() advances animation keyframes proportional to scroll offset.',
    explanation: 'CSS Scroll-Driven Animations allow keyframe playback to be driven by scroll progress instead of elapsed clock time. `animation-timeline: scroll()` advances keyframes from 0% to 100% as the scrollable area is traversed, running off-main-thread with zero scroll jank.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['css', 'scroll_animations', 'performance', 'modern_css']
  },
  {
    id: 'html-exp-004',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'web_components',
    subtopic: 'shadow_dom_slot_projection',
    standardVersion: 'DOM & Web Components / CSS Scoping 1',
    prompt: 'In Shadow DOM Web Components, which pseudo-element is used inside the shadow root stylesheet to style light-DOM elements projected into a `<slot>`?',
    code: `/* Inside Shadow Root CSS */
::___(p) {
  color: #00E5FF;
}`,
    options: ['::slotted(p)', '::host(p)', '::projected(p)', '::part(p)'],
    correctAnswer: '::slotted(p)',
    acceptedAnswers: ['::slotted(p)'],
    hint: 'The pseudo-element is ::slotted() which matches light DOM elements distributed into a slot.',
    explanation: '`::slotted(<compound-selector>)` allows shadow root CSS to style light DOM nodes that have been assigned to a `<slot>`. Note that `::slotted` can only target top-level slotted elements, not their children.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['html', 'web_components', 'shadow_dom', 'css']
  },
  {
    id: 'html-exp-005',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'css_houdini',
    subtopic: 'registered_properties',
    standardVersion: 'CSS Properties and Values API 1',
    prompt: 'What critical capability does registering a CSS custom property via `@property` enable that standard `--custom-prop` variables lack?',
    code: `@property --gradient-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}`,
    options: [
      'Enables smooth browser interpolation and transition/animation of custom properties across keyframes',
      'Makes the variable accessible in server-side Node.js',
      'Encrypts variable values in memory',
      'Bypasses CSS specificity completely'
    ],
    correctAnswer: 'Enables smooth browser interpolation and transition/animation of custom properties across keyframes',
    acceptedAnswers: ['Enables smooth browser interpolation and transition/animation of custom properties across keyframes'],
    hint: 'Without @property, CSS variables are untyped tokens that cannot be mathematically animated.',
    explanation: 'Standard CSS variables are treated as raw string tokens, meaning browsers cannot smoothly interpolate them during transitions. `@property` gives custom properties a typed syntax (e.g. `<angle>`, `<color>`), enabling smooth keyframe animations of gradient angles and complex values.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['css', 'houdini', 'at_property', 'animations']
  },
  {
    id: 'html-exp-006',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'rendering_pipeline',
    subtopic: 'layout_thrashing_composite',
    standardVersion: 'HTML5 Rendering Pipeline',
    prompt: 'Why is animating `transform: translate3d(...)` significantly smoother (60-120fps) than animating `top` / `left` positioning properties?',
    code: `/* Animation Option 1 */ .box { transform: translate3d(100px, 0, 0); }
/* Animation Option 2 */ .box { left: 100px; }`,
    options: [
      'transform updates exclusively during the Composite thread stage on the GPU, avoiding CPU Layout and Paint recalculations',
      'left uses 32-bit floats while transform uses 64-bit doubles',
      'CSS transforms disable anti-aliasing',
      'The browser caches transform in localStorage'
    ],
    correctAnswer: 'transform updates exclusively during the Composite thread stage on the GPU, avoiding CPU Layout and Paint recalculations',
    acceptedAnswers: ['transform updates exclusively during the Composite thread stage on the GPU, avoiding CPU Layout and Paint recalculations'],
    hint: 'transform bypasses Layout (reflow) and Paint, executing entirely on the compositor thread.',
    explanation: 'Modifying `left` triggers Geometry Layout (reflow) and subsequent Repaint on the main CPU thread. In contrast, `transform` and `opacity` are composite-only properties processed directly on the GPU compositor thread without blocking JavaScript execution.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['css', 'performance', 'rendering_pipeline', 'gpu']
  },
  {
    id: 'html-exp-007',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'declarative_shadow_dom',
    subtopic: 'ssr_web_components',
    standardVersion: 'HTML5 Living Standard',
    prompt: 'How does Declarative Shadow DOM allow Server-Side Rendered (SSR) Web Components to render without requiring client-side JavaScript?',
    code: `<my-element>
  <template shadowrootmode="open">
    <style>:host { display: block; }</style>
    <div>Shadow Root Content</div>
  </template>
</my-element>`,
    options: [
      'The browser HTML parser automatically attaches the shadow root directly upon encountering <template shadowrootmode="open">',
      'The server compiles the template into WebAssembly binary',
      'Browsers convert the template into an inline SVG',
      'The server executes a headless Chromium instance to hydrate client state'
    ],
    correctAnswer: 'The browser HTML parser automatically attaches the shadow root directly upon encountering <template shadowrootmode="open">',
    acceptedAnswers: ['The browser HTML parser automatically attaches the shadow root directly upon encountering <template shadowrootmode="open">'],
    hint: 'The shadowrootmode attribute tells the native HTML streaming parser to attach shadow DOM immediately.',
    explanation: 'Declarative Shadow DOM (`<template shadowrootmode="open">`) enables the HTML parser to construct and attach the shadow tree during initial HTML token streaming, preventing Flash of Unstyled Content (FOUC) and enabling SSR Web Components.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['html', 'web_components', 'shadow_dom', 'ssr']
  },
  {
    id: 'html-exp-008',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'accessibility',
    subtopic: 'aria_live_polite_vs_assertive',
    standardVersion: 'WAI-ARIA 1.2 / WCAG 2.2',
    prompt: 'What is the operational difference between `aria-live="polite"` and `aria-live="assertive"` for dynamic updates?',
    code: `<div aria-live="polite">Score: 100</div>
<div aria-live="assertive">Session Terminated!</div>`,
    options: [
      'polite waits until the user is idle before announcing; assertive interrupts ongoing speech immediately',
      'assertive plays an audible audio beep while polite does not',
      'polite is logged to browser console only; assertive renders on screen',
      'assertive requires user acknowledgment before continuing'
    ],
    correctAnswer: 'polite waits until the user is idle before announcing; assertive interrupts ongoing speech immediately',
    acceptedAnswers: ['polite waits until the user is idle before announcing; assertive interrupts ongoing speech immediately'],
    hint: 'assertive announces immediately, while polite queues announcements gracefully.',
    explanation: '`aria-live="polite"` waits until the screen reader finishes announcing whatever it is currently reading. `aria-live="assertive"` interrupts the speech queue immediately to announce urgent time-sensitive alerts.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['html', 'accessibility', 'aria', 'screen_readers']
  },
  {
    id: 'html-exp-009',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'css_scope',
    subtopic: 'donut_scope_boundary',
    standardVersion: 'CSS Cascading and Inheritance 6',
    prompt: 'What does the CSS `@scope` rule accomplish when specifying a lower boundary (donut scoping)?',
    code: `@scope (.card) to (.content) {
  p { color: #00E5FF; }
}`,
    options: [
      'Styles <p> elements inside .card, but stops matching inside nested .content sub-trees',
      'Styles all <p> elements on the page except inside .card',
      'Applies a circular border-radius around the matched text',
      'Creates a 3D perspective projection between .card and .content'
    ],
    correctAnswer: 'Styles <p> elements inside .card, but stops matching inside nested .content sub-trees',
    acceptedAnswers: ['Styles <p> elements inside .card, but stops matching inside nested .content sub-trees'],
    hint: '@scope (root) to (limit) scopes styles with a hole in the middle.',
    explanation: '`@scope (<root>) to (<limit>)` provides native scoped CSS with a boundary limit ("donut scoping"). Elements inside the root are styled until the selector encounters the limit selector, preventing styles from leaking into nested child components.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['css', 'scope', 'modern_css', 'encapsulation']
  },
  {
    id: 'html-exp-010',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'anchor_positioning',
    subtopic: 'anchor_name_and_target',
    standardVersion: 'CSS Anchor Positioning 1',
    prompt: 'How does the modern CSS Anchor Positioning API attach tooltips and menus to an anchor element without JavaScript coordinates calculation?',
    code: `.btn-trigger {
  anchor-name: --my-btn;
}
.tooltip {
  position: fixed;
  position-anchor: --my-btn;
  top: anchor(bottom);
  left: anchor(center);
}`,
    options: [
      'Binds an anchor-name token to an element and references its edges via the anchor() function in pure CSS',
      'Runs an internal requestAnimationFrame loop calculating getBoundingClientRect in JS',
      'Embeds the tooltip inside the button DOM node automatically',
      'Calculates positions using an SVG foreignObject overlay'
    ],
    correctAnswer: 'Binds an anchor-name token to an element and references its edges via the anchor() function in pure CSS',
    acceptedAnswers: ['Binds an anchor-name token to an element and references its edges via the anchor() function in pure CSS'],
    hint: 'anchor-name and anchor() connect fixed floating elements to reference elements declaratively.',
    explanation: 'CSS Anchor Positioning allows elements with `position: fixed` or `absolute` to bind to any anchor element on screen via `anchor-name: --anchor` and position themselves relative to its edges (`anchor(bottom)`, `anchor(center)`) with zero JavaScript positioning libraries.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['css', 'anchor_positioning', 'tooltips', 'modern_css']
  },
  {
    id: 'html-exp-011',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'security',
    subtopic: 'csp_and_iframe_sandbox',
    standardVersion: 'W3C CSP Level 3 / HTML5 Security',
    prompt: 'Which configuration on an HTML `<iframe>` enforces maximum security restrictions against untrusted embedded content?',
    code: `<iframe src="untrusted.html" sandbox="___"></iframe>`,
    options: [
      'sandbox (with no flags or minimal explicit tokens like allow-scripts only if strictly needed)',
      'sandbox="allow-all-scripts-and-forms"',
      'security="strict-origin"',
      'crossorigin="anonymous"'
    ],
    correctAnswer: 'sandbox (with no flags or minimal explicit tokens like allow-scripts only if strictly needed)',
    acceptedAnswers: ['sandbox (with no flags or minimal explicit tokens like allow-scripts only if strictly needed)', 'sandbox'],
    hint: 'An empty sandbox attribute activates all iframe restrictions simultaneously.',
    explanation: 'An `<iframe>` with an empty `sandbox` attribute restricts scripts, form submissions, popups, top navigation, and treats the iframe content as being from an opaque unique origin, preventing XSS and clickjacking.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['html', 'security', 'iframe', 'sandbox']
  },
  {
    id: 'html-exp-012',
    language: 'html',
    difficulty: 'expert',
    type: 'predict_output',
    topic: 'math',
    subtopic: 'trigonometric_functions',
    standardVersion: 'CSS Values and Units 4',
    prompt: 'What mathematical angle value does `calc(sin(30deg) * 100px)` evaluate to in modern CSS?',
    code: `.pointer {
  width: calc(sin(30deg) * 100px);
}`,
    options: ['50px', '100px', '86.6px', '0px'],
    correctAnswer: '50px',
    acceptedAnswers: ['50px'],
    hint: 'sin(30 degrees) = 0.5. 0.5 * 100px = 50px.',
    explanation: 'CSS Values Level 4 supports trigonometric functions (`sin()`, `cos()`, `tan()`). `sin(30deg)` evaluates to 0.5, and `0.5 * 100px` calculates to `50px`.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['css', 'math', 'trigonometry', 'modern_css']
  },
  {
    id: 'html-exp-013',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'resource_hints',
    subtopic: 'preload_vs_prefetch',
    standardVersion: 'W3C Resource Hints',
    prompt: 'What is the operational difference between `<link rel="preload">` and `<link rel="prefetch">` in browser resource scheduling?',
    code: `<link rel="preload" href="font.woff2" as="font" crossorigin>
<link rel="prefetch" href="next-page.js">`,
    options: [
      'preload downloads resources urgently needed for the current page; prefetch downloads resources during idle time for future navigations',
      'preload saves files to localStorage; prefetch caches in memory only',
      'prefetch is for images only while preload is for JavaScript only',
      'Both directives trigger identical browser network scheduler priorities'
    ],
    correctAnswer: 'preload downloads resources urgently needed for the current page; prefetch downloads resources during idle time for future navigations',
    acceptedAnswers: ['preload downloads resources urgently needed for the current page; prefetch downloads resources during idle time for future navigations'],
    hint: 'Preload is for the current page immediately; prefetch is for the next page during browser idle.',
    explanation: '`<link rel="preload">` informs the browser of critical resources required immediately for rendering the current page. `<link rel="prefetch">` is a low-priority hint to fetch assets that might be needed in subsequent user navigations during browser idle time.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['html', 'performance', 'preload', 'prefetch']
  },
  {
    id: 'html-exp-014',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'font_loading',
    subtopic: 'font_display_swap',
    standardVersion: 'CSS Fonts Module 4',
    prompt: 'What user-experience and Core Web Vitals benefit does `font-display: swap` provide in `@font-face` rules?',
    code: `@font-face {
  font-family: 'Outfit';
  src: url('/fonts/outfit.woff2') format('woff2');
  font-display: swap;
}`,
    options: [
      'Renders text immediately using a fallback system font, then swaps when the web font downloads, eliminating Flash of Invisible Text (FOIT)',
      'Prevents fonts from consuming network bandwidth on cellular connections',
      'Automatically converts OTF fonts into WOFF2 format',
      'Increases font rendering resolution on Retina displays'
    ],
    correctAnswer: 'Renders text immediately using a fallback system font, then swaps when the web font downloads, eliminating Flash of Invisible Text (FOIT)',
    acceptedAnswers: ['Renders text immediately using a fallback system font, then swaps when the web font downloads, eliminating Flash of Invisible Text (FOIT)'],
    hint: 'font-display: swap eliminates the invisible text flash by showing fallback text immediately.',
    explanation: '`font-display: swap` instructs the browser to show text immediately with a system fallback font (preventing FOIT). Once the custom font finishes loading, it swaps it in, improving First Contentful Paint (FCP).',
    points: 300,
    estimatedSeconds: 45,
    tags: ['css', 'typography', 'web_fonts', 'performance']
  },
  {
    id: 'html-exp-015',
    language: 'html',
    difficulty: 'expert',
    type: 'find_bug',
    topic: 'performance',
    subtopic: 'layout_thrashing_bug',
    standardVersion: 'HTML5 Web Performance',
    prompt: 'Which line in this animation loop causes Layout Thrashing by reading layout geometry immediately after mutating styles in the same frame?',
    code: `1: function expandElements(items) {
2:   items.forEach(el => {
3:     el.style.width = '200px';
4:     const h = el.offsetHeight;
5:   });
6: }`,
    options: ['Line 4', 'Line 3', 'Line 2', 'Line 5'],
    correctAnswer: 'Line 4',
    acceptedAnswers: ['Line 4', '4'],
    targetLine: 4,
    hint: 'Reading offsetHeight immediately after modifying style.width forces synchronous browser reflow.',
    explanation: 'On Line 4, reading `el.offsetHeight` after writing `el.style.width` on Line 3 inside a loop forces the browser to recalculate layout synchronously on every single iteration ("Forced Synchronous Layout" or Layout Thrashing). Fix: batch all style reads first, then batch writes.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['html', 'javascript', 'performance', 'layout_thrashing']
  },
  {
    id: 'html-exp-016',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'color_spaces',
    subtopic: 'oklch_gamut',
    standardVersion: 'CSS Color Module 4',
    prompt: 'Why is the `oklch()` color space superior to `hsl()` for designing perceptually uniform UI themes and color palettes?',
    code: `.btn {
  background: oklch(0.65 0.25 145);
}`,
    options: [
      'Changes in hue do not alter perceived lightness, preventing yellow from looking significantly brighter than blue at the same lightness value',
      'oklch uses hex strings exclusively',
      'oklch is the only color format supported in SVG',
      'It restricts colors to safe 8-bit displays'
    ],
    correctAnswer: 'Changes in hue do not alter perceived lightness, preventing yellow from looking significantly brighter than blue at the same lightness value',
    acceptedAnswers: ['Changes in hue do not alter perceived lightness, preventing yellow from looking significantly brighter than blue at the same lightness value'],
    hint: 'OKLCH is perceptually uniform: lightness (L) reflects how human eyes actually perceive brightness.',
    explanation: 'In HSL, `hsl(60, 100%, 50%)` (yellow) appears blindingly bright while `hsl(240, 100%, 50%)` (blue) appears dark, despite both having L=50%. `oklch()` is perceptually uniform: lightness values accurately correspond to human visual perception across all hues, and supports P3 wide color gamuts.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['css', 'color', 'oklch', 'gamut']
  },
  {
    id: 'html-exp-017',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'web_components',
    subtopic: 'css_parts_styling',
    standardVersion: 'CSS Shadow Parts 1',
    prompt: 'How does the `::part()` pseudo-element allow external page CSS to style internal Shadow DOM components safely without breaking encapsulation?',
    code: `/* Shadow Root Template */
<button part="tab-button">Tab</button>

/* External Page CSS */
custom-tab::part(tab-button) {
  background: #00E5FF;
}`,
    options: [
      'Exposes explicitly designated shadow DOM elements for external styling without leaking the entire internal shadow tree',
      'Breaks shadow DOM encapsulation by disabling shadow root mode',
      'Converts shadow elements into global class names',
      'Allows external JavaScript to access private shadow variables'
    ],
    correctAnswer: 'Exposes explicitly designated shadow DOM elements for external styling without leaking the entire internal shadow tree',
    acceptedAnswers: ['Exposes explicitly designated shadow DOM elements for external styling without leaking the entire internal shadow tree'],
    hint: 'part="name" acts as an explicit styling API boundary for shadow DOM.',
    explanation: 'The `part` attribute and `::part()` pseudo-element create an explicit, intentional theming API. Component authors expose specific elements for external styling without granting access to unexposed internal implementation details.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['html', 'web_components', 'shadow_parts', 'css']
  },
  {
    id: 'html-exp-018',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'motion_path',
    subtopic: 'offset_path',
    standardVersion: 'CSS Motion Path 1',
    prompt: 'What modern CSS property family allows elements to animate along an arbitrary SVG curve path without JavaScript?',
    code: `.drone {
  offset-path: path("M 20 20 H 100 V 100 H 20 Z");
  animation: fly 4s infinite linear;
}`,
    options: [
      'offset-path (and offset-distance)',
      'motion-curve (and curve-position)',
      'svg-trajectory (and trajectory-step)',
      'path-follow (and path-progress)'
    ],
    correctAnswer: 'offset-path (and offset-distance)',
    acceptedAnswers: ['offset-path (and offset-distance)', 'offset-path'],
    hint: 'offset-path defines the path geometry and offset-distance drives progress along it.',
    explanation: 'CSS Motion Path uses `offset-path` (e.g. `path("M ...")`) to establish a trajectory and `offset-distance: 0%` to `100%` inside keyframes to animate an element along complex curves, including automatic rotation (`offset-rotate`).',
    points: 300,
    estimatedSeconds: 45,
    tags: ['css', 'motion_path', 'animations', 'svg']
  },
  {
    id: 'html-exp-019',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'web_components',
    subtopic: 'form_associated_custom_elements',
    standardVersion: 'HTML5 Living Standard / FACE API',
    prompt: 'How do Form-Associated Custom Elements (FACE) participate in native HTML `<form>` submissions and validation?',
    code: `class CustomInput extends HTMLElement {
  static formAssociated = true;
  constructor() {
    super();
    this.internals = this.attachInternals();
  }
}`,
    options: [
      'By declaring static formAssociated = true and using this.attachInternals() to set form values and validity',
      'By inserting hidden <input> tags dynamically before submit',
      'By intercepting the form onsubmit event on window',
      'By implementing the FormData interface directly on the prototype'
    ],
    correctAnswer: 'By declaring static formAssociated = true and using this.attachInternals() to set form values and validity',
    acceptedAnswers: ['By declaring static formAssociated = true and using this.attachInternals() to set form values and validity'],
    hint: 'attachInternals() returns ElementInternals, enabling native form participation.',
    explanation: 'Form-Associated Custom Elements declare `static formAssociated = true` and call `this.attachInternals()`. Through `ElementInternals`, the component sets its form value (`setFormValue`), reports validity (`setValidity`), and resets naturally alongside built-in inputs.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['html', 'web_components', 'forms', 'element_internals']
  },
  {
    id: 'html-exp-020',
    language: 'html',
    difficulty: 'expert',
    type: 'multiple_choice',
    topic: 'accessibility',
    subtopic: 'roving_tabindex_pattern',
    standardVersion: 'WAI-ARIA Authoring Practices 1.2',
    prompt: 'In composite accessible widgets like toolbars or tablists, what is the "roving tabindex" pattern?',
    code: `<!-- Tablist roving tabindex pattern -->
<div role="tablist">
  <button role="tab" tabindex="0">Active Tab</button>
  <button role="tab" tabindex="-1">Tab 2</button>
  <button role="tab" tabindex="-1">Tab 3</button>
</div>`,
    options: [
      'Only the currently selected item has tabindex="0", while all others have tabindex="-1", with arrow keys moving focus between items',
      'All items rotate tabindex sequentially every second',
      'The entire widget is skipped during keyboard navigation',
      'The widget automatically submits when Tab is pressed'
    ],
    correctAnswer: 'Only the currently selected item has tabindex="0", while all others have tabindex="-1", with arrow keys moving focus between items',
    acceptedAnswers: ['Only the currently selected item has tabindex="0", while all others have tabindex="-1", with arrow keys moving focus between items'],
    hint: 'Roving tabindex ensures a composite component consumes only a single Tab stop.',
    explanation: 'The W3C roving tabindex design pattern keeps only the active item in the sequential tab order (`tabindex="0"`) while all inactive sibling items have `tabindex="-1"`. Users navigate into the widget with Tab, move between items using Arrow keys, and exit with a single Tab press.',
    points: 300,
    estimatedSeconds: 45,
    tags: ['html', 'accessibility', 'aria', 'roving_tabindex', 'keyboard']
  }
];

// Verify count
if (CAMPAIGN_QUESTIONS.length !== 60) {
  throw new Error(`Expected exactly 60 campaign questions, got ${CAMPAIGN_QUESTIONS.length}`);
}

// Write data/html-questions.js
const htmlFilePath = path.join(projectRoot, 'data', 'html-questions.js');
const fileContent = `/**
 * HTML5 & Modern CSS Curriculum Track
 * 60 Hand-Crafted Pedagogical Questions
 * Distributed across Beginner (20), Intermediate (20), and Expert (20)
 */

export const htmlQuestions = ${JSON.stringify(CAMPAIGN_QUESTIONS, null, 2)};
`;

fs.writeFileSync(htmlFilePath, fileContent, 'utf8');
console.log(`Successfully generated ${htmlFilePath} (60 questions).`);

// ============================================================================
// 200 ENDLESS QUESTIONS GENERATION
// ============================================================================
const ENDLESS_TOPICS = [
  {
    topic: 'box_model_math',
    subtopic: 'content_box',
    prompt: 'Under box-sizing: content-box, what is the total computed width of this element?',
    getCode: (i) => `.box {\n  box-sizing: content-box;\n  width: ${100 + i * 5}px;\n  padding: 10px;\n  border: 5px solid black;\n}`,
    ans: (i) => `${(100 + i * 5) + (10 * 2) + (5 * 2)}px`
  },
  {
    topic: 'box_model_math',
    subtopic: 'border_box',
    prompt: 'Under box-sizing: border-box, what is the outer rendered width of this element?',
    getCode: (i) => `.box {\n  box-sizing: border-box;\n  width: ${150 + i * 10}px;\n  padding: 15px;\n  border: 4px solid red;\n}`,
    ans: (i) => `${150 + i * 10}px`
  },
  {
    topic: 'flexbox_math',
    subtopic: 'flex_basis',
    prompt: 'What fraction of a 600px flex container does this item occupy with flex: 1 in a 3-item row?',
    getCode: (i) => `.container { display: flex; width: 600px; gap: 0; }\n.item { flex: 1; }`,
    ans: (i) => '200px'
  },
  {
    topic: 'css_grid',
    subtopic: 'column_count',
    prompt: 'How many columns are generated by this grid template repeat declaration?',
    getCode: (i) => `.grid {\n  display: grid;\n  grid-template-columns: repeat(${(i % 6) + 2}, 1fr);\n}`,
    ans: (i) => String((i % 6) + 2)
  },
  {
    topic: 'css_units',
    subtopic: 'rem_calculation',
    prompt: 'If root font-size is 16px, what is the computed pixel value of this rem size?',
    getCode: (i) => `html { font-size: 16px; }\n.text { font-size: ${(i % 4) + 1}rem; }`,
    ans: (i) => `${((i % 4) + 1) * 16}px`
  },
  {
    topic: 'clamp_math',
    subtopic: 'clamp_evaluation',
    prompt: 'What value does clamp() evaluate to when preferred size is 50px?',
    getCode: (i) => `.text {\n  font-size: clamp(20px, 50px, ${30 + (i % 15)}px);\n}`,
    ans: (i) => `${30 + (i % 15)}px`
  },
  {
    topic: 'specificity_math',
    subtopic: 'class_chain',
    prompt: 'How many class selectors are evaluated in this chained selector?',
    getCode: (i) => `div.${'item.'.repeat((i % 5) + 1).slice(0, -1)} { color: cyan; }`,
    ans: (i) => String((i % 5) + 1)
  },
  {
    topic: 'aspect_ratio_calc',
    subtopic: 'height_resolution',
    prompt: 'For a container with width 400px and aspect-ratio: 2 / 1, what is the computed height?',
    getCode: (i) => `.banner {\n  width: ${200 + (i % 5) * 50}px;\n  aspect-ratio: 2 / 1;\n}`,
    ans: (i) => `${(200 + (i % 5) * 50) / 2}px`
  },
  {
    topic: 'grid_fr_division',
    subtopic: 'fr_ratio',
    prompt: 'In a 900px grid with columns 1fr 2fr, what is the width of the second column?',
    getCode: (i) => `.grid { width: 900px; display: grid; grid-template-columns: 1fr 2fr; gap: 0; }`,
    ans: (i) => '600px'
  },
  {
    topic: 'color_mix_ratio',
    subtopic: 'percentage_mix',
    prompt: 'What percentage of color B remains when mixing 70% color A?',
    getCode: (i) => `.element {\n  background: color-mix(in srgb, red 70%, blue);\n}`,
    ans: (i) => '30%'
  }
];

const endlessHTML = [];
for (let i = 1; i <= 200; i++) {
  const diff = i <= 70 ? 'beginner' : (i <= 140 ? 'intermediate' : 'expert');
  const points = diff === 'beginner' ? 100 : (diff === 'intermediate' ? 200 : 300);
  const tmpl = ENDLESS_TOPICS[(i - 1) % ENDLESS_TOPICS.length];
  const correct = tmpl.ans(i);
  
  const alt1 = tmpl.ans(i + 1);
  const alt2 = tmpl.ans(i + 2);
  const alt3 = '0px';
  const opts = Array.from(new Set([correct, alt1, alt2, alt3])).slice(0, 4);
  while (opts.length < 4) opts.push(`Option_${opts.length}`);

  endlessHTML.push({
    id: `html-end-${pad(i)}`,
    language: 'html',
    difficulty: diff,
    type: 'predict_output',
    topic: tmpl.topic,
    subtopic: tmpl.subtopic,
    standardVersion: 'HTML5 & Modern CSS',
    prompt: tmpl.prompt,
    code: tmpl.getCode(i),
    options: opts,
    correctAnswer: correct,
    acceptedAnswers: [correct],
    hint: `Calculate according to modern CSS layout and formatting standards.`,
    explanation: `Evaluating this CSS rule produces ${correct} in standard browser rendering engines.`,
    points: points,
    estimatedSeconds: 30,
    tags: ['html', 'css', tmpl.topic, 'endless']
  });
}

// Update data/endless-questions.js
const endlessFilePath = path.join(projectRoot, 'data', 'endless-questions.js');
let endlessCode = fs.readFileSync(endlessFilePath, 'utf8');

if (endlessCode.includes('html:')) {
  console.log('HTML already exists in endless-questions.js, skipping append.');
} else {
  const insertIndex = endlessCode.lastIndexOf('};');
  if (insertIndex !== -1) {
    const htmlJson = JSON.stringify(endlessHTML, null, 2);
    const updated = endlessCode.slice(0, insertIndex) + `,\n  html: ${htmlJson}\n` + endlessCode.slice(insertIndex);
    fs.writeFileSync(endlessFilePath, updated, 'utf8');
    console.log(`Successfully added 200 endless questions for HTML & CSS into ${endlessFilePath}.`);
  }
}
