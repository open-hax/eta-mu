---
status: incubating
created: 2026-08-07T02:33:06.419745372Z
source-session: /home/err/spaces/eta-mu
source-task: Closed a card's remaining DoD with regression tests pinning an FSM refusal at law, write path, and tool
p-efficiency: 0.5
p-friction: 0.5
p-skill-candidate: 0.8
promoted-to: ""
rejected-reason: ""
---

## Problem
I proved most of the new tests catch the original defect by restoring the pre-fix logic and matching the failures to the bug's real signature. I skipped that check on one test — the exit-code one — because it looked trivial. That was the only test that was actually worthless: it asserted that the constant map cli/exit-codes contains {:refused 3}, never exercising the CLI path that sets process.exitCode. It would have stayed green through any regression that swallowed the refusal in main's catch block, while every scripted caller saw exit 0 — the exact silent-success class the card existed to prevent. A reviewer caught it, not me. When I did write the real test and ran the bypass, it failed (not (= 3 0)): the CLI reporting success on a move that corrupted the card.

## Pattern
The test I am least inclined to falsify is the one whose assertion is a lookup rather than a behaviour — a constants map, an enum, a published mapping, a schema literal. It reads as obviously correct because it is a tautology, and tautologies feel too cheap to bother verifying. The falsification step is the thing that distinguishes them: a test that cannot fail when the fix is removed is not coverage. This generalizes past exit codes to any card asking to pin behaviour at a boundary the code merely reads FROM rather than acts ON.

## Candidate skill outline
- Name suggestion
- Trigger phrases
- Key steps or rules
- Anti-patterns to avoid

## Better path
Falsify every new test in the batch, not the subset that looks interesting — remove or bypass the fix and require each one to fail, with the failure matching the defect's real signature (the actual corrupt value written, the actual wrong code returned), not merely erroring. A test that stays green under the bypass is either testing nothing or testing something else; find out which before committing. Concretely, when a card asks for an exit-code, status-code, or error-kind assertion, drive the surface that SETS it (here: cli/main via process.argv, restoring argv and resetting process.exitCode afterward so a passing suite does not inherit the failure code) and treat the constants-map assertion as supplemental only. Pair every refusal test with a legal-move test so a path that simply never acts cannot pass by doing nothing.

## Receipt refs
- none
