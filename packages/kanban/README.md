# @openhax/kanban

Standalone markdown kanban tooling with a direct Trello sync path.

## What This Replaces

- No dependency on `@promethean-os/kanban`
- No shelling out to `pnpm kanban`
- No hardcoded Trello board id
- Card sync keyed by task UUID instead of title

## Commands

```bash
pnpm --filter @openhax/kanban build
pnpm --filter @openhax/kanban test
pnpm --filter @openhax/kanban exec node dist/cli.js --help
```

## Local web UI

```bash
pnpm --filter @openhax/kanban build
pnpm --filter @openhax/kanban exec node dist/cli.js serve --tasks-dir ./tasks --port 8787
# open http://127.0.0.1:8787
```

Drag cards between columns to update their `status:` frontmatter (and, when using a `tasks/<status>/` folder tree, files will be moved to the matching status folder when safe).

## Trello Setup

1. Copy `packages/kanban/.env.example` values into your environment.
2. Build the package.
3. Run a dry-run sync first.

```bash
pnpm --filter @openhax/kanban build
pnpm --filter @openhax/kanban exec node dist/cli.js sync trello \
  --config packages/kanban/examples/ussyverse.promethean.kanban.json \
  --dry-run
```

The bundled example targets `https://trello.com/b/Mu2BmeDE/ussyverse` and reads tasks from `orgs/riatzukiza/promethean/docs/agile/tasks`.

## Config

Create `openhax.kanban.json` or pass `--config <path>`.

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

## CLI

```bash
pnpm --filter @openhax/kanban snapshot -- --tasks-dir docs/agile/tasks --out .kanban/board.json
pnpm --filter @openhax/kanban sync:trello -- --board-url https://trello.com/b/Mu2BmeDE/ussyverse --tasks-dir docs/agile/tasks
```

## Notes

- Task files are regular markdown files with YAML frontmatter.
- Supported task metadata includes `uuid`, `title`, `status`, `priority`, `labels`, and `tags`.
- Trello authentication uses classic `TRELLO_API_KEY` and `TRELLO_API_TOKEN`.
