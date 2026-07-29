import { describe, expect, it } from "vitest";

import {
  buildIssueBody,
  desiredIssueLabels,
  evaluateGitHubSyncEligibility,
  extractTaskUuidFromIssue,
  planGitHubIssueSync,
} from "../src/github-sync.js";
import type { GitHubRepoState, KanbanTask } from "../src/index.js";

const sampleTask: KanbanTask = {
  uuid: "task-123",
  title: "Sync Kanban to GitHub",
  slug: "sync-kanban-to-github",
  status: "in_progress",
  priority: "P1",
  labels: ["kanban sync", "github"],
  createdAt: "2026-05-31T00:00:00.000Z",
  content: "Create or update GitHub issues from markdown cards.",
  sourcePath: "/workspace/kanban/tasks/sync-kanban.md",
  relativePath: "tasks/sync-kanban.md",
};

const stateForTask = (
  task: KanbanTask,
  state: "open" | "closed",
  bodyTask: KanbanTask = task,
): GitHubRepoState => ({
  labels: desiredIssueLabels(task).map((name) => ({ name })),
  issues: [
    {
      number: 42,
      title: task.title,
      body: buildIssueBody(bodyTask, { cwd: "/workspace" }),
      state,
      labels: desiredIssueLabels(task).map((name) => ({ name })),
    },
  ],
});

describe("GitHub issue sync", () => {
  it("embeds and reads a stable task UUID marker", () => {
    const body = buildIssueBody(sampleTask, { cwd: "/workspace" });

    expect(body).toContain('<!-- openhax-kanban-sync uuid="task-123" -->');
    expect(body).toContain("`kanban/tasks/sync-kanban.md`");
    expect(extractTaskUuidFromIssue({ body })).toBe("task-123");
  });

  it("normalizes labels from status, priority, and frontmatter labels", () => {
    expect(desiredIssueLabels(sampleTask)).toEqual([
      "kanban",
      "status:in_progress",
      "priority:P1",
      "kanban-sync",
      "github",
    ]);
  });

  it("creates labels and issues for open tasks", () => {
    const state: GitHubRepoState = { labels: [], issues: [] };
    const plan = planGitHubIssueSync([sampleTask], state, {
      repo: "open-hax/example",
      dryRun: true,
      cwd: "/workspace",
    });

    expect(plan.summary.createLabels).toBe(5);
    expect(plan.summary.createIssues).toBe(1);
    expect(plan.summary.updateIssues).toBe(0);
    expect(plan.operations.some((operation) => operation.type === "createIssue")).toBe(true);
  });

  it("updates existing issues by UUID and closes done tasks", () => {
    const doneTask = { ...sampleTask, status: "done" };
    const body = buildIssueBody(sampleTask, { cwd: "/workspace" });
    const state: GitHubRepoState = {
      labels: desiredIssueLabels(doneTask).map((name) => ({ name })),
      issues: [
        {
          number: 42,
          title: "Old title",
          body,
          state: "open",
          labels: [{ name: "kanban" }],
        },
      ],
    };
    const plan = planGitHubIssueSync([doneTask], state, {
      repo: "open-hax/example",
      dryRun: true,
      cwd: "/workspace",
    });

    expect(plan.summary.createIssues).toBe(0);
    expect(plan.summary.updateIssues).toBe(1);
    expect(plan.operations).toContainEqual(
      expect.objectContaining({
        type: "updateIssue",
        issueNumber: 42,
        state: "closed",
        stateReason: "completed",
      }),
    );
  });

  it("does not create new closed issues for already-done local tasks", () => {
    const doneTask = { ...sampleTask, status: "done" };
    const state: GitHubRepoState = { labels: [], issues: [] };
    const plan = planGitHubIssueSync([doneTask], state, {
      repo: "open-hax/example",
      dryRun: true,
      cwd: "/workspace",
    });

    expect(plan.summary.createIssues).toBe(0);
    expect(plan.summary.skippedClosedTasks).toBe(1);
  });

  it("excludes metadata, docs, notes, and .ημ sources by default", () => {
    const excluded = [
      { ...sampleTask, uuid: "agents", relativePath: "packages/foo/AGENTS.md" },
      { ...sampleTask, uuid: "note", relativePath: "docs/notes/2026-07-29-audit.md" },
      { ...sampleTask, uuid: "internal", relativePath: ".ημ/packages/foo/docs/reference.md" },
    ];

    for (const task of excluded) {
      expect(evaluateGitHubSyncEligibility(task)).toMatchObject({ eligible: false });
    }

    const plan = planGitHubIssueSync(excluded, { labels: [], issues: [] }, {
      repo: "open-hax/example",
      dryRun: true,
      cwd: "/workspace",
    });

    expect(plan.operations).toEqual([]);
    expect(plan.summary.excludedTasks).toBe(3);
    expect(plan.excludedTasks.map(({ reason }) => reason)).toEqual([
      "metadata file AGENTS.md",
      "documentation or notes path",
      "path is inside .ημ",
    ]);
  });

  it("allows explicit frontmatter opt-in for documentation", () => {
    const optedIn = {
      ...sampleTask,
      uuid: "published-spec",
      relativePath: "docs/specs/published.md",
      syncGitHub: true,
    };
    const plan = planGitHubIssueSync([optedIn], { labels: [], issues: [] }, {
      repo: "open-hax/example",
      dryRun: true,
      cwd: "/workspace",
    });

    expect(plan.summary.excludedTasks).toBe(0);
    expect(plan.summary.createIssues).toBe(1);
  });

  it("preserves a manually closed issue when the task did not reactivate", () => {
    const state = stateForTask(sampleTask, "closed");
    const plan = planGitHubIssueSync([sampleTask], state, {
      repo: "open-hax/example",
      dryRun: true,
      cwd: "/workspace",
    });

    expect(plan.operations).toEqual([]);
  });

  it("reopens a closed issue only when a closed task status becomes active", () => {
    const doneTask = { ...sampleTask, status: "done" };
    const readyTask = { ...sampleTask, status: "ready" };
    const state = stateForTask(readyTask, "closed", doneTask);
    const plan = planGitHubIssueSync([readyTask], state, {
      repo: "open-hax/example",
      dryRun: true,
      cwd: "/workspace",
    });

    expect(plan.operations).toContainEqual(
      expect.objectContaining({
        type: "updateIssue",
        issueNumber: 42,
        state: "open",
      }),
    );
  });

  it("rejects duplicate eligible UUIDs with both source paths", () => {
    const duplicate = {
      ...sampleTask,
      sourcePath: "/workspace/kanban/epics/other.md",
      relativePath: "epics/other.md",
    };

    expect(() =>
      planGitHubIssueSync([sampleTask, duplicate], { labels: [], issues: [] }, {
        repo: "open-hax/example",
        dryRun: true,
        cwd: "/workspace",
      }),
    ).toThrow(/tasks\/sync-kanban\.md[\s\S]*epics\/other\.md/u);
  });
});
