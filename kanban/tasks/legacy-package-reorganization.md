---
uuid: "legacy-package-reorganization"
title: "Legacy Package Reorganization"
status: "review"
priority: "P1"
labels: ["tasks", "planning", "3sp"]
created_at: "2026-07-08T20:20:00Z"
source: "docs/design/legacy-package-reorganization.md"
points: 3
category: "tasks"
---

# Legacy Package Reorganization

> Parent: `kanban/tasks/eta-mu-cljs-rewrite-architecture-inventory.md`
> Spec: `docs/design/legacy-package-reorganization.md`

## Purpose

Define the physical package layout and names that replace `packages/legacy/*` as each package is rewritten in ClojureScript. The existing architecture inventory already maps target CLJS categories (`domain`, `shape`, `law`, `extern`, `infra`, `cli`, `tui`, `web`); this task closes the gap by mapping those categories to actual package names and boundaries.

## Work items

- [x] Draft `docs/design/legacy-package-reorganization.md` with the proposed package map.
- [x] Resolve open questions (turn-processor ownership, CLI naming, `packages/extensions` placement, deletion of `packages/legacy`).
- [x] Update the architecture inventory task with cross-references to the final package names.
- [x] Create the first child task for the slice that creates a new package (`packages/contracts/output`).
- [x] Create the base CLI package (`packages/eta-mu`) and sub-command router framework.
- [x] Create the turn-processor port task (`packages/turn-processor`).
- [x] Complete the `packages/turn-processor` port (law, domain, shape, infra, tests).
- [x] Wire `packages/eta-mu` to depend on `@eta-mu/turn-processor`.
- [x] Port the legacy `agent` command to use the new turn-processor with a minimal OpenAI client.
- [x] Track the interactive TUI agent port into `packages/eta-mu` as a follow-up slice (minimal REPL implemented; full TUI components belong in `packages/terminal-ui`).
- [ ] Track the terminal-ui package split from `packages/legacy/tui` (see `kanban/tasks/terminal-ui-cljs-package.md`).

## Acceptance criteria

- [x] Stakeholders agree on the package names and boundaries in the document.
- [x] No new package name conflicts with an existing workspace member or npm package.
- [x] The plan is linked from the parent CLJS rewrite epic.
- [x] The base CLI package (`packages/eta-mu`) and its router framework are implemented and tested.
- [x] The next package port (`packages/turn-processor`) is complete.

## Notes

`packages/turn-processor` is complete and `packages/eta-mu` now depends on it.
The default `eta-mu agent` command is implemented in ClojureScript and supports:
- single-turn chat with positional arguments,
- interactive REPL when run from a TTY,
- single-turn from piped stdin when run non-interactively.

The legacy `@open-hax/eta-mu-cli` dependency is no longer used by `eta-mu` and
is retained only as a workspace placeholder until the package is emptied.
The remaining slice is the full terminal-ui package split from `packages/legacy/tui`.

## Verification

```bash
# Ensure the document exists and is well-formed markdown
pnpm -C packages/legacy/coding-agent exec eta-mu kanban content legacy-package-reorganization --config /home/err/spaces/eta-mu/kanban/openhax.kanban.json
```
