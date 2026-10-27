/* ============================================================
   AFTER BURNER CLIMAX - EXPANDED GAME STATE MODULE
   Fleet Selection, Special Weapons, Countermeasures, Branching
   ============================================================ */

import { CONFIG } from '../config.js';

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.started = false;
    this.inTitle = true; // Title / Start overlay screen active
    this.inHangar = false; // 3D Hangar inspection after entering
    this.gameOver = false;
    this.victory = false;
    this.currentStageIndex = 0;
    this.stageKills = 0;

    // Aircraft Selection
    this.selectedAircraftId = 'F14D';
    this.selectedSkinIndex = 0; // 0: Default Navy, 1: Aggressor Splinter, 2: Jolly Rogers, 3: Tiger Meet

    // Combat Stats
    this.score = 0;
    this.armor = CONFIG.PLAYER.MAX_ARMOR;
    this.missiles = CONFIG.PLAYER.INITIAL_MISSILES;
    this.specialWeaponAmmo = 12;
    this.flares = CONFIG.FLARES.INITIAL_COUNT;
    this.flareCooldownTimer = 0;

    this.climaxGauge = CONFIG.PLAYER.INITIAL_CLIMAX;
    this.isClimax = false;
    this.climaxTimer = 0;
    this.isAfterburner = false;
    this.timeScale = 1.0;
    this.invulnerableTimer = 0;

    // Combo System
    this.comboCount = 0;
    this.comboTimer = 0;
    this.comboRank = 'C';

    // View Mode (false: Chase Cam, true: 1st Person Cockpit)
    this.isCockpitView = false;

    // Flight Attitude
    this.targetX = 0;
    this.targetY = 0;
    this.curX = 0;
    this.curY = 0;
    this.bankAngle = 0;
    this.pitchAngle = 0;

    // Barrel Roll State
    this.isRolling = false;
    this.rollDir = 1;
    this.rollProgress = 0;

    // Boss State
    this.bossActive = false;
    this.bossHealth = 100;

    // Branching Decision State
    this.isSelectingRoute = false;
    this.availableRoutes = [];
  }

  getSelectedAircraft() {
    return CONFIG.AIRCRAFT_FLEET.find(a => a.id === this.selectedAircraftId) || CONFIG.AIRCRAFT_FLEET[0];
  }

  selectAircraft(aircraftId) {
    this.selectedAircraftId = aircraftId;
    const ac = this.getSelectedAircraft();
    this.specialWeaponAmmo = ac.specialWeapon.ammo;
  }

  getCurrentStage() {
    return CONFIG.STAGES[this.currentStageIndex];
  }

  addScore(points) {
    const multiplier = 1 + Math.min(this.comboCount * 0.1, 2.5);
    this.score += Math.round(points * multiplier);
  }

  registerKill(isClimax = false) {
    this.comboCount++;
    this.comboTimer = CONFIG.SCORE.COMBO_WINDOW;
    this.stageKills++;

    if (this.comboCount >= 25) this.comboRank = 'CLIMAX RANK';
    else if (this.comboCount >= 18) this.comboRank = 'SS RANK';
    else if (this.comboCount >= 12) this.comboRank = 'S RANK';
    else if (this.comboCount >= 7) this.comboRank = 'A RANK';
    else if (this.comboCount >= 3) this.comboRank = 'B RANK';
    else this.comboRank = 'C RANK';

    const recharge = isClimax ? 5 : CONFIG.PLAYER.CLIMAX_KILL_BONUS;
    this.climaxGauge = Math.min(100, this.climaxGauge + recharge);
  }

  updateCombos(dt) {
    if (this.comboCount > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
        this.comboRank = 'C';
      }
    }
    if (this.flareCooldownTimer > 0) {
      this.flareCooldownTimer -= dt;
    }
  }

  deployFlares() {
    if (this.flares <= 0 || this.flareCooldownTimer > 0) return false;
    this.flares--;
    this.flareCooldownTimer = CONFIG.FLARES.COOLDOWN;
    return true;
  }

  chooseRoute(routeIndex) {
    const stage = this.getCurrentStage();
    if (stage.routes && stage.routes[routeIndex]) {
      this.currentStageIndex = stage.routes[routeIndex].nextStageIndex;
      this.stageKills = 0;
      this.missiles = Math.min(CONFIG.PLAYER.INITIAL_MISSILES, this.missiles + 40);
      this.isSelectingRoute = false;
      return true;
    }
    return false;
  }

  nextStage(routeIndex = 0) {
    const stage = this.getCurrentStage();
    if (stage.routes && stage.routes.length > 0) {
      const idx = Math.min(routeIndex, stage.routes.length - 1);
      return this.chooseRoute(idx);
    } else if (this.currentStageIndex < CONFIG.STAGES.length - 1) {
      this.currentStageIndex++;
      this.stageKills = 0;
      this.missiles = Math.min(CONFIG.PLAYER.INITIAL_MISSILES, this.missiles + 40);
      return true;
    }
    return false;
  }

  fireSpecialWeapon() {
    if (this.specialWeaponAmmo <= 0) return null;
    const ac = this.getSelectedAircraft();
    this.specialWeaponAmmo--;
    return ac.specialWeapon;
  }
}

export const state = new GameState();
