---
uuid: "tui-cljs-rewrite-image-extern"
title: "TUI CLJS Rewrite — Terminal Image Extern"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "tui"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/tui-cljs-rewrite.md"
points: 2
category: "tasks"
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
---
