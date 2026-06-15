---
uuid: "output-contract-gate-cljs-rewrite-domain-core"
title: "Output Contract Gate CLJS Rewrite — Domain Core"
status: done
priority: P1
labels: ["tasks", "cljs", "rewrite", "output-contract-gate"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/output-contract-gate-cljs-rewrite.md"
points: 5
category: tasks
---
# Output Contract Gate CLJS Rewrite — Domain Core

> Parent epic: `kanban/epics/output-contract-gate-cljs-rewrite.md`
> Points: 5

## Purpose

Port the pure contract compilation, markdown extraction, structural validation, and repair-prompt logic from TypeScript to ClojureScript.

## Deliverables

- `eta_mu.gate.domain.contract`: compile an EDN agent-output-contract into a normalized contract IR.
- `eta_mu.gate.domain.markdown`: parse markdown into an AST and extract sections, including bold-as-heading normalization.
- `eta_mu.gate.domain.validate`: required-section, unique-section, section-order, allowed-node-types, and count-rule checks.
- `eta_mu.gate.domain.repair`: compile a repair prompt from validation failures and templates.
- `eta_mu.gate.shape.*`: converters between CLJS IR and TS-compatible DTOs.

## Verification gate

- [x] CLJS tests reproduce the success case in `validate.test.ts`.
- [x] CLJS tests reproduce the deterministic failure case in `validate.test.ts`.
- [x] CLJS tests reproduce the bold-subheading regression case in `validate.test.ts`.
- [x] CLJS tests reproduce the repair prompt assertions in `repair.test.ts`.
- [x] No Node, FS, HTTP, or provider SDK interop appears in domain namespaces.

---

> Blocked by `output-contract-gate-cljs-rewrite-law-schemas` (needs Malli IR contracts) and `output-contract-gate-cljs-rewrite-inventory` (needs module mapping).

---

Work started: porting validate.ts, repair.ts, and review.ts stub/message logic to ClojureScript under `packages/runtime/src/cljs/eta_mu/gate/domain/`.

---

Delivered:
- `packages/runtime/src/cljs/eta_mu/gate/domain/validate.cljs` — `validate-markdown-response` and `to-failure-report` parity with Malli-guarded boundaries.
- `packages/runtime/src/cljs/eta_mu/gate/domain/repair.cljs` — `compile-repair-prompt` parity with template interpolation.
- `packages/runtime/src/cljs/eta_mu/gate/domain/review.cljs` — `build-stub-review-report` and `build-review-messages` (GPT message building only; no fetch).
- `packages/runtime/src/cljs/eta_mu/gate/shape/markdown.cljs` — pure CLJS markdown parser/section extractor (no JS interop) producing string node types aligned with `eta_mu.gate.law.contract`.
- `packages/runtime/src/cljs/eta_mu/gate/shape/fixtures.cljs` — compiled five-section contract fixture and valid/invalid markdown responses.
- `packages/runtime/test/cljs/eta_mu/gate/domain_test.cljs` — tests covering validate (success, deterministic failures, bold-subheading regression), repair prompt, stub review, and review messages.

Verification results:
- `pnpm --dir packages/runtime cljs:compile` — passed.
- `pnpm --dir packages/runtime cljs:test` — 87 tests, 375 assertions, 0 failures, 0 errors.

Notes:
- The existing `eta_mu.gate.law.contract` Malli schemas (kebab-case keys, string AST node types) were adopted as the source of truth; domain code and fixtures were aligned to them.
- Domain namespaces contain no Node/FS/HTTP/provider interop; markdown parsing is pure ClojureScript.
- The GPT fetch reviewer was intentionally not ported per the task scope (belongs to the `extern` adapter task).

Recommended next task: `output-contract-gate-cljs-rewrite-extern-adapters` (EDN parser, markdown AST adapter if unified/remark is preferred over the pure CLJS parser, FS, and HTTP fetch adapters).

---

**Boundary fix (2026-06-15):** Added `eta-mu.gate.extern.js` to host `parse-int` and `now-iso`, removing raw `js/` interop from `eta-mu.gate.shape.markdown` and `eta-mu.gate.domain.review`. `pnpm --dir packages/runtime cljs:boundary` now passes, and `cljs:test` remains green.
