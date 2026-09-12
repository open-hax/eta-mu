# @open-hax/protocols

Eight ClojureScript service protocols with selectable implementations. The
local provider implements every protocol with canonical Clio events in EDN.
Mongo, REST and Socket.IO records remain available for existing integrations.

## Local development

```clojure
(require '[open-hax.openplanner-protocols :as p]
         '[open-hax.services.infra.providers :as providers])

(def services
  (providers/create-provider {:provider :edn :directory ".local/services"}))

;; In a ^:async ClojureScript function:
(await (p/store-document services {:id "notes" :content "Inspectable EDN"}))
(await (p/get-document services "notes"))
```

Node consumers can use the compiled ESM entrypoint. The bridge returns ordinary
JavaScript objects and promises, preserving namespaced event keys as strings:

```javascript
import { createEdnServices } from "@open-hax/protocols";
const services = createEdnServices(".local/services");
await services["store-document"]({ id: "notes", content: "Inspectable EDN" });
await services["get-document"]("notes");
```

`create-provider` is a multimethod. `:mongo` requires an explicitly connected
`:db`, with optional `:document-collection`; it composes the existing Mongo
records and existing in-process realtime adapter. Neither missing configuration
nor remote errors silently select EDN. `:overrides` accepts independently chosen
implementations under `:events`, `:sessions`, `:documents`, `:graph`,
`:translations`, `:labels`, `:users`, or `:realtime`; every override must satisfy
its public protocol. An EDN instance can supply `:documents` while the other
domains use Mongo. Existing REST and Socket.IO records can be supplied the same
way for the protocols they support.

## EDN behavior

| Protocol | Local behavior |
|---|---|
| EventAdmission | Validated wire envelopes, stable retries, conflicting identity refused, durable subscriptions |
| SessionManagement | Create/get/update/close, all replayed from Clio |
| DocumentStorage | Store/get/query/archive, archived documents remain inspectable |
| GraphOperations | Nodes/edges, directional and typed neighbors, bounded traversal |
| TranslationManagement | Store supplied segments/labels and atomically queue batches |
| LabelManagement | Create/apply/query, repeated application is idempotent |
| UserManagement | Local users, salted scrypt password digests, authentication and updates; get-user redacts credentials |
| RealtimeSubscription | Durable room messages, polling subscriptions, explicit close/unsubscribe |

Translation batches record requests; this storage provider does not generate
translations or fabricate model responses. Local authentication follows the
existing success/failure event interface and grants no production identity.

`services.edn` contains Clio events, one per line. `schemas/` holds their
content-addressed historical schemas. The existing OpenPlanner wire envelope is
stored as payload data; **Clio** owns canonical identity, schema hashing,
admission, causal ordering and replay. Each accepted transaction is one Clio
event. Reads reconstruct projections from validated history. Exact event
retries do not append twice; malformed history, missing ledger beside known
schemas, conflicting IDs and stale concurrent writes are refused.

All services share one stream. Concurrent processes may receive a stream
conflict and should retry the whole operation. Reads and appends validate all
history, favoring inspection and correctness over speed. Subscriptions poll
every 50 ms and deliver new matching events in canonical order, including bursts
from other process instances. Handles are process-local and must be closed.

Queries support equality, nested field paths, `$and`, `$or`, `$eq`, `$ne`, `$in`,
`$nin`, `$exists`, `$gt`, `$gte`, `$lt`, and `$lte`. Other operators are refused;
this is a service adapter, not a Mongo wire-protocol or aggregation emulator.
The existing Mongo/REST adapter semantics are preserved by this change.

## Legacy EDN compatibility

`createEdnEventAdmission` / `open-hax.records.edn.event-admission` remains the
legacy raw-envelope adapter used by existing Rheos board histories. New service
instances use `createEdnServices` / `open-hax.records.edn.services` and a separate
`services.edn` file. Old board data is never silently rewritten. A deliberate
importer is required before an existing board ledger can be retired. The
deprecated standalone `event-ledger` package is not a dependency of either
implementation.

## Build, run and verify

```bash
pnpm -C packages/protocols run compile:lib
pnpm -C packages/protocols test
pnpm -C packages/protocols lint:kondo
```

The test script compiles and then runs the bundle once. Real-file tests cover all
eight EDN protocols, replay, credential redaction, admission conflicts, malformed
history, stale writers, subscription bursts and independent provider selection.
Existing remote-record tests remain in the same suite. NBB consumes `nbb.edn`;
CLJS consumers use `deps.edn` or the shadow configuration. Node uses Clio's pinned
native lock addon, shared through the workspace package manager.
