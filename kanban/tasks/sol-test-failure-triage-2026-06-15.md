---
uuid: "sol-test-failure-triage-2026-06-15"
title: "Sol / Katamorph Test Failure Triage and Resolution"
status: "done"
priority: P0
labels: ["tasks", "cljs", "tests", "katamorph", "sol"]
created_at: "2026-06-15T15:30:00Z"
source: "agent-session"
points: 3
category: tasks
---

# Sol / Katamorph Test Failure Triage and Resolution

> Investigated by parallel sub-agents on 2026-06-15.
> Resolution implemented and all relevant suites are green.

## Problem

`pnpm --filter @open-hax/sol test` was reporting **24 failures, 1 error**. The failures fell into three categories:

1. **Cross-package test contamination** — Sol's `shadow-cljs.edn` used `:ns-regex` (invalid key) instead of `:ns-regexp`, causing shadow-cljs to discover and run katamorph-oriented tests that lived under `packages/sol/test/cljs/open_hax/katamorph/`.
2. **Katamorph evaluator bugs** — `katamorph.policy.eval` normalized `false` to `nil` and only resolved `ctx`/`it` symbols; `katamorph.agent.reasoning` omitted empty reasoning deltas; `katamorph.agent.text-delta` mishandled duplicated-prefix and replay-offset `0`.
3. **Sol agent-template evaluator gaps** — vector literals were mis-classified as keyword calls, symbol lookup did not fall back to keyword keys, `render-prompt` did not expose template-context bindings, `discord-message-template-context` did not fall back to `:messageId` on `event`, and `tool-result-media-type` omitted `"input_audio"`.

## Resolution Strategy

| Area | Fix | Files |
|------|-----|-------|
| Test isolation | Change `:ns-regex` → `:ns-regexp "open-hax\\.sol\\..*-test$"` | `packages/sol/shadow-cljs.edn:104` |
| Test relocation | Moved katamorph agent tests from Sol to katamorph package; removed duplicate `open_hax/contracts/policy/eval_test.cljs` | `packages/katamorph/test/cljs/katamorph/agent/*_test.cljs` |
| Policy eval | Return raw result (preserve `false`); resolve arbitrary symbols via symbol and keyword keys | `packages/katamorph/src/cljs/katamorph/policy/eval.cljs` |
| Agent reasoning | Always emit `:reasoning` delta when leaving `:thinking` | `packages/katamorph/src/cljs/katamorph/agent/reasoning.cljs` |
| Text delta | Handle duplicated-prefix glitch with leading boundary; treat `replay-offset` `0` as active | `packages/katamorph/src/cljs/katamorph/agent/text_delta.cljs` |
| Agent templates | Evaluate vectors element-wise first; keyword fallback in env lookup; expose `ctx` + template-context; add `mod`/`rem` ops | `packages/sol/src/cljs/open_hax/sol/domain/agent/agent_templates.cljs` |
| Media types | Add `"input_audio"` to audio case | `packages/sol/src/cljs/open_hax/sol/domain/agent/content.cljs` |
| Test expectations | Updated katamorph eval assertions to expect `false`; fixed Sol template/map/filter assertions | `packages/katamorph/test/cljs/katamorph/policy/eval_test.cljs`, `packages/sol/test/cljs/open_hax/sol/domain/agent/agent_templates_test.cljs` |

## Verification

- `pnpm --filter @open-hax/katamorph test` → **102 tests, 0 failures, 0 errors**
- `pnpm --filter @open-hax/sol test` → **66 tests, 0 failures, 0 errors**
- `pnpm --filter @open-hax/eta-mu-cli test` → **110 passed, 7 skipped (1120 tests)**

## Commits

- `7e266c4` fix(katamorph): preserve false in policy eval and resolve arbitrary context symbols
- `11ac84c` fix(katamorph): agent reasoning/text-delta/turn-guards; relocate tests from Sol
- `2bf6329` fix(sol): isolate test suite, fix agent-templates evaluator, add input_audio media type

## Notes

- The `packages/sol/dist-dev/` directory was already removed from git tracking in an earlier Π commit (`61887d8`) and is now ignored via root `.gitignore` (`dist-dev/`).
- No TypeScript line-count increase; changes were all in ClojureScript.
- All fixes were scoped to test/namespace hygiene and evaluator behavior; no production API surfaces were changed.
