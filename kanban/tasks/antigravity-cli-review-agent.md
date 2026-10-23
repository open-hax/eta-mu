---
uuid: "c4b3a859-fc64-4f5c-bbdd-a28771daa6f1"
title: "Add Antigravity CLI review with Gemini 3.8 Flash"
status: incoming
priority: P1
points: 5
labels: [github, review, antigravity, foresight]
---

## Context

Foresight needs another review provider using the existing evidence-first method.
Discovery observed Antigravity CLI 1.1.23, then an externally changed 1.4.6; both advertise gemini-3.8-flash-high. The execution worker must pin the 1.4.6 binary by SHA256, verify its version/hash before each run, and record the native model route. A local catalog is not execution proof. The existing
MiMo workflow's bounded review method is reusable; its OpenCode native invocation
proof is not an Antigravity proof. Publication credentials stay outside workers.

## Outcome

A reusable eta-mu workflow and local runner invoke Antigravity CLI with the exact
Gemini 3.8 Flash model and retain validated, revision-bound advisory artifacts.
Thin immutable callers cover every actionable Foresight member and the root.

## Scope

- Pure portable review input/result laws with a Node/NBB process adapter.
- A read-only custom reviewer using the existing map/validate/disprove/submit method.
- Exact base/head/diff binding and SHA256 digests. Paths sort lexically; limits are
  256 changed files, 1048576 bytes per base/head blob, 1048576 bytes of full diff,
  4194304 bytes of complete serialized input and 2097152 bytes of native output.
  The exact full prompt is bounded to 4718592 bytes and its compact native NDJSON
  stdin message to 8388608 bytes. Stdin remains open until the native terminal
  result; no prompt is placed in argv. Exceeding any limit fails before dispatch;
  truncation is forbidden. The manifest records exact revisions, diff/input/prompt/
  stdin digests and byte counts. Native stream structure, session and strict
  profile custody are admitted separately from the semantic result.
- A versioned open-hax.antigravity-review/v1 result: exact base/head/model,
  scope_complete, exactly-once reviewed_paths, nonempty summary, findings and
  nonblocking questions. Each finding has path, changed line, title, body,
  confidence, supporting evidence and failure trace. A valid admitted result with
  findings:[] is clean advisory evidence; missing/malformed/partial output fails.
  Native CLI version/hash/model identities are retained with result provenance.
- A workflow that prepares inputs with read-only tokens and dispatches model work
  to an isolated, authenticated persistent worker without GitHub signing/write keys.
- Thin pinned callers; each repository retains its deterministic checks and policy.

## Non-goals

No native provider identity impersonation, merge approval credit, changes to branch
protection or approval rosters, deployment, secrets copying, or a second job ledger.
Do not activate the separate trusted publisher before its own qualification.

## Acceptance criteria

1. The model is exactly gemini-3.8-flash-high; no fallback substitutes another model.
2. Missing CLI/auth/model, timeout, non-success status, malformed output, stale head,
   incomplete input, invalid paths/lines, and low-confidence findings fail visibly.
3. Findings cite changed lines and supporting evidence with confidence >= 0.85;
   uncertain questions are nonblocking; empty output is not a passing review.
4. Untrusted candidate code/configuration is never executed with provider credentials;
   inference and all children receive no GitHub credentials of any scope and cannot edit source; the fixture verifies the actual process environment.
5. Artifacts identify Antigravity CLI evidence separately from native GitHub approvals.
6. Fresh per-job workspaces are removed after success, failure, timeout and cancellation;
   terminate the full child process group and retain no per-job secret material.
   A failure-followed-by-success fixture verifies prior source files, processes and
   injected environment canaries cannot cross jobs. User-authorized local provider
   login persists separately and is never copied into candidate workspaces.
7. The source of truth is open-hax/foresight src/foresight/project.cljc sources,
   selecting actionable independent direct git submodules plus the root. The
   Foresight plan/check command and tests require exact-one caller coverage for
   these 23 targets and explicit consolidation/nested-package exclusions.
   All declared actionable direct repositories have equivalent pinned thin callers
   routed to the approved organization-local reusable workflow;
   inventory-only consolidation inputs stay excluded and nested packages are not swept.

## Verification

Red then green tests cover input/output admission, diff grounding, exact revision and
model, unavailable/error paths, process arguments/environment and workflow permissions.
Run owning review-workflow suites and clj-kondo with zero warnings. Use a live CLI
smoke review, record exact model/version/result and preserve external blockers.

## Risks

Antigravity authentication/CLI versions vary by worker. Consumer workflow changes
must be reviewed before activation; a pushed proposal is not installed CI evidence.
Bounded inputs fail closed rather than silently truncating a large review.

## Native transport qualification

Held-open stdin completed the complete 290035-byte shx PR input in an actual
158-second native run. Final source-runner fixtures returned a clean result and
the known increment.clj line 4 defect with empty stderr and removed workspaces.
The local observation does not guarantee completion at every configured ceiling.
The reusable job allows 1200 seconds for inference within its 30-minute job bound.
Both organization routes previously reached the worker and retained explicit
prompt-size refusal artifacts under the old transport; successful hosted stream
execution and runner-group denial proof remain separate deployment checks.
