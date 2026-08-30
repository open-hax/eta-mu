---
category: "tasks"
labels: "github, automation, pull-request, recovery, security-boundary"
parent: "skip-unchanged-terminal-pr-branches"
type: "task"
write-id: "1788062914794-0.mw039qlt5dn9yw90m9"
points: "3"
title: "Scope pull-request suppression to the target repository"
priority: "P0"
status: "in_progress"
uuid: "scope-pr-history-to-target-repository"
created_at: "2026-08-30T04:08:09.107Z"
---

# Scope pull-request suppression to the target repository

## Outcome

Prevent an open or terminal pull request from a fork from suppressing projection of a distinct branch in the target repository merely because the fork reuses the same ref name or ref-and-SHA tuple.

## Scope

- Treat pull-request history as suppression authority only when the pull request head repository is the target repository being reconciled.
- Compare repository full names case-insensitively, matching GitHub repository identity semantics.
- Preserve existing same-repository open-head, exact terminal-head, zero-ahead, and per-branch comparison-failure behavior.
- Keep fork pull requests visible as history without allowing them to shadow target-repository branches.

## Acceptance criteria

- [ ] An open fork pull request with the same head ref does not suppress an eligible target-repository branch.
- [ ] A closed or merged fork pull request with the same head ref and SHA does not suppress an eligible target-repository branch.
- [ ] Same-repository open and terminal pull requests still suppress their matching target branch.
- [ ] Repository full-name matching is case-insensitive and fails closed when head repository identity is absent.
- [ ] Tests cover both open-fork and terminal-fork collisions while retaining the existing comparison-isolation and zero-ahead regressions.
- [ ] Documentation names repository identity as part of the suppression key.
- [ ] Exact-head hosted gates and automated review findings are resolved before activation.

## Red evidence

- Eta PR #310 exact-head Codex review `5059810630`, comment `3888328778`, thread `PRRT_kwDORu27H86deXUI` identified the missing repository-identity boundary on reviewed head `97f160d7c8ab3676c0fd4b2bb08f954a76a2ea95`.
- Landed implementation `9f075501ba3b1fae3e6a8865d39f2fea7d11c1dc` builds open and terminal suppression sets from head ref or head ref plus SHA without checking `head.repo.full_name` against the target repository.
- Eta PR #313 is frozen because its proposed completion narrative incorrectly claimed that #310 had no code finding and zero remaining review threads.

## Non-goals

- No change to fork pull-request review policy.
- No branch deletion or pull-request reopening.
- No weakening of exact-head, ahead-of-base, or per-branch error-retention gates.