---
uuid: "github-cljs-rewrite-domain-pr"
title: "GitHub CLJS Rewrite — PR Automation Domain"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "github"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/github-cljs-rewrite.md"
points: 3
category: "tasks"
---

# GitHub CLJS Rewrite — PR Automation Domain

> Parent epic: `kanban/epics/github-cljs-rewrite.md`
> Scope: `packages/legacy/github/src/ensure-pr.ts`, `src/autofix.ts`
> Points: 3

## Purpose

Port PR creation, update, and autofix decision logic into pure CLJS domain namespaces.

## Scope

- `ensure-pr`: PR existence checks, branch refs, title/body decisions
- `autofix`: autofix trigger policy and patch routing
- Malli schemas for PR inputs and actions under `law.*`

## Work items

- [ ] Implement `eta_mu.github.domain.pr` for PR create/update decisions.
- [ ] Implement `eta_mu.github.domain.autofix` for autofix policy.
- [ ] Define `law.pr` and `law.autofix` Malli schemas.
- [ ] Add regression tests against representative payloads from `ensure-pr.test.ts`.
- [ ] Keep `src/ensure-pr.ts` and `src/autofix.ts` as thin TS wrappers.

## Acceptance criteria

- [ ] Domain decisions are pure and free of Node, git, HTTP, and FS interop.
- [ ] Schemas reject malformed PR and autofix payloads.
- [ ] Existing `ensure-pr.test.ts` passes against CLJS-backed wrappers.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-github test -- ensure-pr
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Status note:** Blocked by `github-cljs-rewrite-inventory`, `github-cljs-rewrite-extern-adapters` (needs PR/autofix data shapes and config adapter), and `eta-mu-cljs-rewrite-boundary-adapters` (done).
---
