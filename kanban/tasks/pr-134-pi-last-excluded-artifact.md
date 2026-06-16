---
uuid: "pr-134-pi-last-excluded-artifact"
title: "PR #134: List every excluded artifact in Π_LAST.md"
status: "todo"
priority: "P2"
labels: ["tasks", "pi", "docs", "pr-134", "1sp"]
created_at: "2026-06-16T12:30:00Z"
source: "CodeRabbit review on PR #134"
points: 1
category: "tasks"
---

# PR #134: List every excluded artifact in Π_LAST.md

CodeRabbit noted that `.ημ/Π_LAST.md` only lists `cljs-rewrite` as excluded, but the diffstat also excludes `docs/notes/.#2026.06.16.06.43.13.md` (Emacs lock file). Update the snapshot metadata so the provenance is consistent and the "no concurrent dirt" note is fully substantiated.

## Acceptance
- `Excluded from Commit` includes both the stray `cljs-rewrite` file and the Emacs lock file.
- Notes section is updated accordingly.
