---
uuid: "docs-cleanup-agents-md"
title: "Clean up AGENTS.md inconsistencies and update testing gate"
status: "ready"
priority: "P3"
labels: ["docs", "agents", "cleanup", "1sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 1
category: "tasks"
---

# Clean up AGENTS.md inconsistencies and update testing gate

## Context

`AGENTS.md` is mostly current, but it has heading-level inconsistencies, references a non-existent `spec/` path, and the testing gate names packages that have been renamed or moved.

## Findings

- Heading levels are inconsistent (`##` then `#`).
- References `spec/eta-mu-charter-v1.md`, but the charter is at `kanban/eta-mu-charter-v1.md`.
- Testing gate mentions `@open-hax/eta-mu-cli` and `packages/eta-mu-extensions`; the actual paths/names are `packages/legacy/coding-agent` and `packages/extensions`.

## Acceptance

- [ ] Normalize heading levels in `AGENTS.md`.
- [ ] Fix the charter path reference.
- [ ] Update the testing gate to reference the current package names and test commands.
- [ ] Verify no other stale package names remain in `AGENTS.md`.
