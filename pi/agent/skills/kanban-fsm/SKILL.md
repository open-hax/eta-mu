---
name: kanban-fsm
description: Canonical Kanban workflow FSM contract (states, transitions, gates, invariants, normalization). Use to validate or explain status transitions.
---

# Skill: Kanban FSM

## Goal
Provide a single source-of-truth Kanban FSM contract: states, transitions, gates, invariants, and normalization rules.

## Use This Skill When
- You need to validate a task status transition.
- You need to normalize legacy status tokens (e.g., in_progress → in-progress).
- You need to explain what a state means (ready vs todo, etc.).

## Do Not Use This Skill When
- The user is asking for unrelated coding work.

## Output
- Canonical next states.
- Required gates/invariants.
- Normalized token mapping.
