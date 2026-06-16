---
uuid: "ai-cljs-rewrite-phase-1-inventory"
title: "AI CLJS Rewrite — Provider Inventory and Contract Map"
status: done
priority: P0
labels: ["tasks", "cljs", "rewrite", "ai"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/ai-cljs-rewrite.md"
points: 2
category: tasks
---
# AI CLJS Rewrite — Provider Inventory and Contract Map

> Parent epic: `kanban/epics/ai-cljs-rewrite.md`
> Phase: 1
> Points: 2

## Purpose

Catalog every source file and public export in `packages/legacy/ai` and classify them into the target namespace taxonomy before any porting begins.

## Scope

- Classify each `src/**/*.ts` file as `domain`, `shape`, `law`, `infra`, `extern`, or `cli`.
- Map the two package entry points (`src/index.ts`, `src/models.ts`) to their CLJS facade targets.
- Document each provider's request/response contract and identify streaming, OAuth, and retry boundaries.
- List the generated model catalog integration point without regenerating it.

## Work items

- [ ] Produce a file-by-file inventory in `docs/ai-cljs-rewrite-inventory.md`.
- [ ] Create the target namespace map for each provider family.
- [ ] Identify raw JS interop surface area per provider (SDK, fetch, streams, OAuth).
- [ ] Mark dependencies on `eta-mu-cljs-runtime-rewrite` and `eta-mu-cljs-rewrite-boundary-adapters`.

## Acceptance criteria

- [ ] Every `src/**/*.ts` file has a proposed CLJS namespace destination.
- [ ] Public exports from `src/index.ts` and `src/models.ts` are mapped.
- [ ] Streaming, OAuth, and retry boundaries are explicitly listed per provider.

## Verification

```bash
ls docs/ai-cljs-rewrite-inventory.md
pnpm --filter @open-hax/eta-mu-ai typecheck
```

---

**Status update (2026-06-15):** Inventory complete. Produced `docs/ai-cljs-rewrite-inventory.md` cataloging all 46 source files in `packages/legacy/ai`, public exports from `src/index.ts` and `src/models.ts`, the generated model catalog integration point, per-provider raw JS interop surfaces (OpenAI/Anthropic/Google/Bedrock/Mistral/OAuth), and all known consumers inside `packages/legacy` (primarily `coding-agent`). The task file status has been moved from `ready` to `review`.

**Next recommended task:** Begin Phase 2 (`ai-cljs-rewrite-phase-2-canonical-model`) — port `src/types.ts` to `eta_mu.ai.domain.*` and add Malli schemas under `eta_mu.ai.law.*`, keeping the `MODELS` catalog unchanged and consumable from CLJS.
