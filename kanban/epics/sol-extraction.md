---
uuid: "sol-extraction"
title: "Sol: Extract Agent API from Knoxx"
status: accepted
priority: P0
labels: ["epics", "cljs", "agent-api", "sol", "knoxx-extraction"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
points: 34
category: epics
---

# Sol: Extract Agent API from Knoxx

> Package: `orgs/open-hax/eta-mu/packages/sol`
> CLI: `eta-mu sol serve`, `eta-mu sol chat`, `eta-mu sol sessions`
> Shares MongoDB with knoxx (`openplanner` database)
> North star: `eta-mu-sol` (JVM, octave-commons) — same ideas, full conclusion

## Purpose

Extract the generic agent runtime from knoxx into an independent, independently-deployable service called **sol**. Sol lives at `eta-mu/packages/sol` and is invoked via `eta-mu sol ...`.

## Architecture: Composable Fastify Plugins

Sol is a Fastify plugin published as `@open-hax/sol`. Knoxx does NOT proxy to sol — knoxx COMPOSES sol's plugin:

```clojure
;; knoxx becomes a thin shell gluing protocol records
(doto (fastify)
  (register openplanner-plugin)
  (register sol-plugin)         ;; from @open-hax/sol
  (register proxx-plugin)
  (listen 8789))
```

### Driver Protocol (IStore)

Every service protocol is backed by a driver implementing `IStore`:

```clojure
(defprotocol IStore
  (get-by-id [store id])
  (query [store filters])
  (put! [store record])
  (update! [store id patch])
  (delete! [store id])
  (count-all [store]))
```

Implementations: MongoStore, EdnStore, JsonStore, MemStore, RestStore, SocketStore.

### Prerequisite: Event Ledger Protocol

Before knoxx can swap its implementation, the event ledger protocol must exist in three backing stores:
- **EdnFileLedger** — default for sol, file-backed
- **MongoLedger** — for knoxx at scale
- **MemLedger** — for tests

## What gets extracted

| Component | Source |
|---|---|
| Session/run lifecycle | `mongo_session_store`, `mongo_run_store` |
| Agent turn execution | `infra/agent/turn`, `runner`, `service`, `session` |
| Realtime WS/SSE | `domain/realtime` |
| Stream infrastructure | `infra/agent/stream/*` |
| OpenAI-compat proxy | `/v1/chat/completions`, `/v1/models` |

## Constraints

- All code in CLJS
- Port: 7777 (knoxx is 8789; both must coexist during migration)
- Same MongoDB database as knoxx (`openplanner`)
- No knoxx-specific policy/auth coupling
