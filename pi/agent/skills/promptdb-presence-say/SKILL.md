---
name: promptdb-presence-say
description: "Apply the presence-say contract: compile presence-state+nexus slice into a say-intent; LLM renders only; no new facts."
---

# Skill: PromptDB Contract — Presence Say

## Goal
Apply `promethean.presence-say/v1`:
- compile `presence-state` + `nexus-slice` into `say-intent`
- LLM only **renders** text from say-intent
- say-intent is bounded and must not introduce new facts

## Canonical source
`vaults/fork_tales/.opencode/promptdb/contracts/presence-say.contract.lisp`

## Constraints
- `no-new-facts=true`
- `cite-refs=true`
- `max-lines=8`

## Use This Skill When
- You are building agent narration from state.
- You want strict separation between compilation (deterministic) vs rendering (LLM).
