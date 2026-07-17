---
uuid: "orgs-open-hax-eta-mu-packages-eta-mu-extensions-kanban-orgs-open-hax-eta-mu-packages-eta-mu-extensions-spec-extension-integration-plan-md"
title: "Extension Integration Plan for eta-mu"
status: incoming
priority: P3
labels: ["specs", "migrated-spec"]
created_at: "2026-05-29T04:29:38.093Z"
source: "orgs/open-hax/eta-mu/packages/extensions/kanban/extension-integration-plan.md"
category: "specs"
---

> Source: `orgs/open-hax/eta-mu/packages/extensions/kanban/extension-integration-plan.md`
> Migrated-to-kanban: `orgs/open-hax/eta-mu/packages/extensions/kanban/extension-integration-plan.md`
> Reconciled against `manifest.edn` on 2026-06-19 (15 `:local :tracked` extensions; phantom image extensions removed).

# Extension Integration Plan for eta-mu

**Status:** Active
**Created:** 2026-04-09
**Author:** eta-mu

## Overview

This document specifies the integration plan for remaining pi/opencode extensions into the eta-mu constitutional layer.

## Current State

### Ported Extensions (CLJS — 15 total)

Source of truth is `manifest.edn`, which declares exactly 15 `:source :local :tracked true`
extensions, every one of which has matching CLJS source under
`src/eta_mu/extensions/`. The table below is the manifest set:

| Extension (manifest name) | Source file | Description |
|---------------------------|-------------|-------------|
| `apply-patch` | `apply_patch.cljs` | Codex-style multi-file patch tool |
| `bootstrap` | `bootstrap.cljs` | Session initialization and state recovery |
| `chronos` | `chronos.cljs` | Time tracking for contracting work |
| `contract-runtime` | `contract_runtime.cljs` | Operational contract runtime v1 |
| `contract-runtime-v2` | `contract_runtime_v2.cljs` | Contract runtime v2: cwd-walk, policy gate, fulfillment notify/audit |
| `custom-providers` | `custom_providers.cljs` | Provider configuration extensions |
| `graph-memory` | `graph_memory.cljs` | Graph memory tools for OpenPlanner/Graph-Weaver |
| `image-render` | `image_render.cljs` | Image rendering for TUI (the only image extension) |
| `lisp-decomp-nudge` | `lisp_decomp_nudge.cljs` | Nudge agent to decompose large Lisp fns on paren mismatch |
| `opencode-global-instructions` | `opencode_global_instructions.cljs` | Global instruction injection for OpenCode |
| `opmf-contract-gate` | `opmf_contract_gate.cljs` | Output contract gate enforcement (depends on `@open-hax/output-contract-gate`) |
| `receipt-river` | `receipt_river.cljs` | Append-only receipts.log ledger for multi-step work |
| `session-mycology` | `session_mycology.cljs` | Per-turn retrospection with p-scores and skill-spore incubation |
| `task-timing` | `task_timing.cljs` | Task timing and performance tracking |
| `websearch-open-hax` | `websearch_open_hax.cljs` | Web search via OpenHax proxy |

Non-extension source under the same directory (helpers/tests, deliberately absent from
the manifest): `prompt_section.cljs`, the `*_test.cljs` files, and the
`contract_runtime_v2/` and `receipt_river/` subdirectories.

### Legacy TypeScript extensions

The `pi/agent/extensions` TypeScript source directory has been retired to avoid runtime drift.
`apply-patch` is now CLJS (`src/eta_mu/extensions/apply_patch.cljs`). `skill-graph-aco` was
removed from the active runtime; static `skill_graph`/graph-memory tooling is canonical until
an ACO CLJS rewrite is justified. (`contract_runtime.cljs` still *reads* a
`skill-graph-aco/skill-call-events.jsonl` telemetry file, but there is no `skill-graph-aco`
extension.)

## Identified Patterns for Macroization

### Pattern 1: State Management (HIGH frequency)

Appears in 5/11 extensions:
- STATE-DIR constant
- EVENTS-FILE constant
- STATUS-KEY constant
- GLOBAL-KEY constant
- get-state function
- set-status! function

**Macro:** `defstate`

### Pattern 2: Event Handlers (HIGH frequency)

Appears in all extensions:
- session_start handler
- session_shutdown handler
- turn_start handler (often)
- before_agent_start handler (often)

**Macro:** `defevents`

### Pattern 3: Tool Parameter Schema (MEDIUM frequency)

Repetitive parameter definitions with:
- type specification
- description strings
- optional flags
- enum constraints

**Macro:** `deftool`

## Implementation Roadmap

### Week 1: Macro Library ✅

- [x] Create `lib/eta_mu/macros/state.cljc`
- [x] Create `lib/eta_mu/macros/event.cljc`
- [x] Create `lib/eta_mu/macros/tool.cljc`
- [ ] Refactor existing extensions to use macros

### Week 2: Image Extensions (P1) — NOT LANDED / DROPPED

This roadmap item never shipped. There is **no** `analyze_image.cljs` or
`manipulate_image.cljs` source anywhere under `packages/extensions`, and neither has a
`manifest.edn` entry. The single shipped image extension is `image-render`
(`image_render.cljs`). `analyze_image` survives only as an example docstring inside the
`deftool` macro (`lib/eta_mu/macros/tool.cljc`).

- [ ] (dropped) `analyze-image` — schedule explicitly only if vision tooling is needed beyond `image-render`
- [ ] (dropped) `manipulate-image` — same; no current demand

### Week 3: Drift removal

- [x] Port `apply-patch` to CLJS
- [x] Remove `pi/agent/extensions` TypeScript runtime copies
- [x] Keep built-ins registered through `manifest.edn` and package metadata

### Week 4: Advanced Extensions (P3)

- [ ] Re-evaluate `skill-graph-aco` only if adaptive ACO behavior is needed beyond the canonical static skill graph / graph-memory tools

## Testing Requirements

### Unit Tests
- State management: initialization, reset, persistence
- Event handlers: session lifecycle
- Macro expansion: verify generated code

### Integration Tests
- Extension loading via pi
- OpenCode plugin generation
- Cross-platform compatibility

## Success Metrics

- All 15 manifest-declared extensions load without errors
- Build time < 60 seconds
- Test coverage > 80%
- No runtime errors in production use
- Macro usage in all new extensions
