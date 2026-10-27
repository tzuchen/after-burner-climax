/* ============================================================
   AFTER BURNER CLIMAX - 3D PROCEDURAL VOLUMETRIC CLOUDS
   High-Altitude Cirrus & Low-Altitude Cumulus Billboards
   ============================================================ */

export class CloudSystem {
  constructor(scene) {
    this.scene = scene;
    this.cloudCount = 65;
    this.cloudGroup = new THREE.Group();
    this.scene.add(this.cloudGroup);

    // Procedural soft cloud circle texture
    const cvs = document.createElement('canvas');
    cvs.width = 128; cvs.height = 128;
    const ctx = cvs.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.45, 'rgba(255, 230, 200, 0.45)');
    grad.addColorStop(1, 'rgba(255, 200, 150, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    this.cloudTex = new THREE.CanvasTexture(cvs);
    this.cloudMat = new THREE.SpriteMaterial({
      map: this.cloudTex,
      transparent: true,
      opacity: 0.65,
      fog: true
    });

    this.clouds = [];
    for (let i = 0; i < this.cloudCount; i++) {
      const sprite = new THREE.Sprite(this.cloudMat);
      this.resetCloud(sprite, true);
      this.cloudGroup.add(sprite);
      this.clouds.push(sprite);
    }
  }

  resetCloud(sprite, randomZ = false) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const x = side * (120 + Math.random() * 450);
    const y = -20 + Math.random() * 180;
    const z = randomZ ? -Math.random() * 4000 : -3600 - Math.random() * 1000;
    const scale = 140 + Math.random() * 220;

    sprite.position.set(x, y, z);
    sprite.scale.set(scale, scale * 0.65, 1);
  }

  setBiomeTheme(theme) {
    if (theme === 'STRATOSPHERE_NIGHT') {
      this.cloudMat.color.setHex(0x334466);
      this.cloudMat.opacity = 0.45;
    } else if (theme === 'DESERT_CANYON') {
      this.cloudMat.color.setHex(0xffbb88);
      this.cloudMat.opacity = 0.55;
    } else {
      // Ocean Sunset
      this.cloudMat.color.setHex(0xffeedd);
      this.cloudMat.opacity = 0.65;
    }
  }

  update(dt, forwardSpeed) {
    const cloudSpeed = forwardSpeed * 1.05;
    for (let i = 0; i < this.cloudCount; i++) {
      const c = this.clouds[i];
      c.position.z += cloudSpeed * dt;
      if (c.position.z > 80) {
        this.resetCloud(c, false);
      }
    }
  }
}
