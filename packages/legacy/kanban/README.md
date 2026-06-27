# @open-hax/kanban-legacy

> **DEPRECATED — legacy TypeScript.** This package lives under `packages/legacy/`
> and is being replaced by ClojureScript. Kanban orchestration is moving to the
> active CLJS packages (`packages/Rheos`, which ships the MCP-backed kanban
> server, and the `eta-mu kanban` CLI). Do not add new TypeScript here; use this
> package only for the existing `openhax-kanban` bin and Trello/GitHub sync until
> the CLJS replacement lands.

Standalone markdown kanban tooling (board snapshots, a local React web UI, and
Trello/GitHub sync) with sync keyed by task UUID rather than title.

- Package: `@open-hax/kanban-legacy`
- Location: `packages/legacy/kanban`
- Bin: `openhax-kanban` (`dist/cli.js`)
- License: GPL-3.0-only

## Build and test

Commands use pnpm workspace filters against the real package name:

```bash
pnpm --filter @open-hax/kanban-legacy build      # tsc + vite build
pnpm --filter @open-hax/kanban-legacy test        # vitest run
pnpm --filter @open-hax/kanban-legacy test:e2e    # playwright
pnpm --filter @open-hax/kanban-legacy exec openhax-kanban --help
```

## CLI

The `openhax-kanban` bin exposes four commands:

```bash
openhax-kanban board snapshot [--tasks-dir <path>] [--out <path>] [--config <path>]
openhax-kanban sync trello   [--tasks-dir <path>] [--board-url <url>] [--dry-run] [--config <path>]
openhax-kanban sync github   [--tasks-dir <path>] [--repo <owner/repo>] [--dry-run] [--config <path>]
openhax-kanban serve         [--tasks-dir <path>] [--host <host>] [--port <port>] [--config <path>]
```

`--tasks-dir` defaults to `docs/agile/tasks` (or the config value). Run
`openhax-kanban --help` for the full flag list (rate-limit throttling, label
management, archive-missing, etc.).

## Local web UI

```bash
pnpm --filter @open-hax/kanban-legacy build
pnpm --filter @open-hax/kanban-legacy exec openhax-kanban serve --tasks-dir ./tasks --port 8787
# open http://127.0.0.1:8787
```

Drag cards between columns to update their `status:` frontmatter. When tasks are
stored in a `tasks/<status>/` folder tree, files are moved to the matching
status folder when safe.

### Multi-project web UI

`serve` also accepts a config with a `projects` array; the React UI renders a
project selector and API routes accept `?project=<id>`:

```json
{
  "defaultProject": "knoxx",
  "projects": [
    {
      "id": "knoxx",
      "title": "Knoxx",
      "tasksDir": "../../orgs/open-hax/openplanner/packages/agents/knoxx/kanban"
    }
  ]
}
```

## Trello sync

1. Copy `packages/legacy/kanban/.env.example` values into your environment
   (`TRELLO_API_KEY`, `TRELLO_API_TOKEN`).
2. Build the package.
3. Run a dry-run sync first.

```bash
pnpm --filter @open-hax/kanban-legacy build
pnpm --filter @open-hax/kanban-legacy exec openhax-kanban sync trello \
  --config packages/legacy/kanban/examples/ussyverse.promethean.kanban.json \
  --dry-run
```

The bundled example (`examples/ussyverse.promethean.kanban.json`) targets the
Trello board `https://trello.com/b/Mu2BmeDE/ussyverse` and reads tasks from a
relative `promethean/docs/agile/tasks` path. Adjust the paths in the config to
match your checkout before running.

## GitHub sync

```bash
pnpm --filter @open-hax/kanban-legacy exec openhax-kanban sync github \
  --tasks-dir kanban --repo <owner/repo> --dry-run
```

Use `--write-delay-ms` and `--max-writes` to throttle writes and avoid GitHub
secondary rate limits.

## Config

Create `openhax.kanban.json` or pass `--config <path>`:

```json
{
  "tasksDir": "docs/agile/tasks",
  "boardFile": ".kanban/board.json",
  "trello": {
    "boardUrl": "https://trello.com/b/Mu2BmeDE/ussyverse",
    "archiveMissing": false,
    "listMapping": {
      "in_progress": "Doing"
    }
  }
}
```

## Notes

- Task files are regular markdown files with YAML frontmatter.
- Supported task metadata includes `uuid`, `title`, `status`, `priority`,
  `labels`, and `tags`.
- Trello authentication uses classic `TRELLO_API_KEY` and `TRELLO_API_TOKEN`.
