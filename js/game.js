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
import { BossXB0 } from './models/enemy_boss.js';
import { TankerKC10 } from './models/tanker_kc10.js';
import { BiomeController } from './environment/biomes.js';
import { EnemyAIManager } from './systems/enemy_ai.js';
import { ParticleEngine } from './systems/particles.js';
import { CombatSystem } from './systems/combat.js';
import { HUDController } from './systems/hud.js';

class GameApp {
  constructor() {
    this.container = document.getElementById('canvas-container');

    // 1. Scene & Camera Setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xff6622, 0.00065);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 9000);
    this.camera.position.set(0, 15, 45);

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
    this.boss = new BossXB0(this.scene);
    this.tanker = new TankerKC10(this.scene);
    this.enemyAI = new EnemyAIManager(this.scene);
    this.combat = new CombatSystem(this.scene, this.camera, this.particles);

    // 5. Connect Input Callbacks
    this.bindInputCallbacks();

    // 6. Refueling Sequence State
    this.isRefueling = false;
    this.refuelTimer = 0;

    // 7. Timekeeping
    this.lastTime = performance.now();

    // 8. Event Listeners
    window.addEventListener('resize', () => this.onResize());

    // Apply Stage 1 Initial Environment
    this.biomes.applyStageTheme(state.getCurrentStage());
  }

  bindInputCallbacks() {
    this.input.callbacks.onStartGame = () => this.startGame();

    this.input.callbacks.onFireVulcan = () => {
      if (state.started && !this.isRefueling) {
        this.combat.firePlayerVulcan(this.player.group);
      }
    };

    this.input.callbacks.onFireMissile = () => {
      if (state.started && !this.isRefueling) {
        const lockedTargets = [];
        this.enemyAI.enemies.forEach(en => { if (en.isLocked && en.alive) lockedTargets.push(en); });
        if (this.boss && this.boss.active && this.boss.alive) {
          this.boss.turrets.forEach(t => { if (t.isLocked && t.alive) lockedTargets.push(t); });
        }
        lockedTargets.forEach(t => this.combat.firePlayerMissile(t, this.player.group));
      }
    };

    this.input.callbacks.onBarrelRoll = (dir) => {
      this.triggerBarrelRoll(dir);
    };

    this.input.callbacks.onToggleClimax = () => {
      this.triggerClimaxMode();
    };

    this.input.callbacks.onToggleView = () => {
      state.isCockpitView = !state.isCockpitView;
      const cockpitOverlay = document.getElementById('cockpit-overlay');
      if (cockpitOverlay) cockpitOverlay.style.display = state.isCockpitView ? 'block' : 'none';
      if (this.player.parts.cockpitInterior) {
        this.player.parts.cockpitInterior.visible = state.isCockpitView;
      }
    };

    // Overlay Start Click
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.startGame());
    }
  }

  startGame() {
    if (state.started) return;
    document.getElementById('overlay').style.display = 'none';
    sound.init();
    state.started = true;

    music.playTrack(state.getCurrentStage().bgmTrack);
    radio.calloutMissionStart();
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
    this.refuelTimer = 5.0;
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

  update(now) {
    const dtReal = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

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

    // 3. Dynamic Camera & FOV (Dolly Zoom effect)
    const targetFOV = state.isAfterburner ? 76 : 60;
    this.camera.fov += (targetFOV - this.camera.fov) * dt * 5.0;
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

    // Handle 360° Barrel Roll
    if (state.isRolling) {
      state.rollProgress += dtReal * (2.0 / CONFIG.SPEED.ROLL_DURATION);
      this.player.group.rotation.z = state.rollDir * state.rollProgress * Math.PI;
      this.camera.rotation.z = -state.rollDir * Math.sin(state.rollProgress * Math.PI) * 0.35;
      if (state.rollProgress >= 2) {
        state.isRolling = false;
        this.camera.rotation.z = 0;
      }
    } else {
      this.player.group.rotation.z += (targetBank - this.player.group.rotation.z) * dt * 7.0;

      // Camera Positioning: 3rd-Person Chase Cam vs 1st-Person Cockpit View
      if (state.isCockpitView) {
        // Cockpit Camera (Inside front seat)
        this.camera.position.set(
          this.player.group.position.x,
          this.player.group.position.y + 1.25,
          this.player.group.position.z - 3.8
        );
        this.camera.rotation.set(-targetPitch * 0.8, -targetBank * 0.3, -targetBank * 0.5);
      } else {
        // Chase Cam (Smooth trailing behind with horizon bank)
        this.camera.position.x += (this.player.group.position.x * 0.5 - this.camera.position.x) * dt * 6.0;
        this.camera.position.y += ((this.player.group.position.y + 13) - this.camera.position.y) * dt * 6.0;
        this.camera.position.z = 45;
        this.camera.rotation.z += (-targetBank * 0.25 - this.camera.rotation.z) * dt * 4.0;
      }
    }

    // 5. Update F-14 3D Articulations
    this.player.update(dt, state, targetPitch, now);

    // 6. Update Environment & Biomes
    this.biomes.update(dt, forwardSpeed, state.isAfterburner, state.isClimax, this.player.group.position);

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

      // 8. Boss Battle Handling (Stage 3)
      if (state.getCurrentStage().bossStage) {
        if (!this.boss.active) {
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
          this.particles.createExplosion(this.boss.group.position, 60, true);
          this.boss.active = false;
          radio.speak("MISSION ACCOMPLISHED! Enemy Superfortress destroyed! Outstanding work, Tomcat 1!", "AWACS OVERSIGHT", true);
        }
      }

      // 9. Stage Progression Check
      const stage = state.getCurrentStage();
      if (!stage.bossStage && state.stageKills >= stage.targetKills) {
        this.startRefuelingIntermission();
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
        state.nextStage();
        this.biomes.applyStageTheme(state.getCurrentStage());
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
