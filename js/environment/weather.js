/* ============================================================
   AFTER BURNER CLIMAX - DYNAMIC WEATHER & ATMOSPHERIC EFFECTS
   Blizzards, Volcanic Embers, Rain Streaks, Lightning Flashes
   ============================================================ */

export class WeatherSystem {
  constructor(scene) {
    this.scene = scene;
    this.particleCount = 180;
    this.currentType = 'NONE'; // 'NONE', 'SNOW', 'ASH', 'RAIN'

    this.geo = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.particleCount * 3);
    this.velocities = [];

    for (let i = 0; i < this.particleCount; i++) {
      this.resetParticle(i, true);
    }

    this.geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 3.5,
      transparent: true,
      opacity: 0.8,
      fog: true
    });

    this.particles = new THREE.Points(this.geo, this.mat);
    this.scene.add(this.particles);

    // Lightning Flash Light for Storms
    this.lightningLight = new THREE.PointLight(0xaaccff, 0, 3000);
    this.lightningLight.position.set(0, 400, -1200);
    this.scene.add(this.lightningLight);
    this.lightningTimer = 0;
  }

  resetParticle(i, randomZ = false) {
    const p = this.positions;
    p[i * 3] = (Math.random() - 0.5) * 450;
    p[i * 3 + 1] = -40 + Math.random() * 220;
    p[i * 3 + 2] = randomZ ? -Math.random() * 2400 : -2200 - Math.random() * 600;

    this.velocities[i] = {
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 15,
      z: 750 + Math.random() * 400
    };
  }

  setWeather(biome) {
    if (biome === 'POLAR_ICE') {
      this.currentType = 'SNOW';
      this.mat.color.setHex(0xeef6ff);
      this.mat.size = 3.5;
      this.mat.opacity = 0.85;
      this.particles.visible = true;
    } else if (biome === 'VOLCANIC_MAGMA') {
      this.currentType = 'ASH';
      this.mat.color.setHex(0xff5511);
      this.mat.size = 4.2;
      this.mat.opacity = 0.90;
      this.particles.visible = true;
    } else if (biome === 'METROPOLIS_NIGHT') {
      this.currentType = 'RAIN';
      this.mat.color.setHex(0x88ccff);
      this.mat.size = 2.5;
      this.mat.opacity = 0.70;
      this.particles.visible = true;
    } else {
      this.currentType = 'NONE';
      this.particles.visible = false;
    }
  }

  update(dt, forwardSpeed) {
    if (this.currentType === 'NONE') return;

    const p = this.positions;
    const speedMult = forwardSpeed * 1.2;

    for (let i = 0; i < this.particleCount; i++) {
      const v = this.velocities[i];
      p[i * 3] += v.x * dt;
      p[i * 3 + 1] += v.y * dt;
      p[i * 3 + 2] += (v.z + speedMult) * dt;

      if (p[i * 3 + 2] > 60) {
        this.resetParticle(i, false);
      }
    }
    this.geo.attributes.position.needsUpdate = true;

    // Lightning strike simulation in storm stages
    if (this.currentType === 'RAIN') {
      this.lightningTimer += dt;
      if (this.lightningTimer > 3.5 && Math.random() < 0.08) {
        this.lightningTimer = 0;
        this.lightningLight.intensity = 5.0;
        setTimeout(() => { this.lightningLight.intensity = 0; }, 90);
        setTimeout(() => { this.lightningLight.intensity = 3.0; }, 140);
        setTimeout(() => { this.lightningLight.intensity = 0; }, 220);
      }
    }
  }
}
