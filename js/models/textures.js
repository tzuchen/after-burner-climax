/* ============================================================
   AFTER BURNER CLIMAX - PROCEDURAL MILITARY TEXTURES
   Naval Low-Viz Gray, Aggressor Splinter, Boss Armor, Avionics
   ============================================================ */

export function createNavalCamoTexture() {
  const cvs = document.createElement('canvas');
  cvs.width = 512;
  cvs.height = 512;
  const ctx = cvs.getContext('2d');

  // Base coat: Naval Low-Viz Gray
  ctx.fillStyle = '#637485';
  ctx.fillRect(0, 0, 512, 512);

  // Splinter Camouflage Patches
  ctx.fillStyle = '#495868';
  ctx.beginPath();
  ctx.moveTo(0, 90); ctx.lineTo(210, 140); ctx.lineTo(360, 50);
  ctx.lineTo(512, 110); ctx.lineTo(512, 300); ctx.lineTo(280, 340);
  ctx.lineTo(0, 260); ctx.closePath(); ctx.fill();

  // Panel Lines & Fasteners Grid
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = 2;
  for (let x = 64; x < 512; x += 64) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }
  for (let y = 64; y < 512; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }

  // U.S. Navy Star-and-Bar Roundel
  ctx.save();
  ctx.translate(256, 410);
  ctx.fillStyle = '#0f1f3a'; ctx.fillRect(-70, -18, 140, 36);
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#cc2233'; ctx.fillRect(-70, -4, 140, 8);
  ctx.fillStyle = '#ffffff'; ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = Math.cos(a) * 22; const py = Math.sin(a) * 22;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.fill();
  ctx.restore();

  // Stencils
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText('NAVY 101', 30, 485);
  ctx.fillText('VF-84', 380, 485);

  const tex = new THREE.CanvasTexture(cvs);
  return tex;
}

export function createAggressorCamoTexture() {
  const cvs = document.createElement('canvas');
  cvs.width = 512;
  cvs.height = 512;
  const ctx = cvs.getContext('2d');

  // Aggressor Dark Blue Base
  ctx.fillStyle = '#22384d';
  ctx.fillRect(0, 0, 512, 512);

  // Digital Splinter Camo (Cyan / Light Blue Geometric Shapes)
  ctx.fillStyle = '#3a6185';
  ctx.beginPath();
  ctx.moveTo(40, 20); ctx.lineTo(180, 20); ctx.lineTo(240, 160); ctx.lineTo(100, 180); ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#162432';
  ctx.beginPath();
  ctx.moveTo(300, 100); ctx.lineTo(480, 60); ctx.lineTo(420, 280); ctx.lineTo(260, 240); ctx.closePath(); ctx.fill();

  // Red Star Insignia for Hostiles
  ctx.save();
  ctx.translate(256, 380);
  ctx.fillStyle = '#dd1818';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = Math.cos(a) * 35; const py = Math.sin(a) * 35;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();

  const tex = new THREE.CanvasTexture(cvs);
  return tex;
}

export function createBossArmorTexture() {
  const cvs = document.createElement('canvas');
  cvs.width = 512;
  cvs.height = 512;
  const ctx = cvs.getContext('2d');

  // Heavy Stealth Composite Armor
  ctx.fillStyle = '#181b22';
  ctx.fillRect(0, 0, 512, 512);

  // Hexagonal stealth tiles
  ctx.strokeStyle = '#2b313d';
  ctx.lineWidth = 2;
  for (let y = 0; y < 512; y += 40) {
    for (let x = 0; x < 512; x += 60) {
      ctx.strokeRect(x, y, 50, 32);
    }
  }

  // Warning Stripes (Hazard Decals)
  ctx.fillStyle = '#ffaa00';
  ctx.fillRect(40, 460, 432, 24);
  ctx.fillStyle = '#000000';
  for (let x = 40; x < 470; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 484); ctx.lineTo(x + 18, 484); ctx.lineTo(x + 36, 460); ctx.lineTo(x + 18, 460);
    ctx.closePath(); ctx.fill();
  }

  const tex = new THREE.CanvasTexture(cvs);
  return tex;
}

export function createCockpitInstrumentsTexture() {
  const cvs = document.createElement('canvas');
  cvs.width = 512;
  cvs.height = 256;
  const ctx = cvs.getContext('2d');

  // Instrument Panel Background
  ctx.fillStyle = '#15181e';
  ctx.fillRect(0, 0, 512, 256);

  // Center Radar Scope
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(256, 128, 80, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(256, 128, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(256, 48); ctx.lineTo(256, 208);
  ctx.moveTo(176, 128); ctx.lineTo(336, 128);
  ctx.stroke();

  // Radar Blips
  ctx.fillStyle = '#ff3344';
  ctx.beginPath(); ctx.arc(275, 100, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(235, 140, 5, 0, Math.PI * 2); ctx.fill();

  // Left Altimeter
  ctx.strokeStyle = '#00ffff';
  ctx.strokeRect(40, 48, 80, 160);
  ctx.fillStyle = '#00ffff';
  ctx.font = '12px monospace';
  ctx.fillText('ALT: 18500', 45, 75);
  ctx.fillText('MACH 2.4', 45, 110);
  ctx.fillText('G-LOAD 5.2', 45, 145);

  // Right System Gauges
  ctx.strokeStyle = '#ffaa00';
  ctx.strokeRect(392, 48, 80, 160);
  ctx.fillStyle = '#ffaa00';
  ctx.fillText('ENG L: 100%', 397, 75);
  ctx.fillText('ENG R: 100%', 397, 105);
  ctx.fillText('FUEL: 84%', 397, 135);

  const tex = new THREE.CanvasTexture(cvs);
  return tex;
}
