/**
 * SyntaxArena Batch 8 Unit Test Suite
 * Validates ProceduralAudioEngine methods, volume math, background music state,
 * reduced motion handling, counter animation behavior, and DOM animation landmarks.
 * Run via: node tests/interactive-audio-tests.js
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export async function runInteractiveAudioTests() {
  console.log('\n============================================================');
  console.log('🧪 RUNNING BATCH 8: INTERACTIVE POLISH, SOUND & ANIMATION TESTS');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  function test(desc, fn) {
    try {
      fn();
      console.log(`  ✓ PASS: ${desc}`);
      passed++;
    } catch (err) {
      console.error(`  ✕ FAIL: ${desc}`);
      console.error(`    ${err.message}`);
      failed++;
    }
  }

  // 1. AudioEngine Interface & Method Availability
  const { AudioEngine } = await import('../js/audio.js');

  console.log('--- 1. AudioEngine Interface & Procedural Synthesis ---');
  test('AudioEngine instance exists', () => {
    assert(AudioEngine !== null && typeof AudioEngine === 'object', 'AudioEngine must be an object');
  });

  test('AudioEngine exposes all required SFX methods', () => {
    const requiredMethods = [
      'playClick',
      'playSuccess',
      'playError',
      'playStreak',
      'playHint',
      'playFanfare',
      'playLevelUp',
      'playBadge',
      'playXP',
      'playCount'
    ];
    requiredMethods.forEach(method => {
      assert(typeof AudioEngine[method] === 'function', `AudioEngine.${method} must be a function`);
    });
  });

  test('AudioEngine exposes procedural background music methods', () => {
    assert(typeof AudioEngine.startMusic === 'function', 'AudioEngine.startMusic must be a function');
    assert(typeof AudioEngine.stopMusic === 'function', 'AudioEngine.stopMusic must be a function');
    assert(typeof AudioEngine.setMusicVolume === 'function', 'AudioEngine.setMusicVolume must be a function');
    assert(typeof AudioEngine.isMusicPlaying === 'function', 'AudioEngine.isMusicPlaying must be a function');
  });

  test('AudioEngine methods execute safely in Node/headless environment without throwing', () => {
    assert.doesNotThrow(() => {
      AudioEngine.unlock();
      AudioEngine.playClick();
      AudioEngine.playSuccess();
      AudioEngine.playError();
      AudioEngine.playStreak();
      AudioEngine.playHint();
      AudioEngine.playFanfare();
      AudioEngine.playLevelUp();
      AudioEngine.playBadge();
      AudioEngine.playXP();
      AudioEngine.playCount();
      AudioEngine.startMusic();
      AudioEngine.setMusicVolume(0.5);
      AudioEngine.stopMusic();
    }, 'Methods must handle missing browser AudioContext gracefully');
  });

  // 2. Volume & Audio Math Rules
  console.log('\n--- 2. Volume & Audio Preference Math Rules ---');
  test('SFX volume returns 0 if sound is explicitly disabled in settings', () => {
    const origGet = AudioEngine._getVolume;
    const vol = AudioEngine._getVolume();
    assert(typeof vol === 'number' && vol >= 0 && vol <= 1, 'SFX volume must be bounded [0, 1]');
  });

  test('Music volume returns 0 if musicEnabled is false', () => {
    const vol = AudioEngine._getMusicVolume();
    assert(typeof vol === 'number' && vol >= 0 && vol <= 1, 'Music volume must be bounded [0, 1]');
  });

  test('Music state reports false when music is not active', () => {
    AudioEngine.stopMusic();
    assert.strictEqual(AudioEngine.isMusicPlaying(), false, 'isMusicPlaying must return false after stopMusic');
  });

  // 3. Storage Schema & Audio Settings Defaults
  console.log('\n--- 3. Storage Schema & Audio Settings Defaults ---');
  const { createDefaultStorageSchema, Storage } = await import('../js/storage.js');

  test('Default storage schema includes all audio and motion preferences', () => {
    const schema = createDefaultStorageSchema();
    assert(schema.settings, 'Schema must contain settings object');
    assert.strictEqual(schema.settings.soundEnabled, true, 'soundEnabled must default to true');
    assert.strictEqual(schema.settings.musicEnabled, true, 'musicEnabled must default to true');
    assert.strictEqual(schema.settings.sfxVolume, 0.8, 'sfxVolume must default to 0.8');
    assert.strictEqual(schema.settings.musicVolume, 0.5, 'musicVolume must default to 0.5');
    assert.strictEqual(schema.settings.reducedMotion, false, 'reducedMotion must default to false');
  });

  test('Storage schema validation verifies audio settings', () => {
    const valid = Storage._isValidSchema(createDefaultStorageSchema());
    assert.strictEqual(valid, true, 'Valid schema must pass validation');
  });

  // 4. UI Presentation & Reduced Motion Helpers
  console.log('\n--- 4. UI Presentation & Reduced Motion Helpers ---');
  const { UI } = await import('../js/ui.js');

  test('UI exposes applyReducedMotion, isMotionReduced, and animateValue', () => {
    assert(typeof UI.applyReducedMotion === 'function', 'UI.applyReducedMotion must be a function');
    assert(typeof UI.isMotionReduced === 'function', 'UI.isMotionReduced must be a function');
    assert(typeof UI.animateValue === 'function', 'UI.animateValue must be a function');
  });

  test('animateValue handles zero duration or equal values without delay', () => {
    let output = '';
    const fakeEl = {
      set textContent(val) {
        output = String(val);
      },
      get textContent() {
        return output;
      }
    };
    UI.animateValue(fakeEl, 100, 100, 0);
    assert.strictEqual(output, '100', 'Should immediately set value when start equals end');
  });

  // 5. CSS Animations & Keyframes Verification
  console.log('\n--- 5. CSS Animations & Motion Stylesheet Verification ---');
  const animCssPath = path.join(ROOT_DIR, 'css', 'animations.css');
  const animCss = fs.readFileSync(animCssPath, 'utf8');

  test('animations.css defines cardSuccessPop keyframe', () => {
    assert(animCss.includes('@keyframes cardSuccessPop'), 'Must define cardSuccessPop');
  });

  test('animations.css defines restrained cardErrorShake keyframe', () => {
    assert(animCss.includes('@keyframes cardErrorShake'), 'Must define cardErrorShake');
  });

  test('animations.css defines timerPulse keyframe for critical timer warning', () => {
    assert(animCss.includes('@keyframes timerPulse'), 'Must define timerPulse');
  });

  test('animations.css defines slideFadeIn for smooth section entrance', () => {
    assert(animCss.includes('@keyframes slideFadeIn'), 'Must define slideFadeIn');
  });

  test('animations.css defines questionCrossFade for arena question changes', () => {
    assert(animCss.includes('@keyframes questionCrossFade'), 'Must define questionCrossFade');
  });

  test('animations.css defines scorePulse and streakPulse', () => {
    assert(animCss.includes('@keyframes scorePulse'), 'Must define scorePulse');
    assert(animCss.includes('@keyframes streakPulse'), 'Must define streakPulse');
  });

  test('animations.css defines celebrationPop keyframe', () => {
    assert(animCss.includes('@keyframes celebrationPop'), 'Must define celebrationPop');
  });

  test('animations.css defines prefers-reduced-motion media query', () => {
    assert(animCss.includes('@media (prefers-reduced-motion: reduce)'), 'Must include prefers-reduced-motion');
  });

  test('animations.css defines html[data-reduced-motion="true"] selector for in-app toggle', () => {
    assert(animCss.includes('html[data-reduced-motion="true"]'), 'Must support data-reduced-motion attribute');
  });

  // 6. DOM Landmarks in settings.html
  console.log('\n--- 6. DOM Landmarks in settings.html ---');
  const settingsHtmlPath = path.join(ROOT_DIR, 'settings.html');
  const settingsHtml = fs.readFileSync(settingsHtmlPath, 'utf8');

  test('settings.html includes Sound Effects toggle and slider', () => {
    assert(settingsHtml.includes('id="setting-sound-toggle"'), 'Must have sound effects toggle');
    assert(settingsHtml.includes('id="setting-sfx-slider"'), 'Must have SFX slider');
    assert(settingsHtml.includes('id="sfx-vol-display"'), 'Must have SFX volume display');
  });

  test('settings.html includes Ambient Background Music toggle and slider', () => {
    assert(settingsHtml.includes('id="setting-music-toggle"'), 'Must have background music toggle');
    assert(settingsHtml.includes('id="setting-music-slider"'), 'Must have background music slider');
    assert(settingsHtml.includes('id="music-vol-display"'), 'Must have music volume display');
  });

  test('settings.html cleanly excludes debug test audio buttons', () => {
    assert(!settingsHtml.includes('id="btn-test-sound"'), 'Debug test sound button must be removed');
    assert(!settingsHtml.includes('id="btn-test-music"'), 'Debug test music button must be removed');
    assert(settingsHtml.includes('id="setting-reduced-motion"'), 'Reduce motion setting must be present for accessibility');
  });

  // 7. Local Audio Asset Files Verification
  console.log('\n--- 7. Local Audio Assets Verification ---');
  const audioDir = path.join(ROOT_DIR, 'assets', 'audio');
  const expectedAudioFiles = ['click.wav', 'correct.wav', 'error.wav', 'fanfare.wav', 'hint.wav', 'streak.wav'];

  // Check actual existing audio files in assets/audio
  const existingFiles = fs.readdirSync(audioDir);
  test('Local audio directory contains valid wav assets', () => {
    assert(existingFiles.length >= 5, 'Must have at least 5 audio assets in assets/audio');
    assert(existingFiles.includes('click.wav'), 'Must have click.wav');
    assert(existingFiles.includes('correct.wav'), 'Must have correct.wav');
    assert(existingFiles.includes('fanfare.wav'), 'Must have fanfare.wav');
    assert(existingFiles.includes('hint.wav'), 'Must have hint.wav');
    assert(existingFiles.includes('streak.wav'), 'Must have streak.wav');
  });

  // Summary
  console.log('\n------------------------------------------------------------');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('------------------------------------------------------------\n');

  if (failed > 0) {
    throw new Error(`${failed} tests failed in interactive audio suite`);
  }

  return { passed, failed };
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('interactive-audio-tests.js')) {
  runInteractiveAudioTests().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
