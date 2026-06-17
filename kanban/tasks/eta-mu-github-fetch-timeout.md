---
category: "tasks"
labels: ["tech-debt", "security", "eta-mu-github"]
write-id: "1781638185534-0.qz60lbj9brlhgznrq9n"
source: "coderabbit-review:PR-112"
title: "Add fetch timeout with AbortController to runtime-batch.ts"
priority: "P0"
status: "blocked"
uuid: "fetch-timeout-abort-controller"
created_at: "2026-06-12T00:00:00Z"
---

# Add fetch timeout with AbortController

## Context

CodeRabbit review on PR #112 flagged `packages/eta-mu-github/src/runtime-batch.ts:173-193` — `publishActionBatch` calls `fetch` without a timeout, which can hang indefinitely.

## Acceptance criteria

- [ ] `publishActionBatch` uses `AbortController` with a bounded timeout (e.g., 30s configurable)
- [ ] `setTimeout` calls `controller.abort()` after timeout
- [ ] `clearTimeout` in `finally` block
- [ ] Abort errors surface to callers' try/catch
- [ ] Test covers timeout scenario

## Verification

```bash
pnpm --filter @open-hax/eta-mu-github test
```