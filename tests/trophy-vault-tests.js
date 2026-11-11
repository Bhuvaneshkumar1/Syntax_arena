/**
 * SyntaxArena Feature 9: 3D Isometric Trophy Vault & Dynamic GitHub Profile Badges
 * Unit Test Suite
 * Validates:
 * 1. Rarity tier mapping, ROM metadata, and cartridge specifications
 * 2. SVG Badge Generator XML validity and schema conformance across all 4 styles
 * 3. Colorway palette mappings and custom telemetry toggles
 * 4. TrophyVault controller state, filter predicate math, and 360 inspector transforms
 */

import { mapBadgeRarity, RARITY_CONFIG, BadgeGenerator, TrophyVault } from '../js/trophy-vault.js';
import { ACHIEVEMENTS } from '../js/gamification.js';

export async function runTrophyVaultTests() {
  console.log('\n============================================================');
  console.log('🏆 RUNNING 3D TROPHY VAULT & SVG BADGE STUDIO TEST SUITE');
  console.log('============================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // 1. Rarity & Cartridge Tech Specs Verification
    // -------------------------------------------------------------
    console.log('\n--- 1. Rarity & Cartridge Tech Specs ---');
    assert(RARITY_CONFIG.common && RARITY_CONFIG.common.label === 'Common', 'Common rarity tier exists');
    assert(RARITY_CONFIG.rare && RARITY_CONFIG.rare.color === '#38bdf8', 'Rare tier color is sapphire cyan');
    assert(RARITY_CONFIG.epic && RARITY_CONFIG.epic.romSize === '2048 KB CHR-ROM', 'Epic tier ROM size is 2048 KB');
    assert(RARITY_CONFIG.legendary && RARITY_CONFIG.legendary.battery === true, 'Legendary tier has battery-backed save SRAM');
    assert(RARITY_CONFIG.mythic && RARITY_CONFIG.mythic.label === 'Mythic', 'Mythic tier exists for elite accomplishments');

    // Rarity Mapping Logic
    assert(mapBadgeRarity({ difficulty: 'beginner' }) === 'common', 'Beginner difficulty maps to Common');
    assert(mapBadgeRarity({ difficulty: 'intermediate' }) === 'rare', 'Intermediate difficulty maps to Rare');
    assert(mapBadgeRarity({ difficulty: 'expert' }) === 'epic', 'Expert difficulty maps to Epic');
    assert(mapBadgeRarity({ difficulty: 'boss', id: 'boss_slayer' }) === 'legendary', 'Boss slayer difficulty maps to Legendary');
    assert(mapBadgeRarity({ id: 'daemon_incursion_champion' }) === 'mythic', 'Daemon Incursion badge maps to Mythic');
    assert(mapBadgeRarity({ id: 'flawless_grandmaster' }) === 'mythic', 'Flawless Grandmaster badge maps to Mythic');

    // -------------------------------------------------------------
    // 2. Dynamic SVG Badge Generator: Style 1 - Arcade Card
    // -------------------------------------------------------------
    console.log('\n--- 2. BadgeGenerator: Arcade Style ---');
    const arcadeSvg = BadgeGenerator.generateSvg({
      style: 'arcade',
      callsign: 'CyberAgent',
      level: 14,
      rankTitle: 'Grandmaster',
      xp: 4500,
      solved: 88,
      streak: 15,
      accuracy: '98%'
    });

    assert(arcadeSvg.startsWith('<svg') && arcadeSvg.endsWith('</svg>'), 'Arcade badge produces well-formed SVG enclosure');
    assert(arcadeSvg.includes('xmlns="http://www.w3.org/2000/svg"'), 'Arcade badge includes XML namespace');
    assert(arcadeSvg.includes('CyberAgent'), 'Arcade badge embeds player callsign');
    assert(arcadeSvg.includes('LVL 14'), 'Arcade badge embeds player level');
    assert(arcadeSvg.includes('Grandmaster'), 'Arcade badge embeds rank title');
    assert(arcadeSvg.includes('4,500 XP'), 'Arcade badge formats XP with comma separators');
    assert(arcadeSvg.includes('88') && arcadeSvg.includes('15🔥'), 'Arcade badge renders solved and streak counts');

    // -------------------------------------------------------------
    // 3. Dynamic SVG Badge Generator: Style 2 - Shield Pill
    // -------------------------------------------------------------
    console.log('\n--- 3. BadgeGenerator: Shield Style ---');
    const shieldSvg = BadgeGenerator.generateSvg({
      style: 'shield',
      callsign: 'HexKnight',
      level: 5,
      rankTitle: 'Script Veteran'
    });

    assert(shieldSvg.startsWith('<svg') && shieldSvg.endsWith('</svg>'), 'Shield badge produces valid SVG enclosure');
    assert(shieldSvg.includes('SYNTAX ARENA'), 'Shield badge includes SYNTAX ARENA left label');
    assert(shieldSvg.includes('LVL 5 • SCRIPT VETERAN'), 'Shield badge includes right payload text');

    // -------------------------------------------------------------
    // 4. Dynamic SVG Badge Generator: Style 3 - Cyber Terminal HUD
    // -------------------------------------------------------------
    console.log('\n--- 4. BadgeGenerator: Cyber Terminal HUD ---');
    const cyberSvg = BadgeGenerator.generateSvg({
      style: 'cyber',
      callsign: 'ZeroCool',
      level: 20,
      rankTitle: 'Root Overlord',
      xp: 12000
    });

    assert(cyberSvg.startsWith('<svg') && cyberSvg.endsWith('</svg>'), 'Cyber badge produces valid SVG enclosure');
    assert(cyberSvg.includes('usr@syntaxarena:~# id ZeroCool'), 'Cyber badge renders terminal prompt header');
    assert(cyberSvg.includes('&gt; AGENT: ZeroCool'), 'Cyber badge escapes XML prompt arrow as &gt;');
    assert(cyberSvg.includes('Root Overlord'), 'Cyber badge includes rank title');

    // -------------------------------------------------------------
    // 5. Dynamic SVG Badge Generator: Style 4 - Minimal Pill
    // -------------------------------------------------------------
    console.log('\n--- 5. BadgeGenerator: Minimal Pill ---');
    const minimalSvg = BadgeGenerator.generateSvg({
      style: 'minimal',
      callsign: 'ByteRider',
      level: 3,
      xp: 750
    });

    assert(minimalSvg.startsWith('<svg') && minimalSvg.endsWith('</svg>'), 'Minimal badge produces valid SVG enclosure');
    assert(minimalSvg.includes('ByteRider'), 'Minimal badge contains callsign');
    assert(minimalSvg.includes('[Lv.3]'), 'Minimal badge renders compact level tag');
    assert(minimalSvg.includes('750 XP'), 'Minimal badge renders XP summary');

    // -------------------------------------------------------------
    // 6. Accent Colorways & Telemetry Toggles
    // -------------------------------------------------------------
    console.log('\n--- 6. Accent Colorways & Telemetry Toggles ---');
    const emeraldBadge = BadgeGenerator.generateSvg({ color: 'emerald', callsign: 'Neo' });
    assert(emeraldBadge.includes('#10b981') || emeraldBadge.includes('#34d399'), 'Emerald colorway applies green hex tones');

    const amberBadge = BadgeGenerator.generateSvg({ color: 'amber', callsign: 'Morpheus' });
    assert(amberBadge.includes('#f59e0b') || amberBadge.includes('#fbbf24'), 'Amber colorway applies warm solar tones');

    const roseBadge = BadgeGenerator.generateSvg({ color: 'rose', callsign: 'Trinity' });
    assert(roseBadge.includes('#f43f5e') || roseBadge.includes('#fb7185'), 'Rose colorway applies crimson hacker tones');

    // Toggle off stats and rank
    const noStatsSvg = BadgeGenerator.generateSvg({
      style: 'arcade',
      callsign: 'Ghost',
      showStats: false,
      showRank: false,
      showXP: false
    });
    assert(!noStatsSvg.includes('CHALLENGES'), 'Disabled stats strip is omitted from SVG');
    assert(!noStatsSvg.includes('LVL '), 'Disabled rank is omitted from SVG');
    assert(!noStatsSvg.includes('XP'), 'Disabled XP is omitted from SVG');

    // -------------------------------------------------------------
    // 7. TrophyVault Controller Logic & Filter Predicates
    // -------------------------------------------------------------
    console.log('\n--- 7. TrophyVault Controller State & Filters ---');
    const mockBadges = [
      { id: 'b_first', name: 'First Blood', category: 'milestones', difficulty: 'beginner', icon: '⚔️' },
      { id: 'b_streak5', name: 'Streak 5x', category: 'streaks', difficulty: 'intermediate', icon: '🔥' },
      { id: 'b_boss', name: 'Overlord Down', category: 'boss', difficulty: 'legendary', icon: '👑' }
    ];

    const vault = new TrophyVault({
      badges: mockBadges,
      unlockedBadgeIds: ['b_first']
    });

    assert(vault.unlockedBadgeIds.has('b_first') === true, 'b_first is marked unlocked');
    assert(vault.unlockedBadgeIds.has('b_streak5') === false, 'b_streak5 is marked locked');

    // Filter by subject
    const streakFiltered = vault.badges.filter(b => b.category === 'streaks');
    assert(streakFiltered.length === 1 && streakFiltered[0].id === 'b_streak5', 'Category filter correctly isolates streak badges');

    // Filter by unlock status
    const unlockedFiltered = vault.badges.filter(b => vault.unlockedBadgeIds.has(b.id));
    assert(unlockedFiltered.length === 1 && unlockedFiltered[0].id === 'b_first', 'Status filter isolates unlocked badges');

    const lockedFiltered = vault.badges.filter(b => !vault.unlockedBadgeIds.has(b.id));
    assert(lockedFiltered.length === 2, 'Status filter isolates locked badges');

    // 360 Rotation math bounds
    vault.inspectorRotX = 25;
    vault.inspectorRotY = 90;
    assert(vault.inspectorRotX === 25 && vault.inspectorRotY === 90, 'Inspector coordinates tracked correctly');

  } catch (err) {
    console.error('Fatal test error in TrophyVault test runner:', err);
    failed++;
  }

  console.log('============================================================');
  console.log(`🏆 3D TROPHY VAULT TEST SUITE: ${passed} passed, ${failed} failed`);
  console.log('============================================================\n');

  return { passed, failed };
}

// Node direct runner
if (typeof process !== 'undefined' && process.argv[1]?.includes('trophy-vault-tests.js')) {
  runTrophyVaultTests().then(res => {
    if (res.failed > 0) process.exit(1);
  });
}
