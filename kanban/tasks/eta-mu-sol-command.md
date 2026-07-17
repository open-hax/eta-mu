---
category: "tasks"
labels: ["tasks", "cljs", "eta-mu", "sol", "cli", "2sp"]
points: "2"
source: "kanban/epics/sol-turn-processor-cutover.md"
title: "eta-mu sol — CLI Surface for Sol Lifecycle and Agent Turns"
priority: "P1"
status: "blocked"
uuid: "eta-mu-sol-command"
created_at: "2026-07-17T00:00:00Z"
---

# eta-mu sol — CLI Surface for Sol Lifecycle and Agent Turns

> Parent epic: `kanban/epics/sol-turn-processor-cutover.md`
> Blocked on: `sol-provider-swap-legacy-drop` (the CLI must drive the new
> stack, not the legacy one).
> User directive 2026-07-17: sol is "made available through `eta-mu sol ...`".

## Purpose

Rheos is reachable as `eta-mu kanban ...` through a child-process bridge
(`infra/cli/commands/kanban.cljs` resolving the rheos CLI). Sol currently
has no CLI entry at all (`@open-hax/sol` declares no bin). Give sol a
first-class surface under the eta-mu router so operators drive it the same
way they drive the board.

## Scope

- v1 command surface (record any changes on the card):
  - `eta-mu sol start` — launch sol-backend (direct spawn of sol's server
    target; pm2 remains an operator choice, not a dependency of the CLI),
  - `eta-mu sol stop` / `eta-mu sol restart`,
  - `eta-mu sol status` — process + health endpoint summary,
  - `eta-mu sol agent <prompt...>` — run one agent turn through sol's
    turn-processor-backed session (proves the decoupling on the exact path
    users hit; flags mirroring `eta-mu agent` where they make sense:
    `--model`, `--base-url`, `--api-key`, `--system`).
- Bridge shape follows the kanban precedent (child-process resolution with
  a clear error when sol isn't built/installed) unless the card's
  implementation comment records a reason to go in-process.
- Router registration in `packages/eta-mu` `infra/cli/router.cljs` with
  the command described in `--help`, and `--help` text for the subcommands.

## Definition of done

- [ ] `eta-mu sol --help` lists the surface; each lifecycle subcommand
      works against a locally built sol (manual verification recorded).
- [ ] `eta-mu sol agent "..."` completes a turn against a mock SSE server
      in an e2e test (same mock pattern as the agent e2e suite).
- [ ] Tests for argument routing + the not-built error path;
      `pnpm -C packages/eta-mu test` / `lint:kondo` / `test:e2e` green.

## Verification

```bash
pnpm -C packages/eta-mu test && pnpm -C packages/eta-mu lint:kondo && pnpm -C packages/eta-mu test:e2e
node packages/eta-mu/dist-cli/index.cjs sol --help
```
