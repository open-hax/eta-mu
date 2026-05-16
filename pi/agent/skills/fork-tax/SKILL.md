---
name: fork-tax
description: Persist the full working state into git (commit + tag + push + manifest artifacts) as a deterministic handoff snapshot. Use when the user requests Π / fork tax / full dump.
---

# Skill: Fork Tax (Π)

## Goal
Create a deterministic handoff snapshot via git: commit, tag, push, and in-repo manifest artifacts.

## Use This Skill When
- The user says "Π" or "pay the fork tax" or requests a "full dump" / "snapshot" / "handoff".

## Do Not Use This Skill When
- The user has not requested a handoff/snapshot.
- You suspect secrets are present in the working tree (stop and redact first).

## Steps
1. Confirm repository root and current branch.
2. Check `git status` and summarize dirty state.
3. Run the smallest relevant verification (lint/test/build fast path) if available.
4. Write/update in-repo handoff artifacts (`.ημ/Π_STATE.sexp`, `.ημ/Π_LAST.md`, manifest hashes).
5. Commit all repo-relevant changes.
6. Create a deterministic Π tag.
7. Push branch + tag to remote (record failures verbatim if blocked).

## Output
- A Π commit and tag.
- Updated `.ημ/*` handoff artifacts.
- Verification notes (run or skipped with reason).
