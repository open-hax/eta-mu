---
uuid: "truth-workbench-auth-checks"
title: "Add auth checks to truth-workbench POST handlers"
status: incoming
priority: P2
labels: ["tech-debt", "security", "truth-workbench"]
created_at: "2026-06-12T00:00:00Z"
source: "coderabbit-review:PR-112"
category: tasks
---

# Add auth checks to truth-workbench POST handlers

## Context

CodeRabbit review on PR #112 flagged `services/eta-mu-truth-workbench/src/app.js:104-111` — POST handler for `/api/control-plane/action-batches` calls `controlPlane.recordActionBatch` without auth checks.

## Acceptance criteria

- [ ] Auth middleware validates request before handler
- [ ] 401 returned for unauthenticated requests
- [ ] 403 returned for unauthorized requests
- [ ] `recordActionBatch` only called when auth passes
- [ ] Test covers auth rejection paths

## Verification

```bash
# Test unauthenticated request returns 401
curl -X POST http://localhost:PORT/api/control-plane/action-batches -w '%{http_code}'
```
