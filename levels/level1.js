// VENUS level pack: Level 1
// Drop this file in /levels and keep it loaded after tutorial.js, before script.js.
window.VENUS_LEVELS = window.VENUS_LEVELS || {};
window.VENUS_LEVELS.level1 = {
  id: "level1",
  name: "Level 1: Moonroot Crossing",
  completeTitle: "Moonroot Crossing Cleared",
  worldWidth: 4500,
  worldHeight: 900,
  spawn: { x: 160, y: 535 },
  startMessage: "Level 1 loaded. Gear up, break crates, clear the crossing, and reach the portal.",
  platforms: [
    // Main travel lane. Keep it readable for mobile auto-run.
    { x: 0, y: 625, w: 1320, h: 120 },
    { x: 1380, y: 625, w: 1020, h: 120 },
    { x: 2480, y: 625, w: 880, h: 120 },
    { x: 3440, y: 625, w: 940, h: 120 },

    // Small optional reward platforms. One-way so jumping feels smooth.
    { x: 480, y: 505, w: 260, h: 48, oneWay: true },
    { x: 920, y: 455, w: 260, h: 48, oneWay: true },
    { x: 1540, y: 500, w: 260, h: 48, oneWay: true },
    { x: 1990, y: 440, w: 280, h: 48, oneWay: true },
    { x: 2720, y: 500, w: 280, h: 48, oneWay: true },
    { x: 3160, y: 448, w: 260, h: 48, oneWay: true },
    { x: 3700, y: 505, w: 260, h: 48, oneWay: true }
  ],
  coins: [
    // Starter reward arc.
    { x: 390, y: 575 }, { x: 445, y: 552 }, { x: 500, y: 532 }, { x: 560, y: 520 }, { x: 620, y: 532 },
    // Platform route.
    { x: 525, y: 462 }, { x: 590, y: 445 }, { x: 655, y: 462 },
    { x: 960, y: 412 }, { x: 1030, y: 395 }, { x: 1100, y: 412 },
    // Midlane breadcrumbs.
    { x: 1495, y: 575 }, { x: 1555, y: 548 }, { x: 1615, y: 575 },
    { x: 2028, y: 397 }, { x: 2100, y: 380 }, { x: 2172, y: 397 },
    { x: 2630, y: 572 }, { x: 2690, y: 548 }, { x: 2750, y: 572 },
    { x: 3190, y: 405 }, { x: 3260, y: 388 }, { x: 3330, y: 405 },
    { x: 3725, y: 462 }, { x: 3795, y: 445 }, { x: 3865, y: 462 },
    { x: 4100, y: 580 }, { x: 4160, y: 552 }, { x: 4220, y: 580 }
  ],
  signs: [
    { x: 110, y: 574, text: "Level 1: Moonroot Crossing. Open the chest, gear up, and keep moving forward." }
  ],
  chests: [
    { id: "starterChest", x: 270, y: 582, loot: [
      { type: "sword", x: 292, y: 540 },
      { type: "smallPotion", x: 342, y: 542 }
    ] },
    { id: "midChest", x: 2815, y: 582, loot: [
      { type: "largePotion", x: 2810, y: 535 },
      { type: "gun", x: 2864, y: 535, ammo: 6 }
    ] }
  ],
  crates: [
    { id: "supplyCrate1", x: 790, y: 579, hp: 80, loot: [
      { type: "smallPotion", x: 780, y: 530 },
      { type: "gun", x: 832, y: 532, ammo: 6 }
    ] },
    { id: "supplyCrate2", x: 2060, y: 579, hp: 90, loot: [
      { type: "smallPotion", x: 2055, y: 530 },
      { type: "largePotion", x: 2110, y: 530 }
    ] },
    { id: "finalCrate", x: 3600, y: 579, hp: 100, loot: [
      { type: "smallPotion", x: 3590, y: 530 },
      { type: "gun", x: 3644, y: 532, ammo: 6 }
    ] }
  ],
  enemies: [
    { x: 1040, y: 586, minX: 940, maxX: 1190, type: "slime" },
    { x: 1640, y: 586, minX: 1480, maxX: 1840, type: "slime" },
    { x: 2300, y: 586, minX: 2180, maxX: 2380, type: "slime" },
    { x: 2920, y: 586, minX: 2760, maxX: 3140, type: "slime" },
    { x: 3370, y: 586, minX: 3190, maxX: 3430, type: "slime" },
    { x: 3890, y: 586, minX: 3730, maxX: 4050, type: "slime" }
  ],
  hazards: [
    { x: 1326, y: 596, w: 82, h: 30, type: "spikes", damage: 15 },
    { x: 1865, y: 596, w: 96, h: 30, type: "spikes", damage: 15 },
    { x: 2408, y: 596, w: 80, h: 30, type: "spikes", damage: 15 },
    { x: 3370, y: 596, w: 72, h: 30, type: "spikes", damage: 15 }
  ],
  // No locked gate in Level 1 yet. Tutorial owns the first key/door mechanic.
  gate: null,
  checkpoint: { x: 2475, y: 555, w: 30, h: 70, active: false },
  portal: { x: 4270, y: 510, w: 110, h: 110 }
};
