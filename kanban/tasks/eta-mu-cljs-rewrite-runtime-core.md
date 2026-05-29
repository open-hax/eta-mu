---
uuid: "eta-mu-cljs-rewrite-runtime-core"
title: "Eta-mu CLJS Rewrite — Runtime Core Port"
status: todo
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

- [ ] Define Malli schemas in `law.*` for public runtime data crossing package boundaries.
- [ ] Implement pure `domain.*` decisions with no Node, provider SDK, FS, git, process, or HTTP access.
- [ ] Implement `shape.*` transforms for existing TS/JS DTO compatibility.
- [ ] Add regression tests against representative current eta-mu/Pi message and tool payloads.
- [ ] Keep text/image/audio content-part extensibility explicit.

## Acceptance criteria

- [ ] Pure runtime core tests pass under the CLJS test target.
- [ ] Current JS callers can round-trip representative runtime payloads through the CLJS facade.
- [ ] Boundary schemas reject at least one malformed payload per major data type.
- [ ] No raw JS interop appears outside allowed facade/extern namespaces.

## Verification

```bash
cd orgs/open-hax/eta-mu
pnpm -C <cljs-runtime-package> exec shadow-cljs compile test
pnpm -C <cljs-runtime-package> test
pnpm --filter @open-hax/eta-mu-cli test
```
