VENUS - Build 12 Level 3 + Apprentice
=======================================

Files included:
- index.html
- style.css
- script.js
- manifest.json
- sw.js
- icons/icon-192.svg
- icons/icon-512.svg
- levels/tutorial.js
- levels/level1.js
- levels/level2.js
- levels/level3.js
- assets/PUT_VenusSoundtrack_HERE.txt

Important soundtrack setup:
Put your MP3 file in the assets folder and name it exactly:
VenusSoundtrack.mp3

Final path should be:
assets/VenusSoundtrack.mp3

The browser may not let music autoplay until the player clicks/taps/presses a key. VENUS starts the soundtrack on the first valid game gesture/start click. When VENUS dies, the music fades/stops with a generated disc-scratch effect. On respawn, the soundtrack resumes.

Level loading logic:
- The core game engine lives in script.js.
- Level data lives in separate files inside /levels.
- index.html loads level files first:
  1. levels/tutorial.js
  2. levels/level1.js
  3. levels/level2.js
  4. levels/level3.js
  5. script.js
- Each level registers itself on window.VENUS_LEVELS.
- script.js uses LEVEL_ORDER = ["tutorial", "level1", "level2", "level3"] to know progression order.
- When a level is completed, the game checks the next id in LEVEL_ORDER.
- If a next level exists, the completion screen shows Next Level.
- If no next level exists, the completion screen shows Play Again.

Current progression:
1. Tutorial: Locked Grove Tower
2. Level 1: Moonroot Crossing
3. Level 2: As Above, So Below
4. Level 3: Monster Territory

Main menu progression buttons:
- New players see only Play Game, Controls, Settings, and Credits. Play Game starts the Tutorial.
- Tutorial and Reset Progression stay hidden until the player has real progression.
- After clearing the Tutorial, Continue appears and loads Level 1. Tutorial replay and Reset Progression also appear.
- After completing a level, the completion screen shows Next Level when another level exists. If no next level exists, it shows Play Again.

How to add a future level:
1. Create a new file in /levels, for example:
   levels/level2.js
2. In that file, register:
   window.VENUS_LEVELS.level2 = { ...level data... };
3. Add this script tag in index.html before script.js:
   <script src="levels/level2.js" defer></script>
4. Add the id to LEVEL_ORDER in script.js:
   const LEVEL_ORDER = ["tutorial", "level1", "level2"];

This lets future levels be added without touching the main physics, combat, inventory, hotbar, PWA, or rendering systems.

Controls:
Desktop:
- A / D or Left / Right Arrow = move
- W / Up Arrow = jump
- S / Down Arrow = drop through green floating platforms
- Space = attack / swing sword / shoot gun
- K = interact, open chests, pick up loot
- E = inventory/backpack
- 1-6 = select hotbar slot
- Q or I = use the item/tool in hand
- Esc = pause

Mobile:
- Drag anywhere on the game view left/right to move like a virtual joystick
- Swipe/drag up = jump
- Swipe/drag down = slide, or drop through a green floating platform when standing on one
- Tap the canvas = attack
- Tap K / Interact button = interact, open chests, inspect trapdoors, pick up loot
- Tap ✚ = use the held item/tool
- Hotbar buttons still select the item in hand

Weapon durability:
- Weapon hotbar slots show a durability bar.
- Sword starts at 100 durability.
- Every sword swing removes 5 durability.
- If the sword hits an enemy or crate, it removes 13 extra durability.
- Gun starts at 100 durability.
- Every gun shot removes durability, and blast impacts remove more durability.
- Gun has 6 ammo shots. When ammo runs out, it vanishes from backpack/hotbar.
- Bazooka has 2 rockets. Each rocket does 69 damage in a huge blast. When rockets run out, it vanishes from backpack/hotbar.
- If a weapon reaches 0 durability, it breaks and vanishes from backpack/hotbar.

Tutorial flow:
1. Spawn in a walled area.
2. Find the locked door.
3. Climb the tower by jumping block to block.
4. Press K on the top chest.
5. Press K on the key that pops out.
6. Press E, click the key, and assign it to a hotbar slot.
7. Stand near the locked door and press Q/I with the key in hand.
8. Open the weapon chest outside the door.
9. Pick up the sword with K and equip it from inventory.
10. Break the crate with Space attacks.
11. Pick up the potions and gun.
12. Fight 5 slimes and reach the portal.
13. The completion screen now shows Next Level: Level 1: Moonroot Crossing.

Level 1 flow:
1. Spawn at Moonroot Crossing.
2. Open starter chest for sword and potion.
3. Break crates for supplies.
4. Fight slimes and avoid spike lanes.
5. Reach checkpoint.
6. Loot the mid chest for extra gear.
7. Clear the final slime path.
8. Reach the portal.
9. The completion screen now shows Next Level: Level 2: As Above, So Below.

Run locally:
1. Open a terminal in this folder.
2. Run:
   python -m http.server 8000
3. Open:
   http://localhost:8000

GitHub Pages:
1. Upload all files/folders to the repo root.
2. Go to Settings > Pages.
3. Deploy from the main branch/root.
4. Open the page on iPhone Safari.
5. Tap Share > Add to Home Screen.

PWA cache note:
Build 12 uses a new service worker cache name so the browser refreshes Level 3 and the new engine hooks. If your browser still shows an older build, hard refresh or delete/re-add the home screen app.

Level 2 flow:
1. Spawn under an unreachable high platform with a visible key above it.
2. Read the opening sign: "As above so below,"
3. The right path is misleading. Walk left/backward to reveal the hidden path.
4. Press K on the trap door in the floor. A real key pops out below.
5. Press K on the key to put it in the backpack, then assign it to the hotbar and use Q/I near the locked door later.
6. Move forward and break the crate by attacking it barehanded.
7. Pick up the sword with K. It auto-equips for this level and triggers a 6-slime ambush.
8. Slimes spawn off-screen to the right one at a time, 1.5 seconds apart, and chase the player.
9. Unlock the door with the key.
10. Open the stash chest after the door if you want a gun and potion.
11. Enter the bat arena, climb the platforms, kill the flying bats, and reach the portal.

Build 10 note:
- Added levels/level2.js.
- Added a trapdoor level object for hidden floor interactions.
- Added a level-script trigger system for collect events like the Level 2 sword ambush.
- Added chase behavior for spawned ambush enemies.
- Future level-only changes still belong in that level file whenever possible.


Build 11 note:
- Removed mobile auto-run and replaced it with a drag-anywhere virtual joystick feel.
- Added a dedicated mobile K / Interact button so trap doors, chests, and loot pickups work reliably.
- Chests and interact loot no longer auto-open/auto-pickup on mobile; the player must interact.
- Interaction range for loot/chests/trapdoors is more forgiving, so players no longer need to spam K or jump in front of drops.

Build 12 note:
- Added levels/level3.js.
- Added the Apprentice mini-boss enemy type with 250 HP, screen-shake stomps, and a cinematic intro.
- Added Bazooka weapon support with 2 rockets and 69 damage per rocket.
- Added random boss-fight supply crates that flash/fade into the arena.

Level 3 flow:
1. Spawn at Monster Territory and read the opening sign.
2. Climb upward, then cross the huge spike pit using the center platform while a bat guards it.
3. Open the supply chest and collect every item to trigger the ambush.
4. Survive 2 bats and 3 slimes while bats keep respawning every 8 seconds until you unlock the first door.
5. Break the arena crate on the platform to get the key, then unlock the first door.
6. Enter Monster Territory, clear 4 slimes and the bats that spawn after every 2 slime kills.
7. The Apprentice mini-boss stomps in with 250 HP. During the fight, random supply crates fade in every 25 seconds and may drop guns, swords, potions, or the new Bazooka.
8. Kill the Apprentice, pick up the key it drops, unlock the exit door, climb to the portal, and clear the level.
