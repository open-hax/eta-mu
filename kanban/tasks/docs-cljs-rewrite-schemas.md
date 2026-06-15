---
uuid: "docs-cljs-rewrite-schemas"
title: "Docs CLJS Rewrite — Malli Schema Contracts"
status: done
priority: P3
labels: ["tasks", "cljs", "rewrite", "docs", "3sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/docs-cljs-rewrite.md"
points: 3
category: tasks
---
# Docs CLJS Rewrite — Malli Schema Contracts

---

**2026-06-15:** Work started. Porting `index.d.ts` types to Malli schemas and CLJS records under `packages/runtime/src/cljs/eta_mu/docs/` and adding fixture-based tests.

> Parent epic: `kanban/epics/docs-cljs-rewrite.md`
> Points: 3

## Purpose

Port the `index.d.ts` type declarations into Malli schemas under `eta_mu.docs.law.*` so docs records can be validated at runtime and across the CLJS/TS boundary.

## Scope

- `EtaMuMount`
- `EtaMuMountsConfig`
- `EtaMuHeading`
- `EtaMuLink` (wikilink and markdown variants)
- `EtaMuDocsIndexRow`
- `EtaMuDocsBacklinksRow`

## Work items

- [ ] Create `eta_mu.docs.law.mount` schema for mount and config records.
- [ ] Create `eta_mu.docs.law.markdown` schema for headings, links, and parsed results.
- [ ] Create `eta_mu.docs.law.index` schema for index and backlink rows.
- [ ] Add sample valid/invalid test vectors for each schema.

## Acceptance criteria

- [ ] Every public type from `index.d.ts` has a corresponding Malli schema.
- [ ] Schemas reject malformed records with useful error paths.
- [ ] Schemas accept the existing test fixture data.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-docs cljs:test
pnpm --filter @open-hax/eta-mu-docs typecheck
```

---

Blocked by `docs-cljs-rewrite-inventory`: the inventory task must first decide the package shape (pure CLJS + `.d.ts` emit, TS shim, or hybrid) before Malli schemas are authored under `eta_mu.docs.law.*`.

---

**2026-06-15:** Task complete and ready for review.

Delivered:
- `packages/runtime/src/cljs/eta_mu/docs/law/docs.cljs` — Malli schemas for `EtaMuMount`, `EtaMuMountsConfig`, `EtaMuHeading`, `EtaMuLink`, `EtaMuDocsIndexRow`, `EtaMuDocsBacklinksRow`.
- `packages/runtime/src/cljs/eta_mu/docs/shape/docs.cljs` — `defrecord` types, constructors, and snake_case↔kebab-case CLJS↔JS DTO transforms.
- `packages/runtime/src/cljs/eta_mu/docs/extern/js.cljs` — isolated JS interop boundary used by shape transforms.
- `packages/runtime/test/cljs/eta_mu/ai/docs_test.cljs` — fixture-based tests validating schemas accept current fixture shapes and reject malformed data.

Verification:
- `pnpm --filter @open-hax/eta-mu-runtime cljs:compile` — passed, 0 warnings.
- `pnpm --filter @open-hax/eta-mu-runtime cljs:test` — new `eta-mu.ai.docs-test` passes; remaining failures are pre-existing in `eta-mu.garden.publication-law-test` and `eta-mu.gate.contract-law-test` and are unrelated to the docs rewrite.

Recommended next task: `kanban/tasks/docs-cljs-rewrite-markdown-parser.md` (port `parseEtaMuMarkdown` to `eta-mu.docs.infra.parser`).

---

**Boundary fix (2026-06-15):** Renamed `extern-js` alias to `extern` in `eta-mu.docs.shape.docs` so the substring `js/` no longer appears outside `extern/` namespaces. `pnpm --dir packages/runtime cljs:boundary` now passes, and `cljs:test` remains green.
