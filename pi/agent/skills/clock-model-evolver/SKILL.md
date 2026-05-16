---
name: clock-model-evolver
description: "Improve the Hormuz clock model through new signal classes, schema changes, and better rendering or branch logic"
compatibility: opencode
metadata:
  domain: hormuz-clock
  version: 1
---

# Skill: Clock Model Evolver

## Goal
Advance the Hormuz clock architecture without losing explainability, provenance, or reversibility.

## Use This Skill When
- The user wants to improve the clock design itself.
- You need to add new signal classes or normalization rules.
- You are comparing analyst frameworks, thresholds, or branch priors.
- The task is to create better prompts for research-driven model updates.

## Do Not Use This Skill When
- The request is only to run the existing update pipeline.
- The work is only formatting or publishing a finished snapshot.
- The task does not change the model, schema, or research inputs.

## Inputs
- `methodology/clock_methodology_v4.md`.
- Current state JSON, config files, and prior renders.
- Prior reports and a concrete design question when available.

## Steps
1. Read the current methodology, state, and config inputs.
2. Identify the bottleneck: missing signals, brittle thresholds, weak branch logic, or poor rendering.
3. Propose additive schema changes first.
4. Add or revise extraction and normalization rules.
5. Update prompts under `prompts/research/` so outside models can critique the design.
6. Record the change, the rationale, and the verification path.

## Guardrails
- Distinguish facts, inferred scores, and branch priors.
- Mark weakly measurable signals as experimental.
- Keep source provenance visible.
- Prefer additive changes over full rewrites unless the user explicitly asks for a replacement model.

## Output
- Revised methodology, schema, config, prompts, or render logic as needed.
- A short note on the model bottleneck addressed.
- Verification guidance for the evolved model.

## References
- Related execution skill: `hormuz-risk-clock`
