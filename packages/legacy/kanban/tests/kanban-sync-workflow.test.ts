import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

const workflowUrl = new URL("../../../../.github/workflows/kanban-sync.yml", import.meta.url);

// The sync implementation moved to Rheos; the invariant belongs to the workflow.
describe("kanban sync workflow", () => {
  it("keeps scheduled and manual syncs scoped to the kanban directory", async () => {
    const workflow = await readFile(workflowUrl, "utf8");
    expect(workflow).toContain('default: "kanban"');
    expect(workflow).toContain("TASKS_DIR: ${{ inputs.tasks-dir }}");
    expect(workflow).toContain("tasks-dir escapes the calling repository");
    expect(workflow).toContain("tasks-dir must target the calling repository");
  });
});
