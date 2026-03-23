---
name: receipt-river
description: Use an append-only receipts.log (Receipt River) to externalize execution state; tail it regularly during work.
---

# Skill: Receipt River (append-only receipts.log)

## Goal
Make long agent runs smarter and more recoverable by maintaining an **append-only** `receipts.log` ledger.

## Canonical line format
- delimiter: ` | `
- required keys: `ts kind origin owner dod pi host manifest refs`
- optional keys: `note tests decisions drift`

## Use This Skill When
- You are doing multi-step work (refactor, PR, migration, Π).
- You need traceability of decisions/tests/builds.

## Rules
- If `receipts.log` exists: **never edit past lines**.
- If missing: create it at the start of non-trivial work.
- Check it regularly: tail last ~20 lines before major decisions.
- Never log secrets (tokens, Authorization headers, private keys).

## Minimal workflow
1. Append `:observation` at start of work.
2. Append `:test-run` / `:build` after verification.
3. Append `:decision` when you choose a path.
4. Append `:push-truth` / `:catalog` at handoff.
