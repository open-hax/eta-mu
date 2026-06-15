---
uuid: "tui-cljs-rewrite-input-editor"
title: "TUI CLJS Rewrite — Input and Editor Components"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "tui"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/tui-cljs-rewrite.md"
points: 5
category: "tasks"
---

# TUI CLJS Rewrite — Input and Editor Components

> Parent epic: `kanban/epics/tui-cljs-rewrite.md`
> Points: 5

## Purpose

Port the interactive text input and editor components, plus their supporting state machines, to CLJS.

## Scope

- Port `components/input.ts` to `eta_mu.tui.web.components.input`.
- Port `components/editor.ts` and `editor-component.ts` to `eta_mu.tui.web.components.editor`.
- Port `kill-ring.ts` to `eta_mu.tui.domain.kill-ring`.
- Port `undo-stack.ts` to `eta_mu.tui.domain.undo`.
- Preserve keybinding-driven editing behavior and theming.

## Deliverables

- [ ] Input and editor Reagent components.
- [ ] Pure `domain` namespaces for kill-ring and undo state.
- [ ] Regression tests for cursor movement, insertion, deletion, undo/redo, and kill/yank.

## Verification gate

- [ ] CLJS tests for input and editor pass.
- [ ] Legacy TS tests for `input.test.ts` and `editor.test.ts` behaviors are reproduced in CLJS.

```bash
pnpm --dir packages/eta-mu-tui cljs:test
pnpm --filter @open-hax/eta-mu-tui test
```

---
Blocked by `tui-cljs-rewrite-core-tui` and `tui-cljs-rewrite-terminal-extern` (within-epic): input and editor components depend on core TUI layout primitives, terminal extern keys, and utility keybindings.
---
