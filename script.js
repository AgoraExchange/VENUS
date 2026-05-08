(() => {
  "use strict";

  /* ============================================================
     VENUS - Build 18
     Vanilla JS canvas platformer/PWA base. Everything here is
     data-driven and beginner-readable so you can expand it later.
  ============================================================ */

  const SAVE_KEY = "venus_build_08_progression_save";
  const VERSION = "0.18.0";

  const ITEM_DEFS = {
    smallPotion: {
      name: "Small Health Potion",
      icon: "🧪",
      desc: "Restores 25 HP instantly.",
      usable: true,
      heal: 25,
      autoEquip: false
    },
    largePotion: {
      name: "Large Health Potion",
      icon: "💗",
      desc: "Restores 50 HP instantly.",
      usable: true,
      heal: 50,
      autoEquip: false
    },
    key: {
      name: "Tower Key",
      icon: "🗝️",
      desc: "Unlocks the first tutorial door when held near it. Press Q/I while next to the door.",
      usable: true,
      tool: "key",
      autoEquip: false
    },
    sword: {
      name: "Rustfang Sword",
      icon: "🗡️",
      desc: "A close-range weapon. Equip it, then press Space to attack.",
      usable: false,
      weapon: "sword",
      damage: 38,
      autoEquip: false
    },
    gun: {
      name: "Six-Shot Relic",
      icon: "🔫",
      desc: "Ranged weapon with 6 shots. Equip it, then press Space to fire. Each blast deals 35 damage and pops in a wider hit radius.",
      usable: false,
      weapon: "gun",
      damage: 35,
      autoEquip: false
    },
    bazooka: {
      name: "Bazooka",
      icon: "🚀",
      desc: "Heavy weapon with 2 rockets. Equip it, then press Space to launch. Each rocket deals 69 damage in a huge blast.",
      usable: false,
      weapon: "bazooka",
      damage: 69,
      autoEquip: false
    },
    shard: {
      name: "Energy Shard",
      icon: "💎",
      desc: "Bonus XP and score treasure.",
      usable: false,
      autoEquip: false
    }
  };

  const WEAPON_DURABILITY = {
    sword: { max: 100, useCost: 5, impactCost: 13 },
    gun: { max: 100, useCost: 8, impactCost: 8 },
    bazooka: { max: 100, useCost: 22, impactCost: 10 }
  };



  const LEVEL_ORDER = ["tutorial", "level1", "level2", "level3", "level4"];

  function levelOrdinal(levelId) {
    const idx = LEVEL_ORDER.indexOf(levelId);
    return idx === -1 ? 1 : idx + 1;
  }

  function levelIdFromOrdinal(ordinal) {
    const idx = clamp((Number(ordinal) || 1) - 1, 0, LEVEL_ORDER.length - 1);
    return LEVEL_ORDER[idx];
  }

  function levelTitle(levelId) {
    const data = window.VENUS_LEVELS && window.VENUS_LEVELS[levelId];
    return data?.name || levelId;
  }

  const COLORS = {
    skyTop: "#2c235e",
    skyMid: "#38488f",
    skyLow: "#6fd2cf",
    grass: "#54df70",
    grassDark: "#228744",
    dirt: "#884a2d",
    dirtLight: "#a96841",
    outline: "#2b1721",
    gold: "#f6c768",
    cyan: "#74f6ff",
    violet: "#a46bff",
    danger: "#ff4e6b"
  };

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d", { alpha: false });

  const dom = {
    mainMenu: document.getElementById("mainMenu"),
    pauseMenu: document.getElementById("pauseMenu"),
    infoModal: document.getElementById("infoModal"),
    modMenu: document.getElementById("modMenu"),
    modLock: document.getElementById("modLock"),
    modOptions: document.getElementById("modOptions"),
    modPasswordInput: document.getElementById("modPasswordInput"),
    modPasswordHint: document.getElementById("modPasswordHint"),
    infoTitle: document.getElementById("infoTitle"),
    infoBody: document.getElementById("infoBody"),
    levelComplete: document.getElementById("levelComplete"),
    gameOver: document.getElementById("gameOver"),
    completeTitle: document.getElementById("completeTitle"),
    rewardGrid: document.getElementById("rewardGrid"),
    hud: document.getElementById("hud"),
    modePill: document.getElementById("modePill"),
    hpFill: document.getElementById("hpFill"),
    hpText: document.getElementById("hpText"),
    heartRow: document.getElementById("heartRow"),
    coinText: document.getElementById("coinText"),
    xpText: document.getElementById("xpText"),
    scoreText: document.getElementById("scoreText"),
    levelNameText: document.getElementById("levelNameText"),
    hotbar: document.getElementById("hotbar"),
    equippedPill: document.getElementById("equippedPill"),
    toastStack: document.getElementById("toastStack"),
    mobileControls: document.getElementById("mobileControls"),
    mobileJoystick: document.getElementById("mobileJoystick"),
    mobileJoystickKnob: document.getElementById("mobileJoystickKnob"),
    inventoryModal: document.getElementById("inventoryModal"),
    inventoryList: document.getElementById("inventoryList"),
    bgMusic: document.getElementById("bgMusic")
  };

  const buttons = {
    start: document.getElementById("startBtn"),
    continue: document.getElementById("continueBtn"),
    tutorial: document.getElementById("tutorialBtn"),
    resetProgression: document.getElementById("resetProgressionBtn"),
    controls: document.getElementById("controlsBtn"),
    settings: document.getElementById("settingsBtn"),
    credits: document.getElementById("creditsBtn"),
    closeInfo: document.getElementById("closeInfoBtn"),
    pause: document.getElementById("pauseBtn"),
    inventory: document.getElementById("invBtn"),
    resume: document.getElementById("resumeBtn"),
    restart: document.getElementById("restartBtn"),
    inventoryFromPause: document.getElementById("inventoryFromPauseBtn"),
    openModMenu: document.getElementById("openModMenuBtn"),
    pauseSettings: document.getElementById("pauseSettingsBtn"),
    quit: document.getElementById("quitBtn"),
    next: document.getElementById("nextBtn"),
    completeMenu: document.getElementById("completeMenuBtn"),
    respawn: document.getElementById("respawnBtn"),
    gameOverRestart: document.getElementById("gameOverRestartBtn"),
    gameOverMenu: document.getElementById("gameOverMenuBtn"),
    closeInventory: document.getElementById("closeInventoryBtn"),
    useSelected: document.getElementById("useSelectedBtn"),
    clearHotbar: document.getElementById("clearHotbarBtn"),
    mobileAttack: document.getElementById("mobileAttack"),
    mobileUse: document.getElementById("mobileUse"),
    mobileSlide: document.getElementById("mobileSlide"),
    mobileInteract: document.getElementById("mobileInteract"),
    closeMod: document.getElementById("closeModBtn"),
    modUnlock: document.getElementById("modUnlockBtn"),
    modGod: document.getElementById("modGodBtn"),
    modDurability: document.getElementById("modDurabilityBtn"),
    modAmmo: document.getElementById("modAmmoBtn"),
    modGiveGun: document.getElementById("modGiveGunBtn"),
    modGiveBazooka: document.getElementById("modGiveBazookaBtn"),
    modGiveSword: document.getElementById("modGiveSwordBtn"),
    modGiveHeals: document.getElementById("modGiveHealsBtn"),
    skinDefault: document.getElementById("skinDefaultBtn"),
    skinGold: document.getElementById("skinGoldBtn"),
    skinRainbow: document.getElementById("skinRainbowBtn"),
    skinGalaxy: document.getElementById("skinGalaxyBtn")
  };

  const state = {
    screen: "menu", // menu | playing | paused | inventory | complete | gameover | info | mod
    lastScreen: "menu",
    dpr: 1,
    width: 1280,
    height: 720,
    time: 0,
    dt: 0,
    levelTime: 0,
    shake: 0,
    reduceShake: false,
    mobileMode: false,
    muted: false,
    modReturnScreen: "playing",
    mods: {
      unlocked: false,
      godMode: false,
      infiniteDurability: false,
      infiniteAmmo: false,
      skin: "default"
    },
    musicUnlocked: false,
    musicPausedForDeath: false,
    save: defaultSave(),
    run: defaultRunStats()
  };

  const camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  const input = createInputManager();
  const touch = createTouchManager();

  let level = null;
  let player = null;
  let particles = [];
  let projectiles = [];
  let floatingTexts = [];
  let currentLevelId = "tutorial";
  let pendingNextLevelId = null;
  let lastStamp = performance.now();

  function defaultSave() {
    return {
      version: VERSION,
      highestUnlockedLevel: 1,
      totalCoins: 0,
      totalXP: 0,
      bestRank: "—",
      bestScore: 0,
      lastPlayedLevel: "tutorial",
      settings: {
        reduceShake: false,
        muted: false
      }
    };
  }

  function defaultRunStats() {
    return {
      coins: 0,
      xp: 0,
      score: 0,
      enemiesDefeated: 0,
      damageTaken: 0,
      coinsPossible: 0,
      startedAt: 0,
      completed: false
    };
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function center(rect) {
    return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
  }

  function show(el) {
    el.classList.remove("hidden");
    el.classList.add("active");
  }

  function hide(el) {
    el.classList.add("hidden");
    el.classList.remove("active");
  }

  function hideAllScreens() {
    hide(dom.mainMenu);
    hide(dom.pauseMenu);
    hide(dom.infoModal);
    hide(dom.modMenu);
    hide(dom.levelComplete);
    hide(dom.gameOver);
  }

  function setScreen(next) {
    state.lastScreen = state.screen;
    state.screen = next;
    hideAllScreens();

    if (next === "menu") {
      updateMenuButtons();
      show(dom.mainMenu);
      hide(dom.hud);
      hide(dom.inventoryModal);
    } else if (next === "playing") {
      hide(dom.hud);
      dom.hud.classList.remove("hidden");
      hide(dom.inventoryModal);
    } else if (next === "paused") {
      show(dom.pauseMenu);
      dom.hud.classList.remove("hidden");
    } else if (next === "inventory") {
      dom.hud.classList.remove("hidden");
      showInventory();
    } else if (next === "mod") {
      show(dom.modMenu);
      if (player) dom.hud.classList.remove("hidden");
      hide(dom.inventoryModal);
      renderModMenu();
    } else if (next === "complete") {
      show(dom.levelComplete);
      hide(dom.inventoryModal);
      dom.hud.classList.remove("hidden");
    } else if (next === "gameover") {
      show(dom.gameOver);
      hide(dom.inventoryModal);
      dom.hud.classList.remove("hidden");
    } else if (next === "info") {
      show(dom.infoModal);
    }
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      state.save = {
        ...defaultSave(),
        ...parsed,
        settings: { ...defaultSave().settings, ...(parsed.settings || {}) }
      };
      state.reduceShake = Boolean(state.save.settings.reduceShake);
      state.muted = Boolean(state.save.settings.muted);
    } catch (err) {
      console.warn("Save load failed", err);
    }
  }

  function saveGame() {
    state.save.settings.reduceShake = state.reduceShake;
    state.save.settings.muted = state.muted;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state.save));
    } catch (err) {
      console.warn("Save failed", err);
    }
  }

  function clearSave() {
    localStorage.removeItem(SAVE_KEY);
    state.save = defaultSave();
    state.reduceShake = false;
    state.muted = false;
    toast("Save data reset.");
    updateModePill();
    updateMenuButtons();
  }

  function updateModePill() {
    dom.modePill.textContent = state.mobileMode
      ? "Mobile mode active: virtual joystick + action buttons"
      : "Desktop mode active: WASD / arrows + hotbar keys";
  }

  function resizeCanvas() {
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    canvas.style.width = state.width + "px";
    canvas.style.height = state.height + "px";
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    const wasMobile = state.mobileMode;
    state.mobileMode = window.matchMedia("(pointer: coarse)").matches || state.width < 860;
    dom.mobileControls.classList.toggle("hidden", !state.mobileMode);
    updateModePill();

    if (player && wasMobile !== state.mobileMode) {
      toast(state.mobileMode ? "Mobile joystick enabled." : "Desktop controls enabled.");
    }
  }

  function createInputManager() {
    const keys = new Set();
    const api = {
      keys,
      jumpBuffer: 0,
      attackPressed: false,
      interactPressed: false,
      usePressed: false,
      downPressed: false,
      slideHeld: false,
      left: false,
      right: false,
      down: false,
      mobileAxisX: 0,
      mobileAxisY: 0,
      setMobileAxis(x = 0, y = 0) {
        this.mobileAxisX = clamp(x, -1, 1);
        this.mobileAxisY = clamp(y, -1, 1);
      },
      pressJump() {
        this.jumpBuffer = 0.24;
      },
      pressAttack() {
        this.attackPressed = true;
      },
      pressInteract() {
        this.interactPressed = true;
      },
      pressUse() {
        this.usePressed = true;
      },
      pressDown() {
        this.downPressed = true;
      },
      update(dt) {
        this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
        this.left = keys.has("arrowleft") || keys.has("a");
        this.right = keys.has("arrowright") || keys.has("d");
        this.down = keys.has("arrowdown") || keys.has("s");
        this.slideHeld = this.down;
      },
      endFrame() {
        this.attackPressed = false;
        this.interactPressed = false;
        this.usePressed = false;
        this.downPressed = false;
      }
    };

    window.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
      const typingTarget = document.activeElement && ["input", "textarea"].includes(document.activeElement.tagName?.toLowerCase());

      if (typingTarget) {
        if (k === "m" && state.screen === "mod") {
          e.preventDefault();
          closeModMenu();
          return;
        }
        if (k === "enter" && document.activeElement === dom.modPasswordInput) submitModPassword();
        if (k === "escape" && state.screen === "mod") closeModMenu();
        return;
      }

      if (k === "m") {
        e.preventDefault();
        toggleModMenu();
        return;
      }

      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key) || ["w", "a", "s", "d"].includes(k)) {
        e.preventDefault();
      }

      unlockMusicFromGesture();

      if (!keys.has(k)) {
        if (k === "w" || k === "arrowup") api.pressJump();
        if (k === "s" || k === "arrowdown") api.pressDown();
        if (k === " ") api.pressAttack();
        if (k === "k") api.pressInteract();
        if (k === "q" || k === "i") api.pressUse();
        if (k === "e") toggleInventory();
        if (k === "escape") togglePause();
        if (/^[1-6]$/.test(k) && player) {
          player.selectedSlot = Number(k) - 1;
          renderHotbar();
          updateEquippedPill();
        }
      }

      keys.add(k);
    }, { passive: false });

    window.addEventListener("keyup", (e) => {
      keys.delete(e.key.toLowerCase());
    });

    window.addEventListener("blur", () => keys.clear());

    canvas.addEventListener("mousedown", (e) => {
      unlockMusicFromGesture();
      if (state.screen === "playing" && e.button === 0) api.pressAttack();
    });

    return api;
  }

  function createTouchManager() {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let active = false;
    let jumpTriggered = false;
    let downTriggered = false;
    const DEADZONE = 12;
    const JOY_RADIUS = 72;

    function showJoystick(x, y) {
      if (!dom.mobileJoystick) return;
      dom.mobileJoystick.classList.add("active");
      dom.mobileJoystick.style.left = `${x}px`;
      dom.mobileJoystick.style.top = `${y}px`;
      updateJoystick(0, 0);
    }

    function updateJoystick(dx, dy) {
      if (!dom.mobileJoystickKnob) return;
      const dist = Math.hypot(dx, dy);
      const scale = dist > JOY_RADIUS ? JOY_RADIUS / dist : 1;
      const kx = dx * scale;
      const ky = dy * scale;
      dom.mobileJoystickKnob.style.transform = `translate(${kx}px, ${ky}px)`;
    }

    function hideJoystick() {
      if (dom.mobileJoystick) dom.mobileJoystick.classList.remove("active");
      if (dom.mobileJoystickKnob) dom.mobileJoystickKnob.style.transform = "translate(0, 0)";
    }

    function pointInsideElement(el, x, y) {
      if (!el || el.classList?.contains("hidden")) return false;
      const r = el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }

    function touchStartedOnProtectedUI(e) {
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return false;
      const x = t.clientX;
      const y = t.clientY;

      // iPhone/Safari can sometimes leak touches through overlay HUD buttons into
      // the canvas. Guard the button zones by coordinate so the joystick never
      // steals pause, backpack, hotbar, or action-button taps.
      const protectedEls = [
        buttons.pause,
        buttons.inventory,
        dom.hotbar,
        buttons.mobileAttack,
        buttons.mobileInteract,
        buttons.mobileUse,
        buttons.mobileSlide,
        dom.inventoryModal,
        dom.pauseMenu,
        dom.modMenu,
        dom.infoModal,
        dom.levelComplete,
        dom.gameOver
      ];

      return protectedEls.some(el => pointInsideElement(el, x, y));
    }

    const api = {
      bind() {
        canvas.addEventListener("touchstart", (e) => {
          unlockMusicFromGesture();
          if (state.screen !== "playing") return;
          if (!e.changedTouches.length) return;
          if (touchStartedOnProtectedUI(e)) {
            input.setMobileAxis(0, 0);
            active = false;
            hideJoystick();
            return;
          }
          const t = e.changedTouches[0];
          startX = t.clientX;
          startY = t.clientY;
          startTime = performance.now();
          active = true;
          jumpTriggered = false;
          downTriggered = false;
          input.setMobileAxis(0, 0);
          showJoystick(startX, startY);
          e.preventDefault();
        }, { passive: false });

        canvas.addEventListener("touchmove", (e) => {
          if (state.screen !== "playing") return;
          if (!active || !e.changedTouches.length) {
            e.preventDefault();
            return;
          }
          const t = e.changedTouches[0];
          const dx = t.clientX - startX;
          const dy = t.clientY - startY;
          const absX = Math.abs(dx);
          const absY = Math.abs(dy);

          updateJoystick(dx, dy);

          // Drag left/right anywhere on the game view to move like a joystick.
          const axisX = absX > DEADZONE ? clamp(dx / JOY_RADIUS, -1, 1) : 0;
          const axisY = absY > DEADZONE ? clamp(dy / JOY_RADIUS, -1, 1) : 0;
          input.setMobileAxis(axisX, axisY);

          // One upward swipe/drag pops a jump without killing horizontal control.
          if (!jumpTriggered && dy < -58 && absY > absX * 0.72) {
            input.pressJump();
            jumpTriggered = true;
          }

          // One downward swipe/drag drops through green platforms or slides.
          if (!downTriggered && dy > 64 && absY > absX * 0.7) {
            if (!player?.dropThroughOneWayPlatform?.()) player?.triggerSlide();
            downTriggered = true;
          }
          e.preventDefault();
        }, { passive: false });

        canvas.addEventListener("touchend", (e) => {
          if (state.screen !== "playing" || !active || !e.changedTouches.length) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - startX;
          const dy = t.clientY - startY;
          const elapsed = performance.now() - startTime;
          const moved = Math.hypot(dx, dy);

          // Quick tap anywhere on the canvas attacks. Interact is now a real button.
          if (elapsed < 260 && moved < 26) input.pressAttack();

          input.setMobileAxis(0, 0);
          active = false;
          hideJoystick();
          e.preventDefault();
        }, { passive: false });

        canvas.addEventListener("touchcancel", () => {
          input.setMobileAxis(0, 0);
          active = false;
          hideJoystick();
        });
      }
    };
    return api;
  }

  class Particle {
    constructor(x, y, opts = {}) {
      this.x = x;
      this.y = y;
      this.vx = opts.vx ?? rand(-120, 120);
      this.vy = opts.vy ?? rand(-180, -40);
      this.life = opts.life ?? rand(0.35, 0.85);
      this.maxLife = this.life;
      this.size = opts.size ?? rand(3, 8);
      this.color = opts.color ?? COLORS.gold;
      this.gravity = opts.gravity ?? 520;
      this.alpha = 1;
    }

    update(dt) {
      this.life -= dt;
      this.vy += this.gravity * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.alpha = clamp(this.life / this.maxLife, 0, 1);
    }

    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x - camera.x, this.y - camera.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  class FloatingText {
    constructor(x, y, text, color = "#fff") {
      this.x = x;
      this.y = y;
      this.text = text;
      this.color = color;
      this.life = 1;
      this.maxLife = 1;
      this.vy = -42;
    }

    update(dt) {
      this.life -= dt;
      this.y += this.vy * dt;
    }

    draw() {
      const a = clamp(this.life / this.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = "900 18px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(0,0,0,.45)";
      ctx.fillStyle = this.color;
      ctx.strokeText(this.text, this.x - camera.x, this.y - camera.y);
      ctx.fillText(this.text, this.x - camera.x, this.y - camera.y);
      ctx.restore();
    }
  }

  class Player {
    constructor(x, y) {
      this.spawnX = x;
      this.spawnY = y;
      this.x = x;
      this.y = y;
      this.w = 42;
      this.h = 62;
      this.vx = 0;
      this.vy = 0;
      this.facing = 1;
      this.maxHP = 100;
      this.hp = 100;
      this.speed = 335;
      this.mobileSpeed = 270;
      this.mobileDirection = 1;
      this.jumpPower = 930;
      this.gravity = 1780;
      this.grounded = false;
      this.coyote = 0;
      this.invincible = 0;
      this.attackTimer = 0;
      this.attackCooldown = 0;
      this.gunCooldown = 0;
      this.slideTimer = 0;
      this.dropIgnorePlatform = null;
      this.state = "idle";
      this.dead = false;
      this.inventory = { smallPotion: 0, largePotion: 0, key: 0, sword: 0, gun: 0, bazooka: 0, shard: 0 };
      this.weaponDurability = { sword: 0, gun: 0, bazooka: 0 };
      this.hotbar = [null, null, null, null, null, null];
      this.selectedSlot = 0;
      this.useFlash = 0;
      this.thought = { text: "", life: 0, maxLife: 0 };
      this.groundPlatform = null;
      this.checkpoint = { x, y };
    }

    get rect() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    }

    get feet() {
      return { x: this.x + 3, y: this.y + this.h - 4, w: this.w - 6, h: 8 };
    }

    update(dt) {
      if (this.dead) return;

      this.invincible = Math.max(0, this.invincible - dt);
      this.attackTimer = Math.max(0, this.attackTimer - dt);
      this.attackCooldown = Math.max(0, this.attackCooldown - dt);
      this.gunCooldown = Math.max(0, this.gunCooldown - dt);
      this.slideTimer = Math.max(0, this.slideTimer - dt);
      this.useFlash = Math.max(0, this.useFlash - dt);
      this.thought.life = Math.max(0, this.thought.life - dt);

      let targetVX = 0;
      if (state.inputLocked) {
        targetVX = 0;
      } else if (state.mobileMode && state.screen === "playing") {
        const axis = Math.abs(input.mobileAxisX) > 0.12 ? input.mobileAxisX : 0;
        targetVX = this.speed * axis;
        if (axis !== 0) {
          this.mobileDirection = Math.sign(axis);
          this.facing = this.mobileDirection;
        }
      } else {
        if (input.left) targetVX -= this.speed;
        if (input.right) targetVX += this.speed;
        if (targetVX !== 0) this.facing = Math.sign(targetVX);
      }

      if (this.slideTimer > 0) targetVX *= 1.08;
      this.vx = lerp(this.vx, targetVX, 1 - Math.pow(0.0005, dt));

      if (!state.inputLocked && input.jumpBuffer > 0 && (this.grounded || this.coyote > 0)) {
        this.vy = -this.jumpPower;
        this.grounded = false;
        this.coyote = 0;
        input.jumpBuffer = 0;
        spawnParticles(this.x + this.w / 2, this.y + this.h, 8, "#d9f6ff", 0.35);
        tinyBeep(420, 0.035);
      }

      if (!state.inputLocked && input.attackPressed) this.attack();
      if (!state.inputLocked && input.usePressed) this.useSelectedItem();
      if (!state.inputLocked && input.downPressed) this.dropThroughOneWayPlatform();

      this.vy += this.gravity * dt;
      this.vy = Math.min(this.vy, 900);

      this.moveX(dt);
      this.moveY(dt);

      if (this.y > level.worldHeight + 220) this.takeDamage(999, "fell into the void");
      if (this.attackTimer > 0) this.resolveAttackHits();

      if (!this.grounded) this.state = this.vy < 0 ? "jump" : "fall";
      else if (this.slideTimer > 0) this.state = "slide";
      else if (this.attackTimer > 0) this.state = "attack";
      else if (Math.abs(this.vx) > 18) this.state = "run";
      else this.state = "idle";
    }

    moveX(dt) {
      this.x += this.vx * dt;
      for (const p of level.platforms) {
        // One-way tutorial platforms are intentionally forgiving: you can jump up
        // through the underside and only collide when landing on top.
        if (p.oneWay) continue;
        if (rectsOverlap(this.rect, p)) {
          if (this.vx > 0) this.x = p.x - this.w;
          else if (this.vx < 0) this.x = p.x + p.w;
          this.vx = 0;
        }
      }
      this.x = clamp(this.x, 0, level.worldWidth - this.w);
    }

    moveY(dt) {
      const prevBottom = this.y + this.h;
      this.y += this.vy * dt;
      const wasGrounded = this.grounded;
      this.grounded = false;
      this.groundPlatform = null;

      for (const p of level.platforms) {
        if (p.oneWay) {
          if (this.dropIgnorePlatform === p) {
            if (this.y + this.h > p.y + p.h + 8) this.dropIgnorePlatform = null;
            else continue;
          }
          const fallingOntoTop = this.vy >= 0 && prevBottom <= p.y + 18;
          if (fallingOntoTop && rectsOverlap(this.rect, p)) {
            this.y = p.y - this.h;
            this.vy = 0;
            this.grounded = true;
            this.groundPlatform = p;
            this.coyote = 0.22;
          }
          continue;
        }

        if (rectsOverlap(this.rect, p)) {
          if (this.vy > 0) {
            this.y = p.y - this.h;
            this.vy = 0;
            this.grounded = true;
            this.groundPlatform = p;
            this.coyote = 0.22;
          } else if (this.vy < 0) {
            this.y = p.y + p.h;
            this.vy = 0;
          }
        }
      }
      if (!this.grounded) this.coyote = wasGrounded ? 0.22 : Math.max(0, this.coyote - dt);
    }

    setMobileDirection(dir) {
      const next = dir < 0 ? -1 : 1;
      if (this.mobileDirection === next) {
        this.think(next > 0 ? "Auto-run: right." : "Auto-run: left.", 1.4);
        return;
      }
      this.mobileDirection = next;
      this.facing = next;
      this.vx = Math.sign(this.vx || next) === next ? this.vx : 0;
      spawnParticles(this.x + this.w / 2, this.y + this.h - 5, 8, COLORS.cyan, 0.24);
      this.think(next > 0 ? "Turning right." : "Turning left.", 1.7);
      toast(next > 0 ? "Mobile auto-run direction: right" : "Mobile auto-run direction: left");
    }

    weaponMaxDurability(id) {
      return WEAPON_DURABILITY[id]?.max || 0;
    }

    weaponDurabilityPct(id) {
      const max = this.weaponMaxDurability(id);
      if (!max) return 0;
      if (state.mods?.infiniteDurability) return 1;
      return clamp((this.weaponDurability[id] || 0) / max, 0, 1);
    }

    ensureWeaponDurability(id) {
      const max = this.weaponMaxDurability(id);
      if (!max) return;
      if ((this.weaponDurability[id] || 0) <= 0) this.weaponDurability[id] = max;
    }

    damageWeapon(id, amount, reason = "use") {
      const max = this.weaponMaxDurability(id);
      if (!max || (this.inventory[id] || 0) <= 0) return false;
      if (state.mods?.infiniteDurability) {
        if ((this.weaponDurability[id] || 0) <= 0) this.weaponDurability[id] = max;
        renderHotbar();
        updateEquippedPill();
        return false;
      }
      if ((this.weaponDurability[id] || 0) <= 0) this.weaponDurability[id] = max;
      this.weaponDurability[id] = clamp(this.weaponDurability[id] - amount, 0, max);
      const def = ITEM_DEFS[id];
      if (reason === "impact") {
        floatingTexts.push(new FloatingText(this.x + this.w / 2, this.y - 46, `-${amount} durability`, "#ffd27a"));
      }
      if (this.weaponDurability[id] <= 0) {
        this.breakWeapon(id);
        return true;
      }
      renderHotbar();
      updateEquippedPill();
      return false;
    }

    breakWeapon(id) {
      const def = ITEM_DEFS[id];
      this.weaponDurability[id] = 0;
      this.inventory[id] = 0;
      this.hotbar = this.hotbar.map(slot => slot === id ? null : slot);
      this.think(`${def?.name || "Weapon"} broke.`, 2.5);
      toast(`${def?.name || "Weapon"} broke and vanished from your hotbar.`);
      spawnParticles(this.x + this.w / 2, this.y + this.h / 2, 18, COLORS.danger, 0.42);
      tinyBeep(120, 0.06);
      renderHotbar();
      renderInventory();
      updateEquippedPill();
    }

    dropThroughOneWayPlatform() {
      if (!this.grounded || !this.groundPlatform || !this.groundPlatform.oneWay) return false;
      this.dropIgnorePlatform = this.groundPlatform;
      this.grounded = false;
      this.groundPlatform = null;
      this.coyote = 0;
      this.y += 10;
      this.vy = Math.max(this.vy, 230);
      spawnParticles(this.x + this.w / 2, this.y + this.h - 5, 6, "#b6f7ff", 0.22);
      tinyBeep(300, 0.025);
      return true;
    }

    weaponId() {
      const id = this.currentItemId();
      return ITEM_DEFS[id]?.weapon ? id : null;
    }

    attack() {
      const weapon = this.weaponId();
      if (weapon === "gun" || weapon === "bazooka") {
        this.fireGun(weapon);
        return;
      }
      if (this.attackCooldown > 0) return;
      if (weapon === "sword" && (this.weaponDurability.sword || 0) <= 0) {
        this.breakWeapon("sword");
        return;
      }
      this.attackTimer = 0.18;
      this.attackHitTargets = new Set();
      if (weapon === "sword") this.damageWeapon("sword", WEAPON_DURABILITY.sword.useCost, "swing");
      this.attackCooldown = weapon === "sword" ? 0.30 : 0.42;
      this.state = "attack";
      screenShake(weapon === "sword" ? 5 : 2);
      tinyBeep(weapon === "sword" ? 250 : 180, 0.025);
      const ar = this.attackRect();
      spawnParticles(ar.x + ar.w / 2, ar.y + ar.h / 2, weapon === "sword" ? 10 : 4, weapon === "sword" ? "#bdfbff" : "#d9f6ff", 0.25);
    }

    fireGun(kind = "gun") {
      const def = ITEM_DEFS[kind] || ITEM_DEFS.gun;
      const durability = WEAPON_DURABILITY[kind] || WEAPON_DURABILITY.gun;
      if (this.gunCooldown > 0) return;
      if ((this.weaponDurability[kind] || 0) <= 0 && (this.inventory[kind] || 0) > 0) {
        this.breakWeapon(kind);
        return;
      }
      if ((this.inventory[kind] || 0) <= 0) {
        this.removeEmptyGun(kind);
        this.think(kind === "bazooka" ? "Damn, im out of rockets." : "Damn, im out of ammo.", 3);
        toast(kind === "bazooka" ? "Bazooka is empty." : "Gun is empty.");
        discScratch(0.18);
        return;
      }
      if (!state.mods?.infiniteAmmo) this.inventory[kind]--;
      this.gunCooldown = kind === "bazooka" ? 0.88 : 0.5;
      this.attackTimer = kind === "bazooka" ? 0.18 : 0.12;
      const px = this.facing > 0 ? this.x + this.w + 2 : this.x - (kind === "bazooka" ? 26 : 12);
      const py = this.y + (kind === "bazooka" ? 20 : 23);
      projectiles.push(new Projectile(px, py, this.facing, def.damage, this, kind));
      this.damageWeapon(kind, durability.useCost, "shot");
      spawnParticles(px, py, kind === "bazooka" ? 18 : 10, kind === "bazooka" ? COLORS.danger : COLORS.gold, 0.26);
      screenShake(kind === "bazooka" ? 14 : 8);
      tinyBeep(kind === "bazooka" ? 62 : 80, kind === "bazooka" ? 0.07 : 0.045);
      renderHotbar();
      renderInventory();
      updateEquippedPill();
      if (!state.mods?.infiniteAmmo && (this.inventory[kind] || 0) <= 0) {
        this.removeEmptyGun(kind);
        this.think(kind === "bazooka" ? "Damn, im out of rockets." : "Damn, im out of ammo.", 3);
      }
    }

    removeEmptyGun(kind = "gun") {
      this.inventory[kind] = 0;
      this.weaponDurability[kind] = 0;
      this.hotbar = this.hotbar.map(id => id === kind ? null : id);
      renderHotbar();
      renderInventory();
      updateEquippedPill();
    }

    attackRect() {
      const weapon = this.weaponId();
      const reach = weapon === "sword" ? 86 : 48;
      return {
        x: this.facing > 0 ? this.x + this.w - 5 : this.x - reach + 5,
        y: this.y + 12,
        w: reach,
        h: 44
      };
    }

    attackDamage() {
      const weapon = this.weaponId();
      return weapon === "sword" ? ITEM_DEFS.sword.damage : 10;
    }

    resolveAttackHits() {
      const ar = this.attackRect();
      const dmg = this.attackDamage();
      const weapon = this.weaponId();
      if (!this.attackHitTargets) this.attackHitTargets = new Set();
      for (const enemy of level.enemies) {
        if (!enemy.dead && enemy.hitCooldown <= 0 && rectsOverlap(ar, enemy.rect) && !this.attackHitTargets.has(enemy)) {
          this.attackHitTargets.add(enemy);
          enemy.takeDamage(dmg, this.facing);
          if (weapon === "sword") this.damageWeapon("sword", WEAPON_DURABILITY.sword.impactCost, "impact");
        }
      }
      for (const crate of level.crates) {
        if (!crate.broken && rectsOverlap(ar, crate.rect) && !this.attackHitTargets.has(crate)) {
          this.attackHitTargets.add(crate);
          crate.takeDamage(dmg, this.facing);
          if (weapon === "sword") this.damageWeapon("sword", WEAPON_DURABILITY.sword.impactCost, "impact");
        }
      }
    }

    triggerSlide() {
      if (this.grounded) {
        this.slideTimer = 0.42;
        spawnParticles(this.x + this.w / 2, this.y + this.h, 5, "#b6f7ff", 0.22);
      }
    }

    takeDamage(amount, source = "damage") {
      if (state.mods?.godMode) {
        if (this.invincible <= 0) {
          this.invincible = 0.2;
          floatingTexts.push(new FloatingText(this.x + this.w / 2, this.y - 8, "GOD MODE", COLORS.gold));
          tinyBeep(720, 0.025);
        }
        return;
      }
      if (this.invincible > 0 || this.dead) return;
      const before = this.hp;
      this.hp = Math.max(0, this.hp - amount);
      state.run.damageTaken += before - this.hp;
      this.invincible = 0.95;
      this.vx = -this.facing * 160;
      this.vy = -260;
      this.state = "hurt";
      screenShake(12);
      floatingTexts.push(new FloatingText(this.x + this.w / 2, this.y - 8, `-${amount} HP`, COLORS.danger));
      toast(`VENUS took ${amount} damage (${source}).`);
      tinyBeep(90, 0.05);
      updateHUD();

      if (this.hp <= 0) {
        this.dead = true;
        this.state = "dead";
        pauseMusicForDeath();
        spawnParticles(this.x + this.w / 2, this.y + this.h / 2, 32, COLORS.danger, 0.8);
        setTimeout(() => setScreen("gameover"), 500);
      }
    }

    heal(amount) {
      const before = this.hp;
      this.hp = clamp(this.hp + amount, 0, this.maxHP);
      const gained = this.hp - before;
      if (gained > 0) {
        floatingTexts.push(new FloatingText(this.x + this.w / 2, this.y - 10, `+${gained} HP`, "#8dffad"));
        spawnParticles(this.x + this.w / 2, this.y + this.h / 2, 18, "#8dffad", 0.45);
        tinyBeep(520, 0.05);
      }
      updateHUD();
    }

    addItem(id, count = 1) {
      this.inventory[id] = (this.inventory[id] || 0) + count;
      if (ITEM_DEFS[id]?.weapon) this.ensureWeaponDurability(id);
      if (ITEM_DEFS[id]?.autoEquip && !this.hotbar.includes(id)) {
        const empty = this.hotbar.findIndex(v => !v);
        if (empty !== -1) this.hotbar[empty] = id;
      }
      renderHotbar();
      renderInventory();
      updateEquippedPill();
    }

    useSelectedItem() {
      const id = this.hotbar[this.selectedSlot];
      if (!id) {
        this.think("Nothing in my hand.", 2);
        toast("Selected slot is empty.");
        return false;
      }
      return this.useItem(id);
    }

    useItem(id) {
      const def = ITEM_DEFS[id];
      if (!def) return false;
      if ((this.inventory[id] || 0) <= 0) {
        toast(`No ${def.name} left.`);
        return false;
      }

      if (id === "key") {
        const gates = level.gates || (level.gate ? [level.gate] : []);
        // Only try locked gates near the player. Older builds returned true for
        // already-open gates, so Level 3's first door could accidentally "eat" the
        // key-use action before the final Apprentice door ever checked it.
        const nearLockedGates = gates
          .filter(gate => gate && !gate.open && gate.isNear())
          .sort((a, b) => Math.abs((a.x + a.w / 2) - (this.x + this.w / 2)) - Math.abs((b.x + b.w / 2) - (this.x + this.w / 2)));
        for (const gate of nearLockedGates) {
          if (gate.tryUnlockWithKey()) return true;
        }
        this.think("This key probably belongs to a locked door.", 2.5);
        toast("Stand next to the locked door, then press Q/I with the key in hand.");
        return false;
      }

      if (def.weapon) {
        if ((this.weaponDurability[id] || 0) <= 0) {
          this.breakWeapon(id);
          return false;
        }
        this.think("Weapon ready. Space to attack.", 2);
        toast(`${def.name} is equipped. Press Space to attack.`);
        return false;
      }

      if (!def.usable) {
        toast(`${def.name} cannot be used here.`);
        return false;
      }
      if (def.heal && this.hp >= this.maxHP) {
        toast("HP already full.");
        return false;
      }

      this.inventory[id]--;
      if (this.inventory[id] <= 0) {
        this.inventory[id] = 0;
        this.hotbar = this.hotbar.map(slot => slot === id && this.inventory[id] <= 0 ? null : slot);
      }
      if (def.heal) this.heal(def.heal);
      this.useFlash = 0.28;
      toast(`Used ${def.name}.`);
      floatingTexts.push(new FloatingText(this.x + this.w / 2, this.y - 34, def.name, "#f9e0a0"));
      renderHotbar();
      renderInventory();
      updateEquippedPill();
      updateHUD();
      return true;
    }

    currentItemId() {
      return this.hotbar[this.selectedSlot] || null;
    }

    think(text, duration = 3) {
      this.thought.text = text;
      this.thought.life = duration;
      this.thought.maxLife = duration;
    }

    drawHeldItem(bob) {
      const id = this.currentItemId();
      if (!id) return;
      const def = ITEM_DEFS[id];
      ctx.save();
      ctx.globalAlpha = this.useFlash > 0 ? 0.9 : 1;
      ctx.strokeStyle = "rgba(217,247,255,.85)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-11, -3 + bob);
      ctx.lineTo(-28, -7 + bob);
      ctx.stroke();
      ctx.translate(-42, -18 + bob);
      const pop = this.useFlash > 0 ? 1.14 + Math.sin(state.time * 40) * 0.04 : 1;
      ctx.scale(pop, pop);

      if (id === "smallPotion" || id === "largePotion") {
        drawPotion(-4, -2, id === "largePotion");
      } else if (id === "key") {
        drawKey(0, 3, 1.05);
      } else if (id === "sword") {
        drawSword(0, 4, 1.05);
      } else if (id === "gun") {
        drawGun(0, 8, 1.05);
      } else if (id === "bazooka") {
        drawBazooka(-4, 6, 1.05);
      } else if (id === "shard") {
        ctx.shadowColor = COLORS.cyan;
        ctx.shadowBlur = 14;
        ctx.fillStyle = COLORS.cyan;
        ctx.beginPath();
        ctx.moveTo(16, 0);
        ctx.lineTo(31, 16);
        ctx.lineTo(16, 33);
        ctx.lineTo(1, 16);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#16566b";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.font = "22px system-ui";
        ctx.fillText(def?.icon || "?", 4, 22);
      }
      ctx.restore();
    }

    drawThoughtBubble() {
      if (!this.thought.life || !this.thought.text) return;
      const a = clamp(this.thought.life / Math.max(0.001, this.thought.maxLife), 0, 1);
      const boxW = Math.min(330, state.width - 60);
      const sx = clamp(this.x + this.w / 2 - camera.x - boxW / 2, 24, state.width - boxW - 24);
      const sy = clamp(this.y - camera.y - 92, 54, state.height - 130);
      ctx.save();
      ctx.globalAlpha = Math.min(1, a * 1.25);
      ctx.fillStyle = "rgba(8,7,16,.86)";
      ctx.strokeStyle = "rgba(255,240,190,.36)";
      ctx.lineWidth = 2;
      roundedRect(ctx, sx, sy, boxW, 62, 18);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sx + boxW * 0.48, sy + 62);
      ctx.lineTo(sx + boxW * 0.55, sy + 62);
      ctx.lineTo(this.x + this.w / 2 - camera.x, this.y - camera.y - 10);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fff3cf";
      ctx.font = "900 15px system-ui";
      ctx.textAlign = "center";
      wrapText(ctx, this.thought.text, sx + boxW / 2, sy + 24, boxW - 28, 18);
      ctx.restore();
    }

    respawn() {
      this.dead = false;
      this.x = this.checkpoint.x;
      this.y = this.checkpoint.y;
      this.vx = 0;
      this.vy = 0;
      this.hp = 100;
      this.invincible = 1.2;
      resumeMusicAfterRespawn();
      spawnParticles(this.x + this.w / 2, this.y + this.h / 2, 25, COLORS.cyan, 0.8);
      updateHUD();
      setScreen("playing");
    }

    draw() {
      const sx = this.x - camera.x;
      const sy = this.y - camera.y;
      const blink = this.invincible > 0 && Math.floor(state.time * 20) % 2 === 0;
      if (blink) ctx.globalAlpha = 0.55;

      ctx.save();
      ctx.translate(sx + this.w / 2, sy + this.h / 2);
      ctx.scale(this.facing, 1);
      const bob = this.grounded ? Math.sin(state.time * 10) * 1.6 : 0;
      const crouch = this.slideTimer > 0 ? 12 : 0;

      ctx.globalAlpha *= 0.35;
      ctx.fillStyle = "#05050b";
      ctx.beginPath();
      ctx.ellipse(0, this.h / 2 + 8, 24, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = blink ? 0.55 : 1;

      drawPlayerBodySkin(bob, crouch);

      const head = ctx.createRadialGradient(-5, -29 + bob, 4, 0, -28 + bob, 19);
      head.addColorStop(0, "#ffe2af");
      head.addColorStop(0.72, "#b96e3d");
      head.addColorStop(1, "#48271f");
      ctx.fillStyle = head;
      ctx.beginPath();
      ctx.arc(0, -31 + bob, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#26111d";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = COLORS.cyan;
      ctx.shadowColor = COLORS.cyan;
      ctx.shadowBlur = 10;
      roundedRect(ctx, 2, -34 + bob, 13, 5, 3);
      ctx.fill();
      ctx.shadowBlur = 0;

      drawPlayerHatSkin(bob);

      ctx.strokeStyle = "#090712";
      ctx.lineWidth = 7;
      const legSwing = Math.sin(state.time * 13) * (Math.abs(this.vx) > 25 && this.grounded ? 6 : 1);
      ctx.beginPath();
      ctx.moveTo(-8, 22 + bob);
      ctx.lineTo(-11 + legSwing, 37 + bob);
      ctx.moveTo(8, 22 + bob);
      ctx.lineTo(12 - legSwing, 37 + bob);
      ctx.stroke();

      this.drawHeldItem(bob);

      ctx.strokeStyle = "#d9f7ff";
      ctx.shadowColor = COLORS.cyan;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(14, -3 + bob);
      ctx.lineTo(29, -8 + bob);
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (this.attackTimer > 0) {
        const weapon = this.weaponId();
        const alpha = clamp(this.attackTimer / 0.18, 0, 1);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = weapon === "sword" ? "#bdfbff" : "#fff3cf";
        ctx.lineWidth = weapon === "sword" ? 8 : 4;
        ctx.shadowColor = weapon === "sword" ? COLORS.cyan : COLORS.gold;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(20, -4, weapon === "sword" ? 54 : 36, -0.9, 0.9);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      ctx.restore();
      ctx.globalAlpha = 1;
      this.drawThoughtBubble();
    }
  }

  class Enemy {
    constructor(x, y, minX, maxX, type = "slime", opts = {}) {
      this.x = x;
      this.y = y;
      this.w = type === "bat" ? 42 : type === "apprentice" ? 118 : 52;
      this.h = type === "bat" ? 34 : type === "apprentice" ? 128 : 38;
      this.baseY = y;
      this.minX = minX ?? x - 140;
      this.maxX = maxX ?? x + 140;
      this.type = type;
      this.dir = opts.dir || 1;
      this.behavior = opts.behavior || "patrol";
      this.waveId = opts.waveId || null;
      this.speed = opts.speed || (type === "bat" ? 96 : type === "apprentice" ? 58 : 72);
      this.hp = opts.hp || (type === "bat" ? 55 : type === "apprentice" ? 250 : 70);
      this.maxHP = this.hp;
      this.dead = false;
      this.hitCooldown = 0;
      this.phase = rand(0, Math.PI * 2);
      this.loot = opts.loot || opts.lootOnDeath || [];
      this.onDeath = opts.onDeath || null;
      this.invulnerable = Boolean(opts.invulnerable);
      this.stompTimer = 0;
      // Apprentice mini-boss physics. Other enemies keep their lightweight patrol/fly logic.
      this.vy = 0;
      this.grounded = false;
      this.jumpCooldown = 0;
      this.gravity = type === "apprentice" ? 1780 : 0;
      this.jumpPower = opts.jumpPower || 790;
    }

    get rect() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    }

    update(dt) {
      if (this.dead) return;
      this.hitCooldown = Math.max(0, this.hitCooldown - dt);
      if (this.type === "apprentice") this.jumpCooldown = Math.max(0, this.jumpCooldown - dt);

      if (this.behavior === "chase" && player && !player.dead) {
        this.dir = center(player.rect).x < center(this.rect).x ? -1 : 1;
        this.x += this.dir * this.speed * dt;
      } else if (this.behavior === "bossIntro") {
        this.x += this.dir * this.speed * dt;
      } else if (this.behavior === "idle") {
        // Intentionally still for cutscenes.
      } else {
        this.x += this.dir * this.speed * dt;
        if (this.x < this.minX) {
          this.x = this.minX;
          this.dir = 1;
        } else if (this.x > this.maxX) {
          this.x = this.maxX;
          this.dir = -1;
        }
      }

      if (this.type === "bat") {
        this.y = this.baseY + Math.sin(state.time * 3 + this.phase) * 22;
      } else if (this.type === "apprentice") {
        this.updateApprenticePhysics(dt);
      }

      if (this.type === "apprentice" && (this.behavior === "chase" || this.behavior === "bossIntro")) {
        this.stompTimer -= dt;
        if (this.stompTimer <= 0) {
          this.stompTimer = this.behavior === "bossIntro" ? 0.55 : 0.72;
          screenShake(this.behavior === "bossIntro" ? 9 : 5);
          tinyBeep(58, 0.035);
        }
      }

      if (player && !player.dead && rectsOverlap(player.rect, this.rect)) {
        player.facing = center(player.rect).x < center(this.rect).x ? 1 : -1;
        player.takeDamage(this.type === "bat" ? 12 : this.type === "apprentice" ? 24 : 15, this.type);
      }
    }

    updateApprenticePhysics(dt) {
      const prevBottom = this.y + this.h;

      // No hiding on the high platforms anymore: if VENUS climbs above him,
      // the Apprentice gets a heavy jump without changing his chase speed.
      if (this.behavior === "chase" && player && !player.dead && this.grounded && this.jumpCooldown <= 0) {
        const dx = Math.abs(center(player.rect).x - center(this.rect).x);
        const playerIsHigher = player.y + player.h < this.y + this.h - 62;
        if (playerIsHigher && dx < 560) {
          this.vy = -this.jumpPower;
          this.grounded = false;
          this.jumpCooldown = 1.15;
          screenShake(9);
          tinyBeep(72, 0.045);
        }
      }

      if (this.behavior !== "idle") {
        this.vy += this.gravity * dt;
        this.vy = Math.min(this.vy, 940);
        this.y += this.vy * dt;
      }

      this.grounded = false;
      for (const p of level.platforms) {
        const fallingOntoTop = this.vy >= 0 && prevBottom <= p.y + 26;
        if (fallingOntoTop && rectsOverlap(this.rect, p)) {
          this.y = p.y - this.h;
          this.vy = 0;
          this.grounded = true;
          break;
        }
        if (!p.oneWay && rectsOverlap(this.rect, p) && this.vy < 0) {
          this.y = p.y + p.h;
          this.vy = 0;
        }
      }

      if (this.y > level.worldHeight + 300) {
        this.y = (level.platforms.find(p => p.y >= 700)?.y || 720) - this.h;
        this.vy = 0;
        this.grounded = true;
      }
    }

    takeDamage(amount, direction) {
      if (this.invulnerable) {
        this.hitCooldown = 0.12;
        floatingTexts.push(new FloatingText(this.x + this.w / 2, this.y - 12, "IMMUNE", COLORS.gold));
        spawnParticles(this.x + this.w / 2, this.y + this.h / 2, 8, COLORS.gold, 0.25);
        tinyBeep(95, 0.035);
        return;
      }
      this.hp -= amount;
      this.hitCooldown = 0.18;
      this.x += direction * 14;
      spawnParticles(this.x + this.w / 2, this.y + this.h / 2, this.type === "apprentice" ? 18 : 10, this.type === "bat" ? COLORS.violet : this.type === "apprentice" ? COLORS.danger : "#101018", 0.4);
      floatingTexts.push(new FloatingText(this.x + this.w / 2, this.y - 10, `-${amount}`, "#fff2a0"));
      screenShake(this.type === "apprentice" ? 12 : 6);
      tinyBeep(160, 0.035);
      if (this.hp <= 0) this.die();
    }

    die() {
      this.dead = true;
      state.run.enemiesDefeated++;
      state.run.xp += 20;
      state.run.score += 150;
      floatingTexts.push(new FloatingText(this.x + this.w / 2, this.y - 16, "+20 XP", COLORS.cyan));
      spawnParticles(this.x + this.w / 2, this.y + this.h / 2, this.type === "apprentice" ? 55 : 26, this.type === "bat" ? COLORS.violet : this.type === "apprentice" ? COLORS.danger : "#11101a", this.type === "apprentice" ? 1.1 : 0.8);
      // Tiny coin drop reward.
      level.collectibles.push(new Collectible(this.x + 10, this.y - 18, "coin"));
      level.collectibles.push(new Collectible(this.x + 34, this.y - 28, "coin"));

      if (this.onDeath === "level3ApprenticeDead") {
        // Special boss drop: place the key at the Apprentice's exact death spot,
        // near his feet, so the player can actually see it and press K.
        const keyX = this.x + this.w / 2 - 13;
        const keyY = this.y + this.h - 34;
        level.collectibles.push(new Collectible(keyX, keyY, "key", { x: keyX, y: keyY, requiresInteract: true }));
        level.flags.level3ApprenticeDead = true;
        player?.think?.("The monster dropped a key!", 2.8);
        toast("Apprentice Key dropped by the body. Press K near it to pick it up.");
      } else if (this.onDeath === "level4ApprenticeDead") {
        const keyX = this.x + this.w / 2 - 13;
        const keyY = this.y + this.h - 34;
        level.collectibles.push(new Collectible(keyX, keyY, "key", { x: keyX, y: keyY, requiresInteract: true }));
        level.flags.level4ApprenticeDead = true;
        player?.think?.("He dropped the exit key. Grab it and move!", 3);
        toast("Boss key dropped. Press K near the body to pick it up.");
      } else {
        for (const item of this.loot) {
          const dropX = (item.x == null || (item.x === 0 && item.y === 0)) ? this.x + this.w / 2 - 14 : item.x;
          const dropY = (item.y == null || (item.x === 0 && item.y === 0)) ? this.y + this.h - 34 : item.y;
          level.collectibles.push(new Collectible(dropX, dropY, item.type, { ...item, x: dropX, y: dropY, requiresInteract: item.requiresInteract ?? true, ammo: item.ammo }));
        }
      }
      updateHUD();
    }

    draw() {
      if (this.dead) return;
      const sx = this.x - camera.x;
      const sy = this.y - camera.y;
      const hitFlash = this.hitCooldown > 0;

      ctx.save();
      ctx.translate(sx + this.w / 2, sy + this.h / 2);
      ctx.scale(this.dir, 1);
      const squash = this.type === "bat" ? Math.sin(state.time * 15 + this.phase) * 0.08 : Math.sin(state.time * 8 + this.phase) * 0.08;
      ctx.scale(1 + squash, 1 - squash);

      ctx.shadowColor = this.type === "bat" ? COLORS.violet : "rgba(0,0,0,.6)";
      ctx.shadowBlur = this.type === "bat" ? 14 : 0;
      ctx.fillStyle = hitFlash ? "#ffffff" : (this.type === "bat" ? "#452066" : "#06060a");
      ctx.strokeStyle = this.type === "bat" ? "#12091f" : "#15121f";
      ctx.lineWidth = 3;

      if (this.type === "apprentice") {
        const pulse = Math.sin(state.time * 5 + this.phase) * 0.04;
        ctx.scale(1 + pulse, 1 - pulse * 0.5);
        ctx.fillStyle = hitFlash ? "#ffffff" : "#231322";
        ctx.strokeStyle = "#07040a";
        ctx.beginPath();
        ctx.ellipse(0, 10, 49, 58, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = hitFlash ? "#ffffff" : "#32142b";
        ctx.beginPath();
        ctx.arc(0, -45, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = COLORS.danger;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(-20, -72); ctx.lineTo(-48, -105);
        ctx.moveTo(20, -72); ctx.lineTo(48, -105);
        ctx.stroke();
        ctx.fillStyle = COLORS.danger;
        ctx.shadowColor = COLORS.danger;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(-12, -48, 5, 0, Math.PI * 2);
        ctx.arc(14, -48, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff0d0";
        ctx.beginPath();
        ctx.moveTo(-10, -28); ctx.lineTo(-4, -12); ctx.lineTo(2, -28);
        ctx.moveTo(8, -28); ctx.lineTo(14, -12); ctx.lineTo(20, -28);
        ctx.fill();
        ctx.strokeStyle = "#08040a";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(-26, 58); ctx.lineTo(-34, 80);
        ctx.moveTo(26, 58); ctx.lineTo(34, 80);
        ctx.stroke();
        const pct = clamp(this.hp / Math.max(1, this.maxHP), 0, 1);
        ctx.fillStyle = "rgba(0,0,0,.6)";
        roundedRect(ctx, -this.w / 2 - 8, -this.h / 2 - 28, this.w + 16, 10, 6);
        ctx.fill();
        ctx.fillStyle = pct > 0.5 ? COLORS.gold : pct > 0.25 ? "#ff8a54" : COLORS.danger;
        roundedRect(ctx, -this.w / 2 - 6, -this.h / 2 - 26, (this.w + 12) * pct, 6, 6);
        ctx.fill();
      } else if (this.type === "bat") {
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-10, -2);
        ctx.lineTo(-38, -16 + Math.sin(state.time * 16) * 8);
        ctx.lineTo(-25, 6);
        ctx.moveTo(10, -2);
        ctx.lineTo(38, -16 + Math.sin(state.time * 16) * 8);
        ctx.lineTo(25, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.ellipse(0, 4, 25, 19, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-10, -13, 13, 0, Math.PI * 2);
        ctx.arc(10, -13, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      if (this.type !== "apprentice") {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-7, -3, 4, 0, Math.PI * 2);
        ctx.arc(9, -3, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(-5, -3, 2, 0, Math.PI * 2);
        ctx.arc(11, -3, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  class Projectile {
    constructor(x, y, direction, damage = 35, owner = null, kind = "gun") {
      this.x = x;
      this.y = y;
      this.kind = kind;
      this.w = kind === "bazooka" ? 48 : 34;
      this.h = kind === "bazooka" ? 20 : 14;
      this.dir = direction;
      this.damage = damage;
      this.speed = kind === "bazooka" ? 640 : 980;
      this.life = kind === "bazooka" ? 2.35 : 1.75;
      this.blastRadius = kind === "bazooka" ? 132 : 78;
      this.owner = owner;
      this.dead = false;
    }

    get rect() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    }

    explode() {
      if (this.dead) return;
      this.dead = true;
      const blastRect = {
        x: this.x + this.w / 2 - this.blastRadius,
        y: this.y + this.h / 2 - this.blastRadius,
        w: this.blastRadius * 2,
        h: this.blastRadius * 2
      };
      spawnParticles(this.x + this.w / 2, this.y + this.h / 2, this.kind === "bazooka" ? 34 : 18, this.kind === "bazooka" ? COLORS.danger : COLORS.gold, this.kind === "bazooka" ? 0.55 : 0.34);
      tinyBeep(this.kind === "bazooka" ? 72 : 110, this.kind === "bazooka" ? 0.055 : 0.035);
      if (this.kind === "bazooka") screenShake(18);

      let hitAny = false;
      for (const enemy of level.enemies) {
        if (!enemy.dead && rectsOverlap(blastRect, enemy.rect)) {
          enemy.takeDamage(this.damage, this.dir);
          hitAny = true;
        }
      }
      for (const crate of level.crates) {
        if (!crate.broken && rectsOverlap(blastRect, crate.rect)) {
          crate.takeDamage(this.damage, this.dir);
          hitAny = true;
        }
      }
      if (hitAny) this.owner?.damageWeapon?.(this.kind, (WEAPON_DURABILITY[this.kind] || WEAPON_DURABILITY.gun).impactCost, "impact");
    }

    update(dt) {
      if (this.dead) return;
      this.life -= dt;
      this.x += this.dir * this.speed * dt;
      if (this.life <= 0) {
        this.explode();
        return;
      }

      for (const p of level.platforms) {
        // Bullets should not get eaten by the forgiving floating platforms.
        if (p.oneWay) continue;
        if (rectsOverlap(this.rect, p)) {
          this.explode();
          return;
        }
      }
      for (const enemy of level.enemies) {
        if (!enemy.dead && rectsOverlap(this.rect, enemy.rect)) {
          this.explode();
          return;
        }
      }
      for (const crate of level.crates) {
        if (!crate.broken && rectsOverlap(this.rect, crate.rect)) {
          this.explode();
          return;
        }
      }
    }

    draw() {
      if (this.dead) return;
      const sx = this.x - camera.x;
      const sy = this.y - camera.y;
      ctx.save();
      ctx.shadowColor = this.kind === "bazooka" ? COLORS.danger : COLORS.gold;
      ctx.shadowBlur = this.kind === "bazooka" ? 22 : 16;
      ctx.fillStyle = this.kind === "bazooka" ? "#ffef8a" : "#fff1a1";
      roundedRect(ctx, sx, sy, this.w, this.h, this.kind === "bazooka" ? 10 : 5);
      ctx.fill();
      ctx.fillStyle = this.kind === "bazooka" ? "rgba(255,78,107,.45)" : "rgba(246,199,104,.35)";
      roundedRect(ctx, sx - this.dir * (this.kind === "bazooka" ? 36 : 22), sy + 3, this.kind === "bazooka" ? 42 : 28, this.kind === "bazooka" ? 8 : 4, 4);
      ctx.fill();
      ctx.restore();
    }
  }

  class Hazard {
    constructor(x, y, w, h, type = "spikes", opts = {}) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.type = type;
      this.damage = opts.damage || 18;
      this.startX = x;
      this.range = opts.range || 0;
      this.speed = opts.speed || 0;
      this.phase = opts.phase || 0;
    }

    get rect() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    }

    get hitbox() {
      if (this.type === "spikes") return { x: this.x + 8, y: this.y + 10, w: Math.max(4, this.w - 16), h: Math.max(4, this.h - 10) };
      if (this.type === "thorns") return { x: this.x + 6, y: this.y + 8, w: Math.max(4, this.w - 12), h: Math.max(4, this.h - 8) };
      return this.rect;
    }

    update(dt) {
      if (this.range > 0) {
        this.x = this.startX + Math.sin(state.time * this.speed + this.phase) * this.range;
      }
      if (player && !player.dead && rectsOverlap(player.rect, this.hitbox)) {
        player.takeDamage(this.damage, this.type);
      }
    }

    draw() {
      const sx = this.x - camera.x;
      const sy = this.y - camera.y;
      if (this.type === "spikes") {
        const count = Math.max(2, Math.floor(this.w / 24));
        for (let i = 0; i < count; i++) {
          const x = sx + i * (this.w / count);
          ctx.fillStyle = "#cfd6dd";
          ctx.strokeStyle = "#27313b";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, sy + this.h);
          ctx.lineTo(x + this.w / count / 2, sy);
          ctx.lineTo(x + this.w / count, sy + this.h);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      } else if (this.type === "thorns") {
        ctx.fillStyle = "#133a21";
        roundedRect(ctx, sx, sy + this.h * .55, this.w, this.h * .45, 8);
        ctx.fill();
        ctx.strokeStyle = "#0a1d13";
        ctx.lineWidth = 3;
        for (let i = 0; i < this.w; i += 18) {
          ctx.beginPath();
          ctx.moveTo(sx + i, sy + this.h);
          ctx.lineTo(sx + i + 8, sy + 4);
          ctx.lineTo(sx + i + 16, sy + this.h);
          ctx.stroke();
        }
      } else {
        const g = ctx.createLinearGradient(0, sy, 0, sy + this.h);
        g.addColorStop(0, "#ffef7b");
        g.addColorStop(.5, "#ff743d");
        g.addColorStop(1, "#6d1018");
        ctx.fillStyle = g;
        roundedRect(ctx, sx, sy, this.w, this.h, 12);
        ctx.fill();
      }
    }
  }

  class Collectible {
    constructor(x, y, type = "coin", opts = {}) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.w = ["smallPotion", "largePotion"].includes(type) ? 28 : type === "bazooka" ? 48 : type === "gun" ? 42 : type === "sword" ? 42 : 26;
      this.h = ["smallPotion", "largePotion"].includes(type) ? 34 : type === "bazooka" ? 28 : type === "gun" ? 26 : type === "sword" ? 42 : 26;
      this.collected = false;
      this.phase = rand(0, Math.PI * 2);
      this.requiresInteract = opts.requiresInteract ?? (type !== "coin" && type !== "gem");
      this.ammo = opts.ammo || (type === "gun" ? 6 : type === "bazooka" ? 2 : 1);
      this.onCollect = opts.onCollect || null;
      this.groupId = opts.groupId || null;
      this.autoEquip = Boolean(opts.autoEquip);
      this.promptCooldown = 0;
    }

    get rect() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    }

    update(dt) {
      if (this.collected) return;
      this.promptCooldown = Math.max(0, this.promptCooldown - dt);
      if (!player) return;
      const near = this.requiresInteract
        ? distanceRects(player.rect, this.rect) < 96
        : rectsOverlap(player.rect, this.rect);
      if (!near) return;
      if (this.requiresInteract) {
        if (this.promptCooldown <= 0) {
          player.think(`Press K / tap Interact to pick up ${ITEM_DEFS[this.type]?.name || this.type}.`, 2.2);
          this.promptCooldown = 2.5;
        }
        if (input.interactPressed) this.collect();
      } else {
        this.collect();
      }
    }

    collect() {
      if (this.collected) return;
      this.collected = true;
      const c = center(this.rect);
      if (this.type === "coin") {
        state.run.coins++;
        state.run.score += 25;
        floatingTexts.push(new FloatingText(c.x, c.y - 18, "+1 coin", COLORS.gold));
        spawnParticles(c.x, c.y, 12, COLORS.gold, 0.5);
        tinyBeep(650, 0.025);
      } else if (this.type === "gem") {
        state.run.xp += 35;
        state.run.score += 100;
        player.addItem("shard", 1);
        floatingTexts.push(new FloatingText(c.x, c.y - 18, "+35 XP", COLORS.cyan));
        spawnParticles(c.x, c.y, 16, COLORS.cyan, 0.55);
        tinyBeep(760, 0.035);
      } else {
        const amount = (this.type === "gun" || this.type === "bazooka") ? this.ammo : 1;
        player.addItem(this.type, amount);
        if (this.autoEquip) autoEquipItem(this.type);
        handleCollectEvent(this);
        const def = ITEM_DEFS[this.type];
        floatingTexts.push(new FloatingText(c.x, c.y - 18, `+${def?.name || this.type}`, "#ffe6a8"));
        spawnParticles(c.x, c.y, 18, this.type === "key" ? COLORS.gold : this.type === "sword" ? COLORS.cyan : "#8dffad", 0.6);
        tinyBeep(720, 0.04);
        if (this.type === "key") {
          player.think("A key! I will use this to open the locked tower.", 3.4);
          toast("Tower Key added to backpack. Open E and place it in your hotbar.");
        } else if (this.type === "sword") {
          player.think("Wow, this is sharp! I will use this to attack enemies.", 3.2);
          toast("Sword added to backpack with 100% durability. Equip it from inventory.");
        } else if (this.type === "gun") {
          player.think("Holy SHIT. A gun?! 6 shots to make it count.", 3.0);
          toast("Gun added to backpack with 6 shots and 100% durability.");
        } else if (this.type === "bazooka") {
          player.think("Im about to BLOW SHIT UP! If only i had more then 2 rockets..", 3.2);
          toast("Bazooka added to backpack with 2 rockets and 100% durability.");
        }
      }
      updateHUD();
    }

    draw() {
      if (this.collected) return;
      const floatY = Math.sin(state.time * 3.5 + this.phase) * 6;
      const sx = this.x - camera.x;
      const sy = this.y - camera.y + floatY;
      const cX = sx + this.w / 2;
      const cY = sy + this.h / 2;

      ctx.save();
      if (this.type === "coin") {
        ctx.shadowColor = COLORS.gold;
        ctx.shadowBlur = 12;
        const g = ctx.createRadialGradient(cX - 5, cY - 5, 2, cX, cY, 14);
        g.addColorStop(0, "#fff7a8");
        g.addColorStop(.65, COLORS.gold);
        g.addColorStop(1, "#a45b16");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(cX, cY, 11 + Math.sin(state.time * 8 + this.phase) * 2, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(65,33,9,.7)";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (this.type === "gem") {
        ctx.shadowColor = COLORS.cyan;
        ctx.shadowBlur = 16;
        ctx.fillStyle = "#73f7ff";
        ctx.beginPath();
        ctx.moveTo(cX, sy);
        ctx.lineTo(sx + this.w, cY);
        ctx.lineTo(cX, sy + this.h);
        ctx.lineTo(sx, cY);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#16566b";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (this.type === "smallPotion" || this.type === "largePotion") {
        drawPotion(sx, sy, this.type === "largePotion");
      } else if (this.type === "key") {
        drawKey(sx, sy, 1);
      } else if (this.type === "sword") {
        drawSword(sx, sy, 1);
      } else if (this.type === "gun") {
        drawGun(sx, sy + 4, 1);
      } else if (this.type === "bazooka") {
        drawBazooka(sx, sy + 4, 1);
      }
      if (this.requiresInteract) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(8,7,16,.7)";
        roundedRect(ctx, cX - 13, sy - 18, 26, 18, 9);
        ctx.fill();
        ctx.fillStyle = "#fff3cf";
        ctx.font = "900 12px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("K", cX, sy - 5);
      }
      ctx.restore();
    }
  }

  class Chest {
    constructor(x, y, locked = false, loot = []) {
      this.x = x;
      this.y = y;
      this.w = 58;
      this.h = 42;
      this.locked = locked;
      this.opened = false;
      this.loot = loot;
      this.promptCooldown = 0;
    }

    get rect() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    }

    update(dt) {
      if (this.opened) return;
      this.promptCooldown = Math.max(0, this.promptCooldown - dt);
      const near = player && distanceRects(player.rect, this.rect) < 92;
      if (near && this.promptCooldown <= 0) {
        player.think("Press K to open chest.", 2.1);
        this.promptCooldown = 2.6;
      }
      if (near && input.interactPressed) this.open();
    }

    open() {
      if (this.opened) return;
      if (this.locked && (player.inventory.key || 0) <= 0) {
        toast("Chest locked. Need a key.");
        return;
      }
      if (this.locked) player.inventory.key--;
      this.opened = true;
      state.run.score += 180;
      spawnParticles(this.x + this.w / 2, this.y + 10, 30, COLORS.gold, 0.85);
      floatingTexts.push(new FloatingText(this.x + this.w / 2, this.y - 12, "Chest opened", "#ffe6a8"));
      toast("Chest opened. Loot popped out.");
      screenShake(7);
      for (const item of this.loot) {
        level.collectibles.push(new Collectible(item.x, item.y, item.type, { ...item, requiresInteract: item.requiresInteract ?? true, ammo: item.ammo }));
      }
      updateHUD();
    }

    draw() {
      const sx = this.x - camera.x;
      const sy = this.y - camera.y;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.fillStyle = "rgba(0,0,0,.32)";
      ctx.beginPath();
      ctx.ellipse(this.w / 2, this.h + 8, this.w * .48, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#7d3e20";
      roundedRect(ctx, 0, 12, this.w, 30, 8);
      ctx.fill();
      ctx.strokeStyle = "#2b1613";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = this.opened ? "#bf7439" : "#b15f2d";
      roundedRect(ctx, 0, this.opened ? -9 : 0, this.w, 22, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = COLORS.gold;
      ctx.fillRect(this.w / 2 - 7, 18, 14, 16);
      if (this.locked && !this.opened) {
        ctx.fillStyle = "#fff2a1";
        ctx.font = "900 14px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("🔒", this.w / 2, 15);
      }
      ctx.restore();
    }
  }

  class Crate {
    constructor(x, y, hp = 70, loot = [], opts = {}) {
      this.x = x;
      this.y = y;
      this.w = 54;
      this.h = 54;
      this.maxHP = hp;
      this.hp = hp;
      this.loot = loot;
      this.broken = false;
      this.hitFlash = 0;
      this.spawnFx = opts.spawnFx || 0;
      this.id = opts.id || null;
    }

    get rect() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    }

    takeDamage(amount, direction = 1) {
      if (this.broken) return;
      this.hp = Math.max(0, this.hp - amount);
      this.hitFlash = 0.12;
      this.x += direction * 3;
      floatingTexts.push(new FloatingText(this.x + this.w / 2, this.y - 9, `-${amount}`, "#fff2a0"));
      spawnParticles(this.x + this.w / 2, this.y + this.h / 2, 8, "#b97845", 0.35);
      tinyBeep(130, 0.04);
      if (this.hp <= 0) this.breakOpen();
    }

    breakOpen() {
      if (this.broken) return;
      this.broken = true;
      state.run.score += 80;
      screenShake(6);
      spawnParticles(this.x + this.w / 2, this.y + this.h / 2, 22, "#b97845", 0.7);
      for (const item of this.loot) {
        level.collectibles.push(new Collectible(item.x, item.y, item.type, { ...item, requiresInteract: item.requiresInteract ?? true, ammo: item.ammo }));
      }
      if (!this.loot.length) level.collectibles.push(new Collectible(this.x + 12, this.y - 24, "coin"));
      toast("Crate busted open. Loot spilled out.");
    }

    update(dt) {
      this.hitFlash = Math.max(0, this.hitFlash - dt);
      this.spawnFx = Math.max(0, this.spawnFx - dt);
    }

    draw() {
      if (this.broken) return;
      const sx = this.x - camera.x;
      const sy = this.y - camera.y;
      ctx.save();
      if (this.spawnFx > 0) {
        ctx.globalAlpha = 0.45 + Math.abs(Math.sin(state.time * 22)) * 0.55;
        ctx.shadowColor = COLORS.cyan;
        ctx.shadowBlur = 24;
      }
      ctx.fillStyle = this.hitFlash > 0 ? "#eec08d" : "#a15a32";
      roundedRect(ctx, sx, sy, this.w, this.h, 6);
      ctx.fill();
      ctx.strokeStyle = "#3b1c17";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.strokeStyle = "#5b2a1d";
      ctx.beginPath();
      ctx.moveTo(sx + 7, sy + 7);
      ctx.lineTo(sx + this.w - 7, sy + this.h - 7);
      ctx.moveTo(sx + this.w - 7, sy + 7);
      ctx.lineTo(sx + 7, sy + this.h - 7);
      ctx.stroke();

      const pct = clamp(this.hp / this.maxHP, 0, 1);
      ctx.fillStyle = "rgba(0,0,0,.55)";
      roundedRect(ctx, sx - 2, sy - 14, this.w + 4, 8, 5);
      ctx.fill();
      ctx.fillStyle = pct > 0.5 ? "#8dffad" : pct > 0.25 ? COLORS.gold : COLORS.danger;
      roundedRect(ctx, sx, sy - 12, this.w * pct, 4, 4);
      ctx.fill();
      ctx.restore();
    }
  }


  class TrapDoor {
    constructor(x, y, opts = {}) {
      this.x = x;
      this.y = y;
      this.w = opts.w || 82;
      this.h = opts.h || 18;
      this.opened = false;
      this.loot = opts.loot || [];
      this.promptCooldown = 0;
      this.label = opts.label || "trap door";
    }

    get rect() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    }

    update(dt) {
      if (this.opened || !player) return;
      this.promptCooldown = Math.max(0, this.promptCooldown - dt);
      const near = distanceRects(player.rect, this.rect) < 96;
      if (near && this.promptCooldown <= 0) {
        player.think("Press K / tap Interact to inspect the trap door.", 2.2);
        this.promptCooldown = 2.7;
      }
      if (near && input.interactPressed) this.open();
    }

    open() {
      if (this.opened) return;
      this.opened = true;
      spawnParticles(this.x + this.w / 2, this.y, 28, COLORS.gold, 0.8);
      screenShake(7);
      tinyBeep(260, 0.055);
      toast("A hidden trap door clicked open.");
      player?.think?.("There it is... below.", 2.4);
      for (const item of this.loot) {
        level.collectibles.push(new Collectible(item.x, item.y, item.type, { ...item, requiresInteract: item.requiresInteract ?? true, ammo: item.ammo }));
      }
    }

    draw() {
      const sx = this.x - camera.x;
      const sy = this.y - camera.y;
      ctx.save();
      ctx.fillStyle = this.opened ? "rgba(11,8,18,.68)" : "#6b3b25";
      roundedRect(ctx, sx, sy, this.w, this.h, 5);
      ctx.fill();
      ctx.strokeStyle = this.opened ? "rgba(246,199,104,.55)" : "#2b1613";
      ctx.lineWidth = 3;
      ctx.stroke();
      if (!this.opened) {
        ctx.fillStyle = "rgba(255,231,160,.55)";
        ctx.fillRect(sx + 10, sy + 6, this.w - 20, 3);
        ctx.fillStyle = "rgba(8,7,16,.7)";
        roundedRect(ctx, sx + this.w / 2 - 13, sy - 22, 26, 18, 9);
        ctx.fill();
        ctx.fillStyle = "#fff3cf";
        ctx.font = "900 12px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("K", sx + this.w / 2, sy - 9);
      }
      ctx.restore();
    }
  }

  class Gate {
    constructor(x, y, opts = {}) {
      this.x = x;
      this.y = y;
      this.w = opts.w || 72;
      this.h = opts.h || 120;
      this.open = false;
      this.keyId = opts.keyId || "key";
      this.lastThoughtAt = -999;
    }

    get rect() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    }

    isNear() {
      return player && distanceRects(player.rect, this.rect) < 92;
    }

    tryUnlockWithKey() {
      if (this.open) return false;
      if (!this.isNear()) return false;
      if ((player.inventory[this.keyId] || 0) <= 0) return false;
      player.inventory[this.keyId]--;
      if (player.inventory[this.keyId] <= 0) {
        player.inventory[this.keyId] = 0;
        player.hotbar = player.hotbar.map(id => id === this.keyId ? null : id);
      }
      this.open = true;
      player.think("aHA! Open says ME.", 3);
      toast("Door unlocked. Path opened.");
      spawnParticles(this.x + this.w / 2, this.y + this.h / 2, 38, COLORS.gold, 0.9);
      screenShake(8);
      renderHotbar();
      renderInventory();
      updateEquippedPill();
      return true;
    }

    update() {
      if (!this.open && this.isNear() && state.time - this.lastThoughtAt >= 6) {
        player.think("Hmm, its locked. Maybe theres a key..", 3);
        this.lastThoughtAt = state.time;
      }
      if (!this.open && player && rectsOverlap(player.rect, this.rect)) {
        if (player.vx > 0) player.x = this.x - player.w;
        else if (player.vx < 0) player.x = this.x + this.w;
        player.vx = 0;
      }
    }

    draw() {
      const sx = this.x - camera.x;
      const sy = this.y - camera.y;
      if (this.open) {
        ctx.save();
        ctx.globalAlpha = 0.42;
        ctx.fillStyle = COLORS.cyan;
        roundedRect(ctx, sx + 18, sy + 14, 36, this.h - 20, 18);
        ctx.fill();
        ctx.restore();
        return;
      }
      ctx.fillStyle = "#312938";
      roundedRect(ctx, sx, sy, this.w, this.h, 10);
      ctx.fill();
      ctx.strokeStyle = "#09070e";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "#5a4b61";
      for (let i = 12; i < this.w; i += 18) {
        roundedRect(ctx, sx + i, sy + 8, 8, this.h - 16, 5);
        ctx.fill();
      }
      ctx.fillStyle = COLORS.gold;
      ctx.beginPath();
      ctx.arc(sx + this.w / 2, sy + this.h / 2, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#4c270d";
      ctx.stroke();
      ctx.fillStyle = "#fff3cf";
      ctx.font = "900 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Q", sx + this.w / 2, sy + this.h / 2 + 4);
    }
  }

  function autoEquipItem(id) {
    if (!player || !id) return;
    let slot = player.hotbar.indexOf(id);
    if (slot === -1) {
      slot = player.hotbar.findIndex(v => !v);
      if (slot === -1) slot = player.selectedSlot;
      player.hotbar[slot] = id;
    }
    player.selectedSlot = slot;
    renderHotbar();
    renderInventory();
    updateEquippedPill();
    toast(`${ITEM_DEFS[id]?.name || id} snapped into hotbar slot ${slot + 1}.`);
  }

  function handleCollectEvent(collectible) {
    if (!collectible || !collectible.onCollect || !level) return;
    if (collectible.onCollect === "level2SwordWave") startLevel2SwordWave();
    if (collectible.onCollect === "level3StartSupplyWave") startLevel3SupplyWave();
  }

  function startLevel2SwordWave() {
    if (!level || level.flags.level2SwordWaveStarted) return;
    level.flags.level2SwordWaveStarted = true;
    level.flags.level2WaveSpawned = 0;
    level.flags.level2WaveTimer = 0.25;
    level.flags.level2FirstSeen = false;
    level.flags.level2ThirdLine = false;
    level.flags.level2FirstSeenAt = 0;
    player?.think?.("Something heard that blade...", 2.2);
    toast("Ambush incoming. Hold the line.");
  }

  function updateLevelScripts(dt) {
    if (!level || !player) return;

    if (level.id === "level2") {
      const wave = level.scripts?.swordWave || {};
      if (level.flags.level2SwordWaveStarted) {
        level.flags.level2WaveTimer = (level.flags.level2WaveTimer || 0) - dt;
        if ((level.flags.level2WaveSpawned || 0) < (wave.count || 6) && level.flags.level2WaveTimer <= 0) {
          const spawnX = clamp(camera.x + state.width + (wave.offscreenPadding || 150), player.x + 520, level.worldWidth - 150);
          const spawnY = wave.y ?? 586;
          const slime = new Enemy(spawnX, spawnY, spawnX - 900, spawnX + 120, "slime", {
            behavior: "chase",
            speed: wave.speed || 165,
            hp: wave.hp || 70,
            dir: -1,
            waveId: "level2BladeAmbush"
          });
          level.enemies.push(slime);
          level.flags.level2WaveSpawned++;
          level.flags.level2WaveTimer = wave.interval || 1.5;
          spawnParticles(spawnX + slime.w / 2, spawnY + slime.h / 2, 10, "#11101a", 0.4);
        }

        const waveEnemyVisible = level.enemies.some(e => e.waveId === "level2BladeAmbush" && !e.dead && e.x < camera.x + state.width - 30 && e.x + e.w > camera.x);
        if (waveEnemyVisible && !level.flags.level2FirstSeen) {
          level.flags.level2FirstSeen = true;
          level.flags.level2FirstSeenAt = state.time;
          player.think("AH! Good thing i got a sword.", 3);
        }
        if (!level.flags.level2ThirdLine && (level.flags.level2WaveSpawned || 0) >= 3 && state.time - (level.flags.level2FirstSeenAt || state.time) > 2.4) {
          level.flags.level2ThirdLine = true;
          player.think("OKkkk, maybe i can use a gun.", 3);
        }
      }
      return;
    }

    if (level.id === "level3") updateLevel3Scripts(dt);
    if (level.id === "level4") updateLevel4Scripts(dt);
  }

  function startLevel3SupplyWave() {
    if (!level || level.id !== "level3" || level.flags.level3SupplyWaveStarted) return;
    level.flags.level3SupplyWaveStarted = true;
    level.flags.level3SupplyWaveTimer = 0.4;
    level.flags.level3SupplyWaveIndex = 0;
    level.flags.level3RespawnBatTimer = 8;
    player?.think?.("Uhhhh, all this loot cant be a good sign. What did i get myself into?!.", 4.2);
    toast("The grove heard the chest open. Incoming wave.");
  }

  function spawnLevel3Enemy(kind, x, y, opts = {}) {
    const enemy = new Enemy(x, y, opts.minX ?? x - 600, opts.maxX ?? x + 600, kind, {
      behavior: opts.behavior || "chase",
      speed: opts.speed || (kind === "bat" ? 125 : 145),
      hp: opts.hp || (kind === "bat" ? 55 : 70),
      dir: opts.dir || -1,
      waveId: opts.waveId || "level3Wave"
    });
    level.enemies.push(enemy);
    spawnParticles(x + enemy.w / 2, y + enemy.h / 2, 12, kind === "bat" ? COLORS.violet : "#11101a", 0.45);
    return enemy;
  }

  function spawnLevel3SupplyCrate() {
    const platforms = (level.scripts?.bossCratePlatforms || []).length ? level.scripts.bossCratePlatforms : level.platforms;
    const p = platforms[Math.floor(rand(0, platforms.length))];
    const roll = Math.random();
    let loot;
    if (roll < 0.22) loot = [{ type: "bazooka", ammo: 2, requiresInteract: true, x: p.x + p.w / 2 - 20, y: p.y - 48, autoEquip: true }];
    else if (roll < 0.47) loot = [{ type: "gun", ammo: 6, requiresInteract: true, x: p.x + p.w / 2 - 20, y: p.y - 42, autoEquip: true }];
    else if (roll < 0.72) loot = [{ type: "sword", requiresInteract: true, x: p.x + p.w / 2 - 18, y: p.y - 58, autoEquip: true }];
    else loot = [{ type: "smallPotion", requiresInteract: true, x: p.x + p.w / 2 - 12, y: p.y - 44 }];
    const crate = new Crate(p.x + p.w / 2 - 27, p.y - 54, 55, loot, { spawnFx: 1.25, id: "level3BossSupply" });
    level.crates.push(crate);
    spawnParticles(crate.x + crate.w / 2, crate.y + crate.h / 2, 28, COLORS.cyan, 0.7);
    toast("Supply crate dropped into the arena.");
  }

  function startLevel3BossIntro() {
    if (level.flags.level3BossIntroStarted) return;
    level.flags.level3BossIntroStarted = true;
    level.flags.level3BossPhase = "stomps";
    level.flags.level3BossTimer = 0;
    level.flags.level3StompTimer = 0.1;
    state.inputLocked = true;
    state.cinematicZoom = 1.18;
    level.flags.cameraFocus = "player";
    player.vx = 0;
    player.think("WHAT WAS THAT?!", 2.6);
    screenShake(14);
  }

  function updateLevel3Scripts(dt) {
    const flags = level.flags;

    // The chest ambush waits until every supply item from the chest is actually picked up.
    if (!flags.level3SpikePitLine && player.x > 1475) {
      flags.level3SpikePitLine = true;
      player.think("That wasnt to bad...", 2.6);
    }

    if (!flags.level3SupplyWaveStarted) {
      const group = level.collectibles.filter(c => c.groupId === "level3SupplyChest");
      if (group.length && group.every(c => c.collected)) startLevel3SupplyWave();
    }

    if (flags.level3SupplyWaveStarted) {
      const sequence = level.scripts?.supplyWave?.sequence || ["bat", "slime", "slime", "bat", "slime"];
      flags.level3SupplyWaveTimer -= dt;
      if ((flags.level3SupplyWaveIndex || 0) < sequence.length && flags.level3SupplyWaveTimer <= 0) {
        const idx = flags.level3SupplyWaveIndex || 0;
        const kind = sequence[idx];
        const spawnX = camera.x + state.width + 120;
        const spawnY = kind === "bat" ? (level.scripts?.supplyWave?.batY || 520) : (level.scripts?.supplyWave?.slimeY || 682);
        spawnLevel3Enemy(kind, spawnX, spawnY, { waveId: "level3ChestAmbush", minX: 1500, maxX: 2940, speed: kind === "bat" ? 135 : 150 });
        flags.level3SupplyWaveIndex = idx + 1;
        flags.level3SupplyWaveTimer = level.scripts?.supplyWave?.interval || 1.15;
      }

      const firstGate = (level.gates || [])[0];
      if (firstGate && !firstGate.open) {
        flags.level3RespawnBatTimer = (flags.level3RespawnBatTimer || 8) - dt;
        const activeArenaBats = level.enemies.filter(e => !e.dead && e.type === "bat" && (e.waveId === "level3ChestAmbush" || e.waveId === "level3RespawnBat")).length;
        if (flags.level3RespawnBatTimer <= 0 && activeArenaBats < 4) {
          spawnLevel3Enemy("bat", camera.x + state.width + 100, level.scripts?.supplyWave?.batY || 520, { waveId: "level3RespawnBat", minX: 1660, maxX: 2960, speed: 128 });
          flags.level3RespawnBatTimer = 8;
          toast("Another bat is circling back. Move fast.");
        }
      }
    }

    const firstGate = (level.gates || [])[0];
    if (firstGate?.open && !flags.level3MonsterSlimesStarted && player.x > firstGate.x + 140) {
      flags.level3MonsterSlimesStarted = true;
      flags.level3MonsterSlimeBatsSpawned = 0;
      const baseY = level.scripts?.monsterArea?.slimeY || 682;
      for (let i = 0; i < 4; i++) {
        spawnLevel3Enemy("slime", 3500 + i * 210, baseY, { waveId: "level3MonsterArea", minX: 3180, maxX: 4880, speed: 132 + i * 6 });
      }
    }

    if (flags.level3MonsterSlimesStarted && !flags.level3BossIntroStarted) {
      const deadSlimes = level.enemies.filter(e => e.waveId === "level3MonsterArea" && e.type === "slime" && e.dead).length;
      while ((flags.level3MonsterSlimeBatsSpawned || 0) < Math.floor(deadSlimes / 2)) {
        flags.level3MonsterSlimeBatsSpawned++;
        spawnLevel3Enemy("bat", camera.x + state.width + 120, level.scripts?.monsterArea?.batY || 535, { waveId: "level3MonsterArea", minX: 3180, maxX: 4960, speed: 140 });
      }
      const areaAlive = level.enemies.some(e => e.waveId === "level3MonsterArea" && !e.dead);
      const allSlimeTriggersDone = deadSlimes >= 4 && (flags.level3MonsterSlimeBatsSpawned || 0) >= 2;
      if (!areaAlive && allSlimeTriggersDone) startLevel3BossIntro();
    }

    if (flags.level3BossIntroStarted && !flags.level3BossFightActive && !flags.level3ApprenticeDead) {
      flags.level3BossTimer += dt;
      flags.level3StompTimer -= dt;
      if (flags.level3StompTimer <= 0) {
        flags.level3StompTimer = 0.9;
        screenShake(18);
        tinyBeep(48, 0.06);
      }
      if (!flags.level3HorrifyingLine && flags.level3BossTimer > 2.0) {
        flags.level3HorrifyingLine = true;
        player.think("THAT SOUNDS HORRIFYING!", 2.8);
      }
      if (!flags.level3BossEnemy && flags.level3BossTimer > 4.0) {
        const spawnX = camera.x + state.width + 150;
        const boss = new Enemy(spawnX, 592, spawnX - 900, spawnX + 100, "apprentice", {
          behavior: "bossIntro",
          dir: -1,
          speed: 95,
          hp: 250,
          lootOnDeath: [],
          onDeath: "level3ApprenticeDead",
          waveId: "level3Boss"
        });
        level.enemies.push(boss);
        flags.level3BossEnemy = boss;
        level.flags.cameraFocus = "boss";
      }
      const boss = flags.level3BossEnemy;
      if (boss && !flags.level3BossRoarStarted && boss.x < camera.x + state.width - 190) {
        flags.level3BossRoarStarted = true;
        flags.level3BossRoarTimer = 3;
        boss.behavior = "idle";
        boss.speed = 0;
        boss.thought = null;
        level.flags.cameraFocus = "boss";
        state.cinematicZoom = 1.26;
        screenShake(22);
        // Fake speech from the monster by using floating text above it.
        const roarText = new FloatingText(boss.x + boss.w / 2, boss.y - 34, "You.. DEAD!", COLORS.danger);
        roarText.life = 2.2;
        roarText.maxLife = 2.2;
        floatingTexts.push(roarText);
      }
      if (flags.level3BossRoarStarted) {
        flags.level3BossRoarTimer -= dt;
        screenShake(10);
        if (flags.level3BossRoarTimer <= 0) {
          boss.behavior = "chase";
          boss.speed = 72;
          flags.level3BossFightActive = true;
          flags.level3BossCrateTimer = 6;
          state.inputLocked = false;
          state.cinematicZoom = 1;
          level.flags.cameraFocus = null;
          player.think("HOLY FUCK! WHAT THE FUCK IS THAT!", 2.5);
        }
      }
    }

    if (flags.level3BossFightActive && !flags.level3ApprenticeDead) {
      flags.level3BossCrateTimer = (flags.level3BossCrateTimer || 25) - dt;
      if (flags.level3BossCrateTimer <= 0) {
        spawnLevel3SupplyCrate();
        flags.level3BossCrateTimer = 25;
      }
    }

    if (flags.level3ApprenticeDead && !flags.level3ApprenticeWinLine) {
      flags.level3ApprenticeWinLine = true;
      flags.level3BossFightActive = false;
      state.inputLocked = true;
      state.cinematicZoom = 1.16;
      level.flags.cameraFocus = "player";
      player.think("Holy shit! I did not expect to win that fight!", 3);
      setTimeout(() => {
        if (level?.id === "level3") {
          state.inputLocked = false;
          state.cinematicZoom = 1;
          if (level.flags) level.flags.cameraFocus = null;
        }
      }, 3000);
    }
  }



  function bossSpeak(enemy, text, duration = 2.2, color = COLORS.danger) {
    if (!enemy) return;
    const bubble = new FloatingText(enemy.x + enemy.w / 2, enemy.y - 44, text, color);
    bubble.life = duration;
    bubble.maxLife = duration;
    bubble.vy = -10;
    floatingTexts.push(bubble);
  }

  function spawnLevel4Enemy(kind, x, y, opts = {}) {
    const enemy = new Enemy(x, y, opts.minX ?? x - 900, opts.maxX ?? x + 220, kind, {
      behavior: opts.behavior || "chase",
      speed: opts.speed || (kind === "bat" ? 138 : 148),
      hp: opts.hp || (kind === "bat" ? 55 : 55),
      dir: opts.dir || -1,
      waveId: opts.waveId || "level4Wave"
    });
    level.enemies.push(enemy);
    spawnParticles(x + enemy.w / 2, y + enemy.h / 2, 12, kind === "bat" ? COLORS.violet : "#11101a", 0.42);
    return enemy;
  }

  function spawnLevel4HelperPlatforms() {
    if (!level || level.flags.level4PlatformsSpawned) return;
    level.flags.level4PlatformsSpawned = true;
    const platforms = level.scripts?.helperPlatforms || [];
    for (const p of platforms) {
      const plat = { ...p, oneWay: p.oneWay ?? true, spawnFx: 1.2 };
      level.platforms.push(plat);
      spawnParticles(plat.x + plat.w / 2, plat.y + 12, 24, COLORS.cyan, 0.6);
    }
    toast("The Apprentice spawned unstable platforms into the arena.");
  }

  function spawnLevel4SupplyCrate(secondsMode = "survival") {
    const platforms = (level.scripts?.cratePlatforms || []).length ? level.scripts.cratePlatforms : level.platforms.filter(p => p.oneWay);
    if (!platforms.length) return;
    const p = platforms[Math.floor(rand(0, platforms.length))];
    const roll = Math.random();
    let loot;
    if (roll < 0.24) loot = [{ type: "bazooka", ammo: 2, requiresInteract: true, x: p.x + p.w / 2 - 24, y: p.y - 50, autoEquip: true }];
    else if (roll < 0.49) loot = [{ type: "gun", ammo: 6, requiresInteract: true, x: p.x + p.w / 2 - 20, y: p.y - 44, autoEquip: true }];
    else if (roll < 0.74) loot = [{ type: "smallPotion", requiresInteract: true, x: p.x + p.w / 2 - 12, y: p.y - 44 }];
    else loot = [{ type: "largePotion", requiresInteract: true, x: p.x + p.w / 2 - 12, y: p.y - 44 }];
    const crate = new Crate(p.x + p.w / 2 - 27, p.y - 54, secondsMode === "boss" ? 62 : 52, loot, { spawnFx: 1.4, id: "level4Supply" });
    level.crates.push(crate);
    spawnParticles(crate.x + crate.w / 2, crate.y + crate.h / 2, 34, COLORS.cyan, 0.75);
    toast(secondsMode === "boss" ? "Boss supply crate flashed into the arena." : "Supply crate spawned. Break it fast.");
  }

  function ensureLevel4Boss() {
    const flags = level.flags;
    if (flags.level4BossEnemy && !flags.level4BossEnemy.dead) return flags.level4BossEnemy;
    const cfg = level.scripts?.boss || {};
    const boss = new Enemy(cfg.spawnX || 1030, cfg.groundY || 592, 650, 3550, "apprentice", {
      behavior: "idle",
      dir: -1,
      speed: 0,
      hp: 250,
      invulnerable: true,
      waveId: "level4Apprentice"
    });
    level.enemies.push(boss);
    flags.level4BossEnemy = boss;
    flags.bossFocusTarget = boss;
    return boss;
  }

  function updateLevel4Scripts(dt) {
    const flags = level.flags;
    const cfg = level.scripts || {};

    if (!flags.level4Started) {
      flags.level4Started = true;
      flags.level4Phase = "opening";
      flags.level4Timer = 0;
      flags.level4ShakeTimer = 0.05;
      state.inputLocked = true;
      state.cinematicZoom = 1.12;
      level.flags.cameraFocus = "player";
      player.vx = 0;
      player.think("I recognize that sound..", 2.5);
      screenShake(18);
      toast("Boss Round: The Apprentice returns.");
    }

    const boss = flags.level4BossEnemy || ensureLevel4Boss();

    if (flags.level4Phase === "opening") {
      flags.level4Timer += dt;
      flags.level4ShakeTimer -= dt;
      if (flags.level4ShakeTimer <= 0) {
        flags.level4ShakeTimer = 0.55;
        screenShake(13);
        tinyBeep(54, 0.045);
      }
      if (!flags.level4SawBoss && flags.level4Timer >= 2.0) {
        flags.level4SawBoss = true;
        boss.x = cfg.boss?.spawnX || 1040;
        boss.y = cfg.boss?.groundY || 592;
        level.flags.cameraFocus = "boss";
        flags.bossFocusTarget = boss;
        state.cinematicZoom = 1.25;
        bossSpeak(boss, "You thought i was dead? HA!", 2.2);
        screenShake(16);
      }
      if (!flags.level4BossEntry && flags.level4Timer >= 4.4) {
        flags.level4BossEntry = true;
        level.flags.cameraFocus = "player";
        state.cinematicZoom = 1.08;
        boss.behavior = "bossIntro";
        boss.speed = 68;
        boss.dir = -1;
        boss.x = Math.max(camera.x + state.width + 90, cfg.boss?.spawnX || 1040);
        boss.y = cfg.boss?.groundY || 592;
      }
      if (!flags.level4SlimeSpeech && flags.level4Timer >= 6.8) {
        flags.level4SlimeSpeech = true;
        boss.behavior = "idle";
        boss.speed = 0;
        level.flags.cameraFocus = "boss";
        flags.bossFocusTarget = boss;
        state.cinematicZoom = 1.25;
        bossSpeak(boss, "Lets see how you do against my slimes!", 2.6);
        screenShake(14);
      }
      if (flags.level4Timer >= 9.2) {
        const watch = cfg.bossWatch || { x: 1030, y: 392 };
        boss.x = watch.x;
        boss.y = watch.y;
        boss.vx = 0;
        boss.vy = 0;
        boss.behavior = "idle";
        boss.speed = 0;
        boss.invulnerable = true;
        level.flags.cameraFocus = null;
        state.cinematicZoom = 1;
        state.inputLocked = false;
        flags.level4Phase = "slimeTrial";
        flags.level4SpawnedSlimes = 0;
        flags.level4SlimeSpawnTimer = 0.1;
        flags.level4ResurrectTimer = 0;
        toast("Slime trial started.");
      }
      return;
    }

    if (flags.level4Phase === "slimeTrial") {
      flags.level4SlimeSpawnTimer -= dt;
      if ((flags.level4SpawnedSlimes || 0) < 4 && flags.level4SlimeSpawnTimer <= 0) {
        const spawnX = camera.x + state.width + 140;
        spawnLevel4Enemy("slime", spawnX, cfg.slimeY || 682, { waveId: "level4SlimeTrial", minX: 120, maxX: 1820, speed: 142, hp: 55 });
        flags.level4SpawnedSlimes++;
        flags.level4SlimeSpawnTimer = 0.6;
      }
      const deadSlimes = level.enemies.filter(e => e.waveId === "level4SlimeTrial" && e.type === "slime" && e.dead).length;
      if (!flags.level4ResurrectLine && deadSlimes >= 1) {
        flags.level4ResurrectLine = true;
        flags.level4ResurrectTimer = 2;
        bossSpeak(boss, "RESSURECT MY SLIME!", 2);
        screenShake(18);
      }
      if (flags.level4ResurrectLine && !flags.level4Resurrected && flags.level4ResurrectTimer > 0) {
        flags.level4ResurrectTimer -= dt;
        if (flags.level4ResurrectTimer <= 0) {
          flags.level4Resurrected = true;
          const spawnX = camera.x + state.width + 120;
          spawnLevel4Enemy("slime", spawnX, cfg.slimeY || 682, { waveId: "level4SlimeTrial", minX: 120, maxX: 1820, speed: 155, hp: 65 });
          toast("A slime was resurrected.");
        }
      }
      const allSpawned = (flags.level4SpawnedSlimes || 0) >= 4 && flags.level4Resurrected;
      const alive = level.enemies.some(e => e.waveId === "level4SlimeTrial" && !e.dead);
      if (allSpawned && !alive) {
        flags.level4Phase = "survivalIntro";
        flags.level4Timer = 0;
        state.inputLocked = true;
        level.flags.cameraFocus = "boss";
        flags.bossFocusTarget = boss;
        state.cinematicZoom = 1.25;
        bossSpeak(boss, "What?! How. Alright how bout this..", 2.2);
        screenShake(12);
      }
      return;
    }

    if (flags.level4Phase === "survivalIntro") {
      flags.level4Timer += dt;
      if (!flags.level4GiftSpeech && flags.level4Timer >= 2.2) {
        flags.level4GiftSpeech = true;
        bossSpeak(boss, "Use only what i give you to help you.", 2.4);
        spawnLevel4HelperPlatforms();
        screenShake(10);
      }
      if (flags.level4Timer >= 4.8) {
        flags.level4Phase = "survival";
        flags.level4SurvivalTime = cfg.survivalSeconds || 60;
        flags.level4SurvivalElapsed = 0;
        flags.level4WaveSpawned = false;
        flags.level4CrateTimer = 2;
        flags.level4RespawnedSlimes = 0;
        state.inputLocked = false;
        state.cinematicZoom = 1;
        level.flags.cameraFocus = null;
        toast("Survive the Apprentice's arena for 60 seconds.");
      }
      return;
    }

    if (flags.level4Phase === "survival") {
      flags.level4SurvivalElapsed += dt;
      if (!flags.level4WaveSpawned) {
        flags.level4WaveSpawned = true;
        for (let i = 0; i < 4; i++) {
          spawnLevel4Enemy("bat", camera.x + state.width + 130 + i * 70, (cfg.batY || 510) + (i % 2) * 34, { waveId: "level4Survival", minX: 220, maxX: 2660, speed: 132 + i * 8, hp: 55 });
        }
        for (let i = 0; i < 2; i++) {
          spawnLevel4Enemy("slime", camera.x + state.width + 240 + i * 110, cfg.slimeY || 682, { waveId: "level4Survival", minX: 120, maxX: 2740, speed: 150, hp: 65 });
        }
      }
      const deadSurvivalSlimes = level.enemies.filter(e => e.waveId === "level4Survival" && e.type === "slime" && e.dead).length;
      while ((flags.level4RespawnedSlimes || 0) < deadSurvivalSlimes && flags.level4SurvivalElapsed < flags.level4SurvivalTime) {
        flags.level4RespawnedSlimes++;
        spawnLevel4Enemy("slime", camera.x + state.width + 170, cfg.slimeY || 682, { waveId: "level4Survival", minX: 120, maxX: 2760, speed: 158, hp: 65 });
        bossSpeak(boss, "More.", 1.1);
      }
      flags.level4CrateTimer -= dt;
      if (flags.level4CrateTimer <= 0) {
        spawnLevel4SupplyCrate("survival");
        flags.level4CrateTimer = 10;
      }
      if (flags.level4SurvivalElapsed >= flags.level4SurvivalTime) {
        for (const enemy of level.enemies) {
          if (enemy.waveId === "level4Survival" && !enemy.dead) {
            enemy.dead = true;
            spawnParticles(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 14, enemy.type === "bat" ? COLORS.violet : "#11101a", 0.42);
          }
        }
        flags.level4Phase = "bossFightIntro";
        flags.level4Timer = 0;
        state.inputLocked = true;
        level.flags.cameraFocus = "boss";
        flags.bossFocusTarget = boss;
        state.cinematicZoom = 1.22;
        boss.x = cfg.boss?.fightX || 2720;
        boss.y = cfg.boss?.groundY || 592;
        boss.vy = 0;
        boss.behavior = "idle";
        boss.speed = 0;
        boss.invulnerable = true;
        bossSpeak(boss, "I hope your ready to die!", 2.5);
        screenShake(20);
      }
      return;
    }

    if (flags.level4Phase === "bossFightIntro") {
      flags.level4Timer += dt;
      screenShake(5);
      if (flags.level4Timer >= 2.6) {
        boss.invulnerable = false;
        boss.dead = false;
        boss.hp = 500;
        boss.maxHP = 500;
        boss.behavior = "chase";
        boss.speed = 72;
        boss.dir = -1;
        boss.minX = 120;
        boss.maxX = 3700;
        boss.onDeath = "level4ApprenticeDead";
        boss.waveId = "level4BossFight";
        flags.level4Phase = "bossFight";
        flags.level4BossCrateTimer = 4;
        state.inputLocked = false;
        state.cinematicZoom = 1;
        level.flags.cameraFocus = null;
        toast("Final Apprentice fight: 500 HP. No escaping.");
      }
      return;
    }

    if (flags.level4Phase === "bossFight" && !flags.level4ApprenticeDead) {
      flags.level4BossCrateTimer -= dt;
      if (flags.level4BossCrateTimer <= 0) {
        spawnLevel4SupplyCrate("boss");
        flags.level4BossCrateTimer = 15;
      }
      return;
    }

    if (flags.level4ApprenticeDead && !flags.level4WinLine) {
      flags.level4WinLine = true;
      flags.level4Phase = "exit";
      state.inputLocked = true;
      state.cinematicZoom = 1.14;
      level.flags.cameraFocus = "player";
      player.think("BOOgey Man looking Ass MoTHA FUckA! Better be dead this time.", 3);
      setTimeout(() => {
        if (level?.id === "level4") {
          state.inputLocked = false;
          state.cinematicZoom = 1;
          if (level.flags) level.flags.cameraFocus = null;
        }
      }, 2200);
    }
  }

  function createLevel(levelId = "tutorial") {
    const data = (window.VENUS_LEVELS && window.VENUS_LEVELS[levelId]) || null;
    if (!data) throw new Error(`Level data missing for "${levelId}". Make sure its levels/*.js file loads before script.js.`);

    return {
      id: data.id,
      name: data.name,
      completeTitle: data.completeTitle || `${data.name} Cleared`,
      worldWidth: data.worldWidth,
      worldHeight: data.worldHeight,
      spawn: data.spawn,
      platforms: data.platforms.map(p => ({ ...p })),
      collectibles: [
        ...(data.coins || []).map(c => new Collectible(c.x, c.y, "coin", { requiresInteract: false })),
        ...(data.collectibles || []).map(c => new Collectible(c.x, c.y, c.type, { ...c, requiresInteract: c.requiresInteract, ammo: c.ammo }))
      ],
      hazards: (data.hazards || []).map(h => new Hazard(h.x, h.y, h.w, h.h, h.type, h)),
      enemies: (data.enemies || []).map(e => new Enemy(e.x, e.y, e.minX, e.maxX, e.type || "slime", e)),
      chests: (data.chests || []).map(c => new Chest(c.x, c.y, !!c.locked, c.loot || [])),
      crates: (data.crates || []).map(c => new Crate(c.x, c.y, c.hp || 70, c.loot || [], c)),
      trapdoors: (data.trapdoors || []).map(t => new TrapDoor(t.x, t.y, t)),
      gates: (data.gates || (data.gate ? [data.gate] : [])).map(g => new Gate(g.x, g.y, g)),
      gate: null,
      checkpoint: { ...(data.checkpoint || { x: data.spawn.x + 600, y: data.spawn.y, w: 30, h: 70, active: false }) },
      portal: { ...data.portal },
      signs: (data.signs || []).map(s => ({ ...s })),
      decorations: (data.decorations || []).map(d => ({ ...d })),
      startMessage: data.startMessage || `${data.name} loaded.`,
      flags: {},
      scripts: data.scripts || {}
    };
  }

  function finalizeLevelGates(newLevel) {
    newLevel.gate = newLevel.gates?.[0] || null;
    return newLevel;
  }

  function highestUnlockedLevelId() {
    return levelIdFromOrdinal(state.save.highestUnlockedLevel || 1);
  }

  function nextLevelAfter(levelId) {
    const idx = LEVEL_ORDER.indexOf(levelId);
    if (idx === -1 || idx + 1 >= LEVEL_ORDER.length) return null;
    return LEVEL_ORDER[idx + 1];
  }

  function hasProgression() {
    return (Number(state.save.highestUnlockedLevel) || 1) > 1;
  }

  function updateMenuButtons() {
    if (!buttons.start || !buttons.continue) return;

    const hasProgress = hasProgression();
    const unlockedLevelId = highestUnlockedLevelId();

    // First-time player menu: Play Game only, then Controls/Settings/Credits.
    // After tutorial/progression exists: Continue, Tutorial replay, Reset Progression.
    buttons.start.classList.toggle("hidden", hasProgress);
    buttons.continue.classList.toggle("hidden", !hasProgress);

    if (buttons.tutorial) buttons.tutorial.classList.toggle("hidden", !hasProgress);
    if (buttons.resetProgression) buttons.resetProgression.classList.toggle("hidden", !hasProgress);

    buttons.start.textContent = "Play Game";
    buttons.continue.textContent = `Continue: ${levelTitle(unlockedLevelId)}`;
  }

  function startLevel(levelId = "tutorial", fromContinue = false) {
    state.run = defaultRunStats();
    state.levelTime = 0;
    state.inputLocked = false;
    state.cinematicZoom = 1;
    state.run.startedAt = performance.now();
    currentLevelId = levelId;
    pendingNextLevelId = null;
    level = finalizeLevelGates(createLevel(levelId));
    player = new Player(level.spawn.x, level.spawn.y);

    state.save.lastPlayedLevel = levelId;
    saveGame();

    if (dom.levelNameText) dom.levelNameText.textContent = level.name;

    if (fromContinue) {
      toast(`Continuing: ${level.name}.`);
    }

    state.run.coinsPossible = level.collectibles.filter(c => c.type === "coin").length + level.enemies.length * 2;
    particles = [];
    projectiles = [];
    floatingTexts = [];
    camera.x = clamp(player.x - state.width * 0.25, 0, Math.max(0, level.worldWidth - state.width));
    camera.y = 0;
    renderHotbar();
    renderInventory();
    updateHUD();
    setScreen("playing");
    startSoundtrack();
    toast(level.startMessage);

    const firstTip = level.id === "tutorial"
      ? "A locked tower? I should probaly find the key.."
      : (level.scripts?.firstTip || "I need a hit, im to sober for this..");
    setTimeout(() => player?.think(firstTip, 3), 350);
    toast(state.mobileMode ? "Mobile: drag anywhere to move, swipe up/down for jump/drop, tap to attack, use Interact for loot." : "Desktop: W/↑ jumps. Space attacks. Q/I uses held item.");
  }

  function startGame(fromContinue = false) {
    startLevel(fromContinue ? highestUnlockedLevelId() : "tutorial", fromContinue);
  }

  function restartLevel() {
    startLevel(currentLevelId || "tutorial", false);
  }

  function togglePause() {
    if (!player || state.screen === "menu" || state.screen === "complete" || state.screen === "gameover") return;
    if (state.screen === "playing") setScreen("paused");
    else if (state.screen === "paused") setScreen("playing");
    else if (state.screen === "inventory") {
      hide(dom.inventoryModal);
      setScreen("playing");
    }
  }

  function toggleInventory() {
    if (!player || state.screen === "menu" || state.screen === "complete" || state.screen === "gameover") return;
    if (state.screen === "inventory") {
      hide(dom.inventoryModal);
      setScreen("playing");
    } else {
      renderInventory();
      setScreen("inventory");
    }
  }

  function showInventory() {
    renderInventory();
    show(dom.inventoryModal);
  }

  function renderInventory() {
    if (!player || !dom.inventoryList) return;
    const entries = Object.entries(ITEM_DEFS).filter(([id]) => (player.inventory[id] || 0) > 0);
    dom.inventoryList.innerHTML = "";
    if (!entries.length) {
      dom.inventoryList.innerHTML = `<p class="muted">Backpack empty. The grove robbed you first.</p>`;
      return;
    }
    for (const [id, def] of entries) {
      const btn = document.createElement("button");
      btn.className = "inventory-item";
      const durabilityLine = def.weapon
        ? `<span class="item-desc durability-text">Durability: ${Math.ceil(player.weaponDurabilityPct(id) * 100)}%</span>`
        : "";
      btn.innerHTML = `
        <span class="item-icon">${def.icon}</span>
        <span>
          <span class="item-name">${def.name} × ${player.inventory[id]}</span>
          <span class="item-desc">${def.desc}</span>
          ${durabilityLine}
        </span>
      `;
      btn.addEventListener("click", () => {
        player.hotbar[player.selectedSlot] = id;
        renderHotbar();
        updateEquippedPill();
        toast(`${def.name} assigned to slot ${player.selectedSlot + 1}.`);
      });
      dom.inventoryList.appendChild(btn);
    }
  }

  function renderHotbar() {
    if (!player) return;
    dom.hotbar.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const id = player.hotbar[i];
      const def = id ? ITEM_DEFS[id] : null;
      const slot = document.createElement("button");
      slot.className = "hotbar-slot" + (i === player.selectedSlot ? " selected" : "");
      const durabilityPct = def?.weapon ? Math.ceil(player.weaponDurabilityPct(id) * 100) : null;
      const durabilityBar = def?.weapon
        ? `<em class="durability-meter" title="Durability ${durabilityPct}%"><i style="width:${durabilityPct}%"></i></em>`
        : "";
      const ammoWeapon = id === "gun" || id === "bazooka";
      const countLabel = def ? (ammoWeapon ? `${player.inventory[id] || 0}` : (def.weapon ? `${durabilityPct}%` : `${player.inventory[id] || 0}`)) : "";
      slot.title = def ? `${def.name} (${ammoWeapon ? `${player.inventory[id] || 0} ${id === "bazooka" ? "rockets" : "shots"}, ` : ""}${durabilityPct !== null ? `${durabilityPct}% durability` : `${player.inventory[id] || 0}`})` : "Empty slot";
      slot.innerHTML = `<small>${i + 1}</small><span>${def ? def.icon : ""}</span>${def ? `<b>${countLabel}</b>` : ""}${durabilityBar}`;
      slot.addEventListener("click", () => {
        player.selectedSlot = i;
        renderHotbar();
        updateEquippedPill();
      });
      dom.hotbar.appendChild(slot);
    }
  }

  function updateEquippedPill() {
    if (!player || !dom.equippedPill) return;
    const id = player.hotbar[player.selectedSlot];
    const def = id ? ITEM_DEFS[id] : null;
    const count = id ? (player.inventory[id] || 0) : 0;
    const durabilityPct = def?.weapon ? Math.ceil(player.weaponDurabilityPct(id) * 100) : null;
    const actionText = def?.weapon ? "Space to attack" : id === "key" ? "Q/I near door" : def?.heal ? "Q/I to use" : "Equipped";
    const ammoText = state.mods?.infiniteAmmo ? "∞" : count;
    const weaponInfo = def?.weapon ? ` • Durability ${durabilityPct}%${id === "gun" ? ` • Ammo ${ammoText}` : id === "bazooka" ? ` • Rockets ${ammoText}` : ""}` : ` × ${count}`;
    dom.equippedPill.textContent = def
      ? `In hand: ${def.icon} ${def.name}${weaponInfo}  •  ${actionText}`
      : `In hand: empty  •  E backpack  •  1-6 switch  •  Q/I use  •  S/↓ drops green platforms`;
    dom.equippedPill.classList.toggle("empty", !def);
  }

  function updateHUD() {
    if (!player) return;
    const hpPct = clamp(player.hp / player.maxHP, 0, 1) * 100;
    dom.hpFill.style.width = hpPct + "%";
    dom.hpText.textContent = `${Math.ceil(player.hp)}/${player.maxHP}`;
    const hearts = Math.max(0, Math.ceil(player.hp / 34));
    dom.heartRow.textContent = "♥ ".repeat(hearts).trim() || "♡";
    dom.coinText.textContent = `◎ ${state.run.coins}`;
    dom.xpText.textContent = `XP ${state.run.xp}`;
    dom.scoreText.textContent = `Score ${state.run.score}`;
    renderHotbar();
    updateEquippedPill();
  }

  function showInfo(title, html) {
    dom.infoTitle.textContent = title;
    dom.infoBody.innerHTML = html;
    setScreen("info");
  }

  function showControls() {
    const desktop = `
      <p><strong>Desktop Controls</strong></p>
      <p><kbd>A</kbd>/<kbd>D</kbd> or <kbd>←</kbd>/<kbd>→</kbd> move • <kbd>W</kbd>/<kbd>↑</kbd> jump • <kbd>Space</kbd> attack/use weapon • <kbd>K</kbd> interact/pick up • <kbd>E</kbd> backpack • <kbd>1</kbd>-<kbd>6</kbd> hotbar • <kbd>Q</kbd>/<kbd>I</kbd> use held item/tool • <kbd>Esc</kbd> pause • <kbd>M</kbd> secret mod menu.</p>
    `;
    const mobile = `
      <p><strong>Mobile Controls</strong></p>
      <p>Touch/small screens now use a virtual joystick feel. Drag anywhere on the game view left/right to move, swipe/drag up to jump, swipe/drag down to drop through green platforms or slide, tap the canvas to attack, and use the on-screen K button to interact with chests, trap doors, and loot. Use ✚/Q to use the held item. The selected item is visibly held by VENUS.</p>
    `;
    showInfo("Controls", desktop + mobile + `<p class="muted">Pro tip: Build 18 keeps each map in separate /levels files. Tutorial, Level 1, Level 2, and Level 3 load through LEVEL_ORDER. Keys/tools use Q/I, weapons attack with Space, loot uses K, and Level 2 now has hidden trapdoor/objective scripting.</p>`);
  }

  function showSettings() {
    showInfo("Settings", `
      <div class="settings-list">
        <p><strong>Mobile Mode:</strong> ${state.mobileMode ? "Active joystick/touch build" : "Desktop exploration build"}</p>
        <p><strong>Reduced Screen Shake:</strong> ${state.reduceShake ? "On" : "Off"}</p>
        <p><strong>Music/SFX:</strong> ${state.muted ? "Muted" : "Soundtrack + generated SFX on"}</p>
        <div class="menu-actions compact">
          <button id="toggleShakeSetting" class="ghost-btn">Toggle Screen Shake</button>
          <button id="toggleMuteSetting" class="ghost-btn">Toggle Music/SFX</button>
          <button id="resetSaveSetting" class="danger-btn">Reset Save Data</button>
        </div>
      </div>
    `);
    document.getElementById("toggleShakeSetting").addEventListener("click", () => {
      state.reduceShake = !state.reduceShake;
      saveGame();
      showSettings();
    });
    document.getElementById("toggleMuteSetting").addEventListener("click", () => {
      state.muted = !state.muted;
      if (state.muted && dom.bgMusic) dom.bgMusic.pause();
      if (!state.muted) startSoundtrack();
      saveGame();
      showSettings();
    });
    document.getElementById("resetSaveSetting").addEventListener("click", () => {
      clearSave();
      showSettings();
    });
  }

  function showCredits() {
    showInfo("Credits", `
      <p><strong>V.E.N.U.S.</strong> — the Violent Enforcer with No Understanding of Surrender, serves as the core identity of this original action web‑game prototype.</p>
      <p>Designed for long‑term expansion, the project is built to seamlessly support new characters, bosses, biomes, quests, loot, weapons, and future gameplay systems without requiring major rewrites.</p>
      <p class="muted">Code architecture: Canvas renderer, entity update loop, platform physics, inventory/hotbar system, localStorage save data, offline‑ready service worker, adaptive mobile/desktop mode switching.</p>
      <p><em>Developed By Richie</em></p>
    `);
  }


  function toast(message) {
    const existing = [...dom.toastStack.children].find(n => n.textContent === message);
    if (existing) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    dom.toastStack.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(-8px) scale(.96)";
      setTimeout(() => el.remove(), 220);
    }, 2300);
  }

  function screenShake(amount) {
    if (state.reduceShake) amount *= 0.35;
    state.shake = Math.max(state.shake, amount);
  }

  let audioCtx = null;
  function tinyBeep(freq = 300, duration = 0.04) {
    if (state.muted) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {
      // Audio is a bonus; never let browser autoplay rules break the game.
    }
  }

  function unlockMusicFromGesture() {
    if (state.musicUnlocked) return;
    state.musicUnlocked = true;
    startSoundtrack();
  }

  function startSoundtrack() {
    if (state.muted || !dom.bgMusic) return;
    try {
      dom.bgMusic.volume = 0.42;
      dom.bgMusic.loop = true;
      const playPromise = dom.bgMusic.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Browser autoplay rules may require Start Game/click/tap first. We retry on the next gesture.
        });
      }
    } catch (_) {}
  }

  function pauseMusicForDeath() {
    if (!dom.bgMusic) return;
    state.musicPausedForDeath = true;
    discScratch(0.45);
    try {
      const startVol = dom.bgMusic.volume || 0.42;
      let steps = 0;
      const fade = setInterval(() => {
        steps++;
        dom.bgMusic.volume = Math.max(0, startVol * (1 - steps / 10));
        if (steps >= 10) {
          clearInterval(fade);
          dom.bgMusic.pause();
          dom.bgMusic.volume = 0.42;
        }
      }, 28);
    } catch (_) {}
  }

  function resumeMusicAfterRespawn() {
    if (!dom.bgMusic) return;
    state.musicPausedForDeath = false;
    startSoundtrack();
  }

  function discScratch(duration = 0.28) {
    if (state.muted) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(1500, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + duration);
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1100, now);
      filter.Q.value = 2.4;
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (_) {}
  }

  function spawnParticles(x, y, count, color, life = 0.6) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, {
        color,
        life: rand(life * 0.55, life * 1.15),
        size: rand(2, 7),
        vx: rand(-160, 160),
        vy: rand(-210, -30)
      }));
    }
  }

  function distanceRects(a, b) {
    const ac = center(a);
    const bc = center(b);
    return Math.hypot(ac.x - bc.x, ac.y - bc.y);
  }

  function updateGame(dt) {
    if (!level || !player) return;
    input.update(dt);

    if (state.screen === "playing") {
      state.levelTime += dt;
      player.update(dt);

      for (const hazard of level.hazards) hazard.update(dt);
      for (const enemy of level.enemies) enemy.update(dt);
      for (const projectile of projectiles) projectile.update(dt);
      projectiles = projectiles.filter(projectile => !projectile.dead);
      for (const collectible of level.collectibles) collectible.update(dt);
      for (const chest of level.chests) chest.update(dt);
      for (const crate of level.crates) crate.update(dt);
      for (const trapdoor of level.trapdoors || []) trapdoor.update(dt);
      updateLevelScripts(dt);
      for (const gate of level.gates || []) gate.update(dt);
      updateCheckpoint();
      updatePortal();
      updateCamera(dt);
      updateHUD();
    }

    for (const p of particles) p.update(dt);
    particles = particles.filter(p => p.life > 0);
    for (const t of floatingTexts) t.update(dt);
    floatingTexts = floatingTexts.filter(t => t.life > 0);
    state.shake = Math.max(0, state.shake - 36 * dt);

    input.endFrame();
  }

  function updateCamera(dt) {
    const lead = state.mobileMode ? state.width * 0.34 : state.width * 0.28;
    let focus = player;
    if (level?.flags?.cameraFocus === "boss") {
      const bossTarget = level.flags.bossFocusTarget || level.flags.level4BossEnemy || level.flags.level3BossEnemy;
      if (bossTarget && !bossTarget.dead) focus = bossTarget;
    }
    camera.targetX = clamp(focus.x - lead, 0, Math.max(0, level.worldWidth - state.width));
    camera.targetY = clamp(focus.y - state.height * 0.55, 0, Math.max(0, level.worldHeight - state.height));
    const smooth = 1 - Math.pow(0.0002, dt);
    camera.x = lerp(camera.x, camera.targetX, smooth);
    camera.y = lerp(camera.y, camera.targetY, smooth);
  }

  function updateCheckpoint() {
    const cp = level.checkpoint;
    if (!cp.active && rectsOverlap(player.rect, cp)) {
      cp.active = true;
      player.checkpoint = { x: cp.x - 6, y: cp.y - player.h };
      toast("Checkpoint activated.");
      spawnParticles(cp.x + cp.w / 2, cp.y, 24, COLORS.cyan, 0.85);
      state.run.score += 100;
    }
  }

  function updatePortal() {
    if (rectsOverlap(player.rect, level.portal)) {
      completeLevel();
    }
  }

  function completeLevel() {
    if (state.run.completed) return;
    state.run.completed = true;
    const elapsed = (performance.now() - state.run.startedAt) / 1000;
    const coinScore = state.run.coins * 25;
    const damagePenalty = state.run.damageTaken * 2;
    const timeBonus = Math.max(0, Math.floor(4200 - elapsed * 30));
    const finalScore = Math.max(0, state.run.score + coinScore + timeBonus - damagePenalty);
    state.run.score = finalScore;

    let rank = "C";
    if (finalScore >= 5200 && state.run.damageTaken <= 35) rank = "S";
    else if (finalScore >= 3900) rank = "A";
    else if (finalScore >= 2500) rank = "B";

    state.save.totalCoins += state.run.coins;
    state.save.totalXP += state.run.xp;
    if (finalScore > state.save.bestScore) {
      state.save.bestScore = finalScore;
      state.save.bestRank = rank;
    }
    // Use currentLevelId as a fallback so the completion screen always knows
    // what level was just cleared, even if future level data changes the title/id.
    const finishedLevelId = level?.id || currentLevelId;
    pendingNextLevelId = nextLevelAfter(finishedLevelId);
    if (pendingNextLevelId) {
      state.save.highestUnlockedLevel = Math.max(state.save.highestUnlockedLevel || 1, levelOrdinal(pendingNextLevelId));
    }
    state.save.lastPlayedLevel = finishedLevelId;
    saveGame();
    updateMenuButtons();

    if (dom.completeTitle) dom.completeTitle.textContent = level.completeTitle || `${level.name} Cleared`;
    buttons.next.textContent = pendingNextLevelId ? `Next Level: ${levelTitle(pendingNextLevelId)}` : "Play Again";

    dom.rewardGrid.innerHTML = `
      <div class="reward-card"><span>Rank</span><strong>${rank}</strong></div>
      <div class="reward-card"><span>Score</span><strong>${finalScore}</strong></div>
      <div class="reward-card"><span>Coins</span><strong>${state.run.coins}</strong></div>
      <div class="reward-card"><span>XP</span><strong>${state.run.xp}</strong></div>
      <div class="reward-card"><span>Enemies</span><strong>${state.run.enemiesDefeated}</strong></div>
      <div class="reward-card"><span>Damage</span><strong>${state.run.damageTaken}</strong></div>
      <div class="reward-card"><span>Time</span><strong>${elapsed.toFixed(1)}s</strong></div>
      <div class="reward-card"><span>Total Coins</span><strong>${state.save.totalCoins}</strong></div>
    `;
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, 55, COLORS.cyan, 1.1);
    tinyBeep(860, 0.09);
    setScreen("complete");
  }

  function render() {
    ctx.save();
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    ctx.clearRect(0, 0, state.width, state.height);

    if (state.shake > 0 && state.screen !== "menu") {
      const sx = rand(-state.shake, state.shake);
      const sy = rand(-state.shake, state.shake);
      ctx.translate(sx, sy);
    }
    const zoom = state.cinematicZoom || 1;
    if (zoom !== 1 && state.screen !== "menu") {
      ctx.translate(state.width / 2, state.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-state.width / 2, -state.height / 2);
    }

    drawBackground();

    if (level && player) {
      drawLevel();
      for (const chest of level.chests) chest.draw();
      for (const crate of level.crates) crate.draw();
      for (const trapdoor of level.trapdoors || []) trapdoor.draw();
      for (const gate of level.gates || []) gate.draw();
      for (const collectible of level.collectibles) collectible.draw();
      drawCheckpoint();
      drawPortal();
      for (const hazard of level.hazards) hazard.draw();
      for (const projectile of projectiles) projectile.draw();
      for (const enemy of level.enemies) enemy.draw();
      player.draw();
      for (const p of particles) p.draw();
      for (const t of floatingTexts) t.draw();
      drawSignHints();
    } else {
      drawMenuBackgroundDetails();
    }

    ctx.restore();
  }

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, state.height);
    g.addColorStop(0, COLORS.skyTop);
    g.addColorStop(0.45, COLORS.skyMid);
    g.addColorStop(1, COLORS.skyLow);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, state.width, state.height);

    // Stars/sparks
    ctx.save();
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 70; i++) {
      const x = (i * 173 + state.time * 7) % state.width;
      const y = (i * 89) % Math.max(250, state.height * 0.65);
      const a = Math.sin(state.time * 2 + i) * 0.5 + 0.5;
      ctx.globalAlpha = 0.12 + a * 0.28;
      ctx.fillStyle = i % 3 ? "#e8fbff" : "#ffe8a1";
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.restore();

    if (!level) return;

    drawParallaxHills(0.12, state.height * 0.63, "rgba(132,231,190,.36)", 180);
    drawParallaxHills(0.22, state.height * 0.70, "rgba(80,177,154,.42)", 230);
    drawParallaxTrees(0.36);
  }

  function drawMenuBackgroundDetails() {
    ctx.save();
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 10; i++) {
      const x = (i * 190 + state.time * 20) % (state.width + 220) - 120;
      const y = state.height * (0.7 + (i % 3) * .08);
      drawPlatformVisual(x, y, 160, 52);
    }
    ctx.restore();
  }

  function drawParallaxHills(speed, baseY, color, amp) {
    const shift = camera.x * speed;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-50, state.height);
    for (let x = -100; x < state.width + 200; x += 160) {
      const wx = x - (shift % 160);
      ctx.quadraticCurveTo(wx + 80, baseY - amp - Math.sin((x + shift) * 0.005) * 35, wx + 160, baseY);
    }
    ctx.lineTo(state.width + 100, state.height);
    ctx.closePath();
    ctx.fill();
  }

  function drawParallaxTrees(speed) {
    const shift = camera.x * speed;
    for (let i = -2; i < state.width / 210 + 4; i++) {
      const x = i * 210 - (shift % 210);
      const base = state.height * 0.66 + Math.sin(i) * 40;
      ctx.fillStyle = "rgba(37,67,70,.42)";
      roundedRect(ctx, x + 68, base - 150, 26, 170, 12);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 80, base - 178, 54, 0, Math.PI * 2);
      ctx.arc(x + 36, base - 150, 45, 0, Math.PI * 2);
      ctx.arc(x + 124, base - 144, 50, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawLevel() {
    for (const platform of level.platforms) {
      drawPlatformVisual(platform.x - camera.x, platform.y - camera.y, platform.w, platform.h);
    }

    for (const sign of level.signs) {
      drawSign(sign.x - camera.x, sign.y - camera.y);
    }

    for (const deco of level.decorations || []) {
      drawDecoration(deco);
    }
  }

  function drawPlatformVisual(x, y, w, h) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.22)";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h + 10, w * .48, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    const dirt = ctx.createLinearGradient(0, y, 0, y + h);
    dirt.addColorStop(0, COLORS.dirtLight);
    dirt.addColorStop(.55, COLORS.dirt);
    dirt.addColorStop(1, "#5e2f29");
    ctx.fillStyle = dirt;
    roundedRect(ctx, x, y + 16, w, h - 16, 14);
    ctx.fill();
    ctx.strokeStyle = COLORS.outline;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Cartoon stones in dirt.
    ctx.save();
    ctx.beginPath();
    ctx.rect(x + 4, y + 20, w - 8, h - 24);
    ctx.clip();
    for (let sx = Math.floor(x / 80) * 80; sx < x + w; sx += 88) {
      const cy = y + 45 + ((sx * 13) % Math.max(45, h - 34));
      ctx.fillStyle = "rgba(255,196,130,.22)";
      roundedRect(ctx, sx + 18, cy, 42 + ((sx % 3) * 8), 20, 9);
      ctx.fill();
      ctx.strokeStyle = "rgba(47,21,20,.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();

    // Grass cap.
    const grass = ctx.createLinearGradient(0, y, 0, y + 26);
    grass.addColorStop(0, "#a7ff85");
    grass.addColorStop(0.45, COLORS.grass);
    grass.addColorStop(1, COLORS.grassDark);
    ctx.fillStyle = grass;
    roundedRect(ctx, x - 4, y, w + 8, 28, 10);
    ctx.fill();
    ctx.strokeStyle = "#17562e";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Grass teeth.
    ctx.fillStyle = COLORS.grassDark;
    for (let i = 0; i < w; i += 22) {
      ctx.beginPath();
      ctx.moveTo(x + i, y + 20);
      ctx.lineTo(x + i + 12, y + 39 + ((i / 22) % 2) * 7);
      ctx.lineTo(x + i + 23, y + 20);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawDecoration(deco) {
    const sx = deco.x - camera.x;
    const sy = deco.y - camera.y + Math.sin(state.time * 3 + (deco.phase || 0)) * 4;
    ctx.save();
    if (deco.type === "key") {
      ctx.globalAlpha = deco.alpha ?? 0.92;
      drawKey(sx, sy, deco.scale || 1.1);
      ctx.shadowColor = COLORS.gold;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = "rgba(246,199,104,.45)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx + 15, sy + 13, 24, 0, Math.PI * 2);
      ctx.stroke();
    } else if (deco.type === "portalBeam") {
      ctx.globalAlpha = deco.alpha ?? 0.45;
      const g = ctx.createLinearGradient(sx, sy, sx, sy + deco.h);
      g.addColorStop(0, "rgba(116,246,255,.08)");
      g.addColorStop(.5, "rgba(116,246,255,.55)");
      g.addColorStop(1, "rgba(116,246,255,.08)");
      ctx.fillStyle = g;
      roundedRect(ctx, sx, sy, deco.w || 48, deco.h || 330, 24);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSign(x, y) {
    ctx.save();
    ctx.fillStyle = "#6b3b25";
    roundedRect(ctx, x + 18, y + 24, 10, 48, 4);
    ctx.fill();
    ctx.translate(x, y);
    ctx.rotate(-0.06);
    ctx.fillStyle = "#d4955e";
    roundedRect(ctx, 0, 0, 72, 32, 6);
    ctx.fill();
    ctx.strokeStyle = "#452314";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#4f2518";
    ctx.font = "900 18px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("!", 36, 23);
    ctx.restore();
  }

  function drawSignHints() {
    if (!player) return;
    for (const sign of level.signs) {
      if (Math.abs((player.x + player.w / 2) - (sign.x + 35)) < 90 && Math.abs(player.y - sign.y) < 130) {
        const boxW = Math.min(430, state.width - 40);
        const sx = clamp(sign.x - camera.x - boxW / 2 + 36, 20, state.width - boxW - 20);
        const sy = clamp(sign.y - camera.y - 92, 60, state.height - 140);
        ctx.save();
        ctx.fillStyle = "rgba(6,6,13,.75)";
        ctx.strokeStyle = "rgba(255,255,255,.16)";
        ctx.lineWidth = 2;
        roundedRect(ctx, sx, sy, boxW, 58, 16);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#f8f0df";
        ctx.font = "800 14px system-ui";
        ctx.textAlign = "center";
        wrapText(ctx, sign.text, sx + boxW / 2, sy + 23, boxW - 28, 18);
        ctx.restore();
      }
    }
  }

  function drawCheckpoint() {
    const cp = level.checkpoint;
    const sx = cp.x - camera.x;
    const sy = cp.y - camera.y;
    ctx.save();
    ctx.strokeStyle = cp.active ? COLORS.cyan : COLORS.gold;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(sx + 12, sy + 66);
    ctx.lineTo(sx + 12, sy - 4);
    ctx.stroke();
    ctx.fillStyle = cp.active ? COLORS.cyan : COLORS.gold;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = cp.active ? 16 : 8;
    ctx.beginPath();
    ctx.moveTo(sx + 14, sy);
    ctx.lineTo(sx + 58, sy + 12);
    ctx.lineTo(sx + 14, sy + 26);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawPortal() {
    const p = level.portal;
    const sx = p.x - camera.x;
    const sy = p.y - camera.y;
    const pulse = Math.sin(state.time * 5) * 0.08 + 1;
    ctx.save();
    ctx.translate(sx + p.w / 2, sy + p.h / 2);
    ctx.scale(pulse, 1);
    const grad = ctx.createRadialGradient(0, 0, 8, 0, 0, 70);
    grad.addColorStop(0, "rgba(255,255,255,.92)");
    grad.addColorStop(.18, "rgba(116,246,255,.75)");
    grad.addColorStop(.55, "rgba(164,107,255,.48)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(219,250,255,.86)";
    ctx.lineWidth = 4;
    ctx.shadowColor = COLORS.cyan;
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.w / 3, p.h / 2.3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawKey(x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.shadowColor = COLORS.gold;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(10, 10, 8, 0, Math.PI * 2);
    ctx.moveTo(17, 16);
    ctx.lineTo(34, 30);
    ctx.moveTo(25, 23);
    ctx.lineTo(30, 18);
    ctx.moveTo(29, 27);
    ctx.lineTo(34, 23);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawSword(x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(-0.35);
    ctx.shadowColor = COLORS.cyan;
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#e8fbff";
    ctx.strokeStyle = "#1e5c75";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(22, -4);
    ctx.lineTo(30, 28);
    ctx.lineTo(22, 44);
    ctx.lineTo(14, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(9, 35);
    ctx.lineTo(35, 35);
    ctx.stroke();
    ctx.fillStyle = "#392318";
    roundedRect(ctx, 18, 35, 8, 22, 4);
    ctx.fill();
    ctx.restore();
  }

  function drawGun(x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.shadowColor = COLORS.gold;
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#2c2b35";
    ctx.strokeStyle = "#0b0910";
    ctx.lineWidth = 2;
    roundedRect(ctx, 2, 6, 31, 14, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f6c768";
    roundedRect(ctx, 27, 9, 18, 6, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#16141f";
    roundedRect(ctx, 8, 18, 10, 19, 4);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
  }



  function drawBazooka(x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.shadowColor = COLORS.danger;
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#31323b";
    ctx.strokeStyle = "#09080f";
    ctx.lineWidth = 2;
    roundedRect(ctx, 0, 8, 48, 16, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = COLORS.danger;
    roundedRect(ctx, 35, 6, 15, 20, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = COLORS.gold;
    roundedRect(ctx, 8, 2, 22, 6, 4);
    ctx.fill();
    ctx.fillStyle = "#16141f";
    roundedRect(ctx, 15, 22, 9, 20, 4);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
  }


  function rainbowColor(offset = 0, light = 60) {
    const hue = (state.time * 105 + offset) % 360;
    return `hsl(${hue}, 95%, ${light}%)`;
  }

  function drawTinyGalaxyStars(x, y, w, h, count = 12) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    for (let i = 0; i < count; i++) {
      const px = x + ((i * 17 + Math.sin(state.time * 0.8 + i) * 7 + 22) % Math.max(1, w));
      const py = y + ((i * 23 + Math.cos(state.time * 0.7 + i) * 5 + 14) % Math.max(1, h));
      ctx.fillStyle = i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? COLORS.cyan : COLORS.gold;
      ctx.globalAlpha = 0.55 + Math.sin(state.time * 3 + i) * 0.25;
      ctx.beginPath();
      ctx.arc(px, py, i % 4 === 0 ? 2.1 : 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawPlayerBodySkin(bob, crouch) {
    const skin = state.mods?.skin || "default";
    const x = -16;
    const y = -18 + bob + crouch * 0.35;
    const w = 32;
    const h = 45 - crouch;

    if (skin === "gold") {
      const g = ctx.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, "#fff4a9");
      g.addColorStop(0.45, "#f6c768");
      g.addColorStop(1, "#9e5d18");
      ctx.fillStyle = g;
    } else if (skin === "rainbow") {
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, rainbowColor(0, 62));
      g.addColorStop(0.5, rainbowColor(125, 58));
      g.addColorStop(1, rainbowColor(250, 62));
      ctx.fillStyle = g;
      ctx.shadowColor = rainbowColor(80, 62);
      ctx.shadowBlur = 12;
    } else if (skin === "galaxy") {
      const g = ctx.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, "#101043");
      g.addColorStop(0.45, "#3b1678");
      g.addColorStop(1, "#050510");
      ctx.fillStyle = g;
      ctx.shadowColor = COLORS.violet;
      ctx.shadowBlur = 12;
    } else {
      const body = ctx.createLinearGradient(0, -30, 0, 38);
      body.addColorStop(0, "#23213d");
      body.addColorStop(0.55, "#0d0b17");
      body.addColorStop(1, "#05050b");
      ctx.fillStyle = body;
    }

    roundedRect(ctx, x, y, w, h, 13);
    ctx.fill();
    if (skin === "galaxy") drawTinyGalaxyStars(x, y, w, h, 13);
    ctx.shadowBlur = 0;
    ctx.lineWidth = 3;
    ctx.strokeStyle = skin === "gold" ? "rgba(255,244,169,.72)" : "rgba(255,255,255,.12)";
    ctx.stroke();
  }

  function drawPlayerHatSkin(bob) {
    const skin = state.mods?.skin || "default";
    if (skin === "default") return;

    ctx.save();
    const brimY = -48 + bob;
    const crownY = -68 + bob;
    if (skin === "gold") {
      const g = ctx.createLinearGradient(0, crownY, 0, brimY + 9);
      g.addColorStop(0, "#fff5b5");
      g.addColorStop(0.55, COLORS.gold);
      g.addColorStop(1, "#9e5d18");
      ctx.fillStyle = g;
      ctx.strokeStyle = "#4d2b0f";
    } else if (skin === "rainbow") {
      const g = ctx.createLinearGradient(-20, crownY, 20, brimY + 10);
      g.addColorStop(0, rainbowColor(190, 64));
      g.addColorStop(0.5, rainbowColor(320, 60));
      g.addColorStop(1, rainbowColor(50, 64));
      ctx.fillStyle = g;
      ctx.strokeStyle = "rgba(255,255,255,.42)";
      ctx.shadowColor = rainbowColor(300, 65);
      ctx.shadowBlur = 10;
    } else {
      const g = ctx.createLinearGradient(0, crownY, 0, brimY + 10);
      g.addColorStop(0, "#07134d");
      g.addColorStop(0.5, "#5519a5");
      g.addColorStop(1, "#050510");
      ctx.fillStyle = g;
      ctx.strokeStyle = "rgba(116,246,255,.38)";
      ctx.shadowColor = COLORS.violet;
      ctx.shadowBlur = 12;
    }
    roundedRect(ctx, -22, brimY, 44, 8, 4);
    ctx.fill();
    ctx.stroke();
    roundedRect(ctx, -12, crownY, 24, 22, 5);
    ctx.fill();
    ctx.stroke();
    if (skin === "galaxy") {
      drawTinyGalaxyStars(-12, crownY, 24, 22, 8);
    }
    ctx.restore();
  }

  function drawPotion(x, y, large) {
    ctx.save();
    ctx.shadowColor = large ? "#ff7aa2" : "#8dffad";
    ctx.shadowBlur = 12;
    ctx.fillStyle = large ? "#ff7aa2" : "#72ff9b";
    roundedRect(ctx, x + 7, y + 12, 18, 20, 7);
    ctx.fill();
    ctx.strokeStyle = "#17351f";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#f6e7c0";
    roundedRect(ctx, x + 11, y + 4, 10, 10, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function roundedRect(context, x, y, w, h, r) {
    const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + w, y, x + w, y + h, radius);
    context.arcTo(x + w, y + h, x, y + h, radius);
    context.arcTo(x, y + h, x, y, radius);
    context.arcTo(x, y, x + w, y, radius);
    context.closePath();
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let yy = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        context.fillText(line.trim(), x, yy);
        line = words[n] + " ";
        yy += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line.trim(), x, yy);
  }

  function gameLoop(stamp) {
    const rawDt = (stamp - lastStamp) / 1000;
    lastStamp = stamp;
    const dt = clamp(rawDt, 0, 0.033);
    state.dt = dt;
    state.time += dt;
    if (state.screen === "playing" || state.screen === "paused" || state.screen === "inventory" || state.screen === "menu" || state.screen === "info" || state.screen === "mod") {
      updateGame(dt);
    }
    render();
    requestAnimationFrame(gameLoop);
  }

  function eventPointInside(el, e) {
    if (!el || el.classList?.contains("hidden")) return false;
    const point = e.changedTouches?.[0] || e.touches?.[0] || e;
    if (point.clientX == null || point.clientY == null) return false;
    const r = el.getBoundingClientRect();
    return point.clientX >= r.left && point.clientX <= r.right && point.clientY >= r.top && point.clientY <= r.bottom;
  }

  function bindInstantTouchButton(el, action) {
    if (!el) return;
    let lastTouchRun = 0;
    const run = (e) => {
      const now = performance.now();
      if (now - lastTouchRun < 90) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      lastTouchRun = now;
      unlockMusicFromGesture();
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
      action(e);
    };
    el.addEventListener("touchstart", run, { passive: false });
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") run(e);
    }, { passive: false });
  }

  function bindMobileHudTouchShield() {
    // Coordinate-based shield for iOS: if the touch lands on an overlay control,
    // fire that control directly and stop the canvas joystick from activating.
    document.addEventListener("touchstart", (e) => {
      if (!state.mobileMode || !e.changedTouches?.length) return;
      if (state.screen === "playing") {
        if (eventPointInside(buttons.pause, e)) {
          e.preventDefault(); e.stopPropagation(); if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation(); togglePause(); return;
        }
        if (eventPointInside(buttons.inventory, e)) {
          e.preventDefault(); e.stopPropagation(); if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation(); toggleInventory(); return;
        }
        if (eventPointInside(buttons.mobileAttack, e)) {
          e.preventDefault(); e.stopPropagation(); if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation(); input.pressAttack(); return;
        }
        if (eventPointInside(buttons.mobileInteract, e)) {
          e.preventDefault(); e.stopPropagation(); if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation(); input.pressInteract(); return;
        }
        if (eventPointInside(buttons.mobileUse, e)) {
          e.preventDefault(); e.stopPropagation(); if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation(); player?.useSelectedItem(); return;
        }
        if (eventPointInside(buttons.mobileSlide, e)) {
          e.preventDefault(); e.stopPropagation(); if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
          if (!player?.dropThroughOneWayPlatform?.()) player?.triggerSlide();
          return;
        }

        const slots = [...dom.hotbar.querySelectorAll(".hotbar-slot")];
        for (let i = 0; i < slots.length; i++) {
          if (eventPointInside(slots[i], e)) {
            e.preventDefault(); e.stopPropagation(); if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
            if (player) {
              player.selectedSlot = i;
              renderHotbar();
              updateEquippedPill();
            }
            return;
          }
        }
      }
    }, { capture: true, passive: false });
  }

  function bindButtons() {
    buttons.start.addEventListener("click", () => startGame(false));
    buttons.continue.addEventListener("click", () => startGame(true));
    buttons.tutorial?.addEventListener("click", () => startLevel("tutorial", false));
    buttons.resetProgression?.addEventListener("click", () => {
      clearSave();
      toast("Progression reset. Play Game now starts at the tutorial again.");
    });
    buttons.controls.addEventListener("click", showControls);
    buttons.settings.addEventListener("click", showSettings);
    buttons.credits.addEventListener("click", showCredits);
    buttons.closeInfo.addEventListener("click", () => {
      if (state.lastScreen === "menu") setScreen("menu");
      else if (player) setScreen(state.lastScreen === "paused" ? "paused" : "playing");
      else setScreen("menu");
    });
    buttons.pause.addEventListener("click", togglePause);
    buttons.inventory.addEventListener("click", toggleInventory);
    buttons.resume.addEventListener("click", () => setScreen("playing"));
    buttons.restart.addEventListener("click", restartLevel);
    buttons.inventoryFromPause.addEventListener("click", () => setScreen("inventory"));
    buttons.openModMenu?.addEventListener("click", openModMenu);
    buttons.pauseSettings.addEventListener("click", showSettings);
    buttons.quit.addEventListener("click", () => setScreen("menu"));
    buttons.next.addEventListener("click", () => {
      if (pendingNextLevelId) startLevel(pendingNextLevelId, false);
      else restartLevel();
    });
    buttons.completeMenu.addEventListener("click", () => setScreen("menu"));
    buttons.respawn.addEventListener("click", () => player?.respawn());
    buttons.gameOverRestart.addEventListener("click", restartLevel);
    buttons.gameOverMenu.addEventListener("click", () => setScreen("menu"));
    buttons.closeInventory.addEventListener("click", () => {
      hide(dom.inventoryModal);
      setScreen(state.lastScreen === "paused" ? "paused" : "playing");
    });
    buttons.useSelected.addEventListener("click", () => player?.useSelectedItem());
    buttons.clearHotbar.addEventListener("click", () => {
      if (!player) return;
      player.hotbar[player.selectedSlot] = null;
      renderHotbar();
      toast(`Slot ${player.selectedSlot + 1} cleared.`);
    });
    buttons.mobileAttack.addEventListener("pointerdown", (e) => { e.preventDefault(); input.pressAttack(); });
    buttons.mobileUse.addEventListener("pointerdown", (e) => { e.preventDefault(); player?.useSelectedItem(); });
    buttons.mobileSlide.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (!player?.dropThroughOneWayPlatform?.()) player?.triggerSlide();
    });
    buttons.mobileInteract?.addEventListener("pointerdown", (e) => { e.preventDefault(); input.pressInteract(); });

    bindInstantTouchButton(buttons.pause, togglePause);
    bindInstantTouchButton(buttons.inventory, toggleInventory);
    bindInstantTouchButton(buttons.mobileAttack, () => input.pressAttack());
    bindInstantTouchButton(buttons.mobileUse, () => player?.useSelectedItem());
    bindInstantTouchButton(buttons.mobileSlide, () => {
      if (!player?.dropThroughOneWayPlatform?.()) player?.triggerSlide();
    });
    bindInstantTouchButton(buttons.mobileInteract, () => input.pressInteract());
    bindMobileHudTouchShield();
  }


  function openModMenu() {
    if (!player || ["menu", "complete", "gameover"].includes(state.screen)) {
      toast("Start a level first, then open the Mod Menu.");
      return;
    }
    state.modReturnScreen = state.screen === "paused" || state.screen === "inventory" ? "playing" : state.screen;
    hide(dom.inventoryModal);
    setScreen("mod");
    setTimeout(() => {
      if (!state.mods.unlocked) dom.modPasswordInput?.focus?.();
    }, 50);
  }

  function closeModMenu() {
    if (!player) {
      setScreen("menu");
      return;
    }
    hide(dom.modMenu);
    setScreen("playing");
    toast("Mod Menu closed. Game resumed.");
  }

  function toggleModMenu() {
    if (state.screen === "mod") closeModMenu();
    else openModMenu();
  }

  function submitModPassword() {
    const value = dom.modPasswordInput?.value || "";
    if (value === "Venus!") {
      state.mods.unlocked = true;
      if (dom.modPasswordInput) dom.modPasswordInput.value = "";
      renderModMenu();
      toast("Mod Menu unlocked.");
      tinyBeep(900, 0.06);
    } else {
      if (dom.modPasswordHint) dom.modPasswordHint.textContent = "Wrong password. Hint: ask the developer.";
      screenShake(6);
      discScratch(0.16);
    }
  }

  function renderModMenu() {
    if (!dom.modMenu) return;
    const unlocked = Boolean(state.mods.unlocked);
    dom.modLock?.classList.toggle("hidden", unlocked);
    dom.modOptions?.classList.toggle("hidden", !unlocked);
    if (!unlocked) return;

    const setToggle = (btn, on, label) => {
      if (!btn) return;
      btn.classList.toggle("active", on);
      btn.textContent = `${label}: ${on ? "On" : "Off"}`;
    };
    setToggle(buttons.modGod, state.mods.godMode, "God Mode");
    setToggle(buttons.modDurability, state.mods.infiniteDurability, "Infinite Durability");
    setToggle(buttons.modAmmo, state.mods.infiniteAmmo, "Infinite Ammo");

    const skin = state.mods.skin || "default";
    const skinButtons = {
      default: buttons.skinDefault,
      gold: buttons.skinGold,
      rainbow: buttons.skinRainbow,
      galaxy: buttons.skinGalaxy
    };
    Object.entries(skinButtons).forEach(([id, btn]) => btn?.classList.toggle("active", id === skin));
  }

  function setModFlag(key, value = null) {
    state.mods[key] = value === null ? !state.mods[key] : value;
    renderModMenu();
    renderHotbar();
    updateEquippedPill();
    toast(`${key.replace(/[A-Z]/g, m => " " + m).replace(/^./, c => c.toUpperCase())}: ${state.mods[key] ? "On" : "Off"}`);
  }

  function modGiveItem(id, amount = 1, label = null) {
    if (!player) return;
    player.addItem(id, amount);
    if (ITEM_DEFS[id]?.weapon) player.weaponDurability[id] = player.weaponMaxDurability(id);
    if (!player.hotbar.includes(id)) {
      const targetSlot = player.hotbar[player.selectedSlot] ? player.hotbar.findIndex(v => !v) : player.selectedSlot;
      if (targetSlot !== -1) player.hotbar[targetSlot] = id;
    }
    renderHotbar();
    renderInventory();
    updateEquippedPill();
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, 20, COLORS.gold, 0.55);
    toast(label || `${ITEM_DEFS[id]?.name || id} added.`);
  }

  function setPlayerSkin(skin) {
    state.mods.skin = skin;
    renderModMenu();
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, 28, skin === "gold" ? COLORS.gold : skin === "rainbow" ? COLORS.cyan : skin === "galaxy" ? COLORS.violet : "#d9f6ff", 0.75);
    toast(`${skin[0].toUpperCase() + skin.slice(1)} Man equipped.`);
  }

  function bindModButtons() {
    buttons.closeMod?.addEventListener("click", closeModMenu);
    buttons.modUnlock?.addEventListener("click", submitModPassword);
    dom.modPasswordInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitModPassword();
    });
    buttons.modGod?.addEventListener("click", () => setModFlag("godMode"));
    buttons.modDurability?.addEventListener("click", () => setModFlag("infiniteDurability"));
    buttons.modAmmo?.addEventListener("click", () => setModFlag("infiniteAmmo"));
    buttons.modGiveGun?.addEventListener("click", () => modGiveItem("gun", 6, "Gun added with 6 shots."));
    buttons.modGiveBazooka?.addEventListener("click", () => modGiveItem("bazooka", 2, "Bazooka added with 2 rockets."));
    buttons.modGiveSword?.addEventListener("click", () => modGiveItem("sword", 1, "Sword added."));
    buttons.modGiveHeals?.addEventListener("click", () => {
      modGiveItem("smallPotion", 3, "Healables added.");
      modGiveItem("largePotion", 2, "Healables stacked.");
    });
    buttons.skinDefault?.addEventListener("click", () => setPlayerSkin("default"));
    buttons.skinGold?.addEventListener("click", () => setPlayerSkin("gold"));
    buttons.skinRainbow?.addEventListener("click", () => setPlayerSkin("rainbow"));
    buttons.skinGalaxy?.addEventListener("click", () => setPlayerSkin("galaxy"));
  }

  function registerPWA() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(err => console.warn("SW registration failed", err));
      });
    }
  }

  function init() {
    loadSave();
    resizeCanvas();
    bindButtons();
    bindModButtons();
    updateMenuButtons();
    touch.bind();
    registerPWA();
    setScreen("menu");
    requestAnimationFrame((stamp) => {
      lastStamp = stamp;
      requestAnimationFrame(gameLoop);
    });
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("orientationchange", () => setTimeout(resizeCanvas, 250));
  window.addEventListener("contextmenu", e => e.preventDefault());
  document.addEventListener("touchmove", (e) => {
    if (state.screen === "playing") e.preventDefault();
  }, { passive: false });

  init();
})();
