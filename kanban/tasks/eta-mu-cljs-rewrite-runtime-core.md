---
uuid: "eta-mu-cljs-rewrite-runtime-core"
title: "Eta-mu CLJS Rewrite — Runtime Core Port"
status: "done"
priority: P0
labels: ["tasks", "cljs", "rewrite", "runtime", "13sp"]
created_at: "2026-05-29T21:18:48Z"
source: "kanban/epics/eta-mu-cljs-runtime-rewrite.md"
points: 13
category: tasks
---

# Eta-mu CLJS Rewrite — Runtime Core Port

> Parent epic: `kanban/epics/eta-mu-cljs-runtime-rewrite.md`
> Planning output: `docs/cljs-runtime-rewrite-runtime-core-plan.md`
> Points: 13

## Purpose

Port the pure eta-mu runtime core into CLJS before migrating effectful command paths.

## Scope

- message and content-part domain data
- session state and context construction
- model/provider selection data, excluding provider SDK I/O
- tool descriptor data and composition rules
- output-contract and prompt-section law
- receipt/session metadata shapes where pure

## Work items

- [x] Define Malli schemas in `law.*` for public runtime data crossing package boundaries.
- [x] Implement pure `domain.*` decisions with no Node, provider SDK, FS, git, process, or HTTP access.
- [x] Implement `shape.*` transforms for existing TS/JS DTO compatibility.
- [x] Add regression tests against representative current eta-mu/Pi message and tool payloads.
- [x] Keep text/image/audio content-part extensibility explicit.

## Acceptance criteria

- [x] Pure runtime core tests pass under the CLJS test target.
- [x] Current JS callers can round-trip representative runtime payloads through the CLJS facade.
- [x] Boundary schemas reject at least one malformed payload per major data type.
- [x] No raw JS interop appears outside allowed facade/extern namespaces.

## Verification

```bash
pnpm --dir packages/eta-mu-runtime cljs:verify
pnpm --dir packages/eta-mu-runtime test
pnpm --dir packages/eta-mu-runtime typecheck
pnpm --dir packages/eta-mu-runtime build
pnpm test
pnpm -C packages/eta-mu-extensions build
```

## Notes

Implemented in `packages/eta-mu-runtime` with CLJS `law.*`, `domain.*`, and `shape.*` namespaces for content parts, agent messages, model descriptors, tool descriptors, and session context data. The JS facade now exposes runtime-core constructors/converters while keeping package `main`/`types` pointed at the existing TypeScript build.

`pnpm --filter @open-hax/eta-mu-cli test` was also attempted after building local package dependencies. It is still blocked by pre-existing clipboard OSC52 environment assertions in `packages/coding-agent/test/clipboard.test.ts` (2 failures), while 108 CLI test files passed and 7 were skipped.


---

**Independent review 2026-06-13 (Sonnet).** VERDICT: DONE (medium-high confidence). law/domain/shape namespaces present; domain.* confirmed free of Node/SDK/FS/HTTP interop; malformed-payload rejection tests exist per data type; boundary scanner clean (35 checked, 0 violations). Caveat: CLJS test suite pass/fail not executed. Needs one `cljs:test` run before promotion to done.

---

**Promoted to done 2026-06-13** after an executed verification run (not just static review): cljs:verify, vitest, cljs:coverage (93.77%% ≥90 gate), and the surface-parity --version test all passed (exit 0). Moved review → document → done via the FSM-enforced, ledger-backed path.
