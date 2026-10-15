---
uuid: "d3bb3bcc-4882-4283-a78f-625b271e328c"
title: "Guard unique Rheos targets and source-preserving metadata updates"
status: "incoming"
type: "task"
priority: "P1"
points: "5"
category: "tasks"
labels: "rheos, identity, source-custody, metadata, cli, http, mcp, 5sp"
---

# Guard unique Rheos targets and source-preserving metadata updates

## Context

Native PR352 duplicate-target observation 4276222092 identifies an immediate
owning prerequisite for the six separately selected Foresight metadata operations.
The existing CLI, HTTP and MCP task lookup paths select the first matching ID
from the resolved task corpus. Publishing an initial Markdown card is supported
source authorship; it does not prove that this ambiguous lookup has been repaired.

The public planning source is eta-mu
209bd304988f3b53bb1b23071c9b2c963e2145ad. The retained source/API investigation and
unapplied test sketch also bind the independent private recovery rehearsal at
2f9a24ab584879de6e0a5e06eda65366fe5a379c. Recovery source does not itself supply
unique requested-target selection. This same unpublished UUID now covers the bounded shared target/update boundary.
The original three-point lookup-only proposal is retained as predecessor evidence.
Foresight native roots 4277797670 and 4277797680 require an actual AFAC dependency
vector and epic estimate update through that same existing frontmatter API.
General manual-add, birth-time projection and initial-source FSM admission remain
separate held work; they are not prerequisites silently implemented here.

## Outcome

Every existing CLI, HTTP and MCP operation that addresses one task by identity
selects exactly one matching task from the resolved project's current canonical
task loader, or refuses before any card write, recovery intent/completion,
comment/status event, watcher registration or editor execution. Duplicate
identities are never resolved by task ordering. This is a five-point Rheos owner plan; its source authorship does not establish
operational admission, readiness or implementation credit.

## Scope

Rheos owns this behavior in `packages/rheos`. Its task store already resolves
projects, task roots and configured projection paths and parses Markdown through
the existing owning decoder. Reuse that loader. The current CLI
`load-task-or-fail`, MCP `load-task`, and five task-targeting HTTP handlers each
take the first matching UUID. Replace those choices with one shared named target
selection authority exposed by the existing task-store boundary. Do not add a
command, parser, Foresight validator or alternate board interface.

Reuse `law.frontmatter/card-id-pattern`; identifiers such as
`opencode-mimo-evidence-review-agent` are canonical supported IDs. Do not require
RFC UUID spelling, normalize identity, invent an ID, or rewrite a card. Keep
selection scoped to exact matches for the requested ID in the selected project.
The same ID in another project or outside its configured projection is not a
collision. Unrelated duplicate IDs do not make a healthy requested target
ambiguous.

No reusable shared selector currently exists. There is a duplicate detector in
`infra.github-issues/assert-unique-uuids!`, used by GitHub synchronization on its
eligible set. Factor its pure identity/cardinality decision into the owning
law/domain layer if reused; preserve that projector's existing whole-set refusal
and message. Do not call the GitHub projector from task lookup or fork its policy
into a Foresight helper. Named Malli selection contracts precede the pure domain
decision and effectful loader composition. Keep the existing card-ID grammar as
one authority; portable extraction of the already pure frontmatter law is an
option if `.cljc` composition requires it, not a parser rewrite.

The shared result distinguishes zero matches, exactly one match and two or more
matches. Preserve existing missing-task outcomes. Duplicate selection is a
classified policy refusal: CLI exit 3, MCP `:kind :refused`, and HTTP 409. Invalid
requested identity is a usage error through the existing transport conventions.
All task-targeting HTTP handlers consume the same guard, including the editor
handler; typed selection refusal must not become generic HTTP 500. One selected
task retains its actual source path and unchanged projected data.

## Held generic metadata source boundary

For a new generic frontmatter operation, compose the shared selector with the
existing guarded physical-source boundary. Bind the requested identity, selected
project/projection and actual source path to its fresh owning-decoder witness.
Under the existing selected-source custody, confirm the literal raw identity is
one unambiguous matching supported card ID and that the physical image agrees
with the admitted witness. A changed identity or stale witness refuses, or is
readmitted from a fresh unique canonical selection before any new intent; it
cannot silently reuse an old task/source pairing. Recheck requested-ID uniqueness
at that admission boundary. Missing/duplicate selection, changed identity and
unrepresentable source are typed policy refusals before new intent, write-ID,
watcher custody, source persistence or completion. Propagate the same CLI/MCP/HTTP
refusal conventions; do not add a second setter.

Reuse `parse-frontmatter-with-key-custody`, `shape.frontmatter/scan-header` and the
existing decoder's observations. Before rewriting, require the owning decoder
to account unambiguously for the original header and targeted old values. Preserve
unsupported header bytes through an already owning operation if that capability
is admitted; otherwise explicitly refuse that mutation without dropping,
normalizing or guessing those bytes. The minimal selected route is refusal of
unrepresentable or ambiguous source, with supported healthy dependency and points
updates completing. This is an admission guard, not a replacement YAML parser or
global serializer sweep. Preserve unrelated decoded fields and body, including
an absent status or creation timestamp; a metadata update does not fabricate birth
or materialize initial status. Match actual write-ID/completion custody and retain
the original before/after images and dependency vector.

Compose the already qualified owning metadata recovery/source-lock interface for
participating writers; this card does not implement another ledger, writer,
lock/CAS or recovery protocol. Preserve lawful pending/completed reuse and all
existing recovery controls. Qualified source interfaces are inputs to this work,
not a reverse dependency on their cards' completion or on downstream ADA. Their
adoption remains separately required before any live operation. A missing accepted
source-custody interface blocks this slice rather than hiding new recovery work
inside five points.

## Acceptance criteria

- Two genuine Markdown files in one projected task root with the same ID refuse
  canonical read, move/status, frontmatter and comment operations before any
  mutation. Both files and the historical ledger prefix remain byte-identical;
  no recovery or ordinary completion event and no write-ID is created.
- The duplicate verdict is independent of title, source scan order and status.
  A matching ID copied into a second file never selects the first or last card.
- A healthy unique target performs the existing operation. A healthy legacy
  string ID remains accepted. An identical foreign-project ID or an excluded
  projection file does not poison that target. An unrelated duplicate pair does
  not block a different unique requested ID.
- Existing missing-project/task and malformed request refusal behavior remains
  visible. No lifecycle edge, WIP gate, command gate, recovery envelope or
  append/retry policy is changed by this boundary.
- The editor lookup refuses before native execution. Qualification intercepts
  the editor executor in an owned test fixture and never opens a real editor.
- The existing GitHub sync duplicate control remains intact if its predicate is
  extracted. No broad admission of the entire manual-source corpus is inferred.

- A physical raw ID changed after initial public lookup, or a second matching
  source introduced before metadata admission, refuses through CLI/MCP/HTTP with
  the intervening source images and ledger prefix intact. An excluded or foreign
  source remains outside the selected-project collision set. Do not count a
  source lock alone as requested-ID uniqueness.
- Unsupported/ambiguous original header custody is either preserved byte-exactly
  by the accepted owning write or explicitly refused before new intent, source
  write and event. No silently discarded nested/unsupported line can pass.
- A healthy unique manual card completes a dependency set to the ordered A8/B3
  IDs, and a healthy epic-shaped source completes points59-to70. Actual identity,
  body, unrelated metadata and status/creation-field presence remain intact; one
  genuine matching frontmatter completion supplies custody, with zero synthetic
  status/task-created events. Repeat of the healthy equal request is a byte/event
  noop or admitted completed recovery, retaining the original write identity.
- Canonical legacy string IDs remain healthy for those metadata controls. All
  eleven predecessor public-API duplicate/positive controls remain unchanged.

## Verification

Use real files in disposable boards and the existing public `cli/main`,
`agent-tools/dispatch` and exported HTTP handler surfaces. The initial RED calls
only already present APIs. Duplicate cards currently produce a successful
first-match result and, for a valid metadata update, change one card and append
events; expected refusal and byte/event silence fail for those semantic reasons.
Missing symbols or failed fixture setup are not RED evidence.

Include a legal priority update through frontmatter so this slice can qualify
without depending on the unadopted initial-status/recovery repair. Include the
CLI's direct `move` path separately from CLI verbs that delegate to MCP. Preserve
healthy unique and legacy targets and project/projection isolation controls.
Additionally use the existing public frontmatter surfaces for actual supported
dependency/points fixtures, raw-ID and duplicate-after-lookup interventions and
unsupported-header controls. Keep intervention bytes separate from the expected
product refusal; compare source, ledger, watcher and actual event observations.
The source-copy discovery below is a pure-function observation, not public-API RED
or an implementation test pass. Execute the additive registered controls only
after planning review/readiness and retain genuine predecessor semantic failures.
After this owner is adopted, the existing metadata owner and ADA qualification
consume it for the four absence-only initial-status requests and two explicit
empty-dependency clears; those later six live effects are not this card's exit.

Run the existing registered Rheos tests, lint and release
`server cli github-sync app`. Validate the HTTP/MCP/CLI refusal propagation and
zero-write/event controls using the same canonical loader and guarded mutation
paths. Preserve complete source, command, counters, cleanup and artifact custody.
No live planning board is a fixture.

## Composition and estimate

Provisional five points, on this same initially authored owner:

| Points | Bounded work |
| ---: | --- |
| 1 | Named exact requested-ID/cardinality law and canonical loader selection. |
| 1 | Route existing CLI/MCP/HTTP consumers and typed refusals, retaining all eleven controls. |
| 1 | Bind fresh selection, literal raw identity and admitted source witness at the existing guarded generic metadata boundary. |
| 1 | Reuse owning decoder custody for preservation or explicit refusal, with healthy dependency/points/noop and stale-source controls. |
| 1 | Registered owner tests/lint/four releases, actual public/API/CLI custody and exact adopted-source handoff. |

Three-point lookup-only work cannot qualify the additional held update and source
preservation obligations. Five points assumes composition with existing qualified
source custody/recovery and decoder APIs. No new parser, writer, global namespace
fence or recovery implementation is included. The source owner closes on its own
reviewed, qualified/adopted source without waiting for Foresight or Services.

This slice can start from accepted owner source and does not depend on metadata
owner UUID `775ab0be-90fe-469f-89e3-e6ac07b031ce`, recovery UUID
`9743b533-5c01-4b69-8089-1038f492048a`, or Foresight ADA UUID
`ada3bc51-1528-4ae3-aa46-095d217142ea`. The metadata owner and ADA consume this
source in the forward direction after adoption. Planning review, lawful readiness and any forward consumer dependency
registration remain actual canonical operations. The initial source has no
reverse dependency on those consumers, and source authorship creates no engine
event or dependency-registration history.

## Risks and stop condition

The guarantee concerns exact requested-ID uniqueness observed at fresh canonical
selection and the generic metadata admission recheck, plus the held selected
physical source/witness. It does not establish that no independent writer can
create a new file immediately after that directory observation. Existing recovery
supplies participating selected-source custody, not a global namespace fence. It is not a global directory/identity lock: another writer could
introduce a new file after selection. If acceptance requires atomic uniqueness
across that whole window, stop and estimate the actual shared writer/namespace
fence rather than claim the current per-source lock supplies it.

## Non-goals

General live manual-add classification, unknown creation-time projection and
initial-source FSM admission remain separately held upstream work. They are not
silently added to these five points. Do not require offline-only manual
authoring, synthesize `created_at`, manufacture task-created/lifecycle events,
replace legacy source IDs, implement the whole canonical task fold, or change
event-identity admission for ordinary historical events.

## Existing owner links and prepared evidence

The existing local consumers are
[metadata owner 775ab0be-90fe-469f-89e3-e6ac07b031ce](materialize-missing-initial-status-and-omit-empty-dependency-headers-07b031ce.md)
and
[recovery owner 9743b533-5c01-4b69-8089-1038f492048a](reconcile-guarded-rheos-metadata-writes-with-their-completion-events-f492048a.md).
The external Foresight consumer is
[ADA ada3bc51-1528-4ae3-aa46-095d217142ea](https://github.com/open-hax/foresight/pull/140/files).
The ADA source path is
`docs/agile/kanban/apply-adopted-rheos-metadata-repair-to-foresight-cutover-cards-217142ea.md`
in the active Foresight planning PR. These links identify consumers; they do not create an executable foreign-board
edge or require downstream completion to close this owner. Any needed established
consumer dependency change must use canonical Rheos after planning review.

The retained predecessor three-point public-API causal-test proposal is
`PR352-canonical-unique-task-target-small-slice-readonly-v1/unapplied-two-test-path-public-API-causal-RED-v1.patch`,
SHA256 `f195e0cf69e8f0435d1bb9069e77bdcddc8c59aca9c7e03acac6b853b880851d`.
Its retained manifest is
`root-ready-bounded-unique-target-three-point-body-and-unapplied-RED-v2.json`,
SHA256 `48917b831972e507837f2831994428405cc4f0d995dffea92f199bdea300824a`.
The proposal uses genuine duplicate files through eleven existing CLI/MCP/HTTP
paths, a legal metadata update, legacy/project/projection neighbours and an
intercepted editor executor. It is unapplied and unexecuted: its dry-run patch
check is source preparation, not behavioral RED or owner qualification. After
planning review and a lawful Rheos ready transition, run and retain the actual
semantic predecessor failures before implementation. Missing APIs, fixture
errors or compiler failures cannot supply RED credit.

The bounded actual source/operation audit is
`F140-T2d-RH2f9-existing-metadata-operation-readonly-discovery-v1/root-ready-existing-Rheos-read-capability-and-required-owning-prerequisite.json`,
SHA256 `fcdcbabcbe00b646e8aa5a522ffd72f33d85a755ddca43a05c81f734f47ad935`.
Actual canonical read-task calls established the four current source fields while
preserving source/ledger bytes; they did not register dependencies or change59.
An actual NBB1.5.211/Node24 pure-plan probe of exact T2d/RH2f9 source copies uses
the actual AFAC/epic header inputs. Healthy plans preserve decoded unrelated
fields and absent birth/status fields. Extending each disposable source copy with
one unsupported nested header line causes both existing plans to drop that exact
line without refusal. No live file or ledger is passed to a setter. Its complete
source, inputs, before/after output and zero-effect observations are retained in
`PR352-shared-target-update-five-point-private-successor-v1`.

The additive test proposal in that directory retains the eleven predecessor
public channels and their assertions, adding generic metadata controls at the
same existing APIs. It remains unapplied/unexecuted; no behavioral RED, adopted
capability or live effect credit comes from a dry-run patch check.

## Initial source authority

This initial Markdown source carries explicit UUID, incoming, task type and
five-point estimate, with scalar labels and no empty dependency field. It
claims no generated creation timestamp, write-ID or task-created event. Initial
source authoring is first-class input under the owner instructions; established
operational metadata, comments, transitions and drift reconciliation remain
Rheos-owned. No readiness, source adoption, native approval, settlement or
production qualification is supplied by this card alone.
