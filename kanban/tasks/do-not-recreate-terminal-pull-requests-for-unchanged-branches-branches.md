---
category: "tasks"
labels: "github, automation, pull-request, recovery"
parent: "github-cljs-rewrite-domain-pr"
type: "task"
write-id: "1788062222155-0.ngspuu8yklc6zc2y5np"
points: "3"
title: "Do not recreate terminal pull requests for unchanged branches"
priority: "P0"
status: "done"
uuid: "skip-unchanged-terminal-pr-branches"
created_at: "2026-08-30T01:19:29.064Z"
---

# Do not recreate terminal pull requests for unchanged branches

## Outcome

Make `ensure-prs` open a pull request only for a matching branch that has new, unincorporated divergence and no open pull request, instead of treating every closed or merged pull request as if the branch had never been proposed.

## Scope

- Inventory pull-request history for each candidate branch, including terminal pull requests, rather than querying only `state: open`.
- Skip a branch when its current head SHA is the same head already recorded by a closed or merged pull request.
- Compare the candidate head with the configured base and skip branches with `ahead_by: 0`, including changes already incorporated by another route.
- Permit a new pull request only when the branch has moved beyond its terminal pull-request head and still contains commits ahead of the base.
- Keep protected-ref and branch-pattern filtering unchanged.

## Acceptance criteria

- [ ] An open pull request for the branch still suppresses creation.
- [ ] A closed or merged pull request whose recorded head SHA equals the current branch SHA suppresses creation.
- [ ] A branch with no commits ahead of the configured base suppresses creation even when its last pull request recorded an older SHA.
- [ ] A branch that advances beyond its terminal pull-request head and is ahead of the base remains eligible.
- [ ] Tests cover the unchanged terminal heads observed in Proxx PR #359 and PR #394, an already-incorporated branch, and a genuinely advanced branch.
- [ ] Dry-run and live `ensure-prs` continue to report eligible branches without weakening error reporting.
- [ ] Exact-head automated review findings are resolved before merge.

## Evidence

- `packages/legacy/github/src/github.ts:listBranchesWithoutPRs` currently calls `pulls.list` with `state: "open"` and excludes only those head refs.
- Proxx PR #359 closed at head `a2c8b93a7b7ed26814284401390756000fbeaf6e`; PR #394 closed at head `40a9810eea31e9f8398e5c5ff40e74ad9e65e3e4`. They are terminal automation products, not evidence of new branch motion.

## Non-goals

- No branch deletion policy.
- No automatic reopening of terminal pull requests.
- No changes to pull-request review, merge, or issue-close policy.

---
Intake plan 2026-08-30: the canonical owner is child card skip-unchanged-terminal-pr-branches under github-cljs-rewrite-domain-pr (GitHub issue #208). The current adapter lists only open pull requests, so terminal heads are indistinguishable from never-proposed branches. Implement a bounded eligibility decision over branch head, all pull-request history, and base comparison; reproduce unchanged terminal fixtures from Proxx PR #359 and #394, prove incorporated branches remain suppressed, and preserve eligibility only for a genuinely advanced head. No terminal PR will be reopened or blindly replaced.

Implementation evidence 2026-08-30: RED source inspection and Proxx PRs #359/#394 prove listBranchesWithoutPRs queried only state=open and therefore forgot every terminal head. GREEN changes the inventory to all PR history, skips open heads and exact terminal head/SHA pairs without extra calls, then serially compares only remaining candidates and admits them only when ahead_by is positive. The package-root Vitest suite passes 20/20, including exact Proxx terminal fixtures, open-PR suppression, ahead_by=0 incorporation, and an advanced terminal branch. The changed TypeScript source passes a standalone strict NodeNext compile; Biome reports both changed TypeScript files clean; documentation now states the terminal-head and base-divergence contract; git diff --check passes. Full-package tsc is not local authority in this linked worktree because the pre-existing @open-hax/eta-mu-cli workspace export has no built dist declarations; hosted build/typecheck remains required before merge.

Projection authority 2026-08-30: canonical card UUID skip-unchanged-terminal-pr-branches is represented by eta-mu issue #308. Preflight searches found no prior open or closed owner, and the created issue carries the exact marker, review status, P0 priority, source path, and desired label set. Issue #208 remains the broader icebox parent rather than being overloaded with this P0 operational defect.

Review-derived containment correction 2026-08-30: eta PR #310 exact head b333063414bb430eec17030c25544009ede998e9 is blocked by Codex review comment 3888231448. The #309 implementation placed repos.compareCommits during repository-wide discovery, so one no-common-ancestor rejection could abort every remaining branch. The repair branch fix/isolate-branch-comparison-failures moves the divergence check into the existing per-branch try boundary, records the failed branch in errors, continues a separate eligible branch, and preserves exact terminal-head suppression plus ahead_by=0 suppression. PR #310 must pin only the immutable landed repair merge; all 34 Proxx burst PRs remain open and quarantined until that two-phase rollout is reviewed and active.

Completion evidence 2026-08-30: eta #309 landed terminal-head and incorporated-branch suppression, then exact-head review found repository-wide compare failure could abort later branches. Eta #311 repaired that boundary: one compare rejection is retained in errors while separate eligible branches continue; reviewed head b2496e1d43ba071ea8298d97506a263187d67416 merged as 9f075501ba3b1fae3e6a8865d39f2fea7d11c1dc with tree 929d1469a8cdf5f9898eb21b8c2b7833e9a7d9bc. Eta #310 activated only that immutable repair; reviewed head 97f160d7c8ab3676c0fd4b2bb08f954a76a2ea95 merged as 285fedac4cebc82844bd2e1e21ff87210ee8c2b2 with tree 41bbab6e28f276fc71bd3ae529a6d9ef7d33d7a0. Exact hosted gates succeeded, Codex and OpenCode found no code defect, CodeRabbit was transparently quota-bounded after its predecessor finding was resolved, and zero review threads remained. Proxx canaries #398 and #406 were closed without merge at exact unchanged terminal heads. Post-activation run 33290703029/job 99201708735 resolved eta merge 285fedac, executed pin 9f075501, and returned created [] / errors []; neither canary recreated. All remaining 32 exact duplicates were then closed in four guarded batches with per-PR provenance, leaving nine legitimate opens. Final post-bulk run 33291182374/job 99202965270 again resolved 285fedac/9f075501, created exactly legitimate #437 for a genuinely new canonical card branch, returned errors [], and recreated none of the 34 terminal heads. Proxx #436 canonically owns the separate default-branch schedule/dispatch placement defect and exact-SHA deletion plus absence proof for temporary zero-ahead audit ref audit/eta-terminal-suppression-20260830t033746z@10a7d2303490127de38afa4d6a17ef8e2670874d. This card acceptance is complete; branch deletion remains outside its declared scope.
---