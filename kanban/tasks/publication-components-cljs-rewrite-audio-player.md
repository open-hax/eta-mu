---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "publication-components"]
write-id: "1783693259678-0.dptkavuaq7co62w78tv"
points: "5"
source: "kanban/epics/publication-components-cljs-rewrite.md"
title: "Publication Components CLJS Rewrite — Audio Widgets and StudioPlaylistPlayer"
priority: "P3"
status: "rejected"
uuid: "publication-components-cljs-rewrite-audio-player"
created_at: "2026-06-15T00:00:00Z"
---

# Publication Components CLJS Rewrite — Audio Widgets and StudioPlaylistPlayer

> Parent epic: `kanban/epics/publication-components-cljs-rewrite.md`
> Phase: 2
> Points: 5

## Purpose

Port the audio playback components (`AudioSpectrumVisualizer`, `PlaybackProgress`) and the stateful `StudioPlaylistPlayer` to Reagent, isolating all browser audio API interop in `extern.*` namespaces.

## Scope

- `AudioSpectrumVisualizer` with `audiomotion-analyzer` integration.
- `PlaybackProgress` with timeupdate/seeking/seeked event handling.
- `StudioPlaylistPlayer` state management (selection, player state, duration, volume, audio context).
- `AudioContext`, `AnalyserNode`, `MediaElementAudioSourceNode`, and `<audio>` element interop.
- Lifecycle cleanup for audio nodes and event listeners.

## Work items

- [ ] Create `eta_mu.garden.extern.audio` adapter for `AudioContext`, `AnalyserNode`, `MediaElementAudioSourceNode`, and `<audio>` element operations.
- [ ] Create `eta_mu.garden.extern.audiomotion` adapter for `audiomotion-analyzer` instantiation and destruction.
- [ ] Create `eta_mu.garden.web.audio_spectrum_visualizer` and `eta_mu.garden.web.playback_progress` Reagent components.
- [ ] Create `eta_mu.garden.web.studio_playlist_player` Reagent component with equivalent `reagent.core/atom` state.
- [ ] Port event listener wiring and cleanup exactly.
- [ ] Add tests for progress updates, play-state transitions, and audio node lifecycle.

## Acceptance criteria

- [ ] `StudioPlaylistPlayer` loads, plays, pauses, and advances tracks from CLJS.
- [ ] `AudioSpectrumVisualizer` instantiates `audiomotion-analyzer` only when playing.
- [ ] `PlaybackProgress` syncs current time and supports seeking.
- [ ] All raw audio/DOM interop is confined to `extern.*` namespaces.
- [ ] Component-level tests pass under the CLJS test target.

## Verification

```bash
pnpm --filter @open-hax/garden-publication-components test
pnpm --filter @open-hax/garden-publication-components typecheck
pnpm --filter @open-hax/garden-publication-components build
```

---
Blocked by `publication-components-cljs-rewrite-inventory` and `publication-components-cljs-rewrite-law-shape` (track schemas and audio URL shape). Core runtime extern conventions are already available.
---
