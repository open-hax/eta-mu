---
category: "tasks"
labels: "cli, dev-workflow, versioning, volta, pnpm, release, trap"
parent: "agent-operating-standard"
type: "task"
points: "5"
source: "user-request:2026-07-30"
title: "eta-mu on PATH must be this working tree, not a stale published build"
priority: "P0"
status: "incoming"
uuid: "link-local-eta-mu-cli-for-development"
created_at: "2026-07-30T18:45:00Z"
---

# eta-mu on PATH must be this working tree, not a stale published build

## Outcome

Running `eta-mu` while working in this repo runs **this repo**. If it cannot, it says so
loudly instead of quietly answering as a different program with the same version number.

## Why

On 2026-07-30 an entire investigation was invalidated by this. `which eta-mu` resolves
through a volta shim to the **published** `eta-mu@1.1.1`. The workspace is also `1.1.1`.
The two have different command surfaces:

- **Source** registers top-level `receipt`, `receipt-river`, `session`,
  `session-mycology`, and `fork-tax` in `command-registry`
  (`packages/eta-mu/src/cljs/eta_mu/infra/cli/router.cljs`).
- **Published 1.1.1** exposes those only under the `git` group.

So `eta-mu receipt append` fails with `Unknown command: receipt` and falls through to the
agent handler, which then complains about a missing API key — a failure mode that looks
like a configuration problem and is actually a stale binary.

Worse, it produces *plausible wrong evidence*. Four cards were created with
`eta-mu kanban create-subtask`, judged unusable (random UUIDs, wrong directory, no ledger
event), deleted, and hand-written. Every one of those observations was false: rebuilt from
source, `create-subtask` writes semantic uuids into `kanban/tasks/` and emits a proper
`kanban.task-created` event. The stale binary did not error — it answered, incorrectly.

`packages/eta-mu/dist-cli/` is gitignored (root `.gitignore:67`), so a fresh checkout or
worktree has no build at all, and the global shim is the only thing that answers.

## Current state

- `packages/eta-mu/package.json` — version `1.1.1`, `bin: {eta-mu, pi} → dist-cli/index.cjs`.
- npm `eta-mu` latest — also `1.1.1`. Same version, different surface, never republished
  from the current source.
- A global `eta-mu-beta` **already existed and was dead.** It was a bare symlink in
  pnpm's global bin pointing at `/home/err/devel/orgs/open-hax/eta-mu/packages/coding-agent/dist/cli.js`
  — the pre-move repo layout, dated 2026-05-01. It has dangled since the workspace moved
  to `/home/err/spaces/eta-mu`, so `eta-mu-beta` reported `command not found`. Repaired
  2026-07-30 to point at `packages/eta-mu/dist-cli/index.cjs`. This is the second
  absolute-path integration found broken by that move; the systemd unit for the Rheos
  board server was the first.
- `pnpm link --global` on `packages/eta-mu` does **not** win: `/home/err/.volta/bin`
  precedes `/home/err/.local/share/pnpm` on `PATH`, so the volta shim keeps answering to
  the bare `eta-mu` name. Attempted and reverted; a distinct binary name is the fix, not
  a PATH fight.
- Building inside a fresh worktree **without** an installed dep tree silently produces a
  broken artifact: 163 `:undeclared-var` warnings on `await` and a `dist-cli` whose
  `receipt` / `session` / `fork-tax` handlers throw
  `Cannot read properties of undefined (reading 'cljs$core$IFn$_invoke$arity$1')`.
  The same build from the installed root emits **zero** warnings and works. A worktree
  build is not a build.

## Decision (owner, 2026-07-30)

Two names, two jobs. **`eta-mu` stays the published build** so behaviour in every other
repository on the machine remains predictable. **`eta-mu-beta` is the global entry point
to this working tree**, because the latest work should be reachable from anywhere. No PATH
reordering, no shadowing.

## Scope

- [x] Canonical dev invocation decided and documented in `DEVELOPMENT.md`
      (§ *Running the CLI: `eta-mu` vs `eta-mu-beta`*): `eta-mu-beta` symlinks to
      `packages/eta-mu/dist-cli/index.cjs`; rebuild before trusting it.
- [ ] Make `eta-mu-beta` a first-class, reproducible install rather than a hand-run `ln`:
      a documented one-liner is the floor, a repo task or a private
      `bin`-declaring package that `pnpm link --global` can own is better. It must be
      re-creatable from the repo after a machine rebuild or another workspace move.
- [ ] Teach `CLAUDE.md` the same rule, so agents stop citing `eta-mu` output as evidence
      about this repo.
- [ ] `eta-mu version` must distinguish a local build from a published install — surface
      the git SHA and dirty flag, not just the package version. Two programs must never
      report the same identity.
- [ ] `eta-mu doctor` reports which binary is answering, whether it was built from the
      current tree, and whether `dist-cli` is stale relative to `src/cljs`.
- [ ] Fail loudly on a missing build: no `dist-cli` should print a build instruction, not
      resolve through a global shim.
- [ ] Do not let `Unknown command: <x>` fall through to the agent handler and surface as an
      API-key error. Unknown commands must report themselves as unknown commands.
- [ ] Worktree ergonomics: either make `pnpm build` refuse to run without an installed dep
      tree, or make worktree setup install one. A build that emits 163 warnings and a
      broken binary while exiting `0` is the trap that started this.
- [ ] Publish, or stop shipping a version number that does not match what is published.

## Done when

An agent cannot mistake the published CLI for the working tree's, and a build that would
produce a broken binary fails instead of succeeding quietly.

## Notes

This is P0 despite being "just tooling": it silently corrupts evidence. Every CLI-derived
claim in this epic's first draft had to be retracted because of it.
