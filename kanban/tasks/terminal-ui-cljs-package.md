---
uuid: "terminal-ui-cljs-package"
title: "Terminal UI CLJS Package"
status: "in_progress"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "tui", "terminal-ui", "5sp"]
created_at: "2026-07-09T18:00:00Z"
source: "kanban/tasks/legacy-package-reorganization.md"
points: 5
category: "tasks"
---

# Terminal UI CLJS Package

> Parent: `kanban/tasks/legacy-package-reorganization.md`
> Legacy source: `packages/legacy/tui`

## Purpose

Create `packages/terminal-ui` as the new ClojureScript home for the rich terminal
interface that was previously embedded in `packages/legacy/tui`. The package
provides reusable terminal components and a host application that can be wired
to an agent turn-loop engine (e.g. `@eta-mu/turn-processor`).

## Scope

- `packages/legacy/tui/src/**` — identify public components and entry points.
- `packages/legacy/tui/src/components/**` — reusable terminal UI components.
- `packages/legacy/tui/src/terminal.ts` and related externs — Node terminal
  boundaries (cursor, input, screen, image rendering, etc.).
- A host application that consumes `@eta-mu/turn-processor` and renders the
  agent conversation.

## Work items

- [x] Survey `packages/legacy/tui` source and tests; identify public surfaces.
- [x] Create `packages/terminal-ui` package, shadow-cljs build, and `.clj-kondo` config.
- [x] Port terminal extern boundaries (cursor, screen, input, resize).
- [ ] Port core TUI components (user message, assistant message, thinking, tool call, tool result, input editor, session selector, etc.).
- [ ] Port the TUI host application entry point.
- [ ] Wire the host application to `@eta-mu/turn-processor` and `eta-mu.extern.openai` (or a future provider adapter).
- [ ] Add tests covering representative rendering and input flows.
- [ ] Verify `clj-kondo` clean and test target passes.
- [ ] Update parent kanban task and architecture inventory.

## Acceptance criteria

- [ ] `pnpm --dir packages/terminal-ui build` produces a library and/or executable target.
- [ ] `pnpm --dir packages/terminal-ui test` passes.
- [ ] No raw Node/terminal interop appears outside `extern` or `infra` namespaces.
- [ ] At least one representative TUI flow is reproduced by a CLJS test.
- [ ] No new TypeScript is introduced.

## Verification

```bash
pnpm --dir packages/terminal-ui build
pnpm --dir packages/terminal-ui test
pnpm --dir packages/terminal-ui lint:kondo
```

## Notes

This package is the visual counterpart to the agent engine in
`packages/turn-processor`. It should not contain business logic or provider
adapters; those live in the engine and provider packages.

## Progress

- Package created with ESM build target and 7 tests covering `ProcessTerminal`.
- First extern (`eta-mu.terminal-ui.extern.terminal`) ported with write,
  dimensions, cursor, clear, title, start/stop, and drain-input.
