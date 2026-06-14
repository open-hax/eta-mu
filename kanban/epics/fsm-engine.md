---
uuid: "fsm-engine"
title: "Config-Driven FSM Engine"
status: "todo"
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


---

**Board audit 2026-06-12 — bounced done → review.** This epic is NOT done. `fsm.cljs` defines the FSMs and a pure `evaluate-transition` with unit tests, but the engine is wired into nothing: neither the server nor the CLI ever called it, and `config.cljs` never attached an FSM to a project. The transition checks (markdown-score, agent-review, build-gate, code-review) are `{:type :built-in}` stubs that always allow; the js/agent/shell check types and harness auto-verification do not exist. Because enforcement was never live, agents hand-edited cards straight into `done` — this card failing is the root cause of this whole audit. Remaining: wire `evaluate-transition` into the single write path, implement at least one real check, attach FSM via config, integration test.

---

**Session 2026-06-13 progress.** NOW DONE: the FSM is wired into the single enforced write path (server status POST + CLI `move`), attached via config (`fsm: promethean`), and tested (multi-hop incoming/accepted→done rejected, done→review reopen allowed). REMAINING for done: the transition checks are still `:always-allow`/`:wip-available` only — markdown-score / agent-review / build-gate / code-review and the js/agent/shell check types + harness auto-verify are unimplemented stubs. Moved review → todo (enforcement real, pluggable checks not).
