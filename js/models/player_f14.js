/* ============================================================
   AFTER BURNER CLIMAX - F-14 TOMCAT FIGHTER MODEL
   High-Fidelity Aerodynamics, Dynamic Variable-Sweep Wings,
   Tandem Martin-Baker Mk.14 Seats, Slime Lights & Shock Diamonds
   Features: Path A High-Detail 3D Polygonal Model with Procedural Fallback
   ============================================================ */

import { createNavalCamoTexture, createCockpitInstrumentsTexture } from './textures.js';
import { modelManager } from './model_loader.js';

export class PlayerF14 {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Textures & Materials
    this.skinTex = createNavalCamoTexture();
    this.cockpitTex = createCockpitInstrumentsTexture();

    this.skinMat = new THREE.MeshStandardMaterial({
      map: this.skinTex,
      roughness: 0.32,
      metalness: 0.68
    });

    this.darkMat = new THREE.MeshStandardMaterial({
      color: 0x1a1f26,
      roughness: 0.35,
      metalness: 0.85
    });

    this.titaniumNozzleMat = new THREE.MeshStandardMaterial({
      color: 0x22262d,
      roughness: 0.2,
      metalness: 0.95
    });

    this.canopyMat = new THREE.MeshStandardMaterial({
      color: 0xffaa22,
      roughness: 0.08,
      metalness: 0.92,
      transparent: true,
      opacity: 0.78
    });

    this.pilotHelmetMat = new THREE.MeshStandardMaterial({ color: 0x243b2a, roughness: 0.3, metalness: 0.5 });
    this.visorMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });

    // Luminescent Formation Slime Light Material (Radioactive Lime Green)
    this.slimeLightMat = new THREE.MeshBasicMaterial({ color: 0x44ff44 });

    // Ejection seat materials
    this.seatMat = new THREE.MeshStandardMaterial({ color: 0x2d3a2f, roughness: 0.7, metalness: 0.2 });
    this.seatHandleMat = new THREE.MeshBasicMaterial({ color: 0xffbb00 });

    // Supersonic Shock Diamond Material
    this.shockDiamondMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.92
    });

    // Components & Articulations
    this.parts = {
      leftWing: null,
      rightWing: null,
      leftStab: null,
      rightStab: null,
      leftRudder: null,
      rightRudder: null,
      leftFlame: null,
      rightFlame: null,
      leftCoreFlame: null,
      rightCoreFlame: null,
      leftShockDiamonds: [],
      rightShockDiamonds: [],
      cockpitInterior: null,
      currentSweep: 0.22,
      vortexTrails: []
    };

    this.proceduralBody = new THREE.Group();
    this.group.add(this.proceduralBody);
    this.gltfMesh = null;

    // Dynamic Exhaust Point Light (Illuminates rear airframe & twin stabilizers in firelight)
    this.exhaustLight = new THREE.PointLight(0xff5500, 2.8, 48);
    this.exhaustLight.position.set(0, -0.2, 10.5);
    this.group.add(this.exhaustLight);

    this.build();
    this.initVortexTrails();

    // Asynchronously swap in Path A authentic 3D Polygonal GLTF model
    if (modelManager) {
      modelManager.loadAll(() => {
        if (modelManager.hasModel('F14D') && !this.gltfMesh) {
          const mesh = modelManager.getModel('F14D');
          if (mesh) {
            this.proceduralBody.visible = false;
            this.group.add(mesh);
            this.gltfMesh = mesh;
          }
        }
      });
    }
  }

  build() {
    // 1. Aerodynamic Nose & Radome
    const noseGeo = new THREE.ConeGeometry(1.4, 9.8, 20);
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, this.skinMat);
    nose.position.set(0, 0, -8.6);
    this.proceduralBody.add(nose);

    // Pitot Probe (Long airspeed probe at tip of radome)
    const pitotGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.2, 8);
    pitotGeo.rotateX(Math.PI / 2);
    const pitot = new THREE.Mesh(pitotGeo, this.darkMat);
    pitot.position.set(0, 0, -14.8);
    this.proceduralBody.add(pitot);

    // F-14D Dual Chin Pod (TCS Optical Camera & IRST Sensor) Under Radome
    const chinPodGeo = new THREE.CylinderGeometry(0.35, 0.32, 2.6, 12);
    chinPodGeo.rotateX(Math.PI / 2);
    const chinPod = new THREE.Mesh(chinPodGeo, this.darkMat);
    chinPod.position.set(0, -1.0, -8.2);
    this.proceduralBody.add(chinPod);

    const chinSensorLens = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), this.visorMat);
    chinSensorLens.position.set(0, -1.0, -9.6);
    this.proceduralBody.add(chinSensorLens);

    // 2. Center Fuselage & Pancake Tunnel
    const bodyGeo = new THREE.BoxGeometry(4.8, 1.6, 12);
    const body = new THREE.Mesh(bodyGeo, this.skinMat);
    body.position.set(0, 0, -0.5);
    this.proceduralBody.add(body);

    // Blended Wing Glove Fairings (Leading-Edge Glove LERX)
    const gloveLGeo = new THREE.BoxGeometry(1.7, 0.5, 8.2);
    const gloveL = new THREE.Mesh(gloveLGeo, this.skinMat);
    gloveL.position.set(-2.8, 0.1, -2.5);
    this.proceduralBody.add(gloveL);

    const gloveR = gloveL.clone();
    gloveR.position.x = 2.8;
    this.proceduralBody.add(gloveR);

    // 3. Underslung Dual Rectangular Air Intakes with Internal Ramps
    const intakeGeo = new THREE.BoxGeometry(1.5, 1.25, 7.2);
    const leftIntake = new THREE.Mesh(intakeGeo, this.darkMat);
    leftIntake.position.set(-1.8, -0.9, -1.8);
    this.proceduralBody.add(leftIntake);

    const rightIntake = leftIntake.clone();
    rightIntake.position.x = 1.8;
    this.proceduralBody.add(rightIntake);

    // 4. Belly Pallets (4x Semi-Submerged AIM-54 Phoenix Missile Pallets)
    const palletGeo = new THREE.BoxGeometry(0.85, 0.45, 6.0);
    [-0.9, 0.9].forEach(ox => {
      const pallet = new THREE.Mesh(palletGeo, this.darkMat);
      pallet.position.set(ox, -0.9, 0.5);
      this.proceduralBody.add(pallet);
    });

    // 5. Tandem Cockpit & Pilots (Martin-Baker Mk.14 Ejection Seats)
    const canopyGeo = new THREE.SphereGeometry(1.15, 20, 16);
    canopyGeo.scale(0.85, 1.15, 3.8);
    const canopy = new THREE.Mesh(canopyGeo, this.canopyMat);
    canopy.position.set(0, 1.15, -3.2);
    this.proceduralBody.add(canopy);

    // Canopy Windshield Arch Frame
    const frameGeo = new THREE.TorusGeometry(0.95, 0.06, 8, 20, Math.PI);
    frameGeo.rotateY(Math.PI / 2);
    const frame = new THREE.Mesh(frameGeo, this.darkMat);
    frame.position.set(0, 0.8, -3.2);
    this.proceduralBody.add(frame);

    // Ejection Seats (Pilot & RIO)
    const seatGeo = new THREE.BoxGeometry(0.65, 1.1, 0.65);
    const seatHandleGeo = new THREE.TorusGeometry(0.12, 0.03, 6, 12, Math.PI);
    seatHandleGeo.rotateX(-Math.PI / 2);

    // Pilot (Front Seat)
    const seatF = new THREE.Mesh(seatGeo, this.seatMat);
    seatF.position.set(0, 0.55, -4.0);
    const handleF = new THREE.Mesh(seatHandleGeo, this.seatHandleMat);
    handleF.position.set(0, 1.15, -4.0);
    const pilotHead = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), this.pilotHelmetMat);
    pilotHead.position.set(0, 0.82, -4.2);
    const visorF = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.15), this.visorMat);
    visorF.position.set(0, 0.86, -4.5);
    this.proceduralBody.add(seatF); this.proceduralBody.add(handleF); this.proceduralBody.add(pilotHead); this.proceduralBody.add(visorF);

    // RIO (Radar Intercept Officer - Rear Seat)
    const seatB = new THREE.Mesh(seatGeo, this.seatMat);
    seatB.position.set(0, 0.68, -2.0);
    const handleB = new THREE.Mesh(seatHandleGeo, this.seatHandleMat);
    handleB.position.set(0, 1.28, -2.0);
    const rioHead = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), this.pilotHelmetMat);
    rioHead.position.set(0, 0.95, -2.2);
    const visorB = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.15), this.visorMat);
    visorB.position.set(0, 0.99, -2.5);
    this.proceduralBody.add(seatB); this.proceduralBody.add(handleB); this.proceduralBody.add(rioHead); this.proceduralBody.add(visorB);

    // Cockpit Interior Panel (Visible in 1st Person / Cockpit View)
    const panelGeo = new THREE.PlaneGeometry(2.2, 1.1);
    const panelMat = new THREE.MeshBasicMaterial({ map: this.cockpitTex, transparent: true });
    const cockpitPanel = new THREE.Mesh(panelGeo, panelMat);
    cockpitPanel.position.set(0, 0.6, -4.9);
    cockpitPanel.rotation.x = -0.35;
    this.proceduralBody.add(cockpitPanel);
    this.parts.cockpitInterior = cockpitPanel;

    // 6. Twin Engine Nacelles & Ventral Strakes
    const nacelleGeo = new THREE.CylinderGeometry(1.18, 1.12, 10, 18);
    nacelleGeo.rotateX(Math.PI / 2);
    const leftNacelle = new THREE.Mesh(nacelleGeo, this.skinMat);
    leftNacelle.position.set(-2.2, -0.2, 4.2);
    this.proceduralBody.add(leftNacelle);

    const rightNacelle = leftNacelle.clone();
    rightNacelle.position.x = 2.2;
    this.proceduralBody.add(rightNacelle);

    const vFinGeo = new THREE.BoxGeometry(0.18, 1.4, 4.2);
    const leftVFin = new THREE.Mesh(vFinGeo, this.darkMat);
    leftVFin.position.set(-2.2, -1.2, 5.5);
    leftVFin.rotation.z = -0.15;
    this.proceduralBody.add(leftVFin);

    const rightVFin = leftVFin.clone();
    rightVFin.position.x = 2.2; rightVFin.rotation.z = 0.15;
    this.proceduralBody.add(rightVFin);

    // 7. Titanium Exhaust Nozzles & Variable Petals
    const nozzleGeo = new THREE.CylinderGeometry(1.22, 1.25, 2.4, 20);
    nozzleGeo.rotateX(Math.PI / 2);
    const leftNozzle = new THREE.Mesh(nozzleGeo, this.titaniumNozzleMat);
    leftNozzle.position.set(-2.2, -0.2, 9.8);
    this.proceduralBody.add(leftNozzle);

    const rightNozzle = leftNozzle.clone();
    rightNozzle.position.x = 2.2;
    this.proceduralBody.add(rightNozzle);

    // Multistage Afterburner Plumes (Kept in main group for VFX consistency)
    const flameOuterGeo = new THREE.ConeGeometry(1.15, 14, 16);
    flameOuterGeo.rotateX(-Math.PI / 2);
    const flameOuterMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.85 });

    const flameInnerGeo = new THREE.ConeGeometry(0.48, 8, 12);
    flameInnerGeo.rotateX(-Math.PI / 2);
    const flameInnerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });

    this.parts.leftFlame = new THREE.Mesh(flameOuterGeo, flameOuterMat);
    this.parts.leftFlame.position.set(-2.2, -0.2, 16);
    this.group.add(this.parts.leftFlame);

    this.parts.leftCoreFlame = new THREE.Mesh(flameInnerGeo, flameInnerMat);
    this.parts.leftCoreFlame.position.set(-2.2, -0.2, 13);
    this.group.add(this.parts.leftCoreFlame);

    this.parts.rightFlame = new THREE.Mesh(flameOuterGeo, flameOuterMat);
    this.parts.rightFlame.position.set(2.2, -0.2, 16);
    this.group.add(this.parts.rightFlame);

    this.parts.rightCoreFlame = new THREE.Mesh(flameInnerGeo, flameInnerMat);
    this.parts.rightCoreFlame.position.set(2.2, -0.2, 13);
    this.group.add(this.parts.rightCoreFlame);

    // Supersonic Shock Diamonds (Stacked Luminous Diamonds in Exhaust)
    const diamondGeo = new THREE.OctahedronGeometry(0.38, 0);
    for (let d = 0; d < 3; d++) {
      const zOffset = 11.8 + d * 2.8;

      const diamondL = new THREE.Mesh(diamondGeo, this.shockDiamondMat);
      diamondL.position.set(-2.2, -0.2, zOffset);
      this.group.add(diamondL);
      this.parts.leftShockDiamonds.push(diamondL);

      const diamondR = new THREE.Mesh(diamondGeo, this.shockDiamondMat);
      diamondR.position.set(2.2, -0.2, zOffset);
      this.group.add(diamondR);
      this.parts.rightShockDiamonds.push(diamondR);
    }

    // 8. DYNAMIC VARIABLE-SWEEP MAIN WINGS (20° Forward to 68° Oversweep)
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-2.3, 0.2, 0.5);
    this.proceduralBody.add(leftPivot);

    const wingBladeGeo = new THREE.BoxGeometry(11, 0.26, 4.2);
    wingBladeGeo.translate(-5.5, 0, 0.8);
    const leftBlade = new THREE.Mesh(wingBladeGeo, this.skinMat);
    leftPivot.add(leftBlade);

    // Wingtip Missile Rail + AIM-9M Sidewinder
    const mRailGeo = new THREE.BoxGeometry(0.3, 0.3, 4.5);
    const leftRail = new THREE.Mesh(mRailGeo, this.darkMat);
    leftRail.position.set(-11.1, 0, 0.8);
    leftPivot.add(leftRail);

    const sideWinderGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.8, 8);
    sideWinderGeo.rotateX(Math.PI / 2);
    const leftMissile = new THREE.Mesh(sideWinderGeo, this.skinMat);
    leftMissile.position.set(-11.1, -0.25, 0.8);
    leftPivot.add(leftMissile);

    // Wingtip Slime Light (Luminescent strip)
    const wingtipSlimeGeo = new THREE.BoxGeometry(0.1, 0.12, 1.4);
    const slimeL = new THREE.Mesh(wingtipSlimeGeo, this.slimeLightMat);
    slimeL.position.set(-11.15, 0.15, 0.8);
    leftPivot.add(slimeL);

    this.parts.leftWing = leftPivot;

    // Right Wing Assembly
    const rightPivot = new THREE.Group();
    rightPivot.position.set(2.3, 0.2, 0.5);
    this.proceduralBody.add(rightPivot);

    const rightBladeGeo = new THREE.BoxGeometry(11, 0.26, 4.2);
    rightBladeGeo.translate(5.5, 0, 0.8);
    const rightBlade = new THREE.Mesh(rightBladeGeo, this.skinMat);
    rightPivot.add(rightBlade);

    const rightRail = leftRail.clone();
    rightRail.position.x = 11.1;
    rightPivot.add(rightRail);

    const rightMissile = leftMissile.clone();
    rightMissile.position.x = 11.1;
    rightPivot.add(rightMissile);

    const slimeR = new THREE.Mesh(wingtipSlimeGeo, this.slimeLightMat);
    slimeR.position.set(11.15, 0.15, 0.8);
    rightPivot.add(slimeR);

    this.parts.rightWing = rightPivot;

    // 9. All-Moving Horizontal Stabilators
    const stabGeo = new THREE.BoxGeometry(4.6, 0.18, 3.8);
    const leftStab = new THREE.Mesh(stabGeo, this.skinMat);
    leftStab.position.set(-3.6, -0.1, 9.2);
    this.proceduralBody.add(leftStab);
    this.parts.leftStab = leftStab;

    const rightStab = leftStab.clone();
    rightStab.position.x = 3.6;
    this.proceduralBody.add(rightStab);
    this.parts.rightStab = rightStab;

    // 10. Twin Cant-Angle Vertical Stabilizers & Slime Lights
    const finGeo = new THREE.BoxGeometry(0.24, 4.8, 5.2);
    const leftFin = new THREE.Mesh(finGeo, this.skinMat);
    leftFin.position.set(-2.4, 2.3, 7.2);
    leftFin.rotation.z = 0.12;
    this.proceduralBody.add(leftFin);

    const finSlimeL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.2), this.slimeLightMat);
    finSlimeL.position.set(-2.55, 3.2, 7.2);
    finSlimeL.rotation.z = 0.12;
    this.proceduralBody.add(finSlimeL);

    const rightFin = leftFin.clone();
    rightFin.position.x = 2.4; rightFin.rotation.z = -0.12;
    this.proceduralBody.add(rightFin);

    const finSlimeR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.2), this.slimeLightMat);
    finSlimeR.position.set(2.55, 3.2, 7.2);
    finSlimeR.rotation.z = -0.12;
    this.proceduralBody.add(finSlimeR);
  }

  initVortexTrails() {
    const TRAIL_LENGTH = 16;
    this.trailPointsL = [];
    this.trailPointsR = [];

    const trailMat = new THREE.LineBasicMaterial({
      color: 0xccffff,
      transparent: true,
      opacity: 0.85,
      linewidth: 3
    });

    const geoL = new THREE.BufferGeometry();
    const geoR = new THREE.BufferGeometry();

    const posL = new Float32Array(TRAIL_LENGTH * 3);
    const posR = new Float32Array(TRAIL_LENGTH * 3);

    geoL.setAttribute('position', new THREE.BufferAttribute(posL, 3));
    geoR.setAttribute('position', new THREE.BufferAttribute(posR, 3));

    this.trailMeshL = new THREE.Line(geoL, trailMat);
    this.trailMeshR = new THREE.Line(geoR, trailMat);

    this.scene.add(this.trailMeshL);
    this.scene.add(this.trailMeshR);
  }

  update(dt, state, targetPitch, now) {
    // 1. Dynamic Variable-Sweep Wings (可變後掠翼)
    const targetSweep = (state.isAfterburner || state.isClimax || state.isRolling) ? 0.82 : 0.20;
    this.parts.currentSweep += (targetSweep - this.parts.currentSweep) * dt * 5.0;

    if (this.parts.leftWing) this.parts.leftWing.rotation.y = this.parts.currentSweep;
    if (this.parts.rightWing) this.parts.rightWing.rotation.y = -this.parts.currentSweep;

    // 2. All-Moving Stabilators Pitch (全動平尾)
    if (this.parts.leftStab) {
      this.parts.leftStab.rotation.x = -targetPitch * 1.8;
      this.parts.rightStab.rotation.x = -targetPitch * 1.8;
    }

    // 3. Multistage Afterburner Exhaust Flames, Firelight & Shock Diamonds
    if (this.exhaustLight) {
      const isAB = state.isAfterburner || state.isClimax;
      const baseIntensity = state.isClimax ? 5.5 : (state.isAfterburner ? 4.2 : 1.5);
      const flicker = 1.0 + Math.sin(now * 0.15) * 0.18 + (Math.random() - 0.5) * 0.15;
      this.exhaustLight.intensity = baseIntensity * flicker;
      this.exhaustLight.color.setHex(state.isClimax ? 0x00f0ff : (state.isAfterburner ? 0xff4400 : 0xff7722));
    }

    const flameScale = (state.isClimax ? 3.2 : (state.isAfterburner ? 2.8 : 1.2)) + Math.sin(now * 0.08) * 0.25;
    const coreScale = (state.isClimax ? 2.5 : (state.isAfterburner ? 2.2 : 0.95)) + Math.sin(now * 0.12) * 0.15;

    if (this.parts.leftFlame) {
      this.parts.leftFlame.scale.set(1, flameScale, 1);
      this.parts.rightFlame.scale.set(1, flameScale, 1);
      const outerColor = state.isClimax ? 0x2288ff : (state.isAfterburner ? 0xff4400 : 0x00d0ff);
      const coreColor = state.isClimax ? 0xffffff : (state.isAfterburner ? 0xffeeaa : 0xffffff);

      this.parts.leftFlame.material.color.setHex(outerColor);
      this.parts.rightFlame.material.color.setHex(outerColor);

      this.parts.leftCoreFlame.scale.set(1, coreScale, 1);
      this.parts.rightCoreFlame.scale.set(1, coreScale, 1);
      this.parts.leftCoreFlame.material.color.setHex(coreColor);
      this.parts.rightCoreFlame.material.color.setHex(coreColor);

      // Pulse Shock Diamonds when supersonic
      const diamondScale = state.isAfterburner ? (1.0 + Math.sin(now * 0.1) * 0.3) : 0.4;
      this.parts.leftShockDiamonds.forEach(sd => {
        sd.scale.set(diamondScale, diamondScale, diamondScale);
        sd.visible = state.isAfterburner || state.isClimax;
      });
      this.parts.rightShockDiamonds.forEach(sd => {
        sd.scale.set(diamondScale, diamondScale, diamondScale);
        sd.visible = state.isAfterburner || state.isClimax;
      });
    }

    // 4. Update Wingtip Contrail Vortices
    this.updateContrails(state);
  }

  updateContrails(state) {
    if (!this.parts.leftWing || !this.parts.rightWing) return;

    // Get current world positions of wingtips
    const tipL = new THREE.Vector3(-11, 0, 1).applyMatrix4(this.parts.leftWing.matrixWorld);
    const tipR = new THREE.Vector3(11, 0, 1).applyMatrix4(this.parts.rightWing.matrixWorld);

    this.trailPointsL.unshift(tipL);
    this.trailPointsR.unshift(tipR);

    if (this.trailPointsL.length > 16) {
      this.trailPointsL.pop();
      this.trailPointsR.pop();
    }

    const attrL = this.trailMeshL.geometry.attributes.position;
    const attrR = this.trailMeshR.geometry.attributes.position;

    const showTrails = state.isRolling || state.isAfterburner || Math.abs(state.bankAngle) > 0.4;
    this.trailMeshL.visible = showTrails;
    this.trailMeshR.visible = showTrails;

    for (let i = 0; i < this.trailPointsL.length; i++) {
      attrL.setXYZ(i, this.trailPointsL[i].x, this.trailPointsL[i].y, this.trailPointsL[i].z);
      attrR.setXYZ(i, this.trailPointsR[i].x, this.trailPointsR[i].y, this.trailPointsR[i].z);
    }
    attrL.needsUpdate = true;
    attrR.needsUpdate = true;
  }
}
