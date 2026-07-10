---
category: "tasks"
labels: ["tasks", "lint", "biome", "monorepo", "tech-debt"]
write-id: "1783697785880-0.284en3kqimq4vubsgsc"
points: "2"
source: "PR #132 review"
title: "Refresh biome.json lint globs after packages/legacy reorg"
priority: "P2"
status: "review"
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

---
2026-07-10: done. Globs mapped to post-reorg layout (legacy/{coding-agent,kanban,agent,ai,tui,github}, extensions, runtime); dropped presence-core/signal-*/chat-ui (no TS remains); added !**/dist|target|.shadow-cljs exclusions after discovering 9,317 of 9,900 'new' errors were compiled shadow-cljs output in packages/extensions/dist. Auto-fixed format/organizeImports in packages/runtime (6 files, runtime tests 6/6 green, TS count DOWN 57 lines to 172,796). Legacy override: formatter+assist disabled (formatting frozen code fights the TS ratchet), noEmptyInterface+noAsyncPromiseExecutor downgraded to warn (behavior-preserving policy for deprecated code). npx biome check . = 0 errors / 638 warnings / exit 0. Awaiting commit + review.
---