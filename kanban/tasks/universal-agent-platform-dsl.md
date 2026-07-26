---
uuid: "universal-agent-platform-dsl"
title: "Universal Agent Platform DSL — Boundary + OpenCode Target"
status: "in_progress"
priority: "P0"
labels: ["cljs", "opencode", "dsl", "boundary", "extensions"]
created_at: "2026-07-11T13:00:00Z"
category: "tasks"
write-id: "1785023952469-0.vztllw1p635oihiwuz"
---

# Universal Agent Platform DSL — Boundary + OpenCode Target

Build the ημ data-first agent platform DSL with strict JS boundaries and an OpenCode compiler target.

## Why

The current extension authoring surface (`eta-mu.core` / `eta-mu.macros.*`) leaks JS interop into extension handlers and does not separate capabilities from host targets. We want a new layer where:

- `domain.*`, `shape.*`, `law.*` never touch JS values or Promises.
- Only `ημ.platform.boundary.*` and `ημ.platform.runtime.*` may use `js->clj`, `clj->js`, `#js`, `aget`, npm imports, etc.
- A **capability** is the primitive; a tool, route, hook, and MCP method are projections.
- OpenCode plugin/tool modules are generated artifacts, not hand-written TS/JS.

## μ0 — Wire primitives

- `ημ.platform.boundary.js` with named decode/encode for keyword, UUID, instant, vector, set, map, optional keys, nil.
- Explicit wire policy table in `ημ.platform.law/wire-policy`.
- Round-trip tests.

## μ1 — Boundary law

- Mechanical clj-kondo rule forbidding raw JS interop outside `ημ.platform.boundary.*` and `ημ.platform.runtime.*`.
- Update shared kondo config.

## μ2 — Result algebra

- `ημ.platform.effect.result` with constructors `ok`, `rejected`, `failed`.
- All boundary handlers produce/validate result values before egress encoding.

## μ3 — Registry + macros

- `ημ.platform.dsl` macros: `defschema`, `defcapability`, `defhook`, `deftool`, `defplugin`, plus constructors `plugin`, `tool`, `hook`.
- `ημ.platform.registry` normalize/validate/link functions.
- Capability registry is an explicit map; no global macro side effects.

## μ4 — Effect interpreter

- Capability handlers return `:ημ/result :plan` effect descriptions.
- `ημ.platform.effect.interpreter` executes plans against an injected capability map.
- Test double capability map for deterministic tests.

## μ5 — OpenCode target

- `ημ.platform.target.opencode` compiles a linked registry to an OpenCode plugin hook map and tool exports.
- `ημ.platform.runtime.opencode` provides the thin export OpenCode invokes.
- One generated `.mjs` wrapper per target under `.opencode/plugins/`.

## ημ config

- Source config lives under `.ημ/config/opencode/` (root project), not under the generated `.opencode/` host directory.
- `.ημ/config/opencode/root.edn` composes fragments (`research.edn`, `policy.edn`, etc.) and selects a profile.
- Fragments reference capabilities by `:ημ/id`, not by host names.

## Acceptance

- `pnpm -C packages/extensions test` passes.
- `pnpm -C packages/extensions lint:kondo` zero warnings.
- At least one capability (`research/search`) compiles through the OpenCode target and can be unit-tested end-to-end.
- No JS interop in `law`, `domain`, `shape`, `application`, or `infra` namespaces (kondo-enforced).

## References

- `packages/extensions/lib/eta_mu/opencode.cljs` (existing runtime adapter, to be superseded by this layer)
- `packages/extensions/lib/eta_mu/core.cljc` (existing macro surface, to be superseded)
- `packages/extensions/manifest.edn` (extension manifest)
- `docs/design/user-clojurescript-extensions.md`

---
Starting implementation: μ0 wire primitives, μ2 result algebra, μ3 registry + macros. Existing extension macros (eta-mu.core / eta-mu.macros.*) remain untouched; new layer lives in eta-mu.platform.*.

Discovery: all 6 phases (μ0–μ5) are already implemented. μ5 OpenCode target at src/eta_mu/platform/target/opencode.cljs: compile-tool, compile-tools, compile-plugin, execute-tool! with boundary decode/validate/interpret/encode pipeline. Verification: 96 tests, 262 assertions, 0 failures, 0 errors, 0 compiler warnings. Acceptance criteria met. Card appears ready for review/done.

Runtime fix: build-tool in opencode.cljs now coerces extension result objects to strings via result->string. OpenCode tool.execute requires Promise<string> but extensions returned #js {:content #js [{:type text :text}]}. Added wrap-execute with try-catch. All 96 tests pass, rebuilt dist/opencode/ output.

### Open question — namespace-package direction

Some of this work happened in `~/spaces/muse`. The direction under consideration
is that `eta-mu` becomes primarily a namespace package: it may depend on
externally defined packages, but other packages should not depend on `eta-mu`.

This is **not a decided constraint** — it is an open question, recorded here so
the dependency direction gets settled before further platform work lands.

Status reconciled 2026-07-25 (PR #142 review closeout): the card read status: incoming while the body recorded all 6 phases (μ0–μ5) implemented and verified at 96 tests / 262 assertions, 0 failures. Moved incoming -> accepted -> breakdown -> ready -> todo -> in_progress to stop the record contradicting itself. Left at in_progress rather than review: the review gate runs a full monorepo pnpm build and did not converge in this session, and promoting an unrelated P0 card to review/done is the owner's call. The namespace-package note below is now recorded as an explicit open question rather than a tentative aside.

---