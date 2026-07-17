---
category: "tasks"
labels: ["tasks", "cljs", "terminal-ui", "tui", "2sp"]
write-id: "1784252440044-0.zvktoiulk6el1i1asec"
points: "2"
source: "kanban/tasks/terminal-ui-interactive-host.md"
title: "Terminal UI — Markdown Rendering of Assistant Output"
priority: "P1"
status: "done"
uuid: "terminal-ui-markdown-rendering"
created_at: "2026-07-16T00:00:00Z"
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

---
Implemented: domain.markdown (pure md->styled-lines: headers, bold/italic/inline-code, fences, bullets/numbered, blockquotes; 8 construct tests + combined case) + component.message assistant path + tui-emit rewritten to render the whole turn through the diff host (segment list: in-progress assistant markdown + interleaved tool results, re-rendered per delta without flicker). Pty-verified 2026-07-17 via script(1)+mock SSE: 'assistant # Summary' header+bullets+fence+quote final screen confirmed. Found+fixed a real extern bug en route: ProcessTerminal columns/rows passed 0 through when a pty reports 0 (word-per-row wrap fragmentation) — now guards non-positive, fallback 80x24, with test. Syntax highlighting inside fences skipped for v1 (noted on card). Gates: terminal-ui 62/160 + kondo 0/0, eta-mu 138/275 + kondo 0/0.
---