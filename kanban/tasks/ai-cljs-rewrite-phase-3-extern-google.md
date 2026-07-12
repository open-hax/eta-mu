---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "ai"]
write-id: "1783693252831-0.we3x8tzcdog5u8h7zmn"
points: "5"
source: "kanban/epics/ai-cljs-rewrite.md"
title: "AI CLJS Rewrite — Google Family Extern Adapters"
priority: "P1"
status: breakdown
uuid: "ai-cljs-rewrite-phase-3-extern-google"
created_at: "2026-06-15T00:00:00Z"
---
# AI CLJS Rewrite — Google Family Extern Adapters

> Parent epic: `kanban/epics/ai-cljs-rewrite.md`
> Phase: 3
> Points: 5

## Purpose

Create the `eta_mu.ai.extern.google` namespaces for Google Gemini, Google Vertex, and the Gemini CLI provider, plus their shared conversion utilities and OAuth helpers.

## Scope

- Google provider (`src/providers/google.ts`).
- Google shared helpers (`src/providers/google-shared.ts`).
- Google Gemini CLI provider (`src/providers/google-gemini-cli.ts`).
- Google Vertex provider (`src/providers/google-vertex.ts`).
- Google OAuth helpers (`src/utils/oauth/google-antigravity.ts`, `src/utils/oauth/google-gemini-cli.ts`).

## Work items

- [ ] Implement `eta_mu.ai.extern.google.client` for SDK construction and raw HTTP interop.
- [ ] Implement `eta_mu.ai.extern.google.shape` for request/response transforms.
- [ ] Implement `eta_mu.ai.extern.google.gemini_cli` for the Gemini CLI adapter.
- [ ] Implement `eta_mu.ai.extern.google.vertex` for the Vertex adapter.
- [ ] Implement Google OAuth helpers under `eta_mu.ai.extern.google.oauth`.
- [ ] Add regression tests covering image tool result routing, thinking signatures, tool-call missing args, and retry delays.

## Acceptance criteria

- [ ] All Google-family tests pass against CLJS-backed implementation or blockers are recorded.
- [ ] Gemini CLI and Vertex-specific behaviors are covered.
- [ ] No raw JS interop leaks outside `extern.*` namespaces.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-ai test -- --grep "google"
node scripts/ts-line-count.mjs packages/legacy/ai
```

---
Status updated to blocked: waiting for Phase 2 canonical message model and shared boundary-adapter conventions (core boundary-adapters task is done as of 2026-07-10).

Unblocked: core boundary-adapters task completed 2026-07-10. Phase 2 canonical message model and shared conventions are in place. Ready to begin Google/Gemini extern adapter implementation.
---
