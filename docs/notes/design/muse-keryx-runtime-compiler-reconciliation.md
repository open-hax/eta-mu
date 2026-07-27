---
original_name: null
title: "Muse and Keryx Runtime-Compiler Reconciliation"
summary: "Resolves eta-mu's Keryx note cluster as source material for Muse and eta-mu-native implementations rather than a second universal harness compiler."
category: "design"
created: "2026-07-26"
status: "accepted"
resolved: "2026-07-26"
sources:
  - "docs/notes/INDEX.md#keryx-opencode-interpreter-and-declaration-assembly"
  - "docs/notes/design/keryx-package-proposal.md"
  - "docs/notes/design/opencode-first-agent-runtime.md"
  - "docs/notes/design/keryx-role-extern-boundary.md"
  - "docs/architecture/contract-dialect-and-data-authority.md"
external_sources:
  - "octave-commons/muse:docs/architecture/compatibility-boundary.md"
  - "octave-commons/muse@e9f3f0fb056f9b0413868923ddfd0c18e16b7cee"
  - "octave-commons/muse@76c57712a48ef48100259231a2e9d54069c2b14a"
---

# Muse and Keryx Runtime-Compiler Reconciliation

## Observation

The eta-mu notes index groups thirteen Keryx artifacts covering:

- declaration assembly;
- tools, hooks, and plugins;
- capability interpretation;
- OpenCode EDN configuration;
- TypeScript declaration emission;
- host/CLJS boundary discipline;
- a runtime IR with OpenCode as the first target;
- package and namespace naming.

The accepted cross-repository architecture assigns substantially the same
portable responsibility to Muse: consume Katamorph resources, link capability
implementations and exposures, and compile harness-native artifacts for
OpenCode, Claude, Codex, eta-mu-native, MCP, and later targets.

## Problem

Without an explicit disposition, the notes can be read as authority to build a
second universal compiler inside eta-mu. That would recreate the duplication the
architecture record is trying to remove:

```text
Katamorph resources
   -> Keryx compiler in eta-mu
   -> Muse compiler in its own repo
   -> host-specific artifacts
```

The duplication is conceptual even where the current code differs.

## Classification

Keryx is not a second top-level system. Classify each note or implementation
under one of four roles:

### 1. Muse language/compiler requirement

Portable declaration assembly, profile selection, capability linking, loss
diagnostics, target generation, and tools/hooks/plugins belong in Muse or in a
shared contract consumed by Muse.

### 2. Muse OpenCode target implementation

OpenCode-specific decoding, encoding, plugin packaging, configuration layout,
and target tests belong in Muse's OpenCode adapter. Keryx terminology may remain
in historical notes, but it does not name a separate compiler authority.

### 3. eta-mu-native interpreter implementation

Sol/Rheos/native eta-mu runtime code that executes the same Katamorph semantics
without compiling to an external harness belongs in eta-mu. It conforms to the
same capability and exposure laws without sharing arbitrary Muse internals.

### 4. Historical naming or exploratory material

Naming exercises, abandoned package boundaries, and prompt/PR instructions
remain historical notes. They inform lineage without governing current
implementation.

## Boundary rule

```text
Katamorph owns semantic resources.
Muse owns portable target compilation and host compatibility.
eta-mu owns native runtime implementations and conformance fixtures.
A target adapter may live in Muse even when eta-mu supplies executable handlers.
```

No repository infers ownership merely because a prototype was first built
there.

## Code inventory and resolution

The code inventory resolves the original decision candidate:

1. At `open-hax/eta-mu@d904daecc99775a8d9fa9e40eccb0c35a121926d`,
   Keryx appears as design and historical note material. No separately landed
   Keryx compiler package or namespace was observed.
2. Muse's accepted compatibility boundary explicitly records Muse as the
   compiler/linker and classifies embedded actor, task, and ledger code as
   bootstrap, conformance, or migration residue rather than repository
   authority.
3. Muse commit `e9f3f0fb056f9b0413868923ddfd0c18e16b7cee` replaced the
   generated blocking actor monitor with non-blocking watch registration,
   resumable status, cancellation, durable terminal events, and projections for
   OpenCode, Claude, and MCP.
4. Muse commit `76c57712a48ef48100259231a2e9d54069c2b14a` added separate
   capability, implementation, and exposure descriptors, validated their
   references, and retained `deftool` as a compatibility projection over the
   separated model.
5. The current Muse DSL still uses Muse-local descriptor records and legacy flat
   tool projections. Canonical Katamorph schema integration, explicit loss
   reporting, and broad cross-target parity fixtures remain migration work; they
   do not reopen the ownership decision.

## Resolved questions

- **Which Keryx code exists?** No landed eta-mu Keryx compiler was observed; the
  indexed material is intended design, target-specific requirements, and naming
  history.
- **Where does the OpenCode pipeline belong?** In Muse's OpenCode target adapter.
  There is no eta-mu Keryx implementation that must be preserved as a competing
  compiler.
- **Which schema owns semantics?** Katamorph remains the intended semantic
  authority. Muse may retain additive compatibility descriptors while it moves
  from local shapes to shared versioned resources.
- **What does Keryx name now?** Historical vocabulary and lineage only. Reusing
  it for an internal adapter role would require an explicit reason and must not
  imply a separate compiler system.
- **What proves migration safety?** Current Muse tests cover async actor-watch
  projection and descriptor-linking compatibility. General loss diagnostics,
  round-trip fixtures, and generated-artifact parity remain required before
  compatibility shims are removed.

## Decision

The reconciliation is accepted:

- do not create a universal Keryx compiler or top-level Keryx package in eta-mu;
- route portable declaration, linking, profile, and target-compilation work to
  Muse;
- route OpenCode-specific behavior to Muse's OpenCode adapter;
- route native session, actor, event, and workflow semantics to Sol, Rheos,
  event-ledger, or the applicable eta-mu runtime module;
- preserve the Keryx note corpus as provenance and requirement lineage;
- require a new explicit cross-repository decision before assigning Keryx any
  active system boundary.

## Remaining migration work

1. Replace or consume Muse's embedded actor/task/event implementations from their
   authoritative runtime packages while retaining target fixtures.
2. Bind Muse capability, implementation, exposure, and profile descriptors to
   versioned Katamorph resources or document the exact compatibility adapter.
3. Emit explicit diagnostics for semantics a target cannot preserve.
4. Add cross-target fixtures proving equivalent declared behavior for OpenCode,
   Claude, MCP, and eta-mu-native projections.
5. Remove legacy flat-tool and embedded-runtime shims only after artifact parity
   and migration evidence are recorded.
