# eta-mu

Canonical eta-mu monorepo.

This repo absorbs the active eta-mu surfaces that were previously scattered across multiple repos and workspace paths, including the former `open-hax/openhax` monorepo. It is a **ClojureScript-first** pnpm workspace: the active code lives in CLJS packages, and the remaining TypeScript is legacy and being migrated.

## TypeScript Deprecation

**TypeScript is DEPRECATED. All new code must be ClojureScript.**

A pre-commit hook (`scripts/pre-commit-ts-guard.sh`, installed via `pnpm hooks:install`) enforces that the total TypeScript line count never increases. All remaining TypeScript lives under `packages/legacy/` and is being ported to CLJS over time; each legacy package has a `*-cljs-rewrite-inventory.md` doc under `docs/` tracking its port.

Current inventory: ~174,500 lines of TypeScript (run `pnpm ts:count`, or `pnpm ts:count:global` / `pnpm ts:count:json`).

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
- [`packages/event-ledger`](packages/event-ledger/README.md) — `@promethean-os/event-ledger`: append-only MongoDB-backed CLJS event store (envelope schema, change-stream watchers, TTL config, REST adapter, legacy bridge).
- [`packages/extensions`](packages/extensions/README.md) — `@open-hax/eta-mu-extensions`: **canonical** eta-mu constitutional-layer extension runtimes (15 `:local` extensions) compiled to pi/opencode/runtime targets via shadow-cljs. See the Constitutional Layer section above.
- [`packages/extensions-e2e`](packages/extensions-e2e/README.md) — `@open-hax/eta-mu-extensions-e2e`: shadow-cljs `:node-test` harness exercising contract-runtime-v2 policy/fulfillment flows against the canonical `packages/extensions` source.
- [`packages/kanban-orchestrator`](packages/kanban-orchestrator/README.md) — `@open-hax/kanban-orchestrator`: kanban board orchestrator agent as contract data only (agent/role/capability/actor + `rheos-kanban` MCP-server EDN); loaded by a knoxx-style runtime, no build step.
- [`packages/katamorph`](packages/katamorph/README.md) — `@open-hax/katamorph`: contract/resource runtime ("data as interpreter") — manifest grammar, Malli schema registry, store protocol + memory/mongo registries, action interpreter, policy engine, and agent-turn utilities.
- [`packages/mcp-contracts`](packages/mcp-contracts/README.md) — `@open-hax/mcp-contracts`: generic CLJS loader that teaches a knoxx-style runtime to accept `:mcp-server` contracts (read from contract roots, returned as gateway server-config); source-only, consumed via source-path.
- [`packages/protocols`](packages/protocols/README.md) — `@promethean-os/openplanner-protocols`: cross-package CLJS protocol/schema definitions for OpenPlanner — canonical event-ledger envelope (Malli) plus EventAdmission/Session/Document/Graph/Translation/Label/User/Realtime defprotocols, with Mongo/REST/Socket.IO/EDN-file record implementations.
- [`packages/Rheos`](packages/Rheos/README.md) — `@open-hax/rheos`: kanban board runtime + service shell. CLJS Fastify/React app (board UI, kanban HTTP/MCP API, FSM-enforced ledger-backed moves) shipping a `rheos` CLI.
- [`packages/runtime`](packages/runtime/README.md) — `@open-hax/eta-mu-runtime`: typed movement kernel for the eta-mu control plane (belief state, panel selection, auditable action envelopes); shadow-cljs + TS-facade library hosting the CLJS rewrite of the `runtime`, `ai`, `coding`, `docs`, `garden`, and `gate` domains. Library only — there is no `services/eta-mu` runtime.
- [`packages/sol`](packages/sol/README.md) — `@open-hax/sol`: eta-mu CLJS agent runtime backend (Node 22 + shadow-cljs + Fastify control plane; `open-hax.sol.*`). Trimmed eta-mu successor of the Knoxx backend; OpenAI-compatible `/v1/*` + `/api/agent/*` + `/ws/stream`, Proxx-backed.

`packages/sol-staging` is the staging/source tree built via `packages/sol`'s shadow-cljs config (no `package.json` of its own). `packages/eta-mu-extensions` is a stale stub superseded by `packages/extensions` and is flagged for removal — do not add to it.

### Legacy TypeScript packages (`packages/legacy/*`, DEPRECATED)

All of these are slated for CLJS rewrite; see the matching `docs/*-cljs-rewrite-inventory.md`.

- [`packages/legacy/agent`](packages/legacy/agent/README.md) — `@open-hax/eta-mu-agent-core`: stateful agent with tool execution + event streaming (rewrite → CLJS `eta_mu.agent.*`).
- [`packages/legacy/ai`](packages/legacy/ai/README.md) — `@open-hax/eta-mu-ai`: unified LLM API with model discovery + multi-provider config (rewrite target `packages/runtime` `eta_mu.ai.*`).
- [`packages/legacy/coding-agent`](packages/legacy/coding-agent/README.md) — `@open-hax/eta-mu-cli`: coding-agent CLI (bins `eta-mu`/`eta-mu-beta`/`pi`) with read/bash/edit/write tools + session management. Still the CLI/test target referenced by `AGENTS.md`.
- [`packages/legacy/docs`](packages/legacy/docs/README.md) — `@open-hax/eta-mu-docs`: ημ docs-indexing library (view-graph substrate) emitting `ημ.docs-index.v1`/`ημ.docs-backlinks.v1` JSONL caches.
- [`packages/legacy/github`](packages/legacy/github/README.md) — `@open-hax/eta-mu-github`: Pi-based GitHub automation bot and PR/issue/mention review gate (octokit).
- [`packages/legacy/kanban`](packages/legacy/kanban/README.md) — `@open-hax/kanban-legacy`: markdown kanban library + `openhax-kanban` CLI (board snapshots, React web UI, Trello/GitHub sync); replaced by `packages/Rheos` and the `eta-mu kanban` CLI.
- [`packages/legacy/output-contract-gate`](packages/legacy/output-contract-gate/README.md) — `@open-hax/output-contract-gate`: output-contract gate/validator (remark + edn-data) with an `output-contract-gate` CLI bin; still consumed at runtime by `packages/extensions` via `workspace:*`.
- [`packages/legacy/publication-components`](packages/legacy/publication-components/README.md) — `@open-hax/garden-publication-components`: React "Garden" publication component library (block renderer + music/playlist players, server-render + browser-hydration entrypoints).
- [`packages/legacy/tui`](packages/legacy/tui/README.md) — `@open-hax/eta-mu-tui`: terminal-UI library with differential rendering.

### Config / tooling packages

- [`packages/kondo-config`](packages/kondo-config/README.md) — `@open-hax/kondo-config`: shared clj-kondo config + custom promise-chain hook (`clj-kondo.exports`), consumed by CLJS packages via `:config-paths`.
- `packages/tsconfig` — `@eta-mu/tsconfig`: shared TypeScript base config (`base.json`) for the workspace; consumed by legacy TS packages.

### Clojure & runtime config (repo root)

- `deps.edn` — Clojure dependencies / aliases.
- `shadow-cljs.edn` — workspace-level ClojureScript build config.
- `ecosystem.config.cjs` / `ecosystem.cljs` — PM2 ecosystem (JS config + CLJS source).

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
pnpm ts:count           # TypeScript line-count guard inventory
pnpm hooks:install      # install the pre-commit TS-line-count guard
```

Targeted package work (use the real package names / paths):

```bash
pnpm -C packages/runtime cljs:verify      # compile + cljs-test + smoke + boundary
pnpm -C packages/sol build                # shadow-cljs compile server
pnpm -C packages/extensions build         # build constitutional-layer extensions
pnpm -C packages/Rheos test               # rheos test suite
pnpm --filter @open-hax/axxium test       # by package name
```

Read `AGENTS.md` first for the mandatory ClojureScript conventions, CLJS construction/build order, and the Kanban/GitHub workflow rules that apply across the workspace.

## Documentation & Planning

- [`docs/`](docs) — architecture inventories, CLJS-rewrite plans, design notes, and per-package rewrite inventories.
- [`docs/notes/INDEX.md`](docs/notes/INDEX.md) — index of timestamped working notes.
- [`DEVELOPMENT.md`](DEVELOPMENT.md) — environment setup and per-package build/test/lint flows.
- [`kanban/`](kanban) — markdown kanban board (planning source of truth); cards sync to GitHub issues. See `AGENTS.md` for the sync workflow.
