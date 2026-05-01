# Π Fork Tax Handoff — 2026-05-01T16:32:48Z

## Scope
- Added a core `agent_idle` extension lifecycle event after `agent_end` and core idle settlement.
- Moved `opmf-contract-gate` repair injection to `agent_idle` to avoid steering-message ping-pong and active-run rejection.
- Hardened CLJS markdown extraction/counting for output contract validation.
- Clarified deterministic repair prompts so counted sections prefer explicit markdown list items.
- Rewrote local `main` history to remove hardcoded Google OAuth client constants from pushed refs.
- Current OAuth source requires env-provided Google client credentials instead of embedded constants.

## Current commit
- f2936b5fbc0b8a495c366ac0d22d6ae5df7e5e8c

## Verification
- `pnpm --dir packages/eta-mu-extensions test` — passed, 65 tests / 156 assertions.
- `pnpm --dir packages/coding-agent exec vitest --run test/suite/agent-session-queue.test.ts` — passed, 14 tests.
- `pnpm --dir packages/ai exec tsgo -p tsconfig.build.json --noEmit` — passed.
- Earlier: `pnpm --dir packages/coding-agent build` — passed.
- Earlier: `pnpm --dir packages/eta-mu-extensions build` — passed with pre-existing `task_timing.cljs` infer warnings.

## Secret remediation
- Blame identified the blocked constants as introduced by local-ahead commit `e11ddba0e21c5ff03198961dacbfa61804834818`.
- A backup branch was created before rewrite: `backup/main-before-oauth-redaction-20260501T162901Z`.
- `git filter-repo --refs main --replace-text ...` rewrote pushed `main` history so the flagged constants are no longer in the `main` ref.
- A follow-up commit replaced placeholder constants with env lookups in:
  - `packages/ai/src/utils/oauth/google-gemini-cli.ts`
  - `packages/ai/src/utils/oauth/google-antigravity.ts`

## Concurrent dirt / blockers
- No unrelated dirty paths observed before staging.
- No destructive repo-wide cleanup used.
- The old push-protection blocker is expected to be resolved for `main`; push still needs to be retried after this artifact update.

## Manifest
- `.ημ/Π_MANIFEST.sha256` records hashes for touched source/test/receipt files.
- `.ημ/Π_DIFFSTAT.txt` records the current diffstat for the artifact refresh.
