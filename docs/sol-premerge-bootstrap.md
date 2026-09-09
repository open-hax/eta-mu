# Protected Sol pre-merge validation

Sol depends on private `open-hax/event-ledger` source. Ordinary pull-request
execution must receive neither those bytes nor a credential that can read them.
`Sol CI / verify` therefore remains exact-head public-source lint. The separate
`Sol Pre-merge Integration` workflow runs lint, behavioral tests, and the server
build only after a human explicitly trusts one complete candidate SHA.

This is a pre-merge testing boundary. It neither enables controller
`review-dispatch` nor satisfies Services' App-bound production deployment proof.

## Bootstrap before testing PR #328

1. Land a small, independently reviewed bootstrap PR on protected `main` with
   `.github/workflows/sol-premerge.yml`,
   `.github/workflows/sol-premerge-contract.yml`,
   `.github/scripts/sol-premerge.mjs`, and `.github/scripts/sol-premerge.test.mjs`.
   The contract workflow installs the existing `eta-mu` package's public `yaml`
   parser with lifecycle scripts disabled, then runs the Node contract tests;
   it needs no controller package or private dependency. Include this document.
   Keep PR #328 open during
   this bootstrap: merging #328 to make its own pre-merge test runnable is not
   pre-merge validation. GitHub requires a dispatch workflow to exist on the
   default branch before it can receive the event.
2. A repository administrator creates the `sol-premerge` environment, assigns an
   explicit human required reviewer, disables administrator bypass, and chooses
   **Selected branches and tags** with exactly one rule: branch `main`. Do not
   use a wildcard, a tag rule, or the broader **Protected branches only** option.
   The workflow checks that `main` itself is protected. A sole maintainer may
   leave **Prevent self-review** off and deliberately approve a run they
   dispatched. Dispatching a run is never treated as its approval.
3. Configure environment-only `SOL_PREMERGE_APP_ID` and
   `SOL_PREMERGE_APP_PRIVATE_KEY` secrets. Use a dependency-reading App installed
   for `katamorph` and `event-ledger`, with Contents read access. Do not create
   repository/organization copies of these two dedicated secret names. The
   installation token is explicitly limited to those repositories and Contents
   read; review-publication and controller credentials are not used.
4. Finish and push the candidate, read its full 40-character head SHA, then
   dispatch **Sol Pre-merge Integration** from **main**, with `pr_number: "328"`
   and `head_sha` equal to that SHA. Its run name, approval job name, and
   environment URL all identify the candidate. The human reviews those exact
   bytes and approves that pending environment deployment in GitHub. An agent
   must not approve on the human's behalf. No private dependency read occurs
   before this gate. Missing environment settings or approval fails closed.
5. The default-branch workflow re-fetches the PR after approval and immediately
   before execution. It requires an open same-repository PR still targeting
   `main`, the exact input head, and unchanged trusted default-branch machinery.
   It prefetches only canonical dependencies, revokes the dependency token, then
   checks out and executes the approved candidate. New private dependency pins
   not available from the canonical prefetch fail without requesting additional
   credentials; update and review the trusted dependency pins separately.
6. Verify the `Sol pre-merge / test-build` check on that exact PR head. A separate
   fresh runner publishes it from the protected job's actual result, after
   re-fetching the candidate. Add this check as a required check for the Sol
   merge policy before accepting it as a recurring gate. Do not confuse the
   dispatch workflow's default-branch SHA with the check's candidate SHA.

Any head or trusted-default-branch change requires a **new dispatch and new
human approval**. Workflow reruns are rejected so an earlier run's approval
cannot authorize another attempt implicitly. Ordinary PR CI remains useful
before trust promotion; a green static Sol check is never full test evidence.

## Evidence and limits

The protected runner publishes no artifacts, build outputs, source maps, private
source, caches, or raw dependency/compiler logs. Those logs stay on its transient
runner; the fresh publisher reports only fixed candidate/machinery identities
and the job result. A failing job does not upload its raw private logs into the
public repository. Inspecting private diagnostics requires a separately
authorized private execution/retention path.

The approval intentionally permits that exact reviewed candidate to read private
dependencies. It is a human trust promotion, not an automatic sandbox guarantee.
Branch permissions and environment secrets/settings are administrator-owned
deployment prerequisites; committing the YAML alone does not configure them.
The guard additionally reads the run's real approval history and rejects a
bypass with no recorded human approval.

GitHub documents that environment and run-approval reads require only Actions
read permission, while environment configuration requires Administration write:
[environment API](https://docs.github.com/en/rest/deployments/environments),
[branch policy API](https://docs.github.com/en/rest/deployments/branch-policies),
[approval history API](https://docs.github.com/en/rest/actions/workflow-runs#get-the-review-history-for-a-workflow-run).
Workflow source and dispatch behavior are described in the
[context reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts)
and [event reference](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch).
