import type { Octokit } from "@octokit/rest";
import { describe, expect, it, vi } from "vitest";
import {
  fetchEventContext,
  formatReviewGateOutput,
  inferPRTitle,
  isBranchAheadOfBase,
  listBranchesWithoutPRs,
} from "../src/github.js";
import type { EventClassification } from "../src/types.js";

const githubClient = (
  branches: Array<{ name: string; commit: { sha: string } }>,
  prs: Array<{
    state: string;
    head: { ref: string; sha: string; repo: { full_name: string } | null };
  }>,
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

describe("fetchEventContext review threads", () => {
  const repo = { owner: "fixture", name: "review-context" };
  const classification: EventClassification = {
    trigger: "review-activity",
    shouldRun: true,
    reason: "review fixture",
    pullRequestNumber: 23,
    debounceKey: "review:23",
  };
  const resolvedThread = {
    id: "thread-resolved",
    isResolved: true,
    comments: { nodes: [] },
  };

  const reviewPage = (totalCount: number, nodes: readonly unknown[], nextCursor: string | null = null) => ({
    repository: {
      pullRequest: {
        reviewThreads: {
          totalCount,
          nodes,
          pageInfo: { hasNextPage: nextCursor !== null, endCursor: nextCursor },
        },
      },
    },
  });

  const reviewClient = () => {
    const graphql = vi.fn();
    const paginate = vi.fn().mockResolvedValue([]);
    const get = vi.fn().mockResolvedValue({
      data: {
        title: "Fixture pull request",
        body: null,
        html_url: "https://example.test/reviews/23",
        head: { ref: "fixture", sha: "fixture-head", repo: null },
        base: { ref: "main", sha: "fixture-base", repo: null },
      },
    });
    const octokit = {
      graphql,
      paginate,
      rest: { pulls: { get, listFiles: vi.fn() } },
    } as unknown as Octokit;
    return { graphql, paginate, octokit };
  };

  it("reads both pages and preserves review thread normalization", async () => {
    const { graphql, octokit } = reviewClient();
    const commentPreview = "a".repeat(400);
    const note = {
      author: { login: "fixture-reviewer" },
      body: `${commentPreview} trailing text`,
      path: "src/fixture.ts",
      url: "https://example.test/reviews/23/thread",
    };
    graphql
      .mockResolvedValueOnce(reviewPage(2, [resolvedThread], "next-page"))
      .mockResolvedValueOnce(reviewPage(2, [{
        id: "thread-open",
        isResolved: false,
        comments: { nodes: [note, { author: null, body: null, path: null, url: null }] },
      }]));

    const context = await fetchEventContext(octokit, repo, classification, {});

    expect(graphql).toHaveBeenCalledTimes(2);
    expect(graphql).toHaveBeenNthCalledWith(1, expect.any(String), { ...repo, number: 23, after: null });
    expect(graphql).toHaveBeenNthCalledWith(2, expect.any(String), { ...repo, number: 23, after: "next-page" });
    expect(context.unresolvedReviewThreads).toStrictEqual([
      { id: "thread-resolved", isResolved: true, comments: [] },
      {
        id: "thread-open",
        isResolved: false,
        comments: [
          { authorLogin: "fixture-reviewer", body: `${commentPreview}…`, path: note.path, url: note.url },
          { authorLogin: undefined, body: undefined, path: undefined, url: undefined },
        ],
      },
    ]);
  });

  it("accepts an explicit empty terminal page", async () => {
    const { graphql, octokit } = reviewClient();
    graphql.mockResolvedValueOnce(reviewPage(0, []));

    const context = await fetchEventContext(octokit, repo, classification, {});

    expect(graphql).toHaveBeenCalledTimes(1);
    expect(context.unresolvedReviewThreads).toEqual([]);
  });

  it("propagates an ordinary transport failure on a subsequent page", async () => {
    const { graphql, paginate, octokit } = reviewClient();
    const failure = new Error("The review thread request timed out");
    graphql
      .mockResolvedValueOnce(reviewPage(2, [resolvedThread], "next-page"))
      .mockRejectedValueOnce(failure);

    await expect(fetchEventContext(octokit, repo, classification, {})).rejects.toBe(failure);
    expect(graphql).toHaveBeenCalledTimes(2);
    expect(paginate).not.toHaveBeenCalled();
  });

  it("rejects a terminal page when the connection count and received records disagree", async () => {
    const { graphql, paginate, octokit } = reviewClient();
    graphql.mockResolvedValueOnce(reviewPage(2, [resolvedThread]));

    await expect(fetchEventContext(octokit, repo, classification, {})).rejects.toThrow();
    expect(paginate).not.toHaveBeenCalled();
  });
});

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
          repo: { full_name: "open-hax/proxx" },
        },
      },
      {
        state: "closed",
        head: {
          ref: "fix/spec-draft-hook-location-62-v2",
          sha: "40a9810eea31e9f8398e5c5ff40e74ad9e65e3e4",
          repo: { full_name: "open-hax/proxx" },
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
      [
        {
          state: "open",
          head: {
            ref: "fix/open",
            sha: "open-head",
            repo: { full_name: "Open-Hax/Proxx" },
          },
        },
      ],
    );

    await expect(
      listBranchesWithoutPRs(client.octokit, repo, "staging", ["fix/*"]),
    ).resolves.toEqual([]);
    expect(client.compareCommits).not.toHaveBeenCalled();
  });

  it("does not grant suppression authority when the PR head repository is unavailable", async () => {
    const client = githubClient(
      [{ name: "fix/deleted-fork", commit: { sha: "repository-head" } }],
      [
        {
          state: "open",
          head: {
            ref: "fix/deleted-fork",
            sha: "orphaned-head",
            repo: null,
          },
        },
      ],
    );

    await expect(
      listBranchesWithoutPRs(client.octokit, repo, "staging", ["fix/*"]),
    ).resolves.toEqual([{ name: "fix/deleted-fork", sha: "repository-head" }]);
  });

  it("does not let an open fork PR suppress a same-named repository branch", async () => {
    const client = githubClient(
      [{ name: "fix/shared-name", commit: { sha: "repository-head" } }],
      [
        {
          state: "open",
          head: {
            ref: "fix/shared-name",
            sha: "fork-head",
            repo: { full_name: "contributor/proxx" },
          },
        },
      ],
    );

    await expect(
      listBranchesWithoutPRs(client.octokit, repo, "staging", ["fix/*"]),
    ).resolves.toEqual([{ name: "fix/shared-name", sha: "repository-head" }]);
  });

  it("does not let a terminal fork PR suppress an exact repository ref and SHA", async () => {
    const client = githubClient(
      [{ name: "fix/shared-name", commit: { sha: "shared-head" } }],
      [
        {
          state: "closed",
          head: {
            ref: "fix/shared-name",
            sha: "shared-head",
            repo: { full_name: "contributor/proxx" },
          },
        },
      ],
    );

    await expect(
      listBranchesWithoutPRs(client.octokit, repo, "staging", ["fix/*"]),
    ).resolves.toEqual([{ name: "fix/shared-name", sha: "shared-head" }]);
  });

  it("leaves base-divergence checks to the per-branch processing boundary", async () => {
    const client = githubClient(
      [{ name: "fix/incorporated", commit: { sha: "current-head" } }],
      [
        {
          state: "closed",
          head: {
            ref: "fix/incorporated",
            sha: "old-head",
            repo: { full_name: "open-hax/proxx" },
          },
        },
      ],
      { "current-head": 0 },
    );

    await expect(
      listBranchesWithoutPRs(client.octokit, repo, "staging", ["fix/*"]),
    ).resolves.toEqual([{ name: "fix/incorporated", sha: "current-head" }]);
    expect(client.compareCommits).not.toHaveBeenCalled();

    await expect(
      isBranchAheadOfBase(client.octokit, repo, "staging", {
        name: "fix/incorporated",
        sha: "current-head",
      }),
    ).resolves.toBe(false);
    expect(client.compareCommits).toHaveBeenCalledWith({
      owner: "open-hax",
      repo: "proxx",
      base: "staging",
      head: "current-head",
    });
  });

  it("reports a branch ahead after it advances beyond a terminal head", async () => {
    const client = githubClient(
      [{ name: "fix/advanced", commit: { sha: "advanced-head" } }],
      [
        {
          state: "closed",
          head: {
            ref: "fix/advanced",
            sha: "old-head",
            repo: { full_name: "open-hax/proxx" },
          },
        },
      ],
      { "advanced-head": 2 },
    );

    await expect(
      listBranchesWithoutPRs(client.octokit, repo, "staging", ["fix/*"]),
    ).resolves.toEqual([{ name: "fix/advanced", sha: "advanced-head" }]);
    await expect(
      isBranchAheadOfBase(client.octokit, repo, "staging", {
        name: "fix/advanced",
        sha: "advanced-head",
      }),
    ).resolves.toBe(true);
  });
});
