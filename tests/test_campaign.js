/* ============================================================
   QA TEST SUITE: CAMPAIGN GRAPH & BRANCHING ROUTE REACHABILITY
   ============================================================ */

import { CONFIG } from '../js/config.js';
import { GameState } from '../js/core/state.js';

export function runCampaignTests() {
  console.log(" Running Campaign Graph & Reachability Tests...");

  // 1. Verify 6 Stages defined
  if (!Array.isArray(CONFIG.STAGES) || CONFIG.STAGES.length !== 6) {
    throw new Error(`Expected 6 campaign stages, got ${CONFIG.STAGES ? CONFIG.STAGES.length : 0}`);
  }

  // 2. Verify Final Boss Stage
  const bossStage = CONFIG.STAGES[5];
  if (!bossStage.bossStage || bossStage.code !== 'STAGE_4_BOSS') {
    throw new Error(`Final stage is not configured as bossStage: ${bossStage.name}`);
  }

  // 3. Campaign Graph DFS Reachability: Every branch path must reach the boss
  function traverse(stageIdx, path = []) {
    const stage = CONFIG.STAGES[stageIdx];
    if (!stage) throw new Error(`Invalid stage index: ${stageIdx} from path: ${path.join(' -> ')}`);

    const currentPath = [...path, stage.code];

    if (stage.bossStage) {
      return [currentPath];
    }

    if (!stage.routes || stage.routes.length === 0) {
      throw new Error(`Non-boss stage ${stage.code} has dead-end routes!`);
    }

    const completedPaths = [];
    stage.routes.forEach(route => {
      const subPaths = traverse(route.nextStageIndex, currentPath);
      completedPaths.push(...subPaths);
    });

    return completedPaths;
  }

  const allPossiblePaths = traverse(0);
  if (allPossiblePaths.length < 4) {
    throw new Error(`Expected at least 4 unique campaign branch paths to boss, found ${allPossiblePaths.length}`);
  }

  console.log(`   Found ${allPossiblePaths.length} unique tactical campaign paths to the boss:`);
  allPossiblePaths.forEach((p, idx) => {
    console.log(`     Path #${idx + 1}: ${p.join(' -> ')}`);
  });

  // 4. Test GameState Branching Route Selection
  const state = new GameState();
  if (state.currentStageIndex !== 0) throw new Error("Did not start at Stage 0");

  // Choose Route B: Polar Glaciers (nextStageIndex: 2)
  const branched = state.chooseRoute(1);
  if (!branched || state.currentStageIndex !== 2) {
    throw new Error(`Failed to branch to Route B, currentStageIndex = ${state.currentStageIndex}`);
  }
  if (state.getCurrentStage().code !== 'STAGE_2B') {
    throw new Error(`Expected STAGE_2B, got ${state.getCurrentStage().code}`);
  }

  console.log(" ✓ All Campaign Graph & Reachability Tests Passed!");
  return true;
}
