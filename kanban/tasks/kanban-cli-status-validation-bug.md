---
category: "tasks"
labels: ["tasks", "kanban", "bug"]
write-id: "1784485997083-0.x4dquzs22zhuheodb4p"
points: "1"
source: "user-report:2026-07-16"
title: "eta-mu kanban update-status accepts non-FSM statuses (e.g. in_review)"
priority: "P2"
status: "ready"
uuid: "kanban-cli-status-validation-bug"
created_at: "2026-07-16T00:00:00Z"
---

# eta-mu kanban update-status accepts non-FSM statuses

## Purpose

`eta-mu kanban update-status <uuid> <status>` does not validate `<status>`
against the canonical FSM state list
(`packages/rheos/src/rheos/backend/law/fsm.cljs` :states —
`icebox incoming accepted breakdown blocked ready todo in_progress testing
review document done rejected archived`). It happily accepted `in_review` (not a real
state, and not even a valid transition target from `review` back to itself)
for three cards, silently writing invalid frontmatter that the Rheos-hosted
board couldn't render or transition out of ("done" was unreachable from
`in_review`).

## Root cause

The `eta-mu kanban` CLI in this repo currently shells out to/still runs the
old `packages/legacy/kanban` (TS) implementation rather than the CLJS FSM in
`packages/rheos`, so none of `Rheos`'s FSM transition/validity checks apply.

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

---
Triage 2026-07-16: accepted. Real FSM-integrity bug — update-status/frontmatter accepts statuses outside the canonical set (e.g. in_review), which silently corrupts board state. Small, well-bounded fix: validate against the FSM status list in the CLI before writing. Related known CLI wart: comment subcommand absorbs trailing flags into the comment text — fix both in one pass or card the second separately.

Board triage 2026-07-19: bug is substantively FIXED by the rheos CLI cutover — eta-mu kanban frontmatter/update-status now routes through rheos.backend.law.fsm transition checks. Verified live: 'accepted -> in_review' rejected (Error: transition rejected: No transition from accepted to in_review); 'breakdown -> done' edge rejected. Status audit: all statuses on disk (done, rejected, icebox, accepted, testing, blocked, archived) are valid FSM states; zero in_review remnants. REMAINING for DoD: regression test for unknown-state rejection (fsm_test.cljs covers invalid edges between valid states, but no test for a non-FSM target like in_review) and non-zero-exit/no-write assertion at the tool layer. Moving to ready.

---