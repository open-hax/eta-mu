---
uuid: "coding-agent-cljs-rewrite-extern-fs-git-bash"
title: "Coding Agent CLJS Rewrite — FS, Git & Bash Extern Adapters"
status: done
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "5sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 5
category: "tasks"
---
# Coding Agent CLJS Rewrite — FS, Git & Bash Extern Adapters

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 5

## Purpose

Create `eta_mu.coding.extern.*` namespaces for all filesystem, git, process, and path I/O used by the coding agent.

## Scope

- `src/utils/fs-watch.ts`, `src/utils/paths.ts`, `src/utils/shell.ts`
- `src/utils/git.ts`, `src/utils/child-process.ts`
- `src/utils/frontmatter.ts`, `src/utils/changelog.ts`
- `src/core/session-cwd.ts` I/O side
- Proper-lockfile usage in session manager

## Deliverables

- [x] CLJS extern namespaces for FS, git, bash/child-process, shell, paths, fs-watch, and lockfile
- [x] Explicit effect boundaries aligned with `eta-mu-runtime` boundary conventions
- [x] Conversion regression tests for every adapter used by the existing test suite
- [x] No raw Node interop outside `extern.*` namespaces

## Review

Verification completed successfully:

- `pnpm --dir packages/runtime cljs:verify` passed (compile, test, smoke, boundary)
  - 139 tests, 602 assertions, 0 failures, 0 errors
  - Boundary scanner: 73 files checked, 19 extern namespaces, 0 violations
- `pnpm --filter @open-hax/eta-mu-cli test` passed
  - 110 test files passed, 1120 tests passed
- No raw Node interop outside `eta-mu.coding.extern.*` namespaces
- Coding boundary inventory registered in `eta-mu.coding.infra.boundary`

Delivered adapters:
- `eta-mu.coding.extern.path`
- `eta-mu.coding.extern.fs`
- `eta-mu.coding.extern.process-exec`
- `eta-mu.coding.extern.git`
- `eta-mu.coding.extern.shell`
- `eta-mu.coding.extern.lockfile`
- `eta-mu.coding.extern.fs-watch`

Remaining blocked infra work (outside this task):
- `eta-mu.coding.extern.frontmatter` / `eta-mu.coding.shape.changelog`
- `eta-mu.coding.domain.session-cwd` I/O integration
- `eta-mu.coding.infra.session-manager` lockfile consumer wiring


## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Blocking assessment:** Blocked by inventory-core acceptance and by eta-mu-cljs-rewrite-boundary-adapters (in progress). FS/git/process conventions and the runtime boundary scanner must be finalized before coding-agent adapters can be built safely. Runtime state/envelope primitives are ready.
---
