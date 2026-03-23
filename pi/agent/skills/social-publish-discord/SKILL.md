---
name: social-publish-discord
description: "Publish Hormuz clock updates into Discord channels with sanitized mentions, optional images, and dry-run-first behavior"
compatibility: opencode
metadata:
  domain: hormuz-clock
  platform: discord
  version: 1
---

# Skill: Social Publish Discord

## Goal
Send a compact Hormuz clock status update to a Discord channel without leaking secrets or generating surprise mentions.

## Use This Skill When
- The user asks to post a daily risk clock update into Discord.
- A material state change needs a one-shot alert in a Discord server.
- You need to cross-post a markdown brief into an internal or public channel.

## Do Not Use This Skill When
- The task only prepares a report without distribution.
- The target platform is not Discord.
- The work is only a generic text rewrite with no Discord payload or channel target.

## Inputs
- Latest snapshot markdown.
- Rendered clock image path or URL.
- Target channel id.
- Optional allowed-mentions or ping policy.

## Steps
1. Build a Discord-safe payload from the latest snapshot.
2. Sanitize mentions with `allowed_mentions`.
3. Upload the image first or provide an existing image URL when needed.
4. Use `scripts/social/post_discord.mjs` with `DISCORD_BOT_TOKEN` and `DISCORD_CHANNEL_ID`.
5. Default to dry-run unless the user explicitly asks to publish.

## Guardrails
- Never hardcode bot tokens.
- Default to no mentions.
- Respect channel ids and message length limits.
- If the image is missing, fall back to plain text instead of failing silently.

## Output
- Discord-safe message content and media plan.
- Dry-run or publish status.
- Any missing channel, token, or verification notes.
