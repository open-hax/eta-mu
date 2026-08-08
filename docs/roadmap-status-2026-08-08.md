# Roadmap status correction — 2026-08-08

Status: provisional synthesis. This note corrects time-sensitive roadmap status claims without changing architecture ownership or promoting any proposal.

## Why this note exists

`ROADMAP.md` was last surveyed on 2026-08-06. Several status statements in its current-state section have since become stale while the underlying sequencing and ownership model remains materially unchanged.

This note is intentionally additive. It preserves the existing roadmap text as revision-scoped evidence and records the newer implementation state until the hub itself is refreshed.

## Verified status changes

### Rheos lifecycle/config stack

The roadmap currently says the remaining order is `#158 -> #169`, with #158 not yet landed and #169 waiting on it.

Both are now merged on `main`:

- eta-mu PR #158 — `feat(rheos): prefer EDN config and define ledger-authoritative projections` — merge commit `14cd09d3eaba75160cb565c7eb459716e73b225e`.
- eta-mu PR #169 — `docs(rheos): render help from one registry and write the CLI reference` — merge commit `7c6d8a37ceaa07d1e6c56c9ca546d8e540b42119`.

Interpretation: the earlier dependency warning was valid at the time it was written, but is stale implementation evidence now. It should not be repeated as current state.

### Agent operating standard

The roadmap currently says PR #170 is not on `main` yet.

PR #170 has merged as `cd99ff924169d5fe0e316c78b873e270b6eda42c`.

Interpretation: the presence of the merged operating-standard material is implementation/documentation fact. Merge status alone does not establish operator acceptance of every proposed policy or ownership statement inside it.

### Rheos refusal law

PR #183 has merged as `8e584a550ccb7d85f6223adbd5b178072a6750ce`.

It adds enforcement at three layers for invalid FSM targets:

- the FSM law must never offer a target outside the state set;
- the write path must refuse without mutating the card or appending a ledger event;
- the CLI/tool surface must propagate refusal as exit code 3 rather than success.

This strengthens the roadmap's existing rule that compliance work should ship enforcement rather than cleanup-only documentation. It does not introduce a new center or ownership boundary.

## Architecture status unchanged by these merges

The following remain navigation/architecture claims requiring their own authority and evidence:

- Katamorph owns shared contract vocabulary and law.
- Muse owns host assembly/projection rather than contract meaning or the turn loop.
- Turn Processor owns the host-neutral turn lifecycle; Sol is a deployed transport/service composition of it.
- eta-mu remains the CLJS runtime/coordination center.
- Knoxx remains a downstream composition target for the still-moving upstream seams.
- Epiphany remains a complementary JVM-specific center and long-view normalization/promotion center; eta-mu implementation repetition alone does not promote a shape into Epiphany authority.

## Open candidate, not promoted

eta-mu PR #181 (`feat(workflows): one workflow resource, two targets`) remains a bounded promotion candidate. It proposes one workflow resource projected to both GitHub Actions and local gates, with the portable vocabulary associated with Katamorph and host projection associated with Muse. Until merged and separately accepted where architecture authority requires it, treat that split as proposal/open-branch evidence rather than settled architecture.

## Cross-repository observations

- Epiphany PR #10 has merged a revision-scoped Knoxx translation-boundary triage note. That merge makes the note discoverable current documentation; under Epiphany's process charter it does not by itself promote the note's interpretations into accepted architecture.
- Muse `main` has no newer implementation commit than `76c57712a48ef48100259231a2e9d54069c2b14a` in this survey, so eta-mu's newer workflow-projection work must not be described as already implemented in Muse.
- Knoxx, services, and OpenPlanner showed no newer center-boundary implementation after the previously reviewed August 5/1 changes in this survey. Their existing evidence remains revision-scoped and should be rechecked when their heads move.

## Disposition

This is a bounded status correction only. Do not use it as authority to change the roadmap's ownership table, promote PR #181, or infer Epiphany adoption. When `ROADMAP.md` is next surveyed, fold the verified status changes into its current-state section and retire this note by reference rather than deleting it.