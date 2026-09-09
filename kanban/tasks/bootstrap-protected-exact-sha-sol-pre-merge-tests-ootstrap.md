---
category: "tasks"
labels: "sol, ci, security"
dependency: []
type: "task"
write-id: "1788982702522-0.o27t34ymfskh0sj8xk"
title: "Bootstrap protected exact-SHA Sol pre-merge tests"
priority: "P1"
status: "review"
uuid: "sol-premerge-trust-bootstrap"
created_at: "2026-09-09T19:36:27.017Z"
---

# Bootstrap protected Sol pre-merge testing

## Outcome

Make exact-head Sol behavioral tests and server compilation available before merging PR #328 without exposing private dependencies or credentials to ordinary PR execution.

## Scope

Land a default-branch-only manual workflow, its deterministic trust/candidate guard, independent credential-free workflow contracts, and protected-environment setup instructions. A separate human approval of the exact candidate remains required before private source is fetched. Controller activation remains observe-only.

## Acceptance criteria

- Only fresh manual runs of current protected default-branch machinery can reach the protected job.
- A configured required human reviewer explicitly approves the candidate SHA; missing settings, bypass-only runs, reruns, or revision drift refuse execution.
- Fixed canonical dependencies are prefetched with a repository-scoped read token, which is revoked before approved candidate execution.
- Exact candidate lint, behavioral tests, and server build produce a result on that PR head from a fresh publisher runner without private artifacts or raw logs.
- Contract tests run on the bootstrap PR without requiring the unmerged controller package or private source.
- Document the remaining administrator settings and user approval; do not claim the Sol blocker resolved before actual exact-head behavioral evidence exists.

## Verification

Run the standalone Sol pre-merge contract suite, then require hosted checks and independent review on the bootstrap head. This task supports https://github.com/open-hax/eta-mu/pull/328 and is distinct from Services production activation.

---
Standalone bootstrap contracts pass 8/8 on this main-based checkout, using the unchanged public yaml dependency. The guarded workflow and fresh publisher are ready for independent review. This implements the trust-promotion mechanism only; administrator environment configuration, explicit exact-candidate human approval and actual Sol behavioral test/build evidence remain required before PR 328 can merge.

---