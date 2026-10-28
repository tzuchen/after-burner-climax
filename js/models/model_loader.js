/* ============================================================
   AFTER BURNER CLIMAX - HIGH-DEFINITION 3D GLTF MODEL MANAGER
   Loads Authentic 3D Polygonal Models for F-14D, F-15E, F/A-18, A-10 & Su-27
   Features: Real-World Meter Scaling, PBR Reflections, Afterburners & VFX
   ============================================================ */

export class GLTFModelManager {
  constructor() {
    this.models = new Map();
    this.loaded = false;
    this.loading = false;
    this.onLoadCallbacks = [];

    this.modelConfigs = {
      F14D: {
        path: 'assets/models/low_poly_f14_tomcat.glb',
        scale: 4.2,
        rotY: 0,
        rotX: 0,
        offsetY: 0,
        offsetZ: 0,
        exhaustOffsets: [[-1.9, -0.2, 8.8], [1.9, -0.2, 8.8]]
      },
      F15E: {
        path: 'assets/models/f15c.glb',
        scale: 1.15,
        rotY: Math.PI,
        rotX: 0,
        offsetY: 0,
        offsetZ: 0,
        exhaustOffsets: [[-1.8, -0.2, 8.5], [1.8, -0.2, 8.5]]
      },
      FA18E: {
        path: 'assets/models/fa18c.glb',
        scale: 1.15,
        rotY: 0,
        rotX: 0,
        offsetY: 0,
        offsetZ: 0,
        exhaustOffsets: [[-1.6, -0.2, 8.2], [1.6, -0.2, 8.2]]
      },
      A10C: {
        path: 'assets/models/a-10_thunderbolt_ii_warthog_plane__avion.glb',
        scale: 0.26,
        rotY: Math.PI,
        rotX: -Math.PI / 2,
        offsetY: 0,
        offsetZ: 0,
        exhaustOffsets: [[-2.4, 2.4, 8.5], [2.4, 2.4, 8.5]]
      },
      SU27: {
        path: 'assets/models/su27s.glb',
        scale: 1.05,
        rotY: Math.PI, // Face toward player (+Z) for enemy interception!
        rotX: 0,
        offsetY: 0,
        offsetZ: 0,
        exhaustOffsets: [[-1.8, -0.3, -8.5], [1.8, -0.3, -8.5]]
      }
    };
  }

  loadAll(onComplete) {
    if (this.loaded) {
      if (onComplete) onComplete();
      return;
    }

    if (onComplete) this.onLoadCallbacks.push(onComplete);
    if (this.loading) return;
    this.loading = true;

    if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
      console.warn("THREE.GLTFLoader not available, using procedural fallback");
      this.loaded = true;
      this.loading = false;
      this.triggerComplete();
      return;
    }

    const loader = new THREE.GLTFLoader();
    const keys = Object.keys(this.modelConfigs);
    let loadedCount = 0;
    const totalCount = keys.length;

    keys.forEach(key => {
      const cfg = this.modelConfigs[key];
      loader.load(
        cfg.path,
        gltf => {
          this.processLoadedModel(key, gltf.scene, cfg);
          loadedCount++;
          if (loadedCount === totalCount) {
            this.loaded = true;
            this.loading = false;
            this.triggerComplete();
          }
        },
        undefined,
        err => {
          console.warn(`Failed to load 3D GLTF model for ${key}:`, err);
          loadedCount++;
          if (loadedCount === totalCount) {
            this.loaded = true;
            this.loading = false;
            this.triggerComplete();
          }
        }
      );
    });
  }

  triggerComplete() {
    this.onLoadCallbacks.forEach(cb => {
      try { cb(); } catch (e) { console.error(e); }
    });
    this.onLoadCallbacks = [];
  }

  processLoadedModel(key, scene, cfg) {
    // Traverse and optimize materials for arcade PBR rendering
    scene.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          // Enhance gloss and specular response for commercial arcade look
          child.material.roughness = Math.min(child.material.roughness || 0.4, 0.45);
          child.material.metalness = Math.max(child.material.metalness || 0.3, 0.55);
          if (child.material.map) {
            child.material.map.anisotropy = 4;
          }
        }
      }
    });

    // Apply rotation & scaling
    if (cfg.rotX) scene.rotation.x = cfg.rotX;
    if (cfg.rotY) scene.rotation.y = cfg.rotY;
    scene.scale.set(cfg.scale, cfg.scale, cfg.scale);
    scene.position.set(0, cfg.offsetY, cfg.offsetZ);

    this.models.set(key, scene);
  }

  hasModel(key) {
    return this.models.has(key);
  }

  getModel(key) {
    const raw = this.models.get(key);
    if (!raw) return null;
    return raw.clone(true);
  }

  /**
   * Builds an enhanced high-fidelity aircraft container
   * with GLTF 3D model and attached arcade afterburner VFX
   */
  createEnhancedAircraft(id, fallbackMesh) {
    const group = new THREE.Group();
    const cfg = this.modelConfigs[id] || this.modelConfigs.F14D;

    let visualMesh = null;
    if (this.hasModel(id)) {
      visualMesh = this.getModel(id);
    } else if (fallbackMesh) {
      visualMesh = fallbackMesh;
    }

    if (visualMesh) {
      group.add(visualMesh);
    }

    // Attach High-Energy Afterburner Plumes, Firelight & Shock Diamonds
    const flames = [];
    const shockDiamonds = [];

    // Dynamic Exhaust Point Light (illuminates rear airframe & tail in firelight)
    const exhaustLight = new THREE.PointLight(0xff5500, 2.8, 48);
    const avgOz = cfg.exhaustOffsets.length > 0 ? cfg.exhaustOffsets[0][2] : 8.5;
    exhaustLight.position.set(0, -0.2, avgOz + 2.0);
    group.add(exhaustLight);

    const flameMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.88 });
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
    const diamondMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });
    const diamondGeo = new THREE.OctahedronGeometry(0.38, 0);

    cfg.exhaustOffsets.forEach(([ox, oy, oz]) => {
      // Outer cone
      const outerGeo = new THREE.ConeGeometry(1.15, 14, 16).rotateX(-Math.PI / 2);
      const outerFlame = new THREE.Mesh(outerGeo, flameMat.clone());
      outerFlame.position.set(ox, oy, oz + 6.0);
      group.add(outerFlame);
      flames.push(outerFlame);

      // Inner white-hot core
      const innerGeo = new THREE.ConeGeometry(0.48, 8, 12).rotateX(-Math.PI / 2);
      const innerFlame = new THREE.Mesh(innerGeo, coreMat.clone());
      innerFlame.position.set(ox, oy, oz + 3.0);
      group.add(innerFlame);
      flames.push(innerFlame);

      // Stacked Supersonic Shock Diamonds
      for (let d = 0; d < 3; d++) {
        const dia = new THREE.Mesh(diamondGeo, diamondMat);
        dia.position.set(ox, oy, oz + 2.0 + d * 2.5);
        group.add(dia);
        shockDiamonds.push(dia);
      }
    });

    const updateVFX = (dt, state, targetPitch, now) => {
      if (exhaustLight) {
        const isAB = state.isAfterburner || state.isClimax;
        const baseIntensity = state.isClimax ? 5.5 : (state.isAfterburner ? 4.2 : 1.5);
        const flicker = 1.0 + Math.sin(now * 0.15) * 0.18 + (Math.random() - 0.5) * 0.15;
        exhaustLight.intensity = baseIntensity * flicker;
        exhaustLight.color.setHex(state.isClimax ? 0x00f0ff : (state.isAfterburner ? 0xff4400 : 0xff7722));
      }

      const flameScale = (state.isClimax ? 3.2 : (state.isAfterburner ? 2.8 : 1.2)) + Math.sin(now * 0.08) * 0.25;
      const flameColor = state.isClimax ? 0x2288ff : (state.isAfterburner ? 0xff4400 : 0x00d0ff);
      const coreColor = state.isClimax ? 0xffffff : (state.isAfterburner ? 0xffeeaa : 0xffffff);

      flames.forEach((f, idx) => {
        f.scale.set(1, flameScale, 1);
        if (f.material && f.material.color) {
          f.material.color.setHex(idx % 2 === 0 ? flameColor : coreColor);
        }
      });

      const diamondScale = state.isAfterburner ? (1.0 + Math.sin(now * 0.1) * 0.3) : 0.4;
      shockDiamonds.forEach(sd => {
        sd.scale.set(diamondScale, diamondScale, diamondScale);
        sd.visible = state.isAfterburner || state.isClimax;
      });
    };

    return {
      group: group,
      visualMesh: visualMesh,
      update: updateVFX
    };
  }
}

export const modelManager = new GLTFModelManager();
