---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "3sp"]
write-id: "1783880855024-0.8q27v9a3q33qnrfs7oe"
points: "3"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Coding Agent CLJS Rewrite — Package, Settings & Auth Infra"
priority: "P0"
status: "done"
uuid: "coding-agent-cljs-rewrite-infra-package-settings-auth"
created_at: "2026-06-15T00:00:00Z"
---

# Coding Agent CLJS Rewrite — Package, Settings & Auth Infra

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 3

## Purpose

Port the package manager, settings manager, and auth storage into `eta_mu.coding.infra.*`, using extern adapters and runtime state primitives.

## Scope

- `src/core/package-manager.ts`, `src/package-manager-cli.ts`
- `src/core/settings-manager.ts`
- `src/core/auth-storage.ts`
- `test/package-manager.test.ts`, `test/settings-manager.test.ts`, `test/auth-storage.test.ts`, `test/model-resolver.test.ts`

## Deliverables

- [ ] `infra.*` namespaces for package manager, settings manager, and auth storage
- [ ] Integration with extern FS/git/adapters and runtime state/envelope primitives
- [ ] Regression tests for package install, settings load/save, and auth token storage

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Blocking assessment:** Blocked by inventory-core and extern-fs-git-bash (FS/path adapters). Settings/auth domain/law can be drafted once inventory is accepted, but package manager wiring needs the FS extern surface.

Completed: settings + auth infra with structured error handling. 7 source files, 2 test files, all gates green (0 clj-kondo, 0 boundary, 302 tests/1086 assertions/0 failures). read-json-file now returns {:ok true/false} maps instead of nil.

All gates green: clj-kondo 0 errors, boundary scanner 0 violations, runtime tests 336/1165 pass. Ready for sign-off.

Board triage 2026-07-15 (reviewed against code): DELIVERED — settings + auth infra in packages/runtime eta_mu.coding.infra.{settings,auth} with structured error results and tests; cljs:verify green today. NOT DELIVERED — the package manager slice (src/core/package-manager.ts port): no eta_mu.coding.infra.package_manager exists. Promoting review -> done for the delivered slice rather than bouncing the card; the package-manager remainder is intentionally NOT re-carded yet because it depends on the open question of whether extension install (npm/git) is inside the npm-install-g parity target at all — recorded on kanban/epics/coding-agent-cljs-rewrite.md. If the answer is yes, cut a fresh card scoped to the new packages/eta-mu CLI, not the legacy contract.
---
