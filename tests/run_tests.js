/* ============================================================
   AFTER BURNER CLIMAX - MASTER QA AUTOMATED TEST RUNNER
   ============================================================ */

import { runMathTests } from './test_math.js';
import { runCombatTests } from './test_combat.js';
import { runAudioTests } from './test_audio.js';
import { runFleetTests } from './test_fleet.js';
import { runCampaignTests } from './test_campaign.js';

console.log("==================================================");
console.log("🚀 STARTING AUTOMATED QA TEST SUITE...");
console.log("==================================================");

let passed = 0;
let total = 5;

try {
  runMathTests();
  passed++;

  runCombatTests();
  passed++;

  runAudioTests();
  passed++;

  runFleetTests();
  passed++;

  runCampaignTests();
  passed++;

  console.log("==================================================");
  console.log(`🎉 ALL TESTS PASSED SUCCESSFULLY! (${passed}/${total})`);
  console.log("==================================================");
} catch (err) {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
}
