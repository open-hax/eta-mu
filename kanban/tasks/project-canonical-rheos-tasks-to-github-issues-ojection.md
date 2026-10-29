---
category: "tasks"
type: "task"
write-id: "1788288852261-0.byysigl2dpqnfa2vgzc"
points: "8"
title: "Project canonical Rheos tasks to GitHub Issues"
priority: "P1"
status: "incoming"
uuid: "rheos-github-issue-projection"
created_at: "2026-08-06T14:28:42.818Z"
---

# Project canonical Rheos tasks to GitHub Issues

## Outcome

GitHub Issues are a **projection** of canonical Rheos task objects, not a second
place where board truth is authored. Rheos owns the projector; the deprecated
TypeScript implementation in `packages/legacy/kanban` no longer runs it.

Authority order: canonical Rheos task objects → validated projection plan →
GitHub Issues.

## Why this card exists

The work was implemented and opened as PR #176 with no card behind it — the only
open PR in that state. This card is the board's record of it, written after the
fact so the projection has an owner and a place for its follow-ups.

## Scope

- A Rheos-native GitHub Issues projector keyed by task UUID markers.
- A dedicated CLJS executable for live and dry-run projection.
- Port from the deprecated TypeScript implementation: label creation, issue
  create/update, done/rejected closure, managed reactivation, pagination,
  throttling, write limits.
- Normalize legacy status aliases before projection (`pending` → `incoming`,
  `completed` → `done`).
- Replace the reusable legacy workflow with an exact-ref Rheos workflow.
- eta-mu becomes the first scheduled consumer, pinned to the caller's immutable
  `github.sha`.
- Validate canonical snapshot UUIDs and reject duplicate active issue claims
  before any issue write.
- Use the caller's scoped `GITHUB_TOKEN`; no inherited app credentials.

## Non-goals

- Rolling the workflow out to sibling repositories. The premature
  cross-repository rollout PRs were closed; eta-mu proves it first.
- Treating GitHub Issues as writable board state. Nothing reads issue edits back
  into Rheos under this card.

## Acceptance criteria

- A dry run against the live repository plans the convergence without writing.
- Duplicate active issue claims for one task UUID are refused before any write.
- Historical drift events are preserved as audit evidence rather than replayed
  as current drift.
- The `bundle` gate is green, including the legacy workflow-scoping test that
  guards the `tasks-dir` containment check.
- Snapshot, drift-history, and sync-plan evidence is uploaded per run.

## Notes

The natural parent epic is `rheos-ledger-authoritative-projections`, which is
still unmerged on `feature/rheos-edn-config` (PR #158). Re-parent this card if
and when that epic lands on `main`.

---
Merged to main (PR #176) on 2026-08-06. The card was written after the fact — this PR was the only open one with no board record — so it lands `incoming` while its work is already on main.

Gate fixed on the way in: `bundle` was failing because `packages/legacy/kanban/tests/kanban-sync-workflow.test.ts` still asserted the TypeScript-era interpolation in `.github/workflows/kanban-sync.yml`, which this PR replaced. The test now tracks the guard as written and covers both containment refusals, which it never did before.

Follow-up owned here: reconcile status with reality, and re-parent under `rheos-ledger-authoritative-projections` if #158 lands.

Successor ownership work is now tracked by rheos-github-label-ownership; it remains blocked on rheos-preserve-inline-yaml-label-arrays / GitHub issue #320 until the shared repair branch proves both invariants.

Successor PR #322 exact-head evidence: dry-run now enforces the live write-budget selector and reports real deferred operation/write counts while remaining effect-free; ownership evidence is authoritative only in the expected managed-header position; malformed bracket arrays remain omitted across both readers. Verified by 197 Rheos tests / 1006 assertions, clj-kondo 0 errors / 0 warnings, and four release builds with 0 warnings.

Final PR #322 review gate: Rheos comment serialization now preserves a blank line before the closing delimiter, and this card was rewritten through the ledger-backed CLI to normalize its evidence block. Final combined evidence: 197 Rheos tests / 1009 assertions, clj-kondo 0 errors / 0 warnings, and server, CLI, GitHub-sync, and app release builds with 0 warnings.

---
## Scoped runtime repair — 2026-10-24

User story: as an operator of the canonical Rheos GitHub projection, I need the
shared sync runner to install its declared Clojure CLI dependency so scheduled
syncs can reach the build instead of failing before projection.

Evidence: run 40108987314 reached the Rheos build and reported
`Executable 'clojure' not found on system path.` The owning GitHub sync CI
workflow already installs CLI 1.12.5.1654 with an immutable setup action pin;
the reusable live workflow only installs Java, pnpm, and Node.

Plan and acceptance: reuse the owning CI's pinned Clojure CLI setup before the
Rheos build; explicitly verify the CLI with `clojure -Sdescribe`; retain the
existing build and projection arguments. Validate YAML, shell syntax, and diff
locally, then require hosted build and dry-run evidence before claiming restored
sync. Do not execute write-mode projection during this repair. Card status is
unchanged; this scoped continuation does not claim completion.

### PR #365 regression continuation — 2026-10-24

Native MiMo review 5639505463 on `cd41fde12a5e6c820285bf00ddd9a214b4b23741`
identified that the existing legacy workflow test only protects tasks-dir
containment. Extend that owning test to require the immutable Clojure setup
action, declared CLI version, and actual `clojure -Sdescribe` verification before
the shadow-cljs build. Establish RED against the pre-repair workflow and GREEN
against this patch without changing workflow behavior or dependency access.

Focused continuation verification: lock-resolved Vitest 2.1.9 runs the owning
workflow file with 2 tests passing. The same new test against pre-repair workflow
`7112c36440d180ca183d6a3f89661cee161fdae5` fails because the install step is
absent (1 pass, 1 causal failure); the containment test still passes. Pinned
Biome 2.3.5 reports zero warnings and no fixes on the touched test. The old
literal GitHub-expression assertion is written as equivalent concatenated text
to remove its preexisting Biome warning without changing its expected bytes.
No runtime behavior, authentication, card status or historical receipt changes.

### PR #365 canonical regression and action-pin repair — 2026-10-25

Native CodeRabbit review 5641558743 at `2b6af76d1d0a2b194e18f98778b16a3ed56db241`
identified the setup action SHA/version mismatch (comment 4369675135) and the
new regression's placement under legacy TypeScript (comment 4369675137).
Plan: align only the shared sync and its owning Rheos CI action pins with native
release tag `13.4` (`3fe9b3ae632c6758d0b7757b0838606ef4287b08`); move the
install/verify/build regression to a nonlegacy NBB ClojureScript suite; register
it with the root test runner and run/lint it in the owning CI. Preserve the
preexisting legacy containment test, all sync arguments and permission gates.
Verify causal RED against unchanged source and missing/reordered steps, GREEN
against the candidate, and retain a new receipt without rewriting earlier ones.

Verification: unchanged exact-head source fails only the two expected action-pin
assertions (3 tests / 7 assertions, 2 failures, zero errors, exit 1). Candidate
passes all 3 CLJS tests / 7 assertions through the registered root BB suite.
Seven causal controls (pre-runtime base, missing install/verify, reversed order,
CLI version, verification command and build command) each fail with exit 1 and
zero runtime errors. Retained legacy containment: Vitest2.1.9 1testPASS.
Clj-kondo2025.10.23 newCLJS/rootBB: zero errors/warnings. Biome2.3.5 with
repository configuration passes the legacy test. Both YAML files and 24 shell
blocks parse. New immutable evidence: `.ημ/sessions/2026-10-24-rheos-sync-clojure/review-followup-20261025.edn`.
Full repository gates and new-head hosted qualification remain pending; no
restored-sync, downstream dry-run or card-transition claim. Historical receipts
retain their original bytes.

### PR #365 integration continuation — 2026-10-26

Plan: integrate main `ad93a9cb786da61be9021d1f00b80b811463dfc7` into
current candidate `cbb6f616b5470bf023782933b9a5ca6c391587c8` with an ordinary
two-parent merge. Preserve main's reviewed assessment-timeout changes and the
existing shared-runtime repair. Resolve the two append-only ledger conflicts
by retaining every branch byte and appending main's divergent suffix after the
common merge-base prefix; preserve each original record byte and timestamp.
Verify both histories are retained, no unrelated source is changed beyond the
automatic merge, and the owning workflow contract, YAML and shell checks pass.
New-head hosted checks and reviews remain required; earlier approvals become
historical evidence. Do not expand dependency credentials, change card status,
or claim a complete reusable-workflow build or downstream dry run.

Integration verification: the owning NBB workflow contract passes 3 tests / 7
assertions with zero failures/errors; clj-kondo reports zero errors/warnings.
Six workflow YAML documents and 75 shell blocks parse. Byte proofs retain the
entire current-PR ledger prefixes and exact main divergent suffixes. Evidence:
`.ημ/sessions/2026-10-26-rheos-sync-integration/receipt.edn`. Full workspace gates and new-head hosted qualification remain
pending; no board transition or downstream execution is claimed.

### PR #365 evidence readability follow-up — 2026-10-26

Plan: address CodeRabbit review 5654055760, finding 4378734901, by appending
one readable clarification to the mycology ledger. Preserve every previous
byte in both ledgers and this card, including its frontmatter. Verify the
historical line reference against commit
`e83b323baadf5bea8d5406bc0f38a52b6445b53e`; expand the test, lint and shell
counts as descriptions of retained evidence. Append a canonical Receipt River
observation and a standalone immutable receipt. Validate the new record using
`record-errors`, confirm unchanged prefixes and frontmatter, and run
`git diff --check`. This documentation change does not rerun runtime tests or
qualify hosted checks, native approval, caller execution or a board transition.

Verification: the historical Git source confirms the referenced row and its
2026-10-25T11:30:32.482221Z timestamp. The new standalone observation parses
and passes canonical `record-errors` validation with no errors. It is identical
to the single record appended to `receipts.edn`. Byte comparisons preserve the
complete previous contents of both ledgers and this card; frontmatter is
unchanged. `git diff --check` passes. Only the four planned documentation and
evidence paths changed. Runtime suites were not rerun. Immutable evidence:
`.ημ/sessions/2026-10-26-rheos-sync-readability/receipt.edn`.

### PR #365 public dependency review follow-up — 2026-10-29

Plan: verify native review 5690653497 / finding 4406852108 against the pinned
public Katamorph dependency. Permit anonymous Git reads when App credentials
are absent in the owning Rheos sync CI and its declared toolchain; retain
token validation and scoped authenticated Git configuration when available.
Keep real local dependency reachability tracking, all verification gates and
the existing cleanup. Add an owning ClojureScript regression that executes
the actual YAML and resource shell programs in isolated credential-free Git
homes, demonstrate unchanged-source RED and corrected GREEN, and check both
anonymous and authenticated paths plus missing-token refusal and cleanup.
Update only the affected generated Rheos workflow projection, preserving
unrelated action pins. Append verification evidence without rewriting earlier
card, ledger or receipt bytes. New-head hosted checks and native reviews,
actual caller dry runs and any lawful board transitions remain separate.

Verified scoped result (2026-10-29T02:14:06.619Z): final owning regression passes 6 tests
and 54 assertions. The identical final test fails against unchanged base5e0
with 10 expected failures (six anonymous branches and four trigger/resource
expectations), zero errors. Workflow contract tests pass 6 tests/78 assertions;
the registered root BB suite passes; clj-kondo reports zero errors/warnings.
Actual projection check passes for all emitted workflows and the 10-gate plan;
two changed YAML documents and 26 shell blocks parse. Anonymous reads create
no header; configured credentials without a token still fail; a synthetic
token configures auth without logging it and actual cleanup removes it.
The public dependency reachability gate and every runtime gate remain.
Full workspace/hosted gates, current-head native reviews and actual caller
dry runs remain outstanding. No approval, merge or board transition claimed.
Immutable validation receipt: `.ημ/sessions/2026-10-29-rheos-public-dependency/receipt.edn`.
