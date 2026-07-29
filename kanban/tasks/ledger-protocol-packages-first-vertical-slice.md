---
uuid: "9c93b327-7900-4ce1-a9f4-3092d127a381"
title: "Ledger Protocol Packages — First Vertical Slice"
status: "done"
priority: "P0"
labels: ["architecture", "receipt-river", "session-mycology", "fork-tax", "cli"]
created_at: "2026-07-29T09:28:15.862Z"
parent: "eta-mu-base-cli-package"
write-id: "1785319371509-0.dtj341nv1mt7ulg0c3l"
---

---
Scope: implement only the first vertical slice from the 2026-07-29 user architecture: create @eta-mu/{receipt-river,session-mycology,fork-tax}; extract existing behavior behind package APIs; canonical receipt/session/fork-tax routing plus git compatibility aliases; generated composition manifest; package/schema-stamped test events; safe local-Git root discovery and provider-independent repository/worktree inventory. Preserve extension implementations and defer semantic schema redesign, Epiphany provider, archaeology interpretation, retirement, and skill rewrites.

Implemented and verified. Package suites: receipt-river 8 tests/25 assertions, session-mycology 2/6, fork-tax 5/13; eta-mu unit 152/342; eta-mu e2e 7/71. Four clj-kondo gates and all release builds completed with zero warnings. CLI smokes passed for version --components, all schemas surfaces, git compatibility delegation, mixed historical/versioned receipt writing, Fork Tax dry-run, and provider-independent repository inventory.

Durable home-wide inventory completed at .ημ/receipt-river/repository-inventory.edn: 138 repositories (43 normal, 5 linked worktrees, 5 bare, 85 submodules), 14 duplicate-clone groups, 4 shared-history groups, and 947 symlinks safely observed without traversal. Runtime/dependency caches are explicit exclusions in the corpus.
---