/* ============================================================
   AFTER BURNER CLIMAX - ADVANCED 3D PROCEDURAL TERRAIN ENGINE
   Canyons, Glaciers, Volcanic Magma Rifts, Cyber Skyscraper City
   ============================================================ */

export class Advanced3DTerrainEngine {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.currentBiome = 'OCEAN_SUNSET';
    this.terrainObjects = [];

    // Materials
    this.iceMat = new THREE.MeshStandardMaterial({
      color: 0x99ddff,
      roughness: 0.18,
      metalness: 0.45,
      fog: true
    });

    this.volcanoMat = new THREE.MeshStandardMaterial({
      color: 0x22110c,
      roughness: 0.85,
      metalness: 0.2,
      fog: true
    });

    this.magmaMat = new THREE.MeshBasicMaterial({
      color: 0xff3300
    });

    this.skyscraperMat = new THREE.MeshStandardMaterial({
      color: 0x111c2e,
      roughness: 0.2,
      metalness: 0.85,
      fog: true
    });

    this.neonMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff
    });
  }

  setBiome(biome) {
    this.clear();
    this.currentBiome = biome;

    if (biome === 'POLAR_ICE') {
      this.buildGlaciers();
    } else if (biome === 'VOLCANIC_MAGMA') {
      this.buildVolcanoRift();
    } else if (biome === 'METROPOLIS_NIGHT') {
      this.buildCitySkyscrapers();
    }
  }

  buildGlaciers() {
    const geo = new THREE.ConeGeometry(38, 140, 5);
    for (let i = 0; i < 20; i++) {
      const mesh = new THREE.Mesh(geo, this.iceMat);
      const side = (i % 2 === 0) ? -1 : 1;
      const x = side * (140 + Math.random() * 120);
      const y = -10 + Math.random() * 30;
      const z = -Math.random() * 3600;

      mesh.position.set(x, y, z);
      mesh.scale.set(1.4, 0.9 + Math.random() * 0.8, 1.4);
      this.group.add(mesh);
      this.terrainObjects.push(mesh);
    }
  }

  buildVolcanoRift() {
    const geo = new THREE.ConeGeometry(50, 180, 6);
    for (let i = 0; i < 18; i++) {
      const mesh = new THREE.Mesh(geo, this.volcanoMat);
      const side = (i % 2 === 0) ? -1 : 1;
      const x = side * (160 + Math.random() * 110);
      const y = -10 + Math.random() * 35;
      const z = -Math.random() * 3600;

      // Add Glowing Magma Top
      const magmaTop = new THREE.Mesh(new THREE.CylinderGeometry(8, 2, 4, 8), this.magmaMat);
      magmaTop.position.set(0, 85, 0);
      mesh.add(magmaTop);

      mesh.position.set(x, y, z);
      mesh.scale.set(1.5, 0.8 + Math.random() * 0.7, 1.5);
      this.group.add(mesh);
      this.terrainObjects.push(mesh);
    }
  }

  buildCitySkyscrapers() {
    const geo = new THREE.BoxGeometry(45, 280, 45);
    for (let i = 0; i < 22; i++) {
      const mesh = new THREE.Mesh(geo, this.skyscraperMat);
      const side = (i % 2 === 0) ? -1 : 1;
      const x = side * (135 + Math.random() * 120);
      const y = 80 + Math.random() * 60;
      const z = -Math.random() * 3600;

      // Roof Neon Antenna
      const neonBand = new THREE.Mesh(new THREE.BoxGeometry(46, 6, 46), this.neonMat);
      neonBand.position.set(0, 120, 0);
      mesh.add(neonBand);

      mesh.position.set(x, y, z);
      this.group.add(mesh);
      this.terrainObjects.push(mesh);
    }
  }

  update(dt, forwardSpeed) {
    if (this.terrainObjects.length === 0) return;
    const speed = forwardSpeed * dt;

    for (let i = 0; i < this.terrainObjects.length; i++) {
      const obj = this.terrainObjects[i];
      obj.position.z += speed;
      if (obj.position.z > 80) {
        obj.position.z = -3600 - Math.random() * 600;
        const side = (i % 2 === 0) ? -1 : 1;
        obj.position.x = side * (140 + Math.random() * 120);
      }
    }
  }

  clear() {
    this.terrainObjects.forEach(obj => this.group.remove(obj));
    this.terrainObjects = [];
  }
}
