---
uuid: "select-complete-review-thread-reader"
title: "Select the complete review-thread reader in Review Resolution"
status: "incoming"
type: "task"
priority: "P2"
points: "1"
labels: "github, review-gate"
dependency: ["review-thread-read-completeness"]
category: "tasks"
write-id: "1795048018956-0.ydacxshv9cj78ylnu3"
created_at: "2026-11-19T00:26:58.956Z"
---

# Select the complete review-thread reader in Review Resolution

## Outcome

The Review Resolution reusable workflow checks out the exact reviewed CLI revision from eta-mu #391.

## Acceptance

- Preserve the event, inputs, permissions, optional token fallback and strict gate invocation.
- Confirm the exact CLI checkout, package test evidence and actionlint.
- In a separate Axxium stacked consumer, verify the candidate reusable pin, completed strict run and skipped App mint.

## Evidence boundaries

Protected main activation and ready-event verification require a separate promotion decision. The existing local defensive fixtures cover incomplete reads.
