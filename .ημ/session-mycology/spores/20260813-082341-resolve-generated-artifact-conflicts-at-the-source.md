---
status: incubating
created: 2026-08-13T08:23:41.862309152Z
source-session: /home/err/spaces/eta-mu
source-task: Resolve PR #181 conflicts after merging main
p-efficiency: 0.82
p-friction: 0.58
p-skill-candidate: 0.82
promoted-to: ""
rejected-reason: ""
---

## Problem
The generated workflow itself was conflicted and the generator refused to parse conflict markers, while main's valid hand-authored Clio additions had no corresponding resource declaration.

## Pattern
Generated artifacts can conflict with later direct edits; choosing either side loses either the source-of-truth contract or the newer obligation.

## Candidate skill outline
- Name suggestion
- Trigger phrases
- Key steps or rules
- Anti-patterns to avoid

## Better path
Identify the generator and authoritative declaration, translate the incoming behavior into that declaration, remove only the conflicted generated artifact, re-emit, and verify semantic equality. Treat deleted legacy mirrors as deleted when the new projection subsumes their incoming edits.

## Receipt refs
- none
