# Full immutable pull-request input

License: GPL-3.0-or-later.

This isolated preparation starts at merged eta-mu339
`b18764d47c0b8da0b2d31f02d8bdd889323ee65c` and pairs with Muse18-based source
`19456bb4c5f4d5ce1ac52ca854221516302e0c2e`. Manual incoming card:
`256c5dd5-1a65-4ad0-8087-80b8f9a69c77`. No commit, push, native review request,
board transition or merge occurs in this slice.
Parent subsequently merged Muse18 at
`68d0e53d1369c1c0577fc3eacedb6a1b402b2f30`, whose tree matches 19456 exactly.
The paired Muse branch now uses that existing merge as its base without creating
a repair commit or rewriting history.
Parent subsequently committed the Muse19 input/transition corrections as
`7a8788d36d2aed3bf62e405f93d3c24d3fd410ea`. That immutable candidate was
selected in the initial `a791f29` publication. The subsequent
integrity correction below selects Muse `446b199`; hosted paired qualification
remains pending.

Staging formerly overwrote the complete diff when producing the 300 KB preview.
The repair writes exact Git merge-base/head bytes to `basehead.diff` first.
The `open-hax.review-input/v1` manifest records native base, computed merge
base, independently checked head, byte count, SHA-256 and observed repository,
PR, run/attempt and workflow metadata. The existing artifact transport includes
this input unchanged. Invalid bases or heads fail; empty input stays empty.

The observer contract explicitly allows and verifies Muse's two additional
review tools for full-input delivery and assessment. Actual assessment stays
in Muse's existing review session; no review engine is duplicated in eta-mu.

## Local verification

The three original new workflow regressions failed before the repair, exit 1:
full input was discarded, a mismatched head was accepted, and reader permission
was absent. The final full workflow suite passes **40/40**, including actual
Git staging of an input beyond 300 KB with a Git-quoted Unicode tail filename,
byte/hash equality, invalid revision rejection, empty input and a divergent
native base whose merge base is independently preserved.

The actual workflow observer build step also compiles against the paired Muse
source and verifies **22** exact permission/runtime entries, zero warnings.
Muse's compiled tools refuse missing tail and partial assessment, then accept
restored complete input. These are local fixtures, with no model invocation,
native review, publication, secret mutation or caller pin update.

Durable RED/GREEN logs and source-hash metadata are stored at
`/home/err/spaces/review-repair/.ημ/full-input-preparation-20261003/`.
The existing 257,362-byte receipt prefix has SHA-256
`e80e2fdd8e59ace719bbe8bb87a374067db3ba76b22fc0284dfc261d8472209a`.
Existing receipt and board-event history remains unchanged.

## Required release wiring

Caller functional pin `b5b28237c45323cdc1914317260192163d957735` remains
intentional historical provenance. This change introduces new functionality;
parent must qualify and select exact new workflow and Muse sources together.
The workflow-call default, compiler checkout fallback and context-provenance
fallback now all select corrected Muse19 commit
`446b1999816890a8f3c63f8d1db77c49182a9444`. The workflow tests require exact
agreement at all three sites while preserving an explicit `muse_revision`
override. Native paired qualification is pending. Publish the eta-mu PR before
Muse merges if needed:
this workflow runs directly on its own PR candidate and can compile the exact
unmerged Muse commit. Both candidates must qualify and merge before existing
automatic production callers select the new workflow. Do not qualify an
incompatible source pair or bypass completeness.

After the explicit preparation hold is released, parent owns ordinary source
commits, exact-head hosted review/CI, findings settlement and caller revision
selection. Current preparation does not claim any PR is merge-qualified.

## Muse19 paired finding checkpoint

CodeRabbit Muse19 comment `4175445594` identifies this staging/tool contract.
The corrected Muse session prevents an incomplete-input transition to
`:publish` and retains recovered tail findings. A local pair probe executes
this YAML's actual staging and observer-build scripts against that source,
then consumes the produced manifest through all 22 compiled tools. The native
candidate execution remains required against the now-selected corrected
immutable Muse commit. The finding can cite the resulting eta-mu commit and
native compile/manifest evidence without claiming production deployment.

Minimal cross-repository replay: run this repository's workflow tests, Muse's
`npm run test:review-input`, and the repair-evidence
`muse19-native-followup/joint-source-probe.mjs`. Supplying `MUSE_SOURCE_SHA`
also verifies a clean immutable Muse checkout and matching three workflow
selection sites. Local source tests alone grant no native approval.

## Immutable Muse candidate verification

The pin contract first failed against the old 05b default. With corrected
Muse `7a8788d36d2aed3bf62e405f93d3c24d3fd410ea` at all three sites, the full
workflow suite passes **40/40**, with zero failures or skips. The actual joint
probe, supplied that exact `MUSE_SOURCE_SHA`, verifies a clean committed Muse
checkout and all three selection sites before compiling the existing YAML's
observer profile. All **22** tools and permissions pass, with zero compiler
warnings. Its actual staging step produces **390,358** full-input bytes and
**204** reader pages; missing tail rejects, restored input retries, premature
publish refuses, and the recovered Git-quoted Unicode tail finding survives
through publisher validation.

This is local source-contract evidence. Native paired workflow execution,
actual current-head model review, all findings settlement and merge
qualification remain pending. Parent owns the ordinary eta-mu commit, push
and ready PR with auto-merge off. No existing caller source or pin is consumed
or updated by this preparation.

Proof and logs are under the repair evidence directory in
`muse19-native-followup/`: `eta-pinned-7a8788-green.log`,
`eta-immutable-selection-red.log`, `joint-immutable-7a8788-green.log` and
`eta-immutable-7a8788-prefix-proof.json`. Replacing only the three new Muse
selection strings with their old value reproduces the exact prior prepared
workflow hash, so existing staging/gates/credentials are retained. The b187
receipt prefix and the existing prepared receipts remain byte-for-byte
unchanged; tracked board state and the manual incoming card are unchanged.

## Independent input verification after untrusted gates

Eta340 CodeRabbit review `5403670832` at exact head
`a791f29aa53a46852ff2cf3f2a3d28b9f1022ad3` raised P1 `4175602381`:
pull-request gates run after staging and can replace both `basehead.diff` and
its matching manifest. A digest stored alongside untrusted bytes is not Git
authority. Regenerating only in that producer job would retain this boundary
problem.

The fresh review job now verifies downloaded input immediately after download,
before installing review tools, executing the publisher tests, invoking the
model or creating a publication token. It independently validates checkout
head against the native event, validates the native base, computes the Git
merge base, and generates `git diff --no-ext-diff --find-renames` into runner
temporary storage. Exact downloaded bytes, manifest schema/base/head/diff-base,
byte count/hash, preview and native repository/PR/run/attempt/workflow identity
must match this independent snapshot. A mismatch fails the job before review
or publication. A successful comparison writes `input-verification.json` for
the native attempt artifact; producer-supplied verification receipts are
removed first. Existing stream/recovery, clean/head, named-secret, bot and
terminal-gate guards remain in place.

The meaningful RED fixture runs the actual deterministic gate wrapper with a
successful malicious gate that empties both diffs and updates the manifest's
byte count/hash. Its deterministic summary reports success. The prior review
path accepts that artifact and reaches the synthetic model boundary. With
the independent verification step, the same fixture refuses it, writes no
successful verification receipt and never reaches that boundary. Exact large
Unicode-tail, empty and divergent-native-base inputs pass; altered metadata,
equal-length changed bytes and altered preview are rejected. The full workflow
suite is **44/44**, zero failures, cancellations or skips, on Node 22.
An isolated joint replay requires the clean committed Muse `446b199` and all
three matching selections, executes this workflow's actual observer compiler
and fresh-review comparison step, and passes **22** tools / **390,358** bytes /
**204** pages with zero compiler warnings. Forged matching input is rejected
before any tool, missing tail refuses begin, complete recovery passes, and a
recovered Unicode tail finding survives publisher validation. These fixtures
contain no model invocation or native approval.

Structural actionlint passes with its supported `-shellcheck= -pyflakes=`
flags. Direct ShellCheck, with the same actionlint sanitization and exclusions
and a child started before stdin is supplied, passes all **20** scripts with
zero findings. The initial actionlint external-command stdin stall and exit 2
remain separate historical evidence; no stalled invocation is relabeled a
pass. Logs, native artifacts, immutable RED source and the joint replay are in
the repair evidence directory's `eta340-native-37166085319/` checkpoint.

The initial native run `37166085319` compiled **22** tools from Muse `7a8788d`
with zero warnings (job `111329136270`, context artifact `11289348404`). Its
deterministic artifact `11289329684` contains all seven changed files,
**39,176** bytes, SHA-256
`231d78f3f3567e40a88312497bdd2240b4f7ec50571d2fb25d7e92fc5c5dc172`,
matching immutable Git bytes exactly; all deterministic statuses were zero.
That historical successful artifact does not disprove the replacement risk
or qualify the corrected source. The model was still running at observation.

All three Muse selections and the fixture expectations now select immutable
`446b1999816890a8f3c63f8d1db77c49182a9444`, supplied by parent after its
64-character manifest-ID repair. Earlier Muse MiMo review `5403657875` at
`7a8788d` is stale for that changed head. Local verification supplies no native
approval. Parent must publish the new Eta candidate, obtain actual clean-job
input proof plus current-head model scope and required CI, settle findings,
and qualify both repositories before caller activation. Existing callers
remain on the historical `b5b28237` pair; this worker performs no commit,
push, GitHub write, settlement, merge or deployment.
