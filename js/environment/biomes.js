/* ============================================================
   AFTER BURNER CLIMAX - BIOME & ATMOSPHERE CONTROLLER
   Multi-Stage Transitions: Ocean Sunset -> Canyon -> Stratosphere
   ============================================================ */

import { CanyonEnvironment } from './canyon.js';
import { CloudSystem } from './volumetric_clouds.js';
import { SpeedLineSystem } from './speedlines.js';

export class BiomeController {
  constructor(scene) {
    this.scene = scene;

    // 1. Dynamic Ocean Plane with Infinite Scrolling Texture
    const oceanCanvas = document.createElement('canvas');
    oceanCanvas.width = 128; oceanCanvas.height = 128;
    const octx = oceanCanvas.getContext('2d');
    octx.fillStyle = '#06162d';
    octx.fillRect(0, 0, 128, 128);
    octx.fillStyle = '#00f0ff';
    octx.fillRect(0, 60, 128, 8); // Cyan wave grid line
    octx.fillStyle = '#ff7700';
    octx.fillRect(60, 0, 8, 128); // Sunset orange crossline

    this.oceanTex = new THREE.CanvasTexture(oceanCanvas);
    this.oceanTex.wrapS = THREE.RepeatWrapping;
    this.oceanTex.wrapT = THREE.RepeatWrapping;
    this.oceanTex.repeat.set(80, 240);

    const oceanGeo = new THREE.PlaneGeometry(14000, 18000);
    this.oceanMat = new THREE.MeshBasicMaterial({ map: this.oceanTex, fog: true });
    this.oceanMesh = new THREE.Mesh(oceanGeo, this.oceanMat);
    this.oceanMesh.rotation.x = -Math.PI / 2;
    this.oceanMesh.position.y = -60;
    this.scene.add(this.oceanMesh);

    // 2. Horizon Celestial Sun Disk
    const sunGeo = new THREE.CircleGeometry(340, 32);
    this.sunMat = new THREE.MeshBasicMaterial({ color: 0xffe644, fog: false });
    this.sunMesh = new THREE.Mesh(sunGeo, this.sunMat);
    this.sunMesh.position.set(0, 120, -3900);
    this.scene.add(this.sunMesh);

    // 3. Subsystems
    this.clouds = new CloudSystem(scene);
    this.canyon = new CanyonEnvironment(scene);
    this.speedLines = new SpeedLineSystem(scene);
  }

  applyStageTheme(stageConfig) {
    // Fog update
    this.scene.fog.color.setHex(stageConfig.fogColor);
    this.scene.fog.density = stageConfig.fogDensity;

    // Sun Disk update
    this.sunMat.color.setHex(stageConfig.sunColor);

    // Ocean / Ground color
    this.oceanMat.color.setHex(stageConfig.waterColor);

    // Canyon activation
    this.canyon.setActive(stageConfig.hasCanyon);

    // Cloud tinting
    this.clouds.setBiomeTheme(stageConfig.biome);
  }

  update(dt, forwardSpeed, isAfterburner, isClimax, playerPos) {
    // Scroll Ocean texture
    this.oceanTex.offset.y -= (forwardSpeed * dt) * 0.0003;

    // Update Subsystems
    this.clouds.update(dt, forwardSpeed);
    this.canyon.update(dt, forwardSpeed);
    this.speedLines.update(dt, forwardSpeed, isAfterburner, isClimax, playerPos);
  }
}
