---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "5sp"]
write-id: "1783693254547-0.41roov7awnx8qf9gnat"
points: "5"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Coding Agent CLJS Rewrite — Tool Domain & Law"
priority: "P0"
status: "ready"
uuid: "coding-agent-cljs-rewrite-domain-tools-law"
created_at: "2026-06-15T00:00:00Z"
---

# Coding Agent CLJS Rewrite — Tool Domain & Law

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 5

## Purpose

Port the tool descriptor and dispatch logic into ClojureScript, with Malli-guarded boundaries and regression tests for every coding-agent tool.

## Scope

- `src/core/tools/index.ts` — tool registry and dispatch
- `src/core/tools/read.ts`, `src/core/tools/edit.ts`, `src/core/tools/ls.ts`
- `src/core/tools/grep.ts`, `src/core/tools/bash.ts`, `src/core/tools/edit-diff.ts`
- `src/core/tools/path-utils.ts`, `src/core/tools/file-mutation-queue.ts`
- `src/utils/tools-manager.ts`

## Deliverables

- [ ] Malli schemas in `law.*` for all tool inputs, outputs, and call descriptors
- [ ] Pure `domain.*` functions for tool selection, argument validation, and result shaping
- [ ] `shape.*` converters for existing TS DTOs
- [ ] Regression tests for read/edit/ls/grep/bash/edit-diff and file-mutation-queue behavior

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Blocking assessment:** Blocked by inventory-core acceptance. Tool schemas and dispatch logic can be drafted in parallel with other domain tasks, but full implementation and integration tests require extern-fs-git-bash adapters and the boundary conventions from eta-mu-cljs-rewrite-boundary-adapters (done).
---