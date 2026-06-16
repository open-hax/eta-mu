---
uuid: "shared-kondo-config-wire-event-ledger"
title: "Wire shared clj-kondo config into event-ledger"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 1
category: "tasks"
---

# Wire shared clj-kondo config into event-ledger

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 1

## Purpose

Merge the shared config into event-ledger while preserving its package-local `(malli.core/=>)` exclusion.

## Scope

- `packages/event-ledger/.clj-kondo/config.edn`
- `packages/event-ledger/package.json`

## Baseline state
event-ledger already has a full `.clj-kondo/config.edn` that duplicates the shared `:linters`, `:unresolved-namespace`, and `:hooks`. It also adds `(malli.core/=>)` to `:unresolved-symbol` exclusions, which is package-local and must survive.

## Work items

- [ ] Rewrite `packages/event-ledger/.clj-kondo/config.edn` to contain:
  - `:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]`
  - `:linters {:unresolved-symbol {:exclude [(malli.core/=>)]}}`
- [ ] Add `"lint:kondo": "clj-kondo --lint src/ test/"` to `packages/event-ledger/package.json` scripts (or reuse the existing `lint` command under the new name).
- [ ] Run `pnpm install` so the workspace link resolves.

## Acceptance criteria

- [ ] `packages/event-ledger/.clj-kondo/config.edn` uses `:config-paths` and only preserves the `(malli.core/=>)` exclusion.
- [ ] No shared `:linters`, `:unresolved-namespace`, or `:hooks` entries remain duplicated locally.
- [ ] `pnpm --filter @promethean-os/event-ledger lint:kondo` exits 0 with only warnings (no config-resolution errors).
- [ ] No source files under `packages/event-ledger/src` or `packages/event-ledger/test` are modified.

## Verification

```bash
pnpm install
pnpm --filter @promethean-os/event-ledger lint:kondo
```

---

## Completion notes

- Rewrote `packages/event-ledger/.clj-kondo/config.edn` to use `:config-paths` and preserved only the `(malli.core/=>)` exclusion under `:linters {:unresolved-symbol {:exclude [(malli.core/=>)]}}`.
- Added `"lint:kondo": "clj-kondo --lint src/ test/"` to `packages/event-ledger/package.json` scripts.
- Ran `pnpm install` to resolve workspace links.
- Verified with `pnpm --filter @promethean-os/event-ledger lint:kondo`; exit code 0, only warnings from source lint (hook `api/meta` resolution warnings), no config-resolution errors.
- No source files under `packages/event-ledger/src` or `test` were modified.

### Files touched

- `packages/event-ledger/.clj-kondo/config.edn`
- `packages/event-ledger/package.json`

### Status

status: done

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; clean (0 errors / 0 warnings).
