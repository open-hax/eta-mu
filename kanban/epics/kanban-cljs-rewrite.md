---
uuid: "kanban-cljs-rewrite"
title: "Kanban CLJS Rewrite: Server, CLI, Frontend"
status: "in_progress"
priority: P0
labels: ["epics", "cljs", "kanban", "rewrite", "openplanner-protocols"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
points: 55
category: epics
---

# Kanban CLJS Rewrite: Server, CLI, Frontend

> Package: `packages/legacy/kanban` (`@open-hax/kanban-legacy`)
> Parent program: `kanban/epics/eta-mu-cljs-runtime-rewrite.md`
> Related package epic: `kanban/epics/output-contract-gate-cljs-rewrite.md` shares board composition logic

**Status:** In progress — server FSM + ledger live; CLI write commands (comment/frontmatter) and the comment endpoint remain for TS parity. See `kanban/tasks/rheos-comments-parity.md`.

## What was built

- `packages/kanban-cljs/` — Fastify server, CLJS CLI, board composition, FSM engine, event emission
- `services/eta-mu/kanban/ecosystem.config.cjs` — updated to point to kanban-cljs
- `services/eta-mu/kanban/openhax.kanban.json` — meta fields on all 75 projects
- 21 tests, 36 assertions, 0 failures, 0 warnings
- node:fs/promises imports (knoxx pattern), ^:async/await throughout


---

**Board audit 2026-06-12 — bounced done → review.** NOT done. The card claims "CLJS kanban at feature parity" — this is false. The CLJS CLI (`cli.cljs`) exposes only board/compose/events/drift/serve; it has NO status-change, move, comment, or frontmatter commands that the legacy TS CLI provides. The server lacked a comment endpoint and any FSM enforcement, and the event ledger did not load at runtime. The child task `eta-mu-cljs-rewrite-surface-parity` is still in `review`, so the epic cannot be done. Stale `completed_at` removed. Remaining: CLI write commands, server comment route, FSM enforcement, real parity check vs TS.

---

**Session 2026-06-13 progress.** NOW DONE: server enforces FSM + records to ledger; CLI gained project-aware `move`/`events`/`drift`. REMAINING for true TS parity: comment endpoint + CLI `comment`/`frontmatter` commands (the legacy TS CLI has these). Moved review → todo.