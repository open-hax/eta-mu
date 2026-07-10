---
category: "tasks"
labels: ["tasks", "lint", "biome", "monorepo", "tech-debt"]
write-id: "1783694673973-0.r9bnh6eznsgajheezud"
points: "2"
source: "PR #132 review"
title: "Refresh biome.json lint globs after packages/legacy reorg"
priority: "P2"
status: "in_progress"
uuid: "monorepo-reorg-biome-lint-coverage"
created_at: "2026-06-15T00:00:00Z"
---

# Refresh biome.json lint globs after the packages/legacy reorg

Deferred from PR #132. `biome.json` `files.includes` still points at pre-reorg paths,
so the lint gate silently no-ops on the moved code instead of failing — non-blocking
for merge, but it means real coverage gaps.

Done in a separate PR because pointing the globs at `packages/legacy/**` will lint
previously-unlinted code and is likely to surface new diagnostics that need their own
review/fix cycle.

## Stale globs to fix

- `packages/coding-agent/**` → `packages/legacy/coding-agent/**`
- `packages/kanban/**` → `packages/legacy/kanban/**`
- `packages/agent/**`, `packages/ai/**`, `packages/tui/**` → `packages/legacy/...`
- `packages/chat-ui/src/**` — CLJS-only now; confirm whether any TS/TSX remains
- `packages/presence-core/**` — package does not exist; remove
- `packages/signal-*/**` — no signal packages exist; remove

## Acceptance

- biome `includes` matches the current workspace layout.
- `npx biome check .` is green (fix or justify any new diagnostics in the same PR).