/* ============================================================
   AFTER BURNER CLIMAX - STAGE 2 GRAND CANYON BADLANDS
   Stepped Sandstone Buttes, Natural Rock Arches & Desert Spindles
   Features: 1024x1024 Strata PBR, Fly-Through Arches & Thread-the-Needle
   ============================================================ */

export class CanyonEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // 1. High-Resolution 1024x1024 Sandstone Strata Texture
    this.rockTex = this.createSandstoneStrataTexture();

    this.rockMat = new THREE.MeshStandardMaterial({
      map: this.rockTex,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true,
      fog: true
    });

    this.caprockMat = new THREE.MeshStandardMaterial({
      color: 0x5a1e12,
      roughness: 0.92,
      metalness: 0.08,
      flatShading: true,
      fog: true
    });

    this.formations = [];
    this.arches = [];
    this.active = false;

    this.buildMesasAndHoodoos();
    this.buildNaturalArches();

    this.group.visible = false;
  }

  createSandstoneStrataTexture() {
    if (typeof document === 'undefined') return null;
    const cvs = document.createElement('canvas');
    cvs.width = 512; cvs.height = 1024;
    const ctx = cvs.getContext('2d');

    // Rich desert red-rock strata palette (Navajo & Wingate Sandstone)
    const strataColors = [
      '#99361e', '#6e2211', '#ba4e28', '#54170b',
      '#c96639', '#e0834d', '#481308', '#ad4420'
    ];

    let y = 0;
    let idx = 0;
    while (y < 1024) {
      const h = 16 + Math.floor(Math.sin(y * 0.06) * 10) + (idx % 4) * 8;
      ctx.fillStyle = strataColors[idx % strataColors.length];
      ctx.fillRect(0, y, 512, h);

      // Iron-oxide erosion grain & shadow crevice
      ctx.fillStyle = 'rgba(25, 8, 4, 0.22)';
      ctx.fillRect(0, y + h - 3, 512, 3);
      ctx.fillStyle = 'rgba(255, 215, 175, 0.15)';
      ctx.fillRect(0, y, 512, 2);

      y += h;
      idx++;
    }

    // Vertical wind-erosion streaks
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let i = 0; i < 28; i++) {
      const sx = Math.random() * 512;
      const sw = 6 + Math.random() * 14;
      ctx.fillRect(sx, 0, sw, 1024);
    }

    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 2);
    tex.anisotropy = 4;
    return tex;
  }

  // --- 1. STEPPED MONUMENT VALLEY BUTTES & HOODOO SPIRES ---
  buildMesasAndHoodoos() {
    // Stepped multi-tiered geological butte:
    // Base talus slope -> vertical cliff shaft -> flat caprock table
    const count = 22;

    for (let i = 0; i < count; i++) {
      const mesaGroup = new THREE.Group();

      // Sloping talus foundation
      const talus = new THREE.Mesh(
        new THREE.CylinderGeometry(38, 65, 90, 8),
        this.rockMat
      );
      talus.position.y = 45;
      mesaGroup.add(talus);

      // Vertical fluted sandstone cliff tower
      const cliff = new THREE.Mesh(
        new THREE.CylinderGeometry(28, 36, 140, 8),
        this.rockMat
      );
      cliff.position.y = 150;
      mesaGroup.add(cliff);

      // Overhanging flat caprock table
      const caprock = new THREE.Mesh(
        new THREE.CylinderGeometry(34, 26, 18, 8),
        this.caprockMat
      );
      caprock.position.y = 225;
      mesaGroup.add(caprock);

      // Position along canyon flanks
      const side = (i % 2 === 0) ? -1 : 1;
      const x = side * (150 + Math.random() * 110);
      const y = -58 + Math.random() * 15;
      const z = -Math.random() * 4200;

      mesaGroup.position.set(x, y, z);
      mesaGroup.rotation.y = Math.random() * Math.PI;

      const scaleXZ = 1.0 + Math.random() * 0.7;
      const scaleY = 0.85 + Math.random() * 0.7;
      mesaGroup.scale.set(scaleXZ, scaleY, scaleXZ);

      this.group.add(mesaGroup);
      this.formations.push(mesaGroup);
    }
  }

  // --- 2. COLOSSAL NATURAL ROCK ARCHES (FLY-THROUGH) ---
  buildNaturalArches() {
    // 3 iconic natural stone arches spanning across the canyon flight path
    const archZOffsets = [-1200, -2600, -3900];

    archZOffsets.forEach((zOffset, idx) => {
      const archGroup = new THREE.Group();

      // Arch Curved Span (Torus half-circle)
      const archRadius = 150;
      const tubeRadius = 22;
      const archGeo = new THREE.TorusGeometry(archRadius, tubeRadius, 10, 24, Math.PI);
      const archMesh = new THREE.Mesh(archGeo, this.rockMat);
      archMesh.position.set(0, 10, 0);
      archGroup.add(archMesh);

      // Left & Right Massive Anchor Buttress Pillars
      [-archRadius, archRadius].forEach(ox => {
        const pillarGeo = new THREE.CylinderGeometry(tubeRadius * 1.3, tubeRadius * 1.8, 110, 8);
        const pillar = new THREE.Mesh(pillarGeo, this.rockMat);
        pillar.position.set(ox, -45, 0);
        archGroup.add(pillar);
      });

      archGroup.position.set(0, -10, zOffset);
      this.group.add(archGroup);
      this.arches.push({
        group: archGroup,
        cleared: false,
        centerPos: new THREE.Vector3(0, 75, zOffset)
      });
    });
  }

  setActive(active) {
    this.active = active;
    this.group.visible = active;
  }

  update(dt, forwardSpeed, playerPos, onThreadNeedle) {
    if (!this.active) return;
    const speed = forwardSpeed * dt;

    // 1. Update Sandstone Mesas
    for (let i = 0; i < this.formations.length; i++) {
      const f = this.formations[i];
      f.position.z += speed;

      if (f.position.z > 80) {
        f.position.z = -4200 - Math.random() * 500;
        const side = (i % 2 === 0) ? -1 : 1;
        f.position.x = side * (150 + Math.random() * 110);
      }
    }

    // 2. Update Natural Arches & Proximity Check
    for (let i = 0; i < this.arches.length; i++) {
      const arch = this.arches[i];
      arch.group.position.z += speed;

      // Proximity check for "Thread the Needle" near-miss thrill
      if (!arch.cleared && playerPos) {
        const archWorldZ = arch.group.position.z;
        // Check if player is flying directly under the arch
        if (Math.abs(playerPos.z - archWorldZ) < 30 && Math.abs(playerPos.x) < 110 && playerPos.y < 120) {
          arch.cleared = true;
          if (onThreadNeedle) {
            onThreadNeedle(arch.group.position);
          }
        }
      }

      // Recycle arch forward
      if (arch.group.position.z > 100) {
        arch.group.position.z = -4200 - Math.random() * 400;
        arch.cleared = false;
      }
    }
  }
}
