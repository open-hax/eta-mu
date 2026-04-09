import { type BreathEpisode, type EtaBelief, type EtaMuState, type MuCandidate, type PanelName } from "./types.js";
export declare const DEFAULT_ETA_BELIEF: EtaBelief;
export declare function createEtaBelief(overrides?: Partial<EtaBelief>): EtaBelief;
export declare function createBreathEpisode(id: string, now?: string, pendingCommit?: boolean, activityScalar?: number): BreathEpisode;
export declare function createEtaMuState(options?: {
    belief?: Partial<EtaBelief>;
    panels?: PanelName[];
    proposedMoves?: MuCandidate[];
    currentEpisodeId?: string;
    now?: string;
    pendingCommit?: boolean;
    activityScalar?: number;
}): EtaMuState;
