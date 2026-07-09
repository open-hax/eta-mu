---
uuid: "eta-mu-base-cli-package"
title: "Eta-mu Base CLI Package"
status: "done"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "cli", "eta-mu", "5sp"]
created_at: "2026-07-08T23:45:00Z"
source: "kanban/tasks/legacy-package-reorganization.md"
points: 5
category: "tasks"
---

# Eta-mu Base CLI Package

> Parent: `kanban/tasks/legacy-package-reorganization.md`
> Spec: `docs/design/eta-mu-base-cli-router.md`

## Purpose

Create `packages/eta-mu` as the new global `eta-mu` / `pi` CLI entry point and sub-command router. The legacy `@open-hax/eta-mu-cli` package in `packages/legacy/coding-agent` will be emptied once this package can host the TUI agent; until then, `packages/eta-mu` is a thin router that delegates to the legacy agent for the default `eta-mu` invocation.

## Scope

- Law: command/sub-command registry contracts (`law.command`).
- Shape: small argument parsing helpers shared by commands (`shape.args`).
- Extern: Node process, child-process, fs, path, and git boundaries (`extern.process`, `extern.child-process`, `extern.fs`, `extern.path`, `extern.git`).
- Domain: pure routing decisions, receipt-river logic, and fork-tax logic (`domain.router`, `domain.receipt`, `domain.fork-tax`).
- Infra: CLI entry point, command handlers, and delegation (`infra.cli.main`, `infra.cli.router`, `infra.cli.commands.*`).
- Built-in commands: `--version`, `--help`, `agent` (default), `kanban`, `git` (group with `fork-tax`, `receipt`, `session`), `contracts` (group), `doctor`.
- Test the router, delegate commands, and pure domain logic.

## Work items

- [x] Design sub-command router framework (`docs/design/eta-mu-base-cli-router.md`).
- [x] Create `packages/eta-mu` package, shadow-cljs build, and `.clj-kondo` config.
- [x] Implement `law.command` command contract.
- [x] Implement `infra.cli.router` dispatch and help generation.
- [x] Implement default `agent` command using the ClojureScript turn-processor, OpenAI client, and interactive REPL.
- [x] Implement `kanban` command (delegate to `@open-hax/rheos`).
- [x] Implement `contracts output` command (delegate to `@eta-mu/contracts-output` binary).
- [x] Implement `git` command group with real `fork-tax`, `receipt`, and `session` subcommands.
- [x] Add `doctor` command for workspace health checks.
- [x] Add `extern.git`, `extern.fs`, and `extern.path` boundaries.
- [x] Add `domain.receipt` and `domain.fork-tax` pure logic.
- [x] Add tests for `domain.receipt`, `domain.fork-tax`, and the router.
- [x] Add `@eta-mu/contracts-output` as a dependency and confirm the CLI can invoke it.
- [x] Update parent kanban task and architecture inventory cross-references.

## Acceptance criteria

- [x] `pnpm --dir packages/eta-mu build` produces `dist-cli/index.cjs`.
- [x] `node packages/eta-mu/dist-cli/index.cjs --version` prints the package version.
- [x] `node packages/eta-mu/dist-cli/index.cjs --help` prints command help.
- [x] `node packages/eta-mu/dist-cli/index.cjs kanban board list` delegates to Rheos.
- [x] `node packages/eta-mu/dist-cli/index.cjs contracts output --contract foo --response bar` delegates to output-contract-gate.
- [x] `node packages/eta-mu/dist-cli/index.cjs git receipt status` reads the repo's receipts.edn.
- [x] `node packages/eta-mu/dist-cli/index.cjs git fork-tax --all --dry-run` shows the handoff plan without side effects.
- [x] `node packages/eta-mu/dist-cli/index.cjs git session reflect <lesson>` records a reflection.
- [x] `node packages/eta-mu/dist-cli/index.cjs doctor` reports workspace health.
- [x] All new CLJS code is free of `clj-kondo` warnings and the package test target passes.
- [x] No new TypeScript is introduced in `packages/legacy/*` or `packages/eta-mu`.

## Verification

```bash
pnpm --dir packages/eta-mu build
node packages/eta-mu/dist-cli/index.cjs --version
node packages/eta-mu/dist-cli/index.cjs --help
pnpm --dir packages/eta-mu test
pnpm --dir packages/eta-mu lint:kondo
```

## Notes

The base CLI router and commands are implemented in ClojureScript. The default `agent` command supports single-turn prompts, piped stdin, and an interactive REPL backed by `@eta-mu/turn-processor`. The legacy `@open-hax/eta-mu-cli` dependency is no longer used by this package. The full terminal/TUI experience will be provided by a future `packages/terminal-ui` package.
