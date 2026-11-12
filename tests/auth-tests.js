/**
 * Unit Test Suite for SyntaxArena Authentication & Cloud Sync Manager (Item 14)
 * Verifies email validation, password hashing, multi-provider OAuth,
 * account linking, and isolated storage integrity.
 */

import { AuthManager, hashPassword, AUTH_STORAGE_KEY } from '../js/auth.js';

async function runAuthTests() {
  console.log('============================================================');
  console.log('🛡️ RUNNING SYNTAXARENA AUTHENTICATION & SYNC TEST SUITE');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  const originalWindow = globalThis.window;
  const mockStorage = new Map();
  globalThis.window = {
    ...(originalWindow || {}),
    localStorage: {
      getItem: (k) => mockStorage.get(k) || null,
      setItem: (k, v) => mockStorage.set(k, String(v)),
      removeItem: (k) => mockStorage.delete(k),
      clear: () => mockStorage.clear()
    }
  };

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // 1. Password Hashing & Salt Verification
    // -------------------------------------------------------------
    console.log('--- 1. Password Hashing & Salt Verification ---');
    const hash1 = await hashPassword('CyberSecret123', 'salt_alpha');
    const hash2 = await hashPassword('CyberSecret123', 'salt_alpha');
    const hashDiffSalt = await hashPassword('CyberSecret123', 'salt_beta');
    const hashDiffPwd = await hashPassword('OtherSecret456', 'salt_alpha');

    assert(typeof hash1 === 'string' && hash1.length >= 16, 'Password hash is a valid non-empty hex string');
    assert(hash1 === hash2, 'Deterministic hashing with identical password and salt matches');
    assert(hash1 !== hashDiffSalt, 'Different salt produces completely different hash');
    assert(hash1 !== hashDiffPwd, 'Different password produces completely different hash');

    // -------------------------------------------------------------
    // 2. AuthManager Initialization & Guest Mode
    // -------------------------------------------------------------
    console.log('\n--- 2. AuthManager Initialization & Guest Mode ---');
    const auth = new AuthManager();
    await auth.init();

    assert(auth.isInitialized === true, 'AuthManager initializes successfully');
    assert(auth.isAuthenticated() === false, 'Fresh instance starts in unauthenticated Guest Mode');
    assert(auth.getCurrentUser() === null, 'Current user is null initially');
    assert(auth.getSyncDetails().status === 'guest', 'Sync status reports guest');

    // -------------------------------------------------------------
    // 3. Email & Password Sign Up Validation
    // -------------------------------------------------------------
    console.log('\n--- 3. Email & Password Sign Up Validation ---');
    let threwInvalidEmail = false;
    try {
      await auth.signUpWithEmail('invalid-email-address', 'password123');
    } catch (_) {
      threwInvalidEmail = true;
    }
    assert(threwInvalidEmail, 'Rejects invalid email format');

    let threwShortPwd = false;
    try {
      await auth.signUpWithEmail('coder@syntaxarena.cloud', '123');
    } catch (_) {
      threwShortPwd = true;
    }
    assert(threwShortPwd, 'Rejects short password under 6 characters');

    // Successful Sign Up
    const user = await auth.signUpWithEmail('neo@syntaxarena.cloud', 'MatrixPass2026', 'NeoTheHacker');
    assert(user !== null && user.id.startsWith('usr'), 'New user account created with unique ID');
    assert(user.email === 'neo@syntaxarena.cloud', 'Clean email stored');
    assert(user.displayName === 'NeoTheHacker', 'Display name recorded');
    assert(auth.isAuthenticated() === true, 'User is now authenticated');
    assert(auth.getSyncDetails().status === 'synced', 'Sync status reports synced');

    // Reject duplicate email
    let threwDuplicate = false;
    try {
      await auth.signUpWithEmail('neo@syntaxarena.cloud', 'NewPass12345');
    } catch (_) {
      threwDuplicate = true;
    }
    assert(threwDuplicate, 'Rejects duplicate email signup');

    // -------------------------------------------------------------
    // 4. Sign Out & Sign In
    // -------------------------------------------------------------
    console.log('\n--- 4. Sign Out & Sign In ---');
    auth.signOut();
    assert(auth.isAuthenticated() === false, 'Sign out transitions safely back to guest');
    assert(auth.getCurrentUser() === null, 'Active user cleared on signout');

    // Incorrect password
    let threwWrongPwd = false;
    try {
      await auth.signInWithEmail('neo@syntaxarena.cloud', 'WrongPass0000');
    } catch (_) {
      threwWrongPwd = true;
    }
    assert(threwWrongPwd, 'Rejects sign in with wrong password');

    // Correct password
    const loggedIn = await auth.signInWithEmail('neo@syntaxarena.cloud', 'MatrixPass2026');
    assert(loggedIn.id === user.id, 'Sign in succeeds with correct credentials');
    assert(auth.isAuthenticated() === true, 'State becomes authenticated');

    // -------------------------------------------------------------
    // 5. Multi-Provider OAuth (Google, GitHub, Apple ID)
    // -------------------------------------------------------------
    console.log('\n--- 5. Multi-Provider OAuth (Google, GitHub, Apple ID) ---');
    
    // Google OAuth
    const googleUser = await auth.signInWithProvider('google', {
      email: 'alex.google@gmail.com',
      displayName: 'Alex G'
    });
    assert(googleUser.provider === 'google', 'Google OAuth user created with provider google');
    assert(auth.getCurrentUser().email === 'alex.google@gmail.com', 'Google user becomes active session');

    // GitHub OAuth
    const ghUser = await auth.signInWithProvider('github', {
      email: 'octocat.dev@github.com',
      displayName: 'Octocat'
    });
    assert(ghUser.provider === 'github', 'GitHub OAuth user created with provider github');
    assert(auth.getCurrentUser().displayName === 'Octocat', 'GitHub user becomes active session');

    // Apple ID OAuth
    const appleUser = await auth.signInWithProvider('apple', {
      email: 'developer.apple@icloud.com',
      displayName: 'SwiftCoder'
    });
    assert(appleUser.provider === 'apple', 'Apple ID user created with provider apple');
    assert(auth.getCurrentUser().displayName === 'SwiftCoder', 'Apple user becomes active session');

    // Reject unknown provider
    let threwBadProvider = false;
    try {
      await auth.signInWithProvider('unknown_provider');
    } catch (_) {
      threwBadProvider = true;
    }
    assert(threwBadProvider, 'Rejects unsupported provider');

    // -------------------------------------------------------------
    // 6. Guest Account Linking (Promote without Data Loss)
    // -------------------------------------------------------------
    console.log('\n--- 6. Guest Account Linking ---');
    auth.signOut();
    const linked = await auth.linkAccount('email', {
      email: 'guest_promoted@syntaxarena.cloud',
      password: 'SafePass999',
      displayName: 'PromotedAdept'
    });
    assert(linked.displayName === 'PromotedAdept', 'Successfully promoted guest to permanent account');
    assert(auth.isAuthenticated() === true, 'Promoted account immediately active');

    // -------------------------------------------------------------
    // 7. Storage Isolation & Database Safety
    // -------------------------------------------------------------
    console.log('\n--- 7. Storage Isolation & Database Safety ---');
    const authRaw = mockStorage.get(AUTH_STORAGE_KEY);
    assert(authRaw !== null, 'Auth state persisted under isolated key syntaxarena_auth_v1');
    const parsedAuth = JSON.parse(authRaw);
    assert(Array.isArray(parsedAuth.users) && parsedAuth.users.length >= 4, 'All registered accounts safely preserved');

    // Verify main storage key is untouched
    assert(!mockStorage.has('syntaxarena_storage_v1'), 'Main game database key remained completely isolated');

  } catch (err) {
    console.error('Unexpected error in auth test suite:', err);
    failed++;
  } finally {
    globalThis.window = originalWindow;
  }

  console.log('\n============================================================');
  console.log(`AUTH TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================');

  return { passed, failed };
}

export { runAuthTests };

// Direct execution runner
if (typeof process !== 'undefined' && process.argv[1]?.includes('auth-tests.js')) {
  runAuthTests().then(res => {
    if (res.failed > 0) process.exit(1);
  });
}


