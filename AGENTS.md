
## Clojure House Rules (eta-mu-sol constitution)

> **Roadmap:** [`ROADMAP.md`](ROADMAP.md) is the constellation hub — the seam,
> the ownership table, the sequencing rule, and the drift ledger. Every sibling
> repo carries a satellite `ROADMAP.md` summarising its own slice.

### Architecture Paradigm: Categories vs. Contracts
When modeling domains, you must strictly differentiate between the grammar of motion and the enforcement of that motion.
- Categories: Describe the space of lawful possible transformations. They dictate "what kind of move this is" and define the state space, transition vocabulary, and general laws of composition for the runtime or a subsystem.
- Contracts: Decide whether a particular runtime entity, event, or transition is admissible under current obligations. They dictate "whether you are allowed to count it as a valid move right now" by defining guards, admissibility checks, evidence requirements, delivery expectations, and side-effect constraints.


### Zero Warnings
`clj-kondo`, type checks, and tests must all pass with zero warnings. Warnings
are failed contracts, not noise.

### Namespace Architecture
| Layer         | Pattern            | Rule                             |
|---------------|--------------------|----------------------------------|
| `domain.*`    | Business logic     | No I/O. Pure functions only.     |
| `infra.*`     | Transport/DB/Queue | No domain policy.                |
| `shape.*`     | Data morphisms     | Pure, domain-agnostic.           |
| `law.*`       | Contracts/Malli    | No I/O. Validators only.         |

### Clojure Construction Order
Regardless of the kanban process, ClojureScript is **built in a fixed order**, because the
order *is* the dependency DAG: each layer compiles against already-defined lower layers.

```
Discovery → ( Describe → specify → define → shape → extern → domain → infra )
```

- **Discovery** — survey what already exists before constructing. Opens every cycle and
  recurs *inside* every step (see the anomaly rule below). Output: a named inventory of the
  shapes in play, including the ones that are already there.
- **Describe** — state the projection's intent in prose (a note, a kanban card body).
- **specify** — pin acceptance criteria / exit signals (the kanban "Clarify & Scope" pass).
- **define** — author the `law.*` that **describes** the shape (μ). A law is a description of
  what a valid instance is, not the data and not the transform; that is why it has no
  dependencies and comes first. (`define` and `shape` are complementary roles, not one
  artifact moved between layers — the law describes; the shape is the morphism it describes.)
- **shape** — `shape.*` pure morphisms that produce/consume the described shapes (parse,
  enrich, (de)serialize). Depends only on `law`.
- **extern** — `extern.*` raw JS / Node / browser / SDK boundaries, decoding foreign data
  into defined shapes at the edge. Nothing above `extern` touches a raw host object.
- **domain** — `domain.*` pure decisions over shaped data. Depends on `shape` + `law`.
- **infra** — `infra.*` effect orchestration composing `extern` adapters and `domain`
  decisions, returning CLJS data. Depends on everything below it.

#### The anomaly rule (a surprise at every step)
Every step is also a discovery step. You will keep finding shapes you didn't realize were
already there — in this package or a sibling.

> If the discovery does **not** invalidate the shape of your targeted projections, you
> **describe the anomaly** (location + whether it's already-there reuse or a contradiction)
> and **keep going**. If it **does** invalidate a target, stop and re-`describe` that projection.

Anomalies are logged, not silently absorbed. A worked example of a Discovery pass and its
anomaly log: `docs/rheos-chat-ui-shape-discovery.md`.

### Modern ClojureScript
Always use `^:async` metadata (ClojureScript ≥ 1.12.145). Never use
`core.async` channels or Promise chains in new code.

```clojure
(defn ^:async fetch-data [url]
  (await (js/fetch url)))

(deftest ^:async fetch-test
  (is (some? (await (fetch-data "https://example.com")))))
```

### Idioms
- `when-let` over nested `let` + `if`
- `->` / `->>` over nested `let` forms
- No `utils` namespaces
- No broad `:refer :all`
- Custom macros registered in `.clj-kondo/config.edn` on day one
## Testing Gate
- A task is not done while any relevant automated test suite is failing.
- For CLI changes, run `pnpm -C packages/eta-mu test` and `pnpm -C packages/eta-mu lint:kondo` — `packages/eta-mu` is the CLI now, not `packages/legacy/coding-agent`. (Only run the legacy coding-agent suite when a change actually touches that package.)
- For eta-mu extension changes, run `pnpm -C packages/extensions test` and resolve all failures before reporting completion.
- If a full suite cannot be run, state that the task is not complete and record the exact blocker instead of claiming done.

## Session and Turn Discipline

The ledgers are the project's memory across sessions. Reading them is not optional
context-gathering, and writing them is not closeout — both are part of the turn.

- **Open every session by reading the ledgers.** `.ημ/session-mycology/ledger.md` and the
  spores under `.ημ/session-mycology/spores/`, plus the Receipt River at `receipts.edn`.
  Recover recorded context before asking the user to restate known intent.
- **Commit at the end of every turn.** Every turn, not every task. A turn that ends with
  uncommitted work has not ended — it has been abandoned mid-write.
- **Run `session-mycology` at the end of every turn.** Score the friction, log the turn,
  and incubate at most one spore when the friction was real and reusable.
- **Work in a git worktree.** Implementation happens on a branch in its own worktree, not
  in the primary tree. Push before removing the worktree, and remove it once its branch is
  pushed — never leave worktrees registered under a session temp path that will be
  garbage-collected.
- **Leave worktrees clean and stash state explicit.** No dangling files or dirty primary
  working tree. A reviewed stash may remain intentionally preserved; do not remove it
  unless every contained change is proven landed elsewhere and deletion is explicitly
  authorized by the owner. Never destroy unfamiliar stash state merely to satisfy a
  cleanliness rule.
- **You own the ledger churn you cause.** Any `eta-mu kanban` or Rheos CLI invocation
  rewrites `kanban/.events/ledger.edn`. That diff is yours to commit on the branch whose
  work produced it.
- **Delegate scoped implementation to subagents.** Keep the main context on intent and
  synthesis; push file-reading, surveys, and scoped edits outward. Use the smallest model
  that can do the job — Sonnet for coding subagents, Haiku for exploration and research.

## Board Operations

Board state is the single source of truth for work. Treat it as a finite-state machine whose law is implemented in `packages/rheos/src/rheos/backend/law/fsm.cljs` and rendered for humans in `PROCESS.md`.

- **Work from a card.** Never work off-board. Anchor every implementation slice on a kanban task and record the scoped plan on the card before moving to implementation.
- **Move cards with the Rheos CLI.** Run commands from the **repo root** so the board resolves correctly. Use **`eta-mu-beta`**, not `eta-mu` — the bare name is a volta shim to the *published* build, which carries a different command surface at the same version number. See `DEVELOPMENT.md` § *Running the CLI*. Rebuild first: `pnpm -C packages/eta-mu build`.
  - `eta-mu-beta kanban list` — current board.
  - `eta-mu-beta kanban count` — column counts.
  - `eta-mu-beta kanban comment <uuid> "note"` — append provenance to a card.
  - `eta-mu-beta kanban frontmatter <uuid> status <new-status>` — lawful status change.
  - `node packages/rheos/dist/cli.cjs status-update <uuid> --to <status>` — FSM-enforced move (also runs build-gate when required).
- **No direct frontmatter edits.** The file watcher treats hand-edited frontmatter as drift and stamps a `drift: true` indicator on the card. Use the CLI so the ledger records a `write-id` and the provenance is auditable.
- **Walk lawful hops.** There are no shortcut edges. To move a card multiple columns forward, step through each lawful transition in order. The direct `in_progress → review` edge exists only when the build-gate passes.
- **Regenerate snapshots when needed.** The web UI and `kanban/.kanban/board.json` are generated snapshots; the source of truth is the task files plus the ledger in `kanban/.events/ledger.edn`. If a snapshot is stale, regenerate it from the CLI or the web UI.

## Code Style
- **TypeScript** (legacy only): ES modules, camelCase functions, async/await, Zod validation, Fastify server
- **ClojureScript** (all new code): Reagent components, kebab-case functions, atoms for state, Tailwind CSS
- **Imports**: Use ES6 imports, no default exports, explicit file extensions (.js)
- **Types**: Strict TypeScript enabled for legacy TS; ClojureScript uses Malli schemas for validation
- **Naming**: camelCase for TS, kebab-case for CLJS, descriptive variable names
- **Error handling**: Try/catch only when necessary, proper error logging via bus events
- **Formatting**: Consistent indentation, no unnecessary destructuring, single-responsibility functions

