---
uuid: "dissolve-runtime-package"
title: "Dissolve packages/runtime"
status: breakdown
priority: "P1"
labels: ["tasks", "cljs", "naming", "monorepo", "5sp"]
created_at: "2026-07-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 5
category: "tasks"
---

# Dissolve packages/runtime

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Decision: maintainer, 2026-07-15 — "runtime" is a banned name; the package
> is history-aligned, not domain-aligned. Dissolve rather than rename.

## Purpose

`packages/runtime` (`@open-hax/eta-mu-runtime`) is a grab-bag: `eta_mu.runtime.*`
state/envelope/planner primitives, plus `eta_mu.coding.*` legacy-compat ports
(extension runner, settings/auth infra, session domain/law, fs/git/bash
externs). Its coding externs duplicate externs that already exist in
`packages/eta-mu`; its extension runner implements the legacy extension API,
which the 2026-07-15 decision descoped. Move what the new stack needs to where
its consumers live; delete the rest.

## Definition of done

- [ ] Consumer audit recorded as a comment: every workspace package and TS
      wrapper that imports `@open-hax/eta-mu-runtime` or its CLJS namespaces,
      with keep/port/retire verdicts per namespace cluster.
- [ ] Namespaces the new stack needs (candidates: settings/auth error-policy
      infra → `packages/eta-mu`; session law → `packages/eta-mu` or
      `@eta-mu/turn-processor`) are moved next to their consumers, tests
      moving with them.
- [ ] Duplicated externs resolved: one owner per boundary, the other deleted.
- [ ] The legacy-API extension runner is retired with the package (extensions
      return CLJS-only under a future card, per the epic decision record).
- [ ] `packages/runtime` is deleted; workspace configs, CI workflows,
      boundary-scanner scripts, and docs updated; root `pnpm test` green.
- [ ] No surviving package or namespace contains the word "runtime".

## Blocked on

The consumer audit is the first work item and may reveal blockers (e.g. sol,
Rheos, or legacy TS wrappers consuming exports). Record them here; do not
force the deletion past a live consumer.

## Verification

```bash
pnpm install
pnpm test
git grep -ln "eta-mu-runtime\|eta_mu.runtime\|eta_mu/runtime" -- ':!kanban' ':!docs' ':!packages/legacy' | wc -l  # → 0
```
