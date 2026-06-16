---
uuid: "shared-kondo-config-create-package"
title: "Create packages/kondo-config shared clj-kondo config package"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "3sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 3
category: "tasks"
---

# Create packages/kondo-config shared clj-kondo config package

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 3

## Purpose

Create the shared clj-kondo config package that every wired CLJS package will consume through `:config-paths`. This package is infrastructure only: it exports `config.edn` and the `promise_chain.clj` hook. No `defroute` hook is included (that is knoxx/backend-specific and stays in `packages/sol`).

## Scope

- `packages/kondo-config/package.json`
- `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/config.edn`
- `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/hooks/promise_chain.clj`

## Work items

- [ ] Create `packages/kondo-config/package.json` with:
  - `name: "@open-hax/kondo-config"`
  - `private: true`
  - `files: ["clj-kondo.exports"]`
  - `license: "GPL-3.0-or-later"`
- [ ] Write `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/config.edn` with shared rules:
  - `:lint-as` for `shadow.cljs.modern/js-await` and `js-await*` as `clojure.core/let`.
  - `:linters`:
    - `:unresolved-symbol` exclusions for common JS globals (`js/console`, `js/Promise`, `js/Error`, etc.).
    - `:promise-chain/prefer-async-workflow {:level :warning}`.
    - `:fn-length/long {:level :warning}`, `:fn-length/too-long {:level :error}`.
    - `:file-length/long {:level :warning}`, `:file-length/too-long {:level :error}`.
    - `:complexity/high {:level :warning}`, `:complexity/too-complex {:level :error}`.
    - `:discouraged-var` entries for `shadow.cljs.modern/js-await` and `js-await*` with the deprecation message.
  - `:unresolved-namespace {:exclude [js]}`.
  - `:hooks`:
    - `:analyze-call` mapping `cljs.core/ns`, `->`, `->>`, `do`, `let`, `when`, `when-let`, `if`, `defn`, `defn-` to `hooks.promise-chain/...`.
- [ ] Copy or write `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/hooks/promise_chain.clj` implementing `check`, `check-defn`, and `check-ns`.
- [ ] Ensure `pnpm-workspace.yaml` already matches `packages/*` (it does); verify pnpm sees the new package after `pnpm install`.
- [ ] Add a root `"lint:kondo"` script to `package.json` that runs `pnpm -r --no-bail --if-present lint:kondo` (or an equivalent explicit filter list). Using `--if-present` lets the aggregate script remain green before all wire tasks land.
- [ ] Add `packages/kondo-config` to `.gitignore`? No — this is a source package and must be committed. Do **not** add it to `.gitignore`.

## Acceptance criteria

- [ ] `packages/kondo-config/package.json` is valid JSON and has the expected fields.
- [ ] `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/config.edn` is valid EDN and contains the shared `:linters`, `:hooks`, and `:lint-as` entries.
- [ ] `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/hooks/promise_chain.clj` exists and defines `hooks.promise-chain/check`, `hooks.promise-chain/check-defn`, and `hooks.promise-chain/check-ns`.
- [ ] Running `clj-kondo --lint packages/kondo-config/clj-kondo.exports` produces zero config-resolution errors (it may produce lint findings on the hook file itself; those are acceptable in this task).
- [ ] Root `package.json` has `"lint:kondo"` (e.g., `pnpm -r --no-bail --if-present lint:kondo`).
- [ ] `pnpm lint:kondo` exits without config-resolution / missing-script errors.
- [ ] No `imports/` directory is created inside `packages/kondo-config`.
- [ ] No `defroute` hook is added.

## Verification

```bash
pnpm install
clj-kondo --lint packages/kondo-config/clj-kondo.exports
pnpm lint:kondo
```

---

## Completion notes

- Created:
  - `packages/kondo-config/package.json`
  - `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/config.edn`
  - `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/hooks/promise_chain.clj`
- Modified:
  - `package.json` — added `"lint:kondo": "pnpm -r --no-bail --if-present lint:kondo"`
  - `.gitignore` — replaced `**/.clj-kondo/` with `**/.clj-kondo/.cache` and `**/.clj-kondo/imports` so `.clj-kondo/config.edn` and hooks are tracked
  - `packages/kondo-config/clj-kondo.exports/open-hax/kondo-config/config.edn` fixes:
    - `:hooks` `:analyze-call` keys now use fully-qualified `cljs.core/...` forms
    - `:unresolved-symbol` exclusions expanded to full common JS globals set plus `await`
    - `:discouraged-var` messages for `shadow.cljs.modern/js-await` and `js-await*` updated to the deprecation message
- Verification:
  - `pnpm install` — passed.
  - `clj-kondo --lint packages/kondo-config/clj-kondo.exports` — passed with `errors: 0, warnings: 0`.
  - `pnpm lint:kondo` — executed without config-resolution or missing-script errors. Downstream packages report existing lint findings (handled by `kondo-lint-cleanup-*` tasks).
- Guardrails:
  - No `imports/` directory was created inside `packages/kondo-config`.
  - No `defroute` hook was added.
- Status: done.

---

**Review note (2026-06-15):** Shared package created; config resolves; hook uses api/reg-finding!.
