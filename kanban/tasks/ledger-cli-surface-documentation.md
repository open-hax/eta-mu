---
category: "tasks"
labels: "cli, docs, help, git, skills, ledger"
parent: "agent-operating-standard"
type: "task"
points: "3"
source: "user-request:2026-07-30"
title: "Document the ledger CLI surface: help text, eta-mu git docs, and a git skill"
priority: "P1"
status: "incoming"
uuid: "ledger-cli-surface-documentation"
created_at: "2026-07-30T18:08:00Z"
---

# Document the ledger CLI surface: help text, eta-mu git docs, and a git skill

## Outcome

The CLI explains its own ledgers. `eta-mu help` says what the receipt, mycology, and
kanban event ledgers are and which commands read and write them; `eta-mu git` is
documented as a real surface rather than a compatibility shim; and there is a skill that
teaches an agent to use it.

## Why

Three ledgers govern how work is recorded in this repo, and the CLI mentions none of them
in a way a new agent or user could act on. `eta-mu git` exists and works but is
documented in one sentence that calls it temporary — so nobody uses it, and agents fall
back to hand-editing ledger files.

## Current state

- Help is rendered by `render-help` at
  `packages/eta-mu/src/cljs/eta_mu/domain/router.cljs:30-44`, called from
  `packages/eta-mu/src/cljs/eta_mu/infra/cli/router.cljs:83` and `:115`. Current output
  lists `GIT` with three subcommands and one-line blurbs: `FORK-TAX`, `RECEIPT`,
  `SESSION`. Nothing says what a ledger is or where it lives.
- `eta-mu git` is defined at
  `packages/eta-mu/src/cljs/eta_mu/infra/cli/commands/git.cljs:4-17` and registered at
  `packages/eta-mu/src/cljs/eta_mu/infra/cli/router.cljs:71-73`.
- The only documentation is `packages/eta-mu/README.md:101-105`, which calls
  `eta-mu git receipt|session|fork-tax` "temporary compatibility paths" for the canonical
  top-level commands.
- **No skill** mentions `eta-mu git`. The existing git skills (`resolve-git-conflicts`,
  `github-integration`) are about general git, not this surface.

## Scope

- [ ] Decide and record whether `eta-mu git *` is canonical or genuinely deprecated in
      favour of the top-level `receipt` / `session` / `fork-tax` commands. Documenting it
      as "temporary" while it is the discoverable grouping is the actual problem.
- [ ] Help text names the three ledgers, their on-disk paths
      (`receipts.edn`, `.ημ/session-mycology/ledger.md`, `kanban/.events/ledger.edn`),
      and the command that writes each.
- [ ] Per-command `--help` for each `git` subcommand.
- [ ] A skill for the surface, consistent with the updated `receipt-river` and
      `session-mycology` skills — one story, not three.
- [ ] Update `packages/eta-mu/README.md` and `DEVELOPMENT.md` to match whichever
      canonical/deprecated decision was made.
- [ ] Zero clj-kondo warnings; help-rendering tests updated.

## Done when

`eta-mu help` and `eta-mu git --help` together are enough for an agent to record a
receipt, run a retrospective, and pay the fork tax without reading any source.
