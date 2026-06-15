---
uuid: "github-cljs-rewrite-cli-surface-parity"
title: "GitHub CLJS Rewrite — CLI Surface Parity"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "github"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/github-cljs-rewrite.md"
points: 3
category: "tasks"
---

# GitHub CLJS Rewrite — CLI Surface Parity

> Parent epic: `kanban/epics/github-cljs-rewrite.md`
> Scope: `packages/legacy/github/src/cli.ts`, `src/index.ts`
> Points: 3

## Purpose

Preserve the existing CLI and package export surface while backing it with the CLJS implementation.

## Scope

- `src/index.ts` public exports as thin TS compatibility wrappers
- `src/cli.ts` command handlers delegating to CLJS namespaces
- Full test suite run against CLJS-backed package

## Work items

- [ ] Update `src/index.ts` to re-export CLJS-backed functions with stable signatures.
- [ ] Update `src/cli.ts` to delegate command handling to CLJS `cli.*` namespaces.
- [ ] Add a Node ESM smoke test proving the default entrypoint is callable.
- [ ] Run the full existing test suite and record explicit blockers for any failures.

## Acceptance criteria

- [ ] Public package exports remain unchanged from a consumer perspective.
- [ ] CLI commands produce the same outputs as the legacy implementation.
- [ ] `pnpm --filter @open-hax/eta-mu-github test` passes or blockers are recorded.
- [ ] `pnpm --filter @open-hax/eta-mu-github typecheck` passes.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-github test
pnpm --filter @open-hax/eta-mu-github typecheck
node scripts/ts-line-count.mjs packages/legacy/github
```

---
**Status note:** Blocked by all upstream GitHub rewrite tasks (`inventory`, `extern-adapters`, `runtime-batch-adapter`, `domain-pr`, `review-gate`, `event-classifier`, `pi-agent`) and `eta-mu-cljs-rewrite-boundary-adapters`.
---
