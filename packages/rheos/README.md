# @eta-mu/rheos

Kanban board runtime and service shell for the eta-mu workspace. Rheos is a
ClojureScript Fastify + React app that reads markdown kanban cards from disk,
serves a board UI, exposes a kanban HTTP/MCP API, and ships a `rheos` CLI for the
same operations. Status moves are FSM-enforced and ledger-backed so the CLI, the
UI, and the MCP tools cannot diverge on what transitions are legal.

It is an active ClojureScript package — there is no TypeScript source here. See
`AGENTS.md` for CLJS conventions and shadow-cljs construction order before
editing build/test flows.

## Build, test, lint

Run these commands from the repository root:

```bash
pnpm -C packages/rheos build        # shadow-cljs release server cli github-sync app -> dist/
pnpm -C packages/rheos watch        # shadow-cljs watch server-dev (hot reload, dist-dev)
pnpm -C packages/rheos start        # node dist/server.js  (production build output)
pnpm -C packages/rheos start:dev    # node dist-dev/server.js  (dev build output)
pnpm -C packages/rheos test         # shadow-cljs compile test && node dist/test.cjs
pnpm -C packages/rheos lint         # clj-kondo --lint src test
pnpm -C packages/rheos lint:kondo   # alias of lint
pnpm -C packages/rheos clean        # rm -rf dist dist-dev target
```

`build` releases the `server`, `cli`, `github-sync` and browser `app` targets.
The browser output is `dist/web/js`, served statically by the server. The local
`bb.edn` also offers build/watch/test/lint/clean tasks, but its `build` currently
releases only `server` and `cli`; use the pnpm command for all four targets.

> The `test` package script runs `node dist/test.cjs`; the `:test` shadow build
> writes its bundle to `dist/test.cjs` with `:autorun true`.

## shadow-cljs targets

Defined in `shadow-cljs.edn`. Source paths pull in sibling workspace packages:
`../protocols/src` and `../chat-ui/src`, alongside Rheos's own `src` and `test`.
The deprecated `event-ledger` package is not on the source path or in the npm
manifest.

| Build | Target | Output | Entry / notes |
|-------|--------|--------|---------------|
| `server` | `:esm` `:node` | `dist/` | init-fn `rheos.backend.infra.http-server/init`; `:optimizations :simple` (bare JS interop, no `:advanced`) |
| `server-dev` | `:esm` `:node` | `dist-dev/` | same init-fn; hot reload via `stop-http-before-load!` / `start-http-after-load!` |
| `cli` | `:node-script` | `dist/cli.cjs` | main `rheos.backend.infra.cli/main`; `.cjs` so node runs it as CommonJS under `"type":"module"` |
| `github-sync` | `:node-script` | `dist/github-sync.cjs` | main `rheos.backend.infra.github-sync-cli/main`; explicit GitHub projection boundary |
| `app` | `:browser` | `dist/web/js` | init-fn `rheos.ui.infra.mount/init`; asset-path `/js` |
| `test` | `:node-test` | `dist/test.cjs` | ns-regexp `-test$`, autorun |

Ports: nREPL `8799`, watch HTTP `9634`, dev-http (`resources/public`) `8800`.
The HTTP server listens per `rheos.backend.infra.config` (config + flags).

## CLI

The package installs a `rheos` bin (`dist/cli.cjs`) that owns a card's whole
lifecycle: `create`, `move`, `comment`, `frontmatter`, plus the read verbs and
`serve`.

**→ [`docs/cli.md`](docs/cli.md) is the reference**: install, agent quickstart,
every verb, the exit-code contract, config resolution, and the
surface-ownership table. A test asserts it covers every verb in the CLI's verb
registry — the same registry `rheos --help` renders from — so a new verb cannot
ship undocumented.

```bash
npm i -g @eta-mu/rheos     # Node 22
rheos --help               # every verb
rheos help create          # one verb's flags and a worked example
```

Mutating verbs route through the same domain chokepoints the HTTP handlers and
MCP tools use — `transition/move-task!` for status, `task-edit` for comments and
frontmatter, `task-create` for creation — so the CLI, server, MCP, and UI cannot
diverge. Every mutation appends to the project ledger and publishes to the SSE
stream. `serve` boots the HTTP server in-process.

Failures exit non-zero: `1` usage, `2` not found, `3` refused by policy (FSM,
WIP, build gate), `4` internal.

Config comes from `--config <path>`, `$KANBAN_CONFIG`, or discovery walking up
from the working directory. **EDN is preferred** (`openhax.kanban.edn`);
`openhax.kanban.json` / `kanban.json` still load with a deprecation warning.

## HTTP / MCP surface

`rheos.backend.infra.http-server` registers a Fastify app (with `@fastify/cors`
and `@fastify/static` serving the built web UI from `dist/web`):

- `GET /api/projects`, `GET /api/boards`, `GET /api/board`, `GET /api/board/compose`
- `GET /api/events`, `GET /api/events/stream` (SSE), `GET /api/drift`
- `GET /api/task/:uuid/content`
- `PATCH /api/task/:uuid/frontmatter`
- `POST /api/task/:uuid/comment`, `POST /api/task/:uuid/status`, `POST /api/task/:uuid/open-editor`
- `POST /mcp` — MCP transport (`rheos.backend.infra.mcp`) exposing the `kanban_*` tools
- `POST /api/chat/start`, `POST /api/chat`, `GET /api/chat/stream` — chat proxy
- `GET /api/health`

## Namespace layout

CLJS source lives under `src/rheos/`, split into a backend service and a browser
UI, each using a domain / law / shape / infra layering:

- `rheos.backend.domain` — `board`, `compose`, `events`, `task-create`,
  `task-edit`, `transition` (the last three are the write chokepoints: creation,
  frontmatter/comments, status)
- `rheos.backend.law` — `frontmatter`, `fsm` (legal-transition rules)
- `rheos.backend.shape` — `content-parser`, `kanban` (markdown card parsing)
- `rheos.backend.infra` — `http-server`, `cli`, `mcp`, `config`, `projects`,
  `store` / `task-store` / `view-store`, `ledger`, `watcher`, `task-writeback`,
  `agent-tools`, `chat-proxy`
- `rheos.ui.domain` — `board`, `filter-bar`, `layout`, `orchestrator`, `sidebar`
- `rheos.ui.law` — `url`
- `rheos.ui.infra` — `mount`, `api`, `chat-session`, `ledger-stream`

The eight service protocols and compatibility wire envelope come from
`@open-hax/protocols`, declared as `workspace:*` in `package.json` and consumed
through `../protocols/src`. Chat components come from `@open-hax/chat-ui` through
`../chat-ui/src`. Neither is a reason to add the deprecated `event-ledger`
package back to Rheos.

## Ledger ownership and existing board history

[Clio](../clio/README.md) owns canonical event sourcing for eta-mu. Rheos's
current `rheos.backend.infra.ledger/get-ledger` still constructs
`open-hax.records.edn.event-admission/create-edn-event-admission` and reads/writes
raw service envelopes in `<board-dir>/.events/ledger.edn`. This is a compatibility
adapter inside `packages/protocols`, not a dependency on the retired standalone
package and not a completed Clio migration.

The [Clio-backed service provider](../protocols/README.md#legacy-edn-compatibility)
uses a separate `services.edn` plus historical schema snapshots. Moving an
existing board requires an explicit importer, preservation and validation of
its event history, and a comparison of rebuilt board projections before the
adapter changes. Opening old board data does not automatically rewrite it.
