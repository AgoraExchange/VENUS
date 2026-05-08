// VENUS level pack: Level 2
// Level-only layout/objective data. Core mechanics still live in script.js.
window.VENUS_LEVELS = window.VENUS_LEVELS || {};
window.VENUS_LEVELS.level2 = {
  id: "level2",
  name: "Level 2: As Above, So Below",
  completeTitle: "As Above, So Below Cleared",
  worldWidth: 5300,
  worldHeight: 900,
  spawn: { x: 720, y: 535 },
  startMessage: "Level 2 loaded. The obvious path is lying to you.",
  scripts: {
    firstTip: "As above, so below. Sometimes forward is the trap.",
    swordWave: {
      count: 6,
      interval: 1.5,
      y: 586,
      speed: 168,
      hp: 70,
      offscreenPadding: 150
    }
  },
  platforms: [
    // The player spawns mid-map so walking left reveals a hidden backward path.
    { x: 0, y: 625, w: 2360, h: 120 },
    { x: 2440, y: 625, w: 2780, h: 120 },

    // The unreachable “above” platform. The key up here is a visual clue only.
    { x: 585, y: 310, w: 385, h: 52, oneWay: true },

    // Bat arena platform climb after the locked door.
    { x: 2630, y: 540, w: 260, h: 48, oneWay: true },
    { x: 3005, y: 485, w: 275, h: 48, oneWay: true },
    { x: 3380, y: 425, w: 280, h: 48, oneWay: true },
    { x: 3740, y: 500, w: 290, h: 48, oneWay: true },
    { x: 4145, y: 450, w: 270, h: 48, oneWay: true },
    { x: 4540, y: 510, w: 260, h: 48, oneWay: true }
  ],
  decorations: [
    { type: "key", x: 735, y: 265, scale: 1.2, alpha: 0.96 }
  ],
  coins: [
    // Hidden backward path breadcrumbs.
    { x: 505, y: 575 }, { x: 430, y: 562 }, { x: 350, y: 550 }, { x: 270, y: 562 }, { x: 190, y: 575 },

    // Forward route rewards.
    { x: 1010, y: 575 }, { x: 1080, y: 548 }, { x: 1150, y: 575 },
    { x: 1580, y: 575 }, { x: 1640, y: 548 }, { x: 1700, y: 575 },

    // Bat arena arcs.
    { x: 2685, y: 495 }, { x: 2750, y: 475 }, { x: 2815, y: 495 },
    { x: 3055, y: 440 }, { x: 3130, y: 418 }, { x: 3205, y: 440 },
    { x: 3430, y: 380 }, { x: 3510, y: 358 }, { x: 3590, y: 380 },
    { x: 3795, y: 455 }, { x: 3865, y: 435 }, { x: 3935, y: 455 },
    { x: 4190, y: 405 }, { x: 4265, y: 382 }, { x: 4340, y: 405 },
    { x: 4580, y: 465 }, { x: 4655, y: 442 }, { x: 4730, y: 465 }
  ],
  signs: [
    { x: 610, y: 574, text: "As above so below," }
  ],
  trapdoors: [
    {
      id: "belowKeyTrapdoor",
      x: 130,
      y: 606,
      w: 92,
      h: 18,
      loot: [
        { type: "key", x: 155, y: 560, requiresInteract: true }
      ]
    }
  ],
  chests: [
    // A small stash after the door gives the gun hint somewhere to land without needing another tutorial sign.
    { id: "batArenaStash", x: 2530, y: 582, loot: [
      { type: "gun", x: 2545, y: 535, ammo: 6, requiresInteract: true },
      { type: "smallPotion", x: 2600, y: 532, requiresInteract: true }
    ] }
  ],
  crates: [
    {
      id: "barehandCrate",
      x: 1195,
      y: 579,
      hp: 35,
      loot: [
        { type: "sword", x: 1203, y: 528, requiresInteract: true, autoEquip: true, onCollect: "level2SwordWave" }
      ]
    }
  ],
  enemies: [
    // No starting enemies. The slime ambush is spawned by the sword pickup event.
    // Bats live beyond the locked door.
    { x: 2920, y: 452, minX: 2700, maxX: 3010, type: "bat", hp: 55 },
    { x: 3330, y: 390, minX: 3140, maxX: 3520, type: "bat", hp: 55 },
    { x: 3745, y: 455, minX: 3560, maxX: 3920, type: "bat", hp: 55 },
    { x: 4180, y: 405, minX: 4000, maxX: 4360, type: "bat", hp: 55 },
    { x: 4620, y: 470, minX: 4450, maxX: 4810, type: "bat", hp: 55 }
  ],
  hazards: [
    { x: 2190, y: 596, w: 110, h: 30, type: "spikes", damage: 15 },
    { x: 2865, y: 596, w: 96, h: 30, type: "spikes", damage: 15 },
    { x: 3660, y: 596, w: 88, h: 30, type: "spikes", damage: 15 },
    { x: 4860, y: 596, w: 94, h: 30, type: "spikes", damage: 15 }
  ],
  gate: { x: 2360, y: 365, w: 78, h: 260, keyId: "key" },
  checkpoint: { x: 2520, y: 555, w: 30, h: 70, active: false },
  portal: { x: 5060, y: 510, w: 110, h: 110 }
};
