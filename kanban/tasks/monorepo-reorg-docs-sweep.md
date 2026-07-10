---
category: "tasks"
labels: ["tasks", "docs", "monorepo", "tech-debt"]
write-id: "1783697889088-0.9qm7dmudnp5ltj0a6x6"
points: "2"
source: "PR #132 review"
title: "Sweep docs/planning cards referencing deleted services/agentd + opencode-reactant"
priority: "P3"
status: "review"
uuid: "monorepo-reorg-docs-sweep"
created_at: "2026-06-15T00:00:00Z"
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

---
2026-07-10: done. README.md and packages/legacy/kanban/README.md were already clean (fixed in the 2026-07-10 docs pass). Remaining references to services/agentd / opencode-reactant / signal-* live only in historical planning specs (kanban/{agentd-tests,doc-generation,run-readiness,pm2-ecosystem,frontend-devtools-guidance}.md, docs/cljs-runtime-rewrite-boundary-adapter-plan.md) — each now carries an explicit Historical banner rather than a rewrite, preserving them as decision records. kanban/eta-mu-charter-v1.md package lists annotated inline with deletion notes. NOTE for reviewer: README calls the charter the 'active working definition' while the charter card frontmatter says rejected — needs an owner decision on charter status.
---