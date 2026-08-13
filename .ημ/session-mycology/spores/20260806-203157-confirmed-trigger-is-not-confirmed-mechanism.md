---
status: incubating
created: 2026-08-07T01:31:57.458809095Z
source-session: /home/err/spaces/eta-mu
source-task: P1 card: false invalid drift verdicts in the kanban ledger — card's own diagnosis was wrong
p-efficiency: 0.8
p-friction: 0.45
p-skill-candidate: 0.85
promoted-to: ""
rejected-reason: ""
---

## Problem
The card asserted a watcher/git race, with a 'Live confirmation' section showing 78 ledger events produced by merging four PRs. That evidence was real and it convinced two prior reviewers (CodeRabbit, and the session that wrote the card). It confirmed the TRIGGER — git moving card files — but said nothing about the MECHANISM. The card's Scope section then planned work around the assumed mechanism: suppress-and-retry until stable, detect .git/MERGE_HEAD to quiesce the watcher, tune awaitWriteFinish. All of it unnecessary. The actual cause was one regex: extract-status required a double-quoted YAML scalar, so plain-YAML cards (68 of 282 on this board) read back nil and nil was published as an FSM violation. Deterministic, unit-testable, no running service needed — the card explicitly said reproduction 'needs the service running, not just a test harness'.

## Pattern
A well-evidenced card, bug report, or bot review hands you a causal story. The evidence is genuine but underdetermines the cause: it establishes WHEN the symptom appears, not WHY. Implementing to the stated mechanism produces elaborate machinery (debounce, quiescence detection, retries) around a defect that is actually small and deterministic. The tell is a scope section proposing mitigation strategies rather than a one-line repair, plus a claim that reproduction requires heavy infrastructure.

## Candidate skill outline
- Name suggestion
- Trigger phrases
- Key steps or rules
- Anti-patterns to avoid

## Better path
Before implementing to a card's stated mechanism, read the code path the symptom flows through and reproduce the defect in the smallest harness that can hold it. Measure the blast radius against real data — here, counting how many of the 282 cards the regex could not parse (68) turned a vague 'sometimes' into a deterministic 24%. Then prove the new tests actually catch it by restoring the pre-fix logic behind the same function signatures and watching them fail; passing tests on a fixed system prove nothing about whether they would have caught the bug. When the card's diagnosis turns out wrong, correct it on the card itself so the next reader does not re-derive it — the mistaken causal story is the expensive part, not the code.

## Receipt refs
- 2026-08-07T01:20:08.455Z
