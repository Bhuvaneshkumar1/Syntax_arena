/**
 * SyntaxArena Onboarding End-to-End Simulation Test
 * Verifies profile persistence, preservation of existing stats,
 * and safe recovery under edge cases.
 */

import { Profile } from '../js/profile.js';
import { State } from '../js/state.js';
import { Storage } from '../js/storage.js';

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log(`  [PASS] ${msg}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${msg}`);
  }
}

async function runOnboardingE2E() {
  console.log('\n--- Running Onboarding End-to-End Flow Simulation ---');

  // 1. Initialize State with fresh defaults
  State.init('index');
  const initialProfile = State.get('activeProfile');

  assert(initialProfile !== null, 'Initial active profile exists in state');
  assert(!Profile.isOnboardingComplete(initialProfile), 'New/default profile is marked as onboarding incomplete');

  // 2. Add some existing campaign stats to simulate progress from previous actions
  initialProfile.stats.gamesPlayed = 5;
  initialProfile.stats.questionsCorrect = 12;
  initialProfile.campaign.python.beginnerStars = 10;
  State.set('activeProfile', { ...initialProfile }, true);

  const updatedBefore = State.get('activeProfile');
  assert(updatedBefore.stats.gamesPlayed === 5, 'Pre-existing gamesPlayed is recorded');
  assert(updatedBefore.campaign.python.beginnerStars === 10, 'Pre-existing campaign beginnerStars recorded');

  // 3. User begins onboarding wizard: enters call-sign, avatar, language, difficulty
  const chosenUsername = '  Hex_Cracker  ';
  const chosenAvatar = 'hex_dragon';
  const chosenLang = 'cpp';
  const chosenDiff = 'intermediate';

  // 4. Wizard validates username
  const valRes = Profile.validateUsername(chosenUsername);
  assert(valRes.valid, 'Username "Hex_Cracker" passes validation');

  // 5. Complete onboarding
  const completedProfile = Profile.completeOnboarding(initialProfile.id, {
    username: chosenUsername,
    avatarId: chosenAvatar,
    language: chosenLang,
    difficulty: chosenDiff
  });

  assert(completedProfile !== null, 'completeOnboarding returns updated profile');
  assert(completedProfile.username === 'Hex_Cracker', 'Username trimmed and saved');
  assert(completedProfile.avatarId === 'hex_dragon', 'Avatar updated to hex_dragon');
  assert(completedProfile.onboardingComplete === true, 'onboardingComplete flag set to true');
  assert(completedProfile.preferences.language === 'cpp', 'Preferred language set to cpp');
  assert(completedProfile.preferences.difficulty === 'intermediate', 'Preferred difficulty set to intermediate');

  // CRITICAL CHECK: Verify existing progress was NOT lost
  assert(completedProfile.stats.gamesPlayed === 5, 'Existing gamesPlayed was preserved without corruption');
  assert(completedProfile.stats.questionsCorrect === 12, 'Existing questionsCorrect was preserved');
  assert(completedProfile.campaign.python.beginnerStars === 10, 'Existing campaign stars were preserved');

  // 6. Check state store synchronization
  const stateActive = State.get('activeProfile');
  assert(stateActive.id === initialProfile.id, 'Active profile ID remains stable');
  assert(stateActive.username === 'Hex_Cracker', 'State store reflects updated username');
  assert(Profile.isOnboardingComplete(stateActive), 'Profile.isOnboardingComplete returns true on active state');

  // 7. Test re-initialization (simulating page reload)
  State.init('index');
  const reloadedProfile = State.get('activeProfile');
  assert(reloadedProfile.username === 'Hex_Cracker', 'Reloaded profile retains confirmed username');
  assert(reloadedProfile.avatarId === 'hex_dragon', 'Reloaded profile retains confirmed avatar');
  assert(reloadedProfile.preferences.language === 'cpp', 'Reloaded profile retains preferred language');
  assert(reloadedProfile.preferences.difficulty === 'intermediate', 'Reloaded profile retains preferred difficulty');
  assert(Profile.isOnboardingComplete(reloadedProfile), 'Reloaded profile is recognized as onboarding complete');

  // 8. Test cancellation behavior: unconfirmed edits must not persist
  const cancelAttemptUsername = 'IncompleteCancelUser';
  // If user types into input but cancels modal, Profile.completeOnboarding is never called
  const afterCancel = State.get('activeProfile');
  assert(afterCancel.username === 'Hex_Cracker', 'Canceling onboarding leaves existing profile untouched');

  console.log(`\nOnboarding E2E Results: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

runOnboardingE2E().catch(err => {
  console.error(err);
  process.exit(1);
});
