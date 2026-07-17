---
uuid: "turn-processor-cljs-package"
title: "Turn Processor CLJS Package"
status: "done"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "agent", "turn-processor", "8sp"]
created_at: "2026-07-09T02:30:00Z"
source: "kanban/tasks/legacy-package-reorganization.md"
points: 8
category: "tasks"
---

# Turn Processor CLJS Package

> Parent: `kanban/tasks/legacy-package-reorganization.md`
> Spec: `docs/design/turn-processor-cljs-package.md` (to be created)

## Purpose

Port the general-purpose agent turn processor from `packages/legacy/agent` into a new ClojureScript package `packages/turn-processor`. This package owns the agent-loop, state management, and transport abstraction without any UI or provider-specific I/O.

## Scope

- `packages/legacy/agent/src/agent-loop.ts` — turn loop and event stream.
- `packages/legacy/agent/src/agent.ts` — agent orchestration.
- `packages/legacy/agent/src/types.ts` — public types (will become `law` and `shape`).
- Pure domain decisions: message flow, tool-call sequencing, context construction.
- Shape morphisms for the `AgentMessage` data type and tool-call/tool-result transforms.
- Law schemas for agent messages, tool descriptors, and context.
- Keep LLM provider I/O in `infra` or `extern` boundaries; no provider SDK code in `domain`.

## Work items

- [x] Survey `packages/legacy/agent` source and tests; identify public surfaces.
- [x] Create `packages/turn-processor` package, shadow-cljs build, and `.clj-kondo` config.
- [x] Port `law` schemas for agent messages, tool calls, tool results, and context.
- [x] Port `domain` turn decisions (tool-call extraction, execution-mode choice, tool-result shaping, next-action selection).
- [x] Port `shape` transforms for AgentMessage ↔ LLM message DTOs.
- [x] Port `infra` async turn-loop orchestration.
- [x] Port `domain` state/context construction (embedded in `infra.loop`).
- [x] Add tests covering representative turn sequences and malformed payloads.
- [x] Verify `clj-kondo` clean and test target passes.
- [x] Update parent kanban task and architecture inventory.

## Acceptance criteria

- [x] `pnpm --dir packages/turn-processor build` produces a library target.
- [x] `pnpm --dir packages/turn-processor test` passes.
- [x] No raw Node/provider/TUI interop appears outside `extern` or `infra` namespaces.
- [x] At least one representative turn from the legacy agent loop is reproduced by a CLJS test (tool-call → tool-result → final assistant).
- [x] No new TypeScript is introduced.

## Verification

```bash
pnpm --dir packages/turn-processor build
pnpm --dir packages/turn-processor test
pnpm --dir packages/turn-processor lint:kondo
```

## Notes

This package is the engine that the TUI agent (in `packages/eta-mu`) and other consumers will drive. UI, session persistence, and LLM provider adapters remain outside its scope.

## Progress

- `infra/loop.cljs` implemented with `run-loop`, `stream-final-message`, and sequential/parallel tool execution helpers.
- Tests cover: stop without tools, single tool-call round-trip, termination tool, missing-tool error handling, and stream final-message consumption.
- 25 tests, 46 assertions, 0 failures. `clj-kondo` clean. ESM build passes.
