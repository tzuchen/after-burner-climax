/* ============================================================
   AFTER BURNER CLIMAX - ARCADE HUD CONTROLLER
   Score, Speedometer, Armor, Climax Bar, Combos & Boss Bar
   ============================================================ */

import { state } from '../core/state.js';

export class HUDController {
  constructor() {
    this.scoreValEl = document.getElementById('score-val');
    this.speedValEl = document.getElementById('speed-val');
    this.stageNameEl = document.getElementById('stage-name');
    this.trackInfoEl = document.getElementById('track-info');
    this.missileValEl = document.getElementById('missile-val');
    this.flareValEl = document.getElementById('flare-val');
    this.spwNameEl = document.getElementById('spw-name');
    this.spwAmmoEl = document.getElementById('spw-ammo');
    this.armorValEl = document.getElementById('armor-val');
    this.armorFillEl = document.getElementById('armor-fill');
    this.climaxFillEl = document.getElementById('climax-fill');
    this.climaxBoxEl = document.getElementById('climax-box');
    this.climaxStatusLbl = document.getElementById('climax-status-lbl');
    this.climaxTextEl = document.getElementById('climax-text');

    // Combo Elements
    this.comboContainer = document.getElementById('hud-combo-box');
    this.comboCountEl = document.getElementById('combo-count');
    this.comboRankEl = document.getElementById('combo-rank');

    // Boss Elements
    this.bossHud = document.getElementById('boss-hud');
    this.bossBarFill = document.getElementById('boss-bar-fill');
  }

  update(machSpeed, stageConfig, boss) {
    // 1. Score & Speed
    if (this.scoreValEl) this.scoreValEl.innerText = String(state.score).padStart(6, '0');
    if (this.speedValEl) this.speedValEl.innerText = machSpeed.toFixed(1);

    // 2. Stage Info
    if (this.stageNameEl) this.stageNameEl.innerText = stageConfig.name;
    if (this.trackInfoEl) this.trackInfoEl.innerText = `🎵 BGM: ${stageConfig.bgmTrack.replace(/_/g, ' ')}`;

    // 3. Ammo & Weapons
    if (this.missileValEl) this.missileValEl.innerText = state.missiles;
    if (this.flareValEl) this.flareValEl.innerText = state.flares;
    const ac = state.getSelectedAircraft();
    if (this.spwNameEl) this.spwNameEl.innerText = ac.specialWeapon.name;
    if (this.spwAmmoEl) this.spwAmmoEl.innerText = state.specialWeaponAmmo;

    // 4. Armor Bar
    if (this.armorValEl) this.armorValEl.innerText = `${Math.round(state.armor)}%`;
    if (this.armorFillEl) {
      this.armorFillEl.style.width = `${state.armor}%`;
      if (state.armor < 30) {
        this.armorFillEl.style.background = '#ff0033';
      } else if (state.armor < 65) {
        this.armorFillEl.style.background = '#ffaa00';
      } else {
        this.armorFillEl.style.background = 'linear-gradient(90deg, #ff2244, #ffbb00, #00ff88)';
      }
    }

    // 5. Climax Bar
    if (this.climaxFillEl) this.climaxFillEl.style.width = `${state.climaxGauge}%`;
    if (this.climaxBoxEl && this.climaxStatusLbl) {
      if (state.isClimax) {
        this.climaxBoxEl.classList.add('climax-ready');
        this.climaxStatusLbl.innerText = '⚡ CLIMAX ENGAGED ⚡';
        if (this.climaxTextEl) this.climaxTextEl.style.display = 'block';
      } else if (state.climaxGauge >= 100) {
        this.climaxBoxEl.classList.add('climax-ready');
        this.climaxStatusLbl.innerText = '🔥 CLIMAX READY (PRESS C) 🔥';
        if (this.climaxTextEl) this.climaxTextEl.style.display = 'none';
      } else {
        this.climaxBoxEl.classList.remove('climax-ready');
        this.climaxStatusLbl.innerText = 'CLIMAX GAUGE';
        if (this.climaxTextEl) this.climaxTextEl.style.display = 'none';
      }
    }

    // 6. Combo HUD
    if (this.comboContainer && this.comboCountEl && this.comboRankEl) {
      if (state.comboCount > 1) {
        this.comboContainer.style.display = 'block';
        this.comboCountEl.innerText = `COMBO x${state.comboCount}!`;
        this.comboRankEl.innerText = state.comboRank;
      } else {
        this.comboContainer.style.display = 'none';
      }
    }

    // 7. Boss HUD
    if (this.bossHud && this.bossBarFill) {
      if (boss && boss.active && boss.alive) {
        this.bossHud.style.display = 'block';
        this.bossBarFill.style.width = `${boss.health}%`;
      } else {
        this.bossHud.style.display = 'none';
      }
    }
  }
}
