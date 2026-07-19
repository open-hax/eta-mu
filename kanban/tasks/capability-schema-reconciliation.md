---
category: "tasks"
labels: ["tasks", "cljs", "katamorph", "muse", "capabilities", "design", "3sp"]
write-id: "1784489225148-0.ygmqtnfrloi6uhw7ph"
points: "3"
source: "kanban/epics/katamorph-canonical-cutover.md"
title: "Capability Schema Reconciliation — muse capability vs katamorph CapabilityContract"
priority: "P2"
status: "ready"
uuid: "capability-schema-reconciliation"
created_at: "2026-07-19T00:00:00Z"
---

# Capability Schema Reconciliation

> Parent epic: `kanban/epics/katamorph-canonical-cutover.md`
> Design/decision card — the deliverable is a written reconciliation
> decision plus follow-up cards, not necessarily code.

## Purpose

Two capability shapes exist for the same primitive:

- **muse** `src/cljs/eta_mu/dsl/schema.cljc` — capability as
  `{:id :input :output :effects :handler :docs}`: an *executable* unit that
  tools/routes/hooks/MCP methods project from.
- **katamorph** `CapabilityContract` (`schema.cljs:195`) — capability as
  `{:cap/id :cap/tools :cap/user-surfaces}`: a *grouping/grant* unit used by
  actor/role contracts (`:actor/capabilities`, `:role/capabilities`).

The iceboxed epic `universal-agent-platform-dsl` is the blueprint: "a
**capability** is the primitive; a tool, route, hook, and MCP method are
projections" — and notes its six phases are already implemented in
`packages/extensions` (`src/eta_mu/platform/target/opencode.cljs`). muse's
production pipeline realizes the same idea independently. Decide how these
converge under katamorph as canon.

## Scope

- Map both shapes against real usage: muse registry/compile pipeline
  (`dsl/{schema,normalize,compile}.cljc`), katamorph consumers
  (knoxx `contracts/capabilities/*.edn`,
  `packages/kanban-orchestrator/contracts/capabilities/*.edn`, sol
  role/actor resolution).
- Decide: one schema with both facets, two related kinds (e.g.
  `:capability` grant + `:capability-impl`), or muse's shape upstreamed as
  the projection layer. Name what breaks in each option.
- Decide where the merged schema lives (katamorph) and what muse/sol/knoxx
  each consume from it.
- Write the decision as a comment on this card + update the epic; cut
  follow-up implementation cards sized ≤3sp each.

## Definition of done

- [ ] A decision record exists (comment here) naming: chosen shape, owner
      namespace in katamorph, migration path per consumer, and what was
      explicitly descoped.
- [ ] Follow-up implementation cards created and linked, or an explicit
      "no code moves" verdict recorded.
- [ ] The iceboxed `universal-agent-platform-dsl` epic is annotated with a
      pointer to the decision (its capability thesis is either adopted or
      superseded — said out loud).