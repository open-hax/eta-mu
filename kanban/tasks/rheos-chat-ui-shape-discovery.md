---
category: "tasks"
labels: ["tasks", "rheos", "chat-ui", "cljs", "discovery", "shape", "law", "3sp"]
write-id: "1788040488001-0.lndxgigzdanzeqoj1c"
points: "3"
source: "construction-order discovery pass after PR #134"
title: "Discovery: Rheos + chat-ui latent shapes and reuse map"
priority: "P1"
status: "done"
uuid: "rheos-chat-ui-shape-discovery"
created_at: "2026-06-16T00:00:00Z"
---

# Discovery: Rheos + chat-ui latent shapes and reuse map

Discovery phase of the Clojure Construction Order (`AGENTS.md` → "Clojure Construction
Order") over the Rheos + chat-ui surface from PR #134. No behaviour changed.

**Output:** `docs/rheos-chat-ui-shape-discovery.md` — a named inventory of every data
structure crossing a boundary without a `law.*` schema or `shape.*` morphism, an anomaly
log, and a reuse map of shapes that already exist in sibling packages.

## Key surprises (already-there shapes)
- `shape.kanban/valid?` is **dead code** — the existing schemas are documentation, never validators.
- The canonical event **`envelope-schema`** already exists in `packages/event-ledger` (and `packages/protocols`); Rheos emits ad-hoc event maps instead of conformant envelopes.
- `rheos.backend.infra.store/IStore` reinvents **`katamorph.store.protocol/IStore`** (its own docstring admits the "sol-extraction IStore idea").
- chat-ui's `IChatSession` + ad-hoc `ChatBody`/`StartResponse` (with defensive `sessionId`/`session_id` dual reads) duplicate **`sol.shape.agent/ChatBody` + `IAgentSession`**.
- `agent_tools.cljs` hand-rolls tool input schemas; **`katamorph.schema`** is a full contract registry with `validate`.

## Acceptance (this card = Discovery only)
- [x] Backend, UI, and chat-ui swept; latent shapes named with file:line.
- [x] Anomaly log recorded (invalidates-target classified).
- [x] Reuse map verified against source (event-ledger schema, katamorph store, sol ChatBody).
- [x] Artifact committed and linked from `AGENTS.md` and `kanban/epics/kanban-cljs-rewrite.md`.

## Follow-on slices (new cards on triage — not started here)
1. **define (law):** the Malli in `shape.kanban` is a law (it *describes* the Task shape) misfiled in `shape` — author it as `law.kanban`, leaving `shape` for the morphisms it describes. Add the missing descriptions: `Frontmatter` (+ mutable-key whitelist), `ComposeQuery`/`WhereClause`, `ChatEvent` union, `FsmConfig`; make `validate` load-bearing.
2. **define (reuse):** conform Rheos events to `event-ledger/envelope-schema`; evaluate adopting `sol.shape.agent` (chat-ui) and `katamorph.schema` (tool contracts).
3. **shape:** centralize Task (de)serialize + camelCase mapping; canonicalize frontmatter aliases; unify chat `SessionState`/`StreamConnection`.
4. **extern:** name the unfenced `extern.browser.*` / `extern.fs` / `extern.process` boundaries.
5. **domain/infra:** push I/O out of `domain.*` (compose/events/task-edit/transition) into `infra.*` — resolves the reviewers' standing purity note and the PR-134 frontmatter-whitelist / status-FSM should-fixes fall out of slice 1.

---
Closure audit 2026-08-29: acceptance is complete. Discovery artifact docs/rheos-chat-ui-shape-discovery.md was implemented in d7477c7b21f1f0b50ad7e71c2a5f38453497cb0c and merged by PR #134 as ec489dae6b566df6ddd93d8c0ec6a3ec97a5a144. Current AGENTS.md and epic kanban-cljs-rewrite both link the artifact; the epic link was restored lawfully as a Rheos comment in this branch.
---