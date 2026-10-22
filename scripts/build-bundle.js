import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Order of concatenation:
const files = [
  'data/python-questions.js',
  'data/c-questions.js',
  'data/cpp-questions.js',
  'data/java-questions.js',
  'data/cyber-questions.js',
  'data/javascript-questions.js',
  'data/rust-questions.js',
  'data/sql-questions.js',
  'data/typescript-questions.js',
  'data/endless-questions.js',
  'js/data/index.js',
  'js/utils.js',
  'js/storage.js',
  'js/profile.js',
  'js/question-validator.js',
  'js/question-bank.js',
  'js/answer-checker.js',
  'js/gamification.js',
  'js/hint-manager.js',
  'js/game-session.js',
  'js/game-engine.js',
  'js/analytics.js',
  'js/audio.js',
  'js/state.js',
  'js/ui.js',
  'js/router.js',
  'js/sandbox-manager.js',
  'js/onboarding.js',
  'js/landing.js',
  'js/gameplay.js',
  'js/app.js'
];

let bundleCode = '/* SyntaxArena Standalone Offline Bundle (Works on file:/// and http://) */\n(function() {\n';

for (const relPath of files) {
  const fullPath = path.join(projectRoot, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Strip static imports: import ... from '...';
  content = content.replace(/^import\s+[^;]+;\s*$/gm, '');

  // Strip dynamic imports: const { X } = await import('...');
  content = content.replace(/const\s+\{\s*([a-zA-Z0-9_]+)\s*\}\s*=\s*await\s+import\([^)]+\);/g, 'const $1 = window.$1;');

  // Convert "export const X" -> "var X = window.X ="
  content = content.replace(/export\s+const\s+([a-zA-Z0-9_]+)\s*=/g, 'var $1 = window.$1 =');

  // Convert "export function X" -> "function X" and attach to window
  content = content.replace(/export\s+function\s+([a-zA-Z0-9_]+)/g, 'window.$1 = $1; function $1');

  // Convert "export class X" -> "var X = window.X = class X"
  content = content.replace(/export\s+class\s+([a-zA-Z0-9_]+)/g, 'var $1 = window.$1 = class $1');

  // Convert "export let X" -> "let X = window.X ="
  content = content.replace(/export\s+let\s+([a-zA-Z0-9_]+)\s*=/g, 'let $1 = window.$1 =');

  // Convert "export default"
  content = content.replace(/export\s+default\s+/g, '');

  bundleCode += `\n/* --- Start of ${relPath} --- */\n` + content + `\n/* --- End of ${relPath} --- */\n`;
}

bundleCode += '\n})();\n';

const outPath = path.join(projectRoot, 'js', 'bundle.js');
fs.writeFileSync(outPath, bundleCode, 'utf8');
console.log('Successfully generated ' + outPath + ' (size: ' + bundleCode.length + ' bytes)');

// Prepare public/ output directory for Vercel and static hosting platforms
const publicDir = path.join(projectRoot, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const staticEntries = [
  'index.html',
  'game.html',
  'sandbox.html',
  'results.html',
  'progress.html',
  'settings.html',
  'favicon.ico',
  'favicon.svg',
  'css',
  'js',
  'data',
  'assets'
];

for (const entry of staticEntries) {
  const src = path.join(projectRoot, entry);
  const dest = path.join(publicDir, entry);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true, force: true });
  }
}
console.log('Successfully prepared public/ output directory for static hosting.');

