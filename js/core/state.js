/* ============================================================
   AFTER BURNER CLIMAX - CORE STATE MODULE
   Central game status, score, stage progression & combo system
   ============================================================ */

import { CONFIG } from '../config.js';

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.started = false;
    this.gameOver = false;
    this.victory = false;
    this.currentStageIndex = 0;
    this.stageKills = 0;

    // Combat Stats
    this.score = 0;
    this.armor = CONFIG.PLAYER.MAX_ARMOR;
    this.missiles = CONFIG.PLAYER.INITIAL_MISSILES;
    this.climaxGauge = CONFIG.PLAYER.INITIAL_CLIMAX;
    this.isClimax = false;
    this.climaxTimer = 0;
    this.isAfterburner = false;
    this.timeScale = 1.0;
    this.invulnerableTimer = 0;

    // Combo System
    this.comboCount = 0;
    this.comboTimer = 0;
    this.comboRank = 'C'; // D, C, B, A, S, SS, CLIMAX

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
    this.rollDir = 1; // 1: Right, -1: Left
    this.rollProgress = 0;

    // Boss State
    this.bossActive = false;
    this.bossHealth = 100;
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

    // Update Combo Rank
    if (this.comboCount >= 25) this.comboRank = 'CLIMAX RANK';
    else if (this.comboCount >= 18) this.comboRank = 'SS RANK';
    else if (this.comboCount >= 12) this.comboRank = 'S RANK';
    else if (this.comboCount >= 7) this.comboRank = 'A RANK';
    else if (this.comboCount >= 3) this.comboRank = 'B RANK';
    else this.comboRank = 'C RANK';

    // Recharge Climax
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
  }

  nextStage() {
    if (this.currentStageIndex < CONFIG.STAGES.length - 1) {
      this.currentStageIndex++;
      this.stageKills = 0;
      this.missiles = Math.min(CONFIG.PLAYER.INITIAL_MISSILES, this.missiles + 40);
      return true;
    } else {
      this.victory = true;
      return false;
    }
  }
}

export const state = new GameState();
