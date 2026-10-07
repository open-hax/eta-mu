# Todo-to-Breakdown upstream planning handoff

This handoff proposes one new promethean replanning edge. It does not activate
that edge, admit implementation, change a Truth card, or repair concurrent card
history. No production/test source, runtime configuration, existing card body,
commit, push, PR, reviewer request, or live consumer transition was changed.

- Planning repository: `open-hax/eta-mu`.
- Worktree: `/home/err/spaces/foresight/.worktrees/eta-mu-rheos-todo-replan`.
- Branch: `codex/rheos-todo-replan-plan`.
- Base: `09a4454480baa67f6fdc40f6f73f5e48ef0457d1`; local `origin/main` and a
  read-only `git ls-remote origin refs/heads/main` agreed before creation.
- Existing parent: `rheos-cli-card-lifecycle-authority`, Breakdown epic 13.
- New child: `rheos-todo-breakdown-replan`, Incoming, P1, 3 points.
- Implementation target: extracted `open-hax/rheos`, inspected source
  `ab6b227becd8585742b5130df9ae624d8744928e`.

The current artifact's missing edge and the conflicting process diagram are
observed facts. The new always-allow edge is a proposal; no recent regression
is established. The card carries the narrow outcome, explicit non-goals,
meaningful behavior-test plan, primary source links and pinned Truth refusal.
No separate speculative research notebook is needed for this lifecycle slice.

## Canonical authoring evidence

`authoring.json` records the exact absolute CLI invocation, source/artifact
identity, body-input hash, exit/output, and byte provenance. The create command
uses the real existing eta-mu board configuration and parent. It omits forced
status and lets the preset choose its initial state. `readback.json` contains
the subsequent canonical `read-task` response; it confirms Incoming3 and the
parent link. Exactly one creation event was appended, and the complete previous
ledger byte prefix was preserved. No local board parser or validator was added.

Canonical runtime SHA256:
`83c6b397278d418d69ce6509b8c3d9fe87e88cca9141b28143d9efb5d78a75a7`.

The intentional preflight read of the absent new UUID returned exit 2. Creation
and readback each returned exit 0. These are authoring observations, not an
automated RED for the proposed edge. No JVM, tests, build or new-edge move ran.

## Publication boundary

Root owns the commit and planning PR. The card must receive the applicable
planning review and canonical admission before implementation. Later source
work belongs in standalone Rheos; do not patch the retained monorepo package or
add a consumer override. Qualified source, rebuilt artifact and explicit
consumer adoption are separate steps. Truth's recorded Todo5 state does not
change because this card or an upstream source commit exists.

The new Receipt River is under `.ημ/receipts.edn` because the parent explicitly
requested this location. Existing root `receipts.edn` remains byte-identical;
no historical receipt is migrated or rewritten. The existing reflection ledger
is extended only. No spore is created or promoted.

## Explicit staging inventory

Only these eight paths are intended for root's review and staging:

1. `kanban/tasks/allow-todo-to-return-directly-to-breakdown-in-the-promethean-preset-n-replan.md`
2. `kanban/.events/ledger.edn`
3. `.ημ/receipts.edn`
4. `.ημ/session-mycology/ledger.md`
5. `.ημ/diagnostics/rheos-todo-replan-plan/authoring.json`
6. `.ημ/diagnostics/rheos-todo-replan-plan/readback.json`
7. `.ημ/diagnostics/rheos-todo-replan-plan/HANDOFF.md`
8. `.ημ/diagnostics/rheos-todo-replan-plan/verification.json`

The temporary body-input file lives outside the repository; the canonical card
and recorded readback retain its authored content. There is no need to stage a
duplicate body-input artifact. `verification.json` records final prefix/hash,
source-link and diff checks, plus the independent review outcome when available.
