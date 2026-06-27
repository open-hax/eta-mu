# Notes Index

Working notes captured during the eta-mu design process. Filenames are
timestamps (`YYYY.MM.DD.HH.MM.SS.md`) recording when the note was written.

This index classifies each note by topic and marks it as either:

- **design intent** — describes the intended architecture; treat as a target
  that source/docs should converge toward (still subject to revision, but the
  direction is current).
- **historical** — brainstorming, transcripts, or one-off context that records
  how the thinking got here. Useful for lineage, not authoritative.

Distilled, more durable write-ups live in [`../design/`](../design/). Notes
that have been promoted there are marked below.

---

## Contracts, capabilities & the contract runtime

The contract DSL (actors, capabilities, policies, intents, fulfillments) and
the runtime that loads and enforces it. This is the densest and most-developed
thread.

| Note | Status | Summary |
|------|--------|---------|
| [2026.04.19.08.47.39.md](2026.04.19.08.47.39.md) | design intent | Capability vs. policy resolved: capability grants access (a bundle of tools); policy only narrows. Includes worked EDN for both. Promoted to [`../design/contract-model.md`](../design/contract-model.md). |
| [2026.04.19.08.56.22.md](2026.04.19.08.56.22.md) | design intent | Full Malli schema for the contract kinds (agent/policy/intent/fulfillment/trigger/role/capability), plus contract-tree resolution and id-collision rules ("first from current execution context wins"). |
| [2026.04.19.08.44.04.md](2026.04.19.08.44.04.md) | design intent | Intent contracts (pre-execution gate, inverse of fulfillment) and the case for deterministic — not just LLM-judge — fulfillment checks. |
| [2026.04.19.10.07.53.md](2026.04.19.10.07.53.md) | historical | Long Perplexity transcript reviewing the contract DSL direction (EDN-first, Malli, SCI evaluator, bracket-repair toolchain). Source material for the design-intent notes above. |
| [2026.05.08.11.37.09.md](2026.05.08.11.37.09.md) | design intent | Prompt-contract-as-source-language: a two-stage compiler (contract source → prompt + enforcement spec; response markdown → semantic AST) and parsing leading epistemic parentheticals `(己, p=…)` into claim data. |

## Agent model, orchestrator & kanban FSM

How agents are driven by the kanban board, the FSM that gates task transitions,
and the `.eta-mu/` ledger/state layout.

| Note | Status | Summary |
|------|--------|---------|
| [2026.06.16.07.13.42.md](2026.06.16.07.13.42.md) | design intent | Acceptance criteria for improving `AGENTS.md`/`PROCESS.md`: FSM blocks invalid board moves across all surfaces (file edit, CLI, MCP, hooks); per-package `AGENTS.md`; sol/knoxx coexistence; `extern` boundary rule. |
| [2026.06.14.22.24.55.md](2026.06.14.22.24.55.md) | design intent | `.eta-mu/` holds three kinds of things: resources, ledgers, state (projections). Kanban FSM as pure katamorph resources; drivers-as-resources (`:module`/`:driver`) as the bootstrap that makes katamorph a runtime. |
| [2026.06.16.12.02.30.md](2026.06.16.12.02.30.md) | design intent | Sketch of the (unimplemented) `eta-mu kanban agent` CLI: session registration, ledger-backed event/state EDN files, orchestrator self-assignment to tasks. |
| [2026.06.16.06.43.13.md](2026.06.16.06.43.13.md) | historical | Stub system prompt for the "Eta Mu" orchestrator persona (mostly empty outline). |

## Architecture & workspace model

Higher-level framing of how the workspace itself is composed.

| Note | Status | Summary |
|------|--------|---------|
| [2026.06.14.00.38.02.md](2026.06.14.00.38.02.md) | historical | "Worlds & projections" framing for managing many repos/submodules — a manifest-defined working set. Perplexity transcript; vocabulary exploration, not a committed design. |
| [2026.06.14.12.19.50.md](2026.06.14.12.19.50.md) | design intent | Vision script for `eta-mu init`: what the tool should *feel* like (event ledger, sentinel, fork tax, receipt river, session mycology, retrospective agent). Aspirational product narrative. |

## Tooling

CLJS development tooling references.

| Note | Status | Summary |
|------|--------|---------|
| [2025.11.04.11.54.30.md](2025.11.04.11.54.30.md) | historical | CLJS tooling survey: clojure-lsp, clj-kondo, cljfmt/zprint, Portal, re-frame-10x, shadow test targets. (Was duplicated under `research-prompt/`; that copy was removed and this is the canonical one.) |
| [2025.11.04.12.11.40.md](2025.11.04.12.11.40.md) | historical | Companion CLJS debugging/inspection list: Portal, re-frame-10x, re-frisk, FlowStorm, shadow Inspect UI, Dirac. (Formerly duplicated under `research-prompt/`.) |

## Harness / prompt-engineering ops

Notes about running agents in specific harnesses, not about eta-mu's own design.

| Note | Status | Summary |
|------|--------|---------|
| [2026.06.16.07.28.31.md](2026.06.16.07.28.31.md) | historical | "Compiler of intent" prompt template (Clarified Intent / Copy-Ready Prompt / Possible Refinements) plus exploration rules. |
| [2026.06.16.07.37.19.md](2026.06.16.07.37.19.md) | historical | Perplexity sandbox operating notes: Debian TTL/reset behavior, `SETUP.sh` toolchain (JDK 21, Babashka, Clojure CLI, clj-kondo, nbb, shadow-cljs), snapshot protocol. |

---

## Maintenance notes

- Empty/zero-byte stubs removed during consolidation: `2026.05.05.11.03.52.md`,
  `2026.05.08.13.48.10.md`, `2026.06.14.10.25.09.md`, `2026.06.16.07.37.18.md`,
  plus a stale Emacs lock symlink (`.#2026.06.16.07.13.42.md`).
- The `research-prompt/` subdirectory held byte-identical copies of the two
  `2025.11.04.*` tooling notes; the duplicates were removed and the top-level
  copies kept as canonical, then the empty directory was deleted.
- Note `2026.06.16.07.37.18.md` (now removed) was an empty sibling of the kept
  `2026.06.16.07.37.19.md`.
