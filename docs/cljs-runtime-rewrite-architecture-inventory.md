# Eta-mu CLJS Runtime Rewrite — Architecture Inventory

Date: 2026-06-19 (refreshed against source: reclassified axxium/extensions-e2e/protocols/katamorph, corrected file counts, recorded the `eta-mu-extensions` stub and `sol-staging`)
Parent epic: `kanban/epics/eta-mu-cljs-runtime-rewrite.md`
Kanban task: `kanban/tasks/eta-mu-cljs-rewrite-architecture-inventory.md`
Knowledge graph anchor: `AGENTS.md` → `kanban/epics/eta-mu-cljs-runtime-rewrite.md`
Reference style: `orgs/open-hax/openplanner/packages/agents/knoxx/AGENTS.md`

> Repo-shape note: since the original draft (2026-05-29) the workspace was reorganized. Legacy TypeScript packages moved under `packages/legacy/*`, new CLJS packages (`runtime`, `sol`, `Rheos`, `katamorph`, etc.) were added, and several planned packages have not yet landed. Path references below reflect the current layout.

## Purpose

This inventory turns “rewrite eta-mu in ClojureScript” into a path-scoped migration plan. It classifies existing eta-mu packages by public compatibility surface and target CLJS ownership category so implementation can proceed without a big-bang rewrite.

The design target is Knoxx-style organization, not Knoxx product behavior:

- `domain.*` for pure runtime decisions and lawful state transitions
- `shape.*` for pure data morphisms and DTO compatibility
- `law.*` for schemas, guards, validation, and evidence contracts
- `extern.*` for raw JavaScript, Node, browser, SDK, provider, and host-object boundaries
- `infra.*` for effect orchestration that consumes extern adapters and returns CLJS data
- no new `utils` junk drawers
- no raw JS interop outside named boundaries or tiny facade namespaces

## Source count snapshot

Source counts below exclude obvious build/output folders such as `node_modules`, `dist`, `target`, `.shadow-cljs`, `.build`, and `out`, and only count files under source-like roots such as `src`, `test`, `tests`, `lib`, `scripts`, `e2e`, `web`, and `externs`.

Total under `packages/**`: ~1789 TS/JS/CLJS source files (re-counted 2026-06-19 with the source-count command below; the earlier ~1620 figure predated subsequent CLJS growth).

> Scope note: the per-package row counts below sum to fewer than the repo-wide `find` total because the table only counts files under the explicitly listed source roots for each package. Configuration, resources, build scripts, and additional source-like paths outside those roots are intentionally excluded from the planning baseline so the inventory stays focused on rewrite-relevant code. `packages/sol-staging` (the unbuilt Knoxx-backend source tree, ~265 CLJS files) is also excluded from the planning sum because it has no `package.json` and is compiled only via `packages/sol`'s shadow-cljs config; it is listed separately at the bottom of the table.

| Path | Package | TS/JS | CLJ/CLJS/EDN | Source roots |
|---|---|---:|---:|---|
| `packages/legacy/agent` | `@open-hax/eta-mu-agent-core` | 10 | 0 | `src`, `test` |
| `packages/legacy/ai` | `@open-hax/eta-mu-ai` | 115 | 0 | `scripts`, `src`, `test` |
| `packages/legacy/coding-agent` | `@open-hax/eta-mu-cli` | 261 | 0 | `scripts`, `src`, `test`, `lib` |
| `packages/legacy/docs` | `@open-hax/eta-mu-docs` | 1 | 0 | `tests` |
| `packages/extensions` | `@open-hax/eta-mu-extensions` | 10 | 63 | `externs`, `lib`, `scripts`, `src` |
| `packages/extensions-e2e` | `@open-hax/eta-mu-extensions-e2e` | 0 | 3 | `src` |
| `packages/legacy/github` | `@open-hax/eta-mu-github` | 16 | 0 | `src`, `tests` |
| `packages/runtime` | `@open-hax/eta-mu-runtime` | 9 | 99 | `scripts`, `src`, `test`, `tests` |
| `packages/legacy/kanban` | `@open-hax/kanban-legacy` | 20 | 0 | `e2e`, `src`, `tests`, `web` |
| `packages/legacy/output-contract-gate` | `@open-hax/output-contract-gate` | 16 | 0 | `src` |
| `packages/legacy/publication-components` | `@open-hax/garden-publication-components` | 10 | 0 | `src` |
| `packages/legacy/tui` | `@open-hax/eta-mu-tui` | 52 | 0 | `src`, `test` |
| `packages/Rheos` | `@open-hax/rheos` | 1 | 45 | `src`, `test`, `scripts` |
| `packages/sol` | `@open-hax/sol` | 7 | 114 | `src`, `test`, `scripts` |
| `packages/katamorph` | `@open-hax/katamorph` | 0 | 32 | `src`, `test` |
| `packages/chat-ui` | `@open-hax/chat-ui` | 0 | 10 | `src`, `test` |
| `packages/event-ledger` | `@promethean-os/event-ledger` | 0 | 14 | `src`, `test` |
| `packages/protocols` | `@promethean-os/openplanner-protocols` | 0 | 34 | `src`, `test` |
| `packages/axxium` | `@open-hax/axxium` | 2 | 9 | `src`, `scripts` |
| `packages/mcp-contracts` | `@open-hax/mcp-contracts` | 0 | 1 | `src` |
| `packages/kanban-orchestrator` | `@open-hax/kanban-orchestrator` | 0 | 5 | `contracts` (EDN) |
| `packages/kondo-config` | `@open-hax/kondo-config` | 0 | 0 | — (config + one `.clj` hook) |
| `packages/tsconfig` | `@eta-mu/tsconfig` | 0 | 0 | — |
| `packages/eta-mu-extensions` | — (STALE STUB) | 0 | 1 | — (only `kanban/.events/ledger.edn`) |
| `packages/sol-staging` | — (no `package.json`) | 0 | ~265 | `src/cljs`, `test/cljs` |

Inventory caveat: `packages/runtime` now contains the CLJS shadow spine under `src/cljs` and `test/cljs`, while `packages/runtime/src` still contains `.js`, `.js.map`, and `.d.ts` siblings alongside `.ts` files. Runtime-core planning should decide whether those checked-in JS artifacts are intentional compatibility shims, stale generated files, or source artifacts that must be preserved during the facade phase.

Two non-package directories sit under `packages/` and are NOT workspace members:

- `packages/eta-mu-extensions` — **stale stub flagged for removal.** It has no `package.json` and no `src`; its only content is `kanban/.events/ledger.edn`. The canonical eta-mu-extensions code lives at `packages/extensions` (`@open-hax/eta-mu-extensions`). The path rename `packages/eta-mu-extensions` → `packages/extensions` already happened; this leftover directory should be deleted. Any doc or path reference pointing at `packages/eta-mu-extensions` is wrong and should be retargeted to `packages/extensions`.
- `packages/sol-staging` — the Knoxx-backend source tree (`knoxx.backend.*` under `src/cljs`/`test/cljs`, ~265 CLJS files). It has no `package.json` and no `shadow-cljs.edn`; it is built only through `packages/sol`'s shadow-cljs config. `packages/sol` (`@open-hax/sol`) is the canonical/active package.

## Public compatibility surfaces

| Path | Public surface | Rewrite role |
|---|---|---|
| `packages/legacy/coding-agent` | binaries `eta-mu`, `pi`; exports `.`, `./hooks`; main/types in `dist` | Primary CLI/runtime compatibility shell. Keep public API stable while routing small paths through CLJS exports. |
| `packages/legacy/ai` | binary `pi-ai`; many provider exports including Anthropic, Bedrock, Google, OpenAI, Azure, Mistral, Cloudflare | Provider/model boundary. Split pure provider registry/message transforms from SDK/HTTP extern adapters. |
| `packages/legacy/agent` | `dist/index.js` SDK-style runtime exports | Agent loop/session abstractions. Port pure loop decisions after `runtime`. |
| `packages/runtime` | export `.` and `./cljs`; state/envelope/planner modules | Best first pure CLJS parity slice. Small, central, low I/O. |
| `packages/legacy/output-contract-gate` | binary `output-contract-gate`; export `.` | Best second law/shape slice. Central to OPMF/output contracts and has focused tests. |
| `packages/extensions` | built-in OpenCode/pi extension manifests and generated JS glue | Already CLJS-heavy. Treat as boundary-cleanup and extern-adapter reference, not a fresh port. |
| `packages/legacy/tui` | `@open-hax/eta-mu-tui` library | Presentation/runtime shell. Defer until CLI/runtime state contracts stabilize. |
| `packages/legacy/kanban` | binary `openhax-kanban`; multiple board/content/task exports | Keep as operational support unless rewrite scope expands to the board tool itself. |
| `packages/sol` | `@open-hax/sol` | New CLJS-first eta-mu core (belief state, panels, mu candidates, action envelopes). Likely supersedes parts of `runtime` over time; treat as experimental category owner. |
| `packages/Rheos` | `@open-hax/rheos` | Kanban/web UI runtime and service shell. Contains both CLJS UI and small TS bootstraps. |
| `packages/katamorph` | `@open-hax/katamorph` | Contract/resource runtime ("data as interpreter"): manifest grammar, Malli schema registry, store protocol + memory/mongo registries, action interpreter, policy/condition/filter/driver registries, agent-turn utils. All-CLJS. Pure data + interpreter; the schema/manifest grammar is a `law.*`/`shape.*` reference, the interpreter is `domain.*`. |
| `packages/chat-ui` | `@open-hax/chat-ui` | Helix/React chat UI components (`ChatPanel`, `MessageBubble`, `ChatComposer`) + `IChatSession` protocol with sol/knoxx/mock backends. Browser `extern.*` reference. (Uses lilactown/helix exclusively — not Reagent.) |
| `packages/legacy/publication-components` | `@open-hax/garden-publication-components` | Web publication components. Defer until message shapes are stable. |
| `packages/event-ledger` | `@promethean-os/event-ledger` | Event ledger contracts and storage. Infra/extern boundary. |
[Omitted long matching line]
| `packages/axxium` | `@open-hax/axxium` | All-ClojureScript identity/auth kernel (shadow-cljs `:esm`/Node, Fastify + Postgres): password auth (bcryptjs), JWT/cookie sessions, actor read surface, single entity read endpoint. Ten `.cljs` sources under `src/cljs/` plus two helper `.mjs` files; **no `.ts`/`.tsx`**. Not a "mixed TS/CLJS utility" — classify as a full CLJS server. |
| `packages/mcp-contracts` | `@open-hax/mcp-contracts` | Generic CLJS loader that teaches a knoxx-style runtime to accept `:mcp-server` contracts (single `src/eta_mu/mcp_contracts.cljs`, consumed via source-path). `law.*`/`infra.*` candidate. |
| `packages/extensions-e2e` | `@open-hax/eta-mu-extensions-e2e` | **Active** shadow-cljs `:node-test` harness that compiles contract-runtime-v2 directly from `packages/extensions` (source-paths `../extensions/src`, `../extensions/lib`) and runs cljs.test E2E coverage of `evaluate-policies`/`evaluate-fulfillments`. Boundary test surface, not deferred. |
| `packages/kanban-orchestrator` | `@open-hax/kanban-orchestrator` | Kanban board orchestrator agent expressed as contract **data only** (agent/role/capability/actor + `rheos-kanban` MCP-server EDN under `contracts/`). Loaded by a knoxx-style runtime; no build/test scripts. Host-config surface, not a port target. |
| `~/.agents/skills/*` (not a workspace package) | Agent skill manifests (`SKILL.md`, `CONTRACT.edn`) loaded by the harness | Runtime protocol surface. Classify as `extern.runtime` host-boundary configuration, not a package to port. |

## Target ownership map

| Source cluster | Target CLJS owner | Notes |
|---|---|---|
| `packages/runtime/src/envelope.ts` | `eta_mu.runtime.shape.envelope`, `eta_mu.runtime.law.envelope` | Pure data, schema, and compatibility transforms. |
| `packages/runtime/src/state.ts` | `eta_mu.runtime.domain.state`, `eta_mu.runtime.law.state` | State transitions should be category/law explicit. |
| `packages/runtime/src/planner.ts` | `eta_mu.runtime.domain.planner` | Pure planning decisions first; defer effect execution. |
| `packages/legacy/output-contract-gate/src/*.ts` | `eta_mu.runtime.law.output_contract`, `eta_mu.runtime.shape.markdown`, `eta_mu.runtime.shape.edn` | Keep CLI I/O in `infra.cli`/`extern.fs`; schemas and validation stay pure. |
| `packages/legacy/coding-agent/src/core/messages.ts` | `eta_mu.runtime.domain.message`, `eta_mu.runtime.shape.message`, `eta_mu.runtime.law.message` | First bridge into CLI session compatibility. Include text/image/audio content parts. |
| `packages/legacy/coding-agent/src/core/agent-session*.ts` | `eta_mu.runtime.domain.session`, `eta_mu.runtime.infra.session` | Pure session decisions first; persistence and process boundaries later. |
| `packages/legacy/coding-agent/src/core/model-*.ts` | `eta_mu.runtime.domain.model`, `eta_mu.runtime.law.model`, `eta_mu.runtime.infra.provider` | Keep provider registry data separate from SDK calls. |
| `packages/legacy/coding-agent/src/utils/git.ts`, `exec.ts`, `child-process.ts`, FS/image helpers | `eta_mu.runtime.extern.git`, `eta_mu.runtime.extern.process`, `eta_mu.runtime.extern.fs`, `eta_mu.runtime.extern.image` | Raw host APIs must not enter domain/shape/law. |
| `packages/legacy/ai/src/providers/**` | `eta_mu.runtime.extern.provider.*`, `eta_mu.runtime.infra.provider.*` | One named adapter per provider boundary; pure transforms move to shape/domain. |
| `packages/extensions/src/eta_mu/extensions/**` | `eta_mu.runtime.extern.opencode`, `eta_mu.runtime.infra.tools.*`, `eta_mu.runtime.law.contract_runtime.*` | Existing CLJS code has useful behavior but raw JS interop must be fenced. |
| `packages/legacy/tui/src/**` | `eta_mu.runtime.tui.*`, `eta_mu.runtime.extern.terminal` | Presentation layer should consume stable runtime maps. |
| `packages/legacy/publication-components/src/**` and `packages/chat-ui/src/**` | `eta_mu.runtime.web.*`, `eta_mu.runtime.extern.browser.*` | Browser interop should be named and localized. |
| `packages/sol/src/**` | `eta_mu.sol.domain.*`, `eta_mu.sol.shape.*`, `eta_mu.sol.law.*` | New CLJS-first core. Coordinate with `runtime` to avoid duplicate category ownership. |
| `packages/katamorph/src/**` | `eta_mu.runtime.shape.*` or `eta_mu.sol.shape.*` | Pure data morphisms; assign to the domain that consumes them. |
| `packages/protocols/src/**` | `eta_mu.runtime.law.*` | Protocol schemas are law/contract candidates. |
| `~/.agents/skills/*` | `eta_mu.runtime.extern.host_skill`, `eta_mu.runtime.infra.skill_loader` | Skill manifests are host configuration; the loader is infra, the contract parsing is law. |

## Deferred packages

The following packages are explicitly deferred from the first rewrite slices. They are either legacy support surfaces or not-yet-landed planned packages. (`packages/extensions-e2e` was previously listed here as deferred; it is now an active boundary test harness — see the public-compatibility table above — and has been removed from this list.)

| Package | Current location / status | Rationale for deferral |
|---|---|---|
| `mom` | Not present in current workspace. Historically absorbed from `pi-mono` as `@mariozechner/pi-mom` / `@open-hax/pi-mom`. | Not part of the current workspace layout. Revisit only if the package is re-absorbed or its functionality is reintroduced. |
| `eta-mu-github` | `packages/legacy/github` | Legacy GitHub automation/review gate. Depends on `runtime`, `ai`, and `cli`. Defer until core runtime parity is proven and provider/extern adapters are stable. |
| `eta-mu-docs` | `packages/legacy/docs` | Docs view/intake projection surface. Small and stable; defer until core message/session shapes are finalized so the projection contract does not churn. |
| `eta-mu-truth` | Planned; not yet landed (see `kanban/eta-mu-charter-v1.md`, `kanban/signal-extraction-foundation.md`) | Not implemented. Blocked on runtime core and truth-workbench design. |
| `presence-core` | Planned; not yet landed | Not implemented. Part of the eta-mu charter but has no source tree yet. |
| `signal-contracts` | Planned; not yet landed | Not implemented. Signal extraction foundation package; defer until signal-system contracts are stabilized. |
| `signal-radar-core` | Planned; not yet landed | Not implemented. Signal extraction foundation package; defer until radar core is stabilized. |
| `signal-source-utils` | Planned; not yet landed | Not implemented. Signal extraction foundation package; defer until source/url extraction contracts are stabilized. |
| `signal-watchlists` | Planned; not yet landed | Not implemented. Signal extraction foundation package; defer until watchlist normalization contracts are stabilized. |

## Boundary hotspot snapshot

Existing CLJS already contains raw JS interop. This is not wrong for current code, but the rewrite should classify it explicitly.

Observed hotspots:

- `packages/extensions/src/eta_mu/extensions/websearch_open_hax.cljs` uses `js/process.env`, `js/fetch`, `js/JSON`, `js/Promise`, `js/Buffer`, `#js`, `aget`.
- `packages/extensions/src/eta_mu/extensions/opencode_global_instructions.cljs` uses filesystem/process/global state, `js/JSON`, `clj->js`, `js->clj`, `aget`, `aset`, `js/Array.from`.
- `packages/extensions/src/eta_mu/contracts/core.cljs` uses MarkdownIt JS token objects through `js/Reflect`, `js/Array.from`, `aget`.
- `packages/chat-ui/src/**` and `packages/Rheos/src/**` use browser globals, React DOM, WebSocket, localStorage, history, JSON parsing, and environment/global config.

Target handling:

- Node and provider interop goes under named `eta_mu.runtime.extern.*` adapters.
- Browser interop goes under named `eta_mu.runtime.extern.browser.*` adapters.
- OpenCode/pi host interop goes under `eta_mu.runtime.extern.opencode` or more specific host-boundary adapters.
- MarkdownIt token access gets an adapter or opaque-handle parser boundary before law/shape code consumes it.

## First three parity slices

### Slice 1 — `packages/runtime` pure CLJS ESM facade

Why first:

- Smallest central package with state/envelope/planner semantics.
- Low I/O surface.
- Good place to prove `shadow-cljs :esm` exports and Node import smoke tests.

Target categories:

- `eta_mu.runtime.domain.state`
- `eta_mu.runtime.domain.planner`
- `eta_mu.runtime.shape.envelope`
- `eta_mu.runtime.law.envelope`

Verification:

```bash
pnpm --dir packages/runtime test
pnpm --dir packages/runtime typecheck
pnpm --dir packages/runtime cljs:verify
pnpm --dir packages/runtime cljs:smoke
```

### Slice 2 — `packages/legacy/output-contract-gate` law/shape port

Why second:

- Core to the OPMF/output-contract runtime already active in this workspace.
- Naturally maps to `law.*` and `shape.*`.
- Has focused tests around EDN, markdown, validation, and repair.

Target categories:

- `eta_mu.runtime.law.output_contract`
- `eta_mu.runtime.shape.edn`
- `eta_mu.runtime.shape.markdown`
- `eta_mu.runtime.cli.output_contract_gate`
- `eta_mu.runtime.extern.fs` for CLI file I/O only

Verification:

```bash
pnpm --dir packages/legacy/output-contract-gate test
pnpm --dir packages/legacy/output-contract-gate typecheck
pnpm --dir packages/runtime cljs:verify
```

### Slice 3 — `packages/legacy/coding-agent` message/content/session core bridge

Why third:

- This starts replacing the actual `eta-mu`/`pi` runtime without touching every provider, TUI, and filesystem boundary at once.
- Message/content/session shapes are the durable contract under CLI, TUI, web UI, provider adapters, and extension tools.
- This is where text/image/audio content-part extensibility should become explicit.

Target categories:

- `eta_mu.runtime.domain.message`
- `eta_mu.runtime.domain.session`
- `eta_mu.runtime.shape.message`
- `eta_mu.runtime.shape.content_part`
- `eta_mu.runtime.law.message`
- `eta_mu.runtime.law.session`

Verification:

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --dir packages/runtime cljs:verify
```

## Later migration lanes

### Provider/model lane

Owner categories:

- `domain.model`
- `law.model`
- `shape.provider_request`
- `extern.provider.openai`
- `extern.provider.anthropic`
- `extern.provider.google`
- `extern.provider.bedrock`
- `extern.provider.proxx`

Rule: provider SDK/native payloads never cross into domain/law; they are decoded to CLJS maps at the adapter edge.

### CLI/runtime lane

Owner categories:

- `cli.args`
- `cli.commands.*`
- `infra.session`
- `infra.tool_execution`
- `extern.process`
- `extern.fs`
- `extern.git`

Rule: the CLI can remain a JS wrapper until each command path has parity evidence.

### Extension-tool lane

Owner categories:

- `infra.tools.apply_patch`
- `infra.tools.receipt_river`
- `infra.tools.session_mycology`
- `infra.tools.graph_memory`
- `infra.tools.websearch`
- `law.contract_runtime`
- `extern.opencode`
- `extern.http`
- `extern.fs`

Rule: custom tools should remain plain maps with `:execute` functions; no OO builders.

### TUI/web lane

Owner categories:

- `tui.components.*`
- `tui.state`
- `extern.terminal`
- `web.state`
- `web.components.*`
- `extern.browser.*`

Rule: UI layers consume stable runtime maps and should not define provider/session contract meaning.

## Verification baseline for remaining implementation

Baseline recorded 2026-06-16 against commit `1809efd`. Run these before each parity slice and record current failures instead of treating historical failures as rewrite failures.

### Source-count baseline

```bash
find packages \( -path '*/node_modules' -o -path '*/dist' -o -path '*/dist-cljs' -o -path '*/target' -o -path '*/.shadow-cljs' -o -path '*/.build' -o -path '*/out' \) -prune -o -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.mjs' -o -name '*.cjs' -o -name '*.cljs' -o -name '*.cljc' -o -name '*.clj' \) -print | wc -l
# => 1789 (2026-06-19; was 1620 at the 2026-06-16 baseline)
```

(The original command also referenced `services/`, which no longer exists in this workspace.)

### Per-package test/typecheck baseline

| Command | Result |
|---|---|
| `pnpm --dir packages/runtime test` | 6 TS tests passed |
| `pnpm --dir packages/runtime typecheck` | Clean |
| `pnpm --dir packages/runtime cljs:verify` | 152 CLJS tests, 683 assertions, 0 failures; smoke OK; boundary check 73 namespaces, 19 extern |
| `pnpm --dir packages/legacy/output-contract-gate test` | 10 Node tests passed |
| `pnpm --dir packages/legacy/output-contract-gate typecheck` | Clean |
| `pnpm --filter @open-hax/eta-mu-cli test` | 110 test files passed, 7 skipped; 1120 tests passed, 47 skipped |
| `pnpm -C packages/extensions test` | 72 CLJS tests, 195 assertions, 0 failures |
| `pnpm test` (root) | runtime 6 passed; github 19 passed; docs 2 passed; kanban-legacy 14 passed |

### Lint gate baseline

```bash
pnpm lint
```

Result: **FAIL** (exit code 1).

- Biome lint/format: passed (4 files checked; `biome.json` globs are stale and only cover a tiny subset of moved code).
- TypeScript typecheck: **failed** with one pre-existing error:
  - `packages/legacy/github/src/pi-agent.ts:75` — `ResourceLoader` is missing `setSystemPrompt` and `setAppendSystemPrompt`.
- CLJS boundary check: passed (`{"ok":true,"checked":73,"extern":19}`).
- Extension path validation: passed (15 valid, 0 missing).
- Kanban markdown validation: passed.

This type error is recorded as a historical baseline, not a rewrite regression. It is tracked separately in `kanban/tasks/monorepo-reorg-biome-lint-coverage.md`.

## Open decisions

1. Public artifact strategy: whether npm packages should expose compiled CLJS directly or keep JS wrappers around compiled CLJS exports during transition.
2. Generated artifacts: whether checked-in `.js`/`.d.ts` siblings in `packages/runtime/src` are intentionally source-compatible files.
3. Boundary gate expansion: whether the first `packages/runtime` scanner should grow into a repo-wide Knoxx-style `boundary:check`.
4. Runtime vs `sol` ownership: `packages/sol` is a newer CLJS-first core with overlapping semantics to `packages/runtime`. Decide which package owns the canonical `domain.state`/`domain.planner` categories before both diverge.

## Recommended next planning move

Proceed to `eta-mu-cljs-rewrite-runtime-core` after human review of this inventory and the merged shadow-spine PRs. The least risky implementation choice remains to expand pure CLJS runtime data contracts inside `packages/runtime` (or resolve ownership with `packages/sol`) before touching `packages/legacy/coding-agent` or provider SDK code.

## Decision record (2026-07-12) — simplification directives

Recorded from direct maintainer decisions; these supersede earlier open questions
and the original package mapping where they conflict.

1. **No standalone agent package.** `packages/turn-processor` owns the turn
   loop; there is no `eta_mu.agent.*` package and no plan for one. "The agent"
   is the composition of CLI + turn-processor + externs, not a module.
   `agent-cljs-rewrite` and its phase cards are iceboxed.
2. **No `packages/llm-providers`.** The maintainer routes providers through a
   proxy; the OpenAI-compatible client at
   `packages/eta-mu/src/cljs/eta_mu/extern/openai.cljs` is the LLM boundary.
   Provider-specific adapters (anthropic/bedrock/google/azure/codex) are out of
   scope. The `packages/legacy/ai` → `packages/llm-providers` mapping in this
   inventory is void. Remaining slice: SSE streaming on the existing client.
3. **`packages/eta-mu` owns the CLI.** Command-line parsing stays separate from
   any other primary concern; other packages are routed through it.
4. **Compatibility constraints dropped.** TS interop facades, JSON config
   compatibility, and legacy package/binary contract preservation are no longer
   goals. Getting logic into CLJS *somewhere* wins; relocation is cheap
   afterwards.
5. **North star:** `npm install -g eta-mu` produces a CLI equivalent to the
   published stable `eta-mu`. Publish blocker fixed 2026-07-12: workspace
   runtime deps moved to devDependencies (the shadow-cljs release bundle is
   self-contained, Node built-ins only); `npm pack` + global install from
   tarball verified.

Remaining parity gaps toward the north star: agent tools (read/bash/edit/write
are absent — `:tools []` in the CLJS agent command), SSE streaming, session
persistence in the agent flow, and the richer terminal UI
(`terminal-ui-cljs-package`).
