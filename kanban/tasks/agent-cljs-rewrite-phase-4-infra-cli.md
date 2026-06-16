---
uuid: "agent-cljs-rewrite-phase-4-infra-cli"
title: "Agent CLJS Rewrite — Infra, Shape, and CLI Facade"
status: "blocked"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "agent"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/agent-cljs-rewrite.md"
points: 3
category: "tasks"
---

# Agent CLJS Rewrite — Infra, Shape, and CLI Facade

> Parent epic: `kanban/epics/agent-cljs-rewrite.md`
> Phase: 4
> Points: 3

## Purpose

Wire the higher-level agent runtime into CLJS-first namespaces and provide a stable compatibility facade so existing Node consumers keep working.

## Scope

- `eta_mu.agent.infra.*` loop orchestration, session lifecycle, proxy wiring
- `eta_mu.agent.shape.*` message↔envelope transforms and DTO compatibility
- `eta_mu.agent.cli.*` stable JS facade exports for Node consumers
- Keep `src/index.ts` as a thin TypeScript compatibility re-export

## Work items

- [ ] Implement `infra.*` namespaces using runtime CLJS envelopes and state primitives.
- [ ] Implement `shape.*` transforms for existing TS/JS DTO compatibility.
- [ ] Implement `cli.*` stable JS facade exports.
- [ ] Keep `src/index.ts` as a thin re-export of the CLJS-backed implementation.
- [ ] Run existing `agent.test.ts`, `agent-loop.test.ts`, and `e2e.test.ts` against the CLJS-backed implementation.

## Acceptance criteria

- [ ] `infra.*` orchestration uses runtime CLJS primitives without duplicating domain policy.
- [ ] `shape.*` round-trips representative agent payloads between CLJS and JS DTOs.
- [ ] `src/index.ts` remains the public entry point and exports the same symbols.
- [ ] Existing agent tests pass or explicit blockers are recorded.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-agent-core test
pnpm --filter @open-hax/eta-mu-agent-core typecheck
node scripts/ts-line-count.mjs packages/legacy/agent
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
Blocked by `agent-cljs-rewrite-phase-3-domain-law`: infra orchestration must consume domain decisions and law schemas. Also depends on `agent-cljs-rewrite-phase-2-extern-adapters` for effectful boundaries.
---
