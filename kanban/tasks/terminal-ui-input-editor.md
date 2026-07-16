---
uuid: "terminal-ui-input-editor"
title: "Terminal UI — Raw-Mode Input Editor"
status: blocked
priority: "P0"
labels: ["tasks", "cljs", "terminal-ui", "tui", "3sp"]
created_at: "2026-07-16T00:00:00Z"
source: "kanban/tasks/terminal-ui-interactive-host.md"
points: 3
category: "tasks"
---
# Terminal UI — Raw-Mode Input Editor

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Predecessor: `kanban/tasks/terminal-ui-interactive-host.md`
> Blocked on: `terminal-ui-differential-render-host` (needs the host to
> render the live input line)

## Purpose

Replace Node's `readline`-based input (used by today's REPL) with a raw-mode
editor: read keystrokes directly, support cursor movement and multi-line
composition, and recall history — so `eta-mu agent`'s prompt behaves like the
stable CLI's, not a plain single-line readline prompt.

## Scope

- New `eta-mu.terminal-ui.infra.input-editor` (or similar): consumes raw
  keypress events from `extern.terminal`, maintains cursor position and a
  multi-line buffer, wires the already-existing pure algorithms
  (`domain.kill-ring`, `domain.undo-stack`, `domain.fuzzy`) that currently
  have no caller.
- Cursor movement: left/right/word-jump, home/end, up/down across
  soft-wrapped and multi-line input.
- History: recall previous submitted prompts (in-memory ring for this card;
  persistent history is out of scope — see Open questions).
- Multi-line composition: a keybinding (e.g. shift+enter or a trailing `\`)
  inserts a newline instead of submitting.
- Renders through `terminal-ui-differential-render-host`, not directly to
  stdout.

## Definition of done

- [ ] Cursor movement (char/word/line, home/end) covered by CLJS tests
      against the buffer/cursor domain logic (no real tty needed for these).
- [ ] History recall covered by a test.
- [ ] Multi-line composition covered by a test (buffer contains embedded
      newline, cursor addressed correctly across lines).
- [ ] `eta-mu agent` on a TTY uses this editor for the prompt line (manual
      pty verification, same method as prior TUI cards).
- [ ] No raw Node/terminal interop outside `extern.*`.
- [ ] `pnpm --dir packages/terminal-ui test` / `lint:kondo` green;
      `pnpm -C packages/eta-mu test` / `test:e2e` / `lint:kondo` green.

## Open questions

- Persistent (cross-process) history: in scope here, or a follow-on once
  `eta-mu-agent-session-persistence` lands (history could piggyback on
  stored sessions)? Leaning follow-on — record the decision here before
  starting.

## Verification

```bash
pnpm --dir packages/terminal-ui test
pnpm --dir packages/terminal-ui lint:kondo
pnpm -C packages/eta-mu test
pnpm -C packages/eta-mu test:e2e
pnpm -C packages/eta-mu lint:kondo
```
