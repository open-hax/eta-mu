---
uuid: "pr-134-workflow-security-hardening"
title: "PR #134: Harden workflow security and retire verify-production curl"
status: "done"
priority: "P1"
labels: ["tasks", "ci", "security", "pr-134", "5sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 5
category: "tasks"
---

# PR #134: Harden workflow security and retire verify-production curl

CodeRabbit flagged security issues in deploy workflows:

1. `deploy-production.yml` declares `verify-production` retired but still curls the production endpoint. Remove the live probe.
2. `deploy-production.yml`, `deploy-staging.yml`, and `main-pr-gate.yml` use tag-pinned actions (`@v5`) and lack explicit `permissions` blocks. Add least-privilege permissions and pin checkout/setup-node actions to full commit SHAs with `persist-credentials: false`.

## Acceptance
- verify-production is a true no-op.
- All affected workflows have explicit permissions.
- Actions are pinned to commit SHAs with credential persistence disabled.
- YAML is valid.
