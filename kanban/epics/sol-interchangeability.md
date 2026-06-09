---
uuid: "sol-interchangeability"
title: "Sol/Knoxx Interchangeability via IChatSession Protocol"
status: accepted
priority: P1
labels: ["epics", "cljs", "sol", "knoxx", "protocol", "interchange"]
created_at: "2026-06-09T00:00:00Z"
source: "planning-session:2026-06-09"
points: 13
category: epics
---

# Sol/Knoxx Interchangeability via IChatSession Protocol

## Purpose

The kanban (and any eta-mu surface) can use sol or knoxx interchangeably as the agent backend. Both implement the same `IChatSession` protocol from `@open-hax/chat-ui`. The choice is config-driven, not code-driven.

## Design

### Protocol surface

```clojure
(defprotocol IChatSession
  (send-message [session text] "Send user message, return Promise<response>")
  (subscribe [session callback] "Subscribe to streaming responses")
  (abort [session] "Abort current generation")
  (history [session] "Get message history")
  (close [session] "Close session"))
```

### Implementations

| Backend | Package | Endpoint | Notes |
|---|---|---|---|
| knoxx | `@open-hax/knoxx-chat-session` | `/api/knoxx/chat` | Existing knoxx API |
| sol | `@open-hax/sol-chat-session` | `/api/sol/chat` | New sol API |
| opencode | `@open-hax/opencode-chat-session` | `/session/:id/prompt` | Opencode-compat API |
| mock | `@open-hax/mock-chat-session` | in-memory | Testing |

### Selection

The `harness` field on the task determines which backend:

```yaml
harness: knoxx    # uses knoxx chat session
harness: eta-mu   # uses sol chat session
harness: opencode # uses opencode chat session
harness: other    # falls back to configured default
```

Config default:
```json
{
  "chat": {
    "defaultBackend": "knoxx",
    "backends": {
      "knoxx": { "baseUrl": "http://localhost:8789" },
      "sol": { "baseUrl": "http://localhost:7777" },
      "opencode": { "baseUrl": "http://localhost:4096" }
    }
  }
}
```

### Sol API surface (must match knoxx)

Sol must expose the same endpoints that knoxx's chat uses:

| Endpoint | Purpose |
|---|---|
| `POST /api/sol/chat` | Sync agent turn |
| `POST /api/sol/chat/start` | Async agent turn (returns 202) |
| `POST /api/sol/abort` | Abort current turn |
| `GET /api/sol/runs/:id/events` | SSE/WS events |
| `GET /api/sol/health` | Health check |

Plus the opencode-compat surface:
| Endpoint | Purpose |
|---|---|
| `POST /session/:id/prompt` | Opencode-compat prompt |
| `GET /session/:id/message` | Opencode-compat messages |
| `GET /session` | Opencode-compat session list |

### Migration path

1. Build sol with matching API surface
2. Add sol as a backend option in kanban config
3. Test with `harness: eta-mu` on selected tasks
4. Gradually migrate tasks from knoxx to sol
5. Knoxx eventually becomes a thin shell that composes sol's plugin

## Constraints

- All code in CLJS
- Same IChatSession protocol for all backends
- No knoxx-specific imports in chat-ui or kanban
- Sol and knoxx share MongoDB (same sessions/runs)
- Config-driven backend selection, not code-driven

## Dependencies

- Sol extraction epic (sol must be running)
- Chat UI extraction epic (IChatSession protocol)
- Opencode-compat epic (for opencode backend)

## Acceptance criteria

- [ ] IChatSession protocol defined in @open-hax/chat-ui
- [ ] Knoxx implementation works (existing API)
- [ ] Sol implementation works (new API matching knoxx)
- [ ] Harness field on task selects backend
- [ ] Config provides default backend + per-backend connection info
- [ ] Switching backends doesn't lose chat history
- [ ] Mock implementation for testing
