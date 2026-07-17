# Development

This is a ClojureScript-first pnpm monorepo. Most packages compile with
shadow-cljs; the TypeScript under `packages/legacy/*` is **deprecated** and is
being rewritten to CLJS (see the `TypeScript Deprecation Policy` in
[`AGENTS.md`](./AGENTS.md)).

Before building or testing anything, read [`AGENTS.md`](./AGENTS.md) — it owns
the mandatory **Clojure construction order**, the `domain`/`infra`/`shape`/`law`
namespace layers, and the testing gate that all CLJS work follows.

## Prerequisites

- **Node** + **pnpm** (`packageManager: pnpm@10.14.0`; use `corepack enable`).
- A JVM (shadow-cljs and clj-kondo run on it).
- `clj-kondo` on `PATH` for `lint:kondo`.
- `bb` (Babashka) is optional — only `packages/rheos` ships a `bb.edn`.

## First-time setup

```bash
# Install all workspace dependencies
pnpm install
# (or `pnpm install:all`, which also runs a recursive install)

# Build every package (CLJS compile across the workspace)
pnpm build      # pnpm -r --no-bail build

# Run the workspace test suite
pnpm test
```

`pnpm test` at the root runs the suites wired into the root `package.json`
(`github`, `docs`, `kanban-legacy` — all legacy; `packages/runtime` was
dissolved 2026-07-17). Per-package CLJS suites are run with `--filter`
(see below).

## Day-to-day dev loop

```bash
# Start the default dev watcher (Rheos shadow-cljs watch, hot-reload)
pnpm dev        # pnpm --filter @open-hax/rheos watch

# Start the built Rheos server
pnpm start      # pnpm --filter @open-hax/rheos start
```

`pnpm dev` is an alias for the Rheos dev watcher. To iterate on any other
package, watch that package directly (next section).

## shadow-cljs workflow per package

Each CLJS package has its own `shadow-cljs.edn` with `build`, `watch`, and
`test` scripts. Target a package with `pnpm --filter <name>`:

```bash
# Watch + hot-reload a single package
pnpm --filter @open-hax/rheos watch
pnpm --filter @open-hax/sol watch

# Compile + run a package's test suite
pnpm --filter @open-hax/rheos test
pnpm --filter @open-hax/eta-mu-extensions test

# Lint a package with clj-kondo
pnpm --filter @open-hax/sol lint:kondo
```

Inside `packages/rheos` you can also use the Babashka tasks defined in its
`bb.edn`:

```bash
cd packages/rheos
bb watch    # shadow-cljs watch server-dev
bb test     # shadow-cljs compile test && node target/test.cjs
bb build    # shadow-cljs release server cli
```

`bb` tasks exist **only** for Rheos; for every other package use the
`pnpm --filter <name>` scripts.

## Targeting common packages

| Package | Filter name | Build | Watch / dev | Test |
|---------|-------------|-------|-------------|------|
| Rheos (Fastify + React app, `rheos` CLI) | `@open-hax/rheos` | `build` | `watch` | `test` |
| sol (Knoxx-derived backend control plane) | `@open-hax/sol` | `build` | `watch` | `test` |
| chat-ui (Reagent chat component lib) | `@open-hax/chat-ui` | `build` (lib) / `build:app` | `dev` | `test` |
| extensions (Pi/OpenCode contract runtimes) | `@eta-mu/extensions` | `build` | `watch` | `test` |
| event-ledger (append-only event store lib) | `@promethean-os/event-ledger` | `build` | `watch` | `test` |

Examples:

```bash
pnpm --filter @open-hax/chat-ui build          # compile the lib target
pnpm --filter @open-hax/chat-ui build:app      # compile the app target
pnpm --filter @open-hax/eta-mu-extensions build
pnpm --filter @promethean-os/event-ledger test
```

## Lint and typecheck

```bash
pnpm lint:kondo     # clj-kondo across all packages (--if-present)
pnpm typecheck      # tsc on the remaining TS facades (runtime, github, kanban-legacy)
```

clj-kondo, type checks, and tests must all pass with **zero warnings** — see the
`Zero Warnings` rule in [`AGENTS.md`](./AGENTS.md).

## Conventions

All ClojureScript construction order, namespace-layer rules (`domain` / `infra`
/ `shape` / `law`), `^:async` usage, and the testing gate live in
[`AGENTS.md`](./AGENTS.md). Read it before adding or rewriting a CLJS namespace.
