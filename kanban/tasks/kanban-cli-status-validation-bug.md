---
category: "tasks"
labels: ["tasks", "kanban", "bug"]
write-id: "1788040502942-0.zqjfasl0lvsjb684btj"
points: "1"
source: "user-report:2026-07-16"
title: "eta-mu kanban update-status accepts non-FSM statuses (e.g. in_review)"
priority: "P2"
status: "review"
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

Remaining DoD closed in PR #183 (branch fix/fsm-status-validation-tests). No production code changed — the 2026-07-19 triage was right that the rheos CLI cutover fixed the behaviour; the gap was that nothing HELD it. fsm_test only covered invalid edges between two VALID states, so a regression reintroducing a bogus target, or a write path that refused but wrote anyway, would have gone unnoticed until it corrupted the board a second time.

Pinned at three layers, because a refusal is only real if it holds at all three. (law) No state in either FSM reaches a status outside :states, valid-targets never offers one, and a card already stranded on a bogus status can reach nothing — the exact property that made the three in_review cards unrecoverable. (write path, new infra/transition_test.cljs) move-task! returns {:ok false}, card file byte-identical, no ledger event appended, nothing published. (tool, new infra/agent_tools_test.cljs) kanban_update_status throws :kind :refused — the kind cli/exit-codes maps to exit 3 — and writes nothing; a tool that refused but exited 0 would leave every scripted caller believing the move landed. Each refusal test is paired with a legal-move test so a write path that simply never writes cannot pass by doing nothing.

Proved the tests catch the original defect rather than merely describing it: with the FSM verdict bypassed in move-task!, they fail exactly as the bug behaved — in_review written into the card with a fresh write-id, a status-change event appended to the ledger, {:ok true} returned. Restored before commit; the diff touches only test/.

Scope item 2 (status audit): zero in_review remnants on disk; all 11 statuses in use across 282 cards are valid FSM states.

Evidence: 148 tests / 767 assertions green (was 138/476), clj-kondo 0 warnings (required rewriting two .then/.catch chains as async/await to satisfy the house rule), clean shadow-cljs build 0 compiler warnings, pnpm gates --base main 4/4 passed.

Found while working the card: the comment --text fix that landed in PR #182 was NOT live in eta-mu-beta — the global symlink points at packages/eta-mu/dist-cli, which had not been rebuilt since the merge, so the first comment attempt this session again recorded the literal string --text and returned ok true. The card file was repaired by hand and the CLI rebuilt (pnpm -C packages/rheos build && pnpm -C packages/eta-mu build), after which --text binds correctly. The fix was real; the stale local binary hid it. Worth noting that a merged fix to a mutation surface is not in force for agents until dist-cli is rebuilt.

Closure audit blocker 2026-08-29: keep open. The reported compatibility surface is eta-mu kanban update-status UUID STATUS, but the current bridge recognizes status-update and move only. update-status falls through to Rheos as an unknown verb, so invalid input is nonzero without exercising FSM refusal and legal legacy updates are broken. PR #183 tests status-update UUID --to STATUS, a different spelling. Add the legacy alias and end-to-end legal plus illegal no-write tests before closure.
---