---
category: "tasks"
labels: "rheos, github, projection, policy"
dependency: ["rheos-preserve-inline-yaml-label-arrays"]
parent: "rheos-ledger-authoritative-projections"
type: "task"
write-id: "1788283882635-0.q69m5g4s3965ohbunm"
title: "Partition Rheos-owned GitHub labels"
priority: "P0"
status: "testing"
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
---