/* ============================================================
   AFTER BURNER CLIMAX - CONTINUOUS FRACTAL HEIGHTMAP TERRAIN ENGINE
   Infinite Scrolling 3D Mountain Ridges, Grand Canyon Walls & Fjords
   Features: Multi-Octave fBm Noise, Stepped Stratification & Dynamic Chiaroscuro
   ============================================================ */

class FastPerlin2D {
  constructor(seed = 1986) {
    this.p = new Uint8Array(512);
    const perm = [
      151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
      8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,
      35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,
      134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,
      55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,
      18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,
      250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,
      189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,
      172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,
      228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,
      107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
      138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
    ];
    for (let i = 0; i < 256; i++) {
      this.p[i] = perm[i];
      this.p[256 + i] = perm[i];
    }
  }

  fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(a, b, t) { return a + t * (b - a); }
  grad(hash, x, y) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise2D(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = this.fade(xf);
    const v = this.fade(yf);

    const aa = this.p[this.p[X] + Y];
    const ab = this.p[this.p[X] + Y + 1];
    const ba = this.p[this.p[X + 1] + Y];
    const bb = this.p[this.p[X + 1] + Y + 1];

    const x1 = this.lerp(this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf), u);
    const x2 = this.lerp(this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1), u);
    return this.lerp(x1, x2, v);
  }

  fBm(x, y, octaves = 4) {
    let total = 0;
    let amp = 1.0;
    let freq = 1.0;
    let maxAmp = 0;
    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * freq, y * freq) * amp;
      maxAmp += amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    return total / maxAmp;
  }
}

export class ContinuousFractalTerrain {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.noise = new FastPerlin2D();
    this.currentBiome = 'OCEAN_SUNSET';

    // Terrain Mesh Dimensions
    this.chunkWidth = 4200;
    this.chunkDepth = 4500;
    this.segmentsX = 84;
    this.segmentsZ = 90;

    // Build procedural textures for terrain surfaces
    this.textures = {
      canyon: this.createCanyonStrataTexture(),
      ice: this.createGlacierIceTexture(),
      volcano: this.createVolcanoBasaltTexture(),
      coastal: this.createCoastalRockTexture()
    };

    // PBR Materials for each biome
    this.materials = {
      canyon: new THREE.MeshStandardMaterial({
        map: this.textures.canyon,
        roughness: 0.88,
        metalness: 0.12,
        flatShading: true,
        fog: true
      }),
      ice: new THREE.MeshStandardMaterial({
        map: this.textures.ice,
        roughness: 0.18,
        metalness: 0.45,
        flatShading: true,
        fog: true
      }),
      volcano: new THREE.MeshStandardMaterial({
        map: this.textures.volcano,
        roughness: 0.92,
        metalness: 0.15,
        flatShading: true,
        fog: true
      }),
      coastal: new THREE.MeshStandardMaterial({
        map: this.textures.coastal,
        roughness: 0.75,
        metalness: 0.25,
        flatShading: true,
        fog: true
      })
    };

    // Double-buffered interlocking terrain chunks
    this.chunks = [];
    this.initChunks();
  }

  initChunks() {
    for (let i = 0; i < 2; i++) {
      const geo = new THREE.PlaneGeometry(
        this.chunkWidth,
        this.chunkDepth,
        this.segmentsX,
        this.segmentsZ
      );
      geo.rotateX(-Math.PI / 2); // Orient horizontally

      const mesh = new THREE.Mesh(geo, this.materials.coastal);
      mesh.position.z = -i * this.chunkDepth;
      this.group.add(mesh);

      this.chunks.push({
        mesh: mesh,
        baseZ: -i * this.chunkDepth,
        worldZOffset: -i * this.chunkDepth
      });

      this.sculptChunk(mesh, -i * this.chunkDepth);
    }
  }

  sculptChunk(mesh, worldZOrigin) {
    const pos = mesh.geometry.attributes.position;
    const vertexCount = pos.count;

    for (let i = 0; i < vertexCount; i++) {
      const localX = pos.getX(i);
      const localZ = pos.getZ(i);
      const worldZ = worldZOrigin + localZ;

      const y = this.calculateHeight(localX, worldZ, this.currentBiome);
      pos.setY(i, y);
    }

    pos.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  }

  calculateHeight(worldX, worldZ, biome) {
    const distFromCenter = Math.abs(worldX);
    const baseWaterLevel = -58.0;

    if (biome === 'OCEAN_SUNSET') {
      // Ocean Stage: Vast sparkling ocean in center with dramatic coastal sea stacks and mountain headlands on flanks
      if (distFromCenter < 550) {
        // Flat ocean flight corridor
        return baseWaterLevel;
      }
      // Rising coastal headlands and dramatic sea cliffs
      const wallT = Math.min(1.0, (distFromCenter - 550) / 600);
      const cliffSmooth = wallT * wallT * (3 - 2 * wallT);
      const mNoise = this.noise.fBm(worldX * 0.0012, worldZ * 0.0012, 4);
      return baseWaterLevel + (mNoise * 260 + 120) * cliffSmooth;
    }

    if (biome === 'DESERT_CANYON') {
      // Grand Canyon Badlands: Tight winding canyon pass flanked by towering stepped red-rock mesa cliffs
      const corridorWidth = 240;
      if (distFromCenter < corridorWidth) {
        return baseWaterLevel;
      }

      const wallT = Math.min(1.0, (distFromCenter - corridorWidth) / 380);
      const cliffSmooth = wallT * wallT * (3 - 2 * wallT);

      // Multi-octave ridged noise for crags and buttresses
      const rawNoise = this.noise.fBm(worldX * 0.0016, worldZ * 0.0016, 4);
      const ridgeNoise = 1.0 - Math.abs(rawNoise * 2.2);

      let rawHeight = (rawNoise * 320 + ridgeNoise * 180 + 140) * cliffSmooth;

      // Stepped geological stratification (Mesas & plateaus)
      const stepSize = 48;
      const stepped = Math.floor(rawHeight / stepSize) * stepSize;
      const finalHeight = rawHeight * 0.35 + stepped * 0.65;

      return baseWaterLevel + finalHeight;
    }

    if (biome === 'POLAR_ICE') {
      // Polar Ice Straits: Razor-sharp glacial needle peaks and towering ice fjord walls
      const corridorWidth = 280;
      if (distFromCenter < corridorWidth) {
        return baseWaterLevel;
      }

      const wallT = Math.min(1.0, (distFromCenter - corridorWidth) / 420);
      const cliffSmooth = wallT * wallT * (3 - 2 * wallT);

      const rawNoise = this.noise.fBm(worldX * 0.0018, worldZ * 0.0018, 5);
      const jaggedPeaks = Math.abs(rawNoise) * 440;

      return baseWaterLevel + (jaggedPeaks + 100) * cliffSmooth;
    }

    if (biome === 'VOLCANIC_MAGMA') {
      // Volcanic Caldera: Dark basalt caldera walls with craggy volcanic peaks
      const corridorWidth = 260;
      if (distFromCenter < corridorWidth) {
        return baseWaterLevel;
      }

      const wallT = Math.min(1.0, (distFromCenter - corridorWidth) / 400);
      const cliffSmooth = wallT * wallT * (3 - 2 * wallT);

      const vNoise = this.noise.fBm(worldX * 0.0015, worldZ * 0.0015, 4);
      return baseWaterLevel + (vNoise * 360 + 160) * cliffSmooth;
    }

    return baseWaterLevel;
  }

  setBiome(biome) {
    this.currentBiome = biome;

    let mat = this.materials.coastal;
    if (biome === 'DESERT_CANYON') mat = this.materials.canyon;
    else if (biome === 'POLAR_ICE') mat = this.materials.ice;
    else if (biome === 'VOLCANIC_MAGMA') mat = this.materials.volcano;

    this.chunks.forEach(c => {
      c.mesh.material = mat;
      this.sculptChunk(c.mesh, c.worldZOffset);
    });
  }

  update(dt, forwardSpeed) {
    const moveZ = forwardSpeed * dt;

    this.chunks.forEach(c => {
      c.mesh.position.z += moveZ;

      // When chunk passes completely behind camera, wrap forward
      if (c.mesh.position.z > this.chunkDepth * 0.5) {
        // Move ahead of the other chunk
        const otherChunk = this.chunks.find(other => other !== c);
        const newZ = otherChunk.mesh.position.z - this.chunkDepth;
        c.mesh.position.z = newZ;

        // Advance world Z offset for non-repeating continuous terrain
        c.worldZOffset = newZ;
        this.sculptChunk(c.mesh, c.worldZOffset);
      }
    });
  }

  // --- PROCEDURAL 1024x1024 TEXTURE GENERATORS ---

  createCanyonStrataTexture() {
    if (typeof document === 'undefined') return null;
    const cvs = document.createElement('canvas');
    cvs.width = 512; cvs.height = 1024;
    const ctx = cvs.getContext('2d');

    // Sedimentary sandstone geological strata
    const strataColors = [
      '#a8381e', '#7c2512', '#c9542a', '#611a0c',
      '#bf5a32', '#d97645', '#52140a', '#a14223'
    ];

    let y = 0;
    let idx = 0;
    while (y < 1024) {
      const h = 18 + Math.floor(Math.sin(y * 0.05) * 8) + (idx % 3) * 6;
      ctx.fillStyle = strataColors[idx % strataColors.length];
      ctx.fillRect(0, y, 512, h);

      // Fine sediment grain stripes
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, y + h - 3, 512, 3);
      ctx.fillStyle = 'rgba(255, 200, 150, 0.12)';
      ctx.fillRect(0, y, 512, 2);

      y += h;
      idx++;
    }

    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 1);
    return tex;
  }

  createGlacierIceTexture() {
    if (typeof document === 'undefined') return null;
    const cvs = document.createElement('canvas');
    cvs.width = 512; cvs.height = 512;
    const ctx = cvs.getContext('2d');

    // Sub-zero glacier ice turquoise gradient
    ctx.fillStyle = '#6cb7db';
    ctx.fillRect(0, 0, 512, 512);

    // Deep crevasse fissures
    ctx.strokeStyle = '#225577';
    ctx.lineWidth = 4;
    for (let i = 0; i < 16; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, 0);
      ctx.lineTo(Math.random() * 512, 512);
      ctx.stroke();
    }

    // Snow cover highlight patches
    ctx.fillStyle = 'rgba(240, 250, 255, 0.65)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, 40 + Math.random() * 60, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    return tex;
  }

  createVolcanoBasaltTexture() {
    if (typeof document === 'undefined') return null;
    const cvs = document.createElement('canvas');
    cvs.width = 512; cvs.height = 512;
    const ctx = cvs.getContext('2d');

    // Dark charcoal basalt
    ctx.fillStyle = '#141210';
    ctx.fillRect(0, 0, 512, 512);

    // Incandescent magma veins
    ctx.strokeStyle = '#ff3b00';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 10;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, 0);
      ctx.bezierCurveTo(
        Math.random() * 512, 170,
        Math.random() * 512, 340,
        Math.random() * 512, 512
      );
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }

  createCoastalRockTexture() {
    if (typeof document === 'undefined') return null;
    const cvs = document.createElement('canvas');
    cvs.width = 512; cvs.height = 512;
    const ctx = cvs.getContext('2d');

    ctx.fillStyle = '#3a3e47';
    ctx.fillRect(0, 0, 512, 512);

    // Coastal cliff vegetation & weathered rock layers
    ctx.fillStyle = '#263024'; // Sea cliff moss/scrub
    for (let i = 0; i < 24; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 60, 30);
    }

    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    return tex;
  }
}
