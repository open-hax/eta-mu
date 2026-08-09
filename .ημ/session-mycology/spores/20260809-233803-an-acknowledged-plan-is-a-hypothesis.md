---
status: incubating
created: 2026-08-09T23:38:03Z
source-session: /home/err/spaces/eta-mu
source-task: PR #280 clio review-resolution, two rounds, 16 bot findings; follow-up PR #282
p-efficiency: 0.75
p-friction: 0.5
p-skill-candidate: 0.85
promoted-to: ""
rejected-reason: ""
---

## Problem
The requested loop was: acknowledge each review finding with a plan, implement, then report actual-vs-planned. Writing the plan *before* building is what makes the loop useful to the reviewer — and it is also what makes the plan a public prediction. Two of mine were confidently wrong, in ways no amount of reading could have caught:

1. **npm bin target.** I told Codex the manifest would expose `bin/clio.nbb` directly. Packing the tarball and installing it into an empty project outside the monorepo produced `Could not find namespace: clio.extern.js.process`. npm installs a bin as a *symlink* under the consumer's `node_modules/.bin`, and nbb discovers `nbb.edn` — and therefore the package's classpath — by walking up from the script path it is handed **without resolving symlinks**. Separately, `#!/usr/bin/env nbb` resolved a global nbb 1.3.204 rather than the 1.3.201 the package declares. The fix became a Node launcher, not the file I had named.
2. **Quote scope.** I told Codex the exemption would be "`quote` only, not syntax-quote", reasoning that emitted code really does generate interop. The distinction does not exist after parsing: edamame expands a syntax-quoted form into `concat`/`list` machinery whose leaves are ordinary `(quote sym)` forms, and asking it not to expand raises `Syntax quote not allowed`. The honest outcome was a documented gap plus a test pinning current behaviour — not the distinction I had promised.

Both plans were reasonable from the source. Both were falsified in under five minutes by building the real thing.

## Pattern
Any review loop where the acknowledgement precedes the implementation. The plan is a hypothesis with an audience, and the failure mode is not being wrong — it is quietly shipping something different and letting the thread's last word be a prediction that never held. A reviewer reading only the plan then believes a mechanism that does not exist.

Two sub-patterns worth naming separately:

- **Verify the reviewer, not just the code.** Every one of the 16 findings got reproduced in isolation before acknowledgement. That caught one that did not reproduce at all — Codex claimed `:orn`/`:catn`/`:altn`/`:multi` branch labels leaked into a dependency walk; they never did, because element 0 of every vector was already consumed as the type-keyword position. But the probe that disproved it also exposed the *inverse* defect: a branch labeled `:enum` was parsed as an `[:enum ...]` literal and its real child schema silently dropped, hiding a dependency and making an **incompatible** revision report as compatible. Disputing well requires the same evidence as agreeing well, and produces better findings than either party had.
- **A merged PR still receives findings.** #280 merged at 23:24:33; Codex posted two more at 23:25:59. The branch was deleted on merge, so nothing could be pushed to it. I then committed the receipt onto that dead branch out of habit and had to cherry-pick it onto the follow-up.

## Candidate skill outline
- Name suggestion: `plan-as-hypothesis` (or `review-loop-plan-discipline`)
- Trigger phrases: "acknowledge the review comments with a plan", "then report actual vs planned", "address the PR feedback"
- Key steps or rules:
  - Reproduce every finding in isolation before acknowledging it. Paste the reproduction into the acknowledgement; it is what makes agreement and disagreement equally credible.
  - Before promising a mechanism in a plan, ask what would falsify it and whether that check is cheap. For anything shipped to a consumer, the check is: build the artifact and use it from the consumer's position.
  - When the plan fails, return to the same thread and say so plainly, with the evidence that falsified it, before or alongside shipping the different fix. "I was wrong about X, here is why the distinction is unavailable" is worth more than a silent substitution.
  - Prefer a documented, test-pinned gap over a claimed capability the implementation cannot deliver.
  - Before committing anything after a review round, check whether the PR is still open and which branch survives.
- Anti-patterns to avoid:
  - Acknowledging a finding by restating it in your own words without reproducing it — that is agreement theatre, and it cannot catch the false positive.
  - Letting the plan stand as the thread's final word when the implementation diverged.
  - Committing receipts or fixes onto a merged branch out of muscle memory.
  - Widening a fix's claimed scope to match what sounds principled rather than what the tooling can actually distinguish.

## Better path
Treat the acknowledgement as a testable claim. Reproduce first, plan second, and pick the cheapest falsifier for the plan's riskiest assumption *before* writing it down — for packaging, that means `npm pack` into a throwaway consumer, not reading `files`. When the falsifier fires, correct the thread explicitly and let the correction carry the evidence. Ship the honest narrower fix with the gap documented where the code lives and pinned by a test, so a future runtime change fails loudly instead of leaving the gap to be rediscovered. After a review round, confirm the PR is still open before choosing where commits land.

## Receipt refs
- 2026-08-09T22:56:48.517Z
- 2026-08-09T23:2x (round two + #280 merge / #282 follow-up entries)
