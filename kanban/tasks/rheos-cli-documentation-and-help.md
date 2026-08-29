---
category: "tasks"
labels: "rheos, cli, docs, agents"
parent: "rheos-cli-card-lifecycle-authority"
type: "task"
write-id: "1788040500552-0.yb9x6eeh72mw08ea6n1"
points: "3"
title: "Rheos CLI documentation: correct help output, full verb reference, agent quickstart"
priority: "P0"
status: "review"
uuid: "rheos-cli-documentation-and-help"
created_at: "2026-07-30T00:00:00Z"
---

# Rheos CLI documentation: correct help output, full verb reference, agent quickstart

## Outcome

An agent that has never seen this repo can run `rheos --help`, read one
reference page, and drive a card through its whole lifecycle without guessing —
and nothing it reads there is false.

## Current state

- **The help output names a binary that does not exist.** Every one of the
  fourteen usage lines in `show-help`
  (`packages/rheos/src/rheos/backend/infra/cli.cljs:35`) says
  `openhax-kanban …`. The installed bin is `rheos` (`package.json` `bin`).
  Verified against the built bundle — agents copy these lines verbatim and they
  fail.
- The banner reads `OpenHax Kanban (CLJS)`.
- There is no per-verb help: `rheos move --help` does not explain `move`. Usage
  strings only appear as error text after a failed invocation, and they carry the
  same wrong binary name.
- No verb list of `projects`, and the README CLI block is a static copy that will
  drift again.
- The README documents `--config` / `$KANBAN_CONFIG` and JSON config fallback,
  but `openhax.kanban.edn` is now the preferred form (PR #158) — the README does
  not mention EDN at all.
- Nothing documents exit codes, `--json`, which verbs mutate, or which surface
  owns which operation.

## Scope

- Replace the `openhax-kanban` strings with `rheos` in `show-help` and in every
  per-command usage string; retitle the banner.
- Derive help from one data structure — a vector of `{:verb :args :flags :summary
  :mutates?}` maps — so `show-help`, per-verb help, and the README reference all
  read from the same source and cannot drift independently.
- Add `rheos help <verb>` and `rheos <verb> --help` printing that verb's args,
  flags, exit codes, and one worked example.
- Write `packages/rheos/docs/cli.md`: the full verb reference, the exit-code
  contract from [[rheos-cli-lifecycle-verb-completeness]], the body-lock policy
  from [[rheos-card-body-lock-after-breakdown]], EDN/JSON config resolution
  order, and a table of which operations belong to CLI vs HTTP vs MCP vs UI.
- Add an **agent quickstart** at the top of that page: install (see
  [[rheos-cli-agent-release-archive]]), point at a board, then the canonical
  lifecycle walkthrough — `create` → `move` to breakdown → `frontmatter --set
  points` → `move` to ready → `comment` for every subsequent update.
- State the body-lock rule prominently: after breakdown, use `comment`.
- Trim the README's CLI section to a pointer at `docs/cli.md` so there is one
  copy.
- Add a test asserting the help text contains no `openhax-kanban` and that every
  verb in the registry appears in help output.

## Non-goals

- Documenting the HTTP/MCP surface beyond the ownership table (the README already
  covers endpoints).
- Man pages or shell completions.

## Acceptance criteria

- `rheos --help` names `rheos`, and every verb it lists actually runs.
- `rheos move --help` prints move-specific help.
- No occurrence of `openhax-kanban` remains in `packages/rheos/src` or the README.
- `packages/rheos/docs/cli.md` exists and covers every verb, exit codes,
  `--json`, config resolution including EDN, and the body-lock policy.
- The quickstart walkthrough is executable start to finish against a scratch
  board.
- Adding a verb without documenting it fails the test suite.
- `pnpm -C packages/rheos test` and `lint:kondo` pass with zero warnings.

---
Implemented. cli.cljs now renders all help from one verbs registry (verb/group/args/summary/flags/example/notes/mutates?), so show-help, rheos help <verb>, and rheos <verb> --help cannot drift from each other. Every openhax-kanban string is gone; banner is 'rheos — agent-first kanban board CLI'. New packages/rheos/docs/cli.md: install, agent quickstart walking a card create->breakdown->size->ready->in_progress->comment, config resolution incl. EDN preference, exit-code table, full verb reference grouped lifecycle/read/service, the body-settles-after-breakdown policy, and a surface-ownership table (CLI vs HTTP vs MCP vs UI). README CLI section trimmed to a pointer. Tests assert: no openhax-kanban in help, every registry verb appears in help AND in docs/cli.md, every verb has a summary and a rheos-prefixed example, per-verb help renders flags and an example, help states the exit codes and the comment policy. Adding a verb without documenting it now fails the suite. NOT done: the docs are hand-written and test-checked, not generated from the registry.

Build gate verified green 2026-07-30 at this tree state: pnpm build exit 0, pnpm lint exit 0 (11/11 clj-kondo, Biome, tsc, extension paths, kanban markdown), pnpm test exit 0 (11/11 suites: contract-guard, eta-mu, rheos, sol, terminal-ui, turn-processor, extensions, protocols, chat-ui, axxium, kanban-legacy). rheos-cli-create-card was promoted through the FSM's own in_progress->review build gate, which shelled out to all three commands and allowed the transition (verified in the ledger). This card was moved testing->review citing that run rather than re-running an identical monorepo gate three times; same tree, same commit, same evidence. Say so if you want each card gated independently.

Implemented on PR #169 (`docs/rheos-cli-reference`) — https://github.com/open-hax/eta-mu/pull/169

Stack position 3 of 3; base is #168 → #167 → main. Merge last.

Closure audit blocker 2026-08-29: keep open. The literal acceptance criterion says no openhax-kanban occurrence may remain in packages/rheos/src or README, but current packages/rheos/src/rheos/backend/infra/github_issues.cljs contains the managed marker string openhax-kanban-sync twice. Help, docs, dispatch, and historical PR #169 evidence otherwise pass. Resolve by explicitly narrowing the contract to binary-name references with matching regression coverage, or by a compatible marker migration; do not close against the current literal criterion.
---