import { describe, expect, it } from "vitest";
import { formatReviewGateOutput, inferPRTitle } from "../src/github.js";

describe("formatReviewGateOutput", () => {
  it("renders success when no unresolved threads remain", () => {
    const result = formatReviewGateOutput({
      trackedActors: ["coderabbitai"],
      unresolvedThreads: [],
    });
    expect(result.conclusion).toBe("success");
    expect(result.summary).toContain("No unresolved review threads");
  });

  it("renders failure details when unresolved threads exist", () => {
    const result = formatReviewGateOutput({
      trackedActors: ["coderabbitai"],
      unresolvedThreads: [
        {
          id: "thread-1",
          isResolved: false,
          comments: [
            {
              authorLogin: "coderabbitai",
              body: "Please tighten this branch of logic.",
              path: "src/example.ts",
              url: "https://example.test/thread-1",
            },
          ],
        },
      ],
    });
    expect(result.conclusion).toBe("failure");
    expect(result.text).toContain("src/example.ts");
    expect(result.text).toContain("https://example.test/thread-1");
  });
});

describe("inferPRTitle", () => {
  it("converts fix branch to title", () => {
    expect(inferPRTitle("fix/reveal-secrets-localstorage-65")).toBe("Reveal Secrets Localstorage");
  });

  it("converts feat branch to title", () => {
    expect(inferPRTitle("feat/add-new-widget")).toBe("Add New Widget");
  });

  it("converts chore branch to title", () => {
    expect(inferPRTitle("chore/update-deps")).toBe("Update Deps");
  });

  it("handles branch without prefix", () => {
    expect(inferPRTitle("random-branch-name")).toBe("Random Branch Name");
  });
});
