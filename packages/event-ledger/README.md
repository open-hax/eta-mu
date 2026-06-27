# @promethean-os/event-ledger

Append-only event store for the OpenPlanner/Promethean event spine, backed by MongoDB.

A ClojureScript (shadow-cljs `:esm`) library that appends, validates, watches, and reads
events from the `event_ledger` MongoDB collection. Every write is normalized against a Malli
envelope schema, assigned a monotonic `ledger/seq` from a counters document, given an `expiresAt`
TTL, and inserted idempotently (duplicate `event/id` returns the existing document). Reads are
served over change streams (live watchers) and a cursor-paginated merge with a legacy `events`
collection.

## Build / Test

This package is a member of the eta-mu pnpm workspace. Run scripts with pnpm against this
package (`@promethean-os/event-ledger`):

```bash
# from the workspace root (/home/err/devel/orgs/open-hax/eta-mu)
pnpm --filter @promethean-os/event-ledger build   # shadow-cljs release lib -> dist/index.js
pnpm --filter @promethean-os/event-ledger watch    # shadow-cljs watch lib (dev)
pnpm --filter @promethean-os/event-ledger test     # shadow-cljs compile test && node target/test.cjs
pnpm --filter @promethean-os/event-ledger lint:kondo
```

The `build` target compiles the `:lib` build to `dist/` as an ES module; `test` compiles the
`:node-test` build (namespaces matching `promethean.event-ledger.*-test$`) to `target/test.cjs`
and runs it under Node. Sole runtime dependency is `metosin/malli` (declared in
`shadow-cljs.edn`); the published package consumes the host application's MongoDB driver — the
`db` handle is passed in by the caller, not bundled.

## Namespaces

Source lives under `src/promethean/event_ledger/`. The facade namespace
`promethean.event-ledger` re-exports the public CLJS API; the rest are internal slices.

| Namespace | Role |
|-----------|------|
| `promethean.event-ledger` | Public facade. Re-exports the functions below as plain `def`s. |
| `promethean.event-ledger.core` | Append pipeline: validate, fill defaults, assign `ledger/seq`, resolve TTL, idempotent insert (`append-event`, `append-events`, `setup-indexes`). |
| `promethean.event-ledger.schema` | Malli `envelope-schema` and `validate-envelope`. |
| `promethean.event-ledger.watcher` | MongoDB change-stream watchers (`watch-ledger`, `watch-once`, `close-watcher`, `close-all-watchers`) with a registry and stale-watcher cleanup. |
| `promethean.event-ledger.ttl-config` | Per-type TTL overrides from the `event_ttl_overrides` collection; `DEFAULT_TTL_DAYS` is 30 (`resolve-ttl`, `load-overrides`). |
| `promethean.event-ledger.rest-adapter` | Maps `EventEnvelopeV1` REST events to ledger envelopes (`rest-event->envelope`, `append-rest-event`, `append-rest-events`). |
| `promethean.event-ledger.legacy-bridge` | Cursor-paginated merge-read across `event_ledger` and the legacy `events` collection, dedup by `event/id` with ledger precedence. Gated by the `OPENPLANNER_EVENT_LEDGER_BRIDGE` env var (`bridge-enabled?`, `merge-find-events`, `find-event-by-id`). |
| `promethean.event-ledger.db` | MongoDB driver interop helpers (collection handles, `find-many`, `find-sorted`, `watch`, JS<->CLJS coercion). Internal. |

### Collections and indexes

- `event_ledger` — the events. `setup-indexes` creates a unique index on `event/id`, a compound
  `event/type`+`event/time` index, single-field indexes on `causal/root` and `session/id`, and a
  TTL index on `expiresAt` (`expireAfterSeconds: 0`).
- `_counters` — holds the `event_ledger` sequence document used for monotonic `ledger/seq`.
- `event_ttl_overrides` — per-type-prefix TTL overrides.
- `events` — the legacy collection read through the bridge (never written by this package).

## Envelope schema

Defined in `schema.cljs` as a Malli `:map`. An incoming envelope requires only `:event/type`;
`core/append-event` fills the rest of the defaults (UUID `:event/id`, ISO `:event/time`, a
`:causal/root`, a `:session/id`, and `:delivery/mode "tell"`) before validation.

| Key | Type | Notes |
|-----|------|-------|
| `:event/type` | string | Required. |
| `:event/id` | string | Optional input; defaulted to a UUID v4 on append. |
| `:event/time` | string | Optional input; defaulted to ISO now. |
| `:event/from` / `:event/to` | `{:actor-id, :actor-kind, :actor-node?}` | Optional actor descriptors. |
| `:causal/root` / `:causal/parent` | string | Causal chain links. |
| `:session/id` / `:turn/id` | string | Conversation grouping. |
| `:delivery/mode` | enum `tell` / `ask` / `stream` / `ack-required` | Defaults to `tell`. |
| `:delivery/id` | string | Optional. |
| `:payload` / `:expectations` | map | Optional. |
| `:contracts` | vector of string | Optional. |

On insert, `core` also stamps `:ledger/seq`, `:expiresAt`, `:createdAt`, and `:updatedAt`.

## JS / `index.d.ts` compatibility surface

The `:lib` build exports camelCase JS bindings (the `*-js` CLJS wrappers) consumed by the
TypeScript side of the workspace. Hand-written typings live at `index.d.ts` and declare the
`@promethean-os/event-ledger` module. Note the package's `types` entry points at the repo-root
`index.d.ts`, not a `dist/` file.

Exported functions (per `shadow-cljs.edn` `:exports` and `index.d.ts`):

```ts
appendEvent(db, envelope): Promise<LedgerEvent>
appendEvents(db, envelopes): Promise<LedgerEvent[]>
setupIndexes(db): Promise<void>
validateEnvelope(envelope): { valid: boolean; errors?: string[] }
watchLedger(db, filter, callback): WatcherHandle
watchOnce(db, filter, timeoutMs?): Promise<LedgerEvent | null>
closeWatcher(id): void
closeAllWatchers(): void
restEventToEnvelope(restEvent): Envelope
appendRestEvent(db, restEvent): Promise<RestAppendResult>
appendRestEvents(db, restEvents): Promise<RestAppendResult>
```

The `db` argument in every signature is a MongoDB `Db` handle supplied by the host application.
`index.d.ts` additionally describes the `Envelope`, `LedgerEvent`, `EventFrom`/`EventTo`,
`WatchFilter`, `RestEvent`, `RestAppendResult`, and `TtlOverride` shapes.

> Drift note: `index.d.ts` documents `resolveTtl`, `loadOverrides`, `bridgeEnabled`,
> `mergeFindEvents`, and `findEventById` as JS exports, but `shadow-cljs.edn` does not list these
> under `:exports`, so they are not surfaced by the compiled `dist/index.js`. They are available
> from the CLJS facade (`promethean.event-ledger`).
