---
uuid: "github-cljs-rewrite-pi-agent"
title: "GitHub CLJS Rewrite — Pi Agent Integration"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "github"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/github-cljs-rewrite.md"
points: 2
category: "tasks"
---

# GitHub CLJS Rewrite — Pi Agent Integration

> Parent epic: `kanban/epics/github-cljs-rewrite.md`
> Scope: `packages/legacy/github/src/pi-agent.ts`
> Points: 2

## Purpose

Port the Pi agent integration surface to CLJS so agent-driven GitHub actions route through the new domain namespaces.

## Scope

- Pi agent action dispatch mapping
- Tool descriptor data for GitHub operations
- Conversion between Pi message shapes and GitHub domain shapes

## Work items

- [ ] Implement `eta_mu.github.infra.pi_agent` for agent action dispatch.
- [ ] Define tool descriptors in `eta_mu.github.law.pi_agent`.
- [ ] Add round-trip tests between Pi message shapes and GitHub domain actions.
- [ ] Keep `src/pi-agent.ts` as a thin TS wrapper.

## Acceptance criteria

- [ ] Agent action dispatch matches legacy behavior.
- [ ] Tool descriptors validate action arguments.
- [ ] No raw JS interop appears outside `extern.*` and `cli.*` facade.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-github test
pnpm --dir packages/eta-mu-runtime cljs:boundary
```

---
**Status note:** Blocked by `github-cljs-rewrite-inventory`, `github-cljs-rewrite-extern-adapters`, `github-cljs-rewrite-domain-pr`, `github-cljs-rewrite-review-gate`, `github-cljs-rewrite-event-classifier`, and `eta-mu-cljs-rewrite-boundary-adapters`.
---
