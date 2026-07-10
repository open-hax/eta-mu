---
uuid: "docs-fix-extensions-readme-drift"
title: "Refresh packages/extensions README and fix path/name drift"
status: "incoming"
priority: "P1"
labels: ["docs", "extensions", "constitutional", "3sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 3
category: "tasks"
---

# Refresh packages/extensions README and fix path/name drift

## Context

The constitutional layer package moved from `packages/eta-mu-extensions` to `packages/extensions`, but multiple docs still use the old path. The README also claims image extensions that do not exist and omits several manifest extensions.

## Findings

- Top-level README and commands reference `packages/eta-mu-extensions`.
- `packages/extensions/README.md` and `packages/extensions/kanban/extension-integration-plan.md` claim `analyze-image` and `manipulate-image` are ported/in-progress, but no source or manifest entries exist.
- Missing from README narrative: `apply-patch`, `contract-runtime-v2`, `graph-memory`, `lisp-decomp-nudge`.
- `kanban/eta-mu-extensions-integration.md` is marked `done` but contains obsolete unported-extension table and roadmap.
- No extension authoring guide exists despite macros under `lib/eta_mu/macros/`.

## Acceptance

- [ ] Replace all `packages/eta-mu-extensions` references with `packages/extensions` in README, kanban specs, and commands.
- [ ] Update `packages/extensions/README.md` extension inventory to match the current 15-extension manifest.
- [ ] Remove or clearly mark phantom image-extension claims; schedule or drop the work.
- [ ] Reconcile `kanban/eta-mu-extensions-integration.md` and `packages/extensions/kanban/extension-integration-plan.md` with the manifest.
- [ ] Add a short extension authoring guide or link to macros documentation.
