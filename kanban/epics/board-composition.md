---
uuid: "board-composition"
title: "Board Composition: Query DSL + Multi-Board Projections"
status: done
priority: P0
labels: ["epics", "cljs", "kanban", "composition", "query-dsl"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
points: 21
category: epics
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
