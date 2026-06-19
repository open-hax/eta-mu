# Development

> **DEPRECATED — legacy TypeScript.** This is the legacy coding-agent (`@open-hax/eta-mu-cli`) at `packages/legacy/coding-agent`, being rewritten to ClojureScript. See the rewrite inventories under `docs/coding-agent-cljs-rewrite-inventory-*.md`. Do not start new TS work here.

See the workspace [AGENTS.md](../../../../AGENTS.md) for ClojureScript conventions and the Kanban/GitHub workflow.

## Setup

This package lives in the eta-mu pnpm monorepo. Work from the monorepo root and use pnpm workspace filters — do not clone it standalone.

```bash
# from the eta-mu monorepo root
pnpm install
pnpm --filter @open-hax/eta-mu-cli run build
```

`build` first builds its CLJS/TS workspace dependency `@open-hax/eta-mu-runtime` (via the `prebuild` script), then compiles with `tsgo` and copies assets.

## Forking / Rebranding

Configure via `package.json`:

```json
{
  "piConfig": {
    "name": "pi",
    "configDir": ".pi"
  }
}
```

Change `name`, `configDir`, and `bin` field for your fork. Affects CLI banner, config paths, and environment variable names.

## Path Resolution

Three execution modes: npm install, standalone binary, tsx from source.

**Always use `src/config.ts`** for package assets:

```typescript
import { getPackageDir, getThemeDir } from "./config.js";
```

Never use `__dirname` directly for package assets.

## Debug Command

`/debug` (hidden) writes to `~/.pi/agent/pi-debug.log`:
- Rendered TUI lines with ANSI codes
- Last messages sent to the LLM

## Testing

Tests run under Vitest. The `pretest` script first compiles `@open-hax/eta-mu-runtime`'s CLJS.

```bash
# from the eta-mu monorepo root
pnpm --filter @open-hax/eta-mu-cli test                                  # run all tests
pnpm --filter @open-hax/eta-mu-cli exec vitest run test/specific.test.ts # run a specific test
```

## Project Structure

This package is `packages/legacy/coding-agent` (`@open-hax/eta-mu-cli`). Its sibling legacy TS dependencies in the monorepo:

```
packages/legacy/
  ai/           # @open-hax/eta-mu-ai — LLM provider abstraction
  agent/        # @open-hax/eta-mu-agent-core — agent loop and message types
  tui/          # @open-hax/eta-mu-tui — terminal UI components
  coding-agent/ # @open-hax/eta-mu-cli — this package: CLI and interactive mode
```

It also depends on the active CLJS package `@open-hax/eta-mu-runtime` (`packages/runtime`) and `@open-hax/eta-mu-extensions` (`packages/extensions`).
