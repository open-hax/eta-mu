---
category: "tasks"
labels: "tests, fixtures, receipt-river"
type: "task"
write-id: "1789172529448-0.62vxa0k94yg2hwl7hud"
title: "Repair Receipt River discovery concurrency fixture"
priority: "P1"
status: "review"
uuid: "repair-receipt-river-discovery-concurrency-fixture"
created_at: "2026-09-12T00:20:00.890Z"
---

Reproduce the Receipt River supplemental test failure using its actual package test command. The prior clean-cache attempt reported that compiled discovery calls the two-argument dispatch property of git/exec-at, while the delayed fixture replaces that multi-arity function with a single-arity function.

Scope: Receipt River fixture only unless reproduction proves a production defect. Preserve the existing nine-repository discovery assertions and bounded-but-parallel execution assertions. Match the real boundary's supported arities rather than disabling compiler dispatch, changing global settings or bypassing the behavior being tested.

Acceptance: record the original failure, prove the minimal correction through the unchanged assertions, run package tests, production build and lint/boundary gate, and record exact evidence. No unrelated package changes.

Delegation: a read-only reviewer checks the fixture and production boundary independently while the coordinator handles reproduction, board state and the scoped edit.

---
Reproduced pnpm test failure on the original fixture: compiled exec-at arity-2 dispatch is missing on its single-arity replacement. Corrected only delayed-git to support the production 2/3 arities; its timers, returned values and all existing assertions remain unchanged. Package pnpm test passes25tests88assertions with0compiler warnings; lint:kondo passes0errors0warnings plus extern-boundary gate. Production pnpm build release also checked. Evidence receipt-river-fixture-{repro,test,lint,build}. Independent review confirmed normal discovery batching remains four repositories times six command promises; this test does not claim strict OS-process bounds during timeout termination.
---