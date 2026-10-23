# Antigravity advisory reviewer

This is a separate Antigravity CLI producer using exactly
`gemini-3.8-flash-high`. It retains local evidence; it never publishes GitHub
reviews, signs attestations, or supplies native approval or deployment credit.
The evidence-first method follows the existing OpenCode reviewer, but its native
invocation proof is not reused or synthesized.

Local native probes established the strict Bubblewrap settings overlay and
actual denied read, write and command attempts. Native stdin probes returned
real schema-bound `structured_output`, including the complete 290,035-byte shx
PR4 prompt in 158 seconds. These are local CLI observations; hosted runner
isolation, registration and rollout still require
their separate qualification. A passing fixture is not hosted activation.

Earlier probes exposed two traps. Custom-agent `tools: []` and an explicit
observer list still advertised the full static tool catalog; they do not
establish confinement. `--mode plan` had no effect with slash expansion disabled.
Early streaming probes and richer provider schemas also produced `SUCCESS`
without `structured_output`, including partial timeout results. With the pure
finish tool and stdin held open through the terminal result, native streaming
returns the actual structure. A 201,017-byte padding probe timed out after 120
seconds; its zero-token partial result remains a refusal. The representative
shx review completed within the default 600-second budget. The runner uses an
independently enforced strict settings overlay and a simple provider schema.
It never derives a structured result from response prose. Pure laws enforce
constants and bounds omitted from that schema.

The trusted custom agent permits only `finish`, the CLI's pure terminal
formatting tool. With no finish capability the pinned CLI returned repeated
valid response JSON without native structured output; allowing finish produced
an actual native structured defect finding. It may append `toolAction` and
`toolSummary` transport strings despite the echoed result schema. A portable
shape accepts either exactly the eleven semantic fields or those eleven plus
both nonempty metadata strings bounded to 4,096 characters each. It retains
the metadata separately and applies the unchanged semantic law to the review.
Unknown keys, partial metadata and invalid metadata refuse; there is no generic
unknown-field stripping. The original native envelope remains intact.

Historical diagnostic probes are consolidated without losing bytes in
[diagnostic-probes.json](../../.ημ/antigravity-review/diagnostic-probes.json).
Its repository-relative `files` map records each original path, SHA-256, mode,
and `exact_utf8_content`. Re-encoding that string as UTF-8 reconstructs the exact
original file bytes. The 57 tracked entries were verified against source commit
`3bcf27bef296f9349fdf4997df256a617da5f120`; four ignored local stderr captures
are explicitly marked `source_commit_tracked: false`. The original paths remain
available in that commit. Failed probes retain their actual outcomes and supply
no qualification or approval credit. Successful `actual-defect-end-to-end` and
`actual-clean-end-to-end` evidence and `qualification.json` remain separate and
unchanged.

Prepare an input proposal without authentication or model invocation:

```bash
nbb -cp .github/antigravity .github/antigravity/review.cljs \
  --repo /absolute/repository --base FULL_BASE_SHA --head FULL_HEAD_SHA \
  --output /existing/parent/new-review-directory --prepare-only
```

The eventual qualified worker command additionally requires:

```bash
nbb -cp /trusted/eta-mu/.github/antigravity \
  /trusted/eta-mu/.github/antigravity/review.cljs \
  --repo /absolute/repository --base FULL_BASE_SHA --head FULL_HEAD_SHA \
  --output /existing/parent/new-review-directory \
  --worker-home /explicitly-authorized/authenticated-home \
  --cli /immutable/absolute/agy --cli-sha256 LOWERCASE_SHA256 \
  --bwrap /usr/bin/bwrap --bwrap-sha256 LOWERCASE_SHA256 \
  --timeout-seconds 600
```

Run NBB from the trusted runtime directory so a candidate `nbb.edn` cannot affect
startup. The output leaf must not exist and its real parent must exist outside
the candidate repository. Worker provisioning, an executable immutable CLI,
authentication, and runner isolation belong to the operator. Authentication is
never copied or changed. CLI version is pinned to **1.4.6** and its supplied
SHA-256 is checked before the version probe and after inference. The initial
inventory reported 1.1.23; a subsequent direct version probe reported 1.4.6.
That observed drift is retained rather than accepting arbitrary versions.

The complete zero-context diff and the complete base/head regular UTF-8 blobs
are serialized as data, including candidate configuration files. Candidate
files, scripts, hooks, package managers, dependency installs and configuration
are never loaded or executed. Git pathspecs are literal; symlinks, submodules,
binary/NUL bytes, invalid UTF-8, control-character paths and unsupported changes
fail visibly. Renames are represented as deletion/addition. A sparse checkout
with available Git objects is sufficient. `--base` supplies the immutable PR
target tip; `--head` supplies the immutable candidate tip. Preparation requires
exactly one `git merge-base --all` result. Missing or multiple merge bases refuse
before input preparation or inference. That common ancestor is the canonical
`base` in the input, native result binding and review artifact, and selects every
base blob and diff. The supplied target tip remains separately as `base_tip` in
the complete input, manifest and invocation provenance. Target-only changes are
excluded from the PR snapshot. Branch names and working-tree contents are not
reviewed.

Per-path and aggregate patches use the same forced-text, full-index Git format.
Text admission still rejects binary/NUL and invalid UTF-8 blobs; attributes such
as `-diff` cannot hide admitted text changes or their added-line coordinates.
Full object IDs keep the patch digest independent of `core.abbrev`. Patch
generation also fixes Myers diffing, disabled indent heuristics, zero context
and inter-hunk context, `a/` and `b/` prefixes, root-relative paths, pathname
quoting and default path ordering; local settings for those choices cannot
change the digest. External diff drivers and text conversion remain disabled.
These options bound the supported format rather than claiming every Git version
or custom function-header attribute produces identical bytes.

The limits are 256 changed files, 1,048,576 bytes for each base/head blob,
1,048,576 diff bytes, 4,194,304 serialized input bytes, 4,718,592 complete prompt
bytes, 8,388,608 serialized stdin bytes and 2,097,152 combined native stdout/stderr
bytes. Sizes are UTF-8 bytes, including the exact schema and instructions. One
compact NDJSON user record carries the entire prompt on stdin; the prompt never
enters argv. Stdin stays open until a complete native result record arrives.
There is no truncation into a passing review. The default native timeout is 600
seconds and the maximum is 1,800 seconds; the process supervisor allows another
10 seconds to retain terminal diagnostics before killing the process group.
The configured bounds are admission ceilings, not a latency guarantee for every
input within them. Larger changes must be split or use another qualified route.

`input.json` records sorted paths, the canonical base, supplied `base_tip` and
exact head, per-blob IDs/byte counts/
SHA-256, file count, full-input and diff byte counts/digests, and limits.
Prompt and serialized-stdin byte counts/digests also bind the exact transport.
`input.txt` retains the complete supplied data. The isolated model workspace
contains only that data and the trusted agent. Real model runs remove this
workspace in `finally`; prepare-only deliberately retains it for inspection.
Evidence artifacts remain until the caller archives or removes them. The
workflow owns removal of its entire per-job temporary tree on every exit.

The child environment permits only PATH, optional SSL certificate locations,
the explicitly supplied HOME/XDG paths, fixed locale/timezone and CI mode. It
does not inherit GitHub, cloud, model API, npm or signing tokens, shell startup
options, or GitHub command-file paths. HOME may contain the explicitly
authorized login. Bubblewrap 0.9.0 is pinned by an operator-supplied checksum.
The root filesystem is read-only; only the existing CLI state directory and
isolated data workspace are writable. The existing settings file is overlaid
read-only with the trusted strict policy, so global settings are never edited.
The CLI-state directory and its settings file must already exist. The strict
profile denies command, file-read, file-write, URL and MCP operations, requires
permission for every tool, permits no nonworkspace access and disables paid
G1 credits. Candidate data cannot change the mounted policy.

The Node process adapter owns a Linux child process group, bounded captures,
deadline and SIGINT/SIGTERM/SIGHUP cleanup. It kills remaining descendants on
ordinary exit and notices a terminated NBB parent. Cancellation aborts pending
stdin collection and prevents any later native process launch. Non-Linux
execution refuses.
Native failures preserve raw captures and process metadata, without `review.json`.
Only a native successful structured result passing the exact input/model/scope
and added-line laws writes `review.json`. Findings require confidence at least
0.85, evidence and a failure trace; questions remain nonblocking. No model output
can turn incomplete scope into a pass.

`review.json` carries versioned schema, exact base/head, complete `diff_digest`,
configured model and status `clean` for empty findings or `findings` otherwise.
The retained `native.stdout.json` contains the complete raw NDJSON event stream
(the filename is retained for artifact compatibility). `native-envelope.json`
contains its real terminal result. Admission requires one init first, one result
last, one matching conversation, exact native model/agent/cwd/schema and strict
permission mode. Only the observed user_input, agent_response and pure finish
progress shapes are admitted; unknown events, tool payloads, subagent payloads
and missing completion refuse. The init tool list is the pinned static catalog
and supplies no permission evidence. Invocation metadata reports the verified
binary/version, strict profile digest and native stream binding. Confinement
still rests on the separately qualified settings/sandbox boundary.

The pure contracts live in `antigravity/law/review.cljc`; added-line shape parsing
and the native stream/finish transport shapes are portable `.cljc`. Node
filesystem/process operations stay in `extern/host.cljs` and the small raw
`run-cli.mjs` process boundary. NBB orchestration lives in
`infra/review.cljs`. The Node adapter uses native async I/O because the installed
NBB runtime does not support compiled ClojureScript `await` syntax.

Verification uses inert fake CLI processes and real temporary Git repositories:

```bash
nbb -cp .github/antigravity .github/antigravity/review_test.cljs
node --test .github/antigravity/runner.test.mjs
clj-kondo --lint .github/antigravity
```

Official interfaces: [headless CLI](https://antigravity.google/docs/headless),
[subagents](https://antigravity.google/docs/subagents). Native traces remain
the authority for whether the installed build honors these interfaces.
