# @open-hax/rheos

Kanban board runtime and service shell for the eta-mu workspace. Rheos is a
ClojureScript Fastify + React app that reads markdown kanban cards from disk,
serves a board UI, exposes a kanban HTTP/MCP API, and ships a `rheos` CLI for the
same operations. Status moves are FSM-enforced and ledger-backed so the CLI, the
UI, and the MCP tools cannot diverge on what transitions are legal.

It is an active ClojureScript package — there is no TypeScript source here. See
`AGENTS.md` for CLJS conventions and shadow-cljs construction order before
editing build/test flows.

## Build, test, lint

All commands run from this package directory via pnpm:

```bash
pnpm -C packages/Rheos build        # shadow-cljs release server cli  -> dist/server.js, dist/cli.cjs
pnpm -C packages/Rheos watch        # shadow-cljs watch server-dev (hot reload, dist-dev)
pnpm -C packages/Rheos start        # node dist/server.js  (production build output)
pnpm -C packages/Rheos start:dev    # node dist-dev/server.js  (dev build output)
pnpm -C packages/Rheos test         # shadow-cljs compile test && node dist/test.cjs
pnpm -C packages/Rheos lint         # clj-kondo --lint src test
pnpm -C packages/Rheos lint:kondo   # alias of lint
pnpm -C packages/Rheos clean        # rm -rf dist dist-dev target
```

`build` releases both the `server` and `cli` shadow-cljs builds. The browser
`app` build is not wired into `build`; it is the `:app` shadow target (see
below) and emits to `dist/web/js`, which the server then serves statically. A
`bb.edn` mirrors `build`/`watch`/`test`/`lint`/`clean` for Babashka users.

> The `test` package script runs `node dist/test.cjs`; the `:test` shadow build
> writes its bundle to `dist/test.cjs` with `:autorun true`.

## shadow-cljs targets

Defined in `shadow-cljs.edn`. Source paths pull in sibling workspace packages:
`../protocols/src`, `../event-ledger/src`, and `../chat-ui/src`.

| Build | Target | Output | Entry / notes |
|-------|--------|--------|---------------|
| `server` | `:esm` `:node` | `dist/` | init-fn `rheos.backend.infra.http-server/init`; `:optimizations :simple` (bare JS interop, no `:advanced`) |
| `server-dev` | `:esm` `:node` | `dist-dev/` | same init-fn; hot reload via `stop-http-before-load!` / `start-http-after-load!` |
| `cli` | `:node-script` | `dist/cli.cjs` | main `rheos.backend.infra.cli/main`; `.cjs` so node runs it as CommonJS under `"type":"module"` |
| `app` | `:browser` | `dist/web/js` | init-fn `rheos.ui.infra.mount/init`; asset-path `/js` |
| `test` | `:node-test` | `dist/test.cjs` | ns-regexp `-test$`, autorun |

Ports: nREPL `8799`, watch HTTP `9634`, dev-http (`resources/public`) `8800`.
The HTTP server listens per `rheos.backend.infra.config` (config + flags).

## CLI

The package installs a `rheos` bin (`dist/cli.cjs`). Subcommands:

```
rheos board snapshot [--tasks-dir <path>] [--out <path>]
rheos board list [--verbose]
rheos compose [--domain ...] [--status ...] [--q <text>] [--save <name>] [--preset <name>]
rheos move <task-uuid> --to <status> [--project <id>]
rheos status-update <task-uuid> --to <status> [--project <id>]
rheos add-comment <task-uuid> --text <text> [--project <id>]
rheos create-subtask <parent-uuid> --title <title> [--project <id>] [--status <s>] [--priority <p>]
rheos read-task <task-uuid> [--project <id>]
rheos search-tasks --query <text>
rheos read-board [--project <id>]
rheos events [task-uuid] [--limit <n>]
rheos drift
rheos serve [--host <host>] [--port <port>]
```

`move`, `status-update`, `add-comment`, `create-subtask`, `read-task`,
`search-tasks`, and `read-board` route through the same agent-tool dispatch
(`kanban_*` tools) the MCP server exposes, so CLI and server resolve projects
identically. `serve` boots the HTTP server in-process.

Config is loaded from `--config <path>` or `$KANBAN_CONFIG`, falling back to
`openhax.kanban.json` / `kanban.json` in the working directory; tasks-dir
resolution falls back to `docs/agile/tasks`. Projects are read from the
`projects` array of that config (each with `tasksDir`, optional `id`/`title`/
`fsm`), or a single default project derived from the tasks dir.

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

- `rheos.backend.domain` — `board`, `compose`, `events`, `task-edit`, `transition`
- `rheos.backend.law` — `frontmatter`, `fsm` (legal-transition rules)
- `rheos.backend.shape` — `content-parser`, `kanban` (markdown card parsing)
- `rheos.backend.infra` — `http-server`, `cli`, `mcp`, `config`, `projects`,
  `store` / `task-store` / `view-store`, `ledger`, `watcher`, `task-writeback`,
  `agent-tools`, `chat-proxy`
- `rheos.ui.domain` — `board`, `filter-bar`, `layout`, `orchestrator`, `sidebar`
- `rheos.ui.law` — `url`
- `rheos.ui.infra` — `mount`, `api`, `chat-session`, `ledger-stream`

The ledger and protocol contracts come from the sibling
`@promethean-os/event-ledger` and `@promethean-os/openplanner-protocols`
packages; the chat UI components come from `@open-hax/chat-ui` (all wired via
shadow-cljs source paths).
