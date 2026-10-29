/* ============================================================
   AFTER BURNER CLIMAX - ADVANCED 3D PROCEDURAL TERRAIN ENGINE
   Faceted Glaciers, Volcanic Magma Rifts & Cyber Metropolis Skyscraper Spire
   ============================================================ */

export class Advanced3DTerrainEngine {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.currentBiome = 'OCEAN_BLUESKY';
    this.terrainObjects = [];

    // 1. Procedural Window Grid Canvas Texture for Cyber Skyscrapers
    const winCvs = document.createElement('canvas');
    winCvs.width = 128; winCvs.height = 256;
    const wctx = winCvs.getContext('2d');
    wctx.fillStyle = '#0a101d';
    wctx.fillRect(0, 0, 128, 256);

    // Glowing window grid
    for (let wy = 8; wy < 256; wy += 12) {
      for (let wx = 6; wx < 128; wx += 14) {
        if (Math.random() > 0.35) {
          wctx.fillStyle = Math.random() > 0.8 ? '#ffb03a' : '#00ffff';
          wctx.fillRect(wx, wy, 8, 6);
        }
      }
    }
    this.windowTex = new THREE.CanvasTexture(winCvs);
    this.windowTex.wrapS = THREE.RepeatWrapping;
    this.windowTex.wrapT = THREE.RepeatWrapping;
    this.windowTex.repeat.set(2, 6);

    // 2. Materials
    this.iceMat = new THREE.MeshStandardMaterial({
      color: 0xa8e6ff,
      roughness: 0.15,
      metalness: 0.55,
      flatShading: true,
      fog: true
    });

    this.snowCapMat = new THREE.MeshStandardMaterial({
      color: 0xf0faff,
      roughness: 0.25,
      metalness: 0.2,
      fog: true
    });

    this.volcanoMat = new THREE.MeshStandardMaterial({
      color: 0x1c120e,
      roughness: 0.88,
      metalness: 0.18,
      flatShading: true,
      fog: true
    });

    this.magmaMat = new THREE.MeshBasicMaterial({
      color: 0xff3b00
    });

    this.skyscraperMat = new THREE.MeshStandardMaterial({
      map: this.windowTex,
      roughness: 0.25,
      metalness: 0.85,
      fog: true
    });

    this.neonMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff
    });

    this.beaconMat = new THREE.MeshBasicMaterial({
      color: 0xff1122
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
    const geo = new THREE.ConeGeometry(42, 160, 6);
    const capGeo = new THREE.ConeGeometry(18, 55, 6);

    for (let i = 0; i < 24; i++) {
      const gGroup = new THREE.Group();
      const mesh = new THREE.Mesh(geo, this.iceMat);
      gGroup.add(mesh);

      // Pristine snow cap
      const cap = new THREE.Mesh(capGeo, this.snowCapMat);
      cap.position.y = 55;
      gGroup.add(cap);

      const side = (i % 2 === 0) ? -1 : 1;
      const x = side * (135 + Math.random() * 140);
      const y = -15 + Math.random() * 35;
      const z = -Math.random() * 3800;

      gGroup.position.set(x, y, z);
      gGroup.scale.set(1.4, 0.9 + Math.random() * 0.9, 1.4);
      gGroup.rotation.y = Math.random() * Math.PI;

      this.group.add(gGroup);
      this.terrainObjects.push(gGroup);
    }
  }

  buildVolcanoRift() {
    const geo = new THREE.ConeGeometry(55, 190, 7);
    for (let i = 0; i < 20; i++) {
      const vGroup = new THREE.Group();
      const mesh = new THREE.Mesh(geo, this.volcanoMat);
      vGroup.add(mesh);

      // Molten Glowing Magma Caldera Top
      const magmaTop = new THREE.Mesh(new THREE.CylinderGeometry(11, 2, 5, 8), this.magmaMat);
      magmaTop.position.set(0, 92, 0);
      vGroup.add(magmaTop);

      // Vertical Magma Fissure Vein running down flank
      const vein = new THREE.Mesh(new THREE.BoxGeometry(1.6, 120, 2), this.magmaMat);
      vein.position.set(0, 20, 28);
      vein.rotation.x = -0.28;
      vGroup.add(vein);

      const side = (i % 2 === 0) ? -1 : 1;
      const x = side * (155 + Math.random() * 130);
      const y = -15 + Math.random() * 40;
      const z = -Math.random() * 3800;

      vGroup.position.set(x, y, z);
      vGroup.scale.set(1.5, 0.85 + Math.random() * 0.8, 1.5);
      vGroup.rotation.y = Math.random() * Math.PI;

      this.group.add(vGroup);
      this.terrainObjects.push(vGroup);
    }
  }

  buildCitySkyscrapers() {
    const geo = new THREE.BoxGeometry(48, 300, 48);
    const antennaGeo = new THREE.CylinderGeometry(0.3, 0.8, 35, 6);

    for (let i = 0; i < 26; i++) {
      const bGroup = new THREE.Group();
      const mesh = new THREE.Mesh(geo, this.skyscraperMat);
      bGroup.add(mesh);

      // Rooftop Neon Crown Ring
      const neonBand = new THREE.Mesh(new THREE.BoxGeometry(50, 6, 50), this.neonMat);
      neonBand.position.set(0, 142, 0);
      bGroup.add(neonBand);

      // Rooftop Spire & Blinking Beacon
      const antenna = new THREE.Mesh(antennaGeo, this.iceMat);
      antenna.position.set(0, 165, 0);
      bGroup.add(antenna);

      const beacon = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), this.beaconMat);
      beacon.position.set(0, 182, 0);
      bGroup.add(beacon);

      const side = (i % 2 === 0) ? -1 : 1;
      const x = side * (130 + Math.random() * 140);
      const y = 80 + Math.random() * 60;
      const z = -Math.random() * 3800;

      bGroup.position.set(x, y, z);
      this.group.add(bGroup);
      this.terrainObjects.push(bGroup);
    }
  }

  update(dt, forwardSpeed) {
    if (this.terrainObjects.length === 0) return;
    const speed = forwardSpeed * dt;

    for (let i = 0; i < this.terrainObjects.length; i++) {
      const obj = this.terrainObjects[i];
      obj.position.z += speed;
      if (obj.position.z > 80) {
        obj.position.z = -3800 - Math.random() * 600;
        const side = (i % 2 === 0) ? -1 : 1;
        obj.position.x = side * (140 + Math.random() * 130);
      }
    }
  }

  clear() {
    this.terrainObjects.forEach(obj => this.group.remove(obj));
    this.terrainObjects = [];
  }
}
