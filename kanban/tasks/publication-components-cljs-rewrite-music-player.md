---
uuid: "publication-components-cljs-rewrite-music-player"
title: "Publication Components CLJS Rewrite — MusicPlayerView"
status: "rejected"
priority: "P3"
labels: ["tasks", "cljs", "rewrite", "publication-components"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/publication-components-cljs-rewrite.md"
points: 3
category: "tasks"
---

# Publication Components CLJS Rewrite — MusicPlayerView

> Parent epic: `kanban/epics/publication-components-cljs-rewrite.md`
> Phase: 2
> Points: 3

## Purpose

Port `MusicPlayerView.tsx` to a Reagent component that preserves the player layout, permission-driven controls, and slot-based children pattern.

## Scope

- `MusicPlayerView` component.
- `StudioTrack` and `MusicPlayerPermissions` prop consumption.
- Control buttons (previous, play/pause, next, labels, volume, asset generation, remove).
- File icon default and slot props (`waveform`, `progress`, `heardDescription`, `currentLabels`, `agentActions`, `graphLabelControls`, `emptyState`).
- `@open-hax/uxx` `Button` and `tokens` integration via extern adapter.

## Work items

- [ ] Create `eta_mu.garden.web.music_player_view` with a Reagent component.
- [ ] Port permission resolution and conditional control rendering.
- [ ] Create `eta_mu.garden.extern.uxx` adapter for `Button` and `tokens` usage.
- [ ] Preserve slot props as Reagent children or hiccup fragments.
- [ ] Add tests for permission gates, empty state, and control callbacks.

## Acceptance criteria

- [ ] `MusicPlayerView` renders from CLJS data with all permission combinations.
- [ ] Callbacks fire correctly for previous/play-pause/next/volume/asset actions.
- [ ] Empty state and slot content render as in the legacy component.
- [ ] No raw `@open-hax/uxx` imports appear outside `extern.*` namespaces.

## Verification

```bash
pnpm --filter @open-hax/garden-publication-components test
pnpm --filter @open-hax/garden-publication-components typecheck
pnpm --filter @open-hax/garden-publication-components build
```

---
Blocked by `publication-components-cljs-rewrite-inventory` and `publication-components-cljs-rewrite-law-shape` (track/permission schemas). Core runtime boundary conventions are already available.
---
