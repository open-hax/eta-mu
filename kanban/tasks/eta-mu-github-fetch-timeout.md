---
uuid: "fetch-timeout-abort-controller"
title: "Add fetch timeout with AbortController to runtime-batch.ts"
status: incoming
priority: P2
labels: ["tech-debt", "security", "eta-mu-github"]
created_at: "2026-06-12T00:00:00Z"
source: "coderabbit-review:PR-112"
category: tasks
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
