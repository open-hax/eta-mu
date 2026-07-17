---
category: "tasks"
labels: ["tasks", "cljs", "sol", "mcp", "1sp"]
write-id: "1784325681296-0.ljxd4a2yhl5pg1c8oi"
points: "1"
source: "kanban/epics/sol-turn-processor-cutover.md"
title: "Sol — MCP Tools on the New Tool Shape (drop legacy defineTool)"
priority: "P1"
status: "in_progress"
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

## Decision record (2026-07-17, implementation pass)

- **Malli form chosen for parameters:** `[:map-of :any :any]` — Malli maps are
  open by default, so any argument object is accepted (today's
  `additionalProperties: true` stance). The descriptor carries the JSON-schema
  projection `{:type "object" :additionalProperties true}`, identical on the
  wire to the old `Type.Object({}, {additionalProperties: true})` TypeBox
  output; recorded in the `any-object-parameters` docstring.
- **New shape:** CLJS turn-processor tool descriptor
  `{:name :label :description :parameters :execute}` (the
  `eta-mu.infra.tools` registry shape; `eta-mu.turn-processor.law.tool`).
  `:execute` follows the run-loop protocol `(id args signal on-update)`,
  resolves to `{:content [{:type :text :text ...}] :details {}}`, and throws
  the collapsed text on an `isError` result so the run-loop maps it to a tool
  error — same observable behavior as the legacy `defineTool` wrapper.
- **Test seam:** `clients*` is now public (matching `session/sessions*` and
  `realtime/ws-clients*` precedent) so
  `test/cljs/open_hax/sol/infra/agent/mcp_tools_test.cljs` can seed a fake
  MCP server client; tests assert id, description passthrough, any-object
  parameters, text collapse (text/image/resource mix), args crossing as a
  plain JS object, and isError → tool error.
- Gates at decision time: `pnpm --filter @open-hax/sol test` (90 tests / 261
  assertions, 0 failures), `lint:kondo` 0 errors 0 warnings, server build 0
  warnings, grep gate clean.