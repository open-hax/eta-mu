---
name: task-router
description: Evaluate a task/spec file, normalize metadata, compute valid next Kanban states, and recommend the best transition/work skill.
---

# Skill: Task Router

## Goal
Given a task file, determine its current state, normalize metadata, and recommend the best next transition.

## Use This Skill When
- You need to move a task through the Kanban FSM.
- You want a deterministic next-step recommendation.

## Do Not Use This Skill When
- There is no task file/spec context.

## Output
- current_state
- valid_next_states
- blockers/warnings
- recommended_transition
