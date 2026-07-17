---
uuid: "publication-components-cljs-rewrite-build-facade"
title: "Publication Components CLJS Rewrite — Build and JS Facade"
status: "rejected"
priority: "P3"
labels: ["tasks", "cljs", "rewrite", "publication-components"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/publication-components-cljs-rewrite.md"
points: 3
category: "tasks"
---

# Publication Components CLJS Rewrite — Build and JS Facade

> Parent epic: `kanban/epics/publication-components-cljs-rewrite.md`
> Phase: 3
> Points: 3

## Purpose

Wire the ClojureScript build so the package emits stable JS exports for `index`, `server`, and `browser-app` entry points while keeping the existing public API intact.

## Scope

- shadow-cljs or Vite configuration for the new CLJS sources.
- Browser bundle entry (`browser.tsx` equivalent) and hydration boot.
- Server bundle entry (`server.tsx` equivalent) and `renderToString` facade.
- `src/index.ts` thin re-export if needed for TS consumers.
- `vite.browser.config.ts` integration or replacement.

## Work items

- [ ] Add shadow-cljs/Vite build targets for CLJS source under `packages/legacy/publication-components` (or its successor package).
- [ ] Create `eta_mu.garden.web.browser` and `eta_mu.garden.web.server` entry namespaces.
- [ ] Implement `eta_mu.garden.facade` with stable JS exports mirroring `src/index.ts`.
- [ ] Keep `src/index.ts` as a thin re-export of the CLJS facade if TS consumers remain.
- [ ] Update package `build` script to produce `dist/index.js`, `dist/server.js`, and `dist/browser/garden-publication-app.js`.

## Acceptance criteria

- [ ] `pnpm --filter @open-hax/garden-publication-components build` passes.
- [ ] `dist/index.js` exports the same public API as legacy `src/index.ts`.
- [ ] `dist/server.js` exposes `renderPublicationBlocksHtml` and `serializeGardenPublicationProps`.
- [ ] `dist/browser/garden-publication-app.js` hydrates garden publication roots on `DOMContentLoaded`.
- [ ] Type declarations are emitted or preserved for TS consumers.

## Verification

```bash
pnpm --filter @open-hax/garden-publication-components build
pnpm --filter @open-hax/garden-publication-components typecheck
node scripts/ts-line-count.mjs packages/legacy/publication-components
```

---
Blocked by component porting tasks (`blocks-renderer`, `music-player`, `audio-player`, `queue-list`) and `law-shape`; the facade must mirror the ported public API. Core runtime build/spine patterns are available via the completed shadow-spine task.
---
