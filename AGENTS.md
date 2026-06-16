## Testing Gate
- A task is not done while any relevant automated test suite is failing.
- For coding-agent changes, run `pnpm --filter @open-hax/eta-mu-cli test` and resolve all failures before reporting completion.
- For eta-mu extension changes, run `pnpm -C packages/eta-mu-extensions test` and resolve all failures before reporting completion.
- If a full suite cannot be run, state that the task is not complete and record the exact blocker instead of claiming done.

## TypeScript Deprecation Policy

**TypeScript is DEPRECATED. All new code MUST be written in ClojureScript.**

- No new `.ts` or `.tsx` files may be introduced.
- Existing TypeScript is in `packages/legacy/` and will be migrated to CLJS over time.
- A pre-commit hook enforces that total TypeScript line count never increases between commits.
- If you must touch existing TS code, ensure net line count does not go up (refactor/delete more than you add).

### Enforcement
- **Pre-commit hook**: `scripts/pre-commit-ts-guard.sh` rejects commits that increase TS lines.
- **Baseline file**: `.ts-line-count-baseline` tracks the last committed count (gitignored, local state).
- **Manual check**: `node scripts/ts-line-count.mjs` — full report with global, per-project, per-file breakdown.
- **Install hook**: `ln -sf ../../scripts/pre-commit-ts-guard.sh .git/hooks/pre-commit` (or use the symlink in `.git/modules/`).

### Current TypeScript Inventory
- **Global**: ~174,500 lines across 612 files
- **Breakdown**: 99.5% in `packages/legacy/`, remainder in `packages/runtime/`, `packages/protocols/`, `packages/event-ledger/`
- See `node scripts/ts-line-count.mjs` for full report.

## Code Style
- **TypeScript** (legacy only): ES modules, camelCase functions, async/await, Zod validation, Fastify server
- **ClojureScript** (all new code): Reagent components, kebab-case functions, atoms for state, Tailwind CSS
- **Imports**: Use ES6 imports, no default exports, explicit file extensions (.js)
- **Types**: Strict TypeScript enabled for legacy TS; ClojureScript uses Malli schemas for validation
- **Naming**: camelCase for TS, kebab-case for CLJS, descriptive variable names
- **Error handling**: Try/catch only when necessary, proper error logging via bus events
- **Formatting**: Consistent indentation, no unnecessary destructuring, single-responsibility functions

