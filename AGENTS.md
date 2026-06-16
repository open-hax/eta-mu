
## Clojure House Rules (eta-mu-sol constitution)

# Architecture Paradigm: Categories vs. Contracts
When modeling domains, you must strictly differentiate between the grammar of motion and the enforcement of that motion.
- Categories: Describe the space of lawful possible transformations. They dictate "what kind of move this is" and define the state space, transition vocabulary, and general laws of composition for the runtime or a subsystem.
- Contracts: Decide whether a particular runtime entity, event, or transition is admissible under current obligations. They dictate "whether you are allowed to count it as a valid move right now" by defining guards, admissibility checks, evidence requirements, delivery expectations, and side-effect constraints.


### Zero Warnings
`clj-kondo`, type checks, and tests must all pass with zero warnings. Warnings
are failed contracts, not noise.

### Namespace Architecture
| Layer         | Pattern            | Rule                             |
|---------------|--------------------|----------------------------------|
| `domain.*`    | Business logic     | No I/O. Pure functions only.     |
| `infra.*`     | Transport/DB/Queue | No domain policy.                |
| `shape.*`     | Data morphisms     | Pure, domain-agnostic.           |
| `law.*`       | Contracts/Malli    | No I/O. Validators only.         |
### Modern ClojureScript
Always use `^:async` metadata (ClojureScript ≥ 1.12.145). Never use
`core.async` channels or Promise chains in new code.

```clojure
(defn ^:async fetch-data [url]
  (await (js/fetch url)))

(deftest ^:async fetch-test
  (is (some? (await (fetch-data "https://example.com")))))
```

### Idioms
- `when-let` over nested `let` + `if`
- `->` / `->>` over nested `let` forms
- No `utils` namespaces
- No broad `:refer :all`
- Custom macros registered in `.clj-kondo/config.edn` on day one
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

