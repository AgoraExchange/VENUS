// VENUS level pack: Tutorial
// Future levels can be added as more files in /levels/ and registered here or loaded by script tag.
window.VENUS_LEVELS = window.VENUS_LEVELS || {};
window.VENUS_LEVELS.tutorial = {
  id: "tutorial",
  name: "Tutorial: Locked Grove Tower",
  completeTitle: "Tutorial Complete",
  worldWidth: 3650,
  worldHeight: 900,
  spawn: { x: 160, y: 535 },
  startMessage: "Tutorial: Climb the platforms, find the key, unlock the door, loot weapons, and clear the slime path.",
  platforms: [
    // Starter room floor and walls. The door blocks the right side until the key is used.
    { x: 0, y: 625, w: 840, h: 120 },
    { x: 900, y: 625, w: 2650, h: 120 },
    { x: -70, y: 235, w: 80, h: 520 },

    // Forgiving tower platforms. oneWay=true lets the player jump through the underside and land on top.
    // This prevents that annoying "bonk the platform and fall" feeling.
    { x: 95, y: 535, w: 265, h: 48, oneWay: true },
    { x: 295, y: 470, w: 290, h: 48, oneWay: true },
    { x: 95, y: 405, w: 290, h: 48, oneWay: true },
    { x: 315, y: 340, w: 305, h: 48, oneWay: true },
    { x: 110, y: 275, w: 305, h: 48, oneWay: true },
    { x: 360, y: 210, w: 320, h: 48, oneWay: true },
    { x: 115, y: 140, w: 600, h: 56, oneWay: true },

    // Post-door combat / loot path.
    { x: 1035, y: 540, w: 235, h: 48, oneWay: true },
    { x: 1330, y: 530, w: 240, h: 48, oneWay: true },
    { x: 1815, y: 560, w: 240, h: 48, oneWay: true },
    { x: 2240, y: 548, w: 240, h: 48, oneWay: true },
    { x: 2680, y: 535, w: 240, h: 48, oneWay: true }
  ],
  coins: [
    // Tower coin breadcrumbs.
    { x: 155, y: 493 }, { x: 222, y: 487 }, { x: 300, y: 493 },
    { x: 337, y: 428 }, { x: 438, y: 416 }, { x: 535, y: 428 },
    { x: 140, y: 363 }, { x: 238, y: 350 }, { x: 338, y: 363 },
    { x: 365, y: 298 }, { x: 475, y: 282 }, { x: 585, y: 298 },
    { x: 178, y: 234 }, { x: 290, y: 220 }, { x: 402, y: 234 },

    // Combat path rewards.
    { x: 1835, y: 510 }, { x: 1890, y: 492 }, { x: 1945, y: 510 },
    { x: 2260, y: 497 }, { x: 2315, y: 480 }, { x: 2370, y: 497 },
    { x: 2705, y: 482 }, { x: 2760, y: 465 }, { x: 2815, y: 482 }
  ],
  signs: [
    { x: 92, y: 574, text: "Use WASD to move. W or ↑ to jump. Space to Attack. Q/I to use item. K to interact. E is your inventory." },
    { x: 395, y: 574, text: "Jump through green platforms. Press S or ↓ to drop to the platform below. Search for loot." },
    { x: 955, y: 574, text: "Scavenge loot from nearby chest. Find supplies for the adventure ahead!" },
    { x: 1290, y: 574, text: "Use your weapon to break open crates for valuable loot." },
    { x: 1640, y: 574, text: "Damage and attack enemies using your weapons. Stay in the fight by using your consumables!" }
  ],
  chests: [
    { id: "towerChest", x: 510, y: 96, loot: [{ type: "key", x: 536, y: 62 }] },
    { id: "weaponChest", x: 1130, y: 582, loot: [{ type: "sword", x: 1144, y: 540 }] }
  ],
  crates: [
    { id: "crate1", x: 1450, y: 579, hp: 70, loot: [
      { type: "smallPotion", x: 1430, y: 530 },
      { type: "largePotion", x: 1480, y: 526 },
      { type: "gun", x: 1530, y: 532, ammo: 6 }
    ] }
  ],
  enemies: [
    { x: 1840, y: 586, minX: 1760, maxX: 1970, type: "slime" },
    { x: 2120, y: 586, minX: 2050, maxX: 2250, type: "slime" },
    { x: 2400, y: 586, minX: 2320, maxX: 2530, type: "slime" },
    { x: 2680, y: 586, minX: 2600, maxX: 2820, type: "slime" },
    { x: 2960, y: 586, minX: 2880, maxX: 3130, type: "slime" }
  ],
  hazards: [],
  gate: { x: 825, y: 330, w: 78, h: 295, keyId: "key" },
  checkpoint: { x: 1640, y: 555, w: 30, h: 70, active: false },
  portal: { x: 3330, y: 510, w: 110, h: 110 }
};
