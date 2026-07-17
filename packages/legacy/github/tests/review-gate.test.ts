import { describe, expect, it } from "vitest";
import { findTrackedUnresolvedThreads, findAllUnresolvedThreads } from "../src/review-gate.js";

describe("findTrackedUnresolvedThreads", () => {
  it("finds unresolved coderabbit threads", () => {
    const result = findTrackedUnresolvedThreads(
      [
        {
          id: "t1",
          isResolved: false,
          comments: [{ authorLogin: "coderabbitai", body: "fix this" }],
        },
        {
          id: "t2",
          isResolved: true,
          comments: [{ authorLogin: "coderabbitai", body: "done" }],
        },
      ],
      ["coderabbitai"],
    );
    expect(result.unresolvedThreads).toHaveLength(1);
    expect(result.unresolvedThreads[0]?.id).toBe("t1");
  });

  it("ignores unrelated reviewers", () => {
    const result = findTrackedUnresolvedThreads(
      [
        {
          id: "t3",
          isResolved: false,
          comments: [{ authorLogin: "somebody-else", body: "comment" }],
        },
      ],
      ["coderabbitai"],
    );
    expect(result.unresolvedThreads).toHaveLength(0);
  });
});

describe("findAllUnresolvedThreads", () => {
  it("blocks on any unresolved thread regardless of actor", () => {
    const result = findAllUnresolvedThreads([
      {
        id: "t1",
        isResolved: false,
        comments: [{ authorLogin: "somebody-else", body: "fix this" }],
      },
      {
        id: "t2",
        isResolved: true,
        comments: [{ authorLogin: "coderabbitai", body: "done" }],
      },
    ]);
    expect(result.unresolvedThreads).toHaveLength(1);
    expect(result.unresolvedThreads[0]?.id).toBe("t1");
  });

  it("passes when all threads resolved", () => {
    const result = findAllUnresolvedThreads([
      {
        id: "t1",
        isResolved: true,
        comments: [{ authorLogin: "anyone", body: "done" }],
      },
    ]);
    expect(result.unresolvedThreads).toHaveLength(0);
  });
});
