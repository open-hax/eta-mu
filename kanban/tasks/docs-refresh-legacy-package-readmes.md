---
uuid: "docs-refresh-legacy-package-readmes"
title: "Refresh legacy package READMEs with deprecation banners and path fixes"
status: "incoming"
priority: "P1"
labels: ["docs", "legacy", "readme", "8sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 8
category: "tasks"
---

# Refresh legacy package READMEs with deprecation banners and path fixes

## Context

The TypeScript packages under `packages/legacy/` are deprecated per the monorepo's TypeScript deprecation policy, but most READMEs still present them as the current product, use stale paths, and omit links to the active ClojureScript rewrite.

## Packages and specific fixes

| Package | Issues to fix |
|---|---|
| `packages/legacy/agent` | No deprecation banner; no pointer to `docs/agent-cljs-rewrite-inventory.md` or `kanban/epics/agent-cljs-rewrite.md`; missing public-export-to-CLJS migration map. |
| `packages/legacy/ai` | No deprecation banner; "Adding a New Provider" section references non-existent `packages/ai/` paths; no pointer to CLJS canonical model in `packages/runtime`. |
| `packages/legacy/coding-agent` | Docs present TS CLI as current; `docs/development.md` references `badlogic/pi-mono` and old layout; `examples/sdk/README.md` lists non-existent example. |
| `packages/legacy/github` | No deprecation banner; top-level README points to wrong path `packages/eta-mu-github`. |
| `packages/legacy/kanban` | README uses wrong package name `@open-hax/kanban` and path `packages/kanban`; references non-existent `services/eta-mu/kanban/`; no legacy/rewrite pointer. |
| `packages/legacy/docs` | README is only 13 lines; does not describe public surface or link to `docs/docs-cljs-rewrite-inventory.md`. |
| `packages/legacy/output-contract-gate` | README uses wrong package name `@workspace/output-contract-gate` and `devel/packages/` paths; no deprecation/rewrite notice. |
| `packages/legacy/tui` | Development commands use npm and stale scripts; no deprecation/rewrite notice; license inconsistency (MIT vs LGPL). |

## Acceptance

- [ ] Each legacy README has a prominent deprecation banner linking to the relevant CLJS rewrite inventory and epic.
- [ ] Paths and package names match the actual `packages/legacy/*` locations.
- [ ] Build/test commands use pnpm and match `package.json` scripts.
- [ ] Stale external repo references and broken example links are fixed or removed.
- [ ] License inconsistencies are documented or reconciled.
