/* ============================================================
   AFTER BURNER CLIMAX - 3D PROCEDURAL VOLUMETRIC CLOUDS
   Multi-Lobed Golden Sunset Cumulus Billboards with Rim Lighting
   ============================================================ */

export class CloudSystem {
  constructor(scene) {
    this.scene = scene;
    this.cloudCount = 85;
    this.cloudGroup = new THREE.Group();
    this.scene.add(this.cloudGroup);

    // Multi-lobed organic cumulus cloud canvas texture (512x512)
    const cvs = document.createElement('canvas');
    cvs.width = 512;
    cvs.height = 512;
    const ctx = cvs.getContext('2d');

    // Draw clustered soft cloud lobes with golden rim highlights
    const lobes = [
      { x: 256, y: 256, r: 150, alpha: 0.8 },
      { x: 180, y: 230, r: 120, alpha: 0.75 },
      { x: 330, y: 240, r: 130, alpha: 0.75 },
      { x: 220, y: 170, r: 110, alpha: 0.85 }, // Top rim
      { x: 300, y: 180, r: 115, alpha: 0.85 }, // Top rim
      { x: 140, y: 280, r: 90, alpha: 0.65 },
      { x: 370, y: 290, r: 95, alpha: 0.65 },
      { x: 256, y: 310, r: 110, alpha: 0.7 }
    ];

    lobes.forEach(lobe => {
      const grad = ctx.createRadialGradient(lobe.x, lobe.y - 15, 10, lobe.x, lobe.y, lobe.r);
      // Golden sunset rim highlight at top
      grad.addColorStop(0, `rgba(255, 250, 240, ${lobe.alpha})`);
      grad.addColorStop(0.35, `rgba(255, 225, 185, ${lobe.alpha * 0.8})`);
      grad.addColorStop(0.7, `rgba(255, 180, 130, ${lobe.alpha * 0.4})`);
      grad.addColorStop(1, 'rgba(255, 160, 100, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lobe.x, lobe.y, lobe.r, 0, Math.PI * 2);
      ctx.fill();
    });

    this.cloudTex = new THREE.CanvasTexture(cvs);
    this.cloudMat = new THREE.SpriteMaterial({
      map: this.cloudTex,
      transparent: true,
      opacity: 0.75,
      fog: true
    });

    this.clouds = [];
    for (let i = 0; i < this.cloudCount; i++) {
      const sprite = new THREE.Sprite(this.cloudMat.clone());
      this.resetCloud(sprite, true);
      this.cloudGroup.add(sprite);
      this.clouds.push(sprite);
    }
  }

  resetCloud(sprite, randomZ = false) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const x = side * (100 + Math.random() * 550);
    const y = -15 + Math.random() * 220;
    const z = randomZ ? -Math.random() * 4200 : -3800 - Math.random() * 1200;
    const scale = 180 + Math.random() * 280;

    sprite.position.set(x, y, z);
    sprite.scale.set(scale, scale * 0.62, 1);
  }

  setBiomeTheme(theme) {
    if (theme === 'OCEAN_BLUESKY') {
      // Clear Blue Sky & Pure White Clouds (晴空萬里，藍天白雲)
      this.clouds.forEach(c => {
        c.material.color.setHex(0xffffff);
        c.material.opacity = 0.88;
      });
    } else if (theme === 'STRATOSPHERE_NIGHT') {
      this.clouds.forEach(c => {
        c.material.color.setHex(0x354b6e);
        c.material.opacity = 0.5;
      });
    } else if (theme === 'DESERT_CANYON') {
      this.clouds.forEach(c => {
        c.material.color.setHex(0xffaa77);
        c.material.opacity = 0.62;
      });
    } else if (theme === 'POLAR_ICE') {
      this.clouds.forEach(c => {
        c.material.color.setHex(0xd0e8ff);
        c.material.opacity = 0.7;
      });
    } else if (theme === 'VOLCANIC_MAGMA') {
      this.clouds.forEach(c => {
        c.material.color.setHex(0x5a2d22); // Smoldering volcanic ash clouds
        c.material.opacity = 0.75;
      });
    } else {
      // Ocean Sunset
      this.clouds.forEach(c => {
        c.material.color.setHex(0xffeedd);
        c.material.opacity = 0.75;
      });
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
