/* ============================================================
   AFTER BURNER CLIMAX - STAGE 2 GRAND CANYON BADLANDS
   Procedural 3D Red-Rock Canyon Cliffs, Towers & Obstacles
   ============================================================ */

export class CanyonEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Procedural Canyon Rock Strata Texture
    const cvs = document.createElement('canvas');
    cvs.width = 128; cvs.height = 128;
    const ctx = cvs.getContext('2d');
    ctx.fillStyle = '#8a331c';
    ctx.fillRect(0, 0, 128, 128);

    // Sediment strata stripes
    const colors = ['#b3472b', '#6b2413', '#cc5d39', '#541c0e', '#c46944'];
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(0, i * 16, 128, 8 + (i % 3) * 3);
    }

    const rockTex = new THREE.CanvasTexture(cvs);
    rockTex.wrapS = THREE.RepeatWrapping;
    rockTex.wrapT = THREE.RepeatWrapping;
    rockTex.repeat.set(4, 16);

    this.rockMat = new THREE.MeshStandardMaterial({
      map: rockTex,
      roughness: 0.9,
      metalness: 0.1,
      fog: true
    });

    this.pillars = [];
    this.pillarCount = 18;
    this.active = false;
    this.build();
    this.group.visible = false;
  }

  build() {
    // Left & Right Canyon Walls
    const wallGeo = new THREE.CylinderGeometry(40, 55, 320, 8);
    for (let i = 0; i < this.pillarCount; i++) {
      const mesh = new THREE.Mesh(wallGeo, this.rockMat);
      const side = (i % 2 === 0) ? -1 : 1;
      const x = side * (160 + Math.random() * 80);
      const y = 60 + Math.random() * 40;
      const z = -Math.random() * 3800;

      mesh.position.set(x, y, z);
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.scale.set(1.2, 1.0 + Math.random() * 0.8, 1.4);
      this.group.add(mesh);
      this.pillars.push(mesh);
    }
  }

  setActive(active) {
    this.active = active;
    this.group.visible = active;
  }

  update(dt, forwardSpeed) {
    if (!this.active) return;
    const speed = forwardSpeed * dt;

    for (let i = 0; i < this.pillarCount; i++) {
      const p = this.pillars[i];
      p.position.z += speed;
      if (p.position.z > 80) {
        p.position.z = -3800 - Math.random() * 600;
        const side = (i % 2 === 0) ? -1 : 1;
        p.position.x = side * (160 + Math.random() * 80);
      }
    }
  }
}
