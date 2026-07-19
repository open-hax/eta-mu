---
category: "tasks"
labels: ["tasks", "cljs", "extraction", "katamorph", "event-ledger", "sol", "rheos"]
write-id: "1784487697479-0.ws7c6fo7dd6abm59dj"
points: "5"
source: "kanban/epics/contracts-git-ref-extraction.md"
title: "Rewire eta-mu consumers (sol, Rheos) to git-ref contracts + remove local copies"
priority: "P1"
status: "done"
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
- `packages/rheos/shadow-cljs.edn` — source-paths `../protocols/src`,
  `../event-ledger/src`, `../chat-ui/src`. Only event-ledger leaves;
  protocols + chat-ui stay local (keep as relative `:paths` in a new
  `Rheos/deps.edn`).
- `packages/rheos/package.json` — `@promethean-os/event-ledger": "workspace:*"`
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

BASELINE #2 (2026-07-13, post main-merge, eta-mu@08b852b, branch device/stealth, working tree clean, local packages/{katamorph,event-ledger} still present). SUPERSEDES baseline #1.
| check | sol (@open-hax/sol) | Rheos (@open-hax/rheos) |
| test | PASS 66 tests/193 assert, 0 fail | PASS 58 tests/166 assert, 0 fail |
| lint:kondo | PASS 0 err/0 warn | PASS 0 err/0 warn |
| build | PASS 0 warn (compile server) | PASS 0 warn (release server+cli) |
CHANGES vs baseline #1: the main-merge FIXED sol's 24 pre-existing 'Unresolved symbol: await' lint errors (now 0) and cleared Rheos's kondo-config EOF-read warning. Everything now fully green.
GATE = everything above stays green (0 err/0 warn, tests+builds pass) with NO check disabled/relaxed/stubbed.
CAVEAT: pnpm-lock.yaml out of sync post-merge — 'pnpm install --frozen-lockfile' fails (Rheos/package.json devDeps: shadow-cljs ^3.4.10 vs lock 3.4.11, ws, @vitejs/plugin-react). Pre-existing merge artifact; baseline run against existing node_modules. Phase 3 pnpm install must be an intended, reviewed lockfile change.
NOTE: card files are UNTRACKED and were nearly lost when GitKraken stashed them during the merge — commit these kanban cards to git so the record is durable.

DECISION 2026-07-13 (supersedes A/B consolidation question): 'promethean is a dead god.' Do the SIMPLEST thing — rename the dead namespace, no package merge. promethean.* -> open-hax.* (CLJS ns/requires) and @promethean-os/* -> @open-hax/* (npm), org-for-org. Rationale: open-hax is the living org already used by sol (open-hax.sol.*) and the repos/katamorph (@open-hax). Blast radius: ~45 files across 2 repos — eta-mu protocols(34)/Rheos(6)/sol(1)/axxium(1), muse(3, comments only), npm scope in Rheos+protocols package.json, plus the standalone open-hax/event-ledger repo (promethean.event-ledger.* -> open-hax.event-ledger.*, retag). CAUTION: 'promethean' is ALSO the kanban FSM name (fsm.cljs / openhax.kanban.json) — must NOT be renamed; anchor only on 'promethean.' / '@promethean-os/' / src 'promethean/' dirs. Must be atomic per repo + validated (no-regression vs baseline #2).

PROGRESS 2026-07-13 — namespace rename:
DONE: open-hax/event-ledger repo renamed promethean.event-ledger.* -> open-hax.event-ledger.*, @promethean-os -> @open-hax, dist rebuilt, tagged v0.2.0 @ 9e7fd430c26b245a3b120f5d2dee33fc8cb4a71f, pushed. Standalone test green (31 tests, 0 fail).
DIAGNOSIS CORRECTION (do not repeat my earlier wrong theory): a first standalone build showed 17 'undeclared Var await' errors. Root cause was NOT a hidden macro coupling to open-hax.sol.macros — it was running the build with the STALE GLOBAL shadow-cljs 3.4.4 (no local node_modules). '^:async'+'(await ...)' is a native modern-CLJS/shadow-3.4.11 feature. With the repo's pinned shadow-cljs it builds clean. sol.macros only auto-marks defroute handlers ^:async; it does not define await. sol baseline#1 await LINT errors were a clj-kondo-config gap (fixed by main-merge), not a compile issue.
REMAINING (eta-mu in-repo, still on v0.1.0/old ns so currently GREEN, not broken): rename promethean.* -> open-hax.* in protocols(34)/Rheos(6)/sol(1)/axxium(1); move protocols src/promethean -> src/open_hax; rename npm @promethean-os/openplanner-protocols -> @open-hax (protocols pkg + Rheos workspace dep) + pnpm install; bump sol deps.edn event-ledger git dep to v0.2.0/9e7fd43 + rename its require. Then validate no-regression vs baseline #2. muse: package.json dep key @promethean-os/event-ledger -> @open-hax/event-ledger (repo/github ref unchanged) + comment refs.

COMPLETE + VALIDATED 2026-07-13. Namespace promethean.* -> open-hax.* done across all repos; 0 promethean. ns refs remain (FSM name + axxium JWT string 'promethean' correctly preserved).
VALIDATION (all vs baseline #2, checks ON, none disabled):
- open-hax/event-ledger: renamed, v0.2.0 @ 9e7fd43 pushed; standalone test 31/115 0-fail.
- sol: test 66/193 0-fail, lint 0/0, build 137 files 0-warn — now on event-ledger v0.2.0 (open-hax.event-ledger.schema).
- Rheos: test 58/166 0-fail, lint 0/0, build 96+100 files 0-warn.
- protocols: renamed (src/promethean -> src/open_hax; pkg @open-hax/openplanner-protocols); lint 0/0; test = 2 failures — VERIFIED PRE-EXISTING via throwaway git-worktree at HEAD (identical 2 mock-db auth failures in records/mongo/user_management_test before rename; diff proved protocols changes were ns-only, 0 logic lines). NOT a regression.
- muse: test 124/286 0-fail; on @open-hax/event-ledger v0.2.0.
- local packages/{katamorph,event-ledger} removed; pnpm workspace=26 projects, lock regenerated.
UNCOMMITTED: all code changes are in working trees (eta-mu + muse), nothing git-committed yet — awaiting go-ahead to commit.

VERIFICATION GATE RE-RUN 2026-07-19 (post-commit, tree at d30b77b + triage; packages renamed @open-hax/*->@eta-mu/* since baseline). All checks ON, none relaxed. sol (@eta-mu/sol): test PASS 88 tests/256 assertions 0 fail (suite grew from baseline 66/193 — no regression), lint:kondo 0 err/0 warn, build PASS 165 files 0 warn. Rheos (@eta-mu/rheos): test PASS 58/166 0 fail (= baseline #2), lint:kondo 0/0, build PASS server 96 + cli 100 files 0 warn. pnpm install --frozen-lockfile PASS (23 projects, lockfile up to date — baseline #2 lockfile-drift caveat resolved). packages/{katamorph,event-ledger} gone; git-ref deps live in sol/deps.edn (katamorph v0.1.0, event-ledger v0.2.0@9e7fd43). Residual reference sweep: sol/shadow-cljs.edn hits are comments only; deleted stale packages/rheos/package-lock.json (npm artifact referencing dead openplanner paths, no consumers — pnpm workspace). Gate met, closing.
---