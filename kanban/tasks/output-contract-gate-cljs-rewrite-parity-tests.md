---
uuid: "output-contract-gate-cljs-rewrite-parity-tests"
title: "Output Contract Gate CLJS Rewrite — Parity Tests"
status: "rejected"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "output-contract-gate"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/output-contract-gate-cljs-rewrite.md"
points: 4
category: "tasks"
---

# Output Contract Gate CLJS Rewrite — Parity Tests

> Parent epic: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Points: 4

## Purpose

Run the full existing test suite against the CLJS-backed implementation and resolve or record all blockers.

## Deliverables

- CLJS-backed build passes `pnpm --filter @open-hax/output-contract-gate test`.
- CLJS-backed build passes `pnpm --filter @open-hax/output-contract-gate typecheck`.
- Regression coverage for each public export.
- Documented blockers with owner and resolution path (if any).

## Verification gate

- [ ] `pnpm --filter @open-hax/output-contract-gate test` exits 0.
- [ ] `pnpm --filter @open-hax/output-contract-gate typecheck` exits 0.
- [ ] `node scripts/ts-line-count.mjs packages/legacy/output-contract-gate` shows no increase in TS lines.
- [ ] `pnpm --dir packages/eta-mu-runtime cljs:verify` exits 0.

---
> Blocked by `output-contract-gate-cljs-rewrite-cli-facade` and `output-contract-gate-cljs-rewrite-conversion-tests`.
---
