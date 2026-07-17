---
uuid: "terminal-ui-interactive-host"
title: "Terminal UI — Full-Screen Host & Input Editor"
status: archived
priority: "P0"
labels: ["tasks", "cljs", "terminal-ui", "tui", "8sp"]
created_at: "2026-07-15T00:00:00Z"
source: "kanban/tasks/terminal-ui-cljs-package.md"
points: 8
category: "tasks"
---
# Terminal UI — Full-Screen Host & Input Editor

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Predecessor: `kanban/tasks/terminal-ui-cljs-package.md` (done — append-only REPL)
> Supersedes the rejected `tui-cljs-rewrite-core-tui` / `-input-editor` / `-markdown-overlays` cards

## Purpose

The current `eta-mu agent` TTY surface is an append-only scrolling REPL
(`eta-mu.infra.cli.tui-repl`). The published stable CLI ships a full-screen
differential-render host with a raw-mode input editor. This card carries the
deferred scope so npm-install-g parity has a home for it.

## Scope

- Full-screen differential-render host in `packages/terminal-ui`
  (consume the existing `extern.terminal` raw-mode `start`/`stop`/cursor
  primitives, currently unused beyond `write`/`columns`).
- Raw-mode input editor: cursor movement, history, multi-line composition.
- Session selector / overlays.
- Markdown rendering of assistant output (overlay or inline).

## Definition of done

- [ ] `eta-mu agent` on a TTY runs the full-screen host by default; `--plain`
      still opts back into the println REPL.
- [ ] Input editor supports cursor movement, history recall, and multi-line
      composition, each covered by a CLJS test.
- [ ] Differential render verified by a test that asserts minimal redraw
      output for an incremental update.
- [ ] No raw Node/terminal interop outside `extern.*`.
- [ ] `pnpm --dir packages/terminal-ui test` / `lint:kondo` green, zero warnings.

## Open questions

- Does npm-parity v1 need the session selector, or only the editor + host?
- Markdown rendering: port legacy renderer or a simpler ANSI subset first?

## Verification

```bash
pnpm --dir packages/terminal-ui test
pnpm --dir packages/terminal-ui lint:kondo
pnpm -C packages/eta-mu test
```

---
2026-07-15 maintainer decision: target is experience parity with the stable CLI — the full-screen host, raw-mode editor, and session selector are parity requirements, not follow-ons. Priority raised to P0. Open questions on this card are resolved: yes to the session selector; markdown rendering should match the stable CLI's experience (port the behavior, not the TS implementation).

---
Breakdown 2026-07-16: 8sp exceeds the ≤5 implement threshold (PROCESS.md § Breakdown & Size), so this card splits into four smaller, independently-testable slices, in dependency order:

1. `kanban/tasks/terminal-ui-differential-render-host.md` (3sp, P0, ready) — the redraw mechanism everything else renders through. Unblocked; start here.
2. `kanban/tasks/terminal-ui-input-editor.md` (3sp, P0, blocked on #1) — raw-mode cursor/history/multi-line editor, wiring the already-built kill-ring/undo-stack/fuzzy domain algorithms.
3. `kanban/tasks/terminal-ui-markdown-rendering.md` (2sp, P1, blocked on #1) — markdown styling for assistant output.
4. `kanban/tasks/terminal-ui-session-selector.md` (2sp, P1, blocked on #1 AND `eta-mu-agent-session-persistence`) — resume-from-list overlay; genuinely can't start until sessions exist to select from.

Total re-estimates to 10sp across the four slices (up from this card's original 8sp — normal upward drift once each slice got real acceptance criteria). This card's scope is now fully carried by its children; promoting straight to done rather than leaving an empty shell in `ready`/`blocked`, same pattern used for this card's own predecessor (`terminal-ui-cljs-package.md`).
---
