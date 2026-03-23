---
name: session-mycology
description: Meta-skill for learning from each session via per-turn retrospection, p-score friction tracking, and incubation of reusable skill spores.
---

# Skill: Session Mycology

## Goal
Turn hard turns into reusable future capability without cluttering the user-facing answer.

## Use This Skill When
- You want the agent to learn from each session.
- The workflow benefits from quiet per-turn retrospection.
- You want to convert repeated friction into candidate skills.
- You want to score "this felt hard" with explicit `p` values instead of vibes alone.

## Do Not Use This Skill When
- The interaction is tiny, casual, or clearly one-off.
- The friction is caused only by missing permissions, secrets, or external outages.
- You need a finished production skill immediately instead of an incubated draft.

## Inputs
- The current task and turn outcome.
- Tool usage and visible friction points.
- Existing spores or lessons from prior sessions.
- The mindfuck prompt's `p` score convention as scalar confidence, not fake precision.

## Mycelial lifecycle
1. **Sense** the last turn.
   - What was harder than expected?
   - What pattern repeated?
2. **Score** the turn.
   - `p-efficiency`: confidence the path was near-minimal.
   - `p-friction`: confidence the work was harder than it should have been.
   - `p-skill-candidate`: confidence a reusable skill/protocol would shrink future effort.
3. **Spore** the pattern.
   - If `p-skill-candidate` is high enough and the pattern generalizes, incubate a draft skill spore.
4. **Promote** only on evidence.
   - Recurrence, explicit user request, or clear cross-task reuse justifies promotion into a full skill.

## Operating rule
- Keep the retrospective mostly silent.
- Surface only the parts that help the user.
- Prefer tiny, durable lessons over grandiose self-mythology.

## Output
- Per-turn reflection with `p` scores.
- Optional skill spore draft when the pain seems reusable.
- A short better-path note for the next similar task.