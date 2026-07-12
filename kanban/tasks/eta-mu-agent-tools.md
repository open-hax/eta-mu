---
uuid: "eta-mu-agent-tools"
title: "Eta-mu Agent Tools — read, bash, edit, write"
status: ready
priority: "P0"
labels: ["tasks", "cljs", "coding-agent", "eta-mu", "5sp"]
created_at: "2026-07-12T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 5
category: "tasks"
---
# Eta-mu Agent Tools — read, bash, edit, write

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Decision record: `docs/cljs-runtime-rewrite-architecture-inventory.md` § Decision record (2026-07-12)

## Purpose

The CLJS `eta-mu agent` command currently runs with `:tools []`
(`packages/eta-mu/src/cljs/eta_mu/infra/cli/commands/agent.cljs:27`). The
published stable eta-mu ships read, bash, edit, and write tools; without them
the agent cannot do coding work. This is the single largest parity gap toward
`npm install -g eta-mu`.

## Scope

- Tool definitions as data maps (`{:name :description :parameters :execute}`)
  per the Knoxx tool law, consumable by `eta-mu.turn-processor.infra.loop`.
- `read` — file read with offset/limit truncation.
- `bash` — command execution with timeout and output truncation
  (via `eta-mu.extern.child-process`).
- `edit` — exact-string replacement with uniqueness check.
- `write` — file create/overwrite.
- Wire the tool vector into the agent command and REPL.

No TS interop, no legacy schema compatibility. Reference behavior only:
`packages/legacy/coding-agent/src/core/tools/*`.

## Acceptance criteria

- [ ] All four tools registered in the agent command's tool vector.
- [ ] Tool results round-trip through the turn-processor loop against a live
      OpenAI-compatible endpoint (proxy) in a manual smoke.
- [ ] Each tool has law schemas and unit tests (happy path + one failure mode).
- [ ] `pnpm -C packages/eta-mu test` and `lint:kondo` pass with zero warnings.

## Verification

```bash
pnpm -C packages/eta-mu test
pnpm -C packages/eta-mu lint:kondo
```
