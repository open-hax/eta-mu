# Protocols hosted gates

Actual Codex review [3996219654](https://github.com/open-hax/eta-mu/pull/334#discussion_r3996219654) found that a protocols change selected the Rheos workflow while the job exercised only Rheos. Rheos's suite did not cover the local provider, native concurrency checks, or public TypeScript declarations.

The authoritative emitting resource in `contracts/workflows/ci.edn` now runs the protocols package's `test`, `lint`, and `test:types` commands, plus the workflow contract regression. All four steps reject warning diagnostics, and the test steps require the actual zero-failure assertion summary. Canonical Clio dependency changes and workflow-regression changes select the same hosted and local gates. The existing job identity and private Rheos dependency setup remain intact.

The shipped workflow command regenerated `.github/workflows/rheos.yml` and the local gate plan; YAML was not edited manually. The new tests load the actual resource registry, expand the actual Rheos workflow, inspect both target projections, and execute its generated Bash guards against successful, warning-bearing, missing-test-summary, and nonzero-exit processes.

Fresh evidence in the isolated successor based on `690aad83ff54ef5225a1f1533b4a7bd0eaef3561`:

- Failure-first resource regression: **20 failures, 0 errors**, demonstrating absent package steps and missing dependency/regression path selection.
- Final workflow regression: **6 tests, 78 assertions, 0 failures, 0 errors**.
- `workflows check`: both emitted workflows and the ten-gate plan match their resources. `gates --audit`: all four filtered non-emitting sibling workflows pass their path audit.
- Actual protocols package `test`: **71 ClojureScript tests / 217 assertions**, plus **15 native Node tests**, all passing with no skipped/cancelled tests. Test build: **136 files, 0 warnings**; library build: **111 files, 0 warnings**.
- Actual protocols `lint`: **0 errors, 0 warnings**; strict `test:types`: exit **0**.
- Eta-mu's full advertised `lint:kondo`: **0 errors, 0 warnings**. It retains two existing informational diagnostics in `domain/session.cljs` and `infra/cli/commands/kanban.cljs`; no rule was changed or suppressed.

This proves local execution and correct generated hosted gates. It does not claim that a subsequent hosted run or all PR reviewers have completed; publication, fresh exact-head review, and merge remain with the coordinating lane.
