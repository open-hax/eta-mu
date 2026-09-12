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
| GraphOperations | Nodes/edges, neighboring node IDs filtered by direction and edge type, bounded traversal returning full node records |
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

Canonical reads acquire each ledger's owning inode lock before parsing its
snapshot. A query or provider open waits for another process to complete an
append, so a partially written final EDN form cannot be mistaken for corrupt
committed history. The native public tests split a real locked append across
two processes and verify that both query and open preserve the complete history.

Concurrent first openers share the winner of the exclusive ledger create. Only
the native `EEXIST` race is reopened, and the winning history still undergoes
canonical validation. Other filesystem errors propagate; a missing ledger
beside known schemas is never silently recreated. `pnpm test:concurrent-open`
runs two actual Node processes through this race and verifies both documents
survive a subsequent reopen.

Every public EDN factory rejects absent and whitespace-only directories before
filesystem effects. Local user creation records a server-issued `created-at`
timestamp; public updates cannot replace it, and replay preserves it. `pnpm test`
includes actual ESM tests for these public contracts and concurrent first open,
in addition to the CLJS suite.

The record protocols store generic maps, not application-specific schemas.
Result declarations therefore expose unvalidated application fields as optional
`unknown`: narrow document content, graph labels, translation text, and label
names before using them. Every admitted record has a string ID. Session and
document timestamps may be supplied by callers, so their declarations also
require narrowing; the server-owned user creation timestamp remains a string.
Updating a missing session or labeling a missing translation returns `null`.
Explicit non-map record submissions are refused before append. Graph neighbor
queries retain their `string[]` result contract and refuse malformed projected
identities instead of omitting edges or returning values of another type.

Event retry identity compares the complete originally submitted envelope,
preserved separately from generated defaults in the same transaction. Dropping
a payload or adding a formerly omitted default changes that intent and is
refused, including after restart. Older history without a stored intent accepts
only an exact copy of its full stored envelope; partial retries cannot be proven
identical and are refused.

Password verification and its login result use one transaction history. A
credential change competing with that admission causes a stream conflict;
callers must retry the complete authentication operation against current state.

All services share one stream. Concurrent processes may receive a stream
conflict and should retry the whole operation. Reads and appends validate all
history, favoring inspection and correctness over speed. Subscriptions poll
every 50 ms and deliver new matching events in canonical order, including bursts
from other process instances. Handles are process-local and must be closed.
If a subscription cannot read valid history, it reports the failure and closes;
repairing the ledger requires explicitly opening a new subscription. JavaScript
watch handles expose `close()` immediately, including the legacy EDN adapter.
Room subscription handles may be copied with only their declared `id` and
`close()` fields and passed to `unsubscribe`; internal handle fields are not
required.
JavaScript `emit-to-room` returns `Promise<void>`: await it to observe persistence
completion and catch rejected writes. It does not return a stored notification.
The other `Promise<void>` operations (`close-session`, `archive-document`, and
`apply-label`) likewise resolve to JavaScript `undefined` after completion.
Optional JavaScript option objects accept both omission and explicit `undefined`;
an explicit `null` record remains invalid for `create-session`.

Queries support equality, nested field paths, `$and`, `$or`, `$eq`, `$ne`, `$in`,
`$nin`, `$exists`, `$gt`, `$gte`, `$lt`, and `$lte`. Other operators are refused;
this is a service adapter, not a Mongo wire-protocol or aggregation emulator.
Every `$and` and `$or` child must be a query map; a null child is invalid.
Range operators compare compatible value types without numeric/string coercion.
Existing same-type ordering is retained, including comparable vectors and
instants. Missing, null, mixed-type or otherwise incomparable values do not
match a range and do not prevent other documents from matching.
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
pnpm -C packages/protocols test:types
pnpm -C packages/protocols lint:kondo
```

The test script compiles and then runs the bundle once. Real-file tests cover all
eight EDN protocols, replay, credential redaction, admission conflicts, malformed
history, stale writers, subscription bursts and independent provider selection.
The TypeScript consumer fixture verifies that neighbor IDs are strings while
traversal returns node records, using the workspace's declared TypeScript compiler.
Existing remote-record tests remain in the same suite. NBB consumes `nbb.edn`;
CLJS consumers use `deps.edn` or the shadow configuration. Node uses Clio's pinned
native lock addon, shared through the workspace package manager.
