---
category: "tasks"
labels: "tasks, quality, lint, ci, 1sp"
dependency: []
type: "task"
write-id: "1792162077100-0.jaxukvi0ciok7yw3wc"
points: "1"
title: "Run root Biome lint through the existing pnpm tool boundary"
priority: "P1"
status: "in_progress"
uuid: "21f1e33e-f08f-437e-8872-828a955e2caa"
created_at: "2026-10-15T20:17:48.456Z"
---

# Run root Biome lint through the existing pnpm tool boundary

## Context

The registered root `pnpm lint` runs `bb scripts/lint.bb`, including the ClojureScript checks and then the established `scripts/lint.mjs` static-check adapter. Its two Biome command strings invoke npm's `npx` inside the pnpm script environment, although the root already declares and installs `@biomejs/biome` 2.3.5. Actual hosted lint exited 0 while emitting five npm configuration warnings. ETA's zero-warning contract still fails; a successful process or model review does not waive it.

This is a standalone one-point follow-up to the completed five-point [Lint and Static Gates owner](eta-mu-quality-ratchet-lint-gates.md), UUID `eta-mu-quality-ratchet-lint-gates`, whose recorded scaffold explicitly owns `scripts/lint.mjs`. Preserve that completed card and its historical 26-point quality-ratchet epic. This new slice adds one explicit point; it creates no formal parent or dependency and does not expand the MiMo review-agent owner.

## Outcome

The existing registered root lint uses pnpm to execute its existing local Biome tool, completes with zero warnings in the original warning-producing toolchain/configuration, and still fails visibly when Biome reports an error.

## Scope

Implementation is limited to these two strings in `scripts/lint.mjs`:

```diff
-  ? "npx biome check --write --diagnostic-level=error ."
-  : "npx biome check --diagnostic-level=error .";
+  ? "pnpm exec biome check --write --diagnostic-level=error ."
+  : "pnpm exec biome check --diagnostic-level=error .";
```

Preserve the Biome arguments and target, normal/fix selection, root cwd, inherited environment/stdio, actual `run` catch/status handling, aggregate exit status and every other command. Bind the existing declared and resolved Biome version/executable without downloading a replacement. Required tracked planning/events/provenance are separate from the two-string implementation scope.

## Non-goals

Do not change `.npmrc`, package manifests, package-manager policy, lockfiles, workflow/runner/model routes, existing diagnostic-level flags, warning thresholds, legacy build/package scripts or install behavior. Do not select npm10, isolate npm user configuration, filter logs or suppress warnings to manufacture GREEN. Install's missing-bin/canvas notices and legacy build warnings remain separate existing work. Do not run root `lint:fix`, add an implementation-mirroring test framework, reopen completed owners or claim application deployment/readiness.

## Acceptance criteria

- The only product-source delta is the two command strings above; all specified execution and error behavior remains byte-identical.
- The actual registered `pnpm lint` succeeds with complete zero-warning output under the same original Node/npm11/pnpm environment and configuration that exposed the npm warnings. Every registered ClojureScript and static check still runs. A missing tool or an unrelated warning is a visible blocker, not a pass or permission to broaden this repair.
- A controlled real Biome error reaches the unchanged adapter and produces its failed Biome result and aggregate exit 1. The fixture and any owned cache/process state are removed by identity after native completion; normal source is restored before the full GREEN gate.
- Full before/after source, tool identity, raw output, exit, truncation and owned cleanup evidence is retained. No old-head review or successful process is promoted into a zero-warning result.

## Verification

1. Retain the genuine existing contract RED: hosted run [38787429185](https://github.com/riatzukiza/eta-mu/actions/runs/38787429185), producer artifact 11999266775, contains five literal npm lint warnings despite lint exit 0. The prior local registered Node24 lint capture contains those five plus a user `always-auth` warning. These are warning-contract failures, not manufactured failed assertions. The root warning inventory is SHA256 `649bfca7a997c0bab43f50402a0c6795ac21efdb012e3a2eec14ff855992ebe1`; the original local lint log is SHA256 `ba7fa7e7a19a239ea7d81cf99a569fe5aeed95bea8faac5dd762e0c138d958be`.
2. At admitted implementation time, freeze the actual original Node/npm/pnpm and existing Biome identities/configuration and confirm the unchanged source. Use the existing locked toolchain only; do not install or introduce an environment-only workaround. Apply the exact two-string patch in the isolated implementation worktree.
3. For error propagation, create one exclusively owned temporary root JavaScript fixture that the actual Biome configuration includes, containing a deliberate syntax error. Run the actual `node scripts/lint.mjs` normal branch under a finite native supervisor, require a genuine Biome error, its actual adapter failure summary and aggregate exit 1, and retain every other check's actual outcome. Remove only the owned fixture in cleanup after its process is terminal. Do not claim a missing tool or unrelated failure proves this control. Freeze the concrete fixture path/bytes and cleanup guard before this later execution.
4. With the fixture absent and source/tool/configuration custody preserved, run the full registered `pnpm lint` once under that same original environment. Require native exit 0 and zero warnings in complete stdout/stderr; preserve any failure literally. `node --check scripts/lint.mjs` and `git diff --check` also pass. The fix branch retains its literal `--write` flag in the reviewed source; it is not executed over the repository.
5. Planning review/qualification precedes implementation admission. Code review and any fresh hosted source/input qualification follow the new implementation head separately; these existing RED records provide no new approval or deployment credit.

## Risks and boundaries

One point covers the complete bounded slice: freezing the existing Node/npm/pnpm/Biome identities and configuration; changing the two command strings; one controlled real Biome failure with its failed summary and aggregate exit 1; owned fixture cleanup; one complete registered `pnpm lint` with zero warnings; syntax/diff checks; and complete raw result, source and cleanup evidence. Qualification and evidence collection are included in this estimate, using the existing toolchain, lint adapter, registered commands and finite capture mechanism without a new test framework or configuration policy.

The one-point estimate assumes the existing tools and commands are available and the repair remains within those boundaries. If tooling is absent, another check fails, or additional source/configuration changes become necessary, retain the failure and re-estimate or split that newly discovered work before broadening the slice. The existing `--diagnostic-level=error` flag remains unchanged; complete output still must be inspected for warnings.