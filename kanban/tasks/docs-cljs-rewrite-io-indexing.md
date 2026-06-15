---
uuid: "docs-cljs-rewrite-io-indexing"
title: "Docs CLJS Rewrite — I/O and Indexing Infra"
status: done
priority: P3
labels: ["tasks", "cljs", "rewrite", "docs", "5sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/docs-cljs-rewrite.md"
points: 5
category: tasks
---
# Docs CLJS Rewrite — I/O and Indexing Infra

> Parent epic: `kanban/epics/docs-cljs-rewrite.md`
> Points: 5

## Purpose

Port the effectful docs indexing and JSONL I/O functions from `packages/legacy/docs/index.cjs` into CLJS `eta_mu.docs.infra.*` and `eta_mu.docs.extern.*` namespaces.

## Scope

- `readJsonl` / `writeJsonl` (`eta_mu.docs.infra.jsonl`)
- `loadEtaMuMounts` (`eta_mu.docs.infra.mounts`)
- Directory walking and file stat helpers (`eta_mu.docs.extern.node`)
- SHA-256 and stable-id helpers (`eta_mu.docs.extern.crypto`)
- `indexEtaMuDocs` orchestration (`eta_mu.docs.infra.index`)

## Work items

- [ ] Create `eta_mu.docs.extern.node` adapters for fs, path, process, and directory walking.
- [ ] Create `eta_mu.docs.extern.crypto` for sha-256 and stable ids.
- [ ] Implement `eta_mu.docs.infra.jsonl` for JSONL read/write.
- [ ] Implement `eta_mu.docs.infra.mounts` to load and validate mount configs.
- [ ] Implement `eta_mu.docs.infra.index` to walk mounts, parse docs, and write index/backlinks JSONL.
- [ ] Add integration tests using a temporary fixture directory.

## Acceptance criteria

- [ ] `index-eta-mu-docs` produces index and backlinks rows matching the legacy output shape.
- [ ] All raw JS interop is confined to `extern.*` namespaces.
- [ ] Integration tests pass under the CLJS test target.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-docs cljs:test
pnpm --filter @open-hax/eta-mu-docs typecheck
pnpm --filter @open-hax/eta-mu-docs build
```

---

## Work log

### 2026-06-15 — In progress

Ported file-walking, JSONL I/O, mount loading, and docs indexing/backlink orchestration from `packages/legacy/docs/index.cjs` to ClojureScript.

### 2026-06-15 — Review

Delivered:
- `packages/runtime/src/cljs/eta_mu/docs/extern/fs.cljs` — Node `fs`/`path`/`crypto` adapters: read-file, write-file, mkdir, rmdir, file-exists?, stat, readdir, walk-markdown-files, sha256-hex, stable-id, path-resolve/path-join/path-dirname/posix-relative, cwd.
- `packages/runtime/src/cljs/eta_mu/docs/extern/jsonl.cljs` — read-json, write-json, read-jsonl, write-jsonl built on `extern/fs`.
- `packages/runtime/src/cljs/eta_mu/docs/infra/mounts.cljs` — `load-eta-mu-mounts` with Malli validation.
- `packages/runtime/src/cljs/eta_mu/docs/infra/indexer.cljs` — `index-eta-mu-docs` orchestration with cache reuse, wikilink backlink extraction, and schema validation at boundaries.
- `packages/runtime/test/cljs/eta_mu/docs/indexer_test.cljs` — temp-directory integration tests covering basic indexing, backlinks, cache reuse, and empty mounts.

Verification results:
- `pnpm --dir packages/runtime cljs:compile` — passed
- `pnpm --dir packages/runtime cljs:test` — passed (93 tests, 434 assertions, 0 failures)
- `pnpm --dir packages/runtime cljs:boundary` — passed ({"ok":true,"checked":60,"extern":11})

All raw JS/Node interop is confined to `eta-mu.docs.extern.*` namespaces. The implementation reuses `eta-mu.docs.domain.parse/parse-eta-mu-markdown` and applies Malli schemas from `eta-mu.docs.law.docs` at function boundaries.

Recommended next task: `docs-cljs-rewrite-tests` or `docs-cljs-rewrite-integration` can now move to `ready` and add any additional integration/consumer coverage.
