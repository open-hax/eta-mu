---
uuid: "board-composition"
title: "Board Composition: Query DSL + Multi-Board Projections"
status: "done"
priority: "P0"
labels: ["epics", "cljs", "kanban", "composition", "query-dsl"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
points: 21
category: "epics"
---

# Board Composition: Query DSL + Multi-Board Projections

## Purpose

Compose multiple boards into one view. Filter by board metadata, task labels, status, priority.

## Design

### Board metadata

Every `openhax.kanban.json` gets an open-ended `meta` field:

```json
{
  "tasksDir": ".",
  "meta": {
    "org": "open-hax",
    "project": "proxx",
    "domain": "infrastructure",
    "tags": ["proxy", "routing", "llm"],
    "tier": "core"
  }
}
```

### Query DSL operators

| DSL operator | CLI syntax | Meaning |
|---|---|---|
| := | field = value | Exact string equality |
| :in | field in a,b,c | Value in set |
| :contains | field contains v | Array/string contains value |
| :regex | field ~ /pattern/ | Regex match (scalars only) |

### Driver-backed implementations

Uses `IStore` driver protocol from sol-extraction. Board configs and tasks are records backed by a driver:
- **EdnStore** (default) — reads from disk, no dependencies
- **MongoStore** — for sol at scale

### CLI

```bash
eta-mu kanban compose --where 'meta.domain = infrastructure'
eta-mu kanban compose --projects proxx,eta-mu --status todo,in_progress
eta-mu kanban compose --save "infra-view" --where 'meta.domain = infrastructure'
eta-mu kanban compose --preset "infra-view"
```

## Constraints

- All code in CLJS
- No MongoDB dependency in kanban package
- Query DSL is data (EDN/JSON), not code strings

---
**Board audit 2026-06-12 — bounced done → review.** PARTIAL. The core works: `GET /api/board/compose` with `--where` clauses returns merged multi-board snapshots (verified live, meta.domain/org filtering), and the CLI `compose` command exists. Missing vs the DoD: saved/preset views (`--save` / `--preset` are not implemented in `cli.cljs`), the `IStore` driver protocol (EdnStore/MongoStore) is absent, and the `contains`/`regex` DSL operators are unverified. Remaining: saved views, driver abstraction (or descope it), DSL operator coverage tests.
---

**Session 2026-06-13.** Core compose (where-clauses, multi-board projection) verified working live + CLI `compose`. REMAINING: saved/preset views (`--save`/`--preset`), the IStore driver protocol (EdnStore/MongoStore) or an explicit descope, and `contains`/`regex` DSL operator tests. Moved review → todo.

---
**Session 2026-06-16.** Delivered:
- Saved/preset views implemented in `cli.cljs`: `--save <name>` persists the current effective query flags to `.kanban/views.edn`; `--preset <name>` loads a saved view and lets explicit CLI flags override it.
- `IStore` protocol introduced in `rheos.backend.infra.store` with a file-backed `EdnStore` driver used for view persistence. Full migration of task/config loading to `IStore` is intentionally staged: markdown tasks and JSON board configs are loaded directly today because their shapes are stable; the protocol exists so `EdnStore` and `MongoStore` can coexist polymorphically as framework needs evolve.
- `contains` and `regex` DSL operators verified: regex parsing added (`field ~ /pattern/` and `field ~ pattern`), and meta-field filtering now respects all operators (not just `=`).
- Added tests for saved views, EdnStore, and `contains`/`regex` operators; fixed pre-existing test/lint issues in `fsm_test.cljs`, `transition.cljs`, `content_parser.cljs`, `events.cljs`, and `task_edit_test.cljs` so the Rheos suite is green.

**Status:** review.

Board audit 2026-07-12: code deliverables verified present (--save/--preset CLI, IStore/EdnStore, contains/regex compose clauses), but the done status bypassed the FSM: card body still ends 'Status: review', frontmatter has no write-id, and the ledger's last transition for this uuid is todo->in_progress. Needs a lawful closing transition or demotion to review.
---
