/* ============================================================
   AFTER BURNER CLIMAX - F-14 TOMCAT FIGHTER MODEL
   Dynamic Variable-Sweep Wings, Cockpit Interior, Vortex Trails
   ============================================================ */

import { createNavalCamoTexture, createCockpitInstrumentsTexture } from './textures.js';

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
      roughness: 0.35,
      metalness: 0.65
    });

    this.darkMat = new THREE.MeshStandardMaterial({
      color: 0x1f262e,
      roughness: 0.4,
      metalness: 0.8
    });

    this.nozzleMat = new THREE.MeshStandardMaterial({
      color: 0x141518,
      roughness: 0.25,
      metalness: 0.95
    });

    this.canopyMat = new THREE.MeshStandardMaterial({
      color: 0xffaa22,
      roughness: 0.08,
      metalness: 0.92,
      transparent: true,
      opacity: 0.78
    });

    this.pilotHelmetMat = new THREE.MeshStandardMaterial({ color: 0x224433, roughness: 0.3, metalness: 0.5 });
    this.visorMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });

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
      cockpitInterior: null,
      currentSweep: 0.22,
      vortexTrails: []
    };

    this.build();
    this.initVortexTrails();
  }

  build() {
    // 1. Nose & Radome
    const noseGeo = new THREE.ConeGeometry(1.4, 9.5, 16);
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, this.skinMat);
    nose.position.set(0, 0, -8.5);
    this.group.add(nose);

    // Pitot Probe
    const pitotGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.8, 6);
    pitotGeo.rotateX(Math.PI / 2);
    const pitot = new THREE.Mesh(pitotGeo, this.darkMat);
    pitot.position.set(0, 0, -14.5);
    this.group.add(pitot);

    // 2. Center Fuselage & Pancake Tunnel
    const bodyGeo = new THREE.BoxGeometry(4.8, 1.6, 12);
    const body = new THREE.Mesh(bodyGeo, this.skinMat);
    body.position.set(0, 0, -0.5);
    this.group.add(body);

    // Blended Wing Glove Fairings (LERX)
    const gloveLGeo = new THREE.BoxGeometry(1.6, 0.5, 8);
    const gloveL = new THREE.Mesh(gloveLGeo, this.skinMat);
    gloveL.position.set(-2.8, 0.1, -2.5);
    this.group.add(gloveL);

    const gloveR = gloveL.clone();
    gloveR.position.x = 2.8;
    this.group.add(gloveR);

    // 3. Underslung Dual Rectangular Air Intakes
    const intakeGeo = new THREE.BoxGeometry(1.5, 1.2, 7);
    const leftIntake = new THREE.Mesh(intakeGeo, this.darkMat);
    leftIntake.position.set(-1.8, -0.9, -1.8);
    this.group.add(leftIntake);

    const rightIntake = leftIntake.clone();
    rightIntake.position.x = 1.8;
    this.group.add(rightIntake);

    // 4. Tandem Cockpit & Pilots
    const canopyGeo = new THREE.SphereGeometry(1.15, 20, 16);
    canopyGeo.scale(0.85, 1.15, 3.8);
    const canopy = new THREE.Mesh(canopyGeo, this.canopyMat);
    canopy.position.set(0, 1.15, -3.2);
    this.group.add(canopy);

    // Canopy Frame
    const frameGeo = new THREE.TorusGeometry(0.95, 0.06, 8, 16, Math.PI);
    frameGeo.rotateY(Math.PI / 2);
    const frame = new THREE.Mesh(frameGeo, this.darkMat);
    frame.position.set(0, 0.8, -3.2);
    this.group.add(frame);

    // Pilots
    const pilotHead = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), this.pilotHelmetMat);
    pilotHead.position.set(0, 0.82, -4.2);
    const visorF = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.15), this.visorMat);
    visorF.position.set(0, 0.86, -4.5);
    this.group.add(pilotHead); this.group.add(visorF);

    const rioHead = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 10), this.pilotHelmetMat);
    rioHead.position.set(0, 0.95, -2.2);
    const visorB = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.15), this.visorMat);
    visorB.position.set(0, 0.99, -2.5);
    this.group.add(rioHead); this.group.add(visorB);

    // 5. Cockpit Interior Panel (Visible in 1st Person Mode)
    const panelGeo = new THREE.PlaneGeometry(2.2, 1.1);
    const panelMat = new THREE.MeshBasicMaterial({ map: this.cockpitTex, transparent: true });
    const cockpitPanel = new THREE.Mesh(panelGeo, panelMat);
    cockpitPanel.position.set(0, 0.6, -4.9);
    cockpitPanel.rotation.x = -0.35;
    this.group.add(cockpitPanel);
    this.parts.cockpitInterior = cockpitPanel;

    // 6. Twin Engine Nacelles & Ventral Fins
    const nacelleGeo = new THREE.CylinderGeometry(1.18, 1.12, 10, 16);
    nacelleGeo.rotateX(Math.PI / 2);
    const leftNacelle = new THREE.Mesh(nacelleGeo, this.skinMat);
    leftNacelle.position.set(-2.2, -0.2, 4.2);
    this.group.add(leftNacelle);

    const rightNacelle = leftNacelle.clone();
    rightNacelle.position.x = 2.2;
    this.group.add(rightNacelle);

    const vFinGeo = new THREE.BoxGeometry(0.18, 1.4, 4);
    const leftVFin = new THREE.Mesh(vFinGeo, this.darkMat);
    leftVFin.position.set(-2.2, -1.2, 5.5);
    leftVFin.rotation.z = -0.15;
    this.group.add(leftVFin);

    const rightVFin = leftVFin.clone();
    rightVFin.position.x = 2.2; rightVFin.rotation.z = 0.15;
    this.group.add(rightVFin);

    // 7. Titanium Exhaust Nozzles & Multistage Afterburners
    const nozzleGeo = new THREE.CylinderGeometry(1.22, 1.25, 2.2, 16);
    nozzleGeo.rotateX(Math.PI / 2);
    const leftNozzle = new THREE.Mesh(nozzleGeo, this.nozzleMat);
    leftNozzle.position.set(-2.2, -0.2, 9.8);
    this.group.add(leftNozzle);

    const rightNozzle = leftNozzle.clone();
    rightNozzle.position.x = 2.2;
    this.group.add(rightNozzle);

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

    // 8. DYNAMIC VARIABLE-SWEEP MAIN WINGS (可變後掠翼組件)
    const leftPivot = new THREE.Group();
    leftPivot.position.set(-2.3, 0.2, 0.5);
    this.group.add(leftPivot);

    const wingBladeGeo = new THREE.BoxGeometry(11, 0.26, 4.2);
    wingBladeGeo.translate(-5.5, 0, 0.8);
    const leftBlade = new THREE.Mesh(wingBladeGeo, this.skinMat);
    leftPivot.add(leftBlade);

    // Wingtip Missile Rail + AIM-9 Sidewinder
    const mRailGeo = new THREE.BoxGeometry(0.3, 0.3, 4.5);
    const leftRail = new THREE.Mesh(mRailGeo, this.darkMat);
    leftRail.position.set(-11.1, 0, 0.8);
    leftPivot.add(leftRail);

    const sideWinderGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.8, 8);
    sideWinderGeo.rotateX(Math.PI / 2);
    const leftMissile = new THREE.Mesh(sideWinderGeo, this.skinMat);
    leftMissile.position.set(-11.1, -0.25, 0.8);
    leftPivot.add(leftMissile);

    this.parts.leftWing = leftPivot;

    const rightPivot = new THREE.Group();
    rightPivot.position.set(2.3, 0.2, 0.5);
    this.group.add(rightPivot);

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

    this.parts.rightWing = rightPivot;

    // 9. All-Moving Horizontal Stabilators (全動平尾)
    const stabGeo = new THREE.BoxGeometry(4.6, 0.18, 3.8);
    const leftStab = new THREE.Mesh(stabGeo, this.skinMat);
    leftStab.position.set(-3.6, -0.1, 9.2);
    this.group.add(leftStab);
    this.parts.leftStab = leftStab;

    const rightStab = leftStab.clone();
    rightStab.position.x = 3.6;
    this.group.add(rightStab);
    this.parts.rightStab = rightStab;

    // 10. Twin Cant-Angle Vertical Stabilizers
    const finGeo = new THREE.BoxGeometry(0.24, 4.8, 5.2);
    const leftFin = new THREE.Mesh(finGeo, this.skinMat);
    leftFin.position.set(-2.4, 2.3, 7.2);
    leftFin.rotation.z = 0.12;
    this.group.add(leftFin);

    const rightFin = leftFin.clone();
    rightFin.position.x = 2.4; rightFin.rotation.z = -0.12;
    this.group.add(rightFin);
  }

  initVortexTrails() {
    // 3D Contrail Ribbon Points for Left & Right Wingtips
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

    // 3. Multistage Afterburner Exhaust Flames & Shock Diamonds
    const flameScale = (state.isAfterburner ? 2.5 : 1.1) + Math.sin(now * 0.05) * 0.25;
    const coreScale = (state.isAfterburner ? 1.9 : 0.9) + Math.sin(now * 0.08) * 0.15;

    if (this.parts.leftFlame) {
      this.parts.leftFlame.scale.set(1, flameScale, 1);
      this.parts.rightFlame.scale.set(1, flameScale, 1);
      this.parts.leftFlame.material.color.setHex(state.isAfterburner ? 0xff5500 : 0x00f0ff);
      this.parts.rightFlame.material.color.setHex(state.isAfterburner ? 0xff5500 : 0x00f0ff);

      this.parts.leftCoreFlame.scale.set(1, coreScale, 1);
      this.parts.rightCoreFlame.scale.set(1, coreScale, 1);
      this.parts.leftCoreFlame.material.color.setHex(state.isAfterburner ? 0xffeeaa : 0xffffff);
      this.parts.rightCoreFlame.material.color.setHex(state.isAfterburner ? 0xffeeaa : 0xffffff);
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
