;; Π_STATE.sexp — Fork tax snapshot
;; Generated: 2026-07-09T21:12:00Z
;; Branch: main
;; Base commit: 6bd3e6cf1605995f0dc0a21bb16070a70284dda2

(π-snapshot
  (branch "main")
  (base-sha "6bd3e6cf1605995f0dc0a21bb16070a70284dda2")
  (timestamp "2026-07-09T21:12:00Z")

  (summary
    "eta-mu CLJS rewrite handoff: new CLI/contract/terminal/turn CLJS packages, removal of legacy output-contract-gate and runtime gate packages, extension bridge updates, and workspace reorganization.")

  (scope
    (added-packages
      "packages/contracts/"
      "packages/terminal-ui/"
      "packages/turn-processor/")
    (added-source
      "packages/eta-mu/src/cljs/eta_mu/extern/openai.cljs"
      "packages/eta-mu/src/cljs/eta_mu/extern/readline.cljs"
      "packages/eta-mu/src/cljs/eta_mu/infra/cli/repl.cljs"
      "packages/eta-mu/test/cljs/eta_mu/extern/"
      "packages/eta-mu/test/cljs/eta_mu/infra/cli/commands/agent_test.cljs"
      "packages/legacy/coding-agent/src/core/extensions/cljs-extension-compiler.js"
      "packages/legacy/coding-agent/test/extensions-cljs.test.js")
    (removed-packages
      "packages/legacy/output-contract-gate/"
      "packages/runtime/src/cljs/eta_mu/gate/")
    (modified
      "packages/eta-mu/dist-cli/index.cjs"
      "packages/eta-mu/dist-cli/index.cjs.map"
      "packages/eta-mu/package.json"
      "packages/eta-mu/shadow-cljs.edn"
      "packages/eta-mu/src/cljs/eta_mu/extern/child_process.cljs"
      "packages/eta-mu/src/cljs/eta_mu/infra/cli/commands/agent.cljs"
      "packages/eta-mu/src/cljs/eta_mu/infra/cli/commands/doctor.cljs"
      "packages/eta-mu/src/cljs/eta_mu/infra/cli/router.cljs"
      "packages/extensions/lib/eta_mu/core.cljc"
      "packages/extensions/package.json"
      "packages/legacy/ai/src/models.generated.ts"
      "packages/legacy/coding-agent/src/core/extensions/loader.ts"
      "packages/legacy/output-contract-gate/package.json"
      "pnpm-lock.yaml"
      "pnpm-workspace.yaml"
      "receipts.edn"
      "kanban/tasks/eta-mu-cljs-rewrite-architecture-inventory.md")
    (added-docs
      "docs/design/eta-mu-base-cli-router.md"
      "docs/design/legacy-package-reorganization.md"
      "docs/design/turn-processor-cljs-package.md"
      "docs/design/user-clojurescript-extensions.md"
      "docs/notes/2026.07.08.14.15.47.md"
      "kanban/tasks/contracts-output-cljs-package.md"
      "kanban/tasks/eta-mu-base-cli-package.md"
      "kanban/tasks/legacy-package-reorganization.md"
      "kanban/tasks/terminal-ui-cljs-package.md"
      "kanban/tasks/turn-processor-cljs-package.md"))

  (concurrent-dirt
    (note "Workspace treated as shared per concurrent-agent guardrails. All owned repo-relevant changes were staged; the following stray/test artifacts were left untouched.")
    (untracked-excluded
      "EOF"
      ".ημ/session-reflections.edn"))

  (verification
    (extensions-test "PASS — 72 tests, 195 assertions, 0 failures")
    (coding-agent-test "FAIL — test/tools.test.ts:520 executeBash truncation persistence; expected full output to contain '1\\n2\\n3', received empty string")
    (ts-line-count "PASS — global TS line count decreased from ~174,500 to 172,809")))

;; END Π_STATE
