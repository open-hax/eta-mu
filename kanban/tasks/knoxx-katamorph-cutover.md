---
category: "tasks"
labels: ["tasks", "cljs", "knoxx", "katamorph", "contracts", "5sp"]
write-id: "1784489226723-0.4s63gj7xae79swednl3"
points: "5"
source: "kanban/epics/katamorph-canonical-cutover.md"
title: "Knoxx — cut over to katamorph contract runtime (deferred: reference impl lags)"
priority: "P2"
status: "icebox"
uuid: "knoxx-katamorph-cutover"
created_at: "2026-07-19T00:00:00Z"
---

# Knoxx — cut over to katamorph contract runtime

> Parent epic: `kanban/epics/katamorph-canonical-cutover.md`
> Target repo: `/home/err/spaces/knoxx`. **Deliberately iceboxed** — per the
> epic, knoxx is the reference implementation and cuts over last, after the
> sol cutover + guard prove the pattern.

## Purpose

knoxx's `backend/src/cljs/open_hax/contracts/schema.cljs` (592 lines) is the
direct ancestor of `katamorph.schema` — byte-identical docstrings and def
order — plus a sibling `contract-runtime` source-path package
(`backend/shadow-cljs.edn` pulls `../../contract-runtime/src/cljs`). knoxx
consumes zero katamorph today. Cut it over so the reference implementation
also interprets the canon instead of carrying the ancestral copy.

## Scope (sketch — re-scope when thawed)

- Replace `open-hax.contracts.schema` + `open-hax.contracts.policy.*`
  requires with `katamorph.{schema,policy.*}` via git-ref dep.
- Map the `contract-runtime` sibling package's surface onto katamorph's
  `registry/resource`, `store/*`, `action/interpreter`; delete what's
  redundant, upstream what's missing.
- knoxx's live contract tree (`knoxx/contracts/`) already validates against
  katamorph's schemas (same EDN wire shapes) — verify, don't assume.
- No-regression gate against knoxx's own test suite; baseline before
  touching anything.

## Definition of done (draft)

- [ ] Zero local defs of katamorph-owned schema names in knoxx backend.
- [ ] `knoxx/contracts/*` validates through katamorph at runtime.
- [ ] knoxx test suite green vs pre-cutover baseline; no checks relaxed.

## Thaw conditions

- `sol-katamorph-schema-cutover` done (pattern proven on the smaller system).
- `contract-redefinition-guard` exists to keep knoxx from re-drifting.
- katamorph ≥ v0.2.0 with any schema fixes the sol cutover surfaced.