---
uuid: "agent-cljs-rewrite"
title: "Agent Package CLJS Rewrite"
status: "incoming"
priority: "P0"
labels: ["epics", "cljs", "rewrite", "legacy-ts", "agent"]
created_at: "2026-06-15T00:00:00Z"
source: "user-request:2026-06-15"
points: 13
category: "epics"
---

# Agent Package CLJS Rewrite

> Package: `packages/legacy/agent` (`@open-hax/eta-mu-agent-core`)
> Current size: ~4,158 TS lines across 11 files
> Scope: agent loop, proxy orchestration, types, e2e tests

## Purpose

Rewrite the `@open-hax/eta-mu-agent-core` runtime from TypeScript to ClojureScript while preserving its public API and existing test contracts. The CLJS runtime in `packages/eta-mu-runtime` already owns the core belief-state and envelope logic; this epic absorbs the higher-level agent loop and proxy surfaces into CLJS-first namespaces.

## Public compatibility surfaces

- Package exports: `src/index.ts`
- Agent loop: `src/agent-loop.ts`
- Proxy wrapper: `src/proxy.ts`
- Runtime types: `src/types.ts`
- Tests: `test/agent.test.ts`, `test/agent-loop.test.ts`, `test/e2e.test.ts`

## Target namespace map

```text
eta_mu.agent.domain.*     turn decisions, belief updates, tool dispatch
eta_mu.agent.shape.*      message↔envelope transforms, DTO compatibility
eta_mu.agent.law.*        Malli schemas for agent-state and action contracts
eta_mu.agent.extern.*     SDK/provider/HTTP adapters, raw JS interop
eta_mu.agent.infra.*      loop orchestration, session lifecycle, proxy wiring
eta_mu.agent.cli.*        stable JS facade exports for Node consumers
```

## Non-goals

- Do not change package name or npm versioning during this epic.
- Do not rewrite e2e network tests; port them to CLJS-equivalent extern tests.
- Do not absorb `packages/legacy/coding-agent` logic here.

## Phases

### Phase 1 — Inventory and contract map

- Catalog `src/` clusters and classify into domain/shape/law/infra/extern/cli.
- Identify every public export and its consumers inside `packages/legacy`.
- Document proxy behavior contract and agent-loop state machine.

### Phase 2 — Boundary adapters

- Create `extern.*` namespaces for provider SDK payloads, HTTP streams, timers.
- Add conversion regression tests for each extern adapter.
- Verify no raw JS interop leaks outside `extern.*`.

### Phase 3 — Domain and law

- Port pure agent-loop decisions and belief updates to `domain.*`.
- Port Zod/type schemas to Malli in `law.*`.
- Add property-based or example tests for state transitions.

### Phase 4 — Infra and CLI facade

- Wire `infra.*` to use runtime CLJS envelopes and state primitives.
- Keep `src/index.ts` as a thin TypeScript compatibility re-export.
- Run existing agent tests against CLJS-backed implementation.

### Phase 5 — Cutover ratchet

- Replace TS call sites only after parity tests pass.
- Delete obsolete TS modules in path-scoped commits.
- Update docs and verify package build/test gates.

## Acceptance criteria

- [ ] Package inventory classifies every source file and public export.
- [ ] `extern.*` adapters exist with conversion tests.
- [ ] Core agent-loop logic runs in CLJS with Malli-guarded boundaries.
- [ ] Existing `agent.test.ts`, `agent-loop.test.ts`, and `e2e.test.ts` pass or explicit blockers are recorded.
- [ ] Total TypeScript line count for `packages/legacy/agent` does not increase.
- [ ] `pnpm --filter @open-hax/eta-mu-agent-core test` passes.

## Verification gates

```bash
pnpm --filter @open-hax/eta-mu-agent-core test
pnpm --filter @open-hax/eta-mu-agent-core typecheck
node scripts/ts-line-count.mjs packages/legacy/agent
pnpm --dir packages/eta-mu-runtime cljs:verify
```

## Dependencies

- `eta-mu-cljs-runtime-rewrite` (runtime core and boundary patterns)
- `eta-mu-cljs-rewrite-boundary-adapters` (shared extern conventions)

---
## Scheduling review (2026-06-15)

- 1 task ready for breakdown: `agent-cljs-rewrite-phase-1-inventory-contracts`.
- 4 tasks blocked: Phase 2 awaits inventory + core `boundary-adapters`; Phases 3–5 are sequentially blocked within the epic.
- Current bottleneck: core program `eta-mu-cljs-rewrite-boundary-adapters` (in_progress) and the Phase 1 inventory task.
- Concurrency: only the inventory task can start immediately.
---

## Inventory review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `agent-cljs-rewrite-phase-1-inventory-contracts` accepted; inventory doc `docs/agent-cljs-rewrite-inventory.md` produced.

**Key findings from the inventory:**
- `packages/legacy/agent` is small (~4,158 TS lines, 11 files) but tightly coupled to `coding-agent` as the primary consumer.
- Public surface: `Agent` class, `agentLoop`/`agentLoopContinue`/`runAgentLoop`/`runAgentLoopContinue`, `streamProxy`, and the type barrel.
- `Agent` lifecycle (prompt/continue/subscribe/waitForIdle/abort/reset) and queue semantics are documented and must remain byte-for-byte compatible.
- `AgentLoop` state machine (outer while, inner turn, parallel vs sequential tool execution, terminate-batch semantics) is documented.
- TypeBox schemas in `types.ts` and test fixtures must migrate to Malli in `eta_mu.agent.law.*`.
- `proxy.ts` is the only allowed raw-JS surface (`fetch`, `ReadableStream`, `TextDecoder`, `AbortSignal`) and maps cleanly to `eta_mu.agent.extern.proxy`.
- No other package in `packages/legacy` imports the low-level loop functions directly.

**Updated scheduling after inventory:**
- Phase 1 → `review` (done).
- Phase 2 (`extern-adapters`) remains `blocked` until core `boundary-adapters` finishes.
- Once Phase 2 lands, Phases 3–5 can proceed sequentially.

**Recommended next action:** Accept this inventory and move `agent-cljs-rewrite-phase-2-extern-adapters` to `ready` as soon as `eta-mu-cljs-rewrite-boundary-adapters` is done.
