---
uuid: "receipt-recorded-at-type-convergence"
title: "Converge receipt timestamps on one type"
status: "incoming"
type: "task"
priority: "P2"
points: "3"
category: "tasks"
write-id: "1786026748559-0.d1uy9rp669inm2fvknu"
created_at: "2026-08-06T14:32:28.559Z"
---

# Converge receipt timestamps on one type

## Outcome

`:event/recorded-at` has one type across the whole receipt ledger, and the law
says which one.

## The evidence

`receipts.edn` holds both forms today — 2 records with `#inst`, 5 with an ISO
string — at the same schema version 1. This is permitted, not broken:
`receipt-river/law/receipt.cljs` defines `valid-timestamp?` as an explicit `or`
over `inst?` and a valid ISO-8601 string, so both pass envelope validation.

Raised by CodeRabbit on PR #167 as a data-integrity risk: a consumer that sorts
or compares recorded times without normalizing will behave differently across
the two forms. The tolerance is real, and so is the hazard it permits.

## Scope

- Decide the canonical form. `extern/runtime.cljs` `now-timestamp` currently
  returns `(.toISOString (js/Date.))`, so string is the de facto writer output;
  `#inst` is the older form and the one EDN readers hand back as a `Date`.
- Apply the decision forward in the writer.
- Tighten `valid-timestamp?` to the chosen form, behind a schema version bump if
  the tolerance is being removed rather than narrowed.
- Give consumers a normalizing read helper so neither form has to be handled at
  every call site.

## Non-goals

- Rewriting the historical records in `receipts.edn`. It is an append-only
  ledger; editing seven past events to change their type is the history edit the
  ledger exists to prevent. Convergence is forward-only.

## Acceptance criteria

- One documented canonical type for `:event/recorded-at`.
- The writer emits only that type.
- The law accepts the historical form on read without letting it be written.
- A test asserts both, using a fixture that contains both historical forms.
