# Rheos Ledger Authority and Branch-Worldline Projections

Status: proposed  
Date: 2026-07-28  
Scope: Rheos board authority, Git correlation, EDN configuration, and derived card projections

## Signal

Rheos should converge on this authority order:

1. Git commit ancestry is the durable worldline/audit spine.
2. Accepted board events are canonical facts attributed to a Git/worldline context.
3. A branch board is a fold of events visible from the checked-out Git timeline,
   plus explicitly local pending events for the current worktree/worldline.
4. EDN snapshots are rebuild accelerators, not independent truth.
5. Markdown cards and board files are discoverable, editable projections.
6. The web UI, CLI output, and composed boards are further projections.

A tracked mutable `.events/ledger.edn` inside the ordinary worktree cannot satisfy
this model by itself: switching branches changes the checked-out ledger file,
creates merge noise, and does not distinguish committed history from local pending
intent.

## Prior decisions being continued

The existing worlds/projections design established that Git is the immutable audit
spine, active ledgers are rebuildable views, causal parents are explicit, and
conflicts create alternate worldlines rather than silently merging facts.

The earlier FSM reconciliation design established that accepted state is a ledger
fold, frontmatter is a writable projection/interface, provenance identifies
self-writes, and configuration should be EDN data.

Promethean's historical kanban defined directional projection operations:

- `push`: board projection to task-file projection;
- `pull`: task-file projection to board projection;
- `sync`: bidirectional reconciliation with conflict reporting.

Rheos should preserve the directional vocabulary while changing the canonical
center from either file projection to the ledger/worldline fold.

## Current implementation drift

Rheos currently records status/frontmatter/comment/file events in an EDN ledger,
but:

- task reads begin by recursively parsing Markdown files;
- task creation writes Markdown without a complete canonical creation event;
- status changes write Markdown and then record a mutation event;
- the event vocabulary does not contain enough state to reconstruct all cards;
- events lack Git commit, ref, worktree, worldline, and causal-parent attribution;
- the watcher treats every Markdown edit as potential drift;
- the ledger file lives below the projected card root and is affected by branch
  checkout.

Therefore the current ledger is a mutation audit, not yet the complete source from
which the card corpus can be rebuilt.

## Canonical task event model

A reconstructable event stream needs complete lifecycle facts, not only diffs.
The first canonical vocabulary should include:

```clojure
{:event/type :kanban.task/created
 :event/id #uuid "..."
 :event/time #inst "..."
 :board/id "eta-mu"
 :task/id "rheos-edn-config-and-card-selection"
 :task/snapshot {:title "..."
                 :status :incoming
                 :priority :P0
                 :labels #{:rheos :edn}
                 :body "..."
                 :relationships {...}}
 :causal/parents [#uuid "..."]
 :actor/id "..."
 :git/context {:base-commit "<HEAD when authored>"
               :ref "refs/heads/feature/rheos-edn-config"
               :worktree/id "..."
               :worldline/id "..."
               :attribution :pending}}
```

Subsequent events should express accepted commands/results, for example:

```clojure
:kanban.task/frontmatter-set
:kanban.task/body-replaced
:kanban.task/comment-appended
:kanban.workflow/transition-requested
:kanban.workflow/transition-accepted
:kanban.workflow/transition-rejected
:kanban.task/archived
:kanban.task/deleted
:kanban.git/commit-attributed
:kanban.projection/conflict-detected
```

Every event must carry stable identity, actor, causal parents, board identity, and
Git/worldline context. Events that change accepted task state must carry enough
information for deterministic folding.

## Git attribution and branch visibility

### Pending events

When an event is authored before a Git commit exists, record:

- the current `HEAD` as `:base-commit`;
- the symbolic ref when available;
- a stable worktree ID;
- a worldline ID;
- `:attribution :pending`.

A pending event is visible only to that worktree/worldline. It must not leak into
another branch merely because both worktrees share a repository-local state store.

### Commit attribution

When Git commits the work represented by one or more events, append a
`:kanban.git/commit-attributed` event mapping event IDs to the resulting commit.
Attribution does not rewrite prior event rows.

After attribution, an event is visible on a checked-out branch when its attributed
commit is reachable from that branch's `HEAD`.

### Branch projection

The current board projection is:

```text
fold(committed events whose commit is an ancestor of HEAD)
+
fold(pending events owned by the active worktree/worldline)
```

Changing branches therefore changes the visible fold without checking out or
merging a mutable canonical ledger file.

### Merge and divergence

A Git merge makes both ancestor histories visible. If their accepted task events
compose without conflict, the fold proceeds. If they assert incompatible facts
without a causal ordering, Rheos emits an explicit projection conflict and
requires adjudication. It does not silently choose last wall-clock write.

## Snapshots

A snapshot is an EDN checkpoint containing:

```clojure
{:snapshot/version 1
 :board/id "eta-mu"
 :worldline/id "..."
 :git/head "..."
 :fold/through-event #uuid "..."
 :fold/event-count 123
 :tasks/by-id {...}
 :projection/hash "sha256:..."}
```

A snapshot is valid only when its Git/worldline coordinates match the requested
projection and its hash verifies. Replay applies later visible events. Deleting a
snapshot must not lose accepted state.

## Markdown card projection

Markdown cards remain valuable because they are easy to discover, search, diff,
open in editors, and hand to agents. They are not the final authority.

Projection config names where cards are materialized:

```clojure
{:tasks-dir "kanban"
 :card-projection
 {:paths ["epics" "tasks" "chores"]
  :format :markdown-yaml-frontmatter
  :mode :materialized}}
```

Guides such as `README.md`, `AGENTS.md`, and design notes may remain beside those
paths without becoming tasks.

Every projected card should carry projection metadata sufficient for reconciliation:

```yaml
projection-event: "<last folded event id>"
projection-hash: "sha256:..."
projection-worldline: "..."
projection-head: "<git commit>"
```

These fields are projection checkpoints, not independent truth.

## Pull, push, and sync

The ledger/worldline fold is the canonical source in all three operations.

### `pull`

Materialize the selected branch/worldline fold into Markdown cards and other board
views. Files absent from the fold are removed or archived according to projection
policy. Unrelated prose is untouched.

### `push`

Parse edits in a materialized card projection, compare them with its recorded
projection checkpoint, validate the proposed change, append canonical events, and
then re-pull the accepted fold. A direct file edit is a change proposal, not an
unexplained drift anomaly.

### `sync`

Perform a three-way reconciliation among:

1. the last projection checkpoint;
2. the currently edited projection;
3. the current branch/worldline ledger fold.

Non-overlapping changes become events. Conflicting changes produce explicit
conflict data and preserve both claims until adjudicated.

## Configuration migration

EDN becomes preferred:

```clojure
{:tasks-dir "kanban"
 :fsm :promethean
 :card-projection {:paths ["epics" "tasks" "chores"]}
 :meta {:chat {:backend :sol
               :model "gemma4:31b"}}}
```

Discovery order:

1. `openhax.kanban.edn`
2. `kanban.edn`
3. deprecated `openhax.kanban.json`
4. deprecated `kanban.json`

JSON remains readable during migration and maps to the same normalized internal
shape. New features need not be designed twice around JSON conventions.

## Physical storage decision still open

The authoritative active event store must not be an ordinary branch-tracked mutable
file. Viable implementation candidates include:

- repository-local state under `.git/eta-mu/` plus durable event segments committed
  to dedicated Git refs;
- an external eta-mu state directory keyed by repository identity, with content-
  addressed event segments persisted into Git refs;
- Git notes or another Git-native object/ref layout.

The storage ADR must test worktrees, branch switches, rebases, merges, clones,
garbage collection, backup, and remote synchronization before selecting one.

### Candidate review (2026-07-28)

The ADR remains the accepting authority. This review only selects which candidate
receives the local worktree/branch-switch spike.

**Selected for the spike: repository-local state under the Git directory plus
dedicated refs.**

Git already supplies the two-tier scoping this design needs, without inventing an
identity scheme:

- `git rev-parse --git-common-dir` is shared by every worktree of a repository. It
  is the natural home for committed event segments and for repository identity.
- `git rev-parse --git-dir` resolves per worktree — a linked worktree gets its own
  `.git/worktrees/<name>/` with its own `HEAD`, `index`, and `logs`. It is the
  natural home for pending events. Worktree isolation then holds structurally
  rather than by an ID field an implementation must remember to filter on, and
  `git worktree remove` reclaims pending state as a side effect.

Nothing under the Git directory is rewritten by `git checkout`, so the primary
acceptance criterion — the active store is not rewritten merely by switching
branches — holds by construction rather than by convention. Durable segments live
under `refs/eta-mu/events/*`; because those are real refs, their objects survive
`git gc`, and clone reconstruction is an explicit fetch refspec. This repository
already carries precedent for tool state inside the Git directory.

Known costs: a fetch/push refspec convention must be documented and configured, and
state under the Git directory is invisible to ordinary code review.

**Rejected as the active store: an external state directory keyed by repository
identity.** Git exposes no stable repository UUID. Identity would have to be
synthesized from something like the root-commit SHA plus a remote URL, which is
ambiguous under fork, remote rename, and two clones of the same repository on one
machine — precisely the ambiguity the worldline model exists to remove. It also
splits backup across two locations and leaves a fresh clone with no state. Revisit
only if the spike disqualifies the Git-directory layout.

**Rejected as the active store, retained as an optional attribution index: Git
notes.** Notes attach to commits, so pending events — which by definition have no
commit yet — cannot be represented at all; notes therefore force a hybrid in which
both mechanisms must be owned. Notes are also weakest at the operations this ADR
must test: `refs/notes/*` is neither fetched nor pushed by default, and rebase
drops notes unless `notes.rewriteRef` is configured. Post-hoc commit attribution is
the one thing notes do well, and that is a thin optional layer over the selected
layout.

**Spike seam.** `rheos.backend.infra.ledger/get-ledger` is the whole storage seam
today: it joins `<board-dir>/.events` and constructs an EDN event admission. The
spike redirects that path to a Git-directory-derived location and then exercises
branch switch, second worktree, rebase, merge, detached `HEAD`, and clone.

## Delivery passes

### Pass 1 — EDN config and projection discovery

- EDN-first config discovery and parsing;
- deprecated JSON compatibility;
- normalized config shape;
- explicit card projection paths;
- legacy recursive Markdown discovery when projection config is absent.

### Pass 2 — Canonical fold and branch attribution

- complete task lifecycle events;
- pure deterministic task fold;
- pending worktree/worldline events;
- commit attribution;
- branch ancestry filtering;
- EDN snapshots/checkpoints.

### Pass 3 — Projection reconciliation

- deterministic Markdown materialization;
- `pull`, `push`, and `sync` commands;
- three-way conflict detection;
- watcher reframed as projection-input detection;
- migration/bootstrap from existing cards.

## Runtime direction

This design is data-first and must not depend on the current host forever. The
current CLJS implementation can deliver compatibility and validate the contracts.
Pure laws, folds, config normalization, and projection transforms should remain
portable to nbb, bb, or JVM Clojure. Host-specific file watching, Git processes,
and UI/server adapters stay at infra boundaries.
