/**
 * SyntaxArena Battlestation Customization Engine Unit Tests
 * Validates catalog schema, loadouts, XP gating, equipping logic, and sound profiles.
 */

import { BattlestationCatalog, BATTLESTATION_CATALOG } from '../data/battlestation-catalog.js';
import { BattlestationEngine } from '../js/battlestation-engine.js';

export function runBattlestationTests() {
  console.log('\n--- Running Battlestation Engine Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`  ✓ ${message}`);
    } else {
      failed++;
      console.error(`  ✗ ${message}`);
    }
  }

  // 1. Catalog schema integrity
  assert(Array.isArray(BATTLESTATION_CATALOG.keyboardSwitches), 'Catalog contains keyboardSwitches array');
  assert(BATTLESTATION_CATALOG.keyboardSwitches.length === 4, 'Catalog has exactly 4 keyboard switches');
  assert(BATTLESTATION_CATALOG.crtShaders.length === 4, 'Catalog has exactly 4 CRT shaders');
  assert(BATTLESTATION_CATALOG.rgbUnderglow.length === 4, 'Catalog has exactly 4 RGB underglow profiles');
  assert(BATTLESTATION_CATALOG.rigUpgrades.length === 4, 'Catalog has exactly 4 hardware upgrades');

  // 2. Default loadout
  const def = BattlestationCatalog.getDefaultLoadout();
  assert(def.keyboardSwitch === 'switch_cherry_blue', 'Default keyboard switch is Cherry MX Blue');
  assert(def.crtShader === 'crt_none', 'Default CRT shader is None');
  assert(def.rgbUnderglow === 'rgb_none', 'Default RGB underglow is None');
  assert(Array.isArray(def.unlockedUpgrades) && def.unlockedUpgrades.length === 0, 'Default upgrades list is empty');

  // 3. getItemById
  const cherryBlue = BattlestationCatalog.getItemById('switch_cherry_blue');
  assert(cherryBlue && cherryBlue.name === 'Cherry MX Blue', 'getItemById finds Cherry MX Blue');
  const vt100 = BattlestationCatalog.getItemById('crt_green_vt100');
  assert(vt100 && vt100.cssClass === 'shader-crt-green', 'getItemById finds DEC VT100 Green Phosphor');
  const chroma = BattlestationCatalog.getItemById('rgb_chroma_spectrum');
  assert(chroma && chroma.cssClass === 'aura-chroma-spectrum', 'getItemById finds Chroma Spectrum Flow');
  const matrix = BattlestationCatalog.getItemById('rig_matrix_rain');
  assert(matrix && matrix.requiredXP === 5000, 'getItemById finds Digital Matrix Rain upgrade');
  assert(BattlestationCatalog.getItemById('invalid_id') === null, 'getItemById returns null for invalid id');
  assert(BattlestationCatalog.getItemById(null) === null, 'getItemById returns null for null');

  // 4. Synth profiles
  const switches = BattlestationCatalog.getSwitches();
  const allHaveSynth = switches.every(s => s.synthProfile && typeof s.synthProfile.type === 'string');
  assert(allHaveSynth, 'All keyboard switches specify a valid Web Audio synthProfile');

  // 5. XP Unlock Gating
  // Reset engine loadout
  BattlestationEngine.loadout = {
    keyboardSwitch: 'switch_cherry_blue',
    crtShader: 'crt_none',
    rgbUnderglow: 'rgb_none',
    unlockedUpgrades: []
  };

  assert(BattlestationEngine.isUnlocked('switch_cherry_blue', 0) === true, 'Cherry Blue is unlocked at 0 XP');
  assert(BattlestationEngine.isUnlocked('switch_buckling_spring', 500) === false, 'Buckling Spring is locked at 500 XP (needs 1500)');
  assert(BattlestationEngine.isUnlocked('switch_buckling_spring', 1500) === true, 'Buckling Spring unlocks at 1500 XP');
  assert(BattlestationEngine.isUnlocked('crt_cyber_matrix', 3000) === false, 'Cyber Matrix CRT is locked at 3000 XP (needs 3500)');
  assert(BattlestationEngine.isUnlocked('crt_cyber_matrix', 4000) === true, 'Cyber Matrix CRT unlocks at 4000 XP');

  // 6. Equipping Items
  // Try equipping locked item
  const lockRes = BattlestationEngine.equip('keyboard', 'switch_cyber_haptic', 100);
  assert(lockRes.success === false, 'Equipping locked switch without sufficient XP is rejected');
  assert(BattlestationEngine.loadout.keyboardSwitch === 'switch_cherry_blue', 'Active switch unchanged on failed equip');

  // Equip unlocked switch
  const equipRes = BattlestationEngine.equip('keyboard', 'switch_cherry_brown', 600);
  assert(equipRes.success === true, 'Equipping Cherry MX Brown with 600 XP succeeds');
  assert(BattlestationEngine.loadout.keyboardSwitch === 'switch_cherry_brown', 'Active switch updated in loadout');

  // Equip CRT shader
  const equipCrt = BattlestationEngine.equip('crt', 'crt_green_vt100', 800);
  assert(equipCrt.success === true, 'Equipping VT100 Green CRT succeeds');
  assert(BattlestationEngine.loadout.crtShader === 'crt_green_vt100', 'Active CRT updated to VT100 Green');

  // Equip RGB underglow
  const equipRgb = BattlestationEngine.equip('rgb', 'rgb_neon_cyan', 700);
  assert(equipRgb.success === true, 'Equipping Cyan Halo RGB succeeds');
  assert(BattlestationEngine.loadout.rgbUnderglow === 'rgb_neon_cyan', 'Active RGB underglow updated to Cyan Halo');

  // Install Hardware Upgrade
  const equipHard = BattlestationEngine.equip('hardware', 'rig_liquid_cooling', 1200);
  assert(equipHard.success === true, 'Installing Liquid Cooling upgrade succeeds');
  assert(BattlestationEngine.loadout.unlockedUpgrades.includes('rig_liquid_cooling'), 'Liquid cooling added to installed upgrades');

  // Duplicate upgrade install does not create duplicates
  BattlestationEngine.equip('hardware', 'rig_liquid_cooling', 1200);
  assert(BattlestationEngine.loadout.unlockedUpgrades.filter(id => id === 'rig_liquid_cooling').length === 1, 'No duplicate hardware entries');

  // 7. Snapshot verification
  const snap = BattlestationEngine.getSnapshot();
  assert(snap.equippedSwitch.id === 'switch_cherry_brown', 'Snapshot resolves equipped switch metadata');
  assert(snap.equippedShader.id === 'crt_green_vt100', 'Snapshot resolves equipped CRT shader metadata');
  assert(snap.equippedUnderglow.id === 'rgb_neon_cyan', 'Snapshot resolves equipped RGB underglow metadata');
  assert(snap.unlockedUpgrades.includes('rig_liquid_cooling'), 'Snapshot contains installed hardware upgrades');

  // 8. Safe Audio Preview in Node (audioCtx safely null / non-throwing)
  let threwAudio = false;
  try {
    BattlestationEngine.previewSwitch('switch_cherry_blue');
    BattlestationEngine.playSwitchSound('switch_buckling_spring');
  } catch (e) {
    threwAudio = true;
  }
  assert(!threwAudio, 'Audio synthesis methods execute gracefully without throwing in non-browser Node environments');

  // 9. Unknown item handling
  const unknownEquip = BattlestationEngine.equip('keyboard', 'non_existent_id', 99999);
  assert(unknownEquip.success === false, 'Equipping unknown item id fails gracefully');

  // Reset to default
  BattlestationEngine.loadout = BattlestationCatalog.getDefaultLoadout();

  console.log(`Battlestation Engine Tests: ${passed} passed, ${failed} failed`);
  return { passed, failed };
}

if (typeof process !== 'undefined' && process.argv && process.argv[1] && process.argv[1].endsWith('battlestation-tests.js')) {
  runBattlestationTests();
}
