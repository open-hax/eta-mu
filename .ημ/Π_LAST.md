# Π Fork Tax — 2026-06-19T15:33:41Z

## Branch
`docs/discovery-sweep-update`

## Base SHA
`ec489dae6b566df6ddd93d8c0ec6a3ec97a5a144`

## What Changed

Documentation discovery-sweep update closing the 13 `docs-*` kanban tasks (2026-06-16 sweep).
Markdown-only; **no source code touched**. Produced by a 30-agent workflow partitioned by
file ownership. 50 files: 13 added, 8 deleted, 29 modified.

### Top-level docs (P0)
- Rewrote `README.md` Layout to the real `packages/*` tree (active-cljs / legacy-ts / config-tooling), fixed the charter path to `kanban/eta-mu-charter-v1.md`, corrected Local Commands, removed all aspirational/non-existent paths.
- Rewrote `DEVELOPMENT.md` for the CLJS stack (removed all `services/agentd` references).
- Cleaned up `AGENTS.md` (heading levels, charter path, testing-gate package names).

### New package READMEs (9)
`chat-ui`, `event-ledger`, `Rheos`, `protocols`, `mcp-contracts`, `kanban-orchestrator`, `katamorph`, `kondo-config`, `legacy/publication-components`.

### Reconciled package docs
- `axxium` — README rewritten to implemented surface (password auth, JWT/cookie sessions, single entity read); kernel specs annotated implemented-vs-aspirational. Boundary `--check` exits 1 on 56 violations (documented).
- `extensions` — inventory matched to the 15-extension manifest; phantom `analyze-image`/`manipulate-image` removed; authoring guide added.
- `extensions-e2e` — path/pnpm/fixture-keyword fixes.
- `runtime` — full facade/domain layout README + `docs/design/runtime-vs-sol-ownership.md` ADR; path fixes in 3 rewrite-plan docs.
- `sol` — README rewritten for Sol; new `AGENTS.md`; Knoxx-copied artifacts removed/relabeled; `KNOXX_*` lineage documented.

### Legacy READMEs (8)
Deprecation banners + path/name/command fixes for `agent`, `ai`, `coding-agent`, `github`, `kanban`, `docs`, `output-contract-gate`, `tui`.

### Inventories
Refreshed `docs/cljs-runtime-rewrite-architecture-inventory.md` and `docs/kondo-config-baseline.md`; reconciled the two extension kanban specs to the manifest.

### Notes
Added `docs/notes/INDEX.md` + promoted `docs/design/contract-model.md`; removed 4 empty notes and 2 `research-prompt/` duplicates.

### Deletions
`CROSS_REFERENCES.md` (stale, wrong-project dump), `packages/sol/{ROUTE_MIGRATION_AUDIT.md,pseudo/hack.md}` (Knoxx artifacts), 4 empty notes, 2 duplicate notes.

## Excluded from Commit (concurrent dirt, left untouched)
- Modified (unowned): `ecosystem.config.cjs`, `receipts.edn`, `kanban/.events/ledger.edn`, `kanban/epics/fsm-engine.md`, `packages/Rheos/src/rheos/ui/domain/{board,sidebar}.cljs`, `packages/chat-ui/src/eta_mu/chat_ui/message.cljs`.
- Untracked (unowned): `.dir-locals.el`, `cljs-rewrite`, `openhax.kanban.json`, `kanban/tasks/docs-*.md` (13 source task cards driving this work), `kanban/tasks/fsm-*.md` (12), `kanban/tasks/ops-fix-root-package-json-scripts.md`.

## Residual Follow-ups (flagged, not fixed — outside file ownership)
- `packages/eta-mu-extensions/` — stale stub dir superseded by `packages/extensions`; safe to delete.
- `packages/event-ledger/index.d.ts` — declares 5 exports not in shadow-cljs `:exports` (documented as drift).
- `packages/sol/.clj-kondo/config.edn` — `defroute` hook key still points at `knoxx.backend.macros/defroute`; should be `open-hax.sol.macros/defroute`.

## Verification Status
- **Code tests**: Skipped — no code packages touched.
- **clj-kondo**: Skipped — no `.cljs/.clj/.cljc` source touched.
- **Markdown links**: Validated — no dangling references to deleted files.
- **Package names**: Verified against `package.json` — renamed dirs retain `@open-hax/eta-mu-*` npm names.

## Commit
`<filled post-commit>` on `docs/discovery-sweep-update`

## Tag
`Π/docs-discovery-sweep-update/2026-06-19T153341`

## Notes
- Workspace treated as shared per concurrent-agent guardrails. Only owned docs deliverables were staged; excluded artifacts documented as residual/unowned.
