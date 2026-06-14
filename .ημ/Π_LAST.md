# Π Last Handoff — feat/kanban-comments-parity (monorepo reorganization)

- timestamp: 20260614T144902Z
- branch: feat/kanban-comments-parity
- pre-commit-head: cc77836bba9c9d8153450b50a33296218da20ece
- scope: reorganize the monorepo layout without losing content

## Why this Π

The workspace was mid-reorganization: legacy packages were moved under
`packages/legacy/`, `kanban-cljs` was renamed to `packages/Rheos`, a shared
`packages/tsconfig/` was introduced, and retired services/receipts were removed.
This snapshot captures the full move state so nothing is lost.

## Moves (content-preserving renames)

| old path | new path |
|---|---|
| `packages/kanban-cljs` | `packages/Rheos` |
| `packages/agent` | `packages/legacy/agent` |
| `packages/ai` | `packages/legacy/ai` |
| `packages/coding-agent` | `packages/legacy/coding-agent` |
| `packages/docs` | `packages/legacy/docs` |
| `packages/github` | `packages/legacy/github` |
| `packages/kanban` | `packages/legacy/kanban` |
| `packages/output-contract-gate` | `packages/legacy/output-contract-gate` |
| `packages/publication-components` | `packages/legacy/publication-components` |
| `packages/tui` | `packages/legacy/tui` |

## Active adjustments

- `package.json` / `pnpm-workspace.yaml` / `tsconfig.base.json` — workspace roots updated for new layout
- `pnpm-lock.yaml` — refreshed
- `scripts/lint.mjs` — package paths updated to use pnpm filter names
- `packages/sol/package.json` — build script changed from `release` to `compile`
- `packages/axxium/src/cljs/axxium/routes/actor.cljs` — paren balance fix
- `kanban/tasks/eta-mu-quality-ratchet-lint-gates.md` — task update
- `.gitignore` — ignore `/alpha/` nested worktree

## Removed (intentional deletions)

- Services: `services/agentd`, `services/eta-mu`, `services/eta-mu-truth-workbench`
- Receipts: `receipts/hormuz/*`
- Workflow: `.github/workflows/hormuz-clock.yml`
- Shared: `shared/js/opencode-events/events.edn`
- Packages: `packages/truth`, `packages/web-ui`, `packages/reactant`, `packages/skills`

## Verification

- Git index: 1508 paths staged
  - 786 pure renames (R100)
  - 696 deletions
  - 9 modifications
  - 4 additions
  - 3 modified renames (R073–R096)
- No `.env` files staged
- Build artifacts remain ignored (node_modules, dist, target, .shadow-cljs, coverage)

## Blockers / follow-ups

1. `alpha/v2` is a nested git worktree (`gitdir: .git/modules/orgs/octave-commons/eta-mu-sol`).
   It is left untracked and `/alpha/` is added to `.gitignore` so it does not pollute
   this repo's snapshot. Snapshot it separately if needed.
2. Root `package.json` scripts still reference `@open-hax/agentd` (`dev`, `start`,
   `docs:ts`), but `services/agentd` was removed. Those scripts need to be repointed
   before they will run.
