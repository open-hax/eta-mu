# Notes Index

Working notes captured during the eta-mu design process. Each note was originally
timestamped (`YYYY.MM.DD.HH.MM.SS.md`) and has been moved into a category
directory with a descriptive slug filename and YAML frontmatter.

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
| [capability-vs-policy-actor-model.md](design/capability-vs-policy-actor-model.md) | design intent | Capability vs. policy resolved: capability grants access (a bundle of tools); policy only narrows. Includes worked EDN for both. Promoted to [`../design/contract-model.md`](../design/contract-model.md). |
| [contract-runtime-malli-schema.md](design/contract-runtime-malli-schema.md) | design intent | Full Malli schema for the contract kinds (agent/policy/intent/fulfillment/trigger/role/capability), plus contract-tree resolution and id-collision rules ("first from current execution context wins"). |
| [intent-contracts-and-deterministic-fulfillment.md](design/intent-contracts-and-deterministic-fulfillment.md) | design intent | Intent contracts (pre-execution gate, inverse of fulfillment) and the case for deterministic — not just LLM-judge — fulfillment checks. |
| [contract-dsl-review-transcript.md](research/contract-dsl-review-transcript.md) | historical | Long Perplexity transcript reviewing the contract DSL direction (EDN-first, Malli, SCI evaluator, bracket-repair toolchain). Source material for the design-intent notes above. |
| [prompt-contract-source-language.md](design/prompt-contract-source-language.md) | design intent | Prompt-contract-as-source-language: a two-stage compiler (contract source → prompt + enforcement spec; response markdown → semantic AST) and parsing leading epistemic parentheticals `(己, p=…)` into claim data. |
| [cljs-extension-loader-prototype.md](design/cljs-extension-loader-prototype.md) | design intent | Working prototype notes for loading `.cljs` user extensions directly ("just work" in Node.js/dev mode) — companion to [`../design/user-clojurescript-extensions.md`](../design/user-clojurescript-extensions.md). |

## Agent model, orchestrator & kanban FSM

How agents are driven by the kanban board, the FSM that gates task transitions,
and the `.eta-mu/` ledger/state layout.

| Note | Status | Summary |
|------|--------|---------|
| [agents-process-improvement-spec.md](design/agents-process-improvement-spec.md) | design intent | Acceptance criteria for improving `AGENTS.md`/`PROCESS.md`: FSM blocks invalid board moves across all surfaces (file edit, CLI, MCP, hooks); per-package `AGENTS.md`; sol/knoxx coexistence; `extern` boundary rule. |
| [eta-mu-resources-ledgers-state.md](design/eta-mu-resources-ledgers-state.md) | design intent | `.eta-mu/` holds three kinds of things: resources, ledgers, state (projections). Kanban FSM as pure katamorph resources; drivers-as-resources (`:module`/`:driver`) as the bootstrap that makes katamorph a runtime. |
| [eta-mu-kanban-agent-cli-sketch.md](design/eta-mu-kanban-agent-cli-sketch.md) | design intent | Sketch of the (unimplemented) `eta-mu kanban agent` CLI: session registration, ledger-backed event/state EDN files, orchestrator self-assignment to tasks. |
| [eta-mu-orchestrator-persona-stub.md](other/eta-mu-orchestrator-persona-stub.md) | historical | Stub system prompt for the "Eta Mu" orchestrator persona (mostly empty outline). |

## Architecture & workspace model

Higher-level framing of how the workspace itself is composed.

| Note | Status | Summary |
|------|--------|---------|
| [worlds-and-projections-framing.md](research/worlds-and-projections-framing.md) | historical | "Worlds & projections" framing for managing many repos/submodules — a manifest-defined working set. Perplexity transcript; vocabulary exploration, not a committed design. |
| [eta-mu-init-vision-script.md](design/eta-mu-init-vision-script.md) | design intent | Vision script for `eta-mu init`: what the tool should *feel* like (event ledger, sentinel, fork tax, receipt river, session mycology, retrospective agent). Aspirational product narrative. |

## Tooling

CLJS development tooling references.

| Note | Status | Summary |
|------|--------|---------|
| [cljs-tooling-survey.md](dev/cljs-tooling-survey.md) | historical | CLJS tooling survey: clojure-lsp, clj-kondo, cljfmt/zprint, Portal, re-frame-10x, shadow test targets. (Was duplicated under `research-prompt/`; that copy was removed and this is the canonical one.) |
| [cljs-debugging-inspection-tools.md](dev/cljs-debugging-inspection-tools.md) | historical | Companion CLJS debugging/inspection list: Portal, re-frame-10x, re-frisk, FlowStorm, shadow Inspect UI, Dirac. (Formerly duplicated under `research-prompt/`.) |

## Harness / prompt-engineering ops

Notes about running agents in specific harnesses, not about eta-mu's own design.

| Note | Status | Summary |
|------|--------|---------|
| [compiler-of-intent-prompt-template.md](other/compiler-of-intent-prompt-template.md) | historical | "Compiler of intent" prompt template (Clarified Intent / Copy-Ready Prompt / Possible Refinements) plus exploration rules. |
| [perplexity-sandbox-operating-notes.md](other/perplexity-sandbox-operating-notes.md) | historical | Perplexity sandbox operating notes: Debian TTL/reset behavior, `SETUP.sh` toolchain (JDK 21, Babashka, Clojure CLI, clj-kondo, nbb, shadow-cljs), snapshot protocol. |
| [prompt-wizard-pr-agent-prompt.md](other/prompt-wizard-pr-agent-prompt.md) | historical | **Misfiled?** Agent prompt for an unrelated repo (`riatzukiza/perplexity_spaces_memory_protocol` Prompt Wizard PR) — not eta-mu design; candidate to move out of `docs/notes/`. |

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
