---
category: "tasks"
labels: "rheos, github, projection, data-integrity"
dependency: []
parent: "rheos-ledger-authoritative-projections"
type: "task"
write-id: "1788285862266-0.2rp650hj8ifaxojmmvc"
title: "Preserve inline YAML label arrays in Rheos projections"
priority: "P0"
status: "review"
uuid: "rheos-preserve-inline-yaml-label-arrays"
created_at: "2026-09-01T17:18:15.615Z"
---

# Preserve inline YAML label arrays in Rheos projections

## Outcome

Rheos decodes canonical top-level inline YAML string sequences without broadening its partial decoder to arbitrary YAML, so `read-task` and board projection preserve identical ordered labels. This closes open-hax/eta-mu#320.

## Scope

- Decode only empty or fully quoted, single-line top-level string sequences.
- Keep unquoted, mixed, nested, map, block, and malformed values fail-closed.
- Advertise the added decoder capability.
- Prove read-task and board-snapshot label equality and non-empty preservation.

## Acceptance criteria

- Non-empty and empty canonical label arrays retain order.
- Unsupported structural YAML remains omitted from the partial view.
- A board-level regression fails if non-empty source labels become an empty projected vector.
- Rheos tests, clj-kondo, and release build pass without warnings.

---
Verified on the combined blocker-removal candidate: 191 Rheos tests / 967 assertions, clj-kondo 0 errors and 0 warnings, all four production release builds 0 warnings, and all 252 previously affected inline task-label arrays remain nonempty. Candidate also proves exact read-task/board equality.

Exact-head review regression fixed: the shared canonical inline-sequence decoder now preserves quoted commas identically through read-task and board projection. Verified 195 tests / 992 assertions, zero failures; clj-kondo 0 errors/warnings; server, CLI, GitHub-sync, and app release builds 0 warnings.
---