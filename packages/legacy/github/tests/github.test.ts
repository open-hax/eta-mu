import type { Octokit } from "@octokit/rest";
import { describe, expect, it, vi } from "vitest";
import {
  formatReviewGateOutput,
  inferPRTitle,
  listBranchesWithoutPRs,
} from "../src/github.js";

const githubClient = (
  branches: Array<{ name: string; commit: { sha: string } }>,
  prs: Array<{ state: string; head: { ref: string; sha: string } }>,
  aheadBy: Record<string, number> = {},
) => {
  const listBranches = vi.fn();
  const listPulls = vi.fn();
  const compareCommits = vi.fn(async ({ head }: { head: string }) => ({
    data: { ahead_by: aheadBy[head] ?? 1 },
  }));
  const paginate = vi.fn(async (method: unknown) =>
    method === listBranches ? branches : prs,
  );
  const octokit = {
    paginate,
    rest: {
      repos: { listBranches, compareCommits },
      pulls: { list: listPulls },
    },
  } as unknown as Octokit;
  return { octokit, paginate, listPulls, compareCommits };
};

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

describe("listBranchesWithoutPRs", () => {
  const repo = { owner: "open-hax", name: "proxx" };

  it("suppresses unchanged terminal heads from Proxx PRs #359 and #394", async () => {
    const branches = [
      {
        name: "chore/sandbox-bundle-action",
        commit: { sha: "a2c8b93a7b7ed26814284401390756000fbeaf6e" },
      },
      {
        name: "fix/spec-draft-hook-location-62-v2",
        commit: { sha: "40a9810eea31e9f8398e5c5ff40e74ad9e65e3e4" },
      },
    ];
    const prs = [
      {
        state: "closed",
        head: {
          ref: "chore/sandbox-bundle-action",
          sha: "a2c8b93a7b7ed26814284401390756000fbeaf6e",
        },
      },
      {
        state: "closed",
        head: {
          ref: "fix/spec-draft-hook-location-62-v2",
          sha: "40a9810eea31e9f8398e5c5ff40e74ad9e65e3e4",
        },
      },
    ];
    const client = githubClient(branches, prs);

    await expect(
      listBranchesWithoutPRs(client.octokit, repo, "staging", ["fix/*", "chore/*"]),
    ).resolves.toEqual([]);
    expect(client.compareCommits).not.toHaveBeenCalled();
    expect(client.paginate).toHaveBeenCalledWith(
      client.listPulls,
      expect.objectContaining({ state: "all", base: "staging" }),
    );
  });

  it("suppresses open pull requests without comparing their branches", async () => {
    const client = githubClient(
      [{ name: "fix/open", commit: { sha: "open-head" } }],
      [{ state: "open", head: { ref: "fix/open", sha: "open-head" } }],
    );

    await expect(
      listBranchesWithoutPRs(client.octokit, repo, "staging", ["fix/*"]),
    ).resolves.toEqual([]);
    expect(client.compareCommits).not.toHaveBeenCalled();
  });

  it("suppresses branches whose changes are already incorporated", async () => {
    const client = githubClient(
      [{ name: "fix/incorporated", commit: { sha: "current-head" } }],
      [{ state: "closed", head: { ref: "fix/incorporated", sha: "old-head" } }],
      { "current-head": 0 },
    );

    await expect(
      listBranchesWithoutPRs(client.octokit, repo, "staging", ["fix/*"]),
    ).resolves.toEqual([]);
    expect(client.compareCommits).toHaveBeenCalledWith({
      owner: "open-hax",
      repo: "proxx",
      base: "staging",
      head: "current-head",
    });
  });

  it("keeps a branch eligible after it advances beyond a terminal head", async () => {
    const client = githubClient(
      [{ name: "fix/advanced", commit: { sha: "advanced-head" } }],
      [{ state: "closed", head: { ref: "fix/advanced", sha: "old-head" } }],
      { "advanced-head": 2 },
    );

    await expect(
      listBranchesWithoutPRs(client.octokit, repo, "staging", ["fix/*"]),
    ).resolves.toEqual([{ name: "fix/advanced", sha: "advanced-head" }]);
  });
});
