---
uuid: "tell-an-actions-outage-apart-from-a-real-gate-failure"
title: "Tell an Actions outage apart from a real gate failure"
status: "incoming"
type: "task"
priority: "P2"
points: "3"
labels: "ci, tooling, agent-operations"
category: "tasks"
write-id: "1786043439219-0.eq0ox7lja10r7rlwew"
created_at: "2026-08-06T19:10:39.219Z"
---

# Tell an Actions outage apart from a real gate failure

## Outcome

An agent looking at a red PR can decide, from evidence and in under a minute,
whether the code failed or the platform did — and records which, so the next
agent does not re-derive it.

## Why this card exists

On 2026-08-06 all five open PRs showed red checks. None of them were code
failures:

- `main-lint` is a **bare `echo`** — `run: echo "services/ removed; no deploy
  scripts to lint in current layout"` — and it "failed" after **6m19s**. A job
  with no logic cannot fail on logic.
- `bundle` on #177 reported `fail` to `gh pr checks` but its actual conclusion
  was **`cancelled`**, at 27m35s, with **zero non-success steps**.
- CodeQL `Analyze` ran **1h8m** and **1h24m** on two different PRs before
  failing.
- Runs queued at 16:40 had still not started by 19:05, and pushes after 17:49
  spawned **no workflow runs at all** on `ubuntu-latest`, with
  `actions/permissions` reporting `enabled: true`.

Time was spent fetching logs for these before the shape became obvious. The
`rheos-cli-card-lifecycle-authority` epic had already recorded the same
diagnosis on a previous day ("failing at `Set up job` with 'Failed to resolve
action download info' / Service Unavailable / Bad Gateway") — so this is at
least the second occurrence, and the knowledge did not survive into a reusable
form.

## The tell

`gh pr checks` reports **`cancelled` as `fail`**. That single conflation is
what makes an outage read as a broken build. Distinguishing them:

```bash
# What actually happened, per job — not what `gh pr checks` summarised
gh run view <run-id> --json jobs \
  --jq '.jobs[]|"\(.name) \(.conclusion) \(.startedAt) \(.completedAt)"'

# Which step failed. Empty output on a red job means nothing failed -> cancelled
gh run view <run-id> --json jobs \
  --jq '.jobs[]|.steps[]|select(.conclusion!="success")|"\(.number) \(.name) -> \(.conclusion)"'

# Is the platform accepting work at all?
gh api repos/<owner>/<repo>/actions/runs \
  --jq '.workflow_runs[:5][]|"\(.created_at) \(.status) \(.name)"'
```

Three signals, any one of which means "platform, not code":

1. A job whose conclusion is `cancelled`, or which has no non-success step.
2. A trivial job (echo-only, no-op) taking minutes or failing.
3. No runs created for a push whose branch has workflow triggers, while Actions
   reports `enabled: true`.

## Scope

- A short runbook — likely a skill, not just docs — carrying the commands above
  and the three signals.
- Say plainly in it that `gh run view --log-failed` returns
  `"run ... is still in progress"` for a partially-complete run, so log-first
  diagnosis stalls; go to the jobs API instead.
- Decide where the finding gets recorded so it is not re-derived a third time:
  a receipt is per-session, the epic comment is per-epic. Something repo-level.
- Optional: a `bundle`/CodeQL timeout budget, so a 1h24m Analyze trips an
  explicit timeout rather than looking like a failure.

## Acceptance criteria

- Given a red PR, the runbook classifies it as code-vs-platform using only
  `gh` commands, with no log download.
- The `cancelled`-reported-as-`fail` conflation is stated explicitly, because it
  is the thing that actually misleads.
- A worked example from 2026-08-06 is included: the bare-`echo` `main-lint`
  failing after 6m19s.
- Re-running the classification against a genuinely failing gate returns "code",
  not "platform" — the runbook has to be able to say no.

## Non-goals

- Retrying, re-queuing, or otherwise working around GitHub outages.
- Any change that would let a PR merge without a real gate.

## Notes

Found during the 2026-08-06 second-pass PR sweep, in which five PRs were
verified locally (rheos 116/329 and 110/403 assertions, clj-kondo 0/0, all
release targets clean) while every one of them showed red on GitHub.
