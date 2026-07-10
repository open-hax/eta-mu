---
uuid: "docs-refresh-architecture-inventories"
title: "Refresh architecture inventory docs for accuracy"
status: "ready"
priority: "P2"
labels: ["docs", "inventory", "architecture", "5sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 5
category: "tasks"
---

# Refresh architecture inventory docs for accuracy

## Context

Several inventory and baseline docs were generated recently but already lag the actual repo state. Updating them will prevent the docs from misleading contributors during the CLJS rewrite.

## Docs needing refresh

| Doc | Issues |
|---|---|
| `docs/cljs-runtime-rewrite-architecture-inventory.md` | Misclassifies axxium, katamorph, protocols, mcp-contracts; stale file counts (kanban-orchestrator shows 0 EDN files); `extensions-e2e` still marked "defer"; runtime path references stale. |
| `docs/kondo-config-baseline.md` | Omits `kondo-config` itself from classification; `extensions-e2e` kondo status is stale; baseline does not document actual shared-rule ownership. |
| `kanban/eta-mu-extensions-integration.md` | Marked `done` but contains obsolete unported-extension table and roadmap. |
| `packages/extensions/kanban/extension-integration-plan.md` | Claims image extensions that do not exist. |

## Acceptance

- [ ] Update `docs/cljs-runtime-rewrite-architecture-inventory.md` with correct classifications, file counts, and package states.
- [ ] Update `docs/kondo-config-baseline.md` to include `kondo-config` and reflect current `.clj-kondo` / `lint:kondo` status across packages.
- [ ] Reconcile `kanban/eta-mu-extensions-integration.md` and `packages/extensions/kanban/extension-integration-plan.md` with the current 15-extension manifest.
- [ ] Ensure no phantom packages or non-existent paths remain in the inventories.
