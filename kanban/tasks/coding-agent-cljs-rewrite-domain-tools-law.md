---
category: "tasks"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "5sp"]
write-id: "1783693254547-0.41roov7awnx8qf9gnat"
points: "5"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Coding Agent CLJS Rewrite — Tool Domain & Law"
priority: "P0"
status: "review"
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

Board audit 2026-07-11 — moved to ready. Zero CLJS code written. inventory-core and extern-fs-git-bash blockers resolved. Pure domain/law work is actionable but not started.

Starting implementation. Surveying TS tool source and existing CLJS patterns.

Tool domain/law COMPLETE. Delivered: law/tool.cljs (270 lines), domain/tool.cljs (280 lines), shape/tool.cljs (270 lines), domain/tool_test.cljs (360 lines). All verification gates pass: clj-kondo 0 errors 0 warnings, shadow-cljs compile 0 warnings, 219 tests / 873 assertions / 0 failures, boundary scanner 0 violations. Covers: Malli schemas for all 7 coding-agent tool inputs (read/bash/edit/write/grep/find/ls), tool result/details schemas, truncation result schema. Pure domain functions for tool dispatch, active tool management, input validation/normalization, tool result construction. Shape converters for tool definitions, inputs, results, and call descriptors.
---
