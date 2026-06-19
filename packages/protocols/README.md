# @promethean-os/openplanner-protocols

Cross-package ClojureScript protocol and schema definitions for OpenPlanner
system domains. This package owns the **shape layer**: the canonical event
envelope, its Malli schema and validators, and the `defprotocol` contracts that
describe how clients interact with each OpenPlanner domain (event admission,
sessions, documents, graph, translations, labels, users, realtime). It defines
contracts only — concrete record implementations back onto Mongo change
streams, REST, Socket.IO, or an append-only EDN file.

## Scope and layer ownership

- **Canonical envelope** — `promethean.openplanner-protocols` defines the
  event-ledger envelope schema (`:event/type`, `:event/from`, `:causal/root`,
  `:delivery/mode`, `:payload`, …) as Malli data and a `validate-envelope`
  predicate over it. The schema is a deliberate mirror of
  `event-ledger/schema.cljs` (see the in-source TODO about extracting a shared
  schema package if the two drift).
- **Domain protocols** — eight `defprotocol`s: `EventAdmission`,
  `SessionManagement`, `DocumentStorage`, `GraphOperations`,
  `TranslationManagement`, `LabelManagement`, `UserManagement`,
  `RealtimeSubscription`.
- **Transport-specific implementations** under `src/promethean/records/`:
  - `records/edn/` — `EdnFileEventAdmission`, an append-only EDN-file-backed
    `EventAdmission` with an atom-based async write mutex (no MongoDB).
  - `records/mongo/` — Mongo change-stream backed records for every domain.
  - `records/rest/` — REST-adapter records (with a shared `rest/http` helper).
  - `records/socket-io/` — Socket.IO transport records (the realtime path).

## Build and test

This is an active CLJS package built with shadow-cljs (Malli `0.17.0` is the
only CLJS dependency; `socket.io-client` is a runtime JS dependency for the
Socket.IO records). Run scripts from this package directory:

```bash
# Compile the ESM library build (-> dist/, entry promethean.records.edn.event-admission)
pnpm -C packages/protocols run compile:lib

# Compile and run the node-test suite (ns matching promethean.*-test)
pnpm -C packages/protocols run compile:test
pnpm -C packages/protocols run test

# Lint with the shared OpenHax clj-kondo config
pnpm -C packages/protocols run lint:kondo
```

`compile:test` emits `target/test.cjs` (autorun); the `test` script just runs
that compiled output with `node`. See `AGENTS.md` for CLJS construction-order
conventions.

## Public surface

ESM consumers import `@promethean-os/openplanner-protocols`. The `:lib`
shadow-cljs build exports three functions:

| Export | Source ns | Purpose |
|--------|-----------|---------|
| `makeEnvelope(eventType, payload)` | `promethean.openplanner-protocols/make-envelope` | Build a minimal envelope with the required fields |
| `validateEnvelope(envelope)` | `promethean.openplanner-protocols/validate-envelope` | Validate against the canonical schema → `{valid, errors?}` |
| `createEdnEventAdmission(ledgerDir)` | `promethean.records.edn.event-admission/create-edn-event-admission` | Factory for an EDN-file-backed `EventAdmission` (writes `ledger.edn` in `ledgerDir`) |

`edn-entry.mjs` is a thin bridge that imports `dist/main.js` and re-exports
`createEdnEventAdmission` (also as the module default). TypeScript consumers get
hand-written typings from `index.d.ts`, which declares the `EventEnvelope` shape
plus interfaces for all eight protocols (`EventAdmission`,
`EdnFileEventAdmission`, `SessionManagement`, `DocumentStorage`,
`GraphOperations`, `TranslationManagement`, `LabelManagement`, `UserManagement`,
`RealtimeSubscription`).

CLJS consumers require the namespaces directly: `promethean.openplanner-protocols`
for the schema/validators/protocols, and the relevant `promethean.records.*`
namespace for a transport implementation.

## Consumers

OpenPlanner-stack packages that speak the event-ledger envelope. The protocol
definitions are designed to be implemented by per-transport record types so a
client can swap Mongo / REST / Socket.IO / EDN-file backends behind the same
contract.
