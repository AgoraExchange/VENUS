// VENUS level pack: Level 3
// Heavy combat level with spike traversal, timed enemy pressure, apprentice mini-boss, and bazooka crate drops.
window.VENUS_LEVELS = window.VENUS_LEVELS || {};
window.VENUS_LEVELS.level3 = {
  id: "level3",
  name: "Level 3: Monster Territory",
  completeTitle: "Monster Territory Survived",
  worldWidth: 7250,
  worldHeight: 1040,
  spawn: { x: 150, y: 658 },
  startMessage: "Level 3 loaded. Monster Territory is ahead.",
  scripts: {
    firstTip: "Lots of enemies ahead. Use platforms, supplies, and your hotbar like a menace.",
    supplyWave: {
      sequence: ["bat", "slime", "slime", "bat", "slime"],
      interval: 1.15,
      batY: 520,
      slimeY: 682
    },
    monsterArea: {
      slimeY: 682,
      batY: 530
    },
    bossCratePlatforms: [
      { x: 3560, y: 610, w: 300, h: 48 },
      { x: 3980, y: 548, w: 280, h: 48 },
      { x: 4400, y: 610, w: 300, h: 48 },
      { x: 4680, y: 500, w: 255, h: 48 }
    ]
  },
  platforms: [
    // Spawn and climb intro.
    { x: 0, y: 720, w: 900, h: 120 },
    { x: 235, y: 650, w: 260, h: 48, oneWay: true },
    { x: 455, y: 580, w: 260, h: 48, oneWay: true },
    { x: 675, y: 510, w: 245, h: 48, oneWay: true },

    // Spike pit bridge.
    { x: 1060, y: 610, w: 250, h: 48, oneWay: true },
    { x: 1450, y: 720, w: 1600, h: 120 },

    // Chest ambush arena platforms.
    { x: 1760, y: 610, w: 310, h: 48, oneWay: true },
    { x: 2140, y: 545, w: 300, h: 48, oneWay: true },
    { x: 2530, y: 610, w: 310, h: 48, oneWay: true },

    // Monster territory and apprentice arena.
    { x: 3128, y: 720, w: 2300, h: 120 },
    { x: 3560, y: 610, w: 300, h: 48, oneWay: true },
    { x: 3980, y: 548, w: 280, h: 48, oneWay: true },
    { x: 4400, y: 610, w: 300, h: 48, oneWay: true },
    { x: 4680, y: 500, w: 255, h: 48, oneWay: true },

    // Exit climb to portal.
    { x: 5505, y: 720, w: 560, h: 120 },
    { x: 5740, y: 650, w: 250, h: 48, oneWay: true },
    { x: 6020, y: 590, w: 250, h: 48, oneWay: true },
    { x: 6300, y: 530, w: 250, h: 48, oneWay: true },
    { x: 6570, y: 490, w: 300, h: 48, oneWay: true }
  ],
  decorations: [
    { type: "portalBeam", x: 6656, y: 145, w: 58, h: 365, alpha: 0.34 }
  ],
  coins: [
    // Climb and pit reward trail.
    { x: 300, y: 600 }, { x: 520, y: 530 }, { x: 740, y: 458 },
    { x: 950, y: 630 }, { x: 1110, y: 560 }, { x: 1240, y: 560 }, { x: 1390, y: 630 },

    // Ambush platform coins.
    { x: 1810, y: 565 }, { x: 1900, y: 545 }, { x: 1990, y: 565 },
    { x: 2190, y: 500 }, { x: 2290, y: 478 }, { x: 2390, y: 500 },
    { x: 2580, y: 565 }, { x: 2680, y: 545 }, { x: 2780, y: 565 },

    // Boss arena breadcrumbs.
    { x: 3620, y: 565 }, { x: 4050, y: 500 }, { x: 4470, y: 565 }, { x: 4735, y: 455 },

    // Portal climb.
    { x: 5795, y: 602 }, { x: 6075, y: 542 }, { x: 6355, y: 482 }, { x: 6640, y: 445 }, { x: 6745, y: 445 }
  ],
  signs: [
    { x: 95, y: 668, text: "[Monster Sightings Reported]" },
    { x: 3155, y: 668, text: "BEWARE! Monster Territory." }
  ],
  chests: [
    {
      id: "level3SupplyChest",
      x: 1605,
      y: 678,
      loot: [
        { type: "largePotion", x: 1602, y: 625, requiresInteract: true, groupId: "level3SupplyChest" },
        { type: "smallPotion", x: 1652, y: 628, requiresInteract: true, groupId: "level3SupplyChest" },
        { type: "smallPotion", x: 1700, y: 628, requiresInteract: true, groupId: "level3SupplyChest" },
        { type: "sword", x: 1752, y: 608, requiresInteract: true, groupId: "level3SupplyChest", autoEquip: true },
        { type: "gun", x: 1815, y: 622, requiresInteract: true, ammo: 6, groupId: "level3SupplyChest", autoEquip: true }
      ]
    }
  ],
  crates: [
    {
      id: "arenaKeyCrate",
      x: 2258,
      y: 491,
      hp: 75,
      loot: [
        { type: "key", x: 2270, y: 442, requiresInteract: true }
      ]
    }
  ],
  enemies: [
    // Spike bridge guard.
    { x: 1135, y: 560, minX: 1050, maxX: 1300, type: "bat", hp: 55, speed: 105 },

    // Portal climb guards. They are late enough that they won't bother the mini-boss area.
    { x: 6035, y: 540, minX: 5860, maxX: 6270, type: "bat", hp: 55, speed: 104 },
    { x: 6370, y: 478, minX: 6200, maxX: 6700, type: "bat", hp: 55, speed: 112 }
  ],
  hazards: [
    // Big spike pit with a dangerous middle platform.
    { x: 910, y: 690, w: 535, h: 36, type: "spikes", damage: 22 },
    { x: 1145, y: 580, w: 84, h: 30, type: "spikes", damage: 18 },

    // Light arena pressure.
    { x: 2920, y: 690, w: 82, h: 30, type: "spikes", damage: 18 },
    { x: 5060, y: 690, w: 92, h: 30, type: "spikes", damage: 18 }
  ],
  gates: [
    { x: 3050, y: 470, w: 78, h: 250, keyId: "key" },
    { x: 5428, y: 470, w: 78, h: 250, keyId: "key" }
  ],
  checkpoint: { x: 1520, y: 650, w: 30, h: 70, active: false },
  portal: { x: 6665, y: 390, w: 112, h: 112 }
};
