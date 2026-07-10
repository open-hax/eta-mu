---
uuid: "docs-reconcile-cross-references"
title: "Reconcile or retire CROSS_REFERENCES.md"
status: "incoming"
priority: "P2"
labels: ["docs", "cleanup", "2sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 2
category: "tasks"
---

# Reconcile or retire CROSS_REFERENCES.md

## Context

`CROSS_REFERENCES.md` appears to be a stale, externally-focused dump for a different project ("Riatzukiza OpenHax", Reactant + Fastify). It references many external repositories and a non-existent `services/agentd`, making it unhelpful for navigating the current eta-mu codebase.

## Findings

- Contradicts the ClojureScript-first, TypeScript-deprecated framing in `README.md`.
- References `services/agentd` and a Reactant/Fastify backend that do not exist.
- No clear consumer or maintainer value in its current form.

## Acceptance

- [ ] Decide whether to (a) delete `CROSS_REFERENCES.md` or (b) rewrite it as an eta-mu-specific map of related open-hax repositories and internal package boundaries.
- [ ] If rewriting, include only currently relevant repos and packages with one-line descriptions and ownership notes.
- [ ] If deleting, move any salvageable links into a small "Related repositories" section in the rewritten `README.md`.
- [ ] Update any internal links that point to `CROSS_REFERENCES.md`.
