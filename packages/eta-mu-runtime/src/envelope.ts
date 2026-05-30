import {
  createActionBatch as createActionBatchCljs,
  recommendBreath as recommendBreathCljs,
} from "@open-hax/eta-mu-runtime/cljs";
import {
  breathRecommendationSchema,
  etaMuActionBatchSchema,
  type BreathRecommendation,
  type EtaMuActionBatch,
  type EtaMuPlanningContextInput,
  type MuCandidate,
} from "./types.js";

export function recommendBreath(
  contextInput: EtaMuPlanningContextInput,
  actionsInput?: MuCandidate[],
): BreathRecommendation {
  return breathRecommendationSchema.parse(
    recommendBreathCljs(contextInput, actionsInput),
  );
}

export function createActionBatch(
  contextInput: EtaMuPlanningContextInput,
): EtaMuActionBatch {
  return etaMuActionBatchSchema.parse(createActionBatchCljs(contextInput));
}
