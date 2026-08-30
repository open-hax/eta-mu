# Rheos configuration

Rheos prefers EDN configuration. JSON remains readable for migration but is
deprecated.

## Discovery

When `--config` and `KANBAN_CONFIG` are absent, Rheos searches the working
directory and its parents, including `kanban/` and `.kanban/`, in this order:

1. `openhax.kanban.edn`
2. `kanban.edn`
3. `openhax.kanban.json` — deprecated
4. `kanban.json` — deprecated

An explicit config path is parsed according to its `.edn` or `.json` extension.
Loading JSON emits a deprecation warning.

The eta-mu repository currently retains `openhax.kanban.json` as a deprecated
compatibility mirror because `packages/legacy/kanban` still discovers that exact
filename. Rheos selects `openhax.kanban.edn` first; the mirror may be removed only
after the legacy consumer is migrated or retired.

## EDN shape

Single-project example:

```clojure
{:tasks-dir "./docs/kanban"
 :fsm :promethean
 :card-dirs
 {:epic "epics"
  :story "stories"
  :chore "chores"}
 :card-projection
 {:paths ["epics" "stories" "chores"]}
 :meta
 {:domain :music
  :org :octave-commons}}
```

Multi-project example:

```clojure
{:default-project "fork-tales"
 :fsm :promethean
 :projects
 [{:id "fork-tales"
   :title "Fork Tales"
   :tasks-dir "../fork_tales_v2/docs/kanban"
   :card-dirs {:epic "epics" :story "stories" :chore "chores"}
   :card-projection {:paths ["epics" "stories" "chores"]}}
  {:id "epiphany"
   :title "Epiphany"
   :tasks-dir "../epiphany/docs/kanban"
   :fsm {:extends :promethean
         :build-gate-commands ["clojure -M:unit-test"]
         :cwd "../epiphany"}}]}
```

Filesystem paths in config are resolved relative to the config file. Card
projection paths are resolved relative to their project's task root and may not
escape it.

When `:card-dirs` is non-empty, its keys are the project's closed creation
vocabulary as well as its placement map. For example, the configuration above
accepts `--type story` and refuses undeclared `--type task`. A project whose
vocabulary does not contain `:task` must pass `--type` explicitly. Boards that
omit `:card-dirs` retain the legacy `task`/`epic` vocabulary.

## Card projection discovery

Without `:card-projection`, Rheos preserves legacy behavior and recursively treats
every Markdown file below `:tasks-dir` as a card candidate.

With `:card-projection {:paths [...]}`, Rheos scans only the named directories or
Markdown files. This allows board guides and design notes to remain easy to find
under the same board root without becoming phantom tasks.

```text
docs/kanban/
├── AGENTS.md          # prose, not scanned
├── README.md          # prose, not scanned
├── BOARD-DESIGN.md    # prose, not scanned
├── epics/             # projected cards
├── stories/           # projected cards
└── chores/            # projected cards
```

```clojure
{:tasks-dir "docs/kanban"
 :card-projection {:paths ["epics" "stories" "chores"]}}
```

This configuration names a materialized projection. It does not make Markdown the
canonical board store. The ledger-authority and branch-worldline migration is
specified separately in
`docs/notes/design/rheos-ledger-authority-and-branch-projections.md`.

## JSON compatibility

Legacy camelCase JSON is normalized to the same kebab-case internal shape:

```json
{
  "tasksDir": "./docs/kanban",
  "cardDirs": {
    "epic": "epics",
    "story": "stories",
    "chore": "chores"
  },
  "cardProjection": {
    "paths": ["epics", "stories", "chores"]
  },
  "fsm": {
    "extends": "promethean",
    "buildGateCommands": ["clojure -M:test"]
  }
}
```

New configuration should use EDN. JSON support is a compatibility path, not the
design target for future projection, ledger, or workflow features.
