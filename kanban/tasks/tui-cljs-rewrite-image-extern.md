---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "tui"]
write-id: "1783693463232-0.6aj8d63405alta1i9x1"
points: "2"
source: "kanban/epics/tui-cljs-rewrite.md"
title: "TUI CLJS Rewrite — Terminal Image Extern"
priority: "P1"
status: "rejected"
uuid: "tui-cljs-rewrite-image-extern"
created_at: "2026-06-15T00:00:00Z"
---

# TUI CLJS Rewrite — Terminal Image Extern

> Parent epic: `kanban/epics/tui-cljs-rewrite.md`
> Points: 2

## Purpose

Create the raw JS interop layer for terminal image protocols (Kitty, iTerm2), image dimension detection, and capability caching.

## Scope

- Port `terminal-image.ts` to `eta_mu.tui.extern.image.*`.
- Preserve Kitty image ID allocation, iTerm2/Kitty encoding, GIF/JPEG/PNG/WebP dimension parsing.
- Preserve capability detection and caching behavior.

## Deliverables

- [ ] `extern.image` namespace exposing encode, render, dimension, and capability functions.
- [ ] Regression tests for image encoding strings and dimension parsing.
- [ ] Malli schemas for image options and terminal capabilities.

## Verification gate

- [ ] New CLJS image extern tests pass.
- [ ] Existing TS `terminal-image.test.ts` still passes.

```bash
pnpm --dir packages/eta-mu-tui cljs:test
pnpm --filter @open-hax/eta-mu-tui test
```

---
Blocked by `eta-mu-cljs-rewrite-boundary-adapters` (core program): image extern adapters need the established `extern.*` boundary pattern and conversion-test conventions. Terminal capability conventions from `tui-cljs-rewrite-terminal-extern` should also be stable first.

Triage 2026-07-10: superseded by terminal-ui-cljs-package (2026-07-09 decision to build packages/terminal-ui); this epic's scope maps 1:1 onto that card's open work items. Closed as superseded, not abandoned.
---