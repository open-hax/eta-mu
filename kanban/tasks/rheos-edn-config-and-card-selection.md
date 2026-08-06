---
uuid: "rheos-edn-config-and-card-selection"
title: "Rheos EDN config and card projection discovery"
status: in_progress
type: task
priority: P0
points: 5
labels: rheos, config, edn, projection
category: tasks
parent: "rheos-ledger-authoritative-projections"
---

# Rheos EDN config and card projection discovery

## Outcome

Rheos prefers EDN configuration while preserving deprecated JSON compatibility,
and config describes where derived Markdown card projections are materialized and
discovered. Repositories may keep board guides beside projected cards without
silently ingesting every Markdown document as a task.

This is the compatibility/configuration pass. It does not declare Markdown cards
canonical and does not pretend the current mutation ledger can already rebuild a
board.

## Scope

- Discover `openhax.kanban.edn` and `kanban.edn` before JSON equivalents.
- Parse EDN and JSON into one normalized internal config shape.
- Emit a deprecation warning when JSON config is loaded.
- Add project-level `:card-projection` configuration with explicit relative
  `:paths` beneath the configured task root.
- Keep existing `tasksDir` projects working without configuration changes.
- Preserve camelCase JSON keys while documenting kebab-case EDN keys.
- Add tests and documentation for precedence, compatibility, and projection-path
  semantics.

## Non-goals

- Removing JSON support in this pass.
- Making Markdown cards the authoritative board store.
- Implementing ledger replay, Git ancestry filtering, or projection reconciliation.
- Rewriting Rheos from ClojureScript to bb, nbb, or JVM Clojure.
- Designing a general-purpose glob engine.

## Acceptance criteria

- EDN config is selected ahead of JSON during upward discovery.
- Explicit `--config` accepts either EDN or JSON by extension.
- JSON loading logs one clear deprecation warning.
- A project may keep `README.md`, `AGENTS.md`, and design prose under the task root
  while materializing/discovering cards only through configured projection paths.
- Projection paths are resolved beneath the configured task root and path escape is
  rejected.
- Absence of `:card-projection` preserves recursive legacy discovery.
- Existing config and task-loading tests remain green with zero warnings.

## Verification

- `pnpm -C packages/rheos test`
- `pnpm -C packages/rheos lint`
- `pnpm -C packages/rheos build`
