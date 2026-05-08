// VENUS level pack: Level 4
// Boss round with Apprentice cutscenes, slime resurrection, survival wave, and final 500 HP fight.
window.VENUS_LEVELS = window.VENUS_LEVELS || {};
window.VENUS_LEVELS.level4 = {
  id: "level4",
  name: "Level 4: Apprentice's Revenge",
  completeTitle: "Boss Round Cleared",
  worldWidth: 4700,
  worldHeight: 1040,
  spawn: { x: 145, y: 658 },
  startMessage: "Level 4 loaded. Boss round started.",
  scripts: {
    survivalSeconds: 60,
    slimeY: 682,
    batY: 505,
    boss: {
      spawnX: 1650,
      groundY: 592,
      fightX: 2760
    },
    bossWatch: { x: 1015, y: 392 },
    helperPlatforms: [
      { x: 580, y: 640, w: 270, h: 48, oneWay: true },
      { x: 900, y: 590, w: 270, h: 48, oneWay: true },
      { x: 1225, y: 540, w: 270, h: 48, oneWay: true },
      { x: 1570, y: 610, w: 280, h: 48, oneWay: true },
      { x: 1940, y: 555, w: 285, h: 48, oneWay: true },
      { x: 2340, y: 620, w: 310, h: 48, oneWay: true }
    ],
    cratePlatforms: [
      { x: 580, y: 640, w: 270, h: 48 },
      { x: 900, y: 590, w: 270, h: 48 },
      { x: 1225, y: 540, w: 270, h: 48 },
      { x: 1570, y: 610, w: 280, h: 48 },
      { x: 1940, y: 555, w: 285, h: 48 },
      { x: 2340, y: 620, w: 310, h: 48 }
    ]
  },
  platforms: [
    // Main boss arena floor.
    { x: 0, y: 720, w: 3920, h: 120 },

    // Apprentice watch platform. This starts visible so the monster can stand above the chaos.
    { x: 895, y: 520, w: 365, h: 48, oneWay: true },

    // Exit stretch after the locked wall.
    { x: 3998, y: 720, w: 700, h: 120 },
    { x: 4180, y: 650, w: 250, h: 48, oneWay: true },
    { x: 4425, y: 590, w: 240, h: 48, oneWay: true }
  ],
  decorations: [
    { type: "portalBeam", x: 4500, y: 210, w: 58, h: 430, alpha: 0.38 }
  ],
  coins: [
    { x: 250, y: 665 }, { x: 360, y: 665 }, { x: 470, y: 665 },
    { x: 945, y: 476 }, { x: 1055, y: 476 }, { x: 1165, y: 476 },
    { x: 640, y: 596 }, { x: 965, y: 546 }, { x: 1290, y: 496 },
    { x: 1625, y: 566 }, { x: 2010, y: 510 }, { x: 2420, y: 575 },
    { x: 4218, y: 605 }, { x: 4465, y: 545 }, { x: 4560, y: 545 }
  ],
  signs: [
    { x: 4050, y: 668, text: "If you made it this far, Congrats. You are top 10% of players. - Developer." }
  ],
  chests: [],
  crates: [],
  enemies: [],
  hazards: [
    { x: 3525, y: 690, w: 105, h: 30, type: "spikes", damage: 18 }
  ],
  gates: [
    { x: 3920, y: 470, w: 78, h: 250, keyId: "key" }
  ],
  checkpoint: { x: 305, y: 650, w: 30, h: 70, active: false },
  portal: { x: 4505, y: 490, w: 112, h: 112 }
};
