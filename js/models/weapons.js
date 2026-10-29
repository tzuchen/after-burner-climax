/* ============================================================
   AFTER BURNER CLIMAX - WEAPONS & MUNITIONS MODULE
   AIM-9 Sidewinder, R-73 Archer, AIM-54 Phoenix, 20mm & 30mm Tracers
   Arcade Scaling (2.5x - 3.0x), High-Contrast Airframes & Blazing VFX
   ============================================================ */

let missileBodyMat, enemyMissileBodyMat, phoenixBodyMat, darkFinMat, darkMetalMat,
    playerPlumeOuterMat, playerPlumeInnerMat, enemyPlumeOuterMat, enemyPlumeInnerMat,
    phoenixPlumeOuterMat, phoenixPlumeInnerMat, whiteCoreMat;

function initMunitionMaterials() {
  if (typeof THREE === 'undefined') return;
  if (missileBodyMat) return;

  missileBodyMat = new THREE.MeshStandardMaterial({
    color: 0xf5f7fa,
    roughness: 0.22,
    metalness: 0.45
  });

  enemyMissileBodyMat = new THREE.MeshStandardMaterial({
    color: 0xc81b2a,
    roughness: 0.28,
    metalness: 0.55
  });

  phoenixBodyMat = new THREE.MeshStandardMaterial({
    color: 0xf0f3f6,
    roughness: 0.2,
    metalness: 0.5
  });

  darkFinMat = new THREE.MeshStandardMaterial({
    color: 0x141820,
    roughness: 0.35,
    metalness: 0.85
  });

  darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x22262e,
    roughness: 0.25,
    metalness: 0.95
  });

  playerPlumeOuterMat = new THREE.MeshBasicMaterial({
    color: 0xff8800,
    transparent: true,
    opacity: 0.90
  });

  playerPlumeInnerMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.98
  });

  enemyPlumeOuterMat = new THREE.MeshBasicMaterial({
    color: 0xff1e1e,
    transparent: true,
    opacity: 0.92
  });

  enemyPlumeInnerMat = new THREE.MeshBasicMaterial({
    color: 0xffee55,
    transparent: true,
    opacity: 0.98
  });

  phoenixPlumeOuterMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.92
  });

  phoenixPlumeInnerMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.98
  });

  whiteCoreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
}

if (typeof THREE !== 'undefined') {
  initMunitionMaterials();
}

export function createPlayerMissileMesh() {
  initMunitionMaterials();
  const group = new THREE.Group();

  // 1. Scaled Cylindrical Airframe (AIM-9 Sidewinder / AIM-120 AMRAAM hybrid)
  // Radius: 0.68, Length: 7.5 (Up from 0.24 & 3.8)
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.68, 7.5, 12).rotateX(Math.PI / 2),
    missileBodyMat
  );
  group.add(body);

  // 2. High-Tech Radome / Seeker Dome
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.68, 1.8, 12).rotateX(-Math.PI / 2),
    darkFinMat
  );
  nose.position.z = -4.65;
  group.add(nose);

  // Infrared Seeker Optical Lens Reflection
  const seekerTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x00d0ff })
  );
  seekerTip.position.z = -5.45;
  group.add(seekerTip);

  // 3. 4 Cruciform High-Mobility Forward Steering Canards
  const canardGeo = new THREE.BoxGeometry(3.2, 0.08, 1.2);
  const canardH = new THREE.Mesh(canardGeo, darkFinMat);
  canardH.position.z = -2.6;
  group.add(canardH);
  const canardV = canardH.clone();
  canardV.rotation.z = Math.PI / 2;
  group.add(canardV);

  // 4. 4 Rear Stabilization & Rolleron Fins
  const finGeo = new THREE.BoxGeometry(4.4, 0.1, 1.8);
  const finH = new THREE.Mesh(finGeo, darkFinMat);
  finH.position.z = 2.4;
  group.add(finH);
  const finV = finH.clone();
  finV.rotation.z = Math.PI / 2;
  group.add(finV);

  // 5. Titanium Rocket Exhaust Nozzle Ring
  const nozzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 0.7, 12).rotateX(Math.PI / 2),
    darkMetalMat
  );
  nozzle.position.z = 3.8;
  group.add(nozzle);

  // 6. Blazing Two-Stage Rocket Motor Exhaust Plume
  const outerPlume = new THREE.Mesh(
    new THREE.ConeGeometry(0.95, 5.8, 16).rotateX(-Math.PI / 2),
    playerPlumeOuterMat
  );
  outerPlume.position.z = 6.6;
  group.add(outerPlume);

  const innerPlume = new THREE.Mesh(
    new THREE.ConeGeometry(0.48, 3.8, 12).rotateX(-Math.PI / 2),
    playerPlumeInnerMat
  );
  innerPlume.position.z = 5.6;
  group.add(innerPlume);

  // High-intensity glowing motor flare sphere
  const motorFlare = new THREE.Mesh(
    new THREE.SphereGeometry(0.68, 8, 8),
    whiteCoreMat
  );
  motorFlare.position.z = 3.9;
  group.add(motorFlare);

  // 7. Dynamic Rocket Light (Illuminates fins and airframe in flight)
  const plumeLight = new THREE.PointLight(0xffaa22, 2.8, 55);
  plumeLight.position.z = 4.2;
  group.add(plumeLight);

  return group;
}

export function createEnemyMissileMesh() {
  initMunitionMaterials();
  const group = new THREE.Group();

  // 1. Scaled Aggressor Airframe (R-73 Archer / AA-11 hybrid)
  // Radius: 0.65, Length: 7.2 (Up from 0.24 & 3.8)
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.65, 7.2, 12).rotateX(Math.PI / 2),
    enemyMissileBodyMat
  );
  group.add(body);

  // 2. Aggressor Seeker Dome
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.65, 1.6, 12).rotateX(-Math.PI / 2),
    darkFinMat
  );
  nose.position.z = -4.4;
  group.add(nose);

  // 3. 4 Aft Stabilization Fins
  const finGeo = new THREE.BoxGeometry(4.0, 0.1, 1.6);
  const finH = new THREE.Mesh(finGeo, darkFinMat);
  finH.position.z = 2.3;
  group.add(finH);
  const finV = finH.clone();
  finV.rotation.z = Math.PI / 2;
  group.add(finV);

  // 4. Titanium Rocket Nozzle Ring
  const nozzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.68, 0.6, 12).rotateX(Math.PI / 2),
    darkMetalMat
  );
  nozzle.position.z = 3.65;
  group.add(nozzle);

  // 5. Blazing Crimson Rocket Motor Plume
  const outerPlume = new THREE.Mesh(
    new THREE.ConeGeometry(0.9, 5.5, 16).rotateX(-Math.PI / 2),
    enemyPlumeOuterMat
  );
  outerPlume.position.z = 6.4;
  group.add(outerPlume);

  const innerPlume = new THREE.Mesh(
    new THREE.ConeGeometry(0.45, 3.6, 12).rotateX(-Math.PI / 2),
    enemyPlumeInnerMat
  );
  innerPlume.position.z = 5.4;
  group.add(innerPlume);

  // Bright red-hot core flare
  const motorFlare = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff3322 })
  );
  motorFlare.position.z = 3.8;
  group.add(motorFlare);

  // Dynamic Crimson Point Light
  const plumeLight = new THREE.PointLight(0xff2200, 2.6, 50);
  plumeLight.position.z = 4.0;
  group.add(plumeLight);

  return group;
}

export function createVulcanTracerMesh() {
  const group = new THREE.Group();
  const bOuter = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 24),
    new THREE.MeshBasicMaterial({ color: 0xffff44 })
  );
  group.add(bOuter);

  const bInner = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.36, 26),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  group.add(bInner);
  return group;
}

export function createEnemyTracerMesh() {
  const group = new THREE.Group();
  const bOuter = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.85, 28),
    new THREE.MeshBasicMaterial({ color: 0xff1e32 })
  );
  group.add(bOuter);

  const bInner = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.42, 30),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  group.add(bInner);
  return group;
}

export function createPhoenixMissileMesh() {
  initMunitionMaterials();
  const group = new THREE.Group();

  // 1. Heavy AIM-54 Phoenix Long-Range Airframe (Radius: 0.95, Length: 10.5)
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.95, 10.5, 12).rotateX(Math.PI / 2),
    phoenixBodyMat
  );
  group.add(body);

  // 2. Large Radar Seeker Radome
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.95, 2.6, 12).rotateX(-Math.PI / 2),
    darkFinMat
  );
  nose.position.z = -6.5;
  group.add(nose);

  // 3. Wide Clipped Delta Mid-Body Wings
  const wingGeo = new THREE.BoxGeometry(6.4, 0.12, 3.6);
  const wingH = new THREE.Mesh(wingGeo, darkFinMat);
  wingH.position.z = 0.5;
  group.add(wingH);
  const wingV = wingH.clone();
  wingV.rotation.z = Math.PI / 2;
  group.add(wingV);

  // 4. 4 Aft Control Fins
  const finGeo = new THREE.BoxGeometry(4.8, 0.12, 1.8);
  const finH = new THREE.Mesh(finGeo, darkFinMat);
  finH.position.z = 3.8;
  group.add(finH);
  const finV = finH.clone();
  finV.rotation.z = Math.PI / 2;
  group.add(finV);

  // 5. Titanium Nozzle Ring
  const nozzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.98, 0.98, 0.8, 12).rotateX(Math.PI / 2),
    darkMetalMat
  );
  nozzle.position.z = 5.3;
  group.add(nozzle);

  // 6. Colossal Dual-Stage Cyan/White Rocket Motor Plume
  const outerPlume = new THREE.Mesh(
    new THREE.ConeGeometry(1.25, 7.5, 16).rotateX(-Math.PI / 2),
    phoenixPlumeOuterMat
  );
  outerPlume.position.z = 9.0;
  group.add(outerPlume);

  const innerPlume = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 4.8, 12).rotateX(-Math.PI / 2),
    phoenixPlumeInnerMat
  );
  innerPlume.position.z = 7.6;
  group.add(innerPlume);

  const motorFlare = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 8, 8),
    whiteCoreMat
  );
  motorFlare.position.z = 5.4;
  group.add(motorFlare);

  const plumeLight = new THREE.PointLight(0x00e1ff, 3.2, 65);
  plumeLight.position.z = 5.6;
  group.add(plumeLight);

  return group;
}

export function createFlareMesh() {
  const group = new THREE.Group();
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const core = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8), coreMat);
  group.add(core);

  const coronaMat = new THREE.MeshBasicMaterial({
    color: 0xff7700,
    transparent: true,
    opacity: 0.65
  });
  const corona = new THREE.Mesh(new THREE.SphereGeometry(2.6, 8, 8), coronaMat);
  group.add(corona);

  return group;
}

export function createClusterBombMesh() {
  const group = new THREE.Group();
  const canisterMat = new THREE.MeshStandardMaterial({ color: 0x3a4230, roughness: 0.5, metalness: 0.5 });
  const canister = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 4.2, 10).rotateX(Math.PI / 2), canisterMat);
  group.add(canister);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.2, 10).rotateX(-Math.PI / 2), darkFinMat);
  nose.position.z = -2.7;
  group.add(nose);

  const tail = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.0), darkFinMat);
  tail.position.z = 2.2;
  group.add(tail);

  return group;
}

export function createHeavy30mmTracerMesh() {
  const group = new THREE.Group();
  const bOuter = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.2, 34),
    new THREE.MeshBasicMaterial({ color: 0xff9900 })
  );
  group.add(bOuter);

  const bInner = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.55, 36),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  group.add(bInner);
  return group;
}
