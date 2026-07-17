---
uuid: "docs-governance-rehaul-epiphany-aligned"
title: "Rehaul docs, agent instructions, and governance model — aligned to ../epiphany, tuned to eta-mu"
status: "accepted"
priority: "P1"
labels: ["docs", "governance", "process", "agents", "8sp"]
created_at: "2026-07-12T00:00:00Z"
source: "user-request:2026-07-12 (review feedback on eta-mu-agent-tools / terminal-ui-cljs-package)"
points: 8
category: "tasks"
---

# Rehaul docs, agent instructions, and governance model

> Requested during review of `eta-mu-agent-tools` and `terminal-ui-cljs-package`:
> the user wants eta-mu's documentation/governance layer restructured along the
> model established in the sibling repo `../epiphany`, tuned to eta-mu's own
> objectives — not copied verbatim. This card only scopes and opens the work;
> it does not implement the rehaul.

## Why

eta-mu currently has a flat `AGENTS.md` (126 lines) + `PROCESS.md` (251 lines)
+ `CLAUDE.md` (44 lines), no `STYLE.md`, and a `docs/` directory with only
`notes/` and `design/` — no per-directory `AGENTS.md`, no ADR layer, no
explicit authority ordering between documents. `../epiphany` (a sibling
project sharing the same author, tooling, and much of the same CLJS/kanban
machinery) has already worked through this problem and arrived at a layered,
partially tool-enforced model worth adapting rather than reinventing.

## What `../epiphany` does (surveyed 2026-07-12)

- **Three-tier authority ladder**, each document explicitly subordinate to the
  one above it:
  1. `PROCESS.md` — a **constitution**, not a workflow manual. States durable
     constraints (evidence, authority, acceptance) and *delegates* concrete
     workflow to `docs/process/*.md` policy docs. Defines a formal
     epistemic-tier lattice (`observed -> derived -> provisional -> accepted`,
     plus first-class `rejected`/`unknown`/`unavailable`/`stale` states that
     must never be conflated with success/empty) and a "required evidence by
     claim type" table. Has an explicit, bounded **exceptions mechanism** and
     a **charter-amendment procedure** that preserves prior text.
  2. `STYLE.md` — an **engineering kernel** for Clojure construction: opens
     with an executable-looking Lisp form describing the discovery/build
     cycle, defines a strict dependency-ordered layer set (`law < shape <
     extern < domain < infra`, each with a table of what it may/must not do),
     and draws a "categories vs. contracts" distinction (what kind of move
     this is, vs. whether this instance is admissible right now).
  3. `AGENTS.md` — a terse **operational guide**: commands, a namespace-law
     table, a dependency allowlist, forceful one-liner norms ("no `utils/`",
     "warnings are failed contracts"), and a routing table at the end instead
     of more prose ("where everything else lives").
- **Per-directory `AGENTS.md`.** Nearly every `docs/` subdirectory (`adrs/`,
  `archives/`, `designs/`, `inbox/`, `kanban/`, `notes/`, `research/`) has its
  own scoped `AGENTS.md` explaining what belongs there and how it's governed.
- **`receipts.edn`** — an append-only provenance ledger (actor, event,
  summary, artifacts, test totals per completed card). It operationalizes
  PROCESS.md's evidence/acceptance commitments but is **not named anywhere in
  the charter itself** — a real gap in their own setup, worth NOT repeating
  here: whatever eta-mu ends up calling its ledger should be named in the
  document that claims to require it.
- Load-bearing vs. aspirational is explicit in their own docs: namespace
  layout, `deps.edn` aliases, clj-kondo zero-warnings, the kanban FSM/CLI, and
  the ledger are tool-enforced; the full construction-cycle notation in
  `STYLE.md` is stated as an aspirational target ("valid before it compiles"),
  with an explicit instruction not to force a repo-wide shuffle just to look
  conformant.

## What's already in place in eta-mu (don't rebuild)

- `kanban/.events/ledger.edn` + the `eta-mu kanban` CLI + the `promethean` FSM
  in `packages/rheos/src/rheos/backend/law/fsm.cljs` already play the role of
  epiphany's `docs/kanban/` + board FSM.
- The `receipt-river` skill (see `CLAUDE.md`) already produces something like
  a receipts ledger — confirm where its output actually lands and whether it
  should become eta-mu's named equivalent of `receipts.edn`.
- `AGENTS.md`'s existing "Clojure House Rules" section already contains a
  namespace-law table and a construction-order description close in spirit to
  epiphany's `STYLE.md` — likely the seed to split out, not a from-scratch
  write.

## Scope of the follow-on work (to be sized when this card leaves Breakdown)

- [ ] Decide eta-mu's own authority ladder and what plays each role (does
      eta-mu need a `PROCESS.md`-as-constitution split from a
      `STYLE.md`-as-kernel, or is that over-fitting a Clojure/JVM project's
      structure onto a Node/shadow-cljs monorepo?). This should be **tuned to
      eta-mu's objectives** — keeping the current `AGENTS.md`/`PROCESS.md`
      split without adding a `STYLE.md` may be the right call, or something
      in between; it's a judgment call, not a given.
- [ ] Name eta-mu's actual provenance ledger (`kanban/.events/ledger.edn`,
      receipt-river output, or both) explicitly in whichever document claims
      to require evidence/acceptance — don't repeat epiphany's gap.
- [ ] Decide whether per-directory `AGENTS.md` (docs/notes, docs/design, and
      any new docs/ subdirectories this work creates) is worth it at eta-mu's
      current size, or premature.
- [ ] Produce a before/after diff plan reviewed with the user before large
      rewrites land — this is a governance change, not a code change; get
      explicit sign-off on the target shape first.

## Non-goals

- Do not copy `../epiphany`'s files verbatim — names, mission statements, and
  the η/μ/Π personal-operator-grammar layer (`.ημ/PRINCIPLE.edn`) are
  personal/cross-repo tooling, not project governance, and are out of scope
  here.
- Do not implement anything on this card — breakdown and scoping only.

---
Triage 2026-07-16: accepted into the funnel, but 8sp means it must cycle through breakdown before any implementation (PROCESS: 8 => continue refinement). Suggest first slice: align CLAUDE.md/AGENTS.md/PROCESS.md with the 2026-07-15 decision record on the epic (experience parity, @eta-mu scope, banned words, dissolve packages/runtime) — the docs currently still describe the voided TS-line-count ratchet world.
---
