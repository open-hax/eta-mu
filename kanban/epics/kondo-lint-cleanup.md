---
uuid: "kondo-lint-cleanup"
title: "clj-kondo lint clean-up pass"
status: "done"
priority: P1
labels: ["epics", "lint", "clj-kondo", "quality", "21sp"]
created_at: "2026-06-15T00:00:00Z"
source: "user-request:2026-06-15"
points: 21
category: epics
---

# clj-kondo lint clean-up pass

> Source: user request, 2026-06-15
> Board source: `orgs/open-hax/eta-mu/kanban/`
> Process: one PR per child task, OpenCode PR review required, CodeRabbit automatic review observed but not manually spammed
> Blocked on: `kanban/epics/shared-kondo-config-install.md`
> Points: 21

## Purpose

After the shared config is wired, run it against every CLJS package and resolve every finding. This epic is a ratchet, not a cosmetic cleanup: each child task should reduce the set of allowed kondo errors and unreviewed warnings.

> Quality thesis (from `eta-mu-quality-ratchet`): **Warnings are work items.** Missing generated runtime files are regressions. Tests must prove the shipped package, not only the source tree.

In the kondo domain this means: a warning left in the tree is either fixed, annotated with a justification because it is a confirmed false positive, or recorded as the explicit scope of a follow-on task. Silent drift is not allowed.

The baseline inventory in `docs/kondo-config-baseline.md` contains the pre-lint signal counts that form the starting inventory for each package.

## Scope

One child task per CLJS package wired in Epic 1: Rheos, axxium, chat-ui, event-ledger, extensions, extensions-e2e, katamorph, mcp-contracts, protocols, runtime, sol.

## Fix policy

For every finding reported by `pnpm --filter ... lint:kondo`:

1. **Fix the source** (preferred). Refactor promise chains into `^:async` workflows, split long functions, shorten files, remove `js-await`/`js-await*` usage.
2. **Annotate with `#_:clj-kondo/ignore`** only when the finding is a confirmed false positive. The annotation must be accompanied by a comment explaining why the suppression is safe.
3. **Open a follow-on task** if the fix requires structural refactoring beyond the task's scope. The warning must still be acknowledged — add a comment referencing the new task, and leave the finding at warning level only if the follow-on task is linked in the PR description.

No new `#_:clj-kondo/ignore` without a comment. No promise chains unless wrapped in `^:async`. No `js-await`/`js-await*` usage.

## Process constraints

- One PR per child task.
- Work from clean task worktrees branched from current `origin/main` after Epic 1 has merged.
- Keep path-scoped staging; do not stage root or nested `receipts.edn` unless the PR explicitly owns receipts.
- Keep package names, binaries, extension names, and public exports stable unless a task explicitly changes them.
- OpenCode PR code review is required before merge.
- CodeRabbit runs automatically; do not manually request review after every push. If automatic reruns are quota/usage-credit blocked after fixes, document addressed findings in a PR comment and proceed only when branch protection, CI, and OpenCode are green.

## Child tasks

1. `kanban/tasks/kondo-lint-cleanup-Rheos.md`
   - Run `lint:kondo` for Rheos and resolve all findings per the fix policy.

2. `kanban/tasks/kondo-lint-cleanup-axxium.md`
   - Run `lint:kondo` for axxium and resolve all findings per the fix policy.

3. `kanban/tasks/kondo-lint-cleanup-chat-ui.md`
   - Run `lint:kondo` for chat-ui and resolve all findings per the fix policy.

4. `kanban/tasks/kondo-lint-cleanup-event-ledger.md`
   - Run `lint:kondo` for event-ledger and resolve all findings per the fix policy.

5. `kanban/tasks/kondo-lint-cleanup-extensions.md`
   - Run `lint:kondo` for extensions and resolve all findings per the fix policy.

6. `kanban/tasks/kondo-lint-cleanup-extensions-e2e.md`
   - Run `lint:kondo` for extensions-e2e and resolve all findings per the fix policy.

7. `kanban/tasks/kondo-lint-cleanup-katamorph.md`
   - Run `lint:kondo` for katamorph and resolve all findings per the fix policy.

8. `kanban/tasks/kondo-lint-cleanup-mcp-contracts.md`
   - Run `lint:kondo` for mcp-contracts and resolve all findings per the fix policy.

9. `kanban/tasks/kondo-lint-cleanup-protocols.md`
   - Run `lint:kondo` for protocols and resolve all findings per the fix policy.

10. `kanban/tasks/kondo-lint-cleanup-runtime.md`
    - Run `lint:kondo` for runtime and resolve all findings per the fix policy.

11. `kanban/tasks/kondo-lint-cleanup-sol.md`
    - Run `lint:kondo` for sol and resolve all findings per the fix policy.

## Acceptance criteria

- [ ] Rheos `pnpm --filter @open-hax/kanban-cljs lint:kondo` exits with zero errors and all warnings are fixed or annotated with a justification comment.
- [ ] axxium `pnpm --filter @open-hax/axxium lint:kondo` exits with zero errors and all warnings are fixed or annotated.
- [ ] chat-ui `pnpm --filter @open-hax/chat-ui lint:kondo` exits with zero errors and all warnings are fixed or annotated.
- [ ] event-ledger `pnpm --filter @promethean-os/event-ledger lint:kondo` exits with zero errors and all warnings are fixed or annotated.
- [ ] extensions `pnpm --filter @open-hax/eta-mu-extensions lint:kondo` exits with zero errors and all warnings are fixed or annotated.
- [ ] extensions-e2e `pnpm --filter @open-hax/eta-mu-extensions-e2e lint:kondo` exits with zero errors and all warnings are fixed or annotated.
- [ ] katamorph `pnpm --filter @open-hax/katamorph lint:kondo` exits with zero errors and all warnings are fixed or annotated.
- [ ] mcp-contracts `pnpm --filter @open-hax/mcp-contracts lint:kondo` exits with zero errors and all warnings are fixed or annotated.
- [ ] protocols `pnpm --filter @promethean-os/openplanner-protocols lint:kondo` exits with zero errors and all warnings are fixed or annotated.
- [ ] runtime `pnpm --filter @open-hax/eta-mu-runtime lint:kondo` exits with zero errors and all warnings are fixed or annotated.
- [ ] sol `pnpm --filter @open-hax/sol lint:kondo` exits with zero errors and all warnings are fixed or annotated.
- [ ] Root `pnpm lint:kondo` exits with zero errors.
- [ ] No new `#_:clj-kondo/ignore` annotations are added without an explanatory comment.
- [ ] No `js-await` or `js-await*` usage remains in any wired CLJS package source or test tree.

## Verification map

Per-package:

```bash
pnpm --filter @open-hax/kanban-cljs lint:kondo
pnpm --filter @open-hax/axxium lint:kondo
pnpm --filter @open-hax/chat-ui lint:kondo
pnpm --filter @promethean-os/event-ledger lint:kondo
pnpm --filter @open-hax/eta-mu-extensions lint:kondo
pnpm --filter @open-hax/eta-mu-extensions-e2e lint:kondo
pnpm --filter @open-hax/katamorph lint:kondo
pnpm --filter @open-hax/mcp-contracts lint:kondo
pnpm --filter @promethean-os/openplanner-protocols lint:kondo
pnpm --filter @open-hax/eta-mu-runtime lint:kondo
pnpm --filter @open-hax/sol lint:kondo
```

Aggregate:

```bash
pnpm lint:kondo
```

## Known starting signals

- `docs/kondo-config-baseline.md` contains per-file pre-lint counts for promise-chain hits, likely long functions, `js-await` usage, and >300-line files.
- The actual clj-kondo run may surface additional findings beyond the pre-lint scan (e.g., unresolved symbols, unused bindings, type warnings).
- `sol-staging` is intentionally out of scope for both Epic 1 and Epic 2 until its workspace ownership is clarified.

---
## Dependency note (2026-06-15)

`shared-kondo-config-install` implementation is complete and all 11 CLJS packages resolve the shared config. This epic remains `blocked` until that work is merged to `origin/main`; after merge the child cleanup tasks can move to `in_progress`.

### Verified starting inventory (post-install)

| Package | Errors | Warnings | Notes |
|---------|--------|----------|-------|
| Rheos | 39 | 23 | Many `await` unresolved-symbol errors |
| axxium | 0 | 47 | Mostly promise-chain warnings |
| chat-ui | 13 | 7 | Includes Helix unresolved symbols |
| event-ledger | 0 | 0 | Clean |
| extensions | 18 | 172 | Includes macro/syntax errors |
| extensions-e2e | 0 | 2 | Clean |
| katamorph | 0 | 22 | Mostly promise-chain warnings |
| mcp-contracts | 0 | 0 | Clean |
| protocols | 0 | 12 | Promise-chain warnings |
| runtime | 0 | 46 | Mixed unused bindings / promise chains |
| sol | 4 | 23 | Includes `defroute`-related findings |

---
## Final implementation summary (2026-06-15)

All 11 child cleanup tasks are `status: done`. Verified by parent agent:

- `pnpm --filter <pkg> lint:kondo` exits with **0 errors, 0 warnings** for every wired package.
- Aggregate `pnpm lint:kondo` exits cleanly across all 11 packages.
- Representative test suites pass:
  - `pnpm --filter @open-hax/eta-mu-runtime cljs:test` → 152 tests, 683 assertions, 0 failures.
  - `pnpm --filter @open-hax/eta-mu-extensions test` → 72 tests, 195 assertions, 0 failures.
  - `pnpm --filter @open-hax/katamorph test` → 102 tests, 253 assertions, 0 failures.
  - `pnpm --filter @open-hax/sol test` → 66 tests, 193 assertions, 0 failures.

### What changed

- Promise chains (`.then`/`.catch`/`.finally`) were converted to `^:async` ClojureScript functions with bare `await`.
- Unused requires, private vars, and bindings were removed or renamed.
- Inline defs were extracted to proper `def`/`defn` forms.
- Deprecated schema references in `sol/law/contracts.cljs` were annotated with `#_:clj-kondo/ignore` and explanatory comments.
- Shared kondo config gained `helix.core/defnc` `:lint-as` rule to support Helix components.

### Remaining risks

- `sol-staging` remains unwired/out of scope.
- One sub-agent noted 2 pre-existing test failures in `promethean.records.mongo.user-management-test` that exist on HEAD and are unrelated to this lint cleanup.
- No `#_:clj-kondo/ignore` annotations were added without comments.
- No `js-await`/`js-await*` usage remains in any wired CLJS package.
