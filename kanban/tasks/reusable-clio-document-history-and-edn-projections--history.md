---
category: "tasks"
labels: "clio, rheos, knoxx, document-history"
type: "task"
write-id: "1789280081931-0.mn01ir8p06mv360fc3i"
points: "5"
title: "Reusable Clio document history and EDN projections"
priority: "P0"
status: "review"
uuid: "reusable-clio-document-history"
created_at: "2026-09-13T05:21:08.543Z"
---

# Clio-backed reusable document history

## Intent
Move generic document revision storage, causal replay, and disposable EDN/Markdown snapshots into a specialized package used by Knoxx, with Clio directly owning append-only ledgers. Rheos shares the architectural problem but remains a future consumer of this seam.

## Acceptance
- Ledgers, schema history, and snapshots reside under .ημ.
- Separate processes saving the same observed revision preserve both immutable edits.
- Physical partitions, order, and exact duplicate records do not alter projections.
- Explicit resolution records all chosen causal parents; deterministic display selection never resolves a conflict.
- Deleting or finishing stale snapshots cannot alter accepted state.
- Input and cross-document parent validation fails before publication.
- Package tests execute real Clio filesystem operations under NBB and compiled CLJS; lint has no warnings.

## Scope
Specialized document-history package; Knoxx owns authorization and CMS/publication policy. Rheos canonical task fold remains separately owned.

---
Implemented packages/document-history over Clio with independent finalized partitions, EDN metadata, immutable Markdown snapshots, explicit causal heads, per-revision reads, and single-genesis migration seeds. Root-selected tests pass under NBB and compiled CLJS: 8 tests/54 assertions each, 0 failures; compiler and package/root-script lint have 0 warnings. Real process writers preserve same-parent/equal-timestamp edits; 1/10/100 partitions, duplicates, snapshot rebuild, stale output, explicit resolution, and invalid-write refusal pass. Rheos remains a future runtime adopter through its existing canonical-fold cards; Knoxx integration is independently underway.

Addressed PR #336 review findings: seed empty-check and append now coordinate with parentless normal commits through the same Clio initialization lock; later independent roots remain preserved. Existing symlink ancestors are resolved before any descendant mkdir. Async worker supervision handles early result, spawn failure, and exit markers without blocking callbacks. A deliberate compiled failing assertion proved that automatic Shadow execution printed failure but returned zero; explicit Node execution with autorun disabled now runs once and returns exit 1. Final root gates: NBB and compiled CLJS each 11 tests/71 assertions passed, compiler/lint zero warnings.

---
