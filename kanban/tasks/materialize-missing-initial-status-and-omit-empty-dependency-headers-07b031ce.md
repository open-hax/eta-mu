---
uuid: "775ab0be-90fe-469f-89e3-e6ac07b031ce"
title: "Materialize missing initial status and omit empty dependency headers"
status: "incoming"
type: task
priority: P1
points: 5
labels: rheos, frontmatter, initial-status, dependency, deployment
category: tasks
---

# Materialize missing initial status and omit empty dependency headers

## Context

Foresight PR140 native root 4266776916 requests literal initial status on the four original UUID-bearing cutover cards. The current canonical Rheos engine already projects a missing field as incoming, so the finding's claim that Rheos cannot treat them as incoming is not supported by the observed engine. The missing literal metadata remains real. Actual incoming-to-incoming returned a successful no-op without a card or ledger write; repeating that command cannot repair it. Generic frontmatter routes correctly protect status.

Owning source is the Rheos package currently executed from open-hax/eta-mu at 2d24396ec89ab49df335633cc65314992f23cddd. domain/kanban_projection.cljc:12–16 defaults absent status to incoming, and its task projection does not retain the raw frontmatter. infra/transition.cljs:25–26 returns the same-state no-op before reading the file. A projected status therefore cannot prove an explicit persisted status field exists.

The same qualified CLI creates or explicitly clears an empty dependency as literal dependency: []. The user requires omitting empty dependency fields. The existing private two-point proposal 775ab0be-90fe-469f-89e3-e6ac07b031ce covers that rendering gap. This proposed five-point scope replaces that private draft before authoring; it does not rewrite historical cards or widen the separate roundtrip-planning-metadata card, whose earlier scope intentionally preserved []. Root must confirm the UUID through fresh canonical board inspection before authoring or rescoping an existing card.

## Outcome

An explicit request through the existing canonical status operation can persist a truly absent initial status, while preserving the card's logical state and recording the actual metadata change. New cards and explicit dependency clears omit empty dependency headers. No fake lifecycle hop, general status-edit permission, dependency edge or board implementation is introduced.

## Scope and source seams

1. Add a small pure initial-status materialization law, preferably law/initial_status.cljc so the new semantic decision is portable. Its inputs are the already-resolved owning FSM data, observed task state, requested state and the fresh parsed frontmatter. Reuse the owning FSM; do not reproduce its state/edge/WIP rules.
2. In domain/transition.cljs and the existing infra/transition.cljs same-state initial branch, distinguish an actual missing field from a present field. Only materialize when the field is truly absent, the FSM initial state is defined and valid, and both projected and requested states agree with that initial state. The current owning readers discard some physically present unsupported keys, so decoded-map contains? alone is not a sufficient absence witness. Narrowly extend the existing shape/frontmatter.cljc decoder and shape/markdown_document.cljc decoding custody to retain observed-key presence, unsupported values and duplicate/ambiguous header information. Reuse one owning decode path; do not build a sidecar parser or new YAML implementation. A present nil/blank/bracket-malformed status, unrecognized header syntax or conflicting decoder observations must refuse materialization. Use fresh source data; a stale projection, identity mismatch or conflicting source must refuse without effects.
3. Reuse or narrowly specialize infra/task_writeback.cljs for the guarded write using the checked source content and existing content-parser/write-ID machinery. Before persistence, verify that the planned canonical render preserves every unrelated decoded frontmatter value and body/comment section; refuse an unrepresentable or changed value rather than silently dropping it. This is a bounded admission guard, not the separate general string-escaping repair. Register the one actual write-ID with the existing watcher and append one existing frontmatter event with key status, old-value nil and new-value equal to the initial state. Do not emit a status-change or task-created event. Preserve generic frontmatter protection in law/frontmatter.cljs, infra/http_server.cljs and infra/agent_tools.cljs.
4. Keep the existing move/status-update command surface. Report materialization distinctly in its result (for example operation initial-status-materialized), and ensure CLI feedback does not claim a lifecycle move. A repeat after persistence is a true no-op with no new write-ID, card write or ledger event. Preserve normal transition/FSM/WIP/command-gate behavior.
5. In domain/task_create.cljs:195 frontmatter-pairs, omit only an empty dependency pair. In shape/content_parser.cljs:105 update-frontmatter-keys, remove only dependency for an already-validated explicit [] clear. Keep [] as operation/event no-edge intent and retain ordered nonempty dependency vectors. Never globally filter serializer output: unrelated comment/status rewrites must preserve legacy dependency: [] unless explicitly cleared.

## Acceptance criteria

- On an owned temporary board, a UUID-bearing card with truly absent status is first projected into the current initial state. One existing canonical move/status-update request to that same initial state persists a literal initial status, one new write-ID and exactly one correlated frontmatter event. The logical state, UUID, parent, points, dependency graph, body and comment content remain unchanged.
- The event truthfully records status field initialization from absent/nil to initial. Zero status-change/task-created events are emitted; no synthetic lifecycle transition is counted. Existing event ledger prefixes are byte-exact.
- Repeating the operation after materialization returns a no-op and preserves card bytes, write-ID and ledger bytes. Already explicit status fields are never normalized incidentally, including explicit nil/blank or a legacy alias; this slice does not repair malformed/stranded statuses.
- Wrong requested state, noninitial projected state, unresolved/invalid initial state, mismatched fresh UUID, source changed before the write decision, unreadable source, conflicting literal status, unsupported status syntax, duplicate/ambiguous keys and a failed preservation round trip produce no initialization write. A custom FSM whose projection disagrees with its initial state must refuse rather than silently invent a transition or rewrite the projection.
- Normal lawful transitions still use the existing edge, WIP and command gates. Existing refusal controls continue to produce no write or event. Client status edits via generic frontmatter remain refused.
- Creation with omitted or explicitly empty dependency produces no persisted dependency field. A canonical explicit clear removes that field; parser/readback uses contains? to establish absence, and the correlated event retains new-value [] as clear intent. Nonempty order and malformed-input zero-write controls remain intact.
- Initialization alone preserves a legacy dependency: [] header. Comment or unrelated metadata updates do not sweep empty fields. A separate explicit dependency clear is the only cleanup operation for established empty metadata.
- Existing cards and historical creation/clear/no-op receipts are not rewritten or relabeled as successful normalization. Applying the qualified engine to Foresight happens only after owner source review/admission and fresh actual CLI readback.

## RED and GREEN verification

1. After planning review has settled and the owner card is ready through Rheos, add pure decision tests, decoder key-custody assertions and real-file controls in the existing transition/task-writeback owner suites. Cover a truly absent status separately from physical status with empty value, unsupported/malformed array value, duplicate key and unrecognized header syntax; none may become absent simply because decoding drops it. Against unchanged production, a valid actual move on a temporary missing-status card must reach the current same-state branch and fail persistence/event assertions for that causal reason. Missing imports, new-API absence or fixture failures do not supply behavioral RED. Preserve the genuine predecessor failure and make the red-state commit.
2. Add creation/clear omission assertions to domain/task_create_metadata_test.cljs, infra/task_create_test.cljs, infra/task_edit_test.cljs and shape/content_parser_test.cljs. Preserve historical empty-array parsing and unrelated comment rewrite assertions. The unchanged implementation must fail only the new omission criteria through valid existing operations.
3. Implement the scoped pure law, guarded canonical metadata operation and two omission sites. Run the complete registered Rheos suite, documented release of server/cli/github-sync/app, and lint with zero errors/warnings. If the eta-mu CLI wrapper changes, also run its actual test and lint:kondo gates. Retain exact counts and warning diagnostics; do not infer build correctness from exit zero alone.
4. Exercise the qualified actual CLI on an owned temporary board: initial metadata write/readback/event custody; repeat true no-op; refused cases; creation without dependencies; explicit clear and ordered restore. Assert file/event write-ID equality and watcher correlation. No live planning board is a test fixture.
5. Only after qualified owner source adoption, root performs one explicit normalization per affected original Foresight card (82c55f16-a688-4ba5-983d-c44c618cdd5d, d3277a3c-6e30-42b1-8151-16c041612a6a, 11bc1411-154d-4db7-8c27-51506ab30508, 03a057e4-3098-4fe7-a5b8-95168f45ca96) and one explicit clear on SDK card 6cc1e1ca-c8dd-4cf9-9cd1-24675a7ee0c0. Fresh actual readbacks and ledger events prove those effects. Native finding settlement remains a separate current-head action.

## Estimate and non-goals

Five points = the existing two-point creation/explicit-clear omission slice plus three points for guarded initial metadata decision, canonical writer/event correlation, transport feedback and meaningful integration controls. One standalone card is appropriate because both are bounded representation fixes owned by the same canonical engine and needed before this cutover plan's closure. If qualification requires a new lock/CAS protocol, generic frontmatter migration, projection redesign or cross-package event schema, stop and split/re-estimate before implementing that extra work.

No FSM edge, WIP, command-gate, force-status, readiness or body-lock rule changes. No lifecycle round trip, new command surface, general status/deletion API, global serializer sweep, board migration or duplicate parser/writer. No broad string escaping, custom-FSM projection repair or producer identity redesign. No review-transport adoption, model route, Services/Knoxx runtime, production deployment or source-submodule pointer change belongs to this slice.

## Risks and evidence limits

The current flat frontmatter reader is partial and currently has no key-presence custody output; that missing owner witness is part of this proposal, not an existing capability. parse-flat discards empty/unsupported values, and content-parser discards a bracket-prefixed value it cannot decode. The new operation must distinguish physical field presence from successful value decoding and fail closed on ambiguity through the existing owning parser. Existing writeback is not a globally serialized multi-writer transaction; source rechecks can detect observed changes before writing, but this scope must not claim a new race-free CAS protocol. Preserve and report actual write/event uncertainty instead of retrying. A wider concurrency requirement changes the estimate and needs its own reviewed owner contract.

Materialization is metadata initialization in the existing status authority, not a state transition. Reusing the frontmatter event vocabulary preserves that distinction and existing observer custody. A local test, compiled CLI or author-proposed card is neither owner source adoption nor a native approval, finding settlement or deployment proof.
