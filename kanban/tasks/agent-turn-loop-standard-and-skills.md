---
category: "tasks"
labels: "process, skills, receipts, session-mycology, turn-loop, packages"
parent: "agent-operating-standard"
type: "task"
points: "5"
source: "user-request:2026-07-30"
title: "Write the agent turn loop down and update the global ledger skills to it"
priority: "P0"
status: "incoming"
uuid: "agent-turn-loop-standard-and-skills"
created_at: "2026-07-30T18:06:00Z"
---

# Write the agent turn loop down and update the global ledger skills to it

## Outcome

The turn loop is a written contract, and the two global skills that own the ledgers
enforce it and invoke the shipped packages instead of describing hand-edited files.

The loop:

1. **Session start** — read `.ημ/session-mycology/ledger.md`, the spores under
   `.ημ/session-mycology/spores/`, and `receipts.edn` before substantive work.
2. **Every turn end** — commit the work.
3. **Every turn end** — run the `session-mycology` retrospective.

## Why

The ledger protocol packages landed (`ledger-protocol-packages-first-vertical-slice`,
done) but nothing routes agents to them, so agents keep appending ledgers by hand and
inconsistently. And with no commit required at turn boundaries, work accumulates in the
working tree — which on 2026-07-30 is how a merge tool swept the 2026-07-29 FSM rescope
decisions and the `workflow-dsl-kanban-reference` epic into an auto-stash that referenced
them from no branch at all.

## Current state

- `~/.agents/skills/receipt-river/SKILL.md` and `~/.agents/skills/session-mycology/SKILL.md`
  describe file-based records; neither mandates a per-turn commit, nor a session-start read,
  nor invoking a package CLI.
- The packages exist and have CLIs: `packages/receipt-river/src/cljs/eta_mu/receipt_river/infra/cli.cljs`,
  `packages/session-mycology/src/cljs/eta_mu/session_mycology/infra/cli.cljs`,
  `packages/fork-tax/src/cljs/eta_mu/fork_tax/infra/cli.cljs`.
- Repo-side rules now live in `AGENTS.md` § **Session and Turn Discipline** (this branch).

## Scope

- [ ] Update the global `receipt-river` skill: read at session start, append through
      `eta-mu-beta receipt ...` from the repository root, never hand-edit `receipts.edn`.
- [ ] Update the global `session-mycology` skill: read ledger + spores at session start,
      run the retrospective at **every** turn end via `eta-mu-beta session ...` from the
      repository root, and keep the "no promotion in the session that created the spore"
      rule.
- [ ] Both skills state the commit-every-turn and worktree rules, and point at
      `AGENTS.md` as the repo-side authority rather than restating it divergently.
- [ ] Verify each documented command against a fresh build of this tree through
      `eta-mu-beta` before shipping the skill — no skill may reference a verb the local CLI
      does not have.
- [ ] Reconcile with the `fork-tax` and `fork-tax-concurrent-agent-guardrails` skills so
      the three do not give conflicting staging advice.

## Done when

A fresh session, given only these skills, opens by reading the ledgers and closes each
turn with a commit and a recorded retrospective — without the user asking.

## Notes

The global skills are outside this repo (`~/.agents/skills/`). Record in this card which
skill files changed and at what revision, since that edit cannot be captured in this
repo's PR diff.
