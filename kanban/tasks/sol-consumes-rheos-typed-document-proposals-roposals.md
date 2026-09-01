---
uuid: "sol-consume-rheos-document-proposals"
title: "Sol consumes Rheos typed document proposals"
status: "incoming"
type: "task"
priority: "P1"
points: "3"
labels: "tasks, cljs, sol, rheos, katamorph, contracts"
parent: "workflow-dsl-kanban-reference"
category: "tasks"
write-id: "1788203224267-0.jmt5hj04l3ce3r7s4"
created_at: "2026-08-31T19:07:04.267Z"
---

# Sol consumes Rheos typed document proposals

## Outcome

Sol consumes the stable Rheos document-process fixture as a Katamorph-governed input and demonstrates the same contract can drive a native agent turn without redefining Rheos or Katamorph law.

## Acceptance

- [ ] Sol validates the Rheos proposal fixture and its contract/resource references.
- [ ] Rejection events cannot start a turn or action.
- [ ] Proposal handling resolves an injected capability/action implementation; no hard-coded Knoxx namespace is added.
- [ ] The adapter preserves Sol /api/agent compatibility and does not claim Knoxx-only memory, RBAC, studio, or MCP-HTTP features.
- [ ] Sol lint, tests, and build pass with zero warnings.

## Dependency

Consumes packages/rheos/test/fixtures/document-process/ only after rheos-typed-document-file-events lands.
