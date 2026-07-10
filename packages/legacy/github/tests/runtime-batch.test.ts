import { afterEach, describe, expect, it } from "vitest";

import {
  buildDraftActionBatch,
  buildPlanningContext,
  mapActionBatchToDecision,
  publishActionBatch,
} from "../src/runtime-batch.js";

describe("buildPlanningContext", () => {
  it("elevates review debt from unresolved review threads", () => {
    const planning = buildPlanningContext(
      {
        trigger: "review-activity",
        shouldRun: true,
        reason: "review event",
        pullRequestNumber: 42,
        issueNumber: 42,
        debounceKey: "open-hax/proxx:pr:42",
      },
      {
        repo: { owner: "open-hax", name: "proxx" },
        trigger: "review-activity",
        pullRequestNumber: 42,
        issueNumber: 42,
        unresolvedReviewThreads: [
          { id: "t1", isResolved: false, comments: [{ authorLogin: "coderabbitai" }] },
          { id: "t2", isResolved: false, comments: [{ authorLogin: "coderabbitai" }] },
        ],
      },
    );

    expect(planning.reviewDebt).toBeUndefined();
    expect(planning.belief.reviewDebt).toBeGreaterThan(0.4);
    expect(planning.unresolvedReviewThreads).toBe(2);
  });
});

describe("buildDraftActionBatch", () => {
  it("produces a summary action when review debt is active", () => {
    const batch = buildDraftActionBatch(
      {
        trigger: "review-activity",
        shouldRun: true,
        reason: "review event",
        pullRequestNumber: 42,
        issueNumber: 42,
        debounceKey: "open-hax/proxx:pr:42",
      },
      {
        repo: { owner: "open-hax", name: "proxx" },
        trigger: "review-activity",
        pullRequestNumber: 42,
        issueNumber: 42,
        unresolvedReviewThreads: [
          { id: "t1", isResolved: false, comments: [{ authorLogin: "coderabbitai" }] },
        ],
      },
    );

    expect(batch.kind).toBe("eta-mu-action-batch.v1");
    expect(batch.actions[0]?.kind).toBe("summary");
  });
});

describe("mapActionBatchToDecision", () => {
  it("maps patch movement into autofix mode", () => {
    const decision = mapActionBatchToDecision({
      kind: "eta-mu-action-batch.v1",
      repo: "open-hax/proxx",
      trigger: "mention",
      summary: "Patch was explicitly requested.",
      panels: ["field", "movement"],
      belief: {
        urgency: 0.8,
        ambiguity: 0.2,
        socialFriction: 0.1,
        deployRisk: 0.2,
        reviewDebt: 0,
        drift: 0.1,
        crust: 0.1,
        bloomNeed: 0.2,
        userIntentConfidence: 0.9,
      },
      actions: [
        {
          id: "a1",
          kind: "patch",
          target: "pr#42",
          reason: "Apply the requested change directly to the PR branch.",
          confidence: 0.95,
          costClass: "medium",
          reversibility: "moderate",
          needsProof: false,
        },
      ],
      breath: {
        shouldCommit: false,
        reason: "Continue sensing.",
      },
    });

    expect(decision.mode).toBe("autofix");
    expect(decision.shouldRespond).toBe(true);
  });
});

describe("publishActionBatch", () => {
  const originalFetch = globalThis.fetch;
  const record = { batch: {} };

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("aborts a hung publish once the timeout elapses and surfaces the abort error", async () => {
    globalThis.fetch = ((_endpoint: unknown, init?: RequestInit) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(init.signal?.reason ?? new Error("aborted"));
        });
      })) as typeof fetch;

    await expect(publishActionBatch("http://127.0.0.1:9", record, 25)).rejects.toThrow(
      /abort/i,
    );
  });

  it("passes an abort signal to fetch and resolves on a fast ok response", async () => {
    let sawSignal: unknown;
    globalThis.fetch = (async (_endpoint: unknown, init?: RequestInit) => {
      sawSignal = init?.signal;
      return { ok: true, status: 200 } as Response;
    }) as typeof fetch;

    await expect(publishActionBatch("http://127.0.0.1:9", record)).resolves.toBeUndefined();
    expect(sawSignal).toBeInstanceOf(AbortSignal);
  });
});
