---
uuid: "docs-create-missing-package-readmes"
title: "Create missing package READMEs for active CLJS packages"
status: icebox
priority: "P1"
labels: ["docs", "packages", "readme", "8sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 8
category: "tasks"
---
# Create missing package READMEs for active CLJS packages

## Context

Several active ClojureScript packages have no package-level README, making them invisible or hard to onboard. Discovery identified the following gaps.

## Packages needing READMEs

| Package | Purpose | Key things to document |
|---|---|---|
| `packages/chat-ui` | Reagent/Helix chat UI components and `IChatSession` protocol | Exported API, build/dev/test, backends (sol/knoxx/mock), relationship to Rheos |
| `packages/event-ledger` | Append-only event ledger with MongoDB persistence | Exported namespaces, envelope schema, build/test, `index.d.ts` compatibility surface |
| `packages/Rheos` | Kanban/web UI runtime and service shell | Dev server, CLI, UI, shadow-cljs targets, namespace layout |
| `packages/protocols` | Cross-package CLJS protocol definitions and Malli schemas | Scope, layer ownership, actual ESM exports, consumers |
| `packages/mcp-contracts` | Loader for enabled `:mcp-server` contracts | Contract shape, intended consumer, current adoption state |
| `packages/kanban-orchestrator` | Contract-only kanban orchestrator definitions | Five EDN contracts, runtime loader contract, MCP wiring |
| `packages/katamorph` | Contract/resource runtime (manifest, store, policy, action interpreter) | Purpose, build/test, namespace tour, store/schema usage |
| `packages/kondo-config` | Shared clj-kondo config and hooks | `:config-paths` consumption, linters/hooks, package-local overrides |
| `packages/legacy/publication-components` | React/TypeScript Garden publication components | Purpose, install/build, exports, SSR/hydration, legacy notice |

## Acceptance

- [ ] Each package above has a `README.md` with purpose, build/test commands, and public surface description.
- [ ] Legacy packages include a deprecation banner linking to the relevant CLJS rewrite inventory.
- [ ] READMEs use pnpm/monorepo commands, not npm.
- [ ] Top-level `README.md` is updated to link to the new package READMEs.
