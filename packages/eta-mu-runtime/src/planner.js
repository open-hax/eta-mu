import { etaMuPlanningContextSchema, muCandidateSchema, } from "./types.js";
function normalizeContext(context) {
    return etaMuPlanningContextSchema.parse(context);
}
function pushPanel(panels, panel) {
    if (!panels.includes(panel)) {
        panels.push(panel);
    }
}
function createCandidate(context, index, candidate) {
    return muCandidateSchema.parse({
        ...candidate,
        id: `${context.repo}:${context.trigger}:${candidate.kind}:${index + 1}`,
    });
}
function candidatePriority(kind) {
    switch (kind) {
        case "defer":
            return 1.0;
        case "request-human-attention":
            return 0.95;
        case "request-evidence":
            return 0.92;
        case "comment":
            return 0.82;
        case "summary":
            return 0.8;
        case "noop":
            return 0.1;
        default:
            return 0.5;
    }
}
export function selectPanelsFromContext(contextInput) {
    const context = normalizeContext(contextInput);
    const panels = ["field", "movement"];
    if (context.belief.reviewDebt >= 0.4 ||
        context.belief.deployRisk >= 0.4 ||
        context.belief.drift >= 0.45 ||
        context.unresolvedReviewThreads > 0 ||
        context.failingChecks.length > 0) {
        pushPanel(panels, "truth");
    }
    if (context.belief.urgency >= 0.6 || context.belief.drift >= 0.55) {
        pushPanel(panels, "trajectory");
    }
    if (context.belief.ambiguity >= 0.55 || context.belief.drift >= 0.6) {
        pushPanel(panels, "memory");
    }
    if (context.quietWindowDetected || context.pendingCommit) {
        pushPanel(panels, "breath");
    }
    return panels;
}
export function rankCheapMuCandidates(contextInput) {
    const context = normalizeContext(contextInput);
    const candidates = [];
    if (context.failingChecks.length > 0) {
        candidates.push(createCandidate(context, candidates.length, {
            kind: "comment",
            target: context.target,
            reason: `Checks failing: ${context.failingChecks.join(", ")}`,
            confidence: Math.max(0.7, context.belief.deployRisk),
            costClass: "cheap",
            reversibility: "easy",
            needsProof: false,
        }));
    }
    if (context.unresolvedReviewThreads > 0 || context.belief.reviewDebt >= 0.4) {
        candidates.push(createCandidate(context, candidates.length, {
            kind: "summary",
            target: context.target,
            reason: "Review debt should be surfaced before movement continues.",
            confidence: Math.max(0.72, context.belief.reviewDebt),
            costClass: "cheap",
            reversibility: "easy",
            needsProof: false,
        }));
    }
    if (context.belief.ambiguity >= 0.65) {
        candidates.push(createCandidate(context, candidates.length, {
            kind: "request-evidence",
            target: context.target,
            reason: "Ambiguity is still too high to justify stronger movement.",
            confidence: Math.max(0.78, context.belief.ambiguity),
            costClass: "cheap",
            reversibility: "easy",
            needsProof: false,
        }));
    }
    if (context.hasPendingHumanAttention || context.belief.socialFriction >= 0.7) {
        candidates.push(createCandidate(context, candidates.length, {
            kind: "request-human-attention",
            target: context.target,
            reason: "Social friction is high enough that explicit human attention is justified.",
            confidence: Math.max(0.76, context.belief.socialFriction),
            costClass: "cheap",
            reversibility: "easy",
            needsProof: false,
        }));
    }
    if (context.belief.deployRisk >= 0.75) {
        candidates.push(createCandidate(context, candidates.length, {
            kind: "defer",
            target: context.target,
            reason: "Deploy risk is too high for forward motion right now.",
            confidence: context.belief.deployRisk,
            costClass: "cheap",
            reversibility: "easy",
            needsProof: false,
        }));
    }
    if (candidates.length === 0) {
        candidates.push(createCandidate(context, candidates.length, {
            kind: "noop",
            target: context.target,
            reason: "No cheap movement is justified yet; continue sensing the field.",
            confidence: 0.9,
            costClass: "cheap",
            reversibility: "easy",
            needsProof: false,
        }));
    }
    return candidates
        .slice()
        .sort((left, right) => right.confidence + candidatePriority(right.kind) -
        (left.confidence + candidatePriority(left.kind)));
}
//# sourceMappingURL=planner.js.map