/* ============================================================
   AFTER BURNER CLIMAX - HIGH-DEFINITION PROCEDURAL MILITARY TEXTURES
   1024x1024 PBR Canvas Textures: Naval Camo, Aggressor Splinter,
   Boss Hex Armor, Avionics Glass Cockpit & Caustic Ocean Normal Map
   ============================================================ */

/**
 * Creates 1024x1024 US Navy Ghost Gray PBR Tactical Camouflage Texture
 * Features: 2-tone low-viz camo, double rivet seams, Jolly Rogers insignia,
 * U.S. Navy roundel, 'NO STEP' maintenance stencils, and luminescent slime lights.
 */
export function createNavalCamoTexture() {
  if (typeof document === 'undefined') return null;

  const cvs = document.createElement('canvas');
  cvs.width = 1024;
  cvs.height = 1024;
  const ctx = cvs.getContext('2d');

  // 1. Base Coat: Naval Tactical Ghost Gray with subtle dapple noise
  ctx.fillStyle = '#657688';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle tonal variation (airbrushed panel modulation)
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, 'rgba(125, 142, 160, 0.25)');
  grad.addColorStop(0.5, 'rgba(85, 100, 116, 0.15)');
  grad.addColorStop(1, 'rgba(60, 72, 84, 0.35)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Low-Visibility Camouflage Soft Blotches (USN TPS Camouflage)
  ctx.fillStyle = '#4e5e70';
  ctx.beginPath();
  ctx.moveTo(0, 180);
  ctx.bezierCurveTo(220, 120, 380, 260, 560, 140);
  ctx.bezierCurveTo(740, 20, 880, 200, 1024, 110);
  ctx.lineTo(1024, 480);
  ctx.bezierCurveTo(860, 520, 680, 390, 500, 460);
  ctx.bezierCurveTo(320, 530, 140, 410, 0, 490);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#3f4c5a';
  ctx.beginPath();
  ctx.moveTo(0, 720);
  ctx.bezierCurveTo(180, 680, 320, 820, 512, 740);
  ctx.bezierCurveTo(704, 660, 860, 800, 1024, 710);
  ctx.lineTo(1024, 1024);
  ctx.lineTo(0, 1024);
  ctx.closePath();
  ctx.fill();

  // 3. Panel Seams Grid with Beveled Highlights (3D plate depth)
  ctx.lineWidth = 2;
  const panelStep = 128;

  // Dark seam grooves
  ctx.strokeStyle = 'rgba(25, 32, 40, 0.75)';
  for (let x = panelStep; x < 1024; x += panelStep) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke();
  }
  for (let y = panelStep; y < 1024; y += panelStep) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
  }

  // Specular edge highlight (1px offset)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1;
  for (let x = panelStep; x < 1024; x += panelStep) {
    ctx.beginPath(); ctx.moveTo(x + 1.5, 0); ctx.lineTo(x + 1.5, 1024); ctx.stroke();
  }
  for (let y = panelStep; y < 1024; y += panelStep) {
    ctx.beginPath(); ctx.moveTo(0, y + 1.5); ctx.lineTo(1024, y + 1.5); ctx.stroke();
  }

  // 4. Double Rivet Seam Rows
  ctx.fillStyle = 'rgba(20, 26, 32, 0.65)';
  for (let x = panelStep; x < 1024; x += panelStep) {
    for (let y = 8; y < 1024; y += 16) {
      ctx.fillRect(x - 5, y, 2, 2);
      ctx.fillRect(x + 4, y, 2, 2);
    }
  }
  for (let y = panelStep; y < 1024; y += panelStep) {
    for (let x = 8; x < 1024; x += 16) {
      ctx.fillRect(x, y - 5, 2, 2);
      ctx.fillRect(x, y + 4, 2, 2);
    }
  }

  // 5. Luminescent Formation 'Slime Lights' (Radioactive Lime-Green strips)
  const slimeLights = [
    { x: 32, y: 64, w: 18, h: 140 },
    { x: 974, y: 64, w: 18, h: 140 },
    { x: 32, y: 820, w: 18, h: 140 },
    { x: 974, y: 820, w: 18, h: 140 }
  ];

  slimeLights.forEach(sl => {
    // Dark rubber gasket border
    ctx.fillStyle = '#15171a';
    ctx.fillRect(sl.x - 3, sl.y - 3, sl.w + 6, sl.h + 6);
    // Luminescent neon green core
    ctx.fillStyle = '#44ff44';
    ctx.fillRect(sl.x, sl.y, sl.w, sl.h);
    // Bright center filament
    ctx.fillStyle = '#ccffbb';
    ctx.fillRect(sl.x + 4, sl.y + 4, sl.w - 8, sl.h - 8);
  });

  // 6. Anti-Glare Matte Black Nose Shield
  ctx.fillStyle = '#181b1f';
  ctx.beginPath();
  ctx.moveTo(430, 0);
  ctx.lineTo(594, 0);
  ctx.lineTo(564, 240);
  ctx.lineTo(460, 240);
  ctx.closePath();
  ctx.fill();

  // 7. Low-Visibility U.S. Navy Star-and-Bar Roundel
  ctx.save();
  ctx.translate(512, 780);
  // Low-viz dark blue-gray backing
  ctx.fillStyle = '#2d3a4b';
  ctx.fillRect(-150, -36, 300, 72);
  // Red centerline stripe (subdued low-viz)
  ctx.fillStyle = '#6e2b34';
  ctx.fillRect(-150, -8, 300, 16);
  // White/light gray central circle & star
  ctx.fillStyle = '#9cb0c6';
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.fill();

  // Subdued Star
  ctx.fillStyle = '#2d3a4b';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = Math.cos(a) * 44;
    const py = Math.sin(a) * 44;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 8. VF-84 'Jolly Rogers' Skull & Crossbones Tail Emblem
  ctx.save();
  ctx.translate(256, 320);
  // Black chevron backing
  ctx.fillStyle = '#141618';
  ctx.beginPath();
  ctx.moveTo(0, -90);
  ctx.lineTo(90, 80);
  ctx.lineTo(0, 55);
  ctx.lineTo(-90, 80);
  ctx.closePath();
  ctx.fill();

  // White bones
  ctx.strokeStyle = '#e6edf5';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-50, -35); ctx.lineTo(50, 45);
  ctx.moveTo(50, -35); ctx.lineTo(-50, 45);
  ctx.stroke();

  // White skull
  ctx.fillStyle = '#e6edf5';
  ctx.beginPath();
  ctx.arc(0, -10, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-14, 8, 28, 18);

  // Skull eye sockets & nose
  ctx.fillStyle = '#141618';
  ctx.beginPath();
  ctx.arc(-10, -8, 6, 0, Math.PI * 2);
  ctx.arc(10, -8, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-3, 4, 6, 8);
  ctx.restore();

  // 9. Maintenance Warning Stencils & Markings
  ctx.fillStyle = 'rgba(230, 240, 255, 0.85)';
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.fillText('NAVY 101', 60, 960);
  ctx.fillText('VF-84 JOLLY ROGERS', 580, 960);
  ctx.font = '14px "Courier New", monospace';
  ctx.fillText('BUREAU NO. 160390', 60, 985);
  ctx.fillText('CARRIER AIR WING 8 - USS NIMITZ', 580, 985);

  // 'NO STEP' Stencils along wings/flaps
  ctx.fillStyle = 'rgba(200, 215, 230, 0.7)';
  ctx.font = 'bold 13px sans-serif';
  const noStepCoords = [
    [160, 160], [160, 480], [160, 680],
    [760, 160], [760, 480], [760, 680]
  ];
  noStepCoords.forEach(([nx, ny]) => {
    ctx.strokeRect(nx - 6, ny - 14, 88, 20);
    ctx.fillText('NO STEP', nx, ny);
  });

  // Jet Intake Warning Triangles
  ctx.strokeStyle = '#b82a2a';
  ctx.lineWidth = 3;
  ctx.strokeRect(410, 480, 204, 38);
  ctx.fillStyle = '#b82a2a';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('DANGER - JET INTAKE', 426, 505);

  // Rescue Arrow
  ctx.fillStyle = '#e69900';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('➔ RESCUE / CANOPY RELEASE', 390, 280);

  const tex = new THREE.CanvasTexture(cvs);
  tex.anisotropy = 4;
  return tex;
}

/**
 * Creates 1024x1024 Russian Aggressor Digital Splinter Camouflage Texture
 * Features: 3-tone polygonal splinter camo (cobalt, sky blue, dark charcoal),
 * carbon composite grid, Russian red star roundel, and 'RED 07' bort marking.
 */
export function createAggressorCamoTexture() {
  if (typeof document === 'undefined') return null;

  const cvs = document.createElement('canvas');
  cvs.width = 1024;
  cvs.height = 1024;
  const ctx = cvs.getContext('2d');

  // 1. Dark Cobalt Air Superiority Base
  ctx.fillStyle = '#1c2d3d';
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Polygonal Splinter Layer 1: Tactical Medium Blue (#396486)
  ctx.fillStyle = '#396486';
  const splinters1 = [
    [[0, 0], [380, 0], [280, 240], [120, 180], [0, 320]],
    [[580, 0], [920, 0], [1024, 180], [740, 280], [640, 140]],
    [[140, 420], [420, 380], [520, 580], [310, 690], [180, 590]],
    [[680, 480], [1024, 410], [1024, 760], [820, 720], [620, 600]],
    [[0, 780], [340, 720], [260, 1024], [0, 1024]],
    [[520, 780], [840, 810], [790, 1024], [440, 1024]]
  ];

  splinters1.forEach(poly => {
    ctx.beginPath();
    poly.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
  });

  // 3. Polygonal Splinter Layer 2: Light Sky Gray/Blue (#86a4be)
  ctx.fillStyle = '#86a4be';
  const splinters2 = [
    [[220, 80], [340, 40], [410, 190], [280, 210]],
    [[710, 120], [840, 80], [890, 260], [760, 240]],
    [[320, 440], [480, 410], [440, 540], [290, 510]],
    [[720, 560], [890, 520], [860, 680], [690, 660]],
    [[160, 820], [310, 780], [280, 940], [110, 920]],
    [[610, 840], [780, 820], [740, 980], [560, 950]]
  ];

  splinters2.forEach(poly => {
    ctx.beginPath();
    poly.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
  });

  // 4. Panel Line Seams & Micro Fasteners
  ctx.strokeStyle = 'rgba(12, 18, 24, 0.75)';
  ctx.lineWidth = 2;
  for (let x = 128; x < 1024; x += 128) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke();
  }
  for (let y = 128; y < 1024; y += 128) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
  }

  // 5. Russian Red Star Emblem with Yellow & White Borders
  ctx.save();
  ctx.translate(512, 740);

  // Outer red star
  const drawStar = (radius, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const px = Math.cos(a) * radius;
      const py = Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  };

  drawStar(75, '#ffffff'); // White border
  drawStar(68, '#e6b800'); // Yellow stroke
  drawStar(60, '#d11e1e'); // Crimson core
  ctx.restore();

  // 6. Bort Number: 'RED 07' & Cyrillic Markings
  ctx.fillStyle = '#ff2222';
  ctx.font = 'bold 44px sans-serif';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeText('07', 80, 950);
  ctx.fillText('07', 80, 950);

  ctx.strokeText('07', 860, 950);
  ctx.fillText('07', 860, 950);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '16px monospace';
  ctx.fillText('СУ-27СК ОПАСНО', 80, 985);
  ctx.fillText('ВВС РОССИИ', 840, 985);

  const tex = new THREE.CanvasTexture(cvs);
  tex.anisotropy = 4;
  return tex;
}

/**
 * Creates 1024x1024 Heavy Stealth Hexagonal Armor Texture
 * For Stage 3 Strategic Flying Fortress XB-0 Hraesvelgr.
 * Features: High-density hexagonal tiles, thermal reactor heat vents,
 * and industrial yellow/black hazard chevrons.
 */
export function createBossArmorTexture() {
  if (typeof document === 'undefined') return null;

  const cvs = document.createElement('canvas');
  cvs.width = 1024;
  cvs.height = 1024;
  const ctx = cvs.getContext('2d');

  // 1. Basalt Stealth Composite Plating Base
  ctx.fillStyle = '#14171d';
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Hexagonal Ceramic Armor Tiles
  const hexRadius = 40;
  const hexWidth = Math.sqrt(3) * hexRadius;
  const hexHeight = 2 * hexRadius * 0.75;

  ctx.strokeStyle = '#272d38';
  ctx.lineWidth = 3;

  for (let row = -1; row < 24; row++) {
    for (let col = -1; col < 18; col++) {
      const cx = col * hexWidth + ((row % 2 === 0) ? hexWidth / 2 : 0);
      const cy = row * hexHeight;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const hx = cx + hexRadius * Math.cos(a);
        const hy = cy + hexRadius * Math.sin(a);
        if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = (row + col) % 3 === 0 ? '#1b1f27' : '#14171d';
      ctx.fill();
      ctx.stroke();

      // Hex center core bolt
      ctx.fillStyle = '#3a4454';
      ctx.fillRect(cx - 2, cy - 2, 4, 4);
    }
  }

  // 3. Glowing Thermal Reactor Conduits (Pulsing orange/red seams)
  ctx.strokeStyle = '#ff4400';
  ctx.lineWidth = 6;
  ctx.shadowColor = '#ff6600';
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.moveTo(0, 512); ctx.lineTo(1024, 512);
  ctx.moveTo(512, 0); ctx.lineTo(512, 1024);
  ctx.moveTo(256, 128); ctx.lineTo(256, 896);
  ctx.moveTo(768, 128); ctx.lineTo(768, 896);
  ctx.stroke();

  // Intense yellow core filament
  ctx.strokeStyle = '#ffee88';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.shadowBlur = 0; // reset shadow

  // 4. Industrial Hazard Chevron Stripes (Yellow/Black)
  const hazardY = 920;
  const hazardH = 48;
  ctx.fillStyle = '#ffaa00';
  ctx.fillRect(0, hazardY, 1024, hazardH);

  ctx.fillStyle = '#111317';
  for (let x = -40; x < 1040; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, hazardY + hazardH);
    ctx.lineTo(x + 25, hazardY + hazardH);
    ctx.lineTo(x + 50, hazardY);
    ctx.lineTo(x + 25, hazardY);
    ctx.closePath();
    ctx.fill();
  }

  // 5. Boss Markings & Danger Badges
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Courier New", monospace';
  ctx.fillText('XB-0 HRAESVELGR', 60, 470);
  ctx.fillStyle = '#ff4422';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('CAUTION: THERMAL REACTOR CORE EMISSION HAZARD', 60, 555);
  ctx.fillText('STRATEGIC AERIAL FORTRESS', 60, 585);

  const tex = new THREE.CanvasTexture(cvs);
  tex.anisotropy = 4;
  return tex;
}

/**
 * Creates 1024x512 High-Definition Triple Glass Cockpit MFD Texture
 * Features:
 * - Left MFD: 360-degree tactical air radar sweep with range rings and bogeys
 * - Center MFD: High-detail EADI Artificial Horizon with pitch ladder & bank indicator
 * - Right MFD: Engine turbine RPM% dials, fuel flow, and countermeasures readout
 * - HUD elements: Phosphor green flight reticle, Mach 2.4, 5.8G load, Master Caution
 */
export function createCockpitInstrumentsTexture() {
  if (typeof document === 'undefined') return null;

  const cvs = document.createElement('canvas');
  cvs.width = 1024;
  cvs.height = 512;
  const ctx = cvs.getContext('2d');

  // Background: Matte black avionics dashboard housing
  ctx.fillStyle = '#0b0d11';
  ctx.fillRect(0, 0, 1024, 512);

  // Bezel dividers
  ctx.strokeStyle = '#1d222b';
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 1016, 504);
  ctx.strokeRect(340, 10, 344, 492); // Center MFD housing

  // ==========================================
  // 1. LEFT MFD: TACTICAL RADAR SWEEP (X: 16 to 330)
  // ==========================================
  ctx.save();
  ctx.translate(175, 256);
  // CRT Radar background circle
  const radarRadius = 140;
  const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radarRadius);
  radGrad.addColorStop(0, '#041f14');
  radGrad.addColorStop(1, '#010c08');
  ctx.fillStyle = radGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radarRadius, 0, Math.PI * 2);
  ctx.fill();

  // Radar Range Rings
  ctx.strokeStyle = 'rgba(0, 255, 120, 0.4)';
  ctx.lineWidth = 1.5;
  [45, 90, 135].forEach(r => {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Crosshairs & Compass Ticks
  ctx.beginPath();
  ctx.moveTo(0, -radarRadius); ctx.lineTo(0, radarRadius);
  ctx.moveTo(-radarRadius, 0); ctx.lineTo(radarRadius, 0);
  ctx.stroke();

  // Radar Sweep Cone
  const sweepGrad = ctx.createLinearGradient(0, 0, 120, -70);
  sweepGrad.addColorStop(0, 'rgba(0, 255, 150, 0.5)');
  sweepGrad.addColorStop(1, 'rgba(0, 255, 150, 0.0)');
  ctx.fillStyle = sweepGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radarRadius, -0.6, -0.1);
  ctx.closePath();
  ctx.fill();

  // Target Radar Blips
  ctx.fillStyle = '#ff2233';
  const bogeys = [[35, -45], [-60, 20], [80, 50], [-30, -95]];
  bogeys.forEach(([bx, by]) => {
    ctx.beginPath();
    ctx.arc(bx, by, 5, 0, Math.PI * 2);
    ctx.fill();
    // Velocity vector line
    ctx.strokeStyle = '#ff2233';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + 12, by - 8);
    ctx.stroke();
  });

  // Ownship delta icon at center
  ctx.fillStyle = '#00ffff';
  ctx.beginPath();
  ctx.moveTo(0, -8); ctx.lineTo(6, 8); ctx.lineTo(0, 4); ctx.lineTo(-6, 8);
  ctx.closePath();
  ctx.fill();

  // MFD Status Text
  ctx.fillStyle = '#00ff88';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('RDR: TWS-AUTO', -130, -115);
  ctx.fillText('RNG: 40 NM', -130, 130);
  ctx.fillText('TRK: 4 BOGEYS', 40, 130);
  ctx.restore();

  // ==========================================
  // 2. CENTER MFD: ARTIFICIAL HORIZON / EADI (X: 350 to 670)
  // ==========================================
  ctx.save();
  ctx.translate(512, 256);
  ctx.beginPath();
  ctx.rect(-155, -235, 310, 470);
  ctx.clip();

  // Horizon Split: Sky vs Ground
  ctx.fillStyle = '#184a82'; // Deep sky blue
  ctx.fillRect(-160, -240, 320, 240);
  ctx.fillStyle = '#5c3316'; // Earth terra cotta
  ctx.fillRect(-160, 0, 320, 240);

  // White Horizon Line
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-160, 0); ctx.lineTo(160, 0);
  ctx.stroke();

  // Pitch Ladder Rungs (+20, +10, -10, -20)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#ffffff';

  [-80, -40, 40, 80].forEach(py => {
    const deg = Math.abs(py / 4);
    ctx.beginPath();
    ctx.moveTo(-35, py); ctx.lineTo(35, py);
    ctx.stroke();
    ctx.fillText(`${deg}`, -55, py + 4);
    ctx.fillText(`${deg}`, 40, py + 4);
  });

  // Flight Path Marker (FPM - circle with wings)
  ctx.strokeStyle = '#00ff44';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, -15, 10, 0, Math.PI * 2);
  ctx.moveTo(-22, -15); ctx.lineTo(-10, -15);
  ctx.moveTo(10, -15); ctx.lineTo(22, -15);
  ctx.moveTo(0, -25); ctx.lineTo(0, -15);
  ctx.stroke();

  // Bank Angle Arc on Top
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 130, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.stroke();

  // HUD Readouts
  ctx.fillStyle = '#00ff88';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('M 2.42', -140, -190);
  ctx.fillText('18,500 FT', 45, -190);
  ctx.fillText('G 5.8', -140, 200);
  ctx.fillText('CLIMAX 100%', 30, 200);

  ctx.restore();

  // ==========================================
  // 3. RIGHT MFD: PROPULSION & STATUS (X: 690 to 1000)
  // ==========================================
  ctx.save();
  ctx.translate(850, 256);

  // Twin Engine Circular Tachometers
  const drawTach = (cx, cy, label, val) => {
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 52, 0.75 * Math.PI, 2.25 * Math.PI);
    ctx.stroke();

    // Value Arc
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    const endA = 0.75 * Math.PI + (val / 100) * 1.5 * Math.PI;
    ctx.arc(cx, cy, 52, 0.75 * Math.PI, endA);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(label, cx - 18, cy - 8);
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`${val}%`, cx - 22, cy + 18);
  };

  drawTach(-70, -60, 'ENG 1', 100);
  drawTach(70, -60, 'ENG 2', 100);

  // Status Matrix Bars
  ctx.fillStyle = '#ffaa00';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('A/B STAGE: MAXIMUM', -120, 50);
  ctx.fillText('NOZZLE POS: 92%', -120, 75);
  ctx.fillText('HYD PRESS: 3,000 PSI', -120, 100);
  ctx.fillText('FUEL: 12,400 LBS', -120, 125);

  // Master Caution Indicator
  ctx.fillStyle = '#ff3322';
  ctx.fillRect(-120, 155, 120, 32);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('MASTER CAUTION', -115, 176);

  // Chaff / Flare Status
  ctx.fillStyle = '#00ff88';
  ctx.fillText('FLARES: 48', 25, 176);

  ctx.restore();

  const tex = new THREE.CanvasTexture(cvs);
  tex.anisotropy = 4;
  return tex;
}

/**
 * Creates 512x512 Procedural Ocean Wave Normal / Specular Caustic Map
 * Enables dynamic sparkling sun glints facing the sunset on the water surface.
 */
export function createOceanWaveNormalTexture() {
  if (typeof document === 'undefined') return null;

  const cvs = document.createElement('canvas');
  cvs.width = 512;
  cvs.height = 512;
  const ctx = cvs.getContext('2d');

  // Deep oceanic blue
  ctx.fillStyle = '#06182e';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.createImageData(512, 512);
  const d = imgData.data;

  // Synthesize multi-harmonic ocean wave ripples
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4;

      // Compound wave harmonics
      const w1 = Math.sin((x * 0.08) + (y * 0.04));
      const w2 = Math.cos((x * 0.04) - (y * 0.09));
      const w3 = Math.sin((x * 0.15) + (y * 0.12));
      const wave = (w1 + w2 + w3 * 0.5) / 2.5; // [-1, 1]

      // Normal map RGB: dx -> R, dy -> G, height -> B
      const r = Math.floor(128 + wave * 90);
      const g = Math.floor(128 + (w2 - w1) * 60);
      const b = Math.floor(210 + wave * 45);

      d[idx] = Math.min(255, Math.max(0, r));
      d[idx + 1] = Math.min(255, Math.max(0, g));
      d[idx + 2] = Math.min(255, Math.max(0, b));
      d[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Add specular wave crests (caustic froth highlights)
  ctx.strokeStyle = 'rgba(180, 240, 255, 0.45)';
  ctx.lineWidth = 1.5;
  for (let y = 16; y < 512; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < 512; x += 32) {
      const cy = y + Math.sin(x * 0.1) * 6;
      ctx.lineTo(x, cy);
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(cvs);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(48, 120);
  tex.anisotropy = 4;
  return tex;
}
