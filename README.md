# eta-mu

> **Roadmap:** [`ROADMAP.md`](ROADMAP.md) is the constellation hub — the seam,
> the ownership table, the sequencing rule, and the drift ledger. Every sibling
> repo carries a satellite `ROADMAP.md` summarising its own slice.

Canonical eta-mu monorepo.

This repo absorbs the active eta-mu surfaces that were previously scattered across multiple repos and workspace paths, including the former `open-hax/openhax` monorepo. It is a **ClojureScript-first** pnpm workspace: the active code lives in CLJS packages, and the remaining TypeScript is legacy and being migrated.

## TypeScript Deprecation

**TypeScript is DEPRECATED. All new code must be ClojureScript.**



## Charter

- [`kanban/eta-mu-charter-v1.md`](kanban/eta-mu-charter-v1.md) — active working definition of eta-mu core, satellites, and the first living vault.

## Operational Protocols and Extension Adapters

Eta-mu's operational protocols are owned by three sibling packages:

- [`packages/receipt-river`](packages/receipt-river/README.md) — `@eta-mu/receipt-river`
- [`packages/session-mycology`](packages/session-mycology/README.md) — `@eta-mu/session-mycology`
- [`packages/fork-tax`](packages/fork-tax/README.md) — `@eta-mu/fork-tax`

They own their records, schema registries, readers, writers, validators, and
domain projections. The unscoped [`eta-mu`](packages/eta-mu/README.md)
application composes their versions and delegates CLI commands; it does not
carry independent copies of their domain logic.

The eta-mu-extensions package
([`packages/extensions`](packages/extensions/README.md),
`@open-hax/eta-mu-extensions`) still supplies the runtime adapters for the
constitutional layer while migration proceeds. It declares 15 `:local`
extensions in `manifest.edn`, including:

- **receipt-river** — append-only audit ledger for agent decisions
- **session-mycology** — per-turn retrospection with skill-spore incubation
- **contract-runtime** / **contract-runtime-v2** — operational contract fulfillment evaluation
- **opmf-contract-gate** — output-contract gate enforcement

For Receipt River and Session Mycology, these extension implementations are
historical behavior sources and migration adapters, not schema authority.
They remain intact in this first extraction wave and will become thin
delegates after package API parity is complete. The `~/.ημ` directory is the
runtime home (conventionally symlinked to this package's build output). CLJS
sources are under `packages/extensions/src/eta_mu/extensions/`, macros under
`packages/extensions/lib/eta_mu/macros/`, and targets build to
`dist/{pi,opencode,runtime}/`.

```bash
pnpm -C packages/extensions build      # release build to dist/
pnpm -C packages/extensions watch      # dev
```

## Layout

### Active ClojureScript packages

- [`packages/axxium`](packages/axxium/README.md) — `@open-hax/axxium`: axiomatic identity/auth kernel. All-CLJS (shadow-cljs `:esm`/Node) Fastify + Postgres server providing password auth, JWT/cookie sessions, an actor read surface, and an entity read endpoint; intended shared identity provider for proxx/knoxx/openplanner.
- [`packages/contracts/output`](packages/contracts/output) — `@eta-mu/contracts-output`: CLJS output-contract gate (rewrite of `legacy/output-contract-gate`), shipped as a CLI binary and spawned by `eta-mu contracts output`.
- [`packages/eta-mu`](packages/eta-mu/README.md) — `eta-mu`: the global CLI entry point and sub-command router (bins `eta-mu` and `pi`), shadow-cljs `:node-script` bundling the turn-processor agent loop; `npm install -g eta-mu` is the intended install path. **This supersedes `packages/legacy/coding-agent` as the CLI.**
- [`packages/fork-tax`](packages/fork-tax/README.md) — `@eta-mu/fork-tax`: Fork Tax handoff plans, snapshot artifacts, owned/concurrent/blocked classifications, and versioned handoff events.
- [`packages/receipt-river`](packages/receipt-river/README.md) — `@eta-mu/receipt-river`: receipt event construction/validation, historical unversioned compatibility, and provider-independent local repository discovery.
- [`packages/session-mycology`](packages/session-mycology/README.md) — `@eta-mu/session-mycology`: session reflection and lesson events with explicit cross-protocol causal links.
- [`packages/event-ledger`](packages/event-ledger/README.md) — `@promethean-os/event-ledger`: append-only MongoDB-backed CLJS event store (envelope schema, change-stream watchers, TTL config, REST adapter, legacy bridge).
- [`packages/extensions`](packages/extensions/README.md) — `@open-hax/eta-mu-extensions`: **canonical** eta-mu constitutional-layer extension runtimes (15 `:local` extensions) compiled to pi/opencode/runtime targets via shadow-cljs. See the Constitutional Layer section above.
- [`packages/e2e`](packages/e2e/README.md) — `@open-hax/eta-mu-e2e`: monorepo-wide end-to-end test harness for cross-package interactions (extension contracts, runtime ↔ coding integration, cross-package seams).
- [`packages/mcp-contracts`](packages/mcp-contracts/README.md) — `@open-hax/mcp-contracts`: generic CLJS loader that teaches a knoxx-style runtime to accept `:mcp-server` contracts (read from contract roots, returned as gateway server-config); source-only, consumed via source-path.
- [`packages/protocols`](packages/protocols/README.md) — `@promethean-os/openplanner-protocols`: cross-package CLJS protocol/schema definitions for OpenPlanner — canonical event-ledger envelope (Malli) plus EventAdmission/Session/Document/Graph/Translation/Label/User/Realtime defprotocols, with Mongo/REST/Socket.IO/EDN-file record implementations.
- [`packages/terminal-ui`](packages/terminal-ui) — `@eta-mu/terminal-ui`: CLJS terminal-UI package (rewrite home for `legacy/tui`); the visual counterpart to `turn-processor`, extraction in progress.
- [`packages/turn-processor`](packages/turn-processor) — `@eta-mu/turn-processor`: provider/UI-agnostic CLJS agent turn loop (event-emitting `run-loop`, sequential/parallel tool execution); consumed by the `eta-mu` CLI via shadow-cljs source path.

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
