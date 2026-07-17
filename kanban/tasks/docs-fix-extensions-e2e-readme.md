---
uuid: "docs-fix-extensions-e2e-readme"
title: "Fix packages/extensions-e2e README paths and claims"
status: icebox
priority: "P2"
labels: ["docs", "extensions-e2e", "readme", "1sp"]
created_at: "2026-06-17T00:00:00Z"
source: "docs discovery sweep 2026-06-16"
points: 1
category: "tasks"
---
# Fix packages/extensions-e2e README paths and claims

## Context

`packages/extensions-e2e/README.md` has wrong directory paths, instructs npm instead of pnpm, and contains a misleading claim about Pi event field names.

## Findings

- README says `cd packages/eta-mu-extensions-e2e` but the directory is `packages/extensions-e2e`.
- Instructs `npm install && npm test`; repo uses pnpm and workspace links.
- Claims tests use Pi 0.67.1 field names (`toolName`, `input`, etc.), but the test code uses namespaced keywords (`:tool/name`, `:tool/params`, etc.).
- `docs/cljs-runtime-rewrite-architecture-inventory.md` lists `extensions-e2e` as "Defer until extension surface is stable", but it is now active.
- `docs/kondo-config-baseline.md` says `extensions-e2e` has no `.clj-kondo` and no `lint:kondo`, but both now exist.

## Acceptance

- [ ] Rewrite `packages/extensions-e2e/README.md` with the correct path, pnpm commands, and accurate test fixture description.
- [ ] Update `docs/cljs-runtime-rewrite-architecture-inventory.md` to mark `extensions-e2e` as active.
- [ ] Update `docs/kondo-config-baseline.md` to reflect the current `.clj-kondo` and `lint:kondo` status.
