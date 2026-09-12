---
category: "tasks"
labels: "clio, providers, sandbox"
type: "task"
write-id: "1789200175947-0.wcairhsl9jz7jn86zf"
title: "Clio local EDN service providers and deprecated ledger retirement"
priority: "P1"
status: "review"
uuid: "clio-local-edn-service-providers-and-deprecated-ledger-retirement"
created_at: "2026-09-11T23:34:31.827Z"
---

Implement the canonical Clio EDN development path and retire eta-mu's active dependency on the deprecated event-ledger package.

Discovery: packages/clio already owns schema revisions, event identity, admission, ordering, replay and durable Node ledger writes. packages/protocols has 8 public protocols but its EDN adapter only covers legacy-envelope EventAdmission. Sol still imports the deprecated git dependency. Clio lacks a JVM host adapter needed by Epiphany.

Scope: preserve protocol contracts and existing Mongo/REST/Socket providers; add complete local EDN service implementations using Clio events and projections; add JVM host adapters sharing Clio laws; migrate Sol to Clio with explicitly configured durable local storage. Never silently fall back from a configured remote provider. Parent owns other Foresight repositories.

Delegation: JVM Clio host boundary and Sol cutover are disjoint agent slices. Protocol adapters and integration remain with the coordinating agent. Worktree: eta-mu-clio-dev, branch feat/clio-local-providers.

Acceptance: validate admission, replay after restart, identity conflict, fail-closed corrupt state, protocol CRUD/graph/labels/translations, local authentication semantics and subscriptions. Run relevant package suites, builds and zero-warning lint. Record any concrete blockers and known limitations. Existing protocol envelope is compatibility payload, never an alternative canonical ledger.

---
Implemented canonical Clio JVM/Node adapters and UUID/instant parity, all eight protocol EDN providers with selectable Mongo/per-service overrides, and Sol operational episode cutover. Deprecated git dependency/imports removed with regression guard and obsolete CI dependency reads retired. Clio tests BB24/63, JVM56/135, NBB+Shadow56/120; Sol132/570, server build/HTTP health; protocols60/167, ESM artifact restart/namespace smoke; package lint and compiler warnings zero. Full session/run mutable projection rebuilding and existing Rheos raw-board EDN import are explicitly follow-up scope, not claimed complete. No external provider fallback, no bulk workspace reinstall; frozen offline lock verified.

Final review repaired two query contracts: present nil now satisfies $exists true, and unknown query operators are refused even against empty projections. Added focused assertions; protocols61tests171assertions pass, test/lib compile and Kondo0warnings, ESM restart smoke remains green. Direct NBB source store/reopen/get also passed (protocols-clio-nbb-smoke). Follow-up commit only changes EDN query laws/implementation/tests and this provenance.

Documentation follow-up scope: reconcile current ROADMAP, root protocol ownership guidance and Rheos dependency/run guidance with canonical Clio and actual manifests; retain dated historical records and clearly distinguish raw-envelope board compatibility from deprecated package dependencies. Documentation-only validation checks references against current files and verifies whitespace; no source changes or additional broad tests.

Documentation reconciliation complete: ROADMAP now names Clio as canonical ledger owner and dates the preserved August board/copy surveys; root README names @open-hax/protocols and compatibility payload ownership; Rheos README matches actual dependencies/source paths and four-target npm build, while documenting its narrower BB build and retained raw-envelope adapter. New links and manifest claims verified, whitespace clean. No source changes.

Actual PR334 review follow-up: restrict canonical instants to the common four-digit Gregorian EDN range and verify tagged round trips; define a fail-closed JVM schema rename directory-sync contract. Root owns canonical.cljc and extern/jvm/fs.clj with boundary and cross-host regression tests. Existing accepted history is preserved.

PR334 Sol review scope delegated to clio_application_stores: after a canonical stale-slot conflict, re-read wire-ID admission and return only an identical committed envelope; changed or unrelated writes still fail. Clio root fixes now pass JVM60tests159assertions, BB25/75, NBB57/132 and compiled Shadow57/132; Shadow110files0warnings, Clio lint0errors0warnings. JVM/Node actually replay both Gregorian EDN boundary instants. Directory-force support is checked before atomic schema rename and forced afterward; unsupported directory sync is an explicit failure.

Sol PR334 review PRRT_kwDORu27H86huDcc: reproduced two failures when an identical wire envelope loses a real Clio stream-slot race. Recheck only canonical concurrent-stream-write and reuse the identical committed wrapper; changed wire payloads and competing causal roots remain explicit conflicts. Deterministic interleaving of two store handles uses real kernel admission. Final Sol test134/assert580 all green; lint0errors0warnings and contract-guard pass; server198files0warnings. Files packages/sol/src/cljs/open_hax/sol/infra/agent/clio_store.cljs and matching test. No other provider modified.

Codex PR334 durability P1 scope: reproduce missing Node schema-file/directory fsync through an observer of actual Node filesystem calls, then make schema temp writes, atomic publication, ledger initialization and newly created directory ancestry durable before dependent append can succeed. Preserve native inode locks and atomic rename; unsupported sync must refuse explicitly. Run failure-first Node tests, full NBB/Shadow suites, JVM interoperability and configured lint. Parent JVM70db0dc supplies the matching host contract.

PR334 Codex3995555023 Node fsync P1 repaired. Reliable failure-first native observer: 2 tests/7 assertions/7 failures; after fix full pnpm run test exit0 in53.088s: BB25/75 JVM61/164 NBB62/151 Shadow62/151, all zero failures/errors, Shadow115files0warnings. pnpm run lint0errors0warnings, extern boundary clean. File contents, empty ledger, atomic publication directories and new/existing retry ancestry now synchronize before dependent event acknowledgement. Real Node-created schema/event reopens under JVM with identical root and typed payload. Failure injection covers temp fsync, pre/postrename directories and ancestry retry. ptrace unavailable; proof is actual native-call sequencing/refusal and interoperability, not simulated physical power loss. Parent owns separate JVM ancestry-retry follow-up and its subsequent full gate.

Self-review found a durability retry gap in JVM ensure-dir!: an earlier mkdir could survive while its parent fsync failed, causing a retry to skip forcing already-present ancestry. A real injected-failure regression first failed (62 tests, 168 assertions, one failure), then passed after all ancestry is forced on every successful ensure-dir!. Full JVM final 62/168 zero failures/errors; package lint zero warnings/errors. Node durability counterpart bc6f105 separately passes native ordering and Node-to-JVM replay. Evidence clio-jvm-directory-retry-red and clio-jvm-directory-retry-green.

---