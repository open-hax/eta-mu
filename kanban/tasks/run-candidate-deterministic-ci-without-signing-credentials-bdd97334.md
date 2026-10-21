---
category: "tasks"
labels: "ci, stabilization, credential-isolation"
dependency: []
parent: "290f0cdf-9160-453e-a69c-67211432baa7"
type: "task"
write-id: "1792555002067-0.u1teg781gnjqmaoicns"
points: "5"
title: "Run candidate deterministic CI without signing credentials"
priority: "P1"
status: "testing"
uuid: "e449367d-8fc1-4e8b-a1bb-995cbdd97334"
created_at: "2026-10-21T03:34:20.220Z"
---

# Run candidate deterministic CI without signing credentials

## Context

E0 execution of existing eta-mu PR361 exposes inherited Rheos and GitHub-sync
CI failures before tests: both demand App credentials to fetch a now-public
pinned dependency. Sandbox and Sol CI carry the same signing custody on
same-repository candidates even when their fork path skips it. The user's
accepted candidate-isolation policy already requires read-only, secretless
candidate workflows/builds/hooks; no new publication or authorization design
is introduced here.

No existing leaf owns this exact four-carrier correction. This finite five-point
story is a distinct child of active review-truth epic
290f0cdf-9160-453e-a69c-67211432baa7 and E0/E1 remediation. It preserves the
producer's two points, publisher's five points and hosted proof's three proposed
points. Parent stays open; those prior ten points are not reassigned. Existing
quality-ratchet stays icebox, workflow-projection stays its current state, and
rheos-ci-does-not-gate-build-warnings retains its separate incoming two-point
warning-parity scope. No copied task or second board authority is introduced.

## Outcome

The four candidate test carriers execute their existing deterministic checks
with read-only automatic tokens, public pinned dependencies and no signing,
deployment or Discord credentials, App minting, private mirror or Git auth
configuration. Missing public dependencies fail truthfully.

## Scope

- Generated Rheos: edit canonical workflow EDN/registry only as needed, then
  emit the hosted YAML and local gate projection through the existing tool.
- Handwritten GitHub-sync, Sandbox and Sol CI: remove signing/mirror coupling
  while preserving their actual tests, build, failure propagation and evidence.
- Extend established registered workflow test owners with actual extracted-step
  credential-free sequencing and parsed same-repository/fork custody controls.
- Preserve all prior verifier/recovery/source-hash/timeout rules, tool pins,
  public protocol/native/TS checks, package tests/lint/release and sync's real
  snapshot/alias/UUID/drift/dry-run checks. No skipped check is a success.

## Acceptance criteria

- [ ] Every affected candidate job has only read-scoped automatic permissions,
  persist-credentials false and no signing/deploy/webhook secret expression,
  token mint, mirror or credential setup, including same-repository events.
- [ ] RED executes unchanged actual credential guards without App values and
  proves downstream deterministic commands unreachable. Parsed controls reject
  each old signer path; GREEN executes preserved commands without credentials.
- [ ] Actual public Git access proves each relevant exact Katamorph commit;
  real dependency resolution and full affected suites/builds run independently
  of inert custody fixtures. Dependency/process failure still propagates.
- [ ] Canonical EDN, generated YAML and local gates agree semantically; all
  original source/task/ledger histories and required checks remain preserved.
- [ ] Tests assert zero attempted signing/publication effects and no canary leak,
  with dynamic negative variants that demonstrate the controls can fail.
- [ ] Native current H/B/tested merge, actual job/test scope, artifacts, skips,
  warnings and independent review are retained before any qualification.

## Verification

Capture RED before product edits. Run established workflow owners and emitter
check, unfiltered workflow lint, real public protocols tests/lint/types, Rheos
suite/lint/all four releases, Sol affected suite/lint/build and preserved sync
snapshot/UUID/dry-run controls where execution is available. Explicitly separate
local inert controls from real local execution and native hosted proof. No
strict whole-carrier zero-warning result if any warning remains; inherited
warning parity remains the existing sibling owner's obligation.

## Boundaries and holds

This is a code-review correction under the already active parent and accepted
candidate isolation policy, not a new trusted publisher or activation protocol.
Rheos operational readiness supplies no native planning/approval/merge credit.
Current PR review convergence, original open findings and independent exact-head
qualification stay required. No privileged rerun, same-repository fixture,
provider call, App/account/setup/protection change, caller pin, deployment,
merge or CMS/Cephalon restart. CodeQL upload permission and purpose-specific
trusted/event-only publisher routes remain separately unqualified. Historical
absolute event paths remain immutable under their existing portability owner.

## Definition of done

The four real carriers produce complete, exact-source deterministic evidence
without candidate signing custody, every finding is dispositioned, and actual
current-head native checks/review qualify the source. Partial/fork/local success
alone does not close this card or E1.

---
GREEN admission anomaly: unfiltered actionlint/ShellCheck refuses four inherited SC2094 informational diagnostics in the two existing Sandbox checksum pipelines. Each find already excludes SHA256SUMS, so this does not establish a checksum corruption defect; it is a required lint-contract failure. Bounded same-owner repair is admitted before edit: materialize the exact sorted NUL-delimited input list in an owned temporary file outside each artifact root, then run the unchanged checksum command from that list into SHA256SUMS. Preserve all relative names, file exclusion, sort order, digests, artifact retention and failure propagation. Keep original lint RED. Verify with actual extracted shell blocks on identical binary/space/newline-path fixtures, byte-equal manifests and real changed-file verification failure. No rule suppression, tool-pin update, new publisher or broader warning-parity work. Four-carrier scope and all source/adoption/review holds remain unchanged.

Implemented correction of all4 candidate carriers, with canonical EDN/generated Rheos and preserved local gates/pins/package checks. Registered causal RED9/169 with27failures precedes product; GREEN10/183 and eta194/587 pass. Unfiltered actionlint/ShellCheck0; emitter10gates/path audit/kondo0warnings. Checksum temporary input change has actual old/new byte/digest/tamper/cleanup proof. Strict whole-carrier zero-warning remains HOLD for existing SIGTERM fixture diagnostic; prior native3772 bundle success does not qualify successor source. Independent parsed audit preserves every deterministic/evidence step,5package trees and338review owner. Current source publication/native checks/review still pending; move to testing is execution only, no done/planning/adoption credit. Prior2/5/3-point chain, warning-parity2 and parent open unchanged; no credential/publisher/protection/caller pin or product agent change.

---