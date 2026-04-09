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

## Architecture

```
eta-mu-extensions/
├── src/eta_mu/extensions/   # ClojureScript extension sources
├── lib/eta_mu/              # Core DSL macros and target generators
├── scripts/build.mjs        # Build orchestrator
├── externs/                 # Closure compiler externs
└── .build/                  # Compiled output (generated)
```

### Build System

The build system:
1. Discovers `.cljs` extension sources
2. Generates wrapper files with `(defn init [pi] ...)`
3. Compiles via shadow-cljs to Node.js libraries
4. Deploys to:
   - `~/.pi/agent/extensions/cljs-<name>/` for pi
   - `~/.config/opencode/plugins/<name>/` for OpenCode

## Usage

```bash
# Build all extensions
npm run build

# Watch for changes
npm run watch

# Clean build artifacts
npm run clean
```

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
