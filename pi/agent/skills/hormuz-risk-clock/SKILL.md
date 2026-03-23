---
name: hormuz-risk-clock
description: "Maintain and evolve the Hormuz public-signal risk clock by ingesting signals, updating state, and rendering reports"
compatibility: opencode
metadata:
  domain: hormuz-clock
  version: 1
---

# Skill: Hormuz Risk Clock

## Goal
Update the Strait of Hormuz risk clock from public signals, keep the state model explicit, and produce a verifiable render plus report.

## Use This Skill When
- The user asks to regenerate or update the Hormuz clock.
- New public signals need to be folded into the current state.
- You need to compare clock versions or produce a daily snapshot.
- The task involves maritime, energy, insurance, AIS, or navigation-disruption inputs for this model.

## Do Not Use This Skill When
- The task is only social reposting of an already-finished snapshot.
- The request is to redesign the model itself without producing a normal clock update.
- The work is unrelated to the Hormuz clock bundle.

## Inputs
- Optional as-of timestamp.
- New raw signal files or URLs.
- Revised thresholds or branch-prior logic.
- Requests for a render, markdown snapshot, or comparison animation.

## Workflow
1. Read `config/model_config.yaml` and relevant methodology notes.
2. Pull or refresh raw signals with `scripts/extract_signals.py`.
3. Normalize and merge inputs into `data/signals.latest.json`.
4. Update the state model with `scripts/update_state.py`.
5. Render `assets/hormuz_risk_clock_v4.png` with `scripts/generate_v4_clock.py`.
6. Optionally generate a markdown brief with `scripts/render_snapshot_report.py`.
7. If requested, compare versions with `scripts/animate_transition.py`.

## State Model
- Primary variables: `transit_flow`, `attack_tempo`, `insurance_availability`, `navigation_integrity`, `bypass_capacity`, `asia_buffer_stress`.
- Each state should keep `score`, `trend`, `confidence`, and `notes` when available.
- Branch priors stay explicit and editable; they are not facts.

## Guardrails
- Separate observed facts from model choices and inferred scores.
- Prefer additive schema and extraction changes over breaking rewrites.
- Allow rewind when signals improve.
- Keep provenance visible in reports and commits.

## Output
- Updated clock artifacts and any changed state files.
- A short explanation of what changed and why the update is safe.
- Quick verification steps for rerunning the update path.

## References
- Methodology: `methodology/clock_methodology_v4.md`
- Related model design skill: `clock-model-evolver`
