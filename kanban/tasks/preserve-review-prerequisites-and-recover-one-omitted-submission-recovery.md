---
category: "tasks"
labels: "workflow, review, recovery"
parent: "290f0cdf-9160-453e-a69c-67211432baa7"
type: "task"
write-id: "1788050377039-0.100q731urkn637jxqkv"
points: "3"
title: "Preserve review prerequisites and recover one omitted submission"
priority: "P0"
status: "review"
uuid: "bounded-review-submit-recovery"
created_at: "2026-08-29T23:39:44.478Z"
---

# Preserve review prerequisites and recover one omitted submission

## Outcome

Make the reusable OpenCode evidence-review workflow survive one bounded reviewer omission without losing revision-bound evidence, while remaining fail closed on malformed or repeatedly missing submissions.

## Scope

- Bind the review job's artifact downloads to the names emitted by its successful prerequisite jobs, so a failed-job rerun consumes the original attempt's deterministic evidence and compiled context instead of inventing current-attempt names.
- Preserve each model invocation's response and stderr separately.
- Detect a missing `submission.json` after the first completed model invocation and perform exactly one corrective review attempt with an explicit `review_submit` completion contract.
- Defensively validate the final submission before GitHub publication; malformed or repeatedly omitted submissions remain terminal failures.
- Do not fabricate review envelopes, weaken exact-head/clean-tree checks, or broaden GitHub App permissions.

## Acceptance criteria

- [ ] A first-pass valid submission publishes without a recovery invocation.
- [ ] One missing first-pass submission triggers exactly one logged corrective invocation and a valid recovery submission can proceed.
- [ ] Repeated omission and malformed submissions fail before publication.
- [ ] Attempt 1 and attempt 2 model responses and stderr are retained under distinct artifact paths.
- [ ] A job-scoped rerun downloads the artifact names emitted by its successful prerequisite jobs, preserving attempt-1 evidence instead of interpolating `github.run_attempt` again.
- [ ] Executable workflow tests cover first-pass success, recovered omission, repeated omission, malformed submission, bounded retry count, artifact retention, and prerequisite artifact-name reuse.
- [ ] Operator documentation explains in-job recovery versus GitHub failed-job rerun semantics.
- [ ] Exact-head automated review findings are resolved before merge.

## Revision-bound evidence

- Eta-mu issue #296 records Epiphany run `33264551140`: two completed reviewer attempts omitted `review_submit`, and both correctly failed closed.
- Proxx PR #358 run `33278721535` records attempt-1 evidence artifact `9722511755`; failed-job attempt 2 requested a nonexistent attempt-2 prerequisite artifact and never reached model execution.

## Non-goals

- No synthesized approval or finding text.
- No unbounded model retry.
- No interpretation of free-form model output as a review submission.

---
Intake plan 2026-08-29: issue #296 and Proxx run 33278721535 establish two independent red paths. First, a completed reviewer can omit review_submit; the workflow will retain attempt-specific output, classify the first submission before publication, and allow one corrective model invocation only for an absent file. Second, a GitHub failed-job rerun must consume immutable prerequisite artifact names emitted by the successful upstream jobs rather than recomputing names from the new run attempt. Tests will execute the extracted workflow scripts with valid, missing, malformed, recovered, and repeated-omission fixtures before hosted exact-head review.

Discovery anomaly 2026-08-29: pinned actionlint/ShellCheck on the touched workflow reproduced three warnings already present on base a6d39f48: one SC2129 in the default deterministic failure branch and two SC2094 false positives where SHA256SUMS was written inside the directory being scanned. The recovery shape remains valid. Under the repository zero-warning contract, the same branch now groups its four status writes and the checksum manifest is assembled in runner-temp then moved into the context; actionlint is clean without changing gate or archive semantics.

Implementation evidence 2026-08-29 on exact base a6d39f48: RED first failed at module load because the bounded recovery runner did not exist; after implementation, 32/32 executable workflow tests pass. They cover first-pass submission, missing-first recovery, repeated omission, malformed JSON, real child-process stdout/stderr retention, pre-publication schema validation structure, terminal truth, and job-output-bound prerequisite artifact reuse. actionlint 1.7.12 with ShellCheck 0.11.0 is clean; Biome checked 492 files; TypeScript typecheck passed; git diff --check passed. The full extensions build could not run locally because the restricted environment cannot resolve shadow-cljs 3.4.11 from Maven, so hosted sandbox/build authority remains required before merge.

Self-review correction 2026-08-30: published head b4bb49c was quarantined before merge because a reusable workflow checks out the caller repository, where eta-mu local path .github/scripts/run-opencode-review-recovery.mjs would not exist. The exact tracked runner bytes are now transported inside the checksummed review-context artifact and executed from .review-context/machinery. A new contract decodes the embedded payload byte-for-byte against the tracked source, and the real child-process CLI fixture executes that packaged copy. GREEN is now 33/33 tests; actionlint plus ShellCheck, Biome 492 files, and git diff check remain clean. A fresh exact-head review wave is required on the superseding commit.

Exact-head review correction 2026-08-30: CodeRabbit thread PRRT_kwDORu27H86ddrmy reproduced a real rejected-invocation durability gap on superseded head 559b62e: a rejected invokeAttempt skipped recovery.json, and spawn failure bypassed response/stderr stream finalization. The repair records one rejected attempt with null exit code, invocation state/error, retained file names, and observed submission state before rethrowing the original error; invokeOpenCode now finalizes and awaits both streams on success and failure. RED evidence was the pre-repair path plus the exact reviewer finding. GREEN is 35/35 executable workflow tests, including direct original-error identity/metadata assertions and a packaged-runner missing-binary child-process fixture that exits 1 without hanging, leaves both finalized attempt files, writes recovery.json, and never consumes attempt 2. The sibling delimiter thread PRRT_kwDORu27H86ddrm0 was verified non-applicable and resolved: both lines are canonical Rheos closing comment delimiters emitted as ---\\ncontent\\n--- by serialize-sections and locked by parser round-trip tests.

Final local review evidence 2026-08-30 before superseding PR head: incorporated the completed OpenCode note by adding a non-zero completed-invocation fixture; {exitCode:17} is durably recorded with completed state and both evidence files, fails with the exact code, and never consumes attempt 2. The executable workflow contract is 36/36. Pinned actionlint 1.7.12 plus ShellCheck 0.11.0 reports zero diagnostics; the repository Biome error-level gate checked 492 files with no fixes; both TypeScript targets pass through their pinned local compilers; current-source Rheos read-task returns this card in review; git diff --check passes. The aggregate pnpm wrapper cannot be treated as local authority in this environment because its supply-chain hook rejects ignored native dependency builds and extension validation observes unbuilt dist/pi outputs; the already-required hosted sandbox/build gate remains the terminal build authority. No merge is authorized until a fresh exact-head hosted wave and zero unresolved review threads.
---