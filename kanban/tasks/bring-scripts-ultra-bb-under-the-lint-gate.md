---
uuid: "bring-scripts-ultra-bb-under-the-lint-gate"
title: "Bring scripts ultra.bb under the lint gate"
status: "incoming"
type: "task"
priority: "P2"
points: "2"
labels: "lint, babashka, tooling, debt"
category: "tasks"
write-id: "1785441334743-0.nezn5t8zbx2d5bz7ha"
created_at: "2026-07-30T19:55:34.743Z"
---

# Bring scripts/ultra.bb and ultra_test.bb under the lint gate

## Outcome

Every Babashka script in `scripts/` passes clj-kondo, and the lint gate lints all
of them rather than an allowlist.

## Current state

`scripts/lint.bb` lints only its own gate scripts (`test.bb`, `lint.bb`) because
the other two are not clean. The exclusion is a named vector with a comment, not
a silent omission — this card removes it.

- `scripts/ultra.bb:281` — unused binding `limit` in `run-implement-stage`.
- `scripts/ultra.bb:288` — `Single argument to str already is a string` (info).
- `scripts/ultra_test.bb` — 7 `Unresolved symbol` errors (`dispatch!`,
  `run-gate!`, `run-implement-stage`, `git-commit!`, `card-fsm!`, `run-stage`,
  `run-stages`) plus an unresolved `p` namespace. These are not real defects: the
  test pulls its subject in with `(load-file "scripts/ultra.bb")`, which
  clj-kondo cannot follow statically.

## Scope

- Fix the unused binding and the `str` info in `ultra.bb` (check whether `limit`
  should have been threaded into the stage call rather than deleted — an unused
  binding can be a dropped argument, not dead code).
- Make `ultra_test.bb` analysable. Options, in preference order: give the scripts
  real namespaces and `require` instead of `load-file`; or add a `.clj-kondo`
  config for `scripts/` declaring the loaded vars; or a kondo hook. Prefer the
  first — it fixes the cause rather than silencing the symptom.
- Add the `p` alias require the test is missing.
- Widen `gate-scripts` in `scripts/lint.bb` to every `scripts/*.bb`, discovered
  rather than listed, so a new script cannot arrive unlinted.
- Verify `bb scripts/ultra_test.bb` still passes after any restructuring.

## Non-goals

- Changing what ultra.bb does. This is lint and analysability only.
- Porting the remaining `.mjs` scripts to Babashka — related but separate.

## Acceptance criteria

- `clj-kondo --lint scripts/<each>.bb` is 0 errors / 0 warnings for every script.
- `scripts/lint.bb` discovers the scripts instead of hardcoding an allowlist, and
  the exclusion comment is gone.
- `bb scripts/ultra_test.bb` still passes.
- `bb scripts/lint.bb` exits 0.
