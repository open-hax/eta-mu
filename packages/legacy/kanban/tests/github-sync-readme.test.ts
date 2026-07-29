import { describe, expect, it } from "vitest";

import { evaluateGitHubSyncEligibility, planGitHubIssueSync } from "../src/github-sync.js";
import type { KanbanTask } from "../src/index.js";

const readmeTask = (relativePath: string, syncGitHub?: boolean): KanbanTask => ({
  uuid: "readme",
  title: "README",
  slug: "readme",
  status: "incoming",
  priority: "P3",
  labels: [],
  createdAt: "2026-07-29T00:00:00.000Z",
  content: "Package documentation.",
  sourcePath: `/workspace/${relativePath}`,
  relativePath,
  syncGitHub,
});

describe("GitHub README filtering", () => {
  it("excludes README variants before duplicate UUID validation", () => {
    const tasks = [
      readmeTask("packages/eta-mu/README.md"),
      readmeTask("packages/rheos/README.markdown"),
    ];

    const plan = planGitHubIssueSync(tasks, { labels: [], issues: [] }, {
      repo: "open-hax/example",
      dryRun: true,
      cwd: "/workspace",
    });

    expect(plan.operations).toEqual([]);
    expect(plan.summary.excludedTasks).toBe(2);
    expect(plan.excludedTasks.map(({ reason }) => reason)).toEqual([
      "metadata file README.md",
      "metadata file README.markdown",
    ]);
  });

  it("allows explicit README opt-in", () => {
    const task = readmeTask("docs/README.md", true);

    expect(evaluateGitHubSyncEligibility(task)).toEqual({ eligible: true });
  });
});
