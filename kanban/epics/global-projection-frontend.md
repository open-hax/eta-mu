---
uuid: "global-projection-frontend"
title: "Global Projection Frontend — All Boards, Filter Bar, Composed View"
status: "todo"
priority: P0
labels: ["epics", "cljs", "helix", "kanban", "projection", "frontend"]
created_at: "2026-06-09T00:00:00Z"
source: "planning-session:2026-06-09"
points: 13
category: epics
---

# Global Projection Frontend

## Purpose

Default view shows ALL boards as one composed projection. Top bar has a filter menu to narrow by domain, org, status, priority, labels. No dropdown to switch boards — everything is one view.

## Design

### Default view

On load, the frontend calls `GET /api/board/compose` with no filters. This returns a merged snapshot of ALL 75 boards. Columns are the union of all statuses across boards, ordered by `defaultStatusOrder`.

### Top bar filter menu

```
┌─────────────────────────────────────────────────────────────┐
│ [🔍 search] [domain ▾] [org ▾] [status ▾] [priority ▾] [🏷] │
├─────────────────────────────────────────────────────────────┤
│  Icebox (43) │ Incoming (7) │ Ready (33) │ In Progress (17) │ ...
│  ─────────── │ ─────────── │ ────────── │ ──────────────── │
│  task card   │ task card   │ task card  │ task card        │
│  task card   │ task card   │            │ task card        │
└─────────────────────────────────────────────────────────────┘
```

Filter buttons are multi-select dropdowns populated from board meta:
- **domain**: proxx, knoxx, openplanner, eta-mu, daimoi, shuv, ...
- **org**: open-hax, octave-commons, riatzukiza, shuv, ussyverse
- **status**: icebox, incoming, ready, todo, in_progress, review, done, ...
- **priority**: P0, P1, P2, P3
- **labels**: populated from task labels across all boards

Search bar filters by task title/content text.

### API

```
GET /api/board/compose?domain=proxx,knoxx&status=todo,in_progress&priority=P0,P1
GET /api/board/compose?q=fix+login  (text search)
```

### Card enrichment

Each task card shows:
- Task title
- Priority badge
- Source board name (small text)
- Domain/org chip
- Drift indicator (if drift detected for this task)

### Implementation

- Helix components
- uxx design tokens
- WebSocket for live updates (when file watcher is active)
- Filter state in URL params (shareable views)

## Constraints

- All code in CLJS (Helix)
- No MongoDB dependency — compose endpoint handles all filtering
- Filter state persists across page reloads (URL params)
- Must handle 800+ tasks without performance issues (virtualized list or column pagination)

## Dependencies

- Board composition server endpoint (Phase 2 of roadmap)
- Board meta on all projects (done)

## Acceptance criteria

- [x] Default view shows all boards as one projection
- [x] Filter by domain, status, priority
- [x] Filter by org, labels
- [x] Text search across task titles
- [x] Source board name visible on each card
- [x] Filter state in URL params
- [x] Handles 800+ tasks without jank


---

**Board audit 2026-06-12 — bounced done → review.** MOSTLY DONE — the strongest of the eight. The composed default view, filter bar, and URL-param filter state are implemented (`ui/core.cljs`, `ui/filter_bar.cljs`) and the listed acceptance criteria are essentially met. Outstanding against design/constraints: per-card drift indicators and domain/org chips are not rendered (`ui/board.cljs` shows only priority + sourceBoard + title), live WebSocket updates are not wired, and there is no list virtualization for the 800+-task target. Separately, the board has no drag-to-move (tracked as its own gap). Remaining: card enrichment, live updates, perf, and confirm it truly stays smooth at scale.

---

**Session 2026-06-13 progress.** NOW DONE: drag-and-drop added (draggable cards + droppable columns → FSM-enforced status POST + rejection toast); compose view, filter bar, URL state already worked. REMAINING: per-card drift indicators + domain/org chips, live WebSocket updates, and list virtualization (the checked "handles 800+ without jank" AC is unverified — no virtualization in code). Moved review → todo.
