---
uuid: "pr-134-workflow-path-self-triggers"
title: "PR #134: Fix workflow path triggers to include the workflow files themselves"
status: "todo"
priority: "P2"
labels: ["tasks", "ci", "pr-134", "2sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 2
category: "tasks"
---

# PR #134: Fix workflow path triggers to include the workflow files themselves

CodeRabbit noted that `main-pr-gate.yml`, `staging-pr.yml`, `deploy-staging.yml`, and `deploy-production.yml` use `.github/workflows/eta-mu*.yml` path filters that do not match their own filenames. Update the filters so changes to each workflow file trigger its own run.

## Acceptance
- Each workflow's `paths` includes itself or uses `.github/workflows/*.yml`.
- README.md compose command guidance is updated if stale.
