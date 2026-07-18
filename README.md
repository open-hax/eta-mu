# eta-mu

Canonical eta-mu monorepo.

This repo absorbs the active eta-mu surfaces that were previously scattered across multiple repos and workspace paths, including the former `open-hax/openhax` monorepo. It is a **ClojureScript-first** pnpm workspace: the active code lives in CLJS packages, and the remaining TypeScript is legacy and being migrated.

## TypeScript Deprecation

**TypeScript is DEPRECATED. All new code must be ClojureScript.**



## Charter

- [`kanban/eta-mu-charter-v1.md`](kanban/eta-mu-charter-v1.md) — active working definition of eta-mu core, satellites, and the first living vault.

## Constitutional Layer

The canonical eta-mu-extensions package ([`packages/extensions`](packages/extensions/README.md), `@open-hax/eta-mu-extensions`) is the source of the constitutional layer for cybernetic governance. It declares 15 `:local` extensions in `manifest.edn`, including:

- **receipt-river** — append-only audit ledger for agent decisions
- **session-mycology** — per-turn retrospection with skill-spore incubation
- **contract-runtime** / **contract-runtime-v2** — operational contract fulfillment evaluation
- **opmf-contract-gate** — output-contract gate enforcement

These are the source of truth for the `.ημ` contract runtimes consumed by pi, opencode, and other agent frameworks; the `~/.ημ` directory is the runtime home (conventionally symlinked to this package's build output). CLJS sources are under `packages/extensions/src/eta_mu/extensions/`, macros under `packages/extensions/lib/eta_mu/macros/`, and targets build to `dist/{pi,opencode,runtime}/`.

```bash
pnpm -C packages/extensions build      # release build to dist/
pnpm -C packages/extensions watch      # dev
```

## Layout

### Active ClojureScript packages

- [`packages/axxium`](packages/axxium/README.md) — `@open-hax/axxium`: axiomatic identity/auth kernel. All-CLJS (shadow-cljs `:esm`/Node) Fastify + Postgres server providing password auth, JWT/cookie sessions, an actor read surface, and an entity read endpoint; intended shared identity provider for proxx/knoxx/openplanner.
- [`packages/chat-ui`](packages/chat-ui/README.md) — `@open-hax/chat-ui`: backend-agnostic Helix/React chat UI components (ChatPanel, MessageBubble, ChatComposer) and the `IChatSession` protocol with sol/knoxx/mock backends; consumed by Rheos via shadow-cljs source path.
- [`packages/contracts/output`](packages/contracts/output) — `@eta-mu/contracts-output`: CLJS output-contract gate (rewrite of `legacy/output-contract-gate`), shipped as a CLI binary and spawned by `eta-mu contracts output`.
- [`packages/eta-mu`](packages/eta-mu/README.md) — `eta-mu`: the global CLI entry point and sub-command router (bins `eta-mu` and `pi`), shadow-cljs `:node-script` bundling the turn-processor agent loop; `npm install -g eta-mu` is the intended install path. **This supersedes `packages/legacy/coding-agent` as the CLI.**
- [`packages/event-ledger`](packages/event-ledger/README.md) — `@promethean-os/event-ledger`: append-only MongoDB-backed CLJS event store (envelope schema, change-stream watchers, TTL config, REST adapter, legacy bridge).
- [`packages/extensions`](packages/extensions/README.md) — `@open-hax/eta-mu-extensions`: **canonical** eta-mu constitutional-layer extension runtimes (15 `:local` extensions) compiled to pi/opencode/runtime targets via shadow-cljs. See the Constitutional Layer section above.
- [`packages/e2e`](packages/e2e/README.md) — `@open-hax/eta-mu-e2e`: monorepo-wide end-to-end test harness for cross-package interactions (extension contracts, runtime ↔ coding integration, cross-package seams).
- [`packages/kanban-orchestrator`](packages/kanban-orchestrator/README.md) — `@open-hax/kanban-orchestrator`: kanban board orchestrator agent as contract data only (agent/role/capability/actor + `rheos-kanban` MCP-server EDN); loaded by a knoxx-style runtime, no build step.
- [`packages/katamorph`](packages/katamorph/README.md) — `@open-hax/katamorph`: contract/resource runtime ("data as interpreter") — manifest grammar, Malli schema registry, store protocol + memory/mongo registries, action interpreter, policy engine, and agent-turn utilities.
- [`packages/mcp-contracts`](packages/mcp-contracts/README.md) — `@open-hax/mcp-contracts`: generic CLJS loader that teaches a knoxx-style runtime to accept `:mcp-server` contracts (read from contract roots, returned as gateway server-config); source-only, consumed via source-path.
- [`packages/protocols`](packages/protocols/README.md) — `@promethean-os/openplanner-protocols`: cross-package CLJS protocol/schema definitions for OpenPlanner — canonical event-ledger envelope (Malli) plus EventAdmission/Session/Document/Graph/Translation/Label/User/Realtime defprotocols, with Mongo/REST/Socket.IO/EDN-file record implementations.
- [`packages/rheos`](packages/rheos/README.md) — `@eta-mu/rheos`: kanban board runtime + service shell. CLJS Fastify/React app (board UI, kanban HTTP/MCP API, FSM-enforced ledger-backed moves) shipping a `rheos` CLI.
- [`packages/sol`](packages/sol/README.md) — `@eta-mu/sol`: eta-mu CLJS agent runtime backend (Node 22 + shadow-cljs + Fastify control plane; `open-hax.sol.*`). Trimmed eta-mu successor of the Knoxx backend; OpenAI-compatible `/v1/*` + `/api/agent/*` + `/ws/stream`, Proxx-backed.
- [`packages/terminal-ui`](packages/terminal-ui) — `@eta-mu/terminal-ui`: CLJS terminal-UI package (rewrite home for `legacy/tui`); the visual counterpart to `turn-processor`, extraction in progress.
- [`packages/turn-processor`](packages/turn-processor) — `@eta-mu/turn-processor`: provider/UI-agnostic CLJS agent turn loop (event-emitting `run-loop`, sequential/parallel tool execution); consumed by the `eta-mu` CLI via shadow-cljs source path.

`packages/sol-staging` is the staging/source tree built via `packages/sol`'s shadow-cljs config (no `package.json` of its own). (The stale `packages/eta-mu-extensions` stub was removed 2026-07-10; the canonical extensions package is `packages/extensions`.)

### Legacy TypeScript packages (`packages/legacy/*`, DEPRECATED)

All of these are slated for CLJS rewrite; see the matching `docs/*-cljs-rewrite-inventory.md`.

- [`packages/legacy/agent`](packages/legacy/agent/README.md) — `@open-hax/eta-mu-agent-core`: stateful agent with tool execution + event streaming (rewrite → CLJS `eta_mu.agent.*`).
- [`packages/legacy/ai`](packages/legacy/ai/README.md) — `@open-hax/eta-mu-ai`: unified LLM API with model discovery + multi-provider config (rewrite target `packages/runtime` `eta_mu.ai.*`).
- [`packages/legacy/coding-agent`](packages/legacy/coding-agent/README.md) — `@open-hax/eta-mu-cli`: coding-agent CLI (bins `eta-mu`/`eta-mu-beta`/`pi`) with read/bash/edit/write tools + session management. **Superseded as the CLI by `packages/eta-mu`** (which owns the same bin names — do not global-install both); retained while the interactive/RPC mode rewrites land.
- [`packages/legacy/docs`](packages/legacy/docs/README.md) — `@open-hax/eta-mu-docs`: ημ docs-indexing library (view-graph substrate) emitting `ημ.docs-index.v1`/`ημ.docs-backlinks.v1` JSONL caches.
- [`packages/legacy/github`](packages/legacy/github/README.md) — `@open-hax/eta-mu-github`: Pi-based GitHub automation bot and PR/issue/mention review gate (octokit).
- [`packages/legacy/kanban`](packages/legacy/kanban/README.md) — `@open-hax/kanban-legacy`: markdown kanban library + `openhax-kanban` CLI (board snapshots, React web UI, Trello/GitHub sync); replaced by `packages/rheos` and the `eta-mu kanban` CLI.
- [`packages/legacy/output-contract-gate`](packages/legacy/output-contract-gate/README.md) — `@open-hax/output-contract-gate`: output-contract gate/validator (remark + edn-data) with an `output-contract-gate` CLI bin; still consumed at runtime by `packages/extensions` via `workspace:*`.
- [`packages/legacy/publication-components`](packages/legacy/publication-components/README.md) — `@open-hax/garden-publication-components`: React "Garden" publication component library (block renderer + music/playlist players, server-render + browser-hydration entrypoints).
- [`packages/legacy/tui`](packages/legacy/tui/README.md) — `@open-hax/eta-mu-tui`: terminal-UI library with differential rendering.

### Config / tooling packages

- [`packages/kondo-config`](packages/kondo-config/README.md) — `@open-hax/kondo-config`: shared clj-kondo config + custom promise-chain hook (`clj-kondo.exports`), consumed by CLJS packages via `:config-paths`.
- `packages/tsconfig` — `@eta-mu/tsconfig`: shared TypeScript base config (`base.json`) for the workspace; consumed by legacy TS packages.

### Clojure & runtime config (repo root)

- `deps.edn` — Clojure dependencies / aliases.
- `ecosystem.config.cjs` / `ecosystem.cljs` — PM2 ecosystem (JS config + CLJS source).

(There is no root `shadow-cljs.edn`; each CLJS package carries its own.)

## Local Commands

Run from the repo root. This is a pnpm workspace — **always use pnpm, never npm.**

```bash
pnpm install:all        # pnpm install across all workspace packages
pnpm build              # pnpm -r --no-bail build (all packages)
pnpm test               # runtime + github + docs + kanban-legacy test suites
pnpm typecheck          # typecheck the remaining TS packages
pnpm lint               # node scripts/lint.mjs
pnpm lint:kondo         # clj-kondo across all packages (--if-present)
pnpm dev                # watch the Rheos package
pnpm start              # start the Rheos package
pnpm hooks:install      # install the pre-commit TS-line-count guard
```

Targeted package work (use the real package names / paths):

```bash
pnpm -C packages/runtime cljs:verify      # compile + cljs-test + smoke + boundary
pnpm -C packages/sol build                # shadow-cljs compile server
pnpm -C packages/extensions build         # build constitutional-layer extensions
pnpm -C packages/rheos test               # rheos test suite
pnpm --filter @open-hax/axxium test       # by package name
```

Read `AGENTS.md` first for the mandatory ClojureScript conventions, CLJS construction/build order, and the Kanban/GitHub workflow rules that apply across the workspace.

## Documentation & Planning

- [`docs/`](docs) — architecture inventories, CLJS-rewrite plans, design notes, and per-package rewrite inventories.
- [`docs/notes/INDEX.md`](docs/notes/INDEX.md) — index of timestamped working notes.
- [`DEVELOPMENT.md`](DEVELOPMENT.md) — environment setup and per-package build/test/lint flows.
- [`kanban/`](kanban) — markdown kanban board (planning source of truth); cards sync to GitHub issues. See `AGENTS.md` for the sync workflow.
