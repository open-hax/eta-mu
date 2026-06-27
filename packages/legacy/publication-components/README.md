# @open-hax/garden-publication-components

> **LEGACY — DEPRECATED (TypeScript).** This package is part of the legacy TS surface
> being replaced by the ClojureScript-first stack. Do not build new features here.
> The CLJS rewrite plan and source-by-source namespace map live in
> [`docs/publication-components-cljs-rewrite-inventory.md`](../../../docs/publication-components-cljs-rewrite-inventory.md)
> (target namespaces under `eta_mu.garden.*`). Prefer that path for new work.

React publication component library for "Garden" pages: renders publication block
documents (hero, heading, rich text, CTA, divider, track, playlist) and music/playlist
players, with paired server-render and browser-hydration entrypoints.

## Public surface

Three export entrypoints (see `package.json` `exports`):

### `.` (main, `src/index.ts`)

Components:
- `PublicationBlocksRenderer` — renders an array of `PublicationBlock`s
- `extractPublicationBlocks` — pulls/normalizes blocks from a document
- `MusicPlayerView`
- `AudioSpectrumVisualizer`, `PlaybackProgress` (audio playback widgets)
- `PlaylistQueueList`
- `StudioPlaylistPlayer`

Types: `PublicationBlock` and its variants (`CtaBlock`, `DividerBlock`, `HeadingBlock`,
`HeroBlock`, `PlaylistBlock`, `PlaylistTrackRef`, `RichTextBlock`, `TrackBlock`),
plus `MusicPlayerPermissions` and `StudioTrack`.

### `./server` (`src/server.tsx`)

Server-side rendering helpers (no DOM):
- `renderPublicationBlocksHtml(props)` — `renderToString` of `PublicationBlocksRenderer`
  (`maxInitialPlaylistTracks` default `100`, `audioUrlBase` default `/api/studio/stream`)
- `serializeGardenPublicationProps(props)` — JSON-serializes render props with `<`, `>`, `&`
  escaped for safe embedding in an inline `<script>` tag
- type `GardenPublicationRenderProps`

### `./browser-app` (`dist/browser/garden-publication-app.js`, built from `src/browser.tsx`)

A bundled, self-booting browser entry (Vite library build, ES format). On load it finds
`<script data-garden-publication-props>` tags, reads the JSON payload serialized by
`serializeGardenPublicationProps`, and hydrates the matching `data-garden-publication-root`
element with `react-dom/client` `hydrateRoot`. Imports `@open-hax/uxx/css`.

## SSR / hydration flow

1. Server: call `renderPublicationBlocksHtml(props)` for the HTML and
   `serializeGardenPublicationProps(props)` for an escaped JSON payload; emit the payload in
   an inline `<script data-garden-publication-props data-garden-publication-root="…">`.
2. Browser: load `garden-publication-app.js`; it auto-hydrates each rooted element from its
   payload. Audio URLs are resolved via `audioUrlForPath(path, audioUrlBase)`.

## Build & test

This is a pnpm workspace package. Run from the repo root or with `-C`:

```bash
pnpm -C orgs/open-hax/eta-mu/packages/legacy/publication-components run build
pnpm -C orgs/open-hax/eta-mu/packages/legacy/publication-components run typecheck
pnpm -C orgs/open-hax/eta-mu/packages/legacy/publication-components run clean
```

| Script | Command | Purpose |
|--------|---------|---------|
| `build` | `tsc -p tsconfig.json && vite build --config vite.browser.config.ts` | Emit `dist/` (`.` + `./server`), then the `./browser-app` bundle to `dist/browser/` |
| `typecheck` | `tsc --noEmit -p tsconfig.json` | Type-check only |
| `clean` | `rm -rf dist` | Remove build output |

There is **no** `test` script in this package.

## Dependencies

Runtime: `react`/`react-dom` ^18.3, `react-markdown` ^10, `audiomotion-analyzer` ^4.5
(audio spectrum), and `@open-hax/uxx` 0.2.0 (styling/CSS). License: `LGPL-3.0-or-later`.
