(pi-state
  (timestamp "20260614T144902Z")
  (branch "feat/kanban-comments-parity")
  (pre-commit-head "cc77836bba9c9d8153450b50a33296218da20ece")
  (scope "reorganize monorepo: move legacy packages under packages/legacy, rename kanban-cljs to packages/Rheos, add shared packages/tsconfig, remove retired services/receipts")
  (verification
    (git-index "1508 paths staged — 786 pure renames, 696 deletions, 9 modifications, 4 additions, 3 modified renames")
    (ignored-noise "alpha/ nested worktree ignored; build artifacts (node_modules, dist, target, .shadow-cljs, coverage) remain ignored")
    (secrets-scan "no .env files staged; no obvious secrets in added paths"))
  (renames
    (packages/kanban-cljs -> packages/Rheos "full content move")
    (packages/agent -> packages/legacy/agent)
    (packages/ai -> packages/legacy/ai)
    (packages/coding-agent -> packages/legacy/coding-agent)
    (packages/docs -> packages/legacy/docs)
    (packages/github -> packages/legacy/github)
    (packages/kanban -> packages/legacy/kanban)
    (packages/output-contract-gate -> packages/legacy/output-contract-gate)
    (packages/publication-components -> packages/legacy/publication-components)
    (packages/tui -> packages/legacy/tui))
  (additions
    "packages/tsconfig/base.json"
    "packages/tsconfig/package.json"
    "docs/notes/2026.06.14.00.38.02.md"
    "docs/notes/2026.06.14.00.59.20.md")
  (modifications
    "package.json"
    "pnpm-workspace.yaml"
    "tsconfig.base.json"
    "pnpm-lock.yaml"
    "scripts/lint.mjs"
    "packages/sol/package.json"
    "packages/axxium/src/cljs/axxium/routes/actor.cljs"
    "kanban/tasks/eta-mu-quality-ratchet-lint-gates.md"
    ".gitignore")
  (deletions
    (services "agentd, eta-mu, eta-mu-truth-workbench")
    (receipts "receipts/hormuz/*")
    (workflow ".github/workflows/hormuz-clock.yml")
    (shared "shared/js/opencode-events/events.edn")
    (packages "truth, web-ui, reactant, skills"))
  (blockers
    (alpha/worktree "alpha/v2 is a nested git worktree (gitdir: .git/modules/orgs/octave-commons/eta-mu-sol); left untracked and /alpha/ added to .gitignore so it does not pollute this repo's snapshot")
    (stale-scripts "root package.json scripts still reference @open-hax/agentd (dev, start, docs:ts) which was removed; fix needed before those commands work")))
