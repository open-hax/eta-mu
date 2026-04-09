import {
  breathEpisodeSchema,
  etaBeliefSchema,
  etaMuStateSchema,
  type BreathEpisode,
  type EtaBelief,
  type EtaMuState,
  type MuCandidate,
  type PanelName,
} from "./types.js";

const clampUnit = (value: number): number => Math.max(0, Math.min(1, value));

export const DEFAULT_ETA_BELIEF: EtaBelief = {
  urgency: 0,
  ambiguity: 0.25,
  socialFriction: 0,
  deployRisk: 0,
  reviewDebt: 0,
  drift: 0,
  crust: 0,
  bloomNeed: 0.25,
  userIntentConfidence: 0.5,
};

export function createEtaBelief(overrides: Partial<EtaBelief> = {}): EtaBelief {
  return etaBeliefSchema.parse({
    urgency: clampUnit(overrides.urgency ?? DEFAULT_ETA_BELIEF.urgency),
    ambiguity: clampUnit(overrides.ambiguity ?? DEFAULT_ETA_BELIEF.ambiguity),
    socialFriction: clampUnit(
      overrides.socialFriction ?? DEFAULT_ETA_BELIEF.socialFriction,
    ),
    deployRisk: clampUnit(overrides.deployRisk ?? DEFAULT_ETA_BELIEF.deployRisk),
    reviewDebt: clampUnit(overrides.reviewDebt ?? DEFAULT_ETA_BELIEF.reviewDebt),
    drift: clampUnit(overrides.drift ?? DEFAULT_ETA_BELIEF.drift),
    crust: clampUnit(overrides.crust ?? DEFAULT_ETA_BELIEF.crust),
    bloomNeed: clampUnit(overrides.bloomNeed ?? DEFAULT_ETA_BELIEF.bloomNeed),
    userIntentConfidence: clampUnit(
      overrides.userIntentConfidence ?? DEFAULT_ETA_BELIEF.userIntentConfidence,
    ),
  });
}

export function createBreathEpisode(
  id: string,
  now = new Date().toISOString(),
  pendingCommit = false,
  activityScalar = 0,
): BreathEpisode {
  return breathEpisodeSchema.parse({
    id,
    openedAt: now,
    lastActivityAt: now,
    activityScalar: clampUnit(activityScalar),
    pendingCommit,
  });
}

export function createEtaMuState(options: {
  belief?: Partial<EtaBelief>;
  panels?: PanelName[];
  proposedMoves?: MuCandidate[];
  currentEpisodeId?: string;
  now?: string;
  pendingCommit?: boolean;
  activityScalar?: number;
} = {}): EtaMuState {
  const now = options.now ?? new Date().toISOString();

  return etaMuStateSchema.parse({
    belief: createEtaBelief(options.belief),
    panels: options.panels ?? ["field", "movement"],
    proposedMoves: options.proposedMoves ?? [],
    currentEpisode: createBreathEpisode(
      options.currentEpisodeId ?? "episode:bootstrap",
      now,
      options.pendingCommit ?? false,
      options.activityScalar ?? 0,
    ),
  });
}
