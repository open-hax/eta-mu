---
uuid: "ledger-recorded-content-hash-gate-results"
title: "Ledger-recorded, content-hash gate results"
status: "incoming"
type: "task"
priority: "P0"
points: "8"
labels: "gate, ledger, hashing, tooling, babashka, ci"
category: "tasks"
write-id: "1785441313938-0.cef41j5680i2pa2jz90"
created_at: "2026-07-30T19:55:13.938Z"
---

# Ledger-recorded, content-hash gate results

## Outcome

The gate knows what it already proved. A verification result is a ledger fact
keyed by content hash, so re-running the gate on an unchanged tree answers
"this branch is fine" immediately instead of rebuilding and retesting work whose
inputs did not move.

## Why

Today `bb scripts/test.bb` re-runs all eleven suites unconditionally, and the
promethean FSM's `in_progress -> review` build gate shells out to
`pnpm build && pnpm lint && pnpm test` on every single card move. Promoting three
cards from one commit means running an identical monorepo gate three times. On
2026-07-30 that is exactly what happened: the gate was run once by hand, one card
was promoted through the FSM gate for real, and the other two were moved with a
comment citing that run — because re-proving the same tree twice more was waste.
That workaround is the smell this card removes.

The evidence is already ledger-shaped. Rheos has an append-only event ledger,
`scripts/ultra.bb` already journals subagent work by content hash, and
[[rheos-ledger-authoritative-projections]] is making accepted ledger events the
board's authority. Gate results belong in the same substrate.

## Model

- **A verification claim** is `{:target <what ran> :inputs-hash <hash> :result
  pass|fail :evidence <summary> :at <time> :by <actor>}`.
- **The inputs hash is per-target, not per-repo.** A rheos-only change must not
  invalidate sol's proof. Hash each package's own source, test, and config paths
  plus its resolved dependency set — the same tree walk that decides whether the
  package needs rebuilding.
- **Transitive invalidation follows the dependency graph.** Changing
  `@open-hax/protocols` invalidates rheos, because rheos consumes it through
  shadow-cljs source paths. The graph has to come from the real build config
  (`pnpm-workspace.yaml` plus each `shadow-cljs.edn` `:source-paths`), not a
  hand-maintained list that will rot.
- **Only passes are cacheable.** A recorded failure is informative but must never
  short-circuit a re-run; a fixed input produces a new hash anyway.
- **The record is git-visible and branch-scoped**, so checking out another branch
  produces that branch's proofs, matching the authority model in
  [[rheos-ledger-authoritative-projections]].

## Scope

- Define the verification-claim event shape and where it lives (reuse the Rheos
  ledger and its envelope rather than inventing a second event store; decide
  explicitly whether these are `kanban.*` events or a sibling stream).
- Compute per-target input hashes in Babashka, in a form the same pure fold can
  run under nbb/bb/JVM.
- Derive the dependency graph from build config, and invalidate transitively.
- Teach `scripts/test.bb` and `scripts/lint.bb` to skip a target whose current
  hash already has a recorded pass, reporting `cached` distinctly from `passed` —
  a skipped suite must never be silently indistinguishable from a run one.
- `--force` / `--no-cache` to re-run regardless, and a `--why` that prints which
  input changed to invalidate a target.
- Teach the FSM build gate to consult the record, so promoting N cards from one
  tree costs one verification, not N.
- Record what the gate could not prove (a suite that errored, a target with no
  recorded inputs) as explicitly unproven rather than absent.

## Non-goals

- A general remote build cache (Nx/Turbo/Bazel). This is about not re-proving an
  unchanged tree locally and in the FSM gate.
- Caching `pnpm build` artifacts. Only verification *results* are cached here;
  build output caching is a separate concern.
- Replacing CI. GitHub Actions may consume the same records later, but this card
  is the local and FSM path.

## Acceptance criteria

- Running the gate twice on an unchanged tree: the second run performs no
  compilation and reports every target as `cached`, in a small fraction of the
  first run's wall time.
- Touching one file in `packages/rheos/src` invalidates rheos and leaves the
  other ten targets cached.
- Touching `packages/protocols/src` invalidates protocols *and* rheos, proving
  transitive invalidation works off real build config.
- A recorded failure never satisfies the gate.
- `--force` re-runs everything and rewrites the records.
- `--why <target>` names the changed input.
- Promoting three cards from one commit runs the underlying verification once.
- Deleting the records loses no correctness — only speed.
- `cached` and `passed` are visually distinct in the summary, and a target with
  no proof is reported as unproven rather than omitted.
- The hash and fold logic are pure and unit-tested independently of the shell-out.

## Open questions for the ready gate

1. Do gate claims belong in the Rheos board ledger, or a sibling
   `.events/verification.edn`? Board events are card-scoped; these are
   tree-scoped. Recommendation: a sibling stream sharing the envelope, so the
   board fold stays about cards.
2. Does the FSM build gate trust a claim recorded by a different actor (another
   agent, another worktree, CI), or only its own? Recommendation: trust any claim
   whose inputs hash matches, and record the actor so a bad trust decision is
   auditable after the fact.
