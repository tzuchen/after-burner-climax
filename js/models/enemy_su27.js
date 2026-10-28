/* ============================================================
   AFTER BURNER CLIMAX - SU-27 FLANKER ENEMY FIGHTER MODEL
   Authentic 3D Polygonal Mesh (Path A) with Procedural Fallback
   ============================================================ */

import { createAggressorCamoTexture } from './textures.js';
import { modelManager } from './model_loader.js';

let sharedEnemySkinMat = null;
let sharedEnemyRedMat = null;
let sharedDarkMat = null;
let sharedTitaniumMat = null;

function getMaterials() {
  if (!sharedEnemySkinMat) {
    const tex = createAggressorCamoTexture();
    sharedEnemySkinMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.65 });
    sharedEnemyRedMat = new THREE.MeshStandardMaterial({ color: 0xaa1424, roughness: 0.3, metalness: 0.7 });
    sharedDarkMat = new THREE.MeshStandardMaterial({ color: 0x181c22, roughness: 0.35, metalness: 0.85 });
    sharedTitaniumMat = new THREE.MeshStandardMaterial({ color: 0x22262d, roughness: 0.2, metalness: 0.95 });
  }
  return { skinMat: sharedEnemySkinMat, redMat: sharedEnemyRedMat, darkMat: sharedDarkMat, titaniumMat: sharedTitaniumMat };
}

export function buildSu27Mesh() {
  // 1. High-Quality 3D Polygonal Mesh (Path A)
  if (modelManager && modelManager.hasModel('SU27')) {
    const eGroup = new THREE.Group();
    const model = modelManager.getModel('SU27');
    eGroup.add(model);

    // Glowing Russian Afterburner Exhaust Plumes
    [-1.8, 1.8].forEach(ox => {
      const exhaust = new THREE.Mesh(
        new THREE.ConeGeometry(0.85, 6.5, 12).rotateX(Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xff3b00, transparent: true, opacity: 0.92 })
      );
      exhaust.position.set(ox, -0.4, -9.8);
      eGroup.add(exhaust);
    });

    return eGroup;
  }

  // 2. Procedural Fallback if GLTF not loaded
  const mats = getMaterials();
  const eGroup = new THREE.Group();

  // Long Pointed Drooping Nose
  const noseGeo = new THREE.ConeGeometry(1.35, 9.2, 16).rotateX(-Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, mats.skinMat);
  nose.position.set(0, -0.2, 5.5);
  eGroup.add(nose);

  const tipGeo = new THREE.ConeGeometry(0.5, 2.2, 12).rotateX(-Math.PI / 2);
  const tip = new THREE.Mesh(tipGeo, mats.redMat);
  tip.position.set(0, -0.2, 9.5);
  eGroup.add(tip);

  const irst = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 10), mats.darkMat);
  irst.position.set(0.35, 0.85, 3.5);
  eGroup.add(irst);

  // Cockpit Canopy
  const eCanopyGeo = new THREE.SphereGeometry(1.05, 18, 14).scale(0.75, 1.0, 3.2);
  const eCanopyMat = new THREE.MeshStandardMaterial({
    color: 0x203545, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85
  });
  const eCanopy = new THREE.Mesh(eCanopyGeo, eCanopyMat);
  eCanopy.position.set(0, 0.8, 1.8);
  eGroup.add(eCanopy);

  // Fuselage
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.4, 11), mats.skinMat);
  body.position.set(0, 0, 0);
  eGroup.add(body);

  // Sting Tail Boom
  const sting = new THREE.Mesh(new THREE.ConeGeometry(0.85, 6, 12).rotateX(Math.PI / 2), mats.skinMat);
  sting.position.set(0, 0.2, -7.5);
  eGroup.add(sting);

  // Wings
  const wings = new THREE.Mesh(new THREE.BoxGeometry(22, 0.28, 5.5), mats.skinMat);
  wings.position.set(0, 0, 0.5);
  eGroup.add(wings);

  // Dual Engines & Nozzles
  [-1.8, 1.8].forEach(ox => {
    const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.0, 9, 16).rotateX(Math.PI / 2), mats.skinMat);
    nacelle.position.set(ox, -0.4, -2.5);
    eGroup.add(nacelle);

    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.12, 1.8, 16).rotateX(Math.PI / 2), mats.titaniumMat);
    nozzle.position.set(ox, -0.4, -6.8);
    eGroup.add(nozzle);

    const exhaust = new THREE.Mesh(new THREE.ConeGeometry(0.85, 6.5, 12).rotateX(Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xff3b00, transparent: true, opacity: 0.92 }));
    exhaust.position.set(ox, -0.4, -9.8);
    eGroup.add(exhaust);
  });

  // Vertical Fins
  const finGeo = new THREE.BoxGeometry(0.22, 4.2, 4.5);
  const finL = new THREE.Mesh(finGeo, mats.redMat);
  finL.position.set(-2.2, 2.0, -3.5);
  finL.rotation.z = -0.1;
  eGroup.add(finL);

  const finR = finL.clone();
  finR.position.x = 2.2; finR.rotation.z = 0.1;
  eGroup.add(finR);

  return eGroup;
}
