/* ============================================================
   AFTER BURNER CLIMAX - STAGE 3 BOSS: XB-0 HRAESVELGR
   Gigantic Strategic Aerial Flying Fortress with Targetable Turrets
   ============================================================ */

import { createBossArmorTexture } from './textures.js';

export class BossXB0 {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.armorTex = createBossArmorTexture();
    this.armorMat = new THREE.MeshStandardMaterial({
      map: this.armorTex,
      roughness: 0.35,
      metalness: 0.75
    });

    this.darkMat = new THREE.MeshStandardMaterial({
      color: 0x111318,
      roughness: 0.3,
      metalness: 0.85
    });

    this.reactorCoreMat = new THREE.MeshBasicMaterial({
      color: 0xff0044,
      wireframe: false
    });

    this.turrets = [];
    this.engines = [];
    this.health = 100;
    this.maxHealth = 100;
    this.alive = true;
    this.active = false;
    this.attackTimer = 0;
    this.missileCooldown = 2.5;

    this.build();
    this.group.position.set(0, 80, -4500); // Start far in the distance
    this.group.visible = false;
  }

  build() {
    // 1. Giant Stealth Flying-Wing Main Hull (160 units span!)
    const wingGeo = new THREE.BoxGeometry(160, 6.5, 48);
    const mainHull = new THREE.Mesh(wingGeo, this.armorMat);
    mainHull.position.set(0, 0, 0);
    this.group.add(mainHull);

    // Forward Central Command Cockpit / Radome
    const bridgeGeo = new THREE.ConeGeometry(8, 22, 8);
    bridgeGeo.rotateX(-Math.PI / 2);
    const bridge = new THREE.Mesh(bridgeGeo, this.darkMat);
    bridge.position.set(0, 3.5, 26);
    this.group.add(bridge);

    // 2. Central Thermal Reactor Core (Weakpoint)
    const coreGeo = new THREE.SphereGeometry(6, 16, 16);
    this.coreMesh = new THREE.Mesh(coreGeo, this.reactorCoreMat);
    this.coreMesh.position.set(0, 2.5, 0);
    this.group.add(this.coreMesh);

    // 3. Six Heavy Supersonic Engine Nacelles
    [-60, -40, -20, 20, 40, 60].forEach((ox) => {
      const nacelle = new THREE.Mesh(
        new THREE.CylinderGeometry(3.2, 3.0, 36, 16).rotateX(Math.PI / 2),
        this.darkMat
      );
      nacelle.position.set(ox, -2.5, -8);
      this.group.add(nacelle);

      // Huge Boss Plasma Plumes
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(2.8, 26, 16).rotateX(Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.88 })
      );
      flame.position.set(ox, -2.5, -34);
      this.group.add(flame);
      this.engines.push(flame);
    });

    // 4. Four Targetable Surface Defense Turrets
    const turretOffsets = [
      { id: 1, x: -45, y: 3.8, z: 8, name: 'PORT FLAK ARRAY' },
      { id: 2, x: 45, y: 3.8, z: 8, name: 'STARBOARD FLAK ARRAY' },
      { id: 3, x: -25, y: 3.8, z: -10, name: 'PORT SAM BATTERY' },
      { id: 4, x: 25, y: 3.8, z: -10, name: 'STARBOARD SAM BATTERY' }
    ];

    turretOffsets.forEach(t => {
      const tGroup = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.0, 2.5, 12), this.darkMat);
      const barrel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 8).translate(0, 1.2, 3), this.armorMat);
      tGroup.add(base);
      tGroup.add(barrel);
      tGroup.position.set(t.x, t.y, t.z);
      this.group.add(tGroup);

      this.turrets.push({
        id: t.id,
        name: t.name,
        mesh: tGroup,
        health: 30,
        alive: true,
        isLocked: false
      });
    });
  }

  activate() {
    this.active = true;
    this.group.visible = true;
    this.health = 100;
  }

  update(dt, playerPos, now, onFireMissile, onFireTracer) {
    if (!this.active || !this.alive) return;

    // Boss Entrance / Orbit Kinematics
    if (this.group.position.z < -1400) {
      this.group.position.z += 550 * dt; // Advance onto battlefield
    } else {
      // Hover & menacingly circle the combat zone
      this.group.position.z = -1400 + Math.sin(now * 0.001) * 120;
      this.group.position.x = Math.sin(now * 0.0008) * 180;
      this.group.position.y = 80 + Math.cos(now * 0.0012) * 35;
      this.group.rotation.z = Math.sin(now * 0.0008) * 0.12;
      this.group.rotation.x = Math.cos(now * 0.001) * 0.06;
    }

    // Engine Flame Pulse
    this.engines.forEach(f => {
      f.scale.set(1, (1.0 + Math.sin(now * 0.04) * 0.25), 1);
    });

    // Core Glow Pulse
    this.reactorCoreMat.color.setHex((Math.floor(now * 0.01) % 2 === 0) ? 0xff0044 : 0xffea00);

    // Turret Attacks & Tracking
    this.attackTimer += dt;
    this.turrets.forEach(turret => {
      if (!turret.alive) return;

      // Aim turret towards player
      const worldPos = new THREE.Vector3();
      turret.mesh.getWorldPosition(worldPos);
      turret.mesh.lookAt(playerPos);

      // Flak burst
      if (this.attackTimer > 1.2 && onFireTracer) {
        onFireTracer(worldPos, playerPos);
      }
    });

    // Heavy Missile Volley from SAM Batteries
    if (this.attackTimer > 1.2) {
      this.attackTimer = 0;
      if (onFireMissile && this.group.position.z > -2000) {
        // Fire dual heavy missiles from Boss wings
        [-40, 40].forEach(ox => {
          const spawnPos = new THREE.Vector3(this.group.position.x + ox, this.group.position.y, this.group.position.z + 10);
          onFireMissile(spawnPos, new THREE.Vector3(0, 0, 400));
        });
      }
    }
  }

  damageCore(amount) {
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      this.alive = false;
    }
    return this.health;
  }
}
