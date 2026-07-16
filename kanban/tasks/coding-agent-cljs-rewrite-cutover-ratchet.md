---
uuid: "coding-agent-cljs-rewrite-cutover-ratchet"
title: "Coding Agent CLJS Rewrite — Legacy Retirement"
status: "blocked"
priority: "P0"
labels: ["tasks", "cljs", "rewrite", "coding-agent", "3sp"]
created_at: "2026-06-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 3
category: "tasks"
---

# Coding Agent CLJS Rewrite — Legacy Retirement (re-scoped from Cutover Ratchet)

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Points: 3
> Re-scoped 2026-07-15; original scope preserved in the comment history below.

## Purpose

Absorb the remaining useful behavior of `packages/legacy/*` into the new CLJS
packages, then delete `packages/legacy/` in one final cleanup PR (per the
architecture inventory, 2026-07-08 update). The original in-place TS-module
replacement plan is void: the 2026-07-12 decision record dropped legacy
package/binary contract preservation and the monotonic TS-line-count ceremony.

## Scope

- Maintain a short "legacy value ledger": for each `packages/legacy/*` package,
  what behavior the new stack still lacks and which card owns porting it
  (reference behavior only — no TS interop).
- Delete each legacy package once its ledger rows are all owned-and-done or
  explicitly descoped.
- Resolve the bin collision: `packages/legacy/coding-agent` and
  `packages/eta-mu` both declare `eta-mu` and `pi` bins.
- Retire the TS-line-count baseline machinery (`scripts/ts-line-count.mjs`,
  `.ts-line-count-baseline`) when the last legacy package is deleted.

## Definition of done

- [ ] A legacy value ledger exists in this card or a linked doc, with one row
      per `packages/legacy/*` package: keep-porting (card link) / descoped
      (reason).
- [ ] `packages/legacy/` is deleted; `pnpm install` and root `pnpm test` green.
- [ ] Workspace configs, CI workflows, and docs no longer reference legacy
      paths or `@open-hax/eta-mu-cli`.
- [ ] TS-line-count guard retired.

## Blocked on

North-star parity cards for behavior the new stack still lacks: SSE streaming,
session persistence, full-screen terminal host, and the extensions/package-
manager scope decisions on the parent epic.

## Verification

```bash
pnpm install
pnpm test
git grep -l "packages/legacy" -- ':!kanban' ':!docs' | wc -l  # → 0
```

---
**Blocking assessment:** Blocked by all preceding implementation tasks: domain, extern, infra, and mode parity must be complete and tests passing before TS modules can be replaced safely.

Board triage 2026-07-15: re-scoped from 'in-place TS cutover ratchet' to 'legacy retirement'. The original premise (replace TS modules behind stable facades, monotonic line count, preserve @open-hax/eta-mu-cli binary contract) was voided by the 2026-07-12 decision record. New scope: legacy value ledger -> port-or-descope each remaining legacy behavior -> delete packages/legacy wholesale -> retire ts-line-count machinery. Stays blocked on the parity cards (SSE streaming, session persistence, terminal host) and the extensions/package-manager scope decisions on the parent epic.
---
