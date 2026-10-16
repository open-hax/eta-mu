---
uuid: "a343a87e-a96f-4df8-bffd-5c3ef331ad26"
title: "Supply locked source-map support for compiled Node test bundles"
priority: "P1"
points: "1"
labels: tasks, quality, testing, dependencies, 1sp
parent: "eta-mu-quality-ratchet-test-suite-hardening"
type: task
---

# Supply locked source-map support for compiled Node test bundles

## Context

The complete registered root test ran all 15 suites successfully on the local combined source `2a9c599d250df1acc6d95e8f594516a341c9fb69` on 2026-10-16. All 17 compiler completions reported zero warnings, but six generated Node test entrypoints emitted `no "source-map-support" (run "npm install source-map-support --save-dev" to get it)`. Those six actual notices are a separate failed zero-advisory quality obligation; successful tests do not erase them.

The notices come from the compiled Node bootstrap in eta-mu, Rheos, terminal-ui, turn-processor, chat-ui and Axxium, not NBB or the assessment driver. Pinned Shadow CLJS 3.4.11 `shadow/build/node.clj:155–160` emits `require('source-map-support').install()` when source maps are enabled and warns when that require fails. Actual metadata-only resolution from each of the six generated files returns `MODULE_NOT_FOUND`.

The workspace already declares and locks `source-map-support` 0.5.21 in other development importers. The root and six emitting packages do not declare it. A fully owned pnpm isolated installation therefore does not expose it to the ancestor-root lookup used by those compiled test entrypoints. The protected main `4eaa34d18b5e07d9f26f0ebe4d20cf7e65ef9a41` has the same relevant root manifest, lockfile, board configuration and parent card as the observed combined source; this local observation supplies no protected-head CI, review or deployment approval.

## Outcome

The existing compiled Node test bootstrap resolves the already locked diagnostic helper through an explicit root development dependency. The complete registered test retains every behavior check and emits none of the six missing-support notices, with zero compiler warnings.

## Scope

- Add exact `"source-map-support": "0.5.21"` to root `package.json` devDependencies.
- Add only its matching exact root devDependency importer entry to `pnpm-lock.yaml`, retaining all 27 existing importers, all existing specifiers and every package/snapshot version and integrity.
- Use official pinned pnpm 10.14.0 to validate the proposed lock under frozen/offline/lockfile-only operation, then use a normal frozen installation in the explicitly owned implementation runtime after planning readiness.
- Qualify real module resolution from all six generated entrypoint locations and the unchanged registered lint/test/build gates. Preserve complete native outputs, exits, source bindings and owned cleanup. Required planning and append-only provenance are separate from the two product paths.

## Non-goals

Do not edit compiler-generated bootstraps, disable source maps, change diagnostic text or compiler options, add NODE_PATH/module aliases, filter warnings, use permissive flags, rewrite per-package policy, change package-manager versions, update other dependency versions or introduce a new test framework. Do not broaden ETA24's two-prefix lint card or the MiMo review-host owner. Preserve the original installation's twelve missing-bin notices and canvas deprecation warning as separate historical failures. No model, browser, database, deployment, credential, workflow or review-provider change belongs to this slice.

## Acceptance criteria

- The product diff contains exactly the two paths above and four added dependency/importer lines. All 26 non-root importers and every prior binding in the root importer remain unchanged; existing package/snapshot objects, versions and integrity values are identical.
- The exact new dependency resolves to the owned locked 0.5.21 implementation from each of the six original generated Node entrypoint paths, without alternate module lookup or global installation.
- One complete registered `pnpm test` on the new implementation source retains all 15 suites, the original six assessment suites and all declared host checks. It passes with zero failures/errors, zero compiler warnings and no missing-support advisory. Native process exit alone is insufficient; inspect actual host counters and import diagnostics, including Sol.
- Owning registered `pnpm lint` and the full registered `pnpm build` pass with zero warnings on the qualified implementation source. Any unrelated pre-existing failure remains explicit and blocks completion; it does not authorize broadening this repair.
- Build's live public-catalog generation, if reached, retains the original and actual generated source bytes and exact diff before guard assertions. A changed tracked output is not silently restored, staged or described as unchanged-source GREEN.
- Source, canonical configuration, original dependency targets and held leases remain protected. Only owned runtime/cache/process cleanup is performed and recorded. No stale review or local successful test supplies planning readiness or publication approval.

## Verification

1. Retain the real six-line diagnostic baseline, its six `MODULE_NOT_FOUND` resolution observations, complete test output SHA256 `1adb949a20dd00ded43b2d05ec620aa72eef21a1c48d0fd80fb684cb8fbc9b81`, native 0/0 and clean process cleanup. No fabricated failed assertions or extra full-test replay is needed to establish this dependency-availability RED.
2. After canonical planning review and lawful Rheos readiness, apply the reviewed two-path diff in an owned checkout/runtime. Preserve the 27 manifest/lock correspondence, existing lock versions and declared pnpm policy. Validate the lock through official pnpm and install with the frozen lockfile; do not manually wire dependency aliases.
3. Run the six source-bound resolution controls and then the complete registered test once. Retain full semantic counters and diagnostic rows, including any new failure.
4. Run the owning registered lint and build once with the reviewed finite runtime, public-network and generated-output boundary. Save every raw result before asserting it; retain all failures without automatic retries.
5. Review the exact new source and append-only evidence through the canonical code-review/merge route. Change card lifecycle only through Rheos.

## Risks

One point covers the two additive dependency declarations, the already available locked package, existing tooling and finite evidence collection. It assumes the repair remains confined to these paths and the existing registered gates. A new dependency/version, policy change, missing prerequisite or unrelated source repair requires explicit scope review rather than silently expanding this estimate. Test Suite Hardening is currently icebox; this proposal creates no readiness or parent-status claim. The existing install and legacy build warning obligations remain visible until independently corrected.
