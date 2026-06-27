;; Π_STATE.sexp — Fork tax snapshot
;; Generated: 2026-06-19T15:33:41Z
;; Branch: docs/discovery-sweep-update
;; Base commit: ec489dae6b566df6ddd93d8c0ec6a3ec97a5a144

(π-snapshot
  (branch "docs/discovery-sweep-update")
  (base-sha "ec489dae6b566df6ddd93d8c0ec6a3ec97a5a144")
  (timestamp "2026-06-19T15:33:41Z")

  (summary
    "Documentation discovery-sweep update closing 13 docs-* kanban tasks: rewrote the
     top-level README, DEVELOPMENT.md, and AGENTS.md for the real ClojureScript-first
     monorepo; created 9 missing package READMEs; refreshed 8 legacy READMEs with
     deprecation banners; reconciled axxium / extensions / extensions-e2e / runtime / sol
     docs; refreshed the architecture-inventory and kondo-config baselines; consolidated
     docs/notes with an INDEX; deleted the stale CROSS_REFERENCES.md and Knoxx-copied sol
     artifacts. Markdown-only; no source code touched. Produced by a 30-agent workflow
     partitioned by file ownership.")

  (scope
    (added-package-readmes
      "packages/chat-ui/README.md" "packages/event-ledger/README.md"
      "packages/Rheos/README.md" "packages/protocols/README.md"
      "packages/mcp-contracts/README.md" "packages/kanban-orchestrator/README.md"
      "packages/katamorph/README.md" "packages/kondo-config/README.md"
      "packages/legacy/publication-components/README.md")
    (added-docs
      "packages/sol/AGENTS.md"
      "packages/runtime/docs/design/runtime-vs-sol-ownership.md"
      "docs/design/contract-model.md" "docs/notes/INDEX.md")
    (rewritten-top-level "README.md" "DEVELOPMENT.md" "AGENTS.md")
    (refreshed-package-docs
      "packages/axxium/README.md" "packages/axxium/docs/axxium-kernel-spec.md"
      "packages/axxium/docs/axxium-kernel-spec-v2.md"
      "packages/extensions/README.md" "packages/extensions/kanban/extension-integration-plan.md"
      "packages/extensions-e2e/README.md" "packages/runtime/README.md"
      "packages/sol/README.md" "packages/sol/mutation/README.md" "packages/sol/Dockerfile")
    (refreshed-legacy-readmes
      "packages/legacy/agent/README.md" "packages/legacy/ai/README.md"
      "packages/legacy/coding-agent/README.md" "packages/legacy/coding-agent/docs/development.md"
      "packages/legacy/coding-agent/examples/sdk/README.md" "packages/legacy/docs/README.md"
      "packages/legacy/github/README.md" "packages/legacy/kanban/README.md"
      "packages/legacy/output-contract-gate/README.md" "packages/legacy/tui/README.md")
    (refreshed-inventories
      "docs/cljs-runtime-rewrite-architecture-inventory.md" "docs/kondo-config-baseline.md"
      "docs/cljs-runtime-rewrite-runtime-core-plan.md"
      "docs/cljs-runtime-rewrite-boundary-adapter-plan.md"
      "docs/cljs-runtime-rewrite-shadow-spine-plan.md"
      "kanban/eta-mu-extensions-integration.md")
    (deleted-stale
      "CROSS_REFERENCES.md"
      "packages/sol/ROUTE_MIGRATION_AUDIT.md" "packages/sol/pseudo/hack.md"
      "docs/notes/2026.05.05.11.03.52.md" "docs/notes/2026.05.08.13.48.10.md"
      "docs/notes/2026.06.14.10.25.09.md"
      "docs/notes/research-prompt/2025.11.04.11.54.30.md"
      "docs/notes/research-prompt/2025.11.04.12.11.40.md"))

  (concurrent-dirt
    (note "Workspace treated as shared per concurrent-agent guardrails. Only the docs
           deliverables above were staged; the following pre-existing dirt was left
           untouched and unstaged.")
    (unowned-modified
      "ecosystem.config.cjs" "receipts.edn" "kanban/.events/ledger.edn"
      "kanban/epics/fsm-engine.md" "packages/Rheos/src/rheos/ui/domain/board.cljs"
      "packages/Rheos/src/rheos/ui/domain/sidebar.cljs"
      "packages/chat-ui/src/eta_mu/chat_ui/message.cljs")
    (unowned-untracked
      ".dir-locals.el" "cljs-rewrite" "openhax.kanban.json"
      "kanban/tasks/docs-*.md (13 source task cards driving this work)"
      "kanban/tasks/fsm-*.md (12 cards)" "kanban/tasks/ops-fix-root-package-json-scripts.md")
    (residual-followups
      "packages/eta-mu-extensions/ — stale stub dir (only kanban/.events/ledger.edn), superseded by packages/extensions; flagged for removal (not deleted: unowned)."
      "packages/event-ledger/index.d.ts — declares 5 exports not in shadow-cljs :exports; documented as drift, fix pending."
      "packages/sol/.clj-kondo/config.edn — defroute hook key still references knoxx.backend.macros/defroute; should be open-hax.sol.macros/defroute."))

  (verification
    (code-tests "skipped — no code packages touched (Markdown + Dockerfile relabel only)")
    (clj-kondo "skipped — no .cljs/.clj/.cljc source touched")
    (markdown-links "validated — no dangling references to deleted files; phantom analyze-image/manipulate-image claims remain only as explicit historical/dropped disclaimers")
    (package-names "verified against package.json — renamed dirs (packages/{extensions,runtime}) retain @open-hax/eta-mu-* npm names; --filter commands confirmed")))

;; END Π_STATE
