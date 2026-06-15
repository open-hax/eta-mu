;; Π_STATE.sexp — Fork tax snapshot
;; Generated: 2026-06-15T14:44:00Z
;; Branch: feat/kanban-comments-parity
;; Base commit: a03eeb6

(π-snapshot
  (branch "feat/kanban-comments-parity")
  (base-sha "a03eeb6")
  (timestamp "2026-06-15T14:44:00Z")

  (summary
    "Ignore and untrack dist-dev build artifacts; katamorph policy eval/fulfillment refinements; Sol MCP server wiring, agent session/turn fixes, and shape updates; legacy coding-agent SDK/resource-loader updates.")

  (scope
    ;; Build hygiene
    (root-gitignore ".gitignore")
    (sol-gitignore "packages/sol/.gitignore")
    (removed-dist-dev "packages/sol/dist-dev/**")

    ;; Katamorph
    (modified-katamorph-eval "packages/katamorph/src/cljs/katamorph/policy/eval.cljs")
    (modified-katamorph-fulfillment "packages/katamorph/src/cljs/katamorph/policy/fulfillment.cljs")
    (modified-katamorph-eval-test "packages/katamorph/test/cljs/katamorph/policy/eval_test.cljs")

    ;; Legacy coding-agent
    (modified-coding-agent-resource-loader "packages/legacy/coding-agent/src/core/resource-loader.ts")
    (modified-coding-agent-sdk "packages/legacy/coding-agent/src/core/sdk.ts")

    ;; Sol
    (modified-sol-package "packages/sol/package.json")
    (modified-sol-shadow-config "packages/sol/shadow-cljs.edn")
    (modified-sol-contracts-loader "packages/sol/src/cljs/open_hax/sol/domain/contracts/loader.cljs")
    (added-sol-mcp-servers "packages/sol/src/cljs/open_hax/sol/domain/contracts/mcp_servers.cljs")
    (modified-sol-extern-eta-mu "packages/sol/src/cljs/open_hax/sol/extern/eta_mu.cljs")
    (modified-sol-agent-session "packages/sol/src/cljs/open_hax/sol/infra/agent/session.cljs")
    (modified-sol-agent-turn "packages/sol/src/cljs/open_hax/sol/infra/agent/turn.cljs")
    (added-sol-mcp-tools "packages/sol/src/cljs/open_hax/sol/infra/agent/mcp_tools.cljs")
    (added-sol-defaults "packages/sol/src/cljs/open_hax/sol/infra/defaults.cljs")
    (modified-sol-law-contracts "packages/sol/src/cljs/open_hax/sol/law/contracts.cljs")
    (modified-sol-shape-app-shapes "packages/sol/src/cljs/open_hax/sol/shape/app_shapes.cljs")
    (modified-sol-policy-eval-test "packages/sol/test/cljs/open_hax/contracts/policy/eval_test.cljs")
    (modified-sol-shape-parse-test "packages/sol/test/cljs/open_hax/sol/shape/parse_test.cljs"))

  (excluded
    (lockfile "pnpm-lock.yaml" (reason "stale lock state, regenerate on next pnpm install"))
    (migration-scratch "migrating-sol.md" (reason "session scratch note, not curated for commit"))
    (rheos-dist-dev "packages/Rheos/dist-dev/**" (reason "build artifacts, untracked and now gitignored")))

  (concurrent-dirt
    (note "Workspace is single-agent for this branch; excluded paths are generated/runtime/scratch, not another agent's work."))

  (verification
    (eta-mu-cli-tests "passed — 1120 tests, 47 skipped")
    (katamorph-tests "passed — 73 tests, 192 assertions")
    (sol-tests "failed — 24 failures, 1 error (pre-existing / unrelated to dist-removal)")
    (ts-line-count "unchanged — 174,537 lines")))

;; END Π_STATE
