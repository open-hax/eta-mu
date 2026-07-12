---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "tui"]
write-id: "1783693466421-0.z7jlfjpr368yzu3efp"
points: "3"
source: "kanban/epics/tui-cljs-rewrite.md"
title: "TUI CLJS Rewrite — Test Parity and Coverage"
priority: "P1"
status: "rejected"
uuid: "tui-cljs-rewrite-test-parity"
created_at: "2026-06-15T00:00:00Z"
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

Triage 2026-07-10: superseded by terminal-ui-cljs-package (2026-07-09 decision to build packages/terminal-ui); this epic's scope maps 1:1 onto that card's open work items. Closed as superseded, not abandoned.
---