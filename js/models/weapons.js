/* ============================================================
   AFTER BURNER CLIMAX - WEAPONS & MUNITIONS MODULE
   High-Performance Pooled Geometries & Zero-GC Shared Materials
   ============================================================ */

let munitionInitialized = false;

// Shared Materials (Instantiated once)
let missileBodyMat, enemyMissileBodyMat, phoenixBodyMat, darkFinMat, darkMetalMat,
    playerPlumeOuterMat, playerPlumeInnerMat, enemyPlumeOuterMat, enemyPlumeInnerMat,
    phoenixPlumeOuterMat, phoenixPlumeInnerMat, whiteCoreMat, seekerLensMat, enemyMotorFlareMat,
    vulcanOuterMat, vulcanInnerMat, enemyTracerOuterMat, enemyTracerInnerMat,
    heavy30mmOuterMat, heavy30mmInnerMat, flareCoreMat, flareCoronaMat, canisterMat;

// Shared Geometries (Instantiated once, never duplicated)
let playerBodyGeo, playerNoseGeo, seekerLensGeo, canardGeo, finGeo, nozzleGeo,
    playerOuterPlumeGeo, playerInnerPlumeGeo, motorFlareGeo;

let enemyBodyGeo, enemyNoseGeo, enemyFinGeo, enemyNozzleGeo,
    enemyOuterPlumeGeo, enemyInnerPlumeGeo, enemyMotorFlareGeo;

let phoenixBodyGeo, phoenixNoseGeo, phoenixWingGeo, phoenixFinGeo, phoenixNozzleGeo,
    phoenixOuterPlumeGeo, phoenixInnerPlumeGeo, phoenixMotorFlareGeo;

let vulcanOuterGeo, vulcanInnerGeo;
let enemyTracerOuterGeo, enemyTracerInnerGeo;
let heavy30mmOuterGeo, heavy30mmInnerGeo;
let flareCoreGeo, flareCoronaGeo;
let canisterGeo, canisterNoseGeo, canisterTailGeo;

function initMunitionResources() {
  if (typeof THREE === 'undefined' || munitionInitialized) return;
  munitionInitialized = true;

  // Materials
  missileBodyMat = new THREE.MeshStandardMaterial({ color: 0xf5f7fa, roughness: 0.22, metalness: 0.45 });
  enemyMissileBodyMat = new THREE.MeshStandardMaterial({ color: 0xc81b2a, roughness: 0.28, metalness: 0.55 });
  phoenixBodyMat = new THREE.MeshStandardMaterial({ color: 0xf0f3f6, roughness: 0.2, metalness: 0.5 });
  darkFinMat = new THREE.MeshStandardMaterial({ color: 0x141820, roughness: 0.35, metalness: 0.85 });
  darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.25, metalness: 0.95 });

  playerPlumeOuterMat = new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.90 });
  playerPlumeInnerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.98 });
  enemyPlumeOuterMat = new THREE.MeshBasicMaterial({ color: 0xff1e1e, transparent: true, opacity: 0.92 });
  enemyPlumeInnerMat = new THREE.MeshBasicMaterial({ color: 0xffee55, transparent: true, opacity: 0.98 });
  phoenixPlumeOuterMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.92 });
  phoenixPlumeInnerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.98 });
  whiteCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  seekerLensMat = new THREE.MeshBasicMaterial({ color: 0x00d0ff });
  enemyMotorFlareMat = new THREE.MeshBasicMaterial({ color: 0xff3322 });

  vulcanOuterMat = new THREE.MeshBasicMaterial({ color: 0xffff44 });
  vulcanInnerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  enemyTracerOuterMat = new THREE.MeshBasicMaterial({ color: 0xff1e32 });
  enemyTracerInnerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  heavy30mmOuterMat = new THREE.MeshBasicMaterial({ color: 0xff9900 });
  heavy30mmInnerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  flareCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  flareCoronaMat = new THREE.MeshBasicMaterial({ color: 0xff7700, transparent: true, opacity: 0.65 });
  canisterMat = new THREE.MeshStandardMaterial({ color: 0x3a4230, roughness: 0.5, metalness: 0.5 });

  // Geometries
  playerBodyGeo = new THREE.CylinderGeometry(0.68, 0.68, 7.5, 10).rotateX(Math.PI / 2);
  playerNoseGeo = new THREE.ConeGeometry(0.68, 1.8, 10).rotateX(-Math.PI / 2);
  seekerLensGeo = new THREE.SphereGeometry(0.35, 8, 8);
  canardGeo = new THREE.BoxGeometry(3.2, 0.08, 1.2);
  finGeo = new THREE.BoxGeometry(4.4, 0.1, 1.8);
  nozzleGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.7, 10).rotateX(Math.PI / 2);
  playerOuterPlumeGeo = new THREE.ConeGeometry(0.95, 5.8, 12).rotateX(-Math.PI / 2);
  playerInnerPlumeGeo = new THREE.ConeGeometry(0.48, 3.8, 10).rotateX(-Math.PI / 2);
  motorFlareGeo = new THREE.SphereGeometry(0.68, 8, 8);

  enemyBodyGeo = new THREE.CylinderGeometry(0.65, 0.65, 7.2, 10).rotateX(Math.PI / 2);
  enemyNoseGeo = new THREE.ConeGeometry(0.65, 1.6, 10).rotateX(-Math.PI / 2);
  enemyFinGeo = new THREE.BoxGeometry(4.0, 0.1, 1.6);
  enemyNozzleGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.6, 10).rotateX(Math.PI / 2);
  enemyOuterPlumeGeo = new THREE.ConeGeometry(0.9, 5.5, 12).rotateX(-Math.PI / 2);
  enemyInnerPlumeGeo = new THREE.ConeGeometry(0.45, 3.6, 10).rotateX(-Math.PI / 2);
  enemyMotorFlareGeo = new THREE.SphereGeometry(0.65, 8, 8);

  phoenixBodyGeo = new THREE.CylinderGeometry(0.95, 0.95, 10.5, 10).rotateX(Math.PI / 2);
  phoenixNoseGeo = new THREE.ConeGeometry(0.95, 2.6, 10).rotateX(-Math.PI / 2);
  phoenixWingGeo = new THREE.BoxGeometry(6.4, 0.12, 3.6);
  phoenixFinGeo = new THREE.BoxGeometry(4.8, 0.12, 1.8);
  phoenixNozzleGeo = new THREE.CylinderGeometry(0.98, 0.98, 0.8, 10).rotateX(Math.PI / 2);
  phoenixOuterPlumeGeo = new THREE.ConeGeometry(1.25, 7.5, 12).rotateX(-Math.PI / 2);
  phoenixInnerPlumeGeo = new THREE.ConeGeometry(0.6, 4.8, 10).rotateX(-Math.PI / 2);
  phoenixMotorFlareGeo = new THREE.SphereGeometry(0.9, 8, 8);

  vulcanOuterGeo = new THREE.BoxGeometry(0.75, 0.75, 24);
  vulcanInnerGeo = new THREE.BoxGeometry(0.36, 0.36, 26);
  enemyTracerOuterGeo = new THREE.BoxGeometry(0.85, 0.85, 28);
  enemyTracerInnerGeo = new THREE.BoxGeometry(0.42, 0.42, 30);
  heavy30mmOuterGeo = new THREE.BoxGeometry(1.2, 1.2, 34);
  heavy30mmInnerGeo = new THREE.BoxGeometry(0.55, 0.55, 36);

  flareCoreGeo = new THREE.SphereGeometry(1.2, 8, 8);
  flareCoronaGeo = new THREE.SphereGeometry(2.6, 8, 8);
  canisterGeo = new THREE.CylinderGeometry(0.7, 0.7, 4.2, 10).rotateX(Math.PI / 2);
  canisterNoseGeo = new THREE.ConeGeometry(0.7, 1.2, 10).rotateX(-Math.PI / 2);
  canisterTailGeo = new THREE.BoxGeometry(1.8, 1.8, 1.0);
}

if (typeof THREE !== 'undefined') {
  initMunitionResources();
}

export function createPlayerMissileMesh() {
  initMunitionResources();
  const group = new THREE.Group();

  // Cylindrical Airframe
  const body = new THREE.Mesh(playerBodyGeo, missileBodyMat);
  group.add(body);

  // Radome / Seeker Dome
  const nose = new THREE.Mesh(playerNoseGeo, darkFinMat);
  nose.position.z = -4.65;
  group.add(nose);

  // Optical Lens Tip
  const seekerTip = new THREE.Mesh(seekerLensGeo, seekerLensMat);
  seekerTip.position.z = -5.45;
  group.add(seekerTip);

  // 4 Forward Cruciform Steering Canards
  const canardH = new THREE.Mesh(canardGeo, darkFinMat);
  canardH.position.z = -2.6;
  group.add(canardH);
  const canardV = new THREE.Mesh(canardGeo, darkFinMat);
  canardV.position.z = -2.6;
  canardV.rotation.z = Math.PI / 2;
  group.add(canardV);

  // 4 Rear Stabilization Fins
  const finH = new THREE.Mesh(finGeo, darkFinMat);
  finH.position.z = 2.4;
  group.add(finH);
  const finV = new THREE.Mesh(finGeo, darkFinMat);
  finV.position.z = 2.4;
  finV.rotation.z = Math.PI / 2;
  group.add(finV);

  // Titanium Rocket Nozzle Ring
  const nozzle = new THREE.Mesh(nozzleGeo, darkMetalMat);
  nozzle.position.z = 3.8;
  group.add(nozzle);

  // Blazing Two-Stage Rocket Motor Exhaust Plume
  const outerPlume = new THREE.Mesh(playerOuterPlumeGeo, playerPlumeOuterMat);
  outerPlume.position.z = 6.6;
  group.add(outerPlume);

  const innerPlume = new THREE.Mesh(playerInnerPlumeGeo, playerPlumeInnerMat);
  innerPlume.position.z = 5.6;
  group.add(innerPlume);

  const motorFlare = new THREE.Mesh(motorFlareGeo, whiteCoreMat);
  motorFlare.position.z = 3.9;
  group.add(motorFlare);

  return group;
}

export function createEnemyMissileMesh() {
  initMunitionResources();
  const group = new THREE.Group();

  // Aggressor Airframe
  const body = new THREE.Mesh(enemyBodyGeo, enemyMissileBodyMat);
  group.add(body);

  // Seeker Dome
  const nose = new THREE.Mesh(enemyNoseGeo, darkFinMat);
  nose.position.z = -4.4;
  group.add(nose);

  // 4 Aft Stabilization Fins
  const finH = new THREE.Mesh(enemyFinGeo, darkFinMat);
  finH.position.z = 2.3;
  group.add(finH);
  const finV = new THREE.Mesh(enemyFinGeo, darkFinMat);
  finV.position.z = 2.3;
  finV.rotation.z = Math.PI / 2;
  group.add(finV);

  // Nozzle Ring
  const nozzle = new THREE.Mesh(enemyNozzleGeo, darkMetalMat);
  nozzle.position.z = 3.65;
  group.add(nozzle);

  // Blazing Crimson Plume
  const outerPlume = new THREE.Mesh(enemyOuterPlumeGeo, enemyPlumeOuterMat);
  outerPlume.position.z = 6.4;
  group.add(outerPlume);

  const innerPlume = new THREE.Mesh(enemyInnerPlumeGeo, enemyPlumeInnerMat);
  innerPlume.position.z = 5.4;
  group.add(innerPlume);

  const motorFlare = new THREE.Mesh(enemyMotorFlareGeo, enemyMotorFlareMat);
  motorFlare.position.z = 3.8;
  group.add(motorFlare);

  return group;
}

export function createVulcanTracerMesh() {
  initMunitionResources();
  const group = new THREE.Group();
  const bOuter = new THREE.Mesh(vulcanOuterGeo, vulcanOuterMat);
  group.add(bOuter);
  const bInner = new THREE.Mesh(vulcanInnerGeo, vulcanInnerMat);
  group.add(bInner);
  return group;
}

export function createEnemyTracerMesh() {
  initMunitionResources();
  const group = new THREE.Group();
  const bOuter = new THREE.Mesh(enemyTracerOuterGeo, enemyTracerOuterMat);
  group.add(bOuter);
  const bInner = new THREE.Mesh(enemyTracerInnerGeo, enemyTracerInnerMat);
  group.add(bInner);
  return group;
}

export function createPhoenixMissileMesh() {
  initMunitionResources();
  const group = new THREE.Group();

  const body = new THREE.Mesh(phoenixBodyGeo, phoenixBodyMat);
  group.add(body);

  const nose = new THREE.Mesh(phoenixNoseGeo, darkFinMat);
  nose.position.z = -6.5;
  group.add(nose);

  const wingH = new THREE.Mesh(phoenixWingGeo, darkFinMat);
  wingH.position.z = 0.5;
  group.add(wingH);
  const wingV = new THREE.Mesh(phoenixWingGeo, darkFinMat);
  wingV.position.z = 0.5;
  wingV.rotation.z = Math.PI / 2;
  group.add(wingV);

  const finH = new THREE.Mesh(phoenixFinGeo, darkFinMat);
  finH.position.z = 3.8;
  group.add(finH);
  const finV = new THREE.Mesh(phoenixFinGeo, darkFinMat);
  finV.position.z = 3.8;
  finV.rotation.z = Math.PI / 2;
  group.add(finV);

  const nozzle = new THREE.Mesh(phoenixNozzleGeo, darkMetalMat);
  nozzle.position.z = 5.3;
  group.add(nozzle);

  const outerPlume = new THREE.Mesh(phoenixOuterPlumeGeo, phoenixPlumeOuterMat);
  outerPlume.position.z = 9.0;
  group.add(outerPlume);

  const innerPlume = new THREE.Mesh(phoenixInnerPlumeGeo, phoenixPlumeInnerMat);
  innerPlume.position.z = 7.6;
  group.add(innerPlume);

  const motorFlare = new THREE.Mesh(phoenixMotorFlareGeo, whiteCoreMat);
  motorFlare.position.z = 5.4;
  group.add(motorFlare);

  return group;
}

export function createFlareMesh() {
  initMunitionResources();
  const group = new THREE.Group();
  const core = new THREE.Mesh(flareCoreGeo, flareCoreMat);
  group.add(core);

  const corona = new THREE.Mesh(flareCoronaGeo, flareCoronaMat);
  group.add(corona);

  return group;
}

export function createClusterBombMesh() {
  initMunitionResources();
  const group = new THREE.Group();
  const canister = new THREE.Mesh(canisterGeo, canisterMat);
  group.add(canister);

  const nose = new THREE.Mesh(canisterNoseGeo, darkFinMat);
  nose.position.z = -2.7;
  group.add(nose);

  const tail = new THREE.Mesh(canisterTailGeo, darkFinMat);
  tail.position.z = 2.2;
  group.add(tail);

  return group;
}

export function createHeavy30mmTracerMesh() {
  initMunitionResources();
  const group = new THREE.Group();
  const bOuter = new THREE.Mesh(heavy30mmOuterGeo, heavy30mmOuterMat);
  group.add(bOuter);

  const bInner = new THREE.Mesh(heavy30mmInnerGeo, heavy30mmInnerMat);
  group.add(bInner);
  return group;
}
