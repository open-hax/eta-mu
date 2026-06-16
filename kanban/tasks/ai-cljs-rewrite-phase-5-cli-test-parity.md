---
uuid: "ai-cljs-rewrite-phase-5-cli-test-parity"
title: "AI CLJS Rewrite — CLI Facade and Test Parity"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "ai"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/ai-cljs-rewrite.md"
points: 3
category: "tasks"
---

# AI CLJS Rewrite — CLI Facade and Test Parity

> Parent epic: `kanban/epics/ai-cljs-rewrite.md`
> Phase: 5
> Points: 3

## Purpose

Keep `src/cli.ts` as a thin TypeScript compatibility layer and run the full `test/*.test.ts` suite against the CLJS-backed implementation.

## Scope

- CLI entry point (`src/cli.ts`).
- Environment API keys helper (`src/env-api-keys.ts`).
- Full `test/*.test.ts` suite.
- Provider-specific gaps documented explicitly.

## Work items

- [ ] Update `src/cli.ts` to delegate to CLJS-backed implementation where available.
- [ ] Preserve existing package exports (`src/index.ts`, `src/models.ts`).
- [ ] Run the entire AI test suite and record any blockers.
- [ ] Document provider-specific gaps with issue references.

## Acceptance criteria

- [ ] Existing AI test suite passes or explicit blockers are recorded.
- [ ] `pnpm --filter @open-hax/eta-mu-ai test` passes.
- [ ] Public package API remains stable.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-ai test
pnpm --filter @open-hax/eta-mu-ai typecheck
```

---
Status updated to blocked: waiting for Phase 4 infra/registry.
---
