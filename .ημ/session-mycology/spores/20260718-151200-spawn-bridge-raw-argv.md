---
status: incubating
created: 2026-07-18T15:12:00Z
source-session: /home/err/spaces/eta-mu (claude-code)
source-task: Fix global eta-mu kanban rheos resolution + router flag swallowing
p-efficiency: 0.75
p-friction: 0.5
p-skill-candidate: 0.75
promoted-to: ""
rejected-reason: ""
---

## Problem
`eta-mu kanban` (global install) reported rheos "not installed or built" — and after
fixing resolution, native rheos flags (`--query`, `--limit`) silently vanished. Two
independent bugs shared one symptom surface.

## Pattern
1. A globally installed CLI that spawns a private workspace package can never rely on
   its own node_modules; it must resolve via cwd-anchored require.resolve plus a pnpm
   workspace `packages/*` scan.
2. A router that parses argv into {positional, flags} destroys the token stream any
   spawn-bridge subcommand needs. Bridges must receive the raw argv tail.

## Candidate skill outline
- Name suggestion: spawn-bridge-cli-contract
- Trigger phrases: "X is not installed or built", "flags dropped by CLI wrapper",
  "subcommand passthrough loses arguments"
- Key steps: resolve child CLI via (a) require.resolve, (b) require.resolve with
  paths [cwd], (c) module-dir candidates, (d) workspace scan; pass :raw-args
  (order + flags intact) to any handler that spawns another CLI.
- Anti-patterns: reconstructing argv from a parsed flags map (loses order/arity);
  testing passthrough only with positional-only commands.

## Better path
When a wrapper CLI spawns another CLI, verify end-to-end with a *flagged* command
immediately (`search-tasks --query x`), not just bare verbs — the second bug only
shows up under flags.

## Receipt refs
- 2026-07-18T15:10:00Z eta-mu-kanban-rheos-bridge-fix
