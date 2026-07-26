---
category: "tasks"
labels: ["tasks", "sol", "turn-processor", "rheos", "ultra", "cljs", "pr-142", "3sp"]
write-id: "1785025865142-0.zaanfwevam5m5w603r"
points: "3"
source: "Codex/CodeRabbit review on PR #142"
title: "PR #142: resolve remaining review findings and land the Sol cutover"
priority: "P1"
status: "in_progress"
uuid: "pr-142-review-should-fix-batch"
created_at: "2026-07-25T00:00:00Z"
---

# PR #142: resolve remaining review findings and land the Sol cutover

Closeout of PR #142 (`device/stealth` → `main`, "finish Sol cutover and contract
adoption groundwork"). The PR went through four rounds of automated review from
Codex and CodeRabbit; six fix commits (`9653ffc`…`03eeab1`) already landed on the
branch. Both review bots then hit their usage limits, so the remainder must be
closed out by hand.

## Scope

All four CI checks pass and the `main` ruleset requires zero approving reviews.
The single merge blocker is `required_conversation_resolution`: 15 of 28 review
threads are unresolved. Verification of each open thread against `03eeab1` found
14 already fixed in code and one (rheos static assets) only half-fixed.

1. **Abort guard on the steering/follow-up continuation** —
   `packages/turn-processor/.../infra/loop.cljs`. `signal-aborted?` guards the
   post-stream and post-tool-batch paths, but both steering and follow-up
   `(recur false)` paths are unguarded, so an abort landing while those queues
   drain still costs one more provider stream.
2. **Rheos static assets** — the `files` allowlist now ships `resources/public`,
   but `http_server.cljs` still derives both static roots from `process.cwd()`,
   and `dist/web/js` is never built (`build` runs only `server cli`, not `app`).
3. **Review-body code nits** — `ultra.bb` commit diagnostic reads the un-dereffed
   process record; `kanban_search_tasks` MCP schema omits the `domain`/`org`/
   `tier`/`where` filters that `compose-flags` accepts; `stream-message-end!`
   compares only the keyword `:assistant` role; duplicate `resolve-server-path`
   in `sol.cljs`; a `|| true` grep assertion that never fails; a test fixture
   using a bare string `:content`.
4. **Kanban card doc hygiene** — setext→ATX headings, `@open-hax/sol` →
   `@eta-mu/sol` in verification commands, status-vs-evidence reconciliation,
   stale notes.
5. **Thread closeout** — reply to and resolve all 15 open threads, then merge.

## Definition of done

- [x] Steering/follow-up abort guard landed with a covering loop test.
- [x] Rheos static roots resolve package-relative; `app` target in the build.
- [x] Review-body code nits fixed.
- [x] Kanban card doc hygiene swept.
- [x] Follow-up cards filed for out-of-scope residues.
- [x] Gates green: eta-mu, turn-processor, sol, rheos, extensions, `ultra_test.bb`.
- [x] All review threads replied to and resolved; 0 unresolved remain (20 across
      two waves — 15 initially, plus 5 from CodeRabbit's post-quota-reset wave).
- [x] PR #142 merged into `main` as merge commit `1656927`.

## Not in scope (carded separately)

- `ultra.bb` pre-dispatch `card-fsm!` hops discard their return values.
- `ultra.bb` `run-workflow` always exits 0 even on a failed/halted run.
- `turn_session.cljs` clears both control queues in `finally`, dropping a
  `steer!`/`follow-up!` that lands after the last drain.

## Declined findings

- `kanban/.events/ledger.edn` rotation nitpick — the ledger is append-only by
  design and is the source of truth for state transitions.
- `sol.cljs` `console.error`-vs-bus-event note — CLI entry point, no bus in scope.
- `packages/sol/deps.edn` katamorph/event-ledger coordinates (CodeRabbit Major) —
  false positive; both repos resolve and the tag→sha pins are exact.

---
CLOSED 2026-07-26: PR #142 merged into main as merge commit 1656927. Two review waves closed out by hand after both bots hit usage limits — 20 threads total (15 initial, 5 from CodeRabbit after its quota reset), all replied to with the fixing commit or an evidenced rationale, all resolved. required_conversation_resolution was the sole merge blocker; 0 approvals are required and every required context was already green. Branch commits: e7a2b95 (residual findings) and 809e9cc (SIGKILL escalation + second wave). Two red gates found on the branch and fixed, neither part of the reviewed set: ultra_test.bb's git-commit-is-path-scoped stubbed p/process with a delay that cannot satisfy the 3-arity deref, so the test evidencing the path-scoped-commit fix was itself erroring; and sol lint:kondo carried 2 promise-chain warnings from d73f403, resolved by extracting settle-on-send! as an ^:async helper invoked without await so the timeout race is preserved. Declined with rationale: ledger rotation (append-only by design), console.error-vs-bus-event in the CLI entry point, the sol/deps.edn katamorph/event-ledger coordinates (false positive — both repos resolve, tag->sha pins exact), and CodeRabbit's claim that ai/github lack legacy ledger rows (both present). Follow-ups filed: ultra-workflow-failure-signalling, sol-turn-session-late-control-messages, kanban-comment-writer-setext-delimiter.
---