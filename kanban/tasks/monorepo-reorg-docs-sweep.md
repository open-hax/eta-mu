---
uuid: "monorepo-reorg-docs-sweep"
title: "Sweep docs/planning cards referencing deleted services/agentd + opencode-reactant"
status: "ready"
priority: "P3"
labels: ["tasks", "docs", "monorepo", "tech-debt"]
created_at: "2026-06-15T00:00:00Z"
source: "PR #132 review"
points: 2
category: "tasks"
---

# Sweep stale path references after the monorepo reorg

Deferred from PR #132 (docs-only, non-blocking). Several docs/planning files still
reference deleted packages (`services/agentd`, `packages/opencode-reactant`,
`packages/kanban`) or the old package name `@open-hax/kanban`.

## Files to update

- `README.md` — package inventory still lists `services/agentd` + `packages/opencode-reactant`.
- `packages/legacy/kanban/README.md` — uses `@open-hax/kanban` and `packages/kanban/` paths;
  package is now `@open-hax/kanban-legacy` under `packages/legacy/kanban`.
- `kanban/run-readiness.md`, `kanban/pm2-ecosystem.md`, `kanban/agentd-tests.md`,
  `kanban/eta-mu-charter-v1.md` — reference deleted `services/agentd` / `packages/opencode-reactant`.

## Acceptance

- No doc references a deleted package path or stale package name.
