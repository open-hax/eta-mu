# Sol

`@eta-mu/sol` is the eta-mu ClojureScript agent runtime backend: a Node 22 +
shadow-cljs + Fastify control plane. It owns HTTP/WebSocket transport, a minimal
agent runtime (turns, sessions, runs), contract loading, an OpenAI-compatible
surface, and Proxx-backed model access.

Sol is the eta-mu rename and trimmed-down successor of the Knoxx backend. It
shares Knoxx's namespace shape and reuses many Knoxx-derived helpers, but it is a
distinct, much smaller service. See [Knoxx coexistence](#knoxx-coexistence) and
[`AGENTS.md`](AGENTS.md) for the boundary.

## Namespaces

All CLJS lives under `src/cljs/open_hax/sol/` in the `open-hax.sol.*` namespace
(domain / law / shape / extern / infra / runtime layout):

```text
src/cljs/open_hax/sol/
├── entrypoint.cljs            # shadow-cljs :server/:server-dev init-fn → bootstrap!
├── bootstrap.cljs             # startup, Fastify lifecycle, hot-reload hooks
├── plugin.cljs                # Fastify plugin (sol-plugin) for embedding Sol
├── contract_runtime_deps.cljs # injects contract-runtime dependencies into config
├── macros.cljc                # defroute macro (+ then/catch helpers)
├── domain/                    # agent, contracts, models, node, realtime, text, time
│   ├── agent/                 # agent-context, templates, content, reasoning, turn-guards
│   ├── contracts/             # loader, resolve, roles, sources, mcp-servers, client
│   └── node/                  # crypto, fs, path wrappers
├── infra/                     # config, core, http, http-server, lifecycle, graceful-shutdown
│   ├── agent/                 # runner, runtime, service, session(-store), run-state, turn,
│   │   ├── provider/          #   turn-processor provider adapter
│   │   └── stream/            #   provider-events, reducer, sinks
│   └── routes/app.cljs        # the route table (register-routes!)
├── law/contracts.cljs         # contract/law helpers
├── shape/                     # agent, app-shapes (defines route!), parse, session-persistence
├── extern/                    # JS/Node/eta-mu interop adapters (fastify, fetch, json, tools, …)
└── runtime/state.cljs         # process-local runtime/config atoms
```

`infra/config.cljs` reads runtime config from the environment (see
[Configuration](#configuration)). Tests live under `test/cljs/open_hax/sol/`,
matched by the `:test` build's `open-hax\.sol\..*-test$` regex.

## Build targets

Defined in `shadow-cljs.edn` (nREPL `4501`, dev HTTP `9633`). Source-paths
include sibling packages `../katamorph/src/cljs` and `../event-ledger/src`. All
runtime builds are `:target :esm` with `:js-provider :import`; Node and npm
modules (`node:*`, `fastify`, `ws`, `typebox`, `@modelcontextprotocol/sdk`)
stay runtime imports via `:keep-as-import`.

| Build | Target | Output | Notes |
|-------|--------|--------|-------|
| `:server` | `:esm` `:node` | `dist/server.js` | Production runtime; init-fn `open-hax.sol.entrypoint/init` |
| `:server-dev` | `:esm` `:node` | `dist-dev/server.js` | Hot-reload dev; same init-fn, devtools before/after-load HTTP restart hooks |
| `:app` | `:esm` | `dist/app.js` | Embeddable module; exports `solPlugin`, `config`, `bootstrap`, `start`, `registerAppRoutes`, `registerWsRoutes` |
| `:test` | `:node-test` | `target/test/test.cjs` | Autorun node-test; ns-regexp `open-hax\.sol\..*-test$` |

Startup path:

```text
shadow-cljs :server / :server-dev
  → open-hax.sol.entrypoint/init
  → open-hax.sol.bootstrap/bootstrap!
  → start-http! (Fastify app + ws routes + app routes)
```

## Development and test commands

From `packages/sol/` (pnpm; this is a workspace member):

```bash
pnpm watch        # shadow-cljs watch server-dev → dist-dev/server.js
pnpm start:dev    # node dist-dev/server.js
pnpm build        # shadow-cljs compile server → dist/server.js
pnpm start        # node dist/server.js
pnpm test         # shadow-cljs compile test (autoruns target/test/test.cjs)
pnpm lint         # clj-kondo --lint src/cljs test/cljs   (alias: lint:kondo)
pnpm typecheck    # shadow-cljs compile server
```

After a code change, follow the workspace CLJS construction order in
[`AGENTS.md`](AGENTS.md): the shadow build can exit zero while the program is
broken, so inspect compiler/test output and, for runtime changes, also compile
`server` to catch errors the `test` build does not.

PM2 dev stack (shadow watch + nbb launcher that waits for `dist-dev/server.js`):

```bash
pm2 start ecosystem.config.cjs   # sol-shadow + sol-backend
pm2 logs sol
```

## Route surface

Routes are defined with the `defroute` macro in
`infra/routes/app.cljs` and registered by `register-routes!`. The realtime WS
route is registered separately by `domain/realtime/register-ws-routes!`.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Liveness; `{:service "open-hax-sol-cljs"}` |
| `GET` | `/v1/models` | OpenAI-style model list (from model config providers) |
| `POST` | `/v1/chat/completions` | OpenAI-style completion; runs one agent turn (streaming returns 501) |
| `POST` | `/api/agent/chat` | Run an agent turn to completion (200) |
| `POST` | `/api/agent/direct` | Wire-compatible alias of `/api/agent/chat` (no RAG layer in Sol) |
| `POST` | `/api/agent/chat/start` | Queue a run, reply 202; tokens stream over `/ws/stream` |
| `POST` | `/api/agent/direct/start` | Alias of `/api/agent/chat/start` |
| `GET` | `/api/agent/sessions/:id` | Session status / can-send |
| `POST` | `/api/agent/sessions/:id/abort` | Abort the active run for a session |
| `GET` | `/api/agent/run/:run_id` | Run record |
| `GET` | `/api/agent/run/:run_id/events` | Run event log |
| `WS` | `/ws/stream` | Realtime token / run-event stream |

The `/api/agent/*` table mirrors Knoxx's `/api/knoxx/*` surface 1:1 (only the
prefix differs). Sol has no retrieval layer, so `chat` and `direct` run the same
plain turn. There is no admin/RBAC, memory, studio/voice, MCP-HTTP, or proxy
route surface here — those exist in Knoxx, not Sol.

## Plugin entrypoint

`open-hax.sol.plugin/sol-plugin` is a Fastify plugin for embedding Sol inside
another server. It takes JS opts `{runtime, config}`, registers default plugins,
WS routes, and app routes, then calls `done`. The `:app` build exports it as
`solPlugin` alongside `bootstrap`, `start`, `config`, `registerAppRoutes`, and
`registerWsRoutes` for programmatic embedding.

## Configuration

Config is read in `infra/config.cljs` (`cfg`) from environment variables.
Sol-scoped vars take precedence so a leaked ambient `HOST`/`PORT` from a Knoxx
shell cannot re-point Sol:

```bash
SOL_HOST=0.0.0.0          # falls back to HOST, then 0.0.0.0
SOL_PORT=8001             # falls back to PORT, then 8001 (Sol's own port, NOT 8000)
SOL_PUBLIC_BASE_URL=
APP_NAME="Sol CLJS"
CONTRACTS_DIR=contracts
WORKSPACE_ROOT=/app/workspace

PROXX_BASE_URL=http://proxx:8789
PROXX_AUTH_TOKEN=
PROXX_DEFAULT_MODEL=
PROXX_EMBED_MODEL=nomic-embed-text:latest
```

### KNOXX_* environment lineage

Sol's config and model code still read a `KNOXX_*` prefixed set of variables.
This is lineage, not a Knoxx dependency: the names were inherited from the Knoxx
backend and have not yet been renamed to a `SOL_*` namespace. They are read in
source today:

- `infra/config.cljs`: `KNOXX_BASE_URL`, `KNOXX_API_KEY`, `KNOXX_DEFAULT_ROLE`,
  `KNOXX_DEFAULT_ACTOR_ID`, `KNOXX_DEFAULT_AGENT_CONTRACT`,
  `KNOXX_SHUTDOWN_GRACE_MS`, `KNOXX_SHUTDOWN_POLL_MS`, `KNOXX_WORKSPACE_ROOT`,
  `KNOXX_PROVIDER_BASE_URLS`, `KNOXX_PROVIDER_AUTH_TOKENS`,
  `KNOXX_PROVIDER_AUTH_HEADERS`, `KNOXX_AGENT_DIR`,
  `KNOXX_AGENT_COMPACTION_ENABLED`, `KNOXX_AGENT_COMPACTION_RESERVE_TOKENS`,
  `KNOXX_AGENT_COMPACTION_KEEP_RECENT_TOKENS`, `KNOXX_AGENT_TURN_TIMEOUT_MS`,
  `KNOXX_AGENT_SYSTEM_PROMPT`
- `domain/models.cljs`: `KNOXX_MODEL_PREFIX_ALLOWLIST`, `KNOXX_THINKING_LEVEL`,
  `KNOXX_REASONING_MODEL_PREFIXES`, `KNOXX_RESPONSES_MODEL_PREFIXES`

Planned rename: these will move to `SOL_*` (with `KNOXX_*` retained as a
deprecated fallback) once the migration lands. Until then, set the `KNOXX_*`
names. Some serve different defaults than in Knoxx — e.g. `KNOXX_AGENT_DIR`
defaults to `/tmp/knoxx-agent` in source but the PM2 ecosystem overrides it to
`/tmp/sol-agent`.

Do not print or commit real env files. The PM2 ecosystem loads host secrets from
`~/.sol/.env` by default.

## Mutation testing

A Clojure-first mutation harness lives under `mutation/` (it mutates CLJS source
forms before shadow compiles them). It is driven by the `deps.edn` `:mutation` /
`:mutation-test` aliases. See [`mutation/README.md`](mutation/README.md).

## Knoxx coexistence

Sol and Knoxx are separate services that run side by side:

- **Ports**: Sol defaults to `8001`; Knoxx backend uses `8000`. Sol prefers
  `SOL_PORT`/`SOL_HOST` precisely so an ambient `PORT=8000` cannot collide.
- **Namespaces**: Sol is `open-hax.sol.*`; Knoxx is `knoxx.backend.*`.
- **Lineage**: Sol reuses Knoxx-derived code and `KNOXX_*` env names, and its
  `/api/agent/*` routes are wire-compatible with Knoxx's `/api/knoxx/*`. Sol is
  the smaller, eta-mu-native runtime; Knoxx remains the full agent workbench.

The only intentional Knoxx-named runtime artifact is the inherited `knoxx.*`
mutation namespace and the `KNOXX_*` env lineage above.

## License

GPL-3.0-or-later, matching the package and repository license.
</content>
</invoke>
