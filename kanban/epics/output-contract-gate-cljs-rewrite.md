---
uuid: "output-contract-gate-cljs-rewrite"
title: "Output Contract Gate CLJS Rewrite"
status: "rejected"
priority: "P1"
labels: ["epics", "cljs", "rewrite", "legacy-ts", "output-contract-gate"]
created_at: "2026-06-15T00:00:00Z"
source: "user-request:2026-06-15"
points: 8
category: "epics"
---

# Output Contract Gate CLJS Rewrite

> Package: `packages/legacy/output-contract-gate` (`@open-hax/output-contract-gate`)
> Current size: ~2,788 TS lines across 16 files
> Scope: review gate, validation, repair, EDN handling, artifacts, markdown, CLI

## Purpose

Rewrite the `@open-hax/output-contract-gate` package into ClojureScript. This package is a natural CLJS fit because it already reasons about EDN, contracts, and admissibility; the rewrite should make it a showcase for `law.*` namespaces and Malli-guarded output contracts.

## Public compatibility surfaces

- Package exports: `src/index.ts`
- CLI: `src/cli.ts`
- Review: `src/review.ts`
- Validate: `src/validate.ts`
- Repair: `src/repair.ts`
- Generate: `src/generate.ts`
- EDN helpers: `src/edn.ts`
- Artifacts: `src/artifacts.ts`
- Fixtures: `src/fixtures.ts`
- Markdown: `src/markdown.ts`
- Tests: `src/*.test.ts`

## Target namespace map

```text
eta_mu.gate.domain.*     contract admissibility decisions, repair logic
eta_mu.gate.shape.*      EDN/markdown/artifact transforms
eta_mu.gate.law.*        Malli schemas for contract gates and invariants
eta_mu.gate.extern.*     raw JS interop for EDN parser, file system
eta_mu.gate.infra.*      gate orchestration, artifact handling
eta_mu.gate.cli.*        stable JS facade and CLI exports
```

## Non-goals

- Do not relax existing contract semantics.
- Do not remove EDN support.

## Phases

### Phase 1 — Inventory

- Catalog `src/` files and classify into domain/shape/law/infra/extern/cli.
- Document contract rules currently enforced.

### Phase 2 — Law and domain

- Port contract schemas to Malli in `law.*`.
- Port review/validate/repair/generate logic to CLJS.

### Phase 3 — Extern and infra

- Create `extern.*` for EDN parser, FS, and artifact I/O.
- Add conversion tests.

### Phase 4 — CLI facade and parity

- Keep `src/cli.ts` as a thin TS compatibility shell.
- Run all tests against CLJS-backed implementation.

### Phase 5 — Cutover

- Delete obsolete TS modules after parity tests pass.

## Acceptance criteria

- [ ] Inventory classifies every source file and public export.
- [ ] Contract schemas ported to Malli.
- [ ] `extern.*` adapters exist with conversion tests.
- [ ] Existing test suite passes or explicit blockers are recorded.
- [ ] `pnpm --filter @open-hax/output-contract-gate test` passes.

## Verification gates

```bash
pnpm --filter @open-hax/output-contract-gate test
pnpm --filter @open-hax/output-contract-gate typecheck
node scripts/ts-line-count.mjs packages/legacy/output-contract-gate
pnpm --dir packages/eta-mu-runtime cljs:verify
```

## Dependencies

- `eta-mu-cljs-runtime-rewrite`
- `eta-mu-cljs-rewrite-boundary-adapters`

---
## Scheduling review (2026-06-15)

- 1 task ready for breakdown: `output-contract-gate-cljs-rewrite-inventory`.
- 10 tasks blocked: law schemas and domain core await inventory; extern adapters await inventory + core `boundary-adapters`; review/generation/artifacts/tests/cli-facade/parity/cutover each await preceding implementation tasks.
- Current bottleneck: core program `eta-mu-cljs-rewrite-boundary-adapters` (in_progress) and inventory acceptance.
- Concurrency: law-schemas and domain-core can proceed together once inventory is done; review/generation/artifact-infra can then run in parallel.
---

## Inventory review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `output-contract-gate-cljs-rewrite-inventory` accepted; inventory doc `docs/output-contract-gate-cljs-rewrite-inventory.md` produced.

**Key findings from the inventory:**
- `packages/legacy/output-contract-gate` is 16 files (~2,788 TS lines), but most of the TS bulk is `cli.ts` (619 lines) and tests.
- Clean taxonomy fit:
  - `law` → `src/types.ts` (Malli schemas)
  - `shape` → `src/edn.ts` (compiler), `src/markdown.ts`, `src/fixtures.ts`
  - `extern` → EDN parser (`edn-data`), markdown AST (`unified`/`remark`), FS, crypto, HTTP fetch
  - `domain` → `validate.ts`, `repair.ts`, `review.ts`
  - `infra` → `generate.ts`, `artifacts.ts`
  - `cli` → `src/cli.ts`, `src/index.ts`
- `src/jsedn.d.ts` is dead code; delete during cutover.
- Contract rules are well-documented: EDN grammar, section structure, count rules, repair rules, review scoring, artifact layout, CLI exit codes.
- `packages/extensions` declares a workspace dep but does not currently import exported names; the CLJS extension can become a direct consumer after porting.
- No hard dependency on runtime core or boundary adapters; HTTP fetch can optionally reuse the core boundary adapter later.

**Updated scheduling after inventory:**
- Inventory → `review` (done).
- `output-contract-gate-cljs-rewrite-law-schemas` and `output-contract-gate-cljs-rewrite-domain-core` can move to `ready` immediately because they depend only on the inventory.
- `output-contract-gate-cljs-rewrite-extern-adapters` remains `blocked` until core `boundary-adapters` finishes (or can proceed with package-local externs if the boundary adapter is not strictly needed).

**Recommended next action:** Accept inventory and move `output-contract-gate-cljs-rewrite-law-schemas` to `ready`; port `src/types.ts` to `eta_mu.gate.law.contract` Malli schemas.

---
## Law + domain review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `output-contract-gate-cljs-rewrite-law-schemas` and `output-contract-gate-cljs-rewrite-domain-core` accepted and promoted to `done`.

**Delivered:**
- `packages/runtime/src/cljs/eta_mu/gate/law/contract.cljs` — Malli schemas for all contract types.
- `packages/runtime/src/cljs/eta_mu/gate/domain/validate.cljs` — structural validation logic.
- `packages/runtime/src/cljs/eta_mu/gate/domain/repair.cljs` — repair-prompt compilation.
- `packages/runtime/src/cljs/eta_mu/gate/domain/review.cljs` — stub review and message builders (no fetch).
- `packages/runtime/src/cljs/eta_mu/gate/shape/markdown.cljs` — pure markdown section extractor.
- `packages/runtime/src/cljs/eta_mu/gate/shape/fixtures.cljs` — compiled five-section fixture.
- `packages/runtime/src/cljs/eta_mu/gate/extern/js.cljs` — isolated JS interop helpers.
- Tests covering validate, repair, stub review, and fixtures.

**Verification:**
- `pnpm --dir packages/runtime cljs:verify` passed.
- `pnpm test` passed.
- 87 CLJS tests, 375 assertions, 0 failures.

**Updated scheduling after law/domain:**
- Law schemas → `done`.
- Domain core → `done`.
- `output-contract-gate-cljs-rewrite-extern-adapters` is now unblocked by inventory/law/domain but remains blocked by core `eta-mu-cljs-rewrite-boundary-adapters`.
- `output-contract-gate-cljs-rewrite-generation`, `output-contract-gate-cljs-rewrite-review`, and `output-contract-gate-cljs-rewrite-infra-artifacts` are blocked until extern adapters land.

**Recommended next action:** Drive core `eta-mu-cljs-rewrite-boundary-adapters` to completion, then move `output-contract-gate-cljs-rewrite-extern-adapters` to `ready`.
---
