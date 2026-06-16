---
uuid: "tui-cljs-rewrite-inventory"
title: "TUI CLJS Rewrite — Inventory and Dependency Map"
status: done
priority: P0
labels: ["tasks", "cljs", "rewrite", "tui"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/tui-cljs-rewrite.md"
points: 2
category: tasks
---
# TUI CLJS Rewrite — Inventory and Dependency Map

> Parent epic: `kanban/epics/tui-cljs-rewrite.md`
> Points: 2

## Purpose

Catalog the legacy `@open-hax/eta-mu-tui` package and classify every module into the target CLJS namespace taxonomy (`domain`, `shape`, `law`, `extern`, `web`, `cli`). Identify dependencies on the coding-agent interactive mode.

## Scope

- Inventory all `packages/legacy/tui/src/**/*.ts` files and `packages/legacy/tui/test/**/*.test.ts` files.
- Map each source file to `eta_mu.tui.{domain,shape,law,extern,web,cli}.*`.
- Document coding-agent interactive mode imports and call sites.
- Flag side-effecting modules (terminal I/O, keyboard, image encoding) as `extern.*` candidates.

## Deliverables

- [x] Markdown inventory doc under `docs/tui-cljs-rewrite-inventory.md`.
- [x] Module-to-namespace table with public API surface noted.
- [x] List of coding-agent dependencies and coupling risks.
- [x] Proposed task breakdown and point estimates for remaining phases.

## Verification gate

- [ ] Inventory doc reviewed and accepted by at least one maintainer.
- [ ] No source file is unclassified.

```bash
node scripts/ts-line-count.mjs packages/legacy/tui
ls packages/legacy/tui/src/**/*.ts packages/legacy/tui/test/**/*.test.ts
```

---

Ready to decompose: inventory is a pure cataloging task with no dependencies on extern adapters or the CLJS runtime spine; it can run concurrently with core program work and informs the component port tasks.

---

**Produced:** `docs/tui-cljs-rewrite-inventory.md` catalogs all 22 source files, 21 `.test.ts` files, public exports, `packages/legacy/coding-agent` consumers, raw JS interop surfaces, and a phased task breakdown with point estimates. No source code was modified.

**Next recommended task:** Create the `eta-mu-cljs-rewrite-boundary-adapters` task/phase (if not already in progress) and begin porting the four `extern.*` modules (`terminal`, `stdin-buffer`, `terminal-image`, `keyboard`) with conversion regression tests, since component ports are blocked until those adapters land.
