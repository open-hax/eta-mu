---
uuid: "tui-cljs-rewrite-utilities"
title: "TUI CLJS Rewrite — Fuzzy, Keys, Keybindings, and Autocomplete"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "tui"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/tui-cljs-rewrite.md"
points: 3
category: "tasks"
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
---
