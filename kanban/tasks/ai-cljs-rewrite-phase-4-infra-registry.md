---
uuid: "ai-cljs-rewrite-phase-4-infra-registry"
title: "AI CLJS Rewrite — Infra, Registry, and Model Catalog"
status: icebox
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "ai"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/ai-cljs-rewrite.md"
points: 4
category: "tasks"
---
# AI CLJS Rewrite — Infra, Registry, and Model Catalog

> Parent epic: `kanban/epics/ai-cljs-rewrite.md`
> Phase: 4
> Points: 4

## Purpose

Port provider registration, model resolution, retries, caching, and the generated model catalog lookup into `eta_mu.ai.infra.*`.

## Scope

- API registry (`src/api-registry.ts`).
- Provider registration and built-in registration (`src/providers/register-builtins.ts`).
- Model catalog and model selection (`src/models.ts`, `src/models.generated.ts`).
- Retry and overflow utilities (`src/utils/overflow.ts`).
- Validation helpers (`src/utils/validation.ts`, `src/utils/typebox-helpers.ts`).

## Work items

- [ ] Implement `eta_mu.ai.infra.registry` for provider/model registration.
- [ ] Implement `eta_mu.ai.infra.model-catalog` to expose the generated catalog via CLJS lookup.
- [ ] Implement `eta_mu.ai.infra.retry` and `eta_mu.ai.infra.overflow` for retry and context-overflow handling.
- [ ] Port validation helpers to Malli-backed equivalents where appropriate.
- [ ] Add tests for registry lookup, model selection, retry, and overflow behaviors.

## Acceptance criteria

- [ ] Provider registration and model resolution work through CLJS infra.
- [ ] Generated model catalog is accessible without regeneration.
- [ ] Retry and overflow behaviors preserve existing semantics.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-ai test -- --grep "registry|overflow|tokens|validation"
node scripts/ts-line-count.mjs packages/legacy/ai
```

---
Status updated to blocked: waiting for Phase 3 extern adapters and Phase 2 canonical model.
---
