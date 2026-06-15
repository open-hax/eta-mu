---
uuid: "tui-cljs-rewrite-markdown-overlays"
title: "TUI CLJS Rewrite — Markdown, Select, and Overlay Components"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "tui"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/tui-cljs-rewrite.md"
points: 5
category: "tasks"
---

# TUI CLJS Rewrite — Markdown, Select, and Overlay Components

> Parent epic: `kanban/epics/tui-cljs-rewrite.md`
> Points: 5

## Purpose

Port markdown rendering, list overlays, settings lists, loaders, and image components to CLJS.

## Scope

- Port `components/markdown.ts` to `eta_mu.tui.web.components.markdown`.
- Port `components/select-list.ts` and `components/settings-list.ts`.
- Port `components/loader.ts` and `components/cancellable-loader.ts`.
- Port `components/image.ts` (using `extern.image`).
- Preserve overlay anchoring, non-capturing behavior, and style isolation.

## Deliverables

- [ ] Reagent components for markdown, select-list, settings-list, loader, cancellable-loader, and image.
- [ ] Regression tests for markdown ANSI output, select-list navigation, and overlay style boundaries.

## Verification gate

- [ ] CLJS tests for markdown and overlay components pass.
- [ ] No style leaks into adjacent components; overlay non-capturing behavior preserved.

```bash
pnpm --dir packages/eta-mu-tui cljs:test
pnpm --filter @open-hax/eta-mu-tui test
```

---
Blocked by `tui-cljs-rewrite-core-tui` and `tui-cljs-rewrite-image-extern` (within-epic): overlay components need core layout primitives and the image extern for image rendering.
---
