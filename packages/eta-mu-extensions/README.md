# eta-mu-extensions

Constitutional layer runtime extensions for cybernetic governance.

This package is the canonical source for all eta-mu (ημ) contract runtimes used by pi, opencode, and other agent frameworks.

## What Lives Here

### Core Constitutional Primitives

- **receipt-river** - Append-only receipts.log ledger for multi-step work
- **session-mycology** - Per-turn retrospection with p-scores and skill spore incubation
- **contract-runtime** - Operational contract runtime with fulfillment-score evaluation
- **fork-tax** - Deterministic handoff snapshots for git-based state persistence

### Supporting Extensions

- **bootstrap** - Session initialization and state recovery
- **chronos** - Time tracking for contracting work
- **custom-providers** - Provider configuration extensions
- **image-render** - Image rendering for TUI
- **opencode-global-instructions** - Global instruction injection for OpenCode
- **opmf-contract-gate** - Output contract gate enforcement
- **task-timing** - Task timing and performance tracking
- **websearch-open-hax** - Web search via OpenHax proxy

### New Extensions (P1 - Image Processing)

- **analyze-image** - Contract-based image analysis with vision models
- **manipulate-image** - Image operations (crop, resize, pad, grayscale, blur)

### Macro Library

Located in `lib/eta_mu/macros/`:
- `state.cljc` - State management macros (defstate, with-state-dir)
- `event.cljc` - Event handler macros (defevents, on-session-lifecycle)
- `tool.cljc` - Tool definition macros (deftool, def-tool-schema)

## Architecture

```
eta-mu-extensions/
├── manifest.edn             # Extension manifest (provenance + deps)
├── src/eta_mu/extensions/   # ClojureScript extension sources
├── lib/eta_mu/              # Core DSL macros and target generators
│   ├── core.cljc           # Extension DSL macros
│   ├── pi_target.cljs      # Pi code generation
│   ├── opencode_target.cljs # OpenCode code generation
│   └── macros/             # Utility macros
│       ├── state.cljc       # State management
│       ├── event.cljc       # Event handlers
│       └── tool.cljc        # Tool schemas
├── scripts/build.mjs        # Manifest-driven build orchestrator
├── externs/                 # Closure compiler externs
└── .build/                  # Compiled output (generated)
```

### Manifest

The `manifest.edn` file is the single source of truth for what extensions
are installed and where they come from. Each extension declares a source type:

- `:local` — a file on the local filesystem (git-tracked sources)
- `:github` — a file in a GitHub repository (fetched via `git archive`)
- `:npm` — a file inside an npm package (installed via `pnpm add`)

The build script reads the manifest, resolves all sources into `~/.ημ/src/`,
then compiles and deploys. Extensions with `:tracked true` are version-controlled
in this git repo.

### Build System

The build system:
1. Reads `manifest.edn` to discover extensions and their provenance
2. Resolves sources from local paths, GitHub repos, or npm packages
3. Generates wrapper files with `(defn init [pi] ...)`
4. Compiles via shadow-cljs to Node.js libraries
5. Deploys to:
   - `~/.pi/agent/extensions/cljs-<name>/` for pi
   - `~/.config/opencode/plugins/<name>/` for OpenCode
6. Creates runtime state directories under `~/.ημ/state/`

## Usage

```bash
# Build all extensions
npm run build

# Watch for changes
npm run watch

# Clean build artifacts
npm run clean
```

## Integration Plan

See `spec/extension-integration-plan.md` for details on porting remaining TypeScript extensions.

### Migration Status

| Extension | Language | Lines | Status |
|-----------|----------|-------|--------|
| receipt-river | CLJS | 23,868 | ✅ Ported |
| session-mycology | CLJS | 30,152 | ✅ Ported |
| contract-runtime | CLJS | 18,197 | ✅ Ported |
| analyze-image | CLJS | ~350 | ✅ Ported (P1) |
| manipulate-image | CLJS | ~300 | ✅ Ported (P1) |
| apply-patch | TS | 799 | 📋 P2 - Spec ready |
| desktop-ops | TS | 705 | 📋 P2 - Spec ready |
| webpage-markdown | TS | 758 | 📋 P3 - Spec ready |
| skill-graph-aco | TS | 1,400 | 📋 P3 - Spec ready |

## The ημ Layer

Eta-mu (ημ) is the constitutional layer of our civilization of cybernetic governance. It provides:

- **Receipt River** - Immutable audit trail for agent decisions
- **Session Mycology** - Learning from friction, incubating reusable skills
- **Contract Runtime** - Evaluating contract fulfillment against live context
- **Fork Tax** - Paying the tax of forking: deterministic snapshots for handoffs

These primitives are designed to be:
- **Observable** - Every action leaves a trace
- **Retrospective** - Learn from every turn
- **Contractual** - Bound by explicit agreements
- **Portable** - State can be forked and continued elsewhere

## Symlink Convention

The canonical home is `~/.ημ` which should be a symlink to this package:

```
~/.ημ -> ~/devel/orgs/open-hax/eta-mu/packages/eta-mu-extensions/
```

This allows the build system to find sources while keeping the repo as the source of truth.

## License

GPL-3.0-or-later
