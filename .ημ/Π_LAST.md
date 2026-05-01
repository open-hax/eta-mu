# Π Fork Tax Handoff — 2026-05-01T16:13:13Z

## Scope
- Added a core `agent_idle` extension lifecycle event after `agent_end` and core idle settlement.
- Moved `opmf-contract-gate` repair injection to `agent_idle` to avoid steering-message ping-pong and active-run rejection.
- Hardened CLJS markdown extraction/counting for output contract validation.
- Added targeted tests for the idle hook and markdown parser behavior.

## Verification
- `pnpm --dir packages/eta-mu-extensions test` — passed, 64 tests / 152 assertions.
- `pnpm --dir packages/coding-agent exec vitest --run test/suite/agent-session-queue.test.ts` — passed, 14 tests.
- Earlier in this turn: `pnpm --dir packages/coding-agent build` — passed.
- Earlier in this turn: `pnpm --dir packages/eta-mu-extensions build` — passed with pre-existing `task_timing.cljs` infer warnings.

## Concurrent dirt / blockers
- No unrelated dirty paths observed before staging.
- No destructive repo-wide cleanup used.
- Secret scan on touched source diffs had one false positive (`tokens` local variable), no credential-looking additions observed.

## Manifest
- `.ημ/Π_MANIFEST.sha256` records hashes for the touched source/test/receipt files.
- `.ημ/Π_DIFFSTAT.txt` records the pre-commit diffstat.

## Push result
- `git push origin main` was blocked by GitHub push protection (`GH013`).
- The blocker is not in this fork-tax diff; GitHub reported historical/local-ahead commit `e11ddba0e21c5ff03198961dacbfa61804834818` under `packages/ai/src/utils/oauth/google-gemini-cli.ts` and `packages/ai/src/utils/oauth/google-antigravity.ts`.
- Branch and tag remain local until that historical secret-scanning blocker is resolved or the snapshot is replayed onto a clean remote base.
