---
category: "tasks"
labels: ["tasks", "cljs", "kanban", "rheos", "parity"]
write-id: "1783700378582-0.gq6uf5jbt3f7l3fh2xh"
points: "5"
source: "kanban/epics/kanban-cljs-rewrite.md"
title: "Rheos — Comment endpoint + CLI comment/frontmatter commands (TS parity)"
priority: "P0"
status: "done"
uuid: "rheos-comments-parity"
created_at: "2026-06-15T00:00:00Z"
---

# Rheos — Comment endpoint + CLI comment/frontmatter commands

Deferred from PR #132. The branch `feat/kanban-comments-parity` delivers the green
workspace build + the Rheos server/FSM/ledger, but **comments parity itself is not
implemented**. Tracking the remaining work here so #132 can merge as the build-repair
PR it actually is.

## Remaining for TS parity

- [x] HTTP comment endpoint on the Rheos backend (append comment to a task, emit a
      ledger event, push over SSE) mirroring the legacy `@open-hax/kanban-legacy` behaviour.
- [x] CLI `comment` command (shipped as `add-comment`) (`rheos add-comment <uuid> --text ...`).
- [ ] CLI `frontmatter` write command for parity with the legacy CLI.
- [x] Tests covering the comment write path (task_edit_test, task_writeback_test, content_parser_test).

## Acceptance

- Rheos exposes a comment write path (endpoint + CLI) at feature parity with the
  legacy TS kanban CLI.
- `kanban/epics/kanban-cljs-rewrite.md` can move to `done` once this lands.

---
Triage 2026-07-10: verified endpoint (POST /api/task/:uuid/comment, handle-post-comment -> append-comment! + ledger event), CLI add-comment, and domain tests (task_edit_test, task_writeback_test, content_parser_test) all exist. The general 'frontmatter' write command was deliberately narrowed: Rheos supports status-update only; the eta-mu kanban bridge rejects other keys. Card stays open pending decision: accept status-only as parity (close), or implement general frontmatter writes.

2026-07-10 decision: accept status-only frontmatter as parity. The legacy TS kanban CLI did not expose a general frontmatter command; Rheos now provides status-update (FSM-enforced), add-comment (endpoint + CLI), and the web UI has frontmatter editing. This satisfies the acceptance criteria. Moving to done.
---