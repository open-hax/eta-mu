# Legacy Package Reorganization Plan

**Status:** draft  
**Scope:** physical package layout and naming for the eta-mu CLJS rewrite  
**Parent:** `kanban/tasks/eta-mu-cljs-rewrite-architecture-inventory.md`  
**Related:** `docs/cljs-runtime-rewrite-architecture-inventory.md`

## Purpose

This document turns the existing CLJS rewrite inventory into a physical package reorganization plan. It proposes new names and boundaries for the contents of `packages/legacy/*` so that the eventual monorepo layout is domain-aligned rather than history-aligned.

## Why reorganize

The current `packages/legacy/*` names reflect the old TypeScript product split:

| Legacy package | Problem |
|---|---|
| `agent` | Too generic. The package contains the agent loop and session abstractions, not "agents" as a product. |
| `ai` | Too broad. It is really a provider/model boundary, not "AI" in general. |
| `coding-agent` | Implementation name. The public surface is the `eta-mu`/`pi` CLI; the directory name is confusing. It should become the `eta-mu` base package. |
| `tui` | Jargon. It is a terminal UI library. |
| `output-contract-gate` | Long and tool-specific. It is really a law/shape package for output contracts and OPMF. |
| `github` | Tied to a single provider. It is a GitHub automation agent. |
| `kanban` | Superseded by `packages/Rheos`. The real kanban implementation is now in Rheos; the legacy package is only operational support. |

The goal is to give each package a name that describes **what it owns** in the new architecture, using the category vocabulary from the rewrite inventory: `domain`, `shape`, `law`, `extern`, `infra`, `cli`, `tui`, `web`.

## Constraints

1. **No new TypeScript in legacy.** Any code still in `packages/legacy/*` is frozen for migration; new work goes into new CLJS packages.
2. **Move on rewrite.** A package is renamed by rewriting its contents in ClojureScript into the new package. The old directory is deleted once it is empty.
3. **One domain boundary per package.** Avoid monolithic packages that contain `domain` + `extern` + `web` mixed together.
4. **Keep compatibility surfaces stable.** Public binaries, package exports, and SDK contracts stay working during transition via thin facade wrappers.

## Proposed package map

| Current legacy package | Proposed package | Boundary / role | Rationale |
|---|---|---|---|
| `packages/legacy/agent` | `packages/turn-processor` | Turn processor and session abstractions. | `agent` is too generic; `turn-processor` names the actual function: take a turn, dispatch tools, call providers, return results. |
| `packages/legacy/ai` | `packages/llm-providers` | Provider registry, model requests, and provider-specific extern adapters. | "AI" is too broad. This package is the bridge to language-model providers. |
| `packages/legacy/coding-agent` | `packages/eta-mu` (npm: `eta-mu`) | The `eta-mu`/`pi` terminal CLI and command/runtime router. | The base package. Global install (`npm install -g eta-mu`) brings in the whole system; it routes to runtime, providers, tools, and TUI. |
| `packages/legacy/tui` | `packages/terminal-ui` | Terminal UI components and terminal extern adapters. | Clearer than `tui`; matches the `cli`/`terminal` naming family. |
| `packages/extensions` | **Broken into per-extension packages** | Built-in extensions and shared extension DSL. | Each built-in extension gets its own package; shared macros/build infra move to `packages/extension-core`. The base `eta-mu` package depends on the extensions it ships by default. |
| `packages/legacy/github` | `packages/github-agent` | GitHub automation agent and PR/review gate. | Describes the product boundary, not just the API it calls. |
| `packages/legacy/output-contract-gate` | `packages/contracts/output` | OPMF/output-contract law, shape, and CLI gate. | Shorter; emphasizes the law/shape boundary rather than a specific tool. Grouped under `packages/contracts/` for better organization. |
| `packages/legacy/publication-components` | `packages/publication-ui` | Web publication components. | Matches the web UI category vocabulary. |
| `packages/legacy/docs` | `packages/docs-ui` | Docs view and intake projection surface. | Small web projection surface; name it after the UI it renders. |

## Category alignment

Each proposed package maps to the existing CLJS category vocabulary so the rewrite inventory stays valid:

| Proposed package | Primary categories | Notes |
|---|---|---|
| `packages/llm-providers` | `extern.provider.*`, `shape.provider_request`, `domain.model` | Provider SDK payloads stay in `extern`; pure transforms move to `shape`/`domain`. |
| `packages/terminal-ui` | `tui.components.*`, `tui.state`, `extern.terminal` | Consumes stable runtime maps; no provider/session policy in the UI layer. |
| `packages/eta-mu` | `cli.commands.*`, `cli.args`, `infra.session`, `infra.tool_execution`, `extern.process`, `extern.fs`, `extern.git` | The CLI is an orchestration shell; it delegates to runtime/domain packages. |
| `packages/turn-processor` | `domain.*`, `infra.*` (if kept separate) | Pure turn-processing decisions first; side effects through runtime infra. |
| `packages/extension-core` | `law.extension`, `shape.extension`, `extern.build` | Shared DSL macros and common build helpers for all extensions. |
| `packages/extension-*` | `infra.tools.*`, `law.contract_runtime.*`, `extern.opencode`, `extern.http`, `extern.fs` | Individual built-in tools; each owns its own domain/extern boundary. |
| `packages/contracts/output` | `law.output_contract`, `shape.edn`, `shape.markdown`, `cli.output_contract_gate` | Schemas and validation stay pure; the CLI gate is a thin facade. |
| `packages/github-agent` | `domain.github.*`, `extern.github.*`, `infra.github.*` | GitHub API interop is `extern`; PR/review decisions are `domain`. |
| `packages/publication-ui` | `web.publication.*`, `extern.browser.*` | Web components only. |
| `packages/docs-ui` | `web.docs.*`, `extern.browser.*` | Docs projection. |

## Migration order

Keep the rewrite order from the architecture inventory, but move code into the new package names as each slice is completed:

1. **Slice 1 — runtime core.** Stabilize `packages/runtime` (or resolve ownership with `packages/sol`). Decide whether the turn processor merges here or stays in `packages/turn-processor`.
2. **Slice 2 — output contracts.** Create `packages/contracts/output` from `packages/legacy/output-contract-gate`.
3. **Slice 3 — CLI/message/session bridge.** Create `packages/eta-mu` from `packages/legacy/coding-agent` core. The remaining legacy providers/TUI stay in `packages/legacy/` until their slices.
4. **Slice 4 — providers.** Create `packages/llm-providers` from `packages/legacy/ai`.
5. **Slice 5 — TUI.** Create `packages/terminal-ui` from `packages/legacy/tui`.
6. **Slice 6 — remaining agents/tools.** Create `packages/github-agent`, `packages/publication-ui`, `packages/docs-ui` as their dependencies stabilize. The legacy `kanban` package is not recreated; `packages/Rheos` is the canonical kanban implementation.
7. **Slice 7 — delete `packages/legacy/`.** Once all legacy packages are empty, remove the directory and the TS-line-count guard can be retired.

## Open questions

1. **Turn processor ownership:** Should `packages/legacy/agent` become `packages/turn-processor`, or merge into `packages/runtime`? *Tentatively resolved as `packages/turn-processor`.*
2. **CLI naming:** Resolved as `packages/eta-mu` (npm name `eta-mu`), the global base package that routes to all other components.
3. **`packages/extensions` placement:** Resolved as **break down into `packages/extension-core` and individual `packages/extension-*` packages**. Each built-in extension owns its own package; shared macros/build infra move to `extension-core`.
4. **Deletion of `packages/legacy`:** Resolved as **one final cleanup PR** after the last rewrite slice lands and all legacy packages are empty.

## Verification checklist

- [ ] Stakeholders agree on the open questions above.
- [ ] Each proposed package name is checked for npm workspace and pnpm compatibility.
- [ ] The first slice that creates a new package (`packages/contracts/output`) is added to the kanban as a child of the architecture inventory task.
- [ ] The TS-line-count baseline is updated to account for the target package moves.
- [ ] `packages/eta-mu-extensions` stale stub is removed before any new package takes that name.

## License

GPL-3.0-or-later
