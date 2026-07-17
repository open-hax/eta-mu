---
uuid: "coding-agent-cljs-rewrite-inventory-modes-cli"
title: "Coding Agent CLJS Rewrite — Modes & CLI Inventory"
status: "done"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "2sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 2
category: "tasks"
---

# Coding Agent CLJS Rewrite — Modes & CLI Inventory

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 2

## Purpose

Catalog the interactive TUI mode, RPC mode, and CLI entry points so their state machines, command routes, and public compatibility surfaces are explicit before porting.

## Scope

- `src/modes/interactive/interactive-mode.ts` and `src/modes/interactive/components/*`
- `src/modes/interactive/theme/*` and `src/modes/interactive/assets/*`
- `src/modes/rpc/*`
- `src/cli.ts`, `src/cli/*`, `src/main.ts`, `src/bun/cli.ts`
- `package.json` `bin` field and `exports`

## Deliverables

- [ ] Documented interactive mode state machine and component hierarchy
- [ ] Documented RPC mode message flow and JSONL contract
- [ ] Documented CLI argument parsing, command routing, and entry-point facades
- [ ] List of TS files that can become thin shells vs full ports
- [ ] Asset/copy rules preserved for `dist/` layout

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --filter @open-hax/eta-mu-cli test -- --run test/args.test.ts test/interactive-mode-status.test.ts test/rpc.test.ts
```

Inventory reviewed and accepted before Phase 5 work begins.

---
**Inventory produced:** `docs/coding-agent-cljs-rewrite-inventory-modes-cli.md` catalogs all 47 source files plus theme JSON/PNG assets under `src/modes/`, `src/cli/`, `src/cli.ts`, `src/main.ts`, and `src/bun/cli.ts`. For each file it records the proposed CLJS namespace, public exports, internal consumers, raw JS interop surfaces, dependency clusters, and whether the file should become a thin TS shell or a full CLJS port. It also documents the interactive mode event state machine, the RPC JSONL command protocol, and the `dist/` asset copy rules.

**Next recommended task:** Port the pure data/schema boundaries first — `src/modes/rpc/jsonl.ts`, `src/modes/rpc/rpc-types.ts`, and `src/cli/args.ts` — to establish `eta_mu.coding.law.*` Malli schemas and the JSONL contract before starting the TUI-heavy interactive mode port.
---
