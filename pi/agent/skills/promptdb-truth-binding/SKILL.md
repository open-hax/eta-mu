---
name: promptdb-truth-binding
description: Apply the truth-binding contract (world-scoped judged claims with proof refs + receipts gating push-truth/publish/release).
---

# Skill: PromptDB Contract — Truth Binding

## Goal
Apply the `promethean.truth-binding/v1` contract:
- Truth is **world-scoped (ω)**,
- has a status enum (`:proved|:refuted|:undecided`),
- requires a proof chain and receipts,
- and gates push/publish/release.

## Canonical source
`vaults/fork_tales/.opencode/promptdb/contracts/truth-layer.contract.lisp`

## Core invariants
- Never mint truth from embeddings alone.
- Never mint truth without receipts.
- Proof kinds are bounded and verifiable.

## Use This Skill When
- You are implementing or reviewing a “push truth” pipeline.
- You need to reason about what evidence qualifies as truth vs narrative.
