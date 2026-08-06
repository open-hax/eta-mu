---
category: "epics"
labels: ["epics", "workflow", "dsl", "katamorph", "rheos", "event-ledger", "kanban", "fsm", "architecture"]
type: "epic"
write-id: "1785355374207-0.ymn34n77q9eub8a29ku"
points: "13"
source: "grok-intention:2026-07-29; rescope:fsm-engine"
title: "Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow"
priority: "P0"
status: "incoming"
uuid: "workflow-dsl-kanban-reference"
created_at: "2026-07-29T00:00:00Z"
---

# Workflow DSL — Katamorph language, Rheos interpreter, Kanban reference workflow

> Intent recovered 2026-07-29: this is a rescope of the rejected
> `fsm-engine` family, not a rejection of finite-state-machine semantics.
> Kanban remains an FSM. The reusable system boundary is a declarative Workflow
> DSL, and the Kanban FSM becomes its first reference workflow interpreted by
> Rheos.

## Outcome

Build a data-first workflow language that can describe:

- states, events, transitions, and composition;
- triggers, derivations, actions, reactions, and observers;
- guards, contracts, evidence requirements, and authority;
- accepted/rejected decisions, deterministic folds, and reconciliation;
- materialized projections and runtime-specific adapters.

The Promethean Kanban lifecycle is authored as one workflow profile whose
authoritative state component is an FSM bound to the task `:status` port.
Rheos interprets that profile for work coordination. Markdown cards, board
snapshots, CLI output, and UI state are projections and operator interfaces.

## Constitutional split

- **Workflow/category:** defines the grammar of motion — state space, event and
  transition vocabulary, composition laws, and which transformations exist.
- **Contract:** decides whether a particular attempted motion is admissible now
  under guards, evidence, grants, policy, delivery, and side-effect obligations.
- **Executor/controller:** serializes work, resolves concurrency policy, invokes
  actions, records outcomes, and drives reconciliation to a fixpoint.

An edge existing in the workflow and a move being admissible at runtime are
separate questions.

## Ownership boundary

| Concern | Owner |
|---|---|
| Portable workflow/resource identity, schemas, references, and generic trigger/action/schedule vocabulary | Katamorph |
| Pure workflow composition, transition decision, reaction, and fold protocol | Workflow DSL/kernel; physical package boundary must be decided explicitly |
| Native work-coordination execution, pending/concurrency policy, Kanban adapter, commands, and projections | Rheos |
| Event envelope, append, ordering, idempotency, causal lineage, watch, and replay substrate | event-ledger |
| Compilation of the same portable declarations into external harness-native forms | Muse |
| Evidence observation, correlation, and derived knowledge projections | Epiphany |

Katamorph must not acquire Rheos runtime behavior. Event-ledger must not acquire
workflow payload semantics. Rheos must not become the canonical portable
declaration language.

## Reference interpretation

```text
portable workflow resource
        │
        ├── category validation: is this a declared transformation?
        ├── contract adjudication: is it admissible with this context/evidence?
        ├── accepted/rejected event appended with causal provenance
        ├── deterministic fold reconstructs accepted state
        ├── declared reactions/actions run through injected implementations
        └── Rheos rematerializes Markdown, board, CLI, and UI projections
```

For the Kanban reference profile:

- the profile owns `:status`;
- its states, edges, WIP laws, gates, and reopen paths remain an FSM;
- file or UI edits submit transition/update requests rather than bypassing law;
- accepted ledger facts, not self-reported frontmatter, determine accepted state;
- rejected requests produce evidence and canonical rematerialization rather than
  silently mutating history.

## Delivery slices

1. Decide the physical boundary between Katamorph's portable `:workflow`
   resource and the shared pure workflow kernel.
2. Complete workflow manifest/schema/reference support in Katamorph.
3. Define pure laws for category validation, contract adjudication, transition
   decisions, reactions, folds, causal roots, and semantic-event/wire-event
   codecs.
4. Implement the Rheos interpreter and event-ledger adapter without embedding
   storage behavior in domain code.
5. Express the current Promethean Kanban FSM as the first workflow resource and
   run conformance tests against the existing enforced transition graph.
6. Compose with `rheos-ledger-authoritative-projections` for canonical task folds,
   Git/worldline attribution, and Markdown `pull`/`push`/`sync`.
7. Add review, build, evidence, and harness capabilities as referenced
   implementations rather than hardwired workflow ontology.
8. Reconcile the existing `.ημ/workflows` / `scripts/ultra.bb` dialect rather
   than creating an unacknowledged third workflow language.

## Rejected-card disposition

The predecessor cards remain rejected in their stated forms. Their reusable
content is rehomed as follows:

| Predecessor | Disposition |
|---|---|
| [`fsm-config-as-data-edn`](../tasks/fsm-config-as-data-edn.md) | Portable versioned workflow resources plus a separate Rheos runtime binding; do not absorb every board/runtime concern into one universal config. |
| [`fsm-event-cascade-derivation`](../tasks/fsm-event-cascade-derivation.md) | Core trigger/predicate/derivation semantics; filesystem changes are one ingress adapter. |
| [`fsm-transition-contract-pending-lock`](../tasks/fsm-transition-contract-pending-lock.md) | Split category validation, contract adjudication, and configurable executor/concurrency policy. |
| [`fsm-ledger-fold-accepted-state`](../tasks/fsm-ledger-fold-accepted-state.md) | Superseded by the broader canonical Rheos task-fold and snapshot work. |
| [`fsm-bounce-reconciler`](../tasks/fsm-bounce-reconciler.md) | Rejection event plus rematerialization of the accepted projection; body mutation is not the universal controller behavior. |
| [`fsm-frontmatter-interface-generalization`](../tasks/fsm-frontmatter-interface-generalization.md) | Preserve per-field port/subscription insight, but make frontmatter a Markdown adapter rather than the universal workflow API. |
| [`fsm-check-agent-review`](../tasks/fsm-check-agent-review.md) | Workflow action that produces typed review evidence/verdict events. |
| [`fsm-check-code-review`](../tasks/fsm-check-code-review.md) | Reusable evidence-consuming review action, not a hardwired FSM boolean. |
| [`fsm-check-markdown-score`](../tasks/fsm-check-markdown-score.md) | Obsolete as an authoritative gate; optional advisory linter only. |
| [`fsm-check-js-agent-shell-types`](../tasks/fsm-check-js-agent-shell-types.md) | Semantic capability/action references with runtime implementations; host types are not workflow ontology. |
| [`fsm-harness-auto-verify`](../tasks/fsm-harness-auto-verify.md) | Runtime manifests, attestations, receipts, capabilities, and causal provenance instead of a hardcoded harness list. |

Delivered prior art:
[`fsm-provenance-filtering`](../tasks/fsm-provenance-filtering.md) remains done,
while the newer authority design extends it from write-ID correlation into actor,
causal-parent, Git, worktree, and worldline attribution.

## Existing work to compose, not duplicate

- `katamorph-canonical-cutover` establishes one contract language with many
  interpreters.
- `rheos-ledger-authoritative-projections` owns canonical event folds, Git
  worldlines, and materialized Markdown reconciliation.
- `.ημ/workflows/*.edn` plus `scripts/ultra.bb` are an existing generic workflow
  interpreter embryo.
- Muse's data-to-target compiler is the precedent for host-neutral declarations
  with target-specific adapters.

## Non-goals

- Renaming the Kanban FSM away or weakening lawful-hop enforcement.
- Reviving the rejected FSM epic and children verbatim.
- Making event-ledger a workflow engine.
- Making Markdown/frontmatter the source of accepted truth.
- Hardwiring `:js`, `:agent`, `:shell`, specific harnesses, or prose scoring
  heuristics into the portable language.
- Folding capability recommendations and proof/authority edges into the
  authoritative workflow graph.

## Acceptance criteria

- [ ] One canonical workflow resource shape exists with versioned schema,
      identity, references, and explicit category-versus-contract semantics.
- [ ] Katamorph validates the portable declaration without owning runtime effects.
- [ ] The Promethean Kanban lifecycle is represented as data and passes
      conformance tests against Rheos's current lawful transitions and WIP rules.
- [ ] Rheos adjudicates a transition request into a typed accepted/rejected event,
      appends it through event-ledger, and reconstructs accepted state by a pure
      deterministic fold.
- [ ] Markdown, board, CLI, and UI projections can be deleted and rebuilt without
      losing accepted workflow state.
- [ ] Triggers, actions, reviews, build gates, and harness evidence are referenced
      capabilities/contracts whose implementations are injected by a runtime.
- [ ] Causal-root, event-type codec, concurrency, retry/supersession, and durable
      retention laws are explicit and tested.
- [ ] Existing Ultra and Muse workflow dialects have a recorded convergence or
      adapter decision.
- [x] Every rejected predecessor records this epic as its successor and explains
      that the disposition is a rescope rather than a conceptual rejection.

## Intent sources

- `docs/notes/dev/katamorph-resources-fsm-contracts.md`
- `docs/architecture/contract-dialect-and-data-authority.md`
- `docs/notes/design/workspace-resources-ledgers-projections-synthesis.md`
- `docs/notes/design/rheos-ledger-authority-and-branch-projections.md`
- `kanban/epics/fsm-engine.md`, especially the 2026-06-17 reconciliation section
- `spaces/katamorph`: existing `:workflow` registry seam
- historical Knoxx workflow-contract kernel and actions/workflows/triggers notes
- historical Promethean Kanban-as-FSM design
- Fork Tales receipts/gates/forks/witnesses as mnemonic corroboration, not sole
  specification authority

---
Created from the 2026-07-29 intent-recovery pass. This epic is the canonical successor to fsm-engine: workflow is the reusable abstraction; the Promethean Kanban lifecycle remains an FSM and becomes the first Rheos-interpreted reference workflow. Predecessors remain rejected only in their stated package/mechanism boundaries.

---
