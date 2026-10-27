/* ============================================================
   AFTER BURNER CLIMAX - PROCEDURAL SOUNDTRACK SEQUENCER
   "Final Take Off", "After Burner", and "Climax Boss"
   ============================================================ */

import { sound } from './synth.js';
import { CONFIG } from '../config.js';

export class MusicTracker {
  constructor() {
    this.currentTrackId = 'FINAL_TAKE_OFF';
    this.isPlaying = false;
    this.step = 0;
    this.timer = null;
    this.bpm = CONFIG.AUDIO.TEMPO_BPM;
  }

  getTrackData(trackId) {
    if (trackId === 'AFTER_BURNER') {
      return this.buildAfterBurnerTrack();
    } else if (trackId === 'CLIMAX_BOSS') {
      return this.buildBossBattleTrack();
    }
    return this.buildFinalTakeOffTrack();
  }

  buildFinalTakeOffTrack() {
    // 8 Bars = 128 16th-notes
    const leadTrack = new Array(128).fill('REST');
    leadTrack[0] = 'D4'; leadTrack[4] = 'F4'; leadTrack[8] = 'G4'; leadTrack[12] = 'A4';
    leadTrack[16] = 'D5'; leadTrack[22] = 'C5'; leadTrack[26] = 'A4';
    leadTrack[32] = 'F4'; leadTrack[36] = 'G4'; leadTrack[40] = 'A4'; leadTrack[44] = 'F4';
    leadTrack[48] = 'G4'; leadTrack[52] = 'A4'; leadTrack[56] = 'C5'; leadTrack[60] = 'D5';
    leadTrack[64] = 'F5'; leadTrack[68] = 'E5'; leadTrack[72] = 'D5'; leadTrack[76] = 'C5';
    leadTrack[80] = 'D5'; leadTrack[86] = 'A4'; leadTrack[90] = 'C5';
    leadTrack[96] = 'Bb4'; leadTrack[100] = 'A4'; leadTrack[104] = 'G4'; leadTrack[108] = 'F4';
    leadTrack[112] = 'E4'; leadTrack[114] = 'F4'; leadTrack[116] = 'G4'; leadTrack[118] = 'A4';
    leadTrack[120] = 'C5'; leadTrack[122] = 'D5'; leadTrack[124] = 'F5'; leadTrack[126] = 'D5';

    const bassPatternDm = ['D2', 'REST', 'D2', 'D2', 'D2', 'REST', 'D2', 'D2', 'D2', 'REST', 'D2', 'D2', 'F2', 'REST', 'G2', 'REST'];
    const bassPatternBbC = ['Bb2', 'REST', 'Bb2', 'Bb2', 'Bb2', 'REST', 'Bb2', 'Bb2', 'C3', 'REST', 'C3', 'C3', 'C3', 'REST', 'C3', 'REST'];
    const bassPatternFG = ['F2', 'REST', 'F2', 'F2', 'F2', 'REST', 'F2', 'F2', 'G2', 'REST', 'G2', 'G2', 'G2', 'REST', 'G2', 'REST'];
    const bassPatternTurn = ['A2', 'REST', 'A2', 'A2', 'A2', 'REST', 'A2', 'A2', 'Bb2', 'B2', 'C3', 'REST', 'C#3', 'REST', 'A2', 'REST'];

    const bassTrack = [
      ...bassPatternDm, ...bassPatternDm, ...bassPatternBbC, ...bassPatternDm,
      ...bassPatternFG, ...bassPatternDm, ...bassPatternBbC, ...bassPatternTurn
    ];

    const chordMap = {
      6: ['F4', 'A4', 'D5'], 14: ['F4', 'A4', 'D5'],
      22: ['F4', 'A4', 'D5'], 30: ['F4', 'A4', 'D5'],
      38: ['F4', 'Bb4', 'D5'], 46: ['G4', 'C5', 'E5'],
      54: ['F4', 'A4', 'D5'], 62: ['F4', 'A4', 'D5'],
      70: ['F4', 'A4', 'C5'], 78: ['G4', 'B4', 'D5'],
      86: ['F4', 'A4', 'D5'], 94: ['F4', 'A4', 'D5'],
      102: ['F4', 'Bb4', 'D5'], 110: ['G4', 'C5', 'E5'],
      118: ['G4', 'A4', 'C#5', 'E5'], 126: ['G4', 'A4', 'C#5']
    };

    return { leadTrack, bassTrack, chordMap };
  }

  buildAfterBurnerTrack() {
    // Stage 2 Theme: Driving E minor High Octane Rock
    const leadTrack = new Array(128).fill('REST');
    // Bar 1 & 2: Main Riff
    leadTrack[0] = 'E4'; leadTrack[3] = 'G4'; leadTrack[6] = 'A4'; leadTrack[10] = 'B4';
    leadTrack[16] = 'E5'; leadTrack[22] = 'D5'; leadTrack[26] = 'B4';
    // Bar 3 & 4
    leadTrack[32] = 'A4'; leadTrack[36] = 'B4'; leadTrack[40] = 'D5'; leadTrack[44] = 'B4';
    leadTrack[48] = 'A4'; leadTrack[52] = 'G4'; leadTrack[56] = 'F#4'; leadTrack[60] = 'E4';
    // Bar 5 & 6: High Scream Hook
    leadTrack[64] = 'G5'; leadTrack[68] = 'F#5'; leadTrack[72] = 'E5'; leadTrack[76] = 'D5';
    leadTrack[80] = 'E5'; leadTrack[86] = 'B4'; leadTrack[90] = 'D5';
    // Bar 7 & 8: Fast Turnaround
    leadTrack[96] = 'C5'; leadTrack[100] = 'B4'; leadTrack[104] = 'A4'; leadTrack[108] = 'G4';
    leadTrack[112] = 'F#4'; leadTrack[114] = 'G4'; leadTrack[116] = 'A4'; leadTrack[118] = 'B4';
    leadTrack[120] = 'D5'; leadTrack[122] = 'E5'; leadTrack[124] = 'G5'; leadTrack[126] = 'E5';

    const bassPatternEm = ['E2', 'REST', 'E2', 'E2', 'E2', 'REST', 'E2', 'E2', 'E2', 'REST', 'E2', 'E2', 'G2', 'REST', 'A2', 'REST'];
    const bassPatternCD = ['C2', 'REST', 'C2', 'C2', 'C2', 'REST', 'C2', 'C2', 'D2', 'REST', 'D2', 'D2', 'D2', 'REST', 'D2', 'REST'];
    const bassPatternGA = ['G2', 'REST', 'G2', 'G2', 'G2', 'REST', 'G2', 'G2', 'A2', 'REST', 'A2', 'A2', 'A2', 'REST', 'A2', 'REST'];
    const bassPatternBTurn = ['B2', 'REST', 'B2', 'B2', 'B2', 'REST', 'B2', 'B2', 'C3', 'C#3', 'D3', 'REST', 'D#3', 'REST', 'B2', 'REST'];

    const bassTrack = [
      ...bassPatternEm, ...bassPatternEm, ...bassPatternCD, ...bassPatternEm,
      ...bassPatternGA, ...bassPatternEm, ...bassPatternCD, ...bassPatternBTurn
    ];

    const chordMap = {
      6: ['G4', 'B4', 'E5'], 14: ['G4', 'B4', 'E5'],
      22: ['G4', 'B4', 'E5'], 30: ['G4', 'B4', 'E5'],
      38: ['G4', 'C5', 'E5'], 46: ['F#4', 'A4', 'D5'],
      54: ['G4', 'B4', 'E5'], 62: ['G4', 'B4', 'E5'],
      70: ['G4', 'B4', 'D5'], 78: ['A4', 'C#5', 'E5'],
      86: ['G4', 'B4', 'E5'], 94: ['G4', 'B4', 'E5'],
      102: ['G4', 'C5', 'E5'], 110: ['F#4', 'A4', 'D5'],
      118: ['F#4', 'A4', 'B4', 'D#5'], 126: ['F#4', 'A4', 'B4']
    };

    return { leadTrack, bassTrack, chordMap };
  }

  buildBossBattleTrack() {
    // Stage 3 Boss Theme: Heavy Syncopated D minor Boss Anthem
    const leadTrack = new Array(128).fill('REST');
    // Dramatic Staccato Fanfare
    leadTrack[0] = 'D4'; leadTrack[2] = 'D4'; leadTrack[4] = 'D4'; leadTrack[6] = 'F4';
    leadTrack[8] = 'G4'; leadTrack[10] = 'G#4'; leadTrack[12] = 'A4'; leadTrack[14] = 'D5';
    leadTrack[16] = 'F5'; leadTrack[20] = 'E5'; leadTrack[24] = 'Eb5'; leadTrack[28] = 'D5';
    leadTrack[32] = 'A4'; leadTrack[36] = 'C5'; leadTrack[40] = 'D5'; leadTrack[44] = 'F5';
    leadTrack[48] = 'E5'; leadTrack[52] = 'D5'; leadTrack[56] = 'C#5'; leadTrack[60] = 'D5';
    // Second Half Boss Climax
    leadTrack[64] = 'D5'; leadTrack[68] = 'F5'; leadTrack[72] = 'A5'; leadTrack[76] = 'G5';
    leadTrack[80] = 'F5'; leadTrack[84] = 'E5'; leadTrack[88] = 'D5'; leadTrack[92] = 'C#5';
    leadTrack[96] = 'D5'; leadTrack[100] = 'Eb5'; leadTrack[104] = 'E5'; leadTrack[108] = 'F5';
    leadTrack[112] = 'G5'; leadTrack[116] = 'G#5'; leadTrack[120] = 'A5'; leadTrack[124] = 'D6';

    const bassPatternHeavy = ['D2', 'D2', 'REST', 'D2', 'D2', 'REST', 'D2', 'D2', 'F2', 'REST', 'F2', 'G2', 'G#2', 'A2', 'REST', 'A2'];
    const bassPatternBbA = ['Bb2', 'REST', 'Bb2', 'Bb2', 'Bb2', 'REST', 'Bb2', 'Bb2', 'A2', 'REST', 'A2', 'A2', 'A2', 'REST', 'A2', 'REST'];

    const bassTrack = [
      ...bassPatternHeavy, ...bassPatternHeavy, ...bassPatternBbA, ...bassPatternHeavy,
      ...bassPatternHeavy, ...bassPatternHeavy, ...bassPatternBbA, ...bassPatternHeavy
    ];

    const chordMap = {
      0: ['F4', 'A4', 'D5'], 4: ['F4', 'A4', 'D5'], 8: ['G4', 'Bb4', 'D5'], 12: ['A4', 'C#5', 'E5'],
      16: ['F4', 'A4', 'D5'], 24: ['F4', 'A4', 'D5'], 32: ['F4', 'Bb4', 'D5'], 40: ['A4', 'C#5', 'E5'],
      64: ['F4', 'A4', 'D5'], 72: ['F4', 'A4', 'D5'], 80: ['G4', 'Bb4', 'D5'], 88: ['A4', 'C#5', 'E5'],
      96: ['F4', 'Bb4', 'D5'], 104: ['G4', 'C5', 'E5'], 112: ['A4', 'C#5', 'E5'], 120: ['A4', 'D5', 'F5']
    };

    return { leadTrack, bassTrack, chordMap };
  }

  playTrack(trackId) {
    this.currentTrackId = trackId;
    if (this.isPlaying) return;
    this.isPlaying = true;

    const stepTime = (60 / this.bpm) / 4; // ~0.096s per 16th note
    let nextNoteTime = sound.ctx.currentTime + 0.05;

    const schedule = () => {
      const data = this.getTrackData(this.currentTrackId);

      while (nextNoteTime < sound.ctx.currentTime + 0.12) {
        const step = this.step % 128;
        const barStep = step % 16;

        // 1. Drums: Driving 16th rock / double bass
        const isBoss = (this.currentTrackId === 'CLIMAX_BOSS');
        if (barStep === 0 || barStep === 6 || barStep === 8 || barStep === 14 || (isBoss && (barStep === 2 || barStep === 10))) {
          sound.playKick(nextNoteTime);
        }
        if (barStep === 4 || barStep === 12) {
          sound.playSnare(nextNoteTime);
        }
        if (barStep % 2 === 0) {
          const isOpen = (barStep === 2 || barStep === 10);
          sound.playHiHat(nextNoteTime, isOpen);
        }

        // 2. Bass Line
        const bassNote = data.bassTrack[step];
        if (bassNote && bassNote !== 'REST') {
          sound.playBassNote(bassNote, nextNoteTime, stepTime * 1.15);
        }

        // 3. Brass Stabs
        if (data.chordMap[step]) {
          sound.playBrassChord(data.chordMap[step], nextNoteTime, 0.16);
        }

        // 4. Lead Melody
        const leadNote = data.leadTrack[step];
        if (leadNote && leadNote !== 'REST') {
          sound.playLeadNote(leadNote, nextNoteTime, stepTime * 3.4);
        }

        nextNoteTime += stepTime;
        this.step++;
      }
    };

    this.timer = setInterval(schedule, 25);
  }

  stopTrack() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isPlaying = false;
  }
}

export const music = new MusicTracker();
