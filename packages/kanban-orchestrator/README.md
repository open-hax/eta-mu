# @open-hax/kanban-orchestrator

Kanban board orchestrator agent, expressed as **contract data only**.

This package contains no source code and no build step. It is a set of EDN
contracts that teach a knoxx-style agent runtime (e.g. `@open-hax/sol`) about an
agent whose entire purpose is to drive work by **changing board state** — never
by editing code. Point the runtime at this directory as an extra contract root
and the orchestrator agent, its role, capability, actor, and the backing MCP
server connection are all loaded from data.

## Public surface

The contracts under `contracts/` (consumed by the runtime's contract loader):

| File | `:contract/kind` | Purpose |
|------|------------------|---------|
| `contracts/agents/kanban_orchestrator.edn` | `:agent` | The agent itself — model (`gemma4:31b`), `:role/kanban-orchestrator`, system prompt, context window (40 msgs / 80k chars), and the actors allowed to invoke it (`chat_primary`, `knoxx_default`, `kanban_orchestrator`). |
| `contracts/roles/kanban_orchestrator.edn` | role | `:role/kanban-orchestrator` → grants `:cap/kanban-orchestrator`, the permissions (`agent.chat.use`, `agent.memory.read`, `agent.runs.read_own`), and the role-level system prompt. |
| `contracts/capabilities/cap_kanban_orchestrator.edn` | capability | `:cap/kanban-orchestrator` — the complete toolset (see below) and the `:workspace/kanban` user surface (route `/kanban`). |
| `contracts/actors/kanban_orchestrator.edn` | actor | `kanban_orchestrator` actor (`:actor/kind :agent`, org `open-hax`), defaulting to the `kanban_orchestrator` agent. |
| `contracts/mcp_servers/rheos_kanban.edn` | `:mcp-server` | The `rheos-kanban` MCP server connection: HTTP transport at `http://127.0.0.1:8792/mcp`. |

### Toolset

The capability binds the orchestrator to exactly seven tools, all served by the
`rheos-kanban` MCP server — read-only project inspection plus board reads and the
single board-mutation tool:

- `project_glob`, `project_grep`, `project_read` — ground the agent in the project
- `kanban_read_board`, `kanban_search_tasks`, `kanban_read_task` — read the board
- `kanban_update_status` — the agent's **only** write surface

There is deliberately no write/edit/bash tool. The board is the world the agent
acts on; transitioning a card is how downstream agents get triggered to do the
actual work, and every move is FSM-enforced.

## Runtime loader contract

This package ships no `package.json` scripts and nothing to compile — there is
nothing to build or test here. It is loaded, not built:

1. A knoxx-style runtime (`@open-hax/sol`) is given this directory as an
   additional **contract root**; its contract loader reads the EDN files above.
2. The `rheos-kanban` MCP server connection is wired **generically** by
   `@open-hax/mcp-contracts` — that loader teaches the runtime to accept
   `:mcp-server` contracts without knowing anything specific about this server.
3. The `rheos-kanban` server itself is provided by `@open-hax/rheos`, which ships
   an MCP-backed kanban server; this package only references it by URL/id.

To exercise the orchestrator, run the host runtime (see `@open-hax/sol`) with
this package's directory included among its contract roots, and ensure the
`rheos-kanban` MCP server is reachable at the configured URL.

## License

GPL-3.0-or-later
