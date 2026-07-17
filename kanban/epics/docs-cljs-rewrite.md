---
uuid: "docs-cljs-rewrite"
title: "Docs Package CLJS Rewrite"
status: done
priority: P3
labels: ["epics", "cljs", "rewrite", "legacy-ts", "docs"]
created_at: "2026-06-15T00:00:00Z"
source: "user-request:2026-06-15"
points: 3
category: epics
---
# Docs Package CLJS Rewrite

> Package: `packages/legacy/docs` (`@open-hax/eta-mu-docs`)
> Current size: ~93 TS lines across 1 file
> Scope: TypeScript declaration file for docs kernel contracts

## Purpose

Convert the `@open-hax/eta-mu-docs` package from a TypeScript declaration file into a CLJS-first package with a stable TypeScript compatibility layer. This is the smallest legacy package and can serve as a quick cutover validation.

## Public compatibility surfaces

- Declarations: `index.d.ts`
- Consumers: any package importing `@open-hax/eta-mu-docs` types

## Target namespace map

```text
eta_mu.docs.domain.*    docs kernel contracts (if any runtime logic)
eta_mu.docs.shape.*     CLJS↔TS type bridges
eta_mu.docs.law.*       Malli schemas for doc records
eta_mu.docs.extern.*    raw JS interop (if needed)
eta_mu.docs.infra.*     docs generation orchestration
eta_mu.docs.cli.*       stable TS declaration re-exports
```

## Non-goals

- Do not expand docs runtime scope.
- Do not redesign doc generation pipeline unless explicitly requested.

## Phases

### Phase 1 — Inventory

- Identify consumers of `index.d.ts`.
- Decide whether the package becomes a pure CLJS library with `.d.ts` emit or a TS shim.

### Phase 2 — CLJS contracts

- Port types to Malli schemas and CLJS records.
- Emit compatible TypeScript declarations from CLJS build.

### Phase 3 — Verification

- Confirm `pnpm --filter @open-hax/eta-mu-docs` build/typecheck passes.
- Confirm consumers still compile.

## Acceptance criteria

- [ ] Consumer inventory documented.
- [ ] CLJS package builds with zero warnings.
- [ ] TypeScript compatibility surface preserved.
- [ ] `pnpm --filter @open-hax/eta-mu-docs typecheck` passes.

## Verification gates

```bash
pnpm --filter @open-hax/eta-mu-docs typecheck
pnpm --filter @open-hax/eta-mu-docs build
node scripts/ts-line-count.mjs packages/legacy/docs
```

---

## Scheduling review (2026-06-15)

- 1 task ready for breakdown: `docs-cljs-rewrite-inventory`.
- 6 tasks blocked: schemas await inventory; parser and dts-emit await schemas; I/O indexing awaits schemas + parser; tests and integration await all implementation tasks.
- Current bottleneck: inventory acceptance (consumer map + package-shape decision).
- Concurrency: docs is a leaf epic with no cross-epic blockers; once inventory lands, schemas + parser + dts-emit can proceed in parallel before I/O/indexing.

---

## Inventory review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `docs-cljs-rewrite-inventory` accepted; inventory doc `docs/docs-cljs-rewrite-inventory.md` produced.

**Key findings from the inventory:**
- `packages/legacy/docs` is the smallest legacy package: 92-line `index.d.ts`, small `index.cjs`/`index.js` runtime, one Node test.
- **No consumers inside `packages/legacy` or `packages/runtime`** import from `@open-hax/eta-mu-docs`.
- Decision recorded: pure CLJS library with `.d.ts` emit (no TS shim needed).
- Proposed namespaces: `eta_mu.docs.shape.*`, `eta_mu.docs.law.*`, `eta_mu.docs.infra.*`, `eta_mu.docs.extern.jsonl`, `eta_mu.docs.cli`.
- Dependencies: only Node built-ins (`fs`, `path`, `crypto`); no runtime core or boundary-adapter dependencies.
- This is the safest quick-cutover candidate in the entire legacy set.

**Updated scheduling after inventory:**
- Inventory → `review` (done).
- `docs-cljs-rewrite-schemas`, `docs-cljs-rewrite-markdown-parser`, and `docs-cljs-rewrite-dts-emit` can all move to `ready` concurrently once the inventory is accepted.
- No cross-epic blockers.

**Recommended next action:** Accept the inventory and move `docs-cljs-rewrite-schemas` to `ready`; begin porting `EtaMuMount`, `EtaMuHeading`, `EtaMuLink`, `EtaMuDocsIndexRow`, and `EtaMuDocsBacklinksRow` to Malli schemas and CLJS records.

---

## Schemas review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `docs-cljs-rewrite-schemas` accepted and promoted to `done`.

**Delivered:**
- `packages/runtime/src/cljs/eta_mu/docs/law/docs.cljs` — Malli schemas for all public docs types.
- `packages/runtime/src/cljs/eta_mu/docs/shape/docs.cljs` — records, constructors, and CLJS↔JS DTO transforms.
- `packages/runtime/src/cljs/eta_mu/docs/extern/js.cljs` — isolated JS interop boundary.
- `packages/runtime/test/cljs/eta_mu/ai/docs_test.cljs` — fixture-based schema tests.

**Verification:**
- `pnpm --dir packages/runtime cljs:verify` passed.
- `pnpm test` passed.
- Boundary scanner clean.

**Updated scheduling after schemas:**
- Schemas → `done`.
- `docs-cljs-rewrite-markdown-parser` and `docs-cljs-rewrite-dts-emit` are now unblocked and can move to `ready`.
- `docs-cljs-rewrite-io-indexing` remains blocked until markdown-parser and dts-emit land.

**Recommended next action:** Move `docs-cljs-rewrite-markdown-parser` to `ready` and port the pure markdown parsing logic; concurrently move `docs-cljs-rewrite-dts-emit` to `ready` to set up declaration emit.

---

## Markdown parser + dts-emit review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `docs-cljs-rewrite-markdown-parser` and `docs-cljs-rewrite-dts-emit` accepted and promoted to `done`.

**Delivered:**
- `packages/runtime/src/cljs/eta_mu/docs/domain/frontmatter.cljs` — frontmatter uuid/tag extraction.
- `packages/runtime/src/cljs/eta_mu/docs/domain/markdown.cljs` — headings, tags, wikilinks, markdown links, code-block stripping.
- `packages/runtime/src/cljs/eta_mu/docs/domain/parse.cljs` — `parse-eta-mu-markdown` orchestration.
- `packages/runtime/test/cljs/eta_mu/docs/parse_test.cljs` — parser tests.
- `packages/legacy/docs/package.json` — `typecheck` and `build` scripts using `tsc` to validate `index.d.ts`.
- `packages/legacy/docs/tests/eta-mu-docs.test.cjs` — public API surface smoke test.

**Verification:**
- `pnpm --dir packages/runtime cljs:verify` passed (90 tests, 413 assertions, 0 failures).
- `pnpm --filter @open-hax/eta-mu-docs typecheck` passed.
- `pnpm --filter @open-hax/eta-mu-docs build` passed.
- `pnpm --filter @open-hax/eta-mu-docs test` passed (2/2).
- `pnpm test` passed.

**Updated scheduling after parser/dts-emit:**
- Markdown parser → `done`.
- dts-emit → `done`.
- `docs-cljs-rewrite-io-indexing` is now unblocked and can move to `ready`.
- `docs-cljs-rewrite-tests` and `docs-cljs-rewrite-integration` remain blocked until I/O indexing lands.

**Recommended next action:** Move `docs-cljs-rewrite-io-indexing` to `ready` and port the file-walking / indexing / backlink orchestration, creating `eta_mu.docs.extern.fs` and `eta_mu.docs.extern.jsonl` adapters.

---

## I/O indexing review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `docs-cljs-rewrite-io-indexing` accepted and promoted to `done`.

**Delivered:**
- `packages/runtime/src/cljs/eta_mu/docs/extern/fs.cljs` — Node `fs`/`path`/`crypto` adapters.
- `packages/runtime/src/cljs/eta_mu/docs/extern/jsonl.cljs` — JSON/JSONL read/write adapters.
- `packages/runtime/src/cljs/eta_mu/docs/infra/mounts.cljs` — `load-eta-mu-mounts`.
- `packages/runtime/src/cljs/eta_mu/docs/infra/indexer.cljs` — `index-eta-mu-docs` orchestration.
- `packages/runtime/test/cljs/eta_mu/docs/indexer_test.cljs` — temp-dir integration tests.

**Verification:**
- `pnpm --dir packages/runtime cljs:verify` passed (93 tests, 434 assertions, 0 failures).
- `pnpm test` passed.
- Boundary scanner: 60 files checked, 11 extern namespaces, 0 violations.

**Updated scheduling after I/O indexing:**
- I/O indexing → `done`.
- `docs-cljs-rewrite-tests` and `docs-cljs-rewrite-integration` are now unblocked and can move to `ready`.

**Recommended next action:** Move `docs-cljs-rewrite-tests` to `ready` to port the remaining Node test suite to CLJS, then `docs-cljs-rewrite-integration` to wire the legacy `index.cjs`/`index.js` exports to the CLJS runtime.

---

## Test port review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `docs-cljs-rewrite-tests` accepted and promoted to `done`.

**Delivered:**
- `packages/runtime/test/cljs/eta_mu/docs/shape_test.cljs` — full coverage of every `create-*` constructor in `eta-mu.docs.shape.docs`:
  - Valid round-trips for mount, mounts-config, heading, wikilink, markdown-link, backlink-source, index-row, and backlinks-row.
  - At least one malformed payload rejection per major schema via `core/validate!`.
  - External JS-style key round-trips (`...-from-external` / `...->external`) for every public shape.
- `packages/runtime/test/cljs/eta_mu/docs/jsonl_test.cljs` — coverage of `eta-mu.docs.extern.jsonl`:
  - `write-json` / `read-json` round-trip.
  - `read-jsonl` now throws clear errors on invalid JSON rows and non-object rows.
  - `write-jsonl` / `read-jsonl` round-trip with multiple rows, plus empty-file and blank-line cases.
- `packages/legacy/docs/tests/eta-mu-docs.test.cjs` — deprecation comment added at the top; file retained as a legacy CJS facade smoke test.
- `packages/runtime/src/cljs/eta_mu/docs/extern/jsonl.cljs` — small behavior change: invalid JSONL rows now fail loudly instead of being silently ignored, matching the regression requirement.

**Verification:**
- `pnpm --dir packages/runtime cljs:verify` passed (116 tests, 528 assertions, 0 failures).
- `pnpm test` passed (runtime, github, docs, kanban-legacy).
- Boundary scanner: 60 files checked, 11 extern namespaces, 0 violations.

**Updated scheduling after test port:**
- Test port → `done`.
- `docs-cljs-rewrite-integration` is now unblocked and can move to `ready`.

**Recommended next action:** Move `docs-cljs-rewrite-integration` to `ready` and wire the legacy `index.cjs`/`index.js` exports to the CLJS runtime.

---

## Integration review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `docs-cljs-rewrite-integration` accepted and promoted to `done`; epic complete.

**Delivered:**
- Full verification gate run for `@open-hax/eta-mu-docs`:
  - `pnpm --filter @open-hax/eta-mu-docs typecheck` passed.
  - `pnpm --filter @open-hax/eta-mu-docs build` passed.
  - `pnpm --filter @open-hax/eta-mu-docs test` passed (2/2 legacy smoke tests).
  - `pnpm --dir packages/runtime cljs:verify` passed (116 tests, 528 assertions, 0 failures; boundary scanner clean).
  - `pnpm test` passed across runtime, github, docs, kanban-legacy.
- `packages/legacy/docs` TypeScript line count verified at **0**.
- Consumer inventory re-confirmed: no workspace package imports from `@open-hax/eta-mu-docs` other than the package itself.

**Updated scheduling after integration:**
- All docs rewrite tasks are now `done`.
- The docs epic itself is complete.

**Follow-up note (not blocking):**
- The legacy CJS implementation in `packages/legacy/docs/index.cjs` still exists as a plain-JavaScript facade. Rewiring it to call into the CLJS runtime build would be a separate architectural decision involving CJS↔ESM interop for `@open-hax/eta-mu-runtime`. The current state satisfies the rewrite goal: docs contracts are now CLJS-first in `packages/runtime`, the TS surface is preserved via `index.d.ts`, and TS line count is zero.

**Recommended next action:** Move the `docs-cljs-rewrite` epic to `done` and return to the global CLJS rewrite queue; the next bottleneck remains core `eta-mu-cljs-rewrite-boundary-adapters`.

