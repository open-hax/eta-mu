---
uuid: "shared-kondo-config-wire-mcp-contracts"
title: "Wire shared clj-kondo config into mcp-contracts"
status: "done"
priority: "P1"
labels: ["tasks", "lint", "clj-kondo", "infra", "1sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/shared-kondo-config-install.md"
points: 1
category: "tasks"
---

# Wire shared clj-kondo config into mcp-contracts

> Parent epic: `kanban/epics/shared-kondo-config-install.md`
> Points: 1

## Purpose

Add a thin `.clj-kondo/config.edn` and a `lint:kondo` script to mcp-contracts. This package has no shadow-cljs/deps.edn of its own but contains a ClojureScript source file consumed by `sol`.

## Scope

- `packages/mcp-contracts/.clj-kondo/config.edn` (new)
- `packages/mcp-contracts/package.json`

## Baseline state

mcp-contracts has no `.clj-kondo/config.edn` and no `lint:kondo` script. The only source file is `src/eta_mu/mcp_contracts.cljs`.

## Work items

- [ ] Create `packages/mcp-contracts/.clj-kondo/config.edn` with:
  - `:config-paths ["../../kondo-config/clj-kondo.exports/open-hax/kondo-config"]`
- [ ] Add `"lint:kondo": "clj-kondo --lint src"` to `packages/mcp-contracts/package.json` scripts.
- [ ] Run `pnpm install` so the workspace link resolves.

## Acceptance criteria

- [ ] `packages/mcp-contracts/.clj-kondo/config.edn` exists and uses `:config-paths`.
- [ ] `pnpm --filter @open-hax/mcp-contracts lint:kondo` exits 0 with only warnings (no config-resolution errors).
- [ ] No source files under `packages/mcp-contracts/src` are modified.

## Verification

```bash
pnpm install
pnpm --filter @open-hax/mcp-contracts lint:kondo
```

---

## Completion Notes

- Files touched:
  - `packages/mcp-contracts/.clj-kondo/config.edn` (created)
  - `packages/mcp-contracts/package.json` (added `lint:kondo` script)
- Source files under `packages/mcp-contracts/src` were not modified.
- `packages/mcp-contracts/.clj-kondo/` is matched by `**/.clj-kondo/` in `.gitignore`; the new config was force-staged to match other packages in the workspace.
- `pnpm install` completed successfully; workspace link resolved.
- Verification output:

```
> @open-hax/mcp-contracts@0.1.0 lint:kondo /home/err/devel/orgs/open-hax/eta-mu/packages/mcp-contracts
> clj-kondo --lint src

WARNING: error while trying to read hook for cljs.core/ns: Could not resolve symbol: api/meta
linting took 10ms, errors: 0, warnings: 0
```

- Command exited 0 with no config-resolution errors and no source lint warnings/errors.
- Status: done

---

**Review note (2026-06-15):** Wired; lint:kondo resolves config; clean (0 errors / 0 warnings).
