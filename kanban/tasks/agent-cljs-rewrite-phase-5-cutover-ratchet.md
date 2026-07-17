---
uuid: "agent-cljs-rewrite-phase-5-cutover-ratchet"
title: "Agent CLJS Rewrite — Cutover Ratchet"
status: icebox
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "agent"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/agent-cljs-rewrite.md"
points: 2
category: "tasks"
---
# Agent CLJS Rewrite — Cutover Ratchet

> Parent epic: `kanban/epics/agent-cljs-rewrite.md`
> Phase: 5
> Points: 2

## Purpose

Replace remaining TypeScript call sites with CLJS-backed implementations, delete obsolete TS modules, and lock in the build/test gates so the agent package cannot regress back to TypeScript.

## Scope

- Path-scoped replacement of internal TS call sites
- Deletion of obsolete TS modules once parity tests pass
- Documentation updates for the new CLJS-first structure
- Final verification of package build, test, and TypeScript line-count gates

## Work items

- [ ] Replace TS call sites only after parity tests pass.
- [ ] Delete obsolete TS modules in path-scoped commits.
- [ ] Update `README.md` and package docs for CLJS-first namespaces.
- [ ] Confirm total TypeScript line count for `packages/legacy/agent` does not increase.
- [ ] Record any explicit blockers for tests that cannot yet pass.

## Acceptance criteria

- [ ] Remaining internal consumers use CLJS-backed agent APIs.
- [ ] Obsolete TS modules are removed or justified as retained facades.
- [ ] Package build, typecheck, and test gates pass.
- [ ] TypeScript line count for `packages/legacy/agent` is flat or lower.

## Verification

```bash
pnpm --filter @open-hax/eta-mu-agent-core test
pnpm --filter @open-hax/eta-mu-agent-core typecheck
node scripts/ts-line-count.mjs packages/legacy/agent
pnpm --dir packages/eta-mu-runtime cljs:verify
```

---
Blocked by `agent-cljs-rewrite-phase-4-infra-cli`: cutover requires the CLJS-backed infra, shape, and CLI facade to exist and pass parity tests before TS modules are removed.
---
