---
uuid: "kondo-lint-cleanup-extensions"
title: "Clean up clj-kondo findings in extensions"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "quality", "5sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/kondo-lint-cleanup.md"
points: 5
category: "tasks"
---

# Clean up clj-kondo findings in extensions

> Parent epic: `kanban/epics/kondo-lint-cleanup.md`
> Points: 5

## Purpose

Run the shared clj-kondo rules against extensions and resolve every finding per the epic fix policy.

## Scope

- `packages/extensions/src/**/*.cljs`
- `packages/extensions/lib/**/*.cljc`

## Baseline pre-lint signal

From `docs/kondo-config-baseline.md`:

| File | Promise-chain hits | Likely long fns | js-await usage | File length flag |
|------|--------------------|-----------------|----------------|------------------|
| `src/eta_mu/contracts/core.cljs` | 0 | 1 | 0 | yes |
| `src/eta_mu/extensions/contract_runtime.cljs` | 0 | 0 | 0 | yes |
| `src/eta_mu/extensions/contract_runtime_v2.cljs` | 0 | 0 | 0 | yes |
| `src/eta_mu/extensions/custom_providers.cljs` | 0 | 1 | 0 |  |
| `src/eta_mu/extensions/graph_memory.cljs` | 0 | 0 | 0 | yes |
| `src/eta_mu/extensions/opencode_global_instructions.cljs` | 0 | 3 | 0 | yes |
| `src/eta_mu/extensions/opmf_contract_gate.cljs` | 0 | 6 | 0 | yes |
| `src/eta_mu/extensions/opmf_contract_gate_test.cljs` | 0 | 0 | 0 | yes |
| `src/eta_mu/extensions/receipt_river.cljs` | 0 | 2 | 0 | yes |
| `src/eta_mu/extensions/session_mycology.cljs` | 0 | 2 | 0 | yes |
| `src/eta_mu/build/opencode/opmf_contract_gate.cljs` | 0 | 1 | 0 |  |

No promise-chain or `js-await` signals. Multiple files exceed 300 lines and/or contain likely long functions.

## Work items

- [ ] Run `pnpm --filter @open-hax/eta-mu-extensions lint:kondo` and capture the full output.
- [ ] For every error: fix the source.
- [ ] For every warning: either fix, annotate with `#_:clj-kondo/ignore` + explanatory comment, or open a follow-on task and reference it.
- [ ] If new shared-rule findings appear in files not listed above, resolve them too.

## Acceptance criteria

- [ ] `pnpm --filter @open-hax/eta-mu-extensions lint:kondo` exits with zero errors.
- [ ] All warnings are either fixed or annotated with a justification comment.
- [ ] No new `#_:clj-kondo/ignore` appears without a comment.
- [ ] No `js-await`/`js-await*` usage remains in source or test trees.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/eta-mu-extensions lint:kondo
```

---

## Completion

- **Status:** done
- **Completed:** 2026-06-15
- **Final lint results:**
  - `pnpm --filter @open-hax/eta-mu-extensions lint:kondo` => errors: 0, warnings: 0
- **Tests:** `pnpm -C packages/extensions test` => 72 tests, 195 assertions, 0 failures, 0 errors
- **Summary of changes:**
  - Fixed all original 18 clj-kondo errors in `lib/eta_mu/macros/event.cljc`, `lib/eta_mu/macros/state.cljc`, `lib/eta_mu/macros/tool.cljc`, and `lib/eta_mu/core.cljc`.
  - Resolved non-promise warnings across `lib/eta_mu/opencode.cljs`, `lib/eta_mu/opencode_target.cljs`, `lib/eta_mu/pi_target.cljs`, `src/eta_mu/contracts/core.cljs`, `src/eta_mu/extensions/chronos.cljs`, `src/eta_mu/extensions/websearch_open_hax.cljs`, and `src/eta_mu/extensions/image_render.cljs`.
  - Converted two extension tool handlers (`chronos`, `websearch-open-hax`) and `image-render` to `^:async`/`await`.
  - Replaced a problematic `cond` with `case` in `opencode_global_instructions.cljs`.
  - Namespace-level ignored `:promise-chain/prefer-async-workflow` in `lib/eta_mu/opencode.cljs`, `src/eta_mu/build/opencode/opmf_contract_gate.cljs`, `src/eta_mu/extensions/graph_memory.cljs`, and `src/eta_mu/extensions/opmf_contract_gate.cljs`, each with a justification comment explaining why a wholesale async migration is out of scope for this pass.
- **Follow-up:** A future task should migrate the remaining promise-chain-heavy files (`graph_memory.cljs`, `opmf_contract_gate.cljs`, `build/opencode/opmf_contract_gate.cljs`, `lib/eta_mu/opencode.cljs`) to `^:async`/`await` once the surrounding tool/hook contracts are reviewed for async compatibility.

---

**Review note:** Verified clean by parent agent — `lint:kondo` exits 0 errors, 0 warnings.
