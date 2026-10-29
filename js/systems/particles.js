/* ============================================================
   AFTER BURNER CLIMAX - ADVANCED VOLUMETRIC PARTICLE ENGINE
   Organic Billowing Smoke Puffs, Realistic Aircraft Debris,
   Tumbling Camouflage Wreckage, Fireball Detonations & Sparks
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

    // Core Geometries
    this.coreFireGeo = new THREE.SphereGeometry(6.5, 12, 10);
    this.fireLobeGeo = new THREE.SphereGeometry(4.2, 8, 8);
    this.sparkGeo = new THREE.SphereGeometry(1.2, 6, 6);
    this.ringGeo = new THREE.RingGeometry(2.0, 5.0, 24);

    // Procedural Organic Smoke Textures (Multi-lobed irregular billowing silhouettes)
    this.smokeTex = this.createOrganicSmokeTexture(false); // Wispy smoke puff
    this.heavySmokeTex = this.createOrganicSmokeTexture(true); // Dense detonation billow

    // Base Smoke Sprite Materials
    this.smokeMat = new THREE.SpriteMaterial({
      map: this.smokeTex,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      fog: true
    });

    this.heavySmokeMat = new THREE.SpriteMaterial({
      map: this.heavySmokeTex,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      fog: true
    });

    // Realistic Aircraft Wreckage Geometries & Textures
    this.debrisGeos = this.createRealisticDebrisGeometries();
    this.scorchedCamoTex = this.createScorchedAircraftTexture();

    // High-Fidelity PBR Materials for Wreckage (Charred metal with glowing molten sheared edges)
    this.debrisMatCamo = new THREE.MeshStandardMaterial({
      map: this.scorchedCamoTex,
      roughness: 0.38,
      metalness: 0.82,
      emissive: 0xff2200,
      emissiveIntensity: 0.65,
      fog: true,
      side: THREE.DoubleSide
    });

    this.debrisMatBurnt = new THREE.MeshStandardMaterial({
      color: 0x1c2128,
      roughness: 0.65,
      metalness: 0.75,
      emissive: 0xff4400,
      emissiveIntensity: 1.1,
      fog: true,
      side: THREE.DoubleSide
    });
  }

  /* --- PROCEDURAL ORGANIC SMOKE CANVAS TEXTURE --- */
  createOrganicSmokeTexture(isHeavy = false) {
    if (typeof document === 'undefined') return null;

    const cvs = document.createElement('canvas');
    cvs.width = 256;
    cvs.height = 256;
    const ctx = cvs.getContext('2d');

    // Draw irregular clustered organic lobes with feathered gradients
    const lobeCount = isHeavy ? 16 : 10;
    const baseColor = isHeavy ? 28 : 50;

    for (let i = 0; i < lobeCount; i++) {
      const angle = (i / lobeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
      const dist = (isHeavy ? 36 : 46) * Math.sqrt(Math.random());
      const lx = 128 + Math.cos(angle) * dist + (Math.random() - 0.5) * 22;
      const ly = 128 + Math.sin(angle) * dist + (Math.random() - 0.5) * 22;
      const radius = isHeavy ? (48 + Math.random() * 46) : (38 + Math.random() * 38);

      const grad = ctx.createRadialGradient(lx, ly, radius * 0.08, lx, ly, radius);
      const alpha = isHeavy ? (0.68 + Math.random() * 0.22) : (0.48 + Math.random() * 0.24);

      grad.addColorStop(0, `rgba(${baseColor}, ${baseColor}, ${baseColor}, ${alpha.toFixed(2)})`);
      grad.addColorStop(0.45, `rgba(${baseColor + 14}, ${baseColor + 14}, ${baseColor + 14}, ${(alpha * 0.68).toFixed(2)})`);
      grad.addColorStop(0.82, `rgba(${baseColor + 28}, ${baseColor + 28}, ${baseColor + 28}, ${(alpha * 0.22).toFixed(2)})`);
      grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lx, ly, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  /* --- PROCEDURAL SCORCHED CAMOUFLAGE AIRCRAFT TEXTURE --- */
  createScorchedAircraftTexture() {
    if (typeof document === 'undefined') return null;

    const cvs = document.createElement('canvas');
    cvs.width = 256;
    cvs.height = 256;
    const ctx = cvs.getContext('2d');

    // 1. Base Naval Air Superiority Camo (Two-tone slate gray)
    ctx.fillStyle = '#4c5564';
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = '#3a424e';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(256, 120);
    ctx.lineTo(256, 256);
    ctx.lineTo(80, 256);
    ctx.closePath();
    ctx.fill();

    // 2. High-Tech Titanium Panel Grooves & Rivet Seams
    ctx.strokeStyle = '#1d222a';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(0, 80); ctx.lineTo(256, 80);
    ctx.moveTo(0, 180); ctx.lineTo(256, 180);
    ctx.moveTo(128, 0); ctx.lineTo(128, 256);
    ctx.stroke();

    // Rivet dots along seams
    ctx.fillStyle = '#16191f';
    for (let x = 12; x < 256; x += 24) {
      ctx.fillRect(x, 79, 2, 2);
      ctx.fillRect(x, 179, 2, 2);
    }

    // 3. High-Explosive Charred Carbon Blast Burns radiating from sheared edge
    const burnGrad = ctx.createRadialGradient(60, 60, 10, 60, 60, 160);
    burnGrad.addColorStop(0, 'rgba(12, 12, 14, 0.95)');
    burnGrad.addColorStop(0.4, 'rgba(25, 20, 18, 0.75)');
    burnGrad.addColorStop(0.8, 'rgba(55, 35, 25, 0.35)');
    burnGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = burnGrad;
    ctx.fillRect(0, 0, 256, 256);

    // Hazard Warning Striping on fragment edge
    ctx.strokeStyle = '#e69500';
    ctx.lineWidth = 4.0;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(180 + i * 14, 0);
      ctx.lineTo(165 + i * 14, 40);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(cvs);
    return tex;
  }

  /* --- PROCEDURAL REALISTIC AIRCRAFT WRECKAGE GEOMETRIES --- */
  createRealisticDebrisGeometries() {
    // 1. Sheared Swept Wing Fragment with jagged torn root edge & camber
    const wingGeo = new THREE.BufferGeometry();
    const wingVerts = new Float32Array([
      // Top surface
      0, 0.45, 0,        // root trailing
      -1.6, 0.65, -4.5,  // root jagged mid
      0.6, 0.50, -9.5,   // root leading
      6.8, 0.25, -6.8,   // tip trailing
      7.2, 0.15, -11.5,  // tip leading
      // Bottom surface
      0, -0.45, 0,
      -1.6, -0.45, -4.5,
      0.6, -0.45, -9.5,
      6.8, -0.15, -6.8,
      7.2, -0.15, -11.5
    ]);
    const wingIndices = [
      0, 1, 3,  1, 4, 3,  1, 2, 4, // top
      5, 8, 6,  6, 8, 9,  6, 9, 7, // bottom
      0, 5, 1,  1, 5, 6,  1, 6, 2,  2, 6, 7, // jagged sheared root edge
      2, 7, 4,  4, 7, 9, // leading edge
      3, 8, 0,  0, 8, 5, // trailing edge
      4, 9, 3,  3, 9, 8  // tip
    ];
    wingGeo.setAttribute('position', new THREE.BufferAttribute(wingVerts, 3));
    wingGeo.setIndex(wingIndices);
    wingGeo.computeVertexNormals();

    // 2. Severed Vertical Tail Fin with rudder cut line & sheared base
    const tailGeo = new THREE.BufferGeometry();
    const tailVerts = new Float32Array([
      0, 0, 0,          // base trailing
      -0.5, 0, -3.5,    // base mid sheared
      0.3, 0, -7.5,     // base leading
      -0.2, 8.2, -4.2,  // top trailing
      0.2, 8.8, -6.8,   // top leading
      // thickness offset
      0.55, 0, 0,
      0.15, 0, -3.5,
      0.80, 0, -7.5,
      0.40, 8.2, -4.2,
      0.65, 8.8, -6.8
    ]);
    const tailIndices = [
      0, 3, 1,  1, 3, 4,  1, 4, 2,
      5, 6, 8,  6, 9, 8,  6, 7, 9,
      0, 1, 5,  1, 6, 5,  1, 2, 6,  2, 7, 6,
      2, 4, 7,  4, 9, 7,
      0, 5, 3,  3, 5, 8,
      3, 8, 4,  4, 8, 9
    ];
    tailGeo.setAttribute('position', new THREE.BufferAttribute(tailVerts, 3));
    tailGeo.setIndex(tailIndices);
    tailGeo.computeVertexNormals();

    // 3. Mangled Jet Engine Exhaust Nacelle (dented titanium exhaust petals)
    const engineGeo = new THREE.CylinderGeometry(1.8, 2.1, 5.8, 12, 2, true);
    const posAttr = engineGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      if (y < 0) {
        posAttr.setX(i, posAttr.getX(i) * (1.0 + Math.sin(i * 3.2) * 0.24));
        posAttr.setZ(i, posAttr.getZ(i) * (1.0 + Math.cos(i * 3.2) * 0.24));
      }
    }
    engineGeo.computeVertexNormals();

    // 4. Shattered Cockpit Canopy Frame & Nose Bulkhead
    const cockpitGeo = new THREE.ConeGeometry(2.6, 7.5, 7);
    cockpitGeo.rotateX(Math.PI / 2);

    // 5. Jagged Sheared Fuselage Skin Plate (torn titanium armor shard)
    const plateGeo = new THREE.BufferGeometry();
    const plateVerts = new Float32Array([
      -2.5, 0.12, -2.0,
      2.0, 0.22, -2.6,
      3.6, -0.12, 1.4,
      -0.6, 0.05, 3.2,
      -3.2, -0.18, 0.8,
      // bottom
      -2.5, -0.22, -2.0,
      2.0, -0.15, -2.6,
      3.6, -0.32, 1.4,
      -0.6, -0.25, 3.2,
      -3.2, -0.38, 0.8
    ]);
    const plateIndices = [
      0, 1, 2,  0, 2, 3,  0, 3, 4,
      5, 7, 6,  5, 8, 7,  5, 9, 8,
      0, 5, 1,  1, 5, 6,  1, 6, 2,  2, 6, 7,
      2, 7, 3,  3, 7, 8,  3, 8, 4,  4, 8, 9,
      4, 9, 0,  0, 9, 5
    ];
    plateGeo.setAttribute('position', new THREE.BufferAttribute(plateVerts, 3));
    plateGeo.setIndex(plateIndices);
    plateGeo.computeVertexNormals();

    return [wingGeo, tailGeo, engineGeo, cockpitGeo, plateGeo];
  }

  /* --- MASSIVE VOLUMETRIC ARCADE FIREBALL & WRECKAGE DETONATION --- */
  createExplosion(pos, count = 28, isBoss = false) {
    const scaleFactor = isBoss ? 2.3 : 1.0;
    const lobeCount = isBoss ? 32 : 16;
    const smokeBillowCount = isBoss ? 22 : 12;
    const wreckageCount = isBoss ? 14 : 7;
    const sparkCount = isBoss ? 65 : 38;

    // Trigger Arcade Micro Hit-Stop Frame Freeze on Impact
    if (typeof window !== 'undefined' && window.gameApp) {
      window.gameApp.triggerHitStop(isBoss ? 0.055 : 0.035);
    }

    // 0. Blinding White-Hot Detonation Flash Sphere
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    });
    const flashMesh = new THREE.Mesh(this.coreFireGeo, flashMat);
    flashMesh.position.copy(pos);
    flashMesh.scale.setScalar(scaleFactor * 2.8);
    this.scene.add(flashMesh);
    this.particles.push({
      mesh: flashMesh,
      type: 'FLASH',
      growth: 60,
      vel: new THREE.Vector3(0, 0, 0),
      life: 0.08,
      maxLife: 0.08
    });

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

    // 2. Central Expanding Incandescent Core Fireball
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
      vel: new THREE.Vector3(0, 0, 30),
      life: coreMaxLife,
      maxLife: coreMaxLife
    });

    // 3. Cluster of Billowing Volumetric Fireball Lobes
    for (let i = 0; i < lobeCount; i++) {
      const lobeMat = new THREE.MeshBasicMaterial({
        color: 0xffee22,
        transparent: true,
        opacity: 0.98
      });
      const lobeMesh = new THREE.Mesh(this.fireLobeGeo, lobeMat);

      const ox = (Math.random() - 0.5) * 8 * scaleFactor;
      const oy = (Math.random() - 0.5) * 7 * scaleFactor;
      const oz = (Math.random() - 0.5) * 8 * scaleFactor;
      lobeMesh.position.set(pos.x + ox, pos.y + oy, pos.z + oz);
      lobeMesh.scale.setScalar(scaleFactor * (0.8 + Math.random() * 0.6));
      this.scene.add(lobeMesh);

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

    // 4. Clustered Irregular Translucent Smoke Billows (形狀不規則的翻騰半透明煙霧)
    for (let i = 0; i < smokeBillowCount; i++) {
      const bSpeed = (isBoss ? 65 : 42) * (0.5 + Math.random() * 0.8);
      const angle = Math.random() * Math.PI * 2;
      const vel = new THREE.Vector3(
        Math.cos(angle) * bSpeed + (Math.random() - 0.5) * 15,
        Math.sin(angle) * bSpeed * 0.6 + 18 + Math.random() * 14, // Thermal buoyancy rise
        (Math.random() - 0.5) * bSpeed + 30
      );

      const spawnOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 12 * scaleFactor,
        (Math.random() - 0.5) * 10 * scaleFactor,
        (Math.random() - 0.5) * 12 * scaleFactor
      );

      const billowSize = (35 + Math.random() * 32) * scaleFactor;
      this.createSmokePuff(pos.clone().add(spawnOffset), 0x222222, billowSize, true, vel);
    }

    // 5. Realistic Aircraft Wreckage Debris (高逼真度戰機金屬殘骸)
    for (let i = 0; i < wreckageCount; i++) {
      const geo = this.debrisGeos[i % this.debrisGeos.length];
      const mat = (i % 2 === 0) ? this.debrisMatCamo : this.debrisMatBurnt;
      const debrisMesh = new THREE.Mesh(geo, mat);

      debrisMesh.position.copy(pos);
      debrisMesh.scale.setScalar(scaleFactor * (0.85 + Math.random() * 0.55));
      this.scene.add(debrisMesh);

      const spreadSpeed = isBoss ? 115 : 78;
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * spreadSpeed,
        Math.random() * 48 + 18, // Blown upwards by blast then arcs down under gravity
        -65 + (Math.random() - 0.5) * 85
      );

      this.particles.push({
        mesh: debrisMesh,
        type: 'WRECKAGE',
        vel: vel,
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12
        ),
        smokeTimer: 0,
        life: 2.4,
        maxLife: 2.4
      });
    }

    // 6. High-Velocity Sparks & Magnesium Embers
    for (let i = 0; i < sparkCount; i++) {
      const sparkMat = new THREE.MeshBasicMaterial({
        color: (Math.random() > 0.3) ? 0xffee33 : 0xff3300,
        transparent: true,
        opacity: 1.0
      });
      const sparkMesh = new THREE.Mesh(this.sparkGeo, sparkMat);
      sparkMesh.position.copy(pos);
      this.scene.add(sparkMesh);

      const sSpeed = isBoss ? 175 : 130;
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * sSpeed,
        (Math.random() - 0.5) * sSpeed,
        (Math.random() - 0.5) * sSpeed
      );

      this.particles.push({
        mesh: sparkMesh,
        type: 'SPARK',
        vel: vel,
        life: 0.65 + Math.random() * 0.35,
        maxLife: 1.0
      });
    }

    // 7. Camera Shockwave Impulse Shake
    const shakePower = isBoss ? 32 : 14;
    this.camera.position.x += (Math.random() - 0.5) * shakePower;
    this.camera.position.y += (Math.random() - 0.5) * shakePower;
  }

  /* --- ORGANIC IRREGULAR TRANSLUCENT SMOKE PUFF GENERATION --- */
  createSmokePuff(pos, color = 0x333333, size = 18, isDense = false, customVel = null) {
    const baseMat = isDense ? this.heavySmokeMat : this.smokeMat;
    const mat = baseMat ? baseMat.clone() : new THREE.SpriteMaterial({ transparent: true, opacity: 0.75 });

    if (color !== 0x333333) {
      mat.color.setHex(color);
    }

    const sprite = new THREE.Sprite(mat);
    sprite.position.copy(pos);

    // Irregular Anisotropic Scaling (橢圓不規則膨脹)
    const aspect = 0.82 + Math.random() * 0.36;
    sprite.scale.set(size, size * aspect, 1);
    mat.rotation = Math.random() * Math.PI * 2;
    this.scene.add(sprite);

    const vel = customVel ? customVel.clone() : new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      Math.random() * 9 + 5, // Natural upward thermal buoyancy rise
      (Math.random() - 0.5) * 10 + 38
    );

    const maxLife = isDense ? (1.3 + Math.random() * 0.5) : (0.85 + Math.random() * 0.4);
    this.particles.push({
      mesh: sprite,
      type: 'SMOKE',
      vel: vel,
      growth: isDense ? (1.8 + Math.random() * 1.2) : (1.3 + Math.random() * 0.8),
      rotVel: (Math.random() - 0.5) * 1.2,
      initialOpacity: isDense ? 0.88 : 0.68,
      life: maxLife,
      maxLife: maxLife
    });
  }

  /* --- BULLET IMPACT SPARKS --- */
  createSparks(pos, color = 0xffee33, count = 12) {
    for (let i = 0; i < count; i++) {
      const sparkMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1.0
      });
      const sparkMesh = new THREE.Mesh(this.sparkGeo, sparkMat);
      sparkMesh.position.copy(pos);
      sparkMesh.scale.setScalar(0.75);
      this.scene.add(sparkMesh);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 110,
        (Math.random() - 0.5) * 110,
        (Math.random() - 0.5) * 110
      );

      this.particles.push({
        mesh: sparkMesh,
        type: 'SPARK',
        vel: vel,
        life: 0.25 + Math.random() * 0.25,
        maxLife: 0.5
      });
    }
  }

  /* --- MAIN PARTICLE PHYSICS & ANIMATION LOOP --- */
  update(dtReal) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dtReal;
      const progress = 1.0 - (p.life / p.maxLife); // 0.0 at birth -> 1.0 at death

      if (p.type === 'FIREBALL_CORE') {
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

        p.mesh.material.opacity = progress > 0.65 ? Math.max(0, 1.0 - (progress - 0.65) / 0.35) : 1.0;

      } else if (p.type === 'FIREBALL_LOBE') {
        p.mesh.scale.multiplyScalar(1.0 + p.growth * dtReal * 0.14);
        p.vel.multiplyScalar(0.94);
        p.mesh.position.addScaledVector(p.vel, dtReal);

        p.mesh.rotation.x += p.rotVel.x * dtReal;
        p.mesh.rotation.y += p.rotVel.y * dtReal;
        p.mesh.rotation.z += p.rotVel.z * dtReal;

        if (progress < 0.30) {
          p.mesh.material.color.setHex(lerpColor(0xffee22, 0xff5500, progress / 0.30));
        } else if (progress < 0.65) {
          p.mesh.material.color.setHex(lerpColor(0xff5500, 0xff1100, (progress - 0.30) / 0.35));
        } else {
          p.mesh.material.color.setHex(lerpColor(0xff1100, 0x1c1c1c, (progress - 0.65) / 0.35));
        }

        p.mesh.material.opacity = progress > 0.70 ? Math.max(0, 1.0 - (progress - 0.70) / 0.30) : 0.98;

      } else if (p.type === 'WRECKAGE') {
        // High-Fidelity Tumbling Aircraft Wreckage
        p.vel.y -= 44 * dtReal; // Gravity acceleration
        p.vel.x *= 0.982;
        p.vel.z *= 0.982;
        p.mesh.position.addScaledVector(p.vel, dtReal);

        p.mesh.rotation.x += p.rotVel.x * dtReal;
        p.mesh.rotation.y += p.rotVel.y * dtReal;
        p.mesh.rotation.z += p.rotVel.z * dtReal;

        // Emit continuous stream of billowing black smoke & fire sparks
        p.smokeTimer += dtReal;
        if (p.smokeTimer > 0.045) {
          p.smokeTimer = 0;
          this.createSmokePuff(
            p.mesh.position,
            (progress < 0.35) ? 0xcc3300 : 0x222222,
            12 + Math.random() * 8,
            false
          );
        }

      } else if (p.type === 'FLASH') {
        p.mesh.scale.multiplyScalar(1.0 + p.growth * dtReal * 0.2);
        p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);

      } else if (p.type === 'RING') {
        p.mesh.scale.multiplyScalar(1.0 + p.growth * dtReal * 0.12);
        p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);

      } else if (p.type === 'SPARK') {
        p.vel.y -= 26 * dtReal;
        p.mesh.position.addScaledVector(p.vel, dtReal);
        p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);

      } else if (p.type === 'SMOKE') {
        // Organic Irregular Translucent Billowing Smoke
        p.mesh.scale.multiplyScalar(1.0 + p.growth * dtReal);
        if (p.mesh.material) {
          p.mesh.material.rotation += p.rotVel * dtReal;
        }

        p.vel.y += 14 * dtReal; // Thermal upward buoyancy
        p.vel.x *= 0.97;
        p.vel.z *= 0.97;
        p.mesh.position.addScaledVector(p.vel, dtReal);

        // Smooth cubic opacity fadeout
        const norm = Math.max(0, p.life / p.maxLife);
        p.mesh.material.opacity = Math.pow(norm, 1.25) * p.initialOpacity;
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
