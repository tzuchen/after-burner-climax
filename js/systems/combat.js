/* ============================================================
   AFTER BURNER CLIMAX - COMBAT & TARGETING SYSTEM
   Lock-on Matrix, Climax Bullet-Time, Barrel Roll Evasion
   ============================================================ */

import { state } from '../core/state.js';
import { sound } from '../audio/synth.js';
import { radio } from '../audio/radio.js';
import { CONFIG } from '../config.js';
import {
  createPlayerMissileMesh,
  createEnemyMissileMesh,
  createVulcanTracerMesh,
  createEnemyTracerMesh
} from '../models/weapons.js';

export class CombatSystem {
  constructor(scene, camera, particles) {
    this.scene = scene;
    this.camera = camera;
    this.particles = particles;

    this.playerMissiles = [];
    this.enemyMissiles = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.lockBoxes = new Map(); // targetId -> DOM element

    this.warningTimer = 0;
    this.evadeBannerTimer = 0;
    this.tempVec = new THREE.Vector3();
  }

  // --- WEAPON FIRING ---
  firePlayerMissile(target, playerGroup) {
    if (state.missiles <= 0) return;
    state.missiles--;

    const mesh = createPlayerMissileMesh();
    const side = (this.playerMissiles.length % 2 === 0) ? -5.5 : 5.5;
    mesh.position.set(playerGroup.position.x + side, playerGroup.position.y - 0.5, playerGroup.position.z + 1.5);
    this.scene.add(mesh);

    this.playerMissiles.push({
      mesh: mesh,
      target: target,
      velocity: new THREE.Vector3(side * 0.4, -3, -190),
      life: 2.8,
      smokeTimer: 0
    });

    sound.playMissileLaunch();
  }

  firePlayerVulcan(playerGroup) {
    sound.playVulcan();
    [-1.8, 1.8].forEach(ox => {
      const b = createVulcanTracerMesh();
      b.position.set(playerGroup.position.x + ox, playerGroup.position.y, playerGroup.position.z - 4);
      this.scene.add(b);
      this.playerBullets.push({ mesh: b, zSpeed: -1400, life: 1.2 });
    });
  }

  fireEnemyMissile(originPos, initialVel) {
    const mesh = createEnemyMissileMesh();
    mesh.position.copy(originPos);
    this.scene.add(mesh);

    this.enemyMissiles.push({
      mesh: mesh,
      velocity: initialVel,
      life: 5.0,
      smokeTimer: 0
    });

    sound.playMissileAlert();
  }

  fireEnemyTracer(originPos, targetPos) {
    const b = createEnemyTracerMesh();
    b.position.copy(originPos);
    const dir = new THREE.Vector3().subVectors(targetPos, originPos).normalize();
    b.lookAt(targetPos);
    this.scene.add(b);

    this.enemyBullets.push({
      mesh: b,
      vel: dir.multiplyScalar(1150),
      life: 1.8
    });
  }

  // --- LOCK-ON TARGETING & CLIMAX MATRIX ---
  updateLockOn(enemies, boss) {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    // Climax Mode triples lock reticle radius to cover almost entire screen!
    const lockRadius = state.isClimax ? screenW * 0.75 : 185;

    const targets = [...enemies];
    if (boss && boss.active && boss.alive) {
      boss.turrets.forEach(t => { if (t.alive) targets.push(t); });
      targets.push({ id: 999, mesh: boss.coreMesh, alive: true, isBossCore: true });
    }

    targets.forEach(target => {
      if (!target.alive) return;

      this.tempVec.setFromMatrixPosition(target.mesh.matrixWorld);
      this.tempVec.project(this.camera);

      const screenX = (this.tempVec.x * 0.5 + 0.5) * screenW;
      const screenY = (-(this.tempVec.y * 0.5) + 0.5) * screenH;
      const inFront = this.tempVec.z < 1.0;
      const distFromCenter = Math.hypot(screenX - screenW / 2, screenY - screenH / 2);

      if (inFront && distFromCenter < lockRadius) {
        if (!target.isLocked) {
          target.isLocked = true;
          sound.playLockBeep();

          const box = document.createElement('div');
          box.className = state.isClimax ? 'lock-box climax-lock' : 'lock-box';
          document.body.appendChild(box);
          this.lockBoxes.set(target.id, box);

          // In Climax Mode, automatically fire swarming missiles on lock!
          if (state.isClimax) {
            this.firePlayerMissile(target, this.camera.parent || { position: new THREE.Vector3() });
          }
        }

        const domBox = this.lockBoxes.get(target.id);
        if (domBox) {
          domBox.style.left = `${screenX}px`;
          domBox.style.top = `${screenY}px`;
        }
      } else {
        if (target.isLocked && !state.isClimax) {
          target.isLocked = false;
          const domBox = this.lockBoxes.get(target.id);
          if (domBox) {
            domBox.remove();
            this.lockBoxes.delete(target.id);
          }
        }
      }
    });
  }

  // --- MAIN COMBAT LOOP ---
  update(dt, dtReal, playerGroup, enemies, boss) {
    // 1. Update Player Homing Missiles
    for (let i = this.playerMissiles.length - 1; i >= 0; i--) {
      const m = this.playerMissiles[i];
      m.life -= dt;

      if (m.target && m.target.alive) {
        const targetWorldPos = new THREE.Vector3();
        m.target.mesh.getWorldPosition(targetWorldPos);
        const toTarget = new THREE.Vector3().subVectors(targetWorldPos, m.mesh.position).normalize();
        m.velocity.lerp(toTarget.multiplyScalar(700), dt * 14.0);
      } else {
        m.velocity.z -= 420 * dt;
      }

      m.mesh.position.addScaledVector(m.velocity, dt);
      m.mesh.lookAt(m.mesh.position.clone().add(m.velocity));

      // Smoke trail
      m.smokeTimer += dt;
      if (m.smokeTimer > 0.035) {
        m.smokeTimer = 0;
        this.particles.createSmokePuff(m.mesh.position, 0xcccccc);
      }

      // Hit Collision check
      let hit = false;
      if (m.target && m.target.alive) {
        const targetPos = new THREE.Vector3();
        m.target.mesh.getWorldPosition(targetPos);
        if (m.mesh.position.distanceTo(targetPos) < 24) {
          hit = true;
          m.target.alive = false;

          // Remove Target & Lock box
          const domBox = this.lockBoxes.get(m.target.id);
          if (domBox) { domBox.remove(); this.lockBoxes.delete(m.target.id); }

          if (m.target.isBossCore && boss) {
            boss.damageCore(15);
            this.particles.createExplosion(targetPos, 40, true);
          } else {
            this.scene.remove(m.target.mesh);
            this.particles.createExplosion(targetPos, 30);
          }

          state.addScore(CONFIG.SCORE.KILL_AIR);
          state.registerKill(state.isClimax);
        }
      }

      if (hit || m.life <= 0) {
        this.scene.remove(m.mesh);
        this.playerMissiles.splice(i, 1);
      }
    }

    // 2. Update Enemy Homing Missiles & Threat Warning
    let hasIncomingThreat = false;
    for (let i = this.enemyMissiles.length - 1; i >= 0; i--) {
      const em = this.enemyMissiles[i];
      em.life -= dt;

      const toPlayer = new THREE.Vector3().subVectors(playerGroup.position, em.mesh.position);
      const dist = toPlayer.length();

      if (dist < 950) hasIncomingThreat = true;

      toPlayer.normalize();
      em.velocity.lerp(toPlayer.multiplyScalar(680), dt * (state.isClimax ? 1.2 : 4.5));
      em.mesh.position.addScaledVector(em.velocity, dt);
      em.mesh.lookAt(em.mesh.position.clone().add(em.velocity));

      // Smoke trail
      em.smokeTimer += dt;
      if (em.smokeTimer > 0.035) {
        em.smokeTimer = 0;
        this.particles.createSmokePuff(em.mesh.position, 0xff2222);
      }

      // Proximity & Evasion Check
      if (dist < 22) {
        if (state.isRolling) {
          // --- SUCCESSFUL BARREL ROLL EVASION (Near-Miss) ---
          sound.playEvadeSuccess();
          state.addScore(CONFIG.SCORE.NEAR_MISS_EVADE);
          state.climaxGauge = Math.min(100, state.climaxGauge + CONFIG.PLAYER.CLIMAX_EVADE_BONUS);

          const evBanner = document.getElementById('evade-banner');
          if (evBanner) evBanner.style.display = 'block';
          this.evadeBannerTimer = 1.4;

          this.particles.createExplosion(em.mesh.position, 16);
          this.scene.remove(em.mesh);
          this.enemyMissiles.splice(i, 1);
          continue;
        } else if (state.invulnerableTimer > 0) {
          this.particles.createExplosion(em.mesh.position, 16);
          this.scene.remove(em.mesh);
          this.enemyMissiles.splice(i, 1);
          continue;
        } else {
          // --- DIRECT HIT ---
          sound.playPlayerHit();
          state.armor = Math.max(0, state.armor - 30);
          state.invulnerableTimer = CONFIG.PLAYER.INVULNERABLE_TIME;

          const df = document.getElementById('damage-flash');
          if (df) {
            df.style.opacity = '1';
            setTimeout(() => { df.style.opacity = '0'; }, 180);
          }

          this.particles.createExplosion(em.mesh.position, 36);
          this.scene.remove(em.mesh);
          this.enemyMissiles.splice(i, 1);

          if (state.armor <= 0) {
            radio.speak("Critical damage! Tomcat 1, eject, eject!", "AWACS OVERSIGHT", true);
            setTimeout(() => {
              state.armor = 100;
              state.invulnerableTimer = 2.5;
            }, 2000);
          }
          continue;
        }
      }

      if (em.life <= 0 || em.mesh.position.z > 160) {
        this.scene.remove(em.mesh);
        this.enemyMissiles.splice(i, 1);
      }
    }

    // Threat Warning Banner & Audio Siren
    const warnBanner = document.getElementById('warning-banner');
    if (hasIncomingThreat) {
      if (warnBanner) warnBanner.style.display = 'block';
      this.warningTimer += dtReal;
      if (this.warningTimer > 0.35) {
        this.warningTimer = 0;
        sound.playMissileAlert();
      }
    } else {
      if (warnBanner) warnBanner.style.display = 'none';
      this.warningTimer = 0;
    }

    // Evade Banner Timer
    if (this.evadeBannerTimer > 0) {
      this.evadeBannerTimer -= dtReal;
      if (this.evadeBannerTimer <= 0) {
        const evBanner = document.getElementById('evade-banner');
        if (evBanner) evBanner.style.display = 'none';
      }
    }

    // 3. Update Enemy Tracer Bullets
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const eb = this.enemyBullets[i];
      eb.mesh.position.addScaledVector(eb.vel, dt);
      eb.life -= dt;

      if (eb.mesh.position.distanceTo(playerGroup.position) < 14) {
        if (!state.isRolling && state.invulnerableTimer <= 0) {
          state.armor = Math.max(0, state.armor - 5);
          const df = document.getElementById('damage-flash');
          if (df) {
            df.style.opacity = '0.45';
            setTimeout(() => { df.style.opacity = '0'; }, 80);
          }
        }
        this.scene.remove(eb.mesh);
        this.enemyBullets.splice(i, 1);
        continue;
      }

      if (eb.life <= 0) {
        this.scene.remove(eb.mesh);
        this.enemyBullets.splice(i, 1);
      }
    }

    // 4. Update Player Bullets & Missile Interception
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      const b = this.playerBullets[i];
      b.mesh.position.z += b.zSpeed * dt;
      b.life -= dt;

      // Check collision with enemies
      enemies.forEach(en => {
        if (en.alive && b.mesh.position.distanceTo(en.mesh.position) < 20) {
          en.alive = false;
          this.scene.remove(en.mesh);
          const domBox = this.lockBoxes.get(en.id);
          if (domBox) { domBox.remove(); this.lockBoxes.delete(en.id); }

          this.particles.createExplosion(en.mesh.position, 22);
          state.addScore(CONFIG.SCORE.KILL_VULCAN);
          state.registerKill(state.isClimax);
          b.life = 0;
        }
      });

      // Intercept incoming enemy missiles!
      for (let emIdx = this.enemyMissiles.length - 1; emIdx >= 0; emIdx--) {
        const em = this.enemyMissiles[emIdx];
        if (b.mesh.position.distanceTo(em.mesh.position) < 18) {
          this.particles.createExplosion(em.mesh.position, 22);
          this.scene.remove(em.mesh);
          this.enemyMissiles.splice(emIdx, 1);
          state.addScore(CONFIG.SCORE.KILL_MISSILE);
          b.life = 0;
          break;
        }
      }

      if (b.life <= 0) {
        this.scene.remove(b.mesh);
        this.playerBullets.splice(i, 1);
      }
    }
  }

  clear() {
    this.playerMissiles.forEach(m => this.scene.remove(m.mesh));
    this.enemyMissiles.forEach(m => this.scene.remove(m.mesh));
    this.playerBullets.forEach(b => this.scene.remove(b.mesh));
    this.enemyBullets.forEach(b => this.scene.remove(b.mesh));
    this.playerMissiles = [];
    this.enemyMissiles = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.lockBoxes.forEach(box => box.remove());
    this.lockBoxes.clear();
  }
}
