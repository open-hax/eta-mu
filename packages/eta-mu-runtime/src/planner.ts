import {
  rankCheapMuCandidates as rankCheapMuCandidatesCljs,
  selectPanelsFromContext as selectPanelsFromContextCljs,
} from "@open-hax/eta-mu-runtime/cljs";
import {
  type EtaMuPlanningContextInput,
  type MuCandidate,
  muCandidateSchema,
  panelNameSchema,
  type PanelName,
} from "./types.js";

export function selectPanelsFromContext(
  contextInput: EtaMuPlanningContextInput,
): PanelName[] {
  return panelNameSchema.array().parse(
    selectPanelsFromContextCljs(contextInput),
  );
}

export function rankCheapMuCandidates(
  contextInput: EtaMuPlanningContextInput,
): MuCandidate[] {
  return muCandidateSchema.array().parse(rankCheapMuCandidatesCljs(contextInput));
}
