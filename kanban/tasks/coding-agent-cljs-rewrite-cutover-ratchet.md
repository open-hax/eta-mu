---
uuid: "coding-agent-cljs-rewrite-cutover-ratchet"
title: "Coding Agent CLJS Rewrite — Cutover Ratchet"
status: "blocked"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "3sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 3
category: "tasks"
---

# Coding Agent CLJS Rewrite — Cutover Ratchet

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 3

## Purpose

Replace legacy TS modules in path-scoped commits after parity tests pass, delete obsolete code, and verify the `eta-mu` binary end-to-end.

## Scope

- Path-scoped replacement of ported `src/core/*`, `src/modes/*`, `src/cli/*`, `src/utils/*`, and `src/bun/*` modules
- Deletion of obsolete TS modules and examples in slices
- Binary verification: `eta-mu --version` and a representative command path
- TypeScript line-count ratchet for `packages/legacy/coding-agent`

## Deliverables

- [ ] TS modules replaced by CLJS facades in commits bounded to one namespace cluster at a time
- [ ] Obsolete TS modules and examples removed
- [ ] `eta-mu --version` and a representative command run through the CLJS runtime
- [ ] Monotonically decreasing TS line count for `packages/legacy/coding-agent`
- [ ] All blockers recorded if tests cannot pass

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
node scripts/ts-line-count.mjs packages/legacy/coding-agent
pnpm --dir packages/eta-mu-runtime cljs:verify
```

Final acceptance requires `pnpm --filter @open-hax/eta-mu-cli test` to pass or explicit blockers documented.

---
**Blocking assessment:** Blocked by all preceding implementation tasks: domain, extern, infra, and mode parity must be complete and tests passing before TS modules can be replaced safely.
---
