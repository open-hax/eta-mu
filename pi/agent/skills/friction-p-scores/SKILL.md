---
name: friction-p-scores
description: Translate turn difficulty into explicit p-scores for efficiency, friction, and skill-candidate potential.
---

# Skill: Friction p-scores

## Goal
Make "this felt hard" measurable enough to reason about.

## Use This Skill When
- You want explicit confidence scores for whether a turn was efficient.
- You want a principled threshold for when to incubate a new skill.

## Do Not Use This Skill When
- You only need a narrative explanation and no scoring.
- The turn lacked enough evidence to justify any estimate.

## p-score set
- `p-efficiency`: confidence the path was near-minimal.
- `p-friction`: confidence the turn was harder than it should have been.
- `p-skill-candidate`: confidence a reusable skill would pay off.

## Heuristic anchors
- Repeated searching, backtracking, or tool thrash increases `p-friction`.
- A clean first-pass path increases `p-efficiency`.
- Patterns that obviously generalize across tasks increase `p-skill-candidate`.
- One-off environment weirdness should lower `p-skill-candidate`.

## Output
- A small scored tuple suitable for a reflection ledger or spore gate.