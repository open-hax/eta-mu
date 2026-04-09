import { z } from "zod";
const unitIntervalSchema = z.number().min(0).max(1);
export const panelNameSchema = z.enum([
    "field",
    "movement",
    "truth",
    "trajectory",
    "breath",
    "memory",
    "cost",
]);
export const costClassSchema = z.enum(["cheap", "medium", "expensive"]);
export const reversibilitySchema = z.enum(["easy", "moderate", "hard"]);
export const muCandidateKindSchema = z.enum([
    "comment",
    "summary",
    "label",
    "issue",
    "patch-plan",
    "patch",
    "reroute",
    "defer",
    "request-evidence",
    "request-human-attention",
    "noop",
]);
export const etaBeliefSchema = z.object({
    urgency: unitIntervalSchema,
    ambiguity: unitIntervalSchema,
    socialFriction: unitIntervalSchema,
    deployRisk: unitIntervalSchema,
    reviewDebt: unitIntervalSchema,
    drift: unitIntervalSchema,
    crust: unitIntervalSchema,
    bloomNeed: unitIntervalSchema,
    userIntentConfidence: unitIntervalSchema,
});
export const muCandidateSchema = z.object({
    id: z.string().min(1),
    kind: muCandidateKindSchema,
    target: z.string().min(1),
    reason: z.string().min(1),
    confidence: unitIntervalSchema,
    costClass: costClassSchema,
    reversibility: reversibilitySchema,
    needsProof: z.boolean(),
});
export const breathEpisodeSchema = z.object({
    id: z.string().min(1),
    openedAt: z.string().datetime(),
    lastActivityAt: z.string().datetime(),
    activityScalar: unitIntervalSchema,
    pendingCommit: z.boolean(),
});
export const etaMuStateSchema = z.object({
    belief: etaBeliefSchema,
    panels: z.array(panelNameSchema),
    proposedMoves: z.array(muCandidateSchema),
    currentEpisode: breathEpisodeSchema,
});
export const etaMuPlanningContextSchema = z.object({
    repo: z.string().min(1),
    trigger: z.string().min(1),
    target: z.string().min(1),
    summary: z.string().min(1),
    belief: etaBeliefSchema,
    unresolvedReviewThreads: z.number().int().nonnegative().default(0),
    failingChecks: z.array(z.string().min(1)).default([]),
    hasPendingHumanAttention: z.boolean().default(false),
    quietWindowDetected: z.boolean().default(false),
    pendingCommit: z.boolean().default(false),
    now: z.string().datetime().optional(),
});
export const breathRecommendationSchema = z.object({
    shouldCommit: z.boolean(),
    reason: z.string().min(1),
});
export const etaMuActionBatchSchema = z.object({
    kind: z.literal("eta-mu-action-batch.v1"),
    repo: z.string().min(1),
    trigger: z.string().min(1),
    summary: z.string().min(1),
    panels: z.array(panelNameSchema),
    belief: etaBeliefSchema,
    actions: z.array(muCandidateSchema),
    breath: breathRecommendationSchema,
});
//# sourceMappingURL=types.js.map