import {
  createActionBatch as createActionBatchCljs,
  recommendBreath as recommendBreathCljs,
} from "@open-hax/eta-mu-runtime/cljs";
import {
  type BreathRecommendation,
  breathRecommendationSchema,
  type EtaMuActionBatch,
  type EtaMuPlanningContext,
  type EtaMuPlanningContextInput,
  etaMuActionBatchSchema,
  etaMuPlanningContextSchema,
  type MuCandidate,
} from "./types.js";

function normalizeContext(context: EtaMuPlanningContextInput): EtaMuPlanningContext {
  return etaMuPlanningContextSchema.parse(context);
}

export function recommendBreath(
  contextInput: EtaMuPlanningContextInput,
  actionsInput?: MuCandidate[],
): BreathRecommendation {
  return breathRecommendationSchema.parse(
    recommendBreathCljs(normalizeContext(contextInput), actionsInput),
  );
}

export function createActionBatch(contextInput: EtaMuPlanningContextInput): EtaMuActionBatch {
  return etaMuActionBatchSchema.parse(createActionBatchCljs(normalizeContext(contextInput)));
}
