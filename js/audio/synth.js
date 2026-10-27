/* ============================================================
   AFTER BURNER CLIMAX - ADVANCED CHIP SYNTHESIZER
   Yamaha YM2151 FM / Subtractive Synthesis & Dynamic Audio Bus
   ============================================================ */

import { CONFIG } from '../config.js';

export const NOTE_FREQS = {
  'REST': 0,
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'Bb2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66
};

export class RetroSoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.bgmFilter = null;
    this.engineGain = null;
    this.engineFilter = null;
    this.noiseBuffer = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();

    // Master Bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = CONFIG.AUDIO.MASTER_GAIN;
    this.masterGain.connect(this.ctx.destination);

    // Pre-generate White/Pink Noise Buffer
    const bufferSize = this.ctx.sampleRate * 2;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    // BGM Bus with Dynamic Resonant Lowpass Filter
    this.bgmFilter = this.ctx.createBiquadFilter();
    this.bgmFilter.type = 'lowpass';
    this.bgmFilter.frequency.value = 9500;
    this.bgmFilter.Q.value = 2.4;

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = CONFIG.AUDIO.BGM_GAIN;

    this.bgmFilter.connect(this.bgmGain);
    this.bgmGain.connect(this.masterGain);

    this.startEngineSound();
    this.isInitialized = true;
  }

  startEngineSound() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    noise.loop = true;

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'bandpass';
    this.engineFilter.frequency.value = 460;
    this.engineFilter.Q.value = 2.2;

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = CONFIG.AUDIO.ENGINE_GAIN;

    noise.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);
    noise.start();
  }

  setThrottle(isAfterburner) {
    if (!this.ctx || !this.engineFilter) return;
    const targetFreq = isAfterburner ? 980 : 460;
    const targetGain = isAfterburner ? CONFIG.AUDIO.ENGINE_GAIN * 1.6 : CONFIG.AUDIO.ENGINE_GAIN;
    this.engineFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.12);
    this.engineGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.12);
  }

  setClimaxAudio(isClimax) {
    if (!this.ctx || !this.bgmFilter) return;
    if (isClimax) {
      // Slow-motion underwater filter sweep
      this.bgmFilter.frequency.setTargetAtTime(700, this.ctx.currentTime, 0.16);
      this.bgmGain.gain.setTargetAtTime(CONFIG.AUDIO.BGM_GAIN * 0.75, this.ctx.currentTime, 0.16);
    } else {
      // High-energy explosion back to full fidelity
      this.bgmFilter.frequency.setTargetAtTime(9500, this.ctx.currentTime, 0.22);
      this.bgmGain.gain.setTargetAtTime(CONFIG.AUDIO.BGM_GAIN, this.ctx.currentTime, 0.2);
    }
  }

  /* --- FM & SUBTRACTIVE INSTRUMENTS --- */
  playKick(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(170, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.11);
    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.connect(gain);
    gain.connect(this.bgmFilter);
    osc.start(time);
    osc.stop(time + 0.12);
  }

  playSnare(time) {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'highpass';
    nFilter.frequency.value = 1100;
    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.55, time);
    nGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(this.bgmFilter);
    noise.start(time);
    noise.stop(time + 0.18);

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, time);
    osc.frequency.exponentialRampToValueAtTime(70, time + 0.09);
    oscGain.gain.setValueAtTime(0.4, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);
    osc.connect(oscGain);
    oscGain.connect(this.bgmFilter);
    osc.start(time);
    osc.stop(time + 0.09);
  }

  playHiHat(time, isOpen = false) {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;
    const gain = this.ctx.createGain();
    const dur = isOpen ? 0.20 : 0.045;
    gain.gain.setValueAtTime(isOpen ? 0.35 : 0.22, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmFilter);
    noise.start(time);
    noise.stop(time + dur);
  }

  playBassNote(noteName, time, duration) {
    if (!noteName || noteName === 'REST') return;
    const freq = NOTE_FREQS[noteName];
    if (!freq) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(280, time + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.42, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmFilter);
    osc.start(time);
    osc.stop(time + duration);
  }

  playLeadNote(noteName, time, duration) {
    if (!noteName || noteName === 'REST') return;
    const freq = NOTE_FREQS[noteName];
    if (!freq) return;

    // Dual detuned sawtooth for screaming Sega arcade lead guitar
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 1.0045, time); // +8 cents detune

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3600, time);
    filter.frequency.exponentialRampToValueAtTime(1700, time + duration);
    filter.Q.value = 3.2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.24, time);
    gain.gain.setValueAtTime(0.22, time + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmFilter);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  playBrassChord(chordNotes, time, duration = 0.16) {
    chordNotes.forEach(n => {
      const freq = NOTE_FREQS[n];
      if (!freq) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, time);
      filter.frequency.exponentialRampToValueAtTime(750, time + duration);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.09, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmFilter);
      osc.start(time);
      osc.stop(time + duration);
    });
  }

  /* --- ARCADE SOUND EFFECTS (SFX) --- */
  playVulcan() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playLockBeep() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1250, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playMissileLaunch() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.24, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playExplosion() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(95, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.45);
    gain.gain.setValueAtTime(0.38, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  playClimaxTrigger() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.45);
    gain.gain.setValueAtTime(0.42, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playBarrelRoll() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(750, this.ctx.currentTime + 0.2);
    osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 0.42);
    gain.gain.setValueAtTime(0.26, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.42);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.42);
  }

  playMissileAlert() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1450, now);
    osc.frequency.setValueAtTime(880, now + 0.05);
    osc.frequency.setValueAtTime(1450, now + 0.1);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playEvadeSuccess() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [587, 880, 1174].forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.05);
      gain.gain.setValueAtTime(0.28, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.2);
    });
  }

  playPlayerHit() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.45);
    gain.gain.setValueAtTime(0.55, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.45);
  }

  /* --- EXPANDED SPECIAL WEAPONS & COUNTERMEASURES --- */
  playGatlingBurst() {
    if (!this.ctx) return;
    // A-10 30mm GAU-8/A Avenger BRRRTT Sound (65Hz base sawtooth buzz)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, this.ctx.currentTime); // 3900 rounds per minute = 65 Hz!

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);
    filter.Q.value = 4.0;

    gain.gain.setValueAtTime(0.48, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  playFlareLaunch() {
    if (!this.ctx) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    filter.Q.value = 3.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
    noise.stop(this.ctx.currentTime + 0.22);
  }

  playSonicBoom() {
    if (!this.ctx) return;
    // Sonic Boom Double-Clap
    [0, 0.08].forEach(dt => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + dt);
      osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + dt + 0.25);
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime + dt);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dt + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(this.ctx.currentTime + dt);
      osc.stop(this.ctx.currentTime + dt + 0.25);
    });
  }
}

export const sound = new RetroSoundEngine();
