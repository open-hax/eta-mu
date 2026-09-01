---
category: "tasks"
type: "task"
write-id: "1788283153990-0.t4ijudfrn5rfs79e6z"
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
---