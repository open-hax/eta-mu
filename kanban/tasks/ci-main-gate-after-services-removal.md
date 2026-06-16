---
uuid: "ci-main-gate-after-services-removal"
title: "Repair main-pr-gate / deploy workflows after services/ removal"
status: "ready"
priority: "P0"
labels: ["tasks", "ci", "deploy", "monorepo", "blocker"]
created_at: "2026-06-15T00:00:00Z"
source: "PR #132 review"
points: 5
category: "tasks"
---

# Repair main-pr-gate / deploy workflows after the services/ removal

Surfaced verifying PR #132. The reorg deletes the whole `services/` tree, but the
main-branch CI/deploy workflows still operate on `services/eta-mu/**`:

- `.github/workflows/main-pr-gate.yml` — `main-lint` runs `bash -n` + `shellcheck` on
  `services/eta-mu/scripts/deploy-remote.sh`; `main-build` runs
  `docker compose -f services/eta-mu/compose.yaml config`. Both fail with
  `no such file or directory` on this branch.
- `deploy-staging.yml`, `deploy-production.yml`, `staging-pr.yml` likely reference the
  same paths.

This is the remaining **merge blocker** for #132 (`mergeStateStatus: BLOCKED`) and is a
deploy-architecture decision, not a review nit — hence tracked separately.

## Decision needed

Either:
1. Relocate the eta-mu service runtime config (`compose.yaml`, `scripts/deploy-remote.sh`)
   to its new home and repoint the workflows + `paths:` triggers, **or**
2. Restore `services/eta-mu/**` if its deletion in #132 was unintended branch dirt, **or**
3. Retire the eta-mu service-deploy gate if the service is no longer deployed this way.

## Acceptance

- `main-pr-gate`, deploy, and staging workflows pass (or are intentionally removed) for a
  PR that no longer ships `services/`.
- `mergeStateStatus` is no longer BLOCKED on these checks.
