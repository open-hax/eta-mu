---
category: "tasks"
labels: "rheos, github, projection, policy"
dependency: ["rheos-preserve-inline-yaml-label-arrays"]
parent: "rheos-ledger-authoritative-projections"
type: "task"
write-id: "1788290511137-0.hossg9eyd1jwy3fd8rc"
title: "Partition Rheos-owned GitHub labels"
priority: "P0"
status: "review"
uuid: "rheos-github-label-ownership"
created_at: "2026-09-01T17:18:23.185Z"
---

# Partition Rheos-owned GitHub labels

## Outcome

The outward Rheos projector reconciles only labels it owns and preserves unmanaged human labels, `eta-mu:*` command labels, and reserved `deploy` intent.

## Scope

- Define a versioned pure label-ownership policy.
- Treat `kanban`, `status:*`, and `priority:*` as structural projection labels.
- Recover previously projected task labels from the managed issue marker/body.
- Refuse protected labels in canonical task metadata.
- Apply additive and named-delete GitHub label deltas; never replace the complete vector.

## Acceptance criteria

- Status changes preserve human, command, and reserved labels.
- Stale projection-owned task labels are removed without erasing unmanaged labels.
- `eta-mu:*` and `deploy` cannot be projected from canonical task labels.
- Reconciliation is idempotent and no title/body/state PATCH includes `labels`.
- Focused and package gates pass without warnings.

---
The #320 dependency is satisfied within this same atomic candidate and verified before unblocking. Projection now preserves unmanaged, eta-mu:* command, and deploy authority; additive/delete ordering is retry-recoverable; the real deploy-labelled board card remains safe. Full Rheos tests, kondo, builds, and diff check are green.

Scope refinement discovered during implementation: a real canonical card already carries deploy as task metadata, so rejecting the whole projection would create a board-wide outage. The safe law treats protected canonical labels as inert: they are filtered from desired projection and never added or removed. This satisfies the authority boundary while preserving existing cards; the immutable task-created event retains the original hypothesis.

Hosted review finding resolved before merge: the full reconciliation plan is now preflighted against --max-writes. Any logical issue operation larger than the configured budget refuses the sync before all writes and reports the issue plus required/configured counts. Regression covers 53 writes from 51 stale managed labels and proves no fitting prefix operation is applied. Verified by 192 Rheos tests / 973 assertions, zero failures; clj-kondo zero errors/warnings; four production release builds zero warnings.

Exact-head review regressions fixed: projected ownership now uses a strict EDN marker over normalized non-protected labels; malformed markers fail closed without legacy fallback; embedded backticks cannot create wrongful human-label deletion. Verified 195 tests / 992 assertions, zero failures; clj-kondo 0 errors/warnings; four release builds 0 warnings.

Hosted exact-head review follow-up resolved: the first structural ownership-marker line is now authoritative. A malformed first record cannot be skipped in favor of a later valid-looking marker embedded in task content, so unmanaged labels remain unclaimed. Verified 195 tests / 994 assertions, zero failures; clj-kondo 0 errors/warnings; four release builds 0 warnings.

Exact-head PR #322 review follow-up: ownership v1 evidence is accepted only at managed header line 2 immediately after the UUID sync marker, so a pre-v1 task-content marker cannot claim or delete a human label. Dry-run now executes the same budget preflight and selection as live mode and reports actual deferrals while applying no writes. Combined candidate verified by 197 Rheos tests / 1006 assertions, clj-kondo 0 errors / 0 warnings, and four release builds with 0 warnings.

Final PR #322 review gate: Rheos comment serialization now preserves a blank line before the closing delimiter, and this card was rewritten through the ledger-backed CLI to normalize its evidence block. Final combined evidence: 197 Rheos tests / 1009 assertions, clj-kondo 0 errors / 0 warnings, and server, CLI, GitHub-sync, and app release builds with 0 warnings.

Final exact-head PR #322 review findings resolved: label policy and ownership admission now live in law while domain owns normalization/reconciliation; URI component encoding is isolated behind an extern adapter with direct reserved-character and Unicode coverage; all legacy backtick ownership is untrusted, while a two-pass regression proves structural-v1 migration preserves unproven labels and later removes only v1-proven labels. Verified by 202 Rheos tests / 1031 assertions, clj-kondo 0 errors / 0 warnings, and server, CLI, GitHub-sync, and app release builds with 0 warnings.

---