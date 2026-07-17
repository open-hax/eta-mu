---
original_name: "2026.06.16.12.02.30.md"
<<<<<<<< HEAD:docs/notes/dev/eta-mu-kanban-agent-cli-draft.md
title: "Eta-Mu Kanban Agent CLI Draft"
summary: "Fragment sketching the eta-mu kanban agent start flow and new CLI task/board structures."
category: "dev"
========
title: "Eta Mu Kanban Agent CLI Sketch"
summary: "Sketch of the unimplemented `eta-mu kanban agent` CLI with session registration and ledger-backed state."
category: "design"
>>>>>>>> origin/device/yoga:docs/notes/design/eta-mu-kanban-agent-cli-sketch.md
created: "2026-06-16"
---

  - Registers the turn with the (as of the moment of writing) unimplemented `eta-mu  kanban agent start --external --<harness-name> --kind orchestrator`
	- This returns a session id to stdio, it records an event in `.eta-mu/kanban/agent/sesssions/:session-id/events/:event-id.edn`, and it registers a new session document in `.eta-mu/kanban/agent/sessions/state/:session-id.edn`
	- Assume that every other cli command after this doesn't exist, and it persists data in this ledger backed state edn file format.
  -  searches the kanban for tasks and epics related to the users query
  - Assigns it's self to the tasks `eta-mu kanban agent --orchestrator-id :session-id assign --task-id :task-id `


## New Eta-mu cli
## A

## Kanban
### Task
- 
### Board
#### Columns/Lists
