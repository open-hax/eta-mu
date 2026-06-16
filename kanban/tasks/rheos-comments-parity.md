---
uuid: "rheos-comments-parity"
title: "Rheos — Comment endpoint + CLI comment/frontmatter commands (TS parity)"
status: "ready"
priority: "P0"
labels: ["tasks", "cljs", "kanban", "rheos", "parity"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kanban-cljs-rewrite.md"
points: 5
category: "tasks"
---

# Rheos — Comment endpoint + CLI comment/frontmatter commands

Deferred from PR #132. The branch `feat/kanban-comments-parity` delivers the green
workspace build + the Rheos server/FSM/ledger, but **comments parity itself is not
implemented**. Tracking the remaining work here so #132 can merge as the build-repair
PR it actually is.

## Remaining for TS parity

- [ ] HTTP comment endpoint on the Rheos backend (append comment to a task, emit a
      ledger event, push over SSE) mirroring the legacy `@open-hax/kanban-legacy` behaviour.
- [ ] CLI `comment` command (`rheos comment <uuid> ...`).
- [ ] CLI `frontmatter` write command for parity with the legacy CLI.
- [ ] Tests covering the endpoint + CLI commands.

## Acceptance

- Rheos exposes a comment write path (endpoint + CLI) at feature parity with the
  legacy TS kanban CLI.
- `kanban/epics/kanban-cljs-rewrite.md` can move to `done` once this lands.
