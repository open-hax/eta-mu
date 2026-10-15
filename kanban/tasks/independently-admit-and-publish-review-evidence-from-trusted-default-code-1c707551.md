---
category: "tasks"
labels: "workflow, review, publication, security, has-parent"
dependency: ["cf32641a-b336-407e-b68b-c75ec7d20dbb"]
parent: "290f0cdf-9160-453e-a69c-67211432baa7"
type: "task"
write-id: "1792077153373-0.w8aa7mvrglndwgphg0h"
points: "5"
title: "Independently admit and publish review evidence from trusted default code"
priority: "P1"
status: "breakdown"
uuid: "ed4e2a2a-6055-4d53-9cea-f3971c707551"
created_at: "2026-10-15T15:12:31.474Z"
---

# Independently admit and publish review evidence from trusted default code

## Context

Accepted ETA `fefa6dd52135e1045b1ad56802a346dc0779970c` couples anonymous inference,
App credential custody, GitHub review publication and a synchronous final gate.
Producer `cf32641a-b336-407e-b68b-c75ec7d20dbb` separates inference. This five-point
story adds the bounded trusted collector/publisher/status adapter, using existing
production invocation/discovery verification and the existing Muse publisher.
Existing hosted-proof `164c2de7-7495-4738-94e1-a81167edefb0` then proves actual
platform enforcement. Parent `290f0cdf-9160-453e-a69c-67211432baa7` stays open;
**2 + 5 + 3 = 10 newly identified points**, separate from previous reviewer work,
Foresight setup three points and unestimated downstream Services consumption.

## Outcome

A fresh regular central ETA workflow, running only reviewed accepted-default
code with protected credential custody, independently validates native source,
run, artifact and review-invocation evidence before one native review POST.
Only its qualified final verdict, including complete native publication
readback, can set the distinct required App commit status to success. Candidate
uploads and candidate workflow conclusions cannot self-authorize publication.

## Scope

Future implementation paths are `.github/workflows/opencode-review-publish.yml`,
`.github/review-publication-targets.edn`, pure
`packages/eta-mu/src/cljs/eta_mu/law/review_publication.cljc`, thin
`packages/eta-mu/src/cljs/eta_mu/extern/review_publication.cljs`, and registered
`.github/scripts/opencode_review_publish_test.cljs`. Register owning tests in
`scripts/test.bb` when implementation is admitted. Keep policy/data pure and raw
GitHub/filesystem/process operations at the extern boundary; split a further
adapter layer only if the actual dependency graph requires it, without changing
the accepted protocol. Reuse production `prepareReviewInvocationContext`,
`verifyReviewInvocation`, discovery verification and pinned Muse
`.ημ/review/publish-opencode-review.cjs`. Muse's
`scripts/verify-full-review-input.mjs` is a test fixture, not an artifact validator.
No Muse semantic change is established by this plan.

## Required protocol and acceptance criteria

- [ ] **Trusted execution and enrollment.** One regular central workflow runs
  reviewed accepted-default code. An accepted registry binds target repository
  ID, producer workflow ID/path, immutable caller/ETA/Muse sources, all seven
  exact enrolled Services evidence commands and verifier/build identity. Verify
  native adoption before use; a local accepted object is not default adoption.
  Uploaded metadata cannot authorize source drift. A scheduled reconciler reads
  cross-repository runs. Optional `workflow_run` only accelerates same-repository
  producers; it is not a cross-repository subscription. Reusable YAML runs in
  caller context and cannot supply central repository secrets.
- [ ] **Independent native tuple.** Collect native PR number N, current base B,
  head H, original event SHA G, associated run ID/attempt, producer and referenced
  workflow IDs/source SHAs, required successful completed jobs and artifact
  association. Treat `workflow_run`'s default-source SHA as collector code, not
  H. Unknown mergeability remains pending. Obtain native test-merge M, verify
  its exact B,H parents, B ancestor of H and M tree equal to H tree so the
  existing H-tested evidence covers this integration. Otherwise wait for new
  matching evidence. Recheck the tuple before and after any publication effect;
  changed B invalidates B...H input. Do not reinterpret or rerun an old event as
  current-base evidence.
- [ ] **Artifact and full-input admission.** Bind native artifact ID, run/attempt,
  native size/digest and unexpired download; validate physical ZIP CRC, safe
  unique paths and mandatory members. Apply finite configured download bytes,
  member count, per-member and total uncompressed bytes, and operation/decode
  time budgets; reject over-limit archives, symlinks and special files before
  extraction. Missing bounds are a refusal, not unlimited defaults. Reconstruct native full diff/context from
  trusted source, and run production invocation/discovery verification over
  complete pages, raw trace, invocation and final envelope. Never execute
  candidate code/config/dependencies, uploaded scripts or an uploaded verifier.
  A self-reported verdict or `acceptedInvocation` is never sufficient. Missing,
  skipped, failed, deleted, stale, forged, truncated, mismatched or inaccessible
  evidence denies qualification rather than becoming an approval or quota state.
- [ ] **Read-only collection and bounded authority.** Collection is read-only.
  After target/source/identity/grant preflight, narrow status authority may emit
  pending/error; use PR-write authority only after independent qualification.
  Serialize target/M/context and retain a trusted publication intent binding
  N,B,H,M,run,attempt,artifact digests and verifier identity. Call the accepted
  Muse publisher once at H. GET the native review and every inline comment,
  checking expected App/Bot identity, H, event, body and exact comments, then
  re-read the tuple. Retain an unknown POST outcome and discover/read back that
  actual attempt; never blindly repeat it. Ambiguous absence remains blocked.
  A later attempt or tuple supersedes only through explicit new evidence.
- [ ] **Required result without cyclic needs.** App `3152464` (`eta-mu-ai`) writes
  commit status C=`eta-mu/trusted-review-publication-v1` on **M only**, never H.
  Pending awaits admission/publication; success requires the trusted final
  QUALIFIED-publication verdict and exact native review/inline readback. Failure
  represents rejection; error represents infrastructure/uncertainty, preserving
  causes. GET status must match expected identity,M,C,state and receipt URL.
  Deduplicate status writes under GitHub's per-SHA/context limits. Do not use a
  candidate's assertion, a renamed producer check, a normal workflow_run check,
  or an impossible cross-workflow `needs` edge as the required final verdict.
  Distinct C avoids identical job/check-status contexts requiring both. Never
  create H fallback success.
- [ ] **Shared-commit meaning.** Commit statuses bind M, not PR number N. When
  different PRs share B,H,M, C certifies integration publication-evidence
  integrity and may be shared; it cannot itself certify per-N merge approval.
  Keep native PR-specific review/settlement and canonical merge gates required.
  No `external_id` or momentary uniqueness claim cures the shared-M race. A
  stricter N-specific required verdict needs a separately scoped trusted merge
  admission adapter. Merge queues/`merge_group` are outside this story.
- [ ] **Credential custody and setup preconditions.** Keep an existing App key
  central, in a protected environment restricted to the reviewed accepted-default
  ref, with no duplicate unprotected repository/organization key. Audit every
  workflow eligible for that environment, including `pull_request_target` and
  base `GITHUB_REF`; environment names and “protected branches only” with no
  protected branches are insufficient. Same-repository candidates must also be
  secretless. Existing App requested `statuses:write` and PR-write, not checks;
  do not expand permissions or create/copy an App. Target installation and
  effective grants must be proved before narrowly scoped target-token use;
  requested permissions, installation existence and secret names do not prove
  access. Setup/credential operations require their own admitted work.
- [ ] **Fail-closed operation.** Schedules may delay, drop or disable; do not
  promise instant or always-emitted status. Required C remains absent/blocking
  until trusted reconciliation. Handle skipped/deleted producers, reruns and
  superseding attempts without passing stale evidence. Protection configuration
  and actual M/App enforcement belong to the separate setup and hosted-proof
  owners; this source's tests cannot claim their adoption.

## Non-goals

No model invocation or new model route, candidate secret, new App/broker/webhook,
credential copying, account/grant/permission/environment/protection mutation,
merge authorization, caller pin update, Services rollout or content publication.
This is adapter source planning; no runtime/workflow implementation or hosted
proof is executed in the planning change. Separate Muse evidence-root work is
not adopted. Preserve anonymous dynamic discovery, finite inference recovery,
all deterministic gates and existing seven-command caller semantics.

## Verification

After planning review/readiness, start with causal RED for same-runner App
custody and synchronous required-gate coupling, then use actual adapter entry
points with a fake GitHub transport, physical inert artifact fixtures and a
synthetic credential canary. Assert pending before qualification and success
only after one POST plus exact complete GET readback. Cover wrong repo/workflow/
source/commands/attempt/run/digest, unsafe/duplicate archive paths, links/special
files, decompression/resource/time-limit refusal with no App/PR write, forged trace,
stale B/H/M, unavailable native data, missing grants, tuple drift, unknown POST,
partial inline readback, concurrent collector serialization, supersession,
status deduplication and zero execution of uploads. Every refusal must assert
the exact forbidden effects did not occur. Register the complete owning suite;
run affected build/lint/full relevant tests with zero warnings and retained
finite process exits/cleanup. Mock transport supplies no hosted App or branch
protection credit. Existing hosted-proof owns real platform falsification.

## Risks and prerequisites

Five points assumes delegation to the existing production verifier and Muse
publisher; if their actual interfaces cannot safely admit reconstructed artifacts,
split the newly discovered work before implementation, preserving all criteria.
Foresight `fork-review-setup` is a separate incoming/P1/three-point setup owner
at the reviewed Foresight lane. It must establish central default/environment
custody, target installation/grants and required `{context:C,app_id:3152464}`
with strict current-base/PR/conversation and explicit admin/bypass treatment,
while retaining deterministic requirements. There is no App-id-any exception.
Personal repositories cannot be promised organization-only push restrictions.
Current personal Services main has no protection/required-context enforcement;
no installation/effective grant or environment custody is proved. This card does
not mutate that board or invent a cross-board dependency UUID. Services caller
consumption remains separate; existing pins are ETA d98ab446 and Muse e733f5b.

## Source references

Reviewed v2 design SHA256
`309297d62946667d463560e880bdce1dbc9e55bb2afce13da76331510ff80ecb`,
accepted ETA fefa6dd/Muse9d3ae495 and pinned Services ETA d98ab446/Musee733f5b.
Primary platform semantics: [workflow_run](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run),
[workflow reuse](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations),
[native PR/merge SHA](https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request),
[statuses](https://docs.github.com/en/rest/commits/statuses),
[required status checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks),
[branch protection](https://docs.github.com/en/rest/branches/branch-protection#update-branch-protection),
[environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).