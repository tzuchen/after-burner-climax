/* ============================================================
   QA TEST SUITE: FIGHTER FLEET, WEAPONS & COUNTERMEASURES
   ============================================================ */

import { CONFIG } from '../js/config.js';
import { GameState } from '../js/core/state.js';

export function runFleetTests() {
  console.log(" Running Fighter Fleet & Munitions Tests...");

  // 1. Verify 4 Distinct Aircraft Specifications
  if (!Array.isArray(CONFIG.AIRCRAFT_FLEET) || CONFIG.AIRCRAFT_FLEET.length !== 4) {
    throw new Error(`Expected 4 playable aircraft, got ${CONFIG.AIRCRAFT_FLEET ? CONFIG.AIRCRAFT_FLEET.length : 0}`);
  }

  const expectedFleet = ['F14D', 'F15E', 'FA18E', 'A10C'];
  expectedFleet.forEach(id => {
    const ac = CONFIG.AIRCRAFT_FLEET.find(a => a.id === id);
    if (!ac) throw new Error(`Missing expected aircraft with ID: ${id}`);
    if (!ac.name || !ac.specialWeapon || !ac.stats) {
      throw new Error(`Incomplete aircraft config for ${id}`);
    }
    if (typeof ac.stats.speed !== 'number' || typeof ac.stats.armor !== 'number' || typeof ac.stats.mobility !== 'number') {
      throw new Error(`Invalid stats for aircraft ${id}`);
    }
  });

  // 2. Verify Special Weapons Payloads
  const f14 = CONFIG.AIRCRAFT_FLEET.find(a => a.id === 'F14D');
  if (f14.specialWeapon.lockCount !== 6 || f14.specialWeapon.type !== 'MULTI_HOMING') {
    throw new Error(`F-14D weapon mismatch: ${JSON.stringify(f14.specialWeapon)}`);
  }

  const f15 = CONFIG.AIRCRAFT_FLEET.find(a => a.id === 'F15E');
  if (f15.specialWeapon.lockCount !== 8 || f15.specialWeapon.type !== 'CLUSTER_BOMB') {
    throw new Error(`F-15E weapon mismatch: ${JSON.stringify(f15.specialWeapon)}`);
  }

  const f18 = CONFIG.AIRCRAFT_FLEET.find(a => a.id === 'FA18E');
  if (f18.specialWeapon.lockCount !== 4 || f18.specialWeapon.type !== 'AGILE_HOMING') {
    throw new Error(`F/A-18E weapon mismatch: ${JSON.stringify(f18.specialWeapon)}`);
  }

  const a10 = CONFIG.AIRCRAFT_FLEET.find(a => a.id === 'A10C');
  if (a10.specialWeapon.ammo !== 24 || a10.specialWeapon.type !== 'GATLING_BURST') {
    throw new Error(`A-10C weapon mismatch: ${JSON.stringify(a10.specialWeapon)}`);
  }

  // 3. Test Fleet State Switching
  const state = new GameState();
  state.selectAircraft('A10C');
  if (state.selectedAircraftId !== 'A10C' || state.specialWeaponAmmo !== 24) {
    throw new Error(`State did not switch correctly to A10C: ammo = ${state.specialWeaponAmmo}`);
  }

  const spw = state.fireSpecialWeapon();
  if (!spw || spw.type !== 'GATLING_BURST' || state.specialWeaponAmmo !== 23) {
    throw new Error(`fireSpecialWeapon did not decrement ammo properly: ${state.specialWeaponAmmo}`);
  }

  // 4. Test Countermeasure Flares
  const initFlares = state.flares;
  const flareSuccess = state.deployFlares();
  if (!flareSuccess || state.flares !== initFlares - 1 || state.flareCooldownTimer <= 0) {
    throw new Error("Flare deployment failed to decrement count or trigger cooldown");
  }

  // Rapid consecutive deployment should be rejected by cooldown
  const rapidDeploy = state.deployFlares();
  if (rapidDeploy) {
    throw new Error("Flares were deployed despite cooldown being active");
  }

  console.log(" ✓ All Fighter Fleet & Munitions Tests Passed!");
  return true;
}
