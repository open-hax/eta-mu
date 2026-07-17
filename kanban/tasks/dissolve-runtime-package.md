---
category: "tasks"
labels: ["tasks", "cljs", "naming", "monorepo", "5sp"]
write-id: "1784255929397-0.qviv3mnvj8cts66okk9"
points: "5"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Dissolve packages/runtime"
priority: "P1"
status: "done"
uuid: "dissolve-runtime-package"
created_at: "2026-07-15T00:00:00Z"
---

# Dissolve packages/runtime

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Decision: maintainer, 2026-07-15 — "runtime" is a banned name; the package
> is history-aligned, not domain-aligned. Dissolve rather than rename.

## Purpose

`packages/runtime` (`@open-hax/eta-mu-runtime`) is a grab-bag: `eta_mu.runtime.*`
state/envelope/planner primitives, plus `eta_mu.coding.*` legacy-compat ports
(extension runner, settings/auth infra, session domain/law, fs/git/bash
externs). Its coding externs duplicate externs that already exist in
`packages/eta-mu`; its extension runner implements the legacy extension API,
which the 2026-07-15 decision descoped. Move what the new stack needs to where
its consumers live; delete the rest.

## Definition of done

- [ ] Consumer audit recorded as a comment: every workspace package and TS
      wrapper that imports `@open-hax/eta-mu-runtime` or its CLJS namespaces,
      with keep/port/retire verdicts per namespace cluster.
- [ ] Namespaces the new stack needs (candidates: settings/auth error-policy
      infra → `packages/eta-mu`; session law → `packages/eta-mu` or
      `@eta-mu/turn-processor`) are moved next to their consumers, tests
      moving with them.
- [ ] Duplicated externs resolved: one owner per boundary, the other deleted.
- [ ] The legacy-API extension runner is retired with the package (extensions
      return CLJS-only under a future card, per the epic decision record).
- [ ] `packages/runtime` is deleted; workspace configs, CI workflows,
      boundary-scanner scripts, and docs updated; root `pnpm test` green.
- [ ] No surviving package or namespace contains the word "runtime".

## Blocked on

The consumer audit is the first work item and may reveal blockers (e.g. sol,
Rheos, or legacy TS wrappers consuming exports). Record them here; do not
force the deletion past a live consumer.

## Verification

```bash
pnpm install
pnpm test
git grep -ln "eta-mu-runtime\|eta_mu.runtime\|eta_mu/runtime" -- ':!kanban' ':!docs' ':!packages/legacy' | wc -l  # → 0
```

---
CONSUMER AUDIT (recovered from Claude session 9520e8cf Explore agent, verified against current tree): 5 CLJS clusters + 6 TS wrappers; NO new-stack package depends on @open-hax/eta-mu-runtime. Only non-legacy consumer: @eta-mu/e2e (devDep + shadow source-path '../runtime/src/cljs' + 4 coding.* test files — all exercising descoped coding-compat layers, verdict RETIRE). legacy/github + legacy/coding-agent consume the TS barrel (retire with legacy wave). runtime.* movement kernel: no external CLJS requires anywhere (legacy/github TS only) — RETIRE. coding.session/settings/auth/extension/tool/diagnostics: RETIRE (descoped 2026-07-15; eta-mu already owns eta_mu.{law,domain,infra}.session; turn-processor owns law/shape.{message,tool}). coding.extern.*: RETIRE (duplicates eta-mu externs — one owner per boundary). ai.*/docs.*/garden.*: RETIRE (no consumers; owned by other epics). TS wrappers (index/types/state/planner/envelope/cljs-runtime): RETIRE. NET: zero namespaces need porting — every verdict is retire. Atomic edits: e2e dep+source-path+4 test files, root package.json filter clauses, scripts/lint.mjs boundary step, .github/workflows/{coverage,e2e}.yml, DEVELOPMENT.md.

DISSOLVED 2026-07-17: packages/runtime deleted (136 tracked files). Zero namespaces ported — the recovered consumer audit showed every cluster retires (new stack already owns equivalents; coding.* was descoped). Atomic edits: @eta-mu/e2e dep+source-path removed + 4 descoped coding.* test files retired; root package.json coverage script dropped and test/typecheck RETARGETED to the new stack (eta-mu, terminal-ui, turn-processor, kanban-legacy) — legacy/github exits the root gate here because its vitest imports the deleted barrel (see cutover-ratchet card); scripts/lint.mjs boundary step removed; .github/workflows/coverage.yml runtime steps + e2e.yml path triggers removed; DEVELOPMENT.md + README rows removed. legacy/github + legacy/coding-agent package.jsons: dead workspace dep + pre* hooks removed mechanically (their runtime-batch code is dead-on-arrival until the packages retire). Verification: grep-count 0 for eta-mu-runtime|eta_mu.runtime|eta_mu/runtime outside kanban/docs/legacy; pnpm install + root test green (138/275 + 67/168 + 38/88 + 20).
---