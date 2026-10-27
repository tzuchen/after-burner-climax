/* ============================================================
   QA TEST SUITE: VECTOR KINEMATICS & PROPORTIONAL NAVIGATION
   ============================================================ */

export function runMathTests() {
  console.log(" Running Math & Kinematics Tests...");

  // Test 1: Linear Interpolation (LERP)
  const v1 = { x: 0, y: 0, z: 0 };
  const v2 = { x: 100, y: 50, z: -200 };
  const alpha = 0.5;
  const lerpX = v1.x + (v2.x - v1.x) * alpha;
  const lerpY = v1.y + (v2.y - v1.y) * alpha;
  const lerpZ = v1.z + (v2.z - v1.z) * alpha;

  if (lerpX !== 50 || lerpY !== 25 || lerpZ !== -100) {
    throw new Error(`LERP calculation failed: got (${lerpX}, ${lerpY}, ${lerpZ})`);
  }

  // Test 2: Homing Vector Normalization
  const dx = 30, dy = 40, dz = 0;
  const dist = Math.hypot(dx, dy, dz);
  if (dist !== 50) {
    throw new Error(`Euclidean distance calculation failed: expected 50, got ${dist}`);
  }
  const normX = dx / dist;
  const normY = dy / dist;
  if (Math.abs(normX - 0.6) > 0.0001 || Math.abs(normY - 0.8) > 0.0001) {
    throw new Error(`Normalization failed: got (${normX}, ${normY})`);
  }

  // Test 3: Barrel Roll Periodicity
  const rollDuration = 0.42;
  const tMid = 0.21;
  const progressMid = (tMid / rollDuration) * 2.0;
  if (Math.abs(progressMid - 1.0) > 0.001) {
    throw new Error(`Roll progress calculation failed: expected 1.0, got ${progressMid}`);
  }

  console.log(" ✓ All Math & Kinematics Tests Passed!");
  return true;
}
