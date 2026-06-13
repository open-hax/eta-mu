---
uuid: "truth-workbench-element-validation"
title: "Validate element shapes in isValidActionBatch"
status: incoming
priority: P2
labels: ["tech-debt", "security", "truth-workbench"]
created_at: "2026-06-12T00:00:00Z"
source: "coderabbit-review:PR-112"
category: tasks
---

# Validate element shapes in isValidActionBatch

## Context

CodeRabbit review on PR #112 flagged `services/eta-mu-truth-workbench/src/control-plane.js:521-539` — `isValidActionBatch` only checks that `actions`/`panels` are arrays but not that elements have expected shapes.

## Acceptance criteria

- [ ] `isValidActionBatch` asserts every element of `batch.actions` is a non-null object with a string `kind`
- [ ] Every element of `batch.panels` is a non-null object with expected string fields (e.g., `id`, `title`)
- [ ] Same element-shape checks applied to the other validator block (lines 541-547)
- [ ] Test covers malformed element rejection (e.g., `actions: [null]`)

## Verification

```bash
# Test that malformed batch is rejected
curl -X POST http://localhost:PORT/api/control-plane/action-batches \
  -H 'Content-Type: application/json' \
  -d '{"actions": [null], "panels": []}' \
  -w '%{http_code}'  # expect 400
```
