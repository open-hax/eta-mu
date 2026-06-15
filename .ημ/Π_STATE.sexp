;; Π_STATE.sexp — Fork tax snapshot
;; Generated: 2026-06-15T15:23:16Z
;; Branch: feat/kanban-comments-parity
;; Base commit: 2bf6329

(π-snapshot
  (branch "feat/kanban-comments-parity")
  (base-sha "2bf6329")
  (timestamp "2026-06-15T15:23:16Z")

  (summary
    "Fix Sol test suite isolation, katamorph policy/agent evaluator bugs, and Sol agent-template/content issues. All targeted suites now pass.")

  (scope
    ;; Katamorph policy
    (modified-katamorph-eval "packages/katamorph/src/cljs/katamorph/policy/eval.cljs")
    (modified-katamorph-eval-test "packages/katamorph/test/cljs/katamorph/policy/eval_test.cljs")

    ;; Katamorph agent helpers
    (modified-katamorph-reasoning "packages/katamorph/src/cljs/katamorph/agent/reasoning.cljs")
    (modified-katamorph-text-delta "packages/katamorph/src/cljs/katamorph/agent/text_delta.cljs")
    (added-katamorph-agent-tests "packages/katamorph/test/cljs/katamorph/agent/reasoning_test.cljs")
    (added-katamorph-agent-tests "packages/katamorph/test/cljs/katamorph/agent/text_delta_test.cljs")
    (added-katamorph-agent-tests "packages/katamorph/test/cljs/katamorph/agent/turn_guards_test.cljs")

    ;; Sol test isolation and evaluator
    (modified-sol-shadow-config "packages/sol/shadow-cljs.edn")
    (removed-sol-katamorph-tests "packages/sol/test/cljs/open_hax/katamorph/agent/*")
    (removed-sol-duplicate-eval-test "packages/sol/test/cljs/open_hax/contracts/policy/eval_test.cljs")
    (modified-sol-agent-templates "packages/sol/src/cljs/open_hax/sol/domain/agent/agent_templates.cljs")
    (modified-sol-agent-templates-test "packages/sol/test/cljs/open_hax/sol/domain/agent/agent_templates_test.cljs")
    (modified-sol-content "packages/sol/src/cljs/open_hax/sol/domain/agent/content.cljs")

    ;; Kanban record
    (added-kanban-task "kanban/tasks/sol-test-failure-triage-2026-06-15.md"))

  (excluded
    (lockfile "pnpm-lock.yaml" (reason "stale lock state, regenerate on next pnpm install"))
    (migration-scratch "migrating-sol.md" (reason "session scratch note, not curated for commit"))
    (cljs-rewrite-inventories "docs/*-cljs-rewrite-inventory.md" (reason "untracked docs from concurrent rewrite planning"))
    (kanban-epics "kanban/epics/*-cljs-rewrite.md" (reason "concurrent kanban epic/task creation")))

  (concurrent-dirt
    (note "Workspace is single-agent for this branch; excluded paths are generated/runtime/scratch or concurrent rewrite planning artifacts."))

  (verification
    (eta-mu-cli-tests "passed — 1120 tests, 47 skipped")
    (katamorph-tests "passed — 102 tests, 253 assertions")
    (sol-tests "passed — 66 tests, 193 assertions")
    (ts-line-count "unchanged — 174,537 lines")))

;; END Π_STATE
