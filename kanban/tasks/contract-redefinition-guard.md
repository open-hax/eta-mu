---
category: "tasks"
labels: ["tasks", "cljs", "katamorph", "lint", "enforcement", "2sp"]
write-id: "1784490332464-0.0d543hw943khckj53bkw"
points: "2"
source: "kanban/epics/katamorph-canonical-cutover.md"
title: "Contract Redefinition Guard — fail the gate when a consumer redefines katamorph-owned schemas"
priority: "P1"
status: "in_progress"
uuid: "contract-redefinition-guard"
created_at: "2026-07-19T00:00:00Z"
---

# Contract Redefinition Guard

> Parent epic: `kanban/epics/katamorph-canonical-cutover.md`

## Purpose

The survey's core lesson: contract discipline survived only in muse, where
the data pipeline is load-bearing (the build fails without it); in sol/knoxx
the contracts were optional, so agents redefined schemas locally and drifted.
Documentation does not prevent recurrence — a failing check does. Add a
guard that fails a consumer package's gate when it defines a schema name
katamorph owns.

## Scope

- Mechanism (pick the simplest that fails loudly; record the choice):
  a) a clj-kondo custom hook/config in `packages/kondo-config` flagging
     `def`s whose names collide with the katamorph-owned set, or
  b) a small script (bb or node) in the repo root that greps consumer
     packages for `(def <KatamorphOwnedName> ...)` patterns, wired into the
     package `lint` scripts.
- The owned-name list should be derived from `katamorph.schema`'s `registry`
  (~25 contract names: `AgentContract`, `ModelContract`,
  `CapabilityContract`, `PolicyContract`, ...), not hand-maintained — or if
  hand-maintained, a test must fail when it diverges from the registry.
- Applies to `packages/sol` now; structured so other packages opt in by
  adding the check to their lint script.
- An explicit escape hatch (e.g. a marker comment) for the legitimate
  registry-merge extension namespace from `sol-katamorph-schema-cutover`.

## Definition of done

- [ ] Reintroducing a `ModelContract` def in `packages/sol` (throwaway test)
      fails sol's lint/test gate with a message naming katamorph as canon.
- [ ] The owned-name list is registry-derived or divergence-tested.
- [ ] Zero false positives on the current tree: full sol gate green.
- [ ] Documented in one place (AGENTS.md or the guard's own header) in ≤10
      lines: what it checks, how to extend legitimately.

## Verification

```bash
pnpm --filter @eta-mu/sol lint:kondo && pnpm --filter @eta-mu/sol test
# + demonstrated red run with a planted duplicate def, then removed
```