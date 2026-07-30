# Event Envelope v1 Correction — 2026-07-29

Status: architecture correction / implementation verification  
Supersedes: the statement in `docs/architecture/contract-dialect-and-data-authority.md` that the canonical event-ledger schema has no in-band envelope-version field  
Last reverified: 2026-07-30

## Source ledger

Implementation claims in this note are bounded to these immutable revisions and paths:

- `open-hax/event-ledger@ada7374b7f4e1c3b0ab4e6bbe996f10f06e9b93a`
  - [`src/open_hax/event_ledger/schema.cljs#L19-L63`](https://github.com/open-hax/event-ledger/blob/ada7374b7f4e1c3b0ab4e6bbe996f10f06e9b93a/src/open_hax/event_ledger/schema.cljs#L19-L63)
  - [`src/open_hax/event_ledger/schema.cljs#L65-L83`](https://github.com/open-hax/event-ledger/blob/ada7374b7f4e1c3b0ab4e6bbe996f10f06e9b93a/src/open_hax/event_ledger/schema.cljs#L65-L83)
- `open-hax/eta-mu@5af74786737c896beb288d15ae36982a972fa013`
  - [`packages/axxium/src/cljs/axxium/schema.cljs#L67-L76`](https://github.com/open-hax/eta-mu/blob/5af74786737c896beb288d15ae36982a972fa013/packages/axxium/src/cljs/axxium/schema.cljs#L67-L76)
  - [`packages/sol/src/cljs/open_hax/sol/shape/episode_event.cljs#L88-L136`](https://github.com/open-hax/eta-mu/blob/5af74786737c896beb288d15ae36982a972fa013/packages/sol/src/cljs/open_hax/sol/shape/episode_event.cljs#L88-L136)
  - [`packages/sol/src/cljs/open_hax/sol/shape/episode_event.cljs#L168-L219`](https://github.com/open-hax/eta-mu/blob/5af74786737c896beb288d15ae36982a972fa013/packages/sol/src/cljs/open_hax/sol/shape/episode_event.cljs#L168-L219)
  - [`packages/sol/src/cljs/open_hax/sol/infra/agent/episode_turn.cljs#L38-L178`](https://github.com/open-hax/eta-mu/blob/5af74786737c896beb288d15ae36982a972fa013/packages/sol/src/cljs/open_hax/sol/infra/agent/episode_turn.cljs#L38-L178)
- `open-hax/katamorph@305a5e49d834aca27566f739e8510f6b409fda78`
  - [`src/cljs/katamorph/schema.cljs#L117-L142`](https://github.com/open-hax/katamorph/blob/305a5e49d834aca27566f739e8510f6b409fda78/src/cljs/katamorph/schema.cljs#L117-L142)
  - [`src/cljs/katamorph/schema.cljs#L176-L203`](https://github.com/open-hax/katamorph/blob/305a5e49d834aca27566f739e8510f6b409fda78/src/cljs/katamorph/schema.cljs#L176-L203)
- `docs/architecture/contract-dialect-and-data-authority.md`, including its pinned Epiphany review source `octave-commons/epiphany@bdcd61f43f9bf8e1fd9e4549f169466842a5b19a`.

Claims about Knoxx, OpenPlanner, or an implemented Epiphany event-ledger adapter are explicitly marked pending below; this note does not present them as code-verified.

## Signal

The canonical event-ledger schema now exposes an optional in-band
`:envelope/version` field whose currently accepted literal value is `1`.
Legacy envelopes may omit it. New Sol principal-bound run/turn episodes emit
`:envelope/version 1` and validate the resulting envelope through the imported
standalone event-ledger package.

The older architecture-record statement that no envelope-version field exists
was correct for the schema revision reviewed on 2026-07-26, but became stale
when event-ledger PR #2 landed and Sol adopted that revision.

## Observed canonical shape

The additive v1 extension includes the following envelope-level references:

```clojure
{:envelope/version 1
 :event/id ...
 :event/type ...
 :event/time ...
 :event/from
 {:actor-id ...
  :actor-kind ...
  :actor-node ...
  :principal/binding
  {:binding/version 1
   :principal/actor-id ...
   :principal/entity-id ...
   :principal/kind ...
   :principal/org-id ...
   :actor/resource
   {:resource/id ...
    :resource/revision ...}}}
 :event/to ...
 :causal/root ...
 :causal/parent ...
 :causal/compensates ...
 :session/id ...
 :turn/id ...
 :run/id ...
 :episode/id ...
 :delivery/mode ...
 :delivery/id ...
 :payload {...}
 :contracts [...]
 :contract/refs
 [{:resource/id ...
   :resource/revision ...}]
 :expectations {...}}
```

Only `:event/type` remains required for the legacy append path. The v1 marker
and the new references are additive. The ledger validates and preserves
principal and resource references; it does not resolve identity, authorize the
producer, or interpret resource semantics.

## Two binding contracts, not one

Axxium and event-ledger expose related but non-identical v1 maps:

```text
Axxium RuntimePrincipalBinding
  = closed identity/scope binding
  = binding version + principal actor/entity/kind/org fields

Event-ledger PrincipalBindingV1
  = event attribution projection
  = copied Axxium identity fields
  + optional Katamorph :actor/resource reference
```

Axxium's `RuntimePrincipalBinding` is closed and does not admit
`:actor/resource`. Event-ledger's `principal-binding-schema` does admit that
field. A consumer must therefore validate the emitted envelope projection with
event-ledger's schema, not with Axxium's closed runtime-binding validator.

The shared literal `:binding/version 1` does not make the maps schema-identical.
Whether the event-ledger projection should receive a separately named or
separately versioned contract remains an open cross-repository decision.

## Authority boundaries verified in code

- **Axxium** owns live runtime principal identity and the closed
  `RuntimePrincipalBinding` contract.
- **Katamorph** defines actor/agent resource contracts and resource identity
  carried by the optional ledger reference.
- **event-ledger** owns the event envelope, its event-attribution projection,
  validation, append acceptance, ordering, causal links, replay, and filtering.
- **Sol** owns run, session, turn, episode, execution, and local run-projection
  semantics; it shapes Axxium identity plus an optional Katamorph resource into
  the event-ledger projection.

Sol does not manufacture principal identity from an agent specification. It
emits an event-ledger principal binding only when actor ID, entity ID, and a
recognized principal kind are supplied by the identity boundary. A Katamorph
contract ID and revision may be added as resource lineage without becoming
principal identity.

The architecture record assigns Epiphany the future role of observing these
events and deriving evidence-governed records and projections. Its currently
reviewed implementation does not yet include an eta-mu operational-ledger
source adapter, so that integration is architecture direction, not a verified
implementation claim.

## Sol episode lifecycle verified in code

Each wrapped service or queued turn attempts one causal chain:

```text
sol.run.started
  -> sol.turn.started
  -> sol.turn.completed | sol.turn.failed
  -> sol.run.completed  | sol.run.failed
```

One run, turn, episode, session, and causal-root context is shared by the chain.
The causal parent advances only after an event append is accepted.

Failure handling preserves the distinction between execution and ledger
persistence:

- failure to append the canonical start blocks execution;
- provider or turn execution failure remains a failed local run and attempts
  terminal failure events;
- terminal append failure after successful execution is reported separately and
  does not rewrite the successful local result as failed;
- contradictory failure events are not backfilled after success.

## Compatibility correction

Envelope compatibility now has two related mechanisms:

1. producers and consumers pin or import a known event-ledger schema revision;
2. version-aware producers may emit `:envelope/version 1`, while legacy
   envelopes remain valid without the marker.

Payload semantics and resource lineage remain separately versioned through
`:contracts`, `:contract/refs`, and nested binding/resource versions. The
presence of an envelope marker does not justify a single giant payload schema.

Older or foreign envelopes still require explicit adapters that preserve source
schema/revision and conversion provenance and report unsupported or lossy
conversion.

## Pending verification and design work

1. Update the main cross-repository architecture record to incorporate the
   additive v1 schema or add a direct backlink to this correction.
2. Decide whether the event-ledger principal projection needs a distinct
   contract name, a distinct version field, or both; no incompatible change is
   made by this note.
3. Cut and consume an immutable event-ledger release tag for this envelope
   revision; Sol currently pins the merged commit.
4. Add cross-repository conformance proving Sol, other producers, future
   Epiphany adapters, and compatibility bridges agree on legacy and v1 behavior.
5. Verify in code that Knoxx and OpenPlanner adapters preserve run, episode,
   principal-binding, compensation, and versioned resource references. No such
   verification is claimed here.
6. Decide how future incompatible envelope revisions are represented. No v2
   decision is made here.

## Disposition

This is a source-backed correction and implementation verification, not a new
architecture decision. It records the current executable contract, separates
the Axxium runtime binding from the event-ledger attribution projection, and
identifies the specific paragraph it supersedes. Future incompatible envelope
or binding-projection policy still requires explicit cross-repository
acceptance.
