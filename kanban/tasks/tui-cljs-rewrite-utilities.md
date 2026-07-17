---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "tui"]
write-id: "1783693464827-0.8uem1n13l3p3bvhmw9d"
points: "3"
source: "kanban/epics/tui-cljs-rewrite.md"
title: "TUI CLJS Rewrite — Fuzzy, Keys, Keybindings, and Autocomplete"
priority: "P1"
status: "rejected"
uuid: "tui-cljs-rewrite-utilities"
created_at: "2026-06-15T00:00:00Z"
---

# TUI CLJS Rewrite — Fuzzy, Keys, Keybindings, and Autocomplete

> Parent epic: `kanban/epics/tui-cljs-rewrite.md`
> Points: 3

## Purpose

Port the remaining utility modules that components depend on: fuzzy matching, keybindings, and autocomplete providers.

## Scope

- Port `fuzzy.ts` to `eta_mu.tui.domain.fuzzy`.
- Port `keybindings.ts` to `eta_mu.tui.domain.keybindings`.
- Port `autocomplete.ts` to `eta_mu.tui.domain.autocomplete`.
- Compose with already-ported `keys.ts` extern.

## Deliverables

- [ ] Pure `domain` namespaces for fuzzy matching, keybindings, and autocomplete.
- [ ] Regression tests for fuzzy scoring, keybinding resolution, and combined autocomplete providers.

## Verification gate

- [ ] CLJS tests for utilities pass.
- [ ] Legacy TS tests `fuzzy.test.ts`, `keybindings.test.ts`, and `autocomplete.test.ts` behaviors are reproduced in CLJS.

```bash
pnpm --dir packages/eta-mu-tui cljs:test
pnpm --filter @open-hax/eta-mu-tui test
```

---
Blocked by `tui-cljs-rewrite-terminal-extern` (within-epic): keybindings and autocomplete compose with the keys extern, and fuzzy matching shares component test infrastructure with the core TUI port.

Triage 2026-07-10: superseded by terminal-ui-cljs-package (2026-07-09 decision to build packages/terminal-ui); this epic's scope maps 1:1 onto that card's open work items. Closed as superseded, not abandoned.
---