---
title: Preserve caller deterministic Node toolchain contracts
uuid: 1a43a0cc-c57c-4e5b-bcbb-2968da554b73
category: tasks
labels: workflow, compatibility
priority: P1
---

## Outcome and ownership
Codex owns isolated fix/evidence-node-version-20261117. Sol requires Node22.20.0/npm10.9.3; retired-review workflow hardcoded Node24 despite its inert legacy node_version input.

## Scope and acceptance
Add evidence_node_version default24 for deterministic commands only; preserve the legacy input as inert. Actual GitHub expression evaluator tests cover missing/empty/default and exact22.20.0 override. All other producer steps and final exact-head/clean evidence law remain identical. Sol tools assertions remain unchanged. No MiMo restoration, protection changes or fabricated review. Hosted qualification and independent review precede rollout.
