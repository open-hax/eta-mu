---
category: "tasks"
labels: ["tasks", "cljs", "event-ledger", "contracts", "2sp"]
write-id: "1784489226331-0.lsutu75dokpdkrzd4u"
points: "2"
source: "kanban/epics/katamorph-canonical-cutover.md"
title: "Event-Ledger — fix the dist bug or descope to the envelope contract"
priority: "P2"
status: "ready"
uuid: "event-ledger-envelope-truth"
created_at: "2026-07-19T00:00:00Z"
---

# Event-Ledger — fix the dist bug or descope to the envelope contract

> Parent epic: `kanban/epics/katamorph-canonical-cutover.md`
> Target repo: `/home/err/spaces/event-ledger` (standalone; tracked here).

## Purpose

What consumers actually share is the **envelope schema**, not the Mongo
store:

- muse hand-mirrors the envelope (`eta_mu/actor/{envelope,store}.cljc`)
  because of a documented dist bug — muse
  `boundaries/mongo/ledger.cljs` ANOMALY (2026-07-12): the built dist drops
  keyword namespaces on write (stores `"type"`, not `"event/type"`) and
  leaves `ledger/seq` null under mongodb driver ≥ 5, so its own documented
  indexes can't match what it stores.
- rheos dropped the package entirely (EDN `event-admission` from protocols).
- sol requires only `open-hax.event-ledger.schema/validate-envelope` for its
  EDN session ledgers.

Make the package tell the truth: either the Mongo store works, or the
package is the envelope contract and stores are adapters.

## Scope

Decision fork — pick one, record why:

- **Fix**: repair the dist write path (keyword-namespace serialization +
  `ledger/seq` under driver ≥5), add a round-trip test that inserts via the
  built dist and asserts the documented index keys match stored documents.
  Then retire muse's ANOMALY bypass (follow-up card in muse).
- **Descope**: the package's contract surface becomes the envelope schema
  (+ validators); Mongo append/watch code moves behind an explicitly
  optional adapter namespace or out of the package. README rewritten to
  match.

Either way:
- Fix the README drift (still says `@promethean-os/event-ledger` /
  `promethean.event-ledger.*`; actual is `@open-hax/` + `open-hax.*`).
- Reconcile `index.d.ts` typed exports vs `shadow-cljs.edn :exports`
  (README-claimed exports missing from the ESM build).
- Tag a release; record coordinates in a comment; note consumer bumps
  needed (sol deps.edn, muse deps.edn/package.json).

## Definition of done

- [ ] Decision recorded (fix vs descope) with rationale.
- [ ] Standalone tests green including the new round-trip test (if fix) or
      restructured surface tests (if descope).
- [ ] README/package name drift corrected; export list truthful.
- [ ] New tag pushed + coordinates commented; muse ANOMALY retirement path
      stated (card link or explicit deferral).