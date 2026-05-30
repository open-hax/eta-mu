---
uuid: "eta-mu-cljs-rewrite-surface-parity"
title: "Eta-mu CLJS Rewrite — CLI/TUI/Web Surface Parity"
status: todo
priority: P1
labels: ["tasks", "cljs", "rewrite", "parity", "8sp"]
created_at: "2026-05-29T21:18:48Z"
source: "kanban/epics/eta-mu-cljs-runtime-rewrite.md"
points: 8
category: tasks
---

# Eta-mu CLJS Rewrite — CLI/TUI/Web Surface Parity

> Parent epic: `kanban/epics/eta-mu-cljs-runtime-rewrite.md`
> Points: 8

## Purpose

Prove existing eta-mu user-facing surfaces can be served by CLJS-backed implementations without breaking current commands, packages, or UI entrypoints.

## Scope

- `eta-mu` and `pi` binary behavior
- package export compatibility for runtime consumers
- TUI rendering/state flows
- web UI / opencode-reactant where affected
- extension manifests consumed by OpenCode and pi harnesses

## Work items

- [ ] Select one thin end-to-end command path for first CLJS-backed parity.
- [ ] Route that path through a compiled CLJS export while preserving its current CLI/API contract.
- [ ] Add parity fixtures for command output, exit codes, and structured return values.
- [ ] Document known gaps instead of silently changing behavior.
- [ ] Keep TS compatibility wrappers small and path-scoped.

## Acceptance criteria

- [ ] At least one real command path runs through CLJS and passes existing CLI tests.
- [ ] Existing package consumers can still import the same public symbols for the migrated path.
- [ ] TUI/web behavior touched by the migrated path has smoke evidence or an explicit blocker.

## Verification

```bash
cd orgs/open-hax/eta-mu
pnpm --filter @open-hax/eta-mu-cli test
pnpm -C packages/opencode-reactant exec shadow-cljs compile app
pnpm test
```
