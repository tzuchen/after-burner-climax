/* ============================================================
   QA TEST SUITE: COMBAT STATE & COMBO SCORING RULES
   ============================================================ */

import { GameState } from '../js/core/state.js';
import { CONFIG } from '../js/config.js';

export function runCombatTests() {
  console.log(" Running Combat & GameState Tests...");

  const testState = new GameState();

  // Test 1: Initial state invariants
  if (testState.armor !== 100 || testState.missiles !== 60 || testState.climaxGauge !== 100) {
    throw new Error("Initial player stats mismatch with CONFIG specification.");
  }

  // Test 2: Score & Combo Accumulation
  testState.registerKill(false);
  testState.addScore(CONFIG.SCORE.KILL_AIR);
  if (testState.comboCount !== 1 || testState.score < CONFIG.SCORE.KILL_AIR) {
    throw new Error(`Score / Combo calculation failed. Score: ${testState.score}`);
  }

  // Test 3: High Combo Rank Escalation
  for (let i = 0; i < 26; i++) {
    testState.registerKill(false);
  }
  if (testState.comboRank !== 'CLIMAX RANK') {
    throw new Error(`Combo rank did not reach CLIMAX RANK, got ${testState.comboRank}`);
  }

  // Test 4: Stage Progression
  const initialStage = testState.currentStageIndex;
  const advanced = testState.nextStage();
  if (!advanced || testState.currentStageIndex !== initialStage + 1) {
    throw new Error("Stage advance failed.");
  }

  // Test 5: Climax Cap
  testState.climaxGauge = 95;
  testState.registerKill(false);
  if (testState.climaxGauge > 100) {
    throw new Error(`Climax gauge overflowed past 100%: ${testState.climaxGauge}`);
  }

  console.log(" ✓ All Combat & GameState Tests Passed!");
  return true;
}
