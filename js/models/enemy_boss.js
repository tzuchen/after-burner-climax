/* ============================================================
   AFTER BURNER CLIMAX - FINAL BOSS: XB-0 HRAESVELGR
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
      roughness: 0.32,
      metalness: 0.82
    });

    this.darkMat = new THREE.MeshStandardMaterial({
      color: 0x11141c,
      roughness: 0.28,
      metalness: 0.88
    });

    this.accentMat = new THREE.MeshStandardMaterial({
      color: 0x222a38,
      roughness: 0.4,
      metalness: 0.7
    });

    this.glowWindowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff
    });

    this.reactorCoreMat = new THREE.MeshBasicMaterial({
      color: 0xff0044
    });

    this.turrets = [];
    this.engines = [];
    this.shieldRings = [];
    this.navLights = [];
    this.health = 100;
    this.maxHealth = 100;
    this.alive = true;
    this.active = false;
    this.attackTimer = 0;
    this.missileCooldown = 2.5;

    this.build();

    // Dedicated persistent target descriptor for the Reactor Core
    this.coreTarget = {
      id: 'boss_core',
      name: 'REACTOR CORE',
      mesh: this.coreMesh,
      health: 100,
      alive: true,
      isBossCore: true,
      isLocked: false
    };

    this.group.position.set(0, 80, -4500); // Start far in distance
    this.group.visible = false;
  }

  build() {
    // 1. Giant Stealth Flying-Wing Main Airframe (170 units wingspan)
    // Center Lifting Body
    const centerHullGeo = new THREE.BoxGeometry(64, 8.5, 56);
    const centerHull = new THREE.Mesh(centerHullGeo, this.armorMat);
    centerHull.position.set(0, 0, 0);
    this.group.add(centerHull);

    // Swept Outer Wing Panels (Left & Right)
    [-1, 1].forEach(side => {
      // Main Swept Wing
      const wingGeo = new THREE.BoxGeometry(56, 4.2, 42);
      wingGeo.rotateY(side * -0.22); // Swept back
      const wing = new THREE.Mesh(wingGeo, this.armorMat);
      wing.position.set(side * 58, -0.6, -8);
      this.group.add(wing);

      // Cranked Wingtip Extensions
      const tipGeo = new THREE.BoxGeometry(22, 2.8, 26);
      const tip = new THREE.Mesh(tipGeo, this.accentMat);
      tip.position.set(side * 88, -0.2, -18);
      this.group.add(tip);

      // Canted Outward Vertical Winglet Fins (XB-0 signature stabilizers)
      const finGeo = new THREE.BoxGeometry(2.2, 22, 18);
      finGeo.rotateZ(side * -0.32); // Cant outward
      const fin = new THREE.Mesh(finGeo, this.darkMat);
      fin.position.set(side * 94, 9, -20);
      this.group.add(fin);

      // Wingtip Navigation Strobe Light
      const navLightColor = side === -1 ? 0xff1122 : 0x00ff66; // Red Port, Green Starboard
      const navLightMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 8, 8),
        new THREE.MeshBasicMaterial({ color: navLightColor })
      );
      navLightMesh.position.set(side * 96, 18, -20);
      this.group.add(navLightMesh);

      const navLightSource = new THREE.PointLight(navLightColor, 1.2, 80);
      navLightSource.position.copy(navLightMesh.position);
      this.group.add(navLightSource);
      this.navLights.push({ mesh: navLightMesh, light: navLightSource, baseColor: navLightColor });
    });

    // 2. Forward Central Command Bridge & Cockpit Observation Visors
    const bridgeGeo = new THREE.ConeGeometry(9.5, 28, 8);
    bridgeGeo.rotateX(-Math.PI / 2);
    const bridge = new THREE.Mesh(bridgeGeo, this.darkMat);
    bridge.position.set(0, 4.2, 30);
    this.group.add(bridge);

    // Glowing Cyan Observation Windows
    const windowGeo = new THREE.BoxGeometry(10, 1.6, 2.5);
    const windowMesh = new THREE.Mesh(windowGeo, this.glowWindowMat);
    windowMesh.position.set(0, 5.2, 26);
    this.group.add(windowMesh);

    // 3. Central Thermal Reactor Core Silo (Primary Boss Weakpoint)
    // Silo Armored Collar
    const siloCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(8.5, 9.5, 3.5, 16),
      this.darkMat
    );
    siloCollar.position.set(0, 4.2, 0);
    this.group.add(siloCollar);

    // Pulsing Crimson Reactor Core Sphere
    const coreGeo = new THREE.SphereGeometry(5.8, 20, 20);
    this.coreMesh = new THREE.Mesh(coreGeo, this.reactorCoreMat);
    this.coreMesh.position.set(0, 4.5, 0);
    this.group.add(this.coreMesh);

    // Dynamic Crimson Reactor Point Light
    this.corePointLight = new THREE.PointLight(0xff0044, 2.2, 140);
    this.corePointLight.position.set(0, 6, 0);
    this.group.add(this.corePointLight);

    // Concentric Rotating Containment Rings
    [7.2, 8.2].forEach((radius, rIdx) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.45, 8, 24);
      ringGeo.rotateX(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, this.accentMat);
      ring.position.set(0, 4.8 + rIdx * 0.5, 0);
      this.group.add(ring);
      this.shieldRings.push({ mesh: ring, speed: (rIdx === 0 ? 1 : -1) * 1.8 });
    });

    // 4. Six Heavy Supersonic Engine Nacelles with Dual-Stage Plasma Plumes
    [-62, -42, -22, 22, 42, 62].forEach((ox, idx) => {
      const nacelle = new THREE.Mesh(
        new THREE.CylinderGeometry(3.6, 3.4, 38, 16).rotateX(Math.PI / 2),
        this.darkMat
      );
      nacelle.position.set(ox, -2.6, -10);
      this.group.add(nacelle);

      // Outer Orange Fire Plume
      const flameOuter = new THREE.Mesh(
        new THREE.ConeGeometry(3.2, 32, 16).rotateX(Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.85 })
      );
      flameOuter.position.set(ox, -2.6, -38);
      this.group.add(flameOuter);

      // Inner Blue Hypersonic Shock Diamond Core
      const flameInner = new THREE.Mesh(
        new THREE.ConeGeometry(1.8, 26, 16).rotateX(Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x00e1ff, transparent: true, opacity: 0.95 })
      );
      flameInner.position.set(ox, -2.6, -34);
      this.group.add(flameInner);

      this.engines.push({ outer: flameOuter, inner: flameInner });
    });

    // 5. Four Targetable Surface Defense Turrets
    // String IDs prevent collision with regular enemy numeric IDs!
    const turretConfigs = [
      { id: 'boss_turret_port_flak', x: -46, y: 4.2, z: 12, name: 'PORT FLAK ARRAY', type: 'FLAK' },
      { id: 'boss_turret_stbd_flak', x: 46, y: 4.2, z: 12, name: 'STARBOARD FLAK ARRAY', type: 'FLAK' },
      { id: 'boss_turret_port_sam', x: -28, y: 4.2, z: -10, name: 'PORT SAM BATTERY', type: 'SAM' },
      { id: 'boss_turret_stbd_sam', x: 28, y: 4.2, z: -10, name: 'STARBOARD SAM BATTERY', type: 'SAM' }
    ];

    turretConfigs.forEach(cfg => {
      const tGroup = new THREE.Group();
      // Turret base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.4, 2.6, 14), this.darkMat);
      tGroup.add(base);

      if (cfg.type === 'FLAK') {
        // Dual Heavy Flak Barrels
        [-0.9, 0.9].forEach(bx => {
          const barrel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.55, 0.55, 9.5, 8).rotateX(Math.PI / 2),
            this.armorMat
          );
          barrel.position.set(bx, 1.4, 4.5);
          tGroup.add(barrel);
        });
      } else {
        // SAM Missile Pod Box
        const pod = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.4, 5.5).translate(0, 1.4, 1.5), this.accentMat);
        tGroup.add(pod);
      }

      tGroup.position.set(cfg.x, cfg.y, cfg.z);
      this.group.add(tGroup);

      this.turrets.push({
        id: cfg.id,
        name: cfg.name,
        type: cfg.type,
        mesh: tGroup,
        health: 35,
        alive: true,
        isLocked: false
      });
    });
  }

  // Returns all currently valid targetable components of the boss
  getTargets() {
    if (!this.active || !this.alive) return [];
    const targets = [];
    if (this.coreTarget && this.coreTarget.alive) {
      targets.push(this.coreTarget);
    }
    this.turrets.forEach(t => {
      if (t.alive) targets.push(t);
    });
    return targets;
  }

  activate() {
    this.active = true;
    this.alive = true;
    this.health = 100;
    this.maxHealth = 100;
    this.group.visible = true;
    this.group.position.set(0, 80, -4200);

    if (this.coreTarget) {
      this.coreTarget.alive = true;
      this.coreTarget.isLocked = false;
      this.coreTarget.health = 100;
    }

    this.turrets.forEach(t => {
      t.alive = true;
      t.health = 35;
      t.isLocked = false;
      t.mesh.visible = true;
    });
  }

  deactivate() {
    this.active = false;
    this.group.visible = false;
    this.group.position.set(0, 80, -4500);
  }

  update(dt, playerPos, now, onFireMissile, onFireTracer) {
    if (!this.active || !this.alive) return;

    // Boss Entrance / Orbit Kinematics
    if (this.group.position.z < -1400) {
      this.group.position.z += 600 * dt; // Advance onto battlefield
    } else {
      // Menacing orbital flight pattern in front of player
      this.group.position.z = -1400 + Math.sin(now * 0.0009) * 140;
      this.group.position.x = Math.sin(now * 0.00075) * 200;
      this.group.position.y = 80 + Math.cos(now * 0.0011) * 40;
      this.group.rotation.z = Math.sin(now * 0.00075) * 0.14;
      this.group.rotation.x = Math.cos(now * 0.0009) * 0.07;
    }

    // Engine Flame Pulse & Hypersonic Afterburners
    this.engines.forEach(e => {
      const pulse = 1.0 + Math.sin(now * 0.04) * 0.22;
      e.outer.scale.set(1, pulse, 1);
      e.inner.scale.set(1, pulse * 1.15, 1);
    });

    // Core Containment Shield Rings Rotation
    this.shieldRings.forEach(r => {
      r.mesh.rotation.z += r.speed * dt;
    });

    // Core Glow & Dynamic Light Pulse
    const isCoreBright = Math.floor(now * 0.012) % 2 === 0;
    const coreHex = isCoreBright ? 0xff0044 : 0xffea00;
    this.reactorCoreMat.color.setHex(coreHex);
    if (this.corePointLight) {
      this.corePointLight.color.setHex(coreHex);
      this.corePointLight.intensity = 2.0 + Math.sin(now * 0.01) * 0.8;
    }

    // Wingtip Strobe Flash
    const strobeState = (Math.floor(now * 0.003) % 2 === 0);
    this.navLights.forEach(nl => {
      nl.light.intensity = strobeState ? 2.2 : 0.2;
      nl.mesh.visible = strobeState;
    });

    // Turret Attacks & Tracking
    this.attackTimer += dt;
    this.turrets.forEach(turret => {
      if (!turret.alive) return;

      // Aim turret towards player
      const worldPos = new THREE.Vector3();
      turret.mesh.getWorldPosition(worldPos);
      turret.mesh.lookAt(playerPos);

      // Flak burst
      if (this.attackTimer > 1.2 && turret.type === 'FLAK' && onFireTracer) {
        onFireTracer(worldPos, playerPos);
      }
    });

    // Heavy Missile Volley from SAM Batteries
    if (this.attackTimer > 1.35) {
      this.attackTimer = 0;
      if (onFireMissile && this.group.position.z > -2200) {
        // Fire dual heavy missiles from Boss SAM positions
        [-28, 28].forEach(ox => {
          const spawnPos = new THREE.Vector3(
            this.group.position.x + ox,
            this.group.position.y + 4,
            this.group.position.z + 5
          );
          onFireMissile(spawnPos, new THREE.Vector3((ox > 0 ? 1 : -1) * 15, -5, 420));
        });
      }
    }
  }

  damageCore(amount) {
    this.health = Math.max(0, this.health - amount);
    if (this.coreTarget) {
      this.coreTarget.health = this.health;
      if (this.health <= 0) {
        this.alive = false;
        this.coreTarget.alive = false;
      }
    }
    if (this.health <= 0) {
      this.alive = false;
    }
    return this.health;
  }

  damageTurret(turretId, amount) {
    const t = this.turrets.find(x => x.id === turretId);
    if (!t || !t.alive) return 0;
    t.health = Math.max(0, t.health - amount);
    if (t.health <= 0) {
      t.alive = false;
      t.mesh.visible = false;
    }
    return t.health;
  }
}
