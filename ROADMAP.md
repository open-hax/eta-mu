# Roadmap — the constellation

One page for where the parts are going and in what order. Every repo in the
constellation carries a short `ROADMAP.md` summarising the slice that affects it
and pointing back here. **This file is the hub; those are satellites.**

Last surveyed: 2026-08-06.

## How to use this

- Looking for *what to do next in one repo*? Read that repo's `ROADMAP.md`.
- Looking for *why the order is what it is*? Read this.
- Looking for *the authoritative task list*? The kanban boards. This page links
  to cards; it never restates their contents as truth.

Cards referenced as `repo:card-uuid`. Board locations:

| repo | board |
|---|---|
| eta-mu | `kanban/{epics,tasks}/` |
| knoxx | `kanban/{epics,tasks}/` |

## The seam

From `muse/docs/design/contract-ownership-and-host-translation.md` — the
recovered intent, and the thing to keep in your head:

```text
Katamorph contracts
  → Muse assembly
  → target-neutral resolved agent catalog
  → Muse target projection
  → host artifact or explicit incompatibility
  → Turn Processor
  → in-process Eta-Mu agent or deployed Sol transport
```

One contract language, many interpreters. Not one runtime.

## Ownership

| Part | Owns | Does **not** own |
|---|---|---|
| **katamorph** | **The contract runtime.** Resource identity, the shared vocabulary (`schema.cljs`), validation, laws, and the interpreters — action, agent, condition, driver, filter, policy, registry, store | File discovery, deployment, host SDK objects, model calls, storage connections |
| **muse** (Keryx) | Importing/assembling declarations, resolving references, translating lawful data into host shapes, reporting incompatibilities | The meaning of shared contracts; the agent turn loop |
| **Turn Processor** | The host-neutral turn loop and its message/tool lifecycle | Provider catalogs, host config files, service deployment |
| **Sol** | A service deployment of Turn Processor with HTTP/streaming/session adapters | A second contract language or turn algorithm |
| **eta-mu agent** | CLI client, EDN session UX, transport selection | Hardcoded model/provider truth |
| **event-ledger** | The append-only envelope contract and its storage | Contract vocabulary |
| **knoxx** | A later application composition using stable upstream parts | Defining the upstream seams while they are still moving |
| **openplanner** | (being dismantled) | — |
| **services deploy repo** | Host contract, image build, deploy order, health gates | Application behaviour |

## The sequencing rule

> Knoxx is a downstream composition target. It remains deferred until these
> parts work independently; **code should not be migrated into or out of Knoxx
> to prove this architecture.**
> — `muse/docs/design/contract-ownership-and-host-translation.md`

Upstream first. Knoxx cuts over **last** (`eta-mu:knoxx-katamorph-cutover`,
icebox). This is the rule most likely to be broken by enthusiasm, including by
agents; it is why `knoxx`'s own epic lists extraction as a non-goal.

## Why drift keeps happening

Diagnosed in `eta-mu:katamorph-canonical-cutover` and worth memorising:

> contract discipline is only load-bearing in **muse** (build fails without the
> data pipeline); in sol/knoxx contracts are **optional config**, so agents
> defined schemas in place. **Fix = cutover + make it enforceable, not more
> documentation.**

Every "make X comply" card on this roadmap should therefore ship an
*enforcement* mechanism, not a cleanup pass. A cleanup without a gate regresses.

## Current state

### Done

- `eta-mu:contracts-git-ref-extraction` — katamorph + event-ledger extracted to
  standalone git-ref repos.
- `eta-mu:sol-extraction`, `eta-mu:sol-turn-processor-cutover`,
  `eta-mu:sol-interchangeability` — agent API out of knoxx, on the turn
  processor, interchangeable via `IChatSession`.
- `eta-mu:chat-ui-extraction` — chat UI out of knoxx into a Helix package.
- `eta-mu:sol-katamorph-schema-cutover` — sol validates via `katamorph.schema`.
- `eta-mu:katamorph-provider-contract` — `ProviderContract` kind, tagged.
- `eta-mu:contract-redefinition-guard` — a consumer's gate fails if it redefines
  a katamorph-owned schema name.
- `eta-mu:event-ledger-envelope-truth` — card closed. Check whether muse still
  carries its ANOMALY workaround before assuming the consumer side is finished.

Two extractions out of knoxx have already succeeded. The path works; it runs
upstream-first.

### In flight

- **`eta-mu:katamorph-canonical-cutover`** (P0, breakdown) — the spine. 3 of 5
  acceptance criteria met.
- `eta-mu:capability-schema-reconciliation` (**ready**) — muse's capability shape
  vs katamorph's `CapabilityContract`. *"A capability is the primitive."*
  **Blocks anything that groups capabilities**, including
  `knoxx:knoxx-mcp-consent-permission-groups`.
- `eta-mu:rheos-cli-card-lifecycle-authority` (breakdown) — three PRs in review
  as one ordered stack: #167 create → #168 exit contract → #169 docs. They must
  merge in that order; each is based on the one before, not on `main`.
- `knoxx:knoxx-decouple-into-katamorph-contracts` — knoxx internal compliance +
  actor awareness. Explicitly not extraction.

`eta-mu:event-ledger-envelope-truth` was listed here until 2026-08-06; its card
is `done`. Moved to Done below.

### Open on the board, not yet on this page

- `eta-mu-quality-ratchet` gained four **layer-boundary** slices (#172, merged
  2026-08-06): 27 findings at `:info`, one card per package — sol 17, rheos 8,
  terminal-ui 1, eta-mu 1 — each ending in that package raising both linters to
  `:error`. Start with terminal-ui: one finding, and it proves the mechanism.
- `agent-operating-standard` (P0, incoming) — session/turn discipline plus five
  tooling slices. Rides on PR #170, so neither the epic nor `AGENTS.md`'s new
  section is on `main` yet.
- `rheos-github-issue-projection` — GitHub Issues as a projection of canonical
  Rheos tasks (PR #176). Its natural parent epic,
  `rheos-ledger-authoritative-projections`, is still unmerged on #158.

### Blocked or deferred

- `eta-mu:knoxx-katamorph-cutover` (icebox) — by design; last.
- openplanner teardown — no epic yet. See below.

## The drift ledger

Duplicate copies of the same thing, and which one consumers actually use. This
table is the backlog for the cutover; it is not aspirational.

| Thing | Copies | Who consumes which |
|---|---|---|
| contract schema set | `katamorph.schema` (canon) · knoxx `open-hax.contracts.schema` · sol `law/contracts.cljs` · muse `dsl/schema.cljc` · eta-mu `contract_runtime_v2` | sol ✅ cut over. **knoxx references katamorph nowhere.** muse declares the dep, requires it nowhere. |
| `contract-runtime` **is katamorph, forked** | katamorph · standalone `contract-runtime` repo · `openplanner/packages/contract-runtime` | Same namespaces under a different prefix. katamorph has everything the fork has **plus `schema.cljs` and `policy/{eval,fulfillment,gate}`** — so the fork is strictly lesser. **knoxx builds the openplanner copy** (`backend/shadow-cljs.edn` → `../../contract-runtime/src/cljs`, staged in CI). Consequence: knoxx has no `ActorContract`, no `CapabilityContract`, and no policy evaluation — which is *why* it reinvented actor and credential handling. |
| `event-ledger` | standalone repo (44 files) · `openplanner/packages/event-ledger` (15 files) | Diverged; **standalone is ahead**. The openplanner copy is stale. |

The pattern is consistent: *extraction succeeded, adoption never happened.* Fix
adoption before extracting anything new.

## The shapes you probably need already exist

`katamorph/src/cljs/katamorph/schema.cljs` declares, among ~30 kinds:

`ContractId` `ToolId` `AgentSpec` `ActorCapSpec` `ActorContract` `RoleContract`
`CapabilityContract` `PolicyContract` `PolicyGateContract` `FulfillmentContract`
`StrategyContract` `ActionContract` `StoreContract` `TriggerContract`
`GeneratorContract` `UserSurface` `ContextPolicy` `SubAgentContract`

Two are directly load-bearing for the current knoxx work:

```clojure
ActorContract   :actor/id :actor/kind #{:agent :user :page}
                :actor/accounts {:discord {…} :bluesky {…} :twitch {…}}
                :actor/roles [keyword] :actor/capabilities [keyword]
                :actor/org :actor/default-agent :actor/sources

CapabilityContract  :cap/id keyword?  :cap/tools [any]  :cap/user-surfaces [UserSurface]
```

`:actor/accounts` already models per-platform identity for discord and bluesky —
the exact binding those tools need. And because `:cap/id` is a **keyword**,
namespacing gives hierarchy for free: `:discord/send` under `:cap/id :discord`.
A GitHub-style grant page — tick `discord`, get every discord tool — is a
convention over these shapes, not a new schema.

**So: adopt, do not design.** Anything that invents a third actor or capability
shape makes `eta-mu:capability-schema-reconciliation` harder, and that card is
the real blocker for hierarchical grants.

## openplanner teardown

openplanner is being dismantled. 19 packages: `agents axxium clients
contract-runtime event-ledger gardens graph openplanner-client
openplanner-protocols openplanner-sdk promptdb-core services signals stores
translations utils vexx workers`.

**Do not bulk-copy `packages/**` into eta-mu.** Two reasons:

1. `contract-runtime` and `event-ledger` are already standalone repos. A bulk
   copy creates a *third* copy of each — the exact failure this roadmap exists
   to stop.
2. `eta-mu/kanban/eta-mu-charter-v1.md` is explicit: *"This repo is not meant to
   be 'the place where every absorbed package goes forever.' It is meant to be
   the canonical home of that orchestration loop."*

The order that actually reduces copies:

1. **Repoint consumers at the standalone repos.** knoxx's shadow-cljs source
   path is the concrete one. Then delete the openplanner copies.
2. **Per package, decide a home before moving it** — eta-mu (orchestration
   loop), its own repo (a real product), or delete (superseded). Record the
   decision; do not move first and decide later.
3. **REST API**: barely used. The one live consumer is the CMS compatibility
   path in knoxx, which reaches a host OpenPlanner HTTP service on
   `host.docker.internal:7777` that production **does not run** — so the deploy
   health gate skips that check on every deploy. Retiring the CMS removes the
   last REST-only dependency. See `knoxx:knoxx-cms-contract-validation` and
   `knoxx:knoxx-arch-migration-cms-routes-retirement`.

### Postgres

Mostly gone, verified 2026-08-04:

- knoxx backend: **zero** postgres references in `package.json` or `src/cljs`.
- openplanner: only `axxium` still declares a pg dependency.
- The knoxx compose comment claiming pg/redis remain a dependency of
  `knoxx-ingestion` looks stale — no pg dep found there.

Remaining work is `axxium` and removing stale comments.

## Open questions

Not decisions yet. Flagged so they stop being re-derived.

1. **Is there a charter?** `eta-mu/kanban/eta-mu-charter-v1.md` exists — 257
   lines, `created_at: 2026-05-29` (this page said 2026-04-05 until 2026-08-06;
   the frontmatter disagrees), body says *"active working charter"*, frontmatter
   says **`status: rejected`** and `labels: [specs, migrated-spec]`. It also
   names `pi/` as the contract kernel's canonical home, which katamorph's
   extraction has superseded. So: a real draft, partly stale, formally
   rejected. It needs either a v2 or an explicit "superseded by this roadmap +
   the ownership table".
2. **Does muse belong inside the eta-mu monorepo?** Consistent with the
   ownership table — muse is a *role* (Keryx), explicitly not "a second package
   or competing source of contract truth", so a monorepo home costs nothing.
   Katamorph is different: it *is* the canon, so its separate repo and the
   `contract-redefinition-guard` are doing real change-control work. Submodule
   later is cosmetic; the guard is the substance.
3. **Is the split too fine?** Asked of axxium / event-ledger / katamorph, which
   feel like they do not work without each other. The declared dependencies say
   otherwise: `katamorph/deps.edn` names neither event-ledger nor axxium, and
   `event-ledger/deps.edn` names neither katamorph nor axxium. They are already
   independent; what couples them is **composition** — a system uses all three —
   and composition is where coupling belongs. Keeping them separate therefore
   costs nothing today. The test for merging any two is not "are they used
   together" but "has either been used *without* the other".

   The count this page carried until 2026-08-06 — *"143 files in eta-mu require
   it"* — does not survive checking. `git grep -l katamorph` finds **56** files,
   and 25 of those are kanban cards; files with an actual require or import are
   **6**, twelve of the remainder being prose in `packages/sol`. The conclusion
   is unchanged (eta-mu is the consumer, knoxx and openplanner are not) but the
   evidence is an order of magnitude smaller than stated, so the argument is
   weaker than it read. Re-derive before leaning on it:

   ```bash
   git grep -lE "\[katamorph|katamorph\." -- '*.cljs' '*.cljc' '*.clj' | wc -l
   ```
4. **Which packages are products?** `proxx`, `uxx`, `voxx-clj`, `epiphany`,
   `lakeraven`, `axxium` are already separate repos. openplanner's packages need
   the same call, one at a time.

## Keeping this honest

- Anything asserted here should be checkable in one command. If a claim goes
  stale, fix it or delete it — a roadmap nobody trusts is worse than none.
- The 2026-08-06 survey ran that rule against this page and three claims failed:
  a card listed In flight that was `done`, a katamorph file count off by ~24×,
  and a charter date the frontmatter contradicts. All three are corrected above
  with the correction left visible, because a page that quietly rewrites itself
  gives no signal about how often it drifts. Two survey dates apart, that is
  roughly one bad claim per month.
- **This file is not on `main`.** It rides on PR #167 together with the
  `CLAUDE.md` banner that points at it. Until that merges, a `main` checkout has
  no hub — check before citing it to someone.
- Satellites summarise; they do not restate. When they disagree with this file,
  this file is wrong until proven otherwise, because it is the one that gets
  read least often.
