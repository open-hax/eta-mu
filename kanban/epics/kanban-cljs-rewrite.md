---
uuid: "kanban-cljs-rewrite"
title: "Kanban CLJS Rewrite: Server, CLI, Frontend"
status: done
priority: P0
labels: ["epics", "cljs", "kanban", "rewrite", "openplanner-protocols"]
created_at: "2026-06-08T00:00:00Z"
completed_at: "2026-06-09T00:00:00Z"
source: "planning-session:2026-06-08"
points: 55
category: epics
---

# Kanban CLJS Rewrite: Server, CLI, Frontend

**Status: DONE** — CLJS kanban at feature parity. Server, CLI, 21 tests, 0 warnings. Ecosystem config updated.

## What was built

- `packages/kanban-cljs/` — Fastify server, CLJS CLI, board composition, FSM engine, event emission
- `services/eta-mu/kanban/ecosystem.config.cjs` — updated to point to kanban-cljs
- `services/eta-mu/kanban/openhax.kanban.json` — meta fields on all 75 projects
- 21 tests, 36 assertions, 0 failures, 0 warnings
- node:fs/promises imports (knoxx pattern), ^:async/await throughout
