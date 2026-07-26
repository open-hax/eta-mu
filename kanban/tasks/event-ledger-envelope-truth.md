---
category: "tasks"
labels: ["tasks", "cljs", "event-ledger", "contracts", "2sp"]
write-id: "1784491625266-0.cg9yf0t43cuwi7t3gwi"
points: "2"
source: "kanban/epics/katamorph-canonical-cutover.md"
title: "Event-Ledger — fix the dist bug or descope to the envelope contract"
priority: "P2"
status: "done"
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

---
DONE 2026-07-19. DECISION: FIX (not descope) — both dist bugs were small once diagnosed, and the Mongo store is real load-bearing surface; descoping to envelope-only would have orphaned working watcher/bridge code. Root causes: (1) db/to-js used plain clj->js, whose key conversion is `name` — :event/type stored as "type" while every documented index/query uses "event/type"; fixed with :keyword-fn preserving namespaces. (2) assign-seq! read .-value from findOneAndUpdate — mongodb driver >= 6 returns the doc directly (includeResultMetadata default change), so ledger/seq was null; now handles both shapes. WHY TESTS MISSED IT: the old suite asserted on the RETURNED CLJS doc, never the INSERTED JS doc — new regression tests assert on the raw insertOne payload, plus scripts/dist-smoke.mjs round-trips through the committed dist/index.js itself (wired into npm test). Truth pass: README @promethean-os -> @open-hax throughout + standalone consume instructions; index.d.ts trimmed to actual ESM exports (5 over-claimed fns documented as CLJS-only); kondo config self-contained (broken ../../kondo-config path). Coordinates: io.github.open-hax/event-ledger {:git/tag "v0.3.0" :git/sha "f67c438d3c3b16ce9452a0c934f59101d1b95815"}. Consumers: sol bumped to v0.3.0 this session (gates green 97/368 + guard OK); MUSE ANOMALY RETIREMENT PATH: muse can now delete its hand-rolled append in boundaries/mongo/ledger.cljs and call the package (bump its deps.edn/package.json refs to v0.3.0) — follow-up belongs on muse's own board, noted here per DoD. Gates: event-ledger 33/125 0 fail + dist-smoke OK, kondo 0/0.
---