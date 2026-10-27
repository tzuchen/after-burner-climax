/* ============================================================
   QA TEST SUITE: PROCEDURAL AUDIO FREQUENCIES & SEQUENCER
   ============================================================ */

import { NOTE_FREQS } from '../js/audio/synth.js';
import { MusicTracker } from '../js/audio/tracks.js';

export function runAudioTests() {
  console.log(" Running Procedural Audio & Music Tests...");

  // Test 1: Standard Concert Pitch Frequencies
  if (NOTE_FREQS['A4'] !== 440.00) {
    throw new Error(`Concert Pitch A4 mismatch: expected 440.00, got ${NOTE_FREQS['A4']}`);
  }
  if (Math.abs(NOTE_FREQS['C5'] - 523.25) > 0.01) {
    throw new Error(`Note C5 mismatch: expected ~523.25, got ${NOTE_FREQS['C5']}`);
  }

  // Test 2: Sequence Length (Must be exactly 128 16th-notes for 8-bar loop)
  const tracker = new MusicTracker();
  const track1 = tracker.buildFinalTakeOffTrack();
  if (track1.leadTrack.length !== 128 || track1.bassTrack.length !== 128) {
    throw new Error(`Track 1 step length mismatch: expected 128, got lead:${track1.leadTrack.length}, bass:${track1.bassTrack.length}`);
  }

  const track2 = tracker.buildAfterBurnerTrack();
  if (track2.leadTrack.length !== 128 || track2.bassTrack.length !== 128) {
    throw new Error(`Track 2 step length mismatch: expected 128, got ${track2.leadTrack.length}`);
  }

  const track3 = tracker.buildBossBattleTrack();
  if (track3.leadTrack.length !== 128 || track3.bassTrack.length !== 128) {
    throw new Error(`Track 3 step length mismatch: expected 128, got ${track3.leadTrack.length}`);
  }

  console.log(" ✓ All Procedural Audio & Music Tests Passed!");
  return true;
}
