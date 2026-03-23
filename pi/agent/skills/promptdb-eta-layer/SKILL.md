---
name: promptdb-eta-layer
description: "Enforce the eta-layer boundary (.η) invariants: append-only stream, immutable raw, snapshot live; mu reads but does not mutate eta."
---

# Skill: PromptDB Contract — Eta Layer

## Goal
Apply the `promethean.eta-layer/v1` contract:
- keep eta as raw observational substrate,
- constrain folder semantics,
- and enforce the eta→mu→pi flow.

## Canonical source
`vaults/fork_tales/.opencode/promptdb/contracts/eta-layer.contract.lisp`

## Invariants (operational)
- `.η/stream` is append-only.
- `.η/raw` is immutable.
- `.η/live` is a snapshot log.
- μ may read η, but must not mutate η.
- Π packaging must not be built directly from η.

## Use This Skill When
- You are asked to add an eta stream, raw folder, or ledger.
- You see `.η/` in a repo and need to avoid violating the boundary.
