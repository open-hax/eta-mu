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

All verified against a build of the current tree, not the stale global binary — see
`link-local-eta-mu-cli-for-development`.

- Help is rendered by `render-help` at
  `packages/eta-mu/src/cljs/eta_mu/domain/router.cljs:30-44`, called from
  `packages/eta-mu/src/cljs/eta_mu/infra/cli/router.cljs:83` and `:115`. A correct build
  lists top-level `RECEIPT`, `RECEIPT-RIVER`, `SESSION`, `SESSION-MYCOLOGY`, `SESSIONS`,
  and `FORK-TAX`, plus the `GIT` group. **Nothing says what a ledger is or where it lives.**
- **Leaf verbs are absent from the help tree.** `eta-mu receipt --help` and
  `eta-mu receipt append --help` both render a self-referential stub —
  `COMMANDS / RECEIPT  Receipt River operations` — listing the group as its own only
  subcommand. The real verb list is only discoverable by triggering an error:
  `eta-mu receipt bogus` prints
  `Usage: eta-mu receipt {status|tail|validate|append|schemas|audit discover}`.
  That usage string lives at `packages/receipt-river/src/cljs/eta_mu/receipt_river/infra/cli.cljs:258`,
  unreachable from help. `append`'s own usage (`<kind> <note>`, `:218`) is likewise
  error-only. Same shape under `eta-mu git receipt --help`.
- `eta-mu git` is defined at
  `packages/eta-mu/src/cljs/eta_mu/infra/cli/commands/git.cljs:4-17` and registered at
  `packages/eta-mu/src/cljs/eta_mu/infra/cli/router.cljs:71-73`.
- The only documentation is `packages/eta-mu/README.md:101-105`, which calls
  `eta-mu git receipt|session|fork-tax` "temporary compatibility paths" for the canonical
  top-level commands. That wording is **accurate for source** — top-level really is
  canonical — but it is misleading in practice while the published binary only has the
  `git` forms.
- **JSON output is contaminated.** Invoked with a cwd outside the package, the built CLI
  prints `no "source-map-support" (run "npm install source-map-support --save-dev" …)` to
  **stdout** ahead of the payload, so `eta-mu kanban read-task` and `read-board` fail
  `JSON.parse` for any consumer that does not filter it. Diagnostics belong on stderr.
- **No skill** mentions `eta-mu git`. The existing git skills (`resolve-git-conflicts`,
  `github-integration`) are about general git, not this surface.

## Scope

- [ ] Register the leaf verbs in the help tree so `eta-mu receipt --help` lists
      `status|tail|validate|append|schemas|audit discover` with their arguments, and
      `eta-mu receipt append --help` prints `<kind> <note>`. Today both render a stub that
      lists the group as its own subcommand, and the usage strings are reachable only by
      typing something wrong.
- [ ] Move the `source-map-support` notice (and any other diagnostic) off stdout so
      JSON-emitting commands stay machine-parseable.
- [ ] Help text names the three ledgers, their on-disk paths
      (`receipts.edn`, `.ημ/session-mycology/ledger.md`, `kanban/.events/ledger.edn`),
      and the command that writes each.
- [ ] Resolve the `eta-mu git *` story: top-level commands are canonical in source, so
      either republish so that is true of the installed CLI too, or stop calling the `git`
      forms "temporary" while they are the only ones a user's binary has. Depends on
      `link-local-eta-mu-cli-for-development`.
- [ ] A skill for the surface, consistent with the updated `receipt-river` and
      `session-mycology` skills — one story, not three.
- [ ] Update `packages/eta-mu/README.md` and `DEVELOPMENT.md` to match whichever
      canonical/deprecated decision was made.
- [ ] Zero clj-kondo warnings; help-rendering tests updated.

## Done when

`eta-mu help` and `eta-mu git --help` together are enough for an agent to record a
receipt, run a retrospective, and pay the fork tax without reading any source.
