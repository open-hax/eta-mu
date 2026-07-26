---
status: incubating
created: 2026-07-19T01:10:00Z
source-session: /home/err/spaces/eta-mu
source-task: katamorph constellation grok — 4 parallel schema copies found after a "successful" extraction
p-efficiency: 0.8
p-friction: 0.5
p-skill-candidate: 0.75
promoted-to: ""
rejected-reason: ""
---

## Problem
katamorph was extracted to a standalone repo to be the canonical contract layer, and the extraction epic closed green — but every consumer (knoxx, sol, muse) kept or grew its own local schema copy. The epic's acceptance criteria covered *removing the local copies*, never *adopting the extracted canon*. Result: 4+ drifted incarnations of the same Malli schema set, discovered months later.

## Pattern
Extraction/consolidation epics that only card the removal half. "Library moved" reads as done; "callers cut over" is the actual goal and silently never happens because nothing fails when consumers ignore the new dependency.

## Candidate skill outline
- Name suggestion: extraction-adoption-discipline
- Trigger phrases: "extract X to its own repo", "make X canonical", "consolidate schemas/contracts", "promote X out of the monorepo"
- Key steps: (1) extraction epic MUST contain one adoption card per consumer with a grep-verifiable DoD (zero local redefinitions); (2) one enforcement card (lint/CI guard that fails when a consumer redefines an owned name — discipline through pipeline, not docs); (3) epic acceptance criteria include consumer adoption, not just source removal.
- Anti-patterns: acceptance criteria phrased as "local copy deleted"; aspirational deps.edn entries required nowhere; philosophy recorded only in design docs.

## Better path
At extraction-epic authoring time, enumerate consumers (git grep across the workspace), cut an adoption card each, and add the redefinition guard before declaring the extraction done.

## Receipt refs
- katamorph-canonical-cutover 2026-07-19
