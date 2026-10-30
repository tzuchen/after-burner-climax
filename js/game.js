/* ============================================================
   AFTER BURNER CLIMAX - MASTER GAME ORCHESTRATOR
   WebGL Scene, Camera Dynamics, Stage State Machine & Loop
   ============================================================ */

import { CONFIG } from './config.js';
import { state } from './core/state.js';
import { InputManager } from './core/input.js';
import { sound } from './audio/synth.js';
import { music } from './audio/tracks.js';
import { radio } from './audio/radio.js';
import { PlayerF14 } from './models/player_f14.js';
import { HangarShowcase } from './models/hangar.js';
import { BossXB0 } from './models/enemy_boss.js';
import { TankerKC10 } from './models/tanker_kc10.js';
import { BiomeController } from './environment/biomes.js';
import { EnemyAIManager } from './systems/enemy_ai.js';
import { ParticleEngine } from './systems/particles.js';
import { CombatSystem } from './systems/combat.js';
import { HUDController } from './systems/hud.js';
import { modelManager } from './models/model_loader.js';

class GameApp {
  constructor() {
    this.container = document.getElementById('canvas-container');

    // 1. Scene & Camera Setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xff6622, 0.00065);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 9000);
    this.camera.position.set(0, 8, 38);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    // 3. Dynamic Lighting
    this.ambientLight = new THREE.AmbientLight(0xffeedd, 0.7);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffaa44, 2.2);
    this.sunLight.position.set(0, 200, -1000);
    this.scene.add(this.sunLight);

    // 4. Instantiate Subsystems
    this.input = new InputManager();
    this.hud = new HUDController();
    this.particles = new ParticleEngine(this.scene, this.camera);
    this.biomes = new BiomeController(this.scene);
    this.player = new PlayerF14(this.scene);
    this.hangar = new HangarShowcase(this.scene);
    this.boss = new BossXB0(this.scene);
    this.tanker = new TankerKC10(this.scene);
    this.enemyAI = new EnemyAIManager(this.scene);
    this.combat = new CombatSystem(this.scene, this.camera, this.particles);

    // 5. Connect Input Callbacks & UI Listeners
    this.bindInputCallbacks();
    this.initUIListeners();

    // 6. Branching & Refueling State
    this.isRefueling = false;
    this.refuelTimer = 0;
    this.routeCountdown = 5.0;

    // 7. Timekeeping & Arcade Hit-Stop
    this.lastTime = performance.now();
    this.hitStopTimer = 0;
    if (typeof window !== 'undefined') window.gameApp = this;

    // 8. Event Listeners
    window.addEventListener('resize', () => this.onResize());

    // Apply Stage 1 Initial Environment & Show Hangar Turntable
    this.biomes.applyStageTheme(state.getCurrentStage(), this.sunLight, this.ambientLight);
    this.hangar.show(this.player);

    // Preload Path A authentic 3D Polygonal Models (GLTF)
    modelManager.loadAll(() => {
      console.log("✈️ Path A 3D Polygonal Fleet Models Loaded!");
      if (this.hangar) {
        this.hangar.buildFleet();
      }
    });
  }

  bindInputCallbacks() {
    this.input.callbacks.onEnterHangar = () => {
      this.enterHangar();
    };

    this.input.callbacks.onStartGame = () => {
      if (state.inTitle) {
        this.enterHangar();
      } else if (state.inHangar) {
        this.launchSortie();
      }
    };

    this.input.callbacks.onPrevAircraft = () => {
      if (state.inHangar) this.hangar.prevAircraft();
    };

    this.input.callbacks.onNextAircraft = () => {
      if (state.inHangar) this.hangar.nextAircraft();
    };

    this.input.callbacks.onSelectRoute = (idx) => {
      if (state.isSelectingRoute) this.selectRoute(idx);
    };

    this.input.callbacks.onDeployFlares = () => {
      if (state.started && !this.isRefueling && !state.inHangar && !state.inTitle) {
        this.combat.deployFlares(this.player.group);
      }
    };

    this.input.callbacks.onFireSpecialWeapon = () => {
      if (state.started && !this.isRefueling && !state.inHangar && !state.inTitle) {
        this.combat.fireSpecialWeapon(this.player.group, this.enemyAI.enemies, this.boss);
      }
    };

    this.input.callbacks.onFireVulcan = () => {
      if (state.started && !this.isRefueling && !state.inHangar && !state.inTitle) {
        this.combat.firePlayerVulcan(this.player.group);
      }
    };

    this.input.callbacks.onFireMissile = () => {
      if (state.started && !this.isRefueling && !state.inHangar && !state.inTitle) {
        const lockedTargets = [];
        this.enemyAI.enemies.forEach(en => { if (en.isLocked && en.alive) lockedTargets.push(en); });
        if (this.boss && this.boss.active && this.boss.alive) {
          if (this.boss.coreTarget && this.boss.coreTarget.isLocked && this.boss.coreTarget.alive) {
            lockedTargets.push(this.boss.coreTarget);
          }
          this.boss.turrets.forEach(t => { if (t.isLocked && t.alive) lockedTargets.push(t); });
        }
        lockedTargets.forEach(t => this.combat.firePlayerMissile(t, this.player.group));
      }
    };

    this.input.callbacks.onBarrelRoll = (dir) => {
      if (state.started && !state.inHangar && !state.inTitle) {
        this.triggerBarrelRoll(dir);
      }
    };

    this.input.callbacks.onToggleClimax = () => {
      if (state.started && !state.inHangar && !state.inTitle) {
        this.triggerClimaxMode();
      }
    };

    this.input.callbacks.onToggleView = () => {
      if (!state.started || state.inHangar || state.inTitle) return;
      state.isCockpitView = !state.isCockpitView;
      const cockpitOverlay = document.getElementById('cockpit-overlay');
      if (cockpitOverlay) cockpitOverlay.style.display = state.isCockpitView ? 'block' : 'none';
      if (this.player.parts && this.player.parts.cockpitInterior) {
        this.player.parts.cockpitInterior.visible = state.isCockpitView;
      }
    };
  }

  enterHangar() {
    const overlay = document.getElementById('overlay');
    const hangarUI = document.getElementById('hangar-ui');

    if (overlay) {
      overlay.style.display = 'none';
      overlay.classList.add('hidden');
      overlay.style.setProperty('display', 'none', 'important');
    }
    if (hangarUI) {
      hangarUI.style.display = 'flex';
      hangarUI.classList.remove('hidden');
    }

    state.inTitle = false;
    state.inHangar = true;
    sound.init();
  }

  initUIListeners() {
    const overlay = document.getElementById('overlay');
    const hangarUI = document.getElementById('hangar-ui');
    const btnSortie = document.getElementById('btn-sortie');
    const btnPrev = document.getElementById('btn-hangar-prev');
    const btnNext = document.getElementById('btn-hangar-next');
    const btnRoute0 = document.getElementById('btn-route-0');
    const btnRoute1 = document.getElementById('btn-route-1');

    const handleEnterHangar = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.enterHangar();
    };

    if (overlay) {
      overlay.addEventListener('click', handleEnterHangar);
      overlay.addEventListener('touchend', handleEnterHangar, { passive: false });
    }

    // Global window click/touch fallback for title screen
    window.addEventListener('click', () => {
      if (state.inTitle) this.enterHangar();
    });

    const handlePrev = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.hangar.prevAircraft();
    };
    if (btnPrev) {
      btnPrev.addEventListener('click', handlePrev);
      btnPrev.addEventListener('touchend', handlePrev, { passive: false });
    }

    const handleNext = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.hangar.nextAircraft();
    };
    if (btnNext) {
      btnNext.addEventListener('click', handleNext);
      btnNext.addEventListener('touchend', handleNext, { passive: false });
    }

    const handleSortie = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.launchSortie();
    };
    if (btnSortie) {
      btnSortie.addEventListener('click', handleSortie);
      btnSortie.addEventListener('touchend', handleSortie, { passive: false });
    }

    const handleRoute0 = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.selectRoute(0);
    };
    if (btnRoute0) {
      btnRoute0.addEventListener('click', handleRoute0);
      btnRoute0.addEventListener('touchend', handleRoute0, { passive: false });
    }

    const handleRoute1 = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.selectRoute(1);
    };
    if (btnRoute1) {
      btnRoute1.addEventListener('click', handleRoute1);
      btnRoute1.addEventListener('touchend', handleRoute1, { passive: false });
    }
  }

  launchSortie() {
    if (state.started && !state.inHangar && !state.inTitle) return;

    // Immediately guarantee BOTH Title overlay and Hangar UI are completely hidden!
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.classList.add('hidden');
      overlay.style.setProperty('display', 'none', 'important');
    }

    const hangarUI = document.getElementById('hangar-ui');
    if (hangarUI) {
      hangarUI.style.display = 'none';
      hangarUI.classList.add('hidden');
      hangarUI.style.setProperty('display', 'none', 'important');
    }

    // Swap active player model mesh if needed
    const selectedObj = this.hangar.fleetMeshes.get(state.selectedAircraftId);
    if (selectedObj && state.selectedAircraftId !== 'F14D') {
      this.player.group.visible = false;
      this.scene.add(selectedObj.group);
      this.player = selectedObj;
      this.player.group.visible = true;
    }

    this.hangar.hide();
    this.player.group.position.set(0, 15, 0);
    this.player.group.rotation.set(0, 0, 0);

    state.inTitle = false;
    state.inHangar = false;
    state.started = true;
    sound.init();
    sound.playSonicBoom();

    this.camera.position.set(0, 15, 45);
    this.camera.rotation.set(0, 0, 0);
    music.playTrack(state.getCurrentStage().bgmTrack);
    radio.calloutMissionStart();
  }

  openRouteBranchingModal(stage) {
    state.isSelectingRoute = true;
    this.routeCountdown = 5.0;

    const modal = document.getElementById('route-modal');
    const r0Name = document.getElementById('route-0-name');
    const r0Desc = document.getElementById('route-0-desc');
    const r1Name = document.getElementById('route-1-name');
    const r1Desc = document.getElementById('route-1-desc');

    if (stage.routes[0]) {
      const next0 = CONFIG.STAGES[stage.routes[0].nextStageIndex];
      if (r0Name) r0Name.innerText = next0.name;
      if (r0Desc) r0Desc.innerText = next0.briefing;
    }

    if (stage.routes[1]) {
      const next1 = CONFIG.STAGES[stage.routes[1].nextStageIndex];
      if (r1Name) r1Name.innerText = next1.name;
      if (r1Desc) r1Desc.innerText = next1.briefing;
    }

    if (modal) modal.style.display = 'flex';
    radio.speak("Tactical branching point ahead! Confirm flight path!", "AWACS OVERSIGHT", true);
  }

  selectRoute(idx) {
    state.isSelectingRoute = false;
    const modal = document.getElementById('route-modal');
    if (modal) modal.style.display = 'none';

    state.chooseRoute(idx);
    this.startRefuelingIntermission();
    radio.speak(`Route confirmed! Heading to ${state.getCurrentStage().name}!`, "AWACS OVERSIGHT", true);
  }

  triggerBarrelRoll(dir = 1) {
    if (state.isRolling || !state.started) return;
    state.isRolling = true;
    state.rollDir = dir;
    state.rollProgress = 0;
    sound.playBarrelRoll();
  }

  triggerClimaxMode() {
    if (state.isClimax || state.climaxGauge < 50 || !state.started) return;
    state.isClimax = true;
    state.climaxTimer = CONFIG.PLAYER.CLIMAX_DURATION;
    sound.playClimaxTrigger();
    sound.setClimaxAudio(true);

    const flash = document.getElementById('climax-flash');
    if (flash) {
      flash.style.opacity = '1';
      setTimeout(() => { flash.style.opacity = '0.35'; }, 150);
    }

    radio.speak("Climax engaged! Multi-target lock-on active!", "RIO MAVERICK", true);
  }

  startRefuelingIntermission() {
    this.isRefueling = true;
    this.refuelTimer = 2.8; // Snappy 2.8s aerial refueling (was 5.0s pause)
    this.enemyAI.clear();
    this.combat.clear();
    this.tanker.startSequence(this.player.group);
    radio.calloutStageClear();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  run() {
    const loop = (now) => {
      requestAnimationFrame(loop);
      this.update(now);
      this.renderer.render(this.scene, this.camera);
    };
    requestAnimationFrame(loop);
  }

  triggerHitStop(duration = 0.038) {
    this.hitStopTimer = duration;
  }

  update(now) {
    const dtReal = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // 0. Micro Hit-Stop Decay (No screen freeze / pauses!)
    if (this.hitStopTimer > 0) {
      this.hitStopTimer -= dtReal;
    }

    // 0. Title Screen Mode: gentle camera bobbing & turntable rotation behind overlay
    if (state.inTitle) {
      this.hangar.update(dtReal);
      this.camera.position.set(0, 7 + Math.sin(now * 0.0015) * 1.5, 38);
      this.camera.lookAt(0, 1.5, 0);
      return;
    }

    // 0.1 3D Hangar Turntable Inspection Mode
    if (state.inHangar) {
      this.hangar.update(dtReal);
      this.camera.position.set(0, 7 + Math.sin(now * 0.0015) * 1.5, 38);
      this.camera.lookAt(0, 1.5, 0);
      return;
    }

    // 0.1 In-Flight Tactical Route Branching Decision (Continues flight seamlessly without pausing!)
    if (state.isSelectingRoute) {
      this.routeCountdown -= dtReal;
      const timerEl = document.getElementById('route-timer');
      if (timerEl) {
        timerEl.innerText = `STEER [◀ 1 / 2 ▶] (AUTO IN ${Math.max(1, Math.ceil(this.routeCountdown))}s)`;
      }

      // Natural flight stick / mouse banking route selection
      const { flightX } = this.input.poll();
      if (flightX < -0.75 && this.routeCountdown < 4.2) {
        this.selectRoute(0); // Bank left -> Route A
      } else if (flightX > 0.75 && this.routeCountdown < 4.2) {
        this.selectRoute(1); // Bank right -> Route B
      } else if (this.routeCountdown <= 0) {
        this.selectRoute(0); // Timeout auto-select Route A
      }
    }

    if (!state.started) return;

    // 1. Climax Mode Time Dilation (0.32x Bullet-Time)
    if (state.isClimax) {
      state.climaxTimer -= dtReal;
      state.timeScale = CONFIG.SPEED.CLIMAX_MULTIPLIER;
      state.climaxGauge = Math.max(0, (state.climaxTimer / CONFIG.PLAYER.CLIMAX_DURATION) * 100);

      if (state.climaxTimer <= 0) {
        state.isClimax = false;
        state.timeScale = 1.0;
        sound.setClimaxAudio(false);
        const flash = document.getElementById('climax-flash');
        if (flash) flash.style.opacity = '0';
      }
    } else {
      state.timeScale = 1.0;
      state.climaxGauge = Math.min(100, state.climaxGauge + dtReal * CONFIG.PLAYER.CLIMAX_RECHARGE_RATE);
    }

    const dt = dtReal * state.timeScale;

    // 2. Flight Throttle & Speed
    state.isAfterburner = !!(this.input.keys['shift'] || this.input.keys['w'] || this.input.keys['arrowup']);
    sound.setThrottle(state.isAfterburner);

    const targetSpeed = state.isAfterburner ? CONFIG.SPEED.AFTERBURNER : CONFIG.SPEED.CRUISE;
    const forwardSpeed = targetSpeed * (state.isClimax ? CONFIG.SPEED.CLIMAX_MULTIPLIER : 1.0);
    const machSpeed = (forwardSpeed / 420);

    // 3. Dynamic Camera & FOV (Arcade Kinematic Dolly Zoom & Speed Warp)
    const targetFOV = state.isClimax ? 88 : (state.isAfterburner ? 82 : 60);
    this.camera.fov += (targetFOV - this.camera.fov) * dt * 8.0;
    this.camera.updateProjectionMatrix();

    // 4. Player Controls & Attitude
    const { flightX, flightY } = this.input.poll();
    const targetFlightX = flightX * 125;
    const targetFlightY = flightY * 70 + 15;

    this.player.group.position.x += (targetFlightX - this.player.group.position.x) * dt * CONFIG.SPEED.ACCELERATION_LERP;
    this.player.group.position.y += (targetFlightY - this.player.group.position.y) * dt * CONFIG.SPEED.ACCELERATION_LERP;

    const deltaX = targetFlightX - this.player.group.position.x;
    const deltaY = targetFlightY - this.player.group.position.y;
    const targetBank = -deltaX * CONFIG.SPEED.BANK_FACTOR;
    const targetPitch = deltaY * CONFIG.SPEED.PITCH_FACTOR;

    this.player.group.rotation.y = -targetBank * 0.35;
    this.player.group.rotation.x = -targetPitch;

    // Handle 360° Barrel Roll (Aggressive Arcade Horizon Tumble)
    if (state.isRolling) {
      state.rollProgress += dtReal * (2.0 / CONFIG.SPEED.ROLL_DURATION);
      this.player.group.rotation.z = state.rollDir * state.rollProgress * Math.PI;
      this.camera.rotation.z = -state.rollDir * Math.sin(state.rollProgress * Math.PI) * 0.65;
      if (state.rollProgress >= 2) {
        state.isRolling = false;
        this.camera.rotation.z = 0;
      }
    } else {
      this.player.group.rotation.z += (targetBank - this.player.group.rotation.z) * dt * 7.0;

      // Camera Positioning: 3rd-Person Chase Cam vs 1st-Person Cockpit View
      if (state.isCockpitView) {
        // Cockpit Camera (Inside front seat with G-force horizon tilt)
        this.camera.position.set(
          this.player.group.position.x,
          this.player.group.position.y + 1.25,
          this.player.group.position.z - 3.8
        );
        this.camera.rotation.set(-targetPitch * 0.8, -targetBank * 0.3, -this.player.group.rotation.z * 0.65);
      } else {
        // Chase Cam: G-Force lag, acceleration pull-back & violent horizon roll
        const targetCamZ = state.isAfterburner ? 50 : 42;
        this.camera.position.x += (this.player.group.position.x * 0.55 - this.camera.position.x) * dt * 7.0;
        this.camera.position.y += ((this.player.group.position.y + 14) - this.camera.position.y) * dt * 7.0;
        this.camera.position.z += (targetCamZ - this.camera.position.z) * dt * 6.0;

        // Supersonic airframe jitter
        const jitterAmp = state.isAfterburner ? 0.35 : 0.08;
        this.camera.position.x += (Math.random() - 0.5) * jitterAmp;
        this.camera.position.y += (Math.random() - 0.5) * jitterAmp;

        // Dynamic horizon bank response
        const targetHorizonBank = -this.player.group.rotation.z * 0.55;
        this.camera.rotation.z += (targetHorizonBank - this.camera.rotation.z) * dt * 6.0;
      }
    }

    // 5. Update F-14 3D Articulations
    this.player.update(dt, state, targetPitch, now);

    // 6. Update Environment & Biomes
    this.biomes.update(
      dt,
      forwardSpeed,
      state.isAfterburner,
      state.isClimax,
      this.player.group.position,
      (archPos) => {
        state.addScore(5000);
        sound.playSonicBoom();
        radio.speak("Incredible flying! Thread the needle!", "AWACS OVERSIGHT", true);
        if (this.combat) {
          this.combat.spawnScorePopup(archPos, 5000, 'THREAD THE NEEDLE!');
        }
      }
    );

    // 7. Update Enemy AI & Waves
    if (!this.isRefueling) {
      this.enemyAI.spawnTimer += dt;
      if (this.enemyAI.spawnTimer > 2.2) {
        if (!state.getCurrentStage().bossStage || !this.boss.active) {
          this.enemyAI.spawnWave(this.player.group);
        }
        this.enemyAI.spawnTimer = 0;
      }

      this.enemyAI.update(
        dt,
        forwardSpeed,
        this.player.group,
        now,
        (pos, vel) => this.combat.fireEnemyMissile(pos, vel),
        (pos, target) => this.combat.fireEnemyTracer(pos, target)
      );

      // 8. Boss Battle Handling (Stage 4 / Final Mission)
      if (state.getCurrentStage().bossStage) {
        if (!this.boss.active) {
          this.enemyAI.clear();
          this.combat.clear();
          this.boss.activate();
          radio.calloutBossWarning();
        }
        this.boss.update(
          dt,
          this.player.group.position,
          now,
          (pos, vel) => this.combat.fireEnemyMissile(pos, vel),
          (pos, target) => this.combat.fireEnemyTracer(pos, target)
        );

        if (!this.boss.alive && !state.victory) {
          state.victory = true;
          this.combat.clear();

          // Cascading Boss Destruction Sequence
          const bossPos = this.boss.group.position.clone();
          for (let i = 0; i < 7; i++) {
            setTimeout(() => {
              const ox = (Math.random() - 0.5) * 120;
              const oy = (Math.random() - 0.5) * 24;
              const oz = (Math.random() - 0.5) * 35;
              this.particles.createExplosion(bossPos.clone().add(new THREE.Vector3(ox, oy, oz)), 42 + Math.random() * 24, true);
              sound.playExplosion();
            }, i * 180);
          }

          setTimeout(() => {
            this.particles.createExplosion(bossPos, 85, true);
            this.boss.deactivate();
            this.triggerHitStop(0.12);
          }, 1450);

          radio.speak("MISSION ACCOMPLISHED! Enemy Superfortress destroyed! Outstanding work, Tomcat 1!", "AWACS OVERSIGHT", true);
        }
      }

      // 9. Stage Progression Check
      const stage = state.getCurrentStage();
      if (!stage.bossStage && state.stageKills >= stage.targetKills && !state.isSelectingRoute) {
        if (stage.routes && stage.routes.length > 1) {
          this.openRouteBranchingModal(stage);
        } else if (stage.routes && stage.routes.length === 1) {
          state.nextStage(0);
          this.startRefuelingIntermission();
        } else {
          state.stageKills = 0;
          this.startRefuelingIntermission();
        }
      }
    } else {
      // In Refueling Intermission
      const docked = this.tanker.update(dt, this.player.group);
      if (docked) {
        state.missiles = CONFIG.PLAYER.INITIAL_MISSILES;
        state.armor = Math.min(CONFIG.PLAYER.MAX_ARMOR, state.armor + 40);
      }
      this.refuelTimer -= dtReal;
      if (this.refuelTimer <= 0) {
        this.isRefueling = false;
        this.tanker.endSequence();
        this.biomes.applyStageTheme(state.getCurrentStage(), this.sunLight, this.ambientLight);
        music.playTrack(state.getCurrentStage().bgmTrack);
        radio.speak(`Entering ${state.getCurrentStage().name}! Stay sharp!`, "AWACS OVERSIGHT", true);
      }
    }

    // 10. Update Combat & Targeting Reticles
    this.combat.updateLockOn(this.enemyAI.enemies, this.boss);
    this.combat.update(dt, dtReal, this.player.group, this.enemyAI.enemies, this.boss);

    // 11. Update Particles
    this.particles.update(dtReal);

    // 12. Update Combos
    state.updateCombos(dtReal);

    // 13. Update HUD
    this.hud.update(machSpeed, state.getCurrentStage(), this.boss);
  }
}

// Instantiate & Run Game
window.addEventListener('DOMContentLoaded', () => {
  const app = new GameApp();
  app.run();
});
