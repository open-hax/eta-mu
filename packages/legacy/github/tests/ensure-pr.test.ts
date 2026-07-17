import { describe, expect, it, vi, beforeEach } from "vitest";
import { ensurePRs } from "../src/ensure-pr.js";
import * as github from "../src/github.js";

vi.mock("../src/github.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/github.js")>();
  return {
    ...actual,
    createGitHubClient: vi.fn(() => ({})),
    listBranchesWithoutPRs: vi.fn(),
    fetchBranchCommits: vi.fn(),
    createPullRequest: vi.fn(),
  };
});

describe("ensurePRs", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates PRs for branches without existing PRs", async () => {
    vi.mocked(github.listBranchesWithoutPRs).mockResolvedValue([
      { name: "fix/test-branch", sha: "abc123" },
    ]);
    vi.mocked(github.fetchBranchCommits).mockResolvedValue(["fix: test commit"]);
    vi.mocked(github.createPullRequest).mockResolvedValue({ number: 42, url: "https://github.com/test/repo/pull/42" });

    const result = await ensurePRs({
      repo: { owner: "test", name: "repo" },
      base: "staging",
      token: "test-token",
      branchPatterns: ["fix/*"],
      dryRun: false,
    });

    expect(result.created).toHaveLength(1);
    expect(result.created[0].branch).toBe("fix/test-branch");
    expect(result.created[0].prNumber).toBe(42);
    expect(result.skipped).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  it("skips creation in dry-run mode", async () => {
    vi.mocked(github.listBranchesWithoutPRs).mockResolvedValue([
      { name: "fix/test-branch", sha: "abc123" },
    ]);

    const result = await ensurePRs({
      repo: { owner: "test", name: "repo" },
      base: "staging",
      token: "test-token",
      branchPatterns: ["fix/*"],
      dryRun: true,
    });

    expect(result.created).toHaveLength(0);
    expect(result.skipped).toHaveLength(1);
    expect(result.skipped[0]).toBe("fix/test-branch");
    expect(result.errors).toHaveLength(0);
    expect(github.createPullRequest).not.toHaveBeenCalled();
  });

  it("handles errors gracefully", async () => {
    vi.mocked(github.listBranchesWithoutPRs).mockResolvedValue([
      { name: "fix/test-branch", sha: "abc123" },
    ]);
    vi.mocked(github.fetchBranchCommits).mockRejectedValue(new Error("Network error"));

    const result = await ensurePRs({
      repo: { owner: "test", name: "repo" },
      base: "staging",
      token: "test-token",
      branchPatterns: ["fix/*"],
      dryRun: false,
    });

    expect(result.created).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].branch).toBe("fix/test-branch");
    expect(result.errors[0].error).toBe("Network error");
  });
});
