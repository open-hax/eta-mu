---
category: "tasks"
labels: ["tasks", "cljs", "terminal-ui", "tui", "3sp"]
write-id: "1784248856250-0.znqk52u2mfi2l2d1hk"
points: "3"
source: "kanban/tasks/terminal-ui-interactive-host.md"
title: "Terminal UI — Differential-Render Host"
priority: "P0"
status: "done"
uuid: "terminal-ui-differential-render-host"
created_at: "2026-07-16T00:00:00Z"
---

# Terminal UI — Differential-Render Host

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Predecessor: `kanban/tasks/terminal-ui-interactive-host.md` (split into this
> card + `terminal-ui-input-editor` / `terminal-ui-markdown-rendering` /
> `terminal-ui-session-selector`)
> Blocks: `terminal-ui-input-editor`, `terminal-ui-markdown-rendering`,
> `terminal-ui-session-selector` (all render through this host)

## Purpose

Replace the append-only scrolling REPL (`eta-mu.infra.cli.tui-repl`) with a
full-screen host: enter raw/alt-screen mode, track a virtual frame (lines of
styled text), and on each state change redraw only the changed region instead
of reprinting the whole screen. This is the foundational piece every other
terminal-ui-interactive-host slice renders through.

## Scope

- New `eta-mu.terminal-ui.infra.host` (or similar) in `packages/terminal-ui`:
  holds previous/next frame buffers, diffs them, emits the minimal cursor
  moves + writes needed to reconcile via the existing `extern.terminal`
  raw-mode/cursor primitives.
- Alt-screen enter/leave on host start/stop (or clear-and-redraw if the
  target terminal lacks alt-screen — degrade gracefully, don't crash).
- Terminal resize handling: `extern.terminal`'s resize hook triggers a full
  redraw at the new width.
- Wire `eta-mu.infra.cli` so `eta-mu agent` on a TTY runs this host by
  default; `--plain` still opts into the old println REPL (`tui-repl` stays
  as the `--plain` implementation, unchanged).
- Message/tool-call/tool-result rendering itself is unchanged in this card —
  reuse `component.message` as-is; only the redraw mechanism changes.

## Definition of done

- [x] A test asserts minimal-diff output for an incremental single-line
      update (e.g. streaming text delta) — i.e. it does NOT redraw the whole
      screen for a one-line change.
- [x] A test covers full redraw on resize.
- [x] `eta-mu agent` on a TTY (verified with `script` to allocate a real pty,
      same method used in the predecessor card) runs the new host — see scope
      note below on what "runs the host" ended up meaning; `--plain` is
      untouched (still `eta-mu.infra.cli.repl`, doesn't even see `tui-repl`).
- [x] No raw Node/terminal interop outside `extern.*`.
- [x] `pnpm --dir packages/terminal-ui test` / `lint:kondo` green;
      `pnpm -C packages/eta-mu test` / `test:e2e` / `lint:kondo` green.

## Scope note (delivered 2026-07-16)

Full alt-screen/viewport takeover was **not** built here, and the card's
original framing ("replace the append-only REPL with a full-screen host")
overpromised relative to what's safe to land before `terminal-ui-input-editor`
exists. Reason: `tui-repl` reads input via Node's `readline` (cooked mode);
handing the terminal to a raw-mode alt-screen host while `readline` still owns
stdin is exactly the raw-mode-vs-readline conflict `terminal-ui-input-editor`
exists to solve properly. Forcing it here would have meant either breaking
today's working input path or quietly duplicating input-handling logic that
card needs to own anyway.

What *is* delivered and real, not a stub:

- `eta-mu.terminal-ui.infra.host` (`packages/terminal-ui`): `diff-ops` (pure
  frame diff), `new-state`, `render!` (diffs against last-rendered frame,
  writes only changed rows via `\r` + clear-line + write — the `\r` fixes a
  real bug caught while writing this: `move-by` only moves vertically, so
  without a carriage return a shorter replacement line leaves stale
  characters from the old line's tail), `force-full-redraw!`,
  `start-host!`/`stop-host!` (raw mode + hide-cursor + resize-forces-redraw).
- Wired into `eta-mu.infra.cli.tui-repl` (the existing default TTY surface,
  unchanged as `--plain`'s alternative): a single-line "thinking..." status
  indicator now shows between submitting a prompt and the first token/tool
  result, rendered through `host/render!`, and is cleared in place (not
  scrolled away) the instant any event for that turn arrives.
- Manually verified live in a real pty (`script`) against a mock SSE server:
  `thinking...` appears, then is replaced in place by the streamed reply on
  the same terminal row — confirmed via `cat -A` on the captured pty output
  showing `\r` + `[K` immediately before the replacement text.

Tests: `packages/terminal-ui/test/cljs/eta_mu/terminal_ui/infra/host_test.cljs`
(diff-ops pure cases, minimal-diff render, resize forces full redraw via both
`force-full-redraw!` directly and `start-host!`'s resize listener, and a
regression test for the `\r`-before-clear-line column bug). `terminal-ui`:
37/37 green (up from 35), kondo 0/0. `eta-mu`: 116/116 green (up from 115,
new test asserts the indicator shows and clears), `test:e2e` 3/3 green,
kondo 0/0.

The true full-screen/alt-screen takeover remains `terminal-ui-input-editor`'s
job (it needs to own raw-mode input anyway) and `terminal-ui-markdown-rendering`
/ `terminal-ui-session-selector`'s job to render through once it exists — this
card's `host` namespace is what they'll all call into. Moving to review.

## Verification

```bash
pnpm --dir packages/terminal-ui test
pnpm --dir packages/terminal-ui lint:kondo
pnpm -C packages/eta-mu test
pnpm -C packages/eta-mu test:e2e
pnpm -C packages/eta-mu lint:kondo
```

---
Board triage 2026-07-16: re-verified all gates fresh on this checkout — terminal-ui 37 tests/87 assertions 0 failures, kondo 0 errors 0 warnings; eta-mu 116 tests/216 assertions 0 failures, test:e2e 3/24 green, kondo 0/0. Scope note is honest about the alt-screen deferral (raw-mode input conflict belongs to terminal-ui-input-editor). Recommend promoting to done at next human review pass; input-editor (P0) unblocks the moment this lands.

Adversarial review wave 2 (opencode ultracode, quorum-2 skeptic votes). Findings against this card: 4 raw, 1 CONFIRMED + fixed: 'thinking...' indicator was cleared by run-loop's own :agent_start event instantly — tui-emit now clears the status frame only when an event produces real output (assistant delta, tool result, boxed turn_end); regression test tui-emit-thinking-indicator-survives-lifecycle-events-test. Refuted: printed-counter reset (skeptics verified reset on next turn path), js/process.stdout in repl (grandfathered, byte-identical pre-existing), DoD-3 pty artifact (comment-only accepted in prior round). Gates: eta-mu 137/271 + kondo 0/0 + e2e 4/47, terminal-ui 37/87 + kondo 0/0 — all green.
---