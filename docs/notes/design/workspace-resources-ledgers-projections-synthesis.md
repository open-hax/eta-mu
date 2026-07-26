---
original_name: null
title: "Workspace Resources, Ledgers, and Projections — Synthesis"
summary: "Distills recurring eta-mu notes into a bounded workspace model: declared resources, append-only ledgers, rebuildable projections, and task-shaped repository views."
category: "design"
created: "2026-07-26"
sources:
  - "docs/notes/dev/katamorph-resources-fsm-contracts.md"
  - "docs/notes/design/eta-mu-worlds-projections-ledger-design.md"
  - "docs/notes/design/eta-mu-init-experience-vision.md"
  - "docs/architecture/contract-dialect-and-data-authority.md"
status: "design intent"
---

# Workspace Resources, Ledgers, and Projections — Synthesis

## Purpose

This note extracts the smallest stable model recurring across the source notes.
It does not replace the original transcripts or vision script. The long
`eta-mu-worlds-projections-ledger-design.md` file remains historical source
material, including its unresolved metadata conflict markers; this note is the
bounded working representation to use for current reasoning.

## Stable model

A `.ημ/` operating context contains three logically distinct classes of data:

```text
resources
  declarative identities, contracts, policies, manifests, capabilities,
  actors, modules, drivers, and workflow definitions

ledgers
  append-only records of operations, messages, transitions, receipts,
  sessions, tool activity, observations, and decisions

projections
  rebuildable current views derived from one or more resources and ledgers:
  board state, session context, search indices, graph views, status, and UI
```

The distinction is about authority and change semantics, not necessarily three
physical directories or databases.

## Worlds and projections

The source transcript uses **world** for a reproducible multi-repository working
set and **projection** for a task-shaped view of that set.

A world may bind:

- repositories and repository families;
- exact paths and submodule edges;
- pinned revisions or branch policies;
- contract/resource roots;
- available runtime services and actors.

A workspace projection selects the subset needed for one task, session, actor,
or product surface. It should not rewrite or duplicate the underlying world.

This vocabulary is compatible with Epiphany's evidence projections but should
not be conflated with them:

- an eta-mu workspace projection selects operational context;
- an Epiphany projection derives a search, graph, timeline, or context view from
  canonical and durable evidence.

A context packet may combine both: it is produced from an Epiphany projection
for an actor operating inside an eta-mu workspace projection.

## Runtime interpretation

Resources become operational only through interpreters and implementations.
The old note proposes drivers/modules as resources so Katamorph can describe
runtime dependencies. The current architecture narrows the ownership:

- Katamorph defines portable resource and capability semantics;
- implementing packages own executable handlers and drivers;
- Muse compiles implementations/exposures into harness-native forms;
- Sol and Rheos interpret native agent and workflow resources;
- event-ledger owns the common append boundary;
- Epiphany observes sources and builds evidence-governed projections.

A resource declaration must not imply that Katamorph itself dynamically loads
arbitrary dependencies. Runtime/module loading requires an explicit
implementation and authority boundary.

## FSM implication

A workflow FSM is primarily resource data plus ledger interpretation:

```text
transition request event
  -> validate actor/grant/policy/current state
  -> evaluate transition contract
  -> append accepted or rejected transition event
  -> rebuild current board/work projection
  -> trigger declared reactions
```

The projected state is not the authoritative transition history. Direct file
edits or UI actions are adapters that submit transition requests; they do not
bypass the same laws.

## Product implication

The `eta-mu init` vision is best understood as composition discovery and
proposal, not silent autonomous mutation. A responsible initialization flow
should:

1. observe Git/package/runtime/workflow facts;
2. propose resource manifests and integrations;
3. preserve exact source evidence;
4. identify which changes require operator acceptance;
5. initialize ledgers and projections only through explicit, reversible steps;
6. report unsupported or lossy harness integrations.

The desired experience remains useful, but automatic commits, submodule edits,
workflow rewrites, or skill promotion require policy and acceptance boundaries.

## Open decisions

- The canonical workspace/world manifest contract and its owner.
- Whether `world` remains product vocabulary or becomes a formal Katamorph
  resource kind.
- The boundary between a Katamorph module declaration and a Muse/runtime
  implementation resource.
- How workspace projections reference Epiphany context-query profiles.
- Which initialization proposals may be accepted as a batch and which require
  separate review.

## Disposition

`design intent`. This note should inform workspace manifest, product-composition,
FSM, and initialization designs. The original notes remain source records and
should not be deleted or silently rewritten.
