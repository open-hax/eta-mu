---
category: "tasks"
labels: ["tasks", "cljs", "sol", "mcp", "1sp"]
points: "1"
source: "kanban/epics/sol-turn-processor-cutover.md"
title: "Sol — MCP Tools on the New Tool Shape (drop legacy defineTool)"
priority: "P1"
status: "breakdown"
uuid: "sol-mcp-tools-new-tool-shape"
created_at: "2026-07-17T00:00:00Z"
---

# Sol — MCP Tools on the New Tool Shape

> Parent epic: `kanban/epics/sol-turn-processor-cutover.md`
> Small, independent of the session adapter; can land in any order before
> `sol-provider-swap-legacy-drop`.

## Purpose

`sol/infra/agent/mcp_tools.cljs` calls the legacy SDK's `defineTool` (with
a TypeBox `parameters` schema) to expose MCP server tools as eta-mu custom
tools. The new stack's tool contract is the turn-processor/eta-mu tool
descriptor shape (Malli-described, see `packages/eta-mu` `law.tools` /
`infra.tools.registry`). Re-emit MCP tools in that shape and drop the
legacy import.

## Scope

- Replace `defineTool` + TypeBox `(.Object Type ...)` with the new
  descriptor: read `packages/eta-mu` `law/tools.cljs` and
  `infra/tools/registry.cljs` first and reuse the real shape — no
  speculative re-derivation.
- Preserve current behavior: runtime id `mcp.<server-id>.<tool-name>`,
  description passthrough, MCP result content collapsed to text, isError
  mapped to a tool error, execute signature compatible with how the
  session adapter invokes tools.
- Unknown/any-object parameters stay accepted (today's
  `additionalProperties: true` stance) — record the Malli form chosen.

## Definition of done

- [ ] No `@open-hax/eta-mu-cli` or `typebox` import remains in
      `mcp_tools.cljs`.
- [ ] A test (or fixture-level assertion) builds an MCP tool against a
      fake server and executes it through the new shape, asserting id,
      description, text collapse, and error mapping.
- [ ] `pnpm --filter @open-hax/sol test` / `lint:kondo` green.

## Verification

```bash
pnpm --filter @open-hax/sol test
pnpm --filter @open-hax/sol lint:kondo
git grep -n "eta-mu-cli\|typebox" -- packages/sol/src/cljs/open_hax/sol/infra/agent/mcp_tools.cljs || true  # → 0
```
