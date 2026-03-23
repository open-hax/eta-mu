---
name: promptdb-contracts
description: Review PromptDB contract Lisp files and apply their invariants/protocols; exposes contract-specific sub-skills.
---

# Skill: PromptDB Contracts

## Goal
Make PromptDB contracts *actionable* by turning them into:
- concrete invariants agents can follow,
- operational checklists,
- and graph-discoverable skills (via `CONTRACT.edn`).

This skill is an **index/umbrella**: it routes to contract-specific skills.

## Use This Skill When
- You see references to `.opencode/promptdb/contracts/*.contract.lisp`.
- You need to enforce invariants like append-only ledgers, truth gating, or eta/mu/pi boundaries.
- You want the agent to be receipts-driven (Receipt River) during long work.

## Sub-skills
- `receipt-river`
- `promptdb-eta-layer`
- `promptdb-truth-binding`
- `promptdb-ui-panels`
- `promptdb-presence-say`
- `promptdb-ollama-embeddings-cost`
