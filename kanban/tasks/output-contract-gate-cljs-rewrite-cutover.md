---
uuid: "output-contract-gate-cljs-rewrite-cutover"
title: "Output Contract Gate CLJS Rewrite — Cutover"
status: "rejected"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "output-contract-gate"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/output-contract-gate-cljs-rewrite.md"
points: 2
category: "tasks"
---

# Output Contract Gate CLJS Rewrite — Cutover

> Parent epic: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Points: 2

## Purpose

Delete obsolete TypeScript modules after parity tests pass and the TS-line-count ratchet is satisfied.

## Deliverables

- Remove migrated modules: `edn.ts`, `validate.ts`, `repair.ts`, `review.ts`, `generate.ts`, `markdown.ts`, `artifacts.ts`, `types.ts`, `fixtures.ts`, `jsedn.d.ts`.
- Keep `src/cli.ts`, `src/index.ts`, and tests only as thin facades during transition; delete when fully replaced.
- Update `package.json` `main`/`types` if needed.
- Confirm TS line count decreased.

## Verification gate

- [ ] `pnpm --filter @open-hax/output-contract-gate test` still passes after deletion.
- [ ] `pnpm --filter @open-hax/output-contract-gate build` passes.
- [ ] `node scripts/ts-line-count.mjs packages/legacy/output-contract-gate` reports lower TS line count than baseline.
- [ ] No remaining duplicate logic between legacy TS and new CLJS namespaces.

---
> Blocked by `output-contract-gate-cljs-rewrite-parity-tests`: obsolete TS modules can only be deleted after parity is proven.
---
