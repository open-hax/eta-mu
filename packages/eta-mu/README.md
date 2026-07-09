# eta-mu

Global `eta-mu` / `pi` CLI entry point and sub-command router.

## Status

This package is under construction. It currently routes sub-commands and delegates the default TUI agent to the legacy `@open-hax/eta-mu-cli` package while the agent is being rewritten in ClojureScript.

## Usage

```bash
eta-mu                    # Start the TUI agent (delegated to legacy for now)
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
