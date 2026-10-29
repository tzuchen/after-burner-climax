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
  // 1. High-Quality 3D Polygonal Mesh (Path A) - Scaled 2.35x for arcade prominence
  if (modelManager && modelManager.hasModel('SU27')) {
    const eGroup = new THREE.Group();
    const model = modelManager.getModel('SU27');
    eGroup.add(model);

    // Dynamic Afterburner Firelight
    const abLight = new THREE.PointLight(0xff4400, 2.8, 60);
    abLight.position.set(0, -0.7, -20.5);
    eGroup.add(abLight);

    // Glowing Russian Aggressor Twin Afterburner Exhaust Plumes (2.35x arcade scaled)
    [-4.2, 4.2].forEach(ox => {
      // Outer fiery orange-red afterburner jet flame
      const outerFl = new THREE.Mesh(
        new THREE.ConeGeometry(2.0, 18, 16).rotateX(Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xff3b00, transparent: true, opacity: 0.92 })
      );
      outerFl.position.set(ox, -0.7, -22.0);
      eGroup.add(outerFl);

      // Inner white-hot / cyan shock core
      const innerFl = new THREE.Mesh(
        new THREE.ConeGeometry(0.95, 11, 12).rotateX(Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.98 })
      );
      innerFl.position.set(ox, -0.7, -18.5);
      eGroup.add(innerFl);

      // Supersonic shock diamond
      const diamond = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.7, 0),
        new THREE.MeshBasicMaterial({ color: 0x88eeff, transparent: true, opacity: 0.90 })
      );
      diamond.position.set(ox, -0.7, -19.5);
      eGroup.add(diamond);
    });

    return eGroup;
  }

  // 2. Procedural Fallback if GLTF not loaded (2.35x scaled arcade dimensions)
  const mats = getMaterials();
  const eGroup = new THREE.Group();

  // Dynamic Afterburner Point Light
  const abLight = new THREE.PointLight(0xff4400, 2.8, 60);
  abLight.position.set(0, -0.9, -21.0);
  eGroup.add(abLight);

  // Long Pointed Drooping Nose
  const noseGeo = new THREE.ConeGeometry(3.1, 21.6, 16).rotateX(-Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, mats.skinMat);
  nose.position.set(0, -0.4, 12.8);
  eGroup.add(nose);

  const tipGeo = new THREE.ConeGeometry(1.2, 5.2, 12).rotateX(-Math.PI / 2);
  const tip = new THREE.Mesh(tipGeo, mats.redMat);
  tip.position.set(0, -0.4, 22.2);
  eGroup.add(tip);

  const irst = new THREE.Mesh(new THREE.SphereGeometry(0.75, 10, 10), mats.darkMat);
  irst.position.set(0.8, 2.0, 8.2);
  eGroup.add(irst);

  // Cockpit Canopy
  const eCanopyGeo = new THREE.SphereGeometry(2.4, 18, 14).scale(0.75, 1.0, 3.2);
  const eCanopyMat = new THREE.MeshStandardMaterial({
    color: 0x203545, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85
  });
  const eCanopy = new THREE.Mesh(eCanopyGeo, eCanopyMat);
  eCanopy.position.set(0, 1.8, 4.2);
  eGroup.add(eCanopy);

  // Fuselage Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(9.8, 3.2, 25), mats.skinMat);
  body.position.set(0, 0, 0);
  eGroup.add(body);

  // Sting Tail Boom
  const sting = new THREE.Mesh(new THREE.ConeGeometry(2.0, 14.0, 12).rotateX(Math.PI / 2), mats.skinMat);
  sting.position.set(0, 0.5, -17.5);
  eGroup.add(sting);

  // High-Aspect Swept Wings (Wingspan ~50 units)
  const wings = new THREE.Mesh(new THREE.BoxGeometry(50, 0.65, 12.8), mats.skinMat);
  wings.position.set(0, 0, 1.2);
  eGroup.add(wings);

  // Dual Engines, Titanium Nozzles & Blazing Exhaust Plumes
  [-4.2, 4.2].forEach(ox => {
    const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.3, 21, 16).rotateX(Math.PI / 2), mats.skinMat);
    nacelle.position.set(ox, -0.9, -5.8);
    eGroup.add(nacelle);

    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.6, 4.2, 16).rotateX(Math.PI / 2), mats.titaniumMat);
    nozzle.position.set(ox, -0.9, -15.8);
    eGroup.add(nozzle);

    const outerExhaust = new THREE.Mesh(
      new THREE.ConeGeometry(2.0, 18, 16).rotateX(Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xff3b00, transparent: true, opacity: 0.92 })
    );
    outerExhaust.position.set(ox, -0.9, -22.5);
    eGroup.add(outerExhaust);

    const innerExhaust = new THREE.Mesh(
      new THREE.ConeGeometry(0.95, 11, 12).rotateX(Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.98 })
    );
    innerExhaust.position.set(ox, -0.9, -19.0);
    eGroup.add(innerExhaust);
  });

  // Twin Cantilevered Vertical Tail Fins
  const finGeo = new THREE.BoxGeometry(0.5, 9.8, 10.5);
  const finL = new THREE.Mesh(finGeo, mats.redMat);
  finL.position.set(-5.2, 4.6, -8.2);
  finL.rotation.z = -0.1;
  eGroup.add(finL);

  const finR = finL.clone();
  finR.position.x = 5.2;
  finR.rotation.z = 0.1;
  eGroup.add(finR);

  return eGroup;
}
