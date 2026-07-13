---
category: "tasks"
labels: ["tasks", "cljs", "extraction", "katamorph", "event-ledger", "sol", "rheos"]
points: "5"
source: "kanban/epics/contracts-git-ref-extraction.md"
title: "Rewire eta-mu consumers (sol, Rheos) to git-ref contracts + remove local copies"
priority: "P1"
status: "breakdown"
uuid: "contracts-git-ref-extraction-eta-mu-consumers"
created_at: "2026-07-12T00:00:00Z"
---

# Rewire eta-mu consumers (sol, Rheos) to git-ref contracts + remove local copies

> Parent epic: `kanban/epics/contracts-git-ref-extraction.md`

## Purpose

Make eta-mu consume `katamorph` and `event-ledger` from the standalone
`open-hax` git repos (tag `v0.1.0`) and delete the in-repo
`packages/{katamorph,event-ledger}` so there is no locally-editable copy of the
contracts to drift.

## Current coupling (mapped 2026-07-12)

- `packages/sol/shadow-cljs.edn` — source-paths `../katamorph/src/cljs`,
  `../event-ledger/src` (classic shadow mode). NOTE: sol's existing `deps.edn`
  is for **knoxx mutation testing** (`:paths ["mutation"]`), not the shadow
  build — flipping `:deps true` naively would collide; the shadow classpath
  must be modelled as the default `:paths`/`:deps` with mutation kept under its
  own alias.
- `packages/Rheos/shadow-cljs.edn` — source-paths `../protocols/src`,
  `../event-ledger/src`, `../chat-ui/src`. Only event-ledger leaves;
  protocols + chat-ui stay local (keep as relative `:paths` in a new
  `Rheos/deps.edn`).
- `packages/Rheos/package.json` — `@promethean-os/event-ledger": "workspace:*"`
  → `github:open-hax/event-ledger#v0.1.0`.
- `pnpm-workspace.yaml` globs `packages/*` (picks up both dirs);
  `pnpm-lock.yaml` has `link:../event-ledger` + `packages/{katamorph,event-ledger}`.
- katamorph is consumed **only** as CLJS source by sol (no npm dependents).

## Plan (phases)

- Phase 1: `Rheos` — add `deps.edn` (relative `:paths` for src/test/protocols/
  chat-ui + `event-ledger` git dep + `thheller/shadow-cljs`), switch
  `shadow-cljs.edn` to `:deps true`, repoint `package.json` to the github ref.
- Phase 2: `sol` — model the shadow build classpath in `deps.edn` (default
  `:paths`/`:deps` + git deps for katamorph/event-ledger), keep mutation-test
  tooling under its alias, switch `shadow-cljs.edn` to `:deps true`.
- Phase 3: remove `packages/katamorph` + `packages/event-ledger`; `pnpm install`
  to regenerate workspace + lockfile.
- Phase 4: build + test `sol` and `Rheos`; confirm no build-critical reference
  to the removed dirs remains.

## Verification gate

- [ ] `pnpm --filter @open-hax/sol test` (shadow compile test) green.
- [ ] Rheos `shadow-cljs compile test` green.
- [ ] `packages/{katamorph,event-ledger}` gone; `pnpm install` clean.
- [ ] `git status` shows no accidental sweep of pre-existing unrelated dirty
      files into the commit.

## Risk

Invasive monorepo surgery on a repo in flux. sol/Rheos builds may need the full
workspace to validate. Baseline each build BEFORE changing config so a failure
is attributable. Deferred pending explicit go-ahead per session on 2026-07-12.

---
Coupling mapped 2026-07-12; plan + risks captured. NOT started — invasive monorepo surgery (sol deps.edn collision, Rheos 3-sibling source-paths, pnpm workspace + lockfile). Awaiting explicit go-ahead before touching eta-mu builds.

BASELINE (2026-07-13, eta-mu@d8404a6, branch device/stealth, local packages/{katamorph,event-ledger} still present):
| check | sol (@open-hax/sol) | Rheos (@open-hax/rheos) |
| test | PASS 66 tests/193 assert, 0 fail, 0 warn | PASS 58 tests/166 assert, 0 fail |
| lint:kondo | FAIL exit3, 24 errors 0 warn (Unresolved symbol: await — promesa/async macro kondo not configured for; ties to shared-kondo-config epic) | PASS 0 err/0 warn (but WARNING: EOF reading packages/kondo-config/.../config.edn) |
| build | PASS 0 warn (compile server) | PASS 0 warn (release server+cli) |
GATE for the rewire = NO REGRESSION vs this baseline: sol lint must stay at exactly its 24 pre-existing await errors (not worse), tests/builds stay green, and the clj-kondo/test/build checks are NOT disabled, relaxed, or stubbed to pass. The sol await-lint failure and the kondo-config EOF are pre-existing and out of scope for this task.
---
