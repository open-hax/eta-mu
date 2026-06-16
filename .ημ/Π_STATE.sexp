;; Π_STATE.sexp — Fork tax snapshot
;; Generated: 2026-06-16T11:51:55Z
;; Branch: chore/ts-cljs-rewrite
;; Base commit: 1809efd

(π-snapshot
  (branch "chore/ts-cljs-rewrite")
  (base-sha "1809efd")
  (timestamp "2026-06-16T11:51:55Z")

  (summary
    "Rheos backend and UI domain hardening, new task-edit/store/view-store modules, chat-ui extraction with mock/knoxx/sol sessions, standalone app shell, and updated kanban/docs inventory for the TS→CLJS rewrite.")

  (scope
    ;; Rheos
    (modified-rheos "packages/Rheos/src/rheos/backend/domain/compose.cljs")
    (modified-rheos "packages/Rheos/src/rheos/backend/domain/events.cljs")
    (modified-rheos "packages/Rheos/src/rheos/backend/domain/transition.cljs")
    (modified-rheos "packages/Rheos/src/rheos/backend/infra/agent_tools.cljs")
    (modified-rheos "packages/Rheos/src/rheos/backend/infra/cli.cljs")
    (modified-rheos "packages/Rheos/src/rheos/backend/infra/http_server.cljs")
    (modified-rheos "packages/Rheos/src/rheos/backend/infra/task_writeback.cljs")
    (modified-rheos "packages/Rheos/src/rheos/backend/infra/watcher.cljs")
    (modified-rheos "packages/Rheos/src/rheos/backend/shape/content_parser.cljs")
    (modified-rheos "packages/Rheos/src/rheos/backend/shape/kanban.cljs")
    (modified-rheos "packages/Rheos/src/rheos/ui/domain/board.cljs")
    (modified-rheos "packages/Rheos/src/rheos/ui/domain/layout.cljs")
    (modified-rheos "packages/Rheos/src/rheos/ui/domain/orchestrator.cljs")
    (modified-rheos "packages/Rheos/src/rheos/ui/domain/sidebar.cljs")
    (modified-rheos "packages/Rheos/test/rheos/backend/domain/compose_test.cljs")
    (modified-rheos "packages/Rheos/test/rheos/backend/domain/events_test.cljs")
    (modified-rheos "packages/Rheos/test/rheos/backend/law/fsm_test.cljs")
    (modified-rheos "packages/Rheos/test/rheos/backend/shape/content_parser_test.cljs")
    (added-rheos "packages/Rheos/src/rheos/backend/domain/task_edit.cljs")
    (added-rheos "packages/Rheos/src/rheos/backend/infra/store.cljs")
    (added-rheos "packages/Rheos/src/rheos/backend/infra/view_store.cljs")
    (added-rheos "packages/Rheos/test/rheos/backend/domain/task_edit_test.cljs")
    (added-rheos "packages/Rheos/test/rheos/backend/infra/store_test.cljs")
    (added-rheos "packages/Rheos/test/rheos/backend/infra/view_store_test.cljs")
    (added-rheos "packages/Rheos/test/rheos/backend/infra/watcher_test.cljs")

    ;; chat-ui
    (modified-chat-ui "packages/chat-ui/package.json")
    (modified-chat-ui "packages/chat-ui/shadow-cljs.edn")
    (modified-chat-ui "packages/chat-ui/src/eta_mu/chat_ui/protocol.cljs")
    (added-chat-ui "packages/chat-ui/.gitignore")
    (added-chat-ui "packages/chat-ui/resources/public/index.html")
    (added-chat-ui "packages/chat-ui/src/eta_mu/chat_ui/core.cljs")
    (added-chat-ui "packages/chat-ui/src/eta_mu/chat_ui/knoxx_session.cljs")
    (added-chat-ui "packages/chat-ui/src/eta_mu/chat_ui/mock_session.cljs")
    (added-chat-ui "packages/chat-ui/src/eta_mu/chat_ui/sol_session.cljs")
    (added-chat-ui "packages/chat-ui/test/eta_mu/chat_ui/mock_session_test.cljs")

    ;; Kanban / docs
    (modified-docs "docs/cljs-runtime-rewrite-architecture-inventory.md")
    (added-notes "docs/notes/2026.06.16.06.43.13.md")
    (modified-kanban-ledger "kanban/.events/ledger.edn")
    (modified-kanban-epics "kanban/epics/board-composition.md")
    (modified-kanban-epics "kanban/epics/chat-ui-extraction.md")
    (modified-kanban-epics "kanban/epics/kanban-chat-integration.md")
    (modified-kanban-epics "kanban/epics/kanban-cljs-rewrite.md")
    (modified-kanban-epics "kanban/epics/kanban-event-ledger.md")
    (modified-kanban-epics "kanban/epics/roadmap-global-projection.md")
    (modified-kanban-tasks "kanban/tasks/eta-mu-cljs-rewrite-architecture-inventory.md"))

  (excluded
    (stray-empty-file "cljs-rewrite" (reason "0-byte untracked artifact; not part of snapshot scope")))

  (concurrent-dirt
    (note "No concurrent-agent dirt detected. The 0-byte untracked file `cljs-rewrite` is treated as a stray artifact and left uncommitted."))

  (verification
    (rheos-tests "passed — 55 tests, 150 assertions")
    (chat-ui-tests "passed — 1 test, 3 assertions")
    (rheos-clj-kondo "passed — 0 errors, 0 warnings")
    (chat-ui-clj-kondo "passed — 0 errors, 0 warnings")
    (ts-line-count "174562 lines — baseline updated from 174537 to reflect prior branch commits; no new TS files staged")))

;; END Π_STATE
