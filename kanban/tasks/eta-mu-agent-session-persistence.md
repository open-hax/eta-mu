---
category: "tasks"
labels: ["tasks", "cljs", "eta-mu", "session", "5sp"]
write-id: "1784237803484-0.lbf9gq71v6pztou252q"
points: "5"
source: "kanban/epics/coding-agent-cljs-rewrite.md"
title: "Eta-mu Agent — Session Persistence in the Turn Loop"
priority: "P0"
status: "review"
uuid: "eta-mu-agent-session-persistence"
created_at: "2026-07-15T00:00:00Z"
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

Breakdown 2026-07-16: format already decided (EDN-native, no legacy compat). Proposing defaults for the two remaining opens so this can pass the ready gate: (1) LOCATION — ~/.eta-mu/sessions/, one EDN file per session keyed by session-id, with a cwd field inside for per-project filtering (matches the settings.edn home under ~/.eta-mu/, avoids XDG branching for v1). (2) RESUME — transcript-only: rebuild llm-context from stored messages/tool results; never replay tool side effects. Slices within the 5sp: (a) law schema for the session artifact, (b) infra.session writer called from the turn-processor loop via extern.fs, (c) session list picks up written artifacts, (d) --resume flag reconstructing context, (e) e2e vs mock OpenAI server covering write+resume. Moving to ready; maintainer can veto the location default at review.

Scoped plan (2026-07-16, agent): baseline unit tests green (116/216). Slices in order: (a) eta-mu.law.session Malli schema for the EDN session artifact, (b) eta-mu.infra.session writer invoked from the agent turn loop, I/O behind extern.fs only, (c) session list reads ~/.eta-mu/sessions/*.edn, (d) --resume <id> rebuilds llm-context transcript-only, (e) e2e vs mock OpenAI covering write+resume. Defaults adopted from card: EDN-native, ~/.eta-mu/sessions/, transcript-only. Gates: pnpm -C packages/eta-mu test, test:e2e, lint:kondo.

Implementation complete (2026-07-16). Slices (a)-(e) delivered: law.session SessionArtifact schema; domain.session pure decisions; extern.os homedir boundary; infra.session create!/resume!/record-turn!/clear!/list-sessions (I/O behind extern.fs only); --resume flag (exact id or unique prefix); top-level 'session' command (list/show); e2e vs mock OpenAI proving write+resume+list. ANOMALY (discovery rule): the bare word 'session' was already claimed by the session-mycology command under 'git session reflect' — kept as-is; agent-session inspection lives in a new commands/sessions.cljs registered top-level as 'session'. Does not invalidate the card's DoD ('the session command lists it'). Behavior notes: ETA_MU_HOME env overrides ~/.eta-mu (test/e2e isolation hook); /clear now also clears the persisted transcript (deliberate); --system/--model on resume are per-run overrides — the artifact keeps its original config; error paths in 'agent' now exit 1 (previously exit 0 even on failure). Gates: 133 tests/262 assertions, kondo 0/0, e2e 4 tests/47 assertions — all green.

Code review (2026-07-16, subagent): no blockers, 2 should-fix both fixed. (1) Failure-persistence aligned: single-turn and piped now record user+[] on run-loop failure then rethrow, matching REPL/TUI. (2) REPL session-wiring now covered by two tests (per-turn persist; /clear clears artifact live+on-disk). Nits fixed: exit! 0 moved inside try tail (error paths exit 1 cleanly); ETA_MU_HOME='' treated as unset; read errors no longer misreported as EDN parse errors; write-artifact! is law-gated (invalid artifact is never persisted); agent docstring notes api-key/base-url are not persisted. Nits accepted with rationale: eager create! write kept (fail-fast on unwritable dir; empty sessions are honest list rows); js/Date+js/Math in infra and domain requiring extern.path match existing repo precedent (domain/receipt.cljs); --model/--system on resume stay per-run overrides (card-documented). Concurrency (whole-file rewrite, no lock) accepted for v1 — ids are per-process-unique; tmp+rename is the hardening when concurrent --resume of one id matters. Final gates: 135 tests/266 assertions, kondo 0/0, e2e 4/47 — all green.

Adversarial review wave 2 (opencode ultracode, 6 reviewers incl. cached, skeptic votes quorum 2). Findings against this card: 4 raw, 0 confirmed. Law-gate throw from record-turn! escaping REPL try/catch (1 non-refuting vote, 1 vote lost to parse error) — VERIFIED directly against code (repl.cljs:130, tui_repl.cljs, agent.cljs:48 call sites outside the run-loop try) and FIXED: persist-safe! wrapper logs and continues in all three hosts; regression test tui-repl-survives-persistence-failure-test reproduces the exact crash via a law-invalid session atom. Refuted (2-vote quorum): HOME="" homedir edge (nit), UTF-16 preview split (nit), sibling-package anomaly-log note (nit). Gates: 137 tests/271 assertions, kondo 0/0, e2e 4/47 — all green.
---
