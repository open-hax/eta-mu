# Clio

Clio is a small content-addressed event-sourcing kernel for eta-mu.

It treats the immutable event set plus its causal/order graph as authority. A
physical ledger file is only one storage partition of that graph, and a
projection is disposable derived state.

## Laws

1. Committed events are immutable facts.
2. `:event/id` is globally stable identity. Exact duplicate ids dedupe; the same
   id with different data is corruption.
3. `:event/causes` defines causal edges. Every named cause must be present when a
   complete history is canonicalized.
4. `[:event/stream :event/seq]` defines an order-sensitive stream slot. Two
   distinct events claiming the same slot are a concurrent-write conflict.
5. Each stream revision after `1` directly names the previous stream event as a
   cause. This first slice intentionally canonicalizes complete stream histories,
   so sequences are contiguous from `1`.
6. Physical file order and file partitioning have no semantic authority.
7. A projection is a pure fold over the canonical event order and can be deleted
   and reconstructed.

For the same event multiset `E`, arbitrary physical partitions must therefore
obey:

```text
canonicalize(partition-a(E)) = canonicalize(partition-b(E))
project(canonicalize(partition-a(E))) = project(canonicalize(partition-b(E)))
```

Concurrent events in different streams remain unordered by the causal DAG. Clio
uses `[stream-id, stream-seq, event-id]` only as a deterministic replay tie-break
for graph-incomparable events; domain code must not mistake that tie-break for a
causal claim.

## Event shape

There is deliberately no hand-maintained `:event/version` integer.

```clojure
{:event/id "11111111-1111-4111-8111-111111111111"
 :event/schema
 {:schema/root "<sha256 of the complete namespace/schema tree>"
  :schema/id :post/published
  :schema/hash "<sha256 of this schema leaf>"}
 :event/type :post/published
 :event/stream "post:p1"
 :event/seq 1
 :event/causes []
 :event/actor "user:alice"
 :event/subject "post:p1"
 :event/at "2026-08-09T00:00:00.000Z"
 :event/data {:post/id "p1" :text "hello"}}
```

The schema bootstrap is intentionally small: it reveals the schema root, schema
id, leaf hash, and event type. Once that is readable, the exact historical Malli
schema validates the complete envelope.

## Content-derived schema revisions

A schema catalog is plain Clojure data mapping qualified schema ids to Malli
forms:

```clojure
{:post/published
 (clio.shape.schema/event-schema
  :post/published
  [:map {:closed true}
   [:post/id :string]
   [:text :string]])}
```

Clio derives a Merkle tree from the **logical namespace hierarchy and schema
forms**, never from source filenames:

```text
root
└── post
    ├── published  -> hash([:schema :post/published <malli-form>])
    └── retracted  -> hash([:schema :post/retracted <malli-form>])
```

Each namespace node hashes its namespace path, schema-leaf hashes, and child-node
hashes. The root hash therefore identifies the complete catalog structure.

When source schemas change, `clio.infra.runtime/open` materializes the new root
and persists the full catalog snapshot under that root automatically. There is no
version constant to remember to bump. Historical snapshots stay readable.

A leaf has its own hash as well as the catalog root. If `:post/retracted` is
unchanged while some unrelated `:dm/message-sent` schema changes, the two catalog
roots differ but the post schema leaf hash remains identical. Clio can therefore
report that an event shape is valid in every **known** catalog revision carrying
that same leaf hash while still requiring the event's recorded source root to be
known and internally consistent.

Schemas participating in revision identity must be data-only Malli forms. A
function, JS object, or other runtime identity in a schema is rejected by the
canonical EDN encoder rather than producing an unstable hash.

## Namespace construction order

Reusable code follows the repository construction order:

```text
law -> shape -> external -> domain -> infra
```

- `clio.law.*` — runtime-neutral predicates and invariants (`.cljc`).
- `clio.shape.*` — runtime-neutral Malli/canonical data shapes (`.cljc`).
- `clio.domain.*` — runtime-neutral schema Merkle logic, canonicalization, and
  projection folds (`.cljc`).
- `clio.external.js.*` — the only Clio namespace family that touches Node/JS
  libraries or builtins. Functions accept Clojure data and return Clojure data;
  Node handles and JS option objects stay inside the boundary (`.cljs`).
- `clio.infra.*` — NBB/Node orchestration over the pure kernel and boundary
  functions (`.cljs`).
- `bin/*.nbb` and `test/*.nbb` — thin NBB executable entrypoints only.

The shared clj-kondo construction-order hook recognizes `external` as the
explicit spelling of the existing `extern` boundary, and Clio promotes boundary
findings to errors.

Reusable runtime-specific code is `.cljs`, rather than `.nbb`, so the same
namespace implementation can be loaded by NBB and compiled by Shadow CLJS. The
`.nbb` files contain executable wiring, not a second implementation.

## Ledger format

A ledger is newline-delimited EDN:

```clojure
{:event/id "..." ...}
{:event/id "..." ...}
```

This keeps appends genuinely append-only. A complete logical history can be the
union of any number of such ledgers. Exact duplicated events across files are
harmless.

`clio.domain.canonicalize/canonicalize` performs:

```text
ledger files
    |
    v
union -> historical-schema validation -> UUID dedupe
    -> missing-parent checks
    -> stream-slot / continuity checks
    -> causal DAG
    -> deterministic topological order
```

The returned DAG preserves parent/child relationships separately from the replay
vector so callers do not have to infer causality from vector adjacency.

## NBB

Create an append-only ledger:

```bash
pnpm dlx nbb@1.3.201 bin/clio.nbb new events.edn
```

Inspect a catalog's automatically derived revision:

```bash
pnpm dlx nbb@1.3.201 bin/clio.nbb schema-root catalog.edn
```

Append an event using a catalog and persistent schema-history directory:

```bash
pnpm dlx nbb@1.3.201 bin/clio.nbb append \
  .clio/schemas catalog.edn events-a.edn :counter/opened \
  '{:event/stream "counter:a"
    :event/seq 1
    :event/actor "user:alice"
    :event/subject "counter:a"
    :event/data {:amount 10}}'
```

Canonicalize arbitrarily partitioned ledgers:

```bash
pnpm dlx nbb@1.3.201 bin/clio.nbb canonicalize \
  .clio/schemas events-a.edn events-b.edn events-c.edn
```

## Verification

```bash
pnpm --dir packages/clio lint
pnpm --dir packages/clio test
```

The test suite exercises both NBB and Shadow CLJS. It proves schema-root/leaf
version behavior, historical validation, UUID collision rejection, missing
parents, competing stream revisions, causal-cycle detection, projection
idempotence, and projection invariance under reordered/repartitioned/duplicated
physical ledgers.

## License

GNU LGPL v3 or later.
