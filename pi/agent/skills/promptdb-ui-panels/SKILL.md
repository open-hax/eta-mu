---
name: promptdb-ui-panels
description: "Apply the UI panels contract: expose catalog/ledger/presences/drift/truth via HTTP+WS APIs."
---

# Skill: PromptDB Contract — UI Panels

## Goal
Apply the `promethean.ui-panels/v1` contract: when building dashboards, keep panel intent and API surface aligned.

## Canonical source
`vaults/fork_tales/.opencode/promptdb/contracts/ui.contract.lisp`

## Expected panels
- `:catalog`
- `:ledger` (eta/mu ledger)
- `:presences`
- `:drift`
- `:truth` (push truth)

## Expected API surface
- HTTP endpoints: `/api/catalog`, `/api/eta-mu-ledger`, `/api/presence/say`, `/api/drift/scan`, `/api/push-truth/*`
- WS events: `catalog`, `ledger-row`, `presence-say`, `drift`, `truth`, `diagnostic`

## Use This Skill When
- You are wiring backend endpoints to a UI dashboard.
- You are adding a new panel or event stream.
