---
category: "tasks"
labels: "rheos, cli, lifecycle, exit-codes, json"
parent: "rheos-cli-card-lifecycle-authority"
type: "task"
write-id: "1788040501870-0.svnc8ce0b7dulc0n8up"
points: "5"
title: "Rheos CLI lifecycle verb completeness and machine-usable exit contract"
priority: "P0"
status: "review"
uuid: "rheos-cli-lifecycle-verb-completeness"
created_at: "2026-07-30T00:00:00Z"
---

# Rheos CLI lifecycle verb completeness and machine-usable exit contract

## Outcome

Every lifecycle operation a card needs has a `rheos` verb, and every verb is
safe for a non-interactive caller: predictable exit codes, one-line errors,
optional `--json`.

## Current state

- **Missing verbs** that exist in the domain or MCP layer but not on the CLI:
  - frontmatter updates — `task-edit/update-frontmatter!` and
    `PATCH /api/task/:uuid/frontmatter` exist; no CLI verb reaches them, and
    `packages/eta-mu/src/cljs/eta_mu/infra/cli/commands/kanban.cljs:93` errors
    with "frontmatter key not supported by Rheos … edit the markdown directly".
  - `kanban_list_projects` is registered as an MCP tool but has no CLI verb
    (`board list` is a different, config-shaped listing).
- **The CLI never fails.** Verified against the built bundle:
  - an unknown command prints help and exits `0`;
  - `read-task <bad-uuid>` prints a raw Node stack trace and exits `0`;
  - `move` prints `REJECTED …` and exits `0`.
  Errors thrown inside `run-tool` surface as unhandled promise rejections.
- **Output shape is inconsistent.** `read-task` / `search-tasks` / `read-board` /
  `status-update` / `add-comment` print raw JSON; `compose`, `board list`,
  `events`, and `drift` print human text. No verb has a `--json` switch, so
  callers cannot rely on either.
- `packages/rheos/test/` has no `cli_test.cljs` — the entire CLI surface is
  untested.

## Scope

- Add `rheos frontmatter <uuid> --set <key>=<value>` (repeatable) routed through
  `task-edit/update-frontmatter!`. Refuse `status` and redirect to `move`, so the
  FSM stays the only status authority. Honour the body-lock rules from
  [[rheos-card-body-lock-after-breakdown]] for planning-owned keys.
- Add `rheos projects` (alias of `kanban_list_projects`).
- Define and implement an exit contract:
  - `0` success;
  - `1` usage / unknown verb / missing required flag;
  - `2` not found (unknown project, task, preset);
  - `3` refused by policy (FSM rejection, WIP limit, body lock);
  - `4` internal error.
- Wrap `main` so no promise rejection escapes: catch, print
  `rheos <verb>: <message>` to stderr, exit with the mapped code. No stack trace
  unless `--debug` or `RHEOS_DEBUG=1`.
- Add `--json` to every verb, emitting one JSON object on stdout with all human
  text on stderr, so `--json` output is always parseable. Keep current default
  human formatting for the text-mode verbs.
- Add `cli_test.cljs` covering arg parsing, the exit-code mapping, and `--json`
  shape for each verb.

## Non-goals

- Redesigning the compose query DSL.
- Adding a delete verb — terminal states are `rejected` / `archived` via `move`.
  Document that instead.
- Changing the HTTP or MCP surface beyond what the new verbs require.

## Acceptance criteria

- `rheos frontmatter <uuid> --set points=3` updates frontmatter and emits a
  `frontmatter-change` ledger event; `--set status=done` exits `1` with a message
  naming `rheos move`.
- `rheos projects` lists ids, titles, and the default flag.
- `rheos frobnicate` exits `1`; `rheos read-task nope` exits `2` with one stderr
  line and no stack trace; a rejected `move` exits `3`.
- `rheos read-board --json | jq .` succeeds for every verb that accepts `--json`.
- `eta-mu kanban frontmatter <uuid> <key> <value>` works through the bridge for
  non-status keys instead of erroring.
- `pnpm -C packages/rheos test` and `lint:kondo` pass with zero warnings.

## Related

- [[kanban-cli-status-validation-bug]] — the bridge accepting non-FSM statuses is
  the same failure mode; fixing the exit contract and routing status through
  `move` should make that card verifiable.

---
Implemented. Exit contract: 0 ok, 1 usage, 2 not found, 3 refused by policy, 4 internal; main wraps every path so no promise rejection escapes, diagnostics are a single 'rheos: <msg>' line on stderr, stack traces only under RHEOS_DEBUG=1. Failures are classified with ex-info :kind at the throw site in agent_tools and task_create rather than mapped from message strings. Verified: unknown verb 1, unknown task 2, missing --title 1, unknown project 2, bad parent 2, malformed --set 1, illegal FSM move 3, duplicate uuid 3, non-initial create status 3. New verbs: frontmatter <uuid> --set k=v (repeatable, routed through task-edit/update-frontmatter! and enforcing law/frontmatter mutable-keys; --set status=... refused and redirected to move) and projects. New kanban_update_frontmatter MCP tool. Flag parser fixed: boolean flags (--json/--verbose/--force/--force-status/--help) no longer swallow the following flag, and repeated flags collect into a vector; --verbose on board list actually works now (it read a keyword key against a string-keyed map before). --json added to move/compose/events/drift/create; tool-backed verbs keep JSON-by-default because the eta-mu bridge parses read-board stdout. eta-mu bridge: create and projects pass through, and legacy 'kanban frontmatter <uuid> <key> <value>' now translates to Rheos instead of throwing 'edit the markdown directly'. NOT done: --json is not on every verb (board list, read-task, search-tasks, read-board, status-update, add-comment, frontmatter already emit JSON or plain lists); no delete verb (documented as move --to rejected/archived).

Build gate verified green 2026-07-30 at this tree state: pnpm build exit 0, pnpm lint exit 0 (11/11 clj-kondo, Biome, tsc, extension paths, kanban markdown), pnpm test exit 0 (11/11 suites: contract-guard, eta-mu, rheos, sol, terminal-ui, turn-processor, extensions, protocols, chat-ui, axxium, kanban-legacy). rheos-cli-create-card was promoted through the FSM's own in_progress->review build gate, which shelled out to all three commands and allowed the transition (verified in the ledger). This card was moved testing->review citing that run rather than re-running an identical monorepo gate three times; same tree, same commit, same evidence. Say so if you want each card gated independently.

Implemented on PR #168 (`feat/rheos-cli-exit-contract`) — https://github.com/open-hax/eta-mu/pull/168

Stack position 2 of 3; base is #167, not main. Currently CONFLICTING against its base and must be rebased once #167 lands.

Closure audit blocker 2026-08-29: keep open. The issue requires a frontmatter-change ledger event, while current emit-frontmatter-change! writes event type kanban.frontmatter with payload type frontmatter and tests pin that spelling. The card also records that json support on every verb was not completed, and the current registry advertises the json flag only on a subset. Narrow command examples and exact-head PR #168 gates pass, but the declared contract is not fully met.
---