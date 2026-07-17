# @eta-mu/terminal-ui

ClojureScript terminal UI components and host for the eta-mu agent.

This package is the migration target for the legacy TypeScript terminal UI in
`packages/legacy/tui`. It owns terminal boundaries, reusable components, and
message-rendering building blocks; the interactive host that wires them to a
live agent conversation lives in
[`eta-mu`](../eta-mu)'s `infra/cli/tui_repl.cljs` (this package intentionally
has no CLI or provider config of its own — it's a library, not a runnable
binary).

## What's here

| Namespace                          | What it does |
|-------------------------------------|--------------|
| `extern.terminal`                   | Node `process.stdin`/`stdout` boundary: write, cursor, dimensions, raw-mode start/stop, resize |
| `component.box` / `.text` / `.spacer` / `.truncated-text` / `.loader` | Layout primitives — each renders to a vector of lines given a width |
| `component.message`                 | User/assistant/thinking/tool-call/tool-result rendering, built on `component.text` + `shape.ansi` |
| `shape.ansi`                        | Minimal ANSI SGR color/style helpers (pure string functions) |
| `shape.text-utils`                  | ANSI-aware wrapping, visible-width, truncation (handles wide/emoji graphemes) |
| `domain.fuzzy` / `.kill-ring` / `.undo-stack` | Pure editor-support algorithms (not yet wired to an input editor — see [Roadmap](#roadmap)) |

## Using it

```clojure
(ns your.ns
  (:require [eta-mu.terminal-ui.component.message :as message]
            [eta-mu.terminal-ui.extern.terminal :as terminal]))

(def term (terminal/process-terminal))
(doseq [line (message/tool-result "read" false [{:type :text :text "file contents"}] (terminal/columns term))]
  (terminal/write term (str line "\n")))
```

See `eta-mu.infra.cli.tui-repl` in the `eta-mu` package for a complete,
working example that drives this off a real turn-processor agent loop.

## Development

```bash
pnpm --dir packages/terminal-ui build   # ESM library build -> dist-cljs/
pnpm --dir packages/terminal-ui watch   # shadow-cljs watch loop
```

## Test

```bash
pnpm --dir packages/terminal-ui test            # fast unit suite
pnpm --dir packages/terminal-ui test:coverage    # unit suite + c8 coverage (text/lcov/json-summary)
pnpm --dir packages/terminal-ui lint:kondo
```

There is no `test:e2e` in this package — the end-to-end test that exercises
this package's components against a real agent loop lives in
[`eta-mu`](../eta-mu) (`pnpm --dir packages/eta-mu test:e2e`), since that's
where the CLI binary being tested actually lives.

## Roadmap

- **No full-screen host yet.** `extern.terminal` already exposes raw-mode
  `start`/`stop`, cursor movement, and screen-clearing primitives, but
  nothing in this package uses them yet — the current consumer
  (`eta-mu.infra.cli.tui-repl`) is an append-only scrolling REPL that only
  calls `write`/`columns`. A differential-render host (redraw only what
  changed, track cursor position) is unbuilt.
- **No input editor.** `domain.kill-ring`, `domain.undo-stack`, and
  `domain.fuzzy` exist as pure algorithms (with tests) but aren't wired to
  anything that reads raw keystrokes — today's REPL uses Node's `readline`
  instead, so there's no multi-line composition, history, or fuzzy-find UI.
- **No session selector or markdown/image overlays.** Tracked historically
  under `tui-cljs-rewrite-input-editor` / `-markdown-overlays` /
  `-core-tui`, all superseded into this package's own kanban card
  (`kanban/tasks/terminal-ui-cljs-package.md`), where the remaining work
  items are listed.
- **Loader component (`component.loader`) is unused** by the current REPL
  host — there's no in-flight "waiting for the model" indicator yet, since
  the client makes one non-streaming request per turn (see the streaming
  note in [`eta-mu`](../eta-mu)'s README).

## License

GPL-3.0-or-later
