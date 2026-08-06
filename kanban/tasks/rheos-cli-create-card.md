---
category: "tasks"
labels: "rheos, cli, lifecycle, create, ledger"
parent: "rheos-cli-card-lifecycle-authority"
type: "task"
write-id: "1786029510631-0.coxh0f4j29080uojvg"
points: "5"
title: "Rheos CLI card creation with a ledger-visible task-created event"
priority: "P0"
status: "done"
uuid: "rheos-cli-create-card"
created_at: "2026-07-30T00:00:00Z"
---

# Rheos CLI card creation with a ledger-visible task-created event

## Outcome

`rheos` can create any card — epic or task, root or child — and that creation is
a first-class ledger fact, so the board can be rebuilt from events without the
markdown file being the only record of a card's existence.

## Current state

- The only creation verb is `create-subtask <parent-uuid> --title <t>`. A root
  card is impossible.
- `tool-kanban-create-subtask`
  (`packages/rheos/src/rheos/backend/infra/agent_tools.cljs:198`) writes the file
  and calls `watcher/register-cli-event!`, but emits **no** ledger event.
  `packages/rheos/src/rheos/backend/domain/events.cljs` has no
  `emit-task-created!` — only status, frontmatter, comment, file-changed, and
  drift emitters exist.
- Status defaults to a hardcoded `"incoming"` rather than the resolved FSM's
  `:initial-state`.
- The new card is written with `:sections []`, so it has frontmatter and an empty
  body — which cannot pass a markdown-score style gate.
- The file lands in `(path/dirname parent-source-path)`, which has no meaning
  for a root card.

## Scope

- Add `rheos create --title <t>` with optional `--type` (`task` | `epic`),
  `--parent`, `--project`, `--status`, `--priority`, `--points`, `--labels`,
  `--uuid`, and `--body-file <path>` / `--body -` (stdin).
- Add `emit-task-created!` to `events.cljs` carrying uuid, project, type, title,
  initial status, parent, source path, write-id, and source; emit it from the
  single creation chokepoint.
- Extract one creation function in `domain/` (alongside `task-edit`) that both
  `create` and `create-subtask` call, so there is one write path. Keep
  `create-subtask` as a thin alias for `create --parent`.
- Resolve initial status from `(fsm/resolve-fsm project)`'s `:initial-state`;
  reject an explicit `--status` that is not the initial state unless
  `--force-status` is passed.
- Resolve the target directory from project config by `type` (`epic` → epics
  dir, `task` → tasks dir), not from the parent's dirname.
- Seed the body from a template so a created card is never empty: `## Outcome`,
  `## Scope`, `## Acceptance criteria`. `--body-file`/stdin overrides.
- Keep the `kanban_create_subtask` MCP tool working and add `kanban_create_task`
  with the same argument surface.
- Reject a `--uuid` that already exists, and keep the existing slug-collision
  fallback for file names.

## Non-goals

- Interactive prompting.
- Deciding the projection/replay format — that is
  [[rheos-markdown-projection-push-pull-sync]] and
  [[rheos-canonical-task-fold-and-snapshots]]. This card only guarantees the
  event is emitted with enough payload for those folds to use.
- Bulk import.

## Acceptance criteria

- `rheos create --type epic --title "X"` writes a card to the epics dir with the
  FSM initial status and a non-empty templated body, and prints its uuid.
- `rheos create --title "Y" --parent <uuid>` is behaviourally identical to
  `create-subtask <uuid> --title "Y"`.
- `rheos events <new-uuid>` shows a `task-created` event immediately after
  creation.
- Folding the ledger from empty reproduces the created card's uuid, type,
  parent, initial status, and body.
- Creating with a duplicate `--uuid` exits non-zero and writes no file.
- `rheos create` with no `--title` exits non-zero with a usage line.
- New tests in `packages/rheos/test/rheos/` cover creation, the emitted event,
  initial-state resolution, and the duplicate-uuid rejection.
- `pnpm -C packages/rheos test` and `lint:kondo` pass with zero warnings.

## Dependency note

`rheos create` is the bootstrap for this whole epic: the epic and its five
children were hand-authored as markdown precisely because this verb does not
exist yet.

---
Implemented. New domain/task_create.cljs is the single creation chokepoint; events.cljs gains emit-task-created! carrying uuid, title, card-type, status, parent, source-path, and the authored body. CLI verb: rheos create --title/--type/--parent/--priority/--points/--labels/--body-file/--dir/--uuid/--status/--force-status; --body-file - reads stdin. create-subtask and kanban_create_subtask are now thin aliases; kanban_create_task added to the MCP registry. Initial status comes from the resolved FSM :initial-state (refused otherwise unless --force-status). uuid defaults to the title slug rather than a v4 so cards stay addressable; collision appends a short suffix. Placement: epics/ or tasks/ by type when present, --dir override, refused if it escapes the task root or falls outside a configured :card-projection. Empty bodies replaced with an Outcome/Scope/Acceptance skeleton. 14 tests in test/rheos/backend/domain/task_create_test.cljs. Verified end to end on a scratch board: create epic + child, ledger shows task-created, full incoming->in_progress walk. NOT done from this card's scope: ledger-replay reconstruction of a card from the event (the event now carries the payload for it; the fold itself belongs to rheos-canonical-task-fold-and-snapshots).

Implemented on PR #167 (`feat/rheos-card-creation`) — https://github.com/open-hax/eta-mu/pull/167

CodeRabbit found a confirmed path traversal: `--uuid` reached the card file name unvalidated, and `card-file-name` keeps the last 8 characters, so separators survived truncation and `path/join` normalized the write outside the card directory. Fixed in f838964 with `check-uuid!` (domain refusal) plus `resolve-card-path` (infra containment re-check). Suite 85 tests / 264 assertions, clj-kondo 0/0.

Merged to main as 5c5d507 (PR #167) on 2026-08-06.

Landed with two review fixes beyond the original scope:
- `check-uuid!` + `resolve-card-path` close a confirmed path traversal — `--uuid` reached the card file name unvalidated and `card-file-name` keeps the last 8 characters, so separators survived truncation.
- `update-frontmatter!` no longer rewrites a task file for an empty update, which previously stamped a write-id and woke the watcher while emitting no ledger event.

Also hardened `.github/workflows/rheos.yml` to match `axxium-ci`/`sol-ci`: pinned checkout with persist-credentials off, `--frozen-lockfile`, and clj-kondo pinned to 2025.10.23 via setup-clojure.

Final: 85 tests / 264 assertions, clj-kondo 0/0, all 8 review threads resolved.
---