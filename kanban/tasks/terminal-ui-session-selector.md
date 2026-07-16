---
uuid: "terminal-ui-session-selector"
title: "Terminal UI — Session Selector Overlay"
status: blocked
priority: "P1"
labels: ["tasks", "cljs", "terminal-ui", "tui", "2sp"]
created_at: "2026-07-16T00:00:00Z"
source: "kanban/tasks/terminal-ui-interactive-host.md"
points: 2
category: "tasks"
---
# Terminal UI — Session Selector Overlay

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Predecessor: `kanban/tasks/terminal-ui-interactive-host.md`
> Blocked on: `terminal-ui-differential-render-host` (overlay renders through
> the diff host) AND `eta-mu-agent-session-persistence` (there is nothing to
> select until sessions are persisted)

## Purpose

Let a user starting `eta-mu agent` on a TTY pick a prior session to resume
from a list, instead of only supporting `--resume <session-id>` by exact ID
(assuming that's what session-persistence lands as a flag).

## Scope

- New overlay component: renders a selectable list of persisted sessions
  (id/timestamp/first-message-preview or similar — shape depends on what
  `eta-mu-agent-session-persistence` actually stores; read that card's
  delivered shape before starting, don't assume).
- Keyboard nav (up/down, enter to select, esc to dismiss and start fresh),
  reusing `domain.fuzzy` for type-to-filter if the list gets long.
- Triggered on `eta-mu agent` startup on a TTY when prior sessions exist and
  no explicit `--resume`/prompt was given; `--plain` or piped input skips the
  overlay entirely (never blocks non-interactive use).

## Definition of done

- [ ] Overlay component covered by tests (render list, filter, select,
      dismiss) using the same real session shape session-persistence
      delivered (no speculative shape).
- [ ] Manual pty verification: start with 2+ prior sessions, select one,
      confirm it resumes with correct context.
- [ ] Non-interactive/`--plain` paths are unaffected (test or explicit
      assertion this overlay never triggers there).
- [ ] `pnpm --dir packages/terminal-ui test` / `lint:kondo` green;
      `pnpm -C packages/eta-mu test` / `test:e2e` / `lint:kondo` green.

## Verification

```bash
pnpm --dir packages/terminal-ui test
pnpm --dir packages/terminal-ui lint:kondo
pnpm -C packages/eta-mu test
pnpm -C packages/eta-mu test:e2e
pnpm -C packages/eta-mu lint:kondo
```
