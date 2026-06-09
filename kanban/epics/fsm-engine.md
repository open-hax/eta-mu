---
uuid: "fsm-engine"
title: "Config-Driven FSM Engine"
status: accepted
priority: P1
labels: ["epics", "cljs", "fsm", "kanban", "pluggable-checks"]
created_at: "2026-06-08T00:00:00Z"
source: "planning-session:2026-06-08"
points: 13
category: epics
---

# Config-Driven FSM Engine

## Purpose

Generic FSM engine that reads state/transition/check definitions from board config. Any board can define any workflow.

## Default FSM (6-state)

```
incoming → breakdown → ready → in_progress → review → done
```

### Transition checks

| Transition | Check | Description |
|---|---|---|
| incoming → breakdown | markdown-score | Heuristic: headers, objectives, acceptance criteria, code blocks |
| breakdown → ready | agent-review | Agent via sol, 4 metrics (consistency, clarity, completeness, conciseness) |
| ready → in_progress | wip-available | Target column has capacity |
| in_progress → review | build-gate | `npm run typecheck && npm run lint && npm run test` |
| review → done | code-review | Agent review via harness |

### Harness field

```yaml
harness: opencode|eta-mu|pi|claude|hermes|codex|other
session-id: "abc123"
```

Known harnesses get auto-verified. `other` gets a warning.

### Check types

| Type | Runtime |
|---|---|
| built-in | Engine (has-title?, wip-available?, always-allow?) |
| js | CLJS module loaded via shadow-cljs |
| agent | Calls sol |
| shell | Runs command |

### Markdown structure scorer

Char count default, `ITokenizer` protocol for pluggable tokenizers.

## Full promethean FSM (optional)

Boards opt in with `"fsm": "promethean"` — 14-state FSM from `promethean/docs/agile/process.md`.

## Constraints

- All code in CLJS
- `^:async`/`await` pattern (no js-await, no .then chains)
- Event ledger appends on every transition
