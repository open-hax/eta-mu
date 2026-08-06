# The `rheos` CLI

Agent-first kanban board CLI. Every verb here writes through the same enforced
paths the HTTP API, MCP tools, and web UI use, so no two surfaces can disagree
about what happened to a card.

- [Install](#install)
- [Agent quickstart](#agent-quickstart)
- [Pointing it at a board](#pointing-it-at-a-board)
- [Exit codes](#exit-codes)
- [Verb reference](#verb-reference)
- [Card bodies settle after breakdown](#card-bodies-settle-after-breakdown)
- [Which surface owns what](#which-surface-owns-what)

## Install

**From npm — the normal path.** Needs Node 22.

```bash
npm i -g @eta-mu/rheos
rheos --help
```

**From the workspace**, if you already have a checkout with Java 21 and pnpm:

```bash
pnpm -C packages/rheos build      # -> dist/cli.cjs
node packages/rheos/dist/cli.cjs --help
```

> **Do not copy `dist/cli.cjs` on its own.** It is a shadow-cljs `:node-script`
> bundle that `require`s `chokidar`, `fastify`, `@fastify/cors`,
> `@fastify/static`, and `@modelcontextprotocol/sdk` at load time. Outside a tree
> that can resolve those, it fails with `Cannot find module 'chokidar'`. Install
> the package instead of moving the file.

A single-download archive for sandboxes with no registry access is carded as
`rheos-cli-agent-release-archive` and is not built yet. Until it lands, npm is
the install path.

## Agent quickstart

The whole lifecycle of a card, in the order you will need it. This runs against
any board — point it somewhere scratch first if you are learning.

```bash
# 0. What boards exist, and what is on them?
rheos projects
rheos read-board --project kanban --status in_progress,review

# 1. Create the card. Root cards need no parent; epics go in epics/.
rheos create --type epic --title "Ledger cutover" --priority P0
rheos create --title "Extract the fold" --parent ledger-cutover --points 3

# ...or author the body yourself instead of taking the skeleton:
rheos create --title "Extract the fold" --parent ledger-cutover --body-file card.md
cat card.md | rheos create --title "Extract the fold" --body-file -

# 2. Scope it, then size it, while it is still in breakdown.
rheos move extract-the-fold --to accepted
rheos move extract-the-fold --to breakdown
rheos frontmatter extract-the-fold --set points=3 --set priority=P1

# 3. Advance it. `move` is the only way to change status.
rheos move extract-the-fold --to ready
rheos move extract-the-fold --to todo
rheos move extract-the-fold --to in_progress

# 4. From here on, updates are comments — not body edits.
rheos comment extract-the-fold --text "Fold extracted; 12 new assertions green"

# 5. Read the card, or its history.
rheos read-task extract-the-fold
rheos events extract-the-fold
```

Three things worth internalising:

- **A new card enters at the FSM's initial state.** You cannot create a card
  directly into `in_progress`; create it, then `move` it. `--force-status`
  exists for the deliberate exception.
- **The card's uuid defaults to its title slug** (`"Extract the fold"` →
  `extract-the-fold`), because you address cards by uuid on every later call.
  Pass `--uuid` to choose one; a collision appends a short random suffix.
- **Failures exit non-zero.** Branch on the exit code, not on stdout.

## Pointing it at a board

Config resolution, in order:

1. `--config <path>`
2. `$KANBAN_CONFIG`
3. discovered by walking up from the working directory, checking `.`, `kanban/`,
   and `.kanban/` in each ancestor for: `openhax.kanban.edn`, `kanban.edn`,
   `openhax.kanban.json`, `kanban.json`

**EDN is the preferred format.** A JSON config still loads but logs a
deprecation warning.

```clojure
{:tasks-dir "./kanban"
 :fsm :promethean}
```

Multi-project boards use a `:projects` vector, each entry with its own
`:tasks-dir` and optional `:id`, `:title`, `:fsm`, `:card-projection`:

```clojure
{:default-project "kanban"
 :projects [{:id "kanban" :title "eta-mu" :tasks-dir "./kanban" :fsm :promethean}
            {:id "proxx"  :tasks-dir "../proxx/kanban"}]}
```

`--tasks-dir` overrides the resolved task root for single-project boards.

New cards are placed by type: `<tasks-dir>/epics/` for `--type epic` and
`<tasks-dir>/tasks/` for `--type task` when those directories exist, else the
task root itself. Override per-call with `--dir`. When a project configures
`:card-projection {:paths [...]}`, a create that would land outside those paths
is refused rather than writing a card the board will never scan.

## Exit codes

| Code | Meaning | Example |
|---|---|---|
| `0` | success | |
| `1` | usage — unknown verb, missing flag, malformed argument | `rheos create` with no `--title` |
| `2` | not found — unknown project, card, or preset | `rheos read-task no-such-card` |
| `3` | refused by policy — FSM rejection, WIP limit, build gate, duplicate uuid | `rheos move c --to done` from `todo` |
| `4` | internal error | |

Diagnostics go to **stderr** as a single `rheos: <message>` line. Stack traces
appear only with `RHEOS_DEBUG=1`. Verbs that emit JSON put it on **stdout**
alone, so `rheos read-board | jq .` is always safe.

## Verb reference

Run `rheos help <verb>` for flags and a worked example. Verbs marked ✎ mutate a
card and record a ledger event.

### Lifecycle

| Verb | Purpose |
|---|---|
| ✎ `create --title <t>` | Create a card (epic or task, root or child); records `task-created` |
| ✎ `create-subtask <parent> --title <t>` | Alias of `create --parent`; kept for compatibility |
| ✎ `move <uuid> --to <status>` | Change status. FSM-enforced, ledger-recorded, streamed to the UI |
| ✎ `status-update <uuid> --to <status>` | The same enforced move via agent-tool dispatch; prints JSON |
| ✎ `comment <uuid> --text <t>` | Append a comment — the way to update a card after breakdown |
| ✎ `add-comment <uuid> --text <t>` | Alias of `comment` |
| ✎ `frontmatter <uuid> --set k=v` | Update descriptive frontmatter; `--set` repeats |

`frontmatter` writes only the closed mutable set: `title`, `priority`, `labels`,
`points`, `category`, `description`, `estimate`, `assignee`. `status` is refused
and redirected to `move`, so the FSM stays the only status authority. Identity
and provenance keys (`uuid`, `created_at`, `write-id`, `source-path`) are never
writable.

There is no delete verb. Terminal states are reached with
`move <uuid> --to rejected` or `--to archived`.

### Read

| Verb | Purpose |
|---|---|
| `read-task <uuid>` | One card's frontmatter, body, and comments as JSON |
| `read-board` | Composed board — columns, counts, cards, WIP limits — as JSON |
| `search-tasks --query <t>` | Compact JSON rows matching a title substring |
| `compose` | Composed view with the full query DSL; human-readable by default |
| `board snapshot` \| `board list` | Board JSON snapshot; configured project list |
| `projects` | Project ids, titles, default flag, meta as JSON |
| `events [uuid]` | Ledger events, newest last |
| `drift` | Cards whose files changed outside a recorded Rheos write |

`read-board` with no `--project` composes **every** configured project. Scope it.

The `compose` query DSL is shared verbatim with the HTTP `/api/board/compose`
endpoint and the `kanban_read_board` MCP tool: `--status`, `--priority`,
`--labels`, `--projects`, `--q`, `--domain`, `--org`, `--tier`, and `--where`
(e.g. `--where "points in 1,2 and meta.tier = core"`). Save a set of flags with
`--save <name>` and replay it with `--preset <name>`.

### Service

| Verb | Purpose |
|---|---|
| `serve` | HTTP server: board UI, REST API, SSE event stream, MCP endpoint |

## Card bodies settle after breakdown

A card body is mutable while it is being scoped. Once a card leaves `breakdown`
the body is the agreed contract, and later information belongs in the comment
log:

```bash
rheos comment my-card --text "Reviewer wants the fold split; scope unchanged"
```

Rewriting the body of a card that is already in flight silently replaces scope
that other people and agents are working from, with no record of what changed.
Comments are append-only and ledger-recorded, so they are the honest place for
anything discovered after planning. If scope genuinely has to change, move the
card back to `breakdown` — the FSM allows `ready`, `blocked`, and `in_progress`
to return there — re-author the body, and move it forward again.

Mechanical enforcement of this rule is carded as
`rheos-card-body-lock-after-breakdown`. Today it is a convention the CLI
documents and the FSM makes cheap to follow.

## Which surface owns what

All four surfaces share the same domain chokepoints, so pick whichever fits your
harness.

| Operation | CLI | HTTP | MCP | UI |
|---|---|---|---|---|
| create a card | `create` | — | `kanban_create_task` | — |
| change status | `move` | `POST /api/task/:uuid/status` | `kanban_update_status` | drag-drop |
| comment | `comment` | `POST /api/task/:uuid/comment` | `kanban_add_comment` | sidebar |
| frontmatter | `frontmatter` | `PATCH /api/task/:uuid/frontmatter` | `kanban_update_frontmatter` | sidebar |
| read board | `read-board` | `GET /api/board`, `/api/board/compose` | `kanban_read_board` | board |
| read card | `read-task` | `GET /api/task/:uuid/content` | `kanban_read_task` | sidebar |
| projects | `projects` | `GET /api/projects` | `kanban_list_projects` | switcher |
| history | `events` | `GET /api/events`, `/api/events/stream` | — | live stream |
| drift | `drift` | `GET /api/drift` | — | — |

Status moves always go through `transition/move-task!`; frontmatter and comments
through `task-edit`; creation through `task-create`. Every one of them appends to
the project ledger at `<tasks-dir>/.events/ledger.edn` and publishes to the SSE
stream, which is why a CLI mutation shows up live in an open board UI.
