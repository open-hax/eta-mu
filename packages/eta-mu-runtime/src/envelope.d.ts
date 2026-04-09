import { type BreathRecommendation, type EtaMuActionBatch, type EtaMuPlanningContextInput, type MuCandidate } from "./types.js";
export declare function recommendBreath(contextInput: EtaMuPlanningContextInput, actionsInput?: MuCandidate[]): BreathRecommendation;
export declare function createActionBatch(contextInput: EtaMuPlanningContextInput): EtaMuActionBatch;
