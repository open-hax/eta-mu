---
category: "tasks"
labels: "workflow, review, anonymous, security, has-parent"
dependency: []
parent: "290f0cdf-9160-453e-a69c-67211432baa7"
type: "task"
write-id: "1792077152478-0.t050n738mwoz0v0dt3p"
points: "2"
title: "Produce anonymous review evidence without publication credentials"
priority: "P1"
status: "breakdown"
uuid: "cf32641a-b336-407e-b68b-c75ec7d20dbb"
created_at: "2026-10-15T15:11:59.035Z"
---

# Produce anonymous review evidence without publication credentials

## Context

The accepted ETA source is `fefa6dd52135e1045b1ad56802a346dc0779970c`.
Its `.github/workflows/opencode-code-review.yml` requires App credentials at
line 2676 before bounded inference at line 2695, then mints a publication token
and posts a review on that same runner at lines 2804–2817. A missing publication
credential therefore prevents anonymous OpenCode inference. This is a workflow
coupling defect, not evidence that free MiMo needs an OpenRouter key.

This two-point story is one child of the still-open truth-preserving-gates
parent `290f0cdf-9160-453e-a69c-67211432baa7`. It precedes central publisher
`ed4e2a2a-6055-4d53-9cea-f3971c707551`, then existing hosted-proof
`164c2de7-7495-4738-94e1-a81167edefb0`. The three slices account for **10 newly
identified points: 2 + 5 + 3**. Existing reviewer-owner work and parent completion
are separate. Planning does not qualify implementation or authorize setup.

## Outcome

The candidate producer can run its existing anonymous, dynamically discovered
OpenCode free-MiMo review and retain complete revision-bound evidence with no
App private key, publication token, Discord webhook, or repository-write
authority available to candidate code or inference. Its final producer result
reports only evidence generation; trusted publication is a separate obligation.

## Scope

- Change `.github/workflows/opencode-code-review.yml` and its existing registered
  `.github/scripts/opencode-code-review-workflow.test.mjs` owner. Remove App
  secret inputs, the pre-inference credential guard, token mint, review POST,
  Discord-secret access and publication-only setup from the producer.
- Preserve deterministic/context prerequisites, independent expected/executed/
  completion SHA and clean-tree checks, complete diff/context retention, pinned
  observer tools, production invocation/discovery verification, raw traces,
  attempt-specific artifacts and the existing finite maximum of two invocations.
- Keep dynamic model discovery through OpenCode's anonymous route. Dated model
  slugs remain observations; this story does not hard-code a new slug or probe a
  provider.
- Rename the final producer-only summary to `OpenCode producer evidence` and
  retain fail-closed `always()` evidence retention. It must not claim that a
  GitHub review was published or that the later required App status succeeded.

## Non-goals

No collector, App mint, GitHub review/status publication, protected-environment
or branch-protection change, credential copying, model/account change, caller
pin advance, runtime deployment or merge. This story does not itself enable
previously unsupported fork events; event enrollment requires explicit trusted
source qualification. The central and hosted-proof stories own their own work.

## Acceptance criteria

- [ ] Both same-repository and fork candidate inputs contain no App secret,
  installation token, Discord webhook or write credential. Merely relying on
  GitHub withholding fork secrets is insufficient; same-repository candidates
  must also have no access to publication custody.
- [ ] A causal regression using the actual extracted producer steps demonstrates
  that absent App credentials no longer prevent a valid synthetic anonymous
  invocation from reaching its existing verifier. The old credential guard is
  the RED; removing an assertion or skipping a deterministic job is not GREEN.
- [ ] A synthetic credential canary and fake GitHub transport prove zero token
  mint, review/status/Discord writes and no credential leakage to environment,
  config, logs or retained evidence. No real key or provider call is needed.
- [ ] Valid production-format synthetic evidence completes the renamed producer
  result; malformed, incomplete, truncated, stale, dirty, mismatched or missing
  prerequisite/input/trace evidence fails truthfully while retaining artifacts.
- [ ] Existing recovery eligibility, exact two-attempt bound, stream/PID cleanup,
  dynamic anonymous catalog and full-input/invocation refusal cases remain
  registered and unchanged in meaning. Do not replace rejected trace evidence
  with a model summary or synthesize a submission.
- [ ] No `needs` edge waits for the future asynchronous workflow. The producer
  cannot assert or substitute for `eta-mu/trusted-review-publication-v1`.

## Verification

Implement only after planning review and lawful readiness. First retain the
genuine credential-coupling RED from the actual owning workflow harness, then
run the full registered workflow owner after the narrow repair, including the
causal no-secret/no-write and retained rejection controls. Run affected workflow
syntax/lint and repository-required checks with zero warnings. Retain actual
command exits, full stdout/stderr, cleanup, source hashes and evidence identity.
Passing local inert fixtures supplies no hosted provider, publication, merge or
release evidence. Hosted enforcement is owned by `164c2de7-7495-4738-94e1-a81167edefb0`.

## Risks

Removing only the App guard would leave same-runner custody and a misleading
final gate. Remove all producer publication paths together while retaining every
deterministic/input refusal. Candidate code is untrusted even on a same-repo PR.
The existing Services caller still pins ETA `d98ab446d56ddfd24542df49b102b851f2a767fa`
and Muse `e733f5b417a870a6c8480ae433d643ee1598af27`; ETA planning/adoption does not
change those pins. Services consumption is a downstream, separately estimated
slice. Foresight `fork-review-setup` is a separate incoming three-point setup
owner, not an implied grant or a local dependency identity.

## Source references

Reviewed design: asynchronous required-status protocol v2, 2026-10-15,
SHA256 `309297d62946667d463560e880bdce1dbc9e55bb2afce13da76331510ff80ecb`.
Source: accepted ETA workflow lines 2676/2695/2804/2817/2919 and
`.github/scripts/run-opencode-review-recovery.mjs` production verifier/discovery
boundaries. Existing `opencode-mimo-evidence-review-agent` remains its original
in-progress five-point owner; this new separation is not silently added to it.