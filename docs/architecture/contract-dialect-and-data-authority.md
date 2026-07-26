# Contract Dialects and Data Authority

Status: working cross-repository architecture record  
Last verified: 2026-07-26  
Epiphany source reviewed: `octave-commons/epiphany@bdcd61f43f9bf8e1fd9e4549f169466842a5b19a`  
Scope: eta-mu, Katamorph, Muse, Knoxx, Epiphany, OpenPlanner, event-ledger, Proxx, Sol, Rheos, Axxium, and Uxx

## 1. Intent

Eta-mu is a data-oriented operating context for humans, agents, tools, workflows, and products.

Systems in the constellation should cooperate through versioned contracts, append-only records, and explicit projections rather than by depending on one application's internal runtime or storage implementation.

The intended composition is:

```text
Katamorph = shared resource and contract language
Muse      = compiler from that language into harness-native artifacts
eta-mu    = modular runtime implementation and rewrite/integration monorepo
Sol       = eta-mu-native agent runtime
Rheos     = ledger-backed work coordination runtime
Knoxx     = deployable product composition of eta-mu modules
Epiphany  = evidence-governed workspace and research platform
```

A product such as Knoxx should be a deployable configuration of eta-mu modules. A harness compiler such as Muse should translate shared semantic resources into OpenCode, Claude, Codex, eta-mu-native, MCP, and other host-specific forms. Epiphany should make the resulting multi-repository workspace intelligible to humans and agents without becoming a mandatory dependency for basic agent execution.

The architecture must distinguish:

1. Canonical source data.
2. Durable observations and decisions.
3. Runtime interpretations.
4. Rebuildable projections.
5. Host-specific representations.

Multiple systems may operate over the same logical corpus. They must not become competing authorities over the same facts.

## 2. Epiphany: source-backed interpretation of its scope

The word *archaeology* describes Epiphany's first implemented method, not its final product boundary.

Its process charter is concerned with helping humans and agents build accountable understanding, preserve the basis of consequential claims, make bounded commitments, and revise course without misrepresenting uncertainty or acceptance.

Its engineering kernel separates:

```text
law    = admissibility and versioned contracts
shape  = pure transformations
extern = foreign capability invocation and decoding
domain = Epiphany meaning and decisions
infra  = effect orchestration and adapter composition
```

Its roadmap expands in deliberate gates:

```text
Phase 1: Git/Markdown evidence, retrieval, lineage, review, workbench
Phase 2: code comprehension, concept-to-code grounding, architecture inference
Phase 3: governed external research and bounded research agents
Phase 4: reproducible simulation and bounded experiment loops
```

The stable identity is therefore:

> Epiphany is an evidence-governed workspace and research platform that observes heterogeneous sources, preserves provenance and epistemic status, derives rebuildable search/graph views, records explicit interpretation decisions, and exposes bounded command/query surfaces to humans and agents.

Memory retrieval is one Epiphany query product. Repository archaeology is its first substrate. Graph traversal is one projection. None of those alone defines the system.

### Current Epiphany implementation

The latest merged tranche provides a concrete Phase 1 implementation:

- shared CLI/HTTP command vocabulary and application handlers;
- local and services profiles with explicit availability semantics;
- repository registration and Git-local resource identity;
- JGit commit, ref, tree, blob, and exact-path observation;
- revision-at-path evidence including add, modify, delete, and continuity;
- ingestion runs and durable projection checkpoints;
- Markdown section extraction with byte and line spans;
- Lucene lexical/vector projections and Ollama embeddings;
- evidence reading and comparison;
- lineage candidates and append-only review decisions;
- inbox, export, status, HTTP, and browser workbench surfaces;
- backup, restore, and projection rebuild paths;
- operation/schema registry, validating ports, adapter law suites, idempotency, replay, generative laws, sabotage tests, and CLI/HTTP parity tests.

The current implementation's canonical source adapters are Git repositories and Markdown history. Eta-mu operational-ledger ingestion is a proposed next source family, not a completed feature.

### Epiphany decision status

Do not flatten document status into architectural fact:

| Record | Repository status | Architectural use here |
|---|---|---|
| ADR-000 authoritative data boundary | `proposed` | Current implementation and roadmap follow its Git-canonical / durable-observation / rebuildable-projection direction, but formal acceptance remains open |
| ADR-001 Git-backed identity and continuity | `accepted` | Governs repository identity, exact paths, family membership, continuity tiers, and non-promotion of similarity |
| ADR-002 CLI/REST adapter boundary | `accepted` | Governs one command/query application boundary with direct and HTTP adapters |
| ADR-004 contract-first adversarial verification | `draft` | The merged assurance tranche implements much of it; document status still remains draft |

## 3. System roles

| System | Role | Must own | Must not own |
|---|---|---|---|
| **Katamorph** | Shared contract and resource language | Resource identity, schemas, references, manifests, validation, extension registration, and generic interpretation machinery | OpenCode, Claude, Codex, Knoxx, or Epiphany runtime behavior |
| **Muse** | Runtime-shape compiler | Target profiles, capability linking, host projections, plugin/hook/tool/config generation, compatibility diagnostics, and generated artifacts | Canonical agent, actor, policy, provider, or event vocabulary |
| **eta-mu** | Rewrite and integration monorepo | Runtime modules while boundaries evolve; cross-module and cross-repository conformance tests | Permanent ownership of every stable subsystem or all constellation meaning |
| **Sol** | Native eta-mu agent runtime | Sessions, turns, provider/model use, tool execution, runtime interpretation, and native actor episodes | Workspace ingestion, semantic history, or durable knowledge authority |
| **Rheos** | Work coordination runtime | Ledger-backed workflow, board, transition, dispatch, and work-state behavior | Generic event storage or universal contract definitions |
| **Knoxx** | Deployable product composition | Familiar web/chat experience, studio, CMS, translation, review, and product-specific workflow composition | A second general agent runtime, second contract language, or workspace ingestor |
| **Epiphany** | Workspace cognition and research platform | Source observation, provenance, ingestion, indexing, evidence organization, review decisions, bounded query/command services, and rebuildable projections | Agent execution, Knoxx UI ownership, or harness plugin compilation |
| **OpenPlanner** | Legacy or optional graph/search projection | Compatibility APIs and specialized graph/search algorithms while they remain useful | Canonical knowledge, canonical source observations, or user interpretation decisions |
| **event-ledger** | Operational event spine | Event envelope, append semantics, causal links, ordering, replay, and stream protocols | Domain-specific meaning of every payload |
| **Proxx** | Provider/routing specialist | Provider routing, account selection, queueing, reasoning normalization, and federation policy extensions | A parallel universal contract registry |
| **Axxium** | Identity and authorization kernel | Runtime principals, credentials, roles, authorization, and identity bindings | Agent behavior contracts or workspace knowledge |
| **Uxx** | Presentation library | Components, design tokens, framework bindings, and presentation-level contracts | Runtime, evidence, or contract-language semantics |

## 4. Canonical source and projection model

```text
Canonical sources
  ├─ Git object databases
  │    ├─ commits, trees, blobs, refs, exact paths
  │    └─ Katamorph resources committed as source files
  ├─ eta-mu operational event ledgers
  │    ├─ Sol sessions and turns
  │    ├─ Rheos work and transition events
  │    ├─ harness receipts
  │    └─ mycology observations and promotions
  ├─ external sources admitted by explicit policy
  └─ human/authorized-agent decision events

Durable interpreting records
  ├─ Epiphany observations of source facts
  ├─ Epiphany provisional candidates
  ├─ explicit review/acceptance/rejection events
  └─ run, checkpoint, failure, and model/version records

Rebuildable projections
  ├─ lexical index
  ├─ embedding/vector index
  ├─ relationship graph
  ├─ timelines and workspace maps
  ├─ context/memory packets
  └─ OpenPlanner compatibility collections/APIs
```

### Authority rule

A strong schema does not permit every service to mutate the same records.

Use one writer of record per fact class:

| Fact class | Writer of record |
|---|---|
| Git commits, trees, blobs, refs, paths | Git |
| Katamorph source resources | Git changes made by authorized actors |
| Runtime session/tool/work events | Producing eta-mu runtime through event-ledger |
| Epiphany source observations | Epiphany source adapters |
| Provisional semantic/lineage candidates | Named Epiphany extractor/model version |
| Accepted/rejected interpretations | Explicit authorized review decision |
| Search/vector/graph records | Projection builder; always rebuildable |
| Knoxx product state | Knoxx product modules through their own declared stores/ledgers |

Sharing one MongoDB deployment is an operational choice, not an authority model. Services should own separate collections or databases and communicate through declared commands, queries, events, and projection feeds. Direct cross-service writes recreate hidden coupling at the database layer.

## 5. Contract dialect matrix

| Family | Current dialects | Proposed canonical authority | Interpreters | Required migration |
|---|---|---|---|---|
| **Resource envelope** | Katamorph `:contract/id`, `:contract/kind`; Knoxx and Proxx variants | **Katamorph** | Sol, Knoxx, Muse, Rheos, Proxx, Epiphany extensions | Standardize identity, schema version, references, manifests, and extension namespaces |
| **Agent** | Knoxx agent contracts; Katamorph `AgentContract`; Sol compatibility logic | **Katamorph** | Sol and Knoxx | Knoxx reads through Katamorph; remove local schema copies |
| **Actor declaration** | Knoxx/Katamorph actor resources | **Katamorph** | Sol, Knoxx, Muse | Keep declared actor behavior separate from authenticated live principal |
| **Runtime principal** | Knoxx users/agents; Axxium identity shapes | **Axxium** | Sol, Knoxx, event producers | Bind principal IDs to Katamorph actor/agent resources and ledger events |
| **Role and grants** | Knoxx roles; Katamorph roles/capability lists | **Katamorph** | Sol, Knoxx, Muse profile compiler | Treat role membership and capability grants as bindings, not capability implementations |
| **Capability semantics** | Katamorph grouping shape; Muse executable shape; eta-mu platform executable shape | **Katamorph after reconciliation** | Muse, Sol, product runtimes | Define semantic input/output/effects/errors independently from implementation and exposure |
| **Capability implementation** | Inline Muse handlers; eta-mu platform handlers; package code | **Schema in Katamorph; code in implementing package** | Muse linker and native runtimes | Introduce implementation resources referencing capability, runtime, handler, dependencies, and version |
| **Exposure** | Muse tools/hooks; eta-mu platform tools; Knoxx UI actions/routes; MCP methods | **Muse for harness targets; product repos for UI** | OpenCode, Claude, Codex, MCP, eta-mu, Knoxx | Make tool, hook, route, MCP method, and UI action projections of semantic capabilities |
| **Plugin/profile** | Muse plugin/config DSL; eta-mu extension manifests | **Muse** | Target compilers | Converge duplicate compilation pipelines; profiles select implementations, exposures, hooks, and policy |
| **Policy** | Katamorph policy/policy-gate; Proxx routing policies; eta-mu contract-runtime-v2 | **Katamorph core plus namespaced extensions** | Sol, Proxx, Muse hooks, Knoxx | Preserve specialist Proxx language without placing all routing records in universal core |
| **Intent/fulfillment** | eta-mu design intent; contract-runtime-v2 fulfillment; Katamorph fulfillment | **Katamorph** | Runtime pre/post execution interpreters | Define normalized verdict/evidence shapes and replace locally parsed maps |
| **Provider/model** | Katamorph; Proxx; Knoxx catalogs | **Katamorph core; Proxx routing extension** | Sol, Proxx, Knoxx | Centralize provider/model identity; retain routing and account policy as Proxx extension |
| **Action/trigger/schedule** | Katamorph orchestration; Knoxx event agents; Rheos transitions | **Katamorph generic kinds; runtime-specific semantics** | Sol, Rheos, Knoxx | Keep portable declaration separate from workflow transition implementation |
| **Runtime source** | Knoxx source contracts; Katamorph `:source` | **Katamorph** | Sol context hydration/event listeners | Use explicit driver and protocol references instead of embedded implementation details |
| **Workspace source** | Knoxx `:ingest_source`; Epiphany repository registration/ingestion commands | **Epiphany extension over Katamorph source declarations** | Epiphany | Remove Knoxx ingestor; map discovery/schedule/backpressure settings into Epiphany source policies |
| **Deployment/product profile** | Implicit Knoxx topology and environment | **Generic schema in Katamorph; instance in product repo** | Deployment tooling and Muse | Add deployment/composition resource for modules, surfaces, services, contracts, and optional integrations |
| **CMS/studio/translation** | Knoxx-specific contracts and large `:data` maps | **Knoxx namespaced domain extensions** | Knoxx modules | Extract general machinery only when another product demonstrates the abstraction |
| **MCP server** | Katamorph MCP contract; eta-mu MCP loaders; Muse target | **Katamorph declaration; Muse/runtime adapter interpretation** | Sol, Knoxx, Muse | Remove duplicate schema/loaders after one interpreter protocol exists |
| **Output contract** | eta-mu output-contract package and OPMF gates | **Dedicated versioned package referenced by Katamorph** | Sol, Muse hooks, CI gates | Keep output grammar independently versioned but addressable from resources |
| **Epiphany observation** | Epiphany closed versioned Malli records | **Epiphany law registry** | Epiphany adapters/application services | Do not move source-specific epistemic records into Katamorph core |
| **Epiphany relation/review** | Provisional lineage candidates and append-only review decisions | **Epiphany** | Workbench, CLI, agents, exports | Generalize relation vocabulary by phase while retaining tier, evidence, generator, and review history |
| **Presentation** | Uxx props/tokens; Knoxx UI configuration | **Uxx for reusable components; Knoxx for composition** | React/Reagent/Helix product surfaces | Keep UI presentation contracts separate from runtime capability semantics |

## 6. The capability collision

Three meanings currently share one word:

```text
Katamorph capability
  = grouping/grant
  = actor or role receives access to a set of tools/surfaces

Muse capability
  = executable operation
  = input, output, effects, handler

eta-mu platform capability
  = executable semantic operation
  = input, output, effects, errors, handler
```

The target model should separate four facets:

```clojure
{:contract/kind :capability
 :capability/id :research/search
 :capability/input  ...
 :capability/output ...
 :capability/effects #{:network/read}}

{:contract/kind :capability-implementation
 :implementation/of :research/search
 :implementation/runtime :cljs
 :implementation/handler eta-mu.domain.search/run}

{:contract/kind :capability-exposure
 :exposure/of :research/search
 :exposure/target :opencode
 :exposure/as :tool
 :tool/name "research_search"}

{:contract/kind :capability-grant
 :grant/capability :research/search
 :grant/to :role/researcher}
```

Names are provisional. The distinctions are load-bearing:

- capability says what the operation means;
- implementation says how one runtime performs it;
- exposure says how a host presents it;
- grant says who may invoke it.

Muse should compile implementations and exposures for a selected target. Katamorph should not know OpenCode, Claude, or Codex semantics.

## 7. Operational event and evidence contracts

The operational event envelope should remain small and stable. The canonical executable shape is owned by `open-hax/event-ledger`:

```clojure
{:event/id ...
 :event/type ...
 :event/time ...
 :event/from ...
 :event/to ...
 :causal/root ...
 :causal/parent ...
 :session/id ...
 :turn/id ...
 :delivery/mode ...
 :delivery/id ...
 :payload {...}
 :contracts [...]
 :expectations {...}}
```

The current canonical Malli schema has no in-band envelope-version field. Compatibility is therefore enforced by importing or pinning a known `event-ledger` schema revision and by the versioned contract identifiers carried in `:contracts`; consumers must not claim to validate an envelope version that the schema does not expose.

Payload meaning comes from versioned contract references. A receipt, session message, Rheos transition, mycology observation, and Epiphany review decision should not be merged into one giant optional schema.

Older, legacy, or foreign envelopes must cross an explicit adapter boundary:

1. validate the source envelope against its declared source schema where available;
2. convert it into the canonical event-ledger fields;
3. retain source schema/revision and conversion provenance in adapter records or referenced contracts;
4. report unsupported or lossy conversion explicitly instead of silently accepting it.

The OpenPlanner legacy bridge is one such compatibility adapter. It is not a second canonical envelope.

### Epiphany consumption of eta-mu ledgers

Add source adapters rather than making Epiphany the operational writer:

```text
event-ledger stream
  -> canonical envelope/schema validation
  -> source-specific payload decoder
  -> Epiphany observation records
  -> extraction/correlation candidates
  -> lexical/vector/graph projections
  -> explicit review where interpretation is material
```

Epiphany should initially consume at least:

| Stream | Observed purpose |
|---|---|
| Sol session/turn ledger | Reconstruct agent episodes, context use, outputs, and causal tool activity |
| Rheos ledger | Connect work state, transitions, actors, commits, artifacts, and outcomes |
| Receipt stream | Preserve an agent/harness's claimed trace and compare it with objective runtime events |
| Mycology stream | Track retrospection, candidate skills, evidence, evaluation, and accepted promotion |
| Git events/resources | Relate runtime activity to exact repository revisions and contract changes |

A receipt remains a subjective/declared trace. A runtime event remains an objective system observation. Epiphany may correlate them; it must not collapse them.

## 8. Epiphany and OpenPlanner

Epiphany succeeds the broader aspiration that motivated OpenPlanner: make a complex technical/research workspace navigable and intelligible across documents, code, history, graphs, and agents.

That does not require deleting every OpenPlanner component immediately.

The clean transitional relationship is:

```text
Epiphany observations + accepted relations
       |
       v
OpenPlanner projection adapter
       |
       +-- compatibility search API
       +-- graph traversal API
       +-- existing clients
```

Rules:

1. OpenPlanner collections are derived and rebuildable.
2. OpenPlanner does not independently promote semantic similarity into accepted knowledge.
3. Epiphany retains evidence tier, source identity, model/extractor version, and review state.
4. The OpenPlanner API may survive even if its implementation is later rewritten in Clojure.
5. Retirement is an operational decision after Epiphany provides equivalent useful projections.

The possible long-term outcomes are all compatible with the contracts:

- retain OpenPlanner as a specialized projection service;
- replace its implementation while preserving its protocol;
- retire it after consumers migrate.

## 9. Knoxx composition

Knoxx should become a specific deployable eta-mu composition:

```text
Knoxx
  ├─ Uxx + Knoxx web shell
  ├─ eta-mu chat-ui
  ├─ Sol + turn-processor
  ├─ Rheos workflows
  ├─ Axxium identity/auth
  ├─ Katamorph contracts
  ├─ Muse host/runtime compilation
  ├─ event-ledger
  ├─ product modules
  │    ├─ studio
  │    ├─ CMS
  │    └─ translation/review
  └─ optional Epiphany context/query adapter
```

### Session independence

Knoxx must not depend on OpenPlanner or Epiphany to preserve basic session memory.

- Sol owns session and turn behavior.
- Sol appends session events to event-ledger.
- Knoxx resumes local product sessions through Sol's contracted session interface.
- Epiphany asynchronously consumes those ledgers and provides richer cross-session, cross-repository, and evidence-aware context.
- Knoxx remains usable when Epiphany is disabled or unavailable.

### Ingestion independence

The Knoxx ingestor should be removed as a product-owned subsystem.

Its useful declarative source configuration should migrate into Epiphany source-policy resources. Knoxx may expose ingestion status and controls through an Epiphany adapter, but it should not scan repositories, own embedding/index pipelines, or write knowledge projections itself.

### Configurable relationship

A provisional Katamorph source declaration could be:

```clojure
{:contract/kind :source
 :contract/id :knoxx/epiphany-workspace
 :source/id :epiphany/workspace
 :source/driver :epiphany
 :source/protocol :eta-mu/context-source.v1
 :source/enabled? true
 :source/hydration
 {:queries [:recent-session-context
            :related-contracts
            :workspace-evidence
            :active-work]}}
```

The exact fields require contract design. The behavior is the requirement:

- no Epiphany: Knoxx still chats, runs tools, records sessions, and operates product workflows;
- Epiphany present: Knoxx gains workspace search, provenance, lineage, graph traversal, research support, and richer context packets.

## 10. Memory as a query product

A memory packet is a bounded, disposable view over canonical and durable records. It is not another source of truth.

A context response should carry:

```clojure
{:context/query ...
 :context/profile-version ...
 :context/revision-scope ...
 :context/time-scope ...
 :context/items
 [{:source/ref ...
   :evidence/ref ...
   :epistemic/status ...
   :score/components ...}]
 :context/truncated? ...
 :context/limitations [...]}
```

This allows Sol, Knoxx, Muse-generated runtimes, and future agents to consume Epiphany without binding themselves to its internal Mongo/Lucene/graph implementation.

## 11. Repository topology

Use repository boundaries to express independent release and authority, not importance.

```text
open-hax/eta-mu          rewrite/integration monorepo
open-hax/katamorph       shared contract language
open-hax/event-ledger    operational event spine
octave-commons/muse      host-runtime compiler
octave-commons/epiphany  workspace/research platform
open-hax/knoxx           product composition
open-hax/proxx           provider-routing specialist
open-hax/uxx             presentation library
```

Prefer immutable Git dependencies or released artifacts for normal consumption. Use submodules only where coordinated source assembly is itself the product. Katamorph and event-ledger should remain externally versioned dependencies even when eta-mu hosts conformance fixtures and migration work.

## 12. Migration sequence

### Phase A — Freeze shared boundaries

1. Canonicalize the operational event envelope in event-ledger and publish a pinned tag or immutable revision for each incompatible schema change.
2. Remove eta-mu protocol copies and import/re-export the canonical schema.
3. Define Katamorph resource identity, schema version, references, and extension registration.
4. Complete the capability semantic/implementation/exposure/grant reconciliation.
5. Define versioned context-query and projection-feed protocols.

### Phase B — Make Sol independent

1. Load Knoxx-compatible agent/actor/role/provider contracts through Katamorph.
2. Store and resume sessions through Sol plus event-ledger.
3. Remove hard OpenPlanner session-memory dependencies.
4. Add an optional context-source port.

### Phase C — Make Muse the compiler

1. Consume Katamorph resources.
2. Link capability implementations.
3. Select profile/grants/policies/exposures.
4. Compile OpenCode, eta-mu-native, Claude, Codex, and MCP targets incrementally.
5. Emit explicit diagnostics for unsupported or lossy projections.
6. Instrument generated targets with the common event envelope.

### Phase D — Move ingestion to Epiphany

1. Define a Katamorph-compatible workspace-source extension.
2. Port Knoxx source discovery/scheduling/backpressure settings.
3. Add eta-mu ledger source adapters.
4. Add contract-resource extraction and cross-repository relationship projections.
5. Make Knoxx ingestion endpoints compatibility proxies, then remove the internal ingestor.

### Phase E — Reframe OpenPlanner

1. Stop treating OpenPlanner collections as canonical.
2. Build an Epiphany-to-OpenPlanner projection adapter.
3. Inventory actual API consumers.
4. Preserve useful protocol surfaces while implementation choices remain open.

### Phase F — Rebuild Knoxx as a composition

1. Replace internal runtime machinery with eta-mu modules.
2. Retain Knoxx product contracts, workflows, and UI experience.
3. Introduce a product deployment/composition contract.
4. Make Epiphany optional and configurable.
5. Prove the same runtime modules in at least one non-Knoxx composition.

## 13. Conformance laws

The constellation needs cross-repository executable laws:

1. **Schema ownership:** a canonical kind has one owning registry and no consumer-local redefinition.
2. **Round trip:** canonical resource -> target projection -> observable host descriptor preserves declared semantics or reports explicit loss.
3. **Event compatibility:** every producer and consumer validates against the canonical event-ledger envelope schema revision it imports; payload compatibility is governed by versioned `:contracts` references, and older or foreign envelopes must pass through explicit adapters or fail clearly.
4. **Idempotency:** replaying a durable request/event identity does not duplicate material records.
5. **Authority:** derived projections cannot mutate or silently promote canonical observations.
6. **Epistemic status:** observed, derived, provisional, accepted, rejected, stale, unavailable, corrupt, empty, and not-implemented remain distinguishable where material.
7. **Optional integration:** Knoxx/Sol operate without Epiphany; adding Epiphany enriches context without changing core runtime correctness.
8. **Rebuildability:** OpenPlanner/search/vector/graph projections can be rebuilt from their declared canonical and durable inputs.
9. **Exact identity:** Git paths and object IDs survive adapters without hidden normalization.
10. **Adapter parity:** direct, HTTP, generated-host, and native boundaries yield equivalent domain outcomes where they claim the same protocol.

## 14. Architectural sentence

> Eta-mu defines a contract-governed operational context; Katamorph describes its resources, Muse projects them into runtimes, Sol acts within it, Rheos coordinates work within it, Knoxx packages a human-facing product over it, and Epiphany helps humans and agents build evidence-governed understanding across the repositories, ledgers, research, and experiments that context produces.
