import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

const workflowUrl = new URL("../../../../.github/workflows/kanban-sync.yml", import.meta.url);

describe("kanban sync workflow", () => {
  it("keeps scheduled and manual syncs scoped to the kanban directory", async () => {
    const workflow = await readFile(workflowUrl, "utf8");

    expect(workflow).toContain('tasks_dir="${{ inputs.tasks-dir || github.event.inputs.tasks_dir }}"');
    expect(workflow).toContain('tasks_dir="${tasks_dir:-kanban}"');
    expect(workflow).toContain('default: "kanban"');
  });
});
