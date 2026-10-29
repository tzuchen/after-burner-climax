/* ============================================================
   AFTER BURNER CLIMAX - TACTICAL ENEMY AI & FORMATIONS
   Maneuver Patterns: Intercept, Corkscrew, Split, Tailgaters
   ============================================================ */

import { buildSu27Mesh } from '../models/enemy_su27.js';

let enemyIdCounter = 0;

export class EnemyAIManager {
  constructor(scene) {
    this.scene = scene;
    this.enemies = [];
    this.spawnTimer = 0;
  }

  createEnemy(x, y, z, pattern = 'INTERCEPT') {
    const mesh = buildSu27Mesh();
    mesh.position.set(x, y, z);
    this.scene.add(mesh);

    const enemy = {
      id: ++enemyIdCounter,
      mesh: mesh,
      pattern: pattern,
      speed: pattern === 'TAILGATE' ? 820 : (420 + Math.random() * 160),
      swayPhase: Math.random() * Math.PI * 2,
      baseX: x,
      baseY: y,
      hasFiredMissile: false,
      missileCooldown: 1.0 + Math.random() * 1.5,
      tracerCooldown: 0.6 + Math.random() * 1.2,
      isLocked: false,
      alive: true
    };

    this.enemies.push(enemy);
    return enemy;
  }

  spawnWave(playerGroup) {
    const waveType = Math.floor(Math.random() * 4);
    const baseX = (Math.random() - 0.5) * 280;
    const baseY = 20 + Math.random() * 80;
    const baseZ = -2200; // Arcade Spawning: Immediate visual contact on horizon (was -3400)

    if (waveType === 0) {
      // V-formation Strike Group (INTERCEPT)
      [-70, -35, 0, 35, 70].forEach((ox) => {
        this.createEnemy(baseX + ox, baseY + Math.abs(ox) * 0.35, baseZ - Math.abs(ox) * 8, 'INTERCEPT');
      });
    } else if (waveType === 1) {
      // High Speed Flank & Pincer Split
      [-90, 90].forEach((ox, i) => {
        this.createEnemy(baseX + ox, baseY + (i === 0 ? 30 : -20), baseZ, 'SPLIT');
      });
    } else if (waveType === 2) {
      // Corkscrew Aces (Spiraling acrobatic evasion)
      [-50, 50].forEach((ox) => {
        this.createEnemy(baseX + ox, baseY, baseZ, 'CORKSCREW');
      });
    } else {
      // Six O'Clock Ambush! (Zooms up from behind camera!)
      const tailX = playerGroup.position.x + (Math.random() - 0.5) * 50;
      const tailY = playerGroup.position.y + 10;
      this.createEnemy(tailX, tailY, 130, 'TAILGATE');
    }
  }

  update(dt, forwardSpeed, playerGroup, now, onFireMissile, onFireTracer) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (!enemy.alive) {
        this.scene.remove(enemy.mesh);
        this.enemies.splice(i, 1);
        continue;
      }

      // Dynamic closure rate for authentic arcade dogfight pacing
      let closureRate;
      if (enemy.mesh.position.z >= -1400 && enemy.mesh.position.z < -250) {
        // Prime Dogfight Corridor: Ease closure speed to ~380 - 450 u/s
        // Enemies stay visible in the crosshairs for 3.5 - 4.5 seconds for lock-on and vulcan gun kills
        closureRate = 380 + (enemy.speed - 420) * 0.35;
      } else if (enemy.mesh.position.z < -1400) {
        // Distant Approach Corridor: Smooth intercept entry
        closureRate = 540 + forwardSpeed * 0.25;
      } else {
        // Flyby Corridor (z >= -250): Full afterburner arcade flyby rush past the cockpit!
        closureRate = enemy.speed + forwardSpeed * 0.55;
      }

      // 1. Flight Maneuvering based on Pattern
      if (enemy.pattern === 'CORKSCREW') {
        const t = now * 0.003 + enemy.swayPhase;
        enemy.mesh.position.z += closureRate * dt;
        enemy.mesh.position.x = enemy.baseX + Math.cos(t) * 90;
        enemy.mesh.position.y = enemy.baseY + Math.sin(t) * 50;
        enemy.mesh.rotation.z += dt * 6.5; // continuous spin roll!
      } else if (enemy.pattern === 'TAILGATE') {
        // Zooms up from behind to six o'clock
        enemy.mesh.position.z -= (forwardSpeed * 0.45) * dt;
        enemy.mesh.position.x += (playerGroup.position.x - enemy.mesh.position.x) * dt * 4.0;
        enemy.mesh.position.y += ((playerGroup.position.y + 4) - enemy.mesh.position.y) * dt * 4.0;
        enemy.mesh.rotation.z = -(playerGroup.position.x - enemy.mesh.position.x) * 0.035;

        // Fire missile point-blank
        if (!enemy.hasFiredMissile && enemy.mesh.position.z < 85 && enemy.mesh.position.z > 20) {
          enemy.hasFiredMissile = true;
          if (onFireMissile) onFireMissile(enemy.mesh.position, new THREE.Vector3(0, 0, -450));
        }
      } else {
        // Standard / Split Intercept: Banks towards and tracks player
        enemy.mesh.position.z += closureRate * dt;
        const toX = playerGroup.position.x - enemy.mesh.position.x;
        enemy.mesh.position.x += toX * dt * 1.6;
        enemy.mesh.rotation.z = -toX * 0.022; // Bank realistically into turns
      }

      // 2. Enemy Attacks: Tracers & Missiles
      enemy.tracerCooldown -= dt;
      if (enemy.tracerCooldown <= 0 && enemy.mesh.position.z < playerGroup.position.z - 50 && enemy.mesh.position.z > -1400) {
        enemy.tracerCooldown = 1.0 + Math.random() * 1.5;
        if (onFireTracer) onFireTracer(enemy.mesh.position, playerGroup.position);
      }

      if (!enemy.hasFiredMissile && enemy.pattern !== 'TAILGATE' && enemy.mesh.position.z > -1600 && enemy.mesh.position.z < -400) {
        enemy.hasFiredMissile = true;
        const initVel = new THREE.Vector3((Math.random() - 0.5) * 40, -10, enemy.speed + 320);
        if (onFireMissile) onFireMissile(enemy.mesh.position, initVel);
      }

      // Escaped check
      if (enemy.mesh.position.z > 140 || (enemy.pattern === 'TAILGATE' && enemy.mesh.position.z < -2000)) {
        enemy.alive = false;
      }
    }
  }

  clear() {
    this.enemies.forEach(e => this.scene.remove(e.mesh));
    this.enemies = [];
  }
}
