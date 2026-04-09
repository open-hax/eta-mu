import { rankCheapMuCandidates, selectPanelsFromContext } from "./planner.js";
import {
  etaMuActionBatchSchema,
  etaMuPlanningContextSchema,
  type BreathRecommendation,
  type EtaMuActionBatch,
  type EtaMuPlanningContext,
  type EtaMuPlanningContextInput,
  type MuCandidate,
} from "./types.js";

function normalizeContext(
  context: EtaMuPlanningContextInput,
): EtaMuPlanningContext {
  return etaMuPlanningContextSchema.parse(context);
}

export function recommendBreath(
  contextInput: EtaMuPlanningContextInput,
  actionsInput?: MuCandidate[],
): BreathRecommendation {
  const context = normalizeContext(contextInput);
  const actions = actionsInput ?? rankCheapMuCandidates(context);
  const hasMeaningfulMovement = actions.some((action) => action.kind !== "noop");

  if (context.pendingCommit) {
    return {
      shouldCommit: true,
      reason: "Episode is already marked pending commit.",
    };
  }

  if (context.quietWindowDetected && hasMeaningfulMovement) {
    return {
      shouldCommit: true,
      reason: "Quiet window detected after meaningful movement planning.",
    };
  }

  return {
    shouldCommit: false,
    reason: "Continue sensing; breath boundary has not been justified yet.",
  };
}

export function createActionBatch(
  contextInput: EtaMuPlanningContextInput,
): EtaMuActionBatch {
  const context = normalizeContext(contextInput);
  const actions = rankCheapMuCandidates(context);
  const panels = selectPanelsFromContext(context);
  const breath = recommendBreath(context, actions);

  return etaMuActionBatchSchema.parse({
    kind: "eta-mu-action-batch.v1",
    repo: context.repo,
    trigger: context.trigger,
    summary: context.summary,
    panels,
    belief: context.belief,
    actions,
    breath,
  });
}
