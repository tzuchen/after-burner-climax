/* ============================================================
   AFTER BURNER CLIMAX - CONFIGURATION MODULE
   Game balance, Stages, Controls mapping, and Audio settings
   ============================================================ */

export const CONFIG = {
  VERSION: '2.0.0-PRO',
  TITLE: 'AFTER BURNER CLIMAX - LEGACY EDITION',

  // Flight Physics & Speeds
  SPEED: {
    CRUISE: 950,
    AFTERBURNER: 1850,
    CLIMAX_MULTIPLIER: 0.32, // Time dilation
    ACCELERATION_LERP: 5.0,
    BANK_FACTOR: 0.022,
    PITCH_FACTOR: 0.018,
    ROLL_DURATION: 0.42, // Seconds for 360-degree snap roll
  },

  // Player Aircraft
  PLAYER: {
    MAX_ARMOR: 100,
    INITIAL_MISSILES: 60,
    INITIAL_CLIMAX: 100,
    CLIMAX_DURATION: 7.0, // Seconds
    CLIMAX_RECHARGE_RATE: 2.5, // % per second during normal flight
    CLIMAX_KILL_BONUS: 18,
    CLIMAX_EVADE_BONUS: 30,
    INVULNERABLE_TIME: 1.6, // Seconds after damage
    VULCAN_RATE: 0.05, // Seconds between rounds
  },

  // Scoring Rules
  SCORE: {
    KILL_AIR: 2500,
    KILL_VULCAN: 1000,
    KILL_MISSILE: 2000, // Intercepting enemy missile
    KILL_BOSS_TURRET: 5000,
    KILL_BOSS_CORE: 50000,
    NEAR_MISS_EVADE: 5000,
    COMBO_WINDOW: 3.5, // Seconds to maintain combo multiplier
  },

  // Stages & Biomes Definition
  STAGES: [
    {
      id: 1,
      name: 'STAGE 1: PACIFIC SUNSET COAST',
      biome: 'OCEAN_SUNSET',
      bgmTrack: 'FINAL_TAKE_OFF',
      targetKills: 20,
      fogColor: 0xff6622,
      fogDensity: 0.00065,
      sunColor: 0xffe644,
      waterColor: 0x06162d,
      hasCanyon: false,
      bossStage: false
    },
    {
      id: 2,
      name: 'STAGE 2: GRAND CANYON BADLANDS',
      biome: 'DESERT_CANYON',
      bgmTrack: 'AFTER_BURNER',
      targetKills: 28,
      fogColor: 0xd96820,
      fogDensity: 0.00075,
      sunColor: 0xffaa22,
      waterColor: 0x733215,
      hasCanyon: true,
      bossStage: false
    },
    {
      id: 3,
      name: 'STAGE 3: STRATOSPHERE INTERCEPT [BOSS]',
      biome: 'STRATOSPHERE_NIGHT',
      bgmTrack: 'CLIMAX_BOSS',
      targetKills: 15,
      fogColor: 0x111c38,
      fogDensity: 0.00045,
      sunColor: 0x99ccff,
      waterColor: 0x050a18,
      hasCanyon: false,
      bossStage: true
    }
  ],

  // Audio Tuning
  AUDIO: {
    MASTER_GAIN: 0.85,
    BGM_GAIN: 0.32,
    SFX_GAIN: 0.65,
    ENGINE_GAIN: 0.20,
    TEMPO_BPM: 156
  }
};
