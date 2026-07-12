---
original_name: "2026.06.14.00.38.02.md"
title: "Eta-Mu Worlds, Projections, and Event Ledger Design"
summary: "Sketches eta-mu as a non-destructive Git porcelain around worlds, projections, an append-only event ledger, and kanban FSM contracts."
category: "design"
created: "2026-06-14"
---

<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# @Power User Aight I'm tryin to rethink how I manage my workspace.

I basically have one large one that has all my repos in it, several of my repos are mono repos, and they are largely self contained collections of software, so sometimes I can work directly from them with an ai.

Which, you know gives me some context isolation, but there is always still something that is there that doesn't need to be, or something that should be there, that isn't, for a given task.

I think this is better than what I see many doin, where they literaly just have a `~/projects` folder or something and all there gits are in there, and if they are smart, they use work trees, but they're always working on one project at a time.

I think there is a place between these, and I think the word, or words for the seperation are not "mono repo" or "workspace"

it's more like "worlds" and "projections"

Sub modules have been a learning experience. It's hard to do em right, but they're benefits I think, most the time, outweight the costs, at larger scales with larger collections of software.

a single mono repo, with hundreds of packages in it, there is no making that history make sense.

you have hundreds of versions of packages to all control.

if you do what many do for a "clean" commit history, and you rebase, you get a linear commit history, over unrelated commits to seperate projects who are versioned, published, and deployed seperately.

The gap you’re pointing at is real: the closest established term is a **manifest-defined working set**, and your own “worlds / projections” pair is a sharper way to talk about it. A “world” can be the pinned set of repos, paths, and revisions materialized together, while a “projection” can be the task-specific slice of that world that you expose to yourself or an AI.[^1_1][^1_2][^1_3]

## Facts

Git already has a projection primitive inside one repository: `git sparse-checkout` changes the working tree so only a subset of tracked files is present, and its `set` command stores sparsity in worktree-specific config so one worktree’s view does not have to mutate another.  For many repositories, `repo` adds a higher-level primitive: a manifest declares which repositories appear at which local paths and revisions, `repo init` creates the client metadata in `.repo/`, and `repo sync` materializes all projects or only the selected project list.[^1_1][^1_2][^1_3]

## Interpretation

“Workspace” is too weak because it usually means “a place where stuff is checked out,” not “a reproducible composition of bounded histories.” “Monorepo” is also wrong for your case when release boundaries, package versions, and deployment stories still live below the level of the whole tree. What you are noticing is a mismatch between storage topology and meaning topology.

## Naming model

Here’s a clean vocabulary that fits both the Git facts and your intuition:


| Your word | Closest existing term | Practical meaning |
| :-- | :-- | :-- |
| World | Manifested client / working set [^1_4][^1_3] | A reproducible set of repos, local paths, and pinned revisions synced together. [^1_1][^1_2] |
| Projection | Sparse worktree / task view | A task-shaped checkout: maybe one worktree per branch, plus sparse-checkout for only the relevant directories. |
| Module edge | Repo or submodule | A separately versioned unit; submodules remain explicit commit pointers and are initialized separately rather than being auto-managed by sparsity changes. |
| Session | Selected project list [^1_1] | A temporary subset of a world, synced or operated on for one problem domain. [^1_1] |

## Layout

```
```

```text
~/spaces/
  worlds/
    payments-platform/
      manifest/
      billing-service/
      auth-service/
      shared-ui/
  projections/
    payments-platform/
      oauth-bugfix/
      release-2026-06/
      ai-refactor-auth/
```


## History shape

Your complaint about linearized history is sensible: rebasing unrelated module work into one clean line can make the log prettier while making causality less legible. If the real units of change are separately versioned repos or submodules, then the world should record composition, and each module should keep its own history coherent inside that boundary.[^1_2]

Would you rather formalize this as pure Git primitives, or as “manifest + Git” with worlds as first-class objects?
<span style="display:none">[^1_10][^1_11][^1_12][^1_13][^1_14][^1_15][^1_16][^1_5][^1_6][^1_7][^1_8][^1_9]</span>

<div align="center">⁂</div>

[^1_1]: https://www.perplexity.ai/search/a5e9dd5c-c4c7-4759-809b-4ea3b3e62079

[^1_2]: https://www.developernation.net/blog/managing-complex-dependencies-with-googles-repo-tool/

[^1_3]: https://man.archlinux.org/man/repo-manifest.1.en

[^1_4]: https://github.com/seapath/repo-manifest

[^1_5]: https://git-scm.com/docs/git-sparse-checkout

[^1_6]: https://stackoverflow.com/questions/79826327/how-do-i-re-use-existing-submodule-checkouts-when-creating-a-worktree-in-git

[^1_7]: https://www.reddit.com/r/git/comments/1bo7jhn/subtree_vs_submodule_for_a_base_repo_containing/

[^1_8]: https://manpages.ubuntu.com/manpages/jammy/man1/git-sparse-checkout.1.html

[^1_9]: https://gist.github.com/ashwch/946ad983977c9107db7ee9abafeb95bd

[^1_10]: https://neoverse-reference-design.docs.arm.com/en/rd-infra-2024.07.15/about/repo_tool.html

[^1_11]: https://news.ycombinator.com/item?id=22080753

[^1_12]: https://source.android.com/docs/setup/reference/repo

[^1_13]: https://www.mslinn.com/git/600-partial-clone.html

[^1_14]: https://stackoverflow.com/questions/14331754/creating-a-default-manifest-for-git-repo

[^1_15]: https://stackoverflow.com/questions/66059160/how-to-repo-init-a-local-git-and-local-manifest-xml

[^1_16]: https://notes.nicolevanderhoeven.com/Submodules+vs+subtrees+vs+worktrees+in+Git


---

# What I think I wanna do is roll my own cli like they did with jj, except we're writing it with bb, and we talk about git like what it really is, when you strip out destructive operations.

it's an event ledger represented as a Merkle DAG

This is gonna be one of those things I keep tryin to think about, but...

it wouldn't just be about the CLI though. It'd be about tight integration with clojure, and emacs.

it'd be about a sub set of git's commands with no history rewrite, no destructive operations, highly submodule and working tree aware.

Like, we call it version control. But I want a decision record, I want event ledger, I want a system that is always inteligently committing.

I want basicly the "receipt river" and "the fork tax" to be things this cli, dsl, ecosystem, inherently understand

I want a system that inteligently creates new repos automaticly when package becomes signifigant in it's self.

like, say I run a node mono repo, and I have a `packages/` folder

Our tool understands most modern programming languages who have some kind of package management system, like node, python, rust, go, clojure, bb, shadow-cljs, java, C\#, etc, etc

so to like... well we'll just continue to use the `eta-mu` as the cli base, so `eta-mu` opens an cli to a coding agent based on a fork of pi.

but it also has all these other commands, like I've already added `eta-mu kanban ...`

which the system should also just fundementally understand and I think I'm almost there with it? The mechanics I think behind enforcing the board state transition contracts is almost there, if not implemented, well defined in my local kanban.

The mechanism by which those are enforced by the CLI or by the server, the mechanism to bounce the card back if card's status would be changed in a way that violates the workflow status transition contracts, even if you change a file, it will bounce it back.

but if an agent changes a file, and it bounces back after it does that, it still thinks it's in the state that it put it in.

I can solve this with a hook, in my own harnesses like eta-mu, or knoxx, or the `eta-mu sol` server, but I don't see a world where I just stop using other harnesses entirely.

and for it to be useful to others, adoption has to be seemless, it should not require changing any other tools, just incorperating which ever perticular `eta-mu <domain>` that you want into your existing workflows, so it can't require you to add an extension, plugin, or MCP server to be useful...

I did the ol eta-mu drift core right there.

A unified workflow is not the word, though the tooling will exist for you to have a totally unified workflow across every medium which you might run every harness, and every mcp server, or editor or what ever.

I'll be running that.

we are rethinking how work gets done in a time where agents are so prevolent, with out completely discarding old, stable, powerful tools, or interupting peoples workflows or deplyment schedules

You’re basically describing “jj, but for Git-as-ledger + agents + kanban,” with Git as the Merkle store and your own event log / workflow brain on top. That’s a coherent target, and you can get there incrementally without breaking other tools.

## Anchor the mental model

Git already *is* an append-only Merkle DAG of “state change” objects; people have been using it as the canonical example of event sourcing for years. Jujutsu shows another key move: keep Git as the storage backend but add a separate **operation log** of user actions with undo/redo and “how did I end up here?” answers.[^2_1][^2_2][^2_3][^2_4]

Your twist is:

- Treat the **event ledger** (ops, decisions, kanban transitions, agent actions) as the primary UX artifact, not the raw commit graph.
- Forbid destructive ops (no rebase/reset) and instead encode “fork tax” as explicit events.
- Make it **agent-native** and **kanban-native**, with Clojure/Emacs as first-class citizens.
- Auto-surface **module boundaries** (packages that deserve becoming repos) instead of treating the monorepo shape as sacred.

That’s a solid set of invariants for η‑μ as a bb-based porcelain.

## Core objects: DAG vs ledger

I’d separate your system into three conceptual layers:

1. **Artifact store (Git)**
    - Exactly what Git does now: blobs, trees, commits, refs; no changes here.[^2_5]
    - η‑μ never calls destructive commands; it only appends commits, merges, and tags.
2. **Event ledger (η‑μ)**
    - A separate, append-only log of **operations and decisions**:
        - `WORKING_CHANGE_APPLIED` (diff added to index)
        - `COMMIT_CREATED` (with message, card id, world/projection)
        - `CARD_TRANSITION {from -> to}`
        - `AGENT_PROPOSAL` / `AGENT_APPLIED` / `AGENT_REJECTED`
        - `REPO_EXTRACTED` (monorepo package split out)
    - Stored as EDN/JSON, e.g. under `.eta-mu/oplog.edn` or a sibling “world meta” repo.
3. **Worlds and projections**
    - World: manifest describing *which repos* and *which refs* define a coherent universe of work.
    - Projection: a task-shaped slice of a world (subset of repos/paths) that an agent/human currently cares about.
    - Very similar in spirit to `repo` manifests (Android’s multi-repo tool) but without forcing users into that ecosystem.[^2_6][^2_7]

The Merkle graph is the *data structure*, the event ledger is the *story*, and η‑μ concerns itself with storing and querying the story.

## Command surface: porcelain subset

You can explicitly define η‑μ as a **non-destructive porcelain** over Git plumbing.[^2_5]

Rough sketch:

- `eta-mu init`
    - Initialize `.git` if needed, `.eta-mu/` ledger dir, world manifest.
- `eta-mu status`
    - Wraps `git status --porcelain=v2`, plus ledger-derived state (current card, world, projection).[^2_8][^2_5]
- `eta-mu commit`
    - Always creates a commit. No amend, no rebase.
    - Requires context: card id, intent, maybe projection.
    - Emits `COMMIT_CREATED` event pointing to the Git commit hash.
- `eta-mu branch`, `eta-mu merge`
    - Branch/merge wrappers that log `FORK_CREATED`, `FORK_MERGED` events to make fork tax explicit.
- No `eta-mu rebase`, no `eta-mu reset --hard`, etc.
    - You can still *expose* raw Git for escape hatches, but that’s outside the “blessed” path.

Integration-wise, η‑μ just shells out to Git plumbing and uses porcelain with stable formats (e.g., `--porcelain`, custom `--format`), exactly like people are doing to make Git agent-friendly already.[^2_8]

## Decision record and “receipt river”

The **receipt river** you want is exactly the event log people build in event-sourced systems: one row per change with enough detail to reconstruct state and narrative.[^2_3][^2_9]

Design it like a real domain stream, not just “log of commands”:

- **Stream key**: repo, world, card, or “aggregate” you care about (e.g., `world:payments-platform`, `card:KAN-1234`).
- **Event types** (examples):
    - `card.created`, `card.transitioned`, `card.blocked`
    - `commit.recorded`, `branch.forked`, `branch.merged`
    - `agent.plan_proposed`, `agent.plan_applied`, `agent.plan_bounced`
- **Payload**: EDN map with:
    - Git refs/hashes involved
    - Kanban state before/after
    - Agent identifier + harness (eta-mu, knoxx, VSCode plugin, etc.)
    - World/projection id

Because the ledger is append-only, you never lose the “why” behind a commit; you can replay or analyze the receipt river without touching the raw DAG.

## Kanban contracts as first-class

You already have a notion of **status transition contracts** in your kanban setup. Treat that as a first-class FSM:

- Workflow spec: EDN like

```clojure
{:states #{:backlog :todo :in-progress :review :done}
 :initial :backlog
 :transitions #{[:backlog :todo]
                [:todo :in-progress]
                [:in-progress :review]
                [:review :done]}}
```

- η‑μ enforces:
    - Every `card.transitioned` event must follow an allowed `[:from :to]`.
    - Every `eta-mu commit` targeting a card must be compatible with the card’s current state (e.g., you can’t commit code for a `done` card).

Mechanically:

- `eta-mu kanban transition KAN-1234 :review`
    - Checks current state against FSM.
    - If valid: writes `CARD_TRANSITION` event + persists board state (file, DB, whatever).
    - If invalid: writes `CARD_TRANSITION_REJECTED` event and returns non-zero exit.
- `eta-mu commit --card KAN-1234`
    - Reads the current state; if e.g. `:backlog` is not allowed to have code changes, it can refuse or switch state as part of the command.

This gives you the “bounce back” behavior as a protocol, not a side-effect: a transition failure is *itself* an event, visible to agents.

## Making agents not lie to themselves

Key point you raised: “if an agent changes a file and the card bounces, the agent still thinks it’s in the new state.” That’s solvable with **proposal vs application** events and deterministic CLI responses.

Design pattern:

- Agents never unilaterally “declare” state; they **propose** an action to η‑μ.
- η‑μ validates against reality (Git state + kanban FSM), applies, and then returns the actual applied state.

Example flow:

1. Agent runs:
`eta-mu plan-apply --card KAN-1234 --patch /tmp/patch.edn --json`
2. η‑μ:
    - Emits `AGENT_PROPOSAL` with patch + intended state.
    - Applies patch to working tree.
    - Attempts `CARD_TRANSITION`.
    - If success: creates commit + `AGENT_APPLIED`, returns `{status: "applied", card_state: "review", commit: "abc123"}`.
    - If fail: reverts working tree, emits `AGENT_REJECTED` with reason, returns `{status: "rejected", reason: "...", card_state: "todo"}`.

Because the contract is “CLI is the oracle,” any harness just needs to treat the JSON/EDN result as canonical, not its own internal assumptions.

## Auto-repo creation from monorepos

Auto-splitting significant packages into repos is ambitious but feasible if you constrain the problem:

1. **Language-aware scanners**
    - For each ecosystem (Node, Python, Rust, Go, Clojure, etc.), you know where packages live (`packages/*`, `crates/*`, `src/*`, `modules/*`) and how to read their manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, `deps.edn`, etc.).
2. **Significance heuristics**
    - You define rules like:
        - `LOC > threshold`
        - `dependency_count > N`
        - `release_count > M`
    - Or even a manual promotion command:
`eta-mu extract-repo packages/foo --name foo-service`
3. **Extraction mechanics**
    - Use `git subtree split` or `git filter-repo` to pull out the history for `packages/foo` into a new repo while preserving commit history.
    - Wire the new repo back into the mono via submodule/subtree, depending on your preference.
    - Emit `REPO_EXTRACTED` event linking source commit range → new repo URL and initial commit.

This lets η‑μ *suggest* repo promotion (“this package has crossed the significance threshold”) without forcing it; you still control when to pay that fork tax.

## Agent- and editor-friendly interface

You already know the UX requirement: **no plugins required**. So the interface surface should be:

- CLI commands with **stable machine-readable output** (EDN/JSON), not human-oriented chatter.[^2_8]
- Minimal ENV contract: harnesses only need `$PWD` and a few flags, not in-process libraries.

Some shapes:

- `eta-mu inspect --json`
    - Returns `{world, projection, git_status, cards, constraints, suggestions}`.
- `eta-mu kanban list --card KAN-1234 --edn`
    - Returns `{id, state, allowed_transitions, related_commits}`.

Then, on top of that:

- **Clojure/BB library** exposes the same EDN schemas so you can script flows inside `bb`, `clj`, or Emacs.
- **Emacs commands** are thin wrappers (`M-x eta-mu-commit`, `M-x eta-mu-kanban-transition`) that shell out and parse EDN; no heavyweight LSP or server required.

This satisfies “works everywhere” while letting *you* have the fully unified workflow in your own stack.

## Migration and adoption strategy

To keep adoption seamless:

- η‑μ should **work on totally vanilla Git repos**.
    - If `.eta-mu/` is missing, `eta-mu init` creates it non-destructively.
    - No need to switch remote hosting, hooks, or CI on day one.
- Use **opt-in enforcement**:
    - A repo can start with “soft” kanban constraints (warnings only), then enable “hard” mode where invalid transitions fail the command.
    - CI can eventually add a gate: “no merge to main unless η‑μ ledger and kanban state are consistent.”
- Treat other harnesses as “dumb clients”:
    - VSCode, MCP servers, GitHub Actions, etc., simply call the CLI.
    - If they never adopt η‑μ-specific features, they still benefit from the invariant that Git history is append-only and the ledger is queryable.

That way, you can dogfood the full “unified workflow across every medium” without making that the entry cost for everyone else.

***

If you want to push this further, next steps I’d sketch are:

- A minimal **EDN schema** for ledger events.
- A tiny **babashka prototype** of `eta-mu commit` that writes both Git commit and ledger event.
- A **kanban FSM validator** in Clojure that runs as a standalone lib and from the CLI.
<span style="display:none">[^2_10][^2_11][^2_12][^2_13][^2_14][^2_15][^2_16][^2_17]</span>

<div align="center">⁂</div>

[^2_1]: https://github.com/jj-vcs/jj

[^2_2]: https://www.grahambrooks.com/event-driven-architecture/patterns/event-sourcing/

[^2_3]: https://arxiv.org/pdf/2104.01146.pdf

[^2_4]: https://zenn.dev/usamik26/articles/jj-version-control?locale=en

[^2_5]: https://dev.to/rahulyavvari/git-a-guide-to-mastering-version-control-ob9

[^2_6]: https://man.archlinux.org/man/repo-manifest.1.en

[^2_7]: https://source.android.com/docs/setup/reference/repo

[^2_8]: https://playbooks.com/skills/laurigates/claude-plugins/git-cli-agentic

[^2_9]: https://lawzava.com/blog/2021-10-25-event-sourcing-patterns/

[^2_10]: https://github.com/luque/Notes--Versioning-Event-Sourced-System

[^2_11]: https://github.com/dpup/git-workflow

[^2_12]: https://www.youtube.com/watch?v=5zOgimIgYqA

[^2_13]: https://www.infoq.com/news/2017/07/versioning-event-sourcing/

[^2_14]: https://cladam.github.io/projects/tbdflow/

[^2_15]: https://neugierig.org/software/blog/2024/12/jujutsu.html

[^2_16]: https://github.com/gautaz/git-porcelain

[^2_17]: https://zenn.dev/usamik26/articles/jj-version-control


---

# So I have conflicting feelings about the ledgers.

but I actually think this is sort of going to be the point, and the mechanism it's self, multiple event ledgers so we have a lot of events, with out a single file growing with out bounds.

My conflicting feelings are about the `.ημ` folder it's self, and if and to what extent, it is tracked with in git.

one append only ledger doesn't match git's model well, because it's a linear timeline, you append stuff to it, and there is only what happened before it, and what happens after it.

there is no notion of separate timelines with one file, so you inevitably always get merge conflicts, well, you don't get one for free at least, and parsing it out of a very large file will get expensive if it has to happen often.

We can't totally prevent conflicts from happening.
But I think we can create a system that is able to
handle them gracefully, automatically, and legibly.

So I think we keep many different ledger files,
while maintaining axxiumatic actor identity and
causal attribution between the different ledgers.

The fields required for the axioms we require to be true to hold are
always handled by the system, if the actor does not explicitly
declare them

It can be thought of as a single DAG, who's complete representation
is derivable from the merger all event ledgers

What this does for us is explicitly, in the most basic, but meaningful way possible, result in a decentralized, distributed,
resilient data structure.

the real data structure never really has to fully exist in one spot,
you just always have to be able to rebuild the current state by
replaying the events in the same order they happened in.

And I think we don't even really standardize *what* ledgers are kept.
We standardize identity, causality, attribution, and subjects

And we govern how large any one node in the distributed ledger
is allowed to get before requiring that ledger node to be split.

We don't govern the shape of the events added to the ledgers,
but we do govern consistency.

If one ledger starts to become a dung hill, this is audit-able.
There might be many kinds of events of unrelated events.

There might be no clear shared causes detectable through the causal id resolution
There might be no meaningful clustering of events in time
There will be a quantifiable absence of a pattern to a dump.

These, and many, many more, are all members of the category of the
anti pattern ledgers

High entropy ledgers are subject to repair,
reconciliation, absorption, consolidation.

Attempts to append new events to an anti pattern ledger can be blocked, with a clear,
deterministically generated message
describing the way that ledger has failed to resolve
to a meaningful pattern of cause an effect, not only can you
explain why a given ledger is an anti pattern ledger,
you can use these statistical models to explain why
the rejected event was a part of the anti pattern,
and meaningfully give guidance as to what to do instead.

You can meaningfully, deterministicly, describe, explain, and learn from any event, or group of events,
in natural language.

Generating useful, learned, feedback, from a deterministic statistical model of cause and effect

All highly variable, derived from chaos theory,
the rules of the system emerging not only in behavior,
but  in natural language too.

eta-mu cli, is designed expecting agents to use it.
And it is designed expecting the kind of drift agents naturally do.

So cli, every output is assumed to be the input to an agents context.
So all outputs are prompt engineered.

A person will (probably) be the one to choose to adopt one part of eta-mu or another, but the agent would learn to use the rest of it as it went.

I think that the event ledgers, are version controlled in git

I think we manage their git presence separately, invisibly, and automatically from the filesystem outside of the .eta-mu/ data store.

The ledgers being version controled allow us to break these files up and "rewrite" these ledgers, with out loosing any information. The primary beenfit of immutability is gained by keeping git an immutable record states of the system over time, while allowing each ledger to be rewritten, collapsed, consolidate, corrected, or even removed.

I think whenever we encounter a conflict for any reason,
immediately, the world lines split, and we get two or more new projections.

Git, and eta-mu become something like a double entry book keeping system.
Where by treating one of them as truly immutable, and garenteeing that every event recorded by the distributed ledger of eta-mu remains reversable and replayable, regardless of if we perform destructive ops on the data files that are in active use.

One of the event ledgers becomes a projection of the primary, more centralized one, git.

So from this, we could distribute the data structure horizontally, across many nodes,
if all of them are meticulously commited to git every time a new event is added.

Nothing forgotten, just less remembered...

The multi-ledger instinct is right: most serious event-sourced systems end up with **many streams plus a global causal fabric**, not one gigantic log, and what you’re sketching maps cleanly onto that. The interesting work for η‑μ is nailing the invariants (identity, causality, consistency, compaction) so you can safely rewrite individual ledgers while treating Git as the untouchable audit spine.[^3_1][^3_2]

## Many ledgers, one conceptual DAG

Event sourcing patterns already assume **per‑aggregate or per‑shard streams** rather than a single append-only file; that’s how they scale writes and avoid constant contention on one hot log. What you’re calling “many ledgers whose union defines a single DAG” is essentially: each ledger is a partitioned event stream, and the **global history is their union plus a happens‑before relation** derived from causal links and timestamps.[^3_3][^3_2][^3_4][^3_1]

That buys you:

- Small files, cheap local reasoning, less constant merge hell.
- The ability to host different ledgers on different nodes and sync later, as long as your merge operation is convergent (commutative, associative, idempotent) in the CRDT sense.[^3_5][^3_4]

So the model “one conceptual DAG, physically sharded across .eta‑mu ledgers” is not only fine, it’s aligned with how log-based CRDT and replicated-event systems are designed today.[^3_6][^3_7][^3_3]

## Identity, causality, attribution as axioms

You’re also right to standardize **who, why, and causal links** while leaving “what the event shape is” to higher layers. Event-sourced designs typically distinguish the event envelope (id, stream id, causal metadata, version) from the domain payload; your “axiomatic actor identity and causal attribution” is exactly that envelope.[^3_8][^3_9]

Concretely, every η‑μ event, regardless of ledger, needs:

- A **globally unique event id** (e.g. UUID + world id).
- **Actor identity** (human, agent, harness, plus maybe org/team).
- **Subject** (which card, repo, world, projection, etc. this touches).
- **Causal parents**: ids of events this was derived from (like a commit’s parents or a Lamport/CRDT clock).[^3_3][^3_6]

Once that’s in place, you can reassemble the “true” DAG from the union of ledgers plus these causal edges, even if no single file ever contains the whole history.

## Ledgers as Git-tracked, rewriteable views

Event sourcing people already separate **immutable logical history** from **practical compaction**: the store is append-only, but you use snapshots and log rewriting to keep working sets small. Your twist is to let **Git** be the immutable historical store and treat each ledger file as a compacted *view* over that history.[^3_10][^3_1]

That suggests a safe pattern:

- .eta‑mu holds many log segments, e.g. `.eta-mu/streams/<stream-id>/<segment-id>.edn`.
- η‑μ is free to **rewrite, compact, split, or delete active segments**, as long as it also commits those changes to Git.
- The “never forget” guarantee is not “never rewrite a ledger file,” it is “never lose the chain of Git commits showing how ledgers evolved.”[^3_9][^3_1]

You can even log compaction as first-class events (e.g. `LEDGER_COMPACTED {from-segments … to-segment …}`) so deterministic replay doesn’t have to dig through raw Git history; it just respects the compaction events.

## Conflicts as worldline splits

“On conflict, worldlines split” is a clean semantic promise if you bake it into your merge strategy. In most event-sourced systems, sharding and partial order mean you *avoid* many conflicts; when they do happen, you either define a CRDT merge or surface a higher-level decision.[^3_4][^3_6]

For η‑μ’s ledgers you could say:

- If Git reports a **clean, structural merge** of two ledger files (e.g. distinct segments or disjoint event ranges), fine.
- If a ledger merge touches the same logical event positions in incompatible ways, **η‑μ refuses to auto-merge** and instead:
    - Creates **two projections** (two new ledger heads) with explicit branch events,
    - Or generates a structured “merge needed” event that an agent or human must resolve.

That’s where your double-entry analogy kicks in: **Git’s commit graph** is one leg, **η‑μ’s event graph** is the other, and a “balanced” system is one where every Git merge affecting .eta‑mu has a corresponding, explicit ledger-side decision.

## Anti-pattern ledgers and high-entropy detection

Your “dung hill / high entropy ledger” category maps nicely to the idea of **poison streams** or mis-modeled aggregates, but with an analytic, statistical spin. Typical event stores worry about versioning and evolution of event schemas; you’re adding analysis of *how* a stream is used over time—clustered topics, causal coherence, temporal structure, etc.[^3_11][^3_8]

Two constraints to keep this sane:

- The classifier (“this is an anti-pattern ledger”) must be **deterministic and versioned**; its version should be recorded in events that it influences, or you’ll get non-replayable behavior when the rules change.
- Rejections should be **just more events**: `APPEND_REJECTED {reason, classifier-version, suggested-stream}` so that even “this is a mess” becomes part of the audit trail instead of a silent runtime rule.[^3_8][^3_10]

Then your “deterministic statistical model of cause and effect, emitting natural language explanations” is just a deterministic mapping `ledger-state × event → {accept|reject, explanation}`, and harnesses treat that explanation as UX for humans and prompt material for agents.

## Horizontal distribution and “never fully in one spot”

What you describe—no single node ever having the complete structure, but all of them being able to reconstruct state from their slice plus Git—is how **distributed logs + CRDTs** are used for edge and IoT applications already. You shard streams across nodes, replicate or gossip events, and rely on a merge that’s convergent at the abstract state level to ensure everyone eventually agrees.[^3_7][^3_6][^3_5][^3_4]

η‑μ can lean on Git as the **global write-ahead log**: as long as every accepted event eventually ends up in a commit, you can always replay from a Git checkout, even if individual ledger files have been compacted, moved, or dropped from active use. Locally, nodes operate with the small, rewriteable ledgers; globally, Git preserves the long memory.[^3_12][^3_1]

## Agent-first, prompt-shaped CLI as protocol

Treating *every* CLI output as agent-input-by-default is exactly what people are doing in “git-cli-agentic” type skills: stable machine-readable blocks (JSON/EDN) plus a human-readable gloss for when a human is in the loop. If η‑μ’s rules include:[^3_13]

- “Each command returns a single, schema-stable EDN/JSON object (success or failure).”
- “Every rejection ties directly to event ids, ledger ids, classifier versions, and provides a short NL rationale.”

…then drift is manageable: agents can re-query, see that a ledger or projection changed under their feet, and adapt based on structured signals instead of brittle text scraping.

***

You don’t need to resolve your conflicting feelings about ledgers yet; you can crystallize them into **three invariants**:

1. Identity/causality/attribution are standardized and enforced.
2. Git is the immutable audit spine; .eta‑mu ledgers are rewriteable, Git-tracked views.
3. Every conflict or rejection becomes more structure—projections, explicit branch events, or anti-pattern diagnostics—not an opaque failure.

From there, we can start sketching a concrete `.eta-mu/` layout and one or two initial ledger types and see how they behave under merge, compaction, and agent drift.
<span style="display:none">[^3_14][^3_15][^3_16]</span>

<div align="center">⁂</div>

[^3_1]: https://www.sysdesai.com/learn/data-management-patterns/event-sourcing

[^3_2]: https://stackoverflow.com/questions/68504093/horizontal-scaling-in-event-sourced-system-having-in-memory-database

[^3_3]: https://pages.lip6.fr/Marc.Shapiro/papers/CRDTs-Springer2018-authorversion.pdf

[^3_4]: https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type

[^3_5]: https://iankduncan.com/engineering/2025-11-27-crdt-dictionary/

[^3_6]: http://krasserm.github.io/2016/10/19/operation-based-crdt-framework/

[^3_7]: https://par.nsf.gov/servlets/purl/10345308

[^3_8]: https://medium.com/@puspdhariwal.study/mastering-event-sourcing-a-pattern-for-scalable-auditable-systems-with-ledger-db-and-blockchain-c53adca12224

[^3_9]: https://stackoverflow.com/questions/46715392/does-an-append-only-event-store-result-in-an-append-only-codebase

[^3_10]: https://www.linkedin.com/posts/abuijze_event-sourcing-friday-fud-how-can-i-correct-activity-7242786363547283456-1QPj

[^3_11]: https://terminalskills.io/use-cases/build-event-sourced-fintech-ledger-with-cqrs

[^3_12]: https://www.reddit.com/r/programming/comments/1iq20v8/what_is_event_sourcing/

[^3_13]: https://playbooks.com/skills/laurigates/claude-plugins/git-cli-agentic

[^3_14]: https://medium.com/@ocrnshn/event-sourcing-and-cqrs-9286e5578f93

[^3_15]: https://www.linkedin.com/posts/sina-riyahi_8-must-used-distributed-system-patterns-activity-7302960643685425152-fTdj

[^3_16]: https://github.com/albe/node-event-storage/blob/main/README.md


---

# I already have the .eta-mu ledgers in my head clearly.

The part that's less clear is there is like this 3rd layer that is conceptually seperate from both the eta-mu ledger and the git history.

That is the concept we started with, worlds and projections of files in a code or knowledge base.

I can *see* it, snapshots of it, I can see what it'd look like at any one point in time.

But how the system actually manifests these worlds and projections of state from with in those worlds is slightly more nebulus.

At a surface level, the most raw implementation, layer 0 of that protocol, is manaul management of worlds and projections.

Over time though, you do that enough and you accumulate a lot of information.
If you are doing that, in addition to doing complex dev work, of editing files, running commands, standing up services, reaching out to the web

Espeically at the rate it is reasonable to expect even in constrained circumstances, let alone what is *possible* with agents?

by tieing everything together like this, you are kinda building out the actualy model of the thing the LLM is an approximation of, at least subsets of it.

Overtime, working with the models stops being about writing code at all... and all of it becomes a process of remembering.

a system governed as we have described, is maximally safe.
Every action taken is recorded.

in the simplest case where the user is only using the eta-mu cli to use a single on of the features it enables, which will almost always be how it starts, but will almost never be where stops.

In the simplest case, you get every changed file, exactly when they happened, in what order, in what context, and a record of every time the eta-mu cli is called, or it's daemon takes some automatic action to enforce the systems deterministic rules.

Is it possible to capture the the stdio or ipc streams from a coding harness using linux primiatives?

each process is a file somewhere... If it's your user running that process, you can find it, righ?

There are really two questions here:

1. What is that 3rd layer “worlds \& projections” actually *made of*?
2. Can η‑μ observe everything your harness does on Linux (stdio/IPC) just from the outside?

## Layer 3: what a “world” actually is

You already have:

- Git: immutable content + history.
- `.eta-mu`: event ledgers, decisions, kanban transitions, agent actions.

The 3rd layer can be modeled as **derived state**:

> A *world* is a named, reproducible mapping from “subjects” (repos, paths, cards, services) to specific Git commits, plus a set of *projections* that say “which parts of this world are currently materialized where.”

Concretely, a world can be:

- A **manifest**:
    - `repos`: `{id → {remote, commit, subdir}}` (like Android’s `repo` manifests but smaller in scope).[^4_1][^4_2]
    - `views`: high-level domains (e.g. “payments”, “auth”) that bundle several repos.
- A **projection spec**:
    - Which view(s) or repos are included.
    - Which paths are visible (sparse-checkout patterns).[^4_3][^4_4][^4_5]
    - Which environment assumptions hold (services, ports, env vars).

At any instant, one projection materializes as “the directory tree your harness sees”: a combination of:

- Git checkouts/worktrees at specific commits.
- Sparse-checkouts or symlinked directories for only relevant subtrees.[^4_5][^4_3]

So:

- Git knows *content*.
- `.eta-mu` knows *events and decisions*.
- The **world layer** knows *“what should exist where, right now”* as a pure function of those two.

You don’t have to fully materialize the abstract DAG of events + commits; you only need enough deterministic information to say:

> “Given world W and projection P at time T, the tree under `$PWD` should look like this, and η‑μ can reconstruct that from Git + the ledgers.”

## L0 vs learned worlds

Your “Layer 0” is already valid: manual worlds and projections, where you:

- Hand-maintain manifests (“these repos belong to payments-platform”).
- Decide which repo/branch/path to check out for a task.
- Point η‑μ at that and say “this is the active world+projection.”

Over time, η‑μ can *learn* worlds instead of you spelling them out:

- Observe which repos and directories change together.
- Observe which services/commands are usually started when certain files are edited.
- Observe which kanban cards and commits co-occur.

Then it proposes persistent world/projection definitions (“looks like you always touch `repo A`, `repo B`, `packages/auth-*` together when working on auth; should this be a named projection?”).

That’s exactly the “the model starts to look like the thing the LLM approximates” point: Git + ledgers record reality; worlds/projections are the compressions of that reality into reusable “problem spaces”.

## Capturing harness IO: what’s actually possible on Linux

Short answer: **yes, you can capture harness stdio with only Linux primitives**, but you’ll get a much cleaner system if you capture at *launch time* rather than attaching to arbitrary already-running processes.

### The easy case: wrap the harness at launch

If *you* start the process, you can record everything by owning its tty or pipes from the beginning:

- Use `script`, `ttyrec`, or asciinema-style tools to record the entire terminal session to a file, including commands and output.[^4_6][^4_7][^4_8]
- Or use `tee`-style wrappers to split stdout/stderr to logs while still streaming to the terminal.[^4_9]

Example pattern:

- `eta-mu harness run <name> -- <your-command ...>`
    - η‑μ starts `script` or a custom recorder, then runs the harness inside that pseudo-terminal.
    - All stdio goes to both the user and a log file; η‑μ later ingests that log as events.

This is how tools like `rec` record shell sessions and turn them into workflows: they sit at the PTY boundary and capture everything *by design*, no kernel gymnastics.[^4_10]

For your purposes, that’s the “maximally safe” path: eta‑mu owns the initial file descriptors, so there’s no surprise about what is and isn’t observable.

### The hard case: attach to an already-running process

Once a process is running, it already has its stdin/stdout/stderr wired. Linux does let you introspect and sometimes redirect those, but it’s hacky:

- `/proc/<pid>/fd/` shows you all open file descriptors for a process; `0`, `1`, `2` are stdin, stdout, stderr.[^4_11][^4_12][^4_13]
- You *cannot* just “tee” off an arbitrary fd from user space; to redirect it you typically attach a debugger (e.g. `gdb`) and call `dup2`/`open`/`close` in the target process to send fd 1 to a file instead.[^4_14][^4_15][^4_16]
- Tools like `strace -e write -p <pid>` can show you writes to stdout/stderr in real time by intercepting `write(2)` syscalls, but the output is in a syscall-trace format that you have to parse back into streams.[^4_17][^4_14]

All of this is “possible but not pretty” and not something you want as your primary protocol.[^4_16][^4_14]

So for η‑μ:

- **Yes**: if the harness runs under your user, you can always *find* it with `ps`, inspect its fds under `/proc/<pid>/fd/`, and even rewire its stdout to a file with debugger help.[^4_18][^4_13][^4_11][^4_16]
- **No**: that’s not a sane default for “every coding harness”; it’s an escape hatch for special cases.


### Where eta‑mu should sit

Given that, η‑μ should:

- Own the IO boundary whenever possible:
    - `eta-mu run-harness <profile>` wraps the harness in a PTY or pipes, capturing everything deterministically.
- Treat “attach to an existing PID” as:
    - A specialized command (e.g. `eta-mu tap --pid 1234`) that uses `strace` or `/proc/<pid>/fd` tricks and clearly marks the resulting events as “tapped”, lossy, and possibly partial.[^4_14][^4_11][^4_17][^4_16]

That still satisfies your design goal: **agents see everything they need to see** via η‑μ’s outputs, but η‑μ doesn’t rely on fragile runtime surgery as its main mechanism.

## How this ties back to worlds/projections

Given these pieces, the picture is:

- **World**: defined mapping from repos/paths/services → Git commits/branches at a point in time.
- **Projection**: the subset of that world your harness is working in; η‑μ tracks which projection is active when it starts a harness or runs a command.
- **η‑μ CLI / daemon**:
    - Wraps harnesses and tools, records IO, emits events into appropriate ledgers.
    - Every event is linked to world, projection, actor, and causal parents.

You end up with:

- Git as immutable content history.
- `.eta-mu` as rewriteable, Git-tracked event views.
- Worlds/projections as the layer that says “what parts of those two should exist, now, for this problem.”

From there, “working with the models becomes a process of remembering” is literal: reconstructing state is replaying events plus re-materializing the projection, and η‑μ has enough hooks to do that without you changing every harness in the ecosystem.
<span style="display:none">[^4_19][^4_20]</span>

<div align="center">⁂</div>

[^4_1]: https://source.android.com/docs/setup/reference/repo

[^4_2]: https://man.archlinux.org/man/repo-manifest.1.en

[^4_3]: https://git-scm.com/docs/git-sparse-checkout

[^4_4]: https://manpages.ubuntu.com/manpages/jammy/man1/git-sparse-checkout.1.html

[^4_5]: https://www.mslinn.com/git/600-partial-clone.html

[^4_6]: https://www.baeldung.com/linux/record-terminal

[^4_7]: https://www.tutorialspoint.com/article/how-to-record-linux-terminal-sessions

[^4_8]: https://thelinuxcode.com/record_everything_terminal/

[^4_9]: https://jon.sprig.gs/blog/post/3091

[^4_10]: https://www.linuxlinks.com/rec-records-terminal-sessions/

[^4_11]: https://man7.org/linux/man-pages/man5/proc_pid_fd.5.html

[^4_12]: https://manpages.staging.ubuntu.com/manpages/oracular/fr/man5/proc_pid_fd.5.html

[^4_13]: https://en.wikipedia.org/wiki/File_descriptor

[^4_14]: https://stackoverflow.com/questions/9047581/capture-stdin-stderr-stdout-of-a-process-after-its-been-started-using-comm

[^4_15]: https://stackoverflow.com/questions/249703/how-can-a-process-intercept-stdout-and-stderr-of-another-process-on-linux/249932

[^4_16]: https://www.tutorialspoint.com/article/redirecting-the-output-of-an-already-running-process-on-linux

[^4_17]: https://www.youtube.com/watch?v=V3jGBkRVMhY

[^4_18]: https://blog.csdn.net/mydriverc2/article/details/41979203

[^4_19]: https://mechpen.github.io/posts/2023-07-01-proc-fd-files/

[^4_20]: https://www.linuxtechi.com/record-replay-linux-terminal-sessions-activity/


---
