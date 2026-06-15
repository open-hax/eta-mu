---
uuid: "tui-cljs-rewrite-test-parity"
title: "TUI CLJS Rewrite — Test Parity and Coverage"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "tui"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/tui-cljs-rewrite.md"
points: 3
category: "tasks"
---

# TUI CLJS Rewrite — Test Parity and Coverage

> Parent epic: `kanban/epics/tui-cljs-rewrite.md`
> Points: 3

## Purpose

Achieve parity between the legacy TypeScript test suite and the new ClojureScript TUI implementation.

## Scope

- Port or map every `packages/legacy/tui/test/*.test.ts` file to CLJS tests.
- Focus on input, keys, markdown, and overlay behavior.
- Record explicit blockers where direct parity is not feasible.

## Deliverables

- [ ] CLJS test suite covering all ported modules.
- [ ] Parity matrix mapping legacy tests to new tests.
- [ ] Documented blockers with mitigation plans.

## Verification gate

- [ ] `pnpm --filter @open-hax/eta-mu-tui test` passes.
- [ ] CLJS coverage gate is met for domain and extern namespaces.

```bash
pnpm --filter @open-hax/eta-mu-tui test
pnpm --dir packages/eta-mu-tui cljs:coverage
```

---
Blocked by `tui-cljs-rewrite-core-tui`, `tui-cljs-rewrite-input-editor`, `tui-cljs-rewrite-markdown-overlays`, and `tui-cljs-rewrite-utilities` (within-epic): tests cannot reach parity until all ported modules exist and are individually verifiable.
---
