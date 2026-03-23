---
name: social-publish-reddit
description: "Publish longer-form Hormuz clock updates to Reddit while preserving nuance, methodology, and subreddit-specific constraints"
compatibility: opencode
metadata:
  domain: hormuz-clock
  platform: reddit
  version: 1
---

# Skill: Social Publish Reddit

## Goal
Turn the latest Hormuz snapshot into a Reddit post that keeps uncertainty, method, and sourcing legible.

## Use This Skill When
- The user asks to publish a daily or weekly Hormuz update on Reddit.
- You need a methodology thread or discussion prompt with the latest clock image.
- The content needs more nuance than shorter social platforms allow.

## Do Not Use This Skill When
- The request is only for a short-post platform.
- The task does not involve publishing or subreddit formatting.
- There is no subreddit target and only a general copy edit is needed.

## Inputs
- Snapshot markdown.
- Image path or hosted image URL.
- Subreddit name.
- Optional flair id or flair text.

## Steps
1. Build a Reddit-friendly title and body.
2. Validate subreddit rules, flair requirements, and character limits.
3. Use `scripts/social/post_reddit.mjs` with `REDDIT_ACCESS_TOKEN`, `REDDIT_SUBREDDIT`, and optional `REDDIT_KIND`.
4. Default to dry-run unless the user explicitly asks to publish.

## Guardrails
- Do not hide uncertainty.
- Respect subreddit rules and flair requirements.
- Keep tokens in environment variables only.
- Handle submission failures clearly instead of retrying blindly.

## Output
- Reddit title and post body.
- Dry-run or publish status.
- Notes about subreddit constraints or missing auth.
