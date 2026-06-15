---
uuid: "shared-kondo-config-install"
title: "Shared clj-kondo config package installation"
status: "done"
priority: P1
labels: ["epics", "lint", "clj-kondo", "infra", "14sp"]
created_at: "2026-06-15T00:00:00Z"
source: "user-request:2026-06-15"
points: 14
category: epics
---

# Shared clj-kondo config package installation

> Source: user request, 2026-06-15
> Board source: `orgs/open-hax/eta-mu/kanban/`
> Process: one PR per child task, OpenCode PR review required, CodeRabbit automatic review observed but not manually spammed
> Points: 14

## Purpose

Create a single shared clj-kondo configuration package instead of duplicating `:lint-as`, `:linters`, `:unresolved-namespace`, and `:hooks` rules across every ClojureScript package. The baseline inventory in `docs/kondo-config-baseline.md` confirms eleven CLJS packages to wire: Rheos, axxium, chat-ui, event-ledger, extensions, extensions-e2e, katamorph, mcp-contracts, protocols, runtime, and sol.

A shared package makes the promise-chain / async-workflow rules a first-class dependency. Local `.clj-kondo/config.edn` files stay thin: they declare `:config-paths` to the shared export and preserve only package-local overrides (e.g., sol's `defroute` hook, event-ledger/protocols `(malli.core/=>)` exclusions).

## Architecture

```text
packages/kondo-config/
├── package.json
└── clj-kondo.exports/
    └── open-hax/
        └── kondo-config/
            ├── config.edn
            └── hooks/
                └── promise_chain.clj
```

- `clj-kondo.exports/open-hax/kondo-config/` is the exported config root. clj-kondo discovers it through `:config-paths` when the package is on the classpath (pnpm workspace link).
- `config.edn` contains all shared rules:
  - `:lint-as` for `shadow.cljs.modern/js-await` and `js-await*`.
  - `:linters` for `:promise-chain/prefer-async-workflow`, `:fn-length/*`, `:file-length/*`, `:complexity/*`, `:discouraged-var` for `js-await`, and `:unresolved-symbol` exclusions for common JS globals.
  - `:unresolved-namespace {:exclude [js]}`.
  - `:hooks` for promise-chain analysis on `cljs.core/ns`, `->`, `->>`, `do`, `let`, `when`, `when-let`, `if`, `defn`, `defn-`.
- `hooks/promise_chain.clj` implements the shared promise-chain analyzer.
- **No `defroute` hook** is included — that is knoxx/backend-specific and stays in `packages/sol/.clj-kondo`.
- **`imports/` stays local** to each consumer package. The shared config is read-only infrastructure; per-package `imports/` directories are created/managed locally if needed by clj-kondo and are never committed to `packages/kondo-config`.

### `:config-paths` wiring pattern

Each CLJS package gets a `.clj-kondo/config.edn` similar to:

```edn
{:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]
 ;; package-local overrides only
 }

```

Relative paths are computed from `packages/<name>/.clj-kondo/config.edn` → `packages/kondo-config/...`.

## Process constraints

- One PR per child task.
- Work from clean task worktrees branched from current `origin/main`.
- Keep path-scoped staging; do not stage root or nested `receipts.edn` unless the PR explicitly owns receipts.
- Keep package names, binaries, extension names, and public exports stable.
- OpenCode PR code review is required before merge.
- CodeRabbit runs automatically; do not manually request review after every push. If automatic reruns are quota/usage-credit blocked after fixes, document addressed findings in a PR comment and proceed only when branch protection, CI, and OpenCode are green.

## Child tasks

1. `kanban/tasks/shared-kondo-config-create-package.md`
   - Create `packages/kondo-config/`, write `package.json`, write the shared `config.edn`, copy the `promise_chain.clj` hook. Wire `pnpm-workspace.yaml` if needed.

2. `kanban/tasks/shared-kondo-config-wire-Rheos.md`
   - Add `:config-paths` to `packages/Rheos/.clj-kondo/config.edn`; remove duplicated shared entries; add `lint:kondo` script to `package.json`.

3. `kanban/tasks/shared-kondo-config-wire-axxium.md`
   - Create `.clj-kondo/config.edn` with `:config-paths`; add `lint:kondo` script to `package.json`.

4. `kanban/tasks/shared-kondo-config-wire-chat-ui.md`
   - Create `.clj-kondo/config.edn` with `:config-paths`; add `lint:kondo` script to `package.json`.

5. `kanban/tasks/shared-kondo-config-wire-event-ledger.md`
   - Merge `:config-paths` into `.clj-kondo/config.edn`; preserve `(malli.core/=>)` exclusion; remove duplicated shared entries; add `lint:kondo` script to `package.json`.

6. `kanban/tasks/shared-kondo-config-wire-extensions.md`
   - Create `.clj-kondo/config.edn` with `:config-paths`; lint `src` and `lib`; add `lint:kondo` script to `package.json`.

7. `kanban/tasks/shared-kondo-config-wire-extensions-e2e.md`
   - Create `.clj-kondo/config.edn` with `:config-paths`; add `lint:kondo` script to `package.json`.

8. `kanban/tasks/shared-kondo-config-wire-katamorph.md`
   - Create `.clj-kondo/config.edn` with `:config-paths`; lint `src/cljs` and `test/cljs`; add `lint:kondo` script to `package.json`.

9. `kanban/tasks/shared-kondo-config-wire-mcp-contracts.md`
   - Create `.clj-kondo/config.edn` with `:config-paths`; lint `src`; add `lint:kondo` script to `package.json`.

10. `kanban/tasks/shared-kondo-config-wire-protocols.md`
    - Merge `:config-paths` into `.clj-kondo/config.edn`; preserve `(malli.core/=>)` exclusion; remove duplicated shared entries; add `lint:kondo` script to `package.json`.

11. `kanban/tasks/shared-kondo-config-wire-runtime.md`
    - Create `.clj-kondo/config.edn` with `:config-paths`; lint `src/cljs` and `test/cljs`; add `lint:kondo` script to `package.json`.

12. `kanban/tasks/shared-kondo-config-wire-sol.md`
    - Merge `:config-paths` into `.clj-kondo/config.edn`; preserve the package-local `knoxx.backend.macros/defroute` hook and its `hooks/defroute.clj` file; remove duplicated shared entries; add `lint:kondo` script to `package.json`.

## Acceptance criteria

- [ ] `packages/kondo-config/` exists with valid `package.json` and exported `config.edn` + `hooks/promise_chain.clj`.
- [ ] `clj-kondo --lint` resolves `hooks.promise-chain` from the export path with zero config errors.
- [ ] Rheos `.clj-kondo/config.edn` uses `:config-paths` and `pnpm --filter @open-hax/kanban-cljs lint:kondo` runs without config-resolution errors.
- [ ] axxium `.clj-kondo/config.edn` uses `:config-paths` and `pnpm --filter @open-hax/axxium lint:kondo` runs without config-resolution errors.
- [ ] chat-ui `.clj-kondo/config.edn` uses `:config-paths` and `pnpm --filter @open-hax/chat-ui lint:kondo` runs without config-resolution errors.
- [ ] event-ledger `.clj-kondo/config.edn` uses `:config-paths`, preserves `(malli.core/=>)` exclusion, and `pnpm --filter @promethean-os/event-ledger lint:kondo` runs without config-resolution errors.
- [ ] extensions `.clj-kondo/config.edn` uses `:config-paths` and `pnpm --filter @open-hax/eta-mu-extensions lint:kondo` runs without config-resolution errors.
- [ ] extensions-e2e `.clj-kondo/config.edn` uses `:config-paths` and `pnpm --filter @open-hax/eta-mu-extensions-e2e lint:kondo` runs without config-resolution errors.
- [ ] katamorph `.clj-kondo/config.edn` uses `:config-paths` and `pnpm --filter @open-hax/katamorph lint:kondo` runs without config-resolution errors.
- [ ] mcp-contracts `.clj-kondo/config.edn` uses `:config-paths` and `pnpm --filter @open-hax/mcp-contracts lint:kondo` runs without config-resolution errors.
- [ ] protocols `.clj-kondo/config.edn` uses `:config-paths`, preserves `(malli.core/=>)` exclusion, and `pnpm --filter @promethean-os/openplanner-protocols lint:kondo` runs without config-resolution errors.
- [ ] runtime `.clj-kondo/config.edn` uses `:config-paths` and `pnpm --filter @open-hax/eta-mu-runtime lint:kondo` runs without config-resolution errors.
- [ ] sol `.clj-kondo/config.edn` uses `:config-paths`, preserves the local `defroute` hook, and `pnpm --filter @open-hax/sol lint:kondo` runs without config-resolution errors.
- [ ] Root `package.json` has an aggregate `lint:kondo` script that runs every wired CLJS package.
- [ ] No `imports/` directory is added to `packages/kondo-config`.
- [ ] No source file in any pre-existing CLJS package is modified (only `.clj-kondo/config.edn` and `package.json` scripts).

## Verification map

Per-package:

```bash
pnpm --filter @open-hax/kanban-cljs lint:kondo
pnpm --filter @open-hax/axxium lint:kondo
pnpm --filter @open-hax/chat-ui lint:kondo
pnpm --filter @promethean-os/event-ledger lint:kondo
pnpm --filter @open-hax/eta-mu-extensions lint:kondo
pnpm --filter @open-hax/eta-mu-extensions-e2e lint:kondo
pnpm --filter @open-hax/katamorph lint:kondo
pnpm --filter @open-hax/mcp-contracts lint:kondo
pnpm --filter @promethean-os/openplanner-protocols lint:kondo
pnpm --filter @open-hax/eta-mu-runtime lint:kondo
pnpm --filter @open-hax/sol lint:kondo
```

Aggregate:

```bash
pnpm lint:kondo
```

This epic does **not** require a clean lint run (warnings/errors are expected). It only requires that the shared config resolves and that `lint:kondo` exits without config-resolution errors.

## Known starting signals

- `docs/kondo-config-baseline.md` lists the eleven CLJS packages, their existing `.clj-kondo/config.edn` state, and package-local overrides that must survive.
- `event-ledger`, `protocols`, and `sol` already have the shared promise-chain hooks duplicated locally; the wire tasks must deduplicate them.
- `Rheos`, `axxium`, `chat-ui`, `extensions`, `extensions-e2e`, `katamorph`, `mcp-contracts`, and `runtime` have no existing `.clj-kondo/config.edn`.
- `legacy`, `kanban-orchestrator`, `tsconfig`, and `sol-staging` are not wired in this epic.

---
## QA Review / implementation summary (2026-06-15)

All 12 child tasks dispatched and completed. Review found and corrected three issues that the initial agent pass left unresolved:

1. **Shared hook used `{:findings [...]}` return value, which clj-kondo ignores.** Rewrote `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/hooks/promise_chain.clj` to use `api/reg-finding!`. The hook now flags `.then`/`.catch`/`.finally` promise chains and skips functions whose bodies contain bare `await` (heuristic for `^:async` CLJS functions, since clj-kondo strips `^:async` metadata from the AST).
2. **`.gitignore` ignored all `.clj-kondo/` directories.** Replaced `**/.clj-kondo/` with `**/.clj-kondo/.cache` and `**/.clj-kondo/imports`, then force-added every new `.clj-kondo/config.edn` and deleted stale local `hooks/promise_chain.clj` and `imports/` trees.
3. **Shared `:hooks` keys were unqualified (`defn`, `->`, etc.).** Changed to fully-qualified `cljs.core/...` forms so they attach to ClojureScript source. Also expanded `:unresolved-symbol` exclusions to the full common JS globals set plus `await`.

### Per-package verification

| Package | Scope | Errors | Warnings | Config resolution |
|---------|-------|--------|----------|-------------------|
| Rheos | `@open-hax/kanban-cljs` | 39 | 23 | OK |
| axxium | `@open-hax/axxium` | 0 | 47 | OK |
| chat-ui | `@open-hax/chat-ui` | 13 | 7 | OK |
| event-ledger | `@promethean-os/event-ledger` | 0 | 0 | OK |
| extensions | `@open-hax/eta-mu-extensions` | 18 | 172 | OK |
| extensions-e2e | `@open-hax/eta-mu-extensions-e2e` | 0 | 2 | OK |
| katamorph | `@open-hax/katamorph` | 0 | 22 | OK |
| mcp-contracts | `@open-hax/mcp-contracts` | 0 | 0 | OK |
| protocols | `@promethean-os/openplanner-protocols` | 0 | 12 | OK |
| runtime | `@open-hax/eta-mu-runtime` | 0 | 46 | OK |
| sol | `@open-hax/sol` | 4 | 23 | OK |

All wired packages resolve the shared config with zero config-resolution errors. Remaining source findings are owned by `kanban/epics/kondo-lint-cleanup.md`.

### Child task status

All 12 Epic 1 child tasks are `status: done`.

