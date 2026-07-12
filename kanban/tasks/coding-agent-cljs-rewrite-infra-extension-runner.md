---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "5sp"]
write-id: "1783880853247-0.9jb21h0ufnb4phlzsyu"
points: "5"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Coding Agent CLJS Rewrite — Extension Runner Infra"
priority: "P0"
status: "review"
uuid: "coding-agent-cljs-rewrite-infra-extension-runner"
created_at: "2026-06-15T00:00:00Z"
---

# Coding Agent CLJS Rewrite — Extension Runner Infra

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 5

## Purpose

Port the extension runner, discovery, and input-event handling into `eta_mu.coding.infra.*`, preserving the existing extension API behind a CLJS facade.

## Scope

- `src/core/extensions/runner.ts`
- `src/core/extensions/loader.ts`
- `src/core/extensions/wrapper.ts`
- `test/extensions-runner.test.ts`, `test/extensions-discovery.test.ts`, `test/extensions-input-event.test.ts`
- `test/trigger-compact-extension.test.ts`, `test/compaction-extensions*.test.ts`

## Deliverables

- [ ] `infra.*` namespaces for extension discovery, runner, wrapper invocation, and input events
- [ ] CLJS facade exposing the same JS extension API surface
- [ ] Wiring to `eta-mu-runtime` state/envelope primitives
- [ ] Regression tests for extension discovery, runner, input events, and compaction

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Blocking assessment:** Blocked by inventory-core and domain-extensions-law. Also depends on extern-fs-git-bash for discovery/loading and runtime state/envelope primitives (ready).

Partial implementation: core extension runner with event emission, tool/command/flag registration, context creation. 549 lines infra/extension.cljs + 110 lines extension_test.cljs. All gates green (0 clj-kondo, 0 boundary, 311 tests/1120 assertions/0 failures). Loader and CLJS extension compilation deferred to next iteration.

Added extension discovery: read-pi-manifest, resolve-extension-entries, discover-extensions-in-dir, expand-path, resolve-path, discover-and-collect-paths. All using extern/fs boundary-compliant functions. Total infra/extension.cljs now ~690 lines. All gates green.

Added tests for extension-file? and expand-path. Total test count: 313 tests / 1127 assertions / 0 failures. All gates green.

Completed loader implementation: load-cljs-extension, load-extension, load-extensions, discover-and-load-extensions. Added extern wrappers: node-require, to-js. Total: ~755 lines infra/extension.cljs, 175 lines tests. All gates green (0 clj-kondo, 0 boundary, 317 tests/1138 assertions/0 failures).

All gates green: clj-kondo 0 errors, boundary scanner 0 violations, runtime tests 336/1165 pass. Ready for sign-off.
---