# @open-hax/mcp-contracts

Generic ClojureScript loader that teaches a knoxx-style agent runtime to accept
`:mcp-server` contracts. It reads MCP server declarations from contract roots and
returns the gateway server-config map the runtime's `mcp-bridge/initialize!`
already understands. It knows nothing about any particular MCP server — every
server is declared as **data** (a contract) instead of code or env wiring.

This closes a gap in the original knoxx MCP gateway, which only ever built its
server list from the `MCP_SERVERS` env var plus a couple of hardcoded entries and
never read the `:mcp-server` contract kind.

## Consumption

This package has no build or compiled output. It is consumed by adding its `src`
to a CLJS source-path and requiring the namespace directly:

```clojure
(require '[eta-mu.mcp-contracts :as mcp-contracts])

;; roots is a seq of contract-root paths; each is scanned for <root>/mcp_servers/*.edn
(mcp-contracts/gateway-servers ["/path/to/contracts"])
;; => {"rheos-kanban" {:url "http://127.0.0.1:8792/mcp" :transport "http"}}
```

The consuming runtime merges that result into its gateway init. The contract
*instances* live with whatever package owns them — e.g. `packages/kanban-orchestrator`
ships the `rheos-kanban` contract under `contracts/mcp_servers/`.

## Contract shape

An `:mcp-server` contract is an EDN map placed under `<contract-root>/mcp_servers/*.edn`:

```clojure
{:contract/kind :mcp-server
 :contract/id "rheos_kanban"
 :mcp-server/id "rheos-kanban"          ; bridge id; falls back to :contract/id
 :mcp-server/transport :http            ; optional, defaults to :http
 :mcp-server/url "http://127.0.0.1:8792/mcp"
 :enabled true}                          ; only enabled contracts are loaded
```

A contract is loaded only when it is a map with `:contract/kind` `:mcp-server`,
`:enabled` truthy, and a non-nil `:mcp-server/url`. An optional
`:mcp-server/auth-token-env` names an environment variable holding a shared
secret — the secret is read from `process.env` at load time and attached as
`:shared-secret`, so the token itself is never written into the contract.

## Public surface

`eta-mu.mcp-contracts` exposes:

- `gateway-servers` — given a seq of contract root paths, return the
  `{server-id {:url :transport [:shared-secret]}}` map for every enabled
  `:mcp-server` contract found under `<root>/mcp_servers/*.edn`.
- `contract->server` — map one parsed `:mcp-server` contract to a `[id config]`
  bridge entry, or `nil` if it is not an enabled mcp-server.

## Commands

```bash
pnpm -C packages/mcp-contracts lint:kondo
```

`lint:kondo` (`clj-kondo --lint src`) is the only script. There is no build,
watch, or test target — the package is source-only and consumed via source-path.

## Adoption state

Consumed by the knoxx-style runtime today (`packages/sol` is the eta-mu rename of
that backend). The single in-repo contract instance is the `rheos-kanban` server
shipped by `packages/kanban-orchestrator`.
