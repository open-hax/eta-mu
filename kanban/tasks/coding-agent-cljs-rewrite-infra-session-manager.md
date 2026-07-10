---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "5sp"]
write-id: "1783693253693-0.b4ec4cat73cmsp8y50a"
points: "5"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Coding Agent CLJS Rewrite — Session Manager Infra"
priority: "P0"
status: "in_progress"
uuid: "coding-agent-cljs-rewrite-infra-session-manager"
created_at: "2026-06-15T00:00:00Z"
---

# Coding Agent CLJS Rewrite — Session Manager Infra

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 5

## Purpose

Port the session manager and related file operations into `eta_mu.coding.infra.*`, wired to `eta-mu-runtime` state/envelope primitives.

## Scope

- `src/core/session-manager.ts`
- `test/session-manager/*` (labels, migration, build-context, save-entry, file-operations, custom-session-id, tree-traversal)
- `src/core/session-cwd.ts`
- Session info, modified timestamps, selector paths

## Deliverables

- [ ] `infra.*` namespaces for session CRUD, migration, build-context, labels, and tree traversal
- [ ] Integration with domain session decisions and extern FS adapters
- [ ] Wiring to `eta-mu-runtime` state/envelope primitives
- [ ] Regression tests for all `test/session-manager/*` suites

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Blocking assessment:** Blocked by inventory-core, domain-session-law, and extern-fs-git-bash. Requires session domain decisions and FS/path/lockfile extern adapters to be in place.
---
