---
uuid: "publication-components-cljs-rewrite-inventory"
title: "Publication Components CLJS Rewrite — Inventory and Namespace Map"
status: done
priority: P3
labels: ["tasks", "cljs", "rewrite", "publication-components"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/publication-components-cljs-rewrite.md"
points: 2
category: tasks
---
# Publication Components CLJS Rewrite — Inventory and Namespace Map

> Parent epic: `kanban/epics/publication-components-cljs-rewrite.md`
> Phase: 1
> Points: 2

## Purpose

Catalog every component, type, and public export in `packages/legacy/publication-components` and classify them into the target `domain`/`shape`/`law`/`extern`/`web` namespace taxonomy before porting begins.

## Scope

- File-by-file inventory of `src/**/*.ts` and `src/**/*.tsx`.
- Classify each export as `domain`, `shape`, `law`, `extern`, `web`, or `cli`.
- Map package entry points (`src/index.ts`, `src/browser.tsx`, `src/server.tsx`) to CLJS facade targets.
- Identify raw JS interop surfaces: React/DOM, audio APIs, `audiomotion-analyzer`, Vite.
- Document consumers and build targets.

## Work items

- [ ] Produce `docs/publication-components-cljs-rewrite-inventory.md` with a file-by-file map.
- [ ] Define target namespaces under `eta_mu.garden.*` for each component/type.
- [ ] List raw interop boundaries (React, AudioContext, MediaElementSourceNode, `audiomotion-analyzer`).
- [ ] Identify consumers of `@open-hax/garden-publication-components` and required public API surface.
- [ ] Mark dependency on `eta-mu-cljs-runtime-rewrite` for web boundary patterns.

## Acceptance criteria

- [ ] Every `src/**/*.{ts,tsx}` file has a proposed CLJS namespace destination.
- [ ] Public exports from `src/index.ts`, `src/browser.tsx`, and `src/server.tsx` are mapped.
- [ ] Raw interop boundaries are explicitly listed per component.
- [ ] Inventory file is reviewed and linked from the parent epic.

## Verification

```bash
ls docs/publication-components-cljs-rewrite-inventory.md
pnpm --filter @open-hax/garden-publication-components typecheck
node scripts/ts-line-count.mjs packages/legacy/publication-components
```

---

Ready to decompose/estimate: Phase 1 cataloging task with no internal blockers. The core `eta-mu-cljs-runtime-rewrite` spine and extern conventions are sufficiently established for documentation/classification; web-specific extern adapters will be created inside this epic.

---

**Delivered:** `docs/publication-components-cljs-rewrite-inventory.md` catalogs all 10 source files (~1,081 TS lines), public exports, internal consumers, raw JS interop surfaces (React, DOM, Web Audio, `audiomotion-analyzer`, `react-markdown`), component props, build targets (`dist/index.js`, `dist/server.js`, `dist/browser/garden-publication-app.js`), and runtime/boundary dependencies. Each file is mapped to the `eta_mu.garden.{domain,shape,law,extern,web,cli}` taxonomy, with a proposed migration order and risk notes.

**Next recommended task:** `kanban/tasks/publication-components-cljs-rewrite-law-shape.md` — define Malli schemas for publication blocks, tracks, player props, and permissions before component ports begin.
