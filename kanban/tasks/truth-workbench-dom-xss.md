---
uuid: "truth-workbench-dom-xss"
title: "Sanitize innerHTML in truth-workbench UI to prevent DOM XSS"
status: incoming
priority: P2
labels: ["tech-debt", "security", "truth-workbench"]
created_at: "2026-06-12T00:00:00Z"
source: "coderabbit-review:PR-112"
category: tasks
---

# Sanitize innerHTML in truth-workbench UI

## Context

CodeRabbit review on PR #112 flagged `services/eta-mu-truth-workbench/ui/app.js:90-99` — variables `panels`, `plannedMu`, and `breath` concatenate untrusted strings from `actionBatch` and inject them into `innerHTML`, creating a DOM XSS risk.

## Acceptance criteria

- [ ] All user-provided strings are sanitized/escaped before `innerHTML` injection
- [ ] Or: build DOM nodes and set `textContent` instead of `innerHTML`
- [ ] Values from `actionBatch.panels`, `actionBatch.primary_action.reason`, `actionBatch.breath.reason` are escaped
- [ ] Test covers XSS attempt rejection

## Verification

```bash
# Test that script injection is escaped
# (manual review of code paths)
```
