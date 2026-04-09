import { type EtaMuPlanningContextInput, type MuCandidate, type PanelName } from "./types.js";
export declare function selectPanelsFromContext(contextInput: EtaMuPlanningContextInput): PanelName[];
export declare function rankCheapMuCandidates(contextInput: EtaMuPlanningContextInput): MuCandidate[];
