---
uuid: "rheos-github-issue-projection"
title: "Project canonical Rheos tasks to GitHub Issues"
status: "incoming"
type: "task"
priority: "P1"
points: "8"
category: "tasks"
write-id: "1786026522818-0.znue8j4451e0rfy8i7c"
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
