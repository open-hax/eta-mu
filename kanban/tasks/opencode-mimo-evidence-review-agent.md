---
category: "tasks"
labels: ["tasks", "github", "opencode", "review", "automation"]
write-id: "1792074124245-0.wb098kj2qw9bu86v9bq"
points: "5"
source: "operator request 2026-07-27"
title: "Build an evidence-first OpenCode GitHub review agent using MiMo V2.5 Free"
priority: "P1"
status: "in_progress"
uuid: "opencode-mimo-evidence-review-agent"
created_at: "2026-07-27T20:35:40Z"
---

# Build an evidence-first OpenCode GitHub review agent

## Context

The existing OpenCode PR workflow uses a broad senior-maintainer prompt with Kimi and has
no automatic pull-request trigger on the current default branch. Broad open-ended review
invites generic criticism and false positives, especially from free models.

The requested replacement uses `opencode/mimo-v2.5-free` as a bounded GitHub reviewer.
Review quality is treated as the product of repository context, behavioral reasoning, and
an explicit evidence threshold. Repeated same-model consensus is not treated as proof.

The reviewer also needs the operator's portable process and compatibility surfaces without
turning those surfaces into new semantic authorities. `octave-commons/muse` therefore
compiles a restricted observer-only OpenCode plugin, while `riatzukiza/.agents` supplies the
external skills tree. Muse remains a compiler/projection boundary; skills remain method and
environment guidance rather than evidence.

## Scope

- Keep centralized review logic in eta-mu, consistent with the GitHub automation ownership
  boundary.
- Produce deterministic install/lint/test/build evidence before model review.
- Compile a pinned Muse profile containing only existing-state observer tools.
- Mount a pinned `riatzukiza/.agents` checkout at OpenCode's `~/.agents/skills` discovery
  path.
- Add one read-only OpenCode primary agent with a finite review state machine.
- Require adversarial validation before a candidate can become a reportable finding.
- Publish only changed-line, evidence-backed defects as inline comments.
- Keep test gaps and uncertain questions non-blocking.

## Acceptance

- [x] `.opencode/agents/github-reviewer.md` defines a read-only primary reviewer using
      `opencode/mimo-v2.5-free`.
- [x] The workflow runs on non-draft, same-repository pull requests.
- [x] Deterministic gate results are serialized for the reviewer without converting every
      environment failure into a bug claim.
- [x] A pinned `octave-commons/muse` revision compiles a review profile exposing only Muse,
      phase, actor, task, and agent observer projections.
- [x] Write/network-capable multiplexed tools (`receipt_river`, `edn_ledger`,
      `session_mycology`, web search) are absent from the review profile.
- [x] A pinned `riatzukiza/.agents` revision is mounted as the external skill source and its
      skill inventory is recorded in the review-context artifact.
- [x] The reviewer uses change mapping, contract auditing, semantic tracing, adversarial
      validation, and final editorial filtering.
- [x] Inline findings require changed-line evidence, a failure trace, confirmed status, and
      high confidence.
- [x] The free MiMo model uses OpenCode's anonymous public-provider path, public session
      sharing is disabled, and the reviewer has no repository-write or shell permission.
- [x] The workflow forces `github-reviewer` through inline OpenCode config because the pinned
      GitHub action currently ignores its documented `agent` input.
- [x] Agent-workflow and centralized-automation documentation describe the new contract.
- [ ] The canary run completes under the bounded `github-reviewer` agent and produces either
      evidence-backed comments or a short passing summary without modifying the branch.

## Verification

- Review the workflow permissions and trigger predicates.
- Validate the OpenCode agent frontmatter against current agent/permission syntax.
- Inspect the deterministic evidence artifact.
- Inspect the revision-bound Muse/skills context artifact and verify the forbidden tools are
  absent.
- Confirm the anonymous free-model path selects `github-reviewer`, not the built-in `build`
  agent.
- Re-run the pull-request canary and inspect its generated review output before merge.

---
Implementation started 2026-07-27 from a direct operator request. The first canary's
deterministic stage passed and uploaded evidence. A later run proved anonymous
`opencode/mimo-v2.5-free` inference works, but also exposed two integration defects: the
review-context artifact initially omitted hidden files, and the pinned OpenCode GitHub action
ignored its `agent` input and fell back to the mutable built-in `build` agent. Commits
`574f37f`, `fc40dd1`, and `e9146d4` preserve the full context, remove the false API-key gate,
force the bounded reviewer through inline config, and complete the deterministic Clojure/build
environment.

Scoped adopted-workflow bugfix, 2026-10-15: repair the rejection-assessment prepare step Bind compiled profile outside the child after actual run 38669505027 refused before any model invocation with Cannot find module yaml. Reproduce through the existing registered workflow test using real pinned NBB 1.5.211 and yaml 2.9.0, commit causal RED before GREEN, then run only the digest command in ETA_CHECKOUT with the absolute runtime NBB path inside its existing command substitution. Preserve the parent working directory, all profile/input/verifier digest guards, permissions, read/publication separation, budgets, anonymous dynamic free-MiMo route and dependencies. Qualify existing registered assessment suites and owning lint; no model health call, dispatch, PR353 candidate source change, provider/account action or rollout. Hosted rerun and source adoption remain separate.

Bounded cross-repository Muse evidence-root repair under existing in_progress5 opencode-mimo-evidence-review-agent, authorized by root on 2026-10-15. Muse exclusively owns .ημ/plugins/review_pipeline.cljs and its existing registered scripts/verify-full-review-input.mjs cold actual-plugin fixture; ETA consumes a subsequently reviewed/qualified immutable Muse pin. Published Muse main9d3ae4957d99880ffbfad640d283e4c4692d99fa is47 commits ahead of historical workflow pinb7e4f98f550780a7b484b1525f53ad2934e29dad; inspect and preserve that current owning source in a separate clean checkout, leaving the frozen b7 profile dirt intact. Reproduce the proven selector mechanism with a genuine test-only RED: explicit nonblank host REVIEW_EVIDENCE_DIR versus an owned disagreeing worktree; keep no-binding worktree/directory and existing blank-as-absent bfs/env compatibility. Missing or corrupt explicitly bound input must refuse without falling back to a valid contextual decoy; all event/session/submission paths stay at the one selected root. Never use filesystem root as a test worktree. Then change only the existing evidence-dir helper to honor that existing host binding through bfs/env before its unchanged contextual fallback. Preserve all manifest/digest/page/stage/event/submission validation and actual tests. Commit RED before one-helper GREEN, qualify registered Muse review-input/lint/build as appropriate, and append RR/portable SM candidate0 with full historical prefixes. No new task/status transition, model/catalog/inference call, credentials/settings/install/config change, native canary, PR push, policy alias, approval vote or deployment is authorized. Root separately owns publication, source adoption, ETA pin integration and any later authorized native attempt.

Scoped finite-invocation repair after actual Muse PR30 run 38698096974/job 116299748920 exceeded its immutable old 45-minute budget. Canonical existing owner remains opencode-mimo-evidence-review-agent in_progress5. Accepted ETA source fefa6dd52135e1045b1ad56802a346dc0779970c already supplies a 60–180 minute whole ordinary review job budget (default120), while its inference adapter still waits without an invocation deadline; OpenCode1.18.18 steps and provider request timeouts are not whole-invocation deadlines. Work in a clean isolated worktree from that exact accepted source, preserving this card's previous body and actual tasks/.events ledger prefix. Repair only the existing ordinary-review invocation boundary plus its byte-identical embedded workflow and registered owning fixtures. First commit a genuine registered test-only RED using an owned executable child that emits valid input/tool progress and remains running with an owned descendant; the harness must clean up its own baseline failure. Then add an explicit opt-in per-attempt wall deadline with bounded TERM/KILL and stream drain, retain every partial response/stderr plus truthful distinct timeout/cleanup metadata, and reserve the existing whole job budget for at most two attempts and final verification/publication. A timeout is never a completed exit-zero review or approval. Only the existing sole corrective invocation may be considered for a first cleanly terminated expiry with no submission and an unchanged canonical healthy missing-submit verdict; HOST/provider/quota/spawn/unknown/malformed/present-submission/cleanup failures remain fatal, and a second expiry stops. Preserve every canonical input/trace/verification/submission/publisher guard, existing accepted-invocation semantics, dynamic anonymous free-MiMo selection and max2. Assessment-specific budgets and routes remain unchanged. Qualify the complete registered ordinary owner, affected assessment owner as required and owning lint, using local stubs only; append portable tracked RR/SM evidence with candidate0. No model probe/catalog/inference, keys/accounts/providers/settings, native review retry, Muse source or compiled bundle edit, policy alias, merge, deployment or board transition is authorized in this slice. The immutable Muse09a caller cannot inherit this fix or current fefa by main movement; later caller adoption/publication needs an exact reviewable separate plan.

Present canonical correction for origin ETA355 finding4281902705. The existing opencode-mimo-evidence-review-agent remains in_progress5, with outcome, dependencies and all prior card text preserved. Two previous native scope comments were accidentally emitted under kanban/tasks/.events because their commands supplied that nested tasks-dir override, while openhax.kanban.edn configures ./kanban. This current native comment is admitted through the configured canonical board root with no override. It records both complete prior scopes below for canonical consumers at its real current admission time. It does not claim either earlier event was originally in the canonical stream.

The original two typed native envelopes, their IDs, event times, session and causal/write IDs, the old card comments and the complete nested ledger remain unchanged as inactive historical evidence. The current operation creates one new native event and write ID; it neither backdates an admission nor reconstructs or deletes history. No exposed Rheos historical transfer-and-retirement operation was found, and no repository-local board parser/migration or alternate admission semantics are introduced. Required input/trace/reviewer and source-adoption guards remain intact. Actual scoped source work has been qualified and personally reviewed separately; this historical correction supplies no merge approval, round, runtime or production credit.

Complete original scoped statements (quoted history; original per-slice effect restrictions remain part of that dated record):

Original 1: tasks-opencode-mimo-evidence-review-agent-1792044175477; event/time 2026-10-15T06:02:55.477Z; write-id 1792044175474-0.y5c26ep1xoqw6bu5502

Bounded cross-repository Muse evidence-root repair under existing in_progress5 opencode-mimo-evidence-review-agent, authorized by root on 2026-10-15. Muse exclusively owns .ημ/plugins/review_pipeline.cljs and its existing registered scripts/verify-full-review-input.mjs cold actual-plugin fixture; ETA consumes a subsequently reviewed/qualified immutable Muse pin. Published Muse main9d3ae4957d99880ffbfad640d283e4c4692d99fa is47 commits ahead of historical workflow pinb7e4f98f550780a7b484b1525f53ad2934e29dad; inspect and preserve that current owning source in a separate clean checkout, leaving the frozen b7 profile dirt intact. Reproduce the proven selector mechanism with a genuine test-only RED: explicit nonblank host REVIEW_EVIDENCE_DIR versus an owned disagreeing worktree; keep no-binding worktree/directory and existing blank-as-absent bfs/env compatibility. Missing or corrupt explicitly bound input must refuse without falling back to a valid contextual decoy; all event/session/submission paths stay at the one selected root. Never use filesystem root as a test worktree. Then change only the existing evidence-dir helper to honor that existing host binding through bfs/env before its unchanged contextual fallback. Preserve all manifest/digest/page/stage/event/submission validation and actual tests. Commit RED before one-helper GREEN, qualify registered Muse review-input/lint/build as appropriate, and append RR/portable SM candidate0 with full historical prefixes. No new task/status transition, model/catalog/inference call, credentials/settings/install/config change, native canary, PR push, policy alias, approval vote or deployment is authorized. Root separately owns publication, source adoption, ETA pin integration and any later authorized native attempt.

Original 2: tasks-opencode-mimo-evidence-review-agent-1792052427070; event/time 2026-10-15T08:20:27.070Z; write-id 1792052427067-0.w6j01006aha6qwpqz0c

Scoped finite-invocation repair after actual Muse PR30 run 38698096974/job 116299748920 exceeded its immutable old 45-minute budget. Canonical existing owner remains opencode-mimo-evidence-review-agent in_progress5. Accepted ETA source fefa6dd52135e1045b1ad56802a346dc0779970c already supplies a 60–180 minute whole ordinary review job budget (default120), while its inference adapter still waits without an invocation deadline; OpenCode1.18.18 steps and provider request timeouts are not whole-invocation deadlines. Work in a clean isolated worktree from that exact accepted source, preserving this card's previous body and actual tasks/.events ledger prefix. Repair only the existing ordinary-review invocation boundary plus its byte-identical embedded workflow and registered owning fixtures. First commit a genuine registered test-only RED using an owned executable child that emits valid input/tool progress and remains running with an owned descendant; the harness must clean up its own baseline failure. Then add an explicit opt-in per-attempt wall deadline with bounded TERM/KILL and stream drain, retain every partial response/stderr plus truthful distinct timeout/cleanup metadata, and reserve the existing whole job budget for at most two attempts and final verification/publication. A timeout is never a completed exit-zero review or approval. Only the existing sole corrective invocation may be considered for a first cleanly terminated expiry with no submission and an unchanged canonical healthy missing-submit verdict; HOST/provider/quota/spawn/unknown/malformed/present-submission/cleanup failures remain fatal, and a second expiry stops. Preserve every canonical input/trace/verification/submission/publisher guard, existing accepted-invocation semantics, dynamic anonymous free-MiMo selection and max2. Assessment-specific budgets and routes remain unchanged. Qualify the complete registered ordinary owner, affected assessment owner as required and owning lint, using local stubs only; append portable tracked RR/SM evidence with candidate0. No model probe/catalog/inference, keys/accounts/providers/settings, native review retry, Muse source or compiled bundle edit, policy alias, merge, deployment or board transition is authorized in this slice. The immutable Muse09a caller cannot inherit this fix or current fefa by main movement; later caller adoption/publication needs an exact reviewable separate plan.

Fixture-only follow-up for ETA355 Codex4283755058/review5534114953 on fcdf356d6e1dfc802e60c09f3f36c18819124f81 under existing opencode-mimo-evidence-review-agent in_progress5. Preserve complete finite-invocation scope and canonical/inactive historical events. Personal-first fresh worktree at mergedfcdf; no rewrite of merged18 or direct origin publication. Change only the real progressing-child fixture deadline/assert400→2000ms, outer3500→12000ms, force5000→15000ms and test10000→20000ms. Keep every pure negative400 case and production runner/workflow/law/route/gate/max2 byte unchanged. Run one genuine registered3file concurrent baseline and retain its actual PASS/FAIL without manufacturing RED, then qualify exact patched complete owner, syntax/diff and actual PID/capture/accepted2 assertions. No model/catalog/CI rerun/provider/key/account/runtime/deployment effects. Source and separate canonical RR/SM qualification/publication require root's concrete admission; this comment gives no approval or completion credit.

---