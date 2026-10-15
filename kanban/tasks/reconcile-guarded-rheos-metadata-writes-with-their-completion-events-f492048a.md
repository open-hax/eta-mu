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

A guarded metadata operation either has verified matching card/event completion custody or retains an explicit recoverable/refused state. Persistence alone and a projected same-state no-op cannot claim completion. Recovery after a process restart reconciles the actual source and ledger through the canonical writer, preserving historical bytes and at most one accepted match for each intended existing completion envelope.

## Scope and ownership

Qualification order is shared target/source owner
`d3bb3bcc-4882-4283-a78f-625b271e328c` first, this selected recovery owner second,
then metadata owner `775ab0be-90fe-469f-89e3-e6ac07b031ce` consuming both. The
shared owner independently qualifies its ordinary updater, raw identity/decoder
custody and repository-owned generic source adapter from accepted public source
using existing Clio kernel primitives plus its explicitly proposed bounded helper
extensions. Private RH source is optional historical comparison, not a required
fetch/build input. The shared owner does not consume this owner's selected
phase/intent/completion namespace. This owner consumes that adopted guard before
new selected operations. Private RH2f9 whole-candidate qualification is retained
source evidence, not an already adopted generic interface or a reason to require
this owner's completion before the shared owner can qualify.

1. Pin the available same-repository boundaries. In open-hax/eta-mu, rheos.backend.infra.ledger/get-ledger constructs open-hax.records.edn.event-admission/create-edn-event-admission in packages/protocols/src/open_hax/records/edn/event_admission.cljs, implementing open-hax.openplanner-protocols/EventAdmission. Rheos owns metadata operation identity/phase/source custody; packages/protocols owns the existing compatibility wire envelope and raw board adapter. packages/clio/src/clio/law/ledger.cljc owns canonical exact-retry/identity-conflict admission, and packages/clio/src/clio/infra/ledger.cljc with clio.extern.js.fs owns locked append/durability. Reuse these local owners; do not create a competing identity law, raw-ledger writer or cross-repository Clio prerequisite.

2. Define portable named law representations first in law/metadata_recovery.cljc: RecoveryPhase with planned, card-persisted and completed values, plus operation identity, source custody and reconciliation input/result schemas. Shape consumes those representations; domain/metadata_recovery.cljc depends downward on law/shape and alone owns the lawful phase edges and reconciliation decisions. The conceptual motion is planned → card-persisted → completed, with same-phase evidence rechecks, no skipped phase or regression, and completed terminal. A restart advances one edge at a time only after fresh admitted evidence establishes its fact; finding both after-image and completion does not permit a planned → completed shortcut. Pending, uncertain and conflicted are outcomes retaining the last verified phase, not alternate edges. Law does not import domain or own a second transition policy. Bind operation kind, board/task/source identity, before and intended-after hashes, expected protected fields and one stable write-ID. Completion custody is the ordered vector of existing per-key envelope identities and bodies: one for initialization or a standalone clear, preserving existing per-key cardinality for a scoped clear combined with another admitted planning-key update. Completed requires the exact intended set, each accepted once. Unknown or malformed custody is refusal, not inferred success.
3. Retain durable intent through the canonical owned operation/event path before the card mutation. Reuse one operation/write identity across resume; it cannot be regenerated from a repeat invocation's wall clock. Define how existing event envelopes carry that identity without relabeling historical events or treating an intent/recovery observation as a lifecycle transition or completion event.
4. Reconcile fresh card bytes and canonical ledger observations. An intact before-image permits the initial guarded write. An exact intended-after image with the operation's write-ID permits completion reconciliation. The exact accepted intended completion set yields completed readback without another append. Different source identity/content, conflicting completion body, duplicated ambiguous completion or untrusted custody yields a refused/conflicted result. An uncertain append must first be read back; absence is admissible only through the reviewed owning admission/concurrency contract, never a blind append retry.
5. Add explicitly selected stable-operation admission to the existing raw-envelope adapter while retaining its EventAdmission interface, wire envelopes and board ledger bytes. Ordinary envelopes without that selected identity retain their existing append compatibility; their historical millisecond-ID collisions must not enter the new same-ID/different-body refusal path. Clio already implements identity/slot admission and OS-locked canonical append; the missing work is its compatible use by this raw adapter. Do not pass a raw board envelope directly to clio.infra.ledger/append-event!: that function requires historical canonical schema revisions, and clio.law.ledger/append-admission also checks canonical stream slots absent from raw board records. Narrowly expose/factor the existing identity-only decision in packages/clio/src/clio/law/ledger.cljc, preserving the canonical append-admission contract and its stream-slot checks. Keep open-hax.records.edn.event-admission as a thin EventAdmission record delegating this effectful composition to open-hax.services.infra.edn-event-admission, in packages/protocols/src/open_hax/services/infra/edn_event_admission.cljs. That infra owner consumes the shared identity law and existing clio.extern.js.fs owning-descriptor lock/read/append/sync primitives for one complete read → validate → identity-admit → append critical section. The record retains interface conversion and delegation only; no second admission writer or policy lives there. Define a named result from that same atomic append/sync critical section containing the exact envelope and the actual appended/already-present outcome. A narrow result-bearing internal adapter seam may expose it to recovery composition while the existing EventAdmission append return remains the compatible envelope projection; both must share the one writer. Rheos completion publication consumes this actual outcome and publishes to the in-process/SSE bus only after a verified new append, never after already-present. A pre-query or caller flag is not the append outcome. If preserving the interface requires a wider protocol change, hold and re-estimate it before implementation. Validate the exact compatibility candidate before effects; retain its explicit identity, timestamp and full envelope across recovery. Matching completion is recognized without another accepted append; same identity with changed data refuses. Unknown/malformed/ambiguous source custody remains refused. No unlocked query-then-append, invented stream/schema fields, alternate mutex protocol, unchecked canonical-validation bypass or historical rewrite is admitted. Switching Rheos to create-edn-services/services.edn or importing its board ledger is a separate migration and is out of scope; if qualification requires that migration, stop and split before implementation.

Before any selected intent or card mutation, completion admission, resume or
absence/already-present classification, the owning selected critical section must
establish complete physical-ledger custody. Decode every nonblank EDN line through
the owning decoder under the same descriptor lock; any read failure, unparseable
or truncated line, non-event value or ambiguous custody yields explicit typed
uncertainty/refusal. This covers the entire observed ledger, including malformed
ordinary lines, rather than only successfully parsed selected matches. The current
raw `read-events` warns and filters parse failures; that filtered subset must never
prove absence or authorize a selected append. Preserve exact ledger bytes and
refuse new selected intent, source persistence, completion append and publication.
If uncertainty is discovered after an earlier card persistence, retain the last
verified operation phase and incomplete/refused result; do not invent completion.
Use the same strict custody for durable watcher/recovery observations. Blank
separators and well-formed legacy ordinary events remain admitted controls. Preserve
ordinary unselected append/query compatibility outside this selected critical path;
no historical repair, truncation, second parser or alternate writer is included.

The public `EventAdmission/append-events!` route must not bypass selected
admission. The bounded choice is an explicit no-write refusal of every batch
containing a selected `:event/identity` envelope, including malformed selected
identities and mixed ordinary/selected batches. Preflight the whole supplied
batch through the owning selection contract before appending any envelope: no
ordinary prefix, selected event, write or publication may escape before refusal.
Selected recovery emits its ordered parts through the qualified singular atomic
result seam. Pure ordinary batches retain their existing append/return behavior,
including historical millisecond-ID collisions. This adds no new bulk identity
protocol and supplies no batch atomicity promise for ordinary legacy envelopes.

6. Compose that authority in the existing task-writeback, transition, task-edit, ledger and event paths. Explicit dependency clears in infra/task_edit.cljs consume the same durable operation authority; preserve their original removed values, new-value [] clear intent and exact ordered per-key envelopes through append failure, lost response and restart. An already-absent dependency is not completed clear custody. New-card omission remains the existing creation path and does not invent recovery or creation events. Reconstruct pending operations from durable custody after restart. The existing status operations return an explicit incomplete/refused recovery result until completion is established; they may not silently no-op merely because a status field is present. The existing watcher pending-writes atom is only same-process optimization, not durable correlation custody. The watcher must use the qualified canonical operation/ledger lookup to validate board/task/source identity, write-ID and observed after-image against the accepted intent/completion, including a separate CLI process and watcher restart. Matching write-ID alone or a caller flag is not admission. Missing, conflicting or unreadable durable custody remains explicit uncertainty/refusal and cannot suppress a real drift observation. Preserve protected metadata, normal transition gates and error semantics.

## Acceptance criteria

- Definite event-append failure after a verified card write leaves a durable pending operation and a failed/incomplete result, with no accepted completion claimed.
- Restart/resume of that operation retains exact operation/write/source identity and reconciles through the canonical writer; it completes only with the exact intended completion-envelope set, one accepted match per existing per-key event, and verified after-image. Initialization and explicit dependency clear both exercise this contract, including original removed-value preservation and existing multi-key event cardinality.
- A completion append that persisted despite a lost response is recognized by fresh ledger readback; repeat recovery appends no duplicate completion.
- Wrong task/source identity, mismatched event body, ambiguous duplicate observations and malformed custody refuse and preserve admitted custody. Conflicting card bytes observed before persistence or during reconciliation refuse without another card write. This card qualifies card persistence only within an actually established single-writer/quiescent operating boundary; a supplied flag alone is not exclusivity evidence. It makes no atomic card compare-and-swap or preservation promise for an unobserved competing write between source check and plain persistence. Post-write detection cannot recover bytes that such a race overwrote. If a consuming operation requires that guarantee, hold it and split the wider shared card-writer concurrency work before implementation. The OS ledger lock protects event admission, not card files. No guessed rollback, manual event fabrication or historical rewrite is permitted.
- Phase controls cover every state pair: admitted forward edges and same-phase evidence rechecks retain identity; unknown states, jumps and regressions refuse. Uncertain/conflicted outcomes retain the last verified phase. A normal completed operation and repeated recovery yield the same completion custody. Ordinary already-explicit same-state cards with no pending initialization remain valid no-ops.
- Intent/recovery observations are distinguishable from the existing frontmatter completion event. Zero fake status-change/task-created events are emitted. Existing ledger prefixes remain byte-exact.
- An atomic exact retry returns already-present and is not republished to in-process/SSE subscribers. A controlled race of two completion attempts stores one matching envelope and publishes it at most once; crash catch-up uses durable readback and claims no exactly-once transient-bus delivery. Separate-process CLI/watcher and watcher-restart controls correlate only admitted matching source/write/operation custody; same-process registration alone is insufficient.
- Selected-profile controls validate namespace rheos.metadata-recovery.v1, operation equal to the retained write-ID, and each ordered completion/<index> part against the stored operation, board/task/source custody and exact immutable envelope vector. Event ID, causal root, event time and session remain bound to that same custody. Missing or wrong namespace/operation, a changed or reordered/reused completion part, mismatched source or changed envelope body must refuse rather than authorize persistence, completion or new publication. Phase-event controls bind the same namespace/operation to their stored lawful phase envelope. Ordinary envelopes without selected identity, including distinct historical records sharing a millisecond ID, retain their existing append behavior; those compatibility controls remain independent of selected exact-retry/conflict controls.
- The actual public `append-events!` refuses selected exact-retry, selected
  same-identity/different-body, malformed selected and mixed batches before any
  append or publication. Put an ordinary envelope before the selected one to
  prove whole-batch no-write refusal. Repeated refusal leaves bytes unchanged.
  Healthy ordinary batches, including historical same-ID/different-body records,
  preserve their original return/order/append behavior. These are future causal
  controls at the existing public adapter, not executed tests or a new API.
- Malformed interior EDN, a truncated final line and a malformed ordinary record
  before a selected completion all refuse selected new/resume/uncertain-response
  admission under the actual owning lock. No filtered parse subset supplies
  absence, already-present success or append permission. Card/ledger bytes,
  operation identity and the last verified phase remain intact; no completion or
  publication is fabricated. Blank lines and well-formed ordinary legacy records
  remain healthy, and a valid owned fixture independently proves genuine absence
  append and exact already-present retry. Historical corrupt-byte repair is outside
  this owner.
- Event admission behavior is implemented and qualified at its owning seam. Rheos operation decisions consume that contract; they do not duplicate event ledger semantics.

## RED and GREEN verification

1. After planning review and lawful readiness, reproduce the existing write-before-event behavior using the actual canonical status/write path on an owned temporary board. Inject append failure after card persistence and prove the current repeat falsely no-ops with missing completion custody. Capture this behavioral predecessor RED; a missing new API or fixture error is not evidence.
2. Add named schema controls, exhaustive pure domain phase/decision controls, and actual file/ledger scenarios for restart/resume, unknown append outcome with an already-present matching event, repeated resume, conflicting source/event identity and malformed custody. Add tests at the owning event admission seam for identical completion and same-ID different-body, including its supported concurrent ledger boundary and publication count from the actual atomic result. Inject malformed interior, truncated final and malformed ordinary ledger lines before selected admission/resume; prove strict complete-line custody refuses before any new selected card/ledger/publication effect rather than filtering errors into apparent absence. Retain blank-line, valid ordinary-history and healthy selected absence/exact-retry controls. Include a separate-process CLI/watcher and watcher-restart fixture; reject a copied write-ID with mismatched source and preserve explicit missing/uncertain custody. Include explicit dependency-clear failure/resume with the original removed vector, exact clear envelope and an existing admitted multi-key update; assert no recomputed old-value or new write identity. Card conflict controls introduce a change visible before persistence and assert refusal with those bytes retained. Keep an adversarial between-check-and-write fixture as an explicitly unqualified limitation if no shared card CAS exists; never credit detection after overwrite as preservation.
3. Make the red-state commit, then implement law → shape → extern → domain → infra in the named owning packages. Run the complete registered Rheos suite and documented release/build/lint gates; the protocols compile:lib, test, test:types and lint:kondo gates; and all affected Clio law/kernel-lock/durability suites plus its full multi-runtime test/lint gates when Clio source is factored. Qualify real process restart, uncertain successful append and the shared owning-descriptor critical section, retaining exact source pins, assertion counts and zero-warning diagnostics. Existing raw-envelope read/write compatibility and unchanged canonical Clio schema/stream admission must remain controls.

4. Exercise the built canonical CLI against an owned temporary board with real readback and process restart. Record before/after/source/event/write-ID equality, every incomplete result and eventual qualified completion. A live planning board is not a test fixture.
5. Publish and adopt the qualified recovery source through the normal owner review/merge gates. Only then unblock metadata card 775ab0be-90fe-469f-89e3-e6ac07b031ce. No live Foresight normalization or production action is part of this source card.

## Estimate and non-goals

Proposed eight points: three for operation/source/phase laws and meaningful failure controls, three for durable custody plus integration through the actual owning event admission boundary, and two for restart/uncertain-response qualification and canonical adapter readback. The existing durable-operation composition covers initialization and scoped explicit clear; it preserves current per-key event cardinality rather than adding a new public edit surface. This is independent of the metadata card's five points. The estimate is reviewed independently; split any wider event-kernel/concurrency redesign before implementation.

No global multi-writer CAS claim, general board migration, global serializer repair, new public status/deletion route, lifecycle fiction, source/event deduplication sweep, arbitrary rollback or manual ledger edit. No downstream Foresight operation, review transport, model call or Services/Knoxx deployment is included.

## Risks

Canonical Clio identity admission, locked append and the separate Clio-backed service provider already exist in this eta-mu revision. The missing capabilities are durable Rheos operation/source custody and qualified stable completion admission through its existing raw-envelope adapter; these are proposed source work, not a completed provider migration. A read-after-error may remain inconclusive; retain that state and refuse until actual admissible reconciliation exists. Cross-package ownership and concurrency guarantees must be explicit in the reviewed plan before implementation. The compatible ledger critical section does not serialize card writes; owner adoption/readiness must retain that limitation, and consumers must establish the qualified single-writer boundary before using recovery. Wider all-writer card locking/CAS is outside these eight points. This initial source card has UUID 9743b533-5c01-4b69-8089-1038f492048a; it supplies no operational admission, readiness, implementation or adoption credit.


## Unresolved owning-source obligations

Use the strictly selected stable-operation compatibility profile for this recovery slice. Rheos must define and select rheos.metadata-recovery.v1 in its own named recovery law, with shape constructing the exact envelopes and domain owning phase composition. Its namespace, operation and ordered completion parts must bind to the stored operation, write-ID, source and exact envelopes. Define the prospective generic protocols identity contract to carry namespace, operation and part and validate the exact event ID, causal root, timestamp and session, without owning Rheos phase vocabulary. That contract and its selected adapter integration are proposed owning source work, not an existing public protocols capability. Rheos alone binds each planned/card-persisted/completed phase and each completion part to its stored recovery custody. Selected retries and conflicts use Clio’s shared identity law and the same owning append/sync kernel; ordinary envelopes without selected identity retain the existing append behavior even when historical millisecond IDs collide. Do not globally change ordinary IDs, deduplicate history or rewrite ledger bytes. Qualification must include ordinary same-ID/different-body preservation and selected exact retry/conflict controls through the actual writer outcome and publication boundary. This selects the bounded plan design; the private source/capture evidence is not owner adoption, native approval or deployment admission.

First-class Markdown authoring is supported source input, not automatic operational admission or proof of an FSM hop. Before any metadata operation, actual owning Rheos checks must establish canonical UUID validity and unique target identity within the resolved project/source scope and fresh source custody. Initial-status materialization must also establish admitted initial-state placement. Reuse its existing identity/creation/FSM law where applicable; no local parser, caller-supplied valid flag or generated snapshot substitutes for that check. The shared five-point owner supplies adopted unique target and unambiguous raw-source admission before this selected recovery owner; it is qualified independently on ordinary metadata, not through this owner's recovery completion. Initial-source placement, live manual-add reconciliation and stable unknown creation-time representation remain separate held upstream Rheos obligations. The current-time fallback is observed read-time behavior, not factual birth provenance. Do not invent created_at, write-ID or task-created history to conceal those gaps.

The eight-point recovery estimate has not silently absorbed general manual-source admission, birth-time projection, all-writer card CAS or a broader producer/interface migration. Atomic publication and durable watcher correlation are required integrations of this recovery contract; their actual RED/source findings must confirm they fit its adapter/custody slice. If they need a wider interface, full event-producer overhaul or general admission machinery, hold and re-estimate before implementation. Missing necessary owner capability keeps the affected operation/deployment prerequisite unqualified; an exclusion is not deployment readiness.

## Initial source authority

This card is initially authored as first-class Markdown under the human and project card contract, with literal incoming and no empty dependency field. This is source provenance, not a claimed replayable task-created event or admitted operational state. Existing metadata changes, lawful readiness and all later operations belong to canonical Rheos.
