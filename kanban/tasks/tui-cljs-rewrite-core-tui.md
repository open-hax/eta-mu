---
uuid: "tui-cljs-rewrite-core-tui"
title: "TUI CLJS Rewrite — Core TUI and Layout Components"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "tui"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/tui-cljs-rewrite.md"
points: 5
category: "tasks"
---

# TUI CLJS Rewrite — Core TUI and Layout Components

> Parent epic: `kanban/epics/tui-cljs-rewrite.md`
> Points: 5

## Purpose

Port the core TUI runtime (`tui.ts`, `terminal.ts` abstractions) and layout components to Reagent/CLJS.

## Scope

- Port `tui.ts` (`TUI`, `Container`, `Component`, focus/overlay primitives) to `eta_mu.tui.web.core` / `eta_mu.tui.domain.tui`.
- Port layout components: `Box`, `Spacer`, `Text`, `TruncatedText`.
- Port differential rendering and cursor placement logic.
- Port theme/shape transforms where needed.

## Deliverables

- [ ] `domain.tui`, `web.core`, and `web.components.layout` namespaces.
- [ ] Reagent wrappers for `Box`, `Spacer`, `Text`, `TruncatedText`.
- [ ] Unit tests for container layout and differential render output.

## Verification gate

- [ ] CLJS tests for layout components pass.
- [ ] Rendered output matches representative snapshots from legacy TS tests.

```bash
pnpm --dir packages/eta-mu-tui cljs:test
pnpm --filter @open-hax/eta-mu-tui test
```

---
Blocked by `tui-cljs-rewrite-terminal-extern` (within-epic) and `eta-mu-cljs-runtime-rewrite` / `eta-mu-cljs-rewrite-boundary-adapters` (core program): core TUI layout and rendering need terminal extern abstractions and the CLJS runtime spine before component porting can begin.
---
