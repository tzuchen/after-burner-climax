/* ============================================================
   AFTER BURNER CLIMAX - EXPANDED BIOME & ATMOSPHERE CONTROLLER
   PBR Ocean with Dynamic Sun Glint, Rayleigh Sky Dome,
   Anamorphic Lens Flares, God Rays, Continuous Terrain & Weather
   ============================================================ */

import { CanyonEnvironment } from './canyon.js';
import { CloudSystem } from './volumetric_clouds.js';
import { SpeedLineSystem } from './speedlines.js';
import { WeatherSystem } from './weather.js';
import { Advanced3DTerrainEngine } from './terrain_3d.js';
import { ContinuousFractalTerrain } from './continuous_terrain.js';
import { createOceanWaveNormalTexture } from '../models/textures.js';

export class BiomeController {
  constructor(scene) {
    this.scene = scene;

    // 1. Procedural Rayleigh Atmospheric Sky Dome
    this.buildSkyDome();

    // 2. Dynamic PBR Ocean Plane with Procedural Wave Texture
    this.oceanTex = createOceanWaveNormalTexture();
    const oceanGeo = new THREE.PlaneGeometry(16000, 22000, 32, 32);

    this.oceanMat = new THREE.MeshStandardMaterial({
      map: this.oceanTex,
      roughness: 0.18,
      metalness: 0.82,
      fog: true
    });

    this.oceanMesh = new THREE.Mesh(oceanGeo, this.oceanMat);
    this.oceanMesh.rotation.x = -Math.PI / 2;
    this.oceanMesh.position.y = -60;
    this.scene.add(this.oceanMesh);

    // 3. Ocean Sunset Specular Sun Glint Path
    const glintGeo = new THREE.PlaneGeometry(380, 7000);
    const glintCvs = document.createElement('canvas');
    glintCvs.width = 128; glintCvs.height = 512;
    const gctx = glintCvs.getContext('2d');
    const ggrad = gctx.createLinearGradient(0, 0, 128, 0);
    ggrad.addColorStop(0, 'rgba(255, 180, 60, 0)');
    ggrad.addColorStop(0.5, 'rgba(255, 235, 160, 0.55)');
    ggrad.addColorStop(1, 'rgba(255, 180, 60, 0)');
    gctx.fillStyle = ggrad;
    gctx.fillRect(0, 0, 128, 512);

    this.glintTex = new THREE.CanvasTexture(glintCvs);
    this.glintTex.wrapS = THREE.ClampToEdgeWrapping;
    this.glintTex.wrapT = THREE.RepeatWrapping;
    this.glintTex.repeat.set(1, 16);

    this.glintMat = new THREE.MeshBasicMaterial({
      map: this.glintTex,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      fog: true
    });

    this.glintMesh = new THREE.Mesh(glintGeo, this.glintMat);
    this.glintMesh.rotation.x = -Math.PI / 2;
    this.glintMesh.position.set(0, -58, -3500);
    this.scene.add(this.glintMesh);

    // 4. Cinema-Grade Anamorphic Sunset Sun, God Rays & Lens Flares
    this.buildCinematicSunAndLensFlares();

    // 5. Subsystems
    this.fractalTerrain = new ContinuousFractalTerrain(scene);
    this.clouds = new CloudSystem(scene);
    this.canyon = new CanyonEnvironment(scene);
    this.speedLines = new SpeedLineSystem(scene);
    this.weather = new WeatherSystem(scene);
    this.terrain3D = new Advanced3DTerrainEngine(scene);
  }

  buildCinematicSunAndLensFlares() {
    this.sunGroup = new THREE.Group();
    this.sunGroup.position.set(0, 140, -4300);

    // A. Blinding White-Hot Incandescent Sun Disk
    const sunGeo = new THREE.CircleGeometry(360, 36);
    this.sunMat = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
    this.sunMesh = new THREE.Mesh(sunGeo, this.sunMat);
    this.sunGroup.add(this.sunMesh);

    // B. Volumetric Radial Sun Glare Bloom Halo
    const glareCvs = document.createElement('canvas');
    glareCvs.width = 512; glareCvs.height = 512;
    const gctx = glareCvs.getContext('2d');
    const glareGrad = gctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    glareGrad.addColorStop(0.2, 'rgba(255, 220, 140, 0.75)');
    glareGrad.addColorStop(0.55, 'rgba(255, 140, 50, 0.35)');
    glareGrad.addColorStop(1, 'rgba(255, 90, 20, 0)');
    gctx.fillStyle = glareGrad;
    gctx.fillRect(0, 0, 512, 512);

    const glareTex = new THREE.CanvasTexture(glareCvs);
    const glareGeo = new THREE.PlaneGeometry(2600, 2600);
    this.glareMat = new THREE.MeshBasicMaterial({
      map: glareTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false
    });
    this.glareMesh = new THREE.Mesh(glareGeo, this.glareMat);
    this.sunGroup.add(this.glareMesh);

    // C. Cinema Anamorphic Horizontal Lens Flare Streak (Hollywood Cyan/Gold Streak)
    const streakCvs = document.createElement('canvas');
    streakCvs.width = 512; streakCvs.height = 64;
    const sctx = streakCvs.getContext('2d');
    const streakGrad = sctx.createLinearGradient(0, 0, 512, 0);
    streakGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
    streakGrad.addColorStop(0.35, 'rgba(0, 220, 255, 0.45)');
    streakGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
    streakGrad.addColorStop(0.65, 'rgba(255, 180, 50, 0.45)');
    streakGrad.addColorStop(1, 'rgba(255, 120, 0, 0)');
    sctx.fillStyle = streakGrad;
    sctx.fillRect(0, 24, 512, 16);

    const streakTex = new THREE.CanvasTexture(streakCvs);
    const streakGeo = new THREE.PlaneGeometry(8800, 85);
    this.streakMat = new THREE.MeshBasicMaterial({
      map: streakTex,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false
    });
    this.streakMesh = new THREE.Mesh(streakGeo, this.streakMat);
    this.sunGroup.add(this.streakMesh);

    // D. Cascading Atmospheric God Rays (Crepuscular Beams onto Ocean)
    const rayCvs = document.createElement('canvas');
    rayCvs.width = 512; rayCvs.height = 512;
    const rctx = rayCvs.getContext('2d');
    rctx.fillStyle = 'rgba(0, 0, 0, 0)';
    rctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 9; i++) {
      const rayGrad = rctx.createLinearGradient(256, 0, 60 + i * 50, 512);
      rayGrad.addColorStop(0, 'rgba(255, 230, 160, 0.28)');
      rayGrad.addColorStop(0.6, 'rgba(255, 170, 70, 0.12)');
      rayGrad.addColorStop(1, 'rgba(255, 120, 40, 0)');
      rctx.fillStyle = rayGrad;
      rctx.beginPath();
      rctx.moveTo(256, 0);
      rctx.lineTo(30 + i * 55, 512);
      rctx.lineTo(70 + i * 55, 512);
      rctx.closePath();
      rctx.fill();
    }

    const rayTex = new THREE.CanvasTexture(rayCvs);
    const rayGeo = new THREE.PlaneGeometry(3800, 2200);
    this.rayMat = new THREE.MeshBasicMaterial({
      map: rayTex,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false
    });
    this.rayMesh = new THREE.Mesh(rayGeo, this.rayMat);
    this.rayMesh.position.set(0, -280, 20);
    this.sunGroup.add(this.rayMesh);

    // E. Inner & Outer Dynamic Solar Corona Halos
    const coronaGeo1 = new THREE.RingGeometry(350, 680, 36);
    this.coronaMat1 = new THREE.MeshBasicMaterial({
      color: 0xff8811,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.corona1 = new THREE.Mesh(coronaGeo1, this.coronaMat1);
    this.sunGroup.add(this.corona1);

    const coronaGeo2 = new THREE.RingGeometry(650, 1150, 36);
    this.coronaMat2 = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.corona2 = new THREE.Mesh(coronaGeo2, this.coronaMat2);
    this.sunGroup.add(this.corona2);

    this.scene.add(this.sunGroup);
  }

  buildSkyDome() {
    const cvs = document.createElement('canvas');
    cvs.width = 256; cvs.height = 512;
    const ctx = cvs.getContext('2d');

    // Rayleigh scattering twilight sunset sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0.0, '#0c172d'); // Zenith dark sapphire
    skyGrad.addColorStop(0.35, '#312040'); // Twilight violet
    skyGrad.addColorStop(0.65, '#c23d1d'); // Blazing dusk crimson
    skyGrad.addColorStop(0.85, '#ff7a1f'); // Warm sunset orange
    skyGrad.addColorStop(1.0, '#ffc86b'); // Golden horizon glow

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 256, 512);

    this.skyTex = new THREE.CanvasTexture(cvs);
    const skyGeo = new THREE.SphereGeometry(6800, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const skyMat = new THREE.MeshBasicMaterial({
      map: this.skyTex,
      side: THREE.BackSide,
      fog: false
    });

    this.skyDome = new THREE.Mesh(skyGeo, skyMat);
    this.skyDome.position.set(0, -60, 0);
    this.scene.add(this.skyDome);
  }

  applyStageTheme(stageConfig) {
    // Fog update
    this.scene.fog.color.setHex(stageConfig.fogColor);
    this.scene.fog.density = stageConfig.fogDensity;

    // Sun / Moon Disk update
    this.sunMat.color.setHex(stageConfig.sunColor);

    // Adjust Sun Corona & Flare Colors based on Biome
    if (stageConfig.biome === 'STRATOSPHERE_NIGHT') {
      this.coronaMat1.color.setHex(0x3366cc);
      this.coronaMat2.color.setHex(0x112266);
      this.glareMat.color.setHex(0x5588ee);
      this.streakMat.color.setHex(0x00aaff);
      this.rayMesh.visible = false;
      this.glintMesh.visible = false;
    } else if (stageConfig.biome === 'POLAR_ICE') {
      this.coronaMat1.color.setHex(0x88ccff);
      this.coronaMat2.color.setHex(0x3388bb);
      this.glareMat.color.setHex(0xaaddff);
      this.streakMat.color.setHex(0x00ffff);
      this.rayMesh.visible = true;
      this.rayMat.color.setHex(0xaae0ff);
      this.glintMesh.visible = true;
      this.glintMat.color.setHex(0x99ddff);
    } else if (stageConfig.biome === 'VOLCANIC_MAGMA') {
      this.coronaMat1.color.setHex(0xff2200);
      this.coronaMat2.color.setHex(0x880000);
      this.glareMat.color.setHex(0xff4411);
      this.streakMat.color.setHex(0xff3300);
      this.rayMesh.visible = true;
      this.rayMat.color.setHex(0xff5511);
      this.glintMesh.visible = true;
      this.glintMat.color.setHex(0xff4400);
    } else {
      // Ocean Sunset & Canyon
      this.coronaMat1.color.setHex(0xff8811);
      this.coronaMat2.color.setHex(0xff4400);
      this.glareMat.color.setHex(0xffdd88);
      this.streakMat.color.setHex(0xffffff);
      this.rayMesh.visible = true;
      this.rayMat.color.setHex(0xffe088);
      this.glintMesh.visible = true;
      this.glintMat.color.setHex(0xffe6a0);
    }

    // Ground Color
    this.oceanMat.color.setHex(stageConfig.waterColor);

    // Canyon activation
    this.canyon.setActive(stageConfig.hasCanyon && stageConfig.biome === 'DESERT_CANYON');

    // 3D Procedural Terrain activation
    this.fractalTerrain.setBiome(stageConfig.biome);
    this.terrain3D.setBiome(stageConfig.biome);

    // Weather activation
    this.weather.setWeather(stageConfig.biome);

    // Cloud tinting
    this.clouds.setBiomeTheme(stageConfig.biome);
  }

  update(dt, forwardSpeed, isAfterburner, isClimax, playerPos, onThreadNeedle) {
    const scrollAmount = (forwardSpeed * dt) * 0.00035;

    // Scroll Ocean texture
    if (this.oceanTex) {
      this.oceanTex.offset.y -= scrollAmount;
      // Gentle rhythmic ocean swell drift
      this.oceanTex.offset.x = Math.sin(performance.now() * 0.0008) * 0.02;
    }

    // Scroll Sun Glint shimmer path
    if (this.glintTex && this.glintMesh.visible) {
      this.glintTex.offset.y -= scrollAmount * 1.5;
      if (playerPos) {
        this.glintMesh.position.x = playerPos.x * 0.35;
      }
    }

    // Dynamic Solar Corona & Flare Pulse
    const time = performance.now() * 0.002;
    if (this.corona1 && this.corona2) {
      const pulse1 = 1.0 + Math.sin(time) * 0.05;
      const pulse2 = 1.0 + Math.cos(time * 0.8) * 0.07;
      this.corona1.scale.set(pulse1, pulse1, 1);
      this.corona2.scale.set(pulse2, pulse2, 1);

      // Micro-shimmer on anamorphic streak
      if (this.streakMesh) {
        const streakPulse = 1.0 + Math.sin(time * 2.5) * 0.08;
        this.streakMesh.scale.set(1.0, streakPulse, 1.0);
      }
    }

    // Update Subsystems
    this.fractalTerrain.update(dt, forwardSpeed);
    this.clouds.update(dt, forwardSpeed);
    this.canyon.update(dt, forwardSpeed, playerPos, onThreadNeedle);
    this.terrain3D.update(dt, forwardSpeed);
    this.weather.update(dt, forwardSpeed);
    this.speedLines.update(dt, forwardSpeed, isAfterburner, isClimax, playerPos);
  }
}
