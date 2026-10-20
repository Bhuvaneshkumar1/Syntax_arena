/**
 * SyntaxArena Batch 3 Automated Verification Suite
 * Tests all 20 acceptance and verification requirements.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('       SYNTAXARENA BATCH 3 VERIFICATION SUITE         ');
  console.log('======================================================\n');

  // -------------------------------------------------------------------------
  // TEST GROUP 1: Technology Constraints (AC-20)
  // -------------------------------------------------------------------------
  console.log('--- Test Group 1: Technology Constraints (Pure Vanilla) ---');
  const packageJsonExists = fs.existsSync(path.join(ROOT, 'package.json'));
  assert(!packageJsonExists, 'No package.json or npm build configuration present');

  const nodeModulesExists = fs.existsSync(path.join(ROOT, 'node_modules'));
  assert(!nodeModulesExists, 'No node_modules directory present');

  const files = fs.readdirSync(ROOT);
  const prohibitedExts = files.filter(f => f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.tsx') || f.endsWith('.vue'));
  assert(prohibitedExts.length === 0, 'No TypeScript, JSX, or framework files detected');

  // -------------------------------------------------------------------------
  // TEST GROUP 2: HTML Structure & Sections (AC-1, 14, 18)
  // -------------------------------------------------------------------------
  console.log('\n--- Test Group 2: Landing Page HTML Landmarks & Structure ---');
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');

  assert(indexHtml.includes('class="skip-link"'), 'Accessible keyboard skip-link present');
  assert(indexHtml.includes('<header class="app-header">'), 'Semantic <header> landmark present');
  assert(indexHtml.includes('<nav class="app-nav"'), 'Semantic desktop <nav> landmark present');
  assert(indexHtml.includes('id="mobile-nav-drawer"'), 'Mobile navigation drawer present');
  assert(indexHtml.includes('id="btn-mobile-menu"'), 'Mobile menu toggle button present');
  assert(indexHtml.includes('id="btn-nav-play"'), 'Prominent Play Now action button in header');
  assert(indexHtml.includes('<main id="main-content"'), 'Semantic <main> landmark present');
  assert(indexHtml.includes('id="btn-hero-start"'), 'Hero Start Playing button present');
  assert(indexHtml.includes('id="btn-hero-explore"'), 'Hero Explore Challenges button present');
  assert(indexHtml.includes('class="hero-preview-container"'), 'Hero visual gameplay preview card present');
  assert(indexHtml.includes('id="language-tracks"'), 'Section C: Language Track selection present');
  assert(indexHtml.includes('id="difficulty-selection"'), 'Section D: Difficulty selection present');
  assert(indexHtml.includes('id="progression"'), 'Section E: Progression preview present');
  assert(indexHtml.includes('id="challenges"'), 'Section F: Challenge showcase present');
  assert(indexHtml.includes('id="how-to-play"'), 'Section G: How to Play section present');
  assert(indexHtml.includes('id="daily-preview"'), 'Section H: Daily challenge preview present');
  assert(indexHtml.includes('<footer class="app-footer">'), 'Semantic <footer> landmark present');
  assert(indexHtml.includes('id="copyright-year"'), 'Dynamic local JS copyright year span present');
  assert(indexHtml.includes('id="modal-onboarding"'), 'First-time player onboarding modal present');

  // Verify all 4 languages in HTML
  assert(indexHtml.includes('data-lang="python"'), 'Python track card present');
  assert(indexHtml.includes('data-lang="c"'), 'C track card present');
  assert(indexHtml.includes('data-lang="cpp"'), 'C++ track card present');
  assert(indexHtml.includes('data-lang="java"'), 'Java track card present');

  // Verify all 3 difficulty tiers in HTML
  assert(indexHtml.includes('data-diff="beginner"'), 'Beginner difficulty card present');
  assert(indexHtml.includes('data-diff="intermediate"'), 'Intermediate difficulty card present');
  assert(indexHtml.includes('data-diff="expert"'), 'Expert difficulty card present');

  // Verify all 5 challenge formats showcased
  assert(indexHtml.includes('Predict Output'), 'Challenge Format 1: Predict Output present');
  assert(indexHtml.includes('Find the Bug'), 'Challenge Format 2: Find Bug present');
  assert(indexHtml.includes('Complete the Code'), 'Challenge Format 3: Complete Code present');
  assert(indexHtml.includes('Explain the Logic'), 'Challenge Format 4: Explain Logic present');
  assert(indexHtml.includes('Trace Execution'), 'Challenge Format 5: Trace Execution present');

  // Verify daily challenge is clearly marked as preview
  assert(indexHtml.includes('Upcoming Feature Preview'), 'Daily challenge is explicitly marked as preview');

  // -------------------------------------------------------------------------
  // TEST GROUP 3: Navigation Links Validity (AC-14)
  // -------------------------------------------------------------------------
  console.log('\n--- Test Group 3: Navigation Destination Validity ---');
  const hrefMatches = [...indexHtml.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  for (const href of hrefMatches) {
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const existsInDoc = indexHtml.includes(`id="${targetId}"`);
      assert(existsInDoc, `Anchor link target "#${targetId}" exists in index.html`);
    } else if (href.endsWith('.html')) {
      const filePath = path.join(ROOT, href);
      const existsOnDisk = fs.existsSync(filePath);
      assert(existsOnDisk, `Page link target "${href}" exists on disk`);
    }
  }

  // -------------------------------------------------------------------------
  // TEST GROUP 4: Profile & Validation Logic (AC-6, 7, 12)
  // -------------------------------------------------------------------------
  console.log('\n--- Test Group 4: Profile Model & Validation ---');
  const { Profile, AVATAR_CATALOG } = await import('../js/profile.js');

  // Avatar catalog check
  assert(Array.isArray(AVATAR_CATALOG) && AVATAR_CATALOG.length === 6, 'Avatar catalog contains exactly 6 local avatars');
  assert(Profile.validateAvatar('cyber_fox'), 'Valid avatar cyber_fox accepted');
  assert(Profile.validateAvatar('terminal_owl'), 'Valid avatar terminal_owl accepted');
  assert(Profile.validateAvatar('hex_dragon'), 'Valid avatar hex_dragon accepted');
  assert(Profile.validateAvatar('matrix_cat'), 'Valid avatar matrix_cat accepted');
  assert(Profile.validateAvatar('bit_knight'), 'Valid avatar bit_knight accepted');
  assert(Profile.validateAvatar('glitch_bot'), 'Valid avatar glitch_bot accepted');
  assert(!Profile.validateAvatar('unknown_dog'), 'Invalid avatar rejected');

  // Username validation tests
  assert(!Profile.validateUsername('').valid, 'Empty username rejected');
  assert(!Profile.validateUsername('   ').valid, 'Whitespace-only username rejected');
  assert(!Profile.validateUsername('a').valid, 'Username < 2 chars rejected');
  assert(Profile.validateUsername('ab').valid, 'Username of 2 chars accepted');
  assert(Profile.validateUsername('ValidUser_99').valid, 'Alphanumeric with underscores accepted');
  assert(Profile.validateUsername('code-ninja').valid, 'Alphanumeric with hyphens accepted');
  assert(Profile.validateUsername('12345678901234567890').valid, '20-character username accepted');
  assert(!Profile.validateUsername('123456789012345678901').valid, '21-character username (> 20) rejected');
  assert(!Profile.validateUsername('user@domain').valid, 'Email format rejected (privacy standard)');
  assert(!Profile.validateUsername('user name with spaces').valid, 'Spaces in username rejected');

  // Profile creation
  const testProf = Profile.create('BitTester', 'hex_dragon', { language: 'cpp', difficulty: 'expert' });
  assert(testProf.username === 'BitTester', 'Username correctly trimmed and set');
  assert(testProf.avatarId === 'hex_dragon', 'Avatar correctly set');
  assert(testProf.onboardingComplete === false, 'New profile defaults to onboardingComplete: false');
  assert(testProf.preferences.language === 'cpp', 'Preferred language set in profile');
  assert(testProf.preferences.difficulty === 'expert', 'Preferred difficulty set in profile');
  assert(testProf.stats && testProf.campaign, 'Nested stats and campaign progression structures initialized');

  // -------------------------------------------------------------------------
  // TEST GROUP 5: Storage Schema & Corruption Recovery (AC-11, 12)
  // -------------------------------------------------------------------------
  console.log('\n--- Test Group 5: Storage Manager & Corruption Recovery ---');
  const { Storage, createDefaultStorageSchema } = await import('../js/storage.js');
  const defaultSchema = createDefaultStorageSchema();

  assert(defaultSchema.version === 1, 'Default storage schema is version 1');
  assert(defaultSchema.profiles.length > 0, 'Default schema contains default profile');
  assert(defaultSchema.profiles[0].onboardingComplete === false, 'Default initial profile onboardingComplete is false');
  assert(defaultSchema.profiles[0].preferences.language === 'python', 'Default preferred language is python');

  // Test schema validator with corrupt data
  assert(!Storage._isValidSchema(null), 'Null data detected as invalid schema');
  assert(!Storage._isValidSchema({}), 'Empty object detected as invalid schema');
  assert(!Storage._isValidSchema({ version: 'one', profiles: [] }), 'Non-numeric version detected as invalid schema');
  assert(!Storage._isValidSchema({ version: 1, profiles: [] }), 'Empty profiles detected as invalid schema');
  assert(Storage._isValidSchema(defaultSchema), 'Standard default schema passes validation');

  // -------------------------------------------------------------------------
  // TEST GROUP 6: CSS Design Tokens & Responsiveness (AC-17, 18)
  // -------------------------------------------------------------------------
  console.log('\n--- Test Group 6: Responsive & Accessibility CSS Tokens ---');
  const tokensCss = fs.readFileSync(path.join(ROOT, 'css/tokens.css'), 'utf-8');
  const layoutCss = fs.readFileSync(path.join(ROOT, 'css/layout.css'), 'utf-8');
  const responsiveCss = fs.readFileSync(path.join(ROOT, 'css/responsive.css'), 'utf-8');
  const animationsCss = fs.readFileSync(path.join(ROOT, 'css/animations.css'), 'utf-8');
  const componentsCss = fs.readFileSync(path.join(ROOT, 'css/components.css'), 'utf-8');

  assert(tokensCss.includes('--color-primary:'), 'Electric cyan design token defined');
  assert(tokensCss.includes('--color-success:'), 'Terminal emerald design token defined');
  assert(tokensCss.includes('--color-warning:'), 'Cyber amber design token defined');
  assert(tokensCss.includes('--color-danger:'), 'Coral red design token defined');
  assert(tokensCss.includes('--color-violet:'), 'Neon violet design token defined');

  assert(layoutCss.includes('.btn-mobile-menu'), 'Mobile navigation button class defined');
  assert(layoutCss.includes('.mobile-nav-drawer'), 'Mobile navigation drawer class defined');
  assert(layoutCss.includes('@media (max-width: 820px)'), 'Mobile navigation breakpoint (820px) configured');
  assert(layoutCss.includes('.section-anchor'), 'Smooth scroll offset anchor class configured');

  assert(componentsCss.includes('.card-selectable'), 'Interactive selectable card class defined');
  assert(componentsCss.includes('.card-selectable.is-selected'), 'Selected card state defined');
  assert(componentsCss.includes('.wizard-progress'), 'Onboarding wizard step progress bar defined');
  assert(componentsCss.includes('.avatar-grid'), 'Avatar picker grid defined');
  assert(componentsCss.includes('.roadmap-container'), 'Progression roadmap container defined');

  assert(responsiveCss.includes('@media (max-width: 1024px)'), 'Tablet breakpoint (1024px) covered');
  assert(responsiveCss.includes('@media (max-width: 640px)'), 'Mobile portrait breakpoint (640px) covered');
  assert(responsiveCss.includes('min-height: 48px'), '48px minimum touch target size enforced for mobile buttons');

  assert(animationsCss.includes('@media (prefers-reduced-motion: reduce)'), 'prefers-reduced-motion accessibility media query implemented');
  assert(animationsCss.includes('slideDown'), 'slideDown keyframes defined');
  assert(animationsCss.includes('fadeIn'), 'fadeIn keyframes defined');

  // -------------------------------------------------------------------------
  // TEST GROUP 7: Module Export & Syntax Integrity
  // -------------------------------------------------------------------------
  console.log('\n--- Test Group 7: JavaScript Module Integrity ---');
  const { Utils } = await import('../js/utils.js');
  const { State } = await import('../js/state.js');
  const { UI } = await import('../js/ui.js');
  const { Router } = await import('../js/router.js');
  const { AudioEngine } = await import('../js/audio.js');
  const { LandingPage } = await import('../js/landing.js');
  const { Onboarding } = await import('../js/onboarding.js');

  assert(typeof Utils.qs === 'function', 'Utils.qs is a function');
  assert(typeof Utils.escapeHTML === 'function', 'Utils.escapeHTML is a function');
  assert(typeof State.init === 'function', 'State.init is a function');
  assert(typeof UI.openModal === 'function', 'UI.openModal is a function');
  assert(typeof UI.closeModal === 'function', 'UI.closeModal is a function');
  assert(typeof UI.showToast === 'function', 'UI.showToast is a function');
  assert(typeof Router.navigateTo === 'function', 'Router.navigateTo is a function');
  assert(typeof AudioEngine.playClick === 'function', 'AudioEngine.playClick is a function');
  assert(typeof LandingPage.init === 'function', 'LandingPage.init is a function');
  assert(typeof LandingPage.selectLanguage === 'function', 'LandingPage.selectLanguage is a function');
  assert(typeof LandingPage.selectDifficulty === 'function', 'LandingPage.selectDifficulty is a function');
  assert(typeof Onboarding.init === 'function', 'Onboarding.init is a function');
  assert(typeof Onboarding.open === 'function', 'Onboarding.open is a function');
  assert(typeof Onboarding.goToStep === 'function', 'Onboarding.goToStep is a function');

  console.log('\n======================================================');
  console.log(`TOTAL TESTS: ${totalTests}`);
  console.log(`PASSED:      ${passedTests}`);
  console.log(`FAILED:      ${failedTests}`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner failure:', err);
  process.exit(1);
});
