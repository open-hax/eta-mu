---
name: promptdb-ollama-embeddings-cost
description: "Apply the Ollama embeddings cost/admission contract (契:ollama-embeddings-cost:127.0.0.1:11434:v1): idempotency, budgets, fallback endpoints, receipts."
---

# Skill: PromptDB Contract — Ollama Embeddings Cost (契)

## Goal
Operationalize the embeddings cost + admission contract for Ollama (`/api/embeddings` with fallback `/api/embed`).

## Canonical source
`vaults/fork_tales/.opencode/promptdb/contracts/ollama-embeddings-cost.contract.lisp`

## Key rules
- Fail closed when unverifiable.
- Require idempotency-key = sha256(input).
- Enforce max input bytes, inflight, RPM.
- Compute cost CU and record a receipt.
- Fallback order: `/api/embeddings` then `/api/embed`.

## Use This Skill When
- You are implementing embedding requests with cost/budget constraints.
- You need deterministic “allow/deny/cache-only” behavior.
