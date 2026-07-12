# Notes Index

Working notes captured during the eta-mu design process. Notes are now organized
into category directories by topic, with descriptive slug filenames and YAML
frontmatter. Timestamped filenames are preserved in each file's `original_name`
field.

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
| [dev/contract-dsl-capability-policy-schema.md](dev/contract-dsl-capability-policy-schema.md) | design intent | Capability vs. policy resolved: capability grants access (a bundle of tools); policy only narrows. Includes worked EDN for both. Promoted to [`../design/contract-model.md`](../design/contract-model.md). |
| [dev/contract-runtime-v2-schema-gaps.md](dev/contract-runtime-v2-schema-gaps.md) | design intent | Full Malli schema for the contract kinds (agent/policy/intent/fulfillment/trigger/role/capability), plus contract-tree resolution and id-collision rules ("first from current execution context wins"). |
| [dev/contract-intent-fulfillment-design.md](dev/contract-intent-fulfillment-design.md) | design intent | Intent contracts (pre-execution gate, inverse of fulfillment) and the case for deterministic — not just LLM-judge — fulfillment checks. |
| [research/knoxx-contract-reasoning-store-research.md](research/knoxx-contract-reasoning-store-research.md) | historical | Long Perplexity transcript reviewing the contract DSL direction (EDN-first, Malli, SCI evaluator, bracket-repair toolchain). Source material for the design-intent notes above. |
| [dev/prompt-contract-compiler-response-ast.md](dev/prompt-contract-compiler-response-ast.md) | design intent | Prompt-contract-as-source-language: a two-stage compiler (contract source → prompt + enforcement spec; response markdown → semantic AST) and parsing leading epistemic parentheticals `(己, p=…)` into claim data. |

## Agent model, orchestrator & kanban FSM

How agents are driven by the kanban board, the FSM that gates task transitions,
and the `.eta-mu/` ledger/state layout.

| Note | Status | Summary |
|------|--------|---------|
| [dev/eta-mu-agents-md-improvement-plan.md](dev/eta-mu-agents-md-improvement-plan.md) | design intent | Acceptance criteria for improving `AGENTS.md`/`PROCESS.md`: FSM blocks invalid board moves across all surfaces (file edit, CLI, MCP, hooks); per-package `AGENTS.md`; sol/knoxx coexistence; `extern` boundary rule. |
| [dev/katamorph-resources-fsm-contracts.md](dev/katamorph-resources-fsm-contracts.md) | design intent | `.eta-mu/` holds three kinds of things: resources, ledgers, state (projections). Kanban FSM as pure katamorph resources; drivers-as-resources (`:module`/`:driver`) as the bootstrap that makes katamorph a runtime. |
| [dev/eta-mu-kanban-agent-cli-draft.md](dev/eta-mu-kanban-agent-cli-draft.md) | design intent | Sketch of the (unimplemented) `eta-mu kanban agent` CLI: session registration, ledger-backed event/state EDN files, orchestrator self-assignment to tasks. |
| [dev/eta-mu-orchestrator-prompt-draft.md](dev/eta-mu-orchestrator-prompt-draft.md) | historical | Stub system prompt for the "Eta Mu" orchestrator persona (mostly empty outline). |

## Architecture & workspace model

Higher-level framing of how the workspace itself is composed.

| Note | Status | Summary |
|------|--------|---------|
| [design/eta-mu-worlds-projections-ledger-design.md](design/eta-mu-worlds-projections-ledger-design.md) | historical | "Worlds & projections" framing for managing many repos/submodules — a manifest-defined working set. Perplexity transcript; vocabulary exploration, not a committed design. |
| [design/eta-mu-init-experience-vision.md](design/eta-mu-init-experience-vision.md) | design intent | Vision script for `eta-mu init`: what the tool should *feel* like (event ledger, sentinel, fork tax, receipt river, session mycology, retrospective agent). Aspirational product narrative. |

## Tooling

CLJS development tooling references.

| Note | Status | Summary |
|------|--------|---------|
| [dev/cljs-dev-tooling-quick-picks.md](dev/cljs-dev-tooling-quick-picks.md) | historical | CLJS tooling survey: clojure-lsp, clj-kondo, cljfmt/zprint, Portal, re-frame-10x, shadow test targets. (Was duplicated under `research-prompt/`; that copy was removed and this is the canonical one.) |
| [dev/cljs-quality-tooling-survey.md](dev/cljs-quality-tooling-survey.md) | historical | Companion CLJS debugging/inspection list: Portal, re-frame-10x, re-frisk, FlowStorm, shadow Inspect UI, Dirac. (Formerly duplicated under `research-prompt/`.) |
| [dev/cljs-extension-loader-prototype.md](dev/cljs-extension-loader-prototype.md) | design intent | Reports implementation of on-demand `.cljs` extension compilation and loading with tests and a design spec. |
| [research/cljs-runtimes-compilers-overview.md](research/cljs-runtimes-compilers-overview.md) | research | Overview of ClojureScript compiler modes (JVM-hosted vs self-hosted) and JavaScript runtimes commonly used for testing. |

## Harness / prompt-engineering ops

Notes about running agents in specific harnesses, not about eta-mu's own design.

| Note | Status | Summary |
|------|--------|---------|
| [dev/compiler-of-intent-prompt-template.md](dev/compiler-of-intent-prompt-template.md) | historical | "Compiler of intent" prompt template (Clarified Intent / Copy-Ready Prompt / Possible Refinements) plus exploration rules. |
| [dev/perplexity-agent-sandbox-instructions.md](dev/perplexity-agent-sandbox-instructions.md) | historical | Perplexity sandbox operating notes: Debian TTL/reset behavior, `SETUP.sh` toolchain (JDK 21, Babashka, Clojure CLI, clj-kondo, nbb, shadow-cljs), snapshot protocol. |
| [dev/prompt-wizard-space-pr-spec.md](dev/prompt-wizard-space-pr-spec.md) | historical | Detailed PR specification for adding the Prompt Wizard Perplexity space with mode and state instruction files. |

## Keryx: OpenCode interpreter and declaration assembly

Design and implementation notes for Keryx, ημ's lawful herald that carries
declared capabilities, policies, and observations into OpenCode and other agent
harnesses. Broken down from the large `clojurescript runtimes_compilers.md`
Perplexity conversation export.

| Note | Status | Summary |
|------|--------|---------|
| [dev/opencode-plugins-cljs.md](dev/opencode-plugins-cljs.md) | design intent | How to write OpenCode plugins and tools almost entirely in ClojureScript, with thin JS shims only where the loader contract demands it. |
| [dev/agent-dsl-macros-composition.md](dev/agent-dsl-macros-composition.md) | design intent | `deftool`, `defhook`, `defplugin` macros and a Hiccup-style vector DSL for composing agent capabilities without one huge file. |
| [dev/opencode-edn-config.md](dev/opencode-edn-config.md) | design intent | `opencode.edn` as a project-side authoring layer that composes domain fragments and generates OpenCode JSON/plugin artifacts. |
| [dev/eta-mu-opencode-config-layout.md](dev/eta-mu-opencode-config-layout.md) | design intent | Placing OpenCode configuration under `.ημ/config/opencode/*.edn` so it is a projection of ημ data rather than a separate host-specific ecosystem. |
| [dev/emit-typescript-contracts.md](dev/emit-typescript-contracts.md) | design intent | Emitting TypeScript `.d.ts` declarations from ημ contract IR instead of parsing generated JavaScript or Closure JSDoc. |
| [dev/js-cljs-boundary-discipline.md](dev/js-cljs-boundary-discipline.md) | design intent | Architectural law that `domain.*`, `shape.*`, and `law.*` never see JS values; only `extern.*` and `boundary.*` may touch host objects. |
| [dev/dsl-data-interpreter-design.md](dev/dsl-data-interpreter-design.md) | design intent | Runtime model: decode → validate → interpret → validate → encode, with capabilities as the primitive and tools/routes/commands as exposures. |
| [design/keryx-package-proposal.md](design/keryx-package-proposal.md) | design intent | Proposal for a new `packages/opencode` workspace package proving the ημ interpreter architecture. |
| [design/opencode-first-agent-runtime.md](design/opencode-first-agent-runtime.md) | design intent | Reframing the package as an ημ Agent Runtime IR with OpenCode as the reference conformance target. |
| [design/keryx-naming-anti-runtime.md](design/keryx-naming-anti-runtime.md) | design intent | Replacing the generic `runtime` namespace with precise role namespaces under the `keryx` package. |
| [design/keryx-role-extern-boundary.md](design/keryx-role-extern-boundary.md) | design intent | Keryx as the lawful herald between ημ declarations and host harnesses; `extern` as the exclusive gate. |
| [design/keryx-kanban-task-breakdown.md](design/keryx-kanban-task-breakdown.md) | design intent | Proposed Keryx epic and incoming task cards following the repository `PROCESS.md`. |
| [other/keryx-task-pr-instructions.md](other/keryx-task-pr-instructions.md) | historical | Instructions for opening the Keryx kanban task PR. |

## Deep research tools

Design and implementation notes for a free-first, multi-provider deep-research
system for OpenCode. Broken down from the large `I want an opencode deep research
agent orchestrato.md` Perplexity conversation export.

| Note | Status | Summary |
|------|--------|---------|
| [design/deep-research-orchestrator-design.md](design/deep-research-orchestrator-design.md) | design intent | Multi-agent deep-research orchestrator design with specialized search agents and epistemological TDD. |
| [dev/opencode-agent-markdown-format.md](dev/opencode-agent-markdown-format.md) | design intent | Expressing the orchestrator and sub-agents as OpenCode markdown files with frontmatter. |
| [dev/opencode-custom-search-tools.md](dev/opencode-custom-search-tools.md) | design intent | OpenCode custom tools wrapping DuckDuckGo, arXiv, Reddit, and Bluesky search APIs. |
| [dev/npm-search-library-sandbox-testing.md](dev/npm-search-library-sandbox-testing.md) | historical | Sandbox npm install results and corrected library choices for the search tools. |
| [dev/duckduckgo-lite-reddit-mcp.md](dev/duckduckgo-lite-reddit-mcp.md) | design intent | Rolling a dependency-free DuckDuckGo Lite adapter and using a Reddit OAuth MCP server. |
| [design/search-broker-design.md](design/search-broker-design.md) | design intent | Provider-agnostic search broker with health checks, circuit breakers, and normalized results. |
| [design/free-first-search-strategy.md](design/free-first-search-strategy.md) | design intent | Free/self-hosted-first search strategy with SearXNG as primary and DuckDuckGo Lite as fallback. |
| [dev/opencode-free-research-tools-impl.md](dev/opencode-free-research-tools-impl.md) | design intent | Concrete OpenCode package layout: SearXNG compose, broker tool, search-doctor tool, and web-research agent. |
| [dev/free-research-tools-package.md](dev/free-research-tools-package.md) | design intent | Same package implementation details as the prior section; kept as a distinct conversation turn. |
| [dev/free-research-broker-domain-tests.md](dev/free-research-broker-domain-tests.md) | design intent | PR-ready isolated domain tests for the free-first search broker with no OpenCode or network dependencies. |
| [other/free-research-broker-pr-instructions.md](other/free-research-broker-pr-instructions.md) | historical | Instructions for preparing the free research broker PR. |
| [other/free-research-broker-github-pr.md](other/free-research-broker-github-pr.md) | historical | Instructions for opening the GitHub PR from the local branch. |

---

## Maintenance notes

- All 17 timestamped notes were moved into category directories with slug
  filenames and YAML frontmatter on 2026-07-10.
- The two large named Perplexity conversation exports were broken down into
  focused topic files:
  - `clojurescript runtimes_compilers.md` → 14 files in `research/`, `dev/`,
    `design/`, and `other/`.
  - `I want an opencode deep research agent orchestrato.md` → 12 files in
    `design/`, `dev/`, and `other/`.
- Empty category directories (`empty/`, `infrastructure/`) are reserved for
  future notes; no files were placed there in this pass.
