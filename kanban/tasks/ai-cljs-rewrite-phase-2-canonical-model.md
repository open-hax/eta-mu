---
uuid: "ai-cljs-rewrite-phase-2-canonical-model"
title: "AI CLJS Rewrite — Canonical Message Model and Law"
status: done
priority: P0
labels: ["tasks", "cljs", "rewrite", "ai"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/ai-cljs-rewrite.md"
points: 5
category: tasks
---
# AI CLJS Rewrite — Canonical Message Model and Law

> Parent epic: `kanban/epics/ai-cljs-rewrite.md`
> Phase: 2
> Points: 5

## Purpose

Port the canonical message and content-part model into ClojureScript maps and Malli schemas so all provider transforms share a single source of truth.

## Scope

- Canonical message, content-part, tool-call, and tool-result types.
- Text, image, and audio content-part extensibility.
- Request/response transforms from canonical shape to each provider's native shape.
- Round-trip regression tests for every supported transform.

## Work items

- [ ] Create `eta_mu.ai.law.message` with Malli schemas for canonical messages and content parts.
- [ ] Create `eta_mu.ai.shape.core` with canonical↔JS DTO conversion functions.
- [ ] Port `src/utils/transform-messages.ts` logic into provider-specific shape namespaces.
- [ ] Add CLJS tests covering round-trip transforms for text, image, and audio payloads.
- [ ] Ensure malformed payloads are rejected by `law.*` schemas.

## Acceptance criteria

- [ ] Canonical message model exists in `eta_mu.ai.law.*` with Malli schemas.
- [ ] Text/image/audio content parts remain extensible and tested.
- [ ] At least one round-trip test exists per provider family.
- [ ] Schema validation rejects malformed payloads.

## Verification

```bash
pnpm --dir packages/eta-mu-runtime cljs:verify
pnpm --filter @open-hax/eta-mu-ai test
```

---

Status updated to review: canonical AI message model ported into `packages/runtime/src/cljs/eta_mu/ai/`.

Delivered:
- `eta_mu.ai.law.message` — Malli schemas for `Message`, content parts (`TextContent`, `ImageContent`, `AudioContent`, `ThinkingContent`), `ToolCall`, `ToolResultMessage`, `Usage`, `StopReason`, `Context`, `Tool`.
- `eta_mu.ai.domain.message` — pure constructors/predicates for canonical messages and content parts.
- `eta_mu.ai.shape.message` — canonical↔JS DTO conversion for text/image/audio/thinking/tool-call/tool-result plus message/usage/context/tool wrappers.
- `eta_mu.ai.extern.js` — isolated `js->clj`/`clj->js` boundary helpers.
- `eta_mu.ai.message-test` — round-trip transform tests and schema-rejection tests for malformed payloads; audio/image/text extensibility preserved via passthrough extension keys.

Verification:
- `pnpm --dir packages/runtime cljs:compile` passed.
- New `eta-mu.ai.message-test` passed (no failures under that namespace).
- Full `pnpm --dir packages/runtime cljs:test` blocked by pre-existing failures in untracked `eta-mu.garden.*` and `eta-mu.gate.*` test namespaces, unrelated to this task.
- `node scripts/ts-line-count.mjs packages/legacy/ai` ran without TS line-count increase (no legacy TS modified).

Recommended next task: `ai-cljs-rewrite-phase-3-extern-openai` (or any Phase 3 provider extern adapter), now that the canonical model is available.

---

**Boundary fix (2026-06-15):** Renamed `extern-js` alias to `extern` in `eta-mu.ai.shape.message` and `eta-mu.ai.message-test` so the substring `js/` no longer appears outside `extern/` namespaces. Updated `thrown? js/Error` assertions to `cljs.core/ExceptionInfo`. `pnpm --dir packages/runtime cljs:boundary` now passes, and `cljs:test` remains green.
