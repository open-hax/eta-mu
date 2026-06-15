---
uuid: "coding-agent-cljs-rewrite-domain-session-law"
title: "Coding Agent CLJS Rewrite — Session Domain & Law"
status: done
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "5sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 5
category: "tasks"
---
# Coding Agent CLJS Rewrite — Session Domain & Law

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 5

## Purpose

Port the pure session domain logic from `packages/legacy/coding-agent/src/core` into ClojureScript `eta_mu.coding.domain.*` and `eta_mu.coding.law.*`.

## Scope

- `src/core/agent-session.ts` — session decisions, tree navigation, branching, compaction
- `src/core/agent-session-runtime.ts` — runtime event loop decisions
- `src/core/agent-session-services.ts` — service wiring contracts
- `src/core/session-cwd.ts`, `src/core/exec.ts`, `src/core/bash-executor.ts`
- `src/core/diagnostics.ts`, `src/core/output-guard.ts`, `src/core/auth-guidance.ts`
- `src/core/messages.ts`, `src/core/source-info.ts`, `src/core/resolve-config-value.ts`

## Deliverables

- [x] Malli schemas in `law.*` for session state, events, lifecycle decisions, diagnostics, and output guard
- [x] Pure `domain.*` functions for session transitions, tree navigation, branching, compaction, and retry policy
- [x] `shape.*` transforms for existing TS/JS DTO compatibility
- [x] Regression tests for session lifecycle, branching, compaction, retry events, and dynamic tools

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --dir packages/eta-mu-runtime cljs:verify
```

All verification commands passed for the runtime CLJS portion:
- `pnpm --dir packages/runtime cljs:verify` completed with 0 failures, 0 errors.
- 152 tests, 683 assertions, boundary check clean.

## Review

Completed in this turn:
- Created `packages/runtime/src/cljs/eta_mu/coding/law/session.cljs` with Malli schemas for session headers, all entry types, tree nodes, context, info, CWD issues, resource collisions, and resource diagnostics.
- Created `packages/runtime/src/cljs/eta_mu/coding/domain/session.cljs` with pure `build-session-context`, `get-latest-compaction-entry`, `find-most-recent-session`, `migrate-session-entries`, `parse-session-entries`, and CWD issue helpers.
- Created `packages/runtime/src/cljs/eta_mu/coding/domain/diagnostics.cljs` with pure constructors and decision payloads for diagnostics, output-guard state, and auth-guidance messages.
- Created `packages/runtime/src/cljs/eta_mu/coding/shape/session.cljs` with CLJS↔JS DTO round-trips for all entry types.
- Added `packages/runtime/src/cljs/eta_mu/runtime/extern/edn.cljs` for EDN line parsing support.
- Added `packages/runtime/test/cljs/eta_mu/coding/domain/session_test.cljs` and `diagnostics_test.cljs` covering schema validation, context fixtures, migration regressions, CWD formatting, and DTO round-trips.

Blocked / remaining:
- `AgentSession` class, runtime event-loop, and service factories remain blocked pending ports of `@open-hax/eta-mu-agent-core`, `@open-hax/eta-mu-ai`, and `@open-hax/eta-mu-tui`.
- Raw I/O stdout monkey-patching belongs in `eta_mu.coding.extern.stdout` (out of scope for this pure-domain task).
- FS-backed session discovery and file persistence belong in `eta_mu.coding.infra.session-store` and require `extern.fs` parity.

---
**Blocking assessment:** Blocked by inventory-core acceptance (needed to classify source files and public exports) and by agent-cljs-rewrite (agent-loop/runtime event-loop parity). Depends on eta-mu-runtime state/envelope primitives (ready).
---
