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
pnpm dev        # pnpm --filter @eta-mu/rheos watch

# Start the built Rheos server
pnpm start      # pnpm --filter @eta-mu/rheos start
```

`pnpm dev` is an alias for the Rheos dev watcher. To iterate on any other
package, watch that package directly (next section).

## Running the CLI: `eta-mu` vs `eta-mu-beta`

**`eta-mu` is not this repo.** It resolves through a volta shim to the *published*
npm build. That is deliberate — it keeps behaviour predictable in every other
repository on the machine — but it means the published binary and this working tree
can report the **same version** (`1.1.1`) while exposing **different commands**.
Source registers top-level `receipt`, `receipt-river`, `session`,
`session-mycology`, and `fork-tax`; the published build only has them under `git`.

**`eta-mu-beta` is this repo.** It is a global symlink to the local build:

```bash
# Rebuild after changing CLI sources — the symlink target is a build artifact
pnpm -C packages/eta-mu build

# eta-mu-beta then runs the current tree, from any working directory
eta-mu-beta help
eta-mu-beta receipt append decision "…"
```

The link, once per machine:

```bash
ln -sfn "$PWD/packages/eta-mu/dist-cli/index.cjs" \
        "$(pnpm bin --global)/eta-mu-beta"
```

Rules:

- **Never cite `eta-mu` output as evidence about this repo.** Use `eta-mu-beta`, or
  `node packages/eta-mu/dist-cli/index.cjs` directly. A stale binary does not error —
  it answers, incorrectly.
- **Rebuild before trusting `eta-mu-beta`.** `dist-cli/` is gitignored, so a fresh
  clone has no build and the symlink dangles.
- **Build only from the repo root's installed dependency tree.** `pnpm build` inside a
  git worktree with no `node_modules` exits `0` while emitting 163 `:undeclared-var`
  warnings on `await` and producing a `dist-cli` whose `receipt`, `session`, and
  `fork-tax` throw at runtime. The same build from the root emits zero warnings.
  Check the warning count, not just the exit code.
- **The link breaks if the repo moves.** It held an absolute path into `~/devel/orgs/`
  and silently dangled from the move until 2026-07-30. After relocating the
  workspace, re-run the `ln` above.

Tracked as `link-local-eta-mu-cli-for-development`.

## shadow-cljs workflow per package

Each CLJS package has its own `shadow-cljs.edn` with `build`, `watch`, and
`test` scripts. Target a package with `pnpm --filter <name>`:

```bash
# Watch + hot-reload a single package
pnpm --filter @eta-mu/rheos watch
pnpm --filter @eta-mu/sol watch

# Compile + run a package's test suite
pnpm --filter @eta-mu/rheos test
pnpm --filter @open-hax/eta-mu-extensions test

# Lint a package with clj-kondo
pnpm --filter @eta-mu/sol lint:kondo
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
| Rheos (Fastify + React app, `rheos` CLI) | `@eta-mu/rheos` | `build` | `watch` | `test` |
| sol (Knoxx-derived backend control plane) | `@eta-mu/sol` | `build` | `watch` | `test` |
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
