/* ============================================================
   AFTER BURNER CLIMAX - 3D HANGAR SHOWCASE & FLEET SELECTION
   Interactive Turntable, Stat Comparison, Aircraft Inspection
   ============================================================ */

import { CONFIG } from '../config.js';
import { state } from '../core/state.js';
import { AircraftFleetBuilder } from './aircraft_fleet.js';

export class HangarShowcase {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.builder = new AircraftFleetBuilder();
    this.fleetMeshes = new Map();
    this.currentAircraftIndex = 0;
    this.turntableAngle = 0;

    this.buildHangarEnvironment();
    this.buildFleet();

    this.group.visible = false;
  }

  buildHangarEnvironment() {
    // 1. Reflective Metallic Turntable Base
    const tableGeo = new THREE.CylinderGeometry(28, 30, 2.5, 32);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x1f242c,
      roughness: 0.25,
      metalness: 0.85
    });
    this.turntable = new THREE.Mesh(tableGeo, tableMat);
    this.turntable.position.set(0, -6, 0);
    this.group.add(this.turntable);

    // Glowing Neon Turntable Rim
    const ringGeo = new THREE.RingGeometry(27.5, 28.5, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, -4.7, 0);
    this.group.add(ring);

    // Hazard Stripes Circle
    const hazardGeo = new THREE.RingGeometry(24, 26, 32);
    hazardGeo.rotateX(-Math.PI / 2);
    const hazardMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, side: THREE.DoubleSide });
    const hazard = new THREE.Mesh(hazardGeo, hazardMat);
    hazard.position.set(0, -4.72, 0);
    this.group.add(hazard);

    // Hangar Overhead Spotlights
    this.spotLight = new THREE.SpotLight(0xffffff, 3.5, 120, Math.PI / 4, 0.4);
    this.spotLight.position.set(0, 45, 10);
    this.group.add(this.spotLight);
  }

  buildFleet() {
    // Build and cache each aircraft model
    const f15 = this.builder.buildF15E();
    f15.group.position.set(0, 0, 0);
    f15.group.visible = false;
    this.group.add(f15.group);
    this.fleetMeshes.set('F15E', f15);

    const f18 = this.builder.buildFA18E();
    f18.group.position.set(0, 0, 0);
    f18.group.visible = false;
    this.group.add(f18.group);
    this.fleetMeshes.set('FA18E', f18);

    const a10 = this.builder.buildA10C();
    a10.group.position.set(0, 0, 0);
    a10.group.visible = false;
    this.group.add(a10.group);
    this.fleetMeshes.set('A10C', a10);
  }

  show(f14Model) {
    this.group.visible = true;
    this.turntable.visible = true;
    if (this.spotLight) this.spotLight.visible = true;
    this.fleetMeshes.set('F14D', { group: f14Model.group, parts: f14Model.parts, update: (dt, s, p, now) => f14Model.update(dt, s, p, now) });
    this.updateSelection();
  }

  hide() {
    this.turntable.visible = false;
    if (this.spotLight) this.spotLight.visible = false;
    this.fleetMeshes.forEach((m, key) => {
      if (key !== state.selectedAircraftId) {
        m.group.visible = false;
      }
    });
  }

  nextAircraft() {
    this.currentAircraftIndex = (this.currentAircraftIndex + 1) % CONFIG.AIRCRAFT_FLEET.length;
    this.updateSelection();
  }

  prevAircraft() {
    this.currentAircraftIndex = (this.currentAircraftIndex - 1 + CONFIG.AIRCRAFT_FLEET.length) % CONFIG.AIRCRAFT_FLEET.length;
    this.updateSelection();
  }

  updateSelection() {
    const ac = CONFIG.AIRCRAFT_FLEET[this.currentAircraftIndex];
    state.selectAircraft(ac.id);

    // Toggle Visibility
    this.fleetMeshes.forEach((meshObj, key) => {
      meshObj.group.visible = (key === ac.id);
      if (key === ac.id) {
        meshObj.group.position.set(0, 0, 0);
        meshObj.group.rotation.set(0, 0, 0);
      }
    });

    // Update Hangar UI Card
    this.updateUI(ac);
  }

  updateUI(ac) {
    const titleEl = document.getElementById('hangar-plane-name');
    const catEl = document.getElementById('hangar-plane-cat');
    const descEl = document.getElementById('hangar-plane-desc');
    const spwEl = document.getElementById('hangar-spw-name');
    const barSpeed = document.getElementById('stat-bar-speed');
    const barArmor = document.getElementById('stat-bar-armor');
    const barMobility = document.getElementById('stat-bar-mobility');

    if (titleEl) titleEl.innerText = ac.name;
    if (catEl) catEl.innerText = ac.category;
    if (descEl) descEl.innerText = ac.description;
    if (spwEl) spwEl.innerText = `SPECIAL WEAPON: ${ac.specialWeapon.name}`;
    if (barSpeed) barSpeed.style.width = `${ac.stats.speed}%`;
    if (barArmor) barArmor.style.width = `${ac.stats.armor}%`;
    if (barMobility) barMobility.style.width = `${ac.stats.mobility}%`;
  }

  update(dt) {
    if (!this.group.visible) return;

    // Slow cinematic turntable rotation
    this.turntableAngle += dt * 0.45;
    this.turntable.rotation.y = this.turntableAngle;

    const currentMesh = this.fleetMeshes.get(CONFIG.AIRCRAFT_FLEET[this.currentAircraftIndex].id);
    if (currentMesh) {
      currentMesh.group.rotation.y = this.turntableAngle;
    }
  }
}
