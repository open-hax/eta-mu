# @open-hax/eta-mu-extensions

Constitutional layer runtime extensions for cybernetic governance.

This package (`packages/extensions/`) is the canonical source for all eta-mu (ημ)
contract runtimes used by pi, opencode, and other agent frameworks. It supersedes
the stale `packages/eta-mu-extensions/` stub — do not add code there.

## What Lives Here

The full set of extensions is declared in [`manifest.edn`](./manifest.edn), which
is the single source of truth. As of this writing there are **15 extensions**, all
`:source :local` and `:tracked true`, each with a matching source file under
`src/eta_mu/extensions/`.

### Core Constitutional Primitives

- **receipt-river** (`receipt_river.cljs`) — Append-only receipts.log ledger for multi-step work
- **session-mycology** (`session_mycology.cljs`) — Per-turn retrospection with p-scores and skill spore incubation
- **contract-runtime** (`contract_runtime.cljs`) — Operational contract runtime v1 with fulfillment-score evaluation
- **contract-runtime-v2** (`contract_runtime_v2.cljs`) — Contract runtime v2: cwd-walk, policy gate, fulfillment notify/audit
- **opmf-contract-gate** (`opmf_contract_gate.cljs`) — Output contract gate enforcement with auto-repair (depends on `@open-hax/output-contract-gate`)

### Supporting Extensions

- **apply-patch** (`apply_patch.cljs`) — Codex-style multi-file patch tool
- **bootstrap** (`bootstrap.cljs`) — Session initialization and state recovery
- **chronos** (`chronos.cljs`) — Time tracking for contracting work
- **task-timing** (`task_timing.cljs`) — Task timing and performance tracking
- **custom-providers** (`custom_providers.cljs`) — Provider configuration extensions
- **graph-memory** (`graph_memory.cljs`) — Graph memory tools for OpenPlanner / Graph-Weaver
- **image-render** (`image_render.cljs`) — Image rendering for TUI
- **lisp-decomp-nudge** (`lisp_decomp_nudge.cljs`) — Nudges the agent to decompose large Lisp fns when a paren mismatch is detected
- **opencode-global-instructions** (`opencode_global_instructions.cljs`) — Global instruction injection for OpenCode
- **websearch-open-hax** (`websearch_open_hax.cljs`) — Web search via OpenHax proxy

> **Not extensions.** Some files under `src/eta_mu/extensions/` are helpers or
> tests, not manifest extensions: `prompt_section.cljs`, the `*_test.cljs` files,
> and the `contract_runtime_v2/` and `receipt_river/` support subdirectories.
>
> **No image-analysis extensions.** Earlier drafts of this README and the
> integration spec listed `analyze-image` and `manipulate-image` as ported (P1).
> They are **not implemented** — there is no manifest entry and no source file for
> either. `image-render` is the only image-related extension that exists.
>
> **`fork-tax` is a skill, not an extension.** Deterministic handoff snapshots are
> delivered through the `fork-tax` skill, not through this package's manifest.

### Macro Library

Located in `lib/eta_mu/macros/` (all `.cljc` so macros are available at CLJS
compile time):

- `state.cljc` (`eta-mu.macros.state`) — state management: `defstate`, `with-state-dir`, `with-state-files`, `with-global-state`
- `event.cljc` (`eta-mu.macros.event`) — event handlers: `defevents`, `on-session-lifecycle`, `on-turn-lifecycle`, `on-tool-lifecycle`
- `tool.cljc` (`eta-mu.macros.tool`) — tool definitions: `deftool`, `def-tool-schema`, `with-result`

## Architecture

```
extensions/
├── manifest.edn               # Extension manifest (provenance + deps) — source of truth
├── src/eta_mu/extensions/     # ClojureScript extension sources (one .cljs per extension)
├── lib/eta_mu/                # Core DSL + target generators
│   ├── core.cljc              # eta-mu.core extension-spec macros
│   ├── pi_target.cljs         # Pi code generation
│   ├── opencode_target.cljs   # OpenCode code generation
│   ├── opencode.cljs          # OpenCode runtime adapter
│   └── macros/                # Extension authoring macros
│       ├── state.cljc
│       ├── event.cljc
│       └── tool.cljc
├── scripts/                   # build.mjs, build-no-warnings.mjs, validators, smoke tests
├── shadow-cljs.edn            # Compilation config (drives all CLJS builds)
└── dist/                      # Compiled output (generated)
```

### Manifest

`manifest.edn` declares which extensions are installed and where they come from.
Each extension declares a source type:

- `:local` — a file on the local filesystem (git-tracked sources)
- `:github` — a file in a GitHub repository (fetched via `git archive`)
- `:npm` — a file inside an npm package (installed via `pnpm add`)

Every extension currently shipped is `:local`. The `:npm` and `:github` entries in
the manifest are **commented-out templates**, not active extensions. Extensions
with `:tracked true` are version-controlled in this repo.

The build script reads the manifest, compiles platform-neutral extension specs, and
materializes platform wrappers under `dist/`. Pi loads those wrappers from this
package's `package.json` → `pi.extensions` metadata; only OpenCode plugin targets
are synchronized into host config.

### Build System

Compilation is driven by `shadow-cljs.edn`, not by `manifest.edn`. The build
script:

1. Reads `manifest.edn` to discover extensions and their provenance
2. Resolves sources from local paths, GitHub repos, or npm packages
3. Generates wrapper files with `(defn init [pi] ...)`
4. Compiles via shadow-cljs to Node.js libraries
5. Materializes package-root targets (see `:targets` in the manifest):
   - `dist/runtime/<name>.cjs` — shared compiled runtime bundle
   - `dist/pi/cljs-<name>/index.ts` — Pi wrapper
   - `dist/opencode/<name>.mjs` — OpenCode wrapper
6. Leaves Pi registration to `package.json` → `pi.extensions`; it does **not**
   mutate `~/.pi/agent/settings.json` or `~/.ημ/agent/settings.json`.
7. Registers OpenCode package-root targets in host config
   (`~/.config/opencode/opencode.jsonc` → `plugin`)
8. Removes stale managed host copies from the old copy-deploy layout
9. Creates runtime state directories under `~/.ημ/state/`

## Usage

This is a pnpm workspace package. Run scripts with pnpm (never npm):

```bash
# Build all extensions (release build, no warnings)
pnpm -C packages/extensions run build

# Watch for changes during development
pnpm -C packages/extensions run watch

# Clean build artifacts
pnpm -C packages/extensions run clean

# Run tests (shadow-cljs node-test)
pnpm -C packages/extensions run test

# Lint
pnpm -C packages/extensions run lint:kondo
```

See [AGENTS.md](../../AGENTS.md) for the workspace-wide ClojureScript conventions
and construction order that all of these flows assume.

## Authoring an Extension

1. **Add the source.** Create `src/eta_mu/extensions/<name>.cljs`. The namespace
   should be `eta-mu.extensions.<name>` (underscores in the filename, dashes in the
   namespace).

2. **Use the macros** from `lib/eta_mu/macros/` to remove boilerplate. Require them
   as macros at compile time, e.g.:

   ```clojure
   (ns eta-mu.extensions.my-extension
     (:require-macros [eta-mu.macros.state :as state]
                      [eta-mu.macros.event :as event]
                      [eta-mu.macros.tool  :as tool]))
   ```

   - `state/defstate` generates the global state key + `get-state`/`set-state!`
     accessors (key form `__eta_mu_<name>_state__`, with `__pi_<name>_state__`
     backward-compat fallback). `state/with-state-dir` / `with-state-files` generate
     `STATE-DIR` / `EVENTS-FILE`-style path constants.
   - `event/defevents` registers only the lifecycle handlers you specify
     (`:on-session-start`, `:on-session-shutdown`, `:on-turn-start`,
     `:on-before-agent`, …).
   - `tool/deftool` / `tool/def-tool-schema` build the JSON tool parameter schema
     (object/properties/required) from a compact param map.

3. **Register the source for compilation.** Add a `:node-library` build entry to
   `shadow-cljs.edn`.

4. **Declare it in the manifest.** Add an entry to `manifest.edn` so `build.mjs`
   knows which platform targets to materialize. The header comment in `manifest.edn`
   documents these three steps inline.

5. **Build and verify.** Run `pnpm -C packages/extensions run build`, which runs
   `validate-extension-paths.mjs` as a `postbuild` step.

## The ημ Layer

Eta-mu (ημ) is the constitutional layer of our civilization of cybernetic
governance. Its primitives are designed to be:

- **Observable** — every action leaves a trace (Receipt River)
- **Retrospective** — learn from every turn (Session Mycology)
- **Contractual** — bound by explicit agreements (Contract Runtime / OPMF gate)
- **Portable** — state can be forked and continued elsewhere

## Symlink Convention

The canonical home is `~/.ημ`, a symlink to this package:

```
~/.ημ -> ~/devel/orgs/open-hax/eta-mu/packages/extensions/
```

This lets the build system find sources while keeping the repo as the source of
truth.

## Troubleshooting

### Missing Extension Paths

If you see errors like:

```
Failed to load extension ".../packages/extensions/dist/pi/cljs-lisp-decomp-nudge/index.ts": Extension path does not exist
```

the extension build output is missing or stale. To fix:

```bash
# Rebuild extensions
pnpm -C packages/extensions run build

# Validate all extension paths exist
pnpm -C packages/extensions run validate-paths

# Run CLI smoke test
pnpm -C packages/extensions run smoke
```

### Validation Scripts

- `validate-paths` — validates that all extension paths declared in `package.json`
  exist after build
- `smoke` — starts the built CLI with built-in extensions and fails on extension
  loading errors
- `postbuild` — runs path validation automatically after each build

## Integration Plan

See [`kanban/extension-integration-plan.md`](./kanban/extension-integration-plan.md)
for the integration plan. Note that the historical roadmap in that file references
unported TypeScript extensions and image extensions that were never landed; the
authoritative list of what is actually installed is always `manifest.edn`.

## License

GPL-3.0-or-later
