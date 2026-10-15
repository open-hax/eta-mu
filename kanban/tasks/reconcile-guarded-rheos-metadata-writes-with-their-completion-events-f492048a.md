---
labels: "rheos,metadata,recovery,event-admission,3sp"
dependency: ["d3bb3bcc-4882-4283-a78f-625b271e328c"]
type: "task"
write-id: "1792035568010-0.fw366fdspcsgfc33ba5"
points: "3"
title: "Reconcile guarded Rheos metadata writes with their completion events"
priority: "P1"
status: "incoming"
uuid: "9743b533-5c01-4b69-8089-1038f492048a"
---

# Reconcile guarded Rheos metadata writes with their completion events

## Refinement and retained source

This existing UUID 9743b533-5c01-4b69-8089-1038f492048a is refined to the PURE three-point portion of the former
eight-point recovery plan. Native PR352 root4278471918 requires implementation
slices no larger than five; root4278471931 requires the actual shared prerequisite.
After root reviewed the complete split, one canonical Rheos operation at
2026-10-15T03:39:28Z set points8→3, changed only the8sp label to3sp in its original
label order, and registered dependency[d3bb3bcc-4882-4283-a78f-625b271e328c]. Actual
card readback and three ordinary per-key frontmatter records retain the same
write-ID1792035568010-0.fw366fdspcsgfc33ba5. Incoming and task type remain unchanged;
this planning operation supplies no readiness, source qualification or adoption.

The other five points and ALL effect/restart/watcher/CLI/ledger obligations move
to new execution owner [b9ec4347-d36a-441e-a742-68f0fbb7314a](execute-selected-rheos-metadata-recovery-through-the-canonical-writer-fbb7314a.md). That card retains the full selected
admission, malformed-ledger, ordinary compatibility, atomic publication and
single-writer limits from this owner's0592 plan. They are separately qualified,
not dropped or represented as already complete. Private RH2f9 remains optional
historical source evidence; neither slice requires fetching or building it.

Current public writer behavior at T2d2d24396ec89ab49df335633cc65314992f23cddd writes
the card before its completion event and has no durable operation identity.
Native PR352 root4269032248 identified that causal gap. Metadata owner 775ab0be-90fe-469f-89e3-e6ac07b031ce must
consume the qualified execution authority; it cannot silently implement recovery
inside its existing five-point representation/omission scope.

## Outcome and construction boundary

Define one portable named recovery contract and pure decision authority over
admitted source, immutable operation and complete ledger facts. A valid decision
never equates persisted source with verified completion, never invents a phase,
and never silently retries uncertain append. Source/body authorship supplies no
runtime adoption or operation completion. This card closes on reviewed/adopted
pure source and its own meaningful tests, independently of execution/deployment.

## Scope

1. Define the GENERIC selected raw-envelope identity law in
   `packages/protocols/src/open_hax/law/event_identity.cljc` before its consumers.
   It owns the explicit selected marker and generic namespace/operation/part
   shape, exact event-ID derivation, causal-root/time/session binding and typed
   validity; it does not own Rheos phase vocabulary or another ledger admission
   algorithm. Ordinary envelopes without selected identity retain their existing
   interpretation, including historical millisecond-ID collisions. Invalid or
   malformed selected identity is not normalized into an ordinary envelope.
   This is proposed public source, not an already available T2d API. The private
   RH recovery law imports this generic law; leaving it in downstream execution
   would create the schema dependency cycle that this split explicitly prevents.

2. Define portable named Malli representations in
   `packages/rheos/src/rheos/backend/law/metadata_recovery.cljc` BEFORE shape.
   Own RecoveryPhase planned/card-persisted/completed, operation identity,
   source/intent custody and reconciliation input/result schemas. Bind operation
   kind, resolved board/task/source identity, requested ID and admitted source
   witness, complete before/after images and hashes, expected protected fields,
   original request, original removed values, event time and ONE stable write-ID.
   Reuse the adopted common key/source laws from upstream b29c2c61-bace-4117-8118-e89d1f5a7ec2; do not redefine
   occurrences/custody or raw host data. Completion custody is the ORDERED vector
   of exact existing per-key envelope identities and bodies, one per intended
   change. Initialization/standalone clear have one; an admitted multi-key clear
   retains existing cardinality/order and every original old/new value.
   The exact source image, namespace rheos.metadata-recovery.v1, write-ID operation,
   completion/<index> part, event ID, causal root/time/session and board/task/source
   must agree. Phase envelopes bind the same immutable operation to their phase.
   Missing, malformed, reordered, reused or conflicting custody cannot validate.

3. Place pure envelope construction in `shape/metadata_recovery.cljc`, consuming
   those laws, then ONE phase/reconciliation policy in
   `domain/metadata_recovery.cljc`. Law describes shapes; domain owns lawful
   decisions. The motion is planned → card-persisted → completed, with same-phase
   evidence rechecks and completed terminal. Unknown states, jumps/regressions
   refuse. A restart advances one edge only after fresh admitted facts establish
   it; seeing both after-image and completion does not allow planned→completed.
   Pending, uncertain and conflicted are outcomes retaining the last verified
   phase, not alternate transitions. The domain consumes complete validated
   observations supplied by the execution owner, never a filtered parse subset,
   mutable projection/cache or caller-supplied valid/exclusive flag.

4. Define exact operation selection and reconciliation. An intact before-image
   permits the initial guarded plan; exact intended-after image with retained
   write-ID permits completion reconciliation. The exact intended completion
   set, each accepted once, permits completed readback; conflicting source/event
   identity/body, duplicated ambiguous completion or unknown custody refuses.
   More than one pending operation or a different original request remains an
   explicit conflict. An already-absent dependency alone cannot prove completed
   clear; resumed clear preserves removed values and original ordered envelopes.
   A previously explicit status with no pending initialization may remain a true
   same-state no-op, but persisted metadata with pending/missing completion cannot.
   Selected exact retry/conflict is delegated to the existing Clio identity law
   at the execution seam; this domain does not duplicate Clio ledger semantics.

## Acceptance criteria

- Named generic identity, operation/source/completion/phase and input/result
  contracts reject malformed observations; shape output and every pure consumer
  validate against those laws. Generic identity law precedes recovery consumers
  and remains domain-agnostic. No runtime filesystem/provider imports enter pure
  .cljc laws, shapes or domain decisions.
- Exhaustively cover every phase pair, allowed next step, same-phase recheck,
  terminal repeat, unknown state, jump and regression. Unknown/uncertain facts
  preserve the last verified phase and operation; no guessed completion/no-op.
- Bind every ordered completion part and phase envelope to exact retained
  operation/write/source/board/task/time/session custody. Equal/reordered/reused
  parts, changed body and a copied write-ID with another source must refuse.
- Definite append failure after persistence, lost successful append response,
  restart and repeat are represented as distinct admitted input fixtures whose
  pure decisions preserve original identity/images/per-key values and choose
  completion/readback/refusal lawfully. These pure fixtures do NOT claim a real
  append, restart, atomic outcome or watcher qualification; execution5 proves it.
- Missing/ambiguous/failed full-ledger facts cannot supply absence or successful
  repeat. Ordinary legacy collision facts remain distinct from selected identity
  retry/conflict. No history rewrite, fabricated event or lifecycle claim exists.
- Independent public builds/tests need neither private RH commits nor downstream
  execution5/metadata implementation. Shared adoption supplies the named source
  result; no reverse dependency on its consumers is introduced.

## RED, GREEN and verification

After native planning settlement and lawful readiness, use existing registered
pure owner suites to demonstrate real predecessor decision/contract gaps through
existing pure construction/decision seams where available. Missing new imports,
fixture failure or compiler errors are not behavioral RED. New-law conformance
controls that characterize a newly defined contract are specification evidence;
retain any actual causal predecessor failure separately rather than manufacturing
RED by importing an absent symbol. Make the actual required red-state commit,
implement in define → shape → domain order and retain complete counts/warnings.

Run the complete registered Rheos tests, lint and releases server/cli/github-sync/
app to qualify common-law consumption. For protocols generic identity law, run
compile:lib, test, test:types and lint:kondo. Cross-runtime pure controls use the
existing owning harness; changed Clio law requires its affected/full multi-runtime
suite and lint only if source factoring is actually included. No effectful
recovery, restart/provider/model/production command belongs to this slice.

## Estimate and forward ownership

| Points | Independently testable pure work |
| ---: | --- |
| 1 | Generic selected identity plus complete named recovery/source/completion laws. |
| 1 | Pure envelope shapes and finite phase/reconciliation/operation-selection decisions. |
| 1 | Exhaustive meaningful controls, registered owner/public build qualification and adopted contract handoff. |

Three points is based on the bounded RH reference (generic identity17, recovery
law53, shape28, domain56 and pure tests48 lines), while requiring the stronger
complete source/completion/observation law above. Line counts are calibration,
not implementation credit. New cross-package migration, a broader identity
vocabulary or wider policy redesign requires refinement before implementation.
No durable writer/lock/ledger decoder/watcher/CLI/restart work is hidden in three.

Forward prerequisite: shared [d3bb3bcc-4882-4283-a78f-625b271e328c](refuse-ambiguous-task-identity-at-canonical-rheos-lookup-271e328c.md), itself consuming public
custody b29c2c61-bace-4117-8118-e89d1f5a7ec2. Reverse consumer: execution [b9ec4347-d36a-441e-a742-68f0fbb7314a](execute-selected-rheos-metadata-recovery-through-the-canonical-writer-fbb7314a.md), whose initially
authored dependency names this UUID. Metadata 775ab0be-90fe-469f-89e3-e6ac07b031ce now has its actual
canonical dependency on execution b9ec4347-d36a-441e-a742-68f0fbb7314a, registered
with write-ID1792035594497-0.ox8oemmf268848n09qf. Pure law adoption is still not
complete recovery. The entire former recovery composition remains3+5; this existing card
is not an unimplementable eight-point parent/epic and is not retyped. Actual
canonical re-estimation, labels alignment and dependency registration are recorded
above with matching card/event readback. The source remains incoming and its
implementation qualification/adoption is future work. No metadata775/Foresight
ADA/deployment completion is required to close the pure source.

## Non-goals and retained limits

No filesystem, durable intent/completion append, compatibility adapter, event
publication, watcher, CLI process or restart implementation. No new event/board
migration, invented source birth, ledger rewrite, event deduplication sweep,
rollback, lifecycle/status route, global namespace fence or all-writer card CAS.
Those existing execution obligations remain in b9ec4347-d36a-441e-a742-68f0fbb7314a, not waived. An OS ledger
lock never establishes card-file exclusivity; pure admitted facts must retain
that distinction and refuse where the consumer needs an unavailable guarantee.