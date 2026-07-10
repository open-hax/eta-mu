---
uuid: "fsm-engine"
title: "Config-Driven FSM Engine"
status: "breakdown"
priority: "P1"
labels: ["epics", "cljs", "fsm", "kanban", "pluggable-checks"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
points: 13
category: "epics"
---

# Config-Driven FSM Engine

## Purpose

Generic FSM engine that reads state/transition/check definitions from board config. Any board can define any workflow.

## Default FSM (6-state)

```
incoming → breakdown → ready → in_progress → review → done
```

### Transition checks

| Transition | Check | Description |
|---|---|---|
| incoming → breakdown | markdown-score | Heuristic: headers, objectives, acceptance criteria, code blocks |
| breakdown → ready | agent-review | Agent via sol, 4 metrics (consistency, clarity, completeness, conciseness) |
| ready → in_progress | wip-available | Target column has capacity |
| in_progress → review | build-gate | `npm run typecheck && npm run lint && npm run test` |
| review → done | code-review | Agent review via harness |

### Harness field

```yaml
harness: opencode|eta-mu|pi|claude|hermes|codex|other
session-id: "abc123"
```

Known harnesses get auto-verified. `other` gets a warning.

### Check types

| Type | Runtime |
|---|---|
| built-in | Engine (has-title?, wip-available?, always-allow?) |
| js | CLJS module loaded via shadow-cljs |
| agent | Calls sol |
| shell | Runs command |

### Markdown structure scorer

Char count default, `ITokenizer` protocol for pluggable tokenizers.

## Full promethean FSM (optional)

Boards opt in with `"fsm": "promethean"` — 14-state FSM from `promethean/docs/agile/process.md`.

## Constraints

- All code in CLJS
- `^:async`/`await` pattern (no js-await, no .then chains)
- Event ledger appends on every transition

## Reconciliation Architecture (2026-06-17)

The engine is a **reconciliation loop**, not a synchronous write-path gate. The
ledger fold is the source of truth; card frontmatter is *desired state + the only
writable input port*. The board is a projection grouped by accepted status.
Workflows are trigger/action contracts that accept or reject a proposed status,
and the **bounce** is the controller correcting drift back to the fixpoint.

### Event cascade

Each arrow is a trigger = `(predicate, derivation)`, refining a rawer event into
a more semantic one:

```
fs.changed {path}
  │  predicate: markdown w/ frontmatter
  ▼
doc.frontmatter-updated {task-id, prev-fm, next-fm}      ; prev-fm folded from ledger
  │  predicate: :status ∈ changed-keys
  ▼
workflow.transition-requested {task-id, from=ACCEPTED, to=PROPOSED}
  │  evaluate contract (edge? gates? — checks may be async)
  ├─► workflow.transition-pending     (single in-flight lock per task-id)
  ├─► workflow.transition-accepted {from, to}   ; ACCEPTED := to. Triggers nothing.
  └─► workflow.transition-rejected {from, attempted-to, reasons}
        │  bounce trigger
        ▼  restore frontmatter :status to last blessed value; append reasons to body
      fs.changed → … → transition-requested {from=X, to=X} → fixpoint, dies
```

### Invariants

- **Source of truth:** accepted state = fold of `transition-accepted` over the
  ledger. Frontmatter self-description (`:status-accepted`) is opt-in per
  workflow; absent that, only the fold knows the accepted state.
  `kanban.drift-detected` is retired into `transition-requested` — drift is the
  request, not an anomaly.
- **Loop termination is structural:** `transition-requested` only does real work
  when `from ≠ to` and an edge exists. Every reconciliation/accept write lands on
  the `from == to` fixpoint and dies. No write-suppression needed for correctness.
- **Bounce target = last workflow-blessed status:** idle ⇒ accepted (`from`);
  pending ⇒ the pending `to` (a stray edit must not cancel an in-flight
  transition); final reject ⇒ accepted.
- **Pending is workflow-owned:** the engine's only pending concept is the
  single-in-flight lock per task-id. What pending *looks like* in frontmatter is
  the workflow's choice. Any status change while pending ⇒ immediate
  `transition-rejected` + bounce.
- **`transition-accepted` triggers nothing** because `ACCEPTED := to` lands in
  the fold before (or atomically with) the workflow's frontmatter write, so that
  write is a fixpoint. Ordering is the invariant.
- **Provenance is authoritative for self-writes:** the engine distinguishes its
  own/workflow writes from external edits via `:write-id` + `:causal/root` and
  does not re-adjudicate its own causal descendants. The fixpoint is the safety
  net, not the primary mechanism. (Decided 2026-06-17: provenance over
  fixpoint-only — a multi-step transition writing an intermediate `:status`
  would self-trip under fixpoint-only.)
- **Frontmatter-as-interface:** `doc.frontmatter-updated` carries the full key
  diff; each workflow subscribes to the keys it owns. `:status` → the kanban FSM;
  other keys are ports for other workflows. The kanban board is just the view
  bound to the `:status` port.

### Config-as-data

`.kanban` config and the FSM/workflow definitions are absorbed into `.eta-mu` as
edn: FSM states/transitions/checks and trigger/action contracts are all data. The
ledger is edn; frontmatter is the only live mutable surface.

## Subtasks

Reconciliation engine (2026-06-17):
- [event derivation cascade](../tasks/fsm-event-cascade-derivation.md)
- [ledger fold + frontmatter projection](../tasks/fsm-ledger-fold-accepted-state.md)
- [transition contract + pending lock](../tasks/fsm-transition-contract-pending-lock.md)
- [bounce reconciler](../tasks/fsm-bounce-reconciler.md)
- [provenance filtering of self-writes](../tasks/fsm-provenance-filtering.md)
- [config-as-data edn](../tasks/fsm-config-as-data-edn.md)
- [frontmatter-as-interface (per-field ports)](../tasks/fsm-frontmatter-interface-generalization.md)

Pluggable checks:
- [markdown-score](../tasks/fsm-check-markdown-score.md)
- [agent-review](../tasks/fsm-check-agent-review.md)
- [code-review](../tasks/fsm-check-code-review.md)
- [js/agent/shell check types](../tasks/fsm-check-js-agent-shell-types.md)
- [harness auto-verify](../tasks/fsm-harness-auto-verify.md)

---
**Board audit 2026-06-12 — bounced done → review.** This epic is NOT done. `fsm.cljs` defines the FSMs and a pure `evaluate-transition` with unit tests, but the engine is wired into nothing: neither the server nor the CLI ever called it, and `config.cljs` never attached an FSM to a project. The transition checks (markdown-score, agent-review, build-gate, code-review) are `{:type :built-in}` stubs that always allow; the js/agent/shell check types and harness auto-verification do not exist. Because enforcement was never live, agents hand-edited cards straight into `done` — this card failing is the root cause of this whole audit. Remaining: wire `evaluate-transition` into the single write path, implement at least one real check, attach FSM via config, integration test.
---

**Session 2026-06-13 progress.** NOW DONE: the FSM is wired into the single enforced write path (server status POST + CLI `move`), attached via config (`fsm: promethean`), and tested (multi-hop incoming/accepted→done rejected, done→review reopen allowed). REMAINING for done: the transition checks are still `:always-allow`/`:wip-available` only — markdown-score / agent-review / build-gate / code-review and the js/agent/shell check types + harness auto-verify are unimplemented stubs. Moved review → todo (enforcement real, pluggable checks not).

---
Bounced back to breakdown: epic is marked todo but enforcement is already live; remaining scope (pluggable checks markdown-score/agent-review/code-review, js/agent/shell check types, harness auto-verify) is too large and undefined for a single card. Splitting into incoming subtasks. --tasks-dir /home/err/devel/orgs/open-hax/eta-mu/kanban
---
