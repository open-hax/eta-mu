---
uuid: "docs-fix-sol-knoxx-artifacts"
title: "Fix packages/sol documentation and remove Knoxx-copied artifacts"
status: "ready"
priority: "P1"
labels: ["docs", "sol", "knoxx", "5sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 5
category: "tasks"
---

# Fix packages/sol documentation and remove Knoxx-copied artifacts

## Context

`packages/sol` currently contains several artifacts copied from the Knoxx backend (`README.md`, `mutation/README.md`, `Dockerfile`, `ROUTE_MIGRATION_AUDIT.md`, `pseudo/hack.md`) that describe Knoxx routes, namespaces, and surfaces that do not exist in sol.

## Findings

- `packages/sol/README.md` title is "Knoxx Backend"; paths point to `backend/` and namespaces are `knoxx.backend.*`; commands use `pnpm -C backend`.
- `packages/sol/mutation/README.md` references `knoxx.mutation-test` and scripts not defined in `package.json`.
- `packages/sol/Dockerfile`, `ROUTE_MIGRATION_AUDIT.md`, and `pseudo/hack.md` are Knoxx artifacts.
- No `packages/sol/AGENTS.md` exists despite it being a complex active package.
- Root README omits sol entirely.
- Source still reads `KNOXX_*` environment variables with no explanation.

## Acceptance

- [ ] Rewrite `packages/sol/README.md` for Sol: actual purpose, namespace map (`open-hax.sol.*`), shadow-cljs build targets, dev/test commands, route surface, plugin entrypoint, and Knoxx coexistence note.
- [ ] Delete or clearly relabel Knoxx-copied artifacts; fix `mutation/README.md` or remove it if mutation is unsupported.
- [ ] Create `packages/sol/AGENTS.md` documenting architecture, boundaries, and relationship to Knoxx/runtime.
- [ ] Document `KNOXX_*` env variable lineage and whether Sol will rename them.
- [ ] Add `packages/sol` to the top-level `README.md` layout.
