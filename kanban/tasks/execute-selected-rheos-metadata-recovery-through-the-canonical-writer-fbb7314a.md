---
uuid: "b9ec4347-d36a-441e-a742-68f0fbb7314a"
title: "Execute selected Rheos metadata recovery through the canonical writer"
status: "incoming"
type: "task"
priority: "P1"
points: "5"
category: "tasks"
labels: "rheos, metadata, recovery, event-admission, restart, 5sp"
dependency: ["9743b533-5c01-4b69-8089-1038f492048a"]
---

# Execute selected Rheos metadata recovery through the canonical writer

## Context and outcome

This initially authored five-point execution owner receives the effectful portion
of former recovery owner 9743b533-5c01-4b69-8089-1038f492048a's eight-point0592 plan. Native PR352 roots4278471918
and4278471926 require honest bounded capacity;4278471912 requires upstream law
before producers. Pure 9743b533-5c01-4b69-8089-1038f492048a now owns the generic selected identity law and recovery
contracts/shapes/decisions at three points. It declares shared d3bb3bcc-4882-4283-a78f-625b271e328c as prerequisite;
shared consumes public custody b29c2c61-bace-4117-8118-e89d1f5a7ec2. This card depends on that complete adopted
chain and qualifies independently of downstream metadata775 and deployment.

A guarded selected operation either has verified matching card/event completion
custody or retains explicit recoverable/refused state. Persistence and projected
same-state alone never establish completion. The exact intended per-key set is
accepted at most once through the canonical writer, with original source/operation
identity across uncertain response, restart and repeat. No historical bytes or
ordinary raw-envelope compatibility are rewritten.

## Source ownership and effect scope

Qualification order: custody b29c2c61-bace-4117-8118-e89d1f5a7ec2 → shared d3bb3bcc-4882-4283-a78f-625b271e328c → pure recovery 9743b533-5c01-4b69-8089-1038f492048a → this execution
owner b9ec4347-d36a-441e-a742-68f0fbb7314a → metadata 775ab0be-90fe-469f-89e3-e6ac07b031ce. The public checkout must contain every required source;
private RH2f9/0f292 is optional historical comparison, not a required fetch/build
input or adopted interface. Consume actual named source/identity admission; a
caller flag or a prior projected task read is not its substitute. No new target
selector, decoder, source lock kernel or phase law is implemented in this card.

1. Pin the available same-repository boundaries. In open-hax/eta-mu, rheos.backend.infra.ledger/get-ledger constructs open-hax.records.edn.event-admission/create-edn-event-admission in packages/protocols/src/open_hax/records/edn/event_admission.cljs, implementing open-hax.openplanner-protocols/EventAdmission. Rheos owns metadata operation identity/phase/source custody; packages/protocols owns the existing compatibility wire envelope and raw board adapter. packages/clio/src/clio/law/ledger.cljc owns canonical exact-retry/identity-conflict admission, and packages/clio/src/clio/infra/ledger.cljc with clio.extern.js.fs owns locked append/durability. Reuse these local owners; do not create a competing identity law, raw-ledger writer or cross-repository Clio prerequisite.

2. Consume the independently qualified generic selected-identity and complete
   Rheos operation/phase/source/completion law, pure shapes and decision authority
   from pure owner 9743b533-5c01-4b69-8089-1038f492048a. Do not redefine these laws here or make that upstream
   owner import a downstream effect contract. Validate actual extern/ledger
   observations and domain results through those named contracts at the effect
   boundary. The retained phase/ordered-completion guarantees below apply fully.
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
- Restart/resume of that operation retains exact operation/write/source identity and reconciles through the canonical writer; it completes only with the exact intended completion-envelope set, one accepted match per existing per-key event, and verified after-image. Execution-level admitted-plan fixtures for initialization and explicit dependency clear both exercise this contract, including original removed-value preservation and existing multi-key event cardinality. The actual metadata product operations and their end-to-end public-route controls remain in metadata775 after this authority is adopted; execution cannot depend on that downstream implementation to qualify. Existing generic public priority/dependency updates independently qualify the durable mechanism.
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

## RED, GREEN and independent qualification

After native planning settlement, adoption of the upstream chain and lawful
readiness, reproduce write-before-event using actual existing public generic
frontmatter priority/dependency operations on an isolated board. Inject append
failure after card persistence and prove the unchanged predecessor lacks durable
pending operation/completion recovery. Preserve that causal RED. Existing
same-state metadata behavior is retained predecessor evidence, but absence of a
future initialization API/import, fixture failure or compiler error is not RED.
Make the actual red-state commit before implementation.

Add registered owner controls for actual new/resume/uncertain-response and
concurrent selected append, retained per-key old/new values/order, full-ledger
malformed interior/truncated-final/malformed ordinary refusal, whole-batch selected
no-write refusal, ordinary same-ID/different-body compatibility, exact retry/new-only
publication, fresh card conflict, separate-process CLI/watcher and watcher restart.
Use actual complete physical ledger observations under the same owning lock before
selected new intent/card write/resume/completion classification; no parse-filtered
absence, pre-query/caller flag or post-overwrite detection supplies acceptance.
Keep blank-line, well-formed legacy, healthy selected absence and already-present
controls, all inherited assertions and explicit cleanup. The actual atomic result,
not a guessed after-the-fact query, determines publication.

Qualify execution-level plans retaining initialization/clear original intent,
source and exact ordered per-key envelopes without implementing those product
policies. Real public generic frontmatter operations prove the independent
mechanism; metadata775 then composes and verifies its actual same-state/clear
routes, causal REDs and six downstream operations separately. This preserves
all former end-to-end obligations without an execution→metadata dependency or
false public initialization qualification.

Run complete registered Rheos tests, lint and release server/cli/github-sync/app;
protocols compile:lib, test, test:types and lint:kondo; affected Clio identity/
lock/durability suites and full multi-runtime tests/lint when Clio is factored.
If an eta-mu CLI wrapper changes, run that owner's tests/lint:kondo. Preserve
exact source pins, counts, zero warnings, full actual command/EOF/cleanup and
artifact custody. A live planning board is never a fixture. Retain the qualified
single-writer/quiescent card operating boundary and adversarial between-check/
write limitation; no all-writer CAS is inferred. Publish/adopt through normal
owner review before downstream775 readiness.

## Estimate and exact capacity

| Points | Bounded effectful work |
| ---: | --- |
| 1 | Thin existing EventAdmission record→proper infra composition, selected generic identity and minimal shared Clio identity-only factoring; preserve ordinary canonical/legacy admission. |
| 1 | Complete physical-ledger locked read/validate/admit/append/sync and actual result-bearing outcome; whole-batch selected preflight refusal. |
| 1 | Durable original intent/one-edge phase/reconciliation composition with adopted source adapter and existing generic write/event routes. |
| 1 | New-only publication and durable exact watcher correlation with real CLI/watcher/restart/uncertain-ACK controls. |
| 1 | Registered full affected owner gates, concurrency/failure/prefix/compatibility evidence and adopted source handoff. |

Five is provisional and excludes all common decoder/source/kernel work inb29c2c61-bace-4117-8118-e89d1f5a7ec2,
selector/routing ind3bb3bcc-4882-4283-a78f-625b271e328c, pure generic/recovery law in9743b533-5c01-4b69-8089-1038f492048a, and product
initial-status/clear omission in775ab0be-90fe-469f-89e3-e6ac07b031ce. The retained private reference calibrates
recovery infra112, raw adapter143, watcher/event changes and345-line owner plus
147-line real restart controls; its tests/source do not prove this new public
slice qualified. The current plan additionally requires proper infra ownership,
full physical-ledger custody and selected batch refusal. If preserving the
EventAdmission interface or supported concurrency requires a wider protocol,
producer overhaul, new kernel or provider migration, hold/refine this actual
slice before implementation instead of silently widening five or dropping a
required guarantee. No all-writer card transaction is promised.

## Consumers, initial source and held obligations

Primary reverse consumer: [metadata 775ab0be-90fe-469f-89e3-e6ac07b031ce](materialize-missing-initial-status-and-omit-empty-dependency-headers-07b031ce.md).
Its dependency on this actual UUID was registered/read back through canonical
Rheos at2026-10-15T03:39:54Z, with matching frontmatter write-ID
1792035594497-0.ox8oemmf268848n09qf. This establishes planning metadata custody,
not execution implementation or readiness. Pure9743b533-5c01-4b69-8089-1038f492048a's body names this reverse consumer; its source adoption does not
wait for this card's completion. No reverse dependency on metadata, Foresight ADA
or Services exists. No production action, model call, review transport adoption,
board migration, arbitrary deletion/status API, normal transition-gate change,
historical deduplication/repair/rollback or fabricated creation event belongs here.

Initial incoming/UUID/dependency are authored source content with scalar labels;
no created_at, write-ID or task-created history is invented. This source does
not establish operational admission/readiness. Ordinary same-state cards with no
pending initialization remain valid no-ops; unknown or pending custody never
becomes a successful no-op. General manual-source admission, live initial adds
and stable unknown creation time remain separate held Rheos obligations. Missing
necessary owner capability keeps the affected consumer/deployment prerequisite
unqualified; an exclusion is never deployment readiness.
