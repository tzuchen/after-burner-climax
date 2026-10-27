/* ============================================================
   AFTER BURNER CLIMAX - PLAYABLE FIGHTER FLEET BUILDER
   F-14D Tomcat, F-15E Strike Eagle, F/A-18E Hornet, A-10C Warthog
   ============================================================ */

import { createNavalCamoTexture, createCockpitInstrumentsTexture } from './textures.js';

export class AircraftFleetBuilder {
  constructor() {
    this.skinTex = createNavalCamoTexture();
    this.cockpitTex = createCockpitInstrumentsTexture();

    this.navyMat = new THREE.MeshStandardMaterial({ map: this.skinTex, roughness: 0.35, metalness: 0.65 });
    this.f15GrayMat = new THREE.MeshStandardMaterial({ color: 0x485868, roughness: 0.4, metalness: 0.6 });
    this.f18NavyMat = new THREE.MeshStandardMaterial({ color: 0x5a6a7c, roughness: 0.35, metalness: 0.7 });
    this.a10GreenMat = new THREE.MeshStandardMaterial({ color: 0x364834, roughness: 0.6, metalness: 0.3 });
    this.darkMat = new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.3, metalness: 0.85 });
    this.canopyMat = new THREE.MeshStandardMaterial({ color: 0xffaa22, roughness: 0.08, metalness: 0.92, transparent: true, opacity: 0.78 });
    this.pilotHelmetMat = new THREE.MeshStandardMaterial({ color: 0x224433, roughness: 0.3, metalness: 0.5 });
    this.visorMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
  }

  // --- 1. F-15E STRIKE EAGLE ---
  buildF15E() {
    const group = new THREE.Group();
    const parts = { leftWing: null, rightWing: null, leftStab: null, rightStab: null, flames: [] };

    // Nose & Radome
    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.5, 11, 16).rotateX(Math.PI / 2), this.f15GrayMat);
    nose.position.set(0, 0, -8.5);
    group.add(nose);

    // Center Fuselage & Conformal Fuel Tanks (CFT)
    const body = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.8, 14), this.f15GrayMat);
    body.position.set(0, 0, 0);
    group.add(body);

    // Conformal Fuel Tanks on left & right
    [-2.8, 2.8].forEach(ox => {
      const cft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 10), this.darkMat);
      cft.position.set(ox, -0.2, 0);
      group.add(cft);
    });

    // Tandem Canopy
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 12).scale(0.85, 1.1, 3.6), this.canopyMat);
    canopy.position.set(0, 1.2, -3.0);
    group.add(canopy);

    // Large Clipped Delta Main Wings
    const wings = new THREE.Mesh(new THREE.BoxGeometry(25, 0.35, 7.5), this.f15GrayMat);
    wings.position.set(0, 0.2, 2.0);
    group.add(wings);

    // Twin Straight Tall Vertical Stabilizers (F-15 signature)
    [-2.6, 2.6].forEach(ox => {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.24, 6.2, 5.0), this.f15GrayMat);
      fin.position.set(ox, 3.0, 7.0);
      group.add(fin);
    });

    // Stabilators
    const leftStab = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.2, 4.0), this.f15GrayMat);
    leftStab.position.set(-3.6, -0.2, 8.8);
    group.add(leftStab);
    parts.leftStab = leftStab;

    const rightStab = leftStab.clone();
    rightStab.position.x = 3.6;
    group.add(rightStab);
    parts.rightStab = rightStab;

    // Twin Engines & Afterburners
    [-1.9, 1.9].forEach(ox => {
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.28, 2.5, 16).rotateX(Math.PI / 2), this.darkMat);
      nozzle.position.set(ox, -0.2, 9.2);
      group.add(nozzle);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(1.2, 15, 16).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.88 }));
      flame.position.set(ox, -0.2, 16);
      group.add(flame);
      parts.flames.push(flame);
    });

    const update = (dt, state, targetPitch, now) => {
      if (parts.leftStab && parts.rightStab) {
        parts.leftStab.rotation.x = -targetPitch * 1.8;
        parts.rightStab.rotation.x = -targetPitch * 1.8;
      }
      const flameScale = (state.isAfterburner ? 2.5 : 1.1) + Math.sin(now * 0.05) * 0.2;
      parts.flames.forEach(f => {
        f.scale.set(1, flameScale, 1);
        if (f.material && f.material.color) {
          f.material.color.setHex(state.isAfterburner ? 0xff5500 : 0x00f0ff);
        }
      });
    };

    return { group, parts, update };
  }

  // --- 2. F/A-18E SUPER HORNET ---
  buildFA18E() {
    const group = new THREE.Group();
    const parts = { leftWing: null, rightWing: null, leftStab: null, rightStab: null, flames: [] };

    // Pointed Nose
    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.35, 10, 16).rotateX(Math.PI / 2), this.f18NavyMat);
    nose.position.set(0, 0, -8.0);
    group.add(nose);

    // Blended Curved Leading Edge Extensions (LEX)
    const lex = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.35, 8), this.f18NavyMat);
    lex.position.set(0, 0.1, -2.5);
    group.add(lex);

    // Center Fuselage & Rectangular Air Intakes
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.6, 12), this.f18NavyMat);
    body.position.set(0, 0, 0);
    group.add(body);

    // Canopy
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.15, 16, 12).scale(0.85, 1.15, 3.4), this.canopyMat);
    canopy.position.set(0, 1.1, -2.8);
    group.add(canopy);

    // Swept Main Wings with Wingtip AIM-9X Rails
    const wings = new THREE.Mesh(new THREE.BoxGeometry(22, 0.3, 6.0), this.f18NavyMat);
    wings.position.set(0, 0.1, 2.2);
    group.add(wings);

    // Outward-Canted Twin Vertical Tails (20° Cant Angle - F/A-18 signature)
    const finGeo = new THREE.BoxGeometry(0.22, 5.2, 4.6);
    const finL = new THREE.Mesh(finGeo, this.f18NavyMat);
    finL.position.set(-2.5, 2.5, 6.5);
    finL.rotation.z = 0.35; // 20 deg cant
    group.add(finL);

    const finR = finL.clone();
    finR.position.x = 2.5; finR.rotation.z = -0.35;
    group.add(finR);

    // Stabilators
    const leftStab = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.2, 3.6), this.f18NavyMat);
    leftStab.position.set(-3.2, -0.2, 8.5);
    group.add(leftStab);
    parts.leftStab = leftStab;

    const rightStab = leftStab.clone();
    rightStab.position.x = 3.2;
    group.add(rightStab);
    parts.rightStab = rightStab;

    // Twin Engines
    [-1.7, 1.7].forEach(ox => {
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.15, 2.2, 16).rotateX(Math.PI / 2), this.darkMat);
      nozzle.position.set(ox, -0.2, 8.8);
      group.add(nozzle);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(1.1, 14, 16).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.88 }));
      flame.position.set(ox, -0.2, 15);
      group.add(flame);
      parts.flames.push(flame);
    });

    const update = (dt, state, targetPitch, now) => {
      if (parts.leftStab && parts.rightStab) {
        parts.leftStab.rotation.x = -targetPitch * 1.8;
        parts.rightStab.rotation.x = -targetPitch * 1.8;
      }
      const flameScale = (state.isAfterburner ? 2.4 : 1.1) + Math.sin(now * 0.05) * 0.2;
      parts.flames.forEach(f => {
        f.scale.set(1, flameScale, 1);
        if (f.material && f.material.color) {
          f.material.color.setHex(state.isAfterburner ? 0xff5500 : 0x00f0ff);
        }
      });
    };

    return { group, parts, update };
  }

  // --- 3. A-10C WARTHOG ---
  buildA10C() {
    const group = new THREE.Group();
    const parts = { leftWing: null, rightWing: null, leftStab: null, rightStab: null, flames: [] };

    // Heavy Blunt Nose with protruding GAU-8/A 30mm Gatling Cannon
    const nose = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 9, 14).rotateX(Math.PI / 2), this.a10GreenMat);
    nose.position.set(0, 0, -7.0);
    group.add(nose);

    // 7-Barrel GAU-8/A Avenger Gatling Cannon Muzzle!
    const gatlingMuzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.5, 8).rotateX(Math.PI / 2), this.darkMat);
    gatlingMuzzle.position.set(-0.35, -0.4, -12.0); // Offset to port side just like real A-10!
    group.add(gatlingMuzzle);

    // Armored Cockpit "Titanium Bathtub"
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.2, 14, 10).scale(0.85, 1.1, 2.5), this.canopyMat);
    canopy.position.set(0, 1.2, -3.2);
    group.add(canopy);

    // Fuselage
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.2, 13), this.a10GreenMat);
    body.position.set(0, 0, 0);
    group.add(body);

    // Straight Unswept High-Lift Wings (A-10 signature)
    const wings = new THREE.Mesh(new THREE.BoxGeometry(28, 0.38, 6.5), this.a10GreenMat);
    wings.position.set(0, -0.2, 1.5);
    group.add(wings);

    // Twin High-Mounted TF34 Turbofan Pods Above Fuselage (Signature A-10 feature!)
    [-2.4, 2.4].forEach(ox => {
      const enginePod = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.5, 9, 16).rotateX(Math.PI / 2), this.a10GreenMat);
      enginePod.position.set(ox, 2.4, 3.5);
      group.add(enginePod);

      const exhaust = new THREE.Mesh(new THREE.ConeGeometry(1.2, 10, 14).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.85 }));
      exhaust.position.set(ox, 2.4, 9.5);
      group.add(exhaust);
      parts.flames.push(exhaust);
    });

    // Horizontal Tail with Twin Vertical Endplate Fins (H-Tail)
    const hTail = new THREE.Mesh(new THREE.BoxGeometry(10, 0.25, 3.5), this.a10GreenMat);
    hTail.position.set(0, 0.5, 9.5);
    group.add(hTail);

    [-4.8, 4.8].forEach(ox => {
      const vFin = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.5, 3.8), this.a10GreenMat);
      vFin.position.set(ox, 1.6, 9.5);
      group.add(vFin);
    });

    const update = (dt, state, targetPitch, now) => {
      const flameScale = (state.isAfterburner ? 2.0 : 0.9) + Math.sin(now * 0.05) * 0.15;
      parts.flames.forEach(f => {
        f.scale.set(1, flameScale, 1);
        if (f.material && f.material.color) {
          f.material.color.setHex(state.isAfterburner ? 0xff6600 : 0xffaa00);
        }
      });
    };

    return { group, parts, update };
  }
}
