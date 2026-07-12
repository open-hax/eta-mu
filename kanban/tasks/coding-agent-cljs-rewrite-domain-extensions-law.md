---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "5sp"]
write-id: "1783813713607-0.0n7hdgn8ddoy1m18e9a"
points: "5"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Coding Agent CLJS Rewrite — Extension Domain & Law"
priority: "P0"
status: "document"
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

Board audit 2026-07-11 — moved to ready. Zero CLJS code written. inventory-core blocker resolved. Pure domain/law work is actionable but not started.

Starting implementation. Surveying TS source and existing CLJS patterns.

Extension domain/law COMPLETE. Delivered: law/extension.cljs (310 lines), domain/extension.cljs (340 lines), shape/extension.cljs (456 lines), domain/extension_test.cljs (537 lines). All verification gates pass: clj-kondo 0 errors 0 warnings, shadow-cljs compile 0 warnings, 182 tests / 776 assertions / 0 failures, boundary scanner 0 violations. Covers: Malli schemas for all 22 extension event types, tool/command/flag/shortcut registration schemas. Pure domain functions for handler dispatch, tool selection, input transformation, context event handling, tool call interception, resource discovery. Shape converters for JS↔CLJS extension API types.
---