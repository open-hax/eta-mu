---
uuid: "github-cljs-rewrite-inventory"
title: "GitHub CLJS Rewrite — Inventory & Namespace Map"
status: done
priority: P1
labels: ["tasks", "cljs", "rewrite", "github"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/github-cljs-rewrite.md"
points: 2
category: tasks
---
# GitHub CLJS Rewrite — Inventory & Namespace Map

> Parent epic: `kanban/epics/github-cljs-rewrite.md`
> Scope: `packages/legacy/github`
> Points: 2

## Purpose

Catalog every TypeScript source and test file in the legacy GitHub package and assign each to the target CLJS namespace map before any code is ported.

## Scope

- `src/index.ts`, `src/github.ts`, `src/cli.ts`
- `src/runtime-batch.ts`, `src/ensure-pr.ts`, `src/autofix.ts`, `src/review-gate.ts`
- `src/event-classifier.ts`, `src/pi-agent.ts`, `src/config.ts`, `src/types.ts`
- `tests/*.test.ts`

## Work items

- [ ] Produce a file-by-file classification into `domain.*`, `shape.*`, `law.*`, `extern.*`, `infra.*`, or `cli.*`.
- [ ] List every public export from `src/index.ts` and the consumers inside the workspace.
- [ ] Identify TS-only dependencies (Octokit, fetch wrappers, auth tokens) that must stay in `extern.*`.
- [ ] Record any data types that need Malli schemas under `law.*`.

## Acceptance criteria

- [ ] Inventory document checked into `docs/github-cljs-rewrite-inventory.md`.
- [ ] Every `src/` file has a mapped target namespace.
- [ ] At least one consumer per public export is identified.
- [ ] No source code is modified.

## Verification

```bash
node scripts/ts-line-count.mjs packages/legacy/github
ls packages/legacy/github/src
grep -E "^export" packages/legacy/github/src/index.ts
```

---

**Status note:** Ready to decompose/estimate. Inventory only catalogs files and maps them to the target namespace split; it does not depend on unfinished extern adapters or `fetch-timeout-abort-controller`. Core runtime `law.*`/`domain.*` patterns are already done, so classification criteria are available.

---

**Produced:** `docs/github-cljs-rewrite-inventory.md` now catalogs every `src/*.ts` and `tests/*.test.ts` file in `packages/legacy/github`, maps each to the target CLJS namespace split (domain/shape/law/extern/infra/cli), lists public exports and internal consumers, identifies raw JS interop surfaces (Octokit, fetch, auth, config, Node FS/child_process), and records runtime/boundary dependencies.

**Next recommended task:** Create the `eta_mu.github.extern.github-client` boundary adapter namespace and its conversion regression tests; this is the largest raw-JS surface and unblocks the domain and CLI cutover tasks.
