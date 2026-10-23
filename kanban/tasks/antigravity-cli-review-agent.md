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
The local Antigravity CLI 1.1.23 advertises gemini-3.8-flash-high. The existing
MiMo workflow's bounded review method is reusable; its OpenCode native invocation
proof is not an Antigravity proof. Publication credentials stay outside workers.

## Outcome

A reusable eta-mu workflow and local runner invoke Antigravity CLI with the exact
Gemini 3.8 Flash model and retain validated, revision-bound advisory artifacts.
Thin immutable callers cover every actionable Foresight member and the root.

## Scope

- Pure portable review input/result laws with a Node/NBB process adapter.
- A read-only custom reviewer using the existing map/validate/disprove/submit method.
- Exact base/head/diff binding; complete bounded input; structured native output.
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
   inference has no GitHub write/signing credentials and cannot edit source.
5. Artifacts identify Antigravity CLI evidence separately from native GitHub approvals.
6. All declared actionable direct repositories have identical pinned thin callers;
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
