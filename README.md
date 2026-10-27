# 🔥 AFTER BURNER CLIMAX - LEGACY EDITION: EXPANDED FLEET & CAMPAIGN

[![Automated QA Tests](https://img.shields.io/badge/QA%20Tests-5%2F5%20Passing-brightgreen.svg)](#-automated-qa-test-suite)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: WebGL & Mobile](https://img.shields.io/badge/Platform-WebGL%20%7C%20iOS%20%7C%20Gamepad-orange.svg)](#-controls--flight-mechanics)
[![Tailscale Ready](https://img.shields.io/badge/Tailscale-Remote%20Play-blueviolet.svg)](#-tailscale-multi-device-remote-play)

A high-octane 3D arcade flight combat game built from scratch in pure **Three.js, WebGL, and Web Audio API**, paying homage to SEGA AM2's legendary arcade masterpiece ***After Burner Climax*** (Lindbergh hardware, 2006).

Zero external image/audio asset dependencies—all aircraft models (F-14D, F-15E, F/A-18E, A-10C, Su-27, XB-0, KC-10), procedural military camouflage, volcanic canyons, glacier fields, cyber skyscrapers, cloud banks, FM soundfonts, and radio comms voice synthesis are generated dynamically in code in real time!

---

## ✈️ Key Features & Aesthetics

### 1. Interactive 3D Hangar Showcase & 4 Playable Fighters
Before sortie, inspect your fleet on a rotating metallic turntable with glowing neon rim and real-time spotlights:
* **F-14D Super Tomcat**:
  * Variable-sweep wings ($15^\circ \to 47^\circ$), tandem cockpit, VF-84 Jolly Rogers markings, and wingtip contrail vortices.
  * Special Weapon: **AIM-54 Phoenix (Hexa-Lock)** — Locks onto up to 6 targets simultaneously with long-range heavy blast radius!
* **F-15E Strike Eagle**:
  * Twin tall straight vertical stabilizers, conformal fuel tanks (CFT), clipped delta wings, and Mach 4.2 sprint speed.
  * Special Weapon: **CBU-97 Cluster Disperser** — Deploys 8 cascading cluster bomblets that carpet-bomb the forward airspace!
* **F/A-18E Super Hornet**:
  * Outward-canted twin vertical tails ($20^\circ$ cant angle), curved leading-edge root extensions (LEX), extreme maneuverability.
  * Special Weapon: **AIM-9X High-Off-Boresight** — 4 ultra-agile dogfight missiles tracking targets at extreme 90-degree angles!
* **A-10C Warthog (Tankbuster)**:
  * Armored "titanium bathtub" cockpit, twin high-mounted TF34 turbofans, straight high-lift wings, and twin H-tail rudders.
  * Special Weapon: **GAU-8/A 30mm Avenger Gatling Rotary Cannon (BRRRTT!)** — 7-barrel 3900 RPM 65Hz heavy armor-piercing depleted uranium stream!

### 2. Countermeasure Flares (熱焰彈誘餌)
* **Chaff & Flares (`X` Key / Touch `FLARE` / Gamepad `B`)**:
  * Ejects 4 blazing magnesium flare decoys into the aircraft's slipstream with incandescent halos and smoke trails.
  * Diverts all incoming heat-seeking missiles within a 250m radius to lock onto the burning decoys and detonate harmlessly!
  * Rewards **`⚡ MISSILE SPOOFED! FLARE DECOY SUCCESS! +3000 PTS ⚡`**.

### 3. Branching Tactical Campaign Tree (6 Distinct Stages)
Clear target kill requirements in each sector to trigger tactical decision points with real-time briefing modals:
```
                      [ Stage 1: Pacific Sunset Coast ]
                                     /       \
                                    /         \
   [ Stage 2A: Grand Canyon Badlands ]       [ Stage 2B: Polar Glacier Straits ]
                   \       /                         \       /
                    \     /                           \     /
 [ Stage 3A: Volcanic Caldera Rift ]       [ Stage 3B: Cyber Metropolis Night ]
                   \                                 /
                    \                               /
          [ FINAL MISSION: Stratosphere Intercept (Boss: XB-0 Hraesvelgr) ]
```
* **Mission 01: Pacific Sunset Coast** (Ocean wave grid, dusk lighting, Final Take Off BGM)
* **Mission 02A: Grand Canyon Badlands** (Towering red sandstone cliffs & pillars, After Burner BGM)
* **Mission 02B: Polar Glacier Straits** (Sub-zero blizzard snow particles, icebergs, Maximum Power BGM)
* **Mission 03A: Volcanic Caldera Rift** (Glowing molten lava rivers, volcanic ash & embers, Red Out BGM)
* **Mission 03B: Cyber Metropolis Night** (Futuristic neon mega-skyscrapers, cyber fog, Great Harmony BGM)
* **Final Mission: Stratosphere Intercept** (Midnight stratosphere, Super Sonic BGM, Boss: XB-0)

### 4. Stage 4 Boss: "XB-0 HRAESVELGR" Superfortress
* A massive 160-unit wide stealth aerial superfortress with:
  * 6 heavy jet engines emitting colossal plasma plumes.
  * 4 individually targetable surface defense turrets (Port/Starboard Flak Cannons and SAM Batteries).
  * Glowing central thermal reactor core (weakpoint).
  * Boss health meter on HUD with multi-phase attack patterns.

### 5. Signature Arcade Combat Mechanics
* **CLIMAX MODE (極限子彈時間模式 - `C` Key / Right Click)**:
  * Triggers **0.32x bullet time slow motion** while maintaining fluid 60/120 FPS rendering.
  * Screen tonemapping shifts with a golden flash aura.
  * Lock-on reticle expands to cover **75% of the entire screen**, locking onto dozens of enemies simultaneously and unleashing a Macross-style multi-missile swarm barrage!
* **360° Barrel Roll with Invulnerability Frames (`Q` / `E` / Roll Button)**:
  * 360-degree snap roll within 0.42 seconds with camera banking.
  * **Full Invincibility Frames (i-frames)**: Incoming heat-seeking missiles are deflected and explode harmlessly behind the jet, triggering **`⚡ NEAR MISS! +5000 PTS ⚡`** and instantly rewarding +30% Climax Gauge!
* **Incoming Missile Warning System**:
  * Flashing red `⚠️ WARNING! MISSILE ALERT` center banner with urgent alternating siren audio.
* **Vulcan Anti-Missile Interception**:
  * Machine gun fire can directly shoot down incoming enemy missiles in mid-air (+2000 PTS).
* **1st-Person Cockpit View (`V` Key)**:
  * Real-time switchable cockpit view with interior instrumentation, radar screen, and cockpit framing struts.

### 6. Procedural 6-Track FM Chip-Synthesizer & AWACS Voice Comms
* **Yamaha YM2151 FM Sound Engine**:
  * Dual-sawtooth detuned lead guitar, 16th-note galloping slap bass, punchy 4-on-the-floor kick, gated snare, and brass chord stabs.
  * 6 Complete Tracks:
    1. *Final Take Off* (Hiroshi Kawaguchi, Stage 1 Theme)
    2. *After Burner* (Classic Title Theme, Stage 2A)
    3. *Maximum Power* (High-speed Theme, Stage 2B)
    4. *Red Out* (Heavy Metal Rock Theme, Stage 3A)
    5. *Great Harmony* (Uplifting Melody Theme, Stage 3B)
    6. *Super Sonic* (Boss Battle Theme, Final Stage)
  * Dynamic Audio Sweep: Music smoothly transitions into a resonant lowpass filter in Climax Mode!
* **AWACS "Oversight" Tactical Voice Radio**:
  * Synthesized radio voice comms with tactical announcements, route branching alerts, missile evasion warnings, and mission debriefings.

---

## 🕹️ Controls & Flight Mechanics

| Input Action | Keyboard / Mouse | Gamepad (Xbox / PlayStation) | Mobile / iPad Touchscreen |
| :--- | :--- | :--- | :--- |
| **Pitch & Yaw (Flight)** | Mouse Move / `WASD` / Arrow Keys | Left Analog Stick | Virtual Touch Thumbstick |
| **Fire Vulcan & Missiles** | `Space` / Left Click | `A` Button / `Cross` | `FIRE` Button |
| **Special Weapon (SPW)** | `F` Key | `Y` Button / `Triangle` | `SPW` Button |
| **Countermeasure Flares** | `X` Key | `B` Button / `Circle` | `FLARE` Button |
| **Afterburner (Mach 3+)** | Hold `W` or `Shift` | Right Trigger (`RT` / `R2`) | Automatic at high throttle |
| **360° Barrel Roll (Dodge)** | `Q` / `E` | Bumpers (`LB` / `RB`) | `ROLL` Button |
| **💥 CLIMAX MODE** | `C` Key / Right Click | `X` Button / `Square` | `CLIMAX` Button |
| **Toggle Cockpit View** | `V` Key | D-Pad Up | View Button |
| **Hangar / Route Select** | `A` / `D` or `1` / `2` | D-Pad Left / Right | On-screen Touch Buttons |

---

## 🌐 Tailscale Multi-Device Remote Play

The game server is fully bound to Tailscale (`0.0.0.0:8088`), allowing you to play instantly on your **iPhone, iPad, Steam Deck, or another PC** connected to your Tailnet!

1. Ensure the server is running on the host machine:
   ```bash
   python3 server.py
   ```
2. Open your browser on any device in the same Tailnet and visit:
   ```
   http://100.127.184.113:8088/
   ```
   (Or locally: `http://localhost:8088/`)

---

## 🧪 Automated QA Test Suite

All core systems (kinematics, state transitions, combo multipliers, scoring, procedural FM synthesis, 4-aircraft fleet specifications, and 6-stage campaign branching graph reachability) are covered by an automated test suite.

Run tests:
```bash
node tests/run_tests.js
```
Expected output:
```text
==================================================
🚀 STARTING AUTOMATED QA TEST SUITE...
==================================================
 Running Math & Kinematics Tests...
 ✓ All Math & Kinematics Tests Passed!
 Running Combat & GameState Tests...
 ✓ All Combat & GameState Tests Passed!
 Running Procedural Audio & Music Tests...
 ✓ All Procedural Audio & Music Tests Passed!
 Running Fighter Fleet & Munitions Tests...
 ✓ All Fighter Fleet & Munitions Tests Passed!
 Running Campaign Graph & Reachability Tests...
   Found 4 unique tactical campaign paths to the boss:
     Path #1: STAGE_1 -> STAGE_2A -> STAGE_3A -> STAGE_4_BOSS
     Path #2: STAGE_1 -> STAGE_2A -> STAGE_3B -> STAGE_4_BOSS
     Path #3: STAGE_1 -> STAGE_2B -> STAGE_3B -> STAGE_4_BOSS
     Path #4: STAGE_1 -> STAGE_2B -> STAGE_3A -> STAGE_4_BOSS
 ✓ All Campaign Graph & Reachability Tests Passed!
==================================================
🎉 ALL TESTS PASSED SUCCESSFULLY! (5/5)
==================================================
```
   ```
3. Full responsive virtual touch thumbsticks and action buttons will automatically activate on touchscreens!

---

## 🧪 Automated QA Test Suite

The project includes an automated test runner verifying vector kinematics, proportional navigation homing math, score state mutations, combo rank escalation, and procedural audio note lookup frequencies.

Run the test suite:
```bash
node tests/run_tests.js
```

Sample output:
```
==================================================
🚀 STARTING AUTOMATED QA TEST SUITE...
==================================================
 Running Math & Kinematics Tests...
 ✓ All Math & Kinematics Tests Passed!
 Running Combat & GameState Tests...
 ✓ All Combat & GameState Tests Passed!
 Running Procedural Audio & Music Tests...
 ✓ All Procedural Audio & Music Tests Passed!
==================================================
🎉 ALL TESTS PASSED SUCCESSFULLY! (3/3)
==================================================
```

---

## 🏛️ Project Architecture

```
/Users/orin/after-burner-climax/
├── index.html                   # Master entrypoint & arcade HUD structure
├── server.py                    # Multi-interface HTTP server with Tailscale binding
├── css/
│   └── style.css                # Sega Lindbergh arcade theme, scanline shaders, touch UI
├── js/
│   ├── config.js                # Game balance, stage configs, weapon tuning
│   ├── game.js                  # Master game loop & WebGL orchestrator
│   ├── core/
│   │   ├── input.js             # Keyboard, Mouse, Gamepad API & Virtual Touch
│   │   └── state.js             # Reactive score, combos, armor & stage machine
│   ├── audio/
│   │   ├── synth.js             # Yamaha YM2151 FM chip emulation engine
│   │   ├── tracks.js            # 3 procedural tracks (Final Take Off, After Burner, Boss)
│   │   └── radio.js             # AWACS Voice Radio tactical callouts
│   ├── models/
│   │   ├── textures.js          # Procedural military camouflage & avionics canvas textures
│   │   ├── player_f14.js        # Articulating F-14 Tomcat with swing wings & cockpit
│   │   ├── enemy_su27.js        # Russian Su-27 Flanker with drooping nose & sting tail
│   │   ├── enemy_boss.js        # Stage 3 Boss XB-0 Hraesvelgr Superfortress
│   │   ├── tanker_kc10.js       # KC-10 Extender refueling tanker sequence
│   │   └── weapons.js           # AIM-9 Sidewinder, R-73 Archer, Vulcan & flak rounds
│   ├── environment/
│   │   ├── biomes.js            # Ocean Sunset, Canyon Badlands, Stratosphere Night
│   │   ├── canyon.js            # Procedural 3D red-rock canyon walls & towers
│   │   ├── volumetric_clouds.js # 3D procedural cumulus cloud banks
│   │   └── speedlines.js        # Transonic warp streaks & Prandtl-Glauert vapor cone
│   └── systems/
│       ├── combat.js            # Missile kinematics, lock-on matrix, Climax bullet-time
│       ├── enemy_ai.js          # Tactical formations (V-Formation, Pincer, Corkscrews, 6 O'Clock)
│       ├── particles.js         # Expanding shockwaves, fireballs, shrapnel debris
│       └── hud.js               # Lindbergh arcade HUD, G-meter, combos, threat warnings
└── tests/
    ├── run_tests.js             # Automated QA test runner
    ├── test_math.js             # Vector kinematics & LERP tests
    ├── test_combat.js           # Combat logic, damage & combo rank tests
    └── test_audio.js            # Concert pitch frequencies & 128-step loop tests
```

---

## 📄 License

MIT License. Designed with passion for classic arcade aviation gaming.
