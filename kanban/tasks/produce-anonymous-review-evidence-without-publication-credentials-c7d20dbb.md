---
category: "tasks"
labels: "workflow, review, anonymous, security, has-parent"
dependency: []
parent: "290f0cdf-9160-453e-a69c-67211432baa7"
type: "task"
write-id: "1792557026277-0.4un3w2ekpswqgbkh2h8"
points: "2"
title: "Produce anonymous review evidence without publication credentials"
priority: "P1"
status: "testing"
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

---
Execute the existing reviewed producer2 contract on accepted main7112, preserving the current verifier/recovery and reviewed PR22 card bytes. Native PR22 CodeRabbit+MiMo unanimous planning PASS is retained at e966; no warning-free historical carrier/adoption claim. Candidate composition96862eef keeps both Git parents, all69accepted commits and every exact ledger suffix once. Scoped implementation: actual extracted-step missing-App RED, then remove all candidate App/Discord/publication effects and rename producer-only summary; retain current full-input/discovery/invocation/deadline/recovery and no-secret/no-write controls. Only existing owning workflow+registered test change. Rebuilt source Rheos CLI115files56compiled0warnings. Initial isolated frozen install emits one missing unbuilt rheos-bin warning, retained as a real setup limitation, not zero-warning qualification. No future publisher, target enrollment, credentials, caller pins, Services or protected adoption. Readiness here admits only this bounded existing story, not runtime completion.

Local producer GREEN after genuine actual missing-App RED and red commit83dd5247. Existing registered owner passes338/338, zero failures/skips/warnings; five tests deleted only with deleted Discord adapter, three actual custody fixtures added, ten renamings/replacements mapped. Real extracted deterministic/review/final/summary steps prove synthetic same/fork-input no-secret/no-publication custody; malicious temporary review-write and canary-output variants fail at intended fake-transport/stdout boundaries. These fixtures use the existing TRANSPORT_MOCK_ONLY verifier and inert model/catalog/validator adapters: no canonical Muse-law/provider/native review/hosted publication/protection/adoption credit. Runtime supervisor, embedded payload, recovery/invocation owner files and executable fresh/final guards preserved. Unfiltered actionlint+ShellCheck, Node syntax, diff hygiene pass. Source red/green and exact proof will be published to a separate remediation PR; existing planningPR22 remains unchanged. Keep publisher5 and hosted3 as existing dependency owners; no caller pin/enrollment/App/Services change.

PR361 review follow-up scope, driven by actual canonical snapshot RED: both existing cards appear but the current pure Markdown task projector omits their points, parent and dependency. Repair only that existing .cljc projection plus its established unit/integration owners, passing through present canonical metadata without coercion/defaults; regenerate the disposable full board with the actual CLI and verify UUIDs, estimates 2 and 5, parent and dependency parity. This is a bounded review correction to the existing producer dependency, not implementation/admission of the future canonical event fold or a second board engine. The incoming 5-point fold owner remains separately held. Keep all historical ledger bytes unchanged, document existing absolute-path provenance and real reader behavior, and record caller-secret migration requirements before any pin advance. Runtime producer/verifier and caller pins stay unchanged. Retain full red/green results and real warnings; no hosted model/publication/merge qualification. Prior compressed audit tokens will receive an additive readable correction, not historical edits.

Snapshot follow-up re-description: current export embeds temporary checkout paths and has no portable export option. Extend only the existing board snapshot writer with explicit --relative-to <root>: resolve root from current working directory, export each source-path relative to that root, refuse outside-root paths, and retain every other field. Default snapshot behavior, live task paths and all historical events remain unchanged. Verify actual CLI default/relative/refusal behavior using real temporary task files and config, then regenerate the entire tracked snapshot with --relative-to .; no manual JSON rewriting and no canonical event-fold implementation.

Readable additive correction to the earlier execution notes: accepted main is 7112c36440d180ca183d6a3f89661cee161fdae5. Composition 96862eef543ace2bbd788221ae05ee19121312db preserves both Git parents and all 69 accepted commits beyond fefa. The original source CLI build compiled 56 of 115 files with 0 warnings. Original producer RED is 83dd52478fd6928027aa66bfa665f52b3953e671; GREEN is 9c05ba9d7de528529d08b901a1f3a6635fb34f7d. The registered owner passed 338 of 338 tests, with 0 failures or skips. Existing personal planning PR 22 is unchanged. Trusted publisher is 5 points; separate hosted proof is 3 proposed points. Native bundle run 39533211428 has now completed successfully at tested merge 8f4256e8f48c3a5a951f73441de60ce45754b6f0, tree 0c41aca0623bb5bd63983058b1abf0b78ca04cfc, and actually ran the 338-test owner. Real carrier warnings remain retained; fork producer jobs were skipped, so no model/publication qualification is inferred. These full source IDs and separated counts clarify prior comments without changing historical bytes.

Review correction execution: metadata RED dcee272c8a8dff406ec2cf9817bcfc35a60ec2df is followed by pure projector GREEN d8023409; export RED 11249932 precedes the explicit writer repair. Rheos tests now pass 212 tests / 1219 assertions with 0 failures or errors; all four package release targets and both kondo owners report 0 compiler/lint warnings. Provider-neutral eta-mu assertions pass 194 / 587 plus workflow 6 / 78; the original host-sensitive provider fixture failure and intentional process-escalation console warning remain retained, so the whole carrier is not zero-emitted-warning qualified. No runtime warning was suppressed. Current CLI bridge was rebuilt and forwards export help. The existing producer returns only to testing; review/done, native current-head gates, trusted publisher and hosted enforcement remain unqualified. Historical event prefixes and future fold/portability owners remain intact.

Audit correction: the immediately preceding comment incorrectly expanded metadata RED dcee272c into a nonexistent 40-character string. The authoritative Git-resolved metadata RED is dcee272c21474968467fe0a09c2bf9fc0479adf4; pure metadata GREEN is d80234094062fb02780b5c406160d1b1250167ad; export RED is 11249932650e3be158a31b370ffe66acb1cac93f. The prior incorrect expansion is withdrawn as source identity. All three references above were read from actual Git objects before this append. Original comment/event bytes remain preserved; test results and implementation source are unaffected. Final source/capture manifests use the Git-resolved identities.

Native review comment 4332916535 is valid and its scope is broader than the cited lines: all eleven owned flat receipts at published source 1635d310a36c25b42646f14d4810359306fc76d9 lines 326–336 lack :repo and use non-Z offset timestamps rejected by the local Receipt River law. Actual package API reproduces accepted baseline 60 invalid rows, reviewed plan 58, and published source 71. Preserve every historical byte. Eleven new current-time receipt-recorded/adjudication envelopes, built and validated through the existing package API, now bind each original source line, raw-LF SHA256, timestamp and independent artifact references with :repo open-hax/eta-mu and valid UTC-Z instants. They attest the format diagnosis and source identity; no old execution claim is rerun or automatically approved. All eleven new events validate with zero errors; all 71 original invalid rows and 118 original errors remain visible. No supersession protocol or whole-ledger pass is invented. The documentation now requires actual package construction/validation before future appends. This is a partial provenance correction with original history retained; current review disposition remains open. Producer stays testing; publisher and hosted proof retain separate scopes.

---