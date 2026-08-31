---
category: "tasks"
labels: "tasks, cljs, rheos, markdown, katamorph, events"
parent: "workflow-dsl-kanban-reference"
type: "task"
write-id: "1788203868009-0.2b1qxbmmgub2qfy6mwm"
points: "5"
title: "Rheos typed document file events"
priority: "P0"
status: "in_progress"
uuid: "rheos-typed-document-file-events"
created_at: "2026-08-31T18:54:34.678Z"
---

# Rheos typed document file events

## Outcome

A Markdown document can declare Katamorph contract/resource references, a Malli schema reference, and a contained EDN sidecar. Add/change file events produce a typed proposal or rejection event without changing legacy Kanban behavior.

## Scope

- Define portable document profile and event laws.
- Parse flat frontmatter references without claiming structural YAML support.
- Merge one contained EDN sidecar through pure shapes.
- Validate the assembled value through Katamorph.
- Emit one typed file-change proposal or rejection from the watcher.
- Add a Sol/Knoxx conformance fixture boundary without implementing downstream execution.

## Acceptance

- [ ] Unprofiled Kanban cards preserve existing watcher behavior.
- [ ] Profiled Markdown plus EDN sidecar produces a Malli-valid typed event.
- [ ] Absolute/escaping/malformed/invalid sidecars produce a typed rejection and no proposal.
- [ ] Contract/resource refs and decoder provenance survive into the event.
- [ ] Rheos test, lint, and build gates pass with zero warnings.

---
Construction plan: law defines profile/assembly/event; shape parses flat reference markers and merges EDN deterministically; extern owns Node fs/path and EDN reads; domain builds typed proposal/rejection; infra watcher orchestrates only profiled documents. Preserve legacy cards. Defer accepted-state folds, Git attribution, pull/push/sync, and Knoxx execution.

Implemented the scoped typed-document file-change slice in construction order: portable adapter laws, flat frontmatter/EDN shapes, filesystem+hash extern, Katamorph adjudication domain, and watcher/ledger infra. Added translation fixtures and executable coverage for proposals, typed rejections, path containment, schema validation, event discriminator correlation, and typed documents outside legacy card projections. Evidence: pnpm -C packages/rheos test passed 200 tests / 975 assertions / 0 failures / 0 errors (test compile 0 warnings); pnpm -C packages/rheos lint passed 0 errors / 0 warnings; pnpm -C packages/rheos build completed server 120, cli 124, github-sync 64, app 95 files, all 0 warnings; git diff --check passed. Sol consumption remains the explicit P1 successor sol-consume-rheos-document-proposals; this card does not claim Knoxx contract parity or action execution.
---