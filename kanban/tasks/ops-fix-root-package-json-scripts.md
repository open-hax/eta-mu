---
uuid: "ops-fix-root-package-json-scripts"
title: "Fix root package.json scripts to reference real packages"
status: "incoming"
priority: "P1"
labels: ["ops", "package-json", "scripts", "2sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 2
category: "tasks"
---

# Fix root package.json scripts to reference real packages

## Context

The root `package.json` scripts reference packages that no longer exist under those names, which breaks `pnpm test`, `pnpm typecheck`, and `pnpm docs:ts`.

## Findings

- `test` references `@open-hax/eta-mu-github` and `@open-hax/kanban-legacy`.
- `typecheck` references `@open-hax/eta-mu-github`, `@open-hax/eta-mu-docs`, and `@open-hax/kanban-legacy`.
- `docs:ts` references `@open-hax/eta-mu-cli`.
- The real packages are `@open-hax/eta-mu-github` → `packages/legacy/github` (`@open-hax/eta-mu-github`), `@open-hax/eta-mu-docs` → `packages/legacy/docs` (`@open-hax/eta-mu-docs`), `@open-hax/eta-mu-cli` → `packages/legacy/coding-agent` (`@open-hax/eta-mu-cli`), and `@open-hax/kanban-legacy`.
- Some of these packages may not have a `test` or `typecheck` script at all.

## Acceptance

- [ ] Audit each script in root `package.json` and verify the referenced package/script exists.
- [ ] Update `test`, `typecheck`, and `docs:ts` scripts to use real package names and scripts.
- [ ] Remove or rewrite scripts for packages that have been deleted.
- [ ] Run the corrected scripts to confirm they execute without "unknown package" errors.
