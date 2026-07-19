---
category: "epics"
labels: ["epics", "cljs", "extraction", "katamorph", "event-ledger", "contracts", "architecture"]
write-id: "1784487761704-0.fe7l5eqzc36vlfnkr"
points: "8"
source: "planning-session:2026-07-12"
title: "Extract katamorph + event-ledger to standalone git-ref repos"
priority: "P1"
status: "done"
uuid: "contracts-git-ref-extraction"
created_at: "2026-07-12T00:00:00Z"
---

# Extract katamorph + event-ledger to standalone git-ref repos

## Decision (2026-07-12)

`katamorph` (contract/resource runtime — "data as interpreter") and
`event-ledger` (append-only MongoDB event ledger) are promoted out of the
`open-hax/eta-mu` monorepo into their own standalone git repositories, and
every consumer — `muse`, plus eta-mu's own `sol` and `Rheos` — consumes them
by **immutable git ref** (`:git/sha` + `:git/tag`), never a filesystem sibling
path and never an in-repo editable copy.

### Why

- **No drift on the contracts.** These two are the foundational leaves (true
  dependency roots: katamorph → malli only; event-ledger → no eta-mu deps).
  When they lived in `packages/` they were locally editable, so a consumer
  "fixing something when it broke" could silently mutate the contract and
  diverge. A git-ref dep resolves into the read-only `~/.gitlibs` cache keyed
  by sha — there is no local copy in the repo to patch. Any change to a
  contract must be a tracked, reviewed commit + tag bump on its own repo.
- **Decouple `muse` from eta-mu.** muse needs katamorph/event-ledger without
  being locked into the (currently chaotic) eta-mu repo or a fragile relative
  path across sibling checkouts. It had drifted to *copying* event-ledger's
  schema (`store.cljc`/`envelope.cljc`) and reimplementing the append pipeline
  because a prior agent copied instead of depending. muse now plans to consume
  katamorph directly.
- **Reproducibility.** Consumers stay pinned to a tag until the sha is
  explicitly bumped; in-place dev on the contract repos can never silently
  break a consumer's build.

## Result of extraction

Split out of `open-hax/eta-mu` with full history preserved (`git-filter-repo`),
`main` default, `v0.1.0` tagged, private, under the `open-hax` org:

| Repo | Tag | Commit (`:git/sha`) |
|------|-----|---------------------|
| `open-hax/katamorph` | `v0.1.0` | `509878193515b199ce8477b3c2d583f0d5b32ac8` |
| `open-hax/event-ledger` | `v0.1.0` | `8ad4c2a8abcb52f6ab96fcfb606d013f7f3b4029` |

event-ledger gained a root `deps.edn` (`:paths ["src"]`) and a committed
`dist/index.js` so npm git-ref installs need no JVM build. katamorph already
had a standalone `deps.edn` (`:paths ["src/cljs"]`).

Consumption coordinates:

```clojure
;; deps.edn (CLJS source, via shadow-cljs :deps true)
io.github.open-hax/katamorph    {:git/tag "v0.1.0" :git/sha "509878193515b199ce8477b3c2d583f0d5b32ac8"}
io.github.open-hax/event-ledger {:git/tag "v0.1.0" :git/sha "8ad4c2a8abcb52f6ab96fcfb606d013f7f3b4029"}
```
```json
// package.json (npm dist)
"@promethean-os/event-ledger": "github:open-hax/event-ledger#v0.1.0"
```

## Status

- **DONE — muse** (`octave-commons/muse`): switched `shadow-cljs.edn` to
  `:deps true`; new `deps.edn` with the two git deps + `thheller/shadow-cljs
  3.4.4` + malli/promesa/cider-nrepl/refactor-nrepl; `package.json`
  event-ledger dep → github ref; `bootstrap.sh` lost its eta-mu-sibling
  hard-fail + stub-source-path hack; `.cpcache/` gitignored. Verified:
  `shadow-cljs compile test` (124 tests, 0 failures, 0 warnings) and
  `compile daemon` both green; git deps resolve into `~/.gitlibs`.
- **PENDING — eta-mu** (`sol`, `Rheos`): still consume the packages via in-repo
  relative source-paths / pnpm `workspace:*`, and the local
  `packages/{katamorph,event-ledger}` dirs still exist (now duplicated by the
  standalone repos → drift risk). See child task
  `contracts-git-ref-extraction-eta-mu-consumers`.

## Acceptance criteria

- [ ] `sol` and `Rheos` consume katamorph/event-ledger by git ref (no relative
      sibling source-paths, no `workspace:*` to the local copies).
- [ ] `packages/katamorph` and `packages/event-ledger` removed from eta-mu;
      pnpm workspace + lockfile regenerated clean.
- [ ] `sol` and `Rheos` build + test green after the switch.
- [ ] No remaining build-critical reference to the in-repo copies (kanban/docs
      mentions are historical and out of scope).

## Notes

- Separately, muse carries schema **drift** (copied event-ledger schema, hand
  reimplemented append pipeline — see its `mongo/ledger.cljs` `ANOMALY` note).
  Reconciling that onto the real package is follow-up work, tracked when muse
  starts actually requiring katamorph.

---
Decision recorded 2026-07-12. muse portion DONE and verified (shadow-cljs compile test: 124 tests, 0 failures; compile daemon green; git deps resolve into ~/.gitlibs). Repos live: open-hax/katamorph @ 5098781 (v0.1.0), open-hax/event-ledger @ 8ad4c2a (v0.1.0). eta-mu sol/Rheos rewire + local-copy removal is the remaining slice (child task contracts-git-ref-extraction-eta-mu-consumers), deferred pending go-ahead.

Board triage 2026-07-19: all acceptance criteria verified against current tree, closing epic. (1) sol consumes both contracts by immutable git ref in packages/sol/deps.edn (katamorph v0.1.0@5098781, event-ledger v0.2.0@9e7fd43); Rheos no longer consumes event-ledger at all — replaced by the EDN-file open-hax.records.edn.event-admission adapter (rheos/backend/infra/ledger.cljs), stronger than the criterion. (2) packages/{katamorph,event-ledger} deleted (commit e9807ed); pnpm install --frozen-lockfile clean, 23 workspace projects. (3) Gates re-run 2026-07-19: sol test 88/256 0 fail + lint 0/0 + build 0 warn; Rheos test 58/166 0 fail + lint 0/0 + build server+cli 0 warn. (4) No build-critical refs to removed dirs (sol shadow-cljs.edn hits are comments; stale packages/rheos/package-lock.json deleted this session). muse portion was already done and verified. Follow-up (muse schema drift reconciliation) explicitly deferred per epic notes. Child card contracts-git-ref-extraction-eta-mu-consumers closed done today.
---