---
uuid: "eta-mu-quality-ratchet-baseline-inventory"
title: "Eta-mu Quality Ratchet — Baseline Inventory"
status: todo
priority: P0
labels: ["tasks", "quality", "baseline", "lint", "testing", "3sp"]
created_at: "2026-05-31T00:45:00Z"
source: "kanban/epics/eta-mu-quality-ratchet.md"
points: 3
category: tasks
---

# Eta-mu Quality Ratchet — Baseline Inventory

> Parent epic: `kanban/epics/eta-mu-quality-ratchet.md`
> Points: 3

## Purpose

Create a truthful, reproducible quality baseline before cleanup begins so future PRs know which warnings/tests are regressions and which are known blockers.

## Scope

- lint/test/build/coverage command inventory
- warning baseline for CLJS extension/runtime builds
- known local-vs-CI blocker ledger
- package/surface ownership map for quality gates
- no source behavior changes except docs/task metadata

## Work items

- [ ] Enumerate existing package scripts for lint, test, typecheck, build, and coverage.
- [ ] Run the current high-value gates and capture pass/fail/warning summaries.
- [ ] Record known warnings with exact files, warning classes, and proposed owners.
- [ ] Record known flaky/local-environment failures separately from product regressions.
- [ ] Produce a short baseline report under `docs/`.
- [ ] Update this task with verification evidence.

## Acceptance criteria

- [ ] A docs baseline report exists and names commands, outcomes, warning counts, and blockers.
- [ ] Baseline distinguishes source failures from local environment/generated-dist issues.
- [ ] The next cleanup tasks have enough evidence to avoid rediscovering the same warnings.
- [ ] No unrelated workspace dirt is staged.

## Verification

```bash
git diff --stat
git diff --check
pnpm install --offline --frozen-lockfile
pnpm --dir packages/eta-mu-runtime cljs:verify
pnpm --dir packages/eta-mu-runtime cljs:coverage
pnpm --dir packages/eta-mu-extensions test
pnpm --dir packages/eta-mu-extensions build
pnpm --filter @open-hax/eta-mu-cli test
pnpm test
```
