---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "5sp"]
write-id: "1783693255365-0.jfng67mxcyfvwexrzbb"
points: "5"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Coding Agent CLJS Rewrite — Extension Domain & Law"
priority: "P0"
status: "ready"
uuid: "coding-agent-cljs-rewrite-domain-extensions-law"
created_at: "2026-06-15T00:00:00Z"
---

# Coding Agent CLJS Rewrite — Extension Domain & Law

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 5

## Purpose

Port the extension domain model and skill contracts into ClojureScript while preserving the existing extension API surface.

## Scope

- `src/core/extensions/types.ts` — extension manifest and shape types
- `src/core/extensions/loader.ts` — extension discovery and loading
- `src/core/extensions/runner.ts` — extension execution
- `src/core/extensions/wrapper.ts` — thin wrapper contract
- `src/core/extensions/index.ts` — public extension exports

## Deliverables

- [ ] Malli schemas in `law.*` for extension manifests, inputs, outputs, and events
- [ ] Pure `domain.*` functions for extension selection, input event handling, and trigger compaction
- [ ] `shape.*` converters preserving the existing JS extension API
- [ ] Regression tests for extension discovery, runner, input events, and trigger-compact behavior

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Blocking assessment:** Blocked by inventory-core acceptance. Extension domain/law can be drafted in parallel with other domain tasks; integration with the extension runner infra will follow once domain-extensions-law is accepted.
---