---
uuid: "publication-components-cljs-rewrite"
title: "Publication Components CLJS Rewrite"
status: "rejected"
priority: "P3"
labels: ["epics", "cljs", "rewrite", "legacy-ts", "publication-components", "react"]
created_at: "2026-06-15T00:00:00Z"
source: "user-request:2026-06-15"
points: 5
category: "epics"
---

# Publication Components CLJS Rewrite

> Package: `packages/legacy/publication-components` (`@open-hax/garden-publication-components`)
> Current size: ~1,117 TS lines across 11 files
> Scope: React publication UI components (browser, server, blocks, players)

## Purpose

Rewrite the `@open-hax/garden-publication-components` package into ClojureScript/Reagent while preserving the React component API. This epic tests the web/UI boundary of the CLJS rewrite and validates that Reagent components can satisfy existing TS consumers via stable JS facade exports.

## Public compatibility surfaces

- Package exports: `src/index.ts`
- Browser entry: `src/browser.tsx`
- Server entry: `src/server.tsx`
- Components: `src/PublicationBlocksRenderer.tsx`, `src/MusicPlayerView.tsx`, `src/StudioPlaylistPlayer.tsx`, `src/PlaylistQueueList.tsx`, `src/AudioPlaybackWidgets.tsx`
- Vite config: `vite.browser.config.ts`

## Target namespace map

```text
eta_mu.garden.domain.*    component state decisions
eta_mu.garden.shape.*     props↔CLJS data transforms
eta_mu.garden.law.*       Malli schemas for component props
eta_mu.garden.extern.*    React/DOM interop, audio APIs, raw JS interop
eta_mu.garden.web.*       Reagent components and browser/server entrypoints
eta_mu.garden.cli.*       build/export facade
```

## Non-goals

- Do not redesign the component API.
- Do not migrate off Vite unless needed.

## Phases

### Phase 1 — Inventory

- Catalog components and classify into domain/shape/law/extern/web.
- Identify consumers and build targets.

### Phase 2 — Reagent components

- Port components to Reagent with Malli prop schemas.
- Keep extern React interop isolated.

### Phase 3 — Build and facade

- Update Vite/shadow-cljs build to emit stable JS exports.
- Keep `src/index.ts` as a thin re-export if needed.

### Phase 4 — Verification

- Verify browser and server bundles build.
- Add component-level tests where absent.

## Acceptance criteria

- [ ] Component inventory and consumer map documented.
- [ ] Components render from CLJS/Reagent.
- [ ] Build outputs preserve public API.
- [ ] `pnpm --filter @open-hax/garden-publication-components build` passes.

## Verification gates

```bash
pnpm --filter @open-hax/garden-publication-components build
pnpm --filter @open-hax/garden-publication-components typecheck
node scripts/ts-line-count.mjs packages/legacy/publication-components
```

## Dependencies

- `eta-mu-cljs-runtime-rewrite` (web boundary patterns)

---
## Scheduling review (2026-06-15)

- 1 task ready for breakdown: `publication-components-cljs-rewrite-inventory`.
- 7 tasks blocked: law-shape awaits inventory; component tasks await law-shape; blocks-renderer also depends on audio-player/studio-playlist; build-facade awaits component ports; verification awaits everything.
- Current bottleneck: inventory acceptance (consumer/build-target map).
- Concurrency: after law-shape, MusicPlayerView, PlaylistQueueList, and audio widgets can proceed in parallel; PublicationBlocksRenderer follows audio widgets.
---

## Inventory review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `publication-components-cljs-rewrite-inventory` accepted; inventory doc `docs/publication-components-cljs-rewrite-inventory.md` produced.

**Key findings from the inventory:**
- `packages/legacy/publication-components` is 10 source files (~1,081 TS lines).
- Public surface: `PublicationBlocksRenderer`, `MusicPlayerView`, `StudioPlaylistPlayer`, `PlaylistQueueList`, `AudioPlaybackWidgets`, plus browser/server entrypoints.
- Raw JS interop is concentrated in:
  - React hooks and DOM refs (`web` + `extern.react`)
  - Web Audio API (`AudioContext`, `AnalyserNode`, `MediaElementAudioSourceNode`) → `eta_mu.garden.extern.audio`
  - `audiomotion-analyzer` npm package → `eta_mu.garden.extern.audio`
  - `react-markdown` (in `PublicationBlocksRenderer`) → `eta_mu.garden.extern.markdown`
- Build targets: `dist/index.js`, `dist/server.js`, `dist/browser/garden-publication-app.js`; Vite config must be updated or replaced with shadow-cljs.
- Depends on `@open-hax/uxx` tokens and CSS variables; these are design-system consumers, not blockers.
- No consumers inside `packages/legacy` other than the package itself; low compatibility risk.

**Updated scheduling after inventory:**
- Inventory → `review` (done).
- `publication-components-cljs-rewrite-law-shape` can move to `ready` immediately.
- Component port tasks remain `blocked` until law-shape is accepted.

**Recommended next action:** Accept inventory and move `publication-components-cljs-rewrite-law-shape` to `ready`; define Malli schemas for publication blocks, tracks, player props, and permissions.

---
## Law-shape review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `publication-components-cljs-rewrite-law-shape` accepted and promoted to `done`.

**Delivered:**
- `packages/runtime/src/cljs/eta_mu/garden/law/publication.cljs` — Malli schemas for `StudioTrack`, `MusicPlayerPermissions`, `PlaylistTrackRef`, `PublicationBlock` union, and `PublicationBlocksRenderer` props.
- `packages/runtime/src/cljs/eta_mu/garden/shape/track.cljs` — track record constructors and JS decoders.
- `packages/runtime/src/cljs/eta_mu/garden/shape/block.cljs` — `extract-publication-blocks`, `normalize-block`, `normalize-track`.
- `packages/runtime/src/cljs/eta_mu/garden/extern/js.cljs` — minimal JS interop helpers.
- `packages/runtime/test/cljs/eta_mu/garden/publication_law_test.cljs` — schema and shape round-trip tests.

**Verification:**
- `pnpm --dir packages/runtime cljs:verify` passed.
- `pnpm test` passed.

**Updated scheduling after law-shape:**
- Law-shape → `done`.
- Component port tasks (`music-player`, `playlist-queue-list`, `audio-player`, `blocks-renderer`) are now unblocked.
- The first component task should also establish shared `eta_mu.garden.extern.react` and `eta_mu.garden.extern.uxx` adapters for the others to reuse.

**Recommended next action:** Move `publication-components-cljs-rewrite-music-player` to `ready` and port it, creating the shared React/UXX extern adapters in the process.
---
