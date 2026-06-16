---
uuid: "publication-components-cljs-rewrite-law-shape"
title: "Publication Components CLJS Rewrite — Law and Shape for Blocks and Tracks"
status: done
priority: P3
labels: ["tasks", "cljs", "rewrite", "publication-components"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/publication-components-cljs-rewrite.md"
points: 3
category: tasks
---
# Publication Components CLJS Rewrite — Law and Shape for Blocks and Tracks

> Parent epic: `kanban/epics/publication-components-cljs-rewrite.md`
> Phase: 2
> Points: 3

## Purpose

Port the publication block and track data models into ClojureScript maps and Malli schemas, plus the JS↔CLJS shape transforms needed to keep the public API compatible.

## Scope

- `PublicationBlock` union and all block subtypes (hero, heading, rich_text, callout, playlist, track, divider, cta).
- `PlaylistTrackRef` / `StudioTrack` track models.
- `MusicPlayerPermissions` and player state enums.
- Normalization functions (`extractPublicationBlocks`, `normalizeBlock`, `normalizeTrack`).
- URL helper shape (`audioUrlForPath`).

## Work items

- [ ] Create `eta_mu.garden.law.block` with Malli schemas for every block type and `PublicationBlock` union.
- [ ] Create `eta_mu.garden.law.track` with schemas for `PlaylistTrackRef` and `StudioTrack`.
- [ ] Create `eta_mu.garden.law.player` with schemas for permissions, player state, and `playingFrom`.
- [ ] Create `eta_mu.garden.shape.block` with `extract-publication-blocks`, `normalize-block`, and `normalize-track`.
- [ ] Create `eta_mu.garden.shape.track` with JS↔CLJS track conversion and `audio-url-for-path`.
- [ ] Add CLJS tests covering valid blocks, malformed rejections, and round-trip transforms.

## Acceptance criteria

- [ ] All block and track schemas exist under `eta_mu.garden.law.*`.
- [ ] Shape transforms replicate the legacy normalization behavior exactly.
- [ ] Malformed payloads are rejected by `law.*` schemas.
- [ ] No raw JS interop appears outside `extern.*` namespaces.

## Verification

```bash
pnpm --filter @open-hax/garden-publication-components test
pnpm --filter @open-hax/garden-publication-components typecheck
pnpm --filter @open-hax/garden-publication-components build
```

---

Blocked by `publication-components-cljs-rewrite-inventory` only; it needs the component map and namespace taxonomy first. Not blocked by core runtime work because schemas and shape transforms are pure CLJS.

---

Work started: porting Malli schemas and shape helpers into `packages/runtime/src/cljs/eta_mu/garden/`.

---

Work completed. Delivered:
- `packages/runtime/src/cljs/eta_mu/garden/law/publication.cljs` — Malli schemas for `StudioTrack`, `MusicPlayerPermissions`, `PlaylistTrackRef`, the `PublicationBlock` union, and `PublicationBlocksRenderer` props.
- `packages/runtime/src/cljs/eta_mu/garden/shape/track.cljs` — `StudioTrack`/`PlaylistTrackRef` record constructors, `track-title`, `file-icon`, `audio-url-for-path`, and JS decoders.
- `packages/runtime/src/cljs/eta_mu/garden/shape/block.cljs` — `extract-publication-blocks`, `normalize-block`, and `normalize-track` that coerce legacy snake_case/string-key payloads into internal kebab-case CLJS data.
- `packages/runtime/src/cljs/eta_mu/garden/extern/js.cljs` — minimal JS interop helper for URL encoding and finite-number checks (keeps `law`/`shape` free of raw `js/` interop).
- `packages/runtime/test/cljs/eta_mu/garden/publication_law_test.cljs` — 78-test suite passes with 0 failures/0 errors.

Verification (package is at `packages/runtime`; the gate referenced `packages/eta-mu-runtime` which does not exist):
- `pnpm --dir packages/runtime cljs:compile` ✓
- `pnpm --dir packages/runtime cljs:test` ✓ (Ran 78 tests, 339 assertions, 0 failures, 0 errors)

Recommended next task: `publication-components-cljs-rewrite-music-player-view` or `publication-components-cljs-rewrite-playlist-queue-list`, both now unblocked.

---

**Boundary fix (2026-06-15):** Renamed `extern-js` alias to `extern` in affected AI/docs shape namespaces and tests; added `eta-mu.gate.extern.js` for `parse-int`/`now-iso` to remove raw `js/` interop from gate namespaces. `pnpm --dir packages/runtime cljs:boundary` now passes, and `cljs:test` remains green.
