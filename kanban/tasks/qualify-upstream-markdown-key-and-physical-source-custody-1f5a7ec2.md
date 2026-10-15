---
uuid: "b29c2c61-bace-4117-8118-e89d1f5a7ec2"
title: "Qualify upstream Markdown key and physical-source custody"
status: "incoming"
type: "task"
priority: "P1"
points: "5"
category: "tasks"
labels: "rheos, markdown, key-custody, source-custody, clio, 5sp"
---

# Qualify upstream Markdown key and physical-source custody

## Context and source authority

This initially authored owner splits the implementation that the shared selector
card d3bb3bcc-4882-4283-a78f-625b271e328c at eta-mu 0592fbc6109469a11b2ba68f1c87f242c24f5bf1 had placed inside its five-point estimate. Native PR352
roots 4278471912 and 4278471926 require common key-custody law before its producer
and honest capacity for the new decoder/source mechanism. The source owner is
open-hax/eta-mu: packages/rheos and the narrowly affected packages/clio/protocols
boundaries named below. No implementation, readiness or source adoption is claimed.

T2d 2d24396ec89ab49df335633cc65314992f23cddd has a partial flat decoder and an
ordinary updater that rebuilds header/sections. Its supported decoded map cannot
prove physical key absence, complete raw-ID cardinality or preservation of an
unsupported header. The private RH2f9/0f292 source and retained 33-path qualification
are optional historical comparison only. They are not a public API, a mandatory
fetch/build input or qualification of this independently selected source subset.

## Outcome

A public fresh checkout can independently build and qualify one repository-owned
Markdown custody producer and generic physical-source adapter. It produces a
validated complete/partial/failed observation tied to the exact source, retains
all raw key occurrences before any flat projection, and supports guarded ordinary
source persistence or explicit refusal. It does not decide requested-target
cardinality, lifecycle placement, recovery phases or whether a field is mutable.

## Scope and construction order

1. Define the COMPLETE shared law first in
   `packages/rheos/src/rheos/backend/law/markdown_document.cljc`. Own named Malli
   `FrontmatterKeyOccurrence`, `FrontmatterKeyCustody` and the custody extension to
   the currently closed `FrontmatterDecoding` contract. Occurrences retain the
   literal key spelling, exact raw key/value source slices, a value-decoding state
   (`decoded`, `empty`, `unsupported`), and the literal decoded value when decoded.
   That value is required for cardinality of every raw UUID occurrence; a flattened
   last-value-wins field cannot replace it. Empty and unsupported observations
   remain physically present and do not acquire a guessed decoded value.

   Define named source/header/key/value spans against the SAME immutable decoded
   source string: zero-based half-open UTF-16 code-unit offsets and one-based
   line/column coordinates in that same unit. Record source identity/path binding,
   source length and header span; occurrence line/key/value spans must lie within
   that header and reproduce the original raw slices. Host byte/hash/inode facts
   are separately decoded by extern; do not confuse these text coordinates with
   UTF-8 byte offsets. Test ASCII, multibyte BMP and supplementary characters, LF
   and supported CRLF input. A source/body span binds observations to the input,
   not a projected task or mutable cache. The same exact source witness must be
   used by producer and consumer validation.

   Custody retains an ORDERED occurrence vector, structural coverage
   (`complete`, `partial`, `failed`), all nonblank header-line observations, and
   duplicate/ambiguity evidence rather than collapsing repeated keys. Both equal
   and unequal repetitions remain visible. Complete means each nonblank header
   line is accounted for by the owning grammar and no unclassified syntax could
   conceal another raw identity/key occurrence. Unknown syntax, read/decode
   failure or conflicting producer observations cannot assert completeness.
   A classified unsupported value for an unrelated known key need not by itself
   make a raw-identity-only read ambiguous; the consumer chooses its stronger
   preservation/mutation obligation. Do not silently label unknown syntax a
   harmless unrelated value. Define named producer result and physical-source
   witness/result contracts before their shapes/extern adapters.

2. Extend the existing owning decoder, never introduce another YAML parser.
   Implement proposed `shape.frontmatter/scan-header` and
   `shape.content-parser/parse-frontmatter-with-key-custody` seams, and make
   `shape.frontmatter.cljc`, `shape.markdown_document.cljc` and the existing content
   parser expose/conform to the SAME law. Pure shapes belong in portable .cljc
   where practical; raw JS values stay in extern. Preserve existing decoder
   identity/status/capability fields and tolerant-reader compatibility. Complete
   custody is a validated observation, not a caller-provided valid flag or a
   capability bit. The strict selected consumer will validate it. This card owns
   the producer, not task-store corpus discovery/cardinality or transport routing.

3. Implement the bounded generic `extern.markdown-source/with-source!` and
   participating-writer mutex using the existing owning kernel. Extract/factor
   the existing protocols mutex if reused; do not create a second lock protocol.
   At T2d `packages/clio/src/clio/extern/js/fs.cljs` already supplies
   `absolute-path`, `acquire-lock!`, `acquire-read-lock!`, `read-locked-text`,
   `release-lock!`, durable `write-text!`/`rename!`, `append-locked-text!`,
   `sync-locked!` and `sync-directory!`. Add/factor the missing narrowly owned
   fresh-existing-inode/current-path check, replacement/rebind, repeatable
   owning-descriptor read and complete-temp replacement composition at that same
   extern boundary. Current descriptor read is not claimed repeatable. Preserve
   lock/descriptor, alias and unsupported-filesystem refusal semantics, cleanup,
   file/directory durability, and no unintended missing-card creation. Extern
   decodes physical facts and exposes only defined CLJS data/capabilities upward.
   No recovery namespace or product field policy lives in this adapter.

4. Qualify generic ordinary source custody independently of the selector and
   recovery owners. Use the already existing ordinary updater/source behavior as
   predecessor evidence and focused registered owner tests, then a buildable
   public adapter integration over actual disposable source files. A held current
   source witness must reject an observed stale/changed image before persistence,
   retain the intervention bytes, and refuse unsupported/ambiguous mutation
   rather than silently losing input. Repeatable reads must observe actual
   current descriptor content; replacement/rebind must not retain a stale inode
   or allow a path alias to evade held custody. A successful supported plan
   preserves unrelated decoded metadata and body/comment content, including
   absence of status/created_at; it supplies no invented birth or lifecycle event.
   The selected-target/cardinality and public CLI/MCP/HTTP claims remain in the
   shared consumer's qualification. No selected recovery completion is required
   to close this owner.

## Acceptance criteria

- The common named laws validate the full occurrence/custody and source witness;
  both owning decoder outputs and consumer-facing results conform. Literal values
  for EVERY raw uuid occurrence and ordered duplicate evidence are retained,
  including requested-ID first/nonfinal and last, equal/different repetitions,
  and a later different value hiding a requested value in flat projection.
- Source/header/key/value spans and raw slices match exact fresh input using the
  named coordinate convention. Missing, malformed, conflicting or partial
  producer custody never proves absence or uniqueness. Every nonblank header
  line is classified; unknown syntax cannot masquerade as complete coverage.
- Physical absence is distinct from empty/unsupported/present-nil-like values;
  keys with unsafe or unrepresentable values cannot disappear during a guarded
  rewrite. A healthy representable source succeeds; unsupported mutation either
  uses an already qualified preserving owner or refuses before a new source write.
- Fresh existing-source binding, repeated descriptor reads, intervening changes,
  complete replacement/rebind, alias refusal, thrown callback cleanup and actual
  file/directory durability are exercised through the existing Clio kernel.
  Participating-writer serialization is qualified separately from global CAS.
- Public source and package manifests supply all required definitions. A fresh
  checkout can build/run this subset without private commits, local captures,
  selected recovery phase/intent/completion or downstream selector completion.
- Existing tolerant parser/inventory behavior remains compatible outside strict
  selected admission. No ordinary event identity/deduplication/history behavior
  changes; no ledger migration or rewrite is introduced.

## RED, GREEN and owner gates

After planning review and lawful readiness, retain actual predecessor semantic
failures using existing owning decoder and ordinary-update/source paths on
isolated fixtures. The retained exact-T2d pure-plan source-copy observation that
an unsupported nested header line is silently dropped is discovery evidence,
not a public-API RED or a compiled qualification pass. Missing new symbols,
fixture setup errors and compiler errors do not supply behavioral RED. Make the
actual red-state commit, implement law → shape → extern → domain/infra consumer
composition, and retain source-bound before/after controls and cleanup.

Run registered Rheos tests, lint and all four releases `server cli github-sync
app`; affected existing Clio filesystem/lock/durability tests and its full
multi-runtime tests/lint when Clio changes; protocols compile:lib/test/test:types/
lint:kondo when extracting its mutex. Preserve exact counts and zero warnings.
No test bypass, warning suppression or reduced inherited control set qualifies.
The public API/transport composite tests are additionally retained by shared5.

## Estimate, consumers and limits

Provisional five points, independently reviewed before readiness:

| Points | Bounded work |
| ---: | --- |
| 1 | Complete common occurrence/custody/source-span laws and conformance controls. |
| 1 | One owning decoder extension with literal values, coverage and duplicate observations. |
| 1 | Generic Rheos extern/mutex composition over the already existing Clio lock kernel. |
| 1 | Narrow Clio current-inode/repeatable-read/replace-rebind helpers and meaningful durability/refusal controls. |
| 1 | Registered affected owner gates, independent public build and adopted-source handoff. |

The primary reverse consumer is shared selector/source-composition owner
[d3bb3bcc-4882-4283-a78f-625b271e328c](refuse-ambiguous-task-identity-at-canonical-rheos-lookup-271e328c.md); that owner consumes the adopted law, observations and
adapter without reimplementing them. Metadata775 consumes the same common law
through the qualified forward chain and owns only initialization-specific
contracts/policy. This source owner has no reverse dependency on selector,
recovery, metadata, Foresight ADA or Services completion. This initial card has
no empty dependency field or fabricated write-ID/created_at/task-created event.
Established metadata and readiness remain canonical Rheos operations.

Five is bounded by reuse of the existing decoder and OS lock/durability kernel.
It excludes corpus discovery/selection/routing, selected identity/ledger/recovery,
initial-status/clear policy, live manual-add/FSM/birth admission, a new parser,
global namespace locking and all-writer CAS. If required spans/custody or a helper
needs a new parser/kernel or broader concurrency redesign, stop and refine that
actual owner before implementation; do not waive any refusal/coverage guarantee
or hide the expansion inside five. Atomic requested-ID uniqueness across a
whole directory is not supplied by a per-source lock. Unobserved competing card
writes are not made safe by post-write detection. Consumers must retain their
actual qualified single-writer/source limits and hold operations needing more.
