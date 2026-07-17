# Publication Components CLJS Rewrite — Source Inventory and Namespace Map

> Package: `packages/legacy/publication-components` (`@open-hax/garden-publication-components`)  
> Parent epic: `kanban/epics/publication-components-cljs-rewrite.md`  
> Source stats: 1,081 TypeScript lines across 10 source files (9 `.ts/.tsx` plus 1 `.d.ts` declaration).  
> Inventory date: 2026-06-15

## 1. Taxonomy

Target namespaces follow the epic taxonomy under `eta_mu.garden.*`:

| Layer | Responsibility | Example target namespace |
|-------|----------------|--------------------------|
| `domain` | Component state decisions, player logic, block normalization | `eta_mu.garden.domain.player` |
| `shape` | Props ↔ CLJS data transforms, coercion, view-model helpers | `eta_mu.garden.shape.track` |
| `law` | Malli schemas for component props, block shapes, enums | `eta_mu.garden.law.publication` |
| `extern` | Raw JS interop: React/DOM, audio APIs, `audiomotion-analyzer` | `eta_mu.garden.extern.audio` |
| `web` | Reagent components, browser/server entrypoints, hydration | `eta_mu.garden.web.publication` |
| `cli` | Build/export facade, Vite/shadow-cljs wiring | `eta_mu.garden.cli.build` |

## 2. File-by-file inventory

### 2.1 `src/url.ts` (3 lines)

| Attribute | Value |
|-----------|-------|
| Proposed namespace | `eta_mu.garden.shape.url` |
| Public exports | `audioUrlForPath(path: string, audioUrlBase?: string): string` |
| Consumers inside `packages/legacy` | `browser.tsx`, `server.tsx` |
| Raw JS interop | `encodeURIComponent` (global) |
| Component props | None — pure helper |
| Build targets | `dist/index.js`, `dist/server.js` |
| Runtime/boundary deps | None |

### 2.2 `src/declarations.d.ts` (4 lines)

| Attribute | Value |
|-----------|-------|
| Proposed namespace | None — migrate to `eta_mu.garden.extern.audio` extern type helper |
| Public exports | `AudioMotionAnalyzer` constructor type (ambient) |
| Consumers inside `packages/legacy` | `AudioPlaybackWidgets.tsx` |
| Raw JS interop | `audiomotion-analyzer` package type stub |
| Component props | N/A |
| Build targets | None (types only) |
| Runtime/boundary deps | None |

### 2.3 `src/AudioPlaybackWidgets.tsx` (132 lines)

| Attribute | Value |
|-----------|-------|
| Proposed namespaces | `eta_mu.garden.web.audio.audio-spectrum-visualizer`, `eta_mu.garden.web.audio.playback-progress`, `eta_mu.garden.shape.duration`, `eta_mu.garden.extern.audio` |
| Public exports | `AudioSpectrumVisualizer`, `PlaybackProgress` |
| Consumers inside `packages/legacy` | `StudioPlaylistPlayer.tsx`, re-exported by `index.ts` |
| Raw JS interop | `useRef`, `useEffect`, `useState`, `useCallback` (React); `HTMLDivElement`, `HTMLAudioElement`, `HTMLInputElement`, `performance.now()` (DOM); `AudioMotionAnalyzer` constructor; `analyserRef: React.RefObject<AnalyserNode \| null>`; audio events: `timeupdate`, `seeking`, `seeked` |
| Component props | `AudioSpectrumVisualizer`: `{ analyserRef: React.RefObject<AnalyserNode \| null>; isPlaying: boolean }`  <br> `PlaybackProgress`: `{ audioRef: React.RefObject<HTMLAudioElement \| null>; duration: number; initialTime?: number; onPersistTime?: (time: number) => void }` |
| Build targets | `dist/index.js` |
| Runtime/boundary deps | `@open-hax/uxx` tokens (`tokens.fontSize.xs`); `--token-colors-*` CSS variables |

### 2.4 `src/MusicPlayerView.tsx` (216 lines)

| Attribute | Value |
|-----------|-------|
| Proposed namespaces | `eta_mu.garden.web.music-player-view`, `eta_mu.garden.law.music-player`, `eta_mu.garden.shape.track` |
| Public exports | `MusicPlayerView`, `StudioTrack`, `MusicPlayerPermissions` |
| Consumers inside `packages/legacy` | `StudioPlaylistPlayer.tsx`, re-exported by `index.ts` |
| Raw JS interop | React `ReactNode` slot type; native `<button>`, `<input type="range">`; CSS variables |
| Component props | `MusicPlayerViewProps`: `title?`, `description?`, `track: StudioTrack \| null`, `trackCount?`, `playerState?`, `playingFrom?`, `permissions?`, `volume?`, `fileIcon?`, callbacks (`onPrevious`, `onTogglePlayPause`, `onNext`, `onEditLabels`, `onVolumeChange`, `onGenerateSpectrogram`, `onGenerateWaveform`, `onRemoveFromQueue`), and slots (`waveform`, `progress`, `heardDescription`, `currentLabels`, `agentActions`, `graphLabelControls`, `emptyState`) |
| Build targets | `dist/index.js` |
| Runtime/boundary deps | `@open-hax/uxx` (`Button`, `tokens`); `--token-colors-*` CSS variables |

### 2.5 `src/PlaylistQueueList.tsx` (95 lines)

| Attribute | Value |
|-----------|-------|
| Proposed namespaces | `eta_mu.garden.web.playlist-queue-list`, `eta_mu.garden.shape.duration`, `eta_mu.garden.law.queue` |
| Public exports | `PlaylistQueueList` |
| Consumers inside `packages/legacy` | `StudioPlaylistPlayer.tsx`, re-exported by `index.ts` |
| Raw JS interop | Native `<button>`; CSS variables; scroll container styling |
| Component props | `PlaylistQueueListProps`: `items: StudioTrack[]`, `selectedIndex?`, `readOnly?`, `showLabels?`, `showDuration?`, `maxVisible?`, `onSelect?`, `onRemove?` |
| Build targets | `dist/index.js` |
| Runtime/boundary deps | `@open-hax/uxx` (`tokens`); `--token-colors-*` CSS variables |

### 2.6 `src/StudioPlaylistPlayer.tsx` (190 lines)

| Attribute | Value |
|-----------|-------|
| Proposed namespaces | `eta_mu.garden.web.studio-playlist-player`, `eta_mu.garden.domain.player`, `eta_mu.garden.extern.audio` |
| Public exports | `StudioPlaylistPlayer` |
| Consumers inside `packages/legacy` | `PublicationBlocksRenderer.tsx`, re-exported by `index.ts` |
| Raw JS interop | React hooks (`useState`, `useRef`, `useEffect`, `useCallback`); `HTMLAudioElement`; `AudioContext` / `webkitAudioContext`; `AnalyserNode`; `MediaElementAudioSourceNode`; audio events (`loadedmetadata`, `ended`, `volumechange`, `pause`, `play`) |
| Component props | `StudioPlaylistPlayerProps`: `title?`, `description?`, `tracks: StudioTrack[]`, `getAudioUrl?`, `maxVisible?`, `showLabels?`, `showDescription?`, `showDuration?` |
| Build targets | `dist/index.js` |
| Runtime/boundary deps | `@open-hax/uxx` tokens (via `MusicPlayerView`); depends on `MusicPlayerView`, `PlaylistQueueList`, `AudioSpectrumVisualizer`, `PlaybackProgress` |

### 2.7 `src/PublicationBlocksRenderer.tsx` (346 lines)

| Attribute | Value |
|-----------|-------|
| Proposed namespaces | `eta_mu.garden.web.publication-blocks-renderer`, `eta_mu.garden.domain.block`, `eta_mu.garden.shape.block`, `eta_mu.garden.law.publication` |
| Public exports | `PublicationBlocksRenderer`, `extractPublicationBlocks`, and block types: `PlaylistTrackRef`, `HeroBlock`, `HeadingBlock`, `RichTextBlock`, `CalloutBlock`, `PlaylistBlock`, `TrackBlock`, `DividerBlock`, `CtaBlock`, `PublicationBlock` |
| Consumers inside `packages/legacy` | `browser.tsx`, `server.tsx`, re-exported by `index.ts` |
| Raw JS interop | `react-markdown` (React component); native `<section>`, `<h1>`–`<h4>`, `<p>`, `<aside>`, `<hr>`, `<a>`, `<audio>`; `<style>` injection with global CSS |
| Component props | `PublicationBlocksRendererProps`: `blocks: PublicationBlock[]`, `getAudioUrl?: (path: string) => string`, `maxInitialPlaylistTracks?: number` |
| Build targets | `dist/index.js`, `dist/server.js` |
| Runtime/boundary deps | `react-markdown`; `StudioPlaylistPlayer`; `--token-colors-*` CSS variables |

### 2.8 `src/server.tsx` (30 lines)

| Attribute | Value |
|-----------|-------|
| Proposed namespace | `eta_mu.garden.web.server` |
| Public exports | `GardenPublicationRenderProps`, `renderPublicationBlocksHtml`, `serializeGardenPublicationProps` |
| Consumers inside `packages/legacy` | None inside `packages/legacy`; consumed by external server renderers |
| Raw JS interop | `react-dom/server` `renderToString`; JSON serialization with HTML-escape replacements |
| Component props | `GardenPublicationRenderProps`: `blocks`, `maxInitialPlaylistTracks?`, `audioUrlBase?` |
| Build targets | `dist/server.js` |
| Runtime/boundary deps | `PublicationBlocksRenderer`, `audioUrlForPath` |

### 2.9 `src/browser.tsx` (48 lines)

| Attribute | Value |
|-----------|-------|
| Proposed namespace | `eta_mu.garden.web.browser` |
| Public exports | None (side-effect boot entry); implicit global `GardenPublicationApp` via Vite lib name |
| Consumers inside `packages/legacy` | None; bundled by Vite as browser app |
| Raw JS interop | `react-dom/client` `hydrateRoot`; `document.querySelectorAll`, `document.getElementById`, `document.readyState`, `DOMContentLoaded`; `HTMLScriptElement`, `dataset`, `JSON.parse`; `@open-hax/uxx/css` import |
| Component props | Reads `RootPayload` from `script[data-garden-publication-props]` JSON |
| Build targets | `dist/browser/garden-publication-app.js` |
| Runtime/boundary deps | `PublicationBlocksRenderer`, `audioUrlForPath`, `@open-hax/uxx/css` |

### 2.10 `src/index.ts` (17 lines)

| Attribute | Value |
|-----------|-------|
| Proposed namespace | `eta_mu.garden.cli.index` / thin CLJS facade re-export |
| Public exports | Types: `CtaBlock`, `DividerBlock`, `HeadingBlock`, `HeroBlock`, `PlaylistBlock`, `PlaylistTrackRef`, `PublicationBlock`, `RichTextBlock`, `TrackBlock`; values: `PublicationBlocksRenderer`, `extractPublicationBlocks`, `MusicPlayerView`, `AudioSpectrumVisualizer`, `PlaybackProgress`, `PlaylistQueueList`, `StudioPlaylistPlayer`; types: `MusicPlayerPermissions`, `StudioTrack` |
| Consumers inside `packages/legacy` | None inside `packages/legacy` (package entry point) |
| Raw JS interop | None directly — pure re-export |
| Component props | N/A |
| Build targets | `dist/index.js`, `dist/index.d.ts` |
| Runtime/boundary deps | Aggregates all component namespaces |

### 2.11 `vite.browser.config.ts` (25 lines)

| Attribute | Value |
|-----------|-------|
| Proposed namespace | `eta_mu.garden.cli.build` (config logic) |
| Public exports | Default Vite config object |
| Consumers inside `packages/legacy` | `package.json` `build` script |
| Raw JS interop | Vite `defineConfig`, `@vitejs/plugin-react` |
| Component props | N/A |
| Build targets | `dist/browser/garden-publication-app.js`, `dist/browser/garden-publication-app.css` |
| Runtime/boundary deps | `src/browser.tsx`; `react`, `react-dom` peer resolution via Vite |

## 3. Public API surface from package entry points

| Entry point | File | Current public surface | Proposed CLJS target |
|-------------|------|------------------------|----------------------|
| `.` | `src/index.ts` | All components and block types | `eta_mu.garden.cli.index` re-export facade |
| `./server` | `src/server.tsx` | `renderPublicationBlocksHtml`, `serializeGardenPublicationProps`, `GardenPublicationRenderProps` | `eta_mu.garden.web.server` |
| `./browser-app` | `src/browser.tsx` | Side-effect hydration bundle | `eta_mu.garden.web.browser` bundled by shadow-cljs/Vite |

## 4. Consumer map inside `packages/legacy`

No other `packages/legacy/*` package imports `@open-hax/garden-publication-components` directly. Internal import graph is:

```
index.ts
├── PublicationBlocksRenderer.tsx
│   └── StudioPlaylistPlayer.tsx
│       ├── MusicPlayerView.tsx
│       ├── PlaylistQueueList.tsx
│       └── AudioPlaybackWidgets.tsx
├── MusicPlayerView.tsx
├── AudioPlaybackWidgets.tsx
├── PlaylistQueueList.tsx
└── StudioPlaylistPlayer.tsx

browser.tsx ──> PublicationBlocksRenderer.tsx, url.ts
server.tsx  ──> PublicationBlocksRenderer.tsx, url.ts
```

External consumers are expected to use:

- `renderPublicationBlocksHtml` / `serializeGardenPublicationProps` from server bundles.
- The browser bundle via `<script src="…/garden-publication-app.js">` plus `data-garden-publication-props` scripts.

## 5. Raw JS interop surfaces

| Domain | API | Files | Proposed extern namespace |
|--------|-----|-------|---------------------------|
| React | `useState`, `useRef`, `useEffect`, `useCallback`, `ReactNode`, `RefObject` | All `.tsx` files | `eta_mu.garden.extern.react` |
| React DOM client | `hydrateRoot` | `browser.tsx` | `eta_mu.garden.extern.react-dom` |
| React DOM server | `renderToString` | `server.tsx` | `eta_mu.garden.extern.react-dom-server` |
| DOM | `document.querySelectorAll`, `getElementById`, `DOMContentLoaded`, `dataset`, `HTMLScriptElement`, `HTMLDivElement`, `HTMLAudioElement`, `HTMLInputElement` | `browser.tsx`, components | `eta_mu.garden.extern.dom` |
| Web Audio | `AudioContext`, `webkitAudioContext`, `AnalyserNode`, `MediaElementAudioSourceNode`, `createAnalyser`, `createMediaElementSource`, `connect`, `disconnect`, `resume`, `close`, `state`, `fftSize` | `StudioPlaylistPlayer.tsx`, `AudioPlaybackWidgets.tsx` | `eta_mu.garden.extern.audio` |
| HTML5 Audio | `<audio>` element, `src`, `load`, `play()`, `pause()`, `currentTime`, `duration`, `volume`, events: `loadedmetadata`, `ended`, `volumechange`, `pause`, `play`, `timeupdate`, `seeking`, `seeked` | `StudioPlaylistPlayer.tsx`, `AudioPlaybackWidgets.tsx`, `PublicationBlocksRenderer.tsx` | `eta_mu.garden.extern.audio` |
| Audio visualization | `AudioMotionAnalyzer` from `audiomotion-analyzer` | `AudioPlaybackWidgets.tsx` | `eta_mu.garden.extern.audiomotion` |
| Markdown | `ReactMarkdown` from `react-markdown` | `PublicationBlocksRenderer.tsx` | `eta_mu.garden.extern.markdown` |
| Styling | `@open-hax/uxx/css`, `@open-hax/uxx` tokens (`tokens.fontSize.*`, `Button`), CSS custom properties `--token-colors-*` | All visual components | `eta_mu.garden.extern.uxx` |
| URL encoding | `encodeURIComponent` | `url.ts` | `eta_mu.garden.extern.js` |
| Performance | `performance.now()` | `AudioPlaybackWidgets.tsx` | `eta_mu.garden.extern.dom` |

## 6. Component props summary

| Component | Key props | Notes |
|-----------|-----------|-------|
| `PublicationBlocksRenderer` | `blocks`, `getAudioUrl?`, `maxInitialPlaylistTracks?` | Discriminated union block renderer |
| `StudioPlaylistPlayer` | `tracks`, `getAudioUrl?`, `title?`, `description?`, `maxVisible?`, `showLabels?`, `showDescription?`, `showDuration?` | Stateful; owns `<audio>` and AudioContext |
| `MusicPlayerView` | `track`, `playerState?`, `permissions?`, `volume?`, slots (`waveform`, `progress`, etc.) | Presentational; many render props |
| `PlaylistQueueList` | `items`, `selectedIndex?`, `readOnly?`, `showLabels?`, `showDuration?`, `maxVisible?`, `onSelect?`, `onRemove?` | Presentational list |
| `AudioSpectrumVisualizer` | `analyserRef`, `isPlaying` | Effect-driven `AudioMotionAnalyzer` |
| `PlaybackProgress` | `audioRef`, `duration`, `initialTime?`, `onPersistTime?` | Effect-driven progress bar |

## 7. Build targets

| Output path | Source | Builder | Notes |
|-------------|--------|---------|-------|
| `dist/index.js` + `dist/index.d.ts` | `src/index.ts` | `tsc` | NPM main entry |
| `dist/server.js` + `dist/server.d.ts` | `src/server.tsx` | `tsc` | Conditional `./server` export |
| `dist/browser/garden-publication-app.js` + `.css` | `src/browser.tsx` | Vite (`vite.browser.config.ts`) | Conditional `./browser-app` export; UMD-like global `GardenPublicationApp` |

## 8. Dependencies on runtime core / boundary adapters

| Dependency | Type | Notes |
|------------|------|-------|
| `react` / `react-dom` | Peer-style direct dependency | Required by all components; will remain JS externs in CLJS |
| `@open-hax/uxx` | Direct dependency | UI tokens and `Button`; styling boundary. Keep as extern or wrap in `eta_mu.garden.extern.uxx` |
| `react-markdown` | Direct dependency | Used only by `PublicationBlocksRenderer` |
| `audiomotion-analyzer` | Direct dependency | Used only by `AudioSpectrumVisualizer` |
| `eta-mu-cljs-runtime-rewrite` | Epic dependency (web boundary patterns) | Reagent extern conventions, shadow-cljs build hooks, JS facade patterns |
| `packages/runtime/src/cljs/eta_mu/runtime/extern/*.cljs` | Existing convention reference | Reuse `extern/js.cljs`, `extern/json.cljs`, `extern/http.cljs` patterns for new `eta_mu.garden.extern.*` |

## 9. Proposed migration order

1. `eta_mu.garden.shape.url` and `eta_mu.garden.shape.duration` — pure helpers, no React.
2. `eta_mu.garden.law.publication`, `eta_mu.garden.law.music-player`, `eta_mu.garden.law.queue` — Malli schemas for all props/block types.
3. `eta_mu.garden.extern.audio`, `eta_mu.garden.extern.audiomotion`, `eta_mu.garden.extern.markdown`, `eta_mu.garden.extern.uxx` — isolate raw JS interop.
4. `eta_mu.garden.web.music-player-view` and `eta_mu.garden.web.playlist-queue-list` — presentational Reagent components.
5. `eta_mu.garden.web.audio.audio-spectrum-visualizer` and `eta_mu.garden.web.audio.playback-progress` — effect-heavy widgets.
6. `eta_mu.garden.web.studio-playlist-player` — orchestrates audio state.
7. `eta_mu.garden.web.publication-blocks-renderer` — block dispatcher.
8. `eta_mu.garden.web.server` and `eta_mu.garden.web.browser` — SSR and hydration entry points.
9. `eta_mu.garden.cli.index` and `eta_mu.garden.cli.build` — facade exports and Vite/shadow-cljs wiring.

## 10. Risk notes

- `react-markdown` and `audiomotion-analyzer` are not CLJS-native; they must remain JS externs or be wrapped in thin adapter namespaces.
- `StudioPlaylistPlayer` holds imperative audio state (refs, `AudioContext`, event listeners) and is the highest-risk port.
- `PublicationBlocksRenderer` injects a global `<style>` block; in Reagent this should remain a single rendered child or move to a CSS file.
- Browser/server bundles must preserve the exact public JS API (named exports and the `GardenPublicationApp` global) for existing HTML embedders.
