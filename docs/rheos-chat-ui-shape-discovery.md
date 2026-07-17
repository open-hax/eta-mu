# Rheos + chat-ui Shape Discovery

Date: 2026-06-16
Parent epic: `kanban/epics/kanban-cljs-rewrite.md`
Kanban task: `kanban/tasks/rheos-chat-ui-shape-discovery.md`
Method: `AGENTS.md` → "Clojure Construction Order" (Discovery phase)
Layer vocabulary: `AGENTS.md` → "Namespace Architecture" (`law` / `shape` / `domain` / `infra` / `extern`)

## Purpose

This is the **Discovery** pass for the Rheos + chat-ui surface (PR #134). It does not
change behaviour. It names "the shapes we aren't seeing" — every data structure that
crosses a function or module boundary but is not yet a named `law.*` schema or `shape.*`
morphism — so the later `define → shape → extern → domain → infra` slices have a target.

Discovery is also where the **surprises** surface: shapes that are *already there* (in this
package or a sibling) that we hadn't described. Those are logged as anomalies; where they
don't invalidate a targeted projection, we record and continue.

Scope swept: `packages/rheos/src/rheos/backend/**`, `packages/rheos/src/rheos/ui/**`,
`packages/chat-ui/src/eta_mu/chat_ui/**`, with reuse-reconnaissance into
`packages/katamorph`, `packages/protocols`, `packages/event-ledger`, `packages/sol`.

---

## 1. The surprises — shapes already there (highest-value findings)

These are the "didn't realize it was already there" discoveries. None invalidate the
current PR's behaviour, so per the anomaly rule they are recorded here and work continues —
but they reshape the *target* projections of the rewrite.

| # | We hand-rolled… | …but this already exists | Source (verified) | Judgement |
|---|---|---|---|---|
| S1 | `rheos.backend.shape.kanban` Malli schemas (`Task`, `ColumnSnapshot`, `BoardSnapshot`, `Project`) **never validated** — `valid?` is dead code | n/a (the schemas exist but are documentation only) | `shape/kanban.cljs:51`; no caller of `valid?` found | Wire schemas as boundary validators, or the `law` layer is decorative. |
[Omitted long matching line]
| S3 | `rheos.backend.infra.store/IStore` (`-get/-put!/-keys`) + `EdnStore` | **`katamorph.store.protocol/IStore`** (`-insert/-find`) + `katamorph.store.law/compile-schema-guard` (validates on insert) | `katamorph/.../store/protocol.cljs:10`, `store/law.cljs:9`; Rheos `store.cljs:2-8` docstring *admits* it reinvents "the sol-extraction IStore idea" | Conscious descope today; converge when the view/task stores grow. |
| S4 | chat-ui `IChatSession` protocol + ad-hoc `ChatBody`/`StartResponse` (with defensive `sessionId` **or** `session_id` dual reads) | **`sol.shape.agent/ChatBody`, `AgentRequestSpec`, `ContentPart`** + `IAgentSession` protocol + `sol.shape.app-shapes/normalize-chat-body` (handles case variants) | `sol/.../shape/agent.cljs:7,24,50,89` | The dual-key reads are a *symptom*: there is no agreed request/response contract. Adopt sol's. |
| S5 | `agent_tools.cljs` tool defs with hand-written JSON-Schema `:input-schema` maps, no validation before dispatch | **`katamorph.schema` registry** (`validate`, `assert!`, 30+ contract kinds incl. `ToolPolicy`, `PolicyGateContract`) + `katamorph.policy.gate/evaluate-gates` | `katamorph/.../schema.cljs`, `policy/gate.cljs` | Define a `ToolContract` kind; validate tool args at the boundary. |

**Net:** the rewrite's `law.*`/`shape.*` target for Rheos+chat-ui is largely *adoption*, not
*authorship*. The canonical event, store, and chat contracts already exist one package over.

---

## 2. Latent shape inventory (by entity lineage)

Rather than list every map, shapes are grouped by the **entity** whose morphisms cross
boundaries. Each lineage is one thing wearing different clothes per layer.

### 2.1 Task lineage
- **`Task`** (`shape.kanban`, defined) → enriched to **`ComposedTask`** (`+:source-board :domain :org :drift`, `domain/compose.cljs:95`, fields not in the schema) → serialized to **`HttpTaskDTO`** (camelCase `:createdAt :sourcePath :taskCount`, `infra/http_server.cljs:32`) → consumed in the UI as a **string-keyed JS blob** (`(get task "uuid")`, `ui/domain/board.cljs:37`).
- Target: `law` owns `Task`; `shape` owns the enrich + the (de)serialize morphisms; the UI should consume a validated CLJS map, not a raw `js->clj` blob.
- Anomaly: the camelCase↔kebab conversion is scattered across handlers, not centralized; `:source-board` is born in compose, lost in the schema, reappears as `:sourceBoard` and again as `:project` in the drag payload (`board.cljs:154`).

### 2.2 Event lineage
- **`KanbanEnvelope`** (`domain/events.cljs:14`) → **`KanbanEvent`** (one untyped map for 5 subtypes: status-change / frontmatter / comment / file-changed / drift-detected, `events.cljs:22`) → ledger record → **SSE `LedgerStreamEvent`** the UI never introspects (just triggers refetch, `ui/infra/ledger_stream.cljs:17`).
- Target: `law` — a discriminated union keyed on `:type`, conformant to `event-ledger` `envelope-schema` (see S2). Field presence currently depends on `:type` but is unchecked.
- Anomaly: the same envelope→event transform is duplicated in `events.cljs` and `cli.cljs`.

### 2.3 Compose-query lineage
- **`ComposeQuery`** `{:status :priority :labels :across :where-clauses}` (`domain/compose.cljs:130`) built from **`WhereClause`** triples `[field op value]` with `op ∈ {:= :in :contains :regex}` (`compose.cljs:41`) → saved verbatim as a **`SavedView`** preset (flags map minus `save`/`preset`, `infra/view_store.cljs:17`).
- Target: `law` — query DSL contract; operator validity is not tied to field type, regex is not validated as regex (related: `pr-134` compose-regex tasks).
- Anomaly: a `SavedView` is whatever flags were passed; nothing guarantees a saved preset is reloadable.

### 2.4 Frontmatter / content lineage
- **`Frontmatter`** parsed by regex (`shape/content_parser.cljs:5`) with **field aliases** (`:created_at` / `:createdAt` / `:created-at`; `labels`/`tags`) → **`TaskContent`** `{:frontmatter :sections}` where **`Section`** is `{:type "body"|"comment" :content}` → re-serialized to JS for HTTP.
- Target: `shape` owns the parse/serialize morphisms; `law` owns the `Frontmatter` schema **including a whitelist of mutable keys** (directly relevant to the open PR-134 `handle-update-frontmatter` whitelist + the sidebar FSM-bypass fix already landed).
- Anomaly: `parse-task-content` is called in 3 places with divergent follow-up transforms; `Subtask` creation uses `:created_at` (underscore) while `Task` uses `:created-at` (dash).

### 2.5 Chat lineage (chat-ui)
- **`IChatSession`** protocol (`send-message/subscribe/abort/history/close`) — `history` is **declared but dead** (all impls return `(js/Promise.resolve [])`).
- **`ChatEvent`** discriminated union `{:type "token"|"done"|"error" …}`: `token` carries `:text :id`; `done`/`error` carry only `:type`. The raw WS handler emits `:run-id`, the session layer renames it to `:id`, and the `:kind` field (used only by sol to filter `"assistant_message"`) is dropped before listeners see it.
- **`SessionState`** atom shape is **different in every backend**: sol `{:session-id :conversation-id :run-id :ws}`, knoxx `{:session-id :conversation-id :stream}`, mock `{:aborted :timer :resolver}`. The connection handle is `:ws` in sol, `:stream` in knoxx — same `StreamConnection` `{:send :close :status}` (`:status` never called).
- **`StartResponse`** has no agreed shape → the dual camelCase/snake_case reads (S4); missing keys are silently accepted, risking a re-start loop.
- Target: `law` owns the protocol + `ChatEvent` union + `StartResponse`; `shape` owns a unified `SessionState` and `StreamConnection`. Strongly consider adopting `sol.shape.agent` (S4).

### 2.6 Boundary / config shapes (lower priority, still unnamed)
- `LoadedConfig` `{:config :config-path :config-dir}` and `ProjectState` `{:projects :default-project-id}` (`infra/config.cljs`); `ConfigJSON` where `:fsm` may be a string **or** a map; `ProjectMetadata` `{:domain :org :tier …}` used as compose filter keys without a schema.
- `FsmConfig` `{:enabled :enforcement :states :initial-state :transitions :checks :wip-limits}` is only ever a hardcoded literal in `law/fsm.cljs` — never validated when loaded from JSON.
- UI: `FilterState` `{:q :domain :org :status :priority}` ↔ URL round-trip (`ui/law/url.cljs`) with no validation; `DragPayload` `{:uuid :project :from}` JSON with no parse guard; `ChatConfig` `{:chat {:defaultBackend}}` is the **only** place the UI uses `js->clj :keywordize-keys true`.

---

## 3. Anomaly log

Recorded per the construction-order anomaly rule. "Invalidates target?" = does this force a
re-`describe` of a projection, or can we note-and-continue?

| ID | Anomaly | Location | Invalidates target? |
|---|---|---|---|
| A1 | `shape.kanban/valid?` defined, never called — schemas are decorative | `shape/kanban.cljs:51` | No — but it means the `law` layer is not yet load-bearing |
| A2 | Malli in `shape.*` is a law (it *describes* a shape) misfiled; `AGENTS.md` says descriptions belong in `law.*` | `shape/kanban.cljs` | No — author as `law` during `define`, leave morphisms in `shape` |
| A3 | One untyped map for 5 event subtypes; field presence unchecked | `domain/events.cljs:22` | No |
| A4 | Frontmatter field aliases (`created_at`/`createdAt`/`created-at`) treated as equal | `shape/content_parser.cljs` | No — canonicalize during `shape` slice |
| A5 | camelCase↔kebab conversion scattered, not centralized | `infra/http_server.cljs:32-51` | No |
| A6 | chat `StartResponse` requires defensive dual-key reads → no contract | `chat-ui/sol_session.cljs:60`, `knoxx_session.cljs:58` | **Maybe** — if sol's contract is adopted, the projection changes |
| A7 | `IChatSession/history` declared but dead in all impls | `chat-ui/protocol.cljs:14` | No — drop or implement during `define` |
| A8 | `SessionState` shape differs per backend; connection handle named `:ws` vs `:stream` | chat-ui sessions | No — unify during `shape` slice |
| A9 | `:fsm` config is string-or-map, never validated on load | `infra/config.cljs`, `law/fsm.cljs` | No |
| A10 | UI consumes raw `js->clj` HTTP/SSE blobs via string keys, no validation | `ui/domain/*`, `ui/infra/*` | No |
| A11 | Rheos `IStore` consciously reinvents `katamorph.store` (docstring admits it) | `infra/store.cljs:2-8` | No — descoped by design |

---

## 4. Recommended follow-on slices (define → shape → extern → domain → infra)

Ordered by the construction sequence. Each is a candidate kanban card under the
`kanban-cljs-rewrite` epic; none are started here (Discovery only).

1. **define (law):** a law *describes* a shape — it is not the morphism filed elsewhere. The
   Malli in `shape.kanban` is a law (it describes the Task shape) misfiled in `shape`; author it
   as `rheos.backend.law.kanban`, leaving `shape` for the morphisms it describes. Add the missing
   descriptions (`Frontmatter` w/ mutable-key whitelist, `ComposeQuery`/`WhereClause`,
   `ChatEvent` union, FSM config) and make `validate` load-bearing at boundaries (closes A1, A2).
2. **define (reuse):** conform Rheos events to `event-ledger` `envelope-schema` (S2); evaluate
   adopting `sol.shape.agent` for chat-ui (S4); evaluate `katamorph.schema` for tool contracts (S5).
3. **shape:** centralize the Task (de)serialize morphism + camelCase mapping (A5); canonicalize
   frontmatter aliases (A4); unify chat `SessionState`/`StreamConnection` (A8).
4. **extern:** name the raw boundaries the inventory found unfenced — `extern.browser.*`
   (fetch/WS/history/localStorage in the UI), `extern.fs`, `extern.process` — per the
   architecture-inventory boundary policy.
5. **domain/infra:** addresses the reviewers' standing note — `domain.*` (compose/events/
   task-edit/transition) currently performs I/O; once shapes are named, push effects to `infra.*`
   and leave pure decisions in `domain.*`.

This sequencing is intentional: the open PR-134 should-fix items (frontmatter-key whitelist,
status-FSM enforcement) fall out of slice 1 naturally rather than as one-off patches.
