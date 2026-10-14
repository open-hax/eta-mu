---
uuid: "9743b533-5c01-4b69-8089-1038f492048a"
title: "Reconcile guarded Rheos metadata writes with their completion events"
status: "incoming"
type: "task"
priority: "P1"
points: "8"
labels: "rheos,metadata,recovery,event-admission,8sp"
---

# Reconcile guarded Rheos metadata writes with their completion events

## Context

Current Rheos source at eta-mu a9ba661468d420f8bd7152b4fbffa2a7cde41c98 writes card content before appending the corresponding event. infra/transition.cljs calls infra/task_writeback.cljs and then domain/events.cljs. A failed append can therefore leave explicit metadata without matching completion custody. A repeated same-state operation currently returns a no-op before reading that custody. The EDN EventAdmission adapter in packages/protocols serializes appendFile calls in process; it does not establish durable operation reconciliation or identity-aware repeat admission.

Native PR352 root 4269032248 identified this concrete owner gap. Owner metadata card 775ab0be-90fe-469f-89e3-e6ac07b031ce must consume a separately qualified recovery authority rather than silently implementing a new protocol inside its five-point representation scope.

## Outcome

A guarded metadata operation either has verified matching card/event completion custody or retains an explicit recoverable/refused state. Persistence alone and a projected same-state no-op cannot claim completion. Recovery after a process restart reconciles the actual source and ledger through the canonical writer, preserving historical bytes and at most one accepted matching completion event.

## Scope and ownership

1. Pin the available same-repository boundaries. In open-hax/eta-mu, rheos.backend.infra.ledger/get-ledger constructs open-hax.records.edn.event-admission/create-edn-event-admission in packages/protocols/src/open_hax/records/edn/event_admission.cljs, implementing open-hax.openplanner-protocols/EventAdmission. Rheos owns metadata operation identity/phase/source custody; packages/protocols owns the existing compatibility wire envelope and raw board adapter. packages/clio/src/clio/law/ledger.cljc owns canonical exact-retry/identity-conflict admission, and packages/clio/src/clio/infra/ledger.cljc with clio.extern.js.fs owns locked append/durability. Reuse these local owners; do not create a competing identity law, raw-ledger writer or cross-repository Clio prerequisite.

2. Define portable named law contracts for operation identity, source custody and reconciliation results before shape/domain/infra implementation. Bind operation kind, board/task/source identity, before and intended-after hashes, expected protected fields, write-ID, intended completion envelope identity/body and an ordered recovery phase. Distinguish planned, card-persisted, completed, conflicted and uncertain facts. Unknown or malformed custody is refusal, not inferred success.
3. Retain durable intent through the canonical owned operation/event path before the card mutation. Reuse one operation/write identity across resume; it cannot be regenerated from a repeat invocation's wall clock. Define how existing event envelopes carry that identity without relabeling historical events or treating an intent/recovery observation as a lifecycle transition or completion event.
4. Reconcile fresh card bytes and canonical ledger observations. An intact before-image permits the initial guarded write. An exact intended-after image with the operation's write-ID permits completion reconciliation. A matching accepted completion yields completed readback without another append. Different source identity/content, conflicting completion body, duplicated ambiguous completion or untrusted custody yields a refused/conflicted result. An uncertain append must first be read back; absence is admissible only through the reviewed owning admission/concurrency contract, never a blind append retry.
5. Add stable completion admission to the existing raw-envelope adapter while retaining its EventAdmission interface, wire envelopes and board ledger bytes. Clio already implements identity/slot admission and OS-locked canonical append; the missing work is its compatible use by this raw adapter. Do not pass a raw board envelope directly to clio.infra.ledger/append-event!: that function requires historical canonical schema revisions, and clio.law.ledger/append-admission also checks canonical stream slots absent from raw board records. Narrowly expose/factor the existing identity-only decision in packages/clio/src/clio/law/ledger.cljc, preserving the canonical append-admission contract and its stream-slot checks. Make the protocol adapter consume that shared law and the existing clio.extern.js.fs owning-descriptor lock/read/append/sync primitives for one complete read → validate → identity-admit → append critical section. Validate the exact compatibility candidate before effects; retain its explicit identity, timestamp and full envelope across recovery. Matching completion is recognized without another accepted append; same identity with changed data refuses. Unknown/malformed/ambiguous source custody remains refused. No unlocked query-then-append, invented stream/schema fields, alternate mutex protocol, unchecked canonical-validation bypass or historical rewrite is admitted. Switching Rheos to create-edn-services/services.edn or importing its board ledger is a separate migration and is out of scope; if qualification requires that migration, stop and split before implementation.

6. Compose that authority in the existing task-writeback, transition, ledger and event paths. Reconstruct pending operations from durable custody after restart. The existing status operations return an explicit incomplete/refused recovery result until completion is established; they may not silently no-op merely because a status field is present. Reuse watcher correlation and preserve protected metadata, normal transition gates and error semantics.

## Acceptance criteria

- Definite event-append failure after a verified card write leaves a durable pending operation and a failed/incomplete result, with no accepted completion claimed.
- Restart/resume of that operation retains exact operation/write/source identity and reconciles through the canonical writer; it completes only with one matching accepted completion event and verified after-image.
- A completion append that persisted despite a lost response is recognized by fresh ledger readback; repeat recovery appends no duplicate completion.
- Conflicting source bytes, wrong task/source identity, mismatched event body, ambiguous duplicate observations, malformed custody and unsupported concurrent state refuse and preserve evidence. No guessed rollback, manual event fabrication or historical rewrite is permitted.
- A normal completed operation and repeated recovery yield the same completion custody. Ordinary already-explicit same-state cards with no pending initialization remain valid no-ops.
- Intent/recovery observations are distinguishable from the existing frontmatter completion event. Zero fake status-change/task-created events are emitted. Existing ledger prefixes remain byte-exact.
- Event admission behavior is implemented and qualified at its owning seam. Rheos operation decisions consume that contract; they do not duplicate event ledger semantics.

## RED and GREEN verification

1. After planning review and lawful readiness, reproduce the existing write-before-event behavior using the actual canonical status/write path on an owned temporary board. Inject append failure after card persistence and prove the current repeat falsely no-ops with missing completion custody. Capture this behavioral predecessor RED; a missing new API or fixture error is not evidence.
2. Add pure operation-law controls and actual file/ledger scenarios for restart/resume, unknown append outcome with an already-present matching event, repeated resume, conflicting source/event identity and malformed custody. Add tests at the owning event admission seam for identical completion and same-ID different-body, including its supported concurrent boundary.
3. Make the red-state commit, then implement law → shape → extern → domain → infra in the named owning packages. Run the complete registered Rheos suite and documented release/build/lint gates; the protocols compile:lib, test, test:types and lint:kondo gates; and all affected Clio law/kernel-lock/durability suites plus its full multi-runtime test/lint gates when Clio source is factored. Qualify real process restart, uncertain successful append and the shared owning-descriptor critical section, retaining exact source pins, assertion counts and zero-warning diagnostics. Existing raw-envelope read/write compatibility and unchanged canonical Clio schema/stream admission must remain controls.

4. Exercise the built canonical CLI against an owned temporary board with real readback and process restart. Record before/after/source/event/write-ID equality, every incomplete result and eventual qualified completion. A live planning board is not a test fixture.
5. Publish and adopt the qualified recovery source through the normal owner review/merge gates. Only then unblock metadata card 775ab0be-90fe-469f-89e3-e6ac07b031ce. No live Foresight normalization or production action is part of this source card.

## Estimate and non-goals

Proposed eight points: three for operation/source/phase laws and meaningful failure controls, three for durable custody plus integration through the actual owning event admission boundary, and two for restart/uncertain-response qualification and canonical adapter readback. This is independent of the metadata card's five points. The estimate is reviewed independently; split any wider event-kernel/concurrency redesign before implementation.

No global multi-writer CAS claim, general board migration, global serializer repair, new public status/deletion route, lifecycle fiction, source/event deduplication sweep, arbitrary rollback or manual ledger edit. No downstream Foresight operation, review transport, model call or Services/Knoxx deployment is included.

## Risks

Canonical Clio identity admission, locked append and the separate Clio-backed service provider already exist in this eta-mu revision. The missing capabilities are durable Rheos operation/source custody and qualified stable completion admission through its existing raw-envelope adapter; these are proposed source work, not a completed provider migration. A read-after-error may remain inconclusive; retain that state and refuse until actual admissible reconciliation exists. Cross-package ownership and concurrency guarantees must be explicit in the reviewed plan before implementation. This initial source card has UUID 9743b533-5c01-4b69-8089-1038f492048a; it supplies no operational admission, readiness, implementation or adoption credit.


## Initial source authority

This card is initially authored as first-class Markdown under the human and project card contract, with literal incoming and no empty dependency field. This is source provenance, not a claimed replayable task-created event or admitted operational state. Existing metadata changes, lawful readiness and all later operations belong to canonical Rheos.
