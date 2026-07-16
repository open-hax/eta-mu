---
uuid: "terminal-ui-markdown-rendering"
title: "Terminal UI — Markdown Rendering of Assistant Output"
status: blocked
priority: "P1"
labels: ["tasks", "cljs", "terminal-ui", "tui", "2sp"]
created_at: "2026-07-16T00:00:00Z"
source: "kanban/tasks/terminal-ui-interactive-host.md"
points: 2
category: "tasks"
---
# Terminal UI — Markdown Rendering of Assistant Output

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Predecessor: `kanban/tasks/terminal-ui-interactive-host.md`
> Blocked on: `terminal-ui-differential-render-host` (streamed markdown needs
> to re-render incrementally through the diff host, not print-once)

## Purpose

Assistant messages currently render as plain wrapped text
(`component.message`). The stable CLI renders markdown (headers, code
blocks, lists, emphasis, inline code) with ANSI styling. Match that
experience — reference behavior only, not the legacy TS renderer's
implementation.

## Scope

- New `eta-mu.terminal-ui.domain.markdown` (or similar): pure
  markdown-text -> styled-line-vector transform (reuse `shape.ansi` for SGR
  codes and `shape.text-utils` for wrapping/width, same as `component.text`).
- Cover, at minimum: headers, bold/italic/inline-code, fenced code blocks
  (no syntax highlighting required for v1 — plain monospace block framing is
  fine, note the gap if skipped), bullet/numbered lists, blockquotes.
- Wire into `component.message`'s assistant-message path so both the
  differential-render host and (if practical) `--plain` benefit.
- Streamed text deltas: re-render the in-progress markdown block on each
  delta without flicker (depends on the diff host from
  `terminal-ui-differential-render-host`).

## Definition of done

- [ ] Unit tests for each covered markdown construct (happy path per
      construct + one nested/combined case).
- [ ] A visual/manual check (pty) that a real assistant response with
      headers/code/lists renders readably, recorded in a card comment.
- [ ] `pnpm --dir packages/terminal-ui test` / `lint:kondo` green;
      `pnpm -C packages/eta-mu test` / `test:e2e` / `lint:kondo` green.

## Verification

```bash
pnpm --dir packages/terminal-ui test
pnpm --dir packages/terminal-ui lint:kondo
pnpm -C packages/eta-mu test
pnpm -C packages/eta-mu lint:kondo
```
