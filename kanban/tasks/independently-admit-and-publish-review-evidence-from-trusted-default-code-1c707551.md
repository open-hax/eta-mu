---
category: "tasks"
labels: "workflow, review, publication, security, has-parent"
dependency: ["cf32641a-b336-407e-b68b-c75ec7d20dbb"]
parent: "290f0cdf-9160-453e-a69c-67211432baa7"
type: "task"
write-id: "1792733218609-0.blx9hrfz7h8jf4081tw"
points: "5"
title: "Independently admit and publish review evidence from trusted default code"
priority: "P1"
status: "in_progress"
uuid: "ed4e2a2a-6055-4d53-9cea-f3971c707551"
assignee: "Codex"
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
`.github/review-publication-targets.edn`, validator-only
`packages/eta-mu/src/cljs/eta_mu/law/review_publication.cljc`, pure decision owner
`packages/eta-mu/src/cljs/eta_mu/domain/review_publication.cljc`, effectful
composition owner `packages/eta-mu/src/cljs/eta_mu/infra/review_publication.cljs`,
raw host adapter `packages/eta-mu/src/cljs/eta_mu/extern/review_publication.cljs`,
and registered `.github/scripts/opencode_review_publish_test.cljs`. Register
owning tests in `scripts/test.bb` when implementation is admitted. Law validates
schemas/contracts; domain decides enrollment, evidence admission, publication
intent and status reconciliation from shaped CLJS data plus an explicit clock.
Infra composes those decisions with existing verifier/publisher and extern I/O;
extern owns/decodes raw GitHub/filesystem/process values and contains no domain
policy. Pure decisions remain portable `.cljc`. These are explicit owners for
the existing five-point protocol, not new behavior. Reuse production `prepareReviewInvocationContext`,
`verifyReviewInvocation`, discovery verification and pinned Muse
`.ημ/review/publish-opencode-review.cjs`. Muse's
`scripts/verify-full-review-input.mjs` is a test fixture, not an artifact validator.
No Muse semantic change is established by this plan.

## Required protocol and acceptance criteria

- [ ] **Trusted execution and inert initial enrollment.** One regular central
  workflow runs reviewed accepted-default code. Ship an empty or explicitly
  disabled ordinary target registry: Services descriptors are unenabled data,
  not enrolled targets. Schedule/`workflow_run` paths reject disabled, absent,
  unknown or unproved targets before protected-environment admission, token
  mint, artifact consumption or any review/status write. A read-only accepted
  admission job must guard entry to the credential-bearing job. An enabled
  accepted registry entry later binds exact target repository ID, producer
  workflow ID/path, immutable caller/ETA/Muse sources, all seven exact Services
  evidence commands and verifier/build identity, plus source-bound setup and
  hosted-proof references. Uploaded metadata cannot enable enrollment or
  authorize source drift. Verify native adoption before use; a local accepted
  object is not default adoption. A scheduled reconciler reads enabled
  cross-repository runs; optional `workflow_run` only accelerates same-repository
  producers, not cross-repository subscriptions. Reusable YAML runs in caller
  context and cannot supply central repository secrets.
- [ ] **Noncircular proof bootstrap and later rollout.** Keep ordinary targets
  disabled while separate setup establishes protected default/environment
  custody, fixture identity, effective narrow grants and required protection.
  A separately admitted manual run from reviewed accepted-default code may
  select only an accepted, exact disposable fixture descriptor in an explicit
  qualification-only mode. This mode is unavailable to schedules,
  `workflow_run`, candidate inputs and arbitrary repository/ref overrides; it
  cannot enable or publish to an ordinary Services target. Apply the same full
  admission/verifier/publisher/status checks inside that fixture. Hosted-proof
  `164c2de7-7495-4738-94e1-a81167edefb0` uses this bounded route to prove the
  adopted code before any ordinary enrollment; it does not depend on production
  enablement or its own not-yet-produced proof. The fixture's native proof is
  the result of this mode, not a missing entry precondition; setup/source and
  all evidence/publication checks still apply. Only later separately admitted
  rollout may enable each exact
  target after its setup/grant/protection readback and applicable source-bound
  hosted proof are accepted. A generic fixture pass proves the mechanism, not
  another target's installation, effective grants or protection. Missing
  per-target proof remains a setup/rollout blocker; it is not silently charged
  to this source story or used to complete the setup parent.
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
  Keep review publication at most once per qualified intent, with unknown-POST
  retention/discovery unchanged. Status reconciliation is a separate bounded
  operation: deduplicate unchanged fresh statuses, then revalidate the same
  current tuple, accepted sources/enrollment, still-available native artifact
  and full-input evidence, original intent, effective identity/grants and exact
  native review/all-inline readback before refreshing success on that same M/C.
  Refresh does not invoke a model or repeat the review POST. Use an explicit
  clock and finite accepted refresh interval with margin below seven days
  (ordinary default 24 hours), serialized under the existing target/M/context
  lock. Read native status timestamps and complete context history, bound total
  per-SHA/context writes, and refuse on exhausted/unknown budget, clock anomaly,
  inaccessible or expired evidence, revoked qualification, tuple drift or
  ambiguous status POST. Resolve a status POST's uncertain result by native
  GET/readback; never blindly repeat it. Retain due time and actual last
  successful refresh; delayed/dropped schedules may still block, with no
  availability promise. GitHub documents a required check success within the
  past seven days in the chosen repository; this planning change proves no
  actual aged-PR failure. Do not use a
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
custody and synchronous required-gate coupling, then use actual domain/infra
entry points with a fake GitHub transport, physical inert artifact fixtures and
a synthetic credential canary. Assert the initial disabled registry produces
zero protected-job/token/artifact/review/status effects for schedule,
`workflow_run` and ordinary manual inputs; forged proof/mode/target/ref cannot
activate it. A controlled fixture-only manual input with accepted source and
setup succeeds only inside the exact fixture and leaves ordinary targets
inert. Exercise later per-target enable admission separately; generic fixture
proof cannot satisfy another target's setup. With an injected clock, a fresh
success suppresses a write; a due, fully revalidated unchanged tuple emits one
status refresh and zero new model/review POST; concurrent collectors still emit
at most that one refresh. Expired evidence, revoked readback, changed tuple,
unknown clock/status outcome or exhausted write budget cannot refresh success.
These causal freshness controls do not claim a seven-day native failure.
Assert pending before qualification and success
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

---
Planning-only correction for exact native Codex review5535776233 roots4285070063/4285070084/4285070093 at1b2608f. Name actual pure domain and effectful infra owners while law validates and extern decodes raw I/O. Ship ordinary registry empty/disabled with read-only admission before protected work; separately admitted accepted-default fixture-only manual bootstrap uses actual setup and full protocol, without ordinary-target enablement or circular proof prerequisite. Later target rollout requires target-specific setup/readback and applicable hosted proof. Separate bounded current-evidence status revalidation/refresh (ordinary24h) from at-most-one review POST; preserve unknown effects, native write budget, sharedM meaning and zero extra model/review invocation. Root fully read exact11030B proposal4363e4b3 and14707B two-body diff04cdc666. Keep provisional5/P1/breakdown, producer2 dependency and parent open;2+5+3=10, separate Fsetup3/Services consumption. Body planning only; no implementation/readiness/publication/model/App/account/runtime effects.

Implementation scope checkpoint for existing publisher five-point owner, not a new plan or completion. Exact unchanged reviewed card blob b53d8bd13a913332a135fb89b0bfc26059571a59 (17978 bytes) matches planning e9666aa2dc9e593dce783be430b80d9bed0de6ae and current producer fb8bf0e18b0aac9179e821952adfa7f257c5160f. Fresh canonical planning gate PASS: CodeRabbit and MiMo exact-head approvals, nine checks, four resolved threads. Work in isolated feat/trusted-review-publication-20261021 from fb8. Begin law/owning-test causal RED then pure portable enrollment/native-evidence/intent/status decisions GREEN; retain every criterion and register owning tests. Domain uses decoded Clojure data and explicit clock; no new invocation/board/ledger authority. In parallel test actual pinned Muse relocation/build identity and accepted eta-mu Clio durable stream-slot APIs before effect adapters. Missing positive transport/archive/durable recovery work stays explicitly incomplete on this same owner; no empty-registry/refusal-only full-card claim. Producer testing is preserved as qualification dependency; no accepted-default adoption is implied. Ordinary targets remain unenabled; no App/provider/grant/environment/protection/merge/pin/CMS/Cephalon effect. Keep publisher setup, hosted proof, warning parity, receipt-history and review obligations separate. Main owns board/receipt commits; scoped delegated implementation owns only assigned law/domain/test files. Lawful readiness and implementation hops follow, without moving any other card.

Execution checkpoint: portable source core is implemented at 754d7b639c8e889c4266a9d58c2f75e6ff1906f5 after test-first commits c127de78529a8149e65ad789a242ab36d0aa8590 and 822e363dc75626cf9b1c2c2b799cc5fdb9db5834. Registered owner: 14 tests / 216 assertions pass. Complete NBB 1.5.211 and Babashka 1.13.219 data parity: 22 cases. Full CLI: 194 tests / 587 assertions plus workflow 10 / 183 pass; scoped and CLI kondo report zero errors/warnings; CLI release has zero compiler warnings. The existing intentional SIGTERM fixture diagnostic remains in raw stderr, so strict whole-carrier qualification is not claimed. Independent source review verified the exact four frozen hashes after causal fixes for separate collector/producer sources, verified full envelope and actual Muse native payload, inline author/head/review membership, short observation freshness, shared-M status history, pending write proposals and exhausted-budget deduplication. Origin keywords and effect proposals are internal shaped facts, never authentication or wire authority. Runtime proof independently rebuilt pinned Muse c1369 twice, retained the original opaque witness through physical relocation and exercised actual recovery; same-pin hosted identity remains unavailable because root uses Muse 0b9a. Accepted ETA 7112 packages/clio passed actual durability, process crash/reopen and cross-PR shared-M primitive tests, including 18 assertions and one fake POST; protected shared-store adoption remains unproved. Immutable proofs: pure core ca4dd05a1dabaa4fa533677c48dce8b3020ed38d7909bf8b731e97aa9419ba9a, verifier a037f990af6bba87fad5b1e10ce3d3ae54f2c313aa6ae0ac4dc23803b331ee9b, persistence 315e872800f0c25306cec8bc7e0823ef3139fbc270780023d6c505452bb64056. Full five-point story stays IN PROGRESS: central workflow/disabled registry, bounded physical ZIP/native collector, authenticated source/build custody, actual Clio/Muse adapters, durable status claims, one-wire POST/native complete readback, protected setup, accepted-default adoption, fixture hosted proof and ordinary rollout remain incomplete. No provider/App/credential/grant/environment/protection/merge/pin or CMS/Cephalon effect. Preserve every original ledger byte, all other card states/planning and current source histories; no full publisher completion or native approval credit.

Continue the already reviewed physical archive acceptance slice of this same in_progress publisher card from 5610a2cc42126114cd599cef33cbee1af97000e3. Use the owned clean feat/trusted-review-publication-20261021 worktree, preserve every prior ledger byte and all other cards, and commit causal law/test RED before portable shape/domain and outer extern/infra GREEN. Exact pinned upload-artifact v4.6.2 sources require DEFLATE data descriptors and may use ZIP64; exercise actual compatible archives as well as stored members. Discover existing decoders first; no ETA physical ZIP admission implementation was found, and transitive legacy yauzl/extract-zip do not establish bounded custody. Add finite configured byte/member/uncompressed/operation/decode admission, central/local/descriptor/CRC identity, safe unique mandatory paths, no links/special files, actual digest and sealed physical reads. Host filesystem/codec/time/worker operations belong only in extern; portable parser and decisions stay in cljc. The existing publication core will consume the derived physical proof, never a supplied archive-proof assertion. Keep exact native collection/authenticated source custody, actual review/status effects, protected setup/default adoption, full publisher completion and hosted proof unqualified. Register positive physical archives and meaningful adversarial byte controls, retain actual warning diagnostics, and validate new source-owned ETA receipts through its consuming API before append. This is execution under the existing acceptance criteria, not a new task or planning PR. No secrets, App/provider/auth/protection changes, merge, root pin advance, or CMS/Cephalon actions.

Finite current-head native review correction under this same publisher five-point owner and strict shared-worktree path partitions. CodeRabbit 5610 findings: P1 root4333582639 / PRRT_kwDORu27H86upMtO identifies verified envelope versus publisher payload divergence; P2 root4333582646 / PRRT_kwDORu27H86upMtS identifies malformed status refresh values causing cross-host throws; P2 root4333582629 / PRRT_kwDORu27H86upMtJ identifies privileged-input scanner bypasses. Delegate only the existing publication law/domain, opencode_review_publish_test.cljs and workflow-contract test. Reproduce COMMENT envelope versus APPROVE/body/normalized-inline payload differences through the accepted Muse projection and retain the exact payload in any post-review proposal. Exercise malformed finite numeric policy values in actual NBB and Babashka. Reproduce expression-only secret/input scanner bypasses and preserve harmless prose. Commit causal tests-only RED before the narrow GREEN. Archive files and scripts/test.bb remain separately owned by the archive worker; one coordinator owns Git, card and receipt writes. Keep all native findings open until published fixes and fresh readback. Preserve every pin, original ledger byte, warning hold and unfinished full publisher obligation; no default adoption, native publication, merge, protection or CMS/Cephalon effect.

Implemented bounded physical archive admission and the three native PR362 findings at code 51a0ceecb90c7ed92e24f24e4bef7cb4afef5275. Actual archive10/71, publication17/554,138 NBB/BB cases, independent59physical cases, CLI194/587+workflow11/199, scoped lint and release0warnings. Content-addressed evidence2441693df7dcc5948e91bd351270357255e9f78c83a92e278dbf8cd88571a1e7 retains REDs, async harness failures, native format and actual immutable Muse interface probes. Whole-operation cancellation and declared-size decode caps are enforced; refreshed host clock does not refresh stale facts. Physical proof supplies no native metadata authentication or JSON meaning. Still missing authenticated collector/build custody, full immutable verifier orchestration, durable claim/native POST+GET, protected registry/default adoption and hosted rollout proof. Remain in_progress/Codex; no acceptance, signing, deployment, root pin advance or paused product restart. Historical71invalid/118errors and carrier warnings remain visible.

Verified native review 5596322438: correct two test-quality gaps at test source 22dce3bb7644e855deaaf28594f017141592f877. Publication parity now requires explicit value-result rows on both hosts, refusing exception sentinels; actual 17 tests / 557 assertions and 138 cases pass. Parent cleanup assertions now measure only admission-worker termination; nested sealed handles and decoder workers are not observed there. Actual archive 10 / 71 and scoped lint zero warnings. Evidence 2b4d4b8bb1773239f623eb51cc64dbd33a18ee997d08eaaad9d8932666a5188d. Product runtime unchanged; retain original records and narrow prior measurement claims additively. Remain in_progress/Codex, no completed publisher, approval, protection waiver, deployment or paused agent effect.

Continue executable source work under this existing five-point owner from 6a796582d74f93c1a1f18ca5c89eb3a0b19445eb. Implement the read-only native collection boundary already required here: accepted-registry/event/mode preflight before any native call; independently read repository identity, live branch base, PR head and test-merge parents/trees/ancestry; bind native run and original attempt, workflow metadata, complete bounded jobs/artifacts and repeated tuple observations. Use finite explicit request/page/byte/operation bounds and fixed GitHub GET transport, with no credential forwarding across redirects. Pure contracts/normalization/decisions stay in cljc; native I/O stays extern; infra composes. Retain causal law/test RED before product GREEN and actual no-write call inventory. Return observed native facts and provenance only: do not invent workflow/source/build custody, executed commands, setup/grants, archive proof or full-input verification from accepted configuration. Complete immutable Muse verifier orchestration remains a separate real port being recovered from existing APIs in parallel; no uploaded verifier or candidate code executes. Keep ordinary registry disabled, no token mint or native publication/status/model effect. Source story stays in_progress/Codex; current hosted/review/receipt/adoption holds and paused CMS/Cephalon remain. This executes the existing acceptance criteria and creates no standalone plan/card.

The independent accepted-source NBB probe now invokes the retained own-built immutable Muse c1369c223cf3c57e3e31934a6d746bfcdfe73f5a verifier over 69120 raw bytes and 36 pages, retaining the original opaque submission witness. Full verdict/context hashes match; substituting a collector-local witness refuses actual-submit-binding. Continue the already required immutable verifier integration through publisher-owned extern/infra and causal tests in parallel with native collection. Reuse actual prepareReviewInvocationContext, verifyReviewInvocation, discovery verification, strict JSON and accepted publisher payload validation; do not use the test verifier or broaden assessment invocation input authority. Only hash-bound accepted runtime code may load. Consume admitted raw archive bytes and independently reconstructed full input; preserve Unicode/raw byte identities and producer witness. Source/byte/runtime proof does not establish protected registry/default adoption, native metadata authentication, effective grants or completed publication. Those remain independent ports and explicit holds. No uploaded module, candidate script, model, native review/status write, signing credential or paused CMS/Cephalon effect.

Independent full-input reconstruction is the other required verifier input. Add an effectful read-only Git-object adapter under this same source story: validate native B/H/M and object identities in a trusted object store, derive complete raw merge-base-to-head diff with candidate hooks, external diff and textconv disabled, retain exact bytes/digests/argv and native provenance, and provide the trusted reconstruction function to the actual verifier bridge. Never execute checkout code, scripts or dependencies. Test real temporary Git histories, Unicode and binary/path cases, poisoned hook/textconv configuration, missing/mismatched objects, wrong parent/tree identities, stale observations and byte/time bounds. The original run event G/caller workflow source cannot be invented from run.head_sha: actual native run metadata may omit them. Missing original-event/source custody remains an explicit unresolved requirement and refuses complete publication. A current test merge proves topology, not original event identity. Preserve pure laws in cljc, all historical evidence and same in_progress owner; no new card, metadata authentication by declaration, native write or paused product effect.

Executed native collection, independent Git reconstruction and immutable Muse verification under existing five-point publisher owner. Source `57a3ad2356c3c515474bc2b29ec36a700abe56f4` retains causal RED/GREEN and four concrete review repairs: fixed trusted Git executable, strict structural headers, exact attempt-status agreement, and separate collector versus PR-producer triggers. Registered owners pass: collection 19 tests / 106 assertions; source 7 / 101; immutable verification 2 / 104; publication 17 / 557 with 138 NBB/Babashka cases; archive 10 / 71. Full CLI 194 / 587 plus workflows 11 / 199 pass; owning lint and CLI release have zero warnings. Independent source/byte and actual runtime review captures are preserved in `92355701f2d8375caa7ddcc48acc3ee07c62896d212ff47f78e69b94be59412f` and `051a9f965222391ee7cb4948c60be713ccf3a69f43e3bbefefde16e990e7b971`. Original harness failures, ambient-provider test failure and wrong-cwd lint failure remain retained alongside corrected owning results. Actual public GETs execute, while absent production registry refuses. Real source reconstruction stays incomplete and cannot pass full verification: original G/caller custody and independent tools, changed patches and input proof remain missing. Actual immutable APIs and recovery replay run locally with inert complete fixtures; there is no native publication or adoption credit. Worker bounds cover their phase; trusted reconstruction must enforce its own cancellable budget. Keep publisher in_progress / Codex, preserve every card state/planning and original ledger byte. No full story, merge, credentials, grants, protection, root pin or CMS/Cephalon change. New execution evidence: `.ημ/review-evidence/trusted-publication-collector/execution.json`.

Native current-head pagination correction under this same five-point publisher owner. Review 4343556642 / PRRT_kwDORu27H86vArzt: actual get! Link header extraction destructures the header string and loses rel=next. Review 4343556656 / PRRT_kwDORu27H86vArz0: complete-URL comparison rejects equivalent query order and GitHub numeric repository routes. Reproduce each through actual GET/header and composed multi-page jobs/artifacts tests, commit causal tests-only RED, then minimal boundary/parser and pure component-validation GREEN. Normalize URL only in extern; compare exact HTTPS API authority, canonical repository identity, supported route suffix, singleton page/per_page values and reject extra/duplicate/missing query fields. Always issue locally reconstructed /repos/ requests; never follow untrusted URL bytes. Preserve budgets, all old bytes/states/planning, absent registry refusal and incomplete native custody. This is native finding repair within existing acceptance, not a new plan/card or completed publisher. No native publication, credentials, grant/protection, root pin or CMS/Cephalon effect.

Executed native pagination findings P1 4343556642 and P2 4343556656 under the existing five-point publisher. Source `9fc17a59b82997b8a1c8903c51c0e0b8f2f45bf9` preserves actual next-Link targets, validates semantic query order and the matching numeric repository route, and rebuilds every next request locally. A present malformed next link refuses even when row count equals total; actual host parsing is exercised through a preloaded child NBB test. Causal REDs, malformed mock failures, the unused test require warning and wrong global NBB probe are retained. Final registered collection 23 tests / 154 assertions, full CLI 194 / 587 plus workflow resources 11 / 199, owning lint and CLI release pass with zero warnings. Ten pure values agree in NBB/Babashka. Actual public GitHub GET returns HTTP 200, total 4 and the preserved numeric-repository next link; independent exact-source review reproduces 23 / 154 with no additional pagination defect. Evidence ff04b9a05d33c5cf98bffa84d30003f79513d4df5f8ed47fc93c2f8d0525f6a7 retains 180 captures. This is read-only public observation, not original G/caller/private custody, complete reconstruction, native publication, protected adoption or hosted successor qualification. Keep in_progress/Codex, all 309 states/planning and historical ledgers, root pins and paused CMS/Cephalon unchanged. Detailed source: .ημ/review-evidence/trusted-publication-pagination/execution.json.

Continue existing full-input admission execution by adding bounded native PR changed-file inventory to the fixed collector. Capture changed_files from the same native PR tuple; enforce the documented 3000-file endpoint ceiling, complete page/count and unique filename laws, fixed locally rebuilt routes, exact retained native patches and explicit unsupported missing patches. Read the inventory in both tuple/run observation passes so any file/count/patch drift refuses. Reuse existing reader budgets, typed shapes and pure laws; no second collector authority or arbitrary URL seam. RED tests precede GREEN, then actual public fixed GET/native page probe, independent review, NBB/Babashka pure values and required CLI/lint/release. Preserve missing original G/caller source, runtime tool registry and input proof as incomplete; do not fabricate native custody or reconstruct PR patch data from Git. Existing publisher remains in_progress/Codex,5points; all other states/planning, ledgers, primary pin and paused CMS/Cephalon preserved. No registry activation, credentials, grants, protection, publication, merge or deployment.

Executed native changed-file inventory under the existing five-point publisher. Source `48c9e810fc067f1528ab59a137568b17fe29db90` reads /pulls/N/files in both existing enrolled tuple/run passes with fixed local routes and existing budgets; validates exact changed_files from 0 through 3000, unique filenames, seven native statuses and required typed metadata while preserving optional prior names. Missing/null/string patches remain distinct; complete API rows/pages never imply complete patch text. Registered collection 30 tests / 224 assertions and independent replay pass; full CLI 194 / 587 plus workflows 11 / 199, owning lint/release zero warnings, and 20 actual pure NBB/Babashka values pass. Actual fixed public GET/internal inventory probe reads 90 files twice over 9 pages per pass, 20 requests / 18 page requests / 1,981,780 response bytes; observed B `7112c36440d180ca183d6a3f89661cee161fdae5`, H `ab03d9350e40a368748b2d1c4612a0038d3c21af`, reported M `760f14fd20f52e177215d413a2bc80b06ddc7fa7` stay stable and inventories equal.17 patches are missing, not fabricated empty. No registry enrollment, original G/caller custody or native publication follows. Independent required-row schema finding is fixed through retained RED/GREEN. Native API/current source survey confirms original G/executed caller source absent; historical HMAC payload admission and Clio persistence do not establish missing run/source relations. Preserve causal failures, ambient provider failure, wrong API path and coordinator probe race. Keep all 309 states/planning, histories, root pins and paused CMS/Cephalon; publisher in_progress/Codex. Actual source reconstruction/full verifier integration, runtime tools/input proof, Clio publication/readback/status, protected adoption and successor hosted proof remain unfinished. Evidence: 0f268a323e13e7393777e8ca88c9b18fb17305f0ec52373c10d39979214703d9 (247 captures), .ημ/review-evidence/trusted-publication-files/execution.json.

Execute the existing durable publication-intent and one-use claim criterion under this five-point publisher. Consume extracted canonical Clio candidate 5a7a04c6ced7b15be940e16dc772c95b0525d55f through an explicit exact Git dependency alias and reproducible ETA NBB/source integration; leave old ETA packaged Clio and root accepted Clio/ETA gitlinks untouched. This candidate is a local capability dependency, not accepted-default adoption or enrollment. Reuse actual Clio schema/event stamping, canonical replay and fsync-backed single-partition append with a shared target/M/context stream and bounded optimistic CAS. Intent versions differ from stream sequence. Do not add another journal/lock engine or assume random-ID segment creation supplies global slot arbitration. Add publisher-owned portable laws/catalog/projection, fixed bounded worker composition, and tests before implementation. Persist reservation and post-started/claim consumption before any future wire action; only a fresh appended outcome may mint an internal single-use capability. Replayed/already-present/recovered claims, occupied slots, timeout, crash or uncertain append permit discovery only, including recovery that later appends successfully. Existing Clio locks have no native timeout, so use a finite separately bounded process with hard termination/heap/input/output/CAS bounds, fixed code/operations and stripped environment. Actual kernel dependency/source/build metadata and registered tests are in scope; no kernel semantic edits. Prove actual multi-process contention, persistence/restart, exact retry/uncertain outcome, invalid admission producing no event writes, and forged/reused capability refusal. No HTTP publication, signing, registry activation, credentials/grants/protection, caller/root pin advance, deployment or product-agent execution. Missing original G/caller/runtime-tool/input-proof custody and complete native verifier composition stay incomplete. Preserve all card states/planning, every historical ledger byte and paused CMS/Cephalon; keep publisher in_progress/Codex.

Scope amendment after independent source6488a34a evidence: the actual inode-swap probe shows pathname identity checks can redirect append to a different inode. The pinned Clio5a7 API has no supported expected-descriptor-identity guard inside its owning lock. Revise the initial no-kernel-edit implementation assumption: extend the canonical extracted Clio candidate in existing riatzukiza/clio PR5 with a minimal declarative expected-file-identity guard checked on the actual descriptor after acquisition, before read or append. Retain default arities/event/schema/recovery semantics and Clio's existing lock/admission authority; no nested manual locks, copied append engine, production monkeypatch, new journal or ETA-specific kernel policy. Add causal tests before implementation and exercise owning NBB/JVM/portable gates. Keep host handles inside Clio externs; unsupported identity capabilities fail visibly. Consume the proved candidate through a new exact full-SHA alias only after its source freezes, then replay actual replacement-inode refusal and normal contention/recovery. All accepted root pins, card statuses/planning and history remain unchanged. This is a candidate dependency capability, not acceptance, default adoption, publication authority or protected setup. Continue the independent numeric-fold RED repair in the existing ETA publisher. CMS/Cephalon paused; no credentials/grants/protections/caller-pin/deployment/merge changes.

Executed Clio-backed publication intent within the existing five-point publisher, source `c72928f632f50f832b5dc54a732697d15e0cc4d2`, exact candidate kernel `5fad794de1a9e23d6e5aaad42eaa933be1c070be`. Uses one authoritative precreated monolithic ledger, canonical replay/stream-slot CAS and actual-descriptor identity guards under the owning Clio lock. Fresh admitted post-started acknowledgments alone may mint a private process-local one-use effect capability; restart/replay/recovery never grants fresh authority. Caller-selected installation roots, public capability minting, mutated recovery-map injection and numeric fold/SHA-law mismatches were repaired through retained causal RED/GREEN. Independent wrong-inode reproduction required a scope amendment before canonical kernel repair; no copied engine, extra journal/lock authority or production interception. Final source-frozen owning gate summary is in .ημ/review-evidence/trusted-publication-intent/execution.json; all failed mechanisms and earlier-source results remain source-bound. Original G/caller/tools/input custody, full verifier composition, protected installation/adoption, effective grants and native POST/readback/status remain unfinished. No registry enrollment, native publication, approval or successor hosted credit. Preserve all309states/planning, four ledger prefixes, root consumer pins and paused CMS/Cephalon; publisher stays in_progress/Codex. Candidate kernel consumption is not accepted adoption. Evidence:69c3ffe6776f476cd409421d4b1a4df250e57d1569a8685d3afa452f5db248d8 (809 captures).

Executed bootstrap and native finding repairs at source 1b76c9e1e6d6122a844ef418b0b4439ac8ee9495. Package-wide NBB config moved into dedicated intent-runtime entrypoints; cold ordinary workflows run without bb on configured NBB 1.5.211 and fixed 1.5.212. RED b0ac577cfd3c899d4baac553c870d47918933850 precedes GREEN 14cb2742bfd1a15d5ab450b8f3ee6d3a64147790. Native classifier P1 RED 328a22c99caa2a1ed56fbbf5a7bef7c9567bc609 reproduces 24 failures before GREEN 1b76c9e1e6d6122a844ef418b0b4439ac8ee9495. Unknown append errors retain append-outcome and exact recovery; typed admission refusals remain. Exact parsed collection trace detects a fourth real GET that the prior substring oracle missed. Intent25/143, collection30/224, review-workflow339, CLI194/587 plus workflows11/199, zero-warning lint/release pass. Ambient-provider failure retained; removing four named provider variables makes the no-provider fixture valid. Independent actual public probes pass private one-use capability, opaque recovery/second-use refusal, no recovery authority and fresh-clock failure. Captures archived with exact hashes. Publisher remains in_progress/Codex/5points; 309 states/planning and four ledger prefixes preserved. Original G/caller, full authenticated publication/composition, native publication/readback/status and protected adoption remain unfinished. No old Sandbox credit, credentials/gates/pins/merge/deployment or paused CMS/Cephalon advance.

P2 launch-error repairs executed at b8af64f41de139d17741ee2696ab82bdb38a81d1 after tests-only RED b599dc1cdbebc3bdd19279f19ef4100fbacd2196 (29 tests / 200 assertions,32 causal failures). Shared private worker wrapper returns transition refusal for known pre-spawn installation/input-bound errors, recovery unknown preserving prior uncertainty, and unknown for unclassified exceptions. No capability or recovery authorization is minted from thrown data. Focused29/200, full CLI194/587 plus workflows11/199, owning/test lint and release0warnings pass. Actual host-port controls cover missing installation and oversized requests; genuine Clio opaque receipt survives installation and generic recovery launch failures, real retry replays one event, second use refuses. Independent actual public adapter replay also passes at this source. Publisher stays in_progress/Codex/5points; 309 card states/planning and four ledger prefixes preserved. Earlier ed4c native Sol/sync success remains bound to actual merge abda0ec5cb195abe8ec497e29775ca69a8f5c5c0, not this successor. Original G/caller, full publication/composition, native publication/readback/status and protected adoption remain held. Root pins/credentials/gates and paused CMS/Cephalon unchanged.

Execute the next existing publisher acceptance criterion: bounded read-only native review/all-inline-comment and complete per-M/context status-history readback. Add portable laws/shapes and owning infra composition, reuse the fixed GitHub GET transport, URL component validation, budgets and enrollment refusal. Production entry must read the fixed registry and refuse absent/disabled/unproved enrollment before any GET. No caller registry override may activate it. Fixture transport is explicitly inert, never authenticated publication evidence. Re-read current PR/base/head/proposed-merge before and after stable complete paginated observations; preserve exact native review body/event/head/actor, every inline payload including unavailable positions, status context/creator/timestamps/receipt URL and explicit original/raw identity evidence. Traverse complete status pages before filtering this exact M/context; unexpected same-context writers remain visible and cannot evade budget/identity checks. Do not invent App identity from expected fields: missing performed-via-App or trusted installation association remains unsupported/unqualified. Reuse existing domain readback/status expectations; no second gate or invented authority. Registered causal RED precedes implementation; test full/two-pass pagination, malformed/mismatched links, forged/extra/missing/duplicate comments/status IDs, tuple drift, stale times, missing identity, exhausted byte/page/request/time budgets and zero effects for absent registry. Run actual fixed public GET observation/refusal probes and independent source review. This is source execution under the same five-point publisher, not another plan/card. No POST/model/token/signing credential, registry activation, source adoption, grant/protection/caller/root pin, merge/deployment or CMS/Cephalon execution. Full publication/original G/caller/verifier composition remains unfinished; publisher in_progress/Codex.

Executed bounded read-only review/comment/status readback at source 6e1f088fcd81dba5e9edaf526e453962875215c6. Causal RED28de0da1 reproduces73failures/9tests114assertions before GREEN6fa625cd. Independent native-inline App conflict finding reproduced then tests-only RED141c11e3 (2failures/10tests130assertions) precedes GREEN6e1f088f; raw conflicting identity retained and refused, matching App still unsupported. Readback10/130, collection30/224, publication17/557 plus138NBB/Babashka parity, eight new portable values and independent successor controls pass. Full CLI194/587 plusworkflows11/199, owning lint/release0warnings pass; separate test cleanup diagnostic retained. Production fixed absent registry refuses caller override before any GET. Actual public fixed GET reads real review, inline-comment page1 and per-M status page1; no full traversal/authentication credit. Complete all-status traversal before context filtering, finite shared budgets and two stable passes are exercised in explicitly inert fixtures. Native App identity never synthesized; original_commit_id stays raw/currentcommit law, original event/caller and installation association remain unsupported. Known reviewID required; unknown POST discovery and full authenticated publisher composition/adoption remain unfinished. Publisher stays in_progress/Codex/5points. Preserve all309states/planning/fourledgerprefixes and rootpins, CMS/Cephalon paused; no credentials/gates/activation/merge/deploy.

Execute lossless review-input consolidation under this same publisher after native CodeRabbit reply6357020571 declines476files>100. Frozen db99 has499changed paths:90non-evidence and409evidence; all409added afterB7112. Existing22archives and source/test/ledger/card/config remain truthful custody inputs; no binary content becomes reviewed. Preserve every exact evidence byte, Gitblob identity and100644/100755mode in one contentaddressed bounded-readable bundle/index, including oldgziparchives and current owned survey/assessment captures. Keep all90non-evidence paths visible; no production/test/law/config or canonical ledger/card is hidden. Preserve exact live a037f990 verifier fixture and latest readback checkpoint. No capture removal until full roundtrip/index/hash/mode, runtime-consumer and originalGitdb99 retrieval proofs pass. Target totalchangedpaths<=100 without providerfilterassumptions. Inspection is bounded, fixed-local, verify-by-default and stdout-only on explicit legacy path lookup; no extraction overcheckout, arbitrarypaths/symlinks, autoexecution or auth access. Independent review checks entirebundle, strictpathbudget, requiredfixture/registered verifier test and actual tamper/path/bounds controls before publication. Retain original476skip and everyfailedattempt; do notclaimapproval/fullbinaryreview or change reviewpolicy. Publisher in_progress/Codex/5points; preserve all309states/planning/fourledgerprefixes, rootpins, nativeproofsourcebounds and pausedCMS/Cephalon. No standaloneplan/card, paidreview, credential/grant/protection/caller/adoption/merge/deploy effect.

Executed lossless review-input consolidation at source 03878641fd55b9327cdb01e8b522a99bab05d587. Native CodeRabbit request 6357019277 was skipped: 476 included files exceed 100; no review/approval/round credit. Prospective total diff now 100 paths: all 90 non-evidence source/config/card/ledger paths plus 10 evidence paths. Independent exact roundtrip preserves all 409 originals, Git blobs/modes and 22 archives; required fixture and readback checkpoint remain live. Bundle and two failed builder artifacts preserve all intermediate bytes. Fixed bounded read-only helper verifies 500 members/96912594 bytes and never extracts or executes. Independent P2 found unchecked external second read; RED 4 tests/50 assertions has two failures before verified-byte retention repair; GREEN 4/50 and lint zero warnings pass. Post-removal runtime review-verification 2/104 passes. Bundle contents receive no native binary review credit. All 309 card states/planning and four ledger prefixes preserved. Receipt 360 validates prospectively; historical 71 invalid/118 errors retained. Earlier DB99 native full Sandbox/owner proof stays bound to merge 84ca1a0b; 22 carrier diagnostics remain. Publisher stays in_progress/Codex/5points. Original G/executed caller/input custody, full authenticated publisher and protected adoption remain unfinished. No acceptance, credential/grant/protection, root pin, merge/deploy or paused CMS/Cephalon change.

Execute the next existing publisher prerequisite from c9ef250dcf5d981c820bbca1abf7c578ee864412: actual durable post-started to post-unknown through the existing bounded Clio worker, canonical stream, descriptor guard and slot CAS. Preserve exact binding/store/claim/version and original owner/claim; uncertainty remains active and excludes competing reservations. Strengthen replay/portable transition continuity so wrong claim/owner/version or reserved/terminal/cross-lock outcomes refuse. Bind private post authority and opaque uncertainty authority to the exact configured store and started claim/version. Retire same-claim wire authority before any admitted outcome attempt may become durable or uncertain; forged/cross-store/cross-claim requests cannot revoke another claim. Consumed wire authority must not prevent recording its uncertain result, and no outcome/replay/recovery/restart may mint or revive POST capability. Reuse existing schema and owning append/recovery engine; do not introduce a second journal or caller-boolean authority. Keep observed and ambiguous-absence public writes refused pending actual native discovery/authentication contracts; original event G/caller/input custody and full authenticated publisher remain explicit unfinished work. Commit registered tests-only causal RED before narrow law/shape/domain/extern/infra GREEN; actual public adapter must persist three canonical events, survive restart, reject duplicate/stale writes and prove conservative capability retirement across launch/append uncertainty and exact recovery. Retain all existing inode/contention/numeric/fresh-clock tests, actual NBB/Babashka value parity, full CLI194/587 plus workflows, owning/scoped lint and release zero compiler warnings. Capture all commands/source/failures under root .ημ/stabilization/outcomes-20261023, without new ETA evidence paths (native scope remains100). Main owns Git/card/canonical ledgers, delegated worker owns only assigned current source/test paths. Preserve all309 card/planning records, four historical prefixes,23accepted root pins and paused CMS/Cephalon. No standalone plan/newcard, native POST/status/model/signing/credential/registry/grant/protection/adoption/caller-pin/merge/deploy effects. Publisher remains in_progress/Codex/5points; no full-card completion or successor native/review credit.

Executed durable post-unknown journaling at source 3734a46cc1c5d295800de463e04ee80c54630773. Tests-only RED d81f8fb48fe7988834ff440af80344f348c4527e has39tests/303assertions,59causal failures0errors before initialGREEN4f6370fd. A fresh exact post-started ACK now mints separate private wire/outcome receipts bound to configured store, binding, owner, claim and startedversion. record-unknown! retires its associated wire before freshness/worker uncertainty; genuine consumed wire still permits one durable outcome; no replay/recovery/restart can mint or revive POST authority. Canonical Clio schema/kernel/worker remain unchanged. Exact owner/claim/version and active shared-slot exclusion survive replay. Public caller outcomes observed/ambiguous remain refused. Independent wrong-ACK P2 at initialGREEN falsely consumed durability receipt with only2events. RED771e4086086c372a89183692d114dcd80969a5d9 has40/390,22causal failures before finalGREEN3734a46c. Final40tests/390assertions,0failures/errors; exact state/claim/naturalnextversion required before success/receipt cleanup. Same independent ACK6/primary26/freshrestart5checks pass with no remaining narrow finding. Twelve actual portable result envelopes equal NBB/Babashka; full CLI194/587 plusworkflows11/199, scoped/owninglint0warnings and release0compilerwarnings pass. New inert positive contexts are fresh per installation/case; production freshness policy and original29tests unchanged. Initial time-contaminated RED and cleanintermediates retained. First credential-free fullchecks exposed host npm token interpolation warnings; corrected empty task-owned userconfig preserves project config without forwarding credentials. Known cleanup diagnostic remains; no strict whole-carrier warning qualification. Earlier c9ef250d native Sol/sync/Rheos/fullSandbox succeed at actualM1db7f0c1 with nativeparents/tree proof;23carrierdiagnostics and469023698-byte metadata-only artifact remain sourcebound. All309states/planning/fourprefixes, rootpins and pausedCMS/Cephalon preserved; receipt361 prospectively valid,71historicalinvalid/118errors retained. No new evidence paths; total native review scope stays100 with90non-evidence paths visible. OriginalG/executedcaller/profiletools/inputproof custody, observed/ambiguous native authentication, complete reconstruction/verifier composition and protected adoption remain unfinished. Publisher staysin_progress/Codex/5points; no nativePOST/status/model/token/signing/registry/grant/protection/acceptance/caller-pin/merge/deployment/productrestart.

---