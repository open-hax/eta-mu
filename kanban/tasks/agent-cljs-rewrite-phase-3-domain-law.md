---
uuid: "agent-cljs-rewrite-phase-3-domain-law"
title: "Agent CLJS Rewrite — Domain and Law"
status: icebox
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "agent"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/agent-cljs-rewrite.md"
points: 3
category: "tasks"
---
# Agent CLJS Rewrite — Domain and Law

> Parent epic: `kanban/epics/agent-cljs-rewrite.md`
> Phase: 3
> Points: 3

## Purpose

Port the pure agent-loop decisions, belief updates, and runtime contracts from TypeScript/Zod to ClojureScript/Malli in `eta_mu.agent.domain.*` and `eta_mu.agent.law.*`.

## Scope

- Turn decisions and state transitions from `src/agent-loop.ts`
- Belief updates and tool-dispatch policy from `src/agent.ts`
- Zod/type schemas from `src/types.ts` ported to Malli
- Message and envelope compatibility preserved

## Work items

- [ ] Implement `domain.*` namespaces for turn decisions and belief updates.
- [ ] Implement `law.*` Malli schemas for agent-state and action contracts.
- [ ] Add property-based or example tests for state transitions.
- [ ] Ensure `domain.*` remains free of Node, provider SDK, FS, git, process, and HTTP access.
- [ ] Map runtime type contracts to Malli schemas used by `packages/eta-mu-runtime`.

## Acceptance criteria

- [ ] Core agent-loop logic runs in CLJS with Malli-guarded boundaries.
- [ ] State-transition tests pass under the CLJS test target.
- [ ] Boundary schemas reject at least one malformed payload per major agent data type.
- [ ] No raw JS interop appears outside allowed facade/extern namespaces.

## Verification

```bash
pnpm --dir packages/eta-mu-runtime cljs:verify
pnpm --filter @open-hax/eta-mu-agent-core test
node scripts/ts-line-count.mjs packages/legacy/agent
```

---
Blocked by `agent-cljs-rewrite-phase-2-extern-adapters`: domain/law schemas and decisions depend on agent-specific extern adapter types and opaque-handle rules.
---
