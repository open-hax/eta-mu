---
uuid: "tui-cljs-rewrite-facade-cutover"
title: "TUI CLJS Rewrite — CLI Facade and TS Cutover"
status: "blocked"
priority: "P1"
labels: ["tasks", "cljs", "rewrite", "tui"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/tui-cljs-rewrite.md"
points: 3
category: "tasks"
---

# TUI CLJS Rewrite — CLI Facade and TS Cutover

> Parent epic: `kanban/epics/tui-cljs-rewrite.md`
> Points: 3

## Purpose

Provide a thin TypeScript compatibility facade and remove obsolete legacy modules once parity tests pass.

## Scope

- Keep `packages/legacy/tui/src/index.ts` as a thin TS shell delegating to the CLJS build.
- Update package exports/types to point at the CLJS-backed build artifacts.
- Delete obsolete TS source modules after verification.
- Ensure `coding-agent` interactive mode can consume the CLJS TUI package.

## Deliverables

- [ ] Updated `src/index.ts` compatibility facade.
- [ ] Deleted obsolete TS modules.
- [ ] Verification that coding-agent interactive mode imports work.

## Verification gate

- [ ] `pnpm --filter @open-hax/eta-mu-tui test` passes.
- [ ] `pnpm --filter @open-hax/eta-mu-tui typecheck` passes.
- [ ] `node scripts/ts-line-count.mjs packages/legacy/tui` shows reduced line count.
- [ ] `pnpm --dir packages/eta-mu-runtime cljs:verify` passes.

```bash
pnpm --filter @open-hax/eta-mu-tui test
pnpm --filter @open-hax/eta-mu-tui typecheck
node scripts/ts-line-count.mjs packages/legacy/tui
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
Blocked by `tui-cljs-rewrite-test-parity` and `eta-mu-cljs-runtime-rewrite` (core program): the compatibility facade and TypeScript cutover require passing parity tests and a stable CLJS runtime spine first.
---
