# eta-mu

Global `eta-mu` / `pi` CLI entry point and sub-command router.

## Status

This package is under construction. It routes sub-commands and runs the default agent natively in ClojureScript via `@eta-mu/turn-processor` (interactive readline REPL on a TTY, single-turn on piped stdin). The rich terminal interface is being rebuilt separately in `packages/terminal-ui` and will replace the REPL when ready.

## Usage

```bash
eta-mu                    # Start the agent (REPL on a TTY, single-turn if piped)
eta-mu kanban             # Delegate to Rheos
eta-mu contracts output   # Delegate to output-contract-gate
eta-mu git help           # Git workflow helpers
eta-mu --help             # Show command help
```

## Build

```bash
pnpm --dir packages/eta-mu build
```

## Test

```bash
pnpm --dir packages/eta-mu test
pnpm --dir packages/eta-mu lint:kondo
```

## License

GPL-3.0-or-later
