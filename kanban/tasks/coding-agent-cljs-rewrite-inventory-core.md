---
uuid: "coding-agent-cljs-rewrite-inventory-core"
title: "Coding Agent CLJS Rewrite — Core Inventory"
status: "done"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "5sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 5
category: "tasks"
---

# Coding Agent CLJS Rewrite — Core Inventory

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 5

## Purpose

Catalog the core source surface of `packages/legacy/coding-agent` and classify every file into the target namespace taxonomy (`domain`, `shape`, `law`, `infra`, `extern`, `cli`).

## Scope

- `src/index.ts`, `src/core/index.ts` public exports
- `src/core/agent-session.ts`, `src/core/agent-session-runtime.ts`, `src/core/agent-session-services.ts`
- `src/core/session-manager.ts` and `src/core/session-cwd.ts`
- `src/core/tools/*` and `src/utils/tools-manager.ts`
- `src/core/extensions/*`
- `src/core/settings-manager.ts`, `src/core/auth-storage.ts`
- `src/core/package-manager.ts`, `src/package-manager-cli.ts`
- `src/core/messages.ts`, `src/core/diagnostics.ts`, `src/core/output-guard.ts`, `src/core/exec.ts`, `src/core/bash-executor.ts`

## Deliverables

- [ ] Markdown inventory mapping each TS module to `eta_mu.coding.{domain,shape,law,infra,extern,cli}.*`
- [ ] List of every public export and its consumer
- [ ] Tool contract matrix (name, schema, side effects, tests)
- [ ] Extension contract matrix (manifest, runner API, events, tests)
- [ ] Identified dependencies on `eta-mu-runtime`, `eta-mu-agent-core`, `eta-mu-ai`, `eta-mu-tui`, `eta-mu-extensions`

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli typecheck
node scripts/ts-line-count.mjs packages/legacy/coding-agent
```

Inventory document reviewed and accepted before Phase 2 work begins.

---
**Inventory produced:** `docs/coding-agent-cljs-rewrite-inventory-core.md` catalogs every source file and public export under `packages/legacy/coding-agent/src/core/` and `src/utils/`, mapping each module to the target CLJS namespace taxonomy, listing consumers, raw JS interop surfaces, and dependencies on runtime/agent/AI/boundary packages. It also includes tool and extension contract matrices plus an external dependency map.

**Next recommended task:** Review and accept this inventory, then begin `coding-agent-cljs-rewrite-inventory-modes-cli` for `src/modes/`, `src/cli.ts`, `src/main.ts`, and `src/config.ts`.
---
