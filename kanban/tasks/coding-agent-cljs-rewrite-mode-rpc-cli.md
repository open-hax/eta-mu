---
uuid: "coding-agent-cljs-rewrite-mode-rpc-cli"
title: "Coding Agent CLJS Rewrite — RPC Mode & CLI Parity"
status: "rejected"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "3sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 3
category: "tasks"
---

# Coding Agent CLJS Rewrite — RPC Mode & CLI Parity

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 3

## Purpose

Port the RPC mode, CLI argument parsing, and binary entry points to ClojureScript while preserving `eta-mu` binary behavior and output.

## Scope

- `src/modes/rpc/rpc-mode.ts`, `src/modes/rpc/rpc-client.ts`, `src/modes/rpc/jsonl.ts`, `src/modes/rpc/rpc-types.ts`
- `src/cli.ts`, `src/cli/args.ts`, `src/cli/*.ts`
- `src/main.ts`, `src/bun/cli.ts`, `src/index.ts`
- `test/rpc*.test.ts`, `test/args.test.ts`, `test/version-command-cljs-parity.test.ts`, `test/initial-message.test.ts`

## Deliverables

- [ ] CLJS RPC mode orchestration and JSONL protocol handling
- [ ] CLJS CLI argument parsing and command routing
- [ ] Thin TS shells for `src/main.ts`, `src/cli.ts`, `src/index.ts`, and `src/bun/cli.ts`
- [ ] Regression tests for RPC, args, version command, and initial message parity

## Verification gate

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
**Blocking assessment:** Blocked by inventory-modes-cli, infra-session-manager, domain-session-law, and ai-cljs-rewrite (provider parity for model resolution). CLI parity requires the underlying domain and infra surfaces to be in place.
---
