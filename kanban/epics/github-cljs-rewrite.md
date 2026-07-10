---
uuid: "github-cljs-rewrite"
title: "GitHub Package CLJS Rewrite"
status: "in_progress"
priority: "P0"
labels: ["epics", "cljs", "rewrite", "legacy-ts", "github"]
created_at: "2026-06-15T00:00:00Z"
source: "user-request:2026-06-15"
points: 8
category: "epics"
---

# GitHub Package CLJS Rewrite

> Package: `packages/legacy/github` (`@open-hax/eta-mu-github`)
> Current size: ~2,076 TS lines across 17 files
> Scope: GitHub API client, PR automation, runtime batching, review gate, CLI

## Purpose

Rewrite the `@open-hax/eta-mu-github` package into ClojureScript while preserving its GitHub automation contracts and CLI surface. The package already has a fetch-timeout task in flight; this epic supersedes pure TS maintenance and aligns the package with the CLJS runtime boundary patterns.

## Public compatibility surfaces

- Package exports: `src/index.ts`
- GitHub client: `src/github.ts`
- CLI: `src/cli.ts`
- Runtime batching: `src/runtime-batch.ts`
- PR helpers: `src/ensure-pr.ts`, `src/autofix.ts`, `src/review-gate.ts`
- Event classifier: `src/event-classifier.ts`
- Pi agent integration: `src/pi-agent.ts`
- Tests: `tests/*.test.ts`

## Target namespace map

```text
eta_mu.github.domain.*    PR/issue decisions, review state machine
eta_mu.github.shape.*     GitHub API↔canonical transforms
eta_mu.github.law.*       Malli schemas for payloads and actions
eta_mu.github.extern.*    Octokit/fetch, auth, raw JS interop
eta_mu.github.infra.*     batch orchestration, event classification
eta_mu.github.cli.*       stable JS facade and CLI exports
```

## Non-goals

- Do not change the GitHub app or OAuth flow during this epic.
- Do not redesign review-gate policy.

## Phases

### Phase 1 — Inventory

- Catalog `src/` files and classify into domain/shape/law/infra/extern/cli.
- Identify public exports and consumers.

### Phase 2 — Boundary adapters

- Create `extern.*` namespaces for GitHub API, auth, and runtime batching.
- Add conversion regression tests.

### Phase 3 — Domain and infra

- Port PR/issue/review logic and event classification to CLJS.
- Wire to runtime CLJS state primitives.

### Phase 4 — CLI facade and parity

- Keep `src/cli.ts` and `src/index.ts` as thin TS compatibility shells.
- Run existing tests against CLJS-backed implementation.

### Phase 5 — Cutover

- Delete obsolete TS modules after parity tests pass.

## Acceptance criteria

- [ ] Inventory classifies every source file and public export.
- [ ] `extern.*` adapters exist with conversion tests.
- [ ] Core GitHub automation logic runs in CLJS.
- [ ] Existing test suite passes or explicit blockers are recorded.
- [ ] `pnpm --filter @open-hax/eta-mu-github test` passes.

## Verification gates

```bash
pnpm --filter @open-hax/eta-mu-github test
pnpm --filter @open-hax/eta-mu-github typecheck
node scripts/ts-line-count.mjs packages/legacy/github
pnpm --dir packages/eta-mu-runtime cljs:verify
```

## Dependencies

- `eta-mu-cljs-runtime-rewrite`
- `eta-mu-cljs-rewrite-boundary-adapters`
- `fetch-timeout-abort-controller` (merge first)

---
## Scheduling review (2026-06-15)

- 1 task ready for breakdown: `github-cljs-rewrite-inventory`.
- 8 tasks blocked: extern adapters await inventory + core `boundary-adapters` + `fetch-timeout-abort-controller`; domain/infra tasks await extern adapters; CLI/cutover await the full upstream chain.
- Current bottleneck: core `boundary-adapters` and `fetch-timeout-abort-controller` (per epic dependency, merge first).
- Concurrency: after extern adapters land, `domain-pr`, `review-gate`, `event-classifier`, `runtime-batch-adapter`, and `pi-agent` can proceed in parallel.
---

## Inventory review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `github-cljs-rewrite-inventory` accepted; inventory doc `docs/github-cljs-rewrite-inventory.md` produced.

**Key findings from the inventory:**
- `packages/legacy/github` is ~1,726 TS lines across 10 `src/` files and 5 test files.
- Public surface: re-exports from `autofix`, `config`, `event-classifier`, `runtime-batch`, `github`, `pi-agent`, `review-gate`, plus type re-exports.
- Raw JS interop is concentrated in:
  - `src/github.ts` → `eta_mu.github.extern.github-client` (Octokit REST/GraphQL)
  - `src/runtime-batch.ts` → control-plane `fetch`
  - `src/autofix.ts` → `node:fs/promises`, `node:os`, `node:path`, `node:child_process` (git subprocesses)
  - `src/cli.ts`, `src/config.ts`, `src/pi-agent.ts` → `process.env`, `process.argv`
- `src/pi-agent.ts` depends on `@open-hax/eta-mu-cli` (coding-agent) and is the strongest cross-epic coupling; it should be treated as an extern adapter.
- No cross-package consumers found; the package is consumed only by its own CLI and tests.
- `EtaMuActionBatch` shape should reuse the runtime schema rather than redefine it.

**Updated scheduling after inventory:**
- Inventory → `review` (done).
- `github-cljs-rewrite-extern-adapters` remains `blocked` until `fetch-timeout-abort-controller` merges and core `boundary-adapters` finishes.
- `github-cljs-rewrite-runtime-batch-adapter` can proceed once extern adapters land.

**Recommended next action:** Accept inventory; wait for `fetch-timeout-abort-controller` merge and core `boundary-adapters` completion, then move `github-cljs-rewrite-extern-adapters` to `ready` and begin `eta_mu.github.extern.github-client`.
