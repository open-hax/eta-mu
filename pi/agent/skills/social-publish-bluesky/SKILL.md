---
name: social-publish-bluesky
description: "Turn the latest Hormuz clock snapshot into a concise Bluesky post or thread with dry-run-first behavior"
compatibility: opencode
metadata:
  domain: hormuz-clock
  platform: bluesky
  version: 1
---

# Skill: Social Publish Bluesky

## Goal
Convert the current Hormuz snapshot into a Bluesky-ready post that stays concise, source-aware, and explicit about uncertainty.

## Use This Skill When
- The user asks to publish a daily clock update to Bluesky.
- You need a short thread covering updated probabilities or signals.
- A longer report needs to be compressed into Bluesky-sized posts.

## Do Not Use This Skill When
- The task is only to generate or update the underlying clock.
- The request targets a different platform.
- Credentials or target content are missing and only a generic social draft is needed.

## Inputs
- `reports/v4_snapshot.md` or another markdown brief.
- `assets/hormuz_risk_clock_v4.png` or a newer image.
- Optional tone such as `clinical`, `public explainer`, or `ops/status`.
- Optional defaults from `config/social_profiles.example.yaml`.

## Steps
1. Read the latest snapshot markdown and current state JSON.
2. Build one short primary post and an optional continuation.
3. Include a source note or link when space allows.
4. Use `scripts/social/post_bluesky.mjs` with `BLUESKY_IDENTIFIER`, `BLUESKY_APP_PASSWORD`, and optional `BLUESKY_SERVICE`.
5. Default to dry-run unless the user explicitly asks to publish.

## Guardrails
- Separate observed facts from model choices.
- Do not present branch probabilities as certainty.
- Prefer one strong post plus image over a thread unless the update needs extra nuance.
- Keep secrets in environment variables only.
- Back off on rate limits or `429` responses.

## Output
- A Bluesky-ready post or thread.
- Dry-run or publish status.
- Any missing-env or verification notes.

## References
- Shared profile examples: `config/social_profiles.example.yaml`
