---
original_name: null
title: "Muse and Keryx Runtime-Compiler Reconciliation"
summary: "Classifies eta-mu's Keryx note cluster as source material for Muse and eta-mu-native implementations rather than a second universal harness compiler."
category: "design"
created: "2026-07-26"
status: "decision candidate"
sources:
  - "docs/notes/INDEX.md#keryx-opencode-interpreter-and-declaration-assembly"
  - "docs/notes/design/keryx-package-proposal.md"
  - "docs/notes/design/opencode-first-agent-runtime.md"
  - "docs/notes/design/keryx-role-extern-boundary.md"
  - "docs/architecture/contract-dialect-and-data-authority.md"
external_sources:
  - "octave-commons/muse"
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

The accepted cross-repository architecture now assigns substantially the same
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

## Proposed classification

Keryx should not be treated as a second top-level system. Classify each note or
implementation under one of four roles:

### 1. Muse language/compiler requirement

Portable declaration assembly, profile selection, capability linking, loss
diagnostics, target generation, and tools/hooks/plugins belong in Muse or in a
shared contract consumed by Muse.

### 2. Muse OpenCode target implementation

OpenCode-specific decoding, encoding, plugin packaging, configuration layout,
and target tests may become a Muse OpenCode adapter/package. The Keryx name may
remain as the adapter's internal role vocabulary if it remains useful.

### 3. eta-mu-native interpreter implementation

Sol/Rheos/native eta-mu runtime code that executes the same Katamorph semantics
without compiling to an external harness belongs in eta-mu. It should conform to
the same capability and exposure laws rather than sharing arbitrary Keryx
internals.

### 4. Historical naming or exploratory material

Naming exercises, abandoned package boundaries, and prompt/PR instructions
remain historical notes. They can inform lineage without governing current
implementation.

## Boundary rule

```text
Katamorph owns semantic resources.
Muse owns portable target compilation and host compatibility.
eta-mu owns native runtime implementations and conformance fixtures.
A target adapter may live in Muse even when eta-mu supplies executable handlers.
```

No repository should infer ownership merely because a prototype was first built
there.

## Migration questions

- Which Keryx code currently exists, and which notes describe only intended
  implementation?
- Can the existing OpenCode pipeline be moved or adapted into Muse without
  changing its observable target artifacts?
- Which schemas duplicate Muse's current DSL versus Katamorph's resource
  registry?
- Should `Keryx` remain the name of Muse's OpenCode adapter, an eta-mu-native
  role, or only historical vocabulary?
- What round-trip and loss-reporting fixtures prove that the migration preserves
  declared behavior?

## Acceptance path

This note is a `decision candidate`, not the decision itself. Resolve it through
an explicit cross-repository design/ADR or accepted migration plan after
inventorying actual Keryx and Muse code. Until then:

- do not add a new universal compiler surface under Keryx;
- preserve the notes and prototypes;
- route new portable target-compilation work toward Muse;
- mark host-specific or native-runtime work by its actual implementation role.
