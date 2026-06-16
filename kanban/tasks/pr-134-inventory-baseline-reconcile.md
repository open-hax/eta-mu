---
uuid: "pr-134-inventory-baseline-reconcile"
title: "PR #134: Recompute packages/** total in architecture inventory"
status: "todo"
priority: "P2"
labels: ["tasks", "docs", "pr-134", "2sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 2
category: "tasks"
---

# PR #134: Recompute packages/** total in architecture inventory

CodeRabbit flagged that `docs/cljs-runtime-rewrite-architecture-inventory.md` reports ~1620 TS/JS/CLJS source files under `packages/**`, but the sum of the individual package counts in the table does not match. Reconcile the total or document the missing scope so the baseline is trustworthy.

## Acceptance
- Total equals the sum of listed package rows, or a scope note explains the discrepancy.
- Inventory remains useful as a planning baseline.
