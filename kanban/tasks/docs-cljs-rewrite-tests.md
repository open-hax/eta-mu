---
uuid: "docs-cljs-rewrite-tests"
title: "Docs CLJS Rewrite — Test Port and Regression Suite"
status: done
priority: P3
labels: ["tasks", "cljs", "rewrite", "docs", "3sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/docs-cljs-rewrite.md"
points: 3
category: tasks
---
# Docs CLJS Rewrite — Test Port and Regression Suite

> Parent epic: `kanban/epics/docs-cljs-rewrite.md`
> Points: 3

## Purpose

Replace the legacy Node test suite with CLJS tests that verify domain parsing, schema validation, and end-to-end indexing parity.

## Scope

- Port `packages/legacy/docs/tests/eta-mu-docs.test.cjs` to CLJS.
- Add Malli schema validation tests.
- Add regression tests for malformed inputs and edge cases.

## Work items

- [x] Port the existing `parseEtaMuMarkdown` fixture test to CLJS.
- [x] Add schema round-trip tests for all public record shapes.
- [x] Add regression tests: empty frontmatter, missing uuid, no headings, code-block tag suppression, invalid JSONL rows.
- [x] Deprecate (not delete) the legacy `.test.cjs` file once CLJS tests pass.

## Acceptance criteria

- [x] CLJS test suite covers all legacy assertions.
- [x] At least one malformed payload is rejected per major Malli schema.
- [x] Test coverage gate (if any) is satisfied.

## Verification

```bash
pnpm --dir packages/runtime cljs:verify
pnpm test
```

## Review

Delivered:
- `packages/runtime/test/cljs/eta_mu/docs/shape_test.cljs` — valid round-trips, malformed payload rejection, and external↔internal key round-trips for all `create-*` constructors.
- `packages/runtime/test/cljs/eta_mu/docs/jsonl_test.cljs` — JSON/JSONL round-trips, invalid JSONL row rejection, blank-line handling, and missing-file behavior.
- `packages/legacy/docs/tests/eta-mu-docs.test.cjs` — deprecation comment added; file retained as a legacy CJS facade smoke test.
- `packages/runtime/src/cljs/eta_mu/docs/extern/jsonl.cljs` — `read-jsonl` now throws clear errors on invalid JSON or non-object rows instead of silently ignoring them.

Verification:
- `pnpm --dir packages/runtime cljs:verify` passed (116 tests, 528 assertions, 0 failures; boundary scanner clean).
- `pnpm test` passed (runtime, github, docs, kanban-legacy).

Status: done. `docs-cljs-rewrite-integration` is unblocked.

---

Unblocked by `docs-cljs-rewrite-schemas`, `docs-cljs-rewrite-markdown-parser`, and `docs-cljs-rewrite-io-indexing`.
