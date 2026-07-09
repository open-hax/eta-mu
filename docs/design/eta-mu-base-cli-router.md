# Eta-mu Base CLI Router Design

## Context

The `eta-mu` / `pi` terminal binary was originally provided by the legacy TypeScript package `@open-hax/eta-mu-cli` (`packages/legacy/coding-agent`). The CLJS runtime rewrite replaces it with `packages/eta-mu` (npm name `eta-mu`). This package is the router that all other sub-features hang from: `eta-mu kanban`, `eta-mu git`, `eta-mu contracts output`, etc. The default `eta-mu agent` command is now implemented in ClojureScript and does not depend on the legacy CLI.

This document describes the sub-command router framework for `packages/eta-mu`.

## Goals

1. Provide a small, declarative, data-driven command registry.
2. Keep `eta-mu` (no arguments) as the default agent invocation.
3. Allow sub-commands to be either pure handlers or delegates to other packages/binaries.
4. Generate `--help` automatically from the registry.
5. Lay the foundation for a future `packages/terminal-ui` package that can provide a richer TUI.

## Non-goals

- Re-implement the full terminal TUI in this package (that belongs in `packages/terminal-ui`).
- Replace the legacy package's bin immediately in `package.json` (that happens when the legacy package is emptied).
- Add a heavy command-line parser dependency.

## Package structure

```
packages/eta-mu
├── package.json
├── shadow-cljs.edn
├── README.md
├── .clj-kondo/config.edn
└── src/cljs/eta_mu
    ├── law
    │   └── command.cljs      ; command/sub-command registry contract
    ├── shape
    │   └── args.cljs         ; tiny argument parsing helpers
    ├── extern
    │   ├── process.cljs       ; argv, env, exit
    │   ├── child_process.cljs ; spawn/exec wrappers
    │   └── readline.cljs      ; Node readline boundary for REPL
    ├── domain
    │   └── router.cljs        ; pure routing decisions
    └── infra
        └── cli
            ├── main.cljs          ; entry point
            ├── router.cljs        ; dispatch and help generation
            ├── repl.cljs          ; interactive REPL loop
            └── commands
                ├── agent.cljs     ; default agent command
                ├── kanban.cljs    ; delegate to Rheos
                ├── git.cljs       ; git workflow group
                └── contracts.cljs ; delegate to output-contract-gate
```

## Command contract

A command is a map with the following shape:

```clojure
{:name        "kanban"
 :description "Agent-first task board"
 :handler     (fn [args] ...)  ; optional at group nodes
 :subcommands {"list" {...}
               "find" {...}}
 :hidden?     false}
```

Rules:
- A leaf command has a `:handler` and no `:subcommands`.
- A group command has `:subcommands` and may omit `:handler`.
- If a group command receives a sub-command it does not recognize, it prints help and exits with 1.
- If the top-level command is unrecognized, it prints top-level help and exits with 1.

## Routing algorithm

1. Parse `process.argv` into `args` vector.
2. Peek the first positional token.
   - If it is `--help` or `-h`, print help for the current command level and exit 0.
   - If it is `--version` or `-v`, print version and exit 0.
3. If the token matches a registered command, recurse into it with the remaining tokens.
4. If the token is empty and the current level has a default handler, invoke it.
5. Otherwise, print help and exit 1.

## Argument parsing

The router uses a small, permissive parser:

- Positional tokens are collected in order.
- Flags start with `--`.
- Boolean flags have no value.
- Value flags consume the next token if it is not a flag.
- `--flag=value` is supported.
- Flags are stored as a string-keyed map.

Sub-command handlers are responsible for their own flag semantics; the router only slices the token stream.

## Delegation strategy

Several early commands delegate to other workspace binaries rather than re-implement their logic:

| Command | Delegate | Notes |
|---------|----------|-------|
| `agent` (default) | internal CLJS | Uses `@eta-mu/turn-processor` and `eta-mu.extern.openai`. |
| `kanban` | `rheos` CLI | Rheos is the canonical kanban implementation. |
| `contracts output` | `output-contract-gate` | `@eta-mu/contracts-output` binary. |
| `git fork-tax` | internal CLJS | Git workflow for handoff snapshots. |

Delegation is implemented via `child_process.spawn` with `stdio: "inherit"`. Exit codes are propagated.

## Default command

When `eta-mu` is invoked with no command, it is equivalent to `eta-mu agent`.
The `agent` handler chooses a mode based on stdin and arguments:

- With prompt arguments: single-turn chat.
- With no arguments and a TTY stdin: interactive REPL (`eta-mu.infra.cli.repl`).
- With no arguments and piped stdin: single-turn from stdin.

The REPL maintains conversation context across turns using `@eta-mu/turn-processor`.
A future `packages/terminal-ui` package can replace or enhance the REPL with a richer
terminal interface.

## Help format

Help is generated from the registry:

```
eta-mu — AI assistant router

USAGE
  eta-mu [command] [options]

COMMANDS
  agent       Start the TUI agent (default)
  kanban      Agent-first task board
  git         Git workflow helpers
  contracts   Contract gate commands
  help        Show this help
  version     Show version

Run 'eta-mu <command> --help' for command help.
```

Group commands include their subcommands in the help output.

## Dependencies

- `shadow-cljs` for the build.
- `@eta-mu/turn-processor` (workspace) for the agent turn loop.
- `@eta-mu/contracts-output` (workspace) for the output contract gate binary.
- `@open-hax/rheos` (workspace) for kanban delegation.

## Build targets

- `:cli` — `:node-script` target, outputs `dist-cli/index.cjs`, main namespace `eta-mu.infra.cli.main`.
- `:test` — `:node-test` target, outputs `target/eta-mu-test.cjs`.

No library ESM target is needed initially; the package is a CLI executable.

## Migration path

1. This package is introduced alongside the legacy package.
2. New sub-commands (`kanban`, `git`, `contracts`) are added to the new router.
3. The `agent` handler is rewritten in native CLJS using `@eta-mu/turn-processor` and supports single-turn, piped, and REPL modes.
4. A future `packages/terminal-ui` package can provide the richer terminal interface.
5. The legacy `packages/legacy/coding-agent` package is emptied and deleted as part of the final cleanup PR.

## Open questions

1. Should `eta-mu git` live in `packages/eta-mu` or a separate `packages/git` package? For now, the group is small enough to host in `packages/eta-mu`; if it grows, it can be split.
2. Should the router support command aliases (e.g., `pi` for `eta-mu`)? The npm bin already provides `pi` and `eta-mu-beta` aliases; aliases are handled by npm, not the router.
3. Should we include a `config` command? The legacy config command is part of the agent runtime; it will be migrated with the TUI agent.
