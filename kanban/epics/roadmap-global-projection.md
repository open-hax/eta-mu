---
uuid: "roadmap-global-projection"
title: "Roadmap: Kanban Global Projection System"
status: "in_progress"
priority: P0
labels: ["roadmap", "kanban", "projection", "cljs"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
category: epics
---

# Roadmap: Kanban Global Projection System

## Phases

| Phase | Goal | Points | Depends on |
|---|---|---|---|
| 1 | Board Meta + Discovery | 6 | — |
| 2 | Board Composition | 13 | Phase 1 |
| 3 | Event Ledger | 17 | — |
| 4 | FSM Engine | 14 | — |
| 5 | Global Projection | 23 | Phases 1-4 |
| | **Total** | **73** | |

## Critical Path

```
Phase 1 (meta) ──→ Phase 2 (compose) ──┐
                                        ├──→ Phase 5 (projection)
Phase 3 (events) ───────────────────────┤
Phase 4 (FSM) ─────────────────────────┘
```

## Decisions

- All new code in CLJS
- Sol = `eta-mu/packages/sol`, port 7777
- Board meta: open-ended `meta` field on config
- Query DSL protocol: file-backed now, Mongo-compatible later
- FSM engine: config-driven, default 6-state
- Kanban stays file-backed (no MongoDB dependency)
- Sol shares knoxx's MongoDB
- Harness field: opencode|eta-mu|pi|claude|hermes|codex|other
- Build validation: `npm run typecheck/lint/test`
- Review backlog threshold: default 5, configurable
- Tokenizer: char count default, ITokenizer protocol


---

**Board audit 2026-06-12 — bounced done → review.** NOT done as a tracking card. It marks all five phases complete, but Phase 3 (Event Ledger) and Phase 4 (FSM Engine) are not actually functional — see `kanban-event-ledger` and `fsm-engine`, both bounced in this audit. Keep open until phases 3 and 4 genuinely land and are enforced.

## Phase Status

| Phase | Status | Notes |
|---|---|---|
| 1 | done | Board meta on all projects; discovery via `/api/boards`. |
| 2 | done | `GET /api/board/compose` with filters; saved/preset views wired in CLI. |
| 3 | done | All mutations append to `.events/ledger.edn`; write-id correlation + drift detection live; SSE stream at `/api/events/stream`. |
| 4 | enforced | Config-driven FSM (`default` / `promethean`) enforced on every status-change path (HTTP POST, CLI `move`, CLI `status-update`, agent `kanban_update_status`). WIP limits active. Remaining: real pluggable checks (`markdown-score`, `agent-review`, `build-gate`, `code-review`) + harness auto-verify + `js`/`agent`/`shell` check types. |
| 5 | done | Global projection shows all boards; filter bar + URL state; drag-and-drop FSM-enforced moves; per-card domain/org chips + drift indicator; live SSE refetch; virtualized column lists. |

---

**Session 2026-06-16.** Verified end-to-end and fixed lint/test blockers. Phase 3 drift/watcher correlation now fully wired (`write-id` injected into frontmatter, watcher correlates known writes). Phase 4 FSM enforcement confirmed across HTTP, CLI `move`, CLI `status-update`, and agent tool paths. Phase 5 card enrichment, live SSE updates, and column virtualization are all implemented and pass tests. Remaining hard gaps are the pluggable FSM transition checks and harness auto-verification (tracked in `fsm-engine` epic). All Rheos tests and clj-kondo pass with zero warnings.

**Clarification on scope:** This roadmap tracks the kanban global projection system. Knoxx is the currently working runtime; the Rheos CLJS implementation is the new composable surface being brought to parity. Sol and knoxx continue to coexist. Event storage is EDN (`ledger.edn`) and is the source of truth.

---

**Session 2026-06-13.** Phases 3 (Event Ledger) and 4 (FSM) are now substantially real and enforced (see those epics) rather than dead code. REMAINING: their full scope (drift/watcher; real FSM checks) + phase-5 card enrichment. Tracking card moved review → todo.