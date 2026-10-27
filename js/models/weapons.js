/* ============================================================
   AFTER BURNER CLIMAX - WEAPONS & MUNITIONS MODULE
   AIM-9 Sidewinder, R-73 Archer, 20mm Vulcan & 30mm Tracers
   ============================================================ */

const missileBodyMat = new THREE.MeshStandardMaterial({
  color: 0xefefef,
  roughness: 0.3,
  metalness: 0.5
});

const enemyMissileBodyMat = new THREE.MeshStandardMaterial({
  color: 0xcc1122,
  roughness: 0.3,
  metalness: 0.6
});

const darkFinMat = new THREE.MeshStandardMaterial({
  color: 0x181a20,
  roughness: 0.4,
  metalness: 0.8
});

const rocketCoreMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
const enemyRocketCoreMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });

export function createPlayerMissileMesh() {
  const group = new THREE.Group();

  // Cylindrical Airframe
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 3.8, 8).rotateX(Math.PI / 2),
    missileBodyMat
  );
  group.add(body);

  // Infrared Seeker Dome
  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.24, 0.9, 8).rotateX(-Math.PI / 2),
    darkFinMat
  );
  nose.position.z = -2.3;
  group.add(nose);

  // 4 Cruciform Steering Canards
  const canardH = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.5), darkFinMat);
  canardH.position.z = -1.4;
  group.add(canardH);
  const canardV = canardH.clone();
  canardV.rotation.z = Math.PI / 2;
  group.add(canardV);

  // 4 Rear Stabilization Fins
  const finH = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.8), darkFinMat);
  finH.position.z = 1.4;
  group.add(finH);
  const finV = finH.clone();
  finV.rotation.z = Math.PI / 2;
  group.add(finV);

  // Glowing Rocket Motor Point
  const exhaustDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 8, 8),
    rocketCoreMat
  );
  exhaustDot.position.z = 2.0;
  group.add(exhaustDot);

  return group;
}

export function createEnemyMissileMesh() {
  const group = new THREE.Group();

  // Red/Black Airframe
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 3.8, 8).rotateX(Math.PI / 2),
    enemyMissileBodyMat
  );
  group.add(body);

  // 4 Black Fins
  const finH = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.7), darkFinMat);
  finH.position.z = 1.4;
  group.add(finH);
  const finV = finH.clone();
  finV.rotation.z = Math.PI / 2;
  group.add(finV);

  // Bright Crimson Rocket Exhaust Core
  const motor = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 8, 8),
    enemyRocketCoreMat
  );
  motor.position.z = 2.0;
  group.add(motor);

  return group;
}

export function createVulcanTracerMesh() {
  const bMat = new THREE.MeshBasicMaterial({ color: 0xffee44 });
  const bGeo = new THREE.BoxGeometry(0.3, 0.3, 8);
  return new THREE.Mesh(bGeo, bMat);
}

export function createEnemyTracerMesh() {
  const bMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
  const bGeo = new THREE.BoxGeometry(0.4, 0.4, 12);
  return new THREE.Mesh(bGeo, bMat);
}
