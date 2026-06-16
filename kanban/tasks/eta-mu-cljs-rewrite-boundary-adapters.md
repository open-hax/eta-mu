---
uuid: "eta-mu-cljs-rewrite-boundary-adapters"
title: "Eta-mu CLJS Rewrite — Core Runtime Boundary Adapters"
status: done
priority: P0
labels: ["tasks", "cljs", "rewrite", "extern", "5sp"]
created_at: "2026-05-29T21:18:48Z"
source: "kanban/epics/eta-mu-cljs-runtime-rewrite.md"
points: 5
category: tasks
---
# Eta-mu CLJS Rewrite — Core Runtime Boundary Adapters

> Parent epic: `kanban/epics/eta-mu-cljs-runtime-rewrite.md`
> Planning output: `docs/cljs-runtime-rewrite-boundary-adapter-plan.md`
> Points: 5

## Purpose

Create the named `extern.*` boundary layers needed by the **core eta-mu runtime facade** to touch the world without leaking raw JavaScript through `domain.*`, `shape.*`, or `law.*` namespaces. Additional adapters for agent/ai/github/tui/coding-agent packages are tracked in their own package-specific rewrite tasks.

## Scope

- Core runtime extern adapters:
  - `eta-mu.runtime.extern.js` — JS value conversion (`clj->js`, `js->clj` style helpers).
  - `eta-mu.runtime.extern.time` — timestamp/ISO-8601 helpers.
  - `eta-mu.runtime.extern.json` — JSON encode/decode.
  - `eta-mu.runtime.extern.http` — HTTP request/response encoding.
  - `eta-mu.runtime.extern.process` — process snapshot/env helpers.
- Boundary scanner script (`packages/runtime/scripts/check-cljs-boundaries.mjs`) that treats `extern.*` as the only raw-interop allow zone.
- `infra.boundary` inventory data documenting implemented and planned boundaries.

## Out of scope

- Node filesystem/path/process-exec, git, provider SDKs, Proxx, OpenCode/pi host, browser DOM, terminal TUI, media codecs, and package-manager adapters are covered by package-specific child tasks under `agent-cljs-rewrite`, `ai-cljs-rewrite`, `github-cljs-rewrite`, `tui-cljs-rewrite`, and `coding-agent-cljs-rewrite`.

## Work items

- [x] Define one named `extern.*` namespace per core runtime boundary.
- [x] Keep adapter public APIs CLJS-first: maps, vectors, scalars, or opaque handles.
- [x] Move `js->clj`, `clj->js`, `#js`, `aget`, `aset`, `Promise.all`, Node globals, and SDK-native object access into extern adapters only.
- [x] Add conversion tests for each adapter that is used by migrated runtime code.
- [x] Add a boundary inventory/check script similar to Knoxx's `boundary:check` pattern.

## Acceptance criteria

- [x] Boundary inventory runs and reports no disallowed raw JS interop outside `extern.*` namespaces.
- [x] Each migrated effectful runtime path has an adapter-level test.
- [x] Infra orchestration namespaces remain data-in/data-out and do not own domain policy.

## Verification

```bash
pnpm --dir packages/runtime cljs:boundary
pnpm --dir packages/runtime cljs:verify
pnpm --dir packages/runtime test
pnpm --dir packages/runtime typecheck
pnpm --dir packages/runtime build
pnpm test
```

## Notes

Implemented the core runtime boundary adapter slice in `packages/runtime` with named `extern.*` adapters for JS value conversion, time/timestamps, JSON, HTTP request encoding, and process snapshots. Added `infra.boundary` inventory data for implemented and planned boundaries, moved facade JS conversion/time defaults through extern adapters, and tightened the boundary scanner so raw interop is allowed only under `extern.*`.

**Independent review 2026-06-13 (Sonnet).** VERDICT: PARTIAL on the original 13-point scope, but the **delivered 5-point core slice is correct**. The remaining adapters (fs/path/exec, git, provider SDKs, OpenCode/pi, browser, terminal, media, package-manager) are intentionally split into package-specific child tasks rather than kept on one oversized card.

---

## Completion review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** Core runtime boundary adapter slice accepted and promoted to `done`.

**Delivered:**
- `packages/runtime/src/cljs/eta_mu/runtime/extern/js.cljs`
- `packages/runtime/src/cljs/eta_mu/runtime/extern/time.cljs`
- `packages/runtime/src/cljs/eta_mu/runtime/extern/json.cljs`
- `packages/runtime/src/cljs/eta_mu/runtime/extern/http.cljs`
- `packages/runtime/src/cljs/eta_mu/runtime/extern/process.cljs`
- `packages/runtime/scripts/check-cljs-boundaries.mjs`
- `packages/runtime/src/cljs/eta_mu/runtime/infra/boundary.cljs` (inventory)
- Corresponding tests under `packages/runtime/test/cljs/eta_mu/runtime/extern/`

**Verification:**
- `pnpm --dir packages/runtime cljs:boundary` passed (0 violations).
- `pnpm --dir packages/runtime cljs:verify` passed (116 tests, 528 assertions, 0 failures).
- `pnpm --dir packages/runtime test` passed.
- `pnpm --dir packages/runtime typecheck` passed.
- `pnpm --dir packages/runtime build` passed.
- `pnpm test` passed.

**Updated scheduling after core boundary adapters:**
- Core runtime boundary adapters → `done`.
- Package-specific extern adapter tasks are now unblocked and can move to `ready`:
  - `agent-cljs-rewrite-phase-2-extern-adapters`
  - `ai-cljs-rewrite-phase-3-extern-*`
  - `github-cljs-rewrite-extern-adapters` (also blocked by `fetch-timeout-abort-controller`)
  - `tui-cljs-rewrite-terminal-extern`
  - `coding-agent-cljs-rewrite-extern-fs-git-bash` and `coding-agent-cljs-rewrite-extern-clipboard-image-oauth`

**Recommended next action:** Pick the highest-priority unblocked extern adapter task and move it to `ready`. The most impactful are `ai-cljs-rewrite-phase-3-extern-openai` (P0) and `coding-agent-cljs-rewrite-extern-fs-git-bash` (P0).