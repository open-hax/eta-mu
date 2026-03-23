# agent-runtime-state

Runtime state management and session continuity.

## Purpose

Defines how agent state persists across sessions:
- Runtime state registers
- Startup procedure
- Drift detection
- Session continuity
- Tick model

## Activation

Autoloaded at priority 85. Provides the operational state management layer.

## Protocol

1. On startup: load registers, compute hash, load specs, determine active phase
2. If drift detected: pause and investigate
3. Each tick: observe → update-state → plan → execute → verify → record
4. On termination: persist state, final commit, report status