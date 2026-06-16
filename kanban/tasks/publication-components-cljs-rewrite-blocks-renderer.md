---
uuid: "publication-components-cljs-rewrite-blocks-renderer"
title: "Publication Components CLJS Rewrite — PublicationBlocksRenderer"
status: "blocked"
priority: P3
labels: ["tasks", "cljs", "rewrite", "publication-components"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/publication-components-cljs-rewrite.md"
points: 5
category: tasks
---

# Publication Components CLJS Rewrite — PublicationBlocksRenderer

> Parent epic: `kanban/epics/publication-components-cljs-rewrite.md`
> Phase: 2
> Points: 5

## Purpose

Port `PublicationBlocksRenderer.tsx` to a Reagent component while preserving block rendering, layout CSS, and markdown handling.

## Scope

- `PublicationBlocksRenderer` component and block dispatch.
- Hero, heading, rich_text, callout, playlist, track, divider, and CTA block renderers.
- Inline CSS currently embedded in the TSX component.
- `TrackCard` subcomponent.
- Integration with `StudioPlaylistPlayer` for playlist blocks.
- ReactMarkdown replacement via CLJS markdown interop or equivalent extern adapter.

## Work items

- [ ] Create `eta_mu.garden.web.publication_blocks_renderer` with a Reagent block dispatch component.
- [ ] Port all block-type renderers to Reagent with Tailwind/inline style parity.
- [ ] Extract CSS into a CLJS-side style map or Tailwind classes; keep DOM output identical.
- [ ] Create `eta_mu.garden.extern.markdown` adapter for markdown rendering interop.
- [ ] Wire `PlaylistPublicationView` to the CLJS `StudioPlaylistPlayer`.
- [ ] Add component-level tests for each block type and hidden-block filtering.

## Acceptance criteria

- [ ] `PublicationBlocksRenderer` renders all block types from CLJS data.
- [ ] HTML output matches legacy server-side render for representative payloads.
- [ ] Markdown blocks render without raw ReactMarkdown leakage into non-extern code.
- [ ] Component-level tests pass under the CLJS test target.

## Verification

```bash
pnpm --filter @open-hax/garden-publication-components test
pnpm --filter @open-hax/garden-publication-components typecheck
pnpm --filter @open-hax/garden-publication-components build
```

---

Blocked by `publication-components-cljs-rewrite-inventory`, `publication-components-cljs-rewrite-law-shape` (block schemas/normalization), and `publication-components-cljs-rewrite-audio-player` (`StudioPlaylistPlayer` integration). Core runtime web boundary patterns are established enough to proceed once internal blockers clear.
