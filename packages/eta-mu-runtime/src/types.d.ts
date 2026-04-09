import { z } from "zod";
export declare const panelNameSchema: z.ZodEnum<["field", "movement", "truth", "trajectory", "breath", "memory", "cost"]>;
export type PanelName = z.infer<typeof panelNameSchema>;
export declare const costClassSchema: z.ZodEnum<["cheap", "medium", "expensive"]>;
export type CostClass = z.infer<typeof costClassSchema>;
export declare const reversibilitySchema: z.ZodEnum<["easy", "moderate", "hard"]>;
export type Reversibility = z.infer<typeof reversibilitySchema>;
export declare const muCandidateKindSchema: z.ZodEnum<["comment", "summary", "label", "issue", "patch-plan", "patch", "reroute", "defer", "request-evidence", "request-human-attention", "noop"]>;
export type MuCandidateKind = z.infer<typeof muCandidateKindSchema>;
export declare const etaBeliefSchema: z.ZodObject<{
    urgency: z.ZodNumber;
    ambiguity: z.ZodNumber;
    socialFriction: z.ZodNumber;
    deployRisk: z.ZodNumber;
    reviewDebt: z.ZodNumber;
    drift: z.ZodNumber;
    crust: z.ZodNumber;
    bloomNeed: z.ZodNumber;
    userIntentConfidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    urgency: number;
    ambiguity: number;
    socialFriction: number;
    deployRisk: number;
    reviewDebt: number;
    drift: number;
    crust: number;
    bloomNeed: number;
    userIntentConfidence: number;
}, {
    urgency: number;
    ambiguity: number;
    socialFriction: number;
    deployRisk: number;
    reviewDebt: number;
    drift: number;
    crust: number;
    bloomNeed: number;
    userIntentConfidence: number;
}>;
export type EtaBelief = z.infer<typeof etaBeliefSchema>;
export declare const muCandidateSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodEnum<["comment", "summary", "label", "issue", "patch-plan", "patch", "reroute", "defer", "request-evidence", "request-human-attention", "noop"]>;
    target: z.ZodString;
    reason: z.ZodString;
    confidence: z.ZodNumber;
    costClass: z.ZodEnum<["cheap", "medium", "expensive"]>;
    reversibility: z.ZodEnum<["easy", "moderate", "hard"]>;
    needsProof: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    reason: string;
    kind: "noop" | "summary" | "comment" | "label" | "issue" | "patch-plan" | "patch" | "reroute" | "defer" | "request-evidence" | "request-human-attention";
    target: string;
    confidence: number;
    costClass: "medium" | "cheap" | "expensive";
    reversibility: "easy" | "moderate" | "hard";
    needsProof: boolean;
}, {
    id: string;
    reason: string;
    kind: "noop" | "summary" | "comment" | "label" | "issue" | "patch-plan" | "patch" | "reroute" | "defer" | "request-evidence" | "request-human-attention";
    target: string;
    confidence: number;
    costClass: "medium" | "cheap" | "expensive";
    reversibility: "easy" | "moderate" | "hard";
    needsProof: boolean;
}>;
export type MuCandidate = z.infer<typeof muCandidateSchema>;
export declare const breathEpisodeSchema: z.ZodObject<{
    id: z.ZodString;
    openedAt: z.ZodString;
    lastActivityAt: z.ZodString;
    activityScalar: z.ZodNumber;
    pendingCommit: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    openedAt: string;
    lastActivityAt: string;
    activityScalar: number;
    pendingCommit: boolean;
}, {
    id: string;
    openedAt: string;
    lastActivityAt: string;
    activityScalar: number;
    pendingCommit: boolean;
}>;
export type BreathEpisode = z.infer<typeof breathEpisodeSchema>;
export declare const etaMuStateSchema: z.ZodObject<{
    belief: z.ZodObject<{
        urgency: z.ZodNumber;
        ambiguity: z.ZodNumber;
        socialFriction: z.ZodNumber;
        deployRisk: z.ZodNumber;
        reviewDebt: z.ZodNumber;
        drift: z.ZodNumber;
        crust: z.ZodNumber;
        bloomNeed: z.ZodNumber;
        userIntentConfidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    }, {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    }>;
    panels: z.ZodArray<z.ZodEnum<["field", "movement", "truth", "trajectory", "breath", "memory", "cost"]>, "many">;
    proposedMoves: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["comment", "summary", "label", "issue", "patch-plan", "patch", "reroute", "defer", "request-evidence", "request-human-attention", "noop"]>;
        target: z.ZodString;
        reason: z.ZodString;
        confidence: z.ZodNumber;
        costClass: z.ZodEnum<["cheap", "medium", "expensive"]>;
        reversibility: z.ZodEnum<["easy", "moderate", "hard"]>;
        needsProof: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        reason: string;
        kind: "noop" | "summary" | "comment" | "label" | "issue" | "patch-plan" | "patch" | "reroute" | "defer" | "request-evidence" | "request-human-attention";
        target: string;
        confidence: number;
        costClass: "medium" | "cheap" | "expensive";
        reversibility: "easy" | "moderate" | "hard";
        needsProof: boolean;
    }, {
        id: string;
        reason: string;
        kind: "noop" | "summary" | "comment" | "label" | "issue" | "patch-plan" | "patch" | "reroute" | "defer" | "request-evidence" | "request-human-attention";
        target: string;
        confidence: number;
        costClass: "medium" | "cheap" | "expensive";
        reversibility: "easy" | "moderate" | "hard";
        needsProof: boolean;
    }>, "many">;
    currentEpisode: z.ZodObject<{
        id: z.ZodString;
        openedAt: z.ZodString;
        lastActivityAt: z.ZodString;
        activityScalar: z.ZodNumber;
        pendingCommit: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        openedAt: string;
        lastActivityAt: string;
        activityScalar: number;
        pendingCommit: boolean;
    }, {
        id: string;
        openedAt: string;
        lastActivityAt: string;
        activityScalar: number;
        pendingCommit: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    belief: {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    };
    panels: ("field" | "movement" | "truth" | "trajectory" | "breath" | "memory" | "cost")[];
    proposedMoves: {
        id: string;
        reason: string;
        kind: "noop" | "summary" | "comment" | "label" | "issue" | "patch-plan" | "patch" | "reroute" | "defer" | "request-evidence" | "request-human-attention";
        target: string;
        confidence: number;
        costClass: "medium" | "cheap" | "expensive";
        reversibility: "easy" | "moderate" | "hard";
        needsProof: boolean;
    }[];
    currentEpisode: {
        id: string;
        openedAt: string;
        lastActivityAt: string;
        activityScalar: number;
        pendingCommit: boolean;
    };
}, {
    belief: {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    };
    panels: ("field" | "movement" | "truth" | "trajectory" | "breath" | "memory" | "cost")[];
    proposedMoves: {
        id: string;
        reason: string;
        kind: "noop" | "summary" | "comment" | "label" | "issue" | "patch-plan" | "patch" | "reroute" | "defer" | "request-evidence" | "request-human-attention";
        target: string;
        confidence: number;
        costClass: "medium" | "cheap" | "expensive";
        reversibility: "easy" | "moderate" | "hard";
        needsProof: boolean;
    }[];
    currentEpisode: {
        id: string;
        openedAt: string;
        lastActivityAt: string;
        activityScalar: number;
        pendingCommit: boolean;
    };
}>;
export type EtaMuState = z.infer<typeof etaMuStateSchema>;
export declare const etaMuPlanningContextSchema: z.ZodObject<{
    repo: z.ZodString;
    trigger: z.ZodString;
    target: z.ZodString;
    summary: z.ZodString;
    belief: z.ZodObject<{
        urgency: z.ZodNumber;
        ambiguity: z.ZodNumber;
        socialFriction: z.ZodNumber;
        deployRisk: z.ZodNumber;
        reviewDebt: z.ZodNumber;
        drift: z.ZodNumber;
        crust: z.ZodNumber;
        bloomNeed: z.ZodNumber;
        userIntentConfidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    }, {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    }>;
    unresolvedReviewThreads: z.ZodDefault<z.ZodNumber>;
    failingChecks: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    hasPendingHumanAttention: z.ZodDefault<z.ZodBoolean>;
    quietWindowDetected: z.ZodDefault<z.ZodBoolean>;
    pendingCommit: z.ZodDefault<z.ZodBoolean>;
    now: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    summary: string;
    target: string;
    pendingCommit: boolean;
    belief: {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    };
    repo: string;
    trigger: string;
    unresolvedReviewThreads: number;
    failingChecks: string[];
    hasPendingHumanAttention: boolean;
    quietWindowDetected: boolean;
    now?: string | undefined;
}, {
    summary: string;
    target: string;
    belief: {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    };
    repo: string;
    trigger: string;
    pendingCommit?: boolean | undefined;
    unresolvedReviewThreads?: number | undefined;
    failingChecks?: string[] | undefined;
    hasPendingHumanAttention?: boolean | undefined;
    quietWindowDetected?: boolean | undefined;
    now?: string | undefined;
}>;
export type EtaMuPlanningContext = z.infer<typeof etaMuPlanningContextSchema>;
export type EtaMuPlanningContextInput = z.input<typeof etaMuPlanningContextSchema>;
export declare const breathRecommendationSchema: z.ZodObject<{
    shouldCommit: z.ZodBoolean;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    shouldCommit: boolean;
}, {
    reason: string;
    shouldCommit: boolean;
}>;
export type BreathRecommendation = z.infer<typeof breathRecommendationSchema>;
export declare const etaMuActionBatchSchema: z.ZodObject<{
    kind: z.ZodLiteral<"eta-mu-action-batch.v1">;
    repo: z.ZodString;
    trigger: z.ZodString;
    summary: z.ZodString;
    panels: z.ZodArray<z.ZodEnum<["field", "movement", "truth", "trajectory", "breath", "memory", "cost"]>, "many">;
    belief: z.ZodObject<{
        urgency: z.ZodNumber;
        ambiguity: z.ZodNumber;
        socialFriction: z.ZodNumber;
        deployRisk: z.ZodNumber;
        reviewDebt: z.ZodNumber;
        drift: z.ZodNumber;
        crust: z.ZodNumber;
        bloomNeed: z.ZodNumber;
        userIntentConfidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    }, {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    }>;
    actions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        kind: z.ZodEnum<["comment", "summary", "label", "issue", "patch-plan", "patch", "reroute", "defer", "request-evidence", "request-human-attention", "noop"]>;
        target: z.ZodString;
        reason: z.ZodString;
        confidence: z.ZodNumber;
        costClass: z.ZodEnum<["cheap", "medium", "expensive"]>;
        reversibility: z.ZodEnum<["easy", "moderate", "hard"]>;
        needsProof: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        reason: string;
        kind: "noop" | "summary" | "comment" | "label" | "issue" | "patch-plan" | "patch" | "reroute" | "defer" | "request-evidence" | "request-human-attention";
        target: string;
        confidence: number;
        costClass: "medium" | "cheap" | "expensive";
        reversibility: "easy" | "moderate" | "hard";
        needsProof: boolean;
    }, {
        id: string;
        reason: string;
        kind: "noop" | "summary" | "comment" | "label" | "issue" | "patch-plan" | "patch" | "reroute" | "defer" | "request-evidence" | "request-human-attention";
        target: string;
        confidence: number;
        costClass: "medium" | "cheap" | "expensive";
        reversibility: "easy" | "moderate" | "hard";
        needsProof: boolean;
    }>, "many">;
    breath: z.ZodObject<{
        shouldCommit: z.ZodBoolean;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        shouldCommit: boolean;
    }, {
        reason: string;
        shouldCommit: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    summary: string;
    breath: {
        reason: string;
        shouldCommit: boolean;
    };
    kind: "eta-mu-action-batch.v1";
    belief: {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    };
    panels: ("field" | "movement" | "truth" | "trajectory" | "breath" | "memory" | "cost")[];
    repo: string;
    trigger: string;
    actions: {
        id: string;
        reason: string;
        kind: "noop" | "summary" | "comment" | "label" | "issue" | "patch-plan" | "patch" | "reroute" | "defer" | "request-evidence" | "request-human-attention";
        target: string;
        confidence: number;
        costClass: "medium" | "cheap" | "expensive";
        reversibility: "easy" | "moderate" | "hard";
        needsProof: boolean;
    }[];
}, {
    summary: string;
    breath: {
        reason: string;
        shouldCommit: boolean;
    };
    kind: "eta-mu-action-batch.v1";
    belief: {
        urgency: number;
        ambiguity: number;
        socialFriction: number;
        deployRisk: number;
        reviewDebt: number;
        drift: number;
        crust: number;
        bloomNeed: number;
        userIntentConfidence: number;
    };
    panels: ("field" | "movement" | "truth" | "trajectory" | "breath" | "memory" | "cost")[];
    repo: string;
    trigger: string;
    actions: {
        id: string;
        reason: string;
        kind: "noop" | "summary" | "comment" | "label" | "issue" | "patch-plan" | "patch" | "reroute" | "defer" | "request-evidence" | "request-human-attention";
        target: string;
        confidence: number;
        costClass: "medium" | "cheap" | "expensive";
        reversibility: "easy" | "moderate" | "hard";
        needsProof: boolean;
    }[];
}>;
export type EtaMuActionBatch = z.infer<typeof etaMuActionBatchSchema>;
