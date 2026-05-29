# Π Fork Tax Snapshot — eta-mu

- Timestamp: 20260516T185547Z
- Branch: pi/fork-tax/20260516-eta-mu-recursive
- Base: 927b4321bf4e
- Scope: model/package metadata, coding-agent runtime events, OPMF contract gate, and self-contained pi snapshot.

## Included work

- Preserved package/model metadata updates across Eta Mu packages.
- Preserved coding-agent runtime event/doc changes and related test file.
- Preserved OPMF contract gate/custom provider changes and tests.
- Added self-contained `pi/` snapshot files for agent skills/config/theme/docs.
- Recorded recursive fork-tax handoff artifacts.

## Verification

- `git diff --cached --check` passed after whitespace-normalizing staged imported skill/docs snapshot files.
- `pnpm --dir packages/eta-mu-extensions test` passed.
- `pnpm --dir packages/coding-agent test test/agent-session-runtime-events.test.ts` passed.

## Residual dirt

- None in this selected repo scope after commit.
