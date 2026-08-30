---
category: "tasks"
labels: "github,automation,pull-request,recovery"
parent: "skip-unchanged-terminal-pr-branches"
type: "task"
write-id: "1788067220042-0.tsyuapn477iw0yc1b"
points: "3"
title: "Scope pull-request suppression to the target repository"
priority: "P0"
status: "review"
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

---
Implementation evidence 2026-08-30: exact base 285fedac reproduced both review-derived collisions before repair: an open fork with the target branch ref and a terminal fork with the exact target ref+SHA each suppressed the legitimate branch. The candidate filters PR suppression authority by case-insensitive head.repo.full_name equality to owner/name before constructing either open-ref or terminal ref+SHA sets; missing head repository identity confers no suppression authority. RED was 2/12 failed with empty candidates. GREEN is now the full @open-hax/eta-mu-github suite 25/25, including mixed-case same-repository identity and missing/deleted-fork identity. Strict targeted NodeNext typecheck of source+test, Biome on both TypeScript files, and git diff check pass. Full package typecheck remains blocked only by the pre-existing missing built @open-hax/eta-mu-cli declarations in src/pi-agent.ts:14. Hosted exact-head gates and review remain required.

Activation follow-through 2026-08-30: implementation H landed as eta merge 01f81d0d1c044fc3f5859db1aaa03d8e18962f28 with reviewed tree 07bb6cd72d59a7d1aabf7e7328fde763b41f62b4. The distinct activation A will change only the reusable ensure-pr workflow's internal eta checkout from 9f075501ba3b1fae3e6a8865d39f2fea7d11c1dc to exact H. Proxx must remain on the old reusable revision until A passes exact local and hosted gates, independent review, and guarded merge. Issue #314 and this card remain open/review through the later Proxx wrapper pin and scheduled live proof; H alone is not completion.

Activation A local evidence 2026-08-30: exact base and parent are H=01f81d0d1c044fc3f5859db1aaa03d8e18962f28. YAML parsing proves the reusable workflow checkout remains open-hax/eta-mu, path .eta-mu, persist-credentials false, and now executes exact H; the old 9f075501 checkout is absent from that workflow. The unchanged GitHub automation package passes 25/25 from its package root with zero test warnings; git diff check passes. Rheos re-read preserves card status review with no drift for this card, and the newly appended activation receipt validates independently. Full local eta-mu CLI rebuild is environment-blocked before compilation because repo1.maven.org is unreachable for shadow-cljs 3.4.11; no CLI source is changed, and exact hosted main gates remain required. Proxx activation remains forbidden until this distinct A is reviewed and merged.
---