---
uuid: "terminal-ui-cljs-package"
title: "Terminal UI CLJS Package"
status: "review"
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
- [x] Port core TUI components: message rendering (user, assistant, thinking,
      tool call, tool result) via `component.message` + `shape.ansi`.
      **Not done**: input editor, session selector — deferred, see Notes.
- [x] Port the TUI host application entry point — `eta-mu.infra.cli.tui-repl`
      in the `eta-mu` package (append-only scrolling REPL, not a full-screen
      differential-render host — see Notes).
- [x] Wire the host application to `@eta-mu/turn-processor` and
      `eta-mu.extern.openai`; `eta-mu agent` uses it by default on a TTY
      (`--plain` opts back into the old println REPL).
- [x] Add tests covering representative rendering and input flows.
- [x] Verify `clj-kondo` clean and test target passes.
- [x] Update parent kanban task and architecture inventory.

## Acceptance criteria

- [x] `pnpm --dir packages/terminal-ui build` produces a library and/or executable target.
- [x] `pnpm --dir packages/terminal-ui test` passes.
- [x] No raw Node/terminal interop appears outside `extern` or `infra` namespaces.
- [x] At least one representative TUI flow is reproduced by a CLJS test.
- [x] No new TypeScript is introduced.

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

**Scoping note (2026-07-12):** this pass wires a real but intentionally modest
TUI: an append-only, scrolling REPL (`eta-mu.infra.cli.tui-repl`) that renders
each turn-processor lifecycle event through `component.message` (colorized,
word-wrapped labels for user/assistant/tool-call/tool-result). It does **not**
implement a full-screen differential-render host, raw-mode input editor
(cursor movement, history, multi-line composition), or session
selector/overlays — those remain open follow-on work (originally scoped
separately as `tui-cljs-rewrite-core-tui` / `-input-editor` /
`-markdown-overlays`, all superseded into this card). The existing
`extern.terminal` protocol already exposes raw-mode `start`/`stop`/cursor
primitives needed for that follow-on, unused by this increment beyond
`write`/`columns`.

## Progress

- Package created with ESM build target and 7 tests covering `ProcessTerminal`.
- First extern (`eta-mu.terminal-ui.extern.terminal`) ported with write,
  dimensions, cursor, clear, title, start/stop, and drain-input.

---
Fixed 24 tests: bracket mismatches (text_utils, box, undo_stack_test), Segmenter iterator protocol, Map.size property, strip-ansi, forward declarations, clojure.string requires, kill-ring rotate test, undo-stack structuredClone. Lint clean 0/0.

Wired a real, working TUI for eta-mu agent: added component.message (user/assistant/thinking/tool-call/tool-result rendering) and shape.ansi (SGR color helpers) to packages/terminal-ui, and eta-mu.infra.cli.tui-repl in packages/eta-mu that renders every turn-processor lifecycle event through those components. eta-mu agent now defaults to this TUI on a TTY (--plain reverts to the old println REPL). Verified live against $PROXX_URL with model gemma4:31b using 'script' to allocate a real pty: banner, colorized assistant reply, and clean /exit all rendered correctly. terminal-ui: 32 tests/78 assertions, 0 kondo warnings. eta-mu: 79 tests/147 assertions, 0 kondo warnings, both build clean. Scope note: this is an append-only scrolling REPL, not the full-screen differential-render + raw-mode input editor from the legacy TUI (session selectors, cursor-addressable multi-line composition, markdown overlays) -- that remains open follow-on work, noted in the card body.
---
