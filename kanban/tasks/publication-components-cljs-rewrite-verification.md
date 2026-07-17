---
uuid: "publication-components-cljs-rewrite-verification"
title: "Publication Components CLJS Rewrite — Verification and Regression Tests"
status: "rejected"
priority: "P3"
labels: ["tasks", "cljs", "rewrite", "publication-components"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/publication-components-cljs-rewrite.md"
points: 3
category: "tasks"
---

# Publication Components CLJS Rewrite — Verification and Regression Tests

> Parent epic: `kanban/epics/publication-components-cljs-rewrite.md`
> Phase: 4
> Points: 3

## Purpose

Add regression coverage for the CLJS rewrite, verify browser and server bundles build, and ensure the public API surface is preserved.

## Scope

- Component-level CLJS tests for all ported components.
- Server-side rendering parity tests against legacy outputs.
- Build verification for browser and server bundles.
- TypeScript line-count ratchet check.
- Public API export verification.

## Work items

- [ ] Add CLJS tests for `PublicationBlocksRenderer`, `MusicPlayerView`, `PlaylistQueueList`, `StudioPlaylistPlayer`, `AudioSpectrumVisualizer`, and `PlaybackProgress`.
- [ ] Add a server-render parity test comparing CLJS HTML output to a representative legacy snapshot.
- [ ] Verify `pnpm build`, `pnpm typecheck`, and bundle outputs.
- [ ] Confirm `node scripts/ts-line-count.mjs packages/legacy/publication-components` shows non-increasing TS lines.
- [ ] Update parent epic acceptance criteria checkboxes.

## Acceptance criteria

- [ ] All new CLJS tests pass.
- [ ] `pnpm --filter @open-hax/garden-publication-components build` and `typecheck` pass.
- [ ] Browser and server bundles are emitted in expected `dist/` paths.
- [ ] Public API matches legacy exports.
- [ ] TypeScript line count does not increase relative to the baseline.

## Verification

```bash
pnpm --filter @open-hax/garden-publication-components build
pnpm --filter @open-hax/garden-publication-components typecheck
pnpm --filter @open-hax/garden-publication-components test
node scripts/ts-line-count.mjs packages/legacy/publication-components
```

---
Blocked by all prior tasks; cannot verify until components, build, and facade are complete. Core runtime verification gates can be reused once this epic's deliverables are ready.
---
