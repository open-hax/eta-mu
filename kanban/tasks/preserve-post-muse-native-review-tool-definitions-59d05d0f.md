---
uuid: "4b21cb6f-160c-4c15-8410-46b959d05d0f"
title: "Preserve post-Muse native review tool definitions"
status: "incoming"
priority: "P2"
points: "1"
type: "task"
category: "tasks"
labels: "opencode, review, compatibility, 1sp"
parent: "opencode-mimo-evidence-review-agent"
---

# Preserve post-Muse native review tool definitions

License: GPL-3.0-or-later.

## Context and outcome

Implementation owner: `open-hax/eta-mu`. Parent identity was independently read
through Rheos as `opencode-mimo-evidence-review-agent`; its historical five-point
canary remains separate. This is one additional point with an independent exit.
Initial Markdown creation supplies no invented engine creation event or write ID.

The accepted `0a4b8a8c372af1cea751d6f4bac7502e332bf5e3` workflow replaces native
`bash`, `glob`, `grep` and `read` descriptions after delegating to Muse. Change
only that outer compatibility behavior: preserve the complete definition output
**after** the prior Muse hook. A prior hook's own description change remains;
eta-mu does not restore a pre-Muse string or add a later description replacement.
The reviewer prompt and existing ACL continue to govern behavior.

## Scope and limits

Remove the outer description assignment in
`.github/workflows/opencode-code-review.yml` and update the actual emitted-wrapper
fixtures in `.github/scripts/opencode-code-review-workflow.test.mjs`. Preserve
all remaining hooks, schemas/IDs/executor references, profile/config bytes,
compiled Muse/skills pins, client/version selections, source/checksum custody,
true-only Bash ACL and existing evidence, recovery, publisher and gate behavior.

The direct pull-request/default client is `1.18.18`. Foresight's published PR140 consumer, verified on October14 at
`aebfdf32600166c1bb9337d670a6272035b8c423`, explicitly selects `1.18.31`.
Use a separately source-custodied native-definition fixture for each actual client
selection being qualified; fixture metadata must name its exact physical client
version/hash and schema origin. The dated private `1.18.31` capture's 13 native
plus 22 Muse IDs is evidence for that held fixture only, not a universal count or
proof for `1.18.18`. Compare all IDs/schema references present in each qualified
fixture, without manufacturing a missing native snapshot.

Keep OpenCode's anonymous official provider and the fresh catalog's unique latest
eligible active, tool-capable, explicitly zero-cost free MiMo selection. No fixed
model slug, OpenRouter/key/account/credit operation, paid fallback, client-pin
change, permission loosening, new runtime/egress framework, policy rewrite or
production action is included. Removing descriptions is not a claimed 403 cause
or transport-restoration proof. Missing fixture custody or expansion beyond the
adapter/tests requires explicit scope review and re-estimation, not silent growth.

## Acceptance criteria

- [ ] Four new wrong-result regressions exercise the existing emitted wrapper
  with supplied native `bash`, `glob`, `grep`, `read` definitions. The accepted
  predecessor replaces them; GREEN preserves their post-Muse values. Commit the
  actual causal RED before GREEN after planning review and lawful readiness.
- [ ] With no prior hook, each supplied description and schema/object reference
  remains unchanged. With a prior hook that sets `"prior description"`, that
  value remains unchanged after eta-mu returns. Delegate and await that hook once
  with the original input/output objects; retain its metadata and propagate its
  rejection without a later rewrite. No executor runs in these fixtures.
- [ ] Preserve the complete Muse tool map, every supplied native/Muse ID and
  schema/executor reference, all other hooks, unknown/own-key controls, profile
  bytes and true-only Bash ACL. Qualify the direct `1.18.18` fixture separately
  from the supported explicit `1.18.31` caller fixture, with honest version/hash
  custody. Preserve the old tests' remaining checks; update only their deliberate
  description-replacement expectations for the new contract.
- [ ] The complete owning workflow test file and bounded syntax/actionlint checks
  pass. No full repository or native success is inferred from private rehearsals.
- [ ] On the exact implementation head, the hosted acceptance below is successful
  with independently retained artifact/attempt/source custody and an accepted
  invocation. Failed, skipped, clipped or unknown results do not qualify.
- [ ] Fresh code review, canonical PR convergence and protected source adoption
  complete this eta-mu compatibility outcome. Parent canary closure, downstream
  caller adoption and Services rollout remain independently owned.

## Hosted acceptance and verification

Use the existing local command, without installing or changing dependency policy:
`node --test .github/scripts/opencode-code-review-workflow.test.mjs`.

For direct eta-mu PR qualification, name the existing workflow
`OpenCode evidence PR review` and require these current-head jobs to complete
successfully: `Produce deterministic review evidence`, `Compile Muse tools and
stage skills`, `Review pull request with OpenCode MiMo`, and
`OpenCode evidence review gate`. Preserve the compiled profile, read-only agent,
exact client/version, discovery and publisher restrictions.

The corresponding native artifacts are
`review-evidence-<PR>-<run>-<attempt>`, `review-context-<run>-<attempt>` and
`review-attempt-<PR>-<run>-<attempt>`. Bind their native ZIP digests, producing
jobs/attempts, source head and actual compiled Muse/skills/profile hashes.
Deterministic summary/gate statuses and input verification must succeed; the
attempt must retain its physical client version, fresh catalog selection,
complete response/submission hashes and a nonnull independently verified
`accepted_invocation`. Preserve normal source-bound publication and native review
readback. Model text or an APPROVE submission alone is not that acceptance.

Require current branch-required/deterministic checks, including the existing
`coverage` jobs `eta-mu CLI + turn-processor + terminal-ui`,
`CLJS extension tests + coverage`, `TS package tests`; `Sandbox bundle`/`bundle`;
and `CodeQL`/`Analyze (javascript-typescript)` plus its aggregate check. This
list does not waive a newly required current-head check. A failed generic host
read remains a failed trace under the accepted verifier; do not fabricate its
missing file or weaken host-call schema to obtain approval.

Downstream handoffs are explicit body references, not completion dependencies:

- Foresight caller source `.github/workflows/eta-mu-review.yml` must adopt an
  independently accepted exact upstream workflow revision through its own
  PR140 checks and native review; its current explicit `1.18.31` selection is
  separate from this direct default `1.18.18` qualification.
- Foresight [isolated production-admission gate](https://github.com/open-hax/foresight/blob/aebfdf32600166c1bb9337d670a6272035b8c423/docs/agile/kanban/qualify-an-isolated-trusted-production-admission-gate-before-deployment-3056b8dc.md),
  UUID `dee4ddbf-c00b-4f4a-9f28-a6183056b8dc`, owns protected admission and
  independent authority qualification.
- [EC1.03 Services deployment](https://github.com/open-hax/foresight/blob/aebfdf32600166c1bb9337d670a6272035b8c423/docs/agile/kanban/services-controller-bound-embedding-admission-03a057e4.md),
  UUID `03a057e4-3098-4fe7-a5b8-95168f45ca96`, implementation owner
  `open-hax/services`, owns exact accepted application/image/config/controller
  admission and staging/production rollout. This child neither implements nor
  closes those operations and does not wait on later live CMS proof.

## Existing evidence and estimate

The private source/test proposal remains unapplied under the deployment session's
`review-state/eta-mu-native-description-preservation-source-preparation-v1`.
Its four predecessor wrong-description failures and 82-test private GREEN are
historical rehearsals, not repository RED, readiness or native qualification.

One point covers the narrow outer adapter, preservation tests and existing owner
qualification surfaces. A missing version-bound definition fixture, unavailable
hosted route or broader compatibility change is a named stop/re-estimation
condition. Preserve the original five-point parent, its unfinished canary and
all prior event/receipt/history bytes. No new dependency or rollout cycle is
introduced.
