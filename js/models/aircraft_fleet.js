/* ============================================================
   AFTER BURNER CLIMAX - PLAYABLE FIGHTER FLEET BUILDER
   High-Fidelity 3D Models: F-15E Strike Eagle, F/A-18E Hornet, A-10C Warthog
   Features: PBR Textures, Slime Lights, Ejection Seats & Shock Diamonds
   ============================================================ */

import { createNavalCamoTexture, createCockpitInstrumentsTexture } from './textures.js';
import { modelManager } from './model_loader.js';

export class AircraftFleetBuilder {
  constructor() {
    this.skinTex = createNavalCamoTexture();
    this.cockpitTex = createCockpitInstrumentsTexture();

    this.navyMat = new THREE.MeshStandardMaterial({ map: this.skinTex, roughness: 0.32, metalness: 0.68 });
    this.f15GrayMat = new THREE.MeshStandardMaterial({ map: this.skinTex, color: 0xb5c0cb, roughness: 0.35, metalness: 0.65 });
    this.f18NavyMat = new THREE.MeshStandardMaterial({ map: this.skinTex, color: 0x9fb3c6, roughness: 0.32, metalness: 0.70 });
    this.a10GreenMat = new THREE.MeshStandardMaterial({ color: 0x3d4f3b, roughness: 0.65, metalness: 0.25 });
    this.darkMat = new THREE.MeshStandardMaterial({ color: 0x161a20, roughness: 0.35, metalness: 0.85 });
    this.titaniumNozzleMat = new THREE.MeshStandardMaterial({ color: 0x22262d, roughness: 0.2, metalness: 0.95 });
    this.canopyMat = new THREE.MeshStandardMaterial({ color: 0xffaa22, roughness: 0.08, metalness: 0.92, transparent: true, opacity: 0.78 });
    this.pilotHelmetMat = new THREE.MeshStandardMaterial({ color: 0x243b2a, roughness: 0.3, metalness: 0.5 });
    this.visorMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    this.slimeLightMat = new THREE.MeshBasicMaterial({ color: 0x44ff44 });
    this.seatMat = new THREE.MeshStandardMaterial({ color: 0x2d3a2f, roughness: 0.7, metalness: 0.2 });
    this.seatHandleMat = new THREE.MeshBasicMaterial({ color: 0xffbb00 });
    this.shockDiamondMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });
  }

  // --- 1. F-15E STRIKE EAGLE ---
  buildF15E() {
    if (modelManager && modelManager.hasModel('F15E')) {
      return modelManager.createEnhancedAircraft('F15E');
    }
    const group = new THREE.Group();
    const parts = { leftWing: null, rightWing: null, leftStab: null, rightStab: null, flames: [], shockDiamonds: [] };

    // Aerodynamic Nose & Long Radome
    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.5, 11, 20).rotateX(Math.PI / 2), this.f15GrayMat);
    nose.position.set(0, 0, -8.5);
    group.add(nose);

    // Pitot probe
    const pitot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.8, 8).rotateX(Math.PI / 2), this.darkMat);
    pitot.position.set(0, 0, -14.4);
    group.add(pitot);

    // Center Fuselage & Conformal Fuel Tanks (CFT)
    const body = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.8, 14), this.f15GrayMat);
    body.position.set(0, 0, 0);
    group.add(body);

    // Conformal Fuel Tanks (CFTs along engine nacelle shoulders)
    [-2.85, 2.85].forEach(ox => {
      const cft = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.45, 11), this.darkMat);
      cft.position.set(ox, -0.15, 0);
      group.add(cft);
    });

    // Tandem Cockpit with Martin-Baker Ejection Seats
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.2, 20, 16).scale(0.85, 1.1, 3.6), this.canopyMat);
    canopy.position.set(0, 1.2, -3.0);
    group.add(canopy);

    const seatGeo = new THREE.BoxGeometry(0.65, 1.1, 0.65);
    const handleGeo = new THREE.TorusGeometry(0.12, 0.03, 6, 12, Math.PI);
    handleGeo.rotateX(-Math.PI / 2);

    [-4.0, -2.0].forEach((zPos, idx) => {
      const seat = new THREE.Mesh(seatGeo, this.seatMat);
      seat.position.set(0, 0.6 + idx * 0.1, zPos);
      const handle = new THREE.Mesh(handleGeo, this.seatHandleMat);
      handle.position.set(0, 1.2 + idx * 0.1, zPos);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), this.pilotHelmetMat);
      head.position.set(0, 0.85 + idx * 0.1, zPos - 0.2);
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.15), this.visorMat);
      visor.position.set(0, 0.89 + idx * 0.1, zPos - 0.5);
      group.add(seat); group.add(handle); group.add(head); group.add(visor);
    });

    // Large Clipped Delta Main Wings with Camber
    const wings = new THREE.Mesh(new THREE.BoxGeometry(25, 0.35, 7.5), this.f15GrayMat);
    wings.position.set(0, 0.2, 2.0);
    group.add(wings);

    // Wingtip Slime Lights
    [-12.4, 12.4].forEach(ox => {
      const slime = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 1.4), this.slimeLightMat);
      slime.position.set(ox, 0.35, 2.0);
      group.add(slime);
    });

    // Twin Tall Straight Vertical Stabilizers (F-15 signature) & Slime Lights
    [-2.6, 2.6].forEach(ox => {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.24, 6.2, 5.0), this.f15GrayMat);
      fin.position.set(ox, 3.0, 7.0);
      group.add(fin);

      const finSlime = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.2), this.slimeLightMat);
      finSlime.position.set(ox + (ox > 0 ? 0.14 : -0.14), 4.2, 7.0);
      group.add(finSlime);
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

    // Twin F100 Turbofan Engines & Titanium Nozzles
    [-1.9, 1.9].forEach(ox => {
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.28, 2.6, 20).rotateX(Math.PI / 2), this.titaniumNozzleMat);
      nozzle.position.set(ox, -0.2, 9.4);
      group.add(nozzle);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(1.2, 15, 16).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.88 }));
      flame.position.set(ox, -0.2, 16);
      group.add(flame);
      parts.flames.push(flame);

      // Shock Diamonds
      const diamondGeo = new THREE.OctahedronGeometry(0.38, 0);
      for (let d = 0; d < 3; d++) {
        const dia = new THREE.Mesh(diamondGeo, this.shockDiamondMat);
        dia.position.set(ox, -0.2, 11.5 + d * 2.8);
        group.add(dia);
        parts.shockDiamonds.push(dia);
      }
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
      const diamondScale = state.isAfterburner ? (1.0 + Math.sin(now * 0.1) * 0.3) : 0.4;
      parts.shockDiamonds.forEach(sd => {
        sd.scale.set(diamondScale, diamondScale, diamondScale);
        sd.visible = state.isAfterburner || state.isClimax;
      });
    };

    return { group, parts, update };
  }

  // --- 2. F/A-18E SUPER HORNET ---
  buildFA18E() {
    if (modelManager && modelManager.hasModel('FA18E')) {
      return modelManager.createEnhancedAircraft('FA18E');
    }
    const group = new THREE.Group();
    const parts = { leftWing: null, rightWing: null, leftStab: null, rightStab: null, flames: [], shockDiamonds: [] };

    // Pointed Aerodynamic Radome
    const nose = new THREE.Mesh(new THREE.ConeGeometry(1.35, 10, 20).rotateX(Math.PI / 2), this.f18NavyMat);
    nose.position.set(0, 0, -8.0);
    group.add(nose);

    // Blended Curved Leading Edge Extensions (LEX)
    const lex = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.36, 8.2), this.f18NavyMat);
    lex.position.set(0, 0.1, -2.5);
    group.add(lex);

    // Center Fuselage & Rectangular Canted Air Intakes
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.6, 12), this.f18NavyMat);
    body.position.set(0, 0, 0);
    group.add(body);

    // Cockpit & Ejection Seat
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.15, 20, 16).scale(0.85, 1.15, 3.4), this.canopyMat);
    canopy.position.set(0, 1.1, -2.8);
    group.add(canopy);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.1, 0.65), this.seatMat);
    seat.position.set(0, 0.55, -3.2);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 6, 12, Math.PI).rotateX(-Math.PI / 2), this.seatHandleMat);
    handle.position.set(0, 1.15, -3.2);
    const pilotHead = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), this.pilotHelmetMat);
    pilotHead.position.set(0, 0.82, -3.4);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.15), this.visorMat);
    visor.position.set(0, 0.86, -3.7);
    group.add(seat); group.add(handle); group.add(pilotHead); group.add(visor);

    // Swept Main Wings with Wingtip AIM-9X Rails & Slime Lights
    const wings = new THREE.Mesh(new THREE.BoxGeometry(22, 0.3, 6.0), this.f18NavyMat);
    wings.position.set(0, 0.1, 2.2);
    group.add(wings);

    // Wingtip AIM-9X Sidewinder Rails
    [-11.1, 11.1].forEach(ox => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 4.2), this.darkMat);
      rail.position.set(ox, 0.1, 2.2);
      const missile = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.6, 8).rotateX(Math.PI / 2), this.f18NavyMat);
      missile.position.set(ox, -0.15, 2.2);
      const slime = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 1.2), this.slimeLightMat);
      slime.position.set(ox + (ox > 0 ? 0.16 : -0.16), 0.25, 2.2);
      group.add(rail); group.add(missile); group.add(slime);
    });

    // Outward-Canted Twin Vertical Tails (20° Cant Angle - F/A-18 signature)
    const finGeo = new THREE.BoxGeometry(0.22, 5.2, 4.6);
    const finL = new THREE.Mesh(finGeo, this.f18NavyMat);
    finL.position.set(-2.5, 2.5, 6.5);
    finL.rotation.z = 0.35; // 20 deg cant
    group.add(finL);

    const finR = finL.clone();
    finR.position.x = 2.5; finR.rotation.z = -0.35;
    group.add(finR);

    // Fin Slime Lights
    const finSlimeL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.2), this.slimeLightMat);
    finSlimeL.position.set(-3.2, 3.4, 6.5);
    finSlimeL.rotation.z = 0.35;
    group.add(finSlimeL);

    const finSlimeR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.2), this.slimeLightMat);
    finSlimeR.position.set(3.2, 3.4, 6.5);
    finSlimeR.rotation.z = -0.35;
    group.add(finSlimeR);

    // Stabilators
    const leftStab = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.2, 3.6), this.f18NavyMat);
    leftStab.position.set(-3.2, -0.2, 8.5);
    group.add(leftStab);
    parts.leftStab = leftStab;

    const rightStab = leftStab.clone();
    rightStab.position.x = 3.2;
    group.add(rightStab);
    parts.rightStab = rightStab;

    // Twin F414 Engines & Titanium Nozzles
    [-1.7, 1.7].forEach(ox => {
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.15, 2.4, 20).rotateX(Math.PI / 2), this.titaniumNozzleMat);
      nozzle.position.set(ox, -0.2, 9.0);
      group.add(nozzle);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(1.1, 14, 16).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.88 }));
      flame.position.set(ox, -0.2, 15);
      group.add(flame);
      parts.flames.push(flame);

      // Shock Diamonds
      const diamondGeo = new THREE.OctahedronGeometry(0.35, 0);
      for (let d = 0; d < 3; d++) {
        const dia = new THREE.Mesh(diamondGeo, this.shockDiamondMat);
        dia.position.set(ox, -0.2, 11.2 + d * 2.6);
        group.add(dia);
        parts.shockDiamonds.push(dia);
      }
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
      const diamondScale = state.isAfterburner ? (1.0 + Math.sin(now * 0.1) * 0.3) : 0.4;
      parts.shockDiamonds.forEach(sd => {
        sd.scale.set(diamondScale, diamondScale, diamondScale);
        sd.visible = state.isAfterburner || state.isClimax;
      });
    };

    return { group, parts, update };
  }

  // --- 3. A-10C WARTHOG ---
  buildA10C() {
    if (modelManager && modelManager.hasModel('A10C')) {
      return modelManager.createEnhancedAircraft('A10C');
    }
    const group = new THREE.Group();
    const parts = { leftWing: null, rightWing: null, leftStab: null, rightStab: null, flames: [] };

    // Heavy Blunt Nose with protruding GAU-8/A 30mm Gatling Cannon
    const nose = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 9, 16).rotateX(Math.PI / 2), this.a10GreenMat);
    nose.position.set(0, 0, -7.0);
    group.add(nose);

    // 7-Barrel GAU-8/A Avenger Gatling Cannon Muzzle!
    const gatlingMuzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 2.8, 12).rotateX(Math.PI / 2), this.darkMat);
    gatlingMuzzle.position.set(-0.35, -0.4, -12.0); // Offset to port side just like real A-10!
    group.add(gatlingMuzzle);

    // Armored Cockpit "Titanium Bathtub"
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 12).scale(0.85, 1.1, 2.5), this.canopyMat);
    canopy.position.set(0, 1.2, -3.2);
    group.add(canopy);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.1, 0.65), this.seatMat);
    seat.position.set(0, 0.55, -3.2);
    const pilotHead = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), this.pilotHelmetMat);
    pilotHead.position.set(0, 0.82, -3.3);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.15), this.visorMat);
    visor.position.set(0, 0.86, -3.6);
    group.add(seat); group.add(pilotHead); group.add(visor);

    // Fuselage
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.2, 13), this.a10GreenMat);
    body.position.set(0, 0, 0);
    group.add(body);

    // Straight Unswept High-Lift Wings (A-10 signature) & Slime Lights
    const wings = new THREE.Mesh(new THREE.BoxGeometry(28, 0.38, 6.5), this.a10GreenMat);
    wings.position.set(0, -0.2, 1.5);
    group.add(wings);

    // Wingtip Slime Lights
    [-13.9, 13.9].forEach(ox => {
      const slime = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 1.4), this.slimeLightMat);
      slime.position.set(ox, -0.05, 1.5);
      group.add(slime);
    });

    // Twin High-Mounted TF34 Turbofan Pods Above Fuselage (Signature A-10 feature!)
    [-2.4, 2.4].forEach(ox => {
      const enginePod = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.5, 9, 18).rotateX(Math.PI / 2), this.a10GreenMat);
      enginePod.position.set(ox, 2.4, 3.5);
      group.add(enginePod);

      // Intake Fan Spinner
      const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.2, 12).rotateX(Math.PI / 2), this.darkMat);
      spinner.position.set(ox, 2.4, -1.2);
      group.add(spinner);

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

      const finSlime = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.2), this.slimeLightMat);
      finSlime.position.set(ox + (ox > 0 ? 0.12 : -0.12), 2.2, 9.5);
      group.add(finSlime);
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
