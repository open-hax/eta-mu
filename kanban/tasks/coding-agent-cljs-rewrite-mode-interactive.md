---
uuid: "coding-agent-cljs-rewrite-mode-interactive"
title: "Coding Agent CLJS Rewrite — Interactive Mode Parity"
status: "blocked"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "5sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 5
category: "tasks"
---

# Coding Agent CLJS Rewrite — Interactive Mode Parity

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 5

## Purpose

Port the interactive TUI mode orchestration and components to ClojureScript while keeping `src/main.ts` and entry TS as thin compatibility shells.

## Scope

- `src/modes/interactive/interactive-mode.ts`
- `src/modes/interactive/components/*`
- `src/modes/interactive/theme/*`, `src/modes/interactive/assets/*`
- `test/interactive-mode-*.test.ts`, `test/theme-export.test.ts`, `test/footer*.test.ts`, `test/user-message.test.ts`

## Deliverables

- [ ] CLJS orchestration for interactive mode state machine and command handling
- [ ] CLJS components for messages, selectors, timers, diff, bash execution, tool execution
- [ ] Preserved theme JSON and asset copy rules
- [ ] Regression tests for status, compaction, suspend, clone, import, keybindings, and theme export

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Blocking assessment:** Blocked by inventory-modes-cli, tui-cljs-rewrite (incoming), and infra-session-manager. Interactive mode consumes TUI components and session state.
---
