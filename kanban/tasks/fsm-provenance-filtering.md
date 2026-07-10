---
uuid: "fsm-provenance-filtering"
title: "FSM: provenance filtering of self-writes"
status: "incoming"
priority: "P1"
labels: ["tasks", "cljs", "fsm", "kanban", "reconciliation"]
created_at: "2026-06-17T00:00:00Z"
source: "kanban/epics/fsm-engine.md"
points: 3
category: "tasks"
parent: "fsm-engine"
---

# FSM: provenance filtering of self-writes

Distinguish engine/workflow writes from external edits via `:write-id` +
`:causal/root` so the engine never re-adjudicates its own causal descendants.
(Decided 2026-06-17: provenance is authoritative; fixpoint is the safety net.)

## Acceptance

- [ ] Stamp `:write-id` + `:causal/root` on all engine/workflow frontmatter writes.
- [ ] `fs.changed` from a known causal descendant is not adjudicated as an
      external request.
- [ ] External edits (no/foreign provenance) flow through the cascade normally.
- [ ] A multi-step transition writing an intermediate `:status` is not self-rejected.
- [ ] Fixpoint remains a covered safety net, not the primary mechanism.
- [ ] Unit tests: self-write skipped, external edit processed, intermediate-state
      write not self-rejected.
- [ ] Zero clj-kondo warnings; Rheos tests pass.
