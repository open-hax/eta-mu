---
uuid: "kanban-cli-status-validation-bug"
title: "eta-mu kanban update-status accepts non-FSM statuses (e.g. in_review)"
status: "incoming"
priority: "P2"
labels: ["tasks", "kanban", "bug"]
created_at: "2026-07-16T00:00:00Z"
source: "user-report:2026-07-16"
points: 1
category: "tasks"
---

# eta-mu kanban update-status accepts non-FSM statuses

## Purpose

`eta-mu kanban update-status <uuid> <status>` does not validate `<status>`
against the canonical FSM state list
(`packages/Rheos/src/rheos/backend/law/fsm.cljs` :states —
`icebox incoming accepted breakdown blocked ready todo in_progress testing
review document done rejected`). It happily accepted `in_review` (not a real
state, and not even a valid transition target from `review` back to itself)
for three cards, silently writing invalid frontmatter that the Rheos-hosted
board couldn't render or transition out of ("done" was unreachable from
`in_review`).

## Root cause

The `eta-mu kanban` CLI in this repo currently shells out to/still runs the
old `packages/legacy/kanban` (TS) implementation rather than the CLJS FSM in
`packages/Rheos`, so none of `Rheos`'s FSM transition/validity checks apply.

## Scope

- [ ] Route `eta-mu kanban update-status` through the same FSM validity check
      Rheos already implements (`rheos.backend.law.fsm/transition-decision`
      or equivalent), rejecting unknown states and invalid from→to edges.
- [ ] Fix or confirm no other cards currently hold invalid statuses
      (`grep -rn 'status: "\?in_review"\?' kanban/`).
- [ ] Add a regression test: `update-status <uuid> in_review` (or any
      non-FSM string) exits non-zero and does not write the file.

## Also noted

`eta-mu kanban comment` absorbing trailing flags into the comment text is a
separate, previously-noted CLI bug (see
`kanban/epics/coding-agent-cljs-rewrite.md`, 2026-07-15 triage) — same
symptom class (legacy CLI not enforcing the newer CLJS contract).

## Verification

```bash
eta-mu kanban update-status <any-card> in_review   # should fail, currently succeeds
grep -rln 'status: "\?in_review"\?' kanban/         # should be empty after fix
```
