/* ============================================================
   AFTER BURNER CLIMAX - ADVANCED VOLUMETRIC PARTICLE ENGINE
   Massive Expanding Fireballs, Flaming Wreckage, Smoke Trails,
   Shockwave Blast Rings, and High-Velocity Magnesium Sparks
   ============================================================ */

function lerpColor(c1, c2, t) {
  const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
  const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return (r << 16) | (g << 8) | b;
}

export class ParticleEngine {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.particles = [];

    // Pre-allocated geometries for silky 60/120 FPS performance
    this.coreFireGeo = new THREE.SphereGeometry(6.5, 12, 10);
    this.fireLobeGeo = new THREE.SphereGeometry(4.2, 8, 8);
    this.debrisWingGeo = new THREE.BoxGeometry(5.2, 0.4, 3.2);
    this.debrisTailGeo = new THREE.BoxGeometry(1.4, 4.2, 2.2);
    this.debrisEngineGeo = new THREE.CylinderGeometry(1.2, 1.4, 4.0, 8);
    this.sparkGeo = new THREE.SphereGeometry(1.3, 6, 6);
    this.smokeGeo = new THREE.SphereGeometry(3.5, 8, 8);
    this.ringGeo = new THREE.RingGeometry(2.0, 5.0, 24);
  }

  /* --- MASSIVE VOLUMETRIC ARCADE FIREBALL DETONATION --- */
  createExplosion(pos, count = 28, isBoss = false) {
    const scaleFactor = isBoss ? 2.2 : 1.0;
    const lobeCount = isBoss ? 32 : 16;
    const wreckageCount = isBoss ? 12 : 6;
    const sparkCount = isBoss ? 60 : 35;

    // 1. Concentric Shockwave Blast Rings
    [
      { color: 0xffee44, growth: isBoss ? 130 : 95, life: 0.42 },
      { color: 0xff3300, growth: isBoss ? 100 : 75, life: 0.48 }
    ].forEach((ringDef, rIdx) => {
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringDef.color,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(this.ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(this.camera.position);
      ring.scale.setScalar(1.0 + rIdx * 0.4);
      this.scene.add(ring);

      this.particles.push({
        mesh: ring,
        type: 'RING',
        growth: ringDef.growth,
        vel: new THREE.Vector3(0, 0, 0),
        life: ringDef.life,
        maxLife: ringDef.life
      });
    });

    // 2. Central Expanding Incandescent Core Fireball (核心高溫火球)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0
    });
    const coreMesh = new THREE.Mesh(this.coreFireGeo, coreMat);
    coreMesh.position.copy(pos);
    coreMesh.scale.setScalar(scaleFactor * 0.85);
    this.scene.add(coreMesh);

    const coreMaxLife = isBoss ? 1.6 : 1.1;
    this.particles.push({
      mesh: coreMesh,
      type: 'FIREBALL_CORE',
      growth: isBoss ? 42 : 30,
      vel: new THREE.Vector3(0, 0, 30), // Drifts gently along flight stream
      life: coreMaxLife,
      maxLife: coreMaxLife
    });

    // 3. Cluster of Billowing Volumetric Fireball Lobes (周圍翻騰的一大陀烈火球團)
    for (let i = 0; i < lobeCount; i++) {
      const lobeMat = new THREE.MeshBasicMaterial({
        color: 0xffee22,
        transparent: true,
        opacity: 0.98
      });
      const lobeMesh = new THREE.Mesh(this.fireLobeGeo, lobeMat);

      // Random spherical cluster offset
      const ox = (Math.random() - 0.5) * 8 * scaleFactor;
      const oy = (Math.random() - 0.5) * 7 * scaleFactor;
      const oz = (Math.random() - 0.5) * 8 * scaleFactor;
      lobeMesh.position.set(pos.x + ox, pos.y + oy, pos.z + oz);
      lobeMesh.scale.setScalar(scaleFactor * (0.8 + Math.random() * 0.6));
      this.scene.add(lobeMesh);

      // Burst velocity outward with drag
      const burstSpeed = (isBoss ? 85 : 55) * (0.6 + Math.random() * 0.8);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * burstSpeed + (ox * 2.5),
        (Math.random() - 0.5) * burstSpeed + (oy * 2.5),
        (Math.random() - 0.5) * burstSpeed + 35
      );

      const lobeMaxLife = 0.9 + Math.random() * 0.45;
      this.particles.push({
        mesh: lobeMesh,
        type: 'FIREBALL_LOBE',
        growth: 18 + Math.random() * 12,
        vel: vel,
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        ),
        life: lobeMaxLife,
        maxLife: lobeMaxLife
      });
    }

    // 4. Flaming Tumbling Aircraft Wreckage Chunks (燃燒翻滾墜落的敵機殘骸)
    const debrisGeos = [this.debrisWingGeo, this.debrisTailGeo, this.debrisEngineGeo];
    for (let i = 0; i < wreckageCount; i++) {
      const geo = debrisGeos[i % debrisGeos.length];
      const debrisMat = new THREE.MeshBasicMaterial({
        color: (i % 2 === 0) ? 0xff4400 : 0x222a35 // Glowing burning wing fragment
      });
      const debrisMesh = new THREE.Mesh(geo, debrisMat);
      debrisMesh.position.copy(pos);
      debrisMesh.scale.setScalar(scaleFactor * (0.85 + Math.random() * 0.5));
      this.scene.add(debrisMesh);

      const spreadSpeed = isBoss ? 110 : 75;
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * spreadSpeed,
        Math.random() * 45 + 15, // Blown upwards slightly then falls by gravity
        -60 + (Math.random() - 0.5) * 80
      );

      this.particles.push({
        mesh: debrisMesh,
        type: 'WRECKAGE',
        vel: vel,
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14
        ),
        smokeTimer: 0,
        life: 2.2,
        maxLife: 2.2
      });
    }

    // 5. High-Velocity Sparks & Magnesium Embers (四散爆裂的高溫火星)
    for (let i = 0; i < sparkCount; i++) {
      const sparkMat = new THREE.MeshBasicMaterial({
        color: (Math.random() > 0.3) ? 0xffee33 : 0xff3300,
        transparent: true,
        opacity: 1.0
      });
      const sparkMesh = new THREE.Mesh(this.sparkGeo, sparkMat);
      sparkMesh.position.copy(pos);
      this.scene.add(sparkMesh);

      const sSpeed = isBoss ? 170 : 125;
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * sSpeed,
        (Math.random() - 0.5) * sSpeed,
        (Math.random() - 0.5) * sSpeed
      );

      this.particles.push({
        mesh: sparkMesh,
        type: 'SPARK',
        vel: vel,
        life: 0.65 + Math.random() * 0.3,
        maxLife: 0.95
      });
    }

    // 6. Camera Shockwave Impulse Shake
    const shakePower = isBoss ? 32 : 14;
    this.camera.position.x += (Math.random() - 0.5) * shakePower;
    this.camera.position.y += (Math.random() - 0.5) * shakePower;
  }

  /* --- SMOKE PUFF GENERATION --- */
  createSmokePuff(pos, color = 0x666666, size = 3.2) {
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.78
    });
    const p = new THREE.Mesh(this.smokeGeo, mat);
    p.position.copy(pos);
    p.scale.setScalar(size / 3.2);
    this.scene.add(p);

    this.particles.push({
      mesh: p,
      type: 'SMOKE',
      vel: new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, 40),
      life: 0.55,
      maxLife: 0.55
    });
  }

  /* --- MAIN PARTICLE PHYSICS & ANIMATION LOOP --- */
  update(dtReal) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dtReal;
      const progress = 1.0 - (p.life / p.maxLife); // 0.0 at birth -> 1.0 at death

      if (p.type === 'FIREBALL_CORE') {
        // Core fireball: Expands rapidly into a massive incandescent orb!
        p.mesh.scale.multiplyScalar(1.0 + p.growth * dtReal * 0.16);
        p.mesh.position.addScaledVector(p.vel, dtReal);

        // Color shift: White -> Golden Yellow -> Blazing Orange -> Dark Burning Ember
        if (progress < 0.22) {
          p.mesh.material.color.setHex(lerpColor(0xffffff, 0xffee22, progress / 0.22));
        } else if (progress < 0.55) {
          p.mesh.material.color.setHex(lerpColor(0xffee22, 0xff4400, (progress - 0.22) / 0.33));
        } else if (progress < 0.82) {
          p.mesh.material.color.setHex(lerpColor(0xff4400, 0x441406, (progress - 0.55) / 0.27));
        } else {
          p.mesh.material.color.setHex(lerpColor(0x441406, 0x181818, (progress - 0.82) / 0.18));
        }

        // Maintain high opacity during fireball phase, fade out only at the very end
        p.mesh.material.opacity = progress > 0.65 ? Math.max(0, 1.0 - (progress - 0.65) / 0.35) : 1.0;

      } else if (p.type === 'FIREBALL_LOBE') {
        // Fireball lobe: Blooms outwards, rotates with turbulence, cools into rolling black smoke!
        p.mesh.scale.multiplyScalar(1.0 + p.growth * dtReal * 0.14);
        p.vel.multiplyScalar(0.94); // Air drag slowing expansion
        p.mesh.position.addScaledVector(p.vel, dtReal);

        p.mesh.rotation.x += p.rotVel.x * dtReal;
        p.mesh.rotation.y += p.rotVel.y * dtReal;
        p.mesh.rotation.z += p.rotVel.z * dtReal;

        // Color transition: Yellow -> Crimson Fire -> Billowing Charcoal Smoke
        if (progress < 0.30) {
          p.mesh.material.color.setHex(lerpColor(0xffee22, 0xff5500, progress / 0.30));
        } else if (progress < 0.65) {
          p.mesh.material.color.setHex(lerpColor(0xff5500, 0xff1100, (progress - 0.30) / 0.35));
        } else {
          p.mesh.material.color.setHex(lerpColor(0xff1100, 0x1c1c1c, (progress - 0.65) / 0.35));
        }

        p.mesh.material.opacity = progress > 0.70 ? Math.max(0, 1.0 - (progress - 0.70) / 0.30) : 0.98;

      } else if (p.type === 'WRECKAGE') {
        // Flaming Wreckage: Falls with gravity, tumbles wildly, and leaves a black smoke trail!
        p.vel.y -= 42 * dtReal; // Downward gravity
        p.vel.x *= 0.985;
        p.vel.z *= 0.985;
        p.mesh.position.addScaledVector(p.vel, dtReal);

        p.mesh.rotation.x += p.rotVel.x * dtReal;
        p.mesh.rotation.y += p.rotVel.y * dtReal;
        p.mesh.rotation.z += p.rotVel.z * dtReal;

        // Smoke trail generation behind falling burning wreckage
        p.smokeTimer += dtReal;
        if (p.smokeTimer > 0.038) {
          p.smokeTimer = 0;
          this.createSmokePuff(
            p.mesh.position,
            (progress < 0.4) ? 0xff5500 : 0x222222,
            2.5
          );
        }

        p.mesh.material.opacity = progress > 0.8 ? Math.max(0, 1.0 - (progress - 0.8) / 0.2) : 1.0;

      } else if (p.type === 'RING') {
        // Expanding Supersonic Shockwave Ring
        p.mesh.scale.multiplyScalar(1.0 + p.growth * dtReal * 0.12);
        p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);

      } else if (p.type === 'SPARK') {
        // Flying Magnesium Sparks & Embers
        p.vel.y -= 25 * dtReal;
        p.mesh.position.addScaledVector(p.vel, dtReal);
        p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);

      } else if (p.type === 'SMOKE') {
        // Billowing Smoke Puff
        p.mesh.position.addScaledVector(p.vel, dtReal);
        p.mesh.scale.multiplyScalar(1.0 + 1.2 * dtReal); // Expands slightly as it diffuses
        p.mesh.material.opacity = Math.max(0, p.life / p.maxLife) * 0.75;
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }
  }

  clear() {
    this.particles.forEach(p => this.scene.remove(p.mesh));
    this.particles = [];
  }
}
