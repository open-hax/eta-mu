> [!WARNING]
> **DEPRECATED — legacy TypeScript/JS package.**
> This monorepo is ClojureScript-first. This package is slated for a CLJS
> rewrite; see [`docs/docs-cljs-rewrite-inventory.md`](../../../docs/docs-cljs-rewrite-inventory.md)
> for the migration inventory. Do not add new TypeScript here.

# @open-hax/eta-mu-docs

ημ docs indexing library (view-graph substrate).

- Reads mounts (`ημ.mounts.v1`)
- Parses markdown for headings/tags/wikilinks/links
- Writes rebuildable caches under `.opencode/runtime/*`

This package does **not** implement truth; it emits view inputs.

The shipped implementation is `index.cjs`; `index.js` is the ESM shim that
re-exports it. Type declarations are hand-written in `index.d.ts`.

## Public surface

Exported from the package entry (see `index.d.ts` for full types):

- `loadEtaMuMounts({ repoRoot, mountsPath })` — load and validate an
  `ημ.mounts.v1` mounts config.
- `parseEtaMuMarkdown({ relPath, text })` — extract `{ uuid, title, headings,
  tags, links }` from a markdown document.
- `indexEtaMuDocs({ repoRoot, mountsPath, indexPath, backlinksPath, parserVersion? })`
  — async; walks all mounts, writes the docs index and backlinks caches, and
  returns `{ indexedFiles, indexPath, backlinksPath }`.
- `readJsonl(filePath)` / `writeJsonl(filePath, rows)` — JSONL cache helpers.

Record types emitted: `ημ.docs-index.v1` and `ημ.docs-backlinks.v1`.

## Scripts

Run from the repo root via the workspace, or with `pnpm -C packages/legacy/docs`:

```bash
pnpm -C packages/legacy/docs test         # node --test tests/*.test.cjs
pnpm -C packages/legacy/docs typecheck     # tsc --noEmit --strict on index.d.ts
pnpm -C packages/legacy/docs build         # type-check only (no emit; index.cjs is the artifact)
```

Tests live in `tests/eta-mu-docs.test.cjs`. Note: `build` does not emit — it
runs the same `tsc --noEmit` check as `typecheck`; the published artifacts
(`index.cjs`, `index.js`, `index.d.ts`) are committed directly.

## License

GPL-3.0-only (`license` field in `package.json`).
