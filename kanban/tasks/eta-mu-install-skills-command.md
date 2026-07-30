---
category: "tasks"
labels: "cli, skills, install, tui, cljs"
parent: "agent-operating-standard"
type: "task"
points: "5"
source: "user-request:2026-07-30"
title: "eta-mu install skills, with a global or project scope picker"
priority: "P1"
status: "incoming"
uuid: "eta-mu-install-skills-command"
created_at: "2026-07-30T18:07:00Z"
---

# eta-mu install skills, with a global or project scope picker

## Outcome

`eta-mu install skills` opens an interface that asks whether to install at **global** or
**project** scope, then writes the selected skills there. Installing the skills that
describe the ledgers stops being a manual copy into `~/.agents/skills/`.

## Why

The turn-loop and ledger skills are only useful if they are present in the session that
needs them. Today there is no install path at all: `eta-mu install` does not exist —
the command registry at `packages/eta-mu/src/cljs/eta_mu/infra/cli/router.cljs:41-92`
has no `install` key, and no CLI source references `"install"`.

## Current state

Registered top-level commands: `agent`, `contracts`, `doctor`, `fork-tax`, `git`, `help`,
`kanban`, `receipt`, `receipt-river`, `session`, `session-mycology`, `sessions`, `sol`,
`version`. No `install`.

## Scope

- [ ] Add an `install` command group with a `skills` subcommand, registered in
      `infra/cli/router.cljs` alongside the existing groups.
- [ ] Scope picker: **global** (`~/.agents/skills/`) and **project**
      (`<repo>/.claude/skills/` — confirm the project-local convention before wiring it;
      this repo currently has no project skills directory).
- [ ] Interactive selection of which skills to install, with a non-interactive path
      (`--scope`, `--skill`, `--all`) so the command is usable from an agent and in CI.
- [ ] Never clobber silently: report what exists, what would change, and require an
      explicit `--force` to overwrite a modified skill.
- [ ] Idempotent — running twice changes nothing the second time.
- [ ] The source of truth for "which skills ship with eta-mu" is data, not a hardcoded
      list in the command handler.
- [ ] Unit tests for scope resolution, the overwrite guard, and the non-interactive path;
      zero clj-kondo warnings.

## Done when

A user on a fresh machine can run `eta-mu install skills`, pick global, and have the
receipt/mycology/git skills present in the next session.

## Open questions

- Which interface? The repo has TUI work under the `tui-cljs-rewrite` epic — reuse that
  selector rather than inventing a second prompt style if it is ready.
- Do project-scope installs get committed to the repo, or written to an ignored path?
  That decides whether this is a team-shared or per-developer surface.
