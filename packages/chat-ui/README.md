# @open-hax/chat-ui

Backend-agnostic chat UI components for the eta-mu workspace, written in
ClojureScript with [Helix](https://github.com/lilactown/helix) (React 18) and
built with shadow-cljs. Components render against CSS custom properties
(`--token-colors-*`), so they inherit the host application's design tokens.

## Public surface

The `:lib` build (`:target :esm`, output `dist/`) exports:

| Export | Source | What it is |
|--------|--------|------------|
| `ChatPanel` | `eta_mu/chat_ui/panel.cljs` | Scrollable message list + composer; props `:messages :is-sending :on-send :on-abort :placeholder :title`. |
| `MessageBubble` | `eta_mu/chat_ui/message.cljs` | Single message rendered as markdown (`marked` → `dompurify`). |
| `ChatComposer` | `eta_mu/chat_ui/composer.cljs` | Input field + send button (Enter to send, Shift+Enter for newline). |
| `useChatSession` | `eta_mu/chat_ui/protocol.cljs` (`use-chat-session`) | React hook managing a session lifecycle; returns `{:messages :is-sending :send :abort :session}`. |
| `createSolSession` | `eta_mu/chat_ui/sol_session.cljs` | `IChatSession` over a Sol-compatible runtime. |
| `createKnoxxSession` | `eta_mu/chat_ui/knoxx_session.cljs` | `IChatSession` over a knoxx-style chat API. |
| `createMockSession` | `eta_mu/chat_ui/mock_session.cljs` | In-memory `IChatSession` that echoes a canned reply; no network. |

### `IChatSession` protocol

Defined in `eta_mu/chat_ui/protocol.cljs`. All backends implement it, so panels
are decoupled from transport:

```clojure
(defprotocol IChatSession
  (send-message [session text] "Send a user message. Returns Promise<response>.")
  (subscribe    [session callback] "Subscribe to streaming responses. Returns unsubscribe fn.")
  (abort        [session] "Abort current generation.")
  (history      [session] "Get message history. Returns Promise<vector>.")
  (close        [session] "Close the session."))
```

Streaming callbacks receive `{:type "token" :text ... :id ...}`, `{:type "done"}`,
or `{:type "error"}` events; `use-chat-session` folds these into the `:messages`
vector.

## Backends

- **sol** (`create-sol-session`) — POSTs to `<base-url><prefix>/chat/start` and
  opens a `/ws/stream` WebSocket; maps `tokens`/`events` channels to UI events.
- **knoxx** (`create-knoxx-session`) — talks to a knoxx-style chat API
  (`<base-url><chat-path>/start`, WS `/ws/stream`); supports an `x-api-key`
  header (`KNOXX_API_KEY` in Node).
- **mock** (`create-mock-session`) — echoes a canned reply after a delay; used
  for standalone testing and as a fallback when no backend is connected.

## Build, dev, and test

This package is part of the eta-mu pnpm/shadow-cljs workspace. Run scripts with
`pnpm -C packages/chat-ui <script>` from the repo root.

```bash
# Library build (ESM exports → dist/)
pnpm -C packages/chat-ui run build        # shadow-cljs compile lib

# Standalone browser app (resources/public/js, dev-http on :8080)
pnpm -C packages/chat-ui run build:app    # shadow-cljs compile app
pnpm -C packages/chat-ui run dev          # shadow-cljs watch app

# Tests (node-test, eta-mu.chat-ui.*-test)
pnpm -C packages/chat-ui run test         # shadow-cljs compile test && node target/test.cjs

# Lint and clean
pnpm -C packages/chat-ui run lint:kondo   # clj-kondo --lint src test
pnpm -C packages/chat-ui run clean        # rm -rf dist target
```

The `:app` build (`eta_mu/chat_ui/core.cljs`) is a standalone harness that wires
the panel to a backend selector (mock/sol/knoxx) for manual testing.

> **Note:** `marked` is pinned to v4. `marked@12+` uses ECMAScript `#private`
> class fields that the Closure compiler (shadow-cljs) cannot parse, which breaks
> the build. Do not bump without verifying the Closure build.

## Relationship to Rheos

[`@eta-mu/rheos`](../Rheos) consumes chat-ui **as a shadow-cljs source path**
(`../chat-ui/src` in `packages/rheos/shadow-cljs.edn`), not as a published npm
dependency. Rheos's UI slice requires `eta-mu.chat-ui.protocol`,
`eta-mu.chat-ui.panel`, `eta-mu.chat-ui.knoxx-session`, and
`eta-mu.chat-ui.mock-session` directly (see `rheos/ui/domain/orchestrator.cljs`
and `rheos/ui/infra/chat_session.cljs`), and provides its own `IChatSession`
implementation that bridges Rheos transport envelopes to chat-ui events.
