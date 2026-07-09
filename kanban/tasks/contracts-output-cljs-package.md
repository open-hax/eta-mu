---
uuid: "contracts-output-cljs-package"
title: "Create packages/contracts/output CLJS Package"
status: "done"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "output-contracts", "8sp"]
created_at: "2026-07-08T21:45:00Z"
source: "kanban/tasks/legacy-package-reorganization.md"
points: 8
category: "tasks"
---

# Create packages/contracts/output CLJS Package

> Parent: `kanban/tasks/legacy-package-reorganization.md`
> Parent epic: `kanban/tasks/eta-mu-cljs-rewrite-architecture-inventory.md`
> Source legacy package: `packages/legacy/output-contract-gate`

## Purpose

Port `packages/legacy/output-contract-gate` to the new `packages/contracts/output` package as the first CLJS rewrite slice. This is the smallest, most focused law/shape package and is the natural place to prove the new package naming and boundary rules before touching larger legacy packages.

## Scope

- All source under `packages/legacy/output-contract-gate/src/**/*.ts`
- Existing law schemas already staged in `packages/runtime/src/cljs/eta_mu/gate/law/contract.cljs`
- Existing tests under `packages/legacy/output-contract-gate/tests/` or `test/`
- Public surface: binary `output-contract-gate` and package export `.`
- New package location: `packages/contracts/output`

## Work items

- [x] Create `packages/contracts/output` with `package.json`, `shadow-cljs.edn`, and README.
- [x] Move the law layer from `packages/runtime/src/cljs/eta_mu/gate/law/contract.cljs` to `packages/contracts/output/src/cljs/eta_mu/contracts/output/law/contract.cljs` and update its namespace.
- [x] Move the shape and domain layers (markdown, validate, review, repair, fixtures, extern) from `packages/runtime/src/cljs/eta_mu/gate` to `packages/contracts/output` and update namespaces.
- [x] Move the corresponding tests from `packages/runtime/test/cljs/eta_mu/gate` to `packages/contracts/output/test/cljs/eta_mu/contracts/output`.
- [x] Port the contract compiler (`eta-mu.contracts.output.shape.edn`) using the native `clojure.edn` reader and a normalizer that turns `(agent-output-contract ...)` into the map shape defined by `law.contract`. No external EDN parser is needed.
- [x] Port the generation layer (`eta-mu.contracts.output.domain.generate` + `eta-mu.contracts.output.infra.generate`) and artifact writer (`eta-mu.contracts.output.infra.artifacts`) from the legacy package. Includes JSON contract coercion for artifact bundles.
- [x] Port the CLI gate facade as a thin `eta-mu.contracts.output.infra.cli` wrapper around the pure law/shape code, exposed as the `output-contract-gate` binary.
- [x] Delete or empty the corresponding source in `packages/legacy/output-contract-gate` once parity is proven and downstream consumers are updated.
- [x] Update `packages/eta-mu` (future base package) to depend on `packages/contracts/output` if it needs the CLI gate. (Package is available; dependency will be declared when `packages/eta-mu` is created.)

## Acceptance criteria

- [x] `packages/contracts/output` contains zero TypeScript source files.
- [x] All existing `output-contract-gate` behavior is preserved and tested.
- [x] `pnpm --dir packages/contracts/output test` passes.
- [x] `pnpm --dir packages/contracts/output typecheck` passes (or equivalent CLJS verification).
- [x] Global TS line count decreases compared to the current baseline.
- [x] No new files are added to `packages/legacy/output-contract-gate`.

## Verification

```bash
pnpm --dir packages/legacy/output-contract-gate test
pnpm --dir packages/contracts/output test
pnpm --dir packages/contracts/output typecheck
node scripts/ts-line-count.mjs
```
