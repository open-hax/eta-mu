---
uuid: "coding-agent-cljs-rewrite"
title: "Coding Agent Package CLJS Rewrite"
status: "in_progress"
priority: "P0"
labels: ["epics", "cljs", "rewrite", "legacy-ts", "coding-agent"]
created_at: "2026-06-15T00:00:00Z"
source: "user-request:2026-06-15"
points: 55
category: "epics"
---

# Coding Agent Package CLJS Rewrite

> Package: `packages/legacy/coding-agent` (`@open-hax/eta-mu-cli` / `eta-mu` binary)
> Current size: ~90,503 TS lines across 353 files
> Scope: agent session, tools, extensions, interactive/RPC modes, package manager, CLI

## Purpose

Rewrite the `eta-mu` coding-agent runtime into ClojureScript while keeping the `eta-mu` CLI binary and `@open-hax/eta-mu-cli` package contract intact. This epic consumes the work from `agent-cljs-rewrite` and `ai-cljs-rewrite`; it is the final large surface to migrate before `packages/legacy` can retire.

## Public compatibility surfaces

- Binary: `bin` field in `package.json` (`eta-mu`)
- Package exports: `src/index.ts`, `src/core/index.ts`
- Agent session: `src/core/agent-session.ts`, `src/core/agent-session-runtime.ts`
- Session manager: `src/core/session-manager.ts`
- Tools: `src/core/tools/*`
- Extensions: `src/core/extensions/*`
- Interactive TUI mode: `src/modes/interactive/*`
- RPC mode: `src/modes/rpc/*`
- Package manager: `src/core/package-manager.ts`
- Settings/auth: `src/core/settings-manager.ts`, `src/core/auth-storage.ts`
- Tests: `test/**/*.test.ts`

## Target namespace map

```text
eta_mu.coding.domain.*        session decisions, tool dispatch, mode routing
eta_mu.coding.shape.*         config↔session transforms, DTO compatibility
eta_mu.coding.law.*           Malli schemas for tools, sessions, extensions
eta_mu.coding.extern.*        FS, git, bash, clipboard, SDK, raw JS interop
eta_mu.coding.infra.*         session orchestration, extension runner, package manager
eta_mu.coding.cli.*           eta-mu binary facade and command routing
```

## Non-goals

- Do not rename the `eta-mu` binary or package.
- Do not redesign the extension API; preserve it behind the CLJS facade.
- Do not rewrite all example extensions; mark them as compatibility targets.

## Phases

### Phase 1 — Inventory and surface contract map

- Catalog `src/` clusters and classify into domain/shape/law/infra/extern/cli.
- Identify every public export and every tool/extension contract.
- Document interactive mode and RPC mode state machines.

### Phase 2 — Core domain and law

- Port session, tool, and extension domain logic to CLJS.
- Port Zod schemas to Malli in `law.*`.
- Add regression tests for session lifecycle and tool dispatch.

### Phase 3 — Extern adapters

- Create `extern.*` namespaces for FS, git, bash/child-process, clipboard, image conversion, OAuth.
- Add conversion regression tests for every adapter used by tests.

### Phase 4 — Infra orchestration

- Port session manager, extension runner, package manager, settings/auth to `infra.*`.
- Wire to `eta-mu-runtime` CLJS state/envelope primitives.

### Phase 5 — Mode and CLI parity

- Port interactive and RPC mode orchestration to CLJS.
- Keep `src/main.ts` and `src/cli.ts` as thin TS compatibility shells.
- Preserve command-line argument parsing and output behavior.

### Phase 6 — Cutover ratchet

- Replace TS modules in path-scoped commits after parity tests pass.
- Delete obsolete TS modules and examples in slices.
- Verify the `eta-mu` binary end-to-end.

## Acceptance criteria

- [ ] Full inventory classifies every source file, public export, and tool contract.
- [ ] `extern.*` adapters exist for all I/O boundaries with conversion tests.
- [ ] Core session/tool/extension logic runs in CLJS with Malli-guarded boundaries.
- [ ] Existing coding-agent test suite passes or explicit blockers are recorded.
- [ ] `eta-mu --version` and a representative command path run through CLJS runtime.
- [ ] TypeScript line count for `packages/legacy/coding-agent` decreases monotonically.
- [ ] `pnpm --filter @open-hax/eta-mu-cli test` passes.

## Verification gates

```bash
pnpm --filter @open-hax/eta-mu-cli test
pnpm --filter @open-hax/eta-mu-cli typecheck
node scripts/ts-line-count.mjs packages/legacy/coding-agent
pnpm --dir packages/eta-mu-runtime cljs:verify
```

## Dependencies

- `eta-mu-cljs-runtime-rewrite` (runtime core and boundary patterns)
- `eta-mu-cljs-rewrite-boundary-adapters` (shared extern conventions)
- `agent-cljs-rewrite` (agent-loop parity)
- `ai-cljs-rewrite` (provider parity)
- `tui-cljs-rewrite` (interactive mode parity)

---
## Scheduling review (2026-06-15)

- 2 tasks ready for breakdown: `coding-agent-cljs-rewrite-inventory-core` and `coding-agent-cljs-rewrite-inventory-modes-cli`.
- 12 tasks blocked: all implementation tasks depend on the two inventory tasks; many also depend on sibling epics `agent-cljs-rewrite`, `ai-cljs-rewrite`, `tui-cljs-rewrite`, and the in-progress core `boundary-adapters` task.
- Current bottleneck: completion of inventory tasks and cross-epic dependencies `agent-cljs-rewrite` / `ai-cljs-rewrite` / `tui-cljs-rewrite`.
- Concurrency: the two inventory tasks can run in parallel; afterwards, domain work (session, tools, extensions, messages/diagnostics) can proceed concurrently once agent-loop and provider models are available.
---

## Inventory review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `coding-agent-cljs-rewrite-inventory-core` and `coding-agent-cljs-rewrite-inventory-modes-cli` accepted; inventory docs `docs/coding-agent-cljs-rewrite-inventory-core.md` and `docs/coding-agent-cljs-rewrite-inventory-modes-cli.md` produced.

**Key findings from the inventory:**
- `packages/legacy/coding-agent` is the largest surface: ~90,503 TS lines across 353 files.
- Core inventory maps `src/core/*` and `src/utils/*` to `eta_mu.coding.{domain,shape,law,infra,extern,cli}.*`.
- Modes/CLI inventory maps 47 files across `src/modes/`, `src/cli/`, `src/cli.ts`, `src/main.ts`, and `src/bun/cli.ts`, plus theme assets.
- Heavy dependencies on `agent-cljs-rewrite` (`Agent`, `AgentEvent`, `AgentLoop`), `ai-cljs-rewrite` (`Message`, `Model`, providers), and `tui-cljs-rewrite` (interactive mode components, `Editor`, `Markdown`, `SelectList`, terminal externs).
- Raw JS interop surfaces: FS/git/bash/child-process, clipboard, image conversion, OAuth, SDK/model calls, extension loading (`@mariozechner/jiti`), package manager shelling out to `npm`/`git`.
- Tool and extension contract matrices are documented; TypeBox tool schemas must migrate to Malli.
- Interactive mode state machine and RPC JSONL protocol are documented.
- The `eta-mu` binary and `@open-hax/eta-mu-cli` package surface must remain intact.

**Updated scheduling after inventory:**
- Both inventory tasks → `review` (done).
- All implementation tasks remain `blocked` until agent-loop, provider, and TUI extern parity land.
- First unblocked slice after dependencies: pure law/schemas (`messages-diagnostics-law`, `domain-session-law`, `domain-tools-law`, `domain-extensions-law`) once agent and AI canonical models exist.

**Recommended next action:** Keep inventories in `review` pending human sign-off, and drive `eta-mu-cljs-rewrite-boundary-adapters`, `agent-cljs-rewrite`, `ai-cljs-rewrite-phase-2-canonical-model`, and `tui-cljs-rewrite-terminal-extern` to unblock implementation.

---
## FS/Git/Bash extern adapters review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `coding-agent-cljs-rewrite-extern-fs-git-bash` accepted and promoted to `done`.

**Delivered:**
- `packages/runtime/src/cljs/eta_mu/coding/extern/path.cljs` — path helpers.
- `packages/runtime/src/cljs/eta_mu/coding/extern/fs.cljs` — FS read/write/append/delete/copy/exists/list helpers.
- `packages/runtime/src/cljs/eta_mu/coding/extern/process_exec.cljs` — child-process execution with timeout/truncation.
- `packages/runtime/src/cljs/eta_mu/coding/extern/git.cljs` — git operation maps.
- `packages/runtime/src/cljs/eta_mu/coding/extern/shell.cljs` — shell config resolution.
- `packages/runtime/src/cljs/eta_mu/coding/extern/lockfile.cljs` — advisory locking.
- `packages/runtime/src/cljs/eta_mu/coding/extern/fs_watch.cljs` — fs.watch adapter.
- `packages/runtime/src/cljs/eta_mu/coding/infra/boundary.cljs` — coding-agent boundary inventory.
- Corresponding tests under `packages/runtime/test/cljs/eta_mu/coding/extern/` and `infra/`.

**Verification:**
- `pnpm --dir packages/runtime cljs:verify` passed (152 tests, 683 assertions, 0 failures).
- `pnpm --filter @open-hax/eta-mu-cli test` passed (1120 tests).
- Boundary scanner: 73 files checked, 19 extern namespaces, 0 violations.

**Updated scheduling after FS/git/bash adapters:**
- FS/git/bash adapters → `done`.
- `coding-agent-cljs-rewrite-infra-session-manager` is now unblocked (needs lockfile/fs consumers).
- `coding-agent-cljs-rewrite-domain-session-law` remains partially blocked on `AgentSession` class/agent-loop parity, but standalone session-store/session-cwd/diagnostics law is ready.

**Recommended next action:** Dispatch `coding-agent-cljs-rewrite-messages-diagnostics-law` and `coding-agent-cljs-rewrite-domain-tools-law` to continue clearing pure-domain slices while agent/AI/TUI externs are built.
---

## Session domain & law review (2026-06-15)

**Reviewer:** human supervisor (me)
**Verdict:** `coding-agent-cljs-rewrite-domain-session-law` accepted and promoted to `done`.

**Delivered:**
- `packages/runtime/src/cljs/eta_mu/coding/law/session.cljs` — Malli schemas for session entries, tree, context, cwd issues, diagnostics/output-guard/auth-guidance payloads.
- `packages/runtime/src/cljs/eta_mu/coding/domain/session.cljs` — pure session context/entry/migration/cwd functions.
- `packages/runtime/src/cljs/eta_mu/coding/domain/diagnostics.cljs` — pure diagnostics/output-guard/auth-guidance decisions.
- `packages/runtime/src/cljs/eta_mu/coding/shape/session.cljs` — CLJS↔JS DTO transforms.
- `packages/runtime/src/cljs/eta_mu/runtime/extern/edn.cljs` — EDN parse/emit adapter.
- Tests under `packages/runtime/test/cljs/eta_mu/coding/domain/session_test.cljs` and `diagnostics_test.cljs`.

**Verification:**
- `pnpm --dir packages/runtime cljs:verify` passed (152 tests, 683 assertions, 0 failures; boundary scanner clean).
- `pnpm test` passed across runtime, github, docs, kanban-legacy.

**Updated scheduling after session domain/law:**
- Session domain/law → `done` for the standalone slice.
- The `AgentSession` class, `agent-session-runtime`, and service factories remain blocked on `agent-cljs-rewrite` agent-loop parity and `ai-cljs-rewrite` provider adapters.

**Recommended next action:** Continue with `coding-agent-cljs-rewrite-messages-diagnostics-law` (already partially covered) and `coding-agent-cljs-rewrite-domain-tools-law` to clear more pure-domain slices.

---
Triage 2026-07-12: the priority epic. Phases 1-2 inventories hold; domain/law slices (session, tools, extensions) hold; fs/git/bash externs hold; session-manager infra holds. Known drift: messages-diagnostics-law was marked done but only the diagnostics slice exists — messages.ts port, output-guard, and message DTO shapes are missing (see card comment); recommend reopening or cutting a corrected follow-up card. Critical-path blockers to phases 4-6: agent-loop parity (agent-cljs-rewrite / turn-processor decision), provider streaming (ai-cljs-rewrite), and terminal-ui (only 1 of 4 scoped externs exists). Recommended dispatch order: 1) messages/output-guard slice (pure, unblocked), 2) SSE streaming extern, 3) terminal-ui stdin/keys/ansi externs, 4) infra phase 4 continuation.

Retargeted 2026-07-12 per decision: goal is 'npm install -g eta-mu' delivering a CLI equivalent to the published stable eta-mu, implemented in CLJS in packages/eta-mu (+ turn-processor, terminal-ui). Dropped constraints: TS interop, JSON config compatibility, legacy package/binary contract preservation, monotonic-TS-line-count ceremony. Once logic is in CLJS somewhere, moving it later is cheap. Gap analysis toward publish parity follows as a comment.

Gap analysis toward 'npm install -g eta-mu' (2026-07-12), in dependency order: 1) PUBLISH MECHANICS — fixed today: workspace deps moved to devDependencies (release bundle is self-contained, Node built-ins only); npm pack + global tarball install verified (eta-mu --version, help). Follow-up card: eta-mu-npm-publish-readiness (ready, P0). 2) AGENT TOOLS — the CLJS agent runs with :tools [] ; read/bash/edit/write do not exist. New card: eta-mu-agent-tools (ready, P0). This is the critical gap. 3) SSE STREAMING — ai-cljs-rewrite-phase-3-extern-openai (ready, P0, re-scoped). 4) SESSION PERSISTENCE in the agent flow — session command exists; agent loop does not persist; break down next. 5) TERMINAL UI — terminal-ui-cljs-package (breakdown, P1); REPL is the interim surface. Also fixed today: shared kondo-config config.edn unbalanced brace; axxium/event-ledger/extensions/katamorph/protocols lint clean again.

Board triage 2026-07-15 — epic promoted to the single live epic for the CLI effort; umbrella epic eta-mu-cljs-runtime-rewrite closed today.

STATE: agent tools DONE (read/bash/edit/write wired, e2e vs mock OpenAI server, 80/149 green). terminal-ui append-only REPL DONE (default TTY surface). npm pack/global-install mechanics fixed. All gates re-verified today: eta-mu 80/149 + kondo 0/0, terminal-ui 32/78, turn-processor 38/88, runtime cljs:verify green.

DISPATCH ORDER toward npm-install-g parity: 1) ai-cljs-rewrite-phase-3-extern-openai (retitled 'Eta-mu OpenAI Extern — SSE Streaming', ready, P0). 2) eta-mu-npm-publish-readiness (ready, P0). 3) eta-mu-agent-session-persistence (NEW, breakdown, P0). 4) terminal-ui-interactive-host (NEW, breakdown, P1). 5) package-naming-alignment (NEW, breakdown, P1). 6) coding-agent-cljs-rewrite-cutover-ratchet re-scoped to 'Legacy Retirement' (blocked on 1-4 + decisions below).

OPEN QUESTIONS needing maintainer decisions: (a) TOOLS — published stable ships find/grep/ls + edit-diff; is bash sufficient for v1 parity? (b) EXTENSIONS — is the extension system in the v1 parity target? The legacy-API runner exists in packages/runtime (eta_mu.coding.infra.extension) but the new CLI doesn't consume it; adopt, port, or descope. (c) PACKAGE MANAGER — extension install via npm/git: in scope? Undelivered slice of infra-package-settings-auth, deliberately not re-carded pending (b). (d) SETTINGS — packages/eta-mu has no settings/config file story; adopt the throw-on-parse/defaults-on-ENOENT policy from packages/runtime; EDN or JSON? (e) SESSION FORMAT + location (see new persistence card). (f) NAMING — one npm scope (@eta-mu vs @open-hax vs unscoped CLI) and folder=name alignment (see new naming card). (g) RUNTIME FATE — packages/runtime holds the eta_mu.coding.* legacy-compat work (extension runner, settings/auth, session law); merge into packages/eta-mu, keep as a dep, or retire? (h) PUBLISH — name/dist-tag strategy vs the currently published stable eta-mu (from eta-mu-npm-publish-readiness).

Also noted: 'eta-mu kanban comment' absorbs trailing flags into the comment text — CLI bug worth its own card.

Maintainer decision record 2026-07-15 (supersedes the 2026-07-12 'minimal parity' reading and answers the 2026-07-15 open questions):

TARGET REFRAMED — EXPERIENCE PARITY. This is a new application that uses the legacy CLI as its behavioral spec. Nothing is ported; behavior is re-implemented to match the experience: same TUI, same tools, same feel. Dropped without ceremony: anything whose only reason to exist was TypeScript mechanics, JSON config compatibility (settings.json -> settings.edn), and TS extension support. Rationale for full rewrite: TypeScript remaining mid-transition is itself a confusion cost — get everything into CLJS as fast as correctness allows.

Resolved questions: (a) TOOLS — full stable tool set is required: find, grep, ls join read/bash/edit/write; edit-diff behavior evaluated under edit parity. New card eta-mu-agent-tools-parity (P0). (b) EXTENSIONS — descoped from parity v1; if/when extensions return they are CLJS-only, no TS extension compat; the legacy-API runner in packages/runtime will NOT be adopted. (c) PACKAGE MANAGER — descoped with extensions. (d) SETTINGS — settings.edn in packages/eta-mu, adopting the throw-on-parse/defaults-on-ENOENT policy. (e) SESSIONS — EDN-native format, no legacy session compat (persistence card updated). (f) NAMING — scope is @eta-mu/* for the product family, CLI stays unscoped eta-mu; folder name == npm name; banned words in package/namespace names: runtime, core, utils, agent (except the user-facing 'eta-mu agent' command). (g) packages/runtime — DISSOLVE: audit consumers, move what the new stack needs into eta-mu/turn-processor, delete the rest (new card dissolve-runtime-package). (h) PUBLISH naming/dist-tag — still open.

Priority changes: terminal-ui-interactive-host P1 -> P0 (the full-screen TUI is parity, not a follow-on).
---
