/* ============================================================
   AFTER BURNER CLIMAX - SU-27 FLANKER ENEMY FIGHTER MODEL
   Russian Heavy Interceptor with Drooping Nose & Tail Sting
   Features: 1024x1024 Aggressor Splinter PBR, Titanium Nozzles
   ============================================================ */

import { createAggressorCamoTexture } from './textures.js';

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
  const mats = getMaterials();
  const eGroup = new THREE.Group();

  // 1. Long Pointed Drooping Nose
  const noseGeo = new THREE.ConeGeometry(1.35, 9.2, 16);
  noseGeo.rotateX(-Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, mats.skinMat);
  nose.position.set(0, -0.2, 5.5);
  eGroup.add(nose);

  // Red nosecone tip
  const tipGeo = new THREE.ConeGeometry(0.5, 2.2, 12);
  tipGeo.rotateX(-Math.PI / 2);
  const tip = new THREE.Mesh(tipGeo, mats.redMat);
  tip.position.set(0, -0.2, 9.5);
  eGroup.add(tip);

  // IRST Optical Ball (Infra-Red Search & Track sphere ahead of canopy)
  const irstGeo = new THREE.SphereGeometry(0.32, 10, 10);
  const irst = new THREE.Mesh(irstGeo, mats.darkMat);
  irst.position.set(0.35, 0.85, 3.5);
  eGroup.add(irst);

  // 2. Cockpit Canopy with Tint
  const eCanopyGeo = new THREE.SphereGeometry(1.05, 18, 14);
  eCanopyGeo.scale(0.75, 1.0, 3.2);
  const eCanopyMat = new THREE.MeshStandardMaterial({
    color: 0x203545,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.85
  });
  const eCanopy = new THREE.Mesh(eCanopyGeo, eCanopyMat);
  eCanopy.position.set(0, 0.8, 1.8);
  eGroup.add(eCanopy);

  // 3. Center Fuselage
  const bodyGeo = new THREE.BoxGeometry(4.2, 1.4, 11);
  const body = new THREE.Mesh(bodyGeo, mats.skinMat);
  body.position.set(0, 0, 0);
  eGroup.add(body);

  // 4. Central "Sting" Tail Boom (Signature Su-27 feature!)
  const stingGeo = new THREE.ConeGeometry(0.85, 6, 12);
  stingGeo.rotateX(Math.PI / 2);
  const sting = new THREE.Mesh(stingGeo, mats.skinMat);
  sting.position.set(0, 0.2, -7.5);
  eGroup.add(sting);

  // 5. Curved LERX & Swept Delta Wings
  const wingGeo = new THREE.BoxGeometry(22, 0.28, 5.5);
  const wings = new THREE.Mesh(wingGeo, mats.skinMat);
  wings.position.set(0, 0, 0.5);
  eGroup.add(wings);

  // Wingtip Missile Rails + Red Missiles
  [-11.2, 11.2].forEach(ox => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 4.2), mats.darkMat);
    rail.position.set(ox, 0, 0.5);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4, 8).rotateX(Math.PI / 2), mats.redMat);
    m.position.set(ox, -0.2, 0.5);
    eGroup.add(rail);
    eGroup.add(m);
  });

  // 6. Underslung Dual Engine Nacelles & Titanium Nozzles
  [-1.8, 1.8].forEach(ox => {
    const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.0, 9, 16).rotateX(Math.PI / 2), mats.skinMat);
    nacelle.position.set(ox, -0.4, -2.5);
    eGroup.add(nacelle);

    // Titanium Nozzle
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.12, 1.8, 16).rotateX(Math.PI / 2), mats.titaniumMat);
    nozzle.position.set(ox, -0.4, -6.8);
    eGroup.add(nozzle);

    // Enemy Afterburner Exhaust (Glowing Orange Plasma Cone)
    const exhaust = new THREE.Mesh(new THREE.ConeGeometry(0.85, 6.5, 12).rotateX(Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xff3b00, transparent: true, opacity: 0.92 }));
    exhaust.position.set(ox, -0.4, -9.8);
    eGroup.add(exhaust);
  });

  // 7. Twin Cant-Angle Vertical Stabilizers
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
