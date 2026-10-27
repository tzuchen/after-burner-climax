# 🔥 AFTER BURNER CLIMAX - LEGACY EDITION

[![Automated QA Tests](https://img.shields.io/badge/QA%20Tests-100%25%20Passing-brightgreen.svg)](#-automated-qa-test-suite)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: WebGL & Mobile](https://img.shields.io/badge/Platform-WebGL%20%7C%20iOS%20%7C%20Gamepad-orange.svg)](#-controls--flight-mechanics)
[![Tailscale Ready](https://img.shields.io/badge/Tailscale-Remote%20Play-blueviolet.svg)](#-tailscale-multi-device-remote-play)

A high-octane 3D arcade flight combat game built from scratch in pure **Three.js, WebGL, and Web Audio API**, paying homage to SEGA AM2's legendary arcade masterpiece ***After Burner Climax*** (Lindbergh hardware, 2006).

Zero image asset dependencies—all aircraft models, procedural military camouflage, volcanic canyons, cloud banks, FM soundfonts, and radio comms voice synthesis are generated dynamically in code in real time!

---

## ✈️ Key Features & Aesthetics

### 1. High-Fidelity F-14 Tomcat Fighter Model
* **Dynamic Variable-Sweep Wings (可變後掠翼)**:
  * Cruise mode: Wings sweep forward to $15^\circ$ for high lift.
  * Afterburner (Mach 3+) / Climax Mode / Barrel Roll: Dual mechanical pivot joints seamlessly sweep the wings back into a $47^\circ$ supersonic delta-wing configuration.
* **Dual-Cockpit with Crew**:
  * Tandem cockpit with Pilot and RIO wearing helmet visors reflecting HUD instruments.
  * **1st-Person Cockpit View Toggle (`V` key)**: Switch between 3rd-person chase cam and a realistic 1st-person cockpit view with working radar, altimeters, G-meter, and HUD targeting frame.
* **All-Moving Stabilators & Twin Canted Stabilizers**:
  * Stabilators dynamically pitch with climb/dive; twin vertical fins are canted outward at $6^\circ$ with low-vis U.S. Navy VF-84 Jolly Rogers markings.
* **Multistage Plasma Afterburners & Shock Diamonds**:
  * Dual-stage exhaust plumes with high-temp inner cyan shock diamonds and outer orange supersonic combustion plumes.
* **Wingtip Contrail Vortices (機翼渦流拉煙)**:
  * 3D geometry ribbons continuously generate behind the wingtips during hard turns and barrel rolls.

### 2. Multi-Stage Environments & Biomes
* **Stage 1: Pacific Sunset Coast**:
  * Golden hour sun disk, infinite reflective ocean wave grid, drifting cumulus cloud banks.
* **Stage 2: Grand Canyon Badlands**:
  * Towering procedural 3D red-rock canyon walls and pillars rushing past, demanding intense low-altitude canyon run weaving.
* **Stage 3: Stratosphere Intercept [Boss Battle]**:
  * Midnight stratosphere atmosphere, high-altitude night fog, and confrontation with the enemy flagship.
* **In-Flight Aerial Refueling (KC-10 Extender)**:
  * Classic *After Burner* intermission: Dock with the KC-10 tanker's flying boom to replenish missiles and repair armor before the next sector.

### 3. Stage 3 Boss: "XB-0 HRAESVELGR" Superfortress
* A massive 160-unit wide stealth aerial superfortress with:
  * 6 heavy jet engines emitting colossal plasma plumes.
  * 4 individually targetable surface defense turrets (Port/Starboard Flak Cannons and SAM Batteries).
  * Glowing central thermal reactor core (weakpoint).
  * Boss health meter on HUD with multi-phase attack patterns.

### 4. Signature Arcade Combat Mechanics
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

### 5. Procedural FM Chip-Synthesizer & AWACS Voice Comms
* **Yamaha YM2151 FM Sound Engine**:
  * Dual-sawtooth detuned lead guitar, 16th-note galloping slap bass, punchy 4-on-the-floor kick, gated snare, and brass chord stabs.
  * 3 Full Tracks:
    1. *Final Take Off* (Hiroshi Kawaguchi, Stage 1 Theme)
    2. *After Burner* (Classic Title Theme, Stage 2)
    3. *Climax Boss Battle* (High-tension Boss Anthem, Stage 3)
  * Dynamic Audio Sweep: Music smoothly transitions into a resonant lowpass filter in Climax Mode for that dramatic bullet-time audio focus!
* **AWACS "Oversight" Tactical Voice Radio**:
  * Synthesized radio voice comms with tactical announcements:
    - *"Bandits inbound! Multiple bogies on your 12 o'clock!"*
    - *"Warning! Missile on your six! Break break, barrel roll!"*
    - *"Climax gauge maxed! Engage Climax Mode and light 'em up!"*
    - *"WARNING! Superfortress XB-0 spotted! Target their weapon arrays!"*

---

## 🕹️ Controls & Flight Mechanics

| Input Action | Keyboard / Mouse | Gamepad (Xbox / PlayStation) | Mobile / iPad Touchscreen |
| :--- | :--- | :--- | :--- |
| **Pitch & Yaw (Flight)** | Mouse Move / `WASD` / Arrow Keys | Left Analog Stick | Virtual Touch Thumbstick |
| **Fire Vulcan & Missiles** | `Space` / Left Click | `A` Button / `Cross` | `FIRE` Button |
| **Afterburner (Mach 3+)** | Hold `W` or `Shift` | Right Trigger (`RT` / `R2`) | Automatic at high stick |
| **360° Barrel Roll (Dodge)** | `Q` / `E` (or double tap A/D) | Bumpers (`LB` / `RB`) | `ROLL` Button |
| **💥 CLIMAX MODE** | `C` Key / Right Click | `X` Button / `Square` | `CLIMAX` Button |
| **Toggle Cockpit View** | `V` Key | `Y` Button / `Triangle` | View Button |

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
