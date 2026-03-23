---
name: social-publish-x
description: "Publish Hormuz clock updates to X as a short post or thread with explicit uncertainty and dry-run-first behavior"
compatibility: opencode
metadata:
  domain: hormuz-clock
  platform: x
  version: 1
---

# Skill: Social Publish X

## Goal
Convert the current Hormuz snapshot into an X post or short thread that fits platform limits without collapsing nuance.

## Use This Skill When
- The user asks to post a daily clock update to X.
- You need a short thread covering state, branches, or rewind triggers.
- You need to compare two clock versions in a compact format.

## Do Not Use This Skill When
- The task is only to update the clock or write a long-form report.
- The target platform is not X.
- Auth is unavailable and the task is only generic drafting.

## Inputs
- Latest snapshot markdown.
- Image path or public asset URL.
- Optional voice such as `neutral`, `analyst`, or `broad-public`.
- Optional character-budget preferences.

## Steps
1. Build a short summary and optional continuation posts.
2. Enforce platform length limits before publish.
3. Use `scripts/social/post_x.mjs` with `X_USER_ACCESS_TOKEN`.
4. Default to dry-run unless the user explicitly asks to publish.

## Guardrails
- Distinguish observed facts from model priors.
- Do not publish if auth is missing or token scope is unclear.
- Put supporting sources in replies if the main post is too short.
- Respect rate limits and handle non-2xx responses explicitly.

## Output
- X-ready post or thread.
- Dry-run or publish status.
- Notes about auth, limits, or follow-up verification.
