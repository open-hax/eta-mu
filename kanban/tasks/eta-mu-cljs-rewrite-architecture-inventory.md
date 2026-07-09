---
uuid: "eta-mu-cljs-rewrite-architecture-inventory"
title: "Eta-mu CLJS Rewrite — Architecture Inventory"
status: "review"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "inventory", "5sp"]
created_at: "2026-05-29T21:18:48Z"
source: "kanban/epics/eta-mu-cljs-runtime-rewrite.md"
points: 5
category: "tasks"
---
# Eta-mu CLJS Rewrite — Architecture Inventory

> Parent epic: `kanban/epics/eta-mu-cljs-runtime-rewrite.md`
> Points: 5

## Purpose

Create the package-by-package map that makes the CLJS rewrite safe and path-scoped instead of a big-bang port.

## Scope

- `packages/**` (including `packages/legacy/**`)
- root `package.json`, `pnpm-workspace.yaml`, `deps.edn`, `shadow-cljs.edn`
- existing CLJS packages such as `packages/extensions`, `packages/runtime`, `packages/sol`, and `packages/Rheos`
- agent skill manifests loaded from `~/.agents/skills/*` (host-boundary runtime surface, not a workspace package)

## Work items

- [x] Count TS/JS/CLJS source by package and identify generated/dist folders to ignore.
- [x] Catalog public compatibility surfaces: binaries, package exports, SDK exports, tool manifests, provider adapters, session storage, TUI/web entrypoints, and service runners.
- [x] Classify each source cluster as `domain`, `shape`, `law`, `extern`, `infra`, `cli`, `tui`, or `web`.
- [x] Record known red tests or warning baselines before rewrite work starts.
- [x] Produce a migration map linked from the parent epic.

## Acceptance criteria

- [x] Inventory document exists in the eta-mu repo and links every package to a target CLJS ownership category.
- [x] The first three parity slices are named with risk and verification gates.
- [x] No code rewrite begins from this task except inventory scripts/docs.

## Verification

```bash
find packages \( -path '*/node_modules' -o -path '*/dist' -o -path '*/dist-cljs' -o -path '*/target' -o -path '*/.shadow-cljs' -o -path '*/.build' -o -path '*/out' \) -prune -o -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.mjs' -o -name '*.cjs' -o -name '*.cljs' -o -name '*.cljc' -o -name '*.clj' \) -print | wc -l
pnpm --dir packages/runtime cljs:verify
pnpm --dir packages/legacy/output-contract-gate test
pnpm -C packages/extensions test
pnpm lint
```
---

## Planning inventory drafted

Planning inventory drafted at docs/cljs-runtime-rewrite-architecture-inventory.md. It classifies package surfaces, target domain/shape/law/infra/extern ownership, boundary hotspots, deferred packages, agent skill surface, and the first three parity slices: runtime, output-contract-gate, and coding-agent message/session core.


---

**Update 2026-06-16.** Inventory refreshed after the monorepo reorg. Addressed the 2026-06-13 review gaps:

- Added `packages/skills` coverage: skills are a host-loaded runtime protocol surface (`~/.agents/skills/*`), not a workspace package, and are classified as `extern.runtime`/`infra.skill_loader`/`law.skill_contract`.
- Added the "Deferred packages" table with rationale for `mom`, `eta-mu-github`, `eta-mu-docs`, `eta-mu-truth`, `eta-mu-extensions-e2e`, `presence-core`, and the four `signal-*` packages.
- Recorded an actual verification baseline in the inventory doc, including the one historical lint/typecheck failure in `packages/legacy/github/src/pi-agent.ts`.

Status moved to `review` for human verification; not closed.


---

**Session 2026-06-16 clarification.** All CLJS rewrites remain maximum priority. This inventory is a living map; "deferred" means those packages are intentionally postponed in the rewrite ordering, not cancelled or descoped. The deferred list should be revisited as dependency pressure changes (e.g., when `runtime`, `sol`, or `extensions` need one of them).

**Update 2026-07-08.** Cross-referenced `kanban/tasks/legacy-package-reorganization.md` and `docs/design/legacy-package-reorganization.md`. Final package names resolved:

- `packages/legacy/agent` → `packages/turn-processor`
- `packages/legacy/ai` → `packages/llm-providers`
- `packages/legacy/coding-agent` → `packages/eta-mu` (npm: `eta-mu`)
- `packages/legacy/tui` → `packages/terminal-ui`
- `packages/legacy/kanban` → superseded by `packages/Rheos`
- `packages/legacy/github` → `packages/github-agent`
- `packages/legacy/output-contract-gate` → `packages/contracts/output`
- `packages/legacy/publication-components` → `packages/publication-ui`
- `packages/legacy/docs` → `packages/docs-ui`
- `packages/extensions` → `packages/extension-core` + `packages/extension-*`

Deletion of `packages/legacy/` is scheduled for one final cleanup PR after the last rewrite slice lands.

**Update 2026-07-08 (base CLI).** Created `packages/eta-mu` as the new global `eta-mu` / `pi` CLI entry point and sub-command router. The legacy agent is delegated until the TUI rewrite is complete. Tracked by `kanban/tasks/eta-mu-base-cli-package.md`.

**Update 2026-07-09 (eta-mu agent REPL).** `packages/eta-mu` now implements the default `agent` command as a ClojureScript single-turn chat, REPL, or piped-input handler using `@eta-mu/turn-processor`. Added `eta-mu.extern.readline` and `eta-mu.infra.cli.repl`. 51 tests, 95 assertions, 0 failures in `packages/eta-mu`. The legacy `@open-hax/eta-mu-cli` dependency is no longer used by `eta-mu`. The remaining slice is the full terminal-ui package split from `packages/legacy/tui`.

**Update 2026-07-09 (terminal-ui planning).** Created `kanban/tasks/terminal-ui-cljs-package.md` to plan the migration of `packages/legacy/tui` into a new ClojureScript package `packages/terminal-ui`. The `packages/eta-mu` REPL is the interim text-only agent experience; the terminal-ui package will host the richer terminal interface.