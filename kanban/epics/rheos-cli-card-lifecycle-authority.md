---
category: "epics"
labels: "rheos, cli, lifecycle, docs, distribution, agents"
type: "epic"
write-id: "1786043108032-0.64h8dmq07poscejvpxg"
points: "13"
title: "Rheos CLI — full card lifecycle authority, docs, and agent distribution"
priority: "P0"
status: "breakdown"
uuid: "rheos-cli-card-lifecycle-authority"
created_at: "2026-07-30T00:00:00Z"
---

# Rheos CLI — full card lifecycle authority, docs, and agent distribution

## Outcome

The `rheos` CLI is the complete and only surface an operator or agent needs to
own a card from creation to terminal state. It can create cards, not just move
them; its documentation matches its actual verbs; card bodies stop being
free-form once breakdown is passed; and a web agent with no build toolchain can
obtain a working `rheos` in one unauthenticated download.

## Why now

Rheos already owns the *enforced* path for status moves (FSM-checked,
ledger-recorded, SSE-streamed) and the `eta-mu kanban` command is a thin bridge
that spawns it. But the lifecycle has holes at both ends, and the CLI is
undocumented enough that agents route around it:

- **No card creation.** The only creation verb is `create-subtask`, which
  requires a `--parent-uuid`. There is no way to create a root card, so every
  new epic or standalone task is authored by writing markdown by hand — the one
  operation `CLAUDE.md` tells agents not to do.
- **Creation is invisible to the ledger.** `tool-kanban-create-subtask`
  (`packages/rheos/src/rheos/backend/infra/agent_tools.cljs:198`) writes the file
  and registers a watcher write-id but emits **no** ledger event; `events.cljs`
  has no `emit-task-created!` at all. A card created through the CLI cannot be
  reconstructed from the event history, which contradicts the authority model in
  [[rheos-ledger-authoritative-projections]].
- **Frontmatter is not CLI-ownable.** `task-edit/update-frontmatter!` and
  `PATCH /api/task/:uuid/frontmatter` exist, but no CLI verb reaches them. The
  bridge in `packages/eta-mu/src/cljs/eta_mu/infra/cli/commands/kanban.cljs:93`
  literally errors with "frontmatter key not supported by Rheos … edit the
  markdown directly".
- **The help text is wrong.** Every usage line says `openhax-kanban`, a binary
  that does not exist; the installed bin is `rheos`. Agents copy the help output
  verbatim and it fails.
- **The CLI never fails.** Unknown commands, rejected transitions, and thrown
  tool errors all exit `0`. An unknown uuid prints a raw Node stack trace and
  still exits `0`, so no caller can branch on success.
- **Bodies drift after planning.** Nothing distinguishes a card being scoped
  from a card being worked. Post-breakdown edits silently rewrite agreed scope.
- **Web agents cannot install it.** `dist/cli.cjs` is a shadow-cljs
  `:node-script` bundle that top-level-`require`s `chokidar`, `fastify`,
  `@fastify/cors`, `@fastify/static`, and `@modelcontextprotocol/sdk` — so it
  fails with `Cannot find module 'chokidar'` outside the workspace. Building it
  from source needs Java 21 + shadow-cljs + a private-git-dep pnpm install.

## Delivery passes

1. **Create + close the verb set** — root card creation with a real
   `task-created` event, frontmatter and project verbs, machine-usable exit
   codes and `--json`.
2. **Lock the body** — bodies freeze on leaving breakdown; post-breakdown
   updates go through `comment`; bouncing back to breakdown re-opens them.
3. **Make it obtainable and legible** — accurate help, a full CLI reference, and
   an unauthenticated release archive with a stable `latest` URL.

## Constraints

- Every mutation keeps going through the existing chokepoints
  (`transition/move-task!`, `task-edit/*`) so CLI, HTTP, MCP, and UI cannot
  diverge. No new write path.
- Creation must consult the resolved FSM's `:initial-state`, not a hardcoded
  `"incoming"`.
- Any body-hash / checkpoint field must be the *same* mechanism
  [[rheos-markdown-projection-push-pull-sync]] introduces, not a second one.
- Enforcement is on Rheos's own write surfaces. Direct out-of-band file edits
  cannot be prevented, only reported.
- Backward compatibility: `create-subtask` and the legacy `eta-mu kanban`
  vocabulary keep working.

## Acceptance criteria

- A brand-new epic and a brand-new standalone task can both be created end to
  end with `rheos` alone, with no hand-authored markdown.
- Replaying the ledger onto an empty tasks dir reproduces cards created by the
  CLI, including their bodies.
- `rheos --help` names `rheos`, lists every implemented verb, and every listed
  verb runs.
- Every failure path exits non-zero with a single-line diagnostic on stderr and
  no stack trace.
- Editing a card body through a Rheos surface after breakdown is refused and
  points the caller at `rheos comment`.
- A container with only Node 22 and `curl` can fetch one URL, unpack it, and run
  `rheos read-board` successfully.

## Children

- [[rheos-cli-create-card]]
- [[rheos-cli-lifecycle-verb-completeness]]
- [[rheos-card-body-lock-after-breakdown]]
- [[rheos-cli-documentation-and-help]]
- [[rheos-cli-agent-release-archive]]

## Related

- [[rheos-ledger-authoritative-projections]] — creation events and body hashes
  are inputs to the authoritative fold; this epic must not invent a parallel
  authority.
- [[kanban-cli-status-validation-bug]] — same class of defect (a lifecycle
  surface accepting what the FSM forbids).

---
Triage 2026-07-30: carded from a read of packages/rheos/src (cli.cljs, agent_tools.cljs, task_edit.cljs, law/fsm.cljs, shape/content_parser.cljs), the built dist/cli.cjs behaviour, and open PRs #156-#162. Verified holes: no root-card create verb; no emit-task-created! in events.cljs so creation is invisible to the ledger; no CLI frontmatter verb (the eta-mu kanban bridge errors and tells callers to edit markdown by hand); all fourteen help usage lines name a nonexistent 'openhax-kanban' binary; every failure path exits 0 including a raw stack trace on unknown uuid; dist/cli.cjs top-level-requires chokidar/fastify/@fastify/*/@modelcontextprotocol-sdk so it cannot run outside the workspace (Cannot find module 'chokidar'). PR #156's sandbox bundle is an auth-gated 30-day Actions artifact of the whole workspace - complementary, not a substitute for a release-asset CLI archive. Body-lock policy (freeze on leaving breakdown, updates via comment) is owner-requested and carded as rheos-card-body-lock-after-breakdown.

Pass 1 and pass 3 (partly) landed 2026-07-30: rheos-cli-create-card, rheos-cli-lifecycle-verb-completeness, and rheos-cli-documentation-and-help are at testing. Verification: rheos 100 tests / 346 assertions green (was 70 tests), clj-kondo 0 warnings on src+test, full release build (server+cli+app) 0 warnings, eta-mu 165 tests / 360 assertions green after updating the bridge test that asserted the old throw-on-frontmatter behaviour. Epic acceptance criteria now met: a root epic and a standalone task are both creatable with rheos alone; help names rheos and every listed verb runs; every failure path exits non-zero with one stderr line and no stack trace. Still open: (a) ledger replay reconstructing a created card - the task-created event now carries uuid/title/card-type/status/parent/source-path/body, but the fold belongs to rheos-canonical-task-fold-and-snapshots; (b) rheos-card-body-lock-after-breakdown, which still has the open ready-gate question about whether a review bounce re-opens the body; (c) rheos-cli-agent-release-archive - note the triage correction recorded there, npm i -g @eta-mu/rheos already works and is now documented, so the archive is the no-registry fallback rather than the only fix. Promotion to review runs the promethean build gate (repo-wide pnpm build/lint/test) which has NOT been run; cards were left at testing rather than walked around that gate.

Root test gate was fixed as a prerequisite (it did not run rheos). package.json test now calls scripts/test.mjs, a new runner covering all 11 workspace suites with a summary and no early bail; it previously chained only eta-mu, terminal-ui, turn-processor, and kanban-legacy, silently excluding rheos, sol, extensions, protocols, chat-ui, and axxium. scripts/lint.mjs gained a clj-kondo step across all 11 CLJS packages; the lint gate previously ran only Biome, tsc, extension path validation, and a kanban frontmatter check, so the canonical language had zero static coverage. That exclusion was hiding two real defects in @open-hax/protocols: authenticate-success-test created a user with a password then authenticated without one and asserted success (it was asserting user.login.success against an actual user.login.failure - the implementation was correct, the test was wrong), and its test script ran node target/test.cjs with no compile step, so it executed whatever bundle was on disk. Both fixed; added authenticate-wrong-password-test for the branch that had no real coverage. protocols now 50 tests / 123 assertions green. NOT done: .github/workflows/main-pr-gate.yml has not been reconciled with scripts/test.mjs and may duplicate or diverge from it - worth its own card. @eta-mu/e2e stays out of the default test gate (own workflow) with the exclusion commented in the script rather than silent.

Board binding for the open Rheos CLI work, recorded 2026-08-06:

| PR | Branch | Child card | State |
|---|---|---|---|
| #167 | `feat/rheos-card-creation` | `rheos-cli-create-card` | review, security fix pushed, CI running |
| #168 | `feat/rheos-cli-exit-contract` | `rheos-cli-lifecycle-verb-completeness` | review, needs rebase on #167 |
| #169 | `docs/rheos-cli-reference` | `rheos-cli-documentation-and-help` | review, needs rebase on #168 |
| #158 | `feature/rheos-edn-config` | (carries its own epic + 5 cards, unmerged) | 89 behind main, CONFLICTING — triage |
| #176 | `rheos-github-issue-sync` | none — card gap, being created | bundle job failing |

Merge order is #167 → #168 → #169. Nothing in this epic merges out of stack order.

Board state after the #158 revival, 2026-08-06:

| PR | State | Notes |
|---|---|---|
| #167 | **merged** (5c5d507) | uuid path traversal + empty-frontmatter no-op fixed in review |
| #176 | **merged** | legacy workflow-scoping test retargeted at the Rheos workflow |
| #172 | **merged** | layer-boundary ratchet cards |
| #168 | ready, all 6 threads resolved | `rheos move` was broken for every card — `load-task-or-fail` passed the project map to `load-tasks`; also CLI writes mislabelled as `agent` in the ledger, `--limit` NaN, and `:default-project-id` ignored |
| #158 | **revived**, all 3 threads resolved | main merged (74 commits), config normalization moved to `shape.config`, symlink escape closed, watcher scoped to the card projection |
| #169 | unblocked by #158 | its EDN docs are now true — verified the built CLI loads `openhax.kanban.edn` and warns on the JSON mirror |

Merge order: #168 → #158 → #169.

Both #168 and #158 are MERGEABLE with zero unresolved threads and verified locally (rheos 101 and 107 tests respectively, clj-kondo 0/0, all release targets building). Neither can merge yet: GitHub Actions is degraded and jobs are failing at `Set up job` with 'Failed to resolve action download info' / Service Unavailable / Bad Gateway. No code failures.

Stack reconciled 2026-08-06 (second pass). #167 and #168 are on `main`; the remaining order is **#158 → #169**, unchanged in intent — #169 documents EDN config as preferred, which is only true once #158 lands.

Both remaining PRs had fallen back into CONFLICTING when main advanced. Both resolved and pushed:

**#169** — one conflict in `cli.cljs`: main still carried the hardcoded `openhax-kanban` help block that this PR exists to delete. Took the registry rendering, then verified the registry covers all 16 verbs the dispatch table actually handles before accepting it. rheos 110 tests / 403 assertions, kondo 0/0, 4 release targets clean, built CLI renders `rheos` in every usage line.

**#158** — a real reconciliation, not a side-pick. `load-tasks` was in direct tension: #158 made a project map a valid argument (to carry `:card-projection`), while #168 made a project map *throw*, because passing one had `readdir` fail, the collector swallow it, and `rheos move` report `unknown task` for cards on disk. Kept #158s capability and #168s fail-loud discipline: a map or a non-empty string is accepted, and anything resolving no tasks-dir throws `:kind :usage`. Mains guard test asserted the map is refused, so it was rewritten to guard the same hazard — the silent `[]` — under the new contract rather than deleted. Every caller still passes the string form; `source->project` resolves it back through the project registry so a configured projection still applies. rheos 116 tests / 329 assertions, kondo 0/0, built CLI loads the EDN board.

Blocking both: GitHub Actions is degraded, not the code. `main-lint` is a bare `echo` and it "failed" after 6m19s; CodeQL Analyze ran 1h8m and 1h24m before failing. Treat those as infrastructure until a completed run says otherwise.
---