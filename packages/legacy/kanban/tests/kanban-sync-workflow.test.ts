import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

const workflowUrl = new URL("../../../../.github/workflows/kanban-sync.yml", import.meta.url);

// The sync implementation moved to Rheos; the invariant belongs to the workflow.
describe("kanban sync workflow", () => {
  it("installs and verifies the pinned Clojure CLI before building Rheos", async () => {
    const workflow = await readFile(workflowUrl, "utf8");
    const steps = workflow.split(/^ {6}- name: /m).slice(1);
    const installIndex = steps.findIndex((step) => step.startsWith("Install Clojure CLI\n"));
    const verifyIndex = steps.findIndex((step) => step.startsWith("Verify Clojure CLI\n"));
    const buildIndex = steps.findIndex((step) =>
      step.startsWith("Build Rheos projection executables\n"),
    );

    expect(installIndex).toBeGreaterThanOrEqual(0);
    expect(verifyIndex).toBeGreaterThan(installIndex);
    expect(buildIndex).toBeGreaterThan(verifyIndex);
    expect(steps[installIndex]).toContain(
      "uses: DeLaGuardo/setup-clojure@ada62bb3282a01a296659d48378b812b8e097360",
    );
    expect(steps[installIndex]).toContain("cli: 1.12.5.1654");
    expect(steps[verifyIndex]).toContain("run: clojure -Sdescribe");
    expect(steps[buildIndex]).toContain(
      "run: pnpm --dir .eta-mu/packages/rheos exec shadow-cljs release cli github-sync",
    );
  });

  it("keeps scheduled and manual syncs scoped to the kanban directory", async () => {
    const workflow = await readFile(workflowUrl, "utf8");
    expect(workflow).toContain('default: "kanban"');
    expect(workflow).toContain("TASKS_DIR: $" + "{{ inputs.tasks-dir }}");
    expect(workflow).toContain("tasks-dir escapes the calling repository");
    expect(workflow).toContain("tasks-dir must target the calling repository");
  });
});
