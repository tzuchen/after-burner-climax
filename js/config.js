/* ============================================================
   AFTER BURNER CLIMAX - EXPANDED CONFIGURATION MODULE
   Multi-Aircraft Fleet, Branching Campaign Tree, Special Weapons
   ============================================================ */

export const CONFIG = {
  VERSION: '3.0.0-PRO-EXPANDED',
  TITLE: 'AFTER BURNER CLIMAX: LEGACY EDITION - EXPANDED CAMPAIGN',

  // Playable Fighter Fleet Roster
  AIRCRAFT_FLEET: [
    {
      id: 'F14D',
      name: 'F-14D SUPER TOMCAT',
      category: 'VARIABLE-SWEEP INTERCEPTOR',
      description: 'Legendary U.S. Navy supersonic interceptor with dynamic swing wings and long-range AIM-54 Phoenix multi-lock missiles.',
      stats: { speed: 92, armor: 88, mobility: 82, payload: 95 },
      topSpeedMach: 3.8,
      cruiseSpeed: 950,
      afterburnerSpeed: 1850,
      rollRate: 0.40,
      specialWeapon: {
        name: 'AIM-54 PHOENIX (HEXA-LOCK)',
        type: 'MULTI_HOMING',
        ammo: 12,
        lockCount: 6,
        range: 3500,
        damage: 100
      },
      hasSwingWings: true,
      cockpitStyle: 'ANALOG_TANDEM'
    },
    {
      id: 'F15E',
      name: 'F-15E STRIKE EAGLE',
      category: 'HEAVY AIR SUPERIORITY',
      description: 'Twin-engine all-weather strike fighter. Maximum acceleration and devastating heavy penetration bunker-buster munitions.',
      stats: { speed: 100, armor: 92, mobility: 78, payload: 90 },
      topSpeedMach: 4.2,
      cruiseSpeed: 1050,
      afterburnerSpeed: 2100,
      rollRate: 0.45,
      specialWeapon: {
        name: 'CBU-97 CLUSTER DISPERSER',
        type: 'CLUSTER_BOMB',
        ammo: 8,
        lockCount: 8,
        range: 2200,
        damage: 150
      },
      hasSwingWings: false,
      cockpitStyle: 'DIGITAL_MFD'
    },
    {
      id: 'FA18E',
      name: 'F/A-18E SUPER HORNET',
      category: 'HIGH-AGILITY MULTIROLE',
      description: 'Extreme maneuverability with leading-edge vortex lift and High-Off-Boresight AIM-9X Sidewinder missiles.',
      stats: { speed: 85, armor: 80, mobility: 98, payload: 85 },
      topSpeedMach: 3.4,
      cruiseSpeed: 900,
      afterburnerSpeed: 1750,
      rollRate: 0.35,
      specialWeapon: {
        name: 'AIM-9X HIGH-OFF-BORESIGHT',
        type: 'AGILE_HOMING',
        ammo: 16,
        lockCount: 4,
        range: 2600,
        damage: 85
      },
      hasSwingWings: false,
      cockpitStyle: 'GLASS_TOUCH'
    },
    {
      id: 'A10C',
      name: 'A-10C WARTHOG (TANK BUSTER)',
      category: 'CLOSE AIR SUPPORT BRAWLER',
      description: 'Titanium-armored flying gun. Features the devastating GAU-8/A 30mm Avenger 7-barrel Gatling rotary cannon (BRRRTT!).',
      stats: { speed: 65, armor: 100, mobility: 70, payload: 100 },
      topSpeedMach: 2.2,
      cruiseSpeed: 780,
      afterburnerSpeed: 1350,
      rollRate: 0.50,
      specialWeapon: {
        name: 'GAU-8/A 30mm ROTARY CANNON',
        type: 'GATLING_BURST',
        ammo: 24,
        lockCount: 1,
        range: 1800,
        damage: 250
      },
      hasSwingWings: false,
      cockpitStyle: 'TITANIUM_TUB'
    }
  ],

  // Countermeasures
  FLARES: {
    INITIAL_COUNT: 15,
    BURST_COUNT: 4,
    DECOY_RADIUS: 250,
    COOLDOWN: 1.2
  },

  // Flight Physics & Speeds
  SPEED: {
    CRUISE: 950,
    AFTERBURNER: 1850,
    CLIMAX_MULTIPLIER: 0.32,
    ACCELERATION_LERP: 5.0,
    BANK_FACTOR: 0.022,
    PITCH_FACTOR: 0.018,
    ROLL_DURATION: 0.42
  },

  // Player Aircraft Base Vitals
  PLAYER: {
    MAX_ARMOR: 100,
    INITIAL_MISSILES: 60,
    INITIAL_CLIMAX: 100,
    CLIMAX_DURATION: 7.0,
    CLIMAX_RECHARGE_RATE: 2.5,
    CLIMAX_KILL_BONUS: 18,
    CLIMAX_EVADE_BONUS: 30,
    INVULNERABLE_TIME: 1.6,
    VULCAN_RATE: 0.05
  },

  // Scoring Rules
  SCORE: {
    KILL_AIR: 2500,
    KILL_VULCAN: 1000,
    KILL_MISSILE: 2000,
    KILL_BOSS_TURRET: 5000,
    KILL_BOSS_CORE: 50000,
    NEAR_MISS_EVADE: 5000,
    FLARE_DECOY_SUCCESS: 3000,
    COMBO_WINDOW: 3.5
  },

  // Branching Campaign Mission Tree (6 Stages)
  STAGES: [
    {
      id: 1,
      code: 'STAGE_1',
      name: 'MISSION 01: AZURE PACIFIC BLUE SKY',
      briefing: 'Carrier fleet launch under clear sunny skies. Intercept hostile fighter patrols over the boundless blue ocean.',
      biome: 'OCEAN_BLUESKY',
      bgmTrack: 'FINAL_TAKE_OFF',
      targetKills: 36, // Scaled for authentic arcade stage duration (~60s)
      fogColor: 0x88ccee,
      fogDensity: 0.00035,
      sunColor: 0xffffff,
      waterColor: 0x0a5288,
      terrainType: 'OCEAN',
      hasCanyon: false,
      bossStage: false,
      routes: [
        { name: 'ROUTE A: MOUNTAIN PASS (CANAL)', nextStageIndex: 1 },
        { name: 'ROUTE B: POLAR GLACIERS', nextStageIndex: 2 }
      ]
    },
    {
      id: 2,
      code: 'STAGE_2A',
      name: 'MISSION 02A: GRAND CANYON BADLANDS',
      briefing: 'Maintain low altitude below radar ceiling. Navigate through towering red sandstone rock pillars.',
      biome: 'DESERT_CANYON',
      bgmTrack: 'AFTER_BURNER',
      targetKills: 40,
      fogColor: 0xd96820,
      fogDensity: 0.00075,
      sunColor: 0xffaa22,
      waterColor: 0x733215,
      terrainType: 'CANYON_ROCKS',
      hasCanyon: true,
      bossStage: false,
      routes: [
        { name: 'ROUTE A: VOLCANIC CALDERA', nextStageIndex: 3 },
        { name: 'ROUTE B: CYBER METROPOLIS', nextStageIndex: 4 }
      ]
    },
    {
      id: 3,
      code: 'STAGE_2B',
      name: 'MISSION 02B: POLAR GLACIER STRAITS',
      briefing: 'Sub-zero frozen waters. High-speed blizzard conditions and icy fjord dogfighting.',
      biome: 'POLAR_ICE',
      bgmTrack: 'MAXIMUM_POWER',
      targetKills: 40,
      fogColor: 0x3d7099,
      fogDensity: 0.00070,
      sunColor: 0xddeeff,
      waterColor: 0x162c42,
      terrainType: 'ICEBERGS',
      hasCanyon: true,
      bossStage: false,
      routes: [
        { name: 'ROUTE A: CYBER METROPOLIS', nextStageIndex: 4 },
        { name: 'ROUTE B: VOLCANIC CALDERA', nextStageIndex: 3 }
      ]
    },
    {
      id: 4,
      code: 'STAGE_3A',
      name: 'MISSION 03A: VOLCANIC CALDERA RIFT',
      briefing: 'Extreme thermal conditions. Flying over molten magma rivers with falling ash and convection plumes.',
      biome: 'VOLCANIC_MAGMA',
      bgmTrack: 'RED_OUT',
      targetKills: 44,
      fogColor: 0x881a08,
      fogDensity: 0.00085,
      sunColor: 0xff4400,
      waterColor: 0xff2200,
      terrainType: 'VOLCANO',
      hasCanyon: true,
      bossStage: false,
      routes: [
        { name: 'PROCEED TO STRATOSPHERE ORBITAL LAUNCH FACILITY', nextStageIndex: 5 }
      ]
    },
    {
      id: 5,
      code: 'STAGE_3B',
      name: 'MISSION 03B: CYBER METROPOLIS NIGHT',
      briefing: 'Nighttime high-altitude interception above futuristic neon illuminated mega-skyscrapers.',
      biome: 'METROPOLIS_NIGHT',
      bgmTrack: 'GREAT_HARMONY',
      targetKills: 44,
      fogColor: 0x0d162b,
      fogDensity: 0.00060,
      sunColor: 0x00f0ff,
      waterColor: 0x040814,
      terrainType: 'SKYSCRAPERS',
      hasCanyon: false,
      bossStage: false,
      routes: [
        { name: 'PROCEED TO STRATOSPHERE ORBITAL LAUNCH FACILITY', nextStageIndex: 5 }
      ]
    },
    {
      id: 6,
      code: 'STAGE_4_BOSS',
      name: 'FINAL MISSION: STRATOSPHERE INTERCEPT [BOSS: XB-0]',
      briefing: 'Intercept the enemy airborne flagship: Aerial Superfortress XB-0 HRAESVELGR. Eliminate all defensive arrays and crack the core reactor!',
      biome: 'STRATOSPHERE_NIGHT',
      bgmTrack: 'SUPER_SONIC',
      targetKills: 15,
      fogColor: 0x0c152a,
      fogDensity: 0.00045,
      sunColor: 0x99ccff,
      waterColor: 0x040810,
      terrainType: 'HIGH_ALTITUDE',
      hasCanyon: false,
      bossStage: true,
      routes: []
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
