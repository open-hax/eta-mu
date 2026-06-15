---
uuid: "ai-cljs-rewrite-phase-3-extern-anthropic"
title: "AI CLJS Rewrite — Anthropic Extern Adapter"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "ai"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/ai-cljs-rewrite.md"
points: 5
category: "tasks"
---

# AI CLJS Rewrite — Anthropic Extern Adapter

> Parent epic: `kanban/epics/ai-cljs-rewrite.md`
> Phase: 3
> Points: 5

## Purpose

Create the `eta_mu.ai.extern.anthropic` namespace and port the Anthropic provider including its OAuth flow, SSE parsing, and tool-call normalization.

## Scope

- Anthropic provider (`src/providers/anthropic.ts`).
- Anthropic OAuth helper (`src/utils/oauth/anthropic.ts`).
- SSE parsing utilities (`src/utils/event-stream.ts`).
- Tool-call id/name normalization and eager tool input compatibility.
- Thinking disable, cache retention, and long-cache retention behaviors.

## Work items

- [ ] Implement `eta_mu.ai.extern.anthropic.client` for SDK construction and streaming.
- [ ] Implement `eta_mu.ai.extern.anthropic.shape` for request/response transforms.
- [ ] Implement `eta_mu.ai.extern.anthropic.oauth` for the Anthropic OAuth flow.
- [ ] Port SSE parsing helpers into `eta_mu.ai.extern.common.stream` or equivalent.
- [ ] Add regression tests covering tool normalization, thinking disable, cache retention, and OAuth paths.

## Acceptance criteria

- [ ] All Anthropic-specific tests pass against CLJS-backed implementation or blockers are recorded.
- [ ] Anthropic OAuth test path is covered.
- [ ] No raw JS interop leaks outside `extern.*` namespaces.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-ai test -- --grep "anthropic"
node scripts/ts-line-count.mjs packages/legacy/ai
```

---
Status updated to blocked: waiting for Phase 2 canonical message model and shared boundary-adapter conventions (core boundary-adapters task is still in_progress).
---
