---
uuid: "rheos-edn-config-and-card-selection"
title: "Rheos EDN config and explicit card selection"
status: in_progress
type: task
priority: P0
points: 5
labels: rheos, config, edn, discovery
category: tasks
---

# Rheos EDN config and explicit card selection

## Outcome

Rheos prefers EDN configuration while preserving deprecated JSON compatibility, and repositories can keep board prose beside cards without that prose being ingested as tasks.

## Scope

- Discover `openhax.kanban.edn` and `kanban.edn` before JSON equivalents.
- Parse EDN and JSON into one normalized internal config shape.
- Emit a deprecation warning when JSON config is loaded.
- Add project-level card selection through `:card-paths`, `:include`, and `:exclude` configuration.
- Keep existing `tasksDir` projects working without configuration changes.
- Add tests and documentation for precedence, compatibility, and selection semantics.

## Non-goals

- Removing JSON support in this pass.
- Rewriting Rheos from ClojureScript to bb, nbb, or JVM Clojure.
- Replacing Markdown cards or YAML frontmatter.
- Designing a general-purpose glob engine.

## Acceptance criteria

- EDN config is selected ahead of JSON during upward discovery.
- Explicit `--config` accepts either EDN or JSON by extension.
- JSON loading logs one clear deprecation warning.
- A project may keep `README.md`, `AGENTS.md`, and design prose under `tasksDir` while selecting only intended card directories or paths.
- Selection paths are resolved relative to the task root and cannot escape it accidentally.
- Existing config and task-loading tests remain green with zero warnings.

## Verification

- `pnpm -C packages/rheos test`
- `pnpm -C packages/rheos lint`
- `pnpm -C packages/rheos build`
