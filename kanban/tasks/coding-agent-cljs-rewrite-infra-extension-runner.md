---
uuid: "coding-agent-cljs-rewrite-infra-extension-runner"
title: "Coding Agent CLJS Rewrite — Extension Runner Infra"
status: "blocked"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "5sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 5
category: "tasks"
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
---
