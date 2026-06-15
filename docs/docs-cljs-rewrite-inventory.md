# Docs CLJS Rewrite — Consumer Inventory

> Package: `@open-hax/eta-mu-docs` (`packages/legacy/docs`)
> Source: `kanban/tasks/docs-cljs-rewrite-inventory.md`

## Current package surface

| File | Role |
|------|------|
| `packages/legacy/docs/index.d.ts` | Public TypeScript declarations (92 lines) |
| `packages/legacy/docs/index.cjs` | Runtime implementation (Node CJS) |
| `packages/legacy/docs/index.js` | ESM re-export shim over `index.cjs` |
| `packages/legacy/docs/tests/eta-mu-docs.test.cjs` | Existing Node test runner suite |

## Consumers of `index.d.ts`

### Inside `packages/legacy`

No package other than `packages/legacy/docs` itself imports from `@open-hax/eta-mu-docs`.

### Inside `packages/runtime`

No runtime package imports from `@open-hax/eta-mu-docs`.

### Other references

| Location | Usage | Notes |
|----------|-------|-------|
| `package.json` root `test` script | Runs `pnpm --filter @open-hax/eta-mu-docs test` | Orchestration only, not a type consumer |
| Kanban task files | Mention build/typecheck filters | Planning artifacts, not source consumers |

## Declared types and proposed CLJS namespaces

| Declared export | Kind | Proposed CLJS namespace | Proposed Malli schema namespace | Notes |
|-----------------|------|-------------------------|----------------------------------|-------|
| `EtaMuMount` | type | `eta-mu.docs.shape.mount` | `eta-mu.docs.law.mount` | Mount descriptor with `id`, `root`, `include`, `exclude` |
| `EtaMuMountsConfig` | type | `eta-mu.docs.shape.mounts-config` | `eta-mu.docs.law.mounts-config` | Config wrapper plus `mounts` vector |
| `EtaMuHeading` | type | `eta-mu.docs.shape.heading` | `eta-mu.docs.law.heading` | `{level, title}` tuple-like record |
| `EtaMuLink` | type | `eta-mu.docs.shape.link` | `eta-mu.docs.law.link` | Discriminated union of wikilink / markdown link |
| `EtaMuDocsIndexRow` | type | `eta-mu.docs.shape.index-row` | `eta-mu.docs.law.index-row` | Per-file extracted docs record |
| `EtaMuDocsBacklinksRow` | type | `eta-mu.docs.shape.backlinks-row` | `eta-mu.docs.law.backlinks-row` | Aggregated backlink index record |
| `loadEtaMuMounts` | function | `eta-mu.docs.infra.mounts` | `eta-mu.docs.law.mounts-config` (input/output) | Reads mounts JSON config from disk |
| `parseEtaMuMarkdown` | function | `eta-mu.docs.infra.parser` | `eta-mu.docs.law.parsed-doc` | Extracts headings, tags, wikilinks, markdown links |
| `readJsonl` | function | `eta-mu.docs.extern.jsonl` | — | Thin Node `fs` helper |
| `writeJsonl` | function | `eta-mu.docs.extern.jsonl` | — | Thin Node `fs` helper |
| `indexEtaMuDocs` | function | `eta-mu.docs.infra.indexer` | `eta-mu.docs.law.index-row`, `eta-mu.docs.law.backlinks-row` | Orchestrates indexing and backlinks generation |
| Stable TS re-exports | module | `eta-mu.docs.cli` | — | Entry point that emits the compatibility `.d.ts` |

## Package-shape decision

**Decision: pure CLJS library with `.d.ts` emit.**

Rationale:

- The package has no TypeScript consumers inside `packages/legacy` or `packages/runtime`, so a TS shim would add maintenance overhead without reducing migration risk.
- The implementation is self-contained (Node `fs`, `path`, `crypto` only) and fits cleanly into CLJS records and Malli schemas.
- The epic explicitly targets `@open-hax/eta-mu-docs` as the smallest legacy package and a quick CLJS cutover validation; emitting `.d.ts` from the CLJS build preserves the public compatibility surface for any future external consumers.

The new package should keep the same `package.json` name, exports map, and emitted `index.d.ts` shape. The `index.cjs` / `index.js` pair can be replaced by the CLJS compiled output plus a small entry wrapper if needed for dual ESM/CJS support.

## Dependencies on runtime core or boundary adapters

None. The current implementation depends only on Node.js built-ins:

- `node:fs`
- `node:path`
- `node:crypto`

No imports from `@open-hax/eta-mu-runtime`, runtime core, or any boundary adapter exist in `packages/legacy/docs`.

## Recommended next task

Proceed to `kanban/tasks/docs-cljs-rewrite-schemas.md`: port the declarations above to Malli schemas and CLJS records under the proposed `eta-mu.docs.shape.*` / `eta-mu.docs.law.*` namespaces.
