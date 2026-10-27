/* ============================================================
   AFTER BURNER CLIMAX - KC-10 EXTENDER REFUELING TANKER
   Stage Clear Aerial In-Flight Refueling & Rearm Sequence
   ============================================================ */

export class TankerKC10 {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.tankerMat = new THREE.MeshStandardMaterial({
      color: 0x8a9ba8,
      roughness: 0.35,
      metalness: 0.5
    });

    this.darkMat = new THREE.MeshStandardMaterial({
      color: 0x222a33,
      roughness: 0.4,
      metalness: 0.7
    });

    this.boomMat = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      roughness: 0.2
    });

    this.active = false;
    this.docked = false;
    this.build();
    this.group.visible = false;
  }

  build() {
    // 1. Long Wide-Body Fuselage
    const fuselageGeo = new THREE.CylinderGeometry(4.2, 3.8, 54, 16);
    fuselageGeo.rotateX(Math.PI / 2);
    const fuselage = new THREE.Mesh(fuselageGeo, this.tankerMat);
    fuselage.position.set(0, 0, 0);
    this.group.add(fuselage);

    // Rounded Cockpit Nose
    const noseGeo = new THREE.SphereGeometry(4.2, 16, 12);
    noseGeo.scale(1, 0.9, 1.8);
    const nose = new THREE.Mesh(noseGeo, this.tankerMat);
    nose.position.set(0, 0, -26);
    this.group.add(nose);

    // 2. Huge Swept Main Wings
    const wingGeo = new THREE.BoxGeometry(84, 0.8, 12);
    const wings = new THREE.Mesh(wingGeo, this.tankerMat);
    wings.position.set(0, 0.5, -4);
    this.group.add(wings);

    // 3. Three Turbofan Engines (Two under wings + One in tail fin)
    [-24, 24].forEach(ox => {
      const eng = new THREE.Mesh(
        new THREE.CylinderGeometry(2.4, 2.2, 12, 14).rotateX(Math.PI / 2),
        this.darkMat
      );
      eng.position.set(ox, -3.2, -6);
      this.group.add(eng);
    });

    // Tail Fin Engine
    const tailEng = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.0, 10, 14).rotateX(Math.PI / 2),
      this.darkMat
    );
    tailEng.position.set(0, 6.5, 20);
    this.group.add(tailEng);

    // Tall Vertical Fin
    const finGeo = new THREE.BoxGeometry(0.5, 14, 12);
    const fin = new THREE.Mesh(finGeo, this.tankerMat);
    fin.position.set(0, 11, 22);
    this.group.add(fin);

    // 4. Flying Refueling Boom (Yellow diagonal boom under tail)
    this.boom = new THREE.Group();
    const boomPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.25, 24, 8).rotateX(Math.PI / 3),
      this.boomMat
    );
    boomPipe.position.set(0, -6, 10);
    this.boom.add(boomPipe);

    // Boom V-vane control fins
    const vaneGeo = new THREE.BoxGeometry(4, 0.15, 1.5);
    const vane = new THREE.Mesh(vaneGeo, this.boomMat);
    vane.position.set(0, -9, 15);
    this.boom.add(vane);

    this.boom.position.set(0, -2, 24);
    this.group.add(this.boom);
  }

  startSequence(playerGroup) {
    this.active = true;
    this.docked = false;
    this.group.visible = true;
    // Spawn ahead of player
    this.group.position.set(playerGroup.position.x, playerGroup.position.y + 18, playerGroup.position.z - 350);
  }

  update(dt, playerGroup) {
    if (!this.active) return;

    // Smoothly fly alongside player
    this.group.position.x += (playerGroup.position.x - this.group.position.x) * dt * 2.0;
    this.group.position.y += ((playerGroup.position.y + 18) - this.group.position.y) * dt * 2.0;
    this.group.position.z += 800 * dt; // Match cruising speed

    // Check if player is close to boom
    const boomTip = new THREE.Vector3(0, -11, 35).applyMatrix4(this.group.matrixWorld);
    const dist = playerGroup.position.distanceTo(boomTip);

    if (dist < 28 && !this.docked) {
      this.docked = true;
      return true; // Signal successful docking!
    }
    return false;
  }

  endSequence() {
    this.active = false;
    this.group.visible = false;
  }
}
