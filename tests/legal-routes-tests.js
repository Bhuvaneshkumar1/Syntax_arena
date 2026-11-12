/**
 * Automated Verification Suite for Legal Routes & Google OAuth Compliance
 * Verifies:
 * 1. vercel.json routing configuration for /privacy and /terms
 * 2. privacy.html & public/privacy.html structure and Google API Limited Use compliance
 * 3. terms.html & public/terms.html structure and user agreement clauses
 * 4. Auth modal & footer links to Privacy Policy and Terms of Service across pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('============================================================');
console.log('📜 RUNNING LEGAL ROUTES & GOOGLE OAUTH COMPLIANCE TEST SUITE');
console.log('============================================================\n');

// 1. vercel.json Rewrites
console.log('--- 1. vercel.json Route Rewrites ---');
const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const rewrites = vercelConfig.rewrites || [];
const privacyRewrite = rewrites.find(r => r.source === '/privacy');
const termsRewrite = rewrites.find(r => r.source === '/terms');

assert(privacyRewrite !== undefined, 'vercel.json contains dedicated rewrite for /privacy');
assert(privacyRewrite?.destination === '/privacy.html', '/privacy rewrites to /privacy.html');
assert(termsRewrite !== undefined, 'vercel.json contains dedicated rewrite for /terms');
assert(termsRewrite?.destination === '/terms.html', '/terms rewrites to /terms.html');

// 2. Privacy Policy Content & Google Compliance
console.log('\n--- 2. Privacy Policy Google OAuth Verification Standards ---');
const privacyHtml = fs.readFileSync(path.join(root, 'privacy.html'), 'utf8');
const publicPrivacyHtml = fs.readFileSync(path.join(root, 'public', 'privacy.html'), 'utf8');

assert(fs.existsSync(path.join(root, 'privacy.html')), 'privacy.html exists in root');
assert(fs.existsSync(path.join(root, 'public', 'privacy.html')), 'public/privacy.html exists in public output directory');
assert(privacyHtml.includes('Google API Services User Data Policy'), 'Contains explicit reference to Google API Services User Data Policy');
assert(privacyHtml.includes('Limited Use requirements'), 'Contains mandatory Google Limited Use requirements clause');
assert(privacyHtml.includes('https://syntaxarena-phi.vercel.app'), 'References the deployed application domain');
assert(privacyHtml.includes('support@syntaxarena.cloud'), 'Includes contact support email');
assert(privacyHtml.includes('https://myaccount.google.com/permissions'), 'Provides link to revoke Google account permissions');
assert(privacyHtml.includes('Zero-Sale Guarantee'), 'Contains explicit zero-sale data guarantee');
assert(publicPrivacyHtml === privacyHtml, 'Root privacy.html and public/privacy.html are synchronized');

// 3. Terms of Service Content
console.log('\n--- 3. Terms of Service Standards ---');
const termsHtml = fs.readFileSync(path.join(root, 'terms.html'), 'utf8');
const publicTermsHtml = fs.readFileSync(path.join(root, 'public', 'terms.html'), 'utf8');

assert(fs.existsSync(path.join(root, 'terms.html')), 'terms.html exists in root');
assert(fs.existsSync(path.join(root, 'public', 'terms.html')), 'public/terms.html exists in public output directory');
assert(termsHtml.includes('SyntaxArena Terms of Service'), 'Contains Terms of Service document title');
assert(termsHtml.includes('Fair Play & Code of Conduct'), 'Contains fair play and anti-exploit section');
assert(termsHtml.includes('Intellectual Property'), 'Specifies user code ownership and platform asset licensing');
assert(termsHtml.includes('Disclaimer of Warranties'), 'Contains standard educational platform warranty disclaimer');
assert(termsHtml.includes('Limitation of Liability'), 'Contains limitation of liability clause');
assert(publicTermsHtml === termsHtml, 'Root terms.html and public/terms.html are synchronized');

// 4. In-App Navigation Links
console.log('\n--- 4. App Shell & Auth Modal Disclosures ---');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(indexHtml.includes('href="privacy.html"'), 'index.html footer links to privacy.html');
assert(indexHtml.includes('href="terms.html"'), 'index.html footer links to terms.html');
assert(indexHtml.includes('Terms of Service') && indexHtml.includes('Privacy Policy'), 'index.html Auth modal has terms and privacy agreement disclaimer');

console.log('\n============================================================');
console.log(`LEGAL SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
console.log('============================================================\n');

if (failed > 0) process.exit(1);
