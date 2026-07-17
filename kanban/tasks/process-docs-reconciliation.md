---
category: "tasks"
labels: ["tasks", "docs", "process", "kanban"]
write-id: "1783699678615-0.d04b8lks3484r5duo8"
points: "3"
source: "board triage session 2026-07-10"
title: "Reconcile PROCESS.md with promethean FSM law; refresh AGENTS.md board workflow; add CLAUDE.md"
priority: "P1"
status: "done"
uuid: "process-docs-reconciliation"
created_at: "2026-07-10T00:00:00Z"
---

# Reconcile process documentation with the running system

## Context

The 2026-07-10 triage session surfaced drift between the documented process and the
system that actually enforces it:

- `PROCESS.md` describes the flow `In Progress → In Review → Testing → Document`,
  but the promethean FSM in `packages/rheos/src/rheos/backend/law/fsm.cljs` enforces
  `in_progress → testing → review → document`, gates `in_progress → review` directly
  behind a build-gate command check, and allows `blocked → ready` (not just breakdown).
- `AGENTS.md` documents the kanban workflow only abstractly; the concrete operations
  (Rheos CLI from the repo root, lawful multi-hop walks, ledger provenance) are undocumented,
  so agents rediscover them each session.
- The TS-line-count baseline update procedure for intentional TS changes exists only
  in the guard script's error message.
- There is no `CLAUDE.md`, so Claude Code sessions start without repo-specific bearings.

## Acceptance

- [ ] PROCESS.md FSM diagram + transition rules match `law/fsm.cljs` (promethean),
      and name that file as the enforcement source of truth.
- [ ] AGENTS.md gains a "Board operations" section: Rheos CLI usage (repo root cwd
      requirement), lawful transitions, comments-as-provenance, snapshot regeneration.
- [ ] AGENTS.md documents the `.ts-line-count-baseline` update procedure.
- [ ] CLAUDE.md exists, defers to AGENTS.md, and covers harness-specific bearings
      (pnpm-only, CLJS-only, board workflow pointers, receipts + mycology liturgy).

---
Agent process pass 2026-07-10: selecting this in-progress P1/3pt task. Scope slice: reconcile PROCESS.md FSM diagram and transition rules with packages/rheos/src/rheos/backend/law/fsm.cljs (promethean), add AGENTS.md 'Board operations' section + TS baseline update procedure, and create CLAUDE.md. Will verify with clj-kondo/lint gates if touched packages support it.

Slice delivered 2026-07-10: PROCESS.md FSM diagram + transition rules reconciled with promethean law (packages/rheos/src/rheos/backend/law/fsm.cljs); added Board Operations section + TS baseline update procedure to AGENTS.md; created CLAUDE.md. Moved to testing for review.

Build gate passed; card moved to review. All acceptance criteria satisfied: PROCESS.md reconciled, AGENTS.md updated with Board Operations and TS baseline procedure, CLAUDE.md created.
---