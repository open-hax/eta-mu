---
name: regression-triage
description: "Investigate software regressions (find introducing commit, infer intent, choose rollback vs fix-forward) and always add a regression test."
---

# Skill: Regression Triage

## Goal
When a regression is reported, quickly:
1. confirm the regression
2. identify the introducing change (commit/PR)
3. decide whether it was an intended change with an unintended side effect vs an incorrect implementation
4. remediate (rollback or fix-forward)
5. **always add a regression test** that clearly covers the failed path

## Use This Skill When
- The user says or implies a software regression (e.g. “there was a regression”, “this regressed”, “this used to work”).
- A previously-passing test/behavior started failing after recent commits.

## Do Not Use This Skill When
- “Regression” refers to statistical regression / data science.
- The issue is a brand-new bug with no prior working baseline.

## Inputs
- Repro steps OR a failing test command
- (Optional) last known good version/commit/tag
- (Optional) suspected area (file/module)

## Workflow
### 0) Confirm (facts first)
- Reproduce on current `HEAD`.
- Capture: expected vs actual, error output, environment assumptions.

### 1) Locate the introducing change
Prefer deterministic methods:
- If you have a reliable test command:
  - use `git bisect run <test-cmd>`
- If not:
  - narrow to likely paths
  - use `git log -p -- <paths>` + `git blame` + `git show <sha>`

### 2) Infer intent (separate facts vs interpretations)
Classify with explicit uncertainty:
- **A: Side effect** — change seems intentional/correct, but missed an edge case.
- **B: Incorrect implementation** — change contradicts requirements, breaks invariants, or is partial.

### 3) Choose remediation strategy
Heuristics:
- **Rollback (`git revert`)** when:
  - feature isn’t required / can wait
  - revert is small and low-risk
  - fix-forward complexity is high or timeline is tight
- **Fix-forward** when:
  - feature intent must remain
  - revert would break other work
  - the bug is localized and safe to patch

### 4) Add a regression test (mandatory)
- Add a *minimal* test reproducing the failure.
- Name it after the bug/behavior.
- It should:
  - fail before the fix
  - pass after the fix
  - (ideal) fail on the introducing commit too

### 5) Verify + record
- Run the smallest relevant suite first, then full suite if feasible.
- Record:
  - introducing commit
  - intent classification (A/B)
  - why rollback vs fix-forward
  - what the test covers

## Command templates
```bash
git log --oneline --decorate --graph -n 50

git bisect start
git bisect bad
git bisect good <sha>
git bisect run <test-cmd>
git bisect reset

git log -p -- <path>
git blame -L <start>,<end> <file>
git show <sha>

git revert <sha>
```

## Output expectations
- Identify the introducing commit (or state why it’s unknown).
- Provide a clear remediation plan (rollback vs fix-forward).
- Point to the regression test you added/updated.
