/* ============================================================
   AFTER BURNER CLIMAX - EXPANDED BIOME & ATMOSPHERE CONTROLLER
   PBR Ocean with Dynamic Sun Glint, Rayleigh Sky Dome,
   Canyons, 3D Terrains, Multi-Lobe Clouds, Weather, Speedlines
   ============================================================ */

import { CanyonEnvironment } from './canyon.js';
import { CloudSystem } from './volumetric_clouds.js';
import { SpeedLineSystem } from './speedlines.js';
import { WeatherSystem } from './weather.js';
import { Advanced3DTerrainEngine } from './terrain_3d.js';
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

    // 3. Ocean Sunset Specular Sun Glint Path (Golden light path dancing toward player)
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

    // 4. Horizon Celestial Sun & Corona Halos
    this.sunGroup = new THREE.Group();
    this.sunGroup.position.set(0, 140, -4200);

    // Sun core disk
    const sunGeo = new THREE.CircleGeometry(360, 36);
    this.sunMat = new THREE.MeshBasicMaterial({ color: 0xffea55, fog: false });
    this.sunMesh = new THREE.Mesh(sunGeo, this.sunMat);
    this.sunGroup.add(this.sunMesh);

    // Inner Corona Halo
    const coronaGeo1 = new THREE.RingGeometry(350, 680, 36);
    this.coronaMat1 = new THREE.MeshBasicMaterial({
      color: 0xff8811,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.corona1 = new THREE.Mesh(coronaGeo1, this.coronaMat1);
    this.sunGroup.add(this.corona1);

    // Outer Corona Flare Halo
    const coronaGeo2 = new THREE.RingGeometry(650, 1100, 36);
    this.coronaMat2 = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    this.corona2 = new THREE.Mesh(coronaGeo2, this.coronaMat2);
    this.sunGroup.add(this.corona2);

    this.scene.add(this.sunGroup);

    // 5. Subsystems
    this.clouds = new CloudSystem(scene);
    this.canyon = new CanyonEnvironment(scene);
    this.speedLines = new SpeedLineSystem(scene);
    this.weather = new WeatherSystem(scene);
    this.terrain3D = new Advanced3DTerrainEngine(scene);
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

    // Adjust Sun Corona Colors based on Biome
    if (stageConfig.biome === 'STRATOSPHERE_NIGHT') {
      this.coronaMat1.color.setHex(0x3366cc);
      this.coronaMat2.color.setHex(0x112266);
      this.glintMesh.visible = false;
    } else if (stageConfig.biome === 'POLAR_ICE') {
      this.coronaMat1.color.setHex(0x88ccff);
      this.coronaMat2.color.setHex(0x3388bb);
      this.glintMesh.visible = true;
      this.glintMat.color.setHex(0x99ddff);
    } else if (stageConfig.biome === 'VOLCANIC_MAGMA') {
      this.coronaMat1.color.setHex(0xff2200);
      this.coronaMat2.color.setHex(0x880000);
      this.glintMesh.visible = true;
      this.glintMat.color.setHex(0xff4400);
    } else {
      // Ocean Sunset & Canyon
      this.coronaMat1.color.setHex(0xff8811);
      this.coronaMat2.color.setHex(0xff4400);
      this.glintMesh.visible = true;
      this.glintMat.color.setHex(0xffe6a0);
    }

    // Ground Color
    this.oceanMat.color.setHex(stageConfig.waterColor);

    // Canyon activation
    this.canyon.setActive(stageConfig.hasCanyon && stageConfig.biome === 'DESERT_CANYON');

    // 3D Procedural Terrain activation
    this.terrain3D.setBiome(stageConfig.biome);

    // Weather activation
    this.weather.setWeather(stageConfig.biome);

    // Cloud tinting
    this.clouds.setBiomeTheme(stageConfig.biome);
  }

  update(dt, forwardSpeed, isAfterburner, isClimax, playerPos) {
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
      // Slightly sway glint path with player bank
      if (playerPos) {
        this.glintMesh.position.x = playerPos.x * 0.35;
      }
    }

    // Pulse corona halos
    const time = performance.now() * 0.002;
    if (this.corona1 && this.corona2) {
      const pulse1 = 1.0 + Math.sin(time) * 0.04;
      const pulse2 = 1.0 + Math.cos(time * 0.8) * 0.06;
      this.corona1.scale.set(pulse1, pulse1, 1);
      this.corona2.scale.set(pulse2, pulse2, 1);
    }

    // Update Subsystems
    this.clouds.update(dt, forwardSpeed);
    this.canyon.update(dt, forwardSpeed);
    this.terrain3D.update(dt, forwardSpeed);
    this.weather.update(dt, forwardSpeed);
    this.speedLines.update(dt, forwardSpeed, isAfterburner, isClimax, playerPos);
  }
}
