---
status: incubating
created: 2026-07-15T20:23:51.459053866Z
source-session: /home/err/spaces/eta-mu
source-task: Kanban board triage against code state
p-efficiency: 0.5
p-friction: 0.5
p-skill-candidate: 0.75
promoted-to: ""
rejected-reason: ""
---

## Problem
Cards in review claim gates green, but claims drift from code (work landed in different packages, deliverables partially done, epics' premises voided by later decision records)

## Pattern
Whenever sorting a board: read the card, re-run its stated verification gate, grep for the claimed namespaces/files, and check newer decision records that may void the card's premise before promoting or bouncing

## Candidate skill outline
- Name suggestion
- Trigger phrases
- Key steps or rules
- Anti-patterns to avoid

## Better path
Promote with a dated 'reviewed against code' comment naming exact gates re-run and any delivered/undelivered split; never let deferred scope evaporate — cut a successor card in the same pass. Put no flags after the comment text with eta-mu kanban comment (flag-absorption bug)

## Receipt refs
- none
