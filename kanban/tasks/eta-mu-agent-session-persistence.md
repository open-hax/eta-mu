---
uuid: "eta-mu-agent-session-persistence"
title: "Eta-mu Agent — Session Persistence in the Turn Loop"
status: "breakdown"
priority: "P0"
labels: ["tasks", "cljs", "eta-mu", "session", "5sp"]
created_at: "2026-07-15T00:00:00Z"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
points: 5
category: "tasks"
---

# Eta-mu Agent — Session Persistence in the Turn Loop

> Parent epic: `kanban/epics/coding-agent-cljs-rewrite.md`
> Gap named in the epic's 2026-07-12 gap analysis, item 4.

## Purpose

`packages/eta-mu` has a `session` command, but the `agent` command's
turn-processor loop does not persist conversations. The published stable CLI
persists sessions and can resume them. This is a north-star parity gap.

## Scope

- Persist each turn (messages, tool calls/results, model/config) from the
  turn-processor loop via an `infra.session` writer in `packages/eta-mu`.
- Resume: `eta-mu agent --resume <session-id>` (or equivalent) reconstructs
  the llm-context from a stored session.
- Storage format decision (see open questions) recorded in the card before
  implementation starts.

## Definition of done

- [ ] Running `eta-mu agent` writes a session artifact; the `session` command
      lists it.
- [ ] A resumed session continues with full prior context, verified by an
      e2e test against the mock OpenAI server in `test-e2e`.
- [ ] Law schema for the persisted session shape; persistence I/O behind
      `extern.fs` only.
- [ ] `pnpm -C packages/eta-mu test`, `test:e2e`, and `lint:kondo` green.

## Open questions

- Storage format: new EDN-native session format, or the legacy session-store
  JSON shape? (Decision record dropped compatibility constraints — leaning EDN;
  `eta_mu.runtime.extern.edn` already exists in packages/runtime.)
- Storage location: `~/.eta-mu/sessions/`? XDG? Per-project?
- Does session resume need to replay tool side effects or only the transcript?

## Verification

```bash
pnpm -C packages/eta-mu test
pnpm --dir packages/eta-mu test:e2e
pnpm -C packages/eta-mu lint:kondo
```

---
2026-07-15 maintainer decision resolves this card's format question: EDN-native session format, no legacy session-store compatibility (settings.json-era formats are explicitly not preserved anywhere — settings become settings.edn, sessions become EDN). Remaining open: storage location and whether resume replays side effects (transcript-only is the working assumption).
---
