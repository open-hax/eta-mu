---
uuid: "docs-consolidate-notes-index"
title: "Consolidate docs/notes and add an index"
status: "incoming"
priority: "P2"
labels: ["docs", "notes", "cleanup", "3sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 3
category: "tasks"
---

# Consolidate docs/notes and add an index

## Context

`docs/notes/` contains mixed-quality working notes. Some are substantive design conversations (worlds/projections, ledger architecture, contract DSL, promptdb reasoning kernel) that reference real packages (Rheos, sol, katamorph, knoxx, openplanner). Others are empty or near-empty, and two pairs are duplicated between `docs/notes/` and `docs/notes/research-prompt/`. No index exists.

## Findings

- Empty/near-empty files: `2026.06.14.10.25.09.md`, `2026.06.16.07.37.18.md`, `2026.05.05.11.03.52.md`, `2026.05.08.13.48.10.md`.
- Duplicates: `2025.11.04.11.54.30.md` and `2025.11.04.12.11.40.md` appear in both `docs/notes/` and `docs/notes/research-prompt/`.
- `docs/design/` is empty; there is no authoritative top-level architecture overview.

## Acceptance

- [ ] Remove empty note files (or archive them with a clear tombstone).
- [ ] Deduplicate `research-prompt/` copies and decide on a single canonical location.
- [ ] Create `docs/notes/INDEX.md` that classifies notes by topic (architecture, contracts, agent model, tooling) and marks each as current design intent or historical brainstorming.
- [ ] Optionally promote the most substantive notes into short architecture docs under `docs/design/`.
- [ ] Link the index from the rewritten `README.md`.
