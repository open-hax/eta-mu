---
uuid: "eta-mu-quality-ratchet-extension-warning-cleanup"
title: "Eta-mu Quality Ratchet — Extension Warning Cleanup"
status: todo
priority: P0
labels: ["tasks", "quality", "cljs", "warnings", "eta-mu-extensions", "5sp"]
created_at: "2026-05-31T00:45:00Z"
source: "kanban/epics/eta-mu-quality-ratchet.md"
points: 5
category: tasks
---

# Eta-mu Quality Ratchet — Extension Warning Cleanup

> Parent epic: `kanban/epics/eta-mu-quality-ratchet.md`
> Points: 5

## Purpose

Make `packages/eta-mu-extensions` builds stop normalizing CLJS infer warnings as background noise.

## Scope

- `packages/eta-mu-extensions/src/eta_mu/extensions/task_timing.cljs`
- `packages/eta-mu-extensions/lib/eta_mu/opencode.cljs`
- shadow-cljs warning output for extension release builds
- warning-ratchet documentation or scanner if zero warnings cannot land in one slice

## Work items

- [ ] Reproduce current extension warning output from a clean checkout.
- [ ] Fix target inference warnings by adding type hints, extracting JS interop helpers, or moving raw host access behind named adapter helpers.
- [ ] Avoid broad rewrites of extension behavior.
- [ ] Add a narrow warning assertion or documented baseline so warnings cannot grow silently.
- [ ] Keep generated `dist/` artifacts out of source commits unless the task explicitly requires them.

## Acceptance criteria

- [ ] `pnpm --dir packages/eta-mu-extensions build` emits zero warnings, or any remaining warning is captured in a blocker ledger with owner and rationale.
- [ ] `pnpm --dir packages/eta-mu-extensions test` passes.
- [ ] OpenCode review confirms no behavior drift in extension registration.
- [ ] No unrelated workspace dirt is staged.

## Verification

```bash
pnpm install --offline --frozen-lockfile
pnpm --dir packages/eta-mu-extensions test
pnpm --dir packages/eta-mu-extensions build
git diff --check
```
