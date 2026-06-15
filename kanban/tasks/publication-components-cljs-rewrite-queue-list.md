---
uuid: "publication-components-cljs-rewrite-queue-list"
title: "Publication Components CLJS Rewrite — PlaylistQueueList"
status: "blocked"
priority: P3
labels: ["tasks", "cljs", "rewrite", "publication-components"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/publication-components-cljs-rewrite.md"
points: 2
category: tasks
---

# Publication Components CLJS Rewrite — PlaylistQueueList

> Parent epic: `kanban/epics/publication-components-cljs-rewrite.md`
> Phase: 2
> Points: 2

## Purpose

Port `PlaylistQueueList.tsx` to a Reagent component that preserves track listing, selection, removal, and truncation behavior.

## Scope

- `PlaylistQueueList` component.
- Track title/duration/label rendering.
- `readOnly`, `selectedIndex`, `maxVisible`, `onSelect`, `onRemove` props.
- Empty-state message and "showing first N" truncation notice.

## Work items

- [ ] Create `eta_mu.garden.web.playlist_queue_list` with a Reagent component.
- [ ] Port track row rendering, selection styling, and removal button behavior.
- [ ] Preserve `maxVisible` truncation and hidden-count notice.
- [ ] Add tests for selection, removal, truncation, and empty state.

## Acceptance criteria

- [ ] `PlaylistQueueList` renders a list of tracks from CLJS data.
- [ ] Selection and removal callbacks fire with the correct track and index.
- [ ] `maxVisible` truncation matches legacy behavior.
- [ ] Component-level tests pass under the CLJS test target.

## Verification

```bash
pnpm --filter @open-hax/garden-publication-components test
pnpm --filter @open-hax/garden-publication-components typecheck
pnpm --filter @open-hax/garden-publication-components build
```

---

Blocked by `publication-components-cljs-rewrite-inventory` and `publication-components-cljs-rewrite-law-shape` (track schemas). Core runtime boundary conventions are already available.
