---
category: "tasks"
labels: ["tech-debt", "security", "eta-mu-github"]
write-id: "1783694092694-0.e79k9pypjxu7tbhuty"
points: "2"
source: "coderabbit-review:PR-112"
title: "Add fetch timeout with AbortController to runtime-batch.ts"
priority: "P0"
status: "review"
uuid: "fetch-timeout-abort-controller"
created_at: "2026-06-12T00:00:00Z"
---

# Add fetch timeout with AbortController

## Context

CodeRabbit review on PR #112 flagged `packages/legacy/github/src/runtime-batch.ts (path updated 2026-07-10; was packages/eta-mu-github/ before the legacy reorg)` — `publishActionBatch` calls `fetch` without a timeout, which can hang indefinitely.

## Acceptance criteria

- [x] `publishActionBatch` uses `AbortController` with a bounded timeout (e.g., 30s configurable)
- [x] `setTimeout` calls `controller.abort()` after timeout
- [x] `clearTimeout` in `finally` block
- [x] Abort errors surface to callers' try/catch
- [x] Test covers timeout scenario

## Verification

```bash
pnpm --filter @open-hax/eta-mu-github test
```

---
Triage 2026-07-10: this card is the root blocker of the 8-card github-cljs-rewrite epic; nothing blocks it. Moved blocked->ready, fixed stale package path, added points. Note: card uuid differs from filename (eta-mu-github-fetch-timeout.md).

2026-07-10: implemented. publishActionBatch now takes timeoutMs (default DEFAULT_PUBLISH_TIMEOUT_MS = 30s), wires AbortController.signal into fetch, aborts via setTimeout, clears the timer in finally; abort errors surface to callers. Two tests added (hung-publish abort + signal-passing fast path); pnpm test 21/21 green, tsc --noEmit clean. TS line count 172809 -> 172853 (+44); update .ts-line-count-baseline at commit per the guard's intentional-change procedure. Awaiting commit + review.
---