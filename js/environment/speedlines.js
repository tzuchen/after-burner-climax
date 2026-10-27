/* ============================================================
   AFTER BURNER CLIMAX - SUPERSONIC SPEED LINES & VAPOR CONE
   Transonic Prandtl-Glauert Condensation Shockwave & Warp Streaks
   ============================================================ */

export class SpeedLineSystem {
  constructor(scene) {
    this.scene = scene;
    this.count = 350;

    // Buffer geometry for dynamic line segments
    this.geo = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.count * 6);

    for (let i = 0; i < this.count; i++) {
      this.resetLine(i, true);
    }

    this.geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.mat = new THREE.LineBasicMaterial({
      color: 0x99ffff,
      transparent: true,
      opacity: 0.70
    });

    this.linesMesh = new THREE.LineSegments(this.geo, this.mat);
    this.scene.add(this.linesMesh);

    // Prandtl-Glauert Vapor Cone (Transonic sonic boom condensation ring)
    const coneGeo = new THREE.ConeGeometry(8, 5, 24, 1, true);
    coneGeo.rotateX(Math.PI / 2);
    this.vaporMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.vaporCone = new THREE.Mesh(coneGeo, this.vaporMat);
    this.scene.add(this.vaporCone);
  }

  resetLine(idx, randomZ = false) {
    const x = (Math.random() - 0.5) * 620;
    const y = (Math.random() - 0.5) * 360 + 20;
    const z = randomZ ? -Math.random() * 3200 : -2800 - Math.random() * 800;
    const len = 50 + Math.random() * 110;

    this.positions[idx * 6] = x;
    this.positions[idx * 6 + 1] = y;
    this.positions[idx * 6 + 2] = z;

    this.positions[idx * 6 + 3] = x;
    this.positions[idx * 6 + 4] = y;
    this.positions[idx * 6 + 5] = z + len;
  }

  update(dt, forwardSpeed, isAfterburner, isClimax, playerPos) {
    const lineSpeed = forwardSpeed * 1.5;
    const p = this.positions;

    for (let i = 0; i < this.count; i++) {
      p[i * 6 + 2] += lineSpeed * dt;
      p[i * 6 + 5] += lineSpeed * dt;

      if (p[i * 6 + 2] > 70) {
        this.resetLine(i, false);
      }
    }
    this.geo.attributes.position.needsUpdate = true;

    // Line color & opacity shift based on speed
    if (isAfterburner) {
      this.mat.color.setHex(0xffaa44);
      this.mat.opacity = 0.95;
    } else if (isClimax) {
      this.mat.color.setHex(0xff0055);
      this.mat.opacity = 0.65;
    } else {
      this.mat.color.setHex(0x99ffff);
      this.mat.opacity = 0.70;
    }

    // Update Transonic Vapor Cone Position
    this.vaporCone.position.copy(playerPos);
    this.vaporCone.position.z += 1.5;

    // Pop vapor cone when engaging afterburner
    if (isAfterburner) {
      this.vaporMat.opacity = Math.max(0, this.vaporMat.opacity - dt * 2.0);
    } else {
      this.vaporMat.opacity = 0;
    }
  }

  triggerSonicBoom() {
    this.vaporMat.opacity = 0.85;
  }
}
