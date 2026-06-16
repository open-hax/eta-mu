---
uuid: "ai-cljs-rewrite-phase-3-extern-bedrock"
title: "AI CLJS Rewrite — Amazon Bedrock Extern Adapter"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "ai"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/ai-cljs-rewrite.md"
points: 2
category: "tasks"
---

# AI CLJS Rewrite — Amazon Bedrock Extern Adapter

> Parent epic: `kanban/epics/ai-cljs-rewrite.md`
> Phase: 3
> Points: 2

## Purpose

Create the `eta_mu.ai.extern.bedrock` namespace for the Amazon Bedrock provider and the standalone bedrock-provider entry point.

## Scope

- Bedrock provider (`src/providers/amazon-bedrock.ts`, `src/bedrock-provider.ts`).
- Bedrock endpoint resolution and model selection.
- Bedrock thinking payload handling.

## Work items

- [ ] Implement `eta_mu.ai.extern.bedrock.client` for AWS SDK construction and streaming.
- [ ] Implement `eta_mu.ai.extern.bedrock.shape` for request/response transforms.
- [ ] Add regression tests for endpoint resolution, model lists, and thinking payload.

## Acceptance criteria

- [ ] Bedrock tests pass against CLJS-backed implementation or blockers are recorded.
- [ ] No raw JS interop leaks outside `extern.*` namespaces.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-ai test -- --grep "bedrock"
node scripts/ts-line-count.mjs packages/legacy/ai
```

---
Status updated to blocked: waiting for Phase 2 canonical message model and shared boundary-adapter conventions (core boundary-adapters task is still in_progress).
---
