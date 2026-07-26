---
category: "tasks"
labels: ["tasks", "cljs", "eta-mu", "sol", "cli", "2sp"]
write-id: "1784340217575-0.onud2e7be0lo1h4j0b6"
points: "2"
source: "kanban/epics/sol-turn-processor-cutover.md"
title: "eta-mu sol — CLI Surface for Sol Lifecycle and Agent Turns"
priority: "P1"
status: "done"
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
has no CLI entry at all (`@eta-mu/sol` declares no bin). Give sol a
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

- [x] `eta-mu sol --help` lists the surface; each lifecycle subcommand
      works against a locally built sol (manual verification recorded).
- [x] `eta-mu sol agent "..."` completes a turn against a mock SSE server
      in an e2e test (same mock pattern as the agent e2e suite).
- [x] Tests for argument routing + the not-built error path;
      `pnpm -C packages/eta-mu test` / `lint:kondo` / `test:e2e` green.

## Implementation notes (2026-07-17)

Surface as implemented (no changes from the Scope's v1 list; two small
additions flagged here): `sol agent` also accepts `--provider` (mirrors
`eta-mu agent`), and `start`/`status` accept `--port` (else SOL_PORT/PORT
env, else 8001) so lifecycle commands can target a non-default port.

- Lifecycle (`start`/`stop`/`restart`/`status`) follows the kanban
  precedent: a child-process bridge that resolves sol's built server target
  (`packages/sol/dist/server.js`, cwd-anchored; `$SOL_SERVER_PATH` is an
  authoritative override) and errors clearly when sol isn't built
  ("not built or installed … pnpm -C packages/sol build", exit 1). `start`
  spawns detached via `nohup` with pid/log under `<cwd>/.eta-mu-sol/`;
  `stop` SIGTERMs the pidfile's pid (idempotent, clears stale pidfiles);
  `status` reports process state plus the `/health` summary (curl via the
  child-process boundary). pm2 remains an operator choice, not a dependency.
  All process/fs I/O stays behind the existing `eta-mu.extern.*` boundary —
  no new extern surface was added (the packet's writable paths excluded
  `extern/`; a future `extern.child-process/resolve-sol-path` +
  `@eta-mu/sol` devDependency is the natural follow-up).
- `sol agent` goes IN-PROCESS (the reason this comment exists): sol's agent
  sessions *are* the turn-processor run-loop over `eta-mu.extern.openai`
  streaming with the eta-mu tool registry — see
  `packages/sol/.../provider/turn_processor.cljs`, which wires exactly
  `loop/run-loop` + `openai/stream-chat` + `tool-registry/tools`. The CLI
  already carries that identical stack on its source path, so the command
  runs one turn through it directly (default system prompt mirrors sol's
  own: "You are Sol, a minimal agent runtime for the active workspace.").
  A child-process round-trip would require sol to grow a CLI bin or a
  running server, and the DoD's e2e pattern (mock SSE server, same as the
  agent e2e suite) has the CLI driving the provider endpoint directly.
- Router registration: `"sol" (sol/group)` in
  `packages/eta-mu/src/cljs/eta_mu/infra/cli/router.cljs`; group help lists
  all five subcommands with descriptions.

Fix (2026-07-18, review finding): `sol start --port` never reached the
spawned server — sol resolves its listen port exclusively from SOL_PORT/PORT
env, but the launch command injected neither, so the CLI reported/probed the
flag port while the server bound the env/default port (EADDRINUSE or false
success). `start` now spawns via `launch-command`, which injects the
effective port as `SOL_PORT=<port>` into the `nohup` command line, so the
server always binds exactly the port the CLI reports and health-probes; the
`start` help text documents the `--port`/SOL_PORT/PORT precedence. Covered
by a `launch-command` unit test and `sol-start-port-flag-e2e-test`, which
spawns the built CLI against a fake server (same SOL_PORT||PORT||8001
precedence as sol's infra.config) with SOL_PORT/PORT scrubbed from the
inherited env, asserting the server answers /health on the flag port.
Re-verified manually under the review's repro conditions (ambient
PORT=8000): `sol start --port 8991` → bound 8991, `health: ok
(open-hax-sol-cljs)`; `SOL_PORT=8017 sol start` env path unchanged.

Manual verification (against `packages/sol/dist/server.js`, SOL_PORT=8017,
2026-07-17):
```text
$ node packages/eta-mu/dist-cli/index.cjs sol --help
eta-mu sol — sub-command help
COMMANDS
  AGENT  Run one agent turn on sol's turn-processor stack: ...
  RESTART  Restart the sol backend server
  START  Launch the sol backend server (detached spawn of dist/server.js; ...)
  STATUS  Show sol process state and /health summary (...)
  STOP  Stop the running sol backend server

$ SOL_PORT=8017 ... sol start
sol started (pid 532431, port 8017)
log: /home/err/spaces/eta-mu/.eta-mu-sol/sol.log
health: ok (open-hax-sol-cljs)
$ SOL_PORT=8017 ... sol status
process: running (pid 532431)
health: ok (open-hax-sol-cljs, at 2026-07-18T00:58:56.195Z)
$ SOL_PORT=8017 ... sol restart
sol stopped (pid 532431)
sol started (pid 532801, port 8017)  ...  health: ok (open-hax-sol-cljs)
$ SOL_PORT=8017 ... sol start        # idempotent
sol is already running (pid 532801, port 8017)
$ SOL_PORT=8017 ... sol stop
sol stopped (pid 532801)
$ SOL_PORT=8017 ... sol status ; echo $?
process: not running
health: unreachable at http://127.0.0.1:8017/health
1
$ SOL_SERVER_PATH=/nope/missing.js ... sol start ; echo $?
eta-mu sol: @eta-mu/sol is not built or installed. ...
1
```

Gates: `pnpm -C packages/eta-mu test` (151 tests, 331 assertions, 0
failures), `lint:kondo` (0 errors, 0 warnings), `test:e2e` (7 tests, 71
assertions, 0 failures — incl. `sol-agent-turn-e2e-test` against a mock SSE
server, `sol-help-lists-surface-e2e-test`, and `sol-start-port-flag-e2e-test`
proving `--port` reaches the spawned server).

## Verification

```bash
pnpm -C packages/eta-mu test && pnpm -C packages/eta-mu lint:kondo && pnpm -C packages/eta-mu test:e2e
node packages/eta-mu/dist-cli/index.cjs sol --help
```

---
2026-07-18 review fix: sol start --port never reached the spawned server (sol binds SOL_PORT/PORT env only). start now spawns via launch-command, injecting the effective port as SOL_PORT=<port> into the nohup command line; start help text documents the precedence. Covered by launch-command unit test + sol-start-port-flag-e2e-test (fake server, env scrubbed). Gates: 151/331 unit, kondo 0/0, 7/71 e2e — all green; manual re-verify under review repro (ambient PORT=8000, --port 8991) bound 8991, health ok.

---