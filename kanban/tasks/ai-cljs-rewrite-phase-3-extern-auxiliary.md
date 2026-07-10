---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "ai"]
write-id: "1783693251133-0.ljpxlpmd8qkadr6d3a1"
points: "2"
source: "kanban/epics/ai-cljs-rewrite.md"
title: "AI CLJS Rewrite — Auxiliary Provider Extern Adapters"
priority: "P1"
status: "ready"
uuid: "ai-cljs-rewrite-phase-3-extern-auxiliary"
created_at: "2026-06-15T00:00:00Z"
---

# AI CLJS Rewrite — Auxiliary Provider Extern Adapters

> Parent epic: `kanban/epics/ai-cljs-rewrite.md`
> Phase: 3
> Points: 2

## Purpose

Create `eta_mu.ai.extern` namespaces for the remaining provider families: Mistral, Cloudflare, Faux, and GitHub Copilot headers.

## Scope

- Mistral provider (`src/providers/mistral.ts`).
- Cloudflare provider (`src/providers/cloudflare.ts`).
- Faux provider (`src/providers/faux.ts`).
- GitHub Copilot headers helper (`src/providers/github-copilot-headers.ts`).
- GitHub Copilot OAuth helper (`src/utils/oauth/github-copilot.ts`).

## Work items

- [ ] Implement `eta_mu.ai.extern.mistral` client and shape adapters.
- [ ] Implement `eta_mu.ai.extern.cloudflare` client and shape adapters.
- [ ] Implement `eta_mu.ai.extern.faux` for the local test provider.
- [ ] Implement `eta_mu.ai.extern.copilot` for header and OAuth helpers.
- [ ] Add regression tests for reasoning mode, tool schema, lazy module load, and Copilot OAuth.

## Acceptance criteria

- [ ] Auxiliary provider tests pass against CLJS-backed implementation or blockers are recorded.
- [ ] Faux provider remains usable as a test double.
- [ ] No raw JS interop leaks outside `extern.*` namespaces.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-ai test -- --grep "mistral|cloudflare|faux|github-copilot"
node scripts/ts-line-count.mjs packages/legacy/ai
```

---
Status updated to blocked: waiting for Phase 2 canonical message model and shared boundary-adapter conventions (core boundary-adapters task is done as of 2026-07-10).
---