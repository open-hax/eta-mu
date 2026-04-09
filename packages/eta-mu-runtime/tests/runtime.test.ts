import { describe, expect, it } from "vitest";

import { createActionBatch } from "../src/envelope.js";
import { rankCheapMuCandidates, selectPanelsFromContext } from "../src/planner.js";
import { createEtaBelief } from "../src/state.js";

describe("createEtaBelief", () => {
  it("clamps values into the unit interval", () => {
    const belief = createEtaBelief({
      urgency: 2,
      ambiguity: -1,
    });

    expect(belief.urgency).toBe(1);
    expect(belief.ambiguity).toBe(0);
  });
});

describe("selectPanelsFromContext", () => {
  it("surfaces truth, trajectory, and breath under active pressure", () => {
    const panels = selectPanelsFromContext({
      repo: "open-hax/proxx",
      trigger: "check.completed",
      target: "staging",
      summary: "staging gate changed",
      belief: createEtaBelief({
        urgency: 0.8,
        reviewDebt: 0.7,
        drift: 0.6,
      }),
      unresolvedReviewThreads: 2,
      quietWindowDetected: true,
    });

    expect(panels).toEqual([
      "field",
      "movement",
      "truth",
      "trajectory",
      "memory",
      "breath",
    ]);
  });
});

describe("rankCheapMuCandidates", () => {
  it("asks for evidence before stronger movement when ambiguity is high", () => {
    const candidates = rankCheapMuCandidates({
      repo: "open-hax/proxx",
      trigger: "pull_request_review_comment",
      target: "pr#42",
      summary: "state needs reconciliation",
      belief: createEtaBelief({
        ambiguity: 0.9,
        socialFriction: 0.8,
      }),
      hasPendingHumanAttention: true,
    });

    expect(candidates.map((candidate) => candidate.kind)).toContain(
      "request-evidence",
    );
    expect(candidates.map((candidate) => candidate.kind)).toContain(
      "request-human-attention",
    );
  });
});

describe("createActionBatch", () => {
  it("emits a noop batch when no cheap movement is justified", () => {
    const batch = createActionBatch({
      repo: "open-hax/proxx",
      trigger: "scheduler.tick",
      target: "open-hax/proxx",
      summary: "cheap reconcile loop found no action",
      belief: createEtaBelief(),
    });

    expect(batch.kind).toBe("eta-mu-action-batch.v1");
    expect(batch.actions).toHaveLength(1);
    expect(batch.actions[0]?.kind).toBe("noop");
    expect(batch.breath.shouldCommit).toBe(false);
  });
});
