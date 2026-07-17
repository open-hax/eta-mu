# @eta-mu/turn-processor

Pure agent turn processor: state, tool orchestration, and message flow.

This package is the ClojureScript rewrite of the legacy TypeScript agent core in
`packages/legacy/agent`. It owns the turn loop, context construction, and tool
execution decisions without UI or provider-specific I/O.

## Build

```bash
pnpm --dir packages/turn-processor build
```

## Test

```bash
pnpm --dir packages/turn-processor test
pnpm --dir packages/turn-processor lint:kondo
```

## License

GPL-3.0-or-later
