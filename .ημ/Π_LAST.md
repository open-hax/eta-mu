# Π Fork Tax — 2026-06-15

## Branch
`feat/kanban-comments-parity`

## Base SHA
`a03eeb6`

## What Changed

### Build hygiene
- `.gitignore`
  - Added `dist-dev/` to root ignore patterns so shadow-cljs dev builds are ignored everywhere.
- `packages/sol/.gitignore`
  - Removed stale `.clj-kondo` ignore line.
- `packages/sol/dist-dev/`
  - Removed from git tracking (files remain locally for dev server use).

### Katamorph policy
- `packages/katamorph/src/cljs/katamorph/policy/eval.cljs`
- `packages/katamorph/src/cljs/katamorph/policy/fulfillment.cljs`
- `packages/katamorph/test/cljs/katamorph/policy/eval_test.cljs`
  - Policy evaluation and fulfillment refinements (details in diff).

### Legacy coding-agent
- `packages/legacy/coding-agent/src/core/resource-loader.ts`
- `packages/legacy/coding-agent/src/core/sdk.ts`
  - SDK/resource-loader updates to support current contract wiring.

### Sol runtime
- `packages/sol/package.json` / `packages/sol/shadow-cljs.edn`
  - Dependency/build configuration updates.
- `packages/sol/src/cljs/open_hax/sol/domain/contracts/loader.cljs`
  - Contract loader updates.
- `packages/sol/src/cljs/open_hax/sol/domain/contracts/mcp_servers.cljs` *(new)*
  - MCP server contract definitions.
- `packages/sol/src/cljs/open_hax/sol/extern/eta_mu.cljs`
  - eta-mu extern updates.
- `packages/sol/src/cljs/open_hax/sol/infra/agent/session.cljs`
- `packages/sol/src/cljs/open_hax/sol/infra/agent/turn.cljs`
  - Agent session and turn handling updates.
- `packages/sol/src/cljs/open_hax/sol/infra/agent/mcp_tools.cljs` *(new)*
  - MCP tool bridge.
- `packages/sol/src/cljs/open_hax/sol/infra/defaults.cljs` *(new)*
  - Default runtime configuration.
- `packages/sol/src/cljs/open_hax/sol/law/contracts.cljs`
  - Contract law/guard updates.
- `packages/sol/src/cljs/open_hax/sol/shape/app_shapes.cljs`
  - App shape schema updates.
- `packages/sol/test/cljs/open_hax/contracts/policy/eval_test.cljs`
- `packages/sol/test/cljs/open_hax/sol/shape/parse_test.cljs`
  - Test updates.

## Excluded from Commit
- `pnpm-lock.yaml` — stale lock state, regenerate on next `pnpm install`
- `migrating-sol.md` — session scratch note
- `packages/Rheos/dist-dev/` — build artifacts, untracked and now gitignored

## Verification Status
- **eta-mu-cli tests**: Passed — 1120 tests, 47 skipped
- **Katamorph tests**: Passed — 73 tests, 192 assertions
- **Sol tests**: Failed — 24 failures, 1 error (pre-existing on this branch, not introduced by dist-removal)
- **TS line count**: Unchanged at 174,537 lines

## Commit
`61887d8` on `feat/kanban-comments-parity`

## Tag
`Π/feat-kanban-comments-parity/2026-06-15T144706`

## Notes
- No concurrent agent dirt detected; excluded paths are generated/runtime/scratch.
- Pre-commit TypeScript guard hook is not installed locally.
- Sol test failures pre-date this Π snapshot and are documented as blockers for the branch.
