/* ============================================================
   AFTER BURNER CLIMAX - PARTICLE ENGINE & VISUAL FX
   Shockwave Rings, Fireballs, Debris Chunks, Smoke Ribbons
   ============================================================ */

export class ParticleEngine {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.particles = [];

    // Pre-allocated geometries
    this.sparkGeo = new THREE.SphereGeometry(1.2, 6, 6);
    this.debrisGeo = new THREE.BoxGeometry(1.4, 0.8, 1.4);
    this.ringGeo = new THREE.RingGeometry(2.0, 4.5, 18);
  }

  createExplosion(pos, count = 28, isBoss = false) {
    const totalCount = isBoss ? count * 2 : count;

    // 1. Expanding Shockwave Translucent Ring
    const ringMat = new THREE.MeshBasicMaterial({
      color: isBoss ? 0xff0044 : 0xffee66,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(this.ringGeo, ringMat);
    ring.position.copy(pos);
    ring.lookAt(this.camera.position);
    this.scene.add(ring);
    this.particles.push({
      mesh: ring,
      type: 'RING',
      growth: isBoss ? 95 : 65,
      vel: new THREE.Vector3(0, 0, 0),
      life: 0.38,
      maxLife: 0.38
    });

    // 2. Fireball & Shrapnel Debris
    for (let i = 0; i < totalCount; i++) {
      const isDebris = (i % 3 === 0);
      const mat = new THREE.MeshBasicMaterial({
        color: (Math.random() > 0.4) ? 0xff4400 : (Math.random() > 0.5 ? 0xffea00 : 0x111111),
        transparent: true,
        opacity: 1.0
      });

      const p = new THREE.Mesh(isDebris ? this.debrisGeo : this.sparkGeo, mat);
      p.position.copy(pos);
      this.scene.add(p);

      const speed = isBoss ? 140 : 90;
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed,
        (Math.random() - 0.5) * speed
      );

      this.particles.push({
        mesh: p,
        type: 'SPARK',
        vel: vel,
        life: 0.65,
        maxLife: 0.65
      });
    }

    // Camera Shake
    const shakePower = isBoss ? 26 : 10;
    this.camera.position.x += (Math.random() - 0.5) * shakePower;
    this.camera.position.y += (Math.random() - 0.5) * shakePower;
  }

  createSmokePuff(pos, color = 0x999999) {
    const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.75 });
    const p = new THREE.Mesh(this.sparkGeo, mat);
    p.position.copy(pos);
    this.scene.add(p);
    this.particles.push({
      mesh: p,
      type: 'SMOKE',
      vel: new THREE.Vector3(0, 0, 45),
      life: 0.45,
      maxLife: 0.45
    });
  }

  update(dtReal) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dtReal;

      if (p.type === 'RING') {
        p.mesh.scale.multiplyScalar(1.0 + p.growth * dtReal * 0.12);
        p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);
      } else {
        p.mesh.position.addScaledVector(p.vel, dtReal);
        p.mesh.scale.multiplyScalar(0.95);
        p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }
  }
}
